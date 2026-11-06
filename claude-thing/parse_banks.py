"""Parse the three extracted exam .txt banks into structured JSON.

Output: claude-thing/parsed/<name>.json with
  [{n, stem, options:[...], format: single|multi|table, answer: idx | [idx,...] | raw, explanation}]
Table-style questions (Architect-P Yes/No matrices) keep raw answer text for manual conversion.
"""
import json, re, sys, os
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "parsed"
OUT.mkdir(exist_ok=True)

FILES = {
    "associate-foundations": "Claude_Certified_Associate_Foundations_Exam_Answers.txt",
    "developer-foundations": "Claude_Certified_Developer_Foundations_Exam_Answers.txt",
    "architect-professional": "Claude_Certified_Architect_Professional_Exam_Answers.txt",
}

OPT_RE = re.compile(r"^([A-F])\.\s+(.*)$")
Q_RE = re.compile(r"^Question\s+(\d+)\s*$")

def parse(text):
    lines = [l.rstrip() for l in text.split("\n")]
    qs, i = [], 0
    cur = None
    mode = None  # stem | options | answer | explanation
    for raw in lines:
        line = raw.strip()
        m = Q_RE.match(line)
        if m:
            if cur: qs.append(cur)
            cur = {"n": int(m.group(1)), "stem": [], "options": [], "answer_raw": [], "explanation": []}
            mode = "stem"
            continue
        if cur is None:
            continue
        if line.startswith("Answer:"):
            mode = "answer"
            cur["answer_raw"].append(line[len("Answer:"):].strip())
            continue
        if line.startswith("Explanation:"):
            mode = "explanation"
            cur["explanation"].append(line[len("Explanation:"):].strip())
            continue
        om = OPT_RE.match(line)
        if om and mode in ("stem", "options"):
            mode = "options"
            cur["options"].append(om.group(2).strip())
            continue
        if not line:
            continue
        if mode == "stem":
            cur["stem"].append(line)
        elif mode == "options":
            # continuation of previous option
            if cur["options"]:
                cur["options"][-1] += " " + line
            else:
                cur["stem"].append(line)
        elif mode == "answer":
            cur["answer_raw"].append(line)
        elif mode == "explanation":
            cur["explanation"].append(line)
    if cur: qs.append(cur)

    out = []
    for q in qs:
        stem = "\n".join(q["stem"]).strip()
        ans = " ".join(q["answer_raw"]).strip()
        expl = " ".join(q["explanation"]).strip()
        opts = q["options"]
        item = {"n": q["n"], "stem": stem, "options": opts, "explanation": expl}
        if "→" in ans or "->" in ans.replace("→", "->") and ";" in ans and not opts:
            item["format"] = "table"; item["answer"] = ans
        elif " | " in ans:
            # multi-select: match each part to an option by prefix letter or text
            parts = [p.strip() for p in ans.split(" | ")]
            idxs = []
            for p in parts:
                mm = re.match(r"^([A-F])\.\s*(.*)$", p)
                if mm:
                    idxs.append(ord(mm.group(1)) - 65)
                else:
                    # text match
                    best = None
                    for k, o in enumerate(opts):
                        if p[:60].lower() in o.lower() or o[:60].lower() in p.lower():
                            best = k; break
                    if best is None:
                        item.setdefault("warn", []).append("unmatched multi part: " + p[:80])
                    else:
                        idxs.append(best)
            item["format"] = "multi"; item["answer"] = sorted(set(idxs))
        else:
            mm = re.match(r"^([A-F])\.?\s*", ans)
            if mm and opts:
                item["format"] = "single"; item["answer"] = ord(mm.group(1)) - 65
            else:
                item["format"] = "table"; item["answer"] = ans
        # sanity checks
        if item["format"] in ("single",) and (not opts or item["answer"] >= len(opts)):
            item.setdefault("warn", []).append("answer index out of range")
        if item["format"] == "multi" and any(a >= len(opts) for a in item["answer"]):
            item.setdefault("warn", []).append("multi index out of range")
        out.append(item)
    return out

if __name__ == "__main__":
    for slug, fname in FILES.items():
        text = open(HERE / fname, encoding="utf8").read()
        qs = parse(text)
        warns = [(q["n"], q.get("warn")) for q in qs if q.get("warn")]
        tables = [q["n"] for q in qs if q["format"] == "table"]
        multis = [q["n"] for q in qs if q["format"] == "multi"]
        json.dump(qs, open(OUT / f"{slug}.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
        print(f"{slug}: {len(qs)} questions | multi: {multis} | table/raw: {tables} | warns: {warns}")
