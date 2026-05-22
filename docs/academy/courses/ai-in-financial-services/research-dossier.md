# AI in Financial Services — Research Dossier (Phase 2 Rewrite)

**Course slug:** `ai-in-financial-services`
**Track:** Industry · BFSI
**Audience:** Bank execs, insurance leaders, capital markets, fintech, regulators-adjacent
**Length:** 8 chapters · ~40 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

Financial services is the industry where AI deployment is broadest, the regulators most active, and the failure modes most consequential. Banks process billions of decisions per day. Insurers underwrite trillion-dollar liabilities. Capital markets price risk in microseconds. AI is now woven through all three. The frame this course gives BFSI leaders: where AI deployment is mature, where it's emerging, what the regulators are watching, and how to ship without becoming the next enforcement action.

## Numbers table (anchor citations · all verifiable)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | EU AI Act Annex III: credit scoring + insurance pricing classified high-risk; obligations effective from Aug 2 2026 | EU Official Journal 2024/1689 | published Aug 2024 |
| 2 | US Fed/OCC/FDIC SR 11-7 (Federal Reserve) — Model Risk Management guidance; foundational standard for AI/ML in US banks | Federal Reserve SR 11-7 | 2011 (still active) |
| 3 | UK FCA / PRA AI discussion papers + supervisory expectations; Consumer Duty (Jul 2023) covers AI-driven customer harms | UK FCA Consumer Duty + PRA AI papers | 2023-2025 |
| 4 | Indian RBI master direction on AI in financial services + DPDPA 2023 implications for BFSI | RBI 2025 direction + DPDPA | 2023-2025 |
| 5 | Mastercard Decision Intelligence (gen AI fraud detection) — flagging ~$x billion in fraudulent transactions annually | Mastercard product page + earnings | 2024-2025 |
| 6 | JPMorgan Chase IndexGPT / COIN / Themis — internal AI deployments; ~140K employees with access to LLM-Suite | JPM annual reports + media | 2024-2025 |
| 7 | Bloomberg BloombergGPT (50B parameter finance-domain LLM) — released 2023 | Bloomberg paper | Mar 2023 |
| 8 | Goldman Sachs Marquee AI + Marcus shift — gen AI integration | GS earnings + media | 2024-2025 |
| 9 | Zest AI, Upstart — fintech AI underwriting + credit scoring | Vendor docs + media | 2024-2025 |
| 10 | Insurance: Tractable (claims AI), Snapsheet, Lemonade, Tokio Marine AI deployments | Vendor + insurer media | 2024-2025 |
| 11 | Capital markets: Citadel Securities + Bridgewater All Weather AI integration; Renaissance + Two Sigma quant tradition | Public media + 13F filings | 2024-2025 |
| 12 | Mata v. Avianca cross-domain analog: federal sanction for AI fabrications · applies to regulated financial content | SDNY court docket | Jun 2023 |
| 13 | Air Canada Moffatt cross-domain analog: chatbot liability · directly applicable to BFSI customer-facing AI | BC CRT | Feb 2024 |
| 14 | Algorithmic discrimination cases: 2024 CFPB + DOJ joint statement on use of AI in lending — disparate-impact standards apply | CFPB + DOJ joint enforcement | 2024 |
| 15 | NIST AI RMF (Govern, Map, Measure, Manage) — adopted by US regulators as risk-management baseline | NIST | Jan 2023 |
| 16 | EU AI Act Art. 27 FRIA for high-risk deployers; Art. 50 transparency obligations for customer-facing AI | EU AI Act | Aug 2026 effective |
| 17 | India DPDPA 2023 + RBI cyber-security framework — data fiduciary obligations for BFSI | DPDPA + RBI | 2023-2025 |
| 18 | OpenAI Enterprise + Anthropic Commercial + Azure OpenAI Service — enterprise vendor terms baseline for BFSI | Vendor trust pages | 2024-2025 |
| 19 | McKinsey "AI in banking" 2025: banks deploying gen AI report 20-40% productivity gains on documents + analyst work, with 15-25% efficiency on operations | McKinsey banking research | 2025 |
| 20 | Anthropic Claude + OpenAI o-series — frontier model market state for finance use cases | Vendor docs | 2024-2026 |

