'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, Linkedin, Github, MapPin, Youtube } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import dynamic from 'next/dynamic'

// Dynamically import the animated logo to avoid SSR issues
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
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="gradient-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Stay Updated with AI Insights
            </h2>
            <p className="text-blue-100 mb-6">
              Monthly newsletter with enterprise AI trends, case studies, and exclusive content
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                className="flex-1 px-4 py-3 rounded-md text-gray-900 bg-white border-0 focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="mb-4 overflow-hidden">
              <div className="transform scale-75 origin-left">
                <GennoorLogo
                  variant="compact"
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Enterprise AI Training & Solutions. Bridging the gap between business vision and technical execution.
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">{siteConfig.email}</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-600"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Footer Links */}
          {siteConfig.navigation.footer.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-primary-600 text-sm"
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
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Microsoft Certified Trainer (MCT) | 16+ active certifications | Azure AI Engineer | DevOps Expert
            </p>
            <p className="text-sm text-gray-500">
              Trained teams at: Microsoft • IBM • EY • Boeing • Saudi Aramco • HDFC Bank • Siemens • TCS
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600">
              © {currentYear} Gennoor Tech Private Limited. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-primary-600"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}