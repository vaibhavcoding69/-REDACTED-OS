import { useState } from 'react'
import { MdCalculate, MdNote, MdFolder, MdPublic, MdCheckCircle, MdSchedule, MdPalette } from 'react-icons/md'
import Calculator from './apps/Calculator'
import Notepad from './apps/Notepad'
import FileExplorer from './apps/FileExplorer'
import Browser from './apps/Browser'
import Todo from './apps/Todo'
import Clock from './apps/Clock'
import Paint from './apps/Paint'

const DESKTOP_APPS = [
  { id: 'calculator', name: 'Calculator', icon: MdCalculate, component: Calculator },
  { id: 'notepad', name: 'Notepad', icon: MdNote, component: Notepad },
  { id: 'explorer', name: 'File Explorer', icon: MdFolder, component: FileExplorer },
  { id: 'browser', name: 'Web Browser', icon: MdPublic, component: Browser },
  { id: 'todo', name: 'Todo List', icon: MdCheckCircle, component: Todo },
  { id: 'clock', name: 'Clock', icon: MdSchedule, component: Clock },
  { id: 'paint', name: 'Paint', icon: MdPalette, component: Paint },
]

export default function DesktopIcons({ onDoubleClick }) {
  const [selected, setSelected] = useState(null)

  const handleClick = (app, e) => {
    if (e.detail === 2) {
      onDoubleClick(app)
    } else {
      setSelected(app.id)
    }
  }

  return (
    <div className="desktop-icons" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
      {DESKTOP_APPS.map((app, index) => {
        const IconComponent = app.icon
        return (
          <div
            key={app.id}
            className={`desktop-icon ${selected === app.id ? 'selected' : ''}`}
            style={{
              left: 24 + Math.floor(index / 5) * 105,
              top: 20 + (index % 5) * 100,
            }}
            onClick={(e) => handleClick(app, e)}
          >
            <div className="icon-image">
              <IconComponent size={48} />
            </div>
            <div className="icon-label">{app.name}</div>
          </div>
        )
      })}
    </div>
  )
}