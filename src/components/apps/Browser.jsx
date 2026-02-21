import { useState } from 'react'

export default function Browser() {
  const [url, setUrl] = useState('https://www.google.com')
  const [history, setHistory] = useState(['https://www.google.com'])
  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = (newUrl) => {
    if (!newUrl.startsWith('http')) {
      newUrl = 'https://' + newUrl
    }
    setUrl(newUrl)
    const newHistory = history.slice(0, currentIndex + 1)
    newHistory.push(newUrl)
    setHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setUrl(history[currentIndex - 1])
    }
  }

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUrl(history[currentIndex + 1])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(url)
  }

  return (
    <div className="browser">
      <div className="browser-toolbar">
        <button onClick={goBack} disabled={currentIndex === 0}>←</button>
        <button onClick={goForward} disabled={currentIndex === history.length - 1}>→</button>
        <button onClick={() => navigate(url)}>🔄</button>
        <form onSubmit={handleSubmit} className="browser-address">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
          />
        </form>
      </div>
      <div className="browser-content">
        <iframe
          src={url}
          title="Web Browser"
          width="100%"
          height="100%"
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}