# Research dossier — AI Literacy for Non-Technical Teams

> Per-course research, numbers, named incidents, and chapter blueprint.
> Standards live in `docs/academy/build-plan.md`. This file is the *content*.
>
> **Course slug:** `ai-literacy-non-technical-teams`
> **Track:** Foundations · **Level:** Foundational · **Duration:** ~40 min
> **Chapters:** 6 · **Audience:** non-technical ICs and managers (HR,
> Marketing, Sales, Ops)

---

## 1. Citations bank

Numbered for reuse — chapter prose cites `[N]`.

### Adoption & behaviour

**[1] Microsoft Work Trend Index 2025 — *"The year the Frontier Firm is born"***
Survey of 31,000 workers across 31 countries (1,000 per market) + 4,500 U.S.
respondents. Fielded Feb 6 – Mar 24 2025.
Key splits used in this course:
- Leaders 69% regular AI use vs ICs 45%.
- Leaders 67% agent familiarity vs ICs 40%.
- Frontier Firms — Marketing 73% (vs 55% globally), Customer Success 66% (vs
  44%), Internal Comms 68% (vs 46%), Data Science 72% (vs 54%).
No India/GCC/SEA breakouts in the public report.
URL: https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born

**[2] Anthropic Economic Index — March 2026 report ("Learning curves")**
Sample: 1 million conversations, Feb 5–12 2026, Claude.ai + first-party API.
Key findings used in this course:
- High-tenure users show **+10% higher success rate** after controlling for
  task type, country, language — i.e. users genuinely improve through
  practice rather than just self-selecting easier tasks.
- Top-10 tasks fell from 24% of traffic (Nov 2025) to 19% (Feb 2026) — usage
  is diversifying.
URL: https://www.anthropic.com/research/economic-index-march-2026-report

**[3] Copilot drop-off — industry analyses, 2026**
- **44.2% of lapsed Copilot users cited "distrust of answers"** as the
  primary reason they stopped using it.
- Gartner: only 24% of pilots expand beyond 20% of workers; 71% cite
  governance worries.
- Among workers with *both* Copilot and ChatGPT, Copilot's adoption falls to
  18% vs ChatGPT's 76%.
URLs:
- https://www.stackmatix.com/blog/copilot-market-adoption-trends
- https://www.reconanalytics.com/ai-choice-2026-why-licenses-dont-equal-adoption/
Verification status: secondary aggregators citing Gartner/SimilarWeb data.
Acceptable for a foundational course; if user requests primary, replace with
the Gartner press release directly.

**[4] EY-NASSCOM AI Adoption Index + EY GCC Pulse Survey 2025**
- 83% of Indian GCCs scaling GenAI projects.
- 81% upskilling internal teams on GenAI.
- Demand for GenAI specialists +300% vs 2024.
- 90% reported shortage in GenAI-ready talent.
URLs:
- https://www.nasscom.in/knowledge-center/publications/nasscom-ai-adoption-index
- https://zinnov.com/centers-of-excellence/zinnov-nasscom-india-gcc-landscape-2026-report/

*Note (per user decision):* this course uses a region-neutral trainer voice,
so [4] is held in the dossier but not spoken aloud. Available for any
region-specific variant.

### Risk & regulation

**[5] Moffatt v. Air Canada, 2024 BCCRT 149**
BC Civil Resolution Tribunal, decision Feb 14 2024 by tribunal member
Christopher C. Rivers.
- The Air Canada website chatbot told Mr. Moffatt he could *retroactively*
  claim bereavement-fare refunds after travel; a separate Air Canada page
  said the opposite.
- Air Canada argued the chatbot was a *"separate legal entity"* and they
  couldn't be liable for its statements.
- Tribunal rejected this: *"While a chatbot has an interactive component, it
  is still just a part of Air Canada's website."*
- **Damages: CAD $812.02 total** — CAD $650.88 fare difference + CAD $36.14
  pre-judgment interest + CAD $125 tribunal fees.
