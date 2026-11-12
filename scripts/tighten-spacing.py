"""Makes the public pages less tall: the large vertical gaps around headings and between sections are reduced.

    python scripts/tighten-spacing.py            shows what would change, file by file
    python scripts/tighten-spacing.py --apply    changes the files

Only large vertical spacing is touched (Tailwind steps 12 and above: 48 px and more), on
padding, margin and space-y, with any sm:/md:/lg: prefix kept. Each step maps to a smaller one:

    padding (py/pt/pb)    24 -> 14   20 -> 12   16 -> 10   14 -> 10   12 -> 8
    margin (my/mt/mb)     32 -> 16   28 -> 14   24 -> 12   20 -> 10   16 -> 10   14 -> 8   12 -> 8
    space-y               24 -> 12   20 -> 12   16 -> 10   12 -> 8

Left alone: horizontal spacing, small gaps, negative margins (-mt-12), scroll offsets
(scroll-mt-24), the admin pages and the CRM (they have their own compact layout), archived
components, and components that are not sections of a page (forms, pop-ups, players). Run once; running it again would shrink the page a second time.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APPLY = "--apply" in sys.argv
PAD = {"24": "14", "20": "12", "16": "10", "14": "10", "12": "8"}
MARGIN = {"32": "16", "28": "14", "24": "12", "20": "10", "16": "10", "14": "8", "12": "8"}
SPACE = {"24": "12", "20": "12", "16": "10", "12": "8"}
# not preceded by a letter, digit or dash: so scroll-mt-24 and -mt-12 are not matched; a prefix such as lg: is fine
RULE = re.compile(r"(?<![\w-])(py|pt|pb|my|mt|mb|space-y)-(12|14|16|20|24|28|32)(?![\w.\[-])")
SKIP = ("/admin/", "/crm/", "/api/", "_archive")
# Shared components that are whole sections of a page. Forms, pop-ups, players and floating
# pieces are left alone: their spacing is inside a box, not between parts of a page.
SECTIONS = {"AcademyCatalog", "AcademyOverview", "AcademyShowcase", "CourseAbout", "EnablementMoment", "InteractiveCoursesCatalog", "LabsCatalog",
            "LabsSpotlight", "AnimatedLogoShowcase", "LatestBlog", "Footer", "PageCTA", "ClaudeCourseCarousels", "YouTubeGrid", "TrustpilotWidget"}


def smaller(m):
    kind, step = m.group(1), m.group(2)
    table = PAD if kind in ("py", "pt", "pb") else SPACE if kind == "space-y" else MARGIN
    return f"{kind}-{table.get(step, step)}"


total = 0
for folder in ("src/app", "src/components"):
    for f in sorted((ROOT / folder).rglob("*.tsx")):
        rel = f.relative_to(ROOT).as_posix()
        if any(s in rel for s in SKIP) or (folder == "src/components" and f.stem not in SECTIONS):
            continue
        text = f.read_text(encoding="utf-8")
        new, n = RULE.subn(smaller, text)
        if n and new != text:
            total += n
            print(f"{n:>3}  {rel}")
            if APPLY:
                f.write_bytes(new.encode("utf-8"))
print(f"{total} spacing values {'changed' if APPLY else 'would change'}")
