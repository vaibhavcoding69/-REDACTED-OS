import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const formatDate = (d) => d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const hour = time.getHours() % 12
  const minute = time.getMinutes()
  const second = time.getSeconds()

  const hourAngle = (hour * 30) + (minute * 0.5)
  const minuteAngle = minute * 6
  const secondAngle = second * 6

  return (
    <div className="clock-app">
      <div className="analog-clock">
        <div className="clock-face">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="hour-mark"
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="minute-mark"
              style={{ transform: `rotate(${i * 6}deg)` }}
            />
          ))}
          <div className="hand hour-hand" style={{ transform: `rotate(${hourAngle}deg)` }} />
          <div className="hand minute-hand" style={{ transform: `rotate(${minuteAngle}deg)` }} />
          <div className="hand second-hand" style={{ transform: `rotate(${secondAngle}deg)` }} />
          <div className="center-dot" />
        </div>
      </div>
      <div className="digital-clock">
        <div className="digital-time">{formatTime(time)}</div>
        <div className="digital-date">{formatDate(time)}</div>
      </div>
      <div className="time-zones">
        <h3>World Time</h3>
        <div className="tz-item">
          <span>London</span>
          <span>{new Date(time.getTime() + (0 - time.getTimezoneOffset()) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="tz-item">
          <span>New York</span>
          <span>{new Date(time.getTime() + (-5 * 60 - time.getTimezoneOffset()) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="tz-item">
          <span>Tokyo</span>
          <span>{new Date(time.getTime() + (9 * 60 - time.getTimezoneOffset()) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}