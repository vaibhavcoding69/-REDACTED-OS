import { useState, useCallback } from 'react'
import StartMenu from './StartMenu'
import DesktopIcons from './DesktopIcons'
import Taskbar from './Taskbar'
import WindowManager from './WindowManager'
import ContextMenu from './ContextMenu'
import QuickSettings from './QuickSettings'
import CalendarPanel from './CalendarPanel'

/**
 * Desktop component - main container with windows, start menu, and taskbar
 * Manages window state and provides app launching functionality
 */
export default function Desktop({ onLock }) {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [windows, setWindows] = useState([])
  const [nextId, setNextId] = useState(1)
  const [focusedId, setFocusedId] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)

  // Open a new app window
  const openApp = (app) => {
    const newWindow = {
      id: nextId,
      title: app.name,
      component: app.component,
      icon: app.icon || '📄',
      x: 100 + (nextId % 10) * 30,
      y: 60 + (nextId % 8) * 30,
      width: 650,
      height: 440,
      minimized: false,
      maximized: false,
      zIndex: nextId,
    }
    setWindows((prev) => [...prev, newWindow])
    setFocusedId(nextId)
    setNextId((id) => id + 1)
    setStartMenuOpen(false)
  }

  // Bring a window to the front
  const focusWindow = useCallback((id) => {
    setFocusedId(id)
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 0)
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
    })
  }, [])

  // Close a window by ID
  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    if (focusedId === id) setFocusedId(null)
  }

  // Minimize a window
  const minimizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    )
    if (focusedId === id) setFocusedId(null)
  }

  // Toggle maximize state of a window
  const toggleMaximize = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
    )
    focusWindow(id)
  }

  // Update window position
  const updateWindowPos = (id, x, y) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)))
  }

  // Update window size (for resizing)
  const updateWindowSize = (id, width, height) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    )
  }

  // Right-click context menu on desktop
  const handleContextMenu = (e) => {
    // Only show context menu when clicking on the desktop itself
    if (e.target.closest('.window') || e.target.closest('.taskbar') || e.target.closest('.start-menu')) return
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const closeContextMenu = () => setContextMenu(null)

  return (
    <div
      className="desktop"
      onContextMenu={handleContextMenu}
      onClick={() => { 
        closeContextMenu(); 
        setStartMenuOpen(false);
        setQuickSettingsOpen(false);
        setCalendarOpen(false);
      }}
    >
      <DesktopIcons onDoubleClick={openApp} />
      <StartMenu
        isOpen={startMenuOpen}
        onToggle={() => setStartMenuOpen(!startMenuOpen)}
        onAppClick={openApp}
        onLock={onLock}
      />
      <QuickSettings 
        isOpen={quickSettingsOpen} 
        onClose={() => setQuickSettingsOpen(false)} 
      />
      <CalendarPanel 
        isOpen={calendarOpen} 
        onClose={() => setCalendarOpen(false)} 
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
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onOpenApp={openApp}
        />
      )}
      <Taskbar
        onStartClick={(e) => { e?.stopPropagation(); setStartMenuOpen(!startMenuOpen) }}
        onQuickSettingsClick={(e) => { e?.stopPropagation(); setQuickSettingsOpen(!quickSettingsOpen) }}
        onCalendarClick={(e) => { e?.stopPropagation(); setCalendarOpen(!calendarOpen) }}
        onLock={onLock}
        windows={windows}
        onWindowClick={(id) => {
          const win = windows.find((w) => w.id === id)
          if (win?.minimized) {
            setWindows((prev) =>
              prev.map((w) => (w.id === id ? { ...w, minimized: false } : w))
            )
          } else if (focusedId === id) {
            // Click focused window in taskbar => minimize
            minimizeWindow(id)
            return
          }
          focusWindow(id)
        }}
        focusedId={focusedId}
      />
    </div>
  )
}
