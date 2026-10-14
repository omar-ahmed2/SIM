import React, { useState } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { WardInfant } from '../../types/dashboard'

interface PatientRosterSectionProps {
  infants: WardInfant[]
  onAdmitPatient: (infant: WardInfant) => void
  onUpdateVitals: (infantId: string, updates: Partial<WardInfant>) => void
  onDischargeInfant: (infantId: string) => void
  isExternalModalOpen?: boolean
  onCloseExternalModal?: () => void
}

export const PatientRosterSection: React.FC<PatientRosterSectionProps> = ({
  infants,
  onAdmitPatient,
  onUpdateVitals,
  onDischargeInfant,
  isExternalModalOpen = false,
  onCloseExternalModal,
}) => {
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false)
  const isModalOpen = isInternalModalOpen || isExternalModalOpen

  const handleCloseModal = () => {
    setIsInternalModalOpen(false)
    onCloseExternalModal?.()
  }

  // Form State for Admission
  const [name, setName] = useState('')
  const [mrn, setMrn] = useState(`MRN-${Math.floor(100000 + Math.random() * 900000)}`)
  const [incubatorNumber, setIncubatorNumber] = useState(
    `Incubator #${Math.floor(Math.random() * 8) + 1}`
  )
  const [gestationalAge, setGestationalAge] = useState('30 weeks + 2 days')
  const [birthWeight, setBirthWeight] = useState('1,250g')
  const [heartRate, setHeartRate] = useState<number>(138)
  const [spo2, setSpo2] = useState<number>(98)
  const [temperature, setTemperature] = useState<number>(36.8)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    let status: 'normal' | 'warning' | 'critical' = 'normal'
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
      gestationalAge: gestationalAge.trim(),
      birthWeight: birthWeight.trim(),
      heartRate: Number(heartRate),
      spo2: Number(spo2),
      temperature: Number(temperature),
      status,
      admittedAt: new Date().toISOString(),
    }

    setTimeout(() => {
      setIsSubmitting(false)
      onAdmitPatient(newInfant)
      handleCloseModal()
      // Reset form
      setName('')
      setMrn(`MRN-${Math.floor(100000 + Math.random() * 900000)}`)
    }, 250)
  }

  return (
    <>
      <section
        id="patient-roster-section"
        className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold">
              <Icon name="child_care" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-on-surface">
                  Admitted Infants &amp; Incubator Bays
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-mono text-[11px] font-bold">
                  {infants.length} Admitted
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Central roster of all registered neonates and active incubator pods.
              </p>
            </div>
          </div>

          {/* Action Button inside Section Header */}
          <button
            type="button"
            onClick={() => setIsInternalModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-98"
          >
            <Icon name="person_add" size={16} />
            <span>+ Admit Newborn</span>
          </button>
        </div>

        {/* Content: Empty State or Table */}
        {infants.length === 0 ? (
          <div className="p-8 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-lowest text-primary shadow-xs flex items-center justify-center border border-outline-variant/30">
              <Icon name="child_care" size={26} />
            </div>
            <span className="font-display font-bold text-base text-on-surface">
              No Infants Currently Admitted
            </span>
            <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">
              The ward roster is completely clear. Click the button below to admit an infant, assign their incubator pod, and record baseline vital signs.
            </p>
            <button
              type="button"
              onClick={() => setIsInternalModalOpen(true)}
              className="mt-1 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="add" size={16} />
              <span>Admit First Newborn</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Patient / MRN</th>
                  <th className="py-2.5 px-3">Incubator</th>
                  <th className="py-2.5 px-3">Gestational Age</th>
                  <th className="py-2.5 px-3">Heart Rate (BPM)</th>
                  <th className="py-2.5 px-3">SpO2</th>
                  <th className="py-2.5 px-3">Temperature</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {infants.map((infant) => {
                  const isCritical = infant.status === 'critical'
                  const isWarning = infant.status === 'warning'

                  return (
                    <tr
                      key={infant.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-display font-bold text-sm text-on-surface">
                            {infant.name}
                          </span>
                          <span className="font-mono text-[11px] text-on-surface-variant">
                            MRN: {infant.mrn} • {infant.birthWeight}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-on-surface bg-surface-container px-2 py-0.5 rounded-lg border border-outline-variant/30">
                          <Icon name="single_bed" size={14} className="text-primary" />
                          <span>{infant.incubatorNumber}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-on-surface-variant">
                        {infant.gestationalAge}
                      </td>

                      {/* Heart Rate with Quick Adjust (+ / -) */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold text-xs tabular-nums ${
                              infant.heartRate > 170 || infant.heartRate < 100
                                ? 'text-error font-extrabold'
                                : 'text-on-surface'
                            }`}
                          >
                            {infant.heartRate} bpm
                          </span>
                          <div className="inline-flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateVitals(infant.id, {
                                  heartRate: Math.max(60, infant.heartRate - 5),
                                })
                              }
                              className="w-5 h-5 rounded bg-surface-container-low hover:bg-surface-container flex items-center justify-center font-bold text-[11px] cursor-pointer"
                              title="Decrease Heart Rate"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateVitals(infant.id, {
                                  heartRate: Math.min(220, infant.heartRate + 5),
                                })
                              }
                              className="w-5 h-5 rounded bg-surface-container-low hover:bg-surface-container flex items-center justify-center font-bold text-[11px] cursor-pointer"
                              title="Increase Heart Rate"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* SpO2 with Quick Adjust (+ / -) */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold text-xs tabular-nums ${
                              infant.spo2 < 92
                                ? 'text-error font-extrabold'
                                : 'text-on-surface'
                            }`}
                          >
                            {infant.spo2}%
                          </span>
                          <div className="inline-flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateVitals(infant.id, {
                                  spo2: Math.max(70, infant.spo2 - 1),
                                })
                              }
                              className="w-5 h-5 rounded bg-surface-container-low hover:bg-surface-container flex items-center justify-center font-bold text-[11px] cursor-pointer"
                              title="Decrease SpO2"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateVitals(infant.id, {
                                  spo2: Math.min(100, infant.spo2 + 1),
                                })
                              }
                              className="w-5 h-5 rounded bg-surface-container-low hover:bg-surface-container flex items-center justify-center font-bold text-[11px] cursor-pointer"
                              title="Increase SpO2"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-xs text-on-surface tabular-nums">
                        {infant.temperature}°C
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isCritical
                              ? 'bg-error-container text-on-error-container'
                              : isWarning
                              ? 'bg-warning-container text-on-warning'
                              : 'bg-tertiary-fixed/30 text-tertiary'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCritical
                                ? 'bg-error animate-ping'
                                : isWarning
                                ? 'bg-warning animate-pulse'
                                : 'bg-tertiary'
                            }`}
                          />
                          <span>{infant.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Discharge infant ${infant.name} from ${infant.incubatorNumber}?`
                              )
                            ) {
                              onDischargeInfant(infant.id)
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                          title="Discharge Infant"
                        >
                          Discharge
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Embedded Self-Contained Admit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4.5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-2xs">
                  <Icon name="person_add" size={22} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">
                    Admit Newborn Patient
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Enroll infant record and assign clinical incubator unit.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <Input
                label="Infant Name / Identifier"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Baby Name"
                leftIcon="badge"
                required
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Medical Record Number (MRN)"
                  value={mrn}
                  onChange={(e) => setMrn(e.target.value)}
                  placeholder="MRN-1"
                  leftIcon="tag"
                  required
                />
                <Input
                  label="Incubator Bay"
                  value={incubatorNumber}
                  onChange={(e) => setIncubatorNumber(e.target.value)}
                  placeholder="Incubator #1"
                  leftIcon="single_bed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Gestational Age"
                  value={gestationalAge}
                  onChange={(e) => setGestationalAge(e.target.value)}
                  placeholder="Age"
                  leftIcon="calendar_today"
                />
                <Input
                  label="Birth Weight"
                  value={birthWeight}
                  onChange={(e) => setBirthWeight(e.target.value)}
                  placeholder="Weight"
                  leftIcon="monitor_weight"
                />
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
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
                      max="220"
                      value={heartRate}
                      onChange={(e) => setHeartRate(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold font-mono text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      SpO2 (%)
                    </label>
                    <input
                      type="number"
                      min="70"
                      max="100"
                      value={spo2}
                      onChange={(e) => setSpo2(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold font-mono text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">
                      Temp (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="34"
                      max="42"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold font-mono text-on-surface"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                <Button variant="secondary" size="sm" type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  isLoading={isSubmitting}
                  iconLeft="add_task"
                >
                  Admit Patient to Ward
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
export default PatientRosterSection
