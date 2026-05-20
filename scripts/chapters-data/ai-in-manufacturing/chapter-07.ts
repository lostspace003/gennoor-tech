import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter07: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-digital-twin',
  title: 'Digital twin — pragmatic, not megaproject',
  subtitle: 'Three targeted twins that ship in 4–6 months · three megaproject traps to refuse · the use cases where digital twin compounds value.',
  slides: [
    // SLIDE 1
    {
      title: 'Digital twin — pragmatic, not megaproject',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Digital twin is the most over-pitched manufacturing AI concept of the decade. Done pragmatically — targeted twins of specific high-value equipment — it ships in 4–6 months and compounds value. Done as a whole-plant megaproject, it consumes years and delivers nothing usable.</p>`,
      narrationLead:
        "Welcome to chapter seven. Digital twin — pragmatic, not megaproject. Digital twin is the most over-pitched manufacturing AI concept of the decade. The pitches are seductive. The whole-plant simulation that predicts everything. The five-year transformation roadmap. The strategic narrative for the board. Done pragmatically, digital twin is a useful tool — targeted twins of specific high-value equipment or bottleneck operations that ship in four to six months and compound value over years. Done as a whole-plant megaproject as the vendor pitches typically frame it, digital twin consumes years of budget and delivers nothing usable. Three targeted use cases that ship. Three megaproject traps to refuse. The discipline that distinguishes the two.",
    },
    // SLIDE 2
    {
      title: 'Three targeted twins that ship',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The targeted twins',
      bodyHtml: `<p>Three categories of digital twin that consistently ship value in 4–6 months. Each is bounded — specific equipment or specific operation, not the whole plant. Each has clear use that justifies the investment.</p>`,
      narrationLead:
        "Three categories of digital twin that consistently ship value within four to six months. Each is deliberately bounded — a specific piece of high-value equipment, a specific bottleneck operation, or a specific high-impact decision-support need. Not the whole plant. Each has a clear use case that justifies the investment in the data foundation and the model build. Together they give a plant a portfolio of useful twins rather than one ambitious whole-plant twin that never delivers.",
      steps: [
        {
          html: stepCard('cog', 'blue', 'Twin 1 — Critical equipment twin (for predictive analysis)',
            "Twin of one critical piece of equipment — e.g., the bottleneck CNC line, the main kiln, the highest-throughput press. Used for what-if analysis on operating changes, failure-mode prediction, maintenance scheduling. 4–6 months to first value."),
          narration:
            "Twin one. Critical equipment twin for predictive analysis. A digital twin of one specific high-value piece of equipment — the bottleneck CNC line, the main kiln in the ceramics plant, the highest-throughput press in the stamping operation. The twin models the equipment's behaviour based on sensor data plus engineering specifications. Used for what-if analysis on proposed operating changes — what happens if we run this kiln five percent hotter to debottleneck production. Failure-mode prediction — given current sensor patterns, what failures become likely in the next month. Maintenance scheduling — what's the optimal time to do this major service given current load and equipment state. Four to six months from program start to first useful predictions. Bounded scope makes it tractable.",
        },
        {
          html: stepCard('zap', 'blue', 'Twin 2 — Bottleneck operation twin (for scenario testing)',
            "Twin of the bottleneck operation in the plant — the constraint resource. Used for scenario testing — what if we change shift pattern, add second crew, change product mix, sequence orders differently. Decisions about the bottleneck have outsized impact; twin pays back fast."),
          narration:
            "Twin two. Bottleneck operation twin for scenario testing. A digital twin of the specific operation that's currently the bottleneck in the plant — the constraint resource that determines plant throughput. Used for scenario testing on operational decisions affecting the bottleneck. What if we change the shift pattern on this operation. What if we add a second crew during peak periods. What if we change the product mix to favour the products that flow more easily through this constraint. What if we sequence orders differently to reduce setup time loss. Decisions about the bottleneck have outsized impact on overall plant throughput; the twin pays back fast because every bottleneck improvement directly translates to plant output. Worth building even if other twins aren't justified.",
        },
        {
          html: stepCard('users', 'blue', 'Twin 3 — Operator training twin (for safe skill building)',
            "Twin of the equipment or process that\'s hardest to train operators on safely in production. New operators practice in the twin — including rare failure modes that real production rarely shows. Reduces ramp time and improves crisis response. Underrated use case."),
          narration:
            "Twin three. Operator training twin for safe skill building. A digital twin of the equipment or process that's hardest to train new operators on safely in real production — typically high-consequence equipment where mistakes have major cost, or rare-event processes where training opportunities are scarce. New operators practice in the twin — running normal operations, exceptional conditions, and rare failure modes that real production rarely shows. Reduces ramp time for new hires significantly. Improves crisis response across the workforce because everyone has experience with rare scenarios that they never would have encountered in routine production. This is an underrated use case for digital twin — the productivity case is clear, the safety case is clear, the investment is bounded. Many plants would benefit from this twin specifically before any other twin investment.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three megaproject traps to refuse',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The traps',
      bodyHtml: `<p>Three megaproject framings show up in digital twin vendor pitches and consistently fail. Each consumes years of budget and produces nothing usable. Recognise them in the pitch and refuse them.</p>`,
      narrationLead:
        "Three megaproject framings show up in digital twin vendor pitches and consistently fail to deliver. Each consumes years of budget — typically eighteen months to three years — and produces nothing usable at the end. Recognise them in the pitch phase and refuse them. The vendor enthusiasm is real; the engineering reality is that whole-plant twins are not yet achievable at acceptable cost and quality. The pitch market has not caught up to the engineering reality.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap 1 — Whole-plant twin in 18 months',
            "Pitch — complete digital twin of the entire plant in 18 months covering every line, every piece of equipment, every flow. Reality — data integration alone takes 18 months; model accuracy is poor at scale; the twin drifts out of sync within months of go-live. Refuse."),
          narration:
            "Trap one. Whole-plant twin delivered in eighteen months. Pitch — complete digital twin of the entire plant covering every line, every piece of equipment, every material flow, every operator interaction, with predictive analytics across the whole thing. Reality. Data integration across the plant's diverse OT systems — SCADA from one vendor, MES from another, individual machine controllers from a dozen different OEMs, ERP from a third vendor — takes eighteen months on its own, before any modelling work. Model accuracy at the whole-plant scale is poor because the data feeds aren't synchronised and the interactions between subsystems are complex. The twin gets out of sync with the physical plant within months of go-live as plant configurations change. Refuse the whole-plant twin pitch. Build targeted twins instead. Same total budget produces useful tools rather than one ambitious deliverable that doesn't work.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 2 — Five-year transformation roadmap',
            "Pitch — multi-phase digital transformation program with the twin as the centrepiece. Five years. Hundreds of millions. \"Strategic narrative for the board.\" Reality — five-year tech programs in operations don\'t survive leadership changes, market shifts, or honest milestone reviews. Refuse the megaproject."),
          narration:
            "Trap two. Five-year transformation roadmap with digital twin as the centrepiece. The pitch frames digital twin not as a tool but as a multi-phase strategic transformation program. Five years. Often hundreds of millions of dollars. Strategic narrative for the board about the digital factory of the future. Reality. Five-year tech programs in operations don't survive leadership changes — by year three, the executive sponsor has moved on and the new leadership has different priorities. They don't survive market shifts — by year three, the plant's product mix or customer base has changed in ways the program didn't anticipate. They don't survive honest milestone reviews — by year two, the cumulative spend is large and the deliverables are thin. Refuse the megaproject framing regardless of how compelling the vendor narrative is. Build targeted twins in six-month increments instead. Each increment ships and earns the right to fund the next.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 3 — Twin as the unified operations platform',
            "Pitch — twin replaces the existing patchwork of OT systems, MES, planning tools, dashboards. Single source of truth. Reality — the existing systems work and have years of operator familiarity; replacing them creates massive change management cost. Twin complements existing systems; it doesn\'t replace them."),
          narration:
            "Trap three. Twin positioned as the unified operations platform that replaces the existing patchwork of OT systems, MES, planning tools, and dashboards. Pitch — single source of truth for plant operations across what currently lives in a dozen different systems. Reality. The existing systems work, are tuned to your plant's specific operations over years, and have deep operator familiarity. Replacing them with a single twin platform creates massive change management cost — operators need to relearn workflows, integrations to other plant systems break, the assumed simplification turns out to be more complex than what was replaced. Twin complements the existing systems by providing specific capabilities they lack — predictive analysis, scenario testing, training simulation — not by replacing them. Refuse the unified-platform pitch. Use the twin for what twins are good at and leave the existing systems doing what they're good at.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'How to refuse without being adversarial',
        "Ask the vendor for three references where the whole-plant twin or the five-year program shipped on time at quality. They generally can\'t produce them. \"Show me three customer outcomes that match this pitch\" is the polite refusal that ends the conversation."),
      calloutNarration:
        "How to refuse the megaproject pitches without being adversarial in the vendor relationship. Ask the vendor for three customer references where the whole-plant twin or the five-year transformation program shipped on time at quality. They generally cannot produce three solid references — the pattern of failure is widespread enough that the references aren't there. Show me three customer outcomes that match this pitch is the polite request that ends the megaproject conversation respectfully. Then ask about smaller targeted use cases where they do have strong references. Most digital twin vendors have real success stories at bounded scope; they pitch the megaproject because the budget is larger, not because that scope has higher success rate. Steer to the bounded scope where references support the claim.",
    },
    // SLIDE 4
    {
      title: 'The discipline that distinguishes pragmatic from megaproject',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The discipline',
      bodyHtml: `<p>Three rules separate pragmatic digital twin from megaproject. Apply the three rules to every twin proposal and the distinction becomes obvious in five minutes.</p>`,
      narrationLead:
        "Three rules that separate pragmatic digital twin programs from megaproject pitches. Apply the three rules to every proposed twin program before approving it. The distinction between pragmatic and megaproject becomes obvious in five minutes once the rules are explicit. The rules are simple to apply and the discipline of applying them protects against the most common failure mode in digital twin investment.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Rule 1 — Six-month time-to-value',
            "If the proposed twin can\'t ship measurable use case value within six months, it\'s the wrong scope. Either reduce the scope to fit six months, or don\'t fund it. Six months is the time horizon that survives organisational reality."),
          narration:
            "Rule one. Six-month time-to-value. If the proposed digital twin program can't ship measurable use case value within six months of program start, the scope is wrong. Either reduce the scope until six months is achievable or don't fund the program. Six months is the time horizon that survives organisational reality — leadership attention persists for six months, budget cycles tolerate six months, the team that started the program is mostly still there at six months. Twelve months stretches it. Eighteen months breaks it for most plant organisations. Refuse scopes that promise value beyond six months from program start. The vendor will protest that real twins require longer; the right scopes can deliver useful value in six months and earn the right to fund the next increment.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 2 — One bounded use case, not a platform',
            "Twin proposal must name one specific use case it serves — predictive maintenance on one equipment, scenario testing on one operation, operator training on one process. Not \"unified plant intelligence\" or \"digital transformation platform.\" One use case per twin."),
          narration:
            "Rule two. One bounded use case per twin, not a platform. The twin proposal must name one specific use case it will serve. Predictive maintenance analysis on the bottleneck CNC equipment. Scenario testing on the heat-treatment operation. Operator training on the high-consequence press. Not unified plant intelligence. Not digital transformation platform. Not single source of operational truth. One specific use case. The bounded use case forces the scope to be tractable and the success criteria to be measurable. Platform framings have unbounded scope and never-clear success criteria, which is exactly the failure mode of digital twin megaprojects. The rule is simple — what specific use case justifies this twin. If the answer is multiple, build multiple bounded twins not one platform.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 3 — Real engineers from the plant in the design',
            "Plant engineers — not the AI program team and not the vendor consultants — must be in the design phase deciding what gets modeled, what data feeds the model, what use cases the twin must serve. Their participation ensures the twin matches plant reality, not vendor reference architecture."),
          narration:
            "Rule three. Real engineers from the plant must be in the twin design phase. Not the AI program team in isolation. Not the vendor consultants in isolation. Plant engineers — typically the senior maintenance engineer for an equipment twin, the senior process engineer for an operation twin, the experienced operators for a training twin — must be in the design phase deciding what gets modeled, what data feeds the model, what specific use cases the twin must serve. Their participation ensures the twin matches plant reality rather than vendor reference architecture. Plant engineers will catch the assumptions the AI program team or the vendor would make incorrectly — for example, this equipment doesn't actually run continuously as the vendor assumes, our raw material variability is much wider than the standard reference data, our maintenance practice differs from the textbook. The engineer participation is the determinant of whether the twin reflects your specific plant or a generic plant.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter eight — the capstone.</p>`,
      narrationLead:
        "Three anchors before chapter eight — the capstone, your 12-month plant AI roadmap.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three targeted twins that ship',
            "Critical equipment twin (predictive analysis) · bottleneck operation twin (scenario testing) · operator training twin (safe skill building). Each bounded to specific use, each shipping in 4–6 months. Build a portfolio of targeted twins, not one whole-plant twin."),
          narration:
            "One. Three targeted digital twins that consistently ship value in four to six months. Critical equipment twin for predictive analysis on one high-value equipment piece. Bottleneck operation twin for scenario testing of decisions that affect the constraint resource. Operator training twin for safe skill building on the equipment that's hardest to train on in real production. Each bounded to a specific use case. Build a portfolio of targeted twins over time rather than committing to one ambitious whole-plant twin that doesn't deliver. Same total investment, much better return.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three megaproject traps',
            "Whole-plant twin in 18 months (data integration alone takes 18 months) · five-year transformation roadmap (doesn\'t survive organisational reality) · twin as unified operations platform replacing existing systems (massive change management cost). Refuse all three pitches."),
          narration:
            "Two. Three megaproject traps to refuse in digital twin vendor pitches. Whole-plant twin delivered in eighteen months — data integration alone takes that long, model accuracy is poor at scale, twin drifts out of sync with physical plant within months. Five-year transformation roadmap with twin as the centrepiece — doesn't survive organisational reality of leadership changes, market shifts, honest milestone reviews. Twin positioned as the unified operations platform replacing existing OT systems, MES, planning tools — massive change management cost destroys the value case. Ask vendors for three references where the megaproject scope shipped on time at quality; they generally can't produce them. Steer to bounded scope where references support the claim.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three rules for pragmatic twin',
            "Six-month time-to-value (or reduce scope, or don\'t fund) · one bounded use case per twin, not a platform · real plant engineers in the design phase. Apply the rules to every proposal; the distinction between pragmatic and megaproject becomes obvious in 5 minutes."),
          narration:
            "Three. Three rules for distinguishing pragmatic digital twin from megaproject pitch. Six-month time-to-value — if the proposed twin can't ship measurable use case value within six months, reduce the scope to fit six months or don't fund it. One bounded use case per twin, not a platform — twin proposal must name one specific use case it serves, not unified plant intelligence or digital transformation. Real plant engineers in the design phase — not just AI program team and vendor consultants, the engineers who actually run the equipment or operation make the twin reflect plant reality rather than vendor reference architecture. Apply the three rules to every proposal; the pragmatic-versus-megaproject distinction becomes obvious in five minutes.",
        },
      ],
      narrationTrail:
        "Chapter eight — the capstone. Your 12-month plant AI roadmap, OEE and quality KPIs that prove ROI, and four conversations to schedule Monday. See you there.",
    },
  ],
}
