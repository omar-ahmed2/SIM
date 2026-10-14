import React, { useState, useMemo } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import type { WardAlert, WardInfant, AlertCategory } from '../../types/dashboard'
import type { ClinicianUser } from '../../types/auth'
import { audioAlarmManager } from './AudioAlarmManager'
import { CameraAiEventDetailModal } from './CameraAiEventDetailModal'

interface ClinicalAlertsTriageViewProps {
  alerts: WardAlert[]
  infants?: WardInfant[]
  currentUser: ClinicianUser
  onAcknowledgeAlert: (alertId: string) => void
  onTriggerAlert?: (alert: WardAlert) => void
  onMarkFalseAlarm: (alertId: string, reason?: string) => void
  onResolveAlert: (alertId: string, notes?: string) => void
}

type TabType = 'active' | 'in_progress' | 'history'

export const ClinicalAlertsTriageView: React.FC<ClinicalAlertsTriageViewProps> = ({
  alerts,
  infants = [],
  currentUser,
  onAcknowledgeAlert,
  onMarkFalseAlarm,
  onResolveAlert,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const [categoryFilter, setCategoryFilter] = useState<'all' | AlertCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlertForClip, setSelectedAlertForClip] = useState<WardAlert | null>(null)
  const [isAudioMuted, setIsAudioMuted] = useState(audioAlarmManager.getIsMuted())

  const handleToggleAudio = () => {
    const muted = audioAlarmManager.toggleMute()
    setIsAudioMuted(muted)
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const active = alerts.filter(
      (a) => !a.acknowledged && a.triageStatus !== 'resolved' && a.triageStatus !== 'false_alarm'
    )
    const inProgress = alerts.filter((a) => a.triageStatus === 'in_progress')
    const resolved = alerts.filter(
      (a) => a.triageStatus === 'resolved' || a.triageStatus === 'false_alarm'
    )
    const criticalCount = active.filter((a) => a.severity === 'critical').length
    const warningCount = active.filter((a) => a.severity === 'warning').length

    // Dynamic active cameras derived from actual registered infant bays
    const activeBays = new Set(infants.map((i) => i.incubatorNumber).filter(Boolean))
    const activeCamerasCount = activeBays.size

    // Dynamic average AI confidence derived from actual alerts
    const alertsWithConfidence = alerts.filter(
      (a) => typeof a.aiConfidence === 'number' && a.aiConfidence > 0
    )
    const avgConfidence =
      alertsWithConfidence.length > 0
        ? (
            alertsWithConfidence.reduce((acc, a) => acc + (a.aiConfidence || 0), 0) /
            alertsWithConfidence.length
          ).toFixed(1)
        : null

    return {
      activeCount: active.length,
      inProgressCount: inProgress.length,
      resolvedCount: resolved.length,
      criticalCount,
      warningCount,
      activeCamerasCount,
      avgConfidence,
    }
  }, [alerts, infants])

  // Filter alerts based on tab, category, and search
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Tab filter
      if (activeTab === 'active') {
        if (alert.acknowledged || alert.triageStatus === 'resolved' || alert.triageStatus === 'false_alarm') {
          return false
        }
      } else if (activeTab === 'in_progress') {
        if (alert.triageStatus !== 'in_progress') {
          return false
        }
      } else if (activeTab === 'history') {
        if (alert.triageStatus !== 'resolved' && alert.triageStatus !== 'false_alarm') {
          return false
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && alert.category !== categoryFilter) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = alert.infantName.toLowerCase().includes(q)
        const matchesTitle = alert.title.toLowerCase().includes(q)
        const matchesInc = alert.incubatorNumber ? alert.incubatorNumber.toLowerCase().includes(q) : false
        const matchesCamera = alert.cameraName ? alert.cameraName.toLowerCase().includes(q) : false
        if (!matchesName && !matchesTitle && !matchesInc && !matchesCamera) {
          return false
        }
      }

      return true
    })
  }, [alerts, activeTab, categoryFilter, searchQuery])

  const handleQuickAcknowledge = (alertId: string) => {
    onAcknowledgeAlert(alertId)
    audioAlarmManager.playAcknowledgmentPing()
  }

  const handleQuickFalseAlarm = (alertId: string) => {
    onMarkFalseAlarm(alertId, 'Caregiver repositioning or benign motion')
    audioAlarmManager.playAcknowledgmentPing()
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Camera AI Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-outline-variant/20 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-on-surface tracking-tight">
              Incubator Camera AI Alerts &amp; Event Review
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-mono text-[11px] font-extrabold flex items-center gap-1">
              <Icon name="auto_awesome" size={13} />
              <span>Vision Core Online</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-0.5">
            Real-time computer vision analysis of infant posture, chest rise, and motor events across all connected bays
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Audio Alarm Toggle */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isAudioMuted
                ? 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                : 'bg-tertiary-fixed/30 text-tertiary border-tertiary/40 shadow-2xs'
            }`}
            title={isAudioMuted ? 'Alert sounds muted - Click to unmute' : 'Alert sound active'}
          >
            <Icon name={isAudioMuted ? 'volume_off' : 'volume_up'} size={16} />
            <span>{isAudioMuted ? 'Muted' : 'Alarm Sound On'}</span>
            {!isAudioMuted && (
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Top AI Vision Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Critical Posture / Apnea */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-error/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-error font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-error animate-ping" />
              <span>Critical Alerts</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
              <Icon name="e911_emergency" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-on-surface">
              {stats.criticalCount}
            </span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Prone suffocation risk or optical apnea pauses
            </p>
          </div>
        </div>

        {/* Card 2: Warning Events */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-warning/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-warning font-mono flex items-center gap-1.5">
              <Icon name="warning" size={14} />
              <span>Movement Warnings</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-warning-container text-on-warning flex items-center justify-center">
              <Icon name="motion_sensor_active" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-on-surface">
              {stats.warningCount}
            </span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Limb jitteriness or incubator door unlatched
            </p>
          </div>
        </div>

        {/* Card 3: Camera Vision Streams */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-secondary/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary font-mono flex items-center gap-1.5">
              <Icon name="videocam" size={14} />
              <span>Active Cameras</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
              <Icon name="nest_cam_iq_outdoor" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-on-surface">
                {stats.activeCamerasCount}
              </span>
              <span className="text-xs font-mono text-secondary font-bold">
                {stats.activeCamerasCount === 0
                  ? '/ 0 Connected'
                  : `/ ${stats.activeCamerasCount} Bays Synced`}
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              {stats.activeCamerasCount === 0
                ? 'No active incubator cameras streaming'
                : 'Infrared 940nm continuous vision feeds'}
            </p>
          </div>
        </div>

        {/* Card 4: AI Model Consensus */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary font-mono flex items-center gap-1.5">
              <Icon name="verified_user" size={14} />
              <span>Model Confidence</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed/30 text-tertiary flex items-center justify-center">
              <Icon name="speed" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-on-surface">
                {stats.avgConfidence !== null ? stats.avgConfidence : '—'}
              </span>
              {stats.avgConfidence !== null && (
                <span className="text-xs font-mono text-tertiary font-bold">%</span>
              )}
            </div>
            <p className="text-[11px] text-tertiary font-semibold mt-0.5">
              {stats.avgConfidence !== null
                ? `Calculated across ${alerts.length} AI incident events`
                : 'Nominal • Awaiting camera events'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Triage Tabs, Search & Category Filters */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3.5 shadow-2xs">
        {/* Tab Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-surface-container-lowest text-on-surface shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Active AI Alerts</span>
              <span
                className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                  stats.activeCount > 0
                    ? 'bg-error text-on-error font-extrabold'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {stats.activeCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'in_progress'
                  ? 'bg-surface-container-lowest text-on-surface shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Under Bedside Care</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container font-mono text-[10px] text-on-surface-variant">
                {stats.inProgressCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-surface-container-lowest text-on-surface shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Resolved &amp; False Alarms</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container font-mono text-[10px] text-on-surface-variant">
                {stats.resolvedCount}
              </span>
            </button>
          </div>

          <span className="text-xs font-mono text-on-surface-variant">
            {filteredAlerts.length} Camera Event{filteredAlerts.length === 1 ? '' : 's'} Listed
          </span>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by infant name, incubator number, camera name..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              All Events
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('posture_risk')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'posture_risk'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Posture &amp; Suffocation
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('apnea_respiratory')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'apnea_respiratory'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Optical Apnea
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('limb_tremor')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'limb_tremor'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Limb Tremor
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('incubator_canopy')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === 'incubator_canopy'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Canopy &amp; Enclosure
            </button>
          </div>
        </div>
      </div>

      {/* 4. Alert Cards List */}
      {filteredAlerts.length === 0 ? (
        <div className="p-10 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-center flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/30 text-tertiary flex items-center justify-center">
            <Icon name="verified_user" size={28} />
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface">
            {activeTab === 'active'
              ? 'No Active Camera AI Alerts'
              : activeTab === 'in_progress'
              ? 'No Incidents Under Bedside Care'
              : 'No Historical Events Found'}
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm">
            All connected cameras are streaming normally. No abnormal posture or respiratory pauses detected at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-error-container/15 border-error/40 shadow-xs'
                  : alert.severity === 'warning'
                  ? 'bg-warning-container/15 border-warning/40 shadow-2xs'
                  : 'bg-surface-container-lowest border-outline-variant/30'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Side: Camera Tag, Infant, AI Detection */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold shadow-2xs ${
                      alert.severity === 'critical'
                        ? 'bg-error text-on-error'
                        : 'bg-warning-container text-on-warning'
                    }`}
                  >
                    <Icon name="videocam" size={22} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-extrabold uppercase tracking-wider ${
                          alert.severity === 'critical'
                            ? 'bg-error text-on-error'
                            : 'bg-warning text-on-warning'
                        }`}
                      >
                        {alert.severity}
                      </span>

                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-surface-container-high">
                        {alert.incubatorNumber}
                      </span>

                      <span className="font-display font-bold text-sm text-on-surface">
                        {alert.infantName}
                      </span>

                      <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-mono text-[10px] font-bold flex items-center gap-1">
                        <Icon name="nest_cam_iq_outdoor" size={12} />
                        <span>{alert.cameraName}</span>
                      </span>

                      <span className="text-[11px] font-mono text-outline">
                        &bull; {alert.timestamp}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-on-surface mt-1 tracking-tight">
                      {alert.title}
                    </h3>

                    {/* AI Explanation */}
                    <p className="text-xs text-on-surface-variant mt-0.5 max-w-2xl leading-relaxed">
                      {alert.aiExplanation}
                    </p>

                    {/* Computer Vision Bounding Box pill */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container-highest border border-outline-variant/30 font-mono text-[10px] font-bold text-on-surface flex items-center gap-1">
                        <Icon name="crop_free" size={12} className="text-secondary" />
                        <span>{alert.boundingBoxLabel}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant font-mono text-[10px] font-bold">
                        AI Confidence: {alert.aiConfidence}%
                      </span>

                      {alert.triageStatus === 'false_alarm' && (
                        <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold">
                          Marked as False Alarm
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: The 3 Core Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    {/* 1. Watch Camera Clip */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedAlertForClip(alert)}
                      iconLeft="play_circle"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Watch Camera Clip
                    </Button>

                    {/* 2. Acknowledge Button */}
                    {!alert.acknowledged && (
                      <button
                        type="button"
                        onClick={() => handleQuickAcknowledge(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold transition-all border border-outline-variant/40 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Icon name="check" size={15} className="text-tertiary" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {/* 3. False Alarm Button */}
                    {alert.triageStatus !== 'false_alarm' && alert.triageStatus !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleQuickFalseAlarm(alert.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-error text-xs font-semibold border border-outline-variant/30 transition-colors cursor-pointer"
                        title="Dismiss as False Alarm"
                      >
                        <Icon name="cancel" size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Synchronized 10-Second Event Replay Modal */}
      <CameraAiEventDetailModal
        alert={selectedAlertForClip}
        isOpen={!!selectedAlertForClip}
        onClose={() => setSelectedAlertForClip(null)}
        currentUser={currentUser}
        onAcknowledge={onAcknowledgeAlert}
        onMarkFalseAlarm={onMarkFalseAlarm}
        onResolve={onResolveAlert}
      />
    </div>
  )
}
export default ClinicalAlertsTriageView
