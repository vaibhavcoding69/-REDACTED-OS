import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import proxyHandler from './api/proxy.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Ensure process.env is populated for the proxy handler
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'configure-server',
        configureServer(server) {
          server.middlewares.use('/api/proxy', (req, res, next) => {
            // Polyfill Vercel/Express-like methods
            res.status = (code) => {
              res.statusCode = code
              return res
            }
            res.send = (body) => {
              res.end(body)
            }
            
            // Parse query string
            const url = new URL(req.url, `http://${req.headers.host}`)
            req.query = Object.fromEntries(url.searchParams)

            // Execute handler
            proxyHandler(req, res).catch(err => {
              console.error('Proxy handler error:', err)
              res.statusCode = 500
              res.end('Internal Server Error')
            })
          })
        }
      }
    ],
  }
})
