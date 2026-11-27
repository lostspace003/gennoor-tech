// Shared CRM lead types — used by both API routes and the CRM UI.
// Keep this file free of server-only imports.
import type { LeadReply } from './replies'

/**
 * ONE axis says where a lead stands. The stored keys are the older names, kept
 * so no data needs moving; the screens show the labels in STEP_LABELS.
 * ('negotiation' is folded into 'proposal' when leads are read.)
 */
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'

/** The steps a lead moves through, in order. */
export const LEAD_STEPS: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

// A step is named for what has happened, never for something in progress: the second step was called "Emailing",
// and the owner read it as "the email is still being sent" (13 November 2026). Whether one email has really gone
// is said beside it, per email (see ./delivery.ts).
export const STEP_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Emailed',
  qualified: 'Talking',
  proposal: 'Proposal',
  negotiation: 'Proposal',
  won: 'Customer',
  lost: 'Closed',
}

/** One line per step, shown as help text wherever the step is chosen. */
export const STEP_HINTS: Record<LeadStatus, string> = {
  new: 'Added, nothing sent yet',
  contacted: 'We emailed them, no reply yet',
  qualified: 'They replied, or a call is booked',
  proposal: 'A proposal or quote is with them',
  negotiation: 'A proposal or quote is with them',
  won: 'They bought',
  lost: 'Not going ahead for now',
}

/**
 * The type of a lead: who we are writing to (owner, 14 November 2026: "technical professional or business
 * professional, just two types"). It is a fact about the person, set in the lead sheet or by hand. It is not a
 * step and moves nothing. Blank is allowed: "not set".
 */
export type LeadProfile = 'technical' | 'business'
export const LEAD_PROFILES: LeadProfile[] = ['technical', 'business']
export const PROFILE_LABELS: Record<LeadProfile, string> = { technical: 'Technical professional', business: 'Business professional' }
/** For a narrow place: a column of a list. */
export const PROFILE_SHORT: Record<LeadProfile, string> = { technical: 'Technical', business: 'Business' }

/** What someone typed in the Type column, as one of the two types. Anything else is blank, never a guess. */
export function readProfile(text: unknown): LeadProfile | '' {
  const t = String(text ?? '').toLowerCase().replace(/[^a-z]+/g, ' ').trim()
  if (!t) return ''
  if (/\bnon ?tech/.test(t) || /\bbusiness\b/.test(t)) return 'business'
  if (/\btech/.test(t)) return 'technical'
  return ''
}

// Legacy fields. Nothing on screen reads these any more; they stay in the type
// because older stored leads (and a few site forms) still carry them.
export type ProcessStatus = 'active' | 'paused' | 'stopped'
export type PipelineStage = 'diagnose' | 'train' | 'poc' | 'development' | 'sustain'
export type TechProfile = 'technical' | 'non-technical'

export interface LeadActivity {
  at: string
  by: string
  type: 'created' | 'updated' | 'research' | 'chat' | 'email' | 'stage' | 'status' | 'followup' | 'imported' | 'note' | 'linkedin'
  description: string
  stage?: PipelineStage
}

export interface EmailRecord {
  at: string
  by: string
  to: string
  subject: string
  /** 'sent' means the email service took it. Whether it has gone is `confirmedAt` (see ./delivery.ts). */
  status: 'sent' | 'failed'
  body?: string
  cc?: string[]
  /** Set when this was a step of the email series (see sequence.ts). */
  step?: string
  /** The email service's own number for this send, so the CRM can ask it later what became of the email. */
  op?: string
  /** When the email was confirmed as gone: the email service finished it, our own copy of it arrived, or Outlook took it. */
  confirmedAt?: string
  confirmedBy?: 'service' | 'copy' | 'outlook'
  /** Why it failed, when the email service refused it or gave up on it later. */
  error?: string
  /** Set when this was an email of the AI Weekend campaign (lib/weekend-emails.ts): which email, for which weekend ("2026-11"). */
  weekend?: { kind: string; cohort: string }
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

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Progress through the email series. Absent until the first step is sent. */
export interface SequenceState {
  sent: Array<{ step: string; at: string; by: string }>
  /** Set when the lead asked us to stop, or the team stopped the series. */
  stopped?: { at: string; by: string; reason: string }
  /**
   * The order the emails not sent yet go in for this lead, when someone changed it on the lead's Emails board
   * (step ids). Absent: the plan's own order. See orderFor() in ./sequence.ts.
   */
  order?: string[]
}

/** What we did on LinkedIn for this lead, through the LinkedIn hub. */
export interface LinkedInTouch {
  at: string
  by: string
  kind: 'connect' | 'message'
  text: string
}

export interface Lead {
  id: string
  name: string
  /**
   * The name used to greet them in emails, when it was set by hand. Not set: worked out from
   * `name` (see ./greeting.ts). Empty text: write to them without a name.
   */
  greeting?: string | null
  email: string
  phone: string
  /** The organization. Leads are grouped and filtered by this. */
  company: string
  designation: string
  /** Technical professional or business professional. Not set: nobody has said. */
  profile?: LeadProfile
  linkedin: string
  website: string
  status: LeadStatus
  country: string
  city: string
  owner: string
  source: string
  notes: string
  altEmails?: string[]
  // owner === '' means unassigned (visible to all, anyone can pick it up).
  // Archived leads are parked with a reason and can be restored.
  dumped?: { at: string; by: string; reason: string }
  /** Set once this person has paid for a course or an AI Weekend (lib/crm/customers.ts): no promotional emails. */
  customer?: { since: string; at: string }
  sequence?: SequenceState
  /** The last thing they wrote to us, kept by the mailbox check (see ./replies.ts and ./reply-sync.ts). */
  reply?: LeadReply
  linkedinTouches?: LinkedInTouch[]
  emailHistory: EmailRecord[]
  activities: LeadActivity[]
  createdAt: string
  updatedAt: string
  lastActivity: string

