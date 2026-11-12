"""Voices a film's narration in the course voice, and writes down when every word is said.

    "<Course Factory>/voice/.venv-tts/Scripts/python.exe" scripts/show/voice.py overview
    "<Course Factory>/voice/.venv-tts/Scripts/python.exe" scripts/show/voice.py weekend

Reads   scripts/show/narration/<film>.json
Writes  scripts/show/.work/<film>.voice.wav     the narration, mastered, 44.1 kHz mono
        scripts/show/.work/<film>.timing.json   start and end of every line and every word
        scripts/show/.work/<film>.voice.report.json   what the quality checks found

It does not have a voice of its own. It calls the Course Factory voice project
(speak.py: the locked recipe in voice.json, the pronunciation lexicon, the Whisper
misread check with re-takes, the HD pass and the mastering chain), so a film sounds
exactly like a course. Nothing in that project is changed. Everything runs on this
machine; nothing is uploaded.

Each line is kept in .work/voice/ under a name made from its words, so changing one
line, or only the pauses, does not record the others again.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
WORK = HERE / ".work"
VOICE_ROOT = Path(os.environ.get("VOICE_ROOT", r"C:\Users\losts\Desktop\Course Factory\voice"))
sys.path.insert(0, str(VOICE_ROOT / "scripts"))

film = sys.argv[1] if len(sys.argv) > 1 else "overview"
spec = json.loads((HERE / "narration" / f"{film}.json").read_text(encoding="utf-8"))
lines = spec["lines"]
CACHE = WORK / "voice"
CACHE.mkdir(parents=True, exist_ok=True)
key = lambda text: hashlib.sha1(text.encode("utf-8")).hexdigest()[:14]

import numpy as np            # noqa: E402
import soundfile as sf        # noqa: E402

missing = [ln for ln in lines if not (CACHE / f"{key(ln['text'])}.wav").exists()]
report = {"film": film, "lines": len(lines), "recorded_now": len(missing)}

if missing:
    import quality            # noqa: E402  (Course Factory)
    import speak              # noqa: E402  (Course Factory)
    import torch              # noqa: E402

    recipe = speak.load_recipe()
    params = dict(speak.STYLES[recipe["style"]])
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[voice] {len(missing)} line(s) to record on {device}; recipe {recipe['style']} {recipe['speed']}x seed {recipe['seed']}", flush=True)
    model, device = speak.load_model(device)

    # speak.render_checked returns one long recording. To know where each line sits in it, listen in on
    # the last step it runs for every line (pace_pauses): that gives each line's final length and words.
    seen: list[tuple[int, list[dict]]] = []
    original = quality.pace_pauses

    def listening(y, sr, words, *a, **k):
        out = original(y, sr, words, *a, **k)
        seen.append((len(out[0]), out[1]))
        return out

    quality.pace_pauses = listening
    gap = 0.45
    chunks = [(ln["text"], gap) for ln in missing]
    for text, _ in chunks:
        if len(text) > speak.MAX_CHARS:
            sys.exit(f"line too long for one breath ({len(text)} characters): {text[:60]}...")
    with tempfile.TemporaryDirectory() as td:
        audio, rep, device, sr = speak.render_checked(
            model, device, chunks, recipe["reference"], params, speed=recipe["speed"], seed=recipe["seed"],
            workdir=Path(td) / "takes",
            on_state=lambda st, msg: print(f"  [{st}] {msg}", flush=True),
            on_chunk=lambda i, n, c, s: print(f"  [{i}/{n}] {s:5.1f}s  {c[:60]}", flush=True))
    quality.pace_pauses = original
    y = audio.squeeze(0).numpy()
    at = int(speak.LEAD_PAD * sr)                     # render_checked starts with LEAD_PAD of silence
    assert len(seen) == len(missing), (len(seen), len(missing))
    for i, (ln, (n, words)) in enumerate(zip(missing, seen)):
        piece = y[at:at + n]
        sf.write(CACHE / f"{key(ln['text'])}.wav", piece, sr, subtype="FLOAT")
        (CACHE / f"{key(ln['text'])}.json").write_text(json.dumps({"text": ln["text"], "sr": sr, "words": words}), encoding="utf-8")
        at += n + int(gap / recipe["speed"] * sr)     # the silence render_checked puts after each line
    report.update(retakes=rep["retakes"], stray_cut=rep["stray_cut"], hd=rep["hd"], hd_error=rep.get("hd_error"),
                  imperfect=[{"line": missing[b["chunk"] - 1]["id"], "text": missing[b["chunk"] - 1]["text"], "heard_differently": b["diffs"], "problems": b["problems"]} for b in rep["best_effort"]])
    del model
    if device == "cuda":
        torch.cuda.empty_cache()

# ---- put the lines on the film's clock: lead, each line, its pad, tail
pieces, timing, t, sr = [], [], float(spec.get("lead", 1.0)), None
for ln in lines:
    y, this_sr = sf.read(CACHE / f"{key(ln['text'])}.wav", dtype="float32")
    sr = sr or this_sr
    assert this_sr == sr, "lines were recorded at different sample rates; delete .work/voice and record again"
    words = json.loads((CACHE / f"{key(ln['text'])}.json").read_text(encoding="utf-8"))["words"]
    timing.append({"id": ln["id"], "text": ln["text"], "start": round(t, 3), "end": round(t + len(y) / sr, 3),
                   "words": [{"w": w["w"], "start": round(t + w["start"], 3), "end": round(t + w["end"], 3)} for w in words]})
    pieces.append((t, y))
    t += len(y) / sr + float(ln.get("pad", 0.45))
total = t + float(spec.get("tail", 2.5))
track = np.zeros(int(total * sr) + 1, np.float32)
for start, y in pieces:
    a = int(start * sr)
    track[a:a + len(y)] += y

raw = WORK / f"{film}.voice.raw.wav"
out = WORK / f"{film}.voice.wav"
sf.write(raw, track, sr, subtype="FLOAT")
if missing or not out.exists() or True:
    import speak              # noqa: E402,F811
    speak.polish(raw, out, sr=sr)                     # the course mastering chain; it does not move anything in time
raw.unlink(missing_ok=True)
(WORK / f"{film}.timing.json").write_text(json.dumps({"film": film, "duration": round(total, 3), "sr": sr, "lines": timing}, indent=1), encoding="utf-8")
(WORK / f"{film}.voice.report.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
print(f"[done] {film}: {total:.1f}s -> {out}", flush=True)
print(json.dumps(report), flush=True)
