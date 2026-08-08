'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import { courses as allCourses } from '@/config/courses'

interface ProgressRow {
  chapterId: string
  courseId: string
  completionPercent: number
  completed: boolean
  lastAccessed: string
}

interface LearnerAnalyticsProps {
  progressRows: ProgressRow[]
  statusCounts: { completed: number; inProgress: number; notStarted: number }
}

const WEEKS_SHOWN = 8
const STATUS_COLORS = { completed: '#34c759', inProgress: '#0071e3', notStarted: '#d2d2d7' }

/** Monday 00:00 of the week containing `d`, as a ms timestamp. */
function weekStart(d: Date): number {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  const day = (copy.getDay() + 6) % 7 // Monday = 0
  copy.setDate(copy.getDate() - day)
  return copy.getTime()
}

/**
 * Learning analytics for the dashboard: minutes invested per week
 * (estimated from chapter lengths × progress) and a course-status donut.
 */
export default function LearnerAnalytics({ progressRows, statusCounts }: LearnerAnalyticsProps) {
  // chapterId → estimated minutes, across every interactive course.
  const minutesByChapter = useMemo(() => {
    const map = new Map<string, number>()
    for (const course of allCourses) {
      for (const ch of course.chapters) {
        map.set(`${course.id}:${ch.id}`, ch.estimatedMinutes || 0)
      }
    }
    return map
  }, [])

  const weekly = useMemo(() => {
    const now = new Date()
    const thisWeek = weekStart(now)
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000

    const buckets = new Map<number, number>()
    for (let i = 0; i < WEEKS_SHOWN; i++) buckets.set(thisWeek - i * WEEK_MS, 0)

    for (const row of progressRows) {
      const t = Date.parse(row.lastAccessed)
      if (Number.isNaN(t)) continue
      const wk = weekStart(new Date(t))
      if (!buckets.has(wk)) continue
      const est = minutesByChapter.get(`${row.courseId}:${row.chapterId}`) || 0
      const minutes = Math.round(est * Math.min(100, Math.max(0, row.completionPercent)) / 100)
      buckets.set(wk, (buckets.get(wk) || 0) + minutes)
    }

    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([wk, minutes]) => ({
        week: new Date(wk).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        minutes,
      }))
  }, [progressRows, minutesByChapter])

  const hasActivity = weekly.some(w => w.minutes > 0)
  const totalMinutes = weekly.reduce((s, w) => s + w.minutes, 0)

  const donutData = [
    { name: 'Completed', value: statusCounts.completed, color: STATUS_COLORS.completed },
    { name: 'In progress', value: statusCounts.inProgress, color: STATUS_COLORS.inProgress },
    { name: 'Not started', value: statusCounts.notStarted, color: STATUS_COLORS.notStarted },
  ].filter(d => d.value > 0)
  const totalCourses = statusCounts.completed + statusCounts.inProgress + statusCounts.notStarted

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-stretch">
      {/* Weekly minutes */}
      <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900">Learning activity</h3>
          <span className="text-[12px] text-[#86868b]">last {WEEKS_SHOWN} weeks</span>
        </div>
        <p className="text-[12.5px] text-[#86868b] mb-5">
          Estimated minutes of course content covered per week.
        </p>
        {hasActivity ? (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f2" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: '#86868b' }}
                  axisLine={{ stroke: '#e8e8ed' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#86868b' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#f5f5f7' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e8e8ed',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} min`, 'Learning']}
                />
                <Bar dataKey="minutes" fill="#0071e3" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-center">
            <div>
              <p className="text-[14px] text-[#6e6e73]">No activity in the last {WEEKS_SHOWN} weeks.</p>
              <p className="text-[12.5px] text-[#a1a1a6] mt-1">Open any chapter and this chart comes alive.</p>
            </div>
          </div>
        )}
        {hasActivity && (
          <p className="text-[12px] text-[#a1a1a6] mt-3">
            {totalMinutes} minutes in total across the period.
          </p>
        )}
      </div>

      {/* Course status donut */}
      <div className="bg-white border border-[#e8e8ed] rounded-2xl p-6 flex flex-col">
        <h3 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900 mb-1">Course status</h3>
        <p className="text-[12.5px] text-[#86868b] mb-4">Across {totalCourses} interactive courses.</p>
        <div className="relative h-[170px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData.length > 0 ? donutData : [{ name: 'Not started', value: 1, color: STATUS_COLORS.notStarted }]}
                dataKey="value"
                nameKey="name"
                innerRadius={56}
                outerRadius={78}
                paddingAngle={donutData.length > 1 ? 2 : 0}
                strokeWidth={0}
              >
                {(donutData.length > 0 ? donutData : [{ name: 'Not started', value: 1, color: STATUS_COLORS.notStarted }]).map(d => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              {donutData.length > 0 && (
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e8e8ed',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    fontSize: 12,
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[26px] font-bold tracking-[-0.02em] text-gray-900 leading-none">
              {statusCounts.completed}
            </span>
            <span className="text-[11px] text-[#86868b] mt-1">completed</span>
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          {[
            { label: 'Completed', value: statusCounts.completed, color: STATUS_COLORS.completed },
            { label: 'In progress', value: statusCounts.inProgress, color: STATUS_COLORS.inProgress },
            { label: 'Not started', value: statusCounts.notStarted, color: STATUS_COLORS.notStarted },
          ].map(d => (
            <div key={d.label} className="flex items-center justify-between text-[13px]">
              <span className="inline-flex items-center gap-2 text-[#6e6e73]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.label}
              </span>
              <span className="font-semibold text-gray-900 tabular-nums">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
