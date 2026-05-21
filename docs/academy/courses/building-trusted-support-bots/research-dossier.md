# Building Trusted Support Bots — Research Dossier

**Course slug:** `building-trusted-support-bots`
**Track:** Function · Customer Service & Support
**Audience:** CS leaders, Support Ops, CX Ops past basic AI literacy
**Length:** 8 chapters · ~40 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## The thesis

Customer-service AI is the function where AI is the most deployed, the most measured, and the most likely to blow up in public. Containment and deflection numbers are real and consequential. Bad bots cost CSAT, NPS, and — in regulated jurisdictions — money. The interesting question isn't "should we have a support bot" (the boat has sailed) but "what makes a support bot one customers don't curse at."

This course gives CS leaders the decision framework — containment math, knowledge grounding, escalation triggers, conversational design, voice channel, quality monitoring, two-quarter rollout — to ship support AI that improves both efficiency and CSAT, not one at the cost of the other.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Zendesk CX Trends 2026: 84% of CX leaders say AI agents are a strategic priority; 71% have already deployed at least one | Zendesk CX Trends Report 2026 | Jan 2026 |
| 2 | Average containment rate across enterprise CS bots: 38–52% depending on industry; top decile reaches 70%+ | Forrester State of Customer Service AI 2025 | Sep 2025 |
| 3 | Klarna AI assistant: handled 2.3M conversations in first month (2024), equivalent of 700 FT agents, with CSAT on par with humans | Klarna press release / OpenAI customer story | Feb 2024 (referenced) |
| 4 | Klarna reversal: re-hired humans in 2025 after CSAT dipped on complex issues — "AI for volume, humans for value" | Bloomberg / Financial Times | May 2024 → May 2025 follow-up |
| 5 | Air Canada chatbot ruling: BC Civil Resolution Tribunal ordered CA$812 refund + interest. "Air Canada is responsible for all information on its website, including from a chatbot." | Moffatt v. Air Canada, BC CRT, Feb 14, 2024 | Feb 2024 |
| 6 | Salesforce Agentforce: 36% of Fortune 100 deployed by mid-2025; Service Cloud customers report 40%+ deflection lift | Salesforce Earnings Q2 FY26 + Customer 360 case studies | Aug 2025 |
| 7 | Intercom Fin: 86% resolution rate on supported topics across 25,000+ businesses | Intercom Fin product page + 2025 Customer Service Report | 2025 |
| 8 | The hallucination cost: McKinsey found that 1 out of 12 CS AI responses contained a factual error in unconstrained mode; with retrieval grounding, it drops to 1 in 200+ | McKinsey "Customer service is the front line of generative AI value" | Mar 2025 |
| 9 | Talkdesk: voice AI handles ~25% of inbound calls in early-adopter contact centers with average handle time down 18% | Talkdesk 2025 CX Report | 2025 |
| 10 | Cognigy NEXT 2026: Voice agents (synthetic + LLM) deployed in 250+ Fortune 2000 enterprises, average $4/call vs $6.50 human | Cognigy NEXT 2026 keynote + Forrester analyst note | Feb 2026 |
| 11 | Gartner: by 2027, ~25% of customer service interactions will be handled by autonomous AI agents (up from ~5% in 2024) | Gartner Customer Service & Support Predictions 2025 | Oct 2025 |
| 12 | CSAT drop on misrouted escalations: top reason for CSAT decline in AI-augmented contact centers (Gallup CX panel 2025): "the bot kept me in a loop / didn't pass to a human" | Gallup CX Panel Report 2025 | Nov 2025 |
| 13 | EU AI Act Article 50 (transparency obligations for AI systems interacting with natural persons): from Aug 2 2026, providers must ensure users are informed they are interacting with AI | EU AI Act Final Text (2024/1689) Art. 50(1) | Aug 2026 effective |
| 14 | Salesforce State of Service 2025: 81% of service orgs use AI, 90% report time savings; 78% say AI has improved customer experience | Salesforce State of Service 6th Edition | Oct 2025 |
| 15 | DPD chatbot incident: UK delivery firm DPD chatbot called itself "useless" and wrote a haiku criticising the company, after a prompt-injection-style user interaction | The Guardian / BBC | Jan 2024 |
| 16 | NYC chatbot incident: NYC MyCity chatbot told business owners they could fire workers for reporting sexual harassment, take tenants' rent in cash without giving receipts | The Markup / Associated Press | Mar 2024 |
| 17 | Chevrolet of Watsonville: dealer chatbot agreed to sell a 2024 Chevy Tahoe for $1; viral on Twitter; pulled offline | The Verge | Dec 2023 |
| 18 | Knowledge base ROI: companies with AI-grounded support reduce average handle time by 14–22% — but only if the KB is curated. Stale KB = worse outcomes than no AI | Zendesk Benchmark 2025 + Salesforce Service Cloud report | 2025 |
| 19 | Forrester: top 3 reasons CS AI projects fail — (1) unclear escalation triggers, (2) ungrounded outputs, (3) no quality monitoring of bot conversations | Forrester State of CS AI 2025 | Sep 2025 |
| 20 | Disclosure pattern: Pew Research 2025 found 70% of consumers feel "more comfortable" with AI agents when explicitly told they're AI; only 9% prefer hidden AI | Pew Research Consumer AI Attitudes 2025 | Aug 2025 |
| 21 | Cost benchmark: McKinsey average per-resolution cost — human agent $9–14, AI-augmented agent $5–8, fully autonomous AI $1.50–3 | McKinsey Customer Service Front Line report | Mar 2025 |

## Named incidents (use sparingly, when relevant)

