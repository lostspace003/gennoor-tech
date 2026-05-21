# Chapter 2 — Resume screening and the 4 bias mitigations

**Course:** Recruiting AI in Practice · **Chapter:** 02 · **Target duration:** ~7 min spoken

## Trainer persona
Emma. The course's substantive chapter. Citations heavy. No moralising.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. The screening layer is *where the bias problem actually lives* — and where the regulators are looking. This chapter is the evidence, then the four mitigations every TA team should have implemented by the end of the quarter.

> [S2 ▸ slide change · t ≈ 0:20]

> [S2 ▸ reveal 1 · bloomberg]

The evidence first. *Bloomberg ran a study in March 2024.* They generated identical résumés, varied only by demographically-distinctive names drawn from North Carolina voter rolls — ninety percent race-distinctive — and asked GPT to rank them across one thousand trials per role. *If unbiased, each of the eight demographic groups would top-rank twelve point five percent of the time.*

The result. *Black women's names top-ranked only eleven percent of the time for a software engineering role — thirty-six percent less than the best-performing group.* Asian women top-ranked seventeen point two percent — highest. *Same résumés. Different names. Different rank.* The methodology and data are public on GitHub. *This is replicable.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · academic]

The academic confirmation. *Wilson and Caliskan published at the ACM AIES 2024 conference* — peer reviewed. Five hundred and fifty plus job descriptions, five hundred and fifty plus résumés, eighty name augmentations. *Massive Text Embedding models favoured white-associated names in eighty-five point one percent of cases* and *female-associated names in only eleven point one percent* of cases. *Effects compound intersectionally — Black men were the most disadvantaged group.*

This isn't a one-vendor problem. It's a class of behaviour across the foundation models that power most screening tools. *If you use embedding-based ranking anywhere in your hiring funnel — this is your problem.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · the four]

The four mitigations. *Together they form a defensible posture.* Individually they don't.

*One — blind data.* Strip demographic signals from inputs before screening. Names, addresses, photos, dates of birth, dates of graduation, school names where they correlate with demographics. *The model can't bias on a signal it never receives.*

*Two — calibrated thresholds.* The EEOC's four-fifths rule from twenty-nine CFR Part sixteen hundred and seven — selection rates across protected groups must be at least eighty percent of the highest-performing group's rate. *Calibrate the model's threshold so the rule holds for your actual applicant pool.* The EEOC explicitly says four-fifths is "merely a rule of thumb" — statistically significant differences can still constitute adverse impact, so you measure both.

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · audit logs]

*Three — audit logs.* The EU AI Act, Article twenty-six, *requires deployers of high-risk AI to retain automatically-generated logs for at least six months.* Recruitment is explicitly listed as high-risk in Annex Three, paragraph four. NIST AI Six Hundred Dash One puts log retention in the Govern function of the AI Risk Management Framework.

For practical purposes — every screening decision must be reconstructible. *Who was screened, what model version scored them, what threshold was applied, what was the output, what human reviewed it.* If you cannot answer those questions for any candidate the AI screened in the last six months, *you do not have an audit log. You have a guess.*

*Four — human override.* The EEOC's twenty twenty-three technical assistance lists the remedies for adverse impact — *discontinue, replace, or modify* using "comparably effective alternative algorithms." That presumes a human can actually override the model. Build the override path into the workflow before you ship. *Recruiter can flag, manager can review, candidate can appeal.* Without the override, you've built an automated decision the EU AI Act treats more harshly under Article twenty-two of GDPR.

> [S6 ▸ slide change · t ≈ 5:05]

> [S6 ▸ reveal 1 · auditor]

The interactive on screen. Four screening flows. For each one, *identify which of the four mitigations is missing.* The flows look reasonable until you ask the diagnostic question. *Three are tricky.*

> [pause for hands-on · ≈ 12 seconds]

> [S6 ▸ reveal 2 · pattern]

The pattern across the missing mitigations. *Most teams have one or two.* Almost none have all four. The one teams skip most often is *human override* — because it slows down high-volume screening and feels redundant when the model is "good." *That's exactly the assumption that lost Workday's motion to dismiss.*

> [S7 ▸ slide change · t ≈ 5:50]

> [S7 ▸ reveal 1 · workday]

Speaking of Workday. *Mobley versus Workday* is the case every TA leader should know cold. Filed February 2023. Derek Mobley — Black, disabled, over forty — applied to over one hundred jobs via Workday's AI screening. *Rejected from all of them.* In May 2025, Judge Rita Lin granted preliminary ADEA collective certification. The class — all individuals aged forty plus who applied via Workday from September 2020 onward and were denied.

*The doctrinal move that matters.* The court held that an AI vendor can be **directly liable as an agent** of the employer. *Workday represented in court that approximately one point one billion applications were rejected through its tools during the relevant window.* As of 2026, the case is in discovery with the collective notice deadline March seventh. *If you use any vendor AI in screening, you're now in a doctrine where the vendor is your agent.* That makes your audit log and human override the vendor's problem too.

> [S8 ▸ slide change · t ≈ 6:55]

> [S8 ▸ reveal 1 · monday move]

The Monday move. *Audit your current screening flow against the four mitigations.* Write yes or no for each. Blind data. Calibrated thresholds. Audit logs. Human override. *The flow without all four is the flow that loses your Mobley equivalent case.* Pick the one missing mitigation that's easiest to add this quarter. *Add it.*

> [S8 ▸ reveal 2 · close]

Next chapter — the interview layer. *Where structured-interview research from twenty twenty-two finally makes AI's job clear.*

> [end]
