'use client'

import { FormEvent, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'

const LABEL = 'block text-[13px] font-semibold text-gray-900 mb-1.5'
const FIELD =
  'w-full box-border font-[inherit] text-[15px] px-3.5 py-[11px] border border-gray-300 rounded-xl bg-raised text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-primary-600'

/**
 * The request for a proof of concept. One form, on /automation and on every proof-of-concept page.
 * `example` names the proof of concept the visitor was looking at, and fills in the process.
 * Sends to /api/poc-request, which saves it, emails the team and confirms to the visitor.
 */
export default function PocRequestForm({ example, topic }: { example?: string; topic?: string }) {
  const pathname = usePathname()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setStatus('submitting')
    const body = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch('/api/poc-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, example: example || '', page: pathname }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not send your request.')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your request.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10" role="status">
        <CheckCircle2 className="w-10 h-10 text-green-700 mx-auto" strokeWidth={1.8} aria-hidden />
        <h3 className="text-[20px] font-bold text-gray-900 mt-3">Request sent.</h3>
        <p className="text-[15px] text-gray-600 mt-2 max-w-[380px] mx-auto">We sent a confirmation to your email, and we will write back within one business day.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3.5">
      {error && <div className="border border-red-300 bg-red-50 rounded-xl px-4 py-3 text-[14px] text-red-700" role="alert">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div><label htmlFor="poc-name" className={LABEL}>Name</label><input id="poc-name" name="name" required className={FIELD} autoComplete="name" /></div>
        <div><label htmlFor="poc-email" className={LABEL}>Work email</label><input id="poc-email" name="email" type="email" required className={FIELD} autoComplete="email" placeholder="you@company.com" /></div>
      </div>
      <div><label htmlFor="poc-org" className={LABEL}>Organization</label><input id="poc-org" name="organization" required className={FIELD} autoComplete="organization" /></div>
      <div>
        <label htmlFor="poc-topic" className={LABEL}>The process</label>
        <input id="poc-topic" name="topic" required defaultValue={topic} className={FIELD} placeholder="For example: answering HR policy questions" />
      </div>
      <div>
        <label htmlFor="poc-detail" className={LABEL}>What should the proof of concept do?</label>
        <textarea id="poc-detail" name="detail" required rows={4} maxLength={2000} className={FIELD} placeholder="Who uses it, what goes in, what should come out, and how you would know it works." />
      </div>
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div><label htmlFor="poc-systems" className={LABEL}>Systems or data it touches (optional)</label><input id="poc-systems" name="systems" className={FIELD} placeholder="For example: SharePoint, an HR system" /></div>
        <div>
          <label htmlFor="poc-when" className={LABEL}>When</label>
          <select id="poc-when" name="timing" defaultValue="" className={FIELD}>
            <option value="">Not sure</option>
            <option>This month</option><option>In 1–3 months</option><option>Just exploring</option>
          </select>
        </div>
      </div>
      <div><label htmlFor="poc-phone" className={LABEL}>Phone or WhatsApp (optional)</label><input id="poc-phone" name="phone" className={FIELD} autoComplete="tel" /></div>
      <div className="pt-1">
        <button type="submit" disabled={status === 'submitting'} className="st-pill w-full sm:w-auto inline-flex items-center justify-center gap-2 disabled:opacity-60">
          {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />} Send the request
        </button>
      </div>
    </form>
  )
}
