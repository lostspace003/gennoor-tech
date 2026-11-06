"""Renders every animation/diagram spec (anims.json, exported from assets/anims.js) to a slow, step-by-step animated GIF in gifs/.
Mirrors assets/engine.js: wrapped node text, routed (bent) edges, label halos, soft per-step colours."""
import json, math, os, re, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "gifs"); os.makedirs(OUT, exist_ok=True)
specs = json.load(open(os.path.join(ROOT, "anims.json"), encoding="utf-8"))
def font(names, sz):
    for f in names:
        try: return ImageFont.truetype(f, sz)
        except OSError: pass
    return ImageFont.load_default()
B, R = ["segoeuib.ttf", "arialbd.ttf"], ["segoeui.ttf", "arial.ttf"]
F_TITLE, F_SUB, F_KICK = font(B, 34), font(R, 20), font(B, 13)
F_UI, F_UIS = font(R, 17), font(R, 13)
BG, PANEL, INK, MUTE, LINE, ACC, HD, SEEN, NAV = "#ffffff", "#ffffff", "#2b3340", "#667085", "#ced3dc", "#4573c9", "#2b3340", "#eef3fc", "#f7f8fa"
COL = ["#5aa070", "#4f7fd6", "#3f9c8f", "#8068c9", "#c0912f", "#cc6b6b"]; TINT = ["#ecf6ef", "#eef3fc", "#e8f5f2", "#f1eefa", "#fbf5e6", "#fbefee"]; GOLD = "#d99a2b"
SC = 1.33; VW = 1200; TOP = 112; BANNER = 170; NW = 136 * SC
MOVE_FRAMES, MOVE_MS, HOLD_MS, EDGE_FRAC = 18, 90, 3600, 0.45
_cache = {}
def fnt(bold, size):
    k = (bold, round(size))
    if k not in _cache: _cache[k] = font(B if bold else R, round(size))
    return _cache[k]

def split(text):
    i = text.find(":")
    if 0 < i < 42: return text[:i], text[i + 1:].strip()
    m = re.search(r"[;.,]", text[:62])
    if m and m.start() > 12: return text[:m.start()], text
    return " ".join(text.split()[:6]), text

def wrap(t, mx):
    lines = [""]
    for w in str(t).split(" "):
        l = lines[-1]
        if not l: lines[-1] = w
        elif len(l + " " + w) <= mx: lines[-1] = l + " " + w
        else: lines.append(w)
    sc = min([1] + [mx / len(l) for l in lines if len(l) > mx])
    return lines[:2], max(sc, 0.74)

def partial(pts, f):
    seg = [math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) for i in range(1, len(pts))]
    want, acc, out = sum(seg) * f, 0, [pts[0]]
    for i, sl in enumerate(seg):
        if acc + sl >= want:
            r = (want - acc) / sl if sl else 0
            out.append((pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r)); return out
        out.append(pts[i + 1]); acc += sl
    return out

