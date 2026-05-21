# Chapter 6 — Voice support AI

**Course:** Building Trusted Support Bots · **Chapter:** 06 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Voice is the new frontier — pragmatic, two architectures explained side by side.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Voice support AI.* The chat channel was the twenty twenty-three story. *Voice is the twenty twenty-six story.* Talkdesk's twenty twenty-five CX report — voice AI handles around twenty-five percent of inbound calls in early-adopter contact centres. *Average handle time down eighteen percent.* Cognigy NEXT twenty twenty-six keynote — voice agents deployed in two hundred fifty-plus Fortune Two Thousand enterprises. *Four dollars per call versus six dollars fifty for a human.*

> [S2 ▸ slide change · t ≈ 0:20]

> [S2 ▸ reveal 1 · two architectures]

*Two architectures.* This is the decision you need to make first, because they have different cost profiles, different risk profiles, and different deployment timelines.

*Agent-assist — also called whisper or copilot.* Human agent on the call. AI listens, transcribes, surfaces knowledge-base articles in real-time, suggests responses. *The agent decides what to say.* Lower risk. Higher per-call cost — still six dollars plus.

*Autonomous voice agent.* AI takes the call end to end. *No human on the line until escalation triggers fire.* Lower per-call cost — three to four dollars. Higher implementation complexity. Higher risk if grounding or escalation isn't tight.

> [S3 ▸ slide change · t ≈ 1:20]

> [S3 ▸ reveal 1 · when assist works]

*When agent-assist is the right call.* Complex issues. *Regulated industries* — healthcare, banking, insurance. *High-stakes intents* — collections, retention, disputes. *Anywhere CSAT depends on the human warmth.* Agent-assist gives you eighteen percent handle-time reduction without changing the customer experience. *That's the lowest-risk lift in the AI portfolio.*

The trap. Agent-assist still requires the human agent. *Cost savings are bounded by handle-time reduction, not headcount reduction.* If your CFO modelled this as a head-count play, you have an expectations problem.

> [S4 ▸ slide change · t ≈ 2:10]

> [S4 ▸ reveal 1 · when autonomous works]

*When autonomous voice works.* Narrow intents. *Order status, appointment scheduling, password resets, simple FAQ.* High volume. Predictable scripts. Low CSAT-impact per interaction. *Anything where containment is the goal and resolution is binary — yes the appointment was booked, no it wasn't.*

The trap. *Autonomous voice on complex intents is the Klarna mistake re-played in audio.* Voice amplifies the awkwardness of a bad bot. *The same wrong answer that's annoying in chat is humiliating when a confident synthetic voice says it.* Pick narrow intents. Tier hard.

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · latency + barge-in]

*Two technical realities.* Latency — the round-trip from user-speech to AI-response needs to land under nine hundred milliseconds for the conversation to feel natural. *Above one-point-two seconds it feels like a poor phone line.* Above two seconds users start interrupting themselves. Modern stacks — Deepgram, ElevenLabs, OpenAI Realtime — sit around six hundred milliseconds. *Get this number from your vendor in writing.*

Barge-in — *can the user interrupt the bot mid-sentence and have the bot listen.* Without barge-in, the conversation feels like a hostage situation. *With barge-in done badly, the bot stutters and apologises in a loop.* This is the second number to ask your vendor for. *Demo it before you sign.*

> [S5 ▸ reveal 2 · the close]

Monday move. *Decide which architecture for which intent.* Don't pick one for the whole business. *Agent-assist for retention. Autonomous for FAQ. Human for complaint resolution.* The matrix is the deliverable. Most teams pick one and try to force every intent into it. *That fails.*

> [S6 ▸ slide change · t ≈ 4:10]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Quality monitoring — the five metrics that predict whether your bot is helping or hurting CSAT.* And the shadow QA pattern that top-decile teams use.

> [end]
