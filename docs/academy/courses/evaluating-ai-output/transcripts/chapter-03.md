# Chapter 3 — Spotting hallucinations in 3 patterns

**Course:** Evaluating AI Output · **Chapter:** 03 · **Target duration:** ~7 min spoken

## Trainer persona
Andrew. Specific patterns, specific checks.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. Hallucinations have a specific shape — three specific shapes, actually. *Once you can name them, you can spot them.* This is the chapter where evaluation becomes a skill, not a vibe.

> [S2 ▸ slide change · t ≈ 0:20]

> [S2 ▸ reveal 1 · the definition]

Start with the definition that matters. *NIST AI Six Hundred Dash One*, the U.S. government's Generative AI Profile published July 2024, calls hallucination by its technical name — *confabulation* — and defines it as: *"the production of confidently stated but erroneous or false content."* That's the official taxonomy. One of twelve generative-AI risks. *Erroneous + confidently stated.* Hold that.

OpenAI published a paper in September 2025 — *Why Language Models Hallucinate* — that explains why this is structural, not a bug. Models are trained as good test-takers. The training objective *penalises saying "I don't know"* and *rewards a confident guess*. So they guess. They don't know they're guessing. *They're not lying — they're confident in error.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · pattern 1 confident fabrication]

Pattern one. *Confident fabrication.* The model invents facts that don't exist anywhere. A study, a quote, a court case, a person, a URL — *entirely made up.* The most famous example — Mata versus Avianca, 2023 — six fully invented court cases including made-up case names, citations, and quotes. *None existed.*

How to spot it. Anything specific and verifiable that the model produces should be cross-checked at the source. *A quote without a direct link is suspect. A study without a journal name is suspect. A court case without a citation is suspect.* If you can't paste the exact phrase into Google or a paid database and find it, treat the original output as fabricated until proven otherwise.

> [S4 ▸ slide change · t ≈ 2:40]

> [S4 ▸ reveal 1 · pattern 2 plausible detail]

Pattern two. *Plausible detail.* The model adds detail that *wasn't in the source* — but the detail is plausible enough that you don't notice. You asked it to summarise a paper. The summary includes a number that sounds right but isn't actually in the paper. Or a methodology detail. Or a date range.

This pattern is the most dangerous because it doesn't *feel* like hallucination — it feels like helpful expansion. Vectara's HHEM benchmark for 2026 found that *reasoning models like GPT-5, Claude Sonnet 4.5, and Grok-4 all exceed ten percent hallucination on long-form summarisation* of source documents. *Reasoning models hallucinate more, not less.* They reason beyond the source and add detail that wasn't there.

How to spot it. Anchor the model to the source. *Paste the source. Ask the model to extract only word-for-word quotes that back its summary claims.* If the quote isn't there, the claim is plausible-detail hallucination.

> [S5 ▸ slide change · t ≈ 4:00]

> [S5 ▸ reveal 1 · pattern 3 stale fact]

Pattern three. *Stale fact.* The model gives you something that *was true at training cutoff but isn't true now.* A CEO who left in 2024. A regulation that changed in 2025. A product version that's been deprecated. *True a year ago. Wrong today.*

This is the easiest pattern to miss because there's no fabrication signal — the model isn't making it up. It just doesn't know about the change. Especially dangerous for fast-moving topics — leadership changes, regulatory updates, pricing, product features.

How to spot it. *For any time-sensitive claim, ask the model what its training cutoff date is.* Cross-check anything dated within twelve months of that cutoff against a live source. Better — use a Copilot or ChatGPT mode with web search enabled for time-sensitive questions.

> [S6 ▸ slide change · t ≈ 5:00]

> [S6 ▸ reveal 1 · the sorter]

The interactive on screen. Six AI outputs from real business contexts. *Classify each one* — *confident fabrication*, *plausible detail*, *stale fact*, or *clean*. Two of them are deliberately tricky. You'll get at least one wrong on the first pass. *That's calibration.*

> [pause for hands-on · ≈ 12 seconds]

> [S6 ▸ reveal 2 · the takeaway]

The pattern across the three — *they look different at the surface, but the check is the same shape*. Anchor every specific claim to an external source. *If you can't find the exact phrasing, number, or date at the source — treat it as suspect.* The check doesn't take long. The fix when you skip it can take a quarter.

> [S7 ▸ slide change · t ≈ 5:50]

> [S7 ▸ reveal 1 · monday move]

The Monday move. Pick one AI output you've shipped in the last month. *Run the three-pattern check on it.* For every specific claim — is it a real source? Is the detail backed by a direct quote? Is the fact still current? *Most outputs survive. A few don't.* Those few are the ones that teach you the pattern.

> [S7 ▸ reveal 2 · close]

Next chapter — citations specifically. *The Mata case was just the start.* Over a thousand court cases now involve AI-generated hallucinated citations. *The pattern is escalating. So are the sanctions.*

> [end]
