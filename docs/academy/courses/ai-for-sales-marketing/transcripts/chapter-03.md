# Chapter 3 — Lead scoring with AI

**Course:** AI for Sales & Marketing · **Chapter:** 03 · **Target duration:** ~4.5 min spoken

## Trainer persona
Andrew. Data-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Lead scoring with AI.* Two layers. *The six-check data quality gate. The GDPR Article Twenty-Two boundary you do not cross.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 2 layers]

The two-layer scoring model.

*Layer one — machine-learning predictive.* Trained on your closed-won and closed-lost history. *Inputs — firmographic, engagement, behavioural data from CRM.* Output — a probability-of-close score per lead.

*Layer two — LLM signal extraction.* Reads unstructured signals — *email replies, meeting notes, sales-call transcripts.* Extracts qualitative signals the ML can't see — *competitive pressure, budget timing, decision-maker shifts.*

Two layers together produce a richer score than either alone. *Predictive layer gives the baseline. Signal layer gives the texture.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 6-check data gate]

The six-check CRM data quality gate. *Before you score, you check.*

*Check one — closed-won and closed-lost data accuracy.* If reps mark deals lost-no-decision for everything that didn't close, your training data is garbage. *Audit before training.*

*Check two — sufficient volume.* Less than two hundred closed deals — your model overfits. *Don't train.*

*Check three — engagement data completeness.* Most CRMs have sparse engagement data. *Without it, the model can't separate hot from cold leads.*

*Check four — firmographic data freshness.* Stale company data degrades the model. *Refresh quarterly minimum.*

*Check five — bias audit on the training set.* Geographic bias, segment bias, industry bias. *If your closed-won data is sixty percent from one geography, your model will down-rank others. Bloomberg and Wilson-Caliskan cross-domain — AI inherits the biases in the training data.*

*Check six — leakage prevention.* If your training data includes post-close attributes, your model looks great in test and fails in production. *Same as healthcare and finance — train on the data you'd have at decision time.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · GDPR Art 22 boundary]

The GDPR Article Twenty-Two boundary. *The hard line.*

Article Twenty-Two — *individuals have the right not to be subject to a decision based solely on automated processing that produces legal or similarly significant effects.*

For lead scoring — *if your score determines whether a person gets contacted, gets a quote, gets pricing, you may trigger Article Twenty-Two.* The answer is human-in-the-loop. *Rep reviews scored output, makes the final decision on contact and engagement.*

What this means practically. *AI scores. Human acts.* Don't let the AI automatically suppress leads, automatically deprioritise individuals, automatically gate access to product or pricing. *Those decisions need a human.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · 3-band action split]

The three-band score-to-action split.

*Band one — high score, high engagement.* SDR contacts within four hours. *Aggressive cadence.*

*Band two — high score, low engagement.* Marketing nurture sequence. *Reactivation campaigns. Quarterly SDR check-in.*

*Band three — low score, high engagement.* The buried pipeline. *Most teams miss this band entirely.* Someone visited your pricing page three times this month — score might say not-ICP, behaviour says interested. *SDR investigates manually. This band converts at three to five times the rate teams expect.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your lead scoring output.* If you're using AI scores. *Look for band three — low score, high engagement.* If your team isn't acting on that band — *that's the highest-ROI conversation you can have this week.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Proposal and outreach generation.* Four-block template. *Three guardrails. The Mata plus Air Canada lessons applied to your collateral.*

> [end]
