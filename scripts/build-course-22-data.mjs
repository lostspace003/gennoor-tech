// Course 22 — Enterprise Data Foundations for AI (Andrew)
import { emit } from './build-chapter-html.mjs'

const courseTagline = 'Foundations · Enterprise Data for AI'
const OUT = 'tmp/academy-build/enterprise-data-foundations-for-ai/chapters'

const card = (ct, h3, ps, t) =>
  `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardRed = (ct, h3, ps, t) =>
  `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cardGreen = (ct, h3, ps, t) =>
  `<div class="card green"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${t ? `<div class="takeaway">${t}</div>` : ''}</div>`
const cell = (cn, h4, num, p, cls = '') =>
  `<div class="cell ${cls}"><span class="cn">${cn}</span><h4>${h4}</h4>${num ? `<div class="num">${num}</div>` : ''}<p>${p}</p></div>`
const closeCard = (eyebrow, h2, p) =>
  `<div class="final-close"><div class="eyebrow">${eyebrow}</div><h2>${h2}</h2><p>${p}</p></div>`

const baseCues = [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
  { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
  { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 },
]

emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The data foundations landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-data-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · DATA IS WHERE AI FAILS', h1Html: '5 pillars · <em>3 anti-patterns</em>', subtitleHtml: '<strong>Most AI projects fail at the data step. Foundations work is where the leverage is.</strong>' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Most AI projects fail · <em>at the data step</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Not at the model · not at the use case · at the data', ['DAMA, McKinsey, BCG/MIT all show the same pattern — orgs underestimate the data work AI needs.', '<strong>Start with the model. Discover data isn\'t ready. Pause 6-12 months.</strong>'], 'Get the data foundations right. <em>The AI work that comes after is the easier half.</em>') }] },
    { type: 'content', eyebrow: 'The 5 pillars', icon: '2', headlineHtml: 'Quality · lineage · governance · <em>privacy · platform</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('PILLAR 1', 'Quality', '', 'Accuracy, completeness, freshness, consistency.')}
${cell('PILLAR 2', 'Lineage', '', 'Provenance you can defend to an auditor.')}
${cell('PILLAR 3', 'Governance', '', 'Ownership, access, retention, deletion — GDPR + DPDPA + CCPA enforceable.')}
${cell('PILLAR 4', 'Privacy', '', 'Masking, tokenisation, differential privacy where data is sensitive.')}
${cell('PILLAR 5', 'Platform pattern', '', 'Lakehouse · data products · contracts · mesh — that make it work at scale.')}
</div>` }] },
    { type: 'content', eyebrow: '3 anti-patterns', icon: '!', iconRed: true, headlineHtml: 'Buy-platform · ocean-boil · <em>disconnected team</em>',
      blocks: [{ atStep: 1, html: cardRed('3 ANTI-PATTERNS', 'Consistent across enterprises', ['<strong>1. Buy a platform without fixing the data.</strong> Modern platforms don\'t fix bad data — they store it more expensively.', '<strong>2. Clean the lake instead of building data products.</strong> 6-month cleanup, no consumable outcome. Data products deliver early and compound.', '<strong>3. Separate "data team" disconnected from business.</strong> Engineers building what business never asked for. Defunded eventually.']) }] },
    { type: 'content', eyebrow: 'What this course covers', icon: '→', headlineHtml: '6 pillar deep-dives · 1 platform · <em>1 roadmap</em>',
      blocks: [
        { atStep: 1, html: card('STRUCTURE', '8 chapters', ['Chapters 2-6: one chapter per pillar · how to score honestly · what moves it.', 'Chapter 7: vendor + tooling reality · build vs buy.', 'Chapter 8: roadmap · 4 trip-wires · interactive builder.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick the pillar you suspect is weakest', ['Start there. <strong>That\'s where the leverage is.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Quality · <em>4 dimensions + DAMA</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Data foundations are where the leverage is · 5 pillars · 3 anti-patterns.', '<strong>Next:</strong> accuracy, completeness, freshness, consistency. The DAMA framework applied with discipline.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Data quality' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-quality.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · DAMA FRAMEWORK', h1Html: 'Accuracy · completeness · freshness · <em>consistency</em>', subtitleHtml: '<strong>The 4 dimensions every AI initiative depends on.</strong>' },
    { type: 'content', eyebrow: '4 dimensions · DAMA-DMBOK', icon: '1', headlineHtml: 'Accuracy · completeness · freshness · <em>consistency</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('DIM 1', 'Accuracy', '', 'Does the data match the real-world entity? Name spelled right · address current · amount correct.')}
${cell('DIM 2', 'Completeness', '', 'Required fields populated? Or null 15% of the time?')}
${cell('DIM 3', 'Freshness', '', 'When last updated? Last quarter = not fresh for behaviour · fresh for company HQ.')}
${cell('DIM 4', 'Consistency', '', 'Same customer = same way in CRM, ERP, billing, marketing? Or "ACME Corp" vs "Acme Inc."?')}
</div>` }] },
    { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Entity gap · silent drift · <em>quality assumed</em>',
      blocks: [{ atStep: 1, html: cardRed('3 QUALITY FAILURE MODES', 'Consistent patterns', ['<strong>1. Entity resolution gap</strong> — same customer, multiple records. Each system keeps its own truth. Reconciliation is manual.', '<strong>2. Silent drift</strong> — source data changes upstream. Downstream keeps running. Bad data flows. Found months later.', '<strong>3. Quality assumed not tested</strong> — no automated checks, no alerting. Quality is whatever the team feels like checking.']) }] },
    { type: 'content', eyebrow: 'What works · 3 patterns', icon: '2', headlineHtml: 'Quality at source · monitoring · <em>SLAs per product</em>',
      blocks: [{ atStep: 1, html: cardGreen('3 PATTERNS THAT WORK', 'Operational quality', ['<strong>1. Quality at source.</strong> Fix at point of capture, not in downstream pipelines.', '<strong>2. Automated quality monitoring.</strong> Run checks on every pipeline. Alert on drops. Catch silent drift.', '<strong>3. Quality SLAs published per data product.</strong> Each consumer knows what bar this dataset meets. No surprises.']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Audit · drift detection · <em>SLA</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE QUALITY HONESTLY', '3 questions', ['<strong>Q1:</strong> top 3 AI datasets audited — accuracy/completeness/freshness? <70% pass red · 70-90% amber · >90% green.', '<strong>Q2:</strong> source data changes — found automatically? Yes green · manual amber · <strong>customer complaint red</strong>.', '<strong>Q3:</strong> quality SLAs per data product? Published green · internal amber · no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick your most-used dataset · 2-hour audit', ['Score it on accuracy + completeness + freshness. <strong>Below 70% — that\'s your highest-ROI fix this quarter.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Lineage · <em>provenance you can defend</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 dimensions · 3 failure modes · 3 patterns that work · 3-question scoring.', '<strong>Next:</strong> source-to-sink, transformation, semantic lineage. EU AI Act Art 15 + NIST AI RMF + GDPR Art 30.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Data lineage' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-lineage.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · PROVENANCE YOU CAN DEFEND', h1Html: '3 layers · <em>3 reasons it matters now</em>', subtitleHtml: '<strong>Where data came from. What was transformed. Who touched it. The audit-defensibility layer.</strong>' },
    { type: 'content', eyebrow: 'Why lineage matters · 3 reasons', icon: '1', headlineHtml: 'Explainability · regulation · <em>incident response</em>',
      blocks: [{ atStep: 1, html: card('WHY LINEAGE MATTERS NOW', '3 reasons', ['<strong>1. AI explainability.</strong> Significant prediction (credit · hire · claim) → need to explain what data went in.', '<strong>2. Regulatory readiness.</strong> EU AI Act Art 15 traceability for high-risk AI. NIST AI RMF measure function. GDPR Art 30 records.', '<strong>3. Incident response.</strong> Bad prediction → first question is "what data, where from?" <strong>Can\'t answer in 2 days = lineage problem.</strong>']) }] },
    { type: 'content', eyebrow: '3 layers of lineage', icon: '2', headlineHtml: 'Source-to-sink · transformation · <em>semantic</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('LAYER 1', 'Source-to-sink', '', 'Where data originated · where it landed. Simplest. Most platforms support.')}
${cell('LAYER 2', 'Transformation', '', 'Logic applied between source and sink. Filters · joins · aggregations · derived columns. <strong>Where most tools stop being useful.</strong>')}
${cell('LAYER 3', 'Semantic', '', '"Customer value" calculated one way in marketing vs another way in finance — both feeding same AI model. <strong>Semantic mismatch = silent failures.</strong>', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'What works · 3 patterns', icon: '3', headlineHtml: 'Automated capture · product metadata · <em>central semantic model</em>',
      blocks: [{ atStep: 1, html: cardGreen('WHAT WORKS FOR LINEAGE', '3 patterns', ['<strong>1. Automated lineage capture in pipelines.</strong> dbt · Apache Atlas · Collibra · modern platforms. Avoid manual docs — stale within months.', '<strong>2. Lineage as data product metadata.</strong> Each product publishes its lineage. Consumers know upstream before they depend.', '<strong>3. Central semantic model.</strong> "Customer," "revenue," "active user" defined once, referenced everywhere. Same definition into AI models.']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Complete diagram in 2 days · <em>central semantic model</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE LINEAGE HONESTLY', '2 questions', ['<strong>Q1:</strong> for top AI use case, complete lineage diagram in 2 business days? Yes green · with effort amber · honestly no red.', '<strong>Q2:</strong> central semantic model defining key entities consistently across functions? Yes green · partial amber · no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one AI initiative · ask for the complete lineage diagram', ['Can\'t produce in 2 days → next quarter\'s lineage investment priority.']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Governance · <em>ownership · access · retention · deletion</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 reasons · 3 layers · 3 patterns · 2-question scoring.', '<strong>Next:</strong> GDPR + DPDPA + CCPA enforceability. Multi-jurisdiction reality + 3 governance failure modes.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Data governance' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-governance.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · 4 COMPONENTS', h1Html: 'Ownership · access · retention · <em>deletion</em>', subtitleHtml: '<strong>GDPR + DPDPA + CCPA enforceable. Tested, not just documented.</strong>' },
    { type: 'content', eyebrow: '4 components', icon: '1', headlineHtml: 'Named owner · access mgmt · <em>retention · deletion</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'Ownership', '', 'Each asset has a named owner with authority. Accountable for quality + access decisions.')}
${cell('C2', 'Access management', '', 'Who sees what. Approval workflows. Audit trail. Role + need-to-know.')}
${cell('C3', 'Retention policy', '', 'How long data is kept · per regulation · per business need. Different by data type.')}
${cell('C4', 'Deletion process', '', 'GDPR Art 17 + DPDPA correction/erasure. <strong>Actually deleted. Tested, not just documented.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Multi-jurisdiction reality', icon: '2', headlineHtml: 'GDPR · DPDPA · CCPA · <em>PIPL</em>',
      blocks: [{ atStep: 1, html: card('MULTI-JURISDICTION GOVERNANCE', 'Pick the strictest as baseline · others are subsets', ['<strong>GDPR (2016):</strong> EU subjects · granular consent · rights to access/rectify/erase/portability.', '<strong>India DPDPA (2023):</strong> data fiduciary obligations · consent · cross-border rules.', '<strong>CCPA (California):</strong> opt-out for sale/share · sensitive PII protections.', '<strong>PIPL (China):</strong> cross-border restrictions · sensitive PII.']) }] },
    { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'No owner · over-broad access · <em>retention not enforced</em>',
      blocks: [{ atStep: 1, html: cardRed('3 GOVERNANCE FAILURE MODES', 'Consistent patterns', ['<strong>1. No named owner per dataset.</strong> Tickets bounce when something goes wrong. Decisions don\'t get made.', '<strong>2. Over-broad access.</strong> "All employees can read all data" because RBAC is hard. Marketing analyst sees exec compensation. <strong>GDPR breach.</strong>', '<strong>3. Retention not enforced.</strong> Policy says 7 years. Data sits in archives at year 10. Regulator finds it.']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Owners · audit trail · <em>deletion on schedule</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE GOVERNANCE HONESTLY', '3 questions', ['<strong>Q1:</strong> top 10 data assets — name owner in <30s? All 10 green · some amber · few red.', '<strong>Q2:</strong> access management produces complete audit trail? Yes green · partial amber · no red.', '<strong>Q3:</strong> retention expires → data actually deleted on schedule? Yes green · sometimes amber · <strong>almost never red</strong>.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'List top 10 data assets + owner of each from memory', ['Can\'t? Start there. <strong>Naming owners is the lowest-cost, highest-leverage move.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Privacy · <em>masking · tokenisation · differential privacy</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 components · 4-jurisdiction reality · 3 failure modes · 3-question scoring.', '<strong>Next:</strong> the patterns that let you use sensitive data safely in AI.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Data privacy techniques' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-privacy.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · 3 TECHNIQUES', h1Html: 'Masking · tokenisation · <em>differential privacy</em>', subtitleHtml: '<strong>Different tools for different problems. Match the technique to the use case.</strong>' },
    { type: 'content', eyebrow: '3 techniques', icon: '1', headlineHtml: 'Mask · tokenise · <em>differential privacy</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Masking', '', 'Replace with placeholders. "Customer_001". <strong>Use when downstream doesn\'t need real value.</strong>')}
${cell('T2', 'Tokenisation', '', 'Replace with non-sensitive tokens · mapping preserved. <strong>Use when you need to rejoin/reverse later — payments, healthcare ID.</strong>')}
${cell('T3', 'Differential privacy', '', 'Add calibrated noise so individual identities can\'t be recovered from aggregates. <strong>Use for sharing statistics from sensitive data.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'When to use what', icon: '2', headlineHtml: 'Training · inference · sharing · <em>cross-border</em>',
      blocks: [{ atStep: 1, html: card('WHEN TO USE WHAT', '4 scenarios', ['<strong>AI training on sensitive data:</strong> synthetic or tokenised. Don\'t need real names for transaction pattern training.', '<strong>AI inference on prod data:</strong> proper access controls + encryption + audit. Data has to be real at inference.', '<strong>Sharing aggregate insights:</strong> differential privacy or k-anonymity. Statistics not individuals.', '<strong>Cross-border:</strong> masking + tokenisation + contractual controls. GDPR SCCs · DPDPA permit list.']) }] },
    { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Synthetic leaks · masking that doesn\'t · <em>no audit</em>',
      blocks: [{ atStep: 1, html: cardRed('3 PRIVACY FAILURE MODES', 'Patterns to avoid', ['<strong>1. Synthetic data that leaks.</strong> Naive synthetic generation leaks information. <em>Differential privacy bounds are mathematical — synthetic alone is not enough.</em>', '<strong>2. Masking that doesn\'t.</strong> Pseudonymisation reversible from context — "Customer_001 in row 42" still identifiable with quasi-identifiers.', '<strong>3. Production access without audit.</strong> Engineer downloads customer dataset to laptop. No audit. <strong>GDPR breach if laptop walks.</strong>']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Standard pattern · <em>deletion across systems</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE PRIVACY HONESTLY', '2 questions', ['<strong>Q1:</strong> engineer needs sensitive data for AI training — standard pattern? Synthetic/tokenised green · real-with-audit amber · <strong>real-without-controls red</strong>.', '<strong>Q2:</strong> customer exercises right to deletion — actually executed across all systems? Yes green · mostly amber · honestly no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Trace one production sensitive dataset to AI training', ['What pattern is used? <strong>Real-without-controls → highest-ROI fix this quarter.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Platform pattern · <em>lakehouse · products · contracts</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 techniques · 4 scenarios · 3 failure modes · 2-question scoring.', '<strong>Next:</strong> the architecture choices that make everything else work at scale.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'The platform pattern' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-platform.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · ARCHITECTURE THAT SCALES', h1Html: 'Lakehouse · data products · <em>data contracts</em>', subtitleHtml: '<strong>The architectural decisions that tie everything together at scale.</strong>' },
    { type: 'content', eyebrow: '2 architecture choices', icon: '1', headlineHtml: 'Lakehouse · <em>federated-with-central-platform</em>',
      blocks: [{ atStep: 1, html: card('2 ARCHITECTURE CHOICES', 'Most enterprises end up here', ['<strong>Choice 1:</strong> lakehouse vs warehouse vs lake. In 2026 most large enterprises → lakehouse. Databricks · Snowflake · Microsoft Fabric all converging. Open formats (Delta · Iceberg · Hudi) make it defensible.', '<strong>Choice 2:</strong> central vs federated. Pure central doesn\'t scale. Pure federated doesn\'t compound. <strong>Data mesh = federated-with-central-platform middle.</strong>']) }] },
    { type: 'content', eyebrow: 'The data product pattern', icon: '2', headlineHtml: 'Curated · versioned · documented · <em>owned</em>',
      blocks: [{ atStep: 1, html: cardGreen('THE DATA PRODUCT PATTERN', 'Most important shift of the last few years', ['A data product = curated, versioned, documented, owned dataset published for consumption. <strong>Like a product internally.</strong>', 'Owner · SLA · release cadence · deprecation policy.', '<strong>AI teams move 3-5x faster</strong> when data is published as products vs raw lake tables.'], 'Pattern works when 3-4 high-value data products exist first (customer · financial transactions · maybe operational). <em>Not when you try to product-ise everything at once.</em>') }] },
    { type: 'content', eyebrow: 'Data contracts · reliability layer', icon: '3', headlineHtml: 'Schema + SLA + quality · <em>between producer and consumer</em>',
      blocks: [{ atStep: 1, html: card('DATA CONTRACTS', 'The reliability layer', ['Specifies schema · SLA · quality guarantees of a data product.', '<strong>Upstream breaks contract → producer owns fix. Downstream uses out-of-contract behaviour → consumer owns fix.</strong>', 'Without contracts → silent breakages. Upstream changes column. Downstream pipeline breaks. Blame ensues.'], 'Plumbing nobody notices when it works. <em>Everyone notices when it doesn\'t.</em>') }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: '3-4 data products · <em>contracts</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE PLATFORM HONESTLY', '2 questions', ['<strong>Q1:</strong> 3-4 high-value data products published with owners and SLAs? Yes green · 1-2 amber · <strong>none red</strong>.', '<strong>Q2:</strong> data contracts between producers + consumers? Yes green · informal amber · no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one highest-value dataset · make it the first data product', ['Owner · SLA · quality contract · documentation. <strong>Real consumers using it within a quarter. Then expand.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Vendor reality · <em>buy · build · consolidate</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '2 architecture choices · data product pattern · data contracts · 2-question scoring.', '<strong>Next:</strong> Databricks · Snowflake · Fabric · Collibra · Atlan — what to buy, what to build, what to consolidate.') }] },
  ],
  cues: baseCues,
})

emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Vendor + tooling reality' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-vendor.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · BUY · BUILD · CONSOLIDATE', h1Html: 'The 2026 vendor landscape · <em>3 build/buy principles</em>', subtitleHtml: '<strong>Most enterprises are over-tooled. Consolidation is the move.</strong>' },
    { type: 'content', eyebrow: 'The 2026 vendor landscape', icon: '1', headlineHtml: 'Platforms · governance · <em>observability · privacy</em>',
      blocks: [{ atStep: 1, html: card('VENDOR LANDSCAPE · 2026', '4 categories', ['<strong>Cloud data platforms:</strong> Databricks · Snowflake · Microsoft Fabric · Google BigQuery · AWS Redshift. Consolidation is real. Most enterprises end up on 1-2.', '<strong>Governance + catalogue:</strong> Collibra · Alation · Atlan · Microsoft Purview. Specialist for metadata, lineage, access.', '<strong>Quality + observability:</strong> Monte Carlo · Bigeye · Soda · native cloud tools. Watch for lock-in.', '<strong>Privacy + synthetic:</strong> Privitar · Tonic · Mostly AI · Statice. Where sensitive data + AI training intersect.']) }] },
    { type: 'content', eyebrow: 'Build vs buy · 3 principles', icon: '2', headlineHtml: 'Buy commodity · single throat · <em>plan for lock-in</em>',
      blocks: [{ atStep: 1, html: cardGreen('3 BUILD VS BUY PRINCIPLES', 'Operational discipline', ['<strong>1. Buy commodity, build differentiator.</strong> Storage · compute · basic governance → buy. AI-specific accelerators that are truly differentiating → build.', '<strong>2. Single throat to choke beats best-of-breed.</strong> 10 best-of-breed tools = real integration cost. Most enterprises do better with primary platform + 2-3 specialists.', '<strong>3. Vendor lock-in is real, plan for it.</strong> Open formats (Delta · Iceberg · Parquet) reduce. Closed proprietary increases. 3-year strategic visibility.']) }] },
    { type: 'content', eyebrow: 'Consolidation', icon: '3', headlineHtml: 'Most enterprises · <em>are over-tooled</em>',
      blocks: [{ atStep: 1, html: cardRed('THE OVER-TOOLED PATTERN', 'Marketing buys one. Engineering another. Data team a third.', ['Each does part of governance · lineage scattered · access policies in 3 places.', '<strong>Consolidate when:</strong> renewal coming up · migration cost < ongoing duplication · political moment exists.', '<strong>Don\'t consolidate prematurely:</strong> just bought a tool → give it 18 months runway. Reorganising every 6 months destroys momentum.']) }] },
    { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Primary platform · <em>AI-specific contracts</em>',
      blocks: [
        { atStep: 1, html: card('HOW TO SCORE VENDOR REALITY', '2 questions', ['<strong>Q1:</strong> primary data platform — org standardised? Standardised green · multi-platform with reason amber · 5 platforms no reason red.', '<strong>Q2:</strong> data + AI vendor contracts include AI-specific terms (training data rights · model updates · sunset)? Yes green · some amber · no red.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'List every data + AI tool in budget · group by function', ['<strong>3 tools doing the same thing → that\'s the consolidation conversation.</strong>']) },
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your roadmap · 3 phases · <em>4 trip-wires · the builder</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Vendor landscape · 3 build/buy principles · consolidation patterns · 2-question scoring.', '<strong>Last chapter:</strong> 3-phase rollout, 4 trust trip-wires, interactive Markdown roadmap builder.') }] },
  ],
  cues: baseCues,
})

const ch8BuilderInit = `
var builderInit=false;var state={pillar:'',products:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='data-foundations-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.pillar||'_(pick starting pillar)_';var d=state.products||'_(pick first 3 data products)_';var s=state.sponsor||'_(pick sponsor)_';return '# Data Foundations · 18-Month Roadmap\\n\\n**CDO / CIO sponsor:** ____________________\\n**Start date:** ____________________\\n\\n## Starting pillar\\n> '+p+'\\n\\n## First 3 data products\\n> '+d+'\\n\\n## Executive sponsor\\n> '+s+'\\n\\n## Phase 1 · Months 1-3\\n- Pick 3 high-value data products · name owners · define SLAs · start quality monitoring\\n- Just 3 · not 30\\n\\n## Phase 2 · Months 4-9\\n- Lineage on the 3 products\\n- Access governance fixed\\n- Privacy patterns codified\\n- AI teams start using products for real initiatives\\n\\n## Phase 3 · Months 10-18\\n- Platform consolidation\\n- Data contracts formalised\\n- 3-5 additional products published\\n- Operating model stabilises\\n\\n## 4 trust trip-wires (do not cross)\\n- Buying a platform without fixing the data — platforms don\'t fix bad data\\n- Ocean-boiling cleanup projects — data product pattern delivers value early\\n- Data team disconnected from business — co-locate · embed · outcome-driven funding\\n- Privacy bolted on — privacy patterns at design time, not retrofit\\n\\n---\\nSource: Gennoor Academy · Enterprise Data Foundations for AI\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your data foundations roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 3 PHASES', h1Html: '3 phases · 4 trip-wires · <em>the builder</em>', subtitleHtml: '7 chapters · <strong>this chapter sequences them.</strong>' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Most AI projects fail at the data step · <em>foundations are the leverage</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Andy Grove · manager output = output of the organisation under their influence', ['Foundations work is unglamorous. <strong>It is also where the leverage is.</strong>']) }] },
    { type: 'content', eyebrow: 'The 3-phase rollout', icon: '2', headlineHtml: 'Months 1-3 · 4-9 · <em>10-18</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PHASE 1', 'Months 1-3', '', 'Pick 3 high-value data products. Name owners. Define SLAs. Start quality monitoring. <strong>Just 3. Not 30.</strong>')}
${cell('PHASE 2', 'Months 4-9', '', 'Lineage on the 3 · access governance fixed · privacy patterns codified. AI teams start real initiatives.', 'amber')}
${cell('PHASE 3', 'Months 10-18', '', 'Platform consolidation · data contracts formalised · 3-5 more products published. Operating model stabilises.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'No platform-fix · no ocean-boil · no disconnect · <em>no bolted privacy</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('WIRE 1', 'Buying platform without fixing data', '', 'Modern platforms don\'t fix bad data. <strong>Just store it more expensively.</strong>', 'red')}
${cell('WIRE 2', 'Ocean-boiling cleanup projects', '', '6-month cleanup with no consumable outcome. <strong>Product pattern delivers value early.</strong>', 'red')}
${cell('WIRE 3', 'Data team disconnected from business', '', 'Building what business never asked for. <strong>Co-locate. Embed. Outcome-driven funding.</strong>', 'red')}
${cell('WIRE 4', 'Privacy bolted on', '', 'Design-time, not retrofit. <strong>Right-to-deletion that doesn\'t work = regulator letter.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pillar · products · sponsor · <em>take to CDO/CIO</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting pillar (weakest)</h5><div class="preset" data-group="pillar">
<button data-val="Quality — accuracy, completeness, freshness, consistency">Quality</button>
<button data-val="Lineage — provenance defensible to auditor">Lineage</button>
<button data-val="Governance — owners + access + retention + deletion">Governance</button>
<button data-val="Privacy — masking, tokenisation, differential privacy">Privacy</button>
<button data-val="Platform — lakehouse + data products + contracts">Platform</button>
</div></div>
<div class="group"><h5>First 3 data products</h5><div class="preset" data-group="products">
<button data-val="Customer · financial transactions · employee">Customer · Finance · HR</button>
<button data-val="Customer · product · operational">Customer · Product · Ops</button>
<button data-val="Customer · financial transactions · supplier">Customer · Finance · Supplier</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="CDO with cross-function authority + budget">CDO</button>
<button data-val="CIO with budget + board access">CIO</button>
<button data-val="CTO with engineering owner">CTO</button>
<button data-val="Two-headed CDO + CIO partnership">CDO + CIO</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my data foundations roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Data Foundations · 18-Month Roadmap

Pick pillar, products, and sponsor on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Foundations are leverage · 5 pillars · 3 anti-patterns · <em>data product pattern · 4 trip-wires</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Most AI projects fail at the data step · five pillars · three anti-patterns · the data product pattern · data contracts · buy-vs-build with single-throat-to-choke · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick 3 high-value data products.</div><div class="row"><span class="arr">→</span>Get one CDO or CIO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
  ],
})

console.log('\n✓ Course 22 chapters 1-8 built.')