1. **Air Canada / Moffatt (Feb 2024)** — Tribunal precedent. Used in chapters 1, 3, 5.
2. **DPD / haiku (Jan 2024)** — Brand damage. Used in chapter 5 (conversational guardrails).
3. **NYC MyCity (Mar 2024)** — Compliance / harm. Used in chapter 3 (grounding).
4. **Chevy Tahoe $1 (Dec 2023)** — Why open-domain LLM agents in transactional contexts are dangerous. Used in chapter 4 (escalation triggers).
5. **Klarna up-then-down (2024 → 2025)** — The "AI for volume, humans for value" principle. Used in chapters 1, 2, 8.

## What we do NOT say

- **No "AI will replace agents" framing.** Klarna's reversal is the cautionary tale. Frame as augmentation + tiering.
- **No vendor promotion.** Zendesk, Salesforce, Intercom, Cognigy, Talkdesk all referenced even-handedly with evidence.
- **No prediction of containment rates above ~60%** for typical enterprises — top-decile only.
- **No "set and forget"** language. Quality monitoring is non-negotiable.
- **No US-centric compliance only.** EU AI Act Art. 50 disclosure obligation is the big legal anchor.

## Chapter blueprint

### Chapter 1 — The CS AI landscape (~6 min)
**What:** State of containment. 84% strategic priority. 71% deployed. Avg 38–52% containment. Top decile 70%+. Klarna up-then-down. Salesforce 36% F100 deployed. **The thesis: "AI for volume, humans for value" — augment then tier, never replace.**
**Interactive:** Containment-by-industry sortable table or stage-of-deployment pulse.
**Sources:** [1], [2], [3], [4], [6].

### Chapter 2 — Containment vs deflection · the math (~5 min)
**What:** Containment ≠ deflection ≠ resolution. Distinguish. Cost-per-resolve math ($1.50–3 autonomous, $5–8 augmented, $9–14 human). The ROI formula CS leaders need. Klarna efficiency vs CSAT tension. The frontier curve.
**Interactive:** Cost-per-resolve calculator (volume × split × $/resolve).
**Sources:** [3], [4], [21].

### Chapter 3 — Knowledge grounding (~5 min)
**What:** Why ungrounded LLM = lawsuit. Air Canada Moffatt precedent. NYC MyCity harm. McKinsey 1-in-12 vs 1-in-200+ with retrieval. KB curation: stale KB = worse than no AI. The grounding stack (RAG, citations, confidence thresholds).
**Interactive:** Grounded-vs-ungrounded response side-by-side classifier.
**Sources:** [5], [8], [16], [18].

### Chapter 4 — Escalation triggers (~5 min)
**What:** The handoff is where trust is won or lost. Gallup top reason for CSAT decline. Forrester top-3 failure reasons. The 5 triggers: low confidence, sensitive intent, repeated misunderstanding, regulated topic, user request. Chevy Tahoe $1 — open-domain in transactional contexts.
**Interactive:** Trigger-config decision tree builder.
**Sources:** [12], [17], [19].

### Chapter 5 — Conversational design + disclosure (~5 min)
**What:** EU AI Act Art. 50 from Aug 2 2026 — disclosure obligation. Pew 70% comfort with disclosure. DPD haiku — guardrails on persona. The conversation rules: short, no apologies as deflection, named bot, single-purpose, on-rails. The three-sentence disclosure pattern.
**Interactive:** Disclosure-line generator (jurisdiction × industry × tone).
**Sources:** [13], [15], [20].

### Chapter 6 — Voice support AI (~5 min)
**What:** Voice is where CS AI is moving in 2026. Talkdesk 25% inbound + 18% AHT down. Cognigy 250+ F2000 deployments. $4 vs $6.50 per call. Two architectures: agent-assist (whisper) vs autonomous voice agent. When each works. The latency + barge-in problem.
**Interactive:** Architecture-pick (assist vs autonomous) decision matrix.
**Sources:** [9], [10].

### Chapter 7 — Quality monitoring (~5 min)
**What:** Forrester #3 failure reason: no quality monitoring. Salesforce State of Service: 78% report improved CX — only with measurement. The 5 metrics that predict churn-from-bot: misrouted-escalation rate, CSAT-on-AI-touched-tickets, repeat-contact rate, average bot-to-human transitions per session, abandonment rate. Conversation sampling cadence. The "shadow QA" pattern.
**Interactive:** 5-metric dashboard configurator with healthy/warning/critical thresholds.
**Sources:** [12], [14], [19].

### Chapter 8 — Making it stick · 2-quarter rollout (~4 min)
**What:** The roadmap. Pick 2 use cases (not seven). Q1 = FAQ deflection (grounded, narrow) + escalation triggers tightened. Q2 = transactional intents with strong guardrails. Quality monitoring from day one. The trust trip-wires not to cross: no fake humanness, no agreeing to anything binding without policy check, no surveillance of user metadata for "engagement scoring." Klarna lesson: keep humans visible.
**Interactive:** 2-quarter roadmap builder with disclosure-line + escalation-trigger picker.
**Sources:** Composite of [4], [11], [13], [19].

## Tone

- **Trainer voice:** Emma, calm, evidence-led. Less hype, more "here's the number, here's the source, here's the move."
- **CS-leader register:** Speak to people with CSAT, NPS, handle-time, and a budget. Not engineers.
- **Stress the tension:** efficiency *and* CSAT, not efficiency *vs* CSAT. The Klarna lesson is the chorus.
- **Anchor every prescriptive claim** to a 2024–2026 study or named incident.

## Visual identity

Same RevOps neutral-slate + orange-accent system. Function-track palette. No emojis. Sora headings, Inter body.
