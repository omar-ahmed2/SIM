import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/Icon'

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How does SIM.AI monitor respiratory rate without skin adhesive leads?',
      answer:
        "SIM.AI utilizes High-Frequency Photometric Displacement Tracking (HPDT). By analyzing micro-pixel motion vectors of the infant's subcostal and sternal excursions in the 940nm spectrum, the neural network resolves thoracic expansions with sub-millimeter precision—even through standard hospital swaddling or incubator plastic covers.",
    },
    {
      question: 'Is 940nm infrared illumination safe for premature infant retinas?',
      answer:
        'Yes, completely. SIM.AI operates in the deep infrared spectrum (940nm), which is invisible to the human and neonatal eye. It emits zero visible light, causing no stimulus to underdeveloped pupillary reflexes or disruption of circadian melatonin cycles. The power level complies with IEC 62471 Photobiological Safety standards for exempt group clinical applications.',
    },
    {
      question: 'Does SIM.AI connect with our existing hospital VMS or nurse call system?',
      answer:
        'SIM.AI features an enterprise integration layer supporting standard HL7 v2.x, FHIR R4, and dry-contact or SIP-based nurse call alerting. It bridges seamlessly into central monitoring stations like Philips IntelliVue, GE CARESCAPE, and hospital Rauland / Vocera messaging workflows.',
    },
    {
      question: 'What are the hardware requirements for edge inference?',
      answer:
        'Each monitoring pod integrates its own low-power TPU acceleration module, requiring only standard Power-over-Ethernet (PoE+ 802.3at) or a 12V medical-isolated DC power adapter. No local server racks or costly GPU clusters are required within the NICU unit.',
    },
  ]

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="w-full bg-surface py-16 lg:py-24 border-b border-outline-variant/30">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Clinician &amp; BioMed Inquiries
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-on-surface mt-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Clear answers regarding optical biomechanics, infrared safety, and hospital infrastructure readiness.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const questionId = `faq-q-${index}`
            const answerId = `faq-a-${index}`

            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/40 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleItem(index)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4 hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[56px]"
                >
                  <span className="font-display font-semibold text-base sm:text-lg text-on-surface">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary shrink-0"
                  >
                    <Icon name="expand_more" size={24} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 text-on-surface-variant text-sm sm:text-base leading-relaxed border-t border-outline-variant/20 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
