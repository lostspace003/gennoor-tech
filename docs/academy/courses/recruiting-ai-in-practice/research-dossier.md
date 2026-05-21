# Research Dossier — Recruiting AI in Practice

**Course:** Recruiting AI in Practice (Function track — HR)
**Audience:** Recruiters, TA leaders, HR ops · past basic AI literacy
**Duration:** ~55 min · 8 chapters
**Voice:** Emma (alternation rule — Course 1 Emma, 2 Andrew, 3 Emma, 4 Andrew, 5 Emma)
**Build date:** May 2026

---

## Theme 1 — Sourcing automation in 2025-2026

**1. LinkedIn Hiring Assistant** — LinkedIn Talent Solutions — https://business.linkedin.com/hire/hiring-assistant — *live 2026*. LinkedIn's first AI agent went GA end-Sept 2025. Customers save **4+ hours per user per role**. **66% higher InMail acceptance** with Hiring Assistant vs. traditional sourcing; AI-Assisted Messages drive **55% higher InMail acceptance**. Feb 2026 update added MS Teams collaboration, AI Follow-Ups, AI Applicant Targeting, Verified Applicant Spotlight.

**2. Aptitude Research — Top 10 TA Tech 2025** — https://www.aptituderesearch.com/top-10-ta-tech-announcements-of-2025/. 2025 vendor moves: **hireEZ EZ Agent** (autonomous sourcing/engagement/pipeline), **Findem acquired Getro** + Intelligent Job Post agents, **Eightfold repositioning to "agentic intelligence"**. The TA stack shift: recruiter-driven → agent-augmented → agent-operated.

**3. LinkedIn Engineering — How we engineered Hiring Assistant** — https://www.linkedin.com/blog/engineering/ai/how-we-engineered-linkedins-hiring-assistant. First-party architectural account — multi-step search planning, candidate evaluation, feedback loops on real recruiter behaviour. Useful for explaining intent-based sourcing.

## Theme 2 — The AI-spam outreach problem

**4. Salesmotion — LinkedIn Outreach 2026** — https://salesmotion.io/blog/linkedin-outreach-relevance-beats-volume — *2026*. LinkedIn capped Open InMail sends to **under 100 per month in late 2025**, down from ~800 — an **87% drop in outbound capacity overnight**. Direct platform-level signal that AI-spam outreach is throttled at the network layer. **Caveat:** industry-reported, not official LinkedIn announcement.

**5. Litemail — GDPR Legitimate Interest 2026** — https://litemail.ai/blog/gdpr-legitimate-interest-cold-email-2026. **Oct 2024 CJEU ruling + new EDPB guidelines raised the documentation bar** for Art. 6(1)(f) legitimate interest. EU candidate outreach requires documented LIA + opt-out honour within 24-48 hours. GCC/India recruiters emailing EU candidates inherit GDPR obligations.

**6. Sales Force Europe — Legitimate Interest B2B** — https://salesforceeurope.com/blog/what-is-legitimate-interest-for-gdpr-cold-email-b2b-rules. B2B outreach to professional addresses has lower threshold than B2C under Art. 6(1)(f) — but LIA must be in writing and recipient's reasonable expectations matter.

## Theme 3 — Resume-screening bias 2024-2026

**7. Bloomberg — OpenAI GPT Sorts Resume Names with Racial Bias** — https://www.bloomberg.com/graphics/2024-openai-gpt-hiring-racial-discrimination/ — *Mar 8, 2024*. Identical resumes, demographically-distinctive names, 1,000 trials per role. **If unbiased, each of 8 demographic groups would top-rank 12.5% of time.** Black women top-ranked **only 11%** for software engineering — **36% less** than best-performing group. Asian women top-ranked 17.2% — highest. Methodology + data on GitHub.

**8. Bloomberg GitHub data repo** — https://github.com/BloombergGraphics/2024-openai-gpt-hiring-racial-discrimination. Reproducible dataset + code. The methodology primary source.

**9. Wilson & Caliskan — Gender, Race, Intersectional Bias in Resume Screening** — arXiv 2407.20371 — AIES 2024 (peer-reviewed). 550+ job descriptions × 550+ resumes × 80 name augmentations. **Massive Text Embedding models favoured White-associated names in 85.1% of cases**, female-associated names in only 11.1%. Black men were the most disadvantaged group intersectionally.

## Theme 4 — The four bias mitigations · blind data / calibrated thresholds / audit logs / human override

**No single source names all four together.** Three primary sources cover the components:

