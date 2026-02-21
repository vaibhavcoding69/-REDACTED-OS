import { useState, useEffect, useCallback } from 'react'

const MARKETS_SEED = [
  { name: 'S&P 500', base: 5241.53, change: +0.32 },
  { name: 'DOW',     base: 39781.37, change: +0.68 },
  { name: 'NASDAQ',  base: 16401.84, change: +0.20 },
]

const NBA_GAMES = [
  { time: '04:30 AM', team1: { name: 'Pelicans', logo: '🏀' }, team2: { name: 'Kings',   logo: '👑' } },
  { time: '04:30 AM', team1: { name: 'Magic',    logo: '🪄' }, team2: { name: 'Wizards', logo: '🧙' } },
]

const FORECAST = [
  { day: 'Today', high: 92, low: 79, icon: '⛅' },
  { day: 'Sat',   high: 88, low: 76, icon: '🌤️' },
  { day: 'Sun',   high: 84, low: 73, icon: '🌧️' },
  { day: 'Mon',   high: 90, low: 77, icon: '☀️' },
]

const BG_IMAGES = [
  '/bg1.jpg',
  '/bg2.jpg',
  '/bg3.jpg',
  '/bg4.jpg',
]

function formatClock(d) {
  let h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  h = h % 12 || 12
  return `${h}:${m}`
}

function formatDate(d) {
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

function jitter(val, spread) {
  return parseFloat((val + (Math.random() - 0.5) * spread).toFixed(2))
}

function WeatherCard() {
  const [temp,      setTemp]      = useState(83)
  const [condition, setCondition] = useState('Partly cloudy')
  const [location,  setLocation]  = useState('My City')
  const [loading,   setLoading]   = useState(true)
  const [unit,      setUnit]      = useState('F')

  useEffect(() => {
    let cancelled = false
    const WMO = {
      0:'Clear sky',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',
      45:'Foggy',51:'Light drizzle',61:'Rain',71:'Snow',
      80:'Rain showers',95:'Thunderstorm',
    }
    const nearest = (code) => {
      const keys = Object.keys(WMO).map(Number).sort((a,b)=>a-b)
      const k = keys.reduce((p,c)=>Math.abs(c-code)<Math.abs(p-code)?c:p, keys[0])
      return WMO[k] || 'Clear sky'
    }
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        try {
          const r  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&temperature_unit=fahrenheit`)
          const d  = await r.json()
          if (!cancelled && d?.current_weather) {
            setTemp(Math.round(d.current_weather.temperature))
            setCondition(nearest(d.current_weather.weathercode))
          }
          const gr = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`)
          const gd = await gr.json()
          if (!cancelled) setLocation(gd?.address?.suburb || gd?.address?.city || gd?.address?.town || 'My City')
        } catch {}
        finally { if (!cancelled) setLoading(false) }
      }, () => { if (!cancelled) setLoading(false) })
    } else { setLoading(false) }
    return () => { cancelled = true }
  }, [])

  const displayTemp = unit === 'F' ? temp : Math.round((temp - 32) * 5 / 9)
  const wcl = condition.toLowerCase()
  const icon = wcl.includes('rain') || wcl.includes('shower') ? '🌧️'
    : wcl.includes('snow')    ? '🌨️'
    : wcl.includes('thunder') ? '⛈️'
    : wcl.includes('fog')     ? '🌫️'
    : wcl.includes('cloud') || wcl.includes('overcast') ? '⛅'
    : '☀️'

  return (
    <div className="w11-card w11-weather-card">
      <div className="w11-card-location">
        <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
        </svg>
        {loading ? 'Locating…' : location}
      </div>
      <div className="w11-weather-main">
        <span className="w11-weather-icon">{icon}</span>
        <span className="w11-weather-temp">
          {loading ? '–' : displayTemp}
          <sup className="w11-weather-unit">°{unit}</sup>
        </span>
      </div>
      <div className="w11-weather-cond">{condition}</div>
      <div className="w11-weather-range">{FORECAST[0].high}° / {FORECAST[0].low}°</div>
      <div className="w11-forecast-row">
        {FORECAST.map((f, i) => (
          <div key={i} className="w11-fc-day">
            <span className="w11-fc-label">{f.day}</span>
            <span className="w11-fc-icon">{f.icon}</span>
            <span className="w11-fc-temp">{f.high}°</span>
          </div>
        ))}
      </div>
      <button
        className="w11-unit-toggle"
        onClick={(e) => { e.stopPropagation(); setUnit(u => u === 'F' ? 'C' : 'F') }}
        title="Switch temperature unit"
      >
        °{unit === 'F' ? 'C' : 'F'}
      </button>
      <div className="w11-card-link">See full forecast</div>
    </div>
  )
}

