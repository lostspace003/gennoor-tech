import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter08: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your AI governance charter on one page',
  subtitle: 'Seven chapters down. Now land it as one charter your board can adopt at the next meeting.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your AI governance charter on one page',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built a complete board-level view of AI governance. Now — one charter. One page. Something the board can actually adopt at the next meeting.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built a complete board-level view of AI governance. Now we collapse it. One charter. One page. Something your board can actually adopt at the next meeting. Not a strategy. A charter — meaning a document the board formally approves, and which then governs how AI is managed. Here's what's on it.",
    },
    // SLIDE 2
    {
      title: 'The one-page AI governance charter',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Five sections. Each one a board-level commitment. Each one specific enough to govern by.</p>`,
      narrationLead:
        "Five sections. Each one a board-level commitment. Each one specific enough to actually govern by — meaning each one references a concrete artefact or process, not just a sentiment.",
      steps: [
        {
          html: stepCard('compass', 'blue', '1 · Risk appetite',
            "“The board has approved an AI risk appetite covering [model, bias, data, vendor, operational, reputational]. Tier rules and thresholds are documented in the AI Policy ratified [date]. Risk appetite is reviewed annually.”"),
          narration:
            "Section one. Risk appetite. The board has approved an AI risk appetite covering the six categories from chapter three. Tier rules and thresholds are documented in the AI policy, ratified on a specific date. Risk appetite is reviewed annually. This section signs the board onto the work — meaning the board is on the record as having set the appetite, not just received a brief.",
        },
        {
          html: stepCard('shield', 'blue', '2 · Oversight structure',
            "“AI governance reports to the audit committee. Independent reporting line through [head of risk / general counsel]. Standing agenda items at quarterly audit committee meetings.”"),
          narration:
            "Section two. Oversight structure. AI governance reports to the audit committee. The independent reporting line runs through the head of risk or the General Counsel — explicitly not through the team building AI. Standing agenda items at quarterly audit committee meetings — the five questions from chapter one, with rotating presenters. This section anchors who actually does the governing.",
        },
        {
          html: stepCard('target', 'amber', '3 · Reporting cadence',
            "“The audit committee receives the one-page quarterly governance report at every meeting. Eight numbers, trended over four quarters. Four narratives. Watchlist. Asks for the board. Submitted one week ahead.”"),
          narration:
            "Section three. Reporting cadence. The audit committee receives the one-page quarterly governance report at every meeting. Eight numbers — trended over four quarters. Four narratives. The watchlist. Asks for the board. Submitted one week ahead. This section is the dashboard discipline from chapter four — encoded as a board-approved commitment, so it doesn't drift over time as people change roles.",
        },
        {
          html: stepCard('alertTriangle', 'red', '4 · Incident protocol',
            "“The board mandates an annual tabletop exercise. The post-incident review is authored independently of the build team. Material incidents trigger formal audit committee review. Voluntary disclosure decisions remain board-level.”"),
          narration:
            "Section four. Incident protocol. The board mandates an annual tabletop exercise — meaning if a year passes without one, the chair raises it. The post-incident review is authored independently of the team that built the system. Material incidents trigger formal audit committee review. Voluntary disclosure decisions remain board-level — they cannot be delegated. This section formalises the work from chapter six.",
        },
        {
          html: stepCard('users', 'green', '5 · Board competence and review',
            "“The board commits to annual AI education (2 hours, independent expert). At least one director on the audit committee maintains AI fluency. The board commissions an external review of its AI governance posture annually.”"),
          narration:
            "Section five. Board competence and review. The board commits to annual AI education — two hours, with an independent expert. At least one director on the audit committee maintains AI fluency. The board commissions an external review of its own AI governance posture annually. This section is the self-improving loop. Without it, the rest of the charter is documentation. With it, the governance improves over time. Together — five sections, one page, one signed charter.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Ratify it formally',
        "The charter isn't a working document — it's a board-ratified document. Once approved, it sits in the board's permanent file. Amendments require a formal vote. That gravity is what protects it from drift."),
      calloutNarration:
        "Important. The charter isn't a working document, and shouldn't be treated like one. It is a board-ratified document. Once approved, it sits in the board's permanent file. Amendments to it require a formal vote at a board or audit committee meeting. That gravity — that formality — is what protects the charter from drifting over time. Without that gravity, the charter slowly turns back into a sentiment, and then into nothing. Ratify it formally.",
    },
    // SLIDE 3
    {
      title: 'The adoption sequence — three meetings',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · Adoption',
      bodyHtml: `<p>You don't adopt this in one meeting. You adopt it across three. Here's the sequence.</p>`,
      narrationLead:
        "You don't adopt this in one meeting. You adopt it across three. Here's the sequence — and the role of each meeting.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Meeting 1 — Audit committee: review draft',
            "The audit committee chair tables a draft charter, prepared with the head of risk or GC. Discussion. Amendments. Sent for full-board review."),
          narration:
            "Meeting one. The audit committee — at the next regular meeting. The chair tables a draft charter, prepared with the head of risk or General Counsel. Discussion. Amendments. The committee approves the draft for review by the full board. This meeting is where the substantive shaping happens. Use the time well — it's where the charter actually gets calibrated to your firm.",
        },
        {
          html: stepCard('calendar', 'amber', 'Meeting 2 — Full board: review and amend',
            "The full board reviews the audit-committee-approved draft. Strategic alignment check. Final amendments. Tabled for ratification at the next meeting."),
          narration:
            "Meeting two. The full board — typically the next quarterly meeting. The board reviews the audit-committee-approved draft. Strategic alignment check — does the charter match the broader risk appetite of the firm. Final amendments. Tabled for formal ratification at the next meeting. The deliberate two-step — review, then ratify — is itself a piece of the governance. It signals seriousness.",
        },
        {
          html: stepCard('calendar', 'green', 'Meeting 3 — Full board: ratify',
            "Formal vote. Charter signed into the permanent file. Communicated to management. The clock on annual review starts."),
          narration:
            "Meeting three. The full board ratifies. Formal vote, recorded in the minutes. Charter signed into the permanent file. Communicated to management — including specifically to the head of AI, the head of risk, internal audit, and the external auditor. The clock on annual review starts at this meeting. Twelve months later, the audit committee reviews the charter, recommends any changes, and the board re-ratifies.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What comes next — beyond this course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the board-level view. There's more in the library — and most of it pairs with a specific decision you'll have to make in the next 12 months.</p>`,
      narrationLead:
        "This course gave you the board-level view. There's more in the library — and most of it pairs with a specific decision you'll need to take in the next twelve months. Three suggestions.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI Strategy for the C-Suite',
            "If you sit at the intersection of the board and the executive — chair, lead independent director, or sponsor of the AI programme — the C-Suite course extends what we covered into the executive operating view."),
          narration:
            "One. If you sit at the intersection of the board and the executive — chair of the board, lead independent director, or the board sponsor of the AI programme — the AI Strategy for the C-Suite course extends what we covered into the executive operating view. The portfolio shape, the team design, the capital discipline. It pairs naturally with this course.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · AI ROI & Business Case Building',
            "The financial discipline behind the materiality discussion in chapter 7. How AI value is quantified, how business cases are written, where ROI math goes wrong in practice."),
          narration:
            "Two. AI ROI and Business Case Building. The financial discipline behind the materiality discussion we had in chapter seven. How AI value is actually quantified. How business cases for AI investments are written. Where ROI math goes wrong in practice. Useful for the audit committee, especially when the chief financial officer is presenting the AI portfolio's economics.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · Independent external review',
            "If you take only one action from this course — commission an external review of your board's AI governance posture in the next 90 days. The cost is modest. The defence value is significant. We do this work; so do others. Either way, pick somebody independent."),
          narration:
            "Three. Independent external review. If you take only one action from this course — commission an external review of your board's AI governance posture in the next ninety days. The cost is modest. The defence value is significant. We do this work. Others do too. The specific firm matters less than the fact that you commission it. Pick somebody independent. Read the findings carefully. Act on them.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">AI governance, done well, is invisible. The incidents that don't happen. The press cycles that never start. The regulator examinations that pass quietly. That is the product of good governance — and it is the product of boards that engaged before, not after.</p>
      <p>The discipline is the work. The technology will keep moving. The disciplines stay.</p>
      <p>Thank you for spending the last hour with me.</p>`,
      narrationLead:
        "One final thought. AI governance, done well, is invisible. The incidents that don't happen. The press cycles that never start. The regulator examinations that pass quietly. That is the product of good governance. And it is the product of boards that engaged before — not after. The discipline is the work. The technology will keep moving — and faster, not slower, over the next three years. The disciplines stay. Thank you for spending the last hour with me. Now go put the charter on the next board agenda.",
    },
    // SLIDE 6 — Takeaways
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three things to carry out of the whole course — into your next board meeting.</p>`,
      narrationLead:
        "Three things to carry out of the whole course — into your next board meeting.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Engagement is the bar, not expertise',
            "Directors don't need to be engineers. They need to be visibly engaged. The board minutes carry the evidence."),
          narration:
            "One. Engagement is the bar — not expertise. Directors don't need to be AI engineers. They need to be visibly engaged. The board minutes carry the evidence of that engagement. Make sure the minutes carry it.",
        },
        {
          html: stepCard('check', 'green', 'Two — One charter, formally ratified',
            "Five sections. One page. Ratified by formal vote. In the permanent file. Reviewed annually. Amended only by formal vote."),
          narration:
            "Two. One charter — formally ratified. Five sections. One page. Ratified by formal vote of the board. In the permanent file. Reviewed annually. Amended only by formal vote. The gravity protects the charter from drift.",
        },
        {
          html: stepCard('check', 'green', 'Three — Independence is the line that protects everything else',
            "Reporting line independent of the build team. Post-incident review independent of the build team. Annual external review of the board's posture. Independence is the load-bearing principle."),
          narration:
            "Three. Independence is the line that protects everything else. The governance reporting line independent of the build team. The post-incident review independent of the build team. An annual external review of the board's own posture. Independence is the single load-bearing principle. Defend it.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Take the charter to your next board. We'll see you at the next decision point.",
    },
  ],
}
