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
    <div className="browser-container">
      <div className="browser-toolbar">
        <div className="browser-nav">
          <button><MdArrowBack size={18} /></button>
          <button><MdArrowForward size={18} /></button>
          <button onClick={() => setUrl(url)}><MdRefresh size={18} /></button>
        </div>
        <form className="browser-url-form" onSubmit={handleNavigate}>
          <MdSearch size={16} />
          <input
            type="text"
            className="browser-url-input"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </form>
        <div className="browser-spacer"></div>
      </div>
      <div className="browser-content">
        <iframe
          src={url}
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        {}
      </div>
    </div>
  )
}
