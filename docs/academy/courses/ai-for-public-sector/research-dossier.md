# AI for Public Sector & Government — Research Dossier

**Course slug:** `ai-for-public-sector`
**Track:** Industry · Public Sector & Government
**Audience:** Agency heads, government CIOs, Chief AI Officers, citizen-service modernisation leaders past basic AI literacy
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Citizens are not customers. They cannot switch suppliers, exit the relationship, or refuse the service. That single constraint reshapes every AI decision a public-sector leader makes. Accountability, transparency, due process, and equal treatment are not feature requests — they are the perimeter. The 2024–26 wave of government AI is real and shipping: service delivery automation, case-work augmentation, fraud detection, intelligent search over records, translation and accessibility. The fail patterns are also real and shipping: algorithmic decisions affecting rights without human review, chatbots representing the state without verification, opaque models in high-stakes contexts. This course teaches public-sector leaders to ship AI that improves service *and* survives FOIA, audit, judicial review, and a hostile press conference.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | US OMB M-24-10 — federal agencies must designate Chief AI Officers, publish AI use-case inventories, and apply minimum risk practices to rights- and safety-impacting AI | OMB Memorandum M-24-10 | Mar 2024 |
| 2 | US OMB M-24-18 — federal AI acquisition guidance; vendor risk management, performance monitoring, exit terms | OMB Memorandum M-24-18 | Oct 2024 |
| 3 | EU AI Act Annex III — public-sector AI in essential public services, law enforcement, migration/asylum, and administration of justice classified high-risk; conformity assessment + fundamental-rights impact assessment required | Regulation (EU) 2024/1689 | High-risk obligations phase in 2026–2027 |
| 4 | EU AI Act Article 27 — Fundamental Rights Impact Assessment (FRIA) mandatory for public bodies and bodies governed by public law deploying high-risk systems | EU AI Act 2024/1689 Art. 27 | 2024 |
| 5 | UK Algorithmic Transparency Recording Standard (ATRS) — mandatory for central government departments since Feb 2024; published records on algorithms.gov.uk | UK Central Digital & Data Office | 2024 |
| 6 | UK GOV.UK Generative AI Framework for HMG — ten principles including human oversight, openness, lifecycle accountability | UK Cabinet Office Generative AI Framework | Jan 2024, updated 2025 |
| 7 | UK GDS Service Standard — 14 points all government services must meet; AI does not exempt teams from accessibility, user research, or open standards | gov.uk service-manual | ongoing |
| 8 | India DPDPA 2023 — applies to government processing with narrow exemptions; rights of data principals (access, correction, erasure) constrain government AI built on citizen records | Digital Personal Data Protection Act 2023 | enacted 2023, rules 2025 |
| 9 | NIST AI RMF + Generative AI Profile (NIST AI 600-1) — the de facto federal risk framework referenced by OMB M-24-10 minimum practices | NIST AI 600-1 | Jul 2024 |
| 10 | Council of Europe Framework Convention on AI — first binding international AI treaty, signed Sep 2024 by US, UK, EU, others; covers public-sector AI lifecycle | CoE AI Treaty CETS 225 | Sep 2024 |
| 11 | US federal AI use-case inventory — 1,700+ disclosed use cases across 37+ agencies in the 2024 consolidated inventory; HHS, VA, DHS lead by volume | ai.gov consolidated inventory | 2024 update |
| 12 | Singapore Model AI Governance Framework + AI Verify — government-led testing toolkit referenced by IMDA for public-sector procurement | IMDA / AI Verify Foundation | 2024 |
| 13 | Disclosure discipline — pattern across OMB M-24-10, EU AI Act Art. 50, UK ATRS: citizens interacting with government AI must be informed it is AI; documented in regulator guidance, not optional | OMB / EU / UK regulator texts | 2024 |
| 14 | Cross-domain analog for chatbot misrepresentation — *Moffatt v. Air Canada* (BC Civil Resolution Tribunal, Feb 2024) held the airline liable for its chatbot's false statements; the public-sector lesson is government chatbots cannot disclaim accountability | BC CRT 2024 BCCRT 149 | Feb 2024 |
| 15 | Cross-domain analog for unverified AI output — *Mata v. Avianca* (S.D.N.Y., Jun 2023) — counsel sanctioned for filing brief with fabricated citations from ChatGPT; the public-sector lesson is every AI-surfaced source must be verifiable before it reaches a citizen, a case worker, or a court | S.D.N.Y. 22-cv-1461 | Jun 2023 |
| 16 | Robodebt Royal Commission (Australia) — final report Jul 2023 found the automated debt-recovery scheme unlawful and a "costly failure of public administration"; the canonical cautionary tale on automated decisions affecting rights without due process | Commonwealth of Australia Royal Commission report | Jul 2023 |
| 17 | SyRI ruling (Netherlands) — District Court of The Hague Feb 2020 struck down the System Risk Indication welfare-fraud algorithm under ECHR Art. 8; precedent that opaque public-sector risk-scoring fails proportionality | Rb. Den Haag C/09/550982 | Feb 2020 |
| 18 | Dutch childcare benefits scandal (toeslagenaffaire) — tax authority's risk-classification model wrongly flagged tens of thousands of families; cabinet resigned Jan 2021; named pattern for bias in fraud detection on protected attributes | Autoriteit Persoonsgegevens findings + parliamentary inquiry | 2020–2021 |
| 19 | UK Home Office visa streaming algorithm — withdrawn Aug 2020 after judicial review challenge by JCWI and Foxglove citing race discrimination; named pattern for opaque triage in rights-affecting contexts | Home Office statement + JCWI case | Aug 2020 |
| 20 | NYC Local Law 144 — automated employment decision tool bias audits; cross-domain precedent that public bodies and large employers are converging on mandatory bias audit + public summary | NYC DCWP rules | effective Jul 2023 |
| 21 | US Executive Order 14110 (rescinded Jan 2025) and successor EO 14179 / OMB follow-on guidance — federal AI policy direction shifted but OMB M-24-10 inventory and CAIO requirements remained in operational guidance through 2025 | White House EO 14179 + OMB updates | Jan 2025+ |
| 22 | Procurement discipline — OMB M-24-18 + EU AI Act + UK procurement policy note converge on four contract terms: explainability, bias evaluation, training-data provenance, exit/portability | OMB / EU / UK procurement texts | 2024 |
| 23 | Public AI inventory cadence — federal agencies report annually under OMB M-24-10; UK ATRS records published on a rolling basis; the discipline is *public* documentation, not internal-only | OMB + UK CDDO | 2024–2025 |
| 24 | Accessibility baseline — Section 508 (US), EN 301 549 (EU), WCAG 2.2 AA; AI translation and accessibility tooling does not waive these standards | Section 508 / EN 301 549 / WCAG | ongoing |
| 25 | The "human in the loop is not enough" pattern — Robodebt, SyRI, toeslagenaffaire all had nominal human review; cross-jurisdictional finding is that meaningful review requires authority, time, and dissent capacity, not just a signature box | Royal Commission + court rulings + academic review | 2020–2024 |

