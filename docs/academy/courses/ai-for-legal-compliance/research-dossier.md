# AI for Legal & Compliance — Research Dossier

**Course slug:** `ai-for-legal-compliance`
**Track:** Function · Legal & Compliance
**Audience:** GCs, legal ops, compliance officers, DPOs past basic AI literacy
**Length:** 8 chapters · ~40 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

Legal AI is the function where adoption is real, ROI is measurable on routine work, and the failure mode is *public sanction.* Mata v. Avianca turned every law-firm AI deployment into a discipline conversation. The interesting question is no longer "should we use AI in legal" — that's settled — but "what guardrails turn legal AI into a force multiplier instead of a malpractice claim."

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Thomson Reuters Future of Professionals 2025: 79% of corporate legal teams use AI in some capacity; 51% deployed for contract review | TR Institute · 2025 | Jul 2025 |
| 2 | Harvey AI: $300M Series E (Dec 2024) at $3B valuation; >$70M ARR; 250+ law-firm + corporate-legal customers | Reuters / TechCrunch | Dec 2024 |
| 3 | Spellbook (Rally Legal): ~3,000+ law firms / corporate legal teams using AI redline | Spellbook customer page | 2025 |
| 4 | Mata v. Avianca (S.D.N.Y. June 22 2023): Steven Schwartz + Peter LoDuca sanctioned $5,000 + ordered to notify falsely-cited judges after submitting ChatGPT-fabricated case citations | SDNY 22-cv-1461 PKC | Jun 2023 |
| 5 | Park v. Kim (2d Cir. Jan 30 2024): 2nd Circuit referred attorney to disciplinary committee for citing AI-fabricated case in brief | Park v. Kim, 91 F.4th 610 | Jan 2024 |
| 6 | Iovino v. Michael Stapleton Associates (E.D. Va. Jul 2024): attorney sanctioned $1,500 for fabricated AI cases | E.D. Va. case | Jul 2024 |
| 7 | Park, Schwartz pattern: as of mid-2025, 100+ documented cases of AI-fabricated citations in US court filings (Damien Charlotin tracker) | Charlotin AI hallucinations DB | 2025 |
| 8 | Stanford RegLab Jan 2024 study: top legal AI tools hallucinated 17–34% of the time on benchmark legal queries — even RAG-grounded ones | Stanford HAI · "Hallucinating Law" | Jan 2024 |
| 9 | Vals AI legal benchmark 2025: top-3 tools (Harvey, Vincent, CoCounsel) at >80% accuracy on contract clauses — but variable across jurisdictions | Vals AI benchmark · 2025 | 2025 |
| 10 | EU AI Act Annex III: "AI systems intended to assist judicial authorities in researching and interpreting facts and the law" classified high-risk; Art. 26 obligations on deployers | EU AI Act 2024/1689 | Aug 2 2026 effective |
| 11 | EU AI Act Art. 50 transparency: AI chatbots interacting with persons must disclose; relevant to client-facing legal chatbots | EU AI Act Art. 50 | Aug 2026 |
| 12 | India DPDPA 2023 Section 7(1)(i): legitimate use covers contractual obligations + employment + state functions but requires data fiduciary obligations and breach notification | DPDPA 2023 | Aug 2023 enacted, rules 2025 |
| 13 | ABA Formal Opinion 512 (Jul 2024): lawyers using generative AI must understand the tool's capabilities + limitations, protect client confidentiality, comply with candor and competence duties | ABA Formal Opinion 512 | Jul 2024 |
| 14 | ABA Resolution 604 (Aug 2024): bar associations encouraged to issue AI guidance; many state bars (CA, NY, FL, TX) followed in 2024–2025 | ABA Resolution 604 | Aug 2024 |
| 15 | DLA Piper / Slaughter & May 2025: BigLaw firms reporting 25–40% time savings on diligence + first-draft contract work with AI tools | Multiple firm reports 2025 | 2025 |
| 16 | OpenAI / Anthropic enterprise terms: training opt-out by default for API + workspace; client data not used to train. Confidential confirmed in both privacy policies (2024+) | OpenAI Enterprise + Anthropic Commercial Terms | 2024–2025 |
| 17 | Notion AI / Microsoft Copilot for Microsoft 365: tenant data isolation + no training on customer prompts. Same posture, different vendors. | MS Trust Center · Notion Trust | 2025 |
| 18 | Privilege analysis: 2024–2025 ABA + NY Bar opinions confirm privilege can survive use of cloud AI tools if vendor terms preserve confidentiality and no third-party disclosure occurs | NY Bar Opinion 1239 + ABA Formal Op. 512 | 2024 |
| 19 | EU AI Act Art. 27 fundamental rights impact assessment (FRIA) — obligation on certain deployers of high-risk AI, including in legal/judicial use | EU AI Act Art. 27 | Aug 2026 |
| 20 | Air Canada precedent applies: bot says it, you said it. Same logic at law firms — junior associate using AI is the firm's statement. | BC CRT Moffatt | Feb 2024 |

