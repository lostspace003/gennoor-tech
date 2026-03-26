'use client'

import { useState } from 'react'
import { Award } from 'lucide-react'
import CertificateViewerModal from './CertificateViewerModal'

interface MCTCertificateButtonProps {
  pdfUrl: string
}

export default function MCTCertificateButton({ pdfUrl }: MCTCertificateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center bg-white border-2 border-primary-600 text-primary-600 rounded-lg px-6 py-3 shadow-lg hover:bg-primary-50 transition-colors"
      >
        <Award className="w-6 h-6 mr-3" />
        <div className="text-left">
          <p className="font-bold">View MCT Certificate</p>
          <p className="text-sm">Official Microsoft credential</p>
        </div>
      </button>

      <CertificateViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pdfUrl={pdfUrl}
        certName="Microsoft Certified Trainer"
        certCode="MCT 2024-2025"
      />
    </>
  )
}
