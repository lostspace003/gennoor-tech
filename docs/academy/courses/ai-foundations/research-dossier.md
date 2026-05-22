# AI Foundations — Research Dossier (Phase 2 Rewrite)

**Course slug:** `ai-foundations`
**Track:** Foundations
**Audience:** Non-technical professionals starting their AI journey
**Length:** 8 chapters · ~40 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

AI in 2026 is no longer a curiosity for non-technical professionals — it's an expected workplace literacy. ChatGPT reached 100 million users in two months. Microsoft 365 Copilot is in mainstream enterprise rollouts. The challenge isn't whether to engage — it's how to engage with calibrated understanding, not hype-driven enthusiasm or fear.

This course gives non-technical professionals the foundation to use AI confidently — knowing what it is, how it works in plain terms, where it fits, what risks to watch, how to evaluate vendor claims, and how to build durable habits that don't drift into AI-amnesia after the novelty fades.

## Numbers table (anchor citations · all verifiable public sources)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | ChatGPT reached 100 million monthly active users in 2 months (Jan 2023) — fastest-growing consumer app then | UBS / Reuters / Similarweb | Feb 2023 |
| 2 | OpenAI ChatGPT public release | OpenAI blog | 30 Nov 2022 |
| 3 | GPT-4 release | OpenAI blog | 14 Mar 2023 |
| 4 | Microsoft 365 Copilot GA | Microsoft Build / Inspire | 1 Nov 2023 |
| 5 | Stanford AI Index 2025 — 78% of global organisations reported using AI in 2024, up from 55% in 2023 | Stanford HAI · AI Index Report 2025 | Apr 2025 |
| 6 | McKinsey State of AI 2025: ~71% of organisations regularly using gen AI in at least one function | McKinsey Global Survey 2025 | Mar 2025 |
| 7 | EU AI Act Regulation 2024/1689 — Annex III high-risk categories, Art. 50 transparency, Art. 99 fines up to €15M or 3% global turnover | EU Official Journal · 2024/1689 | Aug 2024 published, in tranches through Aug 2026 |
| 8 | Mata v. Avianca (S.D.N.Y. 22-cv-1461 PKC) — Judge Castel sanctioned lawyers $5,000 + ordered notification of falsely-cited judges for ChatGPT-fabricated case citations | SDNY court docket | 22 Jun 2023 |
| 9 | Moffatt v. Air Canada (BC Civil Resolution Tribunal) — CA$812 + interest awarded; "Air Canada is responsible for all information on its website, including from a chatbot" | BC CRT public ruling | 14 Feb 2024 |
| 10 | Bloomberg resume study: GPT-3.5 / GPT-4 ranked identical resumes; names drawn from NC voter rolls; some groups top-ranked as little as 11% (vs uniform-distribution baseline of 12.5%) | Bloomberg News investigation | Mar 2024 |
| 11 | Pew Research: 58% of US adults have heard of ChatGPT by 2024; 23% have used it; majority of professional workers under 50 have tried generative AI | Pew Research surveys 2023-2024 | 2024 |
| 12 | World Economic Forum Future of Jobs 2025: ~40% of employers expect AI/automation to reduce some workforce by 2030; majority expect upskilling rather than mass layoffs | WEF Future of Jobs Report | Jan 2025 |
| 13 | Hallucination rate baseline: Stanford "Hallucinating Law" (Jan 2024) — top legal AI tools hallucinated 17-34% on benchmark queries even with retrieval grounding | Stanford HAI · Hallucinating Law | Jan 2024 |
| 14 | Microsoft Copilot for M365 productivity studies — Microsoft published studies show ~30% time savings on routine documents for active users; not free for everyone | Microsoft Work Trend Index | 2024-2025 |
| 15 | Tetlock "Superforecasting" + "Expert Political Judgment" — calibration matters more than confidence; applies to AI vendor claims | Tetlock 2005, 2015 | classic references |
| 16 | Anthropic Claude Constitutional AI + Microsoft Responsible AI Standard — vendor-published responsible-use frameworks | Anthropic + Microsoft documentation | 2023-2025 |
| 17 | OpenAI Enterprise + Anthropic Commercial Terms — training opt-out by default for API + workspace; client data not used to train | OpenAI + Anthropic Trust pages | 2024-2025 |
| 18 | Pew Research 2025 — 70% of consumers feel more comfortable with AI agents when explicitly told they're AI; 9% prefer hidden AI | Pew Research Consumer AI Attitudes 2025 | Aug 2025 |
| 19 | Generative AI productivity studies — MIT/BCG 2023, Goldman Sachs 2023, Harvard 2024 — consistently show productivity gains of 15-40% on knowledge-work tasks for AI-augmented workers | Multiple peer-reviewed + working papers | 2023-2024 |
| 20 | Gartner Hype Cycle for AI — generative AI passed peak inflated expectations and entered the "trough of disillusionment" cleanup phase by 2025 | Gartner Hype Cycle 2025 | 2025 |

