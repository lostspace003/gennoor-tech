"""Builds public/Gennoor-Tech-Catalog/Gennoor-Tech-Overview.pptx from catalog-data.json.

    npx tsx --env-file=.env.local scripts/catalog/extract-site-data.ts   (reads the site; also saves course pictures)
    python scripts/catalog/build-overview-pptx.py

A short tour for a live conversation, not a brochure. Three rules shape it:

  1. Everything appears on a mouse click, one idea at a time, so the presenter
     sets the pace. (python-pptx cannot write animations, so add_clicks() writes
     the timing XML itself.)
  2. Every section ends in a link to the page on the website where that thing
     lives. The deck shows SOME of what we do today; the site is where new
     courses and programmes appear, so the deck keeps sending people there.
  3. Numbers and course names come from catalog-data.json, which is read from
     the site, so a rebuild keeps the deck true. No prices: cost is for a call.

To add a section later: write one more function like the ones below, add it to
SLIDES, and give it a link to its page.
"""
import copy
import json
from pathlib import Path

from lxml import etree
from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
WORK = HERE / ".work"
DATA = json.loads((HERE / "catalog-data.json").read_text(encoding="utf-8"))
META = DATA["meta"]
OUT = ROOT / "public" / "Gennoor-Tech-Catalog" / "Gennoor-Tech-Overview.pptx"
ART = ROOT / "public" / "email" / "brief"
LOGO = ROOT / "public" / "logos" / "gennoor-tech-horizontal-dark-bright_760x260_email-header.png"
CPN = ROOT / "public" / "email" / "cpn-certified-horizontal.png"
POSTER = ROOT / "public" / "videos" / "learning-studio-walkthrough-poster.jpg"
SITE = "https://www.gennoor.com"
CPN_LINE = "Gennoor is Certified in the Claude Partner Network."

rgb = lambda h: RGBColor.from_string(h)
BG, PANEL, PANEL2, LINE = "0C1426", "16233F", "1B2C50", "2A3F6B"
TEXT, BODY, MUTED, BLUE, DEEP, GOLD, GREEN, CLAUDE = "F2F6FC", "C9D6EA", "8FA3C2", "5AA9F3", "0A7CFF", "F5B83D", "3ECF8E", "D97757"
FONT = "Calibri"
W, H = 13.333, 7.5
M = 0.75  # side margin

prs = Presentation()
prs.slide_width, prs.slide_height = Inches(W), Inches(H)
BLANK = prs.slide_layouts[6]


# ------------------------------------------------------------------ drawing helpers

