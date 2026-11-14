# New posts by email: the subscribe boxes and the weekly email

Read this before changing anything in `src/lib/newsletter*.ts`, `src/hooks/useSubscribe.ts`,
`src/app/api/newsletter-*`, `src/app/api/unsubscribe`, `src/app/admin/newsletter` or one of the boxes
"Get new posts by email".

The owner's words (14 November 2026). About the box under the blog: "has this been automated". It had not:
the box kept the address, sent one "You're subscribed" email, and nothing ever followed. Then: "many places
where we are talking about subscribe. So are those subscribe happening? We need to check all those
subscription things on the website. And how are we going to subscribe? You decide on that and make it forward."

## 1. The idea

- **One promise, kept by itself.** Whoever asks for new posts gets one email a week, on Thursday, with the
  posts of that week. Nobody has to remember to send it.
- **One way to sign up.** One field, one button, the same in every box. No code to type, no account.
- **Only the owner of an address can put it on the list.** We send that address one email with one button.
  Until the button is pressed, the address is not on the list and gets nothing more.
- **Every email can be stopped with one press.**
- **One box per page.** The blog and every article carry their own box; every other page has the small one
  in the foot. The foot's box is not shown on the blog pages, so no page asks twice.

"Subscribe on YouTube" on the Webinars page is a link to YouTube and has nothing to do with any of this.

## 2. Where things are

| What | Where |
|---|---|
| The rules: which Thursday, which posts, who, how many at a time, never twice (pure) | `src/lib/newsletter.ts` |
| The two emails: the weekly one and "Confirm your email" (fixed words, no model writes anything) | `src/lib/newsletter-email.ts` |
| The live parts: the list, the email service, what has gone | `src/lib/newsletter-live.ts` |
| What every box does and says | `src/hooks/useSubscribe.ts` |
| The three boxes | `src/components/layout/Footer.tsx`, `src/app/resources/blog/BlogListClient.tsx`, `src/app/resources/blog/[slug]/BlogPostClient.tsx` |
| A box sends the address here | `src/app/api/newsletter-subscribe/route.ts` |
| The button in "Confirm your email" leads here | `src/app/api/newsletter-confirm/route.ts` |
| "Unsubscribe" leads here | `src/app/api/unsubscribe/route.ts` |
| The links themselves (signed, so they work only for their own address) | `src/lib/unsubscribe.ts` |
| The small page behind a link pressed in an email | `src/lib/simple-page.ts` |
| The admin page "Weekly email" | `src/app/admin/newsletter/page.tsx`, `src/app/api/admin/newsletter/route.ts` |
| The heartbeat that runs it every 15 minutes | `src/lib/heartbeat.ts` |
| The checks | `scripts/newsletter-check.ts` |

What is kept, and where: a sign-up is a row `NewsletterSubscription` in the `Enquiries` table and a request to
stop is a row `Unsubscribe` there. Two small files in the site's store: `newsletter/state.json` (which issue
went to whom) and `newsletter/requests.json` (addresses typed into a box and not confirmed yet; only so the
admin page can count them).

## 3. Signing up, step by step

1. The visitor types an address and presses **Subscribe**.
2. The box says: "Almost done. We sent an email to <address>. Press the button in it to confirm."
   It never says "Subscribed" at this point, because the address is not on the list yet.
3. The email "Confirm your email to get new posts from Gennoor Tech" arrives, with one button:
   **Yes, send me the new posts**.
4. The button opens a small page, "You are subscribed". The address is on the list from that moment.
5. Next Thursday the first weekly email arrives.

Details that matter:

- The link in the email is good for **14 days**, so an email that arrives late still works. It carries the
  address inside a signed token: changing one letter of the link makes it worthless, and an unsubscribe
  link cannot be used to confirm (nor the other way round).
