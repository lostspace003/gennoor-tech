import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiHealthcareChapter06: Chapter = {
  courseId: 'ai-in-healthcare',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-phi-and-sovereignty',
  title: 'PHI and data sovereignty',
  subtitle: 'The non-negotiable foundation that protects every other healthcare AI play.',
  slides: [
    // SLIDE 1
    {
      title: 'PHI and data sovereignty',
      iconKey: 'shield',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Protected health information is the most sensitive data category your hospital holds. AI changes how it flows — and the regulators are watching. In the next few minutes, the three patterns that protect PHI, the deployment postures, and the discipline that holds across years.</p>`,
      narrationLead:
        "Welcome to chapter six. PHI and data sovereignty. Protected health information is the most sensitive data category your hospital holds. AI changes how that data flows — through systems, through vendors, sometimes across jurisdictional boundaries. The regulators are watching this in 2026 more closely than they were two years ago. In the next few minutes, the three patterns that protect PHI in AI deployments, the deployment postures available, and the discipline that holds across years and across leadership changes.",
    },
    // SLIDE 2
    {
      title: 'Three patterns that protect PHI in healthcare AI',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · The patterns',
      bodyHtml: `<p>Three patterns. Each one mature in 2026. Each one defensible. Pick deliberately based on your jurisdiction, your data sensitivity, and your operational reality.</p>`,
      narrationLead:
        "Three patterns to protect PHI in healthcare AI deployments. Each one is mature in 2026. Each one is defensible. Pick deliberately based on your jurisdiction, your data sensitivity, your operational reality, and your patient population's expectations. None is universally right — each fits a different context.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Pattern A — Sovereign cloud deployment',
            "All PHI-touching AI runs on a sovereign cloud region your regulator has explicitly approved. Azure UAE, Azure Saudi, Azure India Central, equivalents in other markets. The common pattern for major hospitals in 2026."),
          narration:
            "Pattern A. Sovereign cloud deployment. All AI that touches protected health information runs on a sovereign cloud region your regulator has explicitly approved for healthcare workloads. Azure UAE. Azure Saudi. Azure India Central. Equivalent regions in other markets. This is the common pattern for major hospitals in 2026. Procurement processes are mature. Pricing is well understood. The regulator conversation is straightforward in most jurisdictions — but don't skip it. Document the choice formally.",
        },
        {
          html: stepCard('shield', 'amber', 'Pattern B — On-premise inference for the most sensitive workloads',
            "For genomic data, mental health records, certain pediatric data, or workloads in jurisdictions with strict on-shore requirements — run the AI inference on your own infrastructure. Open-source models, smaller and tuned for specific tasks. Slower iteration; stronger residency."),
          narration:
            "Pattern B. On-premise inference for the most sensitive workloads. For genomic data. Mental health records. Certain pediatric and adolescent data. Or any workload in a jurisdiction with strict on-shore requirements. Run the AI inference on your hospital's own infrastructure. Typically using open-source foundation models — Llama, Mistral, smaller specialised models — that are smaller than the frontier cloud models. Slower to iterate on capability improvements. Stronger on data residency and sovereignty. Have a plan for pattern B even if your current workloads sit in pattern A — you may need it for specific data categories.",
        },
        {
          html: stepCard('shield', 'green', 'Pattern C — De-identification before AI inference',
            "Strip identifying information before the data reaches the AI. The AI sees the clinical structure but not the identity. Re-identification happens locally, after AI processing. Sophisticated but increasingly viable for specific use cases — research, population analytics."),
          narration:
            "Pattern C. De-identification before AI inference. Strip identifying information from the data before it reaches the AI inference layer. The AI sees the clinical structure of the case but not the patient's identity. Re-identification happens locally — on your hospital's infrastructure — after AI processing returns the structured output. This pattern is sophisticated but increasingly viable for specific use cases. Research applications. Population analytics. Operational forecasting that uses patient data without needing identities. When done well, it lets you use frontier AI capabilities while keeping PHI strictly on-premise. Worth understanding as an emerging option.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Document the posture per system',
        "Different AI systems in your hospital may use different patterns. The clinical documentation AI may use sovereign cloud. The genomic research AI may use on-premise. The operations AI may use de-identification. Document the posture per system in your formal PHI handling policy. Reviewed annually by clinical governance."),
      calloutNarration:
        "Document the posture per system. Different AI systems in your hospital may legitimately use different patterns. The clinical documentation AI may use sovereign cloud. The genomic research AI may use on-premise inference. The operations AI dealing with non-PHI may use commercial cloud. The patient-journey AI dealing with limited PHI may use de-identification. Each system's posture is documented in your formal PHI handling policy. Reviewed annually by clinical governance and your data protection officer. The documentation is what allows you to answer the regulator question coherently — without scrambling to assemble it during the examination.",
    },
    // SLIDE 3
    {
      title: 'The minimum-necessary discipline — applied to AI',
      iconKey: 'check',
      eyebrow: 'Lesson 2 · Minimum necessary',
      bodyHtml: `<p>HIPAA’s minimum-necessary rule has equivalents in most jurisdictions. AI systems need to be scoped to the minimum PHI required for the task. Three concrete applications.</p>`,
      narrationLead:
        "The minimum-necessary rule — HIPAA's version is the most cited, but equivalents exist in most jurisdictions. AI systems need to be scoped to the minimum PHI required for the specific task. This sounds obvious; in practice it is often violated by AI deployments that pull entire patient records for tasks that needed much less. Three concrete applications.",
      steps: [
        {
          html: stepCard('check', 'blue', '1 · Scope the data fields, not the patient record',
            "If the AI is for medication interaction checking, it sees medications and allergies — not the full chart. If it's for discharge planning, it sees discharge-relevant fields. The temptation to “just give the AI everything” is what regulators most consistently push back on. Resist."),
          narration:
            "Application one. Scope the data fields, not the patient record. If the AI is for medication interaction checking, it sees medications and allergies — not the full chart. If it's for discharge planning, it sees discharge-relevant fields. If it's for radiology workflow, it sees imaging and the related orders — not the patient's mental health history. The temptation to just give the AI everything, because more context might help, is what regulators most consistently push back on. Resist it. Scope by data field. Document the scoping decision. Defend it.",
        },
        {
          html: stepCard('check', 'amber', '2 · Time-bound the data',
            "The AI doesn't need a patient's full longitudinal record for most tasks. It needs recent data relevant to the task. Limit the time window — current episode, last 12 months, whatever fits the use case. Older data stays in the EHR, not in the AI's working memory."),
          narration:
            "Application two. Time-bound the data. The AI doesn't need a patient's full longitudinal record for most tasks. It needs recent data relevant to the current task. Limit the time window. The current episode of care. The last twelve months. Whatever fits the specific use case. Older data stays in the EHR, accessible to clinicians, but not in the AI's working memory or processing context. Time-bounding reduces both privacy exposure and the model's tendency to weigh stale information inappropriately. Two benefits from one discipline.",
        },
        {
          html: stepCard('check', 'green', '3 · Audit access logs by user and by case',
            "Every AI access to PHI is logged. Who initiated. Which patient. What data was processed. What the AI returned. Reviewable on demand. The audit log is the artefact that proves minimum-necessary in any future examination."),
          narration:
            "Application three. Audit access logs by user and by case. Every AI access to PHI is logged. Who initiated the access — typically the clinician or the system process. Which patient's data was accessed. What specific data fields were processed. What the AI returned. Reviewable on demand by your data protection officer or by internal audit. The audit log is the artefact that proves minimum-necessary in any future regulator examination or internal review. Without comprehensive logs, you can't prove the discipline existed. With them, the discipline is documented continuously.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The vendor contract clauses specific to healthcare AI',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · Contracts',
      bodyHtml: `<p>Six contract clauses specific to healthcare AI vendors — on top of the standard vendor terms. Get them in writing before signing.</p>`,
      narrationLead:
        "Six contract clauses specific to healthcare AI vendors. On top of the standard cloud and software vendor terms. Get them in writing before signing. Your data protection officer and legal team confirm each annually.",
      steps: [
        {
          html: stepCard('shield', 'blue', '1 · Business associate agreement (or equivalent)',
            "In the US, the BAA is required under HIPAA. Equivalents exist in most jurisdictions. The vendor explicitly takes on PHI handling obligations. Standard. Non-negotiable. Don't sign without it."),
          narration:
            "Clause one. Business Associate Agreement — in the US, required under HIPAA. Equivalent agreements in most other jurisdictions. The vendor explicitly takes on PHI handling obligations in writing. Standard. Non-negotiable. Don't sign the main contract without the BAA — or the equivalent — being in place. The BAA is the artefact regulators ask for first when they examine vendor relationships in healthcare AI.",
        },
        {
          html: stepCard('shield', 'amber', '2 · Data residency commitment',
            "The contract names the specific regions where PHI is processed and stored. Commits to those regions remaining available. If you need on-shore processing for any data category, the contract states it explicitly. Generic data residency clauses are not enough."),
          narration:
            "Clause two. Data residency commitment. The contract names the specific cloud regions where PHI is processed and stored. Commits to those regions remaining available throughout the contract term. If you need on-shore processing for any specific data category — genomic data, mental health, paediatric — the contract states it explicitly for those categories. Generic data residency clauses that say will be hosted in compliant regions are not enough. Specificity is the discipline.",
        },
        {
          html: stepCard('shield', 'red', '3 · No training on your data',
            "The vendor certifies in writing that your hospital's PHI will not be used to train their models. Certified at signing. Recertified annually. With audit rights. The single most-asked vendor question in healthcare AI evaluation."),
          narration:
            "Clause three. No training on your data. The vendor certifies in writing that your hospital's PHI will not be used to train their models, fine-tune their models, or improve their general AI service. Certified at signing. Recertified annually. With audit rights to verify. This is the single most-asked vendor question in healthcare AI evaluation. The answer needs to be unambiguous in the contract — not in a marketing brochure, not in a verbal assurance during the demo. In writing. With teeth.",
        },
        {
          html: stepCard('shield', 'amber', '4 · Incident notification within 72 hours',
            "Any data breach, model malfunction affecting patient safety, or unauthorised access — the vendor notifies you within 72 hours. Aligned with HIPAA, GDPR, and equivalent regimes. Some jurisdictions require faster — match the strictest applicable."),
          narration:
            "Clause four. Incident notification within seventy-two hours. Any data breach. Any model malfunction that affects patient safety. Any unauthorised access. The vendor notifies you in writing within seventy-two hours. This aligns with HIPAA, GDPR, and equivalent regimes. Some healthcare jurisdictions require faster — twenty-four or forty-eight hours for certain incident categories. Match the strictest applicable regime. The vendor who pushes back on faster notification timelines is the vendor whose discipline is below your hospital's standard.",
        },
        {
          html: stepCard('shield', 'green', '5 · Exit with data return and certified deletion',
            "On exit, all PHI returned to the hospital in a usable format within 30 days. Then deleted from the vendor's systems with written certification. Backup deletion confirmed within 90 days. Standard cloud contract patterns — apply them rigorously in healthcare."),
          narration:
            "Clause five. Exit with data return and certified deletion. On contract exit, all PHI is returned to the hospital in a usable format within thirty days. Then deleted from the vendor's primary systems with written certification of deletion. Backup deletion confirmed within ninety days. These are standard cloud contract patterns — apply them rigorously in healthcare. Healthcare data is among the highest-stakes data the vendor handles. The exit terms need to be unambiguous in writing — not assumed based on general cloud norms.",
        },
        {
          html: stepCard('shield', 'blue', '6 · Post-market surveillance and update notification',
            "For AI that classifies as a medical device, the vendor commits to medical-device post-market surveillance protocols. Issues affecting your population are disclosed transparently. Updates are notified before deployment, not after. The discipline of medical-device regulation."),
          narration:
            "Clause six. Post-market surveillance and update notification — for AI that classifies as a medical device. The vendor commits in writing to medical-device post-market surveillance protocols. Issues affecting your patient population — discovered at other customers — are disclosed to you transparently. Model updates are notified before deployment, not after. This is the discipline of medical-device regulation. Generic software vendors don't operate this way; medical-device vendors do. Confirm in writing that your AI vendor is operating at medical-device discipline if their product is a medical device. The distinction matters legally and operationally.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 7 — regulator posture and clinical governance.</p>`,
      narrationLead:
        "Three anchors before chapter seven — regulator posture and clinical governance.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three PHI patterns, picked per system',
            "Sovereign cloud · on-premise inference · de-identification. Different systems may legitimately use different patterns. Document per system in the PHI policy."),
          narration:
            "One. Three PHI deployment patterns. Sovereign cloud. On-premise inference for the most sensitive workloads. De-identification before AI inference for specific use cases. Different AI systems may legitimately use different patterns. Document the posture per system in the hospital's formal PHI handling policy.",
        },
        {
          html: stepCard('check', 'green', 'Two — Minimum-necessary applied to AI',
            "Scope the data fields · time-bound the data · audit access by user and case. Three applications. All three documented. Reviewed quarterly."),
          narration:
            "Two. Minimum-necessary applied to AI. Three applications. Scope the data fields — not the full patient record. Time-bound the data to what the task needs. Audit access logs by user and by case. All three documented in your policy. Reviewed quarterly by the data protection officer and clinical governance.",
        },
        {
          html: stepCard('check', 'green', 'Three — Six contract clauses, confirmed annually',
            "BAA · data residency · no training on your data · 72-hour incident notification · exit with deletion · post-market surveillance. The GC and DPO confirm annually."),
          narration:
            "Three. Six contract clauses confirmed annually. Business Associate Agreement. Data residency. No training on your data. Seventy-two-hour incident notification. Exit with certified deletion. Post-market surveillance for medical-device AI. Your General Counsel and Data Protection Officer confirm these are in place across your top healthcare AI vendors annually. Minimum.",
        },
      ],
      narrationTrail:
        "Chapter seven — regulator posture and clinical governance. The conversation that determines what you can deploy. See you there.",
    },
  ],
}
