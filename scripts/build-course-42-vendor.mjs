// Course 42 — AI Vendor Management (Andrew · leadership track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Leadership · AI Vendor Management'
const OUT = 'tmp/academy-build/ai-vendor-management/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The AI vendor landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · SUPPLIERS · NOT MAGIC', h1Html: '4 archetypes · <em>3 most likely to over-promise</em>', subtitleHtml: '<strong>Same diligence rigor. Same contract teeth. Same exit plan. Vendor narrative doesn\'t change that.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Every software vendor sells "AI" · <em>run all four with same discipline</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Run AI vendors with same discipline as any critical supplier', ['<strong>Every software vendor is now selling "AI."</strong> Hyperscalers · established ISVs · AI-native boutiques · SI partners.'], 'VMO job: <strong>run all four with the same diligence rigor · same contract teeth · same exit plan.</strong> Vendor narrative doesn\'t change that.') }] },
  { type: 'content', eyebrow: '4 vendor archetypes', icon: '2', headlineHtml: 'Hyperscalers · ISVs · boutiques · <em>SI partners</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('A1', 'Hyperscalers', '', 'AWS · MS · Google · Oracle. <strong>Reliable but expensive. Lock-in by gravity, not clauses.</strong>', 'green')}
${cell('A2', 'Established ISVs', '', 'SAP · Salesforce · ServiceNow · Workday. AI bolted on. <strong>Stable. AI quality varies wildly per module.</strong>', 'amber')}
${cell('A3', 'AI-native boutiques', '', 'OpenAI · Anthropic · Cohere · Mistral. Specialized · fast. <strong>Highest capability. Highest commercial risk.</strong>', 'amber')}
${cell('A4', 'SI partners', '', 'Accenture · TCS · Wipro · Deloitte · EY. AI implementation services. <strong>Quality varies by team and engagement.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '3 over-promise patterns', icon: '!', iconRed: true, headlineHtml: 'ISV thin wrapper · SI bench gap · <em>boutique demo→prod gap</em>',
    blocks: [{ atStep: 1, html: cardRed('3 ARCHETYPES MOST LIKELY TO OVER-PROMISE ON AI', '', ['<strong>1. ISV thin wrappers.</strong> Product was OK before. AI added marginal value. Sales deck claims differentiation. Reality differs.', '<strong>2. SI bench reality gap.</strong> 2 strong specialists. 40 consultants learning on your project. Bench reality ≠ pitch.', '<strong>3. AI-native production-readiness overclaim.</strong> Demos great. Production behavior unproven at your concurrency. Common with companies <200 employees.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Same rigor as other suppliers · <em>re-diligence on AI add</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE YOUR AI VENDOR PORTFOLIO', '2 questions', ['<strong>Q1:</strong> AI vendor diligence with same rigor as other critical suppliers? Yes green · "we wave it through" amber · <strong>no red — incidents follow</strong>.', '<strong>Q2:</strong> existing vendor adds "AI" → do you re-diligence? Yes material green · informally amber · <strong>no red — risk profile changed, you didn\'t</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Inventory current AI vendor relationships', ['For each: which archetype? Which over-promise pattern? <strong>That map is your diligence backlog.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Diligence checklist · <em>12 items + red flags + tiering</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', '4 archetypes · 3 over-promise patterns · 2-question scoring.', '<strong>Next:</strong> 12-item checklist · 5 red flags · tiering rule.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Diligence checklist for AI vendors' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-diligence.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · 12 ITEMS · 5 RED FLAGS · 3 TIERS', h1Html: 'AI-specific diligence · <em>scaled with a tiering rule</em>', subtitleHtml: '<strong>Each item is yes/no with documented evidence. Not vibes.</strong>' },
  { type: 'content', eyebrow: '4 diligence categories', icon: '1', headlineHtml: 'Model+data · security+privacy · performance · <em>commercial+exit</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('D1', 'Model + data provenance (3)', '', 'What model · whose training data · what rights flow through.', 'green')}
${cell('D2', 'Security + privacy (3)', '', 'Where data goes · used for training · sub-processors named.', 'green')}
${cell('D3', 'Performance + reliability (3)', '', 'Actual prod performance · drift handling · vendor outage behavior.', 'green')}
${cell('D4', 'Commercial + exit (3)', '', 'Pricing trajectory · lock-in profile · termination reality.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '5 red flag answers', icon: '!', iconRed: true, headlineHtml: 'Proprietary · trust us · varies · uptime SLA · <em>30-day notice</em>',
    blocks: [{ atStep: 1, html: cardRed('5 RED FLAG ANSWERS · PAUSE EVERY DEAL', '', ['<strong>1. "Proprietary, can\'t share"</strong> on model architecture or training data. <em>Vendor won\'t or can\'t disclose.</em>', '<strong>2. "Trust us, we have NDAs with sub-processors."</strong> You need them named. Trust isn\'t contractual.', '<strong>3. "Performance varies by use case."</strong> Translation: they haven\'t measured for production conditions.', '<strong>4. "Uptime SLA covers it."</strong> For AI, uptime necessary but never sufficient.', '<strong>5. "Termination is standard 30-day notice."</strong> For AI, exit involves data + models + prompts. <em>30 days is theatre. Reality is months.</em>']) }] },
  { type: 'content', eyebrow: '3-tier rule', icon: '2', headlineHtml: 'High stakes · medium · <em>light commercial</em>',
    blocks: [{ atStep: 1, html: card('THE TIERING RULE', 'Not every vendor gets full treatment', ['<strong>Tier 1 — high stakes or high spend.</strong> >$250K annual · OR customer data · OR regulated decisions. <em>Full 12-item diligence.</em>', '<strong>Tier 2 — medium stakes.</strong> <$250K · internal use · low regulatory. <em>Abbreviated 6-item.</em>', '<strong>Tier 3 — light commercial.</strong> Departmental Copilot seats · free-tier dev accounts. <em>AUP sufficient.</em>'], '<strong>Document the tiering rule.</strong> That\'s how you scale diligence without watering it down.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'All 12 items documented · <em>tiering applied consistently</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI DILIGENCE DISCIPLINE', '2 questions', ['<strong>Q1:</strong> every Tier 1 AI vendor (last 12 mo) has documented evidence on all 12 items? Yes green · partial amber · <strong>no red — audit finds gap</strong>.', '<strong>Q2:</strong> tiering rule documented + applied consistently? Yes green · ad-hoc amber · <strong>no red — drift back to wave-it-through</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one recent Tier 1 AI vendor signing', ['Walk 12-item checklist. <strong>Gaps = post-signing remediation list.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Contract terms · <em>6 AI-specific clauses MSAs miss</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4 categories · 5 red flags · 3-tier rule.', '<strong>Next:</strong> 6 clauses · training-data trap · regulator-driven extras.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Contract terms' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-contract.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · 6 AI-SPECIFIC CLAUSES MSAs MISS', h1Html: 'Training-data trap · <em>regulator-driven extras</em>', subtitleHtml: '<strong>What they say evolves. What they sign holds.</strong>' },
  { type: 'content', eyebrow: '6 AI-specific clauses', icon: '1', headlineHtml: 'Data use · sub-processors · model lineage · perf+drift · IP · <em>exit</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'Data use commitment', '', 'Vendor cannot use your data · prompts · outputs to train general models. <strong>Written. Not in privacy policy.</strong>', 'green')}
${cell('C2', 'Sub-processor disclosure', '', 'Named list. Change requires advance notice. <strong>Without this, swaps silently.</strong>', 'green')}
${cell('C3', 'Model lineage transparency', '', 'What model · version · training data domains. <strong>Updated when vendor changes models.</strong>', 'green')}
${cell('C4', 'Performance + drift remedies', '', 'Defined metrics · remedies when missed. <strong>Not "best efforts" language.</strong>', 'green')}
${cell('C5', 'IP + output ownership', '', 'Outputs are yours. <strong>Some MSAs grab joint IP silently.</strong>', 'green')}
${cell('C6', 'Exit cooperation', '', 'Data return · model deletion proof · transition support. <strong>Otherwise hostage negotiation.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Training-data trap', icon: '!', iconRed: true, headlineHtml: 'Buried in privacy policy · <em>your data = their advantage</em>',
    blocks: [{ atStep: 1, html: cardRed('THE TRAINING-DATA TRAP', 'Standard contracts have permissive language buried', ['Most standard SaaS contracts: training-data language buried in privacy policies or DPAs. <em>Vendor can use your data for product improvement · model training · analytics.</em>', '<strong>Unacceptable for AI vendors.</strong> Your data becomes their competitive advantage. Your prompts train their models. Your edge cases become their training set.'], '<strong>Fix:</strong> negotiate explicitly into MSA, not DPA. <em>"Customer data, prompts, outputs, and embeddings shall not be used for training, model improvement, or any general-purpose ML."</em>') }] },
  { type: 'content', eyebrow: 'Regulator-driven extras', icon: '2', headlineHtml: 'BFSI · healthcare · <em>EU AI Act</em>',
    blocks: [{ atStep: 1, html: card('REGULATOR-DRIVEN CLAUSES · CONTEXT-SPECIFIC', 'Vendor refusal = deal refusal', ['<strong>BFSI:</strong> RBI · MAS · SAMA · ADGM cyber + outsourcing. Right to audit · on-shore residency · sub-processor approval.', '<strong>Healthcare:</strong> HIPAA BAA (US) · DPDPA (India). Explicit PHI handling · retention · deletion proof.', '<strong>EU AI Act:</strong> for high-risk systems, conformance evidence flows vendor → customer.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'All 6 clauses · <em>MSA template refreshed in 12 mo</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CONTRACT DISCIPLINE', '2 questions', ['<strong>Q1:</strong> Tier 1 AI contracts have all 6 clauses? Yes green · 4-5 amber · <strong><4 red — leverage is theirs</strong>.', '<strong>Q2:</strong> legal reviewed AI-specific MSA template in last 12 mo? Yes green · "we use standard" amber · <strong>no red — template lags evolving risk</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull most recent Tier 1 AI vendor contract', ['Walk the 6 clauses. <strong>Missing ones = amendment list.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Performance SLAs · <em>beyond uptime-only</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '6 clauses · training-data trap · regulator-driven extras.', '<strong>Next:</strong> 4 SLA dimensions · remedies with teeth.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Performance SLAs' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-sla.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · BEYOND UPTIME', h1Html: '4 SLA dimensions · <em>remedies with real teeth</em>', subtitleHtml: '<strong>Uptime SLA alone = wrong things measured. Without termination right, vendor has no real incentive.</strong>' },
  { type: 'content', eyebrow: 'The uptime-only trap', icon: '!', iconRed: true, headlineHtml: 'Vendor up · responses 12s late · quality dropped 20% · <em>SLA says no remedy</em>',
    blocks: [{ atStep: 1, html: cardRed('THE UPTIME-ONLY TRAP', 'Wrong things measured', ['<strong>Standard SaaS SLA:</strong> 99.9% uptime. Service credits if missed.', '<strong>For AI services:</strong> uptime is necessary but never sufficient. Vendor up. Responses 12s late. Quality dropped 20%. <em>Uptime SLA says you have no remedy.</em>'], '<strong>Latency · accuracy · drift matter equally.</strong>') }] },
  { type: 'content', eyebrow: '4 SLA dimensions', icon: '1', headlineHtml: 'Availability · latency · accuracy · <em>drift</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'Availability', '', '99.5-99.95% typical for AI. <strong>Lower than infra. Don\'t expect 99.99%.</strong>', 'green')}
${cell('S2', 'Latency', '', 'P50 · P95 · P99 per request type. <strong>Negotiate P95, not just average.</strong>', 'green')}
${cell('S3', 'Accuracy', '', 'Sample-based vs baseline. Vendor eval quarterly. <strong>Decline triggers remediation.</strong>', 'green')}
${cell('S4', 'Drift detection', '', 'Vendor reports model version changes. <strong>Without this, debugging silent drift becomes your problem.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Remedies with teeth', icon: '2', headlineHtml: 'Material termination right · root-cause SLA · <em>joint review</em>',
    blocks: [{ atStep: 1, html: card('REMEDIES THAT ACTUALLY WORK', 'Service credits alone don\'t work', ['<strong>Remedy 1 — material change termination right.</strong> Accuracy drops below threshold N consecutive periods → customer can terminate penalty-free. <em>Aligns vendor incentives.</em>', '<strong>Remedy 2 — root cause + remediation plan.</strong> Within 5 business days, vendor delivers RCA + plan. Acceptance criteria pre-defined.', '<strong>Remedy 3 — co-managed milestones.</strong> If remediation >30 days, joint review with weekly checkpoints.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'All 4 dimensions · <em>termination right not just credits</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SLA DISCIPLINE', '2 questions', ['<strong>Q1:</strong> Tier 1 AI SLAs cover all 4 dimensions? Yes green · 2-3 amber · <strong>uptime-only red</strong>.', '<strong>Q2:</strong> remedies include termination right? Yes green · credits + something amber · <strong>credits-only red — no real incentive</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull top Tier 1 AI SLA', ['Walk 4 dimensions. <strong>Missing ones = renewal-negotiation list.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Lock-in mitigation · <em>4 tests + realistic mitigations</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Uptime trap · 4 SLA dimensions · remedies with teeth.', '<strong>Next:</strong> 4 lock-in tests · 4 mitigations · what doesn\'t work.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Lock-in mitigation' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-lockin.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · 4 LOCK-IN TESTS · REALISTIC MITIGATIONS', h1Html: 'Model · data · prompt · integration · <em>mitigations that work</em>', subtitleHtml: '<strong>Lock-in cost is paid in advance, or in crisis. Pick when.</strong>' },
  { type: 'content', eyebrow: '4 lock-in tests', icon: '1', headlineHtml: 'Model · data · prompt · <em>integration</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('T1', 'Model lock-in', '', 'If vendor model removed/changed, switching cost? <strong>Open weights or interface-compatible alt? Low. Proprietary undocumented? High.</strong>', 'green')}
${cell('T2', 'Data lock-in', '', 'Your data · prompts · embeddings · fine-tunes — exportable in usable form?', 'green')}
${cell('T3', 'Prompt lock-in', '', 'Prompts transfer to other models with minor tweaks · or deeply vendor-specific?', 'amber')}
${cell('T4', 'Integration lock-in', '', 'Apps · data flows · identity wired to this vendor. <strong>Migration cost is integration cost.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '4 realistic mitigations', icon: '2', headlineHtml: 'Open weights · portability · abstraction · <em>escrow</em>',
    blocks: [{ atStep: 1, html: card('4 REALISTIC MITIGATIONS', 'Cost paid in advance, not in crisis', ['<strong>1. Open weights option.</strong> Where feasible, use open-weight models even if hosted. Llama · Mistral · Phi · Qwen — portable across providers.', '<strong>2. Portability commitments.</strong> Contract requires data export in industry-standard formats · prompt export · embedding export.', '<strong>3. Abstraction layers.</strong> App code talks to thin abstraction · provider behind. Realistic for low-end LLM calls. Harder for advanced features.', '<strong>4. Model + weights escrow.</strong> For mission-critical with single specialist vendor. Released if vendor exits or breaches.']) }] },
  { type: 'content', eyebrow: 'What doesn\'t work', icon: '!', iconRed: true, headlineHtml: 'Re-evaluate at renewal · 30-day termination · multi-vendor as portability · <em>vendor-controlled portability</em>',
    blocks: [{ atStep: 1, html: cardRed('WHAT DOESN\'T WORK AS LOCK-IN MITIGATION', '', ['<strong>"We\'ll re-evaluate at renewal."</strong> By then, you\'ve built around them. Theatre.', '<strong>"Contract has 30-day termination."</strong> For AI, exit takes months. Fiction.', '<strong>"Just use APIs from multiple vendors."</strong> If prompts · evals · integration are vendor-specific, multi-vendor doesn\'t reduce lock-in.', '<strong>Vendor\'s own "lock-in mitigation" features.</strong> Vendor-controlled portability is not portability.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Tested 4 dimensions · <em>negotiated at signing</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE LOCK-IN MITIGATION', '2 questions', ['<strong>Q1:</strong> top 3 AI vendors lock-in tested across 4 dimensions? Yes green · partial amber · <strong>no/never red — hostage negotiation coming</strong>.', '<strong>Q2:</strong> last 12 mo signings, negotiated ≥1 mitigation? Yes green · sometimes amber · <strong>no red — accepted lock-in by default</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick top AI vendor by spend', ['Walk 4 lock-in tests. <strong>Red flags = next renewal-cycle negotiation list.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Risk monitoring + audit · <em>5 signal sources + 4-phase response</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 tests · 4 mitigations · 4 anti-patterns.', '<strong>Next:</strong> 5 signal sources · 4-phase cadence · 3 audit rhythms.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Vendor risk monitoring and audit' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-monitoring.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · MULTI-SOURCE SIGNALS · STRUCTURED RESPONSE', h1Html: '5 signal sources · 4-phase response · <em>3 audit rhythms</em>', subtitleHtml: '<strong>Most teams monitor 1-2 sources. Picture is incomplete. Disruption hits anyway.</strong>' },
  { type: 'content', eyebrow: '5 signal sources', icon: '1', headlineHtml: 'SLA perf · financial · security · geopolitical · <em>strategic</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('S1', 'SLA performance', '', '4 dimensions being met? <strong>Vendor reports + your measurement.</strong>', 'green')}
${cell('S2', 'Financial health', '', 'AI-native boutiques especially. <strong>Funding rounds · credit ratings · press signals.</strong>', 'green')}
${cell('S3', 'Security incidents', '', 'Vendor breaches · CVE reports · shared sub-processor signals.', 'green')}
${cell('S4', 'Geopolitical + regulatory', '', 'Jurisdiction sanctions · export controls · new AI regulations.', 'green')}
${cell('S5', 'Strategic', '', 'M&A · competing products · leadership departures · pre-announced sunsets.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4-phase response cadence', icon: '2', headlineHtml: 'Monitor · assess · engage · <em>contingency</em>',
    blocks: [{ atStep: 1, html: card('THE 4-PHASE RESPONSE CADENCE', 'Without it: signals collected, nothing happens', ['<strong>Phase 1 — continuous monitoring.</strong> Signals tracked. Most don\'t require action.', '<strong>Phase 2 — assessment.</strong> Threshold crossed. Vendor manager reviews. <em>Real? Material? Alternative available?</em>', '<strong>Phase 3 — engagement.</strong> If confirmed, engage vendor. Conversation. Plan together.', '<strong>Phase 4 — contingency activation.</strong> If severe, activate alternative or in-house path. <em>Pre-vetted. Pre-contracted.</em>']) }] },
  { type: 'content', eyebrow: '3 audit rhythms', icon: '3', headlineHtml: 'Quarterly · annual · <em>pre-renewal</em>',
    blocks: [{ atStep: 1, html: card('3 AUDIT RHYTHMS · EACH CATCHES DIFFERENT THINGS', '', ['<strong>Quarterly.</strong> Top 10 AI vendors by spend/criticality. Performance review · contract compliance · 5 signal health check.', '<strong>Annual.</strong> All Tier 1 AI vendors. Full audit including diligence refresh. <em>Things change in 12 months.</em>', '<strong>Pre-renewal.</strong> 90 days before renewal. Lock-in test refresh. Alternative vendor cost modelling. <em>Time to negotiate or switch with leverage.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: '5 sources flowing · <em>4-phase with named owners</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE RISK MONITORING', '2 questions', ['<strong>Q1:</strong> 5 signal sources flowing for top AI vendors? Integrated green · 3-4 amber · <strong><3 red — risk picture blind</strong>.', '<strong>Q2:</strong> 4-phase response with named owner per phase? Yes green · informal amber · <strong>no red — signals collected, nothing happens</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick top AI vendor', ['Walk 5 signal sources + 4-phase cadence. <strong>Gaps = risk-monitoring backlog.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Vendor offboarding · <em>3 AI-specific risks · transition plan</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '5 sources · 4-phase · 3 rhythms.', '<strong>Next:</strong> pre-write at signing · 3 AI exit risks · transition plan structure.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Vendor offboarding' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-offboarding.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · PRE-WRITE AT SIGNING · NOT TERMINATION', h1Html: '3 AI-specific exit risks · <em>4-section transition plan</em>', subtitleHtml: '<strong>Write the offboarding plan when leverage is balanced. Otherwise it\'s hostage negotiation.</strong>' },
  { type: 'content', eyebrow: 'Pre-write at signing', icon: '!', iconRed: true, headlineHtml: 'Honeymoon hides exit · <em>contract is the only record</em>',
    blocks: [{ atStep: 1, html: cardRed('PRE-WRITE OFFBOARDING AT SIGNING', 'Not at termination', ['<strong>Pattern:</strong> sign with vendor. Honeymoon begins. Nobody documents exit plan because nobody\'s thinking about exit.', 'Three years later → you need to switch. Nobody remembers what was agreed. <em>Vendor\'s contract is the only source of truth, and it favours them.</em>'], '<strong>Discipline:</strong> write the offboarding plan during contracting. What data comes back · in what format · how long transition takes · who pays. <em>Pin it when leverage is balanced.</em>') }] },
  { type: 'content', eyebrow: '3 AI-specific exit risks', icon: '1', headlineHtml: 'Data deletion proof · model retention · <em>retraining echoes</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('E1', 'Data deletion proof', '', 'Vendor says deleted — how do you verify? <strong>Audit-level proof for PII + regulated data.</strong>', 'red')}
${cell('E2', 'Model retention', '', 'Vendor used data to train/fine-tune model. <strong>Data deleted but model embeds it.</strong>', 'red')}
${cell('E3', 'Retraining echoes', '', 'Even with "no training" clauses, embeddings or fine-tunes may have happened. <strong>Attestation no derivative artifacts remain.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: '4-section transition plan', icon: '2', headlineHtml: 'Data return · knowledge transfer · running cost · <em>escalation path</em>',
    blocks: [{ atStep: 1, html: card('TRANSITION PLAN STRUCTURE · 4 SECTIONS', '', ['<strong>1. Data return.</strong> Format · schedule · validation. Pre-defined formats so nothing is "in our proprietary structure."', '<strong>2. Knowledge transfer.</strong> Configurations · prompts · eval suites · documentation. <em>Walking new vendor or in-house team through what works.</em>', '<strong>3. Running cost.</strong> Who pays for parallel operation during transition. 60-90 days with declining-cost terms.', '<strong>4. Escalation path.</strong> What happens when transition stalls. Named contacts · timeframes · dispute resolution.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Pre-written plan · <em>model-deletion + retraining-echo language</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE OFFBOARDING READINESS', '2 questions', ['<strong>Q1:</strong> Tier 1 contracts have pre-written offboarding plan? Detailed yes green · generic termination amber · <strong>no red — hostage negotiation</strong>.', '<strong>Q2:</strong> model-deletion + retraining-echo attestation language? Yes green · partial amber · <strong>no red — AI-specific risks unaddressed</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull most recent Tier 1 AI vendor contract', ['Walk offboarding section. <strong>If generic, that\'s the renewal-negotiation priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · 1-page playbook · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Pre-write at signing · 3 AI exit risks · 4-section transition.', '<strong>Last:</strong> 5-section playbook · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={archetype:'',tier:'',audit:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-vendor-playbook.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var ar=state.archetype||'_(pick top archetype)_';var t=state.tier||'_(pick tiering threshold)_';var au=state.audit||'_(pick audit cadence)_';return '# AI Vendor Playbook\\n\\n**Category owner:** ____________________\\n**Date:** ____________________\\n\\n## Top vendor archetype\\n> '+ar+'\\n\\n## Tiering threshold\\n> '+t+'\\n\\n## Audit cadence\\n> '+au+'\\n\\n## 5-section playbook\\n- [ ] Tiering rule: spend + data sensitivity + regulatory\\n- [ ] Diligence checklist: 12 items · 4 categories · 5 red flags\\n- [ ] Contract clauses: 6 AI-specific · training-data discipline · regulator extras\\n- [ ] SLA discipline: 4 dimensions · termination right · remedies with teeth\\n- [ ] Risk + exit: 5 signals · 4-phase response · pre-written offboarding · 3 AI exit risks\\n\\n## 4 trust trip-wires (do not cross)\\n- Standard SaaS terms for AI vendors (6 clauses missing)\\n- Uptime-only SLAs (quality + drift required)\\n- No offboarding plan at signing (hostage negotiation)\\n- No risk monitoring after signing (surprises arrive)\\n\\n---\\nSource: Gennoor Academy · AI Vendor Management\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — AI vendor playbook' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 1-PAGE PLAYBOOK · WHAT CATEGORY TEAM OPERATES AGAINST', h1Html: '5-section playbook · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Run AI vendors with the same discipline as any other critical supplier.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Same discipline · <em>playbook scales it</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Category team operates against the playbook', ['<strong>Run AI vendors with the same discipline as any other critical supplier.</strong> The playbook is what your category team operates against.']) }] },
  { type: 'content', eyebrow: '5-section playbook', icon: '2', headlineHtml: 'Tiering · diligence · contract · SLA · <em>risk + exit</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'Tiering rule', '', 'Spend + sensitivity + regulatory. <strong>Which vendors get full treatment.</strong>')}
${cell('P2', 'Diligence checklist', '', '12 items · 4 categories · 5 red flag answers.', 'amber')}
${cell('P3', 'Contract clauses', '', '6 AI-specific clauses + regulator extras.', 'green')}
${cell('P4', 'SLA discipline', '', '4 dimensions · remedies with termination right.', 'green')}
${cell('P5', 'Risk + exit', '', '5 signals · 4-phase response · pre-written offboarding.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Standard SaaS terms · uptime-only · no exit plan · <em>no monitoring</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Standard SaaS terms for AI', '', 'Missing 6 AI-specific clauses. Negotiate in.', 'red')}
${cell('W2', 'Uptime-only SLAs', '', 'Quality + drift required for AI services.', 'red')}
${cell('W3', 'No offboarding plan at signing', '', 'Exit becomes hostage negotiation.', 'red')}
${cell('W4', 'No risk monitoring after signing', '', 'Vendor health changes silently.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · playbook builder', icon: '✓', headlineHtml: 'Archetype · tier · audit · <em>take to category team</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Top vendor archetype in your portfolio</h5><div class="preset" data-group="archetype">
<button data-val="Hyperscalers (AWS, MS, Google, Oracle) — gravity-driven lock-in, full diligence required at scale">Hyperscalers</button>
<button data-val="Established ISVs adding AI features (SAP, Salesforce, ServiceNow, Workday) — re-diligence on material AI additions">Established ISVs</button>
<button data-val="AI-native boutiques (OpenAI, Anthropic, Cohere, Mistral) — highest commercial risk, model lineage clauses critical">AI-native boutiques</button>
<button data-val="SI partners (Accenture, TCS, Wipro, Deloitte) — bench-reality diligence + SOW-level rigor required">SI partners</button>
</div></div>
<div class="group"><h5>Tier 1 threshold</h5><div class="preset" data-group="tier">
<button data-val="$250K annual OR customer data OR regulated decisions (default starting threshold)">$250K · data · regulated</button>
<button data-val="$100K annual OR ANY production system (more conservative for regulated industries)">$100K · any prod</button>
<button data-val="$500K annual OR strategic customer data (higher threshold for high-spend enterprises)">$500K · strategic data</button>
</div></div>
<div class="group"><h5>Audit cadence</h5><div class="preset" data-group="audit">
<button data-val="Quarterly top 10 + annual all-Tier-1 + 90-day pre-renewal (default)">Quarterly + annual + pre-renewal</button>
<button data-val="Monthly top 5 + quarterly all-Tier-1 + 120-day pre-renewal (higher rigor)">Monthly + quarterly + pre-renewal</button>
<button data-val="Semi-annual top 10 + annual all-Tier-1 (lighter touch for stable estates)">Semi-annual + annual</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my AI vendor playbook (.md)</button>
</div>
<div class="preview" id="preview"># AI Vendor Playbook

Pick top archetype, tiering threshold, and audit cadence on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: '4 archetypes · 12 diligence · 6 clauses · 4 SLAs · 4 lock-in tests · 5 signals · <em>pre-written exit</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI vendors are still vendors. Four archetypes, three over-promise patterns. Twelve diligence items with red flags. Six AI-specific contract clauses. Four-dimensional SLAs with real remedies. Four lock-in tests with realistic mitigations. Five signal sources with four-phase response. Pre-written offboarding addressing data deletion, model retention, retraining echoes.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Build your playbook.</div><div class="row"><span class="arr">→</span>Get category team review on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 42 chapters 1-8 built.')
