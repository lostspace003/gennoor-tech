"""OFFLINE MOCK of the claude_agent_sdk public API, for studying the guide's examples without network.

* Requires a mock ANTHROPIC_API_KEY (must start with "sk-ant-") and a known model id, like the real thing would need real ones.
* The "model" is a deterministic script table (SCRIPTS below) over a virtual file system (FILES).
* Permission order, hook behaviour, sessions, subagents and error subtypes follow the real SDK's documented behaviour,
  but this is NOT the real SDK. Replace with `pip install claude-agent-sdk` and a real key for real runs.
"""
import os, re, json, fnmatch, asyncio, inspect
from dataclasses import dataclass, field, replace
from typing import Any

KNOWN_MODELS = {"claude-fable-5-1", "claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5", "sonnet", "opus", "haiku", "inherit"}
BUILTIN_TOOLS = ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "Agent", "WebSearch", "WebFetch"]

# ---------------- errors ----------------
class ClaudeSDKError(Exception): pass
class CLINotFoundError(ClaudeSDKError): pass
class ProcessError(ClaudeSDKError):
    def __init__(self, message, exit_code=1): super().__init__(message); self.exit_code = exit_code

# ---------------- messages / blocks ----------------
@dataclass
class TextBlock: text: str
@dataclass
class ToolUseBlock: id: str; name: str; input: dict
@dataclass
class ToolResultBlock: tool_use_id: str; content: str; is_error: bool = False
@dataclass
class AssistantMessage: content: list; model: str = ""; parent_tool_use_id: str | None = None
@dataclass
class UserMessage: content: list; parent_tool_use_id: str | None = None
@dataclass
class SystemMessage: subtype: str; data: dict
@dataclass
class ResultMessage:
    subtype: str; duration_ms: int; is_error: bool; num_turns: int; session_id: str
    total_cost_usd: float; usage: dict; result: str | None = None; structured_output: Any = None

# ---------------- config types ----------------
@dataclass
class AgentDefinition: description: str; prompt: str; tools: list | None = None; model: str | None = None
@dataclass
class HookMatcher: matcher: str | None = None; hooks: list = field(default_factory=list); timeout: float | None = None
@dataclass
class PermissionResultAllow: updated_input: dict | None = None
@dataclass
class PermissionResultDeny: message: str = ""; interrupt: bool = False
@dataclass
class ClaudeAgentOptions:
    tools: Any = None; allowed_tools: list = field(default_factory=list); system_prompt: Any = None
    mcp_servers: dict = field(default_factory=dict); permission_mode: str | None = None
    continue_conversation: bool = False; resume: str | None = None; max_turns: int | None = None
    max_budget_usd: float | None = None; disallowed_tools: list = field(default_factory=list)
    model: str | None = None; output_format: dict | None = None; cwd: str | None = None
    can_use_tool: Any = None; hooks: dict | None = None; fork_session: bool = False
    agents: dict | None = None; setting_sources: list | None = None

@dataclass
class SdkMcpTool: name: str; description: str; input_schema: Any; handler: Any

def tool(name, description, input_schema, annotations=None):
    def deco(fn): return SdkMcpTool(name, description, input_schema, fn)
    return deco

def create_sdk_mcp_server(name, version="1.0.0", tools=None):
    return {"type": "sdk", "name": name, "version": version, "tools": {t.name: t for t in (tools or [])}}

