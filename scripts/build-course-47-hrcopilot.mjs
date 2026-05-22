// Course 47 — Building an HR Copilot Case Study (Emma · applied track)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Case Study · Building an HR Copilot'
const OUT = 'tmp/academy-build/building-an-hr-copilot-case-study/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The starting situation' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-use-case.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · BORING USE CASE SHIPPED WELL', h1Html: 'Impact × feasibility filter · <em>3 use cases consciously skipped</em>', subtitleHtml: '<strong>Picked HR onboarding Q&A over recruiting AI. That\'s what shipped.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: '5,000 employees · CHRO budget · CIO platform · <em>picked the boring one</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE · A REAL BUILD', 'Mid-sized enterprise · India · GCC · SEA', ['5,000 employees. HR wanted an AI feature · CHRO budget · CIO platform.', '<strong>Temptation:</strong> pick the exciting use case. Recruiting AI · performance review summarisation · engagement prediction.', '<strong>Decision:</strong> pick the boring one that mattered. HR onboarding Q&A. <em>That\'s what shipped. That\'s what survived past week 4.</em>']) }] },
  { type: 'content', eyebrow: 'Impact × feasibility filter', icon: '2', headlineHtml: 'High impact + high feasibility · <em>ship</em>',
    blocks: [{ atStep: 1, html: card('THE FILTER THE TEAM USED', 'Matrix-based selection', ['<strong>Impact.</strong> Pain removed — tickets avoided · new-hire time-to-productivity · manager hours.', '<strong>Feasibility.</strong> Data available · permissions clear · stack supports · stakeholders aligned.'], '<strong>HR onboarding Q&A scored high+high.</strong> Repetitive questions · clean policy docs · existing Copilot Studio license · CHRO sponsor.') }] },
  { type: 'content', eyebrow: '3 consciously skipped', icon: '!', iconRed: true, headlineHtml: 'Recruiting · performance review · <em>engagement prediction</em>',
    blocks: [{ atStep: 1, html: cardRed('3 USE CASES THE TEAM CONSCIOUSLY SKIPPED', '', ['<strong>1. Recruiting AI.</strong> High impact but feasibility failed. Bias risk · legal review · candidate-facing · regulatory nuance. <em>Not a first project.</em>', '<strong>2. Performance review summarisation.</strong> Mid impact · politically sensitive. <em>Defer to year 2.</em>', '<strong>3. Engagement prediction.</strong> High impact in theory · very low feasibility. Survey data quality varied. <em>Confident-but-wrong is worse than nothing.</em>'], '<strong>Discipline of saying no.</strong> Saved the project from scope creep killing the first ship.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Documented filter · <em>skipped list documented</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE USE CASE SELECTION', '2 questions', ['<strong>Q1:</strong> applied impact × feasibility, or picked the exciting? Documented filter green · informal amber · <strong>most exciting red — scope creep ahead</strong>.', '<strong>Q2:</strong> consciously listed use cases you\'re skipping with reasons? Yes documented green · partial amber · <strong>no red — temptation will resurface</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List your shortlist of HR (or other) AI use cases', ['Apply impact × feasibility. <strong>Skipped list matters as much as picked list.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Stack Fit Assessment · <em>Azure OpenAI + Copilot Studio + Dataverse</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Boring shipped well · impact×feasibility · 3 skipped.', '<strong>Next:</strong> 3-layer fit · integration gotchas at pilot scale.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Stack Fit Assessment' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-stack.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · MODEL + ORCHESTRATION + DATA', h1Html: '3-layer fit · 3 integration gotchas · <em>"why not" alternatives</em>', subtitleHtml: '<strong>Integration gotchas show up only at pilot scale. Plan capacity testing in.</strong>' },
  { type: 'content', eyebrow: '3-layer fit', icon: '1', headlineHtml: 'Model · orchestration · <em>data</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('L1', 'Model layer', '', 'Azure OpenAI · GPT-4o primary · text-embedding-3-large for policy doc embeddings.', 'green')}
${cell('L2', 'Orchestration layer', '', 'Copilot Studio. <strong>Topics for deterministic flows · generative answers for policy questions.</strong>', 'green')}
${cell('L3', 'Data layer', '', 'Dataverse for HRIS (profile · manager · location · entitlements) · SharePoint for policy docs.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 integration gotchas', icon: '!', iconRed: true, headlineHtml: 'Identity race · RLS scale · <em>SharePoint throttling</em>',
    blocks: [{ atStep: 1, html: cardRed('3 INTEGRATION GOTCHAS AT PILOT SCALE', 'All predictable · plan capacity testing in', ['<strong>1. Identity flow.</strong> Copilot Studio auth into Dataverse via OBO token. Demo fine. Pilot users hit token-refresh race conditions. 2 days to root-cause.', '<strong>2. Dataverse RLS scale.</strong> Tested with 5 users worked. Tested with 500 surfaced per-query latency spike. Index strategy updated.', '<strong>3. SharePoint connector throttling.</strong> SP search API rate limits. 50 concurrent users hit throttle. Cache layer added.']) }] },
  { type: 'content', eyebrow: 'Why not alternatives', icon: '2', headlineHtml: 'Pure Azure OpenAI · PVA legacy · <em>third-party</em>',
    blocks: [{ atStep: 1, html: card('WHY NOT OTHER STACKS FOR THIS CASE', 'Stack Fit specific to MS 365 + D365 footprint', ['<strong>Pure Azure OpenAI Service.</strong> Without Copilot Studio, build orchestration yourselves. 4-6 weeks · not differentiated.', '<strong>Power Virtual Agents legacy.</strong> Deprecated in favour of Copilot Studio. Wouldn\'t be long-term supported.', '<strong>Third-party (Zendesk · ServiceNow + AI).</strong> Existing licenses but no HRIS integration. Cost + integration exceeded Copilot Studio path.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Capacity testing at pilot scale · <em>"why not" documented</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE STACK FIT', '2 questions', ['<strong>Q1:</strong> capacity testing at pilot scale pre-rollout? Documented green · "we tested 5 users" amber · <strong>zero red — gotchas will surface</strong>.', '<strong>Q2:</strong> Stack Fit included "why not" for alternatives? Documented green · partial amber · <strong>no red — defaulted without comparing</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Walk your AI stack with IT architect', ['For each layer, what\'s the alternative? <strong>Comparison makes the choice defensible.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Architecture + grounding · <em>RLS + mixed patterns</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3-layer fit · 3 gotchas · "why not" discipline.', '<strong>Next:</strong> 2 grounding patterns · RLS cross-role · mixed queries.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Architecture and grounding' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-grounding.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · POLICY + HRIS · RLS CROSS-ROLE', h1Html: '2 grounding patterns · <em>mixing patterns in one query</em>', subtitleHtml: '<strong>Copilot answers only what the calling user is allowed to see. Tested as IC, manager, director, HR admin before launch.</strong>' },
  { type: 'content', eyebrow: '2 grounding patterns', icon: '1', headlineHtml: 'Policy doc grounding · <em>HRIS data grounding</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('P1', 'Policy doc grounding', '', 'Onboarding · leave · benefits · expense. <strong>SharePoint source · indexed via Azure AI Search · retrieved at query time.</strong>', 'green')}
${cell('P2', 'HRIS data grounding', '', 'Employee profile · manager · entitlements · accrued leave · location-specific. <strong>Dataverse source · queried at runtime · filtered by identity.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Row-level security', icon: '!', iconRed: true, headlineHtml: 'Tested cross-role · <em>before launch</em>',
    blocks: [{ atStep: 1, html: cardRed('ROW-LEVEL SECURITY · THE CRITICAL PATTERN', 'Without this: privacy incident waiting', ['<strong>Principle:</strong> copilot answers only what calling user can see in source systems.', '<strong>Implementation:</strong> Dataverse security roles propagated through Copilot Studio OBO auth. User context: front-end → Copilot Studio → Dataverse query. Dataverse applies security roles.', '<strong>Tested cross-role before launch.</strong> As IC · as manager · as director · as HR admin. Each role sees different data · answers different questions.'], '<strong>"Show me Priya\'s leave balance" can\'t be answered by anyone except Priya, her manager, and HR. Copilot must enforce this.</strong>') }] },
  { type: 'content', eyebrow: 'Mixing patterns', icon: '2', headlineHtml: '"Vacation left + carry-forward policy" · <em>both patterns in one query</em>',
    blocks: [{ atStep: 1, html: card('MIXING PATTERNS IN ONE QUERY · WHERE COPILOT FEELS INTELLIGENT', '', ['Hardest queries combine both patterns.', '<strong>Example:</strong> "How many days of vacation do I have left and what\'s the carry-forward policy?"', '<strong>"Days left"</strong> = HRIS data, user-specific.', '<strong>"Carry-forward policy"</strong> = policy doc.', 'Copilot orchestration: recognise both · query both sources · combine in one answer with citation.'], 'This is where Copilot Studio\'s topic + generative-answer hybrid shines. <strong>Topic handles HRIS · generative + retrieval handles policy. One response stitches them.</strong>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'RLS tested cross-role · <em>mixed queries handled</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE ARCHITECTURE + GROUNDING', '2 questions', ['<strong>Q1:</strong> RLS tested cross-role before launch? Systematically green · informally amber · <strong>no red — privacy incident risk</strong>.', '<strong>Q2:</strong> queries combining HRIS + policy handled in one answer? Yes green · separate handling amber · <strong>no/one-source-per-query red — feels broken</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick top 10 expected user queries', ['For each: HRIS-only · policy-only · or both. <strong>Distribution tells you architectural priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Conversation flow · <em>topic-explosion failure + hybrid pattern</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '2 grounding patterns · RLS · mixing.', '<strong>Next:</strong> 50-topic prototype failure · 5+1 hybrid that shipped.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Building the conversation flow' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-flow.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · HYBRID PATTERN · MULTILINGUAL', h1Html: 'Earlier prototype failed at 50 topics · <em>5 topics + generative shipped</em>', subtitleHtml: '<strong>Topic-explosion killed the first attempt. Hybrid shipped.</strong>' },
  { type: 'content', eyebrow: 'Earlier prototype failure', icon: '!', iconRed: true, headlineHtml: '50+ topics · recognition degradation · maintenance fatigue · <em>user frustration</em>',
    blocks: [{ atStep: 1, html: cardRed('THE EARLIER PROTOTYPE FAILURE', 'Topic-heavy · 50+ topics · one per common HR question', ['<strong>Worked in demo. Problems hit week 3 of build.</strong>', '<strong>Recognition degradation.</strong> Trigger phrases overlapped. "Leave" matched 8 topics. Disambiguation unreliable.', '<strong>Maintenance fatigue.</strong> HR submitted policy changes · each needed topic updates. 50 topics = 50 burdens.', '<strong>User frustration.</strong> "Tell me about parental leave" took 4 turns. Users dropped out.'], '<strong>Pivot:</strong> hybrid pattern · small set of topics for deterministic flows · generative grounded in policy docs for everything else.') }] },
  { type: 'content', eyebrow: 'Final structure shipped', icon: '1', headlineHtml: '5 topics · generative · <em>escalation</em>',
    blocks: [{ atStep: 1, html: card('THE FINAL STRUCTURE THAT SHIPPED', 'Manageable. Maintainable. Shipped.', ['<strong>5 topics — deterministic flows.</strong> Leave request · expense submission · address update · benefits enrollment · IT ticket escalation. Each is a workflow, not a Q&A.', '<strong>Generative answers — everything else.</strong> Grounded in indexed policy docs + Dataverse profile.', '<strong>Fallback to human.</strong> Defined criteria. Sensitive (compensation · termination · medical) escalate immediately. Confidence-low routes to HR concierge.'], 'Total: 5 topics + 1 generative answer system + 1 escalation path.') }] },
  { type: 'content', eyebrow: 'Multilingual handling', icon: '2', headlineHtml: 'English primary · Hindi · Arabic · <em>Tagalog</em>',
    blocks: [{ atStep: 1, html: card('MULTILINGUAL HANDLING · 5,000-EMPLOYEE WORKFORCE', 'India · GCC · SEA', ['<strong>Primary — English.</strong> Workforce-wide.', '<strong>Secondary — Hindi · Arabic · Tagalog.</strong> Significant populations.', '<strong>Approach.</strong> Single GPT-4o copilot. Language detection on input. Same retrieval against language-tagged policy chunks. Response in same language.', '<strong>Caveat.</strong> Quality varies. English best · Hindi + Arabic good · Tagalog acceptable but watched closely. <em>Eval set covered all 4 languages.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Hybrid pattern · <em>per-language eval</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FLOW DESIGN', '2 questions', ['<strong>Q1:</strong> bot uses hybrid pattern (small topics + generative + escalation)? Yes green · topic/generative-only amber · <strong>>20 topics red — explosion likely</strong>.', '<strong>Q2:</strong> multilingual workforce — quality tested per language? Per-language eval green · primary-only amber · <strong>no red — drifts in secondary languages</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Count your bot\'s topics today', ['If >15, that\'s the refactor backlog. <strong>Convert deterministic to generative + retrieval.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Evaluation + iteration · <em>weekly cycle caught 2 hallucinations</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Topic-explosion fail · hybrid shipped · multilingual.', '<strong>Next:</strong> eval set from tickets · weekly cycle · 2 hallucinations caught.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Evaluation and iteration' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-eval.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · WEEKLY CYCLE · 2 HALLUCINATIONS CAUGHT', h1Html: 'Eval set from real tickets · <em>fixes shipped pre-launch</em>', subtitleHtml: '<strong>Both hallucinations would have been customer-facing if shipped.</strong>' },
  { type: 'content', eyebrow: 'Eval set construction', icon: '1', headlineHtml: '150 queries · 4 languages · <em>from real HR tickets</em>',
    blocks: [{ atStep: 1, html: card('EVAL SET CONSTRUCTION FROM REAL TICKETS', '', ['<strong>Source.</strong> 6 months of HR ticket queries · anonymised.', '<strong>Sampling.</strong> 150 queries. Mix: leave · benefits · onboarding · policy Q&A · edge cases. 4 languages.', '<strong>Labelling.</strong> Each query → expected answer · source · escalation behaviour. Senior HR ops manager + build team together.', '<strong>Maintenance.</strong> 10-15 new queries weekly from pilot. Quarterly retirement of obsolete.']) }] },
  { type: 'content', eyebrow: 'Weekly iteration cycle', icon: '2', headlineHtml: 'Mon eval · Tue triage · Wed-Thu fixes · <em>Fri stage</em>',
    blocks: [{ atStep: 1, html: card('THE WEEKLY ITERATION CYCLE', '', ['<strong>Monday.</strong> Run full eval suite. Compare to baseline. Flag regressions.', '<strong>Tuesday.</strong> Triage. Build team + HR ops manager review. Real issues vs eval-noise.', '<strong>Wednesday-Thursday.</strong> Fixes. Prompts · indexes · topics · grounding.', '<strong>Friday.</strong> Re-run eval. Confirm fixes work. Stage for Monday release.'], 'This cadence caught 2 policy hallucinations in week 6 and week 9. <strong>Both would have been customer-facing if shipped.</strong>') }] },
  { type: 'content', eyebrow: '2 hallucinations caught', icon: '!', iconRed: true, headlineHtml: 'Leave carry-forward · <em>expense limits</em>',
    blocks: [{ atStep: 1, html: cardRed('THE 2 PRE-LAUNCH HALLUCINATIONS', '', ['<strong>1. Leave policy.</strong> User: "Can I carry forward 60 days?" Copilot: "Yes, up to 60." <em>Actual: 30 max.</em>', 'Root cause: outdated policy doc in SharePoint. Refresh hadn\'t propagated to search index.', 'Fix: daily re-indexing of changed SharePoint docs.', '<strong>2. Expense limits.</strong> User: "Max meal allowance for international travel?" Copilot answered with regional allowance for domestic travel.', 'Root cause: 2 policy docs with similar titles. Retrieval picked wrong one.', 'Fix: better chunk-level metadata. Region tags on policy chunks.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Real-query eval set · <em>weekly cycle running</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE EVAL + ITERATION', '2 questions', ['<strong>Q1:</strong> eval set built from real queries (not synthetic)? Mostly real green · mix amber · <strong>synthetic-only red — won\'t catch real failure modes</strong>.', '<strong>Q2:</strong> weekly iteration cycle through pilot? Consistently green · ad-hoc amber · <strong>no red — issues compound silently</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull 50 real HR ticket queries from last 3 months', ['Start of your eval set. <strong>Bigger evals from production sampling later.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Pilot rollout · <em>3 cohorts · kill criteria signed pre-launch</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Eval from tickets · weekly cycle · 2 hallucinations caught.', '<strong>Next:</strong> 3-cohort sequencing · 4 kill criteria · what actually happened.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Pilot rollout' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-pilot.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · 3 COHORTS · 4 WEEKS', h1Html: 'Kill criteria signed pre-launch · <em>what actually happened</em>', subtitleHtml: '<strong>4 kill criteria written down. Signed by HR + IT + Legal. Pre-pilot.</strong>' },
  { type: 'content', eyebrow: '3-cohort rollout', icon: '1', headlineHtml: 'W1 50 users · W2 300 · W3 1500 · <em>W4 decision</em>',
    blocks: [{ atStep: 1, html: card('THE 3-COHORT ROLLOUT SEQUENCE', 'Each cohort: clear goals · separate eval samples · weekly retros', ['<strong>Week 1 — cohort 1 (50 users).</strong> HR + IT champions. Internal users with high tolerance. Catch operational problems.', '<strong>Week 2 — cohort 2 (300 users).</strong> New hires across locations + languages. Real target audience. First production feedback.', '<strong>Week 3 — cohort 3 (1,500 users).</strong> Recent hires + tenured. Mixed expectations + edge cases.', '<strong>Week 4.</strong> Decision point. Expand to full 5,000 or pause for refinement.'], '<strong>Sequencing reduced blast radius if something went wrong.</strong>') }] },
  { type: 'content', eyebrow: '4 kill criteria', icon: '!', iconRed: true, headlineHtml: 'Satisfaction · hallucination · escalation overflow · <em>privacy incident</em>',
    blocks: [{ atStep: 1, html: cardRed('4 KILL CRITERIA AGREED BEFORE LAUNCH', 'Signed by HR + IT + Legal', ['<strong>1. User satisfaction.</strong> Avg rating <3.5/5 in any cohort = pause + investigate.', '<strong>2. Hallucination rate.</strong> >2% of responses flagged factually wrong = pause.', '<strong>3. Escalation overflow.</strong> >40% of conversations escalate to human = bot is failing.', '<strong>4. Privacy incident.</strong> Any RLS leak (user sees what they shouldn\'t) = immediate kill + investigation.'], '<strong>Written down. Signed. Pre-pilot.</strong> Not "we\'ll see how it goes."') }] },
  { type: 'content', eyebrow: 'What actually happened', icon: '2', headlineHtml: 'Cohort 1: bugs fixed · cohort 2: 1 policy edge · cohort 3: mixed · <em>W4 expand</em>',
    blocks: [{ atStep: 1, html: card('WHAT ACTUALLY HAPPENED', 'No kill criteria triggered · adoption sustained at 65% in week 8', ['<strong>Cohort 1.</strong> 2 operational bugs (auth race · cache invalidation). Fixed in 2 days. Satisfaction 4.1/5.', '<strong>Cohort 2.</strong> 1 policy edge case — contractor leave eligibility. Policy doc clarified. Satisfaction 4.0/5.', '<strong>Cohort 3.</strong> Mixed signals. Tenured less impressed (knew answers). New hires very satisfied. Overall 3.9/5.', '<strong>Week 4.</strong> Decision: expand. No kill criteria triggered. Adoption sustained at 65% of cohort 2 in week 8.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Cohorted with retros · <em>kill criteria signed pre-launch</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PILOT ROLLOUT', '2 questions', ['<strong>Q1:</strong> sequenced rollout with clear cohorts + weekly retros? Yes green · informal amber · <strong>all-at-once red — blast radius unmanaged</strong>.', '<strong>Q2:</strong> kill criteria signed pre-launch by HR + IT + Legal? Written + signed green · informal amber · <strong>no red — pilot continues even when failing</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'For your upcoming pilot, write the kill criteria', ['Get them signed by sponsors before week one. <strong>That\'s the discipline.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Adoption playbook · <em>past week 4 cliff</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3-cohort sequence · 4 kill criteria · what happened.', '<strong>Next:</strong> week-4 cliff · 4 interventions · 3 adoption signals.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Adoption playbook' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-adoption.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · WEEK-4 CLIFF · 4 INTERVENTIONS', h1Html: 'Sustaining usage past week 4 · <em>3 adoption signals</em>', subtitleHtml: '<strong>Plan adoption interventions for weeks 4-8 specifically. Most teams forget.</strong>' },
  { type: 'content', eyebrow: 'The week-4 cliff', icon: '!', iconRed: true, headlineHtml: 'W1-3 enthusiasm · <em>W4-5 dropoff</em>',
    blocks: [{ atStep: 1, html: cardRed('THE WEEK-4 CLIFF', 'Pattern most internal copilots hit', ['<strong>W1-3 enthusiasm. W4-5 dropoff.</strong>', '<strong>Cause:</strong> initial excitement fades. Users hit failure modes. They try Ctrl+F again, find faster results, drift back to old habit.'], '<strong>Discipline:</strong> plan interventions specifically for weeks 4-8. Most teams forget and treat adoption as a launch concern only.') }] },
  { type: 'content', eyebrow: '4 adoption interventions', icon: '1', headlineHtml: 'Weekly tips · manager toolkits · feature releases · <em>transparency</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('I1', 'Weekly tip emails', '', '"This week try X." Short · practical. <strong>To active users.</strong>', 'green')}
${cell('I2', 'Manager toolkits', '', 'Playbook for integrating copilot into team rituals — onboarding handover · 1:1 prep · benefits enrollment.', 'green')}
${cell('I3', 'Feature releases as engagement', '', 'Every 2 weeks · new capability shipped + communicated. <strong>Reason to come back.</strong>', 'green')}
${cell('I4', 'Failure-mode transparency', '', 'HR ops manager publicly acknowledged failures in town hall. <strong>Trust through honesty.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 adoption signals', icon: '2', headlineHtml: 'Repeat usage · question diversity · <em>manager referral</em>',
    blocks: [{ atStep: 1, html: card('3 ADOPTION SIGNALS THAT PREDICTED LONG-TERM SUCCESS', 'Better predictors than week-1 satisfaction', ['<strong>1. Repeat usage.</strong> Users returning within 7 days. W1: 70% · W4: 55% · W8: 50% sustained. Healthy.', '<strong>2. Question diversity.</strong> Range of question types. Started narrow (onboarding only). Widened to benefits · leave · expenses · policies. <em>Diversity proves users trust the bot for more.</em>', '<strong>3. Manager endorsement.</strong> Managers referring team members. Tracked via question source. <em>Manager-referred users had 3x higher retention.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'W4-8 interventions scheduled · <em>signals beyond usage</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE ADOPTION DISCIPLINE', '2 questions', ['<strong>Q1:</strong> interventions specifically for weeks 4-8? Yes scheduled green · informal amber · <strong>no red — cliff likely</strong>.', '<strong>Q2:</strong> tracking adoption signals beyond raw usage? Yes (repeat · diversity · referral) green · usage-only amber · <strong>no red — leading indicators invisible</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'For current/upcoming bot, draft weeks 4-8 plan', ['4 interventions on calendar. <strong>That\'s the cliff prevention.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Capstone · 5 lessons · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Week-4 cliff · 4 interventions · 3 signals.', '<strong>Last:</strong> 5 lessons · 4 trip-wires · build-plan builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={usecase:'',pattern:'',adoption:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='hr-copilot-build-plan.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var u=state.usecase||'_(pick starting use case)_';var p=state.pattern||'_(pick bot pattern)_';var ad=state.adoption||'_(pick adoption focus)_';return '# HR Copilot · Build Plan\\n\\n**Sponsor (CHRO):** ____________________\\n**IT lead:** ____________________\\n\\n## Starting use case\\n> '+u+'\\n\\n## Bot pattern\\n> '+p+'\\n\\n## Adoption focus\\n> '+ad+'\\n\\n## 5 lessons embedded\\n- [ ] Boring beats exciting (impact × feasibility)\\n- [ ] RLS tested cross-role before launch\\n- [ ] Hybrid topic + generative (avoid 50-topic trap)\\n- [ ] Weekly iteration cycle catches hallucinations\\n- [ ] Week 4-8 adoption interventions planned\\n\\n## 4 trust trip-wires\\n- Picking exciting over feasible (recruiting AI etc. as first project)\\n- No RLS testing cross-role (privacy incident risk)\\n- Topic-heavy bot (50+ topics = recognition degradation)\\n- Treating adoption as a launch concern only (week 4-8 cliff)\\n\\n---\\nSource: Gennoor Academy · HR Copilot Case Study\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Capstone — Lessons learned' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 5 LESSONS · 4 TRIP-WIRES · THE BUILDER', h1Html: 'Boring use case shipped well · <em>not exciting use case stalled</em>', subtitleHtml: '<strong>That\'s the case for the impact × feasibility filter.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Boring shipped well · <em>exciting stalled</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', '', ['<strong>This was a boring use case shipped well · rather than an exciting use case that stalled.</strong> That\'s the case for the impact × feasibility filter in chapter 1.']) }] },
  { type: 'content', eyebrow: '5 lessons', icon: '2', headlineHtml: 'Boring · RLS · hybrid · weekly iteration · <em>week 4-8 adoption</em>',
    blocks: [{ atStep: 1, html: card('5 LESSONS FROM THIS BUILD', '', ['<strong>1. Boring beats exciting.</strong> HR onboarding Q&A less glamorous than recruiting AI. Shipped. Recruiting AI would have stalled at legal review.', '<strong>2. RLS first.</strong> Tested cross-role before launch. <em>Avoided the privacy incident that would have killed the program.</em>', '<strong>3. Hybrid topic + generative.</strong> 5 deterministic topics + generative for everything else. 50 topics killed the earlier prototype.', '<strong>4. Weekly iteration cycle.</strong> Caught 2 hallucinations pre-launch. <em>Each would have been embarrassing in production.</em>', '<strong>5. Week 4-8 adoption interventions.</strong> Specifically planned. Sustained usage at 50% past week 8.']) }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Exciting over feasible · no RLS · topic-heavy · <em>adoption as launch concern</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Picking exciting over feasible', '', 'Recruiting AI classic trap. Save for after working pattern.', 'red')}
${cell('W2', 'No RLS testing cross-role', '', 'Privacy incident hidden in plain sight.', 'red')}
${cell('W3', 'Topic-heavy bot', '', '50+ topics = recognition degradation. Hybrid wins.', 'red')}
${cell('W4', 'Adoption as a launch concern only', '', 'Week 4-8 is where program lives or dies.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build-plan builder', icon: '✓', headlineHtml: 'Use case · pattern · adoption focus · <em>take to HR+IT kickoff</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting use case</h5><div class="preset" data-group="usecase">
<button data-val="HR onboarding Q&A (default for first build — high impact + high feasibility)">HR onboarding Q&A</button>
<button data-val="Benefits + policy Q&A (also high impact + high feasibility)">Benefits + policy Q&A</button>
<button data-val="Leave + expense workflow automation (more topic-heavy, manage scope)">Leave + expense automation</button>
<button data-val="Internal Service Desk (IT + HR combined — broader scope, longer timeline)">Internal Service Desk</button>
</div></div>
<div class="group"><h5>Bot pattern</h5><div class="preset" data-group="pattern">
<button data-val="Hybrid topic + generative (5 topics for workflows + generative for Q&A) — DEFAULT">Hybrid (5 topics + generative)</button>
<button data-val="Generative-first (no topics, all retrieval+generation) — for pure Q&A use cases">Generative-first</button>
<button data-val="Topic-led with limited generative (for highly deterministic workflows only)">Topic-led + limited generative</button>
</div></div>
<div class="group"><h5>Adoption focus</h5><div class="preset" data-group="adoption">
<button data-val="Manager toolkits + weekly tip emails (default working pattern)">Manager toolkits + weekly tips</button>
<button data-val="Feature release cadence (every 2 weeks new capability)">Feature release cadence</button>
<button data-val="Failure-mode transparency in town halls (high-trust orgs)">Failure-mode transparency</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my HR copilot build plan (.md)</button>
</div>
<div class="preview" id="preview"># HR Copilot · Build Plan

Pick use case, bot pattern, and adoption focus on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The case · in one breath', icon: '→', headlineHtml: 'Boring case · MS stack · RLS · hybrid · weekly iteration · 3-cohort pilot · <em>50% sustained usage</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF CASE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Real HR copilot. Boring use case shipped well. Azure OpenAI plus Copilot Studio plus Dataverse. Cross-role RLS tested before launch. Hybrid topic plus generative. Weekly iteration cycle that caught two hallucinations. Three-cohort four-week pilot with signed kill criteria. Week-4-to-8 adoption interventions. Fifty percent sustained usage.</h2><p>That\'s eight chapters in one breath. <em>That\'s the case.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your starting point.</div><div class="row"><span class="arr">→</span>Get HR + IT kickoff on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 47 chapters 1-8 built.')
