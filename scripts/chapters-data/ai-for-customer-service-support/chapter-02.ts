import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter02: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-agent-assist',
  title: 'Agent assist done right',
  subtitle: 'The four-component stack · three anti-patterns the agents will tell you about · the rollout rhythm that lands the productivity gain.',
  slides: [
    // SLIDE 1
    {
      title: 'Agent assist done right',
      iconKey: 'users',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Agent assist is the highest-ROI customer service AI deployment available. Done well, handle time drops 25–40% and CSAT rises. Done badly, agents quietly stop using it within a quarter and the productivity case dies.</p>`,
      narrationLead:
        "Welcome to chapter two. Agent assist done right. Agent assist is the highest-ROI customer service AI deployment available to almost every team. Done well, average handle time drops twenty-five to forty percent and customer satisfaction rises because agents give more accurate answers. Done badly — and there are several specific ways to do it badly — agents quietly stop using the tool within a quarter and the productivity case dies on the next budget review. The difference is the four-component stack, the three anti-patterns to avoid, and the rollout rhythm that actually lands the gain in rep behaviour. All three are in this chapter.",
    },
    // SLIDE 2
    {
      title: 'The four-component stack',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The stack',
      bodyHtml: `<p>Four components deployed together. Each one alone helps. Together they compound. Most teams deploy two and wonder why the productivity claim from the vendor didn't materialise.</p>`,
      narrationLead:
        "Four components deployed together. Each component alone helps modestly. Together they compound into the twenty-five to forty percent handle-time reduction the vendor promised in the pitch. Most teams deploy two of the four and wonder why the headline productivity claim didn't materialise in their actual numbers. Deploy all four.",
      steps: [
        {
          html: stepCard('sparkles', 'blue', 'Component 1 — Suggested next response',
            "AI listens to the chat or call. Suggests the next reply. Agent accepts, edits, or rewrites. Saves 30–90 seconds per interaction. Acceptance rate of 60–75% is healthy; below 40% means the suggestions aren't relevant."),
          narration:
            "Component one. Suggested next response. AI listens to the chat or call. Surfaces a suggested next reply to the agent. The agent accepts the suggestion with one click, edits it, or rewrites entirely. Saves typically thirty to ninety seconds per interaction. Acceptance rate is the leading indicator — sixty to seventy-five percent acceptance is healthy. Below forty percent acceptance, the suggestions aren't relevant enough — usually because the underlying model wasn't fine-tuned on your actual contact mix. Track acceptance rate weekly during rollout and after. It's the canary metric for the whole agent-assist deployment.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Component 2 — Knowledge answer surfacing',
            "Agent asks 'what's our policy on X' in a side panel. AI returns the answer with citation. Resolves the lookup problem that wastes minutes per call. Citations are non-negotiable — without them, hallucinated policies leak in."),
          narration:
            "Component two. Knowledge answer surfacing. The agent asks a natural-language question in a side panel — what's our policy on returns past sixty days, what's our SLA for enterprise customers in Europe. The AI returns the answer with an explicit citation to the source knowledge base article. This resolves the policy-lookup problem that wastes minutes per call in most contact centres — where agents currently navigate to a wiki, search, scroll, and read three articles to find the answer. Citations are non-negotiable. Without them, hallucinated policies leak into customer interactions and create the brand event you're trying to avoid. Configure the model to refuse to answer when it can't find a grounded source.",
        },
        {
          html: stepCard('zap', 'blue', 'Component 3 — Real-time call/chat coaching',
            "AI watches for tone, pace, dead air, customer escalation signals. Surfaces a quiet nudge to the agent — 'slow down', 'customer frustrated, acknowledge it', 'compliance disclosure needed here'. Used for support, not surveillance."),
          narration:
            "Component three. Real-time coaching during the call or chat. AI watches for tone, pace, dead air, customer escalation signals. Surfaces a quiet nudge to the agent in their interface — for example, slow down, customer is showing frustration, or you need the compliance disclosure here. The framing matters intensely. This is real-time agent support, not surveillance. The team needs to experience it as their advocate. Implementation must be transparent to agents — they know it's there, they know what it watches for, they helped design the signals. Get this framing right or component three becomes the reason the team rejects the whole rollout. Chapter six covers the support-versus-surveillance line in depth.",
        },
        {
          html: stepCard('check', 'blue', 'Component 4 — Auto case summary at wrap-up',
            "AI drafts the case summary, the next steps, and any CRM field updates after the conversation ends. Agent reviews in 10 seconds and confirms. Recovers 2–4 minutes per case — the biggest single time saving in the stack."),
          narration:
            "Component four. Auto case summary at wrap-up. After the conversation ends, AI drafts the case summary, the resolution status, the next steps, and any CRM field updates that follow from the conversation. The agent reviews in ten seconds and confirms. Recovers two to four minutes per case versus manual wrap-up — this is the biggest single time saving in the entire agent-assist stack for most contact centres. It also dramatically improves CRM data quality, which is its own compounding win for downstream analytics and for the next contact with that customer.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The component most teams skip',
        "Component 3 — real-time coaching. Skipped because it feels intrusive to deploy. But it's the component that lifts new-agent ramp time most. The trick is the framing: agent-controlled, transparent, designed with the team."),
      calloutNarration:
        "The component most teams skip. Component three — real-time coaching. Skipped because it feels intrusive to deploy and because the change-management lift is real. But it's the single component that most lifts new-agent ramp time — typically dropping new-hire time-to-productivity from twelve weeks to seven or eight when run well. Worth the change-management lift. The trick to landing it without rep resistance is framing — agent-controlled, transparent to the team, designed with team input, used in coaching sessions not in performance reviews. Get the framing right; component three pays for itself in ramp time alone.",
    },
    // SLIDE 3
    {
      title: 'Three anti-patterns the agents will tell you about',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The anti-patterns',
      bodyHtml: `<p>Three anti-patterns the team will quietly route around if you let them. Listen for these in agent feedback during rollout — they're the early signal that the deployment is sliding.</p>`,
      narrationLead:
        "Three anti-patterns the agents will tell you about — quietly, in informal feedback, in lunch conversations, in the way they stop using specific features. Listen for these during rollout. They are the early signal that the deployment is sliding from genuine productivity tool to something the team is silently working around. Fix all three; the deployment lands.",
      steps: [
        {
          html: stepCard('x', 'red', 'Anti-pattern 1 — Generic suggestions that ignore context',
            "AI suggests boilerplate that doesn't fit this specific customer's specific situation. Agents stop accepting suggestions within two weeks; the suggestion panel becomes wasted screen real estate."),
          narration:
            "Anti-pattern one. Generic suggestions that ignore context. The AI suggests boilerplate that doesn't fit this specific customer's specific situation — for example, suggesting a generic refund explanation when this customer is a multi-year enterprise account with a specific contract. Agents see two or three context-blind suggestions in a row, conclude the AI isn't smart enough to be useful, and stop accepting suggestions altogether. Within two weeks, the suggestion panel becomes wasted screen real estate. The fix — make sure the model has customer context including tier, history, and any open issues. If your AI suggestions aren't reading customer record, they can't be useful at scale.",
        },
        {
          html: stepCard('x', 'red', 'Anti-pattern 2 — Forced workflow that adds friction',
            "AI requires the agent to fill three new fields before each suggestion. Agents click through to dismiss the prompt. Adoption falls off a cliff. The tool was meant to save time — and the workflow design added 30 seconds per interaction."),
          narration:
            "Anti-pattern two. Forced workflow that adds friction. The AI requires the agent to fill three new fields before each suggestion — for example, classifying intent, confirming customer mood, selecting policy category. Agents click through to dismiss the prompt rather than fill it in real time during a live conversation. Adoption falls off a cliff. The tool was meant to save time and the workflow design added thirty seconds per interaction. Fix — design the AI workflow so it requires zero additional input from the agent during the live conversation. AI infers what it can. Anything the AI genuinely needs the agent to classify happens at wrap-up, not during the call.",
        },
        {
          html: stepCard('x', 'red', 'Anti-pattern 3 — Coaching feedback that arrives weeks late',
            "AI flagged a tone issue on a call three weeks ago. The agent doesn't remember the call. The feedback feels arbitrary and the coaching loses credibility. Coaching feedback must arrive within 48 hours or it's noise."),
          narration:
            "Anti-pattern three. Coaching feedback that arrives weeks late. The AI flagged a tone issue on a specific call three weeks ago. The supervisor brings it up in a quarterly review. The agent doesn't remember the call. The feedback feels arbitrary, possibly even punitive. The coaching loses credibility and the agent disengages from the coaching loop. Fix — coaching feedback from AI signals must reach the agent within forty-eight hours of the call, ideally same week, in a one-on-one rhythm. Beyond forty-eight hours the feedback becomes noise. Architect the feedback rhythm; don't treat AI coaching signals as evidence to surface later in performance reviews.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The rollout rhythm that lands the gain',
      iconKey: 'calendar',
      eyebrow: 'Lesson 3 · The rhythm',
      bodyHtml: `<p>Six weeks of disciplined rollout. Most teams compress it to two and lose half the available gain. The discipline is the productivity multiplier.</p>`,
      narrationLead:
        "Six weeks of disciplined rollout for agent assist. Most teams compress this to two weeks under timeline pressure and lose roughly half the available productivity gain because the team doesn't internalise the workflow change. The discipline is the productivity multiplier. Adapt the timeline to your contact-centre size; keep the rhythm. Here are the six weeks.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Weeks 1–2 — Pilot with 5–10 agents',
            "Small group, volunteers, mid-career — not top performers and not strugglers. Daily 15-minute standup. Daily acceptance-rate dashboard. Identify the context fixes and friction fixes before scaling. Most teams skip this."),
          narration:
            "Weeks one and two. Pilot with five to ten agents. Selected as volunteers, mid-career — explicitly not your top performers because their patterns are atypical, and explicitly not strugglers because their feedback gets confounded with their performance concerns. Daily fifteen-minute standup with the pilot group. Daily acceptance-rate dashboard reviewed in standup. Identify the context fixes — the model needs more customer-record visibility — and the friction fixes — that workflow step adds time, remove it — before scaling. Most teams skip this two-week pilot and roll out to the whole team in week one. They then spend the next two months debugging what the pilot would have surfaced cleanly.",
        },
        {
          html: stepCard('users', 'green', 'Weeks 3–4 — Expand to one full team (typically 20–40 agents)',
            "Full team. Weekly twenty-minute review. Add the team supervisor to the standup. Compare acceptance rates and handle time against pre-rollout baseline. Adjust suggestion quality and workflow before scaling further."),
          narration:
            "Weeks three and four. Expand to one full team, typically twenty to forty agents. Weekly twenty-minute review of the four KPIs in this rollout. Acceptance rate. Average handle time versus pre-rollout baseline. Case summary auto-acceptance rate. New-hire ramp velocity if you have new hires in the cohort. Add the team supervisor to the standup. Adjust suggestion quality and workflow design before going wider. Two weeks at one full team gives you the data to know what's actually working and what was pilot-specific noise.",
        },
        {
          html: stepCard('rocket', 'green', 'Weeks 5–6 — Full rollout with sustained rhythm',
            "All teams onboard with team supervisors as the multiplier. Weekly cadence at the team level (15 min, supervisor-led). Monthly cadence at the contact-centre leadership level (30 min, KPI review). Sustain or productivity drift hits."),
          narration:
            "Weeks five and six. Full rollout across all teams, with team supervisors as the multiplier — the supervisor runs the weekly fifteen-minute cadence with their team, not the contact-centre leadership trying to scale themselves. Monthly cadence at the contact-centre leadership level — thirty minutes, review the KPIs, identify trends, address drift early. The sustained rhythm is what prevents the productivity gain from drifting back to baseline. Without it, most contact centres see acceptance rates drop ten to fifteen percentage points in months three and four — agents falling back into old workflows. The cadence holds the gain.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter three — scoped tier-1 deflection bots.</p>`,
      narrationLead:
        "Three anchors before chapter three — scoped tier-1 deflection bots done well.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four-component stack',
            "Suggested next response · knowledge answer surfacing · real-time coaching · auto case summary at wrap-up. All four together compound. Most teams deploy two and miss the productivity headline."),
          narration:
            "One. Four-component stack deployed together. Suggested next response with acceptance rate as the canary metric. Knowledge answer surfacing with mandatory citations. Real-time coaching with the support-not-surveillance framing. Auto case summary at wrap-up as the biggest single time saving. All four compound. Most teams deploy two — usually one and four, because they're easiest — and miss the headline productivity claim from the vendor by half.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three anti-patterns',
            "Generic context-blind suggestions · forced workflow that adds friction · coaching feedback that arrives weeks late. Listen for these in agent feedback; they're the early signal that adoption is sliding."),
          narration:
            "Two. Three anti-patterns the agents will quietly route around. Generic suggestions that ignore customer context. Forced workflow that adds friction during the live conversation. Coaching feedback that arrives weeks after the call instead of within forty-eight hours. Listen for these in agent feedback — they are the early signal that the deployment is sliding from productivity tool to silently-worked-around system. Fix all three; deployment lands.",
        },
        {
          html: stepCard('check', 'green', 'Three — Six-week rollout rhythm',
            "Weeks 1–2 — small pilot. Weeks 3–4 — one full team. Weeks 5–6 — full rollout with supervisors as multipliers. Weekly team cadence, monthly leadership cadence — sustained — or the gain drifts back."),
          narration:
            "Three. Six-week disciplined rollout rhythm. Weeks one and two — small pilot of five to ten agents, daily standup, acceptance rate dashboard. Weeks three and four — one full team, weekly review, supervisor in the loop. Weeks five and six — full rollout with team supervisors running the weekly fifteen-minute cadence with their teams, monthly cadence at leadership level. Sustained rhythm is what prevents the productivity gain from drifting back to baseline in months three and four.",
        },
      ],
      narrationTrail:
        "Chapter three — scoped tier-1 deflection bots. When to deploy, how to scope, and the clean-handoff design that protects CSAT. See you there.",
    },
  ],
}
