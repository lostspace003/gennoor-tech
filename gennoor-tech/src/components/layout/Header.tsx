'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import GennoorLogo from '@/components/GennoorLogo'
import SearchModal from '@/components/SearchModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav ref={navRef} aria-label="Main navigation" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="w-[243px] h-[77px] overflow-hidden">
                <div className="origin-top-left scale-[0.3]">
                  <GennoorLogo variant="horizontal" />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation — 5 tabs */}
            <div className="hidden lg:flex lg:items-center lg:gap-1 lg:ml-12">
              {siteConfig.navigation.main.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && handleMouseEnter(item.name)}
                  onMouseLeave={() => item.children && handleMouseLeave()}
                >
                  {item.children ? (
                    <button
                      className={cn(
                        'nav-link px-3 py-2 flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors',
                        isActive(item) ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                      )}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        openDropdown === item.name && 'rotate-180'
                      )} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'nav-link px-3 py-2 whitespace-nowrap text-sm font-medium transition-colors',
                        isActive(item) ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Mega-menu dropdown with descriptions */}
                  {item.children && openDropdown === item.name && (
                    <div className="absolute left-0 top-full pt-2 w-80">
                      <div className="rounded-xl shadow-xl bg-white ring-1 ring-black/5 py-2 animate-fade-in">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <Link
                            href={item.href}
                            className="text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-primary-600 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            All {item.name} &rarr;
                          </Link>
                        </div>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'flex items-start gap-3 px-4 py-3 transition-colors group',
                              pathname === child.href
                                ? 'bg-primary-50'
                                : 'hover:bg-gray-50'
                            )}
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'text-sm font-medium',
                                  pathname === child.href ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-600'
                                )}>
                                  {child.name}
                                </span>
                                {'badge' in child && child.badge && (
                                  <span className={cn(
                                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none uppercase',
                                    child.badge === 'Free'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-200 text-gray-500'
                                  )}>
                                    {child.badge}
                                  </span>
                                )}
                              </div>
                              {'description' in child && child.description && (
                                <p className="text-xs text-gray-400 mt-0.5">{child.description}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side: Search + AI Academy + Book a Call */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline text-xs text-gray-400">Ctrl+K</span>
              </button>

              {/* AI Academy CTA — Desktop */}
              <Link
                href="/ai-academy"
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 bg-accent-600 text-white text-sm font-bold rounded-full hover:bg-accent-700 transition-colors shadow-sm"
              >
                <span className="inline-block w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
                AI Academy
                <span className="ml-0.5 text-[10px] font-black bg-secondary-400 text-dark-900 px-1.5 py-0.5 rounded-full leading-none uppercase">Free</span>
              </Link>

              {/* Book a Call CTA — Desktop */}
              <Link
                href="/resources/calendar"
                className="hidden lg:inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors whitespace-nowrap"
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
                            'w-full text-left px-3 py-2.5 flex items-center justify-between text-sm font-medium',
                            isActive(item) ? 'text-primary-600' : 'text-gray-700'
                          )}
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={cn(
                            'h-4 w-4 transition-transform',
                            openDropdown === item.name && 'rotate-180'
                          )} />
                        </button>
                        {openDropdown === item.name && (
                          <div className="pl-4 pb-2 space-y-0.5">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={cn(
                                  'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors',
                                  pathname === child.href
                                    ? 'text-primary-600 bg-primary-50 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                                )}
                                onClick={() => {
                                  setIsMenuOpen(false)
                                  setOpenDropdown(null)
                                }}
                              >
                                <span>{child.name}</span>
                                {'badge' in child && child.badge && (
                                  <span className={cn(
                                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none uppercase',
                                    child.badge === 'Free'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-200 text-gray-500'
                                  )}>
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-3 py-2.5 text-sm font-medium',
                          isActive(item) ? 'text-primary-600' : 'text-gray-700'
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="pt-3 px-3 space-y-2">
                  <Link
                    href="/ai-academy"
                    className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-accent-600 text-white text-sm font-bold rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="inline-block w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
                    AI Academy
                    <span className="ml-0.5 text-[10px] font-black bg-secondary-400 text-dark-900 px-1.5 py-0.5 rounded-full leading-none uppercase">Free</span>
                  </Link>
                  <Link
                    href="/resources/calendar"
                    className="block w-full px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-center transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book a Call
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