URL summary: https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-february/bc-tribunal-confirms-companies-remain-liable-information-provided-ai-chatbot/
Press: https://www.washingtonpost.com/travel/2024/02/18/air-canada-airline-chatbot-ruling/

**[6] EEOC v. iTutorGroup**
Consent decree filed Aug 9 2023, E.D.N.Y. First EEOC AI-bias enforcement case.
- iTutor's recruitment software auto-rejected female applicants 55+ and male
  applicants 60+.
- Over 200 qualified U.S. applicants rejected because of age in early 2020.
- **Settlement: USD $365,000** + consent-decree obligations (anti-discrimination
  policies, training, reapplication invitation to rejected applicants,
  written notice of complaints to EEOC, ceasing to collect applicant
  birthdates).
URL: https://www.eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit

**[7] NYC Local Law 144 — Automated Employment Decision Tools (AEDT)**
Effective July 5 2023.
- Requires: independent annual bias audit, public posting of summary results
  on employer site, 10 business days' notice to candidates.
- Penalties: $500 first violation, up to $1,500/day continuing violations.
- December 2025 NY State Comptroller audit found enforcement "ineffective" —
  stricter 2026 phase expected.
URLs:
- https://rules.cityofnewyork.us/rule/automated-employment-decision-tools-updated/
- https://www.osc.ny.gov/state-agencies/audits/2025/12/02/enforcement-local-law-144-automated-employment-decision-tools

**[8] EU AI Act — Article 4 (AI Literacy obligation)**
Verbatim text:
> *"Providers and deployers of AI systems shall take measures to ensure, to
> their best extent, a sufficient level of AI literacy of their staff and
> other persons dealing with the operation and use of AI systems on their
> behalf."*
- **Applicable from 2 February 2025.**
- Enforcement by national market surveillance authorities **from 3 August 2026**.
- Considers: technical knowledge, experience, education, training, context of
  AI system use, targeted users.
URLs:
- https://artificialintelligenceact.eu/article/4/
- https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers

**[9] NIST AI RMF — Generative AI Profile (NIST AI 600-1)**
Published 26 July 2024. Defines 12 risk categories specific to generative AI
(hallucination, data leakage, harmful bias, CBRN information, dangerous
content, mis/disinformation, information integrity, IP, obscene content,
privacy, value chain, environmental impact). 200+ suggested actions.
URL: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence

**[10] Microsoft 365 Copilot — data handling (verbatim)**
> *"Prompts, responses, and data accessed through Microsoft Graph aren't
> used to train foundation LLMs, including those used by Microsoft 365
> Copilot."*
GDPR + EU Data Boundary compliant. Feedback also not used for training.
URL: https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy

**[11] OpenAI ChatGPT — free-tier default and opt-out**
- Free, Plus, and Pro personal accounts: training opt-in is **on by default**.
- Toggle path: Profile → Settings → Data Controls → "Improve the model for
  everyone" → off.
- Forward-looking only; data already used in completed training runs cannot
  be reversed.
URL: https://help.openai.com/en/articles/8983082-how-do-i-turn-off-model-training-to-stop-openai-training-models-on-my-conversations

**[12] Samsung 2023 — the named "don't paste this" incident**
- April 2023: within 20 days of allowing ChatGPT access, three separate
  leaks. Engineer pasted proprietary source code while debugging. Another
  pasted a full confidential meeting transcript for summarization. Third
  pasted yield-test sequences for chip defects.
- Samsung banned generative AI on company devices May 2 2023.
- JPMorgan, Verizon, Apple, Amazon followed with restrictions.
URL: https://www.cnbc.com/2023/05/02/samsung-bans-use-of-ai-like-chatgpt-for-staff-after-misuse-of-chatbot.html

### Prompting craft

**[13] OpenAI — six strategies for prompt engineering**
(1) Write clear instructions. (2) Provide reference text. (3) Split complex
tasks into subtasks. (4) Give the model time to "think" (chain-of-thought).
(5) Use external tools. (6) Test systematically.
URL: https://developers.openai.com/api/docs/guides/prompt-engineering

