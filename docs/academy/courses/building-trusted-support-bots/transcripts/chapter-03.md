# Chapter 3 — Knowledge grounding

**Course:** Building Trusted Support Bots · **Chapter:** 03 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. The legal-risk chapter. Cite cases, name names.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Knowledge grounding — why ungrounded equals lawsuit.* If chapter one was the landscape and chapter two was the math, *this is the chapter that keeps CS leaders up at night.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the precedent]

*Moffatt versus Air Canada — Civil Resolution Tribunal of British Columbia — February fourteenth twenty twenty-four.* A grieving passenger asked Air Canada's chatbot about bereavement fares. The bot told him he could book first and apply for the refund within ninety days. *Air Canada's actual policy required pre-approval.* The airline argued the chatbot was a "separate legal entity." The tribunal disagreed. *Eight hundred twelve Canadian dollars plus interest awarded to Moffatt.* The line you should print and stick on the wall — *"Air Canada is responsible for all information on its website, including from a chatbot."*

This is precedent. Common-law jurisdictions cite this. *Anything your bot says is your statement.* Doesn't matter that an LLM generated it. *You said it.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · the NYC case]

*New York City — March twenty twenty-four.* The MyCity chatbot launched to help small business owners navigate regulations. *Investigated by The Markup and the Associated Press.* The bot told business owners they could fire workers for reporting sexual harassment. *They could take rent in cash without giving a receipt.* That they didn't need to accept Section Eight vouchers. *All of those are illegal or wrong.*

Why? *The bot was an unconstrained LLM with a city-branding layer on top.* No retrieval against the actual NYC small business policy database. No grounding. *Just an LLM trained on the internet, deployed in a transactional jurisdictional context.*

> [S4 ▸ slide change · t ≈ 2:20]

> [S4 ▸ reveal 1 · the data]

The McKinsey number. *Their twenty twenty-five Customer Service Front Line report tested CS AI responses across industries.* In unconstrained generative mode — *one in twelve responses contained a factual error.* That's eight percent. Eight percent of your customer interactions, factually wrong.

With retrieval grounding against a curated knowledge base — *one in two hundred or better.* Twentyfold improvement.

This isn't optional. *Grounding is the difference between a chatbot you can ship and a lawsuit waiting to happen.*

> [S5 ▸ slide change · t ≈ 3:20]

> [S5 ▸ reveal 1 · the grounding stack]

What grounding actually looks like. *Three components.* First — retrieval. The bot retrieves relevant articles from your knowledge base before composing the answer. *Not "the LLM knows."* The KB is the source of truth.

Second — citations. *Every claim the bot makes links back to a KB article ID.* If the bot says "your refund window is thirty days," there's a hyperlink to article KB-twelve thirty-four. *No citation, no claim.*

Third — confidence thresholds. *If the retrieval system isn't confident — sub-some threshold — the bot says "I'll get you to a human"* rather than hallucinating. We'll cover this trigger in chapter four.

> [S5 ▸ reveal 2 · the KB problem]

The catch — *and Zendesk's twenty twenty-five benchmark makes this explicit — companies with AI-grounded support reduce average handle time fourteen to twenty-two percent. But only if the KB is curated.* Stale KB equals worse outcomes than no AI. *Because the bot is now grounding confidently in wrong information.*

The Monday move. *Audit your top fifty most-viewed KB articles for accuracy and recency. Anything older than twelve months — re-validate or retire.* If you ground your AI in stale content, you've automated a different liability.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Escalation triggers. The five signals that mean the bot must hand off to a human.* Because the Chevy Tahoe for one dollar story is what happens when there's no trigger at all.

> [end]
