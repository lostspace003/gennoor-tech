# AI ROI & Business Case Building — Research Dossier

**Course slug:** `ai-roi-business-case-building`
**Track:** Foundations · Finance & Investment
**Audience:** AI champions, business case authors, transformation leads, function heads making the case for AI investment, finance partners reviewing AI cases
**Length:** 8 chapters · ~30 min total
**Voice:** Emma (`en-GB-EmmaMultilingualNeural`)

## Thesis

Most AI business cases don't fail because the AI doesn't work — they fail because the case was built wrong. Benefits get inflated by counting "productivity hours saved" as if they convert 1:1 to cash. Costs miss the year-2 surprises (retraining · license drift · adjacent use cases). Risk is treated as zero. And the financial metrics get picked by accident instead of deliberately — payback to a CFO who only respects NPV, IRR to a sponsor who only reads payback. This course teaches AI champions to build cases finance will actually fund: 6-component framework, 7 cost buckets, 5 named AI-specific risks, 3-scenario modelling, the 4 CFO questions, and a 4-quarter realisation cadence that earns the *next* case credibility.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | NPV (Net Present Value) — the canonical method finance uses for capital allocation. Discount future cash flows at the firm's hurdle rate; positive NPV = create value. The CFO's preferred metric in mature firms. | Brealey, Myers & Allen *Principles of Corporate Finance* 13th Ed | 2019/ongoing |
| 2 | IRR (Internal Rate of Return) — the discount rate at which NPV = 0. Sponsor-friendly because it's a single percentage. Known weakness: non-monotonic cash flows can yield multiple IRRs; reinvestment-rate assumption inflates attractiveness. | Brealey/Myers + CFA Institute curriculum | ongoing |
| 3 | Payback period — months/years to recover initial outlay. Loved by operators and skeptical CFOs; ignores time value + post-payback cash flows. Best as a *liquidity/risk* signal alongside NPV. | Standard corporate finance texts + CFA curriculum | ongoing |
| 4 | MIT Sloan Management Review × BCG "AI and Business Strategy" annual survey — multi-year pattern: organisations with measurable AI value tend to be the minority; the gap between AI-active firms and AI-value-realising firms is the persistent finding. | MIT SMR × BCG annual reports | 2019–2025 |
| 5 | BCG "Where's the Value in AI?" / "Build for the Future" reports — recurring framing that ~10–15% of firms capture the majority of AI value; "AI leaders" outperform on financial KPIs. Use as pattern citation, not a single point-estimate. | BCG GenAI / AI value reports | 2023–2025 |
| 6 | McKinsey "State of AI" annual survey — pattern: gen-AI adoption rose sharply 2023–2025; reported bottom-line impact remains concentrated in specific functions (marketing/sales · software engineering · customer ops). Cite as pattern. | McKinsey State of AI | 2023–2025 |
| 7 | Gartner Hype Cycle for AI / Emerging Tech — generative AI moved through "Peak of Inflated Expectations" into "Trough of Disillusionment" in the 2024–25 cycles; predictive AI / ML is on the "Plateau of Productivity." | Gartner Hype Cycle annual | 2024–2025 |
| 8 | Gartner "through 2026, at least 30% of generative AI projects will be abandoned after proof-of-concept" — widely-cited pattern statement on PoC mortality. | Gartner press release | Jul 2024 |
| 9 | Productivity-benefit trap: "hours saved × fully loaded cost" only converts to cash when (a) headcount is removed, (b) volume is absorbed without backfill, or (c) the saved time funds revenue work. Otherwise it's a soft benefit. CFO red flag pattern. | Industry pattern · finance-function consensus | ongoing |
| 10 | 7 AI cost buckets: licenses · professional services · internal team time · change management · data preparation · infrastructure (compute/storage/egress) · ongoing operations (monitoring · retraining · incident response). Year-2 cost is typically 60–80% of year-1 in mature deployments. | Industry pattern + vendor TCO disclosures | 2024–2025 |
| 11 | Sensitivity analysis on 3-5 variables — adoption rate, benefit-per-user, ramp time, license cost, retraining frequency. Standard tornado-chart discipline from corporate finance. | Brealey/Myers + CFA + ASCM | ongoing |
| 12 | 3-scenario modelling (conservative · base · optimistic) — the standard finance-respected presentation. Conservative case must be defensibly fundable on its own. | Industry pattern · finance partner consensus | ongoing |
| 13 | "30% haircut test" — informal CFO heuristic: cut the AI champion's base-case benefit by 30% and re-check NPV. If the case dies, it wasn't a case. Pattern, not a single named source. | Industry pattern · CFO heuristic | ongoing |
| 14 | EU AI Act (Regulation 2024/1689) — high-risk classification affects employment, credit, insurance, education, critical infrastructure use cases. Compliance cost belongs in the business case. | EU AI Act 2024/1689 · OJ L | 2024 (in force Aug 2026) |
| 15 | India DPDP Act 2023 — data-processing AI use cases incur consent · purpose-limitation · grievance-officer compliance cost in India deployments. Belongs in the cost stack. | DPDP Act 2023 | 2023 |
| 16 | LLM hallucination → fabricated-source risk — model invents a citation that doesn't exist. Cross-domain analog: *Mata v. Avianca* (S.D.N.Y. Jun 2023). Pattern AI champions must mitigate in customer-facing or regulator-facing deployments. | *Mata v. Avianca* analog | Jun 2023 |
| 17 | Forecast bias toward over-optimism — Kahneman/Lovallo "Delusions of Success" (HBR 2003) reference-class forecasting; planning fallacy. Mandatory pre-mortem for AI business cases. | Kahneman & Lovallo *HBR* 2003 + Kahneman *Thinking Fast & Slow* 2011 | 2003/2011 |
| 18 | Pre-mortem discipline — Klein 2007 *HBR* "Performing a Project Premortem." Imagine the project failed at 12 months; work backwards. Lifts business-case quality. | Klein *HBR* Sep 2007 | 2007 |
| 19 | Realisation gap — pattern across PMO/transformation research: benefits delivered are typically 50–70% of benefits promised, absent a tracking cadence. Quarterly realisation review closes most of the gap. | PMI / industry pattern | ongoing |
| 20 | 4-quarter realisation cadence: Q1 adoption · Q2 productivity · Q3 outcomes · Q4 annual ROI re-baseline. The discipline that earns the next case credibility. | Industry pattern · transformation-PMO standard | ongoing |
| 21 | Stakeholder map: sponsors · approvers · influencers. Different stakeholders read different metrics — CFO reads NPV, operating sponsor reads payback, board reads IRR + payback. Pick the metric to the audience. | Industry pattern · investment-committee practice | ongoing |
| 22 | The 4 CFO questions (pattern): (1) what's the conservative-case NPV? (2) what assumptions break the case? (3) what's the run-rate cost at year 3? (4) how will we know it's working at 90 days? | Industry pattern · CFO/finance-partner consensus | ongoing |
| 23 | Hurdle rate / discount rate — must be sourced from corporate finance *before* the case is finalised, not assumed. Typical range 8–15% depending on firm risk profile + project category. | Corporate finance standard practice | ongoing |
| 24 | 5 named AI-specific risks: (1) model performance drift, (2) data/privacy incident, (3) regulatory shift, (4) vendor/model deprecation, (5) adoption shortfall. Each needs a mitigation + a residual-risk score. | Industry pattern · NIST AI RMF | 2023–2025 |
| 25 | NIST AI Risk Management Framework (AI RMF 1.0) — voluntary US standard for AI risk governance; increasingly referenced in enterprise risk registers. | NIST AI RMF 1.0 | Jan 2023 |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — fabricated-citation cross-domain analog for the LLM-hallucination risk row in the AI risk register. Ground specific-source claims here rather than invent named enterprise incidents.
2. **Gartner "30% of gen-AI projects abandoned after PoC by 2026"** — name it as the Gartner July 2024 pattern statement; use to ground the failure-mode discussion in Chapter 1.
3. **Kahneman & Lovallo "Delusions of Success" (HBR 2003)** — name it for the reference-class / planning-fallacy framing of benefit inflation in Chapter 2.
4. **Klein "Performing a Project Premortem" (HBR Sep 2007)** — name it for the pre-mortem discipline in Chapter 6.

