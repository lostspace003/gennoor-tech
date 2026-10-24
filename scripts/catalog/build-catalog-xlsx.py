"""Regenerates public/Gennoor-Tech-Catalog/Gennoor-Tech-Catalog.xlsx from catalog-data.json.
python scripts/catalog/build-catalog-xlsx.py
Content lives in catalog-data.json; this file only does the design."""
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
    "Offerings": ("Offerings", BLUE, "Five service lines, from strategy to certification."),
    "The Gennoor Way": ("The Gennoor Way", BLUE, "Our five-phase transformation method."),
    "Bootcamps": ("Bootcamps", BLUE, "Instructor-led programs, five days or less."),
    "Courses": ("Courses", BLUE, "Instructor-led courses, one to three days."),
    "AI Academy (Free)": ("AI Academy (free)", "16A34A", "Self-paced courses. Free with one sign-in."),
    "PoC Blueprints": ("PoC Blueprints", BLUE, "Fixed-scope, production-ready prototypes."),
    "Free Resources": ("Free resources", "16A34A", "Guides, tools and libraries. Click a link to open it."),
    "Case Studies": ("Case studies", BLUE, "Real enterprise engagements."),
}
WIDE = {"What it includes", "Description", "Problem it solves", "Promise", "Key outputs", "Headline outcome", "What you get", "Technologies", "Industries", "Audience", "Best for", "Engagement"}
CENTER = {"#", "Phase", "Level", "Duration", "Certification", "Chapters", "Timeline", "Typical duration"}

wb = Workbook()
wb.properties.title = "Gennoor Tech Catalog"
wb.properties.creator = "Gennoor Tech"
wb.properties.subject = "Training, certification, AI Academy, PoC blueprints and free resources"


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
cover["B8"] = "Master catalog"
cover["B8"].font = f(28, True, INK)
cover.row_dimensions[8].height = 42
cover.merge_cells("B9:D9")
cover["B9"] = "Enterprise AI training, certification and solutions"
cover["B9"].font = f(13, False, GREY)
cover.row_dimensions[9].height = 22

r = 11
cover.cell(row=r, column=2, value="WHAT IS INSIDE").font = f(9, True, GREY)
cover.row_dimensions[r].height = 22
r += 1
overview = {row[0]: row[1] for row in DATA["Overview"] if row[0]}
counts = {
    "Offerings": overview.get("Offerings", ""),
    "The Gennoor Way": "The five-phase method: diagnose, train, build, adopt, sustain",
    "Bootcamps": overview.get("Bootcamps", ""),
    "Courses": overview.get("Courses", ""),
    "AI Academy (Free)": overview.get("AI Academy (free)", ""),
    "PoC Blueprints": overview.get("PoC Blueprints", ""),
    "Free Resources": overview.get("Free resources", ""),
    "Case Studies": overview.get("Case studies", ""),
}
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
cover.cell(row=r, column=2, value="HOW WE WORK").font = f(9, True, GREY)
cover.row_dimensions[r].height = 22
r += 1
for label in ("Delivery", "Delivered by", "Pricing"):
    cover.cell(row=r, column=2, value=label).font = f(10, True, INK)
    cover.merge_cells(start_row=r, start_column=3, end_row=r, end_column=4)
    text = overview.get(label, "")
    cell = cover.cell(row=r, column=3, value=text)
    cell.font = f(10, False, INK)
    cell.alignment = Alignment(wrap_text=True, vertical="top")
    cover.cell(row=r, column=2).alignment = Alignment(vertical="top")
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
        if h in CENTER:
            w = max(10, min(w, 16))
        elif h in WIDE:
            w = max(w, 46)
        elif h == "#":
            w = 6
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
            c.font = f(10, h in ("Title", "Offering", "Name", "Resource", "Client"), INK)
            c.alignment = Alignment(
                horizontal="center" if h in CENTER else "left",
                vertical="top",
                wrap_text=True,
                indent=0 if h in CENTER else 1,
            )
            c.border = Border(bottom=hair)
            if ri % 2 == 1:
                c.fill = fill(ZEBRA)
            if h == "Certification" and isinstance(v, str):
                c.font = f(10, True, "15803D" if v.strip().lower() == "yes" else GREY)
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
