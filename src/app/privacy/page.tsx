import Link from 'next/link'
import type { Metadata } from 'next'
import PageHero from '@/components/shared/PageHero'

export const metadata: Metadata = {
  title: 'Privacy Policy | Gennoor Tech',
  description: 'Privacy policy for Gennoor Tech Private Limited — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy Policy"
        description="Last updated: October 31, 2026"
        size="compact"
      />

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-16 sm:pb-24">
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-[0_2px_4px_rgba(15,23,42,0.05),0_16px_36px_-14px_rgba(15,23,42,0.08)] p-8 sm:p-10">
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
              <li><strong>Microsoft Azure AI Foundry / Azure OpenAI</strong> — AI-assisted features such as drafting content and our website assistant</li>
              <li><strong>LinkedIn APIs</strong> — publishing our own content to our company page, and measuring our own LinkedIn advertising (see &quot;LinkedIn API Services and Advertising Measurement&quot; below)</li>
            </ul>
            <p className="mt-2">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies</h2>
            <p>
              We use essential cookies for site functionality (session affinity). We do not sell data or use cookies for cross-site profiling. If we run LinkedIn advertising campaigns, we may use the LinkedIn Insight Tag to measure the results of those campaigns, only where you have consented to such measurement.
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
            <h2 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn API Services and Advertising Measurement</h2>
            <p>
              We use LinkedIn APIs through internal tools that only authorized Gennoor Tech staff can access.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Publishing:</strong> we post our own blog articles, announcements, webinars and polls to our own LinkedIn profile and company page. Content is reviewed and approved by a staff member before it is posted.</li>
              <li><strong>Advertising measurement:</strong> if we run LinkedIn campaigns, we may send our own conversion events (for example an enquiry, a webinar registration or a booked call on gennoor.com) to LinkedIn using the Conversions API, to measure and improve those campaigns. This is limited to our own advertising account and our own first-party data, and only where you have consented.</li>
              <li>We do not use LinkedIn APIs to collect data about LinkedIn members for any other purpose, and we do not pass LinkedIn data to third parties.</li>
              <li>Access tokens are stored in private Microsoft Azure storage and are never shared.</li>
              <li>You can manage your LinkedIn ad and data preferences in your <a href="https://www.linkedin.com/psettings/advertising" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn settings</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Privacy Responsibility and Grievance Contact</h2>
            <p>
              Privacy compliance at Gennoor Tech is the responsibility of our Founder &amp; CEO, who acts as our privacy and grievance contact and oversees how personal data is collected, used, stored and deleted, including under India&apos;s Digital Personal Data Protection Act, 2023. Reach us at <a href="mailto:info@gennoor.com" className="text-primary-600 hover:underline">info@gennoor.com</a> (subject: &quot;Privacy&quot;). We aim to respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Retention</h2>
            <p>
              We keep enquiry and booking data only as long as needed to respond to you and to maintain our business records, and delete it on request unless the law requires us to keep it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Changes</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">YouTube API Services</h2>
            <p>
              Gennoor Tech operates the YouTube channel <strong>&quot;AI in 45 Seconds&quot;</strong> (<a href="https://www.youtube.com/@AIin45Seconds-gennoor" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.youtube.com/@AIin45Seconds-gennoor</a>). To publish and manage videos on our own channel, we use an internal automation tool that accesses <strong>YouTube API Services</strong>.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Our use of YouTube API Services is limited to <strong>our own channel</strong>: uploading our own videos, setting their titles and descriptions, posting comments from our channel, and reading our own channel&apos;s performance statistics.</li>
              <li>We do <strong>not</strong> collect, store, or process any data about YouTube users or visitors through the YouTube API. No third party can access YouTube data through our tool.</li>
              <li>Authorization tokens for our own account are stored encrypted in Microsoft Azure Key Vault and are never shared.</li>
              <li>By using YouTube API Services, we agree to be bound by the <a href="https://www.youtube.com/t/terms" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>. Users interacting with our channel are subject to the <a href="https://policies.google.com/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
              <li>To revoke any permission you may have granted to Google/YouTube services, visit your <a href="https://security.google.com/settings/security/permissions" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Google security settings</a>.</li>
            </ul>
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
    </div>
  )
}
