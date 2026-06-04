# Enterprise Data Foundations for AI — Research Dossier

**Course slug:** `enterprise-data-foundations-for-ai`
**Track:** Foundations
**Audience:** Chief data officers, data platform leaders, enterprise architects making the platform calls that will define AI capability for the next five years
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Most enterprise AI projects don't fail at the model — they fail at the data step. The 2024–26 wave of foundation models made the model layer roughly commoditised; the moat is now the data underneath. CDOs and data platform leaders are placing platform bets today (lakehouse vs warehouse, catalog vendor, governance framework, contract pattern) that will compound for the next five years. The honest version: five pillars (quality, lineage, governance, privacy, platform pattern) plus the data product shift and data contracts. The three traps to avoid by name: buying a platform without fixing data, ocean-boiling cleanup projects, and a data team disconnected from the business it serves. This course is the foundations register — the CDO conversation a transformation director wishes their data leader was already having.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Industry pattern: most enterprise AI initiatives stall at data readiness, not model selection — repeatedly surfaced in McKinsey, BCG, Gartner enterprise AI surveys 2023–25 | McKinsey / BCG / Gartner enterprise AI surveys | 2023–2025 |
| 2 | DAMA-DMBOK (Data Management Body of Knowledge) — canonical reference for the data quality dimensions used industry-wide (accuracy, completeness, consistency, timeliness, validity, uniqueness) | DAMA International · DMBOK v2 | 2017, ongoing |
| 3 | Databricks lakehouse pattern — unified storage + governance layer (Unity Catalog); positioned as the converged warehouse/lake architecture | Databricks product documentation | 2024–2026 |
| 4 | Snowflake data cloud — separation of storage/compute, Horizon governance layer, Snowpark for AI workloads | Snowflake product documentation | 2024–2026 |
| 5 | Microsoft Fabric + OneLake + Purview — Microsoft's converged analytics + governance stack; Purview covers catalog, lineage, DLP across M365 + Azure data estate | Microsoft Learn / Fabric + Purview docs | 2024–2026 |
| 6 | Collibra — enterprise data catalog and governance platform; commonly named in large-bank and pharma RFPs | Collibra product documentation | 2024–2026 |
| 7 | Alation — data intelligence + catalog platform; behavioural-analytics-driven catalog discovery | Alation product documentation | 2024–2026 |
| 8 | Informatica IDMC — Intelligent Data Management Cloud; MDM, data quality, lineage, governance under one suite | Informatica product documentation | 2024–2026 |
| 9 | Atlan — modern active metadata / catalog player frequently shortlisted vs Collibra/Alation in 2024–26 RFPs | Atlan product documentation | 2024–2026 |
| 10 | Monte Carlo — data observability / data-downtime category leader; lineage-aware incident detection | Monte Carlo product documentation | 2024–2026 |
| 11 | EU AI Act (Regulation 2024/1689) Article 10 (data and data governance) + Article 15 (accuracy, robustness, cybersecurity) — high-risk AI systems must demonstrate data lineage, quality, and bias-mitigation evidence | EU AI Act Official Journal | 2024, full effect Aug 2026 |
| 12 | NIST AI Risk Management Framework — MEASURE function explicitly requires lineage, provenance, dataset documentation | NIST AI RMF 1.0 | Jan 2023 |
| 13 | GDPR Article 30 — record of processing activities; Article 22 — automated decision-making; both push lineage and traceability into data platform requirements | EU GDPR | 2018, ongoing |
| 14 | India DPDPA (Digital Personal Data Protection Act 2023) — consent, purpose limitation, data fiduciary obligations; rules notification 2025 | MeitY / DPDPA 2023 | 2023–2025 |
| 15 | California CCPA / CPRA — sale/share opt-out, sensitive personal information category, automated decision-making rule-making in 2025 | CPPA regulations | 2024–2025 |
| 16 | China PIPL — cross-border transfer assessment requirement; localisation expectation for sensitive data | PIPL 2021, CAC guidance | 2021–2024 |
| 17 | Differential privacy in production — US Census Bureau 2020 (formal DP at scale), Apple, Google adoption; ε budgeting becoming standard for analytics-on-PII | US Census / Apple / Google published implementations | 2020–2024 |
| 18 | Data mesh / data products pattern — Zhamak Dehghani 2019 thesis; productionised as "data products" in Databricks Unity Catalog, Snowflake, and most modern catalogs by 2024 | Dehghani · Thoughtworks + ongoing vendor uptake | 2019–2024 |
| 19 | Data contracts — Andrew Jones (2023 book) + open-source spec; emerging reliability layer between producers and consumers, mainstream in 2024–26 platform builds | Data Contracts book · open-source schema | 2023–2025 |
| 20 | The confabulated-lineage failure mode — LLM-generated lineage commentary or catalog descriptions that attribute fields to non-existent upstream sources. Industry pattern; ground in cross-domain analog (Mata v. Avianca S.D.N.Y. Jun 2023) | Industry pattern + Mata v. Avianca analog | 2024–2026 |
| 21 | ISO/IEC 42001 — AI management system standard; data governance is a named control domain | ISO/IEC 42001 | Dec 2023 |
| 22 | Vendor consolidation pattern 2024–26 — large enterprises moving from 8–12 best-of-breed data tools to 3–4 platform-anchored stacks (Databricks-anchored, Snowflake-anchored, or Fabric-anchored) | Industry pattern + analyst commentary | 2024–2026 |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — cross-domain analog for the confabulated-lineage failure mode: LLM invents authoritative-sounding upstream sources or field meanings. Ground catalog-LLM hallucination in this analog rather than a specific (unverifiable) named data-platform incident.
2. **US Census Bureau 2020 differential privacy** — the production-scale precedent for formal DP. Use to ground the "DP is not theoretical anymore" point.
3. **The buy-platform-without-fixing-data pattern** — industry pattern, not a named incident. Frame as the most expensive AI mistake CDOs repeatedly make.

