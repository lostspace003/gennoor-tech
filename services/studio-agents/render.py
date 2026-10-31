"""
Motion-graphic renderer: a JSON scene spec in, an animated GIF and an MP4 out.

The design agent writes the spec; this module only draws it, so a scene can be edited by hand and re-rendered
without calling a model again. Everything is deterministic: frame N depends only on the spec and N.

Scene spec (all positions are 0..1 fractions of the canvas, all times are seconds):
{
  "width": 1080, "height": 1080, "fps": 15, "duration": 6,
  "background": {"from": "#0b1b3a", "to": "#1d4ed8", "angle": 135},
  "elements": [
    {"type": "text",   "text": "Hello", "x": .5, "y": .4, "size": 90, "color": "#fff", "bold": true, "align": "center",
                       "max_width": .8, "in": {"at": 0.2, "dur": .6, "anim": "slide-up"}, "out": {"at": 5.4, "dur": .4}},
    {"type": "shape",  "shape": "rect|circle|line", "x": .1, "y": .1, "w": .3, "h": .02, "color": "#38bdf8", "radius": 12,
                       "in": {"at": 0, "dur": .5, "anim": "grow-x"}},
    {"type": "bar",    "x": .1, "y": .8, "w": .05, "h": .3, "color": "#38bdf8", "in": {"at": 1, "dur": .8, "anim": "grow-y"}},
    {"type": "counter","from": 0, "to": 87, "suffix": "%", "x": .5, "y": .5, "size": 160, "color": "#fff", "in": {"at": 1, "dur": 1.5}},
    {"type": "image",  "data": "<base64 png/jpg>", "motion": "zoom-in|zoom-out|pan-left|pan-right", "fit": "cover"}
  ]
}
anim: fade | slide-up | slide-down | slide-left | slide-right | scale | grow-x | grow-y | typewriter
"""
from __future__ import annotations

import base64
import io
import math
import os
import subprocess
import tempfile
from dataclasses import dataclass
from typing import Any

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

MAX_PIXELS = 1920 * 1080
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
BAR_COLOUR = (12, 20, 38)  # matches the dark logo variant, so the logo sits on the bar seamlessly
SITE = os.getenv("BRAND_SITE", "gennoor.com")
_logo: Image.Image | None = None


def _brand_logo() -> Image.Image | None:
    global _logo
    if _logo is None:
        p = os.path.join(ASSETS, "logo.png")
        _logo = Image.open(p).convert("RGB") if os.path.exists(p) else None
    return _logo


def bar_height(h: int) -> int:
    return max(64, int(h * 0.105))


def draw_brand_bar(img: Image.Image, top: int, bar_h: int, alpha: float = 1.0) -> None:
    """The Gennoor footer: dark bar, real logo on the left, the website on the right. Drawn on an RGBA image."""
    w = img.width
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rectangle((0, top, w, top + bar_h), fill=BAR_COLOUR + (255,))
    logo = _brand_logo()
    if logo is not None:
        lh = bar_h
        lw = int(logo.width * lh / logo.height)
        layer.paste(logo.resize((lw, lh), Image.LANCZOS).convert("RGBA"), (int(w * 0.015), top))
    font = _font(max(16, int(bar_h * 0.42)), True)
    tw = d.textlength(SITE, font=font)
    d.text((w - tw - int(w * 0.03), top + bar_h / 2), SITE, font=font, fill=(147, 197, 253, 255), anchor="lm")
    _blend(img, layer, alpha)


def brand_image(png: bytes) -> bytes:
    """Adds the footer under a still image (the canvas grows, so none of the artwork is covered)."""
    src = Image.open(io.BytesIO(png)).convert("RGB")
    bh = bar_height(src.height)
    out = Image.new("RGBA", (src.width, src.height + bh), BAR_COLOUR + (255,))
    out.paste(src.convert("RGBA"), (0, 0))
    draw_brand_bar(out, src.height, bh)
    buf = io.BytesIO()
    out.convert("RGB").save(buf, format="PNG", optimize=True)
    return buf.getvalue()