# ---------------- virtual world ----------------
FILES = {
    "contracts/acme.txt": "Acme Corp services agreement\nRenewal date: 2026-03-01\nValue: $120,000",
    "contracts/globex.txt": "Globex supply agreement\nRenewal date: 2027-01-15\nValue: $80,000",
    "contracts/initech.txt": "Initech license agreement\nRenewal date: 2026-09-30\nValue: $45,000",
    "hr/pto.md": "# PTO Policy\nEmployees accrue 20 days of PTO per year.\nUp to 5 unused days carry over.",
    "hr/contractors.md": "# Contractors\nContractors do not accrue PTO; time off is agreed in the statement of work.",
    "hr/remote.md": "# Remote work\nEmployees may work remotely up to 3 days per week with manager approval.",
    "report.md": "# FY26 Report\nRevenue: $4.2M\nGrowth: 12%",
    "src/price.py": "def parse_price(s):\n    return float(s)\n",
    "invoice.txt": "Vendor: Acme\nAmount: 1250.00\nDue: 2026-12-01",
    "logs/web.log": "10:01 ERROR upstream timeout\n10:02 INFO retrying request",
    "docs/vpn.md": "# VPN\nInstall the company VPN client. Request access in the IT portal. MFA is required.",
    "docs/mfa.md": "# MFA\nEnroll an authenticator app or hardware key within 7 days of joining.",
    "docs/security.md": "# Security\nPasswords rotate every 90 days. Report phishing to security@example.com.",
}
FAKE_MCP = {  # what "external" MCP servers would answer
    "crm": {"lookup_customer": lambda a: json.dumps({"id": a.get("id"), "name": "Globex", "tier": "gold"})},
    "tickets": {"list_tickets": lambda a: json.dumps([{"id": "T-1", "status": "open", "title": "VPN down"}, {"id": "T-2", "status": "closed", "title": "Reset MFA"}])},
    "fs": {"read_file": lambda a: FILES.get(a.get("path"), "not found")},
}
BASH = [("pytest", "2 passed in 0.31s"), ("rm -rf", "(deleted)"), ("ls build", "app.bin  main.o"), ("systemctl restart", "web.service restarted"), ("cleanup", "cleaned")]

_counter = {"sess": 0, "tool": 0}
SESSIONS: dict = {}

class Ctx:
    def __init__(self, prompt, history, options): self.prompt, self.history, self.options, self.results = prompt, history, options, []
    @property
    def last(self): return self.results[-1] if self.results else ""

# ---------------- scripted "model" ----------------
def T(name, inp, **o): return ("tool", name, inp, o)
def F(text): return ("final", text)
def renew_lines(c): return [l for l in c.results[-1].splitlines() if l]

