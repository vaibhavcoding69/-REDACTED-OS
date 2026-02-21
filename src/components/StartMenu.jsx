import { useState } from 'react'
import Calculator from './apps/Calculator'
import Notepad from './apps/Notepad'
import FileExplorer from './apps/FileExplorer'
import Settings from './apps/Settings'
import Browser from './apps/Browser'
import Todo from './apps/Todo'
import Clock from './apps/Clock'
import Paint from './apps/Paint'

const APPS = [
  { id: 'calculator', name: 'Calculator', icon: '🧮', component: Calculator },
  { id: 'notepad', name: 'Notepad', icon: '📝', component: Notepad },
  { id: 'explorer', name: 'File Explorer', icon: '📁', component: FileExplorer },
  { id: 'settings', name: 'Settings', icon: '⚙️', component: Settings },
  { id: 'browser', name: 'Web Browser', icon: '🌐', component: Browser },
  { id: 'todo', name: 'Todo List', icon: '✅', component: Todo },
  { id: 'clock', name: 'Clock', icon: '🕐', component: Clock },
  { id: 'paint', name: 'Paint', icon: '🎨', component: Paint },
]

export default function StartMenu({ isOpen, onToggle, onAppClick, onLock }) {
  const [search, setSearch] = useState('')

  const filteredApps = APPS.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="start-menu-overlay" onClick={() => onToggle()}>
      <div className="start-menu" onClick={(e) => e.stopPropagation()}>
        <div className="start-menu-header">
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="start-search"
            autoFocus
          />
        </div>
        <div className="start-apps">
          {filteredApps.length > 0 ? filteredApps.map(app => (
            <div
              key={app.id}
              className="start-app-item"
              onClick={() => onAppClick(app)}
            >
              <span className="start-app-icon">{app.icon}</span>
              <span className="start-app-name">{app.name}</span>
            </div>
          )) : (
            <div className="start-no-results">No apps found</div>
          )}
        </div>
        <div className="start-footer">
          <div className="start-user">
            <div className="start-user-avatar">U</div>
            <span>User</span>
          </div>
          <div className="start-power">
            <button className="start-power-btn" onClick={() => { onToggle(); onLock?.(); }}>🔒 Lock</button>
            <button className="start-power-btn" onClick={() => { onToggle(); onLock?.(); }}>⏻ Shut down</button>
          </div>
        </div>
      </div>
    </div>
  )
}