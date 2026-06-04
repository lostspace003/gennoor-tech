# AI in Pharma & Life Sciences — Research Dossier

**Course slug:** `ai-in-pharma-life-sciences`
**Track:** Industry · Pharma & Life Sciences
**Audience:** Biopharma executives, heads of R&D, clinical operations leaders, regulatory affairs heads, chief digital officers in life sciences
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

Pharma is the industry where the regulator has been in the room the whole time. The 2024–26 AI wave doesn't change that. It changes what the regulator is asking about. FDA's Good Machine Learning Practice principles, the AI/ML SaMD Action Plan, the 2025 draft guidance on AI in drug development, EMA's reflection paper, ICH E6(R3), 21 CFR Part 11 — all converge on the same expectation: AI used inside a regulated process must be qualified, documented, change-controlled, and auditable. The trap for biopharma leaders is treating AI like an R&D toy. The discipline that wins is treating AI like a piece of regulated infrastructure with intended use, performance evidence, risk classification, and a quality unit at the table. This course teaches biopharma leaders to ship the five plays that actually move the needle — discovery, trials, submissions, pharmacovigilance, commercial — without losing the inspection.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | FDA Good Machine Learning Practice for Medical Device Development — 10 guiding principles co-authored with Health Canada and UK MHRA | FDA / Health Canada / MHRA joint principles | Oct 2021 |
| 2 | FDA Action Plan for AI/ML-Based Software as a Medical Device (SaMD) — predetermined change control plans, real-world performance monitoring | FDA CDRH | Jan 2021, updated 2023–24 |
| 3 | FDA draft guidance "Considerations for the Use of AI to Support Regulatory Decision-Making for Drug and Biological Products" — context-of-use framework, credibility assessment | FDA CDER | Jan 2025 (draft) |
| 4 | 21 CFR Part 11 — electronic records and electronic signatures; audit trail, system validation, access control. The bedrock for any GxP system, AI included | US FDA Code of Federal Regulations | 1997, still binding |
| 5 | EMA Reflection paper on the use of AI in the medicinal product lifecycle — risk-based, human oversight, lifecycle accountability | EMA / HMA | Sep 2024 final |
| 6 | ICH E6(R3) Good Clinical Practice — modernised GCP; quality-by-design, risk-based monitoring, fit for digital trials | ICH | Jan 2025 adopted |
| 7 | ICH E8(R1) General Considerations for Clinical Studies — critical-to-quality factors; underpins protocol AI use | ICH | 2021 |
| 8 | ICH M7 — DNA-reactive impurities; in silico (QSAR) assessment is the textbook accepted AI-adjacent use in regulatory submission | ICH | 2017, R2 2023 |
| 9 | EU AI Act (Reg 2024/1689) Annex III — medical devices that are AI systems are high-risk; Article 50 transparency obligations for generative output | EU Official Journal | Aug 2026 phased |
| 10 | AlphaFold 2 (DeepMind) — protein structure prediction at near-experimental accuracy; AlphaFold 3 extends to complexes; widely adopted in target ID and structural biology | Jumper et al., Nature 2021; Abramson et al., Nature 2024 | 2021, 2024 |
| 11 | Insilico Medicine — INS018_055 (idiopathic pulmonary fibrosis), first end-to-end AI-discovered + AI-designed candidate to reach Phase II | Insilico Medicine company disclosures | 2023–24 |
| 12 | Exscientia / Sumitomo DSP-1181 (OCD) — early "AI-designed" candidate; discontinued in Phase I (2022). Honest evidence the disappointment pattern is real | Exscientia / Sumitomo disclosures | 2020 entry, 2022 discontinuation |
| 13 | BenevolentAI baricitinib repurposing for COVID-19 — knowledge graph hypothesis; later approved under EUA. Cited as the AI-repurposing reference case | The Lancet correspondence (Richardson et al.) | Feb 2020 |
| 14 | Recursion Pharmaceuticals — phenotypic screening at scale; merged with Exscientia in 2024 to consolidate the AI-discovery model | Company filings | 2024 |
| 15 | FDA pharmacovigilance — FAERS (FDA Adverse Event Reporting System) and the case-processing volume problem that NLP triage targets | FDA FAERS public data | ongoing |
| 16 | EMA / MHRA real-world evidence guidance — pre-specified analysis plan, fit-for-purpose data, transparency expected | EMA RWE framework + MHRA RWD guideline | 2023–24 |
| 17 | OPDP (FDA Office of Prescription Drug Promotion) — promotional material rules; fair balance, substantiation; binds any AI-generated promotional copy | FDA OPDP | ongoing |
| 18 | The Mata v. Avianca cross-domain analog — LLM-fabricated citations sanctioned by S.D.N.Y. Reframe for regulatory submissions: never let LLM-generated reference lists into an IND/NDA/MAA without human source verification | Mata v. Avianca, S.D.N.Y. | Jun 2023 |
| 19 | The Air Canada Moffatt analog — vendor held liable for chatbot output. Translates to medical affairs and commercial AI: the company owns what the bot says | Moffatt v. Air Canada, BCCRT 2024-149 | Feb 2024 |
| 20 | GAMP 5 Second Edition — ISPE guidance on validation of computerised systems; the practitioner reference for fitting AI into a GxP quality system | ISPE GAMP 5 v2 | Jul 2022 |
| 21 | FDA Computer Software Assurance (CSA) draft guidance — risk-based validation emphasis; aligns with how AI/ML systems should be qualified | FDA CDRH draft | Sep 2022 |
| 22 | Industry pattern: "AI-discovered" Phase II/III attrition matches historical base rates so far. The discovery-stage speed-up is real; clinical success is not yet proven | Industry pattern; multiple analyst notes | 2024–26 |

