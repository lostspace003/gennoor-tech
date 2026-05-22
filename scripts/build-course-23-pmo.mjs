// Course 23 — AI Program Management & PMO (Emma)
import { emit } from './build-chapter-html.mjs'

const courseTagline = 'Delivery · AI Program Management + PMO'
const OUT = 'tmp/academy-build/ai-program-management-pmo/chapters'

const card = (ct, h3, ps, t) =>
  `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardRed = (ct, h3, ps, t) =>
  `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardGreen = (ct, h3, ps, t) =>
  `<div class="card green"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cell = (cn, h4, num, p, cls = '') =>
  `<div class="cell ${cls}"><span class="cn">${cn}</span><h4>${h4}</h4>${num ? `<div class="num">${num}</div>` : ''}<p>${p}</p></div>`
const closeCard = (e, h2, p) => `<div class="final-close"><div class="eyebrow">${e}</div><h2>${h2}</h2><p>${p}</p></div>`

const baseCues = [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
  { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
  { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 },
]

emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The PMO landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-pmo-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · PMO IS THE GAP-CLOSER', h1Html: 'Delivery is the gap · <em>between pilots and value</em>', subtitleHtml: '<strong>Most AI failures are delivery failures, not technology failures.</strong>' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Make AI a portfolio · <em>not pilots you accumulate</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Andy Grove · output of a manager = output of the org under their influence', ['Bad delivery patterns explain more failure than bad models. <strong>The PMO is what changes the curve.</strong>']) }] },
    { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'No stage-gates · no lifecycle · <em>no ops handoff</em>',
      blocks: [{ atStep: 1, html: cardRed('3 PMO FAILURE MODES', 'Consistent across orgs', ['<strong>1. No stage-gate discipline.</strong> Every pilot gets perpetual funding. Portfolio bloats. No resource concentration.', '<strong>2. No model lifecycle.</strong> Production models running for years. Nobody retrains. Customer notices first.', '<strong>3. No ops handoff.</strong> AI team builds, nobody operates. Pipeline breaks, nobody owns the fix.']) }] },
    { type: 'content', eyebrow: 'What this course covers', icon: '2', headlineHtml: '6 PMO mechanics · 1 team · <em>1 roadmap</em>',
      blocks: [{ atStep: 1, html: card('STRUCTURE', '8 chapters', ['Ch 2 — portfolio shape · Ch 3 — stage-gating · Ch 4 — vendor mgmt · Ch 5 — model lifecycle · Ch 6 — ops handoff · Ch 7 — team + roles · Ch 8 — roadmap.']) }] },
    { type: 'content', eyebrow: 'The principle in one line', icon: '→', headlineHtml: 'Make AI a portfolio · <em>each pattern scales</em>',
      blocks: [
        { atStep: 1, html: card('PMO IS HIGH-LEVERAGE MANAGEMENT', 'Each pattern you institute scales across the portfolio', ['Standards once. Applied many times.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'List every AI initiative your org funds this year', ['Group by phase — pilot · scale · embed. <strong>10 pilots, 2 scale, 0 embed = portfolio shape problem.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Portfolio shape · <em>pyramid vs funnel</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Delivery is the gap · 3 failure modes · PMO is the leverage.', '<strong>Next:</strong> what "good" portfolio shape looks like. Pyramid + funnel patterns. Honest scoring.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Portfolio shape' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-portfolio-shape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · PYRAMID VS INVERSION', h1Html: '3 phases · <em>conversion rate is the metric</em>', subtitleHtml: '<strong>Most orgs have inverted portfolios. 50 pilots, 2 scaled, 0 embedded.</strong>' },
    { type: 'content', eyebrow: '3 phases', icon: '1', headlineHtml: 'Pilot · scale · <em>embed</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PHASE 1', 'Pilot', '', 'Small · tested · 6-12 weeks. <strong>Keep/kill/scale decision.</strong>')}
${cell('PHASE 2', 'Scale', '', 'Pilot worked → expand to one BU or geo. Operational impact at meaningful scale.', 'amber')}
${cell('PHASE 3', 'Embed', '', 'Scale worked → embedded in operating model. Production-grade. Capability baked in.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'The pyramid pattern · healthy shape', icon: '2', headlineHtml: '10-15 pilots · 3-5 scaled · <em>1-2 embedded</em>',
      blocks: [{ atStep: 1, html: cardGreen('THE PYRAMID PATTERN', 'Healthy AI portfolio shape', ['<strong>Base:</strong> 10-15 pilots running. Each lean. 90-day cycles.', '<strong>Middle:</strong> 3-5 scaled initiatives. Year-long funding. BU-owned.', '<strong>Top:</strong> 1-2 embedded. Multi-year. <strong>Compounding payoff.</strong>'], 'Most orgs have inverse — 50 pilots, 2 scaled, 0 embedded. <em>Inversion is the problem.</em>') }] },
    { type: 'content', eyebrow: 'The funnel discipline', icon: '3', headlineHtml: 'Movement between phases · <em>is the metric</em>',
      blocks: [{ atStep: 1, html: card('FUNNEL DISCIPLINE', 'Conversion rates that work', ['<strong>Pilot → Scale:</strong> 20-30% convert. <em>Most should die. That\'s the system working.</em>', '<strong>Scale → Embed:</strong> 50-70% convert. Once it works at scale, embedding is natural.', '<strong>Embedded:</strong> multi-year. Stays in operating model.'], 'Funnel doesn\'t flow → discipline is broken. <em>Fix before adding more initiatives.</em>') }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Phase distribution · <em>conversion rate</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE PORTFOLIO SHAPE', '2 questions', ['<strong>Q1:</strong> phase distribution? Pilot > 10x scale = top-heavy.', '<strong>Q2:</strong> pilot-to-scale rate (last 12 mo)? >20% green · 5-20% amber · <strong><5% red</strong>.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Map your AI portfolio onto 3 phases', ['Shape inverted? <strong>That\'s your highest-leverage portfolio conversation this quarter.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Stage-gating · <em>kill criteria that make funnel work</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 phases · pyramid pattern · funnel discipline · 2-question scoring.', '<strong>Next:</strong> pilot-to-scale gate · scale-to-embed gate · the political reality of killing initiatives.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Stage-gating discipline' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-stage-gating.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · KILL CRITERIA', h1Html: '3 gates · <em>3 kill criteria · the political reality</em>', subtitleHtml: '<strong>60-80% kill rate at pilot gate. That\'s a healthy portfolio.</strong>' },
    { type: 'content', eyebrow: '3 stage-gates', icon: '1', headlineHtml: 'Pilot → scale · scale → embed · <em>embedded continuation</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('GATE 1', 'Pilot → Scale', '', 'Has the pilot produced evidence scaling delivers business outcomes? <strong>3 months of data, not aspiration.</strong>')}
${cell('GATE 2', 'Scale → Embed', '', 'Operational impact matching business case? <strong>Year-1 numbers, not extrapolations.</strong>')}
${cell('GATE 3', 'Embedded continuation', '', 'Embedded capability still earning operating cost? <strong>Annual review. Kill if stopped working.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Pilot kill criteria · 3 specifics', icon: '!', iconRed: true, headlineHtml: 'No business outcome · brittle ops · <em>adoption problem</em>',
      blocks: [{ atStep: 1, html: cardRed('PILOT-STAGE KILL CRITERIA', '60-80% should die. Healthy.', ['<strong>1. No clear business outcome demonstrable.</strong> Tech works, can\'t answer "value at scale." → Kill.', '<strong>2. Operational dependencies too brittle.</strong> Pilot needs manual intervention that won\'t scale. → Kill.', '<strong>3. Adoption problem revealed.</strong> Pilot users wouldn\'t use it without prompting. Scaling won\'t fix this. → Kill.']) }] },
    { type: 'content', eyebrow: 'The political reality', icon: '2', headlineHtml: 'Killing is hard · <em>pre-commit + reverse default</em>',
      blocks: [{ atStep: 1, html: card('THE POLITICAL REALITY', 'Inertia favours continuation', ['Sponsor invested reputation · vendor delivered something demoable · team wants to keep their job.', '<strong>What works:</strong> pre-commit to kill criteria at gate-zero. When pilot starts, criteria documented + signed. No retrofitting.', '<strong>What also works:</strong> reverse the default. <em>Sunset unless renewed beats renewed unless cancelled.</em>']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Kill rate · <em>documented criteria</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE STAGE-GATING', '2 questions', ['<strong>Q1:</strong> pilot-to-scale kill rate? >50% green · 20-50% amber · <strong><20% red — gates aren\'t gates</strong>.', '<strong>Q2:</strong> kill criteria documented per active initiative? All yes green · most amber · none red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick a pilot stuck >6 months without scale decision', ['Document kill criteria right now. <strong>Set a 30-day decision date. Scale or kill by then.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Vendor management · <em>4 contract pillars</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 gates · 3 kill criteria · political reality · 2-question scoring.', '<strong>Next:</strong> training data rights · model update transparency · sunset rights · liability allocation.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Vendor management for AI' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-vendor-mgmt.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · 4 CONTRACT PILLARS', h1Html: 'Training data · updates · sunset · <em>liability</em>', subtitleHtml: '<strong>Set at gate-zero. Not at gate-three when you have no leverage.</strong>' },
    { type: 'content', eyebrow: '4 contract pillars', icon: '1', headlineHtml: 'Training data rights · updates · sunset · <em>liability</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('P1', 'Training data rights', '', 'What did vendor train on? Can they use yours? Opt out? <strong>2026 default: explicit no on customer data without consent. In writing.</strong>')}
${cell('P2', 'Model update transparency', '', 'When vendor changes the model, do they tell you? Test results? Performance regression checks? <strong>In writing.</strong>')}
${cell('P3', 'Sunset rights', '', 'Notice period? Migration support? <strong>6 months minimum. Defined in contract.</strong>')}
${cell('P4', 'Liability allocation', '', 'Air Canada Moffatt cross-domain. Vendor wants none. <strong>Negotiate specifically for high-stakes use.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: '3 vendor failure modes', icon: '!', iconRed: true, headlineHtml: 'Vendor pivot · model regression · <em>pricing surprise</em>',
      blocks: [{ atStep: 1, html: cardRed('3 VENDOR FAILURE MODES', 'Mitigated by gate-zero terms', ['<strong>1. Vendor pivots.</strong> Acquired or pivoted. Product capability deprecated. No migration path.', '<strong>2. Model regression.</strong> Vendor updates model. Your use case quality drops. Customer complaints first.', '<strong>3. Pricing surprise.</strong> Initial contract good. Renewal is 3x. Vendor knows your switching cost is high.']) }] },
    { type: 'content', eyebrow: 'What works · 3 patterns', icon: '2', headlineHtml: 'Standard clauses · annual review · <em>exit plan</em>',
      blocks: [{ atStep: 1, html: cardGreen('3 VENDOR MGMT PATTERNS', 'Operating discipline', ['<strong>1. Standard AI contract clauses across all procurement.</strong> All four pillars. No exceptions.', '<strong>2. Annual model-update review.</strong> Vendor presents year\'s updates, performance changes. Documented.', '<strong>3. Exit plan for top-5 vendors.</strong> Document migration path before you need it. <strong>Vendor disappears tomorrow → what\'s the recovery?</strong>']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Active contracts · <em>top-3 exit plans</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE VENDOR MGMT', '2 questions', ['<strong>Q1:</strong> active contracts have 4 pillars? New yes green · mixed amber · <strong>old contracts only red</strong>.', '<strong>Q2:</strong> top-3 AI vendors — documented exit plan? Yes green · partial amber · no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull your top AI vendor contract', ['Check against the 4 pillars. <strong>Gaps go into renewal prep — even 6 months out.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Model lifecycle · <em>training · deployment · retraining · retirement</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 pillars · 3 failure modes · 3 patterns · 2-question scoring.', '<strong>Next:</strong> the cadence that keeps AI working over years.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Model lifecycle management' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-lifecycle.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · LIFECYCLE CADENCE', h1Html: '4 stages · 4 triggers · <em>1 registry</em>', subtitleHtml: '<strong>Keeps AI working over years instead of silently breaking.</strong>' },
    { type: 'content', eyebrow: '4 lifecycle stages', icon: '1', headlineHtml: 'Train · deploy · retrain · <em>retire</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('S1', 'Training', '', 'Initial model on defined dataset. Performance baseline. <strong>Documented for audit.</strong>')}
${cell('S2', 'Deployment', '', 'Production. SLA defined. Monitoring active.')}
${cell('S3', 'Retraining', '', 'On schedule or trigger. Drift detected. <strong>Validated. Redeployed.</strong>')}
${cell('S4', 'Retirement', '', 'No longer best option. Sunset planned. Data + decisions archived for audit.')}
</div>` }] },
    { type: 'content', eyebrow: '4 retraining triggers', icon: '2', headlineHtml: 'Drift · data · schedule · <em>context change</em>',
      blocks: [{ atStep: 1, html: card('4 RETRAINING TRIGGERS', 'Every production AI system needs all four', ['<strong>1. Performance drift.</strong> Prediction quality drops below threshold. <em>Automated alerting. Required.</em>', '<strong>2. Data drift.</strong> Input distribution shifts from training. <em>Statistical monitoring detects.</em>', '<strong>3. Schedule.</strong> Quarterly or annual regardless of metrics. <em>Catches gradual drift that doesn\'t trip alarms.</em>', '<strong>4. Context change.</strong> Regulation · market · product change. <em>Manual review by program manager.</em>'], 'Schedule alone is insufficient. Drift alone is reactive. <em>All four together.</em>') }] },
    { type: 'content', eyebrow: 'The model registry', icon: '3', headlineHtml: 'Single source of truth · <em>foundation for every decision</em>',
      blocks: [{ atStep: 1, html: cardGreen('THE MODEL REGISTRY', 'High-leverage PMO work', ['Per model: owner · last evaluated · performance baseline · current performance · retraining cadence · linked initiatives · linked vendor.', '<strong>Without registry → don\'t know what\'s in production. Don\'t know what\'s silently breaking.</strong>', 'Most enterprises don\'t have this yet.']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Registry · <em>drift detection</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE LIFECYCLE', '2 questions', ['<strong>Q1:</strong> current registry with last-evaluated dates? Yes green · partial amber · no red.', '<strong>Q2:</strong> production model degrades — how do you find out? Auto alert green · quarterly review amber · <strong>customer complaint red</strong>.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Ask engineering for the list of every production model + last-eval date', ['Anything >90 days without re-eval → flag. <strong>Don\'t wait for it to break.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Ops handoff · <em>who owns the model after it ships</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 stages · 4 triggers · registry · 2-question scoring.', '<strong>Next:</strong> the handoff problem. 4 handoff artifacts. 3 anti-patterns.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Ops handoff pattern' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-ops-handoff.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · WHERE AI VALUE LEAKS', h1Html: 'Where models · <em>lose value</em>', subtitleHtml: '<strong>The handoff is where most AI initiatives lose value. Done deliberately, it\'s where they hold value.</strong>' },
    { type: 'content', eyebrow: 'The handoff problem', icon: '1', headlineHtml: 'AI team keeps operating · <em>or hands off badly</em>',
      blocks: [{ atStep: 1, html: card('THE HANDOFF PROBLEM', 'Both paths fail', ['<strong>Keep operating:</strong> AI team bottlenecked on operating their own code instead of building next.', '<strong>Hand off badly:</strong> ops doesn\'t have context to fix problems. Things break, nobody knows what to do.'], '<strong>Healthy pattern:</strong> deliberate handoff · documented runbooks · ops has context + authority. AI team on call for genuine model issues, not pipeline plumbing.') }] },
    { type: 'content', eyebrow: '4 handoff artifacts', icon: '2', headlineHtml: 'Runbook · model card · dashboard · <em>escalation tree</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('A1', 'Runbook', '', 'Step-by-step: pipeline broken? Model degraded? <strong>Ops\' first reference.</strong>')}
${cell('A2', 'Model card', '', 'What this model does. What it doesn\'t. Known failure modes. <strong>Maintained as model evolves.</strong>')}
${cell('A3', 'Monitoring dashboard', '', 'What ops watches · alert meanings · response procedures.')}
${cell('A4', 'Escalation tree', '', 'When ops can\'t fix — who do they call? <strong>Named individuals. Not "the AI team."</strong>')}
</div>` }] },
    { type: 'content', eyebrow: '3 anti-patterns', icon: '!', iconRed: true, headlineHtml: 'Go-live handoff · no owner · <em>throw over wall</em>',
      blocks: [{ atStep: 1, html: cardRed('3 HANDOFF ANTI-PATTERNS', 'Predictable failure', ['<strong>1. Handoff at go-live.</strong> Ops sees model first time in production. No context. No relationship.', '<strong>2. Handoff to nobody.</strong> "Operations" theoretical. No named owner. Model runs unsupervised.', '<strong>3. Thrown over the wall.</strong> Documents emailed. No follow-up. No shadowing.'], '<strong>What works:</strong> 4-6 weeks shadow period before handoff. Joint on-call. Then transition complete with clear owner.') }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Runbooks · <em>escalation contact</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE HANDOFF', '2 questions', ['<strong>Q1:</strong> operational runbooks current + tested for production AI? Yes green · some amber · no red.', '<strong>Q2:</strong> ops can\'t fix something — named escalation contact per model? Yes green · partial amber · no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one production AI system · ask ops for its runbook', ['<strong>Can\'t produce in 5 minutes → handoff debt to close.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Team structure · <em>roles + sizing</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Handoff problem · 4 artifacts · 3 anti-patterns · 2-question scoring.', '<strong>Next:</strong> the 5 AI PMO roles · 3 design patterns · honest sizing.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Team structure + roles' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-team.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · PMO DESIGN', h1Html: '5 roles · 3 patterns · <em>honest sizing</em>', subtitleHtml: '<strong>Underfunding the PMO is the most common mistake. False economy.</strong>' },
    { type: 'content', eyebrow: '5 PMO roles', icon: '1', headlineHtml: 'Program mgr · lifecycle · governance · <em>business · ops liaison</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'AI program manager', '', 'Portfolio orchestration · stage-gating · vendor mgmt · cross-portfolio metrics.', 'green')}
${cell('R2', 'Model lifecycle owner', '', 'Registry · retraining · drift · cross-portfolio MLOps view.', 'green')}
${cell('R3', 'Governance liaison', '', 'Legal · compliance · risk · AI inventory · risk register · incident playbook.', 'green')}
${cell('R4', 'Business sponsor liaison', '', 'Translates between AI program + BU sponsors · validates business cases.')}
${cell('R5', 'Operations liaison', '', 'Owns handoffs · runbooks · escalation tree.')}
</div>` }] },
    { type: 'content', eyebrow: '3 design patterns', icon: '2', headlineHtml: 'Central+embedded · federated · <em>virtual</em>',
      blocks: [{ atStep: 1, html: card('3 PMO DESIGN PATTERNS', 'Different scales · different patterns', ['<strong>1. Central PMO with embedded program managers.</strong> Central owns standards. Embedded in BUs own delivery. <em>Most scalable.</em>', '<strong>2. Federated PMO with central coordination.</strong> Each BU owns its PMO. Central aligns. Works in federated orgs. Risk of duplication.', '<strong>3. Virtual PMO.</strong> Part-time PMO hats. Lowest cost. Works for small portfolios only.'], 'For 20+ initiatives → <strong>central PMO with embedded program managers is the durable choice.</strong>') }] },
    { type: 'content', eyebrow: 'Honest sizing', icon: '3', headlineHtml: 'Proportional · <em>not vanity</em>',
      blocks: [{ atStep: 1, html: card('PMO SIZING · HONEST NUMBERS', 'Underfunding is the most common mistake', ['<strong>50 initiatives:</strong> 6-10 people. 1 lead · 3-4 program managers · 1 governance · 1 lifecycle · 1 ops · admin.', '<strong>20 initiatives:</strong> 3-5 people.', '<strong>Under 10:</strong> part-time with single accountable owner.'], '<strong>Cutting PMO to fund more initiatives is false economy.</strong> PMO is what makes the rest of the portfolio investment work.') }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: '5 roles owned · <em>proportional sizing</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE TEAM', '2 questions', ['<strong>Q1:</strong> 5 PMO roles owned (even if combined)? Yes green · most amber · less than half red.', '<strong>Q2:</strong> PMO sized proportional to portfolio? Yes green · under-sized but functional amber · <strong>cargo-cult with 1 nominal owner red</strong>.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'List the 5 roles · name the current owner for each', ['<strong>Role has no owner → first hire or assignment this quarter.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '5 roles · 3 design patterns · honest sizing · 2-question scoring.', '<strong>Last chapter:</strong> 90-day PMO bootstrap · 4 trust trip-wires · interactive builder.') }] },
  ],
  cues: baseCues,
})