**[14] Microsoft Copilot — four-part prompt structure: Goal · Context · Source · Expectations**
This is the framework actually taught in Chapter 2 because it's what most
learners' employers will point them at.
Example verbatim from Microsoft Support:
> *"Draft an outline of a training manual about time management. Our
> audience is professionals who work in a hybrid environment and constantly
> need to attend virtual meetings and meet deadlines. The tone of the
> document will be friendly and suggestive."*
URL: https://support.microsoft.com/en-us/topic/learn-about-copilot-prompts-f6c3b467-f07c-4db1-ae54-ffac96184dd5

**[15] Anthropic — structured-prompt guidance**
XML tags (`<instructions>`, `<document>`, `<example>`) separate sections.
3–5 examples recommended for in-context learning. System prompt should
specify role + task + output format + constraints.
URL: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices

### Function-specific case material

**[16] Marketing — Adore Me (Writer customer story)**
DTC lingerie brand, built on Writer's AI Studio:
- Product description writing: **20 hours → 20 minutes per batch**.
- **+40% non-branded SEO traffic** (the AI was constrained to enforce
  specific search terms like *"bra and panty set"*).
- Stylist note writing time **−36%**.
- Localized launch time: months → **10 days**.
URL: https://writer.com/blog/adore-me-customer-story/

**[17] Sales — generative-AI cold-outreach lift**
- AI-personalised cold-email: **~28% average response-rate lift**.
- Effective adopters report **10–25% pipeline lift**.
- 54% of sales teams now use AI for outbound email drafting.
- AI SDR market: USD $4.12B (2025) → $15.01B (2030), 29.5% CAGR
  (MarketsandMarkets via BusinessWire).
URLs:
- https://www.cirrusinsight.com/blog/ai-in-sales
- https://www.businesswire.com/news/home/20251014977982/en/AI-Sales-Development-Representative-SDR-Market-Global-Research-Report-2025---ResearchAndMarkets.com

**[18] HR — exit-interview analysis (multi-source case)**
Multinational retailer, 5,000 employees: exit data split across Workday
forms, PDF notes, and a legacy survey tool. AI sentiment + topic modeling
surfaced that *"workload and scheduling issues"* were concentrated in junior
staff in two specific regions — a finding invisible to manual review.
Academic basis: 18-month study with SAP SuccessFactors data showing higher
accuracy than manual reviews in detecting dissatisfaction themes.
URLs:
- https://sprad.io/blog/ai-exit-interview-analysis-50-interviews-3-minutes-real-patterns-per-department
- https://www.researchgate.net/publication/392760583_Reframing_Organizational_Intelligence_An_AI-Based_Interpretation_Framework_for_Exit_Interview_Data_in_SAP_Success_Factors

**[19] Ops — invoice & procurement automation**
- Food processing manufacturer: invoice cycle **12 days → 2 days**, **−70%
  processing cost**.
- Automotive components manufacturer: AI spend analysis revealed 23% of
  suppliers were divisions of just 8 parent organizations; consolidation cut
  spend **−18%**.
- Industry baselines: 70–80% manual data entry eliminated, 85–90%
  straight-through processing on standard invoices.
URL: https://www.agilesoftlabs.com/blog/2026/01/how-ai-is-transforming-manufacturing

---

## 2. Numbers I'll actually use on slides

