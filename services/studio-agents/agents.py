"""
Studio agent pipelines, built on the Microsoft Agent Framework (MAF).

    researcher  -> distils the topic and any reference material into verified facts
    writer      -> writes the LinkedIn post from those facts
    designer    -> writes either an image prompt or a motion-graphic scene spec (see render.py)
    reviewer    -> checks the draft against brand and factual rules and returns a verdict

The four agents run as a MAF sequential workflow; every executor start, streamed token and completion is yielded
as a plain dict so the web app can show the process live. The service never publishes anything.
"""
from __future__ import annotations

import json
import os
from typing import Any, AsyncIterator

from agent_framework import Agent
from agent_framework.openai import OpenAIChatClient
from agent_framework.orchestrations import SequentialBuilder

BASE = os.getenv("FOUNDRY_OPENAI_BASE", "").rstrip("/")
MODEL = os.getenv("FOUNDRY_POST_MODEL") or os.getenv("FOUNDRY_WEB_MODEL") or "gpt-5.4"
USD_IN = float(os.getenv("FOUNDRY_TEXT_USD_IN", "2.5")) / 1e6
USD_OUT = float(os.getenv("FOUNDRY_TEXT_USD_OUT", "10")) / 1e6

BRAND = (
    "Gennoor Tech is an enterprise AI and Microsoft training company in India. Voice: practical, credible, no hype, "
    "no emoji spam. NEVER write in the first person singular: no \"I\", \"I'm\", \"I've\", \"my\", \"me\" in any post or blog "
    "(also avoid \"we/our\" unless it is clearly the company speaking); write in a direct, impersonal voice about the topic, the reader's team, or \"you\". "
    "Visual colours are set per post by the art director (they vary; never default to navy or blue), no logos."
)

RESEARCHER = (
    f"{BRAND}\nYou are the research agent. From the topic, the editor's notes and any reference material, list the 4-8 most "
    "useful, concrete facts or points. Mark anything that came from a reference. Never invent statistics, quotes or sources. "
    "If the references are thin, say what is missing. Output a short bullet list only."
)
WRITER = (
    f"{BRAND}\nYou are the writing agent. Using ONLY the facts supplied, write a LinkedIn post. Follow the format, shape and "
    "length the editor's notes ask for; posts must not all look alike (a tight take, a numbered walkthrough, a list, a short "
    "story, a copyable prompt). If no format is given: 80-220 words, short lines. Always: a strong first line that does not "
    "echo any recent opening listed in the notes, one concrete takeaway, a closing line that invites a reply or save, and "
    "3-4 relevant hashtags at the end. "
    'Reply as JSON only: {"text": string}'
)
DESIGNER_IMAGE = (
    f"{BRAND}\nYou are the visual design agent. Write one image-generation prompt for a clean, text-free, realistic PHOTOGRAPH (not an illustration or 3D render) that "
    'fits the post. Reply as JSON only: {"imagePrompt": string}'
)
DESIGNER_MOTION = (
    f"{BRAND}\nYou are the motion-graphics design agent. Design a 6-8 second looping square scene (1080x1080, 15 fps) that "
    "dramatises the post's single key idea with kinetic text, a counter or bars, and an accent line. Keep text short (max 12 "
    "words on screen at once), stagger entrances, leave 0.6s of calm at the end. Colours are re-mapped afterwards to a palette chosen for this post, so just use white for text and #38bdf8 for every accent. Use ONLY this JSON spec:\n"
    '{"width":1080,"height":1080,"fps":15,"duration":7,"background":{"from":"#0b1b3a","to":"#1d4ed8","angle":135},'
    '"elements":[{"type":"text","text":"...","x":0.5,"y":0.3,"size":84,"color":"#ffffff","bold":true,"max_width":0.84,'
    '"in":{"at":0.3,"dur":0.7,"anim":"slide-up"},"out":{"at":6.4,"dur":0.4}},'
    '{"type":"shape","shape":"rect","x":0.08,"y":0.12,"w":0.2,"h":0.008,"color":"#38bdf8","in":{"at":0.1,"dur":0.6,"anim":"grow-x"}},'
    '{"type":"counter","from":0,"to":40,"suffix":"%","x":0.5,"y":0.55,"size":190,"color":"#38bdf8","bold":true,"in":{"at":1.2,"dur":1.6}},'
    '{"type":"bar","x":0.3,"y":0.95,"w":0.08,"h":0.2,"color":"#38bdf8","in":{"at":3,"dur":0.8}}]}\n'
    "Element types: text, shape(rect|circle|line), bar, counter. anim: fade, slide-up, slide-down, slide-left, slide-right, "
    "scale, grow-x, grow-y, typewriter. x,y,w,h are 0..1 fractions; bars grow upward from y. Do not overlap elements. The renderer adds the Gennoor logo and website footer itself in a reserved strip below your 0..1 area, so never draw a logo or the website yourself, and keep a 5% margin from every edge of your area. "
    'Reply as JSON only: {"scene": {...}}. Counters must not state a statistic the facts do not contain.'
)
REVIEWER = (
    f"{BRAND}\nYou are the review agent. Check the post and the visual brief against these rules: no invented statistics or "
    "quotes, follows the format and length in the editor's notes (otherwise 80-220 words), strong first line that does not resemble any recent opening listed in the notes, hashtags present, no hype, NO first-person singular words (I, I'm, I've, my, me - flag every one), visual text is short and matches the post. "
    'Reply as JSON only: {"verdict": "pass" | "revise", "notes": [string]}. Notes must be specific and actionable.'
)