## What we do NOT say

- **No vendor cheerleading.** Databricks, Snowflake, Fabric, Collibra, Alation, Informatica, Atlan, Monte Carlo named even-handedly. No "winner."
- **No "AI replaces governance."** AI raises the stakes on governance — it does not replace it.
- **No specific dollar/percent claims** about "data work = 80% of AI projects" unless cited to a real survey we can name. Reframe as "industry pattern, repeatedly surfaced."
- **No data-mesh dogma.** Federated-with-central-platform is the realistic pattern; pure mesh fails at small-mid enterprises.
- **No promise that lineage + catalog = compliance.** Necessary, not sufficient.
- **No "set and forget" data quality.** Quality is a runtime discipline, not a one-time cleanup.

## Chapter blueprint

### Chapter 1 — The data foundations landscape (~5 min)
**What:** Industry pattern — most AI projects fail at the data step, not the model step. Five pillars (quality, lineage, governance, privacy, platform pattern). Three anti-patterns named: buy-platform-without-fixing-data, ocean-boil cleanup, disconnected data team. The CDO frame: bets you make this year compound for five.
**Sources:** [1], [2], [22].

### Chapter 2 — Data quality (~5 min)
**What:** DAMA-DMBOK quality dimensions (accuracy, completeness, freshness, consistency). Three failure modes: entity-gap (customer master spread across CRM/ERP/billing), silent-drift (schema change broke a downstream model nobody noticed), quality-assumed (the dashboard says green, the data is yellow). Three patterns that work: observability (Monte Carlo / Soda pattern), contracts at producer boundary, quality SLAs tied to data products.
**Sources:** [2], [10], [19].

