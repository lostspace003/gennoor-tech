import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter05: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-knowledge-ai',
  title: 'Knowledge base AI — without hallucinated policies',
  subtitle: 'Three grounding disciplines · citation patterns customers can verify · the KB-quality reality that decides whether any of this works.',
  slides: [
    // SLIDE 1
    {
      title: 'Knowledge base AI — without hallucinated policies',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Knowledge AI is the silent CSAT lever — done well, customers get accurate answers in seconds. Done badly, the bot hallucinates a refund policy and the screenshot reaches social media. Three disciplines decide which experience you ship.</p>`,
      narrationLead:
        "Welcome to chapter five. Knowledge base AI without hallucinated policies. Knowledge AI is the silent customer satisfaction lever for most contact centres. Done well, customers get accurate answers in seconds and agents have policy lookups that take three seconds instead of three minutes. Done badly, the AI confidently hallucinates a refund policy or a service-level commitment your company never made, the customer screenshots it, and it reaches social media within a day. Several large brands have had this exact event in 2024 and 2025. Three disciplines decide which version of the experience you ship. Plus the underlying knowledge-base quality reality that decides whether any of this works at all.",
    },
    // SLIDE 2
    {
      title: 'Three grounding disciplines',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · The disciplines',
      bodyHtml: `<p>Three non-negotiable disciplines. Each one alone is insufficient. Together they keep the AI bounded to your actual knowledge — and produce the trusted answer surface customers and agents both rely on.</p>`,
      narrationLead:
        "Three non-negotiable grounding disciplines. Each discipline alone is insufficient — most hallucinated-policy incidents at major brands traced to deployments that had one or two of the three in place but not all three. Together the three keep the AI bounded to your actual knowledge base content and produce the trusted answer surface that customers and agents both rely on.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Discipline 1 — Retrieval-only architecture, no parametric knowledge',
            "The AI answers only from content it just retrieved from your KB at query time. It does not answer from what it learned during training. If retrieval returns nothing relevant, the AI says 'I don't know' — not a confident guess from training memory."),
          narration:
            "Discipline one. Retrieval-only architecture, no parametric knowledge. The AI answers exclusively from the knowledge base content it just retrieved at query time. It does not answer from what the underlying language model learned during training. If the retrieval step returns nothing relevant, the AI says I don't know — it does not produce a confident guess from training memory. This is the critical configuration. Most hallucinated-policy events trace to deployments where the model was allowed to fall back to parametric knowledge when retrieval failed. The fallback always produces a confident-sounding wrong answer. Configure your tool to refuse parametric fallback. Verify it refuses in production tests before launch.",
        },
        {
          html: stepCard('shield', 'green', 'Discipline 2 — Mandatory citation to source',
            "Every answer is paired with an explicit citation to the source KB article. Customer-facing — citation appears as 'Source: Article title' with a working link. Agent-facing — citation appears as an article reference the agent can verify. No citation, no publish."),
          narration:
            "Discipline two. Mandatory citation to source for every answer. Customer-facing — the citation appears as Source colon article title with a working link the customer can click to verify. Agent-facing — the citation appears as an article reference the agent can verify by clicking through during the conversation. No answer ships without an explicit citation. If the AI cannot produce a citation, it cannot produce the answer. This discipline does two things. It lets customers verify the policy claim if they want to, which is itself a trust signal. And it lets the agent or the customer catch the rare retrieval mismatch where the AI cited the wrong article — much easier to spot when the citation is visible than when it's hidden. Configure mandatory citations. Verify they ship to production.",
        },
        {
          html: stepCard('shield', 'green', 'Discipline 3 — Refusal patterns when uncertain',
            "When the AI's retrieval confidence is below threshold, it refuses to answer and routes to a human or to KB search. The cost of an explicit 'I don\'t know' is small. The cost of a confident hallucination is asymmetric."),
          narration:
            "Discipline three. Explicit refusal patterns when uncertain. When the retrieval confidence is below threshold — meaning the system isn't sure the retrieved content actually answers the question — the AI refuses to answer and routes the customer to a human agent or to the broader knowledge base search. The cost of an explicit I don't know let me get you to someone who can help is small — customers tolerate this well, especially when the handoff is fast. The cost of a confident hallucination is asymmetric and shows up in social media screenshots and regulator complaints. Calibrate the confidence threshold during the pilot phase. Lean toward more refusals rather than fewer; tune toward fewer refusals only after the deployment is mature and the team has confidence in the retrieval quality.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'The discipline that fails first',
        "Discipline 1 — retrieval-only architecture. Vendor demos with 'enhanced answers that combine your KB with general knowledge' are exactly this failure waiting to happen. Configure retrieval-only. Refuse vendor pitches that don't support it."),
      calloutNarration:
        "The discipline that fails first across deployments. Discipline one — retrieval-only architecture. The vendor demo invariably shows a feature called something like enhanced answers that combine your knowledge base with the model's general knowledge. That feature is exactly the hallucinated-policy failure mode in marketing language. Configure your deployment to retrieval-only with parametric fallback disabled. Refuse vendor pitches for tools that don't support this configuration. Several of the public hallucinated-policy events in 2024 and 2025 occurred because teams trusted vendor marketing language about combined knowledge sources without understanding it meant the model would invent answers when retrieval failed. Verify the configuration before launch.",
    },
    // SLIDE 3
    {
      title: 'The KB-quality reality',
      iconKey: 'search',
      eyebrow: 'Lesson 2 · The reality',
      bodyHtml: `<p>The brutal truth — most knowledge bases aren't ready for AI grounding. Three quality checks decide whether your KB is ready or whether you need a quarter of cleanup first.</p>`,
      narrationLead:
        "The brutal truth about knowledge base AI. Most knowledge bases in production today were written for human agents to interpret with judgment — not for AI systems to retrieve and quote literally. The quality bar is different. Three checks decide whether your knowledge base is ready for AI grounding or whether you need a quarter of cleanup work first before the AI deployment can succeed. Run the checks honestly; the cleanup is cheaper than the rollback.",
      steps: [
        {
          html: stepCard('search', 'amber', 'Check 1 — Are articles atomic and single-purpose?',
            "AI grounds best on articles that answer one specific question. KBs full of long multi-topic articles — common in older Zendesk and Salesforce KBs — produce mixed retrieval. Restructure to atomic articles or accept lower retrieval quality."),
          narration:
            "Check one. Are articles atomic and single-purpose? AI retrieval grounds best on articles that answer one specific customer question — for example, how do I reset my password, or what's our refund policy for orders over thirty days. Knowledge bases full of long multi-topic articles — common in older Zendesk, Salesforce, and ServiceNow knowledge bases — produce mixed retrieval where the AI retrieves an article that contains the right answer but also five other things, leading to confused responses. The fix is to restructure into atomic single-purpose articles. This is significant content work — typically a quarter for a mid-sized contact centre — but it is the single highest-impact investment for knowledge AI quality. Alternative path — accept lower retrieval quality and tune the model to extract the relevant section. Atomic restructuring produces meaningfully better outcomes.",
        },
        {
          html: stepCard('search', 'amber', 'Check 2 — Is policy authoritatively versioned?',
            "When the policy changes, every relevant article must update on the same day. Stale articles with old policies — common in large orgs — produce confidently-wrong AI answers. The KB needs a policy-ownership model that updates rigorously."),
          narration:
            "Check two. Is policy authoritatively versioned? When a customer-facing policy changes — for example, the refund window extends from thirty to sixty days — every relevant article in the knowledge base must update on the same day. Stale articles with old policies are common in large organisations where policy owners and knowledge-base owners are different people with different timelines. The AI will retrieve and confidently quote the stale article, producing customer commitments that are no longer your actual policy. This is operationally a problem on day one, regulatorily a problem in week two when a customer complains and you can't honour what the AI told them. The fix — a policy-ownership model where policy changes trigger required knowledge-base updates on the same day, with a verification step. The discipline is operational, not technical.",
        },
        {
          html: stepCard('search', 'amber', 'Check 3 — Is there a content-quality maintenance rhythm?',
            "Quarterly audit — sample 30 articles across high-volume intents. Score for accuracy, atomicity, freshness. Identify systemic issues. Without the rhythm, KB quality decays 5–10% per quarter and AI grounding decays with it."),
          narration:
            "Check three. Is there a content-quality maintenance rhythm? Quarterly audit — sample thirty articles across high-volume intents. Score them for accuracy against current policy, atomicity of structure, freshness of content. Identify systemic issues — for example, articles in the billing category are consistently three months behind policy changes. Without a maintenance rhythm, knowledge base quality decays five to ten percent per quarter as policies change and articles don't get updated. AI grounding quality decays in lockstep because the AI grounds on whatever the KB contains. The maintenance rhythm is a small ongoing investment that protects the entire deployment over time. Schedule it. Assign an owner. Don't skip it.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Citation patterns that build customer trust',
      iconKey: 'check',
      eyebrow: 'Lesson 3 · The citations',
      bodyHtml: `<p>Three citation patterns. Each does specific work in the customer interaction. Use the right pattern for the right context — don't default to one citation style across all surfaces.</p>`,
      narrationLead:
        "Three citation patterns for AI-grounded answers. Each pattern does specific work in the customer interaction. Use the right pattern for the right context — don't default to one citation style across all surfaces. The pattern choice signals different things to the customer and to the agent, and the right choice for the situation builds trust efficiently.",
      steps: [
        {
          html: stepCard('check', 'blue', 'Pattern 1 — Inline link for customer-facing chat',
            "Answer text followed by 'Source: Help article title' as a clickable link. Customer can verify if they want. Most don't click, but the option's existence is itself the trust signal. Used in customer self-serve and customer-facing chat."),
          narration:
            "Pattern one. Inline link for customer-facing chat and self-serve search. The AI's answer text is followed by Source colon help article title, presented as a clickable link. The customer can click to verify if they want. In practice, most customers don't click — but the option being there is itself the trust signal. The pattern communicates this answer is from our actual published help content, not invented. Use this pattern in customer-facing chat windows and in customer self-serve search results. Make the link styling subtle but visible.",
        },
        {
          html: stepCard('check', 'blue', 'Pattern 2 — Article reference in agent panel',
            "Agent-facing panel shows the article title plus a one-line excerpt of the relevant section. Agent can click for full article. Lets agents verify in 5 seconds before reading the AI suggestion to the customer."),
          narration:
            "Pattern two. Article reference in the agent panel. The agent-facing panel shows the article title plus a one-line excerpt of the specific section the AI grounded on. The agent can click to read the full article if they want to verify in depth. The pattern lets agents verify the AI suggestion in five seconds before reading it to the customer or rephrasing it. This is the agent's most important safety net — they catch the rare retrieval mismatch where the AI grounded on the wrong article. Five seconds of verification per interaction is a cheap safety net for the brand exposure the alternative would create.",
        },
        {
          html: stepCard('check', 'blue', 'Pattern 3 — Spoken citation in voice deployments',
            "Voice AI answers, then says 'this is based on our published return policy effective January 2026'. Reads less naturally than text citations but matters more — voice customers can\'t click to verify, so the explicit verbal grounding earns the trust."),
          narration:
            "Pattern three. Spoken citation in voice deployments. Voice AI answers the customer's question, then says explicitly — this is based on our published return policy effective January 2026. Reads less naturally than text citations and you have to design the phrasing carefully to avoid sounding robotic. But it matters more than text citations because voice customers cannot click a link to verify — they have to trust the answer. The explicit verbal grounding is what earns the trust. Design the phrasing so the citation sounds natural — for example, that policy is our published return rule from January twenty-twenty-six. Practice the cadence so it doesn't feel tacked-on. Voice citation is the most often skipped of the three patterns and the most consequential for voice CSAT.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter six — sentiment, escalation, and frontline trust.</p>`,
      narrationLead:
        "Three anchors before chapter six — sentiment, escalation, and frontline trust.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three grounding disciplines',
            "Retrieval-only (no parametric fallback) · mandatory citation to source · refusal patterns when uncertain. All three together are the brand-safety floor for AI-grounded knowledge."),
          narration:
            "One. Three grounding disciplines. Retrieval-only architecture with parametric fallback explicitly disabled — refuse vendor pitches for tools that combine your KB with general knowledge. Mandatory citation to source on every answer — no answer ships without a citation. Refusal patterns when retrieval confidence is below threshold — explicit I don't know is small cost, hallucinated answer is asymmetric cost. All three together are the brand-safety floor for AI-grounded knowledge.",
        },
        {
          html: stepCard('check', 'green', 'Two — KB quality is the gate',
            "Atomic single-purpose articles · same-day policy versioning · quarterly content-quality audit. Most KBs need a quarter of cleanup before AI grounding works well. The cleanup is cheaper than the rollback after a brand event."),
          narration:
            "Two. Knowledge-base quality is the gate that decides whether AI grounding actually works. Articles must be atomic and single-purpose — long multi-topic articles produce mixed retrieval. Policy must be authoritatively versioned with same-day updates when policy changes — stale articles produce confidently-wrong AI answers. There must be a quarterly content-quality maintenance rhythm — without it, KB quality decays five to ten percent per quarter and AI grounding decays with it. Most knowledge bases need a quarter of cleanup work before AI grounding deploys well. The cleanup is cheaper than the rollback after a hallucinated-policy brand event.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three citation patterns',
            "Inline link for customer-facing chat · article reference in agent panel · spoken citation for voice. Match pattern to context; don't default to one style across surfaces. Voice citation is most often skipped and most consequential."),
          narration:
            "Three. Three citation patterns matched to context. Inline link with help article title for customer-facing chat and self-serve. Article reference with one-line excerpt in agent panel for verification. Spoken citation in voice deployments — explicit verbal grounding that customers can't verify but earns trust through transparency. Voice citation is the pattern most often skipped and the most consequential for voice CSAT. Design the phrasing carefully so it sounds natural rather than robotic.",
        },
      ],
      narrationTrail:
        "Chapter six — sentiment, escalation, and frontline trust. The support-not-surveillance line and the escalation logic teams actually rely on. See you there.",
    },
  ],
}
