import { useState, useRef, useCallback } from 'react'

function Window({ window, onClose, onMinimize, onMaximize, onUpdatePos, onUpdateSize, onFocus, isFocused }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDir, setResizeDir] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const windowRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return
    onFocus(window.id)
    setIsDragging(true)
    setDragStart({
      x: e.clientX - window.x,
      y: e.clientY - window.y,
    })
  }

  const handleResizeStart = (e, direction) => {
    e.stopPropagation()
    e.preventDefault()
    onFocus(window.id)
    setIsResizing(true)
    setResizeDir(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: window.width,
      h: window.height,
      wx: window.x,
      wy: window.y,
    })
  }

  const handleMouseMove = useCallback((e) => {
    if (isDragging && !window.maximized) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      onUpdatePos(window.id, Math.max(0, newX), Math.max(0, newY))
    }
    if (isResizing && !window.maximized) {
      const dx = e.clientX - resizeStart.x
      const dy = e.clientY - resizeStart.y
      let newW = resizeStart.w
      let newH = resizeStart.h
      let newX = resizeStart.wx
      let newY = resizeStart.wy

      if (resizeDir.includes('e')) newW = Math.max(300, resizeStart.w + dx)
      if (resizeDir.includes('s')) newH = Math.max(200, resizeStart.h + dy)
      if (resizeDir.includes('w')) {
        newW = Math.max(300, resizeStart.w - dx)
        newX = resizeStart.wx + resizeStart.w - newW
      }
      if (resizeDir.includes('n')) {
        newH = Math.max(200, resizeStart.h - dy)
        newY = resizeStart.wy + resizeStart.h - newH
      }

      onUpdateSize(window.id, newW, newH)
      onUpdatePos(window.id, Math.max(0, newX), Math.max(0, newY))
    }
  }, [isDragging, isResizing, dragStart, resizeStart, resizeDir, window, onUpdatePos, onUpdateSize])

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDir(null)
  }

  if (window.minimized) return null

  const style = window.maximized
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 44px)', zIndex: window.zIndex || 100 }
    : { top: window.y, left: window.x, width: window.width, height: window.height, zIndex: window.zIndex || 100 }

  return (
    <div
      ref={windowRef}
      className={`window ${isFocused ? 'focused' : 'unfocused'} ${window.maximized ? 'maximized' : ''}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={() => onFocus(window.id)}
    >
      <div className="window-titlebar" onMouseDown={handleMouseDown} onDoubleClick={() => onMaximize(window.id)}>
        <span className="window-title">{window.icon && <span className="window-title-icon">{window.icon}</span>}{window.title}</span>
        <div className="window-controls">
          <button className="win-ctrl minimize" onClick={() => onMinimize(window.id)}>─</button>
          <button className="win-ctrl maximize" onClick={() => onMaximize(window.id)}>
            {window.maximized ? '❐' : '⬜'}
          </button>
          <button className="win-ctrl close" onClick={() => onClose(window.id)}>✕</button>
        </div>
      </div>
      <div className="window-content">
        <window.component />
      </div>
      {/* Resize handles */}
      {!window.maximized && (
        <>
          <div className="resize-handle resize-n" onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="resize-handle resize-s" onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div className="resize-handle resize-e" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          <div className="resize-handle resize-w" onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="resize-handle resize-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="resize-handle resize-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="resize-handle resize-se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
          <div className="resize-handle resize-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
        </>
      )}
    </div>
  )
}

export default function WindowManager({ windows, focusedId, onClose, onMinimize, onMaximize, onUpdatePos, onUpdateSize, onFocus }) {
  return (
    <div className="window-manager">
      {windows.map(win => (
        <Window
          key={win.id}
          window={win}
          isFocused={focusedId === win.id}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onUpdatePos={onUpdatePos}
          onUpdateSize={onUpdateSize}
          onFocus={onFocus}
        />
      ))}
    </div>
  )
}