# The look of gennoor.com

This is the rule book for anything a visitor sees. Read it before changing a page, and
follow it rather than your own taste: the look was chosen by the owner and is the same as
the films and the presentation (`scripts/show/`).

- **Where it is carried out:** `src/styles/stage.css` (themes, kit, motion), `src/styles/globals.css`
  (paper values, component classes), `tailwind.config.js` (colour names), `src/components/stage/` (the kit in React).
- **How to check your work:** the last section. A change is not finished until it has been looked at
  in both themes, on a desktop and on a phone.

## 1. Three looks, one set of colour names

| Look | Class on `<html>` | Who sees it |
|---|---|---|
| **Stage** (dark) | `stage` | Every public page, in the evening and at night: from 18:00 to 07:00 on the visitor's own clock. |
| **Day** (light) | `day` | The same public pages by day: from 07:00 to 18:00 on the visitor's own clock. Soft grey paper, never pure white, and **no navy blocks**. |
| **Paper** | none | The admin centre, the CRM, the lesson players. Light and compact. |
| **Paper, dark** | `stage` | The admin centre and the CRM, when the person working there switches it on. The same pages with the stage's colour values. Light stays the default. |

- **Since 27 November 2026 the public site opens light at every hour** (owner: "default view on website should always be light theme"); `lookAt` in `src/lib/theme.ts` gives light, and the switch still gives dark until the next 07:00 or 18:00. What follows is how it worked before.
- **The public site followed the visitor's clock** (owner, 13 November 2026: "If it is the daylight, it
  will be light. If it is the dawn or the night time, it will be dark", "as per the zone in which the
  website is being opened"). The clock of the visitor's device is already in their own zone, so nothing
  is asked of them and nothing is sent anywhere. The two hours are `DAY_FROM` and `DAY_UNTIL` in
  `src/lib/theme.ts`; change them there and nowhere else.
- **Both looks are now the first thing somebody sees.** A visitor by day meets the light look without
  pressing anything, so a page that is right only in the dark is wrong for most working hours.
- A small script in `src/app/layout.tsx` puts the class on `<html>` before the page is drawn;
  `PortalShell` keeps it right while moving between pages and while a page stays open (it turns by
  itself at 07:00 and at 18:00). `ThemeSwitch` (foot of the menu, top bar on a phone) still changes it:
  a choice made by hand lasts until the clock next changes the look, then the clock decides again. It is
  kept in the visitor's browser (`gennoor.theme.choice`); the older `gennoor.theme` decides nothing and
  is removed when met. `node scripts/look-check.mjs` proves all of this on the real pages.
- A picture or a measurement must not depend on the hour it is made: `scripts/shot.mjs` and
  `scripts/contrast-check.mjs` set the look themselves.
- Which pages get no theme is decided in one place, `isChromelessRoute()` in `src/lib/chrome.ts`,
  and repeated in `THEME_SCRIPT` in `src/lib/theme.ts`. Change both together.
