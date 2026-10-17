import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export const QuadTelemetryBento: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const bentoVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  }

  return (
    <section id="technology" className="w-full bg-surface py-16 lg:py-24 border-b border-outline-variant/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Technology Architecture
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-on-surface mt-2 tracking-tight">
            Quad-Modality Neonatal Telemetry
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Engineered explicitly for premature neonates (23 to 37 weeks gestational age) where sensor
            adhesives pose medical adhesive-related skin injuries (MARSI).
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Bento 1: Live Video & AI Event Telemetry (7 Cols) */}
          <motion.div
            variants={bentoVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-7 rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-xs border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Modality 01
                </span>
                <span className="text-xs font-medium text-on-surface-variant font-mono">
                  RTSP / WebRTC Bedside
                </span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-on-surface mb-3">
                Live Video &amp; Multi-Bed AI Event Telemetry
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
                Synchronous ultra-low-latency video feeds integrated with skeletal keypoint regression.
                Tracks spontaneous infant movements, eye-opening sleep states, and limb twitching
                patterns without disturbing daylight-simulated photoperiods.
              </p>
            </div>

            {/* Active Bed Stream Matrix Sub-UI */}
            <div className="w-full rounded-2xl bg-surface-container-low p-4 border border-outline-variant/30">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  <span className="text-xs font-semibold text-on-surface">Active Bed Stream Matrix</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  4 Nodes Connected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-xl bg-surface-container-lowest p-2.5 text-center border border-outline-variant/20 shadow-2xs">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Bed 01</span>
                  <div className="font-display font-bold text-lg text-on-surface">
                    142 <span className="text-[10px] font-normal text-on-surface-variant">bpm</span>
                  </div>
                  <span className="text-[10px] text-tertiary font-bold uppercase">Quiet Sleep</span>
                </div>
                <div className="rounded-xl bg-surface-container-lowest p-2.5 text-center border border-outline-variant/20 shadow-2xs">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Bed 02</span>
                  <div className="font-display font-bold text-lg text-on-surface">
                    155 <span className="text-[10px] font-normal text-on-surface-variant">bpm</span>
                  </div>
                  <span className="text-[10px] text-secondary font-bold uppercase">Active Move</span>
                </div>
                <div className="rounded-xl bg-surface-container-lowest p-2.5 text-center border border-outline-variant/20 shadow-2xs">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Bed 03</span>
                  <div className="font-display font-bold text-lg text-on-surface">
                    139 <span className="text-[10px] font-normal text-on-surface-variant">bpm</span>
                  </div>
                  <span className="text-[10px] text-tertiary font-bold uppercase">Skin-to-Skin</span>
                </div>
                <div className="rounded-xl bg-surface-container-lowest p-2.5 text-center border border-outline-variant/20 shadow-2xs">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Bed 04</span>
                  <div className="font-display font-bold text-lg text-on-surface">
                    148 <span className="text-[10px] font-normal text-on-surface-variant">bpm</span>
                  </div>
                  <span className="text-[10px] text-tertiary font-bold uppercase">Quiet Sleep</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento 2: AI-Assisted Micro-Apnea Detection (5 Cols) */}
          <motion.div
            variants={bentoVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-5 rounded-3xl bg-secondary-fixed/20 p-6 sm:p-8 shadow-xs border border-secondary/20 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                  Modality 02
                </span>
                <span className="text-xs font-medium text-on-secondary-container font-mono">
                  Sub-Visual Dynamics
                </span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-on-surface mb-3">
                AI-Assisted Micro-Apnea Detection
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
                Passive motion magnification algorithm amplifies 0.1mm micro-chest elevations.
                Differentiates true obstructive apnea from central shallow breathing, notifying attending
                nurses up to 14 seconds faster.
              </p>
            </div>

            {/* Waveform Representation Sub-UI */}
            <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/30">
              <div className="flex items-center justify-between text-on-surface-variant mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Optical Chest Wall Waveform
                </span>
                <span className="text-xs font-semibold text-tertiary">Regular Excursion</span>
              </div>
              <svg
                className="w-full h-12 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 400 60"
                aria-label="Simulated optical chest wall displacement waveform"
              >
                <path
                  d="M 0 30 Q 25 10 50 30 T 100 30 T 150 15 T 165 48 T 180 30 T 230 30 T 280 10 T 330 30 T 380 30 T 400 30"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/20 text-on-surface-variant text-[10px]">
                <span className="font-medium">APNEA WINDOW THRESHOLD: 15s</span>
                <span className="font-bold text-tertiary">0 EVENTS LOGGED (LAST 6H)</span>
              </div>
            </div>
          </motion.div>

          {/* Bento 3: Incubator Microclimate Closed-Loop (6 Cols) */}
          <motion.div
            variants={bentoVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-6 rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-xs border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  Modality 03
                </span>
                <span className="text-xs font-medium text-on-surface-variant font-mono">
                  AAP Acoustic &amp; Temp Guard
                </span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-on-surface mb-3">
                Incubator Microclimate Closed-Loop
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
                Continuous environmental sensor suite cross-references warmer hood humidity, airflow
                turbulence, ambient illuminance, and acoustic sound pressure to safeguard sensory
                neural maturation.
              </p>
            </div>

            {/* 3 Microclimate Sensor Gauges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-surface-container-low p-3 border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Acoustic SPL
                </span>
                <div className="font-display font-bold text-xl text-on-surface mt-1 tabular-nums">
                  41.2 <span className="text-xs font-normal text-on-surface-variant">dB</span>
                </div>
                <span className="text-[10px] font-bold text-tertiary">&lt;45 dB Safe (AAP)</span>
              </div>

              <div className="rounded-xl bg-surface-container-low p-3 border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Isolette RH
                </span>
                <div className="font-display font-bold text-xl text-on-surface mt-1 tabular-nums">
                  72 <span className="text-xs font-normal text-on-surface-variant">%</span>
                </div>
                <span className="text-[10px] font-bold text-primary">Target Range</span>
              </div>

              <div className="rounded-xl bg-surface-container-low p-3 border border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Ambient Lux
                </span>
                <div className="font-display font-bold text-xl text-on-surface mt-1 tabular-nums">
                  12 <span className="text-xs font-normal text-on-surface-variant">lx</span>
                </div>
                <span className="text-[10px] font-bold text-secondary">Circadian Rest</span>
              </div>
            </div>
          </motion.div>

          {/* Bento 4: Intelligent Triage & EHR Sync (6 Cols) */}
          <motion.div
            variants={bentoVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-6 rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-xs border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-surface" />
                  Modality 04
                </span>
                <span className="text-xs font-medium text-on-surface-variant font-mono">
                  Epic • Cerner • HL7 FHIR
                </span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-on-surface mb-3">
                Intelligent Triage &amp; Bi-Directional EHR Sync
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
                Automated structured vital charts pushed directly to your hospital EHR flowsheets.
                Generates shift-handoff AI summaries that highlight trend anomalies, feeding
                desaturations, and kangaroo bond durations.
              </p>
            </div>

            {/* Sync Status Card */}
            <div className="rounded-2xl bg-surface-container p-4 flex items-center justify-between gap-3 border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                  <Icon name="cloud_sync" size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-on-surface">
                    FHIR Observation Bundles Active
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Every 60s discrete telemetry push to hospital EMR
                  </p>
                </div>
              </div>
              <Icon name="check_circle" size={22} className="text-tertiary shrink-0" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
