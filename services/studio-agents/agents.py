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
    "Gennoor Tech is an AI training company in India. Voice: plain, practical, credible, no hype, no emoji spam. "
    "NEVER write in the first person singular: no \"I\", \"I'm\", \"I've\", \"my\", \"me\" in any post or blog "
    "(also avoid \"we/our\" unless it is clearly the company speaking); write in a direct, impersonal voice about the topic, the reader's team, or \"you\". "
    "Visual colours are set per post by the art director (they vary; never default to navy or blue), no logos. "
    "Always true: never call a course, a workshop or a lesson of ours \"free\", never state a price or a discount of ours, never name a customer of ours, "
    "never promise a result (a pass, a saving, a rank), and never describe an event of ours as having happened unless the notes say so. "
    "A company named in a public source (a case study, a news report) may be named."
)

# ---- The writing rules ---------------------------------------------------------------------------------------------
# THE place for these is the website: src/lib/writing-rules.ts. It sends them with every request (the `rules` and
# `review_rules` fields), so changing how we write needs no redeploy of this service. The copies below are used only
# for a request that carries none. Keep the two in step.
#
# The owner's words, 13 November 2026: "very much repetitive and very boring style of writing. A user, when he reads,
# he never understands what is being written. I myself am not able to understand." So the reader is a manager who is
# NOT technical, and every writer and every reviewer is told so.
READER = """WHO READS THIS
A busy manager or business owner who is curious about AI and is NOT technical. Technical people read it too, and they respect plain writing. If that manager cannot follow a sentence, the sentence is wrong, however correct it is."""

PLAIN = """PLAIN LANGUAGE (every sentence must pass)
1. Say the point first. The first two lines tell the reader what happened or what this is, in everyday words: who did what, and why a business should care.
2. Explain every technical word the first time it appears, in a few plain words: "an AI agent (a program that carries out a task step by step by itself)". One explanation to a sentence: if two words need explaining, use two sentences. Never explain a word in the middle of a list of things: finish the list, then explain in the next sentence. Spell an abbreviation out once. If the word is not needed, leave it out.
3. Short sentences, one idea each, under about 20 words. Everyday words: "use" not "leverage", "start" not "operationalise", "rules" not "governance", "cost" not "FinOps", "set up" not "provision", "check" not "validate".
4. No insider shorthand without its meaning: control plane, runtime, orchestration, harness, guardrails, observability, inference, tokens, benchmark, MCP, RAG, GA, BYOK, agentic.
5. Say it straight. Never the clever frame: "X is not a Y story, it is a Z story", "X turned Y into a Z story", "X turns Y into a Z problem", "X makes Y a Z problem", "the real story is", "the quiet news is", "X is no longer about Y, it is about Z", "X is asking Y to put a price on Z". Write who did what, what the thing is and what to do about it.
6. Give one everyday example or comparison for anything abstract ("like giving a new assistant the key to one cupboard, not to the whole office").
7. A number comes with its meaning: what was measured, and what it means for a team. Never a number alone, and never a row of figures: keep the one or two the reader can use and leave the rest out.
8. No hype and no filler: game-changer, revolutionary, unlock, supercharge, seamless, landscape, delve, robust, cutting-edge, "in today's world", "it is worth noting", "moreover".
9. The test before you finish: could the reader repeat this to a colleague in their own words? If not, write it again."""

TRUTH = """ALWAYS TRUE
- Use only the facts you were given. Never invent a number, a quote, a name, a date or a link. If something is not known, say so or leave it out.
- Never the first person singular ("I", "my", "me"). Speak to the reader as "you".
- Nothing of ours is called "free". No price of ours, no discount. Never name a customer of ours. Never promise a result (a pass, a saving, a rank).
- A company named in a public source (a case study, a news report) may be named. Mention every vendor fairly."""

