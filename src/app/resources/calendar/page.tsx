'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import EmailOTP from '@/components/EmailOTP'
import PhoneInput from '@/components/ui/PhoneInput'
import {
  Calendar,
  Clock,
  Globe,
  User,
  Mail,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

/* ───────── helpers ───────── */

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

/** Minimum days from today before a booking is allowed */
const MIN_BOOKING_GAP_DAYS = 3

/**
 * Convert a local time slot (in the user's chosen timezone) to IST hours.
 * Returns the IST hour (0-23) for the given slot on the given date.
 */
function slotToISTHour(date: Date, slotHour: number, slotMinute: number, tz: string): number {
  // Build a Date in the user's timezone for this slot
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const timeStr = `${String(slotHour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}:00`

  // Get the UTC timestamp by parsing in the user's timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })

  // Create a date object — we need to figure out the UTC offset for the user's timezone
  // Use a trick: format the same instant in IST
  const utcDate = new Date(`${dateStr}T${timeStr}`)

  // Get the offset difference by comparing formatted times
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric', minute: 'numeric',
    hour12: false,
  })

  const userFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric', minute: 'numeric',
    hour12: false,
  })

  // Use a reference date to calculate offset difference
  const refDate = new Date('2026-01-15T12:00:00Z')
  const istParts = istFormatter.formatToParts(refDate)
  const userParts = userFormatter.formatToParts(refDate)

  const istH = parseInt(istParts.find(p => p.type === 'hour')?.value || '0')
  const istM = parseInt(istParts.find(p => p.type === 'minute')?.value || '0')
  const userH = parseInt(userParts.find(p => p.type === 'hour')?.value || '0')
  const userM = parseInt(userParts.find(p => p.type === 'minute')?.value || '0')

  const istTotal = istH * 60 + istM
  const userTotal = userH * 60 + userM
  const offsetDiff = istTotal - userTotal // IST minutes ahead of user tz

  const slotInMinutes = slotHour * 60 + slotMinute
  const istMinutes = slotInMinutes + offsetDiff
  const istHour = Math.floor(((istMinutes % 1440) + 1440) % 1440 / 60)
  return istHour
}

/**
 * Check if a slot falls within IST night hours (11 PM to 8 AM IST = hours 23, 0-7)
 */
function isISTNightTime(istHour: number): boolean {
  return istHour >= 23 || istHour < 8
}

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 0; h < 24; h++) {
    slots.push(`${h}:00`)
    slots.push(`${h}:30`)
  }
  return slots
}

const ALL_SLOTS = generateTimeSlots()

