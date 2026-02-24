import React, { useState, useRef, useEffect } from 'react'
import Calculator from './apps/Calculator'
import Notepad from './apps/Notepad'
import FileExplorer from './apps/FileExplorer'
import Settings from './apps/Settings'
import Browser from './apps/Browser'
import Todo from './apps/Todo'
import Clock from './apps/Clock'
import Paint from './apps/Paint'

const APPS = [
  { id: 'calculator', name: 'Calculator', icon: 'https://img.icons8.com/fluency/48/calculator.png', component: Calculator },
  { id: 'notepad', name: 'Notepad', icon: 'https://img.icons8.com/fluency/48/notepad.png', component: Notepad },
  { id: 'explorer', name: 'File Explorer', icon: 'https://img.icons8.com/fluency/48/folder-invoices.png', component: FileExplorer },
  { id: 'settings', name: 'Settings', icon: 'https://img.icons8.com/fluency/48/settings.png', component: Settings },
  { id: 'browser', name: 'Web Browser', icon: 'https://img.icons8.com/fluency/48/chrome.png', component: Browser },
  { id: 'todo', name: 'Todo List', icon: 'https://img.icons8.com/fluency/48/checkmark.png', component: Todo },
  { id: 'clock', name: 'Clock', icon: 'https://img.icons8.com/fluency/48/alarm-clock.png', component: Clock },
  { id: 'paint', name: 'Paint', icon: 'https://img.icons8.com/fluency/48/microsoft-paint.png', component: Paint },
]

export default function StartMenu({ isOpen, onToggle, onAppClick, onLock }) {
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchRef.current?.focus()
      }, 100)
    } else {
      setSearch('')
    }
  }, [isOpen])

  const filteredApps = APPS.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`start-menu-overlay ${isOpen ? 'open' : ''}`} onClick={() => onToggle()}>
      <div className="start-menu" onClick={(e) => e.stopPropagation()}>
        <div className="start-menu-header">
          <div className="start-search-container">
            <span className="start-search-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for apps, settings, and documents"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="start-search"
            />
          </div>
        </div>
        <div className="start-section-header">
          <span className="start-section-title">Pinned</span>
          <button className="start-section-btn">
            All apps
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="start-apps">
          {filteredApps.length > 0 ? filteredApps.map(app => {
            return (
              <div
                key={app.id}
                className="start-app-item"
                onClick={() => onAppClick(app)}
              >
                <div className="start-app-icon">
                  <img src={app.icon} alt={app.name} />
                </div>
                <div className="start-app-name">{app.name}</div>
              </div>
            )
          }) : (
            <div className="start-no-results" style={{ gridColumn: 'span 6', textAlign: 'center', color: '#fff', padding: '20px' }}>No apps found</div>
          )}
        </div>
        <div className="start-footer">
          <div className="start-user">
            <div className="start-user-avatar">
              <img src="https://avatars.githubusercontent.com/u/189115938?v=4&size=32" alt="U" width={32} height={32} />
            </div>
            <span>Vaibhav Sharma</span>
          </div>
          <div className="start-power-icon" title="Power" onClick={() => {
            // Browsers only allow window.close() if opened via script
            // We try it anyway, then fallback to a lock screen + message
            try {
              window.close();
            } catch (e) {
              console.warn("window.close() blocked by browser security");
            }
            
            // Fallback: Lockdown the UI or show a hint
            if (onLock) onLock();
            alert("To shut down, please close this browser tab manualy.");
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}