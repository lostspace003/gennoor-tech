// Course 44 — AI Strategy for the CIO (Andrew · leadership track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Leadership · AI Strategy for the CIO'
const OUT = 'tmp/academy-build/ai-strategy-for-cio/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'AI\'s place in the CIO portfolio' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-portfolio.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · AI INSIDE THE PORTFOLIO · NOT ON TOP', h1Html: 'Run-grow-transform with AI in it · <em>3 portfolio failures</em>', subtitleHtml: '<strong>AI competes for slots, just like everything else.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'CIOs run portfolios · <em>AI lands on top</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Locate AI inside existing allocation', ['<strong>CIOs run portfolios.</strong> ERP modernization · cloud migration · cybersecurity · run-the-bank. CEO already signed the plan.', 'AI lands on top. <em>Pressure to fund without backing off anything else.</em>'], '<strong>Discipline:</strong> locate AI inside existing run-grow-transform allocation. Not on top.') }] },
  { type: 'content', eyebrow: 'Run-grow-transform', icon: '2', headlineHtml: 'Run · grow · <em>transform</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'Run (50-60%)', '', 'AI mostly outside. Some Copilot · IT helpdesk AI. <strong>Bulk of AI not here.</strong>', 'green')}
${cell('R2', 'Grow (25-35%)', '', 'Most AI features sit here. Customer-facing · sales productivity · automation.', 'green')}
${cell('R3', 'Transform (10-15%)', '', 'AI strategic bets · new products · platform shifts · sovereign AI infra. <strong>Most strategic upside.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 portfolio failures', icon: '!', iconRed: true, headlineHtml: 'Phantom budget · capacity collision · <em>vendor sprawl</em>',
    blocks: [{ atStep: 1, html: cardRed('3 FAILURES FROM TREATING AI AS SIDE PROGRAM', '', ['<strong>1. Phantom budget.</strong> CEO says "fund AI" — no specific $$. CIO drains from other programs. They slip. <em>Trust erodes.</em>', '<strong>2. Capacity collision.</strong> Same engineers asked to ship AI + ERP + cover incidents. <em>Burnout. Quality drops everywhere.</em>', '<strong>3. Vendor sprawl.</strong> AI gets separate vendor stack. Existing relationships overlap. <em>Integration debt accumulates.</em>'], '<strong>Cure:</strong> honest allocation. AI competes for slots, just like everything else.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Explicit allocation · <em>prioritisation documented</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI PORTFOLIO INTEGRATION', '2 questions', ['<strong>Q1:</strong> AI funded from explicit run-grow-transform, or extra on top? Explicit green · "we\'ll find it" amber · <strong>purely on top red — capacity collision</strong>.', '<strong>Q2:</strong> when AI competes with non-AI for engineers, prioritisation explicit? Documented yes green · informally amber · <strong>no red — engineers learn AI always wins, others starve</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Walk portfolio with CTO + finance partner', ['Where does AI live? <strong>If separate pot, that\'s the integration work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Infrastructure decisions · <em>cloud · on-prem · sovereign · hybrid</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Run-grow-transform · 3 portfolio failures · honest allocation.', '<strong>Next:</strong> 4 infra options · 5-criterion test · regional forcing factors.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Infrastructure decisions' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-infra.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · CLOUD · ON-PREM · SOVEREIGN · HYBRID', h1Html: '5-criterion test · <em>regional forcing factors</em>', subtitleHtml: '<strong>If a regional factor forces the answer, the other criteria don\'t matter.</strong>' },
  { type: 'content', eyebrow: '4 infra options', icon: '1', headlineHtml: 'Hyperscaler · sovereign · on-prem · <em>hybrid</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('O1', 'Hyperscaler public cloud', '', 'AWS · Azure · Google. <strong>Fast start · PAYG · lock-in by gravity.</strong>', 'green')}
${cell('O2', 'Sovereign cloud', '', 'G42 · NEOM · Mawani UAE/Saudi · GovCloud US · regional in India. <strong>Required for many regulated workloads.</strong>', 'green')}
${cell('O3', 'On-prem', '', 'Your DC · owned GPUs + ops. <strong>Highest control. Highest fixed cost.</strong>', 'amber')}
${cell('O4', 'Hybrid', '', 'Sensitive on-prem/sovereign · non-sensitive hyperscaler. <strong>Most regulated end here.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '5-criterion test', icon: '2', headlineHtml: 'Residency · volume · talent · dependency · <em>CapEx/OpEx</em>',
    blocks: [{ atStep: 1, html: card('5 CRITERIA TO PICK', 'Three of five pushing same direction = your answer', ['<strong>1. Data residency requirements.</strong> Forced by regulator? On-prem or sovereign.', '<strong>2. Workload volume + variability.</strong> Highly variable → hyperscaler economics. Steady high-volume → on-prem may win.', '<strong>3. Talent availability.</strong> Can hire ML platform engineers? On-prem feasible. Can\'t? Hyperscaler.', '<strong>4. Strategic dependency tolerance.</strong> OK with hyperscaler lock-in? Public. Not OK? Sovereign/on-prem.', '<strong>5. CapEx vs OpEx preference.</strong> CFO wants OpEx? Hyperscaler. CapEx OK? On-prem.']) }] },
  { type: 'content', eyebrow: 'Regional forcing factors', icon: '!', iconRed: true, headlineHtml: 'India DPDPA · UAE+Saudi · EU · <em>US federal</em>',
    blocks: [{ atStep: 1, html: cardRed('REGIONAL FORCING FACTORS · OVERRIDE OTHER CRITERIA', '', ['<strong>India DPDPA.</strong> Sensitive PII → in-country residency strongly preferred. Hyperscalers offer India regions · sovereign emerging.', '<strong>UAE + Saudi.</strong> National AI strategies push sovereign. G42 UAE · NEOM Cloud Saudi expected for government + critical sectors.', '<strong>EU.</strong> GDPR + EU AI Act push EU regions or sovereign (Gaia-X, Sovereign Cloud Stack).', '<strong>US federal.</strong> FedRAMP · GovCloud or on-prem.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '5-criterion test run · <em>residency in writing</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INFRA DISCIPLINE', '2 questions', ['<strong>Q1:</strong> 5-criterion test run on top AI workloads? Documented green · informally amber · <strong>no red — defaulting to hyperscaler</strong>.', '<strong>Q2:</strong> for regulated workloads, residency confirmed in writing by vendor? Contractually yes green · "they say" amber · <strong>no red — audit failure waiting</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick top 3 AI workloads', ['Walk 5-criterion test for each. <strong>Where defaults don\'t match, that\'s the architectural conversation.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Build vs buy vs compose · <em>3 options, not 2</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 infra options · 5 criteria · regional forcing.', '<strong>Next:</strong> 3 options · 3 criteria · buy-turned-build pattern.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Build vs buy in AI' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-buildbuy.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · 3 OPTIONS · NOT 2', h1Html: 'Buy · build · <em>compose</em>', subtitleHtml: '<strong>Most vendor pitches are binary buy-vs-build. Compose is usually right.</strong>' },
  { type: 'content', eyebrow: '3 options', icon: '1', headlineHtml: 'Buy · build · <em>compose</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('O1', 'Buy', '', 'Packaged product. Salesforce Einstein · ServiceNow · Copilot. <strong>Speed. Less control. Lock-in.</strong>', 'green')}
${cell('O2', 'Build', '', 'Engineering builds with foundation models + RAG + custom. <strong>Most control. Slowest. Highest talent demand.</strong>', 'amber')}
${cell('O3', 'Compose', '', 'Existing platforms (Foundry · Bedrock · Vertex) + light custom. <strong>Middle ground. Most enterprises end here.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 criteria', icon: '2', headlineHtml: 'Differentiation · sensitivity · <em>talent capacity</em>',
    blocks: [{ atStep: 1, html: card('3 CRITERIA TO CHOOSE', 'If mixed, compose almost always wins', ['<strong>1. Strategic differentiation.</strong> Is this AI feature what you compete on? Yes → build/compose. No → buy.', '<strong>2. Data sensitivity.</strong> Most sensitive data? Yes → build/compose with sovereign deployment. No → buy can be fine.', '<strong>3. Talent capacity.</strong> Have ML engineers · prompt engineers · MLOps? Yes → build/compose. No → buy.']) }] },
  { type: 'content', eyebrow: 'Buy-turned-build pattern', icon: '!', iconRed: true, headlineHtml: 'Year 1 customise · year 2 paying both · <em>cut early</em>',
    blocks: [{ atStep: 1, html: cardRed('"BUY THAT TURNED INTO BUILD"', 'Spot it via consulting hours', ['<strong>Pattern:</strong> CIO signs $2M annual SaaS. 6 months in, customisation begins. 12 months in, custom code surrounds the SaaS. 18 months in, paying license + 10-person team.', '<strong>Cause:</strong> packaged feature didn\'t fit your business.', '<strong>Spot it:</strong> integration consulting >50% of license cost in year one = feature didn\'t fit.'], '<strong>Fix:</strong> cut early. Accept the gap or pivot to compose. <em>Don\'t accumulate two costs.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Decision documented · <em>consulting ratio healthy</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE BUILD-VS-BUY DISCIPLINE', '2 questions', ['<strong>Q1:</strong> top 3 AI features had build-vs-buy decision documented with 3 criteria? Yes green · informally amber · <strong>no red — defaulting</strong>.', '<strong>Q2:</strong> for buy decisions >12mo old, consulting cost <50% of license? Yes green · 50-100% amber · <strong>>100% red — buy-turned-build, decision time</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull top 3 AI vendor contracts', ['Sum consulting + customisation Y1. Compare to license. <strong>Ratio tells you risk.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Talent strategy · <em>per capability bucket</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 options · 3 criteria · buy-turned-build.', '<strong>Next:</strong> 4 capability buckets · 3 talent models · SI dependency trap.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Talent strategy' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-talent.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · DIFFERENT MODEL PER BUCKET', h1Html: '4 capability buckets · 3 talent models · <em>SI dependency trap</em>', subtitleHtml: '<strong>One-size-fits-all talent strategy kills the program.</strong>' },
  { type: 'content', eyebrow: '4 capability buckets', icon: '1', headlineHtml: 'Data eng · MLOps · prompt/feature · <em>governance</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('B1', 'Data engineering', '', 'Pipelines · transformations · catalog. <strong>Foundation. In-house.</strong>', 'green')}
${cell('B2', 'MLOps + LLMOps', '', 'Model lifecycle · evals · drift · incident. <strong>Increasingly in-house for prod orgs.</strong>', 'green')}
${cell('B3', 'Prompt + AI feature dev', '', 'Application-layer AI. <strong>Distributed across product teams + central guidance.</strong>', 'green')}
${cell('B4', 'AI governance + risk', '', 'Model risk · regulatory · audit. <strong>Centralised. Partnered with CRO.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 talent models', icon: '2', headlineHtml: 'Insource · partner · <em>rotate</em>',
    blocks: [{ atStep: 1, html: card('3 TALENT MODELS · MAPPING THAT WORKS', '', ['<strong>Insource:</strong> hire + retain. Highest control. Slowest scale. Expensive at small scale.', '<strong>Partner:</strong> SI partner. Fast scale. Lock-in risk. Bench varies.', '<strong>Rotate:</strong> internal engineers into AI for 12-18 months then back. Breadth + retention.'], '<strong>Mapping:</strong> Data eng → insource. MLOps → hybrid (insource lead + partner scale). Prompt + feature dev → rotate. Governance + risk → insource.') }] },
  { type: 'content', eyebrow: 'SI dependency trap', icon: '!', iconRed: true, headlineHtml: 'Year 1 fast · year 3 hostage · <em>knowledge transfer contractual</em>',
    blocks: [{ atStep: 1, html: cardRed('THE SI DEPENDENCY TRAP', '', ['<strong>Year 1.</strong> SI partner provides AI accelerator team. Ships faster than internal would. CIO happy.', '<strong>Year 2.</strong> SI has shipped 8 features. Knows your codebase. Your team doesn\'t.', '<strong>Year 3.</strong> SI rate increases. You can\'t switch — they have all institutional knowledge. SI knows it.'], '<strong>Cure:</strong> day one, require knowledge transfer milestones · internal lead alongside SI lead · SI documentation as contractual deliverable.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Differentiated per bucket · <em>internal lead + KT contractual</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI TALENT STRATEGY', '2 questions', ['<strong>Q1:</strong> different model per bucket, or one-size? Differentiated green · partial amber · <strong>one-size red</strong>.', '<strong>Q2:</strong> SI partnerships have internal lead + KT contractual? Yes green · informal amber · <strong>no red — dependency building</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Map top 4 AI talent buckets', ['Note model in place. <strong>Mismatches against recommended pattern = next quarter\'s talent plan.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Risk + operational considerations · <em>4 ops risks · BCDR for AI</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 buckets · 3 models · SI dependency trap.', '<strong>Next:</strong> 4 AI ops risks · BCDR · graceful degradation.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Risk and operational considerations' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-ops.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · BCDR FOR AI · GRACEFUL DEGRADATION', h1Html: '4 ops risks unique to AI · <em>3 operational disciplines</em>', subtitleHtml: '<strong>Most AI services have weak BCDR. Most CIOs haven\'t asked for it yet.</strong>' },
  { type: 'content', eyebrow: '4 ops risks', icon: '!', iconRed: true, headlineHtml: 'Vendor model updates · cost variability · non-deterministic incidents · <em>supply chain</em>',
    blocks: [{ atStep: 1, html: cardRed('4 OPERATIONAL RISKS UNIQUE TO AI', 'No traditional process catches them', ['<strong>1. Vendor model updates.</strong> OpenAI · Anthropic · Azure update without notice. Your behaviour changes silently.', '<strong>2. Cost variability.</strong> Single clever user → 100x normal tokens. Day-1 $X → day-90 $5X.', '<strong>3. Non-deterministic incidents.</strong> "It worked yesterday." Classical incident response doesn\'t fit.', '<strong>4. Supply chain.</strong> Foundation model vendor breach · sub-processor breach · open-weight CVE. New attack surface.']) }] },
  { type: 'content', eyebrow: 'BCDR for AI', icon: '1', headlineHtml: 'Different from classical · <em>vendor outage + quality degradation</em>',
    blocks: [{ atStep: 1, html: card('BCDR FOR AI SERVICES', 'Most have weak BCDR', ['<strong>Vendor outage.</strong> OpenAI down 3h. Features fail. <em>Failover to Anthropic or Mistral or local model?</em>', '<strong>Regional outage.</strong> Hyperscaler region down. <em>Cross-region AI workloads?</em>', '<strong>Quality degradation.</strong> Vendor updated model. Quality dropped. <em>Automated rollback to previous version?</em>', '<strong>Graceful degradation.</strong> When AI down, falls back to non-AI flow? <em>Or user sees "service unavailable"?</em>']) }] },
  { type: 'content', eyebrow: '3 ops disciplines', icon: '2', headlineHtml: 'Cost + auto-throttle · vendor health · <em>graceful degradation</em>',
    blocks: [{ atStep: 1, html: card('3 OPERATIONAL DISCIPLINES', 'Without these, incidents become CEO escalations', ['<strong>1. Cost monitoring + auto-throttle.</strong> Daily spend thresholds · per-user rate limits · auto-throttle on spike.', '<strong>2. Vendor health monitoring.</strong> Track upstream vendor status · automated failover on outage.', '<strong>3. Graceful degradation.</strong> Application falls back to non-AI flow when AI unavailable. <em>Tested. Documented. Not "we hope it works."</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'BCDR plans tested · <em>graceful degradation tested</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI OPERATIONAL DISCIPLINE', '2 questions', ['<strong>Q1:</strong> top AI services have BCDR plans including vendor outage scenarios? Tested green · documented amber · <strong>no red — outage will surprise</strong>.', '<strong>Q2:</strong> graceful degradation in place for customer-facing AI features? Tested green · "in code" amber · <strong>no red — customer sees error</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Top customer-facing AI feature', ['Walk through "what happens when OpenAI is down 3 hours?" <strong>If answer is "we hope," that\'s BCDR gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Reporting AI to CEO and board · <em>3-metric structure</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 ops risks · AI BCDR · 3 disciplines.', '<strong>Next:</strong> reporting trap · 3-metric structure · holding AI alongside IT.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Reporting AI to CEO and board' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-reporting.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · INTEGRATED REPORTING · NOT THE COOL SLIDE', h1Html: '3-metric structure · <em>same calibration as ERP</em>', subtitleHtml: '<strong>Over-promising AI to stand out is short-term sugar with long-term reputational cost.</strong>' },
  { type: 'content', eyebrow: 'The reporting trap', icon: '!', iconRed: true, headlineHtml: 'AI dominates · others sound boring · <em>over-promise to stay relevant</em>',
    blocks: [{ atStep: 1, html: cardRed('THE REPORTING TRAP', '', ['<strong>Trap:</strong> AI dominates board narrative. Other IT programs sound boring next to AI. CIO over-promises on AI to stay relevant.', '<strong>6 months later:</strong> AI under-delivers. CIO credibility takes the hit on everything, not just AI.'], '<strong>Discipline:</strong> report AI with same calibration as rest of portfolio. <em>Honesty earns long-term credibility.</em>') }] },
  { type: 'content', eyebrow: '3-metric structure', icon: '1', headlineHtml: 'Value realised · delivery confidence · <em>portfolio health</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1', 'AI value realised vs projected', '', 'From 12-month business cases, ROI materialised. <strong>Comparable to other capital programs.</strong>', 'green')}
${cell('M2', 'AI delivery confidence', '', 'In-flight features: on-track / at-risk / behind. <strong>Same structure as ERP, cloud, security.</strong>', 'green')}
${cell('M3', 'AI portfolio health', '', 'Spend by feature · vendor concentration · lock-in · talent capacity. <strong>Strategic risk metrics.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Holding AI alongside IT', icon: '2', headlineHtml: 'One column in portfolio · <em>not a separate cool section</em>',
    blocks: [{ atStep: 1, html: card('HOLDING AI ALONGSIDE THE REST OF IT', 'When ERP slips, board asks why. Same for AI.', ['<strong>The mistake:</strong> separate AI board section. Reads as "look at all the cool AI stuff." Doesn\'t compare to other programs.', '<strong>Right pattern:</strong> AI is one column in the portfolio view. Same status structure as ERP, cloud, security.'], 'This earns CIO long-term credibility. <strong>Over-promising AI to stand out is short-term sugar with long-term reputational cost.</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Integrated 3-metric · <em>same calibration as ERP</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CIO BOARD REPORTING', '2 questions', ['<strong>Q1:</strong> 3 outcome metrics for AI, integrated into broader portfolio? Yes green · separate AI section amber · <strong>marketing slide red</strong>.', '<strong>Q2:</strong> when AI at-risk, board narrative matches how ERP-at-risk would be reported? Same calibration green · slightly softer amber · <strong>significantly softer red — long-term cost</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last 3 board decks', ['How is AI presented? <strong>If it\'s the cool slide, that\'s the calibration work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'CIO operating cadence · <em>4 rhythms · cross-functional partners</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Reporting trap · 3-metric structure · integrated reporting.', '<strong>Next:</strong> 4 rhythms · 3 partners · delegation framework.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'CIO operating cadence' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-cadence.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · 4 RHYTHMS · 3 PARTNERS · DELEGATION', h1Html: 'Weekly · monthly · quarterly · annual · <em>avoiding CIO-bottleneck</em>', subtitleHtml: '<strong>Without explicit cadence, decisions stack to crisis-meetings.</strong>' },
  { type: 'content', eyebrow: '4 rhythms', icon: '1', headlineHtml: 'Weekly · monthly · quarterly · <em>annual</em>',
    blocks: [{ atStep: 1, html: card('THE 4-RHYTHM CADENCE', 'Each catches what others miss', ['<strong>Weekly.</strong> AI portfolio standup. Top features · blockers · escalations · incidents. 30 min. CIO + direct reports + CDO + CISO occasional.', '<strong>Monthly.</strong> Cross-portfolio review. AI alongside ERP · cloud · security · run. Same calibration applied to all.', '<strong>Quarterly.</strong> AI portfolio deep-dive. Investment refresh · vendor portfolio · talent · lock-in.', '<strong>Annually.</strong> Strategy reset. 3-horizon allocation · board KPI redesign · AI strategy refresh.']) }] },
  { type: 'content', eyebrow: '3 cross-functional partners', icon: '2', headlineHtml: 'CDO · CISO · <em>CFO</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'CDO', '', 'Data foundations the AI portfolio depends on. <strong>Monthly minimum.</strong>', 'green')}
${cell('P2', 'CISO', '', 'AI security posture · vendor security · incident response. <strong>Monthly minimum.</strong>', 'green')}
${cell('P3', 'CFO', '', 'AI investment · cost variability · payback tracking. <strong>Quarterly minimum.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'CIO bottleneck pattern', icon: '!', iconRed: true, headlineHtml: 'Delegation framework · <em>auto · architecture board · CIO-direct</em>',
    blocks: [{ atStep: 1, html: cardRed('THE CIO-AS-BOTTLENECK PATTERN', 'Same as CDO, different domain', ['CIOs pulled into AI vendor selection · infra · talent rotations. Volume grows. CIO becomes bottleneck.'], '<strong>Cure: delegation framework.</strong> Auto-approval (standard hyperscaler, established vendor, below spend). Architecture review board (medium-complexity). CIO-direct (strategic, large spend, novel, sovereign workloads).') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'All 4 rhythms · <em>CIO-direct fraction <15%</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CIO OPERATING DISCIPLINE', '2 questions', ['<strong>Q1:</strong> all 4 rhythms in place? Yes green · 2-3 amber · <strong><2 red — crisis-meeting culture</strong>.', '<strong>Q2:</strong> fraction of AI decisions at CIO directly? <15% green · 15-30% amber · <strong>>30% red — bottleneck</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit last month\'s AI decisions', ['Fraction to you? <strong>If too high, that\'s the delegation work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · CIO AI portfolio statement · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 rhythms · 3 partners · delegation framework.', '<strong>Last:</strong> 5-section statement · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={tilt:'',infra:'',default:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='cio-ai-portfolio.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var t=state.tilt||'_(pick portfolio tilt)_';var i=state.infra||'_(pick infra posture)_';var d=state.default||'_(pick build/buy/compose default)_';return '# CIO AI Portfolio Statement\\n\\n**CIO:** ____________________\\n**Executive committee date:** ____________________\\n\\n## Portfolio tilt (run/grow/transform)\\n> '+t+'\\n\\n## Infrastructure posture\\n> '+i+'\\n\\n## Build/buy/compose default\\n> '+d+'\\n\\n## 5-section statement\\n- [ ] Portfolio allocation: AI in run-grow-transform · explicit $ · trade-offs surfaced\\n- [ ] Infrastructure posture: 5-criterion test applied\\n- [ ] Build vs buy vs compose: per strategic feature · 3-criteria justified\\n- [ ] Talent + ops: per-capability talent model · BCDR · graceful degradation\\n- [ ] Board reporting: 3-metric structure · integrated with broader IT\\n\\n## 4 trust trip-wires (do not cross)\\n- AI funded on top, not as portfolio allocation\\n- Defaulting to hyperscaler without 5-criterion test\\n- SI dependency without internal lead + knowledge transfer\\n- AI as the cool board slide, not integrated portfolio reporting\\n\\n---\\nSource: Gennoor Academy · AI Strategy for the CIO\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — CIO AI portfolio statement' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · CIO AI PORTFOLIO STATEMENT', h1Html: '5-section statement · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Keep AI additive, not eating the rest of the portfolio.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'One workload competing · <em>portfolio statement scales it</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Keep AI additive', ['<strong>AI is one workload competing for CIO attention.</strong> The portfolio statement is how you keep it additive, not eating the rest.']) }] },
  { type: 'content', eyebrow: '5-section statement', icon: '2', headlineHtml: 'Allocation · infra · build/buy · talent · <em>board reporting</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Portfolio allocation', '', 'AI in run-grow-transform · explicit $ · trade-offs surfaced.')}
${cell('S2', 'Infrastructure posture', '', '5-criterion test applied.', 'amber')}
${cell('S3', 'Build/buy/compose', '', 'Per strategic feature · 3 criteria justified.', 'green')}
${cell('S4', 'Talent + ops', '', 'Per-capability talent · BCDR · graceful degradation.', 'green')}
${cell('S5', 'Board reporting', '', '3-metric structure · integrated.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Funded on top · hyperscaler default · SI dependency · <em>cool slide</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'AI funded on top', '', 'Capacity collision. Others starve.', 'red')}
${cell('W2', 'Hyperscaler default', '', 'Regulated workloads → audit findings.', 'red')}
${cell('W3', 'SI dependency without KT', '', 'Year-3 hostage negotiation.', 'red')}
${cell('W4', 'AI as the cool board slide', '', 'Over-promise damages credibility.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · portfolio builder', icon: '✓', headlineHtml: 'Tilt · infra · default · <em>take to executive committee</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Portfolio tilt</h5><div class="preset" data-group="tilt">
<button data-val="Run 55% · Grow 30% · Transform 15% (typical enterprise tilt)">Run 55 · Grow 30 · Tx 15</button>
<button data-val="Run 45% · Grow 35% · Transform 20% (transformation-heavy strategy)">Run 45 · Grow 35 · Tx 20</button>
<button data-val="Run 65% · Grow 25% · Transform 10% (mature stable enterprise)">Run 65 · Grow 25 · Tx 10</button>
</div></div>
<div class="group"><h5>Infrastructure posture</h5><div class="preset" data-group="infra">
<button data-val="Hyperscaler-first (AWS/Azure/Google) — speed wins, lock-in accepted">Hyperscaler-first</button>
<button data-val="Hybrid (hyperscaler + on-prem for sensitive) — most regulated enterprises">Hybrid</button>
<button data-val="Sovereign-led (G42/NEOM/GovCloud/Gaia-X) — regulator-forced or strategic">Sovereign-led</button>
</div></div>
<div class="group"><h5>Build/buy/compose default</h5><div class="preset" data-group="default">
<button data-val="Compose-first (default for most production AI features)">Compose-first</button>
<button data-val="Buy-first (for non-strategic features where speed matters)">Buy-first</button>
<button data-val="Build-first (for strategically differentiating customer-facing AI)">Build-first</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my CIO AI portfolio statement (.md)</button>
</div>
<div class="preview" id="preview"># CIO AI Portfolio Statement

Pick tilt, infrastructure posture, and build/buy/compose default on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'AI in portfolio · 5-criterion infra · 3 options · talent per bucket · BCDR · 3-metric reporting · <em>4 rhythms</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI is one workload competing for CIO attention. Run-grow-transform allocation. Five-criterion infrastructure test. Build/buy/compose with three criteria. Talent strategy per capability bucket. SI dependency trap. AI BCDR + graceful degradation. Three-metric board reporting. Four-rhythm operating cadence.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Draft your portfolio statement.</div><div class="row"><span class="arr">→</span>Get executive committee on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 44 chapters 1-8 built.')
