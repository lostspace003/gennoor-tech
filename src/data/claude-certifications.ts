/**
 * The four official Anthropic Claude certifications and everything the
 * /claude/certifications pages need to present them: the story each course
 * follows, exam facts, and where the interactive guide + practice exams live.
 *
 * Each course is rendered by the in-site course reader at /claude/certifications/<slug>;
 * its chapter bodies, diagrams, knowledge checks and practice questions come from
 * /public/cert-data/<slug>.json (built by claude-thing/build_course_json.js).
 */

export interface ClaudeCert {
  slug: string
  /** Short official-style code, e.g. CCAS-F */
  code: string
  name: string
  /** One-line positioning used on cards */
  tagline: string
  level: 'Foundations' | 'Professional'
  audience: string
  /** Mixed-background friendly description of who should take it */
  whoItsFor: string
  /** The narrative the course follows — one course, one storyline */
  storyline: { protagonist: string; arc: string }
  /** The storyline stops, in reading order (shown as the course map) */
  journey: { stop: string; learn: string }[]
  examFacts: { questions: number; formats: string; passingStyle: string; time: string }
  /** Topic domains with rough weight, for the at-a-glance blueprint */
  domains: { title: string; weight: string }[]
  /** localStorage key prefix the course reader uses ('<key>.done' / '<key>.seen' / '<key>.exam') */
  guideKey: string
  guideUrl: string
  prepHubUrl: string
  accent: string
}

/** The practice exams live inside each course (the #exam chapter); this points at the overview. */
export const PREP_HUB_URL = '/claude/certifications'

