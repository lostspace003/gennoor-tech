// Shared CRM lead types — used by both API routes and the CRM UI.
// Keep this file free of server-only imports.

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type ProcessStatus = 'active' | 'paused' | 'stopped'
// Stored keys are older names; the screens show Prospect, Talking, Scoping, Delivering, Customer (see STAGE_LABELS).
// Stored keys are older names; the screens show Prospect, Talking, Scoping, Delivering, Customer (see STAGE_LABELS).
export type PipelineStage = 'diagnose' | 'train' | 'poc' | 'development' | 'sustain'
export type TechProfile = 'technical' | 'non-technical'

export const PIPELINE_STAGES: PipelineStage[] = ['diagnose', 'train', 'poc', 'development', 'sustain']

// Category options — dropdowns in the add-lead form and multi-select filters.
// Stored as free strings so imports with other spellings still land.
export const COMPANY_SIZES = ['Small', 'Medium', 'Large', 'Enterprise']
export const BUSINESS_FUNCTIONS = ['IT & Tech', 'HR & L&D', 'Finance', 'Operations', 'Sales & Marketing', 'Leadership / C-suite', 'Other']
export const LEAD_INTERESTS = ['Training', 'Automation', 'Claude', 'Learning Studio']
export const DECISION_ROLES = ['Decision-maker', 'Influencer', 'End-user']

export interface LeadActivity {
  at: string
  by: string
  type: 'created' | 'updated' | 'research' | 'chat' | 'email' | 'stage' | 'status' | 'followup' | 'imported' | 'note'
  description: string
  // Pipeline stage the lead was in when this was logged — leads move, so notes
  // keep the stage they were made in. Absent on activities from before this field.
  stage?: PipelineStage
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

/**
 * One catalogue offering matched to something we actually observed about the
 * lead. `code` resolves against src/lib/crm/offerings.ts — a match that can't
 * be resolved is dropped rather than shown, so the team never pitches a
 * programme that doesn't exist.
 */
export interface OfferingMatch {
  code: string
  title: string
  phase: PipelineStage
  /** The observed need this answers, in the lead's terms. */
  need: string
  /** Why this specific offering, not a neighbouring one. */
  why: string
  /** 1 = lead with this. Training first, automation second, unless the lead says otherwise. */
  priority: number
  confidence: 'high' | 'medium' | 'low'
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
  // ---- Deep research (multi-pass). Absent on research run before this existed.
  /** Pass 1: what the company is and what's going on there. */
  companyProfile?: string
  /** Pass 2: the person — seniority, likely remit, what they'd care about. */
  personProfile?: string
  /** Pass 3: the intersect — our catalogue against their observed needs. */
  offeringMatches?: OfferingMatch[]
  /** How to enter: which training first, and what it can lead to. */
  entryPlan?: string
  /** Research-derived prompts the team can fire into the copilot chat. */
  suggestedQuestions?: string[]
  /** Which passes actually ran — surfaced so partial research is honest. */
  passes?: string[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// One-page client-facing pitch document, version-controlled. Every generate
// or copilot refinement appends a new version ("v3 — 28 Jul 2026, 9:12 pm").
// Locking a version freezes it as THE pitch: it becomes the basis for the
// email draft and is exported as .docx into the document library.
export interface PitchVersion {
  v: number
  at: string
  by: string
  content: string // markdown one-pager
  instruction?: string // what was asked of the copilot to produce this version
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
  // Category fields (see COMPANY_SIZES etc. above); blank = not set
  companySize?: string
  businessFunction?: string
  interest?: string
  decisionRole?: string
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
  // Locked pitch content (kept in sync with the locked pitch-doc version so
  // email drafting keeps working); pitchVersions holds the full history.
  finalizedPitch?: string
  pitchVersions?: PitchVersion[]
  pitchLockedV?: number
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
    companySize: partial.companySize || '',
    businessFunction: partial.businessFunction || '',
    interest: partial.interest || '',
    decisionRole: partial.decisionRole || '',
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
    pitchVersions: partial.pitchVersions,
    pitchLockedV: partial.pitchLockedV,
    emailHistory: partial.emailHistory || [],
    activities: partial.activities || [{ at: now, by, type: 'created', description: 'Lead created' }],
    followUps: partial.followUps || [],
    createdAt: partial.createdAt || now,
    updatedAt: now,
    lastActivity: now,
  }
}
