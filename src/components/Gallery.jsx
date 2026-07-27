import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import BeforeAfter from './BeforeAfter'

// Before/after pairs live in /public as ba-N-before.jpg + ba-N-after.jpg.
// List them here; a pair with a missing file hides itself.
const PAIRS = [
  { before: '/ba-1-before.jpg', after: '/ba-1-after.jpg' },
  { before: '/ba-2-before.jpg', after: '/ba-2-after.jpg' },
  { before: '/ba-3-before.jpg', after: '/ba-3-after.jpg' },
]

export default function Gallery() {
  const { t } = useTranslation()
  const [failedPairs, setFailedPairs] = useState({})
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
  })

  const pairs = PAIRS.filter((_, i) => !failedPairs[i])

  // Re-measure the carousel whenever the visible set changes
  useEffect(() => {
    if (emblaApi) emblaApi.reInit()
  }, [emblaApi, pairs.length])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  if (pairs.length === 0) return null

  return (
    <section id="gallery" className="bg-base py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading title={t('gallery.title')} lead={t('gallery.lead')} />

        {/* Carousel viewport */}
        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {pairs.map((pair, i) => (
              <div
                key={`pair-${i}`}
                className="min-w-0 shrink-0 grow-0 basis-[86%] sm:basis-[48%] lg:basis-[32%]"
              >
                <BeforeAfter
                  before={pair.before}
                  after={pair.after}
                  alt={`${t('gallery.photo_alt')} ${i + 1}`}
                />
                {/* Hide the pair if either image is missing */}
                <img src={pair.before} alt="" className="hidden" onError={() => setFailedPairs((f) => ({ ...f, [i]: true }))} />
                <img src={pair.after} alt="" className="hidden" onError={() => setFailedPairs((f) => ({ ...f, [i]: true }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Arrow controls */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label={t('gallery.prev')}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-accent text-charcoal transition-colors hover:bg-accent hover:text-[#171310]"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label={t('gallery.next')}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-accent text-charcoal transition-colors hover:bg-accent hover:text-[#171310]"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