SCRIPTS = [
 ("renews in 2026", [T("Glob", {"pattern": "contracts/*.txt"}), T("Grep", {"pattern": "Renewal date: 2026", "path": "contracts/*.txt"}),
    F(lambda c: f"Found {len(renew_lines(c))} contracts renewing in 2026:\n" + "\n".join("- " + l.split(":")[0].split("/")[-1] + " (" + l.split("Renewal date: ")[1] + ")" for l in renew_lines(c)))]),
 ("run the cleanup script", [T("Bash", {"command": "./cleanup.sh"}, err=lambda c: "Bash is not permitted in this session, so I did not run the cleanup script.")]),
 ("which policy covers remote", [T("Grep", {"pattern": "remote", "path": "hr/*.md"}), T("Read", {"file_path": "hr/remote.md"}),
    F(lambda c: "Per hr/remote.md: " + c.last.splitlines()[1])]),
 ("pto policy", [T("Grep", {"pattern": "PTO", "path": "hr/*.md"}), T("Read", {"file_path": "hr/pto.md"}), F("Employees accrue 20 days of PTO per year; 5 unused days carry over.")]),
 ("and for contractors", [T("Read", {"file_path": "hr/contractors.md"}), F(lambda c: "(following up on: " + c.history[0]["prompt"] + ")\nContractors do not accrue PTO; time off is set in the statement of work.")]),
 ("where is retry logic", [T("Grep", {"pattern": "retry", "path": "logs/*.log"}), T("Read", {"file_path": "logs/web.log"}), F("Retries are logged in logs/web.log (see 'retrying request').")]),
 ("sku a-100", [T("mcp__inventory__check_stock", {"sku": "A-100"}), F(lambda c: c.last.replace(": ", " has ", 1) + ".")]),
 ("sku z-999", [T("mcp__inventory__check_stock", {"sku": "Z-999"}, err=lambda c: "SKU Z-999 is not in the catalogue, so I cannot quote stock.")]),
 ("customer c-77", [T("mcp__crm__lookup_customer", {"id": "C-77"}), F(lambda c: "Customer C-77 is " + json.loads(c.last)["name"] + " (tier: " + json.loads(c.last)["tier"] + ").")]),
 ("use researcher then analyst", [
    T("Agent", {"subagent_type": "researcher", "prompt": "Find renewal dates in contracts/*.txt and list them."}),
    T("Agent", lambda c: {"subagent_type": "analyst", "prompt": "Analyze these findings and rate risk:\n" + c.results[0]}),
    F(lambda c: "Assessment complete.\n" + c.results[1])]),
 ("find renewal dates in contracts", [T("Grep", {"pattern": "Renewal date", "path": "contracts/*.txt"}),
    F(lambda c: "\n".join("- " + l.split(":")[0].split("/")[-1] + ": " + l.split("Renewal date: ")[1] for l in c.last.splitlines()))]),
 ("analyze these findings", [F(lambda c: "Risk table:\n" + "\n".join("| " + l.strip("- ").split(":")[0] + " | " + ("HIGH" if "2026" in l else "LOW") + " |" for l in c.prompt.splitlines()[1:] if ":" in l))]),
 ("clean the build folder", [T("Bash", {"command": "rm -rf build/"}, cont=True), T("Bash", {"command": "ls build/"}), F(lambda c: "Build folder inspected safely: " + c.last)]),
 ("read report.md and remember", [T("Read", {"file_path": "report.md"}), F("Noted: revenue is $4.2M and growth is 12%.")]),
 ("what was the revenue", [F(lambda c: "Revenue was $4.2M (recalled from earlier in this session)." if any("report.md" in h["prompt"] for h in c.history) else "I have no earlier context about a revenue figure.")]),
 ("revenue is 10% lower", [F(lambda c: "Branch summary: revenue falls to $3.78M (-10%) with growth under review." if c.history else "No history.")]),
 ("restart the web service", [T("Bash", {"command": "systemctl restart web"}, cont=True), T("Read", {"file_path": "logs/web.log"}), F(lambda c: "Done. Latest log: " + c.last.splitlines()[-1])]),
 ("extract fields from invoice", [T("Read", {"file_path": "invoice.txt"}), ("struct", {"vendor": "Acme", "amount": 1250.0, "due_date": "2026-12-01"}, "Extracted invoice fields.")]),
 ("find the failing test", [T("Bash", {"command": "pytest"}), T("Edit", {"file_path": "src/price.py", "old_string": "float(s)", "new_string": "float(s.replace('$', ''))"}), T("Bash", {"command": "pytest"}), F("Fixed.")]),
 ("summarize the it onboarding docs", [T("Glob", {"pattern": "docs/*.md"}), T("Read", {"file_path": "docs/vpn.md"}), T("Read", {"file_path": "docs/mfa.md"}),
    T("Write", lambda c: {"file_path": "summary.md", "content": "# IT onboarding\n- VPN: request access in the IT portal (MFA required)\n- MFA: enroll within 7 days\n"}), F("Wrote summary.md covering VPN and MFA.")]),
 ("make parse_price accept dollar", [T("Grep", {"pattern": "def parse_price", "path": "src/*.py"}), T("Read", {"file_path": "src/price.py"}),
    T("Edit", {"file_path": "src/price.py", "old_string": "float(s)", "new_string": "float(s.replace('$', ''))"}), T("Bash", {"command": "pytest"}),
    F(lambda c: "Updated parse_price to strip '$'. Tests: " + c.last)]),
 ("plan the vendor risk review", [
    T("Agent", {"subagent_type": "researcher", "prompt": "Find renewal dates in contracts/*.txt and list them."}),
    T("Agent", lambda c: {"subagent_type": "analyst", "prompt": "Analyze these findings and rate risk:\n" + c.results[0]}),
    T("Agent", lambda c: {"subagent_type": "reviewer", "prompt": "Review this analysis for gaps:\n" + c.results[1]}),
    F(lambda c: "FINAL REPORT\n" + c.results[1] + "\nReviewer: " + c.results[2])]),
 ("review this analysis", [F("Looks consistent; add contract values before sending to finance.")]),
 ("open tickets for customer c-77", [T("mcp__crm__lookup_customer", {"id": "C-77"}), T("mcp__tickets__list_tickets", {"customer": "C-77"}),
    F(lambda c: f"{json.loads(c.results[0])['name']} has {sum(1 for t in json.loads(c.results[1]) if t['status']=='open')} open ticket(s): " + ", ".join(t['title'] for t in json.loads(c.results[1]) if t['status']=='open'))]),
 ("refund order o-1", [T("mcp__payments__issue_refund", {"order": "O-1", "amount": 40}, cont=True), T("mcp__payments__issue_refund", {"order": "O-2", "amount": 250}, cont=True),
    F(lambda c: "Results:\n- O-1: " + c.results[0] + "\n- O-2: " + c.results[1])]),
 ("how do i get vpn access", [T("mcp__kb__search_kb", {"query": "vpn"}), T("Read", {"file_path": "docs/vpn.md"}), F(lambda c: "To get VPN access: " + c.last.splitlines()[1].replace("Install", "install") + " (source: docs/vpn.md)")]),
]

