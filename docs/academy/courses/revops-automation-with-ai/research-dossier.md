# Research Dossier — RevOps Automation with AI

**Course:** RevOps Automation with AI (Function track — Sales)
**Audience:** RevOps, sales ops, GTM systems leaders running Salesforce / HubSpot / Microsoft Sales Copilot at scale
**Duration:** ~60 min · 8 chapters
**Voice:** Andrew (alternation rule — Course 1 Emma, 2 Andrew, 3 Emma, 4 Andrew, 5 Emma, 6 Andrew)
**Build date:** May 2026

---

## Theme 1 — Forecast accuracy with AI

**1. Salesforce — State of Sales Report (7th ed.)** — https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/ — *Feb 2026*. **87% of sales orgs now use AI** somewhere in the cycle. 54% of sellers have used AI agents; ~9 in 10 plan to by 2027. Base: 4,050 sales pros, Aug–Sept 2025.

**2. HubSpot — Breeze AI Forecast projections** — https://knowledge.hubspot.com/forecast/improve-forecasting-with-ai-projections — *2025, live 2026*. Projects future sales from closed-won deals past 3 months. Provides upper/lower bounds via probability-weighted historical patterns. **Calibration layer, not replacement.**

**3. Microsoft — Sales Agent in M365 Copilot: Evaluation Technical Report** — https://techcommunity.microsoft.com/blog/microsoft365copilotblog/sales-agent-in-microsoft-365-copilot-evaluation-results-%E2%80%93-technical-report/4476867 — *2025*. Controlled eval, 547 prompts. Outperforms ChatGPT on accuracy, relevance, completeness. **Sellers handle ~10% more customer meetings, save ~1.7 hours/week on meeting prep.**

**4. Microsoft Learn — Copilot in Dynamics 365 Sales overview** — https://learn.microsoft.com/en-us/dynamics365/sales/copilot-overview — *2026 wave 1/2*. Real-time adaptive forecasts pulling operational + financial signals via Research Agent.

## Theme 2 — The 3 forecast-AI failure patterns

**5. Wang et al. — Concept Drift for CTR Prediction** — arXiv 2204.05101 — *2022*. Formal treatment of concept drift — P(Y|X) changes silently while dashboards look healthy. Maps directly to CRM win-rate models when buying patterns shift mid-quarter.

**6. Ahmed et al. — Customer Churn Prediction Systematic Review** — MDPI ML&KE — https://www.mdpi.com/2504-4990/7/3/105 — *2025*. Identifies concept drift + class imbalance + stale training data as the three dominant failure modes for CRM predictive models. Static models lose responsiveness as buyer behaviour evolves.

**7. Hyndman — Prediction Intervals for Time-Series Forecasting** — Springer — https://link.springer.com/chapter/10.1007/978-0-306-47630-3_21. **Why a point forecast without a PI is operationally misleading.** A 95% PI captures true value 95% of time; reporting a single number hides the uncertainty that should drive CFO conversation. *Give the board a range, not a number.*

## Theme 3 — Pipeline hygiene automation

**8. Salesforce Trailhead — Pipeline Inspection with Einstein Insights** — https://trailhead.salesforce.com/content/learn/modules/sell-smarter-with-pipeline-inspection/understand-deal-health-with-insights-and-scores. Scores deals **1–99** using Einstein. Flags stalls by **days-in-stage and push count** (how many times close date moved). Surfaces upside/risk.

**9. ZoomInfo Customer Impact Report 2025** — https://pipeline.zoominfo.com/sales/zoominfo-customer-impact-report-2025-gtm-intelligence-era. **14-point lift in deal close rate (32% → 46%)** among ZoomInfo customers. Seismic: +54% productivity, **11.5 hours/week saved**, 39% of pipeline attributed to ZoomInfo signals.

## Theme 4 — Rep revolt · the "AI nag" problem

