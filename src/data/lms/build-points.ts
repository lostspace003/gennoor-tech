/**
 * "What you build", set out as points, for the courses that were published before a
 * description could carry points (see src/lib/lms-about.ts).
 *
 * Each entry is the course's own sentence cut into its parts: nothing is added and nothing
 * is left out. `when` is the start of the sentence it was made from. If a course is imported
 * again with a different sentence, its entry here no longer applies and the page shows the
 * new text as it is written. A course whose description has points of its own never reads
 * this file. New courses do not need an entry: write the points in the description.
 */
export interface BuildPoints { when: string; lead?: string; points: string[] }

export const BUILD_POINTS: Record<string, Record<string, BuildPoints>> = {
  'ai-103': {
    'Module 1, Generative AI apps': {
      when: 'a Python chat app on Microsoft Foundry',
      lead: 'A Python chat app on Microsoft Foundry',
      points: ['Choose, deploy and evaluate models', 'Call the Responses API', 'Add code interpreter, web search, file search and function calling', 'Tune the system message', 'Protect the app with guardrails'],
    },
    'Module 2, AI agents': {
      when: 'the app becomes an agent that acts',
      lead: 'The app becomes an agent that acts',
      points: ['Custom tools and an MCP server', 'Foundry IQ knowledge', 'Workflows', 'The Microsoft Agent Framework and a multi-agent team', 'Tracing in Application Insights'],
    },
    'Module 3, Natural language': {
      when: 'text analysis with Azure Language',
      points: ['Text analysis with Azure Language', 'Speech apps with Azure Speech', 'The Language and Speech MCP servers', 'A real-time phone agent with Voice Live', 'Translation with Azure Translator'],
    },
    'Module 4, Visual data': {
      when: 'vision models, image and video generation',
      points: ['Vision models', 'Image and video generation', 'Content Understanding for photos, invoices and calls', 'Knowledge mining over a document archive with Azure AI Search'],
    },
    'Module 5, Capstone': {
      when: 'the agent goes to production as a Foundry hosted agent',
      lead: 'The agent goes to production as a Foundry hosted agent',
      points: ['Its own identity', 'One toolbox for every tool', 'A web page for travelers', 'A GitHub Actions pipeline that builds and deploys every change', 'Traces and a one-step rollback'],
    },
  },
  'ai-500': {
    Design: {
      when: 'stateful agentic loops with checkpoints and resume',
      points: ['Stateful agentic loops with checkpoints and resume', 'Orchestration patterns: hub and spoke, hierarchical, parallel', 'Task decomposition and agent collaboration', 'Agent-to-agent communication with A2A'],
    },
    Build: {
      when: 'production prompting for agents',
      points: ['Production prompting for agents', 'Tool ecosystems with MCP', 'Advanced retrieval with Azure AI Search', 'Agent memory in Azure Cosmos DB', 'CI/CD with GitHub Actions'],
    },
    'Secure and govern': {
      when: 'zero-trust security for agents',
      points: ['Zero-trust security for agents', 'Responsible AI governance', 'Agent lifecycle governance, from first version to retirement'],
    },
    Operate: {
      when: 'observability across agents',
      points: ['Observability across agents', 'Evaluation of whole claims', 'Staying within budget', 'Human approval in the loop', 'Incident response at three forty-seven in the morning'],
    },
  },
  'agent-ops': {
    'Triage, three ways': {
      when: 'first as a prompt agent in the Foundry portal',
      points: ['First as a prompt agent in the Foundry portal', 'Then as Python with the Microsoft Agent Framework, deployed as a hosted agent', 'Run on forty real emails and compared with the portal version'],
    },
    'The Harbor MCP server': {
      when: 'one tool server for invoices and clients',
      lead: 'One tool server for invoices and clients',
      points: ['Run in a container', 'Attached to Foundry agents through a toolbox that asks for approval before anything is written', 'Used again from Claude and Copilot'],
    },
    'Invoice and Collections': {
      when: 'an Invoice agent that turns supplier PDFs into JSON',
      points: ['An Invoice agent that turns supplier PDFs into JSON', 'A threshold in code that sends anything over five hundred dollars to a person', 'A Collections agent on the Claude Agent SDK that drafts every chase email into an approval queue and never sends one'],
    },
    'The Monday Report, then measured and secured': {
      when: 'a hosted report agent run by a Foundry routine',
      points: ['A hosted report agent, run by a Foundry routine, that posts to Teams through a Logic App', 'Foundry evaluations, traces, a cost meter and model routing', 'Agent identities, Key Vault and a prompt shield', 'A poisoned-invoice test that your own agents catch twice', 'A runbook, an approvals table and a switch-off section for the client'],
    },
  },
  'build-real-time-ai-on-microsoft-fabric': {
    'Data foundation': {
      when: 'a workspace and a lakehouse',
      points: ['A workspace and a lakehouse', 'OneLake shortcuts', 'A pipeline that lands five history files', 'Bronze, silver and gold tables built with notebooks'],
    },
    Model: {
      when: 'two models compared in an MLflow experiment',
      points: ['Two models compared in an MLflow experiment', 'The better one registered as a versioned model', 'About 0.84 on held-out orders, against about 0.81 for the simple baseline'],
    },
    Serving: {
      when: 'a real-time endpoint called by a small checkout app',
      points: ['A real-time endpoint called by a small checkout app', 'A nightly batch pipeline that re-scores open orders'],
    },
    Consuming: {
      when: 'an eventstream and eventhouse',
      points: ['An eventstream and eventhouse', 'A live dashboard', 'An Activator alert', 'A Power BI report on a Direct Lake semantic model'],
    },
  },
}

/** The points for one item of one course, when its sentence is still the one they were made from. */
export function buildPointsFor(slug: string, label: string | undefined, text: string): BuildPoints | null {
  const entry = label ? BUILD_POINTS[slug]?.[label] : undefined
  return entry && text.trim().toLowerCase().startsWith(entry.when.toLowerCase()) ? entry : null
}
