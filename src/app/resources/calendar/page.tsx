import type { Metadata } from 'next'
import BookingCalendar from '@/components/booking/BookingCalendar'

export const metadata: Metadata = {
  title: 'Schedule a Discovery Call — Gennoor Tech',
  description:
    'Book a free 30-minute consultation with a Gennoor Tech expert. Pick a date and time that works for you.',
  alternates: { canonical: 'https://gennoor.com/resources/calendar' },
}

export default function BookingCalendarPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-3">
            Schedule a Discovery Call
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book a free 30-minute consultation with a Gennoor Tech expert. Pick a date and
            time that works for you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <BookingCalendar />
      </div>
    </div>
  )
}
