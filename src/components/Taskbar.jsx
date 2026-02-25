import { useState, useEffect } from 'react'
import { MdNotifications, MdSearch } from 'react-icons/md'

/**
 * Taskbar component - Windows 11 style bottom panel
 */
export default function Taskbar({
  onStartClick,
  onQuickSettingsClick,
  onCalendarClick,
  onLock,
  windows,
  onWindowClick,
  focusedId,
  pinnedApps = [],
  onTogglePin = () => {},
  onLaunchApp = () => {},
}) {
  const [battery, setBattery] = useState(null)
  const [time, setTime] = useState(new Date())
  const [hiddenIconsOpen, setHiddenIconsOpen] = useState(false)
  const [animatingIcons, setAnimatingIcons] = useState(new Set())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!('getBattery' in navigator)) return
    navigator.getBattery().then((bat) => {
      const update = () =>
        setBattery({ level: Math.round(bat.level * 100), charging: bat.charging })
      update()
      bat.addEventListener('levelchange', update)
      bat.addEventListener('chargingchange', update)
      return () => {
        bat.removeEventListener('levelchange', update)
        bat.removeEventListener('chargingchange', update)
      }
    })
  }, [])

  // Track icon animations when new windows open
  useEffect(() => {
    const newAnimatingIcons = new Set()
    windows.forEach((win) => {
      if (win.openAt && Date.now() - win.openAt < 220) {
        newAnimatingIcons.add(win.id)
      }
    })
    setAnimatingIcons(newAnimatingIcons)
  }, [windows])

  const shortTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const shortDate = time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })

  // tick to highlight newly opened windows (simple approach)
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 220)
    return () => clearInterval(t)
  }, [])

  const [ctxMenu, setCtxMenu] = useState({ open: false, x: 0, y: 0, win: null })

  const handleContext = (e, winOrPinned) => {
    e.preventDefault()
    setCtxMenu({ open: true, x: e.clientX, y: e.clientY, win: winOrPinned })
  }

  const closeCtx = () => setCtxMenu({ open: false, x: 0, y: 0, win: null })

  return (
    <>
      <div className="taskbar">
      {/* Left section contains a small weather summary (static placeholder) */}
      <div className="taskbar-left">
        <div className="tb-weather" title="Weather">
          <span className="tb-weather-icon">🌤️</span>
          <div className="tb-weather-info">
            <span className="tb-weather-temp">13°C</span>
            <span className="tb-weather-desc">Partly sunny</span>
          </div>
        </div>
      </div>

      {/* Center section – start button plus icons for pinned apps and open windows */}
      <div className="taskbar-center">
        <button className="taskbar-btn" title="Search">
          <MdSearch size={20} />
        </button>

        <button className="start-button" onClick={onStartClick} title="Start">
          <img src="https://img.icons8.com/fluency/48/windows-11.png" alt="Windows" width={24} height={24} />
        </button>

        {/* icons container lives next to the start button */}
        <div className="taskbar-icons">
          {pinnedApps.map((app) => {
            const hasWindow = windows.some((w) => w.appId === app.id && !w.minimized)
            return (
              <button
                key={app.id}
                className={`taskbar-btn taskbar-pinned ${hasWindow ? 'active' : ''}`}
                onClick={() => {
                  if (hasWindow) {
                    const existing = windows.find((w) => w.appId === app.id)
                    if (existing) onWindowClick(existing.id)
                  } else {
                    onLaunchApp(app)
                  }
                }}
                onContextMenu={(e) => handleContext(e, app)}
                title={app.name}
              >
                {app.icon ? <img src={app.icon} alt={app.name} /> : app.name[0]}
                {hasWindow && <div className="taskbar-indicator" />}
              </button>
            )
          })}

          {windows.map((win) => {
            const active = win.id === focusedId
            const animating = animatingIcons.has(win.id)
            return (
              <button
                key={win.id}
                className={`taskbar-btn taskbar-app ${active ? 'active' : ''} ${win.minimized ? 'minimized' : ''} ${animating ? 'icon-animating' : ''}`}
                onClick={() => onWindowClick(win.id)}
                onContextMenu={(e) => handleContext(e, win)}
                title={win.title}
              >
                <div className="taskbar-app-icon">
                  {win.icon ? (
                    <img src={win.icon} alt={win.title} />
                  ) : (
                    <span style={{ fontSize: '16px' }}>⌘</span>
                  )}
                </div>
                <div className="taskbar-indicator" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Right - System tray */}
      <div className="taskbar-right">
        {/* WiFi, Battery, Speaker section */}
        <div className="system-icons-section" onClick={onQuickSettingsClick} title="Network, Volume, Battery">
          {/* WiFi icon */}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white" title="Wi-Fi">
            <path d="M1 9l2 2c2.9-2.9 6.9-4.7 11-4.7s8.1 1.8 11 4.7l2-2C23.9 5.7 18.3 3 12 3S.1 5.7 1 9zm4 4 2 2c1.6-1.6 3.8-2.6 6-2.6s4.4 1 6 2.6l2-2C19.1 11 15.7 9.4 12 9.4s-7.1 1.6-9 3.6zm4 4 3 3 3-3a4.237 4.237 0 0 0-3-1.2c-1.1 0-2.2.4-3 1.2z"/>
          </svg>
          {/* Battery icon */}
          {battery && (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white" title={`Battery: ${battery.level}%`}>
              <rect x="2" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
              <rect x="20" y="9" width="2" height="6" rx="1" fill="white"/>
              <rect x="4" y="8" width={Math.round(14 * battery.level / 100)} height="8" rx="1" fill={battery.level <= 20 ? '#ff4444' : '#00cc66'}/>
            </svg>
          )}
          {/* Speaker icon */}
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white" title="Volume">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
          {/* Notification and Date section */}
          <div className="notification-date-section" onClick={onCalendarClick} title="Calendar">
            <span className="tb-time">{shortTime}</span>
            <span className="tb-date">{shortDate}</span>
          </div>
        </div>
      </div>
    </div>
  
    {ctxMenu.open && (
        <div
          className="taskbar-context"
          style={{ left: ctxMenu.x, top: ctxMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* toggle pin/unpin; windows and pinned items share same id field */}
          <div
            className="ctx-item"
            onClick={() => {
              if (ctxMenu.win) {
                onTogglePin(ctxMenu.win)
              }
              closeCtx()
            }}
          >
            {ctxMenu.win && pinnedApps.find((p) => p.id === ctxMenu.win.id)
              ? 'Unpin from taskbar'
              : 'Pin to taskbar'}
          </div>
        </div>
      )}
    </>
  )
}
