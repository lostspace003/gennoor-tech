// Course 33 — AI in Manufacturing (Emma · doc 05 #15)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Industry · AI in Manufacturing'
const OUT = 'tmp/academy-build/ai-in-manufacturing/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The manufacturing AI landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · PLANT-FLOOR REALITY', h1Html: '6 plays · 3 anti-plays · <em>OT/IT bridge filter</em>', subtitleHtml: '<strong>Pilot small, prove value in production conditions, then expand.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Plant-floor reality · <em>not vendor demo</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Sensors fail · lighting changes · networks go down', ['Manufacturing AI is plant-floor reality, not vendor demo. Sensors fail. Lighting changes. Operators make judgement calls. Networks go down.'], 'Teams that ship work <em>with</em> this reality, not against it. <em>Pilot small. Prove value in production conditions. Then expand.</em>') }] },
  { type: 'content', eyebrow: '6 plays that ship', icon: '2', headlineHtml: 'PdM · quality vision · process · supply chain · safety · <em>digital twin</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('P1', 'Predictive maintenance', '', 'Sensor data + AI surfaces failures before they happen.', 'green')}
${cell('P2', 'Quality vision', '', 'AI vision catches defects faster + higher coverage than sampling.', 'green')}
${cell('P3', 'Process optimisation', '', 'AI surfaces multi-parameter interactions humans miss.', 'green')}
${cell('P4', 'Supply chain integration', '', 'Demand · material · equipment signals reach scheduling in real time.', 'green')}
${cell('P5', 'Safety AI', '', 'PPE · ergonomic · near-miss detection augmenting human attention.', 'green')}
${cell('P6', 'Pragmatic digital twin', '', '6-month bounded scope. Specific use case. Not megaproject.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-plays', icon: '!', iconRed: true, headlineHtml: 'Autonomous safety-critical · 18-mo megaproject · <em>no OT integration</em>',
    blocks: [{ atStep: 1, html: cardRed('3 MANUFACTURING AI ANTI-PLAYS', 'Predictable failures', ['<strong>1. Autonomous decisions on safety-critical equipment.</strong> Always human in loop. Always.', '<strong>2. Eighteen-month digital-twin megaproject.</strong> Bounded scope or budget gets pulled.', '<strong>3. AI without OT system integration.</strong> Insights surface, nobody acts. <em>Plant systems are how decisions get made.</em>']) }] },
  { type: 'content', eyebrow: 'OT/IT bridge filter', icon: '3', headlineHtml: 'Plant engineering + IT + AI in the room · <em>day one</em>',
    blocks: [
      { atStep: 1, html: card('THE OT/IT BRIDGE FILTER', 'The defining filter for manufacturing AI', ['<strong>OT</strong> — operational technology, what runs the plant. <strong>IT</strong> — information technology, what runs the business. AI lives between them.', '<strong>Sensor data is OT. Analytics is IT. The bridge is where most projects fail.</strong>'], '<strong>What works:</strong> plant engineering + IT + AI team in the room from day one. Plant engineers own use case · AI team owns model · IT owns integration. <strong>What doesn\'t:</strong> AI team in HQ builds model · plant gets it last · doesn\'t fit operational reality.') },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick the one play your plant is most actively pursuing', ['Next 7 chapters give you the operational discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Predictive maintenance · <em>narrative layer engineers act on</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Plant-floor reality · 6 plays · 3 anti-plays · OT/IT bridge filter.', '<strong>Next:</strong> 3 sensor coverage decisions · narrative layer · 3 project killers.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Predictive maintenance for plants' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-predictive-maintenance.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · WHERE AI PAYS BACK FASTEST', h1Html: '3 sensor decisions · narrative layer · <em>3 killers</em>', subtitleHtml: '<strong>Clear economics. Available sensor data. Concrete actions.</strong>' },
  { type: 'content', eyebrow: 'Why this play first', icon: '1', headlineHtml: '3 pieces must line up · <em>or AI predictions get ignored</em>',
    blocks: [{ atStep: 1, html: card('WHY PREDICTIVE MAINTENANCE OFTEN COMES FIRST', 'Clear economics · available data · concrete actions', ['<strong>Unplanned downtime costs are measurable.</strong> Sensors on critical assets are common. AI surfaces "this asset will fail" — maintenance team acts on it.'], 'The pattern works when three pieces line up. <strong>Quality sensor coverage · model that catches real failure modes · maintenance workflow that uses predictions.</strong> When any one is missing → predictions ignored. Failures still happen.') }] },
  { type: 'content', eyebrow: '3 sensor coverage decisions', icon: '2', headlineHtml: 'Which assets · which types · <em>which frequency</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('D1', 'Which assets', '', '<strong>Pareto:</strong> 20% of assets cause 80% of unplanned downtime. Start there.', 'green')}
${cell('D2', 'Which sensor types', '', 'Vibration for rotating · temperature for electrical/thermal · current for motors · oil chemistry for high-value drivetrains. <strong>Match sensor to failure mode.</strong>', 'green')}
${cell('D3', 'Sampling frequency', '', 'High frequency catches more but costs more. <strong>Match to failure mode timescale.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The narrative layer', icon: '3', headlineHtml: 'Engineers don\'t act on probability scores · <em>they act on what + why + what to inspect</em>',
    blocks: [{ atStep: 1, html: card('THE NARRATIVE LAYER', 'Translates model output → actionable guidance', ['Maintenance engineers do not act on probability scores. They act on <strong>what\'s wrong, why, what to inspect, what to repair</strong>.', 'Example: <em>"Bearing wear pattern detected — vibration spectrum shows characteristic frequency. Inspect within 48 hours. Likely root cause: lubrication."</em>'], '<strong>Without the narrative:</strong> predictions are ignored. The engineer who\'s been with this asset for 10 years doesn\'t trust a probability score.') }] },
  { type: 'content', eyebrow: '3 project killers', icon: '!', iconRed: true, headlineHtml: 'Sensor data quality · alert fatigue · <em>CMMS disconnect</em>',
    blocks: [
      { atStep: 1, html: cardRed('3 PROJECT KILLERS', 'Patterns to avoid', ['<strong>1. Sensor data quality.</strong> Sensors degrade · calibration drifts · network drops. Data infrastructure first or models drift silently.', '<strong>2. Alert fatigue.</strong> Too many false positives → maintenance team stops responding. Tune for precision over recall in mature deployment.', '<strong>3. Disconnect from CMMS.</strong> Predictions in separate dashboard · maintenance uses existing system. <em>Integration is must, not phase two.</em>']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull top 10 assets by unplanned downtime cost', ['For each: sensor coverage · model coverage · CMMS integration? <strong>That gap analysis = maintenance AI investment priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Quality vision · <em>operator labelling loop + false-confidence</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '3 sensor decisions · narrative layer · 3 project killers.', '<strong>Next:</strong> 3 messy challenges · 3-stage labelling loop · false-confidence year-2 failure mode.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Quality vision AI' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-quality-vision.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · MESSY-REAL-WORLD', h1Html: '3 challenges · labelling loop · <em>false-confidence discipline</em>', subtitleHtml: '<strong>Quality vision in a lab is easy. In a plant — messy.</strong>' },
  { type: 'content', eyebrow: '3 messy challenges', icon: '1', headlineHtml: 'Lighting · drift · <em>novel defects</em>',
    blocks: [{ atStep: 1, html: cardRed('3 MESSY-REAL-WORLD CHALLENGES', 'Plant ≠ lab', ['<strong>1. Lighting variability.</strong> Sunlight through windows · shift changes. Models trained in one condition fail in another.', '<strong>2. Model drift.</strong> Material lots change · suppliers change · process drifts. Today\'s good part = tomorrow\'s defect signature.', '<strong>3. Novel defects.</strong> Models only know what they\'ve seen. New failure mode shows up → model misses → bad parts ship.']) }] },
  { type: 'content', eyebrow: '3-stage operator labelling loop', icon: '2', headlineHtml: 'Capture · review · <em>retrain</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Disagreement capture', '', 'AI says defect + operator says good (or reverse) → capture both labels with image.', 'green')}
${cell('S2', 'Weekly review', '', 'Quality engineer reviews. <strong>Real defect? Real false positive? Edge case worth retraining on?</strong>', 'green')}
${cell('S3', 'Retraining cadence', '', 'Quarterly minimum. Monthly if disagreements compound. <strong>Continuous learning, not one-time training.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'False-confidence trap', icon: '!', iconRed: true, headlineHtml: 'Year 1 good · year 2 silent degradation · <em>3 disciplines</em>',
    blocks: [{ atStep: 1, html: cardRed('FALSE-CONFIDENCE · YEAR 2 FAILURE MODE', 'Performance degrades. Team still trusts it.', ['<strong>Year 1:</strong> model deploys, performs well, team builds trust. <strong>Year 2:</strong> performance degrades. Team still trusts it. <em>False confidence becomes the operational risk.</em>'], '<strong>Discipline 1 — performance dashboards visible to plant leadership weekly.</strong> <strong>Discipline 2 — sampling audits.</strong> Periodic human review of model decisions on random sample. <strong>Discipline 3 — defect escape tracking.</strong> When defects reach customers, root cause back to model.') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Defect escape rate · <em>labelling loop running</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE QUALITY VISION', '2 questions', ['<strong>Q1:</strong> defect escape rate last 12 mo vs pre-AI baseline? Lower green · same amber · <strong>higher red — AI making it worse</strong>.', '<strong>Q2:</strong> operator labelling loop running with weekly review? Yes green · inconsistent amber · <strong>no red — model degrading silently</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last 3 months of customer defect complaints', ['For each: was the defect type in training data? <strong>That answer = retraining priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Process optimisation · <em>operator-led experiments + overfitting guards</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 challenges · 3-stage labelling loop · false-confidence · 2-question scoring.', '<strong>Next:</strong> 3 signals AI surfaces · operator-led design · 3 overfitting guards.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Process optimisation with AI' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-process-optimisation.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · WHAT HUMANS MISS', h1Html: '3 signals · operator-led · <em>3 overfitting guards</em>', subtitleHtml: '<strong>AI surfaces. Operators decide.</strong>' },
  { type: 'content', eyebrow: '3 signals AI surfaces', icon: '1', headlineHtml: 'Multi-parameter · drift · <em>best-shift patterns</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('S1', 'Multi-parameter interactions', '', 'Operators tune one variable. AI sees how 4-5 variables interact non-linearly. <strong>Combinations the eye can\'t track.</strong>', 'green')}
${cell('S2', 'Drift', '', 'Process variables drift over weeks. Operators normalise to it. <strong>AI catches the trend against historical baseline.</strong>', 'green')}
${cell('S3', 'Best-shift patterns', '', 'Why does shift A outperform shift B? AI surfaces parameter combinations. <strong>Standardise the winning pattern.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Operator-led experiments', icon: '2', headlineHtml: 'AI proposes · <em>operators decide</em>',
    blocks: [{ atStep: 1, html: card('OPERATOR-LED EXPERIMENT DESIGN', 'Why operator-led works', ['Operators know the constraints AI doesn\'t see in data. <strong>Safety. Maintainability. Customer-specific quality requirements.</strong>', '<strong>Why AI-led fails:</strong> AI proposes parameter combination · looks great in data · breaks something nobody told the model about.'], '<strong>The cadence:</strong> AI surfaces 5 candidates per week. Operator team picks 1-2 to trial. Trial runs in production with quality oversight.') }] },
  { type: 'content', eyebrow: '3 overfitting guards', icon: '!', iconRed: true, headlineHtml: 'Out-of-sample · physical-reasoning · <em>small-stake trials</em>',
    blocks: [{ atStep: 1, html: cardRed('3 GUARDS AGAINST OVERFITTING TRAP', 'Predictable failure mode', ['<strong>1. Out-of-sample validation.</strong> Model fitting training data perfectly often fails on new. Test on held-out: month-out, season-out, supplier-lot-out.', '<strong>2. Physical-reasoning check.</strong> Run optimal setting past a process engineer with 20 years on this line. <em>If they say "that doesn\'t fit how the process actually works" — listen.</em>', '<strong>3. Small-stake trials before commit.</strong> Don\'t switch full production. One line · one shift · full quality oversight first.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Measurable improvement · <em>operator team owns the cadence</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE PROCESS OPTIMISATION', '2 questions', ['<strong>Q1:</strong> last 6 mo — AI-recommended change measurably improved yield/quality/throughput? Yes clear data green · improvement hard to attribute amber · <strong>no red</strong>.', '<strong>Q2:</strong> operator team owns experimental cadence and decisions? Yes green · AI team drives operators follow amber · <strong>AI team alone red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick one process metric stuck at plateau over a year', ['Ask AI team to surface multi-parameter candidates. <strong>Operator team picks one to trial this quarter.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Plant-floor supply chain · <em>real-time re-planning</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 signals · operator-led · 3 overfitting guards · 2-question scoring.', '<strong>Next:</strong> 3 signal flows · 3 re-planning cadences · 3 failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Plant-floor supply chain integration' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-supply-chain-integration.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · REAL-TIME RE-PLANNING', h1Html: '3 signal flows · 3 cadences · <em>3 failure modes</em>', subtitleHtml: '<strong>AI proposes at each cadence. Humans decide.</strong>' },
  { type: 'content', eyebrow: '3 signal flows', icon: '1', headlineHtml: 'Demand · material/supplier · <em>equipment availability</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('F1', 'Demand signal', '', 'Customer orders change · forecast updates · urgent orders. <strong>Scheduling needs to know within hours, not days.</strong>', 'green')}
${cell('F2', 'Material + supplier', '', 'Lots arriving · quality issues · supplier disruption. <strong>Scheduling adjusts which jobs run when.</strong>', 'green')}
${cell('F3', 'Equipment availability', '', 'PdM flags inspection · equipment down. <strong>Scheduling reroutes or shifts timeline.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 re-planning cadences', icon: '2', headlineHtml: 'Strategic monthly · tactical weekly · <em>operational real-time</em>',
    blocks: [{ atStep: 1, html: card('3 RE-PLANNING CADENCES IN PRACTICE', 'AI proposes · humans decide', ['<strong>Strategic monthly:</strong> capacity allocation across lines · major orders · inventory positioning. Months out.', '<strong>Tactical weekly:</strong> week-ahead production plan · order sequencing · material commitment. AI surfaces, planning team adjusts + commits.', '<strong>Operational real-time:</strong> hour-to-hour disruption response. AI surfaces options, plant manager decides.'], '<strong>What works:</strong> AI proposes at each cadence · humans decide. <strong>What doesn\'t:</strong> AI auto-changes plans without review · plant operators wake up to plans they don\'t understand.') }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Latency · signal conflict · <em>plan trust erosion</em>',
    blocks: [{ atStep: 1, html: cardRed('3 INTEGRATION FAILURE MODES', 'When integration breaks', ['<strong>1. Signal latency.</strong> Material quality issue surfaces in lab system · 3 days to reach scheduling. Plans continue against bad material.', '<strong>2. Signal conflict.</strong> Demand says "run more A." Supplier says "material for A delayed." <em>Scheduling defaults to old plan.</em>', '<strong>3. Plan trust erosion.</strong> AI surfaces re-plan · planning overrides · cycle repeats. Trust erodes. AI insights ignored.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Schedule churn · <em>planners act on AI</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INTEGRATION', '2 questions', ['<strong>Q1:</strong> last quarter — how often did production plan change after week start? <1 green · 2-4 amber · <strong>>4 red — constant scrambling</strong>.', '<strong>Q2:</strong> when AI surfaces re-plan, do planners act on it? Yes mostly green · sometimes amber · <strong>rarely/never red — AI ignored</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Walk the plant during a major schedule change', ['How did the change propagate from signal → decision → operator instruction? <strong>Friction points = integration priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Safety AI · <em>support, not surveillance</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 signal flows · 3 cadences · 3 failure modes · 2-question scoring.', '<strong>Next:</strong> 3 safety use cases · the line nobody crosses · 3 failure modes.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Safety AI' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-safety-ai.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · SUPPORT · NOT SURVEILLANCE', h1Html: '3 use cases · the line · <em>3 failure modes</em>', subtitleHtml: '<strong>AI flags. Human responds. Pattern informs prevention.</strong>' },
  { type: 'content', eyebrow: '3 safety use cases', icon: '1', headlineHtml: 'PPE · near-miss · <em>ergonomic</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC1', 'PPE detection', '', 'Cameras flag missed PPE in real time. <strong>Worker notified. Supervisor on pattern.</strong>', 'green')}
${cell('UC2', 'Near-miss detection', '', 'Vision + sensor catches near-collisions · near-falls · unsafe proximity. <strong>Patterns inform safety walks.</strong>', 'green')}
${cell('UC3', 'Ergonomic risk', '', 'Repetitive motion · posture detection on assembly lines. <strong>Identifies risk before injury.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The line nobody crosses', icon: '!', iconRed: true, headlineHtml: 'Support · <em>not surveillance</em>',
    blocks: [{ atStep: 1, html: cardRed('THE LINE NOBODY CROSSES', 'Safety AI is support, not surveillance', ['Once workers experience it as surveillance, you\'ve lost. <strong>Adoption fails. Union pushback. Productivity falls.</strong>', '<strong>What works:</strong> AI alerts worker first. Supervisor sees aggregated patterns, not individual moments. <em>Performance reviews never reference safety AI data.</em>', '<strong>What doesn\'t:</strong> AI alerts management to "rule violations" by individual workers in real time. Workers feel watched. <em>Trust collapses. Safety culture inverts.</em>'], '<strong>Discipline:</strong> safety AI charter signed by safety, operations, and union representation before deployment.') }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '2', iconRed: true, headlineHtml: 'False-positive fatigue · coverage gaps · <em>vendor lock</em>',
    blocks: [{ atStep: 1, html: cardRed('3 SAFETY AI FAILURE MODES', 'Specific to safety AI', ['<strong>1. False-positive fatigue.</strong> PPE alerts firing 20× per hour → workers ignore alerts. Real issues missed.', '<strong>2. Coverage gaps.</strong> AI covers main floor. Maintenance · loading docks · outside areas uncovered. <em>Incidents happen where AI isn\'t watching.</em>', '<strong>3. Vendor lock and brittleness.</strong> Proprietary system · cameras fail · parts unavailable. Plant runs without safety AI for weeks/months.']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Experienced as support · incident rate · <em>alert response rate</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SAFETY AI', '3 questions', ['<strong>Q1:</strong> experienced by workers as support, not surveillance? Yes green · mixed amber · <strong>no red — redesign or remove</strong>.', '<strong>Q2:</strong> recordable incident rate trend over 12 mo? Down green · flat amber · <strong>up red</strong>.', '<strong>Q3:</strong> alert response rate? High consistently green · drifting down amber · <strong>workers ignoring red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Ask 3 workers + 1 supervisor what they think of safety AI', ['If answers diverge sharply, you have a trust gap. <strong>That gap = safety AI priority.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Digital twin · <em>pragmatic, not megaproject</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 use cases · the line · 3 failure modes · 3-question scoring.', '<strong>Next:</strong> the megaproject trap · 3 targeted twins · 3 discipline rules.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'Digital twin' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-digital-twin.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · BOUNDED · NOT MEGAPROJECT', h1Html: 'The trap · 3 targeted twins · <em>3 discipline rules</em>', subtitleHtml: '<strong>Six-month bounded twin with one specific use case. Not "the plant in software."</strong>' },
  { type: 'content', eyebrow: 'The megaproject trap', icon: '!', iconRed: true, headlineHtml: '18-month digital twin · <em>quietly cancelled</em>',
    blocks: [{ atStep: 1, html: cardRed('THE MEGAPROJECT TRAP', 'Vendor pitch vs reality', ['<strong>Vendor pitch:</strong> "Build a complete digital twin of your entire plant. 18 months. 8 figures. Then optimise everything."', '<strong>What actually happens:</strong> 12 months in · scope creep is constant. 18 months in · partial model exists. <em>Budget overrun · sponsor changes · project quietly cancelled.</em>'], '<strong>The discipline:</strong> bounded 6-month digital twin with ONE specific use case. Not "the plant in software." Specific. Bounded. Time-boxed.') }] },
  { type: 'content', eyebrow: '3 targeted twins', icon: '1', headlineHtml: 'Bottleneck · NPI · <em>energy</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('T1', 'Specific bottleneck line', '', 'Model one line that bottlenecks throughput. <strong>Test process changes virtually before deploying.</strong>', 'green')}
${cell('T2', 'New product introduction', '', 'Twin the line where new product launches. <strong>Catch ramp-up issues before production.</strong>', 'green')}
${cell('T3', 'Energy-intensive equipment', '', 'Twin high-energy assets. <strong>Optimise operating profiles for energy without compromising throughput.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 discipline rules', icon: '2', headlineHtml: '6-month TTV · one bounded use case · <em>real plant engineers in design</em>',
    blocks: [{ atStep: 1, html: card('3 DISCIPLINE RULES', 'Non-negotiable', ['<strong>1. Six-month time-to-value.</strong> If the twin isn\'t producing operational decisions within 6 mo, kill and refocus.', '<strong>2. One bounded use case.</strong> "Reduce changeover time on Line 3 by 15%" beats "optimise plant operations" every time.', '<strong>3. Real plant engineers in design.</strong> Twin design must include people who run the equipment. <em>If plant engineers aren\'t in the room weekly, twin won\'t reflect reality.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Producing decisions monthly · <em>time-to-first-decision</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DIGITAL TWIN WORK', '2 questions', ['<strong>Q1:</strong> twin producing operational decisions monthly? Yes green · sometimes amber · <strong>no/rarely red — decorative</strong>.', '<strong>Q2:</strong> months since start vs months to first decision? ≤6 green · 6-12 amber · <strong>>12 red — megaproject pattern</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'List every active digital twin project', ['For each: 6-mo TTV? Bounded use case? Plant engineers in design? <strong>Projects failing 2 of 3 are at risk.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: '12-month plant roadmap · <em>4 trip-wires · the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Megaproject trap · 3 targeted twins · 3 discipline rules · 2-question scoring.', '<strong>Last chapter:</strong> 12-month rollout · 4 trust trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',pair:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='plant-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var pa=state.pair||'_(pick Q2 play)_';var s=state.sponsor||'_(pick sponsor)_';return '# Manufacturing AI · 12-Month Plant Roadmap\\n\\n**Plant manager:** ____________________\\n**Start date:** ____________________\\n\\n## Q1 starting play\\n> '+p+'\\n\\n## Q2 second play\\n> '+pa+'\\n\\n## Executive sponsor\\n> '+s+'\\n\\n## Q3: Process optimisation candidate\\n- AI surfaces · operators decide\\n- One process metric out of plateau by Q3 end\\n\\n## Q4: Pragmatic digital twin OR safety AI\\n- 6-month bounded scope · specific use case\\n- Plant engineers in design from day one\\n\\n## 4 trust trip-wires (do not cross)\\n- Autonomous decisions on safety-critical equipment — always human in loop\\n- 18-month digital-twin megaproject — refuse the project\\n- Safety AI as surveillance — plant culture inverts\\n- AI predictions ignored because narrative layer missing\\n\\n---\\nSource: Gennoor Academy · AI in Manufacturing\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your plant AI roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 12-MONTH PLANT ROADMAP', h1Html: '12 months · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>Pilot small. Prove value in production conditions. Then expand.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Plant-floor reality · <em>not vendor demo</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Pilot small · prove · then expand', ['Manufacturing AI is plant-floor reality, not vendor demo. <strong>Pilot small. Prove value in production conditions. Then expand.</strong>']) }] },
  { type: 'content', eyebrow: '12-month rollout', icon: '2', headlineHtml: 'PdM · quality vision · process · <em>twin or safety</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('Q1', 'Predictive maintenance pilot', '', 'Top 10 assets · sensor + model + CMMS integration. Operational discipline.')}
${cell('Q2', 'Quality vision on one line', '', 'Operator labelling loop · false-confidence discipline. Defect escape baseline.', 'amber')}
${cell('Q3', 'Process optimisation candidate', '', 'AI surfaces · operators decide. One metric out of plateau.', 'green')}
${cell('Q4', 'Twin OR safety AI', '', '6-month bounded · specific use case · plant engineers in design.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Autonomous safety-critical · megaproject · surveillance · <em>missing narrative</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Autonomous on safety-critical', '', 'Always human in loop.', 'red')}
${cell('W2', '18-mo digital-twin megaproject', '', 'If scope and timeline can\'t bound, refuse.', 'red')}
${cell('W3', 'Safety AI as surveillance', '', 'Plant culture inverts. Don\'t let it cross.', 'red')}
${cell('W4', 'AI ignored because narrative missing', '', 'Predictions without context don\'t ship.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · pair · sponsor · <em>take to plant manager</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Q1 starting play</h5><div class="preset" data-group="play">
<button data-val="Predictive maintenance — top 10 assets, clear economics">Predictive maintenance</button>
<button data-val="Quality vision — defect escape rate baseline first">Quality vision</button>
<button data-val="Safety AI (PPE detection) — visible wins, charter signed first">Safety AI · PPE</button>
</div></div>
<div class="group"><h5>Q2 second play</h5><div class="preset" data-group="pair">
<button data-val="Quality vision on a bottleneck line">Quality vision</button>
<button data-val="Plant-floor supply chain integration">Supply chain integration</button>
<button data-val="Safety AI (ergonomic risk)">Safety AI · ergonomic</button>
</div></div>
<div class="group"><h5>Executive sponsor</h5><div class="preset" data-group="sponsor">
<button data-val="Plant manager with VP Manufacturing partnership">Plant manager + VP Mfg</button>
<button data-val="VP Manufacturing directly with CIO/IT partnership">VP Mfg directly</button>
<button data-val="Joint Plant Manager + Quality + Safety committee">Joint committee</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my plant AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># Manufacturing AI · 12-Month Plant Roadmap

Pick Q1 play, Q2 play, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Plant-floor reality · 6 plays · 3 anti-plays · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Manufacturing AI is plant-floor reality. Six plays — predictive maintenance, quality vision, process optimisation, plant-floor supply chain, safety AI, pragmatic digital twin. Three anti-plays. OT/IT bridge filter. Four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick Q1 starting play and Q2 second play.</div><div class="row"><span class="arr">→</span>Get one plant manager conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 33 chapters 1-8 built.')
