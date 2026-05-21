# Gennoor Academy — Course Build Plan

> The reusable standard for building any of the 28 pending Academy courses.
> Course-specific work (research, chapter design, transcript voice) is *not*
> in this file — it lives in each course's own `research-dossier.md` and
> chapter assets. This file is the *standard*.

---

## 1. Why this plan exists

The Academy catalog advertises 43 courses. Only 15 are actually shipped (the
`/ai-academy/<slug>` routes with real slide decks + audio). The other 28 are
metadata-only shells — `status: 'available'` in code, no content underneath.

The standard below exists so the remaining 28 are built to a single bar of
quality, with course-specific dynamics — *not* a parallel script run over the
same template.

---

## 2. The non-negotiables

These apply to every course. If a chapter violates one of these, it doesn't
ship.

1. **Real research only.** Every cited statistic, case, or claim comes from a
   primary source pulled during the dossier phase — never from training-memory
   guesses. If a number can't be traced to a current source, it doesn't go on a
   slide.
2. **Implementation over abstraction.** Every chapter must end with one
   *do-this-tomorrow* moment. No capstone language. The word "capstone" is
   banned from titles and transcripts.
3. **No pause-play feel.** Audio is one continuous take per chapter, with slide
   reveals fired on timestamps inside that single MP3 — not one MP3 per slide.
   (See §6.)
4. **Trainer voice, not narrator voice.** Transcripts read as a human
   practitioner teaching, complete with contractions, asides, self-correction,
   and named references. No "in this chapter we will cover", no "as you can see
   on the slide", no closing recap.
5. **Course-specific dynamics.** Each course's research dossier, chapter arcs,
   interactives, and trainer persona are chosen from the material — not
   repeated across courses. A governance course leans incident-led; a builder
   course leans tool-led; a sales course leans demo-led.
6. **Course-track theme palette only.** No defaulting to MS blue for
   non-Microsoft courses. Each course declares its own `theme` palette in
   `src/config/courses.ts` before the first chapter is built.

---

## 3. The build phases (in order)

Each course goes through these five phases. Phase 1 ships to the user for
review before phase 2 starts; phase 3 (chapter 1) ships for review before
phase 4 starts. Late-stage rework is expensive; gates exist to catch issues
early.

### Phase 1 — Research dossier

Output: `docs/academy/courses/<slug>/research-dossier.md` with the structure
in §4. No HTML, no transcripts written yet.

The dossier is gated on user review of:
- the citations bank (every named source with full URL, date, key quote),
- the numbers table (every stat that will appear on a slide, with citation),
- the named incidents (story-ready paragraphs the trainer will speak),
- the negative list (claims rejected during research),
- any open questions that need a user decision.

### Phase 2 — Chapter blueprint

Output: appended to the dossier as a `## Chapter blueprint` section. For each
chapter: teaching arc, signature moment, interactive concept, Monday moment.

Per-chapter teaching arcs are chosen from a small set — *not the same one
across all chapters of a course*:

- **Contrast-led** — open with two side-by-side things the learner already
  knows; the chapter is built off that one comparison.
- **Incident-led** — open with a real, named case; pull lessons back to the
  learner's day-to-day.
- **Tool-led** — open the tool, walk through; commentary lives in the cursor.
- **Demo-led** — bad version first, refined live, framework only after.
- **Library-led** — the chapter *is* the reference (recipe-book style).
- **Implementation-cadence** — Monday, Tuesday, Wednesday — what to do, what
  to expect, what failure looks like.

### Phase 3 — Chapter 1 pilot build

Output:
- `public/courses/<slug>/chapters/chapter-01-<slug>.html` — slide deck.
- `public/courses/<slug>/audio/chapter-01/chapter-01.mp3` — one continuous MP3.
- `public/courses/<slug>/audio/chapter-01/cues.json` — timestamp map.
- Course entry in `src/config/courses.ts` with `theme`, `chapters[]`.
- Transcript draft in `docs/academy/courses/<slug>/transcripts/chapter-01.md`.

Chapter 1 ships to the user for review of *tone*. If approved, phase 4
proceeds at the same bar; if not, the trainer voice/cadence is adjusted once
and re-piloted.

### Phase 4 — Chapters 2–N

Same shape as phase 3, all chapters built. Each chapter still gets its own
interactive (not the same one repeated), still gets its own teaching arc.

### Phase 5 — Polish + recap

- Read-aloud pass on all transcripts.
- Monday-pass on every chapter: would a smart person at their desk now know
  one specific thing to do? If not, rewrite the close.
- E-E-A-T pass — outbound links woven into the prose where the trainer cites
  a source.
- Smooth scroll, scroll-reveal, hover lift, consistent transitions on any
  embedded UI per the project's standing polish bar.
- Status flip: `lastUpdated`, related-course wiring, catalog appearance check.

---

## 4. Research-dossier structure (template)

Every course's `research-dossier.md` has these sections in this order:

