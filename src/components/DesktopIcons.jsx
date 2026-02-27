import { useState, useRef, useEffect } from 'react'
import Calculator from './apps/Calculator'
import Notepad from './apps/Notepad'
import FileExplorer from './apps/FileExplorer'
import Browser from './apps/Browser'
import Todo from './apps/Todo'
import Clock from './apps/Clock'
import Paint from './apps/Paint'

const INITIAL_APPS = [
  { id: 'calculator', name: 'Calculator', icon: 'https://img.icons8.com/fluency/48/calculator.png', component: Calculator },
  { id: 'notepad', name: 'Notepad', icon: 'https://img.icons8.com/fluency/48/notepad.png', component: Notepad },
  { id: 'explorer', name: 'File Explorer', icon: 'https://img.icons8.com/fluency/48/folder-invoices.png', component: FileExplorer },
  { id: 'browser', name: 'Web Browser', icon: 'https://img.icons8.com/fluency/48/chrome.png', component: Browser },
  { id: 'todo', name: 'Todo List', icon: 'https://img.icons8.com/fluency/48/checkmark.png', component: Todo },
  { id: 'clock', name: 'Clock', icon: 'https://img.icons8.com/fluency/48/alarm-clock.png', component: Clock },
  { id: 'paint', name: 'Paint', icon: 'https://img.icons8.com/fluency/48/microsoft-paint.png', component: Paint },
]

export default function DesktopIcons({ onDoubleClick, savedPositions = {}, onPositionsChange = () => {} }) {
  const [selected, setSelected] = useState(null)
  const [apps, setApps] = useState(() => 
    INITIAL_APPS.map((app, index) => ({
      ...app,
      x: savedPositions[app.id]?.x ?? 12 + Math.floor(index / 8) * 100,
      y: savedPositions[app.id]?.y ?? 12 + (index % 8) * 105,
    }))
  )
  const [dragging, setDragging] = useState(null)
  const [pointerDown, setPointerDown] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef(null)
  const didDragRef = useRef(false)

  useEffect(() => {
    setApps(
      INITIAL_APPS.map((app, index) => ({
        ...app,
        x: savedPositions[app.id]?.x ?? 12 + Math.floor(index / 8) * 100,
        y: savedPositions[app.id]?.y ?? 12 + (index % 8) * 105,
      }))
    )
  }, [savedPositions])

  const handleMouseDown = (e, app) => {
    if (e.button !== 0) return 
    e.stopPropagation()
    setPointerDown(true)
    setSelected(app.id)
    dragStartRef.current = { id: app.id, startX: e.clientX, startY: e.clientY }
    dragOffset.current = { x: e.clientX - app.x, y: e.clientY - app.y }
    didDragRef.current = false
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging && dragStartRef.current) {
        const dx = Math.abs(e.clientX - dragStartRef.current.startX)
        const dy = Math.abs(e.clientY - dragStartRef.current.startY)
        if (dx > 6 || dy > 6) {
          setDragging(dragStartRef.current.id)
          didDragRef.current = true
        }
      }
      if (!dragging) return
      setApps(prevApps => prevApps.map(app => {
        if (app.id === dragging) {
          const newX = Math.max(0, Math.min(window.innerWidth - 90, e.clientX - dragOffset.current.x))
          const newY = Math.max(0, Math.min(window.innerHeight - 134, e.clientY - dragOffset.current.y))
          return {
            ...app,
            x: newX,
            y: newY
          }
        }
        return app
      }))
    }
    const handleMouseUp = () => {
      dragStartRef.current = null
      setPointerDown(false)
      if (!dragging) return
      setApps(prevApps => {
        const updatedApps = prevApps.map(app => {
        if (app.id === dragging) {
          const gridX = Math.round((app.x - 12) / 100) * 100 + 12
          const gridY = Math.round((app.y - 12) / 105) * 105 + 12
          return { ...app, x: gridX, y: gridY }
        }
        return app
        })

        const positions = updatedApps.reduce((acc, app) => {
          acc[app.id] = { x: app.x, y: app.y }
          return acc
        }, {})
        onPositionsChange(positions)

        return updatedApps
      })
      setDragging(null)
    }
    if (dragging || pointerDown) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, pointerDown, onPositionsChange])

  const handleClick = (app, e) => {
    e.stopPropagation()
    if (didDragRef.current) {
      didDragRef.current = false
      return
    }
    if (e.detail === 2) {
      onDoubleClick(app)
    }
  }
  return (
    <div className="desktop-icons" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
      {apps.map((app) => (
        <div
          key={app.id}
          className={`desktop-icon ${selected === app.id ? 'selected' : ''} ${dragging === app.id ? 'dragging' : ''}`}
          style={{
            left: app.x,
            top: app.y,
            zIndex: dragging === app.id ? 100 : 1,
            cursor: dragging === app.id ? 'grabbing' : 'default'
          }}
          onMouseDown={(e) => handleMouseDown(e, app)}
          onClick={(e) => handleClick(app, e)}
        >
          <div className="icon-image" draggable="false">
            <img 
              src={app.icon} 
              alt={app.name} 
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
          <div className="icon-label">{app.name}</div>
        </div>
      ))}
    </div>
  )
}
