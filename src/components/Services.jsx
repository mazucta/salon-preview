import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true })

  return (
    <section id="services" className="bg-base py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading title={t('services.title')} lead={t('services.lead')} />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(items) &&
            items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              >
                <h3 className="font-display text-xl font-semibold text-charcoal sm:text-2xl">
                  {item.title}
                  <span aria-hidden="true" className="text-accent">.</span>
                </h3>

                <ul className="mt-6">
                  {item.points.map((point, j) => (
                    <li
                      key={j}
                      className="hairline py-3 font-sans text-sm text-muted first:border-t-0 first:pt-0"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}
