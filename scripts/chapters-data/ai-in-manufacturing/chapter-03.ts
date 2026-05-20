import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiMfgChapter03: Chapter = {
  courseId: 'ai-in-manufacturing',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-quality-vision',
  title: 'Quality vision AI',
  subtitle: 'Three messy-real-world challenges · the operator labelling loop · the false-confidence failure mode that bites in year two.',
  slides: [
    // SLIDE 1
    {
      title: 'Quality vision AI',
      iconKey: 'search',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Quality vision AI in the demo is almost magical. Quality vision AI in your plant — with dust, light variation, novel defects, drifting cameras — is harder. Three challenges to design around. One operator labelling loop that decides whether the system improves. One failure mode that bites in year two.</p>`,
      narrationLead:
        "Welcome to chapter three. Quality vision AI. Quality vision AI in the vendor demo is almost magical — a clean parts conveyor, controlled lighting, one defect type, perfect demonstration. Quality vision AI in your actual plant — dust on the cameras, lighting that changes by time of day, novel defects the model never saw, cameras drifting out of alignment over months — is meaningfully harder. Three challenges to design around from day one. The operator labelling loop that decides whether the system improves or stagnates. The false-confidence failure mode that bites in year two when teams forget the system has limits. By the end, the architecture for quality vision that survives the plant.",
    },
    // SLIDE 2
    {
      title: 'Three messy-real-world challenges',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The challenges',
      bodyHtml: `<p>Three challenges that show up in every plant quality vision deployment. None of them appear in vendor demos. All three need explicit design choices at deployment, not discovery during production.</p>`,
      narrationLead:
        "Three challenges that show up in every plant quality vision deployment regardless of the vendor or model. None of the three appear in the vendor demo because demos are run under controlled conditions. All three need explicit design choices made at deployment, not discovered during production after the model is failing. Knowing the three lets the design team anticipate them and engineer for them upfront.",
      steps: [
        {
          html: stepCard('alertTriangle', 'amber', 'Challenge 1 — Lighting variation across shifts and seasons',
            "Plant lighting changes through the day with natural light influence, between shifts as operators adjust, across seasons. Vision models trained on stable lighting fail when lighting shifts. Design — controlled artificial lighting at the inspection station, calibration on shift changes."),
          narration:
            "Challenge one. Lighting variation across shifts and seasons. Plant lighting changes through the day as natural light influence shifts — even plants designed to be windowless have subtle variations from skylight and door opening cycles. Lighting changes between shifts as operators adjust task lighting to their preferences. Lighting changes across seasons as the angles of natural light through windows shift and as plant heating creates different thermal hazes in cold versus warm months. Vision models trained on stable lighting from the pilot phase fail when lighting shifts during production. Design choice — install controlled artificial lighting at every inspection station to dominate over natural variation. Recalibrate at shift changes and at major weather transitions. The lighting discipline is unglamorous and is the determinant of long-term accuracy.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Challenge 2 — Camera drift and dust accumulation',
            "Cameras shift slightly over months from vibration. Dust accumulates on lenses. Models that worked at install slowly degrade. Without active maintenance — weekly cleaning, monthly recalibration — accuracy drops 5–10% per quarter invisibly."),
          narration:
            "Challenge two. Camera drift and dust accumulation. Cameras shift slightly over months from plant vibration — the alignment that was perfect at install drifts by a few millimetres or a few degrees over a year. Dust accumulates on lenses despite enclosures. Models that worked accurately at install slowly degrade. Critical word — slowly. The degradation isn't catastrophic; it's a few percentage points per quarter that accumulate to ten or fifteen percent over a year if active maintenance isn't running. Without weekly cleaning of lenses, monthly recalibration of camera position, quarterly review of model accuracy versus baseline — the system accuracy drops invisibly. Operators stop trusting the system, then stop using the system. Schedule the maintenance discipline. The frequency depends on plant environment cleanliness; weekly is the floor.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Challenge 3 — Novel defects the model never saw',
            "Vision models classify defects they have seen examples of in training. Truly novel defects — supplier process change, new raw material, drifting equipment producing a new pattern — slip past. The model says \"good\" because nothing about it matches a known defect category. Design — the human inspection sample at low rate."),
          narration:
            "Challenge three. Novel defects the model never saw during training. Vision models classify defects they have seen examples of in their training data. They can be highly accurate on the defects they know. Truly novel defects — caused by a supplier process change you weren't told about, by a new raw material lot with different properties, by drifting equipment that started producing a new failure pattern — slip past the model entirely. The model classifies the part as good because nothing about the novel defect matches any known defect category. This is the most subtle and most consequential challenge because it doesn't show up as low confidence in the model's output. The model is confident. The defect is real. The design response — maintain a human inspection sample at a low rate, say one percent of production, deliberately to catch novel defects the model wouldn't catch. The human sample is the safety net.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The operator labelling loop',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The loop',
      bodyHtml: `<p>Three-stage loop that lets the system get better quarter over quarter. Without the loop, the model stagnates at its initial accuracy and slowly degrades as conditions shift. With the loop, it compounds.</p>`,
      narrationLead:
        "Three-stage operator labelling loop that lets the quality vision system get better quarter over quarter. Without the loop, the model stagnates at its initial training accuracy and slowly degrades as plant conditions shift. With the loop, the system compounds — every quarter, accuracy on the previous quarter's failure modes improves because operators have labelled the examples. The loop is the durability mechanism. Design it on day one.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Stage 1 — Operator flags edge cases easily',
            "When the operator sees the system disagree with their judgment — system passed a defect, or rejected a good part — flagging it must take 5 seconds or less. Single click in the existing operator interface, no separate portal. Friction at this step kills the entire loop."),
          narration:
            "Stage one. Operator flags edge cases easily. The moment the line operator sees the vision system disagree with their judgment — the system passed a part the operator can see is defective, or the system rejected a part the operator can see is good — they need to flag it. Flagging must take five seconds or less. Single click in the operator's existing interface, no separate portal, no form to fill. Friction at this step kills the entire labelling loop. If flagging takes two minutes, operators flag the egregious cases and miss the subtle ones — and the subtle ones are exactly what the model needs to learn. Design the flagging interface with operators directly. The interface design is the determinant of how rich the labelling data becomes over time.",
        },
        {
          html: stepCard('users', 'blue', 'Stage 2 — Quality lead reviews flags weekly',
            "Once a week, the quality lead reviews the flagged cases — confirms which are genuine defects, classifies new patterns, decides which feed back to the model for retraining. 30–60 minutes per week. The triage step keeps the labelling data clean."),
          narration:
            "Stage two. Quality lead reviews flagged cases weekly. Once a week, the quality lead — typically a senior quality engineer or the head of QA — reviews the cases operators flagged. Confirms which flags represent genuine defects the model missed. Classifies any new defect patterns into existing categories or proposes new categories. Decides which examples feed back to the model for the next retraining cycle. The triage step takes thirty to sixty minutes per week depending on flag volume. Without the triage, the labelling data accumulates with operator errors and inconsistent classification — and the model retraining produces inconsistent results. The triage keeps the labelling data clean enough that retraining actually improves accuracy.",
        },
        {
          html: stepCard('users', 'blue', 'Stage 3 — Quarterly model retraining with the new labels',
            "Every quarter, the model retrains with the cumulative labelled data. Accuracy on the previous quarter\'s missed patterns improves. Novel defect categories the system didn\'t catch initially start being recognised. The compounding mechanism."),
          narration:
            "Stage three. Quarterly model retraining with the cumulative labelled data. Every quarter, the vision model retrains using the cumulative dataset including the new labelled examples from the previous quarter. Accuracy on the previous quarter's missed patterns improves measurably. Novel defect categories the system didn't catch when it was deployed start being recognised reliably. This is the compounding mechanism that makes quality vision AI a multi-year investment that gets better rather than a one-time deployment that slowly degrades. Schedule the retraining quarterly with the AI vendor or your internal team. The retraining cost is modest — typically days of compute. The accuracy lift compounds for years.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where most labelling loops fail',
        "Stage 1 — flagging friction. The vendor demo shows a beautiful flagging interface that takes five seconds. The actual deployed system requires the operator to log into a separate portal, fill a form, save it. Flagging drops to zero. Test the flagging UX with real operators before signing the contract."),
      calloutNarration:
        "Where most labelling loops fail in practice. Stage one — flagging friction. The vendor demo shows a beautiful flagging interface that takes five seconds with one click. The actual deployed system in your plant requires the operator to log into a separate quality portal, fill a multi-field form about the defect type, save it, return to the line. Flagging in this design drops to near zero within a month — operators flag only the egregious cases because the friction isn't worth it for subtle ones. The labelling data accumulates slowly and is biased toward easy cases. Test the flagging UX with real operators before signing the vendor contract, not after deployment. The flagging discipline is the labelling loop discipline.",
    },
    // SLIDE 4
    {
      title: 'The false-confidence failure mode',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The trap',
      bodyHtml: `<p>One failure mode bites quality vision deployments in year two — false confidence that the system catches everything. Three disciplines prevent it. Without the discipline, the system silently fails on novel defects and lots reach customers.</p>`,
      narrationLead:
        "One failure mode that bites quality vision AI deployments in year two. False confidence that the system catches everything. The team forgets the system has limits, reduces human inspection in response to the apparent accuracy, and silently fails on novel defects that reach customers. The failure mode is preventable with three specific disciplines that need to be in place from day one. Without the disciplines, the failure mode is the most likely way quality vision AI produces a brand event in your industry.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Discipline 1 — Maintain the 1% human inspection sample',
            "The model classifies. A human still inspects 1% of production. The sample catches novel defects the model misses. Don\'t reduce the sample because the model is performing well — the sample is the safety net specifically for the rare cases the model can\'t see."),
          narration:
            "Discipline one. Maintain the one-percent human inspection sample. The model classifies the production volume. A human inspector still inspects one percent of production with their own judgment — looking for anything that strikes them as off, not just verifying the model's specific classifications. The sample catches novel defects the model misses because nothing about them matches known defect categories. Don't reduce the sample size because the model is performing well in routine quality metrics. The sample is the safety net specifically for the rare cases the model can't see, and reducing it when the model seems accurate is exactly when you most need the safety net intact. Hold the sample. Schedule the inspection time. Don't let efficiency pressure erode it.",
        },
        {
          html: stepCard('shield', 'green', 'Discipline 2 — Quarterly outcome review against customer returns',
            "Once a quarter, compare what the system passed vs customer returns or warranty claims received. Any pattern where the system consistently passed defects that customers returned — surface immediately. Customer signal is the ultimate audit of the vision system."),
          narration:
            "Discipline two. Quarterly outcome review against customer returns and warranty claims. Once a quarter, the quality leadership team compares what the vision system passed during the quarter against customer returns or warranty claims received about that quarter's production. Look for patterns — any defect category showing up in customer returns at meaningfully higher rates than the system flagged it. Any specific defect mode where the system consistently passed parts that customers later returned. Customer signal is the ultimate audit of the vision system's blind spots. Without this review, blind spots persist invisibly until they accumulate to a regulatory issue or a major customer complaint. With the review, blind spots surface within a quarter and get addressed through model retraining or process changes.",
        },
        {
          html: stepCard('shield', 'green', 'Discipline 3 — Document model limitations explicitly',
            "Written document — known defect categories the system catches, known categories it doesn\'t, known edge cases. Reviewed annually. Auditors and customers increasingly ask for this. Documenting limits prevents the team from forgetting the system has them."),
          narration:
            "Discipline three. Document model limitations explicitly. A written document — typically two to three pages — that lists known defect categories the system catches well, known categories the system doesn't catch reliably, known edge cases where the system has insufficient training data. Reviewed annually and updated as the system improves through retraining. Auditors and major customers increasingly ask for this documentation in quality audits. Documenting the limits prevents the team from forgetting the system has limits over the years as it works well in routine operations. The documentation is also what a regulator examines if a quality-related incident occurs — having it shows the team knew the system's boundaries and operated within them. Build the document on day one of the program. Update it annually with rigor.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter four — process optimisation with AI.</p>`,
      narrationLead:
        "Three anchors before chapter four — process optimisation with AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three messy-real-world challenges',
            "Lighting variation (controlled artificial + shift recalibration) · camera drift and dust (weekly cleaning, monthly recal, quarterly review) · novel defects the model never saw (the 1% human sample safety net)."),
          narration:
            "One. Three messy-real-world challenges to design around at deployment. Lighting variation across shifts and seasons — install controlled artificial lighting at every inspection station, recalibrate at shift changes. Camera drift and dust accumulation — weekly lens cleaning, monthly camera recalibration, quarterly accuracy review against baseline. Novel defects the model never saw during training — maintain a one-percent human inspection sample as the safety net specifically for cases the model can't recognise. All three challenges show up in every plant deployment regardless of vendor or model quality.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three-stage labelling loop',
            "Operator flags edge cases in 5 seconds or less · quality lead triages weekly (30–60 min) · quarterly model retraining with new labels. The compounding mechanism. Flagging friction is where most loops fail; test the UX with operators before signing."),
          narration:
            "Two. Three-stage operator labelling loop. Stage one — operator flags edge cases in five seconds or less with single click in their existing interface. Stage two — quality lead triages flagged cases weekly in thirty to sixty minutes, confirms and classifies for clean labelling data. Stage three — quarterly model retraining with the cumulative labelled data, accuracy compounds on previously-missed patterns. The labelling loop is the durability mechanism that makes quality vision a multi-year investment that improves rather than a deployment that degrades. Flagging friction in stage one is where most loops fail; test the UX with real operators before signing the vendor contract.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three false-confidence disciplines',
            "Maintain the 1% human inspection sample · quarterly outcome review against customer returns · document model limitations explicitly. Discipline prevents the year-two failure mode where teams forget the system has limits and silently fail on novel defects."),
          narration:
            "Three. Three disciplines that prevent the false-confidence failure mode in year two. Maintain the one-percent human inspection sample as the safety net specifically for novel defects the model can't see — don't reduce it because the system seems accurate. Quarterly outcome review against customer returns and warranty claims — customer signal is the ultimate audit of system blind spots. Document model limitations explicitly in a two-to-three page document reviewed annually — auditors increasingly ask for this, and it prevents the team from forgetting the system has limits during years of routine operation. Discipline is what makes quality vision durable across the long horizon.",
        },
      ],
      narrationTrail:
        "Chapter four — process optimisation with AI. Surfacing non-obvious improvements and avoiding the overfitting trap. See you there.",
    },
  ],
}
