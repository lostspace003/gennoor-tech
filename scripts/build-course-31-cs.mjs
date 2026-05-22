// Course 31 — AI for Customer Service & Support (Emma · doc 05 #7)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Service · AI for Customer Service & Support'
const OUT = 'tmp/academy-build/ai-for-customer-service-support/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The CS-AI landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · AI FOR VOLUME · HUMANS FOR VALUE', h1Html: '6 plays · 3 anti-plays · <em>regulator-aware</em>', subtitleHtml: '<strong>CS is where AI is most visible to customers — and most visibly disappointing when wrong. Air Canada · NYC MyCity · Klarna.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'AI for volume · <em>humans for value</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Teams that get this right', ['AI scales volume work — basic inquiries · status · simple triage. <strong>Humans handle value moments — distressed customers · complex issues · relationship matters.</strong>'], 'The discipline is knowing which is which.') }] },
  { type: 'content', eyebrow: '6 plays that ship', icon: '2', headlineHtml: 'Assist · scoped bots · multilingual · KB · sentiment · QA · <em>voice</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'Agent assist', '', 'AI as agent\'s sidekick. <strong>Drafts · surfaces knowledge · summarises. Agent decides.</strong>', 'green')}
${cell('P2', 'Scoped deflection bots', '', 'Narrow-scope, high-frequency, low-stakes. Strong escalation to humans.', 'green')}
${cell('P3', 'Multilingual support', '', 'Real-time translation · multilingual KB. Critical for global + inclusive service.', 'green')}
${cell('P4', 'Sentiment + escalation', '', 'AI surfaces frustrated or churn-risk customers. Routes to senior agents.', 'green')}
${cell('P5', 'QA at scale', '', 'AI samples + scores agent interactions. Surfaces coaching opportunities.', 'green')}
${cell('P6', 'Voice support', '', 'Assist for call centres. Real-time prompting. Post-call summarisation.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-plays', icon: '!', iconRed: true, headlineHtml: 'Full-bot replace · weak-grounding · <em>gate-keeping</em>',
    blocks: [{ atStep: 1, html: cardRed('3 CS-AI ANTI-PLAYS', 'Public failure patterns', ['<strong>1. Full-bot replacement.</strong> Sounds attractive in budget meetings. Loses LTV within months. Klarna reversed publicly.', '<strong>2. Chatbots without grounding.</strong> Air Canada Moffatt + NYC MyCity. Liability waiting.', '<strong>3. Gate-keeping access to humans.</strong> Customers leave · sue · post the screenshot. All damage the brand.']) }] },
  { type: 'content', eyebrow: 'What this course covers', icon: '→', headlineHtml: '6 plays · adoption · <em>roadmap</em>',
    blocks: [
      { atStep: 1, html: card('STRUCTURE', '8 chapters', ['Ch 2 — assist vs bots · Ch 3 — multilingual + accessibility · Ch 4 — KB grounding · Ch 5 — sentiment + escalation · Ch 6 — QA · Ch 7 — voice · Ch 8 — adoption + roadmap.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one play your contact centre is most actively pursuing', ['Next 7 chapters give CX-leader\'s discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Agent assist vs full bots · <em>deployment patterns</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'AI for volume · 6 plays · 3 anti-plays.', '<strong>Next:</strong> the deployment spectrum · where assist works · where scoped bots work · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Agent assist vs full bots' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-assist-vs-bots.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · DEPLOYMENT PATTERNS', h1Html: 'Spectrum · 4 modes · <em>where each fits</em>', subtitleHtml: '<strong>Mature orgs use AI-augmented agent as baseline + hybrid bots for narrow high-volume use cases. Fully autonomous reserved for very specific scenarios.</strong>' },
  { type: 'content', eyebrow: 'The deployment spectrum', icon: '1', headlineHtml: 'Manual → augmented → hybrid → <em>autonomous</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('M1', 'Fully manual', '', 'Every interaction human. Slow. Personal. High cost.')}
${cell('M2', 'AI-augmented agent', '', 'Human in seat. AI drafts · surfaces · summarises. <strong>Agent decides.</strong>', 'green')}
${cell('M3', 'Hybrid bot + escalation', '', 'Bot for narrow scope. Escalates everything else to humans.', 'green')}
${cell('M4', 'Fully autonomous', '', 'Bot end-to-end. <strong>Where Air Canada Moffatt lives.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Where agent assist works', icon: '2', headlineHtml: 'Most CS interactions · <em>20-40% productivity gain</em>',
    blocks: [{ atStep: 1, html: cardGreen('AI-AUGMENTED AGENT — THE BASELINE', 'Highest-confidence CS-AI deployment', ['AI sits beside agent. Drafts initial responses · surfaces KB · summarises history · suggests next-best-actions.', '<strong>Agent edits and sends.</strong> Customer never receives un-vetted AI output.'], '<strong>Lower regulatory risk. Lower brand risk. Real productivity gain — typically 20-40% on routine queries.</strong> Most CS orgs should establish this before any autonomous bots.') }] },
  { type: 'content', eyebrow: 'Where scoped bots work', icon: '3', headlineHtml: 'Narrow · high-volume · <em>low-stakes</em>',
    blocks: [{ atStep: 1, html: card('WHERE SCOPED BOTS WORK', 'Narrow · verifiable · escalating', ['<strong>Yes:</strong> order status · hours · store locations · return policy basics · simple refund eligibility.', '<strong>No:</strong> judgement-requiring · distressed customers · misinformation-liability scenarios.'], '<strong>Pattern:</strong> narrow scope · verifiable answers from authoritative sources · strong escalation. "Type human at any time."') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Productivity gain · <em>escalation time</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DEPLOYMENT PATTERN', '2 questions', ['<strong>Q1:</strong> AI-augmented agents productivity gain on routine queries? 20-40% green · single digits amber · <strong>negative red — AI creating overhead</strong>.', '<strong>Q2:</strong> scoped bots — escalation-to-human time when requested? <2 min green · 2-5 amber · <strong>>5 red — gating access</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Listen to 10 agent-handled calls/chats from this week', ['For each: what could AI have drafted that the agent edited? <strong>That count is the productivity opportunity.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Multilingual + accessibility · <em>lines AI cannot cross alone</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4-mode spectrum · where assist works · where scoped bots work · 2-question scoring.', '<strong>Next:</strong> 3 multilingual + accessibility use cases · the high-stakes line · community review for accessibility.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Multilingual + accessible support' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-multilingual.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · LINES AI CANNOT CROSS ALONE', h1Html: '3 use cases · <em>high-stakes human review</em>', subtitleHtml: '<strong>Often very good. Occasionally seriously wrong. Identify the line.</strong>' },
  { type: 'content', eyebrow: '3 multilingual + accessibility use cases', icon: '1', headlineHtml: 'Real-time translation · multilingual KB · <em>accessibility transformation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Real-time chat/email translation', '', 'Customer Spanish · agent English · bidirectional. <strong>Mature in 2026.</strong>', 'green')}
${cell('UC 2', 'Multilingual KB', '', 'Same article every language customers speak. AI translates + maintains. <strong>Far better than translator-per-language.</strong>', 'green')}
${cell('UC 3', 'Accessibility transformations', '', 'Plain language · screen-reader · sign-language via avatar. Multiplies reach without proportional cost.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The high-stakes line', icon: '!', iconRed: true, headlineHtml: 'Often very good · <em>occasionally seriously wrong</em>',
    blocks: [{ atStep: 1, html: cardRed('THE HIGH-STAKES LINE', 'High-stakes contexts have real consequences', ['Medical · legal rights · account suspension · dispute resolution. <strong>Translation errors → customer acts on wrong info · rights waived through mistranslation.</strong>'], '<strong>Low-stakes:</strong> general info · order status · hours · common Qs. <em>AI translation fine.</em><br /><strong>High-stakes:</strong> account closure · legal notices · dispute resolution · health-product issues · rights/money beyond typical purchase. <em>Human translator or bilingual-agent review required.</em>') }] },
  { type: 'content', eyebrow: 'Accessibility discipline', icon: '2', headlineHtml: 'Community review · <em>before broad deployment</em>',
    blocks: [{ atStep: 1, html: card('ACCESSIBILITY DISCIPLINE', 'Community knows what works', ['AI-generated accessible formats are real benefit. Plain-language summaries · alt text · screen-reader transformations.', '<strong>What works:</strong> partnership with accessibility advocates · AI output reviewed by community before production · iteration before scaling.', '<strong>What doesn\'t:</strong> auto-deploying AI accessibility based on internal review only. <em>People with disabilities will tell you what isn\'t working. Listen before scaling.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'High-stakes review · <em>community review</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE MULTILINGUAL + ACCESSIBILITY', '2 questions', ['<strong>Q1:</strong> high-stakes customer-facing translations — human/bilingual-agent review enforced? Yes for all green · most amber · <strong>no/inconsistent red</strong>.', '<strong>Q2:</strong> accessibility AI reviewed by community users before deployment? Yes green · internal only amber · no review red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sample 5 recent AI translations or accessibility outputs', ['Ask native speaker or community user to review. <strong>That sample tells you whether your discipline is in place.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'KB AI + grounding · <em>Air Canada Moffatt applied</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 use cases · high-stakes line · accessibility discipline · 2-question scoring.', '<strong>Next:</strong> why grounding matters in CS · 4 KB hygiene rules · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Knowledge base AI + grounding' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-kb-grounding.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · MATTERS IN CS SPECIFICALLY', h1Html: 'Air Canada Moffatt · <em>NYC MyCity</em>', subtitleHtml: '<strong>What the AI says is what your company has said. Without grounding, AI becomes liability waiting to happen.</strong>' },
  { type: 'content', eyebrow: 'Why grounding matters in CS', icon: '1', headlineHtml: 'AI = company representation · <em>Air Canada precedent</em>',
    blocks: [{ atStep: 1, html: card('WHY GROUNDING MATTERS IN CS SPECIFICALLY', 'Air Canada Moffatt + NYC MyCity', ['Customer service AI represents your company. <strong>What the AI says is what your company has said.</strong>', '<strong>Air Canada Moffatt (BC CRT · Feb 2024):</strong> chatbot misrepresented bereavement-fare policy → airline liable for the representation.', '<strong>NYC MyCity (2024):</strong> gave illegal advice to small business owners → public failure, service reduced.'], '<strong>Customer-facing AI without grounding = liability waiting to happen.</strong>') }] },
  { type: 'content', eyebrow: 'What grounding is', icon: '2', headlineHtml: 'Retrieve · then answer · <em>treat KB as a product</em>',
    blocks: [{ atStep: 1, html: card('WHAT GROUNDING IS — PRACTICALLY', 'Retrieve from authoritative source', ['AI does NOT draw answers from training data. <strong>Retrieves from your authoritative KB — current product docs · policies · pricing.</strong> Answers from retrieved context.', '<strong>Done well:</strong> hallucination on covered topics drops near zero.', '<strong>Done poorly:</strong> out-of-date KB · missing topics · weak retrieval → AI invents plausible alternatives.'], '<strong>The discipline:</strong> treat the KB as a product. Owner · update cadence · quality bar · coverage metrics. <em>Without KB discipline, no amount of AI quality saves you.</em>') }] },
  { type: 'content', eyebrow: '4 KB hygiene rules', icon: '3', headlineHtml: 'Single source · retire stale · measure coverage · <em>escalate uncertain</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('R1', 'Single source of truth per topic', '', 'Pricing in 5 places → 4 are wrong somewhere.', 'green')}
${cell('R2', 'Retire stale content actively', '', 'Outdated worse than missing. <strong>AI confidently quotes superseded policy.</strong>', 'green')}
${cell('R3', 'Measure coverage + gaps', '', '% of customer queries answerable from KB. <strong>Gaps = your hallucination risk.</strong>', 'green')}
${cell('R4', 'Escalate when uncertain', '', 'Retrieval finds nothing relevant → AI hands to human. Does not invent.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Citation rate · <em>uncertain handoff</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE KB + GROUNDING AI', '2 questions', ['<strong>Q1:</strong> sample last week\'s AI responses — % citing actual current KB article? >90% green · 75-90% amber · <strong><75% red — significant hallucination risk</strong>.', '<strong>Q2:</strong> retrieval finds nothing relevant — AI hands to human or answers anyway? Hand green · <strong>answer anyway red — next Air Canada Moffatt scenario loaded</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick 10 random customer-facing AI responses from last week', ['Verify each against current KB. <strong>% accurate, current, properly sourced = grounding discipline indicator.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Sentiment + 5 escalation triggers · <em>where humans take over</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Air Canada precedent · what grounding is · 4 KB hygiene rules · 2-question scoring.', '<strong>Next:</strong> 5 escalation triggers · warm-handoff design · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Sentiment + 5 escalation triggers' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-sentiment.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · HUMANS FOR VALUE MOMENTS', h1Html: '5 triggers · <em>warm-handoff design</em>', subtitleHtml: '<strong>Sentiment-aware AI surfaces value moments. Routes to humans with full context.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'AI for volume · <em>humans for value moments</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'When the relationship matters more than the answer', ['Frustrated · distressed · high-stakes-request customers need a human. <strong>Not because AI cannot answer them — but because the relationship moment matters more.</strong>'], '<strong>Sentiment-aware AI escalation</strong> makes this work at scale. AI watches every interaction · surfaces value moments · routes to humans with full context.') }] },
  { type: 'content', eyebrow: '5 escalation triggers', icon: '2', headlineHtml: 'Declining sentiment · explicit request · high-stakes · <em>repeated failure · vulnerable</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Declining sentiment', '', 'Customer getting more frustrated. <strong>Gallup: declining CX = #1 churn predictor.</strong> Escalate before conversation breaks.', 'amber')}
${cell('T2', 'Explicit human request', '', '"I want a person." <strong>Honour immediately.</strong> No "let me try" loops.', 'green')}
${cell('T3', 'High-stakes intent', '', 'Account closure · billing dispute · service termination. Consequences beyond routine.', 'amber')}
${cell('T4', 'Repeated failure to resolve', '', 'AI tried twice · customer still asking same Q. <strong>Wrong tool for this customer-issue combo.</strong>', 'amber')}
${cell('T5', 'Vulnerable customer signals', '', 'Distress · financial hardship · health · accessibility needs. <strong>Senior human agent. Not the bot.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Warm-handoff design', icon: '3', headlineHtml: 'Human inherits context · <em>not "start over"</em>',
    blocks: [{ atStep: 1, html: cardGreen('THE WARM-HANDOFF DESIGN', 'Pattern that works', ['Human inherits customer history · AI attempts · inferred intent · escalation trigger. <strong>One screen.</strong>', 'Customer experiences continuity. Handoff feels coordinated, not bureaucratic.'], '<strong>What doesn\'t work:</strong> cold handoff — customer starts over with human. <em>Second-most-cited CX complaint in industry research.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Pre-break escalation · <em>full-context handoff</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SENTIMENT + ESCALATION', '2 questions', ['<strong>Q1:</strong> high-frustration signals last week — AI surfaced and escalated before conversation broke down? Most yes green · some yes amber · most missed red.', '<strong>Q2:</strong> human handoff — full conversation context or customer starts over? Full context green · partial amber · <strong>start over red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last week\'s AI-to-human escalations', ['Look at each escalation moment. <strong>Before customer was frustrated or after? Before = system working. After = sentiment detection lagging.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Quality assurance · <em>shadow QA + 5 metrics + coaching loop</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Principle · 5 triggers · warm-handoff design · 2-question scoring.', '<strong>Next:</strong> what AI changes for QA · 5 metrics that matter · the weekly 2-2-2 coaching loop.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Quality assurance' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-qa.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · FROM REACTIVE TO SYSTEMIC', h1Html: '5 metrics · <em>weekly 2-2-2 coaching</em>', subtitleHtml: '<strong>Traditional QA samples 1-3%. AI-augmented QA samples 100%. Changes the conversation from "we caught this one" to "across all, here\'s the pattern."</strong>' },
  { type: 'content', eyebrow: 'What AI changes for QA', icon: '1', headlineHtml: '1-3% sampling → <em>100% sampling</em>',
    blocks: [{ atStep: 1, html: card('WHAT AI CHANGES FOR CS QA', '100% sampling becomes possible', ['Traditional QA: 1-3% sampled for human review. <strong>Bias toward escalated issues. Most interactions get no review.</strong>', 'AI-augmented QA: 100% sampled and scored. Humans review AI-flagged outliers + random sample.'], '<strong>Changes the conversation:</strong> from "we caught this one" to "across all interactions, here\'s the pattern." From reactive to systemic.') }] },
  { type: 'content', eyebrow: '5 CS quality metrics that matter', icon: '2', headlineHtml: 'FCR · AHT · CES · escalation appropriateness · <em>knowledge use</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1', 'First contact resolution', '', 'Resolved in first interaction? <strong>Single most predictive CSAT metric.</strong>', 'green')}
${cell('M2', 'Average handle time', '', 'Total time to resolution. Balanced against quality. Fast-but-unresolved isn\'t better.')}
${cell('M3', 'Customer effort score', '', 'How hard did customer work for resolution? <strong>Forrester ranks above CSAT for loyalty prediction.</strong>', 'green')}
${cell('M4', 'Escalation appropriateness', '', 'Did escalations happen when they should? Any missed?')}
${cell('M5', 'Knowledge use rate', '', '% of agent responses using current KB. Low = KB gap or agent training gap.')}
</div>` }] },
  { type: 'content', eyebrow: 'The coaching loop', icon: '3', headlineHtml: 'Weekly 2-2-2 · <em>ramp time drops 30-50%</em>',
    blocks: [{ atStep: 1, html: cardGreen('THE COACHING LOOP — WHERE QA PRODUCES VALUE', 'Behaviour change happens here', ['QA scores tell you what is happening. <strong>Coaching is what changes behaviour.</strong>', '<strong>Pattern:</strong> weekly 1:1 with each agent. <strong>2 min reviewing specific AI-flagged interaction · 2 min coaching specific behaviour · 2 min commitment for next week.</strong>', 'AI surfaces what to coach on. Supervisor coaches.'], '<strong>New-agent ramp time drops 30-50%</strong> when this loop runs with discipline. Multiple industry reports consistent.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'QA coverage · <em>weekly coaching cadence</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CS QA DISCIPLINE', '2 questions', ['<strong>Q1:</strong> % of interactions QA-scored (even at AI level)? >90% green · 50-90% amber · <strong><50% red — large blind spots</strong>.', '<strong>Q2:</strong> each agent gets weekly coaching anchored on specific AI-surfaced interaction? Yes green · monthly amber · <strong>no/sporadic red — loop not installed</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last week\'s QA for strongest + weakest agent · look at patterns', ['Where do they differ? <strong>That\'s your coaching content for next week.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Voice support AI · <em>latency · assist patterns · regulatory</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '100% sampling possible · 5 metrics · weekly 2-2-2 coaching · 2-question scoring.', '<strong>Next:</strong> why voice is harder · 2 voice patterns · disclosure + consent.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Voice support AI' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-voice.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · VOICE IS HARDER', h1Html: 'Sub-second latency · 2 patterns · <em>disclosure + consent</em>', subtitleHtml: '<strong>Most mature CS orgs use assist pattern for the majority + autonomous for narrow scope.</strong>' },
  { type: 'content', eyebrow: 'Why voice is harder than chat', icon: '1', headlineHtml: 'Latency · errors · tone · <em>regulatory</em>',
    blocks: [{ atStep: 1, html: card('WHY VOICE AI IS HARDER', '4 dimensions', ['<strong>Latency:</strong> people expect <1s response. 3s feels broken.', '<strong>Errors:</strong> STT + model + TTS each have error rates. Multiplied → noticeable problems.', '<strong>Tone:</strong> matters more in voice than chat. Same TTS handling billing dispute vs product Q lands differently.', '<strong>Regulatory:</strong> disclosure of AI nature + consent to record + automated-system rules.']) }] },
  { type: 'content', eyebrow: '2 voice patterns', icon: '2', headlineHtml: 'Assist · <em>autonomous for narrow scope</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('P1', 'Assist', '', 'Human agent on call. AI prompts real-time. Surfaces KB · drafts language · catches compliance issues. <strong>Customer interacts with human. Agent gets AI superpowers.</strong>', 'green')}
${cell('P2', 'Autonomous narrow scope', '', 'AI handles end-to-end. <strong>Narrow scope only</strong> — status · hours · simple booking. Strong escalation. Sub-second latency.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Disclosure + consent', icon: '!', iconRed: true, headlineHtml: 'EU AI Act Art 50 · <em>US state patchwork · recording consent</em>',
    blocks: [{ atStep: 1, html: cardRed('DISCLOSURE + CONSENT', 'Regulatory boundaries', ['<strong>EU AI Act Article 50:</strong> customer-facing AI interactions require disclosure.', '<strong>US states:</strong> increasing patchwork — California · Illinois · Colorado · Texas all have provisions.', '<strong>Recording consent:</strong> many jurisdictions two-party consent. AI processing of voice usually = recording.'], '<strong>What works:</strong> clear disclosure at start. "You\'re talking to our AI assistant. For complex Qs or to talk to a person, say \'human\' anytime." Consent flow before recording. <strong>What doesn\'t:</strong> disclosure buried in ToS.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Acceptance rate · <em>disclosure + consent</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE VOICE AI', '2 questions', ['<strong>Q1:</strong> assist-pattern — agent acceptance rate of AI prompts? 60-80% green · <strong><40% red — agents don\'t trust system</strong>.', '<strong>Q2:</strong> autonomous voice — disclosure + consent flows current and tested? Yes green · stale amber · <strong>no red — regulatory failure loaded</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Listen to 1 autonomous voice AI call + 1 assist call from last week', ['Disclosure clear? Experience natural? Escalation works when needed? <strong>Those 3 questions = voice AI quality bar.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Adoption + roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Why voice harder · 2 patterns · disclosure + consent · 2-question scoring.', '<strong>Last chapter:</strong> adoption with frontline teams · 12-week rollout · 4 trust trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',adoption:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='cs-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var a=state.adoption||'_(pick adoption posture)_';var s=state.sponsor||'_(pick sponsor)_';return '# CS-AI · 12-Week Rollout Roadmap\\n\\n**VP CX / Chief Customer Officer:** ____________________\\n**Start date:** ____________________\\n\\n## Starting play\\n> '+p+'\\n\\n## Adoption posture\\n> '+a+'\\n\\n## Executive sponsor\\n> '+s+'\\n\\n## Weeks 1-4: Agent assist for tier-1 queries\\n- Foundation · lowest risk · highest agent adoption\\n- Drafts, KB surfaces, history summarisation\\n\\n## Weeks 5-8: Scoped deflection bot for top 3 queries\\n- Strong escalation paths · KB discipline · monitoring active\\n\\n## Weeks 9-12: Sentiment + escalation triggers\\n- QA loop running · coaching cadence established · voice assist piloted\\n\\n## 4 trust trip-wires (do not cross)\\n- Autonomous bots without strong grounding — Air Canada Moffatt + NYC MyCity\\n- AI gate-keeping access to humans — customers reach humans on reasonable request\\n- Voice AI without disclosure or consent — regulatory action loaded\\n- Full bot replacement of human support — Klarna lesson\\n\\n---\\nSource: Gennoor Academy · AI for Customer Service & Support\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your CS-AI rollout roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 12-WEEK ROLLOUT', h1Html: 'Adoption · 12 weeks · <em>4 trip-wires · the builder</em>', subtitleHtml: '<strong>Your agents are the users. If they trust AI, they use it. If not, productivity gain disappears.</strong>' },
  { type: 'content', eyebrow: 'Adoption with frontline teams · 3 moves', icon: '1', headlineHtml: 'Training · champions · <em>weekly feedback</em>',
    blocks: [{ atStep: 1, html: card('ADOPTION WITH FRONTLINE TEAMS', 'Where most CS-AI rollouts succeed or fail', ['<strong>Move 1:</strong> agent training before launch. Not 5-min video. Hands-on. Specific scenarios. <strong>1 day minimum per role.</strong>', '<strong>Move 2:</strong> 2-3 champions per team — power-user agents become in-team support. Diffuse literacy faster than vendor training.', '<strong>Move 3:</strong> listen to agent feedback weekly. Act on it visibly so agents know they\'re heard.']) }] },
  { type: 'content', eyebrow: '12-week rollout', icon: '2', headlineHtml: 'Weeks 1-4 · 5-8 · <em>9-12</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('W1-4', 'Agent assist tier-1', '', 'Foundation. Lowest risk. Highest agent adoption.', 'green')}
${cell('W5-8', 'Scoped deflection top-3', '', 'Strong escalation. KB discipline. Monitoring active.', 'amber')}
${cell('W9-12', 'Sentiment + escalation + voice', '', 'QA loop running. Coaching cadence established. Voice assist piloted.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Auto without grounding · gate-keeping · voice without disclosure · <em>full-bot replace</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Autonomous bots without grounding', '', 'Air Canada Moffatt · NYC MyCity. Next public failure loaded.', 'red')}
${cell('W2', 'AI gate-keeping access to humans', '', 'Customers reach humans on reasonable request. <strong>Always.</strong>', 'red')}
${cell('W3', 'Voice AI without disclosure/consent', '', 'Regulatory action + reputational damage compounding.', 'red')}
${cell('W4', 'Full bot replacement of humans', '', 'Klarna lesson. Year-1 saving < year-2 LTV loss.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · adoption · sponsor · <em>take to VP CX</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting play</h5><div class="preset" data-group="play">
<button data-val="Agent assist tier-1 — lowest risk, highest agent adoption">Agent assist</button>
<button data-val="Scoped deflection bot — top 3 high-volume queries · strong escalation">Scoped deflection bot</button>
<button data-val="Sentiment + escalation triggers — surface frustrated/at-risk customers">Sentiment + escalation</button>
<button data-val="Quality assurance at scale — 100% sampling + weekly 2-2-2 coaching">QA at scale</button>
</div></div>
<div class="group"><h5>Adoption posture</h5><div class="preset" data-group="adoption">
<button data-val="High-touch — 1-day hands-on training + champions network + weekly feedback loops">High-touch</button>
<button data-val="Balanced — half-day training + per-team champions + monthly listening">Balanced</button>
<button data-val="Light-touch — quick-start guide + on-demand support + quarterly review">Light-touch</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="Chief Customer Officer with VP CX delivery partnership">CCO + VP CX</button>
<button data-val="VP CX directly with COO budget partnership">VP CX</button>
<button data-val="Joint VP CX + CIO + COO oversight committee">Joint VP CX + CIO + COO</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my CS-AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># CS-AI · 12-Week Rollout Roadmap

Pick starting play, adoption posture, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'AI for volume · humans for value · 6 plays · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI for volume · humans for value · six CS plays — agent assist, scoped bots, multilingual, KB grounding, sentiment + escalation, quality assurance, voice · three anti-plays · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting play and adoption posture.</div><div class="row"><span class="arr">→</span>Get one VP CX or Chief Customer Officer conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 31 chapters 1-8 built.')
