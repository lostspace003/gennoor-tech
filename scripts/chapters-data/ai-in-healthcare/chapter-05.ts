import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiHealthcareChapter05: Chapter = {
  courseId: 'ai-in-healthcare',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-operations-and-pharmacy',
  title: 'Operations and pharmacy AI',
  subtitle: 'The unglamorous plays that quietly fund the rest of the AI portfolio — and improve the day-to-day for clinicians.',
  slides: [
    // SLIDE 1
    {
      title: 'Operations and pharmacy AI',
      iconKey: 'cog',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Operational AI in hospitals doesn’t produce dramatic press releases. It produces something more valuable — faster discharge, less missing medication, fewer cancelled surgeries from staffing gaps, less administrative work for clinicians. In the next few minutes, three plays that ship.</p>`,
      narrationLead:
        "Welcome to chapter five. Operations and pharmacy AI. Operational AI in hospitals doesn't produce dramatic press releases. It produces something more valuable — faster patient discharge, less missing medication, fewer cancelled surgeries from staffing gaps, less administrative work pulling clinicians away from patients. In the next few minutes, three plays that ship reliably, the build patterns, and the unglamorous metrics that fund the rest of the AI portfolio.",
    },
    // SLIDE 2
    {
      title: 'Three operations plays that work in healthcare',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The plays',
      bodyHtml: `<p>Three operations plays. Each one mature, each one ships in 8–12 weeks, each one has visible operational benefit within a quarter of going live.</p>`,
      narrationLead:
        "Three operations plays. Each one mature technology. Each one ships in eight to twelve weeks for a first pilot. Each one has visible operational benefit within a quarter of going live. None require regulator approval as medical devices, because none touch clinical decisions directly.",
      steps: [
        {
          html: stepCard('cog', 'green', 'Play 1 — Bed management and discharge planning',
            "Forecast bed demand by ward, by shift. Identify discharge-ready patients earlier in the day. Coordinate transport, pharmacy, and handover documentation. Reduces length of stay by 4–10%; reduces ED boarding by 15–25%."),
          narration:
            "Play one. Bed management and discharge planning. The AI forecasts bed demand by ward and by shift. Identifies patients likely to be discharge-ready earlier in the day — so the discharge process starts at nine in the morning, not three in the afternoon. Coordinates transport, pharmacy preparation of take-home medications, and handover documentation. Reduces length of stay by four to ten percent. Reduces emergency-department boarding by fifteen to twenty-five percent because beds become available sooner. The CFO loves this play. So does the chief of medicine.",
        },
        {
          html: stepCard('cog', 'blue', 'Play 2 — Pharmacy inventory and dispensing automation',
            "Demand forecasting for medications. Automated reorder. Dispensing-cabinet AI that prevents wrong-medication and wrong-dose errors. The play that quietly prevents harm and reduces waste — and is genuinely a back-office deployment."),
          narration:
            "Play two. Pharmacy inventory and dispensing automation. AI demand forecasting for medications across the hospital — what's likely to be needed in the next week based on patient census, planned admissions, and seasonal patterns. Automated reorder before stock-outs. And dispensing-cabinet AI that flags wrong-medication and wrong-dose dispensing attempts before the medication leaves the cabinet. This play quietly prevents harm and reduces waste at the same time. It is genuinely a back-office deployment — clinical decisions remain with the prescriber and the pharmacist. Mature, defensible, valuable.",
        },
        {
          html: stepCard('cog', 'amber', 'Play 3 — Coding assistance and billing support',
            "AI suggests ICD-10 and CPT codes from the clinical documentation. Coders review and confirm. Reduces coding backlog by 50%+ at most hospitals. Reduces denial rates from incorrect coding. The boring play that pays for everything else."),
          narration:
            "Play three. Coding assistance and billing support. The AI suggests ICD-ten and CPT codes from the clinical documentation. Coders review and confirm — the coder still owns the decision. Reduces the coding backlog by fifty percent or more at most hospitals. Reduces denial rates from incorrect coding by ten to twenty percent. This is the boring play that quietly pays for the entire AI portfolio in many hospitals. The revenue cycle improvement funds the clinical investment. Don't underestimate it as a starting point — the financial case is genuinely the strongest of any healthcare AI play.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why these three?',
        "Each one has clean inputs, bounded outputs, clear human-in-the-loop, no clinical decision-making by the AI. They don't require medical-device approval. They ship fast. They produce financial value quickly. The shape that funds the rest of the programme."),
      calloutNarration:
        "Why these three plays specifically? Each one has clean inputs — operational data the hospital already produces. Bounded outputs — a forecast, an inventory action, a code suggestion. Clear human-in-the-loop — the bed manager, the pharmacist, the coder makes the actual decision. And no clinical decision-making by the AI. Because of all four properties, these plays don't require medical-device regulator approval. They ship in eight to twelve weeks. They produce financial value within a quarter. That is the shape of a play that funds the rest of your AI programme. Start with one of these in parallel with clinical documentation. The combined economic case is what gets the next tranche of funding approved.",
    },
    // SLIDE 3
    {
      title: 'The build pattern — common across all three',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · The build',
      bodyHtml: `<p>All three plays share a similar build pattern. Four phases. Predictable when scoped well. Predictable derailment when scoped poorly.</p>`,
      narrationLead:
        "All three operations plays share a similar build pattern. Four phases. Predictable when scoped well. Predictably derailed when scoped poorly. Here are the four phases.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Phase 1 — Data audit and scope (weeks 1–2)',
            "Audit the data feeds the AI will use. EHR exports, pharmacy system, financial data. Identify gaps. Define the operational metric the AI will move. Get the affected team's lead in the room — bed manager, pharmacy director, head coder."),
          narration:
            "Phase one. Data audit and scope. Weeks one and two. Audit the data feeds the AI will use — EHR exports, pharmacy system extracts, financial data. Identify gaps explicitly. Define the specific operational metric the AI will move — bed-day reduction, dispensing error rate, coding accuracy. Get the affected team's lead into the design room from week one. The bed manager. The pharmacy director. The head coder. Their input shapes a workable deployment. Without them, the deployment fits the AI vendor's model of how the team works — which often doesn't match how the team actually works.",
        },
        {
          html: stepCard('calendar', 'blue', 'Phase 2 — Model build and integration (weeks 3–8)',
            "Build the forecasting or recommendation model. Wire into the operational system. Read-only first; write-back behind a feature flag once tested. By week 8, the system runs in shadow mode — producing outputs the team can review without acting on."),
          narration:
            "Phase two. Model build and integration. Weeks three through eight. Build the forecasting or recommendation model. Wire it into the operational system — the bed-management dashboard, the dispensing cabinet, the coding workbench. Read-only first. Write-back behind a feature flag once tested. By week eight, the system runs in shadow mode — producing outputs the team can review without actually acting on them. Shadow mode is critical in healthcare operations AI. It lets you compare what the AI would have done against what the team actually did — without any patient impact.",
        },
        {
          html: stepCard('calendar', 'amber', 'Phase 3 — Pilot live with one ward / one unit (weeks 9–12)',
            "Pilot in production for one ward or one unit. Daily check-ins for week 1. Weekly reviews for the rest of the phase. Measure against the operational metric defined in week 1. Adjust based on the team's actual experience — not on the metric alone."),
          narration:
            "Phase three. Pilot live with one ward or one unit. Weeks nine through twelve. Pilot in production for a single ward or operational unit. Daily check-ins for the first week to catch the inevitable edge cases. Weekly reviews for the rest of the phase. Measure against the operational metric you defined in week one. And critically — adjust based on the team's actual experience, not just on the metric. Sometimes the metric moves but the team is unhappy because the workflow doesn't fit. Listen to both signals. The team's experience is the leading indicator of long-term sustainability.",
        },
        {
          html: stepCard('calendar', 'green', 'Phase 4 — Scale + steady-state rhythm (weeks 13+)',
            "Expand to remaining wards or units. Lock in the weekly operational review, the monthly drift check, and the quarterly governance review with clinical leadership. The rhythm is what makes the deployment durable across years."),
          narration:
            "Phase four. Scale and steady-state rhythm. Weeks thirteen onwards. Expand from the pilot ward or unit to the rest of the hospital. Lock in the weekly operational review meeting. The monthly drift check on the model. The quarterly governance review with clinical leadership — even for operations AI, clinical leadership reviews the operational systems quarterly. The rhythm is what makes the deployment durable across years. Without the rhythm, the deployment quietly degrades within eighteen months. With it, the deployment compounds.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The metrics that fund the rest of the AI portfolio',
      iconKey: 'target',
      eyebrow: 'Lesson 3 · Financial metrics',
      bodyHtml: `<p>For each play, one financial number to defend. The numbers are real, defensible, and large enough to fund the clinical AI investments.</p>`,
      narrationLead:
        "For each operations play, one financial number to defend to the CFO and the board. The numbers are real. Defensible. And large enough — when defended consistently — to fund the clinical AI investments that take longer to show financial return. Here are the three.",
      steps: [
        {
          html: stepCard('target', 'green', 'Bed management — bed-days saved per year',
            "Bed-days saved multiplied by the cost-per-bed-day in your hospital. Realistic year-1: 1,500–4,000 bed-days saved for a 300-bed hospital. At $1,500/day average, that's $2–6M annually. The number the CFO sees and remembers."),
          narration:
            "Bed management. The number is bed-days saved per year. Realistic year-one for a three-hundred-bed hospital — fifteen hundred to four thousand bed-days saved. Multiplied by an average cost per bed-day of around fifteen hundred dollars in many markets — sometimes higher. That's two to six million dollars annually. The number the CFO sees, defends to the board, and remembers when funding the next phase of AI investment. Defend the number consistently. Same definition, every quarter, same audience.",
        },
        {
          html: stepCard('target', 'blue', 'Pharmacy — waste reduction + harm prevention',
            "Two-part number. Medication waste reduction — typically 8–15% in year one. Plus quantified harm-prevention — averted dispensing errors at the cabinet, with a conservative cost-per-error. Combined, often $500k–$2M annually for a medium hospital."),
          narration:
            "Pharmacy. The number has two parts. Medication waste reduction — typically eight to fifteen percent in year one, calculated against the pre-AI baseline pharmacy spend. Plus quantified harm prevention — the number of averted dispensing errors at the cabinet, multiplied by a conservative cost-per-error estimate. The harm-prevention number is more contested philosophically — but it is real, and the regulator increasingly expects it to be tracked. Combined, the two parts often produce five hundred thousand to two million dollars annually for a medium-sized hospital. Track both components transparently.",
        },
        {
          html: stepCard('target', 'amber', 'Coding — denial reduction + speed',
            "Denied claims reduction (typically 15–25% in year one) times average denied-claim value. Plus coding turnaround time reduction, freeing coder capacity for the backlog. The combined number often pays for the entire hospital AI programme in revenue-cycle gains alone."),
          narration:
            "Coding and billing support. The number is denied claims reduction — typically fifteen to twenty-five percent in year one — multiplied by the average value of a denied claim. Plus coding turnaround time reduction, which frees coder capacity to address the existing backlog. The combined number is often large enough to fund the entire hospital AI programme through revenue-cycle gains alone. In some hospitals, the coding play is the single deployment that turns the CFO from sceptical to supportive of further AI investment. Don't underestimate it as a sequencing choice early in the programme.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'Track honest numbers',
        "The financial cases above are real — and the bands are conservative based on actual deployments. Inflating them produces an unsupportable case at the audit. Conservative, defended consistently, builds credibility that funds the next decade of AI investment."),
      calloutNarration:
        "Track honest numbers. The financial cases above are real — and the bands are conservative based on actual deployments. The temptation to inflate at the start, to win the initial funding case, is real. Resist it. Inflated numbers produce an unsupportable case at the financial audit that always follows the deployment. Conservative numbers, defended consistently across quarters with the same methodology, build the credibility that funds the next decade of healthcare AI investment. The CFO who learns to trust your healthcare AI numbers is the CFO who funds the next phase quietly. Build that trust deliberately.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 6 — PHI and data sovereignty.</p>`,
      narrationLead:
        "Three anchors before chapter six — PHI and data sovereignty.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three operations plays that fund the portfolio',
            "Bed management · pharmacy inventory + dispensing · coding and billing. Mature. Ship in 8–12 weeks. Financial impact in the first quarter."),
          narration:
            "One. Three operations plays that fund the rest of the AI portfolio. Bed management and discharge planning. Pharmacy inventory and dispensing. Coding assistance and billing support. Mature deployments. Ship in eight to twelve weeks. Financial impact visible in the first quarter. Start one of these in parallel with clinical documentation.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four-phase build pattern, common across the three',
            "Data audit + scope · build + integrate · pilot one ward · scale + rhythm. The rhythm is what makes deployments durable beyond month 18."),
          narration:
            "Two. Four-phase build pattern, common across the three plays. Data audit and scope with the team lead in the room. Build and integrate, including shadow mode. Pilot with one ward or unit. Scale plus the steady-state rhythm. The rhythm is what makes deployments durable beyond month eighteen. Without it, deployments quietly degrade.",
        },
        {
          html: stepCard('check', 'green', 'Three — Track honest financial numbers',
            "Bed-days saved · pharmacy waste and harm prevention · denial reduction. Conservative bands, defended consistently. Builds the credibility that funds the next decade."),
          narration:
            "Three. Track honest financial numbers. Bed-days saved. Pharmacy waste reduction plus harm prevention. Denial reduction plus coding speed. Use conservative bands. Defend the numbers consistently across quarters with the same methodology. The credibility you build funds the next decade of healthcare AI investment. The CFO who trusts your numbers is the CFO who quietly funds the next phase.",
        },
      ],
      narrationTrail:
        "Chapter six — PHI and data sovereignty. The non-negotiable that protects everything else. See you there.",
    },
  ],
}
