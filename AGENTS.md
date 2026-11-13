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
| Finishing: branch, pull request, merge, deploy | `.claude/skills/gennoor-ship/SKILL.md` | `gennoor-ship` |

The skills are in `.claude/skills/`. They are plain Markdown: any tool can read them.

## Rules that hold everywhere

1. **The look is decided.** Dark "stage" and light "day" for the public site, light "paper" for the admin
   centre. Colours by name, the icon-tile kit, one-level menus. Do not restyle from taste; follow `docs/DESIGN.md`.
2. **Look at what you made.** A change to a page is checked in both themes, on a desktop and on a phone
   (`node scripts/shot.mjs`), before it is called done.
3. **Never on `main`.** Branch, pull request, squash merge, then make the local folder identical to GitHub.
4. **Say what was not checked.** In the pull request and to the owner. Never claim more than was done.
5. **What is written for the public is plain and true.** No prices in the films, the presentation or the
   catalogue, and none on a page except where someone pays (the AI Weekend, a Learning Studio course).
   Courses are never called "free". No customer names. Only what exists or has been agreed. The AI Weekend
   is "the last weekend of every month, Saturday & Sunday". The Claude Partner line is used word for word.
6. **Only the look changes when the look changes.** Page addresses, form field names and API paths stay.
7. **Not without being asked:** sending a real email, typing a password or a secret, closing the owner's
   PowerPoint or Excel, deleting data.

## Commands

```bash
npx next dev -p 3111                                  # the site on this machine
npx tsc --noEmit && npx next build                     # before every pull request
node scripts/shot.mjs <folder> --full [--light] home training   # photographs of pages, 1366 and 390 wide
python scripts/stage-codemod.py                        # lists colours written as fixed values
```
