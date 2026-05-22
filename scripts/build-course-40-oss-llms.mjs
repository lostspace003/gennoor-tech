// Course 40 — Open-Source LLMs for Enterprise (Andrew · builder track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Builder · Open-Source LLMs for Enterprise'
const OUT = 'tmp/academy-build/open-source-llms-for-enterprise/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'Why open-source and when not' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-why.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · DIFFERENT COST CURVE · NOT FREE', h1Html: '3 real reasons · <em>3 cases hosted API wins</em>', subtitleHtml: '<strong>Sell open-source on sovereignty, cost-at-scale, and roadmap control. Cost-only takes 18-24 months.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Different cost curves · <em>match curve to usage</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Open-source isn\'t free — it\'s a different cost curve', ['<strong>Hosted API.</strong> High per-token cost. Zero ops cost. Scales with usage.', '<strong>Self-hosted open-source.</strong> Low per-token cost. High ops cost. Scales with concurrency.'], 'The question isn\'t "which is cheaper." <strong>It\'s which curve fits your usage + team capacity + regulatory posture.</strong>') }] },
  { type: 'content', eyebrow: '3 reasons for open-source', icon: '2', headlineHtml: 'Sovereignty · cost at scale · <em>roadmap control</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'Sovereignty + residency', '', 'Data can\'t leave controlled boundary. BFSI · healthcare · gov · defence. <strong>Hosted API is not an option.</strong>', 'green')}
