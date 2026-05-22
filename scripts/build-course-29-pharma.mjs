// Course 29 — AI in Pharma & Life Sciences (Emma)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Pharma · AI in Pharma + Life Sciences'
const OUT = 'tmp/academy-build/ai-in-pharma-life-sciences/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The pharma + life sciences landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · WITHIN GxP GUARDRAILS', h1Html: '5 plays · <em>regulator-aware</em>', subtitleHtml: '<strong>AI accelerates discovery and operations within GxP guardrails. Patient safety, data integrity, regulatory accountability are non-negotiable.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Accelerate · <em>within GxP guardrails</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Different from clinical AI in hospital settings', ['Pharma AI lives in research · development · regulatory submissions · manufacturing · post-market surveillance. <strong>Each heavily regulated. Each with specific evidentiary requirements. AI cannot bypass them.</strong>']) }] },
  { type: 'content', eyebrow: '5 high-value plays', icon: '2', headlineHtml: 'Discovery · trials · submissions · <em>PV+RWE · commercial</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PLAY 1', 'Drug discovery', '', 'Target ID · lead gen · ADMET prediction · biologics design. Generative chemistry · structure-based AI.', 'green')}
${cell('PLAY 2', 'Clinical trial operations', '', 'Patient ID · site selection · protocol optimisation · data quality monitoring.', 'green')}
${cell('PLAY 3', 'Regulatory submission prep', '', 'Drafting · dossier organisation · gap analysis · response drafting.', 'green')}
${cell('PLAY 4', 'Pharmacovigilance + RWE', '', 'Signal detection · case intake · RWE synthesis for safety updates.', 'green')}
${cell('PLAY 5', 'Commercial + medical affairs', '', 'Medical inquiry · scientific content · omnichannel personalisation with compliance.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'The regulatory frame', icon: '3', headlineHtml: 'FDA · EMA · ICH · <em>GxP across the board</em>',
    blocks: [{ atStep: 1, html: card('REGULATORY FRAME · HEAVY AND SPECIFIC', 'Each play has specific evidentiary expectations', ['<strong>FDA:</strong> GMLP 2021 · AI/ML SaMD Action Plan · 2025 draft AI in drug development · 21 CFR Part 11.', '<strong>EMA:</strong> AI reflection paper 2023 · setting expectations for AI in submissions and PV.', '<strong>ICH:</strong> international harmonisation when AI output enters regulatory documents.', '<strong>GxP:</strong> Clinical, Manufacturing, Laboratory, Distribution, Vigilance practice all apply to the AI in those contexts.']) }] },
  { type: 'content', eyebrow: 'What this course covers', icon: '→', headlineHtml: '5 plays + validation + roadmap',
    blocks: [
      { atStep: 1, html: card('STRUCTURE', '8 chapters', ['Ch 2 — discovery · Ch 3 — trial ops · Ch 4 — submission prep · Ch 5 — PV + RWE · Ch 6 — commercial + medical affairs · Ch 7 — validation + GxP fit · Ch 8 — roadmap.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick the play your organisation is most actively pursuing', ['Next 7 chapters give regulator-aware operational discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Drug discovery · <em>highest-profile wins · most public disappointments</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'GxP guardrails · 5 plays · regulatory frame.', '<strong>Next:</strong> target ID · lead gen · ADMET · protein engineering. The disappointment pattern. The validation discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Drug discovery' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-discovery.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · WINS AND DISAPPOINTMENTS', h1Html: 'Accelerator · <em>not guarantee</em>', subtitleHtml: '<strong>AI accelerates early stages. Clinical success still depends on biology, target validation, patient selection.</strong>' },
  { type: 'content', eyebrow: 'What AI changes in discovery', icon: '1', headlineHtml: 'Target ID · lead gen · ADMET · <em>protein engineering</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('AREA 1', 'Target identification', '', 'Genomics, transcriptomics, proteomics integrated at scale. AI surfaces candidates traditional approaches miss.', 'green')}
${cell('AREA 2', 'Lead generation', '', 'Generative chemistry · candidate molecules with desired properties. Computational screening at previously infeasible scales.', 'green')}
${cell('AREA 3', 'ADMET prediction', '', 'Absorption · distribution · metabolism · excretion · toxicity from structure. <strong>Earlier kill decisions on bad candidates.</strong>', 'green')}
${cell('AREA 4', 'Protein engineering', '', 'AlphaFold + successors made structure-based design routine. <strong>Antibody and biologics design meaningfully accelerated.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The disappointment pattern', icon: '!', iconRed: true, headlineHtml: 'Accelerator · <em>not clinical guarantee</em>',
    blocks: [{ atStep: 1, html: cardRed('THE DISAPPOINTMENT PATTERN', 'Important to name', ['Several high-profile AI discovery programmes produced candidates that progressed to clinical trials. <strong>Not all outperformed traditionally discovered molecules at the bedside.</strong> Clinical failures of AI-originated candidates have happened publicly.'], '<strong>Lesson:</strong> AI accelerates the early stages. <em>Clinical success still depends on biology, target validation, and patient selection.</em> Vendor-pitch claims of "AI-designed drugs reach market faster" require careful interpretation.') }] },
  { type: 'content', eyebrow: 'The validation discipline', icon: '2', headlineHtml: 'Wet-lab confirms · <em>diverse held-out sets · external benchmark</em>',
    blocks: [{ atStep: 1, html: card('THE VALIDATION DISCIPLINE', 'In AI discovery', ['<strong>Computational predictions require wet-lab validation.</strong> Always. Predicted binding affinity confirmed by experiment. Predicted ADMET confirmed by assay.', '<strong>Negative controls matter.</strong> Highly enriching active compounds in retrospective benchmarks? Ensure on diverse held-out sets, not familiar training data. <em>Otherwise enrichment is illusion.</em>', '<strong>External benchmarking helps.</strong> Public competitions + consortium benchmarks expose what works vs what works only on internal data.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Confirmation rate · <em>cycle-time reduction</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DISCOVERY AI', '2 questions', ['<strong>Q1:</strong> AI-identified candidates that progressed to wet-lab validation — confirmation rate? High enrichment over random green · modest amber · <strong>no enrichment red — over-fit or measuring wrong thing</strong>.', '<strong>Q2:</strong> cycle-time reduction in early discovery? 3-12 months faster green · marginal amber · <strong>no reduction red — not paying back</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull one AI discovery project from last year', ['Wet-lab confirmation rate? <strong>That\'s your honest signal, not vendor\'s enrichment claims.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Clinical trial operations · <em>patient ID + site selection + data quality</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Acceleration not guarantee · 4 areas · validation discipline · 2-question scoring.', '<strong>Next:</strong> 4 trial AI use cases · the GCP constraint · the consent question.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Clinical trial operations' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-trials.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · GCP REMAINS', h1Html: '4 use cases · <em>investigator + medical monitor accountable</em>', subtitleHtml: '<strong>AI accelerates the human work. AI does not replace the human accountability GCP requires.</strong>' },
  { type: 'content', eyebrow: '4 clinical trial AI use cases', icon: '1', headlineHtml: 'Patient ID · sites · protocol · <em>data quality</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('UC 1', 'Patient identification', '', 'AI surfaces patients meeting inclusion criteria across EHR data. <strong>Speeds enrolment, particularly rare disease.</strong>', 'green')}
${cell('UC 2', 'Site selection', '', 'AI predicts site delivery on enrolment · quality · timeline. Reduces wasted activation cost.', 'green')}
${cell('UC 3', 'Protocol optimisation', '', 'AI analyses similar trials · flags elements likely to cause enrolment issues, amendments, or data quality problems.', 'green')}
${cell('UC 4', 'Data quality monitoring', '', 'Risk-based monitoring augmented by AI. Anomalies surface for medical and data manager review.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The GCP constraint', icon: '!', iconRed: true, headlineHtml: 'AI supports · <em>investigator + medical monitor decide</em>',
    blocks: [{ atStep: 1, html: cardRed('THE GCP CONSTRAINT', 'Always', ['<strong>AI-supported patient ID acceptable.</strong> AI deciding patient eligibility without investigator review is not. Investigator remains decision-maker. ICH GCP · FDA 21 CFR Part 312 · EMA CTR all assume this.', '<strong>AI-supported data quality monitoring acceptable.</strong> AI altering or correcting trial data autonomously is not.'], '<strong>The discipline:</strong> AI accelerates the human work. <em>AI does not replace the human accountability GCP requires.</em>') }] },
  { type: 'content', eyebrow: 'The consent question', icon: '2', headlineHtml: 'IRB-approved protocol · <em>documented legal basis</em>',
    blocks: [{ atStep: 1, html: card('THE CONSENT QUESTION', 'AI used to identify patients for trial outreach', ['Retrospective EHR queries for feasibility acceptable under specific conditions in most jurisdictions.', '<strong>Patient outreach based on AI-surfaced records requires careful handling</strong> — GDPR · HIPAA · India DPDPA.', '<strong>What works:</strong> IRB approval for the AI-enabled identification protocol · documented legal basis · patient communication that doesn\'t surveil and doesn\'t surprise.', '<strong>What doesn\'t:</strong> AI surfaces patients without IRB review. Patient receives a call about a trial and is unclear how their info was found. <em>Trust damaged.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'IRB scope · <em>medical monitor in loop</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TRIAL AI', '2 questions', ['<strong>Q1:</strong> AI-supported patient ID — IRB-reviewed protocol + consent path documented? All studies yes green · most amber · no/variable red.', '<strong>Q2:</strong> AI-supported data quality monitoring — anomaly findings through medical monitor + data manager review? Yes green · sometimes amber · <strong>automated correction without review red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull one current trial using AI for patient ID', ['IRB approval scope? Actual use within scope? <strong>Drift between approved scope and operational practice is the regulatory risk.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Regulatory submission prep · <em>saves significant time without crossing lines</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '4 use cases · GCP constraint · consent question · 2-question scoring.', '<strong>Next:</strong> 3 submission use cases · the citation discipline · 21 CFR Part 11 audit trail.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Regulatory submission preparation' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-submissions.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · CITATION DISCIPLINE CRITICAL', h1Html: '3 use cases · <em>every citation verified</em>', subtitleHtml: '<strong>Mata cross-domain applies. AI-drafted regulatory content can hallucinate citations.</strong>' },
  { type: 'content', eyebrow: '3 submission AI use cases', icon: '1', headlineHtml: 'Drafting · gap analysis · <em>response drafting</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Document drafting + summarisation', '', 'CSRs · summary docs · Module 2 · briefing books. AI drafts · medical writers + reg affairs refine.', 'green')}
${cell('UC 2', 'Dossier organisation + gap analysis', '', 'AI compares dossier completeness vs ICH CTD requirements. Flags missing or insufficient sections.', 'green')}
${cell('UC 3', 'Response drafting', '', 'When regulators issue questions, AI drafts responses vs existing dossier + prior precedent.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The citation discipline', icon: '!', iconRed: true, headlineHtml: 'Mata cross-domain · <em>every citation verified</em>',
    blocks: [{ atStep: 1, html: cardRed('THE CITATION DISCIPLINE', 'Critical · directly Mata cross-domain', ['In regulatory documents, <strong>every claim is sourced.</strong> Efficacy → source study, page, table. AE count → source database, query.', 'AI-drafted regulatory content can hallucinate citations. <strong>Pharma equivalent of Mata:</strong> fabricated study references · invented AE statistics · mis-cited regulations.'], '<strong>Discipline:</strong> every citation in AI-drafted regulatory content verified by a human reviewer against source. <em>Without exception.</em> What works: AI drafts with citations to known internal database documents · human verifies. <strong>What doesn\'t:</strong> AI drafts with model-generated citations. Most plausible-looking but wrong.') }] },
  { type: 'content', eyebrow: '21 CFR Part 11 question', icon: '2', headlineHtml: 'Audit trail · electronic signatures · <em>validation</em>',
    blocks: [{ atStep: 1, html: card('21 CFR PART 11', 'When AI in regulated electronic records', ['Audit trail of who edited what when. Electronic signatures of approval. Validation that system performs as intended.', '<strong>AI-generated content gets documented review-and-approve trail.</strong> Reviewer identity · edits · final approval signature. Same as human-drafted.', '<strong>What doesn\'t work:</strong> AI-generated content slipped into submission without explicit review/approval steps. <em>Audit finds the gap. Submission credibility damaged.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Citation accuracy · <em>Part 11 trail</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SUBMISSION AI', '2 questions', ['<strong>Q1:</strong> last 12 months AI-drafted regulatory content — citation accuracy when audited? >95% green · 85-95% amber · <strong><85% red — submitting bad citations</strong>.', '<strong>Q2:</strong> every AI contribution to regulated documents captured in Part 11 audit trail? Yes green · sometimes amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull one recent AI-assisted submission section · audit 20 random citations', ['Accurate · applicable · properly attributed? <strong>That hit rate is your discipline indicator.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'PV + RWE · <em>signal at scale</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 use cases · citation discipline · Part 11 trail · 2-question scoring.', '<strong>Next:</strong> case intake · signal detection · literature surveillance · medical review preserved.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Pharmacovigilance + real-world evidence' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-pv-rwe.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · SIGNAL AT SCALE', h1Html: '3 PV use cases · <em>medical review preserved</em>', subtitleHtml: '<strong>AI accelerates case processing. Medical review of serious cases remains the qualified medical officer\'s responsibility.</strong>' },
  { type: 'content', eyebrow: 'The volume problem', icon: '1', headlineHtml: 'Significant AE report volume · <em>manual increasingly infeasible</em>',
    blocks: [{ atStep: 1, html: card('THE PV VOLUME PROBLEM', 'AI is now standard support', ['Major pharma companies receive significant AE report volume daily. Spontaneous reports · HCP + consumer · literature · regulatory authority transfers.', 'Each must be processed · coded · evaluated for signal. <strong>Manual processing increasingly infeasible at scale.</strong>'], 'AI is now standard support for triaging · coding · case-level processing.') }] },
  { type: 'content', eyebrow: '3 PV AI use cases', icon: '2', headlineHtml: 'Case intake · signal detection · <em>literature surveillance</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Case intake + coding', '', 'AI extracts AE details from unstructured reports. MedDRA coding · demographics · causality factors.', 'green')}
${cell('UC 2', 'Signal detection', '', 'AI surfaces statistical signals from PV databases that warrant medical review.', 'green')}
${cell('UC 3', 'Literature surveillance', '', 'AI scans medical literature for case reports relevant to product safety profile.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Medical review preserved', icon: '!', iconRed: true, headlineHtml: 'Non-negotiable · <em>qualified medical officer responsibility</em>',
    blocks: [{ atStep: 1, html: cardRed('MEDICAL REVIEW PRESERVED', 'Non-negotiable', ['AI accelerates case processing. <strong>Medical review of serious cases remains the qualified medical officer\'s responsibility.</strong> Causality assessment remains human. Periodic safety report sign-off remains human.', 'FDA · EMA · others expect a qualified safety physician\'s judgement on causality + signal evaluation. <em>AI cannot replace that judgement. AI surfaces, prioritises, prepares the work.</em>'], '<strong>Mata cross-domain:</strong> AI-generated causality assessments may be plausible but wrong. Without human verification of source documentation, errors enter periodic safety reports. <em>Eventually regulators find them.</em>') }] },
  { type: 'content', eyebrow: 'Real-world evidence', icon: '2', headlineHtml: 'Pre-specified analysis plan · <em>before AI sees the data</em>',
    blocks: [
      { atStep: 1, html: card('REAL-WORLD EVIDENCE · GROWING AI ROLE', 'Post-market commitments · label expansions · reimbursement', ['<strong>FDA + EMA both have RWE frameworks.</strong> AI analyses RWD sources — EHR, claims, registries.', '<strong>Discipline:</strong> pre-specify the analysis plan before AI sees the data. Otherwise AI optimises for outcomes that look favourable rather than true.', '<strong>What works:</strong> protocol locked · AI applied as specified · results reported regardless of direction.', '<strong>What doesn\'t:</strong> AI run iteratively until favourable result emerges. <em>Statistical validity destroyed. Regulator credibility lost.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull one recent AI-supported PV case batch · spot-check medical review documentation', ['Qualified physician\'s judgement visible and substantive on every serious case? <strong>That\'s the regulatory question.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Commercial + medical affairs · <em>AI in customer-facing contexts</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Volume problem · 3 use cases · medical review · RWE discipline.', '<strong>Next:</strong> 3 commercial + med affairs use cases · promotional compliance line · disclosure question.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Commercial + medical affairs' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-commercial.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · CUSTOMER-FACING', h1Html: '3 use cases · <em>MLR + disclosure non-negotiable</em>', subtitleHtml: '<strong>OPDP + EMA promo compliance. AI accelerates drafting. AI does not bypass MLR review.</strong>' },
  { type: 'content', eyebrow: '3 commercial + medical AI use cases', icon: '1', headlineHtml: 'Medical inquiry · scientific content · <em>omnichannel</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Medical inquiry response', '', 'AI drafts initial responses to HCP inquiries based on approved labelling + approved data.', 'green')}
${cell('UC 2', 'Scientific content generation', '', 'Conference materials · KOL briefing books · internal medical training. AI accelerates content.', 'green')}
${cell('UC 3', 'Omnichannel personalisation', '', 'Within strict promotional compliance, AI personalises content to HCP preferences + engagement.', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Promotional compliance line', icon: '!', iconRed: true, headlineHtml: 'Strict · <em>FDA OPDP + EMA + national regs</em>',
    blocks: [{ atStep: 1, html: cardRed('PROMOTIONAL COMPLIANCE LINE', 'Strict', ['Pharma promo materials heavily regulated. FDA OPDP · EMA · national regulators. <strong>Off-label promotion prohibited. False/misleading claims prosecutable.</strong>', '<strong>AI-generated promo content:</strong> every claim sourced and approved through MLR review process. AI accelerates drafting. <em>AI does not bypass MLR review.</em>'], '<strong>What doesn\'t work:</strong> AI generates promo copy with off-label suggestions · exaggerated efficacy · unsourced statistics. Weak MLR approval → enforcement action.') }] },
  { type: 'content', eyebrow: 'The disclosure question', icon: '2', headlineHtml: 'AI disclosed · <em>HCP can request human follow-up</em>',
    blocks: [{ atStep: 1, html: card('THE DISCLOSURE QUESTION', 'Increasingly important', ['<strong>EU AI Act Article 50.</strong> AI interaction disclosure for in-scope uses.', '<strong>PhRMA + ABPI codes.</strong> Industry standards on transparency in HCP interaction.', '<strong>What works:</strong> AI-supported tools clearly disclosed. HCP can request human medical affairs follow-up anytime. Audit trail of AI interactions maintained.', '<strong>What doesn\'t:</strong> pretending AI is a human medical affairs representative. <em>If discovered, brand credibility damage exceeds short-term benefit.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'MLR rejection rate · <em>reviewer in loop</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE COMMERCIAL AI', '2 questions', ['<strong>Q1:</strong> AI-generated promo content — % requiring substantive MLR rejection or major revision? High rejection concerning — AI generating off-spec content. Persistent major revision = prompts + constraints wrong.', '<strong>Q2:</strong> AI-supported medical inquiry — qualified medical affairs reviewer in the loop before HCP transmission? Yes for all green · sometimes amber · no red.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Audit one week of AI-generated commercial content', ['% required MLR major revision? <strong>That ratio is your prompts-and-constraints health indicator.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Validation · audit · GxP fit · <em>cross-cutting discipline</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 use cases · promotional compliance · disclosure question · 2-question scoring.', '<strong>Next:</strong> GxP applicability · 4 validation components · audit-readiness discipline.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Validation, audit + GxP fit' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-validation.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · CROSS-CUTTING DISCIPLINE', h1Html: 'Validation · audit · <em>GxP fit</em>', subtitleHtml: '<strong>The cross-cutting discipline that makes everything else defensible.</strong>' },
  { type: 'content', eyebrow: 'GxP applicability question', icon: '1', headlineHtml: 'AI in regulated contexts · <em>underlying GxP applies</em>',
    blocks: [{ atStep: 1, html: card('GxP APPLICABILITY QUESTION', 'AI systems validated to fit-for-purpose', ['<strong>GCP</strong> for trial-supporting AI · <strong>GMP</strong> for manufacturing AI · <strong>GVP</strong> for PV AI · <strong>GDP</strong> for supply chain AI.', 'AI systems validated to fit-for-purpose standards. Documentation. Testing. Change control. <strong>Same as any other regulated computer system.</strong>']) }] },
  { type: 'content', eyebrow: '4 validation components', icon: '2', headlineHtml: 'Intended use · performance · risk · <em>change control</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('C1', 'Intended use', '', 'What AI is for. In scope. Out of scope. <strong>Written + approved before deployment.</strong>', 'green')}
${cell('C2', 'Performance validation', '', 'Demonstrates AI performs as intended on representative data. Quantitative metrics. Documented test cases.', 'green')}
${cell('C3', 'Risk assessment', '', 'What could go wrong. Impact. Mitigation. Per intended use.', 'green')}
${cell('C4', 'Change control', '', 'When model updates, what re-validation. <strong>Most models require re-validation on material changes.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Audit-readiness discipline', icon: '!', iconRed: true, headlineHtml: 'Inspector asks · <em>show the records</em>',
    blocks: [{ atStep: 1, html: cardRed('THE AUDIT-READINESS DISCIPLINE', 'FDA or EMA inspector arrives', ['Inspector will ask about AI systems in regulated contexts. Validation docs · audit trail · change history · evidence of intended-use compliance.', '<strong>Not "we have a process" but "here are the records."</strong>'], '<strong>What works:</strong> quality unit involvement from system selection through deployment. Documented validation packages reviewed + approved by QA. Periodic re-validation per change control SOP. <strong>What doesn\'t:</strong> AI deployed by data science without quality involvement. <em>Inspector finds AI in use without validation docs. Inspection finding. Potentially Form 483.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Validation current · <em>change control followed</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE VALIDATION DISCIPLINE', '2 questions', ['<strong>Q1:</strong> AI systems in GxP contexts — validation documentation current + complete? All yes green · most amber · <strong>many/unknown red</strong>.', '<strong>Q2:</strong> last AI model change in production — change control followed? Yes green · partial amber · <strong>no red — exposed to audit findings</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one AI system in GxP context · ask quality unit for validation docs', ['Can produce in 15 min and current? You have a system. <strong>If not, that\'s your highest-priority gap.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'GxP applicability · 4 validation components · audit-readiness · 2-question scoring.', '<strong>Last chapter:</strong> 18-month rollout · 4 trust trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',validation:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='pharma-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var v=state.validation||'_(pick validation posture)_';var s=state.sponsor||'_(pick sponsor)_';return '# Pharma AI · 18-Month Roadmap\\n\\n**Head of R&D / Chief Digital Officer:** ____________________\\n**Start date:** ____________________\\n\\n## Starting play\\n> '+p+'\\n\\n## Validation posture\\n> '+v+'\\n\\n## Executive sponsor\\n> '+s+'\\n\\n## Months 1-6\\n- Discovery acceleration + PV case intake\\n- Two areas with clear value and manageable regulatory burden\\n\\n## Months 7-12\\n- Submission drafting + clinical trial operations\\n- Higher regulatory burden · stronger validation discipline\\n\\n## Months 13-18\\n- Commercial + medical affairs\\n- Customer-facing · promotional compliance critical · MLR discipline embedded\\n\\n## 4 trust trip-wires (do not cross)\\n- AI-drafted regulatory content submitted without citation verification — Mata cross-domain\\n- AI making patient eligibility or causality determinations — investigator + qualified medical officer accountable\\n- AI in GxP contexts without validation documentation — inspector finding predictable\\n- AI promotional content bypassing MLR — off-label suggestions and unsourced claims are enforcement targets\\n\\n---\\nSource: Gennoor Academy · AI in Pharma & Life Sciences\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your pharma AI roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 18-MONTH ROADMAP', h1Html: '3 phases · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Within GxP guardrails · patient safety, data integrity, regulatory accountability non-negotiable.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Accelerate · <em>within GxP guardrails</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Patient safety + data integrity + regulatory accountability', ['Non-negotiable. Period.']) }] },
  { type: 'content', eyebrow: '18-month rollout', icon: '2', headlineHtml: 'Discovery + PV · submissions + trials · <em>commercial + medical</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('M1-6', 'Discovery + PV intake', '', '2 areas with clear value and manageable regulatory burden.')}
${cell('M7-12', 'Submissions + trials', '', 'Higher regulatory burden. Stronger validation discipline required.', 'amber')}
${cell('M13-18', 'Commercial + medical affairs', '', 'Customer-facing. Promo compliance critical. MLR discipline embedded.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Unverified citations · auto eligibility · no validation · <em>bypass MLR</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'AI regulatory content without citation verification', '', 'Mata cross-domain. <strong>Hallucinated citations end careers + submissions.</strong>', 'red')}
${cell('W2', 'AI eligibility or causality determinations', '', 'Investigator + qualified medical officer accountable. <strong>No exceptions.</strong>', 'red')}
${cell('W3', 'AI in GxP without validation docs', '', 'Inspector finding predictable. <strong>Potentially Form 483.</strong>', 'red')}
${cell('W4', 'AI promotional content bypassing MLR', '', 'Off-label + unsourced = enforcement targets.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · validation · sponsor · <em>take to head of R&D</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting play</h5><div class="preset" data-group="play">
<button data-val="Drug discovery — early acceleration · manageable regulatory burden">Drug discovery</button>
<button data-val="Pharmacovigilance case intake — volume scaling with medical review preserved">PV case intake</button>
<button data-val="Submission drafting — significant time savings with strong citation discipline">Submission drafting</button>
<button data-val="Clinical trial ops — patient ID and site selection within GCP">Trial ops</button>
</div></div>
<div class="group"><h5>Validation posture</h5><div class="preset" data-group="validation">
<button data-val="Conservative — quality unit involved from selection · full validation package · periodic re-validation">Conservative</button>
<button data-val="Standard — fit-for-purpose validation aligned with intended use · documented change control">Standard</button>
<button data-val="Risk-stratified — higher discipline for high-stakes use cases · lighter for low-stakes">Risk-stratified</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="Chief Digital Officer with R&D + clinical + reg affairs partnership">Chief Digital Officer</button>
<button data-val="Head of R&D with named CDO + Chief Medical Officer partnership">Head of R&D</button>
<button data-val="Chief Medical Officer for clinical and PV-focused initiatives">Chief Medical Officer</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my pharma AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Pharma AI · 18-Month Roadmap

Pick starting play, validation posture, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Within GxP guardrails · 5 plays · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI accelerates discovery and operations within GxP guardrails · five plays — discovery, trial operations, regulatory submission, pharmacovigilance and RWE, commercial and medical affairs · each has specific regulatory expectations · citations verified · causality assessments human · validation documentation current · promotional content through MLR · four trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting play and validation posture.</div><div class="row"><span class="arr">→</span>Get one head of R&D or chief digital officer conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 29 chapters 1-8 built.')
