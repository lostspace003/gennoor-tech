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
| **Stage** (dark) | `stage` | Every public page. The site opens in this one. |
| **Day** (light) | `day` | The same public pages when the visitor picks "Light". Soft grey paper, never pure white. |
| **Paper** | none | The admin centre, the CRM, the lesson players. Light and compact. |

- A small script in `src/app/layout.tsx` puts the class on `<html>` before the page is drawn;
  `PortalShell` keeps it right while moving between pages; `ThemeSwitch` (foot of the menu, top bar on a
  phone) changes it. The choice is kept in the visitor's browser (`gennoor.theme`).
- Which pages get no theme is decided in one place, `isChromelessRoute()` in `src/lib/chrome.ts`,
  and repeated in `THEME_SCRIPT` in `src/lib/theme.ts`. Change both together.
- **A part that must stay dark on both themes** (a film panel, the top of a page) carries the class
  `stage` itself. `<Ground>` does this for you.

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
| `bg-inverse` | a block that is dark on every look |

Rules:

1. **Never a hex in brackets for a neutral or the blue** (`text-[#6e6e73]`), and **never `bg-white`**.
   They cannot change with the theme. `python scripts/stage-codemod.py` finds and converts them.
2. `gray` is a ramp of **roles**, not of lightness: on the stage `text-gray-900` is near-white.
   Do not use `bg-gray-800/900` to mean "dark"; use `bg-inverse`, or `<Ground>`.
3. A fixed colour is right only when it is the same on every look: brand colours (the gold
   `#ffc24b`, WhatsApp, LinkedIn, Trustpilot), the cream card behind the Claude Partner badge
   (`#f0eee6`, dark text on it), a white label on a photograph (`bg-[#fff]`).
4. Inline `style={{ color: '#...' }}` follows the same rule: use `'rgb(var(--gray-900))'`.

## 3. The kit

React pieces are in `src/components/stage/`; their classes start with `st-`.

| Piece | Use it for |
|---|---|
| `<Ico icon tone size />` | The icon tile: a lucide icon on a glass tile. One per idea. |
| `<SparkIco code />` | The Claude spark, with a certification code under it. |
| `<Ground glow>` | A lit, dark part of a page: the top, and one or two bands that should be noticed. |
| `<Reveal>` | Holds the arrival of what is inside until it is on screen. |
| `<Ring>`, `<Mark>` | The dotted ring of the logo. The only ornament. Behind a statement, never behind a list. |
| `<ProcessFlow>` | The picture of a process done by hand, then running by itself. |
| `st-card` | A card. `st-gold` for the AI Weekend, `st-solid` + `stage` for one that is dark on both themes. |
| `st-pill` | The main button. `st-gold` for the AI Weekend, `st-ghost` for a second button, `st-sm` small. |
| `st-link` | A text link, with `›` after the words. |
| `st-chip` | A small label; `<i />` first inside it is its dot (`--dot` sets the colour). |
| `st-kicker` | The small gold label above a heading. Only where it says something the heading does not. |
| `st-grad` + `st-serif` | The one accented phrase of a page. Once per page at most. |
| `st-num` | The large pale number behind a step. Only when the steps really are a sequence. |
| `st-win`, `st-win-bar` | A window drawn in a picture (a lesson, a process). Dark on both themes. |

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
- The Claude Partner line is used word for word (`TIER_LINE` in `src/components/ClaudePartner.tsx`), with the
  badge on its cream card. Never recolour the badge, never add a tier claim.
- Courses are never called "free". Preview lessons "play without signing in".

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

Light and compact; it does not take the stage look. Content starts at the top left and uses the full
width; long lists scroll inside themselves and have filters and pages; a list that is loading says so and
never says "nothing yet" before the answer has arrived.

## 10. Before you say it is done

1. `npx tsc --noEmit` and `npx next build`.
2. Start the site (`npx next dev -p 3111`) and photograph the pages you touched, both looks, both widths:

       node scripts/shot.mjs <folder> --full home training          dark
       node scripts/shot.mjs <folder> --full --light home training  light

   Each page gives `<page>-1366.png` and `<page>-390.png`. Open them and look.
3. Look for: text that cannot be read (light on light, dark on dark), a white or black box that
   does not belong, a button whose label is lost, a card the same colour as the page with no edge,
   something cut off or overlapping at 390, a sideways scrollbar.
4. A link, a form field name or an API address must not change when only the look changes.

## Not to do

- No new colour families, no new fonts, no second icon style. Icons are lucide, on tiles.
- No tile beside every line of text; no three identical cards where a sentence would do.
- No all-capitals labels except `st-kicker`; no accented word in every heading.
- No number shown large unless it is impressive and true.
