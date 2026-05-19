import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiHealthcareChapter04: Chapter = {
  courseId: 'ai-in-healthcare',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-imaging-ai',
  title: 'Imaging AI — with the radiologist',
  subtitle: 'Where AI accelerates the radiologist without replacing them — and the discipline that keeps it that way.',
  slides: [
    // SLIDE 1
    {
      title: 'Imaging AI — with the radiologist',
      iconKey: 'search',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Imaging AI is one of the most mature healthcare AI categories. In specific modalities, it genuinely accelerates and improves the radiologist’s work. In others, the technology isn’t there yet. In the next few minutes, where it works, where it doesn’t, and the discipline that protects the radiologist’s role.</p>`,
      narrationLead:
        "Welcome to chapter four. Imaging AI — with the radiologist. Imaging AI is one of the most mature healthcare AI categories. In specific modalities, it genuinely accelerates and improves the radiologist's work — chest x-ray, mammography, diabetic retinopathy screening, and a handful of others. In other modalities, the technology isn't yet good enough for production deployment. Recognising which is which is the leadership work. In the next few minutes, where imaging AI works, where it doesn't, and the discipline that protects the radiologist's role at the centre of the workflow.",
    },
    // SLIDE 2
    {
      title: 'Where imaging AI works in 2026 — and where it doesn’t',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The maturity map',
      bodyHtml: `<p>Three categories of imaging AI maturity. Don’t deploy beyond category one without explicit clinical-leadership sign-off and a longer governance pathway.</p>`,
      narrationLead:
        "Three categories of imaging AI maturity in 2026. Recognise which category each potential deployment falls into. Don't deploy beyond category one without explicit clinical leadership sign-off and a longer governance pathway. The maturity differs dramatically by modality and by use case.",
      steps: [
        {
          html: stepCard('check', 'green', 'Category 1 — Mature: chest x-ray, mammography, DR screening',
            "Multi-year evidence base. Regulator-approved devices available in most jurisdictions. Established radiology workflow patterns. Deploy with confidence — provided the radiologist remains in the loop."),
          narration:
            "Category one. Mature deployments. Chest x-ray AI for pneumonia detection and tube placement. Mammography AI for breast cancer screening. Diabetic retinopathy screening from retinal photographs. These have multi-year evidence bases. Regulator-approved devices are available from multiple vendors in most jurisdictions. Established radiology workflow patterns exist. You can deploy in these categories with confidence — provided the radiologist remains in the loop on every case. Most hospital imaging AI programmes should start here.",
        },
        {
          html: stepCard('check', 'blue', 'Category 2 — Emerging: stroke imaging, lung nodule, certain MRI applications',
            "Real evidence, but specific to populations and clinical settings. Vendor claims often outrun the evidence for your population. Deploy with longer evaluation, more local validation, careful generalisability assessment."),
          narration:
            "Category two. Emerging deployments. Stroke imaging — particularly large-vessel occlusion detection. Lung nodule detection on CT. Certain MRI applications in cardiology and neurology. The evidence exists but is often specific to the populations the model was trained on. Vendor performance claims often outrun the evidence for your specific patient population. Deploy with a longer evaluation period. More local validation against your hospital's actual cases. Careful generalisability assessment with your radiology lead. The technology is real; the calibration is yours to do.",
        },
        {
          html: stepCard('x', 'red', 'Category 3 — Not yet ready: most general radiology AI claims',
            "“AI that reads everything” doesn't work yet. Vendors selling this are over-claiming. Decline the pitch. Wait for the modality-specific evidence to mature. Don't fund category-3 ambitions with category-1 budgets."),
          narration:
            "Category three. Not yet ready for production. Most general radiology AI claims — the AI that reads everything across modalities, the AI that drafts the full radiology report, the AI that ranks studies by urgency across the whole reading list. Vendors selling these capabilities are over-claiming. The technology isn't there yet for production deployment. Decline the pitch. Wait for the modality-specific evidence to mature. Don't fund category-three ambitions with category-one budgets — that's the most common waste of healthcare AI capital in radiology programmes today.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A practical filter',
        "Ask the vendor — show me the peer-reviewed evidence on populations similar to ours, in the modality you're proposing. If they can produce it crisply — likely category 1 or 2. If they handwave — category 3. The filter takes 90 seconds."),
      calloutNarration:
        "A practical filter to apply to any imaging AI vendor pitch. Ask one question. Show me the peer-reviewed evidence on patient populations similar to ours, in the specific modality you're proposing to deploy. If they can produce the evidence crisply — naming the studies, the populations, the performance numbers — you're likely in category one or category two. Deploy carefully. If they handwave — citing general claims, vendor white papers, or in-house validations — you're in category three. Decline the pitch. The filter takes ninety seconds in a meeting. Use it consistently.",
    },
    // SLIDE 3
    {
      title: 'The workflow that keeps the radiologist central',
      iconKey: 'compass',
      eyebrow: 'Lesson 2 · The workflow',
      bodyHtml: `<p>Four workflow disciplines. None optional. Together they keep the radiologist central to the reading — and the AI in its proper supporting role.</p>`,
      narrationLead:
        "Four workflow disciplines that keep the radiologist central to the reading process. None of them is optional. Together they make the deployment defensible — to the radiologists themselves, to the medical staff committee, and to the regulator.",
      steps: [
        {
          html: stepCard('compass', 'green', 'Discipline 1 — Radiologist reads the image first',
            "The AI's findings appear after the radiologist has formed their initial impression. Not before. Anchoring bias is real and well-documented in radiology AI deployments. Sequence matters."),
          narration:
            "Discipline one. The radiologist reads the image first. The AI's findings appear after the radiologist has formed their initial impression. Not before. This sequencing matters more than people expect. When the AI's findings appear first, anchoring bias — well-documented in radiology AI deployment literature — leads radiologists to subconsciously align with the AI. They miss things the AI missed, and they over-confirm things the AI flagged. Reverse the order. The radiologist's independent read comes first. Then the AI overlay. The radiologist reconciles. The discipline preserves clinical judgement.",
        },
        {
          html: stepCard('compass', 'blue', 'Discipline 2 — Disagreement gets a written rationale',
            "When the radiologist disagrees with the AI — for or against a finding — they write a brief rationale. Builds the dataset for tuning. Builds the evidence trail for governance. Builds the radiologist's confidence in their judgement."),
          narration:
            "Discipline two. Disagreement gets a written rationale. When the radiologist disagrees with the AI — overruling a flag, or adding a finding the AI missed — they write a brief rationale. One or two sentences. This builds the dataset for tuning the AI to your hospital's population over time. It builds the evidence trail for any future governance review. And, quietly, it builds the radiologist's confidence in their own judgement — articulating disagreement strengthens clinical reasoning. Worth the thirty seconds per disagreement.",
        },
        {
          html: stepCard('compass', 'amber', 'Discipline 3 — Audit trail per study',
            "Every AI run on a study is logged. What the model saw. What it flagged. What the radiologist did. The trail is what allows you to reconstruct any case — and to investigate any pattern that emerges across cases."),
          narration:
            "Discipline three. Audit trail per study. Every AI run on a study is logged in the imaging system. What model version. What it saw — the inputs. What it flagged or didn't. What the radiologist's final read was. Whether they agreed or disagreed with the AI. The audit trail is what allows you to reconstruct any specific case for a clinical review, a legal proceeding, or a regulator examination. It is also what allows you to investigate patterns that emerge across cases over time. Without the audit trail, the deployment is not defensible. With it, the deployment is documented.",
        },
        {
          html: stepCard('compass', 'green', 'Discipline 4 — Quarterly performance review with radiology',
            "The radiology lead, the AI programme lead, and a clinical-governance representative review performance — sensitivity, specificity, agreement rate, disagreement patterns. Tune. Update. The review is the rhythm that keeps the deployment honest."),
          narration:
            "Discipline four. Quarterly performance review with the radiology team. The radiology lead, the AI programme lead, and a clinical-governance representative — typically the medical staff committee chair — review performance numbers each quarter. Sensitivity. Specificity. Agreement rate between AI and radiologist. Patterns in disagreement. Then they tune. Update training. Adjust thresholds where appropriate. The quarterly review is the rhythm that keeps the deployment honest. Without it, the deployment drifts. With it, the deployment compounds — getting better against your hospital's specific patient population over time.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The vendor and procurement questions specific to imaging AI',
      iconKey: 'search',
      eyebrow: 'Lesson 3 · Vendor questions',
      bodyHtml: `<p>Four questions to ask every imaging AI vendor — beyond the standard healthcare-AI evaluation questions. These are imaging-specific.</p>`,
      narrationLead:
        "Four questions to ask every imaging AI vendor — beyond the standard healthcare AI evaluation questions. These four are imaging-specific. Apply them in the first evaluation meeting.",
      steps: [
        {
          html: stepCard('search', 'blue', '1 · What populations were the model trained on?',
            "If the model was trained on populations dramatically different from yours — different ethnic mix, different equipment vendors, different acquisition protocols — performance will degrade. Demand specificity. Honest vendors give it; dishonest vendors waffle."),
          narration:
            "Question one. What populations was the model trained on? If the training population was dramatically different from your hospital's — different ethnic mix, different age distribution, different equipment vendors, different acquisition protocols — performance will degrade on your patients. Demand specificity from the vendor. Honest vendors give it crisply. Dishonest vendors waffle about general performance. The answer to this question tells you whether you need extensive local validation before deployment — or whether you can deploy with confidence based on the existing evidence.",
        },
        {
          html: stepCard('search', 'amber', '2 · What\'s the regulator status — by jurisdiction?',
            "FDA cleared. EU MDR conformity assessment. Saudi SFDA. Indian CDSCO. Each jurisdiction has its own clearance pathway. “FDA cleared” doesn't mean approved in your country. Get specifics — in writing."),
          narration:
            "Question two. What is the regulator status of this device — by jurisdiction? FDA clearance in the US. EU MDR conformity assessment. Saudi SFDA. Indian CDSCO. Each jurisdiction has its own clearance pathway for AI-as-medical-device. FDA cleared doesn't mean approved in your country. Get the specifics in writing. If the vendor doesn't have approval in your jurisdiction, the deployment is investigational at best — and possibly outside the bounds of what you can legally use. The procurement and legal teams need this answer documented before contract.",
        },
        {
          html: stepCard('search', 'red', '3 · How does the model handle out-of-distribution images?',
            "What happens when the input looks unlike anything the model was trained on — a rare presentation, an unusual acquisition protocol, image artefact? Honest answer — the model expresses low confidence and flags for radiologist. Dishonest answer — silently confident output."),
          narration:
            "Question three. How does the model handle out-of-distribution images? Meaning — what happens when the input image looks unlike anything the model was trained on. A rare clinical presentation. An unusual acquisition protocol. Image artefact from equipment malfunction. The honest answer from a credible vendor — the model expresses low confidence and flags the case for radiologist attention. The dishonest answer — the model is silently confident and produces an output as if the input were normal. The second pattern is dangerous. Filter for the honest answer.",
        },
        {
          html: stepCard('search', 'green', '4 · What\'s your post-market surveillance protocol?',
            "Once deployed, how does the vendor monitor real-world performance? How are issues escalated to customers? How quickly are updates pushed? The post-market surveillance answer tells you whether the vendor is operating like a medical-device company — or like a software vendor."),
          narration:
            "Question four. What is your post-market surveillance protocol? Once the device is deployed at hospitals, how does the vendor monitor real-world performance — across customers and modalities. How are issues escalated to customers. How quickly are updates pushed. Are issues disclosed transparently when they affect a customer. The post-market surveillance answer tells you whether the vendor is operating like a medical-device company — with the disciplines that come with that — or like a generic software vendor. The two are very different. Insist on medical-device discipline.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — operations and pharmacy AI.</p>`,
      narrationLead:
        "Three anchors before chapter five — operations and pharmacy AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three maturity categories; deploy carefully',
            "Mature (chest x-ray, mammography, DR) · emerging (stroke, lung nodule) · not yet ready (general radiology AI claims). Don't fund category-3 ambitions with category-1 budgets."),
          narration:
            "One. Three maturity categories. Mature — chest x-ray, mammography, diabetic retinopathy. Emerging — stroke imaging, lung nodule, certain MRI applications. Not yet ready — most general radiology AI claims. Deploy carefully. Don't fund category-three ambitions with category-one budgets. That's the most common waste of imaging AI capital.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four workflow disciplines that keep the radiologist central',
            "Radiologist reads first · disagreement gets rationale · audit trail per study · quarterly review with radiology. The workflow protects clinical judgement."),
          narration:
            "Two. Four workflow disciplines. Radiologist reads the image first — sequence matters. Disagreement gets a written rationale. Audit trail per study. Quarterly performance review with the radiology team. The workflow protects clinical judgement and produces the documentation that defends the deployment.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four imaging-specific vendor questions',
            "Training populations · regulator status by jurisdiction · out-of-distribution handling · post-market surveillance. The questions filter the credible vendors from the marketing-led ones."),
          narration:
            "Three. Four imaging-specific vendor questions. Training populations. Regulator status by your specific jurisdiction. Out-of-distribution handling. Post-market surveillance protocol. The questions filter the credible vendors from the marketing-led ones in the first evaluation meeting. Use them consistently.",
        },
      ],
      narrationTrail:
        "Chapter five — operations and pharmacy AI. The unglamorous plays that quietly fund the rest. See you there.",
    },
  ],
}
