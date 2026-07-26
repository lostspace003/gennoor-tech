// Shared CRM lead types — used by both API routes and the CRM UI.
// Keep this file free of server-only imports.

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type ProcessStatus = 'active' | 'paused' | 'stopped'
export type PipelineStage = 'diagnose' | 'train' | 'poc' | 'development' | 'sustain'
export type TechProfile = 'technical' | 'non-technical'

export const PIPELINE_STAGES: PipelineStage[] = ['diagnose', 'train', 'poc', 'development', 'sustain']

export interface LeadActivity {
  at: string
  by: string
  type: 'created' | 'updated' | 'research' | 'chat' | 'email' | 'stage' | 'status' | 'followup' | 'imported' | 'note'
  description: string
}

export interface EmailRecord {
  at: string
  by: string
  to: string
  subject: string
  status: 'sent' | 'failed'
  body?: string
  cc?: string[]
}

export interface FollowUp {
  id: string
  type: 'webinar' | 'training'
  title: string
  date: string
  time: string
  notes?: string
  posterBlob?: string
  sentAt?: string
  createdBy: string
  createdAt: string
}

export interface AIResearch {
  summary: string
  insights: string[]
  opportunities: string[]
  approach: string
  techOrNonTech: TechProfile
  lastUpdated: string
  sources?: Array<{ title: string; url: string }>
  webGrounded?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  designation: string
  linkedin: string
  website: string
  status: LeadStatus
  processStatus: ProcessStatus
  stage: PipelineStage
  priority: string
  leadType: string
  sector: string
  region: string
  country: string
  city: string
  value: number
  score: number
  owner: string
  source: string
  tags: string[]
  notes: string
  altEmails?: string[]
  // Pool model: owner === '' means unclaimed (in the pool, visible to all).
  // Claiming sets owner; releasing clears it. Dumped leads are parked with a reason.
  dumped?: { at: string; by: string; reason: string }
  techProfile?: TechProfile
  aiResearch?: AIResearch
  researchChat: ChatMessage[]
  finalizedPitch?: string
  emailHistory: EmailRecord[]
  activities: LeadActivity[]
  followUps: FollowUp[]
  createdAt: string
  updatedAt: string
  lastActivity: string
}

// Every field except name may be blank. Callers fill what they have.
export function newLead(partial: Partial<Lead> & { name: string }, by: string): Lead {
  const now = new Date().toISOString()
  return {
    id: partial.id || `LEAD-${now.slice(0, 10)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    name: partial.name,
    email: partial.email || '',
    phone: partial.phone || '',
    company: partial.company || '',
    designation: partial.designation || '',
    linkedin: partial.linkedin || '',
    website: partial.website || '',
    status: partial.status || 'new',
    processStatus: partial.processStatus || 'active',
    stage: partial.stage || 'diagnose',
    priority: partial.priority || '',
    leadType: partial.leadType || '',
    sector: partial.sector || '',
    region: partial.region || '',
    country: partial.country || '',
    city: partial.city || '',
    value: partial.value || 0,
    score: partial.score ?? 50,
    // Imported/new leads land in the shared pool unless explicitly owned
    owner: partial.owner || '',
    source: partial.source || 'manual',
    tags: partial.tags || [],
    notes: partial.notes || '',
    techProfile: partial.techProfile,
    aiResearch: partial.aiResearch,
    researchChat: partial.researchChat || [],
    finalizedPitch: partial.finalizedPitch,
    emailHistory: partial.emailHistory || [],
    activities: partial.activities || [{ at: now, by, type: 'created', description: 'Lead created' }],
    followUps: partial.followUps || [],
    createdAt: partial.createdAt || now,
    updatedAt: now,
    lastActivity: now,
  }
}