**10. NIST AI 600-1 — Generative AI Profile** — https://www.nist.gov/itl/ai-risk-management-framework — *Jul 26, 2024*. Names **"Harmful Bias and Homogenization"** as one of 12 risks. 200+ suggested actions across Govern/Map/Measure/Manage. Govern = audit-log retention; Measure + Manage = calibrated thresholds + monitoring.

**11. EEOC Select Issues TA 2023** — https://data.aclum.org/storage/2025/01/EOCC_www_eeoc_gov_laws_guidance_select-issues-assessing-adverse-impact-software-algorithms-and-artificial.pdf — *May 18, 2023*. **Four-fifths rule** as rule of thumb but "merely a rule of thumb" — statistically significant differences can still constitute adverse impact. Employer remedies: **discontinue, replace, or modify** using "comparably effective alternative algorithms" → human override + calibrated thresholds.

**12. Uniform Guidelines on Employee Selection Procedures · 29 CFR Part 1607** — https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XIV/part-1607 — *1978, current*. Establishes selection rate + **80% / four-fifths rule** as EEOC adverse-impact screen.

## Theme 5 — EEOC enforcement

**13. EEOC v. iTutorGroup — settlement** — https://www.eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit — *Aug 9, 2023*. First EEOC AI-discrimination settlement. Auto-rejected **female applicants 55+ and male applicants 60+** — 200+ qualified US applicants. **$365,000** + 5-year EEOC monitoring + injunction against asking applicant birth dates.

**14. ABA Business Lawyer — EEOC & States algorithmic bias** — https://www.americanbar.org/groups/business_law/resources/business-lawyer/2024-2025-winter/eeoc-states-regulation-algorithmic-bias-high-risk/ — *Winter 2024-2025*. Post-iTutor landscape survey. **Honest caveat:** as of May 2026, no major second EEOC AI-hiring settlement; action shifted to private class actions (Mobley) and state regulators.

## Theme 6 — Mobley v. Workday

**15. Mobley v. Workday — Civil Rights Litigation Clearinghouse** — https://clearinghouse.net/case/44074/. Filed Feb 21, 2023. **Workday represented in court that ~1.1 billion applications were rejected** through its tools during the relevant window — conditional collective could include hundreds of millions.

**16. Holland & Knight — Workday collective certification** — https://www.hklaw.com/en/insights/publications/2025/05/federal-court-allows-collective-action-lawsuit-over-alleged — *May 2025*. **May 16, 2025: Judge Rita F. Lin granted preliminary ADEA collective certification** — class is "all individuals 40+ who applied via Workday from Sept 24, 2020 onward and were denied." Workday potentially liable **as an "agent"** of employers. *The vendor-as-agent doctrine exposing every HR-tech vendor.*

**17. AI Governance for HR — Mobley v. Workday 2026 status** — https://www.aigovernanceforhr.com/p/the-mobley-v-workday-case-didnt-end — *2026*. **March 6, 2026** ruling rejected Workday's argument ADEA doesn't cover applicants. **Feb 17, 2026** authorised formal collective notice with **March 7, 2026 opt-in deadline**. Plaintiffs filed amended complaint March 30, 2026 reasserting CA state + disability claims. Case in discovery.

## Theme 7 — EU AI Act high-risk employment

**18. EU AI Act Annex III** — https://artificialintelligenceact.eu/annex/3/ — *Reg. (EU) 2024/1689 in force Aug 1, 2024*. **Annex III §4(a)** explicitly lists as high-risk: *"AI systems intended to be used for the recruitment or selection of natural persons, in particular to place targeted job advertisements, to analyse and filter job applications, and to evaluate candidates."* Every ATS-screening / sourcing AI = high-risk in EU.

**19. EU AI Act Article 26 — Deployer obligations** — https://artificialintelligenceact.eu/article/26/ — *in application Aug 2, 2026 for Annex III*. Deployers (hiring employer, not just vendor) must: use per provider instructions, **assign human oversight to competent natural persons**, **retain auto-generated logs ≥6 months**, monitor operation, **inform workers' representatives + affected workers** before deploying. Converts "we use Workday" into a legal obligation set.

**20. EU AI Act Article 99 — Penalties** — https://artificialintelligenceact.eu/article/99/. **Prohibited (Art. 5): up to €35M or 7% global turnover.** **High-risk non-compliance incl. Art. 26 deployer breaches: up to €15M or 3% global turnover.** Misleading info to authorities: up to €7.5M or 1%. Hiring AI sits in €15M / 3% band.

## Theme 8 — Interview AI

**21. SHRM — HireVue discontinues facial analysis** — https://www.shrm.org/topics-tools/news/talent-acquisition/hirevue-discontinues-facial-analysis-screening — *2021*. HireVue discontinued facial analysis Jan 2021 after FTC complaints + academic criticism. Vendor concession: facial cues did not add predictive validity over language analysis. Foundational "AI interview" cautionary artefact.

