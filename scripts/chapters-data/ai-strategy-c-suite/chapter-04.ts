import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter04: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-talent-and-org-design',
  title: 'Talent & org design',
  subtitle: 'The team you need, the team you have, and the bridge between them.',
  slides: [
    // SLIDE 1
    {
      title: 'Talent & org design',
      iconKey: 'users',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Most C-suites underestimate this. Capital is allocatable in minutes. Talent and org design take quarters — sometimes years. In the next few minutes, the three structural decisions that decide whether your AI portfolio scales.</p>`,
      narrationLead:
        "Welcome to chapter four. Talent and organisation design. Most C-suites underestimate this part — and I get why. Capital is allocatable in minutes. Talent and org design take quarters — sometimes years. So in the next few minutes, the three structural decisions that decide whether your AI portfolio scales or stalls.",
    },
    // SLIDE 2
    {
      title: 'Three operating models — pick deliberately',
      iconKey: 'users',
      eyebrow: 'Lesson 1 · Operating model',
      bodyHtml: `<p>There are three legitimate operating models for AI at scale. Each has trade-offs. Pick deliberately — the worst mistake is drifting between them.</p>`,
      narrationLead:
        "Three legitimate operating models for AI at scale. Each has trade-offs. None is universally right. The worst mistake I see is not picking the wrong one — it's drifting between them. So you pick deliberately. Here are the three.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Centralised — AI Centre of Excellence',
            "One team. Sets standards. Builds shared platforms. Loaned out to business units. Strong on governance and consistency. Weak on speed and on understanding the business unit context. Best fit: regulated industries, early-stage AI maturity."),
          narration:
            "Model one. Centralised. An AI Centre of Excellence. One team. Sets the standards. Builds the shared platforms — vector stores, evaluation frameworks, security playbooks. Loaned out to business units when needed. This model is strong on governance and consistency. It's weak on speed, and on understanding the specific context of each business unit. Best fit — regulated industries. And firms in the early stages of AI maturity, where governance discipline matters more than speed.",
        },
        {
          html: stepCard('users', 'amber', 'Federated — embedded AI leads per BU',
            "Each business unit has its own AI lead, with light coordination through a central council. Strong on context and speed. Weak on shared platforms and on attracting senior talent — each lead is somewhat junior. Best fit: large multi-BU enterprises, mature AI."),
          narration:
            "Model two. Federated. Each business unit has its own AI lead. With light coordination through a central council. This model is strong on business context and on speed — decisions get made close to the work. It's weak on shared platforms and, honestly, on attracting senior talent. Each lead in this model is somewhat junior. Best fit — large multi-business-unit enterprises that have already crossed early AI maturity.",
        },
        {
          html: stepCard('users', 'green', 'Hub-and-spoke — the model that actually works',
            "A small central hub of senior AI talent (3–8 people). Spokes embedded in each business unit (often one person plus tooling). Hub sets standards and runs the hardest builds. Spokes sense the business and scope locally. Best fit: most enterprises."),
          narration:
            "Model three. Hub and spoke. A small central hub of senior AI talent — three to eight people. Spokes embedded in each business unit — often one person plus shared tooling. The hub sets the standards and runs the hardest builds. The spokes sense the business and scope work locally. This is the model that actually works for most enterprises. You get the governance of centralisation. You get the speed of federation. And you don't have to hire forty senior people to make it run.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Decision rule',
        "Hub-and-spoke unless you have a specific reason to choose otherwise. Specific reasons include: high regulation (lean centralised), or genuine BU autonomy in a large group (lean federated). Default to hub-and-spoke."),
      calloutNarration:
        "A decision rule. Hub and spoke — unless you have a specific reason to choose otherwise. Specific reasons include high regulation, where you lean centralised. Or genuine business unit autonomy in a large group, where you lean federated. Otherwise, default to hub and spoke. It scales. It hires. It survives leadership transitions.",
    },
    // SLIDE 3
    {
      title: 'The five roles you actually need',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Roles',
      bodyHtml: `<p>Every AI organisation eventually needs the same five roles. Not all on day one. But all by year two.</p>`,
      narrationLead:
        "Every AI organisation eventually needs the same five roles. Not all on day one. But all by year two. Let me walk you through them — and the order in which you typically hire.",
      steps: [
        {
          html: stepCard('compass', 'blue', '1 · Head of AI / CAIO',
            "Senior leader with capital authority, headcount authority, and process-owner relationships. Reports to CEO, CIO, or CDO. Without this person, the programme is a coordinator with a title."),
          narration:
            "One. Head of AI — or Chief AI Officer if the title matters in your culture. A senior leader with capital authority. Headcount authority. And good relationships with the process owners across the firm. Reports to the CEO, the CIO, or the CDO. Without this person, your AI programme is a coordinator with a title. With the wrong person, it's worse. Hire carefully.",
        },
        {
          html: stepCard('cog', 'blue', '2 · AI Engineer / ML Engineer',
            "The technical lead. Builds the hardest agents, the trickiest RAG systems, the integration with your data stack. One senior, two mid, hire-as-you-grow."),
          narration:
            "Two. AI Engineer or Machine Learning Engineer. The technical lead. Builds the hardest agents. The trickiest retrieval systems. The integration with your data stack. The shape of this team is typically one senior, two mid-level, and you hire as you grow. Senior is non-negotiable. Don't fill the senior spot with two mids because senior salaries are high.",
        },
        {
          html: stepCard('search', 'amber', '3 · Data Engineer (sometimes already in your org)',
            "Often the bottleneck. Without clean, queryable data, AI projects stall. Many firms already have this person — they're in the data team. Borrow them, formally."),
          narration:
            "Three. Data Engineer. This is often already in your organisation — sitting in the data team, reporting somewhere into analytics. Without clean, queryable data, AI projects stall. So you borrow this person formally. With a memo. With recognition. Don't borrow informally — that's how good data engineers leave.",
        },
        {
          html: stepCard('shield', 'green', '4 · AI Governance / Risk Lead',
            "Often part-time in year one — a senior person from legal, risk, or compliance with an AI brief. Becomes full-time by year two. Cannot live inside the build team — must have independence."),
          narration:
            "Four. AI Governance and Risk Lead. Often part-time in year one — a senior person from legal, risk, or compliance who takes on an AI brief alongside their existing role. Becomes full-time by year two. The critical thing — this role cannot live inside the build team. It needs independence. Otherwise, the governance becomes theatre, and your auditors will notice eventually.",
        },
        {
          html: stepCard('bookOpen', 'amber', '5 · Adoption / Change Lead',
            "The role most often forgotten. Without somebody whose actual job is making AI adoption stick, your $400k Copilot rollout becomes a $400k licence drawer. Often the person you already have running enterprise change."),
          narration:
            "Five. Adoption and Change Lead. This is the role most often forgotten. And then most regretted. Without somebody whose actual job is making AI adoption stick — running the comms, the trainings, the office hours — your four-hundred-thousand-dollar Copilot rollout becomes a four-hundred-thousand-dollar license drawer. Where the licenses sit unused. This is often the person you already have running enterprise change. Promote them.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Build vs hire vs partner — the team question',
      iconKey: 'target',
      eyebrow: 'Lesson 3 · Sourcing',
      bodyHtml: `<p>Once you know the model and the roles, you still have to source the people. Three honest options — none of them is wrong, but most firms do the wrong one for too long.</p>`,
      narrationLead:
        "Once you know the model and the roles, you still have to source the people. Three honest options. None of them is wrong on its own. But most firms do the wrong one for too long. Let me walk you through them.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Hire — slowest but most durable',
            "12–18 months to hire and onboard a senior AI engineer in most markets. Real cost (loaded) is $250k–$400k/year for a senior in the GCC. The investment compounds — these people become your moat. But you cannot rely on this in year one."),
          narration:
            "One. Hire. The slowest but the most durable. Twelve to eighteen months to hire and onboard a senior AI engineer in most markets. Real cost — fully loaded — is two hundred and fifty to four hundred thousand a year for a senior in the GCC. The investment compounds. These people become your moat. But you cannot rely on this approach in year one. Year one needs a different motion.",
        },
        {
          html: stepCard('rocket', 'amber', 'Partner — fastest for senior speed',
            "A boutique consultancy with senior, certified delivery people gives you the equivalent of three senior hires for the price of one — for the project duration. The right use is years one and two while you hire."),
          narration:
            "Two. Partner. The fastest path to senior speed. A boutique consultancy with genuinely senior, certified delivery people effectively gives you the equivalent of three senior hires for the price of one — for the duration of the project. The right use is years one and two, while you hire your own team in parallel. The wrong use is year five — by then your dependence on the partner has become a structural weakness.",
        },
        {
          html: stepCard('search', 'green', 'Borrow internally — the underrated option',
            "Half the senior talent you need is already on your payroll — in data, analytics, business intelligence, internal IT. Formally second them to the AI hub for 6–12 months. Often a faster, cheaper, more loyal team than hiring or contracting."),
          narration:
            "Three. Borrow internally. The underrated option. Half the senior talent you need is already on your payroll — sitting in data, analytics, business intelligence, or internal IT. Formally second them to the AI hub for six to twelve months. Often a faster, cheaper, and more loyal team than hiring externally or bringing in contractors. Just remember to make the secondment formal. With a memo. With recognition. With a return path. Otherwise you'll lose them.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The honest year-one sourcing mix',
        "Most successful enterprise AI year-ones look like: <strong>20% hire (build the core)</strong>, <strong>40% partner (deliver year one)</strong>, <strong>40% borrow (internal mobility)</strong>. Year three, the mix flips."),
      calloutNarration:
        "The honest year-one sourcing mix at most successful enterprise AI programmes looks like — twenty percent hire to build the core, forty percent partner to deliver year one, and forty percent borrow through internal mobility. By year three, the mix flips. Hire moves up to fifty or sixty percent. Partner drops to ten or twenty. Borrow stays at twenty. The shape evolves. That's normal — and healthy.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — governance.</p>`,
      narrationLead:
        "Three anchors before we get to governance in chapter five.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — default to hub-and-spoke',
            "Centralised for regulation. Federated for very large groups. Hub-and-spoke for most everyone else."),
          narration:
            "One. Default to hub and spoke. Centralised when regulation requires it. Federated for very large groups with genuinely autonomous business units. Hub and spoke for most everyone else.",
        },
        {
          html: stepCard('check', 'green', 'Two — five roles by year two',
            "Head of AI · AI/ML Engineer · Data Engineer · Governance Lead · Adoption Lead. Not all on day one — all by year two."),
          narration:
            "Two. Five roles by year two. Head of AI. AI or Machine Learning Engineer. Data Engineer. Governance Lead. Adoption Lead. Not all on day one. All by year two.",
        },
        {
          html: stepCard('check', 'green', 'Three — year-one mix is 20/40/40',
            "Twenty hire, forty partner, forty borrow. By year three, the shape flips. Plan that evolution from day one."),
          narration:
            "Three. Your year-one mix is twenty hire, forty partner, forty borrow. By year three, that shape flips. Plan that evolution from day one — it tells you who to hire, when.",
        },
      ],
      narrationTrail:
        "Next chapter — governance. The conversation regulators are going to have with you, whether or not you're ready. So we get ready.",
    },
  ],
}
