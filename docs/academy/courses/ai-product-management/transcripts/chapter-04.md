# Chapter 4 — Telemetry + customer feedback

**Course:** AI Product Management · **Chapter:** 04 · ~4.5 min

## Persona
Andrew. Telemetry + feedback register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Telemetry and customer feedback.* The signal that catches what eval sets miss.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 telemetry signals]

Four telemetry signals every AI product needs.

*Signal one — was the AI invoked.* Feature engagement at user and session level.

*Signal two — what did the AI produce.* Outputs captured for review and improvement. Subject to privacy controls.

*Signal three — did the user act on the AI output.* The most important signal. *Did they accept the suggestion. Did they edit it. Did they reject and start over.*

*Signal four — explicit user feedback.* Thumbs up or down. Free-text comments. Inline corrections. *Voluntary but extremely valuable.*

The pattern. *Without all four, you have an incomplete picture.* Some teams capture only invocation and never know if the AI is actually helping.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · the acceptance rate metric]

The acceptance rate metric. *The single most useful AI product metric.*

For AI features that suggest something the user can accept, edit, or reject. *Track what percentage are accepted as-is, edited, or rejected.*

Trends in acceptance rate are diagnostic. *Falling acceptance signals quality regression.* Rising signals improvement or user adaptation.

Different products have different healthy acceptance rates. *Aim for trend, not absolute.* A coding assistant with twenty percent accept-as-is is healthy if it climbs over time. An email writer with thirty percent accept-as-is and thirty percent accept-with-edit is healthy.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · the privacy frame]

The privacy frame on telemetry.

Capturing AI outputs means capturing user data. *Privacy law applies.* GDPR. CCPA. India DPDPA. Industry-specific.

What works. *Opt-in for output capture in sensitive contexts. Anonymisation before storage. Retention limits enforced. Access logged.*

What does not. *Capturing everything by default with no opt-out.* Compliance breach. Customer trust damaged. *Eventually a regulator letter.*

The PM responsibility. *Privacy review of telemetry plan before launch.* Not optional.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score telemetry honestly. *Two questions.*

*Question one — for your top AI feature, are all four signals captured and visible to the team?* Yes green. Most amber. *Some missing red.*

*Question two — is privacy review documented for your telemetry capture?* Yes green. Verbal approval amber. *No formal review red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last week's telemetry for your top AI feature.* Calculate acceptance rate. *If you cannot answer immediately, your telemetry investment is unfinished.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Guardrails and refusals.* What the AI must not say or do.

> [end]
