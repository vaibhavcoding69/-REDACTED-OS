import { useState } from 'react'

export default function Settings() {
  const [theme, setTheme] = useState('light')
  const [wallpaper, setWallpaper] = useState('default')
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)

  const themes = ['light', 'dark', 'blue', 'green']
  const wallpapers = ['default', 'mountain', 'ocean', 'city']

  return (
    <div className="settings">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Appearance</h3>
        <div className="setting-item">
          <label>Theme:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            {themes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <div className="setting-item">
          <label>Wallpaper:</label>
          <select value={wallpaper} onChange={(e) => setWallpaper(e.target.value)}>
            {wallpapers.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="settings-section">
        <h3>System</h3>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            Enable notifications
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              checked={sound}
              onChange={(e) => setSound(e.target.checked)}
            />
            Enable sound
          </label>
        </div>
      </div>
      <div className="settings-section">
        <h3>About</h3>
        <p>ReactOS v1.0</p>
        <p>Built with React</p>
      </div>
    </div>
  )
}