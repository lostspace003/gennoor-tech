'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const whatsappNumber = '919326352241'
  const message = encodeURIComponent('Hi Jalal, I visited gennoor.com and would like to discuss AI training/consulting for my organization.')

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