function formatTime(slot: string): string {
  const [h, m] = slot.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`
}

function formatDateLabel(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/* ───────── common timezones ───────── */

const COMMON_TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
]

/* ───────── component ───────── */

export default function BookingCalendarPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + MIN_BOOKING_GAP_DAYS)

  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 30)

  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [timezone, setTimezone] = useState('UTC')
  const [showTzPicker, setShowTzPicker] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [topic, setTopic] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'sent'>('idle')
  const [reqName, setReqName] = useState('')
  const [reqEmail, setReqEmail] = useState('')
  const [reqWhatsapp, setReqWhatsapp] = useState('')
  const [reqMessage, setReqMessage] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [reqEmailVerified, setReqEmailVerified] = useState(false)

  /* reset verified states when emails change */
  useEffect(() => { setEmailVerified(false) }, [email])
  useEffect(() => { setReqEmailVerified(false) }, [reqEmail])

  /* detect timezone on mount */
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz) setTimezone(tz)
    } catch {
      /* fallback stays UTC */
    }
  }, [])

  /* ── calendar grid ── */

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth()
  const canGoNext =
    viewYear < maxDate.getFullYear() ||
    (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth())

  const goPrev = () => {
    if (!canGoPrev) return
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const goNext = () => {
    if (!canGoNext) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const isDaySelectable = useCallback(
    (day: number) => {
      const d = new Date(viewYear, viewMonth, day)
      const dow = d.getDay()
      if (dow === 0 || dow === 6) return false // weekend
      if (d < minDate) return false // must be at least 3 days from today
      if (d > maxDate) return false
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewYear, viewMonth],
  )

  const isToday = (day: number) =>
    isSameDay(new Date(viewYear, viewMonth, day), today)

  const isSelected = (day: number) =>
    selectedDate !== null &&
    isSameDay(new Date(viewYear, viewMonth, day), selectedDate)

  /* ── time slots — filter out IST night hours (11 PM - 8 AM) ── */
  const timeSlots = selectedDate
    ? ALL_SLOTS.filter(slot => {
        const [h, m] = slot.split(':').map(Number)
        const istHour = slotToISTHour(selectedDate, h, m, timezone)
        return !isISTNightTime(istHour)
      })
    : []

  /* ── request a call (when no slots available) ── */
  const handleRequestCall = async (e: React.FormEvent) => {
    e.preventDefault()
    setRequestStatus('submitting')
    try {
      await fetch('/api/book-expert-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reqName,
          email: reqEmail,
          whatsapp: reqWhatsapp,
          programTitle: 'Call Request (Outside Available Hours)',
          message: `Preferred timezone: ${timezone} | Message: ${reqMessage}`,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch { /* show sent anyway */ }
    setRequestStatus('sent')
  }

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) return
    setStatus('submitting')
    setErrorMsg('')

    const dateLabel = formatDateLabel(selectedDate)
    const timeLabel = formatTime(selectedSlot)

    try {
      const res = await fetch('/api/book-expert-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          programTitle: 'Discovery Call Booking',
          message: `Date: ${dateLabel} | Time: ${timeLabel} (${timezone}) | Topic: ${topic}`,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!res.ok) throw new Error('Failed to submit')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg(
        'Something went wrong. Please try again or email us directly at contact@gennoor.com',
      )
    }
  }

  /* ── success state ── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
          <div className="rounded-2xl glass-card p-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-2">
              Your discovery call has been scheduled for{' '}
              <strong>{selectedDate ? formatDateLabel(selectedDate) : ''}</strong> at{' '}
              <strong>{selectedSlot ? formatTime(selectedSlot) : ''}</strong>{' '}
              ({timezone}).
            </p>
            <p className="text-gray-500 mb-8">
              A confirmation will be sent to <strong>{email}</strong>. We&apos;ll also reach out on
              WhatsApp to share the meeting link.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl px-6 py-3 font-medium hover:shadow-glow-blue transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── main render ── */
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

      <div className="container mx-auto px-4 py-16 max-w-5xl">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ─── LEFT: Calendar + Slots ─── */}
          <div className="space-y-6">
            {/* calendar card */}
            <div className="rounded-2xl glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Select a Date</h2>
              </div>

              {/* month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goPrev}
                  disabled={!canGoPrev}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <span className="font-medium text-gray-900">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={goNext}
                  disabled={!canGoNext}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              {/* day headers */}
              <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                {DAYS.map(d => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* day cells */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {/* blanks before first day */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <span key={`blank-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const selectable = isDaySelectable(day)
                  const dow = new Date(viewYear, viewMonth, day).getDay()
                  const isWeekend = dow === 0 || dow === 6

                  return (
                    <button
                      key={day}
                      disabled={!selectable}
                      onClick={() => {
                        setSelectedDate(new Date(viewYear, viewMonth, day))
                        setSelectedSlot(null)
                      }}
                      className={`
                        h-9 w-9 mx-auto rounded-full text-sm font-medium transition-colors
                        ${isSelected(day) ? 'bg-primary-600 text-white' : ''}
                        ${!isSelected(day) && isToday(day) ? 'ring-2 ring-primary-400 text-primary-700' : ''}
                        ${!selectable && isWeekend ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${!selectable && !isWeekend ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${selectable && !isSelected(day) && !isToday(day) ? 'text-gray-800 hover:bg-primary-50' : ''}
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* timezone — shown before time slots so user sets tz first */}
            <div className="rounded-2xl glass-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Your Timezone</h2>
              </div>

              {!showTzPicker ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{timezone}</span>
                  <button
                    onClick={() => setShowTzPicker(true)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    value={timezone}
                    onChange={e => {
                      setTimezone(e.target.value)
                      setShowTzPicker(false)
                      setSelectedSlot(null) // reset slot when tz changes
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {COMMON_TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>
                        {tz.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowTzPicker(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* time-slot card */}
            {selectedDate && (
              <div className="rounded-2xl glass-card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Select a Time</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {formatDateLabel(selectedDate)}
                </p>

                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`
                          py-2 px-3 rounded-lg text-sm font-medium transition-colors border
                          ${
                            selectedSlot === slot
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:text-primary-700'
                          }
                        `}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      No available slots for this date in your timezone. Our available hours are <strong>8:00 AM – 11:00 PM IST</strong>.
                    </p>
                    {!showRequestForm && requestStatus !== 'sent' && (
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-200"
                      >
                        <Mail className="h-4 w-4" />
                        Request a Call — Notify Us
                      </button>
                    )}
                    {showRequestForm && requestStatus !== 'sent' && (
                      <form onSubmit={handleRequestCall} className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500">Let us know your preferred time and we&apos;ll get back to you.</p>
                        <input
                          type="text" required value={reqName} onChange={e => setReqName(e.target.value)}
                          placeholder="Your name"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="email" required value={reqEmail} onChange={e => setReqEmail(e.target.value)}
                          placeholder="Your email"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <EmailOTP email={reqEmail} onVerified={() => setReqEmailVerified(true)} verified={reqEmailVerified} compact />
                        <PhoneInput
                          label="WhatsApp (optional)"
                          id="req-whatsapp"
                          value={reqWhatsapp}
                          onChange={(fullNumber) => setReqWhatsapp(fullNumber)}
                          required={false}
                        />
                        <textarea
                          required rows={2} value={reqMessage} onChange={e => setReqMessage(e.target.value)}
                          placeholder="Preferred date/time and topic for the call..."
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={requestStatus === 'submitting' || !reqEmailVerified}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                          >
                            {requestStatus === 'submitting' ? 'Sending...' : 'Send Request'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRequestForm(false)}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                    {requestStatus === 'sent' && (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-lg p-3 text-sm border border-green-200">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <p>Request sent! We&apos;ll get back to you shortly via email.</p>
                      </div>
                    )}
                  </div>
                )}
                {timeSlots.length > 0 && (
                  <p className="text-xs text-gray-400 mt-3">
                    Available hours: 8:00 AM – 11:00 PM IST (Indian Standard Time)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Details form ─── */}
          <div className="rounded-2xl glass-card p-6 h-fit lg:sticky lg:top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Your Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4" /> Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* email */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <EmailOTP email={email} onVerified={() => setEmailVerified(true)} verified={emailVerified} />
              </div>

              {/* whatsapp */}
              <PhoneInput
                label="WhatsApp Number"
                id="calendar-whatsapp"
                value={whatsapp}
                onChange={(fullNumber) => setWhatsapp(fullNumber)}
                required={true}
              />

              {/* topic */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4" /> Topic / Purpose of Call
                </label>
                <textarea
                  required
                  rows={3}
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="E.g., AI strategy discussion, agentic workflow POC..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              {/* summary bar */}
              {selectedDate && selectedSlot && (
                <div className="rounded-lg bg-primary-50 p-3 text-sm text-primary-800">
                  <strong>Selected:</strong> {formatDateLabel(selectedDate)} at{' '}
                  {formatTime(selectedSlot)} ({timezone})
                </div>
              )}

              {/* error */}
              {status === 'error' && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={!selectedDate || !selectedSlot || !emailVerified || status === 'submitting'}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl py-3 font-medium hover:shadow-glow-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </button>

              {!selectedDate && (
                <p className="text-xs text-center text-gray-400">
                  Please select a date and time to continue.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
