# Demand Forecasting in Practice — Research Dossier

**Course slug:** `demand-forecasting-in-practice`
**Track:** Function · Supply Chain & Operations
**Audience:** Supply chain leaders, S&OP heads, demand planners, ops directors past basic AI literacy
**Length:** 8 chapters · ~40 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Demand forecasting is the use case where ML on tabular data has been delivering measurable lift since long before generative AI was a thing. The 2024–26 wave isn't new techniques — it's *better-packaged* techniques (auto-feature, auto-tuned models in mainstream S&OP platforms) plus the *narrative layer* that LLMs add on top. The risk isn't the models. The risk is the same one Tetlock catalogued for human forecasters: confidence without calibration. This course teaches planners and S&OP leaders to ship demand-forecast AI that improves accuracy *and* honesty.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Gartner 2025 Supply Chain Top 25: 78% of leaders have an active AI-in-forecasting initiative; 41% report measurable accuracy lift | Gartner Supply Chain Top 25 2025 | 2025 |
| 2 | McKinsey "AI in supply chain 2025" — top quartile manufacturers report 15–30% forecast MAPE reduction from ML augmentation; top decile 30–50% in specific SKU classes | McKinsey supply chain AI report 2025 | 2025 |
| 3 | Hyndman & Athanasopoulos "Forecasting: Principles and Practice" 3rd Ed — the canonical reference; ML methods only beat classical (ETS, ARIMA) when there's *enough* signal and history (M5 competition validation) | Hyndman & Athanasopoulos · OTexts 2021/2024 update | 2021–2024 |
| 4 | M5 Forecasting Competition (Walmart × Kaggle 2020) results: top-50 entries were predominantly LightGBM-based; classical methods competitive on aggregated levels; LightGBM dominated SKU-store level | Makridakis et al. · M5 paper | 2022 publication |
| 5 | Croston's method for intermittent demand: standard in spare-parts forecasting; LightGBM + Croston-hybrid approaches now beat pure Croston in Boylan et al. 2024 update | International Journal of Forecasting · Boylan et al. | 2024 |
| 6 | SAP IBP, Oracle Demantra, Blue Yonder Luminate, o9 Solutions, Kinaxis Maestro — major S&OP platforms with native ML demand-sensing layers by 2025 | Vendor product pages 2025 | 2025 |
| 7 | OpenAI o-series / Anthropic Claude / Google Gemini — used in 2024–26 for forecast narrative generation (commentary layer over numeric models) | Vendor enterprise documentation | 2024–2026 |
| 8 | Forecast bias problem: industry studies (APICS / ASCM 2024-25) consistently find median forecast bias of +5 to +12% (over-forecasting) in B2C and CPG; planners over-forecast more than they under-forecast | APICS / ASCM 2024-25 bias study | 2024-2025 |
| 9 | The MAPE trap: MAPE is biased toward under-forecasting in intermittent demand. Use sMAPE, MASE, or RMSSE depending on context. M5 used RMSSE. | M5 paper + Hyndman & Athanasopoulos | 2022–2024 |
| 10 | Tetlock "Superforecasting" + "Expert Political Judgment": calibration matters more than accuracy point estimate. Translates to demand planning: forecast intervals matter as much as the point | Tetlock 2005, 2015 | classic references |
| 11 | Demand sensing — short-term (1-4 week) forecasts driven by POS data, weather, ad spend, social signals. Used to override mid-term planning forecast. Blue Yonder + o9 leaders | Blue Yonder + o9 product evidence | 2024-2025 |
| 12 | New product introduction (NPI) forecasting: ML on analog-product lookup + first 4-week early signals dramatically improves the 12-month forecast on new SKUs. Procter & Gamble case study 2024 | P&G + McKinsey case 2024 | 2024 |
| 13 | Promotional uplift forecasting: 2024-25 case studies from Coca-Cola, Unilever, Carrefour show 20-40% accuracy improvement on promotional weeks via AI vs naive baseline | Vendor case studies + Gartner | 2024-2025 |
| 14 | S&OP integration: SCC 2025 — only 38% of organisations connect ML demand forecast to executive S&OP decisions; the gap is the narrative layer + accountability | SCC 2025 + Gartner | 2025 |
| 15 | Forecast value-added (FVA) analysis: gold-standard methodology for measuring whether human override adds or subtracts accuracy. From Mike Gilliland (SAS) 2010+ — increasingly mandatory in mature S&OP | Gilliland FVA + APICS | ongoing |
| 16 | LLM hallucination in forecast narratives: the confabulated-source failure mode — LLM-generated S&OP commentary attributing variance to a planned promotion that was actually cancelled. The cross-domain analog is Mata v. Avianca (S.D.N.Y. Jun 2023). Pattern industry observers warn about. | Industry pattern + Mata v. Avianca analog | 2024-2026 |
| 17 | EU AI Act high-risk classification: demand forecasting itself is not Annex III, but employment-affecting workforce-planning forecasts are; supply chain leaders should know the boundary | EU AI Act 2024/1689 | Aug 2026 |
| 18 | India RBI guidance on AI in financial services (2025) — adjacent; supply chain AI is not directly regulated but explainability is becoming a vendor-RFP standard | RBI master direction 2025 | 2025 |
| 19 | Forecast horizon decomposition: short-term (1-4 wk) → ML demand sensing; mid-term (1-12 mo) → ML or hybrid; long-term (12-36 mo) → judgement-heavy + scenario; ML alone is weak past 6 months | Industry consensus + multiple vendor docs | 2024-2025 |
| 20 | Cost-of-forecast-error benchmark: APICS 2024 — typical CPG company sees 1pp of MAPE = $0.5-1.5M in inventory cost per $100M revenue. Real money. | APICS 2024 cost study | 2024 |

