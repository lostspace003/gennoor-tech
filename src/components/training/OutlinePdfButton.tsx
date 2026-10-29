'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'

const FIELD = 'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-600'

/** "Download the PDF": a short form (name, email, phone) first, then the file downloads. */
export default function OutlinePdfButton({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/outline-download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, name, email, phone }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || !d.url) { setError(d.error || 'Could not prepare the download.'); return }
      setDone(true)
      window.location.href = d.url // the link has a download header, so the page stays put
    } finally { setBusy(false) }
  }

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setDone(false); setError('') }} className="link-arrow !text-[15px] text-left">Download the PDF ›</button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Download the course outline">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
            <h2 className="font-heading text-xl font-bold text-gray-900 pr-8">Download the course outline</h2>
            <p className="text-sm text-[#6e6e73] mt-1">{title}</p>
            {done ? (
              <p className="mt-6 text-[15px] text-gray-800">Thank you. Your download should start now. If it does not, send the form again.</p>
            ) : (
              <div className="mt-5 space-y-4">
                <div><label htmlFor="op-name" className="block text-sm font-medium text-gray-700 mb-1">Full name *</label><input id="op-name" required value={name} onChange={e => setName(e.target.value)} className={FIELD} autoComplete="name" /></div>
                <div><label htmlFor="op-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input id="op-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className={FIELD} autoComplete="email" /></div>
                <PhoneInput label="Phone / WhatsApp number *" id="op-phone" value={phone} onChange={full => setPhone(full)} />
                {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                <button type="submit" disabled={busy || !phone} className="w-full px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {busy && <Loader2 className="w-4 h-4 animate-spin" />}Download PDF
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  )
}
