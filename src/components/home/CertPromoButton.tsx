'use client'

/**
 * Small floating promo for the Claude certification prep section — home page only.
 * A slow-rotating ring with a Claude-style spark at the centre; expands a label on
 * hover/focus. Sits bottom-left (GennoorCare owns bottom-right). Dismissable per session.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CertPromoButton() {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('cert-promo-dismissed')) return
    } catch { /* storage unavailable: still show */ }
    const t = setTimeout(() => setHidden(false), 1600)
    return () => clearTimeout(t)
  }, [])

  if (hidden) return null

  return (
    <div className="fixed bottom-24 right-6 z-40 group" data-cert-promo>
      <style>{`
        @keyframes certspin { to { transform: rotate(360deg); } }
        @keyframes certglow { 0%,100% { box-shadow: 0 4px 18px rgba(217,119,87,.25); } 50% { box-shadow: 0 4px 26px rgba(217,119,87,.55); } }
        [data-cert-promo] .cert-ring { animation: certspin 7s linear infinite; }
        [data-cert-promo] .cert-core { animation: certglow 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          [data-cert-promo] .cert-ring { animation: none; }
          [data-cert-promo] .cert-core { animation: none; }
        }
      `}</style>
      <button
        aria-label="Dismiss"
        onClick={() => {
          try { sessionStorage.setItem('cert-promo-dismissed', '1') } catch { /* ignore */ }
          setHidden(true)
        }}
        className="absolute -top-1.5 -left-1.5 z-10 w-5 h-5 rounded-full bg-raised border border-gray-300 text-gray-400 text-[10px] leading-none items-center justify-center shadow-sm hidden group-hover:flex hover:text-gray-900"
      >
        ✕
      </button>
      <Link
        href="/claude/certifications"
        className="flex items-center gap-0 rounded-full bg-raised border border-gray-200 shadow-lg pl-1.5 pr-1.5 py-1.5 group-hover:pr-5 transition-all duration-300"
        aria-label="Claude certification prep"
      >
        {/* Rotating ring + spark core */}
        <span className="relative w-11 h-11 shrink-0">
          <span
            className="cert-ring absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #d97757, #e6906e, #f0b8a1, #d97757)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))',
            }}
            aria-hidden
          />
          <span className="cert-core absolute inset-[5px] rounded-full bg-[#d97757] flex items-center justify-center" aria-hidden>
            {/* Claude-style eight-ray spark */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ffffff" aria-hidden>
              <path d="M12 2l1.6 6.1L19 4.9l-3.4 5.2 6.1 1.9-6.1 1.9L19 19.1l-5.4-3.2L12 22l-1.6-6.1L5 19.1l3.4-5.2L2.3 12l6.1-1.9L5 4.9l5.4 3.2L12 2z" />
            </svg>
          </span>
        </span>
        {/* Label: hidden until hover/focus */}
        <span className="max-w-0 group-hover:max-w-[230px] overflow-hidden transition-all duration-300 whitespace-nowrap">
          <span className="pl-3 text-[13.5px] font-semibold text-gray-900">
            Claude Certification Prep
            <span className="block text-[11px] font-normal text-gray-400">4 exams · free courses ›</span>
          </span>
        </span>
      </Link>
    </div>
  )
}
