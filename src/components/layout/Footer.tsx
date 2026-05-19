'use client'

import Link from 'next/link'
import { Mail, Linkedin, Github, MapPin, Youtube } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import dynamic from 'next/dynamic'

const GennoorLogo = dynamic(() => import('@/components/GennoorLogo'), {
  ssr: false,
  loading: () => (
    <div className="mb-4 h-[105px] w-[450px] max-w-full">
      <h3 className="text-2xl font-bold gradient-text mb-2">Gennoor Tech</h3>
      <p className="text-sm text-gray-500 tracking-wider uppercase">
        Train. Innovate. Build.
      </p>
    </div>
  )
})

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-gray-100/60">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#111b33] to-[#0c1524]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Stay Updated with AI Insights
            </h2>
            <p className="text-blue-200/50 mb-8 text-sm">
              Monthly newsletter with enterprise AI trends, case studies, and exclusive content
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 bg-white/90 backdrop-blur-sm border border-white/20 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="space-y-4 lg:col-span-2">
              <div className="mb-4 overflow-hidden">
                <div className="transform scale-75 origin-left">
                  <GennoorLogo variant="compact" />
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enterprise AI transformation partner for organizations across GCC, Africa, and South Asia — diagnostic to deployment to long-term sustainment.
              </p>
              <p className="text-xs font-semibold tracking-wide text-gray-700" style={{ fontFamily: "'Sora', Helvetica, Arial, sans-serif" }}>
                <span>Diagnose</span>
                <span className="text-amber-500">.</span>{' '}
                <span>Train</span>
                <span className="text-amber-500">.</span>{' '}
                <span>Innovate</span>
                <span className="text-amber-500">.</span>{' '}
                <span>Build</span>
                <span className="text-amber-500">.</span>{' '}
                <span>Sustain</span>
                <span className="text-amber-500">.</span>
              </p>
              <div className="space-y-2">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{siteConfig.email}</span>
                </a>
                <div className="flex items-center space-x-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Mumbai, India</span>
                </div>
              </div>
              {/* Social Links */}
              <div className="flex space-x-3 pt-4">
                {siteConfig.social.linkedin && (
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50/60 transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {siteConfig.social.github && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {siteConfig.social.youtube && (
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50/60 transition-all duration-300"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Footer Links */}
            {siteConfig.navigation.footer.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-gray-700 text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certifications Bar */}
          <div className="mt-12 pt-8 border-t border-gray-100/60">
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-400 tracking-wide">
                Senior delivery by Microsoft Certified Trainers · 16+ active certifications · stack-flexible (Azure, AWS, GCP, open-source)
              </p>
              <p className="text-xs text-gray-300">
                Delivered transformation programs at: Microsoft • IBM • EY • Boeing • Saudi Aramco • HDFC Bank • Siemens • TCS
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-100/60">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-xs text-gray-400">
                © {currentYear} Gennoor Tech Private Limited. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