| Stat | Chapter | Citation |
|---|---|---|
| Only 24% of Copilot pilots expand past 20% of workers | Ch 1 hook | [3] |
| 44.2% of lapsed Copilot users quit due to distrust of answers | Ch 6 signature moment | [3] |
| High-tenure users +10% success rate (after controls) | Ch 5/6 anchor | [2] |
| EU AI Act Art. 4 — applicable 2 Feb 2025; enforcement 3 Aug 2026 | Ch 4 | [8] |
| NYC AEDT penalties: $500 / $1,500/day | Ch 4 | [7] |
| iTutorGroup: $365,000, 200+ rejected, age 55+/60+ | Ch 4 | [6] |
| Air Canada ordered to pay CAD $812.02 total | Ch 4 opener | [5] |
| M365 Copilot: prompts NOT used for foundation-model training | Ch 4 | [10] |
| ChatGPT Free/Plus/Pro: training-on by default; toggle path | Ch 4 | [11] |
| 28% cold-email response lift; 10–25% pipeline lift | Ch 3 Sales lane | [17] |
| Adore Me: 20 hours → 20 minutes; +40% non-branded SEO | Ch 3 Marketing lane | [16] |
| Exit-interview AI: junior-staff regional pattern surfacing | Ch 3 HR lane | [18] |
| Invoice cycle 12 → 2 days, −70% cost; supplier consolidation −18% | Ch 3 Ops lane | [19] |
| Leaders 69% regular AI use vs ICs 45% | Ch 1 audience anchor | [1] |

---

## 3. Named incidents — story-ready

### 3.1 Air Canada chatbot — Ch 4 opener
> Picture this. You're a passenger. Your grandmother just died. You ask the
> airline's chatbot if there's a bereavement discount. The chatbot says
> yes — book the flight, claim it after. So you do. Then Air Canada refuses
> the refund.
>
> You sue. And Air Canada's defence — this is real, this is in the tribunal
> ruling — is that the chatbot is a *separate legal entity*. So Air Canada
> can't be liable for what the chatbot said.
>
> The tribunal's answer, word for word: *"While a chatbot has an interactive
> component, it is still just a part of Air Canada's website."*
>
> Air Canada lost. They were ordered to pay $812.02 Canadian. Eight hundred
> dollars. That's the headline. But $812 isn't the story. The story is the
> precedent: anything your company's AI says, your company said. There is
> no "it was the chatbot's fault." That defence is done.
> *— [5]*

### 3.2 iTutorGroup — Ch 4 middle
> Here's another one. 2020. A tutoring company called iTutorGroup sets up
> recruitment software. The software is programmed to auto-reject women
> over 55 and men over 60. Just — gone, before a human ever sees the
> application. Over 200 qualified people, screened out by a rule someone
> set.
>
> The EEOC sued in 2022. iTutor paid $365,000 in 2023. That's the first AI
> bias case the EEOC has ever filed, and it cost real money.
>
> The thing to notice isn't that the software was biased. Software does
> what it's told. The thing to notice is that *someone configured that
> filter*, and when the lawyers showed up, pointing at the AI didn't help.
> The accountability follows whoever set the rule. Always.
> *— [6]*

### 3.3 Samsung — Ch 4 paste-or-don't activity opener
> Three weeks. That's how long Samsung let its engineers use ChatGPT before
> three separate leaks happened. One engineer pasted source code, asking
> for help debugging it. One pasted a full confidential meeting transcript
> so ChatGPT could summarize it. One pasted yield-test sequences for chip
> defects.
>
> Three weeks. Samsung banned the tool company-wide. Apple followed.
> JPMorgan, Verizon, Amazon — they all put restrictions in within months.
>
> So when I tell you what not to paste — these aren't hypotheticals. These
> are the things that already cost a major company its leverage in three
> weeks flat.
> *— [12]*

---

## 4. The negative list — claims deliberately not made

| Claim | Why it's out | Replacement |
|---|---|---|
| "AI will free up your time" | Net evidence is mixed; lapsed-user data [3] suggests reshuffles, not savings | "AI moves work around. Sometimes it removes some; mostly it changes what you spend time on." |
| "Be specific in your prompt" *(standalone)* | Useless without structure | Goal · Context · Source · Expectations [14] |
| "AI is like having an intern" | Patronizing; interns learn over time, the model doesn't | "Treat AI like a fast, confident colleague who hasn't read your situation yet — your job is to give them the brief." |
| "Just play around with it" | Contradicts the 44.2% drop-off [3] | "Pick a real task. Run a structured prompt. Save what worked. That's the loop." |
| "AI is moving so fast it's hard to keep up" | Lazy teaching | Name what's stable: Goal/Context/Source/Expectations is the same in 2024 and 2026. |
| Generic *"AI can be biased"* | Vague | Air Canada [5], iTutorGroup [6] — named incidents only |
| "X% of jobs will be automated" | Not credible at the function level | Anthropic Economic Index *tasks-within-jobs* framing [2] |
| "Just turn off training in settings and you're safe" | Too sweeping | Specific path [11] + what data still gets logged |

