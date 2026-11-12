"""Builds the presentation from the pieces build.mjs cut out.

    node scripts/show/build.mjs deck overview
    python scripts/show/deck.py overview            -> public/Gennoor-Tech-Catalog/Gennoor-Tech-Overview.pptx

Every slide is the scene's ground as a picture, with each piece laid on it as its own
picture, exactly where it sits in the scene. PowerPoint then does the moving:
  - pieces of beat 0 (and up to the scene's `auto` beat) arrive by themselves when the slide opens
  - every later beat is one mouse click
  - rings marked data-spin keep turning for as long as the slide is up
  - slides fade into one another
A piece with data-href is a link to that page. Each picture carries its words as alt text,
and each slide carries what to say in its notes.

python-pptx cannot write animations, so the timing XML is written here by hand. It is the
same XML PowerPoint writes for Fade, Ascend, Zoom, Fly In and Spin.
"""
import json
import sys
from itertools import count
from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.util import Emu

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
show = sys.argv[1] if len(sys.argv) > 1 else "overview"
SRC = HERE / ".work" / "deck" / show
OUT = {"overview": ROOT / "public" / "Gennoor-Tech-Catalog" / "Gennoor-Tech-Overview.pptx"}.get(show, HERE / ".work" / f"{show}.pptx")
manifest = json.loads((SRC / "manifest.json").read_text(encoding="utf-8"))
PX = 9525                      # one scene pixel in PowerPoint units: 1280 px = 13.333 inches
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
STAGGER, AUTO_GAP = 110, 380   # milliseconds between pieces of one beat / between beats that play by themselves

prs = Presentation()
prs.slide_width, prs.slide_height = Emu(1280 * PX), Emu(720 * PX)
BLANK = prs.slide_layouts[6]


def tgt(sp):
    return f'<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl>'


