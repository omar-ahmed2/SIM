import React, { useState, useRef } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import type {
  AiVideoSession,
  WardActivityLog,
  WardInfant,
  WardAlert,
  PostureType,
  ActivityLevel,
} from '../../types/dashboard'

interface RecentAiVideoSectionProps {
  videoSessions: AiVideoSession[]
  activities: WardActivityLog[]
  infants: WardInfant[]
  onSaveVideoSession: (session: AiVideoSession) => void
  onTriggerAlert?: (alert: WardAlert) => void
}

export const RecentAiVideoSection: React.FC<RecentAiVideoSectionProps> = ({
  videoSessions,
  activities,
  infants,
  onSaveVideoSession,
  onTriggerAlert,
}) => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedInfantId, setSelectedInfantId] = useState<string>(
    infants.length > 0 ? infants[0].id : ''
  )
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [videoName, setVideoName] = useState<string>('')
  const [posture, setPosture] = useState<PostureType>('Supine (On Back)')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('Calm')
  const [confidence, setConfidence] = useState<number>(98.6)
  const [triggerAlertForAbnormal, setTriggerAlertForAbnormal] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoName(file.name)
      setVideoUrl(URL.createObjectURL(file))
    }
  }

  const handleUseSample = () => {
    const sampleUrl =
      ''
    setVideoUrl(sampleUrl)
    setVideoName('Sample_Incubator_Observation_Clip.mp4')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl) return

    setIsSubmitting(true)

    const selectedInfant = infants.find((i) => i.id === selectedInfantId)
    const infantName = selectedInfant
      ? `${selectedInfant.name} (${selectedInfant.incubatorNumber})`
      : 'General Ward Incubator'

    const session: AiVideoSession = {
      id: `ai_${Date.now()}`,
      infantId: selectedInfantId || undefined,
      infantName,
      videoName: videoName || 'Incubator_Clip.mp4',
      videoUrl,
      posture,
      activityLevel,
      confidence,
      chestMovement: 'Regular',
      timestamp:
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' EST',
    }

    if (triggerAlertForAbnormal && onTriggerAlert) {
      const isProne = posture === 'Prone (On Stomach)'
      const isRestless = activityLevel === 'Restless' || activityLevel === 'Crying'
      const alertCategory = isProne ? 'posture_risk' : isRestless ? 'limb_tremor' : 'posture_risk'
      const alertSeverity = isProne ? 'critical' : 'warning'

      const newAlert: WardAlert = {
        id: `alt_real_${Date.now()}`,
        infantId: selectedInfant?.id || 'inf_general',
        infantName: selectedInfant?.name || 'General Incubator Bay',
        incubatorNumber: selectedInfant?.incubatorNumber || 'Bay Alpha',
        mrn: selectedInfant?.mrn || 'MRN-REAL',
        title: isProne
          ? 'Prone Sleep Posture Detected (Suffocation Risk)'
          : isRestless
          ? 'Kinematic Motor Tremor / High Restlessness Detected'
          : `Postural Event: ${posture}`,
        severity: alertSeverity,
        category: alertCategory,
        description: `Optical camera analyzed real video "${videoName}". Observed posture: ${posture}, activity: ${activityLevel}.`,
        aiExplanation: isProne
          ? 'Computer vision detected infant in prone posture facing downward. High risk of airway occlusion. Reposition infant immediately.'
          : `Computer vision detected abnormal restlessness and motor activity in incubator feed with ${confidence}% confidence.`,
        aiConfidence: confidence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cameraName: selectedInfant?.incubatorNumber
          ? `${selectedInfant.incubatorNumber} Vision Cam`
          : 'Incubator Vision Cam (940nm IR)',
        boundingBoxLabel: isProne
          ? 'ROI: PRONE POSTURE [SUFFOCATION RISK]'
          : 'ROI: MOTOR ACTIVITY EVENT',
        videoUrl: videoUrl,
        acknowledged: false,
        triageStatus: 'unacknowledged',
      }
      onTriggerAlert(newAlert)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      onSaveVideoSession(session)
      setIsModalOpen(false)
      setVideoUrl('')
      setVideoName('')
    }, 300)
  }

  return (
    <>
      <section
        id="ai-sessions-section"
        className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center font-bold">
              <Icon name="auto_awesome" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-on-surface">
                  AI Video Analysis &amp; Shift Audit
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary font-mono text-[11px] font-bold">
                  {videoSessions.length} Sessions Logged
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Computer-vision observation logs and real-time ward action history.
              </p>
            </div>
          </div>

          {/* Action Button inside Section Header */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-98"
          >
            <Icon name="video_camera_front" size={16} />
            <span>+ Upload Video for AI Analysis</span>
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: AI Video Analysis Sessions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <span className="font-display font-bold text-xs text-on-surface-variant uppercase tracking-wider">
              Recent Video AI Observation Reports
            </span>

            {videoSessions.length === 0 ? (
              <div className="p-6 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-2.5 min-h-[190px]">
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-secondary shadow-xs flex items-center justify-center border border-outline-variant/30">
                  <Icon name="videocam" size={22} />
                </div>
                <span className="font-display font-bold text-sm text-on-surface">
                  No Video Analysis Sessions Logged
                </span>
                <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
                  Upload an incubator video clip (MP4, WebM) to test AI computer-vision posture classification and movement detection.
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-1 px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary/90 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Icon name="upload" size={16} />
                  <span>Upload Video to Analyze</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {videoSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-secondary/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                        <Icon name="smart_toy" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-sm text-on-surface">
                            {session.videoName}
                          </span>
                          <span className="text-xs font-medium text-on-surface-variant">
                            • {session.infantName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md font-medium text-[11px]">
                            <Icon name="accessibility_new" size={13} className="text-primary" />
                            <span>{session.posture}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md font-medium text-[11px]">
                            <Icon name="motion_photos_on" size={13} className="text-secondary" />
                            <span>{session.activityLevel}</span>
                          </span>
                          <span className="font-mono text-[11px] text-tertiary font-bold">
                            Conf: {session.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-outline shrink-0 self-end sm:self-auto">
                      {session.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Ward Activity Audit Trail (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="font-display font-bold text-xs text-on-surface-variant uppercase tracking-wider">
              Shift Audit Trail &amp; Activity Log
            </span>

            <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/30 max-h-[320px] overflow-y-auto space-y-2.5">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-2 text-xs"
                >
                  <div className="w-6 h-6 rounded-md bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                    <Icon
                      name={
                        act.type === 'admission'
                          ? 'person_add'
                          : act.type === 'alert_cleared'
                          ? 'check_circle'
                          : act.type === 'video_analyzed'
                          ? 'videocam'
                          : 'info'
                      }
                      size={14}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface leading-snug">
                      <strong className="text-on-surface font-semibold">{act.actor}: </strong>
                      {act.action}
                    </p>
                    <span className="font-mono text-[10px] text-outline mt-0.5 block">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Self-Contained Upload Video Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4.5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shadow-2xs">
                  <Icon name="video_camera_front" size={22} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">
                    Upload Video for AI Analysis
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Observe neonatal posture, chest expansion, and movement patterns.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              className="hidden"
            />

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {infants.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-on-surface mb-1.5 block">
                    Assign to Patient / Incubator
                  </label>
                  <select
                    value={selectedInfantId}
                    onChange={(e) => setSelectedInfantId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {infants.map((inf) => (
                      <option key={inf.id} value={inf.id}>
                        {inf.name} — {inf.incubatorNumber} ({inf.mrn})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-on-surface mb-1.5 block">
                  Incubator Video File
                </label>

                {videoUrl ? (
                  <div className="relative rounded-xl overflow-hidden bg-inverse-surface aspect-video flex items-center justify-center border border-outline-variant/40">
                    <video src={videoUrl} controls className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-inverse-surface/80 text-inverse-on-surface hover:bg-inverse-surface text-xs font-medium backdrop-blur-xs cursor-pointer"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-outline-variant/60 hover:border-secondary/60 rounded-xl p-5 text-center bg-surface-container-low cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
                      <Icon name="upload_file" size={24} />
                    </div>
                    <span className="text-xs font-bold text-secondary hover:underline">
                      Choose video file or drag and drop (MP4, WebM)
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      Max size: 50MB per clip
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUseSample()
                      }}
                      className="mt-1 px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors border border-outline-variant/30"
                    >
                      Or Use Sample Clip
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="smart_toy" size={16} className="text-secondary" />
                  <span>Simulated AI Classification Parameters</span>
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      Observed Posture
                    </label>
                    <select
                      value={posture}
                      onChange={(e) => setPosture(e.target.value as PostureType)}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface"
                    >
                      <option value="Supine (On Back)">Supine (On Back)</option>
                      <option value="Prone (On Stomach)">Prone (On Stomach)</option>
                      <option value="Left Lateral">Left Lateral</option>
                      <option value="Right Lateral">Right Lateral</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      Activity Level
                    </label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs text-on-surface"
                    >
                      <option value="Calm">Calm (Nominal)</option>
                      <option value="Mild Movement">Mild Movement</option>
                      <option value="Restless">Restless (Alert)</option>
                      <option value="Crying">Crying</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/20">
                  <span>Confidence Score:</span>
                  <span className="font-mono font-bold text-tertiary">{confidence}%</span>
                </div>
              </div>

              {/* Checkbox to trigger alert */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="trigger-alert-checkbox"
                  checked={triggerAlertForAbnormal}
                  onChange={(e) => setTriggerAlertForAbnormal(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label htmlFor="trigger-alert-checkbox" className="text-xs font-semibold text-on-surface cursor-pointer select-none">
                  <span>Trigger a Camera AI Incident Alert from this video event</span>
                  <p className="text-[11px] text-on-surface-variant font-normal mt-0.5">
                    Automatically dispatches an incident to the Alerts Center with bounding box analysis and real video clip review.
                  </p>
                </label>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={!videoUrl}
                  isLoading={isSubmitting}
                  iconLeft="save"
                >
                  Commit AI Analysis Session
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
export default RecentAiVideoSection
