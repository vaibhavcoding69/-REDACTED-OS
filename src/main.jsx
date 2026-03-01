import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { UserProvider } from './contexts/UserContext'
import MobileBlocker from './components/MobileBlocker'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <MobileDetectWrapper>
        <App />
      </MobileDetectWrapper>
    </UserProvider>
  </StrictMode>,
)

// Wrapper to block mobile devices
function MobileDetectWrapper({ children }) {
  const [isSmallScreen, setIsSmallScreen] = useState(() => window.innerWidth <= 750)

  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth <= 750)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (isSmallScreen) {
    return <MobileBlocker />
  }

  return children
}
