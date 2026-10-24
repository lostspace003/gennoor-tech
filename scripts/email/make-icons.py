"""Small icons for the email templates (PNG: email clients do not render SVG).
python scripts/email/make-icons.py  ->  public/email/icon-*.png (96x96, light blue disc, blue glyph)"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parents[2] / "public" / "email"
OUT.mkdir(parents=True, exist_ok=True)
S = 4                      # supersampling
N = 96 * S
BG, FG, ACC = (232, 239, 254), (37, 99, 235), (245, 158, 11)


def canvas():
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([0, 0, N - 1, N - 1], fill=BG)
    return im, d


def p(v): return int(v * S)


def line(d, pts, w=5, col=FG):
    d.line([(p(x), p(y)) for x, y in pts], fill=col, width=p(w), joint="curve")
    for x, y in (pts[0], pts[-1]):
        d.ellipse([p(x - w / 2), p(y - w / 2), p(x + w / 2), p(y + w / 2)], fill=col)


def rr(d, box, r, **kw): d.rounded_rectangle([p(v) for v in box], radius=p(r), **kw)


def icon_file(d):
    rr(d, (30, 24, 66, 72), 5, outline=FG, width=p(4.5))
    line(d, [(38, 40), (58, 40)], 4); line(d, [(38, 50), (58, 50)], 4); line(d, [(38, 60), (50, 60)], 4)


def icon_play(d):
    rr(d, (22, 28, 74, 68), 8, outline=FG, width=p(4.5))
    d.polygon([(p(42), p(39)), (p(42), p(57)), (p(58), p(48))], fill=FG)


def icon_call(d):
    rr(d, (28, 22, 68, 74), 8, outline=FG, width=p(4.5))
    line(d, [(42, 64), (54, 64)], 4)
    d.ellipse([p(44), p(32), p(52), p(40)], fill=ACC)


def icon_calendar(d):
    rr(d, (22, 28, 74, 72), 7, outline=FG, width=p(4.5))
    d.rectangle([p(22), p(28), p(74), p(40)], fill=FG)
    line(d, [(36, 22), (36, 32)], 4); line(d, [(60, 22), (60, 32)], 4)
    for x in (34, 46, 58):
        for y in (50, 61):
            d.ellipse([p(x - 2.5), p(y - 2.5), p(x + 2.5), p(y + 2.5)], fill=FG)


def icon_learn(d):
    d.polygon([(p(48), p(26)), (p(76), p(40)), (p(48), p(54)), (p(20), p(40))], fill=FG)
    line(d, [(34, 50), (34, 62), (48, 69), (62, 62), (62, 50)], 4)
    line(d, [(76, 40), (76, 58)], 3.5, ACC)


def icon_chat(d):
    rr(d, (22, 26, 74, 62), 10, outline=FG, width=p(4.5))
    d.polygon([(p(36), p(60)), (p(34), p(74)), (p(50), p(61))], fill=FG)
    for x in (36, 48, 60):
        d.ellipse([p(x - 3), p(41), p(x + 3), p(47)], fill=FG)


def icon_check(d):
    line(d, [(28, 50), (42, 63), (68, 34)], 8)


def icon_team(d):
    for cx, cy, r in ((36, 38, 8), (62, 40, 7)):
        d.ellipse([p(cx - r), p(cy - r), p(cx + r), p(cy + r)], outline=FG, width=p(4))
    line(d, [(22, 70), (24, 58), (36, 54), (48, 58), (50, 70)], 4)
    line(d, [(56, 68), (58, 60), (66, 57), (76, 62), (76, 70)], 4)


def icon_mail(d):
    rr(d, (22, 28, 74, 68), 7, outline=FG, width=p(4.5))
    line(d, [(24, 32), (48, 52), (72, 32)], 4)


if __name__ == "__main__":
    for name, fn in dict(file=icon_file, play=icon_play, call=icon_call, calendar=icon_calendar, learn=icon_learn,
                         chat=icon_chat, check=icon_check, team=icon_team, mail=icon_mail).items():
        im, d = canvas(); fn(d)
        im.resize((96, 96), Image.LANCZOS).save(OUT / f"icon-{name}.png", optimize=True)
    print("icons ->", OUT)
