import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 * i },
  }),
}

// Statement-only hero: no portrait, so the promise carries the whole screen.
export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16"
    >
      <motion.div
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-4xl px-6 text-center lg:px-10"
      >
        <motion.p
          custom={0}
          variants={fadeUp}
          className="font-sans text-sm font-medium text-accent"
        >
          {t('hero.signature')}
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="mt-5 font-display text-[clamp(2.1rem,6vw,4.8rem)] font-semibold leading-[1.12] text-charcoal [text-wrap:balance]"
        >
          {t('hero.statement')}
          <span aria-hidden="true" className="text-accent">.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-muted"
        >
          {t('hero.intro')}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a href="#contact" className="btn-filled">
            {t('hero.cta_book')}
          </a>
          <a href="#gallery" className="btn-outline">
            {t('hero.cta_gallery')}
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