## Named incidents

1. **M5 Competition (2022)** — LightGBM-dominated, classical methods still competitive on aggregated levels. Use to ground "no single technique wins."
2. **The confabulated-source pattern in S&OP commentary** — LLM attributing variance to a planned promotion that was cancelled. Industry-observed pattern; ground in cross-domain analog (Mata v. Avianca) rather than a specific named publication.
3. **P&G NPI case (2024)** — analog-product lookup + early signals. Use to ground NPI methodology.

## What we do NOT say

- **No "AI replaces planners" framing.** Planner judgement + ML = better than either alone. FVA analysis is the chorus.
- **No vendor selection bias.** SAP IBP, Oracle, Blue Yonder, o9, Kinaxis referenced even-handedly.
- **No claim ML always beats classical.** M5 says ML wins at granular level. Classical competitive on aggregates.
- **No "set and forget."** Forecast value-added analysis is non-negotiable.
- **No predictions of accuracy above 15-30% MAPE reduction** unless top-decile + specific SKU class.

## Chapter blueprint

### Chapter 1 — The forecasting landscape (~6 min)
**What:** Gartner 78% / 41% lift. McKinsey 15-30% / 30-50% top-decile. M5 LightGBM domination. SAP IBP, Oracle, Blue Yonder, o9, Kinaxis. The Tetlock framing: calibration matters more than point estimate. The thesis: it's not new techniques — it's better-packaged techniques + LLM narrative layer.
**Sources:** [1], [2], [4], [6], [10].

### Chapter 2 — Accuracy, bias, and the MAPE trap (~5 min)
**What:** APICS 2024-25 bias study (+5 to +12% over-forecast). MAPE bias toward under-forecasting in intermittent. sMAPE, MASE, RMSSE alternatives. M5 used RMSSE. The honest accuracy reporting standard. APICS cost: 1pp MAPE = $0.5-1.5M per $100M.
**Sources:** [8], [9], [20].

### Chapter 3 — Choosing the right model (~5 min)
**What:** No single technique wins. Classical (ETS, ARIMA, Theta) competitive on aggregated levels per Hyndman & M5. LightGBM / XGBoost dominate SKU-store level with enough history. Croston for intermittent. The decision tree: history × signal × granularity → method.
**Sources:** [3], [4], [5].

### Chapter 4 — Demand sensing (~5 min)
**What:** Short-term (1-4 week) forecasts using POS, weather, ad spend, social signals. Blue Yonder + o9. Used to override mid-term forecast in the last mile. The lift is 5-15% on a 4-week horizon. The risk: chasing noise.
**Sources:** [11], [19].

### Chapter 5 — Promotional & event uplifts (~5 min)
**What:** 20-40% accuracy improvement on promotional weeks (Coca-Cola, Unilever, Carrefour). The pattern: clean promotion calendar + uplift model + cannibalisation modelling. The thing that breaks it: promotion calendar drift (planned vs actual not reconciled).
**Sources:** [13].

### Chapter 6 — New product introduction (~5 min)
**What:** Procter & Gamble 2024 case. Analog-product lookup + first 4-week early signals → 12-month forecast. The judgement layer: which analogs are valid. The discipline: lock the forecast for 4 weeks, then re-tune on real signal.
**Sources:** [12].

### Chapter 7 — Connecting forecast to S&OP (~5 min)
**What:** SCC research — only ~38% connect ML forecast to executive S&OP decisions. Forecast value-added (FVA) analysis. The narrative layer where LLMs add value — and the confabulated-source failure mode (industry pattern + cross-domain analog: Mata v. Avianca). Quote-or-cut for S&OP commentary. Executive consensus + planner judgement + ML.
**Sources:** [14], [15], [16].

### Chapter 8 — Making it stick · 2-quarter rollout (~4 min)
**What:** Pick 2 use cases. Q1 = baseline ML on top-100 SKUs + FVA analysis. Q2 = demand sensing on one channel OR promotional uplift. Defer: NPI, full-stack overhaul. Trust trip-wires: no model that can't be explained, no override without FVA recording, no AI-generated narrative without source check, no "set and forget."
**Sources:** Composite of [14], [15].

## Tone

- **Andrew, S&OP-leader register.** Precise. Numbers + accountability. Demand planners are practical.
- **Honest about ML limits.** ML isn't magic — better signals, better packaging. Planners with ML beat planners without it; but planners + ML still beats ML alone.
- **FVA as the chorus.** Calibration, not confidence.

## Theme

Same neutral-slate + orange-accent palette. No emojis. Sora headings, Inter body.