---

## 5. Open questions — *all resolved*

| Q | User decision |
|---|---|
| Air Canada $ figure — drop or include? | **Include.** CAD $812.02 verified from secondary sources citing the BCCRT ruling. |
| Wrike figure — keep with verification or replace? | **Replaced** with Adore Me (Writer customer story, primary-source). |
| Regional voice — explicit (India/GCC/SEA) or implicit? | **No regional voice.** Trainer is region-neutral. |

---

## 6. Chapter blueprint

Six chapters. Each chapter gets its own teaching arc, signature moment,
interactive, and Monday moment. Chapter 6 is *renamed* from "Capstone" to
"Making it stick at your desk — week one" per the build plan's no-capstone
rule.

### Chapter 1 — Demystifying AI · 7 min
- **Teaching arc:** Contrast-led. Open with three things the audience
  already uses: Gmail spell-check (rules), Gmail Smart Reply (ML), Gemini's
  "help me write" (GenAI). The chapter is built off that one comparison.
- **Signature moment:** A 30-second "guess which one" — three short clips
  of AI behavior; audience commits to rules / ML / GenAI before the trainer
  reveals.
- **Interactive:** Three-engine response panel. Type a sentence, see three
  engines respond differently (precomputed responses; no live API).
- **Monday moment:** *"Go back to a tool you already use — Outlook,
  LinkedIn, Excel — and find the AI feature. It's there. You've been using
  AI for two years; you just didn't have the vocabulary."*

### Chapter 2 — Prompting as a learnable skill · 7 min
- **Teaching arc:** Demo-led. Trainer shows their own bad prompt first,
  watches it fail, refines it on screen. The chapter is one prompt being
  refined four times. The Goal · Context · Source · Expectations [14]
  framework doesn't appear until minute 5, after the audience has *felt*
  what each fix did.
- **Signature moment:** The framework reveal as the trainer's
  *diagnosis* — *"see, I never told it who I was. Watch."*
- **Interactive:** Prompt-diff panel. Left side vague prompt, right side
  refined; hover any addition to see how the response changes.
- **Monday moment:** *"Find one email you wrote last week that took you
  longer than five minutes. Re-do it with this pattern. Compare. That's
  your first data point."*

### Chapter 3 — Where AI actually helps you (by function) · 7 min
- **Teaching arc:** Tool-led, branched. Visually splits into four lanes —
  HR, Marketing, Sales, Ops. Trainer walks one lane fully end-to-end (the
  one chosen by the learner), then shows the other three briefly.
- **Signature moment:** Each function has one *uncomfortable* concrete
  example. HR: exit-interview analysis [18] — *"you can summarize 200
  exit-interview transcripts into themes in twelve minutes. That used to
  be a person's quarter."* Marketing: Adore Me [16]. Sales: 28% response
  lift [17]. Ops: invoice cycle 12 → 2 days [19].
- **Interactive:** Function lane switcher — four tabs, JS state,
  deep-linkable. Each lane shows the function's three highest-leverage AI
  tasks with the *exact prompt* and *expected output*.
- **Monday moment:** *"Pick the one task on your function's list that you
  have on your calendar this week. Run it. Not three — one."*

### Chapter 4 — The risks you should know · 6 min
- **Teaching arc:** Incident-led. Open with Air Canada [5] in 90 seconds —
  real ruling, real money. Then iTutorGroup [6]. Then Samsung [12]. Then
  come back to *"and here's what that means for you, sitting at your desk
  on a Tuesday."*
- **Signature moment:** A red-line list of *exactly* what not to paste,
  with the principle behind each. Customer PII. Salary data. Anything
  NDA-covered. A board pack before the board has seen it. A draft PIP.