## Named incidents

1. **Robodebt (Australia, 2016–2020; Royal Commission report Jul 2023)** — automated income-averaging issued unlawful debts; multiple suicides linked; final report named ministers and officials. Canonical example of automated decisions affecting rights without due process.
2. **SyRI (Netherlands, struck down Feb 2020)** — welfare-fraud risk-scoring ruled to violate ECHR Art. 8 for lack of proportionality and transparency. Named precedent that opaque public-sector scoring fails judicial review.
3. **Dutch childcare benefits (toeslagenaffaire, 2013–2019, cabinet fell Jan 2021)** — tax authority's risk-classification model wrongly flagged tens of thousands of families, disproportionately dual-nationality households. Named pattern for bias risk in fraud detection.
4. **UK Home Office visa streaming algorithm (withdrawn Aug 2020)** — race-discrimination challenge by JCWI and Foxglove. Named pattern for opaque triage in rights-affecting contexts.
5. **Mata v. Avianca (S.D.N.Y., Jun 2023)** — cross-domain analog for the unverified-AI-output failure mode. Use to ground source verification discipline in case-work and intelligent search.
6. **Moffatt v. Air Canada (BC CRT, Feb 2024)** — cross-domain analog for chatbot misrepresentation liability. Use to ground government-chatbot accountability and disclosure discipline.

## What we do NOT say

- **No "citizens are customers" framing.** Customers can switch suppliers. Citizens cannot. The constraint is the lesson.
- **No vendor product endorsement.** OMB, EU, UK, India regulator frames are even-handed; specific platforms are referenced only where the user's existing stack matters.
- **No specific accuracy or savings claims** beyond what the named incident or regulator text supports. No "agency X saved $Y million" unless we can point to the published OMB inventory entry or the agency press release.
- **No "AI replaces case workers" framing.** AI prepares; humans decide on rights. This is the decision boundary, repeated every chapter.
- **No claim that human-in-the-loop alone is sufficient.** Robodebt, SyRI, and toeslagenaffaire all had nominal review. The lesson is authority, time, and dissent capacity.
- **No invented citations.** Where a pattern is real but unattributable to a single public source, frame as "industry pattern" or cite the cross-domain analog (Mata v. Avianca, Moffatt v. Air Canada).
- **No US-only framing.** EU AI Act Art. 27 FRIA, UK ATRS, India DPDPA all referenced; this is a global audience.

## Chapter blueprint

