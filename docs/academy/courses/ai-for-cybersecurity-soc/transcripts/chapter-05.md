# Chapter 5 — Threat intelligence synthesis

**Course:** AI for Cybersecurity SOC · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Threat-intel register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Threat intelligence synthesis.* Making sense of feeds at scale.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the volume problem]

The threat intel volume problem.

Modern SOCs subscribe to multiple threat intel feeds. *Commercial, government, open source, sector ISACs.* Each feed produces hundreds to thousands of indicators daily.

Without AI assistance. *Threat intel becomes archival.* Indicators get stored in TIP platforms and rarely actioned. *The intel investment doesn't translate to detection.*

With AI assistance. *Correlation, prioritisation, contextualisation at scale.* Indicators get triaged against your environment. Relevant ones become detections.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 3 intel AI use cases]

Three threat intel AI use cases.

*Use case one — feed correlation.* Same indicator across multiple feeds raises confidence. AI maps duplicates and aggregates.

*Use case two — MITRE ATT and CK mapping.* AI maps indicators to attack techniques. Helps prioritise based on which techniques matter for your environment.

*Use case three — environmental relevance scoring.* AI scores each indicator against your assets, your industry, your geography. *High-relevance indicators surface for action.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · the verification requirement]

The verification requirement. *Critical and non-negotiable.*

AI-generated threat intel analysis can hallucinate. *Plausible-sounding attribution. Plausible-sounding technique. Plausible-sounding indicator significance.* Without verification, you act on imagined threats.

What works. *AI synthesises. Analyst verifies key facts.* The Mata v. Avianca cross-domain — *AI invents specific claims that sound credible. Don't act on un-verified specifics.*

The discipline. *Specific indicators, specific attributions, specific recommendations — all verified against source.* Aggregated patterns are acceptable. Specific claims require verification.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score threat intel AI honestly. *Two questions.*

*Question one — percentage of high-relevance indicators that became detections in the last quarter.* Above thirty percent green. Ten to thirty amber. *Below ten red — your intel investment isn't reaching detection.*

*Question two — for AI-generated attribution claims, are they verified before acting?* Yes green. Sometimes amber. *No or rarely red — you will act on hallucinated attribution sooner or later.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last quarter's threat intel reports your team generated.* Pick five attribution claims. *Are they verified against source? Or did they come from AI synthesis without verification?* That ratio is your discipline indicator.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Security automation and SOAR.* Where automation works, and where it makes incidents worse.

> [end]
