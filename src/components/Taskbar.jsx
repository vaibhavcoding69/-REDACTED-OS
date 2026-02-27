import { useState, useEffect } from 'react'
import { MdNotifications, MdSearch, MdWifi, MdVolumeUp, MdOutlineGridView, MdDashboard } from 'react-icons/md'
export default function Taskbar({
  onStartClick,
  onQuickSettingsClick,
  onCalendarClick,
  onNotificationsClick,
  onLock,
  windows,
  onWindowClick,
  focusedId,
  pinnedApps = [],
  onTogglePin = () => {},
  onLaunchApp = () => {},
  onShowDesktop = () => {},
}) {
  const [battery, setBattery] = useState(null)
  const [time, setTime] = useState(new Date())
  const [wifiName, setWifiName] = useState('WiFi')

  useEffect(() => {
    if ('connection' in navigator) {
       const conn = navigator.connection;
       // The API doesn't provide SSID, but we can detect type
       if(conn.type === 'wifi' || conn.effectiveType === '4g') {
          setWifiName('Connected (WiFi)'); // Effective type 4g usually means good connection, often treated as wifi-like in desktop contexts if type is missing
       } else if(conn.type === 'cellular') {
          setWifiName('Connected (Cellular)');
       } else if (conn.type === 'ethernet') {
          setWifiName('Connected (Ethernet)');
       } else {
         setWifiName('Network Connected');
       }
       
       const updateConnection = () => {
          if(navigator.onLine) {
            setWifiName('Connected');
            if (conn.type === 'wifi') setWifiName('Connected (WiFi)');
          } else {
            setWifiName('No Internet');
          }
       }

       conn.addEventListener('change', updateConnection);
       window.addEventListener('online', updateConnection);
       window.addEventListener('offline', updateConnection);

       return () => {
         conn.removeEventListener('change', updateConnection);
         window.removeEventListener('online', updateConnection);
         window.removeEventListener('offline', updateConnection);
       }
    } else {
        // Fallback for browsers without navigator.connection
        const updateOnlineStatus = () => setWifiName(navigator.onLine ? 'Connected' : 'No Internet');
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        }
    }
  }, [])

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
  const shortTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const shortDate = time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })
  const [ctxMenu, setCtxMenu] = useState({ open: false, x: 0, y: 0, win: null })
  const handleContext = (e, winOrPinned) => {
    e.preventDefault()
    setCtxMenu({ open: true, x: e.clientX, y: e.clientY, win: winOrPinned })
  }
  const closeCtx = () => setCtxMenu({ open: false, x: 0, y: 0, win: null })
  useEffect(() => {
    if (!ctxMenu.open) return
    const handler = () => closeCtx()
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [ctxMenu.open])
  const pinnedIds = new Set(pinnedApps.map((p) => p.id))
  const unpinnedWindows = windows.filter((w) => !pinnedIds.has(w.appId))
  return (
    <>
      <div className="taskbar" onMouseDown={(e) => e.stopPropagation()}>
        {}
        {}
        {}
        <div className="taskbar-center">
          <button className="start-button" onClick={onStartClick} title="Start">
            <img src="https://img.icons8.com/fluency/48/windows-11.png" alt="Windows" width={24} height={24} />
          </button>
          <div className="taskbar-icons" style={{ display: 'flex' }}>
            {}
            {pinnedApps.map((app) => {
              const openWin = windows.find((w) => w.appId === app.id)
              const hasWindow = !!openWin  // Show indicator if window exists, even if minimized
              const isActive = openWin && openWin.id === focusedId && !openWin.minimized
              return (
                <button
                  key={`pin-${app.id}`}
                  className={`taskbar-btn taskbar-app ${isActive ? 'active' : ''} ${hasWindow ? 'has-window' : ''}`}
                  onClick={() => {
                    if (openWin) {
                      onWindowClick(openWin.id)
                    } else {
                      onLaunchApp(app)
                    }
                  }}
                  onContextMenu={(e) => handleContext(e, app)}
                  title={app.name}
                >
                  <div className="taskbar-app-icon">
                    {app.icon ? <img src={app.icon} alt={app.name} /> : app.name[0]}
                  </div>
                  {openWin && <div className="taskbar-indicator" />}
                </button>
              )
            })}
            {}
            {unpinnedWindows.map((win) => {
              const isActive = win.id === focusedId
              return (
                <button
                  key={`win-${win.id}`}
                  className={`taskbar-btn taskbar-app has-window ${isActive ? 'active' : ''} ${win.minimized ? 'minimized' : ''}`}
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
        {}
        <div className="taskbar-right">
          <div className="tb-hidden-icons">
            <button className="tb-tray-btn">
               <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M8 12L2 4h12z"/></svg>
            </button>
          </div>
          <div className="system-tray-group" onClick={onQuickSettingsClick} title={`${wifiName} • Volume: 100% • Battery: ${battery ? battery.level + '%' : 'Unknown'}`}>
            <MdWifi size={16} />
            <MdVolumeUp size={15} />
            {battery && (
              <div className="tb-battery-mini">
                <div className="battery-outline-mini">
                  <div
                    className={`battery-fill-mini ${battery.level <= 20 ? 'low' : ''}`}
                    style={{ width: `${battery.level}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          {}
          <div className="taskbar-clock" onClick={onCalendarClick} title="Calendar">
            <span className="tb-time">{shortTime}</span>
            <span className="tb-date">{shortDate}</span>
          </div>
          {}
          <div className="tb-show-desktop" onClick={onShowDesktop} title="Show desktop" />
        </div>
      </div>
      {}
      {ctxMenu.open && (
        <div
          className="context-menu"
          style={{ left: ctxMenu.x, bottom: 56 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="ctx-item"
            onClick={() => {
              if (ctxMenu.win) onTogglePin(ctxMenu.win)
              closeCtx()
            }}
          >
            {ctxMenu.win && pinnedApps.find((p) => p.id === ctxMenu.win.id)
              ? 'Unpin from taskbar'
              : 'Pin to taskbar'}
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item" onClick={() => closeCtx()}>Close window</div>
        </div>
      )}
    </>
  )
}
