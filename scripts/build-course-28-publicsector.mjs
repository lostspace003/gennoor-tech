// Course 28 — AI for Public Sector & Government (Andrew)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Public Sector · AI for Government'
const OUT = 'tmp/academy-build/ai-for-public-sector/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The public-sector landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · CITIZENS ARE NOT CUSTOMERS', h1Html: '5 plays · 3 fail patterns · <em>regulatory frame</em>', subtitleHtml: '<strong>Citizens can\'t switch suppliers, exit the relationship, or refuse the service. That changes everything.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Serve the public · <em>accountable to it</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Citizens are not customers', ['Cannot easily switch suppliers. Cannot easily exit. Cannot easily refuse the service.', '<strong>Accountability, transparency, due process, equal treatment are not optional. They are the constraint within which government AI operates.</strong>']) }] },
  { type: 'content', eyebrow: '5 plays that ship', icon: '2', headlineHtml: 'Service delivery · case work · fraud · search · <em>translation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PLAY 1', 'Service delivery automation', '', 'Self-service · status · simple eligibility queries.', 'green')}
${cell('PLAY 2', 'Case work augmentation', '', 'Document review · summarisation · evidence prep. <strong>Humans decide. AI prepares.</strong>', 'green')}
${cell('PLAY 3', 'Fraud detection', '', 'Benefits · procurement · pattern detection. <strong>Human investigator in the loop.</strong>', 'amber')}
${cell('PLAY 4', 'Intelligent search', '', 'Records · regulation · precedent. Internal staff. <strong>Quiet, high value.</strong>', 'green')}
${cell('PLAY 5', 'Translation + accessibility', '', 'Multilingual services · accessible formats. <strong>Low-stakes auto · high-stakes human review.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 patterns that fail', icon: '!', iconRed: true, headlineHtml: 'Rights without review · chatbot misrep · <em>opaque AI</em>',
    blocks: [{ atStep: 1, html: cardRed('3 FAIL PATTERNS', 'Constitutional + statutory problems', ['<strong>1. Algorithmic decisions affecting rights without human review.</strong> Benefits denials · immigration · child welfare · criminal justice. Due process applies.', '<strong>2. Chatbots representing government without verification.</strong> Air Canada Moffatt cross-domain. Government chatbot mistakes = government commitments.', '<strong>3. Opaque AI in high-stakes contexts.</strong> Citizen can\'t understand decision → can\'t appeal it. <em>Black-box breaks due process. Period.</em>']) }] },
  { type: 'content', eyebrow: 'Regulatory frame', icon: '3', headlineHtml: 'OMB M-24-10 · EU AI Act · UK ATRS · <em>India DPDPA</em>',
    blocks: [
      { atStep: 1, html: card('REGULATORY FRAME', 'Government AI more constrained than commercial', ['<strong>US:</strong> OMB Memorandum M-24-10 · impact assessments · public inventory · accountability.', '<strong>EU:</strong> EU AI Act Art 6 + Annex III · many public uses high-risk · fundamental rights impact assessments.', '<strong>UK:</strong> GDS standards · Algorithmic Transparency Recording Standard.', '<strong>India:</strong> DPDPA 2023 · specific obligations on government as data fiduciary.'], '<strong>Common: government AI more constrained than commercial AI. And rightly so.</strong>') },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one citizen-facing AI initiative your agency is pursuing', ['Next 7 chapters give operational discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Service delivery · <em>where public AI quietly delivers most value</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Citizens are not customers · 5 plays · 3 fail patterns · regulatory frame.', '<strong>Next:</strong> 3 service delivery use cases · disclosure discipline · escalation path non-negotiable.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Service delivery automation' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-service-delivery.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · QUIETLY DELIVERS MOST VALUE', h1Html: '3 use cases · <em>disclosure + escalation</em>', subtitleHtml: '<strong>Reduces call centre load + improves citizen experience without crossing the decision-making line.</strong>' },
  { type: 'content', eyebrow: '3 use cases', icon: '1', headlineHtml: 'Status · orientation · <em>guided self-service</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Application status inquiry', '', 'Citizen wants to know where their application stands. AI looks up + returns clearly.', 'green')}
${cell('UC 2', 'Simple eligibility orientation', '', '"Am I likely eligible?" AI provides preliminary orientation. <strong>Not a determination.</strong>', 'green')}
${cell('UC 3', 'Guided self-service applications', '', 'Help citizens complete forms accurately. Reduce rework. Reduce frustration.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Disclosure discipline', icon: '2', headlineHtml: 'Plain language at start · <em>not buried in ToS</em>',
    blocks: [{ atStep: 1, html: card('THE DISCLOSURE DISCIPLINE', 'EU AI Act Art 50 · OMB M-24-10 · state-by-state US', ['Citizens must know they\'re interacting with AI.', '<strong>What works:</strong> plain language at the start. "You\'re talking to a virtual assistant. For complex questions or to talk to a person, type \'human\' or call our number."', '<strong>What doesn\'t:</strong> disclosure buried in ToS. <em>Hidden disclosure = no disclosure.</em>']) }] },
  { type: 'content', eyebrow: 'Escalation path · non-negotiable', icon: '!', iconRed: true, headlineHtml: '"Type human" at any time · <em>vulnerable populations prioritised</em>',
    blocks: [{ atStep: 1, html: cardRed('ESCALATION PATH · NON-NEGOTIABLE', 'AI cannot gate-keep access to humans', ['<strong>What works:</strong> "Type human at any time" or equivalent. Wait time published. Accessibility honoured. Vulnerable populations — elderly, disability, language barriers — get prioritised access.', '<strong>What fails:</strong> AI gate-keeping access to humans. "Try the assistant first" repeated. Citizens give up. <em>Eventually media story or class action.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Escalation time · accessibility · <em>disclosure rate</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SERVICE AI', '3 questions', ['<strong>Q1:</strong> escalation-to-human time when requested? <2 min green · 2-5 amber · <strong>>5 red — gating access</strong>.', '<strong>Q2:</strong> accessibility audit current? Yes current+tested green · documented but stale amber · not done red.', '<strong>Q3:</strong> disclosed-AI rate? Every interaction green · most amber · <strong>some hidden red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Try to escalate from your own chatbot to a human · time it', ['<strong>>2 min or feels like fighting the AI → that\'s the discipline gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Case work augmentation · <em>AI helps · humans decide</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 use cases · disclosure discipline · escalation non-negotiable · 3-question scoring.', '<strong>Next:</strong> document review · precedent search · the decision boundary that AI cannot cross.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Case work augmentation' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-case-work.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · AI HELPS · HUMANS DECIDE', h1Html: '3 use cases · <em>the decision boundary</em>', subtitleHtml: '<strong>Case workers make decisions affecting rights. AI summarises. Humans decide. Source verification required.</strong>' },
  { type: 'content', eyebrow: '3 case work use cases', icon: '1', headlineHtml: 'Document review · precedent · <em>completeness check</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Document review + summarisation', '', 'Case worker preparing for hearing. Hundreds of pages of evidence. AI summarises + indexes.', 'green')}
${cell('UC 2', 'Precedent search', '', 'Similar prior cases · relevant regulations. AI surfaces. <strong>Case worker evaluates.</strong>', 'green')}
${cell('UC 3', 'Initial form review', '', 'Application completeness check. Flagging missing info. <strong>Not eligibility determination — completeness only.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'The decision boundary', icon: '!', iconRed: true, headlineHtml: 'AI prepares · <em>humans decide on rights</em>',
    blocks: [{ atStep: 1, html: cardRed('THE DECISION BOUNDARY', 'Critical + non-negotiable', ['Case workers make decisions affecting rights. <strong>Benefits granted/denied · custody · permits · asylum.</strong> Constitutionally protected determinations subject to due process.', '<strong>AI assistance acceptable:</strong> AI summarises, locates, organises. Case worker reads source · applies judgement · makes decision.', '<strong>AI making decision: NOT acceptable for any matter touching rights or significant interests.</strong> Always a named human decision-maker who could explain the basis.'], '<strong>Mata cross-domain:</strong> case worker who relies on AI summary without checking sources risks acting on hallucinated content. <em>Verification is part of the work, not a skipped step.</em>') }] },
  { type: 'content', eyebrow: 'Transparency to citizens', icon: '2', headlineHtml: 'Right to know · <em>AI involvement disclosed</em>',
    blocks: [{ atStep: 1, html: card('TRANSPARENCY TO CITIZENS', 'Required in many jurisdictions · more coming', ['If AI assisted in case work, citizen has the right to know.', '<strong>What works:</strong> standard language in determination letter. "AI was used to summarise documents. The decision was made by a named case worker who reviewed the underlying records."', '<strong>What doesn\'t:</strong> hiding AI involvement. <em>If discovered later, undermines case file credibility. May invalidate the decision under emerging automated-decision-making laws.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Explanation without AI · <em>disclosure</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE CASE WORK AI', '2 questions', ['<strong>Q1:</strong> for AI-assisted determinations, case worker can explain basis without reference to AI? All yes green · mostly amber · <strong>honestly no for some red</strong>.', '<strong>Q2:</strong> AI involvement disclosed in determination letter where required? Yes green · sometimes amber · <strong>no/hidden red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sit with one case worker for an hour · watch them use AI assistance', ['Verifying source documents? Or accepting summaries on faith? <strong>That\'s your verification discipline.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Fraud detection · <em>pattern recognition + bias risk</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 use cases · decision boundary · transparency · 2-question scoring.', '<strong>Next:</strong> 2 fraud use cases · the bias risk · human investigator required · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Fraud detection' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-fraud.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · PATTERN RECOGNITION PAYS · BIAS RISKS LIVE', h1Html: '2 use cases · <em>bias audit non-negotiable</em>', subtitleHtml: '<strong>AI flag is not an accusation. AI flag = "look at this further." Human investigator decides.</strong>' },
  { type: 'content', eyebrow: '2 main use cases', icon: '1', headlineHtml: 'Benefits fraud · <em>procurement fraud</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('UC 1', 'Benefits fraud', '', 'Applications + claims patterns suggesting fraud. Unemployment · tax · social · healthcare programmes.', 'amber')}
${cell('UC 2', 'Procurement fraud', '', 'Bid patterns · supplier behaviour · collusion detection.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'The bias risk', icon: '!', iconRed: true, headlineHtml: 'Past investigation bias · <em>continues into AI</em>',
    blocks: [{ atStep: 1, html: cardRed('THE BIAS RISK', 'Substantial + well-documented', ['Fraud detection trained on historical investigations inherits past bias. <strong>Disproportionate investigation of certain populations → AI continues the disproportion.</strong>', 'Has produced public failures. Algorithmic systems flagging certain neighbourhoods, ethnicities, low-income communities for disproportionate investigation. Citizens harmed. Public trust damaged.'], '<strong>Discipline:</strong> pre-deployment fairness audit across protected categories · ongoing fairness monitoring · explicit review when flag rates differ significantly.') }] },
  { type: 'content', eyebrow: 'Human investigation required', icon: '2', headlineHtml: 'AI flag → human investigator → <em>appeal path</em>',
    blocks: [{ atStep: 1, html: card('HUMAN INVESTIGATION REQUIRED', 'AI flag is not an accusation', ['<strong>What works:</strong> AI flag → trained investigator reviews → determines whether evidence supports investigation → documents reasoning.', '<strong>What doesn\'t:</strong> AI flag treated as conclusive. Automated benefits suspension. Automated denial of payment to supplier. <em>Have produced legal challenges, regulatory action, public outcry.</em>'], '<strong>Pattern that works:</strong> AI flag → human investigator → documented determination → citizen notification with appeal path. Every step has accountability.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Bias audit · hit rate · <em>appeal path</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE FRAUD DETECTION', '3 questions', ['<strong>Q1:</strong> AI fraud detection audited for disparate impact across protected categories? Yes within last year green · >1yr amber · <strong>never red</strong>.', '<strong>Q2:</strong> % AI-flagged cases resulting in actionable fraud findings? >30% green · 10-30% amber · <strong><10% red — high false positive harming many for few real findings</strong>.', '<strong>Q3:</strong> documented appeal path for adverse action following fraud flag? Yes green · theoretically amber · <strong>no red — due process problem</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter fraud detection flag list', ['% that led to actionable findings? Compare flag rate across protected categories. <strong>Disproportionate flagging = bias signal.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Intelligent search · <em>internal AI that quietly helps</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '2 use cases · bias risk · human required · 3-question scoring.', '<strong>Next:</strong> 3 search use cases · source verification (Mata) · access controls.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Intelligent search + records' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-search.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · INTERNAL AI THAT QUIETLY HELPS', h1Html: '3 use cases · source verification · <em>access controls</em>', subtitleHtml: '<strong>Government holds vast records. Staff spends hours searching. AI-augmented search finds in minutes.</strong>' },
  { type: 'content', eyebrow: 'The records problem', icon: '1', headlineHtml: 'Vast records · <em>hours searching · minutes with AI</em>',
    blocks: [{ atStep: 1, html: card('THE INTERNAL RECORDS PROBLEM', 'Significant staff time savings', ['Government agencies hold vast records — regulations · precedent decisions · case files · reports · correspondence. Staff spend significant time searching.', '<strong>AI-augmented search:</strong> semantic search + citations to source documents. Staff find relevant precedent in minutes rather than hours.']) }] },
  { type: 'content', eyebrow: '3 intelligent search use cases', icon: '2', headlineHtml: 'Reg + policy · case history · <em>FOIA response</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Regulatory + policy search', '', 'Finding the relevant rule · guidance · prior decision.', 'green')}
${cell('UC 2', 'Case history search', '', '"Have we seen this kind of case? What did we decide?" Pattern matching across historical files.', 'green')}
${cell('UC 3', 'FOIA + records request response', '', 'Locating responsive documents. <strong>Faster fulfilment without compromising completeness.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Source verification requirement', icon: '!', iconRed: true, headlineHtml: 'Mata cross-domain · <em>directly applicable</em>',
    blocks: [{ atStep: 1, html: cardRed('SOURCE VERIFICATION REQUIREMENT', 'Mata cross-domain · directly', ['AI provides answers with citations. <strong>Staff must verify the citations point to real, current documents.</strong>', '<strong>Mata cross-domain:</strong> Schwartz used ChatGPT-generated case citations without verification. They were fabricated. Federal court sanctioned him. <em>Government staff face the same risk.</em>'], '<strong>Discipline:</strong> every cited source verified by staff before reliance. AI citation is a starting point, not a conclusion.') }] },
  { type: 'content', eyebrow: 'Access controls', icon: '2', headlineHtml: 'AI search respects · <em>existing role-based access</em>',
    blocks: [
      { atStep: 1, html: card('ACCESS CONTROLS', 'Critical when records contain PII', ['<strong>What works:</strong> AI search respects existing role-based access. Staff cannot see through AI what they cannot see directly. Audit logging of every search query + result.', '<strong>What doesn\'t:</strong> AI search bypasses access controls "for efficiency." Privacy breach waiting to happen. <em>Almost always discovered later.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit one week of staff AI search activity', ['Searches respecting access controls? Sensitive records appropriately gated? <strong>That\'s your privacy posture in practice, not in policy.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Translation + accessibility · <em>universally accepted · small mistakes become large harms</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 use cases · source verification · access controls.', '<strong>Next:</strong> 3 translation + accessibility use cases · high-stakes vs low-stakes · community review.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Translation + accessibility' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-accessibility.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · UNIVERSALLY ACCEPTED', h1Html: '3 use cases · <em>high-stakes human review</em>', subtitleHtml: '<strong>Most universally accepted government AI. Small mistakes can become large harms.</strong>' },
  { type: 'content', eyebrow: '3 translation + accessibility use cases', icon: '1', headlineHtml: 'Multilingual · accessible · <em>real-time interpretation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Multilingual service delivery', '', 'Information in languages spoken by citizens. AI-translated content at scale.', 'green')}
${cell('UC 2', 'Accessible-format generation', '', 'Plain language · screen-reader-friendly · sign-language video via avatar.', 'green')}
${cell('UC 3', 'Real-time interpretation', '', 'AI-augmented interpretation between staff and citizens speaking different languages.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'The translation accuracy problem', icon: '!', iconRed: true, headlineHtml: 'Often good · <em>occasionally seriously wrong</em>',
    blocks: [{ atStep: 1, html: cardRed('THE TRANSLATION ACCURACY PROBLEM', 'High-stakes contexts have direct consequences', ['AI translation is often good. Sometimes very good. <strong>Occasionally seriously wrong.</strong>', 'High-stakes — medical · legal rights · immigration interviews · child welfare — translation errors have direct consequences.'], '<strong>Discipline:</strong> AI translation in low-stakes contexts is fine. In high-stakes, <strong>human translator review required.</strong> Identifying the line is the work. <em>Low-stakes: general info, status, announcements. High-stakes: anything affecting rights or significant interests.</em>') }] },
  { type: 'content', eyebrow: 'Accessibility discipline', icon: '2', headlineHtml: 'Community review · <em>before broad deployment</em>',
    blocks: [{ atStep: 1, html: card('ACCESSIBILITY DISCIPLINE', 'Community knows what works', ['AI-generated accessible formats are a real benefit. AI summaries in plain language · auto-generated alt text · screen-reader transformations.', '<strong>Discipline:</strong> AI accessibility output reviewed by users in the accessibility community before broad deployment.', '<strong>What works:</strong> accessibility advisory groups partnering with the agency. AI output reviewed by community before production. Iteration before scaling.'], '<strong>What doesn\'t:</strong> auto-deploying AI accessibility content based on internal review only. <em>Community will tell you what isn\'t working. Listen before scaling.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'High-stakes review · <em>community review</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TRANSLATION + ACCESSIBILITY AI', '2 questions', ['<strong>Q1:</strong> high-stakes translations human-reviewed? Yes for all green · most amber · <strong>no/inconsistent red</strong>.', '<strong>Q2:</strong> accessibility AI output reviewed by community users before deployment? Yes green · internal only amber · no review red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sample one week of AI-translated high-stakes content', ['Human-reviewed? <strong>If not, add the gate before something goes wrong publicly.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Governance posture · <em>where compliance and citizen trust intersect</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 use cases · accuracy problem · accessibility discipline · 2-question scoring.', '<strong>Next:</strong> 4 governance components · public inventory · procurement implications.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Governance posture' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-governance.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · COMPLIANCE + CITIZEN TRUST', h1Html: '4 components · <em>4 procurement terms</em>', subtitleHtml: '<strong>Public AI inventory · impact assessments · appeal paths · named accountability.</strong>' },
  { type: 'content', eyebrow: '4 governance components', icon: '1', headlineHtml: 'Inventory · impact · appeal · <em>accountability</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'Public AI inventory', '', 'Every AI system documented. OMB M-24-10 required for US federal. UK + EU similar.')}
${cell('C2', 'Impact assessment', '', 'Documented analysis of risks to rights · equity · outcomes. EU AI Act FRIA · US use case impact.')}
${cell('C3', 'Appeal pathway', '', 'For any adverse AI decision · documented appeal process. <strong>Constitutional due process.</strong>')}
${cell('C4', 'Accountability', '', 'Named responsible official. Documented decision authority. <strong>Not "the system decided."</strong>')}
</div>` }] },
  { type: 'content', eyebrow: 'Public inventory discipline', icon: '2', headlineHtml: 'Plain language · quarterly review · <em>not annual</em>',
    blocks: [{ atStep: 1, html: card('THE PUBLIC INVENTORY DISCIPLINE', 'Maintained or it goes stale', ['<strong>Pattern:</strong> every AI use case has inventory entry. Description in plain language · purpose · risk class · impact assessment status · named accountable official.', '<strong>What this enables:</strong> public knowing what AI government uses. Oversight bodies can examine. Civil society can hold to account.', '<strong>What it requires:</strong> discipline to maintain. <em>Quarterly review minimum. Annual reviews allow drift.</em>']) }] },
  { type: 'content', eyebrow: 'Procurement implications · 4 terms', icon: '3', headlineHtml: 'Explainability · bias · data · <em>exit + continuity</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('T1', 'Explainability + audit rights', '', 'Vendor provides docs sufficient for impact assessment. Government can audit on reasonable notice.', 'green')}
${cell('T2', 'Bias + fairness testing', '', 'Vendor demonstrates methodology. Government can require additional testing.', 'green')}
${cell('T3', 'Data handling', '', 'What vendor does with citizen data. <strong>Not used for vendor commercial purposes without explicit authority.</strong>', 'green')}
${cell('T4', 'Exit + continuity', '', 'Migration support. Records accessible to government if vendor relationship ends.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '4', headlineHtml: 'Inventory current · impact assessments · <em>procurement terms</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE GOVERNANCE POSTURE', '3 questions', ['<strong>Q1:</strong> public AI inventory current + accurate? Reviewed last quarter green · stale amber · <strong>no inventory red</strong>.', '<strong>Q2:</strong> every active use case has documented impact assessment? Yes green · most amber · many missing red.', '<strong>Q3:</strong> vendor AI contracts include the 4 standard terms? New yes green · mixed amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull your agency AI inventory · is it complete and current?', ['<strong>AI systems running that aren\'t in the inventory → governance debt to close.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 components · inventory discipline · 4 procurement terms · 3-question scoring.', '<strong>Last chapter:</strong> 18-month rollout · 4 trust trip-wires · interactive Markdown builder for your agency head.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',cadence:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='public-sector-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var c=state.cadence||'_(pick inventory cadence)_';var s=state.sponsor||'_(pick accountable official)_';return '# Public-Sector AI · 18-Month Roadmap\\n\\n**Agency head / Chief AI Officer:** ____________________\\n**Start date:** ____________________\\n\\n## Starting play\\n> '+p+'\\n\\n## Inventory cadence\\n> '+c+'\\n\\n## Named accountable official\\n> '+s+'\\n\\n## Months 1-6: Service delivery + translation\\n- Citizen-facing AI with strong disclosure + escalation paths\\n- Translation for low-stakes with human review for high-stakes\\n\\n## Months 7-12: Case work augmentation + intelligent search\\n- Internal AI helps staff without making decisions\\n- Strong source verification discipline\\n- Public AI inventory current\\n\\n## Months 13-18: Fraud detection if appropriate\\n- Only after foundations in place\\n- Pre-deployment bias audit\\n- Human investigator in the loop\\n- Appeal path documented\\n\\n## 4 trust trip-wires (do not cross)\\n- Algorithmic decisions affecting rights without human review — due process applies\\n- Opaque AI in high-stakes contexts — citizens must be able to appeal\\n- AI gate-keeping access to human assistance — escalation paths required\\n- Public-sector AI not in public inventory — citizens have the right to know\\n\\n---\\nSource: Gennoor Academy · AI for Public Sector & Government\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your public-sector AI roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 18-MONTH ROADMAP', h1Html: '3 phases · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Accountability · transparency · due process · equal treatment are the constraint.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Serve the public · <em>accountable to it</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Citizens cannot easily switch or refuse', ['Accountability, transparency, due process, equal treatment are not optional. <strong>They are the constraint within which government AI operates.</strong>']) }] },
  { type: 'content', eyebrow: '18-month rollout', icon: '2', headlineHtml: 'Service + translation · case + search · <em>fraud (if appropriate)</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1-6', 'Service + translation', '', 'Citizen-facing AI with disclosure + escalation · low-stakes translation auto · high-stakes human review.')}
${cell('M7-12', 'Case work + search', '', 'Internal AI helps staff. Source verification discipline. Public inventory current.', 'amber')}
${cell('M13-18', 'Fraud detection if appropriate', '', 'Only after foundations · pre-deployment bias audit · human investigator · appeal path.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Rights without review · opaque · escalation gate · <em>not in inventory</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Decisions affecting rights without human review', '', 'Constitutional + statutory due process. <strong>No exceptions.</strong>', 'red')}
${cell('W2', 'Opaque AI in high-stakes contexts', '', 'Citizens must understand decisions to appeal. <strong>Black box breaks due process.</strong>', 'red')}
${cell('W3', 'AI gate-keeping access to humans', '', 'Service AI must include accessible escalation paths.', 'red')}
${cell('W4', 'Public-sector AI not in inventory', '', '<strong>If you\'re using it, the public has the right to know.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · cadence · sponsor · <em>take to agency head</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting play</h5><div class="preset" data-group="play">
<button data-val="Service delivery automation — low-risk, high-value, foundation play">Service delivery</button>
<button data-val="Translation + accessibility — equity-focused, low-stakes-first, community-reviewed">Translation + accessibility</button>
<button data-val="Intelligent search — internal AI helping staff, source verification discipline">Intelligent search</button>
<button data-val="Case work augmentation — only when verification discipline is mature">Case work augmentation</button>
</div></div>
<div class="group"><h5>Public inventory cadence</h5><div class="preset" data-group="cadence">
<button data-val="Quarterly review minimum — recommended discipline for active portfolios">Quarterly</button>
<button data-val="Monthly review with public-facing update — most rigorous">Monthly</button>
<button data-val="Annual review only — accept the drift risk, easier to maintain">Annual</button>
</div></div>
<div class="group"><h5>Named accountable official</h5><div class="preset" data-group="sponsor">
<button data-val="Chief AI Officer with statutory authority + budget">Chief AI Officer</button>
<button data-val="Agency head directly with named Chief AI Officer support">Agency head + CAIO</button>
<button data-val="Department CIO with Chief AI Officer governance partnership">Department CIO + CAIO</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my public-sector AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Public-Sector AI · 18-Month Roadmap

Pick starting play, inventory cadence, and accountable official on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Citizens are not customers · 5 plays · 3 fail patterns · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>In government, AI serves the public and is accountable to it · five plays — service delivery, case work augmentation, fraud detection, intelligent search, translation · three patterns that fail · disclosure required · escalation paths real · source verification part of the work · public inventory maintained · four trip-wires that protect due process and citizen trust.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting play and inventory cadence.</div><div class="row"><span class="arr">→</span>Get one agency head or chief AI officer conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 28 chapters 1-8 built.')