**10. Gartner — AI Agents Will Outnumber Sellers 10× by 2028** — https://www.gartner.com/en/newsroom/press-releases/2025-11-18-gartner-predicts-by-2028-ai-agents-will-outnumber-sellers-by-10x-yet-fewer-than-40-percent-of-sellers-will-report-ai-agents-improved-productivity — *Nov 18, 2025*. Direct VP Analyst quote: *"Beyond a certain point, more AI does not mean more productivity. Layering additional prompts and tools onto already complex workflows risks overwhelming sellers and accelerating burnout."* **<40% of sellers will report AI improved their productivity by 2028.**

**11. Gartner Seller Skills Survey** — https://www.gartner.com/en/articles/ai-driven-sales-metrics — *2024, cited 2025-26*. **70% of sellers report being overwhelmed by the number of technologies required to do their job.** Pair with 2022 burnout study (89% of sellers burned out): https://www.gartner.com/en/newsroom/press-releases/2022-08-30-gartner-sales-survey-finds-nearly-90-percent-of-selle

## Theme 5 — Territory & account optimisation

**12. 6sense — Rithum customer story (2025 Breakthrough Award)** — https://6sense.com/customer-stories/. **3× sales adoption in 90 days. 6sense-qualified accounts drove 58% of all opportunities and carried 37% higher avg deal value.** Cleanest publicly-available intent-signal scoring case.

**13. ZoomInfo Copilot Workspace launch** — https://ir.zoominfo.com/news-releases/news-release-details/zoominfo-copilot-workspace-complete-book-business-one-workspace/ — *2025*. MajorKey Technologies: **16% revenue lift** attributed to AI. Simmers Crane Design: **20% sales jump within one month** of deploying AI sales tooling.

## Theme 6 — Sales analytics narratives · the QBR brief

**14. HBR — AI-Generated 'Workslop' Is Destroying Productivity** — https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity — *Sept 2025*. **41% of workers have received AI "workslop"** — polished but substance-less. Avg rework cost: **~2 hours per instance, ~$186/employee/month, scaling to >$9M/year** for large orgs. Strongest peer-grade citation for "an AI QBR brief that hallucinates a trend creates more cleanup than it saves."

**15. Pinsent Masons — Air Canada chatbot liability** — https://www.pinsentmasons.com/out-law/news/air-canada-chatbot-case-highlights-ai-liability-risks — *2024*. BC Civil Resolution Tribunal: Air Canada liable for chatbot hallucination. **CA$812.02 + precedent.** "Your AI-generated QBR is YOUR statement — own its errors."

**16. Salesforce Ben — Agentforce hallucinations vs bad data** — https://www.salesforceben.com/are-agentforce-hallucinations-a-problem-or-is-it-just-your-bad-data/ — *2025*. Practitioner counterpoint to vendor messaging — most "hallucinations" trace to ungrounded or dirty data. Pair with Salesforce's official grounding doc: https://help.salesforce.com/s/articleView?id=service.einstein_generative_ai_grounding_setup.htm

## Theme 7 — GTM data cleanup

**17. Salesforce Engineering — AI Identity Resolution in Data Cloud** — https://www.salesforce.com/blog/identity-resolution-in-data-cloud/ — *2025*. Fuzzy matching + AI identity resolution as the foundation Agentforce reasons over. **AI quality is downstream of identity resolution quality.**

**18. Gartner — Data Quality cost estimate** (cited via Salesforce-hosted analysis) — https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/data_quality.pdf — *2025*. **Poor data quality costs the average organisation $12.9M annually.** B2B contact data decays at **~22.5–30% per year** (email decay 23–30%). Why annual cleanup projects never catch up — *drift outruns the project cadence*.

## Theme 8 — Compensation modeling with AI

**19. CaptivateIQ — Catalyst AI launch** — https://www.prnewswire.com/news-releases/from-planning-to-payout-captivateiq-unifies-sales-planning-and-incentive-compensation-with-ai-infused-platform-302527330.html — *Aug 12, 2025*. AI/ML layer for custom forecasting, anomaly detection, scenario modeling on comp plans pre-rollout. **Companies that revisit incentive plans more frequently see 3× growth vs annual-plan companies.**

