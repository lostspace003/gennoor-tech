// Course 38 — MLOps for LLMs (Andrew · builder track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Builder · MLOps for LLMs'
const OUT = 'tmp/academy-build/mlops-for-llms/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'LLMOps vs MLOps' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-llmops-vs-mlops.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · WHEN THE MODEL IS GENERATIVE, NON-DETERMINISTIC, THIRD-PARTY', h1Html: '5 differences · what carries over · <em>what doesn\'t</em>', subtitleHtml: '<strong>LLMs in production don\'t fail like classical ML. The on-call playbook is different.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Different failure modes · <em>different playbook</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'LLM failures are not classical ML failures', ['<strong>Classical ML fails predictably</strong> — accuracy drops, AUC slips, distribution shifts. Catch with offline evals + dashboards.', '<strong>LLMs fail differently:</strong> hallucinate confidently · refuse one day, answer the next · cost 10x more when a user gets clever · silently worse when vendor updates.'], 'The on-call playbook is different. <strong>That\'s why LLMOps is its own discipline.</strong>') }] },
  { type: 'content', eyebrow: '5 differences', icon: '2', headlineHtml: 'Non-determinism · generative · third-party · cost variability · <em>adversarial users</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('D1', 'Non-determinism', '', 'Same input → different output. Standard regression tests break. <strong>Need probabilistic eval.</strong>')}
${cell('D2', 'Generative outputs', '', 'Free-form text. No single accuracy. <strong>Multi-dim: groundedness · faithfulness · relevance · format.</strong>')}
${cell('D3', 'Third-party black boxes', '', 'OpenAI · Anthropic · Azure update without notice. <strong>Your behavior changes when theirs does.</strong>')}
${cell('D4', 'Per-request cost variability', '', 'Tokens vary 10-100x. <strong>Cost is a feature, not a constant.</strong>')}
${cell('D5', 'Adversarial users', '', 'Prompt injection · jailbreaks · abuse. <strong>Closer to web-app security than ML.</strong>')}
</div>` }] },
  { type: 'content', eyebrow: 'What carries over', icon: '3', headlineHtml: 'Versioning · observability · CI/CD · <em>incident response</em>',
    blocks: [{ atStep: 1, html: card('FROM CLASSICAL MLOPS · STILL APPLIES', 'Discipline carries · artifacts evolve', ['<strong>Versioning.</strong> Still need to know what\'s in prod. Just versioning prompts now, not weights.', '<strong>Observability.</strong> Traces · metrics · logs. Schemas evolve, discipline is the same.', '<strong>CI/CD.</strong> Evals on every change. Canary rollouts. One-command rollback.', '<strong>Incident response.</strong> Same loop — detect, mitigate, root-cause, eval-case-it.']) }] },
  { type: 'content', eyebrow: 'What doesn\'t', icon: '!', iconRed: true, headlineHtml: 'Offline accuracy gate · retraining · <em>feature stores</em>',
    blocks: [
      { atStep: 1, html: cardRed('WHAT DOESN\'T CARRY OVER', 'Where teams get hurt', ['<strong>Offline accuracy as the gate.</strong> Doesn\'t predict prod quality. <em>Need online evals.</em>', '<strong>Model retraining cadence.</strong> You don\'t retrain. Vendor does. <em>You version prompts + integrations.</em>', '<strong>Feature stores.</strong> LLM context is built per-request via retrieval. <em>No precomputed features.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List your current LLM features', ['For each: how would on-call know if quality silently degraded? <strong>If answer is "user complaints," that\'s the gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Model evaluation in production · <em>online evals + LLM-as-judge</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', '5 differences · what carries · what doesn\'t.', '<strong>Next:</strong> 3-tier sampling · LLM-as-judge done right · PII discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Model evaluation in production' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-eval-production.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · ONLINE EVALS · NOT OFFLINE GATES', h1Html: '3-tier sampling · LLM-as-judge · <em>PII discipline</em>', subtitleHtml: '<strong>Offline evals don\'t transfer to LLM production. Continuous online evals do.</strong>' },
  { type: 'content', eyebrow: 'Why online evals', icon: '1', headlineHtml: 'Real users · real context · <em>real edge cases</em>',
    blocks: [{ atStep: 1, html: card('WHY PRODUCTION EVALS MATTER MORE FOR LLMS', 'Offline doesn\'t transfer', ['<strong>Classical ML:</strong> offline accuracy on held-out set is a strong predictor of prod. Train, eval, deploy, monitor.', '<strong>LLM systems:</strong> offline evals don\'t transfer. Real users ask things test sets don\'t. Real retrieval changes the picture. Real edge cases never in your suite.'], '<strong>The answer:</strong> online evals on sampled production traffic. Continuous, not gated to release.') }] },
  { type: 'content', eyebrow: '3-tier sampling', icon: '2', headlineHtml: 'Light · targeted · <em>gold</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Light sampling', '', '1-5% of all traffic. Automated LLM-as-judge for groundedness + faithfulness. <strong>Cheap. Catches obvious regressions.</strong>', 'green')}
${cell('T2', 'Targeted sampling', '', 'High-stakes flows · new model versions · complaints. <strong>Heavier eval — multiple judges + rubrics.</strong>', 'green')}
${cell('T3', 'Gold cases', '', '50-200 curated. Run every deploy. <strong>Catches regressions before they ship.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'LLM-as-judge · done right', icon: '3', headlineHtml: 'Different family · structured rubric · <em>human on disagreement</em>',
    blocks: [{ atStep: 1, html: card('LLM-AS-JUDGE · DONE RIGHT', '4 disciplines', ['<strong>Don\'t use same model</strong> as generator. Bias built in. <em>Use a different family — Claude judging GPT, or vice versa.</em>', '<strong>Structured rubric.</strong> "1-5: does the answer ground in context?" beats "Is this good?" <em>Reproducibility from structure.</em>', '<strong>Human on disagreements.</strong> Two judges disagree → escalate. Don\'t average and move on.']) }] },
  { type: 'content', eyebrow: 'PII discipline', icon: '!', iconRed: true, headlineHtml: 'Detect + tokenize · <em>regulated contexts</em>',
    blocks: [
      { atStep: 1, html: cardRed('PII DISCIPLINE', 'Production traffic contains PII', ['<strong>The pattern:</strong> PII detection + tokenization. Replace identifiers with stable tokens before eval. Reverse on the way out if needed.', '<strong>For regulated contexts:</strong> run evals inside your compliance boundary. Azure OpenAI with BAA · Anthropic via Bedrock with HIPAA · internal models behind your network.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one production LLM feature', ['Set up 1% sampling with one LLM-as-judge metric. <strong>Catch one regression you wouldn\'t have caught otherwise.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Drift detection · <em>3 types + actionable alerts</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Why online · 3-tier sampling · judge discipline · PII.', '<strong>Next:</strong> input · output · behavioral drift + actionable vs cosmetic.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Drift detection' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-drift.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · 3 DRIFT TYPES · ACTIONABLE NOT COSMETIC', h1Html: 'Input · output · <em>behavioral drift</em>', subtitleHtml: '<strong>Every monitor must have a runbook. Every alert must have an owner.</strong>' },
  { type: 'content', eyebrow: '3 drift types', icon: '1', headlineHtml: 'Input · output · <em>behavioral</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('D1', 'Input drift', '', 'Query distribution shifts. New use case · cohort · topic move. <strong>Catch via embedding clustering.</strong>', 'green')}
${cell('D2', 'Output drift', '', 'Response distribution shifts. Length · refusal rate · vocabulary. <strong>Statistical monitoring on output features.</strong>', 'green')}
${cell('D3', 'Behavioral drift', '', 'Same input → meaningfully different output. <strong>The dangerous one.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Detecting behavioral drift', icon: '2', headlineHtml: 'Regression set · daily replay · <em>semantic similarity threshold</em>',
    blocks: [{ atStep: 1, html: card('DETECTING BEHAVIORAL DRIFT · HARDEST CASE', 'Frozen baseline + daily replay', ['<strong>The technique:</strong> maintain a regression set of canonical queries. Run them daily against production. Compare to frozen baseline using semantic similarity.', '<strong>If today\'s output drifts above threshold</strong> → alert.'], '<strong>Investigation playbook:</strong> was the prompt changed? Vendor model updated? Retrieval source changed? Most behavioral drift comes from one of those three.') }] },
  { type: 'content', eyebrow: 'Actionable vs cosmetic', icon: '!', iconRed: true, headlineHtml: 'Quality score is theater · <em>specific + owned is signal</em>',
    blocks: [{ atStep: 1, html: cardRed('ACTIONABLE ALERTS VS COSMETIC DASHBOARDS', 'Every monitor needs a runbook', ['<strong>Cosmetic:</strong> "Quality score 4.2/5." Dashboard looks great. Nobody acts.', '<strong>Actionable:</strong> "Groundedness dropped 8% in 24h in legal-Q&A flow. Investigate retrieval source X." Specific. Triggers action.'], '<strong>The principle:</strong> every monitor must have a runbook. Every alert must have an owner. <em>Otherwise it\'s theater.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Caught last vendor update · <em>runbook per alert</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DRIFT DETECTION', '2 questions', ['<strong>Q1:</strong> when vendor last updated their model, monitoring caught the behavioral change? Within 24h green · within week amber · <strong>days/weeks/never red</strong>.', '<strong>Q2:</strong> each LLM alert has a written runbook? All green · some amber · <strong>no red — noise will train team to ignore</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Build a 50-query regression set this week', ['Run daily. <strong>That\'s your behavioral-drift early warning.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Cost optimization · <em>patterns that survive past Q1</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 drift types · behavioral detection · actionable.', '<strong>Next:</strong> 4 cost patterns · 3 anti-patterns · telemetry.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Cost optimization patterns' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-cost.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · COST IS A PRODUCT FEATURE', h1Html: '4 patterns that work · 3 that break · <em>telemetry</em>', subtitleHtml: '<strong>Cost is a feature you design for, not a bill you discover in month four.</strong>' },
  { type: 'content', eyebrow: 'The cost surprise', icon: '!', iconRed: true, headlineHtml: 'Month 1 OK · month 4 3x · <em>edge cases compound</em>',
    blocks: [{ atStep: 1, html: cardRed('THE COST SURPRISE', 'Adoption + per-user usage + edge cases all compound', ['<strong>Month 1 bill:</strong> manageable. <strong>Month 4 bill:</strong> 3x higher.', 'Adoption grew. Per-user usage grew. <em>Both compound.</em>', 'Plus: <strong>edge cases — long conversations · document-heavy queries · abuse — are 10-100x more expensive per request.</strong> Once those become common, average cost jumps.'], '<strong>Discipline:</strong> cost is a product feature you design for, not a bill you discover.') }] },
  { type: 'content', eyebrow: '4 cost patterns', icon: '1', headlineHtml: 'Compress · cache · route · <em>smaller + better retrieval</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('P1', 'Prompt compression', '', 'System prompts grow. <strong>Periodically rewrite tightly. Externalize examples to retrieval.</strong>', 'green')}
${cell('P2', 'Caching', '', 'Same user query · same answer. <strong>Cache by prompt hash.</strong>', 'green')}
${cell('P3', 'Model routing', '', 'Cheap model for easy · expensive for hard. <strong>Route by complexity · length · confidence.</strong>', 'green')}
${cell('P4', 'Smaller + better retrieval', '', 'GPT-4 + 50 tokens of retrieval beats GPT-4 + 5000 tokens of bloat. <strong>Quality + cost both improve.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-patterns', icon: '!', iconRed: true, headlineHtml: 'Aggressive truncate · vendor lock-in · <em>cross-user cache</em>',
    blocks: [{ atStep: 1, html: cardRed('3 ANTI-PATTERNS · LOOK SMART · BREAK THINGS', '', ['<strong>1. Aggressive prompt truncation.</strong> "Just cut to 500 tokens." Quality collapses.', '<strong>2. Single-model lock-in for "vendor discount."</strong> Can\'t switch when prices change. Negotiating leverage gone.', '<strong>3. Caching responses across users.</strong> Answers depend on user context, permissions, retrieval. <em>Privacy + correctness at risk.</em>']) }] },
  { type: 'content', eyebrow: 'Cost telemetry', icon: '2', headlineHtml: 'Per-feature · per-cohort · <em>p95/p99 distribution</em>',
    blocks: [
      { atStep: 1, html: card('COST TELEMETRY · WHAT YOU ACTUALLY NEED', 'Beyond "total LLM spend"', ['<strong>Per-feature.</strong> So you know which feature pays back.', '<strong>Per-user-cohort.</strong> Free vs paid · internal vs external. So you know who\'s expensive.', '<strong>Per-request distribution.</strong> Median + p95 + p99. <em>p99 cost is what kills you when adoption grows.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last month\'s LLM bill broken down by feature', ['If you can\'t, <strong>that\'s the first cost optimization — the dashboard that lets you optimize the rest.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Versioning prompts + models · <em>60-second rollback</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 patterns · 3 anti-patterns · 3-axis telemetry.', '<strong>Next:</strong> one-artifact discipline · canary/shadow/rollback.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Versioning prompts and models together' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-versioning.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · ONE ARTIFACT · 60-SEC ROLLBACK', h1Html: 'Prompt + model + eval as one · <em>canary · shadow · rollback</em>', subtitleHtml: '<strong>If rollback takes more than 60 seconds, you don\'t have rollback. You have hope.</strong>' },
  { type: 'content', eyebrow: 'The one-artifact discipline', icon: '1', headlineHtml: 'Prompt + model + eval · <em>one versioned triple</em>',
    blocks: [{ atStep: 1, html: card('THE ONE-ARTIFACT DISCIPLINE', 'Why most teams break in production', ['<strong>Most teams version</strong> prompts in one place · model selection in another · eval suites in a third. <em>Production breaks because they drift independently.</em>'], '<strong>The fix:</strong> treat prompt + model version + eval suite as one versioned artifact. A deploy is a triple. Production points at one triple at a time. Rollback = change the triple.') }] },
  { type: 'content', eyebrow: '3 rollout patterns', icon: '2', headlineHtml: 'Shadow · canary · <em>feature flag</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'Shadow', '', 'New artifact alongside · old serves users. Compare offline. <strong>No user impact. For high-risk changes.</strong>', 'green')}
${cell('R2', 'Canary', '', '1-5% of traffic. Monitor regressions. <strong>Roll forward to 100% over hours/days.</strong>', 'green')}
${cell('R3', 'Feature flag per user', '', 'Internal + opt-ins first. <strong>For changes needing real user feedback first.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '60-second rollback', icon: '!', iconRed: true, headlineHtml: 'Versioned artifacts · routing · evals · <em>observability survives</em>',
    blocks: [{ atStep: 1, html: cardRed('ROLLBACK AS ONE COMMAND', 'If it takes >60 seconds, you have hope', ['<strong>What makes 60-second rollback possible:</strong>'], '<strong>Versioned artifacts</strong> · old triple still exists. <strong>Traffic-routing layer</strong> · switch which triple is served, not redeploy. <strong>Eval suite in CI</strong> · know what good looks like for rolled-back version. <strong>Observability survives rollback</strong> · compare before/after. Without these → rollback means "deploy yesterday\'s code from scratch" → 30-60 minutes during incident.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Rollback tested · <em>traceable triple</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE VERSIONING DISCIPLINE', '2 questions', ['<strong>Q1:</strong> on-call can roll back in under 60 seconds? Tested yes green · "we think so" amber · <strong>no/never-tested red — incident teaches the hard way</strong>.', '<strong>Q2:</strong> when answers go bad, can you trace to exact prompt+model+eval triple at that time? Yes green · partial amber · <strong>no red — root-cause stalls</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Run a rollback drill', ['Pick a prod LLM feature. Roll back · smoke test · roll forward. Time the steps. <strong>That\'s your incident response baseline.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Observability with traces · <em>OpenTelemetry + MLflow + LangSmith</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'One artifact · 3 rollout · 60-sec rollback.', '<strong>Next:</strong> OTel GenAI · 2 stacks · A/B testing on traces.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Observability with traces' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-observability.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · OPENTELEMETRY GENAI · MLFLOW + LANGSMITH', h1Html: 'Trace search · replay · <em>A/B on traces</em>', subtitleHtml: '<strong>"Which step caused it?" — without traces, you don\'t know.</strong>' },
  { type: 'content', eyebrow: 'Why traces matter more', icon: '1', headlineHtml: '5-15 non-deterministic steps · <em>per request</em>',
    blocks: [{ atStep: 1, html: card('WHY TRACES MATTER MORE FOR LLMS', '5-15 steps · non-deterministic each', ['<strong>Classical systems:</strong> few well-defined paths. Start + end logs suffice.', '<strong>LLM systems:</strong> retrieval · prompt construction · model call · tool calls · parsing · post-processing. <em>5-15 steps with non-deterministic outputs.</em>'], 'When something goes wrong, <strong>"which step caused it?"</strong> is first question. Without traces, you don\'t know.') }] },
  { type: 'content', eyebrow: 'OpenTelemetry GenAI', icon: '2', headlineHtml: 'Vendor-neutral schema · <em>tools read same fields</em>',
    blocks: [{ atStep: 1, html: card('OPENTELEMETRY GENAI SEMANTIC CONVENTIONS', 'Vendor-neutral · shared schema', ['<strong>Span attributes you instrument:</strong>', 'gen-ai.system: "openai" or "anthropic" or "bedrock"', 'gen-ai.request.model: "gpt-4o" or "claude-sonnet-4"', 'gen-ai.usage.input_tokens · output_tokens — for cost attribution', 'gen-ai.prompt + gen-ai.completion — actual content (subject to PII redaction)'], '<strong>Why standard schemas matter:</strong> eval · cost · drift tooling all read same fields. No bespoke parsing.') }] },
  { type: 'content', eyebrow: 'Tooling stack', icon: '3', headlineHtml: 'MLflow · <em>LangSmith</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'MLflow', '', 'OSS · self-host. Strong ML lineage. LLM tracing first-class. <strong>Pairs with Databricks.</strong>', 'green')}
${cell('S2', 'LangSmith', '', 'Managed by LangChain. Strong on trace search · replay · eval linking. <strong>Pay-per-trace. Moderate lock-in.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'A/B testing on traces', icon: '4', headlineHtml: 'Non-determinism makes single-run noisy · <em>replay vs replay</em>',
    blocks: [
      { atStep: 1, html: card('A/B TESTING LLM SYSTEMS · BUILT ON TRACES', 'Harder than classical A/B', ['A/B testing LLMs is harder. <em>Non-determinism makes single-run comparisons noisy. User feedback signals lag — sometimes days.</em>', '<strong>The discipline:</strong> use traces as eval substrate. Replay both prompts/models against same input sample. Compare outputs with judges.', '<strong>Avoid the trap:</strong> don\'t judge on a single offline metric. Online behavior — engagement · completion · escalation rate — must be the gate.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull one production LLM request from last 24h', ['Walk the trace. <strong>If you can\'t see every step + cost + latency, your observability has gaps.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Incident response · <em>4 types + 5-question triage</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'OTel GenAI · 2 stacks · A/B on traces.', '<strong>Next:</strong> 4 incident types · triage · post-mortem.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Incident response for LLM failures' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-incidents.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · 4 INCIDENT TYPES · 5-Q TRIAGE', h1Html: 'Quality · drift · abuse · vendor outage · <em>eval-case-it post-mortem</em>', subtitleHtml: '<strong>Every incident produces at least one new eval case. Otherwise it repeats.</strong>' },
  { type: 'content', eyebrow: '4 incident types', icon: '!', iconRed: true, headlineHtml: 'Quality regression · drift · abuse · <em>vendor outage</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('I1', 'Quality regression', '', 'New deploy made things worse. <strong>Catch: eval suite + canary. Fix: rollback.</strong>', 'red')}
${cell('I2', 'Drift incident', '', 'Vendor updated model. Silent behavior change. <strong>Catch: drift monitoring. Fix: pin version or update prompts.</strong>', 'red')}
${cell('I3', 'Abuse incident', '', 'Prompt injection · jailbreak · ATO. <strong>Catch: input patterns + content filters. Fix: validation + rate limit.</strong>', 'red')}
${cell('I4', 'Vendor outage', '', 'OpenAI down · Azure 503. <strong>Catch: vendor health. Fix: failover + degraded mode.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Triage in 5 questions', icon: '1', headlineHtml: 'New behavior · same model · same prompt · same retrieval · <em>same input distribution</em>',
    blocks: [{ atStep: 1, html: card('TRIAGE IN 5 QUESTIONS', 'Knowing which incident type is step 1', ['<strong>Q1 — is bad behavior new?</strong> Compare last 24h to baseline.', '<strong>Q2 — model version same?</strong> Vendor updates appear as silent drift.', '<strong>Q3 — prompt same?</strong> Recent deploy changed it?', '<strong>Q4 — retrieval input same?</strong> New docs indexed? Source disconnected?', '<strong>Q5 — input distribution same?</strong> New cohort? Campaign launch?'], 'If yes to any → starting point. If no to all → escalate to root-cause investigation.') }] },
  { type: 'content', eyebrow: 'The eval-case-it post-mortem', icon: '2', headlineHtml: 'Promises don\'t survive · <em>eval cases do</em>',
    blocks: [{ atStep: 1, html: card('THE POST-MORTEM THAT PRODUCES DURABLE EVAL CASES', 'Most produce promises · this produces tests', ['<strong>Most post-mortems produce promises:</strong> "We\'ll add monitoring." 6 months later → same incident reoccurs.', '<strong>Better:</strong> every incident produces at least one new eval case. Becomes part of regression set. Next deploy that would reintroduce the bug fails CI.'], '<strong>The discipline:</strong> reproduce as deterministic test case · add to regression set · verify rollout that introduced bug now fails CI · THEN close incident.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Eval case per incident · <em>written runbooks</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INCIDENT RESPONSE', '2 questions', ['<strong>Q1:</strong> last 5 LLM incidents · each produced a new eval case? All 5 green · 3-4 amber · <strong><3 red — incidents repeat</strong>.', '<strong>Q2:</strong> on-call has written LLMOps runbook for each incident type? Yes green · some amber · <strong>no red — first 3am incident is where you learn</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sit with on-call for an hour', ['Walk a recent incident. <strong>Was a new eval case added? If not, that\'s the discipline gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · LLMOps runbook · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 types · 5-Q triage · eval-case-it.', '<strong>Last:</strong> 5-section runbook · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={eval:'',tracing:'',rollout:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='llmops-runbook.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var e=state.eval||'_(pick eval cadence)_';var t=state.tracing||'_(pick tracing stack)_';var r=state.rollout||'_(pick rollout pattern)_';return '# LLMOps Runbook\\n\\n**Platform owner:** ____________________\\n**Date:** ____________________\\n\\n## Eval cadence\\n> '+e+'\\n\\n## Tracing stack\\n> '+t+'\\n\\n## Rollout pattern\\n> '+r+'\\n\\n## 5-section runbook checklist\\n- [ ] Eval suite: gold + sampled prod · owners named\\n- [ ] Drift monitors: input · output · behavioral · runbook per alert\\n- [ ] Cost telemetry: per-feature · per-cohort · p95/p99 · reviewed weekly\\n- [ ] Versioning + rollout: prompt+model+eval as one artifact · 60-sec rollback tested\\n- [ ] Incident response: 4 types · 5-question triage · eval-case-it post-mortem\\n\\n## 4 trust trip-wires (do not cross)\\n- Offline accuracy as production gate (need online evals)\\n- Rollback that takes more than 60 seconds (untested = doesn\\\'t work)\\n- Incidents without eval cases (promises don\\\'t survive)\\n- Observability with PII in logs (GDPR · HIPAA · DPDPA cross-domain — tokenize)\\n\\n---\\nSource: Gennoor Academy · MLOps for LLMs\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — your LLMOps runbook' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · LLMOPS RUNBOOK · WHAT ON-CALL OPERATES AGAINST AT 3AM', h1Html: '5 sections · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>LLMOps is a discipline, not a vendor product.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Discipline · <em>not vendor product</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Runbook is what on-call operates against', ['<strong>LLMOps is a discipline, not a vendor product.</strong> The runbook is what your on-call operates against at 3am.']) }] },
  { type: 'content', eyebrow: '5-section runbook', icon: '2', headlineHtml: 'Evals · drift · cost · versioning · <em>incidents</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'Eval suite', '', 'Gold + sampled prod. Run every deploy. Owners named.')}
${cell('R2', 'Drift monitors', '', 'Input · output · behavioral. Each alert has a runbook entry.', 'amber')}
${cell('R3', 'Cost telemetry', '', 'Per-feature · per-cohort · p95/p99. Reviewed weekly.', 'green')}
${cell('R4', 'Versioning + rollout', '', 'One-artifact triple. Canary · shadow · 60-sec rollback.', 'green')}
${cell('R5', 'Incident response', '', '4 types · 5-question triage · eval-case-it post-mortem.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Offline gate · slow rollback · no eval cases · <em>PII in logs</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Offline accuracy as gate', '', 'Doesn\'t predict prod. Online evals required.', 'red')}
${cell('W2', 'Rollback over 60 sec', '', 'Stated capability or fiction. Test it.', 'red')}
${cell('W3', 'Incidents without eval cases', '', 'Promises don\'t survive next quarter. Eval cases do.', 'red')}
${cell('W4', 'PII in observability logs', '', 'GDPR · HIPAA · DPDPA cross-domain. Tokenize before storing.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · runbook builder', icon: '✓', headlineHtml: 'Eval · tracing · rollout · <em>take to platform team</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Eval cadence</h5><div class="preset" data-group="eval">
<button data-val="Gold + 1% production sampling with LLM-as-judge — daily review">Gold + 1% sampling</button>
<button data-val="Gold + 5% production sampling + human-in-loop on disagreements">Gold + 5% + HITL</button>
<button data-val="Gold-only with quarterly production sample review (lower volume features)">Gold-only quarterly</button>
</div></div>
<div class="group"><h5>Tracing stack</h5><div class="preset" data-group="tracing">
<button data-val="MLflow on Databricks (OSS, strong ML lineage, pairs with platform)">MLflow on Databricks</button>
<button data-val="LangSmith managed (trace search + replay + eval linking)">LangSmith managed</button>
<button data-val="OTel GenAI + Jaeger/Honeycomb (vendor-neutral, infra-team operated)">OTel + own backend</button>
</div></div>
<div class="group"><h5>Rollout pattern</h5><div class="preset" data-group="rollout">
<button data-val="Canary 1-5% for 24h then 100% (default for most changes)">Canary 1-5%</button>
<button data-val="Shadow + canary (high-risk changes: model swaps, major prompt rewrites)">Shadow + canary</button>
<button data-val="Feature flag per user (changes needing real-user feedback first)">Feature flag</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my LLMOps runbook (.md)</button>
</div>
<div class="preview" id="preview"># LLMOps Runbook

Pick eval cadence, tracing stack, and rollout pattern on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'LLMs fail differently · 5-section runbook · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>LLMs in production don't fail like classical ML. Online evals on sampled production. Three drift types. Cost as a feature. Versioned artifacts with 60-second rollback. Traces with OpenTelemetry GenAI. Four incident types. Eval-case-it post-mortems.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your runbook.</div><div class="row"><span class="arr">→</span>Get platform team review on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 38 chapters 1-8 built.')
