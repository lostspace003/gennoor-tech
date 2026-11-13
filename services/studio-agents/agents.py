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
    "Visual colours are set per post by the art director (they vary; never default to navy or blue), no logos. "
    "Always true: never call a course, a workshop or a lesson \"free\", never state a price or a discount, never name a customer, "
    "never promise a result (a pass, a saving, a rank), and never describe an event of ours as having happened unless the notes say so."
)

# How to write a LinkedIn post: the craft, apart from the format and the length, which the editor's notes decide.
# Written 13 November 2026 at the owner's request: every post unique, a clear outline, the right tags.
POST_CRAFT = """HOW TO WRITE THE POST
1. One post, one idea. Before writing, decide the single sentence a busy reader should still remember tomorrow. If the facts hold three ideas, choose the one a practitioner can act on this week and leave the others out.
2. Earn the first line. A reader sees about twelve words before "see more". Open with the reader's problem, a tension, a true and surprising fact from the notes, or a small concrete scene ("The demo worked. Production did not."). Never open with an announcement ("X launched", "X announced"), a greeting, "Excited to", "Did you know", "In today's world" or a definition.
3. Be specific. Replace each general claim with the concrete thing: the tool, the step, the number from the facts, the way it fails. If a sentence could sit in any company's post, sharpen it or cut it.
4. Write for the eye. One thought to a line, short paragraphs, white space. Use bullets only for items that are truly parallel: each under 14 words, each starting with a different word. Vary the rhythm: a longer line, then a short one.
5. Give the reader something to use: a check to run, a question to ask the team, a rule of thumb, a mistake to avoid. Say it plainly enough to repeat in a meeting.
6. End on purpose: the takeaway in one line, or one specific question a practitioner can answer from experience. Never "Thoughts?", "Agree?" or "What do you think?".
7. Plain words. No hype ("game-changer", "revolutionary", "unlock", "supercharge", "seamless", "leverage", "delve", "landscape"). No three-part slogans, and "it is not X, it is Y" at most once. Active voice, present tense where it fits.
8. Different every time. The notes list recent openings and formats: do not reuse their first word, their sentence shape or their structure. Change the angle from post to post: a mistake, a checklist, a before and after, a decision rule, a short story about a team (never a real name), a myth and the fact.
9. Hashtags: 3 or 4, on the last line, CamelCase, specific to the subject (#AIAgents, #AzureAI), at most one broad one. None inside a sentence.
10. True only. Every fact, number and name comes from the facts supplied."""

# How to write a blog article: the craft, on top of the house style below (the HTML, the length, the links).
BLOG_CRAFT = """HOW TO WRITE THE ARTICLE
1. Decide the argument first: one sentence that says what the reader should do or believe differently. Every section serves it. A piece of news or a product is evidence inside the argument, never the subject.
2. Outline before prose. The headings alone must tell the story in order: the problem as the reader meets it, what really changed, how it works (only as deep as a decision needs), what breaks or costs, how to decide, what to do in the next 30 days, the bottom line. Do not reuse the set of headings of the related posts in the notes.
3. A heading (h2) is a claim or a question a practitioner would search, four to nine words, specific ("Where tool calls fail in production", not "Challenges"). Name the main subject in at least two headings.
4. The opening is two or three short paragraphs: the situation the reader is in; the tension or the cost; what this article lets them do. Never start with the news itself, a definition or "In today's world".
5. Each section earns its place: a claim, the evidence from the notes (with its link where it supports a fact), what it means for an enterprise team, and a short list where the items are truly parallel. Paragraphs of two to four sentences, one idea each.
6. Make it usable: at least one checklist, decision rule or set of questions the reader can take to their team. Name the roles involved (platform, security, finance, the business owner) where it matters.
7. Be honest about limits: what is not yet known, what depends on the reader's context, what the sources do not say. Never fill a gap with a guess.
8. Close with action: a "next 30 days" section of concrete steps in order, then a short bottom line. One soft pointer to training, never a sales paragraph.
9. Language: plain, exact, active. No hype words, no filler links between sentences ("Moreover", "Furthermore", "It is worth noting"), no run of rhetorical questions, no two paragraphs in a row that begin the same way.
10. For search: use the words a practitioner would type, naturally, in the first paragraph, in the headings and in the questions. Never stuff them."""

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
    "3-4 relevant hashtags at the end.\n"
    + POST_CRAFT + "\n"
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
    "Also check the craft and ask for a revision when it fails: the post carries ONE idea, not a list of everything in the facts; the first line is a problem, a tension, a fact or a scene, never an announcement or a greeting; "
    "no sentence is so general that it could sit in any company's post; the reader is given something to use; the ending is a takeaway or a specific question, never \"Thoughts?\"; "
    "its opening and structure differ from the recent ones in the notes; nothing is called free, no price is stated, no customer is named, no result is promised. "
    'Reply as JSON only: {"verdict": "pass" | "revise", "notes": [string]}. Notes must be specific and actionable.'
)