**22. Sackett, Zhang, Berry & Lievens (2022) — Revisiting Meta-Analytic Estimates** — Journal of Applied Psychology — https://gwern.net/doc/iq/ses/2023-sackett.pdf + SIOP summary https://www.siop.org/tip-article/is-cognitive-ability-the-best-predictor-of-job-performance-new-research-says-its-time-to-think-again/ — *2022*. Modern update to Schmidt & Hunter (1998). **Structured interviews emerged as the strongest single predictor of job performance (mean operational validity r ≈ .42)** — higher than cognitive-ability tests. The empirical case for AI's value being in *enforcing structured interview discipline*, not generating chat questions.

## Theme 9 — Candidate experience data

**23. Talent Board CandE 2024 Benchmark (via ERE)** — https://www.ere.net/articles/12-key-takeaways-from-the-2024-candidate-experience-benchmark-research — *2025*. **Candidate resentment hit all-time high in 2024.** **29% of NA candidates** reported not hearing back 1-2+ months after applying. **48% of rejected candidates unhappy** with feedback; only 33% positive. Tech and Finance/Insurance: **25% resentment** vs. 14% average. Primary benchmark for the industry.

## Theme 10 — Workforce planning AI

**24. Deloitte — Reinventing workforce planning** — https://www.deloitte.com/us/en/insights/topics/talent/future-of-workforce-planning/reinventing-workforce-planning.html — *2024-2025*. Traditional annual workforce planning broken in AI-disrupted labour market. Framework for scenario-planning use cases.

**25. McKinsey — Strategic workforce planning in age of AI** — https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/the-critical-role-of-strategic-workforce-planning-in-the-age-of-ai — *2024*. Strategic workforce planning must be rebuilt around AI-driven skills shifts. **Honest limit:** the overfitting failure mode is supported by practitioner writing, not single peer-reviewed paper.

## Theme 11 — India DPDP Act for HR

**26. PIB India — DPDP Rules 2025 notification** — https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190655 — *Notified 13 Nov 2025; gazetted 14 Nov 2025*. **Phased rollout**: Phase I (DPB) immediate; Phase II (Consent Managers) 13 Nov 2026; Phase III (substantive) 13 May 2027. Compliance clock for Indian HR teams.

**27. Mondaq — DPDP employee consent analysis** — https://www.mondaq.com/india/data-protection/1755320/is-consent-required-to-process-employees-personal-data-under-the-dpdp-act — *2025*. Employers rely on **"legitimate use" ground under Section 7(1)(i)** for recruitment, candidate evaluation, background verification, onboarding. Consent IS still required beyond employment purposes. Breaches affecting candidates must be reported within **24 hours**. Candidate documents must generally be deleted within **180 days** of exit unless legally required.

## Theme 12 — US state/city AI hiring laws

**28. NYC Local Law 144 — AEDT rule** — https://rules.cityofnewyork.us/rule/automated-employment-decision-tools-2/ — *enforcement Jul 5, 2023*. Bias audit by independent auditor, calculates **selection rates, scoring rates, impact ratios** across protected categories AND intersectional combinations per EEOC standards. Audit summary **publicly posted on employer website**. Candidate notice **≥10 business days before** AEDT use. Civil penalties **$500-$1,500 per day per violation**.

**29. NY State Comptroller — LL144 enforcement audit** — https://www.osc.ny.gov/state-agencies/audits/2025/12/02/enforcement-local-law-144-automated-employment-decision-tools — *Dec 2, 2025*. **State Comptroller concluded NYC DCWP's enforcement of LL144 is "ineffective"** — broken complaint routing, inaccurate compliance reviews, no follow-up. Honest stage line: "LL144 is on the books but barely enforced as of late 2025; DCWP committed to fixing this."

**30. Illinois Artificial Intelligence Video Interview Act · 820 ILCS 42** — http://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=4015&ChapterID=68 — *eff. Jan 1, 2020; amended 2022*. Employers must **notify candidates before** AI-analysed video interview, **explain how AI works + what it evaluates**, **obtain explicit consent**, may not share videos beyond evaluators, **delete videos within 30 days** of candidate request including backups.

**31. Colorado SB24-205 (Consumer Protections for AI)** — https://leg.colorado.gov/bills/sb24-205 — *signed May 17, 2024*. First US comprehensive AI law covering "consequential decisions" including employment. **Status May 2026: enforcement paused** — federal court paused April 2026, replacement SB 189 passed May 2026 (with Governor Polis). Companion: https://www.theemployerreport.com/2026/05/ai-regulation-on-hold-in-colorado-but-employer-risk-isnt/. Cautionary: design around the framework even though enforcement is in flux.