  // ---- Legacy, no longer shown or edited. Kept so stored leads stay valid.
  processStatus: ProcessStatus
  stage: PipelineStage
  priority: string
  leadType: string
  companySize?: string
  businessFunction?: string
  interest?: string
  decisionRole?: string
  sector: string
  region: string
  value: number
  score: number
  tags: string[]
  techProfile?: TechProfile
  aiResearch?: { summary: string; [key: string]: unknown }
  researchChat: ChatMessage[]
  finalizedPitch?: string
  pitchVersions?: Array<{ v: number; at: string; by: string; content: string; instruction?: string }>
  pitchLockedV?: number
  followUps: FollowUp[]
}

/**
 * Sources written by the site itself (see auto-leads.ts): someone sent a form, or
 * bought, finished or reviewed a course. The Leads page offers them as a filter.
 */
export const AUTO_SOURCES = ['Website enquiry', 'Bought a course', 'Completed a course', 'Reviewed a course'] as const
export type AutoSource = (typeof AUTO_SOURCES)[number]
export const isAutoSource = (source: string) => (AUTO_SOURCES as readonly string[]).includes(source)

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
    profile: readProfile(partial.profile) || undefined,
    linkedin: partial.linkedin || '',
    website: partial.website || '',
    status: partial.status || 'new',
    country: partial.country || '',
    city: partial.city || '',
    // New leads are unassigned unless explicitly owned
    owner: partial.owner || '',
    source: partial.source || 'manual',
    notes: partial.notes || '',
    sequence: partial.sequence,
    linkedinTouches: partial.linkedinTouches,
    emailHistory: partial.emailHistory || [],
    activities: partial.activities || [{ at: now, by, type: 'created', description: 'Lead added' }],
    createdAt: partial.createdAt || now,
    updatedAt: now,
    lastActivity: now,
    // legacy defaults
    processStatus: 'active',
    stage: partial.stage || 'diagnose',
    priority: partial.priority || '',
    leadType: partial.leadType || '',
    companySize: partial.companySize || '',
    businessFunction: partial.businessFunction || '',
    interest: partial.interest || '',
    decisionRole: partial.decisionRole || '',
    sector: partial.sector || '',
    region: partial.region || '',
    value: partial.value || 0,
    score: partial.score ?? 50,
    tags: partial.tags || [],
    researchChat: partial.researchChat || [],
    followUps: partial.followUps || [],
  }
}

/**
 * Brings an older stored lead into the simple model. Runs on every read, so the
 * screens only ever see the current shape:
 *  - 'negotiation' becomes 'proposal'
 *  - paused / stopped leads become archived (restorable), since there is no
 *    separate process switch any more
 *  - a lead owned by someone who no longer has CRM access goes back to unassigned
 */
export function normalizeLead(lead: Lead, activeUsers: string[]): Lead {
  if (lead.status === 'negotiation') lead.status = 'proposal'
  if (!LEAD_STEPS.includes(lead.status)) lead.status = 'new'
  if (!lead.dumped && lead.processStatus && lead.processStatus !== 'active') {
    lead.dumped = { at: lead.updatedAt || new Date().toISOString(), by: 'system', reason: lead.processStatus === 'paused' ? 'Paused earlier' : 'Stopped earlier' }
  }
  lead.processStatus = 'active'
  const owner = (lead.owner || '').toLowerCase()
  if (owner && !activeUsers.includes(owner)) lead.owner = ''
  lead.emailHistory = lead.emailHistory || []
  lead.activities = lead.activities || []
  lead.followUps = lead.followUps || []
  lead.researchChat = lead.researchChat || []
  return lead
}