# How to write a LinkedIn post: the craft, apart from the format and the length, which the editor's notes decide.
POST_CRAFT = """HOW TO WRITE THE POST
1. One post, one idea: the one sentence the reader should still remember tomorrow. Leave the other ideas out.
2. The first line. For news, say what happened, plainly: "OpenAI released a new model for security teams yesterday. Here is what it means if you run one." For anything else, open with the reader's problem, a true and surprising fact, or a small scene. Never a greeting, "Excited to", "Did you know", a definition, or one of the clever frames listed under PLAIN LANGUAGE.
3. Then, in this order unless the FORMAT in the notes says otherwise: what it is, in one or two plain sentences; why it matters to a business; what to do or try.
4. Be specific: the tool, the step, the number from the facts with its meaning. If a sentence could sit in any company's post, sharpen it or cut it.
5. Write for the eye: one thought to a line, short paragraphs, white space. Bullets only for items that are truly parallel, each under 14 words.
6. End with the takeaway in one line, or one specific question the reader can answer from their own work. Never "Thoughts?" or "Agree?".
7. Different every time. The notes list recent openings: do not reuse their first words, their sentence shape or their structure.
8. Hashtags: 3 or 4 on the last line, CamelCase, specific to the subject (#AIAgents, #AzureAI). None inside a sentence.
9. Do not paste a source link in the post: the link goes in the first comment, which is posted by itself."""

# How to write a blog article: the craft, on top of the house style below (the HTML, the links).
BLOG_CRAFT = """HOW TO WRITE THE ARTICLE
1. Decide the one thing the reader should understand or do. Every section serves it.
2. Open with what happened or what the problem is, in two or three short paragraphs a manager who is not technical can follow. If there is news, say it in the first paragraph: who, what, when.
3. Then explain, in the order that suits the FORMAT in the notes: what it is (every term explained), why it matters to a business, what changes, what to be careful about, what to do next. Do not give every article the same headings: "What to do in the next 30 days" and "Bottom line" only where they truly fit.
4. A heading (h2) is a plain question or statement a reader would say aloud, four to nine words: "What did OpenAI release?", "What it costs to switch". Never "Introduction", "Overview", "Challenges", "Conclusion".
5. Paragraphs of two to four short sentences. A list where the items are truly parallel. One worked example, clearly marked as an example, where it helps.
6. Use only the facts in the research notes. Put the source link on the words that state the fact ("Reuters reported that ..." with the link on "Reuters reported"), never in a sentence of its own at the end of a paragraph. Say what is not known as a fact about the world ("Microsoft has not said when the service was fully restored"), never as a fact about what you were given. Never fill a gap with a guess.
7. Make it usable: one checklist or set of questions the reader can take to their team.
8. Never write about the article itself or about what you were given. No "this article", "this piece", "the sources", "the notes", "the material provided", "the pages reviewed", "the draft", "the reviewer", "revised", "we removed", "could not be verified from". The reader sees only the finished explanation. A claim that cannot be supported is simply left out.
9. Close with the practical steps, then one or two sentences that sum up. One soft pointer to training, never a sales paragraph.
10. Length: 1,100 to 1,600 words. Shorter and clear beats longer and padded.
11. For search: the words a person would type, used naturally in the first paragraph and the headings."""

# What a reviewer checks first.
READER_CHECK = """WHAT YOU ARE CHECKING: the words a reader will see, and nothing else. They may reach you wrapped in JSON, as the value of "text". That wrapping is the writer's own and it is correct: never comment on it, never ask for other keys, and read "\\n" as a line break. The JSON shape asked for at the end of these instructions is for YOUR reply only.

READ IT AS THE READER: a manager who is not technical. Answer "revise" and quote the exact words if any of these is true:
- a technical word or an abbreviation is not explained where it first appears;
- a sentence has to be read twice, or runs past about 25 words;
- the first two lines do not say what happened or what this is about;
- the first line does not say who did what, or what the reader gets;
- a clever frame is used ("is not an X story", "turned X into a Y story", "turns X into a Y problem", "the real story", "no longer about", "put a price on");
- a number is given without what it means, or there are more than two or three figures;
- the text talks about itself: a draft, a revision, a reviewer, the sources it was given, what was removed.
Answer "pass" when the reader would understand every sentence and could repeat the point to a colleague. Do not ask for a revision for anything smaller than these and the rules below."""

