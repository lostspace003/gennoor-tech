import { pocs } from './pocs'

export interface BusinessFunction {
  slug: string
  name: string
  tagline: string
  hero: string
  problems: { title: string; detail: string }[]
  pocIds: string[]
  flagshipCourse?: string
}

export const functions: BusinessFunction[] = [
  {
    slug: 'hr',
    name: 'HR & People',
    tagline: 'Reclaim HR’s time from policy questions and admin — for the work that actually keeps people.',
    hero: 'Copilot agents for onboarding, RAG over policy docs, and Copilot adoption pilots designed by an HR lens — not a tech demo.',
    problems: [
      { title: 'New-joiner queries crush HR week 1–4', detail: 'A grounded Copilot agent absorbs 70% of routine policy questions and escalates the rest with full context.' },
      { title: 'Policy docs live in five places', detail: 'RAG with citations brings the answer back to whichever Teams chat the employee was already in.' },
      { title: 'Adoption stalls at 10% of licenses', detail: 'Persona-based prompt libraries and an adoption dashboard turn paid licenses into actual usage.' },
    ],
    pocIds: ['hr-onboarding-copilot', 'enterprise-rag-knowledge-search', 'm365-copilot-rollout'],
    flagshipCourse: 'AI for HR & People Teams',
  },
  {
    slug: 'finance',
    name: 'Finance & Accounting',
    tagline: 'Close the month before the weekend. Catch the fraud before it hits the GL.',
    hero: 'Document extraction, reconciliation agents, multimodal RAG over financial PDFs, anomaly detection — the unglamorous AI work that actually shows up in EBITDA.',
    problems: [
      { title: 'Month-end is a weekend tax on finance', detail: 'A reconciliation agent surfaces mismatches with proposed journal entries — close moves from days to hours.' },
      { title: 'Invoices are still hand-keyed', detail: 'Document AI + LLM verification + ERP write-back kills 60–80% of manual entry on day one.' },
      { title: 'Fraud surfaces only after the loss', detail: 'Real-time anomaly detection with reasoning-layer context catches what threshold rules miss.' },
    ],
    pocIds: ['invoice-receipt-extraction', 'finance-reconciliation-agent', 'multimodal-rag-banking', 'anomaly-fraud-engine'],
    flagshipCourse: 'AI for Finance & Accounting',
  },
  {
    slug: 'sales',
    name: 'Sales & Marketing',
    tagline: 'Proposals in minutes, not days. Pipeline intelligence that surfaces before the QBR, not after.',
    hero: 'Proposal generators, CRM-grounded Copilots, and meeting-intelligence agents — designed to give reps back the half-day they currently lose to admin.',
    problems: [
      { title: 'Proposals eat the selling time', detail: 'Brand-template prompt builders with CRM context cut proposal assembly from hours to minutes.' },
      { title: 'Meeting outcomes vanish by Friday', detail: 'Transcript-to-action agents push decisions and follow-ups into the CRM automatically.' },
      { title: 'Multi-language markets are under-served', detail: 'Multilingual support and outbound agents fluent in EN/AR/HI/SW make non-English markets viable without doubling headcount.' },
    ],
    pocIds: ['sales-proposal-generator', 'meeting-intelligence-tracker', 'multilingual-support-agent'],
    flagshipCourse: 'AI for Sales & Marketing',
  },
  {
    slug: 'customer-service',
    name: 'Customer Service & Support',
    tagline: 'Voice + text agents that handle tier-1 calmly, and route everything else with context.',
    hero: 'Multilingual support agents grounded on the knowledge base, with intent routing, sentiment escalation, and a team-lead dashboard that shows the real picture.',
    problems: [
      { title: 'Volume outpaces hiring', detail: 'Tier-1 absorption with warm-handoff keeps CSAT up without doubling the team.' },
      { title: 'Non-English markets are tier-2 citizens', detail: 'Multilingual fluency (AR/HI/SW) ships in the same agent — not as a six-month bolt-on.' },
      { title: 'Quality monitoring is a sample', detail: 'Every conversation gets sentiment + outcome tagging — coaching becomes data-driven.' },
    ],
    pocIds: ['multilingual-support-agent', 'enterprise-rag-knowledge-search', 'citizen-services-multilingual'],
    flagshipCourse: 'AI for Customer Service & Support',
  },
  {
    slug: 'operations',
    name: 'Operations & Supply Chain',
    tagline: 'Forecasts that survive the weekly meeting. Procurement that catches consolidation before renewal.',
    hero: 'Demand forecasting, predictive maintenance, procurement intelligence, and meeting-action trackers — the AI layer over the work ops already does.',
    problems: [
      { title: 'Excel-driven S&OP', detail: 'ML + LLM-narrated what-ifs replace the spreadsheet without taking the planners out of the loop.' },
      { title: 'Procurement renewals catch us off guard', detail: 'A vendor-intelligence agent flags single-source exposure and consolidation candidates 90 days ahead.' },
      { title: 'Predictive maintenance is mostly slogans', detail: 'Closed-loop feedback on plant data turns the slogan into a measurable downtime reduction.' },
    ],
    pocIds: ['demand-forecasting-engine', 'predictive-maintenance-agent', 'procurement-vendor-intelligence', 'meeting-intelligence-tracker'],
    flagshipCourse: 'AI for Operations & Supply Chain',
  },
  {
    slug: 'legal',
    name: 'Legal, Risk & Compliance',
    tagline: 'Redline the standard contracts in minutes. Keep senior counsel for the ones that matter.',
    hero: 'Clause extraction, playbook-aware risk flagging, side-by-side comparison, and policy-RAG with citations — built for the audit trail your regulator will ask for.',
    problems: [
      { title: 'Standard contracts eat senior time', detail: 'Playbook-aware extraction handles the 80% of redlines that are mechanical, freeing counsel for the strategic 20%.' },
      { title: 'Policy lookup is a wiki crawl', detail: 'Grounded RAG returns the policy passage with citation in seconds — and logs who asked what.' },
      { title: 'AI itself is a compliance frontier', detail: 'We deliver with the governance evidence (audit logs, content safety, data residency) regulators will eventually require.' },
    ],
    pocIds: ['contract-legal-review', 'enterprise-rag-knowledge-search'],
    flagshipCourse: 'AI for Legal, Risk & Compliance',
  },
]

export const getFunctionBySlug = (slug: string) => functions.find(f => f.slug === slug)
export const getPoCsForFunction = (fn: BusinessFunction) =>
  fn.pocIds.map(id => pocs.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
