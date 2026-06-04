# AI for Operations & Supply Chain — Research Dossier

**Course slug:** `ai-for-operations-supply-chain`
**Track:** Function · Supply Chain & Operations
**Audience:** COOs, Chief Supply Chain Officers, VPs of operations, plant-and-network leaders, demand planning + procurement + logistics + maintenance heads
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Operational AI quietly compounds. Customers do not see it, but every percentage point of working capital, every reduction in stock-out, every gain in efficiency flows straight to the P&L. The 2024–26 wave is not new science — it is six plays that consistently ship (forecasting · procurement · logistics · maintenance · inventory · supplier risk) plus three anti-plays that consistently break (autonomous high-stakes decisions · pure ML without operations research · set-and-forget models). The differentiator is the **AI+OR principle** (AI improves the inputs, OR does the optimisation), the **data-stable filter** that sequences the roadmap, and four trust trip-wires that protect the COO from the false-confidence year. This course teaches ops leaders to ship operational AI that compounds rather than collapses.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Gartner Supply Chain Top 25 2025 — top performers are running multiple production AI use cases across plan/source/make/deliver, not pilots | Gartner Supply Chain Top 25 2025 | 2025 |
| 2 | McKinsey "Succeeding in the AI supply-chain revolution" — leaders report 15% logistics cost reduction, 35% inventory reduction, 65% service-level improvement on mature deployments (top-quartile, multi-year) | McKinsey Operations practice | 2021/2024 update |
| 3 | Blue Yonder Luminate / Cognitive Solutions — native ML for demand sensing, fulfilment, and warehouse + transport optimisation; OR engines integrated | Blue Yonder product evidence | 2024–2025 |
| 4 | o9 Solutions "Digital Brain" — knowledge-graph + ML for integrated business planning, demand sensing, and supply-network optimisation | o9 product evidence | 2024–2025 |
| 5 | Kinaxis Maestro (formerly RapidResponse) — concurrent planning + ML demand sensing + scenario simulation; emphasis on AI-augments-planner not replaces | Kinaxis product evidence | 2024–2025 |
| 6 | SAP IBP + Joule, Oracle Fusion SCM, Microsoft Dynamics 365 SCM Copilot — hyperscaler-adjacent suites embedding LLM copilots into S&OP and procurement flows | Vendor enterprise documentation | 2024–2026 |
| 7 | The MAPE trap — MAPE is biased toward under-forecasting in intermittent demand; M5 Forecasting Competition used RMSSE; sMAPE / MASE alternatives standard | M5 paper · Hyndman & Athanasopoulos | 2022–2024 |
| 8 | M5 Forecasting Competition (Walmart × Kaggle 2020) — top-50 entries predominantly LightGBM; classical (ETS, ARIMA) competitive at aggregated levels | Makridakis et al. M5 paper | 2022 |
| 9 | Forecast Value-Added (FVA) analysis — Mike Gilliland (SAS) methodology; increasingly mandatory in mature S&OP to measure whether human override adds or subtracts accuracy | Gilliland FVA · APICS | ongoing |
| 10 | Procurement document AI (PO / invoice / contract extraction) — 60–80% straight-through rates on structured documents in mature deployments; pattern across Microsoft Syntex, Google Document AI, AWS Textract | Hyperscaler product evidence | 2024–2025 |
| 11 | AI+OR principle in logistics — ML predicts ETAs / demand / service times; classical OR (MILP, VRP solvers, network-flow) does the optimisation. Industry pattern reflected in Blue Yonder + o9 + Kinaxis architectures | Industry pattern + vendor architectures | 2024–2025 |
| 12 | Predictive maintenance — sensor + narrative pattern; ISO 17359 condition-monitoring standard; AI surfaces anomalies, qualified inspector clears high-consequence equipment | ISO 17359 · industry pattern | ongoing |
| 13 | Dynamic safety stock — ML adjusts safety stock by SKU × location × lead-time variability; replaces single service-level rule; pattern in Blue Yonder, o9, ToolsGroup, RELEX | Vendor product evidence | 2024–2025 |
| 14 | Markdown / price optimisation — ML on sell-through curves + competitor signals + weather + inventory position; retail pattern in dunnhumby, RELEX, Blue Yonder, Oracle Retail | Vendor product evidence | 2024–2025 |
| 15 | Supplier risk monitoring — Resilinc, Everstream Analytics, Interos, Sayari, Moody's Orbis Supplier — 5 signal sources (geo · climate · cyber · financial · ESG) typical | Vendor product evidence | 2024–2025 |
| 16 | LLM hallucination in S&OP commentary — the confabulated-source failure mode (LLM attributes variance to a planned promotion that was cancelled). Cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023) | Industry pattern + Mata v. Avianca analog | 2023–2026 |
| 17 | EU AI Act 2024/1689 — Annex III covers employment-affecting workforce planning; supply chain forecasting itself is not high-risk, but workforce-planning forecasts can be | EU AI Act 2024/1689 | published 2024 · phased 2025–2027 |
| 18 | EU Corporate Sustainability Due Diligence Directive (CSDDD) — supplier-tier visibility increasingly mandated; AI supplier-risk tooling becoming compliance infrastructure not just resilience | CSDDD 2024 | phased from 2027 |
| 19 | Cost-of-forecast-error benchmark — APICS 2024: typical CPG company sees 1pp of MAPE ≈ $0.5–1.5M in inventory cost per $100M revenue | APICS 2024 cost study | 2024 |
| 20 | End-to-end visibility reality — Gartner repeatedly reports <30% of organisations have multi-tier (tier-2/tier-3) supplier visibility despite a decade of investment; honest baseline for any roadmap | Gartner CSCO survey pattern | 2023–2025 |
| 21 | Procurement contract intelligence — pattern across Icertis, SirionLabs, DocuSign CLM, Sirion — clause extraction, obligation tracking, renewal flagging; legal sign-off on clause taxonomy non-negotiable | Vendor product evidence | 2024–2025 |
| 22 | Dispatcher reality check — last-mile routing models that look good in simulation routinely fail on driver acceptance; the constraint is human override volume, not solver quality | Industry pattern (logistics) | 2024–2025 |

