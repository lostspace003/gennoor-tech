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
    <div className="min-h-screen bg-surface">
      {/* Hero header */}
      <section className="relative py-10 lg:py-10 overflow-hidden">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
        <div className="relative container mx-auto px-4 max-w-5xl text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight tracking-tight mb-3">
            Schedule a Discovery Call
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book a free 30-minute consultation with a Gennoor Tech expert. Pick a date and
            time that works for you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <BookingCalendar />
      </div>
    </div>
  )
}
