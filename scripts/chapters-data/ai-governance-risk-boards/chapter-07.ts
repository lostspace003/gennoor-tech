import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter07: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-board-competence',
  title: 'The board\'s own AI competence',
  subtitle: 'A topic most boards avoid. Director duty quietly already requires it.',
  slides: [
    // SLIDE 1
    {
      title: 'The board\'s own AI competence',
      iconKey: 'users',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Boards govern what they understand. AI is the topic most directors have least training on — and where director duty is quietly already starting to require competence. In the next few minutes, the four moves that build board competence without turning directors into engineers.</p>`,
      narrationLead:
        "Welcome to chapter seven. The board's own AI competence. This is the topic most boards quietly avoid. Boards govern what they understand. And AI is the topic where many directors have the least formal training. At the same time, director duty — fiduciary duty and the duty of care — is quietly already starting to require competence on AI. In the next few minutes, the four moves that build board competence without turning directors into engineers.",
    },
    // SLIDE 2
    {
      title: 'Why this matters now — and didn\'t five years ago',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The shift',
      bodyHtml: `<p>Three things have changed for directors in the last 24 months. None is hypothetical.</p>`,
      narrationLead:
        "Three things have changed for directors in the last twenty-four months. None of them is hypothetical. They are happening — slowly enough to miss if you're not watching, but consistently enough that directors who don't adapt will face questions in the next director duty conversation.",
      steps: [
        {
          html: stepCard('alertTriangle', 'amber', '1 · Materiality of AI to enterprise value',
            "AI has moved from a line item to a material driver of enterprise value in many sectors. Materiality triggers director duty obligations — including the obligation to understand."),
          narration:
            "One. AI has moved from a line item to a material driver of enterprise value in many sectors. Financial services. Healthcare. Manufacturing. Government services. Materiality triggers director duty obligations — including the obligation to understand. The Caremark doctrine in Delaware, similar doctrines elsewhere — directors are obliged to maintain a working knowledge of the material risks the company faces. AI now qualifies as a material risk in most sectors.",
        },
        {
          html: stepCard('alertTriangle', 'amber', '2 · Regulator expectations of board oversight',
            "Regulators — SEC, OCC, FCA, MAS, SAMA, CMA — increasingly expect boards to demonstrate active oversight of AI. Not just policy approval. Active oversight."),
          narration:
            "Two. Regulator expectations of board oversight. Regulators across multiple jurisdictions — the SEC, OCC, the FCA in the UK, MAS in Singapore, SAMA and the CMA in Saudi Arabia — increasingly expect boards to demonstrate active oversight of AI. Not just signing off on a policy that someone else wrote. Active oversight. Asking real questions. Reviewing actual reports. Insisting on independent verification. This expectation is now in regulator handbooks. Directors should read those handbooks.",
        },
        {
          html: stepCard('alertTriangle', 'red', '3 · Personal director duty exposure',
            "In some jurisdictions, individual directors can be held personally accountable for governance failures on material risks. The bar isn't expert-level technical knowledge — it's evidence of active engagement."),
          narration:
            "Three. Personal director duty exposure. In some jurisdictions, individual directors can be held personally accountable for governance failures on material risks. Not for getting the technology wrong. For failing to engage with it. The bar isn't expert-level technical knowledge — no court expects directors to be engineers. The bar is evidence of active engagement. Asking questions. Reviewing reports. Insisting on independent verification. Documenting the engagement in the board minutes. That's what protects directors personally — and that's what good governance looks like anyway.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A director-duty-friendly board minute',
        "“The audit committee reviewed the AI quarterly governance report. Directors challenged management on [specific item], received [specific evidence], and approved [specific action].” That minute documents engagement. It also is engagement."),
      calloutNarration:
        "Here's what a director-duty-friendly board minute looks like. The audit committee reviewed the AI quarterly governance report. Directors challenged management on a specific item. Received specific evidence in response. And approved a specific action. That minute documents engagement. It also is engagement. The texture of the minute matters for legal protection — and for the quality of the governance itself. Don't accept minutes that say management presented the AI update.",
    },
    // SLIDE 3
    {
      title: 'Four moves that build competence',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 2 · The moves',
      bodyHtml: `<p>None of these turn directors into engineers. All of them turn directors into useful governors of AI.</p>`,
      narrationLead:
        "Four moves that build competence. None of them turn directors into engineers. All of them turn directors into useful governors of AI.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'Move 1 — Annual education for the full board',
            "Two hours, once a year, with an independent expert. Not a vendor. Not the head of AI. Independent. Covering: where AI value lives, the risk taxonomy, the regulator landscape, and the question set."),
          narration:
            "Move one. Annual education for the full board. Two hours. Once a year. With an independent expert. Not a vendor — they have something to sell. Not the head of AI — they're being governed. Independent. Covering where AI value lives. The risk taxonomy. The regulator landscape. And the question set we covered in chapter one. Two hours a year. Recorded. Documented in the board pack. This single move alone significantly elevates board competence and demonstrates engagement.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Move 2 — One AI-fluent director',
            "Within 12 months, ensure at least one director on the board (or audit committee) has genuine working knowledge of AI. Could be a refreshed existing director, could be a new appointment, could be a co-opted advisor."),
          narration:
            "Move two. One AI-fluent director. Within twelve months, ensure at least one director on the board — or specifically on the audit committee — has genuine working knowledge of AI. Could be a refreshed existing director who studies the topic seriously. Could be a new appointment whose expertise covers it. Could be a co-opted advisor or non-voting expert. The structure varies. The principle is the same. Somebody in the room can call out when an executive answer is technically wrong.",
        },
        {
          html: stepCard('bookOpen', 'amber', 'Move 3 — Direct access to the AI team',
            "The board chair, audit committee chair, and ideally the AI-fluent director get standing direct access to the head of AI and the governance lead. Conversations happen between board meetings, not only at them."),
          narration:
            "Move three. Direct access to the AI team. The board chair, the audit committee chair, and ideally the AI-fluent director get standing direct access to the head of AI and the governance lead. Conversations happen between formal board meetings — not only at them. This isn't second-guessing the executive. It's the same access that the audit committee chair already has to the head of internal audit. AI deserves the same standing access. Some boards have already moved to this model. Others haven't. The ones who have report it makes a real difference.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Move 4 — External calibration once a year',
            "Once a year, the board commissions an independent review of its AI governance posture. Not internal audit — external. A specialist firm or independent expert. Three pages of findings. Sometimes uncomfortable. Always useful."),
          narration:
            "Move four. External calibration once a year. Once a year, the board commissions an independent review of its AI governance posture. Not internal audit — external. A specialist firm or independent expert. Two-to-three days of work. Three pages of findings. Sometimes uncomfortable. Always useful. The cost is modest. The defence value if a regulator examination happens is real. And it tells the executive team the board is serious — which itself shifts behaviour in subtle but important ways.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'A specific question for the chair',
      iconKey: 'search',
      eyebrow: 'Lesson 3 · The chair conversation',
      bodyHtml: `<p>This is a conversation for the board chair specifically. If you are not the chair, take it to your chair. If you are the chair, take it to your governance committee.</p>`,
      narrationLead:
        "This is a conversation for the board chair specifically. If you are not the chair, take it to your chair. If you are the chair, take it to your governance committee. One question. With a follow-up.",
      steps: [
        {
          html: stepCard('search', 'blue', 'The question',
            "“If a regulator examined our board's governance of AI today, what would they find — and what is missing?”"),
          narration:
            "The question. If a regulator examined our board's governance of AI today, what would they find — and what is missing? Ask it of the General Counsel. Ask it of the head of internal audit. Ask it of the external auditor. You get three perspectives, three lenses, and three sets of gaps. The intersection of those three lists is your real governance gap.",
        },
        {
          html: stepCard('search', 'amber', 'The follow-up — to yourself',
            "“And if any of these gaps surfaced in a regulator examination next quarter — what would be my personal exposure as a director, and would the board minutes protect me?”"),
          narration:
            "The follow-up — to yourself, quietly. And if any of these gaps surfaced in a regulator examination next quarter — what would be my personal exposure as a director? And would the board minutes show enough engagement to protect me, and the other directors, individually? The answers are not always comfortable. Asking the question now — before any examination — is the entire point of director duty. It's why you're there.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before the capstone.</p>`,
      narrationLead:
        "Three anchors before we land it in the capstone chapter.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — AI is now a material risk for most boards',
            "Materiality triggers director duty obligations. The bar is engagement — evidence in the board minutes, not technical expertise."),
          narration:
            "One. AI is now a material risk for most boards. Materiality triggers director duty obligations. The bar is engagement — evidence of active engagement in the board minutes — not technical expertise. Directors don't need to be engineers. They need to be engaged.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four moves to build competence',
            "Annual education · one AI-fluent director · direct access · external calibration once a year. Each one cheap. Each one signals seriousness."),
          narration:
            "Two. Four moves to build competence. Annual education for the full board. One AI-fluent director on the audit committee. Direct access to the AI team for the chairs. And external calibration of your governance posture once a year. Each one is cheap. Each one signals seriousness — to management, to regulators, to yourselves.",
        },
        {
          html: stepCard('check', 'green', 'Three — The regulator examination question',
            "Ask it today. Get three answers — GC, internal audit, external auditor. The intersection is your real gap. Close it before the examination happens."),
          narration:
            "Three. The regulator examination question. Ask it today. Get three independent answers — General Counsel, internal audit, external auditor. The intersection of the three is your real governance gap. Close it before any examination actually happens.",
        },
      ],
      narrationTrail:
        "Final chapter — your AI governance charter on one page. Where everything we've covered lands as something the board can actually adopt. See you there.",
    },
  ],
}
