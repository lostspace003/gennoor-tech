# LinkedIn: the film campaign, and how every post is written

Read this before changing a post of the film campaign, its plan, or the instructions the writing
agents follow.

## 1. The film campaign

The owner's words (13 November 2026): promote the AI Weekend with its film "every 2 days at different
time, one in the afternoon, one time in the evening, one time in the morning"; "a weekend way of
writing the post should be different"; "twice in a week, on the days when we do not have AI weekend
thing", the film about what Gennoor does; each post "from my account, reposted with a short post on
the channel"; "it should have tags"; "every time ... unique"; written "for the next 3 months, and then
we need to repeat"; "stating clearly the objectives and how to reach to that page".

| What | Where |
|---|---|
| The plan, and the job that posts | `src/lib/promo-campaign.ts` |
| The 49 posts for the AI Weekend film (35 for working days, 14 for a Saturday or Sunday) | `src/data/linkedin-campaign-weekend.ts` |
| The 28 posts for the film "What we do" | `src/data/linkedin-campaign-overview.ts` |
| The page where the owner reads, changes, leaves out, posts or pauses | Admin, LinkedIn, Film campaign (`src/app/admin/campaign/page.tsx`) |
| The check | `npx tsx scripts/campaign-check.ts` (must end with ALL OK) |

How it runs:

- A cycle is 14 weeks (98 days): about three months, a whole number of weeks, and an even number of
  days, so the rhythm carries into the next cycle and a weekend post always lands on a weekend. After
  the last post the cycle starts again by itself.
- The AI Weekend film goes out every second day; its time goes morning, afternoon, evening and round
  again. "What we do" goes out on four working days of every fortnight, never on a day of the other.
- Each post goes out from the founder's **profile** first, with the film attached and the link as the
  first comment. About 25 minutes later the **company page** reposts it with a short line of its own.
- `{when}` and `{dates}` in a post become the next AI Weekend dates as the post goes out (from
  `nextCohort()`), so a post is right in every cycle.
- It runs on the heartbeat (`src/lib/heartbeat.ts`), keeps what it did in the store
  (`promo-campaign/state.json`), and an email tells the owner if a post was missed.
- **Merging it starts real posts.** It is on by default from `START`. Change `START` only together
  with the owner.

## 2. What a post may say

- Only what the page it points to says: `src/data/ai-weekend.ts`, the film's own words in
  `src/data/films.json`, the presentation. Nothing invented.
- Nothing is called "free". No price, no fee, no discount.
- No story of a past weekend or a past learner, no client's name, no promised result.
- **Nobody is named as the trainer**: "an industry expert".
- **The AI Weekend is about AI, not one product.** Claude is named only where the thing itself is
  Claude's (skills, connectors), or as "one of the assistants used".
- Never the first person singular ("I", "my", "me"). The post speaks to the reader as "you" and of the
  company as "we".
- The Claude Partner line word for word: "Gennoor is Certified in the Claude Partner Network."

## 3. How a post is written

The shape is the house shape (`HOOK_BULLETS_RULES` in `src/lib/linkedin-format.ts`): a hook in bold on
the first line, short lines, three to five bullets, the takeaway, the page address, three to five
hashtags, 50 to 110 words. On a Saturday or Sunday the same thing is said more slowly: a thought, a
short paragraph or two, then the invitation.

The craft, in ten lines, is `POST_CRAFT` in `services/studio-agents/agents.py` (the writing agents carry
it), with a short form in `LINKEDIN_CRAFT` in `src/lib/linkedin-format.ts`. In brief: one post, one
idea; earn the first line; be specific; write for the eye; give the reader something to use; end on
purpose; plain words; different every time; three or four exact hashtags; true only.

A blog article has its own ten lines, `BLOG_CRAFT`, in the same file: the argument first, an outline
whose headings tell the story, a specific heading for every section, the reader's situation before the
news, one usable checklist, the limits said plainly, a "next 30 days" close.

## 4. The agent service is put out by hand

`services/studio-agents` is a separate service (the container app `ca-gennoor-studio`). A change to
`agents.py` does nothing until it is put out again; the steps are in
`docs/studio-agent-terminated-issue.md`. The website sends the list of emoji the blog can draw with
every request, so that part works without it.

After putting it out, try the real thing: `npx tsx --env-file=.env.local scripts/autopilot-live-check.ts`
builds the autopilot's own request for the newest planned post, sends it to the live service and prints
the post that comes back. It saves nothing and posts nothing. It must end with ALL OK.

## 5. The two days no post could be written (12 and 13 November 2026)

What happened: from 12 November every slot of the autopilot was held with "drafting failed: Agent
service returned 500" (posts) or "Invalid body: failed to parse JSON value" (polls). GitHub showed
nothing, because nothing in GitHub failed.

Why: the change of 11 November added the opening lines of recent posts to the writers' notes. Those
lines are kept in Unicode bold, where one letter is two units of a JavaScript string. `firstLine()` cut
them at "the first 200", sometimes through the middle of a letter. Half a letter cannot be sent: Azure
refused the request, and the Python service answered 500 while trying to describe it.

What holds it now, and must stay:

- Text is cut with `cut()` and every request body is written with `safeJson()` (`src/lib/safe-text.ts`).
  Never `.slice()` a text that may hold bold letters or emoji, and never `JSON.stringify` a body that
  carries text from an earlier post.
- `firstLine()` gives plain letters, so a new opening can also be compared with an old one.
- The notes are built to a fixed size by `buildBrief()` (`src/lib/autopilot/variety.ts`): the rules, the
  format and the fixes whole, then as many recent openings as fit, newest first. The website's limit is
  `BRIEF_MAX` (6,000); the service's is 12,000 (`RunBody.brief` in `app.py`). Keep the second above the first.
- The service drops half letters before it looks at anything (`whole_text` in `app.py`) and refuses a
  request that does not fit with a short reason, which the Autopilot page now shows.
- `npx tsx scripts/autopilot-check.ts` runs all of this with no secret and no network. It must end with
  ALL OK before any pull request that touches the autopilot, the writing rules or `safe-text.ts`.

When the Autopilot page says "drafting failed", read the words after it, then run the live check above.
