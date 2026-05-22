// Course 27 — AI for Cybersecurity SOC (Emma)
import { emit } from './build-chapter-html.mjs'
const courseTagline = 'Cyber · AI for Cybersecurity SOC'
const OUT = 'tmp/academy-build/ai-for-cybersecurity-soc/chapters'

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

emit({ courseTagline, chapter: { number: '01 / 06', id: 'chapter-01', title: 'The cybersecurity AI landscape' }, audioSrc: '../audio/chapter-01/chapter-01.mp3', outPath: `${OUT}/chapter-01-landscape.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 1 · ANALYST FORCE MULTIPLIER', h1Html: '5 plays · 3 anti-plays · <em>regulator frame</em>', subtitleHtml: '<strong>AI augments. Doesn\'t replace. Human judgement catches what AI has never seen.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Force multiplier · <em>not replacement</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Analyst-free SOCs get breached by novel threats', ['Best SOCs use AI to compress repetitive work · analysts focus on actual investigation.', '<strong>Worst chase analyst-free future. Get breached when novel threats appear AI has never seen.</strong>']) }] },
  { type: 'content', eyebrow: '5 high-value plays', icon: '2', headlineHtml: 'Triage · detection · investigation · intel · <em>SOAR</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PLAY 1', 'Alert triage + noise reduction', '', 'Biggest SOC pain point. AI scores and filters alerts.', 'green')}
${cell('PLAY 2', 'Threat detection augmentation', '', 'UEBA · anomaly detection · supplements signatures.', 'green')}
${cell('PLAY 3', 'Investigation assistance', '', 'NL to query · automated enrichment · hypothesis generation.', 'green')}
${cell('PLAY 4', 'Threat intel synthesis', '', 'Feed correlation · ATT&CK mapping · environmental relevance.', 'green')}
${cell('PLAY 5', 'Security automation + SOAR', '', 'Routine action automation. <strong>Human-in-loop for non-trivial impact.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: '3 anti-plays', icon: '!', iconRed: true, headlineHtml: 'Auto response · AI-only detection · <em>AI-as-substitute</em>',
    blocks: [{ atStep: 1, html: cardRed('3 SOC AI ANTI-PLAYS', 'Avoid', ['<strong>1. Fully autonomous response.</strong> Containment · blocking · isolation without review. One false positive away from critical business outage.', '<strong>2. AI as entire detection.</strong> Signatures + rules remain essential. AI augments. Doesn\'t replace.', '<strong>3. Vendor AI as substitute for SOC maturity.</strong> Immature processes → AI produces more confident wrong outcomes.']) }] },
  { type: 'content', eyebrow: 'Regulatory frame', icon: '3', headlineHtml: 'NIST CSF · MITRE ATT&CK · <em>ISO 27001</em>',
    blocks: [
      { atStep: 1, html: card('REGULATORY FRAME', 'AI fits across', ['<strong>NIST CSF v2:</strong> govern · identify · protect · detect · respond · recover.', '<strong>MITRE ATT&CK:</strong> shared language of attacker TTPs. AI intel must map to this.', '<strong>ISO 27001:</strong> InfoSec management. SOC must align with documented controls.', '<strong>Sector-specific:</strong> HIPAA security rule · PCI DSS · critical infra EOs.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pick the play your SOC is most actively pursuing', ['Next 7 chapters give operational discipline.']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 2', icon: '→', headlineHtml: 'Alert triage · <em>where SOC AI delivers most reliable value</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Force-multiplier · 5 plays · 3 anti-plays · regulatory frame.', '<strong>Next:</strong> the alert volume problem · 3 triage patterns · 3 failure modes · honest scoring.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '02 / 06', id: 'chapter-02', title: 'Alert triage + noise reduction' }, audioSrc: '../audio/chapter-02/chapter-02.mp3', outPath: `${OUT}/chapter-02-triage.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 2 · MOST RELIABLE VALUE', h1Html: '3 patterns · 3 failure modes · <em>honest scoring</em>', subtitleHtml: '<strong>The alert volume problem. Reduce noise. Prioritise signal. Without losing real attacks.</strong>' },
  { type: 'content', eyebrow: 'The volume problem', icon: '1', headlineHtml: 'Thousands daily · <em>analyst attention is the bottleneck</em>',
    blocks: [{ atStep: 1, html: card('THE ALERT VOLUME PROBLEM', 'Costs both ways', ['Modern SOCs: thousands of alerts daily. Many or most are noise — known benign, duplicates, low-risk.', '<strong>False positives:</strong> real attacks missed because analysts fatigued.', '<strong>False negatives:</strong> real attacks miss the pipeline entirely.'], 'AI alert triage targets both. <em>Reduce the noise. Prioritise the signal.</em>') }] },
  { type: 'content', eyebrow: '3 triage AI patterns', icon: '2', headlineHtml: 'Supervised scoring · context enrichment · <em>clustering</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PAT 1', 'Supervised scoring', '', 'Train on past analyst-triaged alerts. Predict severity. <strong>Works when labelling consistent.</strong>', 'green')}
${cell('PAT 2', 'Context enrichment', '', 'AI pulls related context at alert time — recent activity, asset criticality, known threats.', 'green')}
${cell('PAT 3', 'Alert clustering + similarity', '', 'Group related alerts. Analyst sees the cluster, not 50 individual events.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '3 failure modes', icon: '!', iconRed: true, headlineHtml: 'Historical bias · over-suppression · <em>concept drift</em>',
    blocks: [{ atStep: 1, html: cardRed('3 TRIAGE AI FAILURE MODES', 'Patterns to detect early', ['<strong>1. Historical bias inherited.</strong> Past analysts triaged certain alert types poorly → model learns to triage poorly. <em>Audit labels before training.</em>', '<strong>2. Over-aggressive suppression.</strong> AI marks alerts as low priority → never reviewed → real attack signal lost. <em>Maintain shadow review on suppressed.</em>', '<strong>3. Concept drift.</strong> Attacker tactics change. Last year\'s training misses this year. <em>Retraining cadence + drift monitoring required.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 3 questions', icon: '3', headlineHtml: 'Time savings · false-negative · <em>retraining cadence</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE TRIAGE AI', '3 questions', ['<strong>Q1:</strong> analyst time per alert before vs after AI? >50% reduction green · <30% reduction red — not paying back.', '<strong>Q2:</strong> false-negative rate on shadow review of suppressed alerts? <1% green · 1-3% amber · <strong>>3% red — AI hiding real attacks</strong>.', '<strong>Q3:</strong> model retraining cadence? Quarterly+ green · annual amber · <strong>set-and-forgotten red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull 1 week of alerts AI marked low priority + team didn\'t review', ['Sample 10. <strong>Any real signals that needed attention? That false-negative rate is the truth.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Detection augmentation · <em>UEBA + things signatures miss</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Volume problem · 3 patterns · 3 failure modes · 3-question scoring.', '<strong>Next:</strong> the layered model · UEBA in practice · LLM-augmented analysis.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '03 / 06', id: 'chapter-03', title: 'Threat detection augmentation' }, audioSrc: '../audio/chapter-03/chapter-03.mp3', outPath: `${OUT}/chapter-03-detection.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 3 · WHAT SIGNATURES MISS', h1Html: 'Layered model · UEBA · <em>LLM-augmented</em>', subtitleHtml: '<strong>AI adds a third layer. Doesn\'t replace signatures or rules.</strong>' },
  { type: 'content', eyebrow: 'The layered model', icon: '1', headlineHtml: 'Signatures · rules · <em>AI augmentation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('L1', 'Signatures', '', 'Known bad · IoCs · hash matches · pattern signatures. <strong>Reliable for known threats.</strong>', 'green')}
${cell('L2', 'Rules + correlation', '', 'Defined logic combining signals. <strong>Effective for documented attack patterns.</strong>', 'green')}
${cell('L3', 'AI augmentation', '', 'UEBA · anomaly detection · behavioural baselines. <strong>Catches deviations layers 1+2 don\'t cover.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'UEBA in practice', icon: '2', headlineHtml: '60-day baseline · tuning · <em>privilege accounts first</em>',
    blocks: [{ atStep: 1, html: card('UEBA IN PRACTICE', 'What works · what doesn\'t', ['<strong>What works:</strong> 30-90 day baseline · sufficient feature set (location · hours · resources · data volumes) · environment-specific tuning.', '<strong>What doesn\'t:</strong> out-of-box vendor UEBA with default thresholds → high false positives → analysts ignore alerts → real anomalies missed.'], '<strong>Mature pattern:</strong> 60-day minimum baseline · quarterly iterative tuning · use-case prioritisation (start privileged accounts → expand).') }] },
  { type: 'content', eyebrow: 'LLM-augmented analysis', icon: '3', headlineHtml: 'AI proposes · <em>analyst disposes</em>',
    blocks: [{ atStep: 1, html: card('LLM-AUGMENTED ANALYSIS', 'Newer pattern · 2026', ['<strong>What works:</strong> hypothesis generation by AI followed by analyst validation. "These 3 events suggest credential stuffing + lateral movement. Investigate." Analyst confirms or rejects.', '<strong>What doesn\'t:</strong> LLM as primary detection engine. Hallucinated correlations. False confidence.'], '<strong>Mata cross-domain:</strong> AI fabricates plausible-sounding analysis. Without human verification → investigate non-existent attacks. <em>AI proposes. Analyst disposes.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '4', headlineHtml: 'ATT&CK coverage · <em>analyst confirmation rate</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE DETECTION AI', '2 questions', ['<strong>Q1:</strong> detection coverage across MITRE ATT&CK techniques in your top threats? >70% green · 40-70% amber · <strong><40% red</strong>.', '<strong>Q2:</strong> AI-flagged anomalies — analyst confirmation rate? 20-40% confirmed real = normal green · <strong><10% red — model is noise</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last week\'s high-severity AI-flagged anomalies · pick 5', ['Walk through with senior analyst: real signal or noise? <strong>That pattern tells you tuning priorities.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Investigation assistance · <em>analyst force multiplier during response</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Layered model · UEBA · LLM-augmented · 2-question scoring.', '<strong>Next:</strong> NL-to-query · automated enrichment · hypothesis generation · human-in-the-loop principle.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '04 / 06', id: 'chapter-04', title: 'Incident investigation assistance' }, audioSrc: '../audio/chapter-04/chapter-04.mp3', outPath: `${OUT}/chapter-04-investigation.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 4 · FORCE MULTIPLIER DURING RESPONSE', h1Html: '3 use cases · <em>human-in-the-loop absolute</em>', subtitleHtml: '<strong>AI generates drafts. Analyst validates. Named human accountability in the report.</strong>' },
  { type: 'content', eyebrow: '3 investigation use cases', icon: '1', headlineHtml: 'NL to query · enrichment · <em>hypothesis generation</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Natural language to query', '', 'Analyst types in English. AI generates SIEM/log/graph query. <strong>Removes syntax barrier for juniors.</strong>', 'green')}
${cell('UC 2', 'Automated initial enrichment', '', 'Alert fires → AI gathers context · activity · assets · users · intel · before ticket opens.', 'green')}
${cell('UC 3', 'Hypothesis generation', '', 'AI proposes attack hypotheses mapped to MITRE ATT&CK. <strong>Analyst evaluates.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'Human-in-the-loop principle', icon: '!', iconRed: true, headlineHtml: 'Absolute during active investigation · <em>credibility at stake</em>',
    blocks: [{ atStep: 1, html: cardRed('HUMAN-IN-THE-LOOP PRINCIPLE', 'Absolute · non-negotiable', ['<strong>Temptation:</strong> let AI conclude · approve · move on. Saves time. Loses learning. <em>Inherits AI errors.</em>', '<strong>What works:</strong> AI drafts conclusions. Analyst validates against source data. Conclusion goes in incident report with <strong>named analyst accountability</strong>.'], 'Not just process discipline — incident response credibility. <strong>Post-incident review: "the AI said so" is not an answer. Named human accountability is.</strong>') }] },
  { type: 'content', eyebrow: '3 investigation failure modes', icon: '2', headlineHtml: 'Hallucinated correlations · over-reliance · <em>over-summarisation</em>',
    blocks: [{ atStep: 1, html: cardRed('3 INVESTIGATION AI FAILURE MODES', 'Predictable patterns', ['<strong>1. Hallucinated correlations.</strong> AI sees patterns that aren\'t there. Analyst follows wrong lead. Real attack progresses.', '<strong>2. Over-reliance for junior analysts.</strong> Junior uses AI as primary tool · doesn\'t develop independent skill. AI wrong → they don\'t catch it.', '<strong>3. Over-summarisation hiding nuance.</strong> 3-line summary misses the detail that mattered.'], '<strong>Mitigation:</strong> train juniors on underlying tools. AI augments. <em>Not substitute for fundamentals.</em>') }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Time to first action · <em>junior skill development</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INVESTIGATION AI', '2 questions', ['<strong>Q1:</strong> alert-to-first-analyst-action time with AI vs without? >40% reduction green · <strong><20% red — not paying back</strong>.', '<strong>Q2:</strong> junior analyst independent skill development — could they work without AI? Yes green · <strong>honestly no = red, only function with AI</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sit with one junior analyst for 30 min · watch them investigate', ['Independent thinking using AI as tool? Or being driven by AI? <strong>That observation is the truth.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Threat intel synthesis · <em>feeds at scale</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 use cases · human-in-loop absolute · 3 failure modes · 2-question scoring.', '<strong>Next:</strong> volume problem · 3 intel AI use cases · the verification requirement.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '05 / 06', id: 'chapter-05', title: 'Threat intelligence synthesis' }, audioSrc: '../audio/chapter-05/chapter-05.mp3', outPath: `${OUT}/chapter-05-intel.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 5 · INTEL AT SCALE', h1Html: '3 use cases · <em>verification non-negotiable</em>', subtitleHtml: '<strong>Without verification, you act on hallucinated attribution. Mata cross-domain applies.</strong>' },
  { type: 'content', eyebrow: 'The volume problem', icon: '1', headlineHtml: 'Multiple feeds · <em>archival instead of actioned</em>',
    blocks: [{ atStep: 1, html: card('THE THREAT INTEL VOLUME PROBLEM', 'Without AI: archival', ['Modern SOCs subscribe to multiple feeds — commercial · government · open source · sector ISACs. Each: hundreds-thousands of indicators daily.', '<strong>Without AI assistance:</strong> threat intel becomes archival. Indicators stored in TIP and rarely actioned. Intel investment doesn\'t translate to detection.', '<strong>With AI assistance:</strong> correlation · prioritisation · contextualisation at scale. Indicators triaged against your environment. <em>Relevant ones become detections.</em>']) }] },
  { type: 'content', eyebrow: '3 intel AI use cases', icon: '2', headlineHtml: 'Feed correlation · ATT&CK mapping · <em>environmental relevance</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('UC 1', 'Feed correlation', '', 'Same indicator across multiple feeds raises confidence. AI maps duplicates + aggregates.', 'green')}
${cell('UC 2', 'MITRE ATT&CK mapping', '', 'AI maps indicators to techniques. Prioritise based on techniques that matter for your environment.', 'green')}
${cell('UC 3', 'Environmental relevance scoring', '', 'AI scores each indicator against your assets · industry · geography. <strong>High-relevance surface for action.</strong>', 'green')}
</div>` }] },
  { type: 'content', eyebrow: 'The verification requirement', icon: '!', iconRed: true, headlineHtml: 'Non-negotiable · <em>specifics require verification</em>',
    blocks: [{ atStep: 1, html: cardRed('THE VERIFICATION REQUIREMENT', 'Mata cross-domain · directly', ['AI-generated threat intel analysis can hallucinate. <strong>Plausible-sounding attribution. Plausible-sounding technique. Plausible-sounding indicator significance.</strong> Without verification, you act on imagined threats.', '<strong>What works:</strong> AI synthesises. Analyst verifies key facts.', '<strong>Discipline:</strong> specific indicators, attributions, recommendations — all verified against source. Aggregated patterns acceptable. <em>Specific claims require verification.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Detection conversion · <em>verification discipline</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE INTEL AI', '2 questions', ['<strong>Q1:</strong> % high-relevance indicators that became detections last quarter? >30% green · 10-30% amber · <strong><10% red — intel not reaching detection</strong>.', '<strong>Q2:</strong> AI-generated attribution claims verified before acting? Yes green · sometimes amber · <strong>no/rarely = red, will act on hallucinated attribution</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull last quarter\'s threat intel reports · pick 5 attribution claims', ['Verified against source? Or AI synthesis without verification? <strong>That ratio is your discipline indicator.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'SOAR · <em>where automation works · where it makes incidents worse</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Volume problem · 3 use cases · verification requirement · 2-question scoring.', '<strong>Next:</strong> the automation spectrum · safe autonomous scenarios · dangerous ones.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '06 / 06', id: 'chapter-06', title: 'Security automation + SOAR' }, audioSrc: '../audio/chapter-06/chapter-06.mp3', outPath: `${OUT}/chapter-06-soar.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 6 · AUTOMATION SPECTRUM', h1Html: 'Safe autonomous · <em>dangerous autonomous</em>', subtitleHtml: '<strong>Mature SOCs use augmented manual + approved automation. Autonomous reserved for narrow reversible scenarios.</strong>' },
  { type: 'content', eyebrow: 'The automation spectrum', icon: '1', headlineHtml: 'Manual → augmented → approved → <em>autonomous</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('S1', 'Fully manual', '', 'Every action by analyst. Slow. Strong process required for consistency.')}
${cell('S2', 'Augmented manual', '', 'AI prepares context. Analyst decides + acts. <strong>Time on prep saved.</strong>', 'green')}
${cell('S3', 'Approved automation', '', 'AI proposes. Analyst approves. Automation executes. <strong>Time on exec saved. Decision still human.</strong>', 'green')}
${cell('S4', 'Autonomous response', '', 'AI decides + acts without review. <strong>Fastest. Highest risk.</strong>', 'amber')}
</div>` }] },
  { type: 'content', eyebrow: 'Safe autonomous scenarios · narrow', icon: '2', headlineHtml: 'Known malware · phishing removal · <em>basic IP block</em>',
    blocks: [{ atStep: 1, html: cardGreen('SAFE AUTONOMOUS SCENARIOS', 'Narrow · reversible · single-system', ['<strong>1. Known malware quarantine.</strong> High-confidence detection. Single endpoint. Reversible.', '<strong>2. Phishing email auto-removal.</strong> Very high confidence. Removal reversible.', '<strong>3. Basic IP blocking at perimeter.</strong> IP on high-confidence threat list. Monitored. Easy to revert.'], 'These 3 typically safe. <strong>Anything broader requires human review.</strong>') }] },
  { type: 'content', eyebrow: 'Dangerous autonomous scenarios · common', icon: '!', iconRed: true, headlineHtml: 'Account · network · <em>cross-system impact</em>',
    blocks: [{ atStep: 1, html: cardRed('DANGEROUS AUTONOMOUS SCENARIOS', 'Human in loop · always · no exception', ['<strong>1. Account disablement.</strong> AI disables based on anomaly. Wrong → business operation impacted.', '<strong>2. Network segment isolation.</strong> AI isolates based on suspected lateral movement. Wrong → production outage.', '<strong>3. Automated containment with cross-system impact.</strong> Multi-system touch. <em>Blast radius hard to predict.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Outage rate · <em>auditable + reversible</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SOAR AI', '2 questions', ['<strong>Q1:</strong> last 12 mo automated responses — % caused/contributed to business outage or major escalation? 0 green · 1-2 with lessons amber · <strong>3+ red — automation scope too broad</strong>.', '<strong>Q2:</strong> autonomous response — decision logic auditable AND action reversible? Both yes green · <strong>neither for any automated path = red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Pull your SOAR playbook list · for each fully automated path', ['Worst-case business impact if AI decides wrong? <strong>Anything beyond "small inconvenience" → human in loop.</strong>']) },
    ] },
  { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'AI\'s own attack surface · <em>when AI becomes the target</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Spectrum · safe scenarios · dangerous scenarios · 2-question scoring.', '<strong>Next:</strong> 4 attack vectors against SOC AI · 4 defensive patterns.') }] },
], cues: baseCues })

emit({ courseTagline, chapter: { number: '07 / 06', id: 'chapter-07', title: 'AI\'s own attack surface' }, audioSrc: '../audio/chapter-07/chapter-07.mp3', outPath: `${OUT}/chapter-07-ai-attack.html`, slides: [
  { type: 'title', eyebrow: 'CHAPTER 7 · AI BECOMES THE TARGET', h1Html: '4 attack vectors · <em>4 defensive patterns</em>', subtitleHtml: '<strong>Demonstrated in research and increasingly in the wild. Attacker who controls your detection AI controls what your SOC sees.</strong>' },
  { type: 'content', eyebrow: 'The meta problem', icon: '1', headlineHtml: 'Your AI becomes · <em>the target</em>',
    blocks: [{ atStep: 1, html: card('THE META PROBLEM', 'Not theoretical', ['Your SOC deploys AI to detect attacks. <strong>Attackers know this. The AI itself becomes a target.</strong>', 'Demonstrated in research and increasingly in the wild. AI models can be manipulated to misclassify. Prompts injected. Training data poisoned.'], '<strong>Attacker who controls your detection AI controls what your SOC sees.</strong>') }] },
  { type: 'content', eyebrow: '4 attack vectors', icon: '!', iconRed: true, headlineHtml: 'Evasion · injection · poisoning · <em>exfiltration</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('V1', 'Model evasion', '', 'Attacker crafts behaviour that triggers as benign. <strong>Demonstrated vs UEBA + anomaly detection.</strong>', 'red')}
${cell('V2', 'Prompt injection', '', 'Attacker injects content into logs/alerts that manipulates LLM analysis. <strong>Increasingly seen.</strong>', 'red')}
${cell('V3', 'Training data poisoning', '', 'Attacker introduces patterns so model learns to ignore them. <strong>Slow. Subtle. Hard to detect.</strong>', 'red')}
${cell('V4', 'Model exfiltration', '', 'Attacker queries AI to learn decision boundaries. Once known, evasion is systematic.', 'red')}
</div>` }] },
  { type: 'content', eyebrow: '4 defensive patterns', icon: '2', headlineHtml: 'Defence in depth · monitoring · adversarial training · <em>integrity</em>',
    blocks: [{ atStep: 1, html: cardGreen('4 DEFENSIVE PATTERNS', 'Operational discipline', ['<strong>1. Defence in depth retained.</strong> AI augments signatures + rules. Doesn\'t replace. If AI compromised, other layers still produce signal.', '<strong>2. Model behaviour monitoring.</strong> Sudden classification distribution shifts trigger human review.', '<strong>3. Adversarial training.</strong> Train model against adversarial examples. Increases robustness.', '<strong>4. Model + training data integrity.</strong> Cryptographic verification · access controls · audit trails. <em>Same discipline as for any critical security system.</em>']) }] },
  { type: 'content', eyebrow: 'Honest scoring · 2 questions', icon: '3', headlineHtml: 'Detection of AI compromise · <em>training data protection</em>',
    blocks: [
      { atStep: 1, html: card('HOW TO SCORE SOC AI SECURITY', '2 questions', ['<strong>Q1:</strong> SOC AI suddenly producing unusual output — how quickly detected? Automated monitoring same-day green · manual periodic amber · <strong>honestly wouldn\'t notice red</strong>.', '<strong>Q2:</strong> training data + model protected with same controls as production data? Yes green · <strong>less protected = red</strong>.']) },
      { atStep: 2, html: card('MONDAY MOVE', 'Sit with security architect + AI lead', ['One question: <strong>"If our SOC AI is compromised today, how would we know in 48 hours?"</strong> Answer is your detection-of-detection gap.']) },
    ] },
  { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Roadmap · 4 trip-wires · <em>the builder</em>',
    blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Meta problem · 4 attack vectors · 4 defensive patterns · 2-question scoring.', '<strong>Last chapter:</strong> 12-month rollout · 4 trust trip-wires · interactive Markdown builder.') }] },
], cues: baseCues })

const ch8Builder = `
var builderInit=false;var state={play:'',posture:'',sponsor:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='soc-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.play||'_(pick starting play)_';var po=state.posture||'_(pick automation posture)_';var s=state.sponsor||'_(pick sponsor)_';return '# SOC AI · 12-Month Roadmap\\n\\n**CISO sponsor:** ____________________\\n**Start date:** ____________________\\n\\n## Starting play\\n> '+p+'\\n\\n## Automation posture\\n> '+po+'\\n\\n## CISO sponsor\\n> '+s+'\\n\\n## Months 1-3: Triage + noise reduction\\n- Baseline false-positive rate\\n- Deploy supervised triage\\n- Document shadow review on suppressed alerts\\n\\n## Months 4-6: Investigation assistance\\n- NL query interfaces\\n- Automated enrichment\\n- Hypothesis generation with explicit analyst validation\\n\\n## Months 7-9: Detection augmentation\\n- UEBA tuned with 60+ day baseline\\n- LLM-augmented analysis with verification discipline\\n\\n## Months 10-12: Intel + SOAR\\n- AI-assisted intel synthesis with verification\\n- Limited approved automation\\n- No broad autonomous response\\n\\n## 4 trust trip-wires (do not cross)\\n- Fully autonomous response on account/network/cross-system actions — reserve for narrow reversible\\n- AI as primary detection without defence in depth — signatures + rules + AI · never AI alone\\n- Un-verified AI intel synthesis acted upon — Mata cross-domain\\n- Junior analyst skill erosion — train on fundamentals, AI is augmentation\\n\\n---\\nSource: Gennoor Academy · AI for Cybersecurity SOC\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`

emit({ courseTagline, chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your SOC AI roadmap' }, audioSrc: '../audio/chapter-08/chapter-08.mp3', outPath: `${OUT}/chapter-08-making-it-stick.html`, builderSlide: 5, builderStep: 1, builderInitFn: ch8Builder, slides: [
  { type: 'title', eyebrow: 'CHAPTER 8 · 12-MONTH ROADMAP', h1Html: '4 phases · 4 trip-wires · <em>the builder</em>', subtitleHtml: '<strong>AI as analyst force multiplier · not replacement. Verification required. Limited autonomous.</strong>' },
  { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Force multiplier · <em>not replacement</em>',
    blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Best SOCs compress repetitive work', ['Analysts focus on actual investigation. <strong>Human judgement catches what AI has never seen.</strong>']) }] },
  { type: 'content', eyebrow: '12-month rollout', icon: '2', headlineHtml: 'Triage · investigation · detection · <em>intel + SOAR</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('M1-3', 'Triage + noise', '', 'Baseline false-positive rate. Supervised triage. Shadow review.')}
${cell('M4-6', 'Investigation', '', 'NL queries · enrichment · hypothesis generation with validation.', 'amber')}
${cell('M7-9', 'Detection', '', 'UEBA tuned 60+ day baseline · LLM-augmented with verification.', 'green')}
${cell('M10-12', 'Intel + SOAR', '', 'AI-assisted intel with verification · limited approved automation · no broad autonomous.', 'green')}
</div>` }] },
  { type: 'content', eyebrow: '4 trust trip-wires', icon: '!', iconRed: true, headlineHtml: 'Auto response · AI-only · un-verified intel · <em>skill erosion</em>',
    blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('W1', 'Fully autonomous on account/network/cross-system', '', 'Reserve autonomous for narrow reversible scenarios.', 'red')}
${cell('W2', 'AI as primary detection without defence in depth', '', 'Signatures + rules + AI. <strong>Never AI alone.</strong>', 'red')}
${cell('W3', 'Un-verified AI intel acted upon', '', 'Mata cross-domain. <strong>Specific attribution requires verification.</strong>', 'red')}
${cell('W4', 'Junior analyst skill erosion', '', 'Train on tools + fundamentals. <strong>AI augments. If juniors only function with AI, that\'s development failure.</strong>', 'red')}
</div>` }] },
  { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Play · posture · sponsor · <em>take to CISO</em>',
    blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Starting play</h5><div class="preset" data-group="play">
<button data-val="Alert triage + noise reduction — biggest pain point in most SOCs">Alert triage</button>
<button data-val="Investigation assistance — NL queries + enrichment + hypothesis generation">Investigation</button>
<button data-val="Detection augmentation — UEBA + LLM-augmented analysis">Detection</button>
<button data-val="Threat intel synthesis — feed correlation + relevance scoring">Threat intel</button>
</div></div>
<div class="group"><h5>Automation posture</h5><div class="preset" data-group="posture">
<button data-val="Conservative — augmented manual + approved automation only · no autonomous">Conservative</button>
<button data-val="Balanced — narrow autonomous for known malware/phishing/IP block · all else approved">Balanced</button>
<button data-val="Aggressive — broader autonomous in high-confidence scenarios with strong monitoring">Aggressive</button>
</div></div>
<div class="group"><h5>CISO sponsor + governance</h5><div class="preset" data-group="sponsor">
<button data-val="CISO with weekly SOC AI review + monthly board reporting">CISO + board reporting</button>
<button data-val="CISO + Head of SOC + Detection Engineering joint">CISO + SOC + DE joint</button>
<button data-val="CIO + CISO with security architect overlap">CIO + CISO</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my SOC AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># SOC AI · 12-Month Roadmap

Pick starting play, automation posture, and sponsor on the left.</div>
</div>` }] },
  { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Force multiplier · 5 plays · 3 anti-plays · <em>4 trip-wires</em>',
    blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>AI is an analyst force multiplier, not replacement · five SOC plays — triage, detection augmentation, investigation, threat intel, automation · three anti-plays · layered detection retained · verification required for specific claims · limited autonomous response · AI\'s own attack surface managed · junior analysts developed on fundamentals · four trust trip-wires.</h2><p>That\'s eight chapters in one breath. <em>That\'s the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick starting play and automation posture.</div><div class="row"><span class="arr">→</span>Get one CISO conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] },
], cues: [
  { at: 0.0, slide: 1 },
  { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
  { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
  { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
  { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 },
  { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 },
] })

console.log('\n✓ Course 27 chapters 1-8 built.')
