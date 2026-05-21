# Chapter 2 — Accuracy vs. usefulness

**Course:** Evaluating AI Output · **Chapter:** 02 · **Target duration:** ~6 min spoken

## Trainer persona
Andrew. Practical, concrete. Two tests, not one.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. Most evaluation goes wrong because reviewers apply *one test* to AI output. They check accuracy — *are the facts right?* And they call it done. That misses half the problem. Some AI outputs are accurate and *useless*. Some are useful and *partially wrong*. Knowing which test to apply when is the skill.

> [S2 ▸ slide change · t ≈ 0:25]

> [S2 ▸ reveal 1 · two tests]

Two tests. Different.

*Accuracy* — do the facts, numbers, names, dates, and citations match reality? Verifiable against an external source.

*Usefulness* — does this output actually help me ship the task I'm doing? Did it surface the right considerations, structure the right argument, anticipate the question I'm about to be asked?

These don't move together. *An output can ace accuracy and fail usefulness*. It can ace usefulness and miss on accuracy. *Knowing which is which determines what you do next.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · accurate useless]

Pattern one. *Accurate and useless.* You asked Copilot to write a memo summarising your Q3 results. The numbers it returned are exact. The names of the products are right. The dates are right. *And the memo reads like a wikipedia entry.* No argument. No conclusion. No call to action. *You can't send it.*

The failure isn't accuracy. The output is true. *It's not useful because it didn't do the task.* The task was "write a memo my CEO will act on." The model treated it as "list the facts about Q3." Different tasks.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · useful wrong]

Pattern two. *Useful and partially wrong.* You asked for a draft pricing recommendation. The structure is sharp — situation, options, recommendation, risks. Reads like a real partner could have written it. But the comparable-deal numbers are off, two of the competitor product names are misspelled, and a cited source has a wrong publication date.

*The shape is right. The data is wrong.* If you ship this, you don't get fired for bad reasoning. You get fired for the misspelled competitor name in the executive summary. *Usefulness gave you a false sense of done.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · which test first]

Which test first — and here's the practical rule. *The test you run first is the one whose failure is hardest to recover from.*

For outputs that go to external customers, partners, or regulators — *accuracy first*. A wrong number, a wrong name, a wrong citation in a public document is the kind of failure that costs you more than the entire AI saved you. The Deloitte Australia case is a useful anchor — a two hundred and ninety thousand Australian dollar government report with twenty fabricated citations cost Deloitte a partial refund and a public Big Four embarrassment. *Accuracy fail. Catastrophic.*

For internal-facing outputs you'll iterate on — *usefulness first*. Does the structure work? Is the argument sharp? *Catch the accuracy issues on the second pass*. Internal team docs, exploratory analyses, brainstorm transcripts — these benefit from usefulness-first review.

> [S6 ▸ slide change · t ≈ 4:45]

> [S6 ▸ reveal 1 · the comparator]

The interactive on screen. Same prompt — *"draft a customer-renewal proposal."* Two different AI outputs. For each one, classify it — *accurate and useful*, *accurate but useless*, *useful but wrong*, or *both broken*. Then pick which test you would run *first* if you had to choose.

> [pause for hands-on · ≈ 12 seconds]

> [S6 ▸ reveal 2 · the lesson]

The takeaway. *Different tasks deserve different first-passes.* Customer-facing artefacts — accuracy first. Internal exploration — usefulness first. If you only run one test, you'll get bitten by whichever one you skipped.

> [S7 ▸ slide change · t ≈ 5:30]

> [S7 ▸ reveal 1 · the monday move]

The Monday move. *Look at the last three AI outputs you reviewed.* For each, did you check accuracy, usefulness, or both? *Which one would have caused real damage if you missed it?* That's the test you should have run first.

> [S7 ▸ reveal 2 · close]

Next chapter — the three hallucination patterns. Confident fabrication. Plausible detail. Stale fact. *Specific shapes, targeted checks.*

> [end]
