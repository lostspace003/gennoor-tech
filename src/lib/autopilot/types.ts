// LinkedIn autopilot: plans four posts a day, drafts them ahead, and publishes each at its slot unless you got there first.
export type Kind = 'post' | 'poll' | 'motion'
export type TargetKey = 'organization' | 'member'

export interface SlotCfg { time: string; kind: Kind }
export interface Config {
  /** Master switch: the big button on the Autopilot page. On by default; stays as the admin leaves it. */
  enabled: boolean
  /** 'auto' publishes by itself; 'review' only prepares drafts and never publishes. */
  mode: 'auto' | 'review'
  tz: string
  weekdaySlots: SlotCfg[]
  weekendSlots: SlotCfg[]
  targets: Record<TargetKey, boolean>
  /** The profile post goes out this long after the company page post, with a different opening line. */
  staggerMinutes: number
  /** 'reshare': the profile reposts the company page post with a short note of its own. 'own': the profile publishes its own post. */
  profileMode: 'reshare' | 'own'
  researchTime: string
  digestTime: string
  /** Drafts are prepared this long before their slot, so there is time to review and retry. */
  draftLeadMinutes: number
  /** A slot that could not publish within this window is skipped, never posted late. */
  missedGraceMinutes: number
  topics: string[]
  /** Topics we never post about; given to the writer and reviewer as instructions. */
  avoid: string[]
  /** A hard screen: a draft containing any of these words is held for you, whatever the reviewer said. */
  avoidKeywords: string[]
  weekendTheme: string
  alertEmail: string
  dailyMax: number
  minGapMinutes: number
  maxRegens: number
  /** Most posts about any one company in 7 days (relaxed only when a day cannot otherwise be filled). */
  companyWeeklyMax: number
  /** Companies exempt from that cap because they are the business's core (Microsoft has its own daily slot). */
  coreVendors: string[]
  /**
   * No longer read. The stream of each slot now comes from `pillarsFor()` in variety.ts, which changes with the day of
   * the week; this saved list could not be changed by a new release, because the saved settings win over the defaults.
   */
  slotPillars: string[]
}

export const DEFAULT_CONFIG: Config = {
  enabled: true,
  mode: 'auto',
  tz: 'Asia/Kolkata',
  // Chosen for the audience: India's morning commute and the Gulf morning, lunch, end of the workday plus Europe's
  // afternoon, and late evening India time = US East Coast morning.
  weekdaySlots: [{ time: '08:30', kind: 'post' }, { time: '12:30', kind: 'poll' }, { time: '17:30', kind: 'post' }, { time: '20:30', kind: 'post' }],
  // Weekends: later start, more to read and save.
  weekendSlots: [{ time: '09:30', kind: 'post' }, { time: '12:30', kind: 'poll' }, { time: '17:00', kind: 'post' }, { time: '20:00', kind: 'post' }],
  targets: { organization: true, member: true },
  staggerMinutes: 45,
  profileMode: 'reshare',
  researchTime: '05:00',
  digestTime: '07:00',
  draftLeadMinutes: 240,
  missedGraceMinutes: 150,
  topics: [
    'AI agents and agentic AI: what actually works in production, on any vendor',
    'Microsoft: Azure AI Foundry, Copilot Studio, Agent Framework, Fabric, GitHub Copilot',
    'Google: Gemini, Vertex AI, Gemini Enterprise and Google Cloud AI',
    'AWS: Bedrock, AgentCore, SageMaker and Amazon Q',
    'OpenAI, Anthropic (Claude), Meta, Mistral and open-source models: launches and what they mean for IT teams',
    'MCP and agent protocols: how AI systems connect to enterprise tools',
    'AI security, governance and regulation: incidents, the EU AI Act, India rules',
    'AI skills, careers and certifications for IT professionals',
    'Big tech launches and benchmark claims, explained plainly',
  ],
  avoid: ['politics and elections', 'religion', 'attacks on named competitors or individuals', 'medical, legal or investment advice', 'unverified rumours or leaks', 'layoff news'],
  avoidKeywords: ['election', 'politic', 'religio', 'layoff', 'rumour', 'rumor', 'leaked', 'lawsuit against'],
  weekendTheme: 'Weekend reading: a week-in-review, a clear explainer, a myth-versus-fact, or a practical "save this for Monday" learning pick. Calmer and more useful than the weekday news posts.',
  alertEmail: 'admin@gennoor.com',
  dailyMax: 4,
  minGapMinutes: 60,
  maxRegens: 2,
  companyWeeklyMax: 1,
  coreVendors: ['microsoft'],
  // Weekday and weekend slots run post, poll, post, post: Microsoft first, a debate for the poll, then a real use
  // case and something hands-on.
  slotPillars: ['microsoft', 'debate', 'use-case', 'hands-on'],
}

/**
 * One idea from the research. `facts` and `terms` are what the writers work from (they have no web access):
 * the story in five to eight plain sentences, and the technical words a reader who is not technical needs
 * explained. `date` is the day it happened, so a stale idea can be dropped.
 */
export interface TopicIdea {
  title: string; angle: string; hook?: string; vendor?: string; heat?: number; why?: string; format?: string; pillar?: string; company?: string
  date?: string
  facts?: string[]
  terms?: { term: string; plain: string }[]
  /** What nobody has said yet, for an article to state plainly ("Microsoft has not said when ..."). */
  unknown?: string[]
  sources: { title: string; url: string }[]
}

export interface TargetState {
  status: 'pending' | 'publishing' | 'done' | 'manual' | 'skipped' | 'failed' | 'held'
  at: string
  attempts: number
  urn?: string
  doneAt?: string
  reason?: string
}

export interface Slot {
  id: string
  date: string
  at: string
  kind: Kind
  weekend: boolean
  topic?: TopicIdea
  draftId?: string
  /** Opening-line variant used for the personal profile so the two posts are not identical. */
  variant?: string
  status: 'planned' | 'drafting' | 'ready' | 'done' | 'held' | 'skipped'
  reason?: string
  genAttempts: number
  regens: number
  /** The admin took this slot over: the autopilot prepares nothing more and never publishes it. */
  manual?: boolean
  /** The admin wrote this slot's post in Social Studio (draftId points to it); handing back is then refused. */
  ownDraft?: boolean
  /** You approved this draft (button in the email or on the page), so it posts even in review mode. */
  approved?: boolean
  targets: Partial<Record<TargetKey, TargetState>>
  updatedAt: string
}

export interface DayPlan { date: string; researchedAt?: string; researchAttempts: number; researchError?: string; slots: Slot[]; digestSent?: boolean }

export interface HistoryEntry { at: string; title: string; angle?: string; vendor?: string; format?: string; pillar?: string; hook?: string; slotId?: string }

export interface State {
  config: Config
  days: Record<string, DayPlan>
  /** Recent topics, to avoid repeating ourselves: what, which vendor, which format and how the post opened. */
  history: HistoryEntry[]
  lock?: { until: string; by: string }
  lastTick?: string
  lastTickNote?: string
  /** dedupe key -> date it was last alerted, so one problem does not send an email every ten minutes */
  alerted: Record<string, string>
  log: { at: string; msg: string }[]
}

export const emptyState = (): State => ({ config: DEFAULT_CONFIG, days: {}, history: [], alerted: {}, log: [] })
