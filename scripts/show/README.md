# The Gennoor show: one set of scenes, the presentation and the films

The scenes in this folder are drawn once, as HTML, and become:

| Result | Where it ends up | What it is for |
|---|---|---|
| The presentation | `public/Gennoor-Tech-Catalog/Gennoor-Tech-Overview.pptx` | A live conversation. Everything arrives on a mouse click, every section links to its page on the website. |
| The film "What we do" | `public/videos/gennoor-what-we-do.mp4` | The centre of the home page. About a minute and a half, with voice and music. |
| The AI Weekend film | `public/videos/gennoor-ai-weekend.mp4` | The home page and the AI Weekend page. About a minute. |
| Both films, tall | The website's media store: `/media/videos/gennoor-what-we-do-reel.mp4`, `/media/videos/gennoor-ai-weekend-reel.mp4` | Instagram Reels, LinkedIn on a phone, WhatsApp status. 1080 x 1920, each with a cover picture (`public/videos/…-reel-cover.jpg`). |

## What is in the folder

| File | What it holds |
|---|---|
| `js/scenes-overview.js`, `js/scenes-weekend.js` | The scenes: what is on screen, in what order it arrives, and what to say |
| `js/scenes-overview-reel.js`, `js/scenes-weekend-reel.js` | The same scenes laid out again for an upright screen |
| `narration/*.json` | What the voice says in each film, line by line |
| `css/stage.css`, `js/kit.js` | The look: colours, type, icons, the logo ring, windows |
| `js/engine.js` | How things move, in a film and in the presentation |
| `build.mjs` | Opens the scenes in Chrome and photographs them (stills, deck pieces, film frames) |
| `deck.py` | Builds the PowerPoint, with its click animations and links |
| `voice.py` | Records the narration in the course voice (uses the Course Factory voice project) |
| `music.py` | Makes the music bed from scratch, so there is no licence question |
| `mix.py` | Joins picture, voice and music, and writes the website's copy |
| `check-deck.ps1` | Opens the deck in PowerPoint and saves a picture of every slide |

## To change the presentation

1. Edit the scene in `js/scenes-overview.js`.
2. `node scripts/show/build.mjs stills overview` and look at `.work/stills/`.
3. `node scripts/show/build.mjs deck overview` then `python scripts/show/deck.py overview`.
4. `pwsh scripts/show/check-deck.ps1` and look at `.work/deck-check/`.

Numbers and course pictures come from the website: run
`npx tsx --env-file=.env.local scripts/catalog/extract-site-data.ts` first if courses changed.

## To change a film

1. Words: edit `narration/<film>.json`, then record:
   `"C:\Users\losts\Desktop\Course Factory\voice\.venv-tts\Scripts\python.exe" scripts/show/voice.py <film>`
   Only lines whose words changed are recorded again. Read `.work/<film>.voice.report.json`:
   it lists any line the listening check was not happy with.
2. Picture: edit the scene; `node scripts/show/build.mjs film <film>` (add two numbers, such as `12 20`, to draw only those seconds).
3. `python scripts/show/music.py <film>` (only if the length changed), then `python scripts/show/mix.py <film>`.

## The tall films (Instagram, LinkedIn, phones)

A tall film is the same film held upright: the same words, the same voice and music, and its
own layout of every scene. Nothing is recorded again.

    node scripts/show/build.mjs stills weekend-reel     look at .work/stills/ (the cover picture is made from these)
    node scripts/show/build.mjs film weekend-reel
    python scripts/show/mix.py weekend-reel
    node scripts/show/upload-reels.mjs                   puts the tall films in the website's media store

and the same with `overview-reel`. The tall films are too large for the repository: they are
written to `.work/reels/` and reached on the website as `/media/videos/<name>.mp4`. When a scene or a line of a film changes, change its tall
scene too and run these again.

- What Instagram takes for a Reel: MP4 with H.264 picture and AAC sound, 9:16 at 1080 x 1920,
  30 pictures a second, up to 3 minutes. The files written here are that. LinkedIn takes the
  same file (it allows up to 10 minutes) and also the wide films.
- The apps cover part of the picture with their own header, caption and buttons. Everything a
  viewer must read sits between 180 and 866 down and 48 and 632 across (of 720 x 1280); the
  words being spoken are written just under that. The drawing at the top of
  `js/scenes-weekend-reel.js` shows it.
- The cover picture keeps everything inside the middle 3:4, which is what the profile grid shows.

## To add a scene

Copy a scene in the scenes file and change it. The rules are short:

- Anything with `data-b="n"` arrives on beat `n`. Beat 0 arrives when the scene opens.
  In the presentation every later beat is one click; in a film a beat arrives when its
  word is spoken (`cues` ties beats to narration lines and words).
- Keep words few. The presenter or the narrator says the rest; put it in `notes`.
- End a presentation scene with `go(label, path)`: the button to that page on the website.
  The deck shows some of what we do today; the website is where new things appear.
- `film: false` keeps a scene out of the films.

## Rules the content follows

- No prices. Cost depends on scope and is for a call.
- The company name is not spoken in the films (the logo shows it), so it cannot be mispronounced.
- The Claude Partner Network line is used word for word, with the badge on its white card.
- The films carry what is said as text at the foot of the picture, because they start without sound.
