import React, { useState, useEffect } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import type { WardInfant, WardAlert, AiVideoSession, InfantParentsInfo } from '../../types/dashboard'
import type { ClinicianUser } from '../../types/auth'

interface ChildProfileDetailProps {
  infant: WardInfant
  user: ClinicianUser
  alerts: WardAlert[]
  videoSessions: AiVideoSession[]
  onBack: () => void
  onUpdateVitals: (infantId: string, updates: Partial<WardInfant>) => void
  onDischargeInfant: (infantId: string) => void
  onAddNote: (infantId: string, noteText: string) => void
  onUpdateParentsInfo?: (infantId: string, parentsInfo: InfantParentsInfo) => void
  onAcknowledgeAlert?: (alertId: string) => void
}

export const ChildProfileDetail: React.FC<ChildProfileDetailProps> = ({
  infant,
  user,
  alerts,
  videoSessions,
  onBack,
  onUpdateVitals,
  onDischargeInfant,
  onAddNote,
  onUpdateParentsInfo,
  onAcknowledgeAlert,
}) => {
  const [newNoteText, setNewNoteText] = useState('')
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)
  const [confirmDischarge, setConfirmDischarge] = useState(false)

  // Parent & Family Guardian State
  const [isEditingParents, setIsEditingParents] = useState(false)
  const [fatherName, setFatherName] = useState(infant.parentsInfo?.fatherName || '')
  const [motherName, setMotherName] = useState(infant.parentsInfo?.motherName || '')
  const [primaryPhone, setPrimaryPhone] = useState(infant.parentsInfo?.primaryPhone || '')
  const [secondaryPhone, setSecondaryPhone] = useState(infant.parentsInfo?.secondaryPhone || '')
  const [address, setAddress] = useState(infant.parentsInfo?.address || '')
  const [parentNotes, setParentNotes] = useState(infant.parentsInfo?.notes || '')
  const [isSavingParents, setIsSavingParents] = useState(false)

  // Sync parent state when infant changes
  useEffect(() => {
    setFatherName(infant.parentsInfo?.fatherName || '')
    setMotherName(infant.parentsInfo?.motherName || '')
    setPrimaryPhone(infant.parentsInfo?.primaryPhone || '')
    setSecondaryPhone(infant.parentsInfo?.secondaryPhone || '')
    setAddress(infant.parentsInfo?.address || '')
    setParentNotes(infant.parentsInfo?.notes || '')
  }, [infant])

  const handleSaveParentsInfo = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingParents(true)
    const updatedParents: InfantParentsInfo = {
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      primaryPhone: primaryPhone.trim(),
      secondaryPhone: secondaryPhone.trim(),
      address: address.trim(),
      notes: parentNotes.trim(),
    }
    onUpdateParentsInfo?.(infant.id, updatedParents)
    setIsSavingParents(false)
    setIsEditingParents(false)
  }

  // Filter alerts & video sessions for this specific infant
  const infantAlerts = alerts.filter(
    (a) => a.infantId === infant.id || a.infantName.toLowerCase() === infant.name.toLowerCase()
  )
  const infantVideos = videoSessions.filter(
    (v) => v.infantId === infant.id || v.infantName.toLowerCase() === infant.name.toLowerCase()
  )

  // Handlers for tactile live vitals updates
  const handleAdjustHeartRate = (delta: number) => {
    const newHR = Math.max(50, Math.min(220, infant.heartRate + delta))
    onUpdateVitals(infant.id, { heartRate: newHR })
  }

  const handleAdjustSpO2 = (delta: number) => {
    const newSpO2 = Math.max(70, Math.min(100, infant.spo2 + delta))
    onUpdateVitals(infant.id, { spo2: newSpO2 })
  }

  const handleAdjustTemp = (delta: number) => {
    const newTemp = Math.round((infant.temperature + delta) * 10) / 10
    onUpdateVitals(infant.id, { temperature: newTemp })
  }

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return
    setIsSubmittingNote(true)
    onAddNote(infant.id, newNoteText.trim())
    setNewNoteText('')
    setIsSubmittingNote(false)
  }

  // Status visual configurations
  const statusConfig = {
    critical: {
      label: 'Critical Condition',
      bg: 'bg-error-container/30 border-error/40 text-error',
      dot: 'bg-error animate-ping',
    },
    warning: {
      label: 'Needs Monitoring',
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    normal: {
      label: 'Clinically Stable',
      bg: 'bg-tertiary-fixed/30 border-tertiary/30 text-tertiary',
      dot: 'bg-tertiary',
    },
  }[infant.status]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-200">
      {/* 1. Header Navigation & Demographics Summary */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer group"
          >
            <Icon
              name="arrow_back"
              size={18}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span>Back to Children Directory</span>
          </button>

          <div className="flex items-center gap-2">
            {!confirmDischarge ? (
              <button
                type="button"
                onClick={() => setConfirmDischarge(true)}
                className="px-3 py-1.5 rounded-xl border border-error/30 text-error hover:bg-error-container/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icon name="person_remove" size={16} />
                <span>Discharge Patient</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-error-container/20 p-1.5 rounded-xl border border-error/40">
                <span className="text-xs font-bold text-error px-1">Discharge {infant.name}?</span>
                <button
                  type="button"
                  onClick={() => {
                    onDischargeInfant(infant.id)
                    onBack()
                  }}
                  className="px-2.5 py-1 rounded-lg bg-error text-on-error text-xs font-bold hover:bg-error/90 cursor-pointer"
                >
                  Yes, Discharge
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDischarge(false)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Patient Identity Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-outline-variant/20">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Icon name="child_care" size={32} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="font-display font-extrabold text-2xl text-on-surface tracking-tight">
                  {infant.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusConfig.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                  <span>{statusConfig.label}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-on-surface-variant">
                <span className="font-mono bg-surface-container-low px-2 py-0.5 rounded-md border border-outline-variant/20">
                  {infant.mrn}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-on-surface font-semibold">
                  <Icon name="single_bed" size={15} className="text-primary" />
                  {infant.incubatorNumber}
                </span>
                <span>•</span>
                <span>Admitted: {infant.admittedAt}</span>
              </div>
            </div>
          </div>

          {/* Quick Demographics Chips */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Gestational Age
              </p>
              <p className="text-xs font-bold text-on-surface font-mono mt-0.5">
                {infant.gestationalAge}
              </p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Birth Weight
              </p>
              <p className="text-xs font-bold text-on-surface font-mono mt-0.5">
                {infant.birthWeight}
              </p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-center">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                Assigned Lead
              </p>
              <p className="text-xs font-bold text-primary truncate max-w-120px mt-0.5">
                {user.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Clinical Workspace: Vitals Hub & Notes (Left) vs History & AI (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Vitals & Shift Notes Notebook (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Real-time Vitals Adjuster Hub */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center">
                  <Icon name="vital_signs" size={20} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-on-surface">
                    Live Telemetry &amp; Vital Signs
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Continuous monitoring with tactile calibration buttons
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed/40 text-tertiary font-mono text-[11px] font-bold">
                Telemetry Active
              </span>
            </div>

            {/* Vitals Grid with + / - Tactile Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Heart Rate */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Heart Rate</span>
                    <Icon name="favorite" size={16} className="text-error" />
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="font-mono text-3xl font-extrabold text-on-surface">
                      {infant.heartRate}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">BPM</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/80 font-medium">
                    Normal Range: 120-160
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => handleAdjustHeartRate(-5)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Decrease by 5 BPM"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustHeartRate(-1)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Decrease by 1 BPM"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustHeartRate(1)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Increase by 1 BPM"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustHeartRate(5)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Increase by 5 BPM"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* SpO2 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Blood Oxygen</span>
                    <Icon name="air" size={16} className="text-primary" />
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="font-mono text-3xl font-extrabold text-on-surface">
                      {infant.spo2}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">%</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/80 font-medium">
                    Target SpO2: &gt; 94%
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => handleAdjustSpO2(-2)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Decrease by 2%"
                  >
                    -2%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustSpO2(-1)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Decrease by 1%"
                  >
                    -1%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustSpO2(1)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Increase by 1%"
                  >
                    +1%
                  </button>
                </div>
              </div>

              {/* Temperature */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-on-surface-variant mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Temperature</span>
                    <Icon name="thermostat" size={16} className="text-tertiary" />
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="font-mono text-3xl font-extrabold text-on-surface">
                      {infant.temperature.toFixed(1)}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">°C</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/80 font-medium">
                    Normal: 36.5 - 37.5°C
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => handleAdjustTemp(-0.2)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Decrease by 0.2°C"
                  >
                    -0.2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustTemp(-0.1)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Decrease by 0.1°C"
                  >
                    -0.1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustTemp(0.1)}
                    className="flex-1 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-mono font-bold text-on-surface transition-colors cursor-pointer"
                    title="Increase by 0.1°C"
                  >
                    +0.1
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor & Nursing Shift Notes Notebook */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed/30 text-tertiary flex items-center justify-center">
                  <Icon name="clinical_notes" size={20} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-base text-on-surface">
                    Clinical Observations &amp; Shift Notes
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Permanent medical record notes recorded by the clinical team
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-on-surface-variant">
                {infant.clinicalNotes?.length || 0} Notes
              </span>
            </div>

            {/* Note Input Box */}
            <form onSubmit={handleNoteSubmit} className="space-y-3">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder={`Record clinical notes for ${infant.name} (e.g. "Weaning FiO2 to 21%, infant tolerating gavage feeds, resting peacefully in supine position")...`}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container resize-none transition-all"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
                  <Icon name="verified_user" size={14} className="text-primary" />
                  Recording as <strong className="text-on-surface">{user.name}</strong>
                </span>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newNoteText.trim() || isSubmittingNote}
                  iconLeft="add_comment"
                >
                  Save Shift Note
                </Button>
              </div>
            </form>

            {/* Chronological Notes Timeline */}
            <div className="mt-3 space-y-3">
              {infant.clinicalNotes && infant.clinicalNotes.length > 0 ? (
                infant.clinicalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on-surface">{note.author}</span>
                        {note.role && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant">
                            {note.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-on-surface-variant">
                        {note.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center rounded-xl bg-surface-container-low/50 border border-dashed border-outline-variant/40 text-on-surface-variant">
                  <Icon name="notes" size={28} className="mx-auto mb-2 text-outline" />
                  <p className="text-xs font-semibold">No clinical notes recorded yet</p>
                  <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
                    Enter shift notes or doctor orders in the field above to start the chart
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Parent Contacts, AI Video Sessions & Alerts */}
        <div className="flex flex-col gap-6">
          {/* 1. Parent & Family Guardian Contact Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
                  <Icon name="family_restroom" size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-on-surface">
                    Parents &amp; Family Contacts
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Emergency guardian details
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingParents(!isEditingParents)}
                className="px-2.5 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary transition-colors cursor-pointer flex items-center gap-1"
              >
                <Icon name={isEditingParents ? 'close' : 'edit'} size={15} />
                <span>{isEditingParents ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditingParents ? (
              /* Edit Form Mode */
              <form onSubmit={handleSaveParentsInfo} className="space-y-3 animate-in fade-in-50">
                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                    Father's Full Name (اسم الأب)
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Ahmed Alexander / أحمد محمود"
                    className="w-full h-8.5 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                    Mother's Full Name (اسم الأم)
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="e.g. Maria Alexander / مريم حسن"
                    className="w-full h-8.5 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      Primary Phone (رقم الهاتف)
                    </label>
                    <input
                      type="tel"
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      placeholder="+20 100 000 0000"
                      className="w-full h-8.5 px-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-mono text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                      Secondary Phone (هاتف بديل)
                    </label>
                    <input
                      type="tel"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      placeholder="+20 111 000 0000"
                      className="w-full h-8.5 px-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-mono text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                    Home Address / City (العنوان)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, District, Building"
                    className="w-full h-8.5 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">
                    Emergency Notes (ملاحظات أسرية أو طبية)
                  </label>
                  <textarea
                    value={parentNotes}
                    onChange={(e) => setParentNotes(e.target.value)}
                    placeholder="Maternal blood type, specific instructions, or guardian relations..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingParents(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSavingParents}
                    iconLeft="check"
                  >
                    Save Parent Info
                  </Button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-3 text-xs">
                {/* Father & Mother Strip */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0">
                        <Icon name="person" size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block font-medium">Father (الأب)</span>
                        <strong className="text-on-surface">
                          {infant.parentsInfo?.fatherName || (
                            <span className="text-on-surface-variant/60 font-normal italic">
                              Not recorded
                            </span>
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0">
                        <Icon name="face_3" size={15} />
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block font-medium">Mother (الأم)</span>
                        <strong className="text-on-surface">
                          {infant.parentsInfo?.motherName || (
                            <span className="text-on-surface-variant/60 font-normal italic">
                              Not recorded
                            </span>
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Phone Numbers */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                      <Icon name="phone" size={13} className="text-primary" />
                      <span>Primary Phone</span>
                    </span>
                    {infant.parentsInfo?.primaryPhone && (
                      <a
                        href={`tel:${infant.parentsInfo.primaryPhone}`}
                        className="px-2 py-0.5 rounded-md bg-primary-container/20 text-primary text-[11px] font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1"
                      >
                        <Icon name="call" size={12} />
                        <span>Call</span>
                      </a>
                    )}
                  </div>

                  <p className="font-mono text-xs font-bold text-on-surface">
                    {infant.parentsInfo?.primaryPhone ? (
                      <a
                        href={`tel:${infant.parentsInfo.primaryPhone}`}
                        className="hover:underline text-primary"
                      >
                        {infant.parentsInfo.primaryPhone}
                      </a>
                    ) : (
                      <span className="text-on-surface-variant/60 font-normal italic">
                        No phone number saved
                      </span>
                    )}
                  </p>

                  {infant.parentsInfo?.secondaryPhone && (
                    <div className="pt-2 border-t border-outline-variant/20">
                      <span className="text-[10px] text-on-surface-variant block">Secondary / Emergency:</span>
                      <a
                        href={`tel:${infant.parentsInfo.secondaryPhone}`}
                        className="font-mono text-xs text-on-surface hover:underline font-semibold"
                      >
                        {infant.parentsInfo.secondaryPhone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Address & Notes (if any) */}
                {infant.parentsInfo?.address && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-[11px]">
                    <Icon name="home_pin" size={16} className="text-outline mt-0.5 shrink-0" />
                    <span className="text-on-surface leading-tight">{infant.parentsInfo.address}</span>
                  </div>
                )}

                {infant.parentsInfo?.notes && (
                  <div className="p-2.5 rounded-xl bg-secondary-container/15 border border-secondary/20 text-[11px] text-on-surface">
                    <strong className="text-secondary block mb-0.5 font-bold">Family / Clinical Note:</strong>
                    <span className="text-on-surface-variant">{infant.parentsInfo.notes}</span>
                  </div>
                )}

                {!infant.parentsInfo?.fatherName &&
                  !infant.parentsInfo?.motherName &&
                  !infant.parentsInfo?.primaryPhone && (
                    <button
                      type="button"
                      onClick={() => setIsEditingParents(true)}
                      className="w-full py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-dashed border-outline-variant/40 text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Icon name="add" size={16} />
                      <span>Add Parent / Guardian Details</span>
                    </button>
                  )}
              </div>
            )}
          </div>

          {/* AI Video Analyses for this Infant */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <Icon name="videocam" size={18} className="text-secondary" />
                <h3 className="font-display font-bold text-sm text-on-surface">
                  AI Video Sessions
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-secondary bg-secondary-fixed/30 px-2 py-0.5 rounded-full">
                {infantVideos.length} Analyzed
              </span>
            </div>

            {infantVideos.length > 0 ? (
              <div className="space-y-3">
                {infantVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="font-bold text-on-surface truncate max-w-[160px]">
                        {vid.videoName}
                      </span>
                      <span className="font-mono text-[10px] text-on-surface-variant">
                        {vid.timestamp}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-surface-container px-2 py-1 rounded-lg">
                        <span className="text-on-surface-variant block text-[10px]">Posture</span>
                        <strong className="text-on-surface">{vid.posture}</strong>
                      </div>
                      <div className="bg-surface-container px-2 py-1 rounded-lg">
                        <span className="text-on-surface-variant block text-[10px]">Movement</span>
                        <strong className="text-on-surface">{vid.activityLevel}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-on-surface-variant">AI Vision Confidence</span>
                      <span className="font-mono font-bold text-tertiary">
                        {vid.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-on-surface-variant">
                <Icon name="motion_photos_off" size={24} className="mx-auto mb-1 text-outline" />
                <p className="text-xs font-semibold">No video sessions yet</p>
                <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
                  Upload an MP4 clip on the dashboard to test AI event triggers
                </p>
              </div>
            )}
          </div>

          {/* Active Clinical Alerts for this Infant */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <Icon name="notifications_active" size={18} className="text-primary" />
                <h3 className="font-display font-bold text-sm text-on-surface">
                  Alerts &amp; Incidents
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-on-surface-variant">
                {infantAlerts.length} Total
              </span>
            </div>

            {infantAlerts.length > 0 ? (
              <div className="space-y-2.5">
                {infantAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 ${
                      alert.acknowledged
                        ? 'bg-surface-container-low border-outline-variant/20 opacity-70'
                        : alert.severity === 'critical'
                        ? 'bg-error-container/20 border-error/40'
                        : 'bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-on-surface truncate">{alert.title}</span>
                      <span className="text-[10px] font-mono text-on-surface-variant shrink-0">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant leading-tight">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        {alert.severity}
                      </span>
                      {!alert.acknowledged && onAcknowledgeAlert ? (
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-2 py-0.5 rounded-md bg-surface-container hover:bg-surface-container-high text-[11px] font-bold text-primary transition-colors cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[10px] font-semibold text-tertiary flex items-center gap-1">
                          <Icon name="check" size={13} />
                          Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-on-surface-variant">
                <Icon name="check_circle" size={24} className="mx-auto mb-1 text-tertiary" />
                <p className="text-xs font-semibold text-on-surface">No alerts logged</p>
                <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
                  All vital thresholds are operating within stable limits
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChildProfileDetail
