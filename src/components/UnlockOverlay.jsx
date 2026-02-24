import { useState, useRef, useEffect } from 'react'

export default function UnlockOverlay({ onUnlock, onCancel }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (loading) return

    if (pin === '' || pin === '1234') {
      setLoading(true)
      setTimeout(onUnlock, 400)
    } else {
      setError('The PIN is incorrect. Please try again.')
      setShake(true)
      setPin('')
      setTimeout(() => {
        setShake(false)
        inputRef.current?.focus()
      }, 600)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="unlock-overlay" onClick={(e) => e.stopPropagation()}>
      <div className={`unlock-panel ${shake ? 'shake' : ''} ${loading ? 'loading' : ''}`}>

        {/* Avatar */}
        <div className="ul-avatar-large">
          <img 
            src="https://avatars.githubusercontent.com/u/189115938?v=4&size=64" 
            alt="User Avatar"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ display: 'none' }}>
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>

        {/* Username */}
        <div className="ul-username">[REDACTED]</div>

        {/* PIN input with submit arrow */}
        <form className="ul-form" onSubmit={handleSubmit}>
          <div className="ul-input-row">
            <input
              ref={inputRef}
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="PIN"
              className="ul-pin-input"
              autoComplete="off"
              disabled={loading}
              maxLength="6"
            />
          </div>
          <button type="submit" className="ul-submit-btn" disabled={loading} aria-label="Sign in">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </form>

        {error && <div className="ul-error">{error}</div>}
      </div>

      {/* Back arrow — bottom left */}
      <button className="ul-back" onClick={onCancel} type="button">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back
      </button>
    </div>
  )
}
