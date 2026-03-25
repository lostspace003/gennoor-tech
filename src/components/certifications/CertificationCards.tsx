'use client'

import { useState } from 'react'
import { Award, Eye, ExternalLink, Download } from 'lucide-react'
import { type Certification } from '@/data/certifications'
import CertificateViewerModal from './CertificateViewerModal'

interface CertificationCardsProps {
  certs: Certification[]
  category: string
  categoryColor: string
}

export default function CertificationCards({ certs, category, categoryColor }: CertificationCardsProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null)

  const openViewer = (cert: Certification) => {
    setSelectedCert(cert)
    setViewerOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {cert.name}
                </h3>
                <p className="text-sm text-primary-600 font-medium">
                  {cert.code}
                </p>
              </div>
              <Award className={`w-8 h-8 text-gradient bg-gradient-to-br ${categoryColor} text-white rounded p-1.5`} />
            </div>

            {cert.description && (
              <p className="text-sm text-gray-600 mb-3">
                {cert.description}
              </p>
            )}

            {cert.skills && cert.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {cert.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {cert.dateEarned && (
              <p className="text-xs text-gray-500 mb-3">
                Earned: {cert.dateEarned}
              </p>
            )}

            <div className="flex items-center gap-3">
              {cert.pdfPath && (
                <button
                  onClick={() => openViewer(cert)}
                  className="inline-flex items-center text-sm text-primary-600 hover:underline font-medium"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Certificate
                </button>
              )}
              {cert.credlyBadge && (
                <a
                  href={cert.credlyBadge}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Credly Badge
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCert && selectedCert.pdfPath && (
        <CertificateViewerModal
          isOpen={viewerOpen}
          onClose={() => { setViewerOpen(false); setSelectedCert(null) }}
          pdfUrl={selectedCert.pdfPath}
          certName={selectedCert.name}
          certCode={selectedCert.code}
        />
      )}
    </>
  )
}
