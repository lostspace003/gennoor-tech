# Chapter 4 — Knowledge base AI + grounding

**Course:** AI for Customer Service & Support · **Chapter:** 04 · ~4.5 min

## Persona
Emma. Knowledge-grounding register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Knowledge base AI and grounding.* The Air Canada Moffatt discipline applied.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why grounding matters]

Why knowledge grounding matters in CS specifically.

Customer service AI represents your company to your customers. *What the AI says is what your company has said.*

Air Canada Moffatt — British Columbia Civil Resolution Tribunal, February twenty twenty-four — established this in writing. *The airline\'s chatbot misrepresented bereavement-fare policy. The tribunal held the airline liable for the chatbot\'s representation.*

NYC MyCity, the same year, gave illegal advice to small business owners. *Public failure. Service reduced.*

The pattern. *Customer-facing AI without strong grounding becomes the company\'s liability waiting to happen.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · what grounding is]

What grounding is, practically.

The AI does not draw answers from its training data. *It retrieves answers from your authoritative knowledge base — current product docs, current policies, current pricing.* Then it answers from that retrieved context.

When done well, hallucination on covered topics drops to near zero. *When done poorly — out-of-date KB, missing topics, weak retrieval — the AI invents plausible-sounding alternatives.*

The discipline. *Treat the KB as a product.* Owner. Update cadence. Quality bar. Coverage metrics. *Without KB discipline, no amount of AI quality saves you.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · 4 KB hygiene rules]

Four knowledge-base hygiene rules.

*Rule one — single source of truth per topic.* If pricing exists in five places, four are wrong somewhere.

*Rule two — retire stale content actively.* Outdated content is worse than missing content. *AI confidently quotes superseded policy.*

*Rule three — measure coverage and gaps.* What percentage of customer queries can be answered from KB content? Gaps are your AI hallucination risk.

*Rule four — establish escalation when AI is uncertain.* If retrieval finds nothing relevant, AI hands to human. Does not invent.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score KB and grounding AI honestly. *Two questions.*

*Question one — for a sample of last week\'s AI customer responses, what percentage cite an actual current KB article?* Above ninety percent green. Seventy-five to ninety amber. *Below seventy-five red — significant hallucination risk.*

*Question two — when retrieval finds nothing relevant, does the AI hand to human, or does it answer anyway?* Hand to human green. *Answer anyway red — the next Air Canada Moffatt scenario is loaded.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick ten random customer-facing AI responses from last week.* For each, verify the AI\'s answer against current KB. *How many were accurate, current, and properly sourced?* That ratio is your grounding discipline indicator.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Sentiment and the five escalation triggers.* Where AI surfaces what humans need to handle.

> [end]