def text(shapes, x, y, w, h, runs, size=16, color=BODY, bold=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=None, link=None):
    """A text box. `runs` is a string, or a list of paragraphs; a paragraph is a string or a list of (text, {size, color, bold}) runs."""
    box = shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    paragraphs = runs if isinstance(runs, list) else [runs]
    for i, para in enumerate(paragraphs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if spacing:
            p.space_after = Pt(spacing)
        for piece in (para if isinstance(para, list) else [(para, {})]):
            t, o = piece
            r = p.add_run()
            r.text = t
            r.font.name = FONT
            r.font.size = Pt(o.get("size", size))
            r.font.bold = o.get("bold", bold)
            r.font.color.rgb = rgb(o.get("color", color))
            link = link or o.get("link")
    # The link goes on the box, not on the words: a text hyperlink is forced into the theme's
    # link colour (dark blue, underlined), which cannot be read on a dark slide.
    if link:
        box.click_action.hyperlink.address = link
    return box


def box(shapes, x, y, w, h, fill=PANEL, line=LINE, radius=0.08, link=None):
    s = shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    s.adjustments[0] = radius
    s.fill.solid()
    s.fill.fore_color.rgb = rgb(fill)
    if line:
        s.line.color.rgb = rgb(line)
        s.line.width = Pt(0.75)
    else:
        s.line.fill.background()
    s.shadow.inherit = False
    if link:
        s.click_action.hyperlink.address = link
    return s


def picture(shapes, path, x, y, w=None, h=None, link=None):
    pic = shapes.add_picture(str(path), Inches(x), Inches(y), Inches(w) if w else None, Inches(h) if h else None)
    if link:
        pic.click_action.hyperlink.address = link
    return pic


def small(path, width=900):
    """A lighter copy of a photograph, so the deck stays small enough to email."""
    WORK.mkdir(exist_ok=True)
    out = WORK / f"deck-{Path(path).stem}.jpg"
    im = Image.open(path).convert("RGB")
    im.thumbnail((width, width))
    im.save(out, quality=82)
    return out


def icon(shapes, name, x, y, size=0.62, art=False):
    return picture(shapes, ART / f"{'art' if art else 'icon'}-{name}.png", x, y, size, size)


def new_slide(kicker=None, title=None, kicker_color=GOLD):
    s = prs.slides.add_slide(BLANK)
    bg = s.background.fill
    bg.solid()
    bg.fore_color.rgb = rgb(BG)
    if kicker:
        text(s.shapes, M, 0.62, 9, 0.3, kicker.upper(), size=13, color=kicker_color, bold=True)
    if title:
        text(s.shapes, M, 0.98, W - 2 * M, 1.0, title, size=38, color=TEXT, bold=True)
    return s


def go(s, label, url, y=6.62):
    """The way out of the deck: where this lives on the website."""
    shown = url.replace("https://www.", "")
    grp = s.shapes.add_group_shape()
    box(grp.shapes, M, y, 5.2, 0.5, fill=DEEP, line=None, radius=0.5, link=url)
    text(grp.shapes, M + 0.28, y, 4.7, 0.5, [[(f"{label}:  ", {"color": "DCEBFF"}), (f"{shown}  →", {"bold": True, "color": "FFFFFF", "link": url})]], size=14, anchor=MSO_ANCHOR.MIDDLE)
    return grp


def card(s, x, y, w, h, icon_name, title, body, link=None, art=False, accent=None):
    """One idea: an icon, a few words, one sentence. Returned as one group so it can appear on one click."""
    grp = s.shapes.add_group_shape()
    box(grp.shapes, x, y, w, h, link=link)
    icon(grp.shapes, icon_name, x + 0.3, y + 0.3, 0.62, art=art)
    two_lines = w < 3.2  # narrow cards: leave room for a title on two lines, the same on every card in the row
    text(grp.shapes, x + 0.3, y + 1.08, w - 0.6, 0.8 if two_lines else 0.45, title, size=19, color=accent or TEXT, bold=True, link=link)
    text(grp.shapes, x + 0.3, y + (1.9 if two_lines else 1.55), w - 0.6, h - 2.0, body, size=14, color=BODY, link=link)
    return grp


# ------------------------------------------------------------------ click animation and slide transition

P = "http://schemas.openxmlformats.org/presentationml/2006/main"


def add_clicks(slide, clicks):
    """Make shapes appear on mouse clicks. `clicks` is a list; each item is the shape (or list of shapes) one click reveals, with a soft fade."""
    ids = iter(range(3, 10_000))
    out = []
    for group in clicks:
        shapes = group if isinstance(group, (list, tuple)) else [group]
        effects = ""
        for n, sh in enumerate(shapes):
            sp = sh.shape_id
            effects += (
                f'<p:par><p:cTn id="{next(ids)}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" nodeType="{"clickEffect" if n == 0 else "withEffect"}">'
                f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
                f'<p:set><p:cBhvr><p:cTn id="{next(ids)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                f'<p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
                f'<p:to><p:strVal val="visible"/></p:to></p:set>'
                f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{next(ids)}" dur="450"/><p:tgtEl><p:spTgt spid="{sp}"/></p:tgtEl></p:cBhvr></p:animEffect>'
                f'</p:childTnLst></p:cTn></p:par>'
            )
        out.append(
            f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
            f'<p:par><p:cTn id="{next(ids)}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{effects}</p:childTnLst></p:cTn></p:par>'
            f'</p:childTnLst></p:cTn></p:par>'
        )
    timing = (
        f'<p:timing xmlns:p="{P}"><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
        f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>{"".join(out)}</p:childTnLst></p:cTn>'
        f'<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
        f'<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
        f'</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>'
    )
    slide._element.append(etree.fromstring(timing))


def add_transition(slide):
    """A quiet fade between slides. It has to sit before the timing element."""
    tr = etree.fromstring(f'<p:transition xmlns:p="{P}" spd="med"><p:fade/></p:transition>')
    timing = slide._element.find(f"{{{P}}}timing")
    if timing is not None:
        timing.addprevious(tr)
    else:
        slide._element.append(tr)


# ------------------------------------------------------------------ the slides

def cpn_badge(shapes, x, y, w=2.5):
    """The Claude Partner Network badge on its own white card, linked to the partner page."""
    ratio = Image.open(CPN).size
    h = w * ratio[1] / ratio[0]
    grp = shapes.add_group_shape()
    box(grp.shapes, x, y, w + 0.3, h + 0.3, fill="FFFFFF", line=None, radius=0.12, link="https://claude.com/partners")
    picture(grp.shapes, CPN, x + 0.15, y + 0.15, w, link="https://claude.com/partners")
    return grp, h + 0.3


def s_title():
    s = new_slide()
    picture(s.shapes, LOGO, M, 0.7, 2.6)
    text(s.shapes, M, 2.75, 9.6, 2.0, "Practical AI and cloud learning, for people and for teams", size=48, color=TEXT, bold=True)
    sub = text(s.shapes, M, 4.85, 9.6, 0.5, "A short tour of some of what we do today, and where to see what is new.", size=22, color=BODY)
    badge, bh = cpn_badge(s.shapes, M, 5.85, 2.3)
    line = text(s.shapes, M + 2.95, 5.85, 5, bh, CPN_LINE, size=16, color=BODY, anchor=MSO_ANCHOR.MIDDLE)
    wall = s.shapes.add_group_shape()
    tw, th, gx = 1.72, 1.72 * 9 / 16, 0.14
    for i, f in enumerate(META["featured"][:4]):
        thumb = WORK / f"thumb-{f['slug']}.jpg"
        if thumb.exists():
            picture(wall.shapes, small(thumb, 700), W - M - 2 * tw - gx + (i % 2) * (tw + gx), 0.7 + (i // 2) * (th + gx), tw, th, link=f"{SITE}/studio/{f['slug']}")
    add_clicks(s, [sub, wall, [badge, line]])
    return s


def s_doors():
    s = new_slide("Start here", "Four ways to work with us")
    w, gap, y, h = 2.78, 0.24, 2.3, 3.5
    doors = [
        ("play", "Learn at your own pace", "Video courses with labs, quizzes and a certificate. Preview lessons play without signing in.", f"{SITE}/studio"),
        ("team", "Train your team", "Live training on Claude, Microsoft AI and automation, online or at your office.", f"{SITE}/training"),
        ("work", "Have it built for you", "A course on your own work, a learning platform under your name, or a working prototype.", f"{SITE}/contact"),
        ("calendar", "See it built live", f"The {META['weekend']['name']}: two live sessions every month.", f"{SITE}/ai-weekend"),
    ]
    cards = [card(s, M + i * (w + gap), y, w, h, ic, t, b, link) for i, (ic, t, b, link) in enumerate(doors)]
    note = text(s.shapes, M, 6.2, W - 2 * M, 0.4, "These are some of the things we do today. New courses and programmes appear on the website first.", size=15, color=MUTED)
    add_clicks(s, cards + [note])
    return s


def s_studio():
    c = META["counts"]
    s = new_slide("Learning Studio", "Learn it by building it")
    lead = text(s.shapes, M, 2.0, 5.6, 1.3, "Certification courses and real projects on video, with captions, labs you run yourself and a quiz in every module.", size=19, color=BODY)
    stats = [(str(c["studio"]), "courses live today"), (f"{META['studioLessons']:,}", "video lessons"), (f"{META['studioHours']}+", "hours of video")]
    groups = []
    for i, (big, label) in enumerate(stats):
        g = s.shapes.add_group_shape()
        x = M + i * 1.95
        text(g.shapes, x, 3.75, 1.85, 0.9, big, size=50, color=GOLD, bold=True)
        text(g.shapes, x, 4.7, 1.85, 0.5, label, size=14, color=MUTED)
        groups.append(g)
    # The walkthrough video is a link, not a file inside the deck: it stays light to email
    v = s.shapes.add_group_shape()
    px, py, pw = 7.1, 1.85, 5.5
    ph = pw * 9 / 16
    picture(v.shapes, small(POSTER), px, py, pw, ph, link=META["walkthrough"])
    play = v.shapes.add_shape(MSO_SHAPE.OVAL, Inches(px + pw / 2 - 0.45), Inches(py + ph / 2 - 0.45), Inches(0.9), Inches(0.9))
    play.fill.solid(); play.fill.fore_color.rgb = rgb(DEEP); play.line.fill.background(); play.shadow.inherit = False
    play.click_action.hyperlink.address = META["walkthrough"]
    tri = v.shapes.add_shape(MSO_SHAPE.ISOSCELES_TRIANGLE, Inches(px + pw / 2 - 0.13), Inches(py + ph / 2 - 0.19), Inches(0.38), Inches(0.34))
    tri.rotation = 90; tri.fill.solid(); tri.fill.fore_color.rgb = rgb("FFFFFF"); tri.line.fill.background(); tri.shadow.inherit = False
    tri.click_action.hyperlink.address = META["walkthrough"]
    cap = text(s.shapes, px, py + ph + 0.15, pw, 0.4, [[("Watch the 9-minute walkthrough  →", {"bold": True, "color": BLUE, "link": META["walkthrough"]})]], size=15)
    link = go(s, "Open the Learning Studio", f"{SITE}/studio")
    add_clicks(s, [lead, groups, [v, cap], link])
    return s


def s_flow():
    s = new_slide("Learning Studio", "From the first click to a certificate")
    steps = [
        ("learn", "1  Browse", "Filter by type, company, level or topic."),
        ("play", "2  Watch the previews", "Up to six lessons of every course play at once. Nothing to sign up for."),
        ("labs", "3  Take the course", "Every lesson, lab and quiz opens. Progress is saved on any device."),
        ("certificate", "4  Earn the certificate", "A quiz checks each module. An assistant in the player answers questions."),
    ]
    w, gap, y, h = 2.78, 0.24, 2.3, 3.3
    cards = [card(s, M + i * (w + gap), y, w, h, ic, t, b) for i, (ic, t, b) in enumerate(steps)]
    team = text(s.shapes, M, 5.95, W - 2 * M, 0.4, "For a team, we add the courses you need, or build one on your own work.", size=16, color=BODY)
    link = go(s, "See how it works", f"{SITE}/studio")
    add_clicks(s, cards + [team, link])
    return s


def s_courses():
    s = new_slide("Learning Studio", "Courses you can open today")
    feats = META["featured"][:4]
    w, gap, y = 2.78, 0.24, 2.2
    groups = []
    for i, f in enumerate(feats):
        x = M + i * (w + gap)
        url = f"{SITE}/studio/{f['slug']}"
        g = s.shapes.add_group_shape()
        box(g.shapes, x, y, w, 3.75, link=url)
        thumb = WORK / f"thumb-{f['slug']}.jpg"
        if thumb.exists():
            picture(g.shapes, small(thumb, 700), x + 0.12, y + 0.12, w - 0.24, (w - 0.24) * 9 / 16, link=url)
        text(g.shapes, x + 0.25, y + 1.72, w - 0.5, 0.3, f"{f['kind']} course".upper(), size=11, color=GOLD, bold=True)
        text(g.shapes, x + 0.25, y + 2.02, w - 0.5, 1.15, f["title"], size=16, color=TEXT, bold=True, link=url)
        facts = f"{f['lessons']} lessons" + (f"  ·  {f['hours']} hours" if f["hours"] else "")
        text(g.shapes, x + 0.25, y + 3.25, w - 0.5, 0.35, facts, size=14, color=MUTED)
        groups.append(g)
    more = text(s.shapes, M, 6.1, W - 2 * M, 0.4, f"{META['counts']['studio']} courses are live and more are added as they are published. Each one opens with preview lessons.", size=15, color=MUTED)
    link = go(s, "See every course", f"{SITE}/studio")
    add_clicks(s, groups + [[more, link]])
    return s


def s_essentials():
    s = new_slide("AI Essentials", "Learn something useful in an hour")
    big = s.shapes.add_group_shape()
    text(big.shapes, M, 2.15, 3.6, 1.7, str(META["counts"]["essentials"]), size=120, color=GOLD, bold=True)
    text(big.shapes, M, 4.2, 3.6, 0.9, "short interactive courses, for every role", size=19, color=BODY)
    rows = [
        ("play", "Animated slides with narration", "Built to be followed, not read."),
        ("quiz", "A short quiz at the end", "So people know they understood it."),
        ("certificate", "A certificate when you finish", "For each course completed."),
    ]
    groups = []
    for i, (ic, t, b) in enumerate(rows):
        g = s.shapes.add_group_shape()
        y = 2.2 + i * 1.25
        box(g.shapes, 5.1, y, W - 5.1 - M, 1.05)
        icon(g.shapes, ic, 5.35, y + 0.21)
        text(g.shapes, 6.25, y + 0.14, 6, 0.4, t, size=19, color=TEXT, bold=True)
        text(g.shapes, 6.25, y + 0.56, 6, 0.4, b, size=14, color=BODY)
        groups.append(g)
    link = go(s, "Browse AI Essentials", f"{SITE}/ai-academy")
    add_clicks(s, [big] + groups + [link])
    return s


def s_claude():
    s = new_slide("Claude", "Claude at Gennoor", kicker_color=CLAUDE)
    badge, bh = cpn_badge(s.shapes, W - M - 3.0, 0.62, 2.7)
    line = text(s.shapes, M, 1.95, 8.2, 0.4, CPN_LINE, size=18, color=BODY)
    certs = [("ccas-f", "Associate", "associate-foundations"), ("ccdv-f", "Developer", "developer-foundations"), ("ccar-f", "Architect", "architect-foundations"), ("ccar-p", "Architect Pro", "architect-professional")]
    head = text(s.shapes, M, 2.75, 6, 0.3, "A GUIDE AND PRACTICE EXAM FOR EACH CLAUDE CERTIFICATION", size=12, color=MUTED, bold=True)
    tiles = []
    for i, (art, name, slug) in enumerate(certs):
        g = s.shapes.add_group_shape()
        x = M + i * 1.5
        url = f"{SITE}/claude/certifications/{slug}"
        picture(g.shapes, ART / f"art-{art}.png", x, 3.15, 1.1, 1.1, link=url)
        text(g.shapes, x - 0.15, 4.35, 1.4, 0.35, name, size=14, color=TEXT, bold=True, align=PP_ALIGN.CENTER, link=url)
        tiles.append(g)
    rows = [("team", "Training for teams", "Claude for everyday work, Claude Cowork and Claude Code."), ("automation", "Courses by use case", f"{META['counts']['claudeCourses']} instructor-led courses, organised by domain.")]
    groups = []
    for i, (ic, t, b) in enumerate(rows):
        g = s.shapes.add_group_shape()
        y = 3.0 + i * 1.25
        box(g.shapes, 7.3, y, W - 7.3 - M, 1.05)
        icon(g.shapes, ic, 7.55, y + 0.21)
        text(g.shapes, 8.45, y + 0.14, 4, 0.4, t, size=19, color=TEXT, bold=True)
        text(g.shapes, 8.45, y + 0.56, 4, 0.4, b, size=14, color=BODY)
        groups.append(g)
    link = go(s, "See Claude at Gennoor", f"{SITE}/claude")
    add_clicks(s, [[badge, line], [head] + tiles] + groups + [link])
    return s


def s_training():
    c = META["counts"]
    s = new_slide("Training", "Training for your team, built on your work")
    steps = [("doubts", "We learn your work", "We start with what your people do every day."), ("work", "We build the course", "Examples and exercises come from your context."), ("trainer", "We teach it live", "Online or at your office, hands-on.")]
    w, gap, y, h = 3.78, 0.24, 2.2, 2.75
    cards = [card(s, M + i * (w + gap), y, w, h, ic, t, b) for i, (ic, t, b) in enumerate(steps)]
    facts = text(s.shapes, M, 5.3, W - 2 * M, 0.9, [[(f"{c['programs']}", {"bold": True, "color": GOLD, "size": 24}), ("  training programmes ready to adapt      ", {}), (f"{c['exams']}", {"bold": True, "color": GOLD, "size": 24}), ("  certification exams we prepare people for", {})]], size=16, color=BODY, anchor=MSO_ANCHOR.MIDDLE)
    link = go(s, "See team training", f"{SITE}/training")
    add_clicks(s, cards + [facts, link])
    return s


def s_built():
    s = new_slide("Built for your organization", "When a standard course is not enough")
    items = [
        ("work", "A custom training course", "Written around your own tools, processes and examples, with labs, quizzes and a certificate."),
        ("module", "Your own learning platform", "An LMS for your company: your courses, your people, your name. In the cloud or on your premises."),
        ("learn", "Less time in the classroom", "Lessons and labs first, trainer time for the hard parts. Our aim is about 60% less classroom time."),
        ("doubts", "Support after the training", "A doubt desk where a trainer answers, and the answer stays for the next person."),
    ]
    w, h, gx, gy = 5.8, 1.85, 0.24, 0.24
    groups = []
    for i, (ic, t, b) in enumerate(items):
        x, y = M + (i % 2) * (w + gx), 2.15 + (i // 2) * (h + gy)
        g = s.shapes.add_group_shape()
        box(g.shapes, x, y, w, h)
        icon(g.shapes, ic, x + 0.3, y + 0.3)
        text(g.shapes, x + 1.15, y + 0.26, w - 1.4, 0.4, t, size=19, color=TEXT, bold=True)
        text(g.shapes, x + 1.15, y + 0.72, w - 1.4, 1.0, b, size=14, color=BODY)
        groups.append(g)
    link = go(s, "Tell us what you need", f"{SITE}/contact")
    add_clicks(s, groups + [link])
    return s


def s_poc():
    s = new_slide("Prototypes and automation", "See it work before you commit")
    left = s.shapes.add_group_shape()
    box(left.shapes, M, 2.15, 5.8, 3.95)
    icon(left.shapes, "project", M + 0.3, 2.45, art=True)
    text(left.shapes, M + 0.3, 3.25, 5.2, 0.45, "A proof of concept", size=22, color=TEXT, bold=True)
    text(left.shapes, M + 0.3, 3.8, 5.2, 1.2, "One AI use case built as a working prototype, with the scope agreed before work starts.", size=15, color=BODY)
    text(left.shapes, M + 0.3, 5.0, 5.2, 0.9, [[(str(META["counts"]["pocs"]), {"bold": True, "color": GOLD, "size": 30}), ("  blueprints to start from", {})]], size=15, color=BODY, anchor=MSO_ANCHOR.MIDDLE)
    right = s.shapes.add_group_shape()
    rx = M + 6.04
    box(right.shapes, rx, 2.15, 5.8, 3.95, link=f"{SITE}/automation")
    icon(right.shapes, "automation", rx + 0.3, 2.45)
    text(right.shapes, rx + 0.3, 3.25, 5.2, 0.45, "Automation, one process at a time", size=22, color=TEXT, bold=True, link=f"{SITE}/automation")
    text(right.shapes, rx + 0.3, 3.8, 5.2, 2.2, ["Scope first, in writing.", "Tested on your own examples.", "Honest when a process should not be automated.", "People stay in charge of checking."], size=15, color=BODY, spacing=6)
    link = go(s, "How automation works", f"{SITE}/automation")
    add_clicks(s, [left, right, link])
    return s


def s_weekend():
    wk = META["weekend"]
    s = new_slide("Live, every month", wk["name"])
    lead = text(s.shapes, M, 2.0, 7.2, 0.9, f"{wk['tagline']}. Six working demos, built step by step in front of you.", size=20, color=BODY)
    when = s.shapes.add_group_shape()
    box(when.shapes, W - M - 4.1, 1.95, 4.1, 1.45, fill=PANEL2)
    text(when.shapes, W - M - 3.8, 2.1, 3.6, 0.3, "NEXT WEEKEND", size=12, color=GOLD, bold=True)
    text(when.shapes, W - M - 3.8, 2.42, 3.6, 0.45, wk["dates"], size=20, color=TEXT, bold=True)
    text(when.shapes, W - M - 3.8, 2.9, 3.6, 0.35, f"{wk['time']}, online", size=14, color=BODY)
    days = {}
    for day, name, _ in DATA["AI Weekend"]["rows"]:
        days.setdefault(day, []).append(name)
    groups = []
    for i, (day, names) in enumerate(days.items()):
        g = s.shapes.add_group_shape()
        x = M + i * 6.04
        box(g.shapes, x, 3.7, 5.8, 2.55)
        text(g.shapes, x + 0.3, 3.9, 5.2, 0.35, day.upper(), size=12, color=GOLD, bold=True)
        text(g.shapes, x + 0.3, 4.3, 5.2, 1.8, [f"•  {n}" for n in names], size=17, color=TEXT, spacing=8)
        groups.append(g)
    link = go(s, "Reserve a seat", f"{SITE}/ai-weekend")
    add_clicks(s, [lead, when] + groups + [link])
    return s


def s_beyond():
    s = new_slide("Beyond this deck", "The website is where the new things appear")
    lead = text(s.shapes, M, 2.0, W - 2 * M, 0.5, "What you have seen is today. Every part has its own page on gennoor.com, and that page is kept current.", size=18, color=BODY)
    places = [
        ("play", "Learning Studio", "studio"), ("learn", "AI Essentials", "ai-academy"), ("certificate", "Claude", "claude"), ("team", "Training", "training"),
        ("automation", "Automation", "automation"), ("calendar", "AI Weekend", "ai-weekend"), ("doubts", "Webinars", "webinars"), ("catalogue", "Blog", "resources/blog"),
    ]
    w, h, gx, gy = 2.78, 1.35, 0.24, 0.24
    groups = []
    for i, (ic, name, pathpart) in enumerate(places):
        x, y = M + (i % 4) * (w + gx), 2.85 + (i // 4) * (h + gy)
        url = f"{SITE}/{pathpart}"
        g = s.shapes.add_group_shape()
        box(g.shapes, x, y, w, h, link=url)
        icon(g.shapes, ic, x + 0.25, y + 0.36)
        text(g.shapes, x + 1.05, y + 0.3, w - 1.2, 0.4, name, size=17, color=TEXT, bold=True, link=url)
        text(g.shapes, x + 1.05, y + 0.72, w - 1.2, 0.35, f"/{pathpart}  →", size=13, color=BLUE, link=url)
        groups.append(g)
    add_clicks(s, [lead, groups[:4], groups[4:]])
    return s


def s_next():
    s = new_slide()
    picture(s.shapes, LOGO, M, 0.7, 2.2)
    text(s.shapes, M, 2.2, 9.5, 1.3, "Tell us about your team", size=50, color=TEXT, bold=True)
    sub = text(s.shapes, M, 3.5, 8.8, 1.0, "How many people, which teams, and by when. Twenty minutes is enough to suggest something sensible.", size=21, color=BODY)
    call = s.shapes.add_group_shape()
    url = f"{SITE}/resources/calendar"
    box(call.shapes, M, 4.85, 4.3, 0.75, fill=DEEP, line=None, radius=0.5, link=url)
    text(call.shapes, M, 4.85, 4.3, 0.75, [[("Book a 20-minute call  →", {"bold": True, "color": "FFFFFF", "link": url})]], size=19, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    contact = s.shapes.add_group_shape()
    text(contact.shapes, M, 5.95, 2.6, 0.4, "admin@gennoor.com", size=17, color=BLUE, link="mailto:admin@gennoor.com")
    text(contact.shapes, M + 2.9, 5.95, 2.6, 0.4, "www.gennoor.com", size=17, color=BLUE, link=SITE)
    badge, bh = cpn_badge(s.shapes, W - M - 2.9, 5.6, 2.6)
    line = text(s.shapes, W - M - 2.9, 5.6 + bh + 0.1, 2.9, 0.6, CPN_LINE, size=12, color=MUTED)
    add_clicks(s, [sub, call, [contact, badge, line]])
    return s


SLIDES = [s_title, s_doors, s_studio, s_flow, s_courses, s_essentials, s_claude, s_training, s_built, s_poc, s_weekend, s_beyond, s_next]
for build in SLIDES:
    add_transition(build())

prs.core_properties.title = "Gennoor Tech: what we do today"
prs.core_properties.author = "Gennoor Tech"
OUT.parent.mkdir(parents=True, exist_ok=True)
prs.save(OUT)
print("wrote", OUT, f"{OUT.stat().st_size // 1024} KB,", len(SLIDES), "slides")
