# Chapter 5 — Lock-in mitigation

**Course:** AI Vendor Management · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Procurement-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Lock-in mitigation.* Four lock-in tests. The realistic mitigations.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 lock-in tests]

Four lock-in tests for every AI vendor relationship.

*Test one — model lock-in.* If the vendor model is removed or changed, what does it cost you to switch? *Open weights or interface-compatible alternative? Low lock-in. Proprietary undocumented behavior? High.*

*Test two — data lock-in.* Your data, prompts, embeddings, fine-tunes. *Can you export everything in a usable form? Or only via vendor APIs that they can change?*

*Test three — prompt lock-in.* Prompts developed against this vendor's model. *Do they transfer to other models with minor tweaks, or is the system prompt deeply vendor-specific?*

*Test four — integration lock-in.* Your applications, your data flows, your identity model all wired to this vendor. *Migration cost is integration cost, not just data movement.*

Score each on red/amber/green. *Map it before signing, not after.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · realistic mitigations]

Four realistic mitigations.

*Mitigation one — open weights option.* Where feasible, use open-weight models even if hosted. *Llama, Mistral, Phi, Qwen. Portable across providers.*

*Mitigation two — portability commitments.* Contract requires data export in industry-standard formats. *Prompt export. Embedding export.*

*Mitigation three — abstraction layers.* Application code talks to a thin abstraction. Provider behind. *Swap providers without rewriting application. Realistic for low-end LLM calls, harder for advanced features.*

*Mitigation four — model and weights escrow.* For mission-critical workloads with a single specialist vendor. *Weights or fine-tunes held in escrow. Released if vendor exits or breaches.*

Each has cost. *Lock-in mitigation is rarely free.* But the cost is paid in advance, not in crisis.

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · what doesn't work]

What doesn't work as lock-in mitigation.

*Doesn't work — "we'll re-evaluate at renewal."* By then, you've built around the vendor. Re-evaluation is theater.

*Doesn't work — "the contract has 30-day termination."* For AI, exit takes months. 30-day termination is fiction.

*Doesn't work — "we'll just use APIs from multiple vendors."* If your prompts, evals, and integration patterns are vendor-specific, multi-vendor doesn't reduce lock-in.

*Doesn't work — vendor's own "lock-in mitigation" features.* Vendor-controlled portability is not portability.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score lock-in mitigation. *Two questions.*

*Question one — for your top 3 AI vendors, is the lock-in tested across all 4 dimensions?* Yes green · partial amber · *no/never red — exit will be a hostage negotiation*.

*Question two — when you've signed in the last 12 months, did you negotiate at least one mitigation?* Yes green · sometimes amber · *no red — you accepted vendor lock-in by default*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick your top AI vendor by spend.* Walk the 4 lock-in tests. *Red flags become the next renewal-cycle negotiation list.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Vendor risk monitoring and audit.*

> [end]
