# Chapter 1 — Demystifying AI

**Course:** AI Literacy for Non-Technical Teams · **Chapter:** 01 · **Target
duration:** ~7 min · **Word count:** ~1,180 words (≈ 7:30 at ~155 wpm)

## Trainer persona (for the voice actor / TTS prompt)

A 12-year practitioner who has deployed AI into non-technical teams across
HR, Sales, and Operations at real companies. Mid-30s to mid-40s. Slightly
dry. Self-deprecating about her own early mistakes. Speaks to peers, never
*at* them. Uses *we* when describing common mistakes; *you* when handing
over agency. Region-neutral accent, neutral business English. Pace is
conversational — about 150–160 words per minute — with occasional small
pauses for emphasis. **No reading-voice cadence.** No teleprompter sing-song.

## How to read this file

The body is the spoken transcript — read it out loud, one continuous take.
Cues in the right margin (`[S2 ▸ reveal 1]`, etc.) tell the editor where
the slide / step transition fires inside the audio. These map to entries in
`audio/chapter-01/cues.json`.

A few notations:

- `[…]` = small natural pause (not silence — breath).
- `[—]` = the trainer catches herself / shifts direction. Keep the human
  edge; do not smooth it out.
- *italics in body* = light emphasis where the voice naturally lands.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Right, so. Before we touch a prompt, before we open Copilot or ChatGPT or
anything else — five minutes on what we're actually talking about. Because
I've watched a lot of teams roll out AI tools, and the same thing keeps
happening. Someone gets given a Copilot licence, they open it, they try it
once, it does something a bit off, and they decide *AI's not for them.*
Whole rollout stalls.

And almost always — *almost* always — the reason isn't the tool. It's that
nobody told them what kind of AI they were using. So they trusted the wrong
thing, or they didn't trust the right thing, and the whole thing fell apart
in week one.

So that's what this chapter is for. Not a deep technical thing. Just — what
kind of AI is what, in plain words, with examples you've already been using
for years.

> [S2 ▸ slide change · t ≈ 1:10]

Here's where I want to start. Three things — three things that are all
sitting inside the same Gmail account on your phone right now. You've
probably used all three this week without thinking about it.

> [S2 ▸ reveal 1 · "the red squiggle" · t ≈ 1:24]

First one: spell-check. The red squiggle under a misspelled word. That's
been there for, what, twenty years? You type *recieve*, it tells you you
meant *receive*. Done.

> [S2 ▸ reveal 2 · "Smart Reply" · t ≈ 1:38]

Second one: Smart Reply. You know the three little buttons Gmail offers —
*Thanks!*, *Sounds good!*, *I'll look into it.* You tap one, it sends. Took
about three seconds.

> [S2 ▸ reveal 3 · "Help me write" · t ≈ 1:52]

Third one: that *Help me write* button — Gemini, Copilot, whatever your
company has switched on. You type *draft a polite reply declining this
meeting*, it writes a whole paragraph for you.

> [S2 ▸ reveal 4 · callout "the point" · t ≈ 2:08]

Now — here's the thing. These are *all* called AI. The marketing on Gmail
will tell you all three are AI features. And technically, that's not wrong.
But they are wildly, *wildly* different things. They work differently. They
fail differently. And you should trust each of them in completely different
ways.

That's the chapter, right there. Knowing which is which.

> [S3 ▸ slide change · t ≈ 2:30]

So let me name them. Plainest possible language. Same three examples — just
the category label sitting underneath each one.

> [S3 ▸ reveal 1 · "Rules-based" · t ≈ 2:43]

The spell-check — that's *rules-based*. Somebody, years ago, wrote a list.
The list says *recieve* is wrong, the correct spelling is *receive*. When
you type *recieve*, a rule fires, you get the squiggle. There's no
thinking, no learning, no model. It's a lookup. Fast, predictable, almost
never wrong — but it can only ever catch things on the list.

> [S3 ▸ reveal 2 · "Machine learning" · t ≈ 3:05]

