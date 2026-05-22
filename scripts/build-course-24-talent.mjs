// Course 24 — AI Talent Strategy (Andrew)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Talent · AI Talent Strategy'
const OUT = 'tmp/academy-build/ai-talent-strategy/chapters'

const card = (ct, h3, ps, t) => `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardRed = (ct, h3, ps, t) => `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardGreen = (ct, h3, ps, t) => `<div class="card green"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The talent landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-talent-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · TALENT IS THE BOTTLENECK', h1Html: '3 segments · <em>3 failure modes</em>', subtitleHtml: '<strong>AI talent is the bottleneck. Not the technology. And scarcity is asymmetric.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Tech is accessible · <em>talent is scarce</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'AI talent is the bottleneck', ['Technology is broadly accessible. <strong>Talent to apply it to real problems, ship safely, operate for years — is genuinely scarce.</strong>', 'Scarcity is asymmetric. Talent goes to orgs that can attract and keep them.']) }] },
  { type: 'content', eyebrow: '3 segments', icon: '2', headlineHtml: 'Senior ML · applied · <em>AI-augmented domain</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('SEG 1', 'Senior ML/AI specialists', '', 'PhDs + senior engineers building novel models. Very scarce. Globally mobile. Expensive.')}
${cell('SEG 2', 'Applied ML + MLOps', '', 'Mid-level engineers deploying and operating AI in production. Scarce. Increasingly non-traditional paths.')}
${cell('SEG 3', 'AI-augmented domain pros', '', 'Accountants · analysts · marketers who use AI to multiply output. <strong>Largest segment. Most under-invested.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Hire-only · train-only · <em>vendor-only</em>',
    blocks: [{ atStep: 1, html: cardRed('3 TALENT FAILURE MODES', 'Consistent across enterprises', ['<strong>1. Hire-only.</strong> Senior market is brutal. You will lose.', '<strong>2. Train-only.</strong> Some people can\'t make the jump. Pretending wastes time.', '<strong>3. Vendor-only.</strong> Cheap year-1. Catastrophic year-3. No institutional muscle.']) }] },
  { type: 'content', eyebrow: 'What this course covers', icon: '→', headlineHtml: '6 mechanics · 1 org design · <em>1 roadmap</em>',
    blocks: [
      { atStep: 1, html: card('STRUCTURE', '8 chapters', ['Ch 2 — build/buy/borrow · Ch 3 — role architecture · Ch 4 — hiring patterns · Ch 5 — retention · Ch 6 — fluency build (the leverage) · Ch 7 — org design · Ch 8 — roadmap.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick the one AI capability gap most blocking your portfolio', ['Segment 1, 2, or 3? <strong>Start there.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Build / buy / borrow · <em>matching capability to source</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Talent is the bottleneck · 3 segments · 3 failure modes.', '<strong>Next:</strong> when to build, when to buy, when to borrow. Different economics, different durability.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Build, buy, borrow' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-build-buy-borrow.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · MATCHING CAPABILITY TO SOURCE', h1Html: '3 modes · 3 signals each · <em>different economics</em>', subtitleHtml: '<strong>Most orgs need all three. The mix depends on capability + timeline.</strong>' },
  { type: 'content', eyebrow: '3 modes', icon: '1', headlineHtml: 'Build · buy · <em>borrow</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1', 'Build', '', 'Train existing people. Hire junior + develop. Internal capability development.', 'green')}
${cell('M2', 'Buy', '', 'Hire experienced specialists. Lateral hires. Acqui-hires.')}
${cell('M3', 'Borrow', '', 'Consultants · contractors · vendor services. Capability rented, not owned.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'When to build · 3 signals', icon: '2', headlineHtml: 'Moat · context · <em>multi-year horizon</em>',
    blocks: [{ atStep: 1, html: cardGreen('WHEN TO BUILD', '3 signals', ['<strong>1. Core to competitive moat.</strong> Can\'t outsource what makes you different.', '<strong>2. Needs deep domain context.</strong> Industry knowledge · customer relationships · internal data fluency.', '<strong>3. Multi-year horizon.</strong> Build is slow. 18 months works · next quarter doesn\'t.']) }] },
  { type: 'content', eyebrow: 'When to buy · 3 signals', icon: '3', headlineHtml: 'Gap too wide · senior credibility now · <em>favourable market</em>',
    blocks: [{ atStep: 1, html: card('WHEN TO BUY', '3 signals', ['<strong>1. Capability gap too wide to bridge internally in reasonable time.</strong>', '<strong>2. Need senior leadership credibility now.</strong> Someone who has shipped at scale.', '<strong>3. Talent market for the specific capability is favourable.</strong> Down cycles = opportunistic hiring.'], '<strong>2026 reality:</strong> senior ML salaries plus signing plus equity plus retention = $300-500K+/yr in major markets. <em>More for principals.</em>') }] },
  { type: 'content', eyebrow: 'When to borrow · 3 signals', icon: '4', headlineHtml: 'Temporary · specialised · <em>urgent</em>',
    blocks: [
      { atStep: 1, html: card('WHEN TO BORROW', '3 signals', ['<strong>1. Temporary or project-bound need.</strong> Pilot. Migration. Don\'t hire for one-time job.', '<strong>2. Highly specialised, rarely needed capability.</strong> Specific certification. Niche tuning.', '<strong>3. You need someone yesterday.</strong> Vendor services deploy in days where hiring takes months.'], '<strong>Danger:</strong> if borrow becomes default, year-3 is catastrophic. <em>Build no institutional muscle.</em>') },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick your top AI capability gap · apply the framework', ['<strong>Build, buy, or borrow — and why?</strong> That answer drives talent strategy for that capability.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Role architecture · <em>5 core · 3 emerging</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 modes · 3 signals each · 2026 cost reality.', '<strong>Next:</strong> 5 AI roles that scale + 3 emerging + the AI lead reporting question.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Role architecture' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-role-architecture.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · 5 + 3 ROLES', h1Html: '5 core · 3 emerging · <em>the leadership question</em>', subtitleHtml: '<strong>Most orgs have 1 and 3. They under-staff 2, 4, 5. That\'s the gap.</strong>' },
  { type: 'content', eyebrow: '5 core AI roles', icon: '1', headlineHtml: 'ML engineer · data scientist · MLOps · <em>AI PM · AI lead</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'AI/ML engineer', '', 'Builds + deploys models. Most common hiring need.')}
${cell('R2', 'Data scientist', '', 'Analyses · frames problems · prototypes. <strong>Different skill set from ML engineer.</strong>')}
${cell('R3', 'MLOps engineer', '', 'Operates AI in production. The handoff target. <strong>Most under-hired role.</strong>', 'amber')}
${cell('R4', 'AI product manager', '', 'Translates business need to AI capability. Owns measurement. <strong>Real AI-specific PM specialisation.</strong>', 'amber')}
${cell('R5', 'AI strategist / lead', '', 'Senior role. Owns portfolio direction. Bridges to executives.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '3 emerging roles', icon: '2', headlineHtml: 'Governance · prompt engineer · <em>AI ethicist</em>',
    blocks: [{ atStep: 1, html: card('3 EMERGING ROLES · 2026', 'Increasingly common', ['<strong>1. AI governance lead.</strong> Inventory · risk register · compliance liaison. Increasingly required by EU AI Act + ISO 42001.', '<strong>2. Prompt engineer / AI workflow designer.</strong> Eliciting reliable behaviour from foundation models. Real specialisation.', '<strong>3. AI ethicist.</strong> Less common but appearing in regulated industries — healthcare, financial services, government.']) }] },
  { type: 'content', eyebrow: 'The AI lead reporting question', icon: '!', iconRed: true, headlineHtml: 'CIO · CTO · <em>CEO direct</em>',
    blocks: [{ atStep: 1, html: cardRed('THE LEADERSHIP QUESTION', 'Single highest-cost AI talent decision', ['<strong>CIO</strong> — most common · tech-centric · infrastructure focus.', '<strong>CTO</strong> — when AI core to product · product-centric · build focus.', '<strong>CEO direct</strong> — when AI is strategic priority · cross-functional · strategy focus.'], '<strong>Wrong reporting line is the single highest-cost AI talent decision.</strong> Get it right at hire time. <em>Rebooting reporting structure later is hard.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '5 roles staffed · <em>reporting alignment</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE ROLE ARCHITECTURE', '2 questions', ['<strong>Q1:</strong> all 5 core roles staffed? Yes green · 3-4 amber · <3 red.', '<strong>Q2:</strong> AI lead reporting line aligned with where AI strategically matters most? Yes green · misaligned amber-to-red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List your AI team by role', ['MLOps, AI PM, or AI lead missing/under-staffed → <strong>next hire conversation.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Hiring patterns · <em>3 sources · 3 principles · 3 anti-patterns</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '5 core · 3 emerging · reporting question · 2-question scoring.', '<strong>Next:</strong> the specific hiring moves that work in a tight market.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Hiring patterns' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-hiring.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · MOVES THAT WORK', h1Html: '3 sources · 3 principles · <em>3 anti-patterns</em>', subtitleHtml: '<strong>In a tight market, the patterns that work are not what most orgs default to.</strong>' },
  { type: 'content', eyebrow: '3 sourcing patterns', icon: '1', headlineHtml: 'Convert internal · senior not principal · <em>adjacent fields</em>',
    blocks: [{ atStep: 1, html: cardGreen('3 SOURCING PATTERNS', 'Work in tight markets', ['<strong>1. Convert internal engineers.</strong> Strongest software engineer in your org → credible AI engineer in 3-6 months focused investment. <em>Faster, cheaper, lower flight risk.</em>', '<strong>2. Hire at senior not principal level.</strong> Principal market is brutal. Senior willing to grow is workable. Develop into principal over 18 months.', '<strong>3. Hire from adjacent fields.</strong> Physicists · computational biologists · quants often transition to ML well. Broader pool. Comparable performance.']) }] },
  { type: 'content', eyebrow: '3 evaluation principles', icon: '2', headlineHtml: 'Practical demo · stack fit · <em>soft skills compound</em>',
    blocks: [{ atStep: 1, html: card('3 EVALUATION PRINCIPLES', 'More signal than abstract questions', ['<strong>1. Practical demo over theoretical interview.</strong> Realistic problem + data · watch them work.', '<strong>2. Fit with your specific stack matters.</strong> PyTorch vs TF · lakehouse vs warehouse · cloud A vs B. Pure ML talent doesn\'t transfer perfectly.', '<strong>3. Softer skills compound.</strong> Clear design doc? Explain to non-technical stakeholder? <em>Brilliant ML who can\'t communicate = bottleneck not leverage.</em>']) }] },
  { type: 'content', eyebrow: '3 anti-patterns', icon: '!', iconRed: true, headlineHtml: 'Pay-only · title-inflation · <em>eternal loops</em>',
    blocks: [{ atStep: 1, html: cardRed('3 HIRING ANTI-PATTERNS', 'Why offers fail', ['<strong>1. Pay-only competition.</strong> You\'ll lose. Big tech and well-funded startups outbid. <em>Compete on something other than total comp.</em>', '<strong>2. Fancy title as substitute.</strong> "Head of AI" without authority. Real candidates see through it.', '<strong>3. Eternal interview loops.</strong> 8 rounds in 6 weeks. Candidate accepts elsewhere by week 3. <strong>Streamline to 3-4 rounds in 10 days.</strong>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Offer rate · <em>time to offer</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE HIRING', '2 questions', ['<strong>Q1:</strong> AI engineer offer-to-acceptance rate? >60% green · 40-60% amber · <strong><40% red — process or comp needs work</strong>.', '<strong>Q2:</strong> first interview to offer time? <10 days green · 2-3 weeks amber · >3 weeks red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last 5 AI hiring loops that didn\'t end in offer accepted', ['Diagnose each. <strong>Pattern emerges. Fix the most common cause first.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Retention · <em>more leverage than next hire</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 sources · 3 principles · 3 anti-patterns · 2-question scoring.', '<strong>Next:</strong> 4 retention drivers · the 3-12 month flight-risk window · 3 retention failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Retention' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-retention.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · MORE LEVERAGE THAN NEXT HIRE', h1Html: '4 drivers · 3-12 month window · <em>3 failure modes</em>', subtitleHtml: '<strong>Interesting work + resources matter more than another 10% on comp.</strong>' },
  { type: 'content', eyebrow: '4 retention drivers · priority order', icon: '1', headlineHtml: 'Interesting work · resources · growth path · <em>competitive comp</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('D1', 'Interesting work', '', 'AI engineers want problems that matter and stretch skills. <strong>Boring work loses them faster than mediocre comp.</strong>', 'green')}
${cell('D2', 'Compute + data access', '', 'Constant ticketing for GPU time signals an org not serious about AI. <strong>They leave.</strong>', 'green')}
${cell('D3', 'Growth path', '', 'Senior → staff → principal → AI lead. <strong>No path means they\'ll find one elsewhere.</strong>', 'green')}
${cell('D4', 'Competitive comp', '', 'Not highest. But not 30% below market. <strong>Comp doesn\'t buy loyalty. Comp gaps push people out.</strong>')}
</div>` }] },
  { type: 'content', eyebrow: 'The flight-risk window', icon: '2', headlineHtml: '3 to 12 months · <em>real growth conversation</em>',
    blocks: [{ atStep: 1, html: card('THE FLIGHT-RISK PROFILE', 'Watch closely', ['<strong>Months 1-3:</strong> prove themselves.', '<strong>Months 4-9:</strong> learn the org.', '<strong>Months 10-12:</strong> question fit.', '<strong>That window is when they leave or stay.</strong>'], '<strong>What works:</strong> a real growth conversation. <em>Not perfunctory. Specific.</em> What\'s the next role · what\'s the path · what\'s the support.') }] },
  { type: 'content', eyebrow: '3 retention failure modes', icon: '!', iconRed: true, headlineHtml: 'Exit interviews · counter-offers · <em>uniform strategy</em>',
    blocks: [{ atStep: 1, html: cardRed('3 RETENTION FAILURE MODES', 'Predictable losses', ['<strong>1. Exit interviews as diagnostic.</strong> By then the person is gone. <em>Leverage moment was 3 months earlier.</em>', '<strong>2. Counter-offer as response.</strong> Works short-term. Almost always fails medium-term. <em>Person has crossed the line.</em>', '<strong>3. Uniform retention strategy.</strong> Different segments need different things. Senior ML wants research time. MLOps wants production ownership. PM wants strategy access.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Voluntary attrition · <em>documented growth paths</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE RETENTION', '2 questions', ['<strong>Q1:</strong> voluntary AI attrition last 12 mo? <10% green · 10-15% amber · <strong>>15% red — you have a problem</strong>.', '<strong>Q2:</strong> AI engineer past 9 months — documented growth path? Yes green · verbal-not-written amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick your 2 strongest AI engineers', ['When did you last explicitly discuss their growth path? <strong>"Not sure" → next 1:1.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Fluency build · <em>where the leverage is</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 drivers · flight-risk window · 3 failure modes · 2-question scoring.', '<strong>Next:</strong> the AI fluency build for the existing org. The 5-10x leverage move.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'The AI fluency build' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-fluency.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · THE LEVERAGE MOVE', h1Html: '3 tiers · <em>5-10x payback vs hiring</em>', subtitleHtml: '<strong>Equip 100 existing employees with AI fluency → 5-10x payback vs hiring 1 senior ML engineer.</strong>' },
  { type: 'content', eyebrow: 'Why fluency is leverage · math', icon: '1', headlineHtml: '1 ML engineer · vs · <em>100 AI-fluent employees</em>',
    blocks: [{ atStep: 1, html: card('WHY FLUENCY IS LEVERAGE', 'The math', ['<strong>Hiring 1 senior ML engineer:</strong> $300-500K/yr. Impact: 1 engineer\'s output.', '<strong>Equipping 100 existing employees with AI fluency:</strong> <$1M total in training + tools + time. Impact: 100 people × 10% productivity gain.'], '<strong>Fluency build pays back 5-10x the hiring strategy.</strong> <em>Provided you actually do it well.</em>') }] },
  { type: 'content', eyebrow: '3 fluency tiers', icon: '2', headlineHtml: 'Universal · functional · <em>power users</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Universal literacy', '', 'Everyone. Knows what AI is/isn\'t. How to use approved tools. What not to put in public LLM. <strong>2 hrs. Annual refresh.</strong>', 'green')}
${cell('T2', 'Functional fluency', '', 'Per-function deep training. Marketing for brand-voice safe content. Finance for forecasting + auditability. <strong>6-12 hrs. Tailored.</strong>', 'green')}
${cell('T3', 'Power users + champions', '', '2-3 per BU. Trained deeply. Resource for their team. <strong>Diffuse fluency by example.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'What works · 3 patterns', icon: '3', headlineHtml: 'Anchored on real work · short cadence · <em>visible leadership use</em>',
    blocks: [{ atStep: 1, html: cardGreen('WHAT WORKS', '3 patterns', ['<strong>1. Anchored on real work.</strong> Don\'t teach AI in abstract. Teach the marketer on their actual content workflow. <em>Engagement drops to zero in abstract training.</em>', '<strong>2. Short cadence, not single event.</strong> 2 hours every quarter compounds. 3 days once → nothing afterwards doesn\'t.', '<strong>3. Visible leadership use.</strong> CFO uses AI visibly → finance org follows. <em>Behavioural modeling does more than any training program.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Weekly AI use · <em>per-function curriculum</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FLUENCY', '2 questions', ['<strong>Q1:</strong> last quarter, % of employees using AI tools weekly? >60% green · 30-60% amber · <strong><30% red</strong>.', '<strong>Q2:</strong> each major function has documented AI fluency curriculum? Most yes green · some amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one function · design a 6-hour AI fluency program for their actual workflow', ['<strong>Pilot with 10 people next quarter. Measure productivity + satisfaction.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Org design · <em>centralised · federated · hub-and-spoke</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 tiers · 3 patterns that work · 2-question scoring.', '<strong>Next:</strong> 3 org models · 3 design questions · 3 failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Organisational design' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-org-design.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · ORG MODELS', h1Html: 'Centralised · federated · <em>hub-and-spoke</em>', subtitleHtml: '<strong>Most enterprises end up at hub-and-spoke. Most durable for 500+ people orgs.</strong>' },
  { type: 'content', eyebrow: '3 org models', icon: '1', headlineHtml: 'Central · federated · <em>hub-and-spoke</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1', 'Centralised', '', 'Single central team owns all AI. <strong>Strong platform. Slow to serve specific BUs.</strong>')}
${cell('M2', 'Federated', '', 'Each BU owns its AI team. <strong>Fast for BU. No compounding across org.</strong>')}
${cell('M3', 'Hub-and-spoke (hybrid)', '', 'Central owns platforms, standards, governance. Embedded in priority BUs. <strong>Most enterprises end here.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 design questions', icon: '2', headlineHtml: 'Reporting · central scope · <em>solid vs dotted line</em>',
    blocks: [{ atStep: 1, html: card('3 DESIGN QUESTIONS', 'Answer specifically', ['<strong>Q1: where does AI lead report?</strong> CIO · CTO · CEO. Different answers per org.', '<strong>Q2: does central own infra + standards + governance + delivery, or just infra + standards?</strong> Owning delivery makes it slow. <em>Infra + standards is the durable scope.</em>', '<strong>Q3: embedded teams report solid line to central or BU?</strong> For most orgs: dotted to central, solid to BU. <em>Serve BU. Central provides standards + career development.</em>']) }] },
  { type: 'content', eyebrow: '3 design failure modes', icon: '!', iconRed: true, headlineHtml: 'Central bottleneck · no platform · <em>no standards</em>',
    blocks: [{ atStep: 1, html: cardRed('3 ORG DESIGN FAILURE MODES', 'Patterns to avoid', ['<strong>1. Central team that\'s delivery bottleneck.</strong> Every BU files tickets. Over-subscribed. Nothing ships.', '<strong>2. Federated teams with no central platform.</strong> 5 teams each build own ML platform. <em>Massive duplication. No compounding.</em>', '<strong>3. Embedded teams without standards.</strong> Each BU does AI differently. Quality varies wildly. <strong>Risk concentrated in worst BU.</strong>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Model fit · <em>platform/delivery separation</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE ORG DESIGN', '2 questions', ['<strong>Q1:</strong> org design matches model your size needs? Hub-and-spoke at 500+ is durable. <em>Centralised at 5000 = constraint.</em>', '<strong>Q2:</strong> clear separation between platform/standards (central) and delivery (embedded)? Yes green · mixed amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Map current AI org against 3 models', ['Mismatch? Centralised but BUs filing tickets you can\'t serve → <strong>federation or hub-and-spoke is the next conversation.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '3 models · 3 design questions · 3 failure modes · 2-question scoring.', '<strong>Last chapter:</strong> 12-month talent roadmap · 4 trust trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={stance:'',fluency:'',org:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-talent-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var s=state.stance||'_(pick hiring stance)_';var f=state.fluency||'_(pick fluency strategy)_';var o=state.org||'_(pick org model)_';return '# AI Talent · 12-Month Roadmap\\n\\n**CHRO / CEO sponsor:** ____________________\\n**Start date:** ____________________\\n\\n## Hiring stance\\n> '+s+'\\n\\n## Fluency strategy\\n> '+f+'\\n\\n## Org model\\n> '+o+'\\n\\n## Months 1-3\\n- Audit current AI talent · map roles · identify gaps\\n- Confirm AI lead reporting line\\n- Start universal AI literacy training\\n\\n## Months 4-6\\n- Strategic hires for biggest gaps\\n- Functional fluency programs for 2 priority functions\\n- Document growth paths for existing AI talent\\n\\n## Months 7-12\\n- Operating model stabilises\\n- Champions network across BUs\\n- Quarterly fluency refresh cadence\\n- Hiring + retention discipline becomes routine\\n\\n## 4 trust trip-wires (do not cross)\\n- Hire-only — you will lose the senior market\\n- Train-only — some people can\\'t make the jump\\n- Eternal interview loops — 3 weeks+ is too long\\n- Counter-offer as retention — person has crossed the line\\n\\n---\\nSource: Gennoor Academy · AI Talent Strategy\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your AI talent roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 12-MONTH ROADMAP', h1Html: '4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>The fluency build is the leverage. The hiring strategy is the support.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Talent is the bottleneck · <em>fluency is the leverage</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Andy Grove leverage framing', ['Equipping your existing organisation is the highest-multiplier move you can make. <strong>5-10x payback vs hiring.</strong>']) }] },
  { type: 'content', eyebrow: '12-month roadmap', icon: '2', headlineHtml: 'Months 1-3 · 4-6 · <em>7-12</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1-3', 'Audit + start', '', 'Audit AI talent · map roles · confirm reporting line · start universal AI literacy.')}
${cell('M4-6', 'Hire + functional fluency', '', 'Strategic hires for biggest gaps · functional fluency for 2 priority functions · growth paths.', 'amber')}
${cell('M7-12', 'Stabilise + compound', '', 'Operating model stable · champions network · quarterly refresh · hiring + retention routine.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trip-wires', icon: '!', iconRed: true, headlineHtml: 'Hire-only · train-only · loops · <em>counter-offers</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Hire-only', '', 'You will lose the senior market. Combine with build + borrow.', 'red')}
${cell('W2', 'Train-only', '', 'Some people can\'t make the jump. Pretending wastes time.', 'red')}
${cell('W3', 'Eternal interview loops', '', '3 weeks+ is too long. Lose candidates to faster competitors.', 'red')}
${cell('W4', 'Counter-offer as retention', '', 'By the time offer is on the table, the person has crossed the line.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Hiring stance · fluency · org model · <em>take to CHRO/CEO</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Hiring stance</h5><div class="preset" data-group="stance">
<button data-val="Build-heavy — convert internal engineers · target 70% build, 20% buy, 10% borrow">Build-heavy</button>
<button data-val="Balanced — 40% build, 40% buy, 20% borrow">Balanced</button>
<button data-val="Buy-and-scale — 20% build, 60% buy, 20% borrow · aggressive growth mode">Buy-and-scale</button>
</div></div>
<div class="group"><h5>Fluency strategy</h5><div class="preset" data-group="fluency">
<button data-val="Universal first then functional · 100% universal in year 1, 2 functions deep">Universal first</button>
<button data-val="Function-by-function · pick highest-ROI function, deep fluency, then expand">Function-by-function</button>
<button data-val="Champions network · 30-50 champions, then diffuse to broader org">Champions-led</button>
</div></div>
<div class="group"><h5>Org model</h5><div class="preset" data-group="org">
<button data-val="Hub-and-spoke — central platform/standards + embedded in priority BUs">Hub-and-spoke</button>
<button data-val="Centralised — single central team for now, hub-and-spoke as it scales">Centralised → hub-and-spoke</button>
<button data-val="Federated — BUs own AI teams · central coordination only">Federated</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my AI talent roadmap (.md)</button>
</div>
<div class="preview" id="preview"># AI Talent · 12-Month Roadmap

Pick stance, fluency, and org model on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Talent bottleneck · 3 segments · build/buy/borrow · <em>fluency is the leverage · 4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI talent is the bottleneck · 3 segments — senior specialist · applied practitioner · AI-fluent domain professional · build/buy/borrow with capability-source match · 5 core roles + 3 emerging · hiring patterns that work · retention drivers in priority order · fluency build is the leverage · hub-and-spoke for org design at scale · four trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick stance and fluency.</div><div class="row"><span class="arr">→</span>Get one CHRO or CEO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 24 chapters 1-8 built.')
