import { useState, useEffect } from 'react'
import LockScreen from './components/LockScreen'
import UnlockOverlay from './components/UnlockOverlay'
import Desktop from './components/Desktop'
import './App.css'
import './components/components.css'

/**
 * App state machine:
 *   locked   = lock screen visible, no input
 *   unlocking = lock screen shown with password panel
 *   desktop  = logged in
 */
function App() {
  const [phase, setPhase] = useState('locked')

  // Global keyboard listener
  useEffect(() => {
    const onKey = (e) => {
      if (
        phase === 'locked' &&
        (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowUp')
      ) {
        e.preventDefault()
        setPhase('unlocking')
      }
      if (phase === 'unlocking' && e.code === 'Escape') {
        setPhase('locked')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  const handleScreenClick = () => {
    if (phase === 'locked') setPhase('unlocking')
  }

  if (phase === 'desktop') {
    return <Desktop onLock={() => setPhase('locked')} />
  }

  return (
    <div
      className={`app-root ${phase === 'desktop' ? 'phase-desktop' : ''}`}
      onClick={phase === 'locked' ? handleScreenClick : undefined}
    >
      <LockScreen 
        unlocking={phase === 'unlocking' ? true : (phase === 'desktop' ? 'desktop' : false)} 
        onUnlock={() => setPhase('unlocking')}
      />
      {phase === 'unlocking' && (
        <UnlockOverlay
          onUnlock={() => setPhase('desktop')}
          onCancel={() => setPhase('locked')}
        />
      )}
    </div>
  )
}

export default App
