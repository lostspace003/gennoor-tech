# Gennoor Platform — Complete Guide & Links
*Everything built, tested and deployed — 26 July 2026*

---

## 🔗 Your links

| What | URL | Who |
|---|---|---|
| **CRM (team app)** | https://gennoor.com/crm | all 5 team accounts |
| **Work Queue** (start your day here) | https://gennoor.com/crm/queue | everyone |
| **Leads** | https://gennoor.com/crm/leads | everyone |
| **Pipeline board** | https://gennoor.com/crm/pipeline | everyone |
| **Inbox** (lead replies) | https://gennoor.com/crm/inbox | everyone |
| **Scheduler** (Teams meetings + invites) | https://gennoor.com/crm/scheduler | everyone |
| **Documents** (manuals, posters) | https://gennoor.com/crm/documents | everyone |
| **Team activity** | https://gennoor.com/crm/team | managers |
| **GennoorCare log + weekly business report** | https://gennoor.com/crm/botlog | managers |
| **Admin dashboard** | https://gennoor.com/admin | all |
| **GennoorCare (public bot)** | bottom-right on any gennoor.com page | your visitors |

**Sign-in**: Microsoft Entra ID (your @gennoor.com accounts). Managers = admin, jalalkhan, yusufchaudhary. Team = contact, contacts.

---

## 🤖 GennoorCare — the public website bot (LIVE & VERIFIED)

**Knowledge**: 752 pages of gennoor.com → 1,464 vectorized chunks in Azure Blob. Refreshes automatically on the 1st of every month (only changed pages re-process); manual "Reindex now" button in CRM → GennoorCare → Knowledge index.

**Visitor journey**: greets → asks name (skippable) → answers grounded ONLY in your website with clickable links, bullets, proper formatting → offers a callback at the right moment → captured leads land in your CRM pool as **high-priority "Website Bot" leads** → skippable 👍/👎 feedback on ending. **Minimize (–) keeps the chat** across pages; **X ends it**.

**Verified today (real transcripts)**:
- *"AI training for non-technical teams?"* → recommended the exact course (2-day, 16-hour AI Literacy program) with correct link ✅
- *"Your Tokyo office address?"* → **"I don't have that on the website"** + your contacts — no invention ✅
- *Saudi bank, 50 managers* → Vision-2030-aligned program, discovery call, free-webinar offer ✅

**Protection (all live)**: 8 msg/min & 40/day per visitor · 500-char input · 450-token replies · 24-h answer cache · daily token budget breaker (degrades into lead capture, never silence) · kill switch (`GENNOORBOT_ENABLED=false` app setting) · topic guard · full audit log. **The website never depends on the bot — worst case is a quiet chat button.**

**Manager view (CRM → GennoorCare)**: every conversation (leads green, feedback purple) · **weekly business report in Markdown** — demand signals, buying intent, content gaps, leads, recommended actions — you can *interact with it* ("which sector asked most about POCs?"), copy it, and **forward it to the team by email** in one click.

---

## 🗂 CRM — how the team works (the flow)

1. **Pool** — all imported leads are unclaimed. Anyone **picks up** a lead (it's theirs until **released**); junk gets **dumped** with a reason (restorable). Managers can assign directly.
2. **Work Queue** — every claimed lead sits in exactly one bucket with one button: **Research → Finalize pitch → First email → Follow-up (5+ days quiet)**. Replies jump to a red **"Reply received — act now"** bucket on top. Members see their queue; managers see the team's.
3. **Research Copilot** — web-grounded AI research (cited sources) → chat about the angle → **Finalize pitch** (locked 4-section brief) → *Continue to email*.
4. **Email** — AI draft from the pitch → chat-refine ("shorter", "lead with webinar") → **Final copy** → attach documents (upload any file; preview PDF/Word/Excel/images in a popup) → **Send** (To/CC/BCC, admin@ always CC'd) → replies appear in the same thread → **Reply with AI** / **Follow up with AI** / **Schedule meet** (Teams invite, extra attendees).
5. **Import anything** — Excel/CSV (template or *any* format — AI maps columns), **PDF, Word, Markdown, text** (AI extracts contacts) — multiple files at once, deduped, preview before saving. Only Name required; blanks welcome. Export current view to Excel anytime.
6. **GennoorBot** (top bar, pulsing light) — the internal copilot over all CRM data, with a **Web search ON/off** toggle; scales via embeddings past 150 leads.
7. **Every morning 06:30 IST (Mon–Sat)**: admin@ gets the digest (pool, backlogs, follow-ups due, today's meetings) — each teammate gets their own personal queue email — and **the lead data is backed up** (30-day history).

---

## ✅ To-do list for YOU (15 minutes, all in the browser)

1. **Upload the 99 leads** — `GENNOOR_CRM_UPLOAD_TEMPLATE.xlsx` on your Desktop → CRM → Leads → Import.
2. **Upload the 2-page manuals** (tech + non-tech) → CRM → Documents → `manuals/`.
3. **Webinar poster** when ready → `posters/`.
4. Say hello to GennoorCare on gennoor.com and watch the conversation appear in CRM → GennoorCare.

---

## 🔒 Housekeeping facts (for the record)

- Leads live in Azure Blob (cloud) — login/refresh can never delete data; daily backups; delete = manager-only.
- Graph permissions granted & secret rotated (2-yr): Inbox, Sent-Items sync, Teams meetings all live.
- CI/CD is serialized (no more 409 collisions) and green.
- Vercel: fully removed (infrastructure + dead login redirect). Only truthful marketing text about a showcased POC remains.
- Everything above is saved to persistent memory for future sessions.
