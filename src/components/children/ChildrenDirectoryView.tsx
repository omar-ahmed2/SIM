import React, { useState, useMemo } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { WardInfant, WardDataState, InfantStatus, InfantParentsInfo } from '../../types/dashboard'
import type { ClinicianUser } from '../../types/auth'
import { ChildProfileDetail } from './ChildProfileDetail'

interface ChildrenDirectoryViewProps {
  user: ClinicianUser
  wardData: WardDataState
  onAdmitPatient: (infant: WardInfant) => void
  onUpdateVitals: (infantId: string, updates: Partial<WardInfant>) => void
  onDischargeInfant: (infantId: string) => void
  onAddNote: (infantId: string, noteText: string) => void
  onUpdateParentsInfo?: (infantId: string, parentsInfo: InfantParentsInfo) => void
  onAcknowledgeAlert?: (alertId: string) => void
}

export const ChildrenDirectoryView: React.FC<ChildrenDirectoryViewProps> = ({
  user,
  wardData,
  onAdmitPatient,
  onUpdateVitals,
  onDischargeInfant,
  onAddNote,
  onUpdateParentsInfo,
  onAcknowledgeAlert,
}) => {
  // Master-Detail selection state
  const [selectedInfantId, setSelectedInfantId] = useState<string | null>(null)

  // Directory filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | InfantStatus>('all')
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  // Modal State for New Infant Admission
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [mrn, setMrn] = useState(`MRN-${Math.floor(100000 + Math.random() * 900000)}`)
  const [incubatorNumber, setIncubatorNumber] = useState(
    `Incubator #${wardData.infants.length + 1}`
  )
  const [gestationalAge, setGestationalAge] = useState('31 weeks')
  const [birthWeight, setBirthWeight] = useState('1,320g')
  const [heartRate, setHeartRate] = useState<number>(140)
  const [spo2, setSpo2] = useState<number>(97)
  const [temperature, setTemperature] = useState<number>(36.8)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Parent / Guardian Initial Admission Fields
  const [admitFatherName, setAdmitFatherName] = useState('')
  const [admitMotherName, setAdmitMotherName] = useState('')
  const [admitPhone, setAdmitPhone] = useState('')

  // Status Metrics calculations
  const stats = useMemo(() => {
    const total = wardData.infants.length
    const critical = wardData.infants.filter((i) => i.status === 'critical').length
    const warning = wardData.infants.filter((i) => i.status === 'warning').length
    const normal = wardData.infants.filter((i) => i.status === 'normal').length
    return { total, critical, warning, normal }
  }, [wardData.infants])

  // Filtered infants list
  const filteredInfants = useMemo(() => {
    return wardData.infants.filter((infant) => {
      const matchesStatus = statusFilter === 'all' || infant.status === statusFilter
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !q ||
        infant.name.toLowerCase().includes(q) ||
        infant.mrn.toLowerCase().includes(q) ||
        infant.incubatorNumber.toLowerCase().includes(q) ||
        (infant.parentsInfo?.fatherName && infant.parentsInfo.fatherName.toLowerCase().includes(q)) ||
        (infant.parentsInfo?.motherName && infant.parentsInfo.motherName.toLowerCase().includes(q)) ||
        (infant.parentsInfo?.primaryPhone && infant.parentsInfo.primaryPhone.includes(q))
      return matchesStatus && matchesQuery
    })
  }, [wardData.infants, statusFilter, searchQuery])

  // Selected Infant Object
  const selectedInfant = useMemo(() => {
    if (!selectedInfantId) return null
    return wardData.infants.find((i) => i.id === selectedInfantId) || null
  }, [wardData.infants, selectedInfantId])

  // Reset admission form
  const handleOpenAdmitModal = () => {
    setMrn(`MRN-${Math.floor(100000 + Math.random() * 900000)}`)
    setIncubatorNumber(`Incubator #${wardData.infants.length + 1}`)
    setName('')
    setAdmitFatherName('')
    setAdmitMotherName('')
    setAdmitPhone('')
    setIsAdmitModalOpen(true)
  }

  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    let status: InfantStatus = 'normal'
    if (spo2 < 90 || heartRate > 180 || heartRate < 100 || temperature > 38.0) {
      status = 'critical'
    } else if (spo2 < 94 || heartRate > 165 || heartRate < 115 || temperature > 37.5) {
      status = 'warning'
    }

    const newInfant: WardInfant = {
      id: `inf_${Date.now()}`,
      name: name.trim(),
      mrn: mrn.trim(),
      incubatorNumber: incubatorNumber.trim(),
      gestationalAge: gestationalAge.trim() || '32 weeks',
      birthWeight: birthWeight.trim() || '1,400g',
      heartRate: Number(heartRate) || 140,
      spo2: Number(spo2) || 98,
      temperature: Number(temperature) || 36.8,
      status,
      admittedAt: 'Just now',
      clinicalNotes: [],
      parentsInfo: {
        fatherName: admitFatherName.trim(),
        motherName: admitMotherName.trim(),
        primaryPhone: admitPhone.trim(),
      },
    }

    onAdmitPatient(newInfant)
    setIsSubmitting(false)
    setIsAdmitModalOpen(false)
    setName('')
    setAdmitFatherName('')
    setAdmitMotherName('')
    setAdmitPhone('')
  }

  // If a child is selected, render the dedicated Profile Detail screen!
  if (selectedInfant) {
    return (
      <ChildProfileDetail
        infant={selectedInfant}
        user={user}
        alerts={wardData.alerts}
        videoSessions={wardData.videoSessions}
        onBack={() => setSelectedInfantId(null)}
        onUpdateVitals={onUpdateVitals}
        onDischargeInfant={onDischargeInfant}
        onAddNote={onAddNote}
        onUpdateParentsInfo={onUpdateParentsInfo}
        onAcknowledgeAlert={onAcknowledgeAlert}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-50 duration-200">
      {/* 1. Header & Summary Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-on-surface tracking-tight">
              Children &amp; Incubator Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container/30 text-primary font-mono text-xs font-bold">
              {stats.total} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-0.5">
            Active patient roster across {user.hospitalName || "Children's Pavilion"} • Direct clinical access
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdmitModal}
          className="flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98 self-start sm:self-auto"
        >
          <Icon name="person_add" size={18} />
          <span>Admit New Infant</span>
        </button>
      </div>

      {/* 2. Status Metric Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-primary-container/15 border-primary/40 shadow-xs ring-1 ring-primary/20'
              : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
            All Patients
          </span>
          <span className="font-mono text-2xl font-extrabold text-on-surface mt-1 block">
            {stats.total}
          </span>
          <span className="text-[10px] text-on-surface-variant/70 mt-0.5 block">
            Total bays occupied
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('critical')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'critical'
              ? 'bg-error-container/20 border-error/50 shadow-xs ring-1 ring-error/30'
              : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-error block">
              Critical
            </span>
            {stats.critical > 0 && (
              <span className="w-2 h-2 rounded-full bg-error animate-ping" />
            )}
          </div>
          <span className="font-mono text-2xl font-extrabold text-error mt-1 block">
            {stats.critical}
          </span>
          <span className="text-[10px] text-error/80 mt-0.5 block">
            Immediate attention
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('warning')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'warning'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-xs ring-1 ring-amber-500/30'
              : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
            Monitoring
          </span>
          <span className="font-mono text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1 block">
            {stats.warning}
          </span>
          <span className="text-[10px] text-on-surface-variant/70 mt-0.5 block">
            Mild fluctuations
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('normal')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'normal'
              ? 'bg-tertiary-fixed/30 border-tertiary/50 shadow-xs ring-1 ring-tertiary/30'
              : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant/60'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary block">
            Stable
          </span>
          <span className="font-mono text-2xl font-extrabold text-tertiary mt-1 block">
            {stats.normal}
          </span>
          <span className="text-[10px] text-on-surface-variant/70 mt-0.5 block">
            Within baseline
          </span>
        </button>
      </div>

      {/* 3. Controls Bar: Search, Filters & View Toggle */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none flex items-center">
            <Icon name="search" size={18} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9.5 pl-9 pr-9 rounded-xl bg-surface-container-low text-on-surface font-sans text-xs placeholder:text-on-surface-variant/70 border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
            placeholder="Search baby name, MRN, or incubator bay..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer p-0.5"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        {/* Right: Status Filter Pills & View Switcher */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/20 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-surface-container-lowest text-on-surface shadow-2xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('critical')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'critical'
                  ? 'bg-error-container text-error shadow-2xs font-bold'
                  : 'text-on-surface-variant hover:text-error'
              }`}
            >
              Critical
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('warning')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'warning'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 shadow-2xs font-bold'
                  : 'text-on-surface-variant hover:text-amber-600'
              }`}
            >
              Warning
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('normal')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'normal'
                  ? 'bg-tertiary-fixed text-tertiary shadow-2xs font-bold'
                  : 'text-on-surface-variant hover:text-tertiary'
              }`}
            >
              Stable
            </button>
          </div>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/20">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-surface-container-lowest text-primary shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Cards Grid View"
              aria-label="Cards Grid View"
            >
              <Icon name="grid_view" size={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Compact Table View"
              aria-label="Compact Table View"
            >
              <Icon name="view_list" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Directory Content: Empty State vs Cards vs Table */}
      {filteredInfants.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-10 text-center border border-dashed border-outline-variant/40 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-3">
            <Icon name="child_care" size={32} />
          </div>
          <h3 className="font-display font-bold text-base text-on-surface mb-1">
            {searchQuery || statusFilter !== 'all'
              ? 'No matching infants found'
              : 'No Infants Currently Admitted'}
          </h3>
          <p className="text-xs text-on-surface-variant max-w-sm mb-5">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or clearing your filters to see more patient records.'
              : 'Zero mock data active. Admit your first baby into an incubator bay to begin continuous telemetry monitoring.'}
          </p>

          {searchQuery || statusFilter !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
              }}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAdmitModal}
              className="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Icon name="person_add" size={18} />
              <span>Admit First Infant</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInfants.map((infant) => {
            const statusConfig = {
              critical: {
                badge: 'Critical',
                color: 'text-error bg-error-container/30 border-error/40',
                dot: 'bg-error animate-ping',
              },
              warning: {
                badge: 'Needs Attention',
                color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30',
                dot: 'bg-amber-500',
              },
              normal: {
                badge: 'Stable',
                color: 'text-tertiary bg-tertiary-fixed/30 border-tertiary/30',
                dot: 'bg-tertiary',
              },
            }[infant.status]

            return (
              <div
                key={infant.id}
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-outline-variant/30 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center font-bold shrink-0">
                        <Icon name="child_care" size={22} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                          {infant.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                          <span className="font-mono">{infant.mrn}</span>
                          <span>•</span>
                          <span className="font-semibold text-on-surface">
                            {infant.incubatorNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusConfig.color}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      <span>{statusConfig.badge}</span>
                    </span>
                  </div>

                  {/* Demographics subtitle */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 mb-4">
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">Gestational Age</span>
                      <strong className="text-on-surface font-mono">{infant.gestationalAge}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">Birth Weight</span>
                      <strong className="text-on-surface font-mono">{infant.birthWeight}</strong>
                    </div>
                  </div>

                  {/* Live Vitals Pills */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-surface-container-low text-center">
                      <span className="text-[10px] text-on-surface-variant block font-bold">HR</span>
                      <span className="font-mono text-sm font-extrabold text-on-surface">
                        {infant.heartRate}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/70 block">bpm</span>
                    </div>

                    <div className="p-2 rounded-xl bg-surface-container-low text-center">
                      <span className="text-[10px] text-on-surface-variant block font-bold">SpO2</span>
                      <span className="font-mono text-sm font-extrabold text-on-surface">
                        {infant.spo2}%
                      </span>
                      <span className="text-[9px] text-on-surface-variant/70 block">oxygen</span>
                    </div>

                    <div className="p-2 rounded-xl bg-surface-container-low text-center">
                      <span className="text-[10px] text-on-surface-variant block font-bold">TEMP</span>
                      <span className="font-mono text-sm font-extrabold text-on-surface">
                        {infant.temperature.toFixed(1)}°
                      </span>
                      <span className="text-[9px] text-on-surface-variant/70 block">celsius</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {infant.clinicalNotes?.length || 0} notes logged
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedInfantId(infant.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer group-hover:underline"
                  >
                    <span>View Profile</span>
                    <Icon name="arrow_forward" size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* COMPACT CLINICAL TABLE VIEW */
        <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] tracking-wider font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-3 px-4">Infant / Patient</th>
                  <th className="py-3 px-4">Bay &amp; MRN</th>
                  <th className="py-3 px-4">Clinical Status</th>
                  <th className="py-3 px-4">Heart Rate</th>
                  <th className="py-3 px-4">SpO2</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface font-medium">
                {filteredInfants.map((infant) => {
                  const statusConfig = {
                    critical: {
                      badge: 'Critical',
                      color: 'text-error bg-error-container/30 border-error/40',
                      dot: 'bg-error',
                    },
                    warning: {
                      badge: 'Warning',
                      color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30',
                      dot: 'bg-amber-500',
                    },
                    normal: {
                      badge: 'Stable',
                      color: 'text-tertiary bg-tertiary-fixed/30 border-tertiary/30',
                      dot: 'bg-tertiary',
                    },
                  }[infant.status]

                  return (
                    <tr
                      key={infant.id}
                      className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                      onClick={() => setSelectedInfantId(infant.id)}
                    >
                      <td className="py-3.5 px-4 font-bold text-on-surface flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                          <Icon name="child_care" size={16} />
                        </div>
                        <div>
                          <span>{infant.name}</span>
                          <span className="block text-[10px] font-normal text-on-surface-variant font-mono">
                            {infant.gestationalAge} • {infant.birthWeight}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold block">{infant.incubatorNumber}</span>
                        <span className="text-[10px] font-mono text-on-surface-variant">
                          {infant.mrn}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusConfig.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          <span>{statusConfig.badge}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        {infant.heartRate} <span className="text-[10px] font-normal text-on-surface-variant">bpm</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        {infant.spo2}%
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        {infant.temperature.toFixed(1)}°C
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedInfantId(infant.id)}
                          className="px-3 py-1.5 rounded-xl bg-primary-container/20 hover:bg-primary text-primary hover:text-on-primary text-xs font-bold transition-all cursor-pointer"
                        >
                          Open Profile
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Embedded Modal: Admit New Infant */}
      {isAdmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center">
                  <Icon name="person_add" size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">
                    Admit Infant to Incubator
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Manual patient registration with telemetry baseline
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdmitModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleAdmitSubmit} className="space-y-4">
              <Input
                label="Infant Name / Identifier"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Baby Alexander, or طفل حضانة 1"
                leftIcon="badge"
                required
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Medical Record Number (MRN)"
                  value={mrn}
                  onChange={(e) => setMrn(e.target.value)}
                  placeholder="MRN-482012"
                  leftIcon="tag"
                  required
                />
                <Input
                  label="Incubator Bay"
                  value={incubatorNumber}
                  onChange={(e) => setIncubatorNumber(e.target.value)}
                  placeholder="Incubator #01"
                  leftIcon="single_bed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Gestational Age"
                  value={gestationalAge}
                  onChange={(e) => setGestationalAge(e.target.value)}
                  placeholder="30w + 2d"
                  leftIcon="calendar_today"
                />
                <Input
                  label="Birth Weight"
                  value={birthWeight}
                  onChange={(e) => setBirthWeight(e.target.value)}
                  placeholder="1,250g"
                  leftIcon="monitor_weight"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="vital_signs" size={16} className="text-primary" />
                  <span>Initial Baseline Vitals</span>
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      Heart Rate (BPM)
                    </label>
                    <input
                      type="number"
                      min="60"
                      max="240"
                      value={heartRate}
                      onChange={(e) => setHeartRate(Number(e.target.value))}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      SpO2 (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={spo2}
                      onChange={(e) => setSpo2(Number(e.target.value))}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      Temp (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="33"
                      max="42"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Parent & Family Guardian Initial Details */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2.5">
                <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="family_restroom" size={16} className="text-secondary" />
                  <span>Parent &amp; Guardian Contacts (Optional)</span>
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      Father's Name (اسم الأب)
                    </label>
                    <input
                      type="text"
                      value={admitFatherName}
                      onChange={(e) => setAdmitFatherName(e.target.value)}
                      placeholder="e.g. Ahmed / أحمد"
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      Mother's Name (اسم الأم)
                    </label>
                    <input
                      type="text"
                      value={admitMotherName}
                      onChange={(e) => setAdmitMotherName(e.target.value)}
                      placeholder="e.g. Maria / مريم"
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                    Emergency Phone (رقم الهاتف)
                  </label>
                  <input
                    type="tel"
                    value={admitPhone}
                    onChange={(e) => setAdmitPhone(e.target.value)}
                    placeholder="+20 100 000 0000"
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdmitModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  iconLeft="check"
                >
                  Complete Admission
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChildrenDirectoryView
