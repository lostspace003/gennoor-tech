// Course 26 — AI for Retail & eCommerce (Andrew)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Retail · AI for Retail + eCommerce'
const OUT = 'tmp/academy-build/ai-for-retail-ecommerce/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The retail + eCommerce landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · BRAND BREAKS FAST', h1Html: '5 plays · 3 anti-plays · <em>regulator-aware</em>', subtitleHtml: '<strong>AI scales fast in retail but breaks brand fast. Trust costs more to rebuild than maintain.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Brand · trust · fair pricing · <em>non-negotiable</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'The temptation is real', ['Data is plentiful. Use cases are obvious. Over-personalise, over-automate, over-price — all tempting.', '<strong>Brand integrity, customer trust, fair pricing are lines that don\'t move.</strong>']) }] },
  { type: 'content', eyebrow: '5 plays that ship', icon: '2', headlineHtml: 'Merchandising · pricing · personalisation · <em>fulfilment · returns + fraud</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PLAY 1', 'Merchandising + assortment', '', 'Demand forecasting at SKU-store · NPI · range optimisation. <strong>Quietly compounds.</strong>', 'green')}
${cell('PLAY 2', 'Pricing', '', 'Dynamic pricing within guardrails · markdown optimisation · promo uplift. <strong>Discipline determines outcome.</strong>', 'amber')}
${cell('PLAY 3', 'Personalisation', '', 'Product recs · email · app · on-site. <strong>Where the creepy line lives.</strong>', 'amber')}
${cell('PLAY 4', 'Fulfilment + inventory', '', 'Allocation · replenishment · store-level targets. <strong>Most reliable ROI. Operationally invisible.</strong>', 'green')}
${cell('PLAY 5', 'Returns + fraud', '', 'Return reason classification · fraud detection. Lower glamour, high impact.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-plays', icon: '!', iconRed: true, headlineHtml: 'Auto-pricing no guardrails · surveillance · <em>AI-only service</em>',
    blocks: [{ atStep: 1, html: cardRed('3 ANTI-PLAYS', 'Patterns to avoid', ['<strong>1. Fully automated dynamic pricing without guardrails.</strong> $600 water bottle during hurricane → media + regulators.', '<strong>2. Surveillance-level personalisation.</strong> Customer feels surveilled → leaves. Trust = largest unsecured retail asset.', '<strong>3. AI-only customer service.</strong> Saves year 1. Loses LTV year 2. Air Canada Moffatt cross-domain.']) }] },
  { type: 'content', eyebrow: 'The regulatory frame', icon: '3', headlineHtml: 'FTC · GDPR · EU AI Act Art 5 + 50 · <em>DPDPA</em>',
    blocks: [
      { atStep: 1, html: card('REGULATORY FRAME · 2026', 'Personalisation needs consent · pricing needs to be defensible', ['<strong>US:</strong> FTC on dynamic pricing · state-by-state on personalisation · CCPA baseline.', '<strong>EU:</strong> GDPR · EU AI Act Art 5 (manipulative techniques) · Art 50 (disclosure).', '<strong>India:</strong> DPDPA 2023.', 'Common: customer-facing AI representations are the retailer\'s representations.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick the play your retail org is most actively pursuing', ['Next 7 chapters give you the discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Merchandising · <em>where retail AI quietly compounds</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Brand fast-breakable · 5 plays · 3 anti-plays · regulatory frame.', '<strong>Next:</strong> SKU-store forecasting reality · NPI realism · assortment optimisation.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Merchandising + assortment' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-merchandising.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · QUIETLY COMPOUNDS', h1Html: '3 use cases · <em>SKU-store reality</em>', subtitleHtml: '<strong>Top quartile achieves <20% MAPE at SKU-store. Many enterprises at 30-40% don\'t realise it.</strong>' },
  { type: 'content', eyebrow: '3 merchandising use cases', icon: '1', headlineHtml: 'Demand forecasting · NPI · <em>range optimisation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'SKU-store demand forecasting', '', 'What sells where, when, in what quantity.', 'green')}
${cell('UC 2', 'New product introduction', '', 'Predicting sales before history exists. <strong>Analog-product approach + first-weeks signal.</strong>', 'green')}
${cell('UC 3', 'Range + assortment optimisation', '', 'Which SKUs to keep · drop · rotate.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The SKU-store reality', icon: '2', headlineHtml: '<20% MAPE is top quartile · <em>30-40% is common</em>',
    blocks: [{ atStep: 1, html: card('SKU-STORE FORECASTING REALITY', 'Most retailers oversimplify', ['Category-level forecasting works. <strong>Individual SKU at individual store is harder — sparse data, high variance, noise.</strong>', '<strong>Top quartile: <20% MAPE at SKU-store.</strong> Many enterprises at 30-40% don\'t realise.'], '<strong>What works:</strong> hierarchical forecasting · category-level signal feeds store-level · promo adjustments at SKU · outlier handling explicit.') }] },
  { type: 'content', eyebrow: 'NPI realism', icon: '3', headlineHtml: 'AI helps · <em>AI doesn\'t predict</em>',
    blocks: [{ atStep: 1, html: card('NEW PRODUCT INTRODUCTION REALISM', 'The working pattern', ['<strong>Category expert picks analogs</strong> — 3-5 similar products with known sales curves.', 'AI runs the analog blend and produces a forecast. <strong>Buyer takes responsibility for the buy decision.</strong>', 'After launch — first 2-4 weeks of actual sales rapidly update the forecast.'], '<strong>What doesn\'t work:</strong> pure AI prediction with no analog input · pure history extrapolation when no comparable product exists · treating "novel" like "similar".') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'MAPE · <em>NPI impact</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE MERCHANDISING AI', '2 questions', ['<strong>Q1:</strong> current SKU-store MAPE for top 50% revenue? <20% green · 20-30% amber · <strong>>30% red — invest</strong>.', '<strong>Q2:</strong> last year — AI NPI forecasts contributed to measurable over/under-stock reduction? Yes green · mixed amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one category · pull SKU-store accuracy', ['<strong>Where it misses worst = highest-ROI fix.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Pricing · <em>where AI crosses the regulatory line</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 use cases · SKU-store reality · NPI realism · 2-question scoring.', '<strong>Next:</strong> 3 pricing AI plays · the guardrail discipline · the personalised pricing trap.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Pricing' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-pricing.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · DISCIPLINE DETERMINES OUTCOME', h1Html: '3 plays · guardrails · <em>personalised pricing trap</em>', subtitleHtml: '<strong>Document min, max, brand rules, excluded categories. Or end up explaining yourself.</strong>' },
  { type: 'content', eyebrow: '3 pricing plays', icon: '1', headlineHtml: 'Dynamic · markdown · <em>promo uplift</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PLAY 1', 'Dynamic pricing within guardrails', '', 'Demand-based · competitor-aware. <strong>Constrained by min, max, brand rules.</strong>', 'green')}
${cell('PLAY 2', 'Markdown optimisation', '', 'End-of-season clearance. Maximise sell-through · protect margin.', 'green')}
${cell('PLAY 3', 'Promotional uplift', '', 'Predict promo response · avoid wasted promotion on already-converting customers.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The guardrail discipline', icon: '!', iconRed: true, headlineHtml: 'Non-negotiable · <em>document categories excluded</em>',
    blocks: [{ atStep: 1, html: cardRed('THE GUARDRAIL DISCIPLINE', 'For every pricing AI deployment', ['<strong>Document:</strong> minimum prices · maximum prices · brand-consistency rules. Which categories dynamic pricing applies to. Which it does not.', '<strong>Where it should NOT apply:</strong> essentials during emergencies — water during hurricane · medication during shortage · fuel during crisis.', '<strong>FTC + state AGs take notice. Consumers remember.</strong>']) }] },
  { type: 'content', eyebrow: 'The personalised pricing trap', icon: '2', headlineHtml: 'Personalised offers OK · <em>personalised list prices NOT</em>',
    blocks: [{ atStep: 1, html: cardRed('THE PERSONALISED PRICING TRAP', 'Risk severe · math compelling', ['<strong>Different price on same product based on detected income, location, device = functionally price discrimination.</strong> Increasingly regulated.'], '<strong>What works instead:</strong> personalised offers and bundles, not personalised list prices. Promotional emails · loyalty rewards · app-exclusive — legal and accepted. <em>Personalised list prices break trust the moment they\'re discovered.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Regulatory + PR incidents · <em>documented guardrails</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PRICING AI', '2 questions', ['<strong>Q1:</strong> last 12 months — dynamic pricing required regulatory or PR response? 0 green · 1-2 addressed amber · <strong>repeated red — discipline broken</strong>.', '<strong>Q2:</strong> min/max prices + excluded categories documented per deployment? Yes green · verbal amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull your dynamic pricing categories list', ['Any that shouldn\'t be there? Pull one out this week. <strong>Defensible list is governance hygiene.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Personalisation · <em>3 tiers · the creepy line · trust math</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 plays · guardrail discipline · personalised pricing trap · 2-question scoring.', '<strong>Next:</strong> light/middle/deep personalisation · 3 creepy-line categories · relevant beats clever.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Personalisation' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-personalisation.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · THE CREEPY LINE', h1Html: '3 tiers · <em>3 lines · trust math</em>', subtitleHtml: '<strong>Relevant beats clever. Hidden AI breaks trust. Disclosed AI builds it.</strong>' },
  { type: 'content', eyebrow: '3 personalisation tiers', icon: '1', headlineHtml: 'Light · middle · <em>deep</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Light', '', 'Name · recent category browsing · public history. <strong>Universally acceptable.</strong>')}
${cell('T2', 'Middle', '', 'Recent activity · downloads · declared preferences. First-party. <strong>Default for engaged customers.</strong>', 'green')}
${cell('T3', 'Deep', '', 'Cross-source · inferred · predictive next-need. <strong>Powerful done well. Crosses line done wrong.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '3 creepy-line categories · don\'t cross', icon: '!', iconRed: true, headlineHtml: 'Distress · surveillance · <em>inferred protected</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('L1', 'Health · distress · family events', '', 'Detected pregnancy · bereavement · job loss. <strong>Don\'t reference even if data shows.</strong>', 'red')}
${cell('L2', 'Surveillance-level granularity', '', '"I noticed you visited Tuesday at 3pm." Even if true. <strong>Signals surveillance.</strong>', 'red')}
${cell('L3', 'Inferred protected characteristics', '', 'Age · ethnicity · religion from behaviour. <strong>Bloomberg + Wilson-Caliskan — AI inherits bias.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'The trust math', icon: '2', headlineHtml: 'Relevant beats clever · <em>data is consistent</em>',
    blocks: [{ atStep: 1, html: cardGreen('THE TRUST MATH', 'Counterintuitive but data is consistent', ['<strong>Relevant recommendation:</strong> saves time · discovers products · improves experience.', '<strong>Clever-but-creepy:</strong> discomfort · reduced future trust · sometimes abandonment.'], '<strong>What works:</strong> disclosure of why a recommendation is offered · easy opt-out · honoured opt-out across the system, not just at surface.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Negative feedback rate · <em>opt-out honoured</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PERSONALISATION', '2 questions', ['<strong>Q1:</strong> last quarter negative-feedback rate (unsubscribe · complaint · "creepy")? <1% green · 1-3% amber · <strong>>3% red — crossed the line for meaningful share</strong>.', '<strong>Q2:</strong> opt-out honoured across email + app + on-site + ads? Yes green · mostly amber · <strong>honestly no red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit one personalised campaign · token by token', ['First-party? Consented? Value-adding? <strong>Any no → cleanup this quarter.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Fulfilment + inventory · <em>where operational AI compounds</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 tiers · 3 creepy-lines · trust math · 2-question scoring.', '<strong>Next:</strong> allocation · replenishment · routing. The quiet AI play that delivers the most reliable ROI.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Fulfilment + inventory' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-fulfilment.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · OPERATIONALLY INVISIBLE · P&L VISIBLE', h1Html: '3 use cases · <em>most reliable ROI</em>', subtitleHtml: '<strong>Quieter than personalisation. More durable than dynamic pricing. Real.</strong>' },
  { type: 'content', eyebrow: '3 fulfilment + inventory use cases', icon: '1', headlineHtml: 'Allocation · store targets · <em>last-mile routing</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Allocation + replenishment', '', 'Where to ship inventory · how much · which store/DC. <strong>AI + OR is the working pattern.</strong>', 'green')}
${cell('UC 2', 'Store-level targets', '', 'Per-store safety stock optimised for local demand pattern.', 'green')}
${cell('UC 3', 'Last-mile routing + slot optimisation', '', 'For retailers with delivery. Capacity allocation · customer-promise time.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Why operational AI compounds', icon: '2', headlineHtml: 'Customers don\'t see it · <em>P&L does</em>',
    blocks: [{ atStep: 1, html: cardGreen('WHY OPERATIONAL AI QUIETLY COMPOUNDS', 'Real durable ROI', ['Doesn\'t show on homepage. Customers don\'t see it. <strong>Every percentage point of working capital improvement, every reduction in over/under-stock, every gain in delivery efficiency goes straight to the P&L.</strong>', '<strong>2% improvement in inventory holding cost · 5% reduction in peak stock-out.</strong> Multiplied over thousands of SKUs and hundreds of stores.'], 'This is where retail AI delivers most reliable ROI. <em>Quieter than personalisation. More durable than dynamic pricing. Real.</em>') }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'AI in isolation · forecast cascading · <em>peak blindness</em>',
    blocks: [{ atStep: 1, html: cardRed('3 OPERATIONAL AI FAILURE MODES', 'Patterns to avoid', ['<strong>1. AI in isolation from operations research.</strong> Misses truck capacity · backroom space · workforce hours. <em>AI + OR is the pattern.</em>', '<strong>2. Forecast errors compounding.</strong> Bad SKU-store demand cascades into wrong allocation, wrong target, wrong reorder. <em>Single-source-of-truth signal is the discipline.</em>', '<strong>3. Peak-event blindness.</strong> AI handles normal weeks. Holiday peaks, weather, viral moments break the model. <em>Explicit peak scenario handling needed.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Stock-out without over-stock · <em>peak performance</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FULFILMENT AI', '2 questions', ['<strong>Q1:</strong> last 12 mo — AI allocation reduced stock-outs without increasing over-stock? Yes green · mixed amber · no/hard-to-say red.', '<strong>Q2:</strong> peak events — AI performed as well as normal weeks? Yes green · slightly degraded amber · <strong>significantly degraded red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull one operational AI tool · check last peak performance', ['<strong>Performance gap = investment priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Returns + fraud · <em>lower glamour, high impact</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 use cases · why operational compounds · 3 failure modes · 2-question scoring.', '<strong>Next:</strong> return reason classification · fairness constraints · fraud detection with appeal paths.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Returns + fraud' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-returns-fraud.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · LOW GLAMOUR · HIGH IMPACT', h1Html: 'Returns 20-30% · <em>40%+ apparel</em>', subtitleHtml: '<strong>Returns optimisation is real value. But fairness constraint is real too.</strong>' },
  { type: 'content', eyebrow: 'The returns reality', icon: '1', headlineHtml: '20-30% online · <em>40%+ apparel</em>',
    blocks: [{ atStep: 1, html: card('THE RETURNS REALITY', 'Real cost · real opportunity', ['Most online retailers: 20-30% returns rate. Apparel: 40%+ common.', '<strong>Returns cost shipping · handling · restocking · lost margin.</strong>'], '<strong>AI use cases:</strong> reason classification · personalised fee policy · return-likelihood prediction at purchase · restock vs liquidate decisions.') }] },
  { type: 'content', eyebrow: 'The fairness constraint', icon: '!', iconRed: true, headlineHtml: 'Penalty for return rate · <em>discriminatory potential</em>',
    blocks: [{ atStep: 1, html: cardRed('FAIRNESS CONSTRAINT ON RETURNS', 'The temptation', ['Penalise high-return-rate customers with restocking fees, slower refunds, restricted returns. <em>Math is compelling.</em>'], '<strong>Risks:</strong> disability-related returns · pregnancy size changes · legitimate quality issues clustered around defective batches. <strong>Penalising on raw return rate can become discriminatory.</strong> Document policy. Provide override paths. <em>Don\'t let AI make unappealable customer-impact decisions.</em>') }] },
  { type: 'content', eyebrow: 'Fraud detection', icon: '2', headlineHtml: 'ML score + human review · <em>appeal path required</em>',
    blocks: [{ atStep: 1, html: card('FRAUD DETECTION', 'Mature retail AI area', ['<strong>Common patterns:</strong> card-not-present · stolen identity · promo abuse · refund fraud · wardrobing.', '<strong>What works:</strong> ML scoring at transaction with explicit fraud-flag-to-human-review for borderline cases. Full automation only for very-high-confidence + customer appeal path.', '<strong>What doesn\'t:</strong> blocking on probabilistic score with no review path. <em>Mistakenly blocked customer = media story or class action.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Escalations + false-positive rate · <em>fairness check</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE RETURNS + FRAUD', '2 questions', ['<strong>Q1:</strong> last 12 mo — AI return decision subject of customer escalation or media coverage? 0-1 green · <strong>multiple red — review policy</strong>.', '<strong>Q2:</strong> fraud detection false-positive impact on legitimate customers (blocked per million)? Industry-low green · typical amber · <strong>high red — too many real customers caught</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter fraud decline rate · % were legitimate?', ['That\'s your false-positive cost. <strong>A few percent → tuning problem worth solving.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Brand voice protection · <em>most subtle AI risk</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Returns reality · fairness constraint · fraud detection · 2-question scoring.', '<strong>Next:</strong> brand voice flattens with AI content. 3 protection patterns. Art 50 disclosure. Experimentation discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Brand voice protection' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-brand-voice.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · MOST SUBTLE RISK', h1Html: 'Brand voice flattens · <em>premium retailers lose what made them premium</em>', subtitleHtml: '<strong>3 protection patterns · Art 50 disclosure · experimentation discipline.</strong>' },
  { type: 'content', eyebrow: 'The brand risk', icon: '1', headlineHtml: 'Massive AI content volume · <em>voice drifts to generic median</em>',
    blocks: [{ atStep: 1, html: card('THE BRAND RISK', 'Retailers produce massive content volume', ['Product descriptions · category copy · email subject lines · push notifications · review summaries · search snippets. AI generates much of it now.', '<strong>Risk:</strong> brand voice flattens. Distinctive tone drifts to generic AI median. <em>Premium retailers lose what made them premium.</em>']) }] },
  { type: 'content', eyebrow: '3 voice protection patterns', icon: '2', headlineHtml: 'Style guide as prompt · 2 edits · <em>fingerprint audit</em>',
    blocks: [{ atStep: 1, html: cardGreen('3 VOICE PROTECTION PATTERNS', 'Operating discipline', ['<strong>1. Style guide as system prompt.</strong> 2 pages of tone, words to use/avoid, sentence rhythm. Loaded into every content prompt.', '<strong>2. Two human edits per customer-facing piece.</strong> First catches facts + voice. Second reads as customer.', '<strong>3. Quarterly fingerprint audit.</strong> Random sample · compare against pre-AI baseline. <em>Drifting generic → tighten.</em>']) }] },
  { type: 'content', eyebrow: 'Disclosure + EU AI Act Art 50', icon: '3', headlineHtml: 'Customer-interaction AI · <em>disclose</em>',
    blocks: [{ atStep: 1, html: card('DISCLOSURE + ART 50', 'EU AI Act Article 50', ['Customer-interaction AI in EU — chatbots · AI shopping assistants · AI-generated recommendations. <strong>Art 50 requires the customer be informed they\'re interacting with AI.</strong>', '<strong>Practical:</strong> "You\'re chatting with our AI assistant — ask for a human anytime." AI-generated content marked when required.'], '<strong>Customers respond well to disclosed AI.</strong> Pew + industry surveys consistent. <em>Hidden AI breaks trust. Disclosed AI builds it.</em>') }] },
  { type: 'content', eyebrow: 'The experimentation discipline', icon: '4', headlineHtml: 'A/B test everything · <em>holdout groups + significance</em>',
    blocks: [
      { atStep: 1, html: card('THE EXPERIMENTATION DISCIPLINE', 'Critical for retail AI', ['Retailers have data + volume for proper A/B testing. <strong>Use it.</strong>', 'Every personalisation algorithm change · pricing logic update · chatbot prompt update gets tested against control.', '<strong>What works:</strong> holdout groups maintained · conversion lift measured · CX metrics tracked alongside revenue.', '<strong>What doesn\'t:</strong> vibes-based AI changes. "It feels better." <em>Without statistical significance you\'re guessing.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull 5 AI-generated content pieces from last month', ['Product copy · email · push. Read as customer. <strong>If they sound generic → system prompt isn\'t working hard enough.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Brand risk · 3 protection patterns · Art 50 · experimentation discipline.', '<strong>Last chapter:</strong> 12-month rollout · 4 trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',posture:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='retail-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var po=state.posture||'_(pick guardrail posture)_';var s=state.sponsor||'_(pick sponsor)_';return '# Retail AI · 12-Month Roadmap\\n\\n**CEO / CDO / CMO sponsor:** ____________________\\n**Start date:** ____________________\\n\\n## Starting play\\n> '+p+'\\n\\n## Guardrail posture\\n> '+po+'\\n\\n## Executive sponsor\\n> '+s+'\\n\\n## Quarter 1: Operational foundation\\n- Demand forecasting + allocation + inventory targets running\\n- Quick wins on returns\\n- Foundation in place\\n\\n## Quarter 2: Pricing within guardrails\\n- Markdown optimisation + promotional uplift modelling\\n- Hard guardrails documented and enforced\\n\\n## Quarters 3-4: Personalisation + content at scale\\n- Tier-2 personalisation as default\\n- Tier-3 only for active long-term customer relationships\\n- Brand voice anchor maintained throughout\\n\\n## 4 trust trip-wires (do not cross)\\n- Fully automated dynamic pricing without guardrails — $600 water bottle moment\\n- Personalised list prices based on inferred characteristics — effectively price discrimination\\n- Creepy-line crosses on health, distress, surveillance, inferred protected characteristics\\n- AI-only customer service without escalation path — Air Canada Moffatt cross-domain\\n\\n---\\nSource: Gennoor Academy · AI for Retail & eCommerce\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your retail AI roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 12-MONTH ROADMAP', h1Html: '4 quarters · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Brand integrity, customer trust, fair pricing are non-negotiable.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Scales fast · <em>but breaks brand fast</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Trust costs more to rebuild than maintain', ['Brand integrity, customer trust, fair pricing are non-negotiable.']) }] },
  { type: 'content', eyebrow: '12-month rollout', icon: '2', headlineHtml: 'Q1 operational · Q2 pricing · <em>Q3-4 personalisation + content</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('Q1', 'Operational foundation', '', 'Forecasting · allocation · inventory targets · quick wins on returns.')}
${cell('Q2', 'Pricing within guardrails', '', 'Markdown + promo uplift. <strong>Hard guardrails documented and enforced.</strong>', 'amber')}
${cell('Q3-4', 'Personalisation + content', '', 'Tier-2 default · tier-3 only active long-term customers · brand voice maintained.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'No guardrail pricing · personalised prices · creepy · <em>AI-only service</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Auto-pricing no guardrails', '', '$600 water bottle moment waiting.', 'red')}
${cell('W2', 'Personalised list prices', '', 'Effectively price discrimination. Increasingly regulated.', 'red')}
${cell('W3', 'Creepy-line crosses', '', 'Health · distress · surveillance · inferred protected. <strong>Trust costs more to rebuild than maintain.</strong>', 'red')}
${cell('W4', 'AI-only customer service', '', 'No escalation path. Air Canada Moffatt cross-domain directly.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · guardrails · sponsor · <em>take to CEO/CDO/CMO</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting play</h5><div class="preset" data-group="play">
<button data-val="Merchandising + assortment — SKU-store forecasting + NPI + range optimisation">Merchandising</button>
<button data-val="Fulfilment + inventory — allocation + replenishment + store targets · most reliable ROI">Fulfilment</button>
<button data-val="Pricing — dynamic within guardrails + markdown + promo uplift">Pricing</button>
<button data-val="Personalisation — tier-2 default + tier-3 for active customers only">Personalisation</button>
</div></div>
<div class="group"><h5>Guardrail posture</h5><div class="preset" data-group="posture">
<button data-val="Strict — extensive excluded categories, multiple human review gates, conservative defaults">Strict</button>
<button data-val="Balanced — clear guardrails + monitored autonomy in non-essential categories">Balanced</button>
<button data-val="Aggressive — wider dynamic pricing scope, deeper personalisation, more automation with monitoring">Aggressive</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="CEO directly — strategic priority across merchandising + marketing + ops">CEO directly</button>
<button data-val="CDO + Chief Merchant — data-led with merchandising leadership">CDO + Chief Merchant</button>
<button data-val="CMO + Chief Customer Officer — customer experience-led">CMO + CCO</button>
<button data-val="COO + Head of eCom — operational lift focus">COO + Head of eCom</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my retail AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Retail AI · 12-Month Roadmap

Pick starting play, guardrail posture, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Scales fast · breaks brand fast · 5 plays · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI scales fast in retail but breaks brand fast · five plays that ship — merchandising, pricing within guardrails, personalisation with the creepy line drawn, fulfilment and inventory, returns and fraud · brand voice protected · disclosure embraced not hidden · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting play and guardrail posture.</div><div class="row"><span class="arr">→</span>Get one CEO or CMO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 26 chapters 1-8 built.')
