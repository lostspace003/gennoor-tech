// Build Course 13 chapter HTMLs — AI Governance, Risk & Boards (Emma · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Leadership · AI Governance, Risk & Boards';
const OUT = 'tmp/academy-build/ai-governance-risk-boards/chapters';

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
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The 2026 governance landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-governance-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · NO LONGER OPTIONAL', h1Html: 'EU AI Act · NIST · ISO 42001 · <em>state laws · India DPDPA</em>', subtitleHtml: '<strong>The boards that handle governance well in the next 24 months build a defensible posture. The boards that don\'t will be answering uncomfortable proxy + regulator questions.</strong>' },
    { type: 'content', eyebrow: 'EU AI Act · Reg. 2024/1689 · Aug 2024–Aug 2026', icon: '1', headlineHtml: 'Annex III · Art. 26 · Art. 50 · <em>Art. 99 fines up to 7% turnover</em>',
      blocks: [{ atStep: 1, html: card('EU AI ACT · REGULATION 2024/1689', 'Published Aug 2024 · in tranches through Aug 2 2026', ['<strong>Annex III:</strong> lists high-risk AI categories.', '<strong>Art. 6-29:</strong> obligations for high-risk AI.', '<strong>Art. 50:</strong> transparency for AI interacting with persons.', '<strong>Art. 99 fines:</strong> up to €35M or 7% global turnover (prohibited AI) · €15M or 3% (high-risk).'], 'Not theoretical numbers. Written into law.') }] },
    { type: 'content', eyebrow: 'NIST AI RMF · de facto US standard', icon: '2', headlineHtml: '4 functions · <em>Govern · Map · Measure · Manage</em>',
      blocks: [{ atStep: 1, html: card('NIST AI RMF 1.0 · JAN 2023 + GENERATIVE AI PROFILE JUL 2024', 'Voluntary federal guidance · increasingly the de facto US standard', ['4 functions: Govern · Map · Measure · Manage. Generative AI Profile companion extends to gen-AI-specific risks.', 'Adopted by enterprise risk committees · federal agencies · insurance underwriters.', '<strong>If you\'re US-based or US-listed in 2026 — you should be NIST-aligned. Even if no law requires it.</strong>']) }] },
    { type: 'content', eyebrow: 'ISO 42001 + state laws + India', icon: '3', headlineHtml: 'Auditable certification · <em>state patchwork · India DPDPA</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('ISO/IEC 42001:2023', 'AI Management System standard', '', 'Auditable certification (Dec 2023). Similar shape to ISO 27001 for security. Boards in regulated industries: know if your company is pursuing it.')}
${cell('US STATE PATCHWORK', 'NYC LL144 · IL AIVIA · CO SB24-205', '', '<strong>Build to Colorado + EU as floor</strong> — satisfies most state requirements in practice.')}
${cell('INDIA DPDPA 2023', 'Rules finalised 2025', '', 'Data fiduciary obligations · breach notification · penalties up to ₹250 crore per violation.')}
</div>` }] },
    { type: 'content', eyebrow: 'OECD + the thesis · audit-defensible', icon: '4', headlineHtml: '47+ countries converging · <em>audit-defensible is the bar</em>',
      blocks: [
        { atStep: 1, html: card('OECD AI PRINCIPLES · 2019 · UPDATED 2024', 'Global voluntary framework adopted by 47+ countries', ['Aligned with NIST + EU AI Act in substance.', '<strong>This is the framework regulators globally are converging toward.</strong>']) },
        { atStep: 2, html: card('THE THESIS', 'AI governance in 2026 is no longer a checkbox exercise', ['Boards that handle this well in next 24 months build a defensible posture.', '<strong>Boards that don\'t will be answering uncomfortable questions in proxy statements and regulator inquiries.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · 1 through-line · <em>audit-defensible posture</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Audit-defensible posture · calibration over confidence · concrete obligations · not abstract principles.', '<strong>Next:</strong> AI risk classification — EU 4-tier · NIST context-based · the 5-category risk taxonomy.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

// Ch2
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'AI risk classification' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-risk-classification.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · CLASSIFY OR DRIFT', h1Html: 'EU 4 tiers · <em>NIST context · 5-category taxonomy</em>', subtitleHtml: 'If you can\'t classify, you can\'t govern. <strong>The 2 frameworks compose. Use EU tiering as the categorisation framework. NIST context-based assessment within each tier.</strong>' },
    { type: 'content', eyebrow: 'EU AI Act tiers · 4 levels', icon: '1', headlineHtml: 'Prohibited · high-risk · limited · <em>minimal</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('PROHIBITED', 'Social scoring · real-time biometric ID · vulnerable-people manipulation', '', 'Banned. <strong>Art. 99 fines up to 7% global turnover.</strong>', 'red')}
${cell('HIGH-RISK · ANNEX III', 'Employment · education · critical infra · law enforcement · credit · insurance · justice', '', 'Article 6-29 obligations. Art. 99 fines: €15M or 3% turnover.', 'amber')}
${cell('LIMITED RISK', 'Chatbots interacting with humans', '', 'Art. 50 transparency obligation. Most customer-facing AI.')}
${cell('MINIMAL RISK', 'Everything else — productivity tools, drafting, summarising', '', 'Where most enterprise AI sits.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'NIST context-based approach', icon: '2', headlineHtml: 'Same model · different deployment · <em>different risk</em>',
      blocks: [{ atStep: 1, html: card('NIST AI RMF · CONTEXT-BASED', 'Doesn\'t enumerate categories · assesses risk based on context', ['Same model in different deployments has different risk profiles.', '<strong>The combined approach most boards use:</strong> EU tiering as categorisation. NIST context-based assessment within tiers. The two frameworks compose.']) }] },
    { type: 'content', eyebrow: 'The 5-category risk taxonomy', icon: '3', headlineHtml: 'Bias · hallucination · security · IP · <em>operational</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('1', 'Bias + fairness', '', 'Bloomberg resume study Mar 2024 — reproducible bias. <strong>Material in employment, credit, insurance.</strong>', 'red')}
${cell('2', 'Hallucination + accuracy', '', 'Stanford 17–34% baseline. Material wherever AI produces factual statements.', 'red')}
${cell('3', 'Security + privacy', '', 'Prompt injection · data leakage · model theft. Wherever sensitive data touches AI.', 'amber')}
${cell('4', 'Intellectual property', '', 'Training-data IP · output IP. Wherever AI generates commercial content.', 'amber')}
${cell('5', 'Operational + concentration', '', 'Vendor dependency · model deprecation · cost shock. <strong>Material across the board.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Apply the tiering · audit committee will ask', icon: '4', headlineHtml: 'Pull AI inventory · <em>tier each · note risk categories</em>',
      blocks: [
        { atStep: 1, html: card('APPLY THE TIERING', 'Pull your AI inventory · per system, what EU tier + risk categories + magnitude', ['Audit committee will ask: <strong>"Show me your AI inventory with risk tier per system."</strong>', 'If you can\'t produce that in one minute — the inventory doesn\'t exist. That\'s the work.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Next 30 days — produce a 1-page AI inventory with tier + risk taxonomy per system', ['Even if rough. Iterate quarterly. <strong>The inventory is the foundation of every other governance artifact.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'The AI risk register · <em>what the audit committee reviews</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'EU 4 tiers · NIST context · 5-category taxonomy. <em>Classification is the foundation.</em>', '<strong>Next:</strong> what goes in the AI risk register · quarterly cadence · audit-committee escalation rules.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 90.0, slide: 3 }, { at: 100.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 220.0, slide: 5 }, { at: 230.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

// Ch3
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'The AI risk register' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-risk-register.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · THE ARTIFACT', h1Html: '5 columns · quarterly cadence · <em>escalation rules</em>', subtitleHtml: 'The artifact the audit committee actually reviews. <strong>Deloitte ACP Q4 2025: 62% want disclosure · 31% want sample-testing.</strong>' },
    { type: 'content', eyebrow: 'What goes in · 5 columns minimum', icon: '1', headlineHtml: 'Name · tier · owner · status · <em>last review</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('COL 1', 'System + purpose', '', 'What it is + what it does in plain language.')}
${cell('COL 2', 'EU tier + NIST classification', '', 'From chapter 2.')}
${cell('COL 3', 'Owner', '', 'Named human accountable. <strong>Not a department. A person.</strong>')}
${cell('COL 4', 'Status', '', 'Production · pilot · review · material change pending.')}
${cell('COL 5', 'Last review', '', 'Date · by whom · findings.')}
</div>` }, { atStep: 1, html: card('OPTIONAL BUT RECOMMENDED', 'Risk magnitude · open issues · dependencies · vendor', ['Adds depth without adding complexity.']) }] },
    { type: 'content', eyebrow: 'Cadence + material-change triggers', icon: '2', headlineHtml: 'Quarterly council · annual audit committee · <em>material change ad-hoc</em>',
      blocks: [{ atStep: 1, html: card('REVIEW CADENCE', 'Quarterly · annual · material-change triggered', ['<strong>Quarterly:</strong> AI council review.', '<strong>Annual:</strong> audit committee review.', '<strong>Material-change triggered:</strong> system added/deprecated/significantly changed.'], 'What "significant" means: new use case for existing model · new vendor for existing function · new jurisdiction · material accuracy/bias finding. These trigger out-of-cycle review.') }] },
    { type: 'content', eyebrow: 'Audit committee · Deloitte ACP Q4 2025', icon: '3', headlineHtml: '62% want disclosure · <em>31% want sample-testing</em>',
      blocks: [{ atStep: 1, html: card('DELOITTE AUDIT COMMITTEE PULSE · Q4 2025', '62% of audit committees want explicit AI-use disclosure · 31% require additional sample-testing', ['Register feeds the audit committee meeting. Chair gets it before the meeting. Asks specific questions about specific systems. <strong>If the register has gaps, the chair sees them.</strong>'], 'Big-4 audit firms (PwC/Deloitte/KPMG/EY) converged 2024-25 guidance on AI-use disclosure in MD&A. Audit-defensible documentation is the bar. Your register is that documentation.') }] },
    { type: 'content', eyebrow: 'Escalation rules · 3 triggers', icon: '4', headlineHtml: 'Material finding · new high-risk system · <em>regulatory change</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('TRIGGER 1', 'Material finding on high-risk system', '', 'Bias drift above threshold · hallucination with customer impact · regulatory inquiry. <strong>Audit committee within 30 days · board within 90.</strong>', 'red')}
${cell('TRIGGER 2', 'New high-risk system deploying', '', 'Audit committee reviews before launch · board sees at next scheduled meeting.', 'amber')}
${cell('TRIGGER 3', 'Material regulatory change', '', 'EU AI Act tranche · new state law. <strong>Audit committee reviews readiness within 60 days.</strong>')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Build v1 of the AI risk register this month · 5 columns minimum', ['All AI systems above a materiality threshold. <strong>Hand it to audit committee chair informally. Iterate based on questions.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Controls · <em>NIST 4 functions</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '5 columns · quarterly cadence · 3 escalation triggers. <em>The artifact.</em>', '<strong>Next:</strong> NIST AI RMF Govern · Map · Measure · Manage. The operating playbook · cross-domain Mata + Air Canada lessons.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 90.0, slide: 3 }, { at: 100.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 265.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 }
  ]
});

