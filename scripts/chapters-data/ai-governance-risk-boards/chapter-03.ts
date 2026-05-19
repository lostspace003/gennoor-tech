import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter03: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-risk-taxonomy',
  title: 'The AI risk taxonomy',
  subtitle: 'Six categories every board should be able to name — and the questions each one demands.',
  slides: [
    // SLIDE 1
    {
      title: 'The AI risk taxonomy',
      iconKey: 'target',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">“AI risk” is not one risk. It is six related but distinct categories. A board that can name all six — and ask the right question of each — is governing. A board that conflates them is not.</p>`,
      narrationLead:
        "Welcome to chapter three. AI risk is not one risk. It is six related but distinct categories — each of which sits with a different executive, each of which has a different control set, and each of which fails differently. A board that can name all six — and ask the right question of each — is governing. A board that conflates them into one big bucket called AI risk is not. Let's name them.",
    },
    // SLIDE 2
    {
      title: 'The six categories',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The taxonomy',
      bodyHtml: `<p>Six categories. Two on the model itself. Two on the data. Two on the operating environment. Each lives with a specific executive — and the board should know which.</p>`,
      narrationLead:
        "Six categories. Two on the model itself. Two on the data the model uses. And two on the operating environment around the model. Each one lives with a specific executive — and the board should know which executive owns which category.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', '1 · Model risk — accuracy, robustness, drift',
            "Will the model produce wrong outputs? Will those outputs degrade over time as the world changes? Owner: chief technology / chief data officer. Control: ongoing evaluation, drift monitoring."),
          narration:
            "One. Model risk. Will the model produce wrong outputs? And will those outputs degrade over time as the world changes? This is accuracy, robustness, and drift. The owner is the Chief Technology or Chief Data Officer. The expected control is ongoing evaluation against a held-out set, with drift monitoring thresholds. The question a board asks — how do we know our models are still accurate this quarter? Not how they were when we launched them.",
        },
        {
          html: stepCard('alertTriangle', 'red', '2 · Bias and fairness risk',
            "Does the model produce systematically different outcomes for different groups — by protected attribute or by proxy? Owner: GC + chief data officer jointly. Control: bias testing on outcomes, not on training data."),
          narration:
            "Two. Bias and fairness risk. Does the model produce systematically different outcomes for different groups — whether by protected attribute, or by a proxy of one. Owner — General Counsel and Chief Data Officer jointly. The expected control is bias testing on outcomes, not on training data. The board question — what would happen if a regulator audited our outcomes by group? Most management teams haven't asked themselves this. They should.",
        },
        {
          html: stepCard('alertTriangle', 'amber', '3 · Data risk — privacy, consent, leakage',
            "Is the data going in lawful? Is it leaking out? Are training and inference both compliant with consent? Owner: data protection officer. Control: data flow mapping, residency, encryption."),
          narration:
            "Three. Data risk. Is the data going into the model lawful? Is data leaking out — either through prompt injection, through training, or through output? Are both training and inference compliant with consent and data protection law? Owner — the Data Protection Officer or equivalent. The expected control is a data flow map for each AI system, residency constraints, and encryption. Board question — for system X, can we trace every data flow in and out, and certify it against our privacy posture?",
        },
        {
          html: stepCard('alertTriangle', 'amber', '4 · Vendor and third-party AI risk',
            "Most AI in your firm is built on someone else's model. If OpenAI changes its terms, what happens to your control? If a vendor closes, what's your continuity? Owner: procurement + GC. Control: contract terms, exit clauses."),
          narration:
            "Four. Vendor and third-party AI risk. Most AI in your firm is built on top of somebody else's model — OpenAI, Anthropic, Google, Microsoft, or open-source projects. If the vendor changes its terms of service, what happens to your control regime? If the vendor goes out of business, what is your continuity plan? Owner — procurement and General Counsel jointly. Control — contract terms with exit clauses, model versioning, and a secondary vendor for high-tier use cases. We'll spend more time on this in chapter five.",
        },
        {
          html: stepCard('shield', 'blue', '5 · Operational risk — human factors, change management',
            "Wrong-use, over-reliance, under-reliance. People trusting AI outputs they shouldn't, or refusing to use systems that work. Owner: COO + head of adoption. Control: training, prompts, oversight design."),
          narration:
            "Five. Operational risk. Human factors. Change management. This is wrong-use — people trusting AI outputs they shouldn't trust. Or over-reliance — automating decisions that should remain human. Or under-reliance — refusing to use systems that genuinely work. Owner — COO and the head of adoption together. The control set is training, prompt scaffolding, and the design of where humans appear in the workflow. Boards rarely engage on this — and probably should, because it's where most real-world AI incidents have their roots.",
        },
        {
          html: stepCard('shield', 'green', '6 · Reputational and societal risk',
            "What if this becomes a Wall Street Journal story? Will customers, employees, or the regulator see it as a breach of trust? Owner: CEO + comms. Control: disclosure, transparency, ethics review for high-risk launches."),
          narration:
            "Six. Reputational and societal risk. What if this becomes a Wall Street Journal story? Or a regulator letter that becomes public? Will customers, employees, or the regulator see it as a breach of trust — even if it isn't strictly illegal? Owner — the CEO together with the head of corporate communications. The expected control is disclosure planning, transparency communications, and an ethics review step for high-risk launches before they go live. The board's role — to surface the reputational question before launch, not after the article appears.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Map each AI system to all six',
        "Best practice — the inventory we discussed in chapter one carries a sixfold risk profile per row. Model risk score. Bias risk score. Data risk score. Vendor. Operational. Reputational. That's the row a regulator wants to see."),
      calloutNarration:
        "Best practice — the AI inventory we discussed in chapter one carries a sixfold risk profile per row. Model risk score. Bias risk score. Data risk score. Vendor risk score. Operational risk score. Reputational risk score. That's the row that an examiner or a regulator actually wants to see. And a row that shape forces management to think about each category, rather than letting one big AI risk label hide the specific weaknesses.",
    },
    // SLIDE 3
    {
      title: 'The questions a board asks of each category',
      iconKey: 'search',
      eyebrow: 'Lesson 2 · The questions',
      bodyHtml: `<p>One sharp question per category. Take these into your next audit committee meeting.</p>`,
      narrationLead:
        "One sharp question per category. Six questions total. Take these into your next audit committee meeting. They are designed to test whether the underlying control set actually exists — not to put management on trial.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Model — “Show me drift monitoring on system X”',
            "If management can't show a chart of model performance over the last six months, drift monitoring doesn't exist."),
          narration:
            "Model risk. Show me drift monitoring on system X. If management cannot show you a chart of model performance — the accuracy, the calibration, the relevant KPIs — over the last six months, drift monitoring does not exist in operational practice. Whatever the policy document says.",
        },
        {
          html: stepCard('search', 'blue', 'Bias — “What outcome did system X produce by group last quarter?”',
            "Not what input was used. What outcome was produced. If management cannot disaggregate by group, you don't yet have bias monitoring."),
          narration:
            "Bias risk. What outcome did system X produce, by group, last quarter? Not what training data was used. What outcome was produced. If management cannot disaggregate outcomes by group — by gender, by geography, by income tier, by whatever the relevant protected or proxy attribute is — you do not yet have bias monitoring in operational practice.",
        },
        {
          html: stepCard('search', 'amber', 'Data — “Trace the data path for system X end to end”',
            "Where does the data come from. Where does it go. What gets retained. Who has access. If this takes more than a meeting to answer, the data flow isn't mapped."),
          narration:
            "Data risk. Trace the data path for system X end to end. Where does the data come from. Where does it go. What gets retained. Who has access. How long is it kept. If this takes more than the current meeting to answer, the data flow is not mapped. That's a gap to close.",
        },
        {
          html: stepCard('search', 'amber', 'Vendor — “What happens if our primary AI vendor changes terms?”',
            "Specifically — pricing, data handling, model availability. The answer is a contract clause, not a sentiment."),
          narration:
            "Vendor risk. What happens if our primary AI vendor changes its terms? Specifically — pricing changes, data handling changes, model availability changes. The answer you want is a contract clause, not a sentiment. We have language in the master agreement at paragraph X that addresses exit, continuity, and price protection.",
        },
        {
          html: stepCard('search', 'green', 'Operational — “Where did human oversight actually intervene last quarter?”',
            "Counts of intervention. Patterns. Outcomes. If oversight is theoretical, the counts will be zero — and that's an alarm bell, not a sign of success."),
          narration:
            "Operational risk. Where did human oversight actually intervene last quarter? Counts of intervention. Patterns of intervention — which decisions, which scenarios, what the human did differently from what the AI proposed. If oversight is theoretical, the counts will be zero. And zero is an alarm bell — not a sign of success. Either the AI is genuinely flawless, which is unlikely. Or the humans are rubber-stamping, which is the actual operational failure.",
        },
        {
          html: stepCard('search', 'green', 'Reputational — “Walk me through the worst plausible story”',
            "Force the conversation. What's the headline. What's the disclosure path. What's the apology. Better to rehearse in the board room than in the press cycle."),
          narration:
            "Reputational risk. Walk me through the worst plausible story. Force the conversation. What's the headline. What's the disclosure path. What's the apology. Who fronts the press conference. Better to rehearse this in the boardroom than in the press cycle — when speed and clarity matter more than they ever will at any other moment.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Where these categories cross-cut',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The cross-cutting risks',
      bodyHtml: `<p>The most dangerous failures live where two or more categories overlap. Three crossings worth naming.</p>`,
      narrationLead:
        "The most dangerous failures live where two or more categories overlap. Three crossings worth naming explicitly — because they have a way of being everyone's problem and therefore nobody's.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Crossing 1 — Bias × reputational',
            "Bias is a quiet risk until a journalist documents it. Then it becomes the worst reputational moment of the year. Treat bias monitoring as reputational defence, not just legal defence."),
          narration:
            "Crossing one. Bias times reputational. Bias is a quiet risk until a journalist or a researcher documents it. Then it becomes the worst reputational moment of the year. So treat bias monitoring as reputational defence — not just as legal defence. The CEO and the comms head should have a view of the bias dashboard, not just the General Counsel.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Crossing 2 — Vendor × data',
            "Your data sits in the vendor's model context. If the vendor's data handling changes — quietly — your data risk changes with it. Re-read the vendor's data terms quarterly, not annually."),
          narration:
            "Crossing two. Vendor times data. Your data sits inside the vendor's model context. If the vendor's data handling changes — and large model vendors update their terms more often than most boards realise — your data risk changes with it. Re-read the vendor's data terms quarterly. Not annually. Procurement and the DPO should be jointly accountable for this re-read.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Crossing 3 — Operational × model',
            "When the model drifts and humans are tired of overriding it, they stop overriding. That's the moment a drifting model causes real harm — because the human safety net quietly failed. Watch for the drop in override rates."),
          narration:
            "Crossing three. Operational times model. When a model drifts, and humans are tired of overriding it, they quietly stop overriding it. That's the moment a drifting model causes real harm — because the human safety net failed silently. Watch for a drop in override rates. A drop is not necessarily good news. Sometimes it means the AI got better. Sometimes it means the humans stopped paying attention. Distinguish the two.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Two anchors before chapter 4 — reporting and metrics.</p>`,
      narrationLead:
        "Two anchors before we get to reporting and metrics in chapter four.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Six categories, named',
            "Model · bias · data · vendor · operational · reputational. Each with a different owner, a different control set, and a different failure mode."),
          narration:
            "One. Six categories — named. Model. Bias. Data. Vendor. Operational. Reputational. Each with a different owner. A different control set. A different failure mode. Don't conflate them.",
        },
        {
          html: stepCard('check', 'green', 'Two — One sharp question per category',
            "Drift chart · group outcomes · data path · vendor terms · oversight counts · worst-plausible story. Six questions. They reveal the controls — or the lack of them."),
          narration:
            "Two. One sharp question per category. Drift chart. Group outcomes. Data path. Vendor terms. Oversight intervention counts. Worst-plausible story. Six questions. They reveal the controls — or the absence of them — faster than any policy document review will.",
        },
      ],
      narrationTrail:
        "Chapter four — what good board reporting on AI actually looks like. With a template you can ask for verbatim. See you there.",
    },
  ],
}
