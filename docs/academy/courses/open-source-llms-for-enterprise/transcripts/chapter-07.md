# Chapter 7 — Operational considerations

**Course:** Open-Source LLMs for Enterprise · **Chapter:** 07 · ~4.5 min

## Persona
Andrew. Architect-evaluator register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Operational considerations.* Upgrades. Patches. Quantization rollouts. Observability across GPU, model, request layers.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 upgrade types]

Three upgrade types you plan for.

*Upgrade type one — model version.* Llama 3.1 to 3.2 to 4. Mistral 7B to Mixtral 8x7B. *6-12 month cadence. Eval suite + canary rollout required.*

*Upgrade type two — serving stack version.* vLLM major version bumps. CUDA upgrades. Driver patches. *Quarterly cadence. Performance characteristics change.*

*Upgrade type three — quantization format.* INT8 to INT4. New quantization techniques (GPTQ, AWQ, FP8). *Yearly-ish. Quality validation required.*

Each upgrade is a small project. *Plan capacity for them in your team's roadmap.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 observability layers]

Three observability layers — none optional.

*Layer one — GPU.* Utilization, memory pressure, temperature, ECC errors, throttling. *Use NVIDIA DCGM or your cloud's GPU monitoring.*

*Layer two — model.* Tokens generated, prompt + completion length distribution, KV cache hit rate, queue depth. *vLLM exposes these via Prometheus.*

*Layer three — request.* Latency p50/p95/p99, error rate, request size distribution. *Your application APM (Datadog, OTel, App Insights).*

Without all three, *you can't tell which layer is failing during an incident.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · security patches]

Security patches — what changes with self-hosted.

With hosted API. *Vendor patches the model. You patch your application. Clean separation.*

With self-hosted. *You patch everything.* Base OS. CUDA drivers. Container runtime. Serving stack. Model weights (when CVEs are found in fine-tunes or RLHF data).

*Cadence.* Monthly patch reviews. Critical CVEs same-week. *Air-gapped environments add 2-4 weeks for verified deployment.*

The discipline. *Patch management as a named team responsibility, not "we'll get to it."* The first ransomware on a self-hosted LLM serving infrastructure will be a teachable moment for the industry.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score open-source LLM ops. *Two questions.*

*Question one — does your team have a named upgrade owner with cadence on calendar?* Yes green · "we plan to" amber · *no red — you'll fall behind in 6 months*.

*Question two — observability across all 3 layers (GPU, model, request)?* Yes green · 2 of 3 amber · *only request layer red — GPU + model issues are invisible to you*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick your top open-source LLM workload.* Inventory upgrade cadence, observability coverage, patch process. *Gaps are the ops debt to clear before scaling.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · last chapter]

Last chapter. *Capstone — your open-source LLM decision pack.*

> [end]
