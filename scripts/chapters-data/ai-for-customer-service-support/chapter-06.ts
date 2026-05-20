import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter06: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-sentiment-escalation',
  title: 'Sentiment, escalation, and frontline trust',
  subtitle: 'The support-not-surveillance line · the escalation logic teams actually rely on · the three trust signals that decide whether agents lean in or work around.',
  slides: [
    // SLIDE 1
    {
      title: 'Sentiment, escalation, and frontline trust',
      iconKey: 'shield',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Sentiment AI and escalation logic are powerful tools — and the easiest place in CS-AI to fracture the trust of your frontline team. Get the framing right and the team leans in. Get it wrong and the team quietly disengages from the entire AI rollout.</p>`,
      narrationLead:
        "Welcome to chapter six. Sentiment, escalation, and frontline trust. Sentiment AI and escalation logic are powerful operational tools when deployed well — better routing decisions, earlier intervention on at-risk customers, real coaching signal for supervisors. They are also the easiest place in the entire customer service AI rollout to fracture the trust of your frontline team. Once trust is broken with the team, every other AI deployment in the contact centre becomes harder to land. Get the framing right and the team leans in. Get it wrong and the team quietly disengages from the entire AI rollout, regardless of how good the other pieces are. The line and the framing are the substance of this chapter.",
    },
    // SLIDE 2
    {
      title: 'The support-not-surveillance line',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · The line',
      bodyHtml: `<p>Three principles separate support from surveillance. They are the difference between AI the team experiences as their advocate and AI the team experiences as the boss watching.</p>`,
      narrationLead:
        "Three principles that separate support from surveillance. Same underlying signals — tone, pace, dead air, escalation language. Same technology. Different framing. Different uses. Different team experience. The principles are the difference between AI the team experiences as their advocate and AI the team experiences as the boss watching their every word. Get the principles right at the start. Backing them in later is much harder.",
      steps: [
        {
          html: stepCard('check', 'green', 'Principle 1 — Signals route to the agent first, not the supervisor',
            "Tone signal flags 'customer frustrated'. It arrives in the agent's interface as a quiet nudge — slow down, acknowledge the frustration. It does NOT route to the supervisor as a performance flag. Used for support in the moment, not management oversight."),
          narration:
            "Principle one. Signals route to the agent first, not to the supervisor. When the sentiment AI detects a frustration signal — for example, the customer's tone is escalating, dead air is increasing, escalation language is appearing — the signal arrives in the agent's interface as a quiet, supportive nudge. For example, customer seems frustrated, consider acknowledging it before continuing. The signal does not route to the supervisor as a performance flag in the agent's record. The signal is used for support in the live moment, not for management oversight after the fact. This single principle is the difference between framing AI as agent-supportive technology versus framing it as agent-surveillance technology. Choose framing one. Configure the routing to match.",
        },
        {
          html: stepCard('check', 'green', 'Principle 2 — Aggregated patterns inform coaching, not punishment',
            "Pattern detection across calls — surfaced in monthly coaching reviews as 'here's a technique to develop'. NEVER surfaced in disciplinary contexts. Used to grow the team, never to punish individual moments. Different uses produce different team responses."),
          narration:
            "Principle two. Aggregated patterns inform coaching conversations, not punishment. Pattern detection across many calls — for example, this agent consistently struggles with billing-dispute interactions — surfaces in monthly coaching reviews as a technique to develop, with the supervisor offering specific learning resources or shadowing time. The same pattern data is never surfaced in disciplinary contexts — even when the agent's quarterly metrics underperform, the AI pattern data is not the evidence used. Used to grow the team. Never to punish individual moments captured in transcripts. Different uses produce different team responses. The team has to see the rule applied consistently for months before they trust it. Apply it consistently.",
        },
        {
          html: stepCard('check', 'green', 'Principle 3 — Transparency about what the AI watches',
            "The team knows, in writing, exactly what signals the AI tracks. No hidden monitoring. The agents helped design the signal definitions in the rollout. Transparency is what makes the rest of the framing credible."),
          narration:
            "Principle three. Transparency about exactly what the AI watches. The team knows, in writing, exactly what signals the sentiment AI tracks during conversations. No hidden monitoring. No surprise capabilities that get revealed later. The agents helped design the signal definitions during the rollout — what counts as frustration, what counts as escalation language, what gets flagged for supervisor visibility versus what stays agent-only. Transparency is what makes the rest of the framing credible to the team. Without it, agents assume the worst about what's being watched, and the assumption itself produces the trust fracture even if the actual surveillance is benign. Write down what's tracked. Share it. Update it openly when capabilities change.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'The conversation to have explicitly',
        "The first conversation with the team about sentiment AI is the one where you commit to all three principles in writing. If you can't commit to them, don't deploy sentiment AI. Deploy without the principles and you fracture the team's trust in the whole AI program."),
      calloutNarration:
        "The conversation to have explicitly with the team before deploying sentiment AI. The first conversation is where you commit to all three principles in writing — signals route to the agent first, aggregated patterns inform coaching not punishment, full transparency about what's tracked. The commitment needs to be specific, in writing, and credible. If you can't make those commitments — for instance because contact-centre leadership intends to use AI patterns in performance reviews — then don't deploy sentiment AI. Deploy without the principles in place and you fracture the team's trust in the entire AI program. Recovery from that fracture takes longer than rebuilding the whole AI deployment from scratch. The commitment is upstream of the rollout, not downstream of it.",
    },
    // SLIDE 3
    {
      title: 'The escalation logic teams rely on',
      iconKey: 'flag',
      eyebrow: 'Lesson 2 · The escalation',
      bodyHtml: `<p>Three components in escalation logic that teams actually rely on. Skip one and either the AI escalates everything (noise) or escalates nothing (waste). Both fail the team.</p>`,
      narrationLead:
        "Three components in escalation logic that frontline teams actually rely on and use day-to-day. Skip one component and either the AI escalates everything — producing alert fatigue and supervisor overload — or escalates nothing — producing missed at-risk customers and the question of why the AI was deployed at all. Both failure modes are common. Both are preventable with the three-component architecture below.",
      steps: [
        {
          html: stepCard('flag', 'blue', 'Component 1 — Tiered signal severity',
            "Three severity levels. Yellow — supervisor visibility, no action required (informational). Orange — supervisor reviews within the hour. Red — supervisor joins or takes over immediately. Tiering is what makes signals actionable rather than noisy."),
          narration:
            "Component one. Tiered signal severity. Three severity levels for sentiment and escalation signals. Yellow severity — supervisor visibility, no action required, informational only. For example, mild frustration detected, agent is handling. Orange severity — supervisor reviews the situation within the hour. For example, customer mentioned cancellation or has been on hold past the standard SLA. Red severity — supervisor joins the call immediately or takes it over. For example, customer used a complaint-escalation keyword like ombudsman or threatening legal action, or the agent explicitly requested supervisor help. Tiering is what makes signals actionable rather than noisy. Without tiering, supervisors get alerted to everything and alerts become invisible within a week.",
        },
        {
          html: stepCard('flag', 'amber', 'Component 2 — Agent-requested escalation always wins',
            "If the agent flags 'I need help', the signal is always orange or red regardless of what the AI scored. Agent judgment overrides AI judgment in escalation. This is non-negotiable and the team needs to know it."),
          narration:
            "Component two. Agent-requested escalation always wins. If the agent flags I need help, the signal is treated as orange or red regardless of what the AI's sentiment scoring said about the call. Agent judgment overrides AI judgment in escalation decisions. This is non-negotiable and the team needs to know explicitly that it's the rule. The principle here matters beyond the operational mechanic — it tells the team that AI in escalation is supportive of their judgment, not replacing it. Without this rule, agents stop asking for help in marginal situations because they assume the AI didn't score it as bad enough. With this rule, agents trust they can request help freely and the system will respond. Configure agent-requested escalation as the override. Communicate it explicitly.",
        },
        {
          html: stepCard('flag', 'green', 'Component 3 — Supervisor capacity gate',
            "Don't fire red-level alerts faster than supervisors can respond. If you have 3 supervisors and 10 red alerts firing simultaneously, the system needs to queue and route — and if necessary, downgrade the threshold for an hour to manage capacity."),
          narration:
            "Component three. Supervisor capacity gate. The escalation system has to be aware of supervisor capacity in real time. If you have three supervisors on shift and ten red-level alerts firing simultaneously across the contact centre, supervisors can't respond to all of them within the SLA the system implicitly promised. The system must queue red alerts intelligently, route based on supervisor specialisation and current load, and if necessary, downgrade the red threshold for an hour to manage capacity surge — for example, accepting that during peak overflow only the very highest-severity reds get the immediate supervisor join. The capacity gate prevents the failure mode where the escalation system promises supervisor support that doesn't actually arrive. Configure capacity awareness explicitly. Test under simulated peak load before relying on it in production.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three signals that decide whether agents lean in',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Trust signals',
      bodyHtml: `<p>Three signals the team watches to decide whether they trust the AI rollout. The team isn't watching the KPI dashboard — they're watching these. Send the right signal on all three.</p>`,
      narrationLead:
        "Three signals the team watches closely during the AI rollout to decide whether they trust the program or whether they quietly disengage. The team isn't watching the KPI dashboard the executive team watches. They're watching these three signals. Send the right signal on all three during the first ninety days and the team leans in for the full deployment. Send the wrong signal on any one of the three and the team disengages — and disengagement is hard to reverse.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Signal 1 — Does feedback from agents change the deployment?',
            "When agents raise concerns — 'this suggestion is wrong for our customer base' — does the rollout adjust, or does leadership push past the feedback? Agents watch this in the first month. Adjustments build trust; pushing past builds resentment."),
          narration:
            "Signal one. Does feedback from agents actually change the deployment? When agents raise concerns during the rollout — for example, the AI suggestions don't fit our customer base, this workflow step adds friction, this metric is being measured wrong — does the rollout team actually adjust based on the feedback, or does leadership push past the feedback to hit the launch date? Agents watch this very closely in the first month. Visible adjustments based on agent feedback build trust quickly and durably. Pushing past feedback to hit dates builds resentment and silent disengagement that's hard to reverse. The signal the team is reading is — does my voice matter in this program? Make sure the answer is visibly yes.",
        },
        {
          html: stepCard('users', 'blue', 'Signal 2 — Are supervisors using AI patterns supportively?',
            "In one-on-ones, supervisors who say 'I noticed the AI flagged X — how can I help?' send the support signal. Supervisors who say 'the AI shows you struggling with X — what's going on?' send the surveillance signal. Same data, different framing, opposite responses."),
          narration:
            "Signal two. Are supervisors using AI patterns supportively or punitively in one-on-ones? In coaching conversations, supervisors who say I noticed the AI flagged that you've been handling more billing-dispute calls than usual, how can I support you on those send the support signal. Same data, different framing — supervisors who say the AI shows you struggling with billing disputes, what's going on send the surveillance signal. Same underlying pattern. Opposite team responses. Train supervisors explicitly on framing. The supervisor's framing is the signal that decides whether AI in coaching feels supportive or surveillance-y to the team. Most supervisors default to whichever framing is natural to them; explicit training is what shifts the natural defaults toward support framing.",
        },
        {
          html: stepCard('users', 'blue', 'Signal 3 — Is anyone getting fired because of AI signals?',
            "If an agent gets terminated and the reason traces to AI-detected patterns, the team learns the truth about how AI is actually used. The rumor travels in two days. Trust collapses. Use AI to grow the team — never to terminate."),
          narration:
            "Signal three. Is anyone getting fired because of AI signals? If an agent gets terminated and the actual reason traces — even partly — to AI-detected patterns in their calls or chats, the team learns the truth about how AI is actually being used in your contact centre. The rumor travels through the team in two days. Trust in the AI program collapses immediately and broadly. Use AI signals to grow the team — coaching, learning resources, peer pairing. Never use them as termination evidence. If an agent's performance genuinely requires termination, the evidence comes from human supervisor observation and the standard performance management process — not from AI pattern data. This separation is what makes the AI program durable across the team's tenure. Maintain it as a non-negotiable.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter seven — voice support AI.</p>`,
      narrationLead:
        "Three anchors before chapter seven — voice support AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three support-not-surveillance principles',
            "Signals route to the agent first · aggregated patterns inform coaching, never punishment · full transparency about what\'s tracked. Commit in writing before deploying sentiment AI. Without the commitment, don\'t deploy."),
          narration:
            "One. Three support-not-surveillance principles. Signals route to the agent first in the live moment, not to the supervisor as a performance flag. Aggregated patterns inform coaching conversations, never punishment or disciplinary contexts. Full transparency about exactly what the AI tracks — agents helped design the signal definitions. Commit to all three in writing before deploying sentiment AI. If the commitment can't be made — for instance because leadership intends to use AI patterns in performance reviews — don't deploy. The team-trust cost of deploying without the commitments is asymmetric.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three escalation logic components',
            "Tiered signal severity (yellow/orange/red) · agent-requested escalation always wins · supervisor capacity gate. Skip one and escalations either become noise or get missed."),
          narration:
            "Two. Three escalation logic components. Tiered signal severity — yellow informational, orange supervisor review within an hour, red immediate supervisor join or takeover. Agent-requested escalation always wins over AI scoring — the agent's judgment overrides the AI's in escalation decisions, non-negotiable. Supervisor capacity gate — the system queues alerts based on real-time supervisor capacity and downgrades thresholds during surge to keep the SLA honest. Skip any one component and escalations either become noise or get missed entirely.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three team-trust signals to send right',
            "Visible adjustment based on agent feedback · supervisor coaching framing (support not surveillance) · no terminations traced to AI signals. Get all three right in the first 90 days; team leans in for the full deployment."),
          narration:
            "Three. Three team-trust signals the team is watching closely during the rollout. Visible adjustment of the deployment based on agent feedback in the first month. Supervisor coaching framing that's explicitly supportive — train supervisors on the language explicitly, don't rely on natural defaults. No terminations traced even partly to AI-detected patterns — performance management goes through human supervisor observation and standard process, AI signals are coaching tools only. Get all three right in the first ninety days and the team leans in for the full AI program. Get any one wrong and the team disengages, which is much harder to reverse than it is to prevent.",
        },
      ],
      narrationTrail:
        "Chapter seven — voice support AI. Where voice AI ships and where it doesn't, plus the production gotchas in voice deployments. See you there.",
    },
  ],
}
