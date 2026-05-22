# Chapter 4 — Performance SLAs

**Course:** AI Vendor Management · **Chapter:** 04 · ~4.5 min

## Persona
Andrew. Procurement-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Performance SLAs.* Beyond uptime. Four dimensions. The remedies.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · uptime-only trap]

The uptime-only trap.

Standard SaaS SLA. *99.9% uptime. Service credits if missed.*

For AI services, uptime is necessary but never sufficient. *The vendor is up. Responses are 12 seconds late. Quality dropped 20%. Uptime SLA says you have no remedy.*

That's the trap. *Uptime measures the wrong thing for AI.* Latency, accuracy, and drift matter equally.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 4 SLA dimensions]

Four SLA dimensions for AI services.

*Dimension one — availability.* Standard uptime. 99.5% to 99.95% typical for AI services. Lower than infrastructure. *Don't expect 99.99% — AI services rarely deliver.*

*Dimension two — latency.* P50, P95, P99 per request type. *AI services have wider latency distributions than CRUD APIs. Negotiate P95, not just average.*

*Dimension three — accuracy.* Sample-based measurement against a baseline. *Vendor performs eval suite quarterly. Results shared. Decline below threshold triggers remediation.*

*Dimension four — drift detection.* Vendor reports model version changes. Behavior changes that affect customer-facing output are notified. *Without this, vendor changes models silently and you debug as if it's your problem.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · remedies that work]

Remedies that actually work.

Service credits alone don't work. *3% credit on a monthly invoice isn't worth the customer harm.*

Three remedies that matter.

*Remedy one — material change termination right.* If accuracy drops below threshold for N consecutive periods, customer can terminate without penalty. *Aligns vendor incentives.*

*Remedy two — root cause + remediation plan.* Within 5 business days, vendor delivers root cause + remediation. Acceptance criteria pre-defined.

*Remedy three — co-managed remediation milestones.* If remediation extends beyond 30 days, customer joint review with weekly checkpoints.

Without remedies that have real teeth, *the SLA is theatre.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score SLA discipline. *Two questions.*

*Question one — do your Tier 1 AI SLAs cover all 4 dimensions, not just availability?* Yes green · 2-3 amber · *uptime-only red — wrong things measured*.

*Question two — do remedies include termination right, not just service credits?* Yes green · service credits + something amber · *credits-only red — vendor has no real incentive*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your top Tier 1 AI SLA.* Walk the 4 dimensions. *Missing ones are the renewal-negotiation list.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Lock-in mitigation.*

> [end]
