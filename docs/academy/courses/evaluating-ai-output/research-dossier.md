# Research Dossier — Evaluating AI Output

**Course:** Evaluating AI Output (Foundations track)
**Audience:** ICs and managers reviewing AI-generated work — own, team's, or vendor's
**Duration:** ~45 min · 7 chapters
**Voice:** Andrew (alternation rule — Course 1 Emma, Course 2 Andrew, Course 3 Emma, Course 4 Andrew)
**Build date:** May 2026

---

## Theme 1 — Why AI output feels more reliable than it is

**1. Passi & Vorvoreanu — Overreliance on AI: Literature Review** — Microsoft Research — https://www.microsoft.com/en-us/research/publication/overreliance-on-ai-literature-review/ — *June 2022*. Reviews ~60 papers. Overreliance = users accepting incorrect AI outputs. Mitigations like confidence scores can *backfire and increase* overreliance. Users framed as "the last line of defense against AI failures."

**2. Kim, Liao, Vorvoreanu et al. — LLM Uncertainty Expression & Trust** — Microsoft + ACM FAccT 2024 (peer-reviewed) — https://arxiv.org/abs/2405.00623 — *Jun 2024*. **404 participants** answering medical questions. First-person uncertainty ("I'm not sure, but…") *drops* confidence and agreement. Confident phrasing — even when wrong — increases over-reliance. The *style* of an AI response drives trust, not its accuracy.

## Theme 2 — The fluency-accuracy gap

**3. Stanford HAI 2026 AI Index Report — Responsible AI chapter** — https://hai.stanford.edu/ai-index/2026-ai-index-report/responsible-ai — *April 2026*. Across 26 top models, **hallucination rates range 22% to 94%**. GPT-4o factual accuracy collapsed from 98.2% to 64.4% under adversarial framings. DeepSeek R1 fell from >90% to 14.4%. When false statements are framed as user beliefs, model performance drops sharply.

**4. Sharma et al. — Sycophancy in Language Models** — Anthropic / ICLR 2024 — https://arxiv.org/abs/2310.13548 — *Oct 2023*. Across five state-of-the-art assistants, **one of the strongest predictors of a positive human rating is whether the response agrees with the user's beliefs** — not whether it's true. RLHF amplifies this. Direct evidence that "sounds right and agrees with me" beats "is right."

## Theme 3 — Hallucination rates (2025–2026)

**5. Vectara HHEM Hallucination Leaderboard** — https://github.com/vectara/hallucination-leaderboard — *live, 2026*. On the updated harder benchmark (7,700+ longer enterprise-style documents), **GPT-5, Claude Sonnet 4.5, Grok-4 all exceed 10% hallucination rates** when summarizing source documents. gpt-5.4-nano (2026-03-17) at 3.1% on the original easier benchmark. **Reasoning models hallucinate MORE on long-form text** because they reason beyond the source.

**6. Google DeepMind FACTS Grounding Benchmark** — https://deepmind.google/blog/facts-grounding-a-new-benchmark-for-evaluating-the-factuality-of-large-language-models/ — *Dec 2024, leaderboard through 2025*. **No model — including Gemini 3 Pro, GPT-5, Claude Opus 4.5 — cracked 70% accuracy.** Claude Opus 4.5 scored 51.3. On Halluhard, Claude Opus 4.5 + web search still hallucinated ~30%; without web search, ~60%.

## Theme 4 — Hallucination taxonomy / three patterns

**7. NIST AI 600-1 — Generative AI Profile** — NIST — https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf — *Jul 26, 2024*. Defines **"confabulation"** (colloquially: hallucination) as one of **12 GAI risks**: *"the production of confidently stated but erroneous or false content (known colloquially as 'hallucinations' or 'fabrications')."* Official U.S.-government taxonomy.

**8. OpenAI — Why Language Models Hallucinate** — https://openai.com/index/why-language-models-hallucinate/ + arXiv 2509.04664 — *Sept 4, 2025*. Hallucinations are **classification errors arising from the training objective itself**, not bugs. Models are "good test-takers" optimizing leaderboards that penalize "I don't know." Fix is socio-technical (re-grade benchmarks to reward calibrated uncertainty).

