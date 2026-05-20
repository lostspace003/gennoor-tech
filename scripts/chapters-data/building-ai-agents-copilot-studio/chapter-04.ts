import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter04: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-agents-flows',
  title: 'Agents and agent flows',
  subtitle: 'How agents differ from topic-based bots · the three orchestration patterns · state management at production scale.',
  slides: [
    // SLIDE 1
    {
      title: 'Agents and agent flows',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Agents in Copilot Studio are the orchestration layer above topics and generative answers. They hold state across turns, choose which component to invoke, and reason about goals. Three orchestration patterns; one state management discipline that decides whether the agent works at scale.</p>`,
      narrationLead:
        "Welcome to chapter four. Agents and agent flows. Agents in Copilot Studio are the orchestration layer above topics and generative answers. They hold state across multiple conversation turns. They choose which component to invoke for each user input — sometimes a topic, sometimes generative answers, sometimes a multi-step action chain. They reason about user goals across turns rather than treating each turn in isolation. Three orchestration patterns that work at production scale. One state management discipline that decides whether the agent works for one user at a time or breaks when ten users hit it concurrently. By the end, the architecture for production-ready agents — not just topic-based bots dressed up as agents.",
    },
    // SLIDE 2
    {
      title: 'How agents differ from topic-based bots',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The difference',
      bodyHtml: `<p>Three differences between an agent and a topic-based bot. The differences shape what kind of problems each can solve and what kind of design discipline each needs.</p>`,
      narrationLead:
        "Three differences between an agent in the Copilot Studio sense and a traditional topic-based bot. The differences shape what kinds of problems each can solve well and what kind of design discipline each needs. Many teams call their topic-based bot an agent because the marketing tilts that way; in practice, the agent pattern only delivers value when the differences are actually present and exploited. Know what makes an agent an agent.",
      steps: [
        {
          html: stepCard('compass', 'blue', 'Difference 1 — State across turns',
            "Topic bot — each turn is mostly independent. Agent — holds context across many turns. User asks follow-up; agent remembers what was discussed two turns ago. Enables multi-step workflows topics can\'t do cleanly."),
          narration:
            "Difference one. State across turns. A topic-based bot processes each user turn mostly independently — the topic that triggers handles the turn, returns a response, and the next turn starts fresh. Each topic can hold short-term state during its execution but doesn't typically remember across multiple topic activations. An agent holds context across many turns. When the user asks a follow-up question, the agent remembers what was discussed two or five turns ago and uses that context to interpret the new input. This enables multi-step workflows that topics can't do cleanly — for example, the user starts a complex request, the agent asks clarifying questions across three turns, then executes the action with all the gathered context. Without persistent state, this workflow fragments into disconnected topic activations that lose context.",
        },
        {
          html: stepCard('compass', 'blue', 'Difference 2 — Goal-oriented reasoning',
            "Topic bot — matches input to trigger phrases, runs the matched flow. Agent — receives input, reasons about what the user is trying to accomplish, decides which component to invoke. The decision step is the agent\'s value — and the source of its non-determinism."),
          narration:
            "Difference two. Goal-oriented reasoning. A topic-based bot matches user input to trigger phrases and runs the matched topic flow — pattern matching, essentially. An agent receives user input, reasons about what the user is trying to accomplish in the larger sense, and decides which component to invoke to make progress toward that goal. The decision step uses an underlying language model to interpret intent in context — not just match phrases. This reasoning is the agent's distinctive value — handling inputs that don't fit any single topic by composing components creatively. It's also the source of the agent's non-determinism — the same input in different contexts may produce different decisions, which is appropriate behaviour for goal-oriented agents but requires different testing discipline than topic-based bots.",
        },
        {
          html: stepCard('compass', 'blue', 'Difference 3 — Tool composition',
            "Topic bot — actions are called from specific topics. Agent — has a toolbox of actions and decides which to call in which order based on the current goal. Higher capability ceiling; higher risk of wrong tool selection without right scoping."),
          narration:
            "Difference three. Tool composition. A topic-based bot calls actions from specific topics — each topic decides which actions it invokes during its flow. An agent has a toolbox of actions available to it and decides which to call in which order based on the current user goal. The agent can compose actions creatively — chaining them in ways the builder didn't explicitly script. Higher capability ceiling because the agent can solve novel multi-step problems. Higher risk of wrong tool selection without right scoping — the agent might call the wrong action or call actions in the wrong order if the action descriptions aren't precise. Scoping the agent's toolbox carefully and writing precise action descriptions becomes critical design work for agents.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'When NOT to use an agent',
        "If your problem is well-served by topics — finite intent set, deterministic flows, low state across turns — don\'t use an agent. Topic bots are cheaper, faster, more debuggable. Use agents when the problem genuinely needs state, reasoning, or tool composition."),
      calloutNarration:
        "When not to use an agent. If your problem is well-served by topics — finite intent set, deterministic flows, low state requirement across turns — don't use an agent because the marketing said to. Topic bots are cheaper to run per interaction, faster to respond, more debuggable when something goes wrong. Use agents when the problem genuinely needs state across many turns, goal-oriented reasoning to handle inputs that don't fit single topics, or tool composition where multiple actions need to be chained creatively. Most production deployments are still mostly topics with agents for the specific scenarios that need them. Don't dress topic bots as agents; don't avoid agents when they're the right fit.",
    },
    // SLIDE 3
    {
      title: 'Three orchestration patterns',
      iconKey: 'cog',
      eyebrow: 'Lesson 2 · The patterns',
      bodyHtml: `<p>Three orchestration patterns for production agents. Each fits a different problem class. Choose the pattern that fits your problem; don\'t default to whichever the documentation shows first.</p>`,
      narrationLead:
        "Three orchestration patterns for production agents. Each pattern fits a different class of problem. Choose the pattern that fits your problem; don't default to whichever pattern the documentation shows first or the vendor demo uses. Pattern fit is the determinant of agent quality at production scale — wrong pattern produces agents that work in demos and break under real use.",
      steps: [
        {
          html: stepCard('flag', 'blue', 'Pattern 1 — Question-answer agent with structured retrieval',
            "Agent\'s job — answer questions accurately from configured knowledge sources. Simple orchestration — retrieve, ground, respond. Use for FAQ-style agents that need to handle question variation better than topics. Most common starting pattern."),
          narration:
            "Pattern one. Question-answer agent with structured retrieval. The agent's job is to answer user questions accurately by retrieving from configured knowledge sources and grounding the response in the retrieved content. Simple orchestration — receive question, retrieve relevant content from knowledge sources, generate response grounded in the retrieved content, return response with citations. Use this pattern for FAQ-style agents that need to handle question variation better than topics could — open-ended question space, varied phrasing, large knowledge base. Most common starting pattern for teams new to agents. Productive within the first month of build because the orchestration is straightforward and the value depends mostly on knowledge source quality rather than complex reasoning.",
        },
        {
          html: stepCard('flag', 'amber', 'Pattern 2 — Transactional agent with action chains',
            "Agent\'s job — accomplish multi-step tasks on user\'s behalf. Orchestration — gather information across turns, validate, execute action chain, confirm outcome. Use for workflow automation. Higher build effort; requires careful action scoping and error handling."),
          narration:
            "Pattern two. Transactional agent with action chains. The agent's job is to accomplish multi-step tasks on the user's behalf — for example, create a customer record, schedule a meeting with specific participants, file a structured incident ticket with the right metadata. Orchestration is more complex. The agent gathers information across turns by asking clarifying questions, validates the information against business rules, executes a chain of actions through connectors, confirms the outcome to the user, handles errors at each step. Use this pattern for workflow automation that previously required forms or human handoff. Higher build effort than pattern one. Requires careful action scoping — the agent's toolbox must be precisely what it needs, not more — and careful error handling for each action call because failures cascade in chains. Worth the effort for high-volume transactional flows.",
        },
        {
          html: stepCard('flag', 'red', 'Pattern 3 — Research/exploration agent',
            "Agent\'s job — help the user explore a complex topic across many sources and actions. Orchestration is open-ended; agent chooses path based on intermediate findings. Highest capability ceiling, highest risk, hardest to test and govern. Use carefully — and gate to specific user populations."),
          narration:
            "Pattern three. Research and exploration agent. The agent's job is to help the user explore a complex topic across many sources and possibly many actions, with the path decided dynamically based on what the agent finds along the way. The orchestration is open-ended — the agent doesn't follow a predetermined script, it reasons about next steps based on intermediate findings. Highest capability ceiling — these agents can do things topic bots couldn't approach. Highest risk too. Hardest to test because the behaviour space is vast. Hardest to govern because the actions taken vary by interaction. Use this pattern carefully and gate the deployment to specific user populations who have agreed to the exploratory nature — typically internal power users, not customer-facing scenarios. The pattern is real and increasingly used; it requires more discipline than the other two combined.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'State management at production scale',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The state',
      bodyHtml: `<p>State management is what makes agents work at scale or break. Three components in the production state architecture. Get all three right; the agent serves a hundred concurrent users. Miss one; the agent works for one user at a time.</p>`,
      narrationLead:
        "State management at production scale is what makes agents actually work for many users concurrently or break under load. Three components in the production state architecture. Get all three right and the agent serves a hundred concurrent users with isolated context per user. Miss one and the agent works in single-user demo and breaks in production multi-user load. The state architecture is engineering work that doesn't show up in the vendor demo but determines whether the agent reaches production.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Component 1 — Per-user state isolation',
            "Each user\'s conversation has its own state. State from user A never leaks into user B\'s conversation. Use Copilot Studio variables scoped per user session — not global variables that bleed across sessions. The bug from global state is data leakage; check explicitly."),
          narration:
            "Component one. Per-user state isolation. Each user's conversation with the agent has its own isolated state. State from user A never leaks into user B's conversation, regardless of timing or load. Use Copilot Studio variables scoped per user session — not global variables that bleed across sessions in unexpected ways under concurrent load. The bug pattern from global state is data leakage between users, which is a critical privacy and security failure. Check the variable scoping explicitly during build. Test under concurrent load by simulating multiple users interacting with the agent simultaneously. Verify isolation holds. This isn't theoretical; the failure shows up in production with real customer data leaks if isolation isn't verified.",
        },
        {
          html: stepCard('shield', 'green', 'Component 2 — State persistence boundaries',
            "Some state persists across the conversation (user preferences set in turn 1, used in turn 7). Some state is ephemeral (the last clarifying question, discarded after answered). Decide which is which explicitly; persist only what should persist. Bloated state slows the agent and risks staleness."),
          narration:
            "Component two. State persistence boundaries — what persists across the conversation and what's ephemeral. Some state should persist across turns — for example, user preferences set in turn one and used in turn seven, the context of the current task the user is working on. Other state should be ephemeral — for example, the specific clarifying question the agent just asked, discarded after the user answered. Decide which is which explicitly during agent design. Persist only what should persist. Bloated state slows the agent's reasoning because the model has to process more context per turn and risks staleness where outdated state leaks into later turns. The persistence boundaries are part of the agent design, not a runtime concern to figure out later.",
        },
        {
          html: stepCard('shield', 'green', 'Component 3 — State cleanup on conversation end',
            "When the conversation ends — user closes window, idle timeout, explicit goodbye — what happens to the state? Stored for analytics with PII handling. Cleaned from active memory. Not just left to garbage collection. Privacy and storage hygiene combined."),
          narration:
            "Component three. State cleanup when the conversation ends. The user closes the conversation window, an idle timeout fires, or the user says goodbye explicitly — what happens to the accumulated state? Stored for analytics if needed with proper PII handling per your privacy policy. Cleaned from active runtime memory so it doesn't bleed into a new conversation from the same user starting later. Not just left to whatever garbage collection happens in the runtime. The end-of-conversation handling is privacy and storage hygiene combined. Many agent deployments miss this and accumulate state across conversations in ways that surprise the team in audits. Configure the cleanup explicitly during agent setup.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'The test before launch',
        "Spin up 10 concurrent user sessions hitting the agent with overlapping requests. Verify state isolation holds. Verify session state cleans up correctly on disconnect. Verify no cross-user data leakage. Concurrent-user testing is non-optional for production agents."),
      calloutNarration:
        "The test to run before launching any agent to production. Spin up ten concurrent user sessions hitting the agent with overlapping requests — for example, all ten sessions starting similar conversations at the same time, then continuing with different paths. Verify state isolation holds — user A's preferences don't appear in user B's session. Verify session state cleans up correctly when each session disconnects. Verify no cross-user data leakage in the agent's responses, logs, or persisted analytics. Concurrent-user testing is non-optional for production agents — single-user testing in the dev environment doesn't catch the state isolation failures that emerge only under concurrent load. The test takes an afternoon. Run it. The cost of discovering data leakage in production is asymmetric.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter five — knowledge sources, MCP, and Dataverse grounding.</p>`,
      narrationLead:
        "Three anchors before chapter five — knowledge sources, MCP, and Dataverse grounding.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three differences make an agent',
            "State across turns (multi-turn context) · goal-oriented reasoning (decide what to invoke) · tool composition (chain actions creatively). If your problem doesn\'t need these, use topics — cheaper, faster, more debuggable."),
          narration:
            "One. Three differences make an agent an agent versus a topic-based bot dressed up. State across many turns — multi-turn context the agent uses for follow-up understanding. Goal-oriented reasoning — agent decides which component to invoke based on user goal, not just trigger phrase matching. Tool composition — agent chains actions creatively from its toolbox. If your problem doesn't need these three capabilities, use topics — cheaper to run, faster to respond, more debuggable. Don't dress topic-based bots as agents for marketing reasons; don't avoid agents when the problem genuinely needs them.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three orchestration patterns',
            "Question-answer agent with retrieval (FAQ-style, productive in first month) · transactional agent with action chains (workflow automation, careful scoping needed) · research/exploration agent (highest capability and risk, gate to specific user populations)."),
          narration:
            "Two. Three orchestration patterns for production agents. Question-answer agent with structured retrieval — FAQ-style, productive in the first month of build, value depends mostly on knowledge source quality. Transactional agent with action chains — workflow automation gathering information across turns and executing chains of actions, higher build effort, requires careful action scoping and error handling. Research and exploration agent — open-ended path-finding through complex topics, highest capability ceiling, hardest to test and govern, use carefully and gate to specific user populations. Match the pattern to your problem; don't default to the demo's pattern.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three state architecture components',
            "Per-user state isolation (no leakage between users) · explicit persistence boundaries (persist what should persist; not bloated) · cleanup on conversation end (privacy and storage hygiene). Run concurrent-user test before launch — non-optional."),
          narration:
            "Three. Three components in the production state architecture. Per-user state isolation with variables scoped per user session — no leakage between users under concurrent load. Explicit persistence boundaries decided during design — what persists across turns versus what's ephemeral, not bloated state slowing the agent. Cleanup on conversation end — stored for analytics with proper PII handling, cleaned from active runtime memory, not left to runtime garbage collection. Run the concurrent-user test before launch — ten sessions hitting the agent simultaneously, verify isolation and cleanup hold. The cost of discovering data leakage in production is asymmetric; the test cost is an afternoon.",
        },
      ],
      narrationTrail:
        "Chapter five — knowledge sources, Model Context Protocol, and Dataverse grounding. The retrieval architecture that decides what the agent can know. See you there.",
    },
  ],
}