1. **Citations bank** — numbered `[1]` through `[N]`. Each entry: source title,
   author/org, publication date, exact URL, the key quote or finding that will
   be used. Sources must be primary where possible (regulator's own page,
   vendor's own docs, court ruling, peer-reviewed paper, named-author analyst
   note). Secondary sources allowed only when primary is paywalled or behind
   auth.
2. **Numbers I'll actually use** — a table: stat, the chapter it appears in,
   the citation ID from the bank. If a number isn't in this table, it doesn't
   make it onto a slide.
3. **Named incidents** — story-ready paragraphs the trainer will speak,
   tagged with citation IDs. These are the *moments* of the course; they get
   drafted in dossier so we can stress-test the narrative before HTML.
4. **The negative list** — claims deliberately not made, with brief reason.
   Forces the team to commit to what we *won't* repeat from the AI-content
   slop that surrounds this topic.
5. **Open questions** — anything that needs a user decision before chapter 1
   is built (an unverifiable figure, a voice choice, a regional anchor).
6. **Chapter blueprint** *(added in Phase 2)* — per-chapter teaching arc,
   signature moment, interactive concept, Monday moment.
7. **Source-to-chapter map** — which citation IDs land in which chapter.

---

## 5. Transcript voice — the rules

These are applied identically across every course, but the trainer *persona*
varies (see §7). The rules govern cadence, not voice.

- **Open mid-thought.** Never *"In this chapter we'll cover…"*. Open as if
  picking up from a moment ago.
- **Slide changes are invisible.** The trainer never says *"next slide"*, *"as
  you can see"*, or *"on this slide"*. Audio continues; the slide updates
  underneath the words.
- **Real stumbles stay in.** *"Hold on — that's not quite right. Let me say
  it differently."* Difference between a trainer and a teleprompter.
- **Asides that aren't on the slide.** *"By the way — this is the part nobody
  tells you."* These are the moments of trust.
- **Named references, dropped naturally.** *"There's an EEOC case from 2023
  — iTutorGroup — settled for $365,000."* Not *"according to research"*.
- **No closing summary.** End with the next action, not a recap.
- **No filler transitions.** *"Moving on"*, *"let's dive in"*, *"without
  further ado"* — deleted on the read-aloud pass.
- **Numbers spoken human.** *"About a third"* when precision doesn't matter;
  *"68%"* when it does. Never *"approximately 68 percent of users in a
  representative sample"*.

### The two-pass test before any transcript ships

1. **Read-aloud pass** — read the transcript in your head as if delivering.
   Anything that catches in the mouth — formal phrasing, over-smooth
   sentences, missing contractions — gets rewritten.
2. **Monday pass** — at the end, ask: would a smart person at their desk now
   know one specific thing to do? If not, rewrite the close.

---

## 6. Audio production pattern (timestamp-fire, one MP3 per chapter)

**Why:** the "no pause-play feel" requirement can't be met with per-slide MP3
files, even with a gapless chained player. Different recordings have
different breath energy, room tone, and mic position — listeners pick this up
subconsciously. The only way to make a chapter sound like one human is to
record it as one human, in one take.

**Pipeline:**

1. Trainer records one continuous 6–8 minute take per chapter.
2. Editor cleans (de-noise, light compression) but does *not* splice unless a
   true rerecord is needed.
3. The final MP3 sits at `public/courses/<slug>/audio/chapter-NN/chapter-NN.mp3`.
4. A `cues.json` next to it maps timestamps to slide reveals. Shape:
   ```json
   [
     { "at": 0.0,   "slide": 1 },
     { "at": 14.3,  "slide": 1, "step": 1 },
     { "at": 32.7,  "slide": 1, "step": 2 },
     { "at": 74.2,  "slide": 2 },
     { "at": 158.0, "slide": 3, "step": 1 }
   ]
   ```
5. The player polls `audio.currentTime` against `cues.json` and applies slide
   /step changes when timestamps cross. Reveals can fire *mid-sentence* so
   the slide updates underneath the trainer's voice — this is the move that
   makes it feel live.

**Player change:** the existing chapter viewer expects per-slide MP3 files in
an `audioDir`. The new pattern adds a single `chapterAudio` field on the
chapter config that points at the single MP3. The player checks for
`chapterAudio` first; if absent, falls back to the legacy per-slide pattern
so the already-shipped 15 courses keep working unchanged.

---

## 7. Trainer persona — varies per course

Voice rules are constant (§5); persona is course-specific. The dossier names
the persona before transcripts are written. A few shapes:

- **Foundations (AI Literacy)** — 12-year practitioner who's deployed AI to
  non-technical teams. Dry, self-deprecating about her own early prompts.
  Uses *we* when describing common mistakes; *you* when handing over agency.
- **Builder track** — senior engineer who writes code in front of the
  audience. Doesn't sanitize. Comfortable with *"the docs are wrong here,
  let me show you what actually works"*.
