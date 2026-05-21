# Chapter 4 — Evaluating sources and citations

**Course:** Evaluating AI Output · **Chapter:** 04 · **Target duration:** ~6 min spoken

## Trainer persona
Andrew. Specific named cases, escalating sanctions, the practical citation check.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Citations are where hallucinations get expensive.* Wrong fact in a draft email — you fix it. Wrong cited case in a court brief — *thirty thousand dollars in sanctions and your name in the legal press.* This chapter is the citation-check.

> [S2 ▸ slide change · t ≈ 0:20]

> [S2 ▸ reveal 1 · scale]

The scale of the problem. *Damien Charlotin, a French lawyer, maintains a public database tracking AI-hallucination cases in court filings.* As of early 2026, it catalogs *one thousand three hundred and fifty-three cases globally.* U.S. courts imposed *over one hundred and forty-five thousand dollars in sanctions in the first quarter of 2026 alone.* A single Oregon case reached one hundred and ten thousand. On March thirty-first, 2026, *seventeen U.S. court decisions in a single day* noted suspected AI hallucinations in filings. *That's the pattern in 2026.* It's accelerating.

> [S3 ▸ slide change · t ≈ 1:20]

> [S3 ▸ reveal 1 · escalating sanctions]

The sanctions are escalating. *Mata versus Avianca, June 2023* — five thousand dollars for six fabricated cases. *People versus Crabill, November 2023* — Colorado attorney suspended one year, ninety days served, for hallucinated cases *plus lying to the judge about it.* *Sixth Circuit Court of Appeals, March 2026* — thirty thousand dollars total against two attorneys for an appellate brief containing more than twenty-four fake citations.

The trajectory is — *five thousand to thirty thousand in three years*, and these are individual lawyers. The Deloitte Australia case shows the corporate version — *two hundred and ninety thousand Australian dollars partially refunded* on a government report with twenty fabricated citations. *Big Four consulting firm. Public reputational hit.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · academic side]

This isn't just law. A 2026 Nature article tracked the same pattern in academic publishing. *A study of two-point-five million biomedical papers found roughly three thousand with fake references — likely AI-generated.* When researchers prompted AI to "write a Nature paper on X with thirty citations," the citations came back with a *seventy-two percent false-positive rate.* *Springer Nature retracted a machine-learning book when twenty-five of forty-six references couldn't be verified.*

The pattern across law, academia, consulting, and journalism is the same. *AI confidently generates citations that look right. They're not. The verification step matters.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · the practical check]

The practical check. Three steps. Five minutes per citation if you're being careful.

*One — match the bibliographic shape.* Real citations have specific shapes. A real federal court case has a number like a-colon-twenty-three-cv-zero-zero-seven-seven-zero. A real Nature paper has a DOI starting ten-point-one-zero-three-eight. A real EU AI Act article cites a recital number. *If the shape is wrong, the citation is fabricated. Stop there.*

*Two — find the source independently.* Don't ask the AI to verify itself. Open Google Scholar, the case database, the publisher's site directly. *Paste the title. Paste the author and year. If nothing comes up, the citation is fabricated.* If something does come up but it's a different paper — the AI got the title wrong, which is also fabrication.

*Three — verify the AI is using the source correctly.* The paper exists. The author is real. *Does the paper actually say what the AI claims it says?* This is where Anthropic's documentation suggests asking the model to extract direct word-for-word quotes from the source. *If it can't extract a quote that backs the claim, the claim is plausible-detail hallucination — even though the citation itself is real.*

> [S6 ▸ slide change · t ≈ 4:50]

> [S6 ▸ reveal 1 · the verifier]

The interactive. Four AI-generated citations. For each — *plausible*, *suspicious*, or *verify-with-source*. The reveal shows what to check next. Two of these look fine. Two have tells.

> [pause for hands-on · ≈ 10 seconds]

> [S6 ▸ reveal 2 · the takeaway]

The pattern — *the tells are in the shape*. Wrong court designation. Impossible DOI. Wrong journal name for the supposed topic. *Once you've seen ten fabricated citations, you'll spot them in three seconds.*

> [S7 ▸ slide change · t ≈ 5:30]

> [S7 ▸ reveal 1 · monday move]

The Monday move. *Pick one citation from any AI output you've used in the last month.* Run the three-step check. Did the source exist? Did the AI quote it accurately? *Five minutes — and you'll know whether you've shipped a citation that wouldn't survive verification.*

> [S7 ▸ reveal 2 · close]

Next chapter — bias. *Specific patterns in business outputs, with named cases.*

> [end]
