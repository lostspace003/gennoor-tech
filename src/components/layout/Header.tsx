'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import GennoorLogo from '@/components/GennoorLogo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
        setIsMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  // Close dropdown when route changes
  useEffect(() => {
    setOpenDropdown(null)
    setIsMenuOpen(false)
  }, [pathname])

  // Desktop hover handlers with small delay to prevent flicker
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

  // Mobile click toggle
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav ref={navRef} aria-label="Main navigation" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Animated GennoorLogo at 0.3x */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="w-[243px] h-[77px] overflow-hidden">
              <div className="origin-top-left scale-[0.3]">
                <GennoorLogo variant="horizontal" />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Added margin-left for spacing */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 lg:ml-16">
            {siteConfig.navigation.main.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                onMouseLeave={() => item.children && handleMouseLeave()}
              >
                {item.href === '/claude-cowork' ? (
                  <Link
                    href={item.href}
                    className="relative inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] text-white text-sm font-bold rounded-full hover:bg-[#e55a25] transition-colors shadow-sm"
                  >
                    <span className="inline-block w-2 h-2 bg-[#FFD23F] rounded-full animate-pulse" />
                    {item.name}
                    <span className="ml-1 text-[10px] font-black bg-[#FFD23F] text-[#1B2845] px-1.5 py-0.5 rounded-full leading-none uppercase">Free</span>
                  </Link>
                ) : item.children ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'nav-link px-3 py-2 flex items-center space-x-1',
                      pathname.startsWith(item.href) && 'text-primary-600'
                    )}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      openDropdown === item.name && 'rotate-180'
                    )} />
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'nav-link px-3 py-2',
                      pathname === item.href && 'text-primary-600'
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu - opens on hover */}
                {item.children && openDropdown === item.name && (
                  <div className="absolute left-0 top-full pt-1 w-64">
                    <div className="rounded-lg shadow-lg bg-white ring-1 ring-black/5 py-1 animate-fade-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'block px-4 py-2.5 text-sm transition-colors',
                            pathname === child.href
                              ? 'text-primary-600 bg-primary-50 font-medium'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                          )}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* CTA Button - Desktop */}
            <Link
              href="/resources/calendar"
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Book a Call
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {siteConfig.navigation.main.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={cn(
                          'w-full text-left px-3 py-2 nav-link flex items-center justify-between',
                          pathname.startsWith(item.href) && 'text-primary-600'
                        )}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform',
                            openDropdown === item.name && 'rotate-180'
                          )}
                        />
                      </button>
                      {openDropdown === item.name && (
                        <div className="pl-6 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600"
                              onClick={() => {
                                setIsMenuOpen(false)
                                setOpenDropdown(null)
                              }}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : item.href === '/claude-cowork' ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 mx-3 my-2 px-4 py-2.5 bg-[#FF6B35] text-white text-sm font-bold rounded-full hover:bg-[#e55a25] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="inline-block w-2 h-2 bg-[#FFD23F] rounded-full animate-pulse" />
                      {item.name}
                      <span className="text-[10px] font-black bg-[#FFD23F] text-[#1B2845] px-1.5 py-0.5 rounded-full leading-none uppercase">Free</span>
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-3 py-2 nav-link',
                        pathname === item.href && 'text-primary-600'
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/resources/calendar"
                className="block mx-3 mt-4 px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-center transition-colors whitespace-nowrap"
                onClick={() => setIsMenuOpen(false)}
              >
                Book a Call
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}