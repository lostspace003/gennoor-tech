# Chapter 1 — Why RAG and when not to use it

**Course:** RAG Architectures · **Chapter:** 01 · ~4.5 min

## Persona
Emma. Engineer-to-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to RAG Architectures. *Emma here.* When RAG is the right pattern, when it's the wrong one, and the 3 cases most teams confuse.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle.

*RAG looks simple in the diagram and brutal in production.* Embed, retrieve, generate. Three boxes on a slide.

In production: retrieval quality drives 80% of system quality. *And retrieval quality is exactly what most teams under-invest in.* The course exists because the gap between demo RAG and production RAG is wider than vendors admit.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · when RAG fits]

When RAG fits.

*Pattern one — large or changing knowledge base.* Company docs, product catalogs, support tickets. *Too large for context. Changes faster than fine-tuning cycles.*

*Pattern two — citations + grounding required.* Legal, medical, financial, compliance. *Answer must point to source. RAG provides traceability fine-tuning doesn't.*

*Pattern three — long-tail facts.* Specific products, customers, SKUs, regulations. *Fine-tuning forgets these. Retrieval surfaces them on demand.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · when RAG is wrong]

Three cases where RAG is the wrong architecture.

*Wrong case one — task is structural transformation.* Summarisation, translation, format conversion. *The input contains everything. No external knowledge needed. Pure model task.*

*Wrong case two — task is reasoning over the prompt.* Math, code generation from spec, planning a workflow. *Retrieval adds noise. Long-context or tool-use is the better fit.*

*Wrong case three — knowledge fits in context.* The entire knowledge base is under 100k tokens and rarely changes. *Just include it in the system prompt. Skip the retrieval layer.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · RAG vs long-context vs fine-tuning]

RAG versus long-context versus fine-tuning.

The three patterns each solve different problems. *Don't confuse them.*

*RAG.* External knowledge, citations needed, knowledge changes. *Cost: retrieval infrastructure + per-query embedding/search.*

*Long-context.* Knowledge fits in window, no need for selectivity. *Cost: input tokens scale linearly with context size — expensive at >100k tokens per query.*

*Fine-tuning.* Style, format, persona consistency, domain vocabulary internalisation. *Cost: training cycle + serving infra. Not for facts that change.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Look at your current AI feature.* Which of the three does it actually need? Many teams pick RAG by default. *The right answer is sometimes long-context or fine-tuning.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Embeddings explained.* Vector representations, what they encode, what they miss.

> [end]
