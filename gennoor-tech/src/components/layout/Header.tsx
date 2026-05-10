'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Search, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import GennoorLogo from '@/components/GennoorLogo'
import SearchModal from '@/components/SearchModal'

function MagneticButton({ children, className, ...props }: React.ComponentProps<'button'> & { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.15)
    y.set((e.clientY - cy) * 0.15)
  }

  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}

function MagneticLink({ children, className, href, onClick, ...props }: React.ComponentProps<typeof Link> & { children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.12)
    y.set((e.clientY - cy) * 0.12)
  }

  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-flex">
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        onClick={onClick as any}
        className={className}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  )
}

const megaMenuVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.96,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 30,
      staggerChildren: 0.04,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
}

const menuItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 28 },
  },
}

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto' as const,
    transition: {
      height: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } },
  },
}

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 28 } },
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 })
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const navItemsRef = useRef<Map<string, HTMLElement>>(new Map())
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
        setIsMenuOpen(false)
      }
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setIsMenuOpen(false)
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  useEffect(() => {
    setOpenDropdown(null)
    setIsMenuOpen(false)
  }, [pathname])

  const updateActiveIndicator = useCallback(() => {
    const activeItem = siteConfig.navigation.main.find((item) => {
      if (item.children) {
        return item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
      }
      return pathname === item.href
    })
    if (activeItem) {
      const el = navItemsRef.current.get(activeItem.name)
      if (el) {
        const container = el.closest('.nav-items-container') as HTMLElement
        if (container) {
          const containerRect = container.getBoundingClientRect()
          const elRect = el.getBoundingClientRect()
          setActiveIndicator({
            left: elRect.left - containerRect.left,
            width: elRect.width,
          })
        }
      }
    }
  }, [pathname])

  useEffect(() => {
    const t = setTimeout(updateActiveIndicator, 100)
    return () => clearTimeout(t)
  }, [updateActiveIndicator])

  useEffect(() => {
    window.addEventListener('resize', updateActiveIndicator)
    return () => window.removeEventListener('resize', updateActiveIndicator)
  }, [updateActiveIndicator])

  const handleMouseEnter = (name: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpenDropdown(name)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const isActive = (item: typeof siteConfig.navigation.main[0]) => {
    if (item.children) {
      return item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
    }
    return pathname === item.href
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-spring',
          scrolled ? 'py-2' : 'py-3'
        )}
      >
        <nav
          ref={navRef}
          aria-label="Main navigation"
          className={cn(
            'mx-auto max-w-7xl px-4 sm:px-5 transition-all duration-500 ease-spring',
            scrolled ? 'mx-3 sm:mx-4 lg:mx-auto' : ''
          )}
        >
          <motion.div
            className={cn(
              'flex h-16 items-center justify-between rounded-2xl px-4 lg:px-6 transition-all duration-500',
              scrolled
                ? 'bg-white/[0.97] backdrop-blur-xl border border-gray-200/60 shadow-glass'
                : 'bg-white/[0.93] backdrop-blur-md border border-gray-100/80 shadow-sm'
            )}
            layout
          >
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 relative z-10">
              <div className="w-[210px] h-[66px] overflow-hidden">
                <div className="origin-top-left scale-[0.26]">
                  <GennoorLogo variant="horizontal" />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation — Pill container */}
            <div className="hidden lg:flex lg:items-center lg:gap-0.5 relative nav-items-container">
              {/* Active indicator pill */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-8 bg-primary-50 rounded-lg pointer-events-none"
                animate={{
                  left: activeIndicator.left - 4,
                  width: activeIndicator.width + 8,
                  opacity: activeIndicator.width > 0 ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />

              {siteConfig.navigation.main.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  ref={(el) => { if (el) navItemsRef.current.set(item.name, el) }}
                  onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                  onMouseLeave={() => item.children && handleMouseLeave()}
                >
                  {item.children ? (
                    <MagneticButton
                      className={cn(
                        'relative px-3.5 py-2 flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold transition-all duration-300 rounded-lg',
                        isActive(item)
                          ? 'text-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <span>{item.name}</span>
                      <motion.div
                        animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </motion.div>
                    </MagneticButton>
                  ) : (
                    <MagneticLink
                      href={item.href}
                      className={cn(
                        'relative px-3.5 py-2 whitespace-nowrap text-[13px] font-semibold transition-all duration-300 rounded-lg',
                        isActive(item)
                          ? 'text-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {item.name}
                    </MagneticLink>
                  )}

                  {/* Mega-menu dropdown — Glass panel */}
                  <AnimatePresence>
                    {item.children && openDropdown === item.name && (
                      <motion.div
                        className="absolute left-1/2 top-full pt-3"
                        style={{ x: '-50%' }}
                        variants={megaMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="relative w-[320px]">
                          <div className="relative rounded-xl bg-white border border-gray-200/70 shadow-glass-lg overflow-hidden">
                            {/* Header */}
                            <div className="px-4 py-2 border-b border-gray-100/60">
                              <Link
                                href={item.href}
                                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                All {item.name}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                              {item.children.map((child) => (
                                <motion.div key={child.name} variants={menuItemVariants}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      'group flex items-center gap-2.5 px-4 py-2 transition-all duration-200',
                                      pathname === child.href
                                        ? 'bg-primary-50/70'
                                        : 'hover:bg-gray-50/70'
                                    )}
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {/* Icon dot */}
                                    <div className={cn(
                                      'w-1 h-1 rounded-full flex-shrink-0 transition-all duration-300',
                                      pathname === child.href
                                        ? 'bg-primary-500'
                                        : 'bg-gray-300 group-hover:bg-primary-400'
                                    )} />

                                    <span className={cn(
                                      'text-[13px] font-medium transition-colors duration-200',
                                      pathname === child.href
                                        ? 'text-primary-600'
                                        : 'text-gray-700 group-hover:text-gray-900'
                                    )}>
                                      {child.name}
                                    </span>
                                    {'badge' in child && child.badge && (
                                      <span className={cn(
                                        'text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none uppercase ml-auto',
                                        child.badge === 'Free'
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-gray-100 text-gray-500'
                                      )}>
                                        {child.badge}
                                      </span>
                                    )}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right side: Search + AI Academy + Book a Call */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors rounded-xl hover:bg-gray-100/60"
                aria-label="Search"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline text-[11px] text-gray-400 font-medium bg-gray-100/80 px-1.5 py-0.5 rounded-md">
                  ⌘K
                </span>
              </motion.button>

              {/* AI Academy CTA — Desktop */}
              <motion.div
                className="hidden lg:block"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/ai-academy"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-[13px] font-bold rounded-xl hover:shadow-glow-teal transition-all duration-300"
                >
                  <span className="inline-block w-1.5 h-1.5 bg-secondary-400 rounded-full animate-pulse" />
                  AI Academy
                  <span className="ml-0.5 text-[10px] font-black bg-white/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md leading-none uppercase">Free</span>
                </Link>
              </motion.div>

              {/* Book a Call CTA — Desktop */}
              <motion.div
                className="hidden lg:block"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/resources/calendar"
                  className="inline-flex items-center justify-center px-5 py-2 text-[13px] font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-glow-blue transition-all duration-300 whitespace-nowrap"
                >
                  Book a Call
                </Link>
              </motion.div>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100/60 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                whileTap={{ scale: 0.92 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Mobile Navigation — Glass panel */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="mobile-menu"
                className="lg:hidden mt-2 rounded-2xl bg-white border border-gray-200/70 shadow-glass-lg overflow-hidden"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="py-3 px-2">
                  {siteConfig.navigation.main.map((item) => (
                    <motion.div key={item.name} variants={mobileItemVariants}>
                      {item.children ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className={cn(
                              'w-full text-left px-4 py-3 flex items-center justify-between text-sm font-semibold rounded-xl transition-colors',
                              isActive(item) ? 'text-primary-600 bg-primary-50/50' : 'text-gray-700 hover:bg-gray-50/70'
                            )}
                          >
                            <span>{item.name}</span>
                            <motion.div
                              animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {openDropdown === item.name && (
                              <motion.div
                                className="pl-4 pb-1 space-y-0.5 overflow-hidden"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              >
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    className={cn(
                                      'flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-all duration-200',
                                      pathname === child.href
                                        ? 'text-primary-600 bg-primary-50/60 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50/60 hover:text-gray-900'
                                    )}
                                    onClick={() => {
                                      setIsMenuOpen(false)
                                      setOpenDropdown(null)
                                    }}
                                  >
                                    <div className={cn(
                                      'w-1 h-1 rounded-full',
                                      pathname === child.href ? 'bg-primary-500' : 'bg-gray-300'
                                    )} />
                                    <span>{child.name}</span>
                                    {'badge' in child && child.badge && (
                                      <span className={cn(
                                        'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none uppercase',
                                        child.badge === 'Free'
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-gray-100 text-gray-500'
                                      )}>
                                        {child.badge}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'block px-4 py-3 text-sm font-semibold rounded-xl transition-colors',
                            isActive(item) ? 'text-primary-600 bg-primary-50/50' : 'text-gray-700 hover:bg-gray-50/70'
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  <div className="mt-3 px-2 space-y-2 pt-3 border-t border-gray-100/60">
                    <Link
                      href="/ai-academy"
                      className="flex items-center justify-center gap-1.5 w-full px-4 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-sm font-bold rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-secondary-400 rounded-full animate-pulse" />
                      AI Academy
                      <span className="ml-0.5 text-[10px] font-black bg-white/20 text-white px-1.5 py-0.5 rounded-md leading-none uppercase">Free</span>
                    </Link>
                    <Link
                      href="/resources/calendar"
                      className="block w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-center transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book a Call
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Spacer to account for fixed navbar */}
      <div className="h-[var(--nav-height)]" />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
