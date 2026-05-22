// Course 21 — AI Readiness Assessment Deep-Dive (Emma)
import { emit } from './build-chapter-html.mjs'

const courseTagline = 'Diagnostic · AI Readiness Assessment Deep-Dive'
const OUT = 'tmp/academy-build/ai-readiness-assessment-deep-dive/chapters'

const card = (ct, h3, ps, takeaway) =>
  `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`
const cardRed = (ct, h3, ps, takeaway) =>
  `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`
const cardGreen = (ct, h3, ps, takeaway) =>
  `<div class="card green"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`
const cell = (cn, h4, num, p, cls = '') =>
  `<div class="cell ${cls}"><span class="cn">${cn}</span><h4>${h4}</h4>${num ? `<div class="num">${num}</div>` : ''}<p>${p}</p></div>`
const closeCard = (eyebrow, h2, p) =>
  `<div class="final-close"><div class="eyebrow">${eyebrow}</div><h2>${h2}</h2><p>${p}</p></div>`

// Ch1
emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The readiness landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-readiness-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · CALIBRATION OVER CONFIDENCE', h1Html: '5 dimensions · <em>3 failure modes</em>', subtitleHtml: 'Tetlock applied to AI readiness. <strong>Honest scoring produces better decisions than green dashboards.</strong>' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Calibration · <em>not confidence theatre</em>',
      blocks: [{ atStep: 1, html: card('TETLOCK · SUPERFORECASTING (2015)', 'Calibration matters more than how confident you sound', ['Most AI readiness assessments produce confident green/amber/red dashboards that are not calibrated.', '<strong>12 months later AI initiatives are stalled. The dashboard lied.</strong>'], 'The honest version is harder. It produces uncomfortable scores. <em>And better decisions.</em>') }] },
    { type: 'content', eyebrow: 'Why orgs stall · 3 patterns', icon: '!', iconRed: true, headlineHtml: 'Permanent pilot · data not there · <em>governance afterthought</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PATTERN 1', 'Pilot-permanent-pilot trap', '', '30 AI experiments, 0 scaled to production. McKinsey "State of AI" gap.', 'amber')}