DEFAULT_POST_RULES = "\n\n".join([READER, PLAIN, POST_CRAFT, TRUTH])
DEFAULT_ARTICLE_RULES = "\n\n".join([READER, PLAIN, BLOG_CRAFT, TRUTH])

RESEARCHER = (
    f"{BRAND}\nYou are the research agent. From the topic, the editor's notes and any reference material, list the 4-8 most "
    "useful, concrete facts or points, each in one plain sentence. Mark anything that came from a reference. Add a short list of the technical "
    "words a reader who is not technical would need explained, each with a plain explanation. Never invent statistics, quotes or sources. "
    "If the references are thin, say what is missing. Output a short bullet list only."
)


def writer_instructions(rules: str = "") -> str:
    """The writer of a post, with the rules the website sent (or the copy above)."""
    return (
        f"{BRAND}\nYou are the writing agent. Using ONLY the facts supplied, write a LinkedIn post. Follow the format, shape and "
        "length the editor's notes ask for; posts must not all look alike. If no format is given: 80-200 words, short lines.\n\n"
        + (rules.strip() or DEFAULT_POST_RULES)
        + '\n\nReply as JSON only: {"text": string}'
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
def reviewer_instructions(rules: str = "", review_rules: str = "", visual: bool = True) -> str:
    """The reviewer of a post. It reads as the reader first, then checks the rules the writer was given."""
    return (
        f"{BRAND}\nYou are the review agent.\n\n"
        + (review_rules.strip() or READER_CHECK)
        + "\n\nThen check the post against the rules the writer was given, below. In particular: it carries ONE idea; the first line "
        "is what the rules ask for; every number and name is in the facts supplied; it follows the format and length in the editor's notes "
        "(otherwise 80-200 words); its opening does not resemble any recent opening listed in the notes; hashtags are present; "
        "there is NO first-person singular word (I, I'm, I've, my, me: flag every one); nothing of ours is called free, no price of ours is stated, "
        "no customer of ours is named, no result is promised."
        + (" The visual brief is short and matches the post." if visual else "")
        + "\n\nRULES THE WRITER WAS GIVEN:\n"
        + (rules.strip() or DEFAULT_POST_RULES)
        + '\n\nReply as JSON only: {"verdict": "pass" | "revise", "notes": [string]}. Each note names the exact words to change and what is wrong with them.'
    )


BLOG_STYLE = """House style of the Gennoor Tech blog (match it exactly):
- Written for a manager who is not technical (see WHO READS THIS below). Plain, specific, no hype, no filler, no emoji. Never use first-person singular ("I", "my", "me"); keep an impersonal, direct voice.
- Body is HTML only (no <html>/<body>/<h1>; the title is rendered separately). Start with <p><em>By Gennoor Tech · {date}</em></p>,
  then 2-3 short <p> intro paragraphs (what they say is set out under HOW TO WRITE THE ARTICLE). Then 5-8 sections, each an <h2>, with <p> paragraphs
  (2-4 short sentences), optional <h3>, <ul>/<li> for lists, <strong> for the few words that matter most. No tables, no images, no code unless essential.
- 1,100-1,600 words. Concrete numbers and dates only when they appear in the research notes. Never invent statistics, quotes, names or URLs.
- External citations: <a href="URL" target="_blank" rel="noopener">text</a> and ONLY URLs that appear in the research notes/reference material.
- Internal links (use 2-4, relative, exactly as given): <a href="/services/training">training programs</a> and <a href="/resources/blog/SLUG">title</a>
  to related posts from the supplied list. Close with a section that gives the reader a practical next step and a soft pointer to training.
- The order of the sections and the wording of the headings follow HOW TO WRITE THE ARTICLE below."""

BLOG_RESEARCHER = (
    f"{BRAND}\nYou are the research agent for a long-form blog article. From the topic, editor's notes and reference material, produce: "
    "(1) the 8-14 most important verified facts with dates, each in one plain sentence, (2) what it means for a business, in two or three sentences, "
    "(3) the technical words a reader who is not technical would need explained, each with a plain explanation, "
    "(4) a list of source URLs that APPEAR in the material (title + url + publisher). Never invent URLs, numbers or quotes. "
    "If something needed is missing, list it under 'Gaps'. Plain bullets only."
)


def blog_writer_instructions(rules: str = "") -> str:
    """The writer of an article, with the rules the website sent (or the copy above)."""
    return (
        f"{BRAND}\nYou are the blog writing agent. Write the full article body from the research notes.\n{BLOG_STYLE}\n\n"
        + (rules.strip() or DEFAULT_ARTICLE_RULES)
        + "\n\nReply with the HTML body ONLY: no JSON, no markdown fences, no commentary."
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
def blog_reviewer_instructions(rules: str = "", review_rules: str = "") -> str:
    """The reviewer of an article. It reads as the reader first, then checks the facts and the rules."""
    return (
        f"{BRAND}\nYou are the editorial review agent.\n\n"
        + (review_rules.strip() or READER_CHECK)
        + "\n\nThen check the article and its metadata: facts traceable to the research notes, no invented numbers, quotes or URLs, "
        "every external link comes from the notes, 1,100-1,600 words (never ask for more words), house style (h2 sections, internal links present, a practical next step), "
        "excerpt and tldr consistent with the body, FAQs answerable from the body; the article explains ONE thing and every section serves it; "
        "each heading is a plain question or statement (flag \"Introduction\", \"Overview\", \"Challenges\", \"Conclusion\"); if there is news, the first paragraph says it; "
        "there is at least one checklist or set of questions; what is not known is said plainly; "
        "the title is at most 90 characters with the subject in its first five words; the excerpt is at most 160 characters; nothing of ours is called free, no price of ours is stated, no customer of ours is named. "
        "Internal links are CORRECT when they are /services/training or /resources/blog/<slug> using a slug from the supplied related-posts list; do not flag that format. "
        "When a claim is not in the research notes, the note to the writer is \"leave this claim out\": the article must never explain that something was removed or could not be checked."
        + "\n\nRULES THE WRITER WAS GIVEN:\n"
        + (rules.strip() or DEFAULT_ARTICLE_RULES)
        + '\n\nReply as JSON only: {"verdict": "pass" | "revise", "notes": [string]} with specific notes that name the exact words to change.'
    )


# The steps of a post with a picture brief (the agent team in Social Studio). A text-only post (the autopilot) is
# the writer and the reviewer alone: the facts already come with the request, and it has no picture to design.
STEPS = [("researcher", "Research"), ("writer", "Write"), ("designer", "Design"), ("reviewer", "Review")]
TEXT_STEPS = [("writer", "Write"), ("reviewer", "Review")]


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


async def run_blog(topic: str, brief: str, references: str, ctx: dict[str, Any], rules: str = "", review_rules: str = "") -> AsyncIterator[dict[str, Any]]:
    """Blog pipeline: research -> write -> package (metadata, taxonomy) -> review. ctx: {date, categories, tags, posts:[{slug,title}]}."""
    client = _client()
    steps = [("researcher", "Research", BLOG_RESEARCHER), ("writer", "Write", blog_writer_instructions(rules)), ("packager", "Package", BLOG_PACKAGER)]
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
    reviewer = Agent(client, blog_reviewer_instructions(rules, review_rules), name="reviewer")
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


async def run_pipeline(topic: str, brief: str, references: str, mode: str, rules: str = "", review_rules: str = "") -> AsyncIterator[dict[str, Any]]:
    """mode: 'post' (text + image prompt), 'motion' (text + motion-graphic scene) or 'text' (the post alone: writer, then reviewer)."""
    client = _client()
    text_only = mode == "text"
    steps = TEXT_STEPS if text_only else STEPS
    instructions = {
        "researcher": RESEARCHER,
        "writer": writer_instructions(rules),
        "designer": DESIGNER_MOTION if mode == "motion" else DESIGNER_IMAGE,
        "reviewer": reviewer_instructions(rules, review_rules, visual=not text_only),
    }
    agents = [Agent(client, instructions[key], name=key) for key, _ in steps]
    wf = SequentialBuilder(participants=agents, intermediate_output_from="all").build()

    labels = dict(steps)
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
