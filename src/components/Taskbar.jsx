import { useState, useEffect } from 'react'
import { MdSignalCellularAlt, MdVolumeUp, MdNotifications, MdLock, MdMenu } from 'react-icons/md'

/**
 * BatteryIcon component - displays battery level with charging indicator
 */
function BatteryIcon({ level, charging }) {
  return (
    <div
      className="tb-battery-modern"
      title={`${level}%${charging ? ' · Charging' : ''}`}
    >
      <div className="battery-outline">
        <div 
          className={`battery-fill ${level <= 20 ? 'low' : ''}`}
          style={{ width: `${level}%` }} 
        />
        {charging && (
          <div className="battery-bolt-modern">
            <svg viewBox="0 0 24 24" width="8" height="8" fill="white">
              <path d="M11 21h-1l1-7H7.5c-.8 0-1.2-.5-.9-1.2.3-.7 1.2-1.8 2.7-3.3s2.9-3.2 2.9-3.2h1l-1 7h3.5c.8 0 1.2.5.9 1.2-.3.7-5.6 10.8-5.6 10.8z"/>
            </svg>
          </div>
        )}
      </div>
      <div className="battery-cap-modern" />
    </div>
  )
}

/**
 * WifiIcon component - displays WiFi signal icon
 */
function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" opacity="0.9" title="Wi-Fi">
      <path d="M1 9l2 2c2.9-2.9 6.9-4.7 11-4.7s8.1 1.8 11 4.7l2-2C23.9 5.7 18.3 3 12 3S.1 5.7 1 9zm4 4 2 2c1.6-1.6 3.8-2.6 6-2.6s4.4 1 6 2.6l2-2C19.1 11 15.7 9.4 12 9.4s-7.1 1.6-9 3.6zm4 4 3 3 3-3a4.237 4.237 0 0 0-3-1.2c-1.1 0-2.2.4-3 1.2z"/>
    </svg>
  )
}

/**
 * VolumeIcon component - displays volume icon
 */
function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" opacity="0.9" title="Volume">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  )
}

/**
 * NotifIcon component - displays notification icon
 */
function NotifIcon() {
  return (
    <MdNotifications
      className="tb-icon"
      size={17}
      title="Notifications"
    />
  )
}

/**
 * Taskbar component - bottom panel with start button, open windows, and system tray
 */
export default function Taskbar({
  onStartClick,
  onQuickSettingsClick,
  onCalendarClick,
  onLock,
  windows,
  onWindowClick,
  focusedId,
}) {
  const [battery, setBattery] = useState(null)
  const [time, setTime] = useState(new Date())
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications] = useState([
    { id: 1, app: 'System', text: 'Welcome to [REDACTED]OS!', time: 'Just now', icon: '💻' },
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
      <div className="taskbar-left-dummy" />

      <div className="taskbar-center-box">
        <button className="start-button" onClick={onStartClick} title="Start">
          <img src="https://img.icons8.com/fluency/48/windows-11.png" alt="Start" width={28} height={28} />
        </button>

        <div className="taskbar-apps">
          {windows.map((win) => (
            <button
              key={win.id}
              className={`taskbar-app ${win.minimized ? 'minimized' : ''} ${focusedId === win.id ? 'active' : ''}`}
              onClick={() => onWindowClick(win.id)}
              title={win.title}
            >
              <div className="taskbar-app-inner">
                {win.icon && (
                  <span className="taskbar-app-icon">
                    {typeof win.icon === 'function' ? (
                      <win.icon size={22} />
                    ) : typeof win.icon === 'string' && win.icon.startsWith('http') ? (
                      <img src={win.icon} alt={win.title} width={24} height={24} />
                    ) : (
                      <span style={{ fontSize: '20px' }}>{win.icon}</span>
                    )}
                  </span>
                )}
                <div className="taskbar-indicator" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="taskbar-tray">
        <div className="tray-collapse-btn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="white" opacity="0.7">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
        </div>
        <div className="tray-status-group" onClick={onQuickSettingsClick}>
          <WifiIcon />
          <VolumeIcon />
          {battery && (
            <BatteryIcon level={battery.level} charging={battery.charging} />
          )}
        </div>
        <div className="taskbar-clock" onClick={onCalendarClick}>
          <span className="tb-time">{shortTime}</span>
          <span className="tb-date">{shortDate}</span>
        </div>
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
                <span className="notif-icon">{n.emoji}</span>
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

