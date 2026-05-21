# Chapter 4 — Few-shot patterns

**Course:** Prompting Mastery · **Chapter:** 04 · **Target duration:** ~7
min spoken

## Trainer persona
Andrew. Same direct tone. This is a debug-led chapter — the headline is
that few-shot can make outputs *worse* when used wrong, and that's
counter-intuitive enough to surprise people.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Few-shot prompting is the other technique most teams use wrong. The
common belief is that more examples in the prompt is always better. That
is — to be blunt — false. In many cases, few-shot makes outputs *worse*,
not better. Especially with modern models. Especially when the examples
are too similar to each other.

The reason it's worth a whole chapter is that the failure mode is
silent. Your outputs look reasonable. They're just structurally
identical in ways your users notice and you don't. So let's diagnose
that — and then talk about when few-shot actually earns its place.

> [S2 ▸ slide change · t ≈ 0:45]

> [S2 ▸ reveal 1 · the failure mode]

Here's the failure mode in one image. You give the model three examples
of how to summarize a customer feedback email. All three examples start
with *"The customer reported..."*. All three are exactly two sentences.
All three end with a single-word category tag in brackets.

You ask the model to summarize a fourth email. What does it do? It
returns a summary that starts with *"The customer reported..."*, is
exactly two sentences, ends with a single-word tag in brackets.

> [S2 ▸ reveal 2 · the trap]

Looks fine. Looks like it learned. But it didn't learn the underlying
task — *summarization*. It learned the *surface pattern of your
examples*. It memorized the rhythm. Run it on a hundred customer
emails, and you get a hundred summaries that all start with *"The
customer reported"*. Which is the same problem as having generic AI
content — your output sounds like one voice instead of capturing what
each customer actually said.

That's the failure mode. *Examples too similar to each other narrow
the model's output space*. The model overfits the rhythm and stops
generalizing. You optimized for the wrong thing.

> [S3 ▸ slide change · t ≈ 2:00]

> [S3 ▸ reveal 1 · the fix]

The fix is *vary the structure of your examples deliberately*. Not vary
the content — vary the *shape*. If you give three examples and they all
follow the same arc, the model treats that arc as part of the spec. If
your three examples each have a different shape — one starts with the
problem, one starts with the context, one starts with the resolution —
the model learns the *task*, not the *shape*.

> [S3 ▸ reveal 2 · concrete contrast]

Concrete contrast. Bad — three examples that each begin with the
customer's name and end with a sentiment label. The model will now
always begin with the name and end with the label. Good — three
examples where one begins with the issue, one begins with the action
taken, one begins with the customer context. Each has the same *task* —
summarize — but completely different *shape*. The model learns to
summarize. Not to template.

> [S4 ▸ slide change · t ≈ 3:15]

> [S4 ▸ reveal 1 · how many examples]

And how many examples? Less than you think. The Wei et al. data on this
is consistent across many tasks — three to five examples is the sweet
spot for most tasks. Ten examples is rarely better than five. Twenty
examples is often worse than five — because the prompt is now mostly
examples, the model has less attention budget for the actual input, and
you've narrowed the output space three different ways.

Default to three. Add a fourth or fifth only if the eval shows it
helps. If your prompt has seven, ten, twelve examples — that's a
candidate to shrink, not to grow.

> [S5 ▸ slide change · t ≈ 4:10]

> [S5 ▸ reveal 1 · when zero-shot beats few-shot]

There's also a class of tasks where zero-shot is actually better than
few-shot. Modern models — chat or reasoning — already know how to
summarize, classify, draft, extract. They've seen millions of examples
in pretraining. For these very common task types, *your three examples
are noise*, not signal.

When does few-shot still earn its place? When the *output format* is
unusual — a custom JSON schema the model hasn't seen, a specific markup
your team uses, a particular tabular layout. When the *domain* is
narrow — medical coding, legal citation, niche industry jargon. When
the *task definition itself* is ambiguous — *"classify these as
on-brand or off-brand"* needs examples because the model can't know
your brand without them.

> [S6 ▸ slide change · t ≈ 5:15]

> [S6 ▸ reveal 1 · interactive]

On the screen — a small examples panel. Drop in three to five examples.
A similarity score shows how varied your examples actually are. Try
making all three examples start with the same word. Watch the score
spike — your examples are too uniform. Now rewrite them with deliberate
variety. Watch the score drop — into the green.

> [pause for hands-on · ≈ 10 seconds]

> [S6 ▸ reveal 2 · the read]

Two scores in the panel — your example similarity, and the predicted
output similarity. When example similarity is high, predicted output
similarity is high too. That's the failure mode visualised. Vary the
inputs, vary the outputs.

> [S7 ▸ slide change · t ≈ 6:20]

> [S7 ▸ reveal 1 · the assignment]

One thing to do before chapter five.

Open the prompt in your library that has the most examples. Probably
seven, eight, ten of them. They probably look almost identical.

> [S7 ▸ reveal 2 · the rewrite]

Halve them. Aim for three or four examples maximum. Then deliberately
vary the structure of the ones you keep. Different opening word.
Different sentence length. Different ordering of fields. Same task —
different shape.

> [S7 ▸ reveal 3 · close]

Run the prompt on a varied test set. Compare the outputs. They should
read like distinct customers, not like the same template applied
twelve times. <em>That comparison is your eval.</em> Which is chapter
five. See you there — we make all of this measurable.

> [end]
