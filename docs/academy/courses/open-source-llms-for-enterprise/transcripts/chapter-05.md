# Chapter 5 — Cost and performance tradeoffs

**Course:** Open-Source LLMs for Enterprise · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Architect-evaluator register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Cost and performance tradeoffs.* Total cost of ownership. Per-token economics at real concurrency.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 5-component TCO]

The five-component total cost of ownership.

*Component one — GPU hours.* H100, A100, L40S. On-demand vs reserved vs spot. *The visible cost.*

*Component two — ops team.* ML platform engineers. SREs. Security review. *Often the largest cost — and the most under-counted.*

*Component three — evals.* Building gold sets. Running them on every change. Human-in-loop on disagreements. *Quality has a real cost.*

*Component four — incident load.* GPU OOMs. Quantization drift. Vendor-driver issues. *Plan for the on-call load you can't see in the demo.*

*Component five — upgrades.* New model versions. New serving stack versions. New quantization formats. *Six-month cadence at least.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · breakeven math]

The breakeven math.

A reserved A100 80GB. Roughly $1.50 per hour cloud. About $13,000 per year reserved.

That A100 can serve roughly *10 million tokens per day on Llama 3 8B with vLLM well-tuned.* Some workloads more, some less.

At hosted API prices around *50 cents to $2 per million tokens for similar capability,* that 10M tokens/day = $5-20 per day, or $1,800-7,300 per year.

Pure compute breakeven. *5 to 20 million tokens per day per workload.*

Add ops + eval + upgrade costs. *Real breakeven is more like 20-50 million tokens per day for the cost case alone.*

Below that, *hosted API + good prompts + retrieval is cheaper and faster to operate.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · concurrency reality]

Concurrency at enterprise scale.

The benchmark mistake. *"This model does 200 TPS on a single GPU."*

In production with mixed prompt sizes, mixed concurrent users, KV cache pressure, and request queueing. *200 TPS becomes 50-80 TPS in real-world conditions.*

Plan capacity at *real concurrency, not benchmark concurrency.* Test with production traffic shapes, not synthetic load tests.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score TCO modelling. *Two questions.*

*Question one — does your TCO include all 5 components, not just GPU hours?* Yes green · "GPU + maybe ops" amber · *GPU only red — under-counts dramatically*.

*Question two — has breakeven been calculated with realistic concurrency-degraded throughput?* Yes green · benchmark numbers amber · *no/optimistic red — overbuilds OR undercosts*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Model TCO for your top workload across all 5 components.* Compare to hosted API at your real volume. *That's the actual case for or against open-source.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Air-gapped and sovereign deployment patterns.*

> [end]
