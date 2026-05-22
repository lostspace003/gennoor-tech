# Chapter 4 — Cost optimization patterns

**Course:** MLOps for LLMs · **Chapter:** 04 · ~4.5 min

## Persona
Andrew. Platform-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Cost optimization.* Patterns that survive past the first quarter, not the ones that look great in week one.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the cost surprise]

The cost surprise.

Your LLM feature ships. Bill in month one — manageable. *Bill in month four — three times higher.*

Two reasons. *Adoption grew. Per-user usage grew. Both compound.*

Add a third. *Edge cases — long conversations, document-heavy queries, abuse — are 10-100x more expensive per request. Once those become common, average cost jumps.*

The discipline. *Cost is a product feature you design for, not a bill you discover.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 4 cost patterns]

Four cost optimization patterns.

*Pattern one — prompt compression.* System prompts grow over time. Token budget shrinks. *Periodically compress: rewrite tightly, remove redundancy, externalize examples to retrieval.*

*Pattern two — caching.* Same user query, same answer. Cache by prompt hash. *Especially useful for FAQ-style traffic.*

*Pattern three — model routing.* Cheap model for easy cases. Expensive for hard ones. *Route by query complexity, length, or confidence.*

*Pattern four — smaller model plus better retrieval.* GPT-4 reading 50 tokens of retrieval beats GPT-4 reading 5000 tokens of bloated prompt. *Quality + cost both improve.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · what doesn't work]

Three cost patterns that look smart but break things.

*Anti-pattern one — aggressive prompt truncation.* "Just cut the context to 500 tokens." *Quality collapses.*

*Anti-pattern two — single-model lock-in for "vendor discount."* You can't switch when prices change. *Negotiating leverage gone.*

*Anti-pattern three — caching responses across users.* "Same query, same answer." *Except answers depend on user context, permissions, retrieval. Privacy + correctness both at risk.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · cost telemetry]

Cost telemetry — what you actually need.

*Per-feature cost.* Not "total LLM spend." Per-feature. *So you know which feature pays back and which doesn't.*

*Per-user-cohort cost.* Free tier vs paid. Internal vs external. *So you know who's expensive.*

*Per-request cost distribution.* Median + p95 + p99. *p99 cost is what kills you when adoption grows.*

Without this, you optimize blindly.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last month's LLM bill broken down by feature.* If you can't, that's the first cost optimization — *the dashboard that lets you optimize the rest.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Versioning prompts and models together.*

> [end]
