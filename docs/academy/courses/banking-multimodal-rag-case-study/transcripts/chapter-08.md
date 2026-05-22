# Chapter 8 — Capstone: Lessons learned

**Course:** Banking Multimodal RAG · **Chapter:** 08 · ~5 min

## Persona
Andrew. Engineer + product register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter eight. *Capstone.* What the bank learned. 4 trust trip-wires. The builder.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the principle]

The principle. *This bank shipped multimodal RAG in 8 months from text-only RAG.* The differences with text-only RAG are concrete · measurable · and bigger than most teams expect.

> [S3 ▸ slide change · t ≈ 0:45]

> [S3 ▸ reveal 1 · 5 lessons]

Five lessons from this bank's build.

*Lesson one — start with eval, not the stack.* The first three weeks were eval-set construction. *Without it, you can't know which stack changes are improvements.*

*Lesson two — multimodal is not a flag.* It's a pipeline change. Document cracking · indexing · re-ranking · prompting · all change.

*Lesson three — citation is non-negotiable.* In finance, an uncited number is worthless. Air Canada Moffatt cross-domain. The bank lost two weeks rebuilding when citation broke at scale.

*Lesson four — MRM early.* The team brought MRM in at week four. *Earlier than typical. Saved six weeks of rework at submission time.*

*Lesson five — vendor concentration plan.* Even on a happy Azure path, the team documented "what if Azure OpenAI changes." *Took two days. Saved a board-level argument later.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 4 trust trip-wires]

Four trust trip-wires. *Do not cross.*

*Trip-wire one — pure text-RAG for financial documents.* Charts and tables are most of the content. Pure text RAG misses them. Plan multimodal from day one for finance.

*Trip-wire two — answer without citation.* In finance, uncited = unusable. Air Canada Moffatt cross-domain.

*Trip-wire three — MRM as afterthought.* MRM at week four · not week 12. Earlier prevents rework.

*Trip-wire four — single-vendor lock-in without exit plan.* Even happy Azure paths need vendor risk plan. Otherwise board asks late.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · the builder]

The interactive build-plan builder.

Pick your document type focus. Pick your hybrid weighting tilt. Pick your MRM cadence. *Download the Markdown plan.* Take it to your engineering + MRM kickoff Monday.

> [S5 ▸ reveal 2 · the close]

The course in one breath. *Multimodal RAG for banking is its own discipline.* Eval first · Azure AI Search + Vision + GPT-4o · document cracking with table + chart semantics preserved · hybrid + re-ranking tuned for financial vocab · 3-layer eval that MRM accepts · 5 regulator questions answerable · 5 lessons + 4 trip-wires.

*Eight chapters. That\'s the case.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · the final close]

Open the builder. Pick your starting point. *Get engineering + MRM kickoff on the calendar before next Friday.*

See you in the next one.

> [end]
