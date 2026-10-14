import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export const CtaBannerSection: React.FC = () => {
  return (
    <section id="schedule-demo" className="w-full bg-surface py-16 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative rounded-3xl bg-primary-container text-on-primary overflow-hidden p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/10"
        >
          {/* Ambient decorative glowing circles */}
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-70 animate-pulse duration-1000"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-10 -top-10 w-72 h-72 bg-secondary-container rounded-full blur-3xl opacity-40"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-xs">
              <Icon name="medical_services" size={16} className="text-white" />
              Institutional Evaluation Program
            </span>

            <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-6 leading-tight">
              Empower your NICU team with intelligent neonatal vigilance.
            </h2>

            <p className="font-sans text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed mb-8">
              Join premier academic pediatric hospitals piloting non-invasive biometric telemetry.
              Schedule a tailored simulation review with our clinical engineering staff.
            </p>

            {/* High-contrast Buttons in Blue Section */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {/* Primary Action Button: Solid White with Deep Clinical Blue Text */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#contact-evaluation"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-primary font-bold text-sm sm:text-base shadow-xl shadow-black/20 hover:bg-surface-container-low hover:text-primary-container transition-all duration-200 min-h-[48px]"
              >
                <span>Request 30-Day Hospital Evaluation</span>
                <Icon name="calendar_add_on" size={20} className="text-primary" />
              </motion.a>

              {/* Secondary Action Button: Frosted Glass White Outline */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#contact-biomed"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white border-2 border-white/30 backdrop-blur-md font-semibold text-sm sm:text-base hover:bg-white/20 hover:border-white/60 transition-all duration-200 min-h-[48px]"
              >
                <span>Contact Biomedical Engineering</span>
                <Icon name="build" size={20} className="text-white" />
              </motion.a>
            </div>

            {/* Bottom Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-xs sm:text-sm font-medium pt-4 border-t border-white/15">
              <div className="flex items-center gap-2">
                <Icon name="verified" size={18} className="text-tertiary-fixed" />
                <span>Complimentary Pilot Hardware</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="support_agent" size={18} className="text-tertiary-fixed" />
                <span>24/7 Clinical Specialist Staffing</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="verified_user" size={18} className="text-tertiary-fixed" />
                <span>IRB-Ready Research Support</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
