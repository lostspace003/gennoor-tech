// Build Course 14 chapter HTMLs — AI for Finance & Accounting (Andrew · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Function · AI for Finance & Accounting';
const OUT = 'tmp/academy-build/ai-for-finance-accounting/chapters';

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
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The finance AI landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-finance-ai-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · CONTROLLED · AUDIT-DEFENSIBLE', h1Html: '67% CFO adoption · <em>1.4 days off the close</em>', subtitleHtml: 'Gartner Q4 2025 · KPMG 2025 · Hackett. <strong>Controlled, measurable, audit-defensible. Quad-eye is the chorus.</strong>' },
    { type: 'content', eyebrow: 'Adoption · Gartner Q4 2025 + KPMG 2025', icon: '1', headlineHtml: 'Middle of curve · <em>not leading edge</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('GARTNER FINANCE Q4 2025', 'CFOs deployed gen AI', '67%', 'For at least one finance process.')}
${cell('GARTNER · CLOSE SPECIFICALLY', 'In close cycle', '39%', 'Middle of curve. Not leading edge.')}
${cell('KPMG GENAI IN FINANCE 2025', 'Median close reduced', '1.4 days', 'At firms with mature AI. <strong>Board-meeting-cycle change.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Cost benchmark · Hackett 2025', icon: '2', headlineHtml: '$0.85 → <em>$0.55 per $1K revenue</em>',
      blocks: [{ atStep: 1, html: card('HACKETT GROUP · CLOSE BENCHMARK 2025', '35% cost reduction · top-quartile to top-decile', ['Top-quartile finance teams: $0.85 per $1K revenue. <strong>AI-augmented top-decile aim: $0.55.</strong>'], 'Dashboard number isn\'t audit-committee number. AC asks: hours saved with same control quality. If saving time but controller now fixes AI errors — you\'ve moved the work, not saved it.') }] },
    { type: 'content', eyebrow: 'The platforms · 2026', icon: '3', headlineHtml: 'Native AI · <em>not bolt-ons</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('ERP NATIVE', 'SAP · Oracle · Workday · Anaplan', '', 'Native AI in finance modules by 2025.')}
${cell('CLOSE PLATFORMS', 'Vic.ai · BlackLine · Trintech · FloQast', '', 'AP, reconciliation, R2R, close coordination.')}
${cell('MS COPILOT FOR FINANCE', 'GA Nov 2024', '', 'D365 Finance + SAP S/4HANA. Layer over existing infra.')}
${cell('FORECASTING', 'Adaptive · Anaplan · Workday', '', 'Native ML on cash, revenue, expense.')}
</div>` }] },
    { type: 'content', eyebrow: 'What works · what doesn\'t', icon: '4', headlineHtml: 'Routine works · <em>judgement still earns the fee</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('WORKS', 'Forecasting · narratives · reconciliation · routine accruals · JEs from source docs', '', 'KPMG 50–70% on narratives. BlackLine/Trintech 35–50% on rec. Vic.ai/Trintech 85–92% on routine accruals.', 'green')}
${cell('DOESN\'T WORK YET', 'Judgement accruals · litigation/restructuring · complex revrec', '', 'Anything where the answer depends on facts only humans know.', 'red')}
</div>` },
        { atStep: 2, html: card('THE FIX', 'Quad-eye on material entries · auditor-aware audit trail', ['Same as the rest of this academy. <strong>Chapters 4 and 5 cover the operational discipline.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Controlled · measurable · audit-defensible · quad-eye chorus.', '<strong>Next:</strong> forecasting + FP&A · M5 LightGBM dominance · Hyndman canonical · Tetlock calibration · FVA discipline.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 125.0, slide: 4 }, { at: 135.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 225.0, slide: 5, step: 2 },
    { at: 255.0, slide: 6 }, { at: 265.0, slide: 6, step: 1 }
  ]
});

// Ch2
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Forecasting and FP&A' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-forecasting.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · CALIBRATION > CONFIDENCE', h1Html: 'Cash · revenue · expenses · <em>FVA discipline</em>', subtitleHtml: 'M5 LightGBM dominates SKU-level. Classical wins on aggregates. <strong>Don\'t ship point estimates. Ship calibrated intervals.</strong>' },
    { type: 'content', eyebrow: 'What to forecast · 3 categories', icon: '1', headlineHtml: 'Cash · revenue · <em>expenses</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('CASH FLOW', 'Working capital · inflows · outflows', '', '<strong>AI does well 1-4 weeks out.</strong> Pattern data + transaction history.')}
${cell('REVENUE', 'Product line · region · customer cohort', '', '<strong>AI does well 1-12 months.</strong> Structured data + drivers.')}
${cell('EXPENSES', 'Routine OpEx with predictable patterns', '', '<strong>AI gets you 80% of the way.</strong> Historical + drivers.')}
</div>` }] },
    { type: 'content', eyebrow: 'M5 + Hyndman · the evidence', icon: '2', headlineHtml: 'No single technique wins · <em>match by granularity</em>',
      blocks: [{ atStep: 1, html: card('M5 FORECASTING COMPETITION · 2022', 'Top-50 entries predominantly LightGBM · classical methods competitive on aggregates', ['<strong>Hyndman 3rd Ed:</strong> ML beats classical when enough signal + history.', 'No single technique wins every forecast. <em>Pick by granularity, history depth, signal-to-noise.</em>']) }] },
    { type: 'content', eyebrow: 'The calibration discipline · Tetlock', icon: '3', headlineHtml: 'Prediction intervals · <em>not point estimates</em>',
      blocks: [{ atStep: 1, html: card('CALIBRATION DISCIPLINE', 'Don\'t ship point estimates · ship 80% prediction intervals', ['Point: "Q3 revenue will be $45M." Calibrated: <strong>"Q3 revenue will be $45M ± $3M, 80% confidence band."</strong>', 'Tetlock 20+ years of research — calibration matters more than confidence. <em>The CFO who insists on intervals over point estimates builds better forecasting discipline.</em>']) }] },
    { type: 'content', eyebrow: 'FVA · Gilliland methodology', icon: '4', headlineHtml: 'Where in the chain · <em>accuracy is added or lost</em>',
      blocks: [
        { atStep: 1, html: card('FORECAST VALUE ADDED · MIKE GILLILAND · SAS · 15+ YEARS', 'Measure accuracy at each layer · compare layer-to-layer', ['Naive baseline → Statistical → ML → Planner override → Executive sign-off.', '<strong>If ML adds accuracy over statistical — fund it. If planner override consistently subtracts — coaching conversation.</strong>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one recurring forecast · add a calibrated interval next cycle', ['Track whether actuals land inside the 80% band over 4 cycles. <strong>If they don\'t, interval is too narrow. That\'s the calibration work.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Reporting + variance narratives · <em>quote-or-cut</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Calibrated intervals · FVA discipline · ML matched to granularity.', '<strong>Next:</strong> KPMG 50-70% time savings on MD&A · quote-or-cut rule · the confabulated-source failure mode.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 235.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

// Ch3
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Reporting and variance narratives' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-narratives.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · QUOTE OR CUT', h1Html: 'MD&amp;A drafts · <em>50–70% time savings</em>', subtitleHtml: 'KPMG GenAI in Finance 2025. <strong>Every quantitative claim cited and verified — or cut. Mata v. Avianca is the cross-domain analog.</strong>' },
    { type: 'content', eyebrow: 'The time saving · KPMG 2025', icon: '1', headlineHtml: 'Full day · <em>now 2–3 hours</em>',
      blocks: [{ atStep: 1, html: card('KPMG GENAI IN FINANCE 2025', '50–70% time savings on month-over-month variance commentary', ['MD&A first drafts that used to take a full day now take 2-3 hours.', '<strong>Pattern:</strong> AI ingests variance file · drafts paragraphs · controller validates · adds qualitative context.']) }] },
    { type: 'content', eyebrow: 'The failure mode · cross-domain Mata', icon: '!', iconRed: true, headlineHtml: 'Confabulated-source narrative · <em>same as Mata v. Avianca</em>',
      blocks: [{ atStep: 1, html: cardRed('CONFABULATED-SOURCE FAILURE MODE', 'AI commentary confidently references contract clauses, promotions, or customer details that don\'t exist', ['Variance-narrative version of <strong>Mata v. Avianca</strong> — the federal court case where lawyers were sanctioned for citing court opinions that didn\'t exist.', 'Same generative-AI behaviour. Different document.'], 'Audit committees and external auditors are now actively watching for this pattern. <em>Catch it before the meeting — or read about it after.</em>') }] },
    { type: 'content', eyebrow: 'The fix · quote-or-cut rule', icon: '2', headlineHtml: 'Every quantitative claim · <em>cited and verified or cut</em>',
      blocks: [{ atStep: 1, html: card('QUOTE-OR-CUT RULE', 'No source — cut the sentence · doesn\'t matter how well it reads', ['If AI says <em>"Q3 revenue grew due to strategic customer deal closed week 8"</em> — there must be a Salesforce record or contract reference.', '<strong>The controller who treats every specific claim as raw input requiring verification never ships the error.</strong>', 'The controller who trusts the AI draft and forwards eventually ships a fabricated clause. <em>Career-defining moment.</em>']) }] },
    { type: 'content', eyebrow: 'Audit committee · Deloitte ACP Q4 2025', icon: '3', headlineHtml: '62% want disclosure · <em>31% want sample-testing</em>',
      blocks: [
        { atStep: 1, html: card('DELOITTE AUDIT COMMITTEE PULSE · Q4 2025', '62% of AC want explicit AI-use disclosure in close docs · 31% require additional sample-testing', ['Big-4 advisory through 2025 — audit committees increasingly require AI-use disclosure in MD&A.', '<strong>Your variance narratives are MD&A territory. Audit-defensible documentation is the bar.</strong>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter\'s MD&A · pick 5 specific quantitative claims · trace each to source', ['<strong>If you can\'t trace any one in 5 minutes — quote-or-cut discipline isn\'t in place yet.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Close cycle automation · <em>quad-eye flow</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Every claim cited and verified · or cut.', '<strong>Next:</strong> reconciliation, accruals, journal entries · Big-4 acceptance criteria · drafter-preparer-reviewer-approver quad-eye.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 225.0, slide: 5, step: 2 },
    { at: 245.0, slide: 6 }, { at: 255.0, slide: 6, step: 1 }
  ]
});

// Ch4
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Close cycle automation' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-close-automation.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · THREE USE CASES', h1Html: 'Recs · accruals · <em>journal entries</em>', subtitleHtml: 'BlackLine/Trintech 35–50% rec hours · Vic.ai/Trintech 85–92% routine accruals. <strong>Big-4 acceptance: traceable source + human approves + audit trail.</strong>' },
    { type: 'content', eyebrow: 'Use case 1 · reconciliation copilots', icon: '1', headlineHtml: '3 days → 1.5 days · <em>BlackLine + Trintech</em>',
      blocks: [{ atStep: 1, html: card('RECONCILIATION COPILOTS · BLACKLINE + TRINTECH 2025', '35–50% manual rec hours saved · 3 full days → 1.5', ['Bank rec · intercompany · balance-sheet rec.', '<strong>Auto-clear threshold:</strong> above 95% confidence + below materiality. Below — controller reviews.', 'Audit quarterly · verify AI confidence calibration.']) }] },
    { type: 'content', eyebrow: 'Use case 2 · accrual proposals', icon: '2', headlineHtml: '85–92% accuracy · <em>routine accruals only</em>',
      blocks: [{ atStep: 1, html: card('ROUTINE ACCRUAL PROPOSALS · VIC.AI + TRINTECH 2025', '85–92% accuracy on utilities, rent, payroll fringe, predictable patterns', ['<strong>Where AI works:</strong> historical data + formula gets you most of the way.', '<strong>Where AI doesn\'t:</strong> litigation reserves, restructuring, complex revrec.'], 'Materiality threshold filter — above floor, manual sign-off mandatory. Below, AI + quick approval.') }] },
    { type: 'content', eyebrow: 'Use case 3 · journal entry AI · Big-4 criteria', icon: '3', headlineHtml: 'Where audit asks most questions · <em>3 conditions all must hold</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('CONDITION 1', 'Source data traceable', '', 'Every AI-proposed JE links back to a specific source document. <strong>No source. No JE.</strong>')}
${cell('CONDITION 2', 'Human approves before posting', '', 'AI never posts directly. <strong>Approval is a control, not a formality.</strong>')}
${cell('CONDITION 3', 'Audit trail captures AI tool used', '', 'Matter file · JE record · close documentation — all reference which tool generated the proposal.')}
</div>` }, { atStep: 1, html: card('BIG-4 ACCEPTANCE · PwC + DELOITTE + KPMG + EY 2024-25', 'Tick all 3 in writing → audit-defensible', ['Miss one — external auditor requires remediation.']) }] },
    { type: 'content', eyebrow: 'The quad-eye flow · 4 distinct roles', icon: '4', headlineHtml: 'Drafter · preparer · reviewer · <em>approver</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('ROLE 1 · DRAFTER', 'AI', '', 'Generates the proposed JE from source document.')}
${cell('ROLE 2 · PREPARER', 'Analyst', '', 'Reviews · confirms calculation · adjusts if needed · signs off.')}
${cell('ROLE 3 · REVIEWER', 'Controller / Manager', '', 'Independent review · materiality, account coding, period · signs off.')}
${cell('ROLE 4 · APPROVER', 'Director / CFO', '', 'For material entries · final approval before posting.')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick last month\'s AI-proposed JEs · can you trace every source?', ['Yes for all → good baseline. <strong>Even one source can\'t be traced — that\'s the gap. Fix before next close.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Audit + SOX · <em>3 controls</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Reconciliation · accruals · journal entries · quad-eye on all.', '<strong>Next:</strong> SOX 404 + COSO ERM 2024 + PCAOB QC 1000 + IAASB ISA 220 · 3 controls every AI-touched process needs.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 255.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

// Ch5
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Audit and SOX' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-audit-sox.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · 3 CONTROLS', h1Html: 'SOX 404 · COSO ERM 2024 · <em>PCAOB QC 1000 · IAASB ISA 220</em>', subtitleHtml: '3 controls every AI-touched close process needs. <strong>EY 2025: 78% of CFOs concerned, 41% changed close procedures.</strong>' },
    { type: 'content', eyebrow: 'The framework · COSO + SOX 404 + audit standards', icon: '1', headlineHtml: 'AI inputs · outputs · <em>tool documentation</em>',
      blocks: [{ atStep: 1, html: card('FRAMEWORK · COSO ERM 2024 + SOX 404 + AUDIT STANDARDS', 'AI-touched processes need 3 distinct control points', ['SOX 404 now expected to cover AI inputs, AI outputs, AI tool documentation.', 'PCAOB QC 1000 + IAASB ISA 220 Revised — both effective 2024-25 — require auditors to document AI use when material to opinion.'], 'Document each. Get internal audit to test each. Move on.') }] },
    { type: 'content', eyebrow: 'Control 1 · AI input', icon: '2', headlineHtml: 'Source docs from approved systems · <em>workflows logged</em>',
      blocks: [{ atStep: 1, html: card('CONTROL 1 · AI INPUT', 'What data goes to the AI · who decides · how documented', ['Source documents must come from approved systems. <strong>No screenshots from emails posted into chat.</strong>', 'Workflows routing invoices/contracts/source files to AI must be defined and logged.'], 'Test internal audit will run: sample of AI-touched entries · trace each to source. If any unverifiable — control fails.') }] },
    { type: 'content', eyebrow: 'Control 2 · AI output review', icon: '3', headlineHtml: 'Quad-eye · <em>evidence of independent review</em>',
      blocks: [{ atStep: 1, html: card('CONTROL 2 · AI OUTPUT REVIEW', 'Drafter → preparer → reviewer → approver · with evidence', ['Distinct people. Distinct sign-offs.', '<strong>In the close binder:</strong> evidence of each review. Initials · dates · names.', 'The control is the review. The evidence is the proof of the review.']) }] },
    { type: 'content', eyebrow: 'Control 3 · AI tool documentation · EY data', icon: '4', headlineHtml: 'AI register per close · <em>vendor · version · scope · settings</em>',
      blocks: [
        { atStep: 1, html: card('CONTROL 3 · AI TOOL DOCUMENTATION', 'For every AI tool in the close: vendor · version · scope · training opt-out · retention · last-tested date', ['Not optional. PCAOB QC 1000 + IAASB ISA 220 require auditors to document AI use when material.', '<strong>Your job is to make that easy for them.</strong> One-page AI register per close cycle. Updated each close.']) },
        { atStep: 1, html: cardRed('EY AI IN AUDIT SURVEY 2025', '78% of CFOs concerned · 41% already changed procedures', ['<strong>If not in the 41% yet — you will be by next year.</strong>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one high-risk AI-touched process · write the 3 controls for it · one paragraph each', ['If you can\'t write them down, you don\'t have the program. Once written, into the matter file template.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'AP · AR · treasury · <em>tax</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 controls · documented · tested · external auditor signs.', '<strong>Next:</strong> AI in AP, AR, treasury, tax · specific vendors · same control framework.') }] }
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

// Ch6
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'AP, AR, treasury, tax' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-subfunctions.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · 4 SUB-FUNCTIONS', h1Html: 'AP · AR · treasury · <em>tax</em>', subtitleHtml: 'Where AI is now mainstream. <strong>Specific platforms. Same control framework as chapter 5.</strong>' },
    { type: 'content', eyebrow: 'AP · Vic.ai · AppZen · Tipalti · Stampli', icon: '1', headlineHtml: 'Invoice extraction · <em>line-item coding · anomaly detection</em>',
      blocks: [{ atStep: 1, html: card('ACCOUNTS PAYABLE · NATIVE AI PLATFORMS 2025', 'Vic.ai · AppZen · Tipalti · Stampli', ['AI extracts data from invoices · codes line items · matches to POs · flags duplicates and anomalies.', '<strong>Vendor case studies: 80-90% accuracy on routine invoice line-item coding</strong> for standard types.', 'Discipline: human approves before payment posts. Audit trail logs the AI tool. Same control framework as JE AI.'], 'Fraud angle: AI detects unusual patterns faster than humans on high-volume AP. Duplicates · vendor anomalies · invoice manipulation. <em>Material risk reduction if controls are tight.</em>') }] },
    { type: 'content', eyebrow: 'AR · collections AI · customer-facing risk', icon: '2', headlineHtml: 'Predict late payers · <em>quote-or-cut on customer comms</em>',
      blocks: [{ atStep: 1, html: card('AR COLLECTIONS AI', 'Predict late payers · draft collection emails · triage human attention', ['<strong>Vendor case studies report single-digit % recovery rate improvements.</strong>'], 'AR involves customer relationships. Tone matters. Air Canada Moffatt cross-domain analog applies — <em>anything a customer-facing AI says is your company\'s statement.</em> Quote-or-cut on customer-facing AR communications.') }] },
    { type: 'content', eyebrow: 'Treasury · Kyriba + others', icon: '3', headlineHtml: 'Cash forecasting · counterparty · <em>FX patterns</em>',
      blocks: [{ atStep: 1, html: card('TREASURY · KYRIBA + OTHERS 2025', 'Cash forecasting · counterparty risk · FX exposure pattern detection · liquidity stress-testing', ['<strong>Works:</strong> short-horizon cash forecasting with calibrated intervals.', '<strong>Cautious:</strong> anything involving specific bank relationships · regulatory thresholds · sovereign risk. <em>Human judgement still earns the fee.</em>']) }] },
    { type: 'content', eyebrow: 'Tax · Vertex · Avalara · Trintax', icon: '4', headlineHtml: 'Regulator-facing · <em>audit trail non-negotiable</em>',
      blocks: [
        { atStep: 1, html: card('TAX · VERTEX + AVALARA + THOMSON REUTERS TRINTAX 2025', 'Indirect-tax compliance · AI extracts tax-relevant fields · classifies for jurisdictional rules · drafts filings', ['<strong>Tax is regulator-facing.</strong> Audit trail is non-negotiable. Quad-eye mandatory on every material filing.'], 'The boundary: AI drafts. Tax professional signs. Doesn\'t matter how confident the AI is. <em>Signature on regulatory filings belongs to a human professional with practice qualifications.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick the one sub-function where AI adoption is weakest in your team', ['AP · AR · treasury · or tax. <strong>That\'s where next quarter\'s investment goes.</strong> Apply chapter 5 controls from day one.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Standards landscape · <em>IFRS 18 · SEC · CSRD</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '4 sub-functions · same control framework · specific platforms.', '<strong>Next:</strong> IFRS 18 effective 2027 · SEC AI disclosure expectations · CSRD · IndAS · enterprise vendor terms.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

// Ch7
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Standards landscape' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-standards.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · WHAT IS COMING', h1Html: 'IFRS 18 · SEC · CSRD · <em>vendor terms</em>', subtitleHtml: '3 accounting standards · 1 vendor posture. <strong>For 2026 and beyond.</strong>' },
    { type: 'content', eyebrow: 'IFRS 18 · effective Jan 1 2027', icon: '1', headlineHtml: 'New income-statement structure · <em>AI maps to MD&amp;A</em>',
      blocks: [{ atStep: 1, html: card('IFRS 18 · EFFECTIVE 2027', 'First major income-statement overhaul in decades', ['Reclassifies operating · financing · investing categories.', 'Requires new operating-expense classifications.', 'Mandates management-defined performance measures with reconciliations.'], 'AI-augmented variance narrative generation maps directly onto IFRS 18\'s new classification structure. Quote-or-cut applies. Audit trail for AI-touched MD&A is mandatory under the new standard.') }] },
    { type: 'content', eyebrow: 'SEC + CSRD + IndAS · disclosure layer', icon: '2', headlineHtml: 'US · EU · <em>India</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('US SEC', 'AI disclosure expectations', '', 'No single rule yet. SABs + comment letters increasingly ask about AI use in financial reporting. <strong>Your 10-K should anticipate this.</strong>')}
${cell('EU CSRD', 'Sustainability + governance disclosure', '', 'In effect across the EU. Increasingly covers AI. <strong>Filed under CSRD → AI-use disclosure is part of sustainability reporting.</strong>')}
${cell('INDIA IndAS', 'Convergence with IFRS', '', '2026-2028 trajectory. <strong>IFRS 18 will reach India through this route.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Enterprise vendor terms · 3 settings', icon: '3', headlineHtml: 'Training opt-out · isolation · <em>retention</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('SETTING 1', 'Training opt-out', '', 'OpenAI Enterprise · Anthropic Commercial · MS Copilot for M365 — <strong>all default-on or contractually committed.</strong>')}
${cell('SETTING 2', 'Tenant isolation', '', 'Your data doesn\'t commingle.')}
${cell('SETTING 3', 'Retention', '', 'You know how long prompts/outputs are stored.')}
</div>` }, { atStep: 1, html: card('THE RULE', 'Vendor can\'t tick all 3 in writing → don\'t put company financial data into it', ['Personal-account-at-home failure mode applies in finance too.']) }] },
    { type: 'content', eyebrow: 'MS Copilot for Finance · GA Nov 2024', icon: '4', headlineHtml: 'D365 + SAP integration · <em>tenant-isolated</em>',
      blocks: [
        { atStep: 1, html: card('MS COPILOT FOR FINANCE · GA NOV 2024', 'D365 Finance + SAP S/4HANA integration · tenant-isolated · no training', ['For most enterprise CFOs in 2026 — path of least friction.', 'Sits on top of existing finance infrastructure. <strong>Tractable starting point if behind on adoption.</strong>'], 'Alternative: purpose-built AI from Vic.ai, BlackLine, Trintech, FloQast — best-of-breed by function. Choose by what fits your existing finance platform.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Top 5 AI vendors in finance by spend · verify training opt-out + tenant isolation + retention in writing', ['<strong>Any can\'t tick all 3? Procurement remediation conversation for next quarter.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your finance AI roadmap · <em>1 page</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '3 standards · 1 vendor posture · IFRS 18 + CSRD anticipated.', '<strong>Last chapter:</strong> pick 2 use cases · 4 trust trip-wires · interactive roadmap builder.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 255.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

// Ch8
const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],threshold:'',cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='usecases'){var arr=state.usecases;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='finance-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases — Q1 + Q2)_';var t=state.threshold||'_(pick materiality threshold)_';var c=state.cadence||'_(pick cadence)_';return '# Finance AI · 2-Quarter Roadmap\\n\\n**CFO / Controller:** ____________________\\n**Start date:** ____________________\\n\\n## 2 use cases\\n'+uc+'\\n\\n## Materiality threshold\\n> '+t+'\\n\\n## Quality review cadence\\n'+c+'\\n\\n## Quarter 1\\n- Reconciliation copilots + variance narratives (quote-or-cut)\\n- 3 SOX controls + quad-eye flow established\\n\\n## Quarter 2\\n- One of: routine accruals · journal entry AI · AP automation\\n- Materiality threshold filter applied · quarterly accuracy review running\\n\\n## Trust trip-wires (do not cross)\\n- No AI signs the close\\n- No unreviewed accrual posts to the GL\\n- No untraceable source data\\n- No "set and forget"\\n\\n---\\nSource: Gennoor Academy · Function · AI for Finance & Accounting\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your finance AI roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 2 QUARTERS · 2 USE CASES', h1Html: 'Pick 2 · <em>quad-eye on everything material</em>', subtitleHtml: '7 chapters of landscape, forecasting, narratives, close, audit, sub-functions, standards. <strong>This chapter sequences them.</strong>' },
    { type: 'content', eyebrow: 'The principle · 2 not 7', icon: '1', headlineHtml: 'Pick two · <em>ship with quad-eye + 3 SOX controls</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 2 quarters · 1 quality framework', ['Mistake finance teams make: deploying AI across forecasting, recs, accruals, narratives, AP, AR, treasury, tax — all at once.', '<strong>Pick 2. Ship them with quad-eye + 3 SOX controls.</strong> Expand from demonstrated discipline.']) }] },
    { type: 'content', eyebrow: 'The sequence · default playbook', icon: '2', headlineHtml: 'Q1 recs + narratives · <em>Q2 one routine sub-function</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUARTER 1', 'Reconciliation + variance narratives', '', 'Two lowest-risk, highest-time-saving use cases. <strong>Together: value to audit committee without touching judgement work.</strong>', 'green')}
${cell('QUARTER 2', 'One of: routine accruals · JE AI · AP automation', '', 'Pick by which sub-function has cleanest source data. Materiality threshold filter applied.<br/><br/><em>Defer: revrec · judgement accruals · complex consolidation. Year 2 if framework holds.</em>')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No AI signs the close', '', 'Controller and CFO sign. AI is an assistant. <strong>Never the signer.</strong>', 'red')}
${cell('TRIP-WIRE 2', 'No unreviewed accrual posts', '', 'AI proposes. Human approves. <strong>No exceptions, even on routine accruals.</strong>', 'red')}
${cell('TRIP-WIRE 3', 'No untraceable source data', '', 'Every AI-touched entry links to a source from an approved system. No source. No entry.', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly accuracy review · quarterly audit-committee disclosure. Stop measuring → lost the controls.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pick · download · <em>take to CFO / audit committee chair</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases (Q1 + Q2)</h5><div class="preset" data-group="usecases">
<button data-val="Reconciliation copilots (bank + intercompany + balance-sheet)">Reconciliation</button>
<button data-val="Variance narratives (MD&amp;A · quote-or-cut)">Variance narratives</button>
<button data-val="Routine accrual proposals (utilities, rent, payroll fringe)">Routine accruals</button>
<button data-val="Journal entry AI from invoices + contracts">JE AI from source docs</button>
<button data-val="AP automation with AI line-item coding">AP automation</button>
<button data-val="Cash forecasting with calibrated intervals">Cash forecasting</button>
</div></div>
<div class="group"><h5>Materiality threshold</h5><div class="preset" data-group="threshold">
<button data-val="$100K-$500K (mid-market public)">$100K-$500K</button>
<button data-val="$500K-$1M (mid-market public · typical)">$500K-$1M</button>
<button data-val="$1M-$5M (large mid-market)">$1M-$5M</button>
<button data-val="$5M-$10M (large enterprise)">$5M-$10M</button>
</div></div>
<div class="group"><h5>Quality review cadence</h5><div class="preset" data-group="cadence">
<button data-val="Quarterly: 20 AI-touched entries reviewed + AC disclosure">Quarterly</button>
<button data-val="Monthly: 10 entries + quarterly AC disclosure">Monthly + quarterly AC</button>
<button data-val="Per-close sampling + quarterly portfolio review">Per-close + quarterly</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my finance AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Finance AI · 2-Quarter Roadmap

Pick 2 use cases, materiality threshold, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'AI on routine · <em>humans on judgement</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI on routine work · quad-eye on every material entry · 3 SOX controls always · quarterly accuracy review · audit-committee disclosure proactive · 2 use cases not 7 · the controller still signs the close.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one CFO or audit-committee-chair conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 50.0, slide: 3 }, { at: 60.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 },
    { at: 215.0, slide: 6 }, { at: 225.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 14 chapters 1-8 built.');
