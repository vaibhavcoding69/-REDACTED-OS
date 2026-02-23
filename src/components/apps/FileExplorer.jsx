import { useState } from 'react'
import { MdFolder, MdNote, MdImage, MdAudioFile, MdArrowUpward } from 'react-icons/md'

const MOCK_FILES = [
  { name: 'Documents', type: 'folder', size: '', modified: '2024-02-20' },
  { name: 'Pictures', type: 'folder', size: '', modified: '2024-02-19' },
  { name: 'Music', type: 'folder', size: '', modified: '2024-02-18' },
  { name: 'Downloads', type: 'folder', size: '', modified: '2024-02-17' },
  { name: 'readme.txt', type: 'file', size: '1.2 KB', modified: '2024-02-20' },
  { name: 'photo.jpg', type: 'file', size: '2.5 MB', modified: '2024-02-19' },
  { name: 'song.mp3', type: 'file', size: '5.1 MB', modified: '2024-02-18' },
]

const getFileIcon = (file) => {
  if (file.type === 'folder') return MdFolder
  if (file.name.endsWith('.txt')) return MdNote
  if (file.name.endsWith('.jpg') || file.name.endsWith('.png')) return MdImage
  if (file.name.endsWith('.mp3')) return MdAudioFile
  return MdNote
}

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('C:\\Users\\User')
  const [files, setFiles] = useState(MOCK_FILES)
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'icons'

  const handleDoubleClick = (file) => {
    if (file.type === 'folder') {
      setCurrentPath(`${currentPath}\\${file.name}`)
      // In real app, fetch new files
    }
  }

  const goUp = () => {
    const parts = currentPath.split('\\')
    if (parts.length > 1) {
      setCurrentPath(parts.slice(0, -1).join('\\'))
    }
  }

  return (
    <div className="file-explorer">
      <div className="explorer-toolbar">
        <button onClick={goUp} disabled={currentPath === 'C:'}>
          <MdArrowUpward size={18} />
        </button>
        <span className="current-path">{currentPath}</span>
        <div className="view-toggle">
          <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>List</button>
          <button onClick={() => setView('icons')} className={view === 'icons' ? 'active' : ''}>Icons</button>
        </div>
      </div>
      <div className={`explorer-content ${view}`}>
        {files.map((file, index) => (
          <div
            key={index}
            className={`file-item ${selected === index ? 'selected' : ''} ${file.type}`}
            onClick={() => setSelected(index)}
            onDoubleClick={() => handleDoubleClick(file)}
          >
            <div className="file-icon">
              {(() => {
                const IconComponent = getFileIcon(file)
                return <IconComponent size={32} />
              })()}
            </div>
            <div className="file-name">{file.name}</div>
            {view === 'list' && (
              <>
                <div className="file-size">{file.size}</div>
                <div className="file-modified">{file.modified}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}