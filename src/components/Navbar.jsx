import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { BRAND } from '../config'

const LINKS = [
  { id: 'services', key: 'nav.services' },
  { id: 'pricing', key: 'nav.pricing' },
  { id: 'gallery', key: 'nav.gallery' },
  { id: 'contact', key: 'nav.contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Add a subtle blur/tint once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-base/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Wordmark */}
        <a
          href="#hero"
          onClick={close}
          className="font-display text-xl tracking-wide text-charcoal"
        >
          {BRAND}
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="group relative font-sans text-sm uppercase tracking-[0.12em] text-charcoal/80 transition-colors hover:text-charcoal"
              >
                {t(link.key)}
                {/* animated underline */}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>

        {/* Mobile / tablet controls */}
        <div className="flex items-center gap-4 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t('nav.menu')}
            aria-expanded={open}
            className="text-charcoal"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-line bg-base/95 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col px-6 py-2">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={close}
                  className="block py-3 font-sans text-sm uppercase tracking-[0.12em] text-charcoal/80"
                >
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
