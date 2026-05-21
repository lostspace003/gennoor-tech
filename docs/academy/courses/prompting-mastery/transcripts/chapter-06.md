# Chapter 6 — Prompt libraries and reuse

**Course:** Prompting Mastery · **Chapter:** 06 · **Target duration:** ~6 min spoken

## Trainer persona
Andrew. Implementation-led — show what a real prompt library looks like as a directory structure.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

If chapter five was about testing prompts, this chapter is about *organizing* them. Specifically — how does a team keep track of, version, own, and reuse prompts across a codebase that grows from five prompts to fifty to five hundred. The answer, as you probably guessed by now, is the same answer we use for code. Folders, files, version control, CHANGELOG, owners. Prompts ARE code. Treat them like code.

> [S2 ▸ slide change · t ≈ 0:40]

> [S2 ▸ reveal 1 · where prompts live today]

Quick honest survey. Where do prompts live in your team today? My guess based on what I've seen across companies — they live in Slack messages. In Notion pages. In whoever's-laptop. In the chat history of the engineer who wrote them. Maybe — *maybe* — in a `prompts.py` file with a hundred string constants and no comments.

That works at five prompts. It fails at fifty. By the time you have five hundred, nobody knows which prompt is the current one, which is deprecated, what each one is *for*, or whether any of them have evals.

> [S3 ▸ slide change · t ≈ 1:25]

> [S3 ▸ reveal 1 · the file layout]

Here's what a real prompt library looks like on disk. A `prompts/` directory at the root of your repo. Inside, one folder per prompt. Each prompt folder has four files. *One* — the prompt itself, in markdown or YAML. *Two* — the schema, if you're using Structured Outputs from chapter two. *Three* — the eval set, the Promptfoo config from chapter five. *Four* — a CHANGELOG.md tracking every change with the reasoning.

Four files per prompt. That's the unit. Now you can search the codebase for *"who's using the customer-tag prompt"*, *"when did we change this prompt"*, *"what does this prompt promise to return"*. Each question has a file you can open.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · ownership]

Now — ownership. Every prompt has an owner. A named person. *Not* a team. A team owns nothing in practice. A person owns something. Put their name in the CHANGELOG entry. Put their email in a CODEOWNERS file. When the prompt's eval starts failing in CI, the owner gets paged.

That sounds dramatic. It's not. It's the same model as code ownership. Without an owner, every prompt becomes everyone's problem and nobody's responsibility. With an owner, drift gets fixed when it happens — not three months later when it's already broken.

> [S5 ▸ slide change · t ≈ 3:25]

> [S5 ▸ reveal 1 · versioning]

Versioning. You will change prompts. Often. Some changes are safe — wording tweaks, formatting fixes. Some changes are *load-bearing* — different schema, different examples, different model. The load-bearing ones need a version bump. Semantically — major when the output shape changes, minor when behavior changes, patch when wording changes.

Why does this matter? Because *callers depend on prompts*. If your scoring prompt always returned a `low / medium / high` enum and you change it to `1-10 integer`, every downstream caller breaks. Version bumps signal *"this is a breaking change, update your call site"*. Without versions you have silent contract violations and on-call pages.

> [S6 ▸ slide change · t ≈ 4:25]

> [S6 ▸ reveal 1 · interactive]

The interactive on screen — a sample prompt library. Click any prompt to see the four files. Notice the CHANGELOG — every change has a date, an owner, and a one-line *why*. Notice the eval pass rates over time. That's the visualization of *prompts being engineered*, not vibed.

> [pause for hands-on · ≈ 10 seconds]

> [S7 ▸ slide change · t ≈ 5:10]

> [S7 ▸ reveal 1 · the assignment]

One thing to do before chapter seven.

Create a `prompts/` directory in your team repo. Just create the folder. Then take *three* prompts from wherever they currently live — Notion, Slack, whoever's laptop — and move them in. Each gets the four-file treatment. Even a one-line CHANGELOG. Even a placeholder eval.

> [S7 ▸ reveal 2 · close]

That commit is the start of a library. By the time you have ten in there with evals, you'll never go back to the Slack-snippet model. See you in chapter seven — adversarial prompts, prompt injection, OWASP LLM Top 10. *EchoLeak, CamoLeak, real CVEs.* The chapter most teams ignore until it's too late.

> [end]
