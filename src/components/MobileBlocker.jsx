import { useEffect, useState } from 'react';
import './MobileBlocker.css';

export default function MobileBlocker() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Fade in after mount
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className={`mobile-blocker${visible ? ' visible' : ''}`}>
      <img src="/mobile-page.jpeg" alt="Mobile not supported" />
    </div>
  );
}
