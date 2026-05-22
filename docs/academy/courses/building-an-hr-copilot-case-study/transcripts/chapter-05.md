# Chapter 5 — Evaluation and iteration

**Course:** HR Copilot Case Study · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Builder-storyteller register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Evaluation and iteration.* Eval set from real tickets. The weekly iteration cycle that caught two policy hallucinations pre-launch.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · eval set construction]

Eval set construction from real HR tickets.

*Source.* 6 months of HR ticket queries. Anonymised.

*Sampling.* 150 queries. Mix: leave + benefits + onboarding + policy Q&A + edge cases. 4 languages.

*Labelling.* Each query → expected answer · expected source · expected escalation behaviour. *Done by senior HR ops manager + the build team together.*

*Maintenance.* 10-15 new queries added each week from pilot logs. Quarterly retirement of obsolete cases.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · weekly iteration cycle]

The weekly iteration cycle.

*Monday.* Run full eval suite. Compare to last week's baseline. Flag regressions.

*Tuesday.* Triage. Build team + HR ops manager review regressions. Decide which are real issues vs eval-noise.

*Wednesday-Thursday.* Fixes. Prompts updated · indexes refreshed · topics adjusted · grounding improved.

*Friday.* Re-run eval. Confirm fixes work. Stage for Monday release.

This cadence caught two policy hallucinations in week 6 and week 9. *Both would have been customer-facing if shipped.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 2 hallucination examples]

The two pre-launch hallucinations caught.

*Hallucination one — leave policy.* User: "Can I carry forward 60 days of leave?" Copilot: "Yes, up to 60 days." *Actual policy: 30 days max carry-forward.*

Root cause. *Outdated policy doc in SharePoint. The team's policy refresh hadn't propagated to the search index.*

Fix. *Daily re-indexing of changed SharePoint docs. Caught immediately.*

*Hallucination two — expense limits.* User: "What's the max meal allowance for international travel?" Copilot answered with regional allowance for domestic travel — wrong policy.

Root cause. *Two policy docs with similar titles. Retrieval picked the wrong one.*

Fix. *Better chunk-level metadata. Region tags on policy chunks.*

Both fixes shipped before pilot. *Both would have been embarrassing if discovered post-launch.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score eval + iteration discipline. *Two questions.*

*Question one — eval set built from real queries (not synthetic)?* Yes mostly real green · mix amber · *synthetic-only red — won\'t catch real failure modes*.

*Question two — weekly iteration cycle running through pilot?* Yes consistently green · ad-hoc amber · *no red — issues compound silently*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull 50 real HR ticket queries from the last 3 months.* That\'s the start of your eval set. *Bigger evals come from production sampling.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Pilot rollout sequencing.*

> [end]
