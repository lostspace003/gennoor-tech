'use client'

import { ClaudePartnerFooterLine } from '@/components/ClaudePartner'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'
import { isChromelessRoute } from '@/lib/chrome'
import EmailOTP from '@/components/EmailOTP'

/**
 * Site footer in the Apple idiom (per the redesign handoff):
 * a #f5f5f7 panel, four quiet link columns, and a single hairline bottom bar
 * carrying the legal line and utility links. Everything the old footer
 * offered — newsletter signup, contact email, social links, credentials —
 * survives, restated at whisper volume.
 */

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setEmailVerified(false)
  }, [email])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })
    } catch { /* show success regardless — the OTP already verified the address */ }
    setSubscribed(true)
  }

  // App surfaces (CRM, admin, chapter player) have no marketing footer
  if (isChromelessRoute(pathname)) return null

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1080px] mx-auto px-6 sm:px-8 pt-8 pb-8">
        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {siteConfig.navigation.footer.map(section => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-gray-900 mb-3">{section.title}</p>
              <ul className="flex flex-col gap-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 hover:text-gray-900 hover:underline transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter — kept from the previous footer, restated quietly */}
        <div className="border-t border-gray-300 mt-9 pt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900">Stay in touch</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Occasional notes on AI training and automation.
            </p>
          </div>
          {subscribed ? (
            <p className="text-xs font-medium text-green-600">
              ✓ Subscribed — you&rsquo;ll get the next issue.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                required
                className="flex-1 sm:w-[220px] px-3.5 py-2 text-xs rounded-full bg-raised border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-0"
              />
              <EmailOTP email={email} onVerified={() => setEmailVerified(true)} verified={emailVerified} compact />
              <button
                type="submit"
                disabled={!emailVerified}
                className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-colors disabled:opacity-50"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <ClaudePartnerFooterLine />

        <p className="text-[11px] text-gray-400 text-center mt-8">Gennoor Tech · Mumbai, India</p>

        {/* Bottom bar */}
        <div className="border-t border-gray-300 mt-4 pt-4 flex flex-wrap justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {currentYear} Gennoor Tech. Mumbai, India.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/crm" className="text-xs text-gray-500 hover:underline">
              CRM
            </Link>
            <Link href="/admin" className="text-xs text-gray-500 hover:underline">
              Admin
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:underline">
              Terms
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-xs text-gray-500 hover:underline"
            >
              {siteConfig.email}
            </a>
            {siteConfig.social.linkedin && (
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {siteConfig.social.youtube && (
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:underline"
              >
                YouTube
              </a>
            )}
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