def entrance(sp, fx, node, delay, nid):
    """One piece arriving. `node` is clickEffect, withEffect or afterEffect."""
    dur = 650
    show_it = (f'<p:set><p:cBhvr><p:cTn id="{next(nid)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>{tgt(sp)}'
               f'<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>')
    fade = f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{next(nid)}" dur="{dur}"/>{tgt(sp)}</p:cBhvr></p:animEffect>'

    def move(attr, start):
        return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="{next(nid)}" dur="{dur}" decel="100000" fill="hold"/>{tgt(sp)}'
                f'<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>'
                f'<p:tav tm="0"><p:val><p:strVal val="{start}"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="#{attr}"/></p:val></p:tav></p:tavLst></p:anim>')

    preset, sub, body = 10, 0, fade                                             # Fade
    if fx == "rise":
        preset, body = 42, fade + move("ppt_x", "#ppt_x") + move("ppt_y", "#ppt_y+.045")      # Ascend
    elif fx == "drop":
        preset, body = 47, fade + move("ppt_x", "#ppt_x") + move("ppt_y", "#ppt_y-.06")       # Descend
    elif fx == "left":
        preset, sub, body = 2, 8, fade + move("ppt_x", "#ppt_x-.045") + move("ppt_y", "#ppt_y")  # Fly in from the left, a short way
    elif fx == "right":
        preset, sub, body = 2, 2, fade + move("ppt_x", "#ppt_x+.045") + move("ppt_y", "#ppt_y")
    elif fx == "pop":
        preset, sub, body = 53, 16, fade + move("ppt_w", "#ppt_w*0.8") + move("ppt_h", "#ppt_h*0.8")  # Zoom
    elif fx == "wipe":
        preset, sub = 22, 8
        body = f'<p:animEffect transition="in" filter="wipe(left)"><p:cBhvr><p:cTn id="{next(nid)}" dur="{dur}"/>{tgt(sp)}</p:cBhvr></p:animEffect>'
    return (f'<p:par><p:cTn id="{next(nid)}" presetID="{preset}" presetClass="entr" presetSubtype="{sub}" fill="hold" nodeType="{node}">'
            f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>{show_it}{body}</p:childTnLst></p:cTn></p:par>')


def spin(sp, degrees_a_second, nid):
    """Keeps turning for as long as the slide is shown."""
    ms = int(abs(360 / degrees_a_second) * 1000)
    by = 21600000 if degrees_a_second > 0 else -21600000
    return (f'<p:par><p:cTn id="{next(nid)}" presetID="8" presetClass="emph" presetSubtype="0" repeatCount="indefinite" fill="hold" nodeType="withEffect">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:animRot by="{by}"><p:cBhvr><p:cTn id="{next(nid)}" dur="{ms}" fill="hold"/>{tgt(sp)}'
            f'<p:attrNameLst><p:attrName>r</p:attrName></p:attrNameLst></p:cBhvr></p:animRot></p:childTnLst></p:cTn></p:par>')


def group(effects, nid, on_open=False):
    """The effects one mouse click starts, or (on_open) the ones that start with the slide."""
    start = '<p:cond delay="indefinite"/>' + ('<p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>' if on_open else '')
    return (f'<p:par><p:cTn id="{next(nid)}" fill="hold"><p:stCondLst>{start}</p:stCondLst><p:childTnLst>'
            f'<p:par><p:cTn id="{next(nid)}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{"".join(effects)}</p:childTnLst></p:cTn></p:par>'
            f'</p:childTnLst></p:cTn></p:par>')


def animate(slide, placed, auto):
    """placed: [(shape id, piece)] in the order they were added."""
    nid = count(3)
    groups = []
    beats = sorted({p["beat"] for _, p in placed})
    opening = [b for b in beats if b <= auto]
    if opening:
        effects = []
        for k, b in enumerate(opening):
            for sp, p in sorted([x for x in placed if x[1]["beat"] == b], key=lambda x: x[1]["order"]):
                first = not effects
                effects.append(entrance(sp, p["fx"], "afterEffect" if first else "withEffect", k * AUTO_GAP + p["order"] * STAGGER, nid))
                if p.get("spin"):
                    effects.append(spin(sp, p["spin"], nid))
        groups.append(group(effects, nid, on_open=True))
    for b in [b for b in beats if b > auto]:
        effects = []
        for sp, p in sorted([x for x in placed if x[1]["beat"] == b], key=lambda x: x[1]["order"]):
            effects.append(entrance(sp, p["fx"], "withEffect" if effects else "clickEffect", p["order"] * STAGGER, nid))
        groups.append(group(effects, nid))
    timing = (f'<p:timing xmlns:p="{P}"><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
              f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>{"".join(groups)}</p:childTnLst></p:cTn>'
              f'<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
              f'<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
              f'</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')
    slide._element.append(etree.fromstring(f'<p:transition xmlns:p="{P}" spd="med"><p:fade/></p:transition>'))
    slide._element.append(etree.fromstring(timing))
    return len(groups) - (1 if opening else 0)


clicks_total = 0
for scene in manifest["scenes"]:
    slide = prs.slides.add_slide(BLANK)
    ground = slide.shapes.add_picture(str(SRC / scene["bg"]), 0, 0, prs.slide_width, prs.slide_height)
    ground._element.nvPicPr.cNvPr.set("descr", "")          # decoration: nothing for a screen reader to read
    ground.name = "Ground"
    placed = []
    for p in scene["pieces"]:
        pic = slide.shapes.add_picture(str(SRC / p["file"]), Emu(p["x"] * PX), Emu(p["y"] * PX), Emu(p["w"] * PX), Emu(p["h"] * PX))
        pic.name = p["id"]
        pic._element.nvPicPr.cNvPr.set("descr", p["alt"])
        if p["href"]:
            pic.click_action.hyperlink.address = p["href"]
        placed.append((pic.shape_id, p))
    clicks = animate(slide, placed, scene.get("auto", 0))
    clicks_total += clicks
    slide.notes_slide.notes_text_frame.text = scene.get("notes", "")
    print(f'  {scene["id"]:<10} {len(scene["pieces"]):>3} pieces, {clicks} clicks')

prs.core_properties.title = "Gennoor Tech: what we do"
prs.core_properties.author = "Gennoor Tech"
OUT.parent.mkdir(parents=True, exist_ok=True)
prs.save(OUT)
print(f"wrote {OUT}  {OUT.stat().st_size / 1e6:.1f} MB, {len(manifest['scenes'])} slides, {clicks_total} clicks")
