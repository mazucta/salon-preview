import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const pad = (n) => String(n).padStart(2, '0')
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const LOCALES = { ru: 'ru-RU', et: 'et-EE', en: 'en-GB' }

/**
 * Elegant month calendar. Disables past days and the given weekdays
 * (default: Sunday). Calls onSelect(isoDate) when a day is picked.
 */
export default function Calendar({
  value,
  onSelect,
  disabledWeekdays = [],
  disabledDates = [], // array of 'YYYY-MM-DD' the master marked as days off
  enabledDates = null, // when set, ONLY these 'YYYY-MM-DD' are selectable (curated mode)
  maxDays = 30, // how far ahead booking is allowed (matches the Hub window)
}) {
  const offDays = new Set(disabledDates)
  const onlyDays = enabledDates ? new Set(enabledDates) : null
  const { i18n } = useTranslation()
  const locale = LOCALES[i18n.resolvedLanguage] || 'en-GB'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + maxDays)

  const [view, setView] = useState(() => {
    const base = value ? new Date(value) : today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const year = view.getFullYear()
  const month = view.getMonth()

  // Monday-first grid
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  // Mon–Sun short labels in the active language
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' })
  )

  const rawMonth = view.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  const monthLabel = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1)

  const curMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxMonthStart = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
  const canPrev = new Date(year, month, 1) > curMonthStart
  const canNext = new Date(year, month, 1) < maxMonthStart

  const selected = value ? new Date(value) : null
  if (selected) selected.setHours(0, 0, 0, 0)

  const isDisabled = (d) =>
    d < today ||
    d > maxDate ||
    disabledWeekdays.includes(d.getDay()) ||
    offDays.has(toISO(d)) ||
    (onlyDays !== null && !onlyDays.has(toISO(d)))
  const isSameDay = (a, b) => a && b && a.getTime() === b.getTime()

  return (
    <div className="rounded-2xl border border-line bg-section p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canPrev && setView(new Date(year, month - 1, 1))}
          disabled={!canPrev}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream disabled:opacity-25"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-display text-lg text-charcoal">{monthLabel}</span>
        <button
          type="button"
          onClick={() => canNext && setView(new Date(year, month + 1, 1))}
          disabled={!canNext}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-cream disabled:opacity-25"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekdays.map((w) => (
          <div
            key={w}
            className="text-center font-sans text-[10px] uppercase tracking-[0.12em] text-subtle"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />
          const disabled = isDisabled(d)
          const active = isSameDay(d, selected)
          const isToday = isSameDay(d, today)
          return (
            <button
              key={toISO(d)}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(toISO(d))}
              className={[
                'aspect-square rounded-lg font-sans text-sm transition-colors',
                active
                  ? 'bg-accent font-medium text-[#111214]'
                  : disabled
                    ? 'cursor-not-allowed text-muted/30'
                    : 'text-charcoal hover:bg-cream',
                !active && isToday ? 'ring-1 ring-accent/50' : '',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