- **The light look is light all the way down** (owner, 2026-11-13: "the light theme also reflects
  black, which should not be"). A lit band, a solid card, a drawn window and a deep panel are navy on
  the stage and a deeper, bluer tint of the page on the day look, with dark words on them. Only a film
  or a photograph is dark there. So inside `<Ground>`, `st-solid`, `st-deep` and `st-win` the words are
  written with the colour names (`text-gray-900`, `text-gray-600`), never `text-white`.
- A block that already exists with white words on navy takes the class `st-night`: it stays navy on
  the stage and turns into the deep tint with dark words on the day look. Do not write new blocks that
  way. The class `stage` on a part of a page still forces the dark values; it is for a player or a
  preview window around a video, nothing else.

## 2. Colours: write the name, never the value

Every Tailwind colour reads a variable that each look sets. The same class is right everywhere.

| Write | It is |
|---|---|
| `bg-surface` | the page |
| `bg-raised` | a card or a field lifted off the page |
| `bg-gray-50`, `bg-gray-100` | a band across the page, a soft panel, a hover |
| `border-gray-200`, `border-gray-300` | a hairline, a stronger line |
| `text-gray-900` | main text |
| `text-gray-600`, `text-gray-500`, `text-gray-400` | quieter text, in three steps |
| `text-primary-600`, `bg-primary-50`, `bg-primary-100` | the blue: a link, a tint behind it, the selected row |
| `green-*`, `amber-*`, `red-*` | done, take care, wrong. For status only. |
| `bg-inverse` | something small that is dark on every look: a tooltip, a toast. Never a block of a page. |

Rules:

1. **Never a hex in brackets for a neutral or the blue** (`text-[#6e6e73]`), and **never `bg-white`**.
   They cannot change with the theme. `python scripts/stage-codemod.py` finds and converts them.
2. `gray` is a ramp of **roles**, not of lightness: on the stage `text-gray-900` is near-white.
   Do not use `bg-gray-800/900` to mean "dark"; use `<Ground>`, `st-deep` or `st-card st-solid`.
3. A fixed colour is right only when it is the same on every look: brand colours (the gold
   `#ffc24b`, WhatsApp, LinkedIn, Trustpilot), the cream card behind the Claude Partner badge
   (`#f0eee6`, dark text on it), a white label on a photograph (`bg-[#fff]`). WhatsApp is drawn with
   its own mark, `src/components/icons/WhatsAppIcon.tsx`, in white on its green or in its green on a
   plain ground: never a chat bubble from the icon set, and never recoloured.
4. Inline `style={{ color: '#...' }}` follows the same rule: use `'rgb(var(--gray-900))'`.

## 3. The kit

React pieces are in `src/components/stage/`; their classes start with `st-`.

| Piece | Use it for |
|---|---|
| `<Ico icon tone size />` | The icon tile: a lucide icon on a calm tile, a soft wash of its colour with the drawing in that colour. One per idea. 40 to 44 pixels in a card. |
| `<SparkIco code />` | The Claude spark, with a certification code under it. |
| `<Ground glow>` | A lit part of a page: the top, and one or two bands that should be noticed. Navy with glows on the stage, a deeper tint with soft glows on the day look. |
| `<Reveal>` | Holds the arrival of what is inside until it is on screen. |
| `<Ring>`, `<Mark>` | The dotted ring of the logo. The only ornament. Behind a statement, never behind a list. |
| `<ProcessFlow>` | The picture of a process done by hand, then running by itself. |
| `st-run` | The green bar of such a picture ("now it runs by itself"): deep green on the stage, a light green tint on the day look, with the look's own words on it. |
| `st-card` | A card. `st-gold` for the AI Weekend, `st-lit` for the one to notice, `st-solid` for one with more weight (navy on the stage, a deeper tint on the day look). |
| `st-deep` | A deep panel where a card would be too light: the top of a course page. Follows the theme like `st-solid`. |
| `st-ico` with `<b>3</b>` inside | A numbered tile: the step of a path, the number of a module. |
| `st-justify` | Reading text of more than two lines: both edges straight from tablet width up, ragged on a phone. |
| `st-gold-ink` | Gold words that stay readable on both themes. |
| `st-pill` | The main button. `st-gold` for the AI Weekend, `st-ghost` for a second button, `st-sm` small. |
| `st-link` | A text link, with `›` after the words. |
| `st-chip` | A small label; `<i />` first inside it is its dot (`--dot` sets the colour). |
| `st-kicker` | The small gold label above a heading. Only where it says something the heading does not. |
| `st-grad` + `st-serif` | The one accented phrase of a page. Once per page at most. |
| `st-num` | The large pale number behind a step. Only when the steps really are a sequence. |
| `st-win`, `st-win-bar` | A window drawn in a picture (a lesson, a process). It follows the theme. |
| `<BlogArt post main />` | The picture of a blog post: its icon tile with two smaller tiles on a band in its colour (`st-art`). Give it a height with a class. |

**Sound on a video.** Every player uses the one sound button, `src/components/media/VolumeControl.tsx`,
with `useBoostedVolume` (`src/hooks/useBoostedVolume.ts`). The owner's words (2026-11-13): "rather than
muting, unmuting, it should allow me ... to slide ... from 0 to 200%", and "the moment I hover over it,
it should show the percentage in small". So: pointing at the button shows the level; pressing it opens a
slider from 0 to 200 percent; sliding to 0 is "off". Above 100 the sound goes through the browser's
audio engine with a limiter. Where a video cannot be made louder (a phone's own streaming player, a
video on another site that does not allow it) the slider ends at 100 and nothing else changes. Do not
write a mute button of your own in a new player.

**A button on a video is an icon, with no words.** The owner's words (2026-11-13): "with sound, not
required to write that text ... just having that simple icon can be good." A video that plays without
sound shows one round button with the muted-speaker icon (`VolumeX`), with what it does in `aria-label`
and `title`. Never a pill that says "Play with sound" or "Turn on sound".

**Every button on a video is small, quiet, and in the top right corner.** The owner's words (14 November
2026), of the yellow button on the AI Weekend film and the white "Watch" pill with its blue disc: "Those
are very big. They can be smaller in size and they can be little less shiny, like too much flashy they
look ... keep every of the play button on the same side. On the right corner of the video, check the
entire website." So there is one class, `st-play` (`src/styles/stage.css`), and every player of ours uses
it: the button that turns the sound on, the one that plays a stopped video, "Watch it again", and the
"Watch · 9 min" of the Learning Studio walkthrough (the one button that keeps its words, as a small pill).

