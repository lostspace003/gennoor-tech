import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter01: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-where-ai-fits-in-finance',
  title: 'Where AI fits in finance',
  subtitle: 'Four plays that pay. One that doesn’t. And the discipline that separates them.',
  slides: [
    // SLIDE 1
    {
      title: 'Where AI fits in finance',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">This course is for CFOs, controllers, FP&A leads, and accountants who want AI to actually show up in EBITDA — not just in the strategy deck. In the next few minutes, the four AI plays that move the close, the cash, and the controls — and the one play that quietly wastes finance time.</p>`,
      narrationLead:
        "Welcome to the course. This is for finance leaders. CFOs. Controllers. FP and A. Accountants. People who would like AI to actually show up in the numbers — not just in next quarter's strategy deck. We're going to spend roughly an hour walking through where AI fits in the finance function. The four plays that pay. The one that wastes time. And the discipline that separates them. Let's begin.",
    },
    // SLIDE 2
    {
      title: 'The four AI plays for finance',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The plays',
      bodyHtml: `<p>Almost every finance AI use case is one of four plays. The math, the timeline, and the deployment risk of each are different — and a finance team that treats them the same is a finance team that funds the wrong one first.</p>`,
      narrationLead:
        "Almost every AI use case in the finance function is one of four plays. The math is different in each. The timeline is different. The deployment risk is different. And a finance team that treats them the same is a finance team that funds the wrong play first. Here are the four.",
      steps: [
        {
          html: stepCard('cog', 'green', 'Play 1 — Document extraction',
            "Invoices, receipts, contracts, statements. AI reads the document, extracts structured data, writes back into the ERP. Pays in <em>hours saved per AP clerk per week</em> and in <em>error rate reduction</em>. Low risk, fast ROI, mature technology."),
          narration:
            "Play one. Document extraction. Invoices. Receipts. Contracts. Bank statements. AI reads the document, extracts the structured data, and writes it back into the ERP. The math is simple — hours saved per AP clerk per week, multiplied by their fully-loaded cost. Plus error rate reduction. The risk is low. The ROI is fast. And the technology is mature. This is the easiest finance play. If you haven't started here, start here.",
        },
        {
          html: stepCard('users', 'blue', 'Play 2 — Reconciliation and close acceleration',
            "Bank-to-GL, AP-to-PO, intercompany matching. An agent ingests the inputs, proposes journal entries, surfaces mismatches. Pays in <em>days off the close cycle</em>. Medium risk, higher ROI, demands clean data."),
          narration:
            "Play two. Reconciliation and close acceleration. Bank-to-GL matching. AP-to-purchase-order matching. Intercompany reconciliation. An agent ingests the inputs, proposes journal entries, surfaces the mismatches for a human to approve. The math here is days off the close cycle. The risk is medium — because the data plumbing has to be clean. The ROI is higher than play one. And the team that runs this play stops working weekends at month-end.",
        },
        {
          html: stepCard('search', 'amber', 'Play 3 — Forecasting and FP&A copilots',
            "Demand forecasts. Cash forecasts. Scenario planning. ML pipelines plus a natural-language interface over your BI layer. Pays in <em>forecast accuracy</em> and <em>planning speed</em>. Higher risk — models drift, scenarios proliferate. Demands governance."),
          narration:
            "Play three. Forecasting and FP and A copilots. Demand forecasts. Cash forecasts. Scenario planning. The combination is an ML forecasting pipeline plus a natural-language interface sitting on top of your BI layer. The math is forecast accuracy improvement, plus planning cycle speed. The risk is higher. Models drift. Scenarios proliferate. This play demands governance from day one — drift monitoring, model versioning, scenario approval. Without governance, this play turns into a CFO surprise. Don't underestimate the rigour required.",
        },
        {
          html: stepCard('shield', 'red', 'Play 4 — Anomaly, audit, and fraud',
            "Real-time anomaly detection in transactions. Audit assistants that read controls evidence. Fraud-flagging agents. Pays in <em>losses prevented</em> and <em>audit hours saved</em>. Highest risk class — false positives erode trust, false negatives erode controls."),
          narration:
            "Play four. Anomaly, audit, and fraud. Real-time anomaly detection in transactions. Audit assistants that read controls evidence and surface exceptions. Fraud-flagging agents at the transactional level. The math is losses prevented, plus audit hours saved on the routine sampling. The risk is the highest of the four. False positives erode finance team trust in the tool — and people stop using it. False negatives erode internal controls — and that's the kind of failure that ends careers. So this play earns governance before deployment, not after.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The wasted play to recognise',
        "The fifth pattern is <em>AI for chat with your financials</em> — a generative interface on top of your ERP that produces sentences about your numbers without producing decisions. Pretty demos. Almost no measurable finance value. Fund it only after the four real plays are live."),
      calloutNarration:
        "The fifth pattern is the one to recognise — and skip. AI for chat with your financials. A generative interface sitting on top of your ERP that produces sentences about your numbers. The sentences are usually correct. They are also usually useless — because they don't change a decision the controller wasn't already going to make. The demos are pretty. The measurable finance value is almost zero. Fund it only after the four real plays are already live, and only if the team specifically asks for it. Don't let a vendor lead with this play and call it transformation. It isn't.",
    },
    // SLIDE 3
    {
      title: 'The sequence — what to do first',
      iconKey: 'flag',
      eyebrow: 'Lesson 2 · Order of operations',
      bodyHtml: `<p>You don’t do all four plays at once. You sequence them — and there’s a right order. The wrong order costs you twelve months.</p>`,
      narrationLead:
        "You don't run all four plays at the same time. You sequence them. And there is a right order. The wrong order costs you roughly twelve months and a meaningful amount of credibility with the CEO. Here's the sequence that works.",
      steps: [
        {
          html: stepCard('flag', 'green', '1 · Start with document extraction',
            "Lowest risk. Fastest ROI. Builds the AP team's confidence in AI as a working tool. 4–6 weeks to first value."),
          narration:
            "One. Start with document extraction. The lowest risk play. The fastest ROI. It builds the AP team's confidence in AI as a working operational tool — not a science-fair project. Four to six weeks to first value. After this, the team has stories to tell about AI that actually worked. Those stories matter when you fund the next play.",
        },
        {
          html: stepCard('flag', 'blue', '2 · Add reconciliation in months 3–4',
            "Once extraction is stable, the team is ready for a higher-stakes agent. Reconciliation has the most visible payback — the controller stops working weekends."),
          narration:
            "Two. Add reconciliation in months three or four. Once document extraction is stable, the team is ready for a higher-stakes agent. And reconciliation has the most visible payback of all the finance plays — because the controller stops working weekends at month-end. That story travels fast inside the firm. It also funds the next phase.",
        },
        {
          html: stepCard('flag', 'amber', '3 · Forecasting in months 6–9',
            "Forecasting is a longer build. Data preparation alone takes weeks. By the time the agent is live, the team has earned the right to ask FP&A for proper data discipline."),
          narration:
            "Three. Forecasting in months six through nine. Forecasting is a longer build than the first two plays — and it should be. Data preparation alone takes weeks. By the time the agent is live, your finance team has earned the credibility to ask FP and A and the data team for proper data discipline. Without that credibility, the data conversation goes nowhere. With it, you can actually fix the data layer.",
        },
        {
          html: stepCard('flag', 'red', '4 · Anomaly and audit in year 2',
            "Highest-risk play, deepest governance need. By year two, you have the operational confidence and the governance machinery to deploy this play without breaking the controls environment."),
          narration:
            "Four. Anomaly and audit in year two. The highest-risk play. The deepest governance need. By year two, you have the operational confidence — from plays one through three — and you have the governance machinery in place to deploy this play without breaking the controls environment. This is also the play that internal audit will help you scope, if you bring them in early. They will be your best ally, not your gate. Don't skip that relationship.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three traps the finance team walks into',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Pitfalls',
      bodyHtml: `<p>Three patterns that show up consistently. Recognise them — and steer around them.</p>`,
      narrationLead:
        "Three traps. They show up consistently when finance teams start their AI work. Recognise them — and steer around them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap 1 — Starting with the most exciting play',
            "Forecasting and fraud are interesting. They are also the hardest. Starting there usually produces a six-month delay and a credibility loss. Start boring. Earn the right to do interesting."),
          narration:
            "Trap one. Starting with the most exciting play. Forecasting is interesting. Fraud is interesting. They are also the hardest plays. Starting there usually produces a six-month delay and a credibility loss when the project drags. Start boring. Document extraction. Earn the right to do interesting work later. The CFO who funds you the second time around will remember whether the first project shipped on time.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 2 — Skipping the data quality conversation',
            "Reconciliation and forecasting both fail on dirty data. If your master data is in five places with five spellings, the AI doesn't fix that — it amplifies it. Address data quality before, not during."),
          narration:
            "Trap two. Skipping the data quality conversation. Reconciliation fails on dirty data. Forecasting fails on dirty data. If your master data lives in five different systems with five different spellings, AI doesn't fix that. It amplifies it. We dedicate a whole chapter — chapter seven — to this conversation. For now, just remember — address data quality before the AI project, not during.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 3 — Buying a vendor before scoping the play',
            "Every ERP vendor has bolted on an AI tier. Picking the vendor first means scoping the play to fit the vendor's capability — instead of scoping the play to fit your operational reality. Scope first. Vendor second."),
          narration:
            "Trap three. Buying a vendor before scoping the play. Every major ERP vendor has now bolted on an AI tier. SAP. Oracle. NetSuite. Workday. Microsoft. Each tells a beautifully convincing story. But picking the vendor first means scoping the play to fit the vendor's specific capability — instead of scoping the play to fit your operational reality. Scope first. Vendor second. The right vendor follows from the scope, not the other way round.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 2 — the document extraction play in detail.</p>`,
      narrationLead:
        "Three anchors before we get into the document extraction play in detail in chapter two.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four plays for finance, in the right order',
            "Document extraction · reconciliation · forecasting · anomaly. Skip the fifth — the chat-with-financials demo. Fund it only after the four real plays."),
          narration:
            "One. Four plays for finance — in the right order. Document extraction. Reconciliation. Forecasting. Anomaly and audit. Skip the fifth — the chat-with-financials demo. Fund it only after the four real plays are live and producing value.",
        },
        {
          html: stepCard('check', 'green', 'Two — Sequence matters',
            "Start boring. Earn the right to do interesting. The CFO who funded play one is the same CFO funding play four. Track record matters."),
          narration:
            "Two. Sequence matters. Start boring. Earn the right to do interesting. The CFO who funded play one is the same CFO funding play four. Track record matters more than ambition.",
        },
        {
          html: stepCard('check', 'green', 'Three — Scope before vendor',
            "Don't let a vendor demo define the play. Scope the play against your operational reality first; the vendor follows from the scope."),
          narration:
            "Three. Scope before vendor. Don't let a vendor demo define the play. Scope the play first — against your actual operational reality — and let the vendor follow from the scope. The right vendor changes by play. Don't lock in the vendor before you know which play you're running.",
        },
      ],
      narrationTrail:
        "Chapter two — invoice and document AI. The fastest payback you'll see in finance. See you there.",
    },
  ],
}
