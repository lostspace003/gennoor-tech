# Open-Source LLMs for Enterprise — Research Dossier

**Course slug:** `open-source-llms-for-enterprise`
**Track:** Builder · Platform & Infrastructure
**Audience:** Senior engineers, ML platform leads, and tech directors evaluating or operating open-source LLMs at scale
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Open-source isn't free — it's a different cost curve. The reason an enterprise moves to open-source LLMs is rarely the model quality and almost always one of three structural drivers: data sovereignty + residency, unit economics at scale, or roadmap control over a hosted vendor's deprecation cycle. The hosted-API path still wins in three cases that engineers underestimate: small volume, capability-gap workloads, and small ops teams. This course teaches the discipline — model family selection, serving stack choice, fine-tuning restraint, honest TCO, sovereign deployment tiers, and the operational rigour — that separates a production OSS LLM platform from a demo.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Llama 3 / 3.1 / 3.3 release cadence — Meta's flagship open-weights family; 8B, 70B, 405B sizes; Llama Community License with 700M MAU commercial-use threshold | Meta AI · llama.meta.com | 2024-2025 |
| 2 | Mistral open models — Mistral 7B, Mixtral 8x7B / 8x22B (Apache 2.0); Mistral Large variants under commercial licence; Codestral under MNPL | Mistral AI · mistral.ai | 2023-2025 |
| 3 | Qwen family (Alibaba) — Qwen 2.5, Qwen 3 series; Apache 2.0 on most sizes; strong multilingual incl. Arabic + Mandarin; widely used in GCC + India deployments | Alibaba Cloud · Qwen GitHub | 2024-2025 |
| 4 | Microsoft Phi family — Phi-3, Phi-3.5, Phi-4; MIT licence; SLM (small language model) discipline optimised for on-device + edge | Microsoft Research · Phi technical reports | 2024-2025 |
| 5 | Hugging Face Hub — central distribution point for open-weights models; >1M model repos by 2025; the de facto registry layer for enterprise pull-through | Hugging Face platform data | 2025 |
| 6 | vLLM — UC Berkeley project; PagedAttention; the production-grade serving engine of record for high-throughput open-weights inference; 2-10x throughput vs naive HF Transformers | vLLM paper (Kwon et al.) + project docs | 2023-2025 |
| 7 | Ollama — local + small-team serving stack; demo-grade and team-grade rather than enterprise concurrency; useful for dev loops not production fleet | Ollama project docs | 2024-2025 |
| 8 | Text Generation Inference (TGI) — Hugging Face's production server; tensor parallelism, continuous batching; alternative to vLLM in HF-aligned shops | Hugging Face TGI docs | 2024-2025 |
| 9 | Azure ML managed online endpoints + Azure AI Foundry model catalog — Microsoft's enterprise-managed path to deploy OSS models on private compute | Microsoft Learn · Azure ML docs | 2024-2025 |
| 10 | LoRA (Low-Rank Adaptation) — Hu et al. 2021; trainable rank-decomposition matrices; the default parameter-efficient fine-tuning method by 2025 | Hu et al. · ICLR 2022 paper | 2021-2025 |
| 11 | QLoRA — Dettmers et al. 2023; 4-bit quantised base + LoRA adapters; brought 65B fine-tuning to single-GPU workstations | Dettmers et al. · NeurIPS 2023 | 2023 |
| 12 | "Try retrieval before fine-tuning" — industry consensus across Hugging Face, Anthropic, and OpenAI guidance: most enterprise use cases that *look* like fine-tuning are solved by RAG + good prompting | Vendor + practitioner pattern | 2024-2025 |
| 13 | vLLM concurrency reality — published benchmarks measure batch-1 or saturated throughput; real production concurrency at P99 SLO is typically 25-50% of headline. Industry pattern, not single citation. | Practitioner pattern (vLLM issues + ops reports) | 2024-2025 |
| 14 | TCO breakeven for self-hosted vs hosted API — practitioner rule-of-thumb sits around 20-50M tokens/day depending on model size, GPU class, and utilisation; below that, hosted APIs typically win | Industry pattern (cross-vendor) | 2024-2025 |
| 15 | EU AI Act (Reg. 2024/1689) — general-purpose AI model obligations apply from Aug 2025; high-risk system obligations from Aug 2026; open-source carve-outs exist but do not exempt deployers | Official Journal of the EU | 2024-2026 |
| 16 | India DPDP Act 2023 — data residency + consent framework; relevant to where OSS LLM inference + fine-tuning data lives | Ministry of Electronics & IT, GoI | 2023 |
| 17 | UAE PDPL (Federal Decree-Law 45 of 2021) + Saudi PDPL (2023) — GCC residency frameworks that drive sovereign deployment choices | UAE Data Office + SDAIA | 2021-2023 |
| 18 | NIST AI RMF + GenAI Profile (NIST AI 600-1, Jul 2024) — US baseline that CISOs reference; not a regulation but the de facto reference standard | NIST | 2023-2024 |
| 19 | GPU memory math — a 70B parameter model in FP16 ≈ 140 GB raw weights; with KV cache + activations, typically 2× H100 80GB or 1× H200 141GB minimum for serving | vLLM + NVIDIA sizing guides | 2024-2025 |
| 20 | Quantisation tiers — FP16 → INT8 (≈2× memory savings, minor quality loss) → INT4 / GPTQ / AWQ (≈4× savings, task-dependent quality loss); production discipline = measure, don't assume | bitsandbytes + AutoGPTQ + AWQ papers | 2023-2025 |
| 21 | Model card + licence audit discipline — Llama Community License, Gemma Terms of Use, and Qwen variants each carry distinct commercial-use, redistribution, and attribution clauses; legal sign-off non-optional | Meta + Google + Alibaba model cards | 2024-2025 |
| 22 | Observability layers for LLM serving — GPU (DCGM / nvidia-smi exporter), model (token throughput, TTFT, P99 latency), request (cost, prompt+completion tokens, error class). Three layers, not one. | Practitioner pattern (Prometheus + Grafana stacks) | 2024-2025 |
| 23 | Air-gapped deployment — full disconnection from public networks; required by some defence + critical-infrastructure regulators; significantly raises ops cost (mirror registry, internal CVE feed, manual model updates) | Industry pattern (defence + critical infra) | ongoing |
| 24 | CVE + patch cadence on serving stacks — vLLM, TGI, and PyTorch ship multiple security-relevant releases per quarter; enterprise discipline is a defined upgrade window, not "latest = best" | Project release notes | 2024-2025 |

