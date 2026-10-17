import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

interface TelemetryHUDProps {
  onOpenDemo?: () => void
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ onOpenDemo }) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-surface-container-lowest shadow-2xl p-2 sm:p-3 border border-outline-variant/40">
      <div className="relative rounded-2xl overflow-hidden aspect-video w-full bg-surface-dim">
        {/* Real-world high-resolution clinical incubator preview */}
        <img
          src="src/assets/images/incubator-hero.png"
          alt="SIM.AI smart neonatal incubator live monitoring in advanced NICU"
          className="w-full h-full object-cover filter brightness-[0.92]"
          loading="eager"
        />

        {/* Play video overlay button with pulsing micro-interaction */}
        {onOpenDemo && (
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onOpenDemo}
            className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-container/90 text-on-primary backdrop-blur-md shadow-2xl flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 group cursor-pointer"
            aria-label="Play simulated neonatal telemetry stream"
          >
            <Icon name="play_arrow" size={40} className="ml-1 group-hover:scale-105 transition-transform" />
          </motion.button>
        )}

        {/* Top HUD Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 bg-linear-to-b from-inverse-surface/85 via-inverse-surface/40 to-transparent text-inverse-on-surface">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-inverse-surface/80 backdrop-blur-md border border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim animate-ping" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-inverse-on-surface">
                BED 04 • POD B (NICU-EAST)
              </span>
            </div>
            <span className="text-xs font-mono text-inverse-on-surface/80 hidden sm:inline-block">
              MRN: #892-441-A
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest/20 backdrop-blur-md text-inverse-on-surface text-xs font-medium flex items-center gap-1.5">
              <Icon name="videocam" size={15} className="text-tertiary-fixed-dim" />
              <span>940nm Passive IR</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-tertiary-container/90 backdrop-blur-md text-on-primary text-xs font-semibold flex items-center gap-1">
              <Icon name="check_circle" size={15} />
              <span>Stable Waveforms</span>
            </div>
          </div>
        </div>

        {/* Bottom Floating Telemetry Pods with gentle hover lift */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-linear-to-t from-inverse-surface/90 via-inverse-surface/60 to-transparent">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Metric 1: Heart Rate */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-3 shadow-md border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[10px] font-bold uppercase tracking-wider">Heart Rate</span>
                <Icon name="ecg_heart" size={16} className="text-primary" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display font-bold text-2xl sm:text-3xl text-on-surface tabular-nums">
                  148
                </span>
                <span className="text-xs font-medium text-on-surface-variant">bpm</span>
              </div>
              {/* Mini Sparkline Simulation */}
              <div className="w-full h-4 mt-1.5 flex items-end gap-1" aria-hidden="true">
                <span className="w-1.5 h-2 bg-primary/40 rounded-full" />
                <span className="w-1.5 h-3 bg-primary/60 rounded-full" />
                <span className="w-1.5 h-4 bg-primary rounded-full animate-pulse" />
                <span className="w-1.5 h-2.5 bg-primary/50 rounded-full" />
                <span className="w-1.5 h-4 bg-primary rounded-full" />
                <span className="w-1.5 h-3 bg-primary/60 rounded-full" />
                <span className="w-1.5 h-4 bg-primary rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Metric 2: SpO2 */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-3 shadow-md border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[10px] font-bold uppercase tracking-wider">SpO2 (Pulse-Ox)</span>
                <Icon name="water_drop" size={16} className="text-tertiary" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display font-bold text-2xl sm:text-3xl text-tertiary tabular-nums">
                  97
                </span>
                <span className="text-xs font-medium text-on-surface-variant">%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                <span>Perfusion Index 2.8</span>
              </div>
            </motion.div>

            {/* Metric 3: Skin Temp */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-3 shadow-md border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[10px] font-bold uppercase tracking-wider">Skin Temp (IR)</span>
                <Icon name="device_thermostat" size={16} className="text-primary" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display font-bold text-2xl sm:text-3xl text-on-surface tabular-nums">
                  36.8
                </span>
                <span className="text-xs font-medium text-on-surface-variant">°C</span>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1 font-medium">
                Delta: +0.1°C / 4h (Isolette)
              </div>
            </motion.div>

            {/* Metric 4: AI Posture & Respiratory Rate */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className="rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-3 shadow-md border border-outline-variant/30 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Posture / RR</span>
                <Icon name="psychology" size={16} className="text-secondary" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display font-bold text-2xl sm:text-3xl text-secondary tabular-nums">
                  42
                </span>
                <span className="text-xs font-medium text-on-surface-variant">br/min</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                <span>Supine</span>
                <span>•</span>
                <span>99.2% Conf</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