function MarketsCard() {
  const [markets, setMarkets] = useState(MARKETS_SEED.map(m => ({ ...m })))

  useEffect(() => {
    const id = setInterval(() => {
      setMarkets(prev => prev.map(m => ({
        ...m,
        value:  jitter(m.base, 4),
        change: parseFloat((m.change + (Math.random() - 0.5) * 0.06).toFixed(2)),
      })))
    }, 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w11-card w11-markets-card">
      <div className="w11-card-title">Markets</div>
      <div className="w11-markets-list">
        {markets.map((m, i) => (
          <div key={i} className="w11-market-row">
            <span className="w11-market-name">{m.name}</span>
            <span className={`w11-market-change ${m.change >= 0 ? 'w11-up' : 'w11-down'}`}>
              {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
            </span>
            <span className="w11-market-val">
              {(m.value ?? m.base).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
      <div className="w11-card-link">See more in markets</div>
    </div>
  )
}

function TrendingCard() {
  return (
    <div className="w11-card w11-trending-card">
      <div className="w11-card-title">Trending in NBA</div>
      <div className="w11-games-list">
        {NBA_GAMES.map((g, i) => (
          <div key={i} className="w11-game-block">
            <div className="w11-game-time">{g.time}</div>
            <div className="w11-game-teams">
              <div className="w11-team">
                <span className="w11-team-logo">{g.team1.logo}</span>
                <span className="w11-team-name">{g.team1.name}</span>
                <span className="w11-team-score">0</span>
              </div>
              <div className="w11-team">
                <span className="w11-team-logo">{g.team2.logo}</span>
                <span className="w11-team-name">{g.team2.name}</span>
                <span className="w11-team-score">0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w11-card-link">See more in NBA</div>
    </div>
  )
}

export default function LockScreen({ onUnlock, unlocking }) {
  const [time,      setTime]      = useState(new Date())
  const [showCards, setShowCards] = useState(false)
  const [bgIdx,     setBgIdx]     = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => setShowCards(true), 500)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setBgIdx(i => (i + 1) % BG_IMAGES.length)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  const handleUnlock = useCallback(() => {
    if (onUnlock) onUnlock()
  }, [onUnlock])

  useEffect(() => {
    const onKey = (e) => { if (e.key !== 'Escape') handleUnlock() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleUnlock])

  return (
    <div
      className={`w11-lock${unlocking ? ' w11-lock--out' : ''}`}
      onClick={handleUnlock}
      role="button"
      tabIndex={0}
      aria-label="Lock screen"
      style={{ backgroundImage: `url(${BG_IMAGES[bgIdx]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="w11-bg" aria-hidden="true" />
      <div className="w11-clock-area">
        <div className="w11-time">{formatClock(time)}</div>
        <div className="w11-date">{formatDate(time)}</div>
      </div>
      <div
        className={`w11-cards-row${showCards ? ' w11-cards-row--in' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <WeatherCard />
        <MarketsCard />
        <TrendingCard />
      </div>
      <div className="w11-status-bar" onClick={e => e.stopPropagation()}>
        <button className="w11-status-btn" title="Network" aria-label="Network">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M1 9l2 2c2.9-2.9 6.9-4.7 10.8-4.7S20.1 8.1 23 11l2-2C21.2 5.1 16.9 3 12 3S2.8 5.1 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4 2 2a7.074 7.074 0 0 1 10 0l2-2C15.7 9.7 11.5 8.5 8 11c-.8.7-2 1.7-2.5 2z"/>
          </svg>
        </button>
        <button className="w11-status-btn" title="Accessibility" aria-label="Accessibility">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
          </svg>
        </button>
      </div>
      {!unlocking && (
        <div className="w11-signin-hint">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white" opacity="0.6">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
          <span>Click or press any key to sign in</span>
        </div>
      )}
    </div>
  )
}