## Named incidents

1. **The "bigger is better" trap.** Industry pattern: teams default to the largest model in a family (Llama 70B, Mixtral 8x22B) when a Phi-3.5 or Qwen 2.5 7B would serve the task at 10× lower cost. Use as the size-discipline anchor.
2. **The confabulated-licence pattern.** Pattern (not a single named case): a team ships a Llama-derived product, then discovers the Community License clause that restricts use above 700M MAU — or that a "research-only" model in the same family is not commercial-safe. Ground in the licence audit discipline, not a specific lawsuit.
3. **The demo-to-production cliff.** Industry pattern: an Ollama proof-of-concept that handles 5 concurrent users falls over at 50 because Ollama's serving architecture isn't built for fleet concurrency. The fix is vLLM or TGI, not bigger hardware.
4. **The fine-tune-first regret.** Pattern: a team spends two months fine-tuning when RAG + prompt discipline would have closed 80% of the gap in two weeks. Anchored in the cross-vendor "try retrieval first" consensus, not a single case study.

## What we do NOT say

- **No "open-source is free" framing.** Open-source shifts cost from per-token API spend to GPU capex/opex + headcount. It's a different curve, not a cheaper one by default.
- **No vendor monoculture.** Llama, Mistral, Phi, and Qwen are referenced even-handedly. No "Llama is always the answer."
- **No "always fine-tune" claim.** Retrieval-first is the discipline. Fine-tuning is the exception, not the default.
- **No invented benchmark numbers.** vLLM concurrency, TCO breakeven, and quantisation impact are framed as *patterns* and *ranges*, not single-source citations.
- **No regulatory over-reach.** EU AI Act, DPDP, PDPL, and NIST AI RMF are cited for what they actually say. No claim that open-source is automatically compliant or non-compliant.
- **No "set and forget."** Patch cadence and CVE discipline are non-negotiable; the course names them explicitly.

## Chapter blueprint