- **Interactive:** "Would you paste this?" sorter. Six snippets, drag into
  Safe / Not safe column. Reveals the trainer's verdict + why. Forces the
  audience to commit before the answer.
- **Monday moment:** *"Find your company's AI use policy. If you can't
  find it in five minutes, that's your action — ask your manager where it
  lives. Not 'should we use AI', just 'where's the policy'."*

### Chapter 5 — Ten prompts to try this week · 7 min
- **Teaching arc:** Library-led. The chapter *is* the prompt library —
  visually formatted like a recipe book. Ten prompts the trainer has
  personally tested, with the function each fits, the expected output, and
  the trap.
- **Signature moment:** Each prompt has a "what made this work"
  annotation — the one specific phrase or constraint that turns a 6/10
  output into a 9/10.
- **Interactive:** Copyable-prompt grid. Click any of the 10 → expand with
  the full prompt, sample input, sample output, copy-to-clipboard button.
  Trainer narrates over the top three (one per function); the rest the
  learner browses.
- **Monday moment:** *"Pick three. Not ten. Three. Run them this week,
  keep the ones that work, throw the rest away. By Friday you'll have
  your own version of three of these."*

### Chapter 6 — Making it stick at your desk: week one · 6 min
- **Teaching arc:** Implementation-cadence. The trainer talks about *the
  calendar*, not "what you've learned". Monday, Tuesday, Wednesday — what
  to do, what to expect, what failure looks like and how to recover.
- **Signature moment:** *"The week-one trap"* — citing [3] directly.
  *"Forty-four percent of people who try this tool quit because they
  didn't trust the answer. That's not because the tool is bad. That's
  because the first three prompts you write this week are going to be
  bad. That's not a you problem; that's a calibration problem. Everyone
  goes through it."* This is the moment that separates this course from
  every other AI primer.
- **Interactive:** Printable / downloadable one-page "week one plan" —
  pre-filled per function, customizable.
- **Monday moment:** This chapter *is* the Monday moment. Ends with
  *"okay — close this and go open Copilot."*

---

## 7. Source-to-chapter map

| Citation | Ch 1 | Ch 2 | Ch 3 | Ch 4 | Ch 5 | Ch 6 |
|---|---|---|---|---|---|---|
| [1] Microsoft Work Trend Index 2025 | ● | | | | | |
| [2] Anthropic Economic Index Mar 2026 | | | | | ● | ● |
| [3] Copilot drop-off data | ● | | | | | ● |
| [4] EY-NASSCOM (held, not spoken) | | | | | | |
| [5] Air Canada chatbot ruling | | | | ● | | |
| [6] EEOC v. iTutorGroup | | | | ● | | |
| [7] NYC Local Law 144 | | | | ● | | |
| [8] EU AI Act Article 4 | | | | ● | | |
| [9] NIST AI 600-1 | | | | ● | | |
| [10] M365 Copilot data handling | | | | ● | | |
| [11] ChatGPT free-tier opt-out | | | | ● | | |
| [12] Samsung 2023 leak | | | | ● | | |
| [13] OpenAI six strategies | | ● | | | ● | |
| [14] Microsoft Goal/Context/Source/Expectations | | ● | | | ● | |
| [15] Anthropic structured prompts | | ● | | | ● | |
| [16] Adore Me (Marketing) | | | ● | | | |
| [17] Sales lift figures | | | ● | | | |
| [18] HR exit-interview case | | | ● | | | |
| [19] Ops invoice/procurement | | | ● | | | |

---

## 8. Visual + audio setup

- **Theme palette:** Foundations track — slate + warm coral. To declare in
  `src/config/courses.ts` under `theme` before Chapter 1 build.
- **Audio:** one continuous MP3 per chapter + `cues.json` timestamp map (see
  build plan §6).
- **Trainer persona:** 12-year practitioner who has deployed AI into
  non-technical teams across HR, Sales, Ops at real companies. Dry.
  Self-deprecating about her own early prompts. Uses *we* for common
  mistakes; *you* for handing over agency. **Region-neutral** (per user
  decision).
