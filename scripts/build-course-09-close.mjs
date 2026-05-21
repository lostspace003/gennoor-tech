// Build Course 9 chapter HTMLs — AI-Augmented Month-End Close (Emma)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Function · AI-Augmented Month-End Close';
const OUT = 'tmp/academy-build/ai-augmented-month-end-close/chapters';

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

// Ch1 — The close landscape
emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The close landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-close-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · THE LANDSCAPE', h1Html: '67% CFO adoption · <em>1.4 days off the close</em>', subtitleHtml: 'Gartner Q4 2025: 67% of CFOs deployed generative AI · 39% in close. KPMG: 1.4-day reduction at mature deployments. <strong>The thesis: AI works with the controls — not around them.</strong>' },
    { type: 'content', eyebrow: 'Adoption · Gartner Q4 2025 + KPMG GenAI Finance Pulse', icon: '1', headlineHtml: 'Middle of the curve · <em>not leading edge</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('GARTNER Q4 2025', 'CFOs deployed gen AI', '67%', 'For at least one finance process.')}
${cell('GARTNER Q4 2025', 'In close specifically', '39%', 'Not leading edge anymore.')}
${cell('KPMG GENAI FINANCE PULSE · SEP 2025', 'Median close reduced', '1.4 days', 'From 6.5 → 5.1 at mature deployments. <strong>Board-meeting-cycle change.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'The platforms · built-in, not bolted on', icon: '2', headlineHtml: 'Vic.ai · BlackLine · Trintech · FloQast · <em>MS Copilot for Finance</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('VIC.AI', 'AP + JE intelligence', '', 'Vendor invoice automation + journal entry intelligence.')}
${cell('BLACKLINE / TRINTECH', 'Reconciliation + R2R', '', '35–50% manual rec hours saved on mid-market PE deployments.')}
${cell('FLOQAST', 'Close coordination', '', 'Tie-out, task management, close calendar.')}
${cell('MS COPILOT FOR FINANCE', 'GA Nov 2024', '', 'D365 Finance + SAP S/4HANA. Layer over existing infra.')}
</div>` }] },
    { type: 'content', eyebrow: 'The cost benchmark · Hackett 2025', icon: '3', headlineHtml: '$0.85 → <em>$0.55 per $1K revenue</em>',
      blocks: [{ atStep: 1, html: card('HACKETT GROUP · CLOSE BENCHMARK 2025', '35% cost reduction · top-quartile to top-decile', ['Top-quartile finance teams: $0.85 per $1K revenue on close.', '<strong>AI-augmented top-decile aim: $0.55 per $1K revenue.</strong>'], 'The cost-per-close number is the dashboard. The audit-committee number is different: <em>hours saved with the same control quality.</em>') }] },
    { type: 'content', eyebrow: 'What works · what doesn\'t · 2026', icon: '4', headlineHtml: 'Routine works · <em>judgement still earns the fee</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('WORKS', 'Reconciliation · narratives · routine accruals · JEs from source docs', '', '~35–50% rec hours saved (vendor case studies). 50–70% time saved on MD&A (KPMG). 85–92% accuracy on routine accruals (vendor benchmarks).', 'green')}
${cell('DOESN\'T WORK', 'Judgement accruals · litigation/restructuring · complex revrec', '', 'Anything where the answer depends on facts only humans know.', 'red')}
</div>` },
        { atStep: 2, html: cardRed('THE FAILURE MODE AUDITORS ARE WATCHING FOR · 2026', 'The confabulated-source narrative · MD&A referencing a contract clause that doesn\'t exist', ['<strong>The demand-planning + finance version of Mata v. Avianca</strong> — the federal court case where lawyers were sanctioned for citing court opinions that didn\'t exist.', 'Same generative-AI behaviour. Different document. <strong>Audit committees, external auditors, and CFOs are now actively watching for this pattern.</strong>'], 'The failure mode that scares audit committees. Chapter 2 covers the quote-or-cut discipline that prevents it.') }
      ] },
    { type: 'content', eyebrow: 'What this course covers · the principle', icon: '→', headlineHtml: 'AI with the controls · <em>not around them</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1 · THE THESIS', 'AI works with the controls — not around them. <em>Quad-eye is the chorus.</em>', '<strong>Next:</strong> variance narratives — the most visible AI use case in the close. KPMG\'s 50–70% time saving + the quote-or-cut rule.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 }, { at: 225.0, slide: 5, step: 2 },
    { at: 255.0, slide: 6 }, { at: 265.0, slide: 6, step: 1 }
  ]
});

