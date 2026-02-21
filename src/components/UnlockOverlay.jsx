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
  }

  return (
    <div className="unlock-overlay" onClick={(e) => e.stopPropagation()}>
      <div className={`unlock-panel ${shake ? 'shake' : ''} ${loading ? 'loading' : ''}`}>
        <div className="ul-avatar-large">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>

        <div className="ul-username">Tenzin</div>

        <form className="ul-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            placeholder="PIN"
            className="ul-pin-input"
            autoComplete="off"
            disabled={loading}
            maxLength="6"
          />
        </form>

        {error && <div className="ul-error">{error}</div>}

        <button className="ul-forgot-btn" onClick={onCancel}>
          I forgot my PIN
        </button>

        <button className="ul-back" onClick={onCancel}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
          Back
        </button>
      </div>
    </div>
  )
}