### Chapter 1 — Why open-source and when not (~5 min)
**What:** The three real drivers — sovereignty + residency, cost at scale, roadmap control. The three cases where hosted APIs still win — small volume, capability-gap workloads, small ops teams. Honest framing: open-source is a different cost curve, not a free one. Set the audience expectation: senior engineers and tech directors making a structural call.
**Sources:** [1], [2], [14], [15], [16], [17].

### Chapter 2 — Model selection (~5 min)
**What:** Four families compared — Llama (Meta), Mistral, Phi (Microsoft), Qwen (Alibaba). Three licence traps: Llama Community License MAU clause, "research-only" variants in commercial product, redistribution + attribution gaps. The size discipline: Phi-3.5 or Qwen 7B beats Llama 70B for many tasks at 10× lower cost. Match-to-task framing.
**Sources:** [1], [2], [3], [4], [5], [21].

### Chapter 3 — Self-hosting (~5 min)
**What:** Four serving stacks — Ollama (demo + team), vLLM (production throughput), TGI (HF-aligned production), Azure ML managed endpoints (managed sovereign). Demo-grade vs production-grade distinction. vLLM sizing: GPU memory math (70B FP16 ≈ 140 GB), quantisation tiers (FP16 → INT8 → INT4), concurrency reality at 25-50% of benchmark, P99 latency as the real SLO.
**Sources:** [6], [7], [8], [9], [13], [19], [20].

### Chapter 4 — Fine-tuning approaches (~5 min)
**What:** The "don't fine-tune" trap — try retrieval first. Three approaches when you do: LoRA (default), QLoRA (single-GPU 70B), full fine-tune (rarely justified). When each fits, when none fits. The cross-vendor consensus: most "fine-tuning" requests are really prompt + RAG problems.
**Sources:** [10], [11], [12].

### Chapter 5 — Cost and performance tradeoffs (~5 min)
**What:** Five-component TCO — GPU capex/opex, networking + storage, MLOps headcount, observability stack, security + compliance overhead. Honest breakeven math: 20-50M tokens/day depending on model + GPU + utilisation. Real-concurrency reality: 25-50% of headline benchmark at P99. The discipline: measure your own load, don't trust the marketing chart.
**Sources:** [13], [14], [19], [20].

### Chapter 6 — Air-gapped and sovereign deployment (~5 min)
**What:** Three deployment tiers — managed sovereign (Azure ML in-region), self-hosted in-tenant (your VPC), fully air-gapped (no egress). Four architectural requirements — mirror registry, internal CVE feed, internal model registry, manual patch cadence. Regional regulator acceptance: EU AI Act + GDPR (EU), DPDP (India), UAE PDPL + Saudi PDPL (GCC), NIST AI RMF (US).
**Sources:** [15], [16], [17], [18], [23].

### Chapter 7 — Operational considerations (~5 min)
**What:** Three upgrade types — model upgrades (Llama 3.1 → 3.3), serving-stack upgrades (vLLM minor versions), quantisation changes (FP16 → INT4 retest). Three observability layers — GPU (DCGM), model (TTFT + P99 + throughput), request (cost + token accounting + error class). Patch discipline: defined upgrade window, not "latest = best." CVE cadence on vLLM, TGI, and PyTorch.
**Sources:** [22], [24].

### Chapter 8 — Capstone · OSS LLM decision pack (~6 min)
**What:** Four-section decision pack — driver (why OSS for this workload), model + licence, serving + sizing, ops + compliance. Four trust trip-wires — no licence sign-off → stop, no P99 SLO measured → stop, no observability across all three layers → stop, no patch cadence agreed → stop. Interactive decision-pack builder for the learner's steering committee.
**Sources:** Composite of [1]-[24].

## Tone

- **Andrew, senior-engineer + tech-director register.** Precise. Numbers + accountability. No hype; no dismissal of hosted APIs either.
- **Honest about the cost curve.** Open-source shifts cost; it does not eliminate it. Name the tradeoff every time.
- **Discipline as the chorus.** Licence audit, P99 SLO, three observability layers, defined patch window — these recur deliberately.
- **Pattern, not myth.** When a specific benchmark or case is not cleanly citable, the course names it as an industry pattern and moves on.

## Theme

Neutral-slate base (#475569 / #334155 / #0F172A) with orange accent (#F97316 / #FB923C) on a near-white tint (#F8FAFC). No emojis. Sora headings, Inter body. The palette signals engineering rigour rather than vendor brand.
