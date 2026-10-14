import React, { useState, useEffect } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import type { WardAlert } from '../../types/dashboard'
import type { ClinicianUser } from '../../types/auth'
import { audioAlarmManager } from './AudioAlarmManager'

interface CameraAiEventDetailModalProps {
  alert: WardAlert | null
  isOpen: boolean
  onClose: () => void
  currentUser: ClinicianUser
  onAcknowledge: (alertId: string) => void
  onMarkFalseAlarm: (alertId: string, reason?: string) => void
  onResolve: (alertId: string, notes?: string) => void
}

export const CameraAiEventDetailModal: React.FC<CameraAiEventDetailModalProps> = ({
  alert,
  isOpen,
  onClose,
  currentUser,
  onAcknowledge,
  onMarkFalseAlarm,
  onResolve,
}) => {
  if (!isOpen || !alert) return null

  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1.0>(1.0)
  const [playProgress, setPlayProgress] = useState(50) // percentage 0-100 (50% is trigger point)
  const [falseAlarmReason, setFalseAlarmReason] = useState('Caregiver interaction / routine adjustment')
  const [showFalseAlarmPrompt, setShowFalseAlarmPrompt] = useState(false)

  // Simulation of 10s clip playback loop
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setPlayProgress((prev) => {
        if (prev >= 100) return 0
        return prev + (playbackSpeed === 0.5 ? 1 : 2)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed])

  const handleAcknowledge = () => {
    onAcknowledge(alert.id)
    audioAlarmManager.playAcknowledgmentPing()
    onClose()
  }

  const handleConfirmFalseAlarm = () => {
    onMarkFalseAlarm(alert.id, falseAlarmReason)
    audioAlarmManager.playAcknowledgmentPing()
    setShowFalseAlarmPrompt(false)
    onClose()
  }

  const handleConfirmResolve = () => {
    onResolve(alert.id, 'Infant safe and posture verified.')
    audioAlarmManager.playAcknowledgmentPing()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-on-surface/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs ${
                alert.severity === 'critical'
                  ? 'bg-error text-on-error animate-pulse'
                  : 'bg-warning-container text-on-warning'
              }`}
            >
              <Icon name="videocam" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-extrabold uppercase tracking-wider ${
                    alert.severity === 'critical'
                      ? 'bg-error text-on-error'
                      : 'bg-warning text-on-warning'
                  }`}
                >
                  {alert.severity} AI Event
                </span>
                <span className="font-mono text-xs text-on-surface-variant font-semibold">
                  ID: #{alert.id.toUpperCase()}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-on-surface mt-0.5 tracking-tight">
                {alert.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Patient Meta Strip */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-on-surface">
                {alert.infantName}
              </span>
              <span className="font-mono text-xs text-primary font-bold px-2 py-0.5 rounded bg-surface-container-high">
                {alert.incubatorNumber}
              </span>
              {alert.mrn && (
                <span className="font-mono text-[11px] text-on-surface-variant">
                  ({alert.mrn})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-mono text-[11px]">
              <Icon name="schedule" size={14} className="text-primary" />
              <span>Captured at: <strong>{alert.timestamp}</strong></span>
            </div>
          </div>

          {/* SYNCHRONIZED 10-SECOND EVENT REPLAY VIDEO FEED */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col">
            {/* Camera Info Overlay Header */}
            <div className="absolute top-2.5 left-3 right-3 z-20 flex items-center justify-between text-white text-[10px] font-mono">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/70 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                <span className="font-bold tracking-wider">AI CAMERA REPLAY (940nm IR)</span>
              </div>
              <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-xs text-tertiary-fixed font-bold">
                {alert.cameraName}
              </span>
            </div>

            {/* Video Screen Simulation with Infrared Glow and Dynamic Bounding Box */}
            <div className="relative h-60 sm:h-72 w-full bg-slate-900 overflow-hidden flex items-center justify-center select-none">
              {alert.videoUrl ? (
                <video
                  src={alert.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  {/* Simulated Infrared Neonatal Background Grid */}
                  <div className="absolute inset-0 bg-radial from-slate-800 via-slate-900 to-black opacity-90" />
                  
                  {/* Scanner Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />

                  {/* Infant Silhouette Placeholder Illustration */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-28 h-20 rounded-full border border-slate-600/60 bg-slate-800/40 flex items-center justify-center relative shadow-inner">
                      <Icon name="child_care" size={44} className="text-slate-400 opacity-60" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-2">
                      Incubator Bed Cam Feed • Infrared Night-Vision Active
                    </span>
                  </div>
                </>
              )}

              {/* Computer Vision Bounding Box Overlay */}
              <div
                className={`absolute inset-x-12 sm:inset-x-28 inset-y-12 sm:inset-y-16 border-2 border-dashed rounded-xl pointer-events-none z-10 flex flex-col justify-between p-2 transition-all ${
                  alert.severity === 'critical'
                    ? 'border-error bg-error/15'
                    : 'border-warning bg-warning/15'
                }`}
              >
                {/* Bounding Box AI Label Tag */}
                <div className="flex items-center justify-between text-[10px] font-mono text-white bg-black/80 px-2 py-0.5 rounded font-extrabold self-start shadow-xs">
                  <span>{alert.boundingBoxLabel}</span>
                </div>

                {/* Bottom Bounding Box Metric */}
                <div className="flex items-center justify-between text-[9px] font-mono text-white bg-black/80 px-2 py-0.5 rounded self-end font-semibold shadow-xs">
                  <span>AI Confidence: {alert.aiConfidence}%</span>
                </div>
              </div>

              {/* Timestamp Counter in corner */}
              <div className="absolute bottom-3 left-3 z-20 px-2 py-1 rounded bg-black/80 text-white font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                <span>
                  {playProgress < 50
                    ? `-00:0${Math.floor((50 - playProgress) / 10)}.${(50 - playProgress) % 10}s`
                    : `+00:0${Math.floor((playProgress - 50) / 10)}.${(playProgress - 50) % 10}s`}{' '}
                  [Trigger: 00:00.0s]
                </span>
              </div>
            </div>

            {/* Video Playback & Scrubbing Controller Bar */}
            <div className="p-3 bg-slate-900 text-slate-200 border-t border-slate-800 flex flex-col gap-2">
              {/* Scrubbing Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>-05.00s Pre-Event</span>
                <span className="text-error font-bold flex items-center gap-1">
                  <span>▲</span> Trigger Moment ({alert.timestamp})
                </span>
                <span>+05.00s Post</span>
              </div>

              <div
                className="relative w-full h-2.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
                  setPlayProgress(pos)
                }}
              >
                {/* Progress fill */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-primary-container transition-all"
                  style={{ width: `${playProgress}%` }}
                />
                {/* Trigger marker at 50% */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-error shadow-sm -translate-x-1/2" />
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer flex items-center justify-center"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    <Icon name={isPlaying ? 'pause' : 'play_arrow'} size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlayProgress(0)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer flex items-center justify-center"
                    title="Replay Event Clip"
                  >
                    <Icon name="replay" size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 0.5 : 1.0)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-200 transition-colors cursor-pointer"
                  >
                    {playbackSpeed === 0.5 ? 'Slow-Mo (0.5x)' : 'Speed: 1.0x'}
                  </button>
                </div>

                <span className="text-[11px] font-mono text-tertiary-fixed flex items-center gap-1">
                  <Icon name="smart_display" size={14} />
                  <span>10-Second Event Buffer Captured</span>
                </span>
              </div>
            </div>
          </div>

          {/* AI EXPLANATION & WHAT WAS DETECTED */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xs text-on-surface flex items-center gap-1.5">
                <Icon name="psychology" size={18} className="text-secondary" />
                <span>AI Vision Diagnosis &amp; Clinical Explanation</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-mono font-bold">
                {alert.aiConfidence}% Neural Consensus
              </span>
            </div>

            <p className="text-xs text-on-surface leading-relaxed">
              {alert.aiExplanation}
            </p>

            {alert.vitalsSnapshot && (
              <div className="pt-2 mt-2 border-t border-outline-variant/20 flex items-center gap-3 text-on-surface-variant font-mono text-[11px] flex-wrap">
                <span>Vitals at onset:</span>
                <span>SpO2: <strong>{alert.vitalsSnapshot.spo2}%</strong></span>
                <span>HR: <strong>{alert.vitalsSnapshot.heartRate} bpm</strong></span>
                <span>Temp: <strong>{alert.vitalsSnapshot.temperature}°C</strong></span>
              </div>
            )}
          </div>

          {/* FALSE ALARM PROMPT ACCORDION */}
          {showFalseAlarmPrompt && (
            <div className="p-4 rounded-xl bg-warning-container/30 border border-warning/50 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs font-bold text-on-warning">
                <Icon name="report" size={18} />
                <span>Mark as False Alarm (False Positive)</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Help the computer-vision system learn: Why was this detection not a clinical emergency?
              </p>
              <select
                value={falseAlarmReason}
                onChange={(e) => setFalseAlarmReason(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface font-medium focus:outline-none"
              >
                <option value="Caregiver interaction / routine adjustment">
                  Staff/Caregiver interaction (Nurse was repositioning or diapering infant)
                </option>
                <option value="Normal benign startle reflex (Moro reflex)">
                  Normal benign startle reflex (Not a convulsive tremor)
                </option>
                <option value="Blanket / Bedding shift without face coverage">
                  Benign bedding shift (Airway remained fully open and unobstructed)
                </option>
                <option value="Sensor / Camera lighting reflection artifact">
                  Camera lighting or shadow artifact
                </option>
              </select>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowFalseAlarmPrompt(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="button"
                  onClick={handleConfirmFalseAlarm}
                  className="bg-warning text-on-warning hover:bg-warning/90"
                >
                  Confirm False Alarm
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-3.5 border-t border-outline-variant/20 bg-surface-container-low/70 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span>Status:</span>
            <span
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                alert.triageStatus === 'resolved'
                  ? 'bg-tertiary-fixed text-tertiary'
                  : alert.triageStatus === 'false_alarm'
                  ? 'bg-surface-container-highest text-on-surface-variant'
                  : alert.triageStatus === 'in_progress'
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-error text-on-error'
              }`}
            >
              {alert.triageStatus}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* False Alarm Button */}
            {!showFalseAlarmPrompt && alert.triageStatus !== 'false_alarm' && alert.triageStatus !== 'resolved' && (
              <button
                type="button"
                onClick={() => setShowFalseAlarmPrompt(true)}
                className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-xs font-semibold border border-outline-variant/30 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="cancel" size={15} />
                <span>Mark as False Alarm</span>
              </button>
            )}

            {/* Acknowledge Button */}
            {!alert.acknowledged && (
              <Button
                variant="primary"
                size="sm"
                type="button"
                onClick={handleAcknowledge}
                iconLeft="check"
              >
                Acknowledge &amp; Attend
              </Button>
            )}

            {/* Resolve Button */}
            {alert.triageStatus !== 'resolved' && alert.triageStatus !== 'false_alarm' && (
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={handleConfirmResolve}
                iconLeft="task_alt"
              >
                Mark Resolved
              </Button>
            )}

            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CameraAiEventDetailModal