---

## Chapter blueprint

### Chapter 1 — Sourcing automation (~7 min)
**Spine:** From keyword Boolean to intent-driven AI sourcing. LinkedIn Hiring Assistant numbers (66% / 55% / 4 hrs saved). hireEZ EZ Agent, Findem, Eightfold agentic shift. Plus the AI-spam trap — LinkedIn's 87% InMail cap collapse, GDPR Art. 6(1)(f) for EU candidate outreach.
**Interactive:** Sourcing approach comparator — keyword vs intent-based vs agent-driven, learner picks the right one per scenario.
**Citations:** 1, 2, 3, 4, 5, 6.

### Chapter 2 — Resume screening + 4 bias mitigations (~8 min)
**Spine:** Bloomberg numbers (11% / 36% gap), Wilson & Caliskan academic backup (85.1% / 11.1%). Then the 4 mitigations: blind data, calibrated thresholds (4/5ths rule + statistical significance), audit logs (NIST + EU Art. 26), human override (EEOC TA remedies).
**Interactive:** Mitigation auditor — 4 screening flows, learner picks which mitigation is missing.
**Citations:** 7, 8, 9, 10, 11, 12.

### Chapter 3 — Interview prep with AI (~7 min)
**Spine:** HireVue facial-analysis lessons (what NOT to do). Sackett et al. structured interviews r ≈ .42 — strongest single predictor. AI's real role: enforce structured interview discipline, generate role-aligned scorecards, coach interviewer consistency.
**Interactive:** Scorecard builder — pick a role, generate structured-interview rubric.
**Citations:** 21, 22.

### Chapter 4 — Candidate experience copilots (~7 min)
**Spine:** Talent Board CandE data — 29% never heard back, 48% unhappy with feedback, 25% resentment in Tech. Copilots that lift NPS without removing humans. Transparency principle (Illinois AIVIA). Escalation paths that protect trust.
**Interactive:** Copilot persona designer — pick FAQ scope + escalation rule + transparency level.
**Citations:** 23, 30.

### Chapter 5 — Offer & onboarding AI (~6 min)
**Spine:** AI for offer-letter drafting with compensation guardrails (range bands, market data validation). Onboarding personalisation without surveillance patterns. The DPDP 180-day deletion rule. The "no surveillance" line.
**Interactive:** Offer-letter generator with comp guardrail checks (red flag if outside band, mandatory legal review trigger).
**Citations:** 26, 27.

### Chapter 6 — Workforce planning AI (~7 min)
**Spine:** Deloitte + McKinsey on rebuilding workforce planning for the AI-disrupted labour market. Visier/Beamery/Eightfold. The overfitting failure mode — models trained on past patterns reproduce past biases and shortage points. Scenario planning vs prediction.
**Interactive:** Scenario picker — 3 future labour-market scenarios, learner picks which uses AI well and which it predicts badly.
**Citations:** 24, 25.

### Chapter 7 — Compliance posture (~7 min)
**Spine:** The 2026 quadrant — US federal (EEOC iTutorGroup, Mobley v. Workday vendor-as-agent), US state/city (NYC LL144 with the Comptroller "ineffective" finding, Illinois AIVIA, Colorado SB24-205 on pause), EU AI Act (Annex III high-risk, Art. 26 deployer, Art. 99 €15M / 3% penalty), India DPDP (Section 7(1)(i) legitimate use). The Mobley case is the biggest live risk.
**Interactive:** Jurisdiction sorter — 6 hiring scenarios, classify the applicable compliance regime.
**Citations:** 13, 14, 15, 16, 17, 18, 19, 20, 26, 27, 28, 29, 30, 31.

### Chapter 8 — Making it stick: funnel-wide rollout (~6 min)
**Spine:** Pick 3 funnel stages. Sequence over 2 quarters. The bias-audit cadence the CHRO will sign off on. Downloadable rollout plan.
**Interactive:** Rollout builder — 3 funnel stages × 2 quarters → markdown export.
**Citations:** 13, 16, 18, 26 (compliance close).

---

## Negative list

- **No "AI will replace recruiters" framing.** Audience are recruiters. Frame as augmentation + risk-management.
- **No vendor reviews / "best AI tool" listicles.** Cite specific vendors for evidence, not for recommendation.
- **No moralising on bias.** Cite the cases. Let learners reach their own conclusions.
- **No "capstone" language.** Chapter 8 is "Making it stick" per project-academy-rebuild-plan.
- **No US-only framing.** Audience includes GCC, India, EU, Africa. Cover the relevant jurisdictions on screen.
