import { useState, useEffect } from 'react'

/**
 * BatteryIcon component - displays battery level with charging indicator
 */
function BatteryIcon({ level, charging }) {
  const filled = Math.round((level / 100) * 4)
  const col = level > 20 ? '#ffffff' : '#ff6b6b'

  return (
    <div
      className="tb-battery"
      title={`${level}%${charging ? ' · Charging' : ''}`}
    >
      <div className="tb-battery-body" style={{ borderColor: col }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="tb-battery-bar"
            style={{
              background: i < filled ? col : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
      <div className="tb-battery-cap" style={{ background: col }} />
      {charging && <span className="tb-battery-bolt">⚡</span>}
    </div>
  )
}

/**
 * WifiIcon component - displays WiFi signal icon
 */
function WifiIcon() {
  return (
    <svg
      className="tb-icon"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="white"
      opacity="0.85"
      title="Wi-Fi"
    >
      <path d="M1.5 8.5C5.2 4.7 10.4 3 12 3s6.8 1.7 10.5 5.5l-2 2C17.7 7.7 14.8 6 12 6S6.3 7.7 3.5 10.5l-2-2zm10.5 2c-1.7 0-3.2.7-4.2 1.8l2 2c.5-.5 1.3-.8 2.2-.8s1.7.3 2.2.8l2-2C15.2 12.7 13.7 12 12 12zm0-5C8.7 7 5.7 8.3 3.5 10.5l2 2C7.2 10.8 9.5 10 12 10s4.8.8 6.5 2.5l2-2C18.3 8.3 15.3 7 12 7zm0 10c-.6 0-1.1.2-1.5.6L12 19l1.5-1.4c-.4-.4-.9-.6-1.5-.6z" />
    </svg>
  )
}

/**
 * VolumeIcon component - displays volume icon
 */
function VolumeIcon() {
  return (
    <svg
      className="tb-icon"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="white"
      opacity="0.85"
      title="Volume"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

/**
 * NotifIcon component - displays notification icon
 */
function NotifIcon() {
  return (
    <svg
      className="tb-icon"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="white"
      opacity="0.85"
      title="Notifications"
    >
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63 -5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  )
}

/**
 * Taskbar component - bottom panel with start button, open windows, and system tray
 */
export default function Taskbar({
  onStartClick,
  onLock,
  windows,
  onWindowClick,
  focusedId,
}) {
  const [battery, setBattery] = useState(null)
  const [time, setTime] = useState(new Date())
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications] = useState([
    { id: 1, app: 'System', text: 'Welcome to ReactOS!', time: 'Just now', icon: '💻' },
    { id: 2, app: 'Security', text: 'Your device is protected.', time: '2m ago', icon: '🛡️' },
    { id: 3, app: 'Updates', text: 'System is up to date.', time: '15m ago', icon: '✅' },
  ])

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Get battery status if available
  useEffect(() => {
    if (!('getBattery' in navigator)) return

    navigator.getBattery().then((bat) => {
      const update = () =>
        setBattery({
          level: Math.round(bat.level * 100),
          charging: bat.charging,
        })

      update()
      bat.addEventListener('levelchange', update)
      bat.addEventListener('chargingchange', update)

      return () => {
        bat.removeEventListener('levelchange', update)
        bat.removeEventListener('chargingchange', update)
      }
    })
  }, [])

  const shortTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
  const shortDate = time.toLocaleDateString([], {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="taskbar">
      <div className="taskbar-start">
        <button className="start-button" onClick={onStartClick}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
          Start
        </button>
      </div>

      <div className="taskbar-apps">
        {windows.map((win) => (
          <button
            key={win.id}
            className={`taskbar-app ${win.minimized ? 'minimized' : ''} ${focusedId === win.id ? 'active' : ''}`}
            onClick={() => onWindowClick(win.id)}
            title={win.title}
          >
            {win.icon && <span className="taskbar-app-icon">{win.icon}</span>}
            {win.title}
          </button>
        ))}
      </div>

      <div className="taskbar-tray">
        <WifiIcon />
        <VolumeIcon />
        {battery && (
          <BatteryIcon level={battery.level} charging={battery.charging} />
        )}
        <button className="tb-notif-btn" onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen) }}>
          <NotifIcon />
          {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
        </button>
        <div className="taskbar-clock">
          <span className="tb-time">{shortTime}</span>
          <span className="tb-date">{shortDate}</span>
        </div>
        <button className="taskbar-lock" onClick={onLock}>
          🔒
        </button>
      </div>

      {/* Notification Center */}
      {notifOpen && (
        <div className="notif-center" onClick={(e) => e.stopPropagation()}>
          <div className="notif-header">
            <h3>Notifications</h3>
            <button className="notif-clear" onClick={() => setNotifOpen(false)}>✕</button>
          </div>
          <div className="notif-list">
            {notifications.map((n) => (
              <div key={n.id} className="notif-item">
                <span className="notif-icon">{n.icon}</span>
                <div className="notif-content">
                  <div className="notif-app">{n.app}</div>
                  <div className="notif-text">{n.text}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="notif-footer">
            <span>{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      )}
    </div>
  )
}

