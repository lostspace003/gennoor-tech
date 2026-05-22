import type { Course } from '../types'

// Builder track — expanded catalog.
// Six courses for technical practitioners: adoption playbooks, prompt engineering,
// RAG, Azure AI Foundry, open-source LLMs, and LLMOps.

export const builderExpanded: Course[] = [
  // m365-copilot-adoption and prompting-mastery moved to their canonical
  // entries (courses.ts and foundations-expanded.ts respectively) to avoid
  // duplicate slugs in the catalog after the May 2026 slug alignment.
  /* DUPLICATE-REMOVED-START
  {
    slug: 'm365-copilot-adoption',
    title: 'Microsoft 365 Copilot Adoption Playbook',
    subtitle:
      'From license assignment to org-wide habit — a 45-minute operator’s playbook for IT leaders and change managers running real Copilot rollouts.',

    track: 'builder',
    level: 'foundational',
    audience: ['manager', 'director', 'technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft'],
    pairedPhase: ['train', 'sustain'],

    duration: '45 min',
    chapterCount: 7,
    format: ['video', 'hands-on', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Most Copilot rollouts stall at week six. This is the playbook that gets you to month six with usage still climbing.',
    whoThisIsFor:
      'IT leaders, M365 admins, change managers, and adoption leads accountable for Microsoft 365 Copilot rollouts. Especially valuable for teams that have purchased licenses and now need a credible plan to convert those seats into measurable productivity — without the spray-and-pray training videos that quietly fail by quarter end.',
    whatYoullLearn: [
      'Licensing strategy — who gets seats first, and how to defend that list',
      'Persona-based prompt libraries that survive the demo and reach daily use',
      'A 4-week pilot framework that produces evidence, not anecdotes',
      'Adoption metrics that distinguish active use from license waste',
      'Scaling patterns — from 50-seat pilot to 5,000-seat rollout',
      'The seven adoption traps that kill Copilot programs (and how to avoid each)',
    ],
    chapters: [
      {
        number: 1,
        title: 'Licensing strategy and persona mapping',
        duration: '7 min',
        objectives: [
          'Segment your workforce into 4 Copilot personas with measurable value hypotheses',
          'Build a license-allocation model that prioritizes high-leverage roles first',
        ],
      },
      {
        number: 2,
        title: 'Persona-based prompt libraries',
        duration: '7 min',
        objectives: [
          'Author role-specific prompt packs for Outlook, Teams, Word, and Excel',
          'Maintain prompt libraries through SharePoint or Viva Engage so they stay alive',
        ],
        hasExercise: true,
      },
      {
        number: 3,
        title: 'Pilot design — the 4-week framework',
        duration: '7 min',
        objectives: [
          'Scope a credible 4-week pilot with weekly checkpoints and exit criteria',
          'Pre-commit success and failure thresholds before the pilot starts',
        ],
        hasQuiz: true,
      },
      {
        number: 4,
        title: 'Adoption metrics dashboard',
        duration: '7 min',
        objectives: [
          'Build a dashboard using Microsoft 365 Copilot usage reports and Viva Insights',
          'Distinguish active adoption from passive license consumption',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Scaling org-wide',
        duration: '6 min',
        objectives: [
          'Move from pilot to phased rollout without losing the early-adopter signal',
          'Design champion networks that survive after IT steps back',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Common adoption traps and how to avoid them',
        duration: '6 min',
        objectives: [
          'Recognize the 7 failure patterns that quietly kill Copilot rollouts',
          'Apply concrete countermeasures for each before they take hold',
        ],
        hasQuiz: true,
      },
      {
        number: 7,
        title: 'Capstone: Your 90-day Copilot adoption plan',
        duration: '5 min',
        objectives: [
          'Draft a 90-day adoption plan with named owners and weekly metrics',
          'Define the board-ready narrative you’ll present at day 90',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 90-Day Copilot Adoption Plan',
    references: [
      {
        title: 'Microsoft 365 Copilot Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-365-copilot/',
      },
      {
        title: 'Microsoft 365 Copilot Adoption Hub',
        source: 'Microsoft Adoption',
        url: 'https://adoption.microsoft.com/en-us/copilot/',
      },
      {
        title: 'Microsoft Work Trend Index — Frontier Firms',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/worklab/work-trend-index',
      },
      {
        title: 'Viva Insights — Measuring Copilot Impact',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/viva/insights/',
      },
    ],
    pairedPocs: ['poc-17-microsoft-365-copilot-rollout'],
    relatedCourseSlugs: [
      'building-ai-agents-copilot-studio',
      'ai-foundations-for-everyone',
      'prompt-engineering-for-practitioners',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // BUILDER TRACK — Prompt Engineering for Practitioners
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'prompting-mastery',
    title: 'Prompt Engineering for Practitioners',
    subtitle:
      'A 60-minute hands-on course for developers and senior analysts — structured outputs, tool use, evaluation, and prompt-as-code.',

    track: 'builder',
    level: 'intermediate',
    audience: ['technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['innovate', 'build'],

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'hands-on', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Prompt engineering past the cute tricks — schema enforcement, tool use, evaluation harnesses, and prompts versioned like code.',
    whoThisIsFor:
      'Developers, ML engineers, senior data analysts, and applied scientists building LLM-powered features. Especially useful for engineers shipping prompts into production who need them to be testable, versionable, and reliable across model upgrades — not just clever in a notebook.',
    whatYoullLearn: [
      'Prompting principles that survive model upgrades and provider switches',
      'Structured outputs with JSON schemas and schema-enforced decoding',
      'Function calling and tool use across OpenAI, Anthropic, and open models',
      'Chain-of-thought, ReAct, and reasoning-elicitation patterns that actually help',
      'Few-shot vs zero-shot tradeoffs — and when each is the wrong choice',
      'Offline and online prompt evaluation, plus prompt-as-code workflows',
    ],
    chapters: [
      {
        number: 1,
        title: 'Prompting principles',
        duration: '7 min',
        objectives: [
          'Apply the six prompting principles that generalize across model families',
          'Diagnose why a prompt works on one model and fails on another',
        ],
      },
      {
        number: 2,
        title: 'Structured outputs',
        duration: '8 min',
        objectives: [
          'Specify JSON schemas the model is forced to honor (OpenAI Structured Outputs, Anthropic tool schemas)',
          'Recover gracefully when constrained decoding still drifts',
        ],
        hasExercise: true,
      },
      {
        number: 3,
        title: 'Function calling and tool use',
        duration: '8 min',
        objectives: [
          'Design tool definitions that the model picks correctly under ambiguity',
          'Handle multi-tool orchestration, retries, and tool-call failures',
        ],
        hasQuiz: true,
      },
      {
        number: 4,
        title: 'Chain-of-thought patterns',
        duration: '7 min',
        objectives: [
          'Use explicit reasoning, ReAct, and scratchpad patterns where they help',
          'Recognize when chain-of-thought hurts accuracy or inflates cost',
        ],
      },
      {
        number: 5,
        title: 'Few-shot vs zero-shot',
        duration: '7 min',
        objectives: [
          'Choose between zero-shot, few-shot, and dynamic example retrieval',
          'Avoid the few-shot leakage and overfit patterns',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Prompt evaluation — offline and online',
        duration: '8 min',
        objectives: [
          'Build a regression-style eval suite with golden cases and LLM-as-judge',
          'Wire online evals (sampled, human-in-loop) into your production traffic',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Prompt versioning and prompt-as-code',
        duration: '8 min',
        objectives: [
          'Version prompts alongside application code with diffable templates',
          'Roll prompts safely with canary releases and rollback hooks',
        ],
        hasQuiz: true,
      },
      {
        number: 8,
        title: 'Capstone: Ship a production-grade prompt pipeline',
        duration: '7 min',
        objectives: [
          'Design a versioned, evaluated, schema-enforced prompt for a real use case',
          'Document the eval, rollback, and observability plan that goes with it',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Production-Grade Prompt Pipeline',
    references: [
      {
        title: 'OpenAI Prompt Engineering Guide',
        source: 'OpenAI',
        url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      },
      {
        title: 'Anthropic Prompt Engineering Documentation',
        source: 'Anthropic',
        url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering',
      },
      {
        title: 'Azure OpenAI Service — Prompt Engineering Techniques',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
    ],
    relatedCourseSlugs: [
      'rag-architectures-foundations',
      'building-ai-agents-copilot-studio',
      'mlops-for-llms',
    ],
  },
  DUPLICATE-REMOVED-END */

  // ────────────────────────────────────────────────────────────────────
  // BUILDER TRACK — RAG Architectures Foundations
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'rag-architectures-foundations',
    title: 'RAG Architectures — Foundations',
    subtitle:
      'A 60-minute engineer’s tour of retrieval-augmented generation — embeddings, vector stores, hybrid search, re-ranking, and the failure modes nobody puts in the slides.',

    track: 'builder',
    level: 'intermediate',
    audience: ['technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'open-source', 'stack-agnostic'],
    pairedPhase: ['innovate', 'build'],

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'hands-on', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'RAG looks simple in the diagram and brutal in production. This is the course that gets you past the second demo.',
    whoThisIsFor:
      'Backend engineers, ML engineers, and applied scientists building retrieval-augmented systems. Especially valuable for engineers shipping their first production RAG system — or inheriting a flaky one and trying to figure out why retrieval quality looks great on the slide deck and terrible on real user queries.',
    whatYoullLearn: [
      'When RAG is the right pattern — and the three cases where it isn’t',
      'How embeddings actually work, and why “more tokens” isn’t always better',
      'Vector stores compared — pgvector, Pinecone, Azure AI Search, Weaviate',
      'Hybrid search done right: BM25 + vectors + semantic ranking',
      'Re-ranking strategies (cross-encoders, LLM rerankers, hybrid) and their cost curves',
      'Evaluation — retrieval quality vs answer quality, and how to measure both',
    ],
    chapters: [
      {
        number: 1,
        title: 'Why RAG — and when not to use it',
        duration: '7 min',
        objectives: [
          'Distinguish RAG from long-context, fine-tuning, and tool-use approaches',
          'Recognize the 3 use cases where RAG is the wrong architecture',
        ],
      },
      {
        number: 2,
        title: 'Embeddings explained',
        duration: '8 min',
        objectives: [
          'Build a working mental model of dense vector representations',
          'Pick embedding models with the right context length, dimension, and language coverage',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Vector stores',
        duration: '8 min',
        objectives: [
          'Compare pgvector, Pinecone, Azure AI Search, and Weaviate on latency, cost, and ops',
          'Choose the right store for your scale and operational footprint',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Hybrid search',
        duration: '8 min',
        objectives: [
          'Combine BM25 keyword search with vector search and semantic ranking',
          'Tune fusion strategies (RRF, weighted) for your query distribution',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Re-ranking strategies',
        duration: '7 min',
        objectives: [
          'Apply cross-encoder and LLM-based rerankers where they earn their cost',
          'Decide when re-ranking adds quality vs only adds latency',
        ],
      },
      {
        number: 6,
        title: 'Evaluation — retrieval and answer quality',
        duration: '8 min',
        objectives: [
          'Measure retrieval quality with hit rate, MRR, and recall@k',
          'Measure answer quality with groundedness, faithfulness, and answer relevance',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Common RAG failures and fixes',
        duration: '7 min',
        objectives: [
          'Diagnose the 6 most common RAG failure modes from query traces',
          'Apply targeted fixes — chunking, query rewriting, metadata filters',
        ],
        hasQuiz: true,
      },
      {
        number: 8,
        title: 'Capstone: Ship an evaluated RAG pipeline',
        duration: '7 min',
        objectives: [
          'Design an end-to-end RAG pipeline with hybrid retrieval and re-ranking',
          'Document the eval harness and acceptance criteria for production cutover',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Evaluated RAG Pipeline',
    references: [
      {
        title: 'Azure AI Search Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/search/',
      },
      {
        title: 'Pinecone Learning Hub — RAG Patterns',
        source: 'Pinecone',
        url: 'https://www.pinecone.io/learn/',
      },
      {
        title: 'Azure AI Foundry — RAG Reference Architectures',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-studio/',
      },
      {
        title: 'Hugging Face — Embedding Models',
        source: 'Hugging Face',
        url: 'https://huggingface.co/docs',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
    ],
    pairedPocs: ['poc-03-enterprise-rag-knowledge-search', 'poc-04-multimodal-rag-banking'],
    relatedCourseSlugs: [
      'prompt-engineering-for-practitioners',
      'azure-ai-foundry-essentials',
      'mlops-for-llms',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // BUILDER TRACK — Azure AI Foundry Essentials
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'azure-ai-foundry-essentials',
    title: 'Azure AI Foundry Essentials',
    subtitle:
      'A 55-minute builder’s tour of Azure AI Foundry — projects, model catalog, evaluation, deployment, and the production-readiness checklist.',

    track: 'builder',
    level: 'intermediate',
    audience: ['technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft'],
    pairedPhase: ['innovate', 'build'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'hands-on', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'For Azure builders moving from POC to production — Foundry projects, evaluations, deployments, and the cost dial that actually matters.',
    whoThisIsFor:
      'Azure-native engineers, ML platform teams, and solution architects taking LLM workloads from prototype to production on Microsoft’s stack. Especially useful if you’ve been gluing Azure OpenAI, AI Search, and a handful of Functions together and want the cleaner Foundry-centric pattern that scales without becoming an ops mess.',
    whatYoullLearn: [
      'Azure AI Foundry architecture — projects, hubs, connections, and what runs where',
      'Navigating the model catalog: Azure OpenAI, Mistral, Llama, Phi, and partner models',
      'Project setup, managed identity, and Key Vault integration done right',
      'Building evaluation harnesses inside Foundry, including LLM-as-judge',
      'Deployment options — serverless, managed compute, and batch',
      'Cost monitoring, quotas, and the production-readiness checklist',
    ],
    chapters: [
      {
        number: 1,
        title: 'Foundry architecture',
        duration: '7 min',
        objectives: [
          'Map Foundry hubs, projects, and connections to your existing Azure resource model',
          'Identify which workloads belong in Foundry vs raw Azure OpenAI',
        ],
      },
      {
        number: 2,
        title: 'Model catalog navigation',
        duration: '7 min',
        objectives: [
          'Compare Azure OpenAI, open-weight, and partner models on latency, cost, and licensing',
          'Pick the right deployment type (serverless API vs managed compute) per model',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Project setup and identity',
        duration: '7 min',
        objectives: [
          'Configure managed identity, RBAC, and Key Vault-backed secrets for a Foundry project',
          'Wire private endpoints and VNet integration for regulated workloads',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Evaluation harness',
        duration: '8 min',
        objectives: [
          'Run built-in Foundry evaluators for groundedness, relevance, and safety',
          'Extend with custom LLM-as-judge and code-based evaluators',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Deployment options — serverless, managed, batch',
        duration: '7 min',
        objectives: [
          'Choose between Provisioned Throughput Units, serverless, and managed online endpoints',
          'Pick batch endpoints when latency doesn’t matter and cost does',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Cost monitoring',
        duration: '7 min',
        objectives: [
          'Set up Azure Monitor and Cost Management views for Foundry workloads',
          'Catch runaway token spend before the month-end invoice does',
        ],
      },
      {
        number: 7,
        title: 'Production readiness checklist',
        duration: '6 min',
        objectives: [
          'Walk a 20-point checklist covering security, evals, observability, and rollback',
          'Identify the 3 items that disqualify a workload from go-live',
        ],
        hasQuiz: true,
      },
      {
        number: 8,
        title: 'Capstone: Promote a Foundry project to production',
        duration: '6 min',
        objectives: [
          'Document the deployment, eval, and cost plan for a real Foundry workload',
          'Produce the production-readiness sign-off your platform team will accept',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Foundry Production Sign-Off Pack',
    references: [
      {
        title: 'Azure AI Foundry Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-studio/',
      },
      {
        title: 'Azure OpenAI Service Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
      },
      {
        title: 'Azure AI Search Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/search/',
      },
      {
        title: 'Microsoft Learn — AI Services Overview',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/',
      },
    ],
    relatedCourseSlugs: [
      'rag-architectures-foundations',
      'building-ai-agents-copilot-studio',
      'mlops-for-llms',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // BUILDER TRACK — Open-Source LLMs for Enterprise
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'open-source-llms-for-enterprise',
    title: 'Open-Source LLMs for Enterprise',
    subtitle:
      'A 65-minute decision guide — Llama, Mistral, Phi, Qwen; Ollama, vLLM, and Azure ML; fine-tuning, cost, and sovereign deployment patterns.',

    track: 'builder',
    level: 'intermediate',
    audience: ['technical', 'director'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['open-source'],
    pairedPhase: ['innovate', 'build'],

    duration: '65 min',
    chapterCount: 8,
    format: ['video', 'hands-on', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Open-source isn’t free — it’s a different cost curve. This is the course that helps you read that curve honestly.',
    whoThisIsFor:
      'Senior engineers, ML platform leads, and tech directors evaluating or operating open-source LLMs at enterprise scale. Especially relevant for teams with sovereignty, residency, or per-token cost pressure — and for regulated sectors (BFSI, healthcare, government) where data simply cannot leave a controlled boundary.',
    whatYoullLearn: [
      'Why open-source — and the honest cases where a hosted API still wins',
      'Model selection across Llama, Mistral, Phi, and Qwen families',
      'Self-hosting paths: Ollama, vLLM, TGI, Azure ML private endpoints',
      'Fine-tuning approaches — LoRA, QLoRA, full fine-tunes, and when each fits',
      'Cost and performance tradeoffs at realistic enterprise concurrency',
      'Air-gapped and sovereign deployment patterns for regulated environments',
    ],
    chapters: [
      {
        number: 1,
        title: 'Why open-source — and when not',
        duration: '8 min',
        objectives: [
          'Frame the open-source decision around sovereignty, cost curve, and roadmap risk',
          'Recognize the 3 cases where a hosted API is still the right answer',
        ],
      },
      {
        number: 2,
        title: 'Model selection — Llama, Mistral, Phi, Qwen',
        duration: '9 min',
        objectives: [
          'Compare model families on capability, licensing, and multilingual coverage',
          'Match model size to task — and resist the “bigger is better” default',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Self-hosting — Ollama, vLLM, TGI, Azure ML',
        duration: '9 min',
        objectives: [
          'Pick the right serving stack for your latency, throughput, and ops profile',
          'Configure vLLM and TGI for production concurrency, not laptop demos',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Fine-tuning approaches',
        duration: '9 min',
        objectives: [
          'Choose between LoRA, QLoRA, and full fine-tuning based on data and goal',
          'Avoid fine-tuning for problems that retrieval or prompting would solve cheaper',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Cost and performance tradeoffs',
        duration: '8 min',
        objectives: [
          'Model the total cost of ownership — GPU hours, ops, evals, and incident load',
          'Compare per-token economics against hosted APIs at your real concurrency',
        ],
      },
      {
        number: 6,
        title: 'Air-gapped and sovereign deployment',
        duration: '8 min',
        objectives: [
          'Architect deployments that satisfy data-residency and air-gap requirements',
          'Apply the patterns that actually pass regulator and CISO review',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Operational considerations',
        duration: '7 min',
        objectives: [
          'Plan for model upgrades, security patches, and quantization rollouts',
          'Design observability across GPU, model, and request layers',
        ],
        hasQuiz: true,
      },
      {
        number: 8,
        title: 'Capstone: Your open-source LLM decision pack',
        duration: '7 min',
        objectives: [
          'Document the model, serving, and fine-tuning decision for a real workload',
          'Produce the TCO and sovereignty case your steering committee will accept',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Open-Source LLM Decision Pack',
    references: [
      {
        title: 'Meta Llama — Models and Licensing',
        source: 'Meta',
        url: 'https://www.llama.com/',
      },
      {
        title: 'Mistral AI Documentation',
        source: 'Mistral AI',
        url: 'https://docs.mistral.ai/',
      },
      {
        title: 'vLLM Documentation',
        source: 'vLLM Project',
        url: 'https://docs.vllm.ai/',
      },
      {
        title: 'Ollama — Local Model Runtime',
        source: 'Ollama',
        url: 'https://ollama.com/',
      },
      {
        title: 'Hugging Face Documentation',
        source: 'Hugging Face',
        url: 'https://huggingface.co/docs',
      },
    ],
    relatedCourseSlugs: [
      'rag-architectures-foundations',
      'mlops-for-llms',
      'azure-ai-foundry-essentials',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // BUILDER TRACK — MLOps for LLMs
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'mlops-for-llms',
    title: 'MLOps for LLMs',
    subtitle:
      'A 65-minute advanced course for ML and platform engineers — evaluation in production, drift, observability, A/B testing, and incident response.',

    track: 'builder',
    level: 'advanced',
    audience: ['technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'open-source', 'stack-agnostic'],
    pairedPhase: ['build', 'sustain'],

    duration: '65 min',
    chapterCount: 9,
    format: ['video', 'hands-on', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'LLMs in production don’t fail like classical ML. This is the playbook for the on-call engineer who learns that the hard way.',
    whoThisIsFor:
      'ML engineers, platform engineers, and SREs operating LLM systems in production. Especially valuable for teams that have shipped at least one LLM feature and are now staring at the second one — knowing that ad-hoc evals, missing traces, and untracked prompt changes will not survive the next outage or the next model upgrade.',
    whatYoullLearn: [
      'How LLMOps differs from classical MLOps — and the practices that still carry over',
      'Production evaluation patterns: online evals, sampling, and human-in-loop loops',
      'Drift detection for LLM systems — input, output, and behavioral drift',
      'Cost optimization patterns that survive past the first quarter',
      'Versioning prompts, models, and evals together — and rolling them safely',
      'Observability with OpenTelemetry, MLflow, and LangSmith — and incident response when something breaks at 3am',
    ],
    chapters: [
      {
        number: 1,
        title: 'LLMOps vs MLOps',
        duration: '7 min',
        objectives: [
          'Identify what changes when the model is generative, non-deterministic, and third-party',
          'Map classical MLOps practices that still apply (and the ones that don’t)',
        ],
      },
      {
        number: 2,
        title: 'Model evaluation in production',
        duration: '8 min',
        objectives: [
          'Run online evals on sampled production traffic without leaking PII',
          'Combine LLM-as-judge with human review on the cases that matter most',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Drift detection for LLM systems',
        duration: '8 min',
        objectives: [
          'Detect input distribution shift, output drift, and behavioral drift separately',
          'Set actionable alert thresholds — not the cosmetic dashboards',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Cost optimization patterns',
        duration: '7 min',
        objectives: [
          'Apply prompt compression, caching, and model-routing to control token spend',
          'Decide when a smaller model + retrieval beats a larger model end-to-end',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Versioning prompts and models together',
        duration: '7 min',
        objectives: [
          'Treat prompts, model versions, and eval suites as one versioned artifact',
          'Roll changes with canaries, shadowing, and one-command rollback',
        ],
        hasExercise: true,
      },
      {
        number: 6,
        title: 'Observability with traces',
        duration: '8 min',
        objectives: [
          'Instrument LLM apps with OpenTelemetry GenAI semantic conventions',
          'Wire MLflow or LangSmith for trace search, replay, and eval linking',
        ],
        hasQuiz: true,
      },
      {
        number: 7,
        title: 'A/B testing LLM systems',
        duration: '6 min',
        objectives: [
          'Design A/B tests that account for non-determinism and slow user feedback',
          'Avoid the false-positive trap of judging on a single offline metric',
        ],
      },
      {
        number: 8,
        title: 'Incident response for LLM failures',
        duration: '7 min',
        objectives: [
          'Classify LLM incidents (regression, drift, abuse, vendor outage) and triage each',
          'Run a clean post-mortem that produces durable eval cases, not just promises',
        ],
      },
      {
        number: 9,
        title: 'Capstone: Your LLMOps runbook',
        duration: '7 min',
        objectives: [
          'Author an LLMOps runbook covering evals, drift, cost, rollouts, and incidents',
          'Define the on-call response pattern your platform team will operate against',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your LLMOps Runbook',
    references: [
      {
        title: 'MLflow Documentation',
        source: 'MLflow Project',
        url: 'https://mlflow.org/docs/latest/',
      },
      {
        title: 'OpenTelemetry — GenAI Semantic Conventions',
        source: 'OpenTelemetry',
        url: 'https://opentelemetry.io/',
      },
      {
        title: 'Azure AI Foundry — Evaluations and Monitoring',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-studio/',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
    ],
    relatedCourseSlugs: [
      'rag-architectures-foundations',
      'prompt-engineering-for-practitioners',
      'open-source-llms-for-enterprise',
    ],
  },
]
