'use client';

import { useState, FormEvent } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  service: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

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
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent</h3>
        <p className="text-gray-600 mb-6">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">
            Something went wrong. Please try again or email us directly at{' '}
            <a href="mailto:contact@gennoor.com" className="underline font-medium">
              contact@gennoor.com
            </a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1.5">
            WhatsApp Number
          </label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your organization"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1.5">
          Service Interest
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 bg-white"
        >
          <option value="">Select a service...</option>
          <option value="ai-strategy">AI Strategy Consulting</option>
          <option value="training">AI Training Programs</option>
          <option value="poc-development">PoC Development</option>
          <option value="agentic-ai">Agentic AI Solutions</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your project, team size, timeline, or any questions you have..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
