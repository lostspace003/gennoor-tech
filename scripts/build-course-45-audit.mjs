// Course 45 — AI Risk for Audit Committees (Emma · leadership track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Leadership · AI Risk for Audit Committees'
const OUT = 'tmp/academy-build/ai-risk-for-audit-committees/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'AI in the risk universe' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-universe.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · 4 BUCKETS · 3 DON\'T-FIT RISKS', h1Html: 'Where AI fits in the risk universe · <em>and where it doesn\'t</em>', subtitleHtml: '<strong>Most committees treat AI as operational. It\'s actually four risk types at once.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'AI in all buckets it touches · <em>not just one</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'AI risk doesn\'t fit cleanly', ['<strong>AI risk doesn\'t fit cleanly into the existing risk universe.</strong> Most audit committees still treat it as an operational risk subcategory — when it\'s actually four risk types at once.'], '<strong>Discipline:</strong> locate AI risk in all the buckets it touches, not just one.') }] },
  { type: 'content', eyebrow: '4 buckets AI touches', icon: '2', headlineHtml: 'Operational · compliance · strategic · <em>reputational</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('B1', 'Operational', '', 'Outage · latency · concurrency failure. <strong>Where most committees place AI. Necessary, not sufficient.</strong>', 'green')}
${cell('B2', 'Compliance', '', 'EU AI Act · GDPR · DPDPA · HIPAA · SAMA · RBI. <strong>Multi-jurisdictional by default.</strong>', 'green')}
${cell('B3', 'Strategic', '', 'Wrong platform · vendor sunset · architecture lock-in. <strong>Surfaces 18-24 months later.</strong>', 'amber')}
${cell('B4', 'Reputational', '', 'Hallucinated customer answer · bias incident · AI-generated errors. <strong>Mata v. Avianca · Air Canada Moffatt.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '3 don\'t-fit risks', icon: '!', iconRed: true, headlineHtml: 'Model drift · bias · <em>cognitive offloading</em>',
    blocks: [{ atStep: 1, html: cardRed('3 RISKS AI INTRODUCES THAT DON\'T MAP CLEANLY', '', ['<strong>1. Model behaviour drift.</strong> Model worked yesterday · worked last quarter · doesn\'t work this week because vendor updated. <em>No traditional framework catches this.</em>', '<strong>2. Bias risk.</strong> Same model, different fairness profiles for different groups. Not operational · not compliance — until discrimination lawsuit.', '<strong>3. Cognitive offloading at decision boundaries.</strong> Decisions that used to require human judgement now happen without it. <em>Risk lives in process design, not control failure.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Risk universe covers 4 buckets · <em>committee charter updated</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI RISK UNIVERSE COVERAGE', '2 questions', ['<strong>Q1:</strong> risk universe explicitly covers AI in all 4 buckets? Documented green · operational only amber · <strong>no formal coverage red — surprises waiting</strong>.', '<strong>Q2:</strong> audit committee charter updated to include AI assurance? Yes green · informally amber · <strong>no red — authority lags risk</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull risk universe document', ['For each bucket, ask: where does AI show up? <strong>Empty buckets = next agenda item.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Inherent vs residual risk · <em>controls-assumed anti-pattern</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', '4 buckets · 3 don\'t-fit risks · scoring.', '<strong>Next:</strong> 4 inherent dimensions · controls-assumed trap.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Inherent vs residual risk' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-inherent.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · INHERENT - CONTROLS = RESIDUAL', h1Html: '4 inherent dimensions · <em>controls-assumed anti-pattern</em>', subtitleHtml: '<strong>Easy to write. Hard to do honestly.</strong>' },
  { type: 'content', eyebrow: 'The discipline', icon: '1', headlineHtml: 'Inherent · residual · <em>gap = control effectiveness</em>',
    blocks: [{ atStep: 1, html: card('THE DISCIPLINE · APPLIED HONESTLY', '', ['<strong>Inherent risk.</strong> Risk before any controls. What the AI system could do at its worst.', '<strong>Residual risk.</strong> Risk after current controls operating as designed.'], '<strong>The gap between the two is your control effectiveness.</strong> Easy to write. Hard to do honestly.') }] },
  { type: 'content', eyebrow: '4 inherent dimensions', icon: '2', headlineHtml: 'Output sensitivity · automation depth · population · <em>recovery difficulty</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('D1', 'Output sensitivity', '', 'Worst output possible? Wrong medical advice · biased loan · hallucinated submission. <strong>Air Canada Moffatt cross-domain.</strong>', 'amber')}
${cell('D2', 'Automation depth', '', 'Input · assisted · deciding? <strong>Inherent risk scales with automation depth.</strong>', 'amber')}
${cell('D3', 'Population affected', '', '1 internal user vs 10K external. <strong>Scales with population reach.</strong>', 'amber')}
${cell('D4', 'Recovery difficulty', '', 'Public correction · lawsuit · regulatory action. <strong>Scales with recovery cost.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Controls-assumed anti-pattern', icon: '!', iconRed: true, headlineHtml: 'Inherent high · controls stated · residual low · <em>without testing</em>',
    blocks: [{ atStep: 1, html: cardRed('THE "CONTROLS ASSUMED" ANTI-PATTERN', '', ['<strong>Pattern:</strong> inherent high · stated controls in place · residual rated low.', '<strong>6 months later:</strong> control failed during incident. Residual was not actually low — it was nominal.'], '<strong>Fix:</strong> test controls before accepting residual ratings. Sample tests · walk-throughs · live demonstration. <em>Not "policy exists." When you can\'t test, residual should be amber until tested.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '4-dimension rating · <em>controls tested or assumed</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE RISK RATING DISCIPLINE', '2 questions', ['<strong>Q1:</strong> top 5 AI use cases inherent risk rated across all 4 dimensions? Yes green · single composite amber · <strong>no/single number red — losing nuance</strong>.', '<strong>Q2:</strong> for residual ratings on high-inherent, controls tested or assumed? Tested green · partial amber · <strong>assumed-and-green red — anti-pattern</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick highest inherent-risk AI use case', ['Walk control testing evidence. <strong>If "policy exists" is the evidence, that\'s the testing backlog.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Mapping AI to control frameworks · <em>COSO · 3 lines · NIST AI RMF</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 dimensions · controls-assumed trap · scoring.', '<strong>Next:</strong> 3 frameworks · NIST overlay · 3 integration patterns.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Mapping AI to control frameworks' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-frameworks.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · OVERLAY · NOT REPLACE', h1Html: '3 existing frameworks · NIST AI RMF for the gaps · <em>3 integration patterns</em>', subtitleHtml: '<strong>Don\'t rewrite. Add the AI-specific layer.</strong>' },
  { type: 'content', eyebrow: '3 frameworks you already use', icon: '1', headlineHtml: 'COSO ERM · 3 lines · <em>ISO 31000</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('F1', 'COSO ERM', '', 'Most US-domiciled + listed. Risk ID · assess · response · monitoring.', 'green')}
${cell('F2', 'Three Lines of Defense', '', 'Almost universal in BFSI + regulated. <strong>First (ops) · second (risk+compliance) · third (audit).</strong>', 'green')}
${cell('F3', 'ISO 31000', '', 'International standard. Common in EU · India · GCC enterprises.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'NIST AI RMF fills gaps', icon: '2', headlineHtml: 'Govern · map · measure · <em>manage</em>',
    blocks: [{ atStep: 1, html: card('NIST AI RMF OVERLAY · 4 CORE FUNCTIONS', 'Maps onto existing frameworks · doesn\'t replace', ['<strong>Govern.</strong> Policies · accountabilities · oversight · culture.', '<strong>Map.</strong> Risk identification in context. The 4 risk dimensions from chapter 2.', '<strong>Measure.</strong> Quantitative + qualitative metrics. Bias testing · drift monitoring.', '<strong>Manage.</strong> Risk response · controls · incident handling.'], '<strong>Maps onto COSO + 3 lines + ISO 31000 without replacement.</strong> Govern → COSO control environment. Map → risk assessment. Measure → monitoring. Manage → control activities.') }] },
  { type: 'content', eyebrow: '3 integration patterns', icon: '3', headlineHtml: 'Overlay · catalog extension · <em>control library extension</em>',
    blocks: [{ atStep: 1, html: card('3 INTEGRATION PATTERNS THAT WORK', '', ['<strong>1. Overlay, not replace.</strong> Don\'t rewrite COSO. Add NIST AI RMF as AI-specific layer.', '<strong>2. Risk catalog extension.</strong> Add 12-15 AI-specific risks. Drift · bias · hallucination · model lineage · vendor dependency.', '<strong>3. Control library extension.</strong> Add 8-12 AI-specific controls. Eval suites · drift monitoring · override documentation · sub-processor approval.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Catalog extended · <em>control library AI-specific</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FRAMEWORK MAPPING', '2 questions', ['<strong>Q1:</strong> risk catalog extended with AI-specific risks? 12+ green · 5-11 amber · <strong><5 red — catalog lags reality</strong>.', '<strong>Q2:</strong> control library includes AI-specific, or only generic IT? Extended green · partial amber · <strong>generic-IT-only red — controls don\'t catch what they need to</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Walk risk catalog with CRO', ['How many AI-specific risks? <strong>If under 10, that\'s the catalog extension work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Audit committee questions · <em>9-question line of inquiry</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 frameworks · NIST overlay · 3 patterns.', '<strong>Next:</strong> 9 questions · maturity vs rehearsal.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Audit committee questions' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-questions.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · 9 QUESTIONS · 3 CATEGORIES', h1Html: 'Maturity vs rehearsal · <em>press for specifics</em>', subtitleHtml: '<strong>Three rounds of generality = rehearsal.</strong>' },
  { type: 'content', eyebrow: '9 questions · 3 categories', icon: '1', headlineHtml: 'Governance · operations · <em>assurance</em>',
    blocks: [{ atStep: 1, html: card('9 QUESTIONS IN 3 CATEGORIES', '', ['<strong>Governance (Q1-3).</strong> Named accountable executive? Policies + last update? AI in board reporting?', '<strong>Operations (Q4-6).</strong> Eval suite + cadence for top AI? What happens when AI is wrong? How do we know when behaviour drifted?', '<strong>Assurance (Q7-9).</strong> Which AI controls has internal audit tested in 12 months? External assurance scope? What would change the risk rating?']) }] },
  { type: 'content', eyebrow: 'Maturity vs rehearsal', icon: '2', headlineHtml: 'Specific vs general · evidence vs <em>"we have policies"</em>',
    blocks: [{ atStep: 1, html: card('DISTINGUISHING MATURITY FROM REHEARSAL', '', ['<strong>Maturity answer:</strong> specific · includes names · references evidence (date, doc, finding) · acknowledges current weakness.', '<strong>Rehearsal answer:</strong> general · future-tense framing · generic best-practice language · no acknowledged gaps.'], '<strong>The committee\'s job:</strong> press for specifics. When you get generality, ask one more time. Three rounds of generality = rehearsal.') }] },
  { type: 'content', eyebrow: 'Examples · maturity vs rehearsal', icon: '!', iconRed: true, headlineHtml: 'Q4 specifics · Q5 specifics · <em>Q9 specifics</em>',
    blocks: [{ atStep: 1, html: cardRed('EXAMPLE ANSWERS · MATURITY vs REHEARSAL', '', ['<strong>Q4 — eval suite for top AI.</strong><br>Maturity: "150 gold cases for FX-pricing model, run nightly with LLM-as-judge, results compared against baseline."<br>Rehearsal: "We have evaluation processes."', '<strong>Q5 — what happens when AI is wrong.</strong><br>Maturity: "Customer-facing AI escalates to human after 2 user complaints in 24h. Playbook owned by Service Director Priya."<br>Rehearsal: "We have escalation procedures."', '<strong>Q9 — what changes the rating.</strong><br>Maturity: "Drop in groundedness below 88% triggers amber. Sub-processor breach triggers red."<br>Rehearsal: "We reassess regularly."']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'All 9 walked · <em>pressed for specifics</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AUDIT COMMITTEE INQUIRY DISCIPLINE', '2 questions', ['<strong>Q1:</strong> committee walked all 9 questions with AI risk owner in last 12 mo? Documented green · informally amber · <strong>no red — questions not asked</strong>.', '<strong>Q2:</strong> when answers were generic, committee pressed for specifics or accepted? Pressed green · sometimes amber · <strong>accepted red — committee theatre</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Send 9 questions to CRO 48h before next review', ['Specific answers → maturity. Rehearsed answers → priorities.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Independent assurance approaches · <em>3 lines for AI</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '9 questions · maturity vs rehearsal.', '<strong>Next:</strong> 3 lines for AI · 12-month audit plan.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Independent assurance' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-assurance.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · 3 LINES OF DEFENSE FOR AI', h1Html: 'Which line for which control · <em>12-month audit plan</em>', subtitleHtml: '<strong>Audit covers AI without over-rotating.</strong>' },
  { type: 'content', eyebrow: '3 lines mapped to AI', icon: '1', headlineHtml: 'First · second · <em>third</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('L1', 'First line · ops + owners', '', 'AI feature owners run day-to-day. <strong>Eval suites · drift · incident.</strong>', 'green')}
${cell('L2', 'Second line · risk + compliance', '', 'Model risk · compliance · governance. <strong>Policy · framework · second-look on launches.</strong>', 'green')}
${cell('L3', 'Third line · internal audit', '', 'Independent assessment. <strong>Sample-test · walk-through · report to committee.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Which line for which control', icon: '2', headlineHtml: 'Operational continuous · compliance pre-launch · strategic monitor · <em>crisis</em>',
    blocks: [{ atStep: 1, html: card('WHICH LINE FOR WHICH AI CONTROL', '', ['<strong>High-frequency ops (eval suites · drift).</strong> First-line tests continuously · second-line samples quarterly · third-line audits annually.', '<strong>Compliance (regulatory submissions · disclosure).</strong> Second-line approves pre-launch · third-line audits sample.', '<strong>Strategic (lock-in · sovereign deployment).</strong> Second-line monitors · third-line audits annually.', '<strong>Crisis (incident response · customer-facing failure).</strong> First-line responds · second-line escalates · third-line audits post-incident.']) }] },
  { type: 'content', eyebrow: '12-month audit plan', icon: '3', headlineHtml: 'Q1 governance · Q2 use cases · Q3 vendors · <em>Q4 cross-line</em>',
    blocks: [{ atStep: 1, html: card('A 12-MONTH INTERNAL AUDIT AI PLAN', 'Covers AI without over-rotating', ['<strong>Q1.</strong> AI governance + policy review. Accountable? Current? Reflects regulatory reality?', '<strong>Q2.</strong> Top 3 AI use cases — control walk-through. Eval · drift · incident response.', '<strong>Q3.</strong> AI vendor concentration + lock-in. Top 3 vendors — switching cost?', '<strong>Q4.</strong> Cross-line coordination. First-line escalates appropriately? Committee receives timely signals?']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: '≥4 AI audits planned · <em>findings to committee within 30 days</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE ASSURANCE DISCIPLINE', '2 questions', ['<strong>Q1:</strong> internal audit has AI controls on next-12-month plan? ≥4 green · 1-2 amber · <strong>no AI red — plan doesn\'t reflect risk</strong>.', '<strong>Q2:</strong> when audit findings on AI surface, reach committee within 30 days? Yes green · sometimes amber · <strong>no red — slow escalation</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull next 12-month audit plan', ['Count AI audits. <strong>If under 4 for regulated entity, that\'s the gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Reporting AI risk to full board · <em>heatmap-as-theatre trap</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 lines · which-line-for-what · 12-month plan.', '<strong>Next:</strong> 3-section view · heatmap-theatre trap.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Reporting AI risk to the full board' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-reporting.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · ONE-PAGE BOARD VIEW · NO THEATRE', h1Html: '3-section view · <em>heatmap-as-theatre trap</em>', subtitleHtml: '<strong>Without inducing panic. Without inducing sleep.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Board sees twice a year · <em>synthesise granular into one page</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Surface real shifts', ['Board sees AI risk twice a year · maybe quarterly. <strong>They can\'t track granular changes.</strong>', 'Committee\'s job: <strong>synthesise the granular into a one-page view that surfaces real shifts.</strong> Without inducing panic. Without inducing sleep.']) }] },
  { type: 'content', eyebrow: '3-section board view', icon: '2', headlineHtml: 'Heatmap · material changes · <em>committee asks</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Heatmap', '', '4 risk dimensions × AI systems. Red/amber/green. <strong>Should change between meetings.</strong>', 'green')}
${cell('S2', 'Material changes', '', '3-5 bullets. New risks · closed risks · incidents since last report.', 'green')}
${cell('S3', 'Committee asks', '', '2-3 items board needs to weigh in on. Decisions · escalations · strategic shifts.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Heatmap-as-theatre trap', icon: '!', iconRed: true, headlineHtml: 'Same heatmap every quarter · <em>force quarterly re-rating</em>',
    blocks: [{ atStep: 1, html: cardRed('THE HEATMAP-AS-THEATRE TRAP', '', ['<strong>Trap:</strong> heatmap looks the same every quarter. All green or all amber. Board accepts. Risk feels handled.', '<strong>Reality:</strong> risks shifted · controls slipped · drift happened. Heatmap wasn\'t sensitive enough.'], '<strong>Spot it:</strong> if heatmap hasn\'t changed in 4 consecutive meetings, not capturing real change. <strong>Fix:</strong> quarterly re-rating exercise. Not "is it still green?" but "what would have to change for this to become amber?" Then verify whether it has.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Heatmap meaningfully changes · <em>directors ask follow-ups</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE BOARD REPORTING', '2 questions', ['<strong>Q1:</strong> AI risk heatmap changed in last 4 reports? Meaningfully yes green · cosmetically amber · <strong>unchanged red — theatre</strong>.', '<strong>Q2:</strong> directors ask follow-ups on AI reports? Consistently green · sometimes amber · <strong>rarely red — wrong structure</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Look at last 4 board AI risk reports', ['Has heatmap meaningfully changed? <strong>If no, build a sensitivity test.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Cross-committee coordination · <em>4-committee model</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3-section view · heatmap trap · scoring.', '<strong>Next:</strong> 4-committee coordination · 3 patterns.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Cross-committee coordination' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-coordination.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · 4-COMMITTEE COORDINATION', h1Html: 'AI risk splits · <em>3 coordination patterns</em>', subtitleHtml: '<strong>Each committee assumes another is covering AI deeply. None actually is.</strong>' },
  { type: 'content', eyebrow: 'The split problem', icon: '!', iconRed: true, headlineHtml: 'Audit · risk · technology · ESG · <em>AI falls between</em>',
    blocks: [{ atStep: 1, html: cardRed('THE SPLIT PROBLEM', 'AI touches all four', ['Modern boards have multiple committees. Audit (risk + controls + financial reporting) · Risk (enterprise risk) · Technology (tech strategy) · ESG (ethics + societal impact).', '<strong>AI risk touches all four.</strong> Without explicit coordination, it falls between.', '<strong>Common pattern:</strong> each committee assumes another is covering AI deeply. None actually is.']) }] },
  { type: 'content', eyebrow: '4-committee model', icon: '1', headlineHtml: 'Audit · risk · technology · <em>ESG</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'Audit committee', '', 'Controls + assurance. <strong>Are AI controls operating? Is audit testing them?</strong>', 'green')}
${cell('C2', 'Risk committee', '', 'Risk universe + appetite. <strong>Where does AI sit? Within appetite?</strong>', 'green')}
${cell('C3', 'Technology committee', '', 'Strategy + investment. <strong>AI roadmap? Build/buy/compose? Vendor portfolio?</strong>', 'green')}
${cell('C4', 'ESG committee', '', 'Ethics + impact. <strong>Bias · fairness · societal · customer-facing AI norms.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 coordination patterns', icon: '2', headlineHtml: 'Annual joint session · charter language · <em>escalation taxonomy</em>',
    blocks: [{ atStep: 1, html: card('3 COORDINATION PATTERNS THAT WORK', '', ['<strong>1. Annual joint AI session.</strong> All 4 committees meet together once a year. Walk AI portfolio · confirm coverage · surface gaps.', '<strong>2. Cross-committee charter language.</strong> Each charter mentions AI in scope. <em>Specific clauses, not generic.</em>', '<strong>3. Escalation taxonomy.</strong> Defined which incidents go to which committee. AI bias → ESG + Audit. Model drift → Risk + Technology. Vendor breach → Audit + Technology.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Charters mention AI · <em>annual joint session scheduled</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CROSS-COMMITTEE COORDINATION', '2 questions', ['<strong>Q1:</strong> each board committee charter explicitly mentions AI in scope? All 4 green · 2-3 amber · <strong>none/generic red — falls between</strong>.', '<strong>Q2:</strong> annual joint AI session across committees? Scheduled green · informally amber · <strong>no red — coordination gap</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull all 4 committee charters', ['Walk AI clauses. <strong>Missing or generic = coordination gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · audit committee AI playbook · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Split problem · 4-committee model · 3 patterns.', '<strong>Last:</strong> 5-section playbook · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={inherent:'',assurance:'',asks:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='audit-committee-ai-playbook.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var i=state.inherent||'_(pick top inherent-risk category)_';var as=state.assurance||'_(pick assurance cadence)_';var ak=state.asks||'_(pick committee asks focus)_';return '# Audit Committee · AI Playbook\\n\\n**Audit committee chair:** ____________________\\n**Date:** ____________________\\n\\n## Top inherent-risk category\\n> '+i+'\\n\\n## Assurance cadence\\n> '+as+'\\n\\n## Committee asks focus\\n> '+ak+'\\n\\n## 5-section playbook\\n- [ ] Risk universe coverage: AI in all 4 buckets · refreshed annually\\n- [ ] Inherent + residual: 4-dim ratings · tested residual · no controls-assumed\\n- [ ] Assurance plan: ≥4 AI audits · specific scopes · 30-day to committee\\n- [ ] 9 questions: standing inquiry · specifics pressed for · maturity recognised\\n- [ ] Board reporting: 1-page · heatmap meaningfully changes · committee asks\\n\\n## 4 trust trip-wires (do not cross)\\n- AI in only operational risk bucket (misses compliance · strategic · reputational)\\n- Controls-assumed in residual ratings\\n- Heatmap unchanged over 4 reports (theatre)\\n- Generic answers accepted on the 9 questions (rehearsal)\\n\\n---\\nSource: Gennoor Academy · AI Risk for Audit Committees\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — Audit committee AI playbook' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 1-PAGE AUDIT COMMITTEE AI PLAYBOOK', h1Html: '5-section playbook · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>What holds the discipline together when management drifts.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Playbook holds the discipline · <em>when management drifts</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', '', ['<strong>AI risk doesn\'t fit cleanly into the existing risk universe.</strong> The committee playbook is what holds the discipline together when management drifts.']) }] },
  { type: 'content', eyebrow: '5-section playbook', icon: '2', headlineHtml: 'Universe · ratings · assurance · questions · <em>reporting</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'Risk universe coverage', '', 'AI in all 4 buckets · refreshed annually.')}
${cell('P2', 'Inherent + residual', '', '4-dim ratings + tested residual + no controls-assumed.', 'amber')}
${cell('P3', 'Assurance plan', '', '≥4 AI audits · specific scopes · 30-day to committee.', 'green')}
${cell('P4', '9 questions', '', 'Standing inquiry · specifics pressed for · maturity recognised.', 'green')}
${cell('P5', 'Board reporting', '', '1-page · heatmap meaningfully changes · committee asks.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Operational only · controls-assumed · static heatmap · <em>generic answers</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'AI only in operational', '', 'Misses compliance · strategic · reputational.', 'red')}
${cell('W2', 'Controls-assumed in residual', '', 'Anti-pattern. Incident statistically waiting.', 'red')}
${cell('W3', 'Heatmap unchanged 4 reports', '', 'Theatre. Build sensitivity in.', 'red')}
${cell('W4', 'Generic answers accepted', '', 'Rehearsal becomes the norm. Real risk hides.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · playbook builder', icon: '✓', headlineHtml: 'Inherent · assurance · asks · <em>take to committee meeting</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Top inherent-risk category for your AI portfolio</h5><div class="preset" data-group="inherent">
<button data-val="Reputational (customer-facing AI · brand exposure)">Reputational</button>
<button data-val="Compliance (regulated decisions · audit + regulator exposure)">Compliance</button>
<button data-val="Strategic (vendor lock-in · architectural bets · platform shifts)">Strategic</button>
<button data-val="Operational (high-volume production AI · uptime + drift)">Operational</button>
</div></div>
<div class="group"><h5>Assurance cadence</h5><div class="preset" data-group="assurance">
<button data-val="4 internal audits/year + quarterly second-line samples + continuous first-line">4 + quarterly + continuous</button>
<button data-val="6 internal audits/year + monthly second-line samples + continuous first-line">6 + monthly + continuous</button>
<button data-val="2 internal audits/year + quarterly second-line (lower-risk portfolios)">2 + quarterly</button>
</div></div>
<div class="group"><h5>Committee asks focus this year</h5><div class="preset" data-group="asks">
<button data-val="Governance maturity (named owners · current policies · board reporting)">Governance maturity</button>
<button data-val="Operational discipline (eval cadence · drift · incident response)">Operational discipline</button>
<button data-val="Assurance coverage (internal audit AI plan · external assurance scope)">Assurance coverage</button>
<button data-val="Cross-committee coordination (audit + risk + tech + ESG charters)">Cross-committee coordination</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my audit committee AI playbook (.md)</button>
</div>
<div class="preview" id="preview"># Audit Committee · AI Playbook

Pick top inherent-risk category, assurance cadence, and committee asks focus.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'AI in 4 buckets · inherent+residual · NIST overlay · 9 questions · 12-mo audit · 1-page board · <em>4-committee coordination</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI risk doesn\'t fit cleanly. Four buckets it touches. Inherent vs residual with no controls-assumed. NIST AI RMF overlay on COSO and three-lines. Nine audit committee questions. Twelve-month internal audit plan. One-page board view that meaningfully changes. Four-committee coordination.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Draft your playbook.</div><div class="row"><span class="arr">→</span>Walk it with your committee chair before next meeting.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 45 chapters 1-8 built.')
