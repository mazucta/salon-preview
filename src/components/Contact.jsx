import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Instagram, Check, Loader2, MessageCircle, Send } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Calendar from './Calendar'
import { HUB_URL, TENANT, TIME_SLOTS, DEMO } from '../config'

const CONTACT_METHODS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'telegram', label: 'Telegram', icon: Send },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
]

export default function Contact() {
  const { t, i18n } = useTranslation()
  const options = t('contact.services_options', { returnObjects: true })

  const [form, setForm] = useState({
    name: '',
    method: 'whatsapp',
    contact: '',
    service: '',
    date: '',
    time: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(new Set()) // "YYYY-MM-DD HH:mm" already taken
  const [daysOff, setDaysOff] = useState([]) // "YYYY-MM-DD" master is off
  const [slots, setSlots] = useState(TIME_SLOTS) // bookable times (master can customize via the bot)
  const [curated, setCurated] = useState([]) // per-date times from the bot; when set, only these dates/times are offered
  // status: 'idle' | 'submitting' | 'sent' | 'demo' | 'error' | 'limit'
  const [status, setStatus] = useState('idle')
  const [notifyUrl, setNotifyUrl] = useState('') // t.me deep link: get booking updates in Telegram

  // Load availability once (the Hub returns the next ~14 days of busy/daysOff)
  useEffect(() => {
    if (!HUB_URL || DEMO) return
    let cancelled = false
    fetch(`${HUB_URL}/api/availability?tenant=${TENANT}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data) return
        setBusy(new Set(data.busy || []))
        setDaysOff(data.daysOff || [])
        if (Array.isArray(data.slots) && data.slots.length) setSlots(data.slots)
        if (Array.isArray(data.curated)) setCurated(data.curated)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const update = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((er) => ({ ...er, [name]: undefined }))
    if (status === 'error' || status === 'limit') setStatus('idle')
  }
  const handleChange = (e) => update(e.target.name, e.target.value)

  // A slot is unavailable if the Hub reports it busy (the Hub also marks
  // today's already-passed slots busy, in the studio timezone).
  const slotDisabled = (slot) => busy.has(`${form.date} ${slot}`)

  // Curated mode: the master picked exact dates+times in the bot — offer only those.
  const curatedMode = curated.length > 0
  const timeSlots = curatedMode ? curated.find((s) => s.date === form.date)?.times || [] : slots

  // Nearest bookable date: curated dates, or the 30-day window minus days off.
  // Empty → nothing bookable at all (vacation / fully blocked month).
  const plusDays = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10)
  const bookableDates = curatedMode
    ? curated.filter((s) => s.times?.length && s.date >= plusDays(0)).map((s) => s.date).sort()
    : Array.from({ length: 30 }, (_, i) => plusDays(i)).filter((d) => !daysOff.includes(d))
  const nearestDate = bookableDates[0] || ''
  const dateLbl = (d) =>
    new Date(`${d}T12:00:00`).toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' })

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = t('contact.form.required')
    if (!form.contact.trim()) next.contact = t('contact.form.required')
    if (!form.service) next.service = t('contact.form.required')
    if (!form.date) next.date = t('contact.form.required')
    if (!form.time) next.time = t('contact.form.required')
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    if (DEMO) {
      setStatus('demo')
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch(`${HUB_URL}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: TENANT, ...form }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setNotifyUrl(data.notifyUrl || '')
        setStatus('sent')
        setForm({
          name: '',
          method: 'whatsapp',
          contact: '',
          service: '',
          date: '',
          time: '',
          message: '',
        })
      } else if (data.error === 'daily_limit') {
        setStatus('limit')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const fieldClass = (name) =>
    `w-full rounded-xl border bg-section px-4 py-3 font-sans text-sm text-charcoal placeholder:text-muted transition-colors focus:border-accent ${
      errors[name] ? 'border-brick' : 'border-line'
    }`

  if (status === 'sent' || status === 'demo') {
    return (
      <section id="contact" className="bg-base py-24 lg:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
          <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-[#111214]">
            <Check size={28} />
          </span>
          <SectionHeading title={t(status === 'demo' ? 'contact.form.demo' : 'contact.form.success')} align="center" />
          <p className="mt-6 font-sans text-base text-muted">
            {t(status === 'demo' ? 'contact.form.demo_note' : 'contact.form.success_note')}
          </p>
          {notifyUrl && (
            <div className="mt-8">
              <a
                href={notifyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-section px-6 py-3 font-sans text-sm text-charcoal transition-colors hover:border-accent"
              >
                <Send size={16} />
                {t('contact.form.notify')}
              </a>
              <p className="mt-3 font-sans text-xs text-muted">{t('contact.form.notify_note')}</p>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="bg-base py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <SectionHeading title={t('contact.title')} lead={t('contact.intro')} align="center" />

        <form onSubmit={handleSubmit} noValidate className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left column: details */}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('contact.form.name')}
                aria-label={t('contact.form.name')}
                className={fieldClass('name')}
              />
              {errors.name && <p className="mt-1 font-sans text-xs text-brick">{errors.name}</p>}
            </div>

            {/* Contact method toggle */}
            <div>
              <p className="caps-label mb-2">{t('contact.form.method')}</p>
              <div className="flex gap-2">
                {CONTACT_METHODS.map(({ id, label, icon: Icon }) => {
                  const active = form.method === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update('method', id)}
                      className={[
                        'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm transition-colors',
                        active
                          ? 'border-accent bg-accent font-medium text-[#111214]'
                          : 'border-line text-charcoal hover:border-accent',
                      ].join(' ')}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder={
                  form.method === 'telegram'
                    ? t('contact.form.contact_telegram')
                    : form.method === 'instagram'
                      ? t('contact.form.contact_instagram')
                      : t('contact.form.contact_whatsapp')
                }
                aria-label={t('contact.form.contact')}
                className={fieldClass('contact')}
              />
              {errors.contact && (
                <p className="mt-1 font-sans text-xs text-brick">{errors.contact}</p>
              )}
            </div>

            <div>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                aria-label={t('contact.form.service')}
                className={`${fieldClass('service')} ${form.service ? 'text-charcoal' : 'text-muted'}`}
              >
                <option value="" disabled>
                  {t('contact.form.service_placeholder')}
                </option>
                {Array.isArray(options) &&
                  options.map((opt) => (
                    <option key={opt} value={opt} className="text-charcoal">
                      {opt}
                    </option>
                  ))}
              </select>
              {errors.service && (
                <p className="mt-1 font-sans text-xs text-brick">{errors.service}</p>
              )}
            </div>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder={t('contact.form.message')}
              aria-label={t('contact.form.message')}
              className={`${fieldClass('message')} resize-none`}
            />
          </div>

          {/* Right column: date + time */}
          <div className="space-y-5">
            <div>
              <p className="caps-label mb-3">{t('contact.form.date')}</p>
              {!nearestDate ? (
                <p className="rounded-xl border border-line bg-section px-4 py-4 font-sans text-sm text-muted">
                  {t('contact.form.no_dates')}
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      update('date', nearestDate)
                      update('time', '')
                    }}
                    className="mb-3 font-sans text-xs text-accent hover:underline"
                  >
                    {t('contact.form.nearest')}: {dateLbl(nearestDate)} →
                  </button>
                  <Calendar
                    value={form.date}
                    onSelect={(iso) => {
                      update('date', iso)
                      update('time', '') // the new date may offer different times
                    }}
                    disabledDates={daysOff}
                    enabledDates={curatedMode ? curated.filter((s) => s.times?.length).map((s) => s.date) : null}
                  />
                </>
              )}
              {errors.date && <p className="mt-1 font-sans text-xs text-brick">{errors.date}</p>}
            </div>

            <div>
              <p className="caps-label mb-3">{t('contact.form.time')}</p>
              {!form.date ? (
                <p className="font-sans text-xs text-muted">{t('contact.form.pick_date_first')}</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {timeSlots.map((slot) => {
                      const taken = slotDisabled(slot)
                      const active = form.time === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={taken}
                          onClick={() => update('time', slot)}
                          className={[
                            'rounded-full border px-2 py-2 font-sans text-sm transition-colors',
                            active
                              ? 'border-accent bg-accent font-medium text-[#111214]'
                              : taken
                                ? 'cursor-not-allowed border-line text-muted/40 line-through'
                                : 'border-line text-charcoal hover:border-accent',
                          ].join(' ')}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                  {timeSlots.every(slotDisabled) && (
                    <p className="mt-2 font-sans text-xs text-muted">{t('contact.form.no_slots')}</p>
                  )}
                </>
              )}
              {errors.time && <p className="mt-1 font-sans text-xs text-brick">{errors.time}</p>}
            </div>
          </div>

          {/* Footer row: status + submit */}
          <div className="lg:col-span-2">
            {status === 'error' && (
              <p className="mb-3 font-sans text-sm text-brick">{t('contact.form.error')}</p>
            )}
            {status === 'limit' && (
              <p className="mb-3 font-sans text-sm text-brick">{t('contact.form.limit')}</p>
            )}
            <div className="flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-filled w-full disabled:opacity-70 sm:w-auto"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> {t('contact.form.sending')}
                  </>
                ) : (
                  t('contact.form.submit')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