Smart Reply — the three little buttons — that's *machine learning*.
Different beast. Nobody hand-wrote those three replies. What Google did was
feed a model billions of email replies and let it learn which short
responses tend to fit which incoming emails. So when an email comes in
about a meeting, the model has seen this pattern a million times, it
predicts three likely short replies, you tap one. It's pattern matching at
scale. Still narrow — it only does this one job — but it *learned* the job
from data. Nobody programmed it by hand.

> [S3 ▸ reveal 3 · "Generative AI" · t ≈ 3:35]

The *Help me write* button — that's *generative AI*. That's the new thing.
The model wasn't trained to suggest three short replies. It was trained on,
basically, the whole readable internet — and now you can ask it to *write*.
Write anything, in any tone, of any length. Whole paragraphs that didn't
exist five seconds ago.

And, critically — it's also the most likely of the three to be confidently
wrong. Because it'll write *something* even when it shouldn't.

> [S3 ▸ reveal 4 · callout "the trade-off" · t ≈ 4:00]

So that's the spectrum. Rules, machine learning, generative AI. All three
are AI. All three are useful. They are not the same thing, and you don't
use them the same way. As you move across — left to right — capability goes
up, predictability goes down. Hold that thought. It's going to come back.

> [S4 ▸ slide change · t ≈ 4:18]

> [S4 ▸ reveal 1 · interactive panel · t ≈ 4:22]

Okay — pause here. I want you to actually try this. There's a little tool
on the screen. Type a sentence, anything — could be *thanks for the
update*, could be *I need to reschedule*, could be a sentence with a
deliberate typo. And you'll see three engines respond to it. One does the
rules thing. One does the ML thing. One does the generative thing.

What I want you to notice is *not* which one's better. None of them is
better in general — they're better at *different jobs*. The rules one will
catch a typo and ignore everything else. The ML one will pick the three
most-likely short replies. The generative one will rewrite your whole
sentence if you ask it to, and *add* things you didn't put in.

Go ahead. Try one of the chips. Or type something. I'll wait.

