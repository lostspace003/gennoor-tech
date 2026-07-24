'use client'

import { useState } from 'react'
import { Upload, FileText, Download, Trash2, Eye, Send } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'poster' | 'video' | 'template'
  url: string
  size: number
  uploadedAt: string
  leadId?: string
}

export default function DocumentManager({ leadId }: { leadId?: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    if (leadId) formData.append('leadId', leadId)

    try {
      const response = await fetch('/api/admin/documents/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const doc = await response.json()
        setDocuments([...documents, doc])
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const generatePDF = async (type: 'intro' | 'technical' | 'non-technical') => {
    try {
      const response = await fetch('/api/admin/documents/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, leadId })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}-deck.pdf`
        a.click()
      }
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Management</h3>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />
            </label>
            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
          </div>
          {selectedFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">{selectedFile.name}</p>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Generate Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => generatePDF('intro')}
          className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-center"
        >
          <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <span className="text-sm text-gray-700">Generate Intro Deck</span>
        </button>
        <button
          onClick={() => generatePDF('technical')}
          className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-center"
        >
          <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-sm text-gray-700">Technical Deck</span>
        </button>
        <button
          onClick={() => generatePDF('non-technical')}
          className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-center"
        >
          <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <span className="text-sm text-gray-700">Non-Technical Deck</span>
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded yet</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {(doc.size / 1024).toFixed(2)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Send className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}