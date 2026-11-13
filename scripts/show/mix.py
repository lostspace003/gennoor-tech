"""Puts a film together: the picture, the voice and the music.

    python scripts/show/mix.py overview       -> public/videos/gennoor-what-we-do.mp4 (+ .jpg poster, + .vtt captions)
    python scripts/show/mix.py weekend        -> public/videos/gennoor-ai-weekend.mp4
    python scripts/show/mix.py weekend-reel   -> .work/reels/gennoor-ai-weekend-reel.mp4, the tall one (1080 x 1920)
                                                 for Instagram Reels, LinkedIn and phones, with a cover picture
    python scripts/show/mix.py overview-reel  -> .work/reels/gennoor-what-we-do-reel.mp4, "What we do" drawn tall

The tall films are too large to keep in the repository. They stay in .work/reels, and
`node scripts/show/upload-reels.mjs` puts them in the website's media store, where they are
reached as /media/videos/<name>.mp4. Their cover, poster and caption files are small and go
to public/videos with the others.

Needs, in scripts/show/.work/:  <film>.silent.mp4 (build.mjs film), <film>.voice.wav and
<film>.timing.json (voice.py), <film>.music.wav (music.py). A tall film ("-reel") has its own
picture but the voice and the music of the film it is made from, so it only needs
<film>.silent.mp4 and, for its cover, the stills build.mjs makes (stills weekend-reel).

What Instagram accepts for a Reel, and what this writes: MP4, H.264 picture and AAC sound,
1080 x 1920 (9:16), 30 pictures a second, up to 3 minutes (these films are 63 and 95 seconds),
far under the 4 GB limit. The cover is 1080 x 1920 with everything inside the middle 3:4, which is the
part the profile grid shows.

The music is turned down by itself whenever the voice speaks and comes back up in the
pauses. Two files are written: a master (best quality, kept in .work) and the one the
website plays, which is small enough to start at once.
"""
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
WORK = HERE / ".work"
film = sys.argv[1] if len(sys.argv) > 1 else "overview"
NAME = {"overview": "gennoor-what-we-do", "weekend": "gennoor-ai-weekend", "weekend-reel": "gennoor-ai-weekend-reel", "overview-reel": "gennoor-what-we-do-reel"}[film]
POSTER_AT = {"overview": 30.5, "weekend": 55.0, "weekend-reel": 55.0, "overview-reel": 7.6}[film]     # the moment used as the still picture before it plays
TALL = film.endswith("-reel")
SOUND = film[:-5] if TALL else film        # whose voice, music and word timings the film uses
COVER = {"weekend-reel": "cta", "overview-reel": "vision"}.get(film)    # the scene whose finished still is the cover picture
PUBLIC = ROOT / "public" / "videos"
PUBLIC.mkdir(parents=True, exist_ok=True)


def ff(*args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *map(str, args)], check=True)


silent, voice, music = WORK / f"{film}.silent.mp4", WORK / f"{SOUND}.voice.wav", WORK / f"{SOUND}.music.wav"
REELS = WORK / "reels"
REELS.mkdir(parents=True, exist_ok=True)
master, web = WORK / f"{NAME}.master.mp4", (REELS if TALL else PUBLIC) / f"{NAME}.mp4"

# Voice in the middle; music under it, ducked while the voice is speaking; a limiter so nothing clips.
audio = (
    "[1:a]aresample=48000,pan=stereo|c0=0.8*c0|c1=0.8*c0,asplit=2[v][key];"
    "[2:a]aresample=48000,volume=1.0[m];"
    "[m][key]sidechaincompress=threshold=0.025:ratio=3:attack=60:release=700:makeup=1[bed];"
    "[v][bed]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]"
)
ff("-i", silent, "-i", voice, "-i", music, "-filter_complex", audio, "-map", "0:v", "-map", "[a]",
   "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", master)
# The website's copy: same picture size, lighter. The tall one is the file that gets posted, so it keeps more detail.
ff("-i", master, "-c:v", "libx264", "-preset", "slow", "-crf", "20" if TALL else "24", "-pix_fmt", "yuv420p", "-profile:v", "high", "-r", "30",
   "-c:a", "aac", "-b:a", "192k" if TALL else "128k", "-ar", "48000", "-movflags", "+faststart", web)
ff("-ss", POSTER_AT, "-i", master, "-frames:v", "1", "-q:v", "3", PUBLIC / f"{NAME}-poster.jpg")
if TALL:
    # The cover: the closing scene without the caption bar, as build.mjs drew it
    still = WORK / "stills" / f"{film}-{COVER}.png"
    if still.exists():
        ff("-i", still, "-vf", "scale=1080:1920", "-q:v", "2", PUBLIC / f"{NAME}-cover.jpg")
    else:
        print(f"no cover: run  node scripts/show/build.mjs stills {film}  first")

# Captions as a text file too, for players that show their own and for anyone who wants the words
timing = json.loads((WORK / f"{SOUND}.timing.json").read_text(encoding="utf-8"))
stamp = lambda s: f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{s % 60:06.3f}"
cues = []
for line in timing["lines"]:
    start = 0
    for i, w in enumerate(line["words"]):
        if w["w"].rstrip("\"')]")[-1:] in ".?!" or i == len(line["words"]) - 1:
            cues.append((line["words"][start]["start"], w["end"] + 0.3, " ".join(x["w"] for x in line["words"][start:i + 1])))
            start = i + 1
(PUBLIC / f"{NAME}.vtt").write_text("WEBVTT\n\n" + "\n\n".join(f"{stamp(a)} --> {stamp(b)}\n{t}" for a, b, t in cues) + "\n", encoding="utf-8")

# What the website needs to know about the film: where it is, how long, and its words (for screen readers)
TITLE = {"overview": "What we do", "weekend": "The Gennoor AI Weekend"}[SOUND]
facts = ROOT / "src" / "data" / "films.json"
films = json.loads(facts.read_text(encoding="utf-8")) if facts.exists() else {}
KEY = f"{SOUND}Reel" if TALL else film
films[KEY] = {"title": TITLE, "src": f"/media/videos/{NAME}.mp4" if TALL else f"/videos/{NAME}.mp4", "poster": f"/videos/{NAME}-poster.jpg", "captions": f"/videos/{NAME}.vtt",
               "seconds": round(timing["duration"]), "transcript": " ".join(line["text"] for line in timing["lines"])}
if TALL:
    films[KEY].update({"cover": f"/videos/{NAME}-cover.jpg", "width": 1080, "height": 1920})
facts.write_text(json.dumps(films, indent=2) + "\n", encoding="utf-8")

size = lambda p: f"{p.stat().st_size / 1e6:.1f} MB"
print(f"master {master} {size(master)}\nweb    {web} {size(web)}\nposter {NAME}-poster.jpg, captions {NAME}.vtt ({len(cues)} cues), {timing['duration']:.1f}s")