## Named incidents

1. **Exscientia / Sumitomo DSP-1181 (OCD, discontinued Phase I 2022)** — anchor for the honest "disappointment pattern": AI-designed candidates still face the same attrition curve.
2. **Insilico INS018_055 IPF (Phase II, 2023–24)** — anchor for the positive case: end-to-end AI discovery + design *can* reach the clinic.
3. **BenevolentAI / baricitinib for COVID-19 (Feb 2020 Lancet)** — anchor for AI-driven repurposing.
4. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — cross-domain analog for fabricated citations in regulatory submissions; never named as a pharma case.
5. **Moffatt v. Air Canada (BCCRT Feb 2024)** — cross-domain analog for medical-affairs / commercial chatbot accountability.

## What we do NOT say

- **No "AI cures cancer" framing.** AI accelerates discovery; clinical attrition is still the dominant reality.
- **No invented pharma incidents.** When we need the failure mode, we use the cross-domain analog (Mata, Moffatt) and name it as such.
- **No "AI replaces the medical reviewer."** Pharmacovigilance medical review is preserved. NLP triages; humans decide.
- **No regulator-bashing.** FDA and EMA are constructive on AI when intended use, performance, risk, and change control are documented.
- **No "skip validation."** GxP applicability is binary, not aesthetic. A model touching a regulated decision is a regulated system.
- **No promotional copy generated without MLR (Medical, Legal, Regulatory) review.** OPDP and EMA rules still bind every word.

## Chapter blueprint

### Chapter 1 — The pharma + life sciences landscape (~5 min)
**What:** AI accelerates within GxP guardrails. Patient safety, data integrity, regulatory accountability are non-negotiable. The five plays (discovery · trials · submissions · pharmacovigilance · commercial). The regulatory frame: FDA GMLP 2021, AI/ML SaMD Action Plan, the 2025 AI-in-drug-development draft, 21 CFR Part 11, EMA reflection paper, ICH E6(R3) / E8(R1) / M7, GAMP 5. Why this course differs from hospital clinical AI: pharma AI lives inside regulated *processes* (R&D, CMC, submissions, PV, MLR).
**Sources:** [1], [2], [3], [4], [5], [6], [7], [8], [20].

### Chapter 2 — Drug discovery (~5 min)
**What:** Four areas — target identification, lead generation, ADMET prediction, protein engineering. AlphaFold 2/3 as the structural-biology unlock. The Insilico positive case (INS018_055, IPF, Phase II). The honest disappointment pattern (Exscientia/Sumitomo DSP-1181 discontinued Phase I 2022). Validation discipline: wet-lab confirms, diverse held-out sets, no chemical-novelty leakage between train and test. The pattern: AI speeds the *front* of the pipeline; clinical attrition still dominates.
**Sources:** [10], [11], [12], [13], [14], [22].

