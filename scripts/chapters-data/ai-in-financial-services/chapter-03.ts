import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter03: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-kyc-and-onboarding',
  title: 'KYC and onboarding',
  subtitle: 'The play that compresses customer time-to-yes — without compromising controls.',
  slides: [
    // SLIDE 1
    {
      title: 'KYC and onboarding',
      iconKey: 'rocket',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Customer time-to-yes is now a competitive variable. The bank that takes three days loses applications to the bank that takes thirty minutes. AI compresses KYC and onboarding aggressively — without compromising the controls regulators expect. This chapter shows how.</p>`,
      narrationLead:
        "Welcome to chapter three. KYC and onboarding. Customer time-to-yes has become a competitive variable in retail banking, NBFC lending, and digital banking across the GCC, India, and Africa. The bank that takes three days loses applications to the bank that takes thirty minutes. AI compresses KYC and onboarding aggressively — without compromising the controls regulators expect. In the next few minutes, how to build it, where the risks sit, and the operating rhythm that keeps it shippable.",
    },
    // SLIDE 2
    {
      title: 'What the AI onboarding stack actually does',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The stack',
      bodyHtml: `<p>Four components. They work together. Skipping any one weakens the control posture more than the time savings make up for.</p>`,
      narrationLead:
        "Four components in a modern AI-driven onboarding stack. They work together. Skipping any one weakens the control posture more than the time savings make up for. Each one is mature technology now — but each one needs to be deployed with regulator awareness.",
      steps: [
        {
          html: stepCard('cog', 'green', '1 · Document AI for ID, proof, and statements',
            "Reads passports, national IDs, utility bills, bank statements. Multi-language, multi-format. Returns structured data with confidence scores. The foundation of any AI-driven onboarding."),
          narration:
            "Component one. Document AI for identification documents, proof of address, and financial statements. Reads passports. National IDs. Utility bills. Bank statements from other banks for income verification. Multi-language, multi-format. Returns structured data with per-field confidence scores. This is the foundation of any AI-driven onboarding stack. Without it, you're still scanning and rekeying — which is precisely what AI is here to eliminate.",
        },
        {
          html: stepCard('cog', 'blue', '2 · Identity verification with liveness',
            "Facial recognition match between the ID photo and a live selfie. Liveness check to defeat photo-of-a-photo attacks. Critical in remote-onboarding markets — India, GCC retail digital, African mobile banking."),
          narration:
            "Component two. Identity verification with liveness checking. A facial recognition match between the ID document photo and a live selfie. A liveness check to defeat photo-of-a-photo and screen-replay attacks. This is critical in remote-onboarding markets — Indian digital lending, GCC retail digital onboarding, African mobile banking. The vendor landscape here is well-developed. The question is calibration — what false-rejection rate is your customer experience team willing to live with. Below one percent is the operational target for retail.",
        },
        {
          html: stepCard('cog', 'amber', '3 · Risk scoring and screening',
            "Sanctions, PEP, adverse-media screening. AML risk scoring based on the customer profile. The output is a risk tier that determines what additional review is needed. AI improves both speed and the false-positive rate."),
          narration:
            "Component three. Risk scoring and screening. Sanctions screening. Politically-exposed-person screening. Adverse-media screening. AML risk scoring based on the customer profile — country, occupation, declared source of funds, expected transaction patterns. The output is a risk tier that determines what additional review the application needs. AI improves both speed and false-positive rate here — but the screening lists themselves still come from the standard sanctioned-entity feeds. AI doesn't replace those feeds. AI processes them faster.",
        },
        {
          html: stepCard('cog', 'red', '4 · Underwriter copilot for edge cases',
            "When automation can't close — and 10–15% of applications always need human review — an LLM copilot pulls together the customer file, the screening results, and proposed next steps. The underwriter approves or escalates. The 10% case is where the customer experience can still feel slow if you don't address it."),
          narration:
            "Component four. The underwriter copilot for edge cases. Roughly ten to fifteen percent of applications cannot be closed by automation alone. Adverse media. Unusual source-of-funds. PEP relationships. Complex corporate structures. When automation can't close, an LLM copilot pulls together the customer file, the screening results, and proposed next steps for the underwriter. The underwriter approves or escalates. The ten to fifteen percent case is where the customer experience can still feel slow — if you don't deliberately address it. Underwriter copilots cut the dwell time on these cases by sixty to seventy percent. That's the difference between a four-hour wait and a four-day wait.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The end-to-end metric',
        "<strong>P95 time-to-decision</strong> is the right metric. Not average. P95. Because customers remember the slow ones, not the fast ones. Target — under 4 hours for retail, under 24 hours for SMB, under 5 days for commercial. AI shifts P95 dramatically."),
      calloutNarration:
        "Here's the right metric. P-ninety-five time to decision. Not the average. The P-ninety-five. Because customers remember the slow applications, not the fast ones. The slow ones become the negative reviews and the LinkedIn complaints. Target — under four hours for retail. Under twenty-four hours for SMB. Under five days for commercial. AI shifts P-ninety-five dramatically — far more than it shifts the average. Track the P-ninety-five every week. It's the honest measure of whether the onboarding stack is actually working at the customer experience level.",
    },
    // SLIDE 3
    {
      title: 'The sovereignty question — non-negotiable in 2026',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · Data residency',
      bodyHtml: `<p>Customer identity documents are now the most sensitive data category in many jurisdictions. The deployment pattern has to address residency explicitly — at design time, not after.</p>`,
      narrationLead:
        "The sovereignty question. Customer identity documents — passports, national IDs, biometric data — are now the most sensitive data category in many jurisdictions. The deployment pattern has to address residency explicitly at design time. Not after. Three patterns to know — and choose between deliberately.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Pattern A — Sovereign cloud',
            "Azure UAE, Azure Saudi, Azure India Central — sovereign cloud regions designed for regulated workloads. The inference and the data both stay onshore. Used by most major GCC and Indian banks for retail onboarding."),
          narration:
            "Pattern A. Sovereign cloud. Azure UAE. Azure Saudi. Azure India Central. Equivalent regions in Singapore, Hong Kong, and other regulated markets. These are sovereign cloud regions designed specifically for regulated workloads. The inference and the customer data both stay onshore. This is the pattern most major GCC banks and most Indian retail banks are using for onboarding workloads today. Procurement is mature. Pricing is well understood. The regulatory conversation is straightforward — but doesn't skip it.",
        },
        {
          html: stepCard('shield', 'amber', 'Pattern B — On-premise inference',
            "For the most sensitive jurisdictions or highest-tier use cases, run the inference on-premise. Open-source models (Llama, Mistral) hosted in your data centre. Slower iteration on model improvements — but uncontested data residency."),
          narration:
            "Pattern B. On-premise inference. For the most sensitive jurisdictions — or for the highest-tier use cases like high-value commercial onboarding — run the inference on-premise. Open-source models like Llama, Mistral, or Qwen hosted in your own data centre. Slower iteration on model improvements compared to sovereign cloud — but uncontested data residency. Some central banks are now explicitly asking for this pattern for certain workloads. Have a plan for it, even if you're not using it today.",
        },
        {
          html: stepCard('shield', 'green', 'Pattern C — Hybrid with PII tokenisation',
            "Sensitive PII tokenised before inference. The model sees structure, not the underlying personal data. The token-to-value mapping lives onshore. Allows use of frontier models for non-PII reasoning while keeping the PII bounded."),
          narration:
            "Pattern C. Hybrid with PII tokenisation. Sensitive personally-identifiable information is tokenised before it ever reaches the inference layer. The model sees the structure of the application — the relationships, the patterns, the document types — but not the underlying personal data itself. The token-to-value mapping lives onshore and never leaves. This pattern allows you to use frontier models — typically more capable than what you can host onshore — while keeping the PII bounded. It is the most sophisticated pattern of the three. It is also the pattern that gives you the best balance of capability and residency. Worth understanding even if you don't deploy it first.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three failure modes specific to onboarding AI',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Failure modes',
      bodyHtml: `<p>Three failure modes. Each one is preventable — if you know to design for it before deployment.</p>`,
      narrationLead:
        "Three failure modes specific to onboarding AI. Each one is preventable. Each one has cost a bank a real quarter of recovery work. Design for them before deployment.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Biased verification across demographics',
            "Facial recognition has documented bias across skin tone and age groups. Without outcome monitoring by group, the bias deploys silently. Monitor false-rejection rate by group from week one. Re-tune when gaps appear."),
          narration:
            "Failure one. Biased verification across demographics. Facial recognition has documented bias across skin tone, age, and in some cases gender. Without outcome monitoring broken down by demographic group, that bias deploys silently into your onboarding system. The result is a meaningful difference in false-rejection rates between groups — a class of customers being asked to redo their selfie three times while others succeed first time. Monitor false-rejection rate by group from week one. Re-tune when gaps appear. The regulator will eventually look at this. Better to be ahead of it.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Adverse-media false positives at scale',
            "Common-name applicants get flagged because someone with the same name was once in adverse media. Without smart entity resolution, the false-positive rate kills the customer experience for whole demographic groups. Invest in entity resolution as much as in detection."),
          narration:
            "Failure two. Adverse-media false positives at scale. Common-name applicants get flagged because someone with the same name — possibly in a different country, possibly decades ago — was once mentioned in adverse media. Without smart entity resolution that disambiguates by birthdate, geography, and other identifiers, the false-positive rate on adverse media kills the customer experience for whole demographic groups — anyone with a common name in that culture. Invest in entity resolution as much as you invest in detection. They are equally important.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Edge-case backlog',
            "If 12% of applications need underwriter review and you've cut the team to 30% of its original size — the edge cases pile up. Don't right-size the underwriter team to the new automation rate until you've measured the actual edge-case volume for three months."),
          narration:
            "Failure three. Edge-case backlog. If twelve percent of applications need underwriter review and you've cut the underwriter team to thirty percent of its original size in anticipation of automation — the edge cases pile up. The customer experience on the edge cases becomes worse than it was before AI was deployed. Don't right-size the underwriter team to the new automation rate until you've measured the actual edge-case volume in steady state — typically three months in. The temptation to cut early is real. Resist it. The underwriters are now your specialists — losing them at the wrong moment is expensive.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 4 — credit scoring and underwriting.</p>`,
      narrationLead:
        "Three anchors before we move to credit scoring and underwriting in chapter four.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four components, one stack',
            "Document AI · identity verification · risk screening · underwriter copilot. Each one needs to be deployed; skipping any weakens the control posture more than it speeds onboarding."),
          narration:
            "One. Four components, one stack. Document AI. Identity verification with liveness. Risk scoring and screening. Underwriter copilot for edge cases. Each one needs to be deployed. Skipping any of them weakens the control posture more than it speeds onboarding.",
        },
        {
          html: stepCard('check', 'green', 'Two — P95 time-to-decision is the metric',
            "Not the average. The P95. Because customers remember the slow ones. Target — under 4 hours retail, under 24 hours SMB, under 5 days commercial."),
          narration:
            "Two. P-ninety-five time to decision is the metric. Not the average. The P-ninety-five. Because customers remember the slow applications, not the fast ones. Target bands — under four hours for retail, under twenty-four hours for SMB, under five days for commercial.",
        },
        {
          html: stepCard('check', 'green', 'Three — Address sovereignty at design time',
            "Sovereign cloud · on-premise inference · hybrid with PII tokenisation. Pick deliberately. Retrofitting residency after deployment is expensive."),
          narration:
            "Three. Address data sovereignty at design time. Three patterns — sovereign cloud, on-premise inference, hybrid with PII tokenisation. Pick deliberately, with the regulator in the conversation. Retrofitting residency after deployment is expensive and painful.",
        },
      ],
      narrationTrail:
        "Chapter four — credit scoring and underwriting. Where AI moves from operations into a regulated decision. See you there.",
    },
  ],
}
