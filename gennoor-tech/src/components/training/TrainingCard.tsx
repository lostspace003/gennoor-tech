'use client'

import { useState } from 'react'
import { Clock, Users, BarChart, Eye, Mail, ChevronRight } from 'lucide-react'
import { TrainingProgram } from '@/data/training-programs'
import ContentModal from './ContentModal'
import EnquiryFormModal from './EnquiryFormModal'

interface TrainingCardProps {
  program: TrainingProgram
}

export default function TrainingCard({ program }: TrainingCardProps) {
  const [showContentModal, setShowContentModal] = useState(false)
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-blue-100 text-blue-800'
      case 'advanced':
        return 'bg-purple-100 text-purple-800'
      case 'executive':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Card Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {program.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(program.level)}`}>
              {program.level}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {program.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {program.duration}
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {program.audience}
            </div>
          </div>

          {/* Additional Info Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Technology Badge */}
            {program.technology !== 'Cross-Platform' && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                {program.technology}
              </span>
            )}

            {/* Certification Badge */}
            {program.certification === 'Yes' && (
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                ✓ Certification
              </span>
            )}

            {/* Bootcamp Intensive Badge */}
            {program.category === 'bootcamp' && (
              <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded">
                <BarChart className="w-3 h-3 inline mr-1" />
                Intensive
              </span>
            )}
          </div>

          {/* Highlights */}
          {program.highlights.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
              <div className="flex flex-wrap gap-2">
                {program.highlights.slice(0, 3).map((highlight, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md"
                  >
                    {highlight}
                  </span>
                ))}
                {program.highlights.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    +{program.highlights.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setShowContentModal(true)}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Content
            </button>
            <button
              onClick={() => setShowEnquiryModal(true)}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enquiry
            </button>
          </div>
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