### Chapter 3 — Data lineage (~5 min)
**What:** Three reasons lineage matters in AI era — explainability (why did the model say that), regulation (EU AI Act Art 15 + GDPR Art 30 + NIST MEASURE), incident response (which models depend on this broken pipeline). Three layers: source-to-sink (technical), transformation (column-level), semantic (business meaning). Catalog vendors (Collibra, Alation, Atlan, Informatica, Purview) compete on which layers they automate. The confabulated-lineage failure mode (industry pattern + Mata v. Avianca analog).
**Sources:** [5], [6], [7], [8], [9], [11], [12], [13], [20].

### Chapter 4 — Data governance (~5 min)
**What:** Four components — ownership (every dataset has a named steward), access (RBAC + ABAC + purpose-based), retention (defensible deletion schedule), deletion (right-to-be-forgotten that actually flows through pipelines and model training sets). Multi-jurisdiction matrix: GDPR + India DPDPA + CCPA/CPRA + China PIPL. Three failure modes: orphan datasets (no owner), access drift (everyone has everything), deletion theatre (deleted in source, lingering in warehouse and model weights).
**Sources:** [13], [14], [15], [16], [21].

### Chapter 5 — Data privacy techniques (~5 min)
**What:** Three techniques — masking (deterministic / format-preserving), tokenisation (vault-backed), differential privacy (ε-budgeted, US Census 2020 precedent). Matched to four scenarios: analytics on PII, model training on PII, third-party data sharing, cross-border transfer. Three failure modes: re-identification via join, ε-budget exhausted without governance, masking-as-security (it isn't).
**Sources:** [13], [14], [16], [17].

### Chapter 6 — The platform pattern (~5 min)
**What:** Two architecture choices — lakehouse (Databricks, Snowflake, Fabric/OneLake) and federated-with-central-platform (each domain owns its data product, central platform provides catalog, lineage, contracts, observability). Pure data mesh fails at most enterprises; pure central-warehouse bottlenecks AI teams. Data products as the shift — datasets treated as products with owners, SLAs, versioning. Data contracts as the producer-consumer reliability layer (Jones 2023). The "3–5x AI team speed" claim framed as an industry pattern, not a survey number.
**Sources:** [3], [4], [5], [18], [19].

### Chapter 7 — Vendor + tooling reality (~5 min)
**What:** 2026 landscape — platform anchors (Databricks, Snowflake, Microsoft Fabric), catalog/governance (Collibra, Alation, Atlan, Informatica IDMC, Microsoft Purview), observability (Monte Carlo, Soda). Three build/buy principles: buy the catalog, buy the observability, build the contract schema. Consolidation pattern — moving from 8–12 tools to 3–4 platform-anchored stacks. AI-specific contract terms: training data rights, lineage attestation, model-fed data isolation, deletion propagation into training sets.
**Sources:** [3], [4], [5], [6], [7], [8], [9], [10], [22].

### Chapter 8 — Making it stick · 18-month rollout (~6 min)
**What:** Three-phase 18-month roadmap. Phase 1 (months 1–6): pick the platform anchor, stand up catalog + lineage on top-20 datasets, name owners. Phase 2 (months 7–12): observability + contracts on top-5 data products, governance matrix locked, privacy techniques in place. Phase 3 (months 13–18): scale the pattern, decommission shadow tools, AI-specific contract terms baked in. Four trust trip-wires: catalog-with-no-owners, contract-with-no-enforcement, lineage-only-on-warehouse, governance-as-PowerPoint. Interactive Markdown roadmap builder for the CDO's CIO conversation.
**Sources:** Composite of [3], [4], [5], [18], [19], [22].

## Tone

- **Andrew, CDO register.** Precise. Architect language. Vendor-neutral. Honest about cost.
- **Foundations, not hype.** The model layer is commoditising; the data layer is the moat.
- **Data products + contracts as the chorus.** Modern pattern, named clearly, with the federated-with-central caveat.
- **No vendor preaching.** Even-handed across Databricks / Snowflake / Fabric and Collibra / Alation / Atlan / Informatica / Purview.

## Theme

Neutral-slate (#475569 / #334155) + orange accent (#F97316). No emojis. Sora headings, Inter body. Matches the AI Readiness Assessment course family.
