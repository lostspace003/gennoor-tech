// Course 39 — Azure AI Foundry Essentials (Emma · builder track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Builder · Azure AI Foundry'
const OUT = 'tmp/academy-build/azure-ai-foundry-essentials/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'Foundry architecture' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-architecture.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · PRODUCTION LAYER ON AZURE AI', h1Html: '3-layer architecture · <em>when Foundry beats raw Azure OpenAI</em>', subtitleHtml: '<strong>Foundry is the consolidation layer. Premature Foundry is overhead. Late Foundry is rework.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Consolidation · <em>one place to manage what scales</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Foundry is the production layer on top of Azure AI', ['You can build LLM features by gluing Azure OpenAI + AI Search + Functions. <strong>Most teams do.</strong>', 'Three projects in: operational mess. Different deployment patterns · identity strategies · cost dashboards. <em>Nothing scales.</em>'], 'Foundry consolidates that. Hub · project · connections. <strong>Learn one abstraction. Pay back in operational simplicity.</strong>') }] },
  { type: 'content', eyebrow: '3-layer architecture', icon: '2', headlineHtml: 'Hub · project · <em>connections</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('L1', 'Hub', '', 'Tenant-level. Shared compute · Key Vault · identity. <strong>One hub per BU.</strong>')}
${cell('L2', 'Project', '', 'Specific workload — models · evals · deployments · traces. <strong>One project per shipping feature.</strong>', 'amber')}
${cell('L3', 'Connections', '', 'How project reaches Azure OpenAI · AI Search · storage · custom. <strong>Project-level + managed identity.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Foundry vs raw Azure OpenAI', icon: '3', headlineHtml: 'Start raw · <em>migrate at feature 3</em>',
    blocks: [{ atStep: 1, html: card('FOUNDRY VS RAW · WHEN EACH FITS', 'Don\'t prematurely consolidate', ['<strong>Raw Azure OpenAI fits</strong> single feature · one team · mature MLOps already in place. Foundry adds overhead you don\'t need.', '<strong>Foundry pays back</strong> multiple features · multiple teams · shared eval discipline. Centralised cost + identity + observability.'], '<strong>Migration path:</strong> start raw → migrate at feature 3. Premature Foundry is overhead. Late Foundry is rework.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: '3+ features · <em>platform-operated</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FOUNDRY READINESS', '2 questions', ['<strong>Q1:</strong> 3+ LLM features in production? Yes green · 1-2 amber · <strong>zero red — raw Azure OpenAI is fine</strong>.', '<strong>Q2:</strong> platform team operates the hub, or every dev team rolls their own? Platform-operated green · mixed amber · <strong>every-team-rolls-own red — value lost</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Inventory your current Azure AI workloads', ['Map each to: which hub, which project. <strong>If everything is "ad-hoc," that\'s the migration plan.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Model catalog · <em>4 families + 3 deployment types</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', '3-layer architecture · raw vs Foundry · migration path.', '<strong>Next:</strong> 4 model families · 3 deployment types · 3 selection criteria.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Model catalog navigation' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-catalog.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · 4 FAMILIES · 3 DEPLOYMENT TYPES', h1Html: 'Pick on your eval set · <em>not vendor benchmarks</em>', subtitleHtml: '<strong>Cost per successful task — not per token. Operational fit beats what\'s exciting.</strong>' },
  { type: 'content', eyebrow: '4 model families', icon: '1', headlineHtml: 'Azure OpenAI · open-weight · partner · <em>custom</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('F1', 'Azure OpenAI', '', 'GPT-4 series · GPT-4o · o1 · embeddings. <strong>MS-hosted. SLA + RAI tooling.</strong>', 'green')}
${cell('F2', 'Open-weight', '', 'Llama · Mistral · Phi · Mixtral. <strong>Managed compute or serverless. Lower cost + more ops.</strong>', 'green')}
${cell('F3', 'Partner', '', 'Cohere · AI21 · Stability via marketplace. <strong>Licensing varies. Specialised fit.</strong>', 'amber')}
${cell('F4', 'Fine-tuned + custom', '', 'Your own fine-tunes on managed compute. <strong>Most teams skip until specific evidence.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '3 deployment types', icon: '2', headlineHtml: 'Serverless · managed compute · <em>batch</em>',
    blocks: [{ atStep: 1, html: card('3 DEPLOYMENT TYPES · WHEN EACH FITS', 'Start serverless. Move when justified.', ['<strong>Serverless API.</strong> Pay per token. No infra. <em>Default for most workloads. Latency p99 variable.</em>', '<strong>Managed compute.</strong> Dedicated GPU · provisioned capacity. <em>Lower per-token above ~10M tokens/month. Predictable latency.</em>', '<strong>Batch endpoints.</strong> Async. Lowest cost. <em>Document summarisation · embedding pipelines · eval runs.</em>']) }] },
  { type: 'content', eyebrow: '3 selection criteria', icon: '3', headlineHtml: 'Eval set · cost per task · <em>operational fit</em>',
    blocks: [{ atStep: 1, html: cardRed('PICK BY THE DATA · NOT THE SLIDE DECK', '3 selection criteria', ['<strong>1. Quality on your eval set.</strong> Not vendor benchmarks. Your eval on your workload. No exceptions.', '<strong>2. Cost per successful task.</strong> Not per token. Cheap models needing 3 retries are expensive.', '<strong>3. Operational fit.</strong> Security accepts deployment type? Latency budget holds? <em>Pick what passes review.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Evaluated on YOUR set · <em>cost modelled per task</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE MODEL SELECTION', '2 questions', ['<strong>Q1:</strong> top pick evaluated on your eval set, not vendor benchmarks? Yes green · vendor only amber · <strong>vibes red</strong>.', '<strong>Q2:</strong> cost modelled per successful task, not per token? Yes green · per-token amber · <strong>no model at all red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick your top 3 candidate models', ['Run your eval set against each. <strong>Decide on the data, not the slide deck.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Project setup + identity · <em>managed identity + Key Vault + private endpoints</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 families · 3 deployment types · 3 selection criteria.', '<strong>Next:</strong> managed identity · Key Vault · private endpoints.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Project setup and identity' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-identity.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · WHERE PRODUCTION INCIDENTS START', h1Html: 'Managed identity · Key Vault · <em>private endpoints</em>', subtitleHtml: '<strong>Make the wrong way harder than the right way. Managed identity makes credentials disappear from code.</strong>' },
  { type: 'content', eyebrow: 'Why identity matters', icon: '!', iconRed: true, headlineHtml: 'API keys leak · rotate · <em>audit asks for the trail</em>',
    blocks: [{ atStep: 1, html: cardRed('WHY IDENTITY SETUP IS WHERE THINGS GO WRONG', 'Default = API keys in env vars', ['Works in dev. Looks fine in pipelines. <strong>Until a key leaks. Or rotates. Or audit asks for the trail.</strong>'], 'The fix isn\'t a process. <strong>The fix is making the wrong way harder than the right way.</strong> Managed identity makes credentials disappear from your code entirely.') }] },
  { type: 'content', eyebrow: 'Managed identity pattern', icon: '1', headlineHtml: '3 steps · <em>DefaultAzureCredential</em>',
    blocks: [{ atStep: 1, html: card('MANAGED IDENTITY · THE WORKING PATTERN', '3 steps · keys never leave Azure', ['<strong>Step 1.</strong> Project gets system-assigned managed identity at creation. Azure handles credential lifecycle.', '<strong>Step 2.</strong> Assign that identity RBAC roles on resources it needs. Storage Blob Data Reader · Cognitive Services User · Key Vault Secrets User.', '<strong>Step 3.</strong> Code calls DefaultAzureCredential. <em>Same code: dev identity locally · service principal in CI/CD · managed identity in prod. No key handling.</em>'], 'Result: keys never leave Azure. <strong>Audit trail automatic.</strong>') }] },
  { type: 'content', eyebrow: 'Key Vault for the rest', icon: '2', headlineHtml: 'Third-party · webhooks · <em>legacy systems</em>',
    blocks: [{ atStep: 1, html: card('KEY VAULT · FOR WHAT CAN\'T BE MANAGED IDENTITY', 'Third-party APIs · webhooks · legacy', ['Store credentials in Key Vault. Reference them in Foundry connections <strong>by name, not value</strong>. Vault is the only place credentials live.', '<strong>Audit access patterns.</strong> Key Vault logs every credential read. Review weekly. <em>Catch broken access patterns before they\'re exploited.</em>']) }] },
  { type: 'content', eyebrow: 'Private endpoints', icon: '!', iconRed: true, headlineHtml: 'PHI · PII · financial · data residency · <em>not optional</em>',
    blocks: [
      { atStep: 1, html: cardRed('PRIVATE ENDPOINTS · FOR REGULATED WORKLOADS', 'No public network exposure', ['If workload handles PHI · PII · financial · data residency requirements → <strong>private endpoints are not optional</strong>.', '<strong>Pattern:</strong> Foundry · AI Search · storage all behind private endpoints in your VNet. Traffic stays inside Azure.', '<strong>Cost:</strong> more expensive · slower setup. <em>For regulated workloads, the alternative is failing the audit.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit current LLM workloads for credential handling', ['Find one place with an API key in env vars. <strong>That\'s the first managed-identity migration.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Evaluation harness · <em>built-in + custom evaluators</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Managed identity · Key Vault · private endpoints.', '<strong>Next:</strong> built-in evaluators · 3 custom patterns · eval workflow that scales.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Evaluation harness' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-eval.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · BUILT-IN + CUSTOM JUDGES', h1Html: 'Foundry evaluators · <em>eval workflow that scales</em>', subtitleHtml: '<strong>Like unit tests, but for LLM outputs. Block deploys that regress.</strong>' },
  { type: 'content', eyebrow: 'Built-in evaluators', icon: '1', headlineHtml: 'Groundedness · relevance · coherence · <em>safety</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('E1', 'Groundedness', '', 'Does answer ground in provided context? <strong>For RAG, catches hallucinations.</strong>', 'green')}
${cell('E2', 'Relevance', '', 'Does answer address the question? Catches drift after valid retrieval.', 'green')}
${cell('E3', 'Coherence + fluency', '', 'Standard output-quality metrics. <strong>Less load-bearing, worth tracking.</strong>', 'green')}
${cell('E4', 'Safety', '', 'Azure Content Safety. <strong>Required for customer-facing surfaces.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 custom patterns', icon: '2', headlineHtml: 'LLM-as-judge · code-based · <em>human in loop</em>',
    blocks: [{ atStep: 1, html: card('3 PATTERNS FOR CUSTOM EVALUATORS', 'Wire to your domain', ['<strong>1. LLM-as-judge with structured rubric.</strong> Different family than generator. 1-5 scale. <em>Reproducibility from structure.</em>', '<strong>2. Code-based evaluator.</strong> Regex · JSON schema · format check. <em>For deterministic criteria — JSON output · required fields · citation links resolvable.</em>', '<strong>3. Human-in-loop for high-stakes.</strong> Sampling for cases that matter. <em>Don\'t average and move on when humans and judges disagree.</em>']) }] },
  { type: 'content', eyebrow: 'The eval workflow', icon: '3', headlineHtml: '4 steps · <em>like unit tests for outputs</em>',
    blocks: [{ atStep: 1, html: card('THE FOUNDRY EVAL WORKFLOW THAT SCALES', '4 steps', ['<strong>Step 1.</strong> Build a gold eval set in Foundry — 50 to 200 examples covering happy path · edge cases · adversarial.', '<strong>Step 2.</strong> Wire as a flow that runs on every model or prompt change. <em>Like unit tests, but for LLM outputs.</em>', '<strong>Step 3.</strong> Compare runs against baseline. Block deploys that regress. Allow deploys that improve.', '<strong>Step 4.</strong> Production sampling layer. Daily sample for drift. Weekly review of disagreements.'], 'Without the workflow, eval is a one-time exercise. <em>Quality drifts silently.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Eval flow on every change · <em>safety wired with action-on-fail</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FOUNDRY EVAL DISCIPLINE', '2 questions', ['<strong>Q1:</strong> every prompt/model change runs eval flow before deploy? Automated green · manual amber · <strong>no red — regressions ship</strong>.', '<strong>Q2:</strong> customer-facing surface — safety wired + action-on-fail defined? Yes green · safety only amber · <strong>no red — content safety incident waiting</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Set up a 50-example gold eval flow in Foundry', ['For one production workload. Run against current model + prompt. <strong>That baseline is what you defend against drift.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Deployment options · <em>serverless · managed · PTU · batch</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 built-in · 3 custom · 4-step workflow.', '<strong>Next:</strong> 4 deployment types · 3 latency rules.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Deployment options' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-deployment.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · SERVERLESS · PTU · MANAGED · BATCH', h1Html: '4 deployment types · <em>3 latency rules</em>', subtitleHtml: '<strong>Start serverless. Move to PTU when calculator says so. Batch for everything async.</strong>' },
  { type: 'content', eyebrow: '4 deployment types', icon: '1', headlineHtml: 'Serverless · PTU · managed · <em>batch</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('D1', 'Serverless API', '', 'Shared infra · pay per token. <strong>Default. Lowest barrier. Variable latency.</strong>', 'green')}
${cell('D2', 'Provisioned Throughput Units (PTU)', '', 'Reserved Azure OpenAI capacity · fixed cost/hour. <strong>Predictable latency. Cheaper above threshold.</strong>', 'green')}
${cell('D3', 'Managed compute', '', 'Dedicated GPU instances · full control. <strong>Open-weight, custom fine-tunes, most-control workloads.</strong>', 'amber')}
${cell('D4', 'Batch endpoints', '', 'Async · lowest cost. <strong>Document pipelines · eval runs · periodic re-embedding.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'When each fits', icon: '2', headlineHtml: 'Serverless ≤5M · PTU ≥10M · <em>batch anywhere async</em>',
    blocks: [{ atStep: 1, html: card('WHEN EACH DEPLOYMENT TYPE FITS', 'Calculator-driven, not vibes', ['<strong>Serverless.</strong> Default. Prototypes + low-volume production. Up to ~5M tokens/month per workload.', '<strong>PTU.</strong> Tipping point around 10M tokens/month. Calculator: last month\'s tokens · PTU price at your tier vs serverless cost. Switch when PTU cheaper.', '<strong>Managed compute.</strong> Open-weight models · data-residency guarantees. Higher fixed cost · you operate.', '<strong>Batch.</strong> Anything that can wait minutes to hours. Cost reduction often 50%+.']) }] },
  { type: 'content', eyebrow: '3 latency rules', icon: '!', iconRed: true, headlineHtml: 'Serverless p99 variable · PTU stabilises · <em>batch is minutes</em>',
    blocks: [{ atStep: 1, html: cardRed('3 LATENCY RULES', 'PTU is often bought for latency, not cost', ['<strong>Rule 1 — serverless P99 is variable.</strong> Busy day → P99 spikes 3-5x. Critical if sub-second budget.', '<strong>Rule 2 — PTU stabilises latency.</strong> Reserved = consistent. <em>Often the actual reason to pay for PTU.</em>', '<strong>Rule 3 — batch is irrelevant to latency.</strong> Real-time user query in batch = minutes, not seconds.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Match volume + latency · <em>PTU calc this quarter</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DEPLOYMENT FIT', '2 questions', ['<strong>Q1:</strong> deployment type matches volume + latency profile? Yes green · "picked 6 mo ago" amber · <strong>no/no-one-checked red</strong>.', '<strong>Q2:</strong> for high-volume workloads, PTU vs serverless calculated last quarter? Yes green · informally amber · <strong>no red — money on table or fire starting</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last month\'s token count by workload', ['Map each to recommended deployment type. <strong>Mismatches are your cost or quality optimization.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Cost monitoring · <em>Azure Monitor + Cost Management + 3 alerts</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 deployment types · 3 latency rules · scoring.', '<strong>Next:</strong> 3 telemetry sources · 3 alerts · 3 mandated tags.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Cost monitoring' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-cost.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · CATCHING RUNAWAY SPEND BEFORE INVOICE DAY', h1Html: '3 sources · 3 alerts · <em>3 mandated tags</em>', subtitleHtml: '<strong>Without telemetry, cost surprises arrive at month-end. Without alerts, in the next bill.</strong>' },
  { type: 'content', eyebrow: '3 telemetry sources', icon: '1', headlineHtml: 'Azure Monitor · Cost Management · <em>Foundry dashboards</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Azure Monitor metrics', '', 'Tokens · requests · errors · latency. <strong>OOTB. Free to query.</strong>', 'green')}
${cell('T2', 'Cost Management', '', 'Daily + forecast cost by resource · tag · subscription. <strong>Subscription-level first.</strong>', 'green')}
${cell('T3', 'Foundry usage dashboards', '', 'Per-project tokens · model breakdown. <strong>Project view maps cleanly to feature.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 alerts that fire', icon: '2', headlineHtml: 'Daily spend · weekly forecast · <em>per-request spike</em>',
    blocks: [{ atStep: 1, html: card('3 ALERTS THAT TRIGGER BEFORE YOU\'RE HURT', '', ['<strong>Alert 1 — daily spend threshold.</strong> Workload typically $X/day · alert at 2x. Catches abuse · runaway loops · accidental load tests.', '<strong>Alert 2 — weekly forecast.</strong> Cost Management forecast crosses budget. Catches steady growth before Q3 surprise.', '<strong>Alert 3 — per-request token spike.</strong> Median 5k tokens · alert when p95 crosses 50k. <em>Catches accidental large-context queries.</em>']) }] },
  { type: 'content', eyebrow: '3 mandated tags', icon: '3', headlineHtml: 'Feature · environment · <em>owner</em>',
    blocks: [{ atStep: 1, html: card('3 COST TAGS YOU MANDATE', 'Enforce via Azure Policy', ['<strong>Tag 1 — feature.</strong> Which product? Maps cost to revenue.', '<strong>Tag 2 — environment.</strong> Dev · test · prod. Catches dev workloads accidentally hitting prod volume.', '<strong>Tag 3 — owner.</strong> Which team? Removes "who\'s spending this?" debates.'], 'Enforce via Azure Policy. <strong>Resources without these tags blocked at creation. Sounds harsh. Pays back monthly.</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'CFO sees per-feature · <em>all 3 alerts in place</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FOUNDRY COST DISCIPLINE', '2 questions', ['<strong>Q1:</strong> CFO can see LLM cost by feature · environment · team? Yes green · partial amber · <strong>total-only red — optimisation blind</strong>.', '<strong>Q2:</strong> all 3 alerts in place (daily · forecast · spike)? Yes green · 1-2 amber · <strong>zero red — month-end surprises waiting</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last 30 days of Foundry cost', ['Break down by feature using tags. <strong>If not possible, that\'s the first tag-policy enforcement.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Production readiness · <em>20-item checklist + 3 disqualifiers</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 telemetry · 3 alerts · 3 tags.', '<strong>Next:</strong> 4 categories × 5 items · 3 disqualifiers.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Production readiness checklist' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-readiness.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · 20-ITEM CHECKLIST · 3 DISQUALIFIERS', h1Html: 'Security · evals · observability · <em>rollback + DR</em>', subtitleHtml: '<strong>Other items can land amber. Three disqualifiers are red or green.</strong>' },
  { type: 'content', eyebrow: '4 categories', icon: '1', headlineHtml: '5 items per category · <em>20 total</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'Security + identity (5)', '', 'Managed identity · Key Vault secrets · private endpoints · content safety · RBAC reviewed.', 'green')}
${cell('C2', 'Evaluation (5)', '', 'Gold eval set · runs every deploy · baseline documented · disagreement triage · adversarial cases.', 'green')}
${cell('C3', 'Observability (5)', '', 'Foundry traces · per-feature cost · alerts · on-call runbook · PII redaction in logs.', 'green')}
${cell('C4', 'Rollback + DR (5)', '', 'Versioned artifacts · 60-sec rollback tested · regional failover · vendor outage degraded mode · quarterly DR drill.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 disqualifiers', icon: '!', iconRed: true, headlineHtml: 'No managed identity · no eval flow · <em>no rollback path</em>',
    blocks: [{ atStep: 1, html: cardRed('3 DISQUALIFIERS · BLOCK GO-LIVE REGARDLESS', 'Red or green · never amber', ['<strong>1. No managed identity.</strong> API keys in env vars → you do not go to production. Audit will fail. Incident response will fail.', '<strong>2. No eval flow.</strong> Without measurement, every change is a guess. <em>No eval = no go-live.</em>', '<strong>3. No rollback path.</strong> Can\'t roll back in <60 seconds → one bad deploy from multi-hour outage. <em>Test it before going live.</em>']) }] },
  { type: 'content', eyebrow: 'The sign-off', icon: '2', headlineHtml: 'One-pager · owners named · <em>quarterly audit</em>',
    blocks: [{ atStep: 1, html: card('THE PRODUCTION-READINESS SIGN-OFF', 'Not a Slack message · a documented sign-off', ['<strong>Format:</strong> one-pager · checklist filled · owners named. Signed by feature owner + platform lead.', '<strong>Stored:</strong> Foundry project page · linked from deployment record.', '<strong>Audit:</strong> quarterly review of all production sign-offs. <em>Catches drift between approved + actually running.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Recent go-live disqualifiers cleared · <em>quarterly review happens</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PRODUCTION-READINESS', '2 questions', ['<strong>Q1:</strong> most recent go-live had all 3 disqualifiers cleared? Verified yes green · "we think" amber · <strong>no/skipped red — incident on way</strong>.', '<strong>Q2:</strong> platform team does quarterly review of sign-offs? Yes green · ad-hoc amber · <strong>no red — drift invisible</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull most recent production LLM workload', ['Walk the 20-item checklist. <strong>Items in red are your blocker list.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · production sign-off pack · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '20 items · 4 categories · 3 disqualifiers · sign-off.', '<strong>Last:</strong> sign-off pack format · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={deploy:'',eval:'',identity:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='foundry-signoff-pack.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var d=state.deploy||'_(pick deployment type)_';var e=state.eval||'_(pick eval depth)_';var i=state.identity||'_(pick identity model)_';return '# Foundry Production Sign-Off Pack\\n\\n**Workload owner:** ____________________\\n**Platform lead:** ____________________\\n\\n## Deployment\\n> '+d+'\\n\\n## Eval depth\\n> '+e+'\\n\\n## Identity model\\n> '+i+'\\n\\n## 4-section sign-off checklist\\n- [ ] Workload summary: what · who · expected volume · latency budget\\n- [ ] Deployment plan: model · type · identity + KV + endpoint setup · region\\n- [ ] Eval evidence: gold set · baseline · last 3 runs · disagreement notes\\n- [ ] Operational readiness: cost telemetry · 3 alerts · rollback tested · runbook\\n\\n## 4 trust trip-wires (do not cross)\\n- API keys in env vars (use managed identity)\\n- Workload promoted without eval flow\\n- Rollback that hasn\\\'t been tested\\n- Production cost without per-feature breakdown\\n\\n---\\nSource: Gennoor Academy · Azure AI Foundry Essentials\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — Foundry production sign-off' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · SIGN-OFF PACK · WHAT PLATFORM TEAM ACCEPTS', h1Html: 'Workload · deployment · eval · ops · <em>the builder</em>', subtitleHtml: '<strong>Foundry promotes you from POC to production. The sign-off pack is the evidence.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'POC → production · <em>evidence platform team accepts</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Sign-off pack is the evidence', ['<strong>Foundry promotes you from POC to production.</strong> The sign-off pack is what your platform team accepts as evidence.']) }] },
  { type: 'content', eyebrow: 'The sign-off pack', icon: '2', headlineHtml: 'Workload · deployment · eval · <em>operational readiness</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'Workload summary', '', 'What it does · who uses · volume · latency budget.')}
${cell('S2', 'Deployment plan', '', 'Model · type · identity + KV + endpoint · region.', 'amber')}
${cell('S3', 'Eval evidence', '', 'Gold set + baseline + last 3 runs + disagreement triage.', 'green')}
${cell('S4', 'Operational readiness', '', 'Cost telemetry · 3 alerts · rollback tested · runbook.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Keys in env · no eval flow · untested rollback · <em>no per-feature cost</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'API keys in env vars', '', 'Use managed identity. Always.', 'red')}
${cell('W2', 'Promoted without eval flow', '', 'Every deploy without measurement is a guess.', 'red')}
${cell('W3', 'Untested rollback', '', 'Untested rollback during incident = no rollback.', 'red')}
${cell('W4', 'No per-feature cost breakdown', '', 'Optimisation is blind without it.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · sign-off pack builder', icon: '✓', headlineHtml: 'Deployment · eval · identity · <em>take to platform review</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Deployment type</h5><div class="preset" data-group="deploy">
<button data-val="Serverless API — default for prototypes and ≤5M tokens/month">Serverless</button>
<button data-val="Provisioned Throughput Units (PTU) — predictable latency, ≥10M tokens/month">PTU</button>
<button data-val="Managed compute — open-weight models or data-residency required">Managed compute</button>
<button data-val="Batch endpoints — async processing, lowest cost">Batch</button>
</div></div>
<div class="group"><h5>Eval depth</h5><div class="preset" data-group="eval">
<button data-val="Built-in evaluators (groundedness, relevance, safety) on every deploy">Built-in only</button>
<button data-val="Built-in + custom LLM-as-judge with structured rubric">Built-in + LLM-judge</button>
<button data-val="Built-in + custom + human-in-loop sampling on high-stakes flows">Full (built-in + custom + HITL)</button>
</div></div>
<div class="group"><h5>Identity model</h5><div class="preset" data-group="identity">
<button data-val="Managed identity + Key Vault for residual credentials">Managed identity + KV</button>
<button data-val="Managed identity + Key Vault + private endpoints (regulated workloads)">+ Private endpoints</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my Foundry sign-off pack (.md)</button>
</div>
<div class="preview" id="preview"># Foundry Production Sign-Off Pack

Pick deployment, eval depth, and identity model on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Hub-project-connections · pick by data · identity right · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Foundry is the production layer on top of Azure AI. Hub-project-connections. Pick the deployment type that matches volume + latency. Identity via managed + Key Vault + private endpoints. Eval flow on every change. Cost telemetry + alerts. 20-item checklist with 3 disqualifiers. 4 trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Build your sign-off pack.</div><div class="row"><span class="arr">→</span>Get platform team review on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 39 chapters 1-8 built.')
