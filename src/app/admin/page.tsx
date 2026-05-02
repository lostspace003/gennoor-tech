'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  BarChart3, Eye, MessageSquare, Mail, Globe, MapPin,
  Lock, LogOut, RefreshCw, FileText, Users,
  ExternalLink, Settings, CheckCircle2, XCircle, Search,
  Shield, Activity, Database, Server, Code2, Link2,
  AlertTriangle, Newspaper, Download, HardDrive, Bot,
  Clock, Zap, BookOpen, TrendingUp, Send, Calendar,
  Video, CheckCircle, Phone, X,
} from 'lucide-react'

// ─── Chart Components (Recharts, lazy loaded) ────────────────

const BarChartComponent = dynamic(() => import('recharts').then(m => {
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = m
  return { default: ({ data, dataKey, color }: any) => (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Bar dataKey={dataKey || 'value'} fill={color || '#2563eb'} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )}
}), { ssr: false, loading: () => <ChartLoader /> })

const AreaChartComponent = dynamic(() => import('recharts').then(m => {
  const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = m
  return { default: ({ data, dataKey, color }: any) => (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Area type="monotone" dataKey={dataKey || 'value'} stroke={color || '#2563eb'} fill={color || '#2563eb'} fillOpacity={0.15} />
      </AreaChart>
    </ResponsiveContainer>
  )}
}), { ssr: false, loading: () => <ChartLoader /> })

const PieChartComponent = dynamic(() => import('recharts').then(m => {
  const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = m
  const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
  return { default: ({ data }: any) => (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
          {data.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
      </PieChart>
    </ResponsiveContainer>
  )}
}), { ssr: false, loading: () => <ChartLoader /> })

function ChartLoader() {
  return <div className="h-[280px] bg-slate-50 rounded-lg animate-pulse flex items-center justify-center"><span className="text-slate-400 text-sm">Loading chart...</span></div>
}

// ─── Types ───────────────────────────────────────────────────

type TabKey = 'overview' | 'traffic' | 'enquiries' | 'emails' | 'sessions' | 'bookings' | 'storage' | 'insights' | 'comments' | 'seo' | 'setup'

interface AnalyticsData {
  totalViews: number; totalComments: number; totalEnquiries: number; activeComments: number
  viewsByDate: Record<string, number>; topPages: [string, number][]; topCountries: [string, number][]
  topCities: [string, number][]; topReferrers: [string, number][]; enquiryByType: Record<string, number>
  recentEnquiries: Array<{ type: string; name: string; email: string; createdAt: string; course: string }>
  recentComments: Array<{ rowKey: string; slug: string; authorName: string; authorEmail: string; content: string; status: string; createdAt: string }>
}
interface SetupCheck { label: string; description: string; configured: boolean; value?: string }
interface SetupData { environment: string; platform: string; totalChecks: number; configuredCount: number; checks: Record<string, SetupCheck> }
interface SeoCheckItem { label: string; description: string; status: 'pass' | 'fail' | 'warning' | 'manual'; action: string; link?: string }
interface SeoData { sitemapUrls: number; pagesUp: number; totalKeyPages: number; totalBlogPosts: number; blogCategories: string[]; latestPost: { title: string; slug: string; date: string } | null; ga4Configured: boolean; ga4Id: string; pageChecks: Array<{ path: string; label: string; status: number; ok: boolean }>; checklist: Array<{ category: string; items: SeoCheckItem[] }> }
interface SessionRecord { rowKey: string; agentId: string; agentName: string; status: string; resumeFileName: string; updatedAt: string }
interface ContainerStats { name: string; blobCount: number; totalSizeBytes: number; lastModified: string }
interface BlobInfo { name: string; containerName: string; size: number; contentType: string; lastModified: string }
interface StorageData { containers: ContainerStats[]; recentBlobs: BlobInfo[] }
interface BookingAppointment { rowKey: string; name: string; email: string; whatsapp?: string; topic?: string; serviceName: string; serviceId: string; date: string; startTime: string; endTime: string; timezone: string; country?: string; status: string; createdAt: string; graphAppointmentId?: string; joinWebUrl?: string; adminMessage?: string; acceptedAt?: string; rejectedAt?: string; changeRequestedAt?: string }

// ─── Helpers ─────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(','), ...data.map(row => headers.map(h => { const val = String(row[h] ?? ''); return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val }).join(','))]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click(); URL.revokeObjectURL(url)
}

function extractMetricValue(data: any): number {
  try { const val = data?.value; if (typeof val === 'number') return val; const keys = Object.keys(val || {}); if (keys.length > 0) { const inner = val[keys[0]]; const innerKeys = Object.keys(inner || {}); if (innerKeys.length > 0) return inner[innerKeys[0]] || 0 }; return 0 } catch { return 0 }
}
function extractQueryRows(data: any): Array<{ name: string; value: number }> {
  try { const table = data?.tables?.[0]; if (!table) return []; return table.rows.map((row: any[]) => ({ name: String(row[0] || ''), value: Number(row[1] || 0) })) } catch { return [] }
}
function extractTimeSeriesRows(data: any): Array<{ name: string; value: number }> {
  try { const table = data?.tables?.[0]; if (!table) return []; return table.rows.map((row: any[]) => { const d = new Date(row[0]); return { name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: Number(row[1] || 0) } }) } catch { return [] }
}

const ICON_MAP: Record<string, any> = { adminSecret: Shield, ga4MeasurementId: BarChart3, sitemap: Search, azureStorage: Database, appInsights: Activity, smtp: Mail, azureOpenAI: Code2, siteUrl: Globe, blobUrl: Link2 }

// ─── Main Component ──────────────────────────────────────────

