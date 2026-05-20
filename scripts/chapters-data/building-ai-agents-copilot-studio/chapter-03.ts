import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter03: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-plugins-connectors',
  title: 'Plugins and connectors at production scale',
  subtitle: 'Three connector patterns · four-component auth model · three production failure modes (errors, rate limits, latency) and how to handle each.',
  slides: [
    // SLIDE 1
    {
      title: 'Plugins and connectors at production scale',
      iconKey: 'zap',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Connectors are how Copilot Studio agents reach out into your business systems. The simple cases work easily in the demo. Production scale surfaces three failure modes the demo can\'t — and the right patterns for each. This chapter is the production-readiness checklist.</p>`,
      narrationLead:
        "Welcome to chapter three. Plugins and connectors at production scale. Connectors are how Copilot Studio agents reach out into your business systems — Dynamics 365, Salesforce, ServiceNow, custom REST APIs, internal databases. The simple cases work easily in the vendor demo. Production scale surfaces three failure modes the demo can't show — error handling, rate limiting, latency variance — and the right patterns for each. This chapter is the production-readiness checklist for the connector layer. Build with the production failure modes in mind from chapter one; don't discover them in week six of deployment.",
    },
    // SLIDE 2
    {
      title: 'Three connector patterns',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The patterns',
      bodyHtml: `<p>Three connector patterns, each with different cost and governance trade-offs. Choose deliberately per integration; the choice locks in for the life of the agent and is painful to change later.</p>`,
      narrationLead:
        "Three connector patterns available in Copilot Studio, each with different cost, latency, and governance trade-offs. Choose deliberately per integration based on the actual requirements. The choice locks in for the life of the agent — switching patterns later requires the integration to be redesigned. Make the decision explicit, document it in the agent design, review with the solution architect. Three patterns, with the question that decides between them.",
      steps: [
        {
          html: stepCard('zap', 'blue', 'Pattern 1 — Standard Microsoft connector',
            "First-party connector — Dynamics, SharePoint, Outlook, Teams. Maintained by Microsoft. Best documentation, best governance fit, lowest maintenance. Use when available. Start here for any Microsoft system."),
          narration:
            "Pattern one. Standard Microsoft connector. First-party connectors maintained by Microsoft to the Microsoft 365 and Dynamics ecosystem — Dynamics 365 tables, SharePoint, Outlook, Teams, Microsoft Graph, Power BI. Best documentation, most consistent behaviour, best governance fit because they're already classified in your DLP policies, lowest maintenance burden because Microsoft keeps them current. Always check first whether a Microsoft connector exists for the system you're integrating with — for most Microsoft 365 and Dynamics scenarios, it does. Use the first-party connector when available. Don't build a custom connector to a system Microsoft already provides one for. The build cost is real and the maintenance burden compounds.",
        },
        {
          html: stepCard('cog', 'blue', 'Pattern 2 — Premium / certified third-party connector',
            "Salesforce, ServiceNow, SAP, Workday — published certified connectors in the Power Platform connector library. Premium licence required. Less control than custom but maintained by partner. Use for major SaaS systems with published certified connectors."),
          narration:
            "Pattern two. Premium or certified third-party connector. Major SaaS systems — Salesforce, ServiceNow, SAP, Workday, Zendesk — typically have published certified connectors in the Power Platform connector library. Maintained by the vendor or by Microsoft's connector partner network. Requires a premium Power Platform licence. Less control than building your own custom connector — you accept the actions and triggers the certified connector exposes — but maintained for you which keeps the maintenance burden low. Use for major SaaS systems where a certified connector exists and the actions it exposes meet your needs. Verify the licence cost upfront; premium connectors are billed per user per month and accumulate across the agent estate.",
        },
        {
          html: stepCard('sparkles', 'blue', 'Pattern 3 — Custom connector to internal API',
            "Internal REST API, custom system, no first-party or certified connector. Build a custom connector from an OpenAPI spec. Maximum control; you own auth, error handling, rate limiting, versioning. Use when no other pattern fits — and accept the maintenance ownership."),
          narration:
            "Pattern three. Custom connector to your internal REST API or custom system. When no first-party Microsoft connector exists and no certified third-party connector exists, build a custom connector from an OpenAPI specification of your API. Maximum control — you own the authentication configuration, error handling behaviour, rate limiting strategy, version management as your API evolves. Use when no other pattern fits. Accept the maintenance ownership — when your underlying API changes, the custom connector needs to update. Custom connectors are powerful and right for many production scenarios; they require active maintenance that you should staff for from chapter one of the agent program, not assume will happen part-time.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The question that decides',
        "Does a first-party or certified connector exist that meets your needs? Yes — use it, accept the constraints. No — build custom, accept the maintenance. Don\'t build custom when first-party exists; don\'t avoid custom when the use case genuinely needs it."),
      calloutNarration:
        "The question that decides between the three patterns. Does a first-party Microsoft connector or a certified third-party connector exist that meets your needs for this integration? Yes — use it, accept the constraints, get the lower maintenance burden. No — build custom, accept the maintenance ownership. Don't build a custom connector when a first-party one exists out of preference for control; the maintenance compounds and the governance fit is worse. Don't avoid building custom when the use case genuinely needs it; trying to force-fit a generic connector onto a specific business need produces fragile integrations. Decide based on the actual fit, not on developer preference.",
    },
    // SLIDE 3
    {
      title: 'The four-component auth model',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The auth',
      bodyHtml: `<p>Authentication for connectors at production scale needs four components, deployed together. Get any one wrong and you either over-permission the agent or block legitimate users.</p>`,
      narrationLead:
        "Authentication for connectors at production scale needs four components deployed together. Each component handles a specific concern. Get any one wrong and you either over-permission the agent — letting it act with more authority than it should — or block legitimate users from getting work done. The four components are well-understood in identity engineering; applying them to Copilot Studio agents specifically is the chapter's contribution.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Component 1 — User context (Entra ID OAuth)',
            "End user authenticates to the agent via Entra ID single sign-on through the channel (Teams, web). User identity flows through OBO (on-behalf-of) for user-specific calls — agent acts as the user against external systems."),
          narration:
            "Component one. User context via Entra ID OAuth. End user authenticates to the agent through the channel — Teams uses the user's Teams sign-in, the Copilot Studio web channel uses Entra ID single sign-on, custom channels use whatever auth method you configured. The user's identity flows through to the agent. For calls that should act on behalf of the user — for example, creating a record in CRM as that specific user — the connector uses on-behalf-of token flow to call the external system as the user. The agent acts with the user's permissions, not its own. This is the default and right pattern for most user-specific operations.",
        },
        {
          html: stepCard('shield', 'green', 'Component 2 — Service principal for system-level calls',
            "Some calls aren\'t user-specific — telemetry write, system maintenance task, batch background job. Use service principal (app-only auth) for these. Service principal has limited scopes, not user-level access. Logged separately from user calls."),
          narration:
            "Component two. Service principal for system-level calls that aren't user-specific. Some operations the agent performs aren't on behalf of a specific user — writing telemetry to a logging system, running a system maintenance task triggered by the agent, kicking off a batch job that processes data overnight. For these, use a service principal — app-only authentication where the agent itself is the identity, not any user. The service principal has limited scopes configured during its setup — not user-level access — and its actions log separately from user-context actions. The separation between user-context calls and service-principal calls is the auditability foundation. Configure both, never use service principal for things that should be user-context.",
        },
        {
          html: stepCard('shield', 'green', 'Component 3 — Token caching with refresh handling',
            "Connectors cache OAuth tokens between calls. When tokens near expiry, refresh happens automatically. Configure refresh window and failure behaviour explicitly — what does the agent do if refresh fails? Default behaviour is sometimes wrong for your scenario."),
          narration:
            "Component three. Token caching with refresh handling. Connectors cache OAuth tokens between calls so users aren't re-authenticated on every interaction with the agent. When tokens approach expiry, the connector refreshes them automatically using refresh tokens. Configure the refresh window — how close to expiry you trigger refresh — and the failure behaviour — what happens when refresh fails because the user changed password or admin revoked permissions — explicitly during connector setup. The default behaviour for refresh failure is sometimes wrong for your specific scenario. Without explicit configuration, you discover the wrong behaviour in production when a user complains about a confusing error. Set it up upfront based on what your business actually needs.",
        },
        {
          html: stepCard('shield', 'green', 'Component 4 — Scope and consent management',
            "Each connector requests specific scopes. Admins consent on behalf of the org for tenant-wide use, or users consent individually depending on configuration. Manage scopes through Entra ID admin centre. Audit at least quarterly for over-permissioning."),
          narration:
            "Component four. Scope and consent management. Each connector requests specific OAuth scopes — for example, read user calendar, write to specific Dataverse tables, send email as the user. Scopes can be granted with tenant-wide admin consent for organisation-deployed agents, or with individual user consent for user-installed agents. Manage scopes through the Entra ID admin centre — this is where you see what each app is permitted to do. Audit the scopes at least quarterly for over-permissioning — agents that requested broad scopes during initial setup and only actually use a subset. Reducing scopes to what's actually used is the principle-of-least-privilege discipline applied to agents. Compounds across the agent estate; do it.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three production failure modes and how to handle each',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The failures',
      bodyHtml: `<p>Three failure modes show up at production scale that the demo never exposes. Each has a specific pattern for handling. Build the patterns in from chapter one; retrofitting under fire is painful.</p>`,
      narrationLead:
        "Three failure modes that show up only at production scale and that the demo environment never exposes. Each has a specific architectural pattern for handling that you build in from chapter one — not retrofit when you're already in production and the failure is biting. The patterns are well-understood in API engineering; applying them to Copilot Studio actions is the chapter's contribution.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Errors from the external system',
            "API returns 4xx or 5xx. Agent\'s default behaviour — surface the raw error to the user. Wrong. Right pattern — catch the error in the topic flow, return a user-friendly response, log the technical detail for the agent owner. Retry on 5xx; don\'t retry on 4xx."),
          narration:
            "Failure mode one. Errors from the external system. The API returns an HTTP 4xx error like 404 not found or 403 forbidden, or a 5xx server error. Copilot Studio's default behaviour is to surface the raw error to the user, which is wrong from a user experience perspective and exposes implementation detail. The right pattern. Catch the error in the topic flow using condition nodes that check the action's success status. Return a user-friendly response — for example, I couldn't retrieve that record, can you check the ID and try again. Log the technical detail of the error including the API response for the agent owner to investigate. Retry policy — automatic retry on 5xx server errors with exponential backoff up to three attempts, no retry on 4xx errors because the request itself was bad. Configure the retry logic explicitly per action, not by relying on connector defaults.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Rate limits hit at scale',
            "API enforces rate limits (per user, per app, per tenant). Agent hits the limit at peak usage. Calls fail. User experiences errors at unpredictable times. Pattern — queue and back off, communicate wait to user, monitor the rate-limit headroom proactively."),
          narration:
            "Failure mode two. Rate limits hit at production scale. External APIs enforce rate limits — per user, per application, per tenant — and the limits are real. Your agent hits the limit during peak usage and the calls start failing. Users experience errors at unpredictable times that correlate with overall plant activity, not with their specific action. Pattern. The connector or your action handler implements queue-and-backoff — when rate limit is approached, slow the call rate before hitting the hard limit. Communicate to the user when wait is required — for example, I'm processing many requests right now, give me a few seconds. Monitor the rate-limit headroom proactively — most APIs return remaining quota in response headers. Surface the headroom to your monitoring so you see rate-limit risk before it's a user-facing failure.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Latency variance from the external system',
            "Demo API responds in 100ms. Production API sometimes responds in 5 seconds during peak. Agent waits, user perceives the agent as frozen. Pattern — set explicit timeouts on action calls, communicate progress to the user, fall back gracefully if the call doesn\'t complete in time."),
          narration:
            "Failure mode three. Latency variance from the external system. The demo API responds in a hundred milliseconds because the demo environment has no load. The production API sometimes responds in five seconds during peak load — or worse, never responds because something upstream is broken. The agent waits for the response, the user perceives the agent as frozen, the user closes the conversation or retries — making the load problem worse. Pattern. Set explicit timeouts on every action call — typically three to five seconds for user-facing flows, longer for background flows. Communicate progress to the user when the call is going to take more than a couple seconds — for example, give me a moment to look that up. Fall back gracefully if the call doesn't complete in time — for example, I'm having trouble reaching that system right now, would you like me to file a ticket so someone gets back to you. Don't leave the agent waiting indefinitely with no user-facing feedback.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter four — agents and agent flows.</p>`,
      narrationLead:
        "Three anchors before chapter four — agents and agent flows with state.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three connector patterns',
            "Standard Microsoft connector (use when available) · premium/certified third-party (major SaaS systems) · custom connector to internal API (maximum control, maintenance ownership). Choose deliberately; switching later requires redesign."),
          narration:
            "One. Three connector patterns. Standard Microsoft first-party connector — best when available, lowest maintenance, best governance fit. Premium or certified third-party connector — for major SaaS like Salesforce, ServiceNow, SAP, Workday, requires premium licence. Custom connector to your internal REST API — maximum control, maintenance ownership, use when no other pattern fits. Decide based on actual fit. Don't build custom when first-party exists; don't avoid custom when the use case needs it. The decision locks in for the life of the agent.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four-component auth model',
            "User context (Entra OAuth, OBO for user-specific calls) · service principal (app-only for system calls) · token caching with explicit refresh handling · scope and consent audited quarterly for over-permissioning."),
          narration:
            "Two. Four-component auth model deployed together. User context via Entra OAuth with on-behalf-of token flow for user-specific external calls — agent acts as the user with the user's permissions. Service principal for system-level calls that aren't user-specific with limited scopes — separate from user calls in the audit log. Token caching with explicit refresh window and failure-behaviour configuration — defaults aren't always right for your scenario. Scope and consent managed through Entra ID admin centre, audited quarterly for over-permissioning. Principle of least privilege applied to the agent estate compounds across many agents.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three production failure patterns',
            "Errors from external system (catch, friendly response, log technical detail, retry 5xx not 4xx) · rate limits (queue + backoff + monitor headroom) · latency variance (explicit timeouts + progress communication + graceful fallback). Build these in chapter one, not under fire."),
          narration:
            "Three. Three production failure modes with specific patterns. Errors from the external system — catch in topic flow, return user-friendly response, log technical detail for the owner, retry 5xx with exponential backoff up to three attempts, don't retry 4xx. Rate limits hit at scale — queue and back off before the hard limit, communicate wait to the user, monitor remaining quota from response headers proactively. Latency variance from external system — set explicit timeouts on every action call, communicate progress when over two seconds, fall back gracefully if call doesn't complete. Build all three patterns in from chapter one of the action design, not under fire when production is biting.",
        },
      ],
      narrationTrail:
        "Chapter four — agents and agent flows. Multi-turn state, orchestration patterns, and the difference between agents and topic-based bots. See you there.",
    },
  ],
}