// Ch4
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Controls · NIST AI RMF 4 functions' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-controls.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · THE PLAYBOOK', h1Html: 'Govern · Map · Measure · <em>Manage</em>', subtitleHtml: 'NIST AI RMF four functions = the structure your risk team executes. <strong>All four required. Three of four leaves a gap that an auditor or regulator will find.</strong>' },
    { type: 'content', eyebrow: 'Govern · the organisational layer', icon: '1', headlineHtml: 'Policies · accountability · <em>risk culture</em>',
      blocks: [{ atStep: 1, html: card('FUNCTION 1 · GOVERN', 'Policies · accountability · oversight · risk culture', ['AI policy document — what\'s allowed · what\'s not · who decides.', 'AI council from strategy course chapter 4 — the decision body.', '<strong>Risk culture:</strong> tone from the top that AI risk gets escalated, not buried.'], 'The governance test: if a high-risk AI failure happened tomorrow, who would be accountable? If you can\'t answer in one sentence, the Govern function isn\'t yet in place.') }] },
    { type: 'content', eyebrow: 'Map · the context layer · Mata failure mode', icon: '2', headlineHtml: 'Know the system · <em>before deployment</em>',
      blocks: [{ atStep: 1, html: card('FUNCTION 2 · MAP', 'Understand the system, the deployment, the stakeholders', ['For each high-risk system: who uses it · who is affected · what data flows in/out.', 'Map should be readable by a board member in 5 minutes.'], 'Mata v. Avianca is the Map failure mode. The lawyers didn\'t map the limitations of ChatGPT before they used it in a federal brief. Park v. Kim — same. <em>Mapping is the discipline of knowing the system you\'re deploying. Skipping it is the most common failure.</em>') }] },
    { type: 'content', eyebrow: 'Measure · the empirical layer · Air Canada failure mode', icon: '3', headlineHtml: 'Bias · accuracy · outputs · <em>audit logs</em>',
      blocks: [{ atStep: 1, html: card('FUNCTION 3 · MEASURE', 'Bias testing · accuracy testing · output verification · audit logging', ['For each high-risk system: what\'s measured · how often · by whom · threshold.', 'If bias drift exceeds threshold, what happens. If accuracy degrades, what happens.', '<strong>If audit logs aren\'t generating — that\'s an incident.</strong>'], 'Air Canada Moffatt is the Measure failure mode. Nobody measured what the chatbot was telling customers. Measurement would have caught it before BC CRT did.') }] },
    { type: 'content', eyebrow: 'Manage · the response layer', icon: '4', headlineHtml: 'Mitigate · document · <em>communicate</em>',
      blocks: [
        { atStep: 1, html: card('FUNCTION 4 · MANAGE', 'Mitigate · document · communicate', ['For each identified risk: mitigation · owner · implementation date.', 'Risk register from chapter 3 flows here.', '<strong>Audit-defensible documentation.</strong>', 'External communication when material — regulators, customers, board.'], 'The combined four: Govern sets policy · Map sees the system · Measure detects the problem · Manage fixes it and communicates. <em>All four required. Three of four leaves a gap.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one high-risk system · 1 sentence per NIST function', ['Who governs it · who\'s mapped it · what\'s being measured · who manages incidents.', '<strong>If any answer is missing — that\'s the next week\'s work.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Vendor + supply-chain risk · <em>enterprise terms baseline</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 functions · 1 playbook. <em>All four required.</em>', '<strong>Next:</strong> enterprise terms (training opt-out · tenant isolation · retention) · Anthropic RSP · OpenAI Preparedness · third-party + open-source.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// Ch5
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Vendor and supply-chain risk' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-vendor-risk.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · WHAT YOU CONTRACT FOR', h1Html: '3 settings in writing · <em>RSP · Preparedness · multi-vendor</em>', subtitleHtml: 'Every AI system depends on a vendor. <strong>Vendor layer is governance you don\'t control directly — you contract for it.</strong>' },
    { type: 'content', eyebrow: 'Enterprise terms baseline · 3 settings', icon: '1', headlineHtml: 'Training opt-out · tenant isolation · <em>retention</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('SETTING 1', 'Training opt-out', '', 'Vendor confirms in writing your prompts/outputs not used to train. <strong>OpenAI Enterprise · Anthropic · MS Copilot · Google Workspace — all default-on or contractually committed.</strong>')}
${cell('SETTING 2', 'Tenant isolation', '', 'Your data doesn\'t commingle with other customers. Enforced at infrastructure level.')}
${cell('SETTING 3', 'Retention', '', 'You know how long prompts/outputs are stored. Can request deletion. <strong>Zero-day for most-sensitive use cases.</strong>')}
</div>` }, { atStep: 1, html: card('THE RULE', 'Cannot tick all 3 in writing → don\'t put company data into it', ['Period.']) }] },
    { type: 'content', eyebrow: 'Vendor safety frameworks · Anthropic RSP + OpenAI Preparedness', icon: '2', headlineHtml: 'Frontier-model layer · <em>actively governed by vendors</em>',
      blocks: [{ atStep: 1, html: card('VENDOR-PUBLISHED SAFETY FRAMEWORKS', 'Anthropic RSP + OpenAI Preparedness Framework · 2023-2025', ['<strong>Anthropic Responsible Scaling Policy (RSP):</strong> framework for releasing more capable models with corresponding safety mitigations.', '<strong>OpenAI Preparedness Framework:</strong> same pattern.', 'Both are public documents.'], 'Why this matters: if your AI strategy depends on frontier models, your board should understand the vendor safety frameworks they\'re relying on. <em>Public documents. Worth reading.</em>') }] },
    { type: 'content', eyebrow: 'Third-party AI in your products · concentration risk', icon: '3', headlineHtml: 'Vendor uptime · pricing · <em>model deprecation</em>',
      blocks: [{ atStep: 1, html: card('THIRD-PARTY AI IN YOUR PRODUCTS', 'Your customer experience depends on vendor uptime · pricing · model decisions', ['Board questions: <strong>What happens if vendor deprecates the model your product uses? What if vendor doubles the price? What\'s your migration playbook?</strong>'], 'Mitigation: multi-vendor where possible · document migration paths · don\'t single-vendor lock-in. <em>Concentration risk like any other supplier concentration risk.</em>') }] },
    { type: 'content', eyebrow: 'Open-source models · trade-offs', icon: '4', headlineHtml: 'Llama · Mistral · Falcon · <em>cost + sovereignty vs governance burden</em>',
      blocks: [
        { atStep: 1, html: card('OPEN-SOURCE MODEL CONSIDERATIONS', 'Llama (Meta) · Mistral · Falcon · increasingly used for cost + data-sovereignty reasons', ['<strong>You control the deployment.</strong> You also bear the safety + compliance burden the vendor would have borne. No RSP. No Preparedness Framework. <em>You build that yourself.</em>'], 'Most companies in 2026: hybrid posture. Commercial vendors for material AI work · open-source for narrow research + back-office automation.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Top 5 AI vendors by contract value · do the 3 enterprise settings hold in writing?', ['If not — procurement remediation conversation for next quarter. <strong>If vendor can\'t or won\'t agree, escalate.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: '7 board-level questions · <em>1 minute each</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 settings · 2 vendor safety frameworks · 1 hybrid posture. <em>You contract for governance.</em>', '<strong>Next:</strong> the 7 questions every director must be able to answer. Cross-domain governance signal from Mata + Park + Charlotin tracker.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 90.0, slide: 3 }, { at: 100.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// Ch6
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Board-level AI questions' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-board-questions.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · THE CHECKLIST', h1Html: '7 questions · <em>1 minute each</em>', subtitleHtml: 'If you can\'t answer in 1 minute in front of audit committee chair or regulator — <strong>your AI governance posture has gaps.</strong>' },
    { type: 'content', eyebrow: 'Questions 1-2 · inventory + ownership', icon: '1', headlineHtml: 'What systems · <em>who owns each</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('Q1', 'What AI systems · what\'s high-risk?', '', 'From your inventory and classification. <strong>One sentence per high-risk system.</strong>')}
${cell('Q2', 'Who owns each one — by name?', '', 'Director names · BU leaders · whoever signs the operating agreement. <strong>Not "the AI team."</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Questions 3-4 · failure scenarios + jurisdictions', icon: '2', headlineHtml: 'What scenarios modelled · <em>regulator readiness</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('Q3', 'Material failure scenarios + response?', '', 'Bias incident · hallucination with customer impact · regulatory inquiry. <strong>3-5 named scenarios with response playbooks.</strong>')}
${cell('Q4', 'EU AI Act + NIST + state posture?', '', 'One sentence per jurisdiction. Audit-defensible.')}
</div>` }] },
    { type: 'content', eyebrow: 'Questions 5-6 · vendor concentration + incident response', icon: '3', headlineHtml: 'Vendor risk · <em>incident protocol</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('Q5', 'Vendor concentration risk?', '', 'Top 3 AI vendors by contract value. <strong>What happens if any single one becomes unavailable.</strong>')}
${cell('Q6', 'Incident-response + disclosure protocol?', '', 'From chapter 7. Material-incident escalation in hours, not days.')}
</div>` }] },
    { type: 'content', eyebrow: 'Question 7 + cross-domain signal · Charlotin tracker', icon: '4', headlineHtml: 'Disclosure · <em>federal sanctions are precedent</em>',
      blocks: [
        { atStep: 1, html: card('QUESTION 7 · DISCLOSURE', 'What disclosure to investors, customers, regulators about AI use?', ['In the 10-K · customer-facing terms · regulator filings.', '<strong>EU AI Act Art. 50 makes this mandatory for chatbots.</strong>', 'Big-4 advisory guidance pushes this for financial reporting.']) },
        { atStep: 2, html: cardRed('CROSS-DOMAIN GOVERNANCE SIGNAL · CHARLOTIN TRACKER 2025', '100+ documented US court filings with AI-fabricated citations by mid-2025', ['<strong>Mata v. Avianca · Park v. Kim · Iovino — federal judges are sanctioning lawyers for AI misuse.</strong>', 'Regulators in other domains are watching. Air Canada Moffatt is the consumer-protection analog.', 'Boards that wave hands at AI governance because "it\'s just a productivity tool" are reading the wrong era.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Incident response · <em>4 / 24 / 72 hours</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '7 questions · 1 minute each. <em>If any takes longer than 5 — that\'s the work.</em>', '<strong>Next:</strong> what constitutes an AI incident · 4-24-72 hour milestones · EU AI Act Art. 27 FRIA · WEF misinformation top global risk.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 165.0, slide: 5 }, { at: 175.0, slide: 5, step: 1 }, { at: 215.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

// Ch7
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Incident response and disclosure' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-incident-response.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · WHEN IT HAPPENS', h1Html: '5 categories · 4-24-72 · <em>EU Art. 27 FRIA</em>', subtitleHtml: 'Speed + quality of response determines whether it\'s a 1-quarter board item or 3 years. <strong>WEF Global Risks 2025: AI-driven misinformation #1 short-term global risk for 2nd year running.</strong>' },
    { type: 'content', eyebrow: 'What is an AI incident · 5 categories', icon: '1', headlineHtml: 'Output · security · vendor · regulatory · <em>peer signal</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('1', 'Material output failure', '', 'Hallucination with customer impact · bias above threshold · regulatory inquiry. <strong>Front page or regulator desk.</strong>', 'red')}
${cell('2', 'Security breach involving AI', '', 'Prompt injection exposed data · model theft · training data leak.', 'red')}
${cell('3', 'Vendor outage · material', '', 'Customer-facing chatbot down for hours · platform stopped before close.', 'amber')}
${cell('4', 'Regulatory action', '', 'EU AI Act inquiry · state AG investigation · NYC LL144 bias-audit finding.', 'amber')}
${cell('5', 'Peer incident · signal', '', 'Mata, Air Canada, Charlotin tracker — peers\' failures are your early-warning data.')}
</div>` }] },
    { type: 'content', eyebrow: 'The 4-24-72 timeline', icon: '2', headlineHtml: '4 hours · 24 hours · <em>72 hours</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('4 HOURS', 'Internal escalation', '', 'AI council informed · CISO informed · GC informed. <strong>Containment actions begin.</strong>', 'red')}
${cell('24 HOURS', 'Internal coordination', '', 'Audit-committee chair notified if material · external counsel engaged if regulatory · public communications plan drafted.', 'amber')}
${cell('72 HOURS', 'External response', '', 'Customer-facing/material: public statement · regulator notification if required · corrective actions communicated · board notification.')}
</div>` }] },
    { type: 'content', eyebrow: 'EU AI Act Art. 27 FRIA · effective Aug 2 2026', icon: '3', headlineHtml: 'Fundamental Rights Impact Assessment · <em>re-assess on material finding</em>',
      blocks: [{ atStep: 1, html: card('EU AI ACT · ART. 27 · FRIA', 'Required for certain deployers of high-risk AI from Aug 2 2026', ['If your company is in scope, the FRIA process is part of incident response.', 'When a high-risk system has a material finding — <strong>you re-do the FRIA. You don\'t just fix the bug.</strong>'], 'Document. Re-assess. Re-communicate. This is why EU AI Act compliance is more than a technical exercise. It\'s a governance discipline.') }] },
    { type: 'content', eyebrow: 'WEF + audit-committee discipline', icon: '4', headlineHtml: 'AI misinformation #1 global risk · <em>quarterly pattern review</em>',
      blocks: [
        { atStep: 1, html: card('WEF GLOBAL RISKS REPORT 2025', 'AI-driven misinformation #1 short-term global risk · 2 years running', ['Investors and regulators are reading this. <strong>Your board should know your incident-response posture survives external scrutiny under this framing.</strong>']) },
        { atStep: 1, html: card('AUDIT-COMMITTEE DISCIPLINE', 'Notification within 24 hours · in writing · quarterly pattern review', ['Quarterly review of all incidents — material and minor — to extract pattern lessons.', 'Not paranoia. <strong>The discipline that makes the next incident smaller.</strong>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Walk through one fictional AI incident with AI council this quarter', ['Choose one of the 5 categories · run 4-24-72 timeline · find gaps · fix them before the real incident.']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'AI governance charter · <em>on one page</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '5 categories · 4-24-72 timeline · FRIA discipline. <em>Speed and documentation.</em>', '<strong>Last chapter:</strong> 1-page governance charter · framework + classification + council + disclosure · 4 trust trip-wires.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 }
  ]
});

// Ch8
const ch8BuilderInit = `
var builderInit=false;var state={framework:'',classification:'',council:'',disclosure:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-governance-charter.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var f=state.framework||'_(pick framework)_';var c=state.classification||'_(pick classification posture)_';var co=state.council||'_(pick council composition)_';var d=state.disclosure||'_(pick disclosure baseline)_';return '# AI Governance Charter · 1-Page\\n\\n**Board chair / Audit committee chair:** ____________________\\n**Date:** ____________________\\n\\n## Framework\\n> '+f+'\\n\\n## Risk classification posture\\n> '+c+'\\n\\n## AI Council\\n> '+co+'\\n\\n## Disclosure baseline\\n> '+d+'\\n\\n## Trust trip-wires (do not cross)\\n- No untested model in regulated decisions\\n- No vendor without enterprise terms (training opt-out · tenant isolation · retention)\\n- No AI-touched material disclosure unverified (Mata principle)\\n- No "set and forget" — quarterly council · annual audit committee\\n\\n---\\nSource: Gennoor Academy · Leadership · AI Governance, Risk & Boards\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your AI governance charter' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 1 PAGE · 4 PIECES', h1Html: 'Framework · classification · council · <em>disclosure</em>', subtitleHtml: '7 chapters collapse to 4 pieces · audit-defensible · on one page · to your next audit committee meeting.' },
    { type: 'content', eyebrow: 'The principle · 1 page · 4 pieces', icon: '1', headlineHtml: 'Not 5 · not 7 · <em>audit-defensible</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', '1 page · 4 pieces · audit-defensible', ['Framework · classification posture · council · disclosure baseline.', '<strong>Not 5. Not 7. 4 pieces — fits on one page · survives audit committee review.</strong>']) }] },
    { type: 'content', eyebrow: 'The 4 pieces', icon: '2', headlineHtml: '4 pieces · <em>1-sentence statement each</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('PIECE 1', 'Framework', '', 'EU AI Act if you sell to EU. NIST AI RMF as US baseline. ISO 42001 if pursuing certification.')}
${cell('PIECE 2', 'Classification posture', '', 'EU 4-tier framing. NIST context-based within tiers. 5-category risk taxonomy.')}
${cell('PIECE 3', 'AI Council', '', 'Members · cadence · decision authority.')}
${cell('PIECE 4', 'Disclosure baseline', '', 'EU AI Act Art. 50 for chatbots · Big-4 MD&A guidance for financial reporting.')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No untested model in regulated decisions', '', 'Credit · hiring · healthcare. Formal control framework required.', 'red')}
${cell('TRIP-WIRE 2', 'No vendor without enterprise terms', '', 'Training opt-out · tenant isolation · retention. In writing.', 'red')}
${cell('TRIP-WIRE 3', 'No unverified AI in material disclosure', '', 'Annual report · 10-K · customer-facing terms. The Mata principle.', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly council · annual audit committee · material-change triggered review.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your charter', icon: '✓', headlineHtml: 'Pick · download · <em>take to audit committee chair</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Framework spine</h5><div class="preset" data-group="framework">
<button data-val="EU AI Act + NIST AI RMF + audit-committee-aligned controls">EU + NIST + audit</button>
<button data-val="NIST AI RMF + US state patchwork (NYC LL144, IL AIVIA, CO SB24-205)">US-focused</button>
<button data-val="EU AI Act + ISO/IEC 42001 certified AI management system">EU + ISO 42001</button>
<button data-val="Multi-jurisdiction (EU + NIST + India DPDPA + ABA)">Multi-jurisdiction</button>
</div></div>
<div class="group"><h5>Classification posture</h5><div class="preset" data-group="classification">
<button data-val="EU 4-tier framing + NIST context-based + 5-category risk taxonomy per system">EU + NIST + 5-taxonomy</button>
<button data-val="NIST AI RMF context-only with risk magnitude per system">NIST-only</button>
<button data-val="ISO 42001 risk-based with EU tier overlay">ISO + EU overlay</button>
</div></div>
<div class="group"><h5>AI Council composition</h5><div class="preset" data-group="council">
<button data-val="8-12 members: specialist team + BU leaders + GC + CISO · meets every 2 weeks">Specialist + BU + GC + CISO</button>
<button data-val="6-8 members: CRO + GC + CISO + CDO + 2 BU leaders · meets monthly">Risk-led (CRO/GC/CISO)</button>
<button data-val="10-12 members: AI council + ethics advisory · meets every 2 weeks">Council + ethics advisory</button>
</div></div>
<div class="group"><h5>Disclosure baseline</h5><div class="preset" data-group="disclosure">
<button data-val="Annual 10-K AI section + customer-facing chatbot disclosure + audit-committee quarterly review">Annual + chatbot + AC</button>
<button data-val="Annual + quarterly material-change updates + voluntary investor-facing AI summary">Annual + quarterly + investor</button>
<button data-val="Regulatory-only (EU Art. 50 + state mandatory disclosures + GC-approved customer terms)">Regulatory-only</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my AI governance charter (.md)</button>
</div>
<div class="preview" id="preview"># AI Governance Charter · 1-Page

Pick framework, classification, council, and disclosure on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Audit-defensible · <em>calibration over confidence</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Audit-defensible governance posture · EU AI Act + NIST + ISO 42001 as the framework spine · risk classification per system · quarterly register review · NIST 4 functions for controls · enterprise terms for all vendors · 7 board-level questions answerable in 1 minute · 4-24-72 incident response · 1-page governance charter.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your framework spine.</div><div class="row"><span class="arr">→</span>Take the 1-page charter to your next audit committee meeting.</div></div>
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

console.log('\n✓ Course 13 chapters 1-8 built.');