def _plan(prompt):
    p = prompt.lower()
    for key, steps in SCRIPTS:
        if key in p: return steps
    return [F("(mock model) I have no scripted behaviour for this prompt.")]

# ---------------- engine ----------------
def _check_env(options):
    if not os.environ.get("ANTHROPIC_API_KEY", "").startswith("sk-ant-"):
        raise ClaudeSDKError("ANTHROPIC_API_KEY missing or invalid (the mock needs a value starting with 'sk-ant-')")
    m = options.model or "claude-sonnet-5-5"
    if m not in KNOWN_MODELS: raise ClaudeSDKError(f"Unknown model id: {m}")
    return m

def _tool_list(options):
    names = list(BUILTIN_TOOLS)
    for srv, cfg in (options.mcp_servers or {}).items():
        ks = cfg["tools"].keys() if cfg.get("type") == "sdk" else FAKE_MCP.get(srv, {}).keys()
        names += [f"mcp__{srv}__{k}" for k in ks]
    return names

def _match(name, patterns): return any(fnmatch.fnmatchcase(name, p) for p in patterns)

async def _call(cb, *a):
    r = cb(*a)
    return await r if inspect.isawaitable(r) else r

async def _gate(name, inp, tid, o):
    for hm in (o.hooks or {}).get("PreToolUse", []):
        if hm.matcher is None or re.fullmatch(hm.matcher, name):
            for cb in hm.hooks:
                r = await _call(cb, {"hook_event_name": "PreToolUse", "tool_name": name, "tool_input": inp}, tid, {}) or {}
                h = r.get("hookSpecificOutput", {})
                if h.get("permissionDecision") == "deny": return False, "Blocked by hook: " + h.get("permissionDecisionReason", "")
    if _match(name, o.disallowed_tools): return False, f"Tool '{name}' is in disallowed_tools"
    if o.permission_mode == "bypassPermissions": return True, ""
    if o.permission_mode == "acceptEdits" and name in ("Edit", "Write"): return True, ""
    if _match(name, o.allowed_tools): return True, ""
    if o.can_use_tool:
        r = await _call(o.can_use_tool, name, inp, {})
        return (True, "") if isinstance(r, PermissionResultAllow) else (False, "Permission denied: " + r.message)
    return False, f"Permission denied: '{name}' needs approval and no can_use_tool callback is set"

def _builtin(name, a):
    if name == "Read":
        p = a["file_path"]; return (FILES[p], False) if p in FILES else (f"File not found: {p}", True)
    if name == "Glob": return "\n".join(sorted(k for k in FILES if fnmatch.fnmatch(k, a["pattern"]))), False
    if name == "Grep":
        out = []
        for k in sorted(FILES):
            if fnmatch.fnmatch(k, a.get("path", "*")):
                for i, l in enumerate(FILES[k].splitlines(), 1):
                    if re.search(a["pattern"], l): out.append(f"{k}:{i}:{l}")
        return "\n".join(out), False
    if name == "Write": FILES[a["file_path"]] = a["content"]; return f"Wrote {len(a['content'])} bytes to {a['file_path']}", False
    if name == "Edit":
        f = FILES.get(a["file_path"], "")
        if a["old_string"] not in f: return "old_string not found", True
        FILES[a["file_path"]] = f.replace(a["old_string"], a["new_string"], 1); return f"Edited {a['file_path']}", False
    if name == "Bash":
        for k, v in BASH:
            if k in a["command"]: return v, False
        return "ok", False
    if name in ("WebSearch", "WebFetch"): return "(mock web result)", False
    return f"Unknown tool {name}", True

async def _exec(name, inp, o):
    if name.startswith("mcp__"):
        _, srv, tn = name.split("__", 2); cfg = (o.mcp_servers or {}).get(srv, {})
        if cfg.get("type") == "sdk":
            r = await cfg["tools"][tn].handler(inp)
            return "".join(b.get("text", "") for b in r["content"]), bool(r.get("is_error"))
        return FAKE_MCP[srv][tn](inp), False
    return _builtin(name, inp)

