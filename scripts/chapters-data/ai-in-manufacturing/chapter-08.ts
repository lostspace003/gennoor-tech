import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter08: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your 12-month plant AI roadmap',
  subtitle: 'Seven chapters down. Two plays, two quarters. OEE and quality KPIs that prove ROI. Four conversations Monday.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your 12-month plant AI roadmap',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In seven chapters, we built the operating view of AI on the plant floor. Now — one roadmap. Two plays over two quarters in the first half of the year, ranging plays in the second half. OEE and quality KPIs the plant manager owns — not AI metrics nobody on the line recognises.</p>`,
      narrationLead:
        "Welcome to chapter eight. The capstone. In the previous seven chapters, we built the operating view of AI on the plant floor. The fit map and the OT/IT bridge filter. Predictive maintenance with sensor coverage and narrative layer. Quality vision AI with the labelling loop and false-confidence discipline. Process optimisation with the experiment design and overfitting guards. Plant-floor supply chain integration with the re-planning cadences. Safety AI with the line nobody crosses. Pragmatic digital twin within six-month bounded scope. Now we collapse it. One roadmap. Two plays sequenced in the first half. Ranging plays in the second half. OEE and quality KPIs the plant manager owns — not AI metrics nobody on the line recognises. Specific enough to start Monday.",
    },
    // SLIDE 2
    {
      title: 'Two plays Q1, ranging in Q2–Q4',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The roadmap',
      bodyHtml: `<p>Two plays in the first quarter to build operational confidence with low brand risk. Three plays ranging in quarters 2–4 as foundations and operator engagement compound. Sequence matters; pressure to deploy everything in parallel always arrives.</p>`,
      narrationLead:
        "Two plays in quarter one of the program to build operational confidence and demonstrate value with low brand risk. Three additional plays ranging in quarters two through four as the foundations and operator engagement compound. Sequence matters more than enthusiasm. Pressure to deploy everything in parallel always arrives — usually from the executive sponsor or the vendor pushing multi-play deals. Hold the sequence discipline. Two well-executed plays in quarter one beat five half-attempted plays by a wide margin. Here's the sequence.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Q1 — Play A: Predictive maintenance on one critical equipment',
            "One piece of high-value equipment. Sensors + narrative layer + maintenance team-designed workflow. Three project killers explicitly addressed. By end of Q1, the plant has prevented its first measurable failure. Operational confidence in AI builds."),
          narration:
            "Quarter one. Play A — predictive maintenance on one critical piece of equipment. Not the whole equipment fleet. One specific high-value piece — the bottleneck CNC, the main kiln, the highest-throughput press. Deploy with the full sensor coverage decisions from chapter two — concentrated investment on this equipment, matched sensor types to known failure modes, deliberate wired-versus-wireless and edge-versus-cloud choices. Build the narrative layer in parallel — not as phase two. Maintenance team designs the workflow from week one. Three project killers from chapter two explicitly addressed. By end of quarter one, the plant has prevented its first measurable failure and the maintenance team is actively using the system. Operational confidence in AI builds.",
        },
        {
          html: stepCard('calendar', 'blue', 'Q1 — Play B: Quality vision AI on one inspection point',
            "One inspection point — typically the highest-value defect-prone check. Lighting controlled, labelling loop active, 1% human sample preserved. By end of Q1, defect escapes drop measurably and the operator labelling rhythm is established. Two operationally-grounded wins in Q1."),
          narration:
            "Quarter one parallel — Play B — quality vision AI on one specific inspection point. The highest-value defect-prone check in your plant, not all inspection points. Controlled lighting installed, the operator labelling loop active from day one, the one percent human inspection sample preserved as the novel-defect safety net. By end of quarter one, defect escapes drop measurably at this inspection point and the operator labelling rhythm is established as routine practice. Two operationally-grounded wins in quarter one — predictive maintenance preventing failure on critical equipment, quality vision catching escapes at the most-important inspection point. The two wins together fund operational confidence for quarter two and beyond.",
        },
        {
          html: stepCard('rocket', 'amber', 'Q2–Q4 — Ranging plays as foundations compound',
            "Q2 — Process optimisation program begins (slow build, validates first improvement by Q3). Q3 — Plant-floor supply chain integration. Q4 — Safety AI program. Digital twin is opportunistic — when a specific bounded use case justifies, build it. Don\'t force-fit a digital twin into the roadmap."),
          narration:
            "Quarters two through four — ranging plays as foundations and operator engagement compound. Quarter two — process optimisation program begins with the operator-led experiment design from chapter four. Slow build, first validated improvement typically lands by quarter three. Quarter three — plant-floor supply chain integration with the daily and real-time re-planning cadences. Builds on the demand forecasting foundation from the operations course. Quarter four — safety AI program with the support-not-surveillance framing and the no-cross line in writing. Digital twin remains opportunistic across the year — if a specific bounded use case arises that justifies a four-to-six-month targeted twin, build it. Don't force-fit a digital twin into the roadmap because the vendor pitched one. Twin investment follows specific use case, not strategic narrative.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why predictive maintenance + quality vision as the Q1 pair',
        "PdM has highest ROI when downtime cost is large. Quality vision has clearest defect-escape measurement. Both produce visible wins from day one. Both have low brand risk because failures stay inside the plant. The Q1 pair builds the credibility for the harder plays in Q2–Q4."),
      calloutNarration:
        "Why predictive maintenance and quality vision specifically as the quarter one pair. Predictive maintenance has the highest ROI of all manufacturing AI plays when unplanned downtime cost is meaningful — which it is for almost every production plant. Prevention of a single critical-equipment failure often pays back the entire program. Quality vision has the clearest defect-escape measurement — defects caught versus defects that reached customers is a clean before-and-after metric. Both produce visible wins from day one of deployment. Both have low brand risk because failures stay inside the plant — no customer sees AI output directly. The quarter one pair builds the operational credibility and the executive sponsor confidence that funds the harder plays in quarters two through four. Foundation, then compounding.",
    },
    // SLIDE 3
    {
      title: 'OEE and quality KPIs — not AI metrics',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · The KPIs',
      bodyHtml: `<p>Four manufacturing operational KPIs that the plant manager owns. None are AI metrics. The plant manager describes value to the executive committee in their language — OEE, throughput, quality, safety — not in model accuracy terms.</p>`,
      narrationLead:
        "Four manufacturing operational KPIs that the plant manager owns and reports on to the executive committee. None are AI metrics. The plant manager describes the value of the AI program in plant operations language — OEE, throughput, quality, safety — not in model accuracy or precision-recall language. The translation from AI deployment to operational KPIs is what makes the program credible to plant operations, to corporate operations leadership, and to finance. Track operational outcomes; AI metrics belong in the technical appendix.",
      steps: [
        {
          html: stepCard('target', 'blue', 'Number 1 — OEE (Overall Equipment Effectiveness)',
            "The headline manufacturing metric. Availability × Performance × Quality. Predictive maintenance lifts availability. Process optimisation lifts performance. Quality vision lifts quality. AI program contribution shows up as OEE delta against baseline."),
          narration:
            "Number one. Overall Equipment Effectiveness, OEE. The headline manufacturing metric — Availability times Performance times Quality, expressed as percentage. The AI program contribution shows up as OEE delta against the pre-program baseline. Predictive maintenance lifts availability by reducing unplanned downtime. Process optimisation lifts performance through validated parameter improvements. Quality vision lifts quality by catching defects earlier and reducing rework. The three contributions compound. Healthy OEE lift across a year of program deployment is typically three to seven percentage points — meaningful in plant operations terms. Below two points after a year — investigate which of the three components isn't delivering. Above eight points — verify the measurement methodology because that's at the high end of realistic results.",
        },
        {
          html: stepCard('target', 'blue', 'Number 2 — Unplanned downtime hours',
            "Direct measure of predictive maintenance impact. Hours lost to unplanned equipment failures per quarter, pre-program vs post-program. The metric finance cares about most because the dollar cost is the easiest to defend. Pair with maintenance budget overall — total should be flat or down."),
          narration:
            "Number two. Unplanned downtime hours per quarter. The direct measure of predictive maintenance impact. Hours lost to unplanned equipment failures per quarter, pre-program baseline versus post-program quarterly. The metric finance cares about most because the dollar cost of unplanned downtime is the easiest to defend with concrete numbers. Pair this metric with overall maintenance budget — total maintenance spend should be flat or down despite the program investment, because preventive replacements timed proactively are cheaper than reactive repairs after failures. If unplanned downtime drops but overall maintenance budget rises, the program isn't paying for itself yet. Track both numbers together; reporting only one tells half the story.",
        },
        {
          html: stepCard('target', 'amber', 'Number 3 — Defect escape rate',
            "Quality vision impact. Defects that reach customers per million units produced, baseline vs post-program. Combined with rework rate — defects caught early vs caught late. Both move with quality vision deployment; reporting both shows the program economics."),
          narration:
            "Number three. Defect escape rate — defects that reach customers per million units produced. Quality vision impact. Baseline against post-program quarterly trend. Combine this metric with rework rate — defects caught early at the inspection point versus defects caught late after additional value-add work. Both move with effective quality vision deployment — escapes drop because more defects get caught, rework drops because they get caught earlier in the process. Reporting both numbers together shows the program economics — reduced customer returns plus reduced rework cost together justify the investment. Reporting only one understates the value. Track both.",
        },
        {
          html: stepCard('target', 'green', 'Number 4 — Operational team engagement with the AI program',
            "The durability number. Quarterly survey of plant operations team and maintenance team — do you want to keep using these tools? Below 75% positive — the program won\'t survive past leadership changes. Less visible than the OEE number; equally important."),
          narration:
            "Number four. Operational team engagement with the AI program. The durability number. Quarterly survey of plant operations team and maintenance team — five-minute survey. Are you using the AI tools in your daily work. What's working well. What's not. Below seventy-five percent positive engagement — the program won't survive past leadership changes or budget pressure because the team will silently disengage when champions move on. Less visible than the OEE number on monthly reports; equally important for whether the program is still delivering value in year three. Run the survey quarterly. Act on the feedback visibly. The visible action — fixing the issues operators raised — is what sustains engagement across years.",
        },
      ],
      calloutHtml: calloutBlock('calendar', 'tip', 'Two cadences',
        "Monthly — plant manager reviews the four KPIs with the AI program leads and operations leadership. Quarterly — VP of manufacturing reviews against baseline with explicit invest/sustain/exit decision per play. The cadences are the operating contract for the program."),
      calloutNarration:
        "Two cadences for the KPI review. Monthly — the plant manager reviews the four operational KPIs with the AI program leads, the maintenance director, the quality director, and operations leadership. Catches drift before it becomes a quarterly disappointment. Quarterly — the VP of manufacturing or chief operating officer reviews the KPIs against pre-program baseline with an explicit decision per play. Invest more, sustain at current investment, or exit the play. The quarterly explicit decision prevents the pattern where AI programs become permanent fixtures regardless of whether they continue delivering. Both cadences are the operating contract that gives the program credibility across budget cycles and leadership changes. Schedule both cadences in calendars before the program launches.",
    },
    // SLIDE 4
    {
      title: 'Four conversations Monday',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Week one',
      bodyHtml: `<p>Four conversations in the first week of the program. Each unlocks something specific. None can be combined. Schedule them Monday before any vendor calls or evaluation work begins.</p>`,
      narrationLead:
        "Four conversations to schedule in the first week of the program. Each conversation unlocks something specific the program needs to actually ship across the next twelve months. None can be combined into one meeting. Schedule them Monday morning before any vendor calls or detailed evaluation work begins. The first-week discipline is what determines whether the program lands operationally or stays in the deck.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — VP of manufacturing or plant general manager',
            "Walks through the 12-month roadmap one-pager. Confirms scope, budget, and the quarterly review cadence in their calendar. Names the AI program lead — typically reliability engineering or plant operations. Gives the program oxygen for 12 months."),
          narration:
            "Conversation one. The VP of manufacturing or the plant general manager — whoever is the executive sponsor for the AI program at the plant level. Walk through the twelve-month roadmap one-pager from slide two. Confirm scope — predictive maintenance on one critical equipment in quarter one, quality vision at one inspection point in quarter one parallel, ranging plays in quarters two through four. Confirm budget. Agree on the AI program lead — typically the reliability engineering manager or a senior plant operations leader. Commit the quarterly review cadence into the sponsor's calendar before leaving the room. This conversation gives the program oxygen for the full twelve months. Without explicit sponsor commitment, the program lives or dies with the next budget pressure.",
        },
        {
          html: stepCard('users', 'blue', 'Conversation 2 — Maintenance director + senior maintenance engineer',
            "Walks through the Q1 PdM play. Maintenance team designs the workflow from week 1 — not retrofits it later. Confirms equipment selection (which critical piece) and the sensor coverage decisions. Sets the baseline measurement plan."),
          narration:
            "Conversation two. Maintenance director plus the senior maintenance engineer who will lead the predictive maintenance deployment day to day. Walk through the quarter one PdM play in detail. The maintenance team designs the workflow from week one — not retrofits adoption after the technical deployment is complete. Confirm which specific equipment piece gets the deployment based on the concentrated-investment principle from chapter two. Confirm sensor coverage decisions — which sensor types matched to which known failure modes on this equipment, wired or wireless choice, edge or cloud processing. Set the baseline measurement plan — pre-program failure rate and downtime hours for this equipment, methodology agreed with operations and finance. This conversation determines whether the PdM play has a credible execution path.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 3 — Quality director + senior quality engineer',
            "Walks through the Q1 quality vision play. Inspection point selection. Controlled lighting plan. Operator labelling loop design with operator input. 1% human sample protected. The discipline that distinguishes deployment that improves from deployment that fails on novel defects in year 2."),
          narration:
            "Conversation three. Quality director plus the senior quality engineer who will lead the quality vision deployment. Walk through the quarter one quality vision play in detail. Selection of the specific inspection point — the highest-value defect-prone check based on rework and customer-return data. Controlled lighting plan — the lighting installation and shift-change recalibration discipline from chapter three. Operator labelling loop design including the five-second flagging interface with operator input. Protection of the one-percent human inspection sample as the safety net for novel defects the model won't catch. This conversation establishes the discipline that distinguishes a quality vision deployment that improves quality from one that fails on novel defects in year two when teams have forgotten the system has limits.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 4 — Two line operators + one shift supervisor',
            "Pick two operators from the lines that will use the AI in Q1 — one experienced, one mid-career. Plus a shift supervisor. Walk them through what they\'ll experience. Get their honest reaction. Their feedback is the earliest signal on whether the workflow lands. The conversation most plant programs skip."),
          narration:
            "Conversation four. Two line operators from the lines that will use the AI deployments in quarter one — one experienced operator, one mid-career operator. Plus a shift supervisor from the affected lines. Walk them through what they will experience in their actual work — the new tools, the workflow changes, the daily standup rhythm, the feedback mechanisms. Get their honest reaction before deployment, not after. Their feedback is the earliest signal on whether the workflow lands in plant reality or only in the deployment deck. This is the conversation most plant AI programs skip — and it is the conversation that distinguishes programs that ship from programs that bounce off operator behaviour. Adjust the rollout based on what they raise. Their input in week one is worth more than any consultant input in month six. Schedule the conversation Monday morning.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'lightbulb',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p>Plants are unforgiving of vendor demos and forgiving of disciplined operators. AI in manufacturing rewards the same discipline that has always rewarded manufacturing — sequence, measurement, operator engagement, honest acknowledgement of limits.</p>`,
      narrationLead:
        "A final note before the takeaways. Plants are unforgiving of vendor demos that don't survive real conditions, and forgiving of disciplined operators who do the unglamorous work that makes systems sustainable. AI in manufacturing rewards the same discipline that has always rewarded manufacturing — sequence the deployments deliberately, measure operational outcomes honestly, engage operators in the design and validation work, acknowledge the limits of every tool including AI tools explicitly. Plants that bring this discipline to AI deployments get the compounding gains across years. Plants that chase the vendor demos discover the pattern of pilots that almost worked. The technology is not the constraint in manufacturing AI in 2026; the operational discipline is. Choose discipline.",
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
          html: stepCard('check', 'green', 'One — Two plays Q1, ranging in Q2–Q4',
            "Q1 — PdM on one critical equipment + quality vision on one inspection point. Q2–Q4 — process optimisation, supply chain integration, safety AI. Digital twin is opportunistic, not scheduled. Sequence is the multiplier."),
          narration:
            "One. Two plays in quarter one — predictive maintenance on one critical equipment piece, quality vision at one high-value inspection point. Three plays ranging in quarters two through four — process optimisation, plant-floor supply chain integration, safety AI. Digital twin remains opportunistic across the year — when a specific bounded use case arises that justifies a four-to-six-month targeted twin, build it. Don't force-fit a digital twin into the roadmap because the vendor pitched one. Sequence is the multiplier. Pressure to deploy more in parallel always arrives; hold the discipline.",
        },
        {
          html: stepCard('check', 'green', 'Two — OEE and quality KPIs, not AI metrics',
            "OEE delta · unplanned downtime hours · defect escape rate · operational team engagement. Plant manager reports in operations language. AI metrics belong in the technical appendix. Monthly with operations leadership, quarterly with VP of manufacturing for explicit invest/sustain/exit decisions."),
          narration:
            "Two. Four operational KPIs that the plant manager owns and reports to the executive committee. OEE delta against pre-program baseline. Unplanned downtime hours per quarter, paired with overall maintenance budget. Defect escape rate, paired with rework rate. Operational team engagement quarterly survey. AI metrics — model accuracy, precision-recall — belong in the technical appendix, not the headline. Monthly review with operations leadership catches drift early. Quarterly review with the VP of manufacturing makes the explicit invest-sustain-exit decision per play that prevents AI programs from becoming permanent fixtures regardless of value delivery.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four conversations Monday',
            "VP of manufacturing (sponsor confirmation) · maintenance director + engineer (PdM workflow design) · quality director + engineer (vision deployment discipline) · two operators + shift supervisor (plant-reality check). Each unlocks something the program needs; none can be combined."),
          narration:
            "Three. Four conversations to schedule Monday morning. VP of manufacturing or plant GM — confirms scope, budget, twelve-month roadmap, quarterly review cadence in their calendar. Maintenance director plus senior maintenance engineer — designs the PdM workflow from week one, confirms equipment selection and sensor coverage decisions, sets baseline measurement plan. Quality director plus senior quality engineer — establishes the quality vision deployment discipline including controlled lighting, operator labelling loop, the one-percent human sample protection. Two line operators plus shift supervisor — gives the earliest signal on whether the workflow lands in plant reality. Each conversation unlocks something specific; none can be combined; schedule them Monday before vendor calls begin. That's the course. Build well.",
        },
      ],
      narrationTrail:
        "Thank you for completing AI in Manufacturing. The roadmap is yours. Now ship it.",
    },
  ],
}