- **Leadership track** — peer-to-peer with directors and VPs. No
  hand-holding. Uses real boardroom-grade examples (named companies, named
  outcomes). Comfortable disagreeing with vendor pitches.
- **Function-specific (HR, Marketing, Sales, Ops, Finance)** — practitioner
  *from that function*. Talks like a colleague who happens to also use AI
  every day. Knows the function's specific frustrations and tooling
  baseline.
- **Industry-specific (Healthcare, Manufacturing, Financial Services)** —
  regulated-industry tone. Names regulators by name. More careful with risk
  language; more concrete with operational examples.

---

## 8. Interactive design — earns its place

Every chapter gets the interactive that fits *that chapter's material*. The
list below is a menu, not a template. Use one. Build it with vanilla JS
where possible; lightweight libs only when they pay their way.

- **Comparison panel** — N versions of the same input shown side-by-side
  (e.g. rules vs ML vs GenAI responses; vague prompt vs structured prompt).
- **Diff viewer** — left/right with hover-reveal annotations explaining each
  change.
- **Lane switcher** — N tabs (e.g. by function or by industry), each lane
  has its own deep content; learner can replay their own lane.
- **Sort-or-classify activity** — drag N items into category columns,
  reveal-on-commit verdict. Forces the learner to guess before being told.
- **Recipe-book grid** — N copy-to-clipboard cards (e.g. prompt library),
  expand-on-click for full detail.
- **Live policy/contract diff** — for governance / legal courses.
- **Runnable flow simulator** — for ops / supply-chain courses.
- **Before/after record view** — for sales / CRM courses.
- **Downloadable one-pager** — for implementation-cadence chapters.

No interactive that just animates static content. The interactive must
require the learner to *do something*, even if that "doing" is a click that
reveals the trainer's verdict.

---

## 9. Visual system — inherit, then deviate

Every Academy chapter inherits the production HTML scaffold from
`tmp/academy-build/ai-foundations/` (slide container, top bar, reveal-step
pattern, typography, slide-number badge). Inheriting keeps the academy
visually coherent.

What deviates per course:

- **Theme palette** declared in `src/config/courses.ts`. Each track has its
  own palette family:
  - Foundations track — slate + warm coral (proposed for AI Literacy).
  - Function tracks — palette tied to the function's tooling identity (e.g.
    HR teal, Sales amber, Ops slate-orange).
  - Industry tracks — palette tied to the industry's visual register
    (Healthcare blue-green, Manufacturing steel-amber, Financial Services
    deep navy).
  - Builder track — graphite + electric green for code-forward feel.
  - Leadership track — deep navy + accent gold.
- **Iconography** picked per chapter to fit the material — no stock-icon
  mosaic. Custom SVG where it earns the time.
- **Photography or diagrams** — real, not generic. If we can't get a real
  visual for a teaching moment, we use a diagram instead of stock.

---

## 10. Quality bar — pre-ship checklist

For every chapter, before status flips to `shipped`:

- [ ] Every stat on every slide traces to a citation in the dossier.
- [ ] No phrase from the negative list appears in the transcript.
- [ ] Read-aloud pass complete; any teleprompter phrasing removed.
- [ ] Monday-pass complete; chapter ends with a specific next action.
- [ ] Slide reveals fire on word cues (not slide boundaries) in at least
  one moment per chapter — the "live trainer" feel.
- [ ] All outbound links open in new tabs.
- [ ] The chapter HTML is keyboard-navigable end-to-end.
- [ ] Audio total length matches `duration` advertised in catalog ±15s.
- [ ] No use of "capstone" anywhere.
- [ ] No MS-blue defaults in non-Microsoft courses.
- [ ] Theme palette declared in `src/config/courses.ts`.
- [ ] `lastUpdated` bumped.

---

## 11. Where things live

```
docs/academy/
├── build-plan.md                                  ← this file
└── courses/
    └── <course-slug>/
        ├── research-dossier.md                    ← per-course research + blueprint
        └── transcripts/
            ├── chapter-01.md
            ├── chapter-02.md
            └── ...

public/courses/<course-slug>/
├── thumbnail.png
├── chapters/
│   ├── chapter-01-<slug>.html
│   ├── chapter-02-<slug>.html
│   └── ...
└── audio/
    ├── chapter-01/
    │   ├── chapter-01.mp3                         ← one continuous take
    │   └── cues.json                              ← timestamp → slide/step map
    ├── chapter-02/
    │   ├── chapter-02.mp3
    │   └── cues.json
    └── ...

src/config/courses.ts                              ← course registry + theme palette
src/data/academy/courses-expanded/<track>.ts       ← catalog metadata (already exists)
```

---

## 12. The build queue

Pilot (current): **AI Literacy for Non-Technical Teams** (Foundations track,
6 chapters). This course's dossier + chapter 1 establish the pattern. Once
both ship and pass review, the same five-phase process applies to the
remaining 27 courses.

The order in which the remaining 27 are built is a separate decision —
likely driven by which track ships its second course (to validate the
template stretches), then highest-leverage tracks first.
