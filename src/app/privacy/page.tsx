import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Gennoor Tech',
  description: 'Privacy policy for Gennoor Tech Private Limited — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 18, 2026</p>

        <div className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Who We Are</h2>
            <p>
              Gennoor Tech Private Limited (&quot;Gennoor Tech&quot;, &quot;we&quot;, &quot;us&quot;) provides enterprise AI training, consulting, and solution development services. Our website is <Link href="/" className="text-primary-600 hover:underline">gennoor.com</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What We Collect</h2>
            <p>We collect information you provide directly through our forms:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Name, email, and WhatsApp number (when you submit an enquiry or book a call)</li>
              <li>Company name and designation (optional, on forms)</li>
              <li>Messages or questions you send us</li>
            </ul>
            <p className="mt-3">We also automatically collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Basic usage data (pages visited, time on site) via Azure Application Insights</li>
              <li>Device type and browser information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">How We Use It</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your enquiries and schedule calls</li>
              <li>To send training-related information you requested</li>
              <li>To improve our website and services</li>
              <li>To send follow-up communications (only if you opted in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">How We Store It</h2>
            <p>
              Your data is stored securely in Microsoft Azure (private storage with encrypted connections). We do not use publicly accessible storage. Only authorized team members can access your information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Services</h2>
            <p>We use the following services that may process your data:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Microsoft Azure</strong> — hosting, storage, and analytics</li>
              <li><strong>Hostinger SMTP</strong> — sending emails</li>
              <li><strong>LinkedIn API</strong> — sharing blog content to our company page</li>
            </ul>
            <p className="mt-2">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies</h2>
            <p>
              We use essential cookies for site functionality (session affinity). We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Rights</h2>
            <p>You can request to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct or update your information</li>
              <li>Delete your data from our systems</li>
            </ul>
            <p className="mt-2">
              Email us at <a href="mailto:info@gennoor.com" className="text-primary-600 hover:underline">info@gennoor.com</a> for any privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Changes</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
            <p>
              For questions about this policy, contact us at <a href="mailto:info@gennoor.com" className="text-primary-600 hover:underline">info@gennoor.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-primary-600 hover:underline text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