> [pause for hands-on — ≈ 8 seconds of silence in audio, or a music
> sting if you'd rather. Resume mid-flow.]

> [S4 ▸ reveal 2 · callout "notice" · t ≈ 5:00]

Right. So if you tried that — you probably noticed the generative one had
the most personality. It also probably went the furthest from what you
actually typed. Which is the trade-off. The more capable the engine, the
less predictable. And that matters when you're using it for real work.
Because the things you trust an *ML*-based suggestion for — short replies,
auto-complete — are not the things you trust a *generative* one for.

> [S5 ▸ slide change · t ≈ 5:25]

Three things I hear all the time. All three are wrong. All three slow
non-technical users down. And each one costs you something different.

> [S5 ▸ reveal 1 · myth 1 · t ≈ 5:36]

*Myth one.* AI is one thing. You hear this constantly. *Is AI good? Should
we use AI?* Like it's a single product. It's not. AI is a category, the way
*transport* is a category. Rules-based AI is a bicycle. Machine learning is
a car. Generative AI is — [—] I don't know, a helicopter. Loud, capable,
expensive, mostly overkill. You wouldn't ask *is transport good?* You'd
ask: *which kind, for what trip.* Same with AI.

> [S5 ▸ reveal 2 · myth 2 · t ≈ 6:00]

*Myth two.* AI is new. Also no. Spell-check is from the *1980s*.
Recommendation systems — what Netflix and Amazon use — those are early
2000s. AI has been doing useful work in your tools for twenty years. What's
new is *one branch* — the generative branch, the kind that writes things
and draws things. That's three years old. The rest is old enough to drive.

> [S5 ▸ reveal 3 · myth 3 · t ≈ 6:20]

*Myth three.* And this one's the most expensive: AI equals ChatGPT.
ChatGPT is one product, from one company, in one category, with one
interface. If your only mental model of AI is the ChatGPT chat box — you're
missing most of what AI is doing inside the tools your company is already
paying for. The AI in Excel's *Analyze Data* button. The AI in LinkedIn's
*People you may know.* The AI in your CRM's lead-scoring. None of that
looks like ChatGPT. All of it is AI.

> [S6 ▸ slide change · t ≈ 6:45]

Here's why I'm hammering this. And then I'll let you go.

> [S6 ▸ reveal 1 · failure A · t ≈ 6:52]

If you don't know what *kind* of AI you're using, you trust them all the
same. Two ways that goes wrong. Equal and opposite, both expensive. The
first one — too much trust. You treat a generative answer the way you'd
treat a spell-check answer. You ship a customer reply with a hallucinated
price in it. You email a client a meeting time the model just *made up*.
You quote a regulation that doesn't exist.

> [S6 ▸ reveal 2 · failure B · t ≈ 7:10]

The other one — too little trust. You stop using *any* AI because the
generative one lied to you once. You go back to handwriting summaries of
fifty exit interviews. You bring your team a story about how *AI doesn't
work*, and the whole rollout stalls. Both of these happen. Both cost real
money. The cause is the same: not knowing which kind you were dealing with.

> [S6 ▸ reveal 3 · callout "the one thing" · t ≈ 7:25]

The whole point of this chapter — the only thing I want you to walk away
with — is that *AI is a category, not a tool.* Knowing which kind you're
using is the first thing. Everything else in this course assumes you can
tell the three apart.

> [S7 ▸ slide change · t ≈ 7:38]

So — one thing to do before the next chapter. Real action.

> [S7 ▸ reveal 1 · checklist 1 · t ≈ 7:42]

Open whatever email or document tool you use at work. Outlook, Gmail, Word,
Docs. Spend two minutes looking for AI features. You'll find more than you
expected. There'll be one in the toolbar. There'll be one in the right-hand
sidebar. There'll *probably* be one in a settings menu you've never opened.
Make a list. Just names — what's the feature called, what does it do.

> [S7 ▸ reveal 2 · checklist 2 · t ≈ 7:58]

Then tag each one. Rules, ML, or generative. You won't always be sure, and
that's fine. You'll be right more often than you expect.

> [S7 ▸ reveal 3 · checklist 3 · t ≈ 8:08]

Bring that list into chapter two. We're going to use it as the starting
point for your first real prompt.

That's it. Go look. See you in the next one.

> [end · t ≈ 8:18]

---

## Notes for the recording session

- **Don't smooth the openings.** Each slide change should land mid-thought.
  The opening "Right, so." is intentional. So is the "[—] I don't know, a
  helicopter" stumble in myth 1 — keep it.
- **The pause on slide 4 is real.** The transcript has an 8-second
  hands-on gap. Either leave it as silence (preferred — feels like a real
  trainer waiting) or fill it with a short musical sting. Do not narrate
  through it.
- **No closing summary.** The chapter ends on the action. *"Go look. See
  you in the next one."* That is the close. Resist the urge to add a
  recap line at the end.
- **Numbers said human.** "Twenty years", not "approximately two decades".
  "Three years old", not "introduced in 2022". The dates can sit on the
  slide; the trainer's voice rounds.
- **One total take per chapter** — not seven slide takes stitched
  together. That's the whole reason we picked timestamp-fire over
  per-slide MP3s.

## Open call-outs for review

1. **Length:** target was ~7:00. Actual ~7:30–7:45 depending on pace.
   Comfortable to trim ~30 seconds if you'd rather hit the 7-min mark
   exactly. Suggested trim: the second sentence of the rules-based
   definition in S3 reveal 1 (*"There's no thinking, no learning, no
   model."* is slightly redundant with what follows).
2. **The helicopter metaphor.** Lands well in writing but worth checking
   on read-aloud. Backup metaphor: *"Generative AI is a sports car — fast,
   shiny, easy to crash."* Pick before recording.
3. **The pause on slide 4.** Confirm whether you want silence or a sting.
   My lean: silence.
