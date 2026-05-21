# Chapter 5 — Spotting bias in outputs

**Course:** Evaluating AI Output · **Chapter:** 05 · **Target duration:** ~6 min spoken

## Trainer persona
Andrew. Specific cases. No moralising — just the named precedents and the spotting habit.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. Bias. *Not the obvious bias.* The obvious version — racist output, sexist output, blatantly wrong cases — most modern models catch. *The dangerous version is the bias you don't notice* because the output reads like a normal business document. This chapter is three patterns and the named cases that make them real.

> [S2 ▸ slide change · t ≈ 0:25]

> [S2 ▸ reveal 1 · pattern 1 demographic]

Pattern one. *Demographic bias in ranking and screening.* Bloomberg ran a methodologically transparent study in March 2024 — they took identical resumes, changed only the names to demographically-distinctive ones drawn from North Carolina voter rolls, and asked GPT-3 point five and GPT-4 to rank them for jobs.

The result. *Resumes with names distinctive to Black women were top-ranked for a software engineering role only eleven percent of the time* — thirty-six percent less than the best-performing group. *Same resume. Different name. Different rank.* The bias varied by job — GPT rarely top-ranked male-coded names for HR or retail roles. *The methodology is on GitHub. The study is replicable.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · named cases]

The legal consequences. *EEOC versus iTutorGroup* — settled August 2023. The first EEOC AI-hiring discrimination case. iTutorGroup's screening software was programmed to auto-reject female applicants fifty-five and older and male applicants sixty and older. *More than two hundred applicants rejected by AI on age alone in 2020.* Settlement — three hundred and sixty-five thousand dollars plus injunctive relief.

*Mobley versus Workday* — filed February 2023, conditional ADEA class certification granted May 2025. Plaintiff Derek Mobley — Black, disabled, over forty — applied to more than one hundred jobs via Workday's AI screening. *Rejected from all of them.* The court held that an AI vendor can be directly liable as an *agent* of the employer. *First nationwide class action against an AI hiring-tools vendor.*

> [S4 ▸ slide change · t ≈ 2:40]

> [S4 ▸ reveal 1 · pattern 2 regional]

Pattern two. *Regional and cultural bias.* This one matters most for teams operating outside the U.S. and Europe. *LLMs are dramatically less accurate in non-English languages.* Stanford HAI published a 2025 paper specifically on this — *Mind the Language Gap* — finding that most major LLMs underperform for non-English and especially low-resource languages.

The MMLU-ProX multilingual benchmark, March 2025, has a specific number. *On the same questions, the best-performing model — Qwen two point five seventy-two B — scores seventy point three percent in English and forty point one percent in Swahili.* That's a thirty-point gap. *Same model. Same questions. Different language.* The underlying cause — over ninety-two percent of GPT-3's training tokens were English.

For business outputs, this shows up as *cultural defaults*. The assumed customer is American. The assumed week starts Monday. The assumed contract law is common-law. *If you're shipping in GCC, India, Africa, or SEA, you have to spot when the model is defaulting to assumptions that don't match your context.*

> [S5 ▸ slide change · t ≈ 3:50]

> [S5 ▸ reveal 1 · pattern 3 hiring]

Pattern three — *the meta-pattern.* AI in hiring is now its own area of enforcement, with two clear takeaways for anyone reviewing AI-generated job-related output.

*One* — automated rejection is legal exposure. If your AI screened and rejected, your company is liable, not the vendor. Workday's loss on the agent argument established that. *Two* — bias scales. Air Canada lost eight hundred dollars for one chatbot mistake. iTutorGroup lost three hundred and sixty-five thousand for an AI policy applied to two hundred candidates. *Same shape — bias at scale costs more.*

If you review hiring-related AI outputs, the question to ask is — *does the screening criterion correlate with a protected category?* Age, gender, race, disability, national origin. If the answer is *possibly* — you need a human-reviewed alternative process.

> [S6 ▸ slide change · t ≈ 4:50]

> [S6 ▸ reveal 1 · the spotter]

The interactive. Four AI outputs from real business contexts — a job description, a hiring screener, a customer-comms draft, a market-research brief. *Spot the bias pattern in each.*

> [pause for hands-on · ≈ 10 seconds]

> [S6 ▸ reveal 2 · the takeaway]

The shared check. *Whenever an AI output describes, ranks, or excludes people — ask whether the criterion correlates with a protected category or a regional default.* For customer-facing language, check the assumed customer profile. *If the output assumes the customer's currency, calendar, name format, or family structure looks like the model's training majority — you have a regional-default problem.*

> [S7 ▸ slide change · t ≈ 5:35]

> [S7 ▸ reveal 1 · monday move]

The Monday move. *Take one AI output you've used recently that involves people* — a job description, a customer email template, an applicant summary. Read it from the perspective of someone who *isn't* the assumed default. *Does the output describe their context accurately, or does it describe a default the model assumed?* That's the bias check.

> [S7 ▸ reveal 2 · close]

Next chapter — the verification habit. *Knowing all this means nothing if you don't actually do it.* The behavioral science of making it stick.

> [end]
