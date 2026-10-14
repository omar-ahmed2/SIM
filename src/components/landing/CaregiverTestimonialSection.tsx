import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../ui/Icon'

export const CaregiverTestimonialSection: React.FC = () => {
  return (
    <section className="w-full bg-surface py-16 lg:py-24 border-b border-outline-variant/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-surface-container p-6 sm:p-10 lg:p-14 shadow-sm border border-outline-variant/40"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image Column (6 cols) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-outline-variant/30"
            >
              <img
                src="src/assets/images/nurse-caregiver.png"
                alt="Pediatric nurse caring for premature baby in smart NICU incubator"
                className="w-full h-auto object-cover rounded-2xl aspect-[4/3]"
                loading="lazy"
              />
            </motion.div>

            {/* Narrative Column (6 cols) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                <Icon name="favorite" size={15} className="text-secondary" />
                Human-Centered Care
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-on-surface tracking-tight mb-4">
                Built Alongside Neonatologists &amp; Neonatal Nurse Practitioners
              </h2>

              <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4">
                Premature babies have skin up to 80% thinner than full-term infants. Frequent repositioning
                of adhesive sensors causes painful epidermal striping and sleep fragmentation during vital
                neurological development windows.
              </p>

              <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed mb-6">
                SIM.AI gives bedside nurses peace of mind by acting as a gentle, tireless guardian. It
                detects subtle shifts in chest respiration and skin perfusion continuously—enabling quiet,
                kangaroo-care skin-to-skin bonding without sensor tangle.
              </p>

              {/* Testimonial Quote Card */}
              <div className="rounded-2xl bg-surface-container-lowest p-5 sm:p-6 shadow-xs border border-outline-variant/40">
                <p className="font-sans text-sm sm:text-base italic text-on-surface mb-4 leading-relaxed">
                  “SIM.AI reduced our unit's false desaturation beeps by almost half. Our nurses spend less
                  time responding to sensor disconnects and more time supporting fragile babies and their
                  families.”
                </p>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-display font-bold text-sm sm:text-base text-on-surface">
                      Dr. Elena Ramos, MD, FAAP
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Chief of Neonatology, Children's Pavilion Hospital
                    </p>
                  </div>
                  <div className="flex text-amber-500" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} name="star" size={18} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