### Chapter 3 — Clinical trial operations (~5 min)
**What:** Four use cases — patient identification, site selection, protocol optimisation, data quality monitoring. The GCP constraint: ICH E6(R3) and E8(R1) — quality-by-design, risk-based monitoring, critical-to-quality factors. The consent question: if AI screens EHRs to identify patients, the IRB/ethics committee and informed-consent language must reflect that. Real-world data feeds get the same scrutiny as trial data.
**Sources:** [6], [7], [16].

### Chapter 4 — Regulatory submission preparation (~5 min)
**What:** Three use cases — literature synthesis, document drafting (CSR sections, summaries), QSAR-style in silico assessment (ICH M7 is the worked example). The citation discipline: never let LLM-generated references reach an IND/NDA/MAA without human verification — Mata v. Avianca is the cross-domain analog. 21 CFR Part 11 audit trail: every AI-assisted edit must be attributable, time-stamped, and reversible. The FDA 2025 draft on AI for regulatory decision-making — context-of-use and credibility assessment as the framing language.
**Sources:** [3], [4], [8], [18].

### Chapter 5 — Pharmacovigilance + real-world evidence (~5 min)
**What:** Three PV use cases — case intake triage from FAERS-style streams, literature monitoring, signal detection support. Medical review is preserved — NLP narrows the queue, doesn't make the call. RWE with a *pre-specified* analysis plan (EMA and MHRA both insist). Fit-for-purpose data. Transparency on model versions and data cuts. The standard: every PV decision is still owned by a qualified person.
**Sources:** [5], [15], [16].

### Chapter 6 — Commercial + medical affairs (~5 min)
**What:** Three use cases — field-medical content support, MSL question handling, market-access dossier prep. The promotional compliance line: OPDP in the US and EMA promotional rules — fair balance, substantiation, no off-label. The MLR review gate is non-negotiable. The disclosure question: EU AI Act Article 50 on generative-output transparency. The chatbot accountability analog: Moffatt v. Air Canada — the company owns what the bot says.
**Sources:** [9], [17], [19].

### Chapter 7 — Validation, audit + GxP fit (~5 min)
**What:** GxP applicability is a yes/no question — if the model touches GLP, GCP, GMP, GDP, or GVP decisions, it's in scope. Four validation components: intended use, performance evidence, risk classification, change control. The audit-readiness expectation: documentation a regulator can read in an inspection. Quality unit involvement from day one. GAMP 5 v2 and FDA Computer Software Assurance as the practitioner references. Predetermined change control plans for models that learn.
**Sources:** [1], [2], [4], [20], [21].

### Chapter 8 — Making it stick · 18-month pharma AI roadmap (~6 min)
**What:** 18-month rollout. Months 1–6: governance, GxP scoping, intended-use inventory, pick 2 plays (suggest: discovery support + submission literature synthesis). Months 7–12: validate, instrument, MLR/QA loops, pharmacovigilance NLP pilot. Months 13–18: scale what survived audit; retire what didn't. Four trust trip-wires: (1) no AI-generated citations in a submission without human source check, (2) no PV case auto-closed without medical review, (3) no promotional copy past MLR without an AI-disclosure note where required, (4) no model in a GxP process without intended-use, performance, risk, change-control documentation. Interactive Markdown builder for the head of R&D or CDO.
**Sources:** Composite of [1], [3], [4], [5], [18], [19], [20].

## Tone

- **Emma, biopharma-leader register.** Calm. Precise. Regulator-aware. Not breathless.
- **Honest about discovery attrition.** AI accelerates; clinics still attrit.
- **Quality unit as ally, not obstacle.** GxP fit is the path to scale, not the brake on it.
- **No promotional adjectives.** Pharma audiences hear them as compliance risk.

## Theme

Neutral-slate primary (`#475569` / `#334155`) with orange accent (`#F97316` / `#FB923C`), navy `#0F172A`, slate-cyan `#64748B`, tint `#F8FAFC`. No emojis. Sora headings, Inter body.
