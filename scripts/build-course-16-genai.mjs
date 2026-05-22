// Build Course 16 chapter HTMLs — Generative AI for Business (Andrew · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Foundations · Generative AI for Business';
const OUT = 'tmp/academy-build/generative-ai-for-business/chapters';

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

// Ch1
emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The 2026 landscape for managers' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-landscape-for-managers.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · GROVE LEVERAGE', h1Html: '4 skills · <em>framing · evaluating · piloting · measuring</em>', subtitleHtml: 'Stanford 78% / McKinsey 71% adoption. <strong>AI is leverage when used correctly. Managers who capture it lead.</strong>' },
    { type: 'content', eyebrow: 'Adoption · Stanford + McKinsey + Gartner', icon: '1', headlineHtml: 'Mainstream + mature · <em>trough of disillusionment cleanup</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('STANFORD AI INDEX 2025', 'Global AI adoption in 2024', '78%', 'Up from 55% in 2023.')}
${cell('McKINSEY STATE OF AI 2025', 'Regularly using gen AI', '71%', 'In at least one function.')}
${cell('GARTNER HYPE CYCLE 2025', 'Where we are', 'Trough cleanup', 'Peak inflated expectations was 2023. Serious productivity work is now.')}
</div>` }] },
    { type: 'content', eyebrow: 'The manager\'s question · the 4 skills', icon: '2', headlineHtml: 'Frame · evaluate · pilot · <em>measure</em>',
      blocks: [{ atStep: 1, html: card('THE MANAGER\'S QUESTION · 2026', 'Not "is AI useful." That\'s settled. How do you capture productivity gains for your team while avoiding the failure modes that get on the front page?', ['<strong>The 4 skills:</strong> framing use cases · evaluating vendors · running pilots that scale · measuring outcomes.', 'Chapters 2-5 teach each one.']) }] },
    { type: 'content', eyebrow: 'The Grove framing · High Output Management 1983', icon: '3', headlineHtml: 'The manager\'s job is <em>leverage</em>',
      blocks: [{ atStep: 1, html: card('ANDY GROVE · HIGH OUTPUT MANAGEMENT', 'Find activities where 1 hour of your time produces hours of output across your team', ['<strong>AI is leverage when used correctly.</strong>', 'The manager who frames the right AI use cases produces multiples of output.', '<strong>The manager who delegates "go figure out AI" to direct reports leaves the leverage on the table.</strong>']) }] },
    { type: 'content', eyebrow: 'WEF context · the workforce shift', icon: '4', headlineHtml: '86% expect transformation · <em>40% expect reduction</em>',
      blocks: [
        { atStep: 1, html: card('WEF FUTURE OF JOBS 2025', '86% expect to transform workforce through AI · 40% expect to reduce parts by 2030', ['The work of your team is changing in 24-36 months. Not 5 years.', '<strong>Your team will be more productive. Your team will also be smaller per unit of output.</strong> Both are true.'], 'The manager who plans for this wins.') },
        { atStep: 2, html: card('THE THESIS', '4 skills · 8 chapters · 1 through-line', ['<strong>AI is leverage. Managers who capture it lead. Managers who don\'t lag.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'AI is leverage · capture it.', '<strong>Next:</strong> framing use cases · the 4-question framework · 5 categories that work + 3 that don\'t.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 225.0, slide: 5, step: 2 },
    { at: 245.0, slide: 6 }, { at: 255.0, slide: 6, step: 1 }
  ]
});

// Ch2
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Framing use cases' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-framing.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · THE 4-QUESTION FRAMEWORK', h1Html: 'Task · cost · data · <em>failure mode</em>', subtitleHtml: 'If you can\'t frame the use case in 1 paragraph, you can\'t pilot it, scale it, or measure it. <strong>The framing is the leverage work.</strong>' },
    { type: 'content', eyebrow: 'The 4 questions · ask any candidate use case', icon: '1', headlineHtml: 'Task · cost · data · <em>failure mode</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('Q1 · TASK', 'Specific. Not "use AI for marketing."', '', '"AI drafts the first version of our weekly perf email to leadership." <strong>Specific task. Specific output.</strong>')}
${cell('Q2 · COST TODAY', 'Time · attention · money', '', '1 person × 2 hrs/week — manageable scope. "Write a strategy doc quarterly" — different scope.')}
${cell('Q3 · DATA', 'Most-skipped question', '', 'Does the AI need access to specific docs, customer records, internal systems? <strong>Without right data, AI is a smart guess machine.</strong>')}
${cell('Q4 · FAILURE MODE', 'If AI gets it wrong, what happens?', '', 'Embarrassing internal email — low stakes. Customer-facing commitment — high. <strong>Failure mode shapes controls.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'The 5 categories that work · gen AI 2026', icon: '2', headlineHtml: 'Drafting · summarising · translating · classifying · <em>code</em>',
      blocks: [{ atStep: 1, html: cardGreen('5 CATEGORIES THAT WORK', 'Productivity gains 15–40% on knowledge-work tasks · MIT/BCG/Harvard/Goldman 2023-24', ['<strong>Drafting</strong> — first versions of docs.', '<strong>Summarising</strong> — meetings, papers, threads.', '<strong>Translating</strong> — languages, registers, audiences.', '<strong>Classifying</strong> — sorting, tagging, routing.', '<strong>Code generation</strong> — for any team that touches code.']) }] },
    { type: 'content', eyebrow: '3 categories where AI doesn\'t fit', icon: '!', iconRed: true, headlineHtml: 'Research · judgement · <em>identity-specific facts</em>',
      blocks: [{ atStep: 1, html: cardRed('3 CATEGORIES THAT DON\'T WORK YET', 'Where AI augments — doesn\'t replace — a careful human', ['<strong>Open-ended research with citations.</strong> Stanford "Hallucinating Law": 17–34% hallucination even with retrieval. Verify everything.', '<strong>Judgement-heavy decisions.</strong> Hiring · personnel · escalations. AI can inform. Humans decide.', '<strong>Identity-specific facts.</strong> Your specific customers, contracts, personnel. AI wasn\'t trained on them.']) }] },
    { type: 'content', eyebrow: 'The manager pattern · generate + filter', icon: '3', headlineHtml: '3 candidates · 4 questions · <em>strongest 2 → pilot</em>',
      blocks: [
        { atStep: 1, html: card('THE MANAGER PATTERN', 'Generate 3 candidate use cases this quarter · run 4-question framework on each', ['Passes all 4 → pilot. Fails any → defer or kill.', '<strong>This is the leverage work.</strong> 1 hour of framing produces months of team output if the use case is right. Zero output if wrong.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick 1 task your team does every week · run the 4-question framework', ['Passes → first pilot. Fails → pick another. <strong>The framing is the deliverable.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Evaluating vendors · <em>Tetlock calibration · 3 questions</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 questions · 5 categories that work · 3 that don\'t. <em>Framing is leverage.</em>', '<strong>Next:</strong> Tetlock calibration over confidence · 3 vendor questions · enterprise terms baseline.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 90.0, slide: 3 }, { at: 100.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 }
  ]
});

// Ch3
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Evaluating vendors' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-evaluating-vendors.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · CALIBRATION > CONFIDENCE', h1Html: '3 questions · 1 T&amp;C baseline · <em>3 enterprise vendors</em>', subtitleHtml: 'Every vendor in 2026 pitches "transformative AI." <strong>3 questions + 1 terms-and-conditions baseline tells you which is which.</strong>' },
    { type: 'content', eyebrow: 'Tetlock framing · 20+ years of research', icon: '1', headlineHtml: 'Calibrated 70% · <em>beats over-confident 80%</em>',
      blocks: [{ atStep: 1, html: card('TETLOCK · CALIBRATION OVER CONFIDENCE', 'Apply to vendor pitches', ['The vendor who says <em>"we deliver 30% productivity gains, here\'s the studied population, here\'s the comparison baseline, here\'s what we didn\'t measure"</em> is calibrated.', 'The vendor who says <em>"we transform your business"</em> is over-confident.', '<strong>Calibrated vendors are rarer. Also more reliable.</strong>']) }] },
    { type: 'content', eyebrow: 'Question 1 · studied population', icon: '2', headlineHtml: 'Who exactly · <em>"active" matters</em>',
      blocks: [{ atStep: 1, html: card('Q1 · STUDIED POPULATION', 'Who was in the study? Knowledge workers in marketing? Junior accountants?', ['MS Work Trend Index: ~30% time savings for <strong>active Copilot users</strong> (used every week ≥ 8 weeks).', 'If you onboard 50 but only 12 become active — your average gain is much lower.', '<strong>Ask:</strong> "What\'s the active-user definition? What fraction of deployments hit it?"']) }] },
    { type: 'content', eyebrow: 'Question 2 · compared to what + Q3 · what was skipped', icon: '3', headlineHtml: 'Honest baseline · <em>unmeasured costs</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('Q2 · COMPARED TO WHAT', 'The realistic baseline', '', 'Compared to drafting <strong>without any tools</strong> — almost any AI wins. <strong>Compared to drafting with Google + templates + existing tools</strong> — much smaller delta. Honest vendor names the baseline.')}
${cell('Q3 · WHAT WASN\'T MEASURED', 'Quality · re-work · verification', '', 'Stanford hallucination story applies. <strong>If only drafting time is measured, the productivity story is incomplete.</strong> Honest vendors name what they didn\'t measure.')}
</div>` }] },
    { type: 'content', eyebrow: 'The T&Cs baseline · 3 settings in writing', icon: '4', headlineHtml: 'Training opt-out · tenant isolation · <em>retention</em>',
      blocks: [
        { atStep: 1, html: card('ENTERPRISE T&Cs · 3 SETTINGS IN WRITING', 'OpenAI Enterprise · Anthropic Commercial · MS Copilot for M365 — all 3 baseline', ['<strong>Training opt-out:</strong> your prompts/outputs not used to train future models.', '<strong>Tenant isolation:</strong> your data doesn\'t commingle.', '<strong>Retention:</strong> you know how long stored.'], 'Vendor can\'t tick all 3 in writing → don\'t use it with company data.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick 1 AI vendor that pitched in last 6 months · run 3 questions + T&Cs baseline', ['<strong>If they can\'t answer cleanly — that\'s your decision.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Build vs buy · <em>3 categories · cost shape</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 questions · 1 T&Cs baseline · default to vendors who can answer cleanly.', '<strong>Next:</strong> McKinsey + BCG advisory · build only when proprietary data + workflow is the moat · 3 categories: buy · configure · build.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 125.0, slide: 4 }, { at: 135.0, slide: 4, step: 1 },
    { at: 185.0, slide: 5 }, { at: 195.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

// Ch4
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Build vs buy' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-build-vs-buy.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · 3 CATEGORIES · 1 FILTER', h1Html: 'Buy · configure · <em>build</em>', subtitleHtml: 'McKinsey + BCG advisory: <strong>build only when proprietary data + workflow is the moat.</strong> The default is buy.' },
    { type: 'content', eyebrow: 'The framing · McKinsey + BCG 2024-25', icon: '1', headlineHtml: 'Frontier-model layer commoditising · <em>application layer is the moat</em>',
      blocks: [{ atStep: 1, html: card('McKINSEY + BCG ADVISORY · 2024-25', 'Build only when proprietary data + workflow is the moat', ['<strong>Why:</strong> the frontier-model layer is commoditising. Anthropic, OpenAI, Google, MS, Mistral — all excellent at the base layer.', '<strong>Your competitive advantage comes from the application layer, not the model layer.</strong>', 'If your application layer is "generic AI for generic tasks" — your moat is zero.']) }] },
    { type: 'content', eyebrow: 'Category 1 · off-the-shelf · 80% of use cases', icon: '2', headlineHtml: 'Copilot · ChatGPT · Claude · <em>Gemini</em>',
      blocks: [{ atStep: 1, html: card('CATEGORY 1 · OFF-THE-SHELF', 'MS Copilot for M365 · ChatGPT Enterprise · Claude for Work · Google Workspace Gemini', ['<strong>When this works:</strong> generic knowledge-work productivity. Drafting · summarising · email · documents · meeting notes.', '80% of manager-level use cases sit here.'], '<strong>Cost shape:</strong> per-seat licensing. Predictable. Mid-double-digits to low triple-digits per user per month depending on tier. 3-year cost roughly linear with headcount.') }] },
    { type: 'content', eyebrow: 'Category 2 · configure with vendor', icon: '3', headlineHtml: 'Agentforce · Joule · <em>ServiceNow · Workday</em>',
      blocks: [{ atStep: 1, html: card('CATEGORY 2 · CONFIGURE WITH A VENDOR', 'Salesforce Agentforce · ServiceNow AI · SAP Joule · Workday AI · many industry-specific platforms', ['<strong>When this works:</strong> your team uses a major SaaS extensively. AI sits on top of existing system. <em>Configuration — not coding. Vendor maintains the model.</em>'], '<strong>Cost shape:</strong> implementation upfront + per-seat or per-transaction ongoing. 3-year cost moderate-to-high but predictable.') }] },
    { type: 'content', eyebrow: 'Category 3 · build custom · with the Gartner caution', icon: '4', headlineHtml: 'Engineering team + APIs · <em>Gartner <30% deliver value</em>',
      blocks: [
        { atStep: 1, html: card('CATEGORY 3 · BUILD CUSTOM', 'Engineering team builds an AI app using OpenAI API · Anthropic Claude · or open-source', ['<strong>When this works:</strong> proprietary data + proprietary workflow is the moat. Unique data asset + differentiated workflow → build.'], 'Cost shape: engineering investment upfront. Then ongoing run cost. 3-year cost significant. Trade-off: full control + customisation.') },
        { atStep: 1, html: cardRed('GARTNER CAUTION', '<30% of AI projects deliver measurable business value', ['Most build projects fall in that 70%. <strong>Build only when you can defensibly explain why off-the-shelf or configure doesn\'t fit.</strong>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick your team\'s most-impactful AI use case from chapter 2 · apply the McKinsey filter', ['Proprietary data + workflow = moat? Yes → explore build. No → buy or configure. <strong>The default is buy.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Running pilots that scale · <em>stage-gate · kill discipline</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 categories · 1 filter (proprietary data + workflow = moat). <em>Default is buy.</em>', '<strong>Next:</strong> pilot/scale/embed gates · kill discipline · active-user reality · measurement framework.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 170.0, slide: 5 }, { at: 180.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

// Ch5
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Running pilots that scale' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-pilots.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · BE IN THE 30%', h1Html: 'Stage-gate · kill discipline · <em>active users</em>', subtitleHtml: 'Most AI pilots don\'t scale. <strong>Gartner <30% deliver value. This chapter is how to be in the 30%.</strong>' },
    { type: 'content', eyebrow: 'Stage-gate · 3 gates', icon: '1', headlineHtml: 'Pilot · scale · <em>embed</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('GATE 1 · PILOT', '1 team · 1 quarter', '', 'Measure against the use case framed in ch 2. Kill or fund.')}
${cell('GATE 2 · SCALE', '10x user base', '', 'Does productivity claim hold at scale? <strong>Active-user fraction matters.</strong>')}
${cell('GATE 3 · EMBED', '3 months at scale', '', 'Is the AI tool the default? Reach without reminder? If yes — succeeded. If no — friction not removed.')}
</div>` }] },
    { type: 'content', eyebrow: 'Kill discipline · the optical vs actual', icon: '2', headlineHtml: 'Kill cleanly · <em>don\'t extend</em>',
      blocks: [{ atStep: 1, html: card('THE KILL DISCIPLINE', 'If a pilot doesn\'t pass its gate — kill it cleanly. Don\'t extend.', ['<strong>Optical reasoning:</strong> "I championed this, killing it makes me look bad."', '<strong>Actual outcome:</strong> spreading attention across multiple stalled pilots, none get resources to actually move the business.'], 'The honest version: killing a failed pilot is capital discipline, not failure. <em>The 2 pilots that pass get 5x the resources they had. That\'s how scaling happens.</em>') }] },
    { type: 'content', eyebrow: 'Measurement framework · 3 things', icon: '3', headlineHtml: 'Baseline · counterfactual · <em>quality + re-work</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('1 · BASELINE BEFORE', 'Time · cost · accuracy before AI', '', 'Measure BEFORE the pilot. <strong>Not retroactively.</strong>')}
${cell('2 · COUNTERFACTUAL', 'What would have happened without?', '', 'If hired more people. If gave team better templates. <strong>Compare to that — not to "doing nothing."</strong>')}
${cell('3 · QUALITY + RE-WORK', 'Was output as good or better?', '', 'Did the team spend additional time verifying or fixing AI mistakes? <strong>Honest measure includes verification time.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'The active-user reality · MS Work Trend Index', icon: '4', headlineHtml: 'Active users get the gains · <em>make the new way easier</em>',
      blocks: [
        { atStep: 1, html: card('THE ACTIVE-USER REALITY', 'MS Work Trend Index: ~30% time savings for active Copilot users', ['Opposite of active: "I tried it once, it didn\'t help, I went back to my old way." <strong>That\'s most people the first month.</strong>'], 'Manager\'s job: make the new way easier than the old way. Templates · saved prompts · shared best practices from active users · office hours. <em>Until the AI tool is the default reach.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick your team\'s strongest pilot · write down baseline, counterfactual, quality measurement', ['<strong>If you can\'t, you don\'t have a pilot — you have an experiment. Define those 3 by week\'s end.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Risks managers must know · <em>3 cases · 3 categories</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Stage-gate · kill discipline · 3-thing measurement · active users get the gains.', '<strong>Next:</strong> Mata · Air Canada · Bloomberg · EU AI Act · 3 risk categories (legal · reputational · customer-data).') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 85.0, slide: 3 }, { at: 95.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// Ch6
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Risks managers must know' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-risks.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · 3 CASES · 1 RULE · 1 REG', h1Html: 'Mata · Air Canada · <em>Bloomberg · EU AI Act</em>', subtitleHtml: '3 verifiable cases · 1 personal-data rule · 1 regulatory framework. <strong>Not to scare. To help you frame failure modes before they happen.</strong>' },
    { type: 'content', eyebrow: '3 verifiable cases · all 2023-24', icon: '1', headlineHtml: 'Mata · Air Canada · <em>Bloomberg study</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('MATA v. AVIANCA · JUN 2023', 'Federal court sanction · $5K', '', '6 ChatGPT-fabricated cases in legal brief. Lawyers sanctioned + ordered letters to falsely-cited judges. <strong>Verify every specific claim.</strong>', 'red')}
${cell('MOFFATT v. AIR CANADA · FEB 2024', 'Chatbot liability · CA$812', '', '"Air Canada is responsible for all information on its website, including from a chatbot." <strong>Anything your team\'s AI says is the company\'s statement.</strong>', 'red')}
${cell('BLOOMBERG STUDY · MAR 2024', 'Reproducible resume bias', '', 'Identical resumes varied only by names — statistically significant bias in GPT ranking. <strong>Methodology + data public on Bloomberg GitHub.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'The personal-data rule', icon: '2', headlineHtml: 'No sensitive data · <em>to free consumer tools</em>',
      blocks: [{ atStep: 1, html: card('THE PERSONAL-DATA RULE', 'What you put into an AI tool may be retained, processed, and in some cases used to train future models', ['Don\'t put client-confidential, regulated, or personally-sensitive info into a free consumer AI account.', '<strong>Use the enterprise version your company has licensed</strong> — OpenAI Enterprise, Anthropic Claude for Work, MS Copilot for M365. Training opt-out + tenant isolation baseline.'], 'What your team needs from you: clarity on which tool for which kind of work. <em>Make the rule explicit.</em>') }] },
    { type: 'content', eyebrow: 'EU AI Act · what managers need to know', icon: '3', headlineHtml: 'Art. 50 transparency · Annex III high-risk · <em>Art. 99 fines</em>',
      blocks: [{ atStep: 1, html: card('EU AI ACT · REG. 2024/1689 · TRANCHES THROUGH AUG 2 2026', 'Published Aug 2024 · tranches through Aug 2026', ['<strong>Art. 50 transparency:</strong> if your team\'s AI interacts with customers or employees, AI must say so.', '<strong>Annex III high-risk:</strong> hiring, credit scoring, biometric ID, education AI affecting access. Higher regulatory bar.', '<strong>Art. 99 fines:</strong> up to €15M or 3% global turnover for high-risk failures.']) }] },
    { type: 'content', eyebrow: 'The 3 risk categories your use cases fall into', icon: '4', headlineHtml: 'Legal · reputational · <em>customer-data</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('LEGAL', 'Fabricated citations · misrepresentation · non-compliance', '', '<strong>Mitigation:</strong> quote-or-cut on AI-generated specific facts.', 'red')}
${cell('REPUTATIONAL', 'Customer-facing AI saying wrong things about products/fees/eligibility', '', '<strong>Mitigation:</strong> retrieval-grounded on actual policy docs.', 'amber')}
${cell('CUSTOMER-DATA', 'Sensitive data in free tools · training-data leakage', '', '<strong>Mitigation:</strong> enterprise terms on every tool that touches sensitive data.', 'amber')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'List top 3 AI use cases · which of 3 risk categories applies to each?', ['<strong>If any has legal or customer-data risk — draft mitigation now. Don\'t wait for the incident.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Leading the team through change · <em>Grove leverage</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 cases · 1 rule · 1 regulation · 3 risk categories.', '<strong>Next:</strong> manager\'s 3 moves · 3 hard conversations · the Grove leverage applied to people leadership.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 95.0, slide: 3 }, { at: 105.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 215.0, slide: 5 }, { at: 225.0, slide: 5, step: 1 }, { at: 265.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

// Ch7
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Leading the team through change' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-leading-change.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · THE HUMAN SIDE', h1Html: 'Model · expect · <em>measure</em>', subtitleHtml: 'Compliance without adoption = worst outcome. <strong>3 manager moves. 3 conversations. Grove leverage applied.</strong>' },
    { type: 'content', eyebrow: 'The WEF context · your team hears this', icon: '1', headlineHtml: '86% transformation · 40% reduction · <em>"my job is changing"</em>',
      blocks: [{ atStep: 1, html: card('THE WEF CONTEXT', '86% expect transformation · 40% expect reduction · these are not contradictory', ['<strong>What your team hears:</strong> "My job is about to change. Possibly disappear."', 'If you don\'t address it, your team won\'t adopt. They\'ll comply. They\'ll not actively use.', '<strong>Compliance without adoption is the worst outcome — pay for the tool, don\'t get the productivity.</strong>']) }] },
    { type: 'content', eyebrow: 'The manager\'s 3 moves', icon: '2', headlineHtml: 'Model the behaviour · set expectations · <em>measure outcomes</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('MOVE 1 · MODEL', 'Visibly use AI in your own work', '', 'In meetings · in emails · in your own decisions. Reference what the AI helped you with. <strong>Not as performance — as honest usage.</strong>')}
${cell('MOVE 2 · EXPECT', 'AI-augmented work is the default', '', 'Performance conversations include AI fluency. New hires evaluated on AI-augmented productivity. <strong>Output expectations calibrated to AI-augmented baselines.</strong>')}
${cell('MOVE 3 · MEASURE', 'Baseline · counterfactual · quality', '', 'Share measurements with the team. Pilot worked → celebrate. Didn\'t → kill cleanly and pick next.')}
</div>` }] },
    { type: 'content', eyebrow: 'The Grove framing applied to people', icon: '3', headlineHtml: '1 hour framing · <em>= tens of hours team output</em>',
      blocks: [{ atStep: 1, html: card('GROVE LEVERAGE APPLIED TO PEOPLE LEADERSHIP', '1 hour framing right AI use case → tens of hours team output. 1 hour running pilot stage-gate → months of productivity.', ['<strong>The opposite — delegating "go figure out AI" to direct reports.</strong> Each direct report independently figures out a different set of tools, prompts, workflows. <em>No leverage. Just fragmentation.</em>'], 'Manager who frames, evaluates, pilots, measures leads. Manager who delegates the leverage decision lags.') }] },
    { type: 'content', eyebrow: 'The 3 conversations · don\'t avoid them', icon: '4', headlineHtml: 'Team · boss · <em>the AI-resistant individual</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('CONVERSATION 1', 'Your team', '', '"Work is changing. AI is a tool we\'re going to learn to use well. Here\'s the pilot · how we\'ll measure · what I expect."')}
${cell('CONVERSATION 2', 'Your boss', '', '"Here\'s our AI plan · what we\'re measuring · what we need from leadership to remove blockers."')}
${cell('CONVERSATION 3', 'The AI-resistant individual', '', 'Senior team member doing work the same way for 15 years. <strong>Don\'t shame. Don\'t threaten. Show the data.</strong> "Active users are doing X. I want you active by next quarter. Here\'s the support."')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick the conversation you\'re most-avoiding · have it this week', ['Team · boss · resistant individual. <strong>Hardest conversation now prevents the harder conversation later.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your 90-day GenAI plan · <em>2 use cases · 4 trip-wires</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '3 moves · 3 conversations · Grove leverage applied. <em>Lead the change.</em>', '<strong>Last chapter:</strong> 90-day plan · pick 2 · 4 trust trip-wires · interactive builder.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 65.0, slide: 3 }, { at: 75.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 270.0, slide: 5, step: 2 },
    { at: 290.0, slide: 6 }, { at: 300.0, slide: 6, step: 1 }
  ]
});

// Ch8
const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],team:'',start:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='usecases'){var arr=state.usecases;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='genai-90-day-plan.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases)_';var t=state.team||'_(name your team)_';var s=state.start||'_(pick start date)_';return '# GenAI · 90-Day Plan\\n\\n**Manager:** ____________________\\n**Team:** '+t+'\\n**Start date:** '+s+'\\n\\n## 2 use cases for the next 90 days\\n'+uc+'\\n\\n## Month 1 · frame + pilot\\n- Use the 4-question framework (task · cost · data · failure mode)\\n- Start pilot in week 3 · single team · 2 use cases · measured against baseline\\n\\n## Month 2 · measure + adjust\\n- Baseline · counterfactual · quality · active-user fraction\\n- Identify what\'s working · adjust workflow + prompts + team support\\n\\n## Month 3 · scale or kill\\n- Stage-gate: pilots that pass → scale · the rest → kill cleanly\\n- Communicate decisions openly\\n\\n## Trust trip-wires (do not cross)\\n- No untested AI in customer-facing or regulated work\\n- No personal/sensitive data to free consumer tools\\n- No AI signs material commitments\\n- No "set and forget" · monthly review of measurement framework\\n\\n---\\nSource: Gennoor Academy · Foundations · Generative AI for Business\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your 90-day GenAI plan' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 90 DAYS · 2 USE CASES', h1Html: 'Pick 2 · pilot · measure · <em>scale or kill</em>', subtitleHtml: '7 chapters · this chapter sequences them.' },
    { type: 'content', eyebrow: 'The principle · 2 not 5', icon: '1', headlineHtml: '2 use cases · <em>90 days · 1 measurement framework</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 90 days · 1 measurement framework', ['Mistake managers make: trying to deploy AI across drafting, summarising, classifying, code, customer-facing all in one quarter.', '<strong>Pick 2. Run them well. Then expand.</strong>']) }] },
    { type: 'content', eyebrow: 'The 90-day sequence', icon: '2', headlineHtml: 'M1 frame+pilot · M2 measure+adjust · <em>M3 scale or kill</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('MONTH 1', 'Frame + pilot', '', '4-question framework on 3 candidates · pick 2 strongest · pilot in week 3 · 1 team · 2 use cases · measured against baseline.', 'green')}
${cell('MONTH 2', 'Measure + adjust', '', 'Baseline · counterfactual · quality · active-user fraction. Identify working/not. Adjust workflow + prompts + support.', 'amber')}
${cell('MONTH 3', 'Scale or kill', '', 'Stage-gate. Passes → scale. Doesn\'t → kill cleanly. <strong>Communicate openly.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No untested AI in customer-facing/regulated work', '', 'Until failure mode is measured, customer-facing AI is reputational risk.', 'red')}
${cell('TRIP-WIRE 2', 'No personal/sensitive data to free tools', '', 'Enterprise terms required. Training opt-out + tenant isolation.', 'red')}
${cell('TRIP-WIRE 3', 'No AI signs material commitments', '', 'Customer contracts · legal statements · policy decisions. <strong>A human signs.</strong>', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Monthly review of measurement framework. <strong>Adjust based on data, not opinion.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your 90-day plan', icon: '✓', headlineHtml: 'Pick · download · <em>take to your boss + team</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases for your team</h5><div class="preset" data-group="usecases">
<button data-val="Drafting (emails, reports, summaries — first drafts)">Drafting</button>
<button data-val="Summarising (long documents, transcripts, papers)">Summarising</button>
<button data-val="Translating (between languages, registers, audiences)">Translating</button>
<button data-val="Classifying + extracting (tag emails, pull data points)">Classifying</button>
<button data-val="Code generation (Copilot, Cursor, Claude Code)">Code generation</button>
<button data-val="Critique my draft (find the 3 weakest arguments)">Critique drafts</button>
</div></div>
<div class="group"><h5>Your team</h5><div class="preset" data-group="team">
<button data-val="Direct team (3-8 people I manage)">Direct team</button>
<button data-val="Department (15-50 people across teams)">Department</button>
<button data-val="Cross-functional pilot group (curious volunteers)">Cross-functional volunteers</button>
</div></div>
<div class="group"><h5>Start date</h5><div class="preset" data-group="start">
<button data-val="This Monday">This Monday</button>
<button data-val="First Monday of next month">First Monday next month</button>
<button data-val="Start of next quarter">Next quarter</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my 90-day GenAI plan (.md)</button>
</div>
<div class="preview" id="preview"># GenAI · 90-Day Plan

Pick 2 use cases, team, and start date on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Framing · evaluating · piloting · <em>measuring</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Framing beats using · evaluating beats trusting · piloting beats deploying · measuring beats hoping · the manager who builds these 4 skills leads the team that captures the productivity gains.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one conversation with your boss on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 50.0, slide: 3 }, { at: 60.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 },
    { at: 220.0, slide: 6 }, { at: 230.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 16 chapters 1-8 built.');
