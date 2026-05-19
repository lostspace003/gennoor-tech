import type { CourseContent } from './types'

export const aiFoundationsForEveryone: CourseContent = {
  courseSlug: 'ai-foundations-for-everyone',

  chapters: {
    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 1 — What is AI? (Without the hype)
    // ──────────────────────────────────────────────────────────────────
    1: {
      intro:
        'Before you can use AI well, you need a working definition that survives contact with reality. This chapter cuts through three years of marketing noise and gives you a mental model you can actually use at work — including three things AI is decisively *not*.',
      blocks: [
        { type: 'h2', text: 'AI, machine learning, and generative AI — what each one means' },
        {
          type: 'p',
          text: 'These three terms get used interchangeably by vendors. They\'re not the same. Getting them straight is the first step to spotting which problems each can solve.',
        },
        {
          type: 'list',
          items: [
            '<strong>AI (Artificial Intelligence)</strong> is the umbrella term for any system that performs tasks normally requiring human intelligence — recognizing faces, translating languages, navigating roads, drafting emails. It\'s a goal, not a technique.',
            '<strong>Machine Learning (ML)</strong> is a specific technique for achieving AI: instead of programming the rules, you show a system many examples and let it figure out the patterns. Spam filters, fraud detection, recommendation engines all use ML.',
            '<strong>Generative AI (GenAI)</strong> is a recent subset of ML that learned from so much text and so many images that it can produce new text and images on demand. ChatGPT, Microsoft Copilot, Claude, Gemini — these are generative AI.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The shorthand to remember',
          text: 'AI is the destination. ML is the road. Generative AI is the truck that arrived at the destination in late 2022 and changed which problems we now think are worth solving.',
        },

        { type: 'h2', text: 'Three things AI is decisively NOT' },
        {
          type: 'p',
          text: 'Half the bad decisions about AI come from misunderstanding what it isn\'t. Three myths to retire:',
        },
        {
          type: 'h3',
          text: '1. AI is not sentient',
        },
        {
          type: 'p',
          text: 'It does not understand, in the way you and I understand. It predicts. ChatGPT is not "thinking about your question" — it\'s computing the statistically most likely next word given everything before. That doesn\'t make it less useful, but it should change how you trust its output.',
        },
        {
          type: 'h3',
          text: '2. AI is not infallible',
        },
        {
          type: 'p',
          text: 'It produces fluent confident-sounding text that is sometimes completely wrong. The fluency comes from how it was trained; the wrongness comes from the same place. Always verify factual claims it makes, especially numbers, names, dates, and citations.',
        },
        {
          type: 'h3',
          text: '3. AI is not magic',
        },
        {
          type: 'p',
          text: 'It can only work with the information it has — what it was trained on (a snapshot of the past) and what you give it in your prompt (the present). It doesn\'t know your company\'s policies unless you tell it. It doesn\'t know what happened last week unless that information is supplied.',
        },

        { type: 'h2', text: 'Why now — what actually changed in 2022' },
        {
          type: 'p',
          text: 'AI research has been going for 70 years. Two things made the recent wave different: the scale of training data (the entire public internet) and the architectural breakthrough called the Transformer (introduced in 2017 by researchers at Google). Together they produced language models that were so much better than what came before that, when ChatGPT launched in November 2022, the conversation about what AI could do for work changed permanently — for non-technical professionals, not just specialists.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Why this matters for your week',
          text: 'You don\'t need to track research papers. But you should know that GenAI is genuinely different from the AI that came before — different enough that the playbooks of 2019 don\'t apply. What changed is who can benefit. Five years ago, you needed a data science team. Now, you need a curious manager with 30 minutes.',
        },

        { type: 'h2', text: 'What this course doesn\'t cover' },
        {
          type: 'p',
          text: 'This is a foundations course. It deliberately does not teach you to code, fine-tune a model, or architect a multi-agent system. It teaches you the mental model and the practical workflows that let you apply AI to your work this week. If you need the technical depth, the Builder track is where you go next.',
        },
      ],
      keyTakeaways: [
        'AI is the goal; ML is the technique; Generative AI is the recent wave that brought AI to non-technical work.',
        'AI is not sentient, not infallible, and not magic — it predicts, fluently, from training data and your prompt.',
        'The 2022 inflection point was a combination of scale (internet-sized training data) and architecture (Transformers).',
        'You don\'t need to be technical to benefit — you need a working mental model and a willingness to try things.',
      ],
    },

    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 2 — How LLMs actually work
    // ──────────────────────────────────────────────────────────────────
    2: {
      intro:
        'If you remember one mental model from this whole course, make it this one. Understanding next-token prediction explains both why LLMs are so useful and why they hallucinate. It\'s the single concept that separates confident AI users from confused ones.',
      blocks: [
        { type: 'h2', text: 'Next-token prediction — the only model you need' },
        {
          type: 'p',
          text: 'A Large Language Model (LLM) is, mechanically, doing one thing over and over: given everything written so far, predict the most likely next word. Then add that word, and predict the next one. Then the next. Eventually it produces a sentence, a paragraph, an essay. That\'s it. That\'s the trick.',
        },
        {
          type: 'p',
          text: 'When you type "The capital of France is" and the model says "Paris" — it\'s not retrieving a fact from a database. It\'s computing that, given those eight words, the statistically most likely ninth word in its training data was "Paris." Same mechanism produces "Paris" for capitals and "the" for incomplete sentences.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The analogy that works',
          text: 'Think of an LLM as autocomplete on extreme steroids. Your phone\'s autocomplete predicts the next word from your last three. An LLM predicts the next word from the last few thousand — and was trained on a substantial fraction of the public internet plus most published books.',
        },

        { type: 'h2', text: 'How models get trained — without the math' },
        {
          type: 'p',
          text: 'Imagine showing a system every page of every book and every web article ever published. For each, you mask out a word and ask it to guess. Wrong? Adjust slightly. Right? Reinforce. Do this billions of times. The system that emerges has a deeply tuned sense of which words follow which in which contexts. That sense is what produces the fluency you see in ChatGPT.',
        },
        {
          type: 'p',
          text: 'Crucially, the model never stored the books. It stored the statistical patterns. Ask it to quote a passage exactly and it will often produce something *like* the passage, blended with other passages, with confident but invented details. This isn\'t a bug. It\'s how it works.',
        },

        { type: 'h2', text: 'Why LLMs hallucinate — and why they can\'t help it' },
        {
          type: 'p',
          text: 'When the model encounters a question where the most-likely-next-word doesn\'t correspond to reality — because you asked about something rare, recent, or specific — it produces the most plausible-sounding answer anyway. That\'s a hallucination: fluent, confident, wrong.',
        },
        {
          type: 'list',
          items: [
            '<strong>Specific names</strong> — asks about someone obscure, gets back invented biographies',
            '<strong>Recent events</strong> — asks about last month, gets back a confident answer from before its training cutoff',
            '<strong>Citations</strong> — asks for academic references, gets back perfectly formatted papers that don\'t exist',
            '<strong>Numbers and dates</strong> — asks for specifics, gets back plausible numbers that don\'t check out',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The verify-or-don\'t-use rule',
          text: 'For anything that involves a specific fact you would Google to confirm — names, dates, numbers, citations, regulatory references — verify it. The model\'s confidence does not correlate with its accuracy in these cases. Treat its output as a high-quality first draft, not a finished reference.',
        },

        { type: 'h2', text: 'But also — why this same mechanism is so useful' },
        {
          type: 'p',
          text: 'The same statistical sense that lets it confidently invent citations is what lets it draft a coherent email, summarize a complex document, restructure your messy notes into clear bullet points, translate between languages, or write code that almost compiles. For tasks where you have the source material (a document to summarize, notes to restructure, your own draft to polish) the hallucination risk drops dramatically — because the model isn\'t inventing, it\'s transforming what you gave it.',
        },
        {
          type: 'example',
          title: 'Where to trust LLM output vs. where to verify',
          text: 'Trust higher: "Summarize this 10-page document I just pasted." "Rewrite this paragraph more concisely." "Translate this Arabic email to English." Trust lower: "What is the share of GDP that AI contributes to Saudi Arabia\'s economy?" "Cite three papers about transformer architecture." "When was X regulation passed?" The first three transform input. The last three require external facts.',
        },
      ],
      keyTakeaways: [
        'LLMs work by predicting the next word, one at a time, based on everything written so far.',
        'They don\'t retrieve facts — they generate plausible continuations from statistical patterns.',
        'Hallucinations are unavoidable in tasks requiring specific external facts (names, dates, citations, numbers).',
        'For tasks that transform input you provided, hallucination risk drops dramatically — and that\'s where most of the practical value lives.',
      ],
      quiz: [
        {
          question: 'Which of the following best describes what an LLM is doing when it generates a response?',
          options: [
            'Looking up the answer in its memory of all the documents it was trained on',
            'Computing the statistically most likely next word, one at a time, given everything before',
            'Reasoning through the problem the way a human would',
            'Searching the live internet for the most recent information',
          ],
          correctIndex: 1,
          explanation:
            'LLMs predict tokens one at a time based on training-data patterns. They do not retrieve documents, reason like humans, or access the live internet (unless explicitly given a search tool). Understanding this is the foundation for using LLMs well.',
        },
        {
          question: 'Why does an LLM "hallucinate" — produce confident, fluent answers that are factually wrong?',
          options: [
            'It is broken and needs to be retrained',
            'It is trying to deceive the user',
            'When the next-most-likely word doesn\'t correspond to reality, it produces what\'s plausible anyway — this is how the mechanism works',
            'It only happens with cheap models; expensive models don\'t hallucinate',
          ],
          correctIndex: 2,
          explanation:
            'Hallucination is built into how LLMs work. The model doesn\'t know when it doesn\'t know — it just produces the most likely continuation. More expensive or larger models hallucinate less on common topics, but the mechanism is the same. The right defense is verification, not better models.',
        },
        {
          question: 'For which task is the hallucination risk lowest?',
          options: [
            'Listing the top 5 academic papers on multimodal AI from 2024',
            'Summarizing a 20-page contract you just pasted into the prompt',
            'Citing the exact text of GDPR Article 22',
            'Listing all the AI regulations passed in Saudi Arabia this year',
          ],
          correctIndex: 1,
          explanation:
            'Summarization works on the text you provided, so the model has the source material in its context window — there\'s nothing to invent. The other three require the model to produce specific external facts (papers, exact legal text, recent regulatory events) which is exactly where hallucination risk peaks.',
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 3 — Where AI fits in your work
    // ──────────────────────────────────────────────────────────────────
    3: {
      intro:
        'AI is good at specific things and bad at others. This chapter gives you a pattern-matching frame: five tasks where generative AI is genuinely strong, with concrete examples for HR, Finance, Sales, Marketing, and Operations. By the end you\'ll have a candidate list for your own workflow.',
      blocks: [
        { type: 'h2', text: 'The 5 AI-fit patterns' },
        {
          type: 'p',
          text: 'Most useful applications of generative AI fall into one of five patterns. Memorize these and you can evaluate any AI use case at a glance.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '<strong>Summarize</strong> — take a long input, produce a shorter output that preserves the meaning. Meeting notes → action items. 30-page contract → 1-page brief. Customer feedback batch → themes.',
            '<strong>Draft</strong> — produce a first draft from a brief. Email from bullet points. Job description from a role outline. Proposal section from talking points. The human polishes.',
            '<strong>Classify</strong> — sort items into categories. Inbound emails by urgency. Support tickets by topic. Resumes by relevance. CVs by seniority. (This is what AI was doing before GenAI, but GenAI made it cheaper and faster to set up.)',
            '<strong>Extract</strong> — pull specific information out of unstructured text. Names, dates, amounts from invoices. Key clauses from contracts. Action items from meeting transcripts.',
            '<strong>Transform</strong> — convert from one format to another. Bullet points to paragraph. Email to summary. Free-text policy to FAQ. English to Arabic. Code in Python to code in TypeScript.',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'A quick test',
          text: 'When you encounter an AI use case, ask: "Which of the five patterns is this?" If you can\'t name one of the five, the use case might be the wrong shape for current AI. The patterns are the green-light zone.',
        },

        { type: 'h2', text: 'Examples by function — find yours' },
        {
          type: 'h3',
          text: 'HR & People',
        },
        {
          type: 'list',
          items: [
            'Summarize 100 employee survey free-text comments into 5 themes',
            'Draft job descriptions from a role brief',
            'Extract candidate skills from resumes',
            'Transform an internal policy into FAQ format for the intranet',
          ],
        },
        {
          type: 'h3',
          text: 'Finance & Accounting',
        },
        {
          type: 'list',
          items: [
            'Summarize a long earnings call transcript into 5 bullet points',
            'Draft variance commentary for monthly reports from raw numbers',
            'Extract amounts, dates, vendor names from invoices',
            'Transform an audit query email into a structured response',
          ],
        },
        {
          type: 'h3',
          text: 'Sales & Marketing',
        },
        {
          type: 'list',
          items: [
            'Summarize 30 sales-call transcripts into common objection themes',
            'Draft outbound emails personalized to a prospect\'s LinkedIn',
            'Classify inbound leads into hot / warm / cold',
            'Transform a long blog post into 5 LinkedIn carousel slides',
          ],
        },
        {
          type: 'h3',
          text: 'Operations & Supply Chain',
        },
        {
          type: 'list',
          items: [
            'Summarize a supplier\'s quarterly performance report',
            'Draft procurement RFP responses from a request brief',
            'Extract shipment status from carrier email confirmations',
            'Transform handwritten warehouse notes into a structured incident log',
          ],
        },

        { type: 'h2', text: 'What doesn\'t fit' },
        {
          type: 'p',
          text: 'Anti-patterns — tasks that look like they should fit but don\'t (yet):',
        },
        {
          type: 'list',
          items: [
            '<strong>Pure prediction</strong> ("will this customer churn?") — classical ML is better. Don\'t use GenAI.',
            '<strong>High-stakes individual judgment</strong> (hiring decisions, medical diagnosis, credit denials) — AI can assist, but the human makes the call.',
            '<strong>Open creative work where voice is the value</strong> — AI can speed up, but can\'t replace your taste.',
            '<strong>Anything requiring real-time freshness</strong> beyond what the model was trained on — unless the AI has tools to look things up.',
          ],
        },
      ],
      keyTakeaways: [
        'Five patterns cover most useful GenAI work: Summarize, Draft, Classify, Extract, Transform.',
        'If a use case doesn\'t map to one of the five, it\'s probably not the right shape for current GenAI.',
        'Every business function has multiple high-fit candidates — pick one and try it this week.',
        'Anti-patterns include pure prediction, high-stakes individual judgment, and tasks requiring real-time information.',
      ],
      exercise: {
        title: 'Map AI to your daily workflow',
        prompt:
          'Take a blank document. List 5 tasks you do every week that take more than 30 minutes each. For each, tag it with one of the 5 patterns (Summarize / Draft / Classify / Extract / Transform) — or "doesn\'t fit." Aim for at least 2 tasks that DO fit. Those are your AI candidates.',
        deliverable:
          'A 5-row list: task description · pattern (or "doesn\'t fit") · rough time saved if AI handles it. Bring this list to chapter 6 — you\'ll try AI on the top candidate.',
      },
    },

    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 4 — Privacy, risk, and the things to watch
    // ──────────────────────────────────────────────────────────────────
    4: {
      intro:
        'AI tools aren\'t a black hole — but they aren\'t private either. This chapter covers the data categories you should never paste into a public AI tool, three specific bias risks with real-world examples, and the questions to ask before deploying AI in any sensitive workflow.',
      blocks: [
        { type: 'h2', text: 'What happens to data you paste into a public AI tool' },
        {
          type: 'p',
          text: 'When you use the free or consumer version of ChatGPT, Gemini, or Claude, your prompts may be stored, reviewed by human raters for quality, and (depending on the provider\'s policies) used to improve future models. That doesn\'t mean a stranger reads your prompts at lunch — but it does mean your data is no longer fully under your control.',
        },
        {
          type: 'p',
          text: 'Enterprise versions of these tools — Microsoft 365 Copilot, ChatGPT Enterprise, Claude for Work, the Azure OpenAI Service — generally do not train on your data and offer contractual guarantees about isolation. If you\'re unsure which version your organization uses, ask IT before pasting anything sensitive.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The default assumption',
          text: 'If you don\'t know whether your AI tool is the enterprise version, assume it isn\'t. Treat it like a public chat tool. That mental model keeps you safe even when you\'re wrong about the tool.',
        },

        { type: 'h2', text: 'Three categories of data that should never enter a public AI tool' },
        {
          type: 'h3',
          text: '1. Personally Identifiable Information (PII) — yours or others\'',
        },
        {
          type: 'p',
          text: 'Names with phone numbers, addresses, government IDs (Aadhaar, Emirates ID, SSN), passport numbers, dates of birth, full medical histories tied to a person. Even seemingly mundane combinations — name + employee ID + salary band — become PII when combined.',
        },
        {
          type: 'h3',
          text: '2. Confidential business information' },
        {
          type: 'p',
          text: 'Unannounced strategy, M&A targets, customer lists, pricing playbooks, source code marked confidential, contracts under NDA, draft legal arguments. If it would embarrass you to see it on a competitor\'s slide deck, it doesn\'t go into a public AI tool.',
        },
        {
          type: 'h3',
          text: '3. Regulated data',
        },
        {
          type: 'p',
          text: 'PHI (protected health information), CHD (cardholder data under PCI), client identifiers under financial-services regulations (RBI, SAMA, ADGM), classified data, anything under specific regional rules (Saudi PDPL, India DPDP, EU GDPR). These categories have legal consequences for unauthorized exposure.',
        },
        {
          type: 'callout',
          variant: 'action',
          title: 'What to do instead',
          text: 'For sensitive workflows: (1) use your organization\'s enterprise AI tool, (2) anonymize data before pasting (replace real names with "Person A", real numbers with [REDACTED]), or (3) ask IT for the right tool. The friction is worth it.',
        },

        { type: 'h2', text: 'Bias risk — three scenarios that matter at work' },
        {
          type: 'h3',
          text: 'Scenario 1: AI in hiring',
        },
        {
          type: 'p',
          text: 'You use AI to screen resumes. Six months in, you notice the candidates AI ranks highest are disproportionately from a small set of universities and a narrow demographic. This isn\'t the AI being malicious — it\'s the AI learning from your historical hiring data, which already had bias baked in. The AI didn\'t introduce the bias; it amplified it.',
        },
        {
          type: 'h3',
          text: 'Scenario 2: AI in customer service',
        },
        {
          type: 'p',
          text: 'A multilingual chatbot trained primarily on English handles English customers well and Arabic customers poorly. Response quality drops, customer satisfaction drops, and the drop is concentrated in Arabic-speaking markets — which means the bias has a regional and arguably ethnic dimension. If you measure CSAT only at the aggregate, you miss this entirely.',
        },
        {
          type: 'h3',
          text: 'Scenario 3: AI in lending',
        },
        {
          type: 'p',
          text: 'An AI credit-scoring model uses zip code as one of its features. Zip code correlates with race in many countries, even when race isn\'t directly used. The model produces what looks like a neutral score but disproportionately rejects applicants from certain neighborhoods. This is the classic "proxy variable" problem — and regulators in BFSI take it seriously.',
        },

        { type: 'h2', text: 'The 4 questions to ask before deploying AI in a sensitive workflow' },
        {
          type: 'list',
          ordered: true,
          items: [
            '<strong>What data is going in?</strong> PII, confidential, regulated — or none of these?',
            '<strong>What decision is being influenced?</strong> Hiring, lending, healthcare, customer treatment — these are high-stakes and need extra care.',
            '<strong>Who reviews the AI output?</strong> Is there a human in the loop with veto power?',
            '<strong>How do we detect when it goes wrong?</strong> What\'s the monitoring plan, the appeals process, the audit trail?',
          ],
        },
      ],
      keyTakeaways: [
        'Public AI tools may store and train on your prompts. Use enterprise versions for any sensitive workflow.',
        'Never paste PII, confidential business data, or regulated data into a tool you\'re not sure about.',
        'AI can amplify bias that already exists in your historical data — it rarely creates new bias, but it scales existing bias quickly.',
        'Before deploying AI in any high-stakes workflow, answer: what data, what decision, what review, what monitoring.',
      ],
      quiz: [
        {
          question: 'You\'re using the free version of ChatGPT to summarize a contract that includes customer names, contract values, and an NDA clause. What\'s the safest interpretation?',
          options: [
            'Fine — ChatGPT is a tool, not a person',
            'Fine if you delete the chat afterwards',
            'Not safe — assume free-tier prompts may be stored or used for training, and treat that as exposure',
            'Safe only if you trust OpenAI\'s privacy policy',
          ],
          correctIndex: 2,
          explanation:
            'The contract contains confidential business data (customer names, contract values) plus an NDA clause. On the free tier, your prompts may be stored and reviewed. Even if OpenAI\'s policy is benign, the safer model is: assume free-tier prompts equal exposure, and use the enterprise version (or anonymize) for anything sensitive.',
        },
        {
          question: 'A hiring AI tool consistently scores candidates from one university higher than equally qualified candidates from other universities. What\'s the most likely cause?',
          options: [
            'The AI vendor is being paid by that university',
            'The AI is malfunctioning and needs to be reset',
            'The AI learned from historical hiring data that already favored that university',
            'The AI is testing the recruiter\'s vigilance',
          ],
          correctIndex: 2,
          explanation:
            'AI bias is overwhelmingly inherited from training data. If your past hiring favored one university, the AI will too — and at higher volume. Mitigation requires examining the training data and the features used, not just retraining the model.',
        },
        {
          question: 'Which of the following is the LEAST risky data to paste into a public AI tool?',
          options: [
            'Your customer\'s name, email, and recent order',
            'Your draft of a blog post about generic AI trends',
            'A redacted version of a legal contract',
            'Your team\'s mid-quarter performance review notes',
          ],
          correctIndex: 1,
          explanation:
            'The blog post on generic AI trends contains no PII, no confidential business data, and no regulated information. The other three involve customer PII, confidential legal content, and employee performance data respectively — all of which warrant the enterprise tool or anonymization.',
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 5 — How to evaluate AI claims (and tools)
    // ──────────────────────────────────────────────────────────────────
    5: {
      intro:
        'Every week there\'s a new AI tool, vendor, or breathless announcement. This chapter gives you a 5-question framework to evaluate any AI pitch in 90 seconds — plus the four red flags that should make you walk away.',
      blocks: [
        { type: 'h2', text: 'The 5-question framework' },
        {
          type: 'p',
          text: 'Use this on every AI vendor pitch, every internal AI proposal, every "we should buy this" suggestion. If a tool can\'t answer all five clearly, it\'s not ready for your environment.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '<strong>What specific problem does this solve?</strong> Not "AI for sales" — a specific, named workflow with a measurable outcome.',
            '<strong>What does success look like in week 4?</strong> If the vendor can\'t describe a 4-week pilot with measurable success criteria, the use case isn\'t crisp.',
            '<strong>Where does our data live?</strong> Does it leave our tenant? Who has access? Is it used for training? What\'s the data deletion policy?',
            '<strong>What happens when it gets it wrong?</strong> Every AI tool makes mistakes. The good ones tell you exactly how often, why, and what the human-in-the-loop pattern looks like.',
            '<strong>What\'s the all-in cost over 12 months?</strong> Not just the per-seat license. Implementation, integration, training, infrastructure, ongoing tuning, support. The headline number is rarely the real number.',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The 90-second test',
          text: 'Ask any vendor these 5 questions in 90 seconds. If they answer the first three crisply and the last two with realistic specifics, take them seriously. If they pivot to "let\'s set up a deeper conversation," you have your answer.',
        },

        { type: 'h2', text: '4 red flags' },
        {
          type: 'h3',
          text: '1. "Our AI achieves 99% accuracy"',
        },
        {
          type: 'p',
          text: 'Accuracy on what? Measured how? Compared to what baseline? On their data or yours? A claim without these qualifications is marketing, not science. The good vendors tell you the test set, the metric, and the baseline — and acknowledge that performance on your data may differ.',
        },
        {
          type: 'h3',
          text: '2. "AI replaces your [team / function / role]"',
        },
        {
          type: 'p',
          text: 'Almost nothing in business today is a candidate for full replacement. Augmentation works; replacement rarely does — at least not safely or quickly. Vendors who lead with "replacement" are signaling either inexperience with deployment or a willingness to over-promise. Both are problems.',
        },
        {
          type: 'h3',
          text: '3. "You don\'t need to worry about the data"',
        },
        {
          type: 'p',
          text: 'You always need to worry about the data. Where it lives, who can access it, what happens if it leaks, how it\'s used for training. A vendor who waves this away either doesn\'t understand it (bad) or is hoping you don\'t (worse). Make them produce a written DPA before any conversation goes further.',
        },
        {
          type: 'h3',
          text: '4. "We have proprietary AI"',
        },
        {
          type: 'p',
          text: 'Most vendors don\'t. Most use OpenAI\'s, Anthropic\'s, Google\'s, or open-source models under the hood, with prompt engineering, RAG, and a UI on top. There\'s nothing wrong with that — but vendors who claim "proprietary AI" without naming the underlying model are usually hiding the fact that they\'re a thin wrapper. Ask: which foundation model are you using? Answer should be specific.',
        },

        { type: 'h2', text: 'A practical example' },
        {
          type: 'example',
          title: 'A common pitch — translated honestly',
          text: 'Vendor says: "Our enterprise AI agent achieves 96% accuracy in customer service, replaces 60% of tier-1 support, and is fully compliant out of the box." Translation: "Accuracy claim is on their test data, may differ on yours. Replacement claim ignores everything that happens when the bot is wrong. Compliance claim is unverifiable without seeing their DPA and security posture." Ask the 5 questions, watch what survives.',
        },

        { type: 'h2', text: 'Build your own short-list, not the vendor\'s' },
        {
          type: 'p',
          text: 'The best filter is your own list. Before any AI procurement, write down the 3-5 specific workflows you want to improve, the measurable success criteria for each, and the constraints (data, regulatory, integration). Vendors who can\'t map their tool to YOUR list cleanly are not the right vendor — no matter how good the demo.',
        },
      ],
      keyTakeaways: [
        'Five questions filter most AI vendor pitches: problem · success in week 4 · data · failure mode · all-in cost.',
        'Four red flags: unqualified accuracy claims, replacement language, "don\'t worry about data," and "proprietary AI" without naming the model.',
        'Start with your own list of workflows and constraints, then evaluate vendors against your list — not theirs.',
        'A vendor who can\'t answer the 5 questions in 90 seconds doesn\'t belong on your short-list.',
      ],
      quiz: [
        {
          question: 'A vendor claims their AI tool "achieves 95% accuracy in document processing." What\'s the most useful follow-up question?',
          options: [
            'Can you get to 99%?',
            'On what test data, measured how, compared to what baseline?',
            'How fast can you deploy it?',
            'What\'s the per-seat price?',
          ],
          correctIndex: 1,
          explanation:
            'An accuracy number without context — test data, metric, baseline — is marketing, not measurement. The follow-up question forces the vendor to either substantiate the claim or reveal that the number was decorative. Either outcome is useful.',
        },
        {
          question: 'Which of these is the strongest "yes" signal in a vendor evaluation?',
          options: [
            '"We have proprietary AI that we built in-house"',
            '"We achieved 99% accuracy on our internal tests"',
            '"We use Azure OpenAI GPT-4o under the hood, here\'s our 4-week pilot scope with success criteria, and our DPA is in the data room"',
            '"This will replace 60% of your team\'s workload"',
          ],
          correctIndex: 2,
          explanation:
            'The third answer is specific about everything — the underlying model, the pilot structure, the success criteria, and the procurement documentation. The other three are red flags: vague "proprietary," uncontextualized accuracy, and overpromise on replacement.',
        },
      ],
    },

    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 6 — Hands-on with Copilot
    // ──────────────────────────────────────────────────────────────────
    6: {
      intro:
        'Reading about AI is the easy part. Doing it on your actual work is what matters. This chapter has three specific prompts you can run today — on your real documents, your real emails, your real situation — and a method for saving the ones that work.',
      blocks: [
        {
          type: 'callout',
          variant: 'action',
          title: 'Before you start',
          text: 'You need access to Microsoft 365 Copilot, ChatGPT (Enterprise version if available), Claude, or Gemini. If you don\'t have any of these, the free ChatGPT or Gemini will work for the practice — just don\'t paste anything sensitive (see Chapter 4).',
        },

        { type: 'h2', text: 'Prompt 1 — Summarize a long email thread' },
        {
          type: 'p',
          text: 'Pick a long email thread in your inbox right now — at least 8 messages, ideally more.',
        },
        {
          type: 'example',
          title: 'The prompt',
          text: 'Paste the email thread, then say: "Summarize this email thread in 4 bullet points. Cover: (1) what the discussion is about, (2) what decisions have been made, (3) what\'s still open, (4) what action items are assigned to whom. Use direct, plain language."',
        },
        {
          type: 'p',
          text: 'Watch what comes back. Notice that it\'s usually 70% right and 30% needs tweaking. That\'s normal. The point isn\'t perfection — it\'s that you went from a 12-minute read to a 30-second understanding.',
        },

        { type: 'h2', text: 'Prompt 2 — Draft a hard email from bullet points' },
        {
          type: 'p',
          text: 'Think of an email you\'ve been putting off — declining a request, giving difficult feedback, asking for something awkward.',
        },
        {
          type: 'example',
          title: 'The prompt',
          text: '"Draft an email for me. Recipient: [name and role]. Context: [3 sentences of what\'s going on]. What I want to convey: [bullet points]. Tone: [direct but warm / formal / etc.]. Keep it under 150 words."',
        },
        {
          type: 'p',
          text: 'The first draft will probably be 80% there. Your edits are where your voice and judgment come in — but you\'re editing, not writing from scratch. Most people find this is the single biggest time-saver in their week.',
        },

        { type: 'h2', text: 'Prompt 3 — Extract action items from a meeting transcript' },
        {
          type: 'p',
          text: 'Take a recent meeting transcript (Teams or Zoom can generate these). Or if you don\'t have one, take your own notes from a recent meeting.',
        },
        {
          type: 'example',
          title: 'The prompt',
          text: '"Extract from this meeting transcript: (1) Decisions made, (2) Action items with owner and due date if mentioned, (3) Open questions with no owner yet. Format as three clearly-labeled sections. Quote the exact phrase from the transcript where the action was assigned."',
        },
        {
          type: 'p',
          text: 'The "quote the exact phrase" instruction is the trick — it forces the model to point at evidence, which makes it harder to hallucinate items that weren\'t in the transcript. Always include this kind of grounding instruction when extracting from a source.',
        },

        { type: 'h2', text: 'Saving the prompts that work' },
        {
          type: 'p',
          text: 'When you find a prompt that produces useful output, save it. Don\'t try to remember it. Create a simple "AI Prompts" document — Notion, OneNote, a folder of text files, whatever. For each prompt, save:',
        },
        {
          type: 'list',
          items: [
            'The prompt itself (verbatim)',
            'A one-line description of when to use it',
            'A tweak or two that improves it for your specific situation',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The prompt library becomes the asset',
          text: 'After 3 months of saving good prompts, you\'ll have a personal library of 30-50 patterns that fit your work. That library is more valuable than any single tool — it travels with you.',
        },

        { type: 'h2', text: 'When the output is wrong' },
        {
          type: 'p',
          text: 'It will be wrong sometimes. Two patterns that almost always improve it:',
        },
        {
          type: 'list',
          items: [
            '<strong>Add an example.</strong> "Here\'s the format I want: [paste example output]. Now do the same for this input." Examples are the single most effective way to fix bad output.',
            '<strong>Be more specific about constraints.</strong> "Under 100 words. No bullet points. Formal tone. Don\'t mention X." Constraints are gifts to the model.',
          ],
        },
      ],
      keyTakeaways: [
        'You learn AI by using it on real work — read less, try more.',
        'Three prompts cover most weekly time-saves: summarize emails, draft hard emails, extract action items.',
        'Saving the prompts that work compounds into a personal library that beats any single tool.',
        'When output is wrong: add an example, or add constraints. Both fix most problems.',
      ],
      exercise: {
        title: 'Run the three prompts on your actual work',
        prompt:
          'Spend the next 30 minutes running prompt 1, prompt 2, and prompt 3 — each on a real piece of your work. Adjust the prompts as needed for your context. For each, note: time you saved, what worked, what didn\'t.',
        deliverable:
          'A short reflection: which of the three saved you the most time? Which needs adjustment for your context? Save the adjusted version of your favorite prompt to a new "AI Prompts" doc.',
      },
    },

    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 7 — Building AI habits that stick
    // ──────────────────────────────────────────────────────────────────
    7: {
      intro:
        'Most people try AI once, get something half-useful, and stop. This chapter is about not being that person — designing habits that anchor AI to workflows you already do, so you don\'t need willpower to keep using it.',
      blocks: [
        { type: 'h2', text: 'Why adoption fails (it\'s not what you think)' },
        {
          type: 'p',
          text: 'It\'s rarely the technology. It\'s rarely the price. It\'s rarely the security. The most common reason people stop using AI after the first week: they forgot. Their existing workflow is automatic; the new AI step requires conscious effort. So three weeks in, they\'re back to the old pattern.',
        },
        {
          type: 'p',
          text: 'The fix isn\'t willpower. The fix is anchoring the AI step to a trigger that already exists in your day.',
        },

        { type: 'h2', text: 'Habit-anchoring — borrowing from behavior science' },
        {
          type: 'p',
          text: 'The formula: <em>After I [existing habit], I will [AI habit].</em> The existing habit is your trigger. The AI habit is the new behavior. You don\'t need to remember the AI habit — the existing habit cues it automatically.',
        },
        {
          type: 'example',
          title: 'Examples',
          text: '"After I open Outlook in the morning, I will paste the longest email thread into Copilot and ask for a summary." "After I leave any meeting that lasted more than 30 minutes, I will paste the transcript into Copilot and ask for action items." "After I sit down to write any document, I will spend 2 minutes drafting the outline with Copilot before opening Word."',
        },

        { type: 'h2', text: 'Pick three habits — not ten' },
        {
          type: 'p',
          text: 'Three weekly habits is plenty. Ten is too many to remember and too easy to fail. Three is enough to see compounding value but few enough that each one actually sticks.',
        },
        {
          type: 'p',
          text: 'A balanced trio: one habit for inbox/communication, one for documents/analysis, one for meetings. That spreads the value across your week and lets you notice the time savings clearly.',
        },
        {
          type: 'callout',
          variant: 'action',
          title: 'Write yours down today',
          text: 'On a sticky note, write three "After I [X], I will [Y]" sentences. Stick the note on your monitor for 30 days. Most people don\'t need it after that — the habit is automatic.',
        },

        { type: 'h2', text: 'Tracking and reinforcement' },
        {
          type: 'p',
          text: 'For the first two weeks, log when you do the habit. A simple tally on a notebook or a checkbox in Outlook works. The goal isn\'t to track success — it\'s to make the new behavior visible until it becomes automatic.',
        },
        {
          type: 'p',
          text: 'After two weeks: review what actually saved time vs. what didn\'t. Drop the one that didn\'t pay off. Replace it with a new candidate. Most people end up cycling through 5-8 habits in their first quarter before landing on the three that genuinely fit their work.',
        },

        { type: 'h2', text: 'Avoiding fatigue — the "AI everywhere" trap' },
        {
          type: 'p',
          text: 'Some people swing the opposite way: try to use AI for everything, get exhausted by the constant tool-switching, and burn out. The fix is the inverse of forgetting — be selective. AI is for specific anchored moments. The rest of your work stays as it was.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The "would I miss it" test',
          text: 'Every month, ask: "If this AI habit disappeared tomorrow, would I miss it?" If yes, keep it. If no, drop it. Habits earn their place by saving time you actually care about saving.',
        },
      ],
      keyTakeaways: [
        'Adoption usually fails because of forgetting, not because of bad technology.',
        'Anchor each AI habit to an existing trigger using the "After I [X], I will [Y]" formula.',
        'Pick three habits, not ten. One for inbox, one for documents, one for meetings is a balanced trio.',
        'Review monthly: keep habits that earn their place, drop habits you wouldn\'t miss.',
      ],
    },

    // ──────────────────────────────────────────────────────────────────
    // CHAPTER 8 — Capstone: Your AI starter plan
    // ──────────────────────────────────────────────────────────────────
    8: {
      intro:
        'You\'ve covered the foundations, the mechanics, the patterns, the risks, the practical use, and the habit design. Now you bring it all together into a 1-page plan for the next 30 days — for yourself, and for the next team conversation.',
      blocks: [
        { type: 'h2', text: 'The 1-page personal plan' },
        {
          type: 'p',
          text: 'The deliverable of this course is one document, one page, and not a slide longer. It has four sections.',
        },
        {
          type: 'h3',
          text: 'Section 1: What I now believe about AI (3 sentences)',
        },
        {
          type: 'p',
          text: 'Your mental model in three sentences. The first sentence is what AI actually is. The second is what it\'s genuinely good at in your context. The third is what you specifically will not use it for. Writing this down forces clarity.',
        },
        {
          type: 'h3',
          text: 'Section 2: My three AI habits (3 lines)',
        },
        {
          type: 'p',
          text: 'Your three "After I [X], I will [Y]" habits from chapter 7. One for inbox, one for documents, one for meetings. Or whatever balance fits your week.',
        },
        {
          type: 'h3',
          text: 'Section 3: My prompt library starter (3 prompts)',
        },
        {
          type: 'p',
          text: 'Three prompts you saved from chapter 6, with one-line descriptions of when to use each. This is the seed of your prompt library — it grows from here.',
        },
        {
          type: 'h3',
          text: 'Section 4: My next conversation (1 paragraph)',
        },
        {
          type: 'p',
          text: 'Who you\'re going to have an AI conversation with in the next 7 days, and what you\'re going to say. Maybe it\'s your manager — "I\'ve been using AI for X, here\'s what I\'ve learned." Maybe it\'s a peer — "Can we share prompts that work?" Maybe it\'s your team — "Should we pilot AI for Y?"',
        },

        { type: 'h2', text: 'The team conversation prompt' },
        {
          type: 'p',
          text: 'If you\'re a manager or team lead, the next conversation is with your team. The prompt that works:',
        },
        {
          type: 'quote',
          text: '"For the next two weeks, I want each of us to find one AI prompt that genuinely saves us time on our own work. We\'ll share them at the next team meeting. No theater. No buzzwords. Just one prompt that worked, with a real example."',
        },
        {
          type: 'p',
          text: 'This works because it\'s small, individual, and tangible. People don\'t need to "transform their workflow" — they need to find one thing that helps. The compounding starts there.',
        },

        { type: 'h2', text: 'What comes next — beyond this course' },
        {
          type: 'p',
          text: 'You\'ve completed the foundations. The natural next steps depending on what you do day-to-day:',
        },
        {
          type: 'list',
          items: [
            '<strong>If you\'re in a specific function</strong> (HR, Finance, Sales, CS, Ops, Legal) — take the Function-track course for your role. Same depth, applied to your workflows.',
            '<strong>If you lead a team or function</strong> — the Leadership track has AI Strategy for the C-Suite and AI ROI Business Case Building.',
            '<strong>If you work in a specific industry</strong> — the Industry track has Healthcare, BFSI, Manufacturing, Government, Energy, Retail, and Education courses.',
            '<strong>If you want to go technical</strong> — the Builder track covers Prompt Engineering, Copilot Studio, RAG, and MLOps for LLMs.',
          ],
        },

        { type: 'h2', text: 'A final note — the only thing that matters' },
        {
          type: 'p',
          text: 'Everything in this course is wasted unless you do one thing this week. Pick one prompt, one workflow, one anchored habit. Try it. See what happens. The compounding starts with one. Not with planning the perfect rollout. Not with reading another course. One.',
        },
      ],
      keyTakeaways: [
        'The course deliverable is one page: belief in 3 sentences, 3 habits, 3 saved prompts, 1 next conversation.',
        'The team conversation prompt: "Find one AI prompt that saves you time. Share at next meeting."',
        'Next step depends on your role: function-specific, leadership, industry, or builder track.',
        'Compounding starts with one habit, not with the perfect plan. Pick one. Try it this week.',
      ],
      capstone: {
        instructions:
          'Open a blank document. Title it "My 30-day AI starter plan." Write the four sections — belief (3 sentences), habits (3 lines), prompts (3 with descriptions), next conversation (1 paragraph). Keep it to one page. When done, share it with one trusted colleague — that act of sharing is what makes it real. If you lead a team, schedule the team conversation in the next 7 days.',
        deliverable:
          'A 1-page personal AI starter plan, shared with one colleague. Optionally: a calendar invite for the team conversation if applicable.',
      },
    },
  },
}
