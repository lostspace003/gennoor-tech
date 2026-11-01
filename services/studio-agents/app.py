"""
Gennoor Social Studio agent service.

POST /run     NDJSON stream of the MAF pipeline (research -> write -> design -> review), then a final result.
              When mode is 'motion' the designed scene is rendered to an animated GIF and returned as base64.
POST /blog    NDJSON stream of the blog pipeline (research -> write -> package -> review); returns body + metadata.
GET  /li/tools   The LinkedIn MCP server's tools (names, hints, argument schemas).
POST /li/call    One serialised, cached call to a LinkedIn MCP tool.
POST /brand   Adds the logo + website footer to a generated image.
POST /render  Renders a (hand-edited) scene spec to an animated GIF without calling any model.
GET  /health

Auth: every call except /health needs the STUDIO_API_KEY in the X-Api-Key header. The service only ever returns
content; publishing to LinkedIn stays in the web app behind admin approval.
"""
from __future__ import annotations

import asyncio
import base64
import hmac
import json
import logging
import os
from typing import Any, Literal

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

import li
import render as renderer
from palettes import recolor
from agents import run_blog, run_pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("studio")
API_KEY = os.getenv("STUDIO_API_KEY", "")
app = FastAPI(title="Gennoor Studio Agents")
# Rendering is CPU-bound; one at a time keeps a small container responsive.
_render_lock = asyncio.Semaphore(1)


def auth(x_api_key: str = Header(default="")):
    if not API_KEY:
        raise HTTPException(503, "STUDIO_API_KEY is not configured")
    if not hmac.compare_digest(x_api_key, API_KEY):
        raise HTTPException(401, "Bad key")


class RunBody(BaseModel):
    topic: str = Field(min_length=3, max_length=500)
    brief: str = Field(default="", max_length=2000)
    references: str = Field(default="", max_length=40_000)
    mode: Literal["post", "motion"] = "post"


class BlogBody(BaseModel):
    topic: str = Field(min_length=3, max_length=500)
    brief: str = Field(default="", max_length=2000)
    references: str = Field(default="", max_length=40_000)
    context: dict[str, Any] = Field(default_factory=dict)


class LiBody(BaseModel):
    tool: str = Field(min_length=2, max_length=80)
    args: dict[str, Any] = Field(default_factory=dict)
    fresh: bool = False


class BrandBody(BaseModel):
    image: str = Field(min_length=100, max_length=30_000_000)


class RenderBody(BaseModel):
    scene: dict[str, Any]


async def _render(scene: dict[str, Any]) -> dict[str, Any]:
    async with _render_lock:
        r = await asyncio.to_thread(renderer.render, scene)
    return {
        "gif": base64.b64encode(r["gif"]).decode(),
        "frames": r["frames"], "seconds": r["seconds"], "width": r["width"], "height": r["height"],
    }


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/brand", dependencies=[Depends(auth)])
async def brand(b: BrandBody):
    """Puts the real Gennoor logo and website under a generated image (the image model cannot be trusted to draw them)."""
    try:
        out = await asyncio.to_thread(renderer.brand_image, base64.b64decode(b.image.split(",")[-1]))
        return {"image": base64.b64encode(out).decode()}
    except Exception as e:
        raise HTTPException(400, f"Could not brand the image: {str(e)[:160]}")


@app.post("/render", dependencies=[Depends(auth)])
async def render_scene(b: RenderBody):
    try:
        return await _render(b.scene)
    except (ValueError, KeyError, TypeError) as e:
        raise HTTPException(400, f"Invalid scene: {e}")


@app.get("/li/tools", dependencies=[Depends(auth)])
async def li_tools():
    if not li.configured():
        raise HTTPException(503, "LINKEDIN_MCP_URL is not configured")
    try:
        return {"tools": await li.list_tools()}
    except Exception as e:
        log.exception("li tools failed")
        raise HTTPException(502, f"LinkedIn MCP server unreachable: {li.leaf(e)}")


@app.post("/li/call", dependencies=[Depends(auth)])
async def li_call(b: LiBody):
    if not li.configured():
        raise HTTPException(503, "LINKEDIN_MCP_URL is not configured")
    try:
        tools = {t["name"]: t for t in await li.list_tools()}
        if b.tool not in tools:
            raise HTTPException(404, f"Unknown tool {b.tool}")
        read_only = bool(tools[b.tool]["annotations"].get("readOnlyHint"))
        return await li.call(b.tool, b.args, read_only, b.fresh)
    except HTTPException:
        raise
    except asyncio.TimeoutError:
        raise HTTPException(504, "LinkedIn took too long to answer")
    except Exception as e:
        log.exception("li call failed")
        raise HTTPException(502, f"LinkedIn MCP call failed: {li.leaf(e)}")


@app.post("/blog", dependencies=[Depends(auth)])
async def blog(b: BlogBody):
    async def stream():
        try:
            async for ev in run_blog(b.topic, b.brief, b.references, b.context):
                yield json.dumps(ev) + "\n"
        except Exception as e:
            log.exception("blog pipeline failed")
            yield json.dumps({"type": "error", "message": str(e)[:400]}) + "\n"

    return StreamingResponse(stream(), media_type="application/x-ndjson", headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"})


@app.post("/run", dependencies=[Depends(auth)])
async def run(b: RunBody):
    async def stream():
        try:
            async for ev in run_pipeline(b.topic, b.brief, b.references, b.mode):
                if ev["type"] == "result" and b.mode == "motion" and ev.get("scene"):
                    yield json.dumps({"type": "step", "agent": "renderer", "label": "Render", "status": "running"}) + "\n"
                    try:
                        ev["scene"] = recolor(ev["scene"])  # a palette of its own for every post
                        # Rendering is CPU-bound and silent; ping every few seconds so no proxy sees an idle connection and drops it.
                        job = asyncio.create_task(_render(ev["scene"]))
                        while not job.done():
                            await asyncio.wait({job}, timeout=5)
                            if not job.done():
                                yield json.dumps({"type": "ping"}) + "\n"
                        ev["render"] = job.result()
                        yield json.dumps({"type": "step", "agent": "renderer", "label": "Render", "status": "done",
                                          "output": f"{ev['render']['frames']} frames, {ev['render']['seconds']}s"}) + "\n"
                    except Exception as e:  # keep the text result even if the scene cannot be drawn
                        log.exception("render failed")
                        yield json.dumps({"type": "step", "agent": "renderer", "label": "Render", "status": "error", "output": str(e)}) + "\n"
                yield json.dumps(ev) + "\n"
        except Exception as e:
            log.exception("pipeline failed")
            yield json.dumps({"type": "error", "message": str(e)[:400]}) + "\n"

    return StreamingResponse(stream(), media_type="application/x-ndjson", headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"})
