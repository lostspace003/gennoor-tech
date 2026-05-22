# Chapter 1 — Why open-source and when not

**Course:** Open-Source LLMs for Enterprise · **Chapter:** 01 · ~4.5 min

## Persona
Andrew. Architect-evaluator register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to Open-Source LLMs for Enterprise. *Andrew here.* Sovereignty. Cost curve. Roadmap risk. *3 cases where a hosted API still wins.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle.

*Open-source isn't free.* It's a different cost curve.

Hosted API. *High per-token cost. Zero ops cost. Scales with usage.*

Self-hosted open-source. *Low per-token cost. High ops cost. Scales with concurrency.*

The question isn't "which is cheaper." *The question is which cost curve fits your usage pattern, your team capacity, your regulatory posture.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 reasons for open-source]

Three reasons enterprises move to open-source.

*Reason one — sovereignty + residency.* Data can't leave a controlled boundary. *BFSI, healthcare, government, defense. The hosted API is not an option, regardless of cost.*

*Reason two — cost at scale.* At ten million tokens per day, per-token cost dominates total spend. *Self-hosted GPU economics eventually beat hosted APIs.*

*Reason three — roadmap control.* Vendor sunsets your model. Vendor changes pricing. Vendor changes terms. *With open-source, you control upgrade timing.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 cases hosted API wins]

Three cases where a hosted API still wins.

*Case one — small volume.* Under one million tokens per day. *GPU fixed cost doesn't amortise. Pay per token, get on with it.*

*Case two — capability gap.* GPT-4o-class reasoning, multimodal, vision. *Best open-source models are competitive but lag on cutting-edge capabilities by 6-12 months.*

*Case three — small ops team.* Self-hosted LLMs need ML platform engineers, GPU ops, security review, drift monitoring. *If you don't have the team, hosted is the right answer.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · the honest framing]

The honest framing for leadership.

*Don't sell open-source on cost savings alone.* The cost case is real but takes 18-24 months to materialise. Leadership often expects month-one savings. *Set expectations correctly.*

*Sell open-source on the three real reasons.* Sovereignty when required. Cost-at-scale when you actually have scale. Roadmap control when vendor risk is a board-level concern.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Map your current LLM workloads against the three reasons.* For each workload, is open-source the right call? *Most teams find it's right for one or two, not all.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Model selection.* Llama, Mistral, Phi, Qwen — the families, the licenses, the picks.

> [end]