async def _run(prompt, o, session, parent=None):
    model = _check_env(o)
    ctx = Ctx(prompt, list(session["history"]), o); steps = _plan(prompt)
    turns = 0; cost = 0.0; final = None; struct = None; err_sub = None
    if parent is None:
        yield SystemMessage("init", {"session_id": session["id"], "model": model, "tools": _tool_list(o), "mcp_servers": [{"name": k, "status": "connected"} for k in (o.mcp_servers or {})]})
    for st in steps:
        if st[0] == "tool":
            _, name, inp, opt = st
            inp = inp(ctx) if callable(inp) else inp
            turns += 1; cost += 0.0021
            if o.max_turns and turns > o.max_turns: err_sub = "error_max_turns"; break
            if o.max_budget_usd is not None and cost > o.max_budget_usd: err_sub = "error_max_budget_usd"; break
            _counter["tool"] += 1; tid = f"toolu_{_counter['tool']:03d}"
            yield AssistantMessage([ToolUseBlock(tid, name, inp)], model, parent)
            ok, why = await _gate(name, inp, tid, o)
            if not ok: text, err = why, True
            elif name == "Agent":
                sub = (o.agents or {}).get(inp["subagent_type"])
                if sub is None: text, err = "Unknown subagent", True
                else:
                    child_o = replace(o, allowed_tools=list(sub.tools or o.allowed_tools), system_prompt=sub.prompt, model=o.model if sub.model in (None, "inherit") else o.model)
                    text, err = "", False
                    async for m in _run(inp["prompt"], child_o, {"id": session["id"], "history": []}, parent=tid):
                        yield m
                        if isinstance(m, AssistantMessage) and m.content and isinstance(m.content[-1], TextBlock): text = m.content[-1].text
            else:
                text, err = await _exec(name, inp, o)
                if not err:
                    for hm in (o.hooks or {}).get("PostToolUse", []):
                        if hm.matcher is None or re.fullmatch(hm.matcher, name):
                            for cb in hm.hooks: await _call(cb, {"hook_event_name": "PostToolUse", "tool_name": name, "tool_input": inp, "tool_response": text}, tid, {})
            yield UserMessage([ToolResultBlock(tid, text, err)], parent)
            ctx.results.append(text)
            if err and not opt.get("cont"):
                final = opt["err"](ctx) if "err" in opt else f"I could not complete that: {text}"; break
        elif st[0] == "final": final = st[1](ctx) if callable(st[1]) else st[1]
        elif st[0] == "struct": struct = st[1]; final = st[2]
    cost += 0.0021
    if err_sub:
        yield ResultMessage(err_sub, 900, True, turns - 1, session["id"], round(cost, 4), {"input_tokens": 1200, "output_tokens": 150})
        raise ClaudeSDKError({"error_max_turns": "Reached maximum number of turns", "error_max_budget_usd": "Reached maximum budget"}[err_sub])
    yield AssistantMessage([TextBlock(final or "")], model, parent)
    if parent is None:
        session["history"].append({"prompt": prompt, "final": final})
        yield ResultMessage("success", 1800 + 400 * turns, False, turns, session["id"], round(cost, 4), {"input_tokens": 1200 + 300 * turns, "output_tokens": 150 + 40 * turns}, final, struct)

def _new_session(options):
    if options.resume and options.resume in SESSIONS:
        old = SESSIONS[options.resume]
        if not options.fork_session: return old
        s = {"id": _next_id(), "history": list(old["history"])}
    else: s = {"id": _next_id(), "history": []}
    SESSIONS[s["id"]] = s; return s

def _next_id():
    _counter["sess"] += 1; return f"sess-{_counter['sess']:04d}"

async def query(*, prompt, options=None, transport=None):
    options = options or ClaudeAgentOptions()
    async for m in _run(prompt, options, _new_session(options)): yield m

class ClaudeSDKClient:
    def __init__(self, options=None, transport=None): self.options = options or ClaudeAgentOptions(); self._s = None; self._p = None
    async def __aenter__(self): _check_env(self.options); self._s = _new_session(self.options); return self
    async def __aexit__(self, *a): return False
    async def connect(self, prompt=None): await self.__aenter__()
    async def disconnect(self): pass
    async def query(self, prompt, session_id="default"): self._p = prompt
    async def interrupt(self): pass
    async def set_permission_mode(self, mode): self.options.permission_mode = mode
    async def receive_response(self):
        async for m in _run(self._p, self.options, self._s): yield m