BLOG_STYLE = """House style of the Gennoor Tech blog (match it exactly):
- Practitioner voice for enterprise AI and Microsoft/Azure teams. Plain, specific, no hype, no filler, no emoji. Never use first-person singular ("I", "my", "me"); keep an impersonal, direct voice.
- Body is HTML only (no <html>/<body>/<h1>; the title is rendered separately). Start with <p><em>By Gennoor Tech · {date}</em></p>,
  then 2-3 short <p> intro paragraphs that state what happened/why it matters. Then 6-9 sections, each an <h2>, with <p> paragraphs
  (3-5 sentences), optional <h3>, <ul>/<li> for lists, <strong> for key terms. No tables, no images, no code unless essential.
- 1,600-2,400 words. Concrete numbers and dates only when they appear in the research notes. Never invent statistics, quotes, names or URLs.
- External citations: <a href="URL" target="_blank" rel="noopener">text</a> and ONLY URLs that appear in the research notes/reference material.
- Internal links (use 2-4, relative, exactly as given): <a href="/services/training">training programs</a> and <a href="/resources/blog/SLUG">title</a>
  to related posts from the supplied list. Close with a section that gives the enterprise a practical next step and a soft pointer to training.
- Section ideas: What happened / How it works / Why it matters for enterprises / Risks and limits / What to do in the next 30 days / Bottom line."""

BLOG_RESEARCHER = (
    f"{BRAND}\nYou are the research agent for a long-form blog article. From the topic, editor's notes and reference material, produce: "
    "(1) the 8-14 most important verified facts with dates, (2) the angle for enterprise AI leaders, (3) a list of source URLs that APPEAR in the "
    "material (title + url + publisher). Never invent URLs, numbers or quotes. If something needed is missing, list it under 'Gaps'. Plain bullets only."
)
BLOG_WRITER = (
    f"{BRAND}\nYou are the blog writing agent. Write the full article body from the research notes.\n{BLOG_STYLE}\n"
    "Reply with the HTML body ONLY: no JSON, no markdown fences, no commentary."
)
# The emoji the website can draw as an icon tile for a post. Keep this the same as the list in
# src/lib/blog-icon.ts (EMOJI) of the website; the website also sends it with every request.
BLOG_ICONS = (
    "🛡️ 🧭 🧩 🧠 🏗️ 🤖 🔒 ⚡ ⚖️ 🎯 🏦 🎓 📦 🧾 🛠️ ⚙️ 💼 🔗 🗄️ 📊 🔍 🏆 💻 🔬 🕸️ ☁️ 🔄 🏥 🏭 🛒 🏛️ 📋 🤝 🔮 🧬 🗃️ ✍️ 💰 💬 📄 📑 🚀 📚 👥 💡 🚛 🔧 👁️ 🩺 🏢 📡 💊 🏨 🌾 🧪 "
    "📈 🔑 🗺️ ⏱️ 🔔 🎙️ 🎥 🖼️ 🧮 🔌 🌐 🪪 ✅ ⚠️ 🚨 🔥 🌱 🏁 🧑‍💻 🔐 🧵 🔀 ✉️ 📞 🛰️ 🧯 💳 🏷️ 📅 🧑‍🏫 🎛️ 🔭 🗂️ 🧰 💵 🍃 ✈️ 🏠 🖥️ 🧱 📝"
)