${cell('R2', 'Cost at scale', '', 'At 10M+ tokens/day, per-token dominates. <strong>Self-hosted GPU economics eventually beat hosted.</strong>', 'green')}
${cell('R3', 'Roadmap control', '', 'Vendor sunsets · prices change · terms change. <strong>You control upgrade timing.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 cases hosted API wins', icon: '!', iconRed: true, headlineHtml: 'Small volume · capability gap · <em>small ops team</em>',
    blocks: [{ atStep: 1, html: cardRed('3 CASES HOSTED API STILL WINS', '', ['<strong>Small volume.</strong> Under 1M tokens/day → GPU fixed cost doesn\'t amortise. Pay per token, get on with it.', '<strong>Capability gap.</strong> Best OSS models lag GPT-4o-class on cutting-edge by 6-12 months — multimodal · reasoning · vision.', '<strong>Small ops team.</strong> Self-hosted LLMs need ML platform engineers · GPU ops · security review · drift monitoring. <em>If you don\'t have the team, hosted is right.</em>']) }] },
  { type: 'content', eyebrow: 'The honest framing', icon: '3', headlineHtml: 'Sell on real reasons · <em>not month-one cost savings</em>',
    blocks: [
      { atStep: 1, html: card('THE HONEST FRAMING FOR LEADERSHIP', '', ['<strong>Don\'t sell on cost savings alone.</strong> Cost case is real but takes 18-24 months. Leadership often expects month-one savings. Set expectations correctly.', '<strong>Sell on the three real reasons.</strong> Sovereignty when required · cost-at-scale when you have scale · roadmap control when vendor risk is board-level.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Map current workloads against the 3 reasons', ['For each: is open-source the right call? <strong>Most teams find it\'s right for one or two, not all.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Model selection · <em>Llama · Mistral · Phi · Qwen</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', '3 reasons · 3 hosted-wins cases · honest framing.', '<strong>Next:</strong> 4 families · license traps · size discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Model selection' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-models.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · 4 FAMILIES · LICENSE TRAPS · SIZE DISCIPLINE', h1Html: 'Llama · Mistral · Phi · <em>Qwen</em>', subtitleHtml: '<strong>"Bigger is better" is the trap. Well-prompted 7-14B is good enough for most enterprise tasks.</strong>' },
  { type: 'content', eyebrow: '4 model families', icon: '1', headlineHtml: 'Llama · Mistral · Phi · <em>Qwen</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('M1', 'Llama (Meta)', '', '3.x · 4 series. <strong>Strongest open-weight on most benchmarks. Custom license — read before deploying.</strong>', 'green')}
${cell('M2', 'Mistral', '', 'Mistral · Mixtral MoE. <strong>Strong multilingual. Apache 2.0. EU AI Act friendly.</strong>', 'green')}
${cell('M3', 'Phi (Microsoft)', '', 'Phi-3 · Phi-4. <strong>Small + punchy. Strong reasoning sub-7B. MIT license. On-device + edge.</strong>', 'green')}
${cell('M4', 'Qwen (Alibaba)', '', 'Qwen2.x · Qwen3. <strong>Excellent multilingual incl. Asian. Apache 2.0. Increasingly competitive at frontier.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 license traps', icon: '!', iconRed: true, headlineHtml: 'Llama 700M MAU · synthetic training · <em>fine-tune redistribution</em>',
    blocks: [{ atStep: 1, html: cardRed('3 LICENSE TRAPS THAT CATCH TEAMS', 'Get legal sign-off before deploying', ['<strong>1. Llama "community license" restrictions.</strong> Above 700M MAU, special Meta license needed. Verify before shipping.', '<strong>2. Outputs for training competing models.</strong> Some licenses prohibit using outputs to train competitors. Read the clauses.', '<strong>3. Commercial fine-tune redistribution.</strong> You fine-tune Llama — can you redistribute weights? <em>Depends on license version. Legal sign-off.</em>']) }] },
  { type: 'content', eyebrow: 'Size discipline', icon: '2', headlineHtml: 'Match-to-task · <em>bigger ≠ better</em>',
    blocks: [{ atStep: 1, html: card('SIZE DISCIPLINE · MATCH TO TASK', 'Resist the "bigger is better" default', ['<strong>Default assumption:</strong> larger = better outputs.', '<strong>Reality:</strong> well-prompted 7-14B is good enough for most enterprise tasks. Especially with retrieval. Especially with structured outputs.'], '<strong>Match-to-task:</strong> classification/extraction/summarisation → 7-14B (fast, cheap). Q&A with retrieval → 14-30B (measurable quality lift). Reasoning/code/agentic → 70B+ or hosted API.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Eval set evaluated · <em>legal cleared</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE MODEL SELECTION', '2 questions', ['<strong>Q1:</strong> top pick evaluated on YOUR eval set? Yes green · vendor benchmarks amber · <strong>vibes red</strong>.', '<strong>Q2:</strong> legal cleared the license for your specific commercial use? Signed off green · informally amber · <strong>no red — license risk before launch</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick top 3 candidates by capability + license + size', ['Run your eval set against each. <strong>Decide on data, not vibes.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Self-hosting · <em>Ollama · vLLM · TGI · Azure ML</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 families · 3 license traps · size discipline.', '<strong>Next:</strong> 4 serving stacks · production vs demo · vLLM sizing.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Self-hosting' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-serving.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · OLLAMA · vLLM · TGI · AZURE ML', h1Html: 'Production-grade ≠ demo-grade · <em>vLLM sizing practical guide</em>', subtitleHtml: '<strong>"We benchmarked it" stories are usually demo-grade benchmarks.</strong>' },
  { type: 'content', eyebrow: '4 serving stacks', icon: '1', headlineHtml: 'Ollama · vLLM · TGI · <em>Azure ML</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'Ollama', '', 'Desktop + dev. <strong>Local inference. Prototyping + small internal tools. Not for production concurrency.</strong>', 'amber')}
${cell('S2', 'vLLM', '', 'High-throughput batched. PagedAttention. <strong>Strong concurrent-user. Most production uses this.</strong>', 'green')}
${cell('S3', 'TGI (Hugging Face)', '', 'Similar profile to vLLM. <strong>Strong streaming + sharding.</strong>', 'green')}
${cell('S4', 'Azure ML managed', '', 'Azure hosts on your behalf. <strong>Less ops. Higher cost. Useful if Azure-native.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Production vs demo', icon: '!', iconRed: true, headlineHtml: 'Single-user benchmarks lie · <em>real concurrency 25-50% of headline</em>',
    blocks: [{ atStep: 1, html: cardRed('PRODUCTION-GRADE VS DEMO-GRADE', 'Gap wider than teams expect', ['<strong>Demo-grade:</strong> Ollama on a laptop · single user · sub-second latency. Looks great in slide decks.', '<strong>Production-grade:</strong> 100 concurrent users · P95 + P99 budgets · memory pressure · queueing · failover.'], 'Most "we benchmarked it" stories are demo-grade. <strong>Real production needs vLLM or TGI with proper sizing.</strong>') }] },
  { type: 'content', eyebrow: 'vLLM sizing', icon: '2', headlineHtml: 'Memory · quant · concurrency · <em>P99</em>',
    blocks: [{ atStep: 1, html: card('vLLM SIZING · PRACTICAL GUIDE', '4 dimensions', ['<strong>GPU memory:</strong> weights + KV cache + activations. 7B FP16 = 14 GB weights + KV scales with sessions.', '<strong>Quantization:</strong> INT8 reduces memory at small quality cost. INT4 reduces further with measurable degradation. <em>Run your eval set on each quant level.</em>', '<strong>Concurrency:</strong> continuous batching is vLLM\'s superpower. 200+ sessions on single A100/H100 for 7B, properly tuned.', '<strong>P99 latency:</strong> increases with batch + queue depth. <em>Tune for YOUR budget, not headline TPS.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Load-tested at concurrency · <em>quant evaluated per task</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SELF-HOSTING', '2 questions', ['<strong>Q1:</strong> serving stack load-tested at realistic concurrency on prod hardware? Yes with numbers green · "on laptop" amber · <strong>no red — prod surprise</strong>.', '<strong>Q2:</strong> quantization level evaluated on your tasks? Per-quant green · generic claims amber · <strong>no/we-use-default red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Load-test current stack at 50% of expected peak', ['Watch P95 · P99 · OOMs. <strong>That\'s your production-readiness signal.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Fine-tuning · <em>LoRA · QLoRA · full · when not</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '4 stacks · prod-vs-demo · vLLM sizing.', '<strong>Next:</strong> don\'t-fine-tune decision · 3 approaches.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Fine-tuning approaches' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-tuning.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · DON\'T FINE-TUNE FIRST', h1Html: '3 approaches · <em>when each fits · when not at all</em>', subtitleHtml: '<strong>Try retrieval and prompting first. Fine-tune only when those measurably can\'t do the job.</strong>' },
  { type: 'content', eyebrow: 'The don\'t-fine-tune trap', icon: '!', iconRed: true, headlineHtml: 'Retrieval + prompting first · <em>fine-tuning takes weeks</em>',
    blocks: [{ atStep: 1, html: cardRed('THE "DON\'T FINE-TUNE" DECISION', 'Can retrieval or prompting solve this?', ['Before fine-tuning, ask: <strong>can retrieval or prompting solve this?</strong>', 'Fine-tuning takes weeks · costs GPUs · requires labelled data · each model upgrade requires re-tuning.', 'Retrieval + prompting takes days · updates are instant · model upgrades work without rework.'], '<strong>Rule:</strong> try retrieval and prompting first. Fine-tune only when those measurably can\'t do the job.') }] },
  { type: 'content', eyebrow: '3 approaches', icon: '1', headlineHtml: 'LoRA · QLoRA · <em>full fine-tune</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('A1', 'LoRA (Low-Rank Adaptation)', '', 'Train small adapter layers · freeze base. <strong>Fast · cheap · stack adapters. Default choice.</strong>', 'green')}
${cell('A2', 'QLoRA', '', 'LoRA on quantized base. <strong>Even cheaper · smaller GPUs · mild quality cost.</strong>', 'green')}
${cell('A3', 'Full fine-tune', '', 'Update all parameters. <strong>Expensive · slow · for substantial behaviour shifts.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'When each fits', icon: '2', headlineHtml: 'Style/format · POC budget · domain expertise · <em>skip</em>',
    blocks: [{ atStep: 1, html: card('WHEN EACH APPROACH FITS', '95% of enterprise tasks use LoRA or QLoRA', ['<strong>LoRA — style + format + persona.</strong> "Brand voice" · "JSON schema" · "industry vocabulary." Cheap. Effective.', '<strong>QLoRA — same with tighter budget.</strong> When LoRA quality is enough and GPU budget tight. Especially for POC.', '<strong>Full fine-tune — domain expertise.</strong> Legal · medical · complex code reasoning. Where base lacks fundamental capability.', '<strong>Skip entirely.</strong> Q&A on documents · factual retrieval · format extraction. <em>RAG + prompting handles these better.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Retrieval tried first · <em>measurable lift on eval</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FINE-TUNING APPROACH', '2 questions', ['<strong>Q1:</strong> proven retrieval + prompting cannot solve this? Documented yes green · "we assume" amber · <strong>no red — fine-tuning before cheaper options</strong>.', '<strong>Q2:</strong> fine-tune has measurable lift vs base + retrieval on your eval set? >5% green · marginal amber · <strong>no/within noise red — spent budget for nothing</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List active fine-tune projects', ['For each: was retrieval-plus-prompting tried first? <strong>If not, that\'s the first decision to revisit.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Cost + performance · <em>5-component TCO · breakeven math</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Don\'t-fine-tune · 3 approaches · when each fits.', '<strong>Next:</strong> 5 TCO components · breakeven · real concurrency.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Cost and performance tradeoffs' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-cost.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · TCO + BREAKEVEN · REAL CONCURRENCY', h1Html: '5 components · 20-50M tokens/day breakeven · <em>concurrency reality</em>', subtitleHtml: '<strong>Pure compute breakeven 5-20M tokens/day. With ops + eval + upgrades, real breakeven 20-50M.</strong>' },
  { type: 'content', eyebrow: '5-component TCO', icon: '1', headlineHtml: 'GPU · ops · evals · incidents · <em>upgrades</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('C1', 'GPU hours', '', 'H100 · A100 · L40S. On-demand vs reserved vs spot. <strong>The visible cost.</strong>')}
${cell('C2', 'Ops team', '', 'ML platform + SRE + security. <strong>Often largest cost — most under-counted.</strong>', 'amber')}
${cell('C3', 'Evals', '', 'Gold sets · runs · human-in-loop. <strong>Quality has a real cost.</strong>')}
${cell('C4', 'Incident load', '', 'OOMs · quant drift · driver issues. <strong>On-call you can\'t see in the demo.</strong>')}
${cell('C5', 'Upgrades', '', 'Models · serving stacks · quants. <strong>6-month cadence minimum.</strong>')}
</div>` }] },
  { type: 'content', eyebrow: 'Breakeven math', icon: '2', headlineHtml: 'Reserved A100 · ~10M tokens/day · <em>$5-20/day hosted equivalent</em>',
    blocks: [{ atStep: 1, html: card('THE BREAKEVEN MATH', 'A reserved A100 80GB', ['Reserved A100 80GB cloud: roughly $1.50/hour · about $13K/year reserved.', 'Capacity: ~10M tokens/day on Llama 3 8B with vLLM well-tuned. Some workloads more, some less.', 'Hosted API equivalent: ~50¢-$2 per million tokens for similar capability = $5-20/day = $1,800-7,300/year.', '<strong>Pure compute breakeven:</strong> 5-20M tokens/day per workload.', '<strong>With ops + eval + upgrade costs:</strong> real breakeven 20-50M tokens/day for the cost case alone.'], 'Below that, <strong>hosted API + good prompts + retrieval is cheaper and faster to operate.</strong>') }] },
  { type: 'content', eyebrow: 'Concurrency reality', icon: '!', iconRed: true, headlineHtml: 'Benchmark 200 TPS · <em>real 50-80 TPS</em>',
    blocks: [{ atStep: 1, html: cardRed('CONCURRENCY AT ENTERPRISE SCALE', 'Benchmark vs production', ['<strong>Benchmark mistake:</strong> "This model does 200 TPS on a single GPU."', '<strong>Production reality:</strong> mixed prompt sizes · mixed users · KV cache pressure · queueing. <em>200 TPS becomes 50-80 TPS.</em>'], '<strong>Plan capacity at real concurrency, not benchmark concurrency.</strong> Test with production traffic shapes, not synthetic load tests.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'TCO has all 5 · <em>real-world throughput</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TCO MODELLING', '2 questions', ['<strong>Q1:</strong> TCO includes all 5 components? Yes green · "GPU + maybe ops" amber · <strong>GPU only red — under-counts dramatically</strong>.', '<strong>Q2:</strong> breakeven calculated with realistic concurrency-degraded throughput? Yes green · benchmark numbers amber · <strong>no/optimistic red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Model TCO for top workload across all 5 components', ['Compare to hosted API at your real volume. <strong>That\'s the actual case for or against open-source.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Air-gapped + sovereign deployment · <em>3 tiers</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '5 TCO components · breakeven math · concurrency reality.', '<strong>Next:</strong> 3 tiers · 4 architectural requirements · regulator acceptance.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Air-gapped and sovereign deployment' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-sovereign.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · WHAT REGULATORS + CISOs ACCEPT', h1Html: '3 deployment tiers · 4 architectural requirements · <em>regional reality</em>', subtitleHtml: '<strong>Pick by what passes your specific compliance review.</strong>' },
  { type: 'content', eyebrow: '3 deployment tiers', icon: '1', headlineHtml: 'Residency · VPC + private endpoints · <em>air-gapped</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Data-residency boundary', '', 'Model in specific country/region. <strong>Public-cloud-acceptable. India DPDPA · EU GDPR.</strong>', 'green')}
${cell('T2', 'VPC + private endpoints', '', 'No public exposure. <strong>Banking · healthcare · regulated SaaS.</strong>', 'amber')}
${cell('T3', 'Fully air-gapped', '', 'No internet at all. <strong>Defence · intelligence · classified. Physical media or air-gapped CI/CD.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: '4 architectural requirements', icon: '2', headlineHtml: 'No telemetry · provenance · local logs · <em>supply chain</em>',
    blocks: [{ atStep: 1, html: card('4 ARCHITECTURAL REQUIREMENTS', 'For sovereign deployment', ['<strong>1. No telemetry leak.</strong> Serving stack must not phone home. Disable analytics · crash reports · update checks. <em>vLLM + TGI support this — verify.</em>', '<strong>2. Auditable model provenance.</strong> Prove which weights are running. Hash-verify on load · sign deployments · log every upgrade.', '<strong>3. Local logging.</strong> All traces · prompts · completions to your storage. <em>Never vendor SaaS.</em>', '<strong>4. Supply chain integrity.</strong> Weights · containers · deps verified. Reproducible builds · signed artifacts · SBOM tracking.']) }] },
  { type: 'content', eyebrow: 'Regional reality', icon: '3', headlineHtml: 'India · GCC · US · <em>EU</em>',
    blocks: [{ atStep: 1, html: card('WHAT REGULATORS + CISOs ACTUALLY ACCEPT', 'By region', ['<strong>BFSI in India.</strong> RBI cyber security guidelines. Self-hosted in Indian region with audit trail. Hosted APIs increasingly accepted with BAA-equivalent.', '<strong>GCC government.</strong> UAE · Saudi push toward sovereign AI infra. Self-hosted on G42, NEOM Cloud increasingly expected.', '<strong>US federal.</strong> FedRAMP boundary. IL2-IL6 by classification. GovCloud or on-prem.', '<strong>EU healthcare + finance.</strong> GDPR + sectoral overlays. EU region serving. Increasingly self-hosted post-EU AI Act.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Specific regulator satisfied · <em>supply chain integrity</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SOVEREIGN READINESS', '2 questions', ['<strong>Q1:</strong> deployment satisfies your specific regulator\'s requirements? Verified green · "we think" amber · <strong>not yet reviewed red — find out before audit</strong>.', '<strong>Q2:</strong> supply chain integrity (signed weights · reproducible builds · SBOM)? Yes green · partial amber · <strong>no red — supply chain attack real risk</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Walk one sovereign workload through CISO checklist', ['Gaps become the deployment-readiness backlog.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Operational considerations · <em>upgrades · patches · observability</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 tiers · 4 requirements · regional acceptance.', '<strong>Next:</strong> 3 upgrade types · 3 observability layers · patch discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Operational considerations' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-ops.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · UPGRADES · PATCHES · OBSERVABILITY', h1Html: '3 upgrade types · 3 layers · <em>patch discipline</em>', subtitleHtml: '<strong>The first ransomware on self-hosted LLM serving infrastructure will be a teachable moment for the industry.</strong>' },
  { type: 'content', eyebrow: '3 upgrade types', icon: '1', headlineHtml: 'Model version · serving stack · <em>quantization format</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('U1', 'Model version', '', 'Llama 3.1→3.2→4 · Mistral 7B→Mixtral. <strong>6-12 month cadence. Eval + canary required.</strong>', 'green')}
${cell('U2', 'Serving stack version', '', 'vLLM major bumps · CUDA · driver patches. <strong>Quarterly cadence. Performance changes.</strong>', 'amber')}
${cell('U3', 'Quantization format', '', 'INT8→INT4 · GPTQ · AWQ · FP8. <strong>Yearly-ish. Quality validation required.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '3 observability layers', icon: '2', headlineHtml: 'GPU · model · <em>request</em>',
    blocks: [{ atStep: 1, html: card('3 OBSERVABILITY LAYERS · NONE OPTIONAL', '', ['<strong>Layer 1 — GPU.</strong> Utilization · memory pressure · temperature · ECC errors · throttling. <em>NVIDIA DCGM or cloud GPU monitoring.</em>', '<strong>Layer 2 — model.</strong> Tokens · prompt + completion length · KV cache hit rate · queue depth. <em>vLLM exposes via Prometheus.</em>', '<strong>Layer 3 — request.</strong> p50/p95/p99 latency · error rate · request size. <em>Datadog · OTel · App Insights.</em>'], 'Without all three, <strong>you can\'t tell which layer is failing during an incident.</strong>') }] },
  { type: 'content', eyebrow: 'Patch discipline', icon: '!', iconRed: true, headlineHtml: 'You patch everything · <em>named owner + cadence</em>',
    blocks: [{ atStep: 1, html: cardRed('SECURITY PATCHES · WHAT CHANGES WITH SELF-HOSTED', 'You patch everything', ['<strong>Hosted API:</strong> vendor patches model · you patch app. Clean separation.', '<strong>Self-hosted:</strong> you patch everything. Base OS · CUDA drivers · container runtime · serving stack · weights when CVEs found.', '<strong>Cadence:</strong> monthly patch reviews · critical CVEs same-week. Air-gapped adds 2-4 weeks for verified deployment.'], '<strong>Patch management as a named team responsibility, not "we\'ll get to it."</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Named upgrade owner · <em>3 layers covered</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE OSS LLM OPS', '2 questions', ['<strong>Q1:</strong> named upgrade owner with cadence on calendar? Yes green · "we plan to" amber · <strong>no red — fall behind in 6 mo</strong>.', '<strong>Q2:</strong> observability across all 3 layers? Yes green · 2 of 3 amber · <strong>only request layer red — GPU + model issues invisible</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick top OSS LLM workload', ['Inventory upgrade cadence · observability coverage · patch process. <strong>Gaps are the ops debt to clear before scaling.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · decision pack · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '3 upgrades · 3 layers · patch discipline.', '<strong>Last:</strong> 4-section decision pack · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={reason:'',model:'',serving:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='oss-llm-decision-pack.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var r=state.reason||'_(pick primary reason)_';var m=state.model||'_(pick model + size)_';var s=state.serving||'_(pick serving stack)_';return '# Open-Source LLM · Decision Pack\\n\\n**Workload owner:** ____________________\\n**Steering committee date:** ____________________\\n\\n## The reason\\n> '+r+'\\n\\n## Model + size\\n> '+m+'\\n\\n## Serving stack\\n> '+s+'\\n\\n## 4-section checklist\\n- [ ] The reason: sovereignty + residency · cost-at-scale · roadmap control (pick dominant)\\n- [ ] Model + serving + fine-tuning choice with eval evidence\\n- [ ] TCO: all 5 components · compared to hosted API at real volume\\n- [ ] Rollout + ops plan: capacity · upgrades · observability · patches · sovereign requirements satisfied · owners named\\n\\n## 4 trust trip-wires (do not cross)\\n- Selling on cost savings alone (sovereignty + control are the real cases)\\n- Fine-tuning when retrieval would solve it\\n- Laptop benchmarks as production capacity (real is 25-50% of headline)\\n- No patch + upgrade discipline (CVE waiting to be exploited)\\n\\n---\\nSource: Gennoor Academy · Open-Source LLMs for Enterprise\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — OSS LLM decision pack' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · DECISION PACK · WHY THIS CURVE IS RIGHT', h1Html: '4-section pack · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Open-source isn\'t free — it\'s a different cost curve.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Different curve · <em>right for this workload</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Decision pack tells your steering committee', ['<strong>Open-source isn\'t free — it\'s a different cost curve.</strong> The decision pack tells your steering committee why this curve is right for this workload.']) }] },
  { type: 'content', eyebrow: '4-section decision pack', icon: '2', headlineHtml: 'Reason · choice · TCO · <em>rollout + ops</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'The reason', '', 'Sovereignty · cost-at-scale · roadmap control. <strong>Pick the dominant. Don\'t hide behind all three.</strong>')}
${cell('S2', 'Choice (model + serving + fine-tune)', '', 'Family + size + license + serving + tuning. <strong>With eval evidence.</strong>', 'amber')}
${cell('S3', 'TCO', '', 'All 5 components. Compared to hosted at real volume. <strong>Honest about ops cost.</strong>', 'green')}
${cell('S4', 'Rollout + ops plan', '', 'Capacity · upgrades · observability · sovereign requirements satisfied. <strong>Owners named.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Cost-only sell · fine-tune-first · laptop benchmarks · <em>no patch discipline</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Selling on cost savings alone', '', 'Sovereignty + control are real cases. Cost takes 18-24 mo.', 'red')}
${cell('W2', 'Fine-tuning before retrieval', '', 'Expensive shortcut to wrong solution.', 'red')}
${cell('W3', 'Laptop benchmarks as prod capacity', '', 'Real is 25-50% of headline numbers.', 'red')}
${cell('W4', 'No patch + upgrade discipline', '', 'Self-hosted with stale deps = CVE waiting to exploit.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · decision pack builder', icon: '✓', headlineHtml: 'Reason · model · serving · <em>take to steering committee</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Primary reason</h5><div class="preset" data-group="reason">
<button data-val="Sovereignty + data residency (BFSI · healthcare · government · defence)">Sovereignty</button>
<button data-val="Cost at scale (>20M tokens/day where economics genuinely favour self-hosted)">Cost at scale</button>
<button data-val="Roadmap control (vendor lock-in concern is board-level)">Roadmap control</button>
</div></div>
<div class="group"><h5>Model + size</h5><div class="preset" data-group="model">
<button data-val="Llama 3.x 8B-14B (default for most enterprise tasks)">Llama 3.x 8-14B</button>
<button data-val="Mistral / Mixtral (strong multilingual · Apache 2.0)">Mistral / Mixtral</button>
<button data-val="Phi-3 / Phi-4 (sub-7B · strong reasoning · MIT · edge-friendly)">Phi</button>
<button data-val="Qwen2.x / Qwen3 (multilingual incl. Asian languages · Apache 2.0)">Qwen</button>
<button data-val="Llama 3.x 70B+ (complex reasoning · code · agentic workloads)">Llama 70B+</button>
</div></div>
<div class="group"><h5>Serving stack</h5><div class="preset" data-group="serving">
<button data-val="vLLM on dedicated GPUs (default production choice · best throughput)">vLLM</button>
<button data-val="TGI on dedicated GPUs (Hugging Face · strong streaming + sharding)">TGI</button>
<button data-val="Azure ML managed endpoints (less ops · higher cost · Azure-native)">Azure ML managed</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my OSS LLM decision pack (.md)</button>
</div>
<div class="preview" id="preview"># Open-Source LLM · Decision Pack

Pick reason, model + size, and serving stack on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Different curve · 3 reasons · 4 families · vLLM · retrieval-first · TCO · sovereign · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Open-source isn\'t free — it\'s a different cost curve. Three reasons: sovereignty, cost-at-scale, roadmap control. Four model families. Production-grade serving with vLLM. Fine-tune only when retrieval can\'t. Full TCO across five components. Sovereign deployment tiers. Operational discipline across upgrades, patches, and observability.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your decision pack.</div><div class="row"><span class="arr">→</span>Get steering committee review on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 40 chapters 1-8 built.')
