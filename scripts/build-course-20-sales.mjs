// Build Course 20 chapter HTMLs — AI for Sales & Marketing (Andrew · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Revenue · AI for Sales & Marketing';
const OUT = 'tmp/academy-build/ai-for-sales-marketing/chapters';

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

emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The revenue-AI fit map' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-fit-map.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · AUGMENT, DON\'T REPLACE', h1Html: '6 plays that ship · <em>3 that disappoint</em>', subtitleHtml: 'Andy Grove · manager output = output of organisation under their influence. <strong>Same applies to revenue AI.</strong>' },
    { type: 'content', eyebrow: 'The principle · Andy Grove applied', icon: '1', headlineHtml: 'AI augments human judgement · <em>doesn\'t replace it</em>',
      blocks: [{ atStep: 1, html: card('ANDY GROVE · HIGH OUTPUT MANAGEMENT (1983)', 'Manager output = output of organisation under their influence', ['AI takes low-value drafting + pattern-matching off reps. <strong>Reps spend more time on high-judgement work — conversation, negotiation, close.</strong>'], 'Teams that get it wrong use AI to automate the high-judgement work too. <em>They lose it without realising.</em>') }] },
    { type: 'content', eyebrow: '6 plays that ship · the playbook', icon: '2', headlineHtml: 'Prospecting · scoring · proposals · <em>content · personalisation · call AI</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PLAY 1', 'Disciplined prospecting research', '', 'ICP refinement · pre-meeting research · signal triggers.', 'green')}
