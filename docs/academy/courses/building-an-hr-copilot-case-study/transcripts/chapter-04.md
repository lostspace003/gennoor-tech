# Chapter 4 — Building the conversation flow

**Course:** HR Copilot Case Study · **Chapter:** 04 · ~4.5 min

## Persona
Emma. Builder-storyteller register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Building the conversation flow.* Topics + generative answers. The topic-explosion anti-pattern that killed an earlier prototype.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the earlier prototype failure]

The earlier prototype failure.

The team's first attempt was topic-heavy. *50+ topics. One per common HR question.*

It worked in demo. *Problems hit at week three of build.*

*Recognition degradation.* Trigger phrases overlapped. "Leave" matched 8 topics. Disambiguation was unreliable.

*Maintenance fatigue.* HR team submitted policy changes. Each change needed topic updates. 50 topics meant 50 maintenance burdens.

*User frustration.* "Tell me about parental leave" took 4 turns because the topic flow asked rigid questions. Users dropped out.

The pivot. *Hybrid pattern — small set of topics for deterministic flows · generative answers grounded in policy docs for everything else.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · final structure]

The final structure that shipped.

*5 topics — deterministic flows.* Leave request · expense submission · address update · benefits enrollment · IT ticket escalation. *Each is a workflow, not a Q&A.*

*Generative answers — everything else.* Grounded in indexed policy docs + Dataverse profile.

*Fallback to human.* Defined criteria. *Sensitive questions (compensation · termination · medical) escalate immediately. Confidence-low responses route to HR concierge.*

Total components: 5 topics + 1 generative answer system + 1 escalation path. *Manageable. Maintainable. Shipped.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · multilingual handling]

Multilingual handling for the workforce.

5,000 employees across India · GCC · SEA. Languages.

*Primary — English.* Workforce-wide.

*Secondary — Hindi, Arabic, Tagalog.* Significant populations.

*Approach.* Single GPT-4o copilot. Language detection on user input. Same retrieval against language-tagged policy chunks. Response in same language as input.

*Caveat.* Quality varies by language. *English best. Hindi + Arabic good. Tagalog acceptable but watched closely.* Eval set covered all 4 languages.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score conversation flow design. *Two questions.*

*Question one — does your bot use the hybrid pattern (small topics + generative + clear escalation)?* Yes green · topic-only or generative-only amber · *>20 topics red — topic explosion likely*.

*Question two — for multilingual workforce, is quality tested per language?* Yes per-language eval green · primary-only amber · *no red — quality drifts in secondary languages*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Count your bot's topics today.* If >15, that's the refactor backlog. *Convert deterministic ones to generative + retrieval.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Evaluation and iteration.*

> [end]
