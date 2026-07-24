'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Search, Filter, Eye, Mail, Phone,
  Sparkles, Download, Upload, ChevronDown,
  CheckCircle, Star, Building2, MapPin,
  TrendingUp, FileSpreadsheet, Columns3,
  ArrowUpDown, User, Globe, MoreVertical
} from 'lucide-react'

interface Lead {
  id?: string
  Name?: string
  Email?: string
  Phone?: string
  Company?: string
  Designation?: string
  Industry?: string
  Location?: string
  Status?: string
  Priority?: string
  Score?: number
  [key: string]: any
}

export default function CompactLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(25)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockLeads: Lead[] = Array.from({ length: 166 }, (_, i) => ({
      id: `lead-${i + 1}`,
      Name: `Contact ${i + 1}`,
      Email: `contact${i + 1}@company.com`,
      Phone: `+91 98765 ${String(43210 + i).padStart(5, '0')}`,
      Company: `Company ${Math.floor(i / 3) + 1}`,
      Designation: ['CEO', 'CTO', 'Manager', 'Director'][i % 4],
      Industry: ['Technology', 'Healthcare', 'Finance', 'Education'][i % 4],
      Location: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad'][i % 4],
      Status: ['new', 'contacted', 'replied', 'meeting'][i % 4],
      Priority: ['high', 'medium', 'low'][i % 3],
      Score: 50 + (i % 50)
    }))
    setLeads(mockLeads)
    setFilteredLeads(mockLeads)
  }, [])

  // Filter leads
  useEffect(() => {
    let filtered = [...leads]
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        Object.values(lead).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
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

  // Pagination
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredLeads, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-gray-100 text-gray-700',
      contacted: 'bg-blue-100 text-blue-700',
      replied: 'bg-green-100 text-green-700',
      meeting: 'bg-yellow-100 text-yellow-700',
    }
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700'
  }

  const getPriorityIcon = (priority: string) => {
    const icons: Record<string, React.ReactElement> = {
      high: <TrendingUp className="w-3 h-3 text-red-500" />,
      medium: <TrendingUp className="w-3 h-3 text-yellow-500" />,
      low: <TrendingUp className="w-3 h-3 text-gray-400" />
    }
    return icons[priority?.toLowerCase()] || null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Compact Controls Bar */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <select className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500">
            <option>All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Replied</option>
          </select>

          <select className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* Actions */}
          <button className="p-1 hover:bg-gray-50 rounded" title="Upload">
            <Upload className="w-3 h-3 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-50 rounded" title="Download">
            <Download className="w-3 h-3 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-50 rounded" title="Columns">
            <Columns3 className="w-3 h-3 text-gray-600" />
          </button>
        </div>

        {/* Selected Actions */}
        {selectedLeads.length > 0 && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-gray-600">{selectedLeads.length} selected</span>
            <button className="px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700">
              Send Email
            </button>
            <button className="px-2 py-0.5 bg-purple-600 text-white rounded hover:bg-purple-700">
              Research
            </button>
          </div>
        )}
      </div>

      {/* Compact Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-1 text-left">
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
                  className="w-3 h-3 rounded"
                />
              </th>
              <th className="p-1 text-left font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => setSortConfig({ key: 'Name', direction: sortConfig?.direction === 'asc' ? 'desc' : 'asc' })}>
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </div>
              </th>
              <th className="p-1 text-left font-medium text-gray-600">Email</th>
              <th className="p-1 text-left font-medium text-gray-600">Company</th>
              <th className="p-1 text-left font-medium text-gray-600">Status</th>
              <th className="p-1 text-left font-medium text-gray-600">Priority</th>
              <th className="p-1 text-left font-medium text-gray-600">Score</th>
              <th className="p-1 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.map((lead, index) => (
              <tr key={lead.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-1">
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
                    className="w-3 h-3 rounded"
                  />
                </td>
                <td className="p-1">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {lead.Name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{lead.Name}</span>
                  </div>
                </td>
                <td className="p-1 text-gray-600">{lead.Email}</td>
                <td className="p-1">
                  <div>
                    <div className="font-medium text-gray-900">{lead.Company}</div>
                    <div className="text-gray-500">{lead.Designation}</div>
                  </div>
                </td>
                <td className="p-1">
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusColor(lead.Status || '')}`}>
                    {lead.Status}
                  </span>
                </td>
                <td className="p-1">
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(lead.Priority || '')}
                    <span className="text-gray-600">{lead.Priority}</span>
                  </div>
                </td>
                <td className="p-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${i < (lead.Score || 0) / 20 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-1">
                  <div className="flex items-center gap-1">
                    <button className="p-0.5 hover:bg-gray-100 rounded" title="View">
                      <Eye className="w-3 h-3 text-gray-500" />
                    </button>
                    <button className="p-0.5 hover:bg-gray-100 rounded" title="Research">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    </button>
                    <button className="p-0.5 hover:bg-gray-100 rounded" title="Email">
                      <Mail className="w-3 h-3 text-blue-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compact Pagination */}
      <div className="p-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-white rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-2 py-0.5 text-xs rounded ${
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
            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-white rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-white rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}