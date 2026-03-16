// Animated Logo Showcase Component
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the animated logo to avoid SSR issues
const GennoorLogo = dynamic(() => import('@/components/GennoorLogo'), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full animate-pulse bg-gray-200 rounded-lg" />
})

export default function AnimatedLogoShowcase() {

  const handleReplay = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Remove the element from DOM
      const parent = element.parentNode
      const nextSibling = element.nextSibling
      parent?.removeChild(element)

      // Force a reflow
      void element.offsetWidth

      // Re-insert the element
      if (nextSibling) {
        parent?.insertBefore(element, nextSibling)
      } else {
        parent?.appendChild(element)
      }
    }
  }

  return (
    <div className="py-12 space-y-16">
      {/* Hero - Video-Aligned Logo */}
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Hero — Video-Aligned (512px width)
        </h3>
        <div className="flex justify-center items-center min-h-[151px]">
          <div id="logo-hero" className="w-full max-w-lg">
            <GennoorLogo variant="hero"  />
          </div>
        </div>
        <button
          onClick={() => handleReplay('logo-hero')}
          className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
        >
          Replay Animation
        </button>
      </div>

      {/* Horizontal - Full Size Logo */}
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Horizontal — Full Size (810px width)
        </h3>
        <div className="flex justify-center items-center min-h-[240px] overflow-x-auto">
          <div id="logo-horizontal">
            <GennoorLogo variant="horizontal"  />
          </div>
        </div>
        <button
          onClick={() => handleReplay('logo-horizontal')}
          className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
        >
          Replay Animation
        </button>
      </div>

      {/* Stacked - Alternative Layout */}
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Stacked — Splash Screen
        </h3>
        <div className="flex justify-center items-center min-h-[420px]">
          <div id="logo-stacked">
            <GennoorLogo variant="stacked"  />
          </div>
        </div>
        <button
          onClick={() => handleReplay('logo-stacked')}
          className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
        >
          Replay Animation
        </button>
      </div>

      {/* Icon - Loading State */}
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Icon — Loading State
        </h3>
        <div className="flex justify-center items-center min-h-[210px]">
          <div id="logo-icon">
            <GennoorLogo variant="icon"  />
          </div>
        </div>
        <button
          onClick={() => handleReplay('logo-icon')}
          className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
        >
          Replay Animation
        </button>
      </div>

      {/* Compact - Navbar */}
      <div className="text-center space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Compact — Navbar
        </h3>
        <div className="flex justify-center items-center min-h-[105px] bg-white rounded-lg p-4 overflow-x-auto">
          <div id="logo-compact">
            <GennoorLogo variant="compact"  />
          </div>
        </div>
        <button
          onClick={() => handleReplay('logo-compact')}
          className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
        >
          Replay Animation
        </button>
      </div>
    </div>
  )
}