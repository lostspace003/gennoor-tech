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
  Video,
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
} from 'lucide-react'

/* ───────── country → timezone map ───────── */

interface CountryEntry {
  name: string
  code: string
  timezone: string
  flag: string
}

const COUNTRIES: CountryEntry[] = [
  { name: 'India', code: 'IN', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'Saudi Arabia', code: 'SA', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
  { name: 'UAE', code: 'AE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { name: 'Qatar', code: 'QA', timezone: 'Asia/Qatar', flag: '🇶🇦' },
  { name: 'Bahrain', code: 'BH', timezone: 'Asia/Bahrain', flag: '🇧🇭' },
  { name: 'Kuwait', code: 'KW', timezone: 'Asia/Kuwait', flag: '🇰🇼' },
  { name: 'Oman', code: 'OM', timezone: 'Asia/Muscat', flag: '🇴🇲' },
  { name: 'United States (East)', code: 'US-E', timezone: 'America/New_York', flag: '🇺🇸' },
  { name: 'United States (Central)', code: 'US-C', timezone: 'America/Chicago', flag: '🇺🇸' },
  { name: 'United States (Mountain)', code: 'US-M', timezone: 'America/Denver', flag: '🇺🇸' },
  { name: 'United States (West)', code: 'US-W', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', timezone: 'Europe/London', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { name: 'France', code: 'FR', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { name: 'Netherlands', code: 'NL', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  { name: 'Singapore', code: 'SG', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { name: 'Malaysia', code: 'MY', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { name: 'Japan', code: 'JP', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'South Korea', code: 'KR', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { name: 'Australia (East)', code: 'AU-E', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { name: 'Australia (West)', code: 'AU-W', timezone: 'Australia/Perth', flag: '🇦🇺' },
  { name: 'New Zealand', code: 'NZ', timezone: 'Pacific/Auckland', flag: '🇳🇿' },
  { name: 'Canada (East)', code: 'CA-E', timezone: 'America/Toronto', flag: '🇨🇦' },
  { name: 'Canada (West)', code: 'CA-W', timezone: 'America/Vancouver', flag: '🇨🇦' },
  { name: 'South Africa', code: 'ZA', timezone: 'Africa/Johannesburg', flag: '🇿🇦' },
  { name: 'Nigeria', code: 'NG', timezone: 'Africa/Lagos', flag: '🇳🇬' },
  { name: 'Kenya', code: 'KE', timezone: 'Africa/Nairobi', flag: '🇰🇪' },
  { name: 'Egypt', code: 'EG', timezone: 'Africa/Cairo', flag: '🇪🇬' },
  { name: 'Pakistan', code: 'PK', timezone: 'Asia/Karachi', flag: '🇵🇰' },
  { name: 'Bangladesh', code: 'BD', timezone: 'Asia/Dhaka', flag: '🇧🇩' },
  { name: 'Sri Lanka', code: 'LK', timezone: 'Asia/Colombo', flag: '🇱🇰' },
  { name: 'Indonesia', code: 'ID', timezone: 'Asia/Jakarta', flag: '🇮🇩' },
  { name: 'Thailand', code: 'TH', timezone: 'Asia/Bangkok', flag: '🇹🇭' },
  { name: 'Philippines', code: 'PH', timezone: 'Asia/Manila', flag: '🇵🇭' },
  { name: 'Brazil', code: 'BR', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { name: 'Mexico', code: 'MX', timezone: 'America/Mexico_City', flag: '🇲🇽' },
  { name: 'Turkey', code: 'TR', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
  { name: 'Israel', code: 'IL', timezone: 'Asia/Jerusalem', flag: '🇮🇱' },
  { name: 'Jordan', code: 'JO', timezone: 'Asia/Amman', flag: '🇯🇴' },
  { name: 'China', code: 'CN', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
  { name: 'Hong Kong', code: 'HK', timezone: 'Asia/Hong_Kong', flag: '🇭🇰' },
]

/* ───────── helpers ───────── */

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS_HEADER = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MIN_BOOKING_GAP_DAYS = 3

function convertUTCToLocal(utcDateStr: string, tz: string): { hour: number; minute: number; dateStr: string } {
  const utc = new Date(utcDateStr + (utcDateStr.endsWith('Z') ? '' : 'Z'))
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
  }).formatToParts(utc)

  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
  const dateStr = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}`
  return { hour, minute, dateStr }
}

function formatTime12(hour: number, minute: number): string {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:${String(minute).padStart(2, '0')} ${suffix}`
}

function formatDateLabel(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function dateToYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 30
  return (parseInt(match[1] || '0') * 60) + parseInt(match[2] || '0')
}

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const match = COUNTRIES.find(c => c.timezone === tz)
    if (match) return match.code
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'IN'
  } catch { /* fallback */ }
  return 'IN'
}

function getSuggestedCountries(currentCode: string): CountryEntry[] {
  const current = COUNTRIES.find(c => c.code === currentCode)
  if (!current) return []

  const refDate = new Date('2026-01-15T12:00:00Z')
  function getOffset(tz: string): number {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(refDate)
    const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0')
    const m = parseInt(parts.find(p => p.type === 'minute')?.value || '0')
    return h * 60 + m
  }

  const currentOffset = getOffset(current.timezone)
  return COUNTRIES
    .filter(c => c.code !== currentCode)
    .map(c => ({ ...c, diff: Math.abs(getOffset(c.timezone) - currentOffset) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5)
}

/* ───────── types ───────── */

interface BookingService {
  id: string
  name: string
  description: string
  duration: string
  price: number
  priceType: string
  isOnline: boolean
  staffIds: string[]
}

interface AvailableSlot {
  start: string
  end: string
  status: string
}

interface LocalSlot {
  raw: AvailableSlot
  localHour: number
  localMinute: number
  localTimeLabel: string
  istTimeLabel: string
}

/* ───────── component ───────── */

export default function BookingCalendarPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + MIN_BOOKING_GAP_DAYS)

  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 30)

  // Country & timezone
  const [selectedCountry, setSelectedCountry] = useState<string>('IN')
  const [countrySearch, setCountrySearch] = useState('')
  const [showCountryPicker, setShowCountryPicker] = useState(false)

  const country = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]
  const timezone = country.timezone

  // Calendar state
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<LocalSlot | null>(null)

  // Services
  const [services, setServices] = useState<BookingService[]>([])
  const [selectedService, setSelectedService] = useState<BookingService | null>(null)
  const [servicesLoading, setServicesLoading] = useState(true)
  const [servicesError, setServicesError] = useState('')

  // Availability
  const [slots, setSlots] = useState<LocalSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  // Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [topic, setTopic] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  // Submission
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [bookingResult, setBookingResult] = useState<{ joinUrl?: string; service?: string } | null>(null)

  // Fallback request
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'sent'>('idle')
  const [reqName, setReqName] = useState('')
  const [reqEmail, setReqEmail] = useState('')
  const [reqWhatsapp, setReqWhatsapp] = useState('')
  const [reqMessage, setReqMessage] = useState('')
  const [reqEmailVerified, setReqEmailVerified] = useState(false)

  useEffect(() => { setEmailVerified(false) }, [email])
  useEffect(() => { setReqEmailVerified(false) }, [reqEmail])

  // Detect country on mount
  useEffect(() => { setSelectedCountry(detectCountry()) }, [])

  // Fetch services on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/bookings/services')
        const data = await res.json()
        if (data.success && data.services?.length) {
          setServices(data.services)
          setSelectedService(data.services[0])
        } else {
          setServicesError('No booking services available. Please contact us directly.')
        }
      } catch {
        setServicesError('Unable to load booking services. Please try again later.')
      } finally {
        setServicesLoading(false)
      }
    }
    loadServices()
  }, [])

  // Fetch and convert availability when date, service, or country changes
  useEffect(() => {
    if (!selectedDate || !selectedService) return

    async function loadAvailability() {
      setSlotsLoading(true)
      setSlots([])
      setSelectedSlot(null)
      setShowRequestForm(false)
      setRequestStatus('idle')
      try {
        const dateStr = dateToYMD(selectedDate!)
        const params = new URLSearchParams({
          date: dateStr,
          serviceId: selectedService!.id,
          timezone,
        })
        const res = await fetch(`/api/bookings/availability?${params}`)
        const data = await res.json()
        if (data.success && data.slots) {
          const localSlots: LocalSlot[] = data.slots.map((slot: AvailableSlot) => {
            const local = convertUTCToLocal(slot.start, timezone)
            const ist = convertUTCToLocal(slot.start, 'Asia/Kolkata')
            return {
              raw: slot,
              localHour: local.hour,
              localMinute: local.minute,
              localTimeLabel: formatTime12(local.hour, local.minute),
              istTimeLabel: formatTime12(ist.hour, ist.minute),
            }
          })
          setSlots(localSlots)
        }
      } catch {
        setSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }
    loadAvailability()
  }, [selectedDate, selectedService, timezone])

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
      if (dow === 0 || dow === 6) return false
      if (d < minDate) return false
      if (d > maxDate) return false
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewYear, viewMonth],
  )

  const isToday = (day: number) => isSameDay(new Date(viewYear, viewMonth, day), today)
  const isSelected = (day: number) =>
    selectedDate !== null && isSameDay(new Date(viewYear, viewMonth, day), selectedDate)

  /* ── filtered countries for search ── */
  const filteredCountries = countrySearch
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
    : COUNTRIES

  /* ── suggested nearby countries when no slots ── */
  const suggestedCountries = slots.length === 0 && !slotsLoading && selectedDate
    ? getSuggestedCountries(selectedCountry)
    : []

  /* ── fallback request ── */
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
          message: `Country: ${country.name} | Timezone: ${timezone} | Message: ${reqMessage}`,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch { /* show sent anyway */ }
    setRequestStatus('sent')
  }

  /* ── submit booking ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot || !selectedService) return
    setStatus('submitting')
    setErrorMsg('')

    try {
      const startParts = selectedSlot.raw.start.split('T')[1]?.substring(0, 5) || '09:00'
      const endParts = selectedSlot.raw.end.split('T')[1]?.substring(0, 5) || '09:30'

      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: dateToYMD(selectedDate),
          startTime: startParts,
          endTime: endParts,
          timezone,
          name,
          email,
          whatsapp,
          topic,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create booking')

      setBookingResult({
        joinUrl: data.appointment?.joinUrl,
        service: data.appointment?.service,
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error ? err.message :
        'Something went wrong. Please try again or email us at contact@gennoor.com',
      )
    }
  }

  /* ── success state ── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">
            Your {bookingResult?.service || 'discovery call'} with <strong>Jalal Khan</strong> has been scheduled for{' '}
            <strong>{selectedDate ? formatDateLabel(selectedDate) : ''}</strong> at{' '}
            <strong>{selectedSlot?.localTimeLabel}</strong>{' '}
            ({country.name} time).
          </p>

          {bookingResult?.joinUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Microsoft Teams Meeting</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                A Teams meeting has been created. You&apos;ll also receive an email with the calendar invite.
              </p>
              <a
                href={bookingResult.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Video className="h-4 w-4" />
                Join Teams Meeting
              </a>
            </div>
          )}

          <p className="text-gray-500 mb-8">
            A confirmation and calendar invite will be sent to <strong>{email}</strong>.
            {whatsapp && ' We\'ll also reach out on WhatsApp with the meeting details.'}
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  /* ── main render ── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">
            Schedule a Call with Jalal Khan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book a free consultation with Gennoor Tech. Select your country, pick a service, and choose
            a time — you&apos;ll get a Teams meeting link instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ─── LEFT: Country + Service + Calendar + Slots ─── */}
          <div className="space-y-6">
            {/* country selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Your Country</h2>
              </div>

              {!showCountryPicker ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-xs text-gray-400">({timezone})</span>
                  </span>
                  <button
                    onClick={() => setShowCountryPicker(true)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredCountries.map(c => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setSelectedCountry(c.code)
                          setShowCountryPicker(false)
                          setCountrySearch('')
                          setSelectedSlot(null)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-primary-50 flex items-center gap-2 ${
                          c.code === selectedCountry ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">{c.timezone}</span>
                      </button>
                    ))}
                    {filteredCountries.length === 0 && (
                      <p className="px-3 py-4 text-sm text-gray-500 text-center">No country found</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowCountryPicker(false); setCountrySearch('') }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* service selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Select a Service</h2>
              </div>

              {servicesLoading && (
                <div className="flex items-center gap-2 text-gray-500 py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading services...</span>
                </div>
              )}

              {servicesError && (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{servicesError}</span>
                </div>
              )}

              {!servicesLoading && services.length > 0 && (
                <div className="space-y-2">
                  {services.map(svc => (
                    <button
                      key={svc.id}
                      onClick={() => { setSelectedService(svc); setSelectedSlot(null) }}
                      className={`w-full text-left rounded-xl p-4 border transition-colors ${
                        selectedService?.id === svc.id
                          ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{svc.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {parseDuration(svc.duration)} min
                        </span>
                      </div>
                      {svc.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{svc.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {svc.isOnline && (
                          <span className="flex items-center gap-1 text-xs text-blue-600">
                            <Video className="h-3 w-3" /> Teams meeting
                          </span>
                        )}
                        <span className="text-xs text-gray-400">with Jalal Khan</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* calendar card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Select a Date</h2>
              </div>

              <div className="flex items-center justify-between mb-4">
                <button onClick={goPrev} disabled={!canGoPrev} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Previous month">
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <span className="font-medium text-gray-900">{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={goNext} disabled={!canGoNext} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Next month">
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                {DAYS_HEADER.map(d => <span key={d}>{d}</span>)}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <span key={`blank-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const selectable = isDaySelectable(day)
                  const dow = new Date(viewYear, viewMonth, day).getDay()
                  const isWeekend = dow === 0 || dow === 6
                  return (
                    <button
                      key={day}
                      disabled={!selectable}
                      onClick={() => { setSelectedDate(new Date(viewYear, viewMonth, day)); setSelectedSlot(null) }}
                      className={`
                        h-9 w-9 mx-auto rounded-full text-sm font-medium transition-colors
                        ${isSelected(day) ? 'bg-primary-600 text-white' : ''}
                        ${!isSelected(day) && isToday(day) ? 'ring-2 ring-primary-400 text-primary-700' : ''}
                        ${!selectable ? 'text-gray-300 cursor-not-allowed' : ''}
                        ${selectable && !isSelected(day) && !isToday(day) ? 'text-gray-800 hover:bg-primary-50' : ''}
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* time slots */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Available Times</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {formatDateLabel(selectedDate)} — {country.name} time
                  {selectedService && ` — ${selectedService.name}`}
                </p>

                {slotsLoading && (
                  <div className="flex items-center gap-2 text-gray-500 py-6">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Checking Jalal Khan&apos;s availability...</span>
                  </div>
                )}

                {!slotsLoading && slots.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            py-2.5 px-3 rounded-lg text-sm font-medium transition-colors border text-left
                            ${selectedSlot === slot
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:text-primary-700'
                            }
                          `}
                        >
                          <span className="block">{slot.localTimeLabel}</span>
                          <span className={`text-xs ${selectedSlot === slot ? 'text-primary-200' : 'text-gray-400'}`}>
                            {slot.istTimeLabel} IST
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Available hours: 9:00 AM – 6:00 PM IST (Indian Standard Time)
                    </p>
                  </>
                )}

                {!slotsLoading && slots.length === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-amber-700 bg-amber-50 rounded-lg p-3 text-sm border border-amber-200">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">No available slots for this date</p>
                        <p className="text-amber-600 mt-1">
                          Jalal Khan may be fully booked on this day, or the available hours
                          (9 AM – 6 PM IST) don&apos;t have openings. Try another date or a nearby country below.
                        </p>
                      </div>
                    </div>

                    {suggestedCountries.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Try a nearby country to find different available hours:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedCountries.map(c => (
                            <button
                              key={c.code}
                              onClick={() => {
                                setSelectedCountry(c.code)
                                setSelectedSlot(null)
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-primary-50 hover:text-primary-700 rounded-lg border border-gray-200 transition-colors"
                            >
                              <span>{c.flag}</span>
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

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
                        <input type="text" required value={reqName} onChange={e => setReqName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input type="email" required value={reqEmail} onChange={e => setReqEmail(e.target.value)} placeholder="Your email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <EmailOTP email={reqEmail} onVerified={() => setReqEmailVerified(true)} verified={reqEmailVerified} compact />
                        <PhoneInput label="WhatsApp (optional)" id="req-whatsapp" value={reqWhatsapp} onChange={(fullNumber) => setReqWhatsapp(fullNumber)} required={false} />
                        <textarea required rows={2} value={reqMessage} onChange={e => setReqMessage(e.target.value)} placeholder="Preferred date/time and topic for the call..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                        <div className="flex gap-2">
                          <button type="submit" disabled={requestStatus === 'submitting' || !reqEmailVerified} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
                            {requestStatus === 'submitting' ? 'Sending...' : 'Send Request'}
                          </button>
                          <button type="button" onClick={() => setShowRequestForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
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
              </div>
            )}
          </div>

          {/* ─── RIGHT: Details form ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit lg:sticky lg:top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Your Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4" /> Name
                </label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <EmailOTP email={email} onVerified={() => setEmailVerified(true)} verified={emailVerified} />
              </div>

              <PhoneInput label="WhatsApp Number" id="calendar-whatsapp" value={whatsapp} onChange={(fullNumber) => setWhatsapp(fullNumber)} required={true} />

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="h-4 w-4" /> Topic / Purpose of Call
                </label>
                <textarea required rows={3} value={topic} onChange={e => setTopic(e.target.value)} placeholder="E.g., AI strategy discussion, agentic workflow POC..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>

              {/* summary */}
              {selectedDate && selectedSlot && selectedService && (
                <div className="rounded-lg bg-primary-50 p-4 text-sm text-primary-800 space-y-1">
                  <p><strong>Meeting with:</strong> Jalal Khan</p>
                  <p><strong>Service:</strong> {selectedService.name} ({parseDuration(selectedService.duration)} min)</p>
                  <p><strong>Date:</strong> {formatDateLabel(selectedDate)}</p>
                  <p><strong>Time:</strong> {selectedSlot.localTimeLabel} ({country.name}) / {selectedSlot.istTimeLabel} IST</p>
                  {selectedService.isOnline && (
                    <p className="flex items-center gap-1 text-blue-700">
                      <Video className="h-3.5 w-3.5" /> Teams meeting link will be generated
                    </p>
                  )}
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3 text-sm border border-red-200">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedDate || !selectedSlot || !emailVerified || !selectedService || status === 'submitting'}
                className="w-full rounded-lg bg-primary-600 py-3 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating booking...</>
                ) : (
                  <><Check className="h-4 w-4" /> Confirm Booking</>
                )}
              </button>

              {!selectedDate && (
                <p className="text-xs text-center text-gray-400">
                  Select your country, a service, date, and time to continue.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
