'use client'

import { useState, FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

const LABEL = 'block text-[12.5px] font-semibold text-gray-900 mb-1.5'
const FIELD =
  'w-full box-border font-[inherit] text-[14px] px-3.5 py-[11px] border border-[#d2d2d7] rounded-xl bg-white text-gray-900 placeholder:text-[#86868b] focus:outline-none focus:border-primary-600'

export default function JoinForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setStatus('submitting')
    try {
      const res = await fetch('/api/join', { method: 'POST', body: new FormData(e.currentTarget) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not send your application.')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your application.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-[44px] font-bold text-[#1d8348] mb-3">✓</div>
        <h3 className="text-[22px] font-bold text-gray-900 mb-2">Application sent.</h3>
        <p className="text-[14.5px] text-[#6e6e73]">We have sent a confirmation to your email. If there is a fit, we will write to you.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3.5">
      {error && <div className="border border-[#eaa59d] bg-[#fdf4f3] rounded-xl px-4 py-3 text-sm text-[#9b2c21]">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-3.5">
        <div><label htmlFor="name" className={LABEL}>Name</label><input id="name" name="name" required className={FIELD} placeholder="Your name" /></div>
        <div><label htmlFor="email" className={LABEL}>Email</label><input id="email" name="email" type="email" required className={FIELD} placeholder="you@example.com" /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div><label htmlFor="phone" className={LABEL}>Phone or WhatsApp (optional)</label><input id="phone" name="phone" className={FIELD} /></div>
        <div><label htmlFor="linkedin" className={LABEL}>LinkedIn link (optional)</label><input id="linkedin" name="linkedin" type="url" className={FIELD} placeholder="https://" /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="role" className={LABEL}>I want to work as</label>
          <select id="role" name="role" required defaultValue="" className={FIELD}>
            <option value="" disabled>Choose one</option>
            <option>Trainer</option>
            <option>Automation and software</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="arrangement" className={LABEL}>How</label>
          <select id="arrangement" name="arrangement" required defaultValue="" className={FIELD}>
            <option value="" disabled>Choose one</option>
            <option>Freelance</option>
            <option>Full-time</option>
            <option>Either</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="brief" className={LABEL}>A short note about you</label>
        <textarea id="brief" name="brief" required rows={5} maxLength={2000} className={FIELD} placeholder="What you teach or build, and for how long." />
      </div>
      <div>
        <label htmlFor="resume" className={LABEL}>Resume (PDF or Word, up to 5 MB)</label>
        <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" className="block w-full text-[14px] text-gray-700 file:mr-3 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium" />
      </div>
      <button type="submit" disabled={status === 'submitting'} className="pill-primary inline-flex items-center gap-2 disabled:opacity-60">
        {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />} Send application
      </button>
    </form>
  )
}
