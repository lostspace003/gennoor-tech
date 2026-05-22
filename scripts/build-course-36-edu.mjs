// Course 36 — AI in Education (Andrew · doc 05 #17 · NEW)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Education · AI in Schools, Colleges, Universities'
const OUT = 'tmp/academy-build/ai-in-education/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The AI in education landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · AUGMENT · DON\'T REPLACE', h1Html: '6 plays · 3 anti-plays · <em>the pedagogy-first filter</em>', subtitleHtml: '<strong>Pedagogy as the lens. Technology as the tool. Never the other way around.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Augments teachers + supports learners · <em>doesn\'t replace either</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Pedagogy as lens · technology as tool', ['AI in education succeeds when it <strong>augments teachers and supports learners — not when it replaces either</strong>.', 'Schools, colleges, universities that get this right keep pedagogy as the lens. Technology as the tool. <em>Never the other way around.</em>']) }] },
  { type: 'content', eyebrow: '6 plays', icon: '2', headlineHtml: 'Literacy · tutoring · educators · integrity · <em>equity · privacy</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'AI literacy as discipline', '', 'Students learn what AI is · where it works · where it doesn\'t.', 'green')}
${cell('P2', 'AI tutoring + writing partner', '', 'Personalised learning support.', 'green')}
${cell('P3', 'AI for educators', '', 'Lesson planning · feedback · grading support.', 'green')}
${cell('P4', 'Academic integrity (AI era)', '', 'Updated honour codes · assessment redesign.', 'green')}
${cell('P5', 'Equity + access', '', 'Lower barriers — or widen gaps if deployed without care.', 'green')}
${cell('P6', 'Privacy + safety', '', 'FERPA · COPPA · GDPR · child-safety guardrails.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-plays', icon: '!', iconRed: true, headlineHtml: 'AI replacing teachers · surveillance · <em>autonomous high-stakes grading</em>',
    blocks: [{ atStep: 1, html: cardRed('3 ANTI-PLAYS', 'Patterns that harm', ['<strong>1. AI replacing teachers.</strong> No evidence supports this at K-12 or undergraduate levels. Substantial harm when attempted.', '<strong>2. Surveillance-heavy AI.</strong> Cameras tracking · proctoring AI flagging "suspicious behaviour." Erodes trust · disproportionate impact on vulnerable students.', '<strong>3. AI grading high-stakes assessments autonomously.</strong> Final exams · admissions · certification. <em>Line nobody should cross without explicit human accountability.</em>']) }] },
  { type: 'content', eyebrow: 'Pedagogy-first filter', icon: '3', headlineHtml: 'Teachers + designers + AI specialists · <em>in the room from day one</em>',
    blocks: [
      { atStep: 1, html: card('THE PEDAGOGY-FIRST FILTER', 'Defining filter for AI in education', ['<strong>Does this technology serve a learning objective?</strong> If yes — proceed with discipline. If no, or if the answer is "vendor said it would help" — <em>refuse it</em>.'], '<strong>What works:</strong> teachers · learning designers · AI specialists in the room day one. Pedagogy leads. Technology follows. <strong>What doesn\'t:</strong> AI team picks the tool. Teachers adopt it later. Doesn\'t fit how learning happens.') },
      { atStep: 2, html: card('MONDAY MOVE', 'Identify one learning objective AI could legitimately support', ['Next 7 chapters give the discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'AI literacy as discipline · <em>4 components + age-appropriate</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Augment · 6 plays · 3 anti-plays · pedagogy-first.', '<strong>Next:</strong> 3 reasons · 4 components · age-appropriate sequencing.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'AI literacy as a discipline' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-literacy.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · TAUGHT EXPLICITLY', h1Html: '3 reasons · 4 components · <em>age-appropriate sequencing</em>', subtitleHtml: '<strong>Students already use AI. Better that they learn to use it well.</strong>' },
  { type: 'content', eyebrow: '3 reasons', icon: '1', headlineHtml: 'Already use · workplace · <em>civic responsibility</em>',
    blocks: [{ atStep: 1, html: card('3 REASONS AI LITERACY MUST BE A DISCIPLINE', '', ['<strong>1. Students already use AI.</strong> Whether the school teaches it or not. Better they learn to use it well.', '<strong>2. Workplace expectation.</strong> By 2030, AI fluency expected in most knowledge-work roles. Schools prepare or don\'t.', '<strong>3. Civic responsibility.</strong> Voting · consuming media · evaluating claims. AI literacy is increasingly civic literacy.']) }] },
  { type: 'content', eyebrow: '4 components', icon: '2', headlineHtml: 'What AI is · where it works · verification · <em>ethics</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('C1', 'What AI is and is not', '', 'Pattern matching at scale. <strong>Not reasoning in human sense. Not consciousness.</strong>', 'green')}
${cell('C2', 'Where AI works · where it doesn\'t', '', 'Good: summarising · drafting · classifying. Struggles: novel problems · current events · judgement.', 'green')}
${cell('C3', 'Verification', '', 'How to check AI output. <strong>Never trust without verification on consequential questions.</strong>', 'green')}
${cell('C4', 'Ethics', '', 'Bias · environmental cost · labour displacement · surveillance. <strong>Discussed openly, not avoided.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Age-appropriate sequencing', icon: '3', headlineHtml: 'Elementary · middle · high · <em>higher ed</em>',
    blocks: [{ atStep: 1, html: card('AGE-APPROPRIATE SEQUENCING', 'Not one-size-fits-all', ['<strong>Elementary:</strong> concept-level. "AI is a tool. Can be helpful. Can be wrong." Hands-on with scoped tools.', '<strong>Middle school:</strong> mechanics-level. Pattern matching · training data · limitations · verification.', '<strong>High school:</strong> critical-thinking level. Bias · ethics · career implications · independent use with judgement.', '<strong>Higher education:</strong> discipline-specific. Each major addresses AI\'s role in that field.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: '4 components · <em>sequencing appropriate</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI LITERACY PROGRAMME', '2 questions', ['<strong>Q1:</strong> curriculum includes all 4 components? Yes green · 2-3 amber · <strong><2 red</strong>.', '<strong>Q2:</strong> sequencing age-appropriate? Yes green · partial amber · <strong>no red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull current digital/tech literacy curriculum', ['Where does AI appear? With what depth? <strong>Gaps = curriculum-update priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'AI tutoring + writing partner · <em>where it works · where it disappoints</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 reasons · 4 components · age sequencing · scoring.', '<strong>Next:</strong> 3 working use cases · 3 disappointments · 3 design principles.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'AI tutoring and writing partner' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-tutoring.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · SUPPLEMENT · NOT SUBSTITUTE', h1Html: '3 working · 3 disappointing · <em>3 design principles</em>', subtitleHtml: '<strong>AI extends what teachers do. Never replaces the teacher relationship.</strong>' },
  { type: 'content', eyebrow: 'Where AI tutoring works', icon: '1', headlineHtml: 'Practice + feedback · writing scaffolding · <em>alternative explanations</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('W1', 'Practice + feedback at scale', '', 'Math · vocab · concept reinforcement. <strong>Scales personalised practice teacher with 30 students can\'t.</strong>', 'green')}
${cell('W2', 'Writing scaffolding', '', 'Brainstorming · outlines · sentence feedback. <strong>Valuable for students lacking home support.</strong>', 'green')}
${cell('W3', 'Explanation alternatives', '', 'Different angle · example · metaphor when one explanation doesn\'t land.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Where AI tutoring disappoints', icon: '!', iconRed: true, headlineHtml: 'Novel/current · misconceptions · <em>motivation + relationship</em>',
    blocks: [{ atStep: 1, html: cardRed('WHERE AI TUTORING DISAPPOINTS', 'And why', ['<strong>1. Novel or current topics.</strong> Training cutoff + confidently wrong about recent material.', '<strong>2. Deep conceptual misconceptions.</strong> Students with foundational gaps need a human to diagnose. <em>AI gives answer without diagnosing the gap.</em>', '<strong>3. Motivation + relationship.</strong> Students show up for teachers they trust · friends they study with. <em>AI doesn\'t replace the social fabric of learning.</em>']) }] },
  { type: 'content', eyebrow: '3 design principles', icon: '2', headlineHtml: 'Supplement · bounded by teacher · <em>explicit on limitations</em>',
    blocks: [{ atStep: 1, html: card('3 DESIGN PRINCIPLES', 'For AI tutoring deployment', ['<strong>1. Supplement, never substitute.</strong> AI extends teacher work. Never replaces the teacher relationship.', '<strong>2. Bounded by teacher judgement.</strong> Teachers decide when AI helps. Teachers see what students do with AI. <em>Visibility matters.</em>', '<strong>3. Explicit on limitations.</strong> Students learn what AI can and cannot help with — modelled, not lectured.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Supplement vs substitute · <em>teacher visibility</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI TUTORING DEPLOYMENT', '2 questions', ['<strong>Q1:</strong> AI supplement, not substitute? Yes green · drift to substitute amber · <strong>substitute by design red</strong>.', '<strong>Q2:</strong> teachers have visibility into student AI use? Yes green · partial amber · <strong>no red — black-box use</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sit with one student using AI for 15 min', ['What did they ask? What did AI return? <strong>That observation reveals whether AI is helping or replacing learning.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'AI for educators · <em>where AI returns time to teaching</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 working · 3 disappointing · 3 principles · scoring.', '<strong>Next:</strong> 4 use cases · the grading line · 3 failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'AI for educators' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-educators.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · TIME RETURNED TO TEACHING', h1Html: '4 use cases · grading line · <em>3 failure modes</em>', subtitleHtml: '<strong>AI assists with speed. Teachers own the judgement.</strong>' },
  { type: 'content', eyebrow: '4 educator use cases', icon: '1', headlineHtml: 'Lesson planning · feedback · differentiation · <em>admin reduction</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('U1', 'Lesson planning support', '', 'AI drafts outlines · suggests activities · surfaces examples. <strong>Teacher edits · adapts · owns.</strong>', 'green')}
${cell('U2', 'Formative feedback at scale', '', 'Quick feedback on drafts · problems · posts. <strong>Teachers focus on highest-value moments.</strong>', 'green')}
${cell('U3', 'Differentiation', '', 'Variants — same concept · different reading levels · examples · scaffolds.', 'green')}
${cell('U4', 'Administrative reduction', '', 'Parent comms · IEP summaries · organising. <strong>Time goes back to teaching.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The grading line', icon: '!', iconRed: true, headlineHtml: 'AI as first-pass · <em>teacher owns the grade</em>',
    blocks: [{ atStep: 1, html: cardRed('THE GRADING LINE', 'Most-debated educator AI use case', ['<strong>What works:</strong> AI as first-pass grading. Identifies obvious correct answers · surfaces concerning patterns. <em>Teacher reviews everything · owns final grade.</em>', '<strong>What doesn\'t:</strong> AI as autonomous grader on consequential assessments. Bias · error · student trust make this a line.'], '<strong>Discipline:</strong> teacher in the loop on every grade that matters. AI assists with speed. Teachers own the judgement.') }] },
  { type: 'content', eyebrow: '3 educator AI failure modes', icon: '!', iconRed: true, headlineHtml: 'Homogenisation · feedback fatigue · <em>privacy creep</em>',
    blocks: [{ atStep: 1, html: cardRed('3 EDUCATOR AI FAILURE MODES', 'Specific to educator deployment', ['<strong>1. Homogenisation.</strong> All teachers using same AI prompts → all lessons look similar. <em>Loses teacher\'s voice.</em>', '<strong>2. Feedback fatigue.</strong> AI-generated feedback is detectable. Students stop reading it. <em>Loop broken.</em>', '<strong>3. Privacy creep.</strong> AI tool indexes student work · parent comms · IEP notes. <em>Read the contracts.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '2', headlineHtml: 'Returns time vs shifts work · <em>voice maintained</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE EDUCATOR AI DEPLOYMENT', '2 questions', ['<strong>Q1:</strong> AI returns time to teaching, or just shifts work? Time-saving green · neutral amber · <strong>new work red</strong>.', '<strong>Q2:</strong> teachers maintaining their voice in AI-assisted lessons? Yes green · drift to template amber · <strong>homogenisation red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Survey 5 teachers using AI tools', ['What time did it save? Where did they edit AI output heavily? <strong>Their patterns = training priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Academic integrity · <em>detection-only fails + 3 pillars</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '4 use cases · grading line · 3 failure modes · scoring.', '<strong>Next:</strong> detection trap · 3 integrity pillars · 3-tier disclosure model.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Academic integrity in the AI era' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-integrity.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · BEYOND DETECTION', h1Html: 'Detection trap · 3 pillars · <em>3-tier disclosure</em>', subtitleHtml: '<strong>Detection alone is not a foundation. It\'s part of a broader strategy at best.</strong>' },
  { type: 'content', eyebrow: 'The detection trap', icon: '!', iconRed: true, headlineHtml: 'Unacceptable false-positives · <em>disproportionate impact</em>',
    blocks: [{ atStep: 1, html: cardRed('THE DETECTION TRAP', 'First instinct when AI arrived in classrooms', ['<strong>The instinct:</strong> build detection tools · catch AI-generated work · punish students.', '<strong>What happened in practice:</strong> AI detection tools have unacceptable false-positive rates.', 'ESL students · students with learning differences · students with naturally unusual writing patterns — <em>disproportionately flagged.</em>'], '<strong>Discipline:</strong> detection alone is NOT a foundation for academic integrity in the AI era. Part of a broader strategy at best.') }] },
  { type: 'content', eyebrow: '3 integrity pillars', icon: '1', headlineHtml: 'Assessment redesign · explicit policy · <em>ongoing conversation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'Assessment redesign', '', 'In-class work · conversations with student · collaborative problem-solving · defending verbally.', 'green')}
${cell('P2', 'Explicit policy', '', 'Honour codes updated. <strong>Where is AI permitted? Where not? With what disclosure?</strong>', 'green')}
${cell('P3', 'Ongoing conversation', '', 'Not one-time signature day one. <strong>Ongoing dialogue throughout term.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3-tier disclosure model', icon: '2', headlineHtml: 'Prohibited · permitted with disclosure · <em>required</em>',
    blocks: [{ atStep: 1, html: card('THE DISCLOSURE MODEL', 'Works in higher ed + increasingly in high school', ['<strong>Tier 1 — AI prohibited.</strong> Specific assessments requiring original work. In-class essays · defended oral exams. Clearly labelled.', '<strong>Tier 2 — AI permitted with disclosure.</strong> Drafts · brainstorming · editing support. Students disclose what they used, how, why. <em>Disclosure is graded.</em>', '<strong>Tier 3 — AI required.</strong> Some courses train students to use AI effectively. Use is part of the learning objective.'], '<strong>What works:</strong> tier labels on every assessment. <strong>What doesn\'t:</strong> blanket policy ignoring context.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Diversified portfolio · <em>policy per assessment</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE ACADEMIC INTEGRITY READINESS', '2 questions', ['<strong>Q1:</strong> assessment portfolio diversified, or heavy on take-home essays? Diversified green · partial amber · <strong>primarily take-home red</strong>.', '<strong>Q2:</strong> students know AI policy per assessment? Clearly yes green · partial amber · <strong>no/general policy red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull one course syllabus', ['Does it specify AI policy by assessment? <strong>Gaps = policy-clarification priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Equity + access · <em>can lower barriers or widen gaps</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Detection trap · 3 pillars · 3-tier · scoring.', '<strong>Next:</strong> two-direction reality · 3 benefits · 3 risks.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Equity and access' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-equity.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · TWO-DIRECTION REALITY', h1Html: '3 benefits · <em>3 risks</em>', subtitleHtml: '<strong>The direction depends on deployment discipline. Not on the technology itself.</strong>' },
  { type: 'content', eyebrow: 'Two-direction reality', icon: '1', headlineHtml: 'Lower barriers · <em>or widen gaps</em>',
    blocks: [{ atStep: 1, html: card('THE TWO-DIRECTION REALITY', 'AI can move equity either way', ['AI in education can move equity in either direction.', '<strong>Lower barriers</strong> for students lacking tutoring · language support · scaffolding at home.', '<strong>Or widen gaps</strong> — wealthier families afford premium AI tutors while under-resourced schools get free, less-effective tools.'], '<strong>The direction depends on deployment discipline.</strong> Not on the technology itself.') }] },
  { type: 'content', eyebrow: '3 equity benefits', icon: '2', headlineHtml: 'First-gen · language learners · <em>learning differences</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('B1', 'First-gen college students', '', 'Scaffolding for writing · application essays · navigating college bureaucracy. <strong>Levels access.</strong>', 'green')}
${cell('B2', 'Language learners', '', 'Explanation in first language · translation support. <strong>Reduces cognitive load.</strong>', 'green')}
${cell('B3', 'Learning differences', '', 'Speech-to-text · text-to-speech · reading-level adaptation. <strong>Genuinely enabling.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 equity risks', icon: '!', iconRed: true, headlineHtml: 'Premium divide · bias · <em>surveillance disparity</em>',
    blocks: [{ atStep: 1, html: cardRed('3 EQUITY RISKS · NAME + MITIGATE', '', ['<strong>1. Premium-tier divide.</strong> Wealthier families pay for premium AI tutors. Under-resourced schools use free tools. <em>Gap widens.</em>', '<strong>2. Bias in AI outputs.</strong> Training data underrepresents communities. AI generates examples/names/contexts mirroring majority culture. <em>Marginalises students whose experience isn\'t represented.</em>', '<strong>3. Surveillance disparity.</strong> AI proctoring · plagiarism detection · behaviour monitoring disproportionately flag students of colour · disabilities · non-standard backgrounds.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Equal deployment · <em>equity-impact analysis</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE AI EQUITY DISCIPLINE', '2 questions', ['<strong>Q1:</strong> AI tools deployed equally across schools/sections, or concentrated in already-resourced? Equal green · partial amber · <strong>concentrated red</strong>.', '<strong>Q2:</strong> equity-impact analysis done before deployment? Formal yes green · informal amber · <strong>no red — disparate impact unknown</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull AI tool deployment data by school/section', ['Where is AI access uneven? <strong>That gap = equity priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Privacy + safety · <em>FERPA · COPPA · GDPR · guardrails</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Two-direction · 3 benefits · 3 risks · scoring.', '<strong>Next:</strong> 4 regulatory frames · 3 contract essentials · child-safety guardrails.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Privacy and safety' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-privacy.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · FOUNDATION OF TRUST', h1Html: '4 frames · 3 contract essentials · <em>child-safety guardrails</em>', subtitleHtml: '<strong>Without all three contract provisions, AI deployment has data risk you haven\'t disclosed to parents.</strong>' },
  { type: 'content', eyebrow: '4 regulatory frames', icon: '1', headlineHtml: 'FERPA · COPPA · GDPR · <em>institutional</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('F1', 'FERPA (US)', '', 'Student educational records protected. AI vendors processing records = school officials with strict limits.', 'green')}
${cell('F2', 'COPPA (under-13s)', '', 'Strict consent requirements. <strong>Many consumer AI tools terms don\'t permit under-13.</strong>', 'green')}
${cell('F3', 'GDPR + equivalents', '', 'EU · UK · India DPDPA · Brazil LGPD. <strong>Special categories + child-specific protections.</strong>', 'green')}
${cell('F4', 'Institutional + state', '', 'Many states + institutions have AI-specific policies layered. <strong>Check before procuring.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 contract essentials', icon: '!', iconRed: true, headlineHtml: 'No training · residency + deletion · <em>incident notification</em>',
    blocks: [{ atStep: 1, html: cardRed('3 VENDOR CONTRACT ESSENTIALS', 'Without all three: undisclosed data risk', ['<strong>1. Student data not used for model training.</strong> Vendor cannot train general models on your students\' data. <em>Get this in writing.</em>', '<strong>2. Data residency and deletion.</strong> Where stored? How deleted when student leaves? <em>Default vendor terms often inadequate.</em>', '<strong>3. Incident notification.</strong> Vendor breach → you find out promptly. <em>Specified timeframe + process in the contract.</em>']) }] },
  { type: 'content', eyebrow: 'Child-safety guardrails', icon: '2', headlineHtml: 'Content filtering · crisis detection · <em>no manipulation</em>',
    blocks: [{ atStep: 1, html: card('CHILD-SAFETY GUARDRAILS', 'Configure deliberately', ['<strong>1. Content filtering enabled.</strong> AI responses appropriate for age group. Vendors offer settings.', '<strong>2. Crisis detection.</strong> Self-harm or distress expressed → surface to human appropriately. <em>Designed in, not bolted on.</em>', '<strong>3. No manipulation.</strong> No fake relationship dynamics. No engagement-maximising patterns. <em>Pedagogy, not retention metrics.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Contracts reviewed · <em>guardrails configured</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PRIVACY + SAFETY READINESS', '2 questions', ['<strong>Q1:</strong> every AI vendor contract reviewed by legal with 3 essentials? Yes green · most amber · <strong>some/none red</strong>.', '<strong>Q2:</strong> child-safety guardrails configured + tested before deployment? Yes green · partial amber · <strong>no red — incident risk material</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List every AI vendor your school uses with student data', ['For each: contract reviewed? Guardrails configured? <strong>Gaps are urgent.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: '12-month rollout · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 frames · 3 contract essentials · child-safety · scoring.', '<strong>Last chapter:</strong> 12-month rollout · 4 trust trip-wires · interactive builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',pilot:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='school-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var pi=state.pilot||'_(pick pilot scope)_';var s=state.sponsor||'_(pick sponsor)_';return '# AI in Education · 12-Month School/Institution Roadmap\\n\\n**Leader:** ____________________\\n**Start date:** ____________________\\n\\n## Q1 starting play\\n> '+p+'\\n\\n## Pilot scope\\n> '+pi+'\\n\\n## Executive sponsor\\n> '+s+'\\n\\n## 12-Month Rollout\\n- Q1: foundation — literacy curriculum · privacy + contract review · equity baseline\\n- Q2: educator support pilot\\n- Q3: student-facing rollout · integrity policy update\\n- Q4: institutionalisation · equity outcomes measured\\n\\n## 4 trust trip-wires (do not cross)\\n- AI replacing teachers — always augment\\n- AI grading high-stakes assessments autonomously — teacher accountability non-negotiable\\n- Surveillance over support — trust collapses\\n- Privacy theatre — vendor contracts without the 3 essentials\\n\\n---\\nSource: Gennoor Academy · AI in Education\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 12-MONTH ROADMAP', h1Html: '12 months · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>AI in education succeeds when pedagogy leads and technology follows.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Pedagogy leads · <em>technology follows</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Augment teachers · support learners', ['AI in education succeeds when it augments teachers and supports learners. <strong>Six plays · three anti-plays · the pedagogy-first filter.</strong>']) }] },
  { type: 'content', eyebrow: '12-month rollout', icon: '2', headlineHtml: 'Foundation · educator pilot · student rollout · <em>institutionalisation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('Q1', 'Foundation', '', 'AI literacy curriculum drafted · privacy + contract review · equity baseline captured.')}
${cell('Q2', 'Educator support pilot', '', 'Lesson planning + feedback AI piloted with willing teachers. Training built.', 'amber')}
${cell('Q3', 'Student-facing rollout', '', 'Tutoring/writing partner in selected classes. Integrity policy updated.', 'green')}
${cell('Q4', 'Institutionalisation', '', 'Successful pilots expanded. Equity outcomes measured. Year 2 informed.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Replace teachers · autonomous grading · surveillance · <em>privacy theatre</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'AI replacing teachers', '', 'No evidence · substantial harm. Always augment.', 'red')}
${cell('W2', 'Autonomous grading high-stakes', '', 'Teacher accountability non-negotiable.', 'red')}
${cell('W3', 'Surveillance over support', '', 'Trust collapses the moment AI becomes monitoring.', 'red')}
${cell('W4', 'Privacy theatre', '', 'Contracts without 3 essentials then telling parents data is protected. Don\'t.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · pilot · sponsor · <em>take to leadership Monday</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Q1 starting play</h5><div class="preset" data-group="play">
<button data-val="AI literacy curriculum — foundational discipline for students at age-appropriate sequencing">AI literacy curriculum</button>
<button data-val="Educator AI for lesson planning + formative feedback — willing teacher pilot">Educator AI pilot</button>
<button data-val="Privacy + contract review across existing AI vendors (urgent if not done)">Privacy + contract review</button>
<button data-val="AI tutoring/writing partner in scoped classroom pilot — supplement only">AI tutoring pilot</button>
</div></div>
<div class="group"><h5>Pilot scope</h5><div class="preset" data-group="pilot">
<button data-val="Single grade/department — controlled, measurable, willing participants">Single grade/dept</button>
<button data-val="Cross-school cohort — broader visibility, more complex coordination">Cross-school cohort</button>
<button data-val="Whole institution literacy curriculum — broad reach, lower deployment complexity">Whole institution (literacy)</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="Superintendent / Head of School with curriculum + IT partnership">Super/Head + curriculum + IT</button>
<button data-val="Provost / Dean with academic affairs + general counsel partnership (higher ed)">Provost/Dean + counsel</button>
<button data-val="Joint cabinet (academic + IT + legal + equity officer)">Joint cabinet</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my school AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># AI in Education · 12-Month School/Institution Roadmap

Pick Q1 play, pilot scope, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Augment · 6 plays · 3 anti-plays · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI in education succeeds when it augments teachers and supports learners. Six plays — literacy, tutoring, educator support, integrity, equity, privacy. Three anti-plays. Pedagogy-first filter. Four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your Q1 starting play and pilot scope.</div><div class="row"><span class="arr">→</span>Get one leadership conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 36 chapters 1-8 built.')
