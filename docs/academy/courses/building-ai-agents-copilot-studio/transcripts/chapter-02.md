# Chapter 2 — Topic design vs generative answers

**Course:** Building AI Agents with Copilot Studio · **Chapter:** 02 · ~4.5 min

## Persona
Andrew. Architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Topics versus generative answers.* The four-question framework. The topic-explosion anti-pattern.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4-question framework]

Four-question framework per intent.

*Question one — is the answer deterministic?* "How do I file expenses" has one canonical answer. Topic. "What's the latest sales analysis" varies. Generative.

*Question two — are there compliance requirements?* Legal, HR, regulatory questions need controlled phrasing. *Topic with reviewed text.*

*Question three — is the answer in a small, known set?* Five product categories. Topic with five branches. *Hundreds of policy documents. Generative on knowledge source.*

*Question four — does answer change frequently?* If yes — generative. *Topic maintenance becomes the bottleneck.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · topic-explosion anti-pattern]

The topic-explosion anti-pattern. Most teams hit it by their twentieth topic.

*Pattern one — recognition degradation.* As you add topics, the language model has more trigger phrases to disambiguate. *Recognition accuracy drops.*

*Pattern two — maintenance fatigue.* Every topic is a hand-built artifact. Twenty topics means twenty maintenance burdens.

*Pattern three — trigger overlap.* "Reset password" topic versus "I can't log in" topic. *Overlap means non-deterministic routing.*

When you hit twenty topics. *Stop. Audit. Convert deterministic ones to generative + knowledge source where possible.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · the hybrid pattern]

The hybrid pattern mature agents converge to.

*Topics for*: compliance-controlled answers, transactional flows, escalation paths, common deterministic FAQs.

*Generative answers for*: variable questions, knowledge-source-grounded answers, exploratory queries.

*Routing*: a small set of high-confidence topics. Fallback to generative answers grounded in knowledge sources for everything else.

This is where production agents end up. *Not pure-topic, not pure-generative.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score topic vs generative design honestly. *Two questions.*

*Question one — how many topics in your busiest agent?* <15 green · 15-25 amber · *>25 red — topic explosion in progress.*

*Question two — generative answer source coverage?* Curated, reviewed sources green · mixed amber · *unvetted web red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Audit one agent.* Topic count? Recognition rate? Generative source coverage? *That audit is your refactor priority.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Plugins and connectors at production scale.* Four-component auth model. Three production failure modes.

> [end]
