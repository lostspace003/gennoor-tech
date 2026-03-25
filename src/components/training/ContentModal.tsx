'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, ZoomIn, ZoomOut, Maximize2, Download, Phone } from 'lucide-react'
import EnquiryFormModal from './EnquiryFormModal'
import BookCallModal from './BookCallModal'

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  htmlFile: string
  programType?: 'course' | 'bootcamp'
  docFile?: string
  pdfFile?: string
}

export default function ContentModal({ isOpen, onClose, title, htmlFile, programType = 'course', docFile = '', pdfFile }: ContentModalProps) {
  const [loading, setLoading] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(140)
  const [isFullWidth, setIsFullWidth] = useState(false)
  const [showEnquiry, setShowEnquiry] = useState(false)
  const [showBookCall, setShowBookCall] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
    }
  }, [isOpen, htmlFile])

  useEffect(() => {
    if (!isOpen) {
      setZoomLevel(140)
      setIsFullWidth(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.ctrlKey || e.metaKey) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault()
          handleZoomIn()
        } else if (e.key === '-') {
          e.preventDefault()
          handleZoomOut()
        } else if (e.key === '0') {
          e.preventDefault()
          handleResetZoom()
        }
      }

      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, zoomLevel])

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 230))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50))
  }

  const handleResetZoom = () => {
    setZoomLevel(isFullWidth ? 180 : 140)
  }

  const toggleFullWidth = () => {
    const goingFull = !isFullWidth
    setIsFullWidth(goingFull)
    setZoomLevel(goingFull ? 180 : 140)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`relative z-10 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
            isFullWidth ? 'w-full h-full rounded-none' : 'w-[95vw] max-w-6xl h-[95vh]'
          }`}
        >
          {/* Header with Zoom Controls */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 truncate pr-4">{title}</h2>

            <div className="flex items-center gap-2">
              {/* Download Button - Flashing */}
              <button
                onClick={() => setShowEnquiry(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors animate-pulse hover:animate-none"
                aria-label="Download this content via email"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Download</span>
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white rounded-lg border px-2 py-1" role="group" aria-label="Zoom controls">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" aria-hidden="true" />
                </button>

                <button
                  onClick={handleResetZoom}
                  className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors min-w-[60px]"
                  aria-label={`Current zoom ${zoomLevel}%, click to reset`}
                >
                  {zoomLevel}%
                </button>

                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 230}
                  className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" aria-hidden="true" />
                </button>
              </div>

              {/* Full Width Toggle */}
              <button
                onClick={toggleFullWidth}
                className={`p-2 rounded transition-colors ${isFullWidth ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 text-gray-600'}`}
                aria-label={isFullWidth ? 'Normal width view' : 'Full width view'}
              >
                <Maximize2 className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close content viewer"
              >
                <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Content - iframe renders the HTML with its own styles */}
          <div className="flex-1 min-h-0 overflow-hidden bg-white relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            )}
            <iframe
              src={htmlFile}
              title={title}
              className="w-full h-full border-0"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
                width: `${100 * (100 / zoomLevel)}%`,
                height: `${100 * (100 / zoomLevel)}%`,
              }}
              onLoad={() => setLoading(false)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t flex-shrink-0 bg-gray-50">
            <div className="text-sm text-gray-500 hidden sm:block">
              {zoomLevel !== (isFullWidth ? 180 : 140) ? (
                <>Zoom: {zoomLevel}%</>
              ) : (
                <>Ctrl/Cmd + (+/-/0) for zoom</>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              <button
                onClick={() => setShowBookCall(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors animate-pulse hover:animate-none"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Book an Expert Call</span>
                <span className="sm:hidden">Book Call</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal - triggered by download button */}
      <EnquiryFormModal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        programTitle={title}
        programType={programType}
        docFile={docFile}
        pdfFile={pdfFile}
      />

      {/* Book Expert Call Modal - triggered by footer button */}
      <BookCallModal
        isOpen={showBookCall}
        onClose={() => setShowBookCall(false)}
        programTitle={title}
      />
    </>
  )
}
