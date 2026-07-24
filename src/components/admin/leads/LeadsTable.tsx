'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Search, Filter, Eye, Mail, Phone, Globe,
  Sparkles, MoreVertical, Download, Upload,
  ChevronDown, ChevronUp, Settings, X,
  CheckCircle, Clock, AlertTriangle, Star,
  Building2, MapPin, Calendar, Tag,
  TrendingUp, FileSpreadsheet, Columns3,
  ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

interface Lead {
  id?: string
  Name?: string
  Email?: string
  Phone?: string
  Company?: string
  Designation?: string
  Industry?: string
  Location?: string
  Website?: string
  LinkedIn?: string
  Source?: string
  Status?: string
  Priority?: string
  Tags?: string
  Notes?: string
  LastContact?: string
  NextFollowUp?: string
  AssignedTo?: string
  Score?: number
  CompanySize?: string
  Revenue?: string
  [key: string]: any // Allow flexible schema
}

interface ColumnConfig {
  key: string
  label: string
  visible: boolean
  width?: string
  sortable?: boolean
  type?: 'text' | 'email' | 'phone' | 'url' | 'date' | 'badge' | 'score'
}

const defaultColumns: ColumnConfig[] = [
  { key: 'Name', label: 'Name', visible: true, sortable: true },
  { key: 'Email', label: 'Email', visible: true, type: 'email' },
  { key: 'Phone', label: 'Phone', visible: true, type: 'phone' },
  { key: 'Company', label: 'Company', visible: true, sortable: true },
  { key: 'Designation', label: 'Designation', visible: true },
  { key: 'Industry', label: 'Industry', visible: true },
  { key: 'Location', label: 'Location', visible: true },
  { key: 'Status', label: 'Status', visible: true, type: 'badge' },
  { key: 'Priority', label: 'Priority', visible: true, type: 'badge' },
  { key: 'Score', label: 'Score', visible: true, type: 'score', sortable: true },
  { key: 'LastContact', label: 'Last Contact', visible: false, type: 'date' },
  { key: 'AssignedTo', label: 'Assigned To', visible: true },
]

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [loading, setLoading] = useState(true)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [activeSheet, setActiveSheet] = useState('main')
  const [sheets, setSheets] = useState<{ name: string; data: Lead[] }[]>([])

  // Load initial data
  useEffect(() => {
    loadExistingData()
  }, [])

  // Filter and sort leads
  useEffect(() => {
    let filtered = [...leads]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => {
        const searchLower = searchTerm.toLowerCase()
        return Object.values(lead).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      })
    }

    // Sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || ''
        const bVal = b[sortConfig.key] || ''

        if (sortConfig.direction === 'asc') {
          return String(aVal).localeCompare(String(bVal))
        }
        return String(bVal).localeCompare(String(aVal))
      })
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, sortConfig])

  const loadExistingData = async () => {
    try {
      // Load from existing Excel file
      const response = await fetch('/api/admin/leads/load-excel')
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
        if (data.sheets) {
          setSheets(data.sheets)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        // Handle multiple sheets
        const allSheets: { name: string; data: Lead[] }[] = []

        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: 'NA' })

          // Process and normalize data
          const processedData = jsonData.map((row: any, index) => ({
            id: `${sheetName}-${index}`,
            ...row,
            // Ensure essential fields exist
            Name: row.Name || row.name || row.Contact || 'NA',
            Email: row.Email || row.email || row['E-mail'] || 'NA',
            Company: row.Company || row.company || row.Organization || 'NA',
            Status: row.Status || 'new',
            Priority: row.Priority || 'medium',
            Score: row.Score || 50,
          }))

          allSheets.push({
            name: sheetName,
            data: processedData
          })
        })

        // If single sheet, load directly
        if (allSheets.length === 1) {
          setLeads(allSheets[0].data)
          setActiveSheet('main')
        } else {
          // Multiple sheets - show as tabs
          setSheets(allSheets)
          setLeads(allSheets[0].data)
          setActiveSheet(allSheets[0].name)
        }

        // Auto-detect and add new columns
        const firstRow = allSheets[0].data[0]
        if (firstRow) {
          const existingKeys = columns.map(c => c.key)
          const newColumns = Object.keys(firstRow)
            .filter(key => !existingKeys.includes(key) && key !== 'id')
            .map(key => ({
              key,
              label: key.replace(/([A-Z])/g, ' $1').trim(),
              visible: false,
              sortable: true
            }))

          if (newColumns.length > 0) {
            setColumns([...columns, ...newColumns])
          }
        }

      } catch (error) {
        console.error('Error processing file:', error)
      } finally {
        setUploadingFile(false)
      }
    }

    reader.readAsBinaryString(file)
  }

  const handleSort = (key: string) => {
    if (!columns.find(c => c.key === key)?.sortable) return

    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' }
        }
        return null
      }
      return { key, direction: 'asc' }
    })
  }

  const toggleColumn = (key: string) => {
    setColumns(columns.map(col =>
      col.key === key ? { ...col, visible: !col.visible } : col
    ))
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-slate-100 text-slate-700 border-slate-200',
      contacted: 'bg-blue-100 text-blue-700 border-blue-200',
      replied: 'bg-green-100 text-green-700 border-green-200',
      meeting: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      proposal: 'bg-purple-100 text-purple-700 border-purple-200',
      won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      lost: 'bg-red-100 text-red-700 border-red-200',
    }
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const renderCellValue = (lead: Lead, column: ColumnConfig) => {
    const value = lead[column.key]

    if (value === 'NA' || value === null || value === undefined) {
      return <span className="text-gray-400 text-sm">—</span>
    }

    switch (column.type) {
      case 'email':
        return (
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
            {value}
          </a>
        )

      case 'phone':
        return (
          <a href={`tel:${value}`} className="text-gray-700 hover:text-blue-600 text-sm">
            {value}
          </a>
        )

      case 'url':
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Link
          </a>
        )

      case 'date':
        return (
          <span className="text-gray-700 text-sm">
            {value ? format(new Date(value), 'MMM dd, yyyy') : '—'}
          </span>
        )

      case 'badge':
        if (column.key === 'Status') {
          return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(value)}`}>
              {value}
            </span>
          )
        }
        if (column.key === 'Priority') {
          return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(value)}`}>
              {value}
            </span>
          )
        }
        return value

      case 'score':
        const score = parseInt(value) || 0
        return (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < score / 20 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">{score}</span>
          </div>
        )

      default:
        return <span className="text-gray-700 text-sm">{value}</span>
    }
  }

  // Pagination
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredLeads, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading leads data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search across all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Sheet Tabs (if multiple sheets) */}
          {sheets.length > 1 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
              {sheets.map(sheet => (
                <button
                  key={sheet.name}
                  onClick={() => {
                    setActiveSheet(sheet.name)
                    setLeads(sheet.data)
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded transition-all ${
                    activeSheet === sheet.name
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Upload Button */}
            <label className="relative">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploadingFile}
              />
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                  input?.click()
                }}
              >
                <Upload className="w-4 h-4" />
                {uploadingFile ? 'Uploading...' : 'Upload Excel'}
              </button>
            </label>

            {/* Download Button */}
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Column Settings */}
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Columns3 className="w-5 h-5" />

              {showColumnSettings && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-100 p-3 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 text-sm">Visible Columns</h4>
                    <button
                      onClick={() => setShowColumnSettings(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {columns.map(column => (
                      <label
                        key={column.key}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() => toggleColumn(column.key)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{column.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Selected Actions */}
        {selectedLeads.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {selectedLeads.length} selected
            </span>
            <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Send Email
            </button>
            <button className="px-3 py-1 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              Research All
            </button>
            <button className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads(paginatedLeads.map(l => l.id || ''))
                      } else {
                        setSelectedLeads([])
                      }
                    }}
                    className="rounded"
                  />
                </th>
                {columns.filter(col => col.visible).map(column => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && (
                        <span className="text-gray-400">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLeads.map((lead, index) => (
                <tr
                  key={lead.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id || '')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads([...selectedLeads, lead.id || ''])
                        } else {
                          setSelectedLeads(selectedLeads.filter(id => id !== lead.id))
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  {columns.filter(col => col.visible).map(column => (
                    <td key={column.key} className="px-4 py-3">
                      {renderCellValue(lead, column)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="View Details">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="AI Research">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Send Email">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} entries
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}