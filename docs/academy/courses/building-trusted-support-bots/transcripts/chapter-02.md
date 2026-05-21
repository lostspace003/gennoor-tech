# Chapter 2 — Containment vs deflection · the math

**Course:** Building Trusted Support Bots · **Chapter:** 02 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Numbers-driven chapter. Clean distinctions. No hand-waving.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *The math of containment.* If you're a CS leader, this is the chapter your CFO wants you to internalise. *Three terms get used interchangeably and they are not the same thing.* Containment. Deflection. Resolution.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · definitions]

*Containment* — the bot handled the conversation end-to-end. No human touched it.

*Deflection* — the customer didn't escalate to a human. Could mean handled, could mean gave up. *Containment and deflection look identical in the dashboard.* They are not the same.

*Resolution* — the customer's problem was actually solved. *This is the only number that matters to CSAT.*

The trap. *Vendors quote containment because it looks the best.* Forty, fifty, seventy percent. The number that predicts whether your customers love you or churn is resolution. *Always ask which one the vendor is measuring.*

> [S3 ▸ slide change · t ≈ 1:10]

> [S3 ▸ reveal 1 · the cost stack]

The cost stack — McKinsey's twenty twenty-five Customer Service Front Line report. *Human agent per resolution — nine to fourteen dollars.* AI-augmented agent — five to eight. *Fully autonomous AI — one-fifty to three dollars.* Order of magnitude difference between fully autonomous and human.

But — and this is the Klarna lesson again — *the autonomous one-fifty number assumes resolution.* If the bot contains the conversation but the customer comes back tomorrow because the issue wasn't solved, your true cost-per-resolve doubles. *Cheap containment is worse than expensive resolution.*

> [S4 ▸ slide change · t ≈ 2:10]

> [S4 ▸ reveal 1 · the math]

The formula every CS leader should be able to write on a whiteboard. *Cost per resolved ticket equals — volume times AI-handled-share times AI cost — plus volume times human-handled-share times human cost — all divided by total resolved tickets.*

Worked example. *Ten thousand tickets a month. Fifty percent containment. Two-fifty AI cost. Ten dollars human cost.* Total spend — twelve thousand five hundred dollars on AI, fifty thousand on humans, sixty-two thousand five hundred total. *Versus fully human — one hundred thousand.* Saving — thirty-seven percent. That's a real number. *But only if those AI-contained tickets stayed resolved.*

The Klarna twenty twenty-four to twenty twenty-five lesson reframed in money. *Containment went up, cost-per-handle went down, then complex-issue CSAT went down, then complex issues became repeat contacts, then total cost-per-resolve crept back up.* Re-hire the humans for value.

> [S5 ▸ slide change · t ≈ 3:20]

> [S5 ▸ reveal 1 · the frontier]

What "top decile" looks like at the frontier. *Containment seventy percent on routine intents — password reset, order status, basic billing.* Deliberately low containment on complex intents — *sub-twenty percent on anything regulated, anything emotional, anything financial above a threshold.*

Translated to the design principle. *Don't try to maximise containment.* Try to maximise *appropriate* containment. *High on routine, low on complex.* Your dashboard should show containment broken out by intent. *One overall number hides the bad behaviour.*

> [S5 ▸ reveal 2 · the close]

What you do this week. *Pull your bot's containment number by intent if your platform supports it.* If it doesn't — that's the first vendor question. *If your containment is high overall but flat by intent, you don't have a top-decile deployment. You have a bot that's avoiding work.*

> [S6 ▸ slide change · t ≈ 4:20]

> [S6 ▸ reveal 1 · next up]

Next chapter — *the knowledge grounding problem.* Why Air Canada lost in court. *Why NYC's chatbot told business owners to commit harassment. Why McKinsey found one in twelve unconstrained CS responses had a factual error.* And what to do about it.

> [end]