// Ch2 — Variance narratives
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Variance narratives' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-variance-narratives.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · QUOTE OR CUT', h1Html: 'MD&amp;A drafts · <em>50–70% time savings</em>', subtitleHtml: 'KPMG GenAI Finance Pulse: controllers report 50–70% time savings on month-over-month variance commentary. <strong>Every quantitative claim cited and verified — or cut.</strong>' },
    { type: 'content', eyebrow: 'The time saving · KPMG GenAI Finance Pulse', icon: '1', headlineHtml: 'A full day · <em>now 2–3 hours</em>',
      blocks: [{ atStep: 1, html: card('KPMG · GENAI FINANCE PULSE 2025', '50–70% time savings on month-over-month variance commentary', ['<strong>MD&A first drafts that used to take a full day now take 2–3 hours.</strong>', 'AI ingests variance file (actuals vs budget vs prior). Drafts the explanatory paragraphs. Controller validates.']) }] },
    { type: 'content', eyebrow: 'The failure mode auditors are watching for', icon: '!', iconRed: true, headlineHtml: 'The confabulated-source narrative · <em>same pattern as Mata v. Avianca</em>',
      blocks: [{ atStep: 1, html: cardRed('THE CONFABULATED-SOURCE FAILURE MODE', 'AI commentary confidently references a clause that doesn\'t exist · a promotion that wasn\'t run · a customer that didn\'t sign', ['The AI invents specific sources to justify a variance — because invented specifics sound credible.', '<strong>This is the variance-narrative version of <em>Mata v. Avianca</em></strong> — the federal court case where lawyers were sanctioned for citing court opinions that didn\'t exist.', 'Same generative-AI behaviour. Different document.'], 'Quote-or-cut. If AI says "Q3 revenue grew due to strategic customer deal in week 8" — there must be a Salesforce record or contract reference. No source — cut the sentence.') }] },
    { type: 'content', eyebrow: 'The workflow · 3 stages', icon: '2', headlineHtml: 'AI drafts · <em>controller validates · controller adds qualitative</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('STAGE 1', 'AI drafts', '', 'From variance file + source-document context. Narrative is the output.')}
${cell('STAGE 2', 'Controller validates', '', 'Reads each paragraph. <strong>Verifies each specific claim against source documents.</strong> Accepts/rejects/modifies.', 'amber')}
${cell('STAGE 3', 'Controller adds qualitative', '', 'The "why" the AI cannot know — customer decision, operational issue, strategic context. <strong>Where controller still earns the fee.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'The discipline · what separates careers', icon: '3', headlineHtml: 'Stage 2 discipline · <em>career-defining</em>',
      blocks: [
        { atStep: 1, html: card('THE DISCIPLINE', 'Controllers who validate every specific claim never ship the error', ['Controllers who trust the draft and forward — will eventually ship a fabricated clause.', 'The Mata v. Avianca analog: <strong>federal sanctions for the lawyer. Personal letters to the judges.</strong>', 'In a close cycle the equivalent is an audit-committee question, an external-auditor inquiry, and a board-meeting delay. <em>Different jurisdiction. Same generative-AI behaviour. Same consequence shape.</em>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick last month\'s MD&A · trace every quantitative claim to source', ['If you can\'t do it in 5 minutes per claim — <strong>source documentation isn\'t there.</strong> Process fix before you scale AI on this use case.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Accrual proposals · <em>85–92% accuracy on routine</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Every claim cited and verified · <em>or cut.</em>', '<strong>Next:</strong> accrual proposals — where 85–92% accuracy meets the materiality threshold filter.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 55.0, slide: 3 }, { at: 65.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 170.0, slide: 5 }, { at: 180.0, slide: 5, step: 1 }, { at: 215.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

// Ch3 — Accrual proposals
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Accrual proposals' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-accrual-proposals.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · ROUTINE WORKS', h1Html: '85–92% accuracy · <em>+20pp over junior baseline</em>', subtitleHtml: 'Vic.ai · BlackLine · Trintech case studies: 85–92% accuracy on routine accruals. <strong>AI proposes. Controller approves. Posting after approval.</strong>' },
    { type: 'content', eyebrow: 'The accuracy data · top-3 tools 2024-25', icon: '1', headlineHtml: '+20 percentage points over <em>junior accountant baseline</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('TOP-3 CLOSE-AI TOOLS', 'Routine accruals — utilities, rent, payroll fringe', '85–92%', 'Vic.ai, BlackLine, Trintech case studies 2024-25.', 'green')}
${cell('MANUAL · JUNIOR ACCOUNTANT BASELINE', 'First-pass accuracy', '60–70%', '~20 pp lift on routine work.')}
</div>` }, { atStep: 1, html: card('THE CATCH', '85–92% means 8–15% errors', ['The AI is not posting unreviewed accruals. <strong>AI proposes. Controller approves. Posting happens after approval.</strong>']) }] },
    { type: 'content', eyebrow: 'Where it works · predictable patterns', icon: '2', headlineHtml: 'Historical data + formula · <em>most of the way</em>',
      blocks: [{ atStep: 1, html: card('WHERE AI WORKS ON ACCRUALS', 'Predictable patterns the AI can model', ['<strong>Utilities</strong> — last month\'s bill + growth factor.', '<strong>Rent</strong> — contract-driven, known monthly.', '<strong>Payroll fringe</strong> — formula-driven, known parameters.', '<strong>Common operating costs</strong> with stable patterns.'], 'Pattern is recognisable. Historical data + formula gets most of the way. AI does matching/calculation/proposal. Controller checks and approves.') }] },
    { type: 'content', eyebrow: 'Where it doesn\'t · judgement accruals', icon: '!', iconRed: true, headlineHtml: 'Judgement accruals stay <em>manual</em>',
      blocks: [{ atStep: 1, html: cardRed('JUDGEMENT ACCRUALS · STAY MANUAL', 'AI drafts supporting analysis · controller concludes', ['<strong>Litigation reserves</strong> — depend on legal counsel probability + amount view.', '<strong>Restructuring accruals</strong> — depend on management decisions not yet documented.', '<strong>Complex revenue recognition</strong> — depend on contract interpretation + performance-obligation analysis.', 'These go to the audit committee for review. <strong>Do not deploy AI as primary source.</strong>']) }] },
    { type: 'content', eyebrow: 'The materiality threshold filter', icon: '3', headlineHtml: 'Above threshold · <em>manual sign-off mandatory</em>',
      blocks: [
        { atStep: 1, html: card('MATERIALITY THRESHOLD FILTER', 'Set in policy · document · audit committee will ask', ['<strong>Mid-market public:</strong> $500K–$1M per individual accrual.', '<strong>Large enterprise:</strong> $5–10M per individual accrual.', 'Above threshold: AI-proposed + manual sign-off. Below: AI calculation + controller quick approval.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter\'s accrual register · sort by type', ['Identify top 3 accrual types by volume and routine pattern. <strong>Those are AI candidates.</strong> Judgement accruals stay manual.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Reconciliation copilots · <em>35–50% hours saved</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'AI on routine accruals · <em>controllers on judgement accruals.</em>', '<strong>Next:</strong> reconciliation copilots — the highest-ROI use case in the close. Auto-clear thresholds + exception handling.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 220.0, slide: 5, step: 2 },
    { at: 245.0, slide: 6 }, { at: 255.0, slide: 6, step: 1 }
  ]
});

// Ch4 — Reconciliation copilots
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Reconciliation copilots' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-reconciliation-copilots.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · HIGHEST ROI', h1Html: '35–50% rec hours saved · <em>lowest risk, highest lift</em>', subtitleHtml: 'BlackLine + Trintech mid-market case studies. <strong>3 full days → 1.5 days.</strong> Bank rec, intercompany, balance-sheet rec. Where most finance teams should start.' },
    { type: 'content', eyebrow: 'The time saved · BlackLine + Trintech', icon: '1', headlineHtml: '3 days → <em>1.5 days</em>',
      blocks: [{ atStep: 1, html: card('BLACKLINE + TRINTECH · PE MID-MARKET DEPLOYMENTS 2025', '35–50% manual reconciliation hours saved', ['Bank rec, intercompany, balance-sheet account rec.', '<strong>Controller who used to spend 3 full days on month-end recs now spends 1.5.</strong>', 'Work eliminated: matching obvious transactions. Work that remains: investigating exceptions, resolving differences.']) }] },
    { type: 'content', eyebrow: 'The auto-clear pattern', icon: '2', headlineHtml: 'High-confidence auto-clear · <em>low-confidence flagged</em>',
      blocks: [{ atStep: 1, html: card('AUTO-CLEAR POLICY', 'Set the threshold · audit it quarterly', ['Auto-clear: above 95% confidence AND below dollar materiality.', 'Below 95% OR above materiality → controller reviews + approves match.', '<strong>Audit auto-clears quarterly.</strong> Pull a sample. Verify the AI\'s confidence calibration. If accuracy drops below threshold, tighten policy.']) }] },
    { type: 'content', eyebrow: 'The exception flow · 3 buckets', icon: '3', headlineHtml: '3 buckets · <em>Bucket 3 rate is the KPI to watch</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('BUCKET 1', 'Routine timing differences', '', 'Bank cleared tomorrow. AI proposes rec entry. <strong>Controller confirms.</strong>', 'green')}
${cell('BUCKET 2', 'Investigation required', '', 'Amount/party/date mismatch. AI proposes causes — duplicate, FX rounding, missing entry. Controller picks or pulls source.', 'amber')}
${cell('BUCKET 3', 'Escalate', '', 'AI says "I can\'t determine." Controller investigates manually. Sometimes escalates to senior controller or auditor.', 'red')}
</div>` }, { atStep: 1, html: card('THE KPI TO WATCH', 'Bucket 3 rate', ['Growing → AI is degrading. <strong>Shrinking with same quality → AI is improving.</strong>']) }] },
    { type: 'content', eyebrow: 'The failure mode · bank-feed mismatch', icon: '!', iconRed: true, headlineHtml: 'Out-of-sync bank feed · <em>two duplicates auto-clear together</em>',
      blocks: [
        { atStep: 1, html: cardRed('BANK-FEED MISMATCH FAILURE MODE', 'AI matches look right but actually aren\'t', ['If bank feed and GL are out of sync upstream, two duplicate transactions could both auto-clear against the same bank entry.'], 'Fix: reconcile the bank feed source <em>before</em> running AI rec. OR make the AI surface unmatched-on-both-sides items explicitly, not as auto-clears. Vendor configuration question — demo it before you sign.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Audit last quarter\'s bank rec auto-clears · 100 random', ['Verify accuracy. <strong>More than 2 errors? Auto-clear threshold too aggressive.</strong> Tighten before next close.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Journal-entry AI · <em>the audit committee questions</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Highest-ROI use case in the close. <em>Auto-clear threshold is the policy decision.</em>', '<strong>Next:</strong> JE AI — the Big-Four acceptance condition + the drafter/preparer/reviewer/approver quad-eye flow.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 65.0, slide: 3 }, { at: 75.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 190.0, slide: 5 }, { at: 200.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

// Ch5 — Journal entry AI
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Journal entry AI' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-journal-entry-ai.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · WHERE THE AUDIT COMMITTEE ASKS', h1Html: 'JEs from source docs · <em>quad-eye flow</em>', subtitleHtml: 'AI proposes journal entries from invoices, contracts, emails. <strong>Big-Four acceptance: traceable source + human approves + audit trail.</strong> SOX 404 angle in next chapter.' },
    { type: 'content', eyebrow: 'The use case · structured-source-document entries', icon: '1', headlineHtml: 'Invoices · contracts · wires · <em>not memos</em>',
      blocks: [{ atStep: 1, html: card('THE USE CASE', 'AI extracts → proposes JE → human approves', ['Invoice received → AP accrual entry. Contract signed → deferred revenue setup. Wire confirmed → cash entry.', '<strong>AI reads document, extracts fields, proposes JE: debit/credit/account/amount/description.</strong>', 'Best on high-volume structured source documents. Weakest on memos, meeting notes, judgemental entries.']) }] },
    { type: 'content', eyebrow: 'Big-Four acceptance condition · PwC + Deloitte + KPMG + EY 2024-25', icon: '2', headlineHtml: '3 conditions · <em>all must hold</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('CONDITION 1', 'Underlying source data traceable', '', 'Every AI-proposed JE links back to a specific source document. <strong>No source. No JE.</strong>')}
${cell('CONDITION 2', 'Human approves before posting', '', 'The AI never posts directly. Approval is a control, not a formality.')}
${cell('CONDITION 3', 'Audit trail captures AI tool', '', 'Matter file, JE record, close docs — all reference which tool generated the proposal.')}
</div>` }, { atStep: 1, html: card('THE STANDARD', 'Tick all 3 in writing → audit-defensible', ['Miss one — external auditor will require remediation.']) }] },
    { type: 'content', eyebrow: 'The quad-eye flow · 4 distinct roles', icon: '3', headlineHtml: 'Drafter · preparer · reviewer · <em>approver</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('ROLE 1 · DRAFTER', 'AI', '', 'Generates proposed JE from source document.')}
${cell('ROLE 2 · PREPARER', 'Analyst', '', 'Reviews proposal, confirms calculation, adjusts if needed. Signs off.')}
${cell('ROLE 3 · REVIEWER', 'Controller / Manager', '', 'Independent review. Checks materiality, account coding, period. Signs off.')}
${cell('ROLE 4 · APPROVER', 'Director / CFO', '', 'For material entries. Final approval before posting.')}
</div>` }, { atStep: 1, html: card('THE DISCIPLINE', 'Each role = distinct person · distinct sign-off', ['Same person doing preparer + reviewer breaks segregation-of-duties control.']) }] },
    { type: 'content', eyebrow: 'The SOX 404 angle', icon: '4', headlineHtml: '3 controls · <em>have answers, have evidence</em>',
      blocks: [
        { atStep: 1, html: card('SOX SECTION 404 · ICFR + COSO ERM UPDATES 2024', 'AI-touched processes need explicit controls', ['Control over AI input · Control over AI output review · Control over AI tool documentation.', '<strong>External auditor will ask:</strong> "Show me how you control which source docs go to the AI." "Show me review evidence on AI-proposed entries." "Show me what AI tool was used and when."'], 'Have answers. Have evidence. <em>No improvisation on this.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick last month\'s AI-proposed JEs · can you trace every source?', ['Yes for all → good baseline. <strong>Even one source can\'t be traced — that\'s the gap.</strong> Fix before next close.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'SOX-friendly audit trail · <em>3 controls in detail</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'AI proposes. Human approves. Audit trail logs the tool. <em>That\'s the rule.</em>', '<strong>Next:</strong> the 3 controls every AI-touched close process needs — and the PCAOB/IAASB updates.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// Ch6 — SOX-friendly audit trail
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'SOX-friendly audit trail' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-sox-audit-trail.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · PRINT THIS', h1Html: '3 controls · <em>the audit trail external auditors sign</em>', subtitleHtml: 'COSO ERM 2024 updates. SOX 404. PCAOB QC 1000. IAASB ISA 220. <strong>3 controls. Document each. Internal audit tests each.</strong>' },
    { type: 'content', eyebrow: 'The framework · COSO + SOX 404 2024 updates', icon: '1', headlineHtml: 'AI-touched ICFR · <em>3 distinct control points</em>',
      blocks: [{ atStep: 1, html: card('COSO ERM UPDATES 2024 + SOX SECTION 404', 'AI-touched processes need 3 distinct controls', ['SOX 404 now expected to cover AI inputs, AI outputs, AI tool documentation as distinct control points.', '<strong>Document each. Get internal audit to test each. Move on.</strong>']) }] },
    { type: 'content', eyebrow: 'Control 1 · AI input', icon: '2', headlineHtml: 'What data goes to AI · <em>who decides · how documented</em>',
      blocks: [{ atStep: 1, html: card('CONTROL 1 · AI INPUT CONTROL', 'Source documents must come from approved systems', ['No screenshots from emails posted into chat.', 'Workflows routing invoices/contracts/source files to AI must be defined and logged.', '<strong>Test internal audit will run:</strong> sample of AI-touched entries, trace each back to source. If any unverifiable — control fails.']) }] },
    { type: 'content', eyebrow: 'Control 2 · AI output review', icon: '3', headlineHtml: 'Quad-eye · <em>evidence of independent review</em>',
      blocks: [{ atStep: 1, html: card('CONTROL 2 · AI OUTPUT REVIEW', 'Drafter → preparer → reviewer → approver · with evidence', ['Distinct people. Distinct sign-offs.', '<strong>In the close binder:</strong> evidence of preparer review, reviewer review, approver sign-off. Initials, dates, names.', 'The control is the review. The evidence is the proof of the review.'], 'Internal audit will test: did each AI-proposed entry have evidence of independent review before posting?') }] },
    { type: 'content', eyebrow: 'Control 3 · AI tool documentation', icon: '4', headlineHtml: 'AI register per close · <em>1 page · 7 fields</em>',
      blocks: [{ atStep: 1, html: card('CONTROL 3 · AI TOOL DOCUMENTATION · PCAOB QC 1000 + IAASB ISA 220', 'For every AI tool: vendor, version, scope, training opt-out, retention, last-tested date', ['Not optional in 2026. PCAOB QC 1000 + IAASB ISA 220 updates require auditors to document AI use when material to opinion.', '<strong>Your job: make that easy for them.</strong> One-page AI register per close cycle. Updated each close.']) }, { atStep: 1, html: cardRed('EY AI IN AUDIT SURVEY 2025', '78% of CFOs concerned · 41% already changed procedures', ['<strong>If you\'re not in the 41% yet — you will be by next year.</strong>']) }] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Quality framework · <em>audit committee disclosure</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 controls · documented · tested · <em>external auditor signs.</em>', '<strong>Next:</strong> quality framework — materiality threshold, quarterly accuracy review, audit-committee disclosure (Deloitte 62% want it).') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 },
    { at: 245.0, slide: 6 }, { at: 255.0, slide: 6, step: 1 }
  ]
});

// Ch7 — Quality framework
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Quality framework' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-quality-framework.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · OPERATIONAL DISCIPLINE', h1Html: 'Quad-eye · materiality · <em>quarterly review · audit committee</em>', subtitleHtml: '5 operational decisions every controller needs. <strong>62% of audit committees want explicit AI-use disclosure.</strong> Get there proactively.' },
    { type: 'content', eyebrow: 'Quad-eye principle · who reviews what', icon: '1', headlineHtml: 'Above materiality · <em>4 distinct people</em>',
      blocks: [{ atStep: 1, html: card('QUAD-EYE PRINCIPLE', 'Drafter (AI) → preparer → reviewer → approver', ['Distinct individuals. Distinct sign-offs.', '<strong>The framework here:</strong> which entries require all 4 vs lighter touch.']) }] },
    { type: 'content', eyebrow: 'Materiality threshold · the policy decision', icon: '2', headlineHtml: 'Above floor · quad-eye · <em>below floor · lighter touch</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('MID-MARKET PUBLIC', 'Per individual entry', '$100K–$1M', 'Above threshold: quad-eye mandatory.')}
${cell('LARGE ENTERPRISE', 'Per individual entry', '$5–10M', 'Below threshold: quad-eye recommended but lighter touch acceptable.')}
</div>` }, { atStep: 1, html: card('THE AUDIT COMMITTEE WILL ASK', 'What is your threshold?', ['Have a one-sentence answer. Document it in the close manual.']) }] },
    { type: 'content', eyebrow: 'Quarterly accuracy review · the discipline', icon: '3', headlineHtml: 'Pull 20 AI-touched entries · <em>senior controller checks</em>',
      blocks: [{ atStep: 1, html: cardGreen('QUARTERLY ACCURACY REVIEW', 'Top-decile finance teams: AI error rate under 5% on routine accruals', ['<strong>Without the review, error rate drifts up.</strong> Model behaviour changes, source data quality changes, controllers\' validation discipline drifts.', 'Output is action: tighten prompts · retrain preparers · adjust which entry types route through AI. <strong>Use the data.</strong>']) }] },
    { type: 'content', eyebrow: 'Audit committee disclosure · Deloitte ACP Q4 2025', icon: '4', headlineHtml: '62% want disclosure · <em>31% want sample-testing</em>',
      blocks: [
        { atStep: 1, html: card('DELOITTE AUDIT COMMITTEE PULSE · Q4 2025', '62% want explicit AI-use disclosure in close docs · 31% require additional sample-testing', ['<strong>Prepare the AI disclosure before the audit committee asks.</strong>', 'One-pager · 5 sections: <strong>tools used · scope · controls · error rates · planned changes.</strong>', 'Bring it proactively.'], 'CFOs who do this get questions about scope and expansion. CFOs who don\'t get questions about adequacy of controls. Be in the first group.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Draft your AI-use disclosure for the next audit committee', ['One page. 5 sections. <strong>If you can\'t fill section 4 (error rates) with real numbers — your quality review isn\'t running.</strong> Start it this quarter.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 8', icon: '→', headlineHtml: 'Making it stick · <em>your 2-quarter rollout</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Quad-eye · materiality · quarterly review · audit-committee disclosure. <em>The operational framework.</em>', '<strong>Last chapter:</strong> 2-quarter rollout playbook · 4 trust trip-wires · the course in one sentence.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 95.0, slide: 4 }, { at: 105.0, slide: 4, step: 1 },
    { at: 150.0, slide: 5 }, { at: 160.0, slide: 5, step: 1 }, { at: 195.0, slide: 5, step: 2 },
    { at: 235.0, slide: 6 }, { at: 245.0, slide: 6, step: 1 }
  ]
});

// Ch8 — Rollout playbook
const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],threshold:'',cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='usecases'){var arr=state.usecases;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='close-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases — Q1 + Q2)_';var t=state.threshold||'_(pick threshold)_';var c=state.cadence||'_(pick cadence)_';return '# Close AI · 2-Quarter Roadmap\\n\\n**Owner:** ____________________\\n**Start date:** ____________________\\n\\n## 2 use cases\\n'+uc+'\\n\\n## Materiality threshold\\n> '+t+'\\n\\n## Quality review cadence\\n'+c+'\\n\\n## Quarter 1\\n- Reconciliation copilots: bank rec + intercompany + balance-sheet\\n- Variance narratives (quote-or-cut rule)\\n- 3 SOX controls + quad-eye flow established\\n\\n## Quarter 2\\n- Routine accrual proposals (utilities, rent, payroll fringe)\\n- Materiality threshold filter applied\\n- Quarterly accuracy review running\\n\\n## Trust trip-wires (do not cross)\\n- No AI signs the close\\n- No unreviewed accrual posts to the GL\\n- No untraceable source data\\n- No "set and forget"\\n\\n---\\nSource: Gennoor Academy · Function · AI-Augmented Month-End Close\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your close AI roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-rollout-playbook.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · THE ROADMAP', h1Html: '2 use cases · 2 quarters · <em>quad-eye on everything material</em>', subtitleHtml: 'Seven chapters of landscape, narratives, accruals, reconciliations, journals, audit trail, quality. <strong>This chapter sequences them.</strong>' },
    { type: 'content', eyebrow: 'The principle · 2 not 7', icon: '1', headlineHtml: 'Pick two · <em>ship them with quad-eye + 3 SOX controls</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 2 quarters · 1 quality framework', ['The mistake finance teams make: deploying AI across recs, accruals, narratives, journals, AP, AR, FP&A all at once.', '<strong>Pick two. Ship them with quad-eye and the 3 SOX controls.</strong> Expand from demonstrated discipline.']) }] },
    { type: 'content', eyebrow: 'The sequence · default playbook', icon: '2', headlineHtml: 'Q1 rec + narratives · <em>Q2 routine accruals</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUARTER 1', 'Reconciliation copilots + variance narratives', '', 'The two lowest-risk, highest-time-saving use cases. Rec saves most hours per close. Narratives are most visible deliverable. <strong>Together: value to audit committee without touching judgement work.</strong>', 'green')}
${cell('QUARTER 2', 'Routine accrual proposals', '', 'Utilities, rent, payroll fringe. Materiality threshold filter applied. Quad-eye flow in place. <strong>AI starts touching the GL — but only on the routine end.</strong><br/><br/><em>Defer: revenue recognition · judgement accruals · complex consolidation. Year 2 if framework holds.</em>')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No AI signs the close', '', 'Controller and CFO sign. AI is an assistant. <strong>Never the signer.</strong>', 'red')}
${cell('TRIP-WIRE 2', 'No unreviewed accrual posts', '', 'AI proposes. Human approves. <strong>No exceptions, even on routine accruals.</strong>', 'red')}
${cell('TRIP-WIRE 3', 'No untraceable source data', '', 'Every AI-touched entry links to a source from an approved system. No source. No entry.', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly accuracy review + audit-committee disclosure. <strong>Stop measuring, you\'ve lost the controls.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your close AI roadmap', icon: '✓', headlineHtml: 'Pick your 2 · <em>download · take to CFO / audit committee</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases (Q1 + Q2)</h5><div class="preset" data-group="usecases">
<button data-val="Reconciliation copilots (bank + intercompany + balance-sheet)">Reconciliation copilots</button>
<button data-val="Variance narratives (MD&amp;A first drafts, quote-or-cut)">Variance narratives</button>
<button data-val="Routine accrual proposals (utilities, rent, payroll fringe)">Routine accruals</button>
<button data-val="Journal entry AI from invoices + contracts">JE AI from source docs</button>
<button data-val="AP automation with AI line-item coding">AP automation</button>
<button data-val="Balance-sheet account substantiation">BS substantiation</button>
</div></div>
<div class="group"><h5>Materiality threshold (per individual entry)</h5><div class="preset" data-group="threshold">
<button data-val="$100K (mid-market public · low end)">$100K</button>
<button data-val="$500K (mid-market public · typical)">$500K</button>
<button data-val="$1M (mid-market public · high end)">$1M</button>
<button data-val="$5M (large enterprise)">$5M</button>
<button data-val="$10M (large enterprise)">$10M</button>
</div></div>
<div class="group"><h5>Quality review cadence</h5><div class="preset" data-group="cadence">
<button data-val="Quarterly: 20 AI-touched entries reviewed + AC disclosure">Quarterly</button>
<button data-val="Monthly: 10 entries reviewed + quarterly AC disclosure">Monthly review</button>
<button data-val="Per-close sampling + quarterly portfolio review">Per-close + quarterly</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my close AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Close AI · 2-Quarter Roadmap

Pick use cases, materiality threshold, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'AI with the controls · <em>quad-eye is the chorus</em>',
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

console.log('\n✓ Course 9 chapters 1-8 built.');
