# Chapter 5 — Evaluating outputs

**Course:** Prompting Mastery · **Chapter:** 05 · **Target duration:** ~7 min spoken

## Trainer persona
Andrew. Tool-led tone — *"here's the thing I actually open in my terminal"* rather than theoretical.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

This is the chapter that separates teams that ship reliable prompt-driven products from teams that ship vibes. The technique is older than the term *evals* — we've been writing tests for code for forty years. What changed in 2026 is that the *tooling* finally exists for prompts. So let me show you what good looks like.

> [S2 ▸ slide change · t ≈ 0:30]

> [S2 ▸ reveal 1 · the vibe-check fail]

Here's the moment every team eventually hits. You write a prompt. It works for you. It works on your laptop. You ship it. A teammate runs it on slightly different data — and it breaks. Subtly. The output looks fine, but the second name is wrong, or the date is in the past, or the JSON is valid but missing a field.

> [S2 ▸ reveal 2 · what just happened]

What just happened is — your prompt was tuned to your own data, your own examples, your own gut feel. There was no shared definition of *what good looks like*. And that means there's no way to detect a regression when someone changes the prompt — or when the model itself silently updates. Vibe-check works for one person. It fails at team scale, every time.

> [S3 ▸ slide change · t ≈ 1:35]

> [S3 ▸ reveal 1 · what an eval is]

An eval is three things bundled together. *One* — a set of test cases. Real inputs you've seen, with the right outputs the model should have produced. *Two* — a scoring function. How you grade the output against expected. Sometimes exact match. More often partial — *contains the key fact*, *under N words*, *valid against schema*, *passes a model-graded rubric*. *Three* — a runner. Something that runs your prompt against all the test cases, collects results, and tells you the pass rate.

That's it. Test cases. Scoring. Runner. Same shape as unit tests, applied to prompts.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · the tooling]

The tool I'd reach for in 2026 is *Promptfoo*. Open-source. Apache 2.0. Used by three hundred and fifty thousand developers and more than a quarter of the Fortune 500. OpenAI acquired the company on March 9 this year — which is the strongest signal you'll get that prompt eval is mainstream.

> [S4 ▸ reveal 2 · alternatives]

OpenAI Evals is also still around — lower level, more flexible, useful when you want to write custom scoring. DeepEval is another open-source option, especially good for RAG-style evaluations. Most teams end up with Promptfoo plus one custom thing. That's fine.

What matters is — your prompts get a test suite. They go in the same repo as your code. They run in your CI when someone changes a prompt. Regressions are caught before they hit production, not after.

> [S5 ▸ slide change · t ≈ 4:00]

> [S5 ▸ reveal 1 · what a good test set looks like]

Here's where most teams get this wrong. They build an eval with ten happy-path cases. Everything passes. They ship. Then production breaks on the edge cases. The eval was *too easy*.

A good test set is a third happy path, a third edge cases, and a third *adversarial* — inputs deliberately chosen to break the prompt. Empty fields. Unicode. Extremely long inputs. Inputs with prompt-injection attempts — chapter seven will cover that explicitly.

> [S5 ▸ reveal 2 · the size question]

Twenty to forty cases is usually enough to start. You don't need a thousand. You need *the right cases* — ones that map to the failures you actually see in production. Pull cases from your support tickets. From the bugs your team filed. From the times someone said *"the model got it wrong on this one"*. Those are your eval cases. Write the answer you wish the model had given. Commit it.

> [S6 ▸ slide change · t ≈ 5:30]

> [S6 ▸ reveal 1 · interactive]

On the screen — a mini eval runner. Three prompts. Five test cases each. Click *run* and watch each prompt scored against the cases. Notice the per-case pass/fail. Notice the per-prompt pass rate. Try editing one of the assertions — see how it changes which cases pass. *This is what your team's eval suite looks like, just at production scale.*

> [pause for hands-on · ≈ 10 seconds]

> [S7 ▸ slide change · t ≈ 6:30]

> [S7 ▸ reveal 1 · the assignment]

One thing to do before chapter six. Pick one prompt your team uses repeatedly — the one your on-call rotation has opinions about. Author five assertions for it in Promptfoo. *Five.* Not fifty. Pull cases from real failures you've seen.

> [S7 ▸ reveal 2 · close]

Commit the eval file next to the prompt. That commit is the moment prompting becomes engineering on your team. See you in chapter six — prompt libraries, which is what an eval set turns into once you have ten of them.

> [end]
