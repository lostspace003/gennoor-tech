'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X, ArrowRight, Sparkles } from 'lucide-react'

export default function ClaudeCoworkPopup() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') return
    if (sessionStorage.getItem('cowork-popup-dismissed')) return

    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [pathname])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('cowork-popup-dismissed', '1')
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={dismiss}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1B2845] px-6 pt-6 pb-5 rounded-t-2xl relative">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <span className="text-2xl font-black tracking-tight text-white uppercase">
                  Claude <span className="text-[#FFD23F]">Cowork</span>
                </span>
              </div>

              <div className="inline-block bg-[#FFD23F] text-[#1B2845] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                Free Workshop · 1000 Seats Only
              </div>

              <h2 className="text-white text-lg font-bold leading-tight mb-2">
                Stop drowning in busywork.<br />
                Ship work like an operator.
              </h2>

              <p className="text-white/80 text-sm leading-relaxed">
                A free 8-hour hands-on workshop that turns scattered tools into one autonomous coworker.
              </p>
            </div>

            <div className="hidden min-[400px]:flex flex-col items-center justify-center shrink-0 mr-2">
              <img src="/assets/jalal-portrait.jpeg" alt="Jalal Khan"
                className="w-[80px] h-[100px] rounded-xl object-cover mb-2" style={{ objectPosition: '50% 20%', boxShadow: '0 4px 16px rgba(0,0,0,.3)' }} />
              <p className="text-white text-[11px] font-bold leading-tight text-center">Jalal Khan</p>
              <p className="text-[#FFD23F] text-[9px] font-semibold text-center">Microsoft Certified<br />Trainer</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: '8 hrs intensive', color: '#FF6B35' },
              { label: '21 live labs', color: '#00A8A8' },
              { label: '1000 seats only', color: '#7B5EA7' },
            ].map((pill) => (
              <span
                key={pill.label}
                className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full"
                style={{ backgroundColor: pill.color }}
              >
                {pill.label}
              </span>
            ))}
          </div>

          <ul className="space-y-2 text-sm text-[#1B2845] mb-5">
            {[
              'Reclaim 5+ hours every week',
              'Build real workflows live',
              'Walk away with a rollout playbook',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD23F] shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/claude-cowork"
            onClick={dismiss}
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold rounded-full transition-colors text-sm"
          >
            GRAB MY FREE SEAT <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer */}
        <div className="bg-[#FFF8F0] px-6 py-3 rounded-b-2xl text-center">
          <p className="text-[11px] text-[#5C6784]">
            100% free &middot; No upsell &middot; Open to anyone, anywhere &middot; First 1000 only
          </p>
        </div>
      </div>
    </div>
  )
}
