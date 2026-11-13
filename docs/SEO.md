# Being found: search, and what a shared link shows

How gennoor.com tells search engines and other sites about its pages. Read this before adding a
page, changing a title or a description, touching the blog, or changing the sitemap.

The owner's words (13 November 2026): "SEO optimization for the entire website, also for all the
blogs that are written now and what will be written in future", and, of a link shared in a chat:
"it looks like black and then generic ... does not make it appealing".

## 1. Every page says five things

| What | Where it is written | The rule |
|---|---|---|
| Its **title** | `pageMeta({ title })` | What the page is, main words first, about 30 to 55 characters. The site adds " \| Gennoor Tech" by itself: never write the name in a title. |
| Its **description** | `pageMeta({ description })` | One or two plain, true sentences, about 120 to 160 characters. A longer text is cut by `metaDescription()`. |
| Its **one true address** | `pageMeta({ path })` | From the slash: `/training`. Always on `https://gennoor.com` (no `www`). |
| The **words a shared link shows** | the same title and description, or `shareTitle` / `shareDescription` | No price in them, nothing called "free", even on a page where someone pays. |
| The **picture a shared link shows** | `pageMeta({ image })` | A key of `src/lib/og-pages.ts`. Left out, the site's own picture. |

All five come from one function, `pageMeta` in `src/lib/seo.ts`:

```ts
export const metadata: Metadata = pageMeta({
  title: 'AI training for teams: Claude and Microsoft AI',
  description: 'Live training for teams, built around the work they do: Claude, Microsoft AI and custom automation courses.',
  path: '/training',
  image: 'training',
})
```

Use it on every page a visitor can open. Do not write `openGraph` or `twitter` by hand.

## 2. Mistakes already made here

- **A page wrote `openGraph` by hand without a picture, and its link shared with no picture at all.**
  Next does not fill a missing picture in from the layout: the page's `openGraph` replaces the
  layout's whole. The AI Weekend page shared like that until November 2026.
- **The name was in the title twice** ("Training — Gennoor Tech | Gennoor Tech"), on about twenty pages.
  The layout adds the name; a title that carries it too shows it twice.
- **A layout with a plain title took " | Gennoor Tech" off every page under it.** A `layout.tsx` that
  has pages below it passes `forLayout: true` to `pageMeta`.
- **A layout with a fixed address would give that address to every page under it.** The pages under a
  layout write their own `pageMeta`. A page that names no address gets its own path (the root layout
  says `canonical: './'`), so none is left without one.
- **The sitemap said every page had changed that minute.** A date is given only where it is known: a
  blog post's date, a course's last update.
- **`robots.txt` closed `/_next/`**, which holds the site's styles and scripts, so a search engine saw
  every page as plain text. It is open. `/og/` must stay open too: LinkedIn's reader obeys the file.
- **The share picture was a dark banner with a small logo**, and read as a black box in a chat. Share
  pictures are light and coloured (section 3).
- **A client page cannot carry a title.** A page that starts with `'use client'` gets its `pageMeta` from
  a `layout.tsx` beside it (see `src/app/webinars/layout.tsx`).

## 3. The picture a shared link shows

1200 x 630, drawn by `src/lib/og-card.tsx`: a light ground, the page's icon tile in its colour with
two smaller tiles, a small line, the heading, one line under it, and the address.

- A fixed page: add a card to `src/lib/og-pages.ts` and name its key in `pageMeta({ image })`. The
  address is `/og/<key>`. A key that is not in the list is "not found", so nobody can have the site
  draw a picture with words of their own.
- A blog post: nothing to do. `/og/blog/<slug>` is drawn from the post's title, category and icon.
- A Learning Studio course and an AI Essentials course: nothing to do
  (`opengraph-image.tsx` in their folders, the same card).
- The words on a card follow the house rules: plain and true, no price, nothing called "free", the
  Claude Partner line word for word.
- The picture is saved as a JPEG of about 60 KB. WhatsApp leaves out a preview picture that is too
  heavy, and a PNG of the same card is about 350 KB.
- The drawing tool (next/og) knows a small part of CSS: every box with more than one thing in it needs
  `display: flex`; a style set to `undefined` stops the picture; there is one font in one weight, so a
  heading gets its weight from a thin outline in its own colour.
- LinkedIn and WhatsApp remember a picture for days. After a change, LinkedIn's Post Inspector
  (linkedin.com/post-inspector) reads the page again.

## 4. A blog post needs nothing done by hand

