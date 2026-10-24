"""One-off: read the original catalog workbook and write its data to catalog-data.json.
build-catalog-xlsx.py then regenerates the workbook from that file, so the content has one source.
python scripts/catalog/extract-catalog-data.py <original.xlsx>"""
import json
import sys
from pathlib import Path

import openpyxl

src = sys.argv[1]
wb = openpyxl.load_workbook(src)
out = {}
for ws in wb:
    if ws.title in ("Overview", "Contact"):
        out[ws.title] = [[c.value for c in r] for r in ws.iter_rows(min_row=1) if any(c.value is not None for c in r)]
        continue
    header = [c.value for c in ws[4]]
    rows = []
    for r in ws.iter_rows(min_row=5):
        vals = [c.value for c in r]
        if any(v is not None for v in vals):
            rows.append(vals)
    widths = {k: v.width for k, v in ws.column_dimensions.items()}
    out[ws.title] = {"subtitle": ws["A2"].value, "header": header, "rows": rows, "widths": widths}
dest = Path(__file__).with_name("catalog-data.json")
dest.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", dest, {k: (len(v["rows"]) if isinstance(v, dict) else len(v)) for k, v in out.items()})