${cell('PATTERN 2', 'Data-isn\'t-there problem', '', 'Discover after starting: quality, lineage, accessibility not ready. 6-month remediation pause.', 'amber')}
${cell('PATTERN 3', 'Governance afterthought', '', 'Compliance and risk bolted on after launch. EU AI Act audit reveals the gap.', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'The 5 readiness dimensions', icon: '2', headlineHtml: 'Data · talent · governance · <em>infrastructure · leadership commitment</em>',
      blocks: [{ atStep: 1, html: card('THE 5 DIMENSIONS', 'Each scored independently', ['<strong>1. Data</strong> — quality, lineage, accessibility, governance.', '<strong>2. Talent</strong> — AI/ML skills, data literacy, leadership AI fluency.', '<strong>3. Governance</strong> — NIST AI RMF, EU AI Act, ISO 42001.', '<strong>4. Infrastructure</strong> — compute, MLOps, registry, observability.', '<strong>5. Leadership commitment</strong> — sponsor, funding, ROI patience.'], 'Most orgs honestly score amber across most, red on 1-2, green on maybe one. <em>That\'s normal. Green-green-green-green-green is marketing.</em>') }] },
    { type: 'content', eyebrow: 'What this course covers', icon: '→', headlineHtml: '6 dimensional deep-dives · 1 diagnostic · <em>1 roadmap</em>',
      blocks: [
        { atStep: 1, html: card('COURSE STRUCTURE', '8 chapters', ['Chapters 2-6: one chapter per dimension · failure modes · how to score honestly · what moves it.', 'Chapter 7: 12-question diagnostic · how to read · 3 bands.', 'Chapter 8: roadmap by band · 4 trip-wires · interactive builder for your CEO conversation.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick your weakest dimension', ['That\'s the chapter you\'ll get most from this week. <strong>The honest score on your weakest dimension is where the highest-leverage decision lives.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Data · <em>the dimension that breaks more AI than any other</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Calibration over confidence · 5 dimensions · 3 stall patterns.', '<strong>Next:</strong> data quality, lineage, accessibility, governance. The hard questions.') }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 225.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 },
  ],
})

// Ch2 — Data
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Dimension 1 · Data' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-data.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · DIMENSION 1', h1Html: 'Quality · lineage · accessibility · <em>governance</em>', subtitleHtml: '<strong>The single dimension that breaks more AI initiatives than any other.</strong>' },
    { type: 'content', eyebrow: '4 sub-dimensions', icon: '1', headlineHtml: 'Quality · lineage · accessibility · <em>governance</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('SUB-1', 'Quality', '', 'Accuracy, completeness, freshness, consistency. <strong>Most teams overestimate until they try to train on it.</strong>')}
${cell('SUB-2', 'Lineage', '', 'Where did this data come from? What transformations? <strong>Can you defend it to an auditor?</strong>')}
${cell('SUB-3', 'Accessibility', '', 'Can the people who need it get it without a ticket? <strong>Locked in silos = functionally unavailable.</strong>')}
${cell('SUB-4', 'Governance', '', 'Ownership, access policies, retention, deletion. <strong>GDPR + DPDPA + CCPA enforceability.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Fix-later · data-debt · <em>lake-not-searchable</em>',
      blocks: [{ atStep: 1, html: cardRed('3 DATA FAILURE MODES', 'Consistent across enterprises', ['<strong>1. "Fix data later"</strong> — 6 months in, discover quality/access not ready. Project pauses. Sponsor loses patience.', '<strong>2. Data debt nobody pays down</strong> — known for years, never enough budget. AI exposes it at scale.', '<strong>3. Data lakes not searchable</strong> — petabytes stored, nobody can find the right table in under an hour. Engineers spend more time on discovery than modelling.']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '2', headlineHtml: 'Quality audit · lineage defensibility · <em>access speed</em>',
      blocks: [{ atStep: 1, html: card('HOW TO SCORE DATA HONESTLY', '3 questions per dimension', ['<strong>Q1:</strong> top 3 datasets — accuracy/completeness/freshness? <70% red · 70-90% amber · >90% green.', '<strong>Q2:</strong> defensible lineage diagram in 2 days? Yes green · with effort amber · honestly no red.', '<strong>Q3:</strong> time from access request to having data? <1 day green · 1-5 days amber · >5 days red.']) }] },
    { type: 'content', eyebrow: 'What moves it forward', icon: '3', headlineHtml: 'Named CDO · 3-4 data products · <em>access KPI</em>',
      blocks: [
        { atStep: 1, html: cardGreen('WHAT MOVES DATA READINESS FORWARD', '3 things', ['<strong>1. Named CDO or data product lead</strong> with authority + budget · not just a title.', '<strong>2. 3-4 data products that matter</strong> — customer, finance, maybe operational. Get them to high quality. Then expand.', '<strong>3. Accessibility as measured KPI</strong> — time-to-data-access, self-service vs ticketed ratio. Monthly reporting.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick the dataset for your highest-priority AI use case', ['2 hours auditing accuracy + completeness + freshness. <strong>If amber/red — that\'s your highest-ROI data conversation this quarter.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Talent · <em>the leadership AI fluency gap</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 sub-dimensions · 3 failure modes · 3 honest-scoring questions.', '<strong>Next:</strong> build/buy/borrow + the leadership AI fluency gap that costs more than any technical hire.') }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 },
  ],
})

// Ch3 — Talent
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Dimension 2 · Talent' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-talent.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · DIMENSION 2', h1Html: 'Build · buy · <em>borrow</em>', subtitleHtml: '<strong>Leadership AI fluency matters more than your ML engineer count.</strong>' },
    { type: 'content', eyebrow: '3 layers', icon: '1', headlineHtml: 'Leadership fluency · practitioners · <em>function-wide literacy</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('LAYER 1', 'Leadership AI fluency', '', 'Can executives read a vendor pitch and tell signal from hype? <strong>The layer that determines portfolio quality.</strong>', 'green')}
${cell('LAYER 2', 'Practitioner skills', '', 'ML engineers, data scientists, AI PMs, MLOps engineers. <strong>The build capability.</strong>')}
${cell('LAYER 3', 'Function-wide data literacy', '', 'Marketing, finance, HR, ops — can leaders use AI output without losing judgement? <strong>Biggest leverage, most under-invested.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'Build / buy / borrow', icon: '2', headlineHtml: 'Internal · specialist · <em>consultant + vendor</em>',
      blocks: [{ atStep: 1, html: card('BUILD · BUY · BORROW', '3 modes · most orgs need all three', ['<strong>Build</strong> — internal capability development. Slower. Builds knowledge and retention.', '<strong>Buy</strong> — hire specialists. Faster ramp. Expensive. Talent market for senior AI/ML is brutal.', '<strong>Borrow</strong> — consultants, contractors, vendor solutions. Fast and flexible. Doesn\'t build muscle if default.'], 'The mix depends on maturity and what you\'re trying to achieve.') }] },
    { type: 'content', eyebrow: 'The leadership fluency gap', icon: '!', iconRed: true, headlineHtml: 'The most expensive talent gap · <em>and the most ignored</em>',
      blocks: [{ atStep: 1, html: cardRed('THE LEADERSHIP FLUENCY GAP', 'When execs can\'t distinguish signal from hype', ['Fund the wrong initiatives · believe vendor claims at face value · under-fund unsexy data + governance work · get talked into agentic-AI demos without asking hard questions.'], '<strong>Fix it deliberately.</strong> AI Foundations for executives · quarterly briefings from credible internal expert · required reading with substance. <em>Senior team that knows what AI does well is worth more than another ML engineer. And cheaper.</em>') }] },
    { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Leadership · practitioners · <em>data literacy</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE TALENT HONESTLY', '3 questions', ['<strong>Q1:</strong> top 5 execs each name 3 things AI is good at and 3 where it stops? All 5 green · 3-4 amber · <3 red.', '<strong>Q2:</strong> named delivery team with capacity for next 2 quarters? Yes green · mostly amber · no red.', '<strong>Q3:</strong> every function lead asked a data-driven AI question last quarter and acted? Most green · half amber · few red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick the exec with weakest AI fluency · 30-min 1:1', ['Bring 3 concrete examples of where AI worked + 3 where it didn\'t in your industry. <strong>That conversation moves the dial more than another vendor demo.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Governance · <em>NIST + EU + ISO</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 layers · build/buy/borrow · the leadership fluency gap.', '<strong>Next:</strong> NIST AI RMF, EU AI Act, ISO 42001. What regulators expect · what auditors ask · what you can defend.') }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 255.0, slide: 6 }, { at: 265.0, slide: 6, step: 1 },
  ],
})

// Ch4 — Governance
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Dimension 3 · Governance' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-governance.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · DIMENSION 3', h1Html: 'NIST · EU AI Act · <em>ISO 42001</em>', subtitleHtml: 'What regulators expect. What auditors ask. <strong>What you can defend.</strong>' },
    { type: 'content', eyebrow: '3 pillars', icon: '1', headlineHtml: 'Risk classification · control framework · <em>incident response</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PILLAR 1', 'Risk classification', '', 'Each AI use case classified — prohibited / high-risk / limited / minimal. <strong>EU AI Act gives the framework.</strong>')}
