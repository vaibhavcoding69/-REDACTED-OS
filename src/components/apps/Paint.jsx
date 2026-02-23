import { useRef, useState, useEffect } from 'react'
import { MdBrush, MdDelete, MdSave, MdClear } from 'react-icons/md'

export default function Paint() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState('brush') // brush, eraser

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveImage = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="paint-app">
      <div className="paint-toolbar">
        <div className="tool-group">
          <button
            className={tool === 'brush' ? 'active' : ''}
            onClick={() => setTool('brush')}
          >
            <MdBrush size={18} /> Brush
          </button>
          <button
            className={tool === 'eraser' ? 'active' : ''}
            onClick={() => setTool('eraser')}
          >
            <MdClear size={18} /> Eraser
          </button>
        </div>
        <div className="color-group">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <span>{brushSize}px</span>
        </div>
        <div className="action-group">
          <button onClick={clearCanvas}>
            <MdDelete size={18} /> Clear
          </button>
          <button onClick={saveImage}>
            <MdSave size={18} /> Save
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="paint-canvas"
      />
    </div>
  )
}