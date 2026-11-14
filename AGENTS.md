# Working in this repository

gennoor.com: the website of Gennoor Tech (AI training from Mumbai), a Next.js app that also holds the
admin centre, the CRM, the Learning Studio, and the scripts that make the films and the presentation.
Every merge to `main` goes live by itself in about ten minutes.

Whichever assistant or person you are, these are the house rules. Each has a fuller guide; read the
guide before doing that kind of work.

| Doing this | Read first | Claude Code skill |
|---|---|---|
| Anything a visitor or a member of staff sees: a page, a component, a menu, a style | `docs/DESIGN.md` | `gennoor-site-design` |
| A film, the presentation, an Instagram or LinkedIn video, the catalogue | `scripts/show/README.md` | `gennoor-films` |
| A new page, a title or a description, the picture a shared link shows, a blog post, the sitemap | `docs/SEO.md` | `gennoor-site-design` |
| A LinkedIn post, a blog article, the autopilot, the film campaign, what any writer or reviewer is told | `docs/LINKEDIN.md` and `src/lib/writing-rules.ts` | |
| The CRM: leads, replies, the email series, the Today page | `docs/CRM.md` | |
| "Get new posts by email": a subscribe box, the email that confirms an address, the weekly email of new posts | `docs/NEWSLETTER.md` | |
| An email the site sends: its top, its foot, its logo | `docs/DESIGN.md`, "Emails" | `gennoor-site-design` |
| Finishing: branch, pull request, merge, deploy | `.claude/skills/gennoor-ship/SKILL.md` | `gennoor-ship` |

The skills are in `.claude/skills/`. They are plain Markdown: any tool can read them.

## Rules that hold everywhere

1. **The look is decided.** Dark "stage" and light "day" for the public site, and which of the two shows
   follows the visitor's own clock: light by day (07:00 to 18:00 where they are), dark in the evening and
   at night. The admin centre and the CRM follow the same clock: light "paper" by day, their dark look at
   night, and the person working there can switch. Colours by name, the icon-tile kit, one-level menus. Do not restyle
   from taste; follow `docs/DESIGN.md`.
2. **Look at what you made.** A change to a page is checked in both themes, on a desktop and on a phone
   (`node scripts/shot.mjs`), before it is called done. In the light look every word must be readable:
   `node scripts/contrast-check.mjs <pages>` measures it.
3. **Never on `main`.** Branch, pull request, squash merge, then make the local folder identical to GitHub.
4. **Say what was not checked.** In the pull request and to the owner. Never claim more than was done.
5. **What is written for the public is plain and true.** No prices in the films, the presentation or the
   catalogue, and none on a page except where someone pays (the AI Weekend, a Learning Studio course).
   Courses are never called "free". No customer names. Only what exists or has been agreed. The AI Weekend
   is "the last weekend of every month, Saturday & Sunday". The Claude Partner line is used word for word.
   The AI Weekend is about AI, not one product: its seven parts are written once, in `src/data/ai-weekend.ts`.
   Nobody is named as the trainer: "an industry expert". The catalogue lists only what we really offer.
   **One price, in the visitor's own money.** Rupees in India, dollars everywhere else, never both on a
   page (owner, 14 November 2026). The AI Weekend is ₹499 or $9.99; a course is ₹849 or $19.99, and that is
   the price paid, with the regular price crossed out beside it. Where a visitor is, is read from their
   device (`src/lib/money.ts`, `useIndia`); a price is drawn only once that is known. An email to many people
   names no amount.
   **The reader is not technical.** Posts, articles and emails are written for a manager who is curious
   about AI and is not a specialist: the point first, every technical word explained, short sentences, no
   clever framing. The rules are in one file, `src/lib/writing-rules.ts`, and every writer and reviewer is
   given them. A text never talks about its own drafting.
6. **Only the look changes when the look changes.** Page addresses, form field names and API paths stay.
7. **Not without being asked:** sending a real email, typing a password or a secret, closing the owner's
   PowerPoint or Excel, deleting data.

## Commands

```bash
npx next dev -p 3111                                  # the site on this machine
npx tsc --noEmit && npx next build                     # before every pull request
node scripts/shot.mjs <folder> --full [--light] home training   # photographs of pages, 1366 and 390 wide
python scripts/stage-codemod.py                        # lists colours written as fixed values
node scripts/seo-head.mjs http://localhost:3111 home training   # what a search engine and a shared link read
node scripts/contrast-check.mjs home ai-weekend        # can every word be read, in light and in dark
node scripts/look-check.mjs                            # the public look follows the visitor's clock: places, the edges of the day, the switch, no flash
node scripts/contrast-check.mjs --back-office admin/learners crm/queue   # the same for the admin centre and the CRM (made-up data)
python scripts/stage-codemod.py --admin                # fixed colours in the admin centre and the CRM (they would not turn dark)
npx tsx scripts/campaign-check.ts                      # the LinkedIn film campaign: the plan and all its posts
npx tsx scripts/autopilot-check.ts                     # the autopilot: what it sends is whole and fits, the day's plan, the writing rules (no network)
npx tsx scripts/crm-check.ts                           # the CRM: what a reply does, the Today lists, the hourly limit, has an email really gone (made-up leads)
npx tsx scripts/newsletter-check.ts                    # new posts by email: which Thursday, which posts, who, never twice, the confirm link (made-up posts and people)
node scripts/email-art/logo.mjs --look <folder>        # draws the logo at the top of every email, in the brand's own lettering
npx tsx --env-file=.env.local scripts/autopilot-live-check.ts --fresh   # research now and one post written for real; nothing saved
npx tsx --env-file=.env.local scripts/blog-live-check.ts       # one whole article written for real; nothing saved
```

## Who may sign in

One file: `src/lib/crm/users.ts`. `ADMIN_USERS` open the admin centre and the CRM; `CRM_USERS` adds the
people who work leads only (they are taken to the CRM if they open `/admin`, and the admin centre's
addresses refuse them). A new colleague needs a Microsoft 365 account first, then a line in that file,
then a merge. Add their name for email signatures in `src/lib/crm/team.ts`.
