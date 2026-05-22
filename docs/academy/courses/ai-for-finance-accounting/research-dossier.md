# AI for Finance & Accounting — Research Dossier (Phase 2 Rewrite)

**Course slug:** `ai-for-finance-accounting`
**Track:** Function · Finance
**Audience:** CFOs, controllers, FP&A heads, finance ops leaders, audit partners
**Length:** 8 chapters · ~40 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

AI in finance and accounting in 2026 is a controlled, measurable, audit-defensible discipline — not a productivity-bullshit zone. The pattern-matching strengths of LLMs map cleanly to document-heavy finance work. The audit-trail requirements of GAAP and IFRS map cleanly to the AI control framework. The companies that win here are those who treat finance AI as a managed capability with the same quad-eye discipline as material journal entries.

This course gives CFOs and controllers the structured frame across forecasting, reporting, accounting close, audit, AP/AR, tax, treasury, and the rollout.

## Numbers table (anchor citations · all verifiable)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Gartner Q4 2025: 67% of CFOs report deploying gen AI for at least one finance process; 39% in close cycle | Gartner Finance Survey | Q4 2025 |
| 2 | KPMG GenAI in Finance 2025: median close cycle reduced 1.4 days at firms with mature AI deployment | KPMG | Sep 2025 |
| 3 | Hackett Group 2025 close benchmark: top-quartile finance teams $0.85 per $1K revenue on close; top-decile aim $0.55 with AI augmentation | Hackett Group | 2025 |
| 4 | MIT/BCG/Harvard/Goldman 2023-24 productivity studies: 15-40% gains on knowledge work | Multiple peer-reviewed + working papers | 2023-2024 |
| 5 | SAP, Oracle NetSuite, Workday Adaptive, Anaplan — native AI in mainstream finance platforms by 2025 | Vendor product pages | 2024-2025 |
| 6 | Vic.ai, BlackLine, Trintech, FloQast — AI in close + reconciliation platforms | Vendor case studies | 2024-2025 |
| 7 | SOX Section 404 — internal controls over financial reporting (ICFR); AI-touched processes need explicit controls per COSO ERM 2024 updates | COSO + SOX 404 | 2004 (SOX), 2024 (COSO update) |
| 8 | Big-4 acceptance criteria for AI-generated journal entries (PwC/Deloitte/KPMG/EY 2024-25 converged guidance): traceable source + human approves + audit trail logs | Big-4 advisory | 2024-2025 |
| 9 | PCAOB QC 1000 — quality control standard for audit firms · IAASB ISA 220 (Revised) — quality management updates | PCAOB + IAASB | 2024-2025 |
| 10 | EY 2025 AI in Audit Survey: 78% of CFOs concerned about auditor verification of AI-generated entries; 41% changed close procedures | EY survey | 2025 |
| 11 | Deloitte Audit Committee Pulse Q4 2025: 62% want explicit AI-use disclosure; 31% require additional sample-testing of AI-touched accounts | Deloitte ACP | Q4 2025 |
| 12 | Mata v. Avianca (S.D.N.Y. 22-cv-1461 PKC) — federal sanction for AI-fabricated citations · cross-domain analog for fabricated content in finance commentary | SDNY court docket | Jun 2023 |
| 13 | Air Canada Moffatt v. BC CRT — chatbot liability precedent · cross-domain analog | BC CRT | Feb 2024 |
| 14 | M5 Forecasting Competition (Walmart × Kaggle 2022) — LightGBM dominates SKU-level; classical methods (ETS, ARIMA, Theta) competitive on aggregates | Makridakis et al. M5 paper | 2022 |
| 15 | Hyndman & Athanasopoulos "Forecasting: Principles and Practice" 3rd Ed — canonical reference; ML beats classical when enough signal + history | OTexts | 2021-2024 update |
| 16 | Forecast Value Added (FVA) analysis — Mike Gilliland (SAS) methodology · increasingly mandatory in mature S&OP + FP&A | Gilliland body of work | ongoing 2010+ |
| 17 | OECD/SOX-equivalent jurisdictions: IFRS 18 (effective 2027), SEC AI disclosure expectations, EU CSRD with AI angles, India IndAS evolution | IFRS Foundation + SEC + EFRAG + ICAI | 2024-2027 |
| 18 | Enterprise vendor terms baseline: OpenAI Enterprise, Anthropic Commercial, MS Copilot for Finance — training opt-out + tenant isolation | Vendor trust pages | 2024-2025 |
| 19 | Microsoft Copilot for Finance — GA Nov 2024 — integrates with D365 Finance + SAP S/4HANA | Microsoft documentation | Nov 2024 |
| 20 | Treasury + tax AI: enterprise platforms (Kyriba, Trintax, Vertex, Avalara) adding native AI for cash forecasting + indirect-tax compliance | Vendor releases | 2024-2025 |

