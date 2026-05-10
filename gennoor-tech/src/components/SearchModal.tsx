'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Fuse, { type IFuseOptions } from 'fuse.js'

interface SearchablePage {
  title: string
  description: string
  href: string
  category: string
  keywords: string[]
}

const pages: SearchablePage[] = [
  // Programs
  { title: 'Training Programs', description: 'Corporate AI training courses & bootcamps', href: '/services/training', category: 'Programs', keywords: ['corporate training', 'bootcamp', 'workshop', 'learn', 'upskill', 'course catalog', 'AI training'] },
  { title: 'Azure AI Foundry Workshop', description: 'Hands-on Azure AI workshop', href: '/services/azure-ai-foundry-workshop', category: 'Programs', keywords: ['azure', 'microsoft', 'foundry', 'hands-on', 'workshop', 'cloud AI', 'cognitive services'] },
  { title: 'Copilot Studio Training', description: 'Build AI copilots with Microsoft', href: '/services/copilot-studio-training', category: 'Programs', keywords: ['copilot', 'microsoft', 'chatbot', 'low-code', 'power platform', 'virtual agent'] },
  { title: 'Enterprise AI Roadmap Workshop', description: 'Strategic AI planning workshop', href: '/services/enterprise-ai-roadmap-workshop', category: 'Programs', keywords: ['strategy', 'roadmap', 'planning', 'executive', 'C-suite', 'transformation', 'digital'] },
  { title: 'Certifications', description: 'Microsoft certification prep courses', href: '/services/certifications', category: 'Programs', keywords: ['exam', 'cert', 'microsoft certified', 'badge', 'credential', 'prep', 'study', 'AZ', 'AI', 'PL', 'SC', 'DP'] },
  { title: 'Claude for Productivity', description: 'Free hands-on Claude workshop — Event completed, view recap', href: '/workshops/claude-cowork', category: 'Programs', keywords: ['claude', 'anthropic', 'cowork', 'free workshop', 'automation', 'AI assistant', 'productivity'] },
  // Services
  { title: 'AI Strategy & Consulting', description: 'Enterprise AI roadmaps & governance frameworks', href: '/services/ai-strategy', category: 'Services', keywords: ['consulting', 'strategy', 'governance', 'ROI', 'advisory', 'digital transformation', 'enterprise'] },
  { title: 'PoC Development', description: 'Production-ready AI prototypes & demos', href: '/services/poc-development', category: 'Services', keywords: ['prototype', 'proof of concept', 'demo', 'MVP', 'build', 'development', 'document intelligence', 'chatbot'] },
  { title: 'Agentic AI Solutions', description: 'Multi-agent orchestration with LangChain & CrewAI', href: '/services/agentic-ai', category: 'Services', keywords: ['agent', 'langchain', 'crewai', 'autogen', 'orchestration', 'multi-agent', 'autonomous', 'LLM'] },
  { title: 'Collaboration', description: 'Partnership and collaboration opportunities', href: '/services/collaboration', category: 'Services', keywords: ['partner', 'collaborate', 'joint venture', 'work together', 'alliance'] },
  // Resources
  { title: 'AI Academy', description: 'Free AI courses and learning paths', href: '/ai-academy', category: 'Resources', keywords: ['free course', 'learn', 'academy', 'education', 'self-paced', 'AB-100', 'beginner', 'fundamentals'] },
  { title: 'Blog', description: 'AI insights, tutorials & articles', href: '/resources/blog', category: 'Resources', keywords: ['article', 'post', 'tutorial', 'insights', 'news', 'write-up', 'thought leadership'] },
  { title: 'Videos', description: 'Training videos & tutorials', href: '/resources/videos', category: 'Resources', keywords: ['video', 'youtube', 'tutorial', 'watch', 'recording', 'demo'] },
  { title: 'Webinars', description: 'Live and recorded webinar sessions', href: '/webinars', category: 'Resources', keywords: ['webinar', 'live session', 'online event', 'recording', 'presentation'] },
  { title: 'Workshops', description: 'Free hands-on AI workshops', href: '/workshops', category: 'Resources', keywords: ['workshop', 'hands-on', 'live', 'free session', 'claude cowork', 'bootcamp'] },
  { title: 'AI Readiness Assessment', description: 'Check your organization\'s AI readiness', href: '/ai-readiness', category: 'Resources', keywords: ['assessment', 'readiness', 'quiz', 'score', 'evaluate', 'maturity', 'checklist'] },
  // Guides
  { title: 'AI-102 Azure AI Engineer Guide', description: 'Study guide for Azure AI Engineer certification', href: '/guides/ai-102-azure-ai-engineer', category: 'Resources', keywords: ['AI-102', 'azure AI engineer', 'exam guide', 'study', 'certification prep'] },
  { title: 'MS-4004 Copilot for M365 Guide', description: 'Guide for Microsoft Copilot certification', href: '/guides/ms-4004-copilot-365', category: 'Resources', keywords: ['MS-4004', 'copilot', 'microsoft 365', 'exam guide', 'study'] },
  { title: 'PL-300 Power BI Analyst Guide', description: 'Study guide for Power BI certification', href: '/guides/pl-300-power-bi-analyst', category: 'Resources', keywords: ['PL-300', 'power BI', 'analyst', 'data visualization', 'exam guide'] },
  { title: 'Agentic AI Guide', description: 'Complete guide to agentic AI systems', href: '/resources/guides/agentic-ai', category: 'Resources', keywords: ['agentic', 'agent', 'autonomous AI', 'guide', 'multi-agent'] },
  { title: 'Enterprise AI Training Guide', description: 'Guide to corporate AI training programs', href: '/resources/guides/enterprise-ai-training', category: 'Resources', keywords: ['enterprise', 'corporate training', 'guide', 'L&D', 'upskilling'] },
  { title: 'Microsoft Copilot Studio Guide', description: 'Guide to building with Copilot Studio', href: '/resources/guides/microsoft-copilot-studio', category: 'Resources', keywords: ['copilot studio', 'microsoft', 'guide', 'chatbot', 'virtual agent'] },
  // About
  { title: 'My Journey', description: '14+ years in enterprise AI across 6 countries', href: '/about/journey', category: 'About', keywords: ['about', 'jalal', 'journey', 'experience', 'background', 'bio', 'who'] },
  { title: 'Gennoor Tech', description: 'About the company and mission', href: '/about/company', category: 'About', keywords: ['company', 'about us', 'mission', 'vision', 'gennoor'] },
  { title: 'Professional Certifications', description: '16 Microsoft & AI certifications', href: '/about/certifications', category: 'About', keywords: ['certifications', 'credentials', 'badges', 'microsoft certified', 'MCT', 'qualifications'] },
  { title: 'Case Studies', description: 'Client success stories & outcomes', href: '/portfolio/case-studies', category: 'About', keywords: ['case study', 'success story', 'client', 'results', 'outcome', 'portfolio'] },
  { title: 'Client Testimonials', description: 'What clients say about our work', href: '/portfolio/testimonials', category: 'About', keywords: ['testimonial', 'review', 'feedback', 'client says', 'recommendation'] },
  { title: 'Open Source', description: 'Community contributions & projects', href: '/portfolio/open-source', category: 'About', keywords: ['open source', 'github', 'contribution', 'community', 'projects'] },
  // Other
  { title: 'Contact', description: 'Get in touch with us', href: '/contact', category: 'Contact', keywords: ['contact', 'email', 'reach out', 'enquiry', 'message', 'get in touch'] },
  { title: 'Book a Discovery Call', description: 'Schedule a free consultation', href: '/resources/calendar', category: 'Contact', keywords: ['book', 'call', 'schedule', 'meeting', 'consultation', 'calendar', 'appointment'] },
]

