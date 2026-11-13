---
name: gennoor-films
description: Make or change Gennoor's films, presentation and social videos - the "What we do" film, the AI Weekend film, their tall Instagram/LinkedIn versions (1080x1920) and the PowerPoint presentation, all drawn from the scenes in scripts/show with the owner's own voice. Use when asked to change a film or the presentation, add a slide or a scene, re-record a line, make an Instagram/Reel/LinkedIn/vertical version, update the catalogue workbook, or put the videos in the Desktop "Videos" folder.
---

# Films, presentation and social videos

Everything is drawn from one set of HTML scenes in `scripts/show/`. Read `scripts/show/README.md`
first: it lists every file and every command. This file is the order of work and the owner's rules.

## What exists

| Thing | Built by | Ends up |
|---|---|---|
| Film "What we do" (wide) | `build.mjs film overview` → `mix.py overview` | `public/videos/gennoor-what-we-do.mp4`, home page |
| Film "AI Weekend" (wide) | `build.mjs film weekend` → `mix.py weekend` | `public/videos/gennoor-ai-weekend.mp4`, home and /ai-weekend |
| Both films, tall 9:16 | `build.mjs film <film>-reel` → `mix.py <film>-reel` → `upload-reels.mjs` | `/media/videos/…-reel.mp4` (media store), covers in `public/videos` |
| Presentation | `build.mjs deck overview` → `deck.py overview` | `public/Gennoor-Tech-Catalog/Gennoor-Tech-Overview.pptx` |
| Catalogue workbook | `scripts/catalog/extract-site-data.ts` → `build-catalog-xlsx.py` | `public/Gennoor-Tech-Catalog/Gennoor-Tech-Catalog.xlsx` |
| Presenter's script for the presentation | written by hand: `scripts/show/presenter/1 - What we do (presenter script, slide by slide).txt` | the owner's `Videos` folder, beside the presentation |

The owner's copies live in `C:\Users\losts\Desktop\Videos` (the four films and two Instagram covers, from the
`.master.mp4` files in `scripts/show/.work`; the presentation, its presenter's script and the catalogue) and
`C:\Users\losts\Desktop\Gennoor Films` (presentation, its script, catalogue).
Copy the new files there whenever a film or the presentation changes.

**Names in the `Videos` folder** (owner, 13 November 2026): a file is named like the video it belongs to. The
main film is `1 - What we do (website and LinkedIn, wide 16x9).mp4`, so its presentation is
`1 - What we do (presentation for client calls).pptx` and its script is
`1 - What we do (presenter script, slide by slide).txt`. The catalogue is
`5 - Gennoor Tech course catalogue (Excel).xlsx`. The presentation and its script belong to the main film
only; the AI Weekend film has no presentation of its own (it is one slide of this one).

## The presenter's script

For a client call, a person with no technical background presents the deck from this script. The owner's
words: "simple way so that a non-technical person can explain and understand", "in TXT slide by slide",
and, on the first version: "I don't want click by click, I want slide by slide."

- One section per slide, in the order of the deck: **the slide shows**, **say**, **in plain words**, and
  where its blue button goes. Nothing about which click brings what.
- Plain text, no special characters, so it opens anywhere.
- It says only what the slide and its `notes` in `js/scenes-overview.js` say. No price, no client names,
  the Claude Partner line word for word, "about 60% less classroom time" always as an aim.
- It ends with a five-minute version, plain answers to the questions clients ask, and a short word list.
- When a slide is added, removed or changed, change its section, then copy the file to both folders.

## The order of work

1. **Words**: edit `narration/<film>.json`. One entry is one breath.
2. **Voice**: `PYTHONIOENCODING=utf-8 "C:\Users\losts\Desktop\Course Factory\voice\.venv-tts\Scripts\python.exe" scripts/show/voice.py <film>`.
   Only changed lines are recorded. Read `.work/<film>.voice.report.json`: `imperfect` must be empty.
3. **Picture**: edit the scene in `js/scenes-<film>.js`; `node scripts/show/build.mjs stills <film> <scene>` and look.
4. **Film**: `build.mjs film <film>`, `python scripts/show/music.py <film>` (only if the length changed), `python scripts/show/mix.py <film>` (needs ffmpeg on PATH: `C:\Users\losts\ffmpeg\bin`).
5. **Tall versions**: change the same scene in `js/scenes-<film>-reel.js`, then `stills`, `film`, `mix.py <film>-reel`, `node scripts/show/upload-reels.mjs`.
6. **Presentation** (if the scene is in it): `build.mjs deck overview`, `python scripts/show/deck.py overview`, `pwsh scripts/show/check-deck.ps1`.
7. **Look**: pull frames from the finished film (`ffmpeg -ss <t> -i <file> -frames:v 1`) at each scene and look at them.

## The owner's rules

- **The voice is the owner's**, from the Course Factory voice project. It runs on this machine only.
  Never change its recipe or its files; never use another voice or a paid service.
- **The company name is not spoken** (the logo shows it). "Claude" is said through the voice lexicon.
- **No prices** in films or the presentation. **No dates**: the AI Weekend is "the last weekend of every
  month, Saturday & Sunday".
- **Vision first, few words, more picture.** Do not show a small number as if it were impressive.
- **Custom automation training** is part of what we do and has its own scene and slide.
- **The Claude Partner line** word for word, badge on its white card.
- The presentation is **click by click**, and every section ends with a button to its page on the website.

## Instagram and LinkedIn

- A Reel is MP4 (H.264 picture, AAC sound), 9:16 at 1080 x 1920, 30 frames a second, up to 3 minutes made
  in the app (longer by upload), under 4 GB. LinkedIn takes the same file (3 seconds to 10 minutes, 5 GB)
  and the wide films.
- The apps cover the top and bottom of the picture and the right edge. In the 720 x 1280 scene, everything
  to be read sits between 180 and 866 down and 48 and 632 across; the spoken words are burned in just under
  that. The drawing at the top of `js/scenes-weekend-reel.js` shows it.
- A tall film is laid out again, scene by scene. Never crop the wide film.
- The cover keeps everything inside the middle 3:4 (the profile grid).

## Things that have gone wrong

- **PowerPoint had the presentation open**, so the file could not be replaced. `deck.py` saves to
  `.work/overview.pptx` first and says so. Never close the owner's PowerPoint; ask, or wait.
- `~$…pptx` lock files appear while it is open. Never commit them.
- **Nobody can hear the film from here.** Say so in the pull request; the owner listens and confirms.
- A scene that is empty for seconds while the voice talks means a cue is tied to the wrong word: fix the `cues`.
- Large videos do not go in the repository: over about 10 MB they go to the media store (`upload-reels.mjs`).
