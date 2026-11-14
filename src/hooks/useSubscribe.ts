'use client'

import { useState } from 'react'

/**
 * The one way to sign up for new posts by email, used by every subscribe box of the site (the foot of a
 * page, the blog, every article). Each box keeps its own look; what happens is decided here.
 *
 *   idle      nothing sent yet
 *   sending   the address is on its way to the server
 *   sent      we emailed "Confirm your email": the visitor must press the button in it
 *   already   this address is on the list already
 *   error     it did not work; `message` says why in plain words
 *
 * The box never says "Subscribed" before the address has been confirmed, because until then it is not.
 */
export type SubscribeState = 'idle' | 'sending' | 'sent' | 'already' | 'error'

export function useSubscribe(source: string) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubscribeState>('idle')
  const [message, setMessage] = useState('')

  const submit = async (e?: { preventDefault(): void }) => {
    e?.preventDefault()
    const address = email.trim()
    if (!address || state === 'sending') return
    setState('sending'); setMessage('')
    try {
      const res = await fetch('/api/newsletter-subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: address, source }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) { setState('error'); setMessage(data.message || 'That did not work. Please try again in a few minutes.'); return }
      setState(data.state === 'already' ? 'already' : 'sent')
    } catch {
      setState('error'); setMessage('We could not reach the server. Check your connection and try again.')
    }
  }

  /**
   * What to say once the button has been pressed (empty while idle or sending).
   * A box that has room for a heading shows `title` above `detail`; a small one shows `said`, the two in one line.
   * (Not "the next email goes on Thursday": a week with no new post brings no email.)
   */
  const title = state === 'sent' ? 'Check your inbox' : state === 'already' ? 'You are already subscribed' : ''
  const detail = state === 'sent' ? `We sent an email to ${email.trim()}. Press the button in it to confirm.`
    : state === 'already' ? "The week's new posts reach you by email on Thursday."
    : state === 'error' ? message
    : ''
  const said = state === 'sent' ? `Almost done. ${detail}` : state === 'already' ? `${title}. ${detail}` : detail

  return { email, setEmail, state, said, title, detail, submit, done: state === 'sent' || state === 'already' }
}
