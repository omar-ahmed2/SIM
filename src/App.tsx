import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import type { ClinicianUser } from './types/auth'
import { authStorage } from './services/authStorage'

export type AppView = 'landing' | 'auth' | 'dashboard'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [currentUser, setCurrentUser] = useState<ClinicianUser | null>(() => {
    return authStorage.getActiveUser()
  })

  // Synchronize hash with application view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase()
      const active = currentUser || authStorage.getActiveUser()

      if (hash === '#signin' || hash === '#signup') {
        // If clinician already has an active session, route straight to dashboard
        if (active) {
          if (!currentUser) setCurrentUser(active)
          setCurrentView('dashboard')
          window.location.hash = '#dashboard'
        } else {
          setAuthMode(hash === '#signup' ? 'signup' : 'signin')
          setCurrentView('auth')
        }
      } else if (hash === '#dashboard') {
        if (active) {
          if (!currentUser) setCurrentUser(active)
          setCurrentView('dashboard')
        } else {
          setAuthMode('signin')
          setCurrentView('auth')
          window.location.hash = '#signin'
        }
      } else {
        // Any landing page anchor (#home, #features, #technology, #how-it-works, #privacy, #faq, or empty)
        if (active && !currentUser) {
          setCurrentUser(active)
        }
        setCurrentView('landing')
      }
    }

    // Check initial hash on mount
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentUser])

  // Navigation handlers
  const handleNavigateSignIn = () => {
    setAuthMode('signin')
    setCurrentView('auth')
    window.location.hash = '#signin'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateSignUp = () => {
    setAuthMode('signup')
    setCurrentView('auth')
    window.location.hash = '#signup'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHome = () => {
    setCurrentView('landing')
    window.location.hash = '#home'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateDashboard = () => {
    setCurrentView('dashboard')
    window.location.hash = '#dashboard'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthSuccess = (user: ClinicianUser) => {
    authStorage.setActiveUser(user)
    setCurrentUser(user)
    setCurrentView('dashboard')
    window.location.hash = '#dashboard'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSignOut = () => {
    authStorage.clearActiveUser()
    setCurrentUser(null)
    setAuthMode('signin')
    setCurrentView('auth')
    window.location.hash = '#signin'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Render view
  if (currentView === 'dashboard' && currentUser) {
    return (
      <DashboardPage
        user={currentUser}
        onSignOut={handleSignOut}
        onNavigateHome={handleNavigateHome}
      />
    )
  }

  if (currentView === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
        onNavigateHome={handleNavigateHome}
      />
    )
  }

  return (
    <LandingPage
      currentUser={currentUser}
      onNavigateSignIn={handleNavigateSignIn}
      onNavigateSignUp={handleNavigateSignUp}
      onNavigateDashboard={handleNavigateDashboard}
      onSignOut={handleSignOut}
    />
  )
}

export default App
