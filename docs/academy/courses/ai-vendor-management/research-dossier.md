# AI Vendor Management — Research Dossier

**Course slug:** `ai-vendor-management`
**Track:** Leadership · Procurement & Sourcing
**Audience:** CPOs, vendor management office (VMO) leads, IT sourcing leaders, category managers for technology, contracts directors
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Every software vendor is now selling "AI" — and most of them are selling something they don't fully own. The job of vendor management isn't to chase the demo; it's to run all four archetypes (hyperscalers, established ISVs, AI-native boutiques, SI partners) with the same diligence rigor, contract teeth, performance SLAs, and exit plan you'd apply to any critical supplier. The discipline that worked for ERP, telco, and managed services still works — but it needs six AI-specific clauses, four SLA dimensions instead of one, and an offboarding pre-write at signing because data deletion proof, model retention, and retraining echoes don't sort themselves out at termination.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Four AI vendor archetypes — hyperscalers (AWS/Azure/GCP), established ISVs (Microsoft/Salesforce/SAP/Oracle/ServiceNow), AI-native boutiques, SI partners — each with distinct diligence profile | Industry pattern · Gartner Magic Quadrants 2024-25 | 2024-2025 |
| 2 | Three over-promise patterns: ISV thin wrappers (white-labelled OpenAI/Anthropic), SI bench gap (sold capability ≠ staffed capability), boutique demo→prod gap (works on curated data, breaks at scale) | Industry pattern · vendor RFP debriefs | 2024-2026 |
| 3 | Gartner 2024-25 sourcing research — majority of enterprises report "AI washing" in vendor pitches; diligence questions about model lineage and training data are the most common gap | Gartner sourcing research 2024-25 | 2024-2025 |
| 4 | 12-item AI-specific diligence checklist across 4 categories (model lineage · data handling · operations · commercials) with 5 red-flag answers ("our model" with no specifics, "we don't log", "trust us on uptime", "we can't share sub-processors", "exit is straightforward") | Industry pattern · category manager playbooks | 2024-2026 |
| 5 | Three-tier diligence rule — tier the vendor by data sensitivity × business criticality × switching cost, not by spend alone; scales diligence without watering it down | Industry pattern · TPRM frameworks (Shared Assessments SIG) | 2024-2025 |
| 6 | Six AI-specific contract clauses standard MSAs miss: data use restrictions, sub-processor disclosure, model lineage warranty, performance + drift remedies, IP ownership of outputs, exit cooperation | Industry pattern · IACCM/WorldCC AI contracting guidance | 2024-2025 |
| 7 | The training-data trap — default ISV terms often grant the vendor a perpetual license to use customer prompts/data for model improvement; opt-out is contract-by-contract, not platform default | OpenAI Enterprise terms · Anthropic commercial terms · Microsoft Copilot data commitments | 2023-2026 |
| 8 | EU AI Act (Reg. 2024/1689) — high-risk AI system obligations apply Aug 2026; affects vendor contracts where the AI touches employment, credit, education, critical infrastructure | EU AI Act Reg. 2024/1689 | Aug 2026 phased |
| 9 | BFSI regulator-driven contract extras — RBI outsourcing master direction 2023, MAS guidelines on AI/data analytics, US OCC third-party risk guidance; require explainability, audit rights, exit support | RBI 2023 · MAS · OCC 2023 third-party risk | 2023-2025 |
| 10 | Healthcare HIPAA + BAA implications for AI vendors handling PHI — sub-processor disclosure and model training restrictions are not optional | HHS HIPAA guidance · OCR enforcement | ongoing |
| 11 | Performance SLA — four dimensions: availability (uptime), latency (response time), accuracy (output quality vs benchmark), drift (degradation over time). Standard MSAs cover only the first. | Industry pattern · cloud SLA evolution | 2024-2026 |
| 12 | SLA remedies must include service credits + escalation path + termination right for repeated breach; credit-only remedies don't deter | Industry pattern · IACCM/WorldCC contract benchmarks | 2024-2025 |
| 13 | Four lock-in tests — model lock-in (proprietary weights), data lock-in (export format + completeness), prompt lock-in (vendor-specific prompt templates), integration lock-in (custom connectors, no standards) | Industry pattern · cloud portability frameworks | 2024-2025 |
| 14 | Realistic lock-in mitigations — multi-vendor architecture for critical workflows, data export rights in contract, model-agnostic prompt layer, standards-based integrations (OpenAPI, MCP, A2A where available) | Industry pattern · platform engineering practice | 2024-2026 |
| 15 | Five vendor risk signal sources — SLA misses, financial distress signals, security incidents, geopolitical/export-control exposure, strategic pivots (M&A, product sunsets) | Industry pattern · TPRM monitoring practice | 2024-2025 |
| 16 | Four-phase response to signals — observe → engage → escalate → activate exit; pre-defined triggers prevent paralysis | Industry pattern · vendor risk playbooks | 2024-2025 |
| 17 | Three audit rhythms — quarterly performance review (SLA + delivery), annual security + compliance audit, event-driven (incident, M&A, regulator inquiry) | Industry pattern · TPRM frameworks | 2024-2025 |
| 18 | Three AI-specific exit risks — data deletion proof (certificate + audit trail), model retention (your data inside their fine-tuned weights), retraining echoes (outputs to other customers reflect your data) | Industry pattern · AI contracting practice | 2024-2026 |
| 19 | Pre-written offboarding at signing — transition plan, data export format + timeline, deletion certification, model decommissioning warranty; signed when leverage is highest, not at termination | Industry pattern · IACCM exit-clause guidance | 2024-2025 |
| 20 | LLM-generated vendor pitch / compliance answer hallucination — the confabulated-spec failure mode where a vendor's AI-assisted RFP response cites capabilities the product doesn't have. Cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023). | Industry pattern + Mata v. Avianca analog | 2023-2026 |
| 21 | Four trust trip-wires — vendor can't name their underlying model/provider, can't show drift monitoring, can't demonstrate data deletion, can't produce an exit plan in under 30 days | Industry pattern · VMO playbooks | 2024-2026 |

