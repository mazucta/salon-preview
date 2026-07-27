import { useTranslation } from 'react-i18next'
import { BRAND } from '../config'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-section text-charcoal">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        {/* Brand */}
        <div>
          <p className="font-display text-2xl">{BRAND}</p>
          <p className="mt-2 font-sans text-xs uppercase tracking-caps text-charcoal/60">
            {t('footer.tagline')}
          </p>
        </div>

        {/* Legal links */}
        <ul className="flex gap-6 font-sans text-xs uppercase tracking-[0.12em] text-charcoal/60">
          <li>
            <a href="#" className="hover:text-accent">
              {t('footer.privacy')}
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-accent">
              {t('footer.imprint')}
            </a>
          </li>
        </ul>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-6 py-5 text-center font-sans text-xs text-charcoal/50 lg:px-10">
          © {year} {BRAND}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
