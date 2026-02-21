import { useState } from 'react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previous, setPrevious] = useState(null)
  const [operation, setOperation] = useState(null)

  const inputNumber = (num) => {
    if (display === '0') {
      setDisplay(num.toString())
    } else {
      setDisplay(display + num)
    }
  }

  const inputOperation = (op) => {
    if (previous === null) {
      setPrevious(parseFloat(display))
      setDisplay('0')
    } else if (operation) {
      const current = parseFloat(display)
      const result = calculate(previous, current, operation)
      setDisplay(result.toString())
      setPrevious(result)
    }
    setOperation(op)
  }

  const calculate = (first, second, op) => {
    switch (op) {
      case '+': return first + second
      case '-': return first - second
      case '*': return first * second
      case '/': return second !== 0 ? first / second : 'Error'
      default: return second
    }
  }

  const equals = () => {
    const current = parseFloat(display)
    if (previous !== null && operation) {
      const result = calculate(previous, current, operation)
      setDisplay(result.toString())
      setPrevious(null)
      setOperation(null)
    }
  }

  const clear = () => {
    setDisplay('0')
    setPrevious(null)
    setOperation(null)
  }

  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  const decimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  return (
    <div className="calculator">
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        <button onClick={clear} className="calc-btn clear">C</button>
        <button onClick={backspace} className="calc-btn">⌫</button>
        <button onClick={() => inputOperation('/')} className="calc-btn op">÷</button>
        <button onClick={() => inputNumber(7)} className="calc-btn">7</button>
        <button onClick={() => inputNumber(8)} className="calc-btn">8</button>
        <button onClick={() => inputNumber(9)} className="calc-btn">9</button>
        <button onClick={() => inputOperation('*')} className="calc-btn op">×</button>
        <button onClick={() => inputNumber(4)} className="calc-btn">4</button>
        <button onClick={() => inputNumber(5)} className="calc-btn">5</button>
        <button onClick={() => inputNumber(6)} className="calc-btn">6</button>
        <button onClick={() => inputOperation('-')} className="calc-btn op">−</button>
        <button onClick={() => inputNumber(1)} className="calc-btn">1</button>
        <button onClick={() => inputNumber(2)} className="calc-btn">2</button>
        <button onClick={() => inputNumber(3)} className="calc-btn">3</button>
        <button onClick={() => inputOperation('+')} className="calc-btn op">+</button>
        <button onClick={() => inputNumber(0)} className="calc-btn zero">0</button>
        <button onClick={decimal} className="calc-btn">.</button>
        <button onClick={equals} className="calc-btn equals">=</button>
      </div>
    </div>
  )
}