- An address already on the list gets no email; the box says "You are already subscribed."
- If the email service does not take the message, the box says so ("We could not send the confirmation
  email just now...") and nothing is pretended.
- Limits against misuse: five tries in ten minutes from one visitor, and at most two "Confirm your email"
  to one address in ten minutes, whoever asks.
- Made-up addresses (`example.com` and the like) are never written to.

## 4. The weekly email

- **When.** An issue is due on **Thursday at 10:00 India time** (`ISSUE_DAY`, `ISSUE_HOUR`). The heartbeat
  starts it at its first run after that.
- **Which posts.** Those published since the last issue, newest first, at most eight (`MAX_POSTS`): from the
  Thursday before up to and including its own Thursday, less what already went. The Thursday before is in
  the window on purpose: the day's post usually reaches the site a little after 09:00, but some days it
  comes later, and a post that came out on a Thursday after that week's email had gone would otherwise be
  in no email at all. A post is never sent twice.
- **A week with no new post sends nothing.**
- **Who.** Everyone whose latest sign-up is later than their latest request to stop.
- **How fast.** Five at each heartbeat and at most 20 an hour (`PER_TICK`, `PER_HOUR`), and it waits when
  the rest of the site has already sent 70 emails in the hour. The email service allows the whole site
  about 100 an hour, and the codes that let learners sign in share that. With 20 an hour, 100 readers take
  five hours; raise `PER_HOUR` only together with the limit of the email service.
- **Never twice.** Who has had the issue is written down after every single send, so a restart in the middle
  cannot send anyone the same issue again. An address the email service refuses is tried three times,
  then left out of that issue. An issue still open after three days is closed; whoever was not reached
  gets the next one.
- **The first run ever sends nothing.** The issue "due" at that moment belongs to a week before this
  existed; the first email is the next Thursday's.
- **What it looks like.** The site's light email frame (`emailShell`, see `docs/DESIGN.md`, "Emails"): the
  newest post with its own share picture (`/og/blog/<slug>`), the others as short rows, one button "See all
  posts", and "Unsubscribe" in the foot. The heading gives the days of the posts that are really in it
  ("6 new posts, 13 to 18 November 2026"). The words are fixed; titles and summaries are the posts' own.

## 5. Stopping

Every weekly email has **Unsubscribe** in its foot, and Gmail and Outlook show their own "Unsubscribe" beside
the sender's name (the one-click headers). Either one records the request at once; no more weekly emails
go to that address. Messages a person asks for themselves (a sign-in code, a certificate, a receipt) are not
affected. Signing up again later puts the address back.

## 6. The admin page

Admin centre, **Weekly email** (`/admin/newsletter`). It shows how many are subscribed, how many typed their
address and have not pressed the button yet, how many asked to stop, when the next email goes and with which
posts, the email itself exactly as it stands, who gets it, and what has gone. **Send me a test** sends that
email to the signed-in person and to nobody else. There is nothing to switch on: it runs by itself.

## 7. The boxes: their look

All three take their behaviour and their words from `useSubscribe` and keep their own look. When changing one:

- The field is labelled for a screen reader: `aria-label="Email address for new posts by email"`. The picture
  checks find the boxes by that label; keep it.
- The words under the heading are the promise. They must stay true to section 4: "One email a week, on
  Thursday, with that week's posts. No spam."
- Every state must be readable in both looks, measured (4.5 to 1 for these small words): the hint inside the
  field, the typed address, the green "Almost done" line, the red "did not work" line. Three were too faint
  when first measured: the green line in the light foot (`text-green-700`, not `-600`), the red line there
  (`text-red-700`), and the hint on the blog's tinted box (`placeholder:text-gray-500`, not `-400`).
- A box that has room shows `title` above `detail` (the article); a small one shows `said` (the foot, the
  blog list). Do not write the sentences a second time in a component.

## 8. Checks

```bash
npx tsx scripts/newsletter-check.ts        # the rules, the two emails, the links; made-up posts, people and clock; must end ALL OK
```

It sends nothing and reads no store. Run it before any pull request that touches the files of section 2.
After a change to a box: look at it before and after pressing Subscribe, in both looks, at 1366 and at 390
wide, and run `node scripts/contrast-check.mjs resources/blog training` (the foot is on `training`).
After a change to an email: write it to a file and photograph it 700 and 390 wide.

## 9. What nobody has seen yet, and what to watch

- **A real inbox.** The emails have been looked at as pictures drawn on this machine, not in Gmail or Outlook.
  Use **Send me a test**.
- **Late email.** From the evening of 12 November to the night of 13 November 2026 the email service
  delivered emails hours late and gave up on four (see `docs/CRM.md`, "Has it gone?"); by the morning of
  the 14th an email arrived within seconds again. A late "Confirm your email" still works for 14 days, but
  a visitor who does not see it soon may forget. If many people stay under "still to press the button",
  look at the email service first.
- **Mail filters that press links.** Some company mail filters open every link of an email to check it. Both
  links here act on being opened, so such a filter could confirm an address, or unsubscribe one, without
  its owner pressing anything. There is no sign of it (no opt-out at all was on record on 14 November 2026).
  The sign to watch for: people who vanish from the list within minutes of an issue going out. The cure
  is to make the link open a small page with one button and act only on that button.
- **One server.** The heartbeat keeps itself from running twice on one server. If the site is ever run on
  two, the weekly email needs a lock in the store first, or some people would get it twice.

## 10. Not to do

- Do not send the weekly email, or a test of it, to anyone but the signed-in person from a script.
- Do not add an address to the list by hand or from another form. Being on the list means its owner
  pressed the button.
- Do not call anything in these emails "free", and no prices (`AGENTS.md`, rule 5).
- Do not let a model write the weekly email. It is the posts' own titles and summaries, so what goes out is
  exactly what is on the blog.
- Do not put a second subscribe box on a page that has one.
- Do not print the list. A subscriber's address is private: counts, or masked.
