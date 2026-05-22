# Chapter 7 — Incident response for LLM failures

**Course:** MLOps for LLMs · **Chapter:** 07 · ~4.5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Incident response for LLM failures.* Four incident types. The triage. The clean post-mortem.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 incident types]

Four LLM incident types your on-call meets.

*Type one — quality regression.* New deploy made things worse. *Catch via eval suite + canary monitoring. Fix: rollback.*

*Type two — drift incident.* Vendor updated the model. Behavior changed silently. *Catch via behavioral-drift monitoring. Fix: pin model version or update prompts to new behavior.*

*Type three — abuse incident.* Prompt injection, jailbreak, account-takeover. *Catch via input-pattern monitoring and output content filters. Fix: input validation, rate limit, security review.*

*Type four — vendor outage.* OpenAI is down. Azure OpenAI returns 503s. *Catch via vendor health monitoring. Fix: failover to secondary model + degraded mode.*

Each has a different triage playbook. *Knowing which type you're in is the first step.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · triage in 5 questions]

Triage in five questions.

*Question one — is the bad behavior new?* Compare last 24 hours to baseline.

*Question two — is the model version the same?* Vendor model updates appear as silent drift.

*Question three — is the prompt the same?* Recent deploy changed it?

*Question four — is retrieval input the same?* New documents indexed? Source disconnected?

*Question five — is the input distribution the same?* New user cohort? Campaign launch?

If yes to any. *That's your starting point.* If no to all, escalate to root-cause investigation.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · the post-mortem]

The post-mortem that produces durable eval cases.

*Most post-mortems produce promises.* "We'll add monitoring." "We'll add validation." Six months later, the same incident reoccurs.

*Better post-mortem.* Every incident produces at least one new eval case.

The eval case becomes part of the regression set. *Next deploy that would reintroduce the bug fails CI.* The fix becomes permanent.

The discipline.

*Reproduce the failure as a deterministic test case.*

*Add the case to the regression set.*

*Verify the rollout that introduced the bug now fails CI.*

*Then close the incident. Not before.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score incident response. *Two questions.*

*Question one — last 5 LLM incidents — did each produce a new eval case?* All 5 green · 3-4 amber · *<3 red — incidents repeat*.

*Question two — does your on-call have a written LLMOps runbook for each incident type?* Yes green · for some amber · *no red — first incident at 3am is when you learn*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Sit with on-call for an hour.* Walk a recent incident. Was a new eval case added? *If not, that's the discipline gap.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · last chapter]

Last chapter. *Capstone — your LLMOps runbook + interactive builder.*

> [end]
