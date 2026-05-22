// Course 41 — AI Decision Making (Emma · foundations track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Foundations · AI Decision Making'
const OUT = 'tmp/academy-build/ai-decision-making/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'AI as decision input vs decision maker' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-input-vs-maker.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · INPUT · NOT THE DECISION', h1Html: '3 decision modes · <em>3 decisions never delegated</em>', subtitleHtml: '<strong>The better the model gets, the more tempting it is to defer. That deference is the risk.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Better model · <em>more deference risk</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Cognitive risk grows with model quality', ['The better the model gets, the more tempting it is to defer to it. <strong>That deference is exactly where teams hand over judgement they should be keeping.</strong>'], 'Cognitive risk grows with model quality. <em>Not the other way around.</em> Most teams haven\'t built the discipline yet.') }] },
  { type: 'content', eyebrow: '3 decision modes', icon: '2', headlineHtml: 'AI as input · AI-assisted · <em>AI as decider</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1', 'AI as input', '', 'Ask AI for a perspective · weigh alongside · you decide. <strong>Healthy.</strong>', 'green')}
${cell('M2', 'AI-assisted', '', 'AI proposes · you critique · you decide. <strong>Healthy with discipline.</strong>', 'green')}
${cell('M3', 'AI as decider', '', 'AI produces · you accept. <strong>Cognitive offloading. The risk mode.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: '3 decisions never delegated', icon: '!', iconRed: true, headlineHtml: 'High-stakes irreversible · context-dependent · <em>judgement calls</em>',
    blocks: [{ atStep: 1, html: cardRed('3 DECISIONS THAT SHOULD NEVER BE FULLY DELEGATED', '', ['<strong>1. High-stakes irreversible.</strong> Firing · major capital allocation · legal positions. Wrong answers are expensive and slow to correct.', '<strong>2. Context-dependent.</strong> Regional regulatory nuance · local culture · customer-specific history. Model trained on dataset often missing your context.', '<strong>3. Judgement calls.</strong> Strategy tradeoffs · people decisions · values-not-facts. Model can list considerations. <em>It can\'t weigh them for you.</em>']) }] },
  { type: 'content', eyebrow: '2 signals of drift', icon: '3', headlineHtml: 'Quiet acceptance · <em>reasoning lost</em>',
    blocks: [
      { atStep: 1, html: card('2 SIGNALS YOU\'VE DRIFTED INTO AI-AS-DECIDER MODE', '', ['<strong>Signal 1.</strong> You stop asking "do I agree?" before acting on AI output. <em>Quiet acceptance.</em>', '<strong>Signal 2.</strong> You can\'t articulate why you decided what you decided beyond "the AI suggested it." <em>Reasoning lost.</em>'], 'When either appears in yourself or your team — <strong>reset. Move back to mode one or two.</strong>') },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit your last 5 AI-assisted decisions', ['For each, can you articulate reasoning beyond "AI suggested"? <strong>That audit is your starting baseline.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Cognitive offloading risk · <em>why better models make it worse</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', '3 modes · 3 never-delegate categories · 2 drift signals.', '<strong>Next:</strong> Kahneman framing · 2 countermeasures.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'The cognitive offloading risk' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-offloading.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · SYSTEM 1 · SYSTEM 2 · OFFLOADING', h1Html: 'Why better models suppress critique · <em>2 countermeasures</em>', subtitleHtml: '<strong>Calculators offloaded arithmetic — well-defined and verifiable. AI offloads reasoning, judgement, synthesis — exactly what we\'re paid for.</strong>' },
  { type: 'content', eyebrow: 'What offloading is', icon: '1', headlineHtml: 'Brain conserves effort · <em>tools reliable → brain stops generating</em>',
    blocks: [{ atStep: 1, html: card('WHAT COGNITIVE OFFLOADING ACTUALLY IS', '', ['Brain naturally conserves effort. <strong>When a tool reliably produces good answers, brain stops generating the answer itself.</strong>', '<strong>Calculators</strong> did this for arithmetic. Most of us can\'t multiply 3-digit numbers in our heads anymore. <em>Largely fine.</em> Calculator work is well-defined and verifiable.', '<strong>AI does it for reasoning, judgement, and synthesis.</strong> That\'s harder. <em>Those are exactly what we\'re paid for as managers and senior contributors.</em>']) }] },
  { type: 'content', eyebrow: 'Why better is worse', icon: '!', iconRed: true, headlineHtml: 'Bad models force critique · <em>good models suppress it</em>',
    blocks: [{ atStep: 1, html: cardRed('WHY OFFLOADING GETS WORSE WITH BETTER MODELS', 'Kahneman cross-domain', ['<strong>Bad models force critique.</strong> Obvious errors → you correct → reasoning stays engaged.', '<strong>Good models suppress critique.</strong> Output looks right → you don\'t notice what would need critiquing.', 'Kahneman\'s two-system framing — System 1 fast/intuitive · System 2 slow/deliberate. <em>Good AI lets System 1 accept output without engaging System 2.</em>'], '<strong>Cognitive cost:</strong> you lose the practice of generating answers yourself. Over months, the muscle weakens. <em>Six months later, you can\'t reason about the problem without the tool.</em>') }] },
  { type: 'content', eyebrow: '2 countermeasures', icon: '2', headlineHtml: 'Pre-commitment · <em>periodic AI-free decisions</em>',
    blocks: [{ atStep: 1, html: card('2 COUNTERMEASURES FROM DECISION-SCIENCE RESEARCH', '', ['<strong>1. Pre-commitment.</strong> Before consulting AI, write down what you\'d decide without it. Then consult. Then decide.', 'Pre-commitment doesn\'t make AI input less useful. <em>It just keeps your reasoning engaged.</em>', '<strong>2. Periodic AI-free decisions.</strong> Sometimes decide without AI input at all. Once a week · once a month · pick something low-stakes.', '<em>The pattern keeps the muscle exercised. Without it, you lose capacity slowly.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'AI-free decisions recent · <em>your instinct wins sometimes</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE YOUR OFFLOADING RISK', '2 questions', ['<strong>Q1:</strong> when did you last make an important decision without AI input? This week green · this month amber · <strong>can\'t remember red — muscle weakening</strong>.', '<strong>Q2:</strong> when AI recommends X and instinct says Y, what fraction Y wins? >30% green · 10-30% amber · <strong><10% red — rubber-stamping</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one upcoming decision', ['Write your answer before consulting AI. Compare. <strong>Notice if and how AI changes your mind.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'When to override AI confidently · <em>3 signals · the deference trap</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'What offloading is · why better=worse · 2 countermeasures.', '<strong>Next:</strong> 3 override signals · deference trap · override discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'When to override AI confidently' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-override.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · 3 OVERRIDE SIGNALS · DEFERENCE TRAP', h1Html: 'When your judgement beats the model · <em>and how to learn from it</em>', subtitleHtml: '<strong>The model said X. We followed. It didn\'t work. We\'re confused why.</strong>' },
  { type: 'content', eyebrow: '3 override signals', icon: '1', headlineHtml: 'Context · recency · <em>regional</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('O1', 'Context model can\'t see', '', 'Internal politics · team dynamics · customer history. <strong>Your judgement is more informed.</strong>', 'green')}
${cell('O2', 'Recency', '', 'Training cutoff 6-12 months ago. <strong>If question is about last quarter, your knowledge is fresher.</strong>', 'green')}
${cell('O3', 'Regional specifics', '', 'GCC · India · Africa · SEA regulations/markets/culture. <strong>Model training underrepresents region.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The deference trap', icon: '!', iconRed: true, headlineHtml: '"The model said X" as convenient cover · <em>lose the lesson</em>',
    blocks: [{ atStep: 1, html: cardRed('THE DEFERENCE TRAP', 'Override internally then defer externally', ['<strong>Pattern:</strong> "The model said X. We followed. It didn\'t work. We\'re confused why."', '<strong>Cause:</strong> you held information the model didn\'t. You knew. <em>You overrode internally — then deferred to the model in writing.</em>', 'This happens when leaders feel they need to justify externally and the model\'s framing is convenient cover.'], '<strong>Cost:</strong> you lose the lesson when X doesn\'t work. <em>Was X wrong because model was wrong, or because you abandoned your reasoning? You won\'t know.</em>') }] },
  { type: 'content', eyebrow: 'Override discipline', icon: '2', headlineHtml: 'Write a one-line note · <em>audit + pattern + teaching</em>',
    blocks: [{ atStep: 1, html: card('THE OVERRIDE DISCIPLINE', '1-line note serves 3 purposes', ['When you override → write a one-line note: what the model said · what you decided · why your context overrode.'], '<strong>3 purposes:</strong> audit trail for later (override good or bad?) · pattern detection (when do you keep overriding?) · team teaching (others learn when override is correct). <em>Without note, overrides become invisible.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Documenting overrides · <em>override calibration</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE OVERRIDE DISCIPLINE', '2 questions', ['<strong>Q1:</strong> when you override AI, do you document why? Consistently green · sometimes amber · <strong>never red — no learning loop</strong>.', '<strong>Q2:</strong> last 10 overrides, what fraction were correct? >70% green · 50-70% amber · <strong><50% red — not well-calibrated</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last 10 AI-augmented decisions', ['For overrides — were you right? <strong>That calibration tells you when to trust your override muscle.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: '80/20 verification rule · <em>and the 100%-verify categories</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 override signals · deference trap · override discipline.', '<strong>Next:</strong> 80/20 rule · 3 100%-verify cases · verification protocol.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'The 80/20 verification rule' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-verification.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · WHAT YOU VERIFY · WHAT YOU DON\'T', h1Html: '80/20 rule · 3 filters · <em>3 cases that need 100%</em>', subtitleHtml: '<strong>Verify the 20% of decisions where the cost of being wrong is 80% of total decision-stakes.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Can\'t verify everything · <em>can\'t verify nothing</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Verification energy goes where stakes are', ['You can\'t verify every AI-augmented decision. <em>That would defeat the purpose of using AI.</em>', 'You also can\'t verify none. <em>That\'s how you end up in the deference trap.</em>'], '<strong>The 80/20 rule:</strong> verify the 20% of decisions where cost of being wrong is 80% of total stakes. <em>That\'s where verification energy belongs.</em>') }] },
  { type: 'content', eyebrow: '3 filters · which 20%', icon: '2', headlineHtml: 'Reversibility · stakes · <em>context</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('F1', 'Reversibility', '', 'Hard to reverse → verify. Easy to reverse → skip detailed.', 'green')}
${cell('F2', 'Stakes', '', 'High (money · people · legal) → verify. Low (daily prio · routine) → skip.', 'green')}
${cell('F3', 'Context', '', 'Internal dynamics · regional specifics → verify. Model knows well → skip.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 cases need 100%', icon: '!', iconRed: true, headlineHtml: 'External fact · individual rights · <em>legal disclosure</em>',
    blocks: [{ atStep: 1, html: cardRed('3 CASES THAT NEED 100% VERIFICATION', 'Not 20% — every claim, every source, every number', ['<strong>1. Anything published externally as fact.</strong> Customer-facing claims · regulator submissions · marketing with numbers. <em>Mata v. Avianca cross-domain. Air Canada Moffatt cross-domain.</em>', '<strong>2. Anything affecting individual rights.</strong> Hiring · compensation · termination · customer denials. <em>Bias, error, consequence make this a line.</em>', '<strong>3. Anything triggering legal disclosure.</strong> Securities-relevant · material risk · compliance reporting.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Protocol documented · <em>verification choice deliberate</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE VERIFICATION DISCIPLINE', '2 questions', ['<strong>Q1:</strong> for 100%-verify categories, documented verification protocol? Written green · informal amber · <strong>no red — incident statistically inevitable</strong>.', '<strong>Q2:</strong> for 20% you choose to verify, deliberate or random? Deliberate green · "looks suspicious" amber · <strong>random red — verifying noise, missing signal</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List 3 highest-stakes AI decision types', ['Write verification protocol for each — one paragraph. <strong>That becomes your team\'s standard.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Team-level decision norms · <em>surviving tool churn + turnover</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '80/20 principle · 3 filters · 3 100%-verify cases.', '<strong>Next:</strong> 3 team norms · onboarding pattern.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Team-level decision norms' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-norms.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · NORMS SURVIVING TOOL CHURN + TURNOVER', h1Html: '3 tool-agnostic norms · <em>onboarding pattern</em>', subtitleHtml: '<strong>Tool churn breaks tool-specific norms. The discipline must be tool-agnostic.</strong>' },
  { type: 'content', eyebrow: 'The drift problem', icon: '!', iconRed: true, headlineHtml: 'Different tools · prompts · thresholds · <em>decision-quality drift</em>',
    blocks: [{ atStep: 1, html: cardRed('THE DRIFT PROBLEM', 'Each team member uses AI differently', ['Different tools · different prompts · different acceptance thresholds. <strong>Fine for IC work.</strong>', 'Problem for team decisions. <em>Same situation → dramatically different AI-assisted recommendations. Hard to compare. Hard to learn from.</em>']) }] },
  { type: 'content', eyebrow: '3 norms that work', icon: '1', headlineHtml: 'Categorisation · pre-commitment · <em>override docs</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('N1', 'Decision categorisation', '', 'For each recurring type: AI-input · AI-assisted · AI-led (rare). <strong>New hires learn. Tools change. Norm survives.</strong>', 'green')}
${cell('N2', 'Pre-commitment for non-routine', '', 'Whoever leads writes position before AI · then consults · then re-positions if changed.', 'green')}
${cell('N3', 'Override documentation', '', 'When AI overridden, why is documented. <strong>Team learns from each other\'s patterns.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Onboarding pattern', icon: '2', headlineHtml: 'Week 1 · week 2 · <em>month 3</em>',
    blocks: [{ atStep: 1, html: card('ONBOARDING NEW MEMBERS TO THE NORMS', 'Most teams don\'t — drift accelerates', ['<strong>Week 1.</strong> Shadow-review 3 of your team\'s AI-augmented decisions. See pre-commitment notes · override docs.', '<strong>Week 2.</strong> New hire writes own pre-commitment + AI consultation + decision for low-stakes call. You review.', '<strong>Month 3.</strong> New hire fluent in team norms. <em>Drift slowed.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Written norms · <em>survives tool switch</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TEAM NORMS', '2 questions', ['<strong>Q1:</strong> could a new hire learn norms from a 1-2 page doc? Documented green · "we\'d explain" amber · <strong>exists in heads red — drift inevitable</strong>.', '<strong>Q2:</strong> norms survived a tool switch in last 12 months? Yes green · "haven\'t switched" amber · <strong>broke red — tool-specific not principle-based</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Write team\'s AI decision norms on one page', ['If you can\'t, that\'s the gap. <strong>Once written, share. Discuss. Iterate.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Scenario planning with AI · <em>without false confidence</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Drift problem · 3 norms · onboarding.', '<strong>Next:</strong> where AI helps · false-confidence trap · 4-step discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Scenario planning with AI' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-scenarios.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · BREADTH FROM AI · JUDGEMENT FROM YOU', h1Html: 'Where AI helps · false-confidence trap · <em>4-step discipline</em>', subtitleHtml: '<strong>The black swan that hits is the one nobody listed. AI\'s lists often skip the scenarios that matter most.</strong>' },
  { type: 'content', eyebrow: 'Where AI helps', icon: '1', headlineHtml: 'Breadth · variation · <em>adversarial framing</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('H1', 'Breadth', '', '20 scenarios in time human writes 5. <strong>Surfaces ones you weren\'t going to think of.</strong>', 'green')}
${cell('H2', 'Variation', '', 'Given base case · AI varies parameters. <strong>Removes typing the obvious variations.</strong>', 'green')}
${cell('H3', 'Adversarial framing', '', '"What would have to be true for our plan to fail?" <strong>AI good at this. Humans avoid it.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'False-confidence trap', icon: '!', iconRed: true, headlineHtml: '20 confident scenarios · <em>still missing the one that hits</em>',
    blocks: [{ atStep: 1, html: cardRed('THE FALSE-CONFIDENCE TRAP', '', ['<strong>Trap:</strong> AI generates 20 scenarios with confident language. List looks comprehensive. <em>You think you\'ve covered the space.</em>', '<strong>Reality:</strong> AI scenarios are confident-sounding but often skip the scenarios that matter most. Regional regulatory shock. Specific competitor action. Internal political shift. <em>Things model wasn\'t trained on.</em>'], '<strong>Discipline:</strong> after AI generates · ask "which scenarios are missing?" <em>Without that step, you scenario-plan with false confidence. The black swan that hits is the one nobody listed.</em>') }] },
  { type: 'content', eyebrow: '4-step scenario discipline', icon: '2', headlineHtml: 'Base case yourself · AI 10-20 · filter to 5-7 · <em>add 2-3 missing</em>',
    blocks: [{ atStep: 1, html: card('4-STEP SCENARIO DISCIPLINE', 'Mix matters: 5-7 from AI + 2-3 from you', ['<strong>Step 1.</strong> Write the base case yourself. <em>Don\'t outsource this.</em>', '<strong>Step 2.</strong> Ask AI for 10-20 scenario variations.', '<strong>Step 3.</strong> Filter to 5-7 you\'ll plan against. Apply judgement: plausible? high-impact?', '<strong>Step 4 — critical.</strong> "What scenarios is this list missing?" Generate 2-3 more yourself. <em>The ones AI didn\'t surface are often the ones that matter.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Add scenarios AI didn\'t · <em>real scenario was on your list</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SCENARIO-WITH-AI DISCIPLINE', '2 questions', ['<strong>Q1:</strong> when scenario-planning with AI, do you add scenarios AI didn\'t generate? Always green · sometimes amber · <strong>no red — false confidence</strong>.', '<strong>Q2:</strong> scenarios that materialised — were they on AI\'s list or yours? Mostly added green · mixed amber · <strong>always from AI red — got lucky</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last scenario-planning exercise', ['What scenarios actually came true? On the list or surprises? <strong>That tells you whether your discipline is working.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Decision drift + audit cadence · <em>catching slow drift</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Where AI helps · false-confidence · 4-step discipline.', '<strong>Next:</strong> 3 drift types · quarterly audit · model-drift checks.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Decision drift and audit cadence' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-drift.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · SLOW DRIFT · VISIBLE ONLY WITH AUDIT', h1Html: '3 drift types · quarterly audit · <em>model drift checks</em>', subtitleHtml: '<strong>An hour a quarter. Pulls 10-15 decisions. Walks four questions. Exposes more drift than six months of feeling.</strong>' },
  { type: 'content', eyebrow: '3 drift types', icon: '!', iconRed: true, headlineHtml: 'Deference · verification · <em>model drift</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('D1', 'Deference drift', '', 'Over months, team accepts AI more often. Override rate falls. <strong>Sliding toward AI-as-decider.</strong>', 'red')}
${cell('D2', 'Verification drift', '', 'Protocol exists on paper. "Looks fine" replaces actually verifying. <strong>Until something doesn\'t and slips through.</strong>', 'red')}
${cell('D3', 'Model drift', '', 'Vendor updated model. Behavior changed silently. <strong>Same prompt → different output → different decisions.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Quarterly audit', icon: '1', headlineHtml: 'Pull 10-15 decisions · <em>4 audit questions</em>',
    blocks: [{ atStep: 1, html: card('THE QUARTERLY DECISION AUDIT', 'Once a quarter · one hour', ['Pull 10-15 AI-augmented decisions from the previous quarter.', '<strong>For each:</strong> did pre-commitment happen? · was AI used as input or decider? · did override documentation happen where appropriate? · was the decision good or bad in retrospect?'], '<strong>Output:</strong> one-page summary. Drift patterns identified. Norms reinforced or updated.') }] },
  { type: 'content', eyebrow: 'Catching model drift', icon: '2', headlineHtml: '5-10 canonical prompts · <em>quarterly replay</em>',
    blocks: [{ atStep: 1, html: card('CATCHING MODEL DRIFT SPECIFICALLY', 'LLMOps drift discipline applied to team decisions', ['<strong>Signal:</strong> same input produces different output than 6 months ago.', '<strong>Check:</strong> maintain 5-10 canonical prompts. Run them quarterly. Compare to baseline.'], 'If outputs drift meaningfully → <strong>audit your team\'s calibration.</strong> They\'ve been making decisions assuming old behaviour. Update the assumption. <em>Cross-domain from chapter 3 of MLOps for LLMs.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Audit happens · <em>action follows audit</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AUDIT CADENCE', '2 questions', ['<strong>Q1:</strong> team runs quarterly decision audit? Consistently green · "we should" amber · <strong>no red — drift invisible</strong>.', '<strong>Q2:</strong> when audit finds drift, do you update norms or coach? Both green · one but not other amber · <strong>no action red — audit becomes theatre</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Schedule one hour next quarter for decision audit', ['Pull 10 decisions. Walk the 4 questions. <strong>That single hour exposes more drift than 6 months of feeling.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · 1-page decision charter · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '3 drift types · quarterly audit · model drift checks.', '<strong>Last:</strong> 4-section charter · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={domain:'',verification:'',audit:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-decision-charter.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var d=state.domain||'_(pick primary decision domain)_';var v=state.verification||'_(pick verification depth)_';var au=state.audit||'_(pick audit cadence)_';return '# Team AI Decision Charter\\n\\n**Team:** ____________________\\n**Charter owner:** ____________________\\n\\n## Primary decision domain\\n> '+d+'\\n\\n## Verification protocol\\n> '+v+'\\n\\n## Audit cadence\\n> '+au+'\\n\\n## 4-section charter\\n- [ ] The principle: AI is input, not decision. Three categories never delegated.\\n- [ ] Categorisation: recurring decision types · AI-input · AI-assisted · AI-not-used.\\n- [ ] Discipline: pre-commitment · override docs · 80/20 verification · quarterly audit.\\n- [ ] Norms: new hire onboarding · tool-agnostic · update cadence.\\n\\n## 4 trust trip-wires (do not cross)\\n- AI as decider for high-stakes irreversible decisions\\n- Accepting AI output without articulable reasoning\\n- Overriding AI without documentation\\n- No scheduled audit (drift becomes invisible)\\n\\n---\\nSource: Gennoor Academy · AI Decision Making\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — AI decision charter' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 1-PAGE CHARTER · WHAT YOUR TEAM OPERATES AGAINST', h1Html: '4-section charter · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>AI is a decision input, not the decision. The charter makes that explicit.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Input · not decision · <em>charter makes it explicit</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Charter protects against deference drift', ['<strong>AI is a decision input, not the decision.</strong> The charter makes that explicit for your team and protects against the deference drift that grows with better models.']) }] },
  { type: 'content', eyebrow: '4-section charter', icon: '2', headlineHtml: 'Principle · categorisation · discipline · <em>norms</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'The principle', '', '3-5 sentences. Where AI is input · where not. Never-delegated categories.')}
${cell('S2', 'Categorisation', '', 'Recurring decision types · marked AI-input · AI-assisted · AI-not-used. <strong>No "AI-as-decider" category.</strong>', 'amber')}
${cell('S3', 'Discipline', '', 'Pre-commitment · override docs · 80/20 + 100% for the 3 categories · quarterly audit.', 'green')}
${cell('S4', 'Norms', '', 'New hire onboarding · tool-agnostic · update cadence.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'AI as decider · accept without reasoning · override without doc · <em>no audit</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'AI as decider for high-stakes', '', 'Always input, never decider.', 'red')}
${cell('W2', 'Accept without articulable reasoning', '', '"The AI said so" is not a reason.', 'red')}
${cell('W3', 'Override without documentation', '', 'Untracked overrides destroy learning.', 'red')}
${cell('W4', 'No scheduled audit', '', 'Without audit, can\'t see drift.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · charter builder', icon: '✓', headlineHtml: 'Domain · verification · audit · <em>take to team Monday</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Primary decision domain</h5><div class="preset" data-group="domain">
<button data-val="Executive / leadership decisions (strategy · capital · people)">Executive / leadership</button>
<button data-val="Product + engineering decisions (architecture · build vs buy · priorities)">Product + engineering</button>
<button data-val="Operations + finance (planning · budgeting · vendor selection)">Operations + finance</button>
<button data-val="Customer-facing (support tickets · complex case routing · escalation)">Customer-facing</button>
</div></div>
<div class="group"><h5>Verification protocol depth</h5><div class="preset" data-group="verification">
<button data-val="Light (80/20 for routine + 100% for the 3 high-stakes categories)">Light + 100% on 3</button>
<button data-val="Heavy (100% on all customer-facing + legal + people decisions, 50% otherwise)">Heavy verification</button>
<button data-val="Tiered (formal protocol per decision type, AB-100-style discipline)">Tiered formal</button>
</div></div>
<div class="group"><h5>Audit cadence</h5><div class="preset" data-group="audit">
<button data-val="Quarterly (default — 1 hour, 10-15 decisions, 4 audit questions)">Quarterly</button>
<button data-val="Monthly (for high-velocity decision teams or recent AI rollout)">Monthly</button>
<button data-val="Half-yearly (for stable teams with mature discipline already)">Half-yearly</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my AI decision charter (.md)</button>
</div>
<div class="preview" id="preview"># Team AI Decision Charter

Pick domain, verification protocol, and audit cadence on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Input · not decision · 3 modes · 2 countermeasures · 80/20 · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI is a decision input, not the decision. Three decision modes, drift toward AI-as-decider is the risk. Two countermeasures from decision-science research. Override discipline. The 80/20 verification rule with three 100%-verify categories. Team norms that survive tool churn. Scenario planning without false confidence. Quarterly audit. One-page charter.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Draft your team\'s charter.</div><div class="row"><span class="arr">→</span>Get team discussion on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 41 chapters 1-8 built.')