BLOG_PACKAGER = (
    f"{BRAND}\nYou are the blog packaging agent. Read the article and the taxonomy lists you were given, then output the metadata as JSON only:\n"
    '{"title": string (<=110 chars, specific, may use a colon), "slug": string (kebab-case, <=70 chars), "excerpt": string (40-60 words), '
    '"tldr": string (45-70 words), "keyTakeaways": [5-6 full-sentence strings], "faqs": [{"question": string, "answer": string (60-110 words)}] (5-6 items), '
    '"references": [{"title": string, "url": string, "source": string}] (3-8 items, ONLY urls present in the research notes/material, source like "Publisher · Month D, YYYY"), '
    '"category": string, "tags": [4-8 strings], "hashtags": [5-7 strings starting with #], "readTime": string like "12 min read", '
    '"coverColor": a dark hex colour that suits the topic, "icon": ONE emoji taken from the ICONS list below and no other}.\n'
    f"ICONS (the website draws each of these as a coloured icon tile; an emoji outside the list cannot be drawn): {BLOG_ICONS}\n"
    "Category: choose the best EXISTING category from the list; only propose a new short Title Case category if none fits (and set it anyway). "
    "Tags: prefer existing tags where they fit, add new ones only when needed."
)
BLOG_REVIEWER = (
    f"{BRAND}\nYou are the editorial review agent. Check the article and metadata: facts traceable to the research notes, no invented numbers/quotes/URLs, "
    "every external link comes from the notes, 1,600-2,400 words, house style (h2 sections, internal links present, practical next step), "
    "excerpt/tldr consistent with the body, FAQs answerable from the body. "
    "Internal links are CORRECT when they are /services/training or /resources/blog/<slug> using a slug from the supplied related-posts list; do not flag that format. "
    'Reply as JSON only: {"verdict": "pass" | "revise", "notes": [string]} with specific, actionable notes.'
)

STEPS = [
    ("researcher", "Research", RESEARCHER),
    ("writer", "Write", WRITER),
    ("designer", "Design", None),
    ("reviewer", "Review", REVIEWER),
]


def _client() -> OpenAIChatClient:
    return OpenAIChatClient(model=MODEL, base_url=f"{BASE}/openai/v1/", api_key=os.environ["FOUNDRY_API_KEY"])


def _json(text: str) -> dict[str, Any]:
    try:
        return json.loads(text[text.index("{"): text.rindex("}") + 1])
    except Exception:
        return {}


def _usd(resp: Any) -> tuple[float, int]:
    u = getattr(resp, "usage_details", None) or {}
    get = (lambda k: (u.get(k) if isinstance(u, dict) else getattr(u, k, 0)) or 0)
    tin, tout = get("input_token_count"), get("output_token_count")
    return tin * USD_IN + tout * USD_OUT, int(tin + tout)


