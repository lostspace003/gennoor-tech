# Research Dossier — Working with Copilots

**Course:** Working with Copilots (Foundations track)
**Audience:** Professionals already issued M365 Copilot, GitHub Copilot, or ChatGPT Enterprise
**Duration:** ~50 minutes · 7 chapters
**Voice:** Emma (alternation rule — Course 1 Emma, Course 2 Andrew, Course 3 Emma)
**Build date:** May 2026

---

## Theme 1 — What M365 Copilot actually is in 2026

**1. How does Microsoft 365 Copilot work?** — Microsoft Learn — https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-architecture — *last updated 2026-05-06*. Four-step flow: user prompt → grounding via Microsoft Graph in the user's tenant → grounded prompt sent to LLM → response returned. Copilot "only accesses data that an individual user is authorized to access" and honours Conditional Access + MFA. Operates "inside the Microsoft 365 service boundary" but Microsoft explicitly notes: "Operating inside the Microsoft 365 service boundary doesn't grant Copilot tenant-wide visibility."

**2. Microsoft 365 Copilot Wave 2: Pages, Python in Excel, and agents** — Microsoft 365 Blog — https://www.microsoft.com/en-us/microsoft-365/blog/2024/09/16/microsoft-365-copilot-wave-2-pages-python-in-excel-and-agents/ — *Sept 2024*. Origin of "agents in Copilot" framing. Pages = "dynamic, persistent canvas in Copilot chat designed for multiplayer AI collaboration… first new digital artifact for the AI age." Stored in SharePoint Embedded containers.

**3. Introducing Researcher and Analyst in Microsoft 365 Copilot** — Microsoft 365 Blog — https://www.microsoft.com/en-us/microsoft-365/blog/2025/03/25/introducing-researcher-and-analyst-in-microsoft-365-copilot/ — *25 Mar 2025, GA 2 Jun 2025*. Two "reasoning agents": Researcher (OpenAI deep-research model + M365 orchestration) and Analyst (OpenAI o3-mini, chain-of-thought over raw data). The agentic shift inside M365 Copilot.

## Theme 2 — Productivity data

**4. 2025 Annual Work Trend Index — The Frontier Firm is Born** — Microsoft WorkLab — https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born — *23 Apr 2025*. 31,000 workers, 31 countries. 71% of Frontier Firm workers say company is thriving vs. 37% globally. 82% of leaders confident they'll use digital labour to expand workforce capacity in next 12-18 months. Workers interrupted every 2 minutes / 275 times a day.

**5. The Total Economic Impact of Microsoft 365 Copilot (Forrester TEI, MSFT-commissioned)** — Forrester — https://tei.forrester.com/go/microsoft/M365Copilot/ — *2024*. Composite organisation: 116% ROI over 3 years, $19.7M NPV. Employees saved ~9 hours/month on drafting emails, generating reports, summarising meetings. **Caveat for the slide: vendor-commissioned.**

**6. Vodafone customer story** — Microsoft Customer Stories — https://www.microsoft.com/en/customers/story/19346-vodafone-microsoft-365-copilot — *2024*. Rollout to 68,000 employees. 3 hrs/week/person average time saved in trial; legal department 4 hrs/week/person. 90% wanted to keep using Copilot. 60% said it improved their work quality. New contract drafting: ~1 hour faster.

## Theme 3 — The "wrong file" / oversharing trap

**7. Restricted SharePoint Search** — Microsoft Learn — https://learn.microsoft.com/en-us/sharepoint/restricted-sharepoint-search — *last updated 2026-02-24*. CRITICAL QUOTES: "Restricted SharePoint Search isn't a security boundary and doesn't change any permissions on SharePoint sites." Hard cap of 100 sites in allowed list, "not sustainable as your organization scales Copilot." Even when enabled, recently-accessed sites and Teams/Outlook-shared sites still appear in Copilot results. Microsoft positions it as "temporary measure."

**8. DSPM for AI — oversharing assessments** — Microsoft Learn — https://learn.microsoft.com/en-us/purview/data-security-posture-management-oversharing. Auto-runs "weekly data risk assessment for the top 100 SharePoint sites based on usage." Defines oversharing: "when an employee has access to information beyond what is necessary to do their jobs, often happening accidentally."

