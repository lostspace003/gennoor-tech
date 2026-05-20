import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter04: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-multilingual',
  title: 'Multilingual support at scale',
  subtitle: 'The languages your customers actually use · code-switching in GCC, India, and Africa · three production gotchas you only meet at scale.',
  slides: [
    // SLIDE 1
    {
      title: 'Multilingual support at scale',
      iconKey: 'users',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Multilingual support AI changes the economics of operating across regions — a single team can now serve markets that previously required regional hubs. Three architecture decisions decide whether the quality holds at production volume.</p>`,
      narrationLead:
        "Welcome to chapter four. Multilingual support at scale. Multilingual support AI changes the economics of operating across regions for many businesses. A single contact-centre team can now serve markets that previously required separate regional hubs. The cost-and-coverage upside is significant — typically thirty to fifty percent cost reduction on regional support while expanding language coverage. Three architecture decisions decide whether the quality holds at production volume — or whether you save cost while degrading the customer experience in your most important growth markets. Get the architecture right.",
    },
    // SLIDE 2
    {
      title: 'Architect for the languages your customers actually use',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The languages',
      bodyHtml: `<p>Three steps to choose the language coverage that matches your customers — not the language coverage your vendor's marketing led with. Customer language reality is rarely what the brand assumed.</p>`,
      narrationLead:
        "Three steps to choose the language coverage that matches your customers — not the language coverage your AI vendor's marketing led with. Customer language reality is rarely what the brand assumed. Many teams have shipped multilingual support tuned for the wrong languages because they relied on regional generalisations instead of measuring their actual customer base. Run the three steps before any multilingual deployment.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Step 1 — Measure actual language of inbound contacts',
            "Sample 500 recent contacts across channels. Tag the actual language used. Often reveals 'GCC' is 70% Arabic + 30% English with significant code-switching; 'India' is 8 languages active not just Hindi. Real distribution differs from brand assumption."),
          narration:
            "Step one. Measure the actual language of inbound contacts. Sample five hundred recent contacts across all channels — chat, email, voice — over the last quarter. Tag the actual language used in each contact. The result is usually surprising. Gulf Cooperation Council customers — often labelled as Arabic-speaking in vendor specs — in reality use seventy percent Arabic and thirty percent English with significant code-switching mid-conversation. Indian customers — often labelled as Hindi or English in vendor specs — in reality use eight languages actively, with Tamil, Telugu, Bengali, Marathi, Malayalam, Gujarati, and Kannada all material depending on customer segment. The actual distribution differs from the brand assumption. Measure honestly. The measurement itself often changes the deployment plan.",
        },
        {
          html: stepCard('target', 'blue', 'Step 2 — Decide your coverage line',
            "What percentage of contact volume must be covered in the customer's actual language vs. routed to English? 95% is the gold standard for retention-sensitive segments. 80% is acceptable for cost-sensitive segments. Below 70% — the multilingual play isn't viable yet."),
          narration:
            "Step two. Decide your coverage line. What percentage of contact volume must be covered in the customer's actual primary language versus routed to English-language support? Ninety-five percent is the gold standard for retention-sensitive segments like enterprise customers or premium tiers. Eighty percent is acceptable for cost-sensitive consumer segments. Below seventy percent coverage means many customers can't reach support in their preferred language; the multilingual play isn't viable yet — either invest more in coverage or stay with the current English-first approach. The coverage line is the design decision; the model choice in step three follows from it.",
        },
        {
          html: stepCard('check', 'blue', 'Step 3 — Choose models per language tier',
            "Tier 1 — your top 3 languages by volume — premium models, full feature support. Tier 2 — next 4–5 — standard models, agent-assist priority. Tier 3 — long-tail — translation-layer with English fallback. Don't try to give every language tier-1 treatment."),
          narration:
            "Step three. Choose models per language tier. Tier one — your top three languages by contact volume — premium models, full feature support including all four agent-assist components from chapter two, full bot scope if applicable. Tier two — the next four to five languages — standard models, agent-assist priority on suggested response and knowledge surfacing, lighter bot scope. Tier three — the long-tail languages — translation-layer architecture with English-language agent in the loop, no bot deployment. Don't try to give every language tier-one treatment. The cost is prohibitive and the demand from tail languages doesn't justify it. Tier the languages explicitly. The tiering decision is what makes the architecture sustainable.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Code-switching is the production reality',
      iconKey: 'sparkles',
      eyebrow: 'Lesson 2 · Code-switching',
      bodyHtml: `<p>Customers in GCC, India, Africa, and increasingly Europe code-switch mid-conversation. The model has to handle it natively. Three failure modes and their fixes.</p>`,
      narrationLead:
        "Code-switching is the production reality. Customers across the Gulf, the Indian subcontinent, Africa, and increasingly Europe code-switch mid-conversation. They start a message in Arabic, switch to English for technical terms, return to Arabic for the closing. Or English with three Tamil phrases mixed in. The model has to handle code-switching natively. Three failure modes to anticipate and the specific fix for each.",
      steps: [
        {
          html: stepCard('alertTriangle', 'amber', 'Failure 1 — Model locks to the first language detected',
            "Customer starts in English, switches to Hindi. Model still treats input as English and produces garbled output. Fix — use a model that does continuous language detection per turn, not session-level."),
          narration:
            "Failure mode one. The model locks to the first language detected at the start of the conversation. Customer starts the message in English — model classifies session as English. Customer switches to Hindi in the next message — model still treats input as English, attempts to interpret Hindi words as English, produces garbled output and a useless response. The customer feels unseen. Fix — use a model that does continuous language detection per turn, not session-level classification. Continuous detection re-evaluates language at every customer turn. Most modern multilingual models support this; many vendor deployments don't have it configured by default. Verify the configuration before going live.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Failure 2 — Model translates technical terms it shouldn\'t',
            "Customer uses an English technical term mid-Arabic sentence — 'API' or 'firewall'. Model translates it to Arabic and the response is incomprehensible. Fix — preserve technical-domain English terms even within non-English context."),
          narration:
            "Failure mode two. The model translates technical terms it shouldn't translate. Customer types a mid-Arabic sentence containing the English technical term API or firewall or SSL. The model translates these terms into Arabic and the response becomes incomprehensible to the technical customer who would have used the English terms regardless of conversation language. Same pattern with brand names — translating Microsoft or Salesforce into Arabic phonetic equivalents produces noise. Fix — configure a preserved-vocabulary list of technical terms and brand names that the model keeps verbatim regardless of conversation language. Most enterprise tools support this; the configuration is often skipped.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Failure 3 — Response register doesn\'t match customer register',
            "Customer uses casual Tunisian Arabic; the bot replies in formal Modern Standard Arabic. Reads as if the bot is talking down to the customer. Fix — match dialect and formality register where the model can detect it; default to slightly less formal than the customer."),
          narration:
            "Failure mode three. Response register doesn't match the customer's register. Customer types in casual Tunisian Arabic or Hyderabadi Hindi. The bot replies in formal Modern Standard Arabic or Sanskritised Hindi. Reads to the customer as if the bot is talking down to them — formal where they're informal, distant where they were casual. Cultural pattern across many languages — register mismatch carries social signal beyond just word choice. Fix — match dialect and formality register where the model can reliably detect it. Default rule when uncertain — slightly less formal than the customer's input, because slightly under-formal reads as friendly while over-formal reads as cold. This nuance matters most in Arabic, Hindi, and Spanish deployments where dialect variation is significant.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The test before launch',
        "Run 50 real customer transcripts from the target region through the deployment. Have native-speaker reviewers rate naturalness on each. Below 4 out of 5 average — don't launch yet, the model isn't ready for this language at production quality."),
      calloutNarration:
        "The test to run before launching any non-English deployment at production scale. Take fifty real customer transcripts from the target region — anonymised, varied across intents. Run them through the actual deployment. Have native-speaker reviewers from your contact-centre team rate each response on naturalness, register match, and accuracy. Below four out of five average across the fifty — don't launch yet. The model isn't ready for this language at production quality. Either improve the model and configuration, fall back to translation-layer-with-English-agent architecture for this language, or downgrade the language to tier two or tier three until quality improves. The test takes a week. Launching prematurely costs months of brand recovery.",
    },
    // SLIDE 4
    {
      title: 'Three production gotchas you only meet at scale',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Production reality',
      bodyHtml: `<p>Three gotchas show up only at production scale — not in pilots, not in vendor demos. Knowing they exist lets you architect for them in advance.</p>`,
      narrationLead:
        "Three gotchas show up only at production scale. None of them appear in pilots — pilots are too clean, too monitored, too small to surface these. None appear in vendor demos — demos are scripted around model strengths. They show up at production volume across the long tail of real customer interactions. Knowing they exist lets you architect for them in advance rather than discover them in your CSAT dashboard six weeks after launch.",
      steps: [
        {
          html: stepCard('alertTriangle', 'amber', 'Gotcha 1 — Latency variance by language',
            "Common languages (English, Spanish, Arabic, Mandarin) — fast. Lower-resource languages (Tamil, Yoruba, Vietnamese) — significantly slower per token. At scale, customers in tier-3 languages experience 3–8 second response times that feel broken."),
          narration:
            "Gotcha one. Latency variance by language. Common languages — English, Spanish, Arabic, Mandarin — have fast inference because models are well-optimised for them. Lower-resource languages — Tamil, Yoruba, Vietnamese, Filipino, Swahili — have significantly slower per-token inference because the model has to work harder. At scale, customers in tier-three languages experience three to eight second response times that feel broken — even though the system is technically functioning. The latency cost is invisible in tests with single users and surfaces only at concurrent production volume. Fix — provision more compute for tier-three languages even if their volume is lower, or accept the latency and tell customers explicitly via a brief loading state that translation is processing.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Gotcha 2 — Accent in voice deployments',
            "Voice AI trained primarily on American or British English fails on Indian English, Nigerian English, Singapore English. Customers repeat themselves three times, give up. Different model per accent region — or a stronger general model — required."),
          narration:
            "Gotcha two. Accent in voice deployments. Voice AI — speech-to-text in particular — is primarily trained on American or British English. It fails noticeably on Indian English, Nigerian English, Singapore English, Filipino English, and other regional Englishes that are first language for hundreds of millions of customers globally. Customers repeat themselves three times, the model still doesn't understand, customers give up and call the number for human support — defeating the entire voice AI deployment. Fix — either deploy region-specific voice models trained on the relevant English variant, or accept the limitation and have voice AI only handle the most routine intents like account number capture where pronunciation is straightforward. Don't deploy general voice AI to a customer base with strong regional English without testing the recognition rate first.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Gotcha 3 — Holiday and cultural calendar mismatch',
            "Bot suggests appointment slots during Ramadan or Diwali without recognising the cultural context. Comes across as tone-deaf at best, offensive at worst. Fix — feed the bot regional cultural calendars and tone-shift around major periods."),
          narration:
            "Gotcha three. Holiday and cultural calendar mismatch. The bot suggests appointment slots during Ramadan or Diwali or Eid without recognising the cultural context. Comes across as tone-deaf at best — customer feels their culture is invisible to the brand — and offensive at worst, particularly when the bot pushes for urgency during a religious observance period. Fix — feed the bot regional cultural calendars and configure tone-shift around major observance periods. During Ramadan, daytime appointment suggestions should adjust to evenings or post-iftar timing in regions where this matters. During Diwali, urgent collection language should soften. The implementation is straightforward once recognised; recognising it requires either local team members reviewing deployment scripts or explicit cultural-context training in the AI configuration phase. Bring local team members into the rollout. They catch this before customers do.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter five — knowledge base AI without hallucinated policies.</p>`,
      narrationLead:
        "Three anchors before chapter five — knowledge base AI without hallucinated policies.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Measure language reality, then tier',
            "Sample 500 contacts to learn actual language distribution. Set the coverage line by segment. Tier languages explicitly — premium models for top 3, standard for next 4–5, translation layer for the tail. Don't give every language tier-1 treatment."),
          narration:
            "One. Measure language reality before architecting. Sample five hundred contacts across channels to learn the actual language distribution. Set the coverage line per segment — ninety-five percent for retention-sensitive, eighty percent for cost-sensitive. Tier languages explicitly. Top three languages get premium models and full feature support. Next four to five get standard models. The long tail gets translation-layer architecture with English-language agents. Tiering is what makes the architecture sustainable rather than prohibitively expensive.",
        },
        {
          html: stepCard('check', 'green', 'Two — Code-switching is the production reality',
            "Continuous per-turn language detection · preserved technical/brand vocabulary · dialect and register match. Test with 50 real transcripts and native-speaker reviewers before launch — below 4/5 average, don't launch."),
          narration:
            "Two. Code-switching is the production reality across GCC, India, Africa, and increasingly Europe. Configure continuous per-turn language detection — not session-level. Configure preserved technical and brand vocabulary so terms like API or Microsoft stay in original language. Match dialect and register where the model can detect them — default to slightly less formal than the customer. Test with fifty real anonymised transcripts and native-speaker reviewers before launch. Below four out of five average naturalness rating — don't launch yet.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three production gotchas',
            "Latency variance by language (provision compute) · accent in voice deployments (test recognition rate first) · cultural calendar mismatch (feed regional calendars + bring local team into rollout). Architect for them in advance."),
          narration:
            "Three. Three production gotchas you only meet at scale. Latency variance — lower-resource languages run slower; provision compute or accept the latency with explicit UX. Accent in voice deployments — voice AI fails on Indian English, Nigerian English, Singapore English unless trained for them; test recognition rate on regional accents before going live. Cultural calendar mismatch — feed the bot regional cultural calendars and tone-shift around major observance periods. Bring local team members into the rollout; they catch what global teams miss. Architect for all three in advance, not in the dashboard after launch.",
        },
      ],
      narrationTrail:
        "Chapter five — knowledge base AI without hallucinated policies. Grounding patterns, citation discipline, and the failure mode that's bitten several large brands publicly. See you there.",
    },
  ],
}
