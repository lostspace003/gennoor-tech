import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter04: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-process-optimisation',
  title: 'Process optimisation with AI',
  subtitle: 'Three signals that produce non-obvious improvements · the operator-led experiment design · avoiding the overfitting trap.',
  slides: [
    // SLIDE 1
    {
      title: 'Process optimisation with AI',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Process optimisation is the slowest manufacturing AI play to deploy — and the most durable. Improvements compound across years. Done well, the program produces a steady stream of validated yield and throughput gains. Done badly, it locks the plant into historical bad practices.</p>`,
      narrationLead:
        "Welcome to chapter four. Process optimisation with AI. Process optimisation is the slowest manufacturing AI play to deploy — typically six to nine months from data collection to first validated improvement. It is also the most durable because every improvement adds to baseline performance permanently. Done well over years, the program produces a steady compound stream of validated yield and throughput improvements. Done badly, it locks the plant into the historical bad practices the AI happened to learn from. Three signals that produce non-obvious improvements. The operator-led experiment design that validates them. The overfitting trap to avoid.",
    },
    // SLIDE 2
    {
      title: 'Three signals that produce non-obvious improvements',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The signals',
      bodyHtml: `<p>Three signals AI surfaces from process data that humans rarely catch unaided. Each is the basis for a candidate improvement. AI suggests; operators experiment and validate.</p>`,
      narrationLead:
        "Three signals AI surfaces from process parameter data that humans rarely catch unaided. Each signal is the basis for a candidate process improvement that operators then run controlled experiments to validate. AI doesn't tell the plant what to do — AI surfaces the patterns worth investigating. The human-in-the-loop validation is what protects against the overfitting trap covered later in the chapter. Three signals.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Signal 1 — Multi-parameter interactions humans miss',
            "Yield drops when temperature is high AND feed rate is high — even though each alone is fine. AI finds the interaction; humans rarely do because they vary one parameter at a time. Most operations textbooks miss these. Highest-value AI signal in process optimisation."),
          narration:
            "Signal one. Multi-parameter interactions humans miss. AI finds patterns where yield drops only when two or three parameters are simultaneously in specific ranges — for example, yield drops when temperature is high AND feed rate is high AND raw material moisture is above a threshold. Each parameter alone is fine; the combination is what causes the problem. Humans rarely catch these interactions because they vary one parameter at a time when troubleshooting and don't naturally think in multi-dimensional terms. Most operations textbooks miss these because they're written about single-variable optimisation. AI sees the multi-dimensional pattern across thousands of production runs. This is the highest-value signal AI surfaces in process optimisation programs — and the signal that justifies the AI investment over classical statistical process control.",
        },
        {
          html: stepCard('search', 'blue', 'Signal 2 — Drift patterns across long time windows',
            "Equipment performance drifts slowly over weeks or months. Humans adapt parameter settings to compensate without noticing. AI sees the drift and the compensation and surfaces what \"normal\" actually became — often farther from optimal than anyone realised."),
          narration:
            "Signal two. Drift patterns across long time windows. Equipment performance drifts slowly over weeks or months — bearings wear, sensors drift, scaling builds up in pipes. Operators adapt parameter settings to compensate for the drift without consciously noticing the pattern, because the adaptation is small at each shift. AI sees the multi-month drift pattern and the compensating parameter adjustments and surfaces what normal operating conditions actually became compared to the original design. Often the drifted state is meaningfully farther from optimal than anyone in the plant realised. Surfacing this enables targeted equipment maintenance to restore baseline, which produces a step-change improvement that compensating adjustments could never deliver. The long-window pattern is invisible to operators living it day to day; AI catches it because AI has the patience to compare three months ago to today.",
        },
        {
          html: stepCard('search', 'blue', 'Signal 3 — Best-shift patterns to share',
            "AI finds the shift with consistently better yield and surfaces the parameter patterns that shift uses. Best-shift practices propagate to other shifts. Tacit knowledge of the best operators becomes explicit improvement that scales. Often the highest-engagement signal — operators love this."),
          narration:
            "Signal three. Best-shift patterns to share. AI finds the shift, the operator, or the team that consistently achieves better yield, throughput, or quality on the same equipment with the same materials. Surfaces the parameter patterns that shift consistently uses — settings, sequence, timing. The tacit knowledge of the best operators becomes explicit data that other shifts can learn from. This is often the highest-engagement signal in process optimisation programs because operators love seeing their own techniques validated by data — and shifts compete constructively to be the source of the next pattern. Best-shift propagation typically produces meaningful improvement in average yield across the plant within two quarters as practices spread. Surface this signal early in the program; it builds engagement that powers the rest.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The operator-led experiment design',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The experiment',
      bodyHtml: `<p>AI surfaces candidates. Operators run experiments. Three design rules make the experiments both rigorous and respectful of operational reality. Skip the rules and either the experiments aren\'t rigorous or operators stop participating.</p>`,
      narrationLead:
        "AI surfaces candidate process improvements. Operators run controlled experiments to validate them on the actual line under actual conditions. Three design rules make the experiments both statistically rigorous and respectful of operational reality. Skip the rules and either the experiments aren't rigorous enough to trust the results or operators stop participating because the experiments interfere with their production targets. Both failure modes kill the program. The rules are the discipline that makes the program durable.",
      steps: [
        {
          html: stepCard('users', 'green', 'Rule 1 — Operators lead the experiment',
            "The operator on the line proposes the experiment, runs it, owns the data. AI provides the candidate; operator decides how to test. Ownership matters intensely — operators have to own the change for it to stick."),
          narration:
            "Rule one. Operators lead the experiment, not the AI program team. The operator on the line proposes the specific experiment based on the AI candidate — sometimes accepting the AI's specific parameter change, sometimes modifying it because the operator's context suggests a better test. The operator runs the experiment during their shift, owns the data collection, and presents the results. AI provides the candidate hypothesis. The operator decides how to test it and what to conclude. Ownership matters intensely in this design because operators have to own the resulting change for it to stick. Process changes imposed from above through AI program reports don't get internalised; changes operators discovered through their own experiments do. Design for operator ownership of the validation work; the durability follows.",
        },
        {
          html: stepCard('users', 'green', 'Rule 2 — Production targets protected during experiments',
            "Experiments don\'t risk missing the production target for the shift. Run during low-demand windows, on parallel lines, or with explicit operator authority to abort if the experiment threatens output. Otherwise operators silently sandbag experiments to protect their targets."),
          narration:
            "Rule two. Production targets are protected during experiments. Experiments don't risk missing the production target for the shift. Run experiments during low-demand windows when there's slack in the schedule. Run on parallel lines if the plant has them. Or run with explicit operator authority to abort the experiment immediately if it threatens output, with no negative consequence for aborting. Without this protection, operators silently sandbag experiments — running them but not really running them — to protect their production targets and bonuses. The data from sandbagged experiments is fiction and the program slowly fills with bad data. Protect the targets explicitly. The targets are real and matter; the program designs around them.",
        },
        {
          html: stepCard('users', 'green', 'Rule 3 — Statistical rigor without ceremony',
            "Pre-defined sample sizes (typically 30–50 production runs at the new parameter setting). Pre-defined success criteria (yield delta + p-value). Operators don\'t need to be statisticians, but the program needs to be rigorous enough to trust the conclusions."),
          narration:
            "Rule three. Statistical rigor without operational ceremony. The experiments need to be rigorous enough to trust the conclusions — pre-defined sample sizes typically thirty to fifty production runs at the new parameter setting, pre-defined success criteria including yield delta and statistical significance threshold, pre-registered before the experiment runs. But the rigor doesn't require operators to be statisticians. The AI program team handles the statistical design upfront — operators just run the agreed experiment and report the data honestly. The rigor matters because process optimisation makes permanent changes to plant operations based on the experiments; weak conclusions from weak experiments compound into permanent suboptimal operating practice. Get the rigor right without burdening operators with statistical complexity they don't need.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The compounding rhythm',
        "Run 2–3 experiments per month across the plant. Validated improvements implement immediately. After two years, the plant has 50+ validated improvements compounded into baseline performance. The pace is steady, not heroic. Steady is what compounds."),
      calloutNarration:
        "The compounding rhythm of process optimisation programs that work. Run two to three experiments per month across the plant — not every shift, not every week, just two or three monthly validated against the discipline. Validated improvements implement immediately into standard operating procedure. After two years, the plant has fifty or more validated improvements compounded into baseline performance — meaningful gains in yield, throughput, and energy efficiency. The pace is steady, not heroic. Steady is what compounds. Plants that try to run twenty experiments per month burn out the operator engagement and the experimental rigor; plants that run two or three steadily for years deliver the compounding gains.",
    },
    // SLIDE 4
    {
      title: 'The overfitting trap',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The trap',
      bodyHtml: `<p>One trap kills process optimisation programs that survive years one and two — the AI learns historical bad practices as if they were good, and locks the plant into them. Three guards prevent it.</p>`,
      narrationLead:
        "One trap kills process optimisation programs that survive years one and two. The AI overfits to historical data that includes bad operating practices the plant was running but didn't know were bad. The AI learns the bad practices as if they were the optimal practices because they're what the data shows. The plant gets locked into them. Three specific guards prevent the trap. Without the guards, the program slowly turns into the plant's historical bad practice institutionalised by AI recommendation.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Guard 1 — Engineering knowledge as a model input',
            "The AI doesn\'t just learn from historical data. Plant engineering team provides explicit constraints — physical bounds, safety limits, equipment design intents. The AI optimises within the constraints, not blind to them. Engineering knowledge is the floor on the optimisation."),
          narration:
            "Guard one. Engineering knowledge as an explicit model input, not just historical data. The AI doesn't just learn from what happened in your plant's history — which includes whatever bad practices were running. The plant engineering team provides explicit constraints. Physical bounds — pressure limits, temperature limits, flow rate maxima from the equipment design. Safety limits — non-negotiable boundaries from process safety analysis. Equipment design intents — what the equipment was designed to do at what conditions. The AI optimises within the constraints rather than blind to them. Without this guard, the AI might suggest parameters that produced higher yield in history but were also wearing equipment faster than is sustainable — and the plant pays the cost later in maintenance and equipment replacement. Engineering knowledge is the floor on the optimisation.",
        },
        {
          html: stepCard('shield', 'green', 'Guard 2 — External benchmark comparison',
            "Periodically compare your AI-suggested parameters against industry benchmarks, peer plants, vendor recommendations. If your AI keeps suggesting parameters far outside industry norms, you may be overfitting to your plant\'s specific bad practice — investigate before implementing."),
          narration:
            "Guard two. External benchmark comparison periodically. Once or twice a year, compare your AI-suggested operating parameters against industry benchmarks for similar equipment and processes, peer plants if data is available through industry associations, vendor recommendations for the equipment in use. If your AI keeps suggesting parameters meaningfully outside industry norms — high or low — you may be overfitting to your plant's specific historical practice rather than finding genuine optimisation opportunities. Investigate the discrepancy before implementing. Sometimes your plant genuinely has a unique optimum that benchmarks miss; sometimes you're locked into a historical practice that an external view reveals as suboptimal. The benchmark comparison is the audit. Do it; don't rely on internal data alone for years.",
        },
        {
          html: stepCard('shield', 'green', 'Guard 3 — Annual program review for systemic bias',
            "Once a year, the AI program lead, plant engineering, and operations leadership review the year\'s implemented improvements. Look for patterns — has the AI been pushing the plant toward higher energy use, faster equipment wear, narrower operating range that\'s less resilient? Systemic bias surfaces in the aggregate review."),
          narration:
            "Guard three. Annual program review for systemic bias. Once a year, the AI program lead, plant engineering, and operations leadership review the year's implemented improvements as a whole. Look for patterns across the improvements. Has the AI consistently been pushing the plant toward higher energy use because yield improvements came from higher operating temperatures? Toward faster equipment wear because throughput improvements came from harder operating conditions? Toward narrower operating range that's less resilient to material variation or environmental variation? Each individual improvement looked good in isolation; the aggregate trend may reveal systemic bias that needs correction. Systemic bias is invisible at the individual experiment level and surfaces only in the aggregate annual review. Schedule the review explicitly. The hour spent annually protects against years of accumulating drift in the wrong direction.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter five — plant-floor supply chain integration.</p>`,
      narrationLead:
        "Three anchors before chapter five — plant-floor supply chain integration.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three signals that produce improvements',
            "Multi-parameter interactions humans miss (highest value) · long-window drift patterns invisible to operators living them · best-shift patterns to share (highest engagement). Surface the best-shift signal early to build engagement."),
          narration:
            "One. Three signals AI surfaces from process data that produce non-obvious improvements. Multi-parameter interactions humans miss because they vary one parameter at a time when troubleshooting — highest-value AI signal in process optimisation. Long-window drift patterns invisible to operators living them day to day — AI's patience to compare three months ago to today catches what operators adapt to without noticing. Best-shift patterns to share — tacit knowledge of best operators becomes explicit data other shifts learn from. Surface the best-shift signal early in the program; it builds the engagement that powers the rest.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three experiment design rules',
            "Operators lead the experiment (own the data and the change) · production targets protected (no sandbagging) · statistical rigor without operational ceremony. 2–3 experiments per month for years — steady compounds; heroic burns out."),
          narration:
            "Two. Three experiment design rules for operator-led validation. Operators lead the experiment, propose the test, run it, present the results — ownership matters intensely because changes operators discovered through their own experiments are the changes that stick. Production targets protected during experiments — run during low-demand windows or on parallel lines or with abort authority, otherwise operators silently sandbag experiments to protect their targets. Statistical rigor without operational ceremony — pre-defined sample sizes, success criteria, registered before the experiment, but the rigor is handled upfront by the AI program team so operators just run the agreed experiment honestly. Two to three experiments per month for years; the steady pace compounds.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three overfitting guards',
            "Engineering knowledge as model input (constraints) · external benchmark comparison periodically · annual program review for systemic bias. Prevents the year-three trap where AI locks the plant into historical bad practice institutionalised as optimal."),
          narration:
            "Three. Three guards against the overfitting trap that kills programs in year three. Engineering knowledge as an explicit model input — physical bounds, safety limits, equipment design intents constrain the AI's search space so it can't suggest parameters that produced apparent yield gains while wearing equipment unsustainably. External benchmark comparison periodically — once or twice a year against industry norms, peer plants, vendor recommendations to catch the bias when your AI is pushing far outside industry practice. Annual program review for systemic bias — pattern across all improvements, looking for cumulative drift toward higher energy use, faster wear, narrower resilient range. Without the guards, the AI institutionalises historical bad practice; with them, the program compounds genuine improvements across years.",
        },
      ],
      narrationTrail:
        "Chapter five — plant-floor supply chain integration. Connecting demand forecast and supplier signals to actual production scheduling. See you there.",
    },
  ],
}
