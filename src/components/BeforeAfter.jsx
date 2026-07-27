import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Before/after comparison card. The whole surface is an invisible native
 * range input, so dragging, touch and arrow keys all work with zero JS math.
 * The "before" layer sits on top and gets clipped to the slider position.
 */
export default function BeforeAfter({ before, after, alt }) {
  const { t } = useTranslation()
  const [pos, setPos] = useState(50)

  return (
    <div className="group relative select-none overflow-hidden rounded-2xl">
      {/* After (base layer) */}
      <img
        src={after}
        alt={`${alt}, ${t('gallery.after')}`}
        loading="lazy"
        draggable="false"
        className="h-[24rem] w-full object-cover"
      />

      {/* Before (top layer, clipped to slider position) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt=""
          loading="lazy"
          draggable="false"
          className="h-[24rem] w-full object-cover"
        />
      </div>

      {/* Divider + handle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-charcoal/90"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal font-sans text-[10px] font-semibold tracking-wide text-base shadow-lg">
          ⇤⇥
        </span>
      </div>

      {/* Corner labels */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 rounded-full bg-base/70 px-3 py-1 font-sans text-xs font-medium text-charcoal backdrop-blur-sm"
      >
        {t('gallery.before')}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 rounded-full bg-base/70 px-3 py-1 font-sans text-xs font-medium text-charcoal backdrop-blur-sm"
      >
        {t('gallery.after')}
      </span>

      {/* Invisible native slider over the whole card: drag / touch / keyboard */}
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={t('gallery.slider_label')}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  )
}
