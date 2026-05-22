# Chapter 3 — Screening and the 4 bias mitigations

**Course:** AI for HR & People Teams · **Chapter:** 03 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Bias-control register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Resume screening AI and the four bias mitigations.* The use case where Bloomberg and Wilson-Caliskan documented the most evidence — and where four operational controls actually work.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the evidence]

The evidence. *Bloomberg News — March twenty twenty-four.* Identical resumes varied only by names from North Carolina voter rolls. *Some demographic groups topped at eleven percent of the time* versus the twelve-and-a-half-percent uniform-distribution baseline.

*Wilson and Caliskan — AIES twenty twenty-four — eighty-five-point-one percent white-name preference.* Reproducible. Peer-reviewed.

The implication. *Out-of-the-box LLM screening will be biased.* Not subtly — *measurably, with effect sizes large enough to violate Title Seven disparate-impact standards in the US, and Annex Three obligations in the EU.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · mitigation 1]

Mitigation one. *Blind data.* Strip demographically-identifying information from resumes *before* AI screening. Names. Photos. Graduation years. Specific schools that proxy for race or class. *Use a structured-data extraction layer that retains skills, experience, qualifications — not identity signals.*

This is the most-effective single mitigation. Bias is measurably lower on blinded screening. *But not zero.* The next three mitigations address the residue.

> [S4 ▸ slide change · t ≈ 1:50]

> [S4 ▸ reveal 1 · mitigation 2 + 3]

Mitigation two. *Calibrated thresholds.* If your AI screens to a numerical score — *test the score distribution across demographic groups before deploying.* Use the four-fifths rule from EEOC enforcement guidance as your floor. *Statistical significance testing.* If one group has materially-lower pass rates at the threshold, the model isn't calibrated. Re-calibrate or kill.

Mitigation three. *Audit logs.* Every AI screening decision is logged. *Which features drove the score.* Which candidates were screened in. Which screened out. *Why.* This is non-negotiable for EU AI Act Article Twelve compliance. It's also defensible documentation under Title Seven and NYC LL One Forty-Four.

> [S5 ▸ slide change · t ≈ 2:50]

> [S5 ▸ reveal 1 · mitigation 4]

Mitigation four. *Human override.* The hiring manager — or a human recruiter — sees every AI screening decision and can override it. *Especially the rejections.* The AI is a recommendation. The human decides.

This is what separates compliant deployments from enforcement cases. *Mobley v. Workday* — the vendor-as-agent class action — *centres on whether the AI made the decision or merely informed it.* Document that humans made the decisions, with the AI as informational input.

> [S5 ▸ reveal 2 · Mobley doctrine]

The Mobley v. Workday doctrine. *Vendor-as-agent.* The argument — when a vendor provides AI tools that screen candidates, the vendor itself may be treated as an agent of the employer. *Both can be liable for discrimination.*

What this means for procurement. *Your HR AI vendor contracts need bias-testing obligations.* Indemnification. Audit rights. Termination triggers if bias testing fails. *This is procurement-team work.* Get your GC involved.

> [S6 ▸ slide change · t ≈ 4:00]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Interview preparation and structured interviews.* Sackett twenty twenty-two — *the r-equals-zero-point-four-two meta-analysis.* AI's job — enforce discipline, not generate clever questions.

> [end]