**9. Data, Privacy, and Security for M365 Copilot** — Microsoft Learn — https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy — *last updated 2026-05-18*. Canonical "what stays inside the tenant" source. Prompts/responses/Graph data "aren't used to train foundation LLMs." Uses Azure OpenAI services, not OpenAI public services. EU traffic stays within EU Data Boundary. Covered by GDPR, ISO 27001, ISO 42001, HIPAA. **Anthropic added as subprocessor 7 Jan 2026; Anthropic models "out of scope for the EU Data Boundary."**

## Theme 4 — GitHub Copilot for non-developers

**10. Copilot Spaces is GA** — GitHub Changelog — https://github.blog/changelog/2025-09-24-copilot-spaces-is-now-generally-available/ — *24 Sep 2025*. Curated bundles of files, PRs, issues, docs as grounding context. Available to all Copilot users on github.com, shareable across orgs, accessible in IDE via remote GitHub MCP server. The "make Copilot useful for non-dev knowledge work" capability.

**11. GitHub Copilot Agent Mode** — GitHub Newsroom — https://github.com/newsroom/press-releases/agent-mode — *2025*. Agent mode = Copilot "autonomously plans and executes multi-step coding tasks." Edits across files, runs terminal commands (npm install, pytest), reviews output, iterates. GA on VS Code + JetBrains by March 2026. For non-devs: "describe a spreadsheet/regex/data-wrangling job, watch it run."

## Theme 5 — ChatGPT Enterprise differentiators

**12. Introducing deep research** — OpenAI — https://openai.com/index/introducing-deep-research/ — *Feb 2025*. Powered by o3. "Synthesize a wide range of information and complete multistep research within five-to-30 minutes." Scored 26.6% on Humanity's Last Exam vs. ~9% for o1 / DeepSeek R1. Reports include citations + reasoning summary.

**13. ChatGPT Enterprise & Edu — Release Notes** — OpenAI Help Center — https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes — *continuously updated through 2026*. Feature surface: unlimited GPT-5.5 Instant, connectors, deep research, data analysis, canvas, projects, advanced voice, image gen, workspace agents (schedulable, runnable in ChatGPT or Slack). As of 10 Feb 2026: deep research can connect to any MCP/app and restrict web searches to trusted sites.

**14. Enterprise privacy at OpenAI** — OpenAI — https://openai.com/enterprise-privacy/. Doesn't train on business data. SOC 2 Type 2. ISO/IEC 27001:2022 + 27701:2019. AES-256 at rest, TLS 1.2+ in transit. Customers: Block, Canva, Carlyle, Estée Lauder, PwC, Zapier, Klarna.

## Theme 6 — Security boundaries

Covered by entries 7, 8, 9 (Microsoft) + 14 (OpenAI). **Critical delta:** M365 Copilot honours EU Data Boundary for EU users BUT Anthropic models inside M365 Copilot are "out of scope for the EU Data Boundary" (entry 9, May 2026). This is the slide-worthy compliance gotcha.

## Theme 7 — Compliance overlays

**15. EU AI Act Article 4 — AI literacy** — https://artificialintelligenceact.eu/article/4/ — *in application from 2 Feb 2025*. "Providers and deployers of AI systems shall take measures to ensure, to their best extent possible, a sufficient level of AI literacy of their staff." Applies to ANY organisation using AI in the EU. Article 99 penalties: up to €15M or 3% global turnover. National enforcement powers from 3 August 2026. **A course like this literally becomes a compliance asset.**

**16. EU AI Act Implementation Timeline** — https://artificialintelligenceact.eu/implementation-timeline/. GPAI provider obligations in application 2 Aug 2025. Commission enforcement powers for GPAI from 2 Aug 2026. GPAI models on market before 2 Aug 2025 have until 2 Aug 2027 for full compliance.

**17. NIST AI RMF — Generative AI Profile (NIST-AI-600-1)** — https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence — *26 Jul 2024*. 12 risks specific to generative systems (hallucination, data poisoning, prompt injection, IP, over-reliance, etc.) mapped to AI RMF's four functions (GOVERN/MAP/MEASURE/MANAGE) + 400+ mitigation actions.

**18. India DPDP Rules** — Lexology — https://www.lexology.com/library/detail.aspx?g=2073ac40-628f-4112-81f3-fffdfd4b8858 — *finalised Nov 2025*. Consent Manager Framework operational 13 Nov 2026. Full Data Fiduciary compliance deadline 13 May 2027. Any "AI system that receives, stores or generates personal data is covered by DPDP" — including chatbots, retrieval, vector stores, prompt logs.

