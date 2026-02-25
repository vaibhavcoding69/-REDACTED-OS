import { useState } from 'react'
import StartMenu from './StartMenu'
import DesktopIcons from './DesktopIcons'
import Taskbar from './Taskbar'
import WindowManager from './WindowManager'
import CalendarPanel from './CalendarPanel'
import QuickSettings from './QuickSettings'

/**
 * Desktop component - main container with windows, start menu, and taskbar
 * Manages window state and provides app launching functionality
 */
export default function Desktop({ onLock }) {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)
  const [windows, setWindows] = useState([])
  const [nextId, setNextId] = useState(1)
  const [pinnedApps, setPinnedApps] = useState([])

  // Open a new app window
  const openApp = (app) => {
    const newWindow = {
      id: nextId,
      appId: app.id || null,
      title: app.name,
      icon: app.icon || null,
      openAt: Date.now(),
      component: app.component,
      x: 100 + nextId * 20,
      y: 100 + nextId * 20,
      width: 600,
      height: 400,
      minimized: false,
      maximized: false,
    }
    setWindows((prev) => [...prev, newWindow])
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

  // Close a window by ID
  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  // Minimize a window
  const minimizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    )
  }

  // Toggle maximize state of a window
  const toggleMaximize = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    )
  }

  // Update window position
  const updateWindowPos = (id, x, y) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)))
  }

  return (
    <div className="desktop">
      <DesktopIcons onDoubleClick={openApp} />
      <StartMenu
        isOpen={startMenuOpen}
        onToggle={() => setStartMenuOpen(!startMenuOpen)}
        onAppClick={openApp}
      />
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={toggleMaximize}
        onUpdatePos={updateWindowPos}
      />
      <Taskbar
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
        onCalendarClick={() => {
          setCalendarOpen(!calendarOpen)
          setQuickSettingsOpen(false)
          setStartMenuOpen(false)
        }}
        onQuickSettingsClick={() => {
          setQuickSettingsOpen(!quickSettingsOpen)
          setCalendarOpen(false)
          setStartMenuOpen(false)
        }}
        onLock={onLock}
        windows={windows}
        onWindowClick={(id) => {
          setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
          )
        }}
        pinnedApps={pinnedApps}
        onTogglePin={togglePin}
        onLaunchApp={(app) => openApp(app)}
      />
      <CalendarPanel
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />
    </div>
  )
}