- 36 pixels, dark glass with a thin light line, the drawing in white; `st-gold` draws it in the AI Weekend's
  gold. No solid yellow, white or blue disc, no shadow, nothing that grows when pointed at. It can be
  pressed over 48 pixels.
- **The top right corner**, never the middle and never the left: the foot of a video has its slider, and a
  film has its spoken words written there. Where the gold "% off" ribbon lies across that corner (the top of
  a course page), the button sits just under the ribbon on the same edge: `underRibbon` on `PromoPlayer`.
- A stopped video is also played by a click anywhere on its picture, so the small button costs nothing.
- Not covered by this, and unchanged: the players inside a course once someone is learning (`LmsPlayer`,
  the Claude course reader), which keep their own large button in the middle. They are behind the sign-in
  and could not be looked at when this was done.

**A video always has a slider to move through it.** The owner's words: "we should be able to see the
video slider so that we can move it forward the moment we hover over it." Every player of our own uses
the one bar, `src/components/media/PlayerBar.tsx`: the slider, play or pause, the sound button above,
the time and full screen. On a course promo it is always there. On a film that plays by itself
(`src/components/home/FilmPlayer.tsx`) it shows while the pointer is on the film, after a tap on a
phone, while the film is paused and whenever the keyboard is in it, and is out of the way otherwise,
because the spoken words are written at the foot of the picture. Do not turn on the browser's own
controls instead, and do not build a second bar.

**The colour of an icon tile says what kind of thing it is.** Keep to this:

| Tone | Means |
|---|---|
| `blue` | something to watch or read: a lesson, a page, the Learning Studio |
| `violet` | something to do or practise: a lab, a build, a workshop |
| `green` | help, or something done: the assistant, a result, automation running |
| `gold` | earned, live, or not to be missed: a certificate, the AI Weekend |
| `claude` | anything Claude |
| `rose` | a check or a question: a quiz, the question board, a judgement |
| `cyan` | a connection between things |
| `ink` | off, not yet, or "no" |

Gold is the scarce one: **one gold thing in view** is the thing we want noticed.

**An icon tile is calm.** The owner's words (14 November 2026): "I just feel too many flashy icons are
there. I want the icons, but I don't want to be flashy. I want it to be professional, very much subtle ...
Size should not be too much on the eyes. It's hitting the eyes right now rather than making me get a calm
feeling when I see those colors." Until that day a tile was a glossy glass square with a white shine, a
coloured glow under it and a white drawing, 48 to 72 pixels in a card; the home page showed a dozen of them
in five strong colours. So:

