# AI for Customer Service & Support — Research Dossier

**Course slug:** `ai-for-customer-service-support`
**Track:** Function · Customer Service / CX
**Audience:** CX leaders, support directors, contact centre operations heads, and heads of digital who own customer-facing AI
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

Customer service is the function where AI is most visible to customers — and most visibly disappointing when it goes wrong. The 2024-26 wave isn't "replace agents with bots." It's the disciplined assist-first stack: AI for volume, humans for value. Agent assist as the baseline (20-40% productivity on routine queries), scoped deflection bots only for narrow high-volume queries, and strict grounding on the knowledge base so the Air Canada Moffatt failure mode does not repeat. The risk isn't the models. The risk is removing the human at exactly the moment the customer needs one — and pretending the bot is a person while doing it. This course teaches CX leaders to ship customer-facing AI that improves both productivity *and* trust.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Air Canada chatbot bereavement-fare ruling — BC Civil Resolution Tribunal held airline liable for chatbot misinformation; ~CA$812 awarded; "the chatbot is a separate legal entity" defence rejected | Moffatt v. Air Canada · BC CRT | Feb 2024 |
| 2 | NYC MyCity chatbot incident — pattern of city-services bot giving incorrect legal/regulatory guidance to small businesses; reported by The Markup / AP | Public reporting (industry pattern) | Mar-Oct 2024 |
| 3 | EU AI Act Article 50 — disclosure obligation: users must be informed when interacting with an AI system; transparency obligation applies regardless of risk tier | Regulation (EU) 2024/1689 Art 50 | in force Aug 2026 |
| 4 | EU AI Act Annex III — emotion-recognition systems in workplace/education are high-risk; sentiment analysis applied to agent monitoring sits adjacent to this boundary | Regulation (EU) 2024/1689 Annex III | Aug 2026 |
| 5 | UK FCA Consumer Duty — outcomes-based standard requiring firms to act to deliver good outcomes for retail customers; applies to chatbot-mediated support journeys for regulated products | FCA PS22/9 + FG22/5 | in force Jul 2023 |
| 6 | US state voice-AI disclosure laws — California, Utah, Colorado, Texas have enacted or proposed AI disclosure requirements for voice interactions; rolling 2024-26 | State legislation (industry pattern) | 2024-2026 |
| 7 | Agent-assist productivity range — industry pattern across vendor case studies: 20-40% reduction in handle time / wrap time on routine queries when assist is well-deployed | Vendor case-study pattern | 2023-2025 |
| 8 | Major agent-assist + CCaaS platforms with native generative-AI layers by 2025: Salesforce Einstein, Zendesk AI, ServiceNow Now Assist, Genesys Cloud AI, NICE CXone, Five9, Talkdesk, Amazon Connect Q | Vendor product pages | 2025 |
| 9 | Major standalone CS-AI vendors: Intercom Fin, Forethought, Ada, Ultimate.ai, Cresta, Observe.AI, Level AI | Vendor product pages | 2025 |
| 10 | Klarna AI-assistant productivity claims (Feb 2024) — widely cited "work of 700 agents"; subsequent 2024-25 reporting noted re-hiring of human agents — pattern of over-rotation then correction | Klarna press + later reporting | 2024-2025 |
| 11 | Voice-AI latency benchmark — sub-second turn-taking is the threshold below which conversational voice feels natural; above ~1.5s the experience degrades sharply | Industry UX pattern | 2024-2025 |
| 12 | Knowledge-base grounding — retrieval-augmented patterns where the bot must cite a KB article ID; uncited responses are blocked. Standard mitigation for the Moffatt failure mode | Industry pattern | 2024-2025 |
| 13 | Forecast / coverage discipline — measure % of customer intents covered by grounded KB content; uncovered intents must escalate, not improvise | Industry pattern | ongoing |
| 14 | LLM hallucination in customer-facing chat — confabulated-policy failure mode (bot invents a refund policy that does not exist). Cross-domain legal analog: Mata v. Avianca (S.D.N.Y. Jun 2023) | Cross-domain analog | 2023 |
| 15 | Quality assurance — traditional QA samples 1-3% of contacts; AI-driven QA enables 100% sampling at meaningfully lower marginal cost. Pattern across Observe.AI, Level AI, NICE | Vendor pattern | 2024-2025 |
| 16 | Standard CS metrics — FCR (first-contact resolution), AHT (average handle time), CES (customer effort score), CSAT, NPS, escalation rate, knowledge-use rate | ICMI / SQM industry standards | ongoing |
| 17 | Accessibility — WCAG 2.2 + EU Accessibility Act (EAA) effective Jun 2025 for digital services in scope; chatbots and self-service flows are in scope | EAA Directive (EU) 2019/882 | Jun 2025 |
| 18 | India DPDP Act (2023) + consent manager framework — affects voice recording, transcript storage, and cross-border transfer for Indian customer interactions | DPDP Act 2023 + rules 2025 | 2024-2025 |
| 19 | "AI gate-keeping access to humans" — pattern flagged by consumer advocates and regulators; the anti-pattern is forcing escalation friction that violates Consumer Duty in the UK | FCA Consumer Duty + industry pattern | 2023-2025 |
| 20 | Sentiment-aware escalation — 5 standard triggers used across QA platforms: declining sentiment, explicit human request, high-stakes topic, repeated failure of bot, vulnerable-customer signal | Industry pattern across QA vendors | 2024-2025 |
| 21 | Warm-handoff design — human agent receives the conversation transcript + summarised intent + sentiment context; the cold-transfer anti-pattern (customer repeats themselves) is the #1 escalation complaint | Industry UX pattern | ongoing |
| 22 | Multilingual support — vendor support for 30-100+ languages via LLM translation; high-stakes lines (legal, medical, account-closure, dispute) require human review regardless of language | Industry pattern | 2024-2025 |
| 23 | Weekly 2-2-2 coaching loop — pattern: 2 strengths + 2 growth areas + 2 customer quotes per agent per week, drawn from AI-sampled QA. Frontline retention pattern | Industry coaching pattern | 2024-2025 |