${cell('PLAY 2', 'Two-layer lead scoring', '', 'ML predictive + LLM signal extraction.', 'green')}
${cell('PLAY 3', 'CRM-grounded proposals', '', '4-block template · 3 guardrails · claim register.', 'green')}
${cell('PLAY 4', 'Content with brand voice', '', 'Style guide as system prompt · 2 human edits · fingerprint audit.', 'green')}
${cell('PLAY 5', 'Personalisation with the line drawn', '', '3 tiers · 3 creepy-line categories you don\'t cross.', 'green')}
${cell('PLAY 6', 'Call AI + coaching loop', '', '4 extractions · weekly 2-2-2 coaching · ramp time drops 30-50%.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: '3 plays that disappoint · cut these', icon: '!', iconRed: true, headlineHtml: 'AI cold outreach · agent close · <em>price optimisation</em>',
      blocks: [{ atStep: 1, html: cardRed('3 PLAYS THAT DISAPPOINT', 'Don\'t build these', ['<strong>One — fully automated AI cold outreach.</strong> Economics collapsed 2024. Google/Yahoo Feb 1 2024 rules.', '<strong>Two — AI agents that close deals without humans.</strong> Vendor pitch only. No durable production proof.', '<strong>Three — AI deal-level price optimisation.</strong> Works in airline yield. Doesn\'t in B2B sales.']) }] },
    { type: 'content', eyebrow: 'The test · 3 questions', icon: '?', headlineHtml: 'Time to think · grounded · <em>experience improves</em>',
      blocks: [
        { atStep: 1, html: card('THE AUGMENT-DON\'T-REPLACE TEST', '3 questions for any revenue AI initiative', ['<strong>Q1:</strong> does this give the rep more time to think — or replace the thinking?', '<strong>Q2:</strong> is the AI grounded in real customer data — or generating from priors?', '<strong>Q3:</strong> does customer experience improve — or degrade?'], 'All three yes-grounded-improves → ship. <em>Any one no → kill it. Reinvest budget.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Apply the 3 questions to your current AI pilots', ['<strong>The ones that pass — invest more.</strong> The ones that don\'t — kill them. Reinvest into the ones that work.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'AI in prospecting · <em>the Feb 2024 collapse</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Augment-don\'t-replace · 6 plays ship · 3 disappoint · 3 questions test.', '<strong>Next:</strong> ICP refinement · pre-meeting research · signal triggers · the AI-spam math (2.5% → 0.4%) · Google + Yahoo bulk-sender rules.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'AI in prospecting' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-prospecting.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · THE FEB 2024 COLLAPSE', h1Html: '2.5% → 0.4% · <em>Google + Yahoo bulk-sender rules</em>', subtitleHtml: 'AI-spam pattern collapsed deliverability. <strong>Three uses that work · the disciplined workflow.</strong>' },
    { type: 'content', eyebrow: '3 uses that work', icon: '1', headlineHtml: 'ICP refinement · pre-meeting · <em>signal triggers</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('USE 1', 'ICP refinement', '', 'Feed closed-won + closed-lost · ask for pattern differences · hypotheses on firmographic + technographic + behavioural signals. Test next quarter.', 'green')}
${cell('USE 2', 'Pre-meeting research', '', '20 min of analyst-grade research per account in 2 min. Funding · leadership changes · launches · strategic priorities. Rep walks in informed.', 'green')}
${cell('USE 3', 'Signal-based triggers', '', 'AI scans LinkedIn + news + earnings for buying signals · prioritised daily list for the rep.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'The AI-spam math · the collapse', icon: '!', iconRed: true, headlineHtml: 'SPF/DKIM/DMARC · spam under 0.3% · <em>one-click unsubscribe</em>',
      blocks: [{ atStep: 1, html: cardRed('GOOGLE + YAHOO · FEB 1 2024 BULK-SENDER REQUIREMENTS', 'AI-spam pattern violates all three filters', ['Authenticated sending (SPF/DKIM/DMARC) · one-click unsubscribe · spam rate under 0.3%.', '<strong>Reply rates: 2.5% mid-2023 → 0.4% mid-2025</strong> for AI-spam-pattern outbound.'], 'AI-generated mass outreach generates spam reports → reduces deliverability → reduces reply rates further. <em>Flywheel in reverse.</em>') }] },
    { type: 'content', eyebrow: 'Disciplined workflow · 4 steps', icon: '2', headlineHtml: 'ICP target · research · relevant · <em>multichannel cadence</em>',
      blocks: [{ atStep: 1, html: card('THE DISCIPLINED PROSPECTING WORKFLOW', '4 steps · quality over volume', ['<strong>Step 1:</strong> ICP-refined target list. 100 high-fit beats 1000 low-fit.', '<strong>Step 2:</strong> pre-meeting research per account. AI does analyst work · rep adds judgement.', '<strong>Step 3:</strong> relevant outreach. Reference research. If it could go to anyone, don\'t send.', '<strong>Step 4:</strong> multichannel cadence. Email + LinkedIn + phone + video. Spaced. Personalised. Patient.']) }] },
    { type: 'content', eyebrow: 'What not to do · 3 patterns', icon: '✗', iconRed: true, headlineHtml: 'No volume · no token spam · <em>no skip-the-review</em>',
      blocks: [
        { atStep: 1, html: cardRed('WHAT NOT TO DO', '3 patterns that broke 2024-25', ['<strong>Don\'t generate volume with AI.</strong> Economics broke. Don\'t pretend otherwise.', '<strong>Don\'t use generic personalisation tokens.</strong> "I noticed you work at X" — every recipient knows it\'s templated. Worse than nothing.', '<strong>Don\'t skip human review.</strong> Mata + Air Canada cross-domain — AI outputs you send are your liability.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter\'s outbound reply rate', ['If below 1% — AI-spam pattern is the cause. <strong>Run the disciplined workflow on 10 high-fit accounts for one week. Compare.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Lead scoring · 2 layers · <em>GDPR Art 22 boundary</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 uses that work · the Feb 2024 collapse · disciplined 4-step workflow.', '<strong>Next:</strong> ML predictive + LLM signal extraction · the 6-check data quality gate · GDPR Article 22 human-in-the-loop · the buried-pipeline Band 3.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 255.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Lead scoring with AI' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-lead-scoring.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · 2 LAYERS', h1Html: 'ML predictive · LLM signal · <em>GDPR Art 22</em>', subtitleHtml: 'The hard boundary on automated decisions with significant effects. <strong>AI scores. Human decides.</strong>' },
    { type: 'content', eyebrow: '2 layers · richer than either alone', icon: '1', headlineHtml: 'ML baseline · <em>LLM texture</em>',
      blocks: [{ atStep: 1, html: card('THE TWO-LAYER SCORING MODEL', 'Predictive baseline + signal texture', ['<strong>Layer 1 — ML predictive.</strong> Trained on closed-won + closed-lost. Probability-of-close per lead.', '<strong>Layer 2 — LLM signal extraction.</strong> Reads emails, notes, call transcripts. Extracts competitive pressure, budget timing, decision-maker shifts.']) }] },
    { type: 'content', eyebrow: 'The 6-check data quality gate', icon: '2', headlineHtml: 'Accuracy · volume · completeness · <em>freshness · bias · leakage</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('CHECK 1', 'Win-loss data accuracy', '', 'If reps mark lost-no-decision for everything → garbage training data.', 'amber')}
${cell('CHECK 2', 'Volume', '', '<200 closed deals → model overfits. Don\'t train.', 'amber')}
${cell('CHECK 3', 'Engagement completeness', '', 'Sparse engagement data → model can\'t separate hot from cold.', 'amber')}
${cell('CHECK 4', 'Firmographic freshness', '', 'Stale company data degrades the model. Refresh quarterly.', 'amber')}
${cell('CHECK 5', 'Bias audit', '', 'Geographic, segment, industry. Bloomberg + Wilson-Caliskan cross-domain — AI inherits training bias.', 'amber')}
${cell('CHECK 6', 'Leakage prevention', '', 'No post-close attributes. Train on data you\'d have at decision time.', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'GDPR Article 22 · the hard boundary', icon: '!', iconRed: true, headlineHtml: 'No solely-automated decisions · <em>with significant effects</em>',
      blocks: [{ atStep: 1, html: cardRed('GDPR ARTICLE 22 · THE HARD LINE', 'No solely-automated decisions with legal or similarly significant effects', ['If your score determines contact / quote / pricing eligibility → may trigger Article 22.', '<strong>Answer: human-in-the-loop.</strong> AI scores. Rep reviews. Rep decides on contact + engagement.'], 'Don\'t let AI auto-suppress leads · auto-deprioritise individuals · auto-gate product or pricing. <em>Those decisions need a human.</em>') }] },
    { type: 'content', eyebrow: '3-band score-to-action split', icon: '3', headlineHtml: 'High-high · high-low · <em>low-high (buried pipeline)</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('BAND 1', 'High score · high engagement', '', 'SDR contact within 4 hours. Aggressive cadence.', 'green')}
${cell('BAND 2', 'High score · low engagement', '', 'Marketing nurture · reactivation campaigns · quarterly SDR check-in.')}
${cell('BAND 3', 'Low score · high engagement', '', '<strong>The buried pipeline.</strong> Most teams miss it. Visits pricing page 3x in a month · score says not-ICP, behaviour says interested. Converts 3-5x expected rate.', 'green')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull your lead scoring output · find Band 3', ['Low score + high engagement. <strong>If your team isn\'t acting on this band — that\'s the highest-ROI conversation you can have this week.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Proposal generation · <em>Mata + Air Canada applied</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '2 layers · 6-check gate · Article 22 boundary · 3 bands with the buried Band 3.', '<strong>Next:</strong> 4-block proposal template · 3 guardrails (CRM grounding · claim register · legal-review gate) · what the Mata and Air Canada rulings mean for your collateral.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Proposal + outreach generation' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-proposals.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · 4 BLOCKS · 3 GUARDRAILS', h1Html: 'Situation · proposing · outcome · <em>commercials</em>', subtitleHtml: 'AI heavy-drafts blocks 1-3. <strong>Rep enters block 4 and reviews all four. Mata + Air Canada applied.</strong>' },
    { type: 'content', eyebrow: '4-block proposal template', icon: '1', headlineHtml: 'AI on 1-3 · <em>rep on 4 · reviews all</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('BLOCK 1', 'Situation', '', 'Their words · their priorities · grounded in CRM discovery notes. AI drafts · rep verifies factually.', 'green')}
${cell('BLOCK 2', 'What we\'re proposing', '', 'Specific scope tied to situation. AI drafts against solution catalogue.', 'green')}
${cell('BLOCK 3', 'Outcome', '', 'Business case · numbers calibrated to their environment. AI drafts against verified references.', 'green')}
${cell('BLOCK 4', 'Commercials', '', 'Price, terms, timeline. <strong>Rep enters. AI does not generate.</strong>', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'Guardrail 1 · CRM grounding', icon: '2', headlineHtml: 'Every customer-specific claim · <em>references a CRM note</em>',
      blocks: [{ atStep: 1, html: card('GUARDRAIL 1 · CRM GROUNDING', 'No invented quotes, requirements, priorities', ['Every customer-specific claim in the proposal references a CRM note or document.', '<strong>If AI generates "you mentioned X" — that mention has to be in CRM. Or it gets cut.</strong>']) }] },
    { type: 'content', eyebrow: 'Guardrail 2 · claim register', icon: '3', headlineHtml: 'Approved claims · <em>backed by data · in writing</em>',
      blocks: [{ atStep: 1, html: card('GUARDRAIL 2 · THE CLAIM REGISTER', 'Maintain a register of approved claims your team can make in writing', ['"We reduce time-to-onboard by 40%" — only if it\'s in the register, backed by data.', '<strong>If AI generates a claim not in the register — that claim gets cut.</strong>'], '<strong>Mata cross-domain · Schwartz let ChatGPT invent 6 case citations · the court sanctioned him.</strong> Don\'t let AI invent customer outcomes, percentages, references, certifications.') }] },
    { type: 'content', eyebrow: 'Guardrail 3 · legal-review gate', icon: '!', iconRed: true, headlineHtml: 'New claims · new commitments · <em>through legal first</em>',
      blocks: [
        { atStep: 1, html: cardRed('GUARDRAIL 3 · LEGAL-REVIEW GATE', 'Any new claim · new commitment · new language → legal review before register', ['Once in the register · fair game for AI to use.'], '<strong>Air Canada cross-domain · BC CRT Feb 2024 · chatbot misrepresented bereavement-fare policy · company liable.</strong> Anything AI says about timeline, pricing, support, SLA = what your company is saying. <em>Treat it accordingly.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Build or audit your claim register', ['No register → that\'s your first deliverable. <strong>Have one → check the last 5 AI-generated proposals against it. Find one claim outside the register. Fix it.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Content at scale · <em>brand voice anchored</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 blocks · 3 guardrails · Mata + Air Canada applied to your collateral.', '<strong>Next:</strong> style guide as system prompt · 2 human edits · quarterly fingerprint audit · 4 brand risks · EU AI Act Art 50 if customer-facing.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 125.0, slide: 4 }, { at: 135.0, slide: 4, step: 1 },
    { at: 185.0, slide: 5 }, { at: 195.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Content production at scale' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-content.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · ON BRAND AT SCALE', h1Html: '3 components · 4 risks · <em>3-stage pipeline</em>', subtitleHtml: '<strong>Style guide as system prompt + 2 human edits + quarterly fingerprint audit.</strong>' },
    { type: 'content', eyebrow: 'Brand voice anchor · 3 components', icon: '1', headlineHtml: 'System prompt · 2 edits · <em>fingerprint audit</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('COMPONENT 1', 'Style guide as system prompt', '', 'Tone, words to use, words to avoid, sentence rhythm, formality. Loaded into every prompt. 2 pages. Specific.', 'green')}
${cell('COMPONENT 2', '2 human edits per piece', '', 'Not zero. Not one. <strong>First editor catches facts + voice. Second reads as audience.</strong>', 'green')}
${cell('COMPONENT 3', 'Quarterly fingerprint audit', '', 'Random sample · compare against pre-AI baseline. Drift toward generic → tighten system prompt.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: '4 brand risks AI introduces', icon: '!', iconRed: true, headlineHtml: 'Flattening · factual · tonal · <em>cross-channel uniformity</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('RISK 1', 'Flattening', '', 'AI trends toward median. Distinctive voice erodes. <strong>Detected by fingerprint audit.</strong>', 'red')}
${cell('RISK 2', 'Factual error', '', 'Invented statistics, references, customer names. <strong>Mitigated by claim register.</strong>', 'red')}
${cell('RISK 3', 'Tonal mismatch', '', 'AI doesn\'t know the audience. <strong>Mitigated by audience-aware prompts + 2nd edit.</strong>', 'red')}
${cell('RISK 4', 'Cross-channel uniformity', '', 'Same tool drafting blog + social + email = homogenised brand. <strong>Mitigated by channel-specific prompts.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: '3-stage pipeline', icon: '2', headlineHtml: 'AI drafts · editor 1 · <em>editor 2 as audience</em>',
      blocks: [{ atStep: 1, html: card('3-STAGE CONTENT PIPELINE', '2 humans per piece · scale without flattening', ['<strong>Stage 1:</strong> AI drafts · style-guided · audience-aware · channel-specific.', '<strong>Stage 2:</strong> first editor catches facts + brand voice.', '<strong>Stage 3:</strong> second editor reads as the audience. Does this land? Would the recipient act?']) }] },
    { type: 'content', eyebrow: 'EU AI Act Article 50 · transparency', icon: '!', iconRed: true, headlineHtml: 'Customer-facing AI content · <em>disclosure required</em>',
      blocks: [
        { atStep: 1, html: cardRed('EU AI ACT · ARTICLE 50', 'Customer-facing AI content must be marked or made clear', ['Customer-facing chatbots in EU → disclose AI nature. AI-generated marketing imagery in EU → disclose.', '<strong>Article 99 fines if violated.</strong>'], 'Don\'t let "AI content compliance failure" be the reason a launch gets stopped.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull 5 pieces of AI-drafted content from last month · read as recipient', ['Do they sound like your brand — or every other brand? <strong>If uncomfortable — your system prompt or editors aren\'t working hard enough. Tighten one this quarter.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Personalisation · 3 tiers · <em>the creepy line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 components · 4 risks · 3-stage pipeline · Art 50 transparency.', '<strong>Next:</strong> light/middle/deep tiers · 3 creepy-line categories you don\'t cross · GDPR + DPDPA + CCPA consent posture.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Personalisation that works' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-personalisation.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · THE CREEPY LINE', h1Html: '3 tiers · 3 lines · <em>3 jurisdictions</em>', subtitleHtml: 'Relevant beats clever. <strong>Use the tier the relationship justifies. Stop where the data did not earn the right.</strong>' },
    { type: 'content', eyebrow: '3 tiers · match to relationship', icon: '1', headlineHtml: 'Light · middle · <em>deep</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('TIER 1', 'Light · public data', '', 'Name, company, industry, role. <strong>No consent friction. Universal acceptance.</strong>')}
${cell('TIER 2', 'Middle · first-party', '', 'Site activity, downloads, event attendance. They gave you knowingly. Consent in privacy policy.', 'green')}
${cell('TIER 3', 'Deep · cross-source + intent', '', '<strong>Powerful when done right · crosses the line when done wrong.</strong> Only for the active relationship.', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: '3 creepy-line categories · don\'t cross', icon: '!', iconRed: true, headlineHtml: 'Distress · surveillance · <em>inferred protected</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('LINE 1', 'Health · financial distress · family events', '', 'AI may detect from behaviour. <strong>Don\'t reference.</strong> "I noticed you\'ve been searching debt consolidation" — textbook cross.', 'red')}
${cell('LINE 2', 'Surveillance detail', '', '"I noticed you opened at 3:47 AM." <strong>Even if true — don\'t reference.</strong> Signals surveillance, not relationship.', 'red')}
${cell('LINE 3', 'Inferred protected characteristics', '', 'AI inferring age, gender, ethnicity, religion, sexuality. <strong>Bloomberg + Wilson-Caliskan cross-domain — AI inherits bias.</strong> One regulator letter away.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Consent regime · 3 jurisdictions', icon: '2', headlineHtml: 'GDPR · DPDPA · <em>CCPA</em>',
      blocks: [{ atStep: 1, html: card('CONSENT REGIME · COMBINED POSTURE', '3 rules across GDPR + DPDPA + CCPA', ['<strong>GDPR Art 7:</strong> explicit consent · granular by purpose · easy to withdraw. <strong>Art 22:</strong> on automated decisions.', '<strong>India DPDPA 2023:</strong> consent before processing sensitive data · data-fiduciary obligations.', '<strong>CCPA (California):</strong> opt-out for sale and share · extra protections on sensitive PII.'], '<strong>Granular consent at collection · single-click withdrawal · no selling without explicit opt-in.</strong> Can\'t honour all three → don\'t run tier-3.') }] },
    { type: 'content', eyebrow: 'What works · 3 patterns', icon: '✓', headlineHtml: 'Tier 2 default · tier 3 only active · <em>disclosure builds trust</em>',
      blocks: [
        { atStep: 1, html: cardGreen('WHAT WORKS PRACTICALLY', '3 patterns that scale', ['<strong>Pattern 1:</strong> tier 2 as the default. Boring choice. Scaling choice.', '<strong>Pattern 2:</strong> tier 3 only for active relationship · existing customer with active conversation · ABM for stage-3 opportunities.', '<strong>Pattern 3:</strong> disclosure builds trust. "We use your activity data to make outreach relevant — change preferences here." Transparent outperforms hidden. <em>Counterintuitive but the data is consistent.</em>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Audit your last personalised campaign · token by token', ['For each token — first-party? consented? value-adding? <strong>Any no on any of those → that\'s cleanup work this quarter.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Call AI · 4 extractions · <em>coaching loop</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 tiers · 3 creepy-lines · 3 jurisdictions · 3 patterns that work.', '<strong>Next:</strong> commitments / blockers / next steps / signals · the 2-2-2 weekly coaching loop · Tetlock applied to vendor productivity claims.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 65.0, slide: 3 }, { at: 75.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Call AI + conversation intelligence' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-call-ai.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · 4 EXTRACTIONS', h1Html: 'Commitments · blockers · next steps · <em>signals</em>', subtitleHtml: 'The coaching loop · 2-2-2 weekly. <strong>Ramp time drops 30-50% — when the discipline runs.</strong>' },
    { type: 'content', eyebrow: '4 extractions that matter', icon: '1', headlineHtml: 'What was said · what blocks · <em>what next · what was left unsaid</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('EXTRACTION 1', 'Commitments', '', 'What did customer say they\'d do? What did rep say we\'d do? <strong>Deals get lost on uncaptured commitments.</strong>', 'green')}
${cell('EXTRACTION 2', 'Blockers', '', 'Budget · authority · need · timeline. <strong>Each becomes a workstream.</strong>', 'green')}
${cell('EXTRACTION 3', 'Next steps', '', 'Specifically · with a date. "Follow up next week" is not a next step. <strong>"Send security overview by Thursday, meeting Tuesday with CISO" is.</strong>', 'green')}
${cell('EXTRACTION 4', 'Signals', '', 'Competitive mentions · budget timing words · DM references. <strong>Texture the LLM extracts that SDR might miss.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'The coaching loop · 2-2-2 weekly', icon: '2', headlineHtml: 'Extract patterns · turn into training · <em>weekly review</em>',
      blocks: [{ atStep: 1, html: card('THE COACHING LOOP', 'Top quartile vs median · with weekly 2-2-2', ['<strong>Step 1:</strong> extract patterns across reps. Top-quartile vs median. What language do they use differently?', '<strong>Step 2:</strong> turn patterns into training. Specific examples from actual calls. "Here\'s top-quartile handling the budget objection at seconds 20-30."', '<strong>Step 3:</strong> managers coach against patterns. Weekly 1:1 · <strong>2 min call review · 2 min coaching · 2 min commitment for next week.</strong>'], '<strong>Output: new-rep ramp time drops 30-50%.</strong> Not vendor pitch — operational reality when the loop runs with discipline.') }] },
    { type: 'content', eyebrow: 'Tetlock applied · vendor claims', icon: '!', iconRed: true, headlineHtml: '50% more pipeline · 40% shorter · <em>30% higher win?</em>',
      blocks: [{ atStep: 1, html: cardRed('TETLOCK CALIBRATION ON VENDOR CLAIMS', 'Calibration matters more than confidence', ['Vendor decks claim 50% more pipeline · 40% shorter cycles · 30% higher win rates. <strong>Point estimates without confidence intervals.</strong>', 'What\'s verified in published research: call AI + coaching loop <strong>reduces new-rep ramp time</strong>. Other claims depend on adoption, rep behaviour change, management discipline. Not on the AI itself.'], 'Use vendor claims as starting hypotheses. <em>Your own measurement is the test.</em>') }] },
    { type: 'content', eyebrow: 'Honest 3-number measurement', icon: '3', headlineHtml: 'Ramp time · cadence · <em>self-reported value</em>',
      blocks: [
        { atStep: 1, html: card('THE HONEST 3-NUMBER MEASUREMENT', 'No vendor extrapolation', ['<strong>Number 1:</strong> new-rep ramp time, before vs after. Time-to-quota for new hires.', '<strong>Number 2:</strong> coaching cadence adherence. Below 70% adherence → gain doesn\'t materialise. <em>This is the actual lever.</em>', '<strong>Number 3:</strong> rep self-reported value, quarterly. If reps treat it as surveillance — it dies.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one call from this week · run through call AI', ['Do the 4 extractions show up clearly? Commitments / blockers / next steps / signals each named specifically? <strong>If not — your prompt template or your tool is the gap. Fix before scaling.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your roadmap · 3 phases · <em>4 trip-wires · the builder</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 extractions · 2-2-2 coaching · Tetlock applied · honest 3-number measurement.', '<strong>Last chapter:</strong> 3-phase rollout (pilot/scale/embed) · 4 trust trip-wires · interactive builder for your CRO conversation.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 90.0, slide: 3 }, { at: 100.0, slide: 3, step: 1 },
    { at: 165.0, slide: 4 }, { at: 175.0, slide: 4, step: 1 },
    { at: 225.0, slide: 5 }, { at: 235.0, slide: 5, step: 1 }, { at: 270.0, slide: 5, step: 2 },
    { at: 290.0, slide: 6 }, { at: 300.0, slide: 6, step: 1 }
  ]
});

const ch8BuilderInit = `
var builderInit=false;var state={plays:'',pilot:'',cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='sales-marketing-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.plays||'_(pick starting 2 plays)_';var pi=state.pilot||'_(pick pilot team)_';var m=state.cadence||'_(pick measurement cadence)_';return '# Sales + Marketing AI · Rollout Roadmap\\n\\n**CRO / VP Marketing / RevOps:** ____________________\\n**Start date:** ____________________\\n\\n## Starting plays (pilot 2)\\n> '+p+'\\n\\n## Pilot team\\n> '+pi+'\\n\\n## Measurement cadence\\n> '+m+'\\n\\n## Phase 1 · Pilot (weeks 1-12)\\n- 5-10 reps · 2 plays · measure adoption, time saved, quality\\n- Claim register built before any AI proposal external\\n- Disciplined prospecting workflow · no AI volume cold outreach\\n- Target: clear positive signal on time saved + quality by week 12\\n\\n## Phase 2 · Scale (months 4-6)\\n- Expand to full sales team or marketing function\\n- Add 3rd play (proposal generation or content production)\\n- Measure team-level pipeline impact\\n\\n## Phase 3 · Embed (months 7+)\\n- AI plays = default\\n- Performance conversations include AI fluency\\n- Coaching loop running weekly · maintained without RevOps carry\\n\\n## Trust trip-wires (do not cross)\\n- No AI-generated cold outreach at volume (Feb 2024 economics)\\n- Claim register before any AI proposal goes external (Mata + Air Canada)\\n- GDPR Article 22 human-in-the-loop for significant-effect scoring\\n- No creepy-line crosses on personalisation\\n\\n---\\nSource: Gennoor Academy · Revenue · AI for Sales & Marketing\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your sales+marketing AI roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 3 PHASES', h1Html: 'Pilot · scale · <em>embed</em>', subtitleHtml: '7 chapters · this one sequences them.' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Augment human judgement · <em>don\'t replace it</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Andy Grove · manager output = output of organisation under their influence', ['You\'re not buying AI to replace reps. <strong>You\'re buying AI to free reps for the work AI can\'t do.</strong>']) }] },
    { type: 'content', eyebrow: 'The 3-phase rollout', icon: '2', headlineHtml: 'P1 weeks 1-12 · P2 months 4-6 · <em>P3 months 7+</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PHASE 1 · WEEKS 1-12', 'Pilot', '', '2 plays from the 6 · disciplined prospecting + lead scoring is the standard pair · 5-10 reps · measure adoption, time saved, quality.')}
${cell('PHASE 2 · MONTHS 4-6', 'Scale', '', '1 full sales team or marketing function · add 3rd play (proposals or content) · measure team-level pipeline impact.', 'amber')}
${cell('PHASE 3 · MONTHS 7+', 'Embed', '', 'AI plays = default · perf conversations include AI fluency · coaching loop weekly · maintained without RevOps carry.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: '4 trust trip-wires · don\'t cross', icon: '!', iconRed: true, headlineHtml: 'No AI volume · claim register · <em>Art 22 · no creepy line</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No AI cold outreach at volume', '', 'Feb 2024 economics. Google + Yahoo bulk-sender rules. Don\'t pretend.', 'red')}
${cell('TRIP-WIRE 2', 'Claim register before any AI proposal external', '', 'Mata + Air Canada cross-domain. Every claim verified. No exceptions.', 'red')}
${cell('TRIP-WIRE 3', 'GDPR Article 22 human-in-the-loop', '', 'For lead scoring with significant effects on contact, pricing, suppression.', 'red')}
${cell('TRIP-WIRE 4', 'No creepy-line crosses', '', 'Health · distress · family · inferred protected. Off-limits regardless of data.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pick · download · <em>take to your CRO or VP Marketing</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting plays (pilot 2)</h5><div class="preset" data-group="plays">
<button data-val="Disciplined prospecting + Two-layer lead scoring">Prospecting + Scoring</button>
<button data-val="CRM-grounded proposals + Content with brand voice">Proposals + Content</button>
<button data-val="Call AI + coaching loop + Personalisation with tier-2 default">Call AI + Personalisation</button>
</div></div>
<div class="group"><h5>Pilot team</h5><div class="preset" data-group="pilot">
<button data-val="5-10 reps · single segment or geo · 12-week pilot">5-10 reps · single segment</button>
<button data-val="One full sales team · cross-functional with marketing · 12-week pilot">1 full team · cross-functional</button>
<button data-val="Marketing team only · content + lead scoring plays · 12-week pilot">Marketing only</button>
</div></div>
<div class="group"><h5>Measurement cadence</h5><div class="preset" data-group="cadence">
<button data-val="Weekly adoption + monthly time-saved + quarterly pipeline impact">Weekly + monthly + quarterly</button>
<button data-val="Monthly adoption only · with rep dashboards">Monthly only</button>
<button data-val="Quarterly review · deep dive per play">Quarterly deep-dive</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my sales + marketing AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Sales + Marketing AI · Rollout Roadmap

Pick starting plays, pilot team, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Augment-don\'t-replace · 6 plays ship · <em>3 don\'t · 4 trip-wires</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Augment-don\'t-replace as the principle · six plays that ship · three that disappoint · the disciplined prospecting workflow against the AI-spam pattern · two-layer lead scoring with the GDPR boundary · four-block proposals with three guardrails · content at scale with brand voice anchored · personalisation that stops at the creepy line · call AI with four extractions and the coaching loop that drops ramp time · pilot two plays · scale them · embed them · four trip-wires you don\'t cross.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your two starting plays.</div><div class="row"><span class="arr">→</span>Get one conversation with your CRO or VP Marketing on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 },
    { at: 225.0, slide: 6 }, { at: 235.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 20 chapters 1-8 built.');
