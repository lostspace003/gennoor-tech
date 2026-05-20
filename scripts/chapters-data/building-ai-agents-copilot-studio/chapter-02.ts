import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const copilotStudioChapter02: Chapter = {
  courseId: 'building-ai-agents-copilot-studio',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-topics-vs-generative',
  title: 'Topic design vs generative answers',
  subtitle: 'When to use each · the four-question decision framework · the topic-explosion anti-pattern most teams hit by their twentieth topic.',
  slides: [
    // SLIDE 1
    {
      title: 'Topic design vs generative answers',
      iconKey: 'compass',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">The decision between topics and generative answers per intent is the most consequential and most often-wrong decision in Copilot Studio agents. Get the framework right and the agent stays maintainable. Get it wrong and you hit topic explosion by the twentieth topic.</p>`,
      narrationLead:
        "Welcome to chapter two. Topic design versus generative answers. The decision between topics and generative answers per user intent is the most consequential and most often-wrong decision builders make in Copilot Studio agents. Get the framework right and your agent stays maintainable as it grows. Get it wrong and you hit topic explosion by the twentieth topic — hundreds of topics nobody can maintain, overlapping triggers, recognition failures, and a maintenance bill that exceeds the agent's value. Four-question decision framework. Topic-explosion anti-pattern and how to avoid it. The hybrid pattern most production agents converge to.",
    },
    // SLIDE 2
    {
      title: 'The four-question decision framework',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The framework',
      bodyHtml: `<p>Four questions per user intent. The answers tell you topic, generative, or hybrid. Run the framework explicitly during agent design — not by intuition during the build.</p>`,
      narrationLead:
        "Four questions per user intent. The answers tell you whether that intent should be served by a topic, by generative answers, or by a hybrid pattern. Run the framework explicitly during agent design — list the intents, answer the four questions for each, document the decision. Don't make these decisions by intuition during the build phase because the build pressure pushes toward whatever's faster to ship, which is usually topics, which compounds into topic explosion. Discipline upfront. Here are the four questions.",
      steps: [
        {
          html: stepCard('flag', 'blue', 'Question 1 — Is the response deterministic and structured?',
            "Reset password instructions, return policy, business hours — same answer every time. Topic. Open question like \"how do I best onboard a new finance hire\" — varied answer based on context. Generative."),
          narration:
            "Question one. Is the response deterministic and structured — meaning the same input should produce the same answer every time? Reset password instructions are always the same five steps. Return policy is always the same paragraph. Business hours are always the same listing. These are topics. The agent should give a predictable response that you can update in one place. Compare with — how do I best onboard a new finance hire — varied answer depending on the role specifics, the team, the systems involved. The right answer here is to retrieve relevant content from your onboarding knowledge base and generate a contextual response. Generative answers. Determinism is the first signal.",
        },
        {
          html: stepCard('flag', 'blue', 'Question 2 — Does the response require actions (side effects)?',
            "Submit a ticket, create a record, send an email, kick off a workflow. Topic with actions in the flow. Generative answers can\'t reliably trigger actions — actions need explicit trigger logic. Action-bearing intents are always topics."),
          narration:
            "Question two. Does the response require actions with side effects — submit a ticket, create a record, send an email, kick off a workflow? Actions are always topics. Topics have explicit action nodes that you can trigger with explicit logic. Generative answers can't reliably trigger actions because the LLM may or may not invoke the action call depending on its interpretation of the conversation. Action-bearing intents — anything that changes state in your systems — are always topics. The exception increasingly is agents that orchestrate over topics and call actions through controlled paths — chapter four covers this. For now, the rule — actions belong in topics, not in generative answers.",
        },
        {
          html: stepCard('flag', 'blue', 'Question 3 — Is the question space finite and known?',
            "FAQ-style — finite intent set, you can enumerate them. Topics work great when the space is bounded. Open-ended Q&A across a large knowledge base — infinite question space. Generative. Don\'t try to enumerate the infinite as topics."),
          narration:
            "Question three. Is the question space finite and known — can you enumerate the user intents? FAQ-style agents with a bounded question space — list the questions, they're a known set, you can write a topic per intent. Topics work great here and stay maintainable. Open-ended question-and-answer across a large knowledge base — what does our company policy say about X, where X varies across thousands of possibilities — infinite question space. Don't try to enumerate the infinite as topics. Generative answers retrieves from the knowledge source and generates the response. The enumeration test is the third signal — and it's the one that drives the topic explosion anti-pattern when builders try to handle the infinite with topics.",
        },
        {
          html: stepCard('flag', 'blue', 'Question 4 — Is the input variation high or low?',
            "Low variation — \"hours\", \"opening time\", \"when do you open\" — same intent, three phrasings. Topic with synonym list works. High variation — questions phrased in dozens of ways with technical vocabulary that overlaps across intents — generative answers handles disambiguation better than topic triggers."),
          narration:
            "Question four. Is the input variation high or low? Low variation — for example hours, opening time, when do you open — same intent expressed in three phrasings. Topic with a synonym list works fine. The trigger phrase configuration captures the variations explicitly. High variation — questions phrased in dozens of ways with technical vocabulary that overlaps across intents — topic triggers start to misfire or compete for the same input. Generative answers handles input variation better than topic triggers because the model interprets the intent rather than matching to predefined trigger phrases. The variation test is the fourth signal. When variation is high enough that you'd need fifteen or twenty trigger phrases per topic, lean toward generative.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'How to use the framework',
        "Score each intent across the four questions. Three or four answers point to topic — make it a topic. Three or four point to generative — generative answers handles it. Mixed — likely hybrid pattern (topic triggers for the structured part, generative for the fallback)."),
      calloutNarration:
        "How to use the framework operationally. Score each user intent across the four questions. Three or four answers pointing to topic — make it a topic. Three or four pointing to generative — generative answers handles it. Mixed answers — likely a hybrid pattern where the topic handles the structured part of the intent and generative answers handles the fallback when the topic conditions aren't met. Most production agents end up with seventy to eighty percent topics for the structured deterministic intents and twenty to thirty percent generative answers for the open-ended fallback. Anything outside this range — either ninety percent topics or fifty percent generative — usually signals the framework wasn't applied and an anti-pattern is developing.",
    },
    // SLIDE 3
    {
      title: 'The topic-explosion anti-pattern',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The anti-pattern',
      bodyHtml: `<p>Topic explosion is the dominant failure mode for Copilot Studio agents past the first month. Symptoms appear gradually; consequences hit at scale. Recognise the symptoms early; restructure before it\'s painful.</p>`,
      narrationLead:
        "Topic explosion is the dominant failure mode for Copilot Studio agents past the first month of growth. Symptoms appear gradually as topic count grows. Consequences hit at scale when you have a hundred-plus topics, overlapping triggers, recognition failures the user sees, and a maintenance bill that exceeds the agent's actual value. Recognise the symptoms early. Restructure before it's painful. Three symptoms to watch for, three causes to address.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Symptom 1 — Trigger phrase overlap',
            "Two topics fire on similar phrases. The agent picks one based on tie-breaker logic — sometimes the wrong one. User experiences inconsistent agent behaviour. Watch for this around 30+ topics."),
          narration:
            "Symptom one. Trigger phrase overlap. Two or more topics have trigger phrases that fire on similar user inputs. The Copilot Studio runtime picks one topic based on its internal tie-breaker logic — which sometimes selects the wrong one for the user's actual intent. User experiences the agent giving the wrong response and re-asking phrased differently — and getting a different topic. Inconsistent agent behaviour. Watch for this symptom starting around thirty or more topics in the same agent. The remediation is to consolidate overlapping topics or to introduce a routing topic that disambiguates explicitly. Don't ignore the symptom; it compounds.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Symptom 2 — Maintenance fatigue',
            "Updating a single piece of information requires editing seven topics because the information was duplicated across them. Updates miss some topics; agent becomes internally inconsistent. The maintenance bill grows non-linearly with topic count."),
          narration:
            "Symptom two. Maintenance fatigue. Updating a single piece of business information — for example, a policy change, a price update, a process change — requires editing seven topics because the information was duplicated across them during the original authoring. Updates miss some of the seven; the agent becomes internally inconsistent — saying one thing in one flow and another thing in a different flow. The maintenance bill grows non-linearly with topic count because the duplication compounds. The remediation is to extract the duplicated information into variables or knowledge sources that the topics reference. Address this early, around twenty to thirty topics, before the duplication is embedded across the topic estate.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Symptom 3 — Recognition rate degrades',
            "Built-in metrics show the agent recognising intents at lower rates over time as topic count grows. New topics fragment the trigger space. Eventually user sees \"I didn\'t understand\" more often. The metric to watch is recognition rate per session."),
          narration:
            "Symptom three. Recognition rate degrades over time as topic count grows. The Copilot Studio built-in metrics show the agent recognising intents at lower rates than it did when there were fewer topics. New topics fragment the trigger phrase space — the agent's internal logic has more candidates to choose between for the same input, and recognition accuracy decreases. Eventually the user sees the agent's I didn't understand response more often, which damages trust in the agent. The metric to watch is recognition rate per session — track it in the Copilot Studio analytics. If it's declining as you add topics, the topic estate is becoming the bottleneck and the anti-pattern is developing.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'The three causes underneath',
        "Cause 1 — using topics for things that should be generative (infinite question space). Cause 2 — granular topics where one consolidated topic would serve. Cause 3 — no shared variables or sub-topics. Address all three to fix the explosion."),
      calloutNarration:
        "The three causes that produce topic explosion. Address each one. Cause one — using topics for things that should be generative answers, typically open-ended question spaces the builder tried to enumerate as topics. Move them to generative answers with the knowledge source. Cause two — overly granular topics where one consolidated topic with conditional branches would serve better than five separate topics. Consolidate. Cause three — no shared variables or sub-topics for information used in multiple flows. Extract the shared information into Power Fx variables or sub-topics that the parent topics reference. Address all three causes when restructuring. Doing one without the others doesn't fix the underlying explosion pattern.",
    },
    // SLIDE 4
    {
      title: 'The hybrid pattern most production agents reach',
      iconKey: 'sparkles',
      eyebrow: 'Lesson 3 · The hybrid',
      bodyHtml: `<p>Mature Copilot Studio agents converge on a hybrid pattern — topics for the deterministic core, generative answers for the open-ended fallback, and explicit routing between them. Three principles that make the hybrid work.</p>`,
      narrationLead:
        "Mature Copilot Studio agents in production converge on a hybrid pattern across teams and industries. Topics handle the deterministic core of well-defined intents with actions. Generative answers handles the open-ended fallback when no topic matches. Explicit routing between them prevents the worst-of-both pattern where users get inconsistent responses. Three principles that make the hybrid work in practice and that distinguish it from the failure modes of either extreme.",
      steps: [
        {
          html: stepCard('check', 'green', 'Principle 1 — Topics for actions, generative for retrieval',
            "Anything that takes an action — submit, create, send, trigger — is a topic. Anything that retrieves information from a knowledge source — what, how, when, where — defaults to generative. The split is structural; honour it."),
          narration:
            "Principle one. Topics for actions; generative for retrieval. Anything that takes an action with side effects in your systems — submit a request, create a record, send an email, trigger a workflow — is a topic with explicit action nodes. Anything that retrieves information from a knowledge source for the user — what's our policy, how do I do X, when do we offer Y — defaults to generative answers with the knowledge source configured. The split between actions and retrieval is structural. Honour it. Don't try to make generative answers trigger actions — it's unreliable. Don't try to make topics handle open-ended retrieval — it's the explosion pattern.",
        },
        {
          html: stepCard('check', 'green', 'Principle 2 — Explicit fallback path',
            "When no topic matches, generative answers fires with the configured knowledge source. When generative can\'t answer confidently, route to an explicit human-handoff topic — not a vague \"sorry I don\'t understand\". The fallback chain is part of the design."),
          narration:
            "Principle two. Explicit fallback path from topics through generative to human handoff. When no topic matches the user's input, generative answers fires with the configured knowledge source and produces a contextual response. When generative answers can't produce a confident response — for example because the knowledge source doesn't cover the question — route to an explicit human-handoff topic that captures the request and either transfers to a live agent or files a ticket. Not the vague sorry I don't understand response that frustrates users. The fallback chain — topic, generative, human handoff — is part of the agent design, configured explicitly during build, not left to the runtime's default behaviour.",
        },
        {
          html: stepCard('check', 'green', 'Principle 3 — Continuous monitoring of the split',
            "Track the ratio of user inputs handled by topics vs generative vs falling through to handoff. Ratio shifts surface intent patterns you didn\'t design for. Use the data to reorganise — new topics for high-volume generative hits, retire low-use topics."),
          narration:
            "Principle three. Continuous monitoring of which component handled each user input. Track the ratio of inputs handled by topics versus generative answers versus falling through to human handoff. Ratio shifts over time surface intent patterns you didn't design for at launch. High-volume hits in generative answers — for a specific question category — signal you should promote that intent to a topic for better consistency. Low-use topics that fire rarely — consider retiring them if they're no longer relevant. The monitoring is the discipline that prevents both topic explosion (too many low-use topics) and generative drift (too much open-ended fallback). Schedule the review monthly with the agent owner. Use the data to reorganise quarterly.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter three — plugins and connectors.</p>`,
      narrationLead:
        "Three anchors before chapter three — plugins and connectors at production scale.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four-question framework per intent',
            "Determinism · actions/side effects · finite or infinite question space · input variation. Score each intent; three+ answers pointing the same way decides topic vs generative. Mixed answers signal hybrid pattern."),
          narration:
            "One. Four-question decision framework applied per user intent during agent design. Determinism — is the response always the same. Actions — does the response require side effects in systems. Finite or infinite — can you enumerate the question space. Input variation — high or low. Score each intent. Three or four answers pointing to topic — make it a topic. Three or four pointing to generative — generative handles it. Mixed answers signal a hybrid pattern with topic for structured part and generative for fallback. Run the framework explicitly in design, not by intuition during build.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three symptoms of topic explosion',
            "Trigger phrase overlap (wrong topics firing) · maintenance fatigue (duplication across topics) · recognition rate degradation. Address by moving infinite spaces to generative, consolidating granular topics, extracting shared info into variables and sub-topics."),
          narration:
            "Two. Three symptoms of topic explosion to watch for. Trigger phrase overlap producing the wrong topic firing on user input. Maintenance fatigue from updates having to touch seven topics for one business change. Recognition rate degrading over time as the topic count grows. Address by three causes — move infinite question spaces to generative answers, consolidate granular topics into fewer topics with branches, extract shared information into Power Fx variables and sub-topics that multiple topics reference. Recognising the symptoms around twenty to thirty topics is the right time to restructure; waiting until a hundred topics is painful.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three hybrid principles',
            "Topics for actions, generative for retrieval · explicit fallback chain (topic → generative → human handoff) · continuous monitoring of the split. Mature production agents converge to this pattern; build for it from chapter one."),
          narration:
            "Three. Three principles for the hybrid pattern that mature production agents converge to. Topics for actions with side effects, generative for retrieval from knowledge sources — the split is structural. Explicit fallback chain from topic through generative to human handoff, designed in not left to runtime defaults. Continuous monitoring of which component handled each user input, with monthly review of the ratio and quarterly reorganisation based on the data. Build for the hybrid pattern from chapter one of the agent design rather than rebuilding into it later when you've hit one of the failure modes of the extremes.",
        },
      ],
      narrationTrail:
        "Chapter three — plugins and connectors at production scale. Auth patterns, error handling, rate limits. See you there.",
    },
  ],
}
