import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import BookingCalendar from '@/components/booking/BookingCalendar'

export const metadata: Metadata = {
  title: 'Contact — Gennoor Tech',
  description: 'Write to Gennoor Tech or book a call. We are in Mumbai, India.',
  alternates: { canonical: 'https://gennoor.com/contact' },
  openGraph: { title: 'Contact — Gennoor Tech', description: 'Write to us or book a call.', url: 'https://gennoor.com/contact' },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Gennoor Tech',
  description: 'AI training for organizations and AI automation, with Claude. Mumbai, India.',
  url: 'https://gennoor.com',
  email: 'contact@gennoor.com',
  founder: { '@type': 'Person', name: 'Jalal Ahmed Khan', url: 'https://gennoor.com/about/founder' },
  address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
  sameAs: ['https://www.linkedin.com/company/gennoor-tech-private-limited/'],
}

const WHATSAPP_URL =
  'https://wa.me/919326352241?text=Hi%20Gennoor%2C%20I%20visited%20gennoor.com%20and%20would%20like%20to%20talk%20about%20AI%20training%20and%20automation.'

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <main className="min-h-screen bg-surface">
        <section className="hero-backdrop px-8 pt-8 lg:pt-10 pb-10 text-center">
          <h1 className="display-hero max-w-[820px] mx-auto">Let&rsquo;s talk.</h1>
          <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-gray-500 max-w-[560px] mx-auto mt-6">
            Tell us what you want your team to be able to do, or which process costs you time.
          </p>
        </section>

        <section id="proposal" className="scroll-mt-16 bg-gray-50 px-8 pt-10 pb-14">
          <div className="max-w-[1000px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-14 items-start">
            <div className="bg-raised rounded-3xl p-7 sm:p-10">
              <ContactForm />
            </div>
            <div className="space-y-8 text-[15px]">
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <a href="mailto:contact@gennoor.com" className="text-primary-600 hover:underline">contact@gennoor.com</a>
              </div>
              <div>
                <p className="font-semibold text-gray-900">WhatsApp</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Message us on WhatsApp</a>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Where we are</p>
                <p className="text-gray-500">Mumbai, India</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Elsewhere</p>
                <p><a href="https://www.linkedin.com/company/gennoor-tech-private-limited/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">LinkedIn</a></p>
              </div>
            </div>
          </div>
        </section>

        <section id="book" className="scroll-mt-16 px-8 py-10 lg:py-14">
          <div className="max-w-[760px] mx-auto text-center mb-10">
            <h2 className="display-card">Prefer to talk first?</h2>
            <p className="text-[17px] text-gray-500 mt-3">Pick a time for a call. Times are shown in your own time zone.</p>
          </div>
          <BookingCalendar />
        </section>
      </main>
    </>
  )
}
