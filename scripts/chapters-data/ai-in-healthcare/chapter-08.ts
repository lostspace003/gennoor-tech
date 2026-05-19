import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiHealthcareChapter08: Chapter = {
  courseId: 'ai-in-healthcare',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your hospital AI roadmap on one page',
  subtitle: 'Seven chapters down. One page executive leadership can adopt at the next meeting.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your hospital AI roadmap on one page',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built a hospital-leadership view of AI. Now — one roadmap. One page. Something executive leadership can adopt at the next meeting, defend at the board, and brief to the regulator in the same form.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built a hospital-leadership view of AI. Now we collapse it. One roadmap. One page. Something executive leadership can adopt at the next meeting. Defend at the board. And brief to the regulator in the same form. Three audiences. One page. Here's what's on it.",
    },
    // SLIDE 2
    {
      title: 'The hospital AI roadmap — one page',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Six sections. Each one specific enough to defend; concrete enough to act on this quarter.</p>`,
      narrationLead:
        "Six sections. Each one specific enough to defend in an executive meeting. Each one concrete enough to act on this quarter. Use this template at your next hospital executive meeting.",
      steps: [
        {
          html: stepCard('compass', 'green', '1 · The play sequence over 24 months',
            "“Quarters 1–2: clinical documentation + one operations play (typically bed management or coding). Quarters 3–4: patient journey copilots. Quarters 5–6: imaging AI category-1. Quarters 7–8: imaging AI category-2 + L&D for clinicians.”"),
          narration:
            "Section one. The play sequence over twenty-four months. Quarters one and two — clinical documentation AI plus one operations play. Typically bed management or coding, whichever your hospital's economics most need. Quarters three and four — patient journey copilots. Quarters five and six — imaging AI in category one. Quarters seven and eight — imaging AI in category two if the evidence has matured, plus learning and development AI for clinicians. Twenty-four-month horizon. Defensible. Specific. The shape executive leadership can commit to with confidence.",
        },
        {
          html: stepCard('compass', 'red', '2 · The line — AI never makes the final clinical decision',
            "Stated explicitly on the roadmap. Documented in the AI policy. Defended against vendor pressure and against internal enthusiasm. The line is the line."),
          narration:
            "Section two. The line. AI never makes the final clinical decision. Stated explicitly on the roadmap document, in plain language. Documented in the hospital's formal AI policy. Defended against vendor pressure and against internal enthusiasm. The line is the line. Putting it on the roadmap signals to the entire organisation — and to the regulator — that the hospital has decided this, deliberately, at the executive level.",
        },
        {
          html: stepCard('compass', 'blue', '3 · The sovereignty and PHI posture',
            "Sovereign cloud for clinical documentation and most patient-facing AI. On-premise inference scoped for genomic, mental health, paediatric. De-identification for population-analytics workloads. Per-system; documented; reviewed annually."),
          narration:
            "Section three. The sovereignty and PHI posture. Sovereign cloud for clinical documentation, patient journey, and most operations AI. On-premise inference scoped — designed and prepared — for genomic workloads, mental health records, and paediatric data. De-identification before AI inference for population analytics. Per-system. Documented. Reviewed annually by the clinical governance committee and the data protection officer. This section is the artefact regulators will most explicitly ask about. Make it visible.",
        },
        {
          html: stepCard('compass', 'amber', '4 · The governance overlay per play',
            "Chart integrity audit for clinical documentation. Red-flag threshold catalogue for patient journey. Radiologist-first workflow for imaging. Audit access logs across all systems. Per-play, not generic."),
          narration:
            "Section four. The governance overlay — per play. Chart integrity audit for clinical documentation, quarterly. Red-flag threshold catalogue for patient journey AI, reviewed annually. Radiologist-first workflow for imaging AI, with quarterly performance review. Audit access logs across all systems, reviewed by the data protection officer. Per play — not generic. Different plays have different governance needs. Make the per-play overlay visible on the roadmap.",
        },
        {
          html: stepCard('compass', 'green', '5 · The clinician engagement plan',
            "Named senior clinician sponsor per play. Quarterly clinical governance review. Annual clinician satisfaction survey on each AI system. The relationship treated as a deliverable, not a checkbox."),
          narration:
            "Section five. The clinician engagement plan. A named senior clinician sponsor for each AI play — not a generic engagement program. Quarterly clinical governance committee review. Annual clinician satisfaction survey on each AI system in production. The relationship with clinicians treated as a deliverable on the roadmap — not as a side effect of deployment. This section is what makes the deployments sustainable. Without it, even technically excellent deployments stall in adoption.",
        },
        {
          html: stepCard('compass', 'blue', '6 · The regulator engagement plan',
            "Pre-deployment briefings on major launches. Participation in regulator pilots. Annual written briefing to the regulator. Treated as a deliverable. Almost no hospital does this. The hospitals that do — examination conversations are dramatically calmer."),
          narration:
            "Section six. The regulator engagement plan. Pre-deployment briefings on major AI launches. Active participation in regulator-led pilots and sandboxes. Annual written briefing to the regulator. Treated as a deliverable on the roadmap. Almost no hospital does this proactively today. The hospitals that do — examination conversations on AI-related topics are dramatically calmer than for peers who didn't engage. The visibility of this section on the roadmap signals organisational maturity to anyone reading it.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Ratify formally through executive leadership',
        "The one-pager becomes the hospital's AI charter. Ratified at an executive committee meeting. Signed by the CEO. Reviewed annually. Amended only by formal vote. The gravity is what protects it from drift across the 24-month horizon."),
      calloutNarration:
        "Ratify the one-pager formally. The roadmap becomes the hospital's AI charter. Ratified at an executive committee meeting. Signed by the CEO or equivalent. Reviewed annually. Amended only by formal vote at a future executive meeting. The gravity is what protects the charter from drift across the twenty-four-month horizon. Without that gravity, the roadmap slowly turns into a deck. With it, the roadmap is an operating commitment that the whole hospital can plan against. Ratify it formally.",
    },
    // SLIDE 3
    {
      title: 'The three conversations to unlock in the first quarter',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Conversations',
      bodyHtml: `<p>The roadmap exists to unlock three conversations. Each one on the calendar in the first quarter. Each one moves a decision or a relationship.</p>`,
      narrationLead:
        "The roadmap exists to unlock three specific conversations. Each one should be on the calendar within the first quarter after the roadmap is ratified. Each one moves a decision or a relationship.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — With the medical staff committee',
            "60-minute briefing on the full roadmap. The plays. The line. The clinical-governance overlay. The clinician engagement plan. Senior clinicians become co-owners of the programme — not subjects of it. The single most important conversation."),
          narration:
            "Conversation one. With the medical staff committee — or the equivalent senior clinical body in your hospital. A sixty-minute briefing on the full roadmap. The plays in the sequence. The line you will not cross. The clinical-governance overlay per play. The clinician engagement plan. The goal is to make senior clinicians co-owners of the AI programme — not subjects of it. This is the single most important conversation of the entire programme. If senior clinicians are co-owners, the rest gets easier. If they're not, nothing else compensates.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 2 — With the regulator',
            "30-minute informal briefing where the jurisdiction allows. The roadmap. The sovereignty posture. The PHI handling discipline. Builds the relationship. The next examination on AI is meaningfully calmer."),
          narration:
            "Conversation two. With your healthcare regulator. A thirty-minute informal briefing where your jurisdiction allows informal engagement. Walk through the roadmap. The sovereignty posture. The PHI handling discipline. Almost no hospital does this in the first quarter of an AI programme. The hospitals that do — the next regulator examination on AI is meaningfully calmer because the regulator already knows the programme. Take the meeting. The marginal cost is small. The compounding benefit is significant.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 3 — With the board\'s clinical committee',
            "30-minute briefing. The roadmap. The line. The major risks and mitigations. The board sees the discipline. Subsequent AI questions land into an established relationship — not a cold conversation."),
          narration:
            "Conversation three. With the board's clinical or quality committee. A thirty-minute briefing. The roadmap. The line. The major risks and mitigations. The board sees the discipline being applied. Subsequent AI questions from the board — and there will be questions when the next high-profile healthcare AI incident hits the news — land into an established relationship rather than a cold conversation. Build the relationship before you need it. That is the pattern.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What comes next — beyond this course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the hospital-leadership view. Three suggestions for what to look at next — each one pairs with where you are in the roadmap.</p>`,
      narrationLead:
        "This course gave you the hospital-leadership view of AI. Three suggestions for what to look at next. Each one pairs with where you are in the roadmap.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI Governance & Risk for Boards',
            "If you present to a board — which most hospital executives do — the boards course extends the governance, sovereignty, and incident-response chapters here into the full board-level playbook."),
          narration:
            "One. If you present to a board — which most hospital executives do — the AI Governance and Risk for Boards course extends the governance, sovereignty, and incident response chapters here into the full board-level playbook. The board pack template. The audit committee question framework. Useful preparation for the third conversation in this chapter's quarterly set.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · AI Strategy for the C-Suite',
            "If you sit at the hospital executive table, the C-Suite strategy course extends the play sequence and capital allocation chapters here into the portfolio operating frame. Useful for the CFO conversation on funding."),
          narration:
            "Two. If you sit at the hospital executive table — CEO, COO, CFO, CMO, or equivalent — the AI Strategy for the C-Suite course extends the play sequence and capital allocation framing here into the portfolio operating frame. Where AI investment sits within the broader strategic plan. The CFO conversation on funding the AI portfolio over multiple years. Useful when the hospital AI roadmap needs to be defended at the executive committee level alongside other strategic investments.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · A 30-minute scoping call',
            "If you're ready to convert this roadmap into a real 24-month programme — the most efficient next step is a thirty-minute call. We listen, ask three honest questions about your hospital and your regulator landscape, and tell you whether we're the right partner."),
          narration:
            "Three. If you're ready to convert this roadmap into a real twenty-four-month programme — the most efficient next step is a thirty-minute call. We listen. We ask three honest questions about your hospital, your regulator landscape, and your starting operational priorities. And we tell you whether we are the right partner for your specific situation. Even when the answer is no — and sometimes it is — the candour saves you weeks of evaluating partners who aren't a fit. Take the call.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">Healthcare AI, done well, is invisible to patients most of the time. They get faster discharge. They get clearer answers from the patient app. Their physician spends more time looking at them than at the screen. The medication errors that don’t happen. The radiology turnaround that doesn’t slip. That is the product.</p>
      <p>The discipline is the work. The technology will keep moving. The disciplines stay.</p>
      <p>Thank you for spending the last hour with me.</p>`,
      narrationLead:
        "One final thought. Healthcare AI, done well, is invisible to patients most of the time. They get faster discharge. They get clearer answers from the patient app, with warmth. Their physician spends more time looking at them than at the screen. The medication errors that don't happen because the dispensing cabinet caught them. The radiology turnaround that doesn't slip because the AI flagged the urgent case first. That is the product of healthcare AI done well. The patients never need to know that AI was involved. They just experience the care getting better. The discipline is the work. The technology will keep moving — and faster, not slower, over the next three years. The disciplines stay. Thank you for spending the last hour with me. Now go put the roadmap on the next executive meeting agenda. And brief the medical staff committee in the first quarter.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three things to carry out of the whole course — into your next executive meeting.</p>`,
      narrationLead:
        "Three things to carry out of the whole course. Into your next executive meeting.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Sequence four plays over 24 months',
            "Clinical documentation + operations → patient journey → imaging category-1 → imaging category-2 + L&D. Earn the right to deploy clinical decision support after these mature."),
          narration:
            "One. Sequence four plays over twenty-four months. Clinical documentation plus one operations play first. Patient journey copilots second. Imaging AI category one third. Imaging category two plus L and D for clinicians fourth. Earn the right to deploy clinical decision support — the fifth pattern — only after the four above are mature.",
        },
        {
          html: stepCard('check', 'green', 'Two — The line, defended explicitly',
            "AI never makes the final clinical decision. Always the clinician. Stated on the roadmap. Documented in the policy. The line is the line."),
          narration:
            "Two. The line, defended explicitly. AI never makes the final clinical decision. Always the clinician. Stated on the roadmap document. Documented in the hospital's formal AI policy. Defended when vendors push and when internal enthusiasm mounts. The line is the line.",
        },
        {
          html: stepCard('check', 'green', 'Three — Engage clinicians, regulators, board — early',
            "Senior clinicians as co-owners. Regulator briefed before deployments. Board's clinical committee briefed quarterly. Early engagement is what makes the programme defensible — and sustainable across years."),
          narration:
            "Three. Engage clinicians, regulators, and the board's clinical committee early. Senior clinicians as co-owners of the AI programme. Regulator briefed informally before major deployments. Board's clinical committee briefed at least quarterly. Early engagement across these three audiences is what makes the programme defensible to external scrutiny — and sustainable across years and across leadership changes. Build the relationships before you need them.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Take the roadmap to executive leadership this quarter. We'll see you at the next decision point.",
    },
  ],
}
