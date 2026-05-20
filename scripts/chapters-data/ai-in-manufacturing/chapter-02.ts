import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter02: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-predictive-maintenance',
  title: 'Predictive maintenance for plants',
  subtitle: 'Sensor coverage decisions · the narrative layer the engineer actually acts on · three project killers most plants hit.',
  slides: [
    // SLIDE 1
    {
      title: 'Predictive maintenance for plants',
      iconKey: 'cog',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Predictive maintenance is the highest-ROI AI play in most plants because unplanned downtime is the dominant operational cost. The deployment math is well-understood — the success math is about sensor coverage, narrative quality, and three project killers most plants hit.</p>`,
      narrationLead:
        "Welcome to chapter two. Predictive maintenance for plants. Predictive maintenance is the highest-ROI AI play in most manufacturing plants because unplanned downtime is the dominant operational cost — typically more than labour, more than materials, more than energy in OEE terms. The deployment math is well-understood from the operations course. The success math for plants specifically is about sensor coverage decisions, the narrative layer quality the maintenance engineer actually acts on, and three project killers that most plants hit during deployment. Substance in this chapter.",
    },
    // SLIDE 2
    {
      title: 'Sensor coverage decisions',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The sensors',
      bodyHtml: `<p>Three sensor coverage decisions made in the first month determine whether the predictive maintenance program delivers two years from now. Get them right; the program compounds. Get them wrong; the leading-indicator window stays narrow forever.</p>`,
      narrationLead:
        "Three sensor coverage decisions made in the first month of the predictive maintenance program determine whether it delivers two years from now. The decisions are about what to instrument, at what density, with what data infrastructure. Get them right and the program compounds across the equipment fleet over years. Get them wrong and the leading-indicator window stays narrow forever — you only catch the failure modes the sensors actually see, which is a small fraction of the failure modes the equipment exhibits.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Decision 1 — Which equipment to sensor',
            "Not all equipment. Sensor the equipment where unplanned downtime cost exceeds 10× the sensor cost — typically critical-path equipment, bottlenecks, and high-replacement-cost machinery. Skip the rest. Concentration of investment, not spreading."),
          narration:
            "Decision one. Which equipment to sensor. Not all equipment. The right test — sensor the equipment where unplanned downtime cost exceeds ten times the sensor cost over the equipment's remaining life. Typically that's critical-path equipment on the main production line, identified bottleneck operations, and high-replacement-cost machinery where catastrophic failure could mean weeks of downtime and major capex. Skip the rest. Concentration of sensor investment on the high-impact equipment produces dramatically better ROI than spreading sensor budget thinly across the whole plant. The temptation is to sensor everything — it feels comprehensive. The discipline is to sensor where the math works. The math works at concentrated coverage of critical equipment.",
        },
        {
          html: stepCard('search', 'blue', 'Decision 2 — Which sensor types per equipment',
            "Different failure modes show in different signals. Vibration catches bearing wear and imbalance. Temperature catches lubrication and load issues. Current draw catches electrical faults. Acoustic catches valve and seal issues. Match sensors to the failure modes you\'re trying to catch."),
          narration:
            "Decision two. Which sensor types to deploy per piece of equipment. Different failure modes show up in different signal types. Vibration catches bearing wear and imbalance issues in rotating equipment. Temperature catches lubrication breakdown and load issues. Current draw patterns catch electrical faults and motor degradation. Acoustic emission catches valve and seal issues that vibration doesn't see. Pressure sensors catch hydraulic and pneumatic system issues. Match sensors to the failure modes you're actually trying to catch — not to a generic sensor package the vendor pitches. The match requires working with your maintenance team to identify the historical failure modes on each piece of equipment and selecting sensors that would have caught them. This work is foundational and worth the time.",
        },
        {
          html: stepCard('search', 'blue', 'Decision 3 — Wired or wireless? Edge or cloud?',
            "Wired sensors on permanent equipment, wireless for retrofit or moveable. Edge processing for high-frequency vibration (cost of streaming raw data is prohibitive); cloud for lower-frequency sensors. Architectural choices that determine cost and reliability for years."),
          narration:
            "Decision three. Wired or wireless sensors? Edge processing or cloud processing? Wired sensors are more reliable, lower latency, more secure — preferred for permanent equipment where running cables is feasible. Wireless sensors are faster to deploy and right for retrofit on existing equipment or for moveable assets — accept the slightly higher maintenance burden. Edge processing is necessary for high-frequency vibration data where streaming the raw signal to cloud would be cost-prohibitive — the model runs at the sensor and only anomaly events stream to the central system. Cloud processing is fine for lower-frequency sensors like temperature and pressure. These architectural choices determine cost and reliability for years; making them deliberately in month one prevents expensive rework in year two when the wrong choice creates scaling problems.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The narrative layer for the maintenance engineer',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 2 · The narrative',
      bodyHtml: `<p>The sensor model produces alerts. The maintenance engineer takes actions. Between the two sits the narrative layer — the most-skipped component, the determinant of whether alerts convert to prevented failures.</p>`,
      narrationLead:
        "The sensor model produces alerts when pre-failure signatures appear. The maintenance engineer takes actions — schedule work orders, order parts, defer non-critical work to make room. Between the two sits the narrative layer. The most-skipped component in predictive maintenance deployments. The determinant of whether alerts convert to prevented failures or whether the alert-fatigue cycle kills the program by month six. Three components in the narrative layer that work.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'Component 1 — Action recommendation, not raw alert',
            "Sensor detected vibration anomaly on Bearing 4 of Pump 7. → Narrative: \"Bearing 4 on Pump 7 showing progressive wear pattern, similar pattern led to failure in 14 days last time. Recommend replacement during next planned downtime in 5 days. Parts in stock, 2-hour labour.\" Action, not signal."),
          narration:
            "Component one. Action recommendation, not raw alert. The sensor model fires when it detects an anomaly — for example, vibration anomaly on bearing four of pump seven. The narrative layer converts this into an action recommendation. Bearing four on pump seven is showing a progressive wear pattern. The similar pattern observed in the same equipment six months ago led to bearing failure in fourteen days. Recommend bearing replacement during the next planned downtime window in five days. Parts are in stock at the central warehouse. Estimated labour is two hours. The narrative is the action trigger. Without it, the engineer dismisses the raw alert. With it, the engineer schedules the action. The narrative work is what converts sensor investment into prevented downtime.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Component 2 — Similar-event context from your plant',
            "Pull historical patterns from this specific equipment and peer equipment in your plant — not from generic vendor data. \"Same pump model failed 6 months ago with similar pattern.\" Local relevance is what makes the narrative credible to the maintenance engineer."),
          narration:
            "Component two. Similar-event context from your specific plant — not from generic vendor reference data. The narrative cites historical patterns from this exact piece of equipment and from peer equipment in your plant. For example, the same pump model on line two failed six months ago after showing a similar vibration pattern. This pump's twin on line three is currently showing early-stage signs of the same pattern. Local relevance is what makes the narrative credible to the maintenance engineer who knows the plant's equipment intimately. Generic context — eighty percent of pumps with this pattern fail within three weeks across our customer base — is less credible because the engineer's question is whether it applies to this specific plant under these specific conditions. Local context answers that question; generic doesn't.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Component 3 — Confidence and time-window honesty',
            "Narrative is honest about confidence — \"high confidence based on 4 similar prior events\" vs \"early signal, recommend monitoring\". And honest about time window — failure likely within 14 days vs maybe 6 months. The engineer prioritises based on the honest framing."),
          narration:
            "Component three. Confidence and time-window honesty in the narrative. The narrative is honest about confidence — for example, high confidence based on four similar prior events on this equipment type versus early signal worth monitoring but not yet confirmed pattern. And honest about the time window — failure likely within fourteen days versus maybe six months versus not yet predictable. The engineer prioritises based on the honest framing. False precision in the narrative — claiming high confidence on weak signals — destroys trust within a quarter when the predictions don't pan out. Honesty about uncertainty builds trust. Configure the narrative layer to surface its own uncertainty rather than hiding it. The honesty is the trust signal.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where most teams underinvest',
        "Budget for narrative layer development gets cut because the sensor model demo is impressive on its own. The plant deployment then produces alerts the engineer doesn\'t act on, and the program shows zero prevented failures. The narrative is the action trigger, not optional flair."),
      calloutNarration:
        "Where most plant teams underinvest in the predictive maintenance program. Budget for narrative layer development gets cut because the sensor model demo is impressive on its own and the budget pressure suggests deferring the narrative work to phase two. The plant deployment then produces alerts the engineer doesn't act on consistently because alerts without action context are noise. The program shows zero prevented failures and gets cancelled at month nine. The narrative is the action trigger, not optional flair on top of the model. Budget for it day one of the program. The narrative investment is what converts the sensor model investment into actual prevented downtime in the OEE metrics.",
    },
    // SLIDE 4
    {
      title: 'Three project killers most plants hit',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The killers',
      bodyHtml: `<p>Three failure modes that kill predictive maintenance programs before they reach value. Each is recognisable early; each is preventable; each kills programs at scale every year somewhere.</p>`,
      narrationLead:
        "Three project killers that consistently end predictive maintenance programs in plants before the programs reach value. Each one is recognisable early in deployment. Each one is preventable with the right discipline. Each one kills programs at scale every year in plants across industries. Knowing the three lets you watch for them and address them while they're still recoverable. Each killer has a specific mitigation.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Killer 1 — Maintenance team didn\'t design the workflow',
            "PdM signals arrive in a new portal the maintenance team didn\'t shape. They route around it. By month 4, the dashboard shows healthy activity and the engineers haven\'t opened it. Maintenance team must be in the design from week 1."),
          narration:
            "Killer one. The maintenance team didn't design the workflow. PdM signals arrive in a new portal that the maintenance team didn't help shape and that doesn't fit their actual daily rhythm. The engineers route around the portal and use their existing CMMS for actual work. By month four, the dashboard shows healthy alert activity — alerts are firing, the model is working — and the engineers haven't opened the portal for weeks. The mitigation. The maintenance team must be in the workflow design from week one of the program. Bring the head of maintenance, the senior planner, and two engineers from the team. Have them shape how alerts surface, where they integrate, what the engineer's daily routine becomes after deployment. The design ownership is the difference between adoption and abandonment.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Killer 2 — Alert tuning never happens',
            "Initial model fires too many false alarms. Plant team needs to tune confidence thresholds and signal selection in the first 90 days using actual production data. If tuning doesn\'t happen — model stays noisy, engineers tune out, program dies. Schedule tuning explicitly."),
          narration:
            "Killer two. Alert tuning never happens after launch. The initial model deployment fires too many false alarms because the model was trained on vendor reference data and your plant's actual baseline noise is different. The plant team needs to tune confidence thresholds and signal selection in the first ninety days using actual production data from your equipment under your operating conditions. The mitigation. Schedule alert tuning explicitly as a deliverable for month two and month three of deployment. Owner is named — typically the reliability engineer or the senior maintenance planner. If the tuning doesn't happen because the project moved on to the next deployment phase, the model stays noisy, engineers tune out, and the program dies of alert fatigue regardless of how good the underlying model could have been. Schedule it.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Killer 3 — No baseline measurement for prevented failures',
            "Vendor reports \"avoided X hours of downtime\" without your pre-deployment failure baseline. The number is fiction. Without rigorous baseline measurement, the program can\'t prove ROI at the budget review and gets cut despite working. Measure baseline before launch."),
          narration:
            "Killer three. No baseline measurement for prevented failures. The vendor reports avoided X hours of downtime in the quarterly review. Without your pre-deployment failure baseline measured rigorously, the avoided number is fiction calculated from alerts times average failure cost. The mitigation. Measure your baseline failure rate before launch — failures per piece of equipment per quarter, downtime hours per failure, full cost methodology agreed between maintenance, operations, and finance. Without rigorous baseline, the program can't prove ROI at the budget review even when it's genuinely working — because the numbers in the report can't be defended. Programs that worked but couldn't prove it have been cut more than once. The baseline measurement is unglamorous work and is the determinant of whether the program survives its first budget cycle.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter three — quality vision AI.</p>`,
      narrationLead:
        "Three anchors before chapter three — quality vision AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three sensor coverage decisions',
            "Which equipment (concentrate on critical, skip the rest) · which sensor types (match to failure modes) · wired/wireless and edge/cloud architecture. Get these right in month 1; rework cost in year 2 is significant."),
          narration:
            "One. Three sensor coverage decisions made in month one. Which equipment to sensor — concentrate on critical-path and high-replacement-cost equipment where downtime cost exceeds ten times sensor cost; skip the rest. Which sensor types per equipment — match to the specific failure modes you're trying to catch, not generic vendor packages. Wired or wireless, edge or cloud — architectural choices that determine cost and reliability for years; make them deliberately. Get all three right at the program start; rework cost in year two if the early decisions were wrong is significant.",
        },
        {
          html: stepCard('check', 'green', 'One — Narrative layer is the action trigger',
            "Action recommendation, not raw alert · similar-event context from your plant (not generic vendor data) · honest confidence and time-window. Budget for the narrative layer day one — don\'t defer to phase two or the program dies of alert fatigue."),
          narration:
            "Two. Narrative layer is the action trigger, not optional flair. Action recommendation rather than raw alert — what to do, when, with what parts and labour estimate. Similar-event context from your specific plant — local relevance is what makes the narrative credible to engineers who know the equipment intimately. Honest about confidence and time-window — false precision destroys trust within a quarter, honesty about uncertainty builds trust. Budget for the narrative layer day one. Don't defer it to phase two — the program will die of alert fatigue before phase two arrives.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three project killers',
            "Maintenance team didn\'t design the workflow · alert tuning never happens after launch · no baseline measurement for prevented failures. Each is preventable; each kills programs at scale every year. Discipline is the antidote."),
          narration:
            "Three. Three project killers that consistently end predictive maintenance programs before they reach value. Maintenance team didn't design the workflow — they route around the new portal and the dashboard goes unused. Alert tuning never happens after launch — model stays noisy, engineers tune out, program dies of alert fatigue. No baseline measurement for prevented failures — program can't prove ROI at budget review even when working, gets cut despite delivering value. Each killer is recognisable early and preventable with discipline. Schedule the discipline; the program survives.",
        },
      ],
      narrationTrail:
        "Chapter three — quality vision AI. The operator labelling loop and the messy-real-world challenges. See you there.",
    },
  ],
}
