import type { Chapter } from './_types.ts'
import { stepCard, calloutBlock } from './_types.ts'

export const aiFoundationsChapter04: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-privacy-risk',
  title: 'Privacy, risk, and the things to watch',
  subtitle: 'AI tools aren’t a black hole — but they aren’t private either.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'Privacy, risk, and the things to watch',
      iconKey: 'shield',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">AI tools aren&rsquo;t a black hole — but they aren&rsquo;t private either. In the next few minutes, we&rsquo;ll cover the <em>data categories</em> that should never enter a public AI tool, three specific <em>bias risks</em> with real-world examples, and the four <strong>questions to ask</strong> before deploying AI in any sensitive workflow.</p>`,
      narrationLead:
        "Hi, and welcome to chapter four. This one's about privacy, risk, and the things to watch when you start using AI at work. Here's the framing. AI tools are not a black hole — but they are not private, either. So in the next few minutes, we'll cover the data categories that should never enter a public AI tool. Three specific bias risks — with real-world examples. And the four questions to ask before deploying AI in any sensitive workflow. Let's get into it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — What happens to data you paste
    // ──────────────────────────────────────────────────────
    {
      title: 'What happens to data you paste',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · Where your data goes',
      bodyHtml: `<p>When you use the <em>free or consumer</em> version of ChatGPT, Gemini, or Claude — your prompts may be stored, reviewed by human raters for quality, and (depending on the provider&rsquo;s policies) used to improve future models. That doesn&rsquo;t mean a stranger reads them at lunch — but it does mean your data is <strong>no longer fully under your control</strong>.</p>
      <p>Enterprise versions — Microsoft 365 Copilot, ChatGPT Enterprise, Claude for Work, the Azure OpenAI Service — generally do <em>not</em> train on your data, and they offer contractual guarantees about isolation. If you&rsquo;re unsure which version your organisation uses — <strong>ask IT before pasting anything sensitive</strong>.</p>`,
      narrationLead:
        "Let's start with what actually happens to the data you paste into an AI tool. When you use the free or consumer version of ChatGPT — or Gemini, or Claude — your prompts may be stored. They may be reviewed by human raters for quality. And depending on the provider's policies, they may be used to improve future models. Now — that doesn't mean a stranger is reading your prompts at lunch. But it does mean your data is no longer fully under your control. Enterprise versions are different. Microsoft 365 Copilot. ChatGPT Enterprise. Claude for Work. The Azure OpenAI Service. These generally do not train on your data, and they offer contractual guarantees about isolation. So if you're unsure which version your organisation uses — ask IT. Before pasting anything sensitive.",
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'The default assumption',
        'If you don&rsquo;t know whether your AI tool is the enterprise version — <strong>assume it isn&rsquo;t</strong>. Treat it like a public chat tool. That mental model keeps you safe even when you&rsquo;re wrong about the tool.'),
      calloutNarration:
        "Here's the default assumption I want you to walk away with. If you don't know whether your AI tool is the enterprise version — assume it isn't. Treat it like a public chat tool. That mental model keeps you safe, even when you're wrong about the tool. Better to over-protect than to find out the hard way.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — Three categories that should NEVER enter public AI
    // ──────────────────────────────────────────────────────
    {
      title: 'Three categories that should never enter a public AI tool',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The no-go list',
      bodyHtml: `<p>Some data is fine to paste. Some isn&rsquo;t. Three categories that are <em>never</em> okay in a public AI tool — no matter how good the prompt or how short the conversation.</p>`,
      narrationLead:
        "Now — some data is perfectly fine to paste into AI. Some really isn't. Let me give you three categories that are never okay in a public AI tool. No matter how good the prompt is. No matter how short the conversation is. These are hard lines.",
      steps: [
        {
          html: stepCard('x', 'red', 'PII · Personally Identifiable Information',
            "Names with phone numbers. Addresses. Government IDs — Aadhaar, Emirates ID, SSN. Passport numbers. Dates of birth. Medical histories tied to a person. And watch the combinations — name + employee ID + salary band becomes PII <em>when combined</em>, even if each field looks mundane on its own."),
          narration:
            "Category one — Personally Identifiable Information. PII. Names with phone numbers. Addresses. Government IDs — Aadhaar, Emirates ID, Social Security Number. Passport numbers. Dates of birth. Medical histories tied to a person. And watch out for combinations. Name plus employee ID plus salary band becomes PII when combined — even if each field looks mundane on its own. The combination is the risk.",
        },
        {
          html: stepCard('x', 'red', 'Confidential business information',
            "Unannounced strategy. M&amp;A targets. Customer lists. Pricing playbooks. Source code marked confidential. Contracts under NDA. Draft legal arguments. <strong>The test</strong> — if it would embarrass you to see it on a competitor&rsquo;s slide deck, it doesn&rsquo;t go into a public AI tool."),
          narration:
            "Category two — confidential business information. Unannounced strategy. M and A targets. Customer lists. Pricing playbooks. Source code marked confidential. Contracts under NDA. Draft legal arguments. Here's the test I want you to use. If it would embarrass you to see it on a competitor's slide deck — it doesn't go into a public AI tool. That's the line.",
        },
        {
          html: stepCard('x', 'red', 'Regulated data',
            "PHI — protected health information. CHD — cardholder data under PCI. Client identifiers under financial-services rules — RBI, SAMA, ADGM. Classified data. And anything under specific regional regimes — Saudi PDPL, India DPDP, EU GDPR. These categories carry <em>legal consequences</em> for unauthorised exposure."),
          narration:
            "Category three — regulated data. PHI, which is protected health information. CHD — cardholder data under PCI. Client identifiers under financial-services regulations — RBI, SAMA, ADGM. Classified data. And anything covered by specific regional regimes — Saudi PDPL, India DPDP, EU GDPR. These categories are different from the first two — they carry actual legal consequences for unauthorised exposure. So this isn't just &lsquo;best practice&rsquo;. It's the law.",
        },
      ],
      calloutHtml: calloutBlock('check', 'tip', 'What to do instead',
        'For sensitive workflows — (1) use your organisation&rsquo;s enterprise AI tool, (2) anonymise data before pasting — replace real names with &lsquo;Person A&rsquo;, real numbers with [REDACTED], or (3) ask IT for the right tool. <strong>The friction is worth it.</strong>'),
      calloutNarration:
        "So what do you actually do instead? Three options. One — use your organisation's enterprise AI tool, the one with the contractual guarantees. Two — anonymise the data before pasting. Replace real names with &lsquo;Person A&rsquo;, &lsquo;Person B&rsquo;. Replace real numbers with the word REDACTED in brackets. Three — ask IT for the right tool. Yes — all three options involve more friction than just pasting it in. But the friction is worth it. Every single time.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — Bias risk
    // ──────────────────────────────────────────────────────
    {
      title: 'Bias risk — three scenarios that matter at work',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · How bias shows up',
      bodyHtml: `<p>AI rarely <em>creates</em> bias. It usually <strong>amplifies</strong> bias that&rsquo;s already in your historical data — and it does so at scale. Three real-world scenarios worth knowing about.</p>`,
      narrationLead:
        "Alright — let's talk about bias. Here's the thing I want you to understand up front. AI rarely creates new bias. What it does is amplify bias that's already in your historical data. And it does so at scale, fast. Let me give you three real-world scenarios that show how this plays out at work.",
      steps: [
        {
          html: stepCard('users', 'amber', 'Scenario one — AI in hiring',
            "You use AI to screen resumes. Six months in, you notice — the candidates AI ranks highest are disproportionately from a small set of universities and a narrow demographic. This isn&rsquo;t the AI being malicious. It&rsquo;s the AI learning from your <em>historical hiring data</em> — which already had bias baked in. The AI didn&rsquo;t introduce the bias. It <strong>amplified</strong> it."),
          narration:
            "Scenario one — AI in hiring. You use AI to screen resumes. Six months in, you notice something. The candidates AI ranks highest are disproportionately from a small set of universities. And a narrow demographic. Now — this isn't the AI being malicious. It's the AI learning from your historical hiring data. Which already had bias baked into it. The AI didn't introduce the bias. It amplified it. And it amplified it at scale.",
        },
        {
          html: stepCard('users', 'amber', 'Scenario two — AI in customer service',
            "A multilingual chatbot trained primarily on English handles English customers well — and Arabic customers poorly. Response quality drops. CSAT drops. And the drop is concentrated in <em>Arabic-speaking markets</em> — which means the bias has a regional, arguably ethnic, dimension. If you measure CSAT only at the aggregate, you miss this entirely."),
          narration:
            "Scenario two — AI in customer service. A multilingual chatbot — trained primarily on English. Handles English customers well. Handles Arabic customers poorly. Response quality drops. Customer satisfaction drops. And here's the part that matters — the drop is concentrated in Arabic-speaking markets. Which means the bias has a regional dimension. Arguably an ethnic dimension. And if you measure CSAT only at the aggregate level — you miss this entirely. The aggregate looks fine. The cohort doesn't.",
        },
        {
          html: stepCard('users', 'amber', 'Scenario three — AI in lending',
            "An AI credit-scoring model uses zip code as a feature. Zip code correlates with race in many countries — even when race itself isn&rsquo;t used. The model produces a score that <em>looks</em> neutral but disproportionately rejects applicants from certain neighbourhoods. This is the classic <strong>proxy variable</strong> problem — and BFSI regulators take it seriously."),
          narration:
            "Scenario three — AI in lending. An AI credit-scoring model uses zip code as one of its features. Sounds harmless. But zip code correlates with race in many countries — even when race itself is not directly used. So the model produces what looks like a neutral score — but it disproportionately rejects applicants from certain neighbourhoods. This is the classic proxy variable problem. The model doesn't &lsquo;know&rsquo; about race. It uses zip code. And zip code does the work. Regulators in banking and financial services take this very seriously. So should you.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — The 4 questions
    // ──────────────────────────────────────────────────────
    {
      title: 'The 4 questions to ask before deploying',
      iconKey: 'search',
      eyebrow: 'Lesson 4 · Before you deploy',
      bodyHtml: `<p>Before AI goes into any sensitive workflow — hiring, lending, healthcare, customer treatment — run it through these four questions. If you can&rsquo;t answer all four crisply, you&rsquo;re not ready to deploy.</p>`,
      narrationLead:
        "Okay — last lesson of this chapter. Before AI goes into any sensitive workflow — hiring, lending, healthcare, how you treat customers — I want you to run it through four questions. And here's the rule. If you can't answer all four crisply, you're not ready to deploy. It's that simple.",
      steps: [
        {
          html: stepCard('search', 'blue', 'What data is going in?',
            "PII? Confidential? Regulated? Or none of the above? You can&rsquo;t answer the next three questions without first <em>naming</em> what&rsquo;s flowing through the system."),
          narration:
            "Question one. What data is going in? PII? Confidential business data? Regulated data? Or none of the above? You can't answer the next three questions without first naming what's flowing through the system. So start here. Always.",
        },
        {
          html: stepCard('search', 'blue', 'What decision is being influenced?',
            "Hiring. Lending. Healthcare. How customers get treated. These are <strong>high-stakes</strong> — and they need extra care. The higher the stakes, the more rigorous everything downstream needs to be."),
          narration:
            "Question two. What decision is being influenced? Hiring. Lending. Healthcare. How customers get treated. These are high-stakes decisions. And they need extra care. Here's the principle — the higher the stakes of the decision, the more rigorous everything downstream needs to be. Match the rigour to the stakes.",
        },
        {
          html: stepCard('search', 'blue', 'Who reviews the AI output?',
            "Is there a <em>human in the loop</em> with veto power? Or does the AI&rsquo;s output flow directly to action? If it&rsquo;s the latter, in a high-stakes workflow, that&rsquo;s usually a design flaw — not a feature."),
          narration:
            "Question three. Who reviews the AI output? Is there a human in the loop — with actual veto power? Or does the AI's output just flow directly into action? In a high-stakes workflow, if the answer is &lsquo;flows directly into action&rsquo; — that's usually a design flaw. Not a feature. Find the human. Give them real authority.",
        },
        {
          html: stepCard('search', 'blue', 'How do we detect when it goes wrong?',
            "What&rsquo;s the monitoring plan? What&rsquo;s the appeals process? What&rsquo;s the audit trail? Every AI system gets things wrong sometimes — the only question is <strong>whether you&rsquo;ll know</strong>."),
          narration:
            "Question four. How do we detect when it goes wrong? What's the monitoring plan? What's the appeals process — for the people affected by AI decisions? What's the audit trail? Because every AI system gets things wrong sometimes. The only question is — whether you'll know. And whether you can fix it before the damage compounds. So design for failure. Up front.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 4',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Public AI tools may store and train on your prompts — use enterprise versions for any sensitive workflow.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Never paste PII, confidential business data, or regulated data into a tool you&rsquo;re not sure about.</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>AI rarely creates new bias — it amplifies bias that&rsquo;s already in your historical data, at scale.</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Before any high-stakes deployment — answer four questions: what data · what decision · who reviews · how do we detect when it goes wrong.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up chapter four. Four takeaways. Number one. Public AI tools may store and train on your prompts. So use enterprise versions for any sensitive workflow. Number two. Never paste PII, confidential business data, or regulated data into a tool you're not sure about. When in doubt — don't. Number three. AI rarely creates new bias. It amplifies the bias that's already in your historical data — and it does so at scale, quickly. Watch for it. And number four. Before any high-stakes deployment, answer four questions. What data is going in. What decision is being influenced. Who reviews the output. And how do we detect when it goes wrong. In chapter five — we'll cover how to evaluate AI claims and tools when vendors come knocking. See you there.",
    },
  ],
}
