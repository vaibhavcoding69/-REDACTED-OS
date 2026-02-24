import React, { useState } from 'react'
import { MdArrowBack, MdArrowForward, MdRefresh, MdSearch } from 'react-icons/md'

export default function Browser() {
  const [url, setUrl] = useState('https://www.google.com/search?igu=1')
  const [inputUrl, setInputUrl] = useState('https://www.google.com')

  const handleNavigate = (e) => {
    e.preventDefault();
    let target = inputUrl;
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target + '?igu=1');
  }

  return (
    <div className="browser-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <div className="app-toolbar" style={{ background: '#f3f3f3', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '4px', marginRight: '12px' }}>
          <button style={{ color: '#555' }}><MdArrowBack size={18} /></button>
          <button style={{ color: '#555' }}><MdArrowForward size={18} /></button>
          <button style={{ color: '#555' }} onClick={() => setUrl(url)}><MdRefresh size={18} /></button>
        </div>
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '20px', padding: '4px 16px', border: '1px solid #ddd' }}>
          <MdSearch size={16} style={{ color: '#888', marginRight: '8px' }} />
          <input 
            type="text" 
            value={inputUrl} 
            onChange={(e) => setInputUrl(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#000', padding: '2px 0' }}
          />
        </form>
        <div style={{ width: '100px' }}></div>
      </div>
      <div style={{ flex: 1, background: '#fff', position: 'relative' }}>
        <iframe
          src={url}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        {/* Simple overlay if iframe is blocked by CSP in some cases, though igu=1 helps with Google */}
      </div>
    </div>
  )
}