def render(spec):
    steps = spec["steps"]; ys = [n["y"] for n in spec["nodes"]]
    N = {}
    for n in spec["nodes"]:
        lw, sw = wrap(n["label"], 17), (wrap(n["sub"], 23) if n.get("sub") else ([], 1))
        h = max(56, 26 + 16 * len(lw[0]) + (4 + 13 * len(sw[0]) if n.get("sub") else 0)) * SC
        N[n["id"]] = dict(n, lw=lw, sw=sw, h=h)
    off = min(ys) - 85
    maxbend = max([e[3] for e in spec["edges"] if len(e) > 3] + [0])
    vh = int((max(ys) - min(ys) + 170 + maxbend) * SC)
    for n in N.values(): n["X"], n["Y"] = n["x"] * SC, (n["y"] - off) * SC + TOP
    order, c = {}, 0
    for st in steps:
        for i in st["on"]:
            if i not in order: c += 1; order[i] = c
    def clip(a, b):
        dx, dy = a["X"] - b["X"], a["Y"] - b["Y"]
        t = min((NW / 2 + 4) / abs(dx) if dx else 1e9, (b["h"] / 2 + 4) / abs(dy) if dy else 1e9)
        return (b["X"] + dx * t, b["Y"] + dy * t)
    E = {}
    for e in spec["edges"]:
        A, Bn = N[e[0]], N[e[1]]; lab = e[2] if len(e) > 2 else ""
        if len(e) > 3:
            yb = max(A["Y"] + A["h"] / 2, Bn["Y"] + Bn["h"] / 2) + e[3] * SC
            pts = [(A["X"], A["Y"] + A["h"] / 2 + 4), (A["X"], yb), (Bn["X"], yb), (Bn["X"], Bn["Y"] + Bn["h"] / 2 + 4)]; lp = ((A["X"] + Bn["X"]) / 2, yb + 18)
        else:
            p1, p2 = clip(Bn, A), clip(A, Bn)
            if any(r[0] == e[1] and r[1] == e[0] and len(r) < 4 for r in spec["edges"]):
                L = math.hypot(p2[0] - p1[0], p2[1] - p1[1]) or 1; ox, oy = -(p2[1] - p1[1]) / L * 14, (p2[0] - p1[0]) / L * 14
                p1 = (p1[0] + ox, p1[1] + oy); p2 = (p2[0] + ox, p2[1] + oy)
            pts = [p1, p2]; lp = ((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 - 12)
        E[(e[0], e[1])] = (pts, lab, lp)
    H = TOP + vh + BANNER

    def frame(idx, t):
        im = Image.new("RGB", (VW, H), BG); d = ImageDraw.Draw(im)
        d.rectangle([0, 0, VW, 6], fill=ACC)
        d.text((40, 24), spec["title"], font=F_TITLE, fill=HD)
        d.text((40, 72), "Follow the gold dot, one step at a time.", font=F_SUB, fill=MUTE)
        d.rounded_rectangle([VW - 330, 36, VW - 292, 56], 10, outline=INK, width=2); d.text((VW - 282, 36), "the part at work", font=F_UIS, fill=INK)
        d.ellipse([VW - 160, 40, VW - 148, 52], fill=GOLD); d.text((VW - 140, 36), "data moving", font=F_UIS, fill=INK)
        d.rounded_rectangle([20, TOP - 12, VW - 20, TOP + vh - 6], 28, outline=LINE, width=3, fill="#ffffff")
        seenN, seenE, cur, eCol = set(), set(), set(), {}
        for i in range(idx + 1):
            seenN.update(steps[i]["on"])
            if steps[i].get("edge") and (i < idx or t >= EDGE_FRAC):
                k = tuple(steps[i]["edge"]); seenE.add(k); eCol[k] = COL[(i + 1) % 6]
        if idx >= 0: cur = set(steps[idx]["on"])
        glow = None
        for k, (pts, lab, lp) in E.items():
            on = k in seenE; col = eCol.get(k, ACC) if on else LINE; draw_pts = pts
            moving = idx >= 0 and steps[idx].get("edge") and tuple(steps[idx]["edge"]) == k and t < EDGE_FRAC
            if moving: draw_pts = partial(pts, t / EDGE_FRAC); col = COL[(idx + 1) % 6]; glow = draw_pts[-1]
            d.line(draw_pts, fill=col, width=4, joint="curve")
            if on:
                q, r0 = pts[-1], pts[-2]; ang = math.atan2(q[1] - r0[1], q[0] - r0[0])
                d.polygon([q] + [(q[0] - 15 * math.cos(ang) + s * 7.5 * math.sin(ang), q[1] - 15 * math.sin(ang) - s * 7.5 * math.cos(ang)) for s in (1, -1)], fill=col)
            if lab:
                tw = d.textlength(lab, font=F_UIS); x, y = lp[0] - tw / 2, lp[1] - 8
                d.rectangle([x - 3, y, x + tw + 3, y + 17], fill="#ffffff"); d.text((x, y), lab, font=F_UIS, fill=MUTE)
        for nid, n in N.items():
            x, y = n["X"], n["Y"]; hh = n["h"]; box = [x - NW / 2, y - hh / 2, x + NW / 2, y + hh / 2]; on = nid in cur
            nc = COL[order.get(nid, 1) % 6]; ntint = TINT[order.get(nid, 1) % 6]
            if on:
                for g in (6, 3): d.rounded_rectangle([box[0] - g, box[1] - g, box[2] + g, box[3] + g], 18 + g, outline=nc, width=2)
            d.rounded_rectangle(box, 18, fill=ntint if nid in seenN else PANEL, outline=nc if (on or nid in seenN) else LINE, width=5 if on else 3)
            lh = 16 * SC; tot = lh * len(n["lw"][0]) + ((4 + 13 * len(n["sw"][0])) * SC if n.get("sub") else 0); y0 = y - tot / 2
            fl = fnt(True, 13 * n["lw"][1] * SC)
            for i, ln in enumerate(n["lw"][0]): d.text((x - d.textlength(ln, font=fl) / 2, y0 + i * lh), ln, font=fl, fill=INK)
            fs = fnt(False, 11 * n["sw"][1] * SC)
            for i, ln in enumerate(n["sw"][0]): d.text((x - d.textlength(ln, font=fs) / 2, y0 + lh * len(n["lw"][0]) + (4 * SC) + i * 13 * SC), ln, font=fs, fill=MUTE)
            if nid in order:
                bx, by = box[2] - 6, box[1] + 6; seen = nid in seenN
                d.ellipse([bx - 13, by - 13, bx + 13, by + 13], fill=nc if seen else LINE); nn = str(order[nid])
                d.text((bx - d.textlength(nn, font=F_KICK) / 2, by - 9), nn, font=F_KICK, fill="white")
        if glow:
            for r, col in ((14, "#ffffff"), (10, GOLD)): d.ellipse([glow[0] - r, glow[1] - r, glow[0] + r, glow[1] + r], fill=col)
        by0 = TOP + vh
        bc = COL[(idx + 1) % 6] if idx >= 0 else ACC
        d.rounded_rectangle([20, by0, VW - 20, H - 18], 28, fill=TINT[(idx + 1) % 6] if idx >= 0 else NAV, outline=LINE, width=2)
        if idx < 0: num, kick, title, body = "▶", "READY", spec["title"], "Press play and follow the gold dot through the architecture."
        else:
            num = str(idx + 1); kick = f"STEP {idx + 1} OF {len(steps)}"; title, body = split(steps[idx]["text"]); body = body[:1].upper() + body[1:]
        d.ellipse([52, by0 + 36, 116, by0 + 100], fill=bc); d.text((84 - d.textlength(num, font=F_TITLE) / 2, by0 + 40), num, font=F_TITLE, fill="white")
        d.text((150, by0 + 22), kick, font=F_KICK, fill=MUTE)
        d.text((150, by0 + 40), title, font=F_TITLE if len(title) < 34 else fnt(True, 22), fill=HD)
        for i, line in enumerate(textwrap.wrap(body, 100)[:2]): d.text((150, by0 + 88 + i * 24), line, font=F_UI, fill=INK)
        n_ = len(steps); sw = 300; x0 = VW - 60 - sw
        for i in range(n_):
            xa = x0 + i * (sw / n_); d.rounded_rectangle([xa, by0 + 20, xa + sw / n_ - 6, by0 + 28], 4, fill=bc if i <= idx else LINE)
        return im.convert("P", palette=Image.ADAPTIVE, colors=96)
    seq = [(frame(-1, 0), 1800)]
    for i in range(len(steps)):
        for k in range(MOVE_FRAMES): seq.append((frame(i, EDGE_FRAC * (k + 1) / MOVE_FRAMES if steps[i].get("edge") else 0), MOVE_MS))
        seq.append((frame(i, 1), HOLD_MS))
    seq[-1] = (seq[-1][0], HOLD_MS + 2500)
    return seq

if __name__ == "__main__":
    for name, spec in specs.items():
        fr = render(spec); fn = os.path.join(OUT, name + ".gif")
        fr[0][0].save(fn, save_all=True, append_images=[f for f, _ in fr[1:]], duration=[x for _, x in fr], loop=0, optimize=False, disposal=2)
        print(name, len(fr), "frames", os.path.getsize(fn) // 1024, "KB", flush=True)
