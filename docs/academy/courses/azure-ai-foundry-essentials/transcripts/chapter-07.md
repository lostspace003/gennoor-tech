# Chapter 7 — Production readiness checklist

**Course:** Azure AI Foundry Essentials · **Chapter:** 07 · ~4.5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Production readiness checklist.* 20 items across security, evals, observability, rollback. 3 disqualifiers nobody crosses.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 categories]

Four checklist categories, five items each.

*Category one — security and identity (5 items).* Managed identity configured. Secrets in Key Vault. Private endpoints for regulated workloads. Content safety enabled. RBAC reviewed.

*Category two — evaluation (5 items).* Gold eval set in Foundry. Eval runs on every deploy. Baseline metrics documented. Disagreement triage process. Adversarial cases in the suite.

*Category three — observability (5 items).* Foundry traces enabled. Cost telemetry per feature. Daily/forecast/spike alerts. On-call runbook. PII redaction in logs.

*Category four — rollback + DR (5 items).* Versioned artifacts. 60-second rollback tested. Regional failover documented. Vendor outage degraded mode. Quarterly DR drill.

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · 3 disqualifiers]

Three disqualifiers — items that block go-live regardless of everything else.

*Disqualifier one — no managed identity.* If your workload still uses API keys in environment variables, *you do not go to production*. Audit will fail. Incident response will fail.

*Disqualifier two — no eval flow.* Without measurement, every change is a guess. *No eval = no go-live.*

*Disqualifier three — no rollback path.* If you can't roll back to the previous artifact in under 60 seconds, *you are one bad deploy away from a multi-hour outage*. Test it before going live.

These three are not negotiable. *Other items can land amber. These three are red or green.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · the sign-off]

The production-readiness sign-off.

Not a Slack message. *A documented sign-off that platform team accepts.*

*Format.* One-pager. Checklist filled. Owners named. *Signed by feature owner + platform lead.*

*Stored.* Foundry project page. Linked from the deployment record.

*Audit.* Quarterly review of all production sign-offs. *Catches drift between what was approved and what's actually running.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score production-readiness discipline. *Two questions.*

*Question one — your most recent go-live had all 3 disqualifiers cleared?* Yes verified green · "we think so" amber · *no/skipped red — incident is on the way*.

*Question two — your platform team does a quarterly review of all production sign-offs?* Yes green · ad-hoc amber · *no red — drift is invisible*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your most recent production LLM workload.* Walk the 20-item checklist. *Items in red are your blocker list.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · last chapter]

Last chapter. *Capstone — promote a Foundry project to production. The builder.*

> [end]
