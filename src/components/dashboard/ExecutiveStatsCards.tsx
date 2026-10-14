import React from 'react'
import { Icon } from '../ui/Icon'
import type { ExecutiveStats } from '../../types/dashboard'

interface ExecutiveStatsCardsProps {
  stats: ExecutiveStats
  onNavigateToSection?: (sectionId: string) => void
}

export const ExecutiveStatsCards: React.FC<ExecutiveStatsCardsProps> = ({
  stats,
  onNavigateToSection,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Infants */}
      <div
        onClick={() => onNavigateToSection?.('patient-roster-section')}
        className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between min-h-[148px] hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Total Infants
          </span>
          <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icon name="child_care" size={18} />
          </div>
        </div>

        <div className="flex flex-col my-1">
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight leading-none tabular-nums">
            {stats.totalInfants}
          </span>
          <span className="text-xs text-on-surface-variant mt-1.5 font-medium">
            {stats.totalInfants === 0
              ? 'No infants currently admitted'
              : `${stats.totalInfants} patient${stats.totalInfants > 1 ? 's' : ''} in neonatal care`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
          <span className="text-on-surface-variant text-[11px]">
            {stats.totalInfants === 0 ? 'Registry Empty' : 'Admitted Active'}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              stats.totalInfants > 0
                ? 'bg-primary-fixed text-primary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {stats.totalInfants > 0 ? 'Active Census' : 'Standby'}
          </span>
        </div>
      </div>

      {/* 2. Active Incubators */}
      <div
        onClick={() => onNavigateToSection?.('patient-roster-section')}
        className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between min-h-[148px] hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Active Incubators
          </span>
          <div className="w-8 h-8 rounded-xl bg-surface-container text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icon name="single_bed" size={18} />
          </div>
        </div>

        <div className="flex flex-col my-1">
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight leading-none tabular-nums">
            {stats.activeIncubators}
          </span>
          <span className="text-xs text-on-surface-variant mt-1.5 font-medium">
            {stats.activeIncubators === 0
              ? 'No active incubator units'
              : `${stats.activeIncubators} unit${stats.activeIncubators > 1 ? 's' : ''} actively assigned`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
          <span className="text-on-surface-variant text-[11px]">
            {stats.activeIncubators === 0 ? 'No Units Bound' : 'Isolette Pod Units'}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              stats.activeIncubators > 0
                ? 'bg-tertiary-fixed text-tertiary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {stats.activeIncubators > 0 ? 'Operational' : 'Unbound'}
          </span>
        </div>
      </div>

      {/* 3. Active Alerts */}
      <div
        onClick={() => onNavigateToSection?.('alerts-section')}
        className={`rounded-2xl p-4 sm:p-5 shadow-xs border flex flex-col justify-between min-h-[148px] hover:shadow-sm transition-all cursor-pointer group ${
          stats.activeAlerts > 0
            ? 'bg-error-container/20 border-error/40'
            : 'bg-surface-container-lowest border-outline-variant/30 hover:border-tertiary/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
              stats.activeAlerts > 0 ? 'text-error font-extrabold' : 'text-on-surface-variant'
            }`}
          >
            Active Alerts
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${
              stats.activeAlerts > 0
                ? 'bg-error-container text-on-error-container animate-bounce'
                : 'bg-tertiary-fixed/30 text-tertiary'
            }`}
          >
            <Icon name={stats.activeAlerts > 0 ? 'notifications_active' : 'check_circle'} size={18} />
          </div>
        </div>

        <div className="flex flex-col my-1">
          <span
            className={`font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-none tabular-nums ${
              stats.activeAlerts > 0 ? 'text-error' : 'text-on-surface'
            }`}
          >
            {stats.activeAlerts}
          </span>
          <span className="text-xs text-on-surface-variant mt-1.5 font-medium">
            {stats.activeAlerts === 0
              ? 'All parameters nominal & safe'
              : `${stats.activeAlerts} unacknowledged clinical alert${stats.activeAlerts > 1 ? 's' : ''}`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
          <span className="text-on-surface-variant text-[11px]">Triage Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              stats.activeAlerts > 0
                ? 'bg-error-container text-on-error-container animate-pulse'
                : 'bg-tertiary-fixed text-tertiary'
            }`}
          >
            {stats.activeAlerts > 0 ? 'Needs Attention' : 'Quiet / Safe'}
          </span>
        </div>
      </div>

      {/* 4. Analyzed AI Sessions */}
      <div
        onClick={() => onNavigateToSection?.('ai-sessions-section')}
        className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/30 flex flex-col justify-between min-h-[148px] hover:border-secondary/40 hover:shadow-sm transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            AI Video Sessions
          </span>
          <div className="w-8 h-8 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Icon name="auto_awesome" size={18} />
          </div>
        </div>

        <div className="flex flex-col my-1">
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight leading-none tabular-nums">
            {stats.analyzedVideoSessions}
          </span>
          <span className="text-xs text-on-surface-variant mt-1.5 font-medium">
            {stats.analyzedVideoSessions === 0
              ? 'No video sessions analyzed'
              : `${stats.analyzedVideoSessions} session${stats.analyzedVideoSessions > 1 ? 's' : ''} processed by AI`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
          <span className="text-on-surface-variant text-[11px]">Vision Subsystem</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              stats.analyzedVideoSessions > 0
                ? 'bg-secondary-fixed text-secondary'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {stats.analyzedVideoSessions > 0 ? 'Engine Active' : 'Standby'}
          </span>
        </div>
      </div>
    </div>
  )
}
export default ExecutiveStatsCards
