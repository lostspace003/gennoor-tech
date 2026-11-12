"""Reads Microsoft's courseware title plan (the Excel workbook Microsoft sends to trainers)
and keeps the part our catalogue shows: the official instructor-led courses.

    python scripts/catalog/import-title-plan.py "C:/path/to/titleplan_<date>.xlsx"

Writes scripts/catalog/microsoft-courses.json. Then run extract-site-data.ts and the two
build scripts, as usual. Run this again whenever Microsoft sends a newer title plan.

What is kept: courses whose state is Released and that are not about to be retired.
What is left out, on purpose: courses still under development or closed (their dates are
Microsoft's plans, not ours to publish), and courses retiring within the next 60 days.
"New" means Microsoft published it as a new course in the last 12 months.
"""
import json
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

import openpyxl

src = Path(sys.argv[1])
wb = openpyxl.load_workbook(src, read_only=True, data_only=True)
rows = [r for r in wb["Courseware Title Plan"].iter_rows(values_only=True) if any(c is not None for c in r)]
head = [str(h) for h in rows[0]]
today = datetime.now()

LEADS_TO = {"Exam/Certification": "Certification exam", "Applied Skills Assessment": "Applied Skills credential"}
out, skipped = [], {"not released": 0, "retiring": 0}
for r in rows[1:]:
    d = dict(zip(head, r))
    if d.get("State") != "Released":
        skipped["not released"] += 1
        continue
    retire = d.get("Retire Date")
    if isinstance(retire, datetime) and retire <= today + timedelta(days=60):
        skipped["retiring"] += 1
        continue
    code = str(d["Course Number"]).strip()
    released = d.get("Release Date") if isinstance(d.get("Release Date"), datetime) else None
    is_new = d.get("Pub Type") == "New" and released is not None and released >= today - timedelta(days=365)
    contains = str(d.get("Course Contains") or "")
    out.append({
        "code": code,
        # The title repeats the course number in front ("AB-100T00: ..."); the code has its own column
        "title": re.sub(rf"^{re.escape(code)}\s*:\s*", "", str(d["Title"]).strip()),
        "area": str(d["Solution Area"]).strip(),
        "duration": re.sub(r"^(\d+) (day|hour)$", lambda m: f"{m.group(1)} {m.group(2)}{'' if m.group(1) == '1' else 's'}", str(d["Duration"]).strip()),
        "leadsTo": LEADS_TO.get(str(d.get("Credential")), ""),
        "handsOn": "Labs" if "Labs" in contains else "Simulations" if "Simulations" in contains else "Guided" if "Guides" in contains else "",
        "isNew": is_new,
        "updated": released.strftime("%b %Y") if released else "",
        "url": str(d.get("Detail Page Url") or "").strip(),
    })

# New courses first (newest at the top), then the rest by area and course number
out.sort(key=lambda c: (not c["isNew"], "" if c["isNew"] else c["area"], c["code"]))
dest = Path(__file__).with_name("microsoft-courses.json")
dest.write_text(json.dumps({"source": src.name, "importedOn": today.strftime("%Y-%m-%d"), "courses": out}, indent=1, ensure_ascii=False), encoding="utf-8")
print(f"wrote {dest}: {len(out)} courses, {sum(c['isNew'] for c in out)} new; left out {skipped}")
