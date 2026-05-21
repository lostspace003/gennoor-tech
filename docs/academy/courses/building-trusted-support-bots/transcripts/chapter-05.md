# Chapter 5 — Conversational design + disclosure

**Course:** Building Trusted Support Bots · **Chapter:** 05 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Compliance + design. Specific examples.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Conversational design and disclosure.* Two topics, one chapter, because they're inseparable. *The bot's voice is your brand. The bot's transparency is now law.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · EU AI Act Art 50]

*EU AI Act Article Fifty — effective August second twenty twenty-six.* The transparency obligation. Providers and deployers of AI systems intended to interact with natural persons must ensure those persons are informed they are interacting with an AI. *Unless that's obvious from the context to a reasonably informed person.*

In plain English. *If your bot looks human, sounds human, or could be mistaken for human — it must declare itself.* No more cute "Hi, I'm Sarah from support" with no asterisk. *Pew Research's twenty twenty-five consumer attitudes study* — seventy percent of consumers feel more comfortable with AI agents when explicitly told they're AI. *Nine percent prefer hidden AI.* The compliance requirement and the consumer preference are aligned.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · disclosure pattern]

*The three-sentence disclosure pattern.* This is the formula that works.

Sentence one — *"Hi, I'm Acme Assistant, an AI helper."* Direct. Named. Categorised.

Sentence two — *"I can help with order status, returns, and account questions."* Scope-bound. The user knows what the bot is for.

Sentence three — *"For anything else, I'll connect you to a person."* Escalation promise upfront. *You're not trapped here.*

That's it. Three sentences. Compliant with Article Fifty. Aligned with seventy percent of consumers. *Adopted by Klarna, Intercom Fin, Salesforce Service Agent in twenty twenty-six.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · DPD case]

*The DPD case — January twenty twenty-four.* UK delivery firm. A user got frustrated, pushed the bot to swear, to insult the company, to write a haiku about its own uselessness. *The bot complied with all of it.* "I'm a useless chatbot," it said. Pulled offline within twenty-four hours.

Why? *The bot was an unconstrained LLM with no persona guardrails.* No system prompt that said — "you don't insult Acme, you don't swear, you don't roleplay being a different system." *The same week the screenshots went viral, brand-perception scores measurably dropped.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · the 6 design rules]

The six rules of conversational design. Short — *answers under a hundred and twenty words by default.* Apologies as deflection — *no.* "I apologise for the inconvenience" is filler. Skip it. *Named bot* — give it an identity, scope-bound. *Single purpose* — order status bot stays in order status. *On-rails* — system prompt that says what the bot will not do. No haiku writing. No agreeing to binding offers. No persona switches. *No fake humanness* — if the user asks "are you a human" the bot says "I'm an AI." Once. Cleanly.

The DPD lesson translated. *The persona is a hard surface. Make it a hard surface.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Read your bot's last ten transcripts.* If the bot apologises more than once per conversation, edit the system prompt. *If the bot ever roleplayed as something other than the bot, your guardrails are broken.* If the bot doesn't start with the three-sentence disclosure — *fix it before August second.*

> [S6 ▸ slide change · t ≈ 4:10]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Voice support AI.* Talkdesk twenty-five percent of inbound. Cognigy two-fifty-plus Fortune Two Thousand. *Four dollars a call versus six-fifty.* Two architectures — assist and autonomous. When each one works.

> [end]
