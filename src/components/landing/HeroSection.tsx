import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { TelemetryHUD } from './TelemetryHUD'

interface HeroSectionProps {
  onOpenDemo: () => void
  id?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemo, id }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section id={id} className="relative w-full overflow-hidden bg-surface pt-28 sm:pt-32 pb-16 lg:pb-24 border-b border-outline-variant/30">
      {/* Ambient Clinical Lighting Glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-48 right-[-10%] w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-72 left-[-8%] w-[420px] h-[420px] bg-tertiary-fixed-dim/20 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-14"
        >

          {/* Main H1 Title for SEO */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.15] mb-6"
          >
            Continuous Computer-Vision &amp; Non-Invasive AI Telemetry for{' '}
            <span className="text-primary-container">Modern NICUs</span>
          </motion.h1>

          {/* Lead Paragraph */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-base sm:text-lg lg:text-xl text-on-surface-variant max-w-3xl leading-relaxed mb-8"
          >
            Protecting the most fragile lives. Zero-contact respiratory rate estimation, real-time
            micro-apnea detection, and closed-loop incubator microclimate tracking designed specifically for
            neonatal intensive care teams.
          </motion.p>
        </motion.div>

        {/* Live Telemetry HUD Simulation Card with entrance transition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
        >
          <TelemetryHUD onOpenDemo={onOpenDemo} />
        </motion.div>
      </div>
    </section>
  )
}
