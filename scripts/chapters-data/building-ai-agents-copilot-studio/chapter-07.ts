import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter07: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-governance-monitoring',
  title: 'Governance and monitoring at scale',
  subtitle: 'Three governance layers · five monitoring signals every agent owner watches · the agent estate management discipline that prevents sprawl.',
  slides: [
    // SLIDE 1
    {
      title: 'Governance and monitoring at scale',
      iconKey: 'shield',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Five agents are easy to govern. Fifty are not. The discipline that lets a Power Platform tenant grow from five to fifty agents without sprawl is in this chapter. Three governance layers, five monitoring signals, the estate-management rhythm that scales.</p>`,
      narrationLead:
        "Welcome to chapter seven. Governance and monitoring at scale. Five agents in a tenant are easy to govern — you know each one, the builder, the use case, the data sources. Fifty agents are not — many builders, many use cases, many data sources, many overlapping capabilities, many forgotten agents that nobody owns. The discipline that lets a Power Platform tenant grow from five to fifty agents without becoming an ungovernable sprawl is the substance of this chapter. Three governance layers that compound across the estate. Five monitoring signals every agent owner watches. The estate-management rhythm that prevents the chaos of unmanaged sprawl.",
    },
    // SLIDE 2
    {
      title: 'Three governance layers',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · The layers',
      bodyHtml: `<p>Three governance layers, stacked. Each layer enforces what the layer above it permits. Configure all three; relying on just one creates the sprawl that follows.</p>`,
      narrationLead:
        "Three governance layers stacked across the Power Platform tenant. Each layer enforces what the layer above it permits. Tenant policies set the broad boundaries. Environment policies refine within those boundaries. Per-agent governance handles the final per-agent specifics. Configure all three layers; relying on just one creates the sprawl that follows when the layer above grants more than the layer below would constrain to. Three layers, each with specific controls. Set them up before the estate grows.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Layer 1 — Tenant-wide policies',
            "DLP (data loss prevention) classifying every connector as business, non-business, or blocked. Tenant settings allowing or restricting who can build agents. Default behaviours for new environments. The broadest layer, set by the Power Platform admin centre."),
          narration:
            "Layer one. Tenant-wide policies set in the Power Platform admin centre. Data Loss Prevention policies classifying every connector — first-party, certified, custom — as business data, non-business data, or blocked. Connectors in the business classification can be combined with each other; non-business connectors can be combined among themselves; mixing business with non-business in the same flow is blocked. This is what prevents an agent from inadvertently combining sensitive Dataverse data with a public web connector. Tenant settings — who in the organisation can create environments, who can build Copilot Studio agents, what default capabilities new agents have. Default behaviours that all new environments inherit unless explicitly overridden. The broadest governance layer; the foundation everything else builds on. Configure with the security and IT teams jointly.",
        },
        {
          html: stepCard('shield', 'green', 'Layer 2 — Environment-level policies',
            "Each environment can have its own DLP refinement, sharing controls, capacity allocations. Dev environment may allow more experimentation; prod is locked down. Configure per environment based on its role — chapter six covers the three environments and their roles."),
          narration:
            "Layer two. Environment-level policies that refine the tenant policies for each specific environment. Each environment can have its own DLP refinement that's stricter than the tenant default — for example, the prod environment might block additional connectors that dev allows. Sharing controls — who can share agents from this environment, with what permissions, to which audiences. Capacity allocations — how much Power Platform capacity this environment can consume before hitting limits. Configure per environment based on its role in the promotion path from chapter six. Dev allows more experimentation. Test is production-like. Prod is locked down for stability. The per-environment configuration is what makes the three-environment pattern actually work; without it, all environments look the same and the differentiation collapses.",
        },
        {
          html: stepCard('shield', 'green', 'Layer 3 — Per-agent governance',
            "Each agent has its own sharing, knowledge source configuration, allowed channels, monitoring config. The per-agent layer is where most builders work day-to-day. Governance committee reviews per-agent config at deployment and at quarterly review."),
          narration:
            "Layer three. Per-agent governance configuration where most builders work day to day. Each agent has its own sharing settings — who can use the agent, in what channels. Knowledge source configuration — which knowledge sources this specific agent grounds in, with what scope. Allowed channels — Teams, web, Microsoft 365 Copilot extension, custom channels. Monitoring configuration — what telemetry the agent emits, what alert thresholds fire. The governance committee — typically a small cross-functional group with IT, security, business owner representation — reviews per-agent configuration at initial deployment and at quarterly review per agent. The per-agent layer is where the specific use case meets the broader policies. Without this layer, you have uniform governance that's too loose for sensitive agents and too tight for routine ones; with it, governance fits the specific agent.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where most tenants under-govern',
        "Layer 2 — environment-level policies. Teams set up tenant DLP and per-agent sharing, but leave environments with default config. The result — prod environment isn\'t actually locked down beyond what dev is. Set up environment policies explicitly per environment role."),
      calloutNarration:
        "Where most Power Platform tenants under-govern. Layer two — environment-level policies. Teams set up the tenant DLP at layer one and configure per-agent sharing at layer three, but leave environments at default configuration in between. The result — the prod environment isn't actually locked down beyond what dev is, because no environment-specific policies are in place. Prod's apparent stability is luck rather than enforced configuration. Set up environment-level policies explicitly per environment role — stricter DLP in prod, capacity limits in dev to prevent runaway test usage, sharing controls aligned to environment purpose. Layer two is where the chapter-six three-environment discipline becomes real rather than nominal.",
    },
    // SLIDE 3
    {
      title: 'Five monitoring signals every agent owner watches',
      iconKey: 'search',
      eyebrow: 'Lesson 2 · The monitoring',
      bodyHtml: `<p>Five signals every Copilot Studio agent should emit and every owner should watch. Without monitoring, problems surface from user complaints — slow, expensive, embarrassing. With it, owners catch issues before users do.</p>`,
      narrationLead:
        "Five monitoring signals every Copilot Studio agent should emit and every agent owner should watch. Without monitoring, problems surface only from user complaints — slow to detect, expensive to investigate, embarrassing to handle. With monitoring, agent owners catch issues before users do — or quickly afterward with the data needed to investigate. The signals are available out of the box from Copilot Studio analytics plus Application Insights if configured. Configure both, watch all five.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Signal 1 — Active usage (sessions, users, turns)',
            "Sessions per day. Unique users per week. Average turns per session. The baseline activity signal. Trends matter more than absolute values — sudden drops signal something broke; sustained growth signals success."),
          narration:
            "Signal one. Active usage — sessions per day, unique users per week, average turns per session. The baseline activity signal that tells you whether the agent is being used. Trends matter more than absolute values. Sudden drops signal something broke — the channel went down, the agent's content changed in a way that confused users, an upstream system failed and users gave up. Sustained growth signals the agent is succeeding. Stagnation signals the agent has hit its natural user base and isn't expanding — which may be fine if that matches the design, or may signal the agent needs promotion to broader audiences. Track weekly; investigate any week-over-week change beyond plus-or-minus twenty percent.",
        },
        {
          html: stepCard('search', 'blue', 'Signal 2 — Recognition rate (intent matched)',
            "Percentage of user inputs the agent recognised — matched to a topic or successfully retrieved via generative. Healthy production agent — 85%+ recognition rate. Trending down signals topic explosion or knowledge gaps; investigate."),
          narration:
            "Signal two. Recognition rate — percentage of user inputs the agent successfully recognised by matching to a topic or generating a confident retrieval response. Healthy production agents run at eighty-five percent or higher recognition rate. Below seventy-five percent — the agent is frustrating users with I-didn't-understand responses too often. Trending down over time signals either topic explosion from chapter two — overlapping triggers causing recognition to degrade — or knowledge gaps where new user questions aren't covered by existing topics or knowledge sources. Investigate when the rate drops more than five percentage points week over week. The recognition rate is the leading indicator of agent quality before user satisfaction metrics catch the same trend.",
        },
        {
          html: stepCard('search', 'amber', 'Signal 3 — Action success rate',
            "For action-bearing topics — percentage of action calls that completed successfully. Below 95% — something\'s broken in the connector or the external system. Catch this before users complain by monitoring the per-action success rate."),
          narration:
            "Signal three. Action success rate — for topics that call actions through connectors, the percentage of action calls that completed successfully versus errored or timed out. Below ninety-five percent success rate signals something is broken in the connector configuration, the external system, or the agent's handling of the action. Investigate immediately. The bug pattern — an upstream API changed its expected format, the connector started failing, users see error messages, and the team doesn't notice until users complain via support tickets. Monitor the per-action success rate per agent so the alert fires when the rate drops — not after users have escalated. Application Insights or Power Platform analytics surface this metric; configure the alerts.",
        },
        {
          html: stepCard('search', 'amber', 'Signal 4 — Cost per interaction',
            "Generative answers calls Azure OpenAI; cost accrues per call. Track cost per session and total cost per agent per month. Catch expensive agents before they consume the budget — usually they\'re running open-ended generative when topics would suffice."),
          narration:
            "Signal four. Cost per interaction — generative answers calls Azure OpenAI and cost accrues per call based on input and output tokens. Track cost per session and total cost per agent per month. Expensive agents — significantly higher cost than peer agents of similar usage — usually indicate one of three issues. Running open-ended generative when topics would handle the same intent more cheaply. Calling Azure OpenAI with overly long context that bloats input tokens. Generating long responses when shorter ones would serve. Catch expensive agents before they consume the budget unexpectedly — set per-agent monthly cost alerts in the Power Platform admin centre. The five-minute setup at agent launch prevents the surprise on the next budget cycle.",
        },
        {
          html: stepCard('search', 'green', 'Signal 5 — User feedback (thumbs / NPS)',
            "Configure the agent to ask for feedback after key interactions. Track thumbs-up versus thumbs-down rate, or NPS where appropriate. The user satisfaction signal. Below 80% positive — investigate which intents are failing users."),
          narration:
            "Signal five. User feedback — thumbs-up and thumbs-down ratings, or Net Promoter Score in scenarios where that's appropriate. Configure the agent to request feedback after key interactions — not after every interaction because that becomes annoying, but after the ones that matter like completed transactions or substantial information lookups. Track thumbs-up versus thumbs-down rate over time. Healthy agents run at eighty percent or higher positive feedback. Below seventy percent — investigate which specific intents or scenarios are producing the negative feedback. The user feedback signal is the truest measure of agent quality from the user's perspective; the other four signals measure technical performance, which doesn't always translate to user satisfaction. Watch both technical and satisfaction signals; they tell different parts of the story.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The estate-management rhythm',
      iconKey: 'calendar',
      eyebrow: 'Lesson 3 · The rhythm',
      bodyHtml: `<p>Three rhythms that keep the agent estate manageable as it grows. Without the rhythms, ten agents become thirty unmanaged ones in a year. With them, the estate scales sustainably.</p>`,
      narrationLead:
        "Three rhythms that keep the agent estate manageable as it grows. Without them, ten agents grow to thirty unmanaged agents in a year — forgotten owners, drifted configurations, accumulated technical debt, agents that nobody knows what they do but somehow are still running. With the rhythms, the estate scales sustainably and you can confidently grow to a hundred-plus agents. Schedule the rhythms; assign owners; hold the cadences. The discipline is unglamorous and is the difference between sustainable estate and chaos.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Rhythm 1 — Weekly owner review (per agent, 15 minutes)',
            "Each agent owner reviews their agent\'s five signals weekly. 15 minutes. Catches issues fast; surfaces patterns for the broader estate. Without this cadence, problems sit in dashboards nobody looks at until users complain."),
          narration:
            "Rhythm one. Weekly owner review per agent — fifteen minutes per agent per week. Each named agent owner reviews their agent's five signals from the previous slide every week. Active usage trends. Recognition rate. Action success rate. Cost per interaction. User feedback. Fifteen minutes per agent. Catches issues fast — the rate dropped five points this week, what changed. Surfaces patterns for the broader estate — three agents are all seeing recognition drops, is there a tenant-level configuration change to investigate. Without this cadence, problems sit in dashboards nobody opens until users complain. With it, owners catch issues before users do or shortly after with the data needed to investigate.",
        },
        {
          html: stepCard('calendar', 'amber', 'Rhythm 2 — Quarterly governance committee review',
            "Once a quarter, the governance committee reviews the entire agent estate. Active vs dormant. Cost trends. Security audit findings. Decisions — retire dormant agents, update governance settings, add tenant policies. Quarterly rhythm prevents the year-end surprise audit."),
          narration:
            "Rhythm two. Quarterly governance committee review of the entire agent estate. The committee — IT, security, business owner representation — meets once a quarter to review the estate as a whole. Active versus dormant agents — which agents have been used recently versus which haven't been touched in months. Cost trends per agent and total. Security audit findings from automated tenant scans plus any incident reports from the quarter. Decisions land at this cadence. Retire dormant agents that no longer serve a purpose. Update governance settings that aren't fitting current needs. Add tenant policies for emerging risks. The quarterly rhythm prevents the year-end audit surprise where you discover thirty forgotten agents nobody owns. With it, the estate stays accurately represented and governed.",
        },
        {
          html: stepCard('calendar', 'green', 'Rhythm 3 — Annual estate audit + cleanup sprint',
            "Once a year, the agent estate gets a deep audit and cleanup sprint. Each agent\'s ownership, purpose, security posture, cost-benefit re-validated. Agents that no longer warrant their cost get retired. Reduces estate to what\'s actually valuable. Pays for itself in reduced governance overhead."),
          narration:
            "Rhythm three. Annual estate audit and cleanup sprint. Once a year, typically aligned with the annual budget cycle, the agent estate goes through a deeper audit and cleanup sprint. Each agent's ownership, purpose, security posture, cost-benefit relationship gets re-validated by the owner with the governance committee. Agents that no longer warrant their cost get retired explicitly — not just left running. Knowledge sources get re-validated for currency. Connector configurations get audited for over-permissioning. The annual cleanup sprint reduces the estate to what's actually valuable and pays for itself in reduced governance overhead across the following year. Schedule it. Make it a known annual rhythm rather than an emergency cleanup when sprawl becomes painful. The known rhythm produces sustained estate health.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter eight — the capstone.</p>`,
      narrationLead:
        "Three anchors before chapter eight — the capstone, your production-grade agent.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three governance layers',
            "Tenant-wide policies (DLP, who can build) · environment-level policies (per-env DLP, sharing, capacity) · per-agent governance (sharing, sources, channels, monitoring). Layer 2 is where most tenants under-govern; set up explicitly."),
          narration:
            "One. Three governance layers stacked across the tenant. Tenant-wide policies — Data Loss Prevention classifying every connector, tenant settings allowing or restricting who can build, default behaviours for new environments. Environment-level policies — per-environment DLP refinement, sharing controls, capacity allocations differentiated by environment role. Per-agent governance — sharing, knowledge sources, allowed channels, monitoring per agent. Layer two is where most tenants under-govern — teams set up tenant DLP and per-agent sharing but leave environments at defaults. Set up environment-level policies explicitly per environment role; that's how the three-environment chapter-six discipline becomes real.",
        },
        {
          html: stepCard('check', 'green', 'Two — Five monitoring signals',
            "Active usage trends · recognition rate (85%+ healthy) · action success rate (95%+ healthy) · cost per interaction · user feedback (80%+ positive). Configure alerts on rate drops; watch leading indicators not just lagging metrics."),
          narration:
            "Two. Five monitoring signals every agent emits and every owner watches. Active usage trends — sessions, users, turns per session. Recognition rate — eighty-five percent or higher in healthy production agents. Action success rate — ninety-five percent or higher for action-bearing topics. Cost per interaction — track per agent per month, alert when expensive agents emerge. User feedback — thumbs-up rate or NPS, eighty percent positive or higher in healthy agents. Configure alerts on rate drops so the team responds before users escalate. Watch leading indicators like recognition rate and action success, not just lagging metrics like user complaints. The signals are out of the box from Copilot Studio analytics plus Application Insights if configured.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three estate-management rhythms',
            "Weekly owner review (15 min per agent, the 5 signals) · quarterly governance committee review (estate-level decisions) · annual audit and cleanup sprint (retire dormant, re-validate active). Without rhythms, 10 agents become 30 unmanaged in a year."),
          narration:
            "Three. Three estate-management rhythms that keep the estate manageable as it grows. Weekly fifteen-minute owner review per agent — catch issues fast through the five signals. Quarterly governance committee review of the entire estate — active versus dormant, cost trends, security audit findings, retirement decisions. Annual audit and cleanup sprint — deeper validation of each agent's ownership, purpose, security posture, cost-benefit relationship, with explicit retirement of agents that no longer warrant their cost. Without the rhythms, ten agents grow into thirty unmanaged ones within a year. With them, the estate scales sustainably to a hundred-plus agents.",
        },
      ],
      narrationTrail:
        "Chapter eight — the capstone. Your production-grade Copilot Studio agent and the governance checklist that gets it through the production gate. See you there.",
    },
  ],
}
