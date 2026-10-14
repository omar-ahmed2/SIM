import React, { useState, useRef, useEffect } from 'react'
import { Icon } from '../ui/Icon'
import type { ClinicianUser } from '../../types/auth'

interface DashboardHeaderProps {
  user: ClinicianUser
  onOpenMobileMenu?: () => void
  onAddIncubator: () => void
  onSignOut: () => void
  onNavigateHome: () => void
  onClearData?: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onOpenMobileMenu,
  onAddIncubator,
  onSignOut,
  onNavigateHome,
  onClearData,
  searchQuery = '',
  onSearchChange,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Support ⌘K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const userInitial = user.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30 z-40 flex items-center justify-between px-4 sm:px-6 gap-3">
      {/* Left: Mobile Toggle & Breadcrumbs & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={22} />
        </button>

        {/* Clean Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={onNavigateHome}
            className="font-display font-extrabold text-primary tracking-tight hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
            title="Return to Public Landing Page"
          >
            <span>SIM.AI</span>
            <Icon name="open_in_new" size={12} className="opacity-60" />
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface">Neonatal Telemetry</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none flex items-center">
            <Icon name="search" size={18} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full h-9.5 pl-9 pr-12 rounded-xl bg-surface-container-low text-on-surface font-sans text-xs placeholder:text-on-surface-variant/70 border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
            placeholder="Search incubator or baby tag..."
            aria-label="Search"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-mono font-bold text-on-surface-variant shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Add Incubator Action & Clinician Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Clean Add Incubator Button */}
        <button
          type="button"
          onClick={onAddIncubator}
          className="flex items-center gap-1.5 bg-primary-container hover:bg-primary text-on-primary px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Icon name="add" size={18} />
          <span>Add Incubator</span>
        </button>

        {/* Clinician User Profile & Dropdown Menu */}
        <div className="relative pl-1 border-l border-outline-variant/30" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-container transition-all cursor-pointer select-none"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-primary-fixed text-primary font-bold text-sm flex items-center justify-center ring-2 ring-primary/20 shrink-0">
              {userInitial}
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-on-surface leading-tight truncate max-w-[130px]">
                {user.name}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium truncate max-w-[130px]">
                {user.role}
              </span>
            </div>

            <Icon name="expand_more" size={16} className="text-on-surface-variant hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/40 py-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-2.5 border-b border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface truncate">{user.name}</p>
                <p className="text-[11px] font-mono text-on-surface-variant truncate">{user.email}</p>
                <p className="text-[11px] text-tertiary font-semibold mt-1">
                  {user.department || 'Neonatal Care Unit'}
                </p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    onNavigateHome()
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-on-surface hover:bg-surface-container flex items-center justify-between transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="home" size={18} className="text-primary" />
                    <span>Public Landing Page</span>
                  </div>
                  <span className="text-[10px] text-tertiary font-semibold bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                    Active
                  </span>
                </button>
              </div>

              {onClearData && (
                <div className="py-1 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      if (window.confirm('Reset all ward data to clean slate (zero infants, zero alerts)?')) {
                        onClearData()
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-on-surface-variant hover:text-error hover:bg-error-container/20 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Icon name="delete_sweep" size={18} />
                    <span>Reset to Clean Slate</span>
                  </button>
                </div>
              )}

              <div className="pt-1 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    onSignOut()
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-error hover:bg-error-container/40 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Icon name="logout" size={18} className="text-error" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default DashboardHeader
