// Course 30 — AI Product Management (Andrew)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Product · AI Product Management'
const OUT = 'tmp/academy-build/ai-product-management/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The AI PM landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · PRODUCTS NOT MODELS', h1Html: '5 capabilities · <em>3 anti-patterns</em>', subtitleHtml: '<strong>AI products are evaluated like products. Not like models. Users care if it works for their job in their context.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'AI products = products · <em>not models</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Users don\'t care about model accuracy in the abstract', ['They care whether the product works for their job in their context.'], '<strong>That changes how AI PMs work.</strong> JTBD framing · eval harnesses · telemetry day one · guardrails before users find edges · customer feedback as primary signal.') }] },
  { type: 'content', eyebrow: '5 AI PM capabilities', icon: '2', headlineHtml: 'JTBD · evals · telemetry · guardrails · <em>communication</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('C1', 'Frame JTBD', '', 'What specific user job · success criterion · failure modes.', 'green')}
${cell('C2', 'Design with eval harnesses', '', 'Quantitative evaluation built into the product. <strong>Not optional. Not later.</strong>', 'green')}
${cell('C3', 'Design with telemetry', '', 'User actions · AI outputs · user reactions. <strong>Without telemetry you cannot improve.</strong>', 'green')}
${cell('C4', 'Build guardrails', '', 'What the AI must not say or do. Refusals · fallbacks · escalations.', 'green')}
${cell('C5', 'Communicate honestly', '', 'What AI does well. What it doesn\'t. <strong>Disclosure builds trust. Hidden AI breaks it.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-patterns', icon: '!', iconRed: true, headlineHtml: 'Benchmark chase · no eval · <em>AI on everything</em>',
    blocks: [{ atStep: 1, html: cardRed('3 AI PM ANTI-PATTERNS', 'Predictable failure', ['<strong>1. Chasing model benchmarks over user outcomes.</strong> Scores well internally · doesn\'t help users. Benchmarks are not the product.', '<strong>2. Shipping AI without eval and telemetry.</strong> Flying blind. Customer-reported issues are first signal. <em>Too late.</em>', '<strong>3. Pushing AI on every feature.</strong> Not every problem is an AI problem. <em>Adding AI to features that worked fine often makes them worse.</em>']) }] },
  { type: 'content', eyebrow: 'What this course covers', icon: '→', headlineHtml: '7 chapters · roadmap',
    blocks: [
      { atStep: 1, html: card('STRUCTURE', '8 chapters', ['Ch 2 — JTBD · Ch 3 — eval harnesses · Ch 4 — telemetry + feedback · Ch 5 — guardrails + refusals · Ch 6 — pricing + communication + trust · Ch 7 — team + operating model · Ch 8 — roadmap.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one AI feature in your product or roadmap', ['Next 7 chapters give the operational discipline for getting it right.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'JTBD framing · <em>most important AI PM skill</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Products not models · 5 capabilities · 3 anti-patterns.', '<strong>Next:</strong> 3-part frame for any AI feature + the "is this an AI job?" question.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Job-to-be-done framing' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-jtbd.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · MOST IMPORTANT SKILL', h1Html: 'Probabilistic features · <em>JTBD framing decisive</em>', subtitleHtml: '<strong>Without knowing what user job the AI is solving, you cannot evaluate, improve, or price.</strong>' },
  { type: 'content', eyebrow: 'Why JTBD matters more for AI', icon: '1', headlineHtml: 'Probabilistic · <em>context-dependent</em>',
    blocks: [{ atStep: 1, html: card('WHY JTBD MATTERS MORE FOR AI', 'AI features behave differently from software features', ['Traditional software: same input → same output. <strong>Works for everyone or doesn\'t.</strong>', 'AI: same input can produce different outputs · outputs vary in quality · outputs depend on context.', '<strong>Without knowing exactly what user job the AI is solving, you cannot evaluate, improve, or price it.</strong>']) }] },
  { type: 'content', eyebrow: '3-part frame', icon: '2', headlineHtml: 'User job · success criterion · <em>failure modes</em>',
    blocks: [{ atStep: 1, html: card('THE 3-PART FRAME FOR ANY AI FEATURE', 'Actionable design', ['<strong>1. The user job.</strong> Specific · verb-noun. "Summarise this customer call." Not "use AI for sales."', '<strong>2. The success criterion.</strong> What success looks like from the user\'s perspective.', '<strong>3. The failure modes.</strong> Specific worst-case. Wrong info acted on · embarrassing tone · missing critical detail.'], '<em>Vague "AI for X" produces unaccountable features.</em>') }] },
  { type: 'content', eyebrow: 'The "is this an AI job?" question', icon: '!', iconRed: true, headlineHtml: 'AI is a tool · <em>not the goal</em>',
    blocks: [{ atStep: 1, html: cardRed('IS THIS AN AI JOB?', 'For each candidate feature', ['<strong>Good AI jobs:</strong> reliable summarisation · classification · drafting · transformation.', '<strong>Bad AI jobs:</strong> identity-specific facts · high-stakes judgement · recall of specific past interactions.', '<strong>The high-stakes-enough question:</strong> if a deterministic feature solves it for 90% of users, that\'s often the right answer. Adding AI just because adds variance and cost.'], '<strong>Honest PM:</strong> says no to AI features that don\'t pass these questions. <em>AI is a tool. Not the goal.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Frame in 3 sentences · <em>kill rate</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE JTBD FRAMING', '2 questions', ['<strong>Q1:</strong> for each AI feature in your roadmap, state user job + success + failure modes in 3 sentences? All yes green · some amber · <strong>most no red</strong>.', '<strong>Q2:</strong> have you killed an AI feature on JTBD grounds? If not, you\'re probably saying yes too easily.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Take your top AI feature · write the 3-part frame in 3 sentences', ['<strong>If you can\'t, you don\'t have a feature yet. You have a wish.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Eval harnesses · <em>without them you fly blind</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'JTBD matters more for AI · 3-part frame · is-this-an-AI-job question · 2-question scoring.', '<strong>Next:</strong> repeatable programmatic tests · 3 eval categories · what to put in the eval set.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Eval harnesses' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-evals.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · MEASURE OR FLY BLIND', h1Html: '3 eval categories · <em>4 case types</em>', subtitleHtml: '<strong>AI product development becomes engineerable. Every change measured before it ships. Drift detected.</strong>' },
  { type: 'content', eyebrow: 'What an eval harness is', icon: '1', headlineHtml: 'Repeatable · programmatic · <em>versioned</em>',
    blocks: [{ atStep: 1, html: card('WHAT AN EVAL HARNESS IS', 'Without it · with it', ['Repeatable programmatic test of AI behaviour against defined criteria. Inputs · expected outputs or success patterns · automated comparison · versioned and tracked over time.', '<strong>Without:</strong> can\'t tell if model change is good or bad · can\'t tell if prompts help · can\'t tell if production is degrading.', '<strong>With:</strong> every change measured before ship · drift detected · regressions caught. <em>AI product development becomes engineerable.</em>']) }] },
  { type: 'content', eyebrow: '3 eval categories', icon: '2', headlineHtml: 'Task · quality+safety · <em>production telemetry</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('CAT 1', 'Task-specific evals', '', 'For this specific user job, does AI produce acceptable output? <strong>Hand-built or curated golden datasets.</strong>', 'green')}
${cell('CAT 2', 'Quality + safety evals', '', 'Tone · factuality · inappropriate refusal · out-of-scope refusal. <strong>Cross-cutting across features.</strong>', 'green')}
${cell('CAT 3', 'Production telemetry evals', '', 'Real user interactions sampled + evaluated. <strong>Catches what golden datasets miss.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'What to put in the eval set', icon: '3', headlineHtml: 'Easy · hard · adversarial · <em>real production</em>',
    blocks: [{ atStep: 1, html: card('WHAT TO PUT IN THE EVAL SET', 'All four categories', ['<strong>Easy cases:</strong> things AI should obviously get right. If it fails these, something fundamentally broken.', '<strong>Hard cases:</strong> edge cases · ambiguous inputs · long contexts. Where differences between model versions show up.', '<strong>Adversarial cases:</strong> prompt injection · jailbreak attempts · harmful requests. <strong>Model should refuse. Always.</strong>', '<strong>Real production cases:</strong> sample from actual users · anonymise · add to eval set. <em>Production reality &gt; internal speculation.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Automated runs · <em>monthly production updates</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE EVAL HARNESS DISCIPLINE', '2 questions', ['<strong>Q1:</strong> for top AI feature, automated eval suite runs on every code change? Yes green · sometimes amber · no red.', '<strong>Q2:</strong> eval set updated with real production cases at least monthly? Yes green · quarterly amber · <strong>once at launch and never updated red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull eval suite for top AI feature · when last updated with production cases?', ['<strong>More than 3 months ago → discipline gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Telemetry + feedback · <em>what eval sets miss</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Definition · 3 categories · 4 case types · 2-question scoring.', '<strong>Next:</strong> 4 telemetry signals · acceptance rate metric · privacy frame.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Telemetry + customer feedback' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-telemetry.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · SIGNAL EVAL SETS MISS', h1Html: '4 signals · acceptance rate · <em>privacy frame</em>', subtitleHtml: '<strong>Without acceptance rate, you don\'t know if AI is helping. Without privacy review, regulator letter awaits.</strong>' },
  { type: 'content', eyebrow: '4 telemetry signals', icon: '1', headlineHtml: 'Invoked · output · acted on · <em>explicit feedback</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('S1', 'Was AI invoked', '', 'Feature engagement at user + session level.', 'green')}
${cell('S2', 'What AI produced', '', 'Outputs captured for review and improvement. <strong>Subject to privacy controls.</strong>', 'green')}
${cell('S3', 'Did user act on output', '', 'Most important signal. <strong>Accepted? Edited? Rejected and started over?</strong>', 'green')}
${cell('S4', 'Explicit user feedback', '', 'Thumbs up/down · free-text · inline corrections. Voluntary but extremely valuable.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The acceptance rate metric', icon: '2', headlineHtml: 'Trends are diagnostic · <em>aim for trend not absolute</em>',
    blocks: [{ atStep: 1, html: cardGreen('THE ACCEPTANCE RATE METRIC', 'Single most useful AI product metric', ['For AI features that suggest something user can accept · edit · or reject. <strong>Track % accepted as-is, edited, rejected.</strong>', '<strong>Trends are diagnostic:</strong> falling acceptance → quality regression · rising → improvement or user adaptation.'], 'Different products have different healthy rates. <em>Aim for trend not absolute.</em> Coding assistant: 20% accept-as-is healthy if climbing. Email writer: 30% accept-as-is + 30% accept-with-edit healthy.') }] },
  { type: 'content', eyebrow: 'Privacy frame on telemetry', icon: '!', iconRed: true, headlineHtml: 'GDPR · CCPA · DPDPA · <em>industry-specific</em>',
    blocks: [{ atStep: 1, html: cardRed('PRIVACY FRAME ON TELEMETRY', 'Capturing outputs = capturing user data', ['Privacy law applies. GDPR · CCPA · India DPDPA · industry-specific.', '<strong>What works:</strong> opt-in for capture in sensitive contexts · anonymisation before storage · retention limits enforced · access logged.', '<strong>What doesn\'t:</strong> capturing everything by default with no opt-out. <em>Compliance breach. Customer trust damaged. Eventually regulator letter.</em>'], '<strong>PM responsibility:</strong> privacy review of telemetry plan before launch. Not optional.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '4 signals captured · <em>privacy reviewed</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TELEMETRY', '2 questions', ['<strong>Q1:</strong> top AI feature — all 4 signals captured and visible to team? Yes green · most amber · <strong>some missing red</strong>.', '<strong>Q2:</strong> privacy review documented for telemetry capture? Yes green · verbal approval amber · no formal review red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last week\'s telemetry for top AI feature · calculate acceptance rate', ['<strong>Can\'t answer immediately → telemetry investment unfinished.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Guardrails + refusals · <em>what AI must not say or do</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 signals · acceptance rate · privacy frame · 2-question scoring.', '<strong>Next:</strong> 4 guardrail categories · refusal as feature · adversarial testing.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Guardrails + refusals' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-guardrails.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · WHAT AI MUST NOT DO', h1Html: '4 categories · <em>refusal as feature</em>', subtitleHtml: '<strong>A narrow AI product that does its job well is better than a broad one that does many jobs poorly.</strong>' },
  { type: 'content', eyebrow: '4 guardrail categories', icon: '1', headlineHtml: 'Out-of-scope · sensitive · harmful · <em>citations</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'Out-of-scope refusals', '', 'AI declines things outside intended use. <strong>Polite. Clear. Offered alternative if relevant.</strong>', 'green')}
${cell('C2', 'Sensitive topic handling', '', 'Health · legal · financial advice when not appropriate. <strong>Refusal or referral to qualified humans.</strong>', 'green')}
${cell('C3', 'Harmful content refusal', '', 'Illegal · harmful · policy-violating content. <strong>Robust against jailbreak attempts.</strong>', 'green')}
${cell('C4', 'Citation + verification', '', 'For factual claims, AI cites sources. <strong>Mata cross-domain — AI hallucinates citations. Product makes verification easy.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Refusal as feature', icon: '2', headlineHtml: 'Counter-intuitive · <em>builds more trust</em>',
    blocks: [{ atStep: 1, html: card('REFUSAL AS FEATURE', 'Counter-intuitive but real', ['Product that refuses appropriately builds more user trust than one that always says yes. <strong>Users learn what AI is good at + what to handle themselves.</strong>', '<strong>What works:</strong> refusal messages that explain why and offer alternatives. "I can summarise this email, but for legal interpretation please consult your legal team."', '<strong>What doesn\'t:</strong> generic "I can\'t help with that." Or attempting to help with things product can\'t reliably do.'], '<strong>Honest position:</strong> a narrow AI product that does its job well is better than a broad one that does many jobs poorly.') }] },
  { type: 'content', eyebrow: 'Adversarial testing', icon: '!', iconRed: true, headlineHtml: 'Required · <em>users will try to break it</em>',
    blocks: [{ atStep: 1, html: cardRed('ADVERSARIAL TESTING · REQUIRED', 'Users will try unintended things', ['Some accidentally. Some deliberately. <strong>Test guardrails against this before users do.</strong>', '<strong>What this looks like:</strong> internal red team trying to make AI misbehave · document jailbreak attempts · patch in evals · repeat regularly. <em>Adversarial robustness is not a one-time check.</em>'], '<strong>Real-world precedent:</strong> Air Canada Moffatt — chatbot misrepresentation became company commitment. Microsoft Tay degenerated within hours. <em>Pre-launch adversarial testing prevents headlines.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Adversarial success rate · <em>last test refresh</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE GUARDRAILS', '2 questions', ['<strong>Q1:</strong> top AI feature — success rate on adversarial test prompts? >90% green · 75-90% amber · <strong><75% red</strong>.', '<strong>Q2:</strong> last adversarial test with new attack patterns? Last quarter green · last 6 months amber · <strong>never/once at launch red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Spend 30 minutes trying to break your own AI product', ['Document what worked. <strong>Those are your guardrail gaps.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Pricing · communication · <em>trust</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 categories · refusal as feature · adversarial testing · 2-question scoring.', '<strong>Next:</strong> 3 pricing approaches · unit economics · honest communication.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Pricing, communication, trust' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-pricing.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · EARN OR LOSE THE RELATIONSHIP', h1Html: '3 pricing · unit economics · <em>disclosure</em>', subtitleHtml: '<strong>Pricing not yet settled in 2026. Honest unit economics + honest communication = trust foundation.</strong>' },
  { type: 'content', eyebrow: '3 pricing approaches', icon: '1', headlineHtml: 'Value · consumption · <em>subscription with included</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('A1', 'Value-based', '', 'What AI is worth to customer. <strong>Defensible when customer outcome is measurable.</strong>', 'green')}
${cell('A2', 'Consumption', '', 'Pay per use · token · query. Aligns cost with value · creates cost anxiety.', 'amber')}
${cell('A3', 'Subscription with included AI', '', 'AI in tiered subscription. Removes per-use anxiety · hard to capture upside for power users.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'The unit economics problem', icon: '!', iconRed: true, headlineHtml: 'Inference is not free · <em>volume that delights damages margin</em>',
    blocks: [{ atStep: 1, html: cardRed('THE UNIT ECONOMICS PROBLEM', 'AI products have meaningful per-use cost', ['Frontier model API costs compound at scale. <strong>Volume that delights customers can damage your margin.</strong>', '<strong>What works:</strong> model unit economics before launch. Per-query cost · per-user margin · scenarios for high-volume users.', '<strong>What doesn\'t:</strong> launching with consumption that loses money on power users · or subscription that undercaptures from heavy users. <em>Math comes due eventually.</em>'], '<strong>AI PM responsibility:</strong> honest unit economics modelling in product decisions. <em>Not just feature roadmap. Cost roadmap too.</em>') }] },
  { type: 'content', eyebrow: 'Honest communication', icon: '2', headlineHtml: 'Trust foundation · <em>Art 50 + Air Canada applies</em>',
    blocks: [{ atStep: 1, html: card('HONEST COMMUNICATION · THE TRUST FOUNDATION', 'What works vs what doesn\'t', ['<strong>What works:</strong> tell customers what AI does well + what it doesn\'t · when AI is in use · when human review is involved.', 'EU AI Act Article 50 applies to many AI products. <strong>Disclosure of AI nature is required for in-scope uses.</strong> Increasingly expected even where not strictly required.', '<strong>What doesn\'t:</strong> marketing that overpromises. "Our AI understands you" — does it? "Our AI thinks like a senior consultant" — really?'], '<strong>Air Canada Moffatt cross-domain applies.</strong> Your AI\'s representations are your company\'s representations. <em>Marketing claims and product behaviour both matter.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Unit economics at 100x · <em>disclosure present</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PRICING + COMMUNICATION', '2 questions', ['<strong>Q1:</strong> unit economics work at 100x current customer volume? Yes green · probably amber · <strong>honestly no red — pricing decision deferred</strong>.', '<strong>Q2:</strong> AI-in-use moments — disclosure present and clear? Yes green · buried in ToS amber · <strong>hidden red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Calculate margin per query on your AI feature today', ['Margin shrinks meaningfully at higher volume? <strong>That\'s the unit economics conversation with finance.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Team + operating model · <em>5 roles · monthly cadence</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 pricing approaches · unit economics · honest communication · 2-question scoring.', '<strong>Next:</strong> 5 core roles · operating cadence · customer feedback loop.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Team + operating model' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-team.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · TEAM THAT SHIPS + IMPROVES', h1Html: '5 roles · 4 cadences · <em>customer feedback loop</em>', subtitleHtml: '<strong>The cadence separates AI products that improve from those that drift.</strong>' },
  { type: 'content', eyebrow: '5 core roles around an AI PM', icon: '1', headlineHtml: 'PM · ML eng · SW eng · design · <em>quality+safety</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'AI PM', '', 'Owns the product. Frames JTBD. Owns metrics. Final accountability.', 'green')}
${cell('R2', 'Applied ML/AI engineer', '', 'Builds AI capability. Prompt engineering. Fine-tuning when needed. Eval implementation.', 'green')}
${cell('R3', 'Software engineer', '', 'Surrounding product. Surface · telemetry · integration · infrastructure.', 'green')}
${cell('R4', 'Design', '', 'User research. Interaction design. <strong>AI products have unique interaction challenges.</strong>', 'green')}
${cell('R5', 'Quality + safety', '', 'Adversarial testing · red-team · privacy review. <strong>Often part-time but always present.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Operating cadence', icon: '2', headlineHtml: 'Weekly · monthly · <em>quarterly</em>',
    blocks: [{ atStep: 1, html: card('THE OPERATING CADENCE', 'Separates products that improve from those that drift', ['<strong>Weekly:</strong> eval review + telemetry review. What changed · what regressed · what needs attention.', '<strong>Monthly:</strong> production sample review. Team reads real production cases together. <em>Surfaces blind spots aggregate metrics miss.</em>', '<strong>Quarterly:</strong> adversarial test refresh. New attack patterns · updated guardrails.', '<strong>Quarterly:</strong> economics review. Cost per use · margin trends · pricing implications.']) }] },
  { type: 'content', eyebrow: 'Customer feedback loop', icon: '3', headlineHtml: 'Issue → eval → guardrail · <em>days not quarters</em>',
    blocks: [{ atStep: 1, html: card('THE CUSTOMER FEEDBACK LOOP', 'Critical · often weak', ['Customer-reported AI issues should flow back to team quickly. <strong>Within days. Not quarters.</strong>', '<strong>What works:</strong> internal channel where support escalates AI issues. PM reviews weekly. Patterns turn into evals.', '<strong>What doesn\'t:</strong> AI issues lost in general support tickets. Patterns not detected. <em>Same issues recur for months.</em>'], '<strong>AI PM responsibility:</strong> owns the issue-to-eval pipeline. Customer complaint → eval case → guardrail update. <em>This is how AI products mature.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Monthly sample · <em>issue resolution time</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TEAM + CADENCE', '2 questions', ['<strong>Q1:</strong> team reviews production AI samples together at least monthly? Yes green · sometimes amber · <strong>no/quarterly red</strong>.', '<strong>Q2:</strong> customer-reported AI issue — typical path to closed-loop fix? Days green · weeks amber · <strong>months/unknown red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Schedule 30-min production-sample review with team this week', ['10 random AI outputs from last week · read together · discuss what worked/didn\'t. <strong>Highest-leverage hour of the week.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '5 roles · 4 cadences · customer feedback loop · 2-question scoring.', '<strong>Last chapter:</strong> 12-month rollout · 4 trust trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={gap:'',cadence:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-pm-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var g=state.gap||'_(pick starting capability gap)_';var c=state.cadence||'_(pick cadence ambition)_';var s=state.sponsor||'_(pick accountable owner)_';return '# AI PM · 12-Month Roadmap\\n\\n**Head of Product / CPO:** ____________________\\n**Start date:** ____________________\\n\\n## Starting capability gap\\n> '+g+'\\n\\n## Cadence ambition\\n> '+c+'\\n\\n## Accountable owner\\n> '+s+'\\n\\n## Months 1-3: Foundations\\n- JTBD framing for current and planned AI features\\n- Eval harness for top feature\\n- Telemetry capturing all 4 signals\\n\\n## Months 4-6: Discipline\\n- Adversarial testing\\n- Guardrails strengthened\\n- Unit economics modelled\\n- Disclosure copy reviewed\\n\\n## Months 7-12: Cadence\\n- Monthly production sample reviews\\n- Quarterly adversarial test refresh\\n- Customer issue closed-loop pipeline running\\n\\n## 4 trust trip-wires (do not cross)\\n- Shipping AI without eval and telemetry — flying blind\\n- Over-promising in marketing — Air Canada Moffatt cross-domain\\n- Unit economics that break at scale — cap growth or re-price publicly\\n- Adding AI to features that worked fine without it — not every problem is an AI problem\\n\\n---\\nSource: Gennoor Academy · AI Product Management\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your AI PM roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 12-MONTH ROADMAP', h1Html: '3 phases · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Products not models. JTBD. Eval. Telemetry. Guardrails. Honest communication.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Evaluated like products · <em>not like models</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'User cares about their job in their context', ['Users do not care about model accuracy in the abstract. They care whether the product works for their job.']) }] },
  { type: 'content', eyebrow: '12-month rollout', icon: '2', headlineHtml: 'Foundations · discipline · <em>cadence</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1-3', 'Foundations', '', 'JTBD framing · eval harness for top feature · telemetry capturing all 4 signals.')}
${cell('M4-6', 'Discipline', '', 'Adversarial testing · guardrails strengthened · unit economics modelled · disclosure copy reviewed.', 'amber')}
${cell('M7-12', 'Cadence', '', 'Monthly production sample · quarterly adversarial refresh · customer issue closed-loop running.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'No eval · over-promise · bad economics · <em>AI on everything</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Shipping without eval + telemetry', '', '<strong>Flying blind.</strong> Customer reports first.', 'red')}
${cell('W2', 'Over-promising in marketing', '', '<strong>Air Canada Moffatt cross-domain.</strong> Marketing claims become product commitments.', 'red')}
${cell('W3', 'Unit economics break at scale', '', 'Either cap growth or re-price publicly. <strong>Both damage trust.</strong>', 'red')}
${cell('W4', 'AI on features that worked fine without it', '', 'Not every problem is an AI problem.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Gap · cadence · owner · <em>take to head of product</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting capability gap</h5><div class="preset" data-group="gap">
<button data-val="JTBD framing — get rigorous about user job + success + failure modes for each feature">JTBD framing</button>
<button data-val="Eval harness — build automated quality testing for the top feature">Eval harness</button>
<button data-val="Telemetry — capture all 4 signals + start measuring acceptance rate">Telemetry</button>
<button data-val="Guardrails + adversarial testing — strengthen what the AI must not do">Guardrails</button>
<button data-val="Unit economics + pricing — model cost at scale + revisit pricing strategy">Unit economics</button>
</div></div>
<div class="group"><h5>Cadence ambition</h5><div class="preset" data-group="cadence">
<button data-val="Weekly eval review + monthly production sample + quarterly adversarial refresh">Full cadence</button>
<button data-val="Monthly production sample + quarterly adversarial refresh">Monthly + quarterly</button>
<button data-val="Quarterly review of evals, telemetry, and adversarial tests">Quarterly only</button>
</div></div>
<div class="group"><h5>Accountable owner</h5><div class="preset" data-group="sponsor">
<button data-val="Head of Product with named AI PM lead + engineering partner">Head of Product</button>
<button data-val="CPO directly when AI is core to product strategy">CPO directly</button>
<button data-val="VP Engineering + Head of Product joint accountability">VP Eng + Head of Product</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my AI PM roadmap (.md)</button>
</div>
<div class="preview" id="preview"># AI PM · 12-Month Roadmap

Pick starting capability gap, cadence ambition, and accountable owner on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Products not models · 5 capabilities · 3 anti-patterns · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI products are evaluated like products, not models · five capabilities — JTBD framing, eval harnesses, telemetry, guardrails, honest communication · three anti-patterns to avoid · acceptance rate metric · adversarial testing required · unit economics modelled before launch · monthly production sample review · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting capability gap.</div><div class="row"><span class="arr">→</span>Get one head of product or CPO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 30 chapters 1-8 built.')