A post is its file in `src/data/blog-posts/content/` and its entry in `src/data/blog-posts/index.ts`,
whoever wrote it: a person, or the writing agent through the admin centre. From those, with no step
for anyone to remember:

| It gets | From |
|---|---|
| Its picture on the site: an icon tile in a colour, two smaller tiles | `src/lib/blog-icon.ts` (`blogIcon`), drawn by `src/components/blog/BlogArt.tsx` |
| Its share picture | `/og/blog/<slug>` |
| Its title, description (cut to a search result's length), address, article data | `generateMetadata` in `src/app/resources/blog/[slug]/page.tsx` |
| Its structured data: `BlogPosting`, the breadcrumb, the questions and answers | `ArticleJsonLd`, `BreadcrumbJsonLd`, `FAQJsonLd` |
| Three posts to read next, on the same subject | `getRelatedPostsMeta` |
| Its line in the sitemap, with its date, and in the feed | `src/app/sitemap.ts`, `/resources/blog/feed.xml` |

**The picture of a post.** The post carries one emoji (`icon`). The site does not show the emoji: it
draws the matching icon as a glass tile. The colour is the family of the post: rose for a judgement
(security, privacy, governance, law), green for what runs by itself (agents, automation), violet for
what is built (architecture, engineering, MLOps, models, tools), blue for what is read and decided
(strategy, Microsoft, Azure), cyan for an industry, the Claude colour for anything Claude, and gold
for the one post featured at the top. The two smaller tiles come from the tags.

- The emoji must be one of `BLOG_EMOJI` in `src/lib/blog-icon.ts`. The writing agent is told the list
  with every request (`briefWithIconRule`) and in its own instructions (`BLOG_ICONS` in
  `services/studio-agents/agents.py`). Keep the two lists the same: an emoji added to one is added to
  the other.
- An emoji the site cannot draw is dropped when the draft is saved, and the picture comes from the
  words of the title, the category and the tags. No post is ever without a picture.
- To give a new subject an icon: add the emoji and its lucide icon to `EMOJI`, or a word to `WORDS`.
- Do not use `coverColor` to colour anything: it is a dark colour from the old look.

## 5. The site as a whole

- **Sitemap** `src/app/sitemap.ts`: every page a visitor can open and that should be found. A new kind
  of page is added there.
- **Robots** `src/app/robots.ts`: closed are the admin centre, the CRM and the API. Nothing else.
- **Feed** `/resources/blog/feed.xml`: the newest 50 posts.
- **Structured data** `src/components/JsonLd.tsx`: the organization and the site on every page; the
  article, the course, the event, the questions and answers where they belong. Only what is on the
  page and true. A post signed by the team has the company as its author, not a person.
- **A page kept out of search** (a learner's own page, a certificate check) passes `noindex: true`.
- **One main heading** (`h1`) on every page.
- **Both addresses answer**: `gennoor.com` and `www.gennoor.com`. Every page names `https://gennoor.com/...`
  as its true address, which is what search engines index. Sending one address to the other was not
  done: the sign-in of the admin centre and the payment return address are tied to the address they
  were set up on. It is the owner's decision.

## 6. The catalogue

`public/Gennoor-Tech-Catalog/Gennoor-Tech-Catalog.xlsx` is built from the site
(`scripts/catalog/extract-site-data.ts`, then `build-catalog-xlsx.py`). The owner's words (13 November
2026): "I would like to have reality in the catalog ... whatever we have in the video, that is the same
value." So it lists only what we really offer, in the order of the film "What we do": the Learning Studio
courses that are live, the interactive AI Essentials courses, the Claude certification preparation, the
Claude automation courses that have a page, what we build for one organization, and the AI Weekend. No
list of team programmes, exam preparation or prototype blueprints. Of Microsoft's courses, only the AI,
data (DP), AI for business (AB) and Copilot titles, as "coming soon to the Learning Studio"
(`scripts/catalog/import-title-plan.py "<the title plan Microsoft sends>"`). No prices, nothing called
"free", nobody named as a trainer.

## 7. The check

```bash
node scripts/seo-head.mjs http://localhost:3111 home training resources/blog/<a-post>
```

It prints, for each page, what a search engine reads: the title and its length, the description and
its length, the address, the shared words and picture, the feed, the count of main headings, and the
kinds of structured data. Look for: a title over about 65 characters or with the name twice, a
description under 70 or cut in the middle of a word, `canonical: NONE`, `image NONE`, `h1: 0`.

Then open the picture itself and look at it: `http://localhost:3111/og/<key>` or
`http://localhost:3111/og/blog/<slug>`.

After a deploy, run the same line against `https://gennoor.com`.
