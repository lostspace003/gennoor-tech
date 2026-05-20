import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter04: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-logistics',
  title: 'Logistics optimisation',
  subtitle: 'Where AI complements operations research · three plays that ship · the framing that decides whether AI augments OR or replaces it badly.',
  slides: [
    // SLIDE 1
    {
      title: 'Logistics optimisation',
      iconKey: 'zap',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Logistics is the operations function where AI most often gets framed wrongly. The framing — does AI replace operations research, or does AI amplify it — decides whether your logistics AI program ships value or stays in pilot purgatory.</p>`,
      narrationLead:
        "Welcome to chapter four. Logistics optimisation. Logistics is the operations function where AI most often gets framed wrongly. The framing — does AI replace operations research, or does AI amplify it — decides whether your logistics AI program ships measurable value or stays in pilot purgatory. Three logistics plays where AI consistently delivers when framed correctly. The framing that makes the difference. And the AI-OR collaboration pattern that produces durable wins. By the end, the test you run on every vendor pitch.",
    },
    // SLIDE 2
    {
      title: 'The framing — AI amplifies OR; AI doesn\'t replace OR',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The framing',
      bodyHtml: `<p>One framing decision determines whether your logistics AI program lands. Get it right and AI plus OR compounds. Get it wrong and you spend a year discovering that classical OR was actually better at most of what you replaced.</p>`,
      narrationLead:
        "One framing decision determines whether your logistics AI program lands or fails. Get it right — frame AI as the amplifier of your existing operations research approach — and the AI plus OR combination compounds value. Get it wrong — frame AI as replacing operations research — and you spend a year and seven figures discovering that classical OR was actually better at most of what you replaced. The framing is the most important architecture decision in logistics AI. Let me make it explicit.",
      steps: [
        {
          html: stepCard('check', 'green', 'OR is excellent at — bounded optimisation',
            "Vehicle routing with stable demand, warehouse slotting against known turnover patterns, network design with given constraints. OR has 60 years of theory and tooling behind these. AI rarely beats well-tuned OR on these problems."),
          narration:
            "Where operations research is excellent and where AI rarely beats it. Bounded optimisation problems with stable inputs. Vehicle routing with stable demand. Warehouse slotting against known turnover patterns. Network design with given supply and demand constraints. Production scheduling against known capacities. OR has sixty years of theory and tooling behind these problems — linear programming, mixed-integer programming, constraint optimisation. AI rarely beats well-tuned OR on these classes of problems. If you have an OR team or OR consultants getting good results on bounded optimisation today, don't replace them with AI. The replacement consistently underperforms because the AI model has less inductive bias for the problem structure than the OR formulation does.",
        },
        {
          html: stepCard('zap', 'amber', 'AI is excellent at — dynamic re-routing and pattern detection',
            "Re-routing under disruption mid-day. Reading driver call notes for issue patterns. Surfacing fleet-wide anomalies the OR model never sees. AI catches what OR can\'t — because OR assumes stable inputs and AI doesn\'t."),
          narration:
            "Where AI is excellent and where OR struggles. Dynamic re-routing under disruption mid-day — when traffic, weather, or driver call-outs invalidate the morning's optimal plan. Reading driver call notes and dispatch chat for issue patterns the OR model can't ingest. Surfacing fleet-wide anomalies — for example, this region's deliveries are running an hour late on average for the last three days — that the OR model never sees because OR assumes stable inputs. AI catches what OR can't precisely because AI doesn't assume stability and OR does. The two approaches are complementary on different problem shapes, not competitive on the same problem shape.",
        },
        {
          html: stepCard('compass', 'green', 'The combined pattern — AI feeds OR, OR feeds back',
            "AI surfaces signals — disruption detected, pattern emerging — that change the OR model\'s inputs. OR re-optimises with updated inputs. Each plays to its strength. Mature logistics AI deployments look like this. Naive ones replace OR with AI and underperform."),
          narration:
            "The combined pattern. AI surfaces signals — disruption detected, pattern emerging, anomaly flagged — that change the OR model's inputs. OR re-optimises with the updated inputs and produces an updated plan. Each plays to its strength. Mature logistics AI deployments — at scale, in production, delivering measurable value — look like this. They don't look like AI replacing OR. They look like AI feeding OR better inputs and OR producing better plans more frequently. Naive deployments replace OR with AI and discover the underperformance in their on-time delivery metrics six months later. The mature deployments use AI as the operations research amplifier. The framing is the difference.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three logistics plays that ship',
      iconKey: 'check',
      eyebrow: 'Lesson 2 · The plays',
      bodyHtml: `<p>Three plays where AI consistently delivers in logistics — all three frame AI as the amplifier of OR or human dispatcher judgment. Apply the framing test to every vendor pitch before evaluating further.</p>`,
      narrationLead:
        "Three plays where AI consistently delivers measurable value in logistics. All three frame AI as the amplifier of operations research or human dispatcher judgment — never as the replacement. Apply the framing test to every vendor pitch before evaluating further on price or integration. The framing test eliminates the disappointments before they get to your evaluation matrix.",
      steps: [
        {
          html: stepCard('zap', 'blue', 'Play 1 — Dynamic re-routing under disruption',
            "Morning OR plan ran. Mid-day disruption arrives. AI re-optimises affected portions of the route within minutes. Dispatcher reviews and approves. 10–20% reduction in disruption-related delay across the fleet. Highest ROI logistics AI play."),
          narration:
            "Play one. Dynamic re-routing under disruption. The morning operations research plan ran and produced the optimal routes for the day. Mid-day, a disruption arrives — traffic incident on a primary route, driver calls out sick mid-shift, customer requests a same-day reschedule, weather event affects a region. AI re-optimises the affected portion of the route within minutes — the OR model is too slow for this real-time problem because it solves the full network each run. Dispatcher reviews the AI's proposed adjustment and approves or modifies. Result is ten to twenty percent reduction in disruption-related delay across the fleet. This is the highest ROI logistics AI play available to most teams.",
        },
        {
          html: stepCard('search', 'blue', 'Play 2 — Driver narrative and exception capture',
            "Drivers tell dispatch about issues in voice notes, chat, free-text fields. AI extracts patterns — '15% of deliveries in this postcode are running late', 'access issues at this warehouse are recurring'. Pattern feeds back into OR for the next day\'s planning."),
          narration:
            "Play two. Driver narrative and exception capture. Drivers in modern logistics operations tell dispatch about issues constantly — voice notes after deliveries, chat messages during the route, free-text fields in their handheld terminals. Historically all of this unstructured signal lived in conversations and notes that nobody aggregated. AI now reads the unstructured signal across the entire driver fleet and extracts patterns — fifteen percent of deliveries in this postcode are running late on average, access issues at this customer warehouse are recurring across drivers, congestion at this distribution centre is worsening. The pattern detection feeds back into the operations research model as updated parameters for the next day's planning. Closes the loop between driver reality and dispatch planning that's historically been broken in most logistics operations.",
        },
        {
          html: stepCard('check', 'blue', 'Play 3 — Anomaly detection across the fleet',
            "Continuous monitoring against the OR plan. AI surfaces deviations — this vehicle is taking longer than peers on similar routes, this customer is generating more rework, this carrier is missing SLA. Surfaces issues before they aggregate into operational problems."),
          narration:
            "Play three. Anomaly detection across the fleet. AI continuously monitors actual performance against the operations research plan. Surfaces deviations that aren't yet incidents but predict incidents. For example, this vehicle is taking consistently longer than peer vehicles on similar routes — surfacing maintenance or driver coaching needs before reliability degrades. This customer is generating more rework deliveries than peers — surfacing process or address-data issues. This carrier partner is missing SLA on increasing frequency — surfacing the need for a vendor conversation before the relationship deteriorates. The pattern across these examples — AI surfaces issues before they aggregate into operational problems visible in your monthly KPIs. Early detection is the strategic value. Without AI, these issues only surface when they're already affecting customer-visible service levels.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The framing test for every pitch',
        "Ask one question. Does this AI replace the OR model, or does it feed signals into the OR model? If 'replace' — pass on the pitch. If 'feed' — evaluate normally. Eliminates the disappointments in 10 seconds."),
      calloutNarration:
        "The framing test for every logistics AI vendor pitch. Ask one question. Does this AI tool replace the operations research model, or does it feed better signals into the operations research model? If the answer is replace — pass on the pitch regardless of demo quality. Replacement deployments consistently underperform in production for the structural reasons we covered. If the answer is feed — evaluate normally on price, integration, total cost of ownership. The framing test eliminates the disappointments in ten seconds and is the right rejection rate for the current logistics AI vendor market. Many compelling demos pitch replacement; very few deliver in production. The test protects against the demo effect.",
    },
    // SLIDE 4
    {
      title: 'When NOT to deploy logistics AI',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The not-yet',
      bodyHtml: `<p>Three situations where logistics AI consistently doesn't deliver yet — not because AI is bad, but because the foundation isn't in place. Recognise these and invest in the foundation first.</p>`,
      narrationLead:
        "Three situations where logistics AI consistently doesn't deliver value yet — not because the AI is bad, but because the operational foundation isn't in place. Recognise these specifically. Invest in the foundation first. Then the AI investment delivers. Skipping the foundation work and going straight to AI produces pilots that almost worked and never reached production, which is the dominant failure mode in logistics AI.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Situation 1 — No working OR baseline',
            "If you don\'t have an OR model or solid heuristic routing today, adding AI doesn\'t produce a lift — there\'s nothing for AI to amplify. Build the OR or rules baseline first; add AI as the amplifier in the next phase. Sequence matters."),
          narration:
            "Situation one. No working operations research baseline. If your logistics operations today don't have an OR model or a solid rules-based routing heuristic in place, adding AI does not produce a lift because there's nothing for AI to amplify. Many smaller logistics operations are in this position — routing is done manually by experienced dispatchers, which works but doesn't have the systematic baseline AI can improve on. The right sequence in this situation is to build the OR or rules baseline first — typically a six to nine month project — and add AI as the amplifier in the next phase. Skipping the baseline and going straight to AI produces an AI system replacing dispatcher judgment, which is exactly the replacement pattern that fails. Sequence matters.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Situation 2 — Master data is broken',
            "Addresses with errors, customer location inconsistencies, vehicle attributes mis-tagged. AI on top of broken master data produces confident wrong recommendations. The address normalisation work is unglamorous and is the determinant. Fix data; then AI."),
          narration:
            "Situation two. Master data is broken. Addresses with errors and inconsistencies across systems. Customer location data with duplicates and stale entries. Vehicle attributes mis-tagged across the fleet management system. AI on top of broken master data produces confidently wrong recommendations because the AI has no way to know the data is wrong — it learns from whatever is there. The address normalisation work, customer location de-duplication, vehicle data cleanup — these are unglamorous projects and they are the determinant of whether logistics AI delivers anything in production. Fix master data first. Then AI. The sequence saves a year of wondering why the AI deployment is producing strange results.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Situation 3 — Dispatchers and drivers aren\'t in the design',
            "AI logistics deployments where the dispatchers and drivers were not in the design phase consistently produce tools the team works around. Bring the operators in early — they catch operational realities the design team will miss otherwise."),
          narration:
            "Situation three. Dispatchers and drivers weren't in the design phase. Logistics AI deployments where the dispatchers who run the daily operations and the drivers who execute the routes were not in the design phase consistently produce tools the team works around or ignores. The operators catch operational realities the design team — usually IT, the consultant, and the executive sponsor — will miss otherwise. Examples — the AI suggests routes the dispatcher knows have a recurring access issue, the AI doesn't account for the driver shift change that happens at noon, the AI suggests times that conflict with the customer's loading dock window. Bring operators into design early. Their feedback during pilot reshapes the deployment in ways that determine whether it lands. The design-room time investment pays back ten times in deployment success.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter five — predictive maintenance.</p>`,
      narrationLead:
        "Three anchors before chapter five — predictive maintenance.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — AI amplifies OR; AI doesn\'t replace OR',
            "OR excels at bounded optimisation with stable inputs. AI excels at dynamic re-routing, pattern detection, anomaly surfacing. Mature deployments combine them — naive deployments replace OR with AI and underperform."),
          narration:
            "One. AI amplifies operations research; AI doesn't replace OR. OR excels at bounded optimisation problems with stable inputs — sixty years of theory and tooling behind it. AI excels at dynamic re-routing under disruption, unstructured-signal pattern detection, anomaly surfacing across the fleet. Mature logistics AI deployments combine the two with AI feeding better signals into OR. Naive deployments replace OR with AI and discover the underperformance in their on-time delivery metrics six months later. The framing is the most important architecture decision in logistics AI.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three plays that ship',
            "Dynamic re-routing under disruption (highest ROI) · driver narrative and exception capture · anomaly detection across the fleet. All three frame AI as the amplifier — apply the framing test to every vendor pitch in 10 seconds."),
          narration:
            "Two. Three logistics plays that ship measurable value. Dynamic re-routing under disruption — highest ROI, ten to twenty percent reduction in disruption-related delay. Driver narrative and exception capture — closes the loop between driver reality and dispatch planning that's historically broken. Anomaly detection across the fleet — surfaces issues before they aggregate into customer-visible service level problems. All three frame AI as the amplifier. Apply the framing test to every vendor pitch in ten seconds — does this AI replace OR or feed signals into OR? Replace pitches get rejected.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three situations to NOT deploy yet',
            "No working OR or rules baseline · master data broken · dispatchers and drivers not in the design. Invest in foundations first; AI amplifier in the next phase. The unglamorous work determines whether AI ships."),
          narration:
            "Three. Three situations where logistics AI consistently doesn't deliver yet. No working OR or rules-based baseline — nothing for AI to amplify, build the baseline first. Master data is broken — address inconsistencies, location duplicates, vehicle data errors — AI on broken data produces confident wrong recommendations, fix data first. Dispatchers and drivers not in the design phase — produces tools the team works around, bring operators in early. Invest in foundations first; AI amplifier in the next phase. The unglamorous foundation work is the determinant of whether the AI investment delivers.",
        },
      ],
      narrationTrail:
        "Chapter five — predictive maintenance. The sensor-plus-narrative pattern and the three vendor traps. See you there.",
    },
  ],
}