export const CLAUDE_CERTS: ClaudeCert[] = [
  {
    slug: 'associate-foundations',
    code: 'CCAS-F',
    name: 'Claude Certified Associate – Foundations',
    tagline: 'Use Claude well at work — no coding needed.',
    level: 'Foundations',
    audience: 'Knowledge workers, analysts and team leads',
    whoItsFor:
      'For anyone who works with Claude day to day — operations, HR, finance, marketing, support. No programming background needed. It certifies that you can describe, delegate, check and refine AI work responsibly.',
    storyline: {
      protagonist: 'Maya, a business operations analyst at Brightline Services',
      arc: 'Follow Maya for 30 days as she goes from her first Claude chat to being her team’s AI-fluent lead — every chapter is the next real situation at work, the concept that solves it, and what the exam asks about it.',
    },
    journey: [
      { stop: 'Day 1 — the first chat', learn: 'What Claude is, Artifacts vs chat answers, when each fits' },
      { stop: 'The spreadsheet week', learn: 'Code Execution for exact numbers, verifying outputs' },
      { stop: 'Setting up the team space', learn: 'Projects, custom instructions, Skills and Memory' },
      { stop: 'The 4Ds', learn: 'Description, Delegation, Diligence, Discernment — the AI Fluency Framework' },
      { stop: 'The sensitive-data moment', learn: 'Policy, PII, escalation — what never goes into a prompt' },
      { stop: 'Prompting like a pro', learn: 'Structure, decomposition, iteration, and when to stop iterating' },
      { stop: 'Choosing the right model', learn: 'Capability vs speed vs cost trade-offs' },
      { stop: 'Exam day', learn: 'The playbook of answer patterns, then a full 60-question mock exam' },
    ],
    examFacts: {
      questions: 60,
      formats: 'Single choice, select-two, and sequence ordering',
      passingStyle: 'Scenario-based: real workplace situations',
      time: '~90 minutes',
    },
    domains: [
      { title: 'AI Fluency Framework (the 4 Ds)', weight: '37%' },
      { title: 'Claude workspace & platform features', weight: '28%' },
      { title: 'Prompting, decomposition & iteration', weight: '35%' },
    ],
    guideKey: 'ccasf',
    guideUrl: '/claude/certifications/associate-foundations',
    prepHubUrl: '/claude/certifications/associate-foundations#exam',
    accent: '#c4713c',
  },
  {
    slug: 'developer-foundations',
    code: 'CCDV-F',
    name: 'Claude Certified Developer – Foundations',
    tagline: 'Build production Claude applications that hold up.',
    level: 'Foundations',
    audience: 'Software engineers and backend developers',
    whoItsFor:
      'For developers integrating Claude into real products: the API and SDKs, structured outputs, tools, agents, Claude Code, and the security and cost habits production demands. Assumes you can read Python.',
    storyline: {
      protagonist: 'You, the new AI engineer at Loomline, building "TicketFlow"',
      arc: 'One product, start to ship: take TicketFlow — a support-automation product — from its first API call to a production agent fleet. Every chapter is the next engineering milestone and the exam angle behind it.',
    },
    journey: [
      { stop: 'First API call', learn: 'Messages API, system prompts, model choice' },
      { stop: 'Going async', learn: 'AsyncAnthropic, retries, 429s and the event loop' },
      { stop: 'Output you can trust', learn: 'JSON schemas, validation, retry/fallback paths' },
      { stop: 'Giving Claude tools', learn: 'Tool use, argument validation, error paths' },
      { stop: 'The cost review', learn: 'Token tracking, prompt caching, Batch API' },
      { stop: 'From calls to agents', learn: 'Agent SDK, orchestrators, checkpointing, context pruning' },
      { stop: 'The team workflow', learn: 'Claude Code, CLAUDE.md, Skills, deterministic hooks' },
      { stop: 'Hardening & launch', learn: 'Prompt injection defense, untrusted input as data' },
      { stop: 'Exam day', learn: 'Answer-pattern playbook, then a full 53-question mock exam' },
    ],
    examFacts: {
      questions: 53,
      formats: 'Scenario-based single choice',
      passingStyle: 'Production engineering judgment calls',
      time: '~80 minutes',
    },
    domains: [
      { title: 'SDK, async architecture & cost engineering', weight: '25%' },
      { title: 'Structured outputs, validation & tool calling', weight: '25%' },
      { title: 'Agentic workflows & state management', weight: '28%' },
      { title: 'Claude Code, hooks & application security', weight: '22%' },
    ],
    guideKey: 'ccdvf',
    guideUrl: '/claude/certifications/developer-foundations',
    prepHubUrl: '/claude/certifications/developer-foundations#exam',
    accent: '#3f6fb8',
  },
  {
    slug: 'architect-foundations',
    code: 'CCAR-F',
    name: 'Claude Certified Architect – Foundations',
    tagline: 'Master the Claude Agent SDK and agent architecture.',
    level: 'Foundations',
    audience: 'Solution architects and senior engineers',
    whoItsFor:
      'For architects and senior engineers designing agent systems on the Claude Agent SDK: the agent loop, tools, MCP, subagents, hooks, sessions, permissions and the patterns that keep agents safe and reliable.',
    storyline: {
      protagonist: 'You, designing a real agent platform piece by piece',
      arc: 'From one query() call to a governed multi-agent system: each chapter adds one layer — loop, tools, MCP, subagents, hooks, sessions, security — with runnable examples and step-through diagrams of what actually happens inside.',
    },
    journey: [
      { stop: 'The agent loop', learn: 'query(), the reason–act–observe cycle, message types' },
      { stop: 'Configuring the agent', learn: 'Options, system prompts, permission modes' },
      { stop: 'Tools', learn: 'Built-in tools, custom tools, risk and approval' },
      { stop: 'MCP', learn: 'Connecting external systems the standard way' },
      { stop: 'Subagents & orchestration', learn: 'Fan-out, context isolation, delegation' },
      { stop: 'Hooks & sessions', learn: 'Deterministic control, resumable conversations' },
      { stop: 'Security & enterprise patterns', learn: 'Permissions, sandboxing, production hardening' },
      { stop: 'Exam day', learn: 'Playbook plus a full-length mock exam' },
    ],
    examFacts: {
      questions: 60,
      formats: 'Single choice, scenario and architecture decisions',
      passingStyle: 'Agent SDK design judgment',
      time: '~90 minutes',
    },
    domains: [
      { title: 'Agent SDK fundamentals & configuration', weight: '30%' },
      { title: 'Tools, MCP & subagents', weight: '30%' },
      { title: 'Hooks, sessions & security', weight: '25%' },
      { title: 'Enterprise patterns & scenarios', weight: '15%' },
    ],
    guideKey: 'ccarf',
    guideUrl: '/claude/certifications/architect-foundations',
    prepHubUrl: '/claude/certifications/architect-foundations#exam',
    accent: '#3f9c8f',
  },
  {
    slug: 'architect-professional',
    code: 'CCAR-P',
    name: 'Claude Certified Architect – Professional',
    tagline: 'Design and govern Claude at enterprise scale.',
    level: 'Professional',
    audience: 'Principal architects and technical leads',
    whoItsFor:
      'The advanced certification: enterprise architecture, RAG with RBAC, compliance (HIPAA, BAA, ZDR), cost engineering, guardrails, observability, fair rollouts and the business value case. For people who defend architecture decisions to boards and auditors.',
    storyline: {
      protagonist: 'You, Principal AI Architect at Meridian Health & Finance Group',
      arc: 'A 12-month rollout in a regulated enterprise: every chapter is the next board-level decision or production incident — the trade-offs, the defensible answer, and how the exam tests it.',
    },
    journey: [
      { stop: 'Discovery & the value case', learn: 'Business value pillars, SLA gates, ADRs' },
      { stop: 'The architecture bake-off', learn: 'Eliminating on SLA grounds, cost-per-outcome' },
      { stop: 'RAG done right', learn: 'Dense/sparse/hybrid retrieval, RBAC at the retrieval layer' },
      { stop: 'Cost engineering', learn: 'Prompt caching, token lifecycle, model routing' },
      { stop: 'Tooling governance', learn: 'Tool Search, least-privilege audits, HITL placement' },
      { stop: 'Compliance sign-off', learn: 'HIPAA, BAA, Zero Data Retention, audit logging' },
      { stop: 'Guardrails & observability', learn: 'Layered defenses, correlation IDs, eval gates' },
      { stop: 'The fair rollout', learn: 'A/B design, error-rate parity, canary with rollback' },
      { stop: 'Exam day', learn: 'Playbook plus a full 62-question mock exam' },
    ],
    examFacts: {
      questions: 62,
      formats: 'Single choice, select-two, and matrix scenarios',
      passingStyle: 'Enterprise trade-off reasoning',
      time: '~95 minutes',
    },
    domains: [
      { title: 'Business value, SLAs & discovery', weight: '24%' },
      { title: 'RAG, RBAC & token lifecycle', weight: '28%' },
      { title: 'Agent tooling & least privilege', weight: '24%' },
      { title: 'Security, compliance & observability', weight: '24%' },
    ],
    guideKey: 'ccarp',
    guideUrl: '/claude/certifications/architect-professional',
    prepHubUrl: '/claude/certifications/architect-professional#exam',
    accent: '#8068c9',
  },
]

export function getCert(slug: string): ClaudeCert | undefined {
  return CLAUDE_CERTS.find(c => c.slug === slug)
}