## Named incidents

1. **AI washing pattern (2023-26)** — pervasive industry pattern of "AI-enabled" labelling on products that wrap third-party LLMs without disclosure. Ground in Gartner sourcing research and SEC enforcement actions on AI claims (industry pattern) rather than naming a single vendor.
2. **Confabulated-spec RFP responses** — LLM-assisted vendor pitches citing capabilities the product doesn't have. Industry-observed pattern; ground in cross-domain analog (Mata v. Avianca S.D.N.Y. Jun 2023) rather than a specific named vendor case.
3. **The training-data default trap** — default commercial terms historically granted vendors broad rights to customer data for model improvement; opt-outs require explicit contracting. Pattern, not single incident.

## What we do NOT say

- **No "all AI vendors are dishonest" framing.** Vendor management runs the discipline; the discipline assumes good faith and verifies it.
- **No specific vendor naming for failure cases.** Use archetypes (hyperscaler / ISV / boutique / SI), not named vendors, when describing problems.
- **No claim that boutiques are inherently riskier.** Tier by data sensitivity × criticality × switching cost, not by vendor size.
- **No "single throat to choke" myth.** Lock-in is the cost of that comfort; the course teaches mitigations, not avoidance.
- **No invented percentages on AI-washing prevalence, contract win rates, or termination costs.** Cite as "industry pattern" when no public source exists.
- **No legal advice on EU AI Act / RBI / HIPAA specifics.** Point to the obligation; defer specifics to qualified counsel.

## Chapter blueprint

