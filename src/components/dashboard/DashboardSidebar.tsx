import React from 'react'
import { Icon } from '../ui/Icon'
import type { ClinicianUser } from '../../types/auth'
import type { DashboardNavigationTab } from '../../types/dashboard'

interface DashboardSidebarProps {
  user: ClinicianUser
  activeTab: DashboardNavigationTab
  onSelectTab: (tab: DashboardNavigationTab) => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  onLockConsole?: () => void
  onNavigateHome?: () => void
  activeAlertsCount?: number
}

interface NavSection {
  title: string
  items: {
    id: DashboardNavigationTab
    label: string
    icon: string
    badge?: {
      text?: string
      type: 'live' | 'alert' | 'count'
    }
  }[]
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
  onLockConsole,
  onNavigateHome,
  activeAlertsCount = 0,
}) => {
  const userInitial = user.name.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'

  const navSections: NavSection[] = [
    {
      title: 'Clinical Operations',
      items: [
        { id: 'dashboard', label: 'Overview', icon: 'grid_view' },
        {
          id: 'live-monitoring',
          label: 'Live Stream',
          icon: 'videocam',
          badge: { type: 'live', text: 'LIVE' },
        },
        { id: 'children', label: 'Childrens', icon: 'child_care' },
        {
          id: 'alerts',
          label: 'Alerts',
          icon: 'notifications_active',
          badge: {
            type: 'alert',
            text: activeAlertsCount > 0 ? String(activeAlertsCount) : '0',
          },
        },
      ],
    },
    {
      title: 'Ward Management',
      items: [
        { id: 'rooms-and-beds', label: 'Beds', icon: 'single_bed' },
        { id: 'medications', label: 'Medications', icon: 'medication' },
        { id: 'reports', label: 'Reports', icon: 'clinical_notes' },
      ],
    },
    {
      title: 'Preferences',
      items: [{ id: 'settings', label: 'Settings', icon: 'tune' }],
    },
  ]

  return (
    <>
      {/* Mobile Backdrop with Smooth Blur */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Clinical Sidebar Shell */}
      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest/95 backdrop-blur-md z-50 flex flex-col justify-between shadow-[1px_0_12px_rgba(0,0,0,0.05)] border-r border-outline-variant/30 transition-transform duration-300 ease-out select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Clinical Navigation Sidebar"
      >
        {/* Top Scrollable Content */}
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
          {/* Brand Header & Station Badge */}
          <div className="p-4 pb-3 border-b border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={onNavigateHome}
                title="Go to Public Landing Page"
              >
                {/* Luminous Logo Container */}
                <div className="relative group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
                    <Icon name="nest_cam_iq_outdoor" size={20} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-surface-container-lowest animate-pulse" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-extrabold text-base text-primary tracking-tight group-hover:underline">
                      SIM.AI
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-primary font-mono text-[9px] font-extrabold tracking-wide uppercase">
                      NICU
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium tracking-tight">
                    Incubator Vision Core
                  </span>
                </div>
              </div>

              {/* Mobile Close Button */}
              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                  aria-label="Close navigation"
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </div>

            {/* Station Status Micro-Pill */}
            <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
                </span>
                <span className="font-mono text-[10px] font-semibold text-on-surface">
                  Station Alpha
                </span>
              </div>
              <span className="font-mono text-[9px] text-tertiary font-bold uppercase tracking-wider">
                Online
              </span>
            </div>
          </div>

          {/* Grouped Navigation Links */}
          <div className="py-3 px-3 space-y-4">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {/* Section Header */}
                <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 font-mono block">
                  {section.title}
                </span>

                {/* Items */}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id)
                          onCloseMobile?.()
                        }}
                        className={`w-full group flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-150 font-sans text-xs cursor-pointer relative ${
                          isActive
                            ? 'bg-primary-container text-on-primary font-bold shadow-xs shadow-primary/20'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Left Active Glow Pill */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-on-primary" />
                        )}

                        <div className="flex items-center gap-2.5">
                          <div
                            className={`transition-transform duration-150 group-hover:scale-110 ${
                              isActive ? 'text-on-primary' : 'text-on-surface-variant group-hover:text-primary'
                            }`}
                          >
                            <Icon name={item.icon} size={18} />
                          </div>
                          <span className="tracking-tight">{item.label}</span>
                        </div>

                        {/* Optional Right Badges */}
                        {item.badge && (
                          <div>
                            {item.badge.type === 'live' && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold tracking-wider flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-on-primary text-primary'
                                    : 'bg-tertiary-fixed text-tertiary'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                <span>{item.badge.text}</span>
                              </span>
                            )}

                            {item.badge.type === 'alert' && (
                              <span
                                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-extrabold ${
                                  isActive
                                    ? 'bg-on-primary text-error'
                                    : 'bg-error-container text-error'
                                }`}
                              >
                                {item.badge.text}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Shift & Clinician Station Profile Card */}
        <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low/50">
          <div className="bg-surface-container-lowest rounded-2xl p-2.5 shadow-2xs border border-outline-variant/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Doctor Avatar Pill */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-container to-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {userInitial}
              </div>

              <div className="flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-on-surface truncate leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-on-surface-variant truncate font-medium">
                  {user.department || 'NICU Care'}
                </span>
              </div>
            </div>

            {/* Quick Lock Console Button */}
            {onLockConsole && (
              <button
                type="button"
                onClick={onLockConsole}
                className="w-7 h-7 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Lock Console / Sign Out"
                aria-label="Lock console"
              >
                <Icon name="lock" size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default DashboardSidebar
