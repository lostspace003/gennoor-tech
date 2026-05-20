import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter01: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-architecture',
  title: 'Copilot Studio architecture',
  subtitle: 'Six components, where each runs · three architectural decisions made at the start · the governance touchpoints from day one.',
  slides: [
    // SLIDE 1
    {
      title: 'Copilot Studio architecture',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Copilot Studio is a stack — not a single tool. Six components, each with its own role, hosting model, and governance touchpoint. Understanding the stack decides whether the agent you build today survives at scale tomorrow.</p>`,
      narrationLead:
        "Welcome to Building AI Agents with Copilot Studio. This course is for Power Platform developers, citizen developers, solution architects, and the admins responsible for the Copilot Studio footprint in their organisation. Useful whether you're building your first agent or your fiftieth. Copilot Studio is a stack — not a single tool. Six components, each with its own role, hosting model, and governance touchpoint. Understanding the stack architecture decides whether the agent you build today survives at production scale tomorrow. Three architectural decisions you make at the start of every agent — explicitly or by accident. The governance touchpoints from day one of design, not retrofitted later.",
    },
    // SLIDE 2
    {
      title: 'The six components and where each runs',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The components',
      bodyHtml: `<p>Six components in the Copilot Studio stack. Each runs in a specific Azure or Power Platform service. Each has different governance and cost characteristics. Knowing where each runs is the foundation for everything else.</p>`,
      narrationLead:
        "Six components in the Copilot Studio stack. Each component runs in a specific Azure or Power Platform service. Each has different governance and cost characteristics that compound across your agent estate. Knowing where each component runs is the foundation for every other decision in this course. Map the stack first; build agents second.",
      steps: [
        {
          html: stepCard('compass', 'blue', 'Component 1 — Topics (deterministic flows)',
            "Author-defined conversation flows triggered by user intent. Each topic is a directed graph of nodes — message, question, condition, action. Runs in the Copilot Studio runtime in Power Platform. Deterministic, debuggable, cheap to run."),
          narration:
            "Component one. Topics. Author-defined conversation flows triggered when the agent recognises a user intent. Each topic is a directed graph of nodes — send message, ask question, conditional branch, call an action. Topics run in the Copilot Studio runtime hosted in Power Platform. Deterministic — given the same input, you get the same output. Debuggable — you can trace through the graph in the authoring canvas. Cheap to run — topics are the lowest-cost component per execution. Topics are the right answer for high-volume well-defined intents where you want predictable behaviour. The default starting point for most flows.",
        },
        {
          html: stepCard('sparkles', 'blue', 'Component 2 — Generative answers (RAG-style)',
            "When no topic matches, generative answers retrieves from configured knowledge sources and generates a response. Runs the retrieval-augmented generation against Azure OpenAI. Non-deterministic. Higher cost per call. Right for open-ended Q&A."),
          narration:
            "Component two. Generative answers. When no topic matches the user's input, generative answers retrieves relevant content from configured knowledge sources and generates a response. This is retrieval-augmented generation — RAG — running against Azure OpenAI under the hood. Non-deterministic — the same question can produce slightly different responses. Higher cost per call than topics because it's running a large language model. Right for open-ended question-and-answer scenarios where the question space is too varied to enumerate as topics. Use generative answers as the fallback when topics don't match; use topics for predictable intents.",
        },
        {
          html: stepCard('zap', 'blue', 'Component 3 — Plugins / actions (custom logic)',
            "Calls to custom code or external systems. Power Automate flow, custom connector, Azure Function, or REST API. Auth handled by the connector. Runs outside Copilot Studio runtime; latency and reliability depend on the external system."),
          narration:
            "Component three. Plugins and actions. Calls to custom code or external systems. The action can be a Power Automate flow, a custom connector to a REST API, an Azure Function, or a Microsoft Graph call. Authentication is handled by the connector — using OAuth, API keys, or service principal depending on the target system. The action runs outside the Copilot Studio runtime in whatever service hosts it. Latency and reliability depend on the external system, not on Copilot Studio itself. Chapter three covers actions in depth including the patterns for auth, errors, and rate limits at production scale.",
        },
        {
          html: stepCard('users', 'blue', 'Component 4 — Agents (orchestrated multi-turn)',
            "Higher-level abstraction over topics, generative answers, and actions. Agent holds state across turns, decides which component to invoke. Runs the orchestration in Copilot Studio plus Azure OpenAI. The newest component pattern; chapter four covers."),
          narration:
            "Component four. Agents. The higher-level abstraction over topics, generative answers, and actions. An agent holds state across multiple conversation turns. It decides which component to invoke for each user input — sometimes a topic, sometimes generative answers, sometimes an action chain. The agent orchestration runs partly in Copilot Studio runtime and partly in Azure OpenAI for the decision-making. This is the newest component pattern and the one most actively evolving in Microsoft's roadmap. Chapter four covers agents and agent flows in depth.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Component 5 — Knowledge sources',
            "What generative answers and agents retrieve from. SharePoint, web pages, files, Dataverse, custom data sources via MCP. Configured per agent. Critical security boundary — RLS and access scope determine what each user sees."),
          narration:
            "Component five. Knowledge sources. What generative answers and agents retrieve from when they need information. SharePoint sites and document libraries. Indexed web pages. Uploaded files. Dataverse tables. Custom data sources exposed via Model Context Protocol — chapter five covers MCP. Configured per agent. Critical security boundary — row-level security in Dataverse and access scope in SharePoint determine what each user sees when the agent retrieves on their behalf. Get this configuration wrong and the agent leaks data across users. Get it right and the agent respects existing access controls. Chapter six covers Dataverse grounding specifically including the RLS patterns.",
        },
        {
          html: stepCard('shield', 'blue', 'Component 6 — Environments and governance plane',
            "Solutions, environments, DLP policies, tenant settings — the governance plane Copilot Studio runs inside. Decisions here determine what makes it to production. Power Platform admin centre. Chapters seven and eight cover."),
          narration:
            "Component six. Environments and the governance plane. Solutions for packaging your agents. Environments for separating dev, test, and prod. Data Loss Prevention policies controlling which connectors can be used together. Tenant settings for what citizen developers can build. This is the Power Platform admin centre — the governance plane Copilot Studio runs inside. Decisions made here determine what actually makes it to production versus what gets blocked. Chapter seven covers deployment and environments; chapter eight covers governance and monitoring. Treat the governance plane as part of the architecture, not as an afterthought.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three architectural decisions you make at the start',
      iconKey: 'flag',
      eyebrow: 'Lesson 2 · The decisions',
      bodyHtml: `<p>Three architectural decisions you make at the start of every agent — explicitly or by accident. Explicit decisions lead to agents that scale. Accidental decisions lead to agents that work in demo and break in production.</p>`,
      narrationLead:
        "Three architectural decisions you make at the start of every Copilot Studio agent — either explicitly or by accident. Explicit decisions, documented and reviewed, lead to agents that scale and survive maintenance. Accidental decisions, made implicitly by following defaults or vendor demos, lead to agents that work in the demo and break in production. Make all three decisions explicitly. Document them. Review them with the solution architect on the team. Three minutes of decision discipline upfront saves weeks of rework later.",
      steps: [
        {
          html: stepCard('flag', 'amber', 'Decision 1 — Topics, generative, agent — for this scope?',
            "For this specific agent\'s scope — is the bulk of interaction predictable intents (use topics + small generative fallback) or open-ended exploration (use agent + topics for the few deterministic flows)? Choosing wrong locks you into rework."),
          narration:
            "Decision one. Topics-first, generative-first, or agent-first for this specific scope? Different agents need different defaults. For a customer-facing FAQ agent with a known intent set — topics-first with a small generative answers fallback for the long tail. For an open-ended internal research agent — agent-first with topics for the few deterministic flows like sign-in or escalation. For a transactional agent that takes actions — topics for the action flows with generative answers for the supporting Q&A. Choosing wrong locks you into significant rework. The agent built topics-first that turns out to need open-ended capability ends up with topic explosion — hundreds of topics nobody can maintain. The agent built agent-first that turns out to be transactional ends up unpredictable and expensive. Decide deliberately based on the actual scope.",
        },
        {
          html: stepCard('flag', 'amber', 'Decision 2 — Knowledge source security model',
            "Will the agent retrieve user-specific data (RLS through Dataverse, user-context through Graph) or shared organisational data (everyone sees the same content)? The two require different architecture from chapter one — retrofitting is painful."),
          narration:
            "Decision two. Knowledge source security model. Will the agent retrieve user-specific data — where each user sees different content based on their permissions, requiring row-level security in Dataverse and user-context in Microsoft Graph calls — or shared organisational data — where every user sees the same content, simpler architecture? The two require different architecture from chapter one of the agent's design. Retrofitting user-specific security onto an agent originally designed for shared content is painful and often requires rebuilding. Decide upfront. If you're not sure, lean toward the user-specific model — it's harder to add later than to scope down at the start.",
        },
        {
          html: stepCard('flag', 'amber', 'Decision 3 — Plugin/action architecture for scale',
            "If the agent will call external systems — direct connector per system, or shared service layer in front? Direct is faster to start; shared service is essential past 5–10 actions. Make the call before you have three direct connectors that need to become shared service."),
          narration:
            "Decision three. Plugin and action architecture for scale. If the agent calls external systems — and most production agents do — direct connector per external system, or shared service layer in front of the systems with the agent calling the service? Direct connectors are faster to start and right for the first two or three integrations. A shared service layer becomes essential past five to ten actions because you start needing common patterns — consistent auth, consistent error handling, consistent observability, consistent rate-limiting. Make the architectural call before you have three direct connectors that need to become a shared service layer through a painful retrofit. The right decision depends on the projected scale; document the projection and the decision.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pattern across the three decisions',
        "All three are about choosing the right pattern for the actual scope, not the default the vendor demo showed. The vendor demo shows what\'s impressive; your production agent needs what fits your scope. Decide explicitly."),
      calloutNarration:
        "The pattern across the three architectural decisions. All three are about choosing the right pattern for your actual agent scope rather than accepting the default the vendor demo showed. The vendor demo shows what's impressive in a short timeframe — usually generative answers because it's the most visibly impressive component. Your production agent needs what fits your specific scope — which may not be what the demo led with. Decide explicitly. Three minutes of decision discipline at the start saves the rework cycles that follow when you discover the demo defaults don't match your scope at the production scale.",
    },
    // SLIDE 4
    {
      title: 'Governance touchpoints from day one',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The governance',
      bodyHtml: `<p>Three governance touchpoints you address from chapter one of agent design — not as a retrofit before deployment. Doing them early is the difference between agents that pass review and agents that get blocked at the production gate.</p>`,
      narrationLead:
        "Three governance touchpoints you address from chapter one of agent design — not as a retrofit during the deployment phase when you discover the production gate has requirements you didn't plan for. Doing the governance work early is the difference between agents that pass review smoothly and agents that get blocked at the production gate, often requiring weeks of remediation. Three touchpoints. Address each one in the agent design document. Chapter eight covers governance in depth; this is the awareness upfront.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Touchpoint 1 — DLP policies on the connectors used',
            "Which connectors does the agent use? Are they all in the same DLP classification (business vs non-business)? If the agent mixes classifications, Power Platform blocks deployment. Check before you build, not after."),
          narration:
            "Touchpoint one. Data Loss Prevention policies on the connectors the agent uses. List the connectors the agent will use during your design phase. Check which DLP classification each is in — business data, non-business data, blocked. If the agent mixes business and non-business connector classifications, Power Platform DLP blocks deployment of the agent's flows. Check the connector classifications before you build the agent, not after the agent is built and ready for deployment review. Many production agent projects discover this in the deployment phase and need to redesign the action architecture to avoid the DLP block. The check takes five minutes upfront. Worth doing.",
        },
        {
          html: stepCard('shield', 'green', 'Touchpoint 2 — Authentication model documented',
            "How does the agent authenticate users? How do connectors authenticate to external systems? Document both before building. Reviewers will ask; having the answer in design avoids the deployment delay."),
          narration:
            "Touchpoint two. Authentication model documented in the design. How does the agent authenticate end users — typically Entra ID single sign-on through the channel — and how do the connectors authenticate to external systems — typically OAuth user context for user-specific calls, service principal for shared calls. Document both before building. Reviewers in the governance committee will ask about both. Having the answer ready in the design document avoids the deployment delay where the reviewer asks the question, you go back and figure out the answer, and you come back to the committee at the next meeting two weeks later. The documentation is one paragraph. Write it upfront.",
        },
        {
          html: stepCard('shield', 'green', 'Touchpoint 3 — Sensitivity labels on knowledge sources',
            "What sensitivity labels are on the knowledge sources the agent retrieves from? Confidential or Highly Confidential labels block generative answers unless explicit allow is configured. Verify the agent only retrieves from sources it\'s licensed to use."),
          narration:
            "Touchpoint three. Sensitivity labels on the knowledge sources the agent retrieves from. Microsoft Purview sensitivity labels on SharePoint sites, Dataverse tables, or files — Confidential or Highly Confidential labels block generative answers from using them unless explicit allow is configured by your tenant admin. Verify the agent only retrieves from sources it's actually licensed to use by the sensitivity label policy. This check is part of the design review now in most enterprises because data leakage through agent retrieval has become a recognised risk pattern. Knowing the sensitivity labels on your sources upfront and confirming the agent's licence to use them is part of the agent design, not a separate compliance step.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter two — topic design vs generative answers.</p>`,
      narrationLead:
        "Three anchors before chapter two — topic design versus generative answers, when to use which.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Copilot Studio is a stack of six components',
            "Topics (deterministic flows) · generative answers (RAG fallback) · plugins/actions (custom logic) · agents (orchestrated multi-turn) · knowledge sources · environments and governance plane. Each runs in a different service with different cost and governance characteristics."),
          narration:
            "One. Copilot Studio is a stack of six components, not a single tool. Topics for deterministic flows running cheap in the Copilot Studio runtime. Generative answers for RAG-style fallback running against Azure OpenAI at higher cost. Plugins and actions for custom logic and external systems with auth handled per connector. Agents as the orchestration layer over the other components, holding state across turns. Knowledge sources defining what generative answers and agents retrieve from with critical security boundaries. Environments and the governance plane in Power Platform admin centre determining what reaches production. Each component runs in a different service with different cost and governance characteristics. Map the stack before building.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three architectural decisions explicitly',
            "Topics/generative/agent first for the scope · knowledge source security model (user-specific vs shared) · plugin architecture (direct vs shared service). All three made by accident lead to demo-only agents that break in production."),
          narration:
            "Two. Three architectural decisions made explicitly at the start of every agent. Topics-first, generative-first, or agent-first for the actual scope of this agent — not the vendor demo default. Knowledge source security model — user-specific data with RLS and user-context Graph, or shared organisational data — retrofitting later is painful. Plugin and action architecture for scale — direct connectors for the first two or three, shared service layer past five to ten — make the call before you have three direct connectors that need painful retrofit. All three made explicitly with documentation lead to agents that scale; all three made by accident lead to demo-only agents that break in production.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three governance touchpoints from day one',
            "DLP connector classification check · authentication model documented · sensitivity labels on knowledge sources verified. Doing them in design is the difference between smooth deployment and blocked-at-the-gate."),
          narration:
            "Three. Three governance touchpoints addressed in the agent design phase. Data Loss Prevention connector classification check — list the connectors, verify they're all in the same DLP classification, avoid the deployment block. Authentication model documented for end users via Entra and for connectors via OAuth or service principal — answer reviewer questions in the design document, not in the committee meeting. Sensitivity labels on knowledge sources verified — Confidential and Highly Confidential labels block generative answers retrieval unless explicit allow, confirm before designing. Doing the governance work in design is the difference between smooth deployment and blocked-at-the-gate with weeks of remediation.",
        },
      ],
      narrationTrail:
        "Chapter two — topic design versus generative answers. When to pick each, and the topic-explosion anti-pattern most teams hit by their twentieth topic. See you there.",
    },
  ],
}
