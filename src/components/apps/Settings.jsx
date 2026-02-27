import React, { useState } from 'react'
import { MdPalette, MdMonitor, MdNotifications, MdVolumeUp, MdInfo, MdKeyboardArrowRight, MdArrowBack } from 'react-icons/md'
import { useUser } from '../../contexts/UserContext'

export default function Settings() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('system')
  const [subPage, setSubPage] = useState(null)

  const handleTabChange = (id) => {
    setActiveTab(id)
    setSubPage(null)
  }

  const navItems = [
    { id: 'system', label: 'System', icon: <MdMonitor size={18} /> },
    { id: 'personalization', label: 'Personalization', icon: <MdPalette size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <MdNotifications size={18} /> },
    { id: 'about', label: 'About', icon: <MdInfo size={18} /> },
  ]
  return (
    <div className="settings-container" style={{ display: 'flex', height: '100%', background: '#1e1e1e', color: '#fff' }}>
      <div className="settings-sidebar" style={{ width: '240px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '16px' }}>
          <img style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} src={user.avatar} alt={user.name} />
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ opacity: 0.6, fontSize: '12px' }}>{user.accountType}</div>
          </div>
        </div>
        <div className="nav-list">
          {navItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => handleTabChange(item.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                cursor: 'pointer',
                marginBottom: '2px',
                background: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent'
              }}
            >
              {item.icon}
              <span style={{ fontSize: '13px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="settings-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {subPage ? (
          <div>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer', opacity: 0.8 }}
              onClick={() => setSubPage(null)}
            >
              <MdArrowBack />
              <span>Back</span>
            </div>
            <h1 style={{ fontSize: '24px', marginBottom: '24px', fontWeight: 600 }}>{subPage.title}</h1>
            {subPage.id === 'display' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px', fontWeight: 500 }}>Brightness</div>
                  <input type="range" style={{ width: '100%' }} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px', fontWeight: 500 }}>Night light</div>
                  <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px' }}>Turn on now</button>
                </div>
              </div>
            )}
            {subPage.id === 'sound' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px', fontWeight: 500 }}>Output</div>
                  <select style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}>
                    <option>Speakers (Realtek(R) Audio)</option>
                    <option>Headphones</option>
                  </select>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px', fontWeight: 500 }}>Volume</div>
                  <input type="range" style={{ width: '100%' }} />
                </div>
              </div>
            )}
            {subPage.id === 'background' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px', fontWeight: 500 }}>Personalize your background</div>
                  <select style={{ width: '100%', padding: '8px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}>
                    <option>Picture</option>
                    <option>Solid color</option>
                    <option>Slideshow</option>
                  </select>
                </div>
              </div>
            )}
            {subPage.id === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>Notifications</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>Get notifications from apps and senders</div>
                  </div>
                  <div style={{ width: '40px', height: '20px', background: '#0078d4', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '16px' }}>Notifications from apps and other senders</div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <span>Snipping Tool</span>
                   <div style={{ width: '40px', height: '20px', background: '#0078d4', borderRadius: '10px', position: 'relative' }}>
                      <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                   </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '28px', marginBottom: '32px', fontWeight: 600 }}>{navItems.find(i => i.id === activeTab)?.label}</h1>
            {activeTab === 'system' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div 
                  onClick={() => setSubPage({ id: 'display', title: 'Display' })}
                  style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <MdMonitor size={20} />
                      <div>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>Display</div>
                          <div style={{ fontSize: '12px', opacity: 0.6 }}>Brightness, night light, display profile</div>
                      </div>
                    </div>
                    <MdKeyboardArrowRight size={20} />
                </div>
                <div 
                  onClick={() => setSubPage({ id: 'sound', title: 'Sound' })}
                  style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <MdVolumeUp size={20} />
                      <div>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>Sound</div>
                          <div style={{ fontSize: '12px', opacity: 0.6 }}>Volume levels, output devices</div>
                      </div>
                    </div>
                    <MdKeyboardArrowRight size={20} />
                </div>
              </div>
            )}
            {activeTab === 'personalization' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div 
                  onClick={() => setSubPage({ id: 'background', title: 'Background' })}
                  style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <MdPalette size={20} />
                      <div>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>Background</div>
                          <div style={{ fontSize: '12px', opacity: 0.6 }}>Wallpaper, colors, themes</div>
                      </div>
                    </div>
                    <MdKeyboardArrowRight size={20} />
                </div>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div 
                  onClick={() => setSubPage({ id: 'notifications', title: 'Notifications' })}
                  style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <MdNotifications size={20} />
                      <div>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>Notifications</div>
                          <div style={{ fontSize: '12px', opacity: 0.6 }}>Get notifications from apps and senders</div>
                      </div>
                    </div>
                    <MdKeyboardArrowRight size={20} />
                </div>
              </div>
            )}
            {activeTab === 'about' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Device specifications</div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '13px' }}>
                    <div style={{ opacity: 0.6 }}>Device name</div>
                    <div>AJAY-PC</div>
                    <div style={{ opacity: 0.6 }}>Processor</div>
                    <div>Intel(R) Core(TM) i7-12700H 2.30 GHz</div>
                    <div style={{ opacity: 0.6 }}>Installed RAM</div>
                    <div>16.0 GB (15.7 GB usable)</div>
                    <div style={{ opacity: 0.6 }}>System type</div>
                    <div>64-bit operating system, x64-based processor</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
