# Chapter 5 — Risk and operational considerations

**Course:** AI Strategy for the CIO · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. CIO-portfolio register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Risk + operational considerations.* Four ops risks unique to AI. The resiliency posture.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 ops risks]

Four operational risks unique to AI workloads at production scale.

*Risk one — vendor model updates.* OpenAI, Anthropic, Azure update models without notice. *Your behaviour changes silently.* No traditional change-management process catches this.

*Risk two — cost variability.* A single user with a clever query consumes 100x normal tokens. *Day-1 cost is $X. Day-90 cost is $5X. No clear cause until you trace it.*

*Risk three — non-deterministic incidents.* "It worked yesterday" — and the output today is different. *Classical incident response patterns don't fit.*

*Risk four — supply chain.* Foundation model vendor breach. Sub-processor breach. Open-weight model with embedded CVE. *AI introduces new supply chain attack surface.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · BCDR for AI]

BCDR for AI services.

Classical BCDR. *Failover to secondary site. RTO measured in hours.*

AI BCDR is different.

*Vendor outage.* OpenAI is down for 3 hours. Your AI features fail. *Do you have failover to a secondary model? Anthropic or Mistral or local model?*

*Regional outage.* Hyperscaler region down. *Are your AI workloads cross-region?*

*Quality degradation.* Vendor updated model. Quality dropped. *Do you have automated rollback to previous model version?*

*Graceful degradation.* When AI is down, does the application fall back to non-AI flow? *Or does the user see "service unavailable"?*

Most AI services have weak BCDR. *Most CIOs haven't asked for it yet.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · 3 ops disciplines]

Three operational disciplines for AI workloads.

*Discipline one — cost monitoring with auto-throttle.* Daily spend thresholds. Per-user rate limits. Auto-throttle on spike.

*Discipline two — vendor health monitoring.* Track upstream vendor status. Automated failover on outage.

*Discipline three — graceful degradation.* Application falls back to non-AI flow when AI is unavailable. *Tested. Documented. Not "we hope it works."*

Without these. *Operational incidents become CEO-level escalations.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score AI operational discipline. *Two questions.*

*Question one — do your top AI services have BCDR plans including vendor outage scenarios?* Yes tested green · documented amber · *no red — outage will surprise you*.

*Question two — graceful degradation in place for customer-facing AI features?* Yes tested green · "we have fallback in code" amber · *no red — customer sees error*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick top customer-facing AI feature.* Walk through "what happens when OpenAI is down for 3 hours?" *If the answer is "we hope," that's the BCDR gap.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Reporting AI to CEO and board.*

> [end]
