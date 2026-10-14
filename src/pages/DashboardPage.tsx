import React, { useState, useMemo } from 'react'
import type { ClinicianUser } from '../types/auth'
import type {
  DashboardNavigationTab,
  WardInfant,
  WardAlert,
  AiVideoSession,
  InfantParentsInfo,
} from '../types/dashboard'
import { wardDataService } from '../services/wardDataService'
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { ExecutiveStatsCards } from '../components/dashboard/ExecutiveStatsCards'
import { AlertsTriageSection } from '../components/dashboard/AlertsTriageSection'
import { PatientRosterSection } from '../components/dashboard/PatientRosterSection'
import { RecentAiVideoSection } from '../components/dashboard/RecentAiVideoSection'
import { ChildrenDirectoryView } from '../components/children/ChildrenDirectoryView'
import { ClinicalAlertsTriageView } from '../components/alerts/ClinicalAlertsTriageView'

interface DashboardPageProps {
  user: ClinicianUser
  onSignOut: () => void
  onNavigateHome: () => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onSignOut,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardNavigationTab>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isHeaderAdmitOpen, setIsHeaderAdmitOpen] = useState(false)

  // Reactive Ward Data Store (Zero Mock Data)
  const [wardData, setWardData] = useState(() =>
    wardDataService.getWardData(user.id, user.name)
  )

  // Derive top 4 real metrics dynamically
  const executiveStats = useMemo(
    () => wardDataService.computeExecutiveStats(wardData),
    [wardData]
  )

  // Handlers for Centralized Store Operations
  const handleAdmitPatient = (infant: WardInfant) => {
    const updated = wardDataService.admitInfant(user.id, infant, user.name)
    setWardData(updated)
  }

  const handleUpdateVitals = (
    infantId: string,
    updates: Partial<WardInfant>
  ) => {
    const updated = wardDataService.updateInfantVitals(
      user.id,
      infantId,
      updates,
      user.name
    )
    setWardData(updated)
  }

  const handleDischargeInfant = (infantId: string) => {
    const updated = wardDataService.dischargeInfant(user.id, infantId, user.name)
    setWardData(updated)
  }

  const handleTriggerAlert = (alert: WardAlert) => {
    const updated = wardDataService.triggerAlert(user.id, alert, user.name)
    setWardData(updated)
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    const updated = wardDataService.acknowledgeAlert(user.id, alertId, user.name)
    setWardData(updated)
  }

  const handleMarkFalseAlarm = (alertId: string, reason?: string) => {
    const updated = wardDataService.markFalsePositive(
      user.id,
      alertId,
      user.name,
      reason
    )
    setWardData(updated)
  }

  const handleResolveAlert = (alertId: string, notes?: string) => {
    const updated = wardDataService.resolveAlert(
      user.id,
      alertId,
      user.name,
      notes
    )
    setWardData(updated)
  }

  const handleSaveVideoSession = (session: AiVideoSession) => {
    const updated = wardDataService.logVideoSession(user.id, session, user.name)
    setWardData(updated)
  }

  const handleAddInfantNote = (infantId: string, noteText: string) => {
    const updated = wardDataService.addInfantNote(
      user.id,
      infantId,
      noteText,
      user.name,
      user.role
    )
    setWardData(updated)
  }

  const handleUpdateParentsInfo = (
    infantId: string,
    parentsInfo: InfantParentsInfo
  ) => {
    const updated = wardDataService.updateInfantParentsInfo(
      user.id,
      infantId,
      parentsInfo,
      user.name
    )
    setWardData(updated)
  }

  const handleResetWardData = () => {
    const updated = wardDataService.clearWardData(user.id)
    setWardData(updated)
  }

  // Smooth scroll helper when clicking metric cards
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Filter infants by search query if any
  const filteredInfants = useMemo(() => {
    if (!searchQuery.trim()) return wardData.infants
    const q = searchQuery.toLowerCase()
    return wardData.infants.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.mrn.toLowerCase().includes(q) ||
        i.incubatorNumber.toLowerCase().includes(q)
    )
  }, [wardData.infants, searchQuery])

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 1. Clinical Navigation Sidebar */}
      <DashboardSidebar
        user={user}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLockConsole={onSignOut}
        onNavigateHome={onNavigateHome}
        activeAlertsCount={executiveStats.activeAlerts}
      />

      {/* 2. Main Executive Canvas Area */}
      <div className="pl-0 lg:pl-[260px] flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <DashboardHeader
          user={user}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onAddIncubator={() => {
            if (activeTab === 'children') {
              // Handled by children view admit or global
              setIsHeaderAdmitOpen(true)
            } else {
              setIsHeaderAdmitOpen(true)
            }
          }}
          onSignOut={onSignOut}
          onNavigateHome={onNavigateHome}
          onClearData={handleResetWardData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Dynamic Viewport */}
        <main className="pt-16 bg-surface min-h-screen flex-1 flex flex-col">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
            {activeTab === 'children' ? (
              /* CHILDREN ROSTER & INFANT PROFILE DRILL-DOWN */
              <ChildrenDirectoryView
                user={user}
                wardData={wardData}
                onAdmitPatient={handleAdmitPatient}
                onUpdateVitals={handleUpdateVitals}
                onDischargeInfant={handleDischargeInfant}
                onAddNote={handleAddInfantNote}
                onUpdateParentsInfo={handleUpdateParentsInfo}
                onAcknowledgeAlert={handleAcknowledgeAlert}
              />
            ) : activeTab === 'alerts' ? (
              /* ALERTS TRIAGE FULL DEDICATED VIEW */
              <ClinicalAlertsTriageView
                alerts={wardData.alerts}
                infants={wardData.infants}
                currentUser={user}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onTriggerAlert={handleTriggerAlert}
                onMarkFalseAlarm={handleMarkFalseAlarm}
                onResolveAlert={handleResolveAlert}
              />
            ) : (
              /* EXECUTIVE CENTRAL DASHBOARD OVERVIEW */
              <>
                {/* Facility & Shift Lead Status Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
                  <div>
                    <h1 className="font-display font-extrabold text-xl sm:text-2xl text-on-surface tracking-tight">
                      Good day, {user.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                      {user.hospitalName || "Children's Pavilion Hospital"} • {user.department || 'NICU Intensive Care'} — Central Station Executive Overview
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed/30 text-tertiary text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                      <span>Station Alpha Operational</span>
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/30">
                      Shift Active
                    </span>
                  </div>
                </div>

                {/* TOP 4 EXECUTIVE REAL METRIC CARDS (ZERO MOCK DATA) */}
                <ExecutiveStatsCards
                  stats={executiveStats}
                  onNavigateToSection={(sectionId) => {
                    if (sectionId === 'patient-roster-section') {
                      setActiveTab('children')
                    } else if (sectionId === 'alerts-triage-section') {
                      setActiveTab('alerts')
                    } else {
                      handleScrollToSection(sectionId)
                    }
                  }}
                />

                {/* SECTION 1: CLINICAL ALERTS & AI TRIAGE (SELF-CONTAINED) */}
                <AlertsTriageSection
                  alerts={wardData.alerts}
                  infants={wardData.infants}
                  currentUser={user}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                  onTriggerAlert={handleTriggerAlert}
                  onMarkFalseAlarm={handleMarkFalseAlarm}
                  onResolveAlert={handleResolveAlert}
                  onNavigateToAlerts={() => setActiveTab('alerts')}
                />

                {/* SECTION 2: ADMITTED INFANTS & INCUBATOR BAYS (SELF-CONTAINED) */}
                <PatientRosterSection
                  infants={filteredInfants}
                  onAdmitPatient={handleAdmitPatient}
                  onUpdateVitals={handleUpdateVitals}
                  onDischargeInfant={handleDischargeInfant}
                  isExternalModalOpen={isHeaderAdmitOpen}
                  onCloseExternalModal={() => setIsHeaderAdmitOpen(false)}
                />

                {/* SECTION 3: AI VIDEO ANALYSIS & SHIFT AUDIT TRAIL (SELF-CONTAINED) */}
                <RecentAiVideoSection
                  videoSessions={wardData.videoSessions}
                  activities={wardData.activities}
                  infants={wardData.infants}
                  onSaveVideoSession={handleSaveVideoSession}
                  onTriggerAlert={handleTriggerAlert}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
export default DashboardPage
