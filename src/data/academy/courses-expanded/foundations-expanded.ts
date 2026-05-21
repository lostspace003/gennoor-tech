import type { Course } from '../types'

// Foundations track — expanded catalog.
// Six additional courses that deepen the Foundations and Applied tracks.

export const foundationsExpanded: Course[] = [
  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK — AI Literacy for Non-Technical Teams
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-literacy-non-technical-teams',
    title: 'AI Literacy for Non-Technical Teams',
    subtitle:
      'A 40-minute starter for HR, Marketing, Sales, and Ops — no code, no jargon, just where AI actually helps your day-to-day.',

    track: 'foundations',
    level: 'foundational',
    audience: ['individual-contributor', 'manager'],
    functions: undefined,
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['train'],

    duration: '40 min',
    chapterCount: 6,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-21',

    interactiveUrl: '/ai-academy/ai-literacy-non-technical-teams',

    hookSentence:
      'For non-tech functions — what AI is, what it isn’t, and the 10 prompts you can try Monday morning.',
    whoThisIsFor:
      'Individual contributors and managers in HR, Marketing, Sales, and Operations who are being asked to use AI in their day-to-day but have never had a clear starting point. Especially valuable across GCC, India, and SEA where Copilot and ChatGPT Enterprise rollouts are landing on teams without prior AI exposure or vocabulary.',
    whatYoullLearn: [
      'A working mental model of modern AI — without the math or the jargon',
      'Prompting as a learnable skill — three patterns you can practice this week',
      'Role-specific AI fit — where it helps HR, Marketing, Sales, and Ops differently',
      'The risks every non-technical user should know (and how to avoid them)',
      '10 concrete prompts to try Monday morning — with how to tell if they worked',
      'Where to go next, based on your function and your confidence',
    ],
    chapters: [
      {
        number: 1,
        title: 'Demystifying AI',
        duration: '7 min',
        objectives: [
          'Distinguish AI, machine learning, and generative AI in plain language',
          'Identify three AI myths that hurt non-technical users',
        ],
      },
      {
        number: 2,
        title: 'Prompting as a learnable skill',
        duration: '7 min',
        objectives: [
          'Apply the role–task–context prompt pattern',
          'Spot the difference between a vague prompt and a useful one',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Where AI helps you specifically',
        duration: '7 min',
        objectives: [
          'Map AI-fit patterns to your function (HR, Marketing, Sales, Ops)',
          'Identify two tasks in your week AI can compress today',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'The risks you should know',
        duration: '6 min',
        objectives: [
          'Recognize data you should never paste into a public AI tool',
          'Spot hallucinations in two common business outputs',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: '10 prompts to try Monday morning',
        duration: '7 min',
        objectives: [
          'Run 3 of 10 role-tailored prompts on real work',
          'Save and refine the prompts that produced useful output',
        ],
        hasExercise: true,
      },
      {
        number: 6,
        title: 'Capstone: Your first AI week',
        duration: '6 min',
        objectives: [
          'Draft a 1-page plan for your first AI-augmented work week',
          'Pick the next course based on your role and confidence',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your First AI-Augmented Week',
    references: [
      {
        title: 'OpenAI Prompt Engineering Guide',
        source: 'OpenAI',
        url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'Microsoft 365 Copilot Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-365-copilot/',
      },
      {
        title: 'MIT Sloan Management Review — AI at Work',
        source: 'MIT Sloan',
        url: 'https://sloanreview.mit.edu/topic/artificial-intelligence/',
      },
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'prompting-mastery',
      'working-with-copilots',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK — Prompting Mastery
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'prompting-mastery',
    title: 'Prompting Mastery',
    subtitle:
      'A 55-minute deep dive for power users and developers — structured outputs, chain-of-thought, few-shot, and the prompt library habits that compound.',

    track: 'foundations',
    level: 'intermediate',
    audience: ['individual-contributor', 'manager', 'technical'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['train'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-21',
    interactiveUrl: '/ai-academy/prompting-mastery',

    hookSentence:
      'Past basic prompts — structured outputs, reasoning, few-shot, evaluation, and prompt libraries that compound across a team.',
    whoThisIsFor:
      'Power users, analysts, and developers who already use ChatGPT, Claude, or Copilot daily and want to move from ad-hoc prompts to repeatable, evaluable patterns. Especially valuable for teams in GCC, India, and SEA that are operationalizing prompts as part of internal tools or shared playbooks.',
    whatYoullLearn: [
      'The five principles that separate amateur prompts from professional ones',
      'How to force structured outputs (JSON, tables, schemas) reliably',
      'When chain-of-thought reasoning helps — and when it slows you down',
      'Few-shot patterns that improve consistency across runs',
      'How to evaluate outputs without "vibe-checking" them',
      'Building a prompt library your team will actually reuse',
    ],
    chapters: [
      {
        number: 1,
        title: 'Prompting principles',
        duration: '7 min',
        objectives: [
          'Apply the five core prompting principles to any task',
          'Spot the three habits that produce inconsistent outputs',
        ],
      },
      {
        number: 2,
        title: 'Structured outputs (JSON)',
        duration: '7 min',
        objectives: [
          'Design prompts that return parseable JSON every time',
          'Handle schema drift and validation failures gracefully',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Chain-of-thought reasoning',
        duration: '7 min',
        objectives: [
          'Apply chain-of-thought where it genuinely helps',
          'Avoid the over-reasoning trap that adds latency without accuracy',
        ],
      },
      {
        number: 4,
        title: 'Few-shot patterns',
        duration: '7 min',
        objectives: [
          'Design few-shot examples that generalize, not memorize',
          'Spot when few-shot makes outputs worse, not better',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Evaluating outputs',
        duration: '7 min',
        objectives: [
          'Build a lightweight eval set for any recurring prompt',
          'Move from vibe-checking to repeatable scoring',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Prompt libraries and reuse',
        duration: '6 min',
        objectives: [
          'Design a prompt library structure that scales with the team',
          'Apply versioning and ownership to prompts like code',
        ],
      },
      {
        number: 7,
        title: 'Edge cases and adversarial prompts',
        duration: '7 min',
        objectives: [
          'Identify prompt-injection and jailbreak patterns',
          'Apply defenses that work in production, not just demos',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Making your library stick',
        duration: '7 min',
        objectives: [
          'Pick the owner, ritual, gates, and contribution path your library needs',
          'Run the 4-week rollout plan to lock the pattern on your team',
        ],
      },
    ],
    exerciseCount: 2,
    references: [
      {
        title: 'OpenAI Prompt Engineering Guide',
        source: 'OpenAI',
        url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      },
      {
        title: 'Anthropic Prompt Engineering Documentation',
        source: 'Anthropic',
        url: 'https://docs.anthropic.com/',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'evaluating-ai-output',
      'working-with-copilots',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK — Working with Copilots
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'working-with-copilots',
    title: 'Working with Copilots',
    subtitle:
      'A 50-minute practical guide for professionals already using M365 Copilot, GitHub Copilot, or ChatGPT Enterprise — when to lean in, when to skip it.',

    track: 'foundations',
    level: 'intermediate',
    audience: ['individual-contributor', 'manager'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train'],

    duration: '50 min',
    chapterCount: 7,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'You have the licence. Now — when to use Copilot, when to skip it, and where the data-exposure lines are.',
    whoThisIsFor:
      'Professionals already issued M365 Copilot, GitHub Copilot, or ChatGPT Enterprise who want to move past novelty into reliable, repeatable daily use. Especially useful for managers in GCC, India, and Africa rolling out Copilot to teams where adoption is uneven and security questions are unanswered.',
    whatYoullLearn: [
      'A clear mental model for what Copilot is — and what it isn’t',
      'When Copilot saves you time, and when it costs you more',
      'Workflows for Word, Excel, Outlook, and Teams that hold up',
      'GitHub Copilot for non-developers — where it surprisingly helps',
      'ChatGPT Enterprise — the edge cases your M365 Copilot misses',
      'Security and data-exposure boundaries every Copilot user should know',
    ],
    chapters: [
      {
        number: 1,
        title: 'The Copilot mental model',
        duration: '7 min',
        objectives: [
          'Distinguish Copilots from chatbots and from agents',
          'Recognize three things Copilots reliably do well',
        ],
      },
      {
        number: 2,
        title: 'When to use Copilot vs. just do it yourself',
        duration: '7 min',
        objectives: [
          'Apply the "time-to-decent-draft" test to any task',
          'Avoid the Copilot-overuse trap that slows simple work down',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Office Copilot workflows (Word, Excel, Outlook, Teams)',
        duration: '8 min',
        objectives: [
          'Apply repeatable Copilot patterns across the four core apps',
          'Spot the recurring "Copilot got the wrong file" trap',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'GitHub Copilot for non-developers',
        duration: '7 min',
        objectives: [
          'Use GitHub Copilot for spreadsheets, scripts, and data wrangling',
          'Recognize when you need a developer in the loop',
        ],
      },
      {
        number: 5,
        title: 'ChatGPT Enterprise edge cases',
        duration: '7 min',
        objectives: [
          'Identify tasks ChatGPT Enterprise handles better than M365 Copilot',
          'Pick the right tool when you have access to multiple Copilots',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Security and data-exposure boundaries',
        duration: '7 min',
        objectives: [
          'Classify Copilot data flows: tenant, model, third party',
          'Apply data-exposure rules common across GCC, India, and EU contexts',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Making it stick: your Copilot operating manual',
        duration: '7 min',
        objectives: [
          'Lock in the 5 tasks you will always use Copilot for going forward',
          'Generate your 1-page operating manual and pin it to your workspace',
        ],
      },
    ],
    exerciseCount: 2,
    references: [
      {
        title: 'Microsoft 365 Copilot Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-365-copilot/',
      },
      {
        title: 'GitHub Copilot Documentation',
        source: 'GitHub',
        url: 'https://docs.github.com/en/copilot',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'prompting-mastery',
      'evaluating-ai-output',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK — Evaluating AI Output
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'evaluating-ai-output',
    title: 'Evaluating AI Output',
    subtitle:
      'A 45-minute discipline for professionals reviewing AI-generated work — spotting hallucinations, checking sources, building a verification habit.',

    track: 'foundations',
    level: 'intermediate',
    audience: ['individual-contributor', 'manager'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['train', 'sustain'],

    duration: '45 min',
    chapterCount: 7,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'AI evaluation is harder than it looks. Three hallucination patterns, source-checking habits, and the verification routine you can actually keep.',
    whoThisIsFor:
      'Individual contributors and managers reviewing AI-generated work — their own, their team’s, or a vendor’s. Especially valuable in GCC, India, and Africa where multilingual outputs and regional context make verification harder than the typical English-only examples suggest.',
    whatYoullLearn: [
      'Why AI evaluation looks easy and isn’t',
      'The difference between accurate output and useful output',
      'Three hallucination patterns and how to spot each one',
      'How to evaluate sources and citations the model gives you',
      'How to spot bias in outputs — beyond the obvious cases',
      'A verification habit you can actually sustain past week two',
    ],
    chapters: [
      {
        number: 1,
        title: 'Why AI evaluation is harder than it looks',
        duration: '6 min',
        objectives: [
          'Identify the three reasons AI output feels more reliable than it is',
          'Recognize the "fluent but wrong" trap in your own reviews',
        ],
      },
      {
        number: 2,
        title: 'Accuracy vs. usefulness',
        duration: '6 min',
        objectives: [
          'Distinguish factual accuracy from task usefulness',
          'Apply the right test for each kind of AI output',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Spotting hallucinations in 3 patterns',
        duration: '7 min',
        objectives: [
          'Spot the confident-fabrication, plausible-detail, and stale-fact patterns',
          'Apply targeted checks for each pattern',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Evaluating sources and citations',
        duration: '7 min',
        objectives: [
          'Verify whether a cited source actually says what the model claims',
          'Avoid the fake-DOI and invented-paper traps',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Spotting bias in outputs',
        duration: '6 min',
        objectives: [
          'Identify three subtle bias patterns common in business outputs',
          'Apply a regional-context check for GCC, India, Africa, SEA',
        ],
      },
      {
        number: 6,
        title: 'Building your verification habit',
        duration: '6 min',
        objectives: [
          'Design a 5-minute verification routine you’ll actually keep',
          'Avoid the week-three drop-off in verification discipline',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Capstone: Your verification playbook',
        duration: '7 min',
        objectives: [
          'Draft a 1-page verification playbook for your function',
          'Define the 3 checks you’ll never skip on AI output',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 1-Page Verification Playbook',
    references: [
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'Stanford HAI — Trustworthy AI Research',
        source: 'Stanford Institute for Human-Centered AI',
        url: 'https://hai.stanford.edu/',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
      {
        title: 'MIT Sloan Management Review — AI at Work',
        source: 'MIT Sloan',
        url: 'https://sloanreview.mit.edu/topic/artificial-intelligence/',
      },
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'prompting-mastery',
      'ai-decision-making',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK — AI Decision Making
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-decision-making',
    title: 'AI Decision Making',
    subtitle:
      'A 50-minute brief for managers and senior ICs — using AI as a decision input without quietly handing over the decision.',

    track: 'foundations',
    level: 'advanced',
    audience: ['manager', 'director'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose', 'sustain'],

    duration: '50 min',
    chapterCount: 7,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'AI is a decision input, not the decision. The cognitive-offloading risk, the 80/20 verification rule, and team-level decision norms.',
    whoThisIsFor:
      'Managers, directors, and senior individual contributors who already use AI in their decision workflow and want a disciplined approach to the cognitive risks. Especially valuable for leaders in GCC, India, and Africa where AI-augmented decisions land in contexts the model was rarely trained on.',
    whatYoullLearn: [
      'How to treat AI as a decision input — not a decision maker',
      'The cognitive offloading risk that gets worse the better the model gets',
      'When to override AI confidently — and how to know you’re right to do so',
      'The 80/20 verification rule for AI-augmented decisions',
      'Building team-level decision norms that survive turnover',
      'Scenario planning with AI without losing your own judgment',
    ],
    chapters: [
      {
        number: 1,
        title: 'AI as decision input vs. decision maker',
        duration: '7 min',
        objectives: [
          'Distinguish AI-as-input from AI-as-decider in your own workflow',
          'Identify three decisions that should never be fully delegated to AI',
        ],
      },
      {
        number: 2,
        title: 'The cognitive offloading risk',
        duration: '7 min',
        objectives: [
          'Recognize the cognitive offloading pattern in yourself and your team',
          'Apply two countermeasures from decision-science research',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'When to override AI confidently',
        duration: '7 min',
        objectives: [
          'Identify three signals that your domain judgment beats the model',
          'Avoid the "the model said so" deference trap in regional contexts',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'The 80/20 verification rule',
        duration: '7 min',
        objectives: [
          'Apply the 80/20 rule to verify the right 20% of AI-augmented decisions',
          'Spot the decisions that need 100% verification, not 20%',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Building team-level decision norms',
        duration: '7 min',
        objectives: [
          'Design team norms that survive AI tool churn and turnover',
          'Avoid the "everyone uses AI differently" decision-quality drift',
        ],
      },
      {
        number: 6,
        title: 'Scenario planning with AI',
        duration: '8 min',
        objectives: [
          'Use AI to expand scenario coverage without anchoring on it',
          'Avoid the false-confidence trap of model-generated scenarios',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Capstone: Your AI-augmented decision charter',
        duration: '7 min',
        objectives: [
          'Draft a 1-page AI-augmented decision charter for your team',
          'Define the decisions AI will inform — and the ones it won’t touch',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 1-Page AI Decision Charter',
    references: [
      {
        title: 'Thinking, Fast and Slow',
        source: 'Daniel Kahneman, Farrar, Straus and Giroux',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'MIT Sloan Management Review — AI at Work',
        source: 'MIT Sloan',
        url: 'https://sloanreview.mit.edu/topic/artificial-intelligence/',
      },
      {
        title: 'McKinsey — The State of AI',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights',
      },
    ],
    relatedCourseSlugs: [
      'evaluating-ai-output',
      'ai-strategy-c-suite',
      'ai-governance-risk-boards',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // APPLIED TRACK — Building an HR Copilot (Case Study)
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'building-an-hr-copilot-case-study',
    title: 'Building an HR Copilot — A Case Study',
    subtitle:
      'A 60-minute end-to-end walkthrough — use case selection, Azure OpenAI + Copilot Studio + Dataverse, evaluation, pilot rollout, lessons learned.',

    track: 'applied',
    level: 'intermediate',
    audience: ['technical', 'manager', 'director'],
    functions: ['hr', 'it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft'],
    pairedPhase: ['innovate', 'build'],

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'A real HR onboarding copilot — from use-case selection to pilot rollout — with the architecture, evaluation, and adoption playbook intact.',
    whoThisIsFor:
      'Technical leaders, solution architects, IT managers, and HR-tech sponsors who learn best by walking through a real build. Especially valuable for teams across GCC, India, and Africa scoping their first production copilot on the Microsoft stack and wanting an honest record of what worked and what didn’t.',
    whatYoullLearn: [
      'How a credible HR use case was selected — and what was deliberately not chosen',
      'A Stack Fit Assessment for Azure OpenAI + Copilot Studio + Dataverse',
      'Architecture and grounding decisions, with the tradeoffs named',
      'How the conversation flow was designed for a multilingual workforce',
      'Evaluation and iteration cycles that caught real issues before launch',
      'Pilot rollout sequencing and the adoption playbook past week four',
    ],
    chapters: [
      {
        number: 1,
        title: 'The starting situation and use case selection',
        duration: '7 min',
        objectives: [
          'Apply the impact × feasibility filter to a real HR shortlist',
          'Recognize the 3 use cases the team consciously skipped, and why',
        ],
      },
      {
        number: 2,
        title: 'Stack Fit Assessment — Azure OpenAI, Copilot Studio, Dataverse',
        duration: '8 min',
        objectives: [
          'Apply a Stack Fit Assessment across model, orchestration, and data layers',
          'Spot the integration gotchas that show up only at pilot scale',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Architecture and grounding',
        duration: '8 min',
        objectives: [
          'Design grounding patterns over policy docs and HRIS data',
          'Apply row-level security so the copilot answers only what the user may see',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Building the conversation flow',
        duration: '8 min',
        objectives: [
          'Design topics, fallback to generative answers, and clean human handoff',
          'Avoid the topic-explosion anti-pattern that killed an earlier prototype',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Evaluation and iteration',
        duration: '7 min',
        objectives: [
          'Build an eval set from real HR tickets and policy questions',
          'Apply a weekly iteration cycle that caught two policy hallucinations pre-launch',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Pilot rollout',
        duration: '7 min',
        objectives: [
          'Sequence the rollout across 3 cohorts over 4 weeks',
          'Define the kill criteria the team agreed before launch',
        ],
      },
      {
        number: 7,
        title: 'Adoption playbook',
        duration: '7 min',
        objectives: [
          'Apply the adoption playbook that sustained usage past week 4',
          'Spot the adoption signals that predicted long-term success',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Lessons learned',
        duration: '8 min',
        objectives: [
          'Draft your own Stack Fit Assessment and rollout plan for an HR copilot',
          'Identify the three lessons you’d carry into your next copilot build',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your HR Copilot Build Plan',
    references: [
      {
        title: 'Microsoft Copilot Studio Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/',
      },
      {
        title: 'Azure OpenAI Service Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
      },
      {
        title: 'Dataverse Security Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/power-apps/maker/data-platform/wp-security-cds',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
    ],
    pairedPocs: ['poc-05-hr-onboarding-copilot'],
    relatedCourseSlugs: [
      'building-ai-agents-copilot-studio',
      'ai-for-hr-people-teams',
      'working-with-copilots',
    ],
  },
]
