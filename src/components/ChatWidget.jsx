import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send } from 'lucide-react'
import { answer } from '../agent'

// Floating assistant. The knowledge base (src/agent.js) is empty for now, so
// every question gets the fallback line — the UI is ready, the answers aren't.
export default function ChatWidget() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [log, setLog] = useState([{ from: 'bot', text: t('chat.greeting') }])
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [log, open])

  const send = (e) => {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    setInput('')
    setLog((l) => [
      ...l,
      { from: 'me', text: q },
      { from: 'bot', text: answer(q) ?? t('chat.fallback') },
    ])
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('chat.close') : t('chat.open')}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#171310] shadow-xl transition-transform active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[26rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-section shadow-2xl">
          <p className="border-b border-line px-4 py-3 font-display text-sm text-charcoal">
            {t('chat.title')}
          </p>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {log.map((m, i) => (
              <p
                key={i}
                className={[
                  'max-w-[85%] rounded-2xl px-3 py-2 font-sans text-sm',
                  m.from === 'me'
                    ? 'ml-auto bg-accent text-[#171310]'
                    : 'bg-base text-charcoal',
                ].join(' ')}
              >
                {m.text}
              </p>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              aria-label={t('chat.placeholder')}
              className="w-full rounded-xl border border-line bg-base px-3 py-2 font-sans text-sm text-charcoal placeholder:text-muted focus:border-accent"
            />
            <button
              type="submit"
              aria-label={t('chat.send')}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-[#171310] transition-transform active:scale-95"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