${cell('PILLAR 2', 'Control framework', '', 'NIST AI RMF 4 functions (govern · map · measure · manage) OR ISO 42001:2023. <strong>Pick one, apply consistently.</strong>')}
${cell('PILLAR 3', 'Incident response', '', 'Mata-Avianca cross-domain — a single bad AI output can hit the news. <strong>Have a playbook before, not after.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: '4 common gaps', icon: '!', iconRed: true, headlineHtml: 'No inventory · no register · <em>no lifecycle · no vendor terms</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('GAP 1', 'No AI inventory', '', 'Cannot list every AI system in production. Shadow AI happens.', 'red')}
${cell('GAP 2', 'No per-initiative risk register', '', 'Enterprise risk treats AI as one line. Should be one entry per initiative.', 'red')}
${cell('GAP 3', 'No model lifecycle policy', '', 'When does a model get retrained? Retired? Most orgs have no answer.', 'red')}
${cell('GAP 4', 'No vendor AI clauses', '', 'Liability, training data, model updates, sunset rights need explicit language.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Honest scoring · 4 questions', icon: '2', headlineHtml: 'Inventory · classification · response · <em>vendor contracts</em>',
      blocks: [{ atStep: 1, html: card('HOW TO SCORE GOVERNANCE HONESTLY', '4 questions (more than other dimensions — governance has more sub-pillars)', ['<strong>Q1:</strong> current inventory of all production AI systems? Quarterly-updated green · stale amber · no red.', '<strong>Q2:</strong> each use case risk-classified using defensible framework? Yes green · some amber · no red.', '<strong>Q3:</strong> written incident-response playbook? Tested green · written-untested amber · no red.', '<strong>Q4:</strong> vendor contracts include AI-specific terms? New contracts yes green · mixed amber · no red.']) }] },
    { type: 'content', eyebrow: 'What moves it forward', icon: '3', headlineHtml: 'Named lead · one framework · current inventory · <em>tabletop exercise</em>',
      blocks: [
        { atStep: 1, html: cardGreen('WHAT MOVES GOVERNANCE FORWARD', '4 things', ['<strong>1.</strong> Named AI governance lead reporting to GC, CISO or CRO · authority to block bad initiatives.', '<strong>2.</strong> Pick ONE framework deeply — NIST AI RMF or ISO 42001. Don\'t do both partially.', '<strong>3.</strong> Make the AI inventory real + current. Tooling is fine; ownership matters more. Quarterly review minimum.', '<strong>4.</strong> Run ONE incident-response tabletop exercise. Realistic scenario · walk through · find gaps · close them.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'List every AI system in production from memory', ['Then compare to what IT, marketing, customer service, procurement actually deployed. <strong>Gap between the lists is your governance debt.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Infrastructure · <em>compute · MLOps · registry · observability</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 pillars · 4 gaps · 4-question scoring · 4 things that move it.', '<strong>Next:</strong> the plumbing that makes AI possible — or makes every project ten times harder.') }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 265.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 },
  ],
})

// Ch5 — Infrastructure
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Dimension 4 · Infrastructure' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-infrastructure.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · DIMENSION 4', h1Html: 'Compute · MLOps · registry · <em>observability</em>', subtitleHtml: 'The plumbing that makes AI possible — <strong>or makes every project ten times harder.</strong>' },
    { type: 'content', eyebrow: '4 components', icon: '1', headlineHtml: 'Compute · MLOps · registry · <em>observability</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('COMP 1', 'Compute', '', 'GPU access · cloud spend predictability · capacity for training + inference.')}
${cell('COMP 2', 'MLOps', '', 'Pipeline from experiment to production. Versioning. CI/CD for models. <strong>Without it every deployment is heroics.</strong>')}
${cell('COMP 3', 'Model registry', '', 'Single source of truth — what\'s deployed, who owns, last evaluated. <strong>Most orgs don\'t have this.</strong>')}
${cell('COMP 4', 'Observability', '', 'Real-time model + data drift + prediction quality. <strong>AI silently degrades. Customer notices first without this.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: '3 common gaps', icon: '!', iconRed: true, headlineHtml: 'Shadow MLOps · compute surprise · <em>silent decay</em>',
      blocks: [{ atStep: 1, html: cardRed('3 INFRASTRUCTURE GAPS', 'Consistent patterns', ['<strong>Gap 1 — shadow MLOps</strong> · each team built its own pipeline. No standardisation. 5 model registries. 3 monitoring approaches.', '<strong>Gap 2 — compute cost surprise</strong> · workloads run, bills spike, finance is surprised. No FinOps for AI.', '<strong>Gap 3 — silent model decay</strong> · 2-year-old models still serving traffic. Nobody checks. Data drift accumulates. Customer notices.']) }] },
    { type: 'content', eyebrow: 'Cloud + edge', icon: '2', headlineHtml: 'Cloud standard · edge plan · <em>deliberate hybrid</em>',
      blocks: [{ atStep: 1, html: card('CLOUD + EDGE REALITIES', 'Most enterprises need both', ['<strong>Cloud AI</strong> — AWS, Azure, GCP all mature. Question: standardised on one or fragmented? Fragmentation kills compounding learning. <strong>Pick one primary. Use others tactically.</strong>', '<strong>Edge AI</strong> — for latency, privacy, cost. <strong>Most enterprises need some within 2-3 years.</strong> Plan now.', '<strong>Hybrid</strong> — make the seams deliberate, not accidental.']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Deploy speed · registry · <em>drift alert</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE INFRASTRUCTURE HONESTLY', '3 questions', ['<strong>Q1:</strong> deploy a new model in <2 weeks if compliance approves? Yes green · usually amber · no red.', '<strong>Q2:</strong> current registry of all production models with last-eval dates? Yes green · partial amber · no red.', '<strong>Q3:</strong> 10% prediction-quality drop — how do you find out? Automated alert green · manual review amber · <strong>customer complaint red</strong>.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Ask engineering for the registry of every production model + last-eval date', ['No registry exists → that\'s your highest-ROI infrastructure investment this quarter. <strong>Without it, you don\'t know what\'s silently breaking.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Leadership commitment · <em>the dimension that decides everything</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 components · 3 gaps · cloud + edge realities.', '<strong>Next:</strong> sponsorship, funding, ROI patience. The least technical and most decisive.') }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 },
  ],
})

// Ch6 — Leadership commitment
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Dimension 5 · Leadership Commitment' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-leadership.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · DIMENSION 5', h1Html: 'Sponsorship · funding · <em>ROI patience</em>', subtitleHtml: '<strong>The least technical and most decisive dimension.</strong>' },
    { type: 'content', eyebrow: '3 components', icon: '1', headlineHtml: 'Sponsor · funded plan · <em>stage-gate discipline</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('COMP 1', 'Executive sponsorship', '', 'Named C-suite owner of AI portfolio · actively champions in board meetings · allocates capital · kills failing initiatives.', 'green')}
${cell('COMP 2', 'Funded multi-year roadmap', '', 'AI doesn\'t pay back in one budget cycle. <strong>3-year capital plan with patience for year-1 invest, year 2-3 returns.</strong>', 'green')}
${cell('COMP 3', 'ROI patience + stage-gate', '', 'Willing to keep funding initiatives showing real progress. <strong>Equally willing to kill ones that should die.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Sponsor churn · year-1 defund · <em>nothing killed</em>',
      blocks: [{ atStep: 1, html: cardRed('3 LEADERSHIP FAILURE MODES', 'Consistent patterns', ['<strong>1. Sponsor changes too often</strong> — CIO who championed AI leaves. New CIO has different priorities. Portfolio resets every 18 months.', '<strong>2. Funded once, defunded after year 1</strong> — year-1 results don\'t match hype. Finance pulls funding. Year 2-3 returns never realised.', '<strong>3. No stage-gate discipline</strong> — every initiative gets perpetual funding. Nothing killed. Portfolio gets bigger and lower quality.']) }] },
    { type: 'content', eyebrow: 'The C-suite stress test · 3 questions for your CEO', icon: '2', headlineHtml: 'Outcomes · capital plan · <em>what we killed</em>',
      blocks: [{ atStep: 1, html: card('CEO STRESS TEST · 3 QUESTIONS', 'How thin is your sponsorship layer?', ['<strong>Q1:</strong> name 3 AI initiatives the org is investing in this year + expected business outcome of each. <em>If can\'t — sponsorship too thin.</em>', '<strong>Q2:</strong> what\'s the multi-year AI capital plan? <em>"Year by year" = red.</em>', '<strong>Q3:</strong> what AI initiative did we kill in the last 12 months and why? <em>"Nothing" = stage-gate not working.</em>']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Named owner · funded plan · <em>kill record</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE LEADERSHIP HONESTLY', '3 questions', ['<strong>Q1:</strong> named C-suite owner with budget authority? Yes green · sort-of amber · no red.', '<strong>Q2:</strong> multi-year capital plan funded? Yes green · annual cycle amber · <strong>reactive red</strong>.', '<strong>Q3:</strong> at least one AI initiative killed at stage-gate in last year? Yes green · considered amber · no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', '15-min conversation with your CEO or board chair', ['Ask the 3 stress-test questions. <strong>Their answers tell you exactly where leadership commitment scores. That answer is the most important diagnostic in this entire course.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'The 12-question diagnostic · <em>how to administer · how to read</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 components · 3 failure modes · 3-question stress test · 3-question scoring.', '<strong>Next:</strong> putting it all together. 12 questions across 5 dimensions. Three bands.') }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 },
  ],
})

// Ch7 — Diagnostic
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'The 12-question diagnostic' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-diagnostic.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · 12+ QUESTIONS · 5 DIMENSIONS', h1Html: '3 rules · 3 bands · <em>1 honest score</em>', subtitleHtml: '<strong>How to administer it. How to read it. What each band means for your next move.</strong>' },
    { type: 'content', eyebrow: 'The structure', icon: '1', headlineHtml: 'Data 3 · talent 3 · governance 4 · <em>infra 3 · leadership 3</em>',
      blocks: [{ atStep: 1, html: card('THE DIAGNOSTIC STRUCTURE', '16 questions across 5 dimensions', ['<strong>Data — 3 questions</strong> — quality audit · lineage defensibility · access speed.', '<strong>Talent — 3</strong> — leadership fluency · named delivery team · function-wide literacy.', '<strong>Governance — 4</strong> — inventory · risk classification · incident response · vendor terms.', '<strong>Infrastructure — 3</strong> — deploy speed · model registry · drift alerting.', '<strong>Leadership — 3</strong> — named sponsor · funded multi-year · stage-gate kill record.']) }] },
    { type: 'content', eyebrow: 'How to score honestly · 3 rules', icon: '2', headlineHtml: 'Specific · evidence · <em>most are amber</em>',
      blocks: [{ atStep: 1, html: cardGreen('3 SCORING RULES', 'Calibration over confidence', ['<strong>Rule 1 — specifically not aspirationally.</strong> "Working on it" = amber, not green. "Plan to" = red, not amber.', '<strong>Rule 2 — anchor on evidence.</strong> If can\'t point to a doc, tool, or named person — doesn\'t count. Marketing doesn\'t count.', '<strong>Rule 3 — accept amber/red is normal.</strong> Greens everywhere isn\'t calibrated. <em>It\'s confidence theatre.</em>']) }] },
    { type: 'content', eyebrow: 'How to administer · 3 patterns', icon: '3', headlineHtml: 'Self · committee · <em>external</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PATTERN 1', 'Self-assessment', '', 'CIO/AI lead scores honestly. <strong>Bias risk. Fastest.</strong>')}
${cell('PATTERN 2', 'Committee scoring', '', '3-5 execs from different functions score together. <strong>Disagreements are themselves data. Best balance.</strong>', 'green')}
${cell('PATTERN 3', 'External assessor', '', 'Trusted advisor scores via interviews + docs. <strong>Highest quality. Most expensive. Use when stakes are high.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: '3 bands · what each means', icon: '4', headlineHtml: 'Operationalising · building · <em>foundations</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('BAND 1', 'Operationalising', '', '5+ greens · 0 reds. Past foundations. <strong>Focus: scale what works · portfolio quality.</strong>', 'green')}
${cell('BAND 2', 'Building', '', 'Mostly amber + 1-2 green. Most common 2026 band. <strong>Focus: close 2-3 specific reds while delivering.</strong>', 'amber')}
${cell('BAND 3', 'Foundations', '', 'Multiple reds. <strong>Pre-pilot investment in weakest 2 dimensions. Limit portfolio to 2-3 small initiatives.</strong>', 'red')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'One-hour scoring session with top 3-5 execs', ['Score the 12 questions together. <strong>Disagreements ARE the data — pay close attention.</strong> Add up colours. That\'s your band.']) },
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Diagnostic structure · 3 scoring rules · 3 admin patterns · 3 bands.', '<strong>Last chapter:</strong> what to do at each band · 4 trust trip-wires · interactive Markdown builder for your CEO conversation.') }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 235.0, slide: 5, step: 2 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 },
  ],
})

