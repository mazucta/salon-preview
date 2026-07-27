import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

export default function Pricing() {
  const { t } = useTranslation()
  const categories = t('pricing.categories', { returnObjects: true })

  return (
    <section id="pricing" className="bg-section py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <SectionHeading
          title={t('pricing.title')}
          lead={t('pricing.lead')}
          align="center"
        />

        <div className="mt-16 space-y-16">
          {Array.isArray(categories) &&
            categories.map((cat, i) => {
              // Only show the "correction" column if any row uses it
              const hasCorrection = cat.rows.some((r) => r.correction)

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <h3 className="mb-4 font-display text-2xl font-medium text-charcoal">
                    {cat.title}
                  </h3>

                  {/* Column headers — only shown when a correction column exists */}
                  {hasCorrection && (
                    <div className="hairline grid grid-cols-[1fr_auto_auto] items-baseline gap-4 pb-2">
                      <span />
                      <span className="w-24 text-right caps-label">
                        {t('pricing.col_first')}
                      </span>
                      <span className="w-24 text-right caps-label">
                        {t('pricing.col_correction')}
                      </span>
                    </div>
                  )}

                  {/* Rows */}
                  {cat.rows.map((row, j) => (
                    <div
                      key={j}
                      className={`hairline grid items-baseline gap-4 py-4 ${
                        hasCorrection
                          ? 'grid-cols-[1fr_auto_auto]'
                          : 'grid-cols-[1fr_auto]'
                      }`}
                    >
                      <span className="font-sans text-base text-charcoal">
                        {row.name}
                      </span>
                      <span className="w-24 text-right font-sans text-base text-muted">
                        {row.first}
                      </span>
                      {hasCorrection && (
                        <span className="w-24 text-right font-sans text-base text-muted">
                          {row.correction || '-'}
                        </span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
