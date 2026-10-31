"""
Client for the stickerdaniel/linkedin-mcp-server running next to this service (streamable HTTP, internal only).

Why it is wrapped instead of called straight from the web app:
  - the MCP server drives ONE shared browser session, so calls must be serialised and spaced out;
  - read results are cached, so refreshing a page does not re-scrape LinkedIn;
  - the MCP server has no authentication of its own, so it is never exposed; only this service can reach it.
"""
from __future__ import annotations

import asyncio
import json
import os
import time
from typing import Any

from mcp import ClientSession
try:  # mcp 2.x (required by agent-framework 1.24)
    from mcp.client.streamable_http import streamable_http_client as streamablehttp_client
except ImportError:  # mcp 1.x
    from mcp.client.streamable_http import streamablehttp_client

URL = os.getenv("LINKEDIN_MCP_URL", "").rstrip("/")
MIN_GAP = float(os.getenv("LI_MIN_GAP_SECONDS", "4"))
CACHE_TTL = float(os.getenv("LI_CACHE_SECONDS", "600"))
CALL_TIMEOUT = float(os.getenv("LI_CALL_TIMEOUT", "240"))

_lock = asyncio.Lock()
_last_call = 0.0
_cache: dict[str, tuple[float, dict[str, Any]]] = {}
_tools: tuple[float, list[dict[str, Any]]] | None = None


def leaf(e: BaseException) -> str:
    """The real error inside an ExceptionGroup, for messages a person can act on."""
    while getattr(e, "exceptions", None):
        e = e.exceptions[0]
    return f"{type(e).__name__}: {str(e)[:160]}"


def configured() -> bool:
    return bool(URL)


def _unpack(res: Any) -> dict[str, Any]:
    """MCP result -> {ok, data}. Structured content wins; otherwise the first text block, parsed as JSON when possible."""
    structured = getattr(res, "structured_content", None) or getattr(res, "structuredContent", None)  # mcp 2.x / 1.x names
    if structured:
        data: Any = structured
    else:
        text = "\n".join(getattr(c, "text", "") for c in (res.content or []) if getattr(c, "text", None))
        try:
            data = json.loads(text)
        except Exception:
            data = {"text": text}
    if isinstance(data, dict) and set(data) == {"result"}:
        data = data["result"]
    return {"ok": not (getattr(res, "is_error", None) or getattr(res, "isError", False)), "data": data}


def _camel(d: dict[str, Any]) -> dict[str, Any]:
    """read_only_hint -> readOnlyHint, so the rest of the service sees the same names on mcp 1.x and 2.x."""
    out = {}
    for k, v in d.items():
        head, *rest = k.split("_")
        out[head + "".join(w.capitalize() for w in rest)] = v
    return out


async def list_tools() -> list[dict[str, Any]]:
    global _tools
    if _tools and time.time() - _tools[0] < 3600:
        return _tools[1]
    async with streamablehttp_client(URL) as streams:  # 2 streams on mcp 2.x, 3 on 1.x
        async with ClientSession(streams[0], streams[1]) as s:
            await s.initialize()
            res = await s.list_tools()
    out = [
        {"name": t.name, "title": t.title or t.name, "description": (t.description or "")[:400],
         "annotations": _camel(t.annotations.model_dump(exclude_none=True)) if t.annotations else {}, "inputSchema": getattr(t, "input_schema", None) or getattr(t, "inputSchema", None)}
        for t in res.tools
    ]
    _tools = (time.time(), out)
    return out


async def call(tool: str, args: dict[str, Any], read_only: bool, fresh: bool = False) -> dict[str, Any]:
    """Serialised, spaced, cached call. Only read-only tools are cached; actions always run."""
    global _last_call
    key = f"{tool}:{json.dumps(args, sort_keys=True, default=str)}"
    if read_only and not fresh and key in _cache and time.time() - _cache[key][0] < CACHE_TTL:
        return {**_cache[key][1], "cached": True, "cachedAt": _cache[key][0]}
    async with _lock:
        wait = MIN_GAP - (time.time() - _last_call)
        if wait > 0:
            await asyncio.sleep(wait)
        started = time.time()
        try:
            async with streamablehttp_client(URL) as streams:
                async with ClientSession(streams[0], streams[1]) as s:
                    await s.initialize()
                    res = await asyncio.wait_for(s.call_tool(tool, args), timeout=CALL_TIMEOUT)
        finally:
            _last_call = time.time()
    out = _unpack(res)
    out["ms"] = int((time.time() - started) * 1000)
    if read_only and out["ok"]:
        _cache[key] = (time.time(), out)
        if len(_cache) > 300:
            for k in sorted(_cache, key=lambda k: _cache[k][0])[:100]:
                _cache.pop(k, None)
    return out