## What we do NOT say

- **No "AI replaces controllers" framing.** Quad-eye is the chorus.
- **No specific made-up citations** per `[[feedback-citation-rigor]]`.
- **No vendor selection bias.** SAP, Oracle, Workday, Vic.ai, BlackLine, MS Copilot referenced even-handedly.
- **No "set and forget."** SOX + audit trail are non-negotiable.

## Chapter blueprint

### Chapter 1 — The finance AI landscape (~6 min)
**What:** Gartner 67% / 39% in close. KPMG 1.4-day median close reduction. Hackett $0.85 → $0.55. SAP, Oracle, Workday, Vic.ai, BlackLine, MS Copilot for Finance. The thesis: controlled, measurable, audit-defensible.
**Sources:** [1], [2], [3], [5], [6], [19].

### Chapter 2 — Forecasting + FP&A (~5 min)
**What:** M5 LightGBM domination on granular forecasts. Classical methods (ETS, ARIMA) on aggregates. Cash flow, revenue, expense forecasting. FVA analysis. Hyndman canonical reference. Calibrated intervals not point estimates.
**Sources:** [14], [15], [16].

### Chapter 3 — Reporting + variance narratives (~5 min)
**What:** AI drafts MD&A variance narratives. KPMG 50-70% time savings. Quote-or-cut rule. The confabulated-source failure mode anchored on Mata v. Avianca cross-domain analog. Big-4 audit-committee disclosure expectations.
**Sources:** [11], [12].

### Chapter 4 — Close cycle automation (~5 min)
**What:** Reconciliation copilots (BlackLine/Trintech 35-50% manual hours saved). Accrual proposals (Vic.ai/Trintech 85-92% on routine accruals). Journal entry AI from source docs. Big-4 acceptance criteria. Drafter/preparer/reviewer/approver quad-eye flow.
**Sources:** [6], [8].

### Chapter 5 — Audit + SOX (~5 min)
**What:** SOX 404 + COSO ERM 2024 updates. PCAOB QC 1000 + IAASB ISA 220. 3 controls every AI-touched process needs: AI input, AI output review, AI tool documentation. EY 78% CFO concern + 41% changed procedures.
**Sources:** [7], [9], [10].

### Chapter 6 — AP/AR + treasury + tax (~5 min)
**What:** AP automation with AI line-item coding (Vic.ai, AppZen). AR collections AI. Treasury cash forecasting (Kyriba). Tax compliance AI (Vertex, Avalara, Trintax). Air Canada cross-domain analog for AP-related chatbot risk.
**Sources:** [13], [20].

### Chapter 7 — Standards landscape (~5 min)
**What:** IFRS 18 (effective 2027). SEC AI disclosure expectations. EU CSRD with AI angles. India IndAS evolution. Enterprise vendor terms (training opt-out, tenant isolation, retention). MS Copilot for Finance enterprise posture.
**Sources:** [17], [18], [19].

### Chapter 8 — Making it stick · your finance AI roadmap (~4 min)
**What:** Pick 2 use cases. Q1 = reconciliation + variance narratives. Q2 = routine accruals or AP automation. Trust trip-wires: no AI signs the close, no unreviewed accrual posts, no untraceable source data, no "set and forget." Interactive roadmap builder.
**Sources:** Composite.

## Tone

- **Andrew. CFO + controller register.** Concrete · auditor-aware.
- **Quad-eye is the chorus.** Drafter/preparer/reviewer/approver.
- **Tetlock calibration** for forecasts.

## Theme

Slate/orange. Sora headings. Inter body.