## Named incidents

1. **Moffatt v. Air Canada (BC CRT, Feb 2024)** — the canonical "your chatbot is *you*" precedent. Ground the grounding chapter here.
2. **NYC MyCity chatbot (2024)** — public-sector pattern of an LLM giving wrong regulatory guidance to small businesses. Public reporting; treat as pattern with cited source category.
3. **Klarna AI-assistant arc (Feb 2024 → 2024-25 correction)** — the over-rotation pattern: aggressive bot deployment, then quiet re-hire of humans. Ground the anti-play chapter here.
4. **The confabulated-policy failure** — bot invents a refund / warranty / cancellation policy. Industry pattern; cross-domain legal analog Mata v. Avianca (S.D.N.Y. Jun 2023).

## What we do NOT say

- **No "AI replaces agents" framing.** Assist-first is the baseline. Scoped autonomy only where the intent is narrow.
- **No specific accuracy / CSAT lift numbers above vendor pattern ranges.** "20-40% productivity on routine queries" stays as a range, not a single number.
- **No vendor selection bias.** Salesforce, Zendesk, ServiceNow, Genesys, NICE, Five9, Talkdesk, Amazon Connect, Intercom, Forethought, Ada, Cresta, Observe.AI all referenced even-handedly.
- **No invented case studies.** Where a specific named outcome cannot be verified, we use "industry pattern" or "vendor case-study pattern."
- **No "set and forget."** QA at 100% sampling + weekly coaching loop is the chorus.
- **No undisclosed bots.** EU AI Act Article 50 disclosure is non-negotiable; US state laws are catching up.

## Chapter blueprint

### Chapter 1 — The CS-AI landscape (~5 min)
**What:** AI for volume, humans for value. The 6 plays + 3 anti-plays preview. Air Canada Moffatt (the chatbot is you). NYC MyCity (public-sector pattern). Klarna arc (over-rotation then correction). EU AI Act Article 50 framing. Why CS is the most visible function for AI failure.
**Sources:** [1], [2], [3], [10].

