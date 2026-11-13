"""Regenerates public/Gennoor-Tech-Catalog/Gennoor-Tech-Catalog.xlsx from catalog-data.json.

    npx tsx --env-file=.env.local scripts/catalog/extract-site-data.ts   (reads the site, writes catalog-data.json)
    python scripts/catalog/build-catalog-xlsx.py                         (this file)

The content comes from the website's own data, so the catalogue says what the
site says. This file only does the design. Run both whenever courses, prices or
programmes change: the workbook is attached to enquiry replies and to email 2
of the CRM series."""
import json
from pathlib import Path

from openpyxl import Workbook
from openpyxl.drawing.image import Image as XLImage
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.properties import PageSetupProperties

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((Path(__file__).with_name("catalog-data.json")).read_text(encoding="utf-8"))
OUT = ROOT / "public" / "Gennoor-Tech-Catalog" / "Gennoor-Tech-Catalog.xlsx"
LOGO = ROOT / "public" / "logos" / "gennoor-tech-horizontal-dark-bright_1200x410_email-signature.png"

NAVY, BLUE, ORANGE = "0C1426", "2563EB", "F59E0B"
INK, GREY, LINE, SOFT, ZEBRA, WHITE = "0F172A", "64748B", "E2E8F0", "F4F7FF", "F8FAFC", "FFFFFF"
FONT = "Segoe UI"
SITE = "https://www.gennoor.com"

fill = lambda c: PatternFill("solid", fgColor=c)
thin = Side(style="thin", color=LINE)
hair = Side(style="hair", color=LINE)
f = lambda size=10, bold=False, color=INK, italic=False, underline=None: Font(name=FONT, size=size, bold=bold, color=color, italic=italic, underline=underline)
LINK = f(10, True, BLUE, underline="single")

# sheet -> (display title, tab colour, short note shown under the title, link column header or None)
SHEETS = {
    # Only what we really offer, in the order of the film "What we do" (owner, 13 November 2026)
    "What we offer": ("What we offer", BLUE, "Everything we do, each with its page on the website."),
    "Learning Studio": ("Learning Studio courses", BLUE, "Video courses with labs, quizzes and a certificate. Live now. Preview lessons play without signing in."),
    "Coming soon": ("Coming soon to the Learning Studio", BLUE, "Microsoft courses on AI, AI for business, Copilot and data, on their way to the Learning Studio."),
    "AI Essentials": ("AI Essentials", BLUE, "Short interactive courses with narration and a quiz. Open on the website."),
    "Claude certifications": ("Claude certification preparation", "D97757", "A guide and a practice exam for each Claude certification. Open on the website."),
    "Claude courses": ("Claude automation courses for teams", "D97757", "Instructor-led, each built around one job a team does. The outline of each is on its page."),
    "Built for you": ("Built for your organization", ORANGE, "A course, a learning platform or a working prototype, made for one company."),
    "AI Weekend": ("Gennoor AI Weekend", ORANGE, "What is built live across the two days."),
}
WIDE = {"What it includes", "What it is", "Description", "What you leave with", "Problem it solves", "What we build"}
CENTER = {"#", "Chapters", "Lessons", "Hours", "Quizzes", "Preview lessons", "Timeline", "Hands-on", "Status"}
BOLD = {"Title", "Offering", "What we offer", "What you build", "What is built live", "Code"}
FIRST_BOLD = {"Built for you"}  # sheets whose first column is the name of the thing
META = DATA["meta"]

wb = Workbook()
wb.properties.title = "Gennoor Tech Catalog"
wb.properties.creator = "Gennoor Tech"
wb.properties.subject = "Learning Studio courses, Claude programmes, team training and the AI Weekend"


def band(ws, row, last_col, color, height):
    ws.row_dimensions[row].height = height
    for c in range(1, last_col + 1):
        ws.cell(row=row, column=c).fill = fill(color)


def page_setup(ws, header_row=None, landscape=True):
    ws.sheet_view.showGridLines = False
    ws.page_setup.orientation = "landscape" if landscape else "portrait"
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.sheet_properties.pageSetUpPr = PageSetupProperties(fitToPage=True)
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.page_margins.left = ws.page_margins.right = 0.4
    ws.page_margins.top = 0.5
    ws.page_margins.bottom = 0.6
    ws.print_options.horizontalCentered = True
    ws.oddFooter.center.text = "Gennoor Tech  ·  www.gennoor.com  ·  Page &P of &N"
    ws.oddFooter.center.size = 8
    ws.oddFooter.center.font = f"{FONT},Regular"
    if header_row:
        ws.print_title_rows = f"{header_row}:{header_row}"