async def run_blog(topic: str, brief: str, references: str, ctx: dict[str, Any]) -> AsyncIterator[dict[str, Any]]:
    """Blog pipeline: research -> write -> package (metadata, taxonomy) -> review. ctx: {date, categories, tags, posts:[{slug,title}]}."""
    client = _client()
    steps = [("researcher", "Research", BLOG_RESEARCHER), ("writer", "Write", BLOG_WRITER), ("packager", "Package", BLOG_PACKAGER)]
    agents = [Agent(client, instr.replace("{date}", ctx.get("dateLabel") or ctx.get("date", "")), name=key) for key, _, instr in steps]
    wf = SequentialBuilder(participants=agents, intermediate_output_from="all").build()
    labels = {k: l for k, l, _ in steps}
    notes = ""
    related = "\n".join(f"- {p['slug']}: {p['title']}" for p in ctx.get("posts", [])[:40])
    prompt = (
        f"Topic: {topic}" + (f"\nEditor's notes: {brief}" if brief else "")
        + f"\nPublication date: {ctx.get('date', '')}"
        + (f"\n\nReference material:\n{references}" if references else "")
        + f"\n\nExisting categories: {', '.join(ctx.get('categories', []))}"
        + f"\nExisting tags: {', '.join(ctx.get('tags', [])[:150])}"
        + f"\nRelated posts for internal links (slug: title):\n{related}"
    )
    buf: dict[str, str] = {}
    out: dict[str, Any] = {"mode": "blog"}
    total_usd, total_tokens = 0.0, 0
    async for ev in wf.run(prompt, stream=True):
        kind, ex = getattr(ev, "type", None), getattr(ev, "executor_id", None)
        if ex not in labels:
            continue
        if kind == "executor_invoked":
            yield {"type": "step", "agent": ex, "label": labels[ex], "status": "running"}
        elif kind == "intermediate":
            chunk = getattr(getattr(ev, "data", None), "text", "") or ""
            if chunk:
                yield {"type": "delta", "agent": ex, "text": chunk}
        elif kind == "executor_completed":
            data = getattr(ev, "data", None) or []
            resp = getattr(data[0], "agent_response", None) if data else None
            text = (getattr(resp, "text", "") or buf.get(ex, "")).strip()
            usd, toks = _usd(resp)
            total_usd += usd
            total_tokens += toks
            if ex == "researcher":
                notes = text
            elif ex == "writer":
                out["body"] = text.removeprefix("```html").removesuffix("```").strip()
            elif ex == "packager":
                out["meta"] = _json(text)
            yield {"type": "step", "agent": ex, "label": labels[ex], "status": "done", "output": text[:6000], "usd": round(usd, 5), "tokens": toks}
    # The reviewer runs on its own with the article and metadata passed in explicitly, so it always sees what it must check.
    yield {"type": "step", "agent": "reviewer", "label": "Review", "status": "running"}
    reviewer = Agent(client, BLOG_REVIEWER, name="reviewer")
    resp = await reviewer.run("\n\n".join([
        "RESEARCH NOTES:\n" + notes,
        "METADATA:\n" + json.dumps(out.get("meta", {}), ensure_ascii=False),
        "ARTICLE BODY (HTML):\n" + out.get("body", ""),
    ]))
    rtext = (getattr(resp, "text", "") or "").strip()
    usd, toks = _usd(resp)
    total_usd += usd
    total_tokens += toks
    out["review"] = _json(rtext) or {"verdict": "revise", "notes": [rtext[:300]]}
    yield {"type": "step", "agent": "reviewer", "label": "Review", "status": "done", "output": rtext[:4000], "usd": round(usd, 5), "tokens": toks}
    out["usd"] = round(total_usd, 5)
    out["tokens"] = total_tokens
    yield {"type": "result", **out}


async def run_pipeline(topic: str, brief: str, references: str, mode: str) -> AsyncIterator[dict[str, Any]]:
    """mode: 'post' (text + image prompt) or 'motion' (text + motion-graphic scene)."""
    client = _client()
    designer = DESIGNER_MOTION if mode == "motion" else DESIGNER_IMAGE
    agents = [Agent(client, designer if key == "designer" else instr, name=key) for key, _, instr in STEPS]
    wf = SequentialBuilder(participants=agents, intermediate_output_from="all").build()

    labels = {k: l for k, l, _ in STEPS}
    prompt = f"Topic: {topic}" + (f"\nEditor's notes: {brief}" if brief else "") + (f"\n\nReference material:\n{references}" if references else "")
    buf: dict[str, str] = {}
    out: dict[str, Any] = {"mode": mode}
    total_usd, total_tokens = 0.0, 0

    async for ev in wf.run(prompt, stream=True):
        kind, ex = getattr(ev, "type", None), getattr(ev, "executor_id", None)
        if ex not in labels:
            continue
        if kind == "executor_invoked":
            yield {"type": "step", "agent": ex, "label": labels[ex], "status": "running"}
        elif kind == "intermediate":
            chunk = getattr(getattr(ev, "data", None), "text", "") or ""
            if chunk and chunk != buf.get(ex):  # the final update repeats the full text; ignore it
                if not buf.get(ex, "").endswith(chunk) or len(chunk) < 4:
                    buf[ex] = buf.get(ex, "") + chunk
                yield {"type": "delta", "agent": ex, "text": chunk}
        elif kind == "executor_completed":
            data = getattr(ev, "data", None) or []
            resp = getattr(data[0], "agent_response", None) if data else None
            text = (getattr(resp, "text", "") or buf.get(ex, "")).strip()
            usd, toks = _usd(resp)
            total_usd += usd
            total_tokens += toks
            if ex == "writer":
                out["text"] = _json(text).get("text") or text
            elif ex == "designer":
                j = _json(text)
                out["scene" if mode == "motion" else "imagePrompt"] = j.get("scene" if mode == "motion" else "imagePrompt")
            elif ex == "reviewer":
                out["review"] = _json(text) or {"verdict": "revise", "notes": [text[:300]]}
            yield {"type": "step", "agent": ex, "label": labels[ex], "status": "done", "output": text, "usd": round(usd, 5), "tokens": toks}

    out["usd"] = round(total_usd, 5)
    out["tokens"] = total_tokens
    yield {"type": "result", **out}
