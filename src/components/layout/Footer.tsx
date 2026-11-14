'use client'

import { ClaudePartnerFooterLine } from '@/components/ClaudePartner'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'
import { isChromelessRoute } from '@/lib/chrome'
import { useSubscribe } from '@/hooks/useSubscribe'

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
  // One field and one button; the address is confirmed from the email we send (src/hooks/useSubscribe.ts)
  const sub = useSubscribe('footer')

  // App surfaces (CRM, admin, chapter player) have no marketing footer
  if (isChromelessRoute(pathname)) return null

  // One way to sign up per page. The blog and every article carry their own, larger box just above this
  // footer, so the box here would be a second one asking the same thing.
  const pageHasOwnBox = (pathname || '').startsWith('/resources/blog')

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
        {!pageHasOwnBox && (
        <div className="border-t border-gray-300 mt-9 pt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900">Get new posts by email</p>
            <p className="text-xs text-gray-400 mt-0.5">
              One email a week, on Thursday, with that week&apos;s posts. No spam.
            </p>
          </div>
          {sub.done ? (
            <p className="text-xs font-medium text-green-700 sm:max-w-[360px]" role="status">
              {sub.said}
            </p>
          ) : (
            <form onSubmit={sub.submit} className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
              <input
                type="email"
                value={sub.email}
                onChange={e => sub.setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address for new posts by email"
                required
                className="flex-1 sm:w-[220px] px-3.5 py-2 text-xs rounded-full bg-raised border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary-600 focus:ring-0"
              />
              <button
                type="submit"
                disabled={sub.state === 'sending'}
                className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-colors disabled:opacity-50"
              >
                {sub.state === 'sending' ? 'Sending' : 'Subscribe'}
              </button>
              {sub.state === 'error' && <p className="basis-full text-xs text-red-700" role="alert">{sub.said}</p>}
            </form>
          )}
        </div>
        )}

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
