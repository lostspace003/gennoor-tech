// Build Course 8 chapter HTMLs (Ch2-Ch8) — AI for Legal & Compliance
import { emit } from './build-chapter-html.mjs';

const T = 'FUNCTION · AI FOR LEGAL & COMPLIANCE';
const courseTagline = 'Function · AI for Legal & Compliance';
const OUT = 'tmp/academy-build/ai-for-legal-compliance/chapters';

// Helper builders
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

// ============== Ch2 — The hallucination tax ==============
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'The hallucination tax' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-hallucination-tax.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · CHECK OR DIE', h1Html: 'Ungrounded legal AI = <em>malpractice</em>', subtitleHtml: 'Mata v. Avianca · Park v. Kim · Iovino · 100+ cases tracked by mid-2025. Stanford: <strong>17–34% hallucination</strong> even RAG-grounded.' },
    { type: 'content', eyebrow: 'The pivotal case · S.D.N.Y. Jun 22 2023', icon: '!', iconRed: true, headlineHtml: 'Mata v. Avianca · <em>$5,000 sanction + write to falsely-cited judges</em>',
      blocks: [{ atStep: 1, html: cardRed('MATA v. AVIANCA · 22-CV-1461 PKC · S.D.N.Y.', 'Steven Schwartz + Peter LoDuca submitted brief citing 6 federal cases. None existed.', ['All six fabricated by ChatGPT — fake opinions, fake docket numbers, fake reasoning.', 'Judge Kevin Castel — <strong>$5,000 sanction. Personal letters to each falsely-cited judge.</strong>'], 'Career-defining incident. Documented in legal trade press for 2+ years.') }] },
    { type: 'content', eyebrow: 'The precedent went higher · Jan 30 2024', icon: '!', iconRed: true, headlineHtml: 'Park v. Kim · <em>Second Circuit disciplinary referral</em>',
      blocks: [{ atStep: 1, html: cardRed('PARK v. KIM · 91 F.4th 610 · 2nd CIR. · JAN 2024', 'Appellate court found AI-fabricated case in brief — referred attorney to disciplinary committee', ['Iovino v. Michael Stapleton Associates · E.D. Va. · Jul 2024 — <strong>$1,500 sanction</strong>.', 'Damien Charlotin AI-hallucination tracker: <strong>100+ documented cases</strong> in US courts by mid-2025.', 'Bar associations now require disclosure when AI was used to draft.']) }] },
    { type: 'content', eyebrow: 'The data · Stanford RegLab Jan 2024', icon: '!', iconRed: true, headlineHtml: 'Even retrieval-grounded tools · <em>17–34% hallucinated</em>',
      blocks: [{ atStep: 1, html: cardRed('STANFORD HAI · "HALLUCINATING LAW" · JAN 2024', 'Top legal AI tools hallucinated 17–34% on benchmark queries — even RAG-grounded ones', ['One in three citations may be fabricated. You cannot tell which one without checking.', '<strong>Run 10 LLM-only research queries → 2 to 3 fabricated citations.</strong>']) }] },
    { type: 'content', eyebrow: 'The check-or-die rule', icon: '✓', headlineHtml: 'Every citation verified against primary source · <em>cited and verified, or cut</em>',
      blocks: [
        { atStep: 1, html: card('THE RULE', 'Verify every AI-generated citation', ['Westlaw, Lexis, court records — whatever your firm uses. <strong>No exceptions.</strong>', 'Associate drafting → associate verifies. Partner signs → partner has reviewed verification.'], 'Air Canada parallel: bot says it, you said it. Schwartz is responsible for every citation in his brief — including ChatGPT\'s.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Audit one citation per last 3 AI-assisted briefs', ['If you can\'t verify any one in 5 minutes against a primary source — <strong>quality control problem to fix before next filing.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Contract review · <em>the killer app done right</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'The cardinal rule of legal AI: <em>verify or cut.</em>', '<strong>Next:</strong> the killer app — contract review. Extract · compare · redline. Vals 80%+ accuracy on the right workflow.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

// ============== Ch3 — Contract review ==============
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Contract review' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-contract-review.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · THE KILLER APP', h1Html: 'Extract · compare · <em>redline</em>', subtitleHtml: '<strong>51% of corporate legal teams</strong> already use AI for contract review. Vals 2025: 80%+ accuracy. Augmentation — not replacement.' },
    { type: 'content', eyebrow: 'The 3 review modes · practice patterns', icon: '1', headlineHtml: 'Three modes · <em>every deployment fits in one or more</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('MODE 1', 'Extract', '', 'AI pulls clauses or data points: termination notice, liability cap, governing law. <strong>Output is structured</strong> — spreadsheet, CLM, diligence DB.')}
${cell('MODE 2', 'Compare', '', 'AI compares contract to playbook, prior counterparty contracts, market-standard. <strong>Output is delta</strong> — where does this MSA deviate.')}
${cell('MODE 3', 'Redline', '', 'AI proposes changes — move cap, add carve-out, insert definition. <strong>Output is suggested edits.</strong> Lawyer accepts/rejects/modifies.')}
</div>` }] },
    { type: 'content', eyebrow: 'Accuracy · Vals AI 2025 benchmark', icon: '2', headlineHtml: '80%+ on clauses · <em>force multiplier, not replacement</em>',
      blocks: [{ atStep: 1, html: card('VALS AI · LEGAL BENCHMARK 2025', 'Harvey, Vincent, CoCounsel — 80%+ accuracy on clause extraction', ['Spellbook tier on redline for mid-market work.', '<strong>80 of 100 clauses correctly identified. The other 20 need correction.</strong>', 'Junior associate manual: 8 hrs/contract. AI + associate-review: 2 hrs.']) }] },
    { type: 'content', eyebrow: 'The workflow · 4 steps', icon: '3', headlineHtml: '4 steps · <em>skip step 2, you skip the value</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('STEP 1', 'AI extracts / compares / redlines', '', 'Tool runs. Output ready.')}
${cell('STEP 2', 'Associate validates every line', '', '<strong>The line that kills this workflow if skipped.</strong>')}
${cell('STEP 3', 'Partner signs off on deviations', '', 'Substantive deviations escalate.')}
${cell('STEP 4', 'Second lawyer on high-stakes', '', 'Non-standard contracts get a second pair of eyes.')}
</div>` }] },
    { type: 'content', eyebrow: 'Pick the right contracts · scale gradually', icon: '4', headlineHtml: 'NDAs + standard MSAs first · <em>defer bet-the-firm</em>',
      blocks: [
        { atStep: 1, html: card('THE RIGHT CONTRACTS FOR AI', 'High volume · repeatable · low marginal risk', ['<strong>NDAs and standard MSAs first.</strong> Where AI compounds value fastest.', '<strong>Defer:</strong> bet-the-firm M&A definitive agreements, bespoke financing, anything where the firm earns its fee on nuance.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one standard contract type · run last 20 through AI extract', ['Time associate review vs. pure-human baseline. <strong>If saving isn\'t material at 20, tool/playbook needs tuning.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Privacy &amp; DPIA reviews · <em>EU AI Act Art. 27</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'AI on routine contracts is force multiplier. <em>Validation is non-negotiable.</em>', '<strong>Next:</strong> GDPR Art. 35 DPIA workflow · EU AI Act Art. 27 FRIA Aug 2 2026 · propose-and-confirm.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 220.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

// ============== Ch4 — Privacy & DPIA reviews ==============
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Privacy & DPIA reviews' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-privacy-dpia.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · COMPLIANCE AT SCALE', h1Html: 'GDPR DPIA · <em>EU AI Act FRIA · India DPDPA</em>', subtitleHtml: 'Every new AI deployment needs a privacy review. Doing them manually doesn\'t scale. <strong>AI generates the draft. The DPO validates.</strong>' },
    { type: 'content', eyebrow: 'GDPR Art. 35 · the DPIA workflow', icon: '1', headlineHtml: 'AI generates 3 of 4 sections · <em>DPO writes the fourth</em>',
      blocks: [{ atStep: 1, html: card('GDPR ART. 35 · DATA PROTECTION IMPACT ASSESSMENT', 'Required for high-risk processing', ['<strong>Trigger:</strong> AI deployments, biometric processing, large-scale monitoring, profiling.', 'Structure: description · necessity/proportionality · risks · mitigations.', '<strong>AI generates first three.</strong> DPO validates and writes mitigations.']) }] },
    { type: 'content', eyebrow: 'EU AI Act Art. 27 · effective Aug 2 2026', icon: '2', headlineHtml: 'FRIA · <em>fundamental rights impact assessment</em>',
      blocks: [{ atStep: 1, html: card('EU AI ACT REG. 2024/1689 · ART. 27', 'Required for certain deployers of high-risk AI systems', ['Including public-sector legal AI + certain private-sector judicial-support tools.', 'Parallels DPIA but expands beyond data protection — <strong>discrimination, access to justice, vulnerable groups.</strong>', 'Many compliance teams will run DPIA + FRIA as integrated single assessment from Aug 2.']) }] },
    { type: 'content', eyebrow: 'India DPDPA 2023 · rules 2025', icon: '3', headlineHtml: 'Different framework · <em>same AI-propose, DPO-validate pattern</em>',
      blocks: [{ atStep: 1, html: card('INDIA DPDPA 2023 · RULES FINALISED 2025', 'No DPIA equivalent — but data fiduciary obligations apply', ['Section 7 legitimate use grounds.', 'Section 8 data fiduciary obligations: reasonable security + breach notification.', '<strong>The local-equivalent risk review maps onto the same AI-propose, DPO-validate pattern.</strong>']) }] },
    { type: 'content', eyebrow: 'The pattern · propose-and-confirm', icon: '✓', headlineHtml: 'AI generates draft · <strong>DPO submits</strong>',
      blocks: [
        { atStep: 1, html: card('PROPOSE-AND-CONFIRM', 'The AI never submits the assessment. The DPO does.', ['Same pattern as contract review — extended to compliance work.', '<strong>What kills it: auto-submission.</strong> Letting AI generate and file without DPO review is paperwork hygiene that won\'t survive a regulator audit.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one upcoming DPIA · run AI-drafted version · compare', ['If AI gets you to 60% of a defensible draft — <strong>scale the pattern.</strong> If 20% — input template needs work.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'The 4-jurisdiction compliance matrix · <em>EU · US states · India · ABA</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'AI generates. DPO submits. <em>Same propose-and-confirm pattern as contract review.</em>', '<strong>Next:</strong> the posture document — EU AI Act Annex III, US state laws, India DPDPA, ABA Op 512.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 }, { at: 215.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

// ============== Ch5 — Compliance posture ==============
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Compliance posture across jurisdictions' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-compliance-posture.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · THE 4-QUADRANT POSTURE', h1Html: 'EU · US states · India · <em>the ABA</em>', subtitleHtml: 'Cross-border legal AI needs a <strong>posture document</strong>, not a vibe. This chapter is the structure.' },
    { type: 'content', eyebrow: 'Quadrant 1 · EU AI Act · Aug 2 2026', icon: '1', headlineHtml: 'Annex III high-risk · <em>Art. 26 + Art. 27 + Art. 99 fines</em>',
      blocks: [{ atStep: 1, html: card('EU AI ACT REGULATION 2024/1689', 'Legal/judicial AI = high-risk under Annex III', ['<strong>Art. 26:</strong> Deployer obligations — human oversight, logging, cooperation with authorities.', '<strong>Art. 27:</strong> FRIA (chapter 4).', '<strong>Art. 50:</strong> Transparency for AI interacting with persons.', '<strong>Art. 99 fines:</strong> Up to €15M or 3% global turnover.']) }] },
    { type: 'content', eyebrow: 'Quadrant 2 · US state laws · no federal AI law', icon: '2', headlineHtml: 'Patchwork · <em>build to Colorado + EU as floor</em>',
      blocks: [{ atStep: 1, html: card('US STATE-LEVEL · 2026', 'No federal AI law — patchwork of state requirements', ['<strong>NYC LL144</strong> (Jul 2023) — bias audits for hiring AI.', '<strong>Illinois AIVIA, Colorado SB24-205</strong> — AI act effective Feb 2026. California pending.', '<strong>Build to Colorado + EU as the floor</strong> — satisfies NYC, IL, CA in practice. Don\'t comply jurisdiction-by-jurisdiction.']) }] },
    { type: 'content', eyebrow: 'Quadrants 3 + 4 · India + ABA', icon: '3', headlineHtml: 'India DPDPA · <em>ABA Formal Op. 512</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUADRANT 3 · INDIA', 'DPDPA 2023', '', 'Section 7 legitimate use · Section 8 data fiduciary obligations · breach notification. Rules finalised 2025. <strong>Penalties up to ₹250 crore per violation.</strong>')}
${cell('QUADRANT 4 · BAR ETHICS', 'ABA Op. 512 + Res. 604', '', 'July 2024: competence, candor, confidentiality. <strong>The ethics rules already cover AI.</strong> CA, NY, FL, TX state bars followed in 2024-25.')}
</div>` }] },
    { type: 'content', eyebrow: 'The posture document · 5 sections', icon: '4', headlineHtml: 'Five sections · <em>one paragraph each</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('S1', 'Vendor inventory', '', 'Which AI tools · which use cases · which data flows')}
${cell('S2', 'Jurisdiction map', '', 'Per tool: which of EU, US state, DPDPA, ABA applies')}
${cell('S3', 'DPIA/FRIAs', '', 'Listed by deployment · status · renewal date')}
${cell('S4', 'Four guardrails', '', 'Citation verify · HITL · audit trail · training opt-out (ch. 7)')}
${cell('S5', 'Review cadence', '', 'Quarterly high-risk · annual routine · triggered on incidents')}
</div>` }] },
    { type: 'content', eyebrow: 'The Monday move', icon: '✓', headlineHtml: 'Map your top 3 use cases <em>to the 4 quadrants</em>',
      blocks: [
        { atStep: 1, html: card('MONDAY MOVE', 'For each of your top 3 AI use cases, which laws apply?', ['If you can\'t answer in one sentence per use case — <strong>the posture document doesn\'t exist yet.</strong>', 'That\'s the next deliverable.']) },
        { atStep: 2, html: closeCard('END OF CHAPTER 5', 'Four quadrants. <em>One posture document. Five sections each.</em>', '<strong>Next:</strong> privilege &amp; confidentiality — NY Bar Op. 1239 and the 3 vendor settings to verify.') }
      ] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 }, { at: 290.0, slide: 6, step: 2 }
  ]
});

// ============== Ch6 — Privilege & confidentiality ==============
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Privilege & confidentiality' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-privilege-confidentiality.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · DOES PRIVILEGE SURVIVE?', h1Html: 'Yes · <em>if you read the terms</em>', subtitleHtml: 'NY Bar Op. 1239 + ABA Op. 512: privilege survives if vendor terms preserve confidentiality. <strong>3 settings to verify before client data touches AI.</strong>' },
    { type: 'content', eyebrow: 'The bar guidance · NY Op. 1239 + ABA Op. 512', icon: '1', headlineHtml: 'Privilege survives <em>if terms preserve confidentiality</em>',
      blocks: [{ atStep: 1, html: card('NY BAR OP. 1239 · 2024 + ABA OP. 512 · JUL 2024', 'Privilege not broken by tool — broken by terms', ['Lawyers must understand whether client data is transmitted, retained, used for training.', '<strong>Enterprise terms with training opt-out + tenant isolation → privilege survives.</strong>', 'Consumer ChatGPT with default settings → privilege at risk. Same tech. Different terms.']) }] },
    { type: 'content', eyebrow: 'Enterprise vendors · 2026', icon: '2', headlineHtml: 'All major vendors landed on <em>the same data posture</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('OPENAI', 'Enterprise terms', '', 'Training opt-out by default. Workspace isolation.')}
${cell('ANTHROPIC', 'Commercial Terms', '', 'No training on customer data. Same posture.')}
${cell('MICROSOFT', 'Copilot for M365', '', 'Tenant isolation. No training on customer prompts.')}
${cell('GOOGLE / NOTION', 'Workspace / AI', '', 'Same posture. Table stakes by 2025.')}
</div>` }, { atStep: 1, html: card('WHAT STILL VARIES', 'Retention', ['Some vendors hold prompts 30 days for safety review. Some less. Some zero. <strong>Negotiate retention to zero if matter requires it.</strong>']) }] },
    { type: 'content', eyebrow: 'The 3 settings to verify', icon: '3', headlineHtml: 'Cannot tick all 3 in writing? · <em>don\'t use it for client work</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('SETTING 1', 'Training opt-out', '', 'Vendor confirms in writing your prompts/outputs not used to train. Default-on OR contractually committed.')}
${cell('SETTING 2', 'Tenant isolation', '', 'Your data does not commingle with other customers. Enforced at infrastructure level.')}
${cell('SETTING 3', 'Retention', '', 'You know how long data is stored. Can request deletion. <strong>Ideally zero-day for privileged work.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'The biggest 2026 risk · personal accounts', icon: '!', iconRed: true, headlineHtml: 'Associate at home · <em>personal ChatGPT for client work</em>',
      blocks: [
        { atStep: 1, html: cardRed('THE JUNIOR-ASSOCIATE-AT-HOME FAILURE MODE', 'Not malicious. Convenient. And measurable.', ['Personal accounts don\'t have enterprise terms. Default settings may allow training. No audit trail.', 'Vendor logs can show who used what account when — <strong>this is the failure mode bar associations are most likely to sanction in 2026.</strong>'], 'Fix: policy + tooling. Provide enterprise accounts. Block consumer-tier from network. Train associates. Make the right thing the easy thing.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Audit which AI tools your team is using right now', ['For each — personal account or enterprise? <strong>Any personal account being used for client work needs to be replaced this quarter.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'The quality framework · <em>4 operational guardrails</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Privilege survives. <em>The terms determine it.</em>', '<strong>Next:</strong> citation verification · human-in-the-loop · audit trail · periodic accuracy review.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 85.0, slide: 3 }, { at: 95.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// ============== Ch7 — Quality framework ==============
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Quality framework' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-quality-framework.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · 4 GUARDRAILS', h1Html: 'ABA Op. 512 · <em>translated to practice</em>', subtitleHtml: 'Citation verification · human-in-the-loop · audit trail · periodic accuracy review. <strong>If you do nothing else from this course, build this.</strong>' },
    { type: 'content', eyebrow: 'Guardrail 1 · citation verification', icon: '1', headlineHtml: 'Cited and verified · <em>or cut</em>',
      blocks: [{ atStep: 1, html: card('GUARDRAIL 1 · CITATION VERIFICATION', 'Every legal proposition the AI cites — verified against primary source before filing', ['Westlaw · Lexis · court records — whatever your firm uses. <strong>No exceptions.</strong>', 'Stanford 17-34% means you cannot trust without checking.', '<strong>Mata v. Avianca was the cost of skipping this guardrail.</strong>']) }] },
    { type: 'content', eyebrow: 'Guardrail 2 · human-in-the-loop', icon: '2', headlineHtml: 'AI never produces final work to client/court/regulator · <em>without human review</em>',
      blocks: [{ atStep: 1, html: card('GUARDRAIL 2 · HUMAN-IN-THE-LOOP', 'Difference between AI as assistant vs AI as agent', ['Legal AI is not ready to be agent. <strong>The human is accountable. The human reviews.</strong>', 'ABA Op. 512 makes this explicit.', 'Practical: anything an associate generates with AI — partner reviews like any associate output. AI doesn\'t change the obligation. Might change what partner reviews for: <em>fabrications, citation errors, jurisdictional mismatches.</em>']) }] },
    { type: 'content', eyebrow: 'Guardrail 3 · audit trail', icon: '3', headlineHtml: 'Log: <em>what tool · what document · what stage · by whom</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('REASON 1', 'Bar inquiry', '', 'If complaint filed alleging AI misuse, audit trail is the defence.')}
${cell('REASON 2', 'Privilege', '', 'Demonstrates which tools touched which data, with what vendor terms. <strong>Privilege survives if confidentiality preserved — audit trail is the evidence.</strong>')}
${cell('REASON 3', 'Quality', '', 'You cannot improve what you don\'t measure.')}
</div>` }, { atStep: 1, html: card('SIMPLEST IMPLEMENTATION', 'Matter file metadata', ['Every AI-touched matter gets a line in matter management noting tool + date. <strong>Doesn\'t have to be elaborate. Has to be consistent.</strong>']) }] },
    { type: 'content', eyebrow: 'Guardrail 4 · periodic accuracy review', icon: '4', headlineHtml: 'Quarterly high-volume · <em>annual low-volume · triggered on incidents</em>',
      blocks: [
        { atStep: 1, html: card('GUARDRAIL 4 · QUARTERLY REVIEW', 'Pull 20 AI-assisted work products · senior lawyer checks', ['What\'s the actual error rate? Where do errors cluster — clause type, jurisdiction, complexity?', '<strong>Use the data to tighten prompts, retrain associates, adjust which use cases the tool covers.</strong>'], 'Most firms ship AI. Few firms measure it. This is the quality discipline that separates top-decile programs.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one use case · write the 4 guardrails specifically for it', ['One paragraph each. <strong>If you can\'t write them down, you don\'t have the program.</strong>', 'Once written, they go into the matter file template.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 8', icon: '→', headlineHtml: 'Making it stick · <em>your 2-quarter rollout</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Four guardrails. <em>One paragraph each. Matter file template.</em>', '<strong>Last chapter:</strong> 2-quarter rollout playbook · 4 trust trip-wires · the course in one sentence.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 65.0, slide: 3 }, { at: 75.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

// ============== Ch8 — Rollout playbook ==============
const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],jurisdictions:[],cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='cadence'){grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state.cadence=val;}else{var arr=state[key];var max=key==='usecases'?2:99;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<max){arr.push(val);btn.classList.add('picked')}}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='legal-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases)_';var j=state.jurisdictions.length?state.jurisdictions.map(function(s){return '- '+s}).join('\\n'):'- _(pick jurisdictions)_';var c=state.cadence||'_(pick cadence)_';return '# Legal AI · 2-Quarter Roadmap\\n\\n**Owner:** ____________________\\n**Start date:** ____________________\\n\\n## 2 use cases\\n'+uc+'\\n\\n## Jurisdictions in scope\\n'+j+'\\n\\n## Quality review cadence\\n'+c+'\\n\\n## Quarter 1\\n- Contract review: extract + compare on standard NDAs\\n- Privacy DPIA drafts (propose-and-confirm)\\n- All 4 guardrails wired before launch\\n\\n## Quarter 2\\n- One open-ended use case (senior practitioner owned)\\n- Citation verification logged per matter\\n- Quality review at end of quarter\\n\\n## Trust trip-wires (do not cross)\\n- No client-facing AI without disclosure (EU AI Act Art. 50)\\n- No citations the lawyer hasn\\'t read\\n- No client data to non-enterprise tools\\n- No "set and forget"\\n\\n---\\nSource: Gennoor Academy · Function · AI for Legal & Compliance\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your legal AI roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-rollout-playbook.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · THE ROADMAP', h1Html: '2 use cases · 2 quarters · <em>4 guardrails</em>', subtitleHtml: 'Seven chapters of landscape, hallucinations, contracts, privacy, jurisdictions, privilege, quality. <strong>This chapter sequences them.</strong>' },
    { type: 'content', eyebrow: 'The principle · 2 not 7', icon: '1', headlineHtml: 'Pick two use cases · <em>not seven</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 2 quarters · 1 quality framework', ['The mistake legal teams make: trying to deploy AI across litigation, transactions, advisory, regulatory, compliance — all at once.', '<strong>Pick two. Ship them with the four guardrails.</strong> Expand from a position of demonstrated discipline.']) }] },
    { type: 'content', eyebrow: 'The sequence · default playbook', icon: '2', headlineHtml: 'Q1 contract review + DPIA · <em>Q2 one open-ended</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUARTER 1', 'Contract review + DPIA drafts', '', '<strong>Contract review:</strong> extract + compare on standard NDAs. High volume, repeatable, low marginal risk.<br/><strong>DPIA drafts:</strong> propose-and-confirm. DPO validates.<br/>All 4 guardrails wired before launch.', 'green')}
