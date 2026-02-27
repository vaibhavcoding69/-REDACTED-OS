import { useState, useCallback, useEffect, useRef } from 'react'
import StartMenu from './StartMenu'
import DesktopIcons from './DesktopIcons'
import Taskbar from './Taskbar'
import WindowManager from './WindowManager'
import CalendarPanel from './CalendarPanel'
import QuickSettings from './QuickSettings'
import Calculator from './apps/Calculator'
import Notepad from './apps/Notepad'
import FileExplorer from './apps/FileExplorer'
import Browser from './apps/Browser'
import Todo from './apps/Todo'
import Settings from './apps/Settings'
import Clock from './apps/Clock'
import Paint from './apps/Paint'
import Terminal from './apps/Terminal'

const DESKTOP_STATE_KEY = 'win11.desktop.state.v1'

const APP_CATALOG = [
  { id: 'explorer', name: 'File Explorer', icon: 'https://img.icons8.com/fluency/48/folder-invoices.png', component: FileExplorer },
  { id: 'browser', name: 'Web Browser', icon: 'https://img.icons8.com/fluency/48/ms-edge-new.png', component: Browser },
  { id: 'settings', name: 'Settings', icon: 'https://img.icons8.com/fluency/48/settings.png', component: Settings },
  { id: 'notepad', name: 'Notepad', icon: 'https://img.icons8.com/fluency/48/notepad.png', component: Notepad },
  { id: 'calculator', name: 'Calculator', icon: 'https://img.icons8.com/fluency/48/calculator.png', component: Calculator },
  { id: 'todo', name: 'Todo List', icon: 'https://img.icons8.com/fluency/48/checkmark.png', component: Todo },
  { id: 'clock', name: 'Clock', icon: 'https://img.icons8.com/fluency/48/alarm-clock.png', component: Clock },
  { id: 'paint', name: 'Paint', icon: 'https://img.icons8.com/fluency/48/microsoft-paint.png', component: Paint },
  { id: 'terminal', name: 'Terminal', icon: 'https://img.icons8.com/fluency/48/console.png', component: Terminal },
]

const APP_BY_ID = APP_CATALOG.reduce((acc, app) => {
  acc[app.id] = app
  return acc
}, {})

const INITIAL_PINNED_APPS = APP_CATALOG.slice(0, 6)