const ch8BuilderInit = `
var builderInit=false;var state={size:'',pattern:'',start:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-pmo-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var s=state.size||'_(pick portfolio size)_';var p=state.pattern||'_(pick PMO pattern)_';var st=state.start||'_(pick start point)_';return '# AI PMO · 90-Day Bootstrap Roadmap\\n\\n**CIO / Transformation Director:** ____________________\\n**Start date:** ____________________\\n\\n## Portfolio size\\n> '+s+'\\n\\n## PMO design pattern\\n> '+p+'\\n\\n## Starting point\\n> '+st+'\\n\\n## Days 1-30: Inventory + Assessment\\n- Map every active AI initiative\\n- Score portfolio shape (pyramid vs inversion)\\n- Identify kill candidates\\n- Output: portfolio diagnostic\\n\\n## Days 31-60: Install Discipline\\n- Stage-gates defined\\n- Kill criteria documented per active initiative\\n- Model registry started\\n- Vendor contract audit\\n- Output: standards in place\\n\\n## Days 61-90: Staff the PMO\\n- Name the 5 role owners\\n- Embedded program managers where needed\\n- Output: people in seats\\n\\n## 4 trust trip-wires (do not cross)\\n- No kill rate at pilot gate — below 20% means gates aren\\'t gates\\n- Production models without owners — every model has a named lifecycle owner\\n- Handoff thrown over the wall — runbook + named ops owner + shadow period required\\n- PMO sized for vanity not function — proportional to portfolio\\n\\n---\\nSource: Gennoor Academy · AI Program Management + PMO\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your AI PMO roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 90-DAY BOOTSTRAP', h1Html: '90 days · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>By day 90: PMO operating. Portfolio managed. Pilots killed or scaled, not accumulating.</strong>' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Make AI a portfolio · <em>not pilots you accumulate</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Andy Grove — leverage management', ['The PMO is high-leverage. Each pattern scales.']) }] },
    { type: 'content', eyebrow: '90-day bootstrap', icon: '2', headlineHtml: 'Days 1-30 · 31-60 · <em>61-90</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('D1-30', 'Inventory + Assessment', '', 'Map every initiative · score portfolio shape · identify kill candidates. <strong>Output: diagnostic.</strong>')}
${cell('D31-60', 'Install Discipline', '', 'Stage-gates · kill criteria · model registry · vendor audit. <strong>Output: standards.</strong>', 'amber')}
${cell('D61-90', 'Staff the PMO', '', 'Name 5 role owners · embedded PMs. <strong>Output: people in seats.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'No kill rate · no owners · throw-over-wall · <em>vanity sizing</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'No kill rate at pilot gate', '', '<20% kill rate = gates aren\'t gates. Discipline broken.', 'red')}
${cell('W2', 'Production models without owners', '', 'Every production model has named lifecycle owner. <strong>No exceptions.</strong>', 'red')}
${cell('W3', 'Handoff thrown over wall', '', 'Runbook · named ops owner · shadow period required. <strong>Otherwise handoff didn\'t happen.</strong>', 'red')}
${cell('W4', 'PMO sized for vanity not function', '', 'Under-sized PMO + over-sized portfolio = math doesn\'t work.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Portfolio size · pattern · start · <em>take to CIO</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Portfolio size</h5><div class="preset" data-group="size">
<button data-val="50+ initiatives — central PMO + embedded PMs · 6-10 people">50+ initiatives</button>
<button data-val="20-30 initiatives — central PMO · 3-5 people">20-30 initiatives</button>
<button data-val="under 10 initiatives — part-time with single accountable owner">Under 10</button>
</div></div>
<div class="group"><h5>PMO design pattern</h5><div class="preset" data-group="pattern">
<button data-val="Central PMO with embedded program managers — recommended for 20+ initiatives">Central + embedded</button>
<button data-val="Federated PMO with central coordination — for highly federated orgs">Federated</button>
<button data-val="Virtual PMO with part-time hats — for small portfolios only">Virtual</button>
</div></div>
<div class="group"><h5>Starting point</h5><div class="preset" data-group="start">
<button data-val="Portfolio inversion — too many pilots, not enough scaled">Inversion</button>
<button data-val="No model lifecycle discipline — start with registry">No lifecycle</button>
<button data-val="No ops handoff pattern — start with runbooks">No handoff</button>
<button data-val="No vendor contract standards — start with 4-pillar audit">No vendor standards</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my AI PMO 90-day roadmap (.md)</button>
</div>
<div class="preview" id="preview"># AI PMO · 90-Day Bootstrap Roadmap

Pick portfolio size, PMO pattern, and starting point on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Portfolio · stage-gates · vendor · <em>lifecycle · handoff · team</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Make AI a portfolio you manage · pyramid shape not inverted funnel · stage-gates require real kill criteria · vendor contracts need 4 pillars · models need lifecycle + registry · operations need real handoff · PMO needs 5 roles + proper sizing · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick portfolio size and PMO pattern.</div><div class="row"><span class="arr">→</span>Get one CIO or transformation conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
  ],
})

console.log('\n✓ Course 23 chapters 1-8 built.')
