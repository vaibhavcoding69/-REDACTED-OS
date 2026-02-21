import { useState, useRef } from 'react'

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
    <div className="notepad">
      <div className="notepad-toolbar">
        <button onClick={handleNew}>New</button>
        <label>
          Open
          <input type="file" accept=".txt" onChange={handleLoad} style={{ display: 'none' }} />
        </label>
        <button onClick={handleSave}>Save</button>
        <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
          <option value={12}>12px</option>
          <option value={14}>14px</option>
          <option value={16}>16px</option>
          <option value={18}>18px</option>
          <option value={20}>20px</option>
        </select>
        <div className="notepad-stats">
          Words: {wordCount} | Chars: {charCount}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ fontSize: `${fontSize}px` }}
        placeholder="Start typing..."
      />
    </div>
  )
}