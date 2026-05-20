import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter05: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-knowledge-mcp-dataverse',
  title: 'Knowledge sources, MCP, and Dataverse grounding',
  subtitle: 'Three knowledge source types · MCP integration patterns · Dataverse grounding with row-level security.',
  slides: [
    // SLIDE 1
    {
      title: 'Knowledge sources, MCP, and Dataverse grounding',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Knowledge sources decide what the agent knows. Get the grounding architecture right — citations work, security holds, responses are accurate. Get it wrong — hallucinations, data leakage, regulatory exposure.</p>`,
      narrationLead:
        "Welcome to chapter five. Knowledge sources, Model Context Protocol, and Dataverse grounding. Knowledge sources decide what the agent knows and can talk about. Get the grounding architecture right — citations link to source documents, security holds across users, responses are accurate and traceable. Get it wrong — hallucinations slip into responses, data leaks across users via shared retrieval, sensitivity labels get bypassed creating regulatory exposure. Three knowledge source types in Copilot Studio with their patterns. Model Context Protocol integration for custom data sources. Dataverse grounding with row-level security as the security backbone.",
    },
    // SLIDE 2
    {
      title: 'Three knowledge source types',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The sources',
      bodyHtml: `<p>Three knowledge source types you wire into Copilot Studio. Each fits a different content profile and brings different governance characteristics. Combine them where appropriate; don\'t use one when another would fit better.</p>`,
      narrationLead:
        "Three knowledge source types you can wire into Copilot Studio for agent grounding. Each fits a different content profile and brings different governance characteristics — file size limits, refresh cadence, security model. Combine them where appropriate — the agent grounds across multiple sources for a single response. Don't use one when another would fit better. Match the source to the content's natural home.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'Source 1 — SharePoint and OneDrive (documents)',
            "Use when content lives in SharePoint sites or document libraries. Inherits sensitivity labels and access permissions automatically. Refreshes on a schedule. Best fit for policy documents, FAQs, knowledge base articles already in SharePoint."),
          narration:
            "Source one. SharePoint and OneDrive document libraries. Use this source when your content already lives in SharePoint sites or document libraries — policy documents, knowledge base articles, FAQ collections, training materials. The agent retrieves from indexed content of these documents at query time. Sensitivity labels on documents flow through to grounding — Confidential or Highly Confidential labels block use unless explicitly allowed by tenant configuration. Access permissions on the SharePoint sites flow through too — the agent only retrieves content the asking user has permission to read. Refreshes on a configurable schedule. Best fit for content that already has a natural home in SharePoint and that benefits from existing access control. Don't duplicate content into a separate knowledge store; ground in the SharePoint source.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Source 2 — Uploaded files (small static content)',
            "Direct upload of PDF, DOCX, TXT to the agent. Use for small static content not in a shared system — vendor manuals, policy snapshots, FAQ documents you maintain just for the agent. Limit on total size. Refresh = re-upload. Right for small focused agents."),
          narration:
            "Source two. Uploaded files directly to the agent. PDF, DOCX, TXT files uploaded into the agent's knowledge store. Use for small static content that isn't in a shared system — vendor manuals you want the agent to reference, policy snapshots curated for the agent specifically, FAQ documents you maintain just for this agent. Storage limits apply — typically two gigabytes per file and a tenant-wide quota. Refresh means re-uploading the file when content changes. Right for small focused agents with bounded content scope. Not right for large or frequently-updated content — the manual refresh discipline doesn't scale. The trade-off — convenience of direct upload versus the friction of update for a larger content set.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Source 3 — Web pages and public URLs',
            "Configure the agent to retrieve from specific public web pages. Use for content already published as web pages — public documentation, FAQ pages, marketing site content. Refreshes when the agent runs. Security boundary — the content is public; respect attribution and rate limits."),
          narration:
            "Source three. Web pages and public URLs. Configure the agent to retrieve from specific public web pages — your public documentation site, FAQ pages, marketing pages, regulatory disclosure pages, partner documentation. The agent fetches and indexes the content at query time or on a configured refresh schedule. Use for content already published as web pages where duplicating into the agent's knowledge store would create maintenance overhead. Security boundary is straightforward — the content is public, anyone could see it. Respect attribution requirements in your responses and rate limits if the source has them. Right pattern for public-facing agents that should match the brand's published content exactly without separate maintenance.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The right combination',
        "Most production agents use 2–3 source types combined. SharePoint for shared org content. Uploaded files for the agent-specific curated additions. Web for matching public site content. Don\'t use all three by default — use what fits the content\'s natural home."),
      calloutNarration:
        "The right combination of source types for most production agents. Two or three source types combined depending on where the content naturally lives. SharePoint for the bulk of shared organisational content that already lives there. Uploaded files for the agent-specific curated additions that aren't worth maintaining in SharePoint. Web pages for matching specific public site content exactly when consistency with public-facing material matters. Don't use all three source types by default just because the agent supports them; use what fits the content's natural home. Mixed source types add governance complexity — match them deliberately to the content profile.",
    },
    // SLIDE 3
    {
      title: 'MCP integration for custom data sources',
      iconKey: 'sparkles',
      eyebrow: 'Lesson 2 · MCP',
      bodyHtml: `<p>Model Context Protocol — the open standard for exposing data to AI agents — has become Copilot Studio\'s pattern for custom data sources. Three components in a well-designed MCP integration.</p>`,
      narrationLead:
        "Model Context Protocol — MCP, the open standard for exposing data and tools to AI agents — has become Copilot Studio's pattern for custom data sources that aren't covered by the standard SharePoint, file, and web source types. MCP gives agents a structured way to discover and access data from your custom systems. Three components in a well-designed MCP integration. The pattern is consistent across the agent ecosystem — Copilot Studio, Claude, ChatGPT — so the skills you build apply broadly. MCP is one of the most important architectural developments in agent platforms in 2025 and 2026.",
      steps: [
        {
          html: stepCard('sparkles', 'blue', 'Component 1 — MCP server exposing your data',
            "Build or use an MCP server in front of your custom data source. Server speaks the MCP protocol — discovery, resource access, tool invocation. Hosted in Azure or your own infra. The server is where you implement auth, scope, and rate limiting for the agent\'s access."),
          narration:
            "Component one. MCP server exposing your data. Build or use an MCP server that sits in front of your custom data source — your internal CRM, a proprietary database, an industry-specific system, anything that doesn't have a first-party Copilot Studio connector. The server speaks the MCP protocol — discovery so the agent can find out what's available, resource access for reading content, tool invocation for taking actions. Host the server in Azure or on your own infrastructure depending on data residency and security requirements. The server is where you implement authentication, scope of access, rate limiting, and audit logging for the agent's access. The server is the security boundary; configure it carefully.",
        },
        {
          html: stepCard('sparkles', 'blue', 'Component 2 — MCP connection in Copilot Studio',
            "Configure the agent to connect to your MCP server. Auth flows through Entra ID. The agent discovers available resources and tools at connection time. Configuration includes which resources the agent can access — scope down explicitly per agent."),
          narration:
            "Component two. MCP connection configured in Copilot Studio. Configure the agent to connect to your MCP server through the agent's knowledge sources or tools configuration. Authentication flows through Entra ID — the user's identity reaches the MCP server so the server can apply per-user permissions. The agent discovers available resources and tools at connection time — the MCP server tells the agent what it can do and what data it exposes. Critically, the configuration includes scope — which resources and tools the agent can access. Scope down explicitly per agent rather than exposing everything the MCP server offers. Different agents may use different subsets of the same MCP server's capabilities; configure each agent to see only what it needs.",
        },
        {
          html: stepCard('sparkles', 'blue', 'Component 3 — Observability and governance on the MCP layer',
            "Log every MCP call from the agent — who, what, when, what was returned. Surface the logs to the agent\'s governance pipeline. Monitor for unusual patterns — agent calling resources outside its expected scope, or at unexpected volume. The observability is where security incidents surface."),
          narration:
            "Component three. Observability and governance on the MCP layer. Log every MCP call the agent makes to the server — which user's context, which resource or tool was invoked, when, what was returned in summary. Surface the logs to your agent governance pipeline alongside other agent telemetry. Monitor for unusual patterns — the agent calling resources outside its expected scope, calls happening at volumes much higher than baseline, calls from unusual users or times. The MCP observability is where security incidents surface — for example, if a user prompt-injects the agent into calling MCP resources beyond its normal scope, the logs show the unexpected pattern. Don't treat MCP as opaque; the observability is the safety net.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Dataverse grounding with row-level security',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · Dataverse',
      bodyHtml: `<p>Dataverse grounding is the dominant pattern for enterprise data scenarios in Copilot Studio. Row-level security in Dataverse is what makes it work safely across users. Three configuration choices that decide whether the agent leaks data.</p>`,
      narrationLead:
        "Dataverse grounding is the dominant pattern for enterprise data scenarios in Copilot Studio agents — customer records, support cases, sales opportunities, employee data, anything that lives in the Power Platform data layer. Row-level security in Dataverse is what makes Dataverse grounding work safely across users. Three configuration choices that decide whether the agent leaks data across users — and they're not all defaults. Make all three explicitly.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Choice 1 — User context vs application context for retrieval',
            "User context — agent retrieves as the asking user, RLS applies. User sees only their permitted rows. Application context — agent retrieves as the app, RLS doesn\'t apply. App sees all rows. Choose user context for almost everything; application context only for system-wide aggregates the user is licensed to see."),
          narration:
            "Choice one. User context versus application context for retrieval. User context — the agent calls Dataverse as the asking user via on-behalf-of token flow. Row-level security applies to the user's identity. The user sees only the rows they have permission to read. Application context — the agent calls Dataverse as the app via service principal. Row-level security doesn't apply. The app sees all rows in the table regardless of the user. Choose user context for almost everything — it's the secure default and what most scenarios should use. Application context only for system-wide aggregates the user is licensed to see — for example, total open tickets across the company on a manager-facing agent, where the manager has the licence to see organisation-level aggregates. Application context misused is the dominant Dataverse data leak pattern; verify the configuration explicitly.",
        },
        {
          html: stepCard('shield', 'green', 'Choice 2 — Security roles assigned to the agent or to users',
            "Agent\'s effective permissions come from the security roles assigned. In user context — user\'s roles drive what the agent sees on their behalf. In application context — the agent\'s service principal has its own roles. Audit both regularly; over-permissioning is the silent risk."),
          narration:
            "Choice two. Security roles assigned to the agent or to users — which determines what each can see. In user context retrieval — the user's own security roles drive what the agent sees when acting on their behalf. The agent inherits the user's permissions naturally. In application context retrieval — the agent's service principal has its own assigned security roles, separate from any user. Audit both regularly. User roles drift over time as people change jobs and accumulate permissions. Service principal roles can be over-permissioned at setup and never narrowed because nobody reviews them. Schedule the audit — at least quarterly for the service principal, annually for the user roles policy. Reducing over-permissioning is the principle of least privilege applied to the data layer.",
        },
        {
          html: stepCard('shield', 'green', 'Choice 3 — Field-level security where needed',
            "Some Dataverse fields hold particularly sensitive data — salary, SSN, account balance. Field-level security restricts which roles can read specific fields. Configure for sensitive fields explicitly — the row-level security alone may not be enough."),
          narration:
            "Choice three. Field-level security where needed. Some Dataverse fields hold particularly sensitive data even within rows the user is authorised to see — salary fields in an employee record, social security numbers, account balances, credit card last-four. Row-level security alone may not be enough because the user might be authorised to see the employee record but not the salary field within it. Field-level security in Dataverse restricts which security roles can read specific fields independent of row access. Configure field-level security explicitly for sensitive fields when designing the data model — agent grounding will respect it. The configuration is part of the data layer setup, not part of the agent setup; coordinate with the Dataverse administrator. Most teams skip this and discover later that an agent exposed a sensitive field it shouldn't have.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'The test before launch',
        "Build the agent and test with three different user roles — admin, manager, line employee. Verify each sees only what their role should see. Test edge cases — escalation paths, delegated permissions. Cross-role test is what catches RLS misconfigurations before production."),
      calloutNarration:
        "The test to run before launching any Dataverse-grounded agent to production. Build the agent and test with three different user roles representing the access tiers your organisation has — for example, admin role, manager role, line employee role. Sign in as each role and ask the agent the same questions. Verify each user sees only what their role should see — admin sees the most, line employee sees the least. Test edge cases — escalation paths where someone temporarily acts as another role, delegated permissions, shared records. The cross-role test is what catches row-level security and field-level security misconfigurations before they reach production. Skip this and discover the misconfiguration in audit or in customer-facing incidents — much more expensive than the test took.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter six — deployment, ALM, and environments.</p>`,
      narrationLead:
        "Three anchors before chapter six — deployment, application lifecycle management, and environments.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three knowledge source types',
            "SharePoint/OneDrive (inherits sensitivity + access) · uploaded files (small focused content with manual refresh) · web pages (public published content). Combine 2–3 deliberately based on the content\'s natural home."),
          narration:
            "One. Three knowledge source types. SharePoint and OneDrive — inherits sensitivity labels and access permissions, refreshes on schedule, best fit for shared organisational content. Uploaded files — direct upload of PDF, DOCX, TXT, small static content with manual refresh, right for focused agents with bounded scope. Web pages — public URLs the agent fetches at query time or on schedule, right for matching public site content exactly without separate maintenance. Combine two or three deliberately based on where the content naturally lives; don't use all three by default.",
        },
        {
          html: stepCard('check', 'green', 'Two — MCP integration pattern',
            "MCP server in front of your custom data source (auth, scope, rate limiting) · MCP connection in Copilot Studio with per-agent scope-down · observability on every MCP call. The MCP pattern is consistent across agent platforms; skills transfer."),
          narration:
            "Two. MCP integration pattern for custom data sources not covered by SharePoint, files, or web. MCP server in front of your custom data source — server speaks the protocol, implements authentication, scope of access, rate limiting, audit logging. MCP connection in Copilot Studio configured with per-agent scope-down — agent sees only the resources it needs, not everything the server exposes. Observability on every MCP call logged to your agent governance pipeline, monitored for unusual patterns that indicate security incidents like prompt injection trying to expand the agent's access scope. The MCP pattern is consistent across agent platforms — Copilot Studio, Claude, ChatGPT — so skills transfer broadly.",
        },
        {
          html: stepCard('check', 'green', 'Three — Dataverse grounding with RLS',
            "User context for retrieval (default, RLS applies) · audit security roles regularly · field-level security on sensitive fields. Cross-role test before launch — admin, manager, line employee — verify each sees only their permitted data."),
          narration:
            "Three. Dataverse grounding configured with row-level security as the backbone. User context for retrieval — agent calls as the asking user with on-behalf-of token flow, RLS applies, secure default. Application context only when system-wide aggregates the user is licensed to see are explicitly needed. Audit security roles regularly — quarterly for service principal, annually for user roles policy — to catch over-permissioning. Field-level security on particularly sensitive fields like salary, SSN, account balance — row-level alone isn't enough. Cross-role test before launch — sign in as admin, manager, line employee, verify each sees only the data their role should see. The cross-role test catches the RLS misconfigurations that would otherwise surface in audit.",
        },
      ],
      narrationTrail:
        "Chapter six — deployment, ALM, and environments. The promotion path from dev to test to prod that scales across the agent estate. See you there.",
    },
  ],
}