## Named incidents

1. **M5 Competition (2022)** — LightGBM-dominated, classical methods competitive at aggregate. Use to ground "no single technique wins" for forecasting.
2. **The confabulated-source pattern in S&OP / procurement commentary** — LLM attributes variance to a cancelled promotion or cites a non-existent supplier clause. Industry-observed; ground in cross-domain analog (Mata v. Avianca S.D.N.Y. Jun 2023).
3. **The dispatcher-override pattern in last-mile** — high-quality routing model fails on driver acceptance. Industry pattern; do not name a specific company.
4. **Multi-tier visibility gap (Gartner CSCO survey pattern)** — sub-30% visibility past tier-1 is the honest baseline for supplier risk roadmaps.

## What we do NOT say

- **No "AI runs the supply chain."** AI improves inputs; humans plus OR plus AI run the supply chain.
- **No vendor selection bias.** Blue Yonder, o9, Kinaxis, SAP IBP, Oracle, Microsoft Dynamics, ToolsGroup, RELEX referenced even-handedly.
- **No autonomous decisions on safety-critical or high-stakes ops moves.** Predictive maintenance never eliminates qualified inspection.
- **No "pure ML beats OR."** The AI+OR principle is the chorus.
- **No set-and-forget.** Model drift + process drift are the two failure modes; FVA + trust trip-wires are non-negotiable.
- **No invented case studies.** Where a story is industry pattern, say so; reserve named incidents for verifiable references.

## Chapter blueprint