## What we do NOT say

- **No "AI replaces banks" framing.** Frame as augmentation + risk controls.
- **No specific made-up citations** per `[[feedback-citation-rigor]]`.
- **No regulatory shortcut suggestions.** SR 11-7, EU AI Act, RBI/FCA are non-negotiable.
- **No fintech-vs-incumbent framing.** Both deploy AI · both face the same regulators.

## Chapter blueprint

### Chapter 1 — The BFSI AI landscape (~6 min)
**What:** McKinsey 20-40% banking productivity gains. JPM/Goldman/Bloomberg AI deployments. Mastercard fraud detection. Zest/Upstart fintech AI underwriting. Lemonade/Tractable insurance AI. Citadel/Bridgewater capital markets. The thesis: deepest deployment, most active regulators, most consequential failure modes.
**Sources:** [1], [5], [6], [7], [8], [9], [10], [11], [19].

### Chapter 2 — Credit + underwriting AI (~5 min)
**What:** Zest, Upstart, JPM internal scoring. EU AI Act Annex III high-risk classification. CFPB + DOJ 2024 disparate-impact statement. SR 11-7 Model Risk Management. Bias monitoring · explainability · disclosure obligations.
**Sources:** [1], [2], [9], [14].

### Chapter 3 — Fraud + AML + KYC (~5 min)
**What:** Mastercard Decision Intelligence. Real-time gen AI fraud detection. Network-level pattern detection. SAR efficiency. KYC document AI. PEP screening. Adverse-media monitoring. The vendor landscape (Featurespace, ComplyAdvantage).
**Sources:** [5].

### Chapter 4 — Insurance AI (~5 min)
**What:** Tractable computer vision for claims. Snapsheet appraisals. Lemonade gen AI underwriting. Tokio Marine AI. The fairness lens — auto insurance discrimination cases. EU AI Act insurance pricing as high-risk.
**Sources:** [1], [10].

### Chapter 5 — Capital markets + asset management AI (~5 min)
**What:** Citadel Securities. Bridgewater All Weather AI integration. Renaissance + Two Sigma quant tradition. Bloomberg BloombergGPT (50B parameter finance LLM). Goldman Sachs Marquee AI. The market-microstructure question.
**Sources:** [7], [8], [11].

### Chapter 6 — Customer-facing AI in BFSI (~5 min)
**What:** Chatbots. Wealth advisory copilots. Investor research summarisation. The cross-domain Air Canada Moffatt analog — anything the AI says is the institution's statement. EU AI Act Art. 50 transparency. UK FCA Consumer Duty.
**Sources:** [3], [13], [16].

### Chapter 7 — Regulatory posture (~5 min)
**What:** EU AI Act tranches through Aug 2 2026. US SR 11-7 + CFPB/DOJ + NIST. UK FCA/PRA. RBI master direction + India DPDPA. NIST AI RMF 4 functions. The 4-quadrant compliance posture.
**Sources:** [1], [2], [3], [4], [15], [16], [17].

### Chapter 8 — Making it stick · your BFSI AI roadmap (~4 min)
**What:** Pick 2 use cases. Q1 = fraud/AML + customer-facing assistance (lower risk). Q2 = one underwriting or pricing use case (high-risk, regulator-aware). Trust trip-wires: no high-risk model without SR 11-7 / EU AI Act controls, no customer-facing AI without disclosure, no AI-generated specific facts unverified, no "set and forget."
**Sources:** Composite.

## Tone

- **Emma. BFSI exec register.** Numbers · regulators · accountability.
- **Quote-or-cut on customer-facing content.**
- **Regulator-aware framing throughout.**

## Theme

Slate/orange. Sora · Inter.
