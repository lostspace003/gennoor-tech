'use client'

import { useState } from 'react'
import {
  Filter, Calendar, User, Building2,
  Tag, TrendingUp, Globe, MapPin,
  ChevronDown, X, Check
} from 'lucide-react'

interface FilterOption {
  label: string
  value: string
  count?: number
}

export default function LeadsFilters() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const filterCategories = [
    {
      key: 'status',
      label: 'Status',
      icon: TrendingUp,
      options: [
        { label: 'New', value: 'new', count: 45 },
        { label: 'Contacted', value: 'contacted', count: 32 },
        { label: 'Replied', value: 'replied', count: 18 },
        { label: 'Meeting', value: 'meeting', count: 12 },
        { label: 'Proposal', value: 'proposal', count: 8 },
        { label: 'Won', value: 'won', count: 5 },
        { label: 'Lost', value: 'lost', count: 3 },
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      icon: Tag,
      options: [
        { label: 'Urgent', value: 'urgent', count: 8 },
        { label: 'High', value: 'high', count: 24 },
        { label: 'Medium', value: 'medium', count: 67 },
        { label: 'Low', value: 'low', count: 34 },
      ]
    },
    {
      key: 'assignee',
      label: 'Assigned To',
      icon: User,
      options: [
        { label: 'Jalal Khan', value: 'jalalkhan@gennoor.com', count: 45 },
        { label: 'Yusuf Chaudhary', value: 'yusufchaudhary@gennoor.com', count: 38 },
        { label: 'Admin', value: 'admin@gennoor.com', count: 50 },
        { label: 'Unassigned', value: 'unassigned', count: 33 },
      ]
    },
    {
      key: 'industry',
      label: 'Industry',
      icon: Building2,
      options: [
        { label: 'Technology', value: 'technology', count: 42 },
        { label: 'Healthcare', value: 'healthcare', count: 28 },
        { label: 'Finance', value: 'finance', count: 35 },
        { label: 'Education', value: 'education', count: 22 },
        { label: 'Manufacturing', value: 'manufacturing', count: 18 },
        { label: 'Retail', value: 'retail', count: 21 },
      ]
    },
    {
      key: 'location',
      label: 'Location',
      icon: MapPin,
      options: [
        { label: 'Mumbai', value: 'mumbai', count: 38 },
        { label: 'Delhi NCR', value: 'delhi', count: 42 },
        { label: 'Bangalore', value: 'bangalore', count: 35 },
        { label: 'Hyderabad', value: 'hyderabad', count: 28 },
        { label: 'Pune', value: 'pune', count: 23 },
      ]
    },
    {
      key: 'source',
      label: 'Source',
      icon: Globe,
      options: [
        { label: 'Website', value: 'website', count: 45 },
        { label: 'LinkedIn', value: 'linkedin', count: 38 },
        { label: 'Referral', value: 'referral', count: 28 },
        { label: 'Cold Outreach', value: 'cold', count: 35 },
        { label: 'Event', value: 'event', count: 20 },
      ]
    }
  ]

  const applyFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const removeFilter = (category: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[category]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all flex items-center gap-2 ${
                activeFilterCount > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Apply Filters</h3>
                    <button
                      onClick={() => setShowFilterMenu(false)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  {filterCategories.map(category => {
                    const Icon = category.icon
                    return (
                      <div key={category.key} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Icon className="w-4 h-4 text-gray-400" />
                          {category.label}
                        </div>
                        <div className="space-y-1">
                          {category.options.map(option => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={category.key}
                                checked={activeFilters[category.key] === option.value}
                                onChange={() => applyFilter(category.key, option.value)}
                                className="text-blue-600"
                              />
                              <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                              {option.count && (
                                <span className="text-xs text-gray-400">{option.count}</span>
                              )}
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowFilterMenu(false)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              Hot Leads
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
              Follow-up Today
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              Recently Contacted
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            {Object.entries(activeFilters).map(([category, value]) => {
              const cat = filterCategories.find(c => c.key === category)
              const option = cat?.options.find(o => o.value === value)
              return (
                <div
                  key={category}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 flex items-center gap-2"
                >
                  <span>{cat?.label}: {option?.label}</span>
                  <button
                    onClick={() => removeFilter(category)}
                    className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Date Range Filter */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Date Range:</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            Today
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            This Week
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            This Month
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            Last 3 Months
          </button>
          <button className="px-3 py-1 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            Custom Range
          </button>
        </div>
      </div>
    </div>
  )
}