// Course 43 — AI Strategy for the CDO (Emma · leadership track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Leadership · AI Strategy for the CDO'
const OUT = 'tmp/academy-build/ai-strategy-for-cdo/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The CDO mandate in the AI era' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-mandate.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · MANDATE DOUBLED · BUDGET RARELY DID', h1Html: 'Mandate expansion · 3 boundary fights · <em>resolution patterns</em>', subtitleHtml: '<strong>The structural reality. Without resolution, boundary fights become silent veto power.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Pre-AI scope + AI on top · <em>headcount rarely doubles</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'The CDO mandate doubled', ['<strong>Pre-AI CDO scope:</strong> data quality · lineage · master data · reporting fidelity · defensible to regulators.', '<strong>Post-AI:</strong> same + AI data foundation + AI platforms + governance partnership with CISO/CRO + board KPIs reporting AI value.'], '<strong>Mandate doubled. Headcount and budget rarely did.</strong> That\'s the structural reality.') }] },
  { type: 'content', eyebrow: '3 boundary fights', icon: '!', iconRed: true, headlineHtml: 'CIO · CTO · <em>CISO</em>',
    blocks: [{ atStep: 1, html: cardRed('3 BOUNDARY FIGHTS EVERY CDO IS HAVING', '', ['<strong>1. With CIO.</strong> Who owns AI platform? CIO says infra. CDO says data + ML stack. Both legitimate. <em>Requires CEO arbitration if it festers.</em>', '<strong>2. With CTO.</strong> Product wants AI features fast. CDO wants data quality + lineage controls. Velocity vs governance.', '<strong>3. With CISO.</strong> AI introduces new attack surface. CISO wants gates. CDO needs program moving. <em>Without shared RACI, weekly friction.</em>']) }] },
  { type: 'content', eyebrow: '3 resolution patterns', icon: '2', headlineHtml: 'Joint charter · escalation path · <em>quarterly review</em>',
    blocks: [{ atStep: 1, html: card('3 RESOLUTION PATTERNS THAT WORK', '', ['<strong>1. Written joint charter.</strong> CDO + CIO + CISO + CRO sign one-page charter on governance + platform ownership. Specific. Reviewed quarterly.', '<strong>2. Defined escalation path.</strong> Charter ambiguity → named escalation to CEO chief of staff before becoming CEO meeting.', '<strong>3. Quarterly portfolio review.</strong> All four execs review AI portfolio together. <em>Surfaces conflicts before board.</em>'], 'Without these, <strong>boundary fights become silent veto power. Each exec slows the others by 15-20%.</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Boundary signed · <em>mandate formally expanded with budget</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CDO SCOPE CLARITY', '2 questions', ['<strong>Q1:</strong> boundary between CDO · CIO · CTO · CISO documented for AI platform ownership? Signed green · informal amber · <strong>no red — fights ahead</strong>.', '<strong>Q2:</strong> CDO mandate formally expanded with budget? Yes both green · scope expanded no budget amber · <strong>no formal change red — accountability without authority</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Write one-page memo describing your CDO scope as you see it', ['Compare to what CIO + CTO would write. <strong>Differences are the alignment work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Data foundations AI actually needs · <em>minimum viable filter</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Mandate doubled · 3 boundary fights · 3 resolution patterns.', '<strong>Next:</strong> 3 things AI needs · 3 things AI doesn\'t · CFO framing.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Data foundations AI actually needs' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-foundations.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · UNBLOCK AI · NOT BOIL THE OCEAN', h1Html: '3 foundations AI needs · <em>3 investments that don\'t unblock</em>', subtitleHtml: '<strong>Minimum viable filter: does this work directly enable an AI use case this year?</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Minimum viable filter · <em>justifiable ≠ unblocking</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Justifiable ≠ unblocking', ['CDOs accumulate data investment requests. <strong>Catalog · MDM · lineage · quality · vendor migration.</strong>', 'All justifiable. Most don\'t unblock the AI roadmap. <em>Discipline is separating the two.</em>'], '<strong>Minimum viable filter:</strong> does this work directly enable an AI use case this year? If yes → prioritise. If no → it can wait, even if strategically right long-term.') }] },
  { type: 'content', eyebrow: '3 foundations AI needs', icon: '2', headlineHtml: 'Retrievable knowledge · structured ops data · <em>labelled training</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('F1', 'Retrievable + indexable knowledge', '', 'For RAG. Docs via API · permissions metadata · recency. <strong>Specific corpora, not full lake.</strong>', 'green')}
${cell('F2', 'Structured ops data with lineage', '', 'For analytics + decision-support AI. Master data clean enough no hallucinated joins. <strong>Lineage to defend to regulators.</strong>', 'green')}
${cell('F3', 'Labelled training data, where needed', '', 'For fine-tune or eval. Usually small — 100s-1000s. <strong>Most teams skip fine-tuning.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 investments AI doesn\'t need', icon: '!', iconRed: true, headlineHtml: 'Full MDM · comprehensive catalog · <em>universal lineage</em>',
    blocks: [{ atStep: 1, html: cardRed('3 INVESTMENTS THAT DON\'T UNBLOCK AI', 'Strategically right · just not on critical path', ['<strong>Full MDM consolidation.</strong> AI features work on specific datasets. They don\'t need full enterprise master unified.', '<strong>Comprehensive data catalog.</strong> AI engineers find data via Slack + tribal knowledge. Catalog helps governance, not feature shipping.', '<strong>Universal lineage.</strong> Lineage matters for regulator numbers. Not for most AI features.'], '<strong>Sequence these after AI proves out, not before.</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Data-block lag · <em>investments tied to AI use cases</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DATA FOUNDATION DISCIPLINE', '2 questions', ['<strong>Q1:</strong> AI feature blocked by data → typical request-to-unblocked lag? <30 days green · 30-90 amber · <strong>>90 red — data team is bottleneck</strong>.', '<strong>Q2:</strong> every data investment >$200K has documented AI use case unblocked in 12 months? Yes green · some amber · <strong>no red — boil-the-ocean spending</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List top 5 data investments', ['For each: AI use case unblocked within 12 mo. <strong>Without clear answer → defer.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Governance partnership · <em>3-pillar RACI with CISO + CRO</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Minimum viable filter · 3 needs · 3 don\'t-needs.', '<strong>Next:</strong> 3-pillar RACI · 3 turf fights · committee discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Governance partnership with CISO and CRO' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-governance.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · RACI THAT HOLDS · COMMITTEE DISCIPLINE', h1Html: '3-pillar RACI · <em>3 turf fights to pre-empt</em>', subtitleHtml: '<strong>Same problem we\'ve seen with every governance committee since SOX. Same solution.</strong>' },
  { type: 'content', eyebrow: 'The failure mode', icon: '!', iconRed: true, headlineHtml: 'Month 6 · committee meets bi-weekly · approves nothing · <em>shadow AI begins</em>',
    blocks: [{ atStep: 1, html: cardRed('THE FAILURE MODE MOST AI GOVERNANCE COMMITTEES HIT', '', ['<strong>Month 1.</strong> Excitement. Charter signed. All three roles enthusiastic.', '<strong>Month 4.</strong> Friction. CISO blocks a deployment. CDO escalates. CRO unsure who owns the call.', '<strong>Month 6.</strong> Committee meets bi-weekly, approves nothing. AI program slows. <em>Business units route around. Shadow AI begins.</em>'], '<strong>Cause:</strong> RACI was nominal, not specific.') }] },
  { type: 'content', eyebrow: '3-pillar RACI', icon: '1', headlineHtml: 'Data quality · security · <em>model + AI lifecycle risk</em>',
    blocks: [{ atStep: 1, html: card('3-PILLAR RACI · ONE R PER PILLAR', 'If two execs both think they\'re R, committee freezes', ['<strong>Pillar 1 — data quality + lineage.</strong> CDO is Responsible. CRO is Consulted on regulatory implications. CISO is Informed.', '<strong>Pillar 2 — security + access controls.</strong> CISO is Responsible. CDO is Consulted on data classification. CRO is Consulted on risk acceptance.', '<strong>Pillar 3 — model + AI lifecycle risk.</strong> CRO is Responsible (risk function owns model risk). CDO is Consulted on data inputs. CISO is Consulted on attack surface.']) }] },
  { type: 'content', eyebrow: '3 turf fights to pre-empt', icon: '2', headlineHtml: 'New vendor · incident response · <em>board reporting</em>',
    blocks: [{ atStep: 1, html: card('3 TURF FIGHTS TO PRE-EMPT IN CHARTER', 'Parallel review · no sequential blocking', ['<strong>1. Who approves new external AI vendor?</strong> CISO security posture · CDO data clauses · CRO model risk. Parallel, in their lane.', '<strong>2. Who owns AI incident response?</strong> CRO framework · CISO technical containment · CDO data-impact assessment. <em>Pre-agreed playbook.</em>', '<strong>3. Who reports to board?</strong> CRO model risk · CDO AI value + KPIs · CISO security posture. <em>Three voices, agreed before meeting.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Documented 3-pillar RACI · <em>committee approves things</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE GOVERNANCE PARTNERSHIP', '2 questions', ['<strong>Q1:</strong> committee has documented 3-pillar RACI with one R per pillar? Yes specific green · "we have charter" amber · <strong>no/multiple Rs red — will freeze</strong>.', '<strong>Q2:</strong> committee approved ≥5 things last quarter or a blocker? >5 green · 2-4 amber · <strong><2 red — theatre</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Walk AI governance charter with CISO + CRO', ['For each pillar, name the single R. <strong>Disagreements are the alignment work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Investment prioritization · <em>3-horizon allocation · CFO framing</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3-pillar RACI · 3 turf fights · committee discipline.', '<strong>Next:</strong> starvation problem · 3-horizon allocation · CFO-defensible framing.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Investment prioritization across data and AI' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-investment.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · NEITHER STARVES · CFO-DEFENSIBLE', h1Html: '3-horizon allocation · <em>CFO-defensible framing</em>', subtitleHtml: '<strong>CFOs don\'t fund "data quality." They fund outcomes. Translate.</strong>' },
  { type: 'content', eyebrow: 'Starvation problem', icon: '!', iconRed: true, headlineHtml: 'AI starves data · <em>or data starves AI</em>',
    blocks: [{ atStep: 1, html: cardRed('THE STARVATION PROBLEM', 'Both patterns are common', ['<strong>AI starves data.</strong> CFO sees AI excitement. Funds AI platforms. Underfunds data plumbing. <em>6 quarters later, AI stalls because data isn\'t prod-grade.</em>', '<strong>Data starves AI.</strong> CDO advocates foundational data. Funds catalog · MDM · lineage. AI program waits. <em>2 years later, board asks where AI value is. Foundation impressive in slides, invisible in P&L.</em>']) }] },
  { type: 'content', eyebrow: '3-horizon allocation', icon: '1', headlineHtml: 'H1 50-60% · H2 25-35% · <em>H3 10-15%</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('H1', 'Ship now (12 mo)', '50-60%', 'AI features in current/next quarter + data work that directly enables them.', 'green')}
${cell('H2', 'Enable next (12-24 mo)', '25-35%', 'AI use cases identified, not yet in dev + data foundations they will need.', 'amber')}
${cell('H3', 'Foundational (24+ mo)', '10-15%', 'MDM consolidation · full catalog · comprehensive lineage.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'CFO-defensible framing', icon: '2', headlineHtml: 'Translate to outcomes · <em>not data work</em>',
    blocks: [{ atStep: 1, html: card('CFO-DEFENSIBLE FRAMING', 'CFOs fund concrete outcomes', ['<strong>Don\'t say</strong> "we need data catalog investment." <strong>Say</strong> "we need to ship 5 AI features in H2. Engineers spend 40% of cycle time looking for data. Catalog reduces that to 15%. YoY ROI is X."', '<strong>Don\'t say</strong> "we need MDM consolidation." <strong>Say</strong> "Customer 360 AI features can\'t ship until master data is consolidated across CRM + ERP. 8 months. Without it, 3 of 12 planned AI features push to next FY."'], '<strong>Always translate data work into AI feature unblocking.</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '3-horizon explicit · <em>each H2+H3 tied to AI outcome</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INVESTMENT PRIORITIZATION', '2 questions', ['<strong>Q1:</strong> data + AI budget has explicit 3-horizon allocation? Yes % set green · informal amber · <strong>no red — starvation likely</strong>.', '<strong>Q2:</strong> each H2 + H3 investment names AI outcome it unblocks? Yes green · some amber · <strong>no red — CFO will cut what can\'t trace</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull current data + AI budget · categorise H1/H2/H3', ['Imbalance is the rebalancing conversation with your CFO.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Vendor management · <em>MDM vs MLOps vs AI platforms</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Starvation problem · 3-horizon · CFO framing.', '<strong>Next:</strong> 4 overlapping categories · 4-vendor trap · 3 selection criteria.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Vendor management' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-vendors.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · OVERLAPPING TURF · 4-VENDOR TRAP', h1Html: '4 categories · 2-3 strategic vendors · <em>3 selection criteria</em>', subtitleHtml: '<strong>Default to two strong vendors with explicit integration commitments.</strong>' },
  { type: 'content', eyebrow: '4 overlapping categories', icon: '1', headlineHtml: 'MDM/catalog · data platforms · MLOps · <em>AI platforms</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('V1', 'MDM + catalog', '', 'Collibra · Informatica · Atlan · Alation. <strong>Claim governance + quality + lineage + AI metadata.</strong>', 'amber')}
${cell('V2', 'Data platforms', '', 'Databricks · Snowflake · AWS · MS Fabric. <strong>Claim storage + transformation + ML lifecycle + AI.</strong>', 'green')}
${cell('V3', 'MLOps + LLMOps', '', 'MLflow · W&B · LangSmith · Comet. <strong>Claim experiment tracking + lifecycle + eval + observability.</strong>', 'amber')}
${cell('V4', 'AI platforms', '', 'Azure AI Foundry · Bedrock · Vertex AI + AI-native. <strong>Claim model catalog + deployment + eval + governance.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '4-vendor trap', icon: '!', iconRed: true, headlineHtml: 'Buy one of each · <em>integration is the nightmare</em>',
    blocks: [{ atStep: 1, html: cardRed('THE 4-VENDOR TRAP', '', ['<strong>Pattern:</strong> buy one of each category. Hope they integrate.', '<strong>Reality:</strong> 4 vendor APIs · 4 auth models · 4 pricing curves · 4 upgrade cadences. <em>Each vendor blames the others when integration breaks.</em>'], '<strong>Cure:</strong> default to 2 strong vendors with explicit integration commitments. <em>Skip a category if existing 2 cover 80%.</em> Common working pattern: 1 data platform (Databricks/Snowflake/Fabric) + 1 governance (Collibra/Informatica/Atlan).') }] },
  { type: 'content', eyebrow: '3 selection criteria', icon: '2', headlineHtml: 'Multi-cloud · extensibility · <em>residency</em>',
    blocks: [{ atStep: 1, html: card('3 CDO-SPECIFIC VENDOR SELECTION CRITERIA', '', ['<strong>1. Multi-cloud roadmap.</strong> Will this vendor lock you into one hyperscaler? Especially relevant for hybrid/multi-cloud enterprises.', '<strong>2. Governance + lineage extensibility.</strong> Does vendor expose metadata via open APIs? Or proprietary formats only?', '<strong>3. Model + data residency support.</strong> BFSI · healthcare · government — contracted in writing, not "available in your region."']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '2-3 strategic vendors · <em>selected on criteria not feature lists</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CDO-LEVEL VENDOR MGMT', '2 questions', ['<strong>Q1:</strong> data + AI vendor stack has 2-3 strategic, not 5+? 2-3 green · 4 amber · <strong>5+ red — integration debt</strong>.', '<strong>Q2:</strong> vendors selected on multi-cloud/extensibility/residency, not feature lists? Documented yes green · partial amber · <strong>no red — lock-in by default</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Map current data + AI vendor stack', ['If >4 strategic with overlapping claims, <strong>that\'s the consolidation roadmap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Board KPIs · <em>4 outcome KPIs · 4 to retire</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '4 categories · 4-vendor trap · 3 criteria.', '<strong>Next:</strong> 4 KPIs that work · 4 to retire.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Board-level KPIs' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-kpis.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · OUTCOME · NOT ACTIVITY', h1Html: '4 KPIs that work · <em>4 to retire</em>', subtitleHtml: '<strong>Boards want few, big, defensible. Not 25 dashboards.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Translate data work · <em>to board-actionable outcomes</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Board KPIs ≠ team KPIs', ['Board KPIs are different from team KPIs. <strong>Boards want few, big, defensible.</strong> Not 25 dashboards.', '<strong>Trap:</strong> reporting data quality scores · lineage coverage · catalog completeness. <em>Directors don\'t act on these. They tune out.</em>'], '<strong>Discipline:</strong> translate data work into business outcomes the board acts on.') }] },
  { type: 'content', eyebrow: '4 KPIs that work', icon: '2', headlineHtml: 'TTV · regulatory · lock-in · <em>value realised</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('K1', 'AI-feature time-to-value', '', '"AI use case approved" → "in production with measurable impact." Trending down. <strong>Directors understand velocity.</strong>', 'green')}
${cell('K2', 'Data-defensible regulatory posture', '', 'Internal audit score on data + AI governance. Trending up. <strong>Boards care about audit findings.</strong>', 'green')}
${cell('K3', 'Vendor lock-in exposure', '', 'Per top vendor · switching cost in months + $. Trending down or flat. <strong>Strategic risk.</strong>', 'green')}
${cell('K4', 'AI value realised vs projected', '', 'From last 12-mo approved business cases · projected ROI materialised. <strong>Board truth test.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 KPIs to retire', icon: '!', iconRed: true, headlineHtml: 'Data quality % · catalog completeness · use cases in pipeline · <em>users trained</em>',
    blocks: [{ atStep: 1, html: cardRed('4 KPIs TO STOP REPORTING TO BOARD', 'Move to team KPI, not board', ['<strong>Data quality score percentage.</strong> Doesn\'t translate to action. Directors can\'t tell if 87% is good.', '<strong>Catalog completeness.</strong> Strategically right but invisible at board level.', '<strong>Number of AI use cases in pipeline.</strong> Easy to game · doesn\'t measure value.', '<strong>Number of trained users.</strong> Activity metric, not outcome metric.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: '4 outcome KPIs · <em>board asks follow-ups</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE BOARD KPI DISCIPLINE', '2 questions', ['<strong>Q1:</strong> 4 outcome KPIs to board, not 12 activity? 3-5 green · 6-10 amber · <strong>>10 or activity-only red — board tunes out</strong>.', '<strong>Q2:</strong> board asks follow-ups on KPIs or pro forma? Active engagement green · occasional amber · <strong>pro forma red — wrong KPIs</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last board deck', ['Count outcome KPIs vs activity. <strong>If activity wins, that\'s the redesign for next quarter.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'CDO governance discipline · <em>delegation tiers + operating cadence</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '4 board KPIs · 4 to retire · scoring.', '<strong>Next:</strong> bottleneck trap · 3-tier delegation · 4-rhythm cadence.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'CDO governance discipline' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-cadence.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · DELEGATE · OR BECOME THE BOTTLENECK', h1Html: '3-tier delegation · 4-rhythm cadence · <em>avoiding the bottleneck trap</em>', subtitleHtml: '<strong>If your reviews land at CDO directly >30% of the time, you\'re the bottleneck.</strong>' },
  { type: 'content', eyebrow: 'CDO bottleneck trap', icon: '!', iconRed: true, headlineHtml: 'Volume grows · reviews queue · <em>business units route around</em>',
    blocks: [{ atStep: 1, html: cardRed('THE CDO-AS-BOTTLENECK TRAP', '', ['<strong>Pattern:</strong> business units bring AI initiatives. CDO reviews each. Volume grows. Reviews queue. Initiatives stall waiting.', '<strong>6 months later:</strong> CDO is the bottleneck. Business units route around. <em>Shadow AI begins.</em>'], '<strong>Cure isn\'t more reviewing.</strong> Cure is delegation with structure. Most reviews can happen at lower levels. CDO sees exceptions.') }] },
  { type: 'content', eyebrow: '3-tier delegation', icon: '1', headlineHtml: 'Auto · committee · <em>CDO+exec</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Auto-approval', '60%', 'Pre-defined criteria — low sensitivity · internal · under spend. <strong>Data eng lead approves. CDO informed.</strong>', 'green')}
${cell('T2', 'Committee approval', '30%', 'Medium-risk — some regulated data · external under threshold. <strong>Weekly committee. CDO + CISO + CRO.</strong>', 'green')}
${cell('T3', 'CDO + exec approval', '10%', 'High-risk — PHI · PII at scale · customer-affecting · large spend. <strong>CDO directly. Often CEO/board notify.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Operating cadence', icon: '2', headlineHtml: 'Weekly · monthly · quarterly · <em>annual</em>',
    blocks: [{ atStep: 1, html: card('THE OPERATING CADENCE', '4 rhythms · each catches different things', ['<strong>Weekly.</strong> AI governance committee. Review committee-tier requests. Surface escalations.', '<strong>Monthly.</strong> CDO + CIO + CISO + CRO check-in. 30 minutes. Pre-empt boundary fights.', '<strong>Quarterly.</strong> Portfolio review. All in-flight AI investments. Health check on data foundations. Vendor portfolio.', '<strong>Annually.</strong> Strategy reset. 3-horizon allocation refresh. Board KPI redesign.'], '<strong>Without rhythms, decisions stack until they crisis-meet.</strong> Rhythms keep crisis off the calendar.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'CDO-direct fraction · <em>all 4 rhythms</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CDO GOVERNANCE DISCIPLINE', '2 questions', ['<strong>Q1:</strong> fraction of AI reviews landing at CDO directly vs delegated? <15% green · 15-30% amber · <strong>>30% red — you\'re the bottleneck</strong>.', '<strong>Q2:</strong> operating cadence has all 4 rhythms? Yes green · 2-3 amber · <strong><2 red — crisis-meeting culture</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last month of AI initiative reviews', ['Fraction to you vs lower levels? <strong>Imbalance = delegation work.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · CDO-CIO-CISO joint charter · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Bottleneck trap · 3-tier delegation · 4-rhythm cadence.', '<strong>Last:</strong> 5-section charter · 4 trip-wires · builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={scope:'',delegation:'',kpi:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='cdo-joint-charter.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var s=state.scope||'_(pick scope split)_';var d=state.delegation||'_(pick delegation weights)_';var k=state.kpi||'_(pick top board KPI)_';return '# CDO-CIO-CISO Joint Charter\\n\\n**CDO:** ____________________\\n**Co-signers:** CIO · CISO · CRO\\n\\n## Scope split\\n> '+s+'\\n\\n## Delegation tier weights\\n> '+d+'\\n\\n## Top board KPI focus\\n> '+k+'\\n\\n## 5-section charter\\n- [ ] Scope: CDO + CIO + CISO + joint, signed\\n- [ ] RACI: 3-pillar (data, security, model+lifecycle) with ONE R per pillar\\n- [ ] Delegation tiers: auto · committee · CDO+exec with criteria\\n- [ ] Operating cadence: weekly · monthly · quarterly · annual\\n- [ ] Board KPIs: 4 outcome KPIs (TTV · regulatory posture · lock-in · value realised)\\n\\n## 4 trust trip-wires (do not cross)\\n- CDO mandate expanded without budget — accountability without authority\\n- Governance committee with multiple Rs per pillar — committee freezes\\n- Board KPIs that are activity metrics — board tunes out\\n- CDO directly reviewing >30% of AI initiatives — bottleneck\\n\\n---\\nSource: Gennoor Academy · AI Strategy for the CDO\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — CDO-CIO-CISO joint charter' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 1-PAGE CDO JOINT CHARTER', h1Html: '5-section charter · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Mandate doubled. Budget rarely did. Charter is how you scale without becoming the bottleneck.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Mandate doubled · <em>charter scales</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Charter is how you scale', ['<strong>The CDO mandate expanded.</strong> The headcount and budget rarely did. The joint charter is how you scale without becoming the bottleneck.']) }] },
  { type: 'content', eyebrow: '5-section charter', icon: '2', headlineHtml: 'Scope · RACI · delegation · cadence · <em>board KPIs</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Scope', '', 'CDO + CIO + CISO + joint. Signed.')}
${cell('S2', 'RACI', '', '3 pillars · ONE R per pillar.', 'amber')}
${cell('S3', 'Delegation tiers', '', 'Auto · committee · CDO+exec with criteria.', 'green')}
${cell('S4', 'Operating cadence', '', 'Weekly · monthly · quarterly · annual.', 'green')}
${cell('S5', 'Board KPIs', '', '4 outcome (TTV · regulatory · lock-in · value realised).', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Mandate w/o budget · multiple Rs · activity KPIs · <em>CDO bottleneck</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Mandate expanded without budget', '', 'Accountability without authority. Unrunnable.', 'red')}
${cell('W2', 'Multiple Rs per pillar', '', 'Committee freezes. Shadow AI begins.', 'red')}
${cell('W3', 'Activity KPIs to board', '', 'Board tunes out. Budget defence weakens.', 'red')}
${cell('W4', '>30% reviews at CDO direct', '', 'You\'re the bottleneck. Delegate.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · charter builder', icon: '✓', headlineHtml: 'Scope · delegation · KPI focus · <em>take to CIO + CISO + CRO Monday</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Scope split with CIO</h5><div class="preset" data-group="scope">
<button data-val="CDO owns data + ML stack; CIO owns infra + ops; AI platform jointly owned">CDO data+ML · CIO infra · joint platform</button>
<button data-val="CDO owns AI platform; CIO owns infra below; clearer boundary, harder negotiation">CDO owns platform</button>
<button data-val="CIO owns AI platform; CDO owns data + governance; suits CIO-strong orgs">CIO owns platform</button>
</div></div>
<div class="group"><h5>Delegation tier weights</h5><div class="preset" data-group="delegation">
<button data-val="60% auto · 30% committee · 10% CDO+exec (default healthy split)">60/30/10</button>
<button data-val="50% auto · 35% committee · 15% CDO+exec (regulated industries)">50/35/15 (regulated)</button>
<button data-val="70% auto · 25% committee · 5% CDO+exec (mature AI orgs)">70/25/5 (mature)</button>
</div></div>
<div class="group"><h5>Top board KPI focus</h5><div class="preset" data-group="kpi">
<button data-val="AI-feature time-to-value (velocity narrative)">Time-to-value</button>
<button data-val="Data-defensible regulatory posture (audit narrative)">Regulatory posture</button>
<button data-val="AI value realised vs projected (truth-test narrative)">Value realised</button>
<button data-val="Vendor lock-in exposure (strategic risk narrative)">Lock-in exposure</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my CDO joint charter (.md)</button>
</div>
<div class="preview" id="preview"># CDO-CIO-CISO Joint Charter

Pick scope, delegation, and board KPI focus on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Mandate doubled · 3 boundary fights · minimum viable · 3-pillar RACI · 3-horizon · 2-3 vendors · 4 KPIs · <em>3-tier delegation</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>The CDO mandate expanded with AI sitting on top of data. Three boundary fights. Minimum viable data foundation. Three-pillar RACI with CISO and CRO. Three-horizon allocation. Two to three strategic vendors. Four outcome KPIs. Three-tier delegation.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Draft your joint charter.</div><div class="row"><span class="arr">→</span>Get CIO + CISO + CRO review on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 43 chapters 1-8 built.')
