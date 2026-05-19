import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiHealthcareChapter03: Chapter = {
  courseId: 'ai-in-healthcare',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-patient-journey-copilots',
  title: 'Patient journey copilots',
  subtitle: 'Where AI helps without touching the clinical decision — and how to make the help feel like care, not call-centre.',
  slides: [
    // SLIDE 1
    {
      title: 'Patient journey copilots',
      iconKey: 'users',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Patient-facing AI is the most visible AI in a hospital. Done well, it relieves clinical staff and patients feel cared for. Done badly, it’s the post that ends up on social media. In the next few minutes, four touchpoints that work — and the safety thresholds that protect everyone.</p>`,
      narrationLead:
        "Welcome to chapter three. Patient journey copilots. Patient-facing AI is the most visible AI in any hospital. Done well, it relieves clinical staff and patients feel genuinely cared for. Done badly, it's the social media post that ends up on the local news. The difference is the design discipline. In the next few minutes, four touchpoints where AI helps the patient journey, the safety thresholds that protect everyone, and the warmth that turns a copilot into a piece of care rather than a piece of call-centre.",
    },
    // SLIDE 2
    {
      title: 'Four patient-journey touchpoints that work',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The touchpoints',
      bodyHtml: `<p>Four touchpoints where AI consistently helps the patient experience without touching the clinical decision. Each one is mature in 2026.</p>`,
      narrationLead:
        "Four touchpoints in the patient journey where AI consistently helps — without touching any clinical decision. Each one is mature in 2026. Each one has clear evidence of patient benefit. Build them in this order.",
      steps: [
        {
          html: stepCard('compass', 'green', 'Touchpoint 1 — Pre-visit information and preparation',
            "What to bring. Where to go. What to expect. Fasting requirements. Medication adjustments. Multilingual. Available 24/7. Reduces no-shows and reduces anxiety. Lowest-risk patient-facing AI."),
          narration:
            "Touchpoint one. Pre-visit information and preparation. What to bring to the appointment. Where to go in the hospital. What to expect. Fasting requirements if any. Medication adjustments before the visit. Multilingual support. Available twenty-four seven through your hospital's app or website. This is the lowest-risk patient-facing AI play. It reduces no-shows. It reduces patient anxiety. It frees front-desk staff from answering the same questions repeatedly. Start here.",
        },
        {
          html: stepCard('compass', 'blue', 'Touchpoint 2 — Symptom-based triage and routing',
            "Patient describes symptoms; AI routes — urgent care, GP appointment, telehealth, self-care advice. Clear safety thresholds — any red-flag symptom skips the AI entirely and routes to a clinician. The threshold is the safeguard."),
          narration:
            "Touchpoint two. Symptom-based triage and routing. The patient describes their symptoms through the app or via voice. The AI routes them — urgent care, GP appointment, telehealth, self-care advice. With clear safety thresholds. Any red-flag symptom — chest pain, severe shortness of breath, signs of stroke, severe abdominal pain, suicidal ideation — skips the AI entirely and routes immediately to a clinician with the urgency level flagged. The threshold is the safeguard. Configure it conservatively. The cost of a false positive — an unnecessary clinician escalation — is a small fraction of the cost of a missed red flag.",
        },
        {
          html: stepCard('compass', 'amber', 'Touchpoint 3 — Appointment scheduling and rescheduling',
            "Available 24/7. Handles preferred clinician, preferred time, language. Cancellations rebook automatically. Frees scheduling staff for the complex bookings. Adoption in patient apps is high — when the experience is warm."),
          narration:
            "Touchpoint three. Appointment scheduling and rescheduling. Available twenty-four seven. The agent handles preferred clinician, preferred time, preferred language, location preferences. Cancellations get automatically rebooked into the next available slot. Frees scheduling staff for the complex bookings that need human judgement — referrals, multi-specialty coordination, palliative-care arrangements. Adoption in patient-facing apps is high when the experience is warm. We'll come back to what warmth means in design in the next lesson.",
        },
        {
          html: stepCard('compass', 'green', 'Touchpoint 4 — Post-discharge navigation and medication reminders',
            "The first 30 days after discharge are when patients deteriorate. AI follows up — “did you collect your prescription”, “have you done your follow-up appointment”, “any concerns?” Anything concerning routes to a clinician. Reduces readmissions when done well."),
          narration:
            "Touchpoint four. Post-discharge navigation and medication reminders. The first thirty days after discharge are when patients are most likely to deteriorate or be readmitted. The AI follows up. Did you collect your prescription. Have you scheduled your follow-up appointment. Any concerns. Any new symptoms. Anything genuinely concerning — symptoms suggesting deterioration, medication compliance issues, social factors affecting recovery — routes to a clinician or nurse case manager for a phone call. When this is done well, readmission rates drop meaningfully. The economic impact alone often funds the patient-journey AI programme.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The red-flag threshold catalogue',
        "Before deployment, the hospital's clinical leadership formally approves the red-flag threshold catalogue. Every symptom that bypasses AI entirely is on the list. The list is reviewed annually with clinicians and updated. The threshold catalogue is the safety governance document."),
      calloutNarration:
        "Underline this. Before deployment of any symptom-triage AI, the hospital's clinical leadership formally approves the red-flag threshold catalogue. Every symptom that bypasses the AI entirely and goes straight to a clinician is on that list. The list is reviewed annually with clinical leads. It is updated as clinical knowledge evolves. The threshold catalogue is the safety governance document for the patient-journey AI programme. Without it, you have an AI making routing judgements you can't defend. With it, you have a clinically-governed routing system that happens to use AI.",
    },
    // SLIDE 3
    {
      title: 'What makes the copilot feel like care — not call-centre',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Warmth',
      bodyHtml: `<p>Patients can tell the difference between an AI designed to handle them and an AI designed to help them. Three design choices that signal care.</p>`,
      narrationLead:
        "Patients can tell the difference between an AI designed to handle them and an AI designed to help them. Adoption depends on which side of that line the design lands. Three specific design choices that signal care rather than call-centre.",
      steps: [
        {
          html: stepCard('users', 'green', 'Design 1 — Acknowledge the human moment first',
            "When a patient describes pain, anxiety, or distress — the agent acknowledges the moment before going operational. “That sounds difficult. Let me help you find the right care quickly.” Five seconds of warmth at the start changes the whole interaction."),
          narration:
            "Design one. Acknowledge the human moment first. When a patient describes pain. Anxiety. Distress about a symptom. The agent acknowledges the moment before going operational. That sounds difficult. Let me help you find the right care quickly. Five seconds of warmth at the start changes the whole interaction. Patients feel heard. The information they share gets richer because they're not being processed. This single design choice is the difference between adoption and resentment. The warmth isn't a marketing flourish. It's the design.",
        },
        {
          html: stepCard('users', 'blue', 'Design 2 — Always offer the human option, clearly',
            "Every interaction includes a clear option — “speak to a person”. Not hidden three menus deep. Available immediately. Patients who can choose a human rarely do; patients who can't choose a human rarely come back."),
          narration:
            "Design two. Always offer the human option, clearly. Every interaction includes a clear, easily-accessible option to speak to a person. Not buried three menus deep. Not behind a long form. Immediately available. Here's the counterintuitive part — patients who can choose a human, rarely do. They appreciate the option being there. Most stay with the AI because it's working. But patients who can't easily reach a human when they want one, rarely come back. Make the human option visible. Then the AI feels like a choice, not a forced funnel.",
        },
        {
          html: stepCard('users', 'amber', 'Design 3 — Named clinical team behind the AI',
            "“I'm helping you on behalf of the team at [hospital]. Your care team is Dr. X for [specialty] and Nurse Y for [follow-up].” The AI is a member of the team — not an anonymous bot. Belonging changes how patients engage."),
          narration:
            "Design three. The named clinical team behind the AI. Don't let the AI feel anonymous. I'm helping you on behalf of the team at this hospital. Your care team is Doctor So-and-so for your specialty, and Nurse So-and-so for your follow-up. The AI is presented as a member of the team — not as an anonymous bot. Belonging changes how patients engage with the conversation. They share more. They follow the advice more reliably. They feel cared for by a team that happens to include an AI — rather than processed by a system. The shift in framing is design work, not marketing work. It belongs in the design phase.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three failure modes specific to patient-facing AI',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Failure modes',
      bodyHtml: `<p>Three failure modes that have caused real harm at real hospitals. Each preventable by design — and each easier to prevent than to remediate after.</p>`,
      narrationLead:
        "Three failure modes specific to patient-facing AI. Each one has caused real harm at real hospitals over the last few years. Each one is preventable by design — and dramatically easier to prevent than to remediate after the fact.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Missed red flag',
            "A patient describes symptoms that, in retrospect, were red-flag. The AI didn't recognise the pattern and routed to a non-urgent appointment. Patient deteriorated. Prevent — conservative threshold catalogue, regular review, false-positive tolerance built into the design."),
          narration:
            "Failure one. Missed red flag. A patient describes symptoms that, in retrospect, were red-flag — but didn't quite match the AI's pattern recognition. The AI routed to a non-urgent appointment. The patient deteriorated. This has happened. Prevent it through three layers. A conservative red-flag threshold catalogue. Regular review of cases that escalated late. And a design tolerance for false positives — the AI errs on the side of escalation rather than reassurance, every time. The cost of a few unnecessary clinical contacts is a fraction of the cost of one missed deterioration.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Inappropriate confidence in non-clinical territory',
            "Patient asks about medication interactions, alternative therapies, or symptom interpretation. The AI gives a confident-sounding answer that's clinically wrong. Prevent — the AI escalates anything beyond logistics and pre-approved education content to a clinician. No exceptions."),
          narration:
            "Failure two. Inappropriate confidence in non-clinical territory. A patient asks about medication interactions. Alternative therapies. Interpreting a symptom they're worried about. The AI gives a confident-sounding answer that turns out to be clinically wrong. Or right in general but wrong for this patient's specific situation. Prevent it by design. The AI escalates anything beyond logistics and pre-approved education content to a clinician. No exceptions. The agent confidently says — that's a question for your care team, let me connect you. Confident escalation is not weakness; it is the discipline that protects the patient.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Demographic bias in triage routing',
            "If the training data over-represented certain demographics, the triage AI may under-route specific groups. Monitor routing outcomes by group, monthly. Independent quarterly review by the clinical leadership. The pattern is preventable — but only when monitored."),
          narration:
            "Failure three. Demographic bias in triage routing. If the training data over-represented certain demographics, the triage AI may systematically under-route patients from other groups — sending them to lower-urgency appointments when they should have been routed higher. The pattern is well-documented in healthcare AI literature. It is also preventable. Monitor routing outcomes by group — gender, ethnicity, age band, language — monthly. Independent quarterly review by the clinical leadership. Adjust where patterns emerge. The bias is preventable but only when monitored. Don't deploy without the monitoring framework in place.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 4 — imaging AI.</p>`,
      narrationLead:
        "Three anchors before we move to imaging AI in chapter four.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four touchpoints, sequenced',
            "Pre-visit info · symptom triage with red-flag threshold · scheduling · post-discharge navigation. Start with the lowest-risk; build to the higher-impact ones."),
          narration:
            "One. Four touchpoints sequenced. Pre-visit information first — lowest risk. Symptom triage with the formal red-flag threshold catalogue. Appointment scheduling. Post-discharge navigation and medication reminders — highest impact on readmission rates. Build the touchpoints in that order.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three design choices that signal care',
            "Acknowledge the human moment · always offer the human option · named clinical team behind the AI. Warmth is design, not marketing."),
          narration:
            "Two. Three design choices that signal care, not call-centre. Acknowledge the human moment first. Always offer the human option, clearly. Position the AI as a named member of the patient's clinical team. Warmth is design work — it belongs in the design phase, not the marketing brief.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three failure modes to prevent by design',
            "Missed red flags · inappropriate confidence beyond scope · demographic bias in routing. Each preventable. Each catastrophic if it slips through."),
          narration:
            "Three. Three failure modes to prevent at design time. Missed red flags — conservative threshold catalogue, regular review. Inappropriate confidence in non-clinical territory — the AI escalates beyond its scope, no exceptions. Demographic bias in triage routing — monthly monitoring, quarterly independent review. Each one is preventable. Each one is catastrophic if it slips through.",
        },
      ],
      narrationTrail:
        "Chapter four — imaging AI. Where AI accelerates the radiologist without replacing them. See you there.",
    },
  ],
}
