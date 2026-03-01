export default async function handler(req, res) {
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const log = (...args) => console.log(`[proxy:${requestId}]`, ...args)

  if (req.method !== 'GET') {
    log('Rejected method', req.method)
    res.status(405).send('Method Not Allowed')
    return
  }

  const target = req.query?.url
  if (!target || typeof target !== 'string') {
    log('Missing/invalid query param: url', { targetType: typeof target })
    res.status(400).send('Missing url query parameter')
    return
  }

  let parsed
  try {
    parsed = new URL(target)
  } catch {
    log('Invalid target URL', target)
    res.status(400).send('Invalid target URL')
    return
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    log('Rejected protocol', parsed.protocol)
    res.status(400).send('Only http/https URLs are allowed')
    return
  }

  const injectBaseTag = (html, pageUrl) => {
    const baseTag = `<base href="${pageUrl}">`
    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`)
    }
    return `<!doctype html><html><head>${baseTag}</head><body>${html}</body></html>`
  }

  const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN
  log('Incoming request', {
    target: parsed.toString(),
    hasCloudflareAccountId: Boolean(cloudflareAccountId),
    hasCloudflareApiToken: Boolean(cloudflareApiToken),
  })

  // Preferred path: Cloudflare Browser Rendering /content endpoint
  if (cloudflareAccountId && cloudflareApiToken) {
    try {
      log('Trying Cloudflare Browser Rendering /content endpoint')
      const cfResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/browser-rendering/content`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${cloudflareApiToken}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            url: parsed.toString(),
            gotoOptions: {
              waitUntil: 'networkidle2',
              timeout: 45000,
            },
          }),
        }
      )

      const cfPayload = await cfResponse.json()
      if (!cfResponse.ok || !cfPayload?.success || typeof cfPayload?.result !== 'string') {
        log('Cloudflare response failed validation', {
          status: cfResponse.status,
          ok: cfResponse.ok,
          success: cfPayload?.success,
          errors: cfPayload?.errors,
        })
        throw new Error('Cloudflare Browser Rendering request failed')
      }

      const html = injectBaseTag(cfPayload.result, parsed.toString())
      res.setHeader('content-type', 'text/html; charset=utf-8')
      res.setHeader('cache-control', 'no-store')
      res.setHeader('x-proxy-engine', 'cloudflare-browser-rendering')
      log('Cloudflare path success', { status: 200 })
      res.status(200).send(html)
      return
    } catch (error) {
      log('Cloudflare path failed, falling back to basic fetch', {
        message: error instanceof Error ? error.message : String(error),
      })
      // fall through to basic fetch proxy
    }
  } else {
    log('Cloudflare env not set, skipping Cloudflare path')
  }

  try {
    log('Trying basic fetch proxy')
    const upstream = await fetch(parsed.toString(), {
      redirect: 'follow',
      headers: {
        'user-agent': req.headers['user-agent'] || 'Mozilla/5.0',
        accept: req.headers.accept || '*/*',
      },
    })

    const contentType = upstream.headers.get('content-type') || 'text/html; charset=utf-8'
    const body = await upstream.text()

    res.setHeader('content-type', contentType)
    res.setHeader('cache-control', 'no-store')
    res.setHeader('x-proxy-engine', 'basic-fetch')

    // Best effort: make relative links work for rendered document in iframe
    const baseInjectedBody = injectBaseTag(body, parsed.toString())

    log('Basic fetch success', {
      upstreamStatus: upstream.status,
      contentType,
    })
    res.status(upstream.status).send(baseInjectedBody)
  } catch (error) {
    log('Basic fetch failed', {
      message: error instanceof Error ? error.message : String(error),
    })
    res.status(502).send('Proxy failed to fetch upstream content')
  }
}
