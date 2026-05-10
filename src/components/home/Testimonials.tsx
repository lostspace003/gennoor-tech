'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    filter: 'blur(6px)',
    transition: { duration: 0.2 },
  }),
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const navigate = (dir: number) => {
    setDirection(dir)
    setProgress(0)
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!isPaused) {
      setProgress(0)
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
      }, 100)
      intervalRef.current = setInterval(() => {
        navigate(1)
      }, 10000)
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [isPaused, current])

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Client's Feedback
          </h2>
          <p className="text-lg text-gray-500">
            Feedback from executives and managers who've experienced the transformation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Quote accent */}
            <Quote className="absolute -top-3 -left-2 w-10 h-10 text-primary-100" />

            {/* Testimonial Card — Glass */}
            <div
              className="glass-card rounded-2xl p-8 lg:p-12 min-h-[280px]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 italic">
                    &ldquo;{testimonials[current].quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonials[current].author}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {testimonials[current].company}
                      </p>
                      <p className="text-sm text-primary-600 mt-1 font-medium">
                        {testimonials[current].program}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <motion.button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-xl hover:bg-gray-100/60 transition-colors"
                        aria-label="Previous testimonial"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-500" />
                      </motion.button>
                      <motion.button
                        onClick={() => navigate(1)}
                        className="p-2.5 rounded-xl hover:bg-gray-100/60 transition-colors"
                        aria-label="Next testimonial"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                      >
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="mt-5 h-[2px] bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1)
                    setCurrent(index)
                    setProgress(0)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    index === current
                      ? 'w-6 bg-primary-500'
                      : 'w-1.5 bg-gray-200 hover:bg-gray-300'
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