- **The tile is a soft wash of its colour with a thin line round it, and the drawing is in that colour**: a
  light tint of it on the dark look, a deep shade of it on the light one. No shine, no glow, no shadow under
  it, no white drawing on a strong colour. It is all in one place, `.st-ico` in `src/styles/stage.css`, and
  the sixteen colours are with the two looks at the top of that file (`--st-ico-*`). Each was measured
  against its own tile on every ground a tile sits on (4.5 to 1 or better), so a number on a tile reads too.
  Change a colour there and measure it again; never give one tile a colour of its own on a page.
- **Sizes.** In a card 40 to 44 pixels (`size={44}`, or 40 where five cards share a row); in a line of text
  30 to 36; the one tile above the heading of a page 72 (`w-[72px] h-[72px]`); the picture at the top of a
  page 88 to 112 at most. If a tile looks too small, the card has too little in it: do not make the tile bigger.
- **A tile lets what is behind it show through.** Where something passes behind a tile, or a tile lies on
  another tile or on a coloured bar, add `st-ico-solid` (`className="st-ico-solid"` on `<Ico>`): the same wash
  on a ground of its own. The process drawing uses it; without it the joining line showed through its tiles.
- **An icon on a button or in a list is drawn the same way.** Never a solid colour square with a white icon
  and a glow (`bg-primary-600 text-white shadow-[...]`): the play tiles of a course's preview lessons and the
  small tiles beside "Certification prep" on the Learning Studio were that, six and three in view at once.
  They are `st-ico` now. The main button (`st-pill`) is the one solid blue thing on a page.
- **What did not change:** the meaning of each colour (the table above), one tile per idea, and the films,
  the presentation, the picture a shared link shows and the moving picture of the email series, which keep
  the glossy tile (each draws its own: `scripts/show/css/stage.css`, `src/lib/og-card.tsx`,
  `scripts/email-art/art.html`). They are seen once, as a picture, not lived in like a page. If they are to
  follow, that is a separate piece of work.

## 4. How a page is built

```
┌───────────────────────────────────────────────────────────┐
│ <Ground>  heading, one sentence,      │  a picture of the │   the top: text left, the thing itself right
│           main button + a link        │  thing itself     │   (a film, a window, a set of steps)
├───────────────────────────────────────────────────────────┤
│ heading, left          cards with icon tiles              │   plain sections; alternate nothing / bg-gray-50
├───────────────────────────────────────────────────────────┤
│ ...                                                       │
├───────────────────────────────────────────────────────────┤
│              one question, one button                     │   the close, centred
└───────────────────────────────────────────────────────────┘
```

- Width: `max-w-[1120px]` (or `1180px` on the home page), `px-4 sm:px-6`. Sections: `py-10 lg:py-14`.
- Headings: `display-hero` once, at the top; `display-section` for sections; then `lede` for the sentence under it.
  Text is left-aligned; only a statement (the vision) and the closing question are centred.
