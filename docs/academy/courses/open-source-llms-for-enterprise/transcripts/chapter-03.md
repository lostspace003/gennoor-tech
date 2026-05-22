# Chapter 3 — Self-hosting

**Course:** Open-Source LLMs for Enterprise · **Chapter:** 03 · ~4.5 min

## Persona
Andrew. Architect-evaluator register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Self-hosting.* Ollama. vLLM. TGI. Azure ML private endpoints. The right pick for your latency and throughput profile.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 serving stacks]

Four serving stacks worth knowing.

*Stack one — Ollama.* The desktop and dev experience. *Local inference. Great for prototyping and small-team internal tools.* Not for production concurrency.

*Stack two — vLLM.* High-throughput batched inference. *PagedAttention for efficient memory. Strong concurrent-user performance.* Most production deployments use vLLM or its commercial cousin.

*Stack three — TGI (Text Generation Inference).* Hugging Face's serving layer. *Similar profile to vLLM. Strong streaming, sharding support.*

*Stack four — Azure ML managed endpoints.* Azure hosts the model on your behalf. *Less ops to run. Higher per-hour cost. Useful if Azure is your stack.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · production vs demo]

Production-grade vs demo-grade.

*Demo-grade.* Ollama on a laptop. Single user. Sub-second latency. *Looks great in the slide deck.*

*Production-grade.* 100 concurrent users. P95 latency budget. P99 budget. *Memory pressure. Request queueing. Failover.*

The gap is wider than teams expect. *Most "we benchmarked it" stories are demo-grade benchmarks. Real production behaviour requires vLLM or TGI with proper sizing.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · vLLM sizing]

vLLM sizing — the practical guide.

*GPU memory.* Model weights + KV cache + activation memory. *7B FP16 = 14 GB weights + KV cache scales with concurrent sessions.*

*Quantization.* INT8 reduces memory at small quality cost. INT4 reduces further with measurable degradation. *Run your eval set on each quant level. Don't trust generic claims.*

*Concurrency.* Continuous batching is vLLM's superpower. *200+ concurrent sessions on a single A100/H100 for 7B models, properly tuned.*

*P99 latency.* Increases with batch size + queue depth. *Tune for your specific budget, not the headline TPS number.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score self-hosting. *Two questions.*

*Question one — has your serving stack been load-tested at realistic concurrency on production hardware?* Yes with the numbers green · "we tested on laptop" amber · *no red — production surprise waiting*.

*Question two — quantization level evaluated on your tasks?* Yes per-quant green · "generic claims" amber · *no/we use default red*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Load-test your current self-hosted stack at 50% of expected peak.* Watch P95, P99, OOMs. *That's your production-readiness signal.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Fine-tuning approaches.* LoRA, QLoRA, full fine-tune.

> [end]
