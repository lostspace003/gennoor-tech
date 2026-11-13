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

## An admin page

The admin centre keeps the light "paper" look; the rules are in `docs/DESIGN.md`, section 9.

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

- **A class the project had never used did nothing in the running dev server** (`w-[190px]`: the dropdown
  stayed 494 pixels wide). Stop and start `npx next dev` after adding such a class; the production build
  is not affected.
- **A chart and the tile beside it gave different totals**, because each counted enrolments in its own
  place. Count once, and let both read the same number.
- **A heading with no size class came out huge** on an admin page: the site styles every bare `h2`. Give
  each heading its size.
- **Records named a course in two ways** (its address, and its code in small letters), so one course showed
  as two. Check real records for old spellings before trusting a grouping.

- **A white button on a film went dark** because `bg-white` was renamed to a theme colour. Something that
  must be white on every theme is written `bg-[#fff]`.
- **Dark-navy text (`text-[#0C1426]`) vanished on dark cards.** Text is `text-gray-900` unless it sits on a
  fixed colour (gold button: `text-[#2a1a00]`).
- **A cream section kept its light background** with text that had turned light. A leftover light hex
  (`bg-[#faf9f5]`) is the cause; grep for `bg-\[#f` after any change.
- **Tiles inside `<Reveal>` were missing from full-page screenshots** until the page was scrolled.
  `scripts/shot.mjs --full` scrolls first; a plain viewport screenshot does not.
- **The blog set its colours in `style={{}}`** and stayed white. Inline colours use `'rgb(var(--gray-900))'`.
- **A dark block in the light theme** needs the class `stage` on it (or to be a `<Ground>`), or the
  theme's dark text lands on it.
- **Menus inside menus** were removed on purpose (owner's request). Do not add a row that only opens a list.

## What must not change when only the look changes

- Addresses of pages (`href`), names of form fields, API paths. The six forms (`EnquiryFormModal`,
  `CertificationEnquiryForm`, `BookCallModal`, `BookingCalendar`, `EmailOTP`, `ClaudeCoworkPopup`) send
  field names the server depends on.
- The Claude Partner line and badge (`src/components/ClaudePartner.tsx`): word for word, badge on its cream card.
- The lesson players and the admin centre: they are not on the stage (`isChromelessRoute`).

## Related

- Films, the presentation and the Instagram versions use the same look: skill `gennoor-films`.
- Branch, pull request, merge, deploy: skill `gennoor-ship`.
