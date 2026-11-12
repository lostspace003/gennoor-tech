"""Puts a film together: the picture, the voice and the music.

    python scripts/show/mix.py overview     -> public/videos/gennoor-what-we-do.mp4 (+ .jpg poster, + .vtt captions)
    python scripts/show/mix.py weekend      -> public/videos/gennoor-ai-weekend.mp4

Needs, in scripts/show/.work/:  <film>.silent.mp4 (build.mjs film), <film>.voice.wav and
<film>.timing.json (voice.py), <film>.music.wav (music.py).

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
NAME = {"overview": "gennoor-what-we-do", "weekend": "gennoor-ai-weekend"}[film]
POSTER_AT = {"overview": 30.5, "weekend": 55.0}[film]     # the moment used as the still picture before it plays
PUBLIC = ROOT / "public" / "videos"
PUBLIC.mkdir(parents=True, exist_ok=True)


def ff(*args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *map(str, args)], check=True)


silent, voice, music = WORK / f"{film}.silent.mp4", WORK / f"{film}.voice.wav", WORK / f"{film}.music.wav"
master, web = WORK / f"{NAME}.master.mp4", PUBLIC / f"{NAME}.mp4"

# Voice in the middle; music under it, ducked while the voice is speaking; a limiter so nothing clips.
audio = (
    "[1:a]aresample=48000,pan=stereo|c0=0.8*c0|c1=0.8*c0,asplit=2[v][key];"
    "[2:a]aresample=48000,volume=1.0[m];"
    "[m][key]sidechaincompress=threshold=0.025:ratio=3:attack=60:release=700:makeup=1[bed];"
    "[v][bed]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]"
)
ff("-i", silent, "-i", voice, "-i", music, "-filter_complex", audio, "-map", "0:v", "-map", "[a]",
   "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", master)
# The website's copy: same picture size, lighter
ff("-i", master, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-profile:v", "high",
   "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", web)
ff("-ss", POSTER_AT, "-i", master, "-frames:v", "1", "-q:v", "3", PUBLIC / f"{NAME}-poster.jpg")

# Captions as a text file too, for players that show their own and for anyone who wants the words
timing = json.loads((WORK / f"{film}.timing.json").read_text(encoding="utf-8"))
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
TITLE = {"overview": "What we do", "weekend": "The Gennoor AI Weekend"}[film]
facts = ROOT / "src" / "data" / "films.json"
films = json.loads(facts.read_text(encoding="utf-8")) if facts.exists() else {}
films[film] = {"title": TITLE, "src": f"/videos/{NAME}.mp4", "poster": f"/videos/{NAME}-poster.jpg", "captions": f"/videos/{NAME}.vtt",
               "seconds": round(timing["duration"]), "transcript": " ".join(line["text"] for line in timing["lines"])}
facts.write_text(json.dumps(films, indent=2) + "\n", encoding="utf-8")

size = lambda p: f"{p.stat().st_size / 1e6:.1f} MB"
print(f"master {master} {size(master)}\nweb    {web} {size(web)}\nposter {NAME}-poster.jpg, captions {NAME}.vtt ({len(cues)} cues), {timing['duration']:.1f}s")