## Theme 8 — Adoption & rollout reality

**19. McKinsey — The state of AI (Nov 2025)** — https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai — *Nov 2025*. 1,993 respondents, 105 nations. 88% of orgs use AI in at least one function (up from 78%). **Only 39% attribute any EBIT impact to AI**, most of those report <5% of EBIT attributable to AI. Only 6% are "high performers" capturing disproportionate value. 23% scaling agentic AI somewhere; another 39% experimenting. Agent use most common in IT and knowledge management.

**20. Australian whole-of-government Copilot trial** — DTA — https://www.digital.gov.au/initiatives/copilot-trial — *Oct 2024*. 1 Jan – 30 Jun 2024, ~7,600 staff, 60+ agencies. Time savings up to 1 hour on summarising/drafting/search. Tasks perceived 50–70% faster. 64% of managers saw uplift in team efficiency/quality. 40% reported reallocating time to higher-value activities. **Counter-stat: most focus group participants reported experiencing inaccuracies or hallucinations in Copilot outputs during the trial.**

**21. Australian Treasury Copilot trial** — https://evaluation.treasury.gov.au/publications/evaluation-generative-artificial-intelligence — *Feb 2025*. 218 staff, 14 weeks. An APS6 needs to save only 13 minutes/week to offset licence. One participant saved ~6 hours on a procurement review. **Caveat: value "for more complex work tasks was limited."** Worker attitudes toward AI actually soured after the trial (The Register).

**22. Klarna AI reversal arc** — Fortune — https://fortune.com/2024/12/12/klarna-stopped-all-hiring-replace-workers-with-ai/ + IPO prospectus Mar 2025. *Feb 2024:* AI assistant handled 2.3M conversations across 23 markets / 35 languages = ~700 FTE agents. Projected $40M profit. Headcount: 5,527 (end 2022) → 3,422 (end 2024). *2025:* CEO Sebastian Siemiatkowski publicly admitted cuts went too far, CSAT degraded on edge cases, hiring resumed. **"Replace humans with Copilot" backfire example.**

## Theme 9 — Cost / ROI (May 2026 pricing)

**23. M365 Copilot pricing** — https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/enterprise. $30/user/month, billed annually ($360/user/year), add-on to qualifying M365 base licence (E3 ~$36, E5 ~$57). Effective floor for E3 + Copilot: ~$66/user/month.

**24. GitHub Copilot pricing** — https://github.com/features/copilot/plans. Copilot Business $19/user/month. Copilot Enterprise $39/user/month. **From 1 Jun 2026: usage-based billing.** Source: https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/

**25. ChatGPT Enterprise pricing** — https://openai.com/business/chatgpt-pricing/. ChatGPT Business publicly listed. ChatGPT Enterprise no public price — negotiated through OpenAI sales, common range $45-$75/user/month, ~$60 typical, 150-seat minimum, annual contract. (Caveat: $60 widely reported by industry trackers, not OpenAI itself.)

## Theme 10 — "Copilot did something dumb" anecdotes

**26. Moffatt v. Air Canada** — Civil Resolution Tribunal of BC, Feb 2024. Coverage: AI Business — https://aibusiness.com/nlp/air-canada-held-responsible-for-chatbot-s-hallucinations + Pinsent Masons — https://www.pinsentmasons.com/out-law/news/air-canada-chatbot-case-highlights-ai-liability-risks. Chatbot fabricated bereavement-fare refund policy. Tribunal ordered $812.02 (refund + interest + fees). Tribunal explicitly rejected the "separate legal entity" argument; held the company liable for "negligent misrepresentations made by a chatbot on a publicly available commercial website."

**27. AI hallucinations in legal filings — sanction trend** — ABA Journal — https://www.abajournal.com/web/article/court-rejects-monetary-sanctions-for-ai-generated-fake-cases-citing-lawyers-tragic-personal-circumstances. **Over 700 court cases now involve AI-generated hallucinations.** March 2026: Sixth Circuit levied $30,000 in sanctions against two attorneys ($15,000 each) for briefs with fabricated citations. Colorado attorney: 90-day suspension after filing fabricated ChatGPT citations and lying about origin. ABA Journal names Microsoft Copilot, Google Gemini, Perplexity, and Claude Sonnet as tools that have produced fabricated cites surfacing in court.

---

## Chapter blueprint

