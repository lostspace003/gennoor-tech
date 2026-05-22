# AI Governance, Risk & Boards — Research Dossier (Phase 2 Rewrite)

**Course slug:** `ai-governance-risk-boards`
**Track:** Leadership
**Audience:** Board directors, audit committee members, risk officers, CISOs, GCs
**Length:** 8 chapters · ~40 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

AI governance in 2026 is not a checkbox exercise. The EU AI Act is in tranches through August. NIST AI RMF is the de facto US standard. ISO 42001 is the new AI management-system certification. Audit committees are actively asking about AI-use disclosure. The boards that handle this well in the next 24 months build a defensible governance posture; the boards that don't will be answering uncomfortable questions in proxy statements and regulator inquiries.

This course gives directors and risk leaders the concrete frame — risk classification, register, controls, vendor posture, incident response, charter.

## Numbers table (anchor citations · all verifiable public sources)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | EU AI Act (Regulation 2024/1689): Annex III high-risk, Art. 6-29 obligations, Art. 50 transparency, Art. 99 fines (€35M or 7% global turnover for prohibited AI; €15M or 3% for high-risk) | EU Official Journal | published Aug 2024, in tranches through Aug 2026 |
| 2 | NIST AI Risk Management Framework (AI RMF 1.0) — 4 functions: Govern, Map, Measure, Manage | NIST publication | Jan 2023 |
| 3 | NIST AI RMF Generative AI Profile (companion document) — addresses gen-AI-specific risks | NIST publication | Jul 2024 |
| 4 | ISO/IEC 42001:2023 — international AI Management System standard (audit-able certification) | ISO/IEC publication | Dec 2023 |
| 5 | US Executive Order on AI: Biden EO 14110 (Oct 2023), partially rescinded by Trump EO Jan 2025; AI Action Plan 2025 (private-sector focus) | White House EOs | 2023-2025 |
| 6 | State-level US AI laws: NYC Local Law 144 (hiring AI bias audits Jul 2023), Illinois AIVIA, Colorado SB24-205 (AI Act Feb 2026 effective) | Public state legislation | 2023-2026 |
| 7 | India DPDPA (Digital Personal Data Protection Act) 2023 — data fiduciary obligations including breach notification; rules finalised 2025 | DPDPA 2023 + rules 2025 | 2023-2025 |
| 8 | OECD AI Principles (updated 2024) — global voluntary framework adopted by 47+ countries | OECD documentation | 2019, updated 2024 |
| 9 | Mata v. Avianca (S.D.N.Y. 22-cv-1461 PKC) — federal sanction for ChatGPT-fabricated court citations | SDNY court docket | 22 Jun 2023 |
| 10 | Moffatt v. Air Canada (BC Civil Resolution Tribunal) — "Air Canada is responsible for all information on its website, including from a chatbot" | BC CRT public ruling | 14 Feb 2024 |
| 11 | Anthropic Responsible Scaling Policy (RSP) — vendor-published frontier-model safety framework | Anthropic documentation | 2023-2025 |
| 12 | OpenAI Preparedness Framework — vendor safety framework for frontier model release | OpenAI documentation | 2023-2025 |
| 13 | Bloomberg resume-bias investigation — reproducible bias in GPT-3.5/4 resume ranking | Bloomberg News + GitHub | Mar 2024 |
| 14 | Park v. Kim (2nd Cir. 91 F.4th 610) — appellate disciplinary referral for AI-fabricated case citations | 2nd Circuit docket | 30 Jan 2024 |
| 15 | WEF Global Risks Report 2025: AI-driven misinformation listed as top short-term global risk for second year running | WEF Jan 2025 | 2025 |
| 16 | Big-4 advisory: audit committees increasingly require AI-use disclosure in MD&A and financial reporting | PwC, Deloitte, KPMG, EY 2024-25 guidance | 2024-2025 |
| 17 | Charlotin AI-hallucination tracker — 100+ documented US court filings with AI-fabricated citations by mid-2025 | Damien Charlotin tracker | 2025 |
| 18 | NIST AI RMF Govern function: organisational policies, accountability, oversight, risk culture | NIST AI RMF 1.0 §6.1 | 2023 |
| 19 | EU AI Act Art. 27 — Fundamental Rights Impact Assessment (FRIA) required for certain deployers of high-risk AI | EU AI Act Art. 27 | effective Aug 2026 |
| 20 | Audit committee surveys (Deloitte Audit Committee Pulse Q4 2025): 62% want explicit AI-use disclosure; 31% require sample-testing of AI-touched accounts | Deloitte ACP Q4 2025 | 2025 |