export default function Desktop({ onLock }) {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)
  const [windows, setWindows] = useState([])
  const [iconPositions, setIconPositions] = useState({})
  const [focusedId, setFocusedId] = useState(null)
  const [nextZIndex, setNextZIndex] = useState(100)
  const [nextId, setNextId] = useState(1)
  const [pinnedApps, setPinnedApps] = useState(INITIAL_PINNED_APPS)
  const hydratedRef = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DESKTOP_STATE_KEY)
      if (!raw) {
        hydratedRef.current = true
        return
      }

      const saved = JSON.parse(raw)

      if (Array.isArray(saved?.pinnedAppIds)) {
        const restoredPinned = saved.pinnedAppIds
          .map((id) => APP_BY_ID[id])
          .filter(Boolean)
        if (restoredPinned.length) setPinnedApps(restoredPinned)
      }

      if (Array.isArray(saved?.windows)) {
        const restoredWindows = saved.windows
          .map((w) => {
            const app = APP_BY_ID[w.appId]
            if (!app) return null
            return {
              ...w,
              id: Number(w.id),
              appId: app.id,
              title: app.name,
              icon: app.icon,
              component: app.component,
            }
          })
          .filter(Boolean)

        setWindows(restoredWindows)
      }

      if (saved?.iconPositions && typeof saved.iconPositions === 'object') {
        setIconPositions(saved.iconPositions)
      }

      if (typeof saved?.focusedId === 'number') setFocusedId(saved.focusedId)
      if (typeof saved?.nextId === 'number') setNextId(saved.nextId)
      if (typeof saved?.nextZIndex === 'number') setNextZIndex(saved.nextZIndex)
    } catch {
      // ignore invalid persisted state
    } finally {
      hydratedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!hydratedRef.current) return

    const payload = {
      pinnedAppIds: pinnedApps.map((p) => p.id),
      windows: windows.map(({ component, ...rest }) => rest),
      iconPositions,
      focusedId,
      nextId,
      nextZIndex,
    }

    localStorage.setItem(DESKTOP_STATE_KEY, JSON.stringify(payload))
  }, [windows, pinnedApps, iconPositions, focusedId, nextId, nextZIndex])

  const focusWindow = useCallback((id) => {
    setFocusedId(id)
    setNextZIndex((z) => {
      const newZ = z + 1
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
      )
      return newZ
    })
  }, [])
  const openApp = (app) => {
    const catalogApp = app?.id ? APP_BY_ID[app.id] : APP_CATALOG.find((a) => a.name === app?.name)
    const resolvedApp = catalogApp || app

    const existing = windows.find((w) => w.appId === resolvedApp.id)
    if (existing) {
      setWindows((prev) =>
        prev.map((w) => (w.id === existing.id ? { ...w, minimized: false } : w))
      )
      focusWindow(existing.id)
      setStartMenuOpen(false)
      return
    }
    const offsetX = 80 + ((nextId * 30) % 200)
    const offsetY = 60 + ((nextId * 30) % 150)
    const newZ = nextZIndex + 1
    setNextZIndex(newZ)
    const newWindow = {
      id: nextId,
      appId: resolvedApp.id || null,
      title: resolvedApp.name,
      icon: resolvedApp.icon || null,
      openAt: Date.now(),
      component: resolvedApp.component,
      x: offsetX,
      y: offsetY,
      width: resolvedApp.defaultWidth || 720,
      height: resolvedApp.defaultHeight || 500,
      minimized: false,
      maximized: false,
      zIndex: newZ,
    }
    setWindows((prev) => [...prev, newWindow])
    setFocusedId(nextId)
    setNextId((id) => id + 1)
    setStartMenuOpen(false)
  }
  const togglePin = (app) => {
    setPinnedApps((prev) => {
      const exists = prev.find((p) => p.id === app.id)
      if (exists) return prev.filter((p) => p.id !== app.id)
      return [...prev, { id: app.id, name: app.name, icon: app.icon, component: app.component }]
    })
  }
  const closeWindow = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    setFocusedId((prev) => (prev === id ? null : prev))
  }, [])
  const minimizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    )
    setFocusedId((prev) => (prev === id ? null : prev))
  }, [])
  const toggleMaximize = useCallback((id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    )
  }, [])
  const updateWindowPos = useCallback((id, x, y) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)))
  }, [])
  const updateWindowSize = useCallback((id, width, height) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)))
  }, [])

  const showDesktop = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, minimized: true })))
    setFocusedId(null)
  }, [])

  const handleDesktopClick = () => {
    setStartMenuOpen(false)
    setCalendarOpen(false)
    setQuickSettingsOpen(false)
  }
  return (
    <div className="desktop" onClick={handleDesktopClick}>
      <DesktopIcons
        onDoubleClick={openApp}
        savedPositions={iconPositions}
        onPositionsChange={setIconPositions}
      />
      <StartMenu
        isOpen={startMenuOpen}
        onToggle={() => setStartMenuOpen(!startMenuOpen)}
        onAppClick={openApp}
      />
      <WindowManager
        windows={windows}
        focusedId={focusedId}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={toggleMaximize}
        onUpdatePos={updateWindowPos}
        onUpdateSize={updateWindowSize}
        onFocus={focusWindow}
      />
      <Taskbar
        onStartClick={(e) => {
          e.stopPropagation()
          setStartMenuOpen(!startMenuOpen)
          setCalendarOpen(false)
          setQuickSettingsOpen(false)
        }}
        onCalendarClick={(e) => {
          e.stopPropagation()
          setCalendarOpen(!calendarOpen)
          setQuickSettingsOpen(false)
          setStartMenuOpen(false)
        }}
        onNotificationsClick={(e) => {
          e.stopPropagation()
          setCalendarOpen(!calendarOpen)
          setQuickSettingsOpen(false)
          setStartMenuOpen(false)
        }}
        onQuickSettingsClick={(e) => {
          e.stopPropagation()
          setQuickSettingsOpen(!quickSettingsOpen)
          setCalendarOpen(false)
          setStartMenuOpen(false)
        }}
        onLock={onLock}
        windows={windows}
        focusedId={focusedId}
        onWindowClick={(id) => {
          const win = windows.find((w) => w.id === id)
          if (win && win.minimized) {
            setWindows((prev) =>
              prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
            )
          } else if (win && focusedId === id) {
            setWindows((prev) =>
              prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
            )
            setFocusedId(null)
            return
          }
          focusWindow(id)
        }}
        pinnedApps={pinnedApps}
        onTogglePin={togglePin}
        onLaunchApp={(app) => openApp(app)}
        onShowDesktop={showDesktop}
      />
      <CalendarPanel
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />
      <QuickSettings
        isOpen={quickSettingsOpen}
        onClose={() => setQuickSettingsOpen(false)}
        onOpenSettings={() => {
          openApp({ id: 'settings', name: 'Settings', icon: 'https://img.icons8.com/fluency/48/settings.png', component: Settings })
          setQuickSettingsOpen(false)
        }}
      />
    </div>
  )
}
