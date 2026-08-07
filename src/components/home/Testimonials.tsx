'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Testimonials as a single large centered quote — the prototype's
 * Testimonial section typography — while keeping the full eight-quote
 * auto-rotating carousel (pause on hover, arrows, dots) from before.
 */

const testimonials = [
  {
    quote: "An excellent trainer with deep expertise in AI. He explains complex concepts in a very clear and practical way. His knowledge as an AI manager truly reflects in the way he connects theory with real-world applications. Highly engaging sessions and very helpful for both beginners and professionals. Highly recommended!",
    author: "Sourabh Taneja",
    company: "via Trustpilot",
    program: "AI Training",
  },
  {
    quote: "My experience with Gennoor's AI program was truly exceptional. The instructors demonstrated an outstanding command of the subject matter, delivering each session with remarkable clarity and depth. What set this program apart was the extraordinary level of audience engagement — every class felt dynamic, interactive, and purposeful.",
    author: "Lions Kashif",
    company: "via Trustpilot",
    program: "AI Program Graduate",
  },
  {
    quote: "The 10-day AI Leadership program was transformative for our executives. Jalal's ability to bridge technical AI concepts with strategic business value aligned perfectly with Saudi Vision 2030.",
    author: "Director of Digital Transformation",
    company: "MCIT Saudi Arabia",
    program: "AI Leadership Mastery Program",
  },
  {
    quote: "Jalal's 10-day AI Agents Implementation program transformed our approach to banking automation. The multi-agent systems and blockchain integration opened new possibilities we hadn't considered.",
    author: "Head of Digital Innovation",
    company: "Bank of Tanzania",
    program: "AI Agents Implementation",
  },
  {
    quote: "The custom Copilot Studio training with MCP integration was exactly what our team needed. The hands-on labs and HITL workflows are now part of our client implementations.",
    author: "Senior Manager, Technology Consulting",
    company: "EY",
    program: "Copilot Studio & Agent Flows Training",
  },
  {
    quote: "Jalal delivered a comprehensive Python & AI program that took our team from basics to building transformers in just 10 days. The practical approach made complex concepts accessible.",
    author: "Training Director",
    company: "K21 Academy",
    program: "Foundational Python & AI",
  },
  {
    quote: "I have been utilizing training services of Jalal for different courses on Microsoft and AI. He is an excellent trainer when it comes to delivering official training and bespoke courses on AI. I would highly recommend him.",
    author: "Bhavesh Shah",
    company: "via Trustpilot",
    program: "Microsoft & AI Training",
  },
  {
    quote: "It was truly an awesome learning experience throughout the training. The sessions were well-structured, clear, and very easy to follow. Real-world examples and practical explanations made the concepts much more relatable. Overall, it was highly engaging, informative, and added great value to my understanding.",
    author: "Tech Bliss",
    company: "via Trustpilot",
    program: "AI Training Program",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const navigate = (dir: number) => {
    setDirection(dir)
    setCurrent(prev => (prev + dir + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        navigate(1)
      }, 10000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, current])

  const t = testimonials[current]

  return (
    <section className="bg-white pt-10 pb-24 lg:pb-[110px] px-8">
      <div
        className="max-w-[760px] mx-auto text-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 32 : -32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -32 : 32 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[clamp(22px,2.6vw,30px)] font-semibold tracking-[-0.01em] leading-[1.35] text-gray-900 m-0">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="text-sm text-[#6e6e73] mt-[22px]">
              {t.author} · {t.company} · {t.program}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls — quiet, below the quote */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-[#f5f5f7] transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1)
                  setCurrent(index)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === current ? 'w-5 bg-gray-900' : 'w-1.5 bg-[#d2d2d7] hover:bg-[#a1a1a6]'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => navigate(1)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-[#f5f5f7] transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
