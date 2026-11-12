"""A light music bed for a film, made from scratch by this script.

    python scripts/show/music.py overview        -> scripts/show/.work/overview.music.wav
    python scripts/show/music.py weekend

Nothing is sampled or downloaded: every note is a few sine waves with an envelope and a
little room reverb, so there is no licence question wherever the film is shown. It is the
same idea, and the same sound, as the Course Factory chime the course videos open with:
warm pad chords in C, soft plucked notes over them, and the four-note bell to close.

The bed is written to sit UNDER a voice: no drums, nothing sudden, and mix.py turns it
down further whenever someone is speaking. Its length is the film's (read from the
narration timing), and it always ends on the home chord with the bell.
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
HERE = Path(__file__).resolve().parent
WORK = HERE / ".work"
film = sys.argv[1] if len(sys.argv) > 1 else "overview"
T = json.loads((WORK / f"{film}.timing.json").read_text(encoding="utf-8"))["duration"]
RNG = np.random.default_rng(11)

NAMES = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
hz = lambda note: 440.0 * 2 ** ((NAMES[note[:-1]] + 12 * (int(note[-1]) + 1) - 69) / 12)


def envelope(n, attack, release, level=1.0):
    a, r = min(int(attack * SR), n // 2), min(int(release * SR), n // 2)
    e = np.full(n, level)
    e[:a] = np.linspace(0, level, a) ** 1.5
    e[n - r:] = np.linspace(level, 0, r) ** 1.5
    return e


def pad(f, dur):
    """Warm and slow: a few harmonics, each played twice a hair apart so the note breathes."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for mult, amp in ((1, 1.0), (2, 0.32), (3, 0.10), (4, 0.04)):
        for detune in (-0.0028, 0.0028):
            y += amp * np.sin(2 * np.pi * f * mult * (1 + detune) * t + RNG.uniform(0, 6.28))
    return y * envelope(n, 1.3, 2.2)


def pluck(f, dur=1.8):
    """A soft marimba-like note."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 20)
    return y * np.exp(-t * 4.0) * np.minimum(1, t / 0.006)


def bell(f, dur=3.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t + 1.8 * np.exp(-t * 3) * np.sin(2 * np.pi * f * 3.5 * t))
    return y * np.exp(-t * 2.0) * np.minimum(1, t / 0.004)


def place(track, y, at, gain, pan=0.0):
    i = max(0, int(at * SR))
    y = y[: max(0, track.shape[1] - i)]
    track[0, i:i + len(y)] += gain * np.cos((pan + 1) * np.pi / 4) * y
    track[1, i:i + len(y)] += gain * np.sin((pan + 1) * np.pi / 4) * y


def room(x, seconds=2.4, wet=0.3):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = x.copy()
    for ch in range(2):
        ir = RNG.normal(0, 1, n) * np.exp(-t * 6.9 / seconds)
        ir[: int(0.014 * SR)] = 0
        ir /= np.sqrt((ir ** 2).sum())
        size = x.shape[1] + n
        out[ch] = (1 - wet) * x[ch] + wet * np.fft.irfft(np.fft.rfft(x[ch], size) * np.fft.rfft(ir, size))[: x.shape[1]]
    return out


def soften(x, cutoff=5200.0):
    """Take the edge off the top: a bed should never be brighter than the voice over it."""
    spectrum = np.fft.rfft(x, axis=1)
    freqs = np.fft.rfftfreq(x.shape[1], 1 / SR)
    return np.fft.irfft(spectrum / (1 + (freqs / cutoff) ** 4), x.shape[1], axis=1)


# The chords, lowest note first. Calm: C, A minor, F, G. Bright: C, G, A minor, F.
CHORDS = {
    "C": ["C3", "G3", "E4", "B4"], "Am": ["A2", "E3", "C4", "G4"], "F": ["F2", "C3", "A3", "E4"], "G": ["G2", "D3", "B3", "D4"],
    "home": ["C3", "G3", "E4", "C5"],
}
STYLE = {
    "overview": dict(order=["C", "Am", "F", "G"], bar=4.8, steps=8, pattern=[1, 0, 1, 1, 0, 1, 0, 1], pluck=0.14),
    "weekend": dict(order=["C", "G", "Am", "F"], bar=4.0, steps=8, pattern=[1, 1, 0, 1, 1, 0, 1, 1], pluck=0.16),
}[film]
bar, order = STYLE["bar"], STYLE["order"]
bars = max(3, int(np.ceil((T - 4.2) / bar)))            # everything before the closing chord
track = np.zeros((2, int((T + 3) * SR)))
climb = [0, 2, 1, 3, 2, 3, 1, 2]                          # which chord note each plucked step plays

for b in range(bars):
    name = order[b % len(order)]
    if b == bars - 1:
        name = "G"                                       # the last bar leans home
    notes = CHORDS[name]
    at = b * bar
    for j, note in enumerate(notes):
        place(track, pad(hz(note), bar + 2.6), at, 0.150, pan=(j - 1.5) * 0.32)
    place(track, pad(hz(notes[0]) / 2, bar + 1.5), at, 0.05)                      # the root, an octave down
    if b >= 1:                                                                     # the plucked notes come in on the second bar
        fuller = b > bars * 0.55                                                   # a little more in the last part of the film
        for s in range(STYLE["steps"]):
            if not (STYLE["pattern"][s] or (fuller and s % 2 == 1)):
                continue
            note = notes[climb[s]]
            f = hz(note) * (2 if climb[s] < 2 else 1) * (2 if fuller and s in (3, 7) else 1)
            place(track, pluck(f), at + s * bar / STYLE["steps"], STYLE["pluck"] * (0.75 + 0.25 * ((s * 7) % 5) / 4), pan=0.42 if s % 2 else -0.42)
    if b % 2 == 0 and b > 0:
        place(track, bell(hz(notes[-1]) * 2), at + 0.04, 0.045, pan=0.25)

end = bars * bar
for j, note in enumerate(CHORDS["home"]):
    place(track, pad(hz(note), T - end + 2.6), end, 0.165, pan=(j - 1.5) * 0.32)
place(track, pad(hz("C2"), T - end + 2.0), end, 0.09)
for i, note in enumerate(["G5", "E5", "D5", "C5"]):       # the course chime, to close
    place(track, bell(hz(note), 3.4), end + 0.5 + i * 0.3, 0.17, pan=-0.4 + i * 0.27)

y = soften(room(track))[:, : int(T * SR)]
fade_in, fade_out = int(1.6 * SR), int(2.4 * SR)
y[:, :fade_in] *= np.linspace(0, 1, fade_in)
y[:, -fade_out:] *= np.linspace(1, 0, fade_out) ** 1.4
y = y / (np.abs(y).max() + 1e-9) * 0.7

raw, out = WORK / f"{film}.music.raw.wav", WORK / f"{film}.music.wav"
with wave.open(str(raw), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(y.T, -1, 1) * 32767).astype("<i2").tobytes())
# Music sits well below the -16 LUFS narration (the course chime uses -22)
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(raw), "-af", "loudnorm=I=-23:TP=-2:LRA=11", "-ar", str(SR), "-ac", "2", str(out)], check=True)
raw.unlink()
print(f"{out}  {T:.1f}s, {bars} bars of {bar}s + the closing chord")