**9. Anthropic — On the Biology of a Large Language Model** — https://transformer-circuits.pub/2025/attribution-graphs/biology.html — *Mar 27, 2025*. Circuit tracing on Claude 3.5 Haiku: by default the model *declines* to speculate, but "known entity" circuits can override that refusal — producing a confidently wrong answer when the model thinks it recognizes a topic it doesn't actually know. *Hallucination isn't random — it's a misfire of a confidence circuit.*

## Theme 5 — Fake citations / invented papers

**10. Mata v. Avianca, Inc.** — 678 F.Supp.3d 443 (S.D.N.Y. 2023) — Judge P. Kevin Castel — https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2022cv01461/54/ — *Sanctions Jun 22, 2023*. Schwartz & LoDuca sanctioned **$5,000** for six entirely fabricated ChatGPT cases (Varghese v. China Southern, Martinez v. Delta, etc.). The canonical opening anecdote.

**11. Damien Charlotin AI Hallucination Cases Database** — https://www.damiencharlotin.com/hallucinations/ — *live through 2026*. As of early 2026: **1,353+ AI hallucination cases globally** in court filings. U.S. courts imposed **>$145,000 in sanctions in Q1 2026 alone**; single Oregon case reached **$110,000**. Mar 31, 2026: **17 U.S. court decisions in one day** noting suspected AI hallucinations.

**12. Sixth Circuit — Whiting v. City of Athens** — https://www.lawnext.com/2026/03/sixth-circuit-slaps-steep-sanctions-on-two-lawyers-for-fake-citations-and-misrepresentations-in-appellate-briefs.html — *Mar 13, 2026*. Attorneys Van R. Irion + Russ Egli sanctioned **$15,000 each ($30K total)** for briefs containing **>24 fake citations**. Highest federal appellate sanction yet for AI-fabricated citations.

**13. People v. Crabill** — Colorado Presiding Disciplinary Judge — https://reason.com/volokh/2023/11/23/90-day-suspension-of-colorado-lawyer-who-filed-chatgpt-written-motion-with-hallucinated-cases/ — *Nov 22, 2023*. Crabill suspended **1 year and 1 day** (90 days served) for ChatGPT-fabricated cases + **lying to the judge** that errors were an intern's. First state-bar discipline of its kind.

**14. Nature — Hallucinated citations polluting scientific literature** — https://www.nature.com/articles/d41586-026-00969-z — *2025–2026*. Study of 2.5M biomedical papers found **~3,000 with fake references**. Prompted with "Write a 2023 Nature paper on X with 30 citations," AI produces outputs with **~72% false-positive rate** in citations. **Springer Nature retracted an ML book** when 25 of 46 references couldn't be verified.

## Theme 6 — Source verification: what tools exist

**15. Anthropic — Reduce Hallucinations (Claude Docs)** — https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations — *2025, live*. Official mitigations: (a) explicitly permit Claude to say "I don't know"; (b) for documents >20k tokens, **extract word-for-word quotes first** then reason; (c) require quote-level citations + retract any claim without a quote; (d) best-of-N consistency checks.

**16. Perplexity Deep Research launch** — https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research — *Feb 14, 2025*. Agentic RAG loop: retrieves, reads, identifies gaps, retrieves again. **Verification agent validates citations against live sources before final output.** Every answer carries numbered citations.

## Theme 7 — Bias in business outputs

**17. Bloomberg — OpenAI's GPT Sorts Resume Names with Racial Bias** — https://www.bloomberg.com/graphics/2024-openai-gpt-hiring-racial-discrimination/ (methodology on GitHub) — *Mar 2024*. Tested GPT-3.5/4 ranking identical resumes with demographically distinctive names. **Resumes with Black-women-distinctive names were top-ranked for software engineering only 11% of the time** — 36% less than the best-performing group. Bias varies by job; GPT rarely top-ranked male-coded names for HR and retail.

**18. EEOC v. iTutorGroup** — https://www.eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit — *Aug 9, 2023*. First EEOC AI-hiring discrimination settlement. iTutorGroup auto-rejected **female applicants ≥55 and male applicants ≥60** — **>200 applicants in 2020**. Settled **$365,000** + injunctive relief.

