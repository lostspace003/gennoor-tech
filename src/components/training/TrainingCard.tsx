'use client'

import { useState } from 'react'
import { TrainingProgram } from '@/data/training-programs'
import ContentModal from './ContentModal'
import EnquiryFormModal from './EnquiryFormModal'

/**
 * Bootcamp card in the prototype's program-card idiom: kind badge + cert
 * badge header row, title, meta line, description, topics row above a
 * hairline. The content-viewer and enquiry modals are unchanged.
 */

interface TrainingCardProps {
  program: TrainingProgram
}

export default function TrainingCard({ program }: TrainingCardProps) {
  const [showContentModal, setShowContentModal] = useState(false)
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)

  return (
    <>
      <div className="bg-raised border border-gray-200 hover:border-gray-300 rounded-[18px] px-6 py-[26px] flex flex-col transition-colors">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400">
            Bootcamp
          </span>
          {program.certification === 'Yes' && (
            <span className="text-[11px] font-semibold text-primary-600">
              {program.certCode ?? 'Certification'}
            </span>
          )}
        </div>

        <h3 className="text-[17px] font-bold leading-[1.25] text-gray-900 mb-1.5">{program.title}</h3>
        <div className="text-[12.5px] text-gray-400 mb-2.5">
          {program.duration} · {program.level} · {program.audience}
        </div>
        <p className="text-[13px] leading-normal text-gray-500 mb-3.5 line-clamp-2">
          {program.description}
        </p>

        {program.highlights.length > 0 && (
          <div className="text-xs leading-[1.7] text-gray-500 border-t border-gray-100 pt-3 mt-auto">
            {program.highlights.slice(0, 4).join(' · ')}
          </div>
        )}

        <div className="flex items-center gap-4 mt-3.5">
          <button
            onClick={() => setShowEnquiryModal(true)}
            className="text-[13px] font-semibold text-primary-600 hover:text-primary-500 transition-colors"
          >
            Enquire ›
          </button>
          <button
            onClick={() => setShowContentModal(true)}
            className="text-[12.5px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            View content
          </button>
        </div>
      </div>

      {/* Modals */}
      <ContentModal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        title={program.title}
        htmlFile={program.htmlFile}
        programType={program.category}
        docFile={program.docFile}
        pdfFile={program.pdfFile}
      />

      <EnquiryFormModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        programTitle={program.title}
        programType={program.category}
        docFile={program.docFile}
        pdfFile={program.pdfFile}
      />
    </>
  )
}
