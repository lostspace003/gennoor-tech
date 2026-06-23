'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  BarChart3, Eye, MessageSquare, Mail, Globe, MapPin,
  Lock, LogOut, RefreshCw, FileText, Users,
  ExternalLink, Settings, CheckCircle2, XCircle, Search,
  Shield, Activity, Database, Server, Code2, Link2,
  AlertTriangle, Newspaper, Download, HardDrive, Bot,
  Clock, Zap, BookOpen, TrendingUp, Send, Calendar, GraduationCap,
  Video, CheckCircle, Phone, X, Trash2,
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

type TabKey = 'overview' | 'traffic' | 'enquiries' | 'emails' | 'sessions' | 'bookings' | 'storage' | 'insights' | 'comments' | 'seo' | 'setup' | 'ai-readiness' | 'cowork' | 'indexing' | 'academy' | 'auth-log' | 'certificates' | 'course-feedback'
type GroupKey = 'analytics' | 'communications' | 'bookings' | 'system'

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
interface SessionRecord { rowKey: string; agentId: string; agentName: string; status: string; resumeFileName: string; resumeBlobPath?: string; updatedAt: string }
interface AuthLogEntry { rowKey: string; email: string; name?: string; ip: string; userAgent: string; loginAt: string }
interface ContainerStats { name: string; blobCount: number; totalSizeBytes: number; lastModified: string }
interface BlobInfo { name: string; containerName: string; size: number; contentType: string; lastModified: string }
interface StorageData { containers: ContainerStats[]; recentBlobs: BlobInfo[] }
interface BookingAppointment { rowKey: string; name: string; email: string; whatsapp?: string; topic?: string; serviceName: string; serviceId: string; date: string; startTime: string; endTime: string; timezone: string; country?: string; status: string; createdAt: string; graphAppointmentId?: string; joinWebUrl?: string; adminMessage?: string; acceptedAt?: string; rejectedAt?: string; changeRequestedAt?: string; cancelledAt?: string; rescheduledAt?: string; outcomeNotes?: string }
interface OutcomeNote { text: string; createdAt: string }
interface CallRequest { rowKey: string; name: string; email: string; whatsapp?: string; whatsappCountry?: string; company?: string; designation?: string; message?: string; programTitle?: string; timestamp?: string; createdAt: string; replied: boolean; repliedAt?: string; lastSubject?: string }

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [days, setDays] = useState(7)
  const [activeFilter, setActiveFilter] = useState<string>('7')
  const [customDate, setCustomDate] = useState('')
  const [activeGroup, setActiveGroup] = useState<GroupKey>('analytics')
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [emailFilter, setEmailFilter] = useState('all')

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [emailLogs, setEmailLogs] = useState<{ logs: Array<Record<string, any>>; totalSent: number; totalFailed: number; uniqueRecipients: number; total: number } | null>(null)
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [seoData, setSeoData] = useState<SeoData | null>(null)
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [storageData, setStorageData] = useState<StorageData | null>(null)
  const [insightsData, setInsightsData] = useState<any>(null)
  const [aiReadinessData, setAiReadinessData] = useState<any>(null)
  const [bookingsData, setBookingsData] = useState<BookingAppointment[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsAction, setBookingsAction] = useState<string | null>(null)
  const [bookingModal, setBookingModal] = useState<{ type: 'outcome' | 'reply' | 'reschedule' | 'reject'; booking: BookingAppointment } | null>(null)
  const [modalMessage, setModalMessage] = useState('')
  const [modalSubject, setModalSubject] = useState('')
  const [modalNotes, setModalNotes] = useState<OutcomeNote[]>([])
  const [modalNewNote, setModalNewNote] = useState('')
  const [modalResched, setModalResched] = useState({ date: '', startTime: '', endTime: '' })
  const [modalSending, setModalSending] = useState(false)
  const [bookingPage, setBookingPage] = useState(1)
  const [bookingsPerPage, setBookingsPerPage] = useState(15)
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set())
  const [bookingDeleting, setBookingDeleting] = useState(false)
  const [callRequests, setCallRequests] = useState<CallRequest[]>([])
  const [callRequestsLoading, setCallRequestsLoading] = useState(false)
  const [callDraft, setCallDraft] = useState<{ req: CallRequest; instructions: string; subject: string; bodyHtml: string; drafting: boolean; sending: boolean; error: string; sent: boolean } | null>(null)
  const [coworkData, setCoworkData] = useState<{ total: number; registrations: Array<{ fullName: string; email: string; country: string; timeZone: string; role: string; company: string; biggestWorkflow: string; createdAt: string }>; byCountry: Array<{ name: string; value: number }>; byTimezone: Array<{ name: string; value: number }> } | null>(null)
  const [indexingData, setIndexingData] = useState<{ google: Array<{ url: string; status: string }>; bing: Array<{ url: string; status: string }> } | null>(null)
  const [academyData, setAcademyData] = useState<{ learners: Array<{ email: string; name: string; provider: string; lastLogin: string; createdAt: string }>; progress: Array<{ email: string; courseId: string; chapterId: string; completionPercent: number; completed: boolean; lastAccessed: string }>; summary: { totalLearners: number; activeLearners: number; learnersWithCompletion: number; totalProgressEntries: number; byProvider: Record<string, number>; byCourse: Array<{ courseId: string; learners: number; completions: number }> }; chapterStats: Record<string, { views: number; completions: number; avgPercent: number }> } | null>(null)
  const [indexNowState, setIndexNowState] = useState<{ pushing: boolean; result?: { success: boolean; submitted?: number; total?: number; error?: string; submittedAt?: string } }>({ pushing: false })
  const [gscData, setGscData] = useState<{
    configured: boolean
    reason?: string
    error?: string
    indexedCount?: number
    sitemaps?: Array<{ path: string; lastSubmitted?: string; lastDownloaded?: string; isPending?: boolean; errors?: string; warnings?: string }>
    summary28d?: { clicks: number; impressions: number; ctr: number; position: number }
    topPages?: Array<{ page: string; clicks: number; impressions: number; ctr: number; position: number }>
    checkedAt?: string
  } | null>(null)
  const [gscResubmit, setGscResubmit] = useState<{ submitting: boolean; result?: { success: boolean; message?: string } }>({ submitting: false })
  const [authLog, setAuthLog] = useState<AuthLogEntry[]>([])
  const [certData, setCertData] = useState<{ summary: { total: number; issued: number; revoked: number; uniqueLearners: number; past7: number; past30: number }; perCourse: Array<{ slug: string; title: string; count: number }>; recent: Array<{ certId: string; recipientName: string; recipientEmail: string; workshopTitle: string; workshopSlug: string; issueDate: string; verifyUrl: string; status: string; createdAt: string }> } | null>(null)
  const [feedbackData, setFeedbackData] = useState<{ summary: { total: number; avgRating: number; fiveStar: number; lowRated: number }; perCourse: Array<{ courseId: string; count: number; avgRating: number; commentsCount: number }>; recent: Array<{ courseId: string; learnerName: string; learnerEmail: string; rating: number; comments: string; createdAt: string }> } | null>(null)
  const [liveVisitors, setLiveVisitors] = useState<{ count: number; byPage: Array<{ page: string; hits: number }> }>({ count: 0, byPage: [] })

  const fetchAll = useCallback(async (numDays: number) => {
    setLoading(true); setError('')
    const ts = numDays <= 1 ? 'PT24H' : numDays <= 2 ? 'P2D' : numDays <= 7 ? 'P7D' : numDays <= 14 ? 'P14D' : `P${numDays}D`
    try {
      const headers = { 'Content-Type': 'application/json' }
      const body = (extra: any = {}) => JSON.stringify(extra)
      const [analyticsRes, setupRes, seoRes, sessionsRes, storageRes, insightsRes, emailLogsRes, aiReadinessRes, certRes, feedbackRes] = await Promise.all([
        fetch('/api/admin/analytics', { method: 'POST', headers, body: body({ days: numDays }) }),
        fetch('/api/admin/setup-status', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/seo-health', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/sessions', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/storage', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/insights', { method: 'POST', headers, body: body({ metric: 'all', timespan: ts }) }),
        fetch('/api/admin/email-logs', { method: 'POST', headers, body: body({ days: numDays }) }),
        fetch('/api/admin/ai-readiness', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/certificates', { method: 'POST', headers, body: body() }),
        fetch('/api/admin/course-feedback', { method: 'POST', headers, body: body() }),
      ])
      if (analyticsRes.status === 401) { setError('Session expired. Please login again.'); router.push('/admin/login'); return }
      const [analyticsData, setupResult, seoResult, sessionsResult, storageResult, insightsResult, emailLogsResult, aiReadinessResult, certResult, feedbackResult] = await Promise.all([
        analyticsRes.ok ? analyticsRes.json() : null, setupRes.ok ? setupRes.json() : null, seoRes.ok ? seoRes.json() : null,
        sessionsRes.ok ? sessionsRes.json() : [], storageRes.ok ? storageRes.json() : null, insightsRes.ok ? insightsRes.json() : null,
        emailLogsRes.ok ? emailLogsRes.json() : null, aiReadinessRes.ok ? aiReadinessRes.json() : null,
        certRes.ok ? certRes.json() : null, feedbackRes.ok ? feedbackRes.json() : null,
      ])
      if (!analyticsData) setError('Failed to load analytics data')
      setCertData(certResult)
      setFeedbackData(feedbackResult)
      setData(analyticsData); setSetupData(setupResult); setSeoData(seoResult)
      setSessions(Array.isArray(sessionsResult) ? sessionsResult : []); setStorageData(storageResult); setInsightsData(insightsResult); setEmailLogs(emailLogsResult); setAiReadinessData(aiReadinessResult)
      try { const cwRes = await fetch('/api/admin/cowork-registrations', { method: 'POST', headers }); if (cwRes.ok) setCoworkData(await cwRes.json()) } catch {}
      try { const acRes = await fetch('/api/admin/academy', { method: 'POST', headers }); if (acRes.ok) setAcademyData(await acRes.json()) } catch {}
      try { const gRes = await fetch('/api/admin/gsc-coverage', { method: 'POST', headers }); if (gRes.ok) setGscData(await gRes.json()) } catch {}
      setLastUpdated(new Date())
      try { const bRes = await fetch('/api/bookings/appointments'); if (bRes.ok) { const bData = await bRes.json(); setBookingsData(bData.appointments || []) } } catch {}
      try { const crRes = await fetch('/api/admin/call-requests'); if (crRes.ok) { const crData = await crRes.json(); setCallRequests(crData.requests || []) } } catch {}
    } catch { setError('Failed to load dashboard data') }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => {
    if (status === 'authenticated' && !data && !loading) { fetchAll(days) }
  }, [status, data, loading, days, fetchAll])

  useEffect(() => {
    if (!autoRefresh || status !== 'authenticated') return
    const interval = setInterval(() => fetchAll(days), 60000)
    return () => clearInterval(interval)
  }, [autoRefresh, status, days, fetchAll])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      fetch('/api/admin/auth-log', { method: 'POST' }).catch(() => {})
      fetch('/api/admin/auth-log').then(r => r.ok ? r.json() : { logs: [] }).then(d => setAuthLog(d.logs || [])).catch(() => {})
    }
  }, [status, session?.user?.email])

  useEffect(() => {
    if (status !== 'authenticated') return
    const pull = () => fetch('/api/admin/live-visitors')
      .then(r => r.ok ? r.json() : { count: 0, byPage: [] })
      .then(d => setLiveVisitors({ count: d.count || 0, byPage: d.byPage || [] }))
      .catch(() => {})
    pull()
    const id = setInterval(pull, 30000)
    return () => clearInterval(id)
  }, [status])

  function handleRefresh() { fetchAll(days) }
  function handleDaysChange(d: number, filter: string) { setDays(d); setActiveFilter(filter); fetchAll(d) }
  function handleCustomDate(dateStr: string) {
    setCustomDate(dateStr)
    if (!dateStr) return
    const selected = new Date(dateStr + 'T00:00:00')
    const now = new Date()
    const diffDays = Math.max(1, Math.ceil((now.getTime() - selected.getTime()) / (1000 * 60 * 60 * 24)))
    setDays(diffDays); setActiveFilter('custom'); fetchAll(diffDays)
  }
  function getFilterLabel(): string {
    if (activeFilter === 'today') return 'Today'
    if (activeFilter === 'yesterday') return 'Yesterday'
    if (activeFilter === 'custom' && customDate) return `Since ${new Date(customDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    return `Last ${days} days`
  }
  function handleLogout() { signOut({ callbackUrl: '/admin/login' }) }

  async function handleBookingAction(rowKey: string, action: string, extra?: Record<string, any>) {
    setBookingsAction(rowKey)
    try {
      const res = await fetch('/api/bookings/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowKey, action, ...extra }),
      })
      if (res.ok) {
        const bRes = await fetch('/api/bookings/appointments')
        if (bRes.ok) { const bData = await bRes.json(); setBookingsData(bData.appointments || []) }
      }
    } catch {} finally { setBookingsAction(null); closeModal() }
  }

  function openModal(type: 'outcome' | 'reply' | 'reschedule' | 'reject', booking: BookingAppointment) {
    setBookingModal({ type, booking })
    setModalMessage('')
    setModalNewNote('')
    setModalSending(false)
    if (type === 'outcome') {
      try { setModalNotes(booking.outcomeNotes ? JSON.parse(booking.outcomeNotes) : []) } catch { setModalNotes([]) }
    }
    if (type === 'reply') {
      setModalSubject(`Re: ${booking.serviceName} — ${booking.date}`)
      setModalMessage('')
    }
    if (type === 'reschedule') {
      setModalResched({ date: booking.date, startTime: booking.startTime, endTime: booking.endTime })
      setModalMessage('')
    }
    if (type === 'reject') {
      setModalMessage('')
    }
  }

  function closeModal() {
    setBookingModal(null); setModalMessage(''); setModalSubject(''); setModalNewNote(''); setModalSending(false)
  }

  async function saveOutcomeNote() {
    if (!bookingModal || !modalNewNote.trim()) return
    setModalSending(true)
    const updated = [...modalNotes, { text: modalNewNote.trim(), createdAt: new Date().toISOString() }]
    try {
      const res = await fetch('/api/bookings/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowKey: bookingModal.booking.rowKey, action: 'update-notes', notes: JSON.stringify(updated) }),
      })
      if (res.ok) {
        setModalNotes(updated); setModalNewNote('')
        const bRes = await fetch('/api/bookings/appointments')
        if (bRes.ok) { const bData = await bRes.json(); setBookingsData(bData.appointments || []) }
      }
    } catch {} finally { setModalSending(false) }
  }

  async function sendReplyEmail() {
    if (!bookingModal || !modalMessage.trim()) return
    setModalSending(true)
    try {
      await fetch('/api/bookings/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowKey: bookingModal.booking.rowKey, action: 'send-reply', subject: modalSubject, replyBody: modalMessage }),
      })
    } catch {} finally { setModalSending(false); closeModal() }
  }

  async function refreshCallRequests() {
    setCallRequestsLoading(true)
    try { const r = await fetch('/api/admin/call-requests'); if (r.ok) { const d = await r.json(); setCallRequests(d.requests || []) } } catch {} finally { setCallRequestsLoading(false) }
  }

  function openCallDraft(req: CallRequest) {
    const firstName = (req.name || '').trim().split(/\s+/)[0] || 'there'
    setCallDraft({
      req,
      instructions: 'Offer a discovery call this Friday, IST: morning 9:00 AM–12:00 PM or afternoon 2:00 PM–5:00 PM. Ask them to pick a time.',
      subject: `Discovery Call with Gennoor Tech — ${firstName}`,
      bodyHtml: '',
      drafting: false,
      sending: false,
      error: '',
      sent: false,
    })
  }

  async function generateCallDraft() {
    if (!callDraft) return
    setCallDraft(d => d && ({ ...d, drafting: true, error: '' }))
    try {
      const res = await fetch('/api/admin/call-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'draft', rowKey: callDraft.req.rowKey, instructions: callDraft.instructions }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCallDraft(d => d && ({ ...d, subject: data.subject || d.subject, bodyHtml: data.bodyHtml || '', drafting: false }))
      } else {
        setCallDraft(d => d && ({ ...d, drafting: false, error: data.message || 'Failed to draft' }))
      }
    } catch {
      setCallDraft(d => d && ({ ...d, drafting: false, error: 'Failed to draft' }))
    }
  }

  async function sendCallDraft() {
    if (!callDraft || !callDraft.bodyHtml.trim()) return
    setCallDraft(d => d && ({ ...d, sending: true, error: '' }))
    try {
      const res = await fetch('/api/admin/call-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', rowKey: callDraft.req.rowKey, subject: callDraft.subject, bodyHtml: callDraft.bodyHtml }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCallDraft(d => d && ({ ...d, sending: false, sent: true }))
        refreshCallRequests()
      } else {
        setCallDraft(d => d && ({ ...d, sending: false, error: data.message || 'Send failed' }))
      }
    } catch {
      setCallDraft(d => d && ({ ...d, sending: false, error: 'Send failed' }))
    }
  }

  async function hideComment(slug: string, rowKey: string) {
    try { const res = await fetch('/api/blog-comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, rowKey }) }); if (res.ok) handleRefresh() } catch {}
  }

  // ─── Login Screen ─────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading session...</span>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login')
    return null
  }

  // Load failure: without this branch the page would sit on the loading
  // spinner forever (error is set but `data` never becomes truthy).
  if (!data && error && !loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button
          onClick={() => fetchAll(days)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
        <span className="text-slate-600">Loading dashboard data...</span>
      </div>
    </div>
  )

  // ─── Derived Data ─────────────────────────────────────────

  const sortedDates = Object.entries(data.viewsByDate).sort((a, b) => a[0].localeCompare(b[0]))
  const chartDates = sortedDates.map(([date, count]) => ({ name: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: count }))

  // Global date filter — applies to all tabs
  const filterStartDate = (() => {
    if (activeFilter === 'today') { const d = new Date(); d.setHours(0, 0, 0, 0); return d }
    if (activeFilter === 'yesterday') { const d = new Date(); d.setDate(d.getDate() - 1); d.setHours(0, 0, 0, 0); return d }
    if (activeFilter === 'custom' && customDate) return new Date(customDate + 'T00:00:00')
    const d = new Date(); d.setDate(d.getDate() - days); d.setHours(0, 0, 0, 0); return d
  })()
  const isInDateRange = (dateStr: string | undefined) => { if (!dateStr) return false; return new Date(dateStr) >= filterStartDate }
  const filteredBookings = bookingsData.filter(b => isInDateRange(b.date) || isInDateRange(b.createdAt))
  const filteredSessions = sessions.filter(s => isInDateRange(s.updatedAt))
  const filteredCoworkRegs = coworkData?.registrations?.filter(r => isInDateRange(r.createdAt)) || []
  const filteredCoworkByCountry = Object.entries(filteredCoworkRegs.reduce((acc: Record<string, number>, r) => { acc[r.country] = (acc[r.country] || 0) + 1; return acc }, {})).map(([name, value]) => ({ name, value }))
  const filteredCoworkByTz = Object.entries(filteredCoworkRegs.reduce((acc: Record<string, number>, r) => { acc[r.timeZone] = (acc[r.timeZone] || 0) + 1; return acc }, {})).map(([name, value]) => ({ name, value }))
  const filteredBlobs = storageData?.recentBlobs?.filter(b => isInDateRange(b.lastModified)) || []
  const filteredAiReports = (aiReadinessData?.recentReports || []).filter((r: any) => isInDateRange(r.generatedAt))
  const filteredAiFeedback = (aiReadinessData?.feedback || []).filter((f: any) => isInDateRange(f.submittedAt))

  const completedSessions = filteredSessions.filter(s => s.status === 'completed' || s.status === 'Completed').length
  const pendingSessions = filteredSessions.filter(s => s.status === 'pending' || s.status === 'submitted').length
  const errorSessions = filteredSessions.filter(s => s.status === 'error' || s.status === 'failed').length
  const totalFiles = storageData?.containers.reduce((a, c) => a + c.blobCount, 0) || 0
  const totalSize = storageData?.containers.reduce((a, c) => a + c.totalSizeBytes, 0) || 0
  const serverRequests = insightsData ? extractMetricValue(insightsData.requests) : 0
  const avgResponseTime = insightsData ? Math.round(extractMetricValue(insightsData.responseTime)) : 0
  const failedRequests = insightsData ? extractMetricValue(insightsData.failed) : 0
  const availability = insightsData ? extractMetricValue(insightsData.availability) : 0

  const groups: { key: GroupKey; label: string; icon: any; badge?: number; tabs: { key: TabKey; label: string; icon: any; badge?: number }[] }[] = [
    { key: 'analytics', label: 'Analytics', icon: BarChart3, tabs: [
      { key: 'overview', label: 'Overview', icon: BarChart3 },
      { key: 'traffic', label: 'Traffic', icon: TrendingUp },
      { key: 'insights', label: 'Insights', icon: Activity },
      { key: 'ai-readiness', label: 'AI Readiness', icon: Bot },
      { key: 'academy', label: 'Academy', icon: BookOpen, badge: academyData?.summary?.totalLearners || undefined },
      { key: 'certificates', label: 'Certificates', icon: GraduationCap, badge: certData?.summary?.issued || undefined },
      { key: 'course-feedback', label: 'Course Feedback', icon: MessageSquare, badge: feedbackData?.summary?.lowRated || undefined },
    ]},
    { key: 'communications', label: 'Communications', icon: Mail, badge: (emailLogs?.totalFailed || 0) > 0 ? emailLogs!.totalFailed : undefined, tabs: [
      { key: 'enquiries', label: 'Enquiries', icon: Mail },
      { key: 'cowork', label: 'Cowork', icon: Users, badge: coworkData?.total || undefined },
      { key: 'emails', label: 'Emails', icon: Send, badge: emailLogs?.totalFailed || undefined },
      { key: 'comments', label: 'Comments', icon: MessageSquare },
      { key: 'sessions', label: 'Sessions', icon: Bot },
    ]},
    { key: 'bookings', label: 'Bookings', icon: Calendar, badge: (bookingsData.filter(b => b.status === 'pending').length + callRequests.filter(c => !c.replied).length) || undefined, tabs: [
      { key: 'bookings', label: 'All Requests', icon: Calendar, badge: (bookingsData.filter(b => b.status === 'pending').length + callRequests.filter(c => !c.replied).length) || undefined },
    ]},
    { key: 'system', label: 'System', icon: Settings, badge: setupData ? setupData.totalChecks - setupData.configuredCount : undefined, tabs: [
      { key: 'storage', label: 'Storage', icon: HardDrive },
      { key: 'seo', label: 'SEO Health', icon: Search },
      { key: 'indexing', label: 'Indexing', icon: Globe },
      { key: 'auth-log', label: 'Auth Log', icon: Lock },
      { key: 'setup', label: 'Setup', icon: Settings, badge: setupData ? setupData.totalChecks - setupData.configuredCount : undefined },
    ]},
  ]

  const activeGroupData = groups.find(g => g.key === activeGroup)
  const sidebarTabs = activeGroupData?.tabs || []

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
                {session?.user?.email || 'Dashboard'} &middot; {setupData?.environment || ''}
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
        {/* Main Horizontal Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-6 border border-slate-200 shadow-sm">
          {groups.map(group => (
            <button key={group.key} onClick={() => { setActiveGroup(group.key); setActiveTab(group.tabs[0].key) }} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center ${activeGroup === group.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              <group.icon className="w-4 h-4" />
              {group.label}
              {group.badge !== undefined && group.badge > 0 && <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] rounded-full ${activeGroup === group.key ? 'bg-white/25 text-white' : 'bg-red-500 text-white'}`}>{group.badge}</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Vertical Sub-tabs (sidebar) */}
          {sidebarTabs.length > 1 && (
            <div className="w-44 flex-shrink-0">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-[72px]">
                {sidebarTabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 w-full px-4 py-3 text-sm font-medium transition-colors border-l-[3px] ${activeTab === tab.key ? 'bg-blue-50 text-blue-700 border-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-transparent'}`}>
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.badge !== undefined && tab.badge > 0 && <span className="ml-auto px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{tab.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 min-w-0">

        {/* ─── OVERVIEW ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Live now banner — refreshes every 30s */}
            <div className="admin-card flex items-center justify-between gap-4 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className={`${liveVisitors.count > 0 ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`}></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </span>
                <p className="text-sm font-medium text-emerald-900">
                  <span className="text-lg font-bold">{liveVisitors.count}</span> {liveVisitors.count === 1 ? 'visitor' : 'visitors'} on the site right now
                </p>
              </div>
              {liveVisitors.byPage.length > 0 && (
                <p className="text-xs text-emerald-700 truncate max-w-[40%]">Hot: {liveVisitors.byPage[0].page}</p>
              )}
            </div>

            {/* Key engagement metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard icon={Eye} label="Page Views" value={data.totalViews} color="blue" />
              <StatCard icon={Users} label="Sessions" value={(data as any).totalSessions || 0} color="teal" />
              <StatCard icon={Clock} label="Avg Duration" value={0} color="amber" subtitle={`${Math.round((data as any).avgSessionDuration || 0)}s`} />
              <StatCard icon={TrendingUp} label="Pages / Session" value={0} color="purple" subtitle={`${((data as any).avgPagesPerSession || 0).toFixed(1)}`} />
              <StatCard icon={AlertTriangle} label="Bounce Rate" value={0} color="blue" subtitle={`${((data as any).bounceRate || 0).toFixed(1)}%`} />
            </div>

            {/* Visitors & server health */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="New Visitors" value={(data as any).newVisitors || 0} color="teal" />
              <StatCard icon={RefreshCw} label="Returning" value={(data as any).returningVisitors || 0} color="amber" />
              <StatCard icon={Mail} label="Enquiries" value={data.totalEnquiries} color="purple" />
              <StatCard icon={Calendar} label="Bookings" value={filteredBookings.length} color="blue" />
            </div>

            {/* Trends */}
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Daily Page Views" subtitle={getFilterLabel()}>
                {chartDates.length === 0 ? <Empty /> : <AreaChartComponent data={chartDates} color="#2563eb" />}
              </Panel>
              <Panel title="Sessions Trend" subtitle={getFilterLabel()}>
                {(() => { const sd = (data as any).sessionsByDate; if (!sd || Object.keys(sd).length === 0) return <Empty />; const d = Object.entries(sd).sort().map(([date, val]) => ({ name: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: val as number })); return <AreaChartComponent data={d} color="#0d9488" /> })()}
              </Panel>
            </div>

            {/* Conversion Funnel */}
            {(data as any).conversionFunnel && (data as any).conversionFunnel.length > 0 && (
              <Panel title="Conversion Funnel" subtitle="Visitor journey from landing to action">
                <div className="flex items-end gap-4 justify-center py-4 px-4">
                  {((data as any).conversionFunnel as { step: string; users: number }[]).map((step, i, arr) => {
                    const maxUsers = Math.max(...arr.map(s => s.users), 1)
                    const pct = Math.min((step.users / maxUsers) * 100, 100)
                    const prevUsers = i > 0 ? arr[i - 1]?.users || 0 : 0
                    const dropOff = i > 0 && prevUsers > 0 ? Math.round((1 - step.users / prevUsers) * 100) : 0
                    const barHeight = Math.max(pct * 1.6, 24)
                    const colors = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b']
                    return (
                      <div key={step.step} className="flex-1 text-center max-w-[160px]">
                        <div className="mx-auto rounded-t-lg" style={{ height: barHeight, background: colors[i] || '#2563eb' }} />
                        <p className="text-lg font-bold text-slate-800 mt-2">{step.users}</p>
                        <p className="text-xs text-slate-500 font-medium">{step.step}</p>
                        {i > 0 && dropOff > 0 && <p className="text-xs text-red-500 mt-0.5">-{dropOff}%</p>}
                        {i > 0 && dropOff <= 0 && step.users > 0 && <p className="text-xs text-emerald-500 mt-0.5">retained</p>}
                      </div>
                    )
                  })}
                </div>
              </Panel>
            )}

            {/* Hourly traffic + top pages */}
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Traffic by Hour (UTC)" subtitle="When visitors come">
                {(() => { const ht = (data as any).hourlyTraffic; if (!ht || ht.length === 0) return <Empty />; return <BarChartComponent data={ht.map((h: any) => ({ name: `${h.hour}:00`, value: h.views }))} color="#8b5cf6" /> })()}
              </Panel>
              <Panel title="Top Pages" subtitle="Most visited">
                {data.topPages.length === 0 ? <Empty /> : <BarChartComponent data={data.topPages.slice(0, 10).map(([name, value]) => ({ name: name.length > 25 ? name.slice(0, 25) + '...' : name, value }))} />}
              </Panel>
            </div>

            {/* Page performance + landing pages */}
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Page Performance" subtitle="Avg time on page (seconds)">
                {(() => { const pp = (data as any).pagePerformance; if (!pp || pp.length === 0) return <Empty text="Not enough data" />; return <BarChartComponent data={pp.slice(0, 10).map((p: any) => ({ name: (p.page || '').length > 25 ? p.page.slice(0, 25) + '...' : p.page, value: Math.round(p.avgTime) }))} color="#0d9488" /> })()}
              </Panel>
              <Panel title="Top Landing Pages" subtitle="Where visitors enter">
                {(() => { const lp = (data as any).topLandingPages; if (!lp || lp.length === 0) return <Empty />; return <BarChartComponent data={(lp as [string, number][]).slice(0, 8).map(([name, value]) => ({ name: name.length > 25 ? name.slice(0, 25) + '...' : name, value }))} color="#f59e0b" /> })()}
              </Panel>
            </div>

            {/* Referrers + enquiry breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Traffic Sources">
                {data.topReferrers.length === 0 ? <Empty text="No referral traffic" /> : <PieChartComponent data={data.topReferrers.map(([name, value]) => ({ name, value }))} />}
              </Panel>
              <Panel title="Enquiry Breakdown">
                {Object.keys(data.enquiryByType).length === 0 ? <Empty /> : <PieChartComponent data={Object.entries(data.enquiryByType).map(([name, value]) => ({ name: name.replace(/-/g, ' '), value }))} />}
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

        {/* ─── COWORK REGISTRATIONS ──────────────────────── */}
        {activeTab === 'cowork' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Registrations" value={filteredCoworkRegs.length} color="blue" />
              <StatCard icon={Globe} label="Countries" value={filteredCoworkByCountry.length} color="teal" />
              <StatCard icon={Clock} label="Timezones" value={filteredCoworkByTz.length} color="amber" />
              <StatCard icon={Users} label="With Company" value={filteredCoworkRegs.filter(r => r.company).length} color="purple" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Panel title="By Country" subtitle={getFilterLabel()}>{filteredCoworkByCountry.length > 0 ? <PieChartComponent data={filteredCoworkByCountry} /> : <Empty text="No registrations yet" />}</Panel>
              <Panel title="By Timezone" subtitle={getFilterLabel()}>{filteredCoworkByTz.length > 0 ? <BarChartComponent data={filteredCoworkByTz.slice(0, 10)} dataKey="value" color="#0d9488" /> : <Empty text="No registrations yet" />}</Panel>
            </div>
            <Panel title="All Registrations" subtitle={`${filteredCoworkRegs.length} total — ${getFilterLabel()}`} action={filteredCoworkRegs.length > 0 ? <ExportButton onClick={() => downloadCSV(filteredCoworkRegs as any, 'cowork-registrations')} /> : undefined}>
              {filteredCoworkRegs.length === 0 ? <Empty text="No registrations yet" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-medium">Name</th>
                  <th className="text-left py-2 px-3 font-medium">Email</th>
                  <th className="text-left py-2 px-3 font-medium">Country</th>
                  <th className="text-left py-2 px-3 font-medium">Timezone</th>
                  <th className="text-left py-2 px-3 font-medium">Role</th>
                  <th className="text-left py-2 px-3 font-medium">Company</th>
                  <th className="text-left py-2 px-3 font-medium">Date</th>
                </tr></thead>
                <tbody>{filteredCoworkRegs.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{r.fullName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.email}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.country}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-xs">{r.timeZone}</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.role || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.company || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}</tbody></table></div>
              )}
            </Panel>
          </div>
        )}

        {/* ─── AI ACADEMY ─────────────────────────────────── */}
        {activeTab === 'academy' && (() => {
          const learners = academyData?.learners || []
          const progressEntries = academyData?.progress || []
          const summary = academyData?.summary || { totalLearners: 0, activeLearners: 0, learnersWithCompletion: 0, totalProgressEntries: 0, byProvider: {}, byCourse: [] }
          const chapterStats = academyData?.chapterStats || {}

          const filteredLearners = learners.filter(l => isInDateRange(l.createdAt))
          const filteredProgress = progressEntries.filter(p => isInDateRange(p.lastAccessed))

          const providerData = Object.entries(summary.byProvider).map(([name, value]) => ({ name: name === 'otp' ? 'Email OTP' : name === 'google' ? 'Google' : name === 'microsoft' ? 'Microsoft' : name, value }))

          const chapterData = Object.entries(chapterStats)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, stats]) => ({ name: name.replace('chapter-', 'Ch '), value: stats.avgPercent }))

          const completionData = Object.entries(chapterStats)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, stats]) => ({ name: name.replace('chapter-', 'Ch '), value: stats.completions }))

          return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Learners" value={summary.totalLearners} color="blue" />
              <StatCard icon={BookOpen} label="Active Learners" value={summary.activeLearners} color="teal" />
              <StatCard icon={CheckCircle} label="With Completions" value={summary.learnersWithCompletion} color="amber" />
              <StatCard icon={GraduationCap} label="New This Period" value={filteredLearners.length} color="purple" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Panel title="Sign-in Method" subtitle={`${summary.totalLearners} total learners`}>
                {providerData.length > 0 ? <PieChartComponent data={providerData} /> : <Empty text="No learners yet" />}
              </Panel>
              <Panel title="Avg. Progress by Chapter" subtitle="Average completion % per chapter">
                {chapterData.length > 0 ? <BarChartComponent data={chapterData} dataKey="value" color="#0d9488" /> : <Empty text="No progress data yet" />}
              </Panel>
            </div>

            <Panel title="Chapter Completions" subtitle="Number of learners who completed each chapter">
              {completionData.length > 0 ? <BarChartComponent data={completionData} dataKey="value" color="#2563eb" /> : <Empty text="No completions yet" />}
            </Panel>

            <Panel title="All Learners" subtitle={`${learners.length} registered`} action={learners.length > 0 ? <ExportButton onClick={() => downloadCSV(learners as any, 'academy-learners')} /> : undefined}>
              {learners.length === 0 ? <Empty text="No learners yet" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-medium">Name</th>
                  <th className="text-left py-2 px-3 font-medium">Email</th>
                  <th className="text-left py-2 px-3 font-medium">Provider</th>
                  <th className="text-left py-2 px-3 font-medium">Last Login</th>
                  <th className="text-left py-2 px-3 font-medium">Joined</th>
                </tr></thead>
                <tbody>{learners.slice(0, 50).map((l, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{l.name || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{l.email}</td>
                    <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${l.provider === 'google' ? 'bg-red-100 text-red-700' : l.provider === 'microsoft' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}`}>{l.provider === 'otp' ? 'Email' : l.provider}</span></td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{l.lastLogin ? new Date(l.lastLogin).toLocaleDateString() : '-'}</td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}</tbody></table></div>
              )}
            </Panel>

            {summary.byCourse.length > 0 && (
              <Panel title="Course Breakdown" subtitle="Learners and completions per course">
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-medium">Course</th>
                  <th className="text-left py-2 px-3 font-medium">Learners</th>
                  <th className="text-left py-2 px-3 font-medium">Chapter Completions</th>
                </tr></thead>
                <tbody>{summary.byCourse.map((c, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{c.courseId}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.learners}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.completions}</td>
                  </tr>
                ))}</tbody></table></div>
              </Panel>
            )}
          </div>
          )
        })()}

        {/* ─── EMAILS ────────────────────────────────────── */}
        {activeTab === 'emails' && (() => {
          const allLogs = emailLogs?.logs || []
          const sentLogs = allLogs.filter(l => l.status === 'sent')
          const failedLogs = allLogs.filter(l => l.status === 'failed')
          const bookingLogs = allLogs.filter(l => (l.from || '').includes('schedule') || (l.subject || '').match(/booking|confirmed|rescheduled|cancelled/i))
          const contactLogs = allLogs.filter(l => (l.from || '').includes('contact') || (l.subject || '').match(/enquir|training|certification/i))
          const otherLogs = allLogs.filter(l => !bookingLogs.includes(l) && !contactLogs.includes(l))

          const emailInnerTabs = [
            { key: 'all', label: 'All', count: allLogs.length },
            { key: 'sent', label: 'Sent', count: sentLogs.length },
            { key: 'failed', label: 'Failed', count: failedLogs.length },
            { key: 'booking', label: 'Bookings', count: bookingLogs.length },
            { key: 'contact', label: 'Contact', count: contactLogs.length },
            { key: 'other', label: 'Other', count: otherLogs.length },
          ]

          const filteredLogs = emailFilter === 'sent' ? sentLogs : emailFilter === 'failed' ? failedLogs : emailFilter === 'booking' ? bookingLogs : emailFilter === 'contact' ? contactLogs : emailFilter === 'other' ? otherLogs : allLogs

          return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Send} label="Total Sent" value={emailLogs?.totalSent || 0} color="teal" />
              <StatCard icon={XCircle} label="Failed" value={emailLogs?.totalFailed || 0} color="purple" />
              <StatCard icon={Users} label="Unique Recipients" value={emailLogs?.uniqueRecipients || 0} color="blue" />
              <StatCard icon={Mail} label="Total Emails" value={emailLogs?.total || 0} color="amber" />
            </div>

            {/* Inner filter tabs */}
            <div className="flex gap-1 bg-white rounded-lg p-1 border border-slate-200">
              {emailInnerTabs.map(t => (
                <button key={t.key} onClick={() => setEmailFilter(t.key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${emailFilter === t.key ? t.key === 'failed' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                  {t.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${emailFilter === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{t.count}</span>
                </button>
              ))}
            </div>

            <Panel title={`${emailInnerTabs.find(t => t.key === emailFilter)?.label || 'All'} Emails`} subtitle={`${filteredLogs.length} email${filteredLogs.length !== 1 ? 's' : ''}`} action={filteredLogs.length > 0 ? <ExportButton onClick={() => downloadCSV(filteredLogs as any, `emails-${emailFilter}`)} /> : undefined}>
              {filteredLogs.length === 0 ? <Empty text="No emails in this category" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-3 font-medium">Status</th><th className="text-left py-2 px-3 font-medium">To</th><th className="text-left py-2 px-3 font-medium">From</th><th className="text-left py-2 px-3 font-medium">Subject</th><th className="text-left py-2 px-3 font-medium">Date</th></tr></thead>
                <tbody>{filteredLogs.map((log, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50">
                    <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.status}</span></td>
                    <td className="py-2.5 px-3 text-slate-800 truncate max-w-[180px]">{log.to}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">{log.from}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[250px] truncate">{log.subject}</td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}</tbody></table></div>
              )}
            </Panel>

            {/* Failed emails detail (always visible if there are failures) */}
            {emailFilter === 'all' && failedLogs.length > 0 && (
              <Panel title="Failed Emails" subtitle={`${failedLogs.length} delivery failure${failedLogs.length !== 1 ? 's' : ''}`}>
                <div className="space-y-2">
                  {failedLogs.slice(0, 10).map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-red-800 truncate">{log.subject}</p>
                        <p className="text-xs text-red-600">To: {log.to} &middot; {new Date(log.createdAt).toLocaleString()}</p>
                        {log.error && <p className="text-xs text-red-500 mt-1">{log.error}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>
          )
        })()}

        {/* ─── CAREER SESSIONS ───────────────────────────── */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Bot} label="Total Sessions" value={filteredSessions.length} color="blue" />
              <StatCard icon={CheckCircle2} label="Completed" value={completedSessions} color="teal" />
              <StatCard icon={Clock} label="Pending" value={pendingSessions} color="amber" />
              <StatCard icon={AlertTriangle} label="Errors" value={errorSessions} color="purple" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Sessions by Agent" subtitle={getFilterLabel()}>{filteredSessions.length === 0 ? <Empty /> : <PieChartComponent data={Object.entries(filteredSessions.reduce((acc: any, s) => { acc[s.agentName || 'Unknown'] = (acc[s.agentName || 'Unknown'] || 0) + 1; return acc }, {})).map(([name, value]) => ({ name, value: value as number }))} />}</Panel>
              <Panel title="Session Status" subtitle={getFilterLabel()}>{filteredSessions.length === 0 ? <Empty /> : <PieChartComponent data={Object.entries(filteredSessions.reduce((acc: any, s) => { acc[s.status || 'unknown'] = (acc[s.status || 'unknown'] || 0) + 1; return acc }, {})).map(([name, value]) => ({ name, value: value as number }))} />}</Panel>
            </div>
            <Panel title="Recent Sessions" subtitle={getFilterLabel()} action={filteredSessions.length > 0 ? <ExportButton onClick={() => downloadCSV(filteredSessions as any, 'career-sessions')} /> : undefined}>
              {filteredSessions.length === 0 ? <Empty text="No career sessions yet" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-3 font-medium">Agent</th><th className="text-left py-2 px-3 font-medium">Status</th><th className="text-left py-2 px-3 font-medium">Resume</th><th className="text-left py-2 px-3 font-medium">Date</th></tr></thead>
                <tbody>{filteredSessions.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).slice(0, 20).map((s, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50"><td className="py-2.5 px-3 text-slate-800">{s.agentName || s.agentId}</td><td className="py-2.5 px-3"><StatusBadge status={s.status} /></td><td className="py-2.5 px-3 text-slate-500 truncate max-w-[200px]">{s.resumeBlobPath ? (<a href={`/api/admin/resume-download?path=${encodeURIComponent(s.resumeBlobPath)}`} className="text-blue-600 hover:underline inline-flex items-center gap-1" download><Download className="w-3 h-3" /> {s.resumeFileName || 'resume'}</a>) : (s.resumeFileName || '-')}</td><td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : '-'}</td></tr>
                ))}</tbody></table></div>
              )}
            </Panel>
          </div>
        )}

        {/* ─── BOOKINGS ──────────────────────────────────── */}
        {activeTab === 'bookings' && (() => {
          const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)
          const safePage = Math.min(bookingPage, totalPages || 1)
          const pagedBookings = filteredBookings.slice((safePage - 1) * bookingsPerPage, safePage * bookingsPerPage)
          const isAllSelected = filteredBookings.length > 0 && filteredBookings.every(b => selectedBookings.has(b.rowKey))
          return (
          <div className="space-y-6 animate-fadeIn">
            <Panel
              title="Call Requests"
              subtitle={`${callRequests.length} inbound · from the website "Book a Call" form`}
              action={
                <button onClick={refreshCallRequests} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 ${callRequestsLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              }
            >
              {callRequests.length === 0 ? <Empty text="No call requests yet" /> : (
                <div className="space-y-3">
                  {callRequests.map(cr => {
                    const submitted = cr.timestamp || cr.createdAt
                    return (
                      <div key={cr.rowKey} className={`border rounded-xl p-4 shadow-sm ${cr.replied ? 'bg-slate-50 border-slate-200' : 'bg-indigo-50/40 border-indigo-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-sm font-semibold text-slate-800">{cr.name || 'Unknown'}</h3>
                              {cr.replied
                                ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">Replied</span>
                                : <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">New</span>}
                              {cr.programTitle && <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{cr.programTitle}</span>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`mailto:${cr.email}`} className="text-blue-600 hover:underline truncate">{cr.email}</a>
                              </div>
                              {cr.whatsapp && (
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <a href={`https://wa.me/${cr.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{cr.whatsapp}</a>
                                </div>
                              )}
                              {cr.company && (
                                <div className="flex items-center gap-1.5 text-slate-600">
                                  <Database className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="truncate">{cr.company}{cr.designation ? ` · ${cr.designation}` : ''}</span>
                                </div>
                              )}
                              {submitted && (
                                <div className="flex items-center gap-1.5 text-slate-500">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{new Date(submitted).toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            {cr.message && (
                              <div className="mt-2 p-2 bg-white/70 rounded-lg text-xs text-slate-600 border border-slate-100 whitespace-pre-wrap">
                                <span className="font-medium text-slate-700">Message:</span> {cr.message}
                              </div>
                            )}
                            {cr.replied && cr.repliedAt && (
                              <p className="mt-2 text-xs text-emerald-700">Replied {new Date(cr.repliedAt).toLocaleString()}{cr.lastSubject ? ` · "${cr.lastSubject}"` : ''}</p>
                            )}
                          </div>
                          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                            <button onClick={() => openCallDraft(cr)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                              <Bot className="w-3.5 h-3.5" /> {cr.replied ? 'Draft again' : 'Draft & send reply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Panel>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Clock} label="Pending" value={filteredBookings.filter(b => b.status === 'pending').length} color="amber" />
              <StatCard icon={CheckCircle} label="Accepted" value={filteredBookings.filter(b => b.status === 'accepted').length} color="teal" />
              <StatCard icon={XCircle} label="Rejected" value={filteredBookings.filter(b => b.status === 'rejected').length} color="purple" />
              <StatCard icon={AlertTriangle} label="Change Requested" value={filteredBookings.filter(b => b.status === 'change-requested').length} color="blue" />
            </div>
            {filteredBookings.length > 0 && (() => {
              const total = filteredBookings.length
              const accepted = filteredBookings.filter(b => b.status === 'accepted').length
              const rejected = filteredBookings.filter(b => b.status === 'rejected').length
              const pending = filteredBookings.filter(b => b.status === 'pending').length
              const acceptRate = total ? Math.round((accepted / total) * 100) : 0
              return (
                <Panel title="Funnel" subtitle={`${getFilterLabel()} · ${total} total bookings`}>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"><p className="text-xs text-amber-700">Requested</p><p className="text-lg font-bold text-amber-900">{total}</p></div>
                    <span className="text-slate-300">{'>'}</span>
                    <div className="flex-1 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2"><p className="text-xs text-teal-700">Accepted</p><p className="text-lg font-bold text-teal-900">{accepted} <span className="text-xs font-normal text-teal-600">({acceptRate}%)</span></p></div>
                    <span className="text-slate-300">{'>'}</span>
                    <div className="flex-1 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2"><p className="text-xs text-rose-700">Rejected</p><p className="text-lg font-bold text-rose-900">{rejected}</p></div>
                    <span className="text-slate-300">{'>'}</span>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"><p className="text-xs text-slate-600">Open</p><p className="text-lg font-bold text-slate-800">{pending}</p></div>
                  </div>
                </Panel>
              )
            })()}
            <Panel title="Booking Requests" subtitle={`${filteredBookings.length} bookings — ${getFilterLabel()}`} action={
              <div className="flex items-center gap-2 flex-wrap">
                {selectedBookings.size > 0 && (
                  <>
                    <button onClick={() => {
                      const selected = filteredBookings.filter(b => selectedBookings.has(b.rowKey))
                      const csvData = selected.map(b => {
                        let outcome = ''
                        try { const notes: OutcomeNote[] = b.outcomeNotes ? JSON.parse(b.outcomeNotes) : []; outcome = notes.map(n => n.text).join('; ') } catch {}
                        return { Name: b.name, Email: b.email, Date: b.date, Time: `${b.startTime}${b.endTime && b.endTime !== b.startTime ? ' - ' + b.endTime : ''} UTC`, Service: b.serviceName, Status: b.status, Outcome: outcome }
                      })
                      downloadCSV(csvData, `bookings-report-${new Date().toISOString().slice(0, 10)}`)
                    }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download Report ({selectedBookings.size})
                    </button>
                    <button onClick={async () => {
                      if (!confirm(`Delete ${selectedBookings.size} booking(s)? This cannot be undone.`)) return
                      setBookingDeleting(true)
                      try {
                        const res = await fetch('/api/bookings/appointments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rowKeys: [...selectedBookings] }) })
                        if (res.ok) { const r = await fetch('/api/bookings/appointments'); if (r.ok) { const d = await r.json(); setBookingsData(d.appointments || []) }; setSelectedBookings(new Set()) }
                      } catch {} finally { setBookingDeleting(false) }
                    }} disabled={bookingDeleting} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors disabled:opacity-50">
                      <Trash2 className={`w-3.5 h-3.5 ${bookingDeleting ? 'animate-spin' : ''}`} /> Delete ({selectedBookings.size})
                    </button>
                  </>
                )}
                <button onClick={async () => { setBookingsLoading(true); try { const r = await fetch('/api/bookings/appointments'); if (r.ok) { const d = await r.json(); setBookingsData(d.appointments || []) } } catch {} finally { setBookingsLoading(false) } }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 ${bookingsLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>
            }>
              {filteredBookings.length === 0 ? <Empty text="No bookings in this period" /> : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 px-1 py-1 text-xs text-slate-500 cursor-pointer select-none">
                      <input type="checkbox" checked={isAllSelected} onChange={() => {
                        if (isAllSelected) { setSelectedBookings(new Set()) } else { setSelectedBookings(new Set(filteredBookings.map(b => b.rowKey))) }
                      }} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      Select all ({filteredBookings.length})
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Per page:</span>
                      <select value={bookingsPerPage} onChange={e => { setBookingsPerPage(Number(e.target.value)); setBookingPage(1) }} className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {[15, 30, 45, 60, 75, 90, 105].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  {pagedBookings.map(apt => {
                    const bookingDate = apt.date ? new Date(apt.date + 'T00:00:00') : null
                    const isPast = bookingDate ? bookingDate < new Date() : false
                    const statusColor = apt.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : apt.status === 'rejected' ? 'bg-red-100 text-red-700' : apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : apt.status === 'change-requested' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    const isSelected = selectedBookings.has(apt.rowKey)
                    return (
                      <div key={apt.rowKey} className={`border rounded-xl p-4 shadow-sm ${isSelected ? 'ring-2 ring-blue-400 border-blue-300' : ''} ${isPast && apt.status !== 'pending' ? 'bg-slate-50 border-slate-200 opacity-75' : apt.status === 'pending' ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-slate-200'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex flex-col items-center gap-2 shrink-0">
                            <input type="checkbox" checked={isSelected} onChange={() => {
                              const next = new Set(selectedBookings)
                              if (isSelected) next.delete(apt.rowKey); else next.add(apt.rowKey)
                              setSelectedBookings(next)
                            }} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            <div className="w-16 text-center">
                              {bookingDate && (
                                <>
                                  <div className="text-xs text-slate-500 uppercase">{bookingDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                                  <div className="text-2xl font-bold text-slate-800">{bookingDate.getDate()}</div>
                                  <div className="text-xs text-slate-500">{bookingDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                </>
                              )}
                            </div>
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

                          </div>

                          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                            {apt.joinWebUrl && (
                              <a href={apt.joinWebUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <Video className="w-3.5 h-3.5" /> Join Teams
                              </a>
                            )}
                            {apt.status === 'pending' && (
                              <button onClick={() => handleBookingAction(apt.rowKey, 'accept')} disabled={bookingsAction === apt.rowKey} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors disabled:opacity-50">
                                {bookingsAction === apt.rowKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Accept
                              </button>
                            )}
                            {(apt.status === 'pending' || apt.status === 'accepted') && (
                              <button onClick={() => openModal('reschedule', apt)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors">
                                <Clock className="w-3.5 h-3.5" /> Reschedule
                              </button>
                            )}
                            {apt.status === 'pending' && (
                              <button onClick={() => openModal('reject', apt)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                                <XCircle className="w-3.5 h-3.5" /> Reject / Change
                              </button>
                            )}
                            {apt.status === 'accepted' && (
                              <button onClick={() => openModal('reject', apt)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                                <XCircle className="w-3.5 h-3.5" /> Cancel
                              </button>
                            )}
                            <button onClick={() => openModal('outcome', apt)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors">
                              <FileText className="w-3.5 h-3.5" /> Outcome
                            </button>
                            <button onClick={() => openModal('reply', apt)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                              <Mail className="w-3.5 h-3.5" /> Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        {(safePage - 1) * bookingsPerPage + 1}–{Math.min(safePage * bookingsPerPage, filteredBookings.length)} of {filteredBookings.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setBookingPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Prev</button>
                        {(() => {
                          const pages: number[] = []
                          const start = Math.max(1, Math.min(safePage, totalPages - 4))
                          for (let i = start; i <= Math.min(start + 4, totalPages); i++) pages.push(i)
                          return pages.map(p => (
                            <button key={p} onClick={() => setBookingPage(p)} className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${p === safePage ? 'bg-blue-600 text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}>{p}</button>
                          ))
                        })()}
                        <button onClick={() => setBookingPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Panel>
          </div>
        ) })()}

        {/* ─── CALL REQUEST DRAFT/SEND MODAL ──────────────── */}
        {callDraft && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={() => setCallDraft(null)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Reply to {callDraft.req.name || 'call request'}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">To {callDraft.req.email} · from admin@gennoor.com (CC admin@gennoor.com)</p>
                </div>
                <button onClick={() => setCallDraft(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>

              {callDraft.sent ? (
                <div className="p-6 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-800 font-medium">Reply sent to {callDraft.req.email}</p>
                  <p className="text-sm text-slate-500 mt-1">A copy was CC&apos;d to admin@gennoor.com.</p>
                  <button onClick={() => setCallDraft(null)} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">Close</button>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Instructions for the AI (which day & times to offer)</label>
                    <textarea value={callDraft.instructions} onChange={e => setCallDraft(d => d && ({ ...d, instructions: e.target.value }))} rows={2}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
                  </div>
                  <button onClick={generateCallDraft} disabled={callDraft.drafting}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
                    {callDraft.drafting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    {callDraft.drafting ? 'Drafting with GPT-5.4…' : (callDraft.bodyHtml ? 'Regenerate draft' : 'Generate draft')}
                  </button>

                  {callDraft.error && <p className="text-sm text-red-600">{callDraft.error}</p>}

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Subject</label>
                    <input value={callDraft.subject} onChange={e => setCallDraft(d => d && ({ ...d, subject: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Body (editable HTML — wrapped in Gennoor branding on send)</label>
                    <textarea value={callDraft.bodyHtml} onChange={e => setCallDraft(d => d && ({ ...d, bodyHtml: e.target.value }))} rows={8}
                      placeholder="Click “Generate draft”, or write the email body here."
                      className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
                  </div>

                  {callDraft.bodyHtml && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Preview</label>
                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: callDraft.bodyHtml }} />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => setCallDraft(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                    <button onClick={sendCallDraft} disabled={callDraft.sending || !callDraft.bodyHtml.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50">
                      {callDraft.sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {callDraft.sending ? 'Sending…' : 'Send reply'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── BOOKING MODALS ─────────────────────────────── */}
        {bookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">
                  {bookingModal.type === 'outcome' && 'Meeting Outcome'}
                  {bookingModal.type === 'reply' && 'Reply to Customer'}
                  {bookingModal.type === 'reschedule' && 'Reschedule Booking'}
                  {bookingModal.type === 'reject' && (bookingModal.booking.status === 'accepted' ? 'Cancel Booking' : 'Reject / Suggest Change')}
                </h2>
                <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              {/* Booking details (shown in all modals) */}
              <div className="px-5 pt-4 pb-2">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{bookingModal.booking.serviceName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${bookingModal.booking.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : bookingModal.booking.status === 'rejected' ? 'bg-red-100 text-red-700' : bookingModal.booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{bookingModal.booking.status}</span>
                  </div>
                  <p className="text-slate-600"><strong>{bookingModal.booking.name}</strong> &middot; {bookingModal.booking.email}</p>
                  {bookingModal.booking.whatsapp && <p className="text-slate-500">WhatsApp: {bookingModal.booking.whatsapp}</p>}
                  <p className="text-slate-500">{bookingModal.booking.date} &middot; {bookingModal.booking.startTime}{bookingModal.booking.endTime !== bookingModal.booking.startTime ? ` – ${bookingModal.booking.endTime}` : ''} UTC</p>
                  {bookingModal.booking.topic && <p className="text-slate-500 mt-1">Topic: {bookingModal.booking.topic}</p>}
                  {bookingModal.booking.country && <p className="text-slate-500">{bookingModal.booking.country}{bookingModal.booking.timezone !== 'UTC' ? ` (${bookingModal.booking.timezone})` : ''}</p>}
                </div>
              </div>

              {/* ── OUTCOME MODAL ── */}
              {bookingModal.type === 'outcome' && (
                <div className="p-5 space-y-4">
                  {modalNotes.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-slate-700">Previous Notes</h3>
                      {modalNotes.map((note, i) => (
                        <div key={i} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <p className="text-sm text-slate-700">{note.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {modalNotes.length === 0 && <p className="text-sm text-slate-400">No outcome notes yet.</p>}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Add Note</label>
                    <textarea value={modalNewNote} onChange={e => setModalNewNote(e.target.value)} placeholder="Meeting outcome, follow-ups, action items..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" rows={3} />
                  </div>
                  <button onClick={saveOutcomeNote} disabled={modalSending || !modalNewNote.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50">
                    {modalSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Save Note
                  </button>
                </div>
              )}

              {/* ── REPLY MODAL ── */}
              {bookingModal.type === 'reply' && (
                <div className="p-5 space-y-4">
                  {bookingModal.booking.adminMessage && (
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-1">Previous Admin Message</h3>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">{bookingModal.booking.adminMessage}</div>
                    </div>
                  )}
                  {(() => { try { const notes: OutcomeNote[] = bookingModal.booking.outcomeNotes ? JSON.parse(bookingModal.booking.outcomeNotes) : []; return notes.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-1">Outcome Notes</h3>
                      {notes.map((n, i) => (
                        <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 mb-1">
                          {n.text} <span className="text-xs text-slate-400">— {new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : null } catch { return null } })()}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input type="text" value={modalSubject} onChange={e => setModalSubject(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea value={modalMessage} onChange={e => setModalMessage(e.target.value)} placeholder="Type your reply..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={4} />
                  </div>
                  <button onClick={sendReplyEmail} disabled={modalSending || !modalMessage.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
                    {modalSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Email
                  </button>
                </div>
              )}

              {/* ── RESCHEDULE MODAL ── */}
              {bookingModal.type === 'reschedule' && (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">New Date</label>
                      <input type="date" value={modalResched.date} onChange={e => setModalResched(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start (UTC)</label>
                      <input type="time" value={modalResched.startTime} onChange={e => setModalResched(p => ({ ...p, startTime: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End (UTC)</label>
                      <input type="time" value={modalResched.endTime} onChange={e => setModalResched(p => ({ ...p, endTime: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Note to Customer (optional)</label>
                    <textarea value={modalMessage} onChange={e => setModalMessage(e.target.value)} placeholder="Reason for rescheduling..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
                  </div>
                  <button onClick={() => handleBookingAction(bookingModal.booking.rowKey, 'reschedule', { message: modalMessage, newDate: modalResched.date, newStartTime: modalResched.startTime, newEndTime: modalResched.endTime })} disabled={bookingsAction === bookingModal.booking.rowKey || !modalResched.date || !modalResched.startTime} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50">
                    {bookingsAction === bookingModal.booking.rowKey ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />} Confirm Reschedule
                  </button>
                </div>
              )}

              {/* ── REJECT / CANCEL MODAL ── */}
              {bookingModal.type === 'reject' && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message to Customer (optional)</label>
                    <textarea value={modalMessage} onChange={e => setModalMessage(e.target.value)} placeholder="Reason for cancellation or suggestion..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" rows={3} />
                  </div>
                  <div className="flex gap-2">
                    {bookingModal.booking.status === 'pending' && (
                      <>
                        <button onClick={() => handleBookingAction(bookingModal.booking.rowKey, 'reject', { message: modalMessage })} disabled={bookingsAction === bookingModal.booking.rowKey} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
                          {bookingsAction === bookingModal.booking.rowKey ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Reject
                        </button>
                        <button onClick={() => handleBookingAction(bookingModal.booking.rowKey, 'suggest-change', { message: modalMessage })} disabled={bookingsAction === bookingModal.booking.rowKey} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
                          {bookingsAction === bookingModal.booking.rowKey ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Suggest Change
                        </button>
                      </>
                    )}
                    {bookingModal.booking.status === 'accepted' && (
                      <button onClick={() => handleBookingAction(bookingModal.booking.rowKey, 'cancel', { message: modalMessage })} disabled={bookingsAction === bookingModal.booking.rowKey} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50">
                        {bookingsAction === bookingModal.booking.rowKey ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── STORAGE ───────────────────────────────────── */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={HardDrive} label="Total Files" value={totalFiles} color="blue" />
              <StatCard icon={Database} label="Total Size" value={0} color="teal" subtitle={formatBytes(totalSize)} />
              <StatCard icon={Server} label="Containers" value={storageData?.containers.length || 0} color="amber" />
              <StatCard icon={FileText} label="Recent Uploads" value={filteredBlobs.length} color="purple" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Panel title="Storage by Container (KB)">{!storageData?.containers.length ? <Empty /> : <BarChartComponent data={storageData.containers.map(c => ({ name: c.name, value: Math.round(c.totalSizeBytes / 1024) }))} />}</Panel>
              <Panel title="Files by Container">{!storageData?.containers.length ? <Empty /> : <PieChartComponent data={storageData.containers.map(c => ({ name: c.name, value: c.blobCount }))} />}</Panel>
            </div>
            <Panel title="Recent Files" subtitle={getFilterLabel()} action={filteredBlobs.length > 0 ? <ExportButton onClick={() => downloadCSV(filteredBlobs as any, 'storage-files')} /> : undefined}>
              {filteredBlobs.length === 0 ? <Empty text="No files found" /> : (
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-3 font-medium">File</th><th className="text-left py-2 px-3 font-medium">Container</th><th className="text-left py-2 px-3 font-medium">Size</th><th className="text-left py-2 px-3 font-medium">Modified</th></tr></thead>
                <tbody>{filteredBlobs.map((b, i) => (
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
                <Panel title="Peak Traffic Hours">{(() => { const d = extractQueryRows(insightsData?.peakHours); return d.length ? <BarChartComponent data={d.map(r => ({ name: `${r.name}:00`, value: r.value }))} color="#8b5cf6" /> : <Empty /> })()}</Panel>
                <Panel title="Custom Events">{(() => { const d = extractQueryRows(insightsData?.eventsSummary); return d.length ? <BarChartComponent data={d.slice(0, 10).map(r => ({ ...r, name: r.name.length > 20 ? r.name.slice(0, 20) + '...' : r.name }))} color="#0d9488" /> : <Empty text="No events tracked" /> })()}</Panel>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Panel title="Device Types">{(() => { const d = extractQueryRows(insightsData?.deviceTypes); return d.length ? <PieChartComponent data={d} /> : <Empty /> })()}</Panel>
                <Panel title="Operating Systems">{(() => { const d = extractQueryRows(insightsData?.operatingSystems); return d.length ? <PieChartComponent data={d} /> : <Empty /> })()}</Panel>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Panel title="Browser Distribution">{(() => { const d = extractQueryRows(insightsData.browsers); return d.length ? <PieChartComponent data={d} /> : <Empty /> })()}</Panel>
                <Panel title="Top Countries (Server)">{(() => { const d = extractQueryRows(insightsData.countries); return d.length ? <BarChartComponent data={d} color="#8b5cf6" /> : <Empty /> })()}</Panel>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Panel title="Top Pages (Server)">{(() => { const d = extractQueryRows(insightsData.topPages); return d.length ? <BarChartComponent data={d.map(r => ({ ...r, name: r.name.length > 25 ? r.name.slice(0, 25) + '...' : r.name }))} color="#0d9488" /> : <Empty /> })()}</Panel>
                <Panel title="Slowest Pages (ms)">{(() => { const d = extractQueryRows(insightsData?.slowestPages); return d.length ? <BarChartComponent data={d.map(r => ({ name: r.name.length > 25 ? r.name.slice(0, 25) + '...' : r.name, value: Math.round(r.value) }))} color="#f59e0b" /> : <Empty /> })()}</Panel>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Panel title="Error Types">{(() => { const d = extractQueryRows(insightsData.errors); return d.length ? <BarChartComponent data={d.map(r => ({ ...r, name: r.name.length > 20 ? r.name.slice(0, 20) + '...' : r.name }))} color="#ef4444" /> : <Empty text="No errors" /> })()}</Panel>
                <Panel title="Failed URLs">{(() => { const d = extractQueryRows(insightsData?.failedUrls); return d.length ? <BarChartComponent data={d.map(r => ({ ...r, name: r.name.length > 25 ? r.name.slice(0, 25) + '...' : r.name }))} color="#ef4444" /> : <Empty text="No failures" /> })()}</Panel>
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

        {/* ─── INDEXING STATUS ────────────────────────────── */}
        {activeTab === 'indexing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Search} label="Sitemap URLs" value={seoData?.sitemapUrls || 0} color="blue" />
              <StatCard icon={Globe} label="Google Indexed (90d)" value={gscData?.indexedCount || 0} color="amber" subtitle={!gscData ? 'Loading...' : gscData.configured === false ? 'Not configured' : undefined} />
              <StatCard icon={Send} label="Last Manual Push" value={indexNowState.result?.submitted || 0} color="teal" />
              <StatCard icon={Clock} label="Auto Trigger" value={0} color="purple" subtitle="Each main deploy" />
            </div>

            <Panel title="Automation" subtitle="One GitHub Actions workflow runs both Bing + Google in parallel">
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="w-10 h-10 bg-white border border-emerald-300 rounded-lg flex items-center justify-center shrink-0"><Zap className="w-5 h-5 text-emerald-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">SEO Re-index workflow — Bing + Google in one shot</p>
                    <p className="text-xs text-slate-500 mt-0.5">Auto-fires after every successful main deploy (90s wait so Azure propagates), plus safety cron every 4 days at 03:00 UTC. Two parallel jobs: <strong>IndexNow</strong> submits every <code className="text-xs px-1 py-0.5 bg-white rounded border border-emerald-200">/sitemap.xml</code> URL to Bing / Yandex / Naver / Seznam; <strong>GSC</strong> PUTs the sitemap to Google Search Console via OAuth.</p>
                  </div>
                  <a href="https://github.com/lostspace003/gennoor-tech/actions/workflows/seo-reindex.yml" target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0" title="View workflow runs"><ExternalLink className="w-4 h-4" /></a>
                </div>
              </div>
            </Panel>

            <Panel title="Google Coverage" subtitle={gscData?.checkedAt ? `Live from Search Console API — checked ${new Date(gscData.checkedAt).toLocaleString()}` : 'Live from Search Console API'}>
              {!gscData ? (
                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg"><RefreshCw className="w-4 h-4 animate-spin text-slate-400" /><p className="text-sm text-slate-500">Loading Google data...</p></div>
              ) : gscData.configured === false ? (
                <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-10 h-10 bg-white border border-amber-300 rounded-lg flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Not yet configured</p>
                    <p className="text-xs text-slate-500 mt-0.5">{gscData.reason || gscData.error || 'See workflow logs for details.'}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <a href="https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=406342268554" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Enable Search Console API →</a>
                      <a href="https://search.google.com/search-console/users" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Add service account to GSC →</a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">Indexed (last 90d)</p><p className="text-xl font-bold text-slate-800">{gscData.indexedCount?.toLocaleString() || 0}</p></div>
                    <div className="p-3 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">Clicks (28d)</p><p className="text-xl font-bold text-slate-800">{Math.round(gscData.summary28d?.clicks || 0).toLocaleString()}</p></div>
                    <div className="p-3 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">Impressions (28d)</p><p className="text-xl font-bold text-slate-800">{Math.round(gscData.summary28d?.impressions || 0).toLocaleString()}</p></div>
                    <div className="p-3 bg-slate-50 rounded-lg"><p className="text-xs text-slate-500">Avg Position (28d)</p><p className="text-xl font-bold text-slate-800">{(gscData.summary28d?.position || 0).toFixed(1)}</p></div>
                  </div>
                  {gscData.sitemaps && gscData.sitemaps.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">Sitemaps known to Google</p>
                      <div className="space-y-2">
                        {gscData.sitemaps.map(s => (
                          <div key={s.path} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-800 truncate">{s.path}</p>
                              <p className="text-[11px] text-slate-500">Submitted {s.lastSubmitted ? new Date(s.lastSubmitted).toLocaleDateString() : '—'} · Downloaded {s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleDateString() : '—'}</p>
                            </div>
                            {s.errors && parseInt(s.errors) > 0 ? <span className="text-[11px] px-2 py-0.5 bg-rose-100 text-rose-700 rounded">{s.errors} errors</span> : s.warnings && parseInt(s.warnings) > 0 ? <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded">{s.warnings} warnings</span> : <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">OK</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {gscData.topPages && gscData.topPages.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-2">Top pages by clicks (28d)</p>
                      <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-500 border-b border-slate-200"><th className="text-left py-2 px-2 font-medium">Page</th><th className="text-right py-2 px-2 font-medium">Clicks</th><th className="text-right py-2 px-2 font-medium">Impr.</th><th className="text-right py-2 px-2 font-medium">CTR</th><th className="text-right py-2 px-2 font-medium">Pos.</th></tr></thead>
                      <tbody>{gscData.topPages.map((p, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2 px-2 text-slate-700 max-w-[280px] truncate"><a href={p.page} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">{p.page.replace('https://gennoor.com', '')}</a></td>
                          <td className="py-2 px-2 text-right text-slate-800 font-medium">{Math.round(p.clicks).toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-slate-600">{Math.round(p.impressions).toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-slate-500">{((p.ctr || 0) * 100).toFixed(1)}%</td>
                          <td className="py-2 px-2 text-right text-slate-500">{(p.position || 0).toFixed(1)}</td>
                        </tr>
                      ))}</tbody></table></div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        setGscResubmit({ submitting: true })
                        try {
                          const res = await fetch('/api/admin/gsc-resubmit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
                          const data = await res.json()
                          setGscResubmit({ submitting: false, result: { success: res.ok, message: data.message || data.error } })
                        } catch (err) {
                          setGscResubmit({ submitting: false, result: { success: false, message: err instanceof Error ? err.message : 'Network error' } })
                        }
                      }}
                      disabled={gscResubmit.submitting}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                    >
                      {gscResubmit.submitting ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Resubmitting...</> : <><Send className="w-3.5 h-3.5" /> Resubmit sitemap to Google</>}
                    </button>
                  </div>
                  {gscResubmit.result && (
                    <p className={`text-xs text-right ${gscResubmit.result.success ? 'text-emerald-600' : 'text-rose-600'}`}>{gscResubmit.result.success ? '✓ Sitemap resubmitted' : `✗ ${gscResubmit.result.message}`}</p>
                  )}
                </div>
              )}
            </Panel>

            <Panel title="Search Engine Status" subtitle="Where each engine stands">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-10 h-10 bg-white border border-amber-300 rounded-lg flex items-center justify-center shrink-0"><Search className="w-5 h-5 text-amber-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Google</p>
                    <p className="text-xs text-slate-500">{gscData?.configured ? `${gscData.indexedCount?.toLocaleString() || 0} pages indexed of ${seoData?.sitemapUrls || 0} (live from Search Console API). Sitemap auto-resubmitted every 4 days.` : 'Google does NOT participate in IndexNow. Sitemap is auto-resubmitted via Search Console API every 4 days (once you enable the API).'}</p>
                  </div>
                  <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"><ExternalLink className="w-4 h-4" /></a>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-10 h-10 bg-white border border-blue-300 rounded-lg flex items-center justify-center shrink-0"><Globe className="w-5 h-5 text-blue-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Bing / Yandex / Naver / Seznam</p>
                    <p className="text-xs text-slate-500">Receive every sitemap URL via IndexNow on each cron run ({seoData?.sitemapUrls || 0} URLs per cycle). Engines typically crawl within hours. Verify the site in Bing Webmaster Tools for the live indexed count.</p>
                  </div>
                  <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"><ExternalLink className="w-4 h-4" /></a>
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="w-10 h-10 bg-white border border-emerald-300 rounded-lg flex items-center justify-center shrink-0"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">SEO Fixes Applied</p>
                    <p className="text-xs text-slate-500">www → non-www 301 redirect active. Canonical domain: gennoor.com. IndexNow key live. Sitemap covers home, services, academy, blog, case studies, training, certs, industries, and PoCs.</p>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Manual Push" subtitle="On-demand submit between cron runs">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm text-slate-600">
                  <p>Submits <strong>all {seoData?.sitemapUrls || 0}</strong> URLs from <code className="text-xs px-1.5 py-0.5 bg-slate-100 rounded">/sitemap.xml</code> to IndexNow immediately. Use after publishing time-sensitive content (the cron handles the rest every 4 days).</p>
                  {indexNowState.result && (
                    <p className={`mt-2 text-xs ${indexNowState.result.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {indexNowState.result.success
                        ? `✓ Submitted ${indexNowState.result.submitted}/${indexNowState.result.total} URLs at ${new Date(indexNowState.result.submittedAt!).toLocaleString()}`
                        : `✗ ${indexNowState.result.error || 'Failed'}`}
                    </p>
                  )}
                </div>
                <button
                  onClick={async () => {
                    setIndexNowState({ pushing: true })
                    try {
                      const res = await fetch('/api/admin/indexnow-push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
                      const data = await res.json()
                      setIndexNowState({ pushing: false, result: data })
                    } catch (err) {
                      setIndexNowState({ pushing: false, result: { success: false, error: err instanceof Error ? err.message : 'Network error' } })
                    }
                  }}
                  disabled={indexNowState.pushing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {indexNowState.pushing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Pushing...</> : <><Send className="w-4 h-4" /> Push Now</>}
                </button>
              </div>
            </Panel>

            <Panel title="Quick Actions" subtitle="Search engine tools">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{[
                { title: 'Google Search Console', description: 'Check indexed pages & request indexing', href: 'https://search.google.com/search-console', icon: Search },
                { title: 'Bing Webmaster Tools', description: 'Submit URLs & check crawl status', href: 'https://www.bing.com/webmasters', icon: Globe },
                { title: 'SEO Re-index Workflow', description: 'View automated Bing + Google reindex history', href: 'https://github.com/lostspace003/gennoor-tech/actions/workflows/seo-reindex.yml', icon: Zap },
                { title: 'Google Rich Results', description: 'Test structured data markup', href: 'https://search.google.com/test/rich-results', icon: Code2 },
                { title: 'Sitemap', description: 'View current sitemap.xml', href: '/sitemap.xml', icon: FileText },
                { title: 'Robots.txt', description: 'View crawl directives', href: '/robots.txt', icon: Shield },
                { title: 'IndexNow Key', description: 'Verify key file is live', href: '/1774b0e00b584216b04f41a75b9de8e2.txt', icon: Lock },
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

        {/* ─── CERTIFICATES ─────────────────────────────── */}
        {activeTab === 'certificates' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={GraduationCap} label="Total Issued" value={certData?.summary?.issued || 0} color="blue" />
              <StatCard icon={Users} label="Unique Learners" value={certData?.summary?.uniqueLearners || 0} color="teal" />
              <StatCard icon={TrendingUp} label="Issued (7d)" value={certData?.summary?.past7 || 0} color="amber" />
              <StatCard icon={XCircle} label="Revoked" value={certData?.summary?.revoked || 0} color="purple" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Panel title="Issuances by Course" subtitle="Lifetime certs per course">
                {(certData?.perCourse || []).length === 0 ? <Empty /> : (
                  <RankedList items={(certData?.perCourse || []).slice(0, 10).map(c => [c.title || c.slug, c.count] as [string, number])} />
                )}
              </Panel>
              <Panel title="Recent Issuances" subtitle="Last 100 certs" action={(certData?.recent?.length || 0) > 0 ? <ExportButton onClick={() => downloadCSV(certData?.recent as any, 'certificates')} /> : undefined}>
                {(certData?.recent?.length || 0) === 0 ? <Empty text="No certificates issued yet" /> : (
                  <div className="max-h-[500px] overflow-y-auto -mx-2 px-2 space-y-2">
                    {(certData?.recent || []).slice(0, 30).map(c => (
                      <div key={c.certId} className="flex items-center gap-3 p-2.5 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-lg transition-all duration-150">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{c.recipientName}</p>
                          <p className="text-xs text-slate-500 truncate">{c.workshopTitle || c.workshopSlug}</p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}</span>
                        {c.verifyUrl && <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="Verify"><ExternalLink className="w-3.5 h-3.5" /></a>}
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </div>
        )}

        {/* ─── COURSE FEEDBACK ──────────────────────────── */}
        {activeTab === 'course-feedback' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={MessageSquare} label="Reviews" value={feedbackData?.summary?.total || 0} color="blue" />
              <StatCard icon={CheckCircle} label="Avg Rating" value={feedbackData?.summary?.total ? Math.round((feedbackData.summary.avgRating || 0) * 10) / 10 : 0} color="teal" subtitle={`${feedbackData?.summary?.avgRating || 0}★`} />
              <StatCard icon={CheckCircle2} label="5★ Reviews" value={feedbackData?.summary?.fiveStar || 0} color="amber" />
              <StatCard icon={AlertTriangle} label="Low (1-2★)" value={feedbackData?.summary?.lowRated || 0} color="purple" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Panel title="By Course" subtitle="Avg rating + review count">
                {(feedbackData?.perCourse || []).length === 0 ? <Empty /> : (
                  <div className="space-y-2.5">
                    {(feedbackData?.perCourse || []).slice(0, 12).map(c => (
                      <div key={c.courseId} className="flex items-center gap-3">
                        <span className="text-sm text-slate-700 flex-1 truncate" title={c.courseId}>{c.courseId}</span>
                        <span className={`text-xs font-medium ${c.avgRating >= 4 ? 'text-emerald-600' : c.avgRating >= 3 ? 'text-amber-600' : 'text-rose-600'}`}>{c.avgRating}★</span>
                        <span className="text-xs text-slate-400 w-12 text-right">{c.count} {c.count === 1 ? 'review' : 'reviews'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
              <Panel title="Recent Reviews" subtitle="Last 30">
                {(feedbackData?.recent?.length || 0) === 0 ? <Empty text="No feedback yet" /> : (
                  <div className="max-h-[500px] overflow-y-auto -mx-2 px-2 space-y-2">
                    {(feedbackData?.recent || []).slice(0, 30).map((r, i) => (
                      <div key={i} className="p-2.5 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-lg transition-all duration-150">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="text-sm font-medium text-slate-800 truncate">{r.learnerName || r.learnerEmail}</span>
                          <span className={`text-xs font-medium ${r.rating >= 4 ? 'text-emerald-600' : r.rating >= 3 ? 'text-amber-600' : 'text-rose-600'}`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-1 truncate">{r.courseId}</p>
                        {r.comments && <p className="text-xs text-slate-600 italic">&ldquo;{r.comments}&rdquo;</p>}
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </div>
        )}

        {/* ─── AUTH LOG ──────────────────────────────────── */}
        {activeTab === 'auth-log' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Lock} label="Recent Sign-ins" value={authLog.length} color="blue" />
              <StatCard icon={Users} label="Unique Admins" value={new Set(authLog.map(l => l.email)).size} color="teal" />
              <StatCard icon={Globe} label="Unique IPs" value={new Set(authLog.map(l => l.ip)).size} color="amber" />
              <StatCard icon={Clock} label="Last Sign-in" value={authLog.length} color="purple" />
            </div>
            <Panel title="Admin Sign-in History" subtitle="Last 50 admin authentications">
              {authLog.length === 0 ? <Empty text="No sign-in events recorded yet" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-medium">When</th>
                        <th className="text-left py-2 px-3 font-medium">Admin</th>
                        <th className="text-left py-2 px-3 font-medium">IP</th>
                        <th className="text-left py-2 px-3 font-medium">User Agent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authLog.map((l, i) => (
                        <tr key={l.rowKey || i} className="border-b border-slate-100 hover:bg-blue-50/50">
                          <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{new Date(l.loginAt).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-slate-800">{l.name || l.email}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-xs">{l.ip}</td>
                          <td className="py-2.5 px-3 text-slate-500 text-xs truncate max-w-[400px]">{l.userAgent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

        {activeTab === 'ai-readiness' && (
          <div className="space-y-6">
            {!aiReadinessData ? <Empty text="Loading AI Readiness data..." /> : (<>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={BookOpen} label="Quick Scans" value={filteredAiReports.filter((r: any) => r.reportType === 'quick-scan' || r.reportType === 'deep-dive').length} color="teal" />
                <StatCard icon={FileText} label="Deep Dives" value={filteredAiReports.filter((r: any) => r.reportType === 'blueprint').length} color="amber" />
                <StatCard icon={Bot} label="Total Reports" value={filteredAiReports.length} color="purple" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard icon={Download} label="Downloads" value={aiReadinessData.summary?.downloads || 0} color="blue" />
                <StatCard icon={Send} label="Emails Sent" value={aiReadinessData.summary?.emailsSent || 0} color="teal" />
                <StatCard icon={TrendingUp} label="Avg Rating" value={0} subtitle={`${aiReadinessData.summary?.avgRating || 0}/5`} color="amber" />
                <StatCard icon={MessageSquare} label="Feedback" value={filteredAiFeedback.length} color="purple" />
                <StatCard icon={Users} label="Org Leads" value={filteredAiFeedback.filter((f: any) => f.orgInterest === 'yes').length} color="teal" />
              </div>

              <Panel title="Score Distribution" subtitle="All assessment scores by range (last 90 days)">
                <BarChartComponent data={aiReadinessData.scoreDist || []} color="#2563eb" />
              </Panel>

              <Panel title="Recent Submissions" subtitle={`${filteredAiReports.length} reports — ${getFilterLabel()}`}>
                {filteredAiReports.length === 0 ? <Empty text="No submissions yet" /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                          <th className="pb-2 pr-4 font-medium">Name</th>
                          <th className="pb-2 pr-4 font-medium">Email</th>
                          <th className="pb-2 pr-4 font-medium">Type</th>
                          <th className="pb-2 pr-4 font-medium">Score</th>
                          <th className="pb-2 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAiReports.slice(0, 25).map((r: any, i: number) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-2.5 pr-4 font-medium text-slate-800">{r.name || '-'}</td>
                            <td className="py-2.5 pr-4 text-slate-600 text-xs">{r.email}</td>
                            <td className="py-2.5 pr-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.reportType === 'quick-scan' || r.reportType === 'deep-dive' ? 'bg-teal-100 text-teal-700' : r.reportType === 'blueprint' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                {r.reportType === 'quick-scan' || r.reportType === 'deep-dive' ? 'Quick Scan' : r.reportType === 'blueprint' ? 'Deep Dive' : r.reportType || 'Unknown'}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4 font-semibold text-slate-800">{r.overallScore || '-'}</td>
                            <td className="py-2.5 text-slate-500 text-xs">{r.generatedAt ? new Date(r.generatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>

              <Panel title="Interest-form Leads" subtitle={`${(aiReadinessData.leads || []).length} leads — pipeline from AI Readiness funnel`} action={(aiReadinessData.leads?.length || 0) > 0 ? <ExportButton onClick={() => downloadCSV(aiReadinessData.leads as any, 'ai-readiness-leads')} /> : undefined}>
                {(aiReadinessData.leads || []).length === 0 ? <Empty text="No interest-form leads yet" /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                          <th className="pb-2 pr-4 font-medium">Name</th>
                          <th className="pb-2 pr-4 font-medium">Email</th>
                          <th className="pb-2 pr-4 font-medium">Company</th>
                          <th className="pb-2 pr-4 font-medium">Interested in</th>
                          <th className="pb-2 font-medium">When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(aiReadinessData.leads || []).slice(0, 30).map((l: any, i: number) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors duration-150">
                            <td className="py-2.5 pr-4 font-medium text-slate-800">{l.name || '-'}</td>
                            <td className="py-2.5 pr-4 text-slate-600 text-xs">{l.email}</td>
                            <td className="py-2.5 pr-4 text-slate-600 text-xs">{l.company || '-'}</td>
                            <td className="py-2.5 pr-4 text-slate-500 text-xs">{l.option || '-'}</td>
                            <td className="py-2.5 text-slate-500 text-xs">{l.submittedAt ? new Date(l.submittedAt).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>

              <Panel title="User Feedback" subtitle={`${filteredAiFeedback.length} responses — ${getFilterLabel()}`}>
                {filteredAiFeedback.length === 0 ? <Empty text="No feedback yet" /> : (
                  <div className="space-y-2">
                    {filteredAiFeedback.slice(0, 15).map((f: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, s) => (
                            <svg key={s} className={`w-4 h-4 ${s < f.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800 font-medium truncate">{f.name || f.email}</p>
                          {f.comment && <p className="text-xs text-slate-500 mt-0.5 truncate">{f.comment}</p>}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${f.reportType === 'quick-scan' || f.reportType === 'deep-dive' ? 'bg-teal-100 text-teal-700' : f.reportType === 'blueprint' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {f.reportType === 'quick-scan' || f.reportType === 'deep-dive' ? 'Quick Scan' : f.reportType === 'blueprint' ? 'Deep Dive' : f.reportType || '-'}
                        </span>
                        {f.orgInterest === 'yes' && <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Org Lead</span>}
                        <span className="text-xs text-slate-400">{f.submittedAt ? new Date(f.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </>)}
          </div>
        )}

          </div>{/* end flex-1 content */}
        </div>{/* end flex row */}
      </div>
    </div>
  )
}

// ─── Reusable Components ─────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, subtitle }: { icon: any; label: string; value: number; color: 'blue' | 'teal' | 'amber' | 'purple'; subtitle?: string }) {
  const colors = { blue: 'bg-blue-100 text-blue-600', teal: 'bg-teal-100 text-teal-600', amber: 'bg-amber-100 text-amber-600', purple: 'bg-purple-100 text-purple-600' }
  return (
    <div className="admin-card bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon className="w-5 h-5" /></div>
        <div><p className="text-2xl font-bold text-slate-800">{subtitle || value.toLocaleString()}</p><p className="text-xs text-slate-500">{label}</p></div>
      </div>
    </div>
  )
}

function Panel({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="admin-card bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
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
