import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter06: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-performance-and-feedback',
  title: 'Performance, feedback, and the line we don\'t cross',
  subtitle: 'Where AI helps managers write better feedback — and where AI absolutely must not go.',
  slides: [
    // SLIDE 1
    {
      title: 'Performance, feedback, and the line we don\'t cross',
      iconKey: 'shield',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">AI in performance is the most contested HR AI conversation. The vendors push hard. The risks are real. The right answer is specific and defensible — AI helps managers write better feedback, and AI doesn’t rate the team. In the next few minutes, exactly where to draw the line.</p>`,
      narrationLead:
        "Welcome to chapter six. Performance, feedback, and the line we don't cross. This is the most contested HR AI conversation in 2026. The vendors push hard. The risks are real. The right answer is specific and defensible. AI helps managers write better feedback. AI doesn't rate the team. In the next few minutes, exactly where to draw the line — and how to defend it against vendor pressure and internal enthusiasm.",
    },
    // SLIDE 2
    {
      title: 'Where AI legitimately helps in performance',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · Legitimate help',
      bodyHtml: `<p>Three legitimate uses of AI in the performance process. Each one supports the manager — and explicitly does not replace the manager’s judgement.</p>`,
      narrationLead:
        "Three legitimate uses of AI in the performance process. Each one supports the manager. None of them replaces the manager's judgement. Recognise these three. Deploy them with discipline.",
      steps: [
        {
          html: stepCard('check', 'green', 'Help 1 — Manager-feedback drafting',
            "Manager provides bullet points. AI drafts the feedback in clear, specific language — with examples drawn from the bullet points, not invented. Manager reviews, edits, signs. The output is the manager's — the drafting was assisted."),
          narration:
            "Help one. Manager-feedback drafting. The manager provides bullet points — what went well, what to develop, specific examples. The AI drafts the feedback in clear, specific language. With examples drawn from the manager's bullet points — not invented or embellished. The manager reviews. Edits. Signs. The output is the manager's. The drafting was assisted. This help is legitimate because the judgement was the manager's. The AI accelerated the writing — it didn't make the assessment.",
        },
        {
          html: stepCard('check', 'blue', 'Help 2 — Bias-language detection in feedback',
            "After the manager has drafted feedback, an AI checks for language patterns that may reflect bias — for example, “aggressive” used more often for one group than another. The AI surfaces it; the manager decides. Quietly, this lifts the quality of feedback across the org."),
          narration:
            "Help two. Bias-language detection in feedback. After the manager has drafted the feedback — whether drafted with AI assistance or entirely by hand — an AI reviews it for language patterns that may reflect bias. The classical examples — aggressive used more often in feedback to one demographic group than another. Articulate used in feedback to specific groups in a way that subtly suggests it's unexpected. The AI surfaces these patterns. The manager decides whether to adjust. Quietly, over a year of this, the quality of feedback across the organisation lifts measurably. And the team-level bias signals reduce. Worth deploying broadly.",
        },
        {
          html: stepCard('check', 'amber', 'Help 3 — Peer feedback theme synthesis',
            "When a person has 12 peer feedback responses to read, an AI synthesises the themes — what's strong, what's developing, what's contested. Manager reads the synthesis and the originals; manager forms the view. The synthesis saves reading time without replacing the read."),
          narration:
            "Help three. Peer feedback theme synthesis. When a person has twelve peer feedback responses to read before writing the performance review, an AI synthesises the themes across the twelve. What's consistently strong. What's developing. What's contested across peers. The manager reads the synthesis — and the originals — and forms their view. The synthesis saves the manager reading time without replacing the read. The originals are still the source. The synthesis is the index. Honest framing matters.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A pattern, named',
        "What all three have in common — <strong>the manager's judgement is the output</strong>. AI helps the manager prepare, draft, or check. AI does not make the call. That pattern, applied consistently, is what makes performance AI defensible."),
      calloutNarration:
        "Name the pattern explicitly. What all three legitimate helps have in common — the manager's judgement is the output. The AI helps the manager prepare, draft, or check. The AI does not make the call. That pattern, applied consistently across every performance use case, is what makes performance AI defensible to employees, to legal, to regulators. And it's the pattern vendors will try to blur. They want their AI to do more — because that's what they sell. Defend the pattern. The line is the line.",
    },
    // SLIDE 3
    {
      title: 'Where AI must not go — and how to defend the line',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The lines',
      bodyHtml: `<p>Three uses of AI in performance that look attractive in demos and that you must refuse — politely, but firmly.</p>`,
      narrationLead:
        "Three uses of AI in performance that look attractive in vendor demos — and that you must refuse. Politely. Firmly. Repeatedly. Each one looks marginal in isolation. Cumulatively, they erode the line that protects everyone.",
      steps: [
        {
          html: stepCard('x', 'red', 'Don\'t — AI-generated performance ratings',
            "AI takes inputs — peer feedback, manager notes, productivity data — and produces a recommended rating. This is the line. Even framed as “just a recommendation”, ratings stick. The recommendation becomes the rating in 80% of cases. The judgement was the AI's. Refuse it."),
          narration:
            "Don't allow AI-generated performance ratings. Even when framed by the vendor as just a recommendation that the manager can override. The honest truth is that recommendations stick. The recommendation becomes the rating in eighty percent of cases — not because managers are lazy but because overriding is uncomfortable. So functionally, the judgement was the AI's, not the manager's. This is the line. Refuse it. The vendors who push this are the ones to most politely decline.",
        },
        {
          html: stepCard('x', 'red', 'Don\'t — AI-driven stack ranking',
            "AI ranks the team from highest performer to lowest based on a composite score. The bias risks are severe. The legal exposure is real. And ranking destroys teamwork — the data on this is overwhelming. Refuse it. Don't engage the pitch."),
          narration:
            "Don't allow AI-driven stack ranking. AI that takes a team and ranks them from highest performer to lowest based on a composite score. The bias risks are severe — every protected and proxy attribute leaks into the ranking through the inputs. The legal exposure is real in multiple jurisdictions. And separately from the AI question — ranking destroys teamwork. The data on this is overwhelming. Some firms still use ranking. The trend is away from it. Don't let AI revive the practice. Don't even engage the pitch.",
        },
        {
          html: stepCard('x', 'red', 'Don\'t — AI prediction of who will quit',
            "Vendors offer “flight risk” prediction. Sounds useful. Is corrosive. People treated as flight risks are then treated differently — fewer stretch assignments, less investment. The prediction becomes self-fulfilling. The data on real outcomes is poor anyway. Refuse it."),
          narration:
            "Don't deploy AI prediction of who will quit. Vendors offer this as flight-risk prediction. Sounds useful — proactive retention. In practice it is corrosive. The employees who get flagged as flight risks are subtly treated differently. Fewer stretch assignments. Less investment in their development. Less inclusion in long-term projects. The prediction becomes self-fulfilling. They quit because they were treated as if they would. And separately — the data on real outcomes is poor anyway. The predictions are rarely accurate enough to justify the cost of how the labelled employees are then treated. Refuse this. The whole category. Politely, but completely.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Defending the line against vendor and internal pressure',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · Defence',
      bodyHtml: `<p>The pressure to cross the line will come — from vendors selling, from a peer firm announcing a deployment, from a CFO chasing a productivity number. Three responses that hold.</p>`,
      narrationLead:
        "The pressure to cross the line will come. From vendors selling. From a peer firm announcing a deployment that sounds impressive. From a CFO chasing a productivity number and asking why HR isn't using AI more aggressively. Three responses that hold under pressure. Practise them — they need to come out naturally.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Response 1 — “Show me the bias audit, not the demo”',
            "When a vendor pitches AI ratings or stack ranking, ask for the independent bias audit. If they have one and it's clean, that's worth a follow-up. If they don't — or it's authored by them — that tells you everything. Most won't have one."),
          narration:
            "Response one. Show me the independent bias audit — not the demo. When a vendor pitches AI ratings, AI rankings, or flight-risk prediction, ask for the independent bias audit. Authored by a credible external party. Findings public or at minimum shareable. If they have one and it's clean, that's worth a follow-up conversation. If they don't have one, or the audit is authored by their own team, that tells you everything. Most will not have one. The conversation ends there, politely.",
        },
        {
          html: stepCard('shield', 'amber', 'Response 2 — “We need legal\'s sign-off on the discrimination exposure”',
            "When internal pressure mounts to cross the line, route it through legal explicitly. Most legal teams, when asked specifically, will not sign off. The legal sign-off requirement is a feature — it slows the pressure to a defensible pace."),
          narration:
            "Response two. We need legal sign-off on the discrimination exposure before we deploy. When internal pressure mounts to cross the line — a CFO wanting AI ratings, a CHRO from another firm boasting about a deployment — route the request through legal explicitly. Don't shortcut. Most legal teams, when asked specifically about AI-generated ratings or rankings under current discrimination law, will not sign off. The legal sign-off requirement is a feature, not a bureaucratic obstacle. It slows the pressure to a defensible pace. And it produces the documented advice that protects the HR team if the question ever comes back later.",
        },
        {
          html: stepCard('shield', 'green', 'Response 3 — “Here\'s where we are using AI — successfully, defensibly”',
            "The strongest defence isn't refusal in isolation. It's pointing to where you are using AI well — policy Q&A, onboarding, L&D personalisation, manager-feedback drafting. The contrast makes the refusal credible. You aren't anti-AI. You're disciplined about it."),
          narration:
            "Response three. Here's where we are using AI — successfully and defensibly. The strongest defence of the line isn't refusal in isolation. It is pointing to where you are using AI well. Policy Q and A. Onboarding copilots. L and D personalisation. Manager-feedback drafting. Bias-language detection in feedback. The contrast makes the refusal of the high-risk uses credible. You aren't anti-AI. You're disciplined about which AI deployments make sense in HR — and which don't. Disciplined refusal is fundamentally different from blanket refusal. Make the discipline visible.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 7 — compliance and data handling.</p>`,
      narrationLead:
        "Three anchors before chapter seven — compliance and data handling.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three legitimate helps — manager\'s judgement is the output',
            "Drafting · bias-language detection · peer feedback synthesis. AI helps; manager decides. The pattern is the discipline."),
          narration:
            "One. Three legitimate helps. Manager-feedback drafting. Bias-language detection. Peer feedback theme synthesis. What they share — the manager's judgement is the output. AI helps the manager prepare, draft, or check. AI doesn't make the call. The pattern is the discipline.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three lines, refused every time',
            "No AI ratings. No AI stack ranking. No flight-risk prediction. The lines are the lines. Polite, firm, repeated."),
          narration:
            "Two. Three lines, refused every time. No AI-generated performance ratings — even framed as recommendations. No AI-driven stack ranking. No flight-risk prediction of who will quit. The lines are the lines. Polite, firm, and repeated as needed. Don't relax any of the three under pressure.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three responses that hold',
            "Demand the independent bias audit. Require legal sign-off on discrimination exposure. Point to where you are using AI well. The discipline is what makes the refusal credible."),
          narration:
            "Three. Three responses that hold under pressure. Show me the independent bias audit, not the demo. We need legal sign-off on the discrimination exposure. And here's where we are using AI well — defensibly, successfully. The discipline of pointing to your legitimate AI uses is what makes your refusal of the high-risk uses credible. Use all three responses depending on the situation. Practise them.",
        },
      ],
      narrationTrail:
        "Chapter seven — compliance, data handling, and the works council conversation in detail. See you there.",
    },
  ],
}
