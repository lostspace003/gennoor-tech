// Build Course 11 chapter HTMLs — AI Foundations (Emma · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Foundations · AI Foundations';
const OUT = 'tmp/academy-build/ai-foundations/chapters';

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

// Ch1 — Landscape
emit({
  courseTagline,
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'What AI is (and isn\'t)' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-what-ai-is.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · CALIBRATED LITERACY', h1Html: '78% adoption · <em>not a curiosity anymore</em>', subtitleHtml: 'Stanford AI Index 2025: 78% of orgs used AI in 2024 (up from 55%). McKinsey: 71% regularly use gen AI in at least one function. <strong>Calibrated literacy is the right posture — not hype, not fear.</strong>' },
    { type: 'content', eyebrow: 'Adoption · Stanford AI Index 2025 + McKinsey 2025', icon: '1', headlineHtml: 'Mainstream enterprise · <em>not leading edge</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('STANFORD AI INDEX 2025', 'Global orgs using AI in 2024', '78%', 'Up from 55% the year before.')}
${cell('McKINSEY STATE OF AI 2025', 'Regularly using gen AI', '71%', 'In at least one function.')}
${cell('OPENAI / ChatGPT', 'Time to 100M users', '2 months', 'Fastest-growing consumer app of its time (UBS/Similarweb).')}
</div>` }] },
    { type: 'content', eyebrow: 'What "AI" actually means · 3 things people mean', icon: '2', headlineHtml: 'Machine learning · LLMs · <em>marketing-speak</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('1', 'Machine learning', '', 'Broader category. Algorithms learning patterns from data. <strong>Around for decades.</strong>')}
${cell('2', 'Large language models', '', 'The specific tech behind ChatGPT, Claude, Gemini, Copilot. <strong>Trained on enormous text. Predicts next word.</strong>')}
${cell('3', 'AI as marketing term', '', 'Every product is "AI-powered" in 2026. Most is genuine ML. Some is rule-based automation re-labelled. <strong>Ask which one.</strong>', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'Where we are · Gartner Hype Cycle 2025', icon: '3', headlineHtml: 'Trough of disillusionment · <em>cleanup phase</em>',
      blocks: [{ atStep: 1, html: card('GARTNER HYPE CYCLE FOR AI · 2025', 'Generative AI past peak inflated expectations · in cleanup phase', ['Peak hype was 2023-24. The serious productivity work is now.', '<strong>Calibrated literacy is the right posture.</strong> Not "AI will change everything in 6 months." Not "AI is just autocomplete." Somewhere in between.'], 'Where the genuine productivity gains are real, the failure modes are documented, and the discipline you bring matters.') }] },
    { type: 'content', eyebrow: 'The consumer reality · Pew Research 2024', icon: '4', headlineHtml: '23% have tried ChatGPT · <em>more skewed by demographics</em>',
      blocks: [
        { atStep: 1, html: card('PEW RESEARCH SURVEYS 2023-2024', '58% of US adults have heard of ChatGPT · 23% have tried it', ['Higher among professional workers under 50. Lower among older + non-college-educated workers.', '<strong>If you\'re a professional in 2026 and haven\'t used a gen-AI tool — you\'re behind the median for your demographic.</strong> This course closes that gap.']) },
        { atStep: 2, html: card('THE THESIS', 'Calibrated literacy across 8 chapters', ['Knowing what AI is · how it works in plain terms · where it fits · what risks to watch · how to evaluate claims · how to build habits. <strong>Each chapter ends with what you do Monday.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1 · THE COURSE MAP', 'Calibrated literacy. <em>Not hype. Not fear. The honest middle.</em>', '<strong>Next:</strong> how LLMs actually work — in plain English. Why they sometimes hallucinate. Why retrieval-grounded systems are more reliable.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 130.0, slide: 4 }, { at: 140.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 240.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// Ch2 — How LLMs work
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'How LLMs actually work' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-how-llms-work.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · PLAIN ENGLISH', h1Html: 'Tokens · training · <em>next-token prediction</em>', subtitleHtml: 'No math. Once you understand what an LLM is doing under the hood, you understand both why it\'s useful and why it sometimes confidently says things that aren\'t true.' },
    { type: 'content', eyebrow: 'Tokens · the starting point', icon: '1', headlineHtml: 'Pieces of words · <em>not letters, not whole words</em>',
      blocks: [{ atStep: 1, html: card('TOKENS · WHAT THE MODEL SEES', 'When you type a sentence, the model sees pieces called tokens', ['Word "running" might be one token. Phrase "thoroughly examined" might be three.', '<strong>Doesn\'t matter for you in practice. Just know — model sees tokens, not letters or words.</strong>']) }] },
    { type: 'content', eyebrow: 'Training · learning patterns from trillions of tokens', icon: '2', headlineHtml: 'GPT-4 cost ~$100M · <em>once</em>',
      blocks: [{ atStep: 1, html: card('TRAINING', 'Model shown trillions of tokens from the internet, books, articles, code', ['Learned statistical patterns about which token is likely to follow which.', '<strong>Not facts. Patterns.</strong> "The president announced" is often followed by certain kinds of words.', 'Training cost real money: GPT-4 ~$100M. <strong>Happened once. You\'re not retraining — you\'re using the trained model.</strong>']) }] },
    { type: 'content', eyebrow: 'Prediction · the key insight', icon: '3', headlineHtml: 'Plausible-sounding next text · <em>not retrieval</em>',
      blocks: [{ atStep: 1, html: card('PREDICTION', 'When you ask a question, the model generates the response one token at a time, predicting the most likely next given everything before', ['Not retrieving a stored answer. <strong>Predicting plausible-sounding next text.</strong>'], 'That\'s the whole story behind hallucinations. The model is doing what it was trained to do — generating plausible text. Sometimes "plausible" matches "true." Sometimes it doesn\'t.') }] },
    { type: 'content', eyebrow: 'Hallucination · Stanford "Hallucinating Law" Jan 2024', icon: '!', iconRed: true, headlineHtml: 'Top legal AI tools · <em>17–34% hallucination</em>',
      blocks: [
        { atStep: 1, html: cardRed('STANFORD HAI · HALLUCINATING LAW · JAN 2024', 'Top legal AI tools hallucinated 17–34% on benchmark queries — even retrieval-grounded ones', ['The model wants to give you an answer. With partial information, it fills gaps with plausible completions.', '<strong>That gap-filling is where fabrication occurs.</strong> A case citation that sounds right but doesn\'t exist. A statistic that sounds reasonable but isn\'t real.']) },
        { atStep: 2, html: cardGreen('THE FIX · RETRIEVAL-GROUNDED SYSTEMS', 'Connect the model to real documents or databases · retrieve first · generate from what was retrieved', ['Microsoft Copilot for M365, ChatGPT Enterprise, Claude Projects.', 'Hallucination rate drops dramatically. Not to zero. But to manageable.'], 'What you do: check anything important. Treat the model like a smart intern — useful, fast, but checks need to happen before its work leaves your desk.') }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Where AI fits · <em>5 categories that work</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'Tokens · training · prediction · hallucination. <em>Now you know the mechanics.</em>', '<strong>Next:</strong> where AI fits in everyday work. MIT/BCG/Harvard/Goldman 15–40% productivity gains on knowledge work.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 105.0, slide: 4 }, { at: 115.0, slide: 4, step: 1 },
    { at: 160.0, slide: 5 }, { at: 170.0, slide: 5, step: 1 }, { at: 210.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

// Ch3 — Where AI fits
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Where AI fits in everyday work' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-where-ai-fits.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · MATCH TOOL TO TASK', h1Html: '5 categories work · <em>3 work less reliably</em>', subtitleHtml: 'MIT/BCG/Harvard/Goldman 2023-24 studies: <strong>15–40% productivity gains on knowledge-work tasks</strong> for AI-augmented workers. The lower number is conservative. The higher number is for well-fitted use cases.' },
    { type: 'content', eyebrow: 'The productivity evidence · 4 study sources', icon: '1', headlineHtml: '15–40% on knowledge-work tasks · <em>for AI-augmented workers</em>',
      blocks: [{ atStep: 1, html: cardGreen('MIT · BCG · HARVARD · GOLDMAN SACHS 2023-24', 'Consistent productivity gains of 15–40% on knowledge-work tasks for AI-augmented workers', ['Lower number is conservative. Higher number is for specific well-fitted use cases.', '<strong>"Well-fitted" matters.</strong> The next slide lists which fits — and which don\'t.']) }] },
    { type: 'content', eyebrow: '5 categories that work · in 2026', icon: '2', headlineHtml: 'Drafting · summarising · translating · classifying · <em>code</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-5" data-step="1">
${cell('1', 'Drafting', '', 'First drafts of emails, reports, summaries, proposals. <strong>80% of the way to usable.</strong>', 'green')}
${cell('2', 'Summarising', '', 'Long documents, transcripts, papers. <strong>Faster than humans.</strong>', 'green')}
${cell('3', 'Translating', '', 'Between languages. Between registers. Between technical and non-technical audiences. <strong>Extraordinary.</strong>', 'green')}
${cell('4', 'Classifying + extracting', '', 'Pull data points. Tag emails. Categorise feedback. <strong>Hours → minutes.</strong>', 'green')}
${cell('5', 'Code generation', '', 'GitHub Copilot · Cursor · Claude Code. <strong>Non-programmers can write basic scripts now.</strong>', 'green')}
</div>` }] },
    { type: 'content', eyebrow: '3 categories that work less well · be honest', icon: '!', iconRed: true, headlineHtml: 'Open research · judgement calls · <em>specific facts about specific people</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('1', 'Open-ended research with citations', '', 'Stanford 17–34% hallucination. <strong>Verify every citation against the primary source.</strong>', 'red')}
${cell('2', 'Judgemental decisions', '', 'Hiring · personnel · escalations. <strong>AI can inform. Humans decide.</strong>', 'red')}
${cell('3', 'Identity + specific facts', '', 'Model wasn\'t trained on your customers. <strong>Don\'t use as substitute for actually knowing.</strong>', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'The discipline + the active-user reality', icon: '3', headlineHtml: 'Active users get the gains · <em>30% time saved on routine docs</em>',
      blocks: [
        { atStep: 1, html: card('MICROSOFT WORK TREND INDEX', 'Microsoft\'s published research on Copilot users · ~30% time savings on routine documents for active users', ['<strong>"Active users" is the operative phrase.</strong>', 'The benefit goes to people who use it consistently. Not people who tried it once.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one task you do regularly · use AI for it for one full week', ['Drafting a team update. Summarising a long thread. Classifying feedback.', '<strong>Time it. Note quality differences. Decide whether to keep doing it.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Privacy &amp; bias risks · <em>3 real named cases</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Match the tool to the task. <em>AI for routine knowledge work. Humans for judgement.</em>', '<strong>Next:</strong> Mata v. Avianca · Air Canada Moffatt · Bloomberg resume study · EU AI Act Art. 50 + Art. 99.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 55.0, slide: 3 }, { at: 65.0, slide: 3, step: 1 },
    { at: 150.0, slide: 4 }, { at: 160.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

// Ch4 — Privacy + bias risks
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Privacy and bias risks' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-privacy-bias.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · 3 REAL CASES', h1Html: 'Mata · Air Canada · <em>Bloomberg study</em>', subtitleHtml: '3 verifiable cases. 1 personal-data rule. EU AI Act Art. 50 transparency + Art. 99 fines from Aug 2 2026. <strong>Not to scare. To use AI responsibly.</strong>' },
    { type: 'content', eyebrow: 'Case 1 · Mata v. Avianca · S.D.N.Y. Jun 22 2023', icon: '!', iconRed: true, headlineHtml: 'ChatGPT fabricated 6 cases · <em>$5K sanction · letters to judges</em>',
      blocks: [{ atStep: 1, html: cardRed('MATA v. AVIANCA · 22-CV-1461 PKC · S.D.N.Y.', '2 lawyers submitted brief citing 6 federal cases · all fabricated by ChatGPT', ['Judge Castel: <strong>$5,000 sanction · personal letters to each falsely-cited judge.</strong>', 'The lesson — <em>AI confidently produces specific facts that aren\'t real.</em>'], 'If you use AI output in any high-stakes context, verify every specific claim against a primary source.') }] },
    { type: 'content', eyebrow: 'Case 2 · Moffatt v. Air Canada · BC CRT Feb 14 2024', icon: '!', iconRed: true, headlineHtml: 'Chatbot promised bereavement-fare refund · <em>airline policy didn\'t allow it</em>',
      blocks: [{ atStep: 1, html: cardRed('MOFFATT v. AIR CANADA · BC CIVIL RESOLUTION TRIBUNAL', 'Chatbot told grieving passenger he could apply for refund later · actual policy required pre-approval · CA$812 + interest awarded', ['<strong>"Air Canada is responsible for all information on its website, including from a chatbot."</strong>', 'The lesson — anything an AI says on behalf of a company is the company\'s statement.']) }] },
    { type: 'content', eyebrow: 'Case 3 · Bloomberg resume study · Mar 2024', icon: '!', iconRed: true, headlineHtml: 'Identical resumes · names varied · <em>statistically significant bias</em>',
      blocks: [{ atStep: 1, html: cardRed('BLOOMBERG NEWS INVESTIGATION · MAR 2024', 'Identical resumes · only names varied (NC voter rolls) · GPT-3.5 + GPT-4 ranked across 1000 trials', ['Unbiased baseline: each demographic group should top-rank ~12.5%. Some groups topped at 11%. Others much higher.', '<strong>Statistically significant bias. Reproducible — methodology and data public on Bloomberg\'s GitHub.</strong>'], 'The lesson — AI inherits biases from training data. If you\'re using it where bias matters, you need explicit controls.') }] },
    { type: 'content', eyebrow: 'Personal data + EU AI Act', icon: '4', headlineHtml: 'Enterprise tools for sensitive data · <em>EU AI Act from Aug 2 2026</em>',
      blocks: [
        { atStep: 1, html: card('THE PERSONAL DATA RULE', 'Don\'t put client-confidential, regulated, or personally-sensitive info into a free consumer AI account', ['Use enterprise version your company licenses — OpenAI Enterprise, Anthropic Claude for Work, Microsoft 365 Copilot.', '<strong>All have training opt-out by default + tenant-isolated data handling.</strong>', 'Read the trust page. Or ask IT.']) },
        { atStep: 2, html: card('EU AI ACT · REG. 2024/1689 · TRANCHES THROUGH AUG 2 2026', 'High-risk categories (Annex III) · transparency (Art. 50) · fines (Art. 99)', ['<strong>If interacting with AI — AI must say so.</strong>', '<strong>Fines up to €15M or 3% global turnover.</strong>', 'If your company serves EU customers, applies even if you\'re outside the EU.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Evaluating AI claims · <em>3 questions to ask</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', '3 cases · 1 rule · 1 regulation. <em>Honest about risks. Not catastrophising.</em>', '<strong>Next:</strong> Tetlock — calibration > confidence. The 3 questions for any vendor productivity claim.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 65.0, slide: 3 }, { at: 75.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 260.0, slide: 6 }, { at: 270.0, slide: 6, step: 1 }
  ]
});

// Ch5 — Evaluating AI claims
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Evaluating AI claims' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-evaluating-claims.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · CALIBRATION > CONFIDENCE', h1Html: '3 questions · <em>before you believe any claim</em>', subtitleHtml: 'Tetlock: calibration matters more than confidence. <strong>Studied population · compared to what · what didn\'t get measured.</strong>' },
    { type: 'content', eyebrow: 'The framing · Tetlock 20+ years of research', icon: '1', headlineHtml: 'Calibrated 70% · <em>beats over-confident 80%</em>',
      blocks: [{ atStep: 1, html: card('TETLOCK · "EXPERT POLITICAL JUDGMENT" + "SUPERFORECASTING"', '20+ years of work on forecasting performance · 1 central finding', ['<strong>Calibration matters more than confidence.</strong>', 'Person who says "I\'m 70% sure" and gets it right 70% — more useful than someone who says "I\'m certain" and gets it right 80%.', '<strong>The certain person is over-confident.</strong>'], 'Apply to AI claims: when a vendor says "30% productivity gain," is that calibrated or over-confident?') }] },
    { type: 'content', eyebrow: 'Question 1 · who exactly?', icon: '2', headlineHtml: 'Studied population · <em>"active" is the operative word</em>',
      blocks: [{ atStep: 1, html: card('QUESTION 1 · STUDIED POPULATION', 'Who exactly?', ['MS Work Trend Index reports ~30% time savings on routine docs for <strong>active Copilot users.</strong>', '"Active" = people who use the tool consistently every week. Not people who tried it once.', '<strong>The claim that applies to your team may differ from the headline number.</strong>']) }] },
    { type: 'content', eyebrow: 'Question 2 · compared to what?', icon: '3', headlineHtml: 'The honest comparison · <em>before-workflow vs after-workflow</em>',
      blocks: [{ atStep: 1, html: card('QUESTION 2 · COMPARED TO WHAT', '"AI saved 30% of drafting time" — compared to drafting without any assistance? Or vs templates? Or vs Google?', ['The honest comparison: <strong>what was the workflow before · what is it now · what\'s the time delta.</strong>', 'If the vendor can\'t answer that crisply, the productivity number is marketing, not measurement.']) }] },
    { type: 'content', eyebrow: 'Question 3 · what got skipped?', icon: '4', headlineHtml: 'Quality · re-work · <em>verification time</em>',
      blocks: [
        { atStep: 1, html: card('QUESTION 3 · WHAT DIDN\'T GET MEASURED', 'Quality. Re-work. Verification time.', ['Stanford hallucination story is the cautionary tale — <strong>AI saved drafting time and added verification time.</strong> Only counting drafting time makes the productivity story incomplete.', 'Other often-unmeasured: re-work when AI was wrong · cognitive offloading · bias drift over time.'], 'Honest vendors name what they didn\'t measure. Marketing vendors don\'t.') },
        { atStep: 2, html: card('PEW RESEARCH 2025', '70% of consumers prefer disclosure · 9% prefer hidden AI', ['If a vendor recommends hiding the AI nature of their tool, <strong>that\'s a signal.</strong>', 'EU AI Act Art. 50 makes disclosure mandatory in the EU from Aug 2 2026 anyway.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Hands-on prompts · <em>5 patterns that work</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Calibration over confidence. <em>3 questions before any vendor claim.</em>', '<strong>Next:</strong> 5 prompt patterns · worked examples in Copilot, ChatGPT, Claude.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 165.0, slide: 5 }, { at: 175.0, slide: 5, step: 1 }, { at: 210.0, slide: 5, step: 2 },
    { at: 240.0, slide: 6 }, { at: 250.0, slide: 6, step: 1 }
  ]
});

// Ch6 — Prompts that work
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Hands-on prompts that work' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-prompts-that-work.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · 5 PATTERNS', h1Html: 'Tested · practical · <em>boring</em>', subtitleHtml: '5 prompt patterns you can use today, in Copilot · ChatGPT · Claude · Gemini. <strong>The ones that work consistently. That\'s the point.</strong>' },
    { type: 'content', eyebrow: 'Pattern 1 · the workhorse', icon: '1', headlineHtml: 'Role + task + format + constraints + <em>examples</em>',
      blocks: [{ atStep: 1, html: card('PATTERN 1 · THE 5-PART RECIPE', 'Role + task + format + constraints + examples', ['<strong>Role:</strong> "Act as an experienced HR business partner."', '<strong>Task:</strong> "Draft a response to this employee question."', '<strong>Format:</strong> "Three paragraphs, professional tone, action-oriented closing."', '<strong>Constraints:</strong> "No legal commitments. Refer ambiguous cases to legal."', '<strong>Examples:</strong> paste one or two reference responses.'], 'When in doubt, return to it. Works across every model. Works across most use cases.') }] },
    { type: 'content', eyebrow: 'Pattern 2 · the outline-first move', icon: '2', headlineHtml: 'Ask for structure · <em>before the draft</em>',
      blocks: [{ atStep: 1, html: card('PATTERN 2 · ASK FOR STRUCTURE FIRST', '"Outline the key sections of a board memo arguing for X."', ['You catch problems before the model invests 1,000 words in the wrong frame.', '<strong>If outline is wrong — you fix the frame. If outline is right — then ask for the draft.</strong>']) }] },
    { type: 'content', eyebrow: 'Pattern 3 · verify the citation', icon: '3', headlineHtml: 'Ask for source · <em>then check it exists</em>',
      blocks: [{ atStep: 1, html: card('PATTERN 3 · VERIFY THE CITATION', 'If the model gives a specific fact, study, court case, or statistic — ask for the source · check the source actually exists', ['<strong>Mata v. Avianca is the cautionary tale.</strong>', 'If the model produces a citation you can\'t verify, treat the underlying claim as unverified. Don\'t ship it.']) }] },
    { type: 'content', eyebrow: 'Patterns 4 + 5 · the underused ones', icon: '4', headlineHtml: 'Rewrite for audience · <em>critique my draft</em>',
      blocks: [
        { atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('PATTERN 4', 'Rewrite my draft for X audience', '', 'You write the first draft. AI adapts. For your CEO. For your team. For a customer. For a regulator. <strong>Substance is yours. AI handles the adaptation.</strong>')}
${cell('PATTERN 5', 'Critique my draft', '', '"Find the 3 weakest arguments in this draft" · "Where would a hostile reviewer push back?" <strong>AI finds weaknesses you\'ve stopped seeing.</strong> Most-underused pattern.')}
</div>` },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick 1 of the 5 patterns · use it this week every time the situation applies', ['Track how often. Track how useful. <strong>If the pattern works, add a second one next week.</strong>', 'Two weeks · two patterns · habit forming.']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Habits that stick · <em>beyond the novelty phase</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', '5 patterns · use them. <em>Boring is the feature.</em>', '<strong>Next:</strong> why most AI initiatives drift in 4 weeks · the 3 fixes that make habits durable.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 165.0, slide: 5 }, { at: 175.0, slide: 5, step: 1 }, { at: 210.0, slide: 5, step: 2 },
    { at: 230.0, slide: 6 }, { at: 240.0, slide: 6, step: 1 }
  ]
});

// Ch7 — Habits
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Habits that stick' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-habits.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · THE HONEST CHAPTER', h1Html: 'Why most initiatives drift in <em>4 weeks</em>', subtitleHtml: 'Novelty fades. Friction wins. <strong>3 fixes that make habits durable.</strong> Use-it-Monday · pair with one colleague · track simply.' },
    { type: 'content', eyebrow: 'Why initiatives drift · 3 reasons', icon: '1', headlineHtml: 'Integration · trust · <em>accountability</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('REASON 1', 'No workflow integration', '', 'AI in a separate tab. <strong>Remembering to open it is friction.</strong>')}
${cell('REASON 2', 'Trust not calibrated', '', 'Don\'t know which tasks AI is good vs bad at. <strong>Avoid the important ones.</strong>')}
${cell('REASON 3', 'No accountability', '', 'Nobody asks "did you try AI for that?" <strong>Behaviour change has no social reinforcement.</strong>')}
</div>` }] },
    { type: 'content', eyebrow: 'Fix 1 · the use-it-Monday pattern', icon: '2', headlineHtml: 'Pick one Monday task · <em>use AI every Monday for a month</em>',
      blocks: [{ atStep: 1, html: card('FIX 1 · USE-IT-MONDAY', 'Pick one task you do every Monday · use AI for it every single Monday for a month', ['Status update. Planning email. Meeting summary. <strong>No exceptions. No "I\'ll do it manually this time."</strong>'], 'After 4 weeks, opening AI for that task is automatic. Muscle memory. <em>The friction is gone.</em>') }] },
    { type: 'content', eyebrow: 'Fix 2 · pair with one colleague', icon: '3', headlineHtml: 'One peer · <em>biggest predictor of durable adoption</em>',
      blocks: [{ atStep: 1, html: card('FIX 2 · PAIR WITH ONE COLLEAGUE', 'In research + practice: the biggest predictor of durable AI adoption is having one peer also adopting', ['Compare notes. Share prompts that worked. Catch each other\'s misuse.', '<strong>If you don\'t have a peer doing this — find one.</strong> Even one. The colleague who\'s curious. The colleague complaining about a workflow you can now improve. Bring them in.']) }] },
    { type: 'content', eyebrow: 'Fix 3 · track simply · WEF Future of Jobs framing', icon: '4', headlineHtml: 'Time · quality · <em>comfort</em>',
      blocks: [
        { atStep: 1, html: card('FIX 3 · TRACK SIMPLY', '3 metrics · 1 minute end of week', ['<strong>Time saved.</strong> <strong>Quality delta.</strong> <strong>Comfort level.</strong>', 'Write down what you did with AI · was it faster · was it better · was it easier.', 'After 4 weeks of noticing, you know what works for you. That knowledge compounds.'], 'You can\'t get there without the noticing.') },
        { atStep: 2, html: cardGreen('WEF FUTURE OF JOBS 2025', '~40% of employers expect AI/automation to reduce parts of workforce by 2030 · majority expect upskilling', ['<strong>Durable response is upskilling.</strong> The professional who builds AI into daily workflow over 2 years will be more valuable than the one who didn\'t.', 'Not "AI replacing humans." The work product is different — faster, more polished, more iterations. <em>That\'s the gap that\'s growing.</em>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 8', icon: '→', headlineHtml: 'Making it stick · <em>your 2-week starter plan</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', 'Integration · trust · accountability — 3 fixes for each. <em>Notice. Track. Pair.</em>', '<strong>Last chapter:</strong> 2-week starter plan · interactive builder · 4 trust trip-wires.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 110.0, slide: 4 }, { at: 120.0, slide: 4, step: 1 },
    { at: 165.0, slide: 5 }, { at: 175.0, slide: 5, step: 1 }, { at: 220.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

// Ch8 — Making it stick · 2-week starter plan
const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],colleague:'',start:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='usecases'){var arr=state.usecases;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ai-foundations-starter-plan.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases)_';var c=state.colleague||'_(name a colleague)_';var s=state.start||'_(pick start date)_';return '# AI Foundations · 2-Week Starter Plan\\n\\n**Owner:** ____________________\\n**Start date:** '+s+'\\n**Pair partner:** '+c+'\\n\\n## 2 use cases I will use AI for every time the task comes up\\n'+uc+'\\n\\n## Daily discipline\\n- Use AI for both tasks · every day they apply · for 14 straight days\\n- 1-minute end-of-week reflection: time saved · quality delta · comfort\\n\\n## Trust trip-wires (do not cross)\\n- No personal data to free consumer tools\\n- No AI-generated specific facts unverified against primary source\\n- No AI signs anything binding (customer commitments · legal · policy)\\n- No "set and forget" · adjust monthly\\n\\n---\\nSource: Gennoor Academy · Foundations · AI Foundations\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your 2-week starter plan' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 2-WEEK STARTER', h1Html: '2 use cases · 1 colleague · <em>2 weeks</em>', subtitleHtml: 'Not 90 days. Not a quarter. <strong>Two weeks.</strong> Long enough to form a habit. Short enough that you\'ll actually start.' },
    { type: 'content', eyebrow: 'The principle · 2 not 5', icon: '1', headlineHtml: 'Pick two · <em>use them every time the task applies</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 1 pair partner · 2 weeks', ['The mistake most professionals make: <strong>trying to use AI for everything at once and using it for nothing consistently.</strong>', 'Pick 2. Use them every day they apply. Build the muscle. Then expand.']) }] },
    { type: 'content', eyebrow: 'Pick your two · from chapter 3', icon: '2', headlineHtml: 'Drafting · summarising · translating · classifying · <em>code</em>',
      blocks: [{ atStep: 1, html: card('PICK 2 USE CASES', 'The ones that map to tasks you do ≥ 3 times a week', ['The 5 categories from chapter 3: drafting · summarising · translating · classifying · code generation.', '<strong>Use AI for those 2 tasks every time they come up, for 14 days straight. No skipping.</strong>'], 'At the end of 2 weeks, you\'ll know whether they belong in your durable workflow.') }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of convenience</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No personal data to free tools', '', 'Use the enterprise version your company licenses. If you don\'t have one — <strong>ask IT.</strong>', 'red')}
${cell('TRIP-WIRE 2', 'Verify every specific fact', '', 'Names · dates · statistics · citations. <strong>Against the primary source. Before it ships.</strong>', 'red')}
${cell('TRIP-WIRE 3', 'No AI signing anything binding', '', 'Customer commitments · legal · policy decisions. <strong>A human signs.</strong>', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Track what works · adjust monthly.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · your starter plan', icon: '✓', headlineHtml: 'Pick · download · <em>take to manager / share with colleague</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases</h5><div class="preset" data-group="usecases">
<button data-val="Drafting (emails, reports, summaries — first drafts)">Drafting</button>
<button data-val="Summarising (long documents, transcripts, papers)">Summarising</button>
<button data-val="Translating (between languages, registers, audiences)">Translating</button>
<button data-val="Classifying + extracting (tag emails, pull data points)">Classifying</button>
<button data-val="Code generation (Copilot · Cursor · Claude Code)">Code</button>
<button data-val="Rewriting drafts for different audiences">Rewriting for audience</button>
</div></div>
<div class="group"><h5>Pair partner (name a colleague)</h5><div class="preset" data-group="colleague">
<button data-val="Direct teammate · most likely to adopt with me">Direct teammate</button>
<button data-val="Cross-functional curious colleague">Cross-functional colleague</button>
<button data-val="Friend in another team / company">Friend / external</button>
</div></div>
<div class="group"><h5>Start date</h5><div class="preset" data-group="start">
<button data-val="This Monday">This Monday</button>
<button data-val="Next Monday">Next Monday</button>
<button data-val="First Monday of next month">First Monday of next month</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my starter plan (.md)</button>
</div>
<div class="preview" id="preview"># AI Foundations · 2-Week Starter Plan

Pick 2 use cases, a colleague, and start date on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Calibrated literacy · <em>not hype, not fear</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Calibrated literacy not hype or fear · LLMs are pattern-predictors not fact-retrievers · AI fits routine knowledge work not judgement calls · 3 real cases (Mata · Air Canada · Bloomberg) · 3 questions for vendor claims · 5 prompt patterns · 1 Monday habit · 2-week starter plan · verify before you ship.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Name your colleague.</div><div class="row"><span class="arr">→</span>Pick the start date. Begin.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 50.0, slide: 3 }, { at: 60.0, slide: 3, step: 1 },
    { at: 100.0, slide: 4 }, { at: 110.0, slide: 4, step: 1 },
    { at: 155.0, slide: 5 }, { at: 165.0, slide: 5, step: 1 },
    { at: 195.0, slide: 6 }, { at: 205.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 11 chapters 1-8 built.');
