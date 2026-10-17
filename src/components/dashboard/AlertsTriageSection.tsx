import React, { useState } from 'react'
import { Icon } from '../ui/Icon'
import type { WardAlert, WardInfant } from '../../types/dashboard'
import type { ClinicianUser } from '../../types/auth'
import { audioAlarmManager } from '../alerts/AudioAlarmManager'
import { CameraAiEventDetailModal } from '../alerts/CameraAiEventDetailModal'

interface AlertsTriageSectionProps {
  alerts: WardAlert[]
  infants: WardInfant[]
  currentUser?: ClinicianUser
  onAcknowledgeAlert: (alertId: string) => void
  onTriggerAlert: (alert: WardAlert) => void
  onMarkFalseAlarm?: (alertId: string, reason?: string) => void
  onResolveAlert?: (alertId: string, notes?: string) => void
  onNavigateToAlerts?: () => void
}

export const AlertsTriageSection: React.FC<AlertsTriageSectionProps> = ({
  alerts,
  currentUser,
  onAcknowledgeAlert,
  onMarkFalseAlarm,
  onResolveAlert,
  onNavigateToAlerts,
}) => {
  const activeAlerts = alerts.filter(
    (a) => !a.acknowledged && a.triageStatus !== 'resolved' && a.triageStatus !== 'false_alarm'
  )
  const resolvedAlerts = alerts.filter(
    (a) => a.acknowledged || a.triageStatus === 'resolved' || a.triageStatus === 'false_alarm'
  )

  const [selectedAlertForClip, setSelectedAlertForClip] = useState<WardAlert | null>(null)

  const handleAcknowledge = (alertId: string) => {
    onAcknowledgeAlert(alertId)
    audioAlarmManager.playAcknowledgmentPing()
  }

  const activeUser: ClinicianUser = currentUser || {
    id: 'user_active',
    name: 'Dr. Sarah Jenkins, MD',
    email: 'dr.smith@childrenshospital.org',
    role: 'Doctor / Neonatologist',
    department: 'NICU Intensive Care',
    hospitalName: "Children's Hospital",
    createdAt: new Date().toISOString(),
  }

  return (
    <>
      <section
        id="alerts-triage-section"
        className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                activeAlerts.length > 0
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-tertiary-fixed/30 text-tertiary'
              }`}
            >
              <Icon
                name={activeAlerts.length > 0 ? 'videocam' : 'verified_user'}
                size={20}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-on-surface">
                  Incubator Camera AI Alerts
                </h2>
                {activeAlerts.length > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-mono text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                    <span>{activeAlerts.length} Active</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-mono text-[11px] font-bold">
                    All Cameras Nominal
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant">
                Computer vision optical detection of infant posture, chest rise, and motor movements
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onNavigateToAlerts && (
              <button
                type="button"
                onClick={onNavigateToAlerts}
                className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/30"
              >
                <span>Full Alerts Center</span>
                <Icon name="arrow_forward" size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Content: Empty State or Active Alert Cards */}
        {activeAlerts.length === 0 ? (
          <div className="p-6 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed/30 text-tertiary flex items-center justify-center shrink-0">
                <Icon name="check_circle" size={22} />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-on-surface">
                  All Incubator Feeds Stable
                </span>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  No posture anomalies or respiratory pauses detected across all connected bays.
                </p>
              </div>
            </div>

            {onNavigateToAlerts && (
              <button
                type="button"
                onClick={onNavigateToAlerts}
                className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-primary border border-outline-variant/30 shrink-0 transition-colors cursor-pointer"
              >
                View Shift Log
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                  alert.severity === 'critical'
                    ? 'bg-error-container/20 border-error/30'
                    : 'bg-warning-container/20 border-warning/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                      alert.severity === 'critical'
                        ? 'bg-error text-on-error'
                        : 'bg-warning text-on-warning'
                    }`}
                  >
                    <Icon name="videocam" size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-sm text-on-surface">
                        {alert.title}
                      </span>
                      <span
                        className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === 'critical'
                            ? 'bg-error text-on-error'
                            : 'bg-warning text-on-warning'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        &bull; {alert.infantName} ({alert.incubatorNumber})
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-secondary/15 text-secondary font-mono text-[10px] font-semibold">
                        {alert.cameraName}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {alert.aiExplanation}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container-highest px-1.5 py-0.2 rounded">
                        {alert.boundingBoxLabel}
                      </span>
                      <span className="text-[10px] font-mono text-outline">
                        Triggered at {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedAlertForClip(alert)}
                    className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon name="play_circle" size={15} />
                    <span>Watch Clip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold transition-all shadow-2xs border border-outline-variant/40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon name="check" size={15} className="text-tertiary" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolved count footer */}
        {resolvedAlerts.length > 0 && (
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>
              {resolvedAlerts.length} camera event{resolvedAlerts.length > 1 ? 's' : ''} reviewed and cleared during this shift.
            </span>
            <span className="font-mono text-[11px] text-tertiary font-semibold">AI Vision Consensus Active</span>
          </div>
        )}
      </section>

      {/* Synchronized Camera Clip Inspection Modal */}
      <CameraAiEventDetailModal
        alert={selectedAlertForClip}
        isOpen={!!selectedAlertForClip}
        onClose={() => setSelectedAlertForClip(null)}
        currentUser={activeUser}
        onAcknowledge={onAcknowledgeAlert}
        onMarkFalseAlarm={onMarkFalseAlarm || (() => {})}
        onResolve={onResolveAlert || (() => {})}
      />
    </>
  )
}
export default AlertsTriageSection
