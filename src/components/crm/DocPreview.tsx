'use client'

import { useEffect, useState } from 'react'
import { X, Download, FileText } from 'lucide-react'
import { Spinner } from './shared'

const OFFICE_EXTS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']

// Popup preview for CRM documents. PDFs, images and text render directly;
// Office files (docx/xlsx/pptx) render through the Microsoft Office web
// viewer via a 10-minute SAS link; anything else gets a download card.
export default function DocPreview({ name, onClose }: { name: string; onClose: () => void }) {
  const fileUrl = `/api/admin/leads/documents/file?name=${encodeURIComponent(name)}`
  const downloadUrl = `${fileUrl}&download=1`
  const ext = (name.split('.').pop() || '').toLowerCase()
  const isPdf = ext === 'pdf'
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
  const isText = ['txt', 'md', 'csv', 'log', 'json'].includes(ext)
  const isOffice = OFFICE_EXTS.includes(ext)

  const [officeUrl, setOfficeUrl] = useState('')
  const [officeError, setOfficeError] = useState('')

  useEffect(() => {
    if (!isOffice) return
    fetch(`${fileUrl}&sas=1`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url) setOfficeUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(d.url)}`)
        else setOfficeError(d.error || 'Could not create preview link')
      })
      .catch(() => setOfficeError('Could not create preview link'))
  }, [isOffice, fileUrl])

  const canInline = isPdf || isImage || isText || isOffice

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400 shrink-0" /> {name}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a href={downloadUrl} className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download
            </a>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-gray-50">
          {isPdf && <iframe src={fileUrl} className="w-full h-full" title={name} />}
          {isImage && (
            <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl} alt={name} className="max-w-full max-h-full object-contain" />
            </div>
          )}
          {isText && <iframe src={fileUrl} className="w-full h-full bg-white" title={name} />}
          {isOffice && (
            officeUrl ? (
              <iframe src={officeUrl} className="w-full h-full" title={name} />
            ) : officeError ? (
              <FallbackCard ext={ext} name={name} downloadUrl={downloadUrl} note={officeError} />
            ) : (
              <div className="h-full flex items-center justify-center"><Spinner label="Preparing Office preview..." /></div>
            )
          )}
          {!canInline && <FallbackCard ext={ext} name={name} downloadUrl={downloadUrl} />}
        </div>
      </div>
    </div>
  )
}

function FallbackCard({ ext, name, downloadUrl, note }: { ext: string; name: string; downloadUrl: string; note?: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-6">
      <FileText className="w-10 h-10 text-gray-300" />
      <p className="text-sm text-gray-500 max-w-sm">{note || `No inline preview for .${ext} files — download to open it in the right app.`}</p>
      <a href={downloadUrl} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center gap-2">
        <Download className="w-4 h-4" /> Download {name.split('/').pop()}
      </a>
    </div>
  )
}
