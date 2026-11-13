'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Loader2, CheckCircle } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'
import EmailOTP from '@/components/EmailOTP'
import { COUNTRIES, zoneForCountry } from '@/lib/tech-call'
import { formatInZone, formatTimeInZone, istInstant, IST } from '@/lib/crm/timezones'

interface Props {
  isOpen: boolean
  onClose: () => void
  course?: string
  courseSlug?: string
}

interface Day { date: string; slots: { time: string; open: boolean }[] }

const FIELD = 'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-600'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const STEPS = ['Verify email', 'About you', 'Pick a time']

export default function ScheduleCallModal({ isOpen, onClose, course = '', courseSlug = '' }: Props) {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [verified, setVerified] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [audience, setAudience] = useState<'Individual' | 'Team'>('Individual')
  const [teamSize, setTeamSize] = useState('')
  const [organization, setOrganization] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [orgLocation, setOrgLocation] = useState('')
  const [note, setNote] = useState('')
  const [days, setDays] = useState<Day[]>([])
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null)
  const [pickDate, setPickDate] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => { setVerified(false) }, [email])
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') requestClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, name, email, note])
  useEffect(() => {
    if (!isOpen || step !== 2 || days.length) return
    fetch('/api/tech-call/slots').then(r => r.json()).then(d => {
      setDays(d.days || [])
      setPickDate(d.days?.[0]?.date || '')
    }).catch(() => setError('Could not load times. Please try again.'))
  }, [isOpen, step, days.length])

  const tz = useMemo(() => (country ? zoneForCountry(country) : IST), [country])
  const dirty = !!(email || name || note)
  const requestClose = () => {
    if (done || !dirty || window.confirm('Close this form? What you entered will be lost.')) { onClose() }
  }

  const detailsOk = name.trim() && phone && country && organization.trim() && note.trim() && (audience === 'Individual' || Number(teamSize) >= 2)
  const label = (d: string, t: string) => `${formatTimeInZone(istInstant(d, t), tz)}`
  const dayLabel = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

  const submit = async () => {
    if (!slot) return
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/tech-call/request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone, country, audience, teamSize: Number(teamSize) || 0, organization, userLocation, orgLocation, note, course, courseSlug, slotDate: slot.date, slotTime: slot.time }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Could not send your request.'); return }
      setDone(true)
    } finally { setBusy(false) }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Schedule a call">
      <div className="fixed inset-0 bg-black/50" onClick={requestClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-raised sm:rounded-2xl min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-[-0.01em] text-gray-900">Schedule a Call</h2>
            <p className="text-sm text-gray-500 mt-0.5">{course ? `About: ${course}` : 'A 30-minute tech call with our team'}</p>
          </div>
          <button onClick={requestClose} aria-label="Close" className="p-2 -m-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
        </div>

        {done ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request sent</h3>
            <p className="text-gray-500">We will confirm by email. Once approved you will get the Microsoft Teams invite{slot ? ` for ${formatInZone(istInstant(slot.date, slot.time), tz)}` : ''}.</p>
            <button onClick={onClose} className="mt-6 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700">Close</button>
          </div>
        ) : (
          <div className="px-6 py-5 overflow-y-auto flex-1">
            <ol className="flex items-center gap-2 mb-5 text-xs font-medium">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex-1 pb-1.5 border-b-2 ${i <= step ? 'border-primary-600 text-primary-600' : 'border-gray-200 text-gray-400'}`}>{i + 1}. {s}</li>
              ))}
            </ol>

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="sc-email" className={LABEL}>Email *</label>
                  <input id="sc-email" type="email" value={email} onChange={e => setEmail(e.target.value.trim())} className={FIELD} autoComplete="email" />
                </div>
                <EmailOTP email={email} onVerified={() => setVerified(true)} verified={verified} />
                <p className="text-xs text-gray-400">We verify your email with a 6-digit code before you can book.</p>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div><label htmlFor="sc-name" className={LABEL}>Full name *</label><input id="sc-name" value={name} onChange={e => setName(e.target.value)} className={FIELD} autoComplete="name" /></div>
                <PhoneInput label="Phone / WhatsApp number *" id="sc-phone" value={phone} onChange={(full) => setPhone(full)} />
                <div>
                  <label htmlFor="sc-country" className={LABEL}>Your country *</label>
                  <select id="sc-country" value={country} onChange={e => { setCountry(e.target.value); setSlot(null) }} className={FIELD}>
                    <option value="">Select a country</option>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <span className={LABEL}>Booking as *</span>
                  <div className="flex gap-3">
                    {(['Individual', 'Team'] as const).map(a => (
                      <label key={a} className={`flex-1 text-center cursor-pointer rounded-xl border px-3 py-2 text-sm ${audience === a ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' : 'border-gray-300 text-gray-700'}`}>
                        <input type="radio" name="sc-aud" className="sr-only" checked={audience === a} onChange={() => setAudience(a)} />{a}
                      </label>
                    ))}
                  </div>
                </div>
                {audience === 'Team' && (
                  <div><label htmlFor="sc-size" className={LABEL}>Team size *</label><input id="sc-size" type="number" min={2} inputMode="numeric" value={teamSize} onChange={e => setTeamSize(e.target.value)} className={FIELD} /></div>
                )}
                <div><label htmlFor="sc-org" className={LABEL}>Organization name *</label><input id="sc-org" value={organization} onChange={e => setOrganization(e.target.value)} className={FIELD} autoComplete="organization" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sc-ul" className={LABEL}>Your location</label>
                    <select id="sc-ul" value={userLocation} onChange={e => setUserLocation(e.target.value)} className={FIELD}><option value="">Select</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div>
                    <label htmlFor="sc-ol" className={LABEL}>Organization location</label>
                    <select id="sc-ol" value={orgLocation} onChange={e => setOrgLocation(e.target.value)} className={FIELD}><option value="">Select</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                </div>
                <div>
                  <label htmlFor="sc-note" className={LABEL}>What are you looking for in this call? *</label>
                  <textarea id="sc-note" rows={3} maxLength={1500} value={note} onChange={e => setNote(e.target.value)} className={FIELD} placeholder="A few lines is enough" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm text-gray-500 mb-3">Calls run between 6:00 and 9:00 pm IST. Times below are shown in <strong>{tz.replace(/_/g, ' ')}</strong>{country ? ` (${country})` : ''}.</p>
                {!days.length && !error && <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600" /></div>}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {days.map(d => (
                    <button key={d.date} type="button" onClick={() => setPickDate(d.date)}
                      className={`shrink-0 rounded-xl border px-3 py-2 text-sm ${pickDate === d.date ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium' : 'border-gray-300 text-gray-700'}`}>{dayLabel(d.date)}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {days.find(d => d.date === pickDate)?.slots.map(s => {
                    const chosen = slot?.date === pickDate && slot.time === s.time
                    return (
                      <button key={s.time} type="button" disabled={!s.open} onClick={() => setSlot({ date: pickDate, time: s.time })}
                        className={`rounded-xl border px-3 py-2.5 text-sm ${chosen ? 'border-primary-600 bg-primary-600 text-white' : s.open ? 'border-gray-300 text-gray-800 hover:border-primary-600' : 'border-gray-200 text-gray-300 line-through cursor-not-allowed'}`}>
                        {label(pickDate, s.time)}
                      </button>
                    )
                  })}
                </div>
                {slot && <p className="text-sm text-gray-800 mt-4">Selected: <strong>{formatInZone(istInstant(slot.date, slot.time), tz)}</strong></p>}
              </div>
            )}

            {error && <p className="text-sm text-red-600 mt-4" role="alert">{error}</p>}
          </div>
        )}

        {!done && (
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
            {step > 0 && <button type="button" onClick={() => { setStep(step - 1); setError('') }} className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Back</button>}
            <div className="flex-1" />
            {step < 2 ? (
              <button type="button" disabled={step === 0 ? !verified : !detailsOk} onClick={() => { setStep(step + 1); setError('') }}
                className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
            ) : (
              <button type="button" disabled={!slot || busy} onClick={submit}
                className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}Request call
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
