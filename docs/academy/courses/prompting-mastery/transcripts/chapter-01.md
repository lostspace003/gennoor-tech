# Chapter 1 — Prompting principles

**Course:** Prompting Mastery · **Chapter:** 01 · **Target duration:** ~7
min spoken · **Word count target:** ~1,150 words

## Trainer persona

Andrew. Senior practitioner who's deployed prompt systems in production
at real companies. Direct. Comfortable with code references and
trade-off language. Slightly less warm than Emma — leans into the
technical confidence of someone who knows the rough edges. Region-neutral.

## How to read this file

Body below is the spoken transcript. Cue markers map to slide / step
transitions and are stripped before synthesis.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Right. If you're here, you've done basic prompting. You know about
context. You know about specificity. You're getting six or seven out of
ten from ChatGPT, Claude, Copilot — every day. Good.

The reason we're spending an hour on this — the reason there's a whole
course called Prompting Mastery sitting between Foundations and
Builder — is that *prompting changed in 2026.* The 2023 advice is now
half-right at best. And if you don't know what shifted, you're spending
more tokens, getting more variance, and missing the upgrades the new
models actually shipped.

So that's chapter one. The shifts. The five principles that survived.
And the one habit that you have to stop doing.

> [S2 ▸ slide change · t ≈ 0:55]

> [S2 ▸ reveal 1 · two prompts]

Let me show you two prompts. Same task. Both are real. Both were written
by good people.

Prompt one was written in 2023. It's two hundred and fifty words long.
It tells the model what role to play. It tells the model how to think,
step by step. It gives four examples. It says — *"first, identify the
key entities. Then, classify them. Then, format the output as
follows…"* — and then provides the exact format. The author is careful.
The author is thorough.

> [S2 ▸ reveal 2 · the 2026 version]

Prompt two was written in 2026. Same task. It's forty words. It says
*"here's the data. Here's what good output looks like. Return JSON
matching this schema. Use as much reasoning as you need."* That's it.
Forty words instead of two-fifty.

Now here's the part you have to sit with. On the current generation of
models — GPT-5, Claude 4-class, Gemini 2-class — *the forty-word prompt
performs better.* Not the same. Better. And it costs less. And it
returns faster.

So what happened?

> [S3 ▸ slide change · t ≈ 2:00]

> [S3 ▸ reveal 1 · the model split]

What happened is — the models split into two families. There used to be
one family: chat models. You spoke to them like an apprentice. You broke
problems into steps. You gave examples. You corrected as you went.

Now there are two families. Chat models — still here, still useful —
and *reasoning models.* And reasoning models are different.

> [S3 ▸ reveal 2 · OpenAI's framing]

OpenAI's own GPT-5 prompting guide says it directly. Quote — *"A
reasoning model is like a senior co-worker. You give them a goal to
achieve and trust them to work out the details."* That sentence is the
whole 2026 shift in one line.

You don't break the task down for a senior co-worker. You don't tell
them which order to think in. You give them the goal, the constraints,
the success criteria, the data — and you get out of their way. The
reasoning chain happens inside the model. The `reasoning_effort` knob
lets you tune how much of it.

The 2023 prompt — two hundred and fifty words walking the model through
the steps — is now telling a senior co-worker how to tie their shoes.
It's not just wasted tokens. It's actively *narrowing* the space the
model would otherwise have explored. The model does *worse* with more
of your help.

> [S4 ▸ slide change · t ≈ 3:30]

> [S4 ▸ reveal 1 · the five principles]

So — here are the five principles that survived 2026. These work on
both model families.

> [S4 ▸ reveal 2 · principles 1-5]

One. **Define outcomes, not steps.** What does done look like. What does
good look like. What does failure look like. Leave the path to the
model when it's a reasoning model. Give the path explicitly only when
it's a chat model AND the path is structurally important.

Two. **Bring the source.** The model doesn't know your meeting notes.
Doesn't know your CRM. Doesn't know your contract. Paste the source.
This was true in 2023 and it's twice as true now, because the modern
models have larger context windows that reward bringing more relevant
material.

Three. **Constrain the output shape.** Not the content — the shape.
JSON schema. Markdown sections. Word count. If you don't tell the model
the shape, you'll get whatever shape it feels like, and it changes run
to run. Chapter two is the whole chapter on this.

Four. **Examples — sparingly, and varied.** Few-shot still works. But
fewer than you think, and *more varied* than you think. We do a whole
chapter on few-shot in chapter four.

Five. **Test like code.** Prompts are code. Code has tests. There's a
chapter on this in chapter five. The teams that ship prompt-heavy
products without eval suites in 2026 are the teams writing post-mortems
in 2027.

> [S5 ▸ slide change · t ≈ 5:00]

> [S5 ▸ reveal 1 · the one habit to drop]

One habit to drop. Walking the model through steps in the system prompt.
On reasoning models, this hurts. On chat models, it sometimes helps and
sometimes hurts — depending on whether the task structurally needs that
order or whether you're micro-managing.

Default position: stop doing it. Add steps back only when you've
measured that adding them improved an eval, not because adding them
*felt* like the right move.

The temptation to over-specify comes from a 2022 reflex. In 2026 it
narrows the model's search space. Less is more, when the model is more.

> [S6 ▸ slide change · t ≈ 5:55]

> [S6 ▸ reveal 1 · interactive]

The panel on the screen shows the same prompt for the same task. The
toggle switches between *chat-model style* and *reasoning-model style*.
Look at the structural differences. Notice what's different — and also
notice what's the same. Goal, constraints, source, output shape — those
are constant. The micromanagement of steps — that's what changes.

> [pause for hands-on · ≈ 8 seconds]

> [S7 ▸ slide change · t ≈ 6:35]

> [S7 ▸ reveal 1 · the assignment]

One thing to do before chapter two.

Open your prompt library. Pick the prompt you use most often. The one
you've copy-pasted twenty times. Look at it honestly. How many of those
words are *micro-managing the steps* the model should take?

> [S7 ▸ reveal 2 · the rewrite]

Now rewrite it. Once for chat models — keep the steps where they're
structurally needed, drop the rest. Once for reasoning models — drop
all the step-by-step, keep goal + constraints + source + output shape.

> [S7 ▸ reveal 3 · close]

Two prompts. Same task. Different decades. Different vintages of the
same idea. Run both. See which one ships better answers on your data,
on the models you actually use. That's the start of an eval set — which
is chapter five. See you in chapter two — we're going to make the model
return JSON that doesn't break your code.

> [end]

---

## Notes for the recording session

- The "senior co-worker" line on S3 reveal 2 — read it like you're
  quoting someone, slight pause before *"quote — A reasoning model is
  like a senior co-worker"*. It's the signature moment.
- S4 reveals 2 — the five principles get a beat between each one.
  Numbered cadence. Don't rush.
- Pace S7 reveals deliberately — they're the chapter's payoff.
- Trailer for ch2 at the end ("we're going to make the model return JSON
  that doesn't break your code") — sells the next chapter; keep it.

## Open call-outs for review

1. The "2027 post-mortems" line — mildly snarky. Drop if you want the
   tone calmer.
2. Length came in right around target (~1,150 words → ~7:30 spoken,
   ~9 min with locked pacing).
