'use client'

import { siteConfig } from '@/lib/site-config'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

/**
 * "What we've shipped" — the dark #1d1d1f metrics band from the Home
 * prototype: huge white count-up numerals, and the section unveils itself
 * through an expanding circular clip as it scrolls into view.
 */

const metrics = [
  {
    value: siteConfig.metrics.trainingPrograms,
    label: 'Training programs delivered',
    description: 'For teams at global enterprises',
  },
  {
    value: siteConfig.metrics.certifications,
    label: 'Microsoft certifications',
    description: 'Including MCT & Agentic AI',
  },
  {
    value: siteConfig.metrics.cSuiteLeaders,
    label: 'C-suite leaders trained',
    description: 'In AI strategy & adoption',
  },
  {
    value: siteConfig.metrics.countries,
    label: 'Countries',
    description: 'International delivery',
  },
]

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const numMatch = value.match(/^(\d+)(.*)$/)
  const [displayed, setDisplayed] = useState(0)
  const target = numMatch ? parseInt(numMatch[1]) : 0
  const suffix = numMatch ? numMatch[2] : value

  useEffect(() => {
    if (!inView || !numMatch) return
    const duration = 1400
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target])

  if (!numMatch) return <span>{value}</span>
  return (
    <span>
      {displayed}
      {suffix}
    </span>
  )
}

/** Scroll-driven circular unveil, as in the prototype's data-circle-reveal. */
function useCircleReveal(ref: React.RefObject<HTMLElement | null>) {
  const [clipPath, setClipPath] = useState<string | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(Math.max((vh - r.top) / (vh * 0.85), 0), 1)
      const radius = 8 + p * 142
      setClipPath(radius >= 150 ? undefined : `circle(${radius}% at 50% 60%)`)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return clipPath
}

export default function Metrics() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' })
  const clipPath = useCircleReveal(ref)

  return (
    <section
      ref={ref}
      className="bg-[#1d1d1f] py-20 lg:py-[110px] px-8"
      style={clipPath ? { clipPath } : undefined}
    >
      <div className="max-w-[1080px] mx-auto text-center">
        <p className="text-sm font-semibold tracking-[0.14em] uppercase text-[#86868b] mb-14">
          What we&rsquo;ve shipped
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map(metric => (
            <div key={metric.label}>
              <div className="text-[clamp(48px,5vw,72px)] font-bold tracking-[-0.03em] text-white leading-none">
                <AnimatedNumber value={metric.value} inView={isInView} />
              </div>
              <div className="text-sm font-semibold text-[#f5f5f7] mt-3">{metric.label}</div>
              <div className="text-xs text-[#86868b] mt-1">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
