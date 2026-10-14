import React from 'react'
import { Icon } from '../ui/Icon'
import type { ClinicianUser } from '../../types/auth'

interface FooterProps {
  currentUser?: ClinicianUser | null
  onNavigateDashboard?: () => void
}

export const Footer: React.FC<FooterProps> = ({ currentUser, onNavigateDashboard }) => {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface-variant pt-16 pb-12 border-t border-outline-variant/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">
          {/* Brand & Mission (2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-4 pr-0 lg:pr-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
                <Icon name="nest_cam_iq_outdoor" size={20} />
              </div>
              <span className="font-display font-bold text-xl text-on-surface">
                SIM<span className="text-primary">.AI</span> Incubator Monitor
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-md">
              Next-generation neonatal vigilance platform translating continuous biometric waveforms
              into compassionate, explainable AI early warnings for level II–IV NICUs.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface text-[11px] font-semibold border border-outline-variant/40">
                <Icon name="verified_user" size={14} className="text-tertiary" />
                HIPAA Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface text-[11px] font-semibold border border-outline-variant/40">
                <Icon name="upload_file" size={14} className="text-primary" />
                FDA 510(k) Pre-Market
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface text-[11px] font-semibold border border-outline-variant/40">
                <Icon name="sync_alt" size={14} className="text-secondary" />
                HL7 / FHIR R4
              </span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="flex flex-col gap-3">
            <span className="font-display font-semibold text-sm text-on-surface">Platform</span>
            <a href="#features" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Overview &amp; Features
            </a>
            <a href="#how-it-works" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Bedside Architecture
            </a>
            <a href="#technology" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Predictive Waveform AI
            </a>
            <a href="#schedule-demo" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Clinical Trial Protocol
            </a>
          </div>

          {/* Column 2: Compliance & Trust */}
          <div className="flex flex-col gap-3">
            <span className="font-display font-semibold text-sm text-on-surface">Compliance &amp; Trust</span>
            <a href="#privacy" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Cybersecurity Protocols
            </a>
            <a href="#privacy" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              EHR/EMR Interoperability
            </a>
            <a href="#privacy" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Data Governance &amp; BAA
            </a>
            <a href="#privacy" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              FDA Regulatory Submissions
            </a>
          </div>

          {/* Column 3: NICU Support */}
          <div className="flex flex-col gap-3">
            <span className="font-display font-semibold text-sm text-on-surface">NICU Support</span>
            <a href="#schedule-demo" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Request Hospital Pilot
            </a>
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  if (onNavigateDashboard) onNavigateDashboard()
                  else window.location.hash = '#dashboard'
                }}
                className="text-left text-xs sm:text-sm text-primary font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                <span>Clinical Dashboard</span>
              </button>
            ) : (
              <a href="#signin" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
                Clinician Portal
              </a>
            )}
            <a href="#privacy" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Incident Reporting
            </a>
            <a href="#how-it-works" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">
              Bioengineering Specs
            </a>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div className="flex flex-col gap-1 max-w-3xl">
            <p>
              &copy; {new Date().getFullYear()} SIM.AI Medical Technologies, Inc. All rights reserved.
              For institutional clinical evaluation and investigational use where designated.
            </p>
            <p className="text-[11px] text-on-surface-variant/80">
              Notice: SIM.AI Incubator Monitor is currently under FDA 510(k) Pre-Market Review.
              Statements have not been evaluated as sole diagnostic determinations.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs shrink-0">
            <a href="#privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#security" className="hover:text-primary transition-colors">
              Security Disclosures
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
