r"""voice_kaggle.py - voice every flow's narration on Kaggle in the locked course voice (Course Factory voice pipeline).

    "C:\Users\losts\Desktop\Course Factory\recording\tools\.venv\Scripts\python.exe" claude-thing\flows\voice_kaggle.py [key-id ...]

Narration source: narration/<slug>/<id>.json = {"steps": ["...", ...]} (one line per spec step).
Output: voice/_work/<key>-<id>/voice/s<n>.wav + manifest.json (seconds per step), consumed by render.js.
Incremental: a flow is sent only when a step's text has no matching wav. Reuses the Course Factory Kaggle runner
(fabric_kaggle.py: dataset bundle, kernel push, account auto-switch, download + unpack).
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOOLS = Path(r"C:\Users\losts\Desktop\Course Factory\recording\tools")
sys.path.insert(0, str(TOOLS / "kaggle_fabric"))
sys.path.insert(0, str(TOOLS))
VOICE = HERE / "voice" / "_work"            # fabric_kaggle unpacks to video_dir()/_work/<lesson>/voice
COURSES = {"associate-foundations": "ccasf", "developer-foundations": "ccdvf",
           "architect-foundations": "ccarf", "architect-professional": "ccarp"}

import fabric_kaggle as fk  # noqa: E402

fk.fs.video_dir = lambda: HERE / "voice"
fk.fs.work_dir = lambda lesson: VOICE / lesson


def pending(only):
    todo = []
    for slug, key in COURSES.items():
        for f in sorted((HERE / "narration" / slug).glob("*.json")):
            name = f"{key}-{f.stem}"
            if only and name not in only:
                continue
            lines = json.loads(f.read_text(encoding="utf-8"))["steps"]
            d = VOICE / name
            d.mkdir(parents=True, exist_ok=True)
            units = [dict(id=f"s{i + 1}", say=t) for i, t in enumerate(lines)]
            (d / "units.json").write_text(json.dumps(units, ensure_ascii=False, indent=1), encoding="utf-8")
            man = json.loads((d / "voice" / "manifest.json").read_text(encoding="utf-8")) if (d / "voice" / "manifest.json").exists() else {}
            said = {k: v.get("say") for k, v in man.items()}
            if any(said.get(u["id"]) != u["say"] or not (d / "voice" / f"{u['id']}.wav").exists() for u in units):
                todo.append(name)
    return todo


def stamp(names):
    """Record the source text next to each voiced step so later runs can skip unchanged flows."""
    for name in names:
        d = VOICE / name
        mf = d / "voice" / "manifest.json"
        if not mf.exists():
            continue
        man = json.loads(mf.read_text(encoding="utf-8"))
        for u in json.loads((d / "units.json").read_text(encoding="utf-8")):
            if u["id"] in man:
                man[u["id"]]["say"] = u["say"]
        mf.write_text(json.dumps(man, indent=1, ensure_ascii=False), encoding="utf-8")


def main():
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    todo = pending(only)
    print(f"{len(todo)} flows to voice: {todo}")
    if not todo:
        return
    import os
    acc = fk.pick_account(os.environ.get("KAGGLE_USER", "auto"))
    if not acc:
        sys.exit("no Kaggle account with GPU hours")
    user, token, hours = acc
    res = fk.run(user, token, todo, os.environ.get("KAGGLE_TAG", "flows"), min(5.0, hours - 0.4))
    stamp(res["done"])
    print("done", len(res["done"]), "todo", res["todo"])


if __name__ == "__main__":
    main()
