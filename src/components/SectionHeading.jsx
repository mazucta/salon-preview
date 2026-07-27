import { motion } from 'framer-motion'

/**
 * Section heading: a display title that ends with a caramel full stop (the
 * site's signature tic) and an optional one-liner underneath.
 */
export default function SectionHeading({ title, lead, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={align === 'center' ? 'text-center' : 'text-left'}
    >
      <h2 className="font-display text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl [text-wrap:balance]">
        {title}
        <span aria-hidden="true" className="text-accent">.</span>
      </h2>
      {lead && (
        <p
          className={`mt-4 max-w-xl font-sans text-base leading-relaxed text-muted ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {lead}
        </p>
      )}
    </motion.div>
  )
}
