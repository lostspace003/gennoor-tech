import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter05: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-ld-personalisation',
  title: 'L&D personalisation',
  subtitle: 'Where AI helps people learn what they actually need — without recommending the same five courses to everyone.',
  slides: [
    // SLIDE 1
    {
      title: 'L&D personalisation',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Learning teams have always wanted personalisation. Pre-AI, personalisation meant recommending three courses based on someone’s job title. Post-AI, it means understanding what someone actually does — and what they actually need. In the next few minutes, how to do that responsibly.</p>`,
      narrationLead:
        "Welcome to chapter five. L and D personalisation. Learning teams have always wanted real personalisation. Pre-AI, personalisation meant recommending three courses based on someone's job title — better than nothing, but not by much. Post-AI, personalisation means understanding what someone actually does day to day, what skills their work needs, and where their gaps are. The technology is genuinely there. The question is how to do it responsibly — without recommending the same five courses to everyone, without surfacing bias in who gets which opportunity, and without treating learners as data points. Three lessons.",
    },
    // SLIDE 2
    {
      title: 'Three components of useful L&D personalisation',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 1 · The components',
      bodyHtml: `<p>Three components. Each one matters. Most L&D AI deployments stop at component one — and wonder why personalisation feels generic.</p>`,
      narrationLead:
        "Three components in L and D personalisation done well. Most deployments stop at component one — and then wonder why the personalisation feels generic. Build all three.",
      steps: [
        {
          html: stepCard('bookOpen', 'green', 'Component 1 — Skill inventory grounded in real work',
            "Don't infer skills from job title. Infer them from the work — projects, deliverables, peer feedback, manager notes. The inference is messier; it's also dramatically more accurate."),
          narration:
            "Component one. Skill inventory grounded in real work. Don't infer an employee's skills from their job title alone — that produces the generic five-course recommendation that gives personalisation a bad name. Infer skills from the actual work — projects they've delivered, deliverables they've shipped, peer feedback in performance reviews, manager notes on what they did well or struggled with. The inference is messier than reading off a job title. It is also dramatically more accurate. And it gives the employee credit for capability the title doesn't capture.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Component 2 — Gap analysis against where they\'re going — not just where they are',
            "Personalisation that surfaces only what fits today's role plateaus the employee. Add the dimension of where they might go next — their interest, their manager's view, their team's strategic direction. Then surface the gap between today and there."),
          narration:
            "Component two. Gap analysis against where they're going — not just where they are. Personalisation that only surfaces content fitting today's role plateaus the employee. They feel pigeon-holed. Add the dimension of where they might go next. Their own stated interest. Their manager's view. The team's strategic direction. Then surface the gap between today's skills and the skills the next destination needs. The learner sees a development path — not a refresher loop. That's what makes the personalisation feel useful rather than reductive.",
        },
        {
          html: stepCard('bookOpen', 'amber', 'Component 3 — Recommendation with rationale and override',
            "Every recommendation includes the why — “based on your work on X and your interest in Y, this course closes the skill in Z”. And every recommendation includes a clear override — “show me something else” — that doesn't penalise the learner."),
          narration:
            "Component three. Recommendation with rationale and override. Every recommendation the system makes includes the why. Based on your work on this project. And your stated interest in this area. This course closes the skill gap in that area. The rationale matters because it lets the employee evaluate whether the recommendation actually fits — or whether the inference was wrong. And every recommendation includes a clear override — show me something else. With no penalty for using the override, and no implicit punishment for skipping the recommended course. Agency is preserved. Personalisation supports the learner; it doesn't direct them.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Personalisation supports — it never directs',
        "The single most important design rule. Personalisation surfaces options. The employee chooses. Manager and HR see what was recommended — but never punish the employee for declining a recommendation. The moment AI directs rather than supports, trust collapses."),
      calloutNarration:
        "The single most important design rule in L and D personalisation. Personalisation supports — it never directs. The system surfaces options with rationale. The employee chooses what to pursue. Manager and HR can see what was recommended for transparency, but neither ever penalises the employee for declining a recommendation. The moment AI directs rather than supports — meaning the employee feels they must take the recommendation or be marked down — trust in the whole L and D system collapses. Defend the support frame. Reject any vendor or process that quietly turns recommendations into expectations.",
    },
    // SLIDE 3
    {
      title: 'The bias risks specific to L&D personalisation',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · Bias',
      bodyHtml: `<p>L&D personalisation has its own bias risks — different from recruiting. Three risks to monitor specifically.</p>`,
      narrationLead:
        "L and D personalisation has its own bias risks. Different from recruiting AI. Different from policy Q and A. Three risks specific to L and D — monitor them specifically.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Risk 1 — Path lock-in for under-represented groups',
            "If the model infers from historical work — and women, for example, have been historically under-promoted in your firm — the model recommends paths that match the historical pattern rather than the equitable future. Monitor recommendations by group; intervene where patterns diverge."),
          narration:
            "Risk one. Path lock-in for under-represented groups. If the model infers next-step recommendations from historical work patterns — and women, for example, have been historically under-promoted in your firm — the model recommends career paths that match the historical pattern rather than the equitable future you want. The model is technically correct about the past. It is exactly wrong about the future you're trying to build. Monitor recommendations by group. Intervene where patterns diverge from your stated DE and I commitments. The intervention is the discipline.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Risk 2 — Manager bias amplification',
            "If recommendations rely on manager input and your managers have varying calibration, the recommendation reflects manager bias rather than employee capability. Cross-check recommendations against peer feedback and project outcomes — not just manager input."),
          narration:
            "Risk two. Manager bias amplification. If the recommendation system relies heavily on manager input — performance ratings, manager notes on potential — and your managers have varying calibration, which is the truth in most organisations, the recommendation reflects manager bias rather than the employee's actual capability. Cross-check recommendations against multiple signals — peer feedback, project outcomes, the employee's own stated interest — not just manager input. The cross-checking is what neutralises manager bias from compounding through the L and D system.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Risk 3 — Content-availability bias',
            "If your learning library is heavily weighted toward technical content, the system recommends technical paths — for everyone — because that's what's available. Audit the content library by domain; recommendations are only as balanced as the library."),
          narration:
            "Risk three. Content-availability bias. If your learning content library is heavily weighted toward, say, technical content because you've invested there for the last three years, the system tends to recommend technical paths for everyone — because that's what's available to recommend. The model isn't biased. The library is. Audit the content library by domain. Add content where the gap surfaces — leadership content, customer-empathy content, cross-functional content. Recommendations are only ever as balanced as the library underneath. Balance the library first.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three metrics that L&D teams should actually track',
      iconKey: 'target',
      eyebrow: 'Lesson 3 · Metrics',
      bodyHtml: `<p>Three metrics. Not completion rate — that's a vanity number. Three metrics that actually tell you whether the personalisation is working.</p>`,
      narrationLead:
        "Three metrics that L and D teams should actually track. Not completion rate — that's a vanity number that tells you whether someone clicked through, not whether they learned anything. Three metrics that genuinely tell you whether the personalisation is working.",
      steps: [
        {
          html: stepCard('target', 'green', '1 · Skill movement over 6 months',
            "Before-and-after assessment of the skill the learning targeted. Did the employee actually become more capable in that area? If not — the content isn't working, or the recommendation was wrong. Don't ignore this metric."),
          narration:
            "Metric one. Skill movement over six months. A before-and-after assessment of the specific skill the learning was supposed to develop. Did the employee actually become more capable in that area? Not did they complete the course — did they grow the skill. If the answer is no across enough learners, either the content isn't working or the recommendation was wrong. Don't ignore this metric. It is the only metric that tells you the L and D investment is producing capability rather than just attendance.",
        },
        {
          html: stepCard('target', 'amber', '2 · Voluntary engagement beyond the recommendation',
            "Does the employee come back for more — without being assigned? Voluntary engagement is the trust signal. High completion of mandatory training tells you nothing about voluntary engagement. Track them separately."),
          narration:
            "Metric two. Voluntary engagement beyond the recommendation. Does the employee come back to the system for more learning — without being assigned, without being pushed by a manager. Voluntary engagement is the trust signal. High completion of mandatory training tells you almost nothing about voluntary engagement — and mandatory completion is often a poor proxy for actual learning. Track voluntary engagement separately. It is a leading indicator of L and D culture health.",
        },
        {
          html: stepCard('target', 'red', '3 · Cross-group fairness of opportunity',
            "Are recommendations and learning opportunities being distributed equitably across protected and proxy groups? If a stretch programme always recommends people from one demographic profile — investigate. The fairness of opportunity is upstream of the fairness of outcome."),
          narration:
            "Metric three. Cross-group fairness of opportunity. Are recommendations and learning opportunities being distributed equitably across protected and proxy groups? If a stretch leadership programme always recommends people from one demographic profile — investigate, even if the model can defend itself with the historical data it learned from. The fairness of opportunity is upstream of the fairness of outcome. Fix it upstream. The downstream fairness numbers — promotion rates, pay equity — will improve as a result. Slowly, but durably.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'Quarterly DE&I review of recommendations',
        "Once a quarter, the DE&I team reviews the distribution of recommendations across groups. Findings inform tuning. This relationship — built deliberately — turns DE&I from a checkpoint into a partner in L&D AI work."),
      calloutNarration:
        "Add this rhythm. Once a quarter, the diversity, equity, and inclusion team reviews the distribution of recommendations across groups. Findings inform the next quarter's tuning of the system — and sometimes of the content library. This relationship, built deliberately between L and D and DE and I, turns the DE and I team from a checkpoint into a working partner in L and D AI work. The work gets better. The relationship gets better. The audit conversation, when it happens, gets calmer. All three benefits come from one quarterly meeting. Worth it.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 6 — performance, feedback, and the line we don\'t cross.</p>`,
      narrationLead:
        "Three anchors before chapter six — performance, feedback, and the line we don't cross.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three components, all three together',
            "Skill inventory from real work · gap analysis toward where they're going · recommendation with rationale and override. Skip any one and personalisation feels generic."),
          narration:
            "One. Three components, all three together. Skill inventory grounded in real work — not just job title. Gap analysis toward where the employee might go next, not just where they are. Recommendation with rationale and an easy override. Skip any one of the three and personalisation feels generic — and trust drops.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three bias risks specific to L&D',
            "Path lock-in for under-represented groups · manager bias amplification · content-availability bias. Different from recruiting risks. Monitor them specifically."),
          narration:
            "Two. Three bias risks specific to L and D personalisation. Path lock-in for under-represented groups. Manager bias amplification through over-reliance on manager input. Content-availability bias from an unbalanced learning library. Different from recruiting risks. Monitor them specifically. Don't assume generic bias monitoring catches these.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three metrics that matter',
            "Skill movement at 6 months · voluntary engagement beyond recommendation · cross-group fairness of opportunity. Not completion rate. Completion rate is theatre."),
          narration:
            "Three. Three metrics that matter. Skill movement over six months — did the learner actually become more capable. Voluntary engagement beyond the recommendation. Cross-group fairness of opportunity. Not completion rate. Completion rate is theatre. The three metrics above are the honest ones — and they're the ones that tell you whether L and D AI is producing capability or producing clicks.",
        },
      ],
      narrationTrail:
        "Chapter six — performance, feedback, and the line we don't cross. The line that protects everyone. See you there.",
    },
  ],
}
