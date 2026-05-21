# Chapter 8 — Making your library stick

**Course:** Prompting Mastery · **Chapter:** 08 · **Target duration:** ~7 min spoken

## Trainer persona
Andrew. Closing chapter — implementation-cadence tone. *"This is the meta-skill."* No capstone language. The whole chapter is the Monday moment.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Last chapter. Seven chapters of prompting craft. None of it matters if the library you build dies in month three. Which is what happens to most prompt libraries. So this chapter is the meta-skill — how to make any of this actually persist in a real team, with real turnover, real deadlines, and real competing priorities.

> [S2 ▸ slide change · t ≈ 0:30]

> [S2 ▸ reveal 1 · the library that died]

You've probably seen this. A senior engineer at your company set up a prompt library in 2024 because they read a Twitter thread. There's a folder somewhere. There are eight prompts in it. Three of them are out of date. Two refer to a model that's been deprecated. One has no eval set. Nobody on the team has touched the folder in four months.

That library is dead. It exists as a directory but it's not used. New engineers wrote their own prompts in their own files. The library got bypassed. *That's the failure mode this chapter is about.*

> [S3 ▸ slide change · t ≈ 1:25]

> [S3 ▸ reveal 1 · the four things]

Four things determine whether your library lives past month three. *One* — a named owner. *Two* — a weekly review ritual. *Three* — evals in CI. *Four* — a contribution path that's frictionless.

Each one matters. Skip any one and the library decays. Skip two and it's dead by month two. Let's go through them.

> [S3 ▸ reveal 2 · owner]

Owner. We covered this in chapter six. A *person*, not a team. The owner doesn't write every prompt — anyone writes prompts. The owner *reviews* every change. PRs to the prompts directory go to that person. They keep the library coherent. Pick a senior engineer who actually uses LLMs every day. Not a manager. Not a delegate.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · weekly review]

Weekly review ritual. Fifteen minutes. Same time every week. The owner walks through every prompt that *changed* in the last week — what changed, why, did the eval rate move. Calls out anything that smells off. *That's it.* Fifteen minutes.

The reason this matters is that prompts drift silently. The model behind them improves; their phrasing stops being optimal. Schemas evolve; downstream callers change. Without a weekly checkpoint, nobody notices the drift until something breaks. With the checkpoint, drift gets named and fixed. *Same model as code review, applied weekly.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · evals in ci]

Evals in CI. Chapter five covered the evals. This is where they earn their keep. Every PR that touches a prompt runs the prompt's eval suite in CI. If the pass rate drops, the PR gets blocked. *Not warned. Blocked.* The same way a failing unit test blocks a code PR.

Without CI gating, evals become decorative. People look at them once when the prompt ships and never again. With CI gating, evals become the contract — *this prompt promises a certain quality level, and we'll catch any regression before merge.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · frictionless contribution]

Frictionless contribution. The fourth thing — and the one most teams get wrong. If adding a prompt to the library is harder than writing a one-off string constant in code, *people will write the string constant*. Every time. They're not lazy — they're rational. The library has to be the path of least resistance.

What that means concretely. A scaffold script. *"Create a new prompt"* generates the four files automatically. Sensible defaults. Empty eval that just runs the prompt once. Auto-add to CODEOWNERS. The whole thing should take ninety seconds. If it takes ten minutes, nobody contributes.

> [S7 ▸ slide change · t ≈ 5:30]

> [S7 ▸ reveal 1 · the rollout plan]

So — the four-week plan to build a library that survives. Week one — set up the directory, add three existing prompts, assign owners. Week two — write evals for those three. Set up CI gating. Week three — write the scaffold script. Make contribution take ninety seconds. Week four — first weekly review. The pattern is locked.

> [S7 ▸ reveal 2 · interactive]

The downloadable plan on the screen — customize team size, click download, get a markdown checklist with the right scope for your team. Print it. Tape it next to the owner's monitor.

> [pause for hands-on · ≈ 10 seconds]

> [S8 ▸ slide change · t ≈ 6:30]

> [S8 ▸ reveal 1 · the assignment]

Whole chapter is the Monday moment.

Pick the owner. *Today.* A real name. Send them a message right now. *"Hey — I'm proposing you own our team prompt library. It's about thirty minutes of work to spin up, then fifteen minutes a week to review. Are you in?"*

> [S8 ▸ reveal 2 · close]

That's the move that turns this whole course into something real. *Pick the owner, schedule the first review, ship the scaffold.* The library lives because someone owns it.

That's the course. Eight chapters. Prompting principles. Structured outputs. Chain-of-thought. Few-shot. Evals. Libraries. Adversarial. And this — making it stick.

Close this tab. Open your team chat. Send the message. *Go.*

> [end]