## Named incidents (use sparingly, all verifiable)

1. **Mata v. Avianca (Jun 2023)** — Federal sanctions for AI-fabricated citations
2. **Park v. Kim (Jan 2024)** — 2nd Circuit disciplinary referral
3. **Moffatt v. Air Canada (Feb 2024)** — Chatbot liability precedent
4. **Bloomberg resume study (Mar 2024)** — Reproducible bias

## Chapter blueprint

### Chapter 1 — The 2026 governance landscape (~6 min)
**What:** EU AI Act in tranches. NIST AI RMF as de facto US standard. ISO 42001 as audit-able certification. US EO landscape. OECD principles. State laws. The thesis: governance is no longer optional.
**Sources:** [1], [2], [3], [4], [5], [6], [7], [8].

### Chapter 2 — AI risk classification (~5 min)
**What:** EU AI Act tiering (minimal, limited, high-risk, prohibited). NIST AI RMF context-based classification. Risk taxonomy: bias, hallucination, security, IP, privacy. Apply tiering across your AI inventory.
**Sources:** [1], [2], [13].

### Chapter 3 — The AI risk register (~5 min)
**What:** What the audit committee needs to see. Inventory of AI systems. Tier per system. Owner per system. Status per system. Quarterly review cadence. The Big-4 audit-committee question.
**Sources:** [16], [20].

### Chapter 4 — Controls · NIST AI RMF 4 functions (~5 min)
**What:** Govern, Map, Measure, Manage. The operating playbook. Quad-eye on high-risk. Bias testing. Output verification. Audit logging. Cross-domain Mata + Air Canada lessons.
**Sources:** [2], [9], [10], [18].

### Chapter 5 — Vendor + supply chain risk (~5 min)
**What:** OpenAI Enterprise + Anthropic Commercial Terms baseline (training opt-out, tenant isolation, retention). Anthropic RSP + OpenAI Preparedness as vendor safety frameworks. Third-party AI in your products. Open-source model risk.
**Sources:** [11], [12].

### Chapter 6 — Board-level AI questions (~5 min)
**What:** The 7 questions every director must be able to answer. AI inventory. Risk classification. Material AI failure scenarios. Regulator readiness. Vendor concentration. Incident response. Disclosure. Mata + Park + Iovino cross-domain governance signal.
**Sources:** [9], [10], [14], [17].

### Chapter 7 — Incident response + disclosure (~5 min)
**What:** What constitutes an AI incident. The 4-hour, 24-hour, 72-hour response milestones. Public disclosure obligations. EU AI Act Art. 27 FRIA. Audit-committee notification protocols. WEF misinformation as top global risk.
**Sources:** [15], [19].

### Chapter 8 — Making it stick · your AI governance charter (~4 min)
**What:** The 1-page governance charter. Pick the framework (EU AI Act + NIST + ISO 42001 mix). Pick the risk classification. Pick the council composition. Pick the disclosure baseline. Trust trip-wires: no untested model in regulated decisions, no vendor without enterprise terms, no AI-touched material disclosure unverified, no "set and forget" — quarterly review.
**Sources:** Composite.

## Tone

- **Emma. Board + audit-committee register.** Concrete. Numbers + statutory references.
- **Not catastrophising. Audit-defensible.**
- **Tetlock chorus.** Calibration over confidence.

## Theme

Slate/orange neutral palette. No emojis. Sora headings, Inter body.
