// Build Course 18 chapter HTMLs — AI in Healthcare (Andrew · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Industry · AI in Healthcare';
const OUT = 'tmp/academy-build/ai-in-healthcare/chapters';

const card = (ct, h3, ps, takeaway) =>
  `<div class="card"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`;
const cardRed = (ct, h3, ps, takeaway) =>
  `<div class="card red"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`;
const cardGreen = (ct, h3, ps, takeaway) =>
  `<div class="card green"><span class="ct">${ct}</span><h3>${h3}</h3>${ps.map(p => `<p>${p}</p>`).join('')}${takeaway ? `<div class="takeaway">${takeaway}</div>` : ''}</div>`;
const cell = (cn, h4, num, p, cls = '') =>
  `<div class="cell ${cls}"><span class="cn">${cn}</span><h4>${h4}</h4>${num ? `<div class="num">${num}</div>` : ''}<p>${p}</p></div>`;
const closeCard = (eyebrow, h2, p) =>
  `<div class="final-close"><div class="eyebrow">${eyebrow}</div><h2>${h2}</h2><p>${p}</p></div>`;

emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The healthcare AI landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-healthcare-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · PATIENT-SAFETY THROUGH-LINE', h1Html: '1000+ FDA devices · <em>physician responsibility</em>', subtitleHtml: 'Clinical consequence · active regulators · patient safety as the through-line. <strong>Physician decides. AI supports.</strong>' },
    { type: 'content', eyebrow: 'FDA · 1000+ AI-enabled devices · 2025', icon: '1', headlineHtml: 'Radiology dominant · <em>SaMD pathway since 2017</em>',
      blocks: [{ atStep: 1, html: card('FDA AI-ENABLED MEDICAL DEVICES LIST · MID-2025', 'Over 1000 approved · 80% radiology/imaging', ['SaMD — Software as a Medical Device — premarket approval pathway refined since 2017.', '<strong>Cardiology, pathology, ophthalmology, neurology are the rapidly-growing categories.</strong>', 'EU MDR + IVDR continue to apply alongside EU AI Act from Aug 2026.']) }] },
    { type: 'content', eyebrow: 'The fastest-deploying use case · ambient scribing', icon: '2', headlineHtml: 'Nuance DAX · Abridge · Suki · <em>2+ hrs/day saved</em>',
      blocks: [{ atStep: 1, html: card('AMBIENT SCRIBING · FASTEST-DEPLOYING AI USE CASE 2026', 'Microsoft Nuance DAX · Abridge · Suki · Augmedix · DeepScribe', ['AI listens to physician-patient conversation · drafts clinical note · physician reviews + signs.', '<strong>Physicians regularly report 2+ hours per day saved on note-taking.</strong>'], 'That time goes back to patients, research, physician wellbeing.') }] },
    { type: 'content', eyebrow: 'Clinical decision support + responsibility line', icon: '3', headlineHtml: 'Epic · UpToDate · Tempus · Aidoc · <em>ABIM/AMA/CMS line</em>',
      blocks: [{ atStep: 1, html: card('CLINICAL DECISION SUPPORT + DIAGNOSTIC AI', 'Epic Cosmos + Epic AI · UpToDate Clinical AI · Tempus + Flatiron (oncology) · Aidoc + Annalise + Heuron (radiology) · IBM Merative', ['<strong>The clinical responsibility line is unambiguous by 2026.</strong> ABIM + AMA + CMS — clinical decisions remain physician responsibility.', 'AI supports. The physician decides. Documentation reflects this.']) }] },
    { type: 'content', eyebrow: 'The failure modes · 3 patterns', icon: '!', iconRed: true, headlineHtml: 'Hallucination · bias · <em>Air Canada-style commitments</em>',
      blocks: [
        { atStep: 1, html: cardRed('3 FAILURE MODES IN HEALTHCARE AI', 'Patient safety = the cost', ['<strong>1 — Hallucinations:</strong> Stanford "Hallucinating Law" pattern applies. Making up dosages, contraindications, study citations = medical-error vector.', '<strong>2 — Bias:</strong> Bloomberg/Wilson-Caliskan cross-domain logic. Training data unrepresentative → AI performs less well on minority populations. Documented in radiology, dermatology, oncology.', '<strong>3 — Air Canada cross-domain:</strong> anything AI says to a patient = hospital\'s statement. Coverage commitments, treatment recommendations, appointment promises.']) },
        { atStep: 2, html: card('THE THESIS', 'Clinical consequence · active regulators · patient safety through-line', ['Physician responsibility. Regulator-aware deployment. <strong>Through-line of the course.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Patient safety · physician responsibility · regulator-aware.', '<strong>Next:</strong> ambient scribing — Nuance DAX · Abridge · 2+ hrs/day saved · PHI handling · patient consent.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Ambient scribing' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-ambient-scribing.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · FASTEST-DEPLOYING', h1Html: '2+ hours/day saved · <em>physician documentation</em>', subtitleHtml: 'Nuance DAX · Abridge · Suki · Augmedix · DeepScribe. <strong>Highest-ROI healthcare AI use case in 2026.</strong>' },
    { type: 'content', eyebrow: 'What\'s deployed · 2026', icon: '1', headlineHtml: 'Real-time transcription + clinical-note generation',
      blocks: [{ atStep: 1, html: card('THE PLATFORMS', 'Microsoft Nuance DAX · Abridge · Suki · Augmedix · DeepScribe', ['<strong>Nuance DAX (Microsoft) — established leader.</strong> Widely deployed across US health systems.', 'Abridge — strong Epic integration. Suki, Augmedix, DeepScribe — additional platforms with different specialty focuses.'], 'AI listens to physician-patient conversation real-time · transcribes · generates clinical note (SOAP, progress, H&P) · inserts into EHR for physician review + sign-off.') }] },
    { type: 'content', eyebrow: 'The time savings', icon: '2', headlineHtml: '2+ hours/day · <em>physicians report</em>',
      blocks: [{ atStep: 1, html: cardGreen('THE TIME SAVINGS', 'Active-user physicians report 2+ hours/day saved on documentation', ['CMS published time data + physician burnout literature align.', '<strong>That time becomes: more patients seen · more time per patient · research · physician wellbeing.</strong>'], 'Economics work: at typical physician compensation rates, AI pays for itself in time saved within months of active use.') }] },
    { type: 'content', eyebrow: 'PHI handling · HIPAA BAA required', icon: '3', headlineHtml: 'BAA · in-tenant processing · <em>minimum necessary</em>',
      blocks: [{ atStep: 1, html: card('PHI HANDLING', 'HIPAA Privacy + Security Rules apply · BAA required with AI vendor', ['Microsoft, Abridge, Suki, Augmedix all sign BAAs at enterprise tier.', '<strong>Data flow:</strong> audio processed by AI vendor · transcript + note returned to EHR. Many vendors process in-tenant or in-VPC (data stays in hospital\'s cloud boundary).'], 'Discipline: audit data flow before deployment. Where is audio processed · stored · retention. Minimum-necessary principle.') }] },
    { type: 'content', eyebrow: 'Patient consent · the 3-sentence script', icon: '4', headlineHtml: 'Disclosure · opt-out · <em>clinical primacy</em>',
      blocks: [
        { atStep: 1, html: card('PATIENT CONSENT', 'US — HIPAA-compliant scribing generally doesn\'t require additional patient consent beyond standard intake notices · best practice is to inform', ['EU — GDPR + EU AI Act Art. 50 apply. Patient may need explicit consent. <strong>Check national health-data law.</strong>', 'India DPDPA — health data is sensitive personal data, consent required.'], 'Standard script: "Your physician is using an AI assistant to help with documentation. The recording will be used only to create your clinical note. You may opt out at any time." <em>3 sentences. Clear. Consistent.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Audit 1 week of physician-patient interactions where AI was used', ['Verify data flow · consent process · physicians sign every note before EHR. <strong>Catch operational gaps now.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Clinical decision support · <em>ABIM/AMA/CMS line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Highest-ROI healthcare AI · 2+ hrs/day · BAA + consent + physician sign-off.', '<strong>Next:</strong> Epic AI · UpToDate · Tempus · the responsibility line · hallucination + bias mitigation.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 170.0, slide: 5 }, { at: 180.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Clinical decision support' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-clinical-decision-support.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · PHYSICIAN-RESPONSIBILITY LINE', h1Html: 'AI supports · <em>physician decides</em>', subtitleHtml: 'Epic Cosmos · UpToDate · Tempus. <strong>ABIM, AMA, CMS — clinical decisions remain physician responsibility. AI augments.</strong>' },
    { type: 'content', eyebrow: 'What\'s deployed · 2026', icon: '1', headlineHtml: 'Epic · UpToDate · Tempus · <em>Owkin · Merative</em>',
      blocks: [{ atStep: 1, html: card('CLINICAL DECISION SUPPORT IN 2026', 'Large EHR + specialty platforms', ['<strong>Epic Cosmos + Epic AI</strong> — large EHR vendor integration across thousands of US hospitals.', '<strong>UpToDate Clinical AI</strong> — clinical reference + decision support evolution.', '<strong>Tempus + Flatiron</strong> — oncology + multi-omics. <strong>Owkin</strong> — multi-omics research. <strong>IBM Merative</strong> (formerly Watson Health).'], 'Pattern: AI surfaces relevant evidence at point of care · best-practice alerts · differential diagnoses · drug-drug interactions. Physician reviews recommendations alongside clinical picture.') }] },
    { type: 'content', eyebrow: 'The responsibility line · ABIM + AMA + CMS', icon: '2', headlineHtml: 'Crystal clear · <em>physician decides</em>',
      blocks: [{ atStep: 1, html: card('THE RESPONSIBILITY LINE · ABIM + AMA + CMS', 'Unambiguous positions through 2024-25', ['<strong>ABIM:</strong> clinical decisions are physician responsibility. AI supports.', '<strong>AMA:</strong> physician judgement is core to patient-physician relationship. AI augments. Doesn\'t replace.', '<strong>CMS:</strong> AI use must not impair clinical decision-making or shift responsibility.'], 'Practically: AI recommendations are inputs. Physician considers + weighs against patient clinical context + decides. If AI recommends X and physician does Y — physician\'s call. Documentation reflects: AI consulted · physician\'s judgement prevailed.') }] },
    { type: 'content', eyebrow: 'Hallucination risk · Stanford cross-domain', icon: '!', iconRed: true, headlineHtml: 'Making up dosages · <em>= medical-error vector</em>',
      blocks: [{ atStep: 1, html: cardRed('HALLUCINATION = PATIENT-SAFETY RISK', 'Stanford "Hallucinating Law" pattern applies directly', ['If AI makes up details in legal briefs — it can make up dosages, contraindications, study citations in clinical settings.', '<strong>Mitigation: retrieval-grounded clinical AI.</strong> AI constrained to evidence from approved sources — UpToDate, primary literature, hospital formulary.', '<strong>Citations to source documents.</strong> Quote-or-cut applies. "Patient has X based on study Y" → must be verifiable Study Y.'], 'Discipline: physicians treat AI recommendations like residents-in-training. Useful. Smart. Need to be checked. <em>Senior physician\'s judgement is the safeguard.</em>') }] },
    { type: 'content', eyebrow: 'The bias question · demographic subgroups', icon: '3', headlineHtml: 'Underrepresentation · <em>vendor must provide subgroup metrics</em>',
      blocks: [
        { atStep: 1, html: card('CLINICAL AI BIAS · DEMOGRAPHIC SUBGROUPS', 'Training data often unrepresentative · documented in radiology, dermatology, oncology', ['AI may perform less well on patient subgroups underrepresented in training data. <strong>Increasingly clear in literature.</strong>'], 'Vendor angle: demand bias-monitoring data from clinical AI vendors. <strong>If they can\'t provide subgroup performance metrics — procurement gap to close.</strong>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick 1 clinical AI tool · verify 3 things', ['Physician documentation reflects AI as input, not decision-maker · bias-monitoring data from vendor · hallucination-monitoring (citations checked, false-positive flags tracked). <strong>If any missing — that\'s the gap.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Radiology + diagnostic AI · <em>radiologist-in-loop</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'AI supports · physician decides · responsibility unambiguous.', '<strong>Next:</strong> Aidoc · Annalise · Heuron · FDA SaMD-approved · radiologist-in-the-loop · 3 deployment patterns.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 80.0, slide: 3 }, { at: 90.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Radiology + diagnostic AI' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-radiology.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · MOST-DEPLOYED FDA-CLEARED', h1Html: 'Aidoc · Annalise · Heuron · <em>radiologist-in-loop</em>', subtitleHtml: '~80% of 1000+ FDA-cleared AI devices are radiology. <strong>3 deployment patterns. False-positive trade-offs.</strong>' },
    { type: 'content', eyebrow: 'What\'s deployed · 2026', icon: '1', headlineHtml: 'Time-critical findings · <em>minutes saved</em>',
      blocks: [{ atStep: 1, html: card('RADIOLOGY AI 2026', 'Aidoc · Annalise AI · Heuron · Viz.AI · RapidAI', ['Time-sensitive findings: stroke · pulmonary embolism · intracranial haemorrhage · aortic dissection.', '<strong>AI flags suspected positives for radiologist review.</strong> Speed-to-diagnosis material — minutes saved on stroke = brain tissue preserved.']) }] },
    { type: 'content', eyebrow: 'FDA SaMD pathway', icon: '2', headlineHtml: '1000+ devices · <em>FDA published list</em>',
      blocks: [{ atStep: 1, html: card('FDA SaMD PATHWAY', 'Software as a Medical Device · premarket approval refined since 2017', ['FDA reviews clinical evidence — sensitivity, specificity, comparison to standard of care.', '<strong>Published list: 1000+ AI-enabled medical devices by mid-2025.</strong>'], 'Procurement teams: check the list. If vendor isn\'t on it for the clinical use case — <strong>ask why.</strong> Some applications navigating FDA path · others not intended for approval. Either fine. But the question must be asked.') }] },
    { type: 'content', eyebrow: 'Radiologist-in-the-loop · the discipline', icon: '3', headlineHtml: 'AI flags · <em>radiologist reads + confirms</em>',
      blocks: [{ atStep: 1, html: card('RADIOLOGIST-IN-THE-LOOP', 'The deployment pattern that meets the responsibility line', ['AI flags or surfaces findings · radiologist reads imaging + confirms or refutes. <strong>Radiologist\'s reading is the diagnosis. Not the AI\'s.</strong>'], '<strong>False positives:</strong> AI errs on flagging — sensitivity > specificity (by design — better to over-flag possible stroke than miss). Cost: radiologist triage time. Net time saved positive on well-tuned platforms · negative on poorly-tuned ones.<br/><br/><strong>False negatives:</strong> AI misses findings the radiologist would catch. Safety risk. Mitigation: AI supplementary, not replacement. <em>Radiologist reads independently. AI provides second look, not replacement look.</em>') }] },
    { type: 'content', eyebrow: 'The 3 deployment patterns · 2026', icon: '4', headlineHtml: 'Worklist triage · second read · <em>pre-screen</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PATTERN 1', 'Workflow triage', '', 'AI sorts worklist by urgency. Stroke + PE → top. Routine → bottom. Radiologist reads in priority order.', 'green')}
${cell('PATTERN 2', 'Second read', '', 'Radiologist reads independently · AI provides second-look comparison · discrepancies trigger detailed review. <strong>Higher-confidence final reading.</strong>', 'green')}
${cell('PATTERN 3', 'Pre-screen', '', 'AI screens normal-presumed scans · radiologist confirms. <strong>Higher throughput on routine reads.</strong>', 'amber')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull hospital radiology AI deployment · per tool: false-positive rate · false-negative rate · how tracked?', ['<strong>If numbers not available — procurement-team conversation.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Patient-facing AI + consent · <em>Air Canada applies</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 deployment patterns · radiologist diagnoses · liability remains with the radiologist.', '<strong>Next:</strong> patient-facing AI · symptom checkers · Air Canada cross-domain · EU Art. 50 + India DPDPA · the 3-sentence consent script.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 70.0, slide: 3 }, { at: 80.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 255.0, slide: 5, step: 2 },
    { at: 275.0, slide: 6 }, { at: 285.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Patient-facing AI + consent' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-patient-facing.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · HIGHEST REPUTATIONAL RISK', h1Html: 'Chatbots · portals · <em>symptom checkers</em>', subtitleHtml: 'What the AI says to a patient becomes the hospital\'s statement. <strong>Air Canada Moffatt cross-domain applies directly.</strong>' },
    { type: 'content', eyebrow: 'What\'s deployed · 2026', icon: '1', headlineHtml: 'Scheduling · refills · <em>billing Q&amp;A</em>',
      blocks: [{ atStep: 1, html: card('PATIENT-FACING AI IN HEALTHCARE 2026', 'Patient chatbots · symptom-checker AI · discharge instruction AI · post-discharge follow-up bots', ['<strong>What works well:</strong> routine transactional interactions. Scheduling · status updates · FAQ automation. Material time savings for nurses + patient-services staff.', '<strong>What doesn\'t work:</strong> anything that veers into medical advice without physician review. <em>Symptom-checker AI in particular has been subject of multiple controversies 2023-24.</em>']) }] },
    { type: 'content', eyebrow: 'Air Canada cross-domain · applies directly', icon: '!', iconRed: true, headlineHtml: 'Coverage commitments · clinical statements · <em>hospital\'s statement</em>',
      blocks: [{ atStep: 1, html: cardRed('AIR CANADA CROSS-DOMAIN · APPLIES DIRECTLY', '"Air Canada is responsible for all information on its website, including from a chatbot"', ['<strong>Translate to healthcare:</strong> chatbot says "your insurance will cover this procedure" and it doesn\'t — hospital is on the hook.', '<strong>Chatbot says "you don\'t need to see a doctor for that symptom" and patient is having an MI — medical-malpractice exposure.</strong>'], 'Mitigation: retrieval-grounded on hospital-approved information · quote-or-cut on coverage + clinical statements · escalation triggers (diagnosis, treatment, coverage → human).') }] },
    { type: 'content', eyebrow: 'EU + UK + India regulatory frame', icon: '2', headlineHtml: 'EU Art. 50 · HIPAA · <em>India DPDPA</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('EU AI ACT ART. 50', 'Transparency · Aug 2 2026', '', '<strong>Patient must be told when interacting with AI.</strong>')}
${cell('US HIPAA', 'PHI handling', '', 'Patient-facing AI must respect minimum-necessary + de-identification.')}
${cell('INDIA DPDPA', 'Sensitive data', '', 'Health data is sensitive. <strong>Consent for AI use required.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Patient consent · 3-sentence script', icon: '3', headlineHtml: 'Disclosure · opt-out · <em>clinical primacy</em>',
      blocks: [
        { atStep: 1, html: card('THE 3-SENTENCE CONSENT SCRIPT', 'Emerging best practice — explicit consent at patient intake for AI use in care', ['<strong>1.</strong> "Some of your interactions with our hospital may involve AI tools that assist staff and clinicians."', '<strong>2.</strong> "You may opt out at any time."', '<strong>3.</strong> "AI does not replace your clinician\'s judgement."'], '3 sentences · 3 commitments — disclosure, opt-out, clinical primacy. Satisfies EU Art. 50 + aligns with HIPAA principles + increasingly the bar in clinical ethics.') },
        { atStep: 1, html: card('THE DISCIPLINE · HONOUR THE OPT-OUT', 'If patient declines, the hospital must have a non-AI-assisted workflow available', ['<strong>Don\'t ask for consent if you can\'t honour the no.</strong>']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Audit patient-facing AI surfaces · 5 patient interactions at random', ['Verify nothing AI said is a binding commitment · disclosure language present. <strong>Catch operational gaps before enforcement.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Payer AI + the controversy · <em>prior-auth investigations</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Anything AI says is hospital\'s statement · retrieval-grounded · quote-or-cut · escalation triggers · 3-sentence consent.', '<strong>Next:</strong> the most-contested healthcare AI use case. ProPublica + ABC investigations · the line between efficiency and patient harm.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Payer AI + the controversy' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-payer-ai.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · MOST-CONTESTED USE CASE', h1Html: 'Prior-auth · claims · <em>investigations</em>', subtitleHtml: 'ProPublica + ABC News investigations 2023-25. Class-action settlements. <strong>Approvals can be AI. Denials cannot be AI-only.</strong>' },
    { type: 'content', eyebrow: 'What payers deploy AI for · 2026', icon: '1', headlineHtml: 'Prior-auth · claims · <em>fraud · utilisation</em>',
      blocks: [{ atStep: 1, html: card('PAYER AI USE CASES 2026', 'Prior authorisation · claims processing · fraud detection · utilisation management', ['<strong>Value:</strong> faster decisions · lower admin cost · consistent rule application.', 'Payers report material operational savings from AI-augmented utilisation management.']) }] },
    { type: 'content', eyebrow: 'The controversy · ProPublica + ABC + litigation', icon: '!', iconRed: true, headlineHtml: 'Class actions · settlements · <em>state investigations</em>',
      blocks: [{ atStep: 1, html: cardRed('THE CONTROVERSY · 2023-2025', 'Multiple investigations + class actions through 2023-25', ['<strong>ProPublica investigation</strong> into large payer\'s AI-driven prior-auth denials.', '<strong>ABC News investigation</strong> into similar patterns.', '<strong>Class-action litigation</strong> alleging AI used to systematically deny medically-necessary care.'], 'Legal exposure: denial of medically-necessary care is actionable. Several large payers settled for material sums through 2024. <strong>State regulators in CA, NY, TX opened formal investigations into payer AI through 2025.</strong>') }] },
    { type: 'content', eyebrow: 'What went wrong + proposed CMS rules', icon: '2', headlineHtml: 'AI denials without timely physician review · <em>CMS rules coming</em>',
      blocks: [{ atStep: 1, html: card('WHAT WENT WRONG', 'AI scoring or filtering of prior-auth requests with insufficient physician review on denials', ['When AI denial happened — limited patient + provider path to appeal. Some cases — appeals also went through automated review.'], '<strong>Proposed CMS rules through 2025</strong> on prior-auth AI transparency. Requiring disclosure of AI use in coverage decisions · physician review of denials within specific timeframes. Early signs of mandatory regulation, not just litigation.') }] },
    { type: 'content', eyebrow: 'The line + provider posture', icon: '3', headlineHtml: 'Approvals can be AI · <em>denials need clinician in loop</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('EFFICIENCY SIDE', 'AI-augmented document review · fast-tracking approvals · screening complete vs incomplete submissions', '', 'Operationally sensible without harming patients.', 'green')}
${cell('HARM SIDE', 'AI-driven denials without timely human review · AI scoring that systematically denies subgroups · automated appeal denial', '', '<strong>Approvals can be AI-augmented. Denials cannot be AI-only.</strong> Licensed clinician (physician at payer) must be in the loop on denials of medically-necessary care.', 'red')}
</div>` },
        { atStep: 2, html: card('PROVIDER POSTURE', 'Engage top-5 payers on their AI use in prior-auth', ['What role does AI play in prior-auth decisions for your patients · what\'s the physician-review threshold · what\'s the appeal path?', '<strong>Increasingly material to provider-payer contract negotiations. Move ahead of the regulation.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Regulatory + ethical posture · <em>4 quadrants</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Approvals can be AI · denials need clinician in loop · transparency is coming.', '<strong>Next:</strong> FDA SaMD + EU MDR + EU AI Act + HIPAA + India DPDPA + NIST + CHAI · 5-section compliance and ethics document.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 125.0, slide: 4 }, { at: 135.0, slide: 4, step: 1 },
    { at: 185.0, slide: 5 }, { at: 195.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Regulatory and ethical posture' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-regulatory-posture.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · 4 QUADRANTS', h1Html: 'FDA · HIPAA · EU AI Act · <em>NIST + CHAI</em>', subtitleHtml: '5-section compliance and ethics document. <strong>The structure your board and CMO will require.</strong>' },
    { type: 'content', eyebrow: 'Quadrant 1 · clinical AI as medical device', icon: '1', headlineHtml: 'FDA SaMD + EU MDR + <em>CE marking</em>',
      blocks: [{ atStep: 1, html: card('QUADRANT 1 · MEDICAL DEVICE REGULATION', 'US FDA SaMD + EU MDR + IVDR + EU AI Act', ['<strong>FDA SaMD</strong> — Software as a Medical Device · premarket approval pathway since 2017 · 1000+ approved devices by mid-2025.', '<strong>EU MDR + IVDR</strong> — continue to apply alongside EU AI Act from Aug 2026. Most clinical AI requires CE marking under MDR.'], 'Pragmatic posture: build to FDA + CE marking + EU AI Act simultaneously. <strong>Procurement teams: validate vendors have credible regulatory path for your jurisdictions.</strong>') }] },
    { type: 'content', eyebrow: 'Quadrant 2 · health data protection', icon: '2', headlineHtml: 'HIPAA · DPDPA · <em>GDPR Art. 9 + Art. 22</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('US HIPAA', 'Privacy + Security Rules', '', 'BAA required with AI vendors processing PHI. Minimum-necessary principle.')}
${cell('INDIA DPDPA + HDMP', '2023-25', '', 'Health data = sensitive personal data. Consent required. Data fiduciary obligations.')}
${cell('EU GDPR', 'Art. 9 + Art. 22', '', 'Sensitive personal data — explicit consent typically required for AI use. Art. 22 automated-decision-making rights apply.')}
</div>` }] },
    { type: 'content', eyebrow: 'Quadrant 3 · EU AI Act', icon: '3', headlineHtml: 'Annex III · Art. 26 + Art. 27 · <em>Art. 99 fines</em>',
      blocks: [{ atStep: 1, html: card('QUADRANT 3 · EU AI ACT', 'Annex III categories include healthcare-adjacent', ['AI in critical infrastructure + essential services. Clinical decision support may be high-risk under the Act\'s framing.', '<strong>Art. 26 deployer obligations · Art. 27 FRIA · Art. 50 transparency · Art. 99 fines (up to €15M or 3% turnover).</strong>'], 'If your healthcare system operates in the EU, this applies.') }] },
    { type: 'content', eyebrow: 'Quadrant 4 · NIST + CHAI + physician orgs', icon: '4', headlineHtml: 'NIST AI RMF · CHAI · <em>5-section document</em>',
      blocks: [
        { atStep: 1, html: card('QUADRANT 4 · ETHICS + VOLUNTARY FRAMEWORKS', 'NIST AI RMF + CHAI + ABIM/AMA/CMS', ['<strong>NIST AI RMF (Govern/Map/Measure/Manage)</strong> — applies to clinical AI. Increasingly the bar for US-deployed clinical AI.', '<strong>Coalition for Health AI (CHAI)</strong> — voluntary US framework. Hospital + vendor signatories. Standards for clinical AI deployment, bias monitoring, transparency.', '<strong>ABIM/AMA/CMS</strong> — physician responsibility positions shape malpractice + regulatory standards.']) },
        { atStep: 1, html: card('THE COMPLIANCE + ETHICS DOCUMENT · 5 SECTIONS', 'For your CMO, CMIO, GC, and board', ['<strong>1.</strong> Clinical AI inventory (FDA cleared · EU AI Act classification).', '<strong>2.</strong> PHI handling (BAAs · data flows · retention).', '<strong>3.</strong> Physician responsibility framework per tool.', '<strong>4.</strong> Bias monitoring per tool · subgroup performance.', '<strong>5.</strong> Patient consent (info + opt-out).']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Draft v1 of 5-section document for top 3 clinical AI tools', ['<strong>If you can\'t fill section 4 (bias monitoring) — that\'s the procurement gap.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your hospital AI roadmap · <em>2 use cases · 4 trip-wires</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 quadrants · 5-section document · CMO/CMIO/board ready.', '<strong>Last chapter:</strong> 2-quarter hospital AI roadmap · 4 trust trip-wires · interactive builder.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 190.0, slide: 5 }, { at: 200.0, slide: 5, step: 1 }, { at: 265.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 }
  ]
});

const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],specialty:'',cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='usecases'){var arr=state.usecases;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='hospital-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases)_';var s=state.specialty||'_(pick specialty mix)_';var c=state.cadence||'_(pick cadence)_';return '# Hospital AI · 2-Quarter Roadmap\\n\\n**CMO / CMIO / GC:** ____________________\\n**Specialty mix:** '+s+'\\n**Start date:** ____________________\\n\\n## 2 use cases\\n'+uc+'\\n\\n## Bias + accuracy review cadence\\n'+c+'\\n\\n## Quarter 1\\n- Ambient scribing with BAA + 3-sentence patient consent + physician sign-off\\n- Radiology AI with radiologist-in-the-loop · false-positive/negative tracked\\n\\n## Quarter 2\\n- One clinical decision support use case with full physician-in-the-loop\\n- 4-quadrant regulatory posture · bias monitoring · hallucination monitoring\\n\\n## Trust trip-wires (do not cross)\\n- Physician responsibility for clinical decisions (ABIM + AMA + CMS)\\n- Patient consent for AI use in their care (EU Art. 50 + DPDPA)\\n- No prior-auth-style AI without appeal pathway\\n- No "set and forget" · quarterly bias monitoring · annual independent validation\\n\\n---\\nSource: Gennoor Academy · Industry · AI in Healthcare\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your hospital AI roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 2 USE CASES · 2 QUARTERS', h1Html: 'Pick 2 · <em>patient safety through-line</em>', subtitleHtml: '7 chapters · this chapter sequences them.' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Physician responsibility · <em>non-negotiable</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 2 quarters · patient safety as the through-line', ['<strong>Physician responsibility for clinical decisions is non-negotiable.</strong>', 'Pick the right 2 for your hospital\'s specialty mix and patient population.']) }] },
    { type: 'content', eyebrow: 'The sequence · default playbook', icon: '2', headlineHtml: 'Q1 scribing + radiology · <em>Q2 one CDS use case</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUARTER 1', 'Ambient scribing + radiology AI', '', '<strong>Most-proven productivity gain (2+ hrs/day per physician).</strong> Radiology AI with radiologist-in-the-loop — FDA-cleared, established workflow, manageable risk.', 'green')}
${cell('QUARTER 2', 'One CDS use case with physician-in-the-loop', '', 'Pick by strongest specialty leadership commitment. Apply 4-quadrant regulatory posture from chapter 7 · bias + hallucination monitoring · documentation that physician decided.')}
</div>` }, { atStep: 1, html: card('DEFER', 'Patient-facing diagnostic AI · payer-style AI · anything conflicting with 4-quadrant posture', ['Year 2 if controls hold.']) }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'Physician responsibility for clinical decisions', '', 'Physician decides. AI supports. Documentation reflects that.', 'red')}
${cell('TRIP-WIRE 2', 'Patient consent for AI use in care', '', 'EU Art. 50. India DPDPA. <strong>Increasingly the bar everywhere.</strong>', 'red')}
${cell('TRIP-WIRE 3', 'No prior-auth-style AI without appeal pathway', '', 'Payer: physician review of denials. Provider: engage payers on AI posture.', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly bias monitoring · annual independent validation · triggered review on patient-safety events.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pick · download · <em>take to CMO/CMIO/board</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases</h5><div class="preset" data-group="usecases">
<button data-val="Ambient scribing (Nuance DAX · Abridge · Suki) with BAA + consent">Ambient scribing</button>
<button data-val="Radiology AI (Aidoc · Annalise · Heuron) with radiologist-in-the-loop">Radiology AI</button>
<button data-val="Clinical decision support (Epic Cosmos · UpToDate Clinical AI · Tempus)">Clinical decision support</button>
<button data-val="Patient-facing chatbot (retrieval-grounded · 3-sentence consent)">Patient chatbot</button>
<button data-val="Oncology AI (Tempus · Flatiron · Owkin)">Oncology AI</button>
<button data-val="Discharge instructions AI (translation to patient-friendly language)">Discharge instructions</button>
</div></div>
<div class="group"><h5>Specialty mix</h5><div class="preset" data-group="specialty">
<button data-val="Multi-specialty academic medical centre">Academic medical centre</button>
<button data-val="Community hospital · primary care heavy">Community · primary care</button>
<button data-val="Specialty hospital (oncology / cardiology / paediatric)">Specialty hospital</button>
<button data-val="Payer organisation">Payer</button>
</div></div>
<div class="group"><h5>Bias + accuracy review cadence</h5><div class="preset" data-group="cadence">
<button data-val="Quarterly bias monitoring + annual independent validation + triggered review on patient-safety events">Quarterly · full</button>
<button data-val="Semi-annual bias monitoring + annual validation">Semi-annual</button>
<button data-val="Per-incident + annual portfolio review">Per-incident + annual</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my hospital AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Hospital AI · 2-Quarter Roadmap

Pick 2 use cases, specialty mix, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Patient safety · physician responsibility · <em>regulator-aware</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Patient safety as through-line · physician responsibility for clinical decisions · ambient scribing + radiology AI as Q1 · one CDS use case as Q2 · 4-quadrant regulatory posture (FDA SaMD + HIPAA + EU AI Act + India DPDPA) · bias + hallucination monitoring · patient consent honoured · the audit trail survives regulator review.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one CMO or CMIO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 50.0, slide: 3 }, { at: 60.0, slide: 3, step: 1 },
    { at: 115.0, slide: 4 }, { at: 125.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 },
    { at: 220.0, slide: 6 }, { at: 230.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 18 chapters 1-8 built.');