### Chapter 1 — The ops + supply chain AI landscape (~5 min)
**What:** Gartner Top 25 production reality. McKinsey leader benchmarks (15% logistics / 35% inventory / 65% service). 6 plays · 3 anti-plays · the data-stable filter (data ready + process stable). Vendor landscape: Blue Yonder, o9, Kinaxis, SAP IBP, Oracle, Microsoft Dynamics. Why operational AI compounds.
**Sources:** [1], [2], [3], [4], [5], [6], [20].

### Chapter 2 — Demand forecasting at scale (~5 min)
**What:** MAPE trap. FVA discipline. Hierarchical reality (aggregate vs SKU-location). 3 architectures (GBM · hybrid classical+ML · DL). 3-question honest scoring. APICS cost benchmark (1pp MAPE ≈ $0.5–1.5M per $100M). Cross-link to standalone *Demand Forecasting in Practice*.
**Sources:** [7], [8], [9], [19].

### Chapter 3 — Procurement automation (~5 min)
**What:** 3 use cases — document AI (PO/invoice extraction at 60–80% STP) · supplier matching · contract intelligence (clause extraction + obligation tracking). 3-tier human-in-loop (auto · review · escalate). Audit + compliance posture. Legal sign-off on clause taxonomy.
**Sources:** [10], [21], [16].

### Chapter 4 — Logistics optimisation (~5 min)
**What:** The AI+OR principle — AI improves ETAs / demand / service-time inputs; OR (MILP, VRP, network-flow solvers) does the optimisation. 3 use cases (network design · routing · last-mile). 3 failure modes. Dispatcher reality check (driver acceptance is the binding constraint, not solver quality).
**Sources:** [11], [22].

### Chapter 5 — Predictive maintenance (~5 min)
**What:** Sensor + narrative pattern. 3 components (signal acquisition · anomaly detection · narrative layer engineers act on). The safety constraint — AI never eliminates qualified human inspection on high-consequence equipment (ISO 17359 condition-monitoring framing). False-positive fatigue as the year-2 failure mode.
**Sources:** [12].

### Chapter 6 — Inventory intelligence (~5 min)
**What:** Dynamic safety stock by SKU × location × lead-time variability. 3 use cases (safety stock · allocation · markdown timing). 3 failure modes (stale lead-time data · ignored cannibalisation · markdown chasing weather noise). 3-question honest scoring before scaling.
**Sources:** [13], [14].

### Chapter 7 — Supplier risk monitoring (~5 min)
**What:** 4 risk dimensions (geo · climate · cyber · financial — ESG/CSDDD as the fifth lane). 5 signal sources (Resilinc / Everstream / Interos / Sayari / Moody's pattern). 4-phase response cadence (detect · assess · escalate · contingency). Top-supplier contingency (named alternates, pre-qualified, tested). Multi-tier visibility honest baseline.
**Sources:** [15], [18], [20].

### Chapter 8 — Making it stick · your ops AI roadmap (~6 min)
**What:** End-to-end visibility reality (sub-30% multi-tier is the honest start). 18-month rollout sequenced by the data-stable filter. 4 trust trip-wires (no autonomous high-stakes moves · no AI-generated narrative without source check · no override without FVA recording · no model without quarterly drift review). Interactive Markdown builder for the COO + CSCO conversation. Cross-link to *AI in Manufacturing* and *Demand Forecasting in Practice*.
**Sources:** Composite of [1], [9], [16], [20].

## Tone

- **Andrew, COO / CSCO register.** Precise. Numbers + accountability. Operations leaders are practical and skeptical.
- **AI+OR principle as the chorus.** AI improves inputs; OR does optimisation; humans own decisions.
- **Honest about the data-stable filter.** Most ops AI failures are data + process problems wearing model clothing.
- **Compounding language.** Operational AI is quiet, cumulative, P&L-flowing — not headline-grabbing.

## Theme

Neutral-slate (`#475569` / `#334155`) + orange accent (`#F97316` / `#FB923C`) on near-white tint (`#F8FAFC`). No emojis. Sora headings, Inter body. Same palette as *Demand Forecasting in Practice* and *AI in Manufacturing* — function-track visual continuity.
