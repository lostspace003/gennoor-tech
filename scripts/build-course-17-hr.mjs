// Build Course 17 chapter HTMLs — AI for HR & People Teams (Emma · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Function · AI for HR & People Teams';
const OUT = 'tmp/academy-build/ai-for-hr-people-teams/chapters';

const card = (ct, h3, ps, takeaway) =>
  `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`;
const cardRed = (ct, h3, ps, takeaway) =>
  `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`;
const cardGreen = (ct, h3, ps, takeaway) =>
  `<div class="card green"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`;
const cell = (cn, h4, num, p, cls = '') =>
  `<div class="cell ${cls}"><span class="cn">${cn}</span><h4>${h4}</h4>${num ? `<div class="num">${num}</div>` : ''}<p>${p}</p></div>`;
const closeCard = (eyebrow, h2, p) =>
  `<div class="final-close"><div class="eyebrow">${eyebrow}</div><h2>${h2}</h2><p>${p}</p></div>`;

emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The HR AI landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-hr-ai-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · 3 LINES · HIGH-RISK', h1Html: 'Most powerful tech · <em>highest regulatory exposure</em>', subtitleHtml: 'EU AI Act Annex III + EEOC/DOJ + NYC LL144 + IL AIVIA + CO SB24-205 + India DPDPA. <strong>Bloomberg + Wilson & Caliskan. Mobley v. Workday. 3 lines we don\'t cross.</strong>' },
    { type: 'content', eyebrow: 'The regulators · most active in HR AI', icon: '1', headlineHtml: '4 quadrants · <em>all active</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('EU AI ACT', 'Annex III §4 · high-risk', '', 'Recruitment · employment decisions · evaluation · performance · workplace monitoring all classified high-risk. Art. 26/27/50/99.', 'red')}
${cell('US FEDERAL', 'EEOC + DOJ joint 2024', '', 'Disparate impact applies to AI lending decisions. Even facially-neutral models.', 'amber')}
${cell('US STATE', 'NYC LL144 · IL AIVIA · CO SB24-205', '', 'NYC bias audits (Jul 2023). CO AI Act (Feb 2026 effective). IL Video Interview Act.', 'amber')}
${cell('INDIA', 'DPDPA 2023', '', 'Data fiduciary obligations for employee data.', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'The bias evidence · Bloomberg + Wilson-Caliskan', icon: '2', headlineHtml: 'Identical resumes · <em>statistically significant bias</em>',
      blocks: [{ atStep: 1, html: card('THE EVIDENCE', 'Reproducible · peer-reviewed · regulator-citable', ['<strong>Bloomberg (Mar 2024):</strong> identical resumes · names from NC voter rolls · GPT-3.5/4 ranked 1,000 trials/role. Some groups topped at 11% vs 12.5% baseline.', '<strong>Wilson & Caliskan AIES 2024:</strong> 85.1% white-name preference in LLM resume ranking. Academic backup.'], 'Implication: out-of-the-box LLM screening will be biased. Not subtly — measurably, with effect sizes large enough to violate Title VII disparate-impact + Annex III obligations.') }] },
    { type: 'content', eyebrow: 'Mobley v. Workday · the vendor-as-agent doctrine', icon: '3', headlineHtml: 'Vendor-as-agent · <em>vendor + employer both liable</em>',
      blocks: [{ atStep: 1, html: cardRed('MOBLEY v. WORKDAY · FEDERAL CLASS ACTION · 2024-25', 'Vendor-as-agent doctrine in employment AI', ['When a vendor provides AI tools that screen candidates, the vendor may be treated as an agent of the employer. <strong>Both can be liable for discrimination.</strong>'], 'Procurement implication: HR AI vendor contracts need bias-testing obligations + indemnification + audit rights + termination triggers if bias testing fails.') }] },
    { type: 'content', eyebrow: 'The thesis + the 3 lines', icon: '4', headlineHtml: 'The 3 lines we don\'t cross · <em>no ratings · no stack rank · no flight-risk</em>',
      blocks: [
        { atStep: 1, html: card('THE THESIS', 'Most powerful HR tech · highest regulatory exposure', ['CHROs who deploy without controls become next year\'s enforcement case.', '<strong>CHROs who deploy with controls capture material productivity gains.</strong>']) },
        { atStep: 2, html: cardRed('THE 3 LINES WE DON\'T CROSS', 'Beyond these — regulators are waiting', ['<strong>No AI ratings.</strong> No numerical AI-generated score on candidate or employee.', '<strong>No AI stack ranking.</strong> No automated ordering by AI-derived score.', '<strong>No flight-risk prediction.</strong> No individual-level AI inference about leaving.']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'AI as augmentation · bias control as discipline · 3 lines we don\'t cross.', '<strong>Next:</strong> recruiting AI — LinkedIn Hiring Assistant · hireEZ · Findem · Eightfold · AI-spam trap · GDPR Art. 6(1)(f).') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 85.0, slide: 3 }, { at: 95.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 235.0, slide: 5, step: 2 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Recruiting AI' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-recruiting.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · SOURCING AUTOMATION', h1Html: 'Hiring Assistant · hireEZ · Findem · <em>Eightfold</em>', subtitleHtml: '3-5x candidate flow with same time per hire. <strong>And the AI-spam trap is real.</strong>' },
    { type: 'content', eyebrow: 'What\'s deployed in 2026', icon: '1', headlineHtml: 'Agent-augmented sourcing · <em>3-5x flow</em>',
      blocks: [{ atStep: 1, html: card('THE PLATFORMS', 'LinkedIn Hiring Assistant · hireEZ · Findem · Eightfold AI', ['All built on agent-augmented sourcing: AI surfaces candidates · drafts outreach · manages pipeline status.', '<strong>3-5x candidate flow</strong> with same time per hire. Sourcing time per hire drops materially.'], 'Quality roughly comparable to skilled-recruiter sourcing — sometimes better on niche searches.') }] },
    { type: 'content', eyebrow: 'The AI-spam trap', icon: '!', iconRed: true, headlineHtml: 'Volume not the goal · <em>LinkedIn 87% InMail caps</em>',
      blocks: [{ atStep: 1, html: cardRed('THE AI-SPAM TRAP', 'Recruiters using AI to send hundreds of personalised-feeling outreach per week', ['Recipient experience: generic AI-written InMail, clearly templated. Inbox saturation. Reputation damage.', '<strong>LinkedIn pushing back: 87% InMail caps for high-volume senders.</strong> Algorithmic detection of templated outreach.'], 'Volume is not the goal. Quality of targeting is. AI accelerates the work for genuinely-good fits — and accelerates spam for low-quality bulk approaches. CHRO\'s responsibility: insist on the former.') }] },
    { type: 'content', eyebrow: 'GDPR Art. 6(1)(f) + DPDPA · lawful basis', icon: '2', headlineHtml: 'Legitimate interest balancing · <em>opt-in over scrape</em>',
      blocks: [{ atStep: 1, html: card('GDPR ART. 6(1)(F) FOR EU CANDIDATE OUTREACH', 'Legitimate-interest balancing test required', ['AI-driven outreach at scale doesn\'t automatically satisfy that test. <strong>If candidates haven\'t opted in, your AI outreach campaign in the EU may not be lawful.</strong>'], 'Operationally: don\'t blanket-scrape LinkedIn for EU candidates + run AI outreach. Use opt-in candidate pools · legitimate-interest assessments · document the assessment. India DPDPA 2023 — same logic.') }] },
    { type: 'content', eyebrow: 'The discipline · 3 rules', icon: '3', headlineHtml: 'Quality · opt-in · <em>transparency</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('RULE 1', 'Quality over volume', '', 'Metric is interview-to-offer conversion · not outreach volume.', 'green')}
${cell('RULE 2', 'Opt-in over scrape', '', 'Build candidate pools through opt-in channels. AI accelerates outreach to consenting candidates.')}
${cell('RULE 3', 'Transparency', '', 'Identify outreach as AI-augmented. Pew 2025: 70% prefer disclosure.')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull recruiting AI metrics · outreach volume · response rate · interview-to-offer conversion', ['<strong>Outreach up but conversion flat → AI-spam trap.</strong> Cut volume. Refine targeting.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Screening + 4 bias mitigations · <em>Mobley v. Workday</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Quality + opt-in + transparency. <em>Stay out of the spam trap.</em>', '<strong>Next:</strong> Bloomberg + Wilson-Caliskan numbers · the 4 mitigations (blind data · calibrated thresholds · audit logs · human override) · Mobley vendor-as-agent.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 190.0, slide: 5 }, { at: 200.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Screening + the 4 bias mitigations' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-screening.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · 4 MITIGATIONS', h1Html: 'Blind data · thresholds · logs · <em>human override</em>', subtitleHtml: 'Bloomberg + Wilson-Caliskan documented the bias. <strong>4 operational controls actually work.</strong>' },
    { type: 'content', eyebrow: 'The evidence · effect sizes that matter', icon: '1', headlineHtml: 'Bloomberg + Wilson-Caliskan · <em>regulator-citable</em>',
      blocks: [{ atStep: 1, html: cardRed('THE EVIDENCE BASE', 'Reproducible · peer-reviewed · large effect sizes', ['<strong>Bloomberg Mar 2024:</strong> some demographic groups topped at 11% vs 12.5% uniform baseline.', '<strong>Wilson & Caliskan AIES 2024:</strong> 85.1% white-name preference.', '<strong>Implication:</strong> out-of-the-box LLM screening violates Title VII + Annex III thresholds.']) }] },
    { type: 'content', eyebrow: 'Mitigation 1 · blind data', icon: '2', headlineHtml: 'Strip identity signals · <em>before screening</em>',
      blocks: [{ atStep: 1, html: card('MITIGATION 1 · BLIND DATA', 'Strip demographically-identifying info from resumes BEFORE AI screening', ['Names · photos · graduation years · specific schools that proxy for race or class.', '<strong>Use a structured-data extraction layer that retains skills, experience, qualifications — not identity signals.</strong>'], 'Most-effective single mitigation. Bias measurably lower on blinded screening. But not zero — next 3 address the residue.') }] },
    { type: 'content', eyebrow: 'Mitigations 2 + 3 · calibration + logs', icon: '3', headlineHtml: '4/5ths rule · <em>audit logs</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('MITIGATION 2', 'Calibrated thresholds', '', 'Test score distribution across demographic groups before deploying. Use EEOC <strong>4/5ths rule</strong> as floor. Statistical significance testing. Re-calibrate or kill.')}
${cell('MITIGATION 3', 'Audit logs', '', 'Every screening decision logged: features that drove the score · screened in/out · why. <strong>EU AI Act Art. 12 compliance. Defensible under Title VII + NYC LL144.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Mitigation 4 · human override + Mobley', icon: '4', headlineHtml: 'Human decides · <em>vendor-as-agent doctrine</em>',
      blocks: [
        { atStep: 1, html: card('MITIGATION 4 · HUMAN OVERRIDE', 'Hiring manager or recruiter sees every AI decision · can override · especially rejections', ['AI is a recommendation. The human decides.', '<strong>Mobley v. Workday centres on whether AI made the decision or merely informed it.</strong> Document that humans made the decisions, with AI as informational input.']) },
        { atStep: 2, html: cardRed('THE MOBLEY DOCTRINE · VENDOR-AS-AGENT', 'Vendor + employer both liable for discrimination', ['Procurement implication: HR AI vendor contracts need bias-testing obligations · indemnification · audit rights · termination triggers if bias testing fails.', '<strong>This is procurement-team work. Get your GC involved.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Interview prep · <em>Sackett 2022 r=0.42</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '4 mitigations · all 4 required · Mobley vendor-as-agent doctrine in mind.', '<strong>Next:</strong> structured interviews = strongest hiring predictor (Sackett 2022) · AI\'s job: enforce discipline, not generate clever questions.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 170.0, slide: 5 }, { at: 180.0, slide: 5, step: 1 }, { at: 220.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Interview prep + structured interviews' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-interviewing.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · STRUCTURED INTERVIEWS', h1Html: 'Sackett 2022 · <em>r = 0.42</em>', subtitleHtml: 'Strongest single predictor of job performance. <strong>AI\'s job: enforce discipline, not generate clever questions.</strong>' },
    { type: 'content', eyebrow: 'The evidence · Sackett 2022 meta-analysis', icon: '1', headlineHtml: 'r = 0.42 · <em>2x unstructured interviews</em>',
      blocks: [{ atStep: 1, html: cardGreen('SACKETT 2022 META-ANALYSIS', 'Structured interviews = strongest single predictor of job performance · r ≈ 0.42', ['Higher than cognitive-ability tests. Higher than personality assessments. Higher than years of experience.', '<strong>Unstructured interviews ("tell me about yourself"): r ≈ 0.2.</strong> Half the predictive validity. Same time invested.'], 'Structured = same questions across candidates · same rubric for scoring · same probing for follow-up · pre-defined behavioural questions tied to job-relevant competencies.') }] },
    { type: 'content', eyebrow: 'AI\'s role · enforce discipline', icon: '2', headlineHtml: 'Question bank · briefing · <em>note-taking</em>',
      blocks: [{ atStep: 1, html: card('AI\'S ROLE IN INTERVIEWING', 'Enforce structured-interview discipline · not generate novelty questions', ['AI helps design the structured interview · pre-built question banks tied to competencies.', 'AI helps interviewers prepare · briefing notes per candidate based on resume and role.', '<strong>AI assists with note-taking and scoring — but not the score itself. The interviewer scores.</strong>'], 'What AI doesn\'t do well: generate clever novelty questions. "If you were a tree..." — terrible predictor. AI cheerfully produces these. They\'re not what works. <em>Sackett: structure, not novelty, drives validity.</em>') }] },
    { type: 'content', eyebrow: 'The HireVue cautionary lessons', icon: '!', iconRed: true, headlineHtml: 'AI scoring of voice/face · <em>walked back across the industry</em>',
      blocks: [{ atStep: 1, html: cardRed('THE HIREVUE CAUTIONARY LESSONS', 'Async video with AI scoring controversial 2023-2025', ['Multiple complaints: facial-expression scoring · voice-analysis scoring · inability of candidates with disabilities or accents to perform fairly.', '<strong>HireVue + competitors walked back features.</strong> Pure AI scoring of candidate responses removed or made advisory at most platforms by 2026.'], 'Current accepted use: async video as logistics tool · humans scoring afterwards · AI assisting note-taking only. <em>The lesson: AI augments. Humans evaluate.</em>') }] },
    { type: 'content', eyebrow: 'The discipline · 3 rules', icon: '3', headlineHtml: 'Structure · prep · <em>accommodation</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('RULE 1', 'Structured interview design is the deliverable', '', 'Use AI to build the question bank · tie every question to a job-relevant competency · defensible to a regulator.')}
${cell('RULE 2', 'Interviewer prep over candidate scoring', '', 'Use AI to brief interviewers, not to score candidates. <strong>Score belongs to the interviewer.</strong>')}
${cell('RULE 3', 'Disability + accommodation aware', '', 'No AI scoring of voice or facial expression for assessment. <strong>If platform does this → get a different platform.</strong>')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull one recent open role · look at the interview structure', ['Interviewers using different questions/rubrics/probing? <strong>You don\'t have a structured interview.</strong> Use AI this week to build the structured version for that role.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Candidate experience + 3 lines · <em>Talent Board CandE</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Structure not novelty · AI on question bank + prep · interviewer scores · accommodation aware.', '<strong>Next:</strong> Talent Board 29% never heard back · 3-sentence disclosure · the 3 lines we don\'t cross.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Candidate experience + the 3 lines' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-candidate-experience.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · 3 LINES + DISCLOSURE', h1Html: '29% never heard back · <em>48% unhappy with feedback</em>', subtitleHtml: 'Talent Board CandE 2024. <strong>AI can fix this — without crossing the 3 lines.</strong>' },
    { type: 'content', eyebrow: 'The Talent Board CandE data', icon: '1', headlineHtml: 'Talent Board CandE 2024 · <em>the gap AI fills</em>',
      blocks: [{ atStep: 1, html: card('TALENT BOARD CANDE 2024 SURVEY', '29% of candidates never heard back · 48% unhappy with feedback received', ['That\'s the gap AI is positioned to fill. <strong>Automated status updates · personalised rejection feedback · faster turnaround.</strong>'], 'Risk: generic AI-generated feedback worse than no feedback. Inconsistent voice · wrong info · inadvertent commitments. <em>Air Canada Moffatt cross-domain applies — if AI tells a candidate they got the role and they didn\'t — that\'s a problem.</em>') }] },
    { type: 'content', eyebrow: 'The 3-sentence disclosure pattern', icon: '2', headlineHtml: 'EU Art. 50 mandatory · <em>70% candidates prefer it</em>',
      blocks: [{ atStep: 1, html: card('THE 3-SENTENCE DISCLOSURE PATTERN', 'Same as the support-bots course', ['<strong>1. "Hi, I\'m Acme Recruiting Assistant, an AI helper."</strong> Direct. Named. Categorised.', '<strong>2. "I can help with application status, scheduling, and general questions about the role."</strong> Scope-bound.', '<strong>3. "For anything I can\'t answer, I\'ll connect you to a human recruiter."</strong> Escalation promise upfront.'], 'EU AI Act Art. 50 makes this mandatory Aug 2 2026. Pew Research 2025: 70% of candidates prefer disclosure.') }] },
    { type: 'content', eyebrow: 'The 3 lines we don\'t cross', icon: '!', iconRed: true, headlineHtml: 'No ratings · no stack rank · <em>no flight-risk prediction</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('LINE 1', 'No AI ratings', '', 'No numerical AI-generated score on the candidate. <strong>Humans rate. AI doesn\'t.</strong>', 'red')}
${cell('LINE 2', 'No AI stack ranking', '', 'No automated ordering by AI-derived score. <strong>Mobley v. Workday applies. Vendor-as-agent doctrine.</strong>', 'red')}
${cell('LINE 3', 'No flight-risk prediction', '', 'No AI inference about whether an employee will leave. <strong>Most-pitched and least-defensible HR AI application.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'The discipline · inside the lines', icon: '4', headlineHtml: 'Status · scheduling · personalised feedback · <em>onboarding workflows</em>',
      blocks: [
        { atStep: 1, html: card('INSIDE THE 3 LINES — A LOT OF LEGITIMATE GROUND', 'Status updates · interview scheduling · personalised rejection feedback (with human review) · onboarding workflows · L&D personalisation · skills-gap analysis at the role level (not individual)', ['<strong>Outside the lines</strong> — the regulator is waiting. The works council. The consumer-protection litigator.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Audit candidate-facing AI surfaces · pick 5 messages at random', ['Verify nothing in them is a binding commitment, discriminatory implication, or fabricated detail. <strong>If any is — fix controls before next quarter.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Onboarding · L&D · <em>people analytics</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3-sentence disclosure · 3 lines we don\'t cross · plenty inside the lines.', '<strong>Next:</strong> onboarding personalisation without surveillance · L&D AI · aggregate vs individual people analytics.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Onboarding, L&D, people analytics' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-onboarding-lnd.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · INSIDE THE LINES', h1Html: 'Personalisation · skills gaps · <em>aggregate analytics</em>', subtitleHtml: 'The 3 HR use cases where AI delivers value without crossing into ratings, ranking, or surveillance.' },
    { type: 'content', eyebrow: 'Onboarding · personalisation not surveillance', icon: '1', headlineHtml: 'Tailored learning path · <em>at the program level, not individual</em>',
      blocks: [{ atStep: 1, html: card('ONBOARDING AI', 'Personalised new-hire experience without surveillance', ['Tailored learning path · document Q&A · manager-side automation (scheduling, equipment, intros).'], 'What this is NOT: onboarding completion as a performance signal. <em>If AI tracks which new hires complete faster and uses that to predict who\'ll stay or leave — you\'ve crossed into flight-risk. Line 3.</em> Metrics for the program, not the individual.') }] },
    { type: 'content', eyebrow: 'L&D · personalisation with employee choice', icon: '2', headlineHtml: 'Recommendations as input · <em>employee choice as output</em>',
      blocks: [{ atStep: 1, html: card('LEARNING + DEVELOPMENT AI', 'LinkedIn Learning · Coursera · Udemy · Workday · SAP SuccessFactors · Cornerstone', ['AI personalises learning paths · skills gap analysis at role/team level · learning content generation (first-draft, then human review).', '<strong>Discipline: recommendations as input, employee choice as output.</strong>'], 'Mandate AI-generated paths without employee choice → you\'ve moved from L&D into surveillance-flavoured performance management. <em>That\'s the line.</em>') }] },
    { type: 'content', eyebrow: 'People analytics · aggregate vs individual', icon: '3', headlineHtml: 'Aggregate defensible · <em>individual flight-risk = line 3</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('DEFENSIBLE', 'Aggregate-level · team/role-level engagement · skill gaps · macro workforce planning', '', 'Visier · Workday · SAP. <strong>Aggregate analytics with optional individual-level only with explicit employee consent + HR controls.</strong>', 'green')}
${cell('NOT DEFENSIBLE', 'Individual-level flight-risk · disengagement scoring · performance ranking by AI', '', '<strong>The platforms toned down individual-level predictive features through 2025.</strong> Market direction: aggregate-first.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'The surveillance line', icon: '!', iconRed: true, headlineHtml: 'Workplace monitoring AI · <em>EU Annex III + state laws</em>',
      blocks: [
        { atStep: 1, html: cardRed('THE SURVEILLANCE LINE', 'AI-augmented workplace monitoring being aggressively regulated', ['<strong>EU AI Act Annex III</strong> classifies workplace monitoring AI as high-risk. NYC LL144. CO SB24-205.', 'Productivity-monitoring AI is line-3 territory. Same as flight-risk.'], 'Be very careful: keystroke logging · application usage tracking · calendar analysis to infer engagement. Even pitched as "efficiency analytics" — <strong>legal exposure is real.</strong> Productivity-gain claim doesn\'t justify it.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull current HR AI deployments · unit of analysis = aggregate or individual?', ['Individual-level → does it meet 3-lines test? No ratings · no ranking · no flight-risk. <strong>If any fails — scope back to aggregate-level.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Compliance posture · <em>4 quadrants · works council</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Onboarding · L&D · analytics — all stay inside the lines · aggregate-first.', '<strong>Next:</strong> 4-quadrant compliance posture · EU + US + India + works councils · 5-section posture document.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Compliance posture across jurisdictions' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-compliance-posture.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · 4 QUADRANTS + WORKS COUNCIL', h1Html: 'EU · US · India · <em>works council</em>', subtitleHtml: 'Most CHROs operate in multiple jurisdictions. <strong>4 quadrants. 1 posture document.</strong>' },
    { type: 'content', eyebrow: 'Quadrant 1 · EU', icon: '1', headlineHtml: 'AI Act + GDPR · <em>Annex III high-risk</em>',
      blocks: [{ atStep: 1, html: card('EU · AI ACT + GDPR', 'AI systems for recruitment/employment/evaluation/performance/workplace monitoring all classified high-risk under Annex III §4', ['<strong>Art. 26 deployer obligations · Art. 27 FRIA · Art. 50 disclosure · Art. 99 fines (up to €15M or 3% turnover).</strong>', 'GDPR Art. 6 legitimate-interest. Art. 22 automated-decision-making in force since 2018.']) }] },
    { type: 'content', eyebrow: 'Quadrant 2 · US patchwork', icon: '2', headlineHtml: 'Federal EEOC/DOJ · <em>state laws + NIST</em>',
      blocks: [{ atStep: 1, html: card('US · FEDERAL + STATE PATCHWORK', 'Federal: EEOC + DOJ joint statement 2024 — disparate impact applies to AI employment decisions', ['<strong>State:</strong> NYC LL144 bias audits (Jul 2023) · IL Video Interview Act · CO SB24-205 (AI Act Feb 2026) · CA AB pending.', '<strong>De facto US standard:</strong> NIST AI Risk Management Framework.']) }] },
    { type: 'content', eyebrow: 'Quadrants 3 + 4 · India + works councils', icon: '3', headlineHtml: 'India DPDPA · <em>EU co-determination</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUADRANT 3 · INDIA', 'DPDPA 2023 + IndAS', '', 'Data fiduciary obligations for employee data. Breach notification. IndAS evolving on AI disclosure.')}
${cell('QUADRANT 4 · WORKS COUNCILS', 'EU + national co-determination', '', 'Germany · Austria · Netherlands · France — AI-driven employment changes require consultation. <strong>Sometimes co-determination consent.</strong> Get the works council in the conversation BEFORE the procurement decision is final.')}
</div>` }] },
    { type: 'content', eyebrow: 'The posture document · 5 sections', icon: '4', headlineHtml: 'Per-tool inventory · classification · <em>bias-testing log · sign-off · cadence</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('SECTION 1', 'Vendor inventory', '', 'Per HR AI tool, which jurisdictions apply.')}
${cell('SECTION 2', 'Risk classification', '', 'What EU AI Act tier. High-risk → full Art. 6-29 treatment.')}
${cell('SECTION 3', 'Bias-testing log', '', 'When last tested · by whom · results. NIST Measure function evidence.')}
${cell('SECTION 4', 'Works council + GC sign-off', '', 'Per EU-deployed tool, the consultation record. Per US tool, GC sign-off.')}
${cell('SECTION 5', 'Review cadence', '', 'Quarterly high-risk · annual limited · triggered on incidents.')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Top 3 HR AI tools · can you answer 5 sections in one sentence each?', ['<strong>If not — that\'s the work for next quarter.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your HR AI roadmap · <em>2 use cases · 3 lines</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 quadrants · 5-section posture document · works-council conversation early + substantive.', '<strong>Last chapter:</strong> 2-quarter HR AI roadmap · 4 trust trip-wires · interactive builder.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],jurisdictions:[],cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='cadence'){grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state.cadence=val;}else{var arr=state[key];var max=key==='usecases'?2:99;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<max){arr.push(val);btn.classList.add('picked')}}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='hr-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases — inside the 3 lines)_';var j=state.jurisdictions.length?state.jurisdictions.map(function(s){return '- '+s}).join('\\n'):'- _(pick jurisdictions)_';var c=state.cadence||'_(pick cadence)_';return '# HR AI · 2-Quarter Roadmap\\n\\n**CHRO / HR Ops:** ____________________\\n**Start date:** ____________________\\n\\n## 2 use cases · inside the 3 lines\\n'+uc+'\\n\\n## Jurisdictions in scope\\n'+j+'\\n\\n## Compliance + works-council cadence\\n'+c+'\\n\\n## Quarter 1\\n- Recruiting sourcing automation (LinkedIn Hiring Assistant / hireEZ / Findem / Eightfold)\\n- L&D personalisation (recommendations as input, employee choice as output)\\n- 4 bias mitigations + 3-sentence disclosure pattern\\n\\n## Quarter 2\\n- Structured-interview AI (AI builds question bank · interviewers score)\\n- Add screening AI only with the 4 mitigations from chapter 3\\n\\n## Trust trip-wires (do not cross)\\n- No AI ratings\\n- No AI stack ranking\\n- No flight-risk prediction\\n- No "set and forget" · quarterly bias audit · annual works-council + GC review\\n\\n---\\nSource: Gennoor Academy · Function · AI for HR & People Teams\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your HR AI roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · INSIDE THE 3 LINES', h1Html: '2 use cases · 2 quarters · <em>4 trust trip-wires</em>', subtitleHtml: '7 chapters · this chapter sequences them inside the lines.' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: '2 use cases · <em>inside the 3 lines</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 2 quarters · 1 compliance posture · inside the 3 lines', ['No AI ratings · no AI stack ranking · no flight-risk prediction.', '<strong>Beyond those — a lot of legitimate ground. Inside those — the regulator is waiting.</strong>']) }] },
    { type: 'content', eyebrow: 'The sequence · default playbook', icon: '2', headlineHtml: 'Q1 sourcing + L&D · <em>Q2 structured interviews</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUARTER 1', 'Recruiting sourcing + L&D personalisation', '', 'Lowest legal exposure · clearest productivity gain. Sourcing AI accelerates work for genuinely-good fits. L&D AI gives employees better-curated learning options.', 'green')}
${cell('QUARTER 2', 'Structured-interview AI', '', 'Sackett 2022 r ≈ 0.42 for structured interviews. <strong>AI builds question bank · interviewers score.</strong> Material hiring-quality lift without crossing lines.')}
</div>` }, { atStep: 1, html: card('DEFER', 'Screening with 4 mitigations · workplace monitoring · individual people analytics', ['Year 2 if at all.']) }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>3 lines + 1 cadence</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No AI ratings', '', 'No numerical AI-generated score on candidate/employee.', 'red')}
${cell('TRIP-WIRE 2', 'No AI stack ranking', '', 'No automated ordering by AI without human review.', 'red')}
${cell('TRIP-WIRE 3', 'No flight-risk prediction', '', 'No individual-level AI inference about leaving.', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly bias audit · annual works-council + GC review · triggered review on incidents.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your HR AI roadmap', icon: '✓', headlineHtml: 'Pick · download · <em>take to CHRO + GC</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases (inside the 3 lines)</h5><div class="preset" data-group="usecases">
<button data-val="Recruiting sourcing automation (LinkedIn Hiring Assistant / hireEZ / Findem / Eightfold)">Sourcing automation</button>
<button data-val="L&amp;D personalisation (employee choice as output)">L&amp;D personalisation</button>
<button data-val="Structured-interview AI (AI builds question bank · interviewers score)">Structured interviews</button>
<button data-val="Onboarding personalisation (program metrics, not individual)">Onboarding personalisation</button>
<button data-val="Candidate-facing chatbot (3-sentence disclosure)">Candidate chatbot</button>
<button data-val="Screening with 4 bias mitigations (blind data · thresholds · logs · human override)">Screening · with 4 mitigations</button>
</div></div>
<div class="group"><h5>Jurisdictions in scope</h5><div class="preset" data-group="jurisdictions">
<button data-val="EU (AI Act + GDPR + works councils)">EU</button>
<button data-val="US federal + relevant states (NYC LL144, IL AIVIA, CO SB24-205)">US</button>
<button data-val="UK">UK</button><button data-val="India (DPDPA)">India</button>
</div></div>
<div class="group"><h5>Compliance + works-council cadence</h5><div class="preset" data-group="cadence">
<button data-val="Quarterly bias audit + works-council + annual GC + 5-section posture doc">Quarterly · full</button>
<button data-val="Quarterly bias audit · semi-annual works-council">Quarterly + semi-annual</button>
<button data-val="Per-incident bias review · annual works-council">Per-incident + annual</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my HR AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># HR AI · 2-Quarter Roadmap

Pick 2 use cases, jurisdictions, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'AI as augmentation · bias control as discipline · <em>3 lines</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Most powerful tech · highest regulatory exposure · 4 bias mitigations on screening · Sackett structured interviews are the hiring play · 3-sentence disclosure to candidates · 3 lines we don't cross (no ratings · no stack rank · no flight-risk) · works-council early + substantive · quarterly bias audit · year-one inside the lines.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one CHRO or GC conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 },
    { at: 215.0, slide: 6 }, { at: 225.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 17 chapters 1-8 built.');