## Named incidents (use sparingly, all verifiable)

1. **Mata v. Avianca (Jun 2023)** — ChatGPT-fabricated citations sanctioned. Verifiable court docket.
2. **Moffatt v. Air Canada (Feb 2024)** — chatbot promised refund the airline didn't offer. Verifiable BC CRT ruling.
3. **Bloomberg resume study (Mar 2024)** — bias in resume ranking. Verifiable News investigation.

## What we do NOT say

- **No "AI replaces humans" framing.** Frame as augmentation + literacy.
- **No specific made-up publication citations** (per `[[feedback-citation-rigor]]`).
- **No vendor selection bias.** OpenAI, Anthropic, Microsoft, Google referenced even-handedly.
- **No "AI is magic" framing.** Tokens, probabilities, training data — plain English.
- **No fear-mongering.** Honest about risks. Not catastrophising.

## Chapter blueprint

### Chapter 1 — What AI is (and isn't) (~6 min)
**What:** The 2026 landscape. ChatGPT 100M users in 2 months. GPT-4. Claude. Gemini. Copilot. Stanford AI Index 78% adoption. McKinsey 71% regularly using gen AI. The distinction between machine learning, large language models, and "AI" as marketing term. Gartner hype cycle: trough of disillusionment cleanup. The thesis: calibrated literacy, not hype or fear.
**Sources:** [1], [2], [3], [4], [5], [6], [20].

### Chapter 2 — How LLMs actually work (~5 min)
**What:** Plain-English intuitions. Tokens. Training on text. Next-token prediction. Why LLMs sometimes "hallucinate" — they're predicting plausible-next-text, not retrieving facts. Why retrieval-grounded systems are more reliable. The Stanford 17-34% baseline. No math.
**Sources:** [13], [15].

### Chapter 3 — Where AI fits in everyday work (~5 min)
**What:** The categories that work in 2026 — drafting, summarising, translating, classifying, extracting, generating code. The MIT/BCG/Goldman/Harvard productivity studies (15-40% gains on knowledge work). The categories that work less reliably — open-ended research with citations, judgemental decisions, anything involving identity verification or specific facts.
**Sources:** [14], [19].

### Chapter 4 — Privacy and bias risks (~5 min)
**What:** Three real cases. Mata v. Avianca (legal hallucination). Air Canada Moffatt (chatbot binding the company). Bloomberg resume study (bias in ranking). EU AI Act Art. 50 transparency + Art. 99 fines. The personal data question — what's safe to put in which tool. Enterprise terms vs free consumer accounts.
**Sources:** [7], [8], [9], [10], [17].

### Chapter 5 — Evaluating AI claims (~5 min)
**What:** Tetlock — calibration matters more than confidence. How to read a vendor productivity claim. The "studied population" question. The "compared to what" question. The "what didn't get measured" question. The Microsoft Work Trend Index 30%-time-saving claim — and how to read it carefully. Pew 70% disclosure preference + 9% hidden preference.
**Sources:** [11], [14], [15], [18].

### Chapter 6 — Hands-on prompts that work (~5 min)
**What:** The 5 prompt patterns that work consistently. Role + task + format + constraints + examples. The "ask for the structure first" pattern. The "verify the citation" pattern. The "rewrite my draft for X audience" pattern. Worked examples from Copilot, ChatGPT, Claude.
**Sources:** Composite of [14], [17].

### Chapter 7 — Habits that stick (~5 min)
**What:** Why most AI initiatives drift. The "use it Monday" pattern. Calendar block for the experiment. Pair with a colleague. Track what worked + what didn't. The 4-week habit horizon. WEF Future of Jobs — upskilling is the durable response.
**Sources:** [12].

### Chapter 8 — Making it stick · your 2-week starter plan (~4 min)
**What:** 2-week starter plan, not 90 days, not a quarter. Pick 2 use cases. Pair with one colleague. Track simple metrics — time saved, quality, comfort. Trust trip-wires: no personal data to free tools, no AI-generated citations unverified, no "set and forget", no AI signs anything binding. Builder generates a one-page plan you can take to your manager.
**Sources:** Composite.

## Tone

- **Emma.** Calm, evidence-led, not breathless. Talking to a smart professional who hasn't done this before.
- **Plain English.** No jargon without definition.
- **Honest.** What works. What doesn't. What we know. What we don't.
- **Practical.** Every chapter ends with "what to do Monday."

## Theme

Neutral-slate + orange-accent palette per `[[feedback-course-theming]]`. No emojis. Sora headings, Inter body.
