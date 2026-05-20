import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter01: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-fit-map',
  title: 'The manufacturing-AI fit map',
  subtitle: 'Six plant-floor plays that ship · three vendor pitches that disappoint on the shop floor · the OT/IT bridge filter.',
  slides: [
    // SLIDE 1
    {
      title: 'The manufacturing-AI fit map',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Plants don't tolerate vendor demos. Manufacturing AI either survives the shop floor — vibration, dust, shift handovers, real OT data — or it gets quietly switched off. The fit map decides which plays survive in your plant.</p>`,
      narrationLead:
        "Welcome to AI in Manufacturing. This course is for plant managers, VPs of manufacturing, operations directors, industrial engineering leaders, and the OT engineers who run the production floor. Plants don't tolerate vendor demos. AI in manufacturing either survives the shop floor — vibration on the lines, dust on the cameras, shift handovers that change who's watching, real operational technology data that doesn't behave like the sanitised vendor dataset — or it gets quietly switched off within a quarter. The fit map in this chapter decides which plays survive in your specific plant. Six plant-floor AI plays that ship. Three pitches that consistently disappoint. One filter — the OT/IT bridge — that decides sequencing.",
    },
    // SLIDE 2
    {
      title: 'Six plant-floor plays that ship',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The wins',
      bodyHtml: `<p>Six manufacturing AI plays that consistently survive plant-floor reality. Each is covered in depth in a later chapter — this is the inventory.</p>`,
      narrationLead:
        "Six manufacturing AI plays that consistently survive plant-floor reality and deliver measurable value. Each is covered in a later chapter — this slide is the inventory. The pattern across all six. AI augments the operator, the maintenance engineer, the quality inspector — never replaces them on the shop floor. The operators have context the AI cannot have, and they catch the rare-but-consequential conditions the AI misses.",
      steps: [
        {
          html: stepCard('cog', 'green', 'Play 1 — Predictive maintenance on critical equipment',
            "Vibration, temperature, acoustic, current draw signals plus LLM narrative for the maintenance engineer. Prevents the unplanned downtime that costs more than all other manufacturing AI wins combined. Chapter two."),
          narration:
            "Play one. Predictive maintenance on critical equipment. Sensor data — vibration, temperature, acoustic emission, motor current draw — combined with the LLM narrative layer for the maintenance engineer, exactly as covered in the operations course. Prevents the unplanned downtime that costs more than all other manufacturing AI wins combined for most plants. A single hour of unplanned downtime on a critical line typically costs ten to a hundred thousand dollars depending on the industry. Even modest prediction accuracy produces strong ROI. Chapter two covers it specifically for the plant context.",
        },
        {
          html: stepCard('search', 'green', 'Play 2 — Quality vision AI',
            "Cameras on the line detect defects, surface variation, assembly errors. Improves with operator feedback labels over time. Works on parts the model has seen; struggles on novel defects — the failure mode to design around. Chapter three."),
          narration:
            "Play two. Quality vision AI. Cameras on the production line detect defects — surface variations, dimensional anomalies, assembly errors, missing components. The vision model improves with operator feedback labels over time as it sees more examples in your specific plant. Critical caveat. Quality vision works reliably on defect types the model has seen during training. It struggles on novel defects the model hasn't encountered. This is the dominant failure mode and the chapter three discussion is about how to design around it — including the operator labelling loop that builds robustness.",
        },
        {
          html: stepCard('target', 'green', 'Play 3 — Process optimisation with AI',
            "AI surfaces non-obvious process parameter relationships from historical data. Operators run experiments. Yield, throughput, energy efficiency improve incrementally and compound. Slowest win to deploy; most durable. Chapter four."),
          narration:
            "Play three. Process optimisation with AI. AI analyses historical process parameter data — temperatures, pressures, feed rates, line speeds, raw material characteristics — and surfaces non-obvious relationships between parameter settings and outcomes like yield, throughput, energy efficiency. Operators run controlled experiments to validate the AI suggestions. Improvements compound over time. This is the slowest win to deploy — typically six to nine months from data collection to first validated improvement. It is also the most durable because each improvement adds to baseline performance permanently. Chapter four covers the design discipline.",
        },
        {
          html: stepCard('zap', 'green', 'Play 4 — Plant-floor supply chain integration',
            "AI connects production planning to real-time material availability, supplier signal, demand forecast. When a critical material is delayed, the production schedule adapts within hours instead of days. Chapter five."),
          narration:
            "Play four. Plant-floor supply chain integration. AI connects production planning to real-time material availability, supplier signal from the operations course's supplier risk monitoring, demand forecast from the demand forecasting chapter. When a critical material is delayed upstream — the AI knows hours after the disruption signal arrives — the production schedule adapts within hours instead of days. Without this integration, planners discover material disruptions when the truck doesn't arrive at the loading dock, and the line is already idle. The integration is the difference between operational responsiveness and operational fragility. Chapter five covers it.",
        },
        {
          html: stepCard('shield', 'green', 'Play 5 — Safety AI augmenting human attention',
            "Vision systems detect PPE violations, near-miss patterns, ergonomic risk. Used as supplement to human safety attention, never as replacement. Three failure modes covered in chapter six — the safety play has higher discipline requirements than the others."),
          narration:
            "Play five. Safety AI augmenting human attention on the plant floor. Vision systems detect personal protective equipment violations, near-miss patterns near machinery, ergonomic risk patterns in repetitive work. Used as a supplement to human safety attention — by safety officers, line supervisors, the workforce themselves — never as a replacement for human judgment about safety. Three specific failure modes are covered in chapter six because the safety play has higher discipline requirements than the others. Get it wrong and you create a false confidence that workers and supervisors rely on, with consequences that aren't recoverable. Get it right and you genuinely reduce incident rates.",
        },
        {
          html: stepCard('sparkles', 'green', 'Play 6 — Digital twin — pragmatic, not megaproject',
            "Build digital twins of specific high-value equipment or specific bottleneck operations — not the whole plant. Use them for scenario testing, training, and predictive analysis. Done right, 4–6 months to value. Chapter seven covers the discipline."),
          narration:
            "Play six. Digital twin — pragmatic deployment, not a five-year megaproject. Build digital twins of specific high-value equipment or specific bottleneck operations — for example, the bottleneck CNC line, the most critical kiln, the highest-throughput assembly station. Don't try to build a whole-plant digital twin in one program. Use the targeted twins for scenario testing, operator training in safe conditions, and predictive analysis of process changes before committing capex. Done with the right scope, value lands in four to six months. Chapter seven covers the scope discipline and the three megaproject traps to refuse.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three pitches that disappoint on the shop floor',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The disappointments',
      bodyHtml: `<p>Three manufacturing AI pitches consistently disappoint when actually deployed to a working plant. Recognise them. Don't fund them. Redirect to the six plays that ship.</p>`,
      narrationLead:
        "Three manufacturing AI pitches consistently disappoint when actually deployed in a working production plant. All three show up frequently in manufacturing AI vendor decks and at industry conferences. Recognise them in the demo phase. Don't fund them. Redirect the budget to the six plays that ship. The pattern across all three — they require either ideal conditions or autonomous operation that real plants don't actually provide.",
      steps: [
        {
          html: stepCard('x', 'red', 'Disappointment 1 — End-to-end autonomous production',
            "AI runs the line without operator judgment in normal operations. Performs well in stable conditions; fails in the constant minor exceptions plant operators handle continuously — material variability, weather effects, shift handovers, equipment wear. Don\'t fund autonomous production."),
          narration:
            "Disappointment one. End-to-end autonomous production. The pitch — AI runs the entire production line without operator judgment in normal operations, freeing operators for higher-value work. The reality. Performs well in stable conditions where there's nothing for the operator to do anyway. Fails in the constant minor exceptions that plant operators handle continuously — raw material lot-to-lot variability, weather effects on humidity-sensitive processes, shift handovers where the new operator notices something subtle, equipment wear that hasn't yet triggered alarms but is starting to drift the process. These exceptions are exactly what operators are there for. Removing them is the failure mode. Don't fund autonomous production. Use AI to amplify operator judgment.",
        },
        {
          html: stepCard('x', 'red', 'Disappointment 2 — \"AI replaces operators\" cost models',
            "Vendor business cases assume AI deployment reduces headcount on the line. Plants discover the AI either needs an operator to manage exceptions (no headcount savings) or runs without one and fails costly exceptions (negative ROI). The labour-replacement framing is the wrong framing."),
          narration:
            "Disappointment two. AI replaces operators in the business case. Vendor business cases for manufacturing AI consistently assume that the deployment will reduce headcount on the line — meaning the ROI math depends on labour cost savings. Plants discover one of two failure modes once deployed. Either the AI needs an operator on hand to manage exceptions, so headcount savings don't materialise. Or the AI runs without an operator and fails costly exceptions, so the ROI becomes negative when the cost of failures is counted. The labour-replacement framing is the wrong framing for manufacturing AI economics. Use AI to amplify what operators can do — fewer incidents, higher yield, better throughput — and let the value case rest on those, not on headcount savings.",
        },
        {
          html: stepCard('x', 'red', 'Disappointment 3 — Whole-plant digital twin in 18 months',
            "Vendor pitches a full digital twin of the plant in 12–18 months. Reality — data integration alone takes that long, model accuracy is poor, the twin gets out of sync with the physical plant within months. Build targeted twins, not whole-plant twins. Refuse the megaproject pitch."),
          narration:
            "Disappointment three. Whole-plant digital twin delivered in twelve to eighteen months. The vendor pitches a complete digital twin of the entire plant covering every line, every piece of equipment, every process flow, with predictive analytics across the whole thing. Reality. Data integration alone across the plant's diverse OT systems — SCADA, MES, ERP, individual machine controllers from a dozen vendors — takes twelve to eighteen months on its own. The model accuracy on whole-plant simulation is poor because the data feeds aren't synchronised. The twin gets out of sync with the physical plant within months of go-live as plant configurations change. Build targeted digital twins of specific high-value equipment or bottlenecks. Refuse the whole-plant megaproject pitch. Chapter seven covers this in detail.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pattern',
        "All three replace or remove operator judgment, in environments where operator judgment handles the constant minor exceptions that AI doesn\'t generalise to. Augment operator judgment with AI signals — never replace it on a working plant floor."),
      calloutNarration:
        "The pattern across the three disappointments. All three try to replace or remove operator judgment in plant environments where operator judgment is handling the constant minor exceptions that AI doesn't generalise to. Raw material variability, weather effects, equipment wear, shift-handover discoveries. The operator catches them and adjusts. The AI cannot because the AI didn't see these specific variations during training. Augment operator judgment with AI signals — better information faster — but never replace it on a working plant floor. Same principle that runs through every operations AI course we've shipped.",
    },
    // SLIDE 4
    {
      title: 'The OT/IT bridge filter',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The filter',
      bodyHtml: `<p>One filter decides which AI plays are deployable in your plant right now versus which need foundation work first. The OT/IT bridge is the determinant. Honest assessment up front saves a year of pilot purgatory.</p>`,
      narrationLead:
        "One filter decides which AI plays are deployable in your plant right now versus which need foundation work first. The OT/IT bridge filter — how well operational technology data flows into information technology systems where AI can use it. Honest assessment of the bridge upfront saves a year of pilot purgatory where the technology was fine but the data foundation wasn't ready. Three checks. Run them per play. Sequence accordingly.",
      steps: [
        {
          html: stepCard('check', 'amber', 'Check 1 — Is the OT data accessible to IT systems?',
            "Most plants have SCADA, historian, MES data — but they\'re siloed or proprietary. AI lives in IT systems. If OT data can\'t reach IT systems reliably, no AI play in that area ships. The integration is foundation work."),
          narration:
            "Check one. Is the operational technology data accessible to the information technology systems where AI runs? Most plants have SCADA systems collecting sensor data, historians storing time-series, manufacturing execution systems tracking production — but the data is siloed in proprietary systems, in OT networks isolated from IT for security reasons, in formats that aren't easily consumed by modern AI infrastructure. AI lives in IT systems with the compute and the model tooling. If OT data can't reach IT systems reliably and at the right frequency, no AI play in that data domain ships in production regardless of how good the model would be. The OT-IT integration is foundation work and is often a six-to-twelve month engineering project. Sequence around it.",
        },
        {
          html: stepCard('check', 'amber', 'Check 2 — Is the data quality at usable level?',
            "Sensor drift, calibration gaps, missing data during shift handover, unrecorded line stoppages. Plant data is messier than the AI vendor demo dataset by an order of magnitude. Assess honestly; plan for data quality work."),
          narration:
            "Check two. Is the data quality at a usable level for AI? Plant data has characteristic quality issues that desk data doesn't. Sensor drift over time as instruments age. Calibration gaps when sensors are replaced. Missing data during shift handovers when the data collection wasn't running cleanly. Unrecorded line stoppages where the equipment was down but the data system kept logging zero values as if the equipment was running and producing zero. Plant data is messier than the AI vendor demo dataset by typically an order of magnitude. Assess honestly — sample a week of recent data and have your data engineering team rate it on completeness, accuracy, and consistency. Plan for the data quality work; it's the second foundation gap.",
        },
        {
          html: stepCard('check', 'amber', 'Check 3 — Does the plant culture support AI?',
            "Plants where operators are heard and respected tend to embed AI well — operators tell the AI program what works. Plants with top-down command culture struggle because operators silently work around AI they didn\'t shape. Cultural fit matters more than technology in manufacturing AI."),
          narration:
            "Check three. Does the plant culture support AI deployments? Plants where operators are heard and respected as the experts on the production lines tend to embed AI well — operators give honest feedback about what the AI is doing right and wrong, the AI program improves quickly based on operator input, the workforce experiences AI as a tool they helped shape. Plants with top-down command culture where operators are expected to execute directions from above tend to struggle with AI deployments because operators silently work around AI tools they didn't help shape, and the program loses value over time. Cultural fit matters more than technology in manufacturing AI. Honest assessment of the cultural pattern in your plant decides whether AI deployments will stick. If the cultural foundation isn't there, address that before the AI deployment, or at least design the rollout to actively engage operators in the design.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter two — predictive maintenance for plants.</p>`,
      narrationLead:
        "Three anchors before chapter two — predictive maintenance for plants.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Six plays that ship on the shop floor',
            "Predictive maintenance · quality vision · process optimisation · plant-floor supply chain · safety AI · pragmatic digital twin. Each survives shop-floor reality when deployed with discipline; each is covered in chapters 2–7."),
          narration:
            "One. Six manufacturing AI plays that consistently survive shop-floor reality. Predictive maintenance on critical equipment. Quality vision AI with the operator labelling loop. Process optimisation surfacing non-obvious parameter relationships. Plant-floor supply chain integration to demand and supplier signals. Safety AI augmenting human attention with higher discipline requirements. Pragmatic digital twin of targeted equipment and bottlenecks, not whole-plant megaproject. Each is covered in detail in chapters two through seven.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three pitches that disappoint',
            "End-to-end autonomous production · AI-replaces-operators business case · whole-plant digital twin in 18 months. All three remove operator judgment in environments where operators handle the constant minor exceptions. Don\'t fund."),
          narration:
            "Two. Three pitches that consistently disappoint when deployed in working plants. End-to-end autonomous production fails on the minor exceptions operators handle continuously. AI-replaces-operators business case math doesn't materialise — labour savings don't appear and the value case collapses. Whole-plant digital twin in eighteen months — data integration alone takes that long, model accuracy is poor at scale, twin drifts out of sync within months. Don't fund any of the three. All three remove operator judgment from environments where operator judgment is the value.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three-check OT/IT bridge filter',
            "Is OT data accessible to IT systems · is data quality usable · does plant culture support AI. All three are foundation gates. Honest assessment before pilots saves a year of pilot purgatory."),
          narration:
            "Three. Three-check OT/IT bridge filter applied per play before deployment. Is OT data accessible to IT systems where AI runs — usually a six to twelve month integration project if not yet bridged. Is data quality at a usable level — plant data has sensor drift, calibration gaps, handover blanks, unrecorded stoppages, expect data engineering work. Does the plant culture support AI — operators heard and shaping the program land well; top-down command cultures struggle silently. All three checks are foundation gates. Honest assessment up front saves the pattern of pilots that almost worked but couldn't reach production because the foundation wasn't ready.",
        },
      ],
      narrationTrail:
        "Chapter two — predictive maintenance for plants. Sensor coverage, the narrative layer, and the three project killers. See you there.",
    },
  ],
}