**19. Mobley v. Workday, Inc.** — N.D. Cal. 3:23-cv-00770 — https://www.fisherphillips.com/en/insights/insights/discrimination-lawsuit-over-workdays-ai-hiring-tools-can-proceed-as-class-action-6-things.html — *filed 2023, ADEA class certified May 16, 2025*. Mobley applied to **100+ jobs via Workday's AI screening** and was rejected from every one. Court held an AI vendor can be **directly liable as an "agent"** of the employer. First nationwide ADEA collective action against an AI hiring-tools vendor.

**20. Deloitte Australia DEWR report refund** — https://fortune.com/2025/10/07/deloitte-ai-australia-government-report-hallucinations-technology-290000-refund/ — *Oct 2025*. Deloitte produced a **237-page report for the Australian government for AU$290,000** with **~20 fabricated citations** including fake quotes from a federal court judgment (Amato v Commonwealth). Used Azure OpenAI GPT-4o. **Partially refunded** the contract. First public AI-disclosure refund by a Big Four firm.

## Theme 8 — Regional / multilingual bias

**21. Stanford HAI — Mind the (Language) Gap** — https://hai.stanford.edu/policy/mind-the-language-gap-mapping-the-challenges-of-llm-development-in-low-resource-language-contexts — *April 2025*. Most major LLMs **underperform for non-English and especially low-resource languages**, not attuned to local cultural contexts, inaccessible across much of the Global South.

**22. MMLU-ProX multilingual benchmark** — https://arxiv.org/html/2503.10497v1 — *Mar 2025*. Even the **best-performing model (Qwen2.5-72B) shows a 30.2-point gap** between English (70.3%) and Swahili (40.1%) on the same questions. **92.65% of GPT-3's training tokens were English**; non-English ~5% of LLaMA 3's corpus.

## Theme 9 — Verification habit research

**23. Lally et al. — How Are Habits Formed** — European Journal of Social Psychology — https://onlinelibrary.wiley.com/doi/10.1002/ejsp.674 — *2010, foundational*. 96 UCL participants tracked 84 days. **Median time to automaticity = 66 days**, range **18–254 days**. Plan a 9–10 week scaffold, not two weeks.

**24. Moore & Healy — The Trouble with Overconfidence** — Psychological Review 115(2) — https://healy.econ.ohio-state.edu/papers/Moore_Healy-TroubleWithOverconfidence.pdf — *2008*. Three flavors of overconfidence — overestimation, overplacement, **overprecision** (excessive certainty one knows the truth). Overprecision "both the most durable and the least understood." Use to explain: even *you* will feel certain of AI outputs you shouldn't.

**25. BJ Fogg — Tiny Habits (Behavior Design Lab, Stanford)** — https://tinyhabits.com/book/ — *2019*. **B = MAP**: Behavior happens when Motivation, Ability and a Prompt converge. Anchor a new habit to existing routine ("after I open a new AI tab, I check the source"). Celebrate immediately to encode.

## Theme 10 — Real-world cost of unchecked output

**26. Moffatt v. Air Canada — 2024 BCCRT 149** — https://decisions.civilresolutionbc.ca/crt/sd/en/item/525448/index.do — *Feb 14, 2024*. Air Canada chatbot fabricated a bereavement-fare refund policy. Tribunal: **"Air Canada did not take reasonable care to ensure its chatbot was accurate"** + rejected the "separate legal entity" argument. **CA$812.02 total** (CA$650.88 + CA$36.14 + CA$125 fees). First common-law ruling holding a company liable for its own AI's misstatements.

**27. CNET / Bankrate AI-article corrections** — Futurism + CNN — https://futurism.com/cnet-ai-errors — *Jan 2023*. CNET published **77 finance explainers under AI byline**. Resulting audit corrected **41 of 77** — including substantial mathematical errors. **More than half of unchecked AI output needed corrections — with editorial staff in the loop.**

---

## Chapter blueprint

