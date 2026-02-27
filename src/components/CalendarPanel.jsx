import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdNotificationsPaused, MdMoreHoriz, MdSettings } from 'react-icons/md';

export default function CalendarPanel({ isOpen, onClose }) {
  const [date, setDate] = useState(new Date());
  const [notifications, setNotifications] = useState([
    {
      id: 'edge-update',
      app: 'Microsoft Edge',
      icon: 'https://img.icons8.com/color/48/microsoft-edge.png',
      time: 'Now',
      title: 'System Update Available',
      subtitle: 'Restart your PC to apply the latest security updates.'
    },
    {
      id: 'mail-report',
      app: 'Mail',
      icon: 'https://img.icons8.com/fluency/48/mail.png',
      time: '2m',
      title: 'Weekly Report',
      subtitle: 'Here is the summary of your weekly activities...'
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      setDate(new Date());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const monthName = date.toLocaleString('default', { month: 'long' });

  const handlePrevMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Days in month logic
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonthDays = daysInMonth(currentYear, currentMonth - 1);
  const thisMonthDays = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];

  // Previous month padding
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, current: false });
  }

  // Current month days
  const today = new Date();
  for (let i = 1; i <= thisMonthDays; i++) {
    const isToday = 
      i === today.getDate() && 
      currentMonth === today.getMonth() && 
      currentYear === today.getFullYear();
    
    calendarDays.push({ day: i, current: true, today: isToday });
  }

  // Next month padding to fill 42 slots (6 weeks)
  const totalSlots = 42; 
  const nextPadding = totalSlots - calendarDays.length;
  for (let i = 1; i <= nextPadding; i++) {
    calendarDays.push({ day: i, current: false });
  }

  return (
    <div className="calendar-panel-overlay" onClick={onClose}>
      <div className="calendar-panel" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
        
        {/* Notifications Section */}
        <div className="calendar-header-section">
          <div className="calendar-title">Notifications</div>
          <div className="calendar-notif-btns">
            <button type="button" className="notif-btn" title="Focus Assist"><MdNotificationsPaused size={16} /></button>
            <button type="button" className="notif-btn clear-all" onClick={() => setNotifications([])}>Clear all</button>
          </div>
        </div>

        <div className="calendar-notifications">
          {notifications.length === 0 ? (
            <div className="notif-empty">No new notifications</div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className="notif-item-modern">
                <div className="notif-header">
                  <img src={item.icon} width={14} alt="" />
                  <span>{item.app}</span>
                  <span style={{ marginLeft: 'auto' }}>{item.time}</span>
                  <MdMoreHoriz />
                </div>
                <div className="notif-body">
                  <div className="notif-text-main">{item.title}</div>
                  <div className="notif-text-sub">{item.subtitle}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calendar Section */}
        <div className="calendar-section">
          {/* Top Date Display (e.g. "Wednesday, February 26") */}
          <div className="calendar-month-header">
            <div className="month-display">
              {date.toLocaleString('default', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="month-controls" onClick={() => setDate(new Date())} title="Go to today">
               {/* Icon to collapse calendar could go here, or just empty space */}
            </div>
          </div>

          <div className="calendar-grid-container">
            {/* Month Label with Arrows */}
            <div className="calendar-month-label">
              <span>{monthName} {currentYear}</span>
              <div className="month-arrows">
                 <button type="button" className="cal-arrow-btn" onClick={handlePrevMonth}><MdKeyboardArrowUp size={18} /></button>
                 <button type="button" className="cal-arrow-btn" onClick={handleNextMonth}><MdKeyboardArrowDown size={18} /></button>
              </div>
            </div>

            <div className="calendar-weekdays">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="calendar-days">
              {calendarDays.map((d, i) => (
                <div 
                  key={i} 
                  className={`cal-day ${!d.current ? 'other-month' : ''} ${d.today ? 'today' : ''}`}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
