// Course 34 — Building AI Agents with Copilot Studio (Andrew · doc 05 #19)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Build · Copilot Studio Agents (Production)'
const OUT = 'tmp/academy-build/building-ai-agents-copilot-studio/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'Copilot Studio architecture' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-architecture.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · STACK · NOT SINGLE PRODUCT', h1Html: '6 components · 3 architectural decisions · <em>governance from day one</em>', subtitleHtml: '<strong>Make these decisions deliberately at the start. Not after the third rebuild.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Copilot Studio is a stack · <em>not a single product</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Architectural decisions at the start', ['Copilot Studio is not a single product. <strong>It\'s a stack.</strong>', 'Teams that ship production-grade agents make architectural decisions deliberately at the start. <em>Not after the third rebuild.</em>']) }] },
  { type: 'content', eyebrow: '6 components', icon: '2', headlineHtml: 'Maker · runtime · Power Platform · model · knowledge · <em>governance</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('C1', 'Maker portal', '', 'Design topics, agents, knowledge sources.', 'green')}
${cell('C2', 'Runtime', '', 'Teams, web, custom channels.', 'green')}
${cell('C3', 'Power Platform + Dataverse', '', 'State + connectors.', 'green')}
${cell('C4', 'Model layer', '', 'Azure OpenAI · PAYG or fixed capacity.', 'green')}
${cell('C5', 'Knowledge sources', '', 'SharePoint · files · web · MCP · Dataverse.', 'green')}
${cell('C6', 'Governance + PPAC', '', 'DLP · environment strategy · agent inventory.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 architectural decisions', icon: '3', headlineHtml: 'Environment · auth · <em>knowledge sources</em>',
    blocks: [{ atStep: 1, html: card('3 ARCHITECTURAL DECISIONS AT THE START', 'Make these deliberately', ['<strong>Decision 1 — environment strategy.</strong> Dev · test · prod minimum. Per-project vs shared. <em>Wrong → ALM becomes painful.</em>', '<strong>Decision 2 — auth + authz.</strong> User auth · agent-to-API auth · knowledge source permissions. <em>Wrong → security incident.</em>', '<strong>Decision 3 — knowledge source pattern.</strong> Centralised governed vs agent-team-owned. <em>Wrong → knowledge sprawl.</em>']) }] },
  { type: 'content', eyebrow: 'Governance from day one', icon: '4', headlineHtml: 'DLP · auth · <em>sensitivity labels</em>',
    blocks: [
      { atStep: 1, html: card('GOVERNANCE TOUCHPOINTS · DAY ONE', 'Not phase two', ['<strong>DLP policies.</strong> Define what connectors can be used in what environments <em>before</em> makers build anything.', '<strong>Authentication.</strong> Decide delegated (user identity) vs application (service identity) at architecture time.', '<strong>Sensitivity labels.</strong> Agents respect Microsoft Information Protection labels. <em>Add at the start, not after.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Map your 6 components on one page', ['For each: owner · admin · failure mode. <strong>That map = architecture brief.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Topics vs generative · <em>4-question framework + topic explosion</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Stack · 6 components · 3 decisions · governance day one.', '<strong>Next:</strong> 4-question framework · topic-explosion anti-pattern · the hybrid pattern.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Topic design vs generative answers' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-topics-vs-generative.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · DETERMINISTIC vs VARIABLE', h1Html: '4-question framework · <em>topic-explosion anti-pattern</em>', subtitleHtml: '<strong>Production agents converge to the hybrid pattern. Not pure-topic, not pure-generative.</strong>' },
  { type: 'content', eyebrow: '4-question framework', icon: '1', headlineHtml: 'Deterministic · compliance · small set · <em>frequency</em>',
    blocks: [{ atStep: 1, html: card('4-QUESTION DECISION FRAMEWORK · PER INTENT', 'Topic or generative?', ['<strong>Q1 — deterministic answer?</strong> "How do I file expenses" has one canonical answer → topic. "What\'s the latest sales analysis" varies → generative.', '<strong>Q2 — compliance requirements?</strong> Legal · HR · regulatory need controlled phrasing → topic with reviewed text.', '<strong>Q3 — small known set?</strong> 5 product categories → topic with 5 branches. Hundreds of policy docs → generative on knowledge source.', '<strong>Q4 — frequent change?</strong> Yes → generative. Topic maintenance becomes the bottleneck.']) }] },
  { type: 'content', eyebrow: 'Topic explosion · anti-pattern', icon: '!', iconRed: true, headlineHtml: 'Recognition · maintenance · <em>trigger overlap</em>',
    blocks: [{ atStep: 1, html: cardRed('TOPIC-EXPLOSION ANTI-PATTERN', 'Most teams hit it by their 20th topic', ['<strong>1. Recognition degradation.</strong> More trigger phrases to disambiguate → accuracy drops.', '<strong>2. Maintenance fatigue.</strong> Every topic = hand-built artifact. 20 topics = 20 burdens.', '<strong>3. Trigger overlap.</strong> "Reset password" vs "I can\'t log in" → non-deterministic routing.'], '<strong>When you hit 20 topics:</strong> stop · audit · convert deterministic ones to generative + knowledge source.') }] },
  { type: 'content', eyebrow: 'The hybrid pattern', icon: '2', headlineHtml: 'Topics + generative · <em>where production converges</em>',
    blocks: [{ atStep: 1, html: card('THE HYBRID PATTERN', 'What mature agents converge to', ['<strong>Topics for:</strong> compliance-controlled answers · transactional flows · escalation paths · common deterministic FAQs.', '<strong>Generative for:</strong> variable questions · knowledge-source-grounded answers · exploratory queries.', '<strong>Routing:</strong> small set of high-confidence topics · fallback to generative grounded in knowledge sources.'], 'Production agents end here. <em>Not pure-topic, not pure-generative.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Topic count · <em>generative source coverage</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TOPIC vs GENERATIVE', '2 questions', ['<strong>Q1:</strong> topic count in busiest agent? <15 green · 15-25 amber · <strong>>25 red — topic explosion</strong>.', '<strong>Q2:</strong> generative answer source coverage? Curated reviewed green · mixed amber · <strong>unvetted web red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit one agent', ['Topic count · recognition rate · generative source coverage? <strong>That audit = refactor priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Plugins · connectors · <em>4-component auth model</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '4-question framework · topic explosion · hybrid pattern · scoring.', '<strong>Next:</strong> 3 connector patterns · 4-component auth · 3 production failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Plugins and connectors at production scale' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-plugins-connectors.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · AUTH + FAILURE MODES', h1Html: '3 connector patterns · 4-component auth · <em>3 failure modes</em>', subtitleHtml: '<strong>Every connector: explicit error handling · retry logic · timeout · circuit breaker.</strong>' },
  { type: 'content', eyebrow: '3 connector patterns', icon: '1', headlineHtml: 'First-party · certified third-party · <em>custom</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'First-party', '', 'M365 · Dataverse · SharePoint · Outlook. <strong>Fully supported. Included in licensing.</strong>', 'green')}
${cell('P2', 'Certified third-party', '', 'ServiceNow · Salesforce · SAP · Workday. <strong>Vendor-built · MS-certified. Premium licensing.</strong>', 'green')}
${cell('P3', 'Custom connectors', '', 'Your LOB APIs. OpenAPI definition · auth · methods. <strong>You own maintenance.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '4-component auth model', icon: '!', iconRed: true, headlineHtml: 'User · agent-to-connector · scope · <em>data permissions</em>',
    blocks: [{ atStep: 1, html: cardRed('4-COMPONENT AUTH MODEL', 'Get one wrong = security incident', ['<strong>1. User authentication.</strong> Teams identity · web SSO · custom.', '<strong>2. Agent-to-connector auth.</strong> Delegated (user identity) vs application (service identity).', '<strong>3. Connector-level permissions.</strong> Which API scopes. <em>Least-privilege.</em>', '<strong>4. Data-level permissions.</strong> RLS in Dataverse · RBAC in target systems.']) }] },
  { type: 'content', eyebrow: '3 production failure modes', icon: '!', iconRed: true, headlineHtml: 'Errors · rate limits · <em>latency variance</em>',
    blocks: [{ atStep: 1, html: cardRed('3 PRODUCTION FAILURE MODES', 'Predictable. Test for them.', ['<strong>1. Connector errors.</strong> API down · auth expires · schema changes. <em>Agent doesn\'t handle gracefully → user-facing failure.</em>', '<strong>2. Rate limits.</strong> Throttles at concurrent load. <em>Agent times out → user retries → worse.</em>', '<strong>3. Latency variance.</strong> P50 fine. P95 catastrophic. <em>User experience varies wildly.</em>'], '<strong>Production discipline:</strong> every connector has explicit error handling · retry logic · timeout · circuit breaker.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '2', headlineHtml: 'Error handling · <em>rate limit testing</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CONNECTORS', '2 questions', ['<strong>Q1:</strong> every connector has explicit error handling? All green · most amber · <strong>some/none red</strong>.', '<strong>Q2:</strong> rate limit testing done pre-prod? Yes green · vendor docs only amber · <strong>no red — production surprise waiting</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List every connector your agents use', ['For each: first/third/custom · auth · error handling? <strong>Gaps = hardening priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Agents + agent flows · <em>state isolation under load</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 patterns · 4-component auth · 3 failure modes · scoring.', '<strong>Next:</strong> what makes it an agent · 3 orchestration patterns · concurrent-load testing.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Agents and agent flows' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-agents-flows.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · STATE + REASONING + TOOLS', h1Html: '3 differences · 3 orchestration patterns · <em>concurrent-load test</em>', subtitleHtml: '<strong>State isolation under load is where most agents fail in production.</strong>' },
  { type: 'content', eyebrow: '3 differences', icon: '1', headlineHtml: 'State · reasoning · <em>tool composition</em>',
    blocks: [{ atStep: 1, html: card('3 DIFFERENCES THAT SEPARATE AGENT FROM CHATBOT', '', ['<strong>1. State.</strong> Agent remembers context across turns. <em>Last filter · last entity · last decision.</em>', '<strong>2. Reasoning.</strong> Agent plans multi-step. <em>"To file expense: check policy · validate receipt · route for approval."</em>', '<strong>3. Tool composition.</strong> Agent invokes multiple tools to reach a goal. <em>Not one fixed flow per topic.</em>'], 'Topic-based chatbot has none. <strong>An agent has all three.</strong>') }] },
  { type: 'content', eyebrow: '3 orchestration patterns', icon: '2', headlineHtml: 'Q&A · transactional · <em>research</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('O1', 'Q&A', '', 'User asks. Agent retrieves grounded answer. <strong>Single-tool · single-turn.</strong> Most common starting point.', 'green')}
${cell('O2', 'Transactional', '', 'User initiates workflow. Agent orchestrates multi-tool to complete. <strong>File expense · create ticket · update record.</strong>', 'green')}
${cell('O3', 'Research', '', 'Open question. Agent queries · refines · synthesises. <strong>Multi-turn · multi-source.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'State isolation under load', icon: '!', iconRed: true, headlineHtml: 'User A\'s context leaks into User B · <em>security incident</em>',
    blocks: [{ atStep: 1, html: cardRed('STATE ISOLATION TESTED UNDER CONCURRENT LOAD', 'Where most agents fail in production', ['In dev: one user. In production: hundreds concurrent.', '<strong>State isolation failure mode:</strong> User A\'s context leaks into User B\'s session. <em>Security incident. Trust failure.</em>'], '<strong>Discipline:</strong> concurrent-load test with multiple synthetic users. User-specific data should never appear in another user\'s response. <em>Test this explicitly before launch.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'State isolation tested · <em>orchestration matches use case</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AGENT DESIGN', '2 questions', ['<strong>Q1:</strong> state isolation tested under concurrent load pre-launch? Yes green · single-user only amber · <strong>no red — security incident waiting</strong>.', '<strong>Q2:</strong> orchestration pattern matches use case? Intentionally yes green · default-applied amber · <strong>mismatched red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one production agent', ['Map orchestration. Run 20-user concurrent test. <strong>Watch for state leakage.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Knowledge · MCP · <em>Dataverse grounding</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 differences · 3 orchestration patterns · concurrent-load · scoring.', '<strong>Next:</strong> 3 knowledge source types · MCP discipline · Dataverse 4-check.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Knowledge sources, MCP, and Dataverse' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-knowledge-mcp-dataverse.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · WHERE AGENTS DIFFERENTIATE', h1Html: '3 source types · MCP discipline · <em>Dataverse 4-check</em>', subtitleHtml: '<strong>Curated governed sources beat "let it search anything" every time. Precision is the problem, not recall.</strong>' },
  { type: 'content', eyebrow: '3 knowledge source types', icon: '1', headlineHtml: 'Built-in · uploaded · <em>connected systems</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Built-in sources', '', 'SharePoint sites · OneDrive files · public web. <strong>Easiest starting point.</strong>', 'green')}
${cell('T2', 'Uploaded files', '', 'PDFs · Word · structured data. <strong>Useful for curated knowledge.</strong>', 'green')}
${cell('T3', 'Connected systems via MCP/Dataverse', '', 'Live system data. <strong>Required for transactional agents.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'MCP integration', icon: '2', headlineHtml: 'Scope-down · observability · <em>versioning</em>',
    blocks: [{ atStep: 1, html: card('MCP INTEGRATION DISCIPLINE', 'How agents reach beyond Microsoft\'s ecosystem', ['<strong>Per-agent scope-down.</strong> Don\'t give every agent access to every MCP server.', '<strong>Observability.</strong> Log every MCP tool call — server · method · args · returned. Production debugging depends on it.', '<strong>Versioning.</strong> MCP servers evolve. Version your agent\'s integration. <em>Don\'t track latest.</em>']) }] },
  { type: 'content', eyebrow: 'Dataverse 4-check', icon: '!', iconRed: true, headlineHtml: 'RLS · roles audit · field-level · <em>cross-role test</em>',
    blocks: [{ atStep: 1, html: cardRed('DATAVERSE GROUNDING · 4 PRODUCTION-READINESS CHECKS', 'Where data leak risk lives', ['<strong>1. Row-level security configured and tested.</strong> User A\'s data invisible to User B. <em>Test as different users before launch.</em>', '<strong>2. Security roles audit.</strong> Which roles have read access to the tables the agent queries? <em>Audit the roles, not just the data.</em>', '<strong>3. Field-level security.</strong> Sensitive fields (compensation · SSN · PII) should never reach the agent.', '<strong>4. Cross-role test before launch.</strong> Test as manager · IC · executive. <em>Behaviour should match each role\'s access.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Cross-role test · <em>MCP logging</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE KNOWLEDGE GROUNDING', '2 questions', ['<strong>Q1:</strong> Dataverse-grounded agents tested cross-role pre-launch? Yes systematically green · informally amber · <strong>no red — data leak risk</strong>.', '<strong>Q2:</strong> MCP tool calls logged for production debugging? Yes green · partial amber · <strong>no red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one Dataverse-grounded agent', ['Run cross-role test. <strong>Watch for inappropriate data appearing in any role\'s responses.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Deployment · ALM · <em>environments</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 source types · MCP discipline · Dataverse 4-check · scoring.', '<strong>Next:</strong> 3-environment path · 3 solution rules · 3 pipeline patterns.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Deployment, ALM, and environments' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-deployment-alm.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · WHERE DISCIPLINE LIVES', h1Html: '3-environment path · 3 solution rules · <em>3 pipeline patterns</em>', subtitleHtml: '<strong>Code promotes via managed solutions in pipelines. Makers don\'t build directly in prod.</strong>' },
  { type: 'content', eyebrow: '3-environment path', icon: '1', headlineHtml: 'Dev · test · <em>prod</em>',
    blocks: [{ atStep: 1, html: card('3-ENVIRONMENT PROMOTION PATH', 'Production discipline', ['<strong>Dev:</strong> makers build · iterate · break · fix. Unmanaged solution. Frequent change.', '<strong>Test:</strong> promoted from dev. Integration tested. Managed solution. Read-only to makers.', '<strong>Prod:</strong> promoted from test. End users. Managed solution. Locked down.'], '<strong>What works:</strong> code promotes via managed solutions in pipelines. <strong>What doesn\'t:</strong> makers building directly in prod. <em>Production builds = how outages happen.</em>') }] },
  { type: 'content', eyebrow: '3 solution rules', icon: '2', headlineHtml: 'One agent per solution · managed test/prod · <em>semantic versioning</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('R1', 'One agent per solution', '', 'Don\'t bundle three agents. <strong>Deploy everything or nothing.</strong>', 'green')}
${cell('R2', 'Managed in test + prod', '', 'Unmanaged = makers change directly. <strong>Managed enforces deploy-only.</strong>', 'green')}
${cell('R3', 'Semantic versioning', '', '1.2.3 · major-minor-patch. <strong>Track what\'s in each environment.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 pipeline patterns', icon: '3', headlineHtml: 'PP Pipelines · Azure DevOps · <em>GitHub Actions</em>',
    blocks: [{ atStep: 1, html: card('3 PIPELINE PATTERNS MATCHED TO SCALE', 'Don\'t over-engineer', ['<strong>1. Power Platform Pipelines.</strong> Built-in. Dev → test → prod with one-click promotion. <em>Best for small teams.</em>', '<strong>2. Azure DevOps + PP Build Tools.</strong> CI/CD integration · PRs · automated tests. <em>Best for medium-scale, ITSM-integrated orgs.</em>', '<strong>3. GitHub Actions or third-party.</strong> Orgs standardising on non-Microsoft DevOps. Same Build Tools, different runner.'], 'Match pattern to team scale + existing tooling. <em>Don\'t over-engineer for a 2-agent estate.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'Pipelines · <em>versioning</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DEPLOYMENT + ALM', '2 questions', ['<strong>Q1:</strong> agents promoted via pipelines (not edited directly in prod)? Yes green · sometimes amber · <strong>no/prod-direct red</strong>.', '<strong>Q2:</strong> every deployable change has solution version + change log? Yes green · informal amber · <strong>no red — debugging will be painful</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit top 3 production agents', ['Solution versioning · managed status · last-edited-where? <strong>Direct prod edits = top fix.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Governance · <em>monitoring at scale</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3-env path · 3 solution rules · 3 pipeline patterns · scoring.', '<strong>Next:</strong> 3 governance layers · 5 monitoring signals · 3 estate rhythms.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Governance and monitoring at scale' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-governance-monitoring.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · ESTATES COMPOUND OR SHADOW-IT', h1Html: '3 layers · 5 signals · <em>3 rhythms</em>', subtitleHtml: '<strong>Without all three layers, estate becomes unmanageable. Audit fails. Sensitive data leaks.</strong>' },
  { type: 'content', eyebrow: '3 governance layers', icon: '1', headlineHtml: 'Tenant · environment · <em>per-agent</em>',
    blocks: [{ atStep: 1, html: card('3 GOVERNANCE LAYERS', 'All three required', ['<strong>1. Tenant governance.</strong> DLP policies · environment strategy · licensing model. <em>Set by Power Platform admin team.</em>', '<strong>2. Environment governance.</strong> Per-env maker roles · security roles · data policies. <em>Set by environment admin.</em>', '<strong>3. Per-agent governance.</strong> Each agent has clear owner · clear use case · clear retention plan. <em>Set by agent owner.</em>']) }] },
  { type: 'content', eyebrow: '5 monitoring signals', icon: '2', headlineHtml: 'Usage · recognition · success · cost · <em>feedback</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Usage', '', 'Sessions/day · users/week. <strong>Actually used?</strong>', 'green')}
${cell('S2', 'Recognition rate', '', 'Topic match vs fallback to generative. <strong>Falling = topic refactor needed.</strong>', 'green')}
${cell('S3', 'Action success rate', '', 'Of attempted, what completed? <strong><80% = reliability issue.</strong>', 'green')}
${cell('S4', 'Cost', '', 'Token consumption · connector calls · capacity. <strong>Chargeback + right-sizing.</strong>', 'green')}
${cell('S5', 'User feedback', '', 'Thumbs · satisfaction. <strong>Trend matters more than absolute.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 estate rhythms', icon: '3', headlineHtml: 'Weekly · quarterly · <em>annual</em>',
    blocks: [{ atStep: 1, html: card('3 ESTATE-MANAGEMENT RHYTHMS', 'Without them: estate sprawls', ['<strong>Weekly:</strong> top-5 agents reviewed. Usage · satisfaction · cost. Anomalies investigated.', '<strong>Quarterly:</strong> full estate review. Agents below usage threshold sunset. New requests reviewed.', '<strong>Annual:</strong> governance policy review · DLP refresh · licensing audit · strategy reset.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '4', headlineHtml: 'Owner of record · 5 signals · <em>quarterly review</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE GOVERNANCE + MONITORING', '3 questions', ['<strong>Q1:</strong> every production agent has owner of record? All green · most amber · <strong>some/none red</strong>.', '<strong>Q2:</strong> 5 signals tracked weekly on top agents? Yes green · partial amber · <strong>no red — production blind</strong>.', '<strong>Q3:</strong> quarterly estate review actually happens? Yes green · sporadic amber · <strong>no red — sprawl in progress</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull agent inventory from Power Platform admin centre', ['For each: owner · last-used · signal status. <strong>Orphan agents = first cleanup.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Design doc · 12-item gate · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '3 layers · 5 signals · 3 rhythms · scoring.', '<strong>Last chapter:</strong> design doc · 12-item production gate · interactive builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={agent:'',orch:'',auth:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='copilot-studio-agent-design.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var a=state.agent||'_(pick agent type)_';var o=state.orch||'_(pick orchestration)_';var au=state.auth||'_(pick auth model)_';return '# Copilot Studio · Production Agent Design Document\\n\\n**Agent owner:** ____________________\\n**Start date:** ____________________\\n\\n## Section 1 — Use case + scope\\n> '+a+'\\n\\n## Section 2 — Orchestration pattern\\n> '+o+'\\n\\n## Section 3 — Authentication model\\n> '+au+'\\n\\n## 12-Item Production Gate (yes/no)\\n### Architecture (1-4)\\n- [ ] Solution managed in test + prod\\n- [ ] Versioning in place\\n- [ ] Environment promotion path documented\\n- [ ] Concurrent-load tested\\n\\n### Security (5-8)\\n- [ ] DLP applied\\n- [ ] Auth model documented\\n- [ ] Data permissions tested cross-role\\n- [ ] Sensitive fields scoped out (field-level security)\\n\\n### Operations (9-12)\\n- [ ] Owner of record assigned\\n- [ ] 5 monitoring signals tracked\\n- [ ] Incident runbook drafted\\n- [ ] Sunset criteria written\\n\\n*12 yes = production-ready. Anything less = not yet.*\\n\\n---\\nSource: Gennoor Academy · Building AI Agents with Copilot Studio\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Production-grade Copilot Studio agent' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · PRODUCTION-GRADE', h1Html: 'Design doc · 12-item gate · <em>the builder</em>', subtitleHtml: '<strong>Production-grade is not feature-complete plus deploy. It\'s the discipline that survives concurrent users, schema changes, and audits.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Discipline · <em>not feature-complete + deploy</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Production-grade defined', ['Production-grade is not feature-complete + deploy. <strong>It\'s the discipline that makes the agent survive concurrent users, schema changes, and quarterly audits.</strong>']) }] },
  { type: 'content', eyebrow: '3-section design doc', icon: '2', headlineHtml: 'Use case · architecture · <em>production readiness</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Use case + scope', '', 'What problem · what user · success looks like. <strong>In writing.</strong>')}
${cell('S2', 'Architecture', '', '6 components mapped · 3 decisions made · auth flow diagrammed. <strong>Reviewed by architecture.</strong>', 'amber')}
${cell('S3', 'Production readiness', '', '12-item gate completed. <strong>Signed by owner.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '12-item gate', icon: '3', headlineHtml: '4 architecture · 4 security · <em>4 operations</em>',
    blocks: [{ atStep: 1, html: card('12-ITEM PRODUCTION GATE', 'Each = yes/no · no partial passes', ['<strong>Architecture (1-4):</strong> solution managed · versioning · environment path · concurrent-load tested.', '<strong>Security (5-8):</strong> DLP · auth documented · permissions cross-role tested · sensitive fields scoped out.', '<strong>Operations (9-12):</strong> owner assigned · 5 signals tracked · incident runbook · sunset criteria written.'], '<strong>12 yes = production-ready. Anything less = not yet.</strong>') }] },
  { type: 'content', eyebrow: 'Interactive · build your design doc', icon: '✓', headlineHtml: 'Agent · orchestration · auth · <em>take to architecture review</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Agent type / use case</h5><div class="preset" data-group="agent">
<button data-val="HR self-service agent — policy Q&A + leave request workflows">HR self-service</button>
<button data-val="IT helpdesk agent — incident triage + knowledge-base lookup + escalation">IT helpdesk</button>
<button data-val="Sales enablement agent — competitive intel + objection handling + quote generation">Sales enablement</button>
<button data-val="Field service agent — equipment troubleshooting + parts lookup + job dispatch">Field service</button>
</div></div>
<div class="group"><h5>Primary orchestration pattern</h5><div class="preset" data-group="orch">
<button data-val="Q&A grounded in curated knowledge sources (SharePoint + uploaded files)">Q&A grounded</button>
<button data-val="Transactional via Dataverse + custom connectors (multi-step workflows)">Transactional</button>
<button data-val="Research synthesis across multiple knowledge sources + MCP servers">Research synthesis</button>
</div></div>
<div class="group"><h5>Authentication model</h5><div class="preset" data-group="auth">
<button data-val="Delegated user identity (agent acts as the user)">Delegated</button>
<button data-val="Application identity (agent acts as a service principal)">Application</button>
<button data-val="Hybrid — delegated for read · application for writes via audit-logged service principal">Hybrid delegated+app</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my agent design doc (.md)</button>
</div>
<div class="preview" id="preview"># Copilot Studio · Production Agent Design Document

Pick agent type, orchestration, and auth on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Stack · 6 components · 3 decisions · hybrid · production discipline',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Copilot Studio is a stack. Six components. Three architectural decisions at the start. Topic + generative hybrid. Production discipline on connectors, agents, knowledge, deployment, governance, monitoring.</h2><p>That\'s eight chapters. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your first production agent type, orchestration pattern, and auth model.</div><div class="row"><span class="arr">→</span>Get architecture review on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 34 chapters 1-8 built.')
