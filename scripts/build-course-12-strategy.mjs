// Build Course 12 chapter HTMLs — AI Strategy for the C-Suite (Andrew · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Leadership · AI Strategy for the C-Suite';
const OUT = 'tmp/academy-build/ai-strategy-c-suite/chapters';

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

// Ch1 — landscape
emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The strategic landscape 2026' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-strategic-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · LANDSCAPE 2026', h1Html: '$33.9B invested · <em>under 30% delivers value</em>', subtitleHtml: 'Stanford AI Index 2025. McKinsey 71% gen-AI use. <strong>BCG/MIT: leaders capture 1.5–2x growth. The discipline is the gap — not the technology.</strong>' },
    { type: 'content', eyebrow: 'Investment + deployment · Stanford + McKinsey 2025', icon: '1', headlineHtml: 'Capital flowing at scale · <em>value capture lagging</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('STANFORD AI INDEX 2025', 'Corporate AI investment 2024', '$33.9B', 'Private GenAI alone: $25.2B. ~5x the 2022 number.')}
${cell('McKINSEY STATE OF AI 2025', 'Regularly using gen AI', '71%', '50% report cost savings or revenue lift in at least one function.')}
${cell('GARTNER 2025', 'AI projects delivering value', '<30%', 'Two-thirds-plus don\'t. <strong>Not technology. Capital discipline.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Winners vs laggards · BCG/MIT 2024', icon: '2', headlineHtml: 'Leaders capture <em>1.5–2x growth</em> + 60% better cost productivity',
      blocks: [{ atStep: 1, html: cardGreen('BCG / MIT · AI MATURITY RESEARCH 2024', 'Same industries · same conditions · different discipline', ['AI leaders capture 1.5–2.0x revenue growth + 60% better cost productivity than laggards.', '<strong>What makes a leader:</strong> concentrated capital (2-3 patterns, not 7), talent + org design that matches, measurement frameworks from day one.'], 'Chapters 2-4 cover each.') }] },
    { type: 'content', eyebrow: 'CEO view · IBM IBV + KPMG 2025', icon: '3', headlineHtml: '64% see competitive edge · <em>43% have productivity gains</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('IBM IBV CEO STUDY 2025', 'Competitive advantage depends on most advanced gen AI', '64%', 'But only 43% report productivity gains. <strong>The gap is execution.</strong>')}
${cell('KPMG CEO OUTLOOK 2024-25', 'Top investment priority next 3 years', '70%', 'Capital is committed. The question is execution.')}
</div>` }] },
    { type: 'content', eyebrow: 'The board question + the thesis', icon: '4', headlineHtml: 'Which side of the gap · <em>are you on?</em>',
      blocks: [
        { atStep: 1, html: card('THE BOARD QUESTION', 'If two-thirds of peers think AI advantage is decisive but only 40% are getting measurable gains — which side of the gap is your company on?', ['Not whether to invest. <strong>Where in the curve you sit.</strong>']) },
        { atStep: 2, html: card('THE THESIS', 'Capital discipline · talent design · governance posture · momentum past year 1', ['Winners over the next 24 months are not the ones who spent the most. <strong>They picked the right 2 value patterns, allocated with discipline, designed the org to absorb it, and held the governance line.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next · the 8-chapter map', icon: '→', headlineHtml: '4 disciplines · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Capital discipline. Talent design. Governance posture. Momentum.', '<strong>Next:</strong> the 4 AI value patterns — productivity · products · decisions · automation. Pick 2 of 4 for the next 24 months.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 235.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

// Ch2 — 4 value patterns
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'The 4 AI value patterns' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-value-patterns.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · PICK 2 OF 4', h1Html: 'Productivity · products · <em>decisions · automation</em>', subtitleHtml: 'Most CEOs over-index on one and ignore the other three. <strong>Pick 2 for the next 24 months. Not all 4.</strong>' },
    { type: 'content', eyebrow: 'Pattern 1 · productivity · MIT/BCG/Harvard/Goldman 2023-24', icon: '1', headlineHtml: '15–40% gains · <em>~30% MS Work Trend Index</em>',
      blocks: [{ atStep: 1, html: cardGreen('PRODUCTIVITY', 'Drafting · summarising · classifying · translating · code', ['MIT, BCG, Harvard, Goldman 2023-24: 15–40% productivity gains on knowledge work for AI-augmented workers.', 'MS Work Trend Index: ~30% time saved on routine docs for <strong>active</strong> Copilot users.'], '<strong>The trap:</strong> productivity gains are real but easy to over-claim. Measure carefully. Chapter 7 on the audit committee question.') }] },
    { type: 'content', eyebrow: 'Pattern 2 · products · the customer-facing bet', icon: '2', headlineHtml: 'AI in your offering · <em>largest revenue · largest risk</em>',
      blocks: [{ atStep: 1, html: card('PRODUCTS', 'Salesforce Agentforce · MS Sales Agent · Intercom Fin · Zendesk AI · your own product team', ['Largest revenue upside. <strong>And the largest risk surface.</strong>', 'Air Canada Moffatt (BC CRT Feb 2024) — chatbot promised a refund the airline didn\'t offer. <em>A product-facing AI failure becomes the company\'s statement.</em>'], 'Pick if your business model is product-led. Then invest in the controls — chapter 5 on governance.') }] },
    { type: 'content', eyebrow: 'Pattern 3 · decisions · the defensible bet', icon: '3', headlineHtml: 'Structured data + model · <em>narrow tasks, mature methodology</em>',
      blocks: [{ atStep: 1, html: card('DECISIONS', 'Forecasting · pricing · routing · classification · risk scoring', ['Demand forecasting in supply chain. Credit decisioning in finance. Customer churn. Pricing dynamics.', '<strong>ML-on-structured-data has been delivering value since long before generative AI.</strong> Mature pattern. Well-understood risks.', 'Bloomberg resume study (Mar 2024) — cautionary tale on decisions involving people.'], 'Most defensible to the board: specific · measurable · decades of methodology.') }] },
    { type: 'content', eyebrow: 'Pattern 4 · automation · the frontier bet', icon: '4', headlineHtml: 'Agentic workflows · <em>most-pitched · least-mature</em>',
      blocks: [
        { atStep: 1, html: card('AUTOMATION', 'AI orchestrating workflows end-to-end', ['Working: back-office workflows with clear inputs/outputs/hand-offs.', '<strong>Not working yet:</strong> open-ended customer interactions · complex judgement · anything regulated where wrong answers cost money.'], 'The frontier. Most-pitched of 2026, least-mature. Approach with same discipline as the other 3: pilot · measure · decide.') },
        { atStep: 2, html: card('THE PORTFOLIO QUESTION', 'Pick 2 of 4 · not all 4', ['<strong>Productivity</strong> — safest bet, broadest applicability.', '<strong>Products</strong> — highest-upside, highest-risk.', '<strong>Decisions</strong> — most-defensible to the board.', '<strong>Automation</strong> — bet of the future, choose if your industry permits.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Capital allocation · <em>3 rules</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 patterns · pick 2 · concentrate.', '<strong>Next:</strong> 3 rules of capital allocation. Concentrate · stage-gate · measure. Be in the 25% with measurement frameworks.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

// Ch3 — Capital allocation
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Capital allocation' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-capital-allocation.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · THE CFO CHAPTER', h1Html: 'Concentrate · stage-gate · <em>measure</em>', subtitleHtml: 'Gartner under-30% delivers value. Deloitte: only 25% have measurement frameworks. <strong>Be in the 25%.</strong>' },
    { type: 'content', eyebrow: 'The warning · Gartner 2025', icon: '!', iconRed: true, headlineHtml: 'Under 30% delivers value · <em>not technology · lack of discipline</em>',
      blocks: [{ atStep: 1, html: cardRed('GARTNER 2025', '<30% of AI projects deliver measurable business value · two-thirds-plus don\'t', ['Most failure is not technology. <strong>It\'s lack of capital discipline.</strong>', 'What that looks like: 20 pilots running in parallel · 3 internal CoEs competing for budget · no measurement · no kill criteria.'], 'If this sounds familiar — your AI investment is in the 70% that won\'t deliver.') }] },
    { type: 'content', eyebrow: 'Rule 1 · concentrate', icon: '1', headlineHtml: '2 patterns · 3–5 use cases · <em>not 20</em>',
      blocks: [{ atStep: 1, html: card('RULE 1 · CONCENTRATE', 'From chapter 2: pick 2 of 4 value patterns · within those, 3–5 use cases', ['BCG and MIT data is unambiguous: <strong>leaders capture 1.5–2x growth because they concentrated.</strong> Laggards spread thin and got under-water on every initiative.'], 'Practical move: if your AI portfolio has more than 7 active initiatives across the business, you\'re already in the laggard cohort. Cut to 3.') }] },
    { type: 'content', eyebrow: 'Rule 2 · stage-gate', icon: '2', headlineHtml: '3 gates · pilot · scale · <em>embed</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('GATE 1 · PILOT', 'Prove it works in 1 team for 1 quarter', '', 'Kill or fund decision.')}
${cell('GATE 2 · SCALE', 'Prove productivity/revenue claim at 10x users', '', 'Kill or fund decision.')}
${cell('GATE 3 · EMBED', 'Prove team uses it without prompting after 3 months', '', 'Kill or fund decision.')}
</div>` }, { atStep: 1, html: card('EACH GATE HAS A KILL DECISION', 'If a pilot doesn\'t pass its gate, you kill it cleanly', ['No "let\'s keep it running a bit longer." <strong>That\'s how capital evaporates.</strong>']) }] },
    { type: 'content', eyebrow: 'Rule 3 · measure · Deloitte 2025', icon: '3', headlineHtml: 'Only 25% have measurement frameworks · <em>be in the 25%</em>',
      blocks: [
        { atStep: 1, html: card('RULE 3 · MEASURE · DELOITTE 2025 SURVEYS', 'Only 25% of orgs have measurement frameworks tied to AI · 75% flying blind', ['<strong>Baseline before</strong> — what was the time/cost/accuracy before AI.', '<strong>Counterfactual</strong> — what would have happened without the investment.', '<strong>Quality controls</strong> — re-work, verification, customer satisfaction.', '<strong>Net delta</strong> — what was the actual value capture.'], 'Not exotic. Just rigour applied consistently. Companies that measure win the next board capital-allocation conversation.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull every AI initiative · sort by funding · check measurement framework per initiative over $100K', ['If you can\'t answer in one sentence per initiative — <strong>that\'s the work.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Talent + org design · <em>the CoE trap</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Concentrate · stage-gate · measure. <em>3 rules. Be in the 25%.</em>', '<strong>Next:</strong> WEF 86% expect transformation · 3 talent moves · the CoE trap · hub-and-spoke + AI council.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

// Ch4 — Talent + org design
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Talent and org design' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-talent-org.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · ORG REDESIGN', h1Html: '3 talent moves · <em>hub-and-spoke + AI council</em>', subtitleHtml: 'WEF Future of Jobs 2025: 86% expect transformation · 40% expect reduction. <strong>Pure CoEs fail. The AI council pattern wins.</strong>' },
    { type: 'content', eyebrow: 'The WEF context · Future of Jobs 2025', icon: '1', headlineHtml: '86% transformation · <em>40% reduction · not contradictory</em>',
      blocks: [{ atStep: 1, html: card('WEF FUTURE OF JOBS 2025', '~40% of employers expect AI/automation to reduce parts of workforce by 2030 · 86% expect transformation', ['Some reduction. Mostly transformation. The work of the median employee will change materially over 24-36 months.', '<strong>Companies that plan for that win. Companies that don\'t are managing a downstream productivity crisis.</strong>']) }] },
    { type: 'content', eyebrow: 'The 3 talent moves · sequenced', icon: '2', headlineHtml: 'AI-native operators · senior upskill · <em>specialist team</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('MOVE 1', 'Identify AI-native operators within your workforce', '', 'Employees who self-identify when given a free Copilot — using it for 2/3 of drafting within a month. <strong>Find them. Give them more.</strong>')}
${cell('MOVE 2', 'Upskill the existing senior layer', '', 'Mid + senior managers running teams. Without them, AI adoption stalls at individual level. <strong>2-day immersions + monthly office hours. Not a one-off.</strong>')}
${cell('MOVE 3', 'Hire a small specialist team', '', '5-10 people: ML, applied AI, AI product management. <strong>Not a department of 50.</strong> A specialist team that supports the rest.')}
</div>` }] },
    { type: 'content', eyebrow: 'The CoE trap', icon: '!', iconRed: true, headlineHtml: 'Pure CoEs fail · <em>ownership and accountability split</em>',
      blocks: [{ atStep: 1, html: cardRed('THE COE TRAP', 'Most large companies set up an AI CoE in 2023-24 · by 2026 the data is clear · pure CoEs fail', ['CoE owns the AI but not the business. Business owns the P&L but not the AI. <strong>Decision authority and accountability split.</strong> Initiatives stall in the middle.'], 'Fix: the AI council pattern.') }] },
    { type: 'content', eyebrow: 'The structural fix · AI council + hub-and-spoke', icon: '✓', iconGreen: true, headlineHtml: 'Council + specialist hub + <em>embedded spokes</em>',
      blocks: [
        { atStep: 1, html: cardGreen('AI COUNCIL · HUB-AND-SPOKE', 'Small body (8-12 people) · meets every 2 weeks · joint decision authority', ['<strong>Hub:</strong> small specialist team.', '<strong>Spokes:</strong> embedded AI-native operators in each business unit.', '<strong>Council:</strong> specialist team + BU leaders.', 'Sets priorities. Approves investment. Kills failing pilots.'], 'CoE if you keep it: narrow it. Owns standards/tooling/infrastructure. Doesn\'t own outcomes. BUs own outcomes.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Next 30 days · name the AI council members · first meeting agenda', ['8-12 people. Right specialist + BU mix.', 'First agenda: review pilot list · prioritise 3 · set kill criteria for the rest.', '<strong>If you can\'t get that meeting in the calendar, the org doesn\'t yet have the structure to absorb AI strategy.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Governance · <em>EU AI Act + NIST + Mata/Air Canada</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 moves · 1 council · 1 structure. <em>Hub-and-spoke wins.</em>', '<strong>Next:</strong> 4-pillar governance · EU AI Act Annex III · US executive order landscape · NIST AI RMF · cross-domain liability from Mata + Air Canada.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 65.0, slide: 3 }, { at: 75.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

// Ch5 — Governance
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Governance the regulators accept' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-governance.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · 4-PILLAR POSTURE', h1Html: 'EU · US · NIST · <em>Mata + Air Canada</em>', subtitleHtml: 'Not optional in 2026. <strong>EU AI Act tranches through Aug 2 2026. NIST AI RMF as de facto US standard. 4-pillar governance + Big-4 audit posture.</strong>' },
    { type: 'content', eyebrow: 'EU AI Act · Reg. 2024/1689 · tranches through Aug 2 2026', icon: '1', headlineHtml: 'Annex III · Art. 50 transparency · <em>Art. 99 fines up to 3% of turnover</em>',
      blocks: [{ atStep: 1, html: card('EU AI ACT · REG. 2024/1689', 'Published Aug 2024 · in tranches through Aug 2 2026', ['<strong>Art. 6+:</strong> high-risk AI obligations.', '<strong>Art. 50:</strong> transparency for AI interacting with persons.', '<strong>Art. 99:</strong> fines up to €35M or 7% global turnover (prohibited AI) · €15M or 3% (high-risk).'], 'If your company operates in the EU OR serves EU customers — you\'re covered. Even if you\'re outside the EU. <em>This is the global regulatory baseline.</em>') }] },
    { type: 'content', eyebrow: 'US landscape · in flux', icon: '2', headlineHtml: 'NIST AI RMF · <em>de facto US standard</em>',
      blocks: [{ atStep: 1, html: card('US AI POLICY · 2023-2026', 'Biden EO 14110 (Oct 2023) · partially rescinded by Trump (Jan 2025) · AI Action Plan 2025 (private-sector innovation focus)', ['<strong>De facto US standard:</strong> NIST AI RMF 1.0 (Jan 2023) + Generative AI Profile (July 2024). Voluntary federal framework. Increasingly adopted by enterprise risk committees.', 'State-level: NYC LL144 (hiring AI) · Illinois AIVIA · Colorado SB24-205 (AI Act effective Feb 2026). Patchwork.']) }] },
    { type: 'content', eyebrow: 'The 4-pillar governance · every AI program needs', icon: '3', headlineHtml: 'Scope · risk classification · <em>monitoring · audit</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('PILLAR 1 · SCOPE', 'In + out', '', 'Which AI systems are in scope · which are out. Documented · updated quarterly.')}
${cell('PILLAR 2 · RISK', 'Tier per system', '', 'Use EU AI Act framing: minimal · limited · high-risk · prohibited. Common language even if you don\'t operate in EU.')}
${cell('PILLAR 3 · MONITORING', 'What you measure', '', 'Bias drift · accuracy degradation · customer complaints. <strong>Reported to AI council.</strong>')}
${cell('PILLAR 4 · AUDIT', 'Internal + external', '', 'Documentation that can withstand both.')}
</div>` }] },
    { type: 'content', eyebrow: 'Cross-domain liability · Mata + Air Canada', icon: '!', iconRed: true, headlineHtml: 'Any AI output is your statement · <em>regardless of who wrote it</em>',
      blocks: [
        { atStep: 1, html: cardRed('MATA v. AVIANCA + MOFFATT v. AIR CANADA', '2 cases · 1 principle · global common-law precedent', ['<strong>Mata v. Avianca (S.D.N.Y. Jun 2023):</strong> lawyers sanctioned for ChatGPT-fabricated citations.', '<strong>Moffatt v. Air Canada (BC CRT Feb 2024):</strong> Air Canada held responsible for chatbot commitments. <em>"Air Canada is responsible for all information on its website, including from a chatbot."</em>'], 'Principle: any AI output your company ships is your company\'s statement. Doesn\'t matter that the AI generated it. <strong>Anything customer-facing or board-facing gets human review before it ships.</strong>') },
        { atStep: 2, html: card('MONDAY MOVE', 'AI council writes a 2-page governance posture document this month', ['4 pillars · risk classification per active AI system · reviewed by GC · signed off by audit committee.', '<strong>Without this document, your AI strategy isn\'t audit-ready.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Sustaining momentum · <em>kill 2 of every 3 pilots</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 pillars · 4 jurisdictions · 1 governance document. <em>Audit-ready posture.</em>', '<strong>Next:</strong> the year-2 trap · how to kill pilots · how to scale one · vendor safety frameworks.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 }
  ]
});

// Ch6 — Momentum
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Sustaining momentum past year 1' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-momentum.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · THE YEAR-2 TRAP', h1Html: 'Kill 2 of 3 · scale 1 · <em>make AI the default</em>', subtitleHtml: 'Pilot proliferation · no scaling · capital evaporates. <strong>3 fixes. The AI council from chapter 4 owns the kill decision.</strong>' },
    { type: 'content', eyebrow: 'The year-2 trap', icon: '!', iconRed: true, headlineHtml: '12 underfunded experiments · <em>none has resources to move the business</em>',
      blocks: [{ atStep: 1, html: cardRed('THE YEAR-2 TRAP', 'Year 1: 6 pilots launched · year 2: 6 more · none of the first 6 scaled · none of the next 6 will either', ['Org is now running 12 underfunded experiments. None has resources to actually move the business.', 'Why: <strong>killing a pilot feels like failure.</strong> Sponsors fight to keep theirs alive. CoE doesn\'t have kill authority. Capital spreads thinner.']) }] },
    { type: 'content', eyebrow: 'Fix 1 · kill 2 of every 3 pilots at year-end', icon: '1', headlineHtml: 'No exceptions · <em>even ones with executive sponsorship</em>',
      blocks: [{ atStep: 1, html: card('FIX 1 · KILL DISCIPLINE', 'AI council from chapter 4 owns this decision · stage-gate criteria', ['Did the pilot pass its measurement framework? <strong>Yes → fund to scale. No → kill cleanly. Don\'t extend.</strong>'], 'Optics: killing pilots looks like setback. It\'s actually concentration. The 2 you keep get 5x the resources. <em>That\'s how scaling happens.</em>') }] },
    { type: 'content', eyebrow: 'Fix 2 · scale one with discipline', icon: '2', headlineHtml: '10x users · <em>by embedding, not by marketing</em>',
      blocks: [{ atStep: 1, html: card('FIX 2 · SCALE = EMBED', 'The pilot that passes goes to 10x users · by embedding in the core workflow', ['<strong>Embed:</strong> the tool is the default. People don\'t have to remember to use it. First thing that opens in their morning workflow. Friction engineered out.', 'MS Work Trend Index ~30% productivity gain — <strong>only kicks in for active users. Embedding creates active users.</strong>']) }] },
    { type: 'content', eyebrow: 'Fix 3 · AI-augmented work as default', icon: '3', headlineHtml: 'Not optional shiny tool · <em>the expected baseline</em>',
      blocks: [
        { atStep: 1, html: card('FIX 3 · DEFAULT WORK', 'Manager-level reinforcement · performance conversations · new-hire evaluation · output expectations', ['Performance conversations include AI fluency.', 'New hires evaluated on AI-augmented productivity.', '<strong>Output expectations calibrated to AI-augmented baselines, not pre-AI baselines.</strong>', 'Uncomfortable. Also how durable adoption happens.'], 'Anthropic Responsible Scaling Policy + OpenAI Preparedness Framework — vendor safety frameworks for frontier model release 2023-25. Worth knowing. Frontier-model layer is being actively governed by vendors.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Next AI council meeting · agenda item: which pilots are we killing this quarter?', ['<strong>No agenda is complete without it.</strong>', 'The council that doesn\'t kill anything is not exercising capital discipline. It\'s running theatre.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Board reporting · <em>1-page dashboard · 5 metrics</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Kill · scale · default. <em>Capital discipline beats pilot proliferation.</em>', '<strong>Next:</strong> the 1-page board AI dashboard · 5 metrics · Big-4 audit committee questions · Tetlock calibration on internal claims.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 170.0, slide: 5 }, { at: 180.0, slide: 5, step: 1 }, { at: 220.0, slide: 5, step: 2 },
    { at: 245.0, slide: 6 }, { at: 255.0, slide: 6, step: 1 }
  ]
});

// Ch7 — Board reporting
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Board reporting' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-board-reporting.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · BOARD-READY', h1Html: '5 metrics · 1 page · <em>calibrated confidence</em>', subtitleHtml: 'Tetlock: calibration > confidence. <strong>Audit committees increasingly require AI-use disclosure.</strong> Have answers in one minute per question.' },
    { type: 'content', eyebrow: 'The principle · Tetlock 20+ years', icon: '1', headlineHtml: 'Calibrated 70% beats <em>over-confident 80%</em>',
      blocks: [{ atStep: 1, html: card('TETLOCK · CALIBRATION OVER CONFIDENCE', 'The 70%-and-right person beats the 100%-confident person', ['Apply to AI reporting. When you tell the board "AI saved 3,000 hours this quarter," the board\'s question is — <strong>how do you know.</strong>', 'Have the answer ready. <em>That\'s calibration.</em>']) }] },
    { type: 'content', eyebrow: 'The 5 metrics · 1-page board dashboard', icon: '2', headlineHtml: 'Investment · productivity · risk · regulatory · <em>talent</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('METRIC 1', 'Investment', '', 'Capital deployed this quarter + YTD · broken out by value pattern.')}
${cell('METRIC 2', 'Productivity', '', 'Measured time savings or revenue impact. <strong>Not "users feel productive." Measured.</strong>')}
${cell('METRIC 3', 'Risk register', '', 'Open · new · resolved issues. Bias monitoring · customer complaints.')}
${cell('METRIC 4', 'Regulatory', '', 'EU AI Act readiness · NIST AI RMF alignment · state compliance status.')}
${cell('METRIC 5', 'Talent', '', 'AI council attendance · specialist team headcount · training completion rates.')}
</div>` }] },
    { type: 'content', eyebrow: 'The audit committee question · Big-4 2024-25', icon: '3', headlineHtml: 'AI-use disclosure · <em>increasingly mandatory in MD&amp;A</em>',
      blocks: [{ atStep: 1, html: card('BIG-4 ADVISORY 2024-25 · AUDIT COMMITTEE FOCUS', 'Audit committees increasingly require AI-use disclosure in management discussions and analysis', ['<strong>"What AI tools touched this period\'s financial reporting?"</strong> Have an inventory.', '<strong>"What controls are in place over those tools?"</strong> Quad-eye on material entries.', '<strong>"Where are we on EU AI Act readiness?"</strong> One sentence per quadrant.'], 'If you can\'t answer in one minute per question, you have an audit-readiness problem.') }] },
    { type: 'content', eyebrow: 'The calibration discipline · confidence labels', icon: '4', headlineHtml: 'Strong evidence · suggestive · <em>vendor claim only</em>',
      blocks: [
        { atStep: 1, html: card('CONFIDENCE LABELS ON THE DASHBOARD', 'Every productivity number has a confidence range', ['<strong>Strong evidence — green.</strong> Controlled experiment or A/B test.', '<strong>Suggestive evidence — amber.</strong> Survey or observational data.', '<strong>Vendor claim only — red, requires validation.</strong>'], 'Unusual. Builds board trust. Because boards have been pitched too many over-confident AI numbers in too many quarterly reviews.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Draft your 1-page AI dashboard this week', ['5 metrics. Confidence-labelled where relevant.', 'Take it to CEO or audit committee chair. Iterate. <strong>The dashboard that gets traction is the one the board can read in 2 minutes.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your AI strategy · <em>on one page</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Calibrated confidence · 5 metrics · audit-ready. <em>1 page.</em>', '<strong>Last chapter:</strong> the operating one-pager · 4 trust trip-wires · course summary.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

// Ch8 — One pager
const ch8BuilderInit = `
var builderInit=false;var state={patterns:[],envelope:'',governance:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='patterns'){var arr=state.patterns;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-strategy-one-pager.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.patterns.length?state.patterns.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 value patterns)_';var e=state.envelope||'_(pick capital envelope)_';var g=state.governance||'_(pick governance baseline)_';return '# AI Strategy · 1-Page Operating Plan\\n\\n**CEO/CIO/CDO:** ____________________\\n**Date:** ____________________\\n\\n## 2 value patterns (next 24 months)\\n'+p+'\\n\\n## Capital envelope\\n> '+e+'\\n\\n## AI council\\n- Members: 8-12 (specialist team + business-unit leaders)\\n- Cadence: every 2 weeks\\n- Owns: priorities · investment · kill decisions\\n\\n## Governance posture\\n> '+g+'\\n\\n## Trust trip-wires (do not cross)\\n- No untested model in regulated decisions\\n- No vendor lock-in without exit clause\\n- No AI-generated board content unverified (Mata principle)\\n- No "set and forget" · quarterly council review + board dashboard\\n\\n---\\nSource: Gennoor Academy · Leadership · AI Strategy for the C-Suite\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your AI strategy on one page' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · ONE PAGE', h1Html: '2 patterns · 1 envelope · 1 council · <em>1 governance posture</em>', subtitleHtml: '7 chapters collapse to 4 pieces · on one page · pinned behind your desk.' },
    { type: 'content', eyebrow: 'The principle · not 5 pieces, 4', icon: '1', headlineHtml: '4 pieces · <em>fits on one page · survives board review</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', '2 value patterns · 1 capital envelope · 1 AI council · 1 audit-ready governance posture', ['Not 5. Not 7. <strong>4 pieces.</strong>', 'Anything bigger doesn\'t fit on one page and won\'t survive board review.']) }] },
    { type: 'content', eyebrow: 'The 4 pieces · 1-pager structure', icon: '2', headlineHtml: '4 pieces · <em>3 sentences of defence each</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('PIECE 1', '2 value patterns', '', 'Productivity · products · decisions · automation. <strong>Pick 2. Defend in 3 sentences.</strong>')}
${cell('PIECE 2', 'Capital envelope', '', 'Budget · staging · kill criteria.')}
${cell('PIECE 3', 'AI council', '', 'Who · how often · what it owns.')}
${cell('PIECE 4', 'Governance posture', '', 'EU AI Act + NIST + risk classification + audit-ready docs.')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No untested model in regulated decisions', '', 'Credit · hiring · healthcare · anything regulated. <strong>Formal control framework required.</strong>', 'red')}
${cell('TRIP-WIRE 2', 'No vendor lock-in without exit clause', '', 'Every AI vendor contract has data-portability + migration clauses. <strong>No exceptions.</strong>', 'red')}
${cell('TRIP-WIRE 3', 'No unverified AI in board content', '', 'The Mata principle. Every specific claim checked against primary source before it leaves the CEO\'s desk.', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly council review · quarterly board dashboard. <strong>The strategy that isn\'t measured is not a strategy.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your 1-pager', icon: '✓', headlineHtml: 'Pick · download · <em>take to CEO / board chair</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 value patterns (next 24 months)</h5><div class="preset" data-group="patterns">
<button data-val="Productivity (drafting, summarising, knowledge-work augmentation)">Productivity</button>
<button data-val="Products (customer-facing AI features, agentic CS)">Products</button>
<button data-val="Decisions (forecasting, pricing, routing, scoring)">Decisions</button>
<button data-val="Automation (end-to-end workflows, back-office)">Automation</button>
</div></div>
<div class="group"><h5>Capital envelope</h5><div class="preset" data-group="envelope">
<button data-val="Conservative: 0.5-1% of opex, 3 use cases">Conservative</button>
<button data-val="Moderate: 1-3% of opex, 5-7 use cases, stage-gated">Moderate</button>
<button data-val="Aggressive: 3-5% of opex, transformative bets with kill criteria">Aggressive</button>
</div></div>
<div class="group"><h5>Governance baseline</h5><div class="preset" data-group="governance">
<button data-val="EU AI Act + NIST AI RMF + audit-committee-aligned controls">EU + NIST + audit</button>
<button data-val="NIST AI RMF + US state patchwork (NYC/IL/CO)">US-focused</button>
<button data-val="Multi-jurisdiction (EU + US + India DPDPA + ABA)">Multi-jurisdiction</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my AI strategy one-pager (.md)</button>
</div>
<div class="preview" id="preview"># AI Strategy · 1-Page Operating Plan

Pick value patterns, capital envelope, and governance on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Capital discipline · talent design · governance · <em>momentum</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Pick 2 value patterns not 7 · concentrate capital with stage gates · measure before you scale · hub-and-spoke org with an AI council · 4-pillar governance the regulators accept · kill 2 of every 3 pilots at year-end · 1-page board dashboard with calibrated confidence · AI-augmented work as the default not the optional.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one board chair or CEO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 105.0, slide: 4 }, { at: 115.0, slide: 4, step: 1 },
    { at: 170.0, slide: 5 }, { at: 180.0, slide: 5, step: 1 },
    { at: 215.0, slide: 6 }, { at: 225.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 12 chapters 1-8 built.');
