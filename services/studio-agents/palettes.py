"""Per-post colour palettes for motion graphics, so the GIFs are not all navy and blue.

The designer agent writes the scene (words, timing, layout). Colours are then re-mapped here to a palette chosen for this
post and different from the last few, which keeps the animation readable (every background is dark, text stays light) while
making each one look distinct. Blue is one option among many.
"""
from __future__ import annotations

import random
from collections import deque
from typing import Any

PALETTES: list[dict[str, str]] = [
    {"name": "ember", "from": "#2b0f1d", "to": "#9a3412", "accent": "#fdba74"},
    {"name": "emerald", "from": "#052e2b", "to": "#047857", "accent": "#6ee7b7"},
    {"name": "plum", "from": "#2e1065", "to": "#86198f", "accent": "#fb7185"},
    {"name": "charcoal-amber", "from": "#1c1917", "to": "#44403c", "accent": "#fbbf24"},
    {"name": "teal-sand", "from": "#042f2e", "to": "#0f766e", "accent": "#fde68a"},
    {"name": "oxblood-gold", "from": "#3f0d12", "to": "#991b1b", "accent": "#fcd34d"},
    {"name": "slate-lime", "from": "#0f172a", "to": "#334155", "accent": "#bef264"},
    {"name": "violet-mint", "from": "#1e1b4b", "to": "#6d28d9", "accent": "#5eead4"},
    {"name": "forest-peach", "from": "#052e16", "to": "#166534", "accent": "#fdba74"},
    {"name": "ink-vermilion", "from": "#111827", "to": "#1f2937", "accent": "#f97316"},
    {"name": "ocean-orange", "from": "#0b1b3a", "to": "#1d4ed8", "accent": "#fb923c"},
    {"name": "magenta-gold", "from": "#3b0a45", "to": "#be185d", "accent": "#fde047"},
]

_recent: deque[str] = deque(maxlen=4)


def pick() -> dict[str, str]:
    fresh = [p for p in PALETTES if p["name"] not in _recent] or PALETTES
    p = random.choice(fresh)
    _recent.append(p["name"])
    return p


def _near_white(c: Any) -> bool:
    if not isinstance(c, str) or not c.startswith("#") or len(c) not in (4, 7):
        return False
    h = c[1:] if len(c) == 7 else "".join(ch * 2 for ch in c[1:])
    try:
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        return False
    return min(r, g, b) >= 225


def recolor(scene: dict[str, Any], palette: dict[str, str] | None = None) -> dict[str, Any]:
    """Returns a copy of the scene with this palette's background and accent colours; near-white text is kept."""
    p = palette or pick()
    out = dict(scene)
    bg = dict(out.get("background") or {})
    bg["from"], bg["to"] = p["from"], p["to"]
    bg.setdefault("angle", 135)
    out["background"] = bg
    els = []
    for el in out.get("elements") or []:
        el = dict(el)
        if "color" in el and not _near_white(el["color"]):
            el["color"] = p["accent"]
        els.append(el)
    out["elements"] = els
    return out
