'use client'

import { X, Shield } from 'lucide-react'
import { useEffect } from 'react'

interface CertificateViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  certName: string
  certCode: string
}

export default function CertificateViewerModal({ isOpen, onClose, pdfUrl, certName, certCode }: CertificateViewerModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Render PDF inline with toolbar=0 to hide download controls
  const viewerUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary-600" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{certName}</h3>
              <p className="text-sm text-gray-500">{certCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close certificate viewer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div style={{ height: 'calc(90vh - 80px)' }}>
          <iframe
            src={viewerUrl}
            className="w-full h-full"
            title={`${certName} Certificate`}
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