## What we do NOT say

- **No invented enterprise case studies.** No "Company X saved $50M with AI" without a verifiable public source. Use industry patterns + cross-domain analogs.
- **No single-metric advocacy.** NPV is the CFO's metric, but IRR + payback exist for reasons. Teach the audience-to-metric mapping.
- **No "AI is special" exemption from corporate finance discipline.** NPV/IRR/payback existed before AI and survive it.
- **No vendor recommendations.** Frameworks, not platforms.
- **No payback-only framing.** Payback ignores time value + post-payback cash. Always alongside NPV.
- **No "this PoC will scale linearly" assumption.** PoC economics rarely survive contact with production.

## Chapter blueprint

### Chapter 1 — The AI ROI landscape (~4 min)
**What:** Why AI cases fail (4 fail modes: inflated benefits · missing costs · risk = 0 · wrong metric for the audience). Gartner July 2024: 30% of gen-AI projects abandoned after PoC by 2026. MIT-SMR × BCG pattern: AI-active firms ≠ AI-value firms. The 6-component framework: problem · benefits · costs · risk · metrics · stakeholders. The 30%-haircut test.
**Sources:** [4], [5], [7], [8], [13].

### Chapter 2 — Quantifying benefits (~4 min)
**What:** 3 benefit categories (revenue · cost · risk-avoidance). The productivity trap: hours saved ≠ cash unless headcount removed, volume absorbed, or time funds revenue. Direct vs indirect discipline. 3-scenario modelling (conservative · base · optimistic). Reference-class forecasting (Kahneman & Lovallo HBR 2003) against planning fallacy.
**Sources:** [9], [12], [17].

