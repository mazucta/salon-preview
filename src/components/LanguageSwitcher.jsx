import { useTranslation } from 'react-i18next'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'et', label: 'ET' },
  { code: 'ru', label: 'RU' },
]

/**
 * Compact EN / ET / RU switcher. Changing the language updates the whole
 * site instantly; the choice is persisted to localStorage by i18next.
 */
export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation()
  const current = i18n.resolvedLanguage

  return (
    <div className={`flex items-center gap-1 font-sans text-xs ${className}`}>
      {LANGS.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          <button
            type="button"
            onClick={() => i18n.changeLanguage(code)}
            aria-pressed={current === code}
            aria-label={`Switch language to ${label}`}
            className={`px-1.5 py-0.5 tracking-[0.1em] transition-colors duration-200 ${
              current === code
                ? 'text-accent font-medium'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            {label}
          </button>
          {i < LANGS.length - 1 && <span className="text-muted/40">/</span>}
        </span>
      ))}
    </div>
  )
}
