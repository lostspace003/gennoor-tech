import Link from 'next/link'
import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'

export const metadata: Metadata = {
  title: 'Terms of Service | Gennoor Tech',
  description:
    'Terms of service for Gennoor Tech Private Limited — the rules that govern your use of our website, services, and content.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <PageHero
        eyebrow="Terms of Service"
        title="Terms of Service"
        description="Last updated: July 6, 2026"
        size="compact"
      />

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-10 sm:pb-14">
        <div className="bg-raised rounded-2xl border border-gray-200/70 shadow-[0_2px_4px_rgba(15,23,42,0.05),0_16px_36px_-14px_rgba(15,23,42,0.08)] p-8 sm:p-10">
        <div className="space-y-8 text-gray-700 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Who We Are</h2>
            <p>
              Gennoor Tech Private Limited (&quot;Gennoor Tech&quot;, &quot;we&quot;, &quot;us&quot;) provides enterprise AI training, consulting, and solution development services. Our website is <Link href="/" className="text-primary-600 hover:underline">gennoor.com</Link>. By accessing this website or using our services, you agree to these terms. If you do not agree, please do not use the website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Use of This Website</h2>
            <p>You may use this website for lawful purposes only. You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Attempt to gain unauthorized access to any part of the website or its systems</li>
              <li>Use the website in a way that disrupts or impairs its availability for others</li>
              <li>Submit false or misleading information through our forms</li>
              <li>Scrape, harvest, or collect data from the website by automated means without our written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Services</h2>
            <p>
              Descriptions of our training programs, workshops, certifications, and consulting services on this website are for general information. The specific scope, deliverables, pricing, and timelines of any engagement are defined in a separate written agreement or proposal between you and Gennoor Tech. We may update, modify, or discontinue any service described on the website at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, course curricula, training materials, videos, and software — is owned by or licensed to Gennoor Tech and is protected by applicable intellectual property laws. You may view and share links to our content, but you may not reproduce, redistribute, or create derivative works from it for commercial purposes without our prior written consent. Trademarks of third parties (such as Microsoft or Google) referenced on this site belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Our Content on Third-Party Platforms</h2>
            <p>
              We publish content on third-party platforms, including our YouTube channels — among them <strong>&quot;AI in 45 Seconds&quot;</strong> (<a href="https://www.youtube.com/@AIin45Seconds-gennoor" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">youtube.com/@AIin45Seconds-gennoor</a>). To publish and manage videos on our own channels, we use an internal automation tool that accesses <strong>YouTube API Services</strong>; this use is limited to our own channels and does not collect data about YouTube users. By using YouTube API Services, we agree to be bound by the <a href="https://www.youtube.com/t/terms" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>. When you view or interact with our content on these platforms, your use is also governed by that platform&apos;s own terms and the <a href="https://policies.google.com/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a> (for YouTube). See our <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> for more detail on YouTube API Services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Disclaimers</h2>
            <p>
              The website and its content are provided &quot;as is&quot; and &quot;as available&quot;. While we work to keep information accurate and current, we make no warranties — express or implied — about the completeness, accuracy, or reliability of the website or its content. Educational content, including AI explainers and tutorials, is for general informational purposes and does not constitute professional, legal, or financial advice for your specific situation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Gennoor Tech shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of (or inability to use) this website or its content. Nothing in these terms excludes or limits liability that cannot be excluded under applicable law. Liability arising from a specific service engagement is governed by the written agreement for that engagement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Third-Party Links</h2>
            <p>
              This website contains links to third-party websites and services that we do not control. We are not responsible for the content, availability, or practices of those sites. Following such links is at your own discretion and subject to the terms of the destination site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Changes will be posted on this page with an updated date, and continued use of the website after changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising from these terms or your use of the website are subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Contact</h2>
            <p>
              For questions about these terms, contact us at <a href="mailto:info@gennoor.com" className="text-primary-600 hover:underline">info@gennoor.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link href="/" className="text-primary-600 hover:underline text-sm">
            &larr; Back to Home
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}
