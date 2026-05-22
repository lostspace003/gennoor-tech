// Course 32 — AI for Operations & Supply Chain (Andrew · doc 05 #8)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Ops · AI for Operations + Supply Chain'
const OUT = 'tmp/academy-build/ai-for-operations-supply-chain/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The ops + supply chain AI landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · OPS AI QUIETLY COMPOUNDS', h1Html: '6 plays · 3 anti-plays · <em>data-stable filter</em>', subtitleHtml: '<strong>Unlike sales/marketing AI, ops AI rarely shows on homepage. But every % point flows straight to the P&L.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Unglamorous · <em>compounds year on year</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Operational AI quietly compounds', ['Customers don\'t see it. But every percentage point of working capital, every reduction in stock-out, every gain in efficiency flows straight to the P&L.'], 'Teams that get this right invest in unglamorous plays. <em>Year on year, those plays compound.</em>') }] },
  { type: 'content', eyebrow: '6 plays that ship', icon: '2', headlineHtml: 'Forecasting · procurement · logistics · maintenance · inventory · <em>supplier risk</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'Demand forecasting', '', 'Hierarchical forecasts at SKU + location level.', 'green')}
${cell('P2', 'Procurement automation', '', 'Document AI · supplier matching · contract intelligence.', 'green')}
${cell('P3', 'Logistics optimization', '', 'Routing · capacity allocation · last-mile slot optimisation.', 'green')}
${cell('P4', 'Predictive maintenance', '', 'Sensor data + AI surfaces failures before they happen.', 'green')}
${cell('P5', 'Inventory intelligence', '', 'Dynamic safety stock · allocation · store-level targets.', 'green')}
${cell('P6', 'Supplier risk monitoring', '', 'Multi-source signal aggregation · early warning.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-plays', icon: '!', iconRed: true, headlineHtml: 'Autonomous on high-stakes · ML without OR · <em>set-and-forget</em>',
    blocks: [{ atStep: 1, html: cardRed('3 OPS AI ANTI-PLAYS', 'Predictable failures', ['<strong>1. Autonomous decisions on high-stakes moves.</strong> Capacity contracts · supplier termination · production stops. Human in loop. Always.', '<strong>2. Pure ML without operations-research integration.</strong> Real ops have constraints — truck/plant capacity, contracts. AI + OR is the working pattern.', '<strong>3. Set-and-forget models.</strong> Models that worked last year break this quarter without ongoing investment.']) }] },
  { type: 'content', eyebrow: 'The data-stable filter', icon: '3', headlineHtml: 'Match the play · <em>to the data reality</em>',
    blocks: [
      { atStep: 1, html: card('THE DATA-STABLE FILTER', 'Critical for picking starting plays', ['<strong>Data stable + accurate + accessible:</strong> AI plays ship reliably. Demand forecasting on clean SKU-store history. Predictive maintenance on consistent sensor data.', '<strong>Data unstable + inconsistent + sparse:</strong> AI plays disappoint. Supplier data manually maintained in regional spreadsheets. CRM data incomplete.'], '<strong>Discipline:</strong> match the play to the data reality. Ready → ship now. Not ready → fix data before deploying AI.') },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick the one play your function is most actively pursuing', ['Next 7 chapters give operational discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Demand forecasting · <em>the MAPE trap + hierarchical reality</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Ops AI quietly compounds · 6 plays · 3 anti-plays · data-stable filter.', '<strong>Next:</strong> MAPE trap · FVA discipline · 3 architectures · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Demand forecasting at scale' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-forecasting.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · MAPE TRAP', h1Html: 'FVA · hierarchical · <em>tail-event accuracy</em>', subtitleHtml: '<strong>Top quartile <20% MAPE at SKU-store. Many enterprises at 30-40% don\'t realise it.</strong>' },
  { type: 'content', eyebrow: 'The MAPE trap', icon: '!', iconRed: true, headlineHtml: 'Average hides tail risk · <em>FVA is the real metric</em>',
    blocks: [{ atStep: 1, html: cardRed('THE MAPE TRAP', 'Most leaders ask one question', ['"What\'s our MAPE?" feels right. <strong>It is not the only one.</strong>', '<strong>Why MAPE alone misleads:</strong> average accuracy hides tail risk. 19% MAPE on average + catastrophically miss holiday + miss every promo week.'], '<strong>What actually matters:</strong> Forecast Value Add (FVA) — where in the chain is accuracy added or lost? Plus tail-event accuracy on peaks, holidays, supply disruptions specifically.') }] },
  { type: 'content', eyebrow: 'Hierarchical reality', icon: '1', headlineHtml: 'Bottom-up + reconciliation · <em>most enterprises sit at 30-40% MAPE</em>',
    blocks: [{ atStep: 1, html: card('HIERARCHICAL FORECASTING REALITY', 'Different levels = different signal-to-noise', ['You don\'t forecast at one level. Category · sub-category · brand · SKU · location · channel.', '<strong>Pattern that works:</strong> bottom-up + reconciliation. Forecast at most granular level. Roll up. Reconcile against top-down constraints — budget, capacity, contracts.'], '<strong>Top quartile: <20% MAPE at SKU-store.</strong> Many enterprises at 30-40% and don\'t realise. <em>Gap is often hierarchical discipline, not model sophistication.</em>') }] },
  { type: 'content', eyebrow: '3 architectures', icon: '2', headlineHtml: 'GBM · hybrid stats + ML · <em>deep learning</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('A1', 'Gradient Boosted Machines', '', 'LightGBM · XGBoost · CatBoost. Stable. Explainable. <strong>Default for most enterprise.</strong>', 'green')}
${cell('A2', 'Hybrid stats + ML', '', 'Classical seasonality + ML residual. <strong>Often top of M5 benchmarks.</strong>', 'green')}
${cell('A3', 'Deep learning', '', 'Transformer time-series for long-horizon/multivariate. Competitive. Harder to debug.')}
</div>` }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'MAPE · tail accuracy · <em>FVA cadence</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DEMAND FORECASTING', '3 questions', ['<strong>Q1:</strong> SKU-store MAPE for top 50% revenue? <20% green · 20-30% amber · <strong>>30% red — invest</strong>.', '<strong>Q2:</strong> tail-event accuracy? Pull last holiday/disruption. Similar to average or substantial degradation? <strong>Significant degradation = tail risk.</strong>', '<strong>Q3:</strong> FVA analysis run quarterly? Yes green · annual amber · <strong>never red — you don\'t know if AI helps</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last 12 months forecast accuracy · run FVA', ['Where in the chain is accuracy added or lost? <strong>That answer is your investment priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Procurement automation · <em>AI + OR delivers savings</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'MAPE trap · hierarchical reality · 3 architectures · 3-question scoring.', '<strong>Next:</strong> 3 procurement use cases · 3-tier human-in-loop · audit + compliance posture.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Procurement automation' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-procurement.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · AI + OR DELIVERS SAVINGS', h1Html: '3 use cases · 3-tier review · <em>audit posture</em>', subtitleHtml: '<strong>Match AI autonomy to decision impact. Routine + low-impact = autonomous. Strategic + high-impact = human-led.</strong>' },
  { type: 'content', eyebrow: '3 procurement AI use cases', icon: '1', headlineHtml: 'Doc AI · supplier matching · <em>contract intelligence</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Document AI', '', 'RFPs · contracts · invoices · supplier registrations. AI extracts structured data. <strong>Frees procurement from data entry.</strong>', 'green')}
${cell('UC 2', 'Supplier matching', '', 'AI maps demand to suppliers across capability, capacity, geography, risk. <strong>Surfaces options manual misses.</strong>', 'green')}
${cell('UC 3', 'Contract intelligence', '', 'AI summarises long contracts · flags non-standard clauses · surfaces renewal + risk exposures.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3-tier human-in-loop', icon: '2', headlineHtml: 'Autonomous · AI-assisted · <em>human-led</em>',
    blocks: [{ atStep: 1, html: card('3-TIER HUMAN-IN-LOOP FRAMEWORK', 'Match AI autonomy to decision impact', ['<strong>Tier 1 — autonomous extraction.</strong> Routine doc processing. Invoice line items · PO matching · supplier onboarding. AI processes, exceptions human-reviewed.', '<strong>Tier 2 — AI-assisted decision.</strong> Supplier shortlisting · contract risk flagging. AI proposes. Procurement professional decides.', '<strong>Tier 3 — human-led with AI support.</strong> Strategic sourcing · critical-category vendor selection · contract negotiation. Human leads. AI provides intelligence on demand.'], '<strong>Discipline:</strong> routine + low-impact = autonomous. Strategic + high-impact = human-led.') }] },
  { type: 'content', eyebrow: 'Audit + compliance posture', icon: '!', iconRed: true, headlineHtml: 'Every AI-augmented decision logged · <em>reviewer + AI rec + final decision + deviation rationale</em>',
    blocks: [{ atStep: 1, html: cardRed('AUDIT + COMPLIANCE POSTURE', 'Procurement = company spend + supplier relationships + regulatory standing', ['<strong>What works:</strong> every AI-augmented decision logged. Reviewer\'s identity · AI\'s recommendation · human\'s final decision · any deviation rationale documented.', '<strong>What doesn\'t:</strong> AI making procurement decisions without traceable human accountability. <em>Auditor or regulator finds the gap.</em>'], 'For regulated industries — defense · government · pharma — additional documentation requirements apply.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Extraction accuracy · <em>audit trail</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PROCUREMENT AI', '2 questions', ['<strong>Q1:</strong> AI-extracted data feeding ERP/contract systems — verified accuracy last quarter? >95% green · 90-95% amber · <strong><90% red — re-work cost exceeds savings</strong>.', '<strong>Q2:</strong> AI-assisted decisions — audit trail complete and recoverable? Yes green · mostly amber · no/unknown red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull 10 random AI-augmented procurement decisions from last quarter', ['Can you trace AI input + human review + final decision? <strong>That trail completeness = your audit-readiness indicator.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Logistics optimization · <em>AI augments OR, not replaces</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 use cases · 3-tier framework · audit posture · 2-question scoring.', '<strong>Next:</strong> AI + OR principle · 3 use cases · 3 failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Logistics optimization' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-logistics.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · AI + OR PRINCIPLE', h1Html: 'AI improves inputs · <em>OR does optimisation</em>', subtitleHtml: '<strong>Decades-old operations research has mature solvers. AI gives them cleaner data. Removing OR usually makes things worse.</strong>' },
  { type: 'content', eyebrow: 'The AI + OR principle', icon: '1', headlineHtml: 'AI improves inputs · <em>OR solver still does the optimisation</em>',
    blocks: [{ atStep: 1, html: card('THE AI + OR PRINCIPLE', 'Decades-old operations research', ['Logistics optimization is decades-old OR. <strong>Vehicle routing · bin packing · capacity planning · network flow.</strong> Formal mathematical problems with mature solvers.', '<strong>What AI changes:</strong> improves the inputs. Better demand forecasts · better travel time predictions · better service-time estimates. <em>OR solver still does the optimisation. AI gives it cleaner data.</em>', '<strong>What doesn\'t change:</strong> the mathematical optimisation itself. Remove OR + try ML alone → usually worse.'], 'Teams that get this right: AI as input quality · OR as optimizer · continuous improvement on both.') }] },
  { type: 'content', eyebrow: '3 use cases', icon: '2', headlineHtml: 'Last-mile · capacity allocation · <em>slot optimisation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Last-mile routing', '', 'AI predicts travel times · service times · customer windows. OR builds the route. Drivers execute.', 'green')}
${cell('UC 2', 'Capacity allocation', '', 'AI forecasts demand by lane + time. OR allocates trucks · drivers · dock doors to meet demand.', 'green')}
${cell('UC 3', 'Slot optimisation', '', 'For appointment windows. AI predicts customer flexibility. OR optimises promise times vs capacity.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'AI without OR · stale inputs · <em>weak override paths</em>',
    blocks: [{ atStep: 1, html: cardRed('3 LOGISTICS AI FAILURE MODES', 'Patterns to avoid', ['<strong>1. AI without OR.</strong> "Let\'s use ML for routing." Suboptimal routes. Real cost.', '<strong>2. OR with stale AI inputs.</strong> Forecasts not updated · travel predictions not refreshed. Optimizer solving last quarter\'s problem.', '<strong>3. Black-box automation without exception handling.</strong> AI + OR generates plan. Edge cases (weather, accidents, dock issues) need human override. <em>Weak override paths break optimisation operationally.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Measurable improvement · <em>override workflow</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE LOGISTICS AI', '2 questions', ['<strong>Q1:</strong> last quarter — optimised routing reduced miles/time/cost vs previous baseline? Yes green · inconsistent amber · <strong>no/hard-to-tell red — measurement framework missing</strong>.', '<strong>Q2:</strong> exception scenarios — dispatchers can override easily? Yes green · with effort amber · <strong>no/fights system red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sit with a dispatcher for an hour · watch them work with AI + OR', ['When accept? When override? Override workflow? <strong>Their pattern tells you whether system genuinely helps or fights them.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Predictive maintenance · <em>sensor + narrative pattern</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'AI + OR principle · 3 use cases · 3 failure modes · 2-question scoring.', '<strong>Next:</strong> economics of predictive vs preventive vs reactive · 3 components · safety constraint.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Predictive maintenance' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-maintenance.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · SENSOR + NARRATIVE', h1Html: '3 components · <em>safety constraint</em>', subtitleHtml: '<strong>Best total cost when done well. Worst when done poorly. Discipline separates the two.</strong>' },
  { type: 'content', eyebrow: 'The economics', icon: '1', headlineHtml: 'Reactive · preventive · <em>predictive</em>',
    blocks: [{ atStep: 1, html: card('PREDICTIVE MAINTENANCE ECONOMICS', '3 modes · increasing sophistication', ['<strong>Reactive:</strong> equipment fails, you fix it. Most expensive total cost.', '<strong>Preventive:</strong> schedule-based replacement regardless of condition. Better. Still wasteful.', '<strong>Predictive:</strong> condition-based using sensor + AI. Replace when actually needed. <strong>Best total cost done well. Worst done poorly.</strong>'], 'Discipline separates the two. <em>Sensor quality · model quality · maintenance crew training · operational discipline.</em>') }] },
  { type: 'content', eyebrow: '3 components', icon: '2', headlineHtml: 'Sensors · model · <em>maintenance narrative</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('C1', 'Quality sensors', '', 'Vibration · temperature · current · oil chemistry. Installed correctly · calibrated regularly · reliable signal.', 'green')}
${cell('C2', 'Predictive model', '', 'Anomaly detection minimum. Remaining-useful-life when data supports. Each asset class needs own model.', 'green')}
${cell('C3', 'Maintenance narrative', '', 'Surfaces "30% failure probability in 90 days" + context — what type · early signals · what to inspect first.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The safety constraint', icon: '!', iconRed: true, headlineHtml: 'AI extends inspections · <em>never eliminates</em>',
    blocks: [{ atStep: 1, html: cardRed('THE SAFETY CONSTRAINT', 'Critical and non-negotiable', ['Predictive maintenance must NOT eliminate human inspection on high-consequence equipment. <strong>AI extends inspection intervals sometimes. AI never replaces them entirely.</strong>', 'OSHA + equivalent regulators + your own safety teams will hold you to this. <em>Document the AI-plus-human-inspection logic.</em>'], '<strong>What works:</strong> AI prioritises inspection schedules · human inspectors verify high-priority first · routine inspections continue on baseline cadence. <strong>What doesn\'t:</strong> AI predicts "skip inspection" → failure during operation → workers hurt → production stopped → regulatory consequence.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Missed predictable failures · <em>team trust</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PREDICTIVE MAINTENANCE', '2 questions', ['<strong>Q1:</strong> last 12 months — AI missed predictable failures? 0-1 green · 2-4 amber · <strong>5+ red — model needs retraining</strong>.', '<strong>Q2:</strong> maintenance team trusts AI predictions enough to act? Yes consistently green · mixed amber · no/rarely red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter\'s failures that surprised the AI', ['What did the model miss? <strong>That blind spot = retraining priority before the next surprise.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Inventory intelligence · <em>dynamic safety stock + allocation</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Economics · 3 components · safety constraint · 2-question scoring.', '<strong>Next:</strong> the inventory tradeoff · 3 use cases · 3 failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Inventory intelligence' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-inventory.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · DYNAMIC SAFETY STOCK', h1Html: '3 use cases · 3 failure modes · <em>same service · less inventory</em>', subtitleHtml: '<strong>Less buffer where AI confident. More where uncertain. Same service level. Substantially lower inventory.</strong>' },
  { type: 'content', eyebrow: 'The inventory tradeoff', icon: '1', headlineHtml: 'Overstock vs understock · <em>AI changes the math</em>',
    blocks: [{ atStep: 1, html: card('THE INVENTORY TRADEOFF', 'Two failure modes', ['<strong>Overstock:</strong> capital tied up · storage cost · write-off risk.', '<strong>Understock:</strong> stock-outs · lost sales · customer dissatisfaction.', 'Traditional safety stock optimises for one — usually understock. <strong>Buffer stock everywhere. Working capital tied up.</strong>'], '<strong>Dynamic safety stock with AI:</strong> forecast-driven · location-specific · time-varying. Less buffer where confident. More where uncertain. <em>Same service level. Substantially lower inventory.</em>') }] },
  { type: 'content', eyebrow: '3 use cases', icon: '2', headlineHtml: 'Dynamic safety stock · allocation · <em>markdown timing</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Dynamic safety stock', '', 'AI predicts demand variability per SKU per location. Safety stock adjusts continuously. <strong>Capital working harder.</strong>', 'green')}
${cell('UC 2', 'Allocation optimisation', '', 'DC → stores. AI optimises the split. Right SKU mix at right location. <strong>Minimum waste.</strong>', 'green')}
${cell('UC 3', 'Markdown timing', '', 'Seasonal · fashion · perishable. AI predicts demand curves. <strong>Right SKUs marked at right time to clear without leaving margin.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'No single source · peak-blind · <em>markdown panic</em>',
    blocks: [{ atStep: 1, html: cardRed('3 INVENTORY AI FAILURE MODES', 'Predictable patterns', ['<strong>1. Single-source-of-truth demand not enforced.</strong> Sales · ops · finance each have own forecast. Disagree. Decisions on whichever number the decider liked.', '<strong>2. Peak-event blindness.</strong> AI optimised for normal weeks. Holiday · weather · viral moment breaks model. Stock-outs or major overstock.', '<strong>3. Markdown panic.</strong> AI surfaces markdowns conservatively. Buyers override aggressively late season. <em>AI insights ignored. Margin destroyed unnecessarily.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Single source · both metrics · <em>peak performance</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INVENTORY AI', '3 questions', ['<strong>Q1:</strong> single source of truth on demand for inventory? Yes green · multiple-but-reconciled amber · multiple-unreconciled red.', '<strong>Q2:</strong> last year — AI-supported inventory reduced both stock-out AND inventory dollars? Both yes green · one yes amber · <strong>no red — AI not paying back</strong>.', '<strong>Q3:</strong> peak events — AI performed as well as normal weeks? Yes green · slightly degraded amber · <strong>substantially degraded red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last year\'s inventory turns + stock-out rate', ['Both moved the right direction? <strong>Only one or both wrong = AI inventory health indicator.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Supplier risk · <em>multi-source signal aggregation</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Inventory tradeoff · 3 use cases · 3 failure modes · 3-question scoring.', '<strong>Next:</strong> 5 signal sources · 4-phase response cadence · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Supplier risk monitoring' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-supplier-risk.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · MATTERS MORE NOW', h1Html: '5 signal sources · <em>4-phase response cadence</em>', subtitleHtml: '<strong>Geopolitical · climate · cyber · financial — multi-source AI catches issues weeks earlier than manual.</strong>' },
  { type: 'content', eyebrow: 'Why this matters more now', icon: '1', headlineHtml: 'Geopolitical · climate · cyber · <em>financial</em>',
    blocks: [{ atStep: 1, html: card('WHY SUPPLIER RISK MATTERS MORE IN 2026', '4 dimensions', ['<strong>Geopolitical:</strong> trade restrictions · tariffs · sanctions affect supply chains directly.', '<strong>Climate:</strong> extreme weather disrupts supplier operations more frequently.', '<strong>Cyber:</strong> supplier breaches affect your operations. SolarWinds · MOVEit reshaped the conversation.', '<strong>Financial:</strong> supplier insolvency in tight credit environments. Especially mid-tier without easy alternatives.'], 'AI-augmented monitoring surfaces these earlier than manual approaches can.') }] },
  { type: 'content', eyebrow: '5 signal sources', icon: '2', headlineHtml: 'News · financial · geo+climate · cyber · <em>operational</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'News + social', '', 'AI scans for disruption · financial trouble · regulatory action mentions.', 'green')}
${cell('S2', 'Financial signals', '', 'Credit rating changes · payment behaviour · filings.', 'green')}
${cell('S3', 'Geographic + climate', '', 'Weather · infrastructure · regional unrest at supplier locations.', 'green')}
${cell('S4', 'Cyber', '', 'Threat intel on supplier-targeted attacks · public breach notifications.', 'green')}
${cell('S5', 'Operational', '', 'Delivery · quality · communication patterns. <strong>Often earliest signal.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4-phase response cadence', icon: '3', headlineHtml: 'Monitor · assess · engage · <em>contingency</em>',
    blocks: [{ atStep: 1, html: cardGreen('THE 4-PHASE RESPONSE CADENCE', 'Without it: AI surfaces · nothing happens', ['<strong>Phase 1 — monitoring.</strong> Continuous. AI background. Signals tracked.', '<strong>Phase 2 — assessment.</strong> AI surfaces moderate-risk supplier. Procurement reviews. Real? Material? Alternative?', '<strong>Phase 3 — engagement.</strong> If risk confirmed, engage supplier. Conversation. Plan together where possible.', '<strong>Phase 4 — contingency.</strong> If severe, activate alternative supplier plan. Pre-vetted. Pre-contracted. Ready to scale.'], 'Without 4-phase cadence: AI surfaces risks. Nothing happens. <em>Disruption hits anyway.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Early-warning value · <em>top-supplier contingency</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SUPPLIER RISK AI', '2 questions', ['<strong>Q1:</strong> last 12 mo — AI surfaced risk early enough to act on? 3+ significant events green · 1-2 amber · <strong>0/all-too-late red</strong>.', '<strong>Q2:</strong> top critical suppliers — pre-vetted alternative or contingency plan? Yes green · some amber · <strong>no red — single point of failure</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List top 10 suppliers by spend or criticality', ['For each: what alternative would you activate if they disappeared tomorrow? <strong>That mental exercise = supplier risk readiness indicator.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 risk dimensions · 5 signal sources · 4-phase cadence · 2-question scoring.', '<strong>Last chapter:</strong> end-to-end visibility reality · 18-month rollout · 4 trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',pair:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ops-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var pa=state.pair||'_(pick integration pair)_';var s=state.sponsor||'_(pick sponsor)_';return '# Ops + Supply Chain AI · 18-Month Roadmap\\n\\n**COO / Chief Supply Chain Officer:** ____________________\\n**Start date:** ____________________\\n\\n## Starting play\\n> '+p+'\\n\\n## Adjacent integration pair (months 7-12)\\n> '+pa+'\\n\\n## Executive sponsor\\n> '+s+'\\n\\n## Months 1-6: Foundation play\\n- Pick play with strongest data\\n- Get it shipping operational value\\n\\n## Months 7-12: Adjacent play + integration\\n- Add second play integrated with first\\n- Genuine integration. Not interface.\\n\\n## Months 13-18: Operating discipline + third play\\n- AI portfolio managed\\n- Model lifecycle in place\\n- FVA quarterly\\n\\n## 4 trust trip-wires (do not cross)\\n- Autonomous decisions on high-stakes ops moves — human in loop always\\n- AI without OR for logistics — sub-optimal costs real money\\n- Set-and-forget models — operational reality changes, models need retraining\\n- AI predicting "skip inspection" on safety-critical — OSHA cross-domain\\n\\n---\\nSource: Gennoor Academy · AI for Operations & Supply Chain\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your ops AI roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 18-MONTH ROADMAP', h1Html: 'End-to-end visibility · 18 months · <em>4 trip-wires · the builder</em>', subtitleHtml: '<strong>Start with two adjacent plays. Genuinely integrate. Then expand.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Quietly compounds · <em>year on year</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Operational AI quietly compounds', ['Unlike sales/marketing AI, ops AI rarely shows on homepage. <strong>But it shows on the P&L year on year.</strong>']) }] },
  { type: 'content', eyebrow: 'End-to-end visibility', icon: '2', headlineHtml: 'Real integration · <em>not interface</em>',
    blocks: [{ atStep: 1, html: card('END-TO-END VISIBILITY · WHAT IT IS', 'Not what most vendors sell', ['<strong>What it is:</strong> demand forecasts inform inventory · inform procurement · inform logistics · inform maintenance — all sharing same view in real time.', '<strong>What it isn\'t:</strong> a vendor dashboard. Most "end-to-end visibility" products are interface, not integration. <em>Integration takes years of data work.</em>'], '<strong>What works:</strong> start with 2 adjacent plays (forecasting + inventory · or procurement + supplier risk). Get them genuinely integrated. Then expand. <strong>What doesn\'t:</strong> big-bang end-to-end integration project. 3 years. Tens of millions. Often abandoned.') }] },
  { type: 'content', eyebrow: '18-month rollout', icon: '3', headlineHtml: 'Foundation · adjacent + integration · <em>third + discipline</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1-6', 'Foundation play', '', 'Pick play where data is strongest. Forecasting or maintenance usually. Ship operational value.')}
${cell('M7-12', 'Adjacent + integration', '', 'Add inventory integrated with forecasting. Or supplier risk with procurement. <strong>Genuine integration.</strong>', 'amber')}
${cell('M13-18', 'Third play + operating discipline', '', 'Logistics or procurement automation. AI portfolio managed. FVA quarterly.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Autonomous high-stakes · AI without OR · set-and-forget · <em>skip inspection</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Autonomous on high-stakes ops', '', 'Capacity contracts · supplier termination · production stops. Human in loop. Always.', 'red')}
${cell('W2', 'AI without OR for logistics', '', 'Sub-optimal. Costs real money.', 'red')}
${cell('W3', 'Set-and-forget models', '', 'Ops reality changes. Need retraining + stress testing + quarterly FVA.', 'red')}
${cell('W4', 'AI says "skip inspection" on safety-critical', '', 'OSHA cross-domain. <strong>Worker safety non-negotiable.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · pair · sponsor · <em>take to COO</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting play</h5><div class="preset" data-group="play">
<button data-val="Demand forecasting — most mature, strongest data foundation">Demand forecasting</button>
<button data-val="Predictive maintenance — clear ROI with safety guardrails">Predictive maintenance</button>
<button data-val="Procurement automation — document AI + supplier matching">Procurement automation</button>
<button data-val="Supplier risk monitoring — multi-source signal aggregation">Supplier risk</button>
</div></div>
<div class="group"><h5>Adjacent integration pair (months 7-12)</h5><div class="preset" data-group="pair">
<button data-val="Demand forecasting + Inventory intelligence — most natural pair">Forecasting + Inventory</button>
<button data-val="Procurement automation + Supplier risk monitoring">Procurement + Supplier risk</button>
<button data-val="Predictive maintenance + Inventory (spare parts) — operational link">Maintenance + Inventory</button>
<button data-val="Demand forecasting + Logistics optimization">Forecasting + Logistics</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="COO with Chief Supply Chain Officer partnership">COO + CSCO</button>
<button data-val="Chief Supply Chain Officer directly with COO budget partnership">CSCO directly</button>
<button data-val="Joint COO + CSCO + CIO oversight committee">Joint COO + CSCO + CIO</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my ops AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Ops + Supply Chain AI · 18-Month Roadmap

Pick starting play, integration pair, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Quietly compounds · 6 plays · AI+OR · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Operational AI quietly compounds · six plays — demand forecasting, procurement automation, logistics optimization, predictive maintenance, inventory intelligence, supplier risk monitoring · three anti-plays · AI + OR principle · data-stable filter · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting play and integration pair.</div><div class="row"><span class="arr">→</span>Get one COO or Chief Supply Chain Officer conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 32 chapters 1-8 built.')