BLOG_STYLE = """House style of the Gennoor Tech blog (match it exactly):
- Practitioner voice for enterprise AI and Microsoft/Azure teams. Plain, specific, no hype, no filler, no emoji. Never use first-person singular ("I", "my", "me"); keep an impersonal, direct voice.
- Body is HTML only (no <html>/<body>/<h1>; the title is rendered separately). Start with <p><em>By Gennoor Tech · {date}</em></p>,
  then 2-3 short <p> intro paragraphs (what they say is set out under HOW TO WRITE THE ARTICLE). Then 6-9 sections, each an <h2>, with <p> paragraphs
  (3-5 sentences), optional <h3>, <ul>/<li> for lists, <strong> for key terms. No tables, no images, no code unless essential.
- 1,600-2,400 words. Concrete numbers and dates only when they appear in the research notes. Never invent statistics, quotes, names or URLs.
- External citations: <a href="URL" target="_blank" rel="noopener">text</a> and ONLY URLs that appear in the research notes/reference material.
- Internal links (use 2-4, relative, exactly as given): <a href="/services/training">training programs</a> and <a href="/resources/blog/SLUG">title</a>
  to related posts from the supplied list. Close with a section that gives the enterprise a practical next step and a soft pointer to training.
- The order of the sections and the wording of the headings follow HOW TO WRITE THE ARTICLE below."""

BLOG_RESEARCHER = (
    f"{BRAND}\nYou are the research agent for a long-form blog article. From the topic, editor's notes and reference material, produce: "
    "(1) the 8-14 most important verified facts with dates, (2) the angle for enterprise AI leaders, (3) a list of source URLs that APPEAR in the "
    "material (title + url + publisher). Never invent URLs, numbers or quotes. If something needed is missing, list it under 'Gaps'. Plain bullets only."
)
BLOG_WRITER = (
    f"{BRAND}\nYou are the blog writing agent. Write the full article body from the research notes.\n{BLOG_STYLE}\n{BLOG_CRAFT}\n"
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
    '{"title": string (aim for 50-70 characters and never over 90; the main subject in the first five words; specific, may use a colon; it says what the reader gets, not that something was announced), '
    '"slug": string (kebab-case, <=60 chars, the main search words only, no dates, no filler words), '
    '"excerpt": string (one or two sentences, 140-160 characters in all, that say what the reader will learn; it is shown under the title in a search result), '
    '"tldr": string (45-70 words), "keyTakeaways": [5-6 full-sentence strings], "faqs": [{"question": string, "answer": string (60-110 words)}] (5-6 items), '
    '"references": [{"title": string, "url": string, "source": string}] (3-8 items, ONLY urls present in the research notes/material, source like "Publisher · Month D, YYYY"), '
    '"category": string, "tags": [4-6 strings, the subjects a reader would search for], "hashtags": [4-5 strings starting with #, CamelCase, specific to the subject], "readTime": string like "12 min read", '
    '"coverColor": a dark hex colour that suits the topic, "icon": ONE emoji taken from the ICONS list below and no other}.\n'
    f"ICONS (the website draws each of these as a coloured icon tile; an emoji outside the list cannot be drawn): {BLOG_ICONS}\n"
    "Category: choose the best EXISTING category from the list; only propose a new short Title Case category if none fits (and set it anyway). "
    "Tags: prefer existing tags where they fit, add new ones only when needed. "
    "FAQs: write each question the way a practitioner would type it into a search box, and answer it from the article in plain sentences. "
    "Key takeaways: each one is a full sentence a reader could act on, and no two say the same thing."
)
BLOG_REVIEWER = (
    f"{BRAND}\nYou are the editorial review agent. Check the article and metadata: facts traceable to the research notes, no invented numbers/quotes/URLs, "
    "every external link comes from the notes, 1,600-2,400 words, house style (h2 sections, internal links present, practical next step), "
    "excerpt/tldr consistent with the body, FAQs answerable from the body. "
    "Also check the craft and ask for a revision when it fails: the article argues ONE thing and every section serves it; the headings alone tell the story and each is specific (flag \"Introduction\", \"Overview\", \"Challenges\", \"Conclusion\"); "
    "the opening starts with the reader's situation, not with the news or a definition; there is at least one checklist, decision rule or set of questions; limits and unknowns are stated; no hype words or filler transitions; "
    "the title is at most 90 characters with the subject in its first five words; the excerpt is at most 160 characters; nothing is called free, no price is stated, no customer is named. "
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