${cell('QUARTER 2', 'One open-ended use case', '', 'Diligence on specific deal type · regulatory research bounded by jurisdiction · internal-policy drafting. <strong>Pick the one your most senior practitioner can own end-to-end.</strong><br/><br/><em>Defer: open-ended litigation, bet-the-firm M&A. Year 2 if the framework holds.</em>')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No client-facing AI without disclosure', '', 'EU AI Act Art. 50 effective Aug 2 2026. Aligned with consumer preference.', 'red')}
${cell('TRIP-WIRE 2', 'No citations the lawyer hasn\'t read', '', 'The cardinal rule. <strong>Schwartz, Park, Iovino — all crossed this line.</strong>', 'red')}
${cell('TRIP-WIRE 3', 'No client data to non-enterprise tools', '', 'NY Bar Op. 1239 is the test. Personal ChatGPT is not for client work.', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly accuracy review is the contract you sign with the partnership.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pick your 2 · <em>download · take to managing partner</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases (Q1 + Q2)</h5><div class="preset" data-group="usecases">
<button data-val="Contract review: extract + compare on NDAs">NDA extract/compare</button>
<button data-val="Privacy DPIA drafting with propose-and-confirm">DPIA drafting</button>
<button data-val="EU AI Act FRIA drafting">FRIA drafting</button>
<button data-val="Regulatory research bounded by jurisdiction + topic">Bounded regulatory research</button>
<button data-val="M&amp;A diligence on specific deal type">M&amp;A diligence (specific)</button>
<button data-val="Internal policy drafting (HR / compliance)">Internal policy drafting</button>
</div></div>
<div class="group"><h5>Jurisdictions in scope</h5><div class="preset" data-group="jurisdictions">
<button data-val="EU (AI Act + GDPR)">EU</button><button data-val="US federal + relevant states">US</button>
<button data-val="UK">UK</button><button data-val="India (DPDPA)">India</button><button data-val="Canada">Canada</button>
</div></div>
<div class="group"><h5>Quality review cadence</h5><div class="preset" data-group="cadence">
<button data-val="Quarterly review of 20 random AI-assisted matters">Quarterly</button>
<button data-val="Monthly review of 10 random AI-assisted matters">Monthly</button>
<button data-val="Per-matter sign-off + annual portfolio review">Per-matter + annual</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my legal AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Legal AI · 2-Quarter Roadmap

Pick use cases, jurisdictions, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'The lawyer is accountable · <em>the firm is accountable</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Verify every citation · ground every claim · name the jurisdictions · enterprise terms only · apply the 4 guardrails · ship 2 use cases not 7 · keep the human accountable · quarterly review.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one managing-partner or GC conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 170.0, slide: 5 }, { at: 180.0, slide: 5, step: 1 },
    { at: 210.0, slide: 6 }, { at: 220.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 8 chapters 2-8 built.');
