import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-inverse-surface/75 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-surface-container-lowest rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-outline-variant/40 z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <Icon name="play_circle" size={20} />
                </div>
                <h3 id="video-modal-title" className="font-display font-bold text-lg sm:text-xl text-on-surface">
                  SIM.AI Bedside Telemetry Demonstration
                </h3>
              </div>

              <button
                type="button"
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onClose}
                aria-label="Close modal"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Video Preview Aspect Box */}
            <div className="aspect-video w-full rounded-2xl bg-surface-dim overflow-hidden relative flex items-center justify-center shadow-inner">
              <img
                src=""
                alt="SIM.AI clinical telemetry feed preview"
                className="w-full h-full object-cover filter brightness-75"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-on-primary p-4 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-primary-container/90 text-on-primary flex items-center justify-center shadow-xl backdrop-blur-xs cursor-pointer"
                >
                  <Icon name="play_arrow" size={36} className="ml-0.5" />
                </motion.div>
                <span className="font-display font-bold text-base sm:text-lg mt-1 text-white drop-shadow-md">
                  Simulated Stream: Neonatal Optical RR Estimation
                </span>
                <span className="text-xs sm:text-sm opacity-90 font-mono text-white/90">
                  Resolution: 1080p @ 60 FPS • 940nm Passive IR • 18ms TPU Latency
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-5 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-on-surface-variant border-t border-outline-variant/20">
              <span>
                Confidential medical simulator telemetry recording for institutional clinical evaluation.
              </span>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Dismiss
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
