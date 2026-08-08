'use client';

import { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Proposal/contact form in the prototype's field idiom. The wiring is
 * unchanged: same fields, same payload, same POST to /api/contact-enquiry,
 * same idle/submitting/success/error state machine.
 */

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  service: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const LABEL = 'block text-[12.5px] font-semibold text-gray-900 mb-1.5';
const FIELD =
  'w-full box-border font-[inherit] text-[14px] px-3.5 py-[11px] border border-[#d2d2d7] rounded-xl bg-white text-gray-900 placeholder:text-[#86868b] outline-none focus:border-primary-600 focus:ring-0 transition-colors';

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        company: '',
        service: '',
        message: '',
      });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="text-[44px] font-bold text-[#1d8348] mb-3">✓</div>
        <h3 className="text-[22px] font-bold tracking-[-0.01em] text-gray-900 mb-2">
          Message sent.
        </h3>
        <p className="text-[14.5px] text-[#6e6e73] mb-6">
          We reply within one business day — usually faster.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-medium text-primary-600 hover:text-[#0077ed] transition-colors"
        >
          Send another message ›
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {status === 'error' && (
        <div className="border border-[#eaa59d] bg-[#fdf4f3] rounded-xl px-4 py-3">
          <p className="text-sm text-[#9b2c21]">
            Something went wrong. Please try again or email us directly at{' '}
            <a href="mailto:contact@gennoor.com" className="underline font-medium">
              contact@gennoor.com
            </a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="name" className={LABEL}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            Work email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className={FIELD}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="whatsapp" className={LABEL}>
            WhatsApp number
          </label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="company" className={LABEL}>
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name"
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className={LABEL}>
          Topic
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={FIELD}
        >
          <option value="">Select a topic…</option>
          <option value="ai-strategy">AI Strategy Consulting</option>
          <option value="training">AI Training Programs</option>
          <option value="poc-development">PoC Development</option>
          <option value="agentic-ai">Agentic AI Solutions</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="What are you trying to get done?"
          className={`${FIELD} resize-y`}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-[#0077ed] text-white text-[15px] font-semibold px-7 py-[13px] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </button>
      </div>
    </form>
  );
}
