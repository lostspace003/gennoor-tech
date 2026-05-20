import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter08: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your 4-week CS AI pilot plan',
  subtitle: 'Seven chapters down. One plan. Four weeks. The KPI scaffold that proves value and the four conversations to schedule on Monday.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your 4-week CS AI pilot plan',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In seven chapters, we built the operating view of customer service AI. Now — one plan. Four weeks. Specific enough to start Monday. Concrete enough to defend at your next contact-centre leadership meeting.</p>`,
      narrationLead:
        "Welcome to chapter eight. The capstone. In the previous seven chapters, we built the operating view of customer service AI. The fit map and the principle that AI handles volume while humans handle judgment. Agent assist done right. Scoped tier-1 deflection bots. Multilingual support at scale. Knowledge AI without hallucinated policies. Sentiment, escalation, and frontline trust. Voice support AI with the disclosure customers now expect. Now we collapse it. One pilot plan. Four weeks. Specific enough to start Monday. Concrete enough to defend at your next contact-centre leadership meeting and to brief the CIO on funding the broader rollout.",
    },
    // SLIDE 2
    {
      title: 'The 4-week pilot — one play, deeply',
      iconKey: 'calendar',
      eyebrow: 'Lesson 1 · The pilot',
      bodyHtml: `<p>One play, deeply, for four weeks. Not three plays shallowly. The pilot's job is to prove operational discipline, not to demonstrate breadth.</p>`,
      narrationLead:
        "One play, run deeply for four weeks. Not three plays shallowly. The pilot's job is to prove operational discipline — that your team can run the AI tool consistently, measure honestly, and adjust based on real signal. Not to demonstrate breadth across many AI capabilities. Pick agent assist as the default pilot play because it has the highest probability of clear-win results and the lowest brand risk. Adapt the four weeks to your team's contact volume.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Week 1 — Setup + baseline measurement',
            "Tool configured for 5–10 pilot agents. Three days of agent training on the new workflow. Pre-rollout baseline measured cleanly — handle time, CSAT, first-contact resolution. Without baseline, the post-pilot conversation has no anchor."),
          narration:
            "Week one. Setup and baseline measurement. Tool configured for the five to ten pilot agents — selected as volunteers, mid-career, neither top performers nor strugglers. Three days of agent training on the new workflow — what the AI does, what it doesn't do, what's expected of them, how feedback works. Pre-rollout baseline measured cleanly across the pilot agents — handle time on equivalent contact mix, CSAT on the same survey instrument, first-contact resolution rate. Without a clean baseline, the post-pilot conversation has no anchor and the productivity case can be argued either way. Spend the week establishing the baseline rigorously.",
        },
        {
          html: stepCard('calendar', 'blue', 'Week 2 — Pilot live, daily standup',
            "Pilot agents go live with AI assist. Daily fifteen-minute standup — what worked, what felt off, acceptance rate trend. Identify context fixes and friction fixes in real time. Most learning happens here."),
          narration:
            "Week two. Pilot live. Daily fifteen-minute standup with the pilot agents — what worked yesterday, what felt off, what they want to see different. Acceptance rate dashboard reviewed in the standup. Identify context fixes — the AI needs more customer-record visibility — and friction fixes — that workflow step adds time, remove it — in real time. Most of the learning in the whole pilot happens during this week. Don't skip the daily standup; the pilot's value scales directly with how much agent feedback gets surfaced and acted on. Adjust the deployment based on feedback. Visible adjustment builds the trust that lands the broader rollout later.",
        },
        {
          html: stepCard('calendar', 'amber', 'Week 3 — Stabilise + measure',
            "Adjustments from week 2 land. Pilot runs steady. Measure handle time, CSAT, first-contact resolution against baseline. Look for the lift — and for unintended side effects (agent satisfaction, error rate, after-call notes quality)."),
          narration:
            "Week three. Stabilise and measure. The adjustments from week two have landed. The pilot runs steady. Measure handle time against baseline, CSAT against baseline, first-contact resolution against baseline. Look for the productivity lift — and for unintended side effects. Agent satisfaction in the pilot group — are they finding the tool helpful or frustrating? Error rate — are agents accepting AI suggestions that contain inaccuracies? After-call notes quality — is auto-summary actually producing better notes or are agents skipping the review step? The unintended side effects often matter as much as the headline KPIs. Watch for them.",
        },
        {
          html: stepCard('calendar', 'green', 'Week 4 — Synthesise + present',
            "Compile pilot results into one-page summary. Present to contact-centre leadership and the CIO. Recommendation — scale, adjust, or stop. The pilot earns the right to scale; it doesn't automatically scale."),
          narration:
            "Week four. Synthesise and present. Compile the pilot results into a one-page summary — the four KPIs against baseline, the agent satisfaction signal, the unintended side effects observed, the operational issues encountered and how they were resolved. Present to contact-centre leadership and the chief information officer. Make an explicit recommendation — scale to the next two teams, adjust and re-pilot for two more weeks, or stop and try a different play. The pilot earns the right to scale; it doesn't automatically scale. Honest synthesis here is what protects against the costly mistake of scaling a pilot that didn't actually prove out, just because the timeline said scale.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why agent assist as the default first play',
        "Highest probability of clear-win results, lowest brand risk (output is internal to the rep, no customer sees AI directly), and the team experience shapes the trust for every subsequent AI deployment. Get this one right; the next three become easier."),
      calloutNarration:
        "Why agent assist as the default first pilot play. Three reasons. Highest probability of clear-win results because the productivity lift is well-understood and the operational lift is achievable in four weeks. Lowest brand risk because the AI output is internal to the rep — no customer sees AI suggestions directly, so even imperfect suggestions don't reach customers. And the team experience during this pilot shapes the trust for every subsequent AI deployment — get the agent-assist pilot framing right, support not surveillance, visible adjustment based on feedback, and the next three plays you roll out become significantly easier. Get the pilot wrong and every subsequent AI program faces uphill resistance. The first pilot's job is to earn the team's trust in the AI program; the productivity gain is the proof point, not the main event.",
    },
    // SLIDE 3
    {
      title: 'The KPI scaffold — four numbers, two cadences',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · The KPIs',
      bodyHtml: `<p>Four numbers tell you whether the pilot worked. Two cadences for ongoing review. Get the KPIs wrong and ROI becomes a story; get them right and ROI becomes evidence.</p>`,
      narrationLead:
        "Four numbers that tell you whether the customer service AI pilot worked — and tell the CIO whether the broader rollout is worth funding. Two cadences for ongoing review. Get the KPI scaffold wrong and ROI becomes a story you tell. Get it right and ROI becomes evidence you present. The KPIs apply to agent assist pilot specifically; adapt for other plays as the pilot scope changes.",
      steps: [
        {
          html: stepCard('target', 'blue', 'Number 1 — Average handle time (AHT)',
            "The headline productivity number. Pre-pilot baseline. Healthy 4-week lift is 15–30% reduction on equivalent contact mix. Below 10% — investigate suggestion acceptance and workflow friction. Above 35% — verify CSAT didn\'t drop as the trade-off."),
          narration:
            "Number one. Average handle time, abbreviated AHT. The headline productivity number for agent assist deployments. Pre-pilot baseline measured cleanly across the pilot agents. A healthy four-week lift is fifteen to thirty percent reduction on equivalent contact mix. Below ten percent reduction — investigate suggestion acceptance rate and workflow friction. The AI either isn't useful enough or has friction agents are routing around. Above thirty-five percent reduction — verify CSAT didn't drop as the trade-off, sometimes aggressive handle-time reduction means agents are rushing customers off calls. Pair AHT with CSAT always; neither alone tells the full story.",
        },
        {
          html: stepCard('target', 'blue', 'Number 2 — CSAT',
            "The trust number. Track post-call survey responses. Healthy pilot keeps CSAT flat or slightly positive. CSAT drop of more than 2 points means the productivity gain is coming at customer expense — stop and reconsider."),
          narration:
            "Number two. Customer satisfaction, CSAT. The trust number. Track post-call survey responses for the pilot group versus baseline. A healthy four-week pilot keeps CSAT flat or slightly positive — typically zero to two-point lift on a hundred-point scale. CSAT drop of more than two points means the productivity gain is coming at customer expense — agents are rushing, suggestions are leading them away from genuine engagement, the trade-off isn't worth it. Stop and reconsider. Below the threshold, the deployment is healthy and the broader rollout case has the CSAT proof point it needs to defend against budget pushback.",
        },
        {
          html: stepCard('target', 'amber', 'Number 3 — First-contact resolution (FCR)',
            "The quality number. Customers who don\'t need a repeat contact within 7 days. Healthy pilot lifts FCR 5–10%. Drop in FCR with AHT reduction means agents are closing calls without actually resolving — the worst trade-off. Watch carefully."),
          narration:
            "Number three. First-contact resolution, FCR. The quality number. Customers whose issue doesn't require a repeat contact within seven days. A healthy four-week pilot lifts FCR by five to ten percent — better answers and faster lookups produce more complete resolutions. A drop in FCR concurrent with AHT reduction is the worst possible trade-off — it means agents are closing calls without actually resolving the underlying issue, and those customers are coming back tomorrow. The hidden cost shows up in week two as the repeat-contact rate rises. Watch FCR carefully. If it drops, AHT-only productivity reporting is misleading and the rollout case is weaker than it looks.",
        },
        {
          html: stepCard('target', 'green', 'Number 4 — Agent satisfaction',
            "The durability number. Weekly survey of pilot agents — do you want to keep using this? Below 70% positive — the rollout will not be durable beyond the pilot. Worth as much as the customer-facing KPIs."),
          narration:
            "Number four. Agent satisfaction with the tool. The durability number. Weekly five-minute survey of the pilot agents — do you want to keep using this, what's working, what's not. Below seventy percent positive response — the rollout will not be durable beyond the pilot because agents will silently disengage when the spotlight moves elsewhere. Worth as much as the customer-facing KPIs in deciding whether to scale. Many contact centres weight customer KPIs heavily and skip agent satisfaction; the pilots that scale durably are the ones where agent satisfaction is treated as equally important. Make the survey routine. Act on the feedback visibly.",
        },
      ],
      calloutHtml: calloutBlock('calendar', 'tip', 'Two cadences',
        "Daily during the 4-week pilot (15 min, supervisor + lead, KPI dashboard). Monthly after broader rollout (30 min, CS leadership + CIO, KPIs + agent satisfaction + brand-event check). The cadences are the operating contract."),
      calloutNarration:
        "Two cadences for the KPI review. Daily during the four-week pilot — fifteen minutes, supervisor and pilot lead, KPI dashboard reviewed live. Monthly after broader rollout — thirty minutes, contact-centre leadership and the chief information officer, full KPI review plus agent satisfaction plus an explicit brand-event check on whether any customer-facing AI incident occurred in the last thirty days. The two cadences together are the operating contract that gives the AI program credibility. Without them, the program becomes a story leadership tells at board meetings rather than a measurable operating asset. Schedule both before the pilot starts.",
    },
    // SLIDE 4
    {
      title: 'Four conversations to schedule Monday',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Week one',
      bodyHtml: `<p>Four conversations in the first week. Each one unlocks something the pilot needs to ship. Don't skip any of them — don't combine them.</p>`,
      narrationLead:
        "Four conversations to schedule in the first week of the four-week pilot. Each conversation unlocks something specific the pilot needs in order to actually ship. Don't skip any of them. Don't try to combine them into one meeting — each conversation needs its own clean context and its own owner. Schedule them in calendars Monday morning. The early discipline determines whether the pilot lands.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — CIO or VP of customer experience',
            "Walks through the 4-week pilot plan. Confirms scope and budget. Names the operational lead. Commits to the week-4 results review on the calendar. This is the conversation that gives the pilot oxygen."),
          narration:
            "Conversation one. The chief information officer or vice president of customer experience — whichever is the executive sponsor for the AI program. You walk through the four-week pilot plan from slide two. Confirm the scope — agent assist with the four components from chapter two for five to ten agents — and the budget. Agree on the operational lead. Commit the week-four results review into the sponsor's calendar before leaving the room. This is the conversation that gives the pilot the oxygen it needs to actually ship.",
        },
        {
          html: stepCard('users', 'blue', 'Conversation 2 — Pilot supervisor',
            "Walks through the daily standup rhythm. Agrees on the four KPIs and how each is measured. Identifies the pilot-agent selection criteria — volunteer, mid-career. Sets the team-trust framing — support not surveillance — from day one."),
          narration:
            "Conversation two. The supervisor of the pilot agents. You walk through the daily fifteen-minute standup rhythm and what gets reviewed in it. Agree on the four KPIs — average handle time, CSAT, first-contact resolution, agent satisfaction — and how each will be measured cleanly. Identify the pilot-agent selection criteria — volunteers, mid-career, not top performers and not strugglers, five to ten people. Set the team-trust framing from day one — this is agent assist, designed for support not surveillance, agents helped shape it. The supervisor's framing is what determines whether the pilot agents lean in or work around. Brief them carefully.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 3 — Information security and legal',
            "Walks through the call-recording consent flow, the AI-processing disclosure, the data retention windows, and the vendor procurement requirements. Critical for regulated industries; useful everywhere. Surface friction before deployment."),
          narration:
            "Conversation three. Information security and legal. You walk through the call-recording consent flow if your pilot includes voice — the spoken disclosure, the published retention windows, the consent log. Walk through the AI-processing disclosure required in jurisdictions where you operate. Walk through the data retention windows for transcripts and the vendor procurement requirements including data processing agreements and enterprise terms. Critical for regulated industries — financial services, healthcare, public sector — and useful in every industry. Surface friction before the pilot deploys, not during it.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 4 — Two pilot agents',
            "Pick two agents from the planned pilot cohort. Walk them through what they'll experience. Get their honest reaction. Their feedback is the earliest signal on whether the workflow lands in agent reality. The conversation most rollouts skip."),
          narration:
            "Conversation four. Two pilot agents from the planned cohort. Pick two — one who tends to give honest feedback, one who's a respected voice on the team. Walk them through what they'll experience in week two when the AI tool goes live — the workflow change, the suggestion panel, the case summary at wrap-up, the daily standup. Get their honest reaction. Their feedback is the earliest signal on whether the workflow lands in agent reality or only in the deployment deck. Adjust the rollout based on what they raise. This is the conversation most rollouts skip — and it is the conversation that distinguishes pilots that land from pilots that bounce off agent behaviour. Schedule it Monday.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'lightbulb',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p>Customer service AI sits at the intersection of high productivity opportunity and high customer trust risk. Discipline beats enthusiasm.</p>`,
      narrationLead:
        "A final note before the takeaways. Customer service AI sits at a particularly important intersection in any business. Done well, productivity gains are large and durable and customer satisfaction can actually improve. Done badly, the brand cost is immediate and visible in CSAT, in social media, in retention metrics two quarters later. The deployment risk is asymmetric in the wrong direction. Discipline beats enthusiasm. Run the four-week pilot before going broad. Hold the support-not-surveillance line with the team. Use the principle — AI handles volume, humans handle judgment — as the first filter on every vendor pitch. The teams that do these three things ship customer service AI well. The teams that chase the vendor demo produce the brand events. Choose discipline.",
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
          html: stepCard('check', 'green', 'One — The pilot is one play, four weeks',
            "Week 1 setup + baseline. Week 2 live + daily standup. Week 3 stabilise + measure. Week 4 synthesise + present. Agent assist as default first play — highest probability, lowest risk, shapes team trust for everything after."),
          narration:
            "One. The pilot is one play, run deeply for four weeks. Week one — setup and clean baseline measurement. Week two — go live with daily fifteen-minute standup, visible adjustment based on agent feedback. Week three — stabilise and measure against baseline. Week four — synthesise into a one-page summary, present to the sponsor, make an explicit recommendation. Default the first play to agent assist — highest probability of clear win, lowest brand risk, and the pilot experience shapes the team's trust in the entire AI program for everything that follows.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four numbers, two cadences',
            "AHT (productivity) · CSAT (trust) · FCR (quality) · agent satisfaction (durability). Daily during pilot, monthly after rollout. Pair AHT with CSAT and FCR — none alone tells the full story."),
          narration:
            "Two. Four numbers, two cadences. Average handle time — the productivity number, fifteen to thirty percent reduction is healthy. CSAT — the trust number, flat or slightly positive is healthy, drop of more than two points means productivity is coming at customer expense. First-contact resolution — the quality number, five to ten percent lift is healthy, drop concurrent with AHT reduction is the worst trade-off. Agent satisfaction — the durability number, seventy percent positive minimum or the rollout won't survive past the pilot. Daily cadence during the pilot, monthly cadence after broader rollout. The cadences are the operating contract.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four conversations Monday',
            "Executive sponsor · pilot supervisor · information security and legal · two pilot agents. Each unlocks something the pilot needs. None can be combined. The week-one discipline determines whether the pilot lands."),
          narration:
            "Three. Four conversations to schedule Monday morning. Executive sponsor — confirms scope, budget, and the week-four results review. Pilot supervisor — agrees the standup rhythm, the KPI measurement, the agent selection criteria, the support-not-surveillance framing from day one. Information security and legal — clears consent flow, disclosure, retention windows, vendor procurement. Two pilot agents — earliest signal on whether the workflow lands in agent reality. Each conversation unlocks something the pilot needs. None can be combined. The week-one discipline is what determines whether the pilot actually ships. Schedule them Monday. That's the course. Build well.",
        },
      ],
      narrationTrail:
        "Thank you for completing AI for Customer Service and Support. The pilot plan is yours. Now ship it.",
    },
  ],
}
