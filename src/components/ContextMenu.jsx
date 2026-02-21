import { useEffect, useRef } from 'react'
import Settings from './apps/Settings'

const MENU_ITEMS = [
  { label: 'Refresh', icon: '🔄', action: 'refresh' },
  { type: 'divider' },
  { label: 'View', icon: '👁️', submenu: [
    { label: 'Large icons' },
    { label: 'Medium icons' },
    { label: 'Small icons' },
  ]},
  { label: 'Sort by', icon: '📊', submenu: [
    { label: 'Name' },
    { label: 'Size' },
    { label: 'Date modified' },
    { label: 'Type' },
  ]},
  { type: 'divider' },
  { label: 'New', icon: '📄', submenu: [
    { label: 'Folder' },
    { label: 'Text Document' },
    { label: 'Shortcut' },
  ]},
  { type: 'divider' },
  { label: 'Display settings', icon: '🖥️', action: 'display' },
  { label: 'Personalize', icon: '🎨', action: 'personalize' },
]

export default function ContextMenu({ x, y, onClose, onOpenApp }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = () => onClose()
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  // Adjust position to stay within viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const el = menuRef.current
      if (rect.right > window.innerWidth) {
        el.style.left = `${window.innerWidth - rect.width - 8}px`
      }
      if (rect.bottom > window.innerHeight - 44) {
        el.style.top = `${window.innerHeight - 44 - rect.height - 8}px`
      }
    }
  }, [x, y])

  const handleAction = (action) => {
    if (action === 'refresh') {
      // Visual feedback - do nothing
    } else if (action === 'display' || action === 'personalize') {
      onOpenApp({ name: 'Settings', component: Settings, icon: '⚙️' })
    }
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {MENU_ITEMS.map((item, i) => {
        if (item.type === 'divider') {
          return <div key={i} className="ctx-divider" />
        }
        return (
          <div
            key={i}
            className="ctx-item"
            onClick={() => handleAction(item.action)}
          >
            <span className="ctx-icon">{item.icon}</span>
            <span className="ctx-label">{item.label}</span>
            {item.submenu && <span className="ctx-arrow">›</span>}
          </div>
        )
      })}
    </div>
  )
}
