'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp, Users, Mail, Calendar,
  Target, CheckCircle, Clock, AlertCircle
} from 'lucide-react'

interface StatCard {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: any
  color: string
}

export default function LeadsStats() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      label: 'Total Leads',
      value: '166',
      change: '+12 this week',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Hot Leads',
      value: '24',
      change: '14% of total',
      trend: 'up',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Emails Sent',
      value: '47',
      change: '8 replied',
      trend: 'neutral',
      icon: Mail,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      label: 'Meetings',
      value: '5',
      change: '3 this week',
      trend: 'up',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500'
    }
  ])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                {stat.change && (
                  <p className={`text-xs mt-2 font-medium ${
                    stat.trend === 'up' ? 'text-green-600' :
                    stat.trend === 'down' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}