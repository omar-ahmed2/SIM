import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import type { ClinicianUser } from '../../types/auth'

interface NavbarProps {
  currentUser?: ClinicianUser | null
  onSignInClick?: () => void
  onSignUpClick?: () => void
  onNavigateDashboard?: () => void
  onSignOut?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSignInClick,
  onSignUpClick,
  onNavigateDashboard,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const userInitial = currentUser?.name
    ? currentUser.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'
    : 'D'

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Concise, well-spaced navigation links
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Technology', href: '#technology' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Security & Privacy', href: '#privacy' },
    { label: 'FAQ', href: '#faq' },
  ]

  // Detect scroll to toggle sticky blur elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40 shadow-xs py-3'
          : 'bg-surface/75 backdrop-blur-md border-b border-outline-variant/20 py-4'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* 1. Brand / Logo: Clean, uncluttered, iconic */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl py-1 shrink-0"
            aria-label="SIM.AI Incubator Monitor Home"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-container text-on-primary shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Icon name="nest_cam_iq_outdoor" size={22} />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-xl text-on-surface tracking-tight">
                SIM<span className="text-primary-container">.AI</span>
              </span>
              <span className="text-xs font-medium text-on-surface-variant hidden sm:inline-block border-l border-outline-variant/60 pl-2">
                Incubator Monitor
              </span>
            </div>
          </a>

          {/* 2. Desktop Navigation: Generous breathing room, concise text */}
          <nav
            className="hidden lg:flex items-center gap-8 xl:gap-10"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-1.5 px-1 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </a>
            ))}
          </nav>

          {/* 3. Action Controls: Reactive to Clinician Session */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {/* 1-Click Return to Active Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateDashboard) onNavigateDashboard()
                    else window.location.hash = '#dashboard'
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <Icon name="grid_view" size={16} />
                  <span>
                    <span className="hidden sm:inline">Clinical </span>Dashboard
                  </span>
                </button>

                {/* Logged in Clinician Chip & Quick Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-all cursor-pointer select-none"
                    aria-label="User session menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                    <span className="text-xs font-bold text-on-surface truncate max-w-30 hidden md:inline">
                      {currentUser.name}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {userInitial}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-4 py-2 border-b border-outline-variant/20">
                        <p className="text-xs font-bold text-on-surface truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-tertiary font-medium truncate">{currentUser.role}</p>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            if (onNavigateDashboard) onNavigateDashboard()
                            else window.location.hash = '#dashboard'
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors cursor-pointer font-medium"
                        >
                          <Icon name="dashboard" size={16} className="text-primary" />
                          <span>Open Dashboard</span>
                        </button>
                      </div>

                      {onSignOut && (
                        <div className="pt-1 border-t border-outline-variant/20">
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false)
                              onSignOut()
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/40 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <Icon name="logout" size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (onSignInClick) onSignInClick()
                    else window.location.hash = '#signin'
                  }}
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:text-primary hover:bg-surface-container transition-all cursor-pointer"
                >
                  Sign In
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (onSignUpClick) onSignUpClick()
                    else window.location.hash = '#signup'
                  }}
                  className="shadow-sm hover:shadow"
                  iconRight="arrow_forward"
                >
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
              </>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors min-h-11 min-w-11 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer with Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-17 bg-inverse-surface/40 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-Down Menu */}
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-0 right-0 top-17 bg-surface-container-lowest border-b border-outline-variant/40 shadow-2xl z-50 lg:hidden px-5 py-6 max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-between min-h-[48px]"
                  >
                    <span>{link.label}</span>
                    <Icon name="chevron_right" size={18} className="text-on-surface-variant/50" />
                  </a>
                ))}

                <div className="pt-4 mt-2 border-t border-outline-variant/30 flex flex-col gap-3">
                  {currentUser ? (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                        <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary font-bold text-sm flex items-center justify-center">
                          {userInitial}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-on-surface">{currentUser.name}</span>
                          <span className="text-[11px] text-tertiary font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                            Session Active
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        className="w-full justify-center min-h-[48px]"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          if (onNavigateDashboard) onNavigateDashboard()
                          else window.location.hash = '#dashboard'
                        }}
                        iconRight="arrow_forward"
                      >
                        Open Clinical Dashboard
                      </Button>

                      {onSignOut && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            onSignOut()
                          }}
                          className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                        >
                          Sign Out of Session
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          if (onSignInClick) onSignInClick()
                          else window.location.hash = '#signin'
                        }}
                        className="w-full py-3 rounded-xl text-center text-sm font-semibold text-on-surface border border-outline-variant/50 hover:bg-surface-container transition-all cursor-pointer"
                      >
                        Clinician Sign In
                      </button>

                      <Button
                        variant="primary"
                        className="w-full justify-center min-h-[48px]"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          if (onSignUpClick) onSignUpClick()
                          else window.location.hash = '#signup'
                        }}
                        iconRight="person_add"
                      >
                        Create Clinician Account
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
