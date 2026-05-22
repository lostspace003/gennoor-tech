# Chapter 4 — Fine-tuning approaches

**Course:** Open-Source LLMs for Enterprise · **Chapter:** 04 · ~4.5 min

## Persona
Andrew. Architect-evaluator register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Fine-tuning approaches.* LoRA. QLoRA. Full fine-tune. When each fits. When you shouldn't fine-tune at all.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · don't fine-tune trap]

The "don't fine-tune" decision.

Before you fine-tune anything, ask: *can retrieval or prompting solve this?*

Fine-tuning takes weeks. Costs GPUs. Requires labelled data. *Each model upgrade requires re-tuning.*

Retrieval + prompting takes days. *Updates are instant. Model upgrades work without rework.*

The rule. *Try retrieval and prompting first. Fine-tune only when those measurably can't do the job.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 3 approaches]

Three fine-tuning approaches.

*Approach one — LoRA (Low-Rank Adaptation).* Train small adapter layers, freeze base model. *Fast. Cheap. Stack multiple adapters. Default choice for most tasks.*

*Approach two — QLoRA.* LoRA on a quantized base model. *Even cheaper. Trains on smaller GPUs. Mild quality cost.*

*Approach three — full fine-tune.* Update all parameters. *Expensive. Slow. Reserved for substantial behaviour shifts or domain-specific vocabulary.*

For 95% of enterprise tasks, *LoRA or QLoRA is the right answer.* Full fine-tune is rare.

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · when each fits]

When each approach fits.

*LoRA — style + format + persona.* "Respond as our brand voice." "Output in this JSON schema." "Use industry-specific vocabulary." *Cheap. Effective.*

*QLoRA — same but tighter budget.* When LoRA's quality is enough and GPU budget is tight. *Especially for proof-of-concept.*

*Full fine-tune — domain expertise.* Legal reasoning, medical reasoning, complex code generation. *Where the base model lacks fundamental capability your task needs.*

*Skip fine-tuning entirely.* Q&A on documents. Factual retrieval. Format extraction. *RAG + prompting handles these better than fine-tuning.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score fine-tuning approach. *Two questions.*

*Question one — have you proven retrieval + prompting cannot solve this?* Yes documented green · "we assume" amber · *no red — you're fine-tuning before exhausting cheaper options*.

*Question two — your fine-tune has measurable lift on your eval set vs base + retrieval?* Yes >5% green · marginal amber · *no/within noise red — you spent the budget for nothing*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *List your active fine-tune projects.* For each, was retrieval-plus-prompting tried first? *If not, that's the first decision to revisit.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Cost and performance tradeoffs at enterprise concurrency.*

> [end]
