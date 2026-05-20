import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter06: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-safety-ai',
  title: 'Safety AI — augmenting human attention',
  subtitle: 'Three safety AI use cases that ship · three failure modes specific to safety · the one line nobody crosses on the plant floor.',
  slides: [
    // SLIDE 1
    {
      title: 'Safety AI — augmenting human attention',
      iconKey: 'shield',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Safety AI carries higher discipline requirements than any other manufacturing AI play. Failures aren't yield issues — they're injuries. Three use cases that genuinely improve plant safety. Three specific failure modes. One line the program never crosses.</p>`,
      narrationLead:
        "Welcome to chapter six. Safety AI augmenting human attention. Safety AI carries higher discipline requirements than any other manufacturing AI play because failures aren't yield issues or efficiency issues — failures are injuries. The asymmetry of consequence requires asymmetric care in deployment. Three safety AI use cases that genuinely improve plant safety when deployed with the right discipline. Three specific failure modes that show up in safety deployments. One line the program never crosses regardless of vendor pitch or efficiency pressure. Substance with stakes in this chapter.",
    },
    // SLIDE 2
    {
      title: 'Three safety AI use cases that ship',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The use cases',
      bodyHtml: `<p>Three safety AI use cases that consistently produce measurable safety improvement when deployed with discipline. Each augments human attention; none replaces it.</p>`,
      narrationLead:
        "Three safety AI use cases that consistently produce measurable safety improvement when deployed with discipline. All three augment human attention rather than replacing it — the safety officer, the line supervisor, the workforce itself. The augmentation works because human attention has limits and AI doesn't get tired in the way humans do across long shifts. Used together, they create layered detection that catches risks any single layer might miss.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Use case 1 — PPE compliance monitoring',
            "Cameras detect missing or improperly worn PPE — hard hats, safety glasses, high-vis vests, hearing protection. Surfaces patterns for the safety officer\'s engagement with the team. Never used punitively against individuals; used to spot system gaps."),
          narration:
            "Use case one. Personal protective equipment compliance monitoring. Cameras placed at plant entry points and high-risk areas detect missing or improperly worn PPE — hard hats not actually on the head, safety glasses pushed up on forehead instead of in use, missing high-vis vests in vehicle traffic areas, missing hearing protection in noise-exposure zones. The AI surfaces patterns for the safety officer's engagement with the team — for example, PPE compliance is dropping on the night shift, the loading dock area has consistent gaps. Never used punitively against named individuals; used to spot system gaps that need engagement. The framing matters intensely. Punitive PPE AI fails culturally and operationally. Gap-spotting PPE AI succeeds. Same technology; different deployments.",
        },
        {
          html: stepCard('shield', 'green', 'Use case 2 — Near-miss pattern detection',
            "AI watches for near-miss events — close calls with mobile equipment, near-falls on stairs, near-contacts with hot surfaces. Aggregates patterns by location and time. Safety team engages where the patterns concentrate. The leading indicator that prevents the lagging incident."),
          narration:
            "Use case two. Near-miss pattern detection. AI watches plant operations for near-miss events — close calls between pedestrians and mobile equipment in shared spaces, near-falls on stairs or walkways, near-contacts with hot surfaces or moving machinery. Aggregates the patterns by location, by time of day, by shift. The safety team engages where patterns concentrate — for example, the near-miss pattern at the intersection of two corridors in the warehouse suggests redesign of pedestrian flow, the near-fall pattern on stairs after rain suggests slip-resistant treatment is wearing out. Near-misses are the leading indicator that prevents the lagging actual incident; AI catches more of them than human safety officers can possibly observe across a large plant. The pattern detection is the strategic safety value.",
        },
        {
          html: stepCard('shield', 'green', 'Use case 3 — Ergonomic risk pattern detection',
            "Vision systems detect repetitive motion patterns that exceed ergonomic guidelines — repeated reaches, awkward postures held too long, lifting patterns that risk back injury. Surfaces for workstation redesign. Helps the workforce, doesn\'t police individual workers."),
          narration:
            "Use case three. Ergonomic risk pattern detection. Vision systems detect repetitive motion patterns that exceed established ergonomic guidelines — repeated reaches above shoulder height that accumulate to shoulder injury risk, awkward postures held longer than recommended thresholds, lifting patterns that risk back injury at the population level. AI surfaces the patterns for workstation redesign — for example, this assembly station produces consistent ergonomic risk patterns suggesting the parts bin layout needs redesign. The framing again matters. Helps the workforce by redesigning bad workstations; doesn't police individual workers about their movement patterns. Used right, this use case dramatically reduces repetitive stress injuries which are the dominant source of long-term workforce health cost. Used wrong as individual-worker surveillance, it produces backlash that kills the safety program entirely.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three failure modes specific to safety',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The failures',
      bodyHtml: `<p>Three failure modes that appear in safety AI deployments and don\'t appear in other manufacturing AI plays. Each has consequences beyond efficiency loss. All three are preventable with specific design choices.</p>`,
      narrationLead:
        "Three failure modes that appear in safety AI deployments specifically and don't appear in other manufacturing AI plays. Each has consequences beyond efficiency loss because safety failures translate to injuries — actual human harm. All three are preventable with specific design choices made at deployment, not discovered during operation. Knowing the three lets the safety leadership team design around them rather than against them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — False confidence reduces human vigilance',
            "Safety AI deployed. Workers assume the system catches everything. Vigilance drops. The novel hazard the AI wasn\'t trained on goes unnoticed. The system was supposed to add a layer; in practice it replaced one. Counter — explicit communication that AI is supplement, never replacement."),
          narration:
            "Failure mode one. False confidence reduces human vigilance. Safety AI deployed in the plant. Workers, supervisors, and safety officers gradually assume the system catches everything because it works visibly in routine conditions. Vigilance drops over months because the AI seems to be on duty. The novel hazard the AI wasn't trained on — an unusual maintenance situation, an unexpected interaction between two pieces of equipment, a hazard from a temporary configuration — goes unnoticed because everyone assumes the AI is watching. The system was supposed to add a layer of detection. In practice it replaced one layer with another, with no net improvement. Counter — explicit, repeated communication that AI is supplement, never replacement for human vigilance. Safety briefings reinforce this. Performance reviews of safety officers reinforce it. The discipline has to be cultural.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Surveillance framing destroys the safety program',
            "Safety AI framed as monitoring individual workers — performance management based on AI footage. Workforce experiences AI as the boss watching, not the safety system supporting. Trust collapses. Workers stop reporting near-misses, hide safety issues, the program loses its core data."),
          narration:
            "Failure mode two. Surveillance framing destroys the safety program. Safety AI gets framed as monitoring individual workers — supervisors using AI footage for individual performance management, safety violations leading to disciplinary action based on AI evidence. The workforce experiences the AI as the boss watching, not the safety system supporting them. Trust collapses fast. Workers stop reporting near-misses because they fear blame. They hide safety issues that surface in their work. They stop engaging with the safety program at all. The program loses access to its most important data source — the workforce's own observation and reporting — and degrades into a surveillance system that doesn't actually improve safety. Counter — agreed boundaries in writing about how AI safety footage can and cannot be used, including a clear no-individual-performance-management rule. Maintained across years of leadership turnover.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Safety AI replaces actual investment in safer design',
            "Plant treats AI deployment as the safety investment for the year — and defers actual workstation redesign, equipment upgrades, training improvements. AI is monitoring; it doesn\'t fix root causes. Plants over-relying on AI safety see their underlying safety culture erode."),
          narration:
            "Failure mode three. Safety AI replaces actual investment in safer design. The plant treats AI safety deployment as the safety investment for the year — and defers actual workstation redesign, equipment safety upgrades, training program improvements, supervisor coverage increases, safety committee resourcing. AI is monitoring. It doesn't fix root causes — it surfaces patterns that the safety team is then supposed to fix through real investments. Plants over-relying on AI safety as if it were the safety solution see their underlying safety culture erode over years because the real investments aren't happening. The AI catches patterns; nobody acts on the patterns because the AI deployment was the answer. Counter — measure investment in real safety improvements separately from AI deployment. The AI is one tool in the safety program, not a substitute for the program. Leadership messaging reinforces this.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The one line nobody crosses',
      iconKey: 'x',
      eyebrow: 'Lesson 3 · The line',
      bodyHtml: `<p>One line the safety AI program never crosses regardless of vendor pitch or efficiency pressure. Cross the line and the program produces harm. The line is simple to state and requires explicit commitment to hold.</p>`,
      narrationLead:
        "One line the safety AI program never crosses regardless of vendor pitch or efficiency pressure from leadership. Cross the line and the program produces harm rather than preventing it. The line is simple to state. Holding it requires explicit organisational commitment that survives leadership changes, budget pressures, and the gradual drift that affects every long-running program. Make the commitment in writing. Renew it annually. The line is what distinguishes safety AI that genuinely improves the plant from safety AI that creates a false sense of security.",
      steps: [
        {
          html: stepCard('x', 'red', 'The line',
            "AI never has the final say on safety actions. A safety stop, a safety override, a safety intervention — the final authority is always human. AI can recommend, alert, prioritise. AI cannot autonomously stop equipment or autonomously override a human safety judgment."),
          narration:
            "The line. AI never has the final say on safety actions. A safety stop on the equipment, a safety override of a process condition, a safety intervention into operator activity — the final authority is always a human. AI can recommend a safety action, alert humans to a developing hazard, prioritise issues for human safety officers to evaluate. AI cannot autonomously stop equipment based on safety models, autonomously override a human safety judgment, or take safety action without human authorisation. The reason — AI safety models can be wrong in ways that produce unsafe outcomes. An autonomous safety stop based on a false-positive model output can introduce hazards — for example, stopping equipment mid-process in ways the operator wasn't expecting. The human authority is the safety net for the model's limitations. Hold the line.",
        },
        {
          html: stepCard('shield', 'amber', 'Why vendors push to cross it',
            "Some vendors pitch \"autonomous safety stop\" features as differentiation. The pitch is — humans react too slowly; AI reacts in milliseconds. The reality — AI false positives produce hazards too. Refuse autonomous safety stop pitches. The exception — equipment-embedded mechanical safety devices, which aren\'t AI."),
          narration:
            "Why vendors push to cross the line. Some safety AI vendors pitch autonomous safety stop features as their differentiation — for example, AI that automatically halts equipment within milliseconds when a hazard is detected. The pitch frames it positively. Humans react too slowly. AI reacts in milliseconds. The reality more complete. AI false positives produce hazards too — stopping equipment based on a model misclassification can introduce hazards the operator wasn't expecting and isn't prepared for. The discipline is to refuse autonomous safety stop pitches. The exception worth noting — equipment-embedded mechanical safety devices like light curtains, emergency stops, two-hand controls. Those aren't AI; they're traditional fail-safe engineering and have decades of regulatory validation. Don't conflate the two categories. AI is recommendation; mechanical safety devices are authority.",
        },
        {
          html: stepCard('shield', 'amber', 'How to commit to the line',
            "Written safety AI charter. Two pages. Signed by plant manager, safety officer, and operations director. Reviewed annually. Includes the line, the framing on PPE/ergonomic monitoring, the no-individual-performance-management rule. Survives leadership turnover by being institutional, not personal."),
          narration:
            "How to commit to the line institutionally. Written safety AI charter. Typically two pages. Signed by the plant manager, the safety officer, and the operations director. Reviewed annually with explicit re-signature. The charter includes the line — AI never has final say on safety actions. The framing on PPE and ergonomic monitoring — uses for system improvement, not individual performance management. The no-individual-performance-management rule explicitly. The commitment to invest in actual safety improvements separately from AI deployment. The charter survives leadership turnover because it's institutional rather than personal commitment. New plant managers inherit the charter and re-sign it on annual review. Without the institutional commitment in writing, the line drifts within two leadership changes and the safety program loses its discipline gradually. The charter is the safety-program-discipline anchor across years.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter seven — pragmatic digital twin.</p>`,
      narrationLead:
        "Three anchors before chapter seven — pragmatic digital twin deployment.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three use cases that ship',
            "PPE compliance monitoring (gap-spotting, never punitive) · near-miss pattern detection (leading indicator) · ergonomic risk pattern detection (workstation redesign, not worker policing). Framing as supplement-to-human-attention is what makes them work."),
          narration:
            "One. Three safety AI use cases that consistently ship value when framed correctly. PPE compliance monitoring used for system-gap spotting and safety officer engagement, never punitively against individuals. Near-miss pattern detection as the leading indicator that catches more near-misses than human observation can possibly cover across a large plant. Ergonomic risk pattern detection for workstation redesign — helps the workforce by improving bad workstations, doesn't police individual workers about movement patterns. The framing as supplement to human safety attention is what makes them work.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three failure modes specific to safety',
            "False confidence reduces human vigilance · surveillance framing destroys the program (workers hide near-misses) · safety AI replaces real safety investment (workstation redesign, equipment upgrades). All three are preventable with cultural discipline."),
          narration:
            "Two. Three failure modes specific to safety AI deployments. False confidence reducing human vigilance over months as the AI seems to be on duty — counter with explicit cultural messaging that AI is supplement, never replacement. Surveillance framing destroying the program when AI footage is used for individual performance management — counter with written boundaries and a no-individual-performance-management rule. Safety AI replacing actual investment in safer design — workstation redesign, equipment upgrades, training improvements — counter by measuring real-investment separately from AI deployment and reinforcing the leadership message that AI is one tool, not the solution.",
        },
        {
          html: stepCard('check', 'green', 'Three — The line nobody crosses',
            "AI never has final say on safety actions. AI recommends, alerts, prioritises — humans authorise. Refuse autonomous safety stop pitches. Commit to the line via written safety AI charter signed annually by plant manager, safety officer, operations director. Institutional, not personal."),
          narration:
            "Three. The line nobody crosses. AI never has final say on safety actions — safety stops, overrides, interventions. AI recommends, alerts, prioritises. Humans authorise. Refuse autonomous safety stop pitches regardless of vendor differentiation framing — AI false positives produce hazards too. Mechanical safety devices like light curtains and emergency stops aren't AI; don't conflate. Commit to the line institutionally via a two-page written safety AI charter signed annually by plant manager, safety officer, and operations director. The charter survives leadership turnover because it's institutional rather than personal. Without the institutional commitment, the line drifts within two leadership changes and the safety discipline degrades.",
        },
      ],
      narrationTrail:
        "Chapter seven — pragmatic digital twin. Targeted deployments that ship in 4–6 months, not 18-month megaprojects. See you there.",
    },
  ],
}
