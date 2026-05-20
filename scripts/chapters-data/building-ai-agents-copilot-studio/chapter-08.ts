import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter08: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your production-grade Copilot Studio agent',
  subtitle: 'Seven chapters down. One agent design. The production-gate checklist. Four conversations Monday.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your production-grade Copilot Studio agent',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In seven chapters, we built the production-readiness view of Copilot Studio agents. Now — one agent design. The 12-item production-gate checklist. Four conversations Monday that determine whether your agent ships in 90 days or stalls indefinitely.</p>`,
      narrationLead:
        "Welcome to chapter eight. The capstone. In the previous seven chapters, we built the production-readiness view of Copilot Studio agents. The architecture map and the three architectural decisions at the start. Topics versus generative answers with the four-question framework. Plugins and connectors at production scale with the four-component auth model. Agents and agent flows with state isolation. Knowledge sources, MCP, and Dataverse with row-level security. Deployment with the three-environment promotion path and solution packaging. Governance and monitoring at scale with three layers and five signals. Now we collapse it. One agent design. The twelve-item production-gate checklist that decides whether your agent ships or stalls. Four conversations Monday.",
    },
    // SLIDE 2
    {
      title: 'One agent design — the structure',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The design',
      bodyHtml: `<p>The agent design document is the foundation. Three sections from the course. Each section answers the questions chapters 1–7 raised. Without the design document, the build defaults to demo patterns.</p>`,
      narrationLead:
        "The agent design document is the foundation that determines whether your agent reaches production with intent or stumbles into it accidentally. Three sections drawn from the course. Each section answers the questions chapters one through seven raised. Without the design document written upfront, the build defaults to whatever the vendor demo showed — which is often not the right pattern for your specific scope. Write the document in two to three hours. Review it with the solution architect and governance committee before any build work. The document is the agent's specification.",
      steps: [
        {
          html: stepCard('compass', 'blue', 'Section 1 — Architecture and pattern decisions',
            "Topics-first / generative-first / agent-first? Knowledge source security model? Plugin architecture (direct vs shared service)? Three explicit decisions from chapter 1. State whether the agent is QA-pattern, transactional, or research/exploration from chapter 4."),
          narration:
            "Section one. Architecture and pattern decisions. From chapter one — topics-first, generative-first, or agent-first for this scope. Knowledge source security model — user-specific with RLS or shared organisational. Plugin architecture — direct connector per system or shared service layer. Three explicit decisions, documented with rationale. From chapter four — state whether the agent is the question-answer pattern with structured retrieval, the transactional pattern with action chains, or the research and exploration pattern. The pattern decision determines how you'll build and test the agent throughout. State each decision in one or two sentences with the rationale; reviewers can then validate or push back before build effort goes in.",
        },
        {
          html: stepCard('shield', 'blue', 'Section 2 — Knowledge sources and security model',
            "What knowledge sources does the agent ground in? What\'s the sensitivity label policy on each? What\'s the user-vs-application context choice for Dataverse? What\'s the cross-role test plan? Section 2 makes the security model explicit before build."),
          narration:
            "Section two. Knowledge sources and security model. What knowledge sources does the agent ground in — SharePoint sites, uploaded files, web URLs, MCP servers, Dataverse tables? What's the sensitivity label policy on each — Confidential or Highly Confidential labels need explicit allow configuration. What's the user context versus application context choice for Dataverse retrieval? What's the cross-role test plan before launch — three user roles, verify each sees only what they should. Section two makes the security model explicit before build, which is much easier than retrofitting security after the agent is built and architected on different assumptions.",
        },
        {
          html: stepCard('check', 'blue', 'Section 3 — Deployment, governance, monitoring',
            "Which solution? Which environments in the promotion path? What pipeline pattern? Which monitoring signals with what alert thresholds? Who is the named agent owner? Section 3 makes the operational ownership explicit. Without it, the agent has no operational home."),
          narration:
            "Section three. Deployment, governance, and monitoring. Which Power Platform solution does this agent live in — alone or grouped with which other agents from chapter six's solution rules? Which environments in the promotion path — typically dev to test to prod. What pipeline pattern — Power Platform Pipelines, Azure DevOps, or GitHub Actions, sized to estate scale. Which monitoring signals will be tracked with what alert thresholds from chapter seven's five signals. Who is the named agent owner who will do the weekly fifteen-minute review. Section three makes the operational ownership explicit. Without it, the agent ships and has no operational home, which produces the orphan agents that contribute to estate sprawl.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why the design document is non-negotiable',
        "Three hours upfront writing the design document saves weeks of rework when the build encounters the questions later. The document is also what the governance committee reviews — without it, the committee can\'t make the deployment decision and the agent waits."),
      calloutNarration:
        "Why the design document is non-negotiable for any agent ambitions beyond a toy project. Three hours upfront writing the design saves weeks of rework when the build encounters the questions in chapters one through seven later — and those questions will be encountered, either during build or during the production gate review. The document is also what the governance committee reviews at deployment. Without it, the committee can't make the deployment decision because they don't have the information needed — and the agent waits in the deployment queue for the meeting after the meeting after the meeting where the questions get answered ad hoc. Write the document upfront. The investment pays back many times over.",
    },
    // SLIDE 3
    {
      title: 'The 12-item production-gate checklist',
      iconKey: 'check',
      eyebrow: 'Lesson 2 · The checklist',
      bodyHtml: `<p>Twelve items that decide whether your agent passes the production gate. Each item maps to a chapter. Hold the agent to the checklist; ship only when all twelve check out.</p>`,
      narrationLead:
        "Twelve items that decide whether your agent passes the production gate. Each item maps to a chapter of this course. Hold the agent design and build to the checklist; ship only when all twelve check out. The checklist is the operationalisation of everything chapters one through seven covered. Going through it for each agent before deployment is the discipline that distinguishes production agents from extended pilots that never leave preview.",
      steps: [
        {
          html: stepCard('check', 'green', 'Items 1–4 — Architecture and pattern (chapters 1, 2, 4)',
            "1. Pattern decision documented (topics/generative/agent + which orchestration pattern) · 2. Topic-vs-generative decisions per intent · 3. State isolation tested under concurrent load · 4. Action chains have error/retry/timeout patterns from chapter 3."),
          narration:
            "Items one through four. Architecture and pattern. Item one — pattern decision documented in the design (topics-first, generative-first, agent-first; question-answer, transactional, or research orchestration). Item two — topic-versus-generative decision per significant intent following the four-question framework from chapter two. Item three — state isolation tested under concurrent load with the ten-session test from chapter four. Item four — action chains have explicit error handling, retry policy, and timeout patterns from chapter three. Four items grounded in chapters one through four. Each is something the governance committee reviewer will check or ask about; having it documented in advance saves the meeting cycle.",
        },
        {
          html: stepCard('check', 'green', 'Items 5–8 — Security and data (chapters 3, 5)',
            "5. Auth model documented (user context + service principal split) · 6. DLP connector classification verified · 7. Sensitivity labels on knowledge sources verified · 8. RLS / cross-role test passed for Dataverse-grounded agents."),
          narration:
            "Items five through eight. Security and data. Item five — authentication model documented including user context versus service principal split for which calls and the OAuth scope inventory. Item six — Data Loss Prevention connector classification verified across all connectors the agent uses, all in compatible classifications. Item seven — sensitivity labels on knowledge sources verified, explicit allow configured if Confidential or Highly Confidential labels are present. Item eight — row-level security cross-role test passed for any Dataverse-grounded agent, sign-in as three user roles verifies isolation. Four items grounded in chapters three and five — auth, DLP, sensitivity, RLS. Security gate is non-negotiable; reviewers will dig into all four.",
        },
        {
          html: stepCard('check', 'green', 'Items 9–12 — Operations and governance (chapters 6, 7)',
            "9. Solution structure correct (one agent per solution or coupled group, managed in test/prod) · 10. Promotion pipeline configured · 11. Monitoring set up with alerts on the 5 signals · 12. Named agent owner with weekly review commitment."),
          narration:
            "Items nine through twelve. Operations and governance. Item nine — solution structure correct with one agent per solution (or tightly-coupled group), managed solutions in test and prod environments, semantic versioning in place. Item ten — promotion pipeline configured between environments with appropriate pattern for the estate scale. Item eleven — monitoring set up with alerts configured on the five signals from chapter seven (usage, recognition, action success, cost, feedback). Item twelve — named agent owner committed to the weekly fifteen-minute review rhythm — without a committed owner, the agent has no operational home. Four items grounded in chapters six and seven — deployment, ALM, governance, monitoring. The operational checklist that confirms the agent has a home beyond the build phase.",
        },
      ],
      calloutHtml: calloutBlock('shield', 'tip', 'The gate enforces; the checklist guides',
        "The production gate is enforced by the governance committee at deployment review. The 12-item checklist is what you self-assess against before requesting the review. Self-pass all 12 first; the committee review then becomes confirmation, not discovery."),
      calloutNarration:
        "The relationship between the checklist and the gate. The production gate is enforced by the governance committee at the deployment review meeting. The twelve-item checklist is what the agent owner self-assesses against before requesting the review. Self-pass all twelve items first using the design document and build evidence. The committee review then becomes confirmation of what the owner already documented, not discovery of gaps the committee uncovers. Reviews that find gaps go back to the queue for the next meeting after the gaps are addressed. Reviews that confirm self-assessed completeness ship the agent the same day. The discipline of self-pass before review is what makes the gate work efficiently for everyone.",
    },
    // SLIDE 4
    {
      title: 'Four conversations Monday',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Week one',
      bodyHtml: `<p>Four conversations in the first week of any new agent project. Each unlocks something the project needs. None can be combined. Schedule them Monday before any building begins.</p>`,
      narrationLead:
        "Four conversations to schedule in the first week of any new Copilot Studio agent project. Each conversation unlocks something the project needs to actually ship. None can be combined into one meeting. Schedule them Monday before any building work begins. The first-week discipline is what determines whether the project ships in ninety days or stalls indefinitely in promotion purgatory.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — Business owner / sponsor',
            "What is the business problem this agent solves? Who are the users? What\'s the success criteria? What\'s the budget? Get clarity before designing — agents built without business clarity tend to drift into solutions looking for problems."),
          narration:
            "Conversation one. The business owner or executive sponsor. What is the specific business problem this agent solves — articulated in business terms, not technology terms. Who are the users — characterised concretely, not as a vague persona. What's the success criteria — measurable outcomes that prove the agent worked, not just usage metrics. What's the budget — both for build and for ongoing operations and monitoring. Get clarity before designing because agents built without business clarity tend to drift into solutions looking for problems — technically interesting but never adopted because they don't solve a real need. The business owner conversation is the foundation; everything that follows depends on it.",
        },
        {
          html: stepCard('users', 'blue', 'Conversation 2 — Solution architect',
            "Walk through the architecture decisions (chapter 1) and the pattern decisions (chapter 4). Get architectural review before building. The conversation surfaces decisions you might have made by accident and catches them while they\'re still easy to change."),
          narration:
            "Conversation two. The solution architect on the team or in the Power Platform centre of excellence if your organisation has one. Walk through the architecture decisions from chapter one — topics-first or generative-first, knowledge source security model, plugin architecture. Walk through the pattern decision from chapter four — question-answer, transactional, or research. Get the architectural review before building. The conversation surfaces decisions you might have made by accident — by following demo patterns rather than thinking through your specific scope — and catches them while they're still easy to change. Solution architect review at design time saves weeks of rework at build time.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 3 — Information security and identity team',
            "Walk through the auth model, DLP classification, sensitivity labels, RLS plan. Surface the security requirements early. Some governance committee questions can be answered in this conversation, saving committee meeting cycles later."),
          narration:
            "Conversation three. Information security and identity team. Walk through the auth model from chapter three including user context versus service principal split. Walk through DLP classification of the connectors you plan to use. Walk through sensitivity labels on the knowledge sources. Walk through the row-level security plan for any Dataverse grounding. Surface the security requirements early — the team will tell you what additional configuration or attestation they require for this agent based on its data sensitivity and user audience. Some of the governance committee's questions at the production gate can be answered in this conversation, saving committee meeting cycles later when the formal review happens.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 4 — Two intended users',
            "Pick two users from the intended audience. Walk them through the planned agent — what it does, how it differs from current ways of doing the same task. Get their honest reaction. Their feedback is the earliest signal on whether the agent will be adopted or ignored."),
          narration:
            "Conversation four. Two intended users from the planned audience. Pick two — one who tends to give honest feedback, one who's a respected voice among peers. Walk them through what the planned agent will do, how they would interact with it, how it differs from how they accomplish the same task today. Get their honest reaction. Their feedback is the earliest signal on whether the agent will be adopted in the user community or ignored. Build agents that users will use; the technical build alone doesn't guarantee adoption. This is the conversation most agent projects skip — and it is the one that distinguishes agents that ship and get used from agents that ship and sit unused in the catalog. Schedule it Monday.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'lightbulb',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p>Building Copilot Studio agents that ship to production at scale is a discipline. Architecture decisions made deliberately. Security designed in from chapter one. Governance treated as integral, not retrofit. Each chapter is one part of the discipline.</p>`,
      narrationLead:
        "A final note before the takeaways. Building Copilot Studio agents that ship to production at scale is a discipline. Architecture decisions made deliberately at the start rather than by accident through demo defaults. Security designed in from chapter one of the agent rather than retrofitted before deployment. Governance treated as integral to the build rather than an obstacle to overcome at the production gate. The estate scaled sustainably through governance layers and monitoring rhythms rather than allowed to sprawl into chaos. Each chapter of this course covers one part of the discipline. None alone is sufficient; together they distinguish production agents that scale from demos that don't ship. Choose discipline. Build agents that ship and stay shipped. The platform supports it; the work is yours.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three anchors. Then the course is yours.</p>`,
      narrationLead:
        "Three anchors. Then the course is yours.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three-section agent design',
            "Architecture + pattern decisions · knowledge sources + security model · deployment + governance + monitoring + named owner. Write the document in 2–3 hours; review with solution architect and governance committee before any build."),
          narration:
            "One. Three-section agent design document written upfront. Section one — architecture and pattern decisions including topics-first or generative-first, knowledge source security model, plugin architecture, and the orchestration pattern (question-answer, transactional, or research). Section two — knowledge sources and security model including sensitivity labels, user-versus-application context for Dataverse, cross-role test plan. Section three — deployment, governance, monitoring, named owner with committed weekly review rhythm. Two to three hours of writing upfront. Review with solution architect and governance committee before any build effort. The document is the agent's specification and the foundation for everything that follows.",
        },
        {
          html: stepCard('check', 'green', 'Two — 12-item production-gate checklist',
            "4 architecture and pattern items · 4 security and data items · 4 operations and governance items. Self-pass before requesting committee review; the committee review becomes confirmation, not discovery."),
          narration:
            "Two. Twelve-item production-gate checklist. Four items on architecture and pattern from chapters one, two, and four — pattern decision documented, topic-vs-generative per intent, state isolation tested, action chains have error and retry patterns. Four items on security and data from chapters three and five — auth model documented, DLP verified, sensitivity labels verified, RLS cross-role test passed. Four items on operations and governance from chapters six and seven — solution structure correct, pipeline configured, monitoring set up with alerts, named owner committed to weekly review. Self-pass all twelve before requesting the governance committee review. The committee review then becomes confirmation of what you documented, not discovery of gaps — ships the agent the same day.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four conversations Monday',
            "Business owner (problem clarity) · solution architect (architecture review) · infosec/identity (security requirements) · two intended users (adoption signal). Each unlocks something; none can be combined; schedule Monday before any build."),
          narration:
            "Three. Four conversations to schedule Monday morning of any new agent project. Business owner — problem clarity, user characterisation, success criteria, budget. Solution architect — architecture review of the chapter one decisions and the chapter four pattern choice, surfaces accidental decisions while they're easy to change. Information security and identity team — auth model, DLP classification, sensitivity labels, RLS plan, surfaces security requirements early to save governance committee meeting cycles. Two intended users — walk through planned agent, get honest reaction, earliest signal on whether the agent will be adopted. Each conversation unlocks something the project needs. None can be combined. Schedule them Monday before any building begins. That's the course. Build well.",
        },
      ],
      narrationTrail:
        "Thank you for completing Building AI Agents with Copilot Studio. The discipline is yours. Now ship the agent.",
    },
  ],
}