### Chapter 1 — The AI vendor landscape (~5 min)
**What:** Four archetypes — hyperscalers, established ISVs, AI-native boutiques, SI partners — each with a distinct diligence profile. Three over-promise patterns to scrutinise: ISV thin wrappers, SI bench gap, boutique demo→prod gap. The thesis: same discipline, AI-specific extensions.
**Sources:** [1], [2], [3].

### Chapter 2 — Diligence checklist for AI vendors (~5 min)
**What:** 12-item checklist across 4 categories (model lineage, data handling, operations, commercials). Five red-flag answers. The three-tier rule: tier by data sensitivity × criticality × switching cost. Scales diligence without watering it down.
**Sources:** [4], [5].

### Chapter 3 — Contract terms (~5 min)
**What:** Six AI-specific clauses standard MSAs miss — data use, sub-processor disclosure, model lineage warranty, performance + drift remedies, IP ownership of outputs, exit cooperation. The training-data trap. Regulator-driven extras for BFSI (RBI/MAS/OCC), healthcare (HIPAA/BAA), and EU AI Act exposure.
**Sources:** [6], [7], [8], [9], [10].

### Chapter 4 — Performance SLAs (~5 min)
**What:** The uptime-only trap. Four SLA dimensions — availability, latency, accuracy (against benchmark), drift (degradation over time). Remedies that include service credits + escalation + termination right; credit-only doesn't deter.
**Sources:** [11], [12].

### Chapter 5 — Lock-in mitigation (~5 min)
**What:** Four lock-in tests — model, data, prompt, integration. Four realistic mitigations — multi-vendor for critical workflows, data export rights, model-agnostic prompt layer, standards-based integrations. Four anti-patterns to avoid (single-source dependency on critical path, no exit clause, no export drill, prompt sprawl).
**Sources:** [13], [14].

### Chapter 6 — Vendor risk monitoring and audit (~5 min)
**What:** Five signal sources — SLA misses, financial distress, security incidents, geopolitical/export-control exposure, strategic pivots. Four-phase response: observe → engage → escalate → activate exit. Three audit rhythms — quarterly performance, annual security, event-driven.
**Sources:** [15], [16], [17].

### Chapter 7 — Vendor offboarding (~5 min)
**What:** Pre-write at signing, not at termination — leverage is at signing. Three AI-specific exit risks: data deletion proof, model retention, retraining echoes. Four-section transition plan: data export, deletion certification, model decommissioning warranty, knowledge transfer.
**Sources:** [18], [19].

### Chapter 8 — Capstone · AI vendor playbook (~6 min)
**What:** Five-section one-page playbook (archetype tiering · diligence depth · contract teeth · SLA dimensions · exit pre-write). Four trust trip-wires — can't name underlying model, can't show drift monitoring, can't demonstrate data deletion, can't produce a 30-day exit plan. Interactive playbook builder that emits a tailored one-pager per vendor tier. Bridges to confabulated-spec risk as the AI-washing tell (industry pattern + Mata v. Avianca analog).
**Sources:** Composite of [4], [6], [11], [13], [18], [20], [21].

## Tone

- **Andrew, CPO/VMO register.** Precise, lawyerly when the contract is on the table, plain-spoken when the supplier is across the table.
- **Discipline, not paranoia.** The frame is "run AI vendors like any other critical supplier, plus six clauses and four SLA dimensions." Not "AI vendors are different and dangerous."
- **Leverage at signing.** The refrain across chapters: contract teeth, exit pre-write, and tier-appropriate diligence are bought when the vendor wants the deal, not when they want to leave.
- **No vendor-bashing.** Archetypes, not named vendors, for failure patterns.

## Theme

Same neutral-slate (`#475569` / `#334155` / `#0F172A` / `#64748B`) + orange accent (`#F97316` / `#FB923C`) on `#F8FAFC` tint. No emojis. Sora headings, Inter body. Procurement/leadership register — restrained colour, dense tables welcome, clause-style callouts for the six contract clauses and four SLA dimensions.