### Chapter 3 — Quantifying costs (~4 min)
**What:** The 7 cost buckets (licenses · services · internal team time · change management · data prep · infrastructure · ongoing ops). The year-2 surprise: retraining · license drift · adjacent use cases. Internal team time honesty — it's not free. EU AI Act + India DPDP compliance cost belongs here.
**Sources:** [10], [14], [15].

### Chapter 4 — Risk-adjusted ROI (~4 min)
**What:** 5 AI-specific risks (drift · data/privacy · regulatory · vendor/model deprecation · adoption shortfall) mapped against NIST AI RMF. The LLM fabrication risk grounded in the Mata v. Avianca cross-domain analog. 3-scenario ROI (worst · base · best). Sensitivity analysis on 3-5 variables — adoption, benefit-per-user, ramp, license, retraining frequency. Tornado chart.
**Sources:** [11], [16], [24], [25].

### Chapter 5 — NPV, IRR, payback (~4 min)
**What:** The 3 metrics, deliberately chosen per stakeholder. NPV = CFO + capital allocation. IRR = sponsor + board, with non-monotonic-cash-flow + reinvestment-rate caveats. Payback = operator + liquidity signal. Hurdle rate + discount rate sourced from finance *before* the case is final, not assumed. Never present just one.
**Sources:** [1], [2], [3], [21], [23].

### Chapter 6 — Stakeholders + CFO conversation (~4 min)
**What:** 3 stakeholder categories (sponsors · approvers · influencers) — name them, don't list "stakeholders" abstractly. The 4 CFO questions in 3 minutes: conservative-case NPV · assumption-break points · year-3 run-rate · 90-day signal. The pre-mortem (Klein HBR Sep 2007): imagine you failed at 12 months; work backwards.
**Sources:** [18], [21], [22].

### Chapter 7 — Measuring after launch (~4 min)
**What:** The realisation gap — benefits delivered are 50–70% of benefits promised absent a cadence. 4-quarter realisation rhythm: Q1 adoption · Q2 productivity · Q3 outcomes · Q4 annual ROI re-baseline. 3 discipline rules: report variance honestly · re-forecast at Q2 · close out failed cases publicly. Credibility for the next case is the prize.
**Sources:** [19], [20].

### Chapter 8 — Building your own (~4 min)
**What:** 2-week build cadence (week 1: problem + benefits + costs · week 2: risk + metrics + stakeholder map + pre-mortem + dry-run). 5 trust trip-wires: no benefit without a cash-conversion path · no cost without year-2 estimate · no risk register with all-low scores · no metric mismatched to audience · no case without a realisation plan. Interactive Markdown design-doc builder for the CFO walk-through.
**Sources:** Composite of [13], [22], [24].

## Tone

- **Emma, finance-partner register.** Precise · numerate · respectful of corporate finance discipline. AI champions are smart but often under-coached on how finance reads a case.
- **The CFO is not the enemy.** Teach the questions finance *will* ask so the champion arrives with answers, not surprises.
- **Realisation is the long game.** A case that under-delivered honestly earns more credibility than a case that over-claimed and got quietly buried.

## Theme

Neutral-slate (`#475569` / `#334155`) + orange accent (`#F97316` / `#FB923C`). Navy `#0F172A` for emphasis. No emojis. Sora headings, Inter body. Finance-document register, not consultancy-deck register.
