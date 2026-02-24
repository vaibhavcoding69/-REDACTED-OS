import React, { useState } from 'react'
import { MdPalette, MdMonitor, MdNotifications, MdVolumeUp, MdInfo, MdKeyboardArrowRight } from 'react-icons/md'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system')

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
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0078d4', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold' }}>J</div>
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: 600 }}>John Doe</div>
            <div style={{ opacity: 0.6, fontSize: '12px' }}>Local Account</div>
          </div>
        </div>
        <div className="nav-list">
          {navItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
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
      
      <div className="settings-content" style={{ flex: 1, padding: '40px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '32px', fontWeight: 600 }}>{navItems.find(i => i.id === activeTab)?.label}</h1>
        
        {activeTab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                   <MdMonitor size={20} />
                   <div>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>Display</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Brightness, night light, display profile</div>
                   </div>
                </div>
                <MdKeyboardArrowRight size={20} />
             </div>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      </div>
    </div>
  )
}
