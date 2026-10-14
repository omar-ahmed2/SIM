import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export const ClinicalImpactSection: React.FC = () => {
  const stats = [
    {
      metric: '40%',
      title: 'Reduction in Sensory Alarm Fatigue',
      description: 'Multi-site multi-center retrospective validation eliminating posture-artifact alarms.',
      icon: 'notifications_off',
      iconBg: 'bg-primary-fixed text-primary',
      textColor: 'text-primary',
    },
    {
      metric: '18ms',
      title: 'Hospital Edge TPU Inference Latency',
      description: 'Near-zero latency processing bed-side without reliance on cloud data egress.',
      icon: 'speed',
      iconBg: 'bg-secondary-fixed text-secondary',
      textColor: 'text-secondary',
    },
    {
      metric: '0',
      title: 'Skin Disruptions in Kangaroo Care',
      description: 'No adhesive electrodes required for optical chest wall displacement tracking.',
      icon: 'volunteer_activism',
      iconBg: 'bg-tertiary-fixed text-tertiary',
      textColor: 'text-tertiary',
    },
    {
      metric: '99.4%',
      title: 'Optical Respiratory Accuracy',
      description: 'Benchmarked against standard transcutaneous impedance pneumography.',
      icon: 'analytics',
      iconBg: 'bg-primary-fixed-dim/40 text-primary-container',
      textColor: 'text-primary-container',
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

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section id="impact" className="w-full bg-surface-container-low py-16 lg:py-24 border-b border-outline-variant/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Clinical Evidence &amp; Impact
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-on-surface mt-2 tracking-tight">
              Designed for the Sensory Sanctuary of the NICU
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
            Standard NICU monitors produce up to 350 alarms per bed daily. SIM.AI applies deep
            convolutional temporal models to filter false alerts without missing true acute events.
          </p>
        </div>

        {/* 4 Animated Stat Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="rounded-2xl bg-surface-container-lowest p-6 sm:p-7 shadow-xs border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-2xs ${item.iconBg}`}
              >
                <Icon name={item.icon} size={24} />
              </div>
              <div>
                <div
                  className={`font-display font-extrabold text-3xl sm:text-4xl tracking-tight tabular-nums ${item.textColor}`}
                >
                  {item.metric}
                </div>
                <h3 className="font-sans font-semibold text-base text-on-surface mt-2 leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
