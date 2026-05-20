import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter05: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-supply-chain-integration',
  title: 'Plant-floor supply chain integration',
  subtitle: 'Three signal flows from supply chain into production · the schedule re-planning cadence · three failure modes when integration breaks.',
  slides: [
    // SLIDE 1
    {
      title: 'Plant-floor supply chain integration',
      iconKey: 'zap',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Plants disconnected from real-time supply chain signals lose hours of production every time a material disruption arrives unannounced. AI integration of demand forecast, supplier risk, and material availability into production scheduling is the difference between operational responsiveness and operational fragility.</p>`,
      narrationLead:
        "Welcome to chapter five. Plant-floor supply chain integration. Plants disconnected from real-time supply chain signals lose hours of production every time a material disruption arrives unannounced. The truck doesn't show up. The supplier's plant went offline two days ago and nobody told the receiving plant until the loading dock was empty. By that point, the line is already idle. AI integration of demand forecast, supplier risk signals, and material availability into production scheduling is the difference between operational responsiveness — adapting within hours — and operational fragility — discovering disruptions at the loading dock. Three signal flows. One schedule re-planning cadence. Three failure modes when integration breaks.",
    },
    // SLIDE 2
    {
      title: 'Three signal flows into production scheduling',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The flows',
      bodyHtml: `<p>Three signal flows that need to reach production scheduling continuously. Each catches a different class of disruption. Together they convert the plant from reactive to anticipatory.</p>`,
      narrationLead:
        "Three signal flows that need to reach production scheduling continuously — not weekly, not daily, continuously throughout the day. Each flow catches a different class of disruption. Together they convert the plant from reactive — discovering disruptions when they hit — to anticipatory — adjusting before disruption hits. The integration architecture matters; flowing signals into a dashboard nobody monitors isn't integration. Flowing signals into the production scheduling system that triggers re-planning is integration.",
      steps: [
        {
          html: stepCard('compass', 'blue', 'Flow 1 — Updated demand forecast (daily)',
            "From the operations course\'s two-layer forecasting model. Production schedule adjusts to match. Daily refresh catches the short-term demand shifts before they hit the order book — and prevents the over-build or under-build that follows yesterday\'s forecast."),
          narration:
            "Flow one. Updated demand forecast, refreshed daily. From the two-layer forecasting model covered in chapter two of the operations course — classical ML on structured history plus LLM signal extraction from unstructured sources. The forecast updates daily as new signals arrive — competitor news, weather impact on demand regions, social signal on category. Production schedule adjusts to match the updated forecast rather than running yesterday's plan against today's reality. The daily refresh catches the short-term demand shifts that hit the order book within a week and prevents the over-build or under-build that follows running production against last week's stale forecast.",
        },
        {
          html: stepCard('compass', 'blue', 'Flow 2 — Material availability and supplier signal (real-time)',
            "Inbound material tracking from suppliers and logistics partners. Supplier risk signals from chapter 7 of the ops course. When a signal indicates a likely disruption, production schedule re-plans within hours — not days when the truck doesn\'t arrive."),
          narration:
            "Flow two. Material availability and supplier signal in real time. Inbound material tracking from your suppliers and logistics partners — where is the shipment, when does it arrive, has it been delayed. Plus supplier risk signals from chapter seven of the operations course — news about supplier disruptions, financial stress signals, regulatory actions, climate events affecting supplier regions. When a signal indicates a likely disruption to a specific material your production schedule depends on, the schedule re-plans within hours — substituting alternative materials, sequencing other orders that don't need the disrupted material, alerting procurement to expedite alternatives. Real-time matters here; daily isn't fast enough when a disruption is already affecting shipments in transit.",
        },
        {
          html: stepCard('compass', 'blue', 'Flow 3 — Equipment availability from predictive maintenance (continuous)',
            "From chapter 2\'s predictive maintenance signals. When equipment is flagged for upcoming maintenance, production schedule plans around the downtime window proactively — not the night before. The PdM-to-scheduling integration is where two AI plays compound."),
          narration:
            "Flow three. Equipment availability from predictive maintenance signals, flowing continuously. From the predictive maintenance system covered in chapter two of this course. When equipment is flagged for upcoming maintenance based on pre-failure signatures, the production schedule plans around the downtime window proactively — sequencing orders that need the equipment before the maintenance window, sequencing orders that don't need it during the window, communicating to commercial team about expected throughput impact. Not the night before when the maintenance team scrambles. The predictive-maintenance-to-scheduling integration is where two AI plays compound — neither delivers full value alone, and together they make the plant meaningfully more responsive. Architect the integration explicitly; don't leave it to manual coordination meetings.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The schedule re-planning cadence',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · The cadence',
      bodyHtml: `<p>Three re-planning cadences, each triggered by a different signal type. The cadence is the operational discipline that converts signals into actual schedule changes.</p>`,
      narrationLead:
        "Three re-planning cadences in the integrated system. Each cadence is triggered by a different signal type with different urgency. The cadence is the operational discipline that converts signals into actual schedule changes — without the cadence, signals arrive in dashboards that planners check but don't act on routinely. With the cadence, signals trigger schedule re-planning at the appropriate urgency and the plant becomes anticipatory.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Cadence 1 — Daily morning schedule review (15 min)',
            "Planner reviews overnight signals — demand forecast refresh, supplier delivery status, equipment status. AI proposes any schedule adjustments needed. Planner approves or modifies. Daily rhythm catches the routine signal flow that doesn\'t need real-time response."),
          narration:
            "Cadence one. Daily morning schedule review. Fifteen minutes at the start of each business day. The production planner reviews the overnight signals — updated demand forecast from the daily refresh, supplier delivery status updates, equipment status from predictive maintenance. AI proposes any schedule adjustments suggested by the overnight signals. Planner approves the adjustments, modifies them based on context the AI doesn't have — for example, a customer request that came in late yesterday that needs accommodation — and finalises the day's schedule by mid-morning. The daily rhythm catches the routine signal flow that doesn't need real-time response. Most days, the schedule changes are minor. The daily review is the steady operating rhythm; the alerts in the next cadence are the exceptional events.",
        },
        {
          html: stepCard('calendar', 'amber', 'Cadence 2 — Mid-shift alert triggers (real-time)',
            "When a real-time signal arrives — supplier disruption confirmed, critical equipment flagged for imminent maintenance — AI alerts the planner immediately. Decision within 30 minutes. Catches the disruptions that can\'t wait until tomorrow\'s morning review."),
          narration:
            "Cadence two. Mid-shift alert triggers in real time. When a real-time signal arrives that needs decision faster than tomorrow's morning review — for example, a supplier disruption is confirmed, a critical piece of equipment is flagged for imminent maintenance within hours rather than days, a major customer changes their delivery requirement — AI alerts the planner immediately with a recommended decision. Planner decides within thirty minutes of the alert. Schedule re-plans accordingly. Catches the disruptions that can't wait until tomorrow's morning review. The thirty-minute SLA is what makes the responsiveness real; alerts that sit for hours in inboxes don't produce the responsive plant the integration was designed to deliver.",
        },
        {
          html: stepCard('calendar', 'green', 'Cadence 3 — Weekly forward-looking review (30 min)',
            "Once a week, planner plus operations leadership review the forward 4-week schedule against forward signals — demand forecast for next month, known equipment maintenance windows, supplier risk signals on longer horizon. Strategic decisions about capacity allocation land here."),
          narration:
            "Cadence three. Weekly forward-looking review. Thirty minutes once a week, typically Monday morning. Production planner plus operations leadership review the forward four-week schedule against forward signals — demand forecast for next month, known equipment maintenance windows, longer-horizon supplier risk signals. Strategic decisions about capacity allocation land at this cadence. Should we accept the new order from customer X that ships in three weeks given current capacity. Should we accelerate the maintenance window on equipment Y to absorb risk that supplier Z's recent signals suggest. Should we work overtime in week two to absorb the demand spike forecasted for week three. These strategic capacity decisions need the weekly forward-looking view; the daily review and real-time alerts can't substitute.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where most integrations fail',
        "Cadence 2 — real-time alerts — gets implemented but not honoured. Alerts fire, planner sees them, planner waits until tomorrow to act because reacting in real time is disruptive. The 30-minute SLA needs management commitment to be real. Without it, the real-time integration produces dashboards instead of responsiveness."),
      calloutNarration:
        "Where most plant supply chain integrations fail in practice. Cadence two — real-time alerts — gets implemented technically but not honoured operationally. Alerts fire when disruption signals arrive, the planner sees the alerts, but the planner waits until tomorrow's morning review to act because reacting in real time means changing today's schedule which is disruptive to operations. The thirty-minute SLA on mid-shift alerts needs operations management commitment to be real — including accepting the short-term disruption of mid-shift re-planning in exchange for the longer-term benefit of operational responsiveness. Without management commitment to the SLA, the real-time integration produces dashboards instead of responsiveness. Commit to the SLA before the integration goes live; otherwise the technical investment doesn't produce the operational return.",
    },
    // SLIDE 4
    {
      title: 'Three failure modes when integration breaks',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The failures',
      bodyHtml: `<p>Three failure modes that consistently surface when the integration breaks down. Each is recoverable if caught early. Knowing the three lets the operations team recognise the early signs and intervene before the program loses value.</p>`,
      narrationLead:
        "Three failure modes that consistently surface when the integration breaks down. Each is recoverable if caught early. Knowing the three lets the operations team recognise the early signs and intervene before the program loses value. The failure modes are recurring patterns across plants — not specific to one industry — and have specific causes and specific remedies.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Signal flows technically work but nobody acts',
            "Integration is technically functional. Signals flow. Dashboards update. Planner doesn\'t change schedule based on signals — they\'re used to running last week\'s plan. Failure mode caught by the simple test — when did the schedule last change because of a signal?"),
          narration:
            "Failure mode one. Signal flows technically work but nobody acts on them. The integration is technically functional — signals flow from supply chain systems into the production scheduling system, dashboards update with current state, alerts fire when thresholds are crossed. The planner doesn't change the schedule based on the signals because they're used to running last week's plan and the change feels disruptive. Failure mode is caught by one simple test — when did the production schedule last change because of an AI signal rather than because of a manual decision? If the answer is more than a week ago, the integration is technically working and operationally not. Remedy is the management commitment to the schedule re-planning cadence covered in lesson two. The technical investment requires operational discipline to convert into value.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Wrong signals override right judgment',
            "AI proposes a schedule change based on a signal that\'s technically valid but operationally inappropriate — context the AI doesn\'t see. Planner accepts the AI recommendation because they don\'t want to override the AI. The remedy is empowering planners to override with rationale captured."),
          narration:
            "Failure mode two. Wrong signals override right human judgment. AI proposes a schedule change based on a signal that's technically valid but operationally inappropriate because of context the AI doesn't see — for example, a major customer's CEO is visiting the plant that week and reliable delivery on their orders matters even if the AI's optimisation says otherwise. The planner accepts the AI recommendation because they don't want to be the person who overrode the AI and got it wrong. The remedy is explicit empowerment for planners to override AI recommendations with rationale captured. The override rationale becomes feedback data the model trains on for the next cycle — closing the loop. Without the override permission and the rationale capture, the AI gradually pushes the plant toward operationally inappropriate decisions and operators learn to distrust the system.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Real-time alerts arrive without context',
            "Mid-shift alert says \"supplier X disruption confirmed.\" Planner can\'t evaluate quickly because they don\'t know what to do — which orders does this affect, what alternatives exist, what\'s the cost. Alert needs context for action. AI provides the context or planner can\'t act in 30 minutes."),
          narration:
            "Failure mode three. Real-time alerts arrive without the context needed for the planner to act quickly. Mid-shift alert says supplier X disruption confirmed. Planner can't evaluate within thirty minutes because they don't know what to do without context. Which production orders does this disruption affect. What alternative materials are available and qualified for substitution. What's the cost implication of each substitution path. Without the context, the planner spends ninety minutes gathering information before they can decide, and the thirty-minute SLA is missed routinely. The remedy. AI provides the decision context with the alert — affected orders, available alternatives, cost implications — not just the raw signal. Planner reviews and decides quickly because the information is already there. Configure the alert payload during integration design, not after deployment when the SLA misses are surfacing.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter six — safety AI.</p>`,
      narrationLead:
        "Three anchors before chapter six — safety AI augmenting human attention.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three signal flows into scheduling',
            "Daily demand forecast refresh · real-time material and supplier signal · continuous equipment availability from PdM. Together they convert the plant from reactive to anticipatory. The PdM-to-scheduling integration is where two AI plays compound."),
          narration:
            "One. Three signal flows into production scheduling continuously. Daily demand forecast refresh from the two-layer forecasting model. Real-time material availability and supplier risk signals from logistics partners and the supplier risk monitoring system. Continuous equipment availability from predictive maintenance signals. Together they convert the plant from reactive — discovering disruptions when they hit — to anticipatory — adjusting before disruption hits. The predictive-maintenance-to-scheduling integration is where two AI plays compound; neither delivers full value alone.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three re-planning cadences',
            "Daily morning review (15 min, routine signal flow) · mid-shift real-time alerts (30-min SLA, exceptional events) · weekly forward-looking review (30 min, strategic capacity). The real-time SLA needs management commitment to be real."),
          narration:
            "Two. Three re-planning cadences matched to signal urgency. Daily morning schedule review — fifteen minutes, planner approves AI-proposed adjustments from overnight signals, routine operating rhythm. Mid-shift real-time alerts — thirty-minute SLA on planner decision, catches disruptions that can't wait until tomorrow, requires management commitment to be operationally real. Weekly forward-looking review — thirty minutes Monday morning, planner plus operations leadership, strategic capacity decisions for the forward four-week window. The cadences are the operational discipline that converts signal flow into schedule change.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three failure modes',
            "Signals flow but nobody acts (test — when did schedule last change because of a signal?) · wrong signals override right judgment (empower planner overrides with rationale capture) · real-time alerts without context (configure alert payload with affected orders + alternatives + cost). Each is recoverable when caught early."),
          narration:
            "Three. Three failure modes when integration breaks. Signals technically flow but nobody acts on them — caught by the simple test of when the schedule last changed because of a signal versus a manual decision, remedied by management commitment to the cadence. Wrong signals override right human judgment because planner doesn't want to override the AI — remedied by explicit override empowerment with rationale capture closing the loop to model retraining. Real-time alerts arrive without context for action — alert needs affected orders, available alternatives, cost implications in the payload, not just the raw signal. Each failure mode is recoverable when caught early; each compounds quickly when ignored.",
        },
      ],
      narrationTrail:
        "Chapter six — safety AI. Augmenting human attention without creating dangerous over-reliance. See you there.",
    },
  ],
}
