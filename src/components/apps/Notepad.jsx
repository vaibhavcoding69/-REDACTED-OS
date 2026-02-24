import React, { useState, useRef } from 'react'

export default function Notepad() {
  const [content, setContent] = useState('')
  const [fontSize, setFontSize] = useState(14)
  const textareaRef = useRef(null)

  const handleNew = () => {
    if (content && !confirm('Discard changes?')) return
    setContent('')
  }

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'note.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoad = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setContent(e.target.result)
      reader.readAsText(file)
    }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  return (
    <div className="notepad-container">
      <div className="app-toolbar">
        <button onClick={handleNew}>File</button>
        <label>
          Open
          <input type="file" accept=".txt" onChange={handleLoad} style={{ display: 'none' }} />
        </label>
        <button onClick={handleSave}>Save</button>
        <select 
          value={fontSize} 
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ background: 'transparent', border: 'none', color: '#ccc', fontSize: '13px' }}
        >
          <option value={12}>12px</option>
          <option value={14}>14px</option>
          <option value={16}>16px</option>
          <option value={18}>18px</option>
          <option value={20}>20px</option>
        </select>
      </div>
      <textarea
        ref={textareaRef}
        className="notepad-editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ fontSize: `${fontSize}px` }}
        placeholder="Start typing..."
      />
      <div className="notepad-status">
        <span>Ln 1, Col 1</span>
        <span>{charCount} characters</span>
        <span>{wordCount} words</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}
