import type { Lead } from './types'

/**
 * The single text representation of a lead used by BOTH retrieval paths —
 * GennoorBot's blob embeddings and the Azure AI Search index.
 *
 * They previously each kept their own copy of this builder, and both copies
 * omitted the same things: the qualification fields the team fills in by hand
 * (interest, function, company size, decision role) and everything the deep
 * research produces. That made whole categories of question unanswerable —
 * "which leads asked about training?" can't match on a field that was never
 * embedded. One builder, used by both, so they can't drift apart again.
 *
 * Changing what goes in here changes each lead's content hash, so the next
 * retrieval re-embeds the ones that moved. That's automatic, and it's the
 * intended cost of indexing more.
 */
export function leadIndexText(l: Lead): string {
  const r = l.aiResearch
  return [
    l.name,
    l.designation,
    l.company,
    l.email,
    l.website,
    l.sector,
    l.leadType,
    l.region,
    l.country,
    l.city,
    l.stage,
    l.status,
    l.processStatus,
    l.priority,
    l.owner || 'pool',
    l.source,
    // Qualification — what the team actually recorded about the opportunity
    l.companySize && `size: ${l.companySize}`,
    l.businessFunction && `function: ${l.businessFunction}`,
    l.interest && `interest: ${l.interest}`,
    l.decisionRole && `decision role: ${l.decisionRole}`,
    l.dumped && `dumped: ${l.dumped.reason}`,
    l.notes,
    // Research — the findings, the person, and which offerings we matched.
    // Without these, "who should we pitch the finance course to?" has nothing
    // to retrieve on even after the research has answered exactly that.
    r?.summary,
    r?.companyProfile,
    r?.personProfile,
    ...(r?.insights || []),
    ...(r?.opportunities || []),
    r?.entryPlan,
    ...(r?.offeringMatches || []).map((m) => `fit: ${m.title} — ${m.need}`),
    r?.techOrNonTech && `audience: ${r.techOrNonTech}`,
  ]
    .filter(Boolean)
    .join(' | ')
}

/**
 * Qualification fields that drive research quality and targeting. Blank ones
 * are the difference between a sharp profile and a generic one, so the UI
 * surfaces them and the AI enrichment fills them.
 */
export const QUALIFICATION_FIELDS = [
  { key: 'sector', label: 'Sector' },
  { key: 'companySize', label: 'Company size' },
  { key: 'businessFunction', label: 'Function' },
  { key: 'interest', label: 'Interest' },
  { key: 'decisionRole', label: 'Decision role' },
] as const

export type QualificationKey = (typeof QUALIFICATION_FIELDS)[number]['key']

/** Which qualification fields this lead is still missing. */
export function qualificationGaps(lead: Lead): Array<{ key: QualificationKey; label: string }> {
  return QUALIFICATION_FIELDS.filter((f) => !String(lead[f.key] || '').trim()).map((f) => ({ key: f.key, label: f.label }))
}
