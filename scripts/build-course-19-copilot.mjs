// Build Course 19 chapter HTMLs — Microsoft 365 Copilot Adoption (Emma · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Tools · Microsoft 365 Copilot Adoption';
const OUT = 'tmp/academy-build/m365-copilot-adoption/chapters';

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
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The M365 Copilot landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-copilot-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · ADOPTION IS THE CHALLENGE', h1Html: '$30/user/mo · <em>30-40% become active</em>', subtitleHtml: 'MS Copilot for M365 GA Nov 2023. MS Work Trend Index ~30% time savings for active users. <strong>Adoption is the challenge. Not licensing.</strong>' },
    { type: 'content', eyebrow: 'Scale + pricing', icon: '1', headlineHtml: '$30/user/month · <em>$1.8M/yr for 5K users</em>',
      blocks: [{ atStep: 1, html: card('M365 COPILOT GA · NOV 1 2023', '$30/user/month enterprise tier · across Word/Excel/PowerPoint/Outlook/Teams', ['5K-person org → $1.8M annually in Copilot licensing.', '<strong>Real money. Business case has to work.</strong>']) }] },
    { type: 'content', eyebrow: 'MS Work Trend Index · the productivity claim', icon: '2', headlineHtml: '~30% time savings · <em>for active users</em>',
      blocks: [{ atStep: 1, html: card('MS WORK TREND INDEX · 2024-25', '~30% time savings on routine documents for active Copilot users', ['<strong>Active user = 1+ Copilot interaction per week.</strong>']) }] },
    { type: 'content', eyebrow: 'The active-user gap · the problem', icon: '!', iconRed: true, headlineHtml: '30-40% become active · <em>60-70% drift back</em>',
      blocks: [{ atStep: 1, html: cardRed('THE ACTIVE-USER GAP', 'Analyst surveys 2024-25: only 30-40% of licensed Copilot users become active', ['Other 60-70% try, don\'t see value, drift back to old habits.', '<strong>Onboard 1000 licenses · only 300 active → productivity gain is 1/3 of Microsoft\'s headline.</strong>'], 'Plus you\'re paying for 1000 licenses. Economics work IF AND ONLY IF adoption strategy works.') }] },
    { type: 'content', eyebrow: 'The thesis · adoption is the challenge', icon: '4', headlineHtml: 'IT delivers licenses · <em>change management creates active users</em>',
      blocks: [
        { atStep: 1, html: card('THE THESIS', 'Treat Copilot rollout as a change-management challenge, not a licensing exercise', ['MS does the platform engineering. <strong>Your work is making the licensed users into active users.</strong>'], 'IT team that gets licenses delivered = 20% of the work. Change-management team that creates active users = 80% of the work.') },
        { atStep: 2, html: card('THE 5 ADDITIONAL SKILLS', 'Specific to Copilot rollout', ['Adoption + change management · security + compliance posture · Copilot Studio for customisation · measurement frameworks · IT-admin operational discipline.']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>active-user fraction is the metric</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Active-user fraction is the metric that matters · everything else feeds that.', '<strong>Next:</strong> the 5 anchor use cases — Word · Excel · PowerPoint · Outlook · Teams. Where Copilot delivers + the boundary.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 165.0, slide: 5 }, { at: 175.0, slide: 5, step: 1 }, { at: 215.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Where Copilot delivers value' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-use-cases.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · 5 ANCHOR USE CASES', h1Html: 'Word · Excel · PowerPoint · Outlook · <em>Teams</em>', subtitleHtml: 'The 5 anchor use cases. <strong>The boundary — what Copilot is good at, what it\'s not.</strong>' },
    { type: 'content', eyebrow: 'Word + Excel · drafting + analysis', icon: '1', headlineHtml: 'Drafts · outlines · <em>formulas + analysis</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('WORD', 'Drafting + outlining + summarising', '', 'Internal docs · templated content · translation across audiences. <strong>AI provides structure. Human provides substance.</strong>', 'green')}
${cell('EXCEL', 'Formula generation + data analysis', '', 'Routine analytical tasks that previously required power-user skills. <strong>Excel-power-user-on-demand. Not senior analyst.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'PowerPoint + Outlook + Teams', icon: '2', headlineHtml: 'Slides · email · <em>meeting summaries</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('POWERPOINT', 'Outline + first-draft slides', '', 'Internal team presentations · status decks · routine board updates. <strong>First 80%. Senior reviewer rewrites last 20%.</strong>', 'green')}
${cell('OUTLOOK', 'Email drafting + summarisation', '', 'Internal comms · triage for high-volume execs · first-draft routine responses. <strong>Long email thread summary alone justifies for some users.</strong>', 'green')}
${cell('TEAMS', 'Meeting summaries + action items', '', 'Recurring operational meetings with consistent participants + clear outcomes. <strong>Meeting summary alone often justifies Copilot for manager-tier.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'The boundary · across all 5', icon: '3', headlineHtml: 'Routine knowledge work · <em>not judgement · not identity facts</em>',
      blocks: [{ atStep: 1, html: card('THE BOUNDARY', 'Copilot good at: drafting · summarising · classifying · transforming · creating', ['<strong>Not good at:</strong> judgemental decisions · identity-specific facts · anything where value is in human\'s specific expertise.']) }] },
    { type: 'content', eyebrow: 'Mata + Air Canada cross-domain', icon: '!', iconRed: true, headlineHtml: 'Verify before it leaves · <em>customer-facing = human review</em>',
      blocks: [
        { atStep: 1, html: cardRed('MATA + AIR CANADA CROSS-DOMAIN APPLY', 'Verify any specific fact Copilot produces before it leaves your desk', ['Anything customer-facing or material gets human review.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick 1 of the 5 anchor use cases · use it daily for a week', ['Track time saved + quality. <strong>If positive — add a second use case next week. Build the habit.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Licensing + procurement · <em>3 patterns</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', '5 anchor use cases · routine knowledge work · verify specific facts.', '<strong>Next:</strong> licensing patterns (universal · manager-tier · opt-in pilot first) · business case math · the active-user fraction is the variable.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 95.0, slide: 3 }, { at: 105.0, slide: 3, step: 1 },
    { at: 170.0, slide: 4 }, { at: 180.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'The licensing + procurement decision' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-licensing.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · $30/USER/MO', h1Html: 'Who · when · <em>why</em>', subtitleHtml: '$1.8M/yr for 5K users. <strong>Business case has to work or rollout doesn\'t survive year-end review.</strong>' },
    { type: 'content', eyebrow: 'The cost stack', icon: '1', headlineHtml: '$30/user/mo enterprise · <em>incremental to M365</em>',
      blocks: [{ atStep: 1, html: card('COST STACK', 'M365 Copilot Enterprise · $30/user/month · incremental to M365 license', ['<strong>Included:</strong> Copilot in Word/Excel/PowerPoint/Outlook/Teams · Graph integration · tenant-isolated processing · MS Adoption Score + Viva Insights basic.', '<strong>Not included:</strong> Copilot Studio (separate add-on by 2025) · Purview DLP at higher tiers · Power Platform integration.']) }] },
    { type: 'content', eyebrow: 'Who gets it · 3 patterns', icon: '2', headlineHtml: 'Universal · manager-tier · <em>opt-in pilot first</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PATTERN 1', 'Universal', '', 'Everyone with M365 gets Copilot. Simpler · more expensive. <strong>5K-person org: $1.8M/yr.</strong>')}
${cell('PATTERN 2', 'Manager + knowledge-worker tier', '', 'Targeted to document/deck/analysis/meeting producers. ~800-1500 users in 5K org. <strong>Half cost. Most of the value.</strong>', 'green')}
${cell('PATTERN 3', 'Opt-in pilot first', '', '200-300 users across functions · measure 1 quarter · expand based on data. <strong>Most companies should start here.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'The business case · worked example', icon: '3', headlineHtml: 'Active-user fraction · <em>is the critical variable</em>',
      blocks: [{ atStep: 1, html: card('WORKED EXAMPLE · 1000 ACTIVE USERS', '1000 active × 30% × 1 doc/day × 20 min saved × $100/hr', ['<strong>~$10M productivity annually.</strong> License cost (1000 active × $30 × 12) = $360K. Net: ~$9.6M.', 'If only 300 of 1000 licensees become active: productivity = $3M · license = $360K · net = $2.6M. Still positive. Materially less impressive.'], 'The narrative for the CFO: active-user fraction is the critical variable. Active-user fraction is a function of change management.') }] },
    { type: 'content', eyebrow: 'Pilot pattern · stage-gate', icon: '4', headlineHtml: 'Pilot → scale → embed · <em>50% active at end of Q1</em>',
      blocks: [
        { atStep: 1, html: card('STAGE-GATE PILOT PATTERN', 'Same as manager course chapter 5', ['<strong>Pilot gate:</strong> 50% of pilot users active by end of Q1.', '<strong>Scale gate:</strong> active-user fraction maintained at 5x pilot scale.', '<strong>Embed gate:</strong> active fraction holds at month 6 with no additional change-mgmt effort.'], 'Any gate fails → don\'t expand. Diagnose. Either active-user fraction is the gap · or use cases are wrong · or change mgmt isn\'t working.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Build business case for your org · realistic active-user fraction (30-40% if new, 50-60% with strong CM)', ['Calculate net value across 12 months. <strong>Use that number as decision-bar for licensing strategy.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Security + compliance · <em>Purview · Defender · EU AI Act</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', '3 licensing patterns · business case math · active-user fraction is the variable.', '<strong>Next:</strong> tenant isolation · MS Graph permission inheritance · Purview DLP · Defender for Cloud Apps · EU AI Act + HIPAA + DPDPA.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 140.0, slide: 4 }, { at: 150.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 265.0, slide: 5, step: 2 },
    { at: 290.0, slide: 6 }, { at: 300.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Security + compliance posture' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-security.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · IT-ADMIN WORK', h1Html: 'Tenant isolation · Purview · <em>Defender</em>', subtitleHtml: 'IT-admin work that has to happen <strong>before users get the feature</strong>.' },
    { type: 'content', eyebrow: 'Tenant isolation + Graph permissions', icon: '1', headlineHtml: 'Copilot respects M365 permissions · <em>permissions audit is non-negotiable</em>',
      blocks: [{ atStep: 1, html: card('MS COPILOT ARCHITECTURE', 'Tenant-isolated processing · MS Graph permission inheritance', ['Your prompts + outputs don\'t commingle with other MS customers · not used to train MS general models.', '<strong>MS Graph integration:</strong> Copilot respects existing M365 permissions. User can only access via Copilot what they could already access in M365.'], 'The corollary: <strong>if existing M365 permissions are wrong, Copilot inherits that wrongness — and surfaces it at scale.</strong> Pre-Copilot: employee might not stumble across wrong-permissions file. Post-Copilot: they search and find it. Permissions audit before Copilot is non-negotiable.') }] },
    { type: 'content', eyebrow: 'Microsoft Purview · DLP for Copilot', icon: '2', headlineHtml: 'Sensitivity labels · <em>DLP policies before Copilot</em>',
      blocks: [{ atStep: 1, html: card('MICROSOFT PURVIEW · DLP', 'Sensitivity labels + DLP policies block Copilot from reading/summarising labelled documents', ['Files labelled "Confidential" or "Internal Use Only" get DLP treatment. <strong>Policies block Copilot from reading labelled docs.</strong>'], 'Practical: run sensitivity labelling on document libraries BEFORE Copilot rollout. <strong>If labels aren\'t there, DLP rules can\'t take effect.</strong> This is often where Copilot rollouts stall.') }] },
    { type: 'content', eyebrow: 'Microsoft Defender for Cloud Apps · CASB', icon: '3', headlineHtml: 'Monitor Copilot · <em>detect anomalies · SOC alerts</em>',
      blocks: [{ atStep: 1, html: card('MICROSOFT DEFENDER FOR CLOUD APPS', 'CASB · monitors Copilot usage · detects anomalous patterns · alerts on potential data exfiltration', ['Dashboard showing Copilot usage patterns · detection of high-risk activities (employee running Copilot prompt that summarises entire customer database) · alerts to SOC team.'], 'Most enterprises by 2026: <strong>Defender + Purview + existing M365 permission model = standard security baseline.</strong>') }] },
    { type: 'content', eyebrow: 'Regulatory frame · EU + HIPAA + DPDPA', icon: '4', headlineHtml: 'EU Art. 50 · HIPAA BAA · <em>DPDPA consent</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('EU AI ACT', 'Art. 50 transparency', '', 'Customer-facing Copilot in EU → transparency obligation. Art. 99 fines if violated.', 'amber')}
${cell('HIPAA', 'Healthcare', '', 'MS offers HIPAA-compliant Copilot tier with BAA. <strong>Confirm in writing.</strong>', 'amber')}
${cell('INDIA DPDPA', 'Sensitive data', '', 'Sensitive personal data + Copilot → consent + data-fiduciary obligations.', 'amber')}
${cell('UK FCA', 'Consumer Duty', '', 'Applies to Copilot used in UK financial-services customer interactions.', 'amber')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Before Copilot deployment beyond pilot · audit 1 document library', ['Permission accuracy · sensitivity labels applied · DLP policies in place. <strong>If any missing — that\'s the gap.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Adoption + change management · <em>active-user gap</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Tenant isolation + Graph + Purview + Defender + regulatory · IT-admin work non-negotiable.', '<strong>Next:</strong> the most important chapter. Why 60-70% of licensees don\'t become active · the 3 moves · champions network · office hours · Adoption Score.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 95.0, slide: 3 }, { at: 105.0, slide: 3, step: 1 },
    { at: 165.0, slide: 4 }, { at: 175.0, slide: 4, step: 1 },
    { at: 220.0, slide: 5 }, { at: 230.0, slide: 5, step: 1 }, { at: 270.0, slide: 5, step: 2 },
    { at: 295.0, slide: 6 }, { at: 305.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Adoption + change management' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-adoption.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · THE MOST IMPORTANT CHAPTER', h1Html: 'Champions · office hours · <em>track visibly</em>', subtitleHtml: '30-40% become active. <strong>60-70% drift back. This chapter is what makes the rollout pay off.</strong>' },
    { type: 'content', eyebrow: 'Why the gap happens · 3 reasons', icon: '1', headlineHtml: 'Integration · trust · <em>accountability</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('REASON 1', 'No workflow integration', '', 'Friction of opening the right pane = default to old habits.')}
${cell('REASON 2', 'Trust not calibrated', '', 'Don\'t know which tasks Copilot is good vs bad at. Avoid important. Don\'t bother with low-stakes.')}
${cell('REASON 3', 'No accountability', '', 'Nobody asks "did you try Copilot for that?" <strong>Behaviour change has no social reinforcement.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Move 1 · champions network', icon: '2', headlineHtml: '2-3 per BU · <em>deep training · in-team resource</em>',
      blocks: [{ atStep: 1, html: cardGreen('MOVE 1 · CHAMPIONS NETWORK', '2-3 champions per business unit · deep training · early access to new features · in-team resource', ['Champions do what training videos can\'t. <strong>Local expertise. Familiar voices. In-context coaching.</strong>'], 'By month 3 of rollout, champions are doing more adoption work than the IT team.') }] },
    { type: 'content', eyebrow: 'Move 2 · office hours · weekly 30-min', icon: '3', headlineHtml: 'Drop-in sessions · <em>new use cases emerge</em>',
      blocks: [{ atStep: 1, html: cardGreen('MOVE 2 · OFFICE HOURS', 'Weekly 30-min drop-in · any employee with Copilot question · voluntary · run by champions + IT support', ['<strong>Where new use cases emerge:</strong> "I tried this and it didn\'t work, what should I do?" Conversation produces a usable pattern. Shared back to broader team.']) }] },
    { type: 'content', eyebrow: 'Move 3 · track adoption visibly', icon: '4', headlineHtml: 'Adoption Score + Viva · <em>monthly per team</em>',
      blocks: [
        { atStep: 1, html: cardGreen('MOVE 3 · TRACK ADOPTION', 'MS Adoption Score + Viva Insights · active-user fraction per team/role/geography · monthly', ['<strong>Make data visible to managers — not punitive.</strong> Conversation starter, not stick.', 'Signal: "this team 30% active, this team 60%." High-fraction managers share what\'s working. Low-fraction managers learn from them.'], 'This is leverage from chapter 7 of the manager course.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Identify 2 champions in your team · the ones who, given Copilot, will use it for 1/3 of drafting + analysis within 4 weeks', ['<strong>They exist. You probably know who they are.</strong> Get them deep training. Make them the in-team resource. <em>That\'s the foundation.</em>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Copilot Studio · <em>build vs configure</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', '3 moves · champions + office hours + visible tracking. <em>Foundation of durable adoption.</em>', '<strong>Next:</strong> when to extend Copilot with custom agents · when to leave it alone · the 3-phase build pattern.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 245.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Copilot Studio + agentic extensions' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-copilot-studio.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · BUILD VS CONFIGURE', h1Html: 'When to extend · <em>when to leave alone</em>', subtitleHtml: 'Microsoft Copilot Studio for custom agents. <strong>Most enterprise use cases don\'t need custom agents.</strong>' },
    { type: 'content', eyebrow: 'What Copilot Studio is', icon: '1', headlineHtml: 'Custom agents · Power Platform · <em>Graph integration</em>',
      blocks: [{ atStep: 1, html: card('MICROSOFT COPILOT STUDIO', 'Platform for building custom Copilot agents · 2024-25', ['Builds enterprise-specific agents · connects to internal data sources · agentic capabilities (multi-step workflows, document grounding, Power Automate integration).'], 'Enables: custom agent that knows your company policies, customer database, project docs · surfaces relevant info at point of need · integrates with M365 Copilot for users.') }] },
    { type: 'content', eyebrow: 'When to extend · 3 categories', icon: '2', headlineHtml: 'Internal knowledge · workflow · <em>domain assistants</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('CAT 1', 'Internal knowledge AI', '', 'Policy docs · procedures · FAQ pages. <strong>HR Q&A · IT helpdesk · CS training.</strong>')}
${cell('CAT 2', 'Workflow automation', '', 'AI + Power Automate. Multi-step processes. Approval workflows. Document classification + routing. Onboarding automation.')}
${cell('CAT 3', 'Domain-specific assistants', '', 'Sales rep account-briefing agent · procurement supplier-evaluation agent. Specialist agents with business context.')}
</div>` }] },
    { type: 'content', eyebrow: 'When NOT to extend · 3 patterns', icon: '!', iconRed: true, headlineHtml: 'Out-of-box solves it · <em>not the moat · adoption isn\'t there</em>',
      blocks: [{ atStep: 1, html: cardRed('WHEN NOT TO EXTEND COPILOT', 'Most enterprise use cases don\'t need custom agents', ['<strong>Pattern 1:</strong> when out-of-the-box Copilot solves the problem. Don\'t build agents because they look impressive.', '<strong>Pattern 2:</strong> when proprietary data + workflow isn\'t the moat (McKinsey/BCG advisory). Most use cases don\'t need custom.', '<strong>Pattern 3:</strong> when adoption isn\'t there. Active-user fraction below 30% → don\'t add complexity. <em>Get baseline working first.</em>']) }] },
    { type: 'content', eyebrow: 'The build pattern · 3 phases', icon: '3', headlineHtml: 'Pilot 5-10 · scale 1 team · <em>broader if value holds</em>',
      blocks: [
        { atStep: 1, html: card('BUILD PATTERN · 3 PHASES', 'Most agents stall at phase 1 or 2 · kill those', ['<strong>Phase 1:</strong> pilot with 5-10 users · measure usage + value · iterate on prompts, data sources, workflow.', '<strong>Phase 2:</strong> scale to 1 team · the team where use case is most aligned · measure adoption + value.', '<strong>Phase 3:</strong> broader rollout if value holds.'], 'Same stage-gate as manager course. Most custom agents shouldn\'t be built. <em>Discipline is the courage to kill the ones that don\'t add value.</em>') },
        { atStep: 2, html: card('MONDAY MOVE', 'Look at current Copilot deployment · where is it falling short?', ['What do users repeatedly ask for that out-of-box doesn\'t deliver? Those are candidate extensions. <strong>Pilot one. Don\'t pilot five.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Measuring real outcomes · <em>Tetlock calibration</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '3 categories to extend · 3 patterns not to · 3-phase build. <em>Most agents shouldn\'t be built.</em>', '<strong>Next:</strong> Tetlock calibration on Microsoft\'s 30% · honest measurement framework · early-decay pattern.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 65.0, slide: 3 }, { at: 75.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 245.0, slide: 6 }, { at: 255.0, slide: 6, step: 1 }
  ]
});

emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Measuring real outcomes' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-measuring.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · TETLOCK CALIBRATION', h1Html: 'Active-user fraction · 3 numbers · <em>honest framework</em>', subtitleHtml: 'MS Work Trend Index ~30% is calibrated and qualified. <strong>Your own measurement tells you whether your rollout is in the calibrated zone.</strong>' },
    { type: 'content', eyebrow: 'Tetlock + Microsoft\'s number', icon: '1', headlineHtml: 'Calibrated + qualified · <em>use as starting reference</em>',
      blocks: [{ atStep: 1, html: card('TETLOCK CALIBRATION APPLIED TO MS NUMBERS', 'Microsoft\'s ~30% time savings claim is calibrated AND qualified', ['Qualifications: active users · routine documents · MS Work Trend Index methodology (surveys + telemetry).', '<strong>Use as a calibrated starting reference. Your own measurement is what tells you whether your rollout is in the calibrated zone.</strong>']) }] },
    { type: 'content', eyebrow: 'Active-user metric · the central data', icon: '2', headlineHtml: 'Adoption Score + Viva · <em>1+ interaction/week</em>',
      blocks: [{ atStep: 1, html: card('THE ACTIVE-USER METRIC', 'MS Adoption Score + Viva Insights · primary data sources', ['Active = 1+ Copilot interactions per week. <strong>Below that, licensed user not active user.</strong>', 'Track: active-user fraction by quarter, per team. Target by month 6: 50%+. By month 12: 60-70% for orgs doing this well.'], 'Watch for early-decay pattern: most rollouts see 40-50% in first month, decay to 20-30% by month 3 as novelty fades. <strong>Strong change management catches and reverses this.</strong>') }] },
    { type: 'content', eyebrow: 'Honest measurement framework · 3 numbers', icon: '3', headlineHtml: 'Active-user · task productivity · <em>quality + re-work</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('NUMBER 1', 'Active-user fraction', '', 'From MS Adoption Score · monthly · per team.')}
${cell('NUMBER 2', 'Task-level productivity', '', 'Pick 3 use cases · survey active users on time saved per task · quarterly · triangulate against pre-Copilot baseline.')}
${cell('NUMBER 3', 'Quality + re-work', '', 'Are outputs as good or better than pre-Copilot? <strong>Are users spending re-work time fixing mistakes?</strong> Often-missed measure.')}
</div>` }] },
    { type: 'content', eyebrow: 'What not to claim · honest business case', icon: '!', iconRed: true, headlineHtml: 'Don\'t extrapolate MS 30% · <em>to full licensed base</em>',
      blocks: [
        { atStep: 1, html: cardRed('WHAT NOT TO CLAIM IN YOUR BUSINESS CASE', 'Don\'t extrapolate Microsoft\'s 30% to your full licensed user base', ['Active-user fraction matters. Most organisations 30-40% active. Net productivity roughly proportional to active-user fraction.', '<strong>Don\'t claim productivity gains without measurement.</strong> Pre-Copilot baseline + active-user verification + quality check.'], 'Honest CFO presentation shows confidence intervals, not point estimates. Tetlock applied.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull MS Adoption Score data for last quarter · what\'s your active-user fraction?', ['If you don\'t know — that\'s the first metric to surface. Once you know — <strong>set target for next quarter. Aim for +10pp.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your Copilot rollout roadmap · <em>3 phases · 4 trip-wires</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Calibrated + qualified · active-user fraction is the metric · honest 3-number framework.', '<strong>Last chapter:</strong> 3-phase rollout plan · 4 trust trip-wires · interactive builder.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 235.0, slide: 5, step: 2 },
    { at: 255.0, slide: 6 }, { at: 265.0, slide: 6, step: 1 }
  ]
});

const ch8BuilderInit = `
var builderInit=false;var state={pilot:'',champions:'',cadence:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='m365-copilot-rollout-plan.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var p=state.pilot||'_(pick pilot size)_';var c=state.champions||'_(pick champion model)_';var m=state.cadence||'_(pick measurement cadence)_';return '# M365 Copilot · Rollout Roadmap\\n\\n**CIO / IT Lead / Change Manager:** ____________________\\n**Start date:** ____________________\\n\\n## Pilot size\\n> '+p+'\\n\\n## Champion model\\n> '+c+'\\n\\n## Measurement cadence\\n> '+m+'\\n\\n## Phase 1 · Pilot (weeks 1-12)\\n- 200-300 users across functions\\n- Security + compliance posture in place (Purview labels · DLP · Defender · BAA if HIPAA)\\n- 2 champions per BU identified + trained\\n- Office hours started week 3\\n- Target: 50% active by week 12\\n\\n## Phase 2 · Scale (months 4-6)\\n- Expand to manager + knowledge-worker tier (800-1500 users)\\n- Champions network active across org\\n- MS Adoption Score data visible monthly\\n- Target: 50-60% active by month 6\\n\\n## Phase 3 · Embed + optimise (months 7+)\\n- Copilot is default reach for routine doc + email work\\n- Performance conversations include Copilot fluency\\n- Copilot Studio agents only for high-value use cases\\n\\n## Trust trip-wires (do not cross)\\n- Sensitive-data classification before deployment (Purview labels + DLP)\\n- No Copilot beyond pilot without compliance posture\\n- Active-user fraction tracked monthly\\n- No "set and forget" · champions network + office hours past month 6\\n\\n---\\nSource: Gennoor Academy · Tools · Microsoft 365 Copilot Adoption\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your Copilot rollout roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 3 PHASES', h1Html: 'Pilot · scale · <em>embed</em>', subtitleHtml: '7 chapters · this chapter sequences them.' },
    { type: 'content', eyebrow: 'The principle', icon: '1', headlineHtml: 'Adoption is the challenge · <em>active-user fraction is the metric</em>',
      blocks: [{ atStep: 1, html: card('THE PRINCIPLE', 'Adoption is the challenge. Not licensing. Not technology.', ['IT team gets licenses delivered. Change-mgmt team creates active users. <strong>Active-user fraction is the metric that matters.</strong>']) }] },
    { type: 'content', eyebrow: 'The default rollout sequence · 3 phases', icon: '2', headlineHtml: 'P1 pilot · P2 scale · <em>P3 embed</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('PHASE 1 · WEEKS 1-12', 'Pilot', '', '200-300 users · security + compliance posture · 2 champions per BU · office hours week 3 · target 50% active by week 12.')}
${cell('PHASE 2 · MONTHS 4-6', 'Scale', '', 'Manager + knowledge-worker tier (800-1500 users) · champions network active · Adoption Score visible monthly · target 50-60% active by month 6.', 'amber')}
${cell('PHASE 3 · MONTHS 7+', 'Embed + optimise', '', 'Copilot = default reach · perf conversations include Copilot fluency · Copilot Studio only for high-value use cases.', 'green')}
</div>` }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'Sensitive-data classification before deployment', '', 'Sensitivity labels + DLP + Purview. Without this, Copilot can surface sensitive docs inappropriately.', 'red')}
${cell('TRIP-WIRE 2', 'No Copilot beyond pilot without compliance posture', '', 'EU AI Act + HIPAA + DPDPA. In writing. Reviewed by GC.', 'red')}
${cell('TRIP-WIRE 3', 'Active-user fraction tracked monthly', '', 'If below 40% at month 6, don\'t expand. <strong>Diagnose. Fix change management.</strong>', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Champions network maintained · office hours past month 6 · quarterly review.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pick · download · <em>take to CIO + business sponsor</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pilot size</h5><div class="preset" data-group="pilot">
<button data-val="Small (100-200 users · 1-2 BUs)">Small (100-200)</button>
<button data-val="Standard (200-300 users · 3-4 BUs)">Standard (200-300)</button>
<button data-val="Large (500+ users · 5+ BUs)">Large (500+)</button>
</div></div>
<div class="group"><h5>Champion model</h5><div class="preset" data-group="champions">
<button data-val="2 champions per BU · deep training + early access">2/BU · standard</button>
<button data-val="1 champion per team + 1 IT-adoption lead">Per-team + IT lead</button>
<button data-val="Network of 30-50 champions org-wide + monthly summit">Org-wide network</button>
</div></div>
<div class="group"><h5>Measurement cadence</h5><div class="preset" data-group="cadence">
<button data-val="Monthly Adoption Score + quarterly task survey + annual quality review">Monthly + quarterly + annual</button>
<button data-val="Monthly Adoption Score only · with manager dashboards">Monthly only</button>
<button data-val="Quarterly · with deep-dive per-team review">Quarterly deep-dive</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my Copilot rollout plan (.md)</button>
</div>
<div class="preview" id="preview"># M365 Copilot · Rollout Roadmap

Pick pilot size, champion model, and cadence on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Adoption · active-user fraction · <em>champions network</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Active-user fraction is the metric · adoption is the challenge · champions network beats training videos · MS Adoption Score + Viva Insights are the data · pilot then scale then embed · sensitive-data classification before deployment · Copilot Studio only when proprietary data + workflow is the moat · IT delivers licenses · change management creates active users.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your pilot.</div><div class="row"><span class="arr">→</span>Get one CIO or business-sponsor conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 50.0, slide: 3 }, { at: 60.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 },
    { at: 215.0, slide: 6 }, { at: 225.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 19 chapters 1-8 built.');
