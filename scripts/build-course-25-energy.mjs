// Course 25 — AI for Energy & Utilities (Emma)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Energy · AI for Energy + Utilities'
const OUT = 'tmp/academy-build/ai-for-energy-utilities/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The energy + utilities landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · RELIABILITY IS THE THROUGH-LINE', h1Html: '5 plays · <em>regulator-aware posture</em>', subtitleHtml: '<strong>AI must augment operational reliability, not threaten it. Grid stability + worker safety are non-negotiable.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Augment reliability · <em>not threaten it</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Different from most enterprise AI', ['<strong>Retail:</strong> AI wrong loses a sale. <strong>Utilities:</strong> AI wrong can blackout a city or kill a worker.', '<strong>Reliability is the through-line. Every AI decision filtered through that constraint.</strong>']) }] },
  { type: 'content', eyebrow: '5 high-value plays', icon: '2', headlineHtml: 'Forecast · grid · generation · maintenance · <em>customer ops</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PLAY 1', 'Demand forecasting', '', 'Short-term load forecasting. Standard practice 2026.', 'green')}
${cell('PLAY 2', 'Grid management', '', 'Asset health · congestion · outage response. <strong>Operator-in-the-loop.</strong>', 'green')}
${cell('PLAY 3', 'Generation optimisation', '', 'Wind output · solar yield · battery dispatch. <strong>Critical as grid decarbonises.</strong>', 'green')}
${cell('PLAY 4', 'Predictive maintenance', '', 'Transformers · switchgear · lines. Tens of millions deferred capital.', 'green')}
${cell('PLAY 5', 'Customer operations', '', 'Outage notifications · bill explanations · energy advice. <strong>Lowest stakes, highest volume.</strong>')}
</div>` }] },
  { type: 'content', eyebrow: 'The regulatory frame', icon: '!', iconRed: true, headlineHtml: 'NERC · FERC · PUC · EU AI Act · <em>document override path</em>',
    blocks: [{ atStep: 1, html: cardRed('REGULATORY FRAME · 2026', 'Critical infrastructure under scrutiny', ['<strong>US:</strong> NERC reliability · FERC orders · PUC oversight on customer-facing decisions.', '<strong>EU:</strong> EU AI Act — energy = critical infra Annex III · Network Code Cybersecurity 2024 · national regulator oversight.', '<strong>APAC:</strong> national regimes · cross-border data restrictions for grid security.'], 'Common: AI decisions affecting reliability or customer disconnection are regulator-watched. <strong>Document the human override path before deployment.</strong>') }] },
  { type: 'content', eyebrow: 'What this course covers', icon: '→', headlineHtml: '5 play deep-dives · cyber layer · <em>roadmap</em>',
    blocks: [
      { atStep: 1, html: card('STRUCTURE', '8 chapters', ['Ch 2-6: one chapter per play · where it works · where it breaks · regulator view.', 'Ch 7: cybersecurity for AI in critical infra (OT+IT+AI).', 'Ch 8: roadmap · 4 trip-wires · interactive builder.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick the one play your utility is most actively pursuing', ['Next 7 chapters give you operational discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Demand forecasting · <em>where AI consistently delivers</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Reliability through-line · 5 plays · regulator frame.', '<strong>Next:</strong> short-term load forecasting · 3 architectures · 3 failure modes · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Demand forecasting' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-demand-forecasting.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · MOST MATURE PLAY', h1Html: '5-15% accuracy lift · <em>operational stakes</em>', subtitleHtml: '<strong>Modern ML adds 5-15% accuracy improvement vs classical. Meaningful given operational stakes.</strong>' },
  { type: 'content', eyebrow: 'The use case', icon: '1', headlineHtml: 'Hour · day · <em>week-ahead</em>',
    blocks: [{ atStep: 1, html: card('SHORT-TERM LOAD FORECASTING', 'Hour-ahead · day-ahead · week-ahead', ['Inputs: temperature, time-of-day, day-of-week, season, special events.', 'Output drives generation dispatch, energy market bidding, reserve scheduling.'], '<strong>Most mature AI use case in utilities. Statistical methods existed for decades. Modern ML adds meaningful accuracy lift.</strong>') }] },
  { type: 'content', eyebrow: '3 architectures', icon: '2', headlineHtml: 'GBM · neural · <em>hybrid stats + ML</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('ARCH 1', 'Gradient Boosted Machines', '', 'LightGBM · XGBoost · CatBoost. Stable. Easy to debug. <strong>Dominant for system-level load.</strong>', 'green')}
${cell('ARCH 2', 'Neural networks', '', 'LSTM · transformer time-series. Better for very large complex data. Harder to debug.')}
${cell('ARCH 3', 'Hybrid statistical + ML', '', 'Classical model + ML on residual. <strong>Often best in M5-style benchmarks.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Tail-blindness · drift · <em>no stress test</em>',
    blocks: [{ atStep: 1, html: cardRed('3 FORECASTING FAILURE MODES', 'Patterns to detect early', ['<strong>1. Over-fit on stable history.</strong> Pandemic · heatwave · behavioural shift breaks the model. Test against tail events explicitly.', '<strong>2. Calibration drift.</strong> Year-X model behaves differently on year-Y. Quarterly retraining + trigger-based when accuracy drops.', '<strong>3. No scenario stress testing.</strong> Model performs well on average. Operational decisions ride on the worst case. <em>Stress test heatwave+outage, severe storm, demand response failure.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'MAPE · <em>uncertainty bounds</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DEMAND FORECASTING', '2 questions', ['<strong>Q1:</strong> last 12 months day-ahead MAPE? <3% system-level green · 3-5% amber · <strong>>5% red — model needs investment</strong>.', '<strong>Q2:</strong> forecast includes explicit uncertainty bounds (not just point estimates)? Yes green · point only amber-red depending on ops use.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull forecast accuracy on last hot day or cold snap', ['Degraded in high-stakes period? <strong>That\'s the gap. Tail-event accuracy matters more than average.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Grid management · <em>operator-in-the-loop</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Use case · 3 architectures · 3 failure modes · 2-question scoring.', '<strong>Next:</strong> AI assisting grid operators. Reliability first. The operator-in-the-loop principle.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Grid management' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-grid-mgmt.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · OPERATOR-IN-THE-LOOP', h1Html: '3 use cases · <em>non-negotiable principle</em>', subtitleHtml: '<strong>AI advises. Operator decides. AI that bypasses operator judgement is one bad day from being banned.</strong>' },
  { type: 'content', eyebrow: '3 grid AI use cases', icon: '1', headlineHtml: 'Asset health · congestion · <em>outage response</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Asset health monitoring', '', 'Sensor data → anomaly detection → maintenance prioritisation. <strong>Augmenting asset managers.</strong>', 'green')}
${cell('UC 2', 'Congestion management', '', 'Predict where grid hits capacity. Recommend dispatch adjustments. <strong>Operator-in-the-loop. Always.</strong>', 'amber')}
${cell('UC 3', 'Outage response', '', 'Locate · isolate · restore. <strong>Fastest path to power restoration.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Operator-in-the-loop principle', icon: '!', iconRed: true, headlineHtml: 'Non-negotiable · <em>regulatory + operational</em>',
    blocks: [{ atStep: 1, html: cardRed('OPERATOR-IN-THE-LOOP', 'Non-negotiable in 2026', ['<strong>Regulatory:</strong> NERC standards · FERC oversight · ENTSO-E network code all assume qualified human grid operator making dispatch and switching decisions.', '<strong>Operational:</strong> grid systems have novel failure modes training data has never seen. 20-year-storm. Coincident equipment failure. Cyber event. <em>Operator judgement prevents cascading failure in those moments.</em>'], '<strong>AI that bypasses operator judgement is one bad day from being banned by your regulator.</strong>') }] },
  { type: 'content', eyebrow: '3 grid AI failure modes', icon: '2', headlineHtml: 'Alert fatigue · no explanation · <em>normal-ops training</em>',
    blocks: [{ atStep: 1, html: cardRed('3 GRID AI FAILURE MODES', 'Predictable patterns', ['<strong>1. Alert fatigue.</strong> Too many anomalies flagged. Operators stop trusting alerts. Real anomaly through, ignored.', '<strong>2. Confidence without explanation.</strong> "Dispatch this way" without why. Operator can\'t validate → ignores or follows blindly. Both bad.', '<strong>3. Training data assumes normal ops.</strong> Model never seen catastrophic conditions. Predicts normal response to catastrophic event. <strong>Fails when needed most.</strong>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Acceptance rate · <em>explainability</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE GRID AI', '2 questions', ['<strong>Q1:</strong> operator acceptance rate of AI recommendations? 80-90% green · <strong><60% red — operators don\'t trust the model</strong>.', '<strong>Q2:</strong> can operators see why AI recommended what it recommended? Explainable green · black-box red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Talk to one of your grid operators about an AI tool they use daily', ['When do they accept? When do they overrule? <strong>Their pattern is the truth about your model — not your dashboards.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Generation optimisation · <em>renewables AI</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Operator-in-the-loop non-negotiable · 3 use cases · 3 failure modes.', '<strong>Next:</strong> wind · solar · battery dispatch. Why renewables need AI more than thermal did.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Generation optimisation' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-generation.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · RENEWABLES NEED AI', h1Html: 'Wind · solar · <em>battery dispatch</em>', subtitleHtml: '<strong>Thermal is dispatchable. Renewables you forecast. That changes the AI value equation.</strong>' },
  { type: 'content', eyebrow: 'Why renewables need AI', icon: '1', headlineHtml: 'Can\'t dispatch · <em>better forecasts = real money</em>',
    blocks: [{ atStep: 1, html: card('WHY RENEWABLES NEED AI MORE THAN THERMAL', 'Forecast is the lever', ['Thermal: you decide when it runs. Renewables: you forecast what they\'ll produce. <strong>Can\'t dispatch.</strong>', 'Better 15-min to 48-hr forecasts are worth real money. <strong>Market bidding accuracy · reserve requirements · battery dispatch.</strong>'], 'In 2026 most utilities with significant renewables have invested in AI-augmented forecasting. <em>Without it, market participation is harder and reserve costs higher.</em>') }] },
  { type: 'content', eyebrow: '3 use cases', icon: '2', headlineHtml: 'Wind output · solar yield · <em>battery dispatch</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Wind output forecasting', '', 'Wind speed · direction · density · turbine availability. <strong>24-72 hour horizon.</strong>', 'green')}
${cell('UC 2', 'Solar yield forecasting', '', 'Cloud cover · aerosol · panel temp. <strong>5 min - 4 hr for grid mgmt · longer for market.</strong>', 'green')}
${cell('UC 3', 'Battery dispatch optimisation', '', 'When to charge/discharge given price + grid constraints. <strong>Lithium-ion economics are tight. AI directly impacts revenue.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The curtailment question', icon: '!', iconRed: true, headlineHtml: 'Renewables overflow · <em>fairness contested</em>',
    blocks: [{ atStep: 1, html: cardRed('THE CURTAILMENT QUESTION', 'Increasingly contested', ['Renewables generate more than grid can absorb sometimes. <strong>AI decides what to curtail · which farm · which inverter · how long.</strong>', 'Operators accountable for fair curtailment. <strong>AI that systematically curtails one operator vs another invites regulatory scrutiny.</strong>'], '<em>Document the fairness logic.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Forecast MAPE · <em>battery revenue vs optimal</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE GENERATION AI', '2 questions', ['<strong>Q1:</strong> wind/solar forecast at 24-hr horizon. Compare MAPE to peer utilities in similar climates. Top quartile green · bottom quartile red — invest.', '<strong>Q2:</strong> battery dispatch — realised revenue vs theoretical optimal? >90% green · 70-90% amber · <strong><70% red — dispatcher leaving money on the table</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull renewables forecast accuracy for last quarter', ['Where did it miss the most? <strong>That\'s the blind spot. Often a specific weather pattern or operational condition. Diagnose it.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Predictive maintenance · <em>capital deferral responsibly</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 use cases · curtailment question · 2-question scoring.', '<strong>Next:</strong> transformers · switchgear · lines. Tens of millions deferred capital with safety maintained.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Predictive maintenance for T+D assets' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-maintenance.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · CAPITAL DEFERRAL RESPONSIBLY', h1Html: '3 use cases · <em>safety constraint non-negotiable</em>', subtitleHtml: '<strong>AI extends inspection intervals. Never eliminates them. OSHA + your safety teams will hold you to this.</strong>' },
  { type: 'content', eyebrow: 'The economics', icon: '1', headlineHtml: 'Tens of millions deferred · <em>without compromising safety</em>',
    blocks: [{ atStep: 1, html: card('THE ECONOMICS', 'What AI changes', ['Transformer with 5+ years life left alone. End-of-life replaced. <strong>Historically: visual inspection · occasional oil testing · age-based heuristics.</strong>', 'AI: sensor data + oil chemistry + operational stress → probabilistic remaining-life estimate. <strong>Replace failing. Defer healthy. Safety maintained.</strong>']) }] },
  { type: 'content', eyebrow: '3 use cases', icon: '2', headlineHtml: 'Transformers · switchgear · <em>line monitoring</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Transformer health', '', 'Oil dissolved gas + load patterns + cooling perf. <strong>Probability of failure in next 12-24 months.</strong>', 'green')}
${cell('UC 2', 'Switchgear / breakers', '', 'Operating cycles · trip history · maintenance records. Failure risk scoring for replacement prioritisation.', 'green')}
${cell('UC 3', 'Line monitoring', '', 'Sag · sway · vegetation encroachment. From drone/satellite imagery + AI. <strong>Replaces or augments helicopter inspections.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The safety constraint', icon: '!', iconRed: true, headlineHtml: 'AI extends inspections · <em>never eliminates</em>',
    blocks: [{ atStep: 1, html: cardRed('THE SAFETY CONSTRAINT', 'The failure mode that matters', ['AI predicts healthy → crew skips inspection → asset fails → worker hurt or killed → customers blacked out.', '<strong>Discipline:</strong> AI extends inspection intervals, never eliminates entirely. For high-consequence assets — major substations, river crossings, critical lines — <em>human inspection cadence preserved. AI prioritises and informs.</em>'], 'OSHA + equivalent regulators + your safety teams will hold you to this. <strong>Document the AI-plus-human-inspection logic.</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Missed failures · <em>safety overrides</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PREDICTIVE MAINTENANCE', '2 questions', ['<strong>Q1:</strong> last 12 months — AI missed a failure that investigation said was predictable? 0-1 green · 2-4 amber · <strong>5+ red — model needs retraining</strong>.', '<strong>Q2:</strong> explicit human safety override on every recommendation type? Yes green · implicit amber · <strong>algorithmic decision without override = red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last 5 asset failures that surprised the AI', ['What did the model miss? <strong>That\'s the blind spot. Address it before the next failure.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Customer operations · <em>lower stakes, higher volume</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Economics · 3 use cases · safety constraint · 2-question scoring.', '<strong>Next:</strong> outage notifications · bill explanations · energy advice. The disconnect line. Vulnerable customer protection.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Customer operations' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-customer-ops.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · THE DISCONNECT LINE', h1Html: '3 use cases · <em>vulnerable customer protection</em>', subtitleHtml: '<strong>AI must never make a customer disconnection decision autonomously. PUCs enforce this strictly.</strong>' },
  { type: 'content', eyebrow: '3 use cases', icon: '1', headlineHtml: 'Outage comms · bill explanations · <em>energy advice</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Outage communications', '', 'Prioritise customer notifications. Faster contact. Updated restoration estimates as crews work.', 'green')}
${cell('UC 2', 'Bill explanations', '', 'Why was my bill higher? AI explains from usage + weather + rate changes. <strong>Reduces call centre load.</strong>', 'green')}
${cell('UC 3', 'Energy advice', '', 'Personalised reduction · rate plan switching · demand response. <strong>Often highest-volume customer-facing AI.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The disconnect line', icon: '!', iconRed: true, headlineHtml: 'AI flags · human reviews · <em>human decides</em>',
    blocks: [{ atStep: 1, html: cardRed('THE DISCONNECT LINE', 'Bright line in utility customer-facing AI', ['<strong>AI must never make a customer disconnection decision autonomously.</strong> Public utility commissions enforce strictly.', 'AI can flag accounts for review. AI can recommend payment plans. <strong>AI cannot disconnect a household\'s power without human review.</strong>'], 'Air Canada Moffatt cross-domain applies. Anything the AI tells the customer about their bill or rights is a representation by the utility. <em>Wrong information becomes tariff violation · PUC investigation · regulator letter.</em>') }] },
  { type: 'content', eyebrow: 'Vulnerable customer protection', icon: '2', headlineHtml: 'Elderly · disabled · <em>medically dependent</em>',
    blocks: [{ atStep: 1, html: card('VULNERABLE CUSTOMER PROTECTION', 'Specific in 2026', ['Most jurisdictions have specific protections — elderly, disabled, medically dependent.', '<strong>AI in customer ops must respect these.</strong> Flagged accounts for these customers get human review faster. Communication preferences honoured.'], 'Compliance cost of getting this wrong: class actions · PUC fines · media coverage that damages public trust for years.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Correction rate · <em>documented review path</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CUSTOMER-OPS AI', '2 questions', ['<strong>Q1:</strong> AI explanations correction rate — "AI said X, X was wrong" reports? <2% green · <strong>>5% red — AI producing wrong content</strong>.', '<strong>Q2:</strong> documented human review path for AI-flagged accounts before any disconnection? Yes green · <strong>no = regulatory failure waiting to happen</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit one week of AI-generated customer communications', ['Pick 10 randomly · read for accuracy + tone. <strong>2 with errors → your system needs work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Cybersecurity · <em>OT + IT + AI is one problem</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 use cases · disconnect line · vulnerable customer protection · 2-question scoring.', '<strong>Next:</strong> AI cybersecurity for critical infra. 4 attack vectors. 3 defensive patterns.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Cybersecurity for AI in critical infrastructure' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-cyber.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · OT + IT + AI = ONE PROBLEM', h1Html: '4 attack vectors · 3 defensive patterns · <em>vendor security</em>', subtitleHtml: '<strong>The historical air gap is gone in most utilities. AI bridges OT and IT. That bridge is the new attack surface.</strong>' },
  { type: 'content', eyebrow: 'The OT+IT+AI stack', icon: '1', headlineHtml: 'AI bridges OT and IT · <em>new attack surface</em>',
    blocks: [{ atStep: 1, html: card('THE OT+IT+AI STACK', 'Where utilities are exposed', ['<strong>OT — operational technology:</strong> SCADA · EMS · DMS. Controls the grid.', '<strong>IT — information technology:</strong> Enterprise systems · customer data · forecasting models.', '<strong>AI:</strong> increasingly bridges both. Forecasts feed dispatch. Predictive maintenance pulls OT data into ML pipelines.'], 'The historical air gap is gone. <strong>AI requires data flowing across OT-IT boundaries. That data flow is what attackers target.</strong>') }] },
  { type: 'content', eyebrow: '4 attack vectors', icon: '!', iconRed: true, headlineHtml: 'Poisoning · evasion · exfiltration · <em>supply chain</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('V1', 'Data poisoning', '', 'Adversaries inject corrupted training data to bias model behaviour. <strong>Effects show months later. Hard to detect.</strong>', 'red')}
${cell('V2', 'Model evasion', '', 'Inputs crafted to make model misclassify. Demonstrated against image + time-series models alike.', 'red')}
${cell('V3', 'Model exfiltration', '', 'Stealing the model itself. IP loss + reduced security posture if copy in adversary hands.', 'red')}
${cell('V4', 'Supply chain compromise', '', 'Vendor\'s model update is compromised. <strong>Pulls compromise into utility systems.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: '3 defensive patterns', icon: '2', headlineHtml: 'Segmentation · monitoring · <em>vendor terms</em>',
    blocks: [{ atStep: 1, html: cardGreen('3 DEFENSIVE PATTERNS', 'Operational discipline', ['<strong>1. Segmented model training.</strong> Training data in segmented environments. Production models served via controlled APIs, not direct file access.', '<strong>2. Model behaviour monitoring.</strong> Real-time monitoring for unexpected behaviour. Sudden prediction shift → human review before action.', '<strong>3. Vendor model security in contracts.</strong> Demonstrate secure development · supply chain integrity · incident response. In writing. Tested.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Real-time monitoring · <em>vendor security terms</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI CYBERSECURITY', '2 questions', ['<strong>Q1:</strong> AI models in critical operational paths — real-time monitoring for abnormal behaviour? Yes green · daily review amber · <strong>no real-time = red</strong>.', '<strong>Q2:</strong> AI vendor contracts include cybersecurity terms (supply chain integrity · incident notification · audit rights)? New yes green · mixed amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one production AI model bridging OT and IT', ['Ask security + AI teams jointly: <strong>worst attack vector against this model? How would we detect? How quickly?</strong> Answer is your roadmap priority.']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'OT+IT+AI stack · 4 attack vectors · 3 defensive patterns · 2-question scoring.', '<strong>Last chapter:</strong> 18-month rollout · 4 trust trip-wires · interactive builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',seq:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='energy-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var s=state.seq||'_(pick sequencing)_';var sp=state.sponsor||'_(pick sponsor)_';return '# Energy AI · 18-Month Roadmap\\n\\n**CIO / COO sponsor:** ____________________\\n**Start date:** ____________________\\n\\n## Starting play\\n> '+p+'\\n\\n## Sequencing\\n> '+s+'\\n\\n## Executive sponsor\\n> '+sp+'\\n\\n## Months 1-6: Foundations\\n- Data + infrastructure in place\\n- Strong demand forecasting in production\\n- One predictive maintenance pilot with safety guardrails\\n- Operator-in-the-loop training programs underway\\n\\n## Months 7-12: Scale value plays\\n- Generation optimisation if material renewables\\n- Customer-ops AI live with human review path documented\\n- Cybersecurity baselined for AI bridging OT and IT\\n\\n## Months 13-18: Operating discipline\\n- AI portfolio managed as portfolio\\n- Model lifecycle in place\\n- Regulator engagement active\\n- Champions network across grid ops, generation, customer ops\\n\\n## 4 trust trip-wires (do not cross)\\n- AI that bypasses grid operator judgement — regulatory approval will be lost\\n- AI that eliminates safety inspection — OSHA + equivalents are watching\\n- AI making autonomous customer disconnection decisions — PUCs do not allow\\n- AI cybersecurity treated as IT problem alone — AI bridges OT and IT\\n\\n---\\nSource: Gennoor Academy · AI for Energy & Utilities\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your energy AI roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 18-MONTH ROADMAP', h1Html: '3 phases · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Reliability first. Safety non-negotiable. Regulator-aware in every decision.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Augment reliability · <em>not threaten it</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Grid stability and human safety are non-negotiable', ['Every AI decision is filtered through that constraint.']) }] },
  { type: 'content', eyebrow: '18-month rollout', icon: '2', headlineHtml: 'Foundations · scale · <em>operating discipline</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1-6', 'Foundations', '', 'Data + infra · demand forecasting in production · maintenance pilot · operator-in-the-loop training.')}
${cell('M7-12', 'Scale value plays', '', 'Generation optimisation · customer-ops AI with human review · cyber baseline for OT+IT+AI.', 'amber')}
${cell('M13-18', 'Operating discipline', '', 'AI as portfolio · model lifecycle · regulator engagement · champions network.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Bypass operator · eliminate inspection · auto-disconnect · <em>IT-only cyber</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'AI bypasses operator judgement', '', 'Regulatory approval will be lost first time something goes wrong.', 'red')}
${cell('W2', 'AI eliminates safety inspection', '', 'OSHA + equivalents watching. <strong>Extend cadence with AI; never eliminate.</strong>', 'red')}
${cell('W3', 'Autonomous customer disconnection', '', 'PUCs do not allow. <strong>Human review path required.</strong>', 'red')}
${cell('W4', 'IT-only cybersecurity for AI', '', 'AI bridges OT and IT. <strong>Cybersecurity must too.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · sequence · sponsor · <em>take to CIO/COO/board</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting play</h5><div class="preset" data-group="play">
<button data-val="Demand forecasting — most mature, lowest risk, foundational">Demand forecasting</button>
<button data-val="Predictive maintenance — capital deferral with safety guardrails">Predictive maintenance</button>
<button data-val="Generation optimisation — for utilities with material renewables">Generation optimisation</button>
<button data-val="Customer ops — high volume, lower stakes, customer-facing">Customer ops</button>
</div></div>
<div class="group"><h5>Sequencing</h5><div class="preset" data-group="seq">
<button data-val="Foundation first — strong forecasting then expand sequentially">Foundation first</button>
<button data-val="Pilot multiple plays in parallel — faster but more complex">Parallel pilots</button>
<button data-val="One-play-at-a-time — sequential rollout with full operational integration before next">One at a time</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="CIO — IT-led with COO alignment on operations">CIO</button>
<button data-val="COO — operations-led with CIO alignment on data + platform">COO</button>
<button data-val="Joint CIO + COO with board AI committee oversight">Joint CIO + COO</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my energy AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Energy AI · 18-Month Roadmap

Pick starting play, sequencing, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Reliability through-line · 5 plays · operator-in-loop · <em>safety · disconnect line · OT+IT+AI cyber</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI must augment operational reliability, not threaten it · five plays — demand forecasting, grid management, generation optimisation, predictive maintenance, customer ops · operator-in-the-loop is non-negotiable · safety inspection extended by AI, never eliminated · customer disconnection requires human review · OT plus IT plus AI cybersecurity is one problem, not three · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting play and sponsor.</div><div class="row"><span class="arr">→</span>Get one CIO or COO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 25 chapters 1-8 built.')
