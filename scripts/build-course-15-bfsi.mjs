// Build Course 15 chapter HTMLs — AI in Financial Services (Emma · Phase 2 rewrite)
import { emit } from './build-chapter-html.mjs';

const courseTagline = 'Industry · AI in Financial Services';
const OUT = 'tmp/academy-build/ai-in-financial-services/chapters';

// Helper functions for slide HTML



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
  chapter: { number: '01 / 06', id: 'chapter-01', title: 'The BFSI AI landscape' },
  audioSrc: '../audio/chapter-01/chapter-01.mp3',
  outPath: `${OUT}/chapter-01-bfsi-landscape.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 1 · DEEPEST DEPLOYMENT · MOST ACTIVE REGULATORS', h1Html: 'JPM · GS · Bloomberg · Mastercard · <em>Lemonade · Citadel</em>', subtitleHtml: 'McKinsey 2025: banks report 20–40% productivity gains on document + analyst work. <strong>Every major BFSI sub-sector has named AI deployments at scale by 2026.</strong>' },
    { type: 'content', eyebrow: 'Banking deployment · McKinsey + named firms', icon: '1', headlineHtml: 'Mainstream enterprise · <em>not pilots</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('McKINSEY BANKING 2025', 'Productivity gains', '20–40%', 'On documents + analyst work. 15–25% on operations.')}
${cell('JPMORGAN CHASE', 'LLM-Suite access', '140K employees', 'IndexGPT · COIN · Themis · internal LLM platform.')}
${cell('BLOOMBERG', 'BloombergGPT', '50B params', 'Finance-domain LLM released Mar 2023. Integrated in Bloomberg Terminal.')}
</div>` }] },
    { type: 'content', eyebrow: 'Fintech + insurance + capital markets', icon: '2', headlineHtml: 'Every sub-sector · <em>named at-scale deployments</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('FINTECH', 'Zest AI · Upstart', '', 'AI underwriting + credit scoring at fintech scale.')}
${cell('FRAUD', 'Mastercard Decision Intelligence', '', 'Gen AI fraud detection flagging billions annually.')}
${cell('INSURANCE', 'Tractable · Lemonade · Tokio Marine', '', 'Computer vision claims · gen AI underwriting · APAC AI integration.')}
${cell('CAPITAL MARKETS', 'Citadel · Bridgewater · Renaissance', '', 'Quant tradition + new gen AI layer through 2024-25.')}
</div>` }] },
    { type: 'content', eyebrow: 'The regulators · most active in BFSI', icon: '3', headlineHtml: 'EU · US · UK · India · <em>4 quadrants</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('EU', 'AI Act 2024/1689', '', 'Annex III: credit + insurance pricing high-risk. Art. 6-29 obligations. Art. 99 fines.', 'red')}
${cell('US', 'SR 11-7 + CFPB + DOJ', '', 'Fed Model Risk Management. CFPB/DOJ disparate impact. NIST AI RMF de facto.', 'amber')}
${cell('UK', 'FCA + PRA', '', 'Consumer Duty Jul 2023. Sector-specific guidance vs horizontal.', 'amber')}
${cell('INDIA', 'RBI + DPDPA', '', 'Master direction on AI in financial services + data fiduciary obligations.', 'amber')}
</div>` }] },
    { type: 'content', eyebrow: 'The failure modes · more consequential than elsewhere', icon: '!', iconRed: true, headlineHtml: 'Air Canada + Mata · <em>cross-domain BFSI precedent</em>',
      blocks: [
        { atStep: 1, html: cardRed('CROSS-DOMAIN PRECEDENTS', 'Air Canada Moffatt + Mata v. Avianca = the failure-mode signal', ['<strong>Air Canada (BC CRT Feb 2024):</strong> chatbot commitments are the institution\'s statements. In BFSI = mis-sell claims, regulatory enforcement, customer remediation.', '<strong>Mata v. Avianca (S.D.N.Y. Jun 2023):</strong> fabricated content in regulated communications. In BFSI = FCA enforcement, SEC inquiry, RBI action.']) },
        { atStep: 2, html: card('THE THESIS', 'Deepest deployment · most active regulators · most consequential failure modes', ['Regulator-aware. Audit-defensible. Customer-protective. <strong>Through-line of the course.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'What\'s next', icon: '→', headlineHtml: '8 chapters · <em>1 through-line</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 1', 'Regulator-aware · audit-defensible · customer-protective.', '<strong>Next:</strong> credit + underwriting AI · EU AI Act Annex III · CFPB/DOJ disparate impact · SR 11-7 Model Risk Management.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 210.0, slide: 5 }, { at: 220.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 285.0, slide: 6 }, { at: 295.0, slide: 6, step: 1 }
  ]
});

// Ch2 — Credit + underwriting
emit({
  courseTagline,
  chapter: { number: '02 / 06', id: 'chapter-02', title: 'Credit and underwriting AI' },
  audioSrc: '../audio/chapter-02/chapter-02.mp3',
  outPath: `${OUT}/chapter-02-credit-underwriting.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 2 · MOST EXPLICIT REGULATION', h1Html: 'EU Annex III · CFPB + DOJ · <em>SR 11-7</em>', subtitleHtml: 'Where AI is broadest in BFSI. <strong>And where regulators are most explicit.</strong>' },
    { type: 'content', eyebrow: 'What\'s deployed · Zest, Upstart, big-3 banks', icon: '1', headlineHtml: 'Decision speed · <em>approval expansion · loss prediction</em>',
      blocks: [{ atStep: 1, html: card('WHAT\'S DEPLOYED IN CREDIT + UNDERWRITING 2026', 'Zest AI · Upstart · JPM/Wells/BoA internal AI scoring', ['<strong>Decision speed:</strong> approval in minutes vs days for standard products.', '<strong>Approval expansion:</strong> AI catches signals on thin-file borrowers.', '<strong>Loss prediction:</strong> AI often outperforms bureau-only scoring at the margin.']) }] },
    { type: 'content', eyebrow: 'EU AI Act Annex III · high-risk', icon: '2', headlineHtml: 'Art. 6-29 · Art. 50 · Art. 27 FRIA · <em>Art. 99 fines</em>',
      blocks: [{ atStep: 1, html: card('EU AI ACT · ANNEX III · HIGH-RISK FOR CREDIT', 'Credit scoring of natural persons classified high-risk · effective Aug 2 2026', ['<strong>Art. 6-29 obligations:</strong> risk management, data governance, technical docs, human oversight, accuracy + robustness, cybersecurity.', '<strong>Art. 50:</strong> individuals subject to AI credit decisions must be informed.', '<strong>Art. 27:</strong> FRIA required for certain deployers.', '<strong>Art. 99 fines:</strong> up to €15M or 3% global turnover.']) }] },
    { type: 'content', eyebrow: 'CFPB + DOJ 2024 joint statement', icon: '3', headlineHtml: 'Disparate impact applies to AI lending · <em>even facially-neutral models</em>',
      blocks: [{ atStep: 1, html: cardRed('CFPB + DOJ JOINT STATEMENT · 2024', 'Disparate-impact standards apply to AI-driven lending', ['Even if the model is facially neutral, if it produces disparate outcomes across protected classes, it can be enforced as discrimination.', '<strong>Bias testing mandatory in practice.</strong> Statistical parity. Calibration across groups.', '<strong>Adverse-action notices that meaningfully explain the reason to the consumer.</strong> AI explainability isn\'t a nice-to-have — it\'s a regulatory requirement.']) }] },
    { type: 'content', eyebrow: 'SR 11-7 · Federal Reserve Model Risk Management', icon: '4', headlineHtml: 'Independent validation · ongoing monitoring · <em>documentation</em>',
      blocks: [
        { atStep: 1, html: card('SR 11-7 · STILL FOUNDATIONAL FOR US BANKS', 'Federal Reserve Model Risk Management guidance · 2011 · still active', ['Examiner questions: <strong>"Who validated independent of developer?"</strong> "What\'s monitoring frequency?" "What triggers model retirement?"', 'If your AI underwriting can\'t answer — SR 11-7 gap. Examiner findings on AI models are increasing through 2025-26.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one high-risk AI model in lending · answer EU + CFPB + SR 11-7 in 1 sentence each', ['<strong>Any answer missing? That\'s the gap. Fix before next examiner cycle.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 3', icon: '→', headlineHtml: 'Fraud + AML + KYC · <em>Mastercard + SAR efficiency</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 2', 'EU Annex III · CFPB disparate impact · SR 11-7 validation. <em>3 frameworks, all required.</em>', '<strong>Next:</strong> fraud detection · AML compression · SAR workflow · KYC automation · vendor landscape.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 205.0, slide: 5 }, { at: 215.0, slide: 5, step: 1 }, { at: 270.0, slide: 5, step: 2 },
    { at: 290.0, slide: 6 }, { at: 300.0, slide: 6, step: 1 }
  ]
});

// Ch3 — Fraud + AML + KYC
emit({
  courseTagline,
  chapter: { number: '03 / 06', id: 'chapter-03', title: 'Fraud, AML, and KYC' },
  audioSrc: '../audio/chapter-03/chapter-03.mp3',
  outPath: `${OUT}/chapter-03-fraud-aml-kyc.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 3 · MOST MATURE USE CASE', h1Html: 'Fraud · AML · <em>KYC</em>', subtitleHtml: 'AI in fraud detection has outperformed rules for a decade. <strong>What\'s new in 2026: gen AI augments both detection and analyst workflow.</strong>' },
    { type: 'content', eyebrow: 'Fraud detection · Mastercard Decision Intelligence', icon: '1', headlineHtml: 'Network + issuer + AI · <em>billions flagged annually</em>',
      blocks: [{ atStep: 1, html: card('MASTERCARD DECISION INTELLIGENCE', 'Real-time gen AI fraud detection · billions in fraudulent transactions flagged annually', ['<strong>Network-level signal is key.</strong> Mastercard sees global card network. Issuers see their portfolio. Combining both + AI pattern detection drives false-positive reduction.'], 'Measured: approval rate ↑ · false-positive rate ↓ · customer experience ↑ · fraud losses ↓ at network level.') }, { atStep: 1, html: card('VENDOR LANDSCAPE', 'Mastercard · Visa · Featurespace · NICE Actimize · SAS · FICO', ['Network-level vs issuer-level. <strong>Most have AI augmentation by 2025.</strong>']) }] },
    { type: 'content', eyebrow: 'AML · the compression story', icon: '2', headlineHtml: 'Traditional 95% false positives · <em>AI compresses to 70-80%</em>',
      blocks: [{ atStep: 1, html: cardGreen('AML · HIGHEST AI ROI IN COMPLIANCE', 'Traditional AML alerts: 95% false positives · AI compresses to 70-80%', ['Investigators spend their day chasing noise — traditionally. <strong>AI + network signal + document understanding drops false positives by 15-20 percentage points.</strong>'], 'Not glamorous — but 15-20pp of investigator time saved. Multiplied across a global bank\'s compliance team = enormous savings.') }] },
    { type: 'content', eyebrow: 'SAR drafting · quote-or-cut applies', icon: '3', headlineHtml: 'AI drafts · <em>investigator validates · Mata applies</em>',
      blocks: [{ atStep: 1, html: card('SAR · SUSPICIOUS ACTIVITY REPORT WORKFLOW', 'Gen AI drafts the SAR narrative from case evidence · investigator validates', ['<strong>Quote-or-cut applies.</strong> Every specific claim cited and verified before filing.', 'Mata v. Avianca cross-domain analog applies directly. <em>A fabricated detail in a SAR filing is a regulator-facing problem.</em>']) }] },
    { type: 'content', eyebrow: 'KYC + adverse media · 2026 vendor landscape', icon: '4', headlineHtml: 'Document AI · screening · <em>global adverse-media surveillance</em>',
      blocks: [
        { atStep: 1, html: card('KYC + CUSTOMER DUE DILIGENCE', 'Document AI · face matching · sanctions/PEP screening · adverse-media monitoring', ['<strong>New in 2026:</strong> adverse-media monitoring at global news scale. AI + translation + summarisation surfaces concerns about a customer faster than human researchers.'], 'Vendor landscape: ComplyAdvantage · Refinitiv World-Check (LSEG) · Dow Jones Risk Center · Trulioo for ID verification. All AI-augmented by 2025.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull AML false-positive rate from last quarter', ['Above 90% → AI-augmented case management = highest-ROI ops investment. <strong>Below 70% → focus on SAR-drafting AI with quad-eye quality controls.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 4', icon: '→', headlineHtml: 'Insurance AI · <em>Tractable · Lemonade · fairness</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 3', 'Most mature BFSI AI use case · network signal compounds value.', '<strong>Next:</strong> claims AI · underwriting AI · fairness lens · EU AI Act insurance pricing as high-risk.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 90.0, slide: 3 }, { at: 100.0, slide: 3, step: 1 },
    { at: 165.0, slide: 4 }, { at: 175.0, slide: 4, step: 1 },
    { at: 230.0, slide: 5 }, { at: 240.0, slide: 5, step: 1 }, { at: 280.0, slide: 5, step: 2 },
    { at: 300.0, slide: 6 }, { at: 310.0, slide: 6, step: 1 }
  ]
});

// Ch4 — Insurance
emit({
  courseTagline,
  chapter: { number: '04 / 06', id: 'chapter-04', title: 'Insurance AI' },
  audioSrc: '../audio/chapter-04/chapter-04.mp3',
  outPath: `${OUT}/chapter-04-insurance.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 4 · CLAIMS + UNDERWRITING + CUSTOMER', h1Html: 'Tractable · Lemonade · Tokio Marine · <em>EU high-risk</em>', subtitleHtml: 'Insurance has decades of actuarial ML. <strong>Gen AI is now changing claims, underwriting, and customer interaction.</strong>' },
    { type: 'content', eyebrow: 'Claims AI · Tractable + Snapsheet + insurer integrations', icon: '1', headlineHtml: 'Computer vision · <em>settlement in minutes</em>',
      blocks: [{ atStep: 1, html: card('CLAIMS AI · 2024-25 DEPLOYMENTS', 'Tractable · Snapsheet · USAA · Lemonade · GEICO · Allstate AI claims processing', ['Camera image + AI + actuarial data → settlement-amount proposals in minutes for standard claims.', 'Measured: time-to-settlement ↓ · customer satisfaction up on routine, neutral-to-down on complex · loss-adjustment expense ↓ · customer-side fraud detection ↑.'], 'Boundary: AI proposes. Human adjuster approves above settlement threshold. <strong>Complex claims involving disputed liability still need experienced human judgement.</strong>') }] },
    { type: 'content', eyebrow: 'Underwriting AI · Lemonade + Tokio Marine + commercial', icon: '2', headlineHtml: 'Minutes vs weeks · <em>fairness lens active</em>',
      blocks: [{ atStep: 1, html: card('INSURANCE UNDERWRITING AI', 'Lemonade (founded with gen AI) · Tokio Marine · US insurers in small commercial', ['Trade-offs: speed (minutes vs weeks) · cost ↓ · risk selection ↑.', '<strong>The fairness lens:</strong> EU AI Act Annex III — insurance pricing of natural persons classified high-risk. Same Art. 6-29 obligations as credit.', 'US state insurance commissioners (CA, CO, NY) actively examining AI-driven insurance discrimination through 2025.']) }] },
    { type: 'content', eyebrow: 'Customer interaction · Air Canada analog', icon: '!', iconRed: true, headlineHtml: 'Chatbot coverage statements · <em>insurer\'s statement</em>',
      blocks: [{ atStep: 1, html: cardRed('AIR CANADA MOFFATT CROSS-DOMAIN · APPLIES DIRECTLY', 'Anything an insurance chatbot says about coverage, exclusions, process becomes the insurer\'s statement', ['BC tribunal precedent translates one-for-one.', '<strong>Customer remediation · regulatory enforcement · lawsuits — all downstream of customer-facing AI getting policy details wrong.</strong>'], 'Fix: retrieval-grounded on actual policy documents · quote-or-cut on coverage statements · human handoff on dispute/claim.') }] },
    { type: 'content', eyebrow: 'The regulatory + discipline posture', icon: '4', headlineHtml: 'Insurance-grade AI governance · <em>statistical parity + explainability</em>',
      blocks: [
        { atStep: 1, html: card('REGULATORY POSTURE', 'EU AI Act + US state commissions + UK FCA + India IRDAI', ['EU treats insurance pricing as high-risk. US states actively examining. <strong>UK FCA Consumer Duty covers AI-driven customer harms in insurance.</strong> India IRDAI evolving.'], 'What insurance leaders need: statistical-parity testing in production · explainability for adverse decisions · audit trail for all customer-facing AI · quad-eye on settlement decisions above threshold.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pick one customer-facing AI surface · audit 1 week of conversations against actual policy docs', ['Catch coverage statements AI got wrong. <strong>That\'s the gap to close before regulator inquiry.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 5', icon: '→', headlineHtml: 'Capital markets + asset management AI · <em>BloombergGPT + Marquee</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 4', 'Claims · underwriting · customer interaction — all with quad-eye and fairness lens.', '<strong>Next:</strong> Renaissance/Two Sigma/Citadel quant tradition · Bloomberg 50B finance LLM · Goldman Marquee AI · research-summarisation use case.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 90.0, slide: 3 }, { at: 100.0, slide: 3, step: 1 },
    { at: 170.0, slide: 4 }, { at: 180.0, slide: 4, step: 1 },
    { at: 235.0, slide: 5 }, { at: 245.0, slide: 5, step: 1 }, { at: 285.0, slide: 5, step: 2 },
    { at: 305.0, slide: 6 }, { at: 315.0, slide: 6, step: 1 }
  ]
});

// Ch5 — Capital markets
emit({
  courseTagline,
  chapter: { number: '05 / 06', id: 'chapter-05', title: 'Capital markets and asset management AI' },
  audioSrc: '../audio/chapter-05/chapter-05.mp3',
  outPath: `${OUT}/chapter-05-capital-markets.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 5 · LONGEST QUANT HISTORY', h1Html: 'Renaissance · Two Sigma · Citadel · <em>BloombergGPT</em>', subtitleHtml: 'Longest AI history in BFSI: quant tradition. <strong>New layer: gen AI through research, trading, ops.</strong>' },
    { type: 'content', eyebrow: 'The quant tradition · 30+ years', icon: '1', headlineHtml: 'Bar is high · <em>gen AI is additive, not replacement</em>',
      blocks: [{ atStep: 1, html: card('THE QUANT TRADITION', 'Renaissance Medallion · Two Sigma · D.E. Shaw · Citadel Securities · AQR · Bridgewater', ['Decades of AI-driven systematic trading.', '<strong>For new entrants — the bar is high.</strong> You\'re competing against teams that have refined ML for 30 years.'], 'The new layer — generative AI — is additive to that tradition. Not a replacement.') }] },
    { type: 'content', eyebrow: 'Generative AI layer · BloombergGPT + Marquee + IndexGPT', icon: '2', headlineHtml: '50B finance LLM · <em>integrated in Bloomberg Terminal</em>',
      blocks: [{ atStep: 1, html: card('GENERATIVE AI IN CAPITAL MARKETS', 'Frontier-model tech adapted to finance-specific data + workflows', ['<strong>BloombergGPT — 50B parameter finance-domain LLM</strong> released March 2023. Integrated in Bloomberg Terminal for Q&A, summarisation, analyst workflow.', '<strong>Goldman Marquee AI · JPM IndexGPT · MS Atlas (advisor research).</strong>'], 'The advantage is proprietary data + proprietary workflow — not the model itself.') }] },
    { type: 'content', eyebrow: 'Most-deployed use case · research summarisation', icon: '3', headlineHtml: 'Analyst hours per report · <em>down 20–40%</em>',
      blocks: [{ atStep: 1, html: card('RESEARCH + DOCUMENT SUMMARISATION', 'Equity research notes · macro reports · earnings transcripts · regulatory filings', ['AI + retrieval against proprietary research corpus = faster analyst output.', '<strong>Analyst hours per report ↓ 20-40% in production deployments.</strong> Output volume ↑ significantly without proportional headcount.'], 'Mata v. Avianca quote-or-cut rule applies. <em>Investment research is regulated content. Citations must be verifiable. Quote-or-cut.</em>') }] },
    { type: 'content', eyebrow: 'Trading + operations · same discipline', icon: '4', headlineHtml: 'NL interfaces to risk + position data · <em>verify or fail</em>',
      blocks: [
        { atStep: 1, html: card('TRADING + OPERATIONS', 'Market-making algos ML-augmented for years · new: NL interfaces to risk + position data', ['<strong>The risk:</strong> AI says one position size, actual position is different. Mismatched-data failure mode.', 'Quote-or-cut on AI-driven risk assertions. Same discipline as the close cycle.'], 'Operations: reconciliation · trade-break investigation · corporate actions · confirmations + settlements. All AI-augmentable. Standard control framework applies — SR 11-7 + EU AI Act + quad-eye.') },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull one AI-augmented research piece that went to clients last quarter · verify 5 specific claims', ['Valuations · multiples · projections. <strong>If you can\'t verify any one in 5 minutes — research-AI quality program isn\'t in place yet.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 6', icon: '→', headlineHtml: 'Customer-facing AI in BFSI · <em>chatbots · advisory · disclosure</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 5', 'Quant tradition + gen AI layer · research is regulated content · quote-or-cut everywhere.', '<strong>Next:</strong> banking chatbots · wealth advisory copilots · EU Art. 50 · UK FCA Consumer Duty · cross-domain Air Canada precedent.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 175.0, slide: 5 }, { at: 185.0, slide: 5, step: 1 }, { at: 230.0, slide: 5, step: 2 },
    { at: 250.0, slide: 6 }, { at: 260.0, slide: 6, step: 1 }
  ]
});

// Ch6 — Customer-facing
emit({
  courseTagline,
  chapter: { number: '06 / 06', id: 'chapter-06', title: 'Customer-facing AI in BFSI' },
  audioSrc: '../audio/chapter-06/chapter-06.mp3',
  outPath: `${OUT}/chapter-06-customer-facing.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 6 · HIGHEST REPUTATIONAL RISK', h1Html: 'Erica · In-App · Fargo · <em>wealth copilots</em>', subtitleHtml: 'What the AI says about products, fees, eligibility, terms — becomes the institution\'s statement. <strong>Air Canada cross-domain analog applies directly.</strong>' },
    { type: 'content', eyebrow: 'What\'s deployed · banks + insurers + wealth', icon: '1', headlineHtml: 'BofA Erica · JPM In-App · Wells Fargo Fargo · <em>40–70% containment</em>',
      blocks: [{ atStep: 1, html: card('WHAT\'S DEPLOYED IN BFSI CUSTOMER-FACING AI 2026', 'Banking chatbots · insurance chatbots · wealth-advisory copilots', ['BofA Erica · JPM In-App · Wells Fargo Fargo.', '<strong>Containment 40-70% on routine inquiries.</strong> Cost per interaction ↓ materially vs call-centre. CSAT neutral-to-positive on routine, mixed on complex.']) }] },
    { type: 'content', eyebrow: 'The Air Canada precedent · applies directly', icon: '!', iconRed: true, headlineHtml: 'Banking · insurance · wealth · <em>all 3 covered</em>',
      blocks: [{ atStep: 1, html: cardRed('AIR CANADA MOFFATT · BC CRT FEB 2024 · CROSS-DOMAIN', '"Air Canada is responsible for all information on its website, including from a chatbot"', ['<strong>Banking:</strong> chatbot says about loan eligibility, rates, fees, terms — bank\'s statement.', '<strong>Insurance:</strong> chatbot says about coverage, exclusions, claims — insurer\'s statement.', '<strong>Wealth:</strong> AI tells client about performance, fees, suitability — firm\'s statement (SEC, FCA, MAS rules apply).']) }] },
    { type: 'content', eyebrow: 'EU + UK + India regulatory frame', icon: '3', headlineHtml: 'Art. 50 disclosure · FCA Consumer Duty · <em>RBI master direction</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-3" data-step="1">
${cell('EU AI ACT ART. 50', 'Transparency for AI interacting with persons', '', 'Effective Aug 2 2026. <strong>Customer must be told they\'re interacting with AI.</strong>')}
${cell('UK FCA CONSUMER DUTY', 'Jul 2023 · 4 outcomes', '', 'Fair value · products/services · consumer understanding · consumer support. <strong>All apply to AI-augmented customer interactions.</strong>')}
${cell('INDIA RBI + DPDPA', 'Master direction + data fiduciary', '', 'Explainability + disclosure obligations + breach notification.')}
</div>` }] },
    { type: 'content', eyebrow: 'The discipline · 3 settings', icon: '4', headlineHtml: 'Retrieval grounding · citations · <em>escalation triggers</em>',
      blocks: [
        { atStep: 1, html: card('3 SETTINGS THAT MAKE THIS WORK', 'Retrieval grounding · citations · escalation triggers', ['<strong>1 — retrieval grounding</strong> on actual policy + product documents · not LLM training data. Real-time from source-of-truth system.', '<strong>2 — citations + quote-or-cut.</strong> Every specific claim links to policy reference, rate sheet, fees schedule. No source → refuse to answer or escalate.', '<strong>3 — escalation triggers.</strong> Binding commitments, complaints, regulated transactions → hand off to human.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Pull 1 week of customer-facing chatbot conversations · sample 20 · verify every factual claim', ['<strong>One wrong on a regulated topic = remediation case + coaching-the-AI case.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Next up · Chapter 7', icon: '→', headlineHtml: 'Regulatory posture · <em>4-quadrant compliance</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 6', 'Air Canada applies directly · 3 settings make customer-facing AI safe · escalate on binding/regulated.', '<strong>Next:</strong> 4-quadrant compliance — EU + US (SR 11-7 + CFPB + NIST) + UK FCA-PRA + India RBI + DPDPA. The compliance document.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 60.0, slide: 3 }, { at: 70.0, slide: 3, step: 1 },
    { at: 135.0, slide: 4 }, { at: 145.0, slide: 4, step: 1 },
    { at: 195.0, slide: 5 }, { at: 205.0, slide: 5, step: 1 }, { at: 250.0, slide: 5, step: 2 },
    { at: 270.0, slide: 6 }, { at: 280.0, slide: 6, step: 1 }
  ]
});

// Ch7 — Regulatory posture
emit({
  courseTagline,
  chapter: { number: '07 / 06', id: 'chapter-07', title: 'Regulatory posture' },
  audioSrc: '../audio/chapter-07/chapter-07.mp3',
  outPath: `${OUT}/chapter-07-regulatory-posture.html`,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 7 · 4-QUADRANT COMPLIANCE', h1Html: 'EU · US · UK · <em>India + ASEAN</em>', subtitleHtml: 'Most BFSI firms operate across borders. <strong>Even mid-sized banks have EU customers, US deposits, UK clients, Indian ops. This chapter is the compliance document structure.</strong>' },
    { type: 'content', eyebrow: 'Quadrant 1 · EU', icon: '1', headlineHtml: 'AI Act + GDPR Art. 22 · <em>EBA + EIOPA + ESMA</em>',
      blocks: [{ atStep: 1, html: card('EU · AI ACT + SUPERVISORS', 'EU AI Act 2024/1689: Annex III high-risk · Art. 6-29 obligations · Art. 27 FRIA · Art. 50 transparency · Art. 99 fines', ['EBA · EIOPA · ESMA — European supervisory authorities issuing AI-specific guidance through 2025-26.', '<strong>GDPR Art. 22 — automated decision-making provision in force since 2018. Still applies.</strong>']) }] },
    { type: 'content', eyebrow: 'Quadrant 2 · US · the patchwork', icon: '2', headlineHtml: 'SR 11-7 · CFPB + DOJ · SEC · <em>NIST de facto</em>',
      blocks: [{ atStep: 1, html: card('US · FEDERAL + STATE PATCHWORK', 'Federal: SR 11-7 (Fed) · OCC + FDIC similar · CFPB + DOJ disparate impact · SEC AI disclosure focus', ['<strong>State-level:</strong> NYC LL144 · California Insurance Commissioner · Colorado SB24-205. All have BFSI-relevant provisions through 2026.', '<strong>De facto US standard:</strong> NIST AI Risk Management Framework 1.0 — Govern, Map, Measure, Manage.']) }] },
    { type: 'content', eyebrow: 'Quadrant 3 · UK · sector-specific', icon: '3', headlineHtml: 'FCA + PRA · <em>Consumer Duty + supervisory expectations</em>',
      blocks: [{ atStep: 1, html: card('UK · FCA + PRA · SECTOR-SPECIFIC', 'FCA Consumer Duty (Jul 2023) covers AI-driven customer harms · PRA AI discussion papers · joint FCA-PRA-BoE supervisory expectations through 2025', ['Unlike EU which is horizontal, UK is regulator-by-regulator.', '<strong>Pragmatic for BFSI firms with UK operations:</strong> map AI use to Consumer Duty\'s 4 outcomes (fair value, products/services, understanding, support).']) }] },
    { type: 'content', eyebrow: 'Quadrant 4 · India + ASEAN + the compliance doc', icon: '4', headlineHtml: 'RBI + DPDPA · MAS FEAT · <em>5-section document</em>',
      blocks: [
        { atStep: 1, html: card('INDIA + ASEAN', 'RBI master direction + DPDPA + IRDAI · Singapore MAS FEAT · HK HKMA · Australia APRA', ['<strong>Multinational pragmatic bar:</strong> EU AI Act + NIST + FCA Consumer Duty + DPDPA quartet covers majority of jurisdictional exposure.']) },
        { atStep: 1, html: card('THE COMPLIANCE DOCUMENT · 5 SECTIONS', 'Per AI system: quadrants apply · high-risk classification · NIST controls · disclosure · audit trail', ['Annual to audit committee. Quarterly updates for material changes.']) },
        { atStep: 2, html: card('MONDAY MOVE', 'Draft v1 of the 5-section compliance document for your top 3 AI systems', ['<strong>If you can\'t fill section 4 (disclosure) — that\'s the gap.</strong>']) }
      ] },
    { type: 'content', eyebrow: 'Last chapter', icon: '→', headlineHtml: 'Your BFSI AI roadmap · <em>2 use cases · 2 quarters</em>',
      blocks: [{ atStep: 1, html: closeCard('END OF CHAPTER 7', '4 quadrants · pragmatic build-to-bar = EU + NIST + FCA + DPDPA · 5-section document.', '<strong>Last chapter:</strong> 2-quarter rollout playbook · 4 trust trip-wires · interactive roadmap builder.') }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 75.0, slide: 3 }, { at: 85.0, slide: 3, step: 1 },
    { at: 145.0, slide: 4 }, { at: 155.0, slide: 4, step: 1 },
    { at: 200.0, slide: 5 }, { at: 210.0, slide: 5, step: 1 }, { at: 260.0, slide: 5, step: 2 },
    { at: 280.0, slide: 6 }, { at: 290.0, slide: 6, step: 1 }
  ]
});

// Ch8 — Roadmap
const ch8BuilderInit = `
var builderInit=false;var state={usecases:[],sector:'',regulatory:''};
function initBuilderOnce(){if(builderInit)return;builderInit=true;document.querySelectorAll('.preset').forEach(function(grp){var key=grp.getAttribute('data-group');grp.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){var val=btn.getAttribute('data-val');if(key==='usecases'){var arr=state.usecases;var idx=arr.indexOf(val);if(idx>=0){arr.splice(idx,1);btn.classList.remove('picked')}else if(arr.length<2){arr.push(val);btn.classList.add('picked')}}else{grp.querySelectorAll('button').forEach(function(b){b.classList.remove('picked')});btn.classList.add('picked');state[key]=val;}render()})})});document.getElementById('dlBtn').addEventListener('click',function(){var blob=new Blob([buildMd()],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='bfsi-ai-roadmap.md';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url)},100)});render()}
function buildMd(){var uc=state.usecases.length?state.usecases.map(function(s,i){return (i+1)+'. '+s}).join('\\n'):'1. _(pick 2 use cases — Q1 + Q2)_';var s=state.sector||'_(pick sub-sector)_';var r=state.regulatory||'_(pick regulatory baseline)_';return '# BFSI AI · 2-Quarter Roadmap\\n\\n**CRO / GC / Compliance:** ____________________\\n**Sub-sector:** '+s+'\\n**Start date:** ____________________\\n\\n## 2 use cases\\n'+uc+'\\n\\n## Regulatory baseline\\n> '+r+'\\n\\n## Quarter 1 — lower-risk use case\\n- Strong guardrails · quad-eye discipline · audit trail from day 1\\n\\n## Quarter 2 — one high-risk use case with full controls\\n- EU AI Act Annex III + SR 11-7 + NIST AI RMF + disparate-impact testing\\n\\n## Trust trip-wires (do not cross)\\n- No high-risk model without SR 11-7 + EU AI Act + NIST controls\\n- No customer-facing AI without disclosure (Art. 50 + FCA Consumer Duty)\\n- No AI-generated specific facts in regulated content unverified (Mata)\\n- No "set and forget" · quarterly model monitoring + annual independent validation\\n\\n---\\nSource: Gennoor Academy · Industry · AI in Financial Services\\n'}
function render(){var pv=document.getElementById('preview');if(pv)pv.textContent=buildMd()}
`;

emit({
  courseTagline,
  chapter: { number: '08 / 06', id: 'chapter-08', title: 'Making it stick: your BFSI AI roadmap' },
  audioSrc: '../audio/chapter-08/chapter-08.mp3',
  outPath: `${OUT}/chapter-08-making-it-stick.html`,
  builderSlide: 5,
  builderStep: 1,
  builderInitFn: ch8BuilderInit,
  slides: [
    { type: 'title', eyebrow: 'CHAPTER 8 · 2 USE CASES · 2 QUARTERS', h1Html: 'Pick 2 · <em>regulator-aware throughout</em>', subtitleHtml: '7 chapters · this chapter sequences them.' },
    { type: 'content', eyebrow: 'The principle · 2 not 5', icon: '1', headlineHtml: 'Pick the right 2 · <em>for your sub-sector</em>',
      blocks: [{ atStep: 1, html: card('THE RULE', '2 use cases · 2 quarters · 1 regulatory posture', ['Same discipline as every function in this academy. <strong>Pick the right 2 for your BFSI sub-sector.</strong>', 'Don\'t deploy across credit, fraud, insurance, markets, customer-facing all at once.']) }] },
    { type: 'content', eyebrow: 'The sequence · default playbook', icon: '2', headlineHtml: 'Q1 lower-risk · <em>Q2 one high-risk with full controls</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-2" data-step="1">
${cell('QUARTER 1', 'Lower-risk use case', '', 'Banks: fraud/AML augmentation · or customer-facing with strong guardrails. Insurance: claims AI with quad-eye. Asset mgmt: research summarisation with quote-or-cut. <strong>Value without high-risk regulatory exposure.</strong>', 'green')}
${cell('QUARTER 2', 'One high-risk use case with full controls', '', 'Banks: one underwriting/pricing model with EU AI Act + SR 11-7 + CFPB. Insurance: one pricing/underwriting with same controls. <strong>Where you start touching Art. 6-29 obligations.</strong>')}
</div>` }, { atStep: 1, html: card('DEFER', 'Multi-regulator AI · customer remediation exposure', ['Year 2 — if framework holds.']) }] },
    { type: 'content', eyebrow: 'Trust trip-wires · 4 hard nos', icon: '!', iconRed: true, headlineHtml: 'Don\'t cross these · <em>regardless of pressure</em>',
      blocks: [{ atStep: 1, html: `<div class="grid cols-4" data-step="1">
${cell('TRIP-WIRE 1', 'No high-risk model without SR 11-7 + EU + NIST', '', 'Independent validation · bias testing · audit trail. <strong>Non-negotiable.</strong>', 'red')}
${cell('TRIP-WIRE 2', 'No customer-facing AI without disclosure', '', 'EU Art. 50 · UK FCA Consumer Duty · Air Canada precedent.', 'red')}
${cell('TRIP-WIRE 3', 'No AI fabrication in regulated content', '', 'SAR filings · research notes · customer communications. Quote-or-cut. <strong>Mata principle.</strong>', 'red')}
${cell('TRIP-WIRE 4', 'No "set and forget"', '', 'Quarterly model monitoring · annual independent validation · examiner-ready documentation.', 'red')}
</div>` }] },
    { type: 'content', eyebrow: 'Interactive · build your roadmap', icon: '✓', headlineHtml: 'Pick · download · <em>take to CRO / audit committee chair</em>',
      blocks: [{ atStep: 1, html: `<div class="builder" data-step="1">
<div class="fields">
<div class="group"><h5>Pick 2 use cases (Q1 + Q2)</h5><div class="preset" data-group="usecases">
<button data-val="Real-time fraud detection (Mastercard Decision Intelligence pattern)">Fraud detection</button>
<button data-val="AML alert compression with SAR-drafting AI (quad-eye)">AML + SAR drafting</button>
<button data-val="Credit underwriting (EU Annex III + CFPB + SR 11-7 controls)">Credit underwriting · high-risk</button>
<button data-val="Insurance claims AI (Tractable pattern · quad-eye on settlements)">Insurance claims AI</button>
<button data-val="Insurance pricing (EU Annex III + state commission controls)">Insurance pricing · high-risk</button>
<button data-val="Investment research summarisation (quote-or-cut)">Research summarisation</button>
<button data-val="Banking customer-facing chatbot (retrieval-grounded · disclosure)">Banking chatbot</button>
</div></div>
<div class="group"><h5>Sub-sector</h5><div class="preset" data-group="sector">
<button data-val="Retail / commercial banking">Banking</button>
<button data-val="Insurance (P&amp;C, life, health)">Insurance</button>
<button data-val="Asset management / wealth advisory">Asset / wealth</button>
<button data-val="Capital markets / trading">Capital markets</button>
<button data-val="Fintech">Fintech</button>
</div></div>
<div class="group"><h5>Regulatory baseline</h5><div class="preset" data-group="regulatory">
<button data-val="EU AI Act + NIST AI RMF + FCA Consumer Duty + DPDPA (multinational)">Multinational quartet</button>
<button data-val="US-only: SR 11-7 + CFPB/DOJ + NIST + state patchwork">US-only</button>
<button data-val="EU + US: EU AI Act + SR 11-7 + NIST">EU + US</button>
<button data-val="India-led: RBI + DPDPA + cross-border vendor terms">India-led</button>
</div></div>
<button class="dl-btn" id="dlBtn">⬇ Download my BFSI AI roadmap (.md)</button>
</div>
<div class="preview" id="preview"># BFSI AI · 2-Quarter Roadmap

Pick 2 use cases, sub-sector, and regulatory baseline on the left.</div>
</div>` }] },
    { type: 'content', eyebrow: 'The course · in one breath', icon: '→', headlineHtml: 'Regulator-aware · audit-defensible · <em>customer-protective</em>',
      blocks: [{ atStep: 1, html: `<div class="final-close" data-step="1"><div class="eyebrow">END OF COURSE · 8 CHAPTERS · WHAT YOU DO THIS WEEK</div><h2>Deepest deployment · most active regulators · most consequential failure modes · build to EU AI Act + NIST + FCA + RBI quartet · quad-eye on every regulated AI output · 2 use cases not 7 · audit trail survives examiner review.</h2><p>That's eight chapters in one breath. <em>That's the course.</em></p>
<div class="close-list"><div class="row"><span class="arr">→</span>Open the builder. Pick your 2.</div><div class="row"><span class="arr">→</span>Get one CRO or audit-committee-chair conversation on the calendar before next Friday.</div></div>
<div class="close-final">SEE YOU IN THE NEXT ONE.</div></div>` }] }
  ],
  cues: [
    { at: 0.0, slide: 1 },
    { at: 15.0, slide: 2 }, { at: 25.0, slide: 2, step: 1 },
    { at: 45.0, slide: 3 }, { at: 55.0, slide: 3, step: 1 },
    { at: 120.0, slide: 4 }, { at: 130.0, slide: 4, step: 1 },
    { at: 180.0, slide: 5 }, { at: 190.0, slide: 5, step: 1 },
    { at: 220.0, slide: 6 }, { at: 230.0, slide: 6, step: 1 }
  ]
});

console.log('\n✓ Course 15 chapters 1-8 built.');