MAX_SECONDS = 15
MAX_FPS = 30

_FONT_DIRS = ["/usr/share/fonts/truetype/dejavu", "C:/Windows/Fonts", "/System/Library/Fonts/Supplemental", "/Library/Fonts"]
_FONT_FILES = {False: ["DejaVuSans.ttf", "segoeui.ttf", "Arial.ttf"], True: ["DejaVuSans-Bold.ttf", "segoeuib.ttf", "Arial Bold.ttf", "arialbd.ttf"]}
_font_cache: dict[tuple[int, bool], ImageFont.FreeTypeFont | ImageFont.ImageFont] = {}


def _font(size: int, bold: bool):
    key = (size, bold)
    if key not in _font_cache:
        font = None
        for d in _FONT_DIRS:
            for f in _FONT_FILES[bold]:
                p = os.path.join(d, f)
                if os.path.exists(p):
                    font = ImageFont.truetype(p, size)
                    break
            if font:
                break
        _font_cache[key] = font or ImageFont.load_default(size)
    return _font_cache[key]


def _rgb(c: str, default=(255, 255, 255)) -> tuple[int, int, int]:
    try:
        c = c.lstrip("#")
        if len(c) == 3:
            c = "".join(ch * 2 for ch in c)
        return int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16)
    except Exception:
        return default


