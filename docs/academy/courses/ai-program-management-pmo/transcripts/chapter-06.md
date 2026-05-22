# Chapter 6 — Ops handoff pattern

**Course:** AI Program Management & PMO · **Chapter:** 06 · ~4.5 min

## Persona
Emma. Operational handoff register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Ops handoff.* Who owns the model after it ships. *The handoff is where most AI initiatives lose value.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the handoff problem]

The handoff problem.

The AI team builds. *They have the context. They know the model. They built the pipeline.* Then they hand off to operations. *Or they don't — they keep operating it themselves indefinitely.*

Both paths fail. *Keep-operating means the AI team is bottlenecked on operating their own code instead of building the next thing.* Hand-off-badly means operations doesn't have context to fix problems.

The healthy pattern. *Deliberate handoff with documented runbooks. Operations gets context and authority. AI team is on call for genuine model issues, not pipeline plumbing.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · 4 handoff artifacts]

Four artifacts every AI initiative produces before handoff.

*Artifact one — operational runbook.* What does ops do when a pipeline breaks? When a model degrades? *Step by step.*

*Artifact two — model card.* What this model does. What it doesn't. Known failure modes. Edge cases. *Maintained as the model evolves.*

*Artifact three — monitoring dashboard.* What ops watches. What the alerts mean. What to do on alert.

*Artifact four — escalation tree.* When ops can't fix something, who do they call? *Named individuals, not "the AI team."*

Without these — operations can't operate. The AI team gets paged at three AM. *Or worse — nobody gets paged and the problem compounds.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · 3 handoff anti-patterns]

Three handoff anti-patterns.

*Anti-pattern one — handoff at go-live.* Ops sees the model for the first time when it's already in production. *No context. No relationship. Things break, no one knows what to do.*

*Anti-pattern two — handoff to nobody.* The AI team builds, "operations" is theoretical, no named owner. *The model runs without operational oversight.*

*Anti-pattern three — handoff that's actually thrown over the wall.* Documents emailed. No follow-up. No shadowing period. *Predictable: things go wrong, blame ensues.*

The pattern that works. *Shadow period of four to six weeks before handoff. Joint on-call. Then transition complete with clear owner.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score handoff honestly. *Two questions.*

*Question one — for production AI systems, are operational runbooks current and tested?* Yes green. Some amber. *No red.*

*Question two — when ops can't fix something, do they have a named escalation contact for each model?* Yes green. Partial amber. *No red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one production AI system. Ask ops for its runbook.* If they can't produce it in five minutes, that's a handoff debt you need to close.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Team structure and roles.* AI PMO design.

> [end]
