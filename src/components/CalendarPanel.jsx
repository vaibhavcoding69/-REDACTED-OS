import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdNotificationsPaused, MdMoreHoriz, MdSettings } from 'react-icons/md';

export default function CalendarPanel({ isOpen, onClose }) {
  const [date, setDate] = useState(new Date());

  if (!isOpen) return null;

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const monthName = date.toLocaleString('default', { month: 'long' });

  const prevMonthDays = daysInMonth(currentYear, currentMonth - 1);
  const thisMonthDays = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  // Previous month padding
  for (let i = startDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, current: false });
  }
  // Current month
  for (let i = 1; i <= thisMonthDays; i++) {
    calendarDays.push({ day: i, current: true, today: i === new Date().getDate() && currentMonth === new Date().getMonth() });
  }
  // Next month padding
  const totalSlots = 42; // 6 rows
  const nextPadding = totalSlots - calendarDays.length;
  for (let i = 1; i <= nextPadding; i++) {
    calendarDays.push({ day: i, current: false });
  }

  return (
    <div className="calendar-panel-overlay" onClick={onClose}>
      <div className="calendar-panel" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header-section">
          <div className="calendar-title" style={{ fontSize: '14px', fontWeight: 600 }}>Notifications</div>
          <div className="calendar-notif-btns" style={{ display: 'flex', gap: '8px' }}>
            <button className="notif-btn" style={{ background: 'transparent', border: 'none', color: '#fff' }}><MdNotificationsPaused size={16} /></button>
            <button className="notif-btn clear-all" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#ccc', fontSize: '12px', padding: '4px 12px', borderRadius: '4px' }}>Clear all</button>
          </div>
        </div>
        
        <div className="calendar-notifications">
          <div className="notif-item-modern">
            <div className="notif-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#aaa', marginBottom: '8px' }}>
              <img src="https://img.icons8.com/color/48/microsoft-edge.png" width={14} alt="" />
              <span>Microsoft Edge</span>
              <span style={{ marginLeft: 'auto' }}>Now</span>
              <MdKeyboardArrowDown />
            </div>
            <div className="notif-body">
              <div className="notif-text-main" style={{ fontSize: '13px', fontWeight: 500 }}>System Update Available</div>
              <div className="notif-text-sub" style={{ fontSize: '12px', color: '#aaa' }}>Restart your PC to apply the latest security updates.</div>
            </div>
          </div>
        </div>

        <div className="calendar-section">
          <div className="calendar-month-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="month-display" style={{ fontSize: '14px', fontWeight: 600 }}>{date.toLocaleString('default', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            <div className="month-controls" style={{ opacity: 0.6 }}><MdKeyboardArrowUp size={20} /></div>
          </div>
          
          <div className="calendar-grid-container">
            <div className="calendar-month-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px', padding: '0 8px' }}>
              {monthName} {currentYear}
              <div className="month-arrows" style={{ display: 'flex', gap: '8px' }}>
                 <MdKeyboardArrowUp size={16} />
                 <MdKeyboardArrowDown size={16} />
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
