import { useState, useEffect, useCallback } from 'react'
import { 
  MdCloud, 
  MdWbSunny, 
  MdThunderstorm, 
  MdCloudQueue, 
  MdLocationOn,
  MdTrendingUp,
  MdTrendingDown,
  MdSportsBasketball,
  MdOutlineInsights
} from 'react-icons/md'
const MARKETS_SEED = [
  { name: 'S&P 500', base: 5241.53, change: +0.32 },
  { name: 'NASDAQ',  base: 16401.84, change: +0.20 },
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
  const [temp, setTemp] = useState(83)
  const [location, setLocation] = useState('New York')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="w11-card">
      <div className="w11-card-header">
        <MdLocationOn size={14} />
        {loading ? 'Locating...' : location}
      </div>
      <div className="w11-card-content">
        <div className="w11-weather-simplified">
          <MdWbSunny className="w11-icon" color="#FFD700" />
          <div className="w11-weather-info">
            <span className="w11-weather-degree">{temp}°</span>
            <span className="w11-weather-label">Sunny</span>
          </div>
        </div>
      </div>
      <div className="w11-card-footer">H: 88° L: 74°</div>
    </div>
  )
}
function MarketsCard() {
  const [markets, setMarkets] = useState(MARKETS_SEED.map(m => ({ ...m })))
  useEffect(() => {
    const id = setInterval(() => {
      setMarkets(prev => prev.map(m => ({
        ...m,
        value: jitter(m.base, 2),
        change: parseFloat((m.change + (Math.random() - 0.5) * 0.04).toFixed(2)),
      })))
    }, 5000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="w11-card">
      <div className="w11-card-header">
        <MdOutlineInsights size={14} />
        Markets
      </div>
      <div className="w11-card-content">
        <div className="w11-markets-mini">
          {markets.map((m, i) => (
            <div key={i} className="w11-market-item">
              <span>{m.name}</span>
              <span className={`w11-m-change ${m.change >= 0 ? 'w11-up' : 'w11-down'}`}>
                {m.change >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                {Math.abs(m.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="w11-card-footer">Real-time updates</div>
    </div>
  )
}
function TrendingCard() {
  return (
    <div className="w11-card">
      <div className="w11-card-header">
        <MdSportsBasketball size={14} />
        NBA
      </div>
      <div className="w11-card-content">
        <div className="w11-trending-mini">
          <div className="w11-game-mini">
            <span className="w11-mini-logo">🏀</span>
            <span>Lakers vs Warriors</span>
          </div>
          <div className="w11-game-mini">
            <span className="w11-mini-logo">☘️</span>
            <span>Celtics vs Heat</span>
          </div>
        </div>
      </div>
      <div className="w11-card-footer">Tonight, 7:30 PM</div>
    </div>
  )
}
export default function LockScreen({ onUnlock, unlocking }) {
  const [time, setTime] = useState(new Date())
  const [showCards, setShowCards] = useState(false)
  const [isFullyUnlocked, setIsFullyUnlocked] = useState(false)
  useEffect(() => {
    if (unlocking === 'desktop') {
      const timer = setTimeout(() => setIsFullyUnlocked(true), 650)
      return () => clearTimeout(timer)
    }
  }, [unlocking])
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const id = setTimeout(() => setShowCards(true), 600)
    return () => clearTimeout(id)
  }, [])
  const handleUnlock = useCallback(() => {
    if (onUnlock && !unlocking) onUnlock()
  }, [onUnlock, unlocking])
  useEffect(() => {
    const onKey = (e) => { 
      if (e.key !== 'Escape' && !unlocking) handleUnlock() 
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleUnlock, unlocking])
  if (isFullyUnlocked) return null
  return (
    <div
      className={`w11-lock ${unlocking === true ? 'w11-blurred' : ''} ${unlocking === 'desktop' ? 'w11-lock--out' : ''}`}
      onClick={handleUnlock}
      role="button"
      tabIndex={0}
      aria-label="Lock screen"
    >
      <div 
        className="w11-lock-bg-container" 
        style={{ backgroundImage: `url('/pexels-zhanqun-cai-1507025-3998488.jpg')` }}
        aria-hidden="true" 
      />
      <div className="w11-clock-area">
        <div className="w11-time">{formatClock(time)}</div>
        <div className="w11-date">{formatDate(time)}</div>
      </div>
      <div className={`w11-cards-row ${showCards ? 'w11-cards-row--in' : ''}`}>
        <WeatherCard />
        <MarketsCard />
        <TrendingCard />
      </div>
      <div className="w11-status-bar" onClick={e => e.stopPropagation()}>
        <button className="w11-status-btn" title="Network">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
            <path d="M1 9l2 2c2.9-2.9 6.9-4.7 10.8-4.7S20.1 8.1 23 11l2-2C21.2 5.1 16.9 3 12 3S2.8 5.1 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4 2 2a7.074 7.074 0 0 1 10 0l2-2C15.7 9.7 11.5 8.5 8 11c-.8.7-2 1.7-2.5 2z"/>
          </svg>
        </button>
        <button className="w11-status-btn" title="Accessibility">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="white">
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
          </svg>
        </button>
      </div>
      {!unlocking && (
        <div className="w11-signin-hint">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white" opacity="0.6">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
          <span>Click to sign in</span>
        </div>
      )}
    </div>
  )
}