export default function AdminDashboard() {
  const [secret, setSecret] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [storedSecret, setStoredSecret] = useState('')
  const [days, setDays] = useState(7)
  const [activeFilter, setActiveFilter] = useState<string>('7')
  const [customDate, setCustomDate] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [emailLogs, setEmailLogs] = useState<{ logs: Array<Record<string, any>>; totalSent: number; totalFailed: number; uniqueRecipients: number; total: number } | null>(null)
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [seoData, setSeoData] = useState<SeoData | null>(null)
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [storageData, setStorageData] = useState<StorageData | null>(null)
  const [insightsData, setInsightsData] = useState<any>(null)
  const [bookingsData, setBookingsData] = useState<BookingAppointment[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsAction, setBookingsAction] = useState<string | null>(null)
  const [bookingMessage, setBookingMessage] = useState<Record<string, string>>({})
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)
  const [rescheduleData, setRescheduleData] = useState<Record<string, { date: string; startTime: string; endTime: string }>>({})
  const [expandedAction, setExpandedAction] = useState<Record<string, 'reject' | 'reschedule' | null>>({})

  const fetchAll = useCallback(async (adminSecret: string, numDays: number) => {
    setLoading(true); setError('')
    const ts = numDays <= 1 ? 'PT24H' : numDays <= 2 ? 'P2D' : numDays <= 7 ? 'P7D' : numDays <= 14 ? 'P14D' : `P${numDays}D`
    try {
      const headers = { 'Content-Type': 'application/json' }
      const body = (extra: any = {}) => JSON.stringify({ secret: adminSecret, ...extra })
      const [analyticsRes, setupRes, seoRes, sessionsRes, storageRes, insightsRes, emailLogsRes] = await Promise.all([
        fetch('/api/admin/analytics', { method: 'POST', headers, body: body({ days: numDays }) }),
        fetch('/api/admin/setup-status', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/seo-health', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/sessions', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/storage', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/insights', { method: 'POST', headers, body: body({ metric: 'all', timespan: ts }) }),
        fetch('/api/admin/email-logs', { method: 'POST', headers, body: body({ days: numDays }) }),
      ])
      if (analyticsRes.status === 401) { setError('Invalid admin secret'); setAuthenticated(false); return }
      const [analyticsData, setupResult, seoResult, sessionsResult, storageResult, insightsResult, emailLogsResult] = await Promise.all([
        analyticsRes.ok ? analyticsRes.json() : null, setupRes.ok ? setupRes.json() : null, seoRes.ok ? seoRes.json() : null,
        sessionsRes.ok ? sessionsRes.json() : [], storageRes.ok ? storageRes.json() : null, insightsRes.ok ? insightsRes.json() : null,
        emailLogsRes.ok ? emailLogsRes.json() : null,
      ])
      setData(analyticsData); setSetupData(setupResult); setSeoData(seoResult)
      setSessions(Array.isArray(sessionsResult) ? sessionsResult : []); setStorageData(storageResult); setInsightsData(insightsResult); setEmailLogs(emailLogsResult)
      setAuthenticated(true); setStoredSecret(adminSecret); setLastUpdated(new Date())
      // Fetch bookings separately (no admin secret needed, uses Graph API)
      try { const bRes = await fetch('/api/bookings/appointments'); if (bRes.ok) { const bData = await bRes.json(); setBookingsData(bData.appointments || []) } } catch {}
    } catch { setError('Failed to load dashboard data') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (!autoRefresh || !authenticated) return
    const interval = setInterval(() => fetchAll(storedSecret, days), 60000)
    return () => clearInterval(interval)
  }, [autoRefresh, authenticated, storedSecret, days, fetchAll])

  function handleLogin(e: React.FormEvent) { e.preventDefault(); fetchAll(secret, days) }
  function handleRefresh() { fetchAll(storedSecret, days) }
  function handleDaysChange(d: number, filter: string) { setDays(d); setActiveFilter(filter); fetchAll(storedSecret, d) }
  function handleCustomDate(dateStr: string) {
    setCustomDate(dateStr)
    if (!dateStr) return
    const selected = new Date(dateStr + 'T00:00:00')
    const now = new Date()
    const diffDays = Math.max(1, Math.ceil((now.getTime() - selected.getTime()) / (1000 * 60 * 60 * 24)))
    setDays(diffDays); setActiveFilter('custom'); fetchAll(storedSecret, diffDays)
  }
  function getFilterLabel(): string {
    if (activeFilter === 'today') return 'Today'
    if (activeFilter === 'yesterday') return 'Yesterday'
    if (activeFilter === 'custom' && customDate) return `Since ${new Date(customDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    return `Last ${days} days`
  }
  function handleLogout() { setAuthenticated(false); setData(null); setSetupData(null); setSeoData(null); setSessions([]); setStorageData(null); setInsightsData(null); setEmailLogs(null); setBookingsData([]); setSecret(''); setStoredSecret('') }

  async function handleBookingAction(rowKey: string, action: 'accept' | 'reject' | 'suggest-change' | 'cancel' | 'reschedule', message?: string) {
    setBookingsAction(rowKey)
    try {
      const payload: Record<string, any> = { rowKey, action, message }
      if (action === 'reschedule' && rescheduleData[rowKey]) {
        payload.newDate = rescheduleData[rowKey].date
        payload.newStartTime = rescheduleData[rowKey].startTime
        payload.newEndTime = rescheduleData[rowKey].endTime
      }
      const res = await fetch('/api/bookings/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const bRes = await fetch('/api/bookings/appointments')
        if (bRes.ok) { const bData = await bRes.json(); setBookingsData(bData.appointments || []) }
      }
    } catch {} finally { setBookingsAction(null); setExpandedBooking(null); setBookingMessage({}); setRescheduleData({}); setExpandedAction({}) }
  }

  async function hideComment(slug: string, rowKey: string) {
    try { const res = await fetch('/api/blog-comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, rowKey, adminSecret: storedSecret }) }); if (res.ok) handleRefresh() } catch {}
  }

  // ─── Login Screen ─────────────────────────────────────────

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Gennoor Admin</h1>
                <p className="text-sm text-slate-500">Dashboard &amp; Analytics</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Secret</label>
                <input type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="Enter your admin secret" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              </div>
              {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md">
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</> : <><BarChart3 className="w-4 h-4" /> View Dashboard</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  // ─── Derived Data ─────────────────────────────────────────

  const sortedDates = Object.entries(data.viewsByDate).sort((a, b) => a[0].localeCompare(b[0]))
  const chartDates = sortedDates.map(([date, count]) => ({ name: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: count }))
  const completedSessions = sessions.filter(s => s.status === 'completed' || s.status === 'Completed').length
  const pendingSessions = sessions.filter(s => s.status === 'pending' || s.status === 'submitted').length
  const errorSessions = sessions.filter(s => s.status === 'error' || s.status === 'failed').length
  const totalFiles = storageData?.containers.reduce((a, c) => a + c.blobCount, 0) || 0
  const totalSize = storageData?.containers.reduce((a, c) => a + c.totalSizeBytes, 0) || 0
  const serverRequests = insightsData ? extractMetricValue(insightsData.requests) : 0
  const avgResponseTime = insightsData ? Math.round(extractMetricValue(insightsData.responseTime)) : 0
  const failedRequests = insightsData ? extractMetricValue(insightsData.failed) : 0
  const availability = insightsData ? extractMetricValue(insightsData.availability) : 0

  const tabs: { key: TabKey; label: string; icon: any; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'traffic', label: 'Traffic', icon: TrendingUp },
    { key: 'enquiries', label: 'Enquiries', icon: Mail },
    { key: 'emails', label: 'Emails', icon: Send, badge: emailLogs?.totalFailed || undefined },
    { key: 'sessions', label: 'Sessions', icon: Bot },
    { key: 'bookings', label: 'Bookings', icon: Calendar, badge: bookingsData.filter(b => b.status === 'pending').length || undefined },
    { key: 'storage', label: 'Storage', icon: HardDrive },
    { key: 'insights', label: 'Insights', icon: Activity },
    { key: 'comments', label: 'Comments', icon: MessageSquare },
    { key: 'seo', label: 'SEO', icon: Search },
    { key: 'setup', label: 'Setup', icon: Settings, badge: setupData ? setupData.totalChecks - setupData.configuredCount : undefined },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Gennoor Admin</h1>
              <p className="text-xs text-slate-500">
                {setupData?.platform || 'Dashboard'} &middot; {setupData?.environment || ''}
                {lastUpdated && <> &middot; Updated {lastUpdated.toLocaleTimeString()}</>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {[
                { label: 'Today', days: 0, key: 'today' },
                { label: 'Yesterday', days: 1, key: 'yesterday' },
                { label: '7d', days: 7, key: '7' },
                { label: '14d', days: 14, key: '14' },
                { label: '30d', days: 30, key: '30' },
              ].map(f => (
                <button key={f.key} onClick={() => handleDaysChange(f.days, f.key)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeFilter === f.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{f.label}</button>
              ))}
            </div>
            <div className="relative">
              <input type="date" value={customDate} onChange={e => handleCustomDate(e.target.value)} max={new Date().toISOString().slice(0, 10)} className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors w-[130px] ${activeFilter === 'custom' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`} title="Custom date: show data from this date to today" />
            </div>
            <button onClick={() => setAutoRefresh(!autoRefresh)} className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${autoRefresh ? 'bg-teal-100 text-teal-700' : 'text-slate-400 hover:text-slate-600'}`} title={autoRefresh ? 'Auto-refresh ON (60s)' : 'Auto-refresh OFF'}>
              <Clock className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleRefresh} disabled={loading} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-6 overflow-x-auto border border-slate-200 shadow-sm">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && <span className="ml-0.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Eye} label="Page Views" value={data.totalViews} color="blue" />
              <StatCard icon={Mail} label="Enquiries" value={data.totalEnquiries} color="amber" />
              <StatCard icon={Bot} label="Career Sessions" value={sessions.length} color="teal" />
              <StatCard icon={HardDrive} label="Storage Files" value={totalFiles} color="purple" />
            </div>
            {insightsData && !insightsData.error && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Server} label="Server Requests" value={Math.round(serverRequests)} color="blue" />
                <StatCard icon={Zap} label="Avg Response (ms)" value={avgResponseTime} color="teal" />
                <StatCard icon={AlertTriangle} label="Failed Requests" value={Math.round(failedRequests)} color="amber" />
                <StatCard icon={Activity} label="Availability %" value={Math.round(availability * 100) / 100} color="purple" />
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Daily Page Views" subtitle={getFilterLabel()}>
                {chartDates.length === 0 ? <Empty /> : <AreaChartComponent data={chartDates} color="#2563eb" />}
              </Panel>
              <Panel title="Enquiry Breakdown">
                {Object.keys(data.enquiryByType).length === 0 ? <Empty /> : <PieChartComponent data={Object.entries(data.enquiryByType).map(([name, value]) => ({ name: name.replace(/-/g, ' '), value }))} />}
              </Panel>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Top Pages">
                {data.topPages.length === 0 ? <Empty /> : <BarChartComponent data={data.topPages.slice(0, 10).map(([name, value]) => ({ name: name.length > 30 ? name.slice(0, 30) + '...' : name, value }))} />}
              </Panel>
              <Panel title="Top Referrers">
                {data.topReferrers.length === 0 ? <Empty /> : <BarChartComponent data={data.topReferrers.map(([name, value]) => ({ name, value }))} color="#0d9488" />}
              </Panel>
            </div>
          </div>
        )}

        {/* ─── TRAFFIC ───────────────────────────────────── */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Eye} label="Page Views" value={data.totalViews} color="blue" />
              <StatCard icon={Users} label="Countries" value={data.topCountries.length} color="teal" />
              <StatCard icon={MapPin} label="Cities" value={data.topCities.length} color="amber" />
              <StatCard icon={ExternalLink} label="Referrers" value={data.topReferrers.length} color="purple" />
            </div>
            <Panel title="Traffic Trend" subtitle={getFilterLabel()}>
              {chartDates.length === 0 ? <Empty /> : <AreaChartComponent data={chartDates} color="#2563eb" />}
            </Panel>
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Top Countries">{data.topCountries.length === 0 ? <Empty /> : <BarChartComponent data={data.topCountries.map(([name, value]) => ({ name, value }))} color="#0d9488" />}</Panel>
              <Panel title="Top Cities">{data.topCities.length === 0 ? <Empty /> : <BarChartComponent data={data.topCities.map(([name, value]) => ({ name, value }))} color="#f59e0b" />}</Panel>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Top Pages"><RankedList items={data.topPages} /></Panel>
              <Panel title="Traffic Sources">{data.topReferrers.length === 0 ? <Empty /> : <PieChartComponent data={data.topReferrers.map(([name, value]) => ({ name, value }))} />}</Panel>
            </div>
          </div>
        )}

        {/* ─── ENQUIRIES ─────────────────────────────────── */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Mail} label="Total Enquiries" value={data.totalEnquiries} color="blue" />
              <StatCard icon={BookOpen} label="Training" value={data.enquiryByType['TrainingEnquiry'] || data.enquiryByType['training'] || 0} color="teal" />
              <StatCard icon={FileText} label="Certification" value={data.enquiryByType['CertificationEnquiry'] || data.enquiryByType['certification'] || 0} color="amber" />
              <StatCard icon={Users} label="Expert Calls" value={data.enquiryByType['ExpertCallBooking'] || data.enquiryByType['expert-call'] || 0} color="purple" />
              <StatCard icon={Users} label="Cowork Registrations" value={data.enquiryByType['ClaudeCoworkRegistration'] || 0} color="blue" />
            </div>
            <Panel title="Enquiry Breakdown">
              {Object.keys(data.enquiryByType).length === 0 ? <Empty /> : <PieChartComponent data={Object.entries(data.enquiryByType).map(([name, value]) => ({ name: name.replace(/-/g, ' '), value }))} />}
            </Panel>
            <Panel title="Recent Enquiries" action={data.recentEnquiries.length > 0 ? <ExportButton onClick={() => downloadCSV(data.recentEnquiries as any, 'enquiries')} /> : undefined}>
              {data.recentEnquiries.length === 0 ? <Empty text="No enquiries yet" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-3 font-medium">Type</th><th className="text-left py-2 px-3 font-medium">Name</th><th className="text-left py-2 px-3 font-medium">Email</th><th className="text-left py-2 px-3 font-medium">Course</th><th className="text-left py-2 px-3 font-medium">Date</th></tr></thead>
                <tbody>{data.recentEnquiries.map((e, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50"><td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize">{e.type}</span></td><td className="py-2.5 px-3 text-slate-800">{e.name || (e as any).fullName}</td><td className="py-2.5 px-3 text-slate-600">{e.email}</td><td className="py-2.5 px-3 text-slate-500 max-w-[200px] truncate">{e.course || (e as any).company || '-'}</td><td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{new Date(e.createdAt).toLocaleDateString()}</td></tr>
                ))}</tbody></table></div>
              )}
            </Panel>
          </div>
        )}

        {/* ─── EMAILS ────────────────────────────────────── */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Send} label="Total Sent" value={emailLogs?.totalSent || 0} color="teal" />
              <StatCard icon={XCircle} label="Failed" value={emailLogs?.totalFailed || 0} color="purple" />
              <StatCard icon={Users} label="Unique Recipients" value={emailLogs?.uniqueRecipients || 0} color="blue" />
              <StatCard icon={Mail} label="Total Emails" value={emailLogs?.total || 0} color="amber" />
            </div>
            <Panel title="Email Send Log" action={emailLogs && emailLogs.logs.length > 0 ? <ExportButton onClick={() => downloadCSV(emailLogs.logs as any, 'email-logs')} /> : undefined}>
              {!emailLogs || emailLogs.logs.length === 0 ? <Empty text="No emails sent yet" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-3 font-medium">Status</th><th className="text-left py-2 px-3 font-medium">To</th><th className="text-left py-2 px-3 font-medium">From</th><th className="text-left py-2 px-3 font-medium">Subject</th><th className="text-left py-2 px-3 font-medium">Date</th></tr></thead>
                <tbody>{emailLogs.logs.map((log, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50">
                    <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.status}</span></td>
                    <td className="py-2.5 px-3 text-slate-800">{log.to}</td>
                    <td className="py-2.5 px-3 text-slate-500">{log.from}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[250px] truncate">{log.subject}</td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}</tbody></table></div>
              )}
            </Panel>
          </div>
        )}

        {/* ─── CAREER SESSIONS ───────────────────────────── */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Bot} label="Total Sessions" value={sessions.length} color="blue" />
              <StatCard icon={CheckCircle2} label="Completed" value={completedSessions} color="teal" />
              <StatCard icon={Clock} label="Pending" value={pendingSessions} color="amber" />
              <StatCard icon={AlertTriangle} label="Errors" value={errorSessions} color="purple" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Sessions by Agent">{sessions.length === 0 ? <Empty /> : <PieChartComponent data={Object.entries(sessions.reduce((acc: any, s) => { acc[s.agentName || 'Unknown'] = (acc[s.agentName || 'Unknown'] || 0) + 1; return acc }, {})).map(([name, value]) => ({ name, value: value as number }))} />}</Panel>
              <Panel title="Session Status">{sessions.length === 0 ? <Empty /> : <PieChartComponent data={Object.entries(sessions.reduce((acc: any, s) => { acc[s.status || 'unknown'] = (acc[s.status || 'unknown'] || 0) + 1; return acc }, {})).map(([name, value]) => ({ name, value: value as number }))} />}</Panel>
            </div>
            <Panel title="Recent Sessions" action={sessions.length > 0 ? <ExportButton onClick={() => downloadCSV(sessions as any, 'career-sessions')} /> : undefined}>
              {sessions.length === 0 ? <Empty text="No career sessions yet" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-3 font-medium">Agent</th><th className="text-left py-2 px-3 font-medium">Status</th><th className="text-left py-2 px-3 font-medium">Resume</th><th className="text-left py-2 px-3 font-medium">Date</th></tr></thead>
                <tbody>{sessions.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).slice(0, 20).map((s, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50"><td className="py-2.5 px-3 text-slate-800">{s.agentName || s.agentId}</td><td className="py-2.5 px-3"><StatusBadge status={s.status} /></td><td className="py-2.5 px-3 text-slate-500 truncate max-w-[200px]">{s.resumeFileName || '-'}</td><td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : '-'}</td></tr>
                ))}</tbody></table></div>
              )}
            </Panel>
          </div>
        )}

        {/* ─── BOOKINGS ──────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Clock} label="Pending" value={bookingsData.filter(b => b.status === 'pending').length} color="amber" />
              <StatCard icon={CheckCircle} label="Accepted" value={bookingsData.filter(b => b.status === 'accepted').length} color="teal" />
              <StatCard icon={XCircle} label="Rejected" value={bookingsData.filter(b => b.status === 'rejected').length} color="purple" />
              <StatCard icon={AlertTriangle} label="Change Requested" value={bookingsData.filter(b => b.status === 'change-requested').length} color="blue" />
            </div>
            <Panel title="Booking Requests" subtitle="Review and manage pending bookings" action={
              <button onClick={async () => { setBookingsLoading(true); try { const r = await fetch('/api/bookings/appointments'); if (r.ok) { const d = await r.json(); setBookingsData(d.appointments || []) } } catch {} finally { setBookingsLoading(false) } }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${bookingsLoading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            }>
              {bookingsData.length === 0 ? <Empty text="No bookings yet" /> : (
                <div className="space-y-3">
                  {bookingsData.map(apt => {
                    const bookingDate = apt.date ? new Date(apt.date + 'T00:00:00') : null
                    const isPast = bookingDate ? bookingDate < new Date() : false
                    const statusColor = apt.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : apt.status === 'rejected' ? 'bg-red-100 text-red-700' : apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : apt.status === 'change-requested' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    const isExpanded = expandedBooking === apt.rowKey

                    return (
                      <div key={apt.rowKey} className={`border rounded-xl p-4 shadow-sm ${isPast && apt.status !== 'pending' ? 'bg-slate-50 border-slate-200 opacity-75' : apt.status === 'pending' ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-shrink-0 w-16 text-center">
                            {bookingDate && (
                              <>
                                <div className="text-xs text-slate-500 uppercase">{bookingDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                                <div className="text-2xl font-bold text-slate-800">{bookingDate.getDate()}</div>
                                <div className="text-xs text-slate-500">{bookingDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              </>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-sm font-semibold text-slate-800">{apt.serviceName}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor}`}>{apt.status}</span>
                              {isPast && apt.status !== 'pending' && <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">Past</span>}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-medium">{apt.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`mailto:${apt.email}`} className="text-blue-600 hover:underline truncate">{apt.email}</a>
                              </div>
                              {apt.whatsapp && (
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <a href={`https://wa.me/${apt.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{apt.whatsapp}</a>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{apt.startTime}{apt.endTime && apt.endTime !== apt.startTime ? ` – ${apt.endTime}` : ''} UTC</span>
                              </div>
                              {apt.country && (
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{apt.country}</span>
                                </div>
                              )}
                              {apt.timezone && apt.timezone !== 'UTC' && (
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{apt.timezone}</span>
                                </div>
                              )}
                            </div>

                            {apt.topic && (
                              <div className="mt-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                                <span className="font-medium text-slate-700">Topic:</span> {apt.topic}
                              </div>
                            )}

                            {apt.adminMessage && apt.status !== 'pending' && (
                              <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700 border border-blue-100">
                                <span className="font-medium">Admin note:</span> {apt.adminMessage}
                              </div>
                            )}

                            {/* Expanded panel for reject/suggest-change */}
                            {isExpanded && expandedAction[apt.rowKey] === 'reject' && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <textarea
                                  value={bookingMessage[apt.rowKey] || ''}
                                  onChange={e => setBookingMessage(prev => ({ ...prev, [apt.rowKey]: e.target.value }))}
                                  placeholder="Optional message to customer..."
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                  rows={2}
                                />
                                <div className="flex gap-2 mt-2">
                                  {apt.status === 'pending' && (
                                    <button onClick={() => handleBookingAction(apt.rowKey, 'reject', bookingMessage[apt.rowKey])} disabled={bookingsAction === apt.rowKey} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
                                      {bookingsAction === apt.rowKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Confirm Reject
                                    </button>
                                  )}
                                  {apt.status === 'pending' && (
                                    <button onClick={() => handleBookingAction(apt.rowKey, 'suggest-change', bookingMessage[apt.rowKey])} disabled={bookingsAction === apt.rowKey} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
                                      {bookingsAction === apt.rowKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Suggest Change
                                    </button>
                                  )}
                                  {apt.status === 'accepted' && (
                                    <button onClick={() => handleBookingAction(apt.rowKey, 'cancel', bookingMessage[apt.rowKey])} disabled={bookingsAction === apt.rowKey} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
                                      {bookingsAction === apt.rowKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Confirm Cancel
                                    </button>
                                  )}
                                  <button onClick={() => { setExpandedBooking(null); setExpandedAction({}) }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors">
                                    Back
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Expanded panel for reschedule */}
                            {isExpanded && expandedAction[apt.rowKey] === 'reschedule' && (
                              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  <div>
                                    <label className="block text-xs text-slate-500 mb-1">New Date</label>
                                    <input type="date" value={rescheduleData[apt.rowKey]?.date || ''} onChange={e => setRescheduleData(prev => ({ ...prev, [apt.rowKey]: { ...prev[apt.rowKey], date: e.target.value } }))} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-slate-500 mb-1">Start (UTC)</label>
                                    <input type="time" value={rescheduleData[apt.rowKey]?.startTime || ''} onChange={e => setRescheduleData(prev => ({ ...prev, [apt.rowKey]: { ...prev[apt.rowKey], startTime: e.target.value } }))} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-slate-500 mb-1">End (UTC)</label>
                                    <input type="time" value={rescheduleData[apt.rowKey]?.endTime || ''} onChange={e => setRescheduleData(prev => ({ ...prev, [apt.rowKey]: { ...prev[apt.rowKey], endTime: e.target.value } }))} className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                </div>
                                <textarea
                                  value={bookingMessage[apt.rowKey] || ''}
                                  onChange={e => setBookingMessage(prev => ({ ...prev, [apt.rowKey]: e.target.value }))}
                                  placeholder="Optional note to customer..."
                                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                  rows={2}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button onClick={() => handleBookingAction(apt.rowKey, 'reschedule', bookingMessage[apt.rowKey])} disabled={bookingsAction === apt.rowKey || !rescheduleData[apt.rowKey]?.date || !rescheduleData[apt.rowKey]?.startTime} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50">
                                    {bookingsAction === apt.rowKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />} Confirm Reschedule
                                  </button>
                                  <button onClick={() => { setExpandedBooking(null); setExpandedAction({}) }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors">
                                    Back
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                            {apt.joinWebUrl && (
                              <a href={apt.joinWebUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <Video className="w-3.5 h-3.5" /> Join Teams
                              </a>
                            )}
                            {/* Pending: Accept, Reject/Change, Reschedule */}
                            {apt.status === 'pending' && (
                              <>
                                <button onClick={() => handleBookingAction(apt.rowKey, 'accept')} disabled={bookingsAction === apt.rowKey} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors disabled:opacity-50">
                                  {bookingsAction === apt.rowKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Accept
                                </button>
                                <button onClick={() => { setExpandedBooking(apt.rowKey); setExpandedAction({ [apt.rowKey]: 'reject' }) }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                                  <XCircle className="w-3.5 h-3.5" /> Reject / Change
                                </button>
                                <button onClick={() => { setExpandedBooking(apt.rowKey); setExpandedAction({ [apt.rowKey]: 'reschedule' }); setRescheduleData(prev => ({ ...prev, [apt.rowKey]: { date: apt.date, startTime: apt.startTime, endTime: apt.endTime } })) }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors">
                                  <Clock className="w-3.5 h-3.5" /> Reschedule
                                </button>
                              </>
                            )}
                            {/* Accepted: Reschedule, Cancel */}
                            {apt.status === 'accepted' && (
                              <>
                                <button onClick={() => { setExpandedBooking(apt.rowKey); setExpandedAction({ [apt.rowKey]: 'reschedule' }); setRescheduleData(prev => ({ ...prev, [apt.rowKey]: { date: apt.date, startTime: apt.startTime, endTime: apt.endTime } })) }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors">
                                  <Clock className="w-3.5 h-3.5" /> Reschedule
                                </button>
                                <button onClick={() => { setExpandedBooking(apt.rowKey); setExpandedAction({ [apt.rowKey]: 'reject' }) }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                                  <XCircle className="w-3.5 h-3.5" /> Cancel
                                </button>
                              </>
                            )}
                            <a href={`mailto:${apt.email}?subject=Re: ${apt.serviceName} Booking&body=Hi ${apt.name},%0A%0A`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                              <Mail className="w-3.5 h-3.5" /> Reply
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Panel>
          </div>
        )}

        {/* ─── STORAGE ───────────────────────────────────── */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={HardDrive} label="Total Files" value={totalFiles} color="blue" />
              <StatCard icon={Database} label="Total Size" value={0} color="teal" subtitle={formatBytes(totalSize)} />
              <StatCard icon={Server} label="Containers" value={storageData?.containers.length || 0} color="amber" />
              <StatCard icon={FileText} label="Recent Uploads" value={storageData?.recentBlobs.length || 0} color="purple" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Storage by Container (KB)">{!storageData?.containers.length ? <Empty /> : <BarChartComponent data={storageData.containers.map(c => ({ name: c.name, value: Math.round(c.totalSizeBytes / 1024) }))} />}</Panel>
              <Panel title="Files by Container">{!storageData?.containers.length ? <Empty /> : <PieChartComponent data={storageData.containers.map(c => ({ name: c.name, value: c.blobCount }))} />}</Panel>
            </div>
            <Panel title="Recent Files" action={storageData?.recentBlobs?.length ? <ExportButton onClick={() => downloadCSV(storageData.recentBlobs as any, 'storage-files')} /> : undefined}>
              {!storageData?.recentBlobs?.length ? <Empty text="No files found" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-3 font-medium">File</th><th className="text-left py-2 px-3 font-medium">Container</th><th className="text-left py-2 px-3 font-medium">Size</th><th className="text-left py-2 px-3 font-medium">Modified</th></tr></thead>
                <tbody>{storageData.recentBlobs.map((b, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50"><td className="py-2.5 px-3 text-slate-800 truncate max-w-[250px]">{b.name}</td><td className="py-2.5 px-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{b.containerName}</span></td><td className="py-2.5 px-3 text-slate-500">{formatBytes(b.size)}</td><td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{b.lastModified ? new Date(b.lastModified).toLocaleDateString() : '-'}</td></tr>
                ))}</tbody></table></div>
              )}
            </Panel>
          </div>
        )}

        {/* ─── APP INSIGHTS ──────────────────────────────── */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {!insightsData || insightsData.error ? (
              <Panel title="Application Insights"><div className="text-center py-12"><Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">App Insights not configured or unavailable</p><p className="text-xs text-slate-400 mt-1">Set APPINSIGHTS_APP_ID and APPINSIGHTS_API_KEY in your environment</p></div></Panel>
            ) : (<>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Server} label="Server Requests" value={Math.round(serverRequests)} color="blue" />
                <StatCard icon={Zap} label="Avg Response (ms)" value={avgResponseTime} color="teal" />
                <StatCard icon={AlertTriangle} label="Failed Requests" value={Math.round(failedRequests)} color="amber" />
                <StatCard icon={Activity} label="Availability %" value={Math.round(availability * 100) / 100} color="purple" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Panel title="Daily Unique Users">{(() => { const d = extractTimeSeriesRows(insightsData.dailyUsers); return d.length ? <AreaChartComponent data={d} color="#2563eb" /> : <Empty /> })()}</Panel>
                <Panel title="Response Time Trend">{(() => { const d = extractTimeSeriesRows(insightsData.responseTimeTrend); return d.length ? <AreaChartComponent data={d.map(r => ({ ...r, value: Math.round(r.value) }))} color="#f59e0b" /> : <Empty /> })()}</Panel>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Panel title="Top Pages (Server)">{(() => { const d = extractQueryRows(insightsData.topPages); return d.length ? <BarChartComponent data={d.map(r => ({ ...r, name: r.name.length > 25 ? r.name.slice(0, 25) + '...' : r.name }))} color="#0d9488" /> : <Empty /> })()}</Panel>
                <Panel title="Browser Distribution">{(() => { const d = extractQueryRows(insightsData.browsers); return d.length ? <PieChartComponent data={d} /> : <Empty /> })()}</Panel>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Panel title="Top Countries (Server)">{(() => { const d = extractQueryRows(insightsData.countries); return d.length ? <BarChartComponent data={d} color="#8b5cf6" /> : <Empty /> })()}</Panel>
                <Panel title="Error Types">{(() => { const d = extractQueryRows(insightsData.errors); return d.length ? <BarChartComponent data={d.map(r => ({ ...r, name: r.name.length > 20 ? r.name.slice(0, 20) + '...' : r.name }))} color="#ef4444" /> : <Empty text="No errors" /> })()}</Panel>
              </div>
            </>)}
          </div>
        )}

        {/* ─── COMMENTS ──────────────────────────────────── */}
        {activeTab === 'comments' && (
          <Panel title="Blog Comments" subtitle={`${data.activeComments} active / ${data.totalComments} total`}>
            {data.recentComments.length === 0 ? <Empty text="No comments yet" /> : (
              <div className="space-y-3">{data.recentComments.map(c => (
                <div key={c.rowKey} className={`bg-slate-50 border border-slate-200 rounded-lg p-4 ${c.status === 'hidden' ? 'opacity-40' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800 text-sm">{c.authorName}</span>
                        <span className="text-slate-400 text-xs">{c.authorEmail}</span>
                        {c.status === 'hidden' && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs">hidden</span>}
                      </div>
                      <p className="text-slate-600 text-sm">{c.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-400">on <span className="text-blue-600">{c.slug}</span></span>
                        <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    {c.status !== 'hidden' && <button onClick={() => hideComment(c.slug, c.rowKey)} className="px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg transition-colors shrink-0">Hide</button>}
                  </div>
                </div>
              ))}</div>
            )}
          </Panel>
        )}

        {/* ─── SEO ───────────────────────────────────────── */}
        {activeTab === 'seo' && seoData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FileText} label="Sitemap URLs" value={seoData.sitemapUrls} color="blue" />
              <StatCard icon={Newspaper} label="Blog Posts" value={seoData.totalBlogPosts} color="teal" />
              <StatCard icon={Globe} label="Key Pages Up" value={seoData.pagesUp} color="amber" />
              <StatCard icon={BookOpen} label="Blog Categories" value={seoData.blogCategories.length} color="purple" />
            </div>
            {seoData.checklist.map(section => {
              const passCount = section.items.filter(i => i.status === 'pass').length
              const totalAuto = section.items.filter(i => i.status !== 'manual').length
              return (
                <Panel key={section.category} title={section.category} subtitle={totalAuto > 0 ? `${passCount}/${totalAuto} automated checks passing` : 'Manual verification needed'}>
                  <div className="space-y-3">{section.items.map((item, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${item.status === 'pass' ? 'bg-emerald-50 border-emerald-200' : item.status === 'fail' ? 'bg-red-50 border-red-200' : item.status === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="mt-0.5 shrink-0">
                        {item.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {item.status === 'fail' && <XCircle className="w-5 h-5 text-red-600" />}
                        {item.status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                        {item.status === 'manual' && <Search className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        <p className={`text-xs mt-1 ${item.status === 'pass' ? 'text-emerald-600' : item.status === 'fail' ? 'text-red-600' : item.status === 'warning' ? 'text-amber-600' : 'text-slate-400'}`}>{item.status === 'manual' ? 'Verify manually: ' : ''}{item.action}</p>
                      </div>
                      {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"><ExternalLink className="w-4 h-4" /></a>}
                    </div>
                  ))}</div>
                </Panel>
              )
            })}
            <Panel title="Key Pages Health" subtitle="HTTP status of important pages">
              <div className="grid sm:grid-cols-2 gap-2">{seoData.pageChecks.map(page => (
                <div key={page.path} className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  {page.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  <div className="flex-1 min-w-0"><p className="text-sm text-slate-800 truncate">{page.label}</p><p className="text-xs text-slate-400 truncate">{page.path}</p></div>
                  <span className={`text-xs font-mono shrink-0 ${page.ok ? 'text-emerald-600' : 'text-red-600'}`}>{page.status || '---'}</span>
                </div>
              ))}</div>
            </Panel>
          </div>
        )}

        {/* ─── SETUP ─────────────────────────────────────── */}
        {activeTab === 'setup' && setupData && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center"><Server className="w-6 h-6 text-white" /></div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Environment</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">{setupData.platform}</span>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">{setupData.environment}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-800">{setupData.configuredCount}/{setupData.totalChecks}</div>
                  <p className="text-xs text-slate-500 mt-0.5">services configured</p>
                  <div className="w-32 bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${setupData.configuredCount === setupData.totalChecks ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(setupData.configuredCount / setupData.totalChecks) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3">{Object.entries(setupData.checks).map(([key, check]) => {
              const Icon = ICON_MAP[key] || Settings
              return (
                <div key={key} className={`bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm ${check.configured ? 'border-slate-200' : 'border-red-300'}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${check.configured ? 'bg-emerald-100' : 'bg-red-100'}`}>
                    <Icon className={`w-5 h-5 ${check.configured ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-slate-800">{check.label}</h3>{check.configured ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-600 shrink-0" />}</div>
                    <p className="text-xs text-slate-500 mt-0.5">{check.description}</p>
                    {check.value && <p className="text-xs text-slate-400 mt-1 font-mono truncate">{check.value}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${check.configured ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{check.configured ? 'Active' : 'Missing'}</span>
                </div>
              )
            })}</div>
            <Panel title="Quick Links" subtitle="External dashboards and tools">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{[
                { title: 'Google Analytics', description: 'Real-time traffic & behavior', href: 'https://analytics.google.com', icon: BarChart3 },
                { title: 'Search Console', description: 'Indexing & search performance', href: 'https://search.google.com/search-console', icon: Search },
                { title: 'Azure Portal', description: 'App Service, Storage, OpenAI', href: 'https://portal.azure.com', icon: Server },
                { title: 'Vercel Dashboard', description: 'Deployments & env variables', href: 'https://vercel.com/dashboard', icon: Activity },
                { title: 'Sitemap', description: 'View XML sitemap', href: '/sitemap.xml', icon: FileText },
                { title: 'Hostinger', description: 'Domain & DNS management', href: 'https://www.hostinger.com/cpanel-login', icon: Globe },
              ].map(link => (
                <a key={link.title} href={link.href} target={link.href.startsWith('/') ? '_self' : '_blank'} rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors group">
                  <div className="w-9 h-9 bg-white border border-slate-200 group-hover:border-blue-300 rounded-lg flex items-center justify-center shrink-0"><link.icon className="w-4 h-4 text-slate-600 group-hover:text-blue-600" /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800">{link.title}</p><p className="text-xs text-slate-500 truncate">{link.description}</p></div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </a>
              ))}</div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Reusable Components ─────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, subtitle }: { icon: any; label: string; value: number; color: 'blue' | 'teal' | 'amber' | 'purple'; subtitle?: string }) {
  const colors = { blue: 'bg-blue-100 text-blue-600', teal: 'bg-teal-100 text-teal-600', amber: 'bg-amber-100 text-amber-600', purple: 'bg-purple-100 text-purple-600' }
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon className="w-5 h-5" /></div>
        <div><p className="text-2xl font-bold text-slate-800">{subtitle || value.toLocaleString()}</p><p className="text-xs text-slate-500">{label}</p></div>
      </div>
    </div>
  )
}

function Panel({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div><h2 className="text-base font-semibold text-slate-800">{title}</h2>{subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}</div>
        {action}
      </div>
      {children}
    </div>
  )
}

function RankedList({ items }: { items: [string, number][] }) {
  const max = Math.max(...items.map(i => i[1]), 1)
  return (<div className="space-y-2">{items.map(([name, count], i) => (
    <div key={name} className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-5 text-right">{i + 1}</span>
      <span className="text-sm text-slate-700 flex-1 truncate" title={name}>{name}</span>
      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / max) * 100}%` }} /></div>
      <span className="text-xs text-slate-500 w-10 text-right">{count}</span>
    </div>
  ))}</div>)
}

function Empty({ text }: { text?: string }) { return <p className="text-slate-400 text-center py-8 text-sm">{text || 'No data yet'}</p> }
function ExportButton({ onClick }: { onClick: () => void }) { return <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors"><Download className="w-3.5 h-3.5" />CSV</button> }
function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() || 'unknown'
  const color = s === 'completed' ? 'bg-emerald-100 text-emerald-700' : s === 'pending' || s === 'submitted' ? 'bg-amber-100 text-amber-700' : s === 'error' || s === 'failed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
  return <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${color}`}>{status || 'unknown'}</span>
}
