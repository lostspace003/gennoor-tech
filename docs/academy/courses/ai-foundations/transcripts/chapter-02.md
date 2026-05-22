# Chapter 2 — How LLMs actually work

**Course:** AI Foundations · **Chapter:** 02 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Plain-English intuitions. No math. No jargon without definition.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *How large language models actually work.* Plain English. No math. *Why this matters — once you understand what an LLM is doing under the hood, you understand both why it's so useful and why it sometimes confidently says things that aren't true.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · tokens]

The starting point. *Tokens.* When you type a sentence into ChatGPT or Claude, it doesn't see words exactly. It sees *pieces of words called tokens.* The word "running" might be one token. The phrase "thoroughly examined" might be three. *Doesn't matter for you in practice. Just know — the model sees tokens, not letters or words.*

> [S3 ▸ slide change · t ≈ 0:45]

> [S3 ▸ reveal 1 · training]

Training. *The model was shown trillions of tokens from the internet, books, articles, code.* It learned statistical patterns about which token is likely to follow which. *Not facts. Patterns.* If you've read a hundred million news articles, you can predict that "the president announced" is often followed by certain kinds of words. The model is that — at extraordinary scale.

The training cost real money. *GPT-4 cost an estimated hundred million dollars to train.* It happened once. *After training, you're not retraining. You're just using the trained model to predict next tokens.*

> [S4 ▸ slide change · t ≈ 1:45]

> [S4 ▸ reveal 1 · prediction]

Prediction. *When you ask the model a question, it generates the response one token at a time, predicting the most likely next token given everything that came before.* It's not retrieving a stored answer. *It's predicting plausible-sounding next text.*

That's the key insight. *Plausible-sounding. Not necessarily true.* This is the whole story behind why LLMs sometimes hallucinate. The model is doing what it was trained to do — generating plausible text. *Sometimes "plausible" matches "true." Sometimes it doesn't.*

> [S5 ▸ slide change · t ≈ 2:40]

> [S5 ▸ reveal 1 · hallucination explained]

The hallucination problem in concrete terms. *Stanford's "Hallucinating Law" study from January twenty twenty-four — top legal AI tools hallucinated seventeen to thirty-four percent of the time on benchmark queries.* Even when those tools were retrieval-grounded — meaning the system pulled real legal documents before answering.

Why this happens. *The model wants to give you an answer.* If it has partial information, it fills in the gaps with plausible-sounding completions. *That gap-filling is where fabrication occurs.* A case citation that sounds right but doesn't exist. A statistic that sounds reasonable but isn't real.

> [S5 ▸ reveal 2 · grounding]

The fix. *Retrieval-grounded systems.* Microsoft Copilot for M three sixty-five, ChatGPT's enterprise tier, Claude's projects — *these connect the model to real documents or databases. The model retrieves first, then generates the answer based on what it retrieved.* The hallucination rate drops dramatically. *Not to zero. But to manageable.*

What you do with this knowledge. *Check anything important.* Especially specific facts, citations, names, dates, numbers. *Treat the model like a smart intern* — useful, fast, but checks need to happen before its work leaves your desk.

> [S6 ▸ slide change · t ≈ 4:00]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Where AI fits in everyday work.* The five categories that work in twenty twenty-six. The categories that work less reliably. *And the MIT, BCG, Harvard, Goldman Sachs productivity studies — fifteen to forty percent gains on knowledge work.*

> [end]