### Chapter 1 — Why AI evaluation is harder than it looks (~6 min)
**Spine:** The fluency-accuracy gap. Confident-sounding output is *more* trusted regardless of accuracy. Microsoft FAccT 2024 study (404 participants), Anthropic sycophancy paper, Stanford HAI 2026 (22–94% hallucination range, GPT-4o collapse under adversarial framings).
**Interactive:** Fluency-accuracy demo — 3 outputs on the same question, learner picks "most trustworthy" before reveal of which is actually accurate.
**Citations:** 1, 2, 3, 4.

### Chapter 2 — Accuracy vs. usefulness (~6 min)
**Spine:** Two different tests. Accuracy = facts/numbers/citations match reality. Usefulness = does the output actually help me ship the task. AI can be accurate-and-useless (recites correct facts in a useless structure) or useful-and-wrong (great structure, wrong numbers). Apply the right test for the task.
**Interactive:** Output-pairs comparator — same prompt, two outputs, learner picks per task whether to check accuracy or usefulness first.
**Citations:** 3, 6.

### Chapter 3 — Spotting hallucinations in 3 patterns (~7 min)
**Spine:** The three patterns named explicitly. (1) Confident fabrication — entirely invented facts. (2) Plausible detail — adds detail that wasn't in source. (3) Stale fact — pre-cutoff truth, now wrong. Vectara HHEM numbers, OpenAI "why models hallucinate" framing, NIST confabulation definition. Targeted checks per pattern.
**Interactive:** Hallucination-pattern sorter — 6 AI outputs, classify each as fabrication / plausible-detail / stale-fact / clean.
**Citations:** 5, 6, 7, 8, 9.

### Chapter 4 — Evaluating sources and citations (~7 min)
**Spine:** The Mata v. Avianca anchor. 1,353+ court cases through 2026. Sixth Circuit $30K sanctions. Deloitte Australia AU$290K refund. The Nature 72% fake-citation finding. Plus practical checks — Anthropic's "extract quotes first" pattern, Perplexity's verification agent.
**Interactive:** Citation-verifier — 4 AI-generated citations; learner picks plausible / suspicious / verify-with-source. Reveals what to check.
**Citations:** 10, 11, 12, 13, 14, 15, 16, 20.

### Chapter 5 — Spotting bias in outputs (~6 min)
**Spine:** Three patterns. (1) Demographic bias — Bloomberg resume study, 11% top-rank for Black women. (2) Regional/cultural bias — MMLU-ProX 30-point Swahili gap, Stanford HAI low-resource gap. (3) Hiring-system bias — EEOC iTutorGroup, Workday Mobley class action. The regional-context check.
**Interactive:** Bias spotter — 4 AI outputs (job description, hiring screener, customer-comms, market-research), learner spots the bias pattern.
**Citations:** 17, 18, 19, 21, 22.

### Chapter 6 — Building your verification habit (~6 min)
**Spine:** The 66-day median (Lally). Overprecision is universal (Moore). B = MAP from Fogg — anchor verification to an existing trigger. The "verification fatigue" honesty — drop-off at week 3 is when discipline collapses. A 5-minute checklist that survives Monday morning.
**Interactive:** Habit-designer — pick your anchor (Slack open, AI tab open, before-send), pick your check (source, math, names), get a personalised "B=MAP" formula.
**Citations:** 23, 24, 25.

### Chapter 7 — Making it stick: your verification playbook (~7 min)
**Spine:** Same shape as Course 2 and Course 3 closes. Three never-skip checks. One always-do escalation rule. The Friday review. Downloadable markdown playbook.
**Interactive:** Playbook builder — function + tasks + three checks → markdown file.
**Citations:** 26, 27 (real-cost framing for the close).

---

## Negative list

- **No "AI is dangerous, don't trust it" framing.** This is a verification course for people who use AI daily — the point is to use it BETTER, not retreat.
- **No "5 prompts to reduce hallucinations" listicle stuff.** That's chapter 1 of Prompting Mastery territory.
- **No vendor neutrality theatre.** Name Microsoft, Anthropic, OpenAI, Google, Stanford, NIST, EEOC by name. Specific = credible.
- **No "capstone" language anywhere.** Chapter 7 is "Making it stick" per project-academy-rebuild-plan.
- **No moralising about AI hiring tools.** Cite the cases. Let the learner reach their own conclusion.