### Chapter 2 — Agent assist vs full bots (~5 min)
**What:** The 4-mode spectrum: manual → augmented (assist) → hybrid (scoped bot + human) → autonomous (narrow). Where assist works (20-40% productivity range on routine queries). Where scoped bots work (narrow high-volume intents with clean KB coverage). Where full autonomy fails (the Klarna correction). Platform map: Salesforce Einstein, Zendesk AI, ServiceNow Now Assist, Genesys, NICE, Intercom Fin, Forethought, Ada.
**Sources:** [7], [8], [9], [10].

### Chapter 3 — Multilingual + accessible support (~5 min)
**What:** 3 use cases: real-time translation in chat, multilingual KB grounding, accessibility-assistive flows (alt-text generation, plain-language rewriting). The high-stakes line — legal / medical / account-closure / dispute requires human review regardless of language. WCAG 2.2 + EU Accessibility Act (Jun 2025) scope. Community review for accessibility.
**Sources:** [17], [22], [3].

### Chapter 4 — Knowledge base AI + grounding (~5 min)
**What:** Air Canada Moffatt as the anchor case. What grounding actually means (retrieval-augmented + KB-article-ID citation + block-if-uncited). 4 KB hygiene rules: single source of truth, retire stale articles, measure intent coverage, escalate uncertain. The confabulated-policy failure mode and the Mata v. Avianca cross-domain analog.
**Sources:** [1], [12], [13], [14].

### Chapter 5 — Sentiment + 5 escalation triggers (~5 min)
**What:** 5 triggers: declining sentiment, explicit human request, high-stakes topic, repeated bot failure, vulnerable-customer signal. Warm-handoff design — agent receives transcript + intent summary + sentiment context; cold-transfer is the #1 escalation complaint. EU AI Act Annex III boundary on emotion recognition in workplace contexts (agent-monitoring side, not customer side).
**Sources:** [20], [21], [4].

### Chapter 6 — Quality assurance at 100% sampling (~5 min)
**What:** Traditional QA samples 1-3% of contacts; AI QA enables 100% sampling. 5 metrics: FCR, AHT, CES, escalation rate, knowledge-use rate. Weekly 2-2-2 coaching loop (2 strengths + 2 growth areas + 2 customer quotes). Observe.AI, Level AI, NICE pattern. UK FCA Consumer Duty as the outcomes-based standard for regulated journeys.
**Sources:** [15], [16], [23], [5].

### Chapter 7 — Voice support AI (~5 min)
**What:** Why voice is harder — sub-second latency threshold, turn-taking, barge-in, accent robustness, emotional register. 2 patterns: voice assist (whisper coaching to human agent) and autonomous-narrow voice (single intent, clean fallback). Disclosure — EU AI Act Article 50 plus US state rolling disclosure laws (CA, UT, CO, TX pattern). DPDP Act considerations for Indian customer voice recording.
**Sources:** [3], [6], [11], [18].

### Chapter 8 — Making it stick · 12-week rollout (~6 min)
**What:** Adoption with frontline: training + champions + weekly listening (3 moves). 12-week rollout — weeks 1-4 baseline assist on top 10 intents, weeks 5-8 add scoped deflection on 1-2 narrow intents, weeks 9-12 QA at 100% sampling + first coaching loop. 4 trust trip-wires: no undisclosed bot (Art 50), no uncited KB answer, no AI-gated escalation, no full-autonomy on high-stakes intents. Interactive Markdown builder for the VP CX / Chief Customer Officer conversation.
**Sources:** Composite of [3], [5], [12], [19], [20].

## Tone

- **Emma, CX-leader register.** Warm. Precise. Customer-centric. Operators-of-promise tone.
- **Honest about where AI breaks.** Air Canada, NYC MyCity, Klarna correction — named without schadenfreude, used as discipline.
- **Trust as the chorus.** Disclosure, grounding, escalation paths, QA. Productivity without trust is a Moffatt waiting to happen.

## Theme

Neutral-slate primary (#475569 / #334155 navy #0F172A) + orange accent (#F97316 / #FB923C) on warm-white tint (#F8FAFC). No emojis. Sora headings, Inter body. Same family as the Operations and Demand Forecasting dossiers.
