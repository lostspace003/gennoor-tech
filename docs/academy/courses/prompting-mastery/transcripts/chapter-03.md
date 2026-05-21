# Chapter 3 — Chain-of-thought reasoning

**Course:** Prompting Mastery · **Chapter:** 03 · **Target duration:** ~7
min spoken

## Trainer persona
Andrew. Direct, slightly historical (since we're tracing CoT back to its
2022 origins) but pragmatic about the trade-off.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chain-of-thought is the technique that everybody knows and most teams
still over-use. It was a huge result in 2022. It's a more nuanced
trade-off in 2026. And the reason it matters is — getting the
calibration wrong costs you three to five times the latency for no real
gain. That is a real cost when you're running thousands of calls a day.

So that's this chapter. The history. The trade-off. And the decision
tree for when to use it.

> [S2 ▸ slide change · t ≈ 0:35]

> [S2 ▸ reveal 1 · the original result]

January 2022. Researchers at Google — Wei and colleagues — publish a
paper that's now cited a few thousand times. The headline result was
this. Take a math benchmark called MultiArith. Run it on text-davinci-002
— the model of the day. Standard prompt accuracy: seventeen-point-seven
percent.

Now add four words to the prompt. *Let's think step by step.* That's it.
Four words. No fine-tuning. No new model. Same data.

> [S2 ▸ reveal 2 · the jump]

Accuracy jumped from seventeen-point-seven percent to seventy-eight
point seven percent. Roughly a four-point-five-times improvement. Just
from telling the model to reason out loud before answering.

That result reshaped prompting. Everyone added *let's think step by
step* to every prompt. Some teams added it as a default. It became
folklore. And — for the model of 2022 — that was the right call.

> [S3 ▸ slide change · t ≈ 1:50]

> [S3 ▸ reveal 1 · the trade-off in 2026]

Here's what changed. Two things, actually.

One — the latency cost is real and unavoidable. When the model reasons
out loud before answering, it generates *all of that text*. Tokens have
weight. CoT adds three to five times the latency on the same task,
because the model has to produce hundreds of reasoning tokens before
its final answer.

For batch jobs that run overnight, three to five times doesn't matter.
For an interactive assistant where users are watching the cursor
blink — it absolutely matters. Sub-second response is the bar; CoT
makes that impossible on most models.

> [S3 ▸ reveal 2 · the reasoning-model shift]

Two — the reasoning models. GPT-5, the o-series, Claude 4 Opus,
Gemini 2 Pro reasoning. These models *bake CoT in* at the architecture
level. The model reasons internally, doesn't show you the chain by
default, and exposes a `reasoning_effort` knob — low, medium, high —
that controls how much it thinks.

On reasoning models, you don't write *let's think step by step*. You
write the goal. You set `reasoning_effort` to the level that matches
the task. The model handles the rest. The 2022 advice is now built
into the API.

> [S4 ▸ slide change · t ≈ 3:15]

> [S4 ▸ reveal 1 · the 2x2]

Two by two. Two axes — task complexity, and model class. Four
quadrants. Each one has the right call.

> [S4 ▸ reveal 2 · simple task chat]

Simple task on a chat model. Sentiment classification. Short
summarization. Format conversion. *Do not use CoT.* You don't need it.
The latency cost buys you nothing. Pay attention to the prompt shape,
constrain the output, ship.

> [S4 ▸ reveal 3 · complex task chat]

Complex task on a chat model — multi-step math, ambiguous business
logic, anything where the model could plausibly skip a step. Here CoT
earns its cost. Add *let's think step by step* — explicitly. Inspect
the chain. The latency hit is real but the accuracy gain is real too.

> [S4 ▸ reveal 4 · simple task reasoning]

Simple task on a reasoning model. Don't waste the reasoning model.
Either downshift to a chat model, or set `reasoning_effort: low` so
the model doesn't burn tokens you don't need. The cost difference is
significant — reasoning at high effort can cost ten times what the
same task costs on a chat model.

> [S4 ▸ reveal 5 · complex task reasoning]

Complex task on a reasoning model. This is where the new models earn
their keep. Set `reasoning_effort: high` and let the model think.
Don't write *step by step* — that's redundant and noisy. Define the
goal, the constraints, the success criteria, and step back.

> [S5 ▸ slide change · t ≈ 5:00]

> [S5 ▸ reveal 1 · the over-use trap]

The most common mistake — and I see it in production code every week —
is leaving *let's think step by step* in every prompt by default. It
got there in 2023 for the right reason and never left.

You can audit this in your codebase right now. Search for *step by
step*. Search for *let's think*. Every match is a candidate for review.
On simple tasks on modern chat models, removing it speeds you up with
no accuracy loss. On reasoning models, removing it is *required* — the
model treats your micro-management as noise.

> [S6 ▸ slide change · t ≈ 5:40]

> [S6 ▸ reveal 1 · the interactive]

The matrix on the screen. Click any quadrant. See the prompt that
belongs there, the latency profile, the cost profile. Notice — the same
underlying task, four different correct prompts depending on what model
you're calling and how hard it is.

> [pause for hands-on · ≈ 8 seconds]

> [S7 ▸ slide change · t ≈ 6:25]

> [S7 ▸ reveal 1 · the assignment]

One thing to do before chapter four.

Identify your slowest LLM call in production. The one you've capped
with a timeout. The one users complain about.

> [S7 ▸ reveal 2 · the diagnosis]

Categorise it. Simple or complex task? Chat or reasoning model? Look
at the prompt — is there CoT in there, explicit or by default?

Now correct it. If it's simple and CoT is there — pull it out. If it's
complex and you're on a chat model — keep CoT but inspect the chain.
If it's complex and you can move to a reasoning model — do that and
set `reasoning_effort` deliberately, not to high by reflex.

> [S7 ▸ reveal 3 · close]

Measure latency before and after. That measurement is the start of an
eval — chapter five, two chapters away. See you in chapter four —
we're going to talk about few-shot examples, which is the other
technique most teams use wrong.

> [end]
