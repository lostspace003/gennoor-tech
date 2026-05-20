import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter05: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-predictive-maintenance',
  title: 'Predictive maintenance',
  subtitle: 'The sensor-plus-narrative pattern · three vendor traps · the maintenance team handoff that decides whether the system lands.',
  slides: [
    // SLIDE 1
    {
      title: 'Predictive maintenance',
      iconKey: 'cog',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Predictive maintenance is the most-pitched and most-mis-implemented AI play in industrial operations. The sensor-plus-narrative pattern works. Sensor-only deployments don't. Three vendor traps. One handoff that determines whether your maintenance team acts on the signals.</p>`,
      narrationLead:
        "Welcome to chapter five. Predictive maintenance. This is the most-pitched AI play in industrial operations — and the most consistently mis-implemented. The sensor-plus-narrative pattern works reliably. Sensor-only deployments — which dominate the vendor market — consistently fail to produce the ROI promised. Three vendor traps to recognise and refuse. One handoff to the maintenance team that determines whether they actually act on the predictive signals or whether the system becomes another alert source they tune out within a quarter. Substance in this chapter.",
    },
    // SLIDE 2
    {
      title: 'The sensor-plus-narrative pattern',
      iconKey: 'sparkles',
      eyebrow: 'Lesson 1 · The pattern',
      bodyHtml: `<p>Two components that must deploy together. Sensor model detects pre-failure signatures. Narrative layer tells the engineer what to do about it. Either alone is insufficient; together they ship.</p>`,
      narrationLead:
        "Two components that must deploy together. The sensor model detects pre-failure signatures in time-series data. The narrative layer tells the plant engineer what to do about it in their language with operational context. Either component alone is insufficient. The sensor-only deployment produces alerts engineers don't act on. The narrative-only deployment lacks the leading indicator that gives the engineer time to act. Together they ship the predictive maintenance value the vendor pitch promised.",
      steps: [
        {
          html: stepCard('cog', 'blue', 'Component 1 — Sensor model on time-series data',
            "Vibration, temperature, current draw, acoustic, pressure — the equipment\'s telemetry. Time-series ML detects pre-failure signatures hours to weeks before failure. Sensor coverage matters — sparse coverage limits the model\'s leading indicator window."),
          narration:
            "Component one. Sensor model on time-series data. Vibration sensors on rotating equipment. Temperature on bearings, motors, and switchgear. Current draw patterns on electrical equipment. Acoustic emissions on pumps and valves. Pressure on hydraulic and pneumatic systems. The equipment's full telemetry stream. Time-series machine learning detects pre-failure signatures in these streams hours to weeks before the actual failure, depending on the failure mode. Sensor coverage matters intensely. Sparse sensor coverage means many failure modes are invisible to the model, which limits the leading indicator window and the value of the system. Invest in sensor coverage commensurate with the equipment value. Cheap sensors are now genuinely cheap; deploy them broadly.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Component 2 — LLM narrative layer for the engineer',
            "Sensor alert means nothing to the engineer without context. LLM produces — \"Bearing 4 on Pump 7 showing vibration pattern consistent with progressive bearing wear. Similar pattern observed 6 months ago led to failure in 14 days. Recommended action: schedule replacement in next planned downtime.\" The narrative is the action trigger."),
          narration:
            "Component two. Large language model narrative layer for the engineer. A sensor alert by itself — bearing four on pump seven shows vibration above threshold — means nothing actionable to the maintenance engineer. The LLM narrative layer produces — bearing four on pump seven is showing a vibration pattern consistent with progressive bearing wear, similar pattern observed six months ago on the same equipment led to failure in fourteen days, recommended action is to schedule replacement in the next planned downtime window in seven days, parts are in stock at the warehouse, estimated labor is two hours. The narrative is the action trigger. Without it, the engineer dismisses the alert. With it, the engineer schedules the action. The narrative-layer investment is what converts sensor data into prevented failures.",
        },
        {
          html: stepCard('check', 'blue', 'The combined output — actionable predictions with context',
            "Single dashboard view. Equipment ID, pre-failure signal, time-to-action window, recommended action, parts and labor estimate, similar historical events. The engineer makes the call — schedule, defer, monitor, escalate. AI assists; engineer decides."),
          narration:
            "The combined output. Single dashboard view per piece of monitored equipment. Equipment ID and location. Pre-failure signal and confidence. Time-to-action window — how long the engineer has before failure becomes likely. Recommended action with specifics. Parts and labor estimates so the engineer knows what they're committing to. Similar historical events on this equipment or peer equipment so the engineer has the pattern context. The engineer makes the call — schedule the maintenance, defer because the criticality is low and downtime cost would exceed risk, continue monitoring because the signal is borderline, escalate because the predicted failure mode would be catastrophic. AI assists with the prediction and context. The engineer decides what to do. Same pattern as every other operations AI deployment — augment judgment, don't replace it.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why sensor-only fails',
        "Sensor-only PdM produces alerts the engineer doesn\'t trust because they lack context. Engineers tune out within a quarter. The deployment shows healthy dashboard activity and zero prevented failures. The narrative layer is what makes the system land."),
      calloutNarration:
        "Why sensor-only predictive maintenance consistently fails. The sensor-only deployment produces alerts that the maintenance engineer doesn't trust because the alerts lack the operational context the engineer needs to act. Engineers tune out within a quarter. Alert fatigue sets in. The deployment shows healthy dashboard activity — alerts firing, monitoring active — and zero actual prevented failures because engineers stopped acting on the alerts. The dashboard looks like the system is working; the maintenance metrics show no improvement. The narrative layer is what makes the system land — it converts alerts into engineer actions. Budget for narrative layer development alongside the sensor model; don't treat narrative as a phase-two enhancement that often doesn't get funded.",
    },
    // SLIDE 3
    {
      title: 'Three vendor traps to refuse',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The traps',
      bodyHtml: `<p>Three traps in the PdM vendor market. Recognise them in the demo and refuse. Each trap consistently produces deployments that don't deliver the promised ROI.</p>`,
      narrationLead:
        "Three traps consistently appearing in predictive maintenance vendor pitches. Recognise them in the demo phase and refuse the pitch. Each trap consistently produces deployments that don't deliver the promised ROI. The vendor market has matured but not enough to assume any pitch is sound — the traps are still common in 2026 and likely to remain so for at least another year given how the vendor incentives work.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap 1 — \"Generic models work on any equipment\"',
            "Generic time-series anomaly models trained on aggregated equipment data don\'t produce reliable predictions on your specific equipment. Your equipment has unique failure modes the generic model never saw. Demand site-specific tuning before signing."),
          narration:
            "Trap one. The vendor claims generic time-series anomaly models work on any equipment. The pitch — we trained on millions of hours of equipment telemetry across our customer base, the model generalises to any rotating equipment. The reality. Generic anomaly models trained on aggregated equipment data across customers don't produce reliable predictions on your specific equipment because your equipment has unique failure modes — based on your specific manufacturer, vintage, operating conditions, maintenance history — that the generic model never saw or saw infrequently. Demand site-specific tuning before signing. The vendor's response to this demand sorts the serious vendors from the marketing-led ones. Serious vendors propose a calibration period; marketing-led ones promise the generic model is enough.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 2 — \"Avoided failure cost\" without baseline',
            "Vendor reports — \"we avoided $X million in failures last year for your similar customers.\" Without your pre-deployment failure baseline, the number is fiction. Demand baseline measurement during the pilot. \"Avoided\" measurement is the most-gamed metric in the PdM market."),
          narration:
            "Trap two. Avoided failure cost reported without a baseline. The vendor reports — we avoided X million dollars in failure cost for customers similar to you last year. The reality. Without your pre-deployment failure baseline measured cleanly, the avoided number is fiction. The vendor doesn't know which failures their customers would have had absent the system because no one ran the counterfactual. The reported avoided cost is calculated by multiplying alerts that fired times average failure cost for that equipment class — which is not the same as failures actually prevented. Demand baseline measurement during your pilot phase — pre-deployment failure rates by equipment class with the failure cost methodology agreed in writing. Avoided failure cost is the most-gamed metric in the predictive maintenance market; insist on rigour.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 3 — \"AI replaces the maintenance team\'s judgment\"',
            "PdM vendors increasingly pitch autonomous maintenance scheduling. Maintenance teams catch contextual issues the AI doesn\'t — equipment redundancy, downtime cost variance, parts availability, regulatory inspection windows. AI assists; maintenance schedules. Refuse autonomous pitches."),
          narration:
            "Trap three. AI replaces the maintenance team's judgment in scheduling. Increasingly in 2025 and 2026, PdM vendors are pitching autonomous maintenance scheduling — AI decides which work orders fire, when, and on which equipment, without human review. The reality. Maintenance teams catch contextual issues the AI doesn't have visibility into. Equipment redundancy — this pump's twin is currently down for unrelated work, so this pump can't be taken offline for the predictive maintenance window the AI suggested. Downtime cost variance — this maintenance window happens during peak production season versus off-season. Parts availability when the AI's recommended part isn't in stock. Regulatory inspection windows that constrain timing. Refuse autonomous scheduling pitches. AI assists; maintenance schedules. Same principle as the autonomous supply planning trap from chapter one.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The maintenance team handoff',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · The handoff',
      bodyHtml: `<p>Three components in the handoff from AI signal to maintenance team action. Without all three, signals fire and nobody acts. With all three, signals convert into prevented failures.</p>`,
      narrationLead:
        "Three components in the handoff from AI predictive signal to maintenance team action. Without all three, signals fire and nobody acts — the deployment is technically operational and operationally useless. With all three, signals convert into prevented failures and the metrics show the value. The handoff design is more important than the model quality in the second quarter of deployment because the model quality plateaus while the handoff determines whether the team uses what the model produces.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Component 1 — Signals route to CMMS, not a new AI portal',
            "PdM signals flow into the existing maintenance management system — SAP PM, Maximo, Infor EAM — as work order recommendations. Maintenance engineer reviews in their existing workflow. No new tool to log into. Adoption follows zero-friction integration."),
          narration:
            "Component one. Signals route to the existing computerised maintenance management system — CMMS — not to a new AI portal. PdM signals flow into SAP Plant Maintenance, Maximo, Infor EAM, or whichever CMMS your maintenance team already uses. They appear as work order recommendations alongside the work orders from preventive maintenance schedules and reactive maintenance requests. The maintenance engineer reviews them in their existing workflow. No new tool to log into. No context switch. Adoption follows the zero-friction integration. Standalone PdM portals consistently fail adoption regardless of how good the underlying model is, for the same reason CS-AI portals fail — the workflow change is the dominant barrier. Integrate.",
        },
        {
          html: stepCard('users', 'blue', 'Component 2 — Engineer can accept, modify, defer, or dismiss with rationale',
            "Four explicit actions on every PdM signal. Each captured with engineer rationale. The captured rationale becomes feedback data the model trains on for the next cycle. Two-way loop, not one-way push."),
          narration:
            "Component two. Engineer can accept, modify, defer, or dismiss each PdM signal with rationale captured. Four explicit actions — not just accept and ignore. Accept — schedule the recommended work. Modify — schedule different work or different timing based on operational context. Defer — monitor for now, criticality doesn't warrant action yet. Dismiss with rationale — signal is a false positive, here's why. Each action is captured with the engineer's rationale. The captured rationale becomes feedback data the model trains on for the next cycle — the model learns which signals were actionable in your specific operation versus which were false positives. Two-way loop, not one-way push. The two-way loop is the difference between a system that gets better quarter over quarter and one that plateaus at the initial accuracy.",
        },
        {
          html: stepCard('users', 'blue', 'Component 3 — Weekly review of avoided and missed failures',
            "Weekly fifteen-minute review by maintenance leadership. Avoided failures (signals acted on, equipment didn\'t fail). Missed failures (failures that occurred without prior signal). Pattern surfacing — what the model catches, what it misses. The rhythm prevents drift."),
          narration:
            "Component three. Weekly review of avoided and missed failures by maintenance leadership. Fifteen minutes per week. Avoided failures — signals that fired, the engineer acted, equipment didn't fail. Missed failures — failures that occurred without a prior PdM signal. Pattern surfacing — what is the model catching well, what is it missing systematically. The weekly rhythm prevents drift in the model and in engineer trust. Without the rhythm, missed failures accumulate quietly and engineers lose confidence in the system. With the rhythm, missed failures get investigated, the model gets retrained, and the engineering team sees that the program is being actively managed. The rhythm is also the source of the metrics for the next quarterly investment review with the executive sponsor. Without honest weekly metrics, the quarterly conversation becomes story-telling.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter six — inventory intelligence.</p>`,
      narrationLead:
        "Three anchors before chapter six — inventory intelligence.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Sensor-plus-narrative, never sensor-only',
            "Sensor model detects pre-failure signatures. Narrative layer tells the engineer what to do with operational context. Budget for both together. Sensor-only deployments produce dashboard activity and zero prevented failures."),
          narration:
            "One. Sensor-plus-narrative pattern, never sensor-only. The sensor model detects pre-failure signatures in time-series telemetry. The LLM narrative layer tells the maintenance engineer what to do with operational context — recommended action, time window, parts and labor estimate, similar historical events. Budget for both components together. Sensor-only deployments dominate the vendor market and consistently produce dashboard activity with zero actual prevented failures because engineers don't act on context-less alerts. The narrative layer is the action trigger.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three vendor traps to refuse',
            "Generic models claimed to work on any equipment (demand site-specific tuning) · avoided failure cost without baseline (fiction) · autonomous scheduling (maintenance team catches contextual issues AI can\'t). Apply the test before signing."),
          narration:
            "Two. Three vendor traps consistently appearing in predictive maintenance pitches. Generic models claimed to work on any equipment — demand site-specific tuning during the pilot before signing. Avoided failure cost reported without a clean baseline — fiction, demand baseline measurement with methodology agreed in writing. Autonomous maintenance scheduling — the maintenance team catches contextual issues the AI doesn't see, refuse autonomous pitches. Apply the three tests in the demo phase before evaluating further. The PdM vendor market is improving but the traps are still common.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three handoff components',
            "Route to existing CMMS (not new AI portal) · engineer four-action response with rationale (feedback loop) · weekly avoided/missed failure review. The handoff design is more important than model quality after the first quarter."),
          narration:
            "Three. Three handoff components to the maintenance team. Signals route to the existing CMMS — SAP PM, Maximo, Infor — as work order recommendations in the team's existing workflow, no new portal. Engineer can accept, modify, defer, or dismiss each signal with rationale captured — the rationale becomes feedback data the model trains on, two-way loop. Weekly fifteen-minute review by maintenance leadership of avoided failures and missed failures with pattern surfacing — prevents drift and surfaces metrics for the quarterly executive review. The handoff design becomes more important than model quality in the second quarter of deployment.",
        },
      ],
      narrationTrail:
        "Chapter six — inventory intelligence. Stock-outs and overstock as the same problem, and the cadence-matched action formats. See you there.",
    },
  ],
}
