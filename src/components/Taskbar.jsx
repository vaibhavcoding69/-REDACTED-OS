import { useState, useEffect } from 'react'
import { MdSignalCellularAlt, MdVolumeUp, MdNotifications, MdLock, MdMenu } from 'react-icons/md'

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
    <MdSignalCellularAlt
      className="tb-icon"
      size={17}
      title="Wi-Fi"
    />
  )
}

/**
 * VolumeIcon component - displays volume icon
 */
function VolumeIcon() {
  return (
    <MdVolumeUp
      className="tb-icon"
      size={17}
      title="Volume"
    />
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
          <MdMenu size={16} style={{ marginRight: '4px' }} />
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
            {win.icon && (
              <span className="taskbar-app-icon">
                {typeof win.icon === 'function' ? <win.icon size={16} /> : win.icon}
              </span>
            )}
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
          <MdLock size={16} />
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

