import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiHealthcareChapter01: Chapter = {
  courseId: 'ai-in-healthcare',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-where-ai-fits-in-healthcare',
  title: 'Where AI fits in healthcare',
  subtitle: 'Four plays that respect patients. One line that protects them. The discipline that separates the two.',
  slides: [
    // SLIDE 1
    {
      title: 'Where AI fits in healthcare',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">This course is for hospital admins, chief medical informatics officers, and healthcare IT leaders. AI in healthcare is uniquely high-stakes — every system touches patient safety, clinician trust, and regulator scrutiny. In the next few minutes, four plays that work, the line that protects everyone, and the discipline that holds.</p>`,
      narrationLead:
        "Welcome to the course. This is for hospital administrators, chief medical informatics officers, and healthcare IT leaders. AI in healthcare is uniquely high-stakes — because every system you deploy touches patient safety, clinician trust, and regulator scrutiny simultaneously. In the next few minutes, the four AI plays that work in healthcare. The line that protects patients and clinicians. And the discipline that holds when the next vendor pitch promises more than it should. Let's begin.",
    },
    // SLIDE 2
    {
      title: 'The four healthcare AI plays',
      iconKey: 'users',
      eyebrow: 'Lesson 1 · The plays',
      bodyHtml: `<p>Four plays. Each one anchors a specific operational pain point. Each one has its own regulator conversation. Confusing them is the most common cause of healthcare AI programmes that stall after the first deployment.</p>`,
      narrationLead:
        "Four plays. Each one anchors a specific operational pain point. Each one has its own regulator conversation. And confusing them — treating clinical documentation and clinical decision support as if they're the same regulator question — is the most common cause of healthcare AI programmes that stall after the first deployment. So let me be specific about each.",
      steps: [
        {
          html: stepCard('bookOpen', 'green', 'Play 1 — Clinical documentation AI (ambient)',
            "Ambient voice capture during patient encounters. Structured note generation. EHR write-back. The play that gives physicians their evenings back — and one of the most mature in healthcare AI. Highest-immediate-ROI play."),
          narration:
            "Play one. Clinical documentation AI. Specifically, ambient voice capture during patient encounters, followed by structured note generation and EHR write-back. The play that gives physicians their evenings back — and reduces the documentation burden that drives a meaningful share of physician burnout. This is one of the most mature plays in healthcare AI today. And the highest immediate ROI. Most hospital AI programmes should start here. We dedicate the next chapter to it specifically.",
        },
        {
          html: stepCard('users', 'blue', 'Play 2 — Patient journey copilots',
            "Triage, appointment scheduling, post-discharge navigation, medication reminders. Non-clinical decisions, patient-facing. Frees clinical staff for the conversations that need them. Medium regulator weight."),
          narration:
            "Play two. Patient journey copilots. Triage at the front door. Appointment scheduling. Post-discharge navigation. Medication adherence reminders. These are non-clinical decisions — the agent isn't diagnosing or prescribing. But it is patient-facing. And it frees clinical staff for the conversations that genuinely need them. Medium regulator weight — the agent must escalate cleanly to a clinician when symptoms cross any safety threshold. Build that escalation as a non-negotiable design feature, not an afterthought.",
        },
        {
          html: stepCard('search', 'amber', 'Play 3 — Imaging AI (with the radiologist in the loop)',
            "Radiology AI that flags potential findings for the radiologist to confirm. Mature technology in specific modalities. The radiologist still reads. The radiologist still decides. The AI accelerates — it doesn't replace."),
          narration:
            "Play three. Imaging AI — with the radiologist in the loop. Radiology AI flags potential findings for the radiologist to confirm. Mature technology in specific modalities — chest x-ray, mammography, ophthalmology. Less mature in others. The crucial discipline — the radiologist still reads the image. The radiologist still makes the decision. The AI accelerates the workflow; it doesn't replace the clinical judgement. Get this discipline wrong and the deployment fails the regulator conversation immediately.",
        },
        {
          html: stepCard('cog', 'green', 'Play 4 — Operations and back-office AI',
            "Bed management. Pharmacy inventory. Coding assistance for billing. Roster optimisation. The boring plays that quietly compound — and don't require regulator approval as medical devices. Underrated."),
          narration:
            "Play four. Operations and back-office AI. Bed management forecasting. Pharmacy inventory and dispensing automation. Coding assistance for billing. Staff roster optimisation. These are the boring plays that quietly compound across years. And critically — they don't require regulator approval as medical devices, because they don't touch clinical decisions. Underrated by most hospital AI programmes. Start one of these in parallel with clinical documentation; the operational savings often fund the clinical investment.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The fifth pattern hospitals should approach carefully',
        "Clinical decision support — AI suggesting diagnoses or treatments — is a fifth pattern. It's exciting, the regulatory pathway is longer, and the clinical-governance bar is higher. Don't lead with it. Earn the right by mastering the four above first."),
      calloutNarration:
        "The fifth pattern to approach carefully. Clinical decision support — AI that suggests diagnoses or treatments to clinicians. It is genuinely exciting. The technology is improving. The regulatory pathway, however, is longer. The clinical governance bar is higher. The litigation exposure if it goes wrong is significant. Don't lead with this pattern. Earn the right to deploy it by mastering the four plays above first — over typically two to three years. Hospitals that try to start with clinical decision support usually find themselves spending eighteen months in regulator submissions before the first patient is seen. Patience is the discipline.",
    },
    // SLIDE 3
    {
      title: 'The one line we don\'t cross — and why',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The line',
      bodyHtml: `<p>One line. Drawn for the safety of patients and the protection of clinicians. The line is the line — and the entire AI portfolio depends on holding it.</p>`,
      narrationLead:
        "One line. Drawn explicitly. For the safety of patients and the protection of clinicians. The line is the line. And the entire healthcare AI portfolio depends on holding it. Here it is — clearly.",
      steps: [
        {
          html: stepCard('x', 'red', 'The line — AI never makes the final clinical decision',
            "Diagnosis. Treatment selection. Medication dosing. Discharge readiness. These remain clinician decisions — always. AI can prepare evidence, surface options, flag risks. AI cannot decide. The clinician owns the decision and the accountability."),
          narration:
            "The line. AI never makes the final clinical decision. Diagnosis. Treatment selection. Medication dosing. Discharge readiness. The decision to admit or discharge. These remain clinician decisions — always. The clinician can use AI to prepare evidence, to surface treatment options, to flag risks they might have missed in a long shift. But the clinician owns the decision and the accountability. The AI doesn't sign the chart. The clinician does. This isn't a temporary state until the AI gets better. This is the line — for the foreseeable future, across every responsible healthcare AI programme.",
        },
        {
          html: stepCard('check', 'green', 'Why the line holds',
            "Patients deserve a human accountable for their care. Clinicians deserve protection from being told AI says X when their judgement says Y. Regulators require a named accountable clinician. The line isn't arbitrary — it serves three purposes at once."),
          narration:
            "Why the line holds — and why it isn't arbitrary. Three reasons stacked. Patients deserve a human being who is accountable for their care, not a system. Clinicians deserve protection from being told that AI says X when their clinical judgement says Y — the cultural pressure to defer to the AI must not exist. And regulators in every major jurisdiction require a named accountable clinician for any care decision. The line serves all three purposes at once. Don't let any vendor tell you the line should move. The line is the line. Defending it is the entire discipline of healthcare AI leadership.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three traps healthcare AI programmes walk into',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Traps',
      bodyHtml: `<p>Three patterns I see repeatedly when healthcare AI programmes stall or fail. Each one preventable — if recognised in advance.</p>`,
      narrationLead:
        "Three traps. Recurring patterns when healthcare AI programmes stall or fail. Each one preventable at design time — if recognised in advance.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap 1 — Skipping the clinician engagement',
            "Healthcare AI ships only when clinicians believe in it. Programmes that bypass clinician input — “we'll just deploy it and show them the value” — almost always stall in adoption. Bring senior clinicians into the design conversation from week one."),
          narration:
            "Trap one. Skipping the clinician engagement. Healthcare AI ships only when the clinicians who will use it believe in it. Programmes that bypass clinician input — we'll just deploy it and show them the value once it's live — almost always stall in adoption. Sometimes the technology works perfectly and nobody uses it. Bring senior clinicians into the design conversation from week one. Make them co-owners of the deployment, not customers of it. The adoption curve is dramatically different.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 2 — Treating PHI like any other data',
            "Protected health information has its own legal regime — HIPAA in the US, equivalents elsewhere. Generic AI data discipline isn't enough. Build the PHI-specific patterns from day one — sovereign cloud, encryption, audit trail, minimum-necessary access."),
          narration:
            "Trap two. Treating PHI — protected health information — like any other data. PHI has its own legal regime in every major jurisdiction. HIPAA in the US. The EU's medical data provisions on top of GDPR. Equivalent regimes in the GCC and India. Generic AI data discipline that's adequate for HR data or financial data isn't adequate for PHI. Build the PHI-specific patterns from day one — sovereign cloud or on-premise inference, encryption at rest and in transit, full audit trail, minimum-necessary access. We dedicate chapter six to this. For now, recognise it as a distinct discipline.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 3 — Pretending the regulator conversation is optional',
            "In healthcare it isn't. Even non-medical-device AI eventually attracts regulator interest in this sector. Brief the regulator early — informally if your jurisdiction allows. Surprised regulators in healthcare are an order of magnitude more costly than surprised regulators in other sectors."),
          narration:
            "Trap three. Pretending the regulator conversation is optional. In healthcare, it isn't. Even AI that doesn't classify as a medical device today will eventually attract regulator interest in this sector. Particularly as the EU MDR, FDA SaMD framework, and equivalent GCC frameworks mature through 2026 and 2027. Brief the regulator early — informally if your jurisdiction allows informal engagement. Surprised regulators in healthcare are an order of magnitude more costly than surprised regulators in other sectors. The cost shows up in delayed deployments, public disclosures, and sometimes patient-safety reviews. Build the relationship before you need it.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 2 — clinical documentation AI in detail.</p>`,
      narrationLead:
        "Three anchors before we move into clinical documentation AI in detail in chapter two.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four plays + one careful fifth',
            "Documentation · patient journey · imaging · operations. Approach clinical decision support carefully and only after the four are mature. Don't lead with the riskiest play."),
          narration:
            "One. Four plays plus one careful fifth. Clinical documentation. Patient journey copilots. Imaging AI with the radiologist in the loop. Operations and back-office AI. And clinical decision support — approached carefully, only after the four are mature. Don't lead with the riskiest play. Earn the right.",
        },
        {
          html: stepCard('check', 'green', 'Two — The line — AI never makes the final clinical decision',
            "Always the clinician. The line serves three purposes — patient accountability, clinician protection, regulator requirement. Defend it without negotiation."),
          narration:
            "Two. The line. AI never makes the final clinical decision. Always the clinician. The line serves three purposes simultaneously — patient accountability, clinician protection, regulator requirement. Defend it without negotiation. No vendor pitch is worth moving it.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three traps to avoid',
            "Skipping clinician engagement · treating PHI like ordinary data · treating the regulator as optional. Each one preventable at design time. Plan for all three."),
          narration:
            "Three. Three traps to avoid. Skipping the clinician engagement. Treating PHI like ordinary data. Treating the regulator conversation as optional. Each one is preventable at design time. Plan for all three in week one of the programme — not in response to incidents months later.",
        },
      ],
      narrationTrail:
        "Chapter two — clinical documentation AI. The play that gives clinicians their evenings back. See you there.",
    },
  ],
}