def est_height(texts_widths, base=15.0, line=13.2):
    """Row height for wrapped text: the tallest cell decides (a merged cell cannot auto-fit)."""
    lines = 1
    for text, width in texts_widths:
        chars_per_line = max(8, int(width * 0.92))
        n = 0
        for part in str(text).split("\n"):
            n += max(1, -(-len(part) // chars_per_line))
        lines = max(lines, n)
    return max(base, lines * line + 4)


# ---------------------------------------------------------------- cover
cover = wb.active
cover.title = "Start here"
cover.sheet_properties.tabColor = ORANGE
for col, w in zip("ABCDEFG", (3, 26, 62, 30, 3, 3, 3)):
    cover.column_dimensions[col].width = w
for r in range(1, 6):
    band(cover, r, 5, NAVY, 20)
cover.row_dimensions[1].height = 14
img = XLImage(str(LOGO))
img.width, img.height = 330, 113
cover.add_image(img, "B2")
cover.row_dimensions[2].height = 30
cover.row_dimensions[3].height = 30
cover.row_dimensions[4].height = 30
band(cover, 6, 5, BLUE, 4)

cover.merge_cells("B8:D8")
cover["B8"] = "Catalogue"
cover["B8"].font = f(28, True, INK)
cover.row_dimensions[8].height = 42
cover.merge_cells("B9:D9")
cover["B9"] = f"Practical AI and cloud learning, for people and for teams.   As of {META['generatedOn']}."
cover["B9"].font = f(13, False, GREY)
cover.row_dimensions[9].height = 22

r = 11
cover.cell(row=r, column=2, value="WHAT IS INSIDE").font = f(9, True, GREY)
cover.row_dimensions[r].height = 22
r += 1
counts = {}
for i, (key, (title, _, note)) in enumerate(SHEETS.items(), 1):
    rows = len(DATA[key]["rows"])
    c = cover.cell(row=r, column=2, value=f"{i:02d}   {title}")
    c.hyperlink = f"#'{key}'!A1"
    c.font = LINK
    d = cover.cell(row=r, column=3, value=counts.get(key) or note)
    d.font = f(10, False, INK)
    d.alignment = Alignment(vertical="center", wrap_text=True)
    n = cover.cell(row=r, column=4, value=f"{rows} entries")
    n.font = f(10, False, GREY)
    n.alignment = Alignment(horizontal="right", vertical="center")
    for col in (2, 3, 4):
        cell = cover.cell(row=r, column=col)
        cell.border = Border(bottom=thin)
        cell.alignment = Alignment(horizontal=cell.alignment.horizontal, vertical="center", wrap_text=True)
        if i % 2 == 0:
            cell.fill = fill(ZEBRA)
    cover.row_dimensions[r].height = 26
    r += 1

r += 1
cover.cell(row=r, column=2, value="HOW THE LEARNING STUDIO WORKS").font = f(9, True, GREY)
cover.row_dimensions[r].height = 22
r += 1
steps = [
    ("1  Browse", "Open gennoor.com/studio and filter by type, company, level or topic."),
    ("2  Watch the previews", "Up to six lessons of every course play at once. Nothing to sign up for."),
    ("3  Take the full course", "Every lesson, lab and quiz opens, and progress is saved on any device."),
    ("4  Finish with a certificate", "Quizzes check each module. An assistant in the player answers questions, and each course has a discussion page."),
    ("For a team", "We add the courses you need, or build one on your own work. Talk to us for team access."),
]
for label, text in steps:
    cover.cell(row=r, column=2, value=label).font = f(10, True, INK)
    cover.merge_cells(start_row=r, start_column=3, end_row=r, end_column=4)
    cell = cover.cell(row=r, column=3, value=text)
    cell.font = f(10, False, INK)
    cell.alignment = Alignment(wrap_text=True, vertical="top")
    cover.cell(row=r, column=2).alignment = Alignment(vertical="top")
    cover.row_dimensions[r].height = est_height([(text, 92)])
    r += 1
cover.cell(row=r, column=2, value="See it in 9 minutes").font = f(10, True, INK)
c = cover.cell(row=r, column=3, value="Watch the Learning Studio walkthrough video")
c.hyperlink = META["walkthrough"]
c.font = LINK
cover.row_dimensions[r].height = 20
r += 1

wk = META["weekend"]
r += 1
cover.cell(row=r, column=2, value="LIVE EVERY MONTH").font = f(9, True, GREY)
cover.row_dimensions[r].height = 22
r += 1
cover.cell(row=r, column=2, value=wk["name"]).font = f(10, True, INK)
cover.merge_cells(start_row=r, start_column=3, end_row=r, end_column=4)
# Said in words that stay true after this month: the page carries the exact dates
text = f"{wk['tagline']}. The last weekend of every month, Saturday and Sunday, {wk['time']}, online."
c = cover.cell(row=r, column=3, value=text)
c.hyperlink = f"{SITE}/ai-weekend"
c.font = LINK
c.alignment = Alignment(wrap_text=True, vertical="top")
cover.row_dimensions[r].height = est_height([(text, 92)])
r += 1

r += 1
cover.cell(row=r, column=2, value="TALK TO US").font = f(9, True, GREY)
cover.row_dimensions[r].height = 22
r += 1
for label, text, link in (
    ("Email", "admin@gennoor.com", "mailto:admin@gennoor.com"),
    ("Phone / WhatsApp", "+91 93263 52241", "https://wa.me/919326352241"),
    ("Website", "www.gennoor.com", SITE),
    ("Learning Studio", "gennoor.com/studio", f"{SITE}/studio"),
    ("Book a call", "gennoor.com/resources/calendar", f"{SITE}/resources/calendar"),
):
    cover.cell(row=r, column=2, value=label).font = f(10, True, INK)
    c = cover.cell(row=r, column=3, value=text)
    c.hyperlink = link
    c.font = LINK
    cover.row_dimensions[r].height = 20
    r += 1
r += 1
cover.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
cover.cell(row=r, column=2, value="Gennoor Tech  ·  Mumbai, India  ·  Train. Innovate. Build.").font = f(9, False, GREY, italic=True)
page_setup(cover, landscape=False)

# ---------------------------------------------------------------- data sheets
for key, (title, tab, note) in SHEETS.items():
    d = DATA[key]
    ws = wb.create_sheet(key)
    ws.sheet_properties.tabColor = tab
    header, rows = d["header"], d["rows"]
    ncol = len(header)
    widths = {}
    for i, h in enumerate(header, 1):
        old = d["widths"].get(get_column_letter(i))
        w = old or 18
        if h == "#":
            w = 6
        elif h in CENTER:
            w = 13
        elif h in WIDE:
            w = max(w, 46)
        widths[i] = w
        ws.column_dimensions[get_column_letter(i)].width = w

    band(ws, 1, ncol, NAVY, 40)
    ws.cell(row=1, column=1, value=title).font = f(18, True, WHITE)
    ws.cell(row=1, column=1).alignment = Alignment(vertical="center", indent=1)
    back = ws.cell(row=1, column=ncol, value="← Contents")
    back.hyperlink = "#'Start here'!A1"
    back.font = f(10, True, "93B4FF", underline="single")
    back.alignment = Alignment(horizontal="right", vertical="center", indent=1)
    band(ws, 2, ncol, SOFT, 24)
    count = f"{len(rows)} entries"
    ws.cell(row=2, column=1, value=f"{note}   ·   {count}").font = f(10, False, GREY)
    ws.cell(row=2, column=1).alignment = Alignment(vertical="center", indent=1)
    band(ws, 3, ncol, BLUE, 3)

    ws.row_dimensions[4].height = 28
    for i, h in enumerate(header, 1):
        c = ws.cell(row=4, column=i, value=h)
        c.font = f(10, True, WHITE)
        c.fill = fill(BLUE)
        c.alignment = Alignment(horizontal="center" if h in CENTER else "left", vertical="center", indent=0 if h in CENTER else 1)
        c.border = Border(bottom=Side(style="medium", color=NAVY))

    for ri, vals in enumerate(rows):
        row = 5 + ri
        tallest = []
        for ci, (h, v) in enumerate(zip(header, vals), 1):
            c = ws.cell(row=row, column=ci, value=v)
            c.font = f(10, h in BOLD or (key in FIRST_BOLD and ci == 1), INK)
            c.alignment = Alignment(
                horizontal="center" if h in CENTER else "left",
                vertical="top",
                wrap_text=True,
                indent=0 if h in CENTER else 1,
            )
            c.border = Border(bottom=hair)
            if ri % 2 == 1:
                c.fill = fill(ZEBRA)
            if h == "Status" and v == "New":
                c.font = f(10, True, "B45309")
                c.fill = fill("FEF3C7")
            if h == "Link" and isinstance(v, str) and v:
                url = v if v.startswith("http") else f"https://{v}"
                c.hyperlink = url
                c.font = LINK
            if v is not None:
                tallest.append((v, widths[ci] - (0 if h in CENTER else 2)))
        ws.row_dimensions[row].height = est_height(tallest)

    last = 4 + len(rows)
    ws.freeze_panes = "A5"
    ws.auto_filter.ref = f"A4:{get_column_letter(ncol)}{last}"
    page_setup(ws, header_row=4)

wb.active = 0
OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
print("wrote", OUT, f"{OUT.stat().st_size // 1024} KB")
