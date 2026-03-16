'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "The 10-day AI Leadership program was transformative for our executives. Jalal's ability to bridge technical AI concepts with strategic business value aligned perfectly with Saudi Vision 2030.",
    author: "Director of Digital Transformation",
    company: "MCIT Saudi Arabia",
    program: "AI Leadership Mastery Program"
  },
  {
    quote: "Jalal's 10-day AI Agents Implementation program transformed our approach to banking automation. The multi-agent systems and blockchain integration opened new possibilities we hadn't considered.",
    author: "Head of Digital Innovation",
    company: "Bank of Tanzania",
    program: "AI Agents Implementation"
  },
  {
    quote: "The custom Copilot Studio training with MCP integration was exactly what our team needed. The hands-on labs and HITL workflows are now part of our client implementations.",
    author: "Senior Manager, Technology Consulting",
    company: "EY",
    program: "Copilot Studio & Agent Flows Training"
  },
  {
    quote: "Jalal delivered a comprehensive Python & AI program that took our team from basics to building transformers in just 10 days. The practical approach made complex concepts accessible.",
    author: "Training Director",
    company: "K21 Academy",
    program: "Foundational Python & AI"
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-rotate testimonials every 10 seconds with progress indicator
  useEffect(() => {
    if (!isPaused) {
      // Reset progress
      setProgress(0)

      // Start progress animation
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0
          }
          return prev + 1
        })
      }, 100) // Update every 100ms for smooth animation (100 steps over 10 seconds)

      // Start auto-rotation
      intervalRef.current = setInterval(() => {
        next()
        setProgress(0)
      }, 10000) // 10 seconds
    } else {
      // Pause progress when hovering
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    // Cleanup intervals on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPaused, current])

  // Reset interval when manually navigating
  const handleManualNavigation = (direction: 'next' | 'prev') => {
    // Reset progress
    setProgress(0)

    // Navigate
    if (direction === 'next') {
      next()
    } else {
      prev()
    }
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Client's Feedback
          </h2>
          <p className="text-lg text-gray-600">
            Feedback from executives and managers who've experienced the transformation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote Icon */}
            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary-200 text-primary-900/30" />

            {/* Testimonial Card */}
            <div
              className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 italic">
                "{testimonials[current].quote}"
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonials[current].author}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[current].company}
                  </p>
                  <p className="text-sm text-primary-600 mt-1">
                    {testimonials[current].program}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleManualNavigation('prev')}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleManualNavigation('next')}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar for Auto-rotation */}
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrent(index)
                    setProgress(0)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current
                      ? 'w-8 bg-primary-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}