### Chapter 1 — The Copilot mental model (~7 min)
**Spine:** Copilot ≠ chatbot ≠ agent. Three layers: chat-only assistant (ChatGPT free tier), grounded assistant (M365 Copilot — sees your stuff via Graph), agentic worker (Researcher/Analyst/Spaces/Agent Mode — multi-step task execution).
**Interactive:** 3-engine response panel — ask the same question of all three layers, show the same prompt produces wildly different answers.
**Citations:** 1, 2, 3, 10, 11, 12.

### Chapter 2 — When to use Copilot vs. do it yourself (~7 min)
**Spine:** The "time-to-decent-draft" test. If a decent first draft takes >3 minutes manually, Copilot wins. If <3 minutes, Copilot loses (the prompt + correction loop exceeds the do-it-yourself path). Three habits that lose: prompting for a one-line email, prompting for a number you could compute in your head, prompting for a tone you can't articulate.
**Interactive:** Time-to-decent-draft estimator — 6 tasks, learner picks "Copilot" or "Do it myself" with verdict reveal.
**Citations:** 5, 6, 20, 21.

### Chapter 3 — Office Copilot workflows (Word, Excel, Outlook, Teams) (~8 min)
**Spine:** One workflow per app. Word: "draft from this brief + these three sources." Excel: "Python in Excel for the chart we always make manually." Outlook: "summarise this thread + draft the reply." Teams: "what did I miss in the channel." Plus the recurring trap: Copilot picks the wrong file because of permission/path defaults.
**Interactive:** App-switcher — pick Word/Excel/Outlook/Teams, see workflow + the trap.
**Citations:** 2, 3, 6, 7, 8.

### Chapter 4 — GitHub Copilot for non-developers (~7 min)
**Spine:** Spreadsheets, regex, scripts, data wrangling. Where it surprisingly helps a non-dev (one-shot SQL queries, regex from natural language, "explain this formula"). Where you need a developer in the loop (anything that touches production data, anything that runs on a schedule).
**Interactive:** "Can GitHub Copilot do this for me?" sorter — 6 tasks, learner classifies as Copilot-able or needs-a-dev.
**Citations:** 10, 11.

### Chapter 5 — ChatGPT Enterprise edge cases (~7 min)
**Spine:** Three things ChatGPT Enterprise does that M365 Copilot can't (yet) — deep research (multi-step web research with citations), Operator-style agents (browse, fill forms, take actions), Canvas (collaborative editing inside the AI surface). When to spin up which tool when you have both.
**Interactive:** Decision matrix — 8 scenarios, learner picks M365 Copilot, GitHub Copilot, or ChatGPT Enterprise.
**Citations:** 12, 13, 14.

### Chapter 6 — Security and data-exposure boundaries (~7 min)
**Spine:** The Restricted SharePoint Search story — Microsoft's own docs admit it's "not a security boundary." Three real boundaries: tenant boundary (Graph, EU Data Boundary), training-data boundary (Microsoft + OpenAI both promise no training on your data), oversharing boundary (Purview DSPM for AI). Plus the EU Data Boundary gotcha: Anthropic models in M365 Copilot are out of scope.
**Interactive:** Data-exposure sorter — 6 example scenarios, classify as Safe / Risk / Block.
**Citations:** 7, 8, 9, 14, 15, 17, 18.

### Chapter 7 — Making it stick: your Copilot operating manual (~7 min)
**Spine:** Pick your 5 always-use tasks. Pick your 3 never-use boundaries. Pick the one weekly habit (Friday review). Generate the 1-page operating manual — downloadable, printable.
**Interactive:** Operating-manual builder — picks across role/tool/tasks, generates markdown.
**Citations:** 4, 5, 6, 19, 26, 27.

---

## Negative list — what NOT to do in this course

- **No "5 tips for better prompts"** — that's Course 1 (AI Literacy) territory.
- **No "let's compare M365 Copilot to Google Gemini"** — out of audience scope.
- **No "build a custom GPT" tutorial** — that's a separate Foundations course on agents.
- **No vendor-neutral hedging** — this is a Microsoft-stack-leaning course. Name the tools, name the limits, give the gotchas. Audience already has the licences.
- **No "AI will replace you" / "AI won't replace you" framing** — the Klarna anecdote is for "watch the reversal," not for fortune-telling.
- **No "capstone" language anywhere** — Chapter 7 is "Making it stick" per project-academy-rebuild-plan.
