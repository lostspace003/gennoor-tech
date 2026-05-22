# Chapter 2 — Model selection

**Course:** Open-Source LLMs for Enterprise · **Chapter:** 02 · ~4.5 min

## Persona
Andrew. Architect-evaluator register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Model selection.* Llama, Mistral, Phi, Qwen. The four families. The license traps. The match-to-task discipline.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 model families]

Four model families that matter at enterprise scale.

*Family one — Llama from Meta.* Llama 3.x, 4 series. *Strongest open-weight on most benchmarks. Permissive but custom license — read it before deploying commercially.*

*Family two — Mistral.* Mistral, Mixtral mixture-of-experts variants. *Strong multilingual. Apache 2.0 on most releases. European AI Act compliance built in.*

*Family three — Phi from Microsoft.* Phi-3, Phi-4. *Small but punchy. Strong on reasoning at sub-7B parameters. MIT license. Built for on-device + edge.*

*Family four — Qwen from Alibaba.* Qwen2.x, Qwen3. *Excellent multilingual including Asian languages. Apache 2.0. Increasingly competitive at the frontier.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · license traps]

Three license traps that catch teams.

*Trap one — Llama "community license" restrictions.* Above 700 million monthly active users, you need a special Meta license. *Most enterprises are fine. Verify before you ship.*

*Trap two — model use for synthetic training data.* Some licenses prohibit using outputs to train competing models. *Read the clauses on derivative training.*

*Trap three — commercial fine-tune redistribution.* You fine-tune Llama, can you redistribute the resulting weights? *Depends on the specific license version. Get legal sign-off.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · model size discipline]

The "bigger is better" trap — and the antidote.

The default assumption. *Larger model = better outputs.*

The reality. *For most enterprise tasks, a well-prompted 7B-14B model is good enough.* Especially with retrieval. Especially with structured outputs.

The exception. *Complex reasoning, code generation, agentic workflows.* 70B-class and above still wins.

The match-to-task discipline.

*Classification, extraction, summarisation, format conversion.* 7-14B. Fast. Cheap to host.

*Q&A with retrieval grounding.* 14-30B. Quality lift over smaller models is measurable.

*Reasoning, code, agentic.* 70B+. Or a hosted API for these specifically.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score model selection. *Two questions.*

*Question one — your top model pick has been evaluated on your eval set?* Yes green · vendor benchmarks only amber · *vibes red*.

*Question two — has legal cleared the license for your specific commercial use?* Yes signed off green · informally amber · *no red — license risk before launch*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick top three model candidates by capability + license + size.* Run your eval set against each. *Decide on data, not vibes.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Self-hosting paths.* Ollama, vLLM, TGI, Azure ML.

> [end]
