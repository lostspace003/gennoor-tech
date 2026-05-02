'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import EmailOTP from '@/components/EmailOTP'
import PhoneInput from '@/components/ui/PhoneInput'
import {
  Calendar, Clock, User, Check, ChevronLeft, ChevronRight,
  Video, Loader2, AlertCircle, MapPin, ArrowLeft, ArrowRight,
  Globe, Search, Sparkles, GraduationCap, Lightbulb,
} from 'lucide-react'

/* ───────── country → timezone ───────── */

interface CountryEntry { name: string; code: string; timezone: string; flag: string }

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

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_HEADER = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MIN_BOOKING_GAP_DAYS = 3

function convertUTCToLocal(utcDateStr: string, tz: string) {
  const utc = new Date(utcDateStr + (utcDateStr.endsWith('Z') ? '' : 'Z'))
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: 'numeric', minute: 'numeric', year: 'numeric', month: '2-digit', day: '2-digit', hour12: false,
  }).formatToParts(utc)
  return {
    hour: parseInt(parts.find(p => p.type === 'hour')?.value || '0'),
    minute: parseInt(parts.find(p => p.type === 'minute')?.value || '0'),
  }
}

function formatTime12(hour: number, minute: number): string {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:${String(minute).padStart(2, '0')} ${suffix}`
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function dateToYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDuration(iso: string) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 30
  return (parseInt(match[1] || '0') * 60) + parseInt(match[2] || '0')
}

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const match = COUNTRIES.find(c => c.timezone === tz)
    if (match) return match.code
  } catch { /* fallback */ }
  return 'IN'
}

/* ───────── service helpers ───────── */

function getServiceOrder(name: string): number {
  const l = name.toLowerCase()
  if (l.includes('discovery')) return 1
  if (l.includes('training') || l.includes('consultation')) return 2
  if (l.includes('strategy') || l.includes('workshop')) return 3
  return 99
}

function isDefaultService(name: string): boolean {
  const l = name.toLowerCase()
  return l.includes('training') || l.includes('consultation')
}

function getServiceIcon(name: string) {
  const l = name.toLowerCase()
  if (l.includes('discovery')) return Lightbulb
  if (l.includes('training') || l.includes('consultation')) return GraduationCap
  if (l.includes('strategy') || l.includes('workshop')) return Sparkles
  return Calendar
}

/* ───────── types ───────── */

interface BookingService { id: string; name: string; description: string; duration: string; price: number; priceType: string; isOnline: boolean; staffIds: string[] }
interface AvailableSlot { start: string; end: string; status: string }
interface LocalSlot { raw: AvailableSlot; localHour: number; localMinute: number; localTimeLabel: string; endTimeLabel: string; istTimeLabel: string }

/* ───────── component ───────── */

export default function BookingCalendarPage() {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const minDate = new Date(today); minDate.setDate(minDate.getDate() + MIN_BOOKING_GAP_DAYS)
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 30)

  // Steps: 1=timezone, 2=service, 3=date+time, 4=details
  const [step, setStep] = useState(1)
  const [fading, setFading] = useState(false)

  // Country
  const [selectedCountry, setSelectedCountry] = useState('IN')
  const [countrySearch, setCountrySearch] = useState('')
  const country = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0]
  const timezone = country.timezone

  // Calendar
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

  // Fallback
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'sent'>('idle')
  const [reqName, setReqName] = useState('')
  const [reqEmail, setReqEmail] = useState('')
  const [reqWhatsapp, setReqWhatsapp] = useState('')
  const [reqMessage, setReqMessage] = useState('')
  const [reqEmailVerified, setReqEmailVerified] = useState(false)

  useEffect(() => { setEmailVerified(false) }, [email])
  useEffect(() => { setReqEmailVerified(false) }, [reqEmail])
  useEffect(() => { setSelectedCountry(detectCountry()) }, [])

  const goTo = useCallback((n: number) => {
    if (n === step || fading) return
    setFading(true)
    setTimeout(() => {
      setStep(n)
      setTimeout(() => setFading(false), 50)
    }, 200)
  }, [step, fading])

  // Fetch services
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/bookings/services')
        const data = await res.json()
        if (data.success && data.services?.length) {
          setServices(data.services)
        } else { setServicesError('No booking services available.') }
      } catch { setServicesError('Unable to load services.') }
      finally { setServicesLoading(false) }
    }
    load()
  }, [])

  // Default to Training Consultation
  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      const sorted = [...services].sort((a, b) => getServiceOrder(a.name) - getServiceOrder(b.name))
      setSelectedService(sorted.find(s => isDefaultService(s.name)) || sorted[0])
    }
  }, [services, selectedService])

  // Fetch availability
  useEffect(() => {
    if (!selectedDate || !selectedService) return
    async function load() {
      setSlotsLoading(true); setSlots([]); setSelectedSlot(null)
      setShowRequestForm(false); setRequestStatus('idle')
      try {
        const params = new URLSearchParams({ date: dateToYMD(selectedDate!), serviceId: selectedService!.id, timezone })
        const res = await fetch(`/api/bookings/availability?${params}`)
        const data = await res.json()
        if (data.success && data.slots) {
          setSlots(data.slots.map((slot: AvailableSlot) => {
            const local = convertUTCToLocal(slot.start, timezone)
            const endLocal = convertUTCToLocal(slot.end, timezone)
            const ist = convertUTCToLocal(slot.start, 'Asia/Kolkata')
            return {
              raw: slot,
              localHour: local.hour,
              localMinute: local.minute,
              localTimeLabel: formatTime12(local.hour, local.minute),
              endTimeLabel: formatTime12(endLocal.hour, endLocal.minute),
              istTimeLabel: formatTime12(ist.hour, ist.minute),
            }
          }))
        }
      } catch { setSlots([]) }
      finally { setSlotsLoading(false) }
    }
    load()
  }, [selectedDate, selectedService, timezone])

  /* ── calendar grid ── */
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth()
  const canGoNext = viewYear < maxDate.getFullYear() || (viewYear === maxDate.getFullYear() && viewMonth < maxDate.getMonth())
  const goPrev = () => { if (!canGoPrev) return; if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const goNext = () => { if (!canGoNext) return; if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }
  const isDaySelectable = useCallback((day: number) => {
    const d = new Date(viewYear, viewMonth, day); const dow = d.getDay()
    return dow !== 0 && dow !== 6 && d >= minDate && d <= maxDate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewYear, viewMonth])
  const isToday = (day: number) => isSameDay(new Date(viewYear, viewMonth, day), today)
  const isSelected = (day: number) => selectedDate !== null && isSameDay(new Date(viewYear, viewMonth, day), selectedDate)

  const filteredCountries = countrySearch
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
    : COUNTRIES

  const sortedServices = [...services].sort((a, b) => getServiceOrder(a.name) - getServiceOrder(b.name))

  const morningSlots = slots.filter(s => s.localHour < 12)
  const afternoonSlots = slots.filter(s => s.localHour >= 12 && s.localHour < 17)
  const eveningSlots = slots.filter(s => s.localHour >= 17)

  /* ── handlers ── */
  const handleRequestCall = async (e: React.FormEvent) => {
    e.preventDefault(); setRequestStatus('submitting')
    try {
      await fetch('/api/book-expert-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: reqName, email: reqEmail, whatsapp: reqWhatsapp, programTitle: 'Call Request', message: `Country: ${country.name} | ${reqMessage}`, timestamp: new Date().toISOString() }),
      })
    } catch { /* best effort */ }
    setRequestStatus('sent')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot || !selectedService) return
    setStatus('submitting'); setErrorMsg('')
    try {
      const startParts = selectedSlot.raw.start.split('T')[1]?.substring(0, 5) || '09:00'
      const endParts = selectedSlot.raw.end.split('T')[1]?.substring(0, 5) || '09:30'
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: selectedService.id, date: dateToYMD(selectedDate), startTime: startParts, endTime: endParts, timezone, name, email, whatsapp, topic }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create booking')
      setBookingResult({ joinUrl: data.appointment?.joinUrl, service: data.appointment?.service })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Email us at contact@gennoor.com')
    }
  }

  /* ── success screen ── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re booked!</h1>
            <p className="text-gray-600 mb-1">
              <strong>{bookingResult?.service || 'Meeting'}</strong> with Jalal Khan
            </p>
            <p className="text-gray-600">
              {selectedDate && formatShortDate(selectedDate)} at {selectedSlot?.localTimeLabel} ({country.name})
            </p>
            {bookingResult?.joinUrl && (
              <a href={bookingResult.joinUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                <Video className="h-4 w-4" /> Join Teams Meeting
              </a>
            )}
            <div className="mt-5 p-3 bg-gray-50 rounded-xl text-sm text-gray-500">
              A calendar invite has been sent to <strong>{email}</strong>
            </div>
            <Link href="/" className="inline-block mt-5 text-sm text-primary-600 hover:text-primary-700 font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── step config ── */
  const STEPS = [
    { n: 1, label: 'Timezone' },
    { n: 2, label: 'Service' },
    { n: 3, label: 'Date & Time' },
    { n: 4, label: 'Details' },
  ]

  /* ── main render ── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a meeting</h1>
          <p className="text-gray-500">Schedule a free consultation with Jalal Khan, Gennoor Tech</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => { if (s.n < step) goTo(s.n) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  step === s.n ? 'bg-primary-600 text-white shadow-sm' :
                  step > s.n ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-400'
                }`}
              >
                {step > s.n ? <Check className="h-3 w-3" /> : <span>{s.n}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 3 && <div className={`w-4 sm:w-8 h-0.5 ${step > s.n ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Card with fade transition */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className={`transition-opacity duration-200 ease-in-out ${fading ? 'opacity-0' : 'opacity-100'}`}>

            {/* ═══ STEP 1 — Timezone ═══ */}
            {step === 1 && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Where are you located?</h2>
                    <p className="text-sm text-gray-500">We&apos;ll show available times in your timezone</p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text" placeholder="Search country..." value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {filteredCountries.map(c => (
                    <button key={c.code} onClick={() => setSelectedCountry(c.code)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all border ${
                        c.code === selectedCountry
                          ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium shadow-sm'
                          : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button onClick={() => goTo(2)}
                    className="px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 2 — Service ═══ */}
            {step === 2 && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => goTo(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" /> {country.flag} {country.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">What would you like to discuss?</h2>
                    <p className="text-sm text-gray-500">All meetings are free &middot; Online via Microsoft Teams</p>
                  </div>
                </div>

                {servicesLoading && (
                  <div className="flex items-center justify-center gap-2 text-gray-400 py-12">
                    <Loader2 className="h-5 w-5 animate-spin" /> Loading services...
                  </div>
                )}

                {servicesError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-4">
                    <AlertCircle className="h-5 w-5" /> {servicesError}
                  </div>
                )}

                {!servicesLoading && sortedServices.length > 0 && (
                  <div className="space-y-3">
                    {sortedServices.map(svc => {
                      const Icon = getServiceIcon(svc.name)
                      const active = selectedService?.id === svc.id
                      return (
                        <button key={svc.id} onClick={() => setSelectedService(svc)}
                          className={`w-full text-left rounded-xl p-5 border-2 transition-all ${
                            active ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              active ? 'bg-primary-200' : 'bg-gray-100'
                            }`}>
                              <Icon className={`h-5 w-5 ${active ? 'text-primary-700' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-semibold text-gray-900">{svc.name}</span>
                                <span className="text-sm text-gray-500">{parseDuration(svc.duration)} min</span>
                              </div>
                              {svc.description && <p className="text-sm text-gray-500">{svc.description}</p>}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Video className="h-3 w-3" /> Teams</span>
                                <span className="flex items-center gap-1"><User className="h-3 w-3" /> Jalal Khan</span>
                                <span>Free</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button onClick={() => { if (selectedService) goTo(3) }} disabled={!selectedService}
                    className="px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 3 — Date & Time ═══ */}
            {step === 3 && (
              <div>
                <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <button onClick={() => goTo(2)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                      <ArrowLeft className="h-4 w-4" /> {selectedService?.name} ({parseDuration(selectedService?.duration || 'PT30M')} min)
                    </button>
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5" /> {country.flag} {country.name}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-[1fr_280px] divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  {/* Calendar */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Select a date</h3>

                    <div className="flex items-center justify-between mb-4">
                      <button onClick={goPrev} disabled={!canGoPrev} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30" aria-label="Previous">
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <span className="font-medium text-gray-800">{MONTHS[viewMonth]} {viewYear}</span>
                      <button onClick={goNext} disabled={!canGoNext} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30" aria-label="Next">
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-400 mb-2">
                      {DAYS_HEADER.map(d => <span key={d}>{d}</span>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => <span key={`b-${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1; const selectable = isDaySelectable(day)
                        return (
                          <button key={day} disabled={!selectable}
                            onClick={() => { setSelectedDate(new Date(viewYear, viewMonth, day)); setSelectedSlot(null) }}
                            className={`h-10 w-10 mx-auto rounded-full text-sm font-medium transition-all
                              ${isSelected(day) ? 'bg-primary-600 text-white shadow-sm' : ''}
                              ${!isSelected(day) && isToday(day) ? 'ring-2 ring-primary-400 text-primary-700' : ''}
                              ${!selectable ? 'text-gray-200' : ''}
                              ${selectable && !isSelected(day) && !isToday(day) ? 'text-gray-700 hover:bg-primary-50' : ''}
                            `}
                          >{day}</button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="p-6 sm:p-8 md:max-h-[480px] md:overflow-y-auto">
                    {!selectedDate && (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <Calendar className="h-10 w-10 text-gray-200 mb-3" />
                        <p className="text-sm text-gray-400">Pick a date to see<br />available times</p>
                      </div>
                    )}

                    {selectedDate && (
                      <>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {formatShortDate(selectedDate)}
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">{country.name} time</p>

                        {slotsLoading && (
                          <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                          </div>
                        )}

                        {!slotsLoading && slots.length > 0 && (
                          <div className="space-y-4">
                            {[
                              { label: 'Morning', items: morningSlots },
                              { label: 'Afternoon', items: afternoonSlots },
                              { label: 'Evening', items: eveningSlots },
                            ].filter(g => g.items.length > 0).map(group => (
                              <div key={group.label}>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                                  {group.label}
                                </p>
                                <div className="space-y-1.5">
                                  {group.items.map((slot, idx) => (
                                    <button key={idx} onClick={() => setSelectedSlot(slot)}
                                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                                        selectedSlot === slot
                                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                          : 'bg-white text-gray-700 border-gray-100 hover:border-primary-300 hover:bg-primary-50'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">{slot.localTimeLabel} – {slot.endTimeLabel}</span>
                                        {selectedSlot === slot ? <Check className="h-4 w-4" /> : (
                                          <span className="text-xs text-gray-400">{slot.istTimeLabel} IST</span>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {selectedSlot && (
                              <button onClick={() => goTo(4)}
                                className="w-full mt-2 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                                Next <ArrowRight className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )}

                        {!slotsLoading && slots.length === 0 && (
                          <div className="space-y-3">
                            <div className="text-center py-6">
                              <Clock className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 font-medium">No slots available</p>
                              <p className="text-xs text-gray-400 mt-1">Try a different date or request a call</p>
                            </div>
                            {!showRequestForm && requestStatus !== 'sent' && (
                              <button onClick={() => setShowRequestForm(true)}
                                className="w-full py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                                Request a Call
                              </button>
                            )}
                            {showRequestForm && requestStatus !== 'sent' && (
                              <form onSubmit={handleRequestCall} className="space-y-2">
                                <input type="text" required value={reqName} onChange={e => setReqName(e.target.value)} placeholder="Name" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                <input type="email" required value={reqEmail} onChange={e => setReqEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                <EmailOTP email={reqEmail} onVerified={() => setReqEmailVerified(true)} verified={reqEmailVerified} compact />
                                <PhoneInput label="WhatsApp" id="req-wa" value={reqWhatsapp} onChange={setReqWhatsapp} required={false} />
                                <textarea required rows={2} value={reqMessage} onChange={e => setReqMessage(e.target.value)} placeholder="Preferred time..." className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                                <button type="submit" disabled={requestStatus === 'submitting' || !reqEmailVerified} className="w-full py-2 text-sm font-medium text-white bg-primary-600 rounded-lg disabled:opacity-50">
                                  {requestStatus === 'submitting' ? 'Sending...' : 'Send Request'}
                                </button>
                              </form>
                            )}
                            {requestStatus === 'sent' && (
                              <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-lg p-3 text-sm">
                                <Check className="h-4 w-4" /> Request sent!
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 4 — Details ═══ */}
            {step === 4 && (
              <div className="p-6 sm:p-8">
                <button onClick={() => goTo(3)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6">
                  <ArrowLeft className="h-4 w-4" /> Change date &amp; time
                </button>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                      <Video className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{selectedService?.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">with Jalal Khan &middot; {parseDuration(selectedService?.duration || 'PT30M')} min &middot; Teams</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {selectedDate && formatShortDate(selectedDate)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {selectedSlot?.localTimeLabel} – {selectedSlot?.endTimeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{selectedSlot?.istTimeLabel} IST &middot; {country.flag} {country.name}</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    <EmailOTP email={email} onVerified={() => setEmailVerified(true)} verified={emailVerified} />
                  </div>

                  <PhoneInput label="WhatsApp Number" id="cal-wa" value={whatsapp} onChange={setWhatsapp} required={true} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What would you like to discuss?</label>
                    <textarea required rows={3} value={topic} onChange={e => setTopic(e.target.value)}
                      placeholder="E.g., AI strategy, training for our team, proof-of-concept..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 text-sm">
                      <AlertCircle className="h-4 w-4" /> {errorMsg}
                    </div>
                  )}

                  <button type="submit" disabled={!emailVerified || status === 'submitting'}
                    className="w-full py-3.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base">
                    {status === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</> : <><Check className="h-4 w-4" /> Confirm Booking</>}
                  </button>

                  <p className="text-xs text-center text-gray-400">
                    You&apos;ll receive a calendar invite and Teams meeting link via email
                  </p>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
