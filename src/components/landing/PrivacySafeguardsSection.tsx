import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export const PrivacySafeguardsSection: React.FC = () => {
  const pillars = [
    {
      title: 'Strict Edge-Only Processing',
      description:
        'Raw high-definition video frames are rendered directly into volatile memory on hospital-managed on-prem edge micro-nodes. Pixel data is processed in real time and never leaves the local NICU VLAN.',
      badgeText: 'Zero Cloud Video Ingestion',
      icon: 'shield_person',
      iconBg: 'bg-tertiary-fixed text-tertiary',
      badgeColor: 'text-tertiary',
    },
    {
      title: 'Role-Based Smart Authentication',
      description:
        'NFC badge tap authorization and automated session locking protect bedside displays from unauthorized viewing. Comprehensive immutable audit logs record every clinician metric check.',
      badgeText: 'SOC2 Type II & HIPAA Verified',
      icon: 'badge',
      iconBg: 'bg-primary-fixed text-primary',
      badgeColor: 'text-primary',
    },
    {
      title: 'Non-Diagnostic Advisory Notice',
      description:
        'SIM.AI functions strictly as an adjunct continuous vigilance monitoring and clinical decision-support tool. It does not replace primary physician diagnostic assessments or resuscitation protocols.',
      badgeText: 'FDA Class II Predicate Guidance',
      icon: 'gavel',
      iconBg: 'bg-secondary-fixed text-secondary',
      badgeColor: 'text-secondary',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  }

  return (
    <section id="privacy" className="w-full bg-surface-container-low py-16 lg:py-24 border-b border-outline-variant/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-tertiary">
            Privacy Architecture
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-on-surface mt-2 tracking-tight">
            Responsible AI &amp; Zero-Trust Privacy Safeguards
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Built according to strict medical ethics. SIM.AI enforces physical and algorithmic privacy
            separation at the hardware edge.
          </p>
        </motion.div>

        {/* 3 Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="rounded-2xl bg-surface-container-lowest p-6 sm:p-8 shadow-xs border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-2xs ${pillar.iconBg}`}
                >
                  <Icon name={pillar.icon} size={24} />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-on-surface mb-3 leading-snug">
                  {pillar.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20 text-on-surface-variant text-xs font-medium flex items-center gap-1.5">
                <Icon name="check_circle" size={16} className={pillar.badgeColor} />
                <span>{pillar.badgeText}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
