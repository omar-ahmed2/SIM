import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { AuthHeroCard } from '../components/auth/AuthHeroCard'
import { SignInForm } from '../components/auth/SignInForm'
import { SignUpForm } from '../components/auth/SignUpForm'
import type { ClinicianUser } from '../types/auth'

interface AuthPageProps {
  initialMode?: 'signin' | 'signup'
  onAuthSuccess: (user: ClinicianUser) => void
  onNavigateHome: () => void
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
  onNavigateHome,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [prefillEmail, setPrefillEmail] = useState<string>('')

  const handleSignUpSuccess = (registeredEmail: string) => {
    setPrefillEmail(registeredEmail)
    setSuccessMessage(
      'Account created successfully! Your clinician credentials are now active. Please sign in.'
    )
    setAuthMode('signin')
  }

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Header Bar */}
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Return Link */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer mr-1"
              aria-label="Back to home"
            >
              <Icon name="arrow_back" size={18} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-xs">
                <Icon name="nest_cam_iq_outdoor" size={20} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-display font-extrabold text-lg text-primary tracking-tight">
                    SIM.AI
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                    NICU Suite
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant font-medium hidden sm:inline-block mt-0.5">
                  Smart Neonatal Intensive Care Platform
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Security Badges */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs text-on-surface-variant border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span className="font-medium">HIPAA Certified &amp; Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Authentication Canvas */}
      <main className="flex-1 flex items-center justify-center py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Telemetry Card */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <AuthHeroCard />
          </div>

          {/* Right Column: Interactive Clinician Auth Card */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 sm:p-9 shadow-xs">
              {/* Card Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-display font-extrabold text-primary text-xl tracking-tight">
                    SIM.AI
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">
                    NICU Suite
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-bold text-on-surface tracking-tight">
                  {authMode === 'signin' ? 'Clinician Portal Sign In' : 'Register Clinician Account'}
                </h1>

                <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  {authMode === 'signin'
                    ? 'Welcome back, Doctor. Enter your verified credentials to access live incubator telemetry and patient records.'
                    : 'Enter your verified clinical credentials to connect to the SIM.AI incubator monitoring network.'}
                </p>
              </div>

              {/* Success Notification Alert */}
              {successMessage && (
                <div
                  role="status"
                  className="mb-6 p-4 rounded-xl bg-tertiary-fixed/30 border border-tertiary/30 text-on-surface flex items-start gap-3 animate-in fade-in-50"
                >
                  <Icon name="check_circle" size={20} className="text-tertiary shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                    {successMessage}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccessMessage(null)}
                    className="text-on-surface-variant hover:text-on-surface p-0.5"
                    aria-label="Dismiss alert"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>
              )}

              {/* Segmented Pill Toggle Switch */}
              <div className="bg-surface-container-low p-1 rounded-xl flex items-center mb-6" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'signin'}
                  onClick={() => {
                    setAuthMode('signin')
                    setSuccessMessage(null)
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'signin'
                      ? 'text-on-primary bg-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Icon name="login" size={18} />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'signup'}
                  onClick={() => {
                    setAuthMode('signup')
                    setSuccessMessage(null)
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'signup'
                      ? 'text-on-primary bg-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Icon name="person_add" size={18} />
                  <span>Sign Up</span>
                </button>
              </div>

              {/* Render Respective Forms with Smooth Transition */}
              <AnimatePresence mode="wait">
                {authMode === 'signin' ? (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SignInForm
                      onSuccess={onAuthSuccess}
                      onSwitchToSignUp={() => {
                        setAuthMode('signup')
                        setSuccessMessage(null)
                      }}
                      prefillEmail={prefillEmail}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SignUpForm
                      onSuccess={handleSignUpSuccess}
                      onSwitchToSignIn={() => {
                        setAuthMode('signin')
                        setSuccessMessage(null)
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Legal & Compliance Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div>&copy; {new Date().getFullYear()} SIM.AI Neonatal Telemetry Systems. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#clinical-guidelines" className="hover:text-primary transition-colors">
              Clinical Guidelines
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default AuthPage