def _ease(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1 - pow(1 - t, 3)  # ease-out cubic


@dataclass
class Visible:
    p: float  # 0..1 progress of the entrance animation (eased)
    alpha: float  # 0..1
    anim: str


def _visibility(el: dict[str, Any], t: float) -> Visible | None:
    i = el.get("in") or {}
    at, dur, anim = float(i.get("at", 0)), max(0.01, float(i.get("dur", 0.5))), i.get("anim", "fade")
    if t < at:
        return None
    p = _ease((t - at) / dur)
    alpha = p if anim in ("fade", "typewriter") or anim.startswith("slide") or anim == "scale" else 1.0
    o = el.get("out")
    if o:
        oat, odur = float(o.get("at", 1e9)), max(0.01, float(o.get("dur", 0.4)))
        if t >= oat:
            alpha *= max(0.0, 1 - (t - oat) / odur)
            if alpha <= 0:
                return None
    return Visible(p, alpha, anim)


def _gradient(w: int, h: int, c1, c2, angle: float) -> Image.Image:
    a = math.radians(angle)
    dx, dy = math.cos(a), math.sin(a)
    # Build a 1-D ramp and stretch it; far cheaper than per-pixel maths.
    steps = 256
    ramp = [tuple(int(c1[k] + (c2[k] - c1[k]) * s / (steps - 1)) for k in range(3)) for s in range(steps)]
    img = Image.new("RGB", (w, h))
    px = img.load()
    span = abs(dx) * w + abs(dy) * h or 1
    for y in range(h):
        for x in range(w):
            s = ((x * dx + y * dy) / span) + (0 if dx >= 0 and dy >= 0 else 0.5)
            px[x, y] = ramp[max(0, min(steps - 1, int(s * (steps - 1))))]
    return img


def _wrap(draw: ImageDraw.ImageDraw, text: str, font, max_w: int) -> list[str]:
    lines: list[str] = []
    for para in text.split("\n"):
        cur = ""
        for word in para.split(" "):
            test = f"{cur} {word}".strip()
            if draw.textlength(test, font=font) <= max_w or not cur:
                cur = test
            else:
                lines.append(cur)
                cur = word
        lines.append(cur)
    return lines


def _blend(base: Image.Image, layer: Image.Image, alpha: float) -> None:
    if alpha < 1:
        a = layer.getchannel("A").point(lambda v: int(v * alpha))
        layer.putalpha(a)
    base.alpha_composite(layer)


class Scene:
    def __init__(self, spec: dict[str, Any]):
        self.w = int(spec.get("width", 1080))
        self.h = int(spec.get("height", 1080))
        if self.w * self.h > MAX_PIXELS or self.w < 64 or self.h < 64:
            raise ValueError("Canvas must be between 64px and 1920x1080.")
        self.fps = max(5, min(MAX_FPS, int(spec.get("fps", 15))))
        self.duration = max(1.0, min(MAX_SECONDS, float(spec.get("duration", 6))))
        self.elements: list[dict[str, Any]] = list(spec.get("elements", []))[:60]
        self.brand = spec.get("brand", True) is not False
        # Scene positions (0..1) map into the area ABOVE the footer, so no element can ever overlap the logo bar.
        self.ch = self.h - (bar_height(self.h) if self.brand else 0)
        bg = spec.get("background") or {}
        c1, c2 = _rgb(bg.get("from", "#0b1b3a")), _rgb(bg.get("to", bg.get("from", "#1d4ed8")))
        self.bg = _gradient(self.w, self.h, c1, c2, float(bg.get("angle", 135))).convert("RGBA")
        self._images: dict[int, Image.Image] = {}
        for idx, el in enumerate(self.elements):
            if el.get("type") == "image" and el.get("data"):
                raw = base64.b64decode(el["data"].split(",")[-1])
                self._images[idx] = Image.open(io.BytesIO(raw)).convert("RGB")

    @property
    def frames(self) -> int:
        return int(self.duration * self.fps)

    def frame(self, n: int) -> Image.Image:
        t = n / self.fps
        img = self.bg.copy()
        for idx, el in enumerate(self.elements):
            vis = _visibility(el, t)
            kind = el.get("type")
            if kind == "image":
                self._draw_image(img, idx, el, t)
            elif vis is None:
                continue
            elif kind == "text":
                self._draw_text(img, el, vis)
            elif kind == "shape":
                self._draw_shape(img, el, vis)
            elif kind == "bar":
                self._draw_shape(img, {**el, "shape": "rect", "anchor": "bottom", "in": {**(el.get("in") or {}), "anim": "grow-y"}}, vis)
            elif kind == "counter":
                v = el.get("from", 0) + (el.get("to", 100) - el.get("from", 0)) * vis.p
                self._draw_text(img, {**el, "text": f"{el.get('prefix', '')}{v:,.0f}{el.get('suffix', '')}"}, Visible(1, vis.alpha, "fade"))
        if self.brand:
            bh = bar_height(self.h)
            draw_brand_bar(img, self.h - bh, bh, _ease((t - 0.2) / 0.5))
        return img.convert("RGB")

    def _draw_image(self, img, idx, el, t):
        src = self._images.get(idx)
        if src is None:
            return
        prog = min(1.0, t / self.duration)
        motion = el.get("motion", "zoom-in")
        zoom = 1.0 + 0.18 * (prog if motion == "zoom-in" else (1 - prog) if motion == "zoom-out" else 0.5)
        scale = max(self.w / src.width, self.ch / src.height) * zoom
        sw, sh = int(src.width * scale), int(src.height * scale)
        big = src.resize((sw, sh), Image.LANCZOS)
        ox = (sw - self.w) / 2 + {"pan-left": 1, "pan-right": -1}.get(motion, 0) * (prog - 0.5) * (sw - self.w)
        oy = (sh - self.ch) / 2
        img.paste(big.crop((int(ox), int(oy), int(ox) + self.w, int(oy) + self.ch)).convert("RGBA"), (0, 0))

    def _draw_text(self, img, el, vis: Visible):
        size = max(10, int(float(el.get("size", 60)) * self.w / 1080))
        font = _font(size, bool(el.get("bold", False)))
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        text = str(el.get("text", ""))
        if vis.anim == "typewriter":
            text = text[: int(len(text) * vis.p + 0.999)]
        max_w = int(float(el.get("max_width", 0.84)) * self.w)
        lines = _wrap(d, text, font, max_w)
        lh = int(size * 1.22)
        total = lh * len(lines)
        cx, cy = float(el.get("x", 0.5)) * self.w, float(el.get("y", 0.5)) * self.ch
        dx, dy = self._offset(vis, self.w, self.ch)
        align = el.get("align", "center")
        color = _rgb(el.get("color", "#ffffff")) + (255,)
        for i, line in enumerate(lines):
            lw = d.textlength(line, font=font)
            x = cx - lw / 2 if align == "center" else cx if align == "left" else cx - lw
            d.text((x + dx, cy - total / 2 + i * lh + dy), line, font=font, fill=color)
        _blend(img, layer, vis.alpha)

    def _draw_shape(self, img, el, vis: Visible):
        w, h = float(el.get("w", 0.2)) * self.w, float(el.get("h", 0.2)) * self.ch
        x, y = float(el.get("x", 0.5)) * self.w, float(el.get("y", 0.5)) * self.ch
        if vis.anim == "grow-x":
            w *= vis.p
        elif vis.anim == "grow-y":
            h *= vis.p
        elif vis.anim == "scale":
            w, h = w * vis.p, h * vis.p
        dx, dy = self._offset(vis, self.w, self.ch)
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        color = _rgb(el.get("color", "#38bdf8")) + (255,)
        top = y - h if el.get("anchor") == "bottom" else y
        box = (x + dx, top + dy, x + w + dx, top + h + dy)
        shape = el.get("shape", "rect")
        if shape == "circle":
            d.ellipse(box, fill=color)
        elif shape == "line":
            d.line((box[0], box[1], box[2], box[3]), fill=color, width=max(1, int(el.get("thickness", 4))))
        else:
            d.rounded_rectangle(box, radius=int(el.get("radius", 0)), fill=color)
        _blend(img, layer, vis.alpha)

    @staticmethod
    def _offset(vis: Visible, w: int, h: int) -> tuple[float, float]:
        k = 1 - vis.p
        return {
            "slide-up": (0, 0.06 * h * k), "slide-down": (0, -0.06 * h * k),
            "slide-left": (0.08 * w * k, 0), "slide-right": (-0.08 * w * k, 0),
        }.get(vis.anim, (0, 0))


def render(spec: dict[str, Any], want_mp4: bool = True) -> dict[str, Any]:
    """Returns {"gif": bytes, "mp4": bytes | None, "frames": int, "seconds": float, "width": int, "height": int}."""
    scene = Scene(spec)
    frames = [scene.frame(n) for n in range(scene.frames)]

    gif = io.BytesIO()
    # One shared adaptive palette keeps the loop from flickering between frames.
    # Built from frames sampled across the whole timeline, so colours that only appear later (text, accents) are kept.
    picks = frames[:: max(1, len(frames) // 10)]
    sw, sh = max(1, scene.w // 3), max(1, scene.h // 3)
    sheet = Image.new("RGB", (sw * len(picks), sh))
    for i, f in enumerate(picks):
        sheet.paste(f.resize((sw, sh)), (i * sw, 0))
    pal = sheet.quantize(colors=200, method=Image.Quantize.MEDIANCUT)
    quant = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    quant[0].save(gif, format="GIF", save_all=True, append_images=quant[1:], duration=int(1000 / scene.fps), loop=0, optimize=False, disposal=1)

    mp4: bytes | None = None
    if want_mp4:
        with tempfile.TemporaryDirectory() as tmp:
            out = os.path.join(tmp, "out.mp4")
            cmd = [imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                   "-s", f"{scene.w}x{scene.h}", "-r", str(scene.fps), "-i", "-", "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p",
                   "-movflags", "+faststart", "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2", out]
            proc = subprocess.run(cmd, input=b"".join(f.tobytes() for f in frames), capture_output=True, timeout=120)
            if proc.returncode == 0 and os.path.exists(out):
                with open(out, "rb") as fh:
                    mp4 = fh.read()
    return {"gif": gif.getvalue(), "mp4": mp4, "frames": len(frames), "seconds": scene.duration, "width": scene.w, "height": scene.h}
