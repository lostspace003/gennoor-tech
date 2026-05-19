import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiHealthcareChapter07: Chapter = {
  courseId: 'ai-in-healthcare',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-regulator-and-clinical-governance',
  title: 'Regulator posture and clinical governance',
  subtitle: 'The two conversations that determine what your hospital can deploy — and how to lead both.',
  slides: [
    // SLIDE 1
    {
      title: 'Regulator posture and clinical governance',
      iconKey: 'shield',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Two conversations determine what your hospital can deploy — and how confidently it can defend the deployments. The regulator conversation, and the internal clinical-governance conversation. Done well, both become enablers. Done badly, both become blockers.</p>`,
      narrationLead:
        "Welcome to chapter seven. Regulator posture and clinical governance. Two conversations determine what your hospital can deploy in AI — and how confidently it can defend the deployments to anyone who asks. The external regulator conversation. And the internal clinical-governance conversation. Done well, both become enablers of the AI programme. Done badly, both become blockers — or worse, sources of incident. In the next few minutes, how to lead both.",
    },
    // SLIDE 2
    {
      title: 'The regulator landscape — what each one expects',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The landscape',
      bodyHtml: `<p>Three regulatory regimes shape most healthcare AI deployments in 2026. Each is converging — slowly — on similar expectations. Knowing them lets you build once and comply broadly.</p>`,
      narrationLead:
        "Three regulatory regimes shape most healthcare AI deployments globally in 2026. They are converging — slowly — on similar expectations. Knowing all three lets you design once and comply broadly. Don't try to perfectly comply with each in isolation. Build to the strictest common denominator.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Regime 1 — FDA SaMD (US)',
            "Software as a Medical Device pathway. Risk-based classification. Pre-market submission for higher-risk classes. Post-market surveillance required. The US framework — and increasingly the reference for other jurisdictions."),
          narration:
            "Regime one. FDA Software as a Medical Device pathway. United States. Risk-based classification — class one, class two, class three by intended use and risk. Pre-market submission required for higher-risk classes. Post-market surveillance required for all classes. This is the US framework — and increasingly the reference framework that other jurisdictions are adopting or adapting. If you operate in or sell into the US, this is the framework your AI vendors must navigate. Understand the basics even if your hospital doesn't operate in the US — many of your vendors do.",
        },
        {
          html: stepCard('shield', 'amber', 'Regime 2 — EU MDR (Europe)',
            "Medical Device Regulation. Conformity assessment by notified body for higher-risk devices. CE marking. Post-market clinical follow-up. Stricter than FDA in several ways — particularly on continuous learning and software updates."),
          narration:
            "Regime two. EU Medical Device Regulation — MDR. Conformity assessment by a notified body for higher-risk devices. CE marking required for market access. Post-market clinical follow-up. The EU MDR is stricter than FDA in several specific ways — particularly on continuous-learning AI and on software update procedures. AI vendors selling into Europe have done the work. If your hospital is in Europe, MDR compliance is your primary regulatory anchor. If you're outside Europe but use European vendors, MDR compliance often appears in your vendor diligence.",
        },
        {
          html: stepCard('shield', 'green', 'Regime 3 — GCC frameworks (UAE, Saudi, others)',
            "SFDA in Saudi. MOHAP and DHA in UAE. Equivalent bodies in other GCC markets. Each has its own AI-in-medical-devices framework, increasingly aligned with FDA and MDR. Local registration required — even for foreign-cleared devices."),
          narration:
            "Regime three. GCC frameworks. SFDA in Saudi Arabia. MOHAP at the UAE federal level, DHA in Dubai, ADPHC in Abu Dhabi. Equivalent bodies in Qatar, Kuwait, Oman, Bahrain. Each has its own framework for AI in medical devices — increasingly aligned with FDA and EU MDR over the last two years. Local registration is required even for devices already cleared in the US or Europe. Don't assume a US clearance translates automatically to a GCC market. Confirm in writing with each vendor for each device per market.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Design to the strictest common denominator',
        "If you operate across multiple jurisdictions, design AI governance to the strictest common denominator across them. Typically that's MDR for medical devices and HIPAA for PHI handling, plus your local sovereignty requirements. Designing once to the strictest standard saves rework when expanding."),
      calloutNarration:
        "Design to the strictest common denominator across the regimes that apply to you. If you operate across multiple jurisdictions — typical for international hospital groups in the GCC — design your AI governance once to the strictest standard, not separately to each. Typically that means EU MDR-style discipline for medical devices, HIPAA-equivalent rigour for PHI handling, plus your local data sovereignty requirements layered on top. Designing once to the strictest standard saves rework when expanding into new markets. And it future-proofs the deployment as other markets gradually align upward.",
    },
    // SLIDE 3
    {
      title: 'The clinical governance committee — three responsibilities',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Internal governance',
      bodyHtml: `<p>Internal clinical-governance review is where deployments earn the right to ship. Three explicit responsibilities for the committee — beyond generic IT or vendor governance.</p>`,
      narrationLead:
        "Internal clinical-governance review is where AI deployments earn the right to ship in your hospital. Three explicit responsibilities for the committee — beyond generic IT or vendor governance. Make these responsibilities visible in the committee's terms of reference. Most hospitals' existing clinical governance committees can take on these responsibilities; some hospitals create a sub-committee specifically for AI.",
      steps: [
        {
          html: stepCard('users', 'blue', '1 · Pre-deployment review of every clinical-touching AI system',
            "Before any AI system that touches clinical workflow goes live, the clinical-governance committee reviews — the intended use, the evidence base, the workflow integration, the bias monitoring, the incident-response plan. Signed off explicitly. Documented in the minutes."),
          narration:
            "Responsibility one. Pre-deployment review of every clinical-touching AI system. Before any AI system that touches clinical workflow goes live in your hospital, the clinical-governance committee reviews — explicitly. The intended use. The evidence base in the literature. The workflow integration design. The bias monitoring framework. The incident-response plan. Signed off explicitly by the committee. Documented in the minutes. This isn't a rubber-stamp review — the committee can and should send proposals back for re-scoping. The pre-deployment review is what protects the deployment from the inside.",
        },
        {
          html: stepCard('users', 'amber', '2 · Quarterly review of in-production AI systems',
            "Each in-production AI system reviewed at least quarterly. Performance against expected benefit. Adverse events. Bias monitoring outcomes. Vendor incident notifications. Tuning decisions ratified at committee. The rhythm that keeps deployments accountable."),
          narration:
            "Responsibility two. Quarterly review of in-production AI systems. Each AI system reviewed by the committee at least quarterly. Performance against the expected benefit defined at pre-deployment. Adverse events involving the system. Bias monitoring outcomes. Vendor incident notifications received in the quarter. Tuning decisions and parameter changes ratified at committee level. The quarterly rhythm is what keeps deployments accountable in steady state. Without it, deployments drift between annual reviews. With it, drift is caught early.",
        },
        {
          html: stepCard('users', 'green', '3 · Incident response oversight',
            "When an AI-related incident occurs — patient safety event, near-miss, vendor disclosure — the clinical-governance committee oversees the investigation, the immediate response, and the lessons-learned process. Independent of the AI deployment team. The discipline that protects everyone."),
          narration:
            "Responsibility three. Incident response oversight. When an AI-related incident occurs — a patient safety event, a near-miss, a vendor disclosure of a model defect, an unexpected outcome pattern — the clinical-governance committee oversees the investigation, the immediate response, and the lessons-learned process. Critically — independent of the AI deployment team. The same independence pattern as the boards course incident response. Independence is what gives the findings credibility. With incidents, the credibility is what determines whether the deployment can resume after remediation.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Building the regulator relationship — three moves',
      iconKey: 'compass',
      eyebrow: 'Lesson 3 · The relationship',
      bodyHtml: `<p>Three moves that shift the regulator from a periodic stressor to a working stakeholder in your AI programme. None expensive. All underused.</p>`,
      narrationLead:
        "Three moves that shift the regulator from a periodic stressor to a working stakeholder in your healthcare AI programme. None of them is expensive. All of them are underused by most hospitals. Try at least the first two within the first quarter of your AI programme.",
      steps: [
        {
          html: stepCard('compass', 'blue', 'Move 1 — Brief the regulator before major deployments',
            "Even when not required by registration, brief your regulator before deploying a major new AI system. A 30-minute informal meeting; a 2-page summary. Almost no hospital does this proactively. Almost every regulator welcomes it."),
          narration:
            "Move one. Brief the regulator before major deployments. Even when not formally required by device registration, brief your healthcare regulator before deploying a major new AI system. A thirty-minute informal meeting where your jurisdiction allows it. A two-page written summary. Almost no hospital does this proactively. Almost every healthcare regulator welcomes the engagement. The relationship transforms after one or two of these briefings. The next regulator examination on AI-related topics is meaningfully calmer than it would otherwise be.",
        },
        {
          html: stepCard('compass', 'amber', 'Move 2 — Participate in regulator-led pilots',
            "Most healthcare regulators now run sandboxes or pilots — particularly on AI. Participate, even when the specific pilot isn't directly relevant to your strategic priorities. Visibility, relationship, and learning are all worth the marginal effort."),
          narration:
            "Move two. Participate in regulator-led pilots and sandboxes. Most healthcare regulators now run sandboxes or pilots — particularly on AI in clinical care. Participate when the opportunity arises, even when the specific pilot isn't directly relevant to your strategic priorities. The visibility, the relationship, and the operational learning are all worth the marginal effort. The hospitals that participate are the hospitals the regulator turns to when they're shaping new guidance. The hospitals that don't participate find out about the new guidance when it's published — and then have to react under timeline pressure.",
        },
        {
          html: stepCard('compass', 'green', 'Move 3 — Annual written AI briefing to the regulator',
            "Once a year, send your regulator a 5-page written briefing on your healthcare AI portfolio. Major deployments, adverse events and resolutions, forward plans. Almost no hospital does this. The regulators who receive these briefings remember them — and them at examination time."),
          narration:
            "Move three. Annual written AI briefing to the regulator. Once a year — typically before the annual examination cycle in your jurisdiction — send your regulator a five-page written briefing on your hospital's healthcare AI portfolio. Major deployments completed and planned. Adverse events and how they were resolved. The forward plan for the next year. Almost no hospital does this proactively. The regulators who receive these briefings remember them positively. And remember them positively at examination time. The cost is one document a year. The compounding benefit across the relationship is significant.",
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
          html: stepCard('check', 'green', 'One — Design to the strictest common denominator',
            "FDA SaMD · EU MDR · GCC frameworks. Converging. Design once to the strictest. Avoid the rework of designing separately to each."),
          narration:
            "One. Design to the strictest common denominator across the regimes that apply. FDA SaMD. EU MDR. GCC frameworks. Each is converging slowly toward similar expectations. Design once to the strictest standard — typically MDR plus HIPAA-equivalent — and you save rework when expanding into new markets.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three clinical-governance responsibilities, explicit',
            "Pre-deployment review · quarterly in-production review · incident response oversight. Visible in the committee's terms of reference. Documented in the minutes."),
          narration:
            "Two. Three explicit clinical-governance committee responsibilities. Pre-deployment review of every clinical-touching AI system. Quarterly review of in-production systems. Incident response oversight, independent of the AI deployment team. Make these visible in the committee's terms of reference. Documented in the minutes. The discipline is what protects deployments from inside the hospital.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three regulator-relationship moves',
            "Brief before deployments · participate in pilots · annual written briefing. Underused. Each one cheap. The relationship compounds across years."),
          narration:
            "Three. Three regulator-relationship moves. Brief before major deployments. Participate in regulator-led pilots. Send an annual written briefing. Each one is underused by most hospitals. Each one is cheap. The relationship compounds across years. The regulator who knows your AI programme is the regulator whose examination, when it happens, lands into a calm conversation rather than a surprise.",
        },
      ],
      narrationTrail:
        "Final chapter — your hospital AI roadmap on one page. Where everything we've covered lands as something executive leadership can adopt. See you there.",
    },
  ],
}
