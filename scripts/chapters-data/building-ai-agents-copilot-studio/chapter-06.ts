import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter06: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-deployment-alm',
  title: 'Deployment, ALM, and environments',
  subtitle: 'The three-environment promotion path · solutions for packaging · pipeline patterns that scale across the agent estate.',
  slides: [
    // SLIDE 1
    {
      title: 'Deployment, ALM, and environments',
      iconKey: 'rocket',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">ALM — application lifecycle management — separates agents that ship to production reliably from agents that get stuck in promotion purgatory. Three environments, solutions for packaging, pipeline patterns that scale.</p>`,
      narrationLead:
        "Welcome to chapter six. Deployment, application lifecycle management, and environments. ALM separates Copilot Studio agents that ship to production reliably and stay maintainable from agents that get stuck in promotion purgatory — works in dev, fails in test, gets patched in prod, eventually nobody knows which environment has the source of truth. Three-environment promotion path that works at scale. Solutions for packaging — the right unit of deployment. Pipeline patterns that scale across many agents in your estate. ALM discipline is unglamorous and is the determinant of whether your agent program scales beyond five agents.",
    },
    // SLIDE 2
    {
      title: 'The three-environment promotion path',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The path',
      bodyHtml: `<p>Three Power Platform environments — dev, test, prod. Each has a different purpose, different access, different data. The promotion path through them is what makes deployment predictable.</p>`,
      narrationLead:
        "Three Power Platform environments. Dev, test, prod. Each has a different purpose, different access, different data, different governance posture. The promotion path through them is what makes Copilot Studio deployment predictable. Many teams operate with two environments — or with one and call it dev — and then discover the deployment problems when the agent breaks in production. The three-environment pattern is the production-readiness baseline. Set it up before building your second agent if you didn't have it for your first.",
      steps: [
        {
          html: stepCard('cog', 'blue', 'Environment 1 — Dev',
            "Where builders build. Test data only — no production data. Wide permissions for builders to iterate. May contain experimental agents that never go further. Reset-able when things get messy. Don\'t connect to prod systems."),
          narration:
            "Environment one. Dev. Where builders build agents. Test data only — never production data because dev typically has weaker access controls and looser DLP than test or prod. Wide permissions for builders to iterate quickly without admin friction. May contain experimental agents that exist for learning and never go further than dev. Reset-able when things get messy — wipe and start fresh without consequence. Critical rule — dev does not connect to production systems. The agent in dev might call test instances of CRM, ServiceNow, etc., but never the production instances. Mixing dev work with production data is the most common cause of accidental data leaks in agent programs.",
        },
        {
          html: stepCard('flag', 'blue', 'Environment 2 — Test',
            "Where agents are validated. Production-like configuration. Production-like data (or anonymised production data). Restricted access — only reviewers and a small set of validators. Pipeline promotion from dev runs here for verification before prod."),
          narration:
            "Environment two. Test. Where agents are validated before they reach production users. Production-like configuration — same DLP policies, same security settings, same governance settings as prod. Production-like data, or anonymised production data, so the validation reflects what the agent will actually encounter in production. Restricted access — only reviewers and a small set of validators have access, not the broader build team. Pipeline promotion from dev runs the agent into test for verification before production deployment. The validators run the test plan — connecting to test instances of business systems, walking through the agent's flows, verifying security boundaries hold, confirming the agent passes the governance checklist from chapter eight.",
        },
        {
          html: stepCard('rocket', 'green', 'Environment 3 — Prod',
            "Where end users meet the agent. Production data, production access controls, full governance. Changes only via pipeline promotion from test — no direct editing in prod. Monitored for usage, errors, cost. The discipline of \"no direct prod editing\" is what protects the program."),
          narration:
            "Environment three. Prod. Where end users meet the agent. Production data, production access controls, full governance applied. Changes to prod only via pipeline promotion from test — no direct editing in the prod environment by builders. This discipline — no direct prod editing — is what protects the program from the failure mode where someone fixes a bug directly in prod, the change isn't reflected in test or dev, and next month a normal promotion overwrites the fix. The discipline is uncomfortable in the moment when a quick fix would be faster; the program-level cost of bypassing the discipline is significant. Hold the line. Monitor prod for usage, errors, cost — chapter eight covers monitoring.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The two-environment shortcut',
        "Some teams operate dev + prod, skipping test, to move faster. The shortcut fails the first time a problem reaches prod that test would have caught. The cost of one production incident is higher than the cost of test environment for many months. Use three environments."),
      calloutNarration:
        "The two-environment shortcut that teams take and that consistently fails. Operating with dev plus prod and skipping test, to move faster, because test feels like overhead. The shortcut works for the first month or two — until the first time a problem reaches prod that a test environment would have caught. The cost of one production incident — broken agent affecting users, possible data exposure, governance review, remediation effort — is higher than the cost of running a test environment for many months. Use three environments from the start of any agent program that goes beyond toy projects. Set it up once, run it across all your agents. The discipline scales; the shortcut compounds risk.",
    },
    // SLIDE 3
    {
      title: 'Solutions for packaging',
      iconKey: 'cog',
      eyebrow: 'Lesson 2 · Solutions',
      bodyHtml: `<p>Power Platform solutions are the unit of deployment. Get the solution structure right and promotion works smoothly. Get it wrong and dependencies break during promotion in confusing ways.</p>`,
      narrationLead:
        "Power Platform solutions are the unit of deployment for Copilot Studio agents — the package that moves from dev to test to prod. Get the solution structure right and promotion works smoothly. Get it wrong and dependencies break during promotion in confusing ways that take hours to debug. Three rules for solution structure that prevent the common breakage patterns. The rules are simple to follow upfront and difficult to retrofit later when the solution is already messy.",
      steps: [
        {
          html: stepCard('cog', 'blue', 'Rule 1 — One solution per agent (or tightly-coupled agent group)',
            "Don\'t bundle five unrelated agents into one solution. Promotion of one agent then forces promotion of the others. One solution per agent, or per group of agents that share substantial components (Power Automate flows, Dataverse tables, custom connectors)."),
          narration:
            "Rule one. One solution per agent, or per group of agents that share substantial components. Don't bundle five unrelated agents into one solution because the promotion of one agent then forces promotion of all five, even when the others aren't ready. The bundling produces the pattern where one team's bug fix is blocked by another team's incomplete feature. One solution per agent is the simple rule. The exception — when multiple agents share substantial components like a Power Automate flow that all of them invoke, or a Dataverse table that all of them ground in, or a custom connector that all use. Then group those agents into a single solution because the shared components naturally promote together. The judgment call is when sharing is substantial; when in doubt, separate.",
        },
        {
          html: stepCard('cog', 'blue', 'Rule 2 — Managed solutions in test and prod',
            "Dev environment uses unmanaged solution (lets builders edit). Test and prod use managed solution (locked, can only be changed via pipeline). The managed/unmanaged distinction is what enforces \"no direct prod editing\"."),
          narration:
            "Rule two. Managed solutions in test and prod environments; unmanaged solutions only in dev. Unmanaged solutions in Power Platform allow direct editing by builders — appropriate for dev where iteration is the work. Managed solutions are locked from direct editing — components can only be changed via pipeline promotion from upstream environments. Test and prod always use managed solutions. The managed-versus-unmanaged distinction is what technically enforces the no-direct-prod-editing discipline from the previous slide. Without managed solutions, the discipline is just a verbal agreement that erodes under pressure. With managed solutions, the platform enforces the discipline regardless of who's tempted to edit directly. Configure managed solutions from the first deployment, not after the first incident.",
        },
        {
          html: stepCard('cog', 'blue', 'Rule 3 — Solution versioning explicit, not auto',
            "Every solution promotion gets an explicit version number — 1.0.0, 1.0.1, 1.1.0, depending on the change scope. Tag in source control. The version is what lets you roll back to known-good state when a promotion goes wrong."),
          narration:
            "Rule three. Solution versioning is explicit, not left to auto-incrementing. Every solution promotion gets an explicit version number following semantic versioning conventions — 1.0.0 for the first production release, 1.0.1 for a patch fix, 1.1.0 for a minor feature addition, 2.0.0 for a major breaking change. Tag the version in your source control where the solution export lives. The version is what lets you roll back to known-good state when a promotion goes wrong — for example, the 1.1.0 promotion introduced a bug, roll back to 1.0.1 while the team fixes 1.1.0 in dev. Auto-incrementing versions like 1.0.2.78321 are essentially meaningless and don't support rollback decisions. Explicit semantic versions do. Use them.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Pipeline patterns that scale',
      iconKey: 'zap',
      eyebrow: 'Lesson 3 · The pipelines',
      bodyHtml: `<p>Three pipeline patterns that scale beyond five agents in your estate. Without automated pipelines, promotion becomes manual export-import work that doesn\'t scale. With pipelines, the agent estate can grow.</p>`,
      narrationLead:
        "Three pipeline patterns that scale beyond a handful of agents in your estate. Without automated pipelines, promotion from dev to test to prod becomes manual export-import work — open the solution in dev, export it, switch to test, import it, repeat. The manual work doesn't scale. Once you have five or more agents, the promotion overhead consumes a significant fraction of your team's time. With pipelines, the agent estate can grow without proportional overhead. Three patterns from simplest to most sophisticated.",
      steps: [
        {
          html: stepCard('zap', 'blue', 'Pattern 1 — Power Platform Pipelines (built-in)',
            "Microsoft\'s built-in promotion tool. Configure source and target environments, click promote. Solution moves with versioning. Good starting point — low setup effort, works for most simple promotions. Limited customisation for complex scenarios."),
          narration:
            "Pattern one. Power Platform Pipelines — Microsoft's built-in promotion tool. Configure source environment and target environment in the Power Platform admin centre. When you want to promote, click the promote button and select the solution and target. The solution moves with versioning preserved. Good starting point for most teams because the setup effort is low — configure once per pipeline, use many times. Works well for simple promotion scenarios — solution moves cleanly between environments without complex pre-promotion or post-promotion steps. Limited customisation for complex scenarios where you need pre-promotion validation, post-promotion configuration updates, or coordinated promotion of multiple solutions. For the bulk of agent promotions, Power Platform Pipelines is sufficient. Start here.",
        },
        {
          html: stepCard('zap', 'blue', 'Pattern 2 — Azure DevOps Pipelines (CI/CD)',
            "For more sophisticated control — pre-promotion testing, automated approval gates, multi-step orchestration. Use the Power Platform Build Tools extension. Investment in setup pays off when you have 10+ agents or complex promotion requirements."),
          narration:
            "Pattern two. Azure DevOps Pipelines using the Power Platform Build Tools extension. For more sophisticated control — pre-promotion automated testing of the agent in the target environment, automated approval gates that require sign-off before the promotion proceeds, multi-step orchestration where the solution promotion is part of a larger release that also touches other systems. The Power Platform Build Tools extension provides tasks for solution export, import, packaging, and signing within Azure DevOps pipelines. Investment in setup is more significant than Power Platform Pipelines — typically a week for the first pipeline. Pays off when you have ten or more agents or when you have governance requirements that need automated approval gates rather than manual ones. Right for mature agent programs at scale.",
        },
        {
          html: stepCard('zap', 'blue', 'Pattern 3 — GitHub Actions with Power Platform CLI',
            "For teams who already standardise on GitHub. Power Platform CLI runs in GitHub Actions; promotion is code-as-pipeline. Most flexible; matches modern developer expectations. Right for technical-builder teams with existing GitHub workflows."),
          narration:
            "Pattern three. GitHub Actions with the Power Platform CLI. For teams who already standardise on GitHub for their development tooling. The Power Platform CLI — pac — runs in GitHub Actions workflows alongside any other automation the team uses. Promotion is code as pipeline — the workflow files live in source control next to the agent solution exports, reviewed via pull request, executed on triggers like merge to main. Most flexible of the three patterns. Matches modern developer expectations for infrastructure as code. Right for technical-builder teams with existing GitHub workflows and developer culture that prefers code over admin centre clicks. The setup is non-trivial for teams new to GitHub Actions but compounds across the agent estate once established.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Pick based on team and scale',
        "Most teams should start with Power Platform Pipelines. Move to Azure DevOps when you hit governance complexity. Move to GitHub Actions when the team standardises on GitHub broadly. Don\'t over-engineer the pipeline before you need it."),
      calloutNarration:
        "Pick the pattern based on team maturity and agent estate scale. Most teams should start with Power Platform Pipelines — built-in, low setup, sufficient for most needs. Move to Azure DevOps Pipelines when you hit governance complexity requiring automated approval gates and pre-promotion validation. Move to GitHub Actions when the team standardises on GitHub broadly across all infrastructure and the consistency benefit outweighs the migration cost. Don't over-engineer the pipeline before you need it — building Azure DevOps automation for two agents is overhead without proportional benefit. Right-size to the current scale; upgrade the pattern when you outgrow the current one.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter seven — governance and monitoring.</p>`,
      narrationLead:
        "Three anchors before chapter seven — governance and monitoring across the agent estate.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three environments, no shortcuts',
            "Dev (test data, wide builder permissions) · test (production-like config and data, restricted access, validation) · prod (production data, no direct editing, change via pipeline only). Two-environment shortcut consistently fails."),
          narration:
            "One. Three environments, no shortcuts. Dev for building — test data only, wide builder permissions, never connects to prod systems. Test for validation — production-like configuration and data or anonymised production data, restricted access, validators run the test plan. Prod for end users — production data, no direct editing, changes only via pipeline promotion from test. The discipline of no-direct-prod-editing is what protects the program; managed solutions in test and prod enforce it technically. The two-environment dev-plus-prod shortcut consistently fails when the first problem reaches prod that test would have caught.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three solution rules',
            "One solution per agent (or tightly-coupled group) · managed in test and prod, unmanaged only in dev · explicit semantic versioning per promotion. The rules prevent the common breakage patterns during promotion."),
          narration:
            "Two. Three rules for solution structure that prevent breakage during promotion. One solution per agent, or per group of agents that share substantial components — bundling unrelated agents into one solution forces them to promote together which doesn't fit their independent development cycles. Managed solutions in test and prod environments to enforce no-direct-editing; unmanaged only in dev for builder iteration. Explicit semantic versioning per promotion — 1.0.0, 1.0.1, 1.1.0, 2.0.0 — not auto-incrementing version numbers that don't support rollback decisions when a promotion goes wrong.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three pipeline patterns matched to scale',
            "Power Platform Pipelines (built-in, low setup, most teams start here) · Azure DevOps Pipelines (governance complexity, automated gates, 10+ agents) · GitHub Actions with Power Platform CLI (GitHub-standardised teams). Don\'t over-engineer before you need it."),
          narration:
            "Three. Three pipeline patterns matched to team maturity and agent estate scale. Power Platform Pipelines — Microsoft's built-in tool, low setup effort, sufficient for most needs, where most teams should start. Azure DevOps Pipelines with Power Platform Build Tools extension — for governance complexity requiring automated approval gates and pre-promotion validation, worth the setup investment when you have ten or more agents. GitHub Actions with Power Platform CLI — for technical-builder teams that standardise on GitHub broadly across all infrastructure tooling. Don't over-engineer the pipeline before you need it; upgrade when you outgrow the current pattern, not preemptively.",
        },
      ],
      narrationTrail:
        "Chapter seven — governance and monitoring across the agent estate. Tenant-wide policies, cost controls, sprawl prevention. See you there.",
    },
  ],
}
