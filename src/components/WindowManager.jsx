import { useState, useRef, useCallback, useEffect } from 'react'

function Window({ window: win, onClose, onMinimize, onMaximize, onUpdatePos, onUpdateSize, onFocus, isFocused }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDir, setResizeDir] = useState(null)
  const [opened, setOpened] = useState(false)
  
  const dragStartRef = useRef({ x: 0, y: 0 })
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0, wx: 0, wy: 0 })
  const windowRef = useRef(null)

  // trigger slide-in animation after mount
  useEffect(() => {
    // delay to allow initial styles to apply
    const t = setTimeout(() => setOpened(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return
    onFocus(win.id)
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    }
  }

  const handleResizeStart = (e, direction) => {
    e.stopPropagation()
    e.preventDefault()
    onFocus(win.id)
    setIsResizing(true)
    setResizeDir(direction)
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: win.width,
      h: win.height,
      wx: win.x,
      wy: win.y,
    }
  }

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMoveGlobal = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStartRef.current.x
        const newY = e.clientY - dragStartRef.current.y
        onUpdatePos(win.id, Math.max(0, newX), Math.max(0, newY))
      }
      
      if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.x
        const dy = e.clientY - resizeStartRef.current.y
        let newW = resizeStartRef.current.w
        let newH = resizeStartRef.current.h
        let newX = resizeStartRef.current.wx
        let newY = resizeStartRef.current.wy

        if (resizeDir.includes('e')) newW = Math.max(300, resizeStartRef.current.w + dx)
        if (resizeDir.includes('s')) newH = Math.max(200, resizeStartRef.current.h + dy)
        if (resizeDir.includes('w')) {
          newW = Math.max(300, resizeStartRef.current.w - dx)
          newX = resizeStartRef.current.wx + resizeStartRef.current.w - newW
        }
        if (resizeDir.includes('n')) {
          newH = Math.max(200, resizeStartRef.current.h - dy)
          newY = resizeStartRef.current.wy + resizeStartRef.current.h - newH
        }

        onUpdateSize(win.id, newW, newH)
        onUpdatePos(win.id, Math.max(0, newX), Math.max(0, newY))
      }
    }

    const handleMouseUpGlobal = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDir(null)
    }

    window.addEventListener('mousemove', handleMouseMoveGlobal)
    window.addEventListener('mouseup', handleMouseUpGlobal)

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal)
      window.removeEventListener('mouseup', handleMouseUpGlobal)
    }
  }, [isDragging, isResizing, resizeDir, win.id, onUpdatePos, onUpdateSize])

  if (win.minimized) return null

  const style = win.maximized
    ? { 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: 'calc(100vh - 48px)', /* Adjusted for taskbar height */
        zIndex: win.zIndex || 100,
        transform: 'none'
      }
    : { 
        top: 0,
        left: 0,
        width: win.width, 
        height: win.height, 
        zIndex: win.zIndex || 100,
        transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
        willChange: 'transform, width, height'
      }

  return (
    <div
      ref={windowRef}
      className={`window ${opened ? 'open' : ''} ${isFocused ? 'focused' : 'unfocused'} ${win.maximized ? 'maximized' : ''}`}
      style={style}
      onMouseDown={() => { if (!isFocused) onFocus(win.id); }}
    >
      <div className="window-titlebar" onMouseDown={handleMouseDown} onDoubleClick={() => onMaximize(win.id)}>
        <span className="window-title" onClick={(e) => e.stopPropagation()}>
          {win.icon && (
            <span className="window-title-icon">
              {typeof win.icon === 'string' && win.icon.startsWith('http') ? (
                <img src={win.icon} alt="" width={16} height={16} draggable="false" />
              ) : (
                win.icon
              )}
            </span>
          )}
          {win.title}
        </span>
        <div className="window-controls" onMouseDown={(e) => e.stopPropagation()}>
          <button className="win-ctrl minimize" onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}>─</button>
          <button className="win-ctrl maximize" onClick={(e) => { e.stopPropagation(); onMaximize(win.id); }}>
            {win.maximized ? '❐' : '⬜'}
          </button>
          <button className="win-ctrl close" onClick={(e) => { e.stopPropagation(); onClose(win.id); }}>✕</button>
        </div>
      </div>
      <div className="window-content" onMouseDown={() => { if (!isFocused) onFocus(win.id); }}>
        <win.component />
      </div>
      {/* Resize handles */}
      {!win.maximized && (
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