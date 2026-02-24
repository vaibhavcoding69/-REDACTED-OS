import React, { useState } from 'react';
import { 
  MdWifi, 
  MdBluetooth, 
  MdAirplaneTicket, 
  MdBatteryChargingFull, 
  MdWbSunny, 
  MdVolumeUp,
  MdSettings,
  MdKeyboardArrowRight,
  MdNightlight,
  MdAccessibilityNew,
  MdEdit
} from 'react-icons/md';

export default function QuickSettings({ isOpen, onClose }) {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(50);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [saver, setSaver] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="quick-settings-overlay" onClick={onClose}>
      <div className="quick-settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="qs-grid">
          <div className={`qs-item ${wifi ? 'active' : ''}`} onClick={() => setWifi(!wifi)}>
            <div className="qs-icon-wrapper">
              <MdWifi size={20} />
              <div className="qs-split-icon"><MdKeyboardArrowRight size={16} /></div>
            </div>
            <span className="qs-label">{wifi ? 'Airtel_Home' : 'Wi-Fi'}</span>
          </div>

          <div className={`qs-item ${bluetooth ? 'active' : ''}`} onClick={() => setBluetooth(!bluetooth)}>
            <div className="qs-icon-wrapper">
              <MdBluetooth size={20} />
              <div className="qs-split-icon"><MdKeyboardArrowRight size={16} /></div>
            </div>
            <span className="qs-label">Bluetooth</span>
          </div>

          <div className={`qs-item ${airplane ? 'active' : ''}`} onClick={() => setAirplane(!airplane)}>
            <div className="qs-icon-wrapper">
              <MdAirplaneTicket size={20} />
            </div>
            <span className="qs-label">Airplane</span>
          </div>

          <div className={`qs-item ${saver ? 'active' : ''}`} onClick={() => setSaver(!saver)}>
            <div className="qs-icon-wrapper">
              <MdBatteryChargingFull size={20} />
            </div>
            <span className="qs-label">Battery saver</span>
          </div>

          <div className="qs-item" onClick={() => {}}>
            <div className="qs-icon-wrapper">
              <MdNightlight size={20} />
            </div>
            <span className="qs-label">Night light</span>
          </div>

          <div className="qs-item" onClick={() => {}}>
            <div className="qs-icon-wrapper">
              <MdAccessibilityNew size={20} />
            </div>
            <span className="qs-label">Accessibility</span>
          </div>
        </div>

        <div className="qs-sliders">
          <div className="qs-slider-group">
            <MdWbSunny size={20} className="qs-slider-icon" />
            <div className="qs-slider-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={brightness} 
                onChange={(e) => setBrightness(e.target.value)}
                className="qs-slider"
                style={{ '--progress': `${brightness}%` }}
              />
            </div>
          </div>

          <div className="qs-slider-group">
            <MdVolumeUp size={20} className="qs-slider-icon" />
            <div className="qs-slider-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(e.target.value)}
                className="qs-slider"
                style={{ '--progress': `${volume}%` }}
              />
            </div>
          </div>
        </div>

        <div className="qs-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', padding: '0 4px', fontSize: '12px', opacity: 0.8 }}>
          <div className="qs-battery" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MdBatteryChargingFull size={16} />
            <span>82%</span>
          </div>
          <div className="qs-footer-btns" style={{ display: 'flex', gap: '16px' }}>
             <MdEdit size={16} />
             <MdSettings size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