**20. Xactly — Incent AI Agents launch** — https://www.xactlycorp.com/company/press-room/xactly-unveils-new-ai-agents-transform-incentive-compensation-management — *Dec 2025*. Rapidly model and deploy new plans, surface optimisations, adapt to market shifts.

**21. Larkin — Employee Gaming in Enterprise Software Sales** — HBS Working Paper 13-073 — https://www.hbs.edu/ris/Publication%20Files/13-073_cbb24c28-9e84-47d9-8a32-f01b73cfda13.pdf. Empirical study showing enterprise software reps **shift deal timing and pricing in response to commission accelerators** — comp plans get gamed when reps optimise for the metric, not the goal. Academic backbone for the "AI optimising the wrong metric" risk slide.

## Theme 9 — Tooling stack decisions in 2026

**22. Microsoft + Gartner Magic Quadrant 2025 SFA** — https://www.microsoft.com/en-us/dynamics-365/blog/business-leader/2025/07/30/microsoft-named-a-leader-in-the-2025-gartner-magic-quadrant-for-sales-force-automation-platforms/ — *Jul 30, 2025*. 2025 SFA MQ Leaders: **Salesforce (19th consecutive year), Microsoft (15th), Oracle (9th).** Gartner notes the matrix barely moved YoY as the market waits for agentic AI to shake out.

**23. Microsoft 365 Copilot Pricing** — https://www.microsoft.com/en-us/microsoft-365-copilot/pricing — *current 2026*. M365 Copilot Enterprise **$30/user/month annual**. Copilot for Sales bundled at no extra cost for M365 Copilot Enterprise; **$50/user/month standalone**. The pricing anchor for the stack-decision slide.

## Theme 10 — Multi-tool AI sprawl

**24. Gartner — Six Steps to Manage AI Agent Sprawl** — https://www.gartner.com/en/newsroom/press-releases/2026-04-28-gartner-identifies-six-steps-to-manage-artificial-intelligence-agent-sprawl — *Apr 28, 2026*. Average Fortune 500 enterprise will operate **150,000+ AI agents by 2028, up from <15 in 2025** — explicit agent sprawl framing. Pair with 70%-of-sellers-overwhelmed for "consolidate or drown."

## Theme 11 — State of Sales / State of AI in Marketing

**25. HubSpot — 2026 State of Marketing Report** — https://www.hubspot.com/state-of-marketing — *early 2026*. **86.4% of marketing teams now use AI in some workflow** (up from 41% in 2024, 67% in 2025). **32.8% of marketers report 10–14 hours/week saved by AI.** 19.2% are running end-to-end agent automations. Base: 1,500+ global marketers.

## Theme 12 — Named-customer stories

**26. Microsoft — EY redefines CRM with Dynamics 365 Sales** — https://www.microsoft.com/en/customers/story/25718-ey-dynamics-365-sales — *Nov 18, 2025*. EY deployed **85,000 Dynamics 365 Sales licenses in 18 months**, targeting 100,000. **Honest caveat:** case study is largely qualitative. Use as scale story; pair with technical eval (#3) for actual numbers.

**27. 6sense Flexera + Socure stories** — https://6sense.com/customer-stories/ — *2025*. Flexera: **27% new marketing-influenced revenue, 600% conversion lift via Drift integration, 15% increase in anonymous web activity.** Socure: **$52M pipeline + 4× program growth via signal stacking.**

---

## Honest gaps

