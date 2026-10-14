import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export const OnboardingStepsSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Toolless Isolette Mounting',
      description:
        'Mount the medical-grade optical sensor pod to standard Draeger, GE Giraffe, or Atom incubators using universal quick-release clamps.',
      badgeText: 'ISO 13485 Bio-Compatible',
      badgeIcon: 'lock',
      badgeColor: 'text-tertiary',
    },
    {
      number: '02',
      title: 'Hospital VLAN & MRN Match',
      description:
        'Scan infant barcoded hospital wristband with the nurse tablet. Instant bed assignment pairs directly to your isolated hospital VLAN.',
      badgeText: '802.1X WPA3 Enterprise',
      badgeIcon: 'wifi_protected_setup',
      badgeColor: 'text-tertiary',
    },
    {
      number: '03',
      title: 'Auto-Optical Calibration',
      description:
        'The on-device model maps chest coordinates within 4 seconds. Accounts for swaddling, phototherapy masks, and high-frequency ventilators.',
      badgeText: 'Self-Correcting Field',
      badgeIcon: 'tune',
      badgeColor: 'text-secondary',
    },
    {
      number: '04',
      title: 'Synchronous Central Broadcast',
      description:
        "Waveforms stream simultaneously to bedside monitors, central nurses' stations, and clinician mobile devices with priority tiered escalation.",
      badgeText: 'Multi-Screen Relay Active',
      badgeIcon: 'cell_tower',
      badgeColor: 'text-tertiary',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const stepCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  }

  return (
    <section id="how-it-works" className="w-full bg-surface-container-low py-16 lg:py-24 border-b border-outline-variant/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Implementation Blueprint
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-on-surface mt-2 tracking-tight">
            Zero-Invasive Bedside Onboarding in 4 Steps
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Engineered to fit seamlessly into fast-paced NICU nursing workflows without requiring hardware
            recalibration between patient shifts.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepCardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="rounded-2xl bg-surface-container-lowest p-6 sm:p-7 shadow-xs border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary font-display font-extrabold text-xl mb-6 shadow-2xs">
                  {step.number}
                </div>
                <h3 className="font-display font-bold text-lg text-on-surface mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-outline-variant/20 text-on-surface-variant text-xs font-medium flex items-center gap-1.5">
                <Icon name={step.badgeIcon} size={16} className={step.badgeColor} />
                <span>{step.badgeText}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