- The picture at the top shows **the thing itself** (a lesson window, a process, the film), not an abstract drawing.
- Few words. If a section needs a paragraph to explain a picture, the picture is wrong.
- No prices on marketing pages except where someone pays (the AI Weekend, a course's own page).
- The AI Weekend is "the last weekend of every month, Saturday & Sunday". Exact dates only where people register.

### The course page (`src/app/studio/[slug]/page.tsx`)

The owner's words (2026-11-13): the preview lessons and what is in each module were "very much
compressed", and "what you build ... just looks like a paragraph". So, on a course page and on any
page that lists what a course holds:

- **Nothing is cut short.** A lesson shows its whole name, its length, and the module it belongs to
  on a line of its own. No `truncate` on the name of a lesson or a module.
- **Preview lessons** are one band at the top of the curriculum (`PreviewList`): a play tile, "Preview 2,
  3 min", the name, the module. They are called "preview lessons" that "play right here, no sign-in
  needed". Never "free".
- **A module is a card**: a numbered tile, "Module 3", its name, how much is in it (items, time, and
  how many lessons, labs, demos and quizzes), and its lessons below, one to a line (`LessonLine`): a
  small tile in the colour of its kind, the name, the minutes, and a lock, a "Preview" tag or a tick.
- **"What you build" is a path, not a paragraph** (`CourseAbout`): a numbered tile for each part,
  joined by a line; the name; one line that says what gets built; then three to five ticked points.
  The description is written that way (see `src/lib/lms-about.ts` and the Course Factory skill
  `new-course`): a bullet with a name, and its points as bullets set in under it. A course published
  before this has its points in `src/data/lms/build-points.ts`.
- **Reading text is justified** (`st-justify`), in a column no wider than the page allows comfortably.
- The top of the page is `st-deep`, the call to buy is `st-card st-solid`: they follow the theme.
- **Complimentary access on every course page** (owner, 27 November 2026: "this will be for any new courses also ... this is rule"). The tile "Want complimentary access to the Learning Studio?" with "Click here" to `/complimentary-access` sits above "About this course", and closing a preview offers the same message as a pop-up once per browser session (`src/components/academy/ComplimentaryInvite.tsx`). Both live in the one course template, so a new course has them by itself; never remove them from a course.
- The Claude Partner line is used word for word (`TIER_LINE` in `src/components/ClaudePartner.tsx`), with the
  badge on its cream card. Never recolour the badge, never add a tier claim.
- Courses are never called "free". What is open to watch is the preview lessons: call them "preview lessons".
  An email, a LinkedIn message or a post never says "no sign-up" (owner, 14 November 2026: "remove word no
  sign up as we are making it payed option now preview is free"): it read as if the whole course were open.
  On a course page itself the small hint "Previews need no sign-in" stays, because there it tells a visitor
  what the preview button does.

### The picture of a blog post, and of a shared link

The owner's words (13 November 2026): every blog should have an icon, "really cool and relevant to
the blog", "colorful", and made the same way "in future ... by the Foundry agent, whoever is going to
write the blog". And of a link shared in a chat: "very blackish, and does not make it appealing".

- **A post's picture is its icon tile**, never an emoji and never a flat colour block. `<BlogArt>`
  draws it from the post itself (`src/lib/blog-icon.ts`): the icon from the post's emoji, the colour
  from the family of the post, two smaller tiles from its tags. It is on the blog list, at the top of
  a post, and under "Continue reading". Nothing is made or stored per post.
- The top of a post is `st-deep` with the theme's colours. A post's `coverColor` is not used.
- **The picture a shared link shows is light and coloured**, the same tile on a light ground
  (`src/lib/og-card.tsx`). Not the dark look: in a chat it reads as a black box.
- The full rules, and what a new page or a new post must have to be found, are in `docs/SEO.md`.

## 5. The menu

- **One level.** A section with more than one page is itself the link to its main page; its other pages
  are listed under it on a thin line and are always visible.
- Nothing in a menu only opens another menu. No arrows to unfold a group, no pop-out lists.
- Folded to icons, every icon is one link, with its name beside it on hover.
- The admin centre follows the same rule: groups of pages, one level. The sections of a page
  (the dashboard's tabs) belong at the top of that page, not in the menu.
- The site menu is `portalNav` in `src/lib/portal-nav.ts`; the admin's is `GROUPS` in `src/components/admin/AdminShell.tsx`.

## 6. Motion

- Things arrive once, in order, and then stay still: `st-rise`, `st-fade`, `st-pop`, `st-left`, `st-right`,
  with `style={{ '--i': n }}` for the order. At the top of a page they play on load; further down, wrap the group in `<Reveal>`.
- One arrival per view is enough. Do not make every section slide in.
- Only the ring and the glows keep moving, slowly.
- Everything is switched off for visitors who ask their device for less motion. Nothing is hidden from a
  visitor without scripts.

## 7. Scrollbars

A page longer than the screen shows its scrollbar: grey, in the theme's own tone (`--st-scroll`), a little
wider on the page itself and thinner inside panels. Do not hide a vertical scrollbar. A row that slides
sideways (a carousel) may hide its own.

## 8. On a phone

- Design the 390-pixel width as carefully as the desktop. Grids fall to one or two columns; the picture
  at the top comes first when it is what the page is about (the film).
- Nothing scrolls sideways except a carousel. Long words and addresses wrap.
- Anything to tap is at least 40 pixels high.
- The menu is a drawer behind the three-line button: the same one-level list.

## 9. The admin centre (paper)

Light and compact; it does not take the stage look.

**It follows the clock, like the public site** (owner, 14 November 2026: "in the admin panel, same process.
In the day, it will be light, and in the night, it will be dark"): its light paper from 07:00 to 18:00, its dark
look the rest of the time. The switch still works; a look chosen by hand holds until the next change of day
and night. (Before that day light was the default and dark was only ever chosen by hand.)
- The switch is `src/components/admin/AdminThemeSwitch.tsx`: a row at the foot of the admin menu, an icon button
  in the CRM's top bar. The choice is kept in the browser under `gennoor.admin.theme` (as "look|until") and is separate from the
  public site's (`src/lib/theme.ts`, the end of the file). It is put on the page before anything is drawn.
- Dark is the stage's own colour values (the class `stage` on `<html>`), nothing else of the stage. So there is
  no second set of colours to keep: **a page of the back office must write every colour by name**, exactly as a
  public page does (section 2). `python scripts/stage-codemod.py --admin` lists the ones that do not, and
  `--admin --apply` converts them. Never `bg-white`, never a grey or a blue as a hex.
- A solid button with white words (`bg-emerald-600 text-white`, `bg-blue-600 text-white`) is right in both
  looks because `src/styles/stage.css` gives those backgrounds their dark-look colour by class name. A new solid
  colour needs its line there, or its white words go pale on dark.
- A chart library takes colours as plain values and cannot read a variable. Its grid, axis words and tooltip
  are set for both looks in `src/styles/globals.css` (the `.recharts-` rules). Where the colour of a column is
  chosen in the page, choose it by look with `useDarkLook()` (`src/hooks/useDarkLook.ts`), as
  `src/app/admin/costs/page.tsx` does.
- **Measure both looks** before saying a page is done:
  `node scripts/contrast-check.mjs --back-office admin/learners crm/queue` (made-up data, see the file), or
  with the pages' real content on this machine and no word printed:
  `REAL=1 node --env-file=.env.local scripts/contrast-check.mjs --back-office admin admin/costs`.
  Then look at it, at 1366 and at 390 wide. Content starts at the top left and uses the full
width; long lists scroll inside themselves and have filters and pages; a list that is loading says so and
never says "nothing yet" before the answer has arrived.

- **The frame** is `src/components/admin/AdminShell.tsx`: the one-level menu (`GROUPS`), a line that says
  where you are, and on the dashboard its sections as two rows of tabs. On a phone the top bar says where
  you are and the menu is a drawer. In the drawer each group folds under its title, and only the group of
  the page you are on is open at first (owner, 19 November 2026); on a desktop the groups are always open.
  A group title is a fold, not a menu: the rows under it are still pages. A new page is one new row in
  `GROUPS`, nothing more.
- **Every list can be narrowed.** A list of records has a search and a date filter (`useListView` and
  `ListToolbar` in `src/components/admin/ListControls.tsx`, or `DateRangeFilter` beside the page's own
  filters). On the dashboard the period at the top applies to every section that has dates, and is hidden on
  the sections that have none (SEO health, indexing, setup), so no filter is ever shown that does nothing.
- **One circle at a time.** `src/components/BusyPointer.tsx` turns a small circle by the pointer while
  something pressed is working. It never switches on the browser's busy pointer, it stays away when the
  pressed button turns its own circle, opening another page is shown only by the thin bar at the top, and a
  reading stops turning after a few seconds (owner, 19 November 2026: two circles, and a circle on a page
  that was already there).
- **A page of figures** follows `src/app/admin/learners/page.tsx` (Learner analytics):
  - The period comes first, in one row above everything it scopes: ready-made periods, then your own dates.
    While another period is being read, the last figures stay in place, faded. No spinner in their place.
  - Headline numbers are tiles: a small label, the number, one line under it. The number has no colour.
  - One job for each chart and one axis for each chart. Two measures are two charts side by side, never
    two scales on one chart.
  - One series is one blue (`#2a78d6`). Finished, in progress and not started are one hue from dark to
    light, then grey (`#1c5cab`, `#5996e0`, `#a8b0be`). These passed the palette check of the `dataviz`
    skill on white and on the grey of a hovered row; put any other chart colour through the same check
    before using it. Words and numbers stay in the grey text colours, never in the colour of the series.
  - Columns are at most 24 pixels wide, rounded at the top, 2 pixels apart, standing on zero. Every
    column can be read by pointing at it and by tabbing to it.
  - The same numbers are in a table under the charts and in the Excel download.
  - A tile and the chart beside it are counted by the same code, so they always add up to the same total.
  - At the end of the page, a short list says how each figure is counted and what the site does not
    record. An estimate is never shown as if it were measured.
- **Reading the figures** happens in one file for each page (`src/lib/learner-analytics.ts`), behind an
  address that checks the sign-in (`verifyAdmin`). Learners' names and emails stay inside the admin centre.
- **Looking at an admin page.** `scripts/shot.mjs` cannot: these pages are behind the sign-in. Look at
  them signed in, in the browser, at 1366 and at 390 wide. The sign-in check is never weakened or switched
  off in anything that is committed.
- **Asking before doing.** A question to the person is a small window of the page, never the browser's own
  grey pop-up (`prompt`, `confirm`, `alert`): in the CRM, `ask()` from `useCrm()`
  (`src/components/crm/CrmContext.tsx`). It has a title that names the thing, one or two plain lines on
  what will happen, a field when a reason is wanted, and a red button only for a step that cannot be
  taken back. What happened afterwards is said by `notify()`.
- **Where things stand, in one row.** The CRM's `StepStrip` (`src/components/crm/shared.tsx`): a count
  under each step, in the order a lead moves through them. It is the summary on Today and the step
  filter on the Leads page. One row; not a board. The rest of the CRM's rules are in `docs/CRM.md`.
- **Words on a screen for staff are as plain as words for a visitor.** What happened and what to do next;
  never the name of a service, a permission or a status code on its own.

## 10. Before you say it is done

1. `npx tsc --noEmit` and `npx next build`.
2. Start the site (`npx next dev -p 3111`) and photograph the pages you touched, both looks, both widths:

       node scripts/shot.mjs <folder> --full home training          dark
       node scripts/shot.mjs <folder> --full --light home training  light

   Each page gives `<page>-1366.png` and `<page>-390.png`. Open them and look. (The pictures are dark
   unless `--light` is given, whatever the hour; the site itself follows the visitor's clock.)
3. Look for: text that cannot be read (light on light, dark on dark), a white or black box that
   does not belong, a button whose label is lost, a card the same colour as the page with no edge,
   something cut off or overlapping at 390, a sideways scrollbar.
   The owner's rule (13 November 2026): "when you change it to the light mode, the font should be
   properly visible." So measure it as well as look: `node scripts/contrast-check.mjs <pages>` opens each
   page in both looks and lists every piece of text that is hard to read. It must find none.
   It reads the words inside a drawing too. Until 14 November 2026 it skipped them (a drawing is hidden
   from screen readers, and the check took that to mean "not text"), and a dark bar with dark words on the
   Automation page went unnoticed until the owner saw it. It still cannot judge very large ghost numbers,
   the figure on an icon tile, or words over a photograph: look at those. And it sees a page as it opens,
   so a message that appears only after a button is pressed (a form's "sent", its error line, the hint
   inside a field) has to be looked at and measured by hand: 4.5 to 1 for small words.
4. A link, a form field name or an API address must not change when only the look changes.
5. A new page, or a page whose title changed: `node scripts/seo-head.mjs http://localhost:3111 <page>`
   and read what it prints against `docs/SEO.md`. Open its share picture (`/og/<key>`) and look at it.
6. After a change to `src/lib/theme.ts`, `PortalShell` or `ThemeSwitch`: `node scripts/look-check.mjs`.
   It must end with ALL OK.

## Emails

Every email the site sends is light all the way down, like the day look. The owner (13 November 2026),
about the navy band the emails used to open with, a small logo at the left of a wide dark strip: "looks
very blank ... I don't like that black color or blue color ... When it comes to our logo, we can have it
defined more appropriately."

- **The top is one picture**, `public/email/header.png`: the logo in the middle of a light band, in the
  brand's own lettering (Plus Jakarta Sans and Sora), with the ring of dots large and pale at both ends.
  `node scripts/email-art/logo.mjs` draws it. Never use the PNG files of `public/logos` in an email: they
  were made on a machine without the brand's lettering.
- **The frame** is `emailShell()` in `src/lib/crm/email-theme.ts`: that top, the body on white, a light
  foot with dark words. An email that builds its own frame takes `emailTop(title?, line?)` and
  `emailFoot()` from the same file. No dark band at the top, no dark foot, no navy block inside.
- **The one dark email** is the series the CRM sends (`briefShell()` in `src/lib/crm/brief-theme.ts`): a
  dark briefing with one moving picture, because the owner asked for exactly that on 12 November 2026
  ("not in the white background"). Its logo is `public/email/logo-dark.png`, drawn by the same script.
- **Email apps decide what is possible.** They remove SVG and brand fonts, and old Outlook lays a page
  out with Word. So: tables with their colour in `bgcolor`; pictures as PNG or GIF with a ground of
  their own (an app that turns pages dark then cannot make the logo unreadable); a width on every
  picture; nothing that needs a script.
- **Look before it ships.** Write the email to a file and photograph it 700 wide and 390 wide
  (`npx tsx scripts/crm-flow-test.ts --out <folder>`, then `node scripts/email-art/preview.mjs <folder> 640`
  for the series). Nobody can see from here how a real inbox draws it: say so.

## A dark block in the light look (`st-night`)

A block written white-on-navy carries `st-night`; in the light look it becomes a deep tint with dark
words. Two things went wrong once, and the rules now cover them:

- **A strength of white nobody had listed stayed white** (`text-white/65` on the AI Weekend page: white
  words on a light block). Every see-through white is now caught by the start of its class name, so write
  `text-white/NN` in any strength. A pale colour word (`text-green-300`, `text-primary-300`, ...) takes the
  deep shade of its colour. A colour written as a fixed value (`text-[#c4cede]`) is NOT caught unless it
  is added to the list in `src/styles/stage.css`: prefer the named classes.
- **A video player's own controls went dark on its black picture**, because the same rule reached inside
  it. `st-keep` on a thing, or on anything around it, leaves its colours alone. A player carries it
  (`PromoPlayer`).
- **A ground written as a fixed dark value, with words that follow the look** (the green bar of
  `ProcessFlow`, 14 November 2026): in the light look the words turned dark and the bar stayed dark.
  A ground and the words on it must change together. Give the ground a kit class that follows the look
  (`st-run`, `st-deep`, `st-solid`), never `style={{ background: ... }}` with a dark value.
- **The hint inside a field on such a block** is `placeholder:text-gray-500`. `-400` is too faint there in
  both looks (3.5 to 1 on the stage, 3.7 on the day look).

## Not to do

- No new colour families, no new fonts, no second icon style. Icons are lucide, on tiles.
- No shine, glow or shadow on an icon, no solid colour square behind one, and no tile larger than the
  sizes in section 3. The tiles are calm on purpose.
- No tile beside every line of text; no three identical cards where a sentence would do.
- No all-capitals labels except `st-kicker`; no accented word in every heading.
- No number shown large unless it is impressive and true.
