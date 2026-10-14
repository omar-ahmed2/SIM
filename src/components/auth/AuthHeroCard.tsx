import React from 'react'
import { Icon } from '../ui/Icon'

export const AuthHeroCard: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden shadow-xs flex flex-col h-full">
      {/* Top Incubator Image with Live HUD Tag */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] bg-surface-container overflow-hidden">
        <img
          src="src/assets/images/nurse-caregiver.png"
          alt="Clinical team caring for a newborn in a neonatal incubator"
          className="w-full h-full object-cover object-center filter brightness-[0.95]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-on-surface/30 to-transparent" />

        {/* Image Overlay Tag */}
        <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">Live Incubator Telemetry Feed</span>
          </div>
          <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-medium border border-white/20">
            SIM.AI v1
          </span>
        </div>
      </div>

      {/* Narrative & Clinical Badges */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold mb-3 tracking-wide uppercase border border-primary/20">
            <Icon name="verified" size={14} className="text-primary" />
            <span>Smart Incubator Monitor (SIM.AI)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-on-surface leading-snug">
            Human-Centered Neonatal Care Platform
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-2.5">
            Intelligent contactless biometric telemetry, continuous vital monitoring, and microclimate intelligence
            for neonatal intensive care units.
          </p>
        </div>

        {/* 3 Clean Clinical Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-outline-variant/30">
          <div className="flex items-center gap-2.5 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
              <Icon name="security" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">HIPAA Compliant</span>
              <span className="text-[11px] text-on-surface-variant">256-bit AES</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary shrink-0">
              <Icon name="ecg_heart" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Real-time Waveform</span>
              <span className="text-[11px] text-on-surface-variant">Low Latency</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-surface-container-low/70 p-3 rounded-xl border border-outline-variant/30">
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary shrink-0">
              <Icon name="notifications_active" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Smart Alerts</span>
              <span className="text-[11px] text-on-surface-variant">AI Predictive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