// Ch8 — Roadmap
const ch8BuilderInit = `
var builderInit=false;var state={band:'',weakest:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-readiness-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var b=state.band||'_(pick your band)_';var w=state.weakest||'_(pick weakest dimension)_';var s=state.sponsor||'_(pick sponsor)_';return '# AI Readiness · 12-Month Roadmap\\n\\n**CEO / Board sponsor:** ____________________\\n**Honest score date:** ____________________\\n\\n## Current band\\n> '+b+'\\n\\n## Weakest dimension to invest in first\\n> '+w+'\\n\\n## Named executive sponsor\\n> '+s+'\\n\\n## Quarter 1 (90 days)\\n- Run the 12-question diagnostic with 3-5 execs in one session\\n- Name a single accountable C-suite owner of AI portfolio\\n- Build a current inventory of every AI system in production\\n- Pilot 1-2 small initiatives only · don\'t add more until weakest dimension moves\\n\\n## Quarters 2-3 (months 4-9)\\n- Close the 2 most consequential red items\\n- Pick one framework (NIST AI RMF or ISO 42001) and implement deeply\\n- Run one incident-response tabletop exercise\\n- Re-score quarterly · track shift in band\\n\\n## Quarter 4 (months 10-12)\\n- Re-assess band · expected: move one band up if disciplined\\n- Add 2-3 additional initiatives only if foundations have moved\\n- Stage-gate kill any initiative not showing progress\\n\\n## 4 trust trip-wires (do not cross)\\n- Green dashboards without evidence — pointing to artifacts is required\\n- Sponsorship without budget authority — doesn\'t count\\n- 12 months and zero AI initiatives scaled to production — stop adding pilots\\n- Governance as afterthought — must influence design before launch\\n\\n---\\nSource: Gennoor Academy · AI Readiness Assessment Deep-Dive\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your readiness roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · ROADMAP BY BAND', h1Html: '3 bands · <em>4 trip-wires · the builder</em>', subtitleHtml: '7 chapters · <strong>this chapter sequences them into your next move.</strong>' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Calibration over confidence · <em>honest produces better decisions</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Andy Grove · output of a manager = output of the organisation under their influence', ['The AI readiness assessment is the leverage. <strong>What you do with the result is the output.</strong>']) }] },
    { type: 'content', eyebrow: 'Roadmap by band', icon: '2', headlineHtml: 'Operationalising · building · <em>foundations</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('BAND 1', 'Operationalising', '', 'Focus: portfolio quality · scale what works · governance at scale · vendor + model lifecycle discipline.', 'green')}
${cell('BAND 2', 'Building', '', 'Focus: close 2-3 reds. Maintain delivery. <strong>Don\'t add more until reds become amber.</strong>', 'amber')}
${cell('BAND 3', 'Foundations', '', 'Focus: pre-pilot in weakest 2 dimensions. Limit to 2-3 small initiatives. <strong>Build muscle while foundations mature.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Green-no-evidence · sponsor-no-budget · pilot-loop · <em>governance-afterthought</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('WIRE 1', 'Green dashboards without evidence', '', 'Point to artifact or not green. <strong>Marketing doesn\'t count.</strong>', 'red')}
${cell('WIRE 2', 'Sponsorship without budget', '', 'Named owner without budget authority is not a sponsor. <strong>Doesn\'t count.</strong>', 'red')}
${cell('WIRE 3', 'Pilots-permanent-pilots', '', '12 months · zero scaled to production. <strong>Stop adding pilots. Fix scaling.</strong>', 'red')}
${cell('WIRE 4', 'Governance as afterthought', '', 'Compliance + risk must influence design before launch. <strong>Mata-Avianca cross-domain.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Band · weakest dimension · sponsor · <em>take to CEO</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Current band</h5><div class="preset" data-group="band">
<button data-val="Band 1 — Operationalising (5+ greens · 0 reds)">Band 1 · Operationalising</button>
<button data-val="Band 2 — Building (mostly amber + 1-2 green)">Band 2 · Building</button>
<button data-val="Band 3 — Foundations (multiple reds)">Band 3 · Foundations</button>
</div></div>
<div class="group"><h5>Weakest dimension</h5><div class="preset" data-group="weakest">
<button data-val="Data — quality, lineage, accessibility, governance">Data</button>
<button data-val="Talent — build/buy/borrow + leadership fluency">Talent</button>
<button data-val="Governance — NIST/EU/ISO + inventory + lifecycle">Governance</button>
<button data-val="Infrastructure — MLOps + registry + observability">Infrastructure</button>
<button data-val="Leadership commitment — sponsor + funded plan + stage-gate">Leadership</button>
</div></div>
<div class="group"><h5>Named C-suite sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="CEO directly · single owner reports to CEO">CEO directly</button>
<button data-val="CIO · with budget authority + board access">CIO</button>
<button data-val="CDO/Chief Data Officer · with cross-function authority">CDO</button>
<button data-val="COO · with operational portfolio authority">COO</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my readiness roadmap (.md)</button>
</div>
<div class="preview" id="preview"># AI Readiness · 12-Month Roadmap

Pick band, weakest dimension, and sponsor on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Calibration · 5 dimensions · 12 questions · <em>3 bands · 4 trip-wires</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Calibration over confidence · five readiness dimensions · three failure modes per dimension · honest scoring not green dashboards · twelve-question diagnostic · three bands (operationalising · building · foundations) · different next moves per band · four trust trip-wires · leadership commitment is decisive.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your honest band.</div><div class="row"><span class="arr">→</span>Get one CEO or board conversation on the calendar before next Friday with your honest score in hand.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 },
    { at: 230.0, slide: 6 }, { at: 240.0, slide: 6, step: 1 },
  ],
})

console.log('\n✓ Course 21 chapters 1-8 built.')
