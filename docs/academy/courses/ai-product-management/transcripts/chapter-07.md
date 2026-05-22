# Chapter 7 — Team + operating model

**Course:** AI Product Management · **Chapter:** 07 · ~4.5 min

## Persona
Andrew. Operating-model register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Team and operating model.* The AI PM team that ships and improves.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 5 roles]

Five core roles around an AI PM.

*Role one — AI PM.* Owns the product. Frames JTBD. Owns metrics. Final accountability for success.

*Role two — applied ML or AI engineer.* Builds the AI capability. Prompt engineering. Model fine-tuning when needed. Eval harness implementation.

*Role three — software engineer.* Builds the surrounding product. Surface, telemetry, integration, infrastructure.

*Role four — design.* User research. Interaction design. *AI products have unique interaction challenges — how the AI presents itself, how disagreement is handled, how transparency is conveyed.*

*Role five — quality and safety.* Adversarial testing. Red-team. Privacy review. *Often part-time but always present.*

Smaller orgs combine roles. *Larger orgs specialise.* The roles do not change.

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · operating cadence]

The operating cadence.

*Weekly — eval review and telemetry review.* What changed. What regressed. What needs attention this week.

*Monthly — production sample review.* The team reads real production cases together. *Surfaces blind spots that aggregate metrics miss.*

*Quarterly — adversarial test refresh.* New attack patterns. Updated guardrails. Documented results.

*Quarterly — economics review.* Cost per use. Margin trends. Pricing implications.

This cadence is what separates AI products that improve over time from those that drift.

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · the customer feedback loop]

The customer feedback loop. *Critical and often weak.*

Customer-reported AI issues should flow back to the team quickly. *Within days. Not quarters.*

What works. *Internal channel where support escalates AI issues. PM reviews weekly. Patterns turn into evals.*

What does not. *AI issues lost in general support tickets.* Patterns not detected. Same issues recur for months.

The AI PM responsibility. *Owns the issue-to-eval pipeline.* Customer complaint becomes an eval case which becomes a guardrail update. *This is how AI products mature.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score team and cadence honestly. *Two questions.*

*Question one — does the team review production AI samples together at least monthly?* Yes green. Sometimes amber. *No or quarterly red.*

*Question two — for a customer-reported AI issue this week, what's the typical path to closed-loop fix?* Days green. Weeks amber. *Months or unknown red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Schedule a thirty-minute production-sample review with your team this week.* Pick ten random AI outputs from the last week. *Read together. Discuss what worked, what didn't.* That review is the highest-leverage hour of the week.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Last chapter. *Your AI PM roadmap.* Four trust trip-wires. Interactive builder.

> [end]