## Named incidents (use sparingly)

1. **Mata v. Avianca (Jun 2023)** — Schwartz, fake citations, Judge Castel sanction. The pivotal incident.
2. **Park v. Kim (Jan 2024)** — 2nd Circuit disciplinary referral. Higher-court precedent.
3. **Iovino (Jul 2024)** — More recent, $1.5K sanction.
4. **Damien Charlotin tracker** — 100+ documented cases mid-2025. Pattern is now industry-wide.

## What we do NOT say

- **No "AI replaces lawyers" framing.** Frame as augmentation + checking.
- **No vendor selection bias.** Harvey, Spellbook, CoCounsel, Vincent referenced even-handedly.
- **No specific legal advice in the chapter text.** This is training, not counsel.
- **No predictions of accuracy above 90%** unless source-cited.
- **No "set and forget"** — human-in-the-loop is non-negotiable in legal.

## Chapter blueprint

### Chapter 1 — The legal AI landscape (~6 min)
**What:** TR Institute 79% adoption / 51% contract review. Harvey + Spellbook market state. Vals 2025 benchmark. BigLaw 25-40% time savings. The thesis: legal AI is *deployed* — the question is guardrails.
**Sources:** [1], [2], [3], [9], [15].

### Chapter 2 — The hallucination tax (~5 min)
**What:** Mata v. Avianca, Schwartz, Castel sanction. Park v. Kim 2nd Circuit. Charlotin tracker 100+ cases by 2025. Stanford 17–34% hallucination even with RAG. The check-or-die rule. Air Canada parallel.
**Sources:** [4], [5], [6], [7], [8], [20].

### Chapter 3 — Contract review (~5 min)
**What:** The killer app. Harvey + CoCounsel + Spellbook patterns. NDA, MSA, MNDA workflows. The first-pass redline + lawyer-validates loop. Vals 80%+ accuracy on clauses. The 3 review modes: extract, compare, redline.
**Sources:** [3], [9], [15].

### Chapter 4 — Privacy & DPIA reviews (~5 min)
**What:** GDPR Art. 35 DPIA workflow with AI assistance. EU AI Act Art. 27 FRIA (fundamental rights impact assessment) from Aug 2 2026. India DPDPA breach notification. The propose-and-confirm pattern for risk assessments. The AI generates the draft; the DPO validates.
**Sources:** [10], [12], [19].

### Chapter 5 — Compliance posture across jurisdictions (~5 min)
**What:** The 2026 compliance matrix: EU AI Act Annex III high-risk classification for legal/judicial AI; Art. 26 deployer obligations; US state laws (NYC LL144 hiring, IL AIVIA, CO SB24-205); India DPDPA. ABA Formal Op. 512 + ABA Res. 604. The four-jurisdiction posture document.
**Sources:** [10], [11], [12], [13], [14].

### Chapter 6 — Privilege & confidentiality (~5 min)
**What:** Can you use OpenAI / Anthropic / Microsoft Copilot without breaking privilege? Vendor enterprise terms — training opt-out, tenant isolation. NY Bar Opinion 1239 + ABA Formal Op. 512 — privilege survives if confidentiality preserved. The vendor due-diligence checklist. The 3 settings to verify before client data touches AI.
**Sources:** [13], [16], [17], [18].

### Chapter 7 — Quality framework (~5 min)
**What:** Citation verification. Human-in-the-loop. Audit trail. The 4 quality gates: every claim cited and verifiable; second-pair-of-eyes on AI outputs to clients; logging which queries used AI; quarterly bias + accuracy review. The Stanford 17-34% number says you cannot skip these.
**Sources:** [8], [13].

### Chapter 8 — Making it stick · 2-quarter rollout (~4 min)
**What:** Pick 2 use cases (not seven). Q1 — contract review (extract + compare on standard NDAs) + privacy DPIA drafts. Q2 — one open-ended use case. ABA Op 512 baked in: competence + confidentiality + candor + cost transparency. Trust trip-wires: no client-facing AI without disclosure, no citations the lawyer hasn't read, no client data to non-enterprise tools, no "set and forget."
**Sources:** Composite of [13], [16], [18], [19].

## Tone

- **Andrew, plain.** Legal practitioners hate breathless tech-language.
- **Cite cases by name and date.** This audience expects citations.
- **No fluff.** Direct sentences. Concrete obligations.
- **Stress accountability:** the lawyer / firm is responsible regardless of tool used.
