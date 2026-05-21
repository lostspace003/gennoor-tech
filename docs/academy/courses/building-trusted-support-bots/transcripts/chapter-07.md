# Chapter 7 — Quality monitoring

**Course:** Building Trusted Support Bots · **Chapter:** 07 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. The measurement chapter. Concrete metrics. Concrete thresholds.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Quality monitoring.* Forrester's twenty twenty-five State of CS AI ranked this number three in failure reasons — *no quality monitoring of bot conversations.* You can't fix what you don't measure. *You also can't trust what you don't measure.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why measurement]

The Salesforce State of Service sixth edition — *seventy-eight percent of service orgs report AI has improved customer experience.* But that headline number hides a split. *Teams with active quality monitoring report eighty-nine percent improved CX. Teams without — sixty-two percent.* Twenty-seven point gap. *Same technology, different outcomes, one variable.*

> [S3 ▸ slide change · t ≈ 0:55]

> [S3 ▸ reveal 1 · the 5 metrics]

The five metrics that actually predict churn-from-bot. Memorise these.

*Metric one — misrouted escalation rate.* The customer escalated, but the human got the wrong queue or wrong context. *Top decile under five percent. Most teams sit at fifteen plus.*

*Metric two — CSAT on AI-touched tickets.* Specifically AI-touched. *If your overall CSAT is masking a bot-CSAT drop, that's the metric you're missing.*

*Metric three — repeat contact rate.* Did the customer come back tomorrow? *If the bot contained but the issue wasn't resolved, your savings are illusory.*

*Metric four — bot-to-human transitions per session.* If the average session has more than one-point-two transitions, *you have a loop problem.* Gallup's number-one complaint, measurable.

*Metric five — abandonment rate.* Customer dropped without resolution or escalation. *Hidden cost. Lost revenue. Anger.*

> [S4 ▸ slide change · t ≈ 2:20]

> [S4 ▸ reveal 1 · thresholds]

Healthy thresholds — these come from Forrester benchmarking and Salesforce Service Cloud customer panels. *Misrouted escalation under five percent. CSAT on AI-touched within two points of overall. Repeat contact rate under eight percent. Transitions under one point two per session. Abandonment under three percent.*

If any of those is breached, that's where you investigate. *Not all five at once.* Quality monitoring is a triage activity. *Find the metric that's red, fix that workflow, move to the next one.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · shadow QA]

*The shadow QA pattern.* Top-decile teams sample bot conversations the way they sample human-agent calls. Random pull, two percent of conversations per week, scored against a rubric. *The rubric mirrors the human agent rubric — accuracy, empathy, brand alignment, escalation appropriateness.*

The discipline matters. *Without shadow QA, the bot drifts.* Knowledge base updates that break old answers. Prompt changes that change tone. Vendor model updates that change behaviour. *The shadow QA is your canary.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick the one metric you can pull today. Probably CSAT on AI-touched tickets if your platform supports tagging.* Look at it weekly. *If the trend bends down two weeks running, that's the signal to audit.* Don't wait for the customer to leave.

> [S6 ▸ slide change · t ≈ 4:10]

> [S6 ▸ reveal 1 · next up]

Last chapter. *The two-quarter rollout playbook.* Pick two use cases. Sequence them. *The trust trip-wires not to cross.*

> [end]
