# Chapter 7 — Tooling stack decisions

**Course:** RevOps Automation with AI · **Chapter:** 07 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. Vendor-neutral, pricing-honest.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Tooling stack decisions.* Salesforce Einstein. HubSpot Breeze. Microsoft Sales Copilot. Build. *Four options. Pick once for the next twenty-four months.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · mq]

The market landscape first. *Gartner Magic Quadrant for Sales Force Automation Platforms, 2025.* Leaders — Salesforce for the nineteenth consecutive year, Microsoft for the fifteenth, Oracle for the ninth. *Gartner notes the matrix barely moved year-over-year as the market waits for agentic AI to shake out.* That's a useful signal — the vendors are stable, the differentiation is now feature-level.

> [S3 ▸ slide change · t ≈ 0:55]

> [S3 ▸ reveal 1 · pricing]

The pricing anchor. *Microsoft 365 Copilot Enterprise — thirty dollars per user per month annual.* Copilot for Sales bundled at no extra cost for M365 Copilot Enterprise customers. *Fifty dollars per user per month standalone.* That's the cheapest path *if you already have M365 Copilot Enterprise.*

Salesforce Einstein pricing varies — published list runs from twenty-five dollars per user per month for Einstein Sales Cloud to over a hundred dollars for full Agentforce. HubSpot Breeze is bundled into the Sales Hub Enterprise tier. *Build — anywhere from zero infrastructure cost to two hundred thousand dollars of engineering depending on how serious you are.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · the question]

The decision framework. *Three questions in order.*

*One* — what's your current CRM? If you're on Salesforce, Einstein wins by default. If you're on Dynamics or all-in on M365, Copilot for Sales wins. *Don't fight the gravity of your existing stack.*

*Two* — what's your data quality? If contact-data decay is high and identity resolution is weak — *fix that before any vendor selection*. The data layer matters more than the AI layer.

*Three* — what's the agentic roadmap? Salesforce Agentforce, Microsoft Sales Agent, HubSpot Breeze Agents. *Each vendor is racing to ship agent-class workflows in 2026.* If you're picking for the next twenty-four months, the agentic feature surface is where the differentiation will be.

> [S5 ▸ slide change · t ≈ 3:10]

> [S5 ▸ reveal 1 · sprawl]

The sprawl warning. *Gartner forecasts the average Fortune 500 enterprise will operate one hundred and fifty thousand AI agents by 2028, up from fewer than fifteen in 2025.* Translated to RevOps — *if you stack Salesforce Einstein plus a separate signal-scoring tool plus a separate conversation intelligence tool plus a separate compensation tool plus a separate enrichment tool* — each with its own AI layer — *you've built the sprawl problem your reps are revolting against in chapter two.*

The consolidation play. *Pick the platform AI that covers seventy percent of your use cases. Add one specialist tool for the remaining thirty.* Don't run five overlapping AI vendors.

> [S6 ▸ slide change · t ≈ 4:10]

> [S6 ▸ reveal 1 · monday move]

The Monday move. *List your current RevOps AI vendors.* If the count is over four, you have sprawl. *Pick the platform that covers the most. Cut at least one of the overlapping specialists by end of next quarter.*

> [S6 ▸ reveal 2 · close]

Last chapter — *the two-quarter rollout playbook.* Three use cases, sequenced, with the data quality bar locked in.

> [end]
