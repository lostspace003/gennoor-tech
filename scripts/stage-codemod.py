"""Turns colours written as fixed values into colour names that follow the theme.

    python scripts/stage-codemod.py            shows what would change, file by file
    python scripts/stage-codemod.py --apply    changes the files

The public website is dark ("the stage") and the admin centre is light ("paper"); see
docs/DESIGN.md. A class like `text-gray-500` is right on both, because its colour is a
variable. A class like `text-[#6e6e73]` or `bg-white` is fixed, so it stays light on the
dark stage. This script rewrites the fixed ones:

    text-[#6e6e73]  ->  text-gray-500         a hex becomes the nearest name in the palette
    bg-white        ->  bg-raised             on something with rounded corners (a card, a field)
    bg-white        ->  bg-surface            on anything else (a section, a bar)
    bg-white/90     ->  bg-surface/90         a frosted bar; faint whites (bg-white/10) are left alone,
                                              they are highlights on dark blocks
    from-white      ->  from-surface          a fade into the page

Left alone on purpose: colours that are the same on both themes. Dark navy blocks and the
light text on them, brand colours (the gold of the AI Weekend, Trustpilot green, WhatsApp
green, LinkedIn blue), and the cream card behind the Claude Partner badge.

It is safe to run again: a file with nothing fixed in it is not touched. Admin and CRM pages
are skipped; they are always light and keep their own classes.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APPLY = "--apply" in sys.argv
SKIP = ("/admin/", "/crm/", "/api/", "_archive")

# hex -> palette name. A tuple gives a different name by kind of class: (text, background, border and the rest)
G = "gray"
HEX = {
    # neutrals
    "6e6e73": f"{G}-500", "86868b": f"{G}-400", "a1a1a6": f"{G}-400", "3a3a3f": f"{G}-700", "424245": f"{G}-700",
    "1d1d1f": f"{G}-900", "545458": f"{G}-600", "4a4a50": f"{G}-700", "48484a": f"{G}-700", "52525b": f"{G}-600",
    "1b2845": (f"{G}-900", None, None), "5c6784": (f"{G}-500", None, None), "6f7d92": (f"{G}-400", None, None),
    "d2d2d7": (f"{G}-300", f"{G}-300", f"{G}-300"), "b5b5bb": (None, f"{G}-300", f"{G}-300"),
    "f5f5f7": (None, f"{G}-50", f"{G}-100"), "f5f6f8": f"{G}-50", "fafafc": f"{G}-50", "fafafa": f"{G}-50", "f8f9fb": f"{G}-50",
    "eaeaef": f"{G}-100", "e8e8ed": (None, f"{G}-100", f"{G}-200"), "eef0f4": f"{G}-100", "eef1f6": f"{G}-100", "e9ebf0": f"{G}-100",
    "f0f0f2": f"{G}-100", "f0f0f3": f"{G}-100", "e2e5ec": f"{G}-200", "e0e0e5": f"{G}-200", "e6dfd4": (None, None, f"{G}-200"),
    "f3efe6": (None, f"{G}-50", None),
    # the accent
    "0071e3": "primary-600", "0077ed": "primary-500", "0058b0": "primary-700", "2563eb": "primary-600",
    "2997ff": ("primary-400", None, None), "52a8ff": ("primary-400", None, None), "7db8ff": ("primary-300", None, None),
    "7dbcf7": ("primary-300", None, None), "8fb8ff": ("primary-300", None, None),
    "f0f7ff": "primary-50", "eef4ff": "primary-50", "e8f0fe": "primary-100", "e8eefc": "primary-100", "d6e8ff": "primary-200", "5aa9f3": "primary-400",
    # meanings
    "1d8348": "green-600", "5fa77a": "green-400", "9b2c21": "red-700", "c0392b": "red-600", "eaa59d": "red-300", "fdf4f3": "red-50",
    "9a6700": "amber-600", "b45309": "amber-700", "fff8f0": "amber-50",
}
KIND = {"text": 0, "placeholder": 0, "decoration": 0, "caret": 0, "fill": 0, "stroke": 0, "bg": 1, "from": 1, "to": 1, "via": 1}
HEX_RULE = re.compile(r"(?<![\w-])((?:[a-z0-9-]+:)*)(bg|text|border(?:-[trblxyse])?|ring|divide|from|to|via|fill|stroke|outline|decoration|placeholder|caret)-\[#([0-9a-fA-F]{6})\](/\d+)?")
WHITE_RULE = re.compile(r"(?<![\w-])((?:[a-z0-9-]+:)*)bg-white(/\d+)?(?![\w/-])")
FADE_RULE = re.compile(r"(?<![\w-])((?:[a-z0-9-]+:)*)(from|to|via)-white(?![\w/-])")
STRING = re.compile(r"""(["'`])((?:\\.|(?!\1).)*)\1""", re.S)


def hex_name(m):
    variants, util, value, alpha = m.group(1), m.group(2), m.group(3).lower(), m.group(4) or ""
    name = HEX.get(value)
    if isinstance(name, tuple):
        name = name[KIND.get(util.split("-")[0], 2)]
    return f"{variants}{util}-{name}{alpha}" if name else m.group(0)


def in_string(m):
    quote, body = m.group(1), m.group(2)
    if "bg-white" not in body and "-white" not in body and "[#" not in body:
        return m.group(0)
    card = bool(re.search(r"(?<![\w-])(?:[a-z0-9-]+:)*rounded(?!-none)", body))

    def white(w):
        variants, alpha = w.group(1), w.group(2) or ""
        if alpha and int(alpha[1:]) < 70:
            return w.group(0)                      # a faint highlight on a dark block
        if alpha:
            return f"{variants}bg-surface{alpha}"  # a frosted bar
        # a hover or focus fill is a state of something already on the page, so it is a surface
        return f"{variants}bg-{'raised' if card and not variants.replace('sm:', '').replace('md:', '').replace('lg:', '').replace('xl:', '') else 'surface'}"

    body = WHITE_RULE.sub(white, body)
    body = FADE_RULE.sub(lambda f: f"{f.group(1)}{f.group(2)}-surface", body)
    body = HEX_RULE.sub(hex_name, body)
    return f"{quote}{body}{quote}"


def line_pass(line):
    if "[#" not in line and "-white" not in line:
        return line
    card = bool(re.search(r"(?<![\w-])(?:[a-z0-9-]+:)*rounded(?!-none)", line))

    def white(w):
        variants, alpha = w.group(1), w.group(2) or ""
        if alpha and int(alpha[1:]) < 70:
            return w.group(0)
        if alpha:
            return f"{variants}bg-surface{alpha}"
        return f"{variants}bg-{'raised' if card and not variants else 'surface'}"

    line = WHITE_RULE.sub(white, line)
    line = FADE_RULE.sub(lambda f: f"{f.group(1)}{f.group(2)}-surface", line)
    return HEX_RULE.sub(hex_name, line)


total = files = 0
for folder in ("src/app", "src/components"):
    for f in sorted((ROOT / folder).rglob("*.tsx")):
        rel = f.relative_to(ROOT).as_posix()
        if any(s in rel for s in SKIP):
            continue
        text = f.read_text(encoding="utf-8")
        new = STRING.sub(in_string, text)
        # A second look, line by line: an apostrophe in a sentence ("don't") can throw the pairing of
        # quotes above, and a class string after it is then missed.
        new = "\n".join(line_pass(line) for line in new.split("\n"))
        if new != text:
            n = sum(1 for a, b in zip(text.split(), new.split()) if a != b)
            total += n
            files += 1
            print(f"{n:>4}  {rel}")
            if APPLY:
                f.write_bytes(new.encode("utf-8"))
print(f"{total} classes in {files} files {'changed' if APPLY else 'would change'}")