- **Aberdeen "79% forecast accuracy" figure** widely cited by Salesforce partners has no traceable primary root — **do not use on slides**.
- **No fresh 2026 Forrester Wave for the SFA-plus-AI bundle space** — Gartner MQ (#22) is the more current frame.
- **No public data on "% reps action vs dismiss AI nudges."** Use Gartner's "<40%" prediction (#10) as forward-looking proxy.
- **No HubSpot Breeze or Microsoft Sales Copilot named B2B forecast customer with disclosed numbers** — EY (#26) is qualitative, sales-agent eval (#3) is strongest 1st-party performance evidence.

---

## Chapter blueprint

### Chapter 1 — Forecast accuracy with AI (~7 min)
**Spine:** State of Sales 87% adoption. ML vs heuristic roll-up. Microsoft eval (10% more meetings, 1.7 hrs/week). HubSpot Breeze calibration framing. *Three failure patterns* — calibration drift (Wang concept drift), data staleness, point estimate vs distribution (Hyndman).
**Interactive:** Forecast-vs-roll-up comparator.
**Citations:** 1, 2, 3, 4, 5, 6, 7.

### Chapter 2 — Pipeline hygiene automation (~7 min)
**Spine:** Salesforce Pipeline Inspection (1–99 scores, days-in-stage + push count). ZoomInfo customer numbers (14pt close-rate lift, 11.5 hrs/week). The **rep revolt risk** — Gartner 70% overwhelmed + 89% burned out + <40% predict AI improves productivity. Design hygiene nudges reps act on.
**Interactive:** Nudge-design sorter — which nudge gets actioned vs dismissed.
**Citations:** 8, 9, 10, 11.

### Chapter 3 — Territory & account optimisation (~7 min)
**Spine:** Signal scoring (firmographic + intent + engagement). 6sense Rithum (3× adoption, 58% of opps, 37% higher AOV). ZoomInfo MajorKey + Simmers. Rebalance without disrupting in-flight deals.
**Interactive:** Account-score interpreter — interpret a 6sense-style score breakdown.
**Citations:** 12, 13.

### Chapter 4 — Sales analytics narratives (~7 min)
**Spine:** AI-generated QBR briefs grounded in CRM + activity. HBR workslop data (41% receive, ~2 hrs rework, $9M/year for large orgs). Air Canada precedent — *YOUR statement, own the error.* Salesforce Ben on grounding-vs-hallucination.
**Interactive:** Narrative-trust sorter — 4 AI-generated QBR sentences, classify grounded / plausible / fabricated.
**Citations:** 14, 15, 16.

### Chapter 5 — GTM data cleanup (~6 min)
**Spine:** Gartner $12.9M annual cost. **22.5–30% B2B contact data decay/year.** Why annual projects fail. Salesforce Data Cloud identity resolution as foundation. Continuous loop pattern.
**Interactive:** Decay-rate calculator (set decay %, see annual contact loss).
**Citations:** 17, 18.

### Chapter 6 — Compensation modeling with AI (~7 min)
**Spine:** CaptivateIQ Catalyst, Xactly Incent AI Agents. **3× growth from frequent plan revision.** Scenario-test before rollout. The **gaming risk** — Larkin HBS empirical: reps shift deal timing + pricing in response to accelerators. Stress-test for unintended behaviour.
**Interactive:** Comp plan stress-tester — pick metric + accelerator, see gaming risk.
**Citations:** 19, 20, 21.

### Chapter 7 — Tooling stack decisions (~7 min)
**Spine:** Gartner MQ 2025 (Salesforce, Microsoft, Oracle leaders). Pricing: M365 Copilot $30 + Copilot for Sales $50 standalone, Salesforce Einstein, HubSpot Breeze. **Multi-tool AI sprawl** — Gartner: 150K+ agents by 2028, <15 in 2025. State of Marketing 86.4% adoption. Consolidate or drown.
**Interactive:** Stack-decision matrix — 5 scenarios, pick the right tool.
**Citations:** 22, 23, 24, 25, 26, 27.

### Chapter 8 — Making it stick: 2-quarter rollout (~6 min)
**Spine:** Pick 3 use cases, sequence Q1+Q2. Data quality bar BEFORE shipping. Don't ship forecast AI on top of dirty data. Continuous-loop hygiene first, then layer the agents.
**Interactive:** RevOps rollout builder — picks → markdown.

---

## Negative list

- **No vendor-shilling.** Cite specific vendors for evidence/feature reference, not for recommendation.
- **No Aberdeen 79% forecast number.** Citation chain has no traceable root.
- **No "AI will replace reps" framing.** Audience are RevOps — frame as enablement + risk management.
- **No "capstone" language.** Chapter 8 is "Making it stick" per project-academy-rebuild-plan.
- **No US-only framing.** Audience includes EU/GCC/India RevOps teams.