### Chapter 1 — The public-sector landscape (~5 min)
**What:** Citizens are not customers — the foundational constraint. The five plays that ship: service delivery automation, case-work augmentation, fraud detection, intelligent search, translation/accessibility. The three fail patterns: rights-affecting decisions without human review, unverified chatbots, opaque high-stakes models. The regulatory frame: OMB M-24-10 + EU AI Act Annex III + UK ATRS + India DPDPA. Named anchors: Robodebt, SyRI, toeslagenaffaire.
**Sources:** [1], [3], [5], [8], [16], [17], [18].

### Chapter 2 — Service delivery automation (~5 min)
**What:** Three use cases — citizen-service chatbots, form-filling assistants, status-tracking automation. The disclosure discipline (citizens must know they are talking to AI — OMB M-24-10, EU AI Act Art. 50, UK ATRS). The escalation path requirement — every AI interaction has a documented human route. The Moffatt v. Air Canada cross-domain lesson: the agency owns what its chatbot says.
**Sources:** [1], [3], [5], [13], [14].

### Chapter 3 — Case work augmentation (~5 min)
**What:** Three use cases — case summarisation, eligibility pre-screening (information-gathering only, not decisioning), document drafting. The decision boundary: AI prepares, humans decide on rights. Transparency to citizens: the right to know AI was used in their case, and the right to appeal. Why "human in the loop" is not enough on its own — authority, time, dissent capacity.
**Sources:** [4], [16], [25].

### Chapter 4 — Fraud detection (~5 min)
**What:** Two use cases — anomaly detection in claims streams, network analysis on benefits/tax data. The bias risk grounded in toeslagenaffaire and SyRI: protected attributes leak through proxies; opaque scoring fails proportionality. Human investigator required before any adverse action. Three honest-scoring questions: what is the base rate, what is the disparate impact, what is the appeal pathway.
**Sources:** [17], [18], [19], [20].

### Chapter 5 — Intelligent search + records (~5 min)
**What:** Three use cases — internal records RAG for case workers, FOIA/transparency request triage, legislative and policy precedent search. Source verification as non-negotiable — every cited source must resolve to the underlying record before it reaches a citizen, a case worker, or a court (Mata v. Avianca cross-domain). Access controls: classification and need-to-know enforced at retrieval, not at the prompt layer.
**Sources:** [15], [22].

### Chapter 6 — Translation + accessibility (~5 min)
**What:** Three use cases — multilingual citizen communication, plain-language rewriting, alt-text and captioning at scale. Low-stakes vs high-stakes distinction: marketing copy is low-stakes; legal notices, benefit determinations, court orders are high-stakes and require certified human translation. Community review for accessibility AI — disabled users are the auditors, not an afterthought. Section 508, EN 301 549, WCAG 2.2 AA do not bend for AI.
**Sources:** [7], [24].

### Chapter 7 — Governance posture (~5 min)
**What:** Four governance components — CAIO + accountability chain (OMB M-24-10), public AI use-case inventory (ai.gov + UK ATRS — *public* documentation is the discipline), impact assessments (EU AI Act Art. 27 FRIA + NIST AI RMF + Generative AI Profile), procurement terms (OMB M-24-18 + EU + UK PPN). Four procurement terms: explainability, bias evaluation, training-data provenance, exit/portability.
**Sources:** [1], [2], [4], [5], [9], [11], [22], [23].

### Chapter 8 — Making it stick · 18-month rollout (~6 min)
**What:** Months 1–6: inventory existing AI, designate CAIO, publish first use-case register, ship one disclosed citizen chatbot with escalation. Months 7–12: case-work augmentation pilot in one programme area with documented decision boundary; FRIA published. Months 13–18: fraud detection with bias audit + appeal pathway, or intelligent search with verified sources. Defer: rights-affecting automated decisions, opaque vendor lock-in. Four trust trip-wires: no rights-affecting decision without meaningful human review, no public-facing AI without disclosure, no AI-surfaced source without verification, no procurement without exit. Interactive Markdown builder for the agency head or Chief AI Officer.
**Sources:** Composite of [1], [2], [4], [5], [21], [22].

## Tone

- **Andrew, public-sector-leader register.** Precise. Constitutional, not commercial. Citizens, not customers.
- **Constraint as feature.** Due process, accountability, equal treatment are the perimeter — name them as enabling, not blocking.
- **Honest about the failures.** Robodebt, SyRI, toeslagenaffaire are named. We learn from them; we do not euphemise them.
- **Global, not US-only.** OMB + EU + UK + India in the same sentence wherever the regulator texts converge.
- **No ideological framing.** The course is operationally neutral across administrations and parties; the discipline is the law as written.

## Theme

Neutral-slate (`#475569` / `#334155`) + orange accent (`#F97316` / `#FB923C`) on Slate-900 navy and Slate-50 tint. Sora headings, Inter body. No emojis. Visual register is calm, civic, document-grade — not consumer SaaS.
