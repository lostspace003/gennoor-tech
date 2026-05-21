// Build Course 10 chapter HTMLs — Demand Forecasting in Practice (Andrew)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Function · Demand Forecasting in Practice';
const OUT = 'tmp/academy-build/demand-forecasting-in-practice/chapters';

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

// Ch1 — Landscape
emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The forecasting landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-forecasting-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · LANDSCAPE 2026', h1Html: '78% deployed · <em>41% measurable lift</em>', subtitleHtml: 'Gartner Supply Chain Top 25 2025. McKinsey: 15–30% MAPE reduction · top decile 30–50%. <strong>Not new techniques — better-packaged techniques + LLM narrative layer.</strong>' },
    { type: 'content', eyebrow: 'Adoption + cost · Gartner + McKinsey + APICS 2024-25', icon: '1', headlineHtml: 'Real lift · <em>real money</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('GARTNER SUPPLY CHAIN TOP 25 · 2025', 'Active AI-in-forecasting initiative', '78%', '41% report measurable accuracy lift.')}
${cell('McKINSEY · SUPPLY CHAIN AI 2025', 'Top-quartile MAPE reduction', '15–30%', 'Top decile 30–50% on specific SKU classes.')}
${cell('APICS 2024 COST STUDY', '1 percentage point of MAPE', '$0.5–1.5M', 'Inventory cost per $100M revenue. <strong>Real money.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'M5 + Hyndman · the evidence base', icon: '2', headlineHtml: 'No single technique wins · <em>granularity decides</em>',
      blocks: [{ atStep: 1, html: card('M5 FORECASTING COMPETITION · WALMART × KAGGLE 2022', 'LightGBM dominated SKU-store level · classical competitive on aggregates', ['Top-50 entries predominantly LightGBM-based.', 'Classical methods (ETS, ARIMA, Theta) still competitive at aggregated levels.', '<strong>Hyndman 3rd Ed:</strong> ML beats classical when there\'s enough signal and history.'], 'Operational implication: pick by granularity, history depth, signal-to-noise. <em>Not theoretical.</em>') }] },
    { type: 'content', eyebrow: 'The platforms · 2026', icon: '3', headlineHtml: 'Native ML layers · <em>not bolt-ons</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('SAP IBP', 'Demand sensing module', '', 'Native ML demand sensing.')}
${cell('ORACLE DEMANTRA', 'Forecasting platform', '', 'Long-established. Updated ML 2024-25.')}
${cell('BLUE YONDER LUMINATE', 'Demand sensing leader', '', 'Strong on retail + CPG.')}
${cell('o9 SOLUTIONS', 'Integrated planning', '', 'Strong on agile S&OP integration.')}
${cell('KINAXIS MAESTRO', 'Concurrent planning', '', 'Strong on multi-echelon networks.')}
</div>` }, { atStep: 1, html: card('WHAT\'S NEW IN 2026', 'Better auto-feature + auto-tuning + signals + LLM narrative', ['Auto-feature engineering. Auto-tuning. Point-of-sale + external data integration.', '<strong>OpenAI o-series, Claude, Gemini</strong> used in the S&OP narrative layer — commentary, planner-facing explanations, scenario writing.']) }] },
    { type: 'content', eyebrow: 'The Tetlock framing · the principle', icon: '4', headlineHtml: 'Calibration > <em>confidence</em>',
      blocks: [
        { atStep: 1, html: card('TETLOCK · "EXPERT POLITICAL JUDGMENT" + "SUPERFORECASTING"', '20+ years of forecasting research · one conclusion', ['Calibration matters more than accuracy point-estimate.', 'Point forecast says one number. <strong>Calibrated forecast says "here\'s my range and how confident I am inside it."</strong>'], 'Don\'t just ship a point forecast. Ship the 80% prediction interval. Force the conversation about how wide it is. That\'s the difference between a forecast and an opinion.') },
        { atStep: 2, html: card('THE THESIS', 'Planners with ML beat planners without it · planners + ML still beats ML alone', ['<strong>FVA is the chorus.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'It\'s not new techniques. <em>It\'s better-packaged techniques + the LLM narrative layer.</em>', '<strong>Next:</strong> accuracy, bias, and the MAPE trap. APICS +5–12% bias, MAPE asymmetry, sMAPE/MASE/RMSSE alternatives.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 }
  ]
});

// Ch2 — Accuracy, bias, MAPE
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Accuracy, bias, and the MAPE trap' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-mape-trap.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · MEASURE OR LIE', h1Html: 'MAPE lies · <em>sMAPE · MASE · RMSSE</em>', subtitleHtml: 'APICS 2024-25: median bias +5 to +12%. MAPE is asymmetric. The metric you report is the metric you optimise. <strong>Pick one that doesn\'t lie to you.</strong>' },
    { type: 'content', eyebrow: 'The bias problem · APICS / ASCM 2024-25', icon: '1', headlineHtml: 'Planners over-forecast · <em>+5 to +12%</em>',
      blocks: [{ atStep: 1, html: card('APICS / ASCM BIAS STUDIES 2024-25', 'Median forecast bias +5 to +12% (over-forecasting)', ['Promo plans assume best-case lift. New products are over-forecast as CYA against stock-outs. Sales overrides bias upward.', '<strong>The bias is structural.</strong>'], 'The fix isn\'t blame. The fix is measurement and visibility. Track bias and accuracy separately. Report both. AI is bias-neutral if you ask it to be. Humans drift upward.') }] },
    { type: 'content', eyebrow: 'The MAPE trap · Hyndman + M5', icon: '!', iconRed: true, headlineHtml: 'MAPE is asymmetric · <em>biased toward under-forecasting</em>',
      blocks: [{ atStep: 1, html: cardRed('THE MAPE TRAP', 'MAPE biased toward under-forecasting · catastrophic on intermittent demand', ['Over-forecasting by 100% shows as 100% error. Under-forecasting by 100% caps at 100%. <strong>MAPE is asymmetric.</strong>', 'In intermittent demand (spare parts, slow movers) — single zero-demand period blows up the metric.', 'M5 used <strong>RMSSE</strong> specifically because of MAPE\'s intermittent-demand failure.']) }, { atStep: 1, html: card('USE INSTEAD', 'sMAPE · MASE · RMSSE depending on context', ['<strong>sMAPE</strong> — symmetric MAPE — for moderate-volume forecasts.', '<strong>MASE / RMSSE</strong> — for intermittent demand.', 'The metric you report is the metric you optimise.']) }] },
    { type: 'content', eyebrow: 'Honest reporting · 3 numbers every cycle', icon: '2', headlineHtml: 'Accuracy + bias + <em>interval coverage</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('NUMBER 1', 'Accuracy', '', 'MAPE / sMAPE / MASE — pick the right one. Report it.')}
${cell('NUMBER 2', 'Bias', '', 'Signed average error. Negative = over-forecast. Positive = under-forecast. <strong>Tell the truth on direction.</strong>')}
${cell('NUMBER 3', 'Interval coverage', '', 'If you ship 80% prediction intervals — what fraction of actuals land inside? <strong>If only 60%, intervals are too tight. Recalibrate.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Cost benchmark · APICS 2024', icon: '3', headlineHtml: '1pp MAPE = <em>$0.5–1.5M per $100M</em>',
      blocks: [
        { atStep: 1, html: card('APICS 2024 COST STUDY', 'For typical CPG: 1 percentage point of MAPE = $0.5–1.5M per $100M revenue', ['For a $1B CPG, every percentage point of accuracy = $5–15M in working capital.', '<strong>This is why supply chain leaders care about MAPE reduction.</strong>'], 'Not vanity — money.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull top SKU class accuracy report from last cycle · 3 checks', ['Is the metric right for the volume profile? Is bias reported separately? Are prediction intervals tracked?', '<strong>If any answer is no — that\'s the next process upgrade before you scale ML.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Choosing the right model · <em>by granularity, history, signal</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Bias separate from accuracy · interval coverage tracked · <em>metric matches the volume profile.</em>', '<strong>Next:</strong> the decision tree — LightGBM for granular, classical for aggregated, Croston for intermittent, ensembles where it counts.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 85.0, slide: 3 }, { at: 95.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 265.0, slide: 6 }, { at: 275.0, slide: 6, step: 1 }
  ]
});

// Ch3 — Choosing the right model
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Choosing the right model' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-model-choice.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · THE DECISION TREE', h1Html: 'History × signal × granularity · <em>then method</em>', subtitleHtml: 'M5: LightGBM dominates granular. Classical competitive on aggregates. Croston for intermittent. <strong>No single technique wins.</strong>' },
    { type: 'content', eyebrow: 'M5 evidence · Walmart × Kaggle 2022', icon: '1', headlineHtml: 'LightGBM dominates SKU-store · <em>classical wins on aggregates</em>',
      blocks: [{ atStep: 1, html: card('M5 FORECASTING COMPETITION · 2022', 'Top-50 entries predominantly LightGBM · classical methods still competitive at aggregated levels', ['<strong>Operational implication: not theoretical.</strong>', 'Lots of history + lots of signal + fine granularity → LightGBM-style wins.', 'Sparse data + aggregated level → classical methods (ETS, ARIMA, Theta) competitive.', '<strong>Don\'t let the vendor pitch the same model for every forecast layer.</strong>']) }] },
    { type: 'content', eyebrow: 'The decision tree · 3 variables', icon: '2', headlineHtml: 'History · signal · granularity · <em>method</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('LONG HISTORY · RICH SIGNAL · FINE GRANULARITY', 'Store-SKU / DC-SKU', '', '<strong>LightGBM, XGBoost, LSTM</strong> if you have the team. ML wins here.', 'green')}
${cell('MODERATE HISTORY · AGGREGATED', 'Total monthly / category-level', '', '<strong>ETS, ARIMA, Theta.</strong> Classical methods are tight competitors. Don\'t over-engineer.')}
${cell('INTERMITTENT DEMAND', 'Spare parts · slow-movers · zero-heavy', '', '<strong>Croston\'s method</strong> or Croston-LightGBM hybrid (Boylan 2024). Pure LightGBM struggles with intermittency.', 'amber')}
${cell('HISTORY TOO SHORT', 'Under 1 year · new product / channel', '', 'ML unreliable. <strong>Analog-product lookup + judgement</strong> (chapter 6 on NPI).', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'The ensemble option', icon: '3', headlineHtml: 'Combine + weight · <em>boring + robust</em>',
      blocks: [{ atStep: 1, html: card('THE ENSEMBLE PATTERN', 'Combine 3–4 models · weight by recent backtest performance', ['LightGBM + ETS + naive seasonal + planner manual.', '<strong>Top-decile S&OP teams use ensembles because they reduce model-selection risk.</strong>'], 'Trade-off: slower to update and harder to explain. The S&OP leader has to understand the weighting logic. If your vendor can\'t explain how the ensemble blends — don\'t sign.') }] },
    { type: 'content', eyebrow: 'Where ML is reliably weaker', icon: '!', iconRed: true, headlineHtml: 'Long horizon · <em>beyond 6 months</em>',
      blocks: [
        { atStep: 1, html: cardRed('ML WEAKNESS · LONG-HORIZON', 'Beyond 6 months · signal-to-noise degrades · ML overfits recent patterns', ['<strong>Classical methods or judgement-heavy scenario planning win past 6 months.</strong>'], 'Bottom line: ML augments. ML doesn\'t replace. S&OP team running 3-4 models picking right one per SKU class beats the team running one model on everything.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull top 3 SKU classes by volume · is the model matched to the data?', ['For each: what model is running today? History depth? Signal richness? Granularity? <strong>If not matched — that\'s the segmentation upgrade.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Demand sensing · <em>POS · weather · social · 1-4 week horizon</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Match the model to the data. <em>No single technique wins.</em>', '<strong>Next:</strong> demand sensing — 5–15% lift on a 4-week horizon · and the noise-chasing risk.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 155.0, slide: 4 }, { at: 165.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// Ch4 — Demand sensing
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Demand sensing' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-demand-sensing.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · 1–4 WEEK HORIZON', h1Html: '5–15% lift · <em>or chase noise</em>', subtitleHtml: 'Blue Yonder + o9. POS, weather, ad spend, social. <strong>Confidence-weighted overrides. Caps. Signal hygiene.</strong> FVA in shadow mode before production.' },
    { type: 'content', eyebrow: 'What it is · 1-4 week override layer', icon: '1', headlineHtml: 'Override the mid-term forecast · <em>in the last mile</em>',
      blocks: [{ atStep: 1, html: card('DEMAND SENSING', 'Short-horizon forecast driven by signals that move faster than mid-term planning', ['POS data refreshed daily. Weather. Local ad spend. Promotional execution status. Social listening.', '<strong>Output: override to mid-term forecast for the next few weeks.</strong>'], 'Platforms: Blue Yonder Luminate + o9 Solutions are the leaders. SAP IBP demand sensing module. Kinaxis Maestro signals layer.') }] },
    { type: 'content', eyebrow: 'The lift · industry case studies 2024-25', icon: '2', headlineHtml: '5–15% MAPE reduction · <em>4-week horizon</em>',
      blocks: [{ atStep: 1, html: cardGreen('INDUSTRY CASE STUDIES 2024-25', '5–15% MAPE reduction on 4-week horizon vs unchanged mid-term', ['Top performers in fast-moving CPG reach the high end.', '<strong>$1B CPG · 20% baseline MAPE → 17–18% with demand sensing.</strong> Millions in better-positioned inventory.']) }] },
    { type: 'content', eyebrow: 'The risk · chasing noise', icon: '!', iconRed: true, headlineHtml: 'Confidence-weighted overrides · <em>cap the magnitude</em>',
      blocks: [{ atStep: 1, html: cardRed('NOISE-CHASING FAILURE MODE', 'Model picks up 1-week POS spike + over-corrects', ['Or amplifies a weather signal that doesn\'t matter for your category.', 'Result: wrong inventory deployments, wrong promo executions, frustrated planners lose trust.'], 'Fix: confidence-weighted overrides. Apply only above threshold. Cap override magnitude — e.g., max 20% override of mid-term in any week.') }] },
    { type: 'content', eyebrow: 'Signal hygiene + FVA shadow mode', icon: '3', headlineHtml: 'Audit signals · <em>shadow-mode FVA before production</em>',
      blocks: [
        { atStep: 1, html: card('SIGNAL HYGIENE', 'Demand sensing is only as good as the signals feeding it', ['POS with 2-week latency → useless for 1-4 week horizon.', 'Weather mapped to wrong SKU categories → adds noise.', '<strong>Audit the signal pipeline before you trust the model.</strong>'], 'FVA shadow mode: run demand sensing in shadow for a quarter. Compare proposals to actuals. Did override improve or worsen accuracy vs no-override? Improved → promote. Worsened → fix signals or kill the layer.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter\'s override log · audit accuracy on each significant override', ['<strong>If you can\'t answer "did this override improve accuracy" — FVA isn\'t running. That\'s the gap.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Promotional uplifts · <em>20–40% accuracy improvement</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Confidence-weighted + capped + signal-audited + FVA-validated. <em>Demand sensing done right.</em>', '<strong>Next:</strong> Coca-Cola, Unilever, Carrefour cases — 20–40% accuracy improvement on promotional weeks. What breaks it.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

// Ch5 — Promotional uplifts
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Promotional & event uplifts' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-promotional-uplifts.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · WHERE AI WINS BIG', h1Html: '20–40% accuracy lift · <em>on promo weeks</em>', subtitleHtml: 'Coca-Cola · Unilever · Carrefour 2024-25 cases. <strong>Clean promo calendar + uplift model + cannibalisation modelling.</strong> Calendar drift breaks it.' },
    { type: 'content', eyebrow: 'The lift · Coca-Cola · Unilever · Carrefour 2024-25', icon: '1', headlineHtml: 'Naive baseline so bad · <em>uplift models so good</em>',
      blocks: [{ atStep: 1, html: cardGreen('PROMOTIONAL UPLIFT CASE STUDIES 2024-25', '20–40% promotional-week accuracy improvement vs naive baseline', ['Most companies forecast promo weeks by applying fixed-percentage lift to base demand.', '<strong>Ignores promo depth, channel mix, competitor activity, cannibalisation.</strong>', 'ML uplift models pick all of that up.']) }] },
    { type: 'content', eyebrow: 'The pattern · 3 components', icon: '2', headlineHtml: 'Clean calendar + uplift model + <em>cannibalisation</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('COMPONENT 1', 'Clean promotion calendar', '', '<strong>What promotion ran when, at what depth, in which channel.</strong> Sounds basic. Most CPG companies have drift between planned and executed.')}
${cell('COMPONENT 2', 'Uplift model', '', 'ML trained on historical promo-vs-no-promo deltas. Features: depth, duration, channel, week-of-month, competitor activity, weather. <strong>LightGBM dominates.</strong>')}
${cell('COMPONENT 3', 'Cannibalisation modelling', '', 'SKU A on promo → SKU B demand drops. <strong>Pure uplift models that don\'t capture cannibalisation over-forecast the category.</strong>', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'What breaks it · calendar drift', icon: '!', iconRed: true, headlineHtml: 'Planned ≠ executed · <em>model trains on one · forecasts on other</em>',
      blocks: [{ atStep: 1, html: cardRed('PROMOTION CALENDAR DRIFT', 'Marketing changed depth last minute · sales added channel · store didn\'t execute', ['Planned: "20% off in lane A." Actual: "15% off in lanes A + B."', '<strong>Model trains on actual execution. Forecast process uses planned calendar.</strong> Disconnect kills accuracy.'], 'Fix: reconcile planned vs actual promo execution every cycle. Reconciliation closes the loop.') }] },
    { type: 'content', eyebrow: 'The planner role · edge cases + FVA', icon: '3', headlineHtml: 'Planner overrides · <em>logged for FVA</em>',
      blocks: [
        { atStep: 1, html: card('PLANNER OVERRIDE AUTHORITY', 'On the edge cases the model hasn\'t seen', ['New competitor entering category. Disrupted supply on a competing brand. Regional anomaly.', '<strong>Every planner override gets logged for FVA</strong> (chapter 7).'], 'Discipline: if planner overrides on promo forecasts consistently improve accuracy — great, the planner adds value. If they consistently worsen — coaching conversation about when to override.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter\'s top 10 promotional weeks · accuracy + overrides', ['For each — accuracy? planner override? what happened? <strong>If you don\'t have the override log — start it this cycle.</strong> FVA foundation.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'New product introduction · <em>P&amp;G analog-lookup + first 4 weeks</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Where AI wins the biggest accuracy lift. <em>And where calendar drift kills it.</em>', '<strong>Next:</strong> NPI forecasting — the use case where ML alone fails hardest and the human-ML hybrid wins most.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 190.0, slide: 5 }, { at: 200.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 }
  ]
});

// Ch6 — NPI
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'New product introduction' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-new-product-introduction.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · WHERE ML ALONE FAILS', h1Html: 'Analog lookup + <em>first 4 weeks</em>', subtitleHtml: 'P&amp;G 2024 case via McKinsey. <strong>The judgement layer picks the analogs. The ML does the math.</strong> Lock first 4 weeks. Re-tune on real signal.' },
    { type: 'content', eyebrow: 'The problem · no history', icon: '1', headlineHtml: 'No training data · <em>pure ML unreliable</em>',
      blocks: [{ atStep: 1, html: card('THE NPI PROBLEM', 'By definition, a new product hasn\'t been sold yet', ['<strong>No training data for ML.</strong> Pure ML unreliable in first weeks/months. Classical methods useless without history.', 'Traditional "fix" — judgement: sales says 100K units year one, marketing says 150K, finance says 80K. <strong>Three forecasts, no method.</strong>']) }] },
    { type: 'content', eyebrow: 'The P&G case · McKinsey 2024', icon: '2', headlineHtml: 'Analog lookup · plus <em>first 4-week early signal</em>',
      blocks: [{ atStep: 1, html: card('PROCTER & GAMBLE NPI CASE · McKINSEY 2024', '2 components: analog-product lookup + first-4-week early signal', ['<strong>Component 1 — analog lookup.</strong> Historical products similar to new product (category, pricing, channel, launch context). Their first-12-month curves form the prior distribution.', '<strong>Component 2 — first-4-week signal.</strong> Once product launches, 4 weeks of real POS data update the analog-based forecast. LightGBM combines prior + early signal.'], '12-month forecast accuracy improves dramatically by week 4.') }] },
    { type: 'content', eyebrow: 'The judgement layer · category expert', icon: '3', headlineHtml: 'Planner picks the analog set · <em>ML does the math</em>',
      blocks: [{ atStep: 1, html: card('THE JUDGEMENT LAYER', 'Which analogs are valid?', ['ML can compute similarity. <strong>Category expert decides whether the analog is comparable.</strong>', 'A vegan ice cream launching 2026 is probably <em>not</em> well-modelled by a regular ice cream from 2017.']) }, { atStep: 1, html: card('THE DISCIPLINE', 'Lock the forecast for the first 4 weeks', ['<strong>Don\'t let salespeople push the forecast up based on enthusiasm in week 2.</strong>', 'Use week-4 real signal to update. That\'s when you have data.']) }] },
    { type: 'content', eyebrow: 'What this doesn\'t work for · novel categories', icon: '!', iconRed: true, headlineHtml: 'Genuinely novel · <em>scenario planning, no number until 30 days</em>',
      blocks: [
        { atStep: 1, html: cardRed('GENUINELY NOVEL CATEGORIES', 'No comparable analog · analog method fails', ['<strong>You\'re back to judgement and scenario planning.</strong> That\'s acceptable. Just don\'t pretend the forecast is data-driven.'], 'Honest framing: bucket new product launches into 3 — analog-rich (analog + early signal), analog-thin (wider intervals, judgement-led), genuinely novel (scenario planning, no number until first 30 days of data).') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick your next NPI launch · identify 3 analogs', ['Pull their first-12-month curves. <strong>If you can\'t find 3 comparable analogs — bucket as thin or novel.</strong> Set expectations with finance and sales before the launch.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Connecting forecast to S&amp;OP · <em>FVA + LLM narrative</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Analog + early signal + planner judgement. <em>The hybrid wins where pure ML fails.</em>', '<strong>Next:</strong> SCC research — only ~38% connect ML forecast to exec S&OP. FVA + LLM narrative layer + the confabulated-source failure mode.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 190.0, slide: 5 }, { at: 200.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 }
  ]
});

// Ch7 — S&OP integration
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Connecting forecast to S&OP' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-sop-integration.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · WHERE FORECAST MEETS DECISION', h1Html: 'FVA + <em>quote-or-cut narrative</em>', subtitleHtml: 'SCC 2025: only 38% connect ML forecast to executive S&amp;OP decisions. <strong>The gap is the narrative layer + accountability layer.</strong>' },
    { type: 'content', eyebrow: 'The gap · SCC 2025', icon: '1', headlineHtml: '62% ship better forecasts · <em>nobody acts on them</em>',
      blocks: [{ atStep: 1, html: card('SUPPLY CHAIN COUNCIL · 2025', 'Only 38% connect ML demand forecast to executive S&OP decisions', ['62% ship better forecasts that nobody acts on.', 'The gap isn\'t accuracy. <strong>The gap is the narrative layer and the accountability layer.</strong>'], 'Executives don\'t action a forecast number. They action a story. The story has to come with a name attached.') }] },
    { type: 'content', eyebrow: 'The pattern · what S&OP leaders are watching for', icon: '!', iconRed: true, headlineHtml: 'LLM commentary attributing variance to <em>a promotion that wasn\'t actually run</em>',
      blocks: [{ atStep: 1, html: cardRed('THE CONFABULATED-SOURCE FAILURE MODE · S&OP COMMENTARY', 'LLM-generated commentary references a planned promo · the cancellation was recorded elsewhere · LLM didn\'t reconcile', ['Promotion was on the planned calendar. LLM read the planned calendar. <strong>The cancellation lived in another system the LLM didn\'t see.</strong>', '<strong>This is the demand-planning version of <em>Mata v. Avianca</em></strong> — the federal court case where lawyers were sanctioned for citing court opinions that didn\'t exist.', 'Same generative-AI behaviour. Different document.'], 'Fix: same as the legal-citation rule — quote or cut. Every specific claim in S&OP commentary either has a source the AI pulled from, or it gets cut from the deck. <em>If your LLM commentary tool can\'t show source-of-claim for every assertion, your deck is one cycle away from a CFO reading something untrue.</em>') }] },
    { type: 'content', eyebrow: 'FVA · Forecast Value Added · Gilliland', icon: '2', headlineHtml: 'Where in the chain · <em>accuracy is added or lost</em>',
      blocks: [{ atStep: 1, html: card('FORECAST VALUE ADDED · MIKE GILLILAND · SAS · 15+ YEARS', 'Measure accuracy of each layer · compare layer-to-layer', ['Naive (last month carried) → Statistical → ML → Planner override → Executive sign-off.', '<strong>If ML adds accuracy over statistical — good. If planner override adds accuracy over ML — good. If planner override consistently subtracts — coaching conversation.</strong>'], 'FVA finds <em>where</em> accuracy is added or lost. Not blame — diagnosis.') }] },
    { type: 'content', eyebrow: 'The executive consensus · 4 layers', icon: '3', headlineHtml: 'AI + LLM narrative + planner judgement + <em>exec consensus</em>',
      blocks: [
        { atStep: 1, html: card('S&OP CONSENSUS DISCIPLINE', '4 layers · each accountable to the next', ['CFO + head of supply chain + head of sales + head of marketing — all sign onto demand plan.', 'Forecast number = AI\'s output. Story = partly AI, partly human. Override = human. Sign-off = human.', '<strong>Audit trail records who did what at each layer.</strong> Same SOX-like logic as legal + finance courses.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull last month\'s S&OP exec deck · trace 1 specific commentary claim back to a number', ['<strong>If you can\'t trace in 5 minutes — the confabulated-source failure mode is 1 cycle away. Fix quote-or-cut before the next deck.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 8', icon: '→', headlineHtml: 'Making it stick · <em>your 2-quarter rollout</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'The narrative layer + the accountability layer. <em>That\'s the gap.</em>', '<strong>Last chapter:</strong> 2-quarter rollout playbook · 4 trust trip-wires · the course in one sentence.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 215.0, slide: 5 }, { at: 225.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

// Ch8 — Rollout playbook
const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],sku:'',cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='usecases'){var arr=state.usecases;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='demand-forecasting-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases — Q1 + Q2)_';var s=state.sku||'_(pick SKU class focus)_';var c=state.cadence||'_(pick cadence)_';return '# Demand Forecasting AI · 2-Quarter Roadmap\\n\\n**Owner:** ____________________\\n**Start date:** ____________________\\n\\n## 2 use cases\\n'+uc+'\\n\\n## SKU class focus\\n> '+s+'\\n\\n## FVA review cadence\\n'+c+'\\n\\n## Quarter 1\\n- Baseline ML on top 100 SKUs (model matched to data)\\n- FVA running every cycle\\n- Accuracy + bias + interval coverage tracked per SKU class\\n\\n## Quarter 2\\n- Demand sensing on one channel OR promotional uplift\\n- FVA on the new layer\\n- Confidence-weighted overrides + capped magnitude\\n\\n## Trust trip-wires (do not cross)\\n- No model that can\\'t be explained\\n- No override without FVA recording\\n- No AI-generated narrative without source check (quote-or-cut rule, same as legal post Mata v. Avianca)\\n- No "set and forget"\\n\\n---\\nSource: Gennoor Academy · Function · Demand Forecasting in Practice\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your demand-forecasting roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-rollout-playbook.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · THE ROADMAP', h1Html: '2 use cases · 2 quarters · <em>FVA discipline</em>', subtitleHtml: 'Seven chapters of landscape, accuracy, model choice, demand sensing, promo, NPI, S&amp;OP. <strong>This chapter sequences them.</strong>' },
    { type: 'content', eyebrow: 'The principle · 2 not 7', icon: '1', headlineHtml: 'Pick two · <em>ship with FVA · then expand</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 2 quarters · 1 FVA discipline', ['Mistake S&OP teams make: trying to overhaul the full forecast stack at once — demand sensing, promo uplift, NPI, ensemble, LLM narrative.', '<strong>Pick two. Ship them with FVA running. Then expand.</strong>']) }] },
    { type: 'content', eyebrow: 'The sequence · default playbook', icon: '2', headlineHtml: 'Q1 baseline + FVA · <em>Q2 demand sensing OR promo</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUARTER 1', 'Baseline ML on top 100 SKUs + FVA', '', '<strong>Get the foundation right.</strong> ML model matched to data (LightGBM/classical/Croston per SKU class). FVA running every cycle. Accuracy by SKU class, bias separately, interval coverage tracked.', 'green')}
${cell('QUARTER 2', 'Demand sensing OR promotional uplift', '', '<strong>Pick the one with biggest baseline pain.</strong> Demand sensing if POS-data quality is there. Promo uplift if your calendar is clean. FVA on the new layer too.<br/><br/><em>Defer: NPI · full multi-channel · LLM narrative in exec deck. Year 2 after FVA on basics is solid.</em>')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No unexplainable model', '', 'If vendor can\'t tell you the top 3 features for a specific SKU forecast — don\'t ship to executives. Explainability is RFP-mandatory.', 'red')}
${cell('TRIP-WIRE 2', 'No unrecorded overrides', '', 'Planner overrides are valuable. Unrecorded overrides are noise. <strong>Every override logged. Quarterly reviewed.</strong>', 'red')}
${cell('TRIP-WIRE 3', 'No AI narrative without source check', '', 'Quote or cut. Same discipline as the legal-citation rule post Mata v. Avianca. <strong>Every specific claim traces to a number — or it\'s cut from the deck.</strong>', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'FVA is the contract. Quarterly review. Stop measuring → lost the controls.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pick your 2 · <em>download · take to CSCO / VP Operations</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases (Q1 + Q2)</h5><div class="preset" data-group="usecases">
<button data-val="Baseline ML on top 100 SKUs (model matched to data)">Baseline ML</button>
<button data-val="Demand sensing on one channel (POS-driven, 1-4wk)">Demand sensing</button>
<button data-val="Promotional uplift modelling with cannibalisation">Promo uplift</button>
<button data-val="Intermittent demand (Croston for spare parts)">Intermittent (Croston)</button>
<button data-val="Ensemble model layer (LightGBM + ETS + naive)">Ensemble layer</button>
<button data-val="NPI analog-lookup + first 4 weeks">NPI methodology</button>
</div></div>
<div class="group"><h5>SKU class focus</h5><div class="preset" data-group="sku">
<button data-val="Top 100 SKUs by revenue">Top 100</button>
<button data-val="Top 500 SKUs">Top 500</button>
<button data-val="One category (full coverage)">One category</button>
<button data-val="Intermittent / spare parts only">Intermittent only</button>
</div></div>
<div class="group"><h5>FVA review cadence</h5><div class="preset" data-group="cadence">
<button data-val="Monthly FVA · S&amp;OP integration">Monthly FVA</button>
<button data-val="Quarterly FVA · with planner coaching">Quarterly FVA</button>
<button data-val="Per-cycle override logging + quarterly portfolio review">Per-cycle + quarterly</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my demand-forecasting roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Demand Forecasting AI · 2-Quarter Roadmap

Pick use cases, SKU class focus, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Planners + ML · <em>beats either alone</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Match the model to the data · measure bias separately · ship the prediction interval not just the point · FVA every override · quote-or-cut every narrative · 2 use cases not 7 · planner plus ML beats either alone · calibration matters more than confidence.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one CSCO or VP-Operations conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 50.0, slide: 3 }, { at: 60.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 },
    { at: 215.0, slide: 6 }, { at: 225.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 10 chapters 1-8 built.');
