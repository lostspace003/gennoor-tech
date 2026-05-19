import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter02: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-fraud-aml',
  title: 'Fraud detection and AML',
  subtitle: 'Real-time anomaly + reasoning overlay — and the regulator conversation that comes with it.',
  slides: [
    // SLIDE 1
    {
      title: 'Fraud detection and AML',
      iconKey: 'shield',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Fraud and AML are usually the first BFSI AI pattern any bank deploys — for good reason. The math is clear. The technology is mature. And the regulator wants it done. In the next few minutes, what to build, how to govern it, and the conversation to have with your AML officer first.</p>`,
      narrationLead:
        "Welcome to chapter two. Fraud detection and AML. This is usually the first BFSI AI pattern any bank deploys — for very good reasons. The math is clear. The technology is mature. And the regulator wants this work done well. In the next few minutes, what to build, how to govern it, and the conversation to have with your AML officer before vendor selection. Because that conversation determines the deployment.",
    },
    // SLIDE 2
    {
      title: 'The three layers — buy them in order',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · Architecture',
      bodyHtml: `<p>Three layers. Different value. Different complexity. Different regulator expectations. Buy in order — most banks try to start with layer three. Don’t.</p>`,
      narrationLead:
        "Three architectural layers in fraud and AML AI. They are not the same. They have different value. Different complexity. Different regulator expectations. Most banks try to start with the most exciting layer — layer three. Don't. Buy in order. Here are the three.",
      steps: [
        {
          html: stepCard('cog', 'green', 'Layer 1 — Rules and thresholds (you already have this)',
            "Every bank already runs rule-based fraud and AML — transaction limits, velocity rules, sanctions screening. This layer is the foundation. AI doesn't replace it. AI sits on top of it. Make sure the rules are tuned before adding AI."),
          narration:
            "Layer one. Rules and thresholds. Your bank already runs this layer — transaction limits, velocity rules, sanctions screening. This is the foundation. AI doesn't replace this layer — it sits on top. Make sure the rules are well-tuned before adding AI. Many banks have rules that haven't been reviewed in eighteen months. Tuning the rules alone gives you a fifteen to twenty percent improvement in alert quality, before any AI is deployed. Do that first.",
        },
        {
          html: stepCard('cog', 'blue', 'Layer 2 — Statistical anomaly + ML scoring',
            "Pattern deviation. Customer-behaviour scoring. Network analysis on related parties. Pure ML — no LLM needed. This is the workhorse of the play. Most of the genuine fraud-reduction value lives here."),
          narration:
            "Layer two. Statistical anomaly detection plus ML scoring. Pattern deviation from a customer's normal behaviour. Customer behaviour scoring. Network analysis on related parties. This layer is pure ML — no LLM needed. It is the workhorse of the play. And most of the genuine fraud-reduction value lives here. Not in the flashy LLM overlay. In the statistical layer that quietly catches the unusual patterns no human analyst would have time to spot.",
        },
        {
          html: stepCard('cog', 'amber', 'Layer 3 — LLM reasoning overlay',
            "For alerts that pass through the statistical layer, an LLM reads context and proposes an explanation. Investigators triage faster. Beautiful demos live here. Real benefit only after layers 1 and 2 are clean. Don't start here."),
          narration:
            "Layer three. The LLM reasoning overlay. For alerts that have passed through the statistical layer — meaning they are actually unusual — an LLM reads the surrounding context. The customer history. Related transactions. The narrative the alert would represent. And proposes an explanation. Investigators triage faster because they aren't starting from a blank screen. Beautiful demos live here. Real benefit only after layers one and two are clean. Don't start with this layer — it amplifies whatever quality the lower layers produce. If they produce noise, you'll get articulate noise from layer three. Honest order — one, two, three.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The thresholds that move',
        "The classical metric — false-positive rate — is what your AML officer optimises against. A well-deployed AI layer should reduce false positives by 50–70% while increasing true-positive detection by 15–30%. Below those numbers, the deployment is not yet working as expected."),
      calloutNarration:
        "Here's the metric to anchor against. False-positive rate is what your AML officer fights against every quarter. A well-deployed AI layer — layer one plus layer two — should reduce false positives by fifty to seventy percent. While increasing true-positive detection by fifteen to thirty percent. If your deployment numbers are below those bands six months after go-live, the deployment is not yet working as expected. Re-tune. Re-train. Don't accept the underperformance as the steady state. The bands above are what good deployments hit.",
    },
    // SLIDE 3
    {
      title: 'The conversation with your AML officer',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The AML conversation',
      bodyHtml: `<p>Before vendor selection. Three questions. The answers shape the entire deployment — and prevent the most common pattern of AML AI failures.</p>`,
      narrationLead:
        "Before vendor selection. Before scoping. Three questions to ask your AML officer. The answers shape the entire deployment. They also prevent the most common pattern of AML AI failures — which is the AI deploying without the AML officer's genuine ownership.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Question 1 — What false-positive bands keep you defensible?',
            "Your AML officer has a number — typically around 90–95% of current alerts being false positives. They live with it. AI changes that number. They need to be the one who owns where it lands."),
          narration:
            "Question one. What false-positive bands keep you defensible to the regulator? Your AML officer already has a working number — typically ninety to ninety-five percent of current alerts being false positives. They live with that. AI changes the number. They need to be the one who owns where it lands after AI is deployed. Lower is better — but too aggressive, and they lose defensibility if a real case slips through. The trade-off is theirs to make. Make sure they make it explicitly.",
        },
        {
          html: stepCard('search', 'amber', 'Question 2 — Which alert types do you NOT want auto-closed?',
            "Some alert types — typically PEPs, sanctions hits, certain high-risk geographies — your AML officer will not let AI auto-close. Ever. Map those boundaries before vendor selection. They become hard-coded rules in the deployment."),
          narration:
            "Question two. Which alert types do you not want AI to auto-close — under any circumstances? Some alert types — politically exposed persons, sanctions hits, certain high-risk geographies — your AML officer will not allow AI to auto-close. Ever. Even at perfect confidence. Map those boundaries before vendor selection. They become hard-coded rules in the deployment. The vendor's pitch will downplay these boundaries because they reduce automation rate. Ignore the pitch. Listen to your AML officer.",
        },
        {
          html: stepCard('search', 'green', 'Question 3 — What does your last regulator examination say about your alerts?',
            "If your last AML examination flagged specific weaknesses — for example, network analysis or beneficial-ownership tracking — those weaknesses define the AI scope. The AI proposal must close the gaps the examiner already named."),
          narration:
            "Question three. What did your last regulator examination say about your alert system? If your last AML examination flagged specific weaknesses — for example, weak network analysis, poor beneficial-ownership tracking, or insufficient detection of structured transactions — those weaknesses should define the AI scope. The AI proposal must close the gaps the examiner already named. Otherwise you've deployed AI that doesn't address what the regulator told you was the actual problem. That's a bad position to be in at the next examination.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Governance specific to fraud and AML AI',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The overlay',
      bodyHtml: `<p>Three governance items specific to this play. None are optional in a regulated bank.</p>`,
      narrationLead:
        "Three governance items specific to the fraud and AML AI play. None are optional in a regulated bank. Get them in place at deployment — not after.",
      steps: [
        {
          html: stepCard('shield', 'blue', '1 · Model risk management (MRM) compliance',
            "Your bank likely has a Model Risk Management framework — SR 11-7 in the US, equivalents in other jurisdictions. The AI models are subject to it. Independent validation. Annual recalibration. The MRM team needs to be your partner — not a checkpoint."),
          narration:
            "One. Model Risk Management — or MRM — compliance. Your bank likely already has an MRM framework. SR eleven dash seven if you operate in the US. Equivalent frameworks in most other jurisdictions. The AI models you deploy for fraud and AML are subject to that framework. Independent validation. Annual recalibration. Documentation of model assumptions and limitations. Your MRM team needs to be your partner from day one — not a checkpoint at the end. Bring them into the design conversation.",
        },
        {
          html: stepCard('shield', 'amber', '2 · Independent challenger model',
            "For high-tier deployments — fraud detection on retail transactions, AML on cross-border — run an independent challenger model in shadow. Different vendor, different approach. The challenger catches what the primary misses. The regulator will ask if you have one."),
          narration:
            "Two. Independent challenger model. For high-tier deployments — fraud detection on retail transactions, AML on cross-border flows — run an independent challenger model in shadow mode. Different vendor. Different methodological approach. The challenger model catches what the primary model misses, and vice versa. The regulator will eventually ask whether you have a challenger model. The answer should be yes, with a paragraph on what it has caught in the last quarter that the primary missed. That is the evidence of mature deployment.",
        },
        {
          html: stepCard('shield', 'red', '3 · The investigator-time audit trail',
            "Every alert investigation captures — investigator identity, time spent, evidence reviewed, decision rationale. Not just the outcome. The full trail. This is what allows you to prove the human-in-the-loop was real, not a rubber stamp."),
          narration:
            "Three. The investigator time audit trail. Every alert investigation captures the investigator's identity. The time they spent on the alert. The evidence they reviewed. The reasoning behind their decision. Not just the binary outcome — closed or escalated. The full trail. This is what allows you to prove to your regulator that the human-in-the-loop was real. That investigators are reviewing alerts substantively, not rubber-stamping the AI's recommendation. The trail is the proof. Build it as a non-negotiable part of the deployment.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 3 — KYC and onboarding.</p>`,
      narrationLead:
        "Three anchors before we move to KYC and onboarding in chapter three.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three layers in order',
            "Rules → statistical/ML → LLM reasoning. Most value lives in layer two. Don't let a vendor sell layer three first."),
          narration:
            "One. Three architectural layers, in order. Rules. Statistical and ML. LLM reasoning overlay. Most value lives in layer two. Don't let a vendor sell you layer three before layers one and two are clean and tuned.",
        },
        {
          html: stepCard('check', 'green', 'Two — The AML officer owns the trade-offs',
            "False-positive band · auto-close boundaries · regulator-flagged gaps. Three questions, before vendor selection."),
          narration:
            "Two. The AML officer owns the trade-offs. Not the vendor. Not the head of AI. The AML officer. Three questions to ask them — what false-positive band keeps you defensible. Which alert types you do not want auto-closed. And what your last regulator examination said about your alerts. Get answers before vendor selection.",
        },
        {
          html: stepCard('check', 'green', 'Three — MRM, challenger model, audit trail',
            "Three non-negotiable governance items. The bank that has all three at deployment is the bank that breezes through the next examination."),
          narration:
            "Three. Model Risk Management compliance. Independent challenger model in shadow. Investigator time audit trail. Three non-negotiable governance items. The bank that has all three at deployment is the bank that breezes through the next examination on AI-related controls. Build them in. They are not optional.",
        },
      ],
      narrationTrail:
        "Chapter three — KYC and onboarding. The play that compresses customer time-to-yes. See you there.",
    },
  ],
}
