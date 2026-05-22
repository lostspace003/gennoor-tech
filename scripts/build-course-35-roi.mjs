// Course 35 — AI ROI & Business Case Building (Emma · doc 05 #12 · NEW)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Finance · AI ROI + Business Case Building'
const OUT = 'tmp/academy-build/ai-roi-business-case-building/chapters'

const card = (ct, h3, ps, t) => `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardRed = (ct, h3, ps, t) => `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cell = (cn, h4, num, p, cls = '') => `<div class="cell ${cls}"><span class="cn">${cn}</span><h4>${h4}</h4>${num ? `<div class="num">${num}</div>` : ''}<p>${p}</p></div>`
const closeCard = (e, h2, p) => `<div class="final-close"><div class="eyebrow">${e}</div><h2>${h2}</h2><p>${p}</p></div>`
const baseCues = [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
  { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
  { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 },
]

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The AI ROI landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · WHY CASES FAIL', h1Html: '4 fail modes · <em>6-component framework</em>', subtitleHtml: '<strong>Most AI business cases fail not because the AI doesn\'t work — but because the case is built wrong.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Built wrong · <em>not technology wrong</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Inflated benefits · missing costs · zero risk', ['Most AI business cases fail because the case is built wrong. <strong>Inflated benefits. Missing costs. Risk treated as zero.</strong>', 'CFO and finance see the gap → project doesn\'t get funded.'], 'Teams that get funding: <strong>realistic benefits · honest costs · named risks · defensible methodology.</strong>') }] },
  { type: 'content', eyebrow: '4 fail modes', icon: '!', iconRed: true, headlineHtml: 'Vendor ROI · doubled benefits · missing costs · <em>zero risk</em>',
    blocks: [{ atStep: 1, html: cardRed('4 FAIL MODES OF TYPICAL AI BUSINESS CASES', 'Predictable patterns', ['<strong>1. Vendor-supplied ROI.</strong> "60% productivity improvement." Methodology unclear · peers anonymous · CFO can\'t validate. <em>Project paused.</em>', '<strong>2. Benefits doubled.</strong> Same benefit counted as "time saved" AND "cost reduction." <em>Finance catches this.</em>', '<strong>3. Costs missing.</strong> Implementation included. Change mgmt · data prep · retraining · license drift — missing.', '<strong>4. Risk treated as zero.</strong> Plan assumes everything goes right. No delay scenario. No model-below-target scenario.']) }] },
  { type: 'content', eyebrow: '6-component framework', icon: '2', headlineHtml: 'Problem · benefits · costs · risk · metric · <em>stakeholders</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('C1', 'Problem statement', '', 'Business terms, not AI terms.', 'green')}
${cell('C2', 'Benefits', '', 'Direct + indirect. Quantified honestly.', 'green')}
${cell('C3', 'Costs', '', 'Visible + hidden. Year 1-3.', 'green')}
${cell('C4', 'Risk register', '', '3-5 named risks with mitigations.', 'green')}
${cell('C5', 'Financial metric', '', 'NPV · IRR · payback chosen deliberately.', 'green')}
${cell('C6', 'Stakeholder map', '', 'Who says yes · who must not say no.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Finance reviewed · <em>30% haircut still passes</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE BUSINESS CASE READINESS', '2 questions', ['<strong>Q1:</strong> finance reviewed methodology? Yes + approved green · reviewed not approved amber · <strong>not yet shown red — finance will reject</strong>.', '<strong>Q2:</strong> case withstands a 30% benefit haircut and still passes? Yes green · marginally amber · <strong>no red — too optimistic</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull your most recent AI business case', ['Apply the 4-fail-mode test. <strong>Failures = your next revision priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Quantifying benefits · <em>direct + indirect + 3-scenario</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', '4 fail modes · 6-component framework · 2-question scoring.', '<strong>Next:</strong> 3 benefit categories · productivity trap · 3-scenario modelling.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Quantifying benefits' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-benefits.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · DIRECT vs INDIRECT', h1Html: '3 categories · productivity trap · <em>3-scenario modelling</em>', subtitleHtml: '<strong>Lead with direct cost reduction. Don\'t depend on indirect benefits for ROI.</strong>' },
  { type: 'content', eyebrow: '3 benefit categories', icon: '1', headlineHtml: 'Direct cost · revenue uplift · <em>indirect</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('B1', 'Direct cost reduction', '', 'Headcount · vendor spend · process automation. <strong>Quantifiable on P&L within 12 mo.</strong>', 'green')}
${cell('B2', 'Revenue uplift', '', 'Faster sales · better conversion · reduced churn. <strong>Quantifiable but with attribution gaps.</strong>', 'amber')}
${cell('B3', 'Indirect benefits', '', 'Risk reduction · quality · decision velocity. <strong>Real but hardest to quantify defensibly.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'The productivity trap', icon: '!', iconRed: true, headlineHtml: '"5 hours per week" · <em>where do those hours go?</em>',
    blocks: [{ atStep: 1, html: cardRed('THE PRODUCTIVITY BENEFIT TRAP', 'Most common claim. Most common finance objection.', ['<strong>The claim:</strong> "AI saves each user 5 hours per week."', '<strong>The finance objection:</strong> "Where do those hours go?"', 'If "more productive work" → <em>how do you measure that?</em> If "headcount reduction" → <em>which headcount and by when?</em>'], '<strong>Discipline:</strong> productivity benefits that don\'t translate to headcount or revenue don\'t count as ROI. They count as nice-to-have.') }] },
  { type: 'content', eyebrow: '3-scenario benefit modelling', icon: '2', headlineHtml: 'Conservative · base · <em>optimistic</em>',
    blocks: [{ atStep: 1, html: card('3-SCENARIO BENEFIT MODELLING', 'Build ROI using the conservative number', ['<strong>Conservative:</strong> 50% of vendor-claimed. Realistic for year 1.', '<strong>Base:</strong> 70-80% of vendor-claimed. Realistic by year 2.', '<strong>Optimistic:</strong> 90%+ of vendor-claimed. Achievable but requires execution.'], '<strong>Build the ROI case using conservative.</strong> If it passes → you have margin. If it doesn\'t → case isn\'t viable.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Direct + indirect separated · <em>conservative passes</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE BENEFIT QUANTIFICATION', '2 questions', ['<strong>Q1:</strong> case leads with direct cost reduction, indirect separated? Yes green · partial amber · <strong>all indirect red</strong>.', '<strong>Q2:</strong> 3-scenario modelling, conservative case passes? Yes green · single number amber · <strong>conservative fails red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull your benefit assumptions', ['Each one: direct or indirect? Attribution defensible? 3 scenarios? <strong>Failures = case-tightening priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Quantifying costs · <em>7-bucket discipline + year 2 surprise</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 categories · productivity trap · 3-scenario · scoring.', '<strong>Next:</strong> 7 cost buckets · year 2 surprise · internal cost honesty.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Quantifying costs' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-costs.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · 7-BUCKET DISCIPLINE', h1Html: '7 cost buckets · year 2 surprise · <em>internal cost honesty</em>', subtitleHtml: '<strong>Miss any bucket → case is incomplete.</strong>' },
  { type: 'content', eyebrow: '7 cost buckets', icon: '1', headlineHtml: 'Licenses · services · team · change · data · infra · <em>ongoing ops</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('B1', 'Licenses + subscriptions', '', 'AI platform · model APIs · productivity seats.', 'green')}
${cell('B2', 'Implementation services', '', 'Vendor + SI + internal consulting time.', 'green')}
${cell('B3', 'Internal team time', '', 'PM · IT · security · owners. <strong>Often largest cost.</strong>', 'green')}
${cell('B4', 'Change management', '', 'Training · communication · champions network.', 'green')}
${cell('B5', 'Data preparation', '', 'Quality · lineage · governance · integration. <strong>Invisible until you start.</strong>', 'green')}
${cell('B6', 'Infrastructure', '', 'Compute · storage · networking · monitoring. <strong>Cloud growth surprises.</strong>', 'green')}
${cell('B7', 'Ongoing operations', '', 'Year 2+ maintenance · retraining · support · license drift.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Year-2 cost surprise', icon: '!', iconRed: true, headlineHtml: 'Retraining · license drift · <em>adjacent use cases</em>',
    blocks: [{ atStep: 1, html: cardRed('THE YEAR-2 COST SURPRISE', 'Where most cases get caught short', ['<strong>Model retraining cycles.</strong> ~30-50% of original training cost. Annually.', '<strong>License drift.</strong> Vendor adds features · license tier creeps up. Budget surprise.', '<strong>Adjacent use cases.</strong> Success attracts requests · capacity expands · pricing escalates.'], '<strong>Discipline:</strong> build case across 3 years minimum. Year 2-3 costs realistically modelled.') }] },
  { type: 'content', eyebrow: 'Internal cost honesty', icon: '2', headlineHtml: 'Most-skipped category · <em>finance catches the gap</em>',
    blocks: [{ atStep: 1, html: card('INTERNAL COST HONESTY', 'PM · owners · IT · security', ['<strong>Project manager:</strong> 25% of 1 FTE · 12 months.', '<strong>Business owner:</strong> 15% of 1 FTE · 12 months.', '<strong>IT + security review:</strong> 10% of 2 FTEs · 12 months.'], '<strong>Well over $250K at common loaded rates.</strong> Most cases skip this. <em>Finance teams that do their own analysis catch the gap.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'All 7 buckets · <em>year 2+3 realistic</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE COST QUANTIFICATION', '2 questions', ['<strong>Q1:</strong> all 7 buckets included? Yes green · 5-6 amber · <strong><5 red — incomplete</strong>.', '<strong>Q2:</strong> year 2-3 realistically modelled, not zero? Yes green · partial amber · <strong>zero/impl-only red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Walk your case with the 7-bucket framework', ['Missing buckets = your case-completion priority.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Risk-adjusted ROI · <em>5 risks + 3 scenarios + sensitivity</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '7 buckets · year 2 surprise · internal honesty · scoring.', '<strong>Next:</strong> 5 AI-specific risks · 3-scenario ROI · sensitivity analysis.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Risk-adjusted ROI' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-risk.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · RISK + SCENARIOS + SENSITIVITY', h1Html: '5 risks · 3 scenarios · <em>sensitivity analysis</em>', subtitleHtml: '<strong>Finance respects sensitivity analysis. It shows you\'ve thought about what could go wrong.</strong>' },
  { type: 'content', eyebrow: '5 AI-specific risks', icon: '!', iconRed: true, headlineHtml: 'Performance · adoption · data · regulatory · <em>vendor shift</em>',
    blocks: [{ atStep: 1, html: cardRed('5 AI-SPECIFIC RISKS · EVERY CASE NAMES THEM', 'With mitigations', ['<strong>1. Model performance below target.</strong> Hits 65% accuracy when case assumed 85%. Benefits don\'t materialise · cost remains.', '<strong>2. Adoption shortfall.</strong> Tool deployed. Users don\'t change behaviour. Productivity stays theoretical.', '<strong>3. Data readiness gap.</strong> 6 mo in, data quality surfaces. Timeline slips · costs escalate.', '<strong>4. Regulatory/compliance constraint.</strong> EU AI Act classification · GDPR/DPDPA disclosure. Cost not in original.', '<strong>5. Vendor/tech shift.</strong> Pricing changes · product sunset · acquisition. Migration not budgeted.']) }] },
  { type: 'content', eyebrow: '3-scenario ROI', icon: '1', headlineHtml: 'Worst · base · <em>best</em>',
    blocks: [{ atStep: 1, html: card('3-SCENARIO ROI MODELLING', 'Present all three. Hide nothing.', ['<strong>Worst case:</strong> conservative benefits · high costs · risks materialise. Does case hold ANY value? If no → kill now.', '<strong>Base case:</strong> realistic benefits · realistic costs · 1-2 risks materialise. Does it meet your hurdle rate?', '<strong>Best case:</strong> optimistic benefits · disciplined costs · risks managed. What success looks like.'], '<strong>Make the case for base. Defend with worst-case still-viable.</strong>') }] },
  { type: 'content', eyebrow: 'Sensitivity analysis', icon: '2', headlineHtml: '3-5 variables · 20% adverse · <em>finance respects it</em>',
    blocks: [{ atStep: 1, html: card('SENSITIVITY ANALYSIS', 'Discipline finance respects', ['Pick 3-5 variables that most drive your case. <strong>Benefit per user · adoption rate · implementation timeline.</strong>', 'For each: <strong>what happens if it moves 20% in the wrong direction?</strong>'], 'If single variable moving 20% kills the case → <strong>too sensitive</strong>. Tighten variable · build mitigation · or kill project.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '5 risks named · <em>sensitivity run</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE RISK DISCIPLINE', '2 questions', ['<strong>Q1:</strong> 5 AI-specific risks named with mitigations? Yes green · 3-4 amber · <strong><3 red — finance sees naive</strong>.', '<strong>Q2:</strong> sensitivity analysis on 3-5 variables run and documented? Yes green · informal amber · <strong>no red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Run 20% adverse scenario on 3 variables', ['Variable that kills the case fastest = highest mitigation priority.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'NPV · IRR · payback · <em>which one when</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '5 risks · 3 scenarios · sensitivity · scoring.', '<strong>Next:</strong> 3 metrics · which one for which conversation · hurdle + discount rate.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'NPV, IRR, payback' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-financial-metrics.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · WHICH METRIC FOR WHICH CONVERSATION', h1Html: '3 metrics · 4 conversations · <em>hurdle + discount rate</em>', subtitleHtml: '<strong>Each metric answers a different question. Use all three.</strong>' },
  { type: 'content', eyebrow: '3 financial metrics', icon: '1', headlineHtml: 'NPV · IRR · <em>payback</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1', 'NPV', '', 'Total cash flows discounted to present. <strong>Most defensible single number.</strong>', 'green')}
${cell('M2', 'IRR', '', 'Discount rate at which NPV=0. Compared to hurdle rate. <strong>Easy as %.</strong>', 'green')}
${cell('M3', 'Payback period', '', 'When cumulative cash flow turns positive. <strong>Often the first question.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Which one when', icon: '2', headlineHtml: 'CFO · BU leader · CEO/board · <em>procurement</em>',
    blocks: [{ atStep: 1, html: card('WHICH METRIC FOR WHICH CONVERSATION', 'Same case, 4 views', ['<strong>CFO + finance:</strong> lead with NPV. That\'s their lens.', '<strong>BU leaders:</strong> lead with payback. That\'s budget commitment thinking.', '<strong>CEO + board:</strong> lead with IRR + payback. Quick % + time horizon.', '<strong>Procurement + sourcing:</strong> total cost of ownership. That\'s their lens.'], 'Build all four for stakeholder conversations.') }] },
  { type: 'content', eyebrow: 'Hurdle + discount rates', icon: '!', iconRed: true, headlineHtml: 'Get from finance · <em>before building the case</em>',
    blocks: [{ atStep: 1, html: cardRed('HURDLE + DISCOUNT RATES', 'Two numbers finance will ask about', ['<strong>Discount rate.</strong> Used for NPV. Often = firm\'s WACC. Ask your CFO.', '<strong>Hurdle rate.</strong> IRR threshold below which projects don\'t get funded. Often higher than discount rate to reflect project risk.'], '<strong>Get these BEFORE building the case.</strong> Building with wrong numbers → case doesn\'t pass when finance applies the right ones.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'All 3 metrics · <em>rates confirmed with finance</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FINANCIAL METRICS', '2 questions', ['<strong>Q1:</strong> NPV + IRR + payback all calculated with consistent assumptions? Yes green · 2 of 3 amber · <strong>single number only red</strong>.', '<strong>Q2:</strong> discount + hurdle rate confirmed pre-finalisation? Yes green · assumed amber · <strong>unknown red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Email your CFO or treasury', ['Ask: discount rate · hurdle rate · payback expectation for AI investments. <strong>5-line email saves 3 meetings later.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Stakeholders · <em>4 CFO questions + pre-mortem</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 metrics · 4 conversations · rates · scoring.', '<strong>Next:</strong> 3 stakeholder categories · 4 CFO questions · pre-mortem.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Stakeholders + CFO conversation' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-stakeholders.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · WHO MUST NOT SAY NO', h1Html: '3 categories · 4 CFO questions · <em>pre-mortem</em>', subtitleHtml: '<strong>Map each stakeholder by name. Position. Stake. Concern profile.</strong>' },
  { type: 'content', eyebrow: '3 stakeholder categories', icon: '1', headlineHtml: 'Sponsors · approvers · <em>influencers</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Sponsors', '', 'Executive needing the outcome. <strong>They drive yes.</strong>', 'green')}
${cell('S2', 'Approvers', '', 'CFO · finance · IT · security · procurement · legal. <strong>Their no kills it.</strong>', 'amber')}
${cell('S3', 'Influencers', '', 'Adjacent functions · affected teams · technical reviewers. <strong>Shape perception, rarely vote.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 CFO questions', icon: '2', headlineHtml: 'Payback · worst case · derailment · <em>month 12 success</em>',
    blocks: [{ atStep: 1, html: card('4 QUESTIONS YOUR CFO WILL ASK', 'Have answers ready', ['<strong>Q1 — what\'s the payback?</strong> ≤3 years usually clears. >5 usually doesn\'t.', '<strong>Q2 — what\'s the worst case?</strong> Don\'t hide it. Lead with worst, explain why base is realistic.', '<strong>Q3 — what could derail this?</strong> The 5 named risks. Name them before the CFO does.', '<strong>Q4 — what does success look like by month 12?</strong> Specific · measurable · auditable.'], '<strong>Answer all 4 in under 3 minutes → CFO-ready.</strong>') }] },
  { type: 'content', eyebrow: 'The pre-mortem', icon: '3', headlineHtml: 'Imagine 18 months in · <em>project failed · what went wrong?</em>',
    blocks: [{ atStep: 1, html: card('THE PRE-MORTEM DISCIPLINE', '90 minutes that save business cases', ['Before submitting the case for approval: <strong>run a pre-mortem.</strong>', 'Imagine it\'s 18 months in · project has failed. <strong>What went wrong?</strong>', 'Team brainstorms causes · groups them. <em>Most map to your named risks.</em> Ones that don\'t = blind spots.'], 'For each blind spot: add to risk register OR strengthen case to address.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Approvers pre-walked · <em>pre-mortem run</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE STAKEHOLDER READINESS', '2 questions', ['<strong>Q1:</strong> every approver pre-walked before formal review? All green · most amber · <strong>some/none red — surprise in meeting</strong>.', '<strong>Q2:</strong> pre-mortem run and documented? Yes green · informally amber · <strong>no red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List approvers by name', ['For each: have they seen a draft? <strong>Anyone who hasn\'t = yellow flag for formal review.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Realisation discipline · <em>4-quarter measurement cadence</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 categories · 4 CFO questions · pre-mortem · scoring.', '<strong>Next:</strong> realisation gap · 4-quarter cadence · 3 discipline rules.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Measuring after launch' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-realisation.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · THE REALISATION GAP', h1Html: '4-quarter cadence · <em>3 discipline rules</em>', subtitleHtml: '<strong>ROI realisation tracking is the case-builder\'s responsibility. Not finance\'s. Not the vendor\'s.</strong>' },
  { type: 'content', eyebrow: 'The realisation gap', icon: '!', iconRed: true, headlineHtml: 'Year 2 · <em>nobody measures actual vs projected</em>',
    blocks: [{ atStep: 1, html: cardRed('THE ROI REALISATION GAP', 'Most-skipped step in AI investment', ['<strong>Pattern:</strong> case approved year 0. Implementation year 1. Year 2 — nobody measures actual vs projected.', '<strong>Consequence:</strong> next AI case in same org is harder to fund. Finance has no reason to trust projections when last project\'s were never validated.'], '<strong>Discipline:</strong> ROI realisation tracking is the case-builder\'s responsibility.') }] },
  { type: 'content', eyebrow: '4-quarter cadence', icon: '1', headlineHtml: 'Adoption · productivity · outcomes · <em>annual ROI</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('Q1', 'Adoption + usage', '', 'Is the tool used? By whom? How much?', 'green')}
${cell('Q2', 'Productivity/activity', '', 'Tasks faster? Outputs better?', 'green')}
${cell('Q3', 'Outcome metrics', '', 'Did productivity translate to reduced spend or revenue?', 'green')}
${cell('Q4', 'Annual ROI', '', 'Actual vs projected. Variance explained. Future cases informed.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 discipline rules', icon: '2', headlineHtml: 'Baseline · same metrics · <em>variance honestly</em>',
    blocks: [{ atStep: 1, html: card('3 REALISATION DISCIPLINE RULES', 'Non-negotiable', ['<strong>1. Baseline captured pre-launch.</strong> Cannot measure improvement without it. Capture 30 days before launch.', '<strong>2. Same metrics used post-launch.</strong> Don\'t change definition between case and realisation. <em>Finance catches the swap.</em>', '<strong>3. Variance explained honestly.</strong> If actual is 60% of projected → explain why. Adoption? Assumption wrong? <em>Honesty earns the next case credibility.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Baseline captured · <em>variance cadence agreed</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE REALISATION READINESS', '2 questions', ['<strong>Q1:</strong> baseline captured pre-launch? Yes green · partial amber · <strong>no red — can\'t measure</strong>.', '<strong>Q2:</strong> variance reporting cadence agreed pre-launch? Yes green · informal amber · <strong>no red — credibility lost</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one AI project live in last 12 months', ['What did the case promise? What was the baseline? What\'s been measured? <strong>Gap = realisation priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: '2-week build cadence · 5 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Realisation gap · 4-quarter cadence · 3 rules · scoring.', '<strong>Last chapter:</strong> 2-week build · 5 trip-wires · interactive builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={type:'',metric:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-business-case-design.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var t=state.type||'_(pick project type)_';var m=state.metric||'_(pick primary metric)_';var s=state.sponsor||'_(pick sponsor profile)_';return '# AI Business Case Design Document\\n\\n**Case owner:** ____________________\\n**Submission target date:** ____________________\\n\\n## 1. Project type\\n> '+t+'\\n\\n## 2. Primary financial metric\\n> '+m+'\\n\\n## 3. Sponsor profile\\n> '+s+'\\n\\n## 6-Component checklist\\n- [ ] Problem statement in business terms\\n- [ ] Benefits: direct + indirect separated · 3 scenarios\\n- [ ] Costs: all 7 buckets · year 1-3\\n- [ ] Risk register: 5 AI-specific risks · mitigations\\n- [ ] Financial metric: NPV + IRR + payback · finance-confirmed rates\\n- [ ] Stakeholder map: sponsors · approvers · influencers · all pre-walked\\n\\n## 5 trust trip-wires (do not cross)\\n- Vendor-supplied ROI used directly · always recalculate\\n- Costs limited to year 1 · always model year 2-3\\n- Risk register empty or generic · always 5 AI-specific risks\\n- Single benefit number no scenarios · always 3 scenarios\\n- Baseline not captured before launch · ROI realisation impossible\\n\\n## 2-week build cadence\\n- W1: discovery + benefit + cost quantification\\n- W2: risk + financials + pre-mortem + approver pre-walk\\n\\n---\\nSource: Gennoor Academy · AI ROI & Business Case Building\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Building your own' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 2-WEEK BUILD', h1Html: '2-week cadence · 5 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Two weeks of disciplined work beats four weeks of polishing the wrong numbers.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Built deliberately · <em>not assembled</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Deliberate beats assembled', ['Business cases that get funded are built deliberately, not assembled. <strong>Two weeks of disciplined work beats four weeks of polishing the wrong numbers.</strong>']) }] },
  { type: 'content', eyebrow: '2-week cadence', icon: '2', headlineHtml: 'Week 1 quantify · <em>week 2 risk + finance + pre-walk</em>',
    blocks: [{ atStep: 1, html: card('THE 2-WEEK BUILD CADENCE', 'Disciplined sequence', ['<strong>Week 1 — discovery + quantification.</strong> Day 1-2: problem + stakeholder map. Day 3-4: benefit + 3 scenarios + discount rate from finance. Day 5: cost across 7 buckets, year 1-3.', '<strong>Week 2 — risk + financials + review.</strong> Day 1-2: risk register + sensitivity on 3-5 variables. Day 3: NPV + IRR + payback. Day 4: pre-mortem with adjacent teams. Day 5: pre-walk with each approver before formal submission.']) }] },
  { type: 'content', eyebrow: '5 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Vendor ROI · year 1 only · empty risk · single benefit · <em>no baseline</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('W1', 'Vendor ROI used directly', '', 'Always recalculate with your assumptions.', 'red')}
${cell('W2', 'Costs only year 1', '', 'Always model year 2-3.', 'red')}
${cell('W3', 'Risk register empty/generic', '', '5 AI-specific risks · mitigations.', 'red')}
${cell('W4', 'Single benefit, no scenarios', '', 'Always 3 scenarios.', 'red')}
${cell('W5', 'No baseline pre-launch', '', 'ROI realisation impossible without it.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your design doc', icon: '✓', headlineHtml: 'Project type · metric · sponsor · <em>take to CFO walk-through</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Project type</h5><div class="preset" data-group="type">
<button data-val="Productivity AI (Copilot, agent assist) — direct cost reduction via headcount reallocation">Productivity AI</button>
<button data-val="Process automation (document AI, ops AI) — direct cost reduction via process efficiency">Process automation</button>
<button data-val="Customer-facing AI (CS, sales) — revenue uplift + cost reduction (hybrid)">Customer-facing AI</button>
<button data-val="Data + analytics AI (forecasting, decision support) — indirect benefits + risk reduction">Data + analytics AI</button>
</div></div>
<div class="group"><h5>Primary financial metric</h5><div class="preset" data-group="metric">
<button data-val="NPV (for CFO conversation primary)">NPV</button>
<button data-val="Payback period (for BU leader conversation primary)">Payback</button>
<button data-val="IRR (for CEO/board conversation primary)">IRR</button>
</div></div>
<div class="group"><h5>Sponsor profile</h5><div class="preset" data-group="sponsor">
<button data-val="Function head with CFO partnership (CIO · CHRO · COO · CRO · etc)">Function head + CFO</button>
<button data-val="CFO directly (rare but cleanest)">CFO directly</button>
<button data-val="CEO sponsorship with CFO + function head joint review">CEO sponsorship</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my business case design doc (.md)</button>
</div>
<div class="preview" id="preview"># AI Business Case Design Document

Pick project type, primary metric, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: '6 components · 3 scenarios · 7 buckets · 5 risks · <em>realisation quarterly</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Business cases that get funded are built deliberately. Six components — problem, benefits, costs, risks, financial metric, stakeholders. Three benefit scenarios. Seven cost buckets. Five named AI risks. Realisation tracked quarterly.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your project type, primary metric, and sponsor profile.</div><div class="row"><span class="arr">→</span>Get the CFO walk-through on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 35 chapters 1-8 built.')
