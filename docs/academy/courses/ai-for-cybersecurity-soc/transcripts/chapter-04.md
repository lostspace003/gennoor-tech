# Chapter 4 — Incident investigation assistance

**Course:** AI for Cybersecurity SOC · **Chapter:** 04 · ~4.5 min

## Persona
Emma. Investigation register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Incident investigation assistance.* AI as analyst force multiplier during active response.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 investigation use cases]

Three investigation AI use cases.

*Use case one — natural language to query.* Analyst types a question in English. AI generates the SIEM, log, or graph query. *Removes the syntax barrier for junior analysts.*

*Use case two — automated initial enrichment.* When an alert fires, AI gathers context — recent activity, asset details, user history, threat intel — before the analyst opens the ticket. *Shaves minutes per investigation.*

*Use case three — hypothesis generation.* Given the observed signals, AI proposes attack hypotheses mapped to MITRE ATT and CK. *Analyst evaluates each.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · the human-in-the-loop principle]

The human-in-the-loop principle. *Absolute during active investigation.*

The temptation. *Let AI conclude. Approve the conclusion. Move on.* Saves time. Loses learning. *And inherits AI's errors.*

What works. *AI generates draft conclusions. Analyst validates against source data. Conclusion goes into the incident report with named analyst accountability.*

This is more than process discipline. *It is incident response credibility.* When the post-incident review asks why a decision was made, "the AI said so" is not an answer. *Named human accountability is.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 investigation failure modes]

Three investigation AI failure modes.

*Failure mode one — AI hallucinated correlations.* AI sees patterns that aren't there. Analyst follows the wrong lead. Real attack progresses.

*Failure mode two — over-reliance for junior analysts.* Junior analyst uses AI as their primary tool. Doesn't develop independent skill. *When AI is wrong, they don't catch it.*

*Failure mode three — over-summarisation hiding nuance.* AI's three-line summary misses the detail that mattered. *Critical context lost.*

The mitigation. *Train juniors on the underlying tools. AI is augmentation, not substitute for fundamentals.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score investigation AI honestly. *Two questions.*

*Question one — time from alert to first analyst action with AI assistance versus without.* Forty percent or more reduction green. *Less than twenty percent red — not paying back.*

*Question two — junior analyst independent skill development.* Are juniors becoming senior analysts who could work without AI? Yes green. *Honestly no — they only function with AI red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Sit with one junior analyst for thirty minutes.* Watch them investigate one alert. *Are they thinking independently and using AI as a tool — or being driven by the AI?* That observation is the truth.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Threat intelligence synthesis.* Making sense of feeds at scale.

> [end]
