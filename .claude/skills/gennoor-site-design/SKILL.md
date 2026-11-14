---
name: gennoor-site-design
description: The look of gennoor.com and how to change it without breaking it - the dark "stage" and light "day" themes, colour names, the icon-tile kit, page layout, the one-level menu, phone layout and the screenshot check. Use before building or changing any page, component, menu or style of the public website or the admin centre in the gennoor-tech repo, and when asked to "make it look like the rest of the site", add a page, fix something that looks wrong, or check a page on a phone.
---

# Changing how gennoor.com looks

The rules are in `docs/DESIGN.md`. **Read it first, all of it.** This file is the working order and
the mistakes that have already been made once.

## The order of work

1. Read `docs/DESIGN.md`, then open a page that is already right as your model:
   `src/app/page.tsx` (home), `src/app/automation/page.tsx`, `src/app/training/page.tsx`, `src/app/claude/page.tsx`.
2. Build from the kit in `src/components/stage/` (`Ico`, `Ground`, `Reveal`, `Ring`, `ProcessFlow`) and the
   `st-*` classes. If the kit lacks something, add it to the kit and to `docs/DESIGN.md`, not to one page.
3. Write colours by name (`text-gray-600`, `bg-raised`, `bg-surface`). Never `bg-white`, never a hex in
   brackets for a neutral or the blue. `python scripts/stage-codemod.py` lists any that slipped in.
4. Check it (below). Then describe in the pull request what you looked at and what you did not.

## The check that is not optional

```bash
npx tsc --noEmit
npx next dev -p 3111                                   # leave running in another terminal
node scripts/shot.mjs <folder> --full <pages>          # dark:  <page>-1366.png and <page>-390.png
node scripts/shot.mjs <folder> --full --light <pages>  # light
npx next build                                          # before the pull request
```

Pages are named without the leading slash, and the home page is `home` (Git Bash on Windows turns
`/training` into a file path). Open the pictures and look at them: both themes, both widths.
A page is not finished because it compiles.

The site shows the light look by day and the dark look in the evening and at night, by the visitor's
own clock (`src/lib/theme.ts`), so every visitor in working hours meets the light look first: it is not
the second-best one. The pictures do not depend on the hour they are taken (dark unless `--light`).
After a change to the look's own code, `node scripts/look-check.mjs` must end with ALL OK.

## A new page, or a page whose words for search change

The rules are in `docs/SEO.md`. In short:

1. The page's title, description, address and share picture come from `pageMeta` (`src/lib/seo.ts`).
   Never write `openGraph` by hand, and never write "Gennoor Tech" in a title: the site adds it.
