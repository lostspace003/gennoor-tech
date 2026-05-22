# Chapter 3 — Eval harnesses

**Course:** AI Product Management · **Chapter:** 03 · ~4.5 min

## Persona
Andrew. Evaluation register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Eval harnesses.* Without them you are flying blind.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · what an eval harness is]

What an eval harness is.

*A repeatable, programmatic test of AI behaviour against defined criteria.* Inputs. Expected outputs or success patterns. Automated comparison. Versioned and tracked over time.

Without an eval harness. *You cannot tell if a model change is good or bad.* You cannot tell if prompt changes help or hurt. You cannot tell if production is degrading.

With an eval harness. *Every change is measured before it ships. Drift is detected. Regressions are caught.* AI product development becomes engineerable.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 3 eval categories]

Three categories of evals every AI product needs.

*Category one — task-specific evals.* For this specific user job, does the AI produce acceptable output. *Hand-built or curated golden datasets. Reference outputs or success criteria.*

*Category two — quality and safety evals.* Tone, factuality, refusal of inappropriate requests, refusal of out-of-scope requests. *Cross-cutting across features.*

*Category three — production telemetry evals.* Real user interactions sampled and evaluated. Catches things that golden datasets miss. *Critical for ongoing health monitoring.*

All three are needed. *No single category replaces the others.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · what to put in the eval set]

What to put in the eval set.

*Easy cases.* Things the AI should obviously get right. If it fails these, something is fundamentally broken.

*Hard cases.* Edge cases. Ambiguous inputs. Long contexts. *Where the differences between model versions show up.*

*Adversarial cases.* Prompt injection attempts. Jailbreak attempts. Requests to do harmful things. *The model should refuse these. Always.*

*Real production cases.* Sample from actual users. Anonymise. Add to the eval set. *Production reality > internal speculation.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · honest scoring]

How to score eval harness discipline honestly. *Two questions.*

*Question one — for your most prominent AI feature, does an automated eval suite run on every code change?* Yes green. Sometimes amber. *No red.*

*Question two — is the eval set updated with real production cases at least monthly?* Yes green. Quarterly amber. *Once at launch and never updated red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your eval suite for your top AI feature.* When was it last updated with production cases? *If more than three months ago, that's the discipline gap.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Telemetry and customer feedback.* The signal that catches what eval sets miss.

> [end]