const categoryOrder = ['Programs', 'Services', 'Resources', 'About', 'Contact']

const fuseOptions: IFuseOptions<SearchablePage> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'keywords', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fuse = useMemo(() => new Fuse(pages, fuseOptions), [])

  const filtered = query.trim()
    ? fuse.search(query).map(r => r.item)
    : pages

  const grouped = categoryOrder
    .map(cat => ({ category: cat, items: filtered.filter(p => p.category === cat) }))
    .filter(g => g.items.length > 0)

  const flatItems = grouped.flatMap(g => g.items)

  const navigate = useCallback((href: string) => {
    onClose()
    setQuery('')
    router.push(href)
  }, [onClose, router])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
        e.preventDefault()
        navigate(flatItems[selectedIndex].href)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, flatItems, selectedIndex, navigate, onClose])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, programs, services..."
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 rounded border border-gray-200">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            grouped.map(group => (
              <div key={group.category}>
                <div className="px-4 pt-3 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {group.category}
                </div>
                {group.items.map(item => {
                  const idx = flatItems.indexOf(item)
                  return (
                    <button
                      key={item.href}
                      data-index={idx}
                      onClick={() => navigate(item.href)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        idx === selectedIndex
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-gray-400 truncate">{item.description}</div>
                      </div>
                      <ArrowRight className={cn(
                        'w-4 h-4 shrink-0 transition-opacity',
                        idx === selectedIndex ? 'opacity-100' : 'opacity-0'
                      )} />
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-400">
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">&uarr;&darr;</kbd> navigate</span>
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">&crarr;</kbd> open</span>
          <span><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono border border-gray-200">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