2. Its share picture is a card in `src/lib/og-pages.ts` (light, with the page's icon tile). Plain and
   true words, no price, nothing called "free".
3. Add the page to `src/app/sitemap.ts` if a visitor should find it.
4. Check: `node scripts/seo-head.mjs http://localhost:3111 <page>`, and open `/og/<key>` to look at
   the picture.

A blog post needs none of this: its picture, share picture, description, structured data, sitemap
line and feed line all come from the post itself (`docs/SEO.md`, section 4).

## An admin page

The admin centre and the CRM are the light "paper" look, with a dark look the person can switch on; the
rules are in `docs/DESIGN.md`, section 9. Every colour is written by name there too, and both looks are measured
(`node scripts/contrast-check.mjs --back-office ...`).

1. The model is `src/app/admin/learners/page.tsx` (figures: period row, tiles, charts, tables, Excel) and
   `src/app/admin/payments/page.tsx` (a list with filters). Add the page to `GROUPS` in
   `src/components/admin/AdminShell.tsx` as one row; never a row that opens a list.
2. Figures are read in one file in `src/lib/` and served by an address under `/api/admin/` that starts
   with `verifyAdmin`. Run the reading against the real records once and check that the tiles, the charts
   and the tables agree before drawing anything.
3. Charts: one blue, one axis, columns that can be read by pointer and by keyboard, the same numbers in a
   table. The `dataviz` skill has the method; section 9 has the colours already checked for this site.
4. The screenshot script shows only the sign-in page for `/admin/...`. Look at the page signed in, in the
   browser, at 1366 and at 390 wide, and say in the pull request how it was looked at.

## Mistakes already made here, so do not repeat them

- **The icons were glossy, glowing and large**, a dozen on the home page in five strong colours. The owner
  (14 November 2026): "too many flashy icons ... I want the icons, but I don't want to be flashy ...
  professional, very much subtle ... It's hitting the eyes right now." An icon tile is calm now: a soft wash
  of its colour, the drawing in that colour, no shine, no glow, 40 to 44 pixels in a card
  (`docs/DESIGN.md`, section 3, "An icon tile is calm"). Do not bring the gloss back on one page, do not make
  a tile bigger to fill a card, and do not put an icon on a solid colour square: use `<Ico>` or `st-ico`.
  Where a line passes behind a tile, add `st-ico-solid`, or it shows through.
- **The buttons on the videos were big and bright, and each in a different place**: a yellow or white disc
  at the top left of a film, a white "Watch" pill with a blue disc at the foot of the walkthrough, a large
  disc in the middle of a stopped promo. The owner (14 November 2026): "very big ... too much flashy ...
  keep every of the play button on the same side. On the right corner of the video." Every button on a
  video is `st-play` now: 36 pixels, dark glass, top right (`docs/DESIGN.md`, section 3). A new player uses
  that class and puts nothing else in that corner. The gold "% off" ribbon of a course page lies across the
  same corner: there the button goes just under it (`underRibbon`). Look at a player with a ribbon on it.

- **A class the project had never used did nothing in the running dev server** (`w-[190px]`: the dropdown
  stayed 494 pixels wide). Stop and start `npx next dev` after adding such a class; the production build
  is not affected.
- **A chart and the tile beside it gave different totals**, because each counted enrolments in its own
  place. Count once, and let both read the same number.
- **A heading with no size class came out huge** on an admin page: the site styles every bare `h2`. Give
  each heading its size.
- **Records named a course in two ways** (its address, and its code in small letters), so one course showed
  as two. Check real records for old spellings before trusting a grouping.

- **A link shared in a chat showed a black banner with a small logo**, and the owner called it
  "very blackish" and unappealing. Share pictures are light and coloured (`src/lib/og-card.tsx`).
- **A page that wrote `openGraph` by hand shared with no picture at all**, and about twenty pages had
  the site's name in the title twice. `pageMeta` prevents both.
- **A blog picture hidden with `hidden lg:flex` still showed on a phone**, because `st-art` sets its own
  `display`. Size a `<BlogArt>` for the phone too instead of hiding it.

- **White words on a light block** on the AI Weekend page in the light look: the page wrote `text-white/65`,
  a strength the light-look rules did not list. The rules now catch every strength; and
  `node scripts/contrast-check.mjs <pages>` measures every page in both looks. Run it. The owner: "when you
  change it to the light mode, the font should be properly visible."
- **A video player's time went dark on its black bar** in the light look. A player carries `st-keep`.

- **A white button on a film went dark** because `bg-white` was renamed to a theme colour. Something that
  must be white on every theme is written `bg-[#fff]`.
- **Dark-navy text (`text-[#0C1426]`) vanished on dark cards.** Text is `text-gray-900` unless it sits on a
  fixed colour (gold button: `text-[#2a1a00]`).
- **A cream section kept its light background** with text that had turned light. A leftover light hex
  (`bg-[#faf9f5]`) is the cause; grep for `bg-\[#f` after any change.
- **Tiles inside `<Reveal>` were missing from full-page screenshots** until the page was scrolled.
  `scripts/shot.mjs --full` scrolls first; a plain viewport screenshot does not.
- **The blog set its colours in `style={{}}`** and stayed white. Inline colours use `'rgb(var(--gray-900))'`.
- **The light theme still showed navy blocks** (owner: "the light theme also reflects black, which should
  not be"). The light theme is light all the way down: `<Ground>`, `st-solid`, `st-deep` and `st-win` follow
  the theme, so write the words inside them with the colour names, never `text-white`. An older block
  with white words on navy takes `st-night`. After any change, run the light sweep (every main page with
  `--light`) and look for a dark block that is not a film.
- **A course page read as "compressed"** (owner): lesson names cut with `truncate`, modules as thin
  rows, "what you build" as one long sentence in a card. Lessons, modules and build steps each get a
  line or a card of their own, with nothing cut short. See "The course page" in `docs/DESIGN.md`.
- **A chat bubble stood in for WhatsApp.** Use `src/components/icons/WhatsAppIcon.tsx`.
- **Justified text on a phone opened gaps between words.** `st-justify` justifies from tablet width up only.
- **Menus inside menus** were removed on purpose (owner's request). Do not add a row that only opens a list.
- **A dark bar with dark words in the light look** (the green bar of the process drawing on the Automation
  page): its ground was a fixed dark value in `style={{}}` while its words followed the look. A ground and
  the words on it change together: use a kit class that follows the look (`st-run`, `st-deep`, `st-solid`).
  The contrast check missed it because it skipped words inside drawings; it reads them now.
- **Words that appear only after a button is pressed were never measured** (a form's green "sent" line, its
  red error line, the hint inside a field): three of them were too faint in one look. The contrast check
  sees a page as it opens. Press the button, look, and measure those words by hand (4.5 to 1).
- **Two subscribe boxes on one page** (the blog's own and the foot's). One box per page: `docs/NEWSLETTER.md`.
- **A video said "Play with sound" in words, and had no slider.** The owner: "just having that simple icon
  can be good" and "we should be able to see the video slider ... the moment we hover over it". A button
  on a video is a round icon with no words, and every player of ours uses the one bar,
  `src/components/media/PlayerBar.tsx` (`docs/DESIGN.md`, section 3).
- **The browser's own grey pop-up asked "Why archive this lead?"** (`prompt`, `confirm`). A question is a
  small window of the page: in the CRM, `ask()` from `useCrm()`.
- **An admin or CRM screen was checked with real people's details on it.** Look at it with made-up leads:
  answer `/api/auth/session` and the page's data addresses from a puppeteer script (`docs/CRM.md`, section 7).
  On 13 November 2026 `next dev` on the owner's machine did not run the sign-in check (`middleware.ts`) at
  all, which makes this easy but proves nothing about access: for access, run `scripts/access-check.ts`
  against the built site.

## What must not change when only the look changes

- Addresses of pages (`href`), names of form fields, API paths. The six forms (`EnquiryFormModal`,
  `CertificationEnquiryForm`, `BookCallModal`, `BookingCalendar`, `EmailOTP`, `ClaudeCoworkPopup`) send
  field names the server depends on.
- The Claude Partner line and badge (`src/components/ClaudePartner.tsx`): word for word, badge on its cream card.
- The lesson players and the admin centre: they are not on the stage (`isChromelessRoute`).

## Related

- Films, the presentation and the Instagram versions use the same look: skill `gennoor-films`.
- Branch, pull request, merge, deploy: skill `gennoor-ship`.
