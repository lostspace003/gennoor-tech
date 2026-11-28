import type { BlogPost } from '../index'

export const post: BlogPost = {
    slug: 'openai-perplexity-metric-ai-procurement',
    title: 'OpenAI’s Perplexity Score Could Change How Firms Buy AI',
    excerpt: 'Learn why OpenAI’s argument for perplexity, a score that shows how well a model predicts text, could shift AI buying from reactive decisions to more planned reviews of timing, fit, and readiness.',
    tldr: 'OpenAI argues that perplexity, a score for how well a model predicts the next piece of text, still tracks important model progress. For managers, that matters because AI buying may become more planned and less driven by sudden launches or polished demos. The practical response is to define business thresholds first, review vendors in a regular cycle, and separate improvements in the underlying model from improvements in product design and workflow.',
    keyTakeaways: [
      'OpenAI is arguing that perplexity can act as a shared indicator of underlying model progress, not just an internal research measure.',
      'If that view holds, AI procurement can become more planned and less dependent on reacting to every major launch or demo.',
      'Managers should separate improvement in the underlying model from product packaging, finetuning, and workflow design when comparing vendors.',
      'A practical buying process should define capability thresholds, review dates, and wait-versus-buy decisions before contract discussions begin.',
      'Perplexity is not the only measure that matters, and comparable industry-wide standards are still missing.',
      'The safest business response is to use this signal to improve planning discipline, not to replace real task evaluation with one chart.',
    ],
    faqs: [
      {
        question: 'what is perplexity in ai in simple words',
        answer: 'Perplexity is a score for how well a model predicts the next token, which is a small piece of text such as a word fragment or punctuation mark. Lower perplexity means the model makes better predictions on test data. OpenAI’s note argues that this simple score still tracks many important capability gains in base models, which is why the company wants it discussed as a common measure across AI developers.',
      },
      {
        question: 'why does openai’s perplexity note matter for business buyers',
        answer: 'It matters because the note suggests model progress may be more measurable than many buyers assume. If a stable training measure can signal where underlying model capabilities are heading, firms can make more deliberate decisions about when to adopt, when to wait, and how to time budgets. That shifts procurement away from reacting to headline demos and toward a more structured review process tied to business needs.',
      },
      {
        question: 'does this mean companies should buy ai based on one measure',
        answer: 'No. OpenAI presents perplexity as one useful measure, but not the only one that matters. A business should still test real tasks, check workflow fit, and review risk, cost, and governance. The practical value of the note is that it may improve planning, not that it replaces full model evaluation.',
      },
      {
        question: 'what technical terms should a manager understand here',
        answer: 'A few terms matter. Pretraining is the first broad training stage on huge datasets. A base model is the model before extra tuning for products or tasks. Finetuning is extra training to specialise a model after pretraining. Reinforcement learning is training from feedback to shape behavior toward goals. A held-out set is test data kept out of training for measurement. Log-perplexity is perplexity shown on a logarithmic scale.',
      },
      {
        question: 'what is still unknown about comparing ai developers with perplexity',
        answer: 'Several important points are still unclear. Other developers have not all said whether they will publish directly comparable perplexity numbers. The exact held-out dataset and evaluation process needed for fair comparison have not been established as a shared industry standard. It is also still not known how reliable perplexity remains across very different data mixes, model designs, or multimodal models.',
      },
      {
        question: 'how should a non-technical manager use this in ai procurement',
        answer: 'A non-technical manager can use this as a planning tool. Start by defining the business task, the minimum acceptable quality level, and the date when delaying no longer makes sense. Then ask vendors what comes from the underlying model versus finetuning or product design. Set a regular review cycle instead of reacting to every launch. That creates a clearer wait-versus-buy decision without assuming that one measure answers everything.',
      },
    ],
    references: [

    ],
    content: `
<p><em>By Gennoor Tech · November 28, 2026</em></p>
<p>OpenAI recently argued that a measure called <strong>perplexity</strong> may help track AI progress more clearly than many buyers assume. Perplexity is a score for how well a model predicts the next token. A token is a small piece of text, such as part of a word, a whole word, or punctuation. Lower perplexity means the model is making better predictions on test data.</p>
<p>That matters because many firms still buy AI as if every major change arrives without much warning. If a shared measure can show where underlying model capability is heading, model selection can become less about reacting to headlines and more about timing, fit, and whether to wait.</p>
<p>OpenAI’s note was about <strong>pretraining</strong>, which is the first broad training stage on huge datasets. It was also about using a common measure to compare progress and support shared safety rules.</p>

<h2>What OpenAI said and why buyers should care</h2>
<p>A common market view is that AI progress is too unpredictable to plan around. That pushes teams into short decision cycles. It also makes each new demo feel like a reason to reopen procurement.</p>
<p>OpenAI argued for a different view. The company said perplexity still tracks many useful capability changes well enough to be discussed as a common measure across AI developers.</p>
<p>For a manager, the point is practical. If model progress can be tracked in a more consistent way, buying decisions do not need to depend only on sudden launches or polished demonstrations.</p>
<p>That does not mean every product release will be easy to forecast. It does mean buyers may not need to treat each announcement as a shock to the plan.</p>

<h2>What perplexity means in simple terms</h2>
<p>OpenAI’s note said <strong>perplexity</strong> should become a common measure across AI developers. In simple terms, it is a score for how well a model predicts the next token in text. Lower values are better because they mean the model is making more accurate predictions on the test data used for measurement.</p>
<p>The note also said perplexity is equivalent to <strong>cross-entropy loss</strong>. Cross-entropy loss is another name for the prediction error behind perplexity. Managers do not need the math. The key idea is simple: lower values mean better prediction performance on the text used for testing.</p>
<p>OpenAI said it wants developers to compare this measure across organisations and use it to inform shared safety standards.</p>
<p>OpenAI also said it is publishing internal pretraining measurements even though that gives competitors a clearer view of its progress. The reason given was that shared safety measures matter more.</p>

<h2>What evidence OpenAI shared</h2>
<p>OpenAI’s chart showed results for several <strong>base models</strong>. A base model is the underlying model before extra tuning for products or tasks. This matters because buyers often see finished products, not the underlying model on its own.</p>
<p>The chart used <strong>log-perplexity</strong>. Log-perplexity is perplexity shown on a logarithmic scale, which is a way of compressing the numbers so changes are easier to compare over time. OpenAI presented the chart as a view of underlying pretraining progress rather than day-to-day product performance.</p>
<p>For a manager, the exact figures matter less than the direction. The chart showed lower log-perplexity over time. In plain terms, that suggests better prediction performance on the same test setup.</p>
<p>OpenAI’s chart also linked lower log-perplexity levels with labels that suggest stronger performance on practical tasks. For a business reader, the main takeaway is not the label itself. It is that OpenAI is trying to connect a training measure with more useful real-world work, such as writing code more reliably or handling specialised technical tasks at a higher level.</p>
<p>That link is important, but it should still be read carefully. A model may improve on an internal training measure without giving every company an equal improvement in daily work. Product design, workflow setup, and quality control still shape the result.</p>

<h2>Why this matters for AI buying</h2>
<p>This note points to a different buying model. Instead of treating AI as a stream of surprises, firms can start to treat some underlying model progress as something to monitor and plan for.</p>
<p>That affects budget timing, vendor reviews, and roadmap decisions. A team may decide to delay a large rollout if it expects meaningful improvement soon. It may run a small pilot first. It may also negotiate shorter review points instead of locking into a long decision too early.</p>
<p>The idea is not that one score should drive a purchase. The idea is that planning gets easier if buyers have a clearer view of how underlying models are improving.</p>
<p>This is also broader than one vendor’s current product line. The note is about pretraining progress and safety pacing, not about a new model release, a new pricing plan, or a new customer programme.</p>

<h2>What changes in procurement decisions</h2>
<p>For many firms, model selection is still driven by surface impressions. A vendor shows a polished demo. Senior stakeholders ask why the company is not moving faster. Procurement starts before anyone agrees on what capability level the business actually needs.</p>
<p>If a stable measure matters, the better approach is to buy against thresholds. That means defining the task, the quality bar, the review date, and the point at which waiting makes more sense than switching now.</p>
<p><strong>Example:</strong> a support team wants better summaries and draft replies. If the current model already meets the service standard, but likely near-term progress in the underlying model could improve difficult cases, the team may choose a short pilot now and a larger review later. That is often better than a rushed full rollout.</p>
<p>This does not remove the need for product testing. It changes the order of decisions. First define the capability threshold the business needs. Then check whether the market is already past it, close to it, or still short of it.</p>
<ul>
<li>Set a review cadence for models instead of reacting to every announcement.</li>
<li>Ask vendors how much improvement comes from the underlying model and how much comes from extra tuning.</li>
<li>Keep contract and architecture choices flexible when the needed capability is near, not far.</li>
<li>Link model reviews to budget cycles and operating risk, not only to product marketing dates.</li>
</ul>

<h2>Separate the underlying model from the product around it</h2>
<p>A useful buying habit is to separate improvement in the underlying model from improvement in the product wrapped around it.</p>
<p>OpenAI describes a simplified development path as building a large computer, doing pretraining, then using prompting, <strong>finetuning</strong>, or <strong>reinforcement learning</strong> to draw out capabilities. Finetuning is extra training to specialise a model after pretraining. Reinforcement learning is training from feedback to shape behaviour toward goals.</p>
<p>That distinction matters in procurement. Some improvements come from the underlying model getting better. Others come from product design, task-specific tuning, tools, and workflow setup.</p>
<p>A vendor demo may look much better because the workflow is designed well, not because the underlying model is far ahead. The reverse can also be true. A strong underlying model can be hidden inside an average product experience.</p>
<p>Managers should ask both questions. Is the product useful today? And how much of that result depends on the underlying model versus the surrounding setup?</p>
<p>This is especially important when suppliers talk about automation. One vendor may improve speed by building a better interface. Another may improve quality because the underlying model handles harder cases more accurately. Both matter, but they affect contract decisions in different ways.</p>
<p>If the gain mainly comes from workflow design, switching models later may be easier. If the gain mainly comes from the underlying model, the buyer should pay closer attention to how quickly that supplier is improving over time.</p>

<h2>What a manager should be careful about</h2>
<p>There is a risk in reading too much into the note. OpenAI is not saying perplexity alone should decide everything. The broader proposal is for limits based on perplexity and other measurements, not perplexity by itself.</p>
<p>There are also important gaps. Other major AI developers have not all said whether they will publish directly comparable numbers. The exact held-out dataset and evaluation procedure that other developers would need to match have not been clearly established in a shared industry standard.</p>
<p>A <strong>held-out set</strong> is test data kept out of training and used only for measurement. This matters because a score is only useful for comparison if different companies are measuring in the same way.</p>
<p>Another unknown is where safety or capability thresholds would sit. Public discussion may point toward common limits, but buyers still do not have a standard market dashboard that lets them compare suppliers on like-for-like terms.</p>
<p>It is also still not known how reliable perplexity remains across very different data mixes, model designs, or <strong>multimodal</strong> models, which are models that work with more than one type of input such as text, images, audio, or video.</p>
<p>So the practical reading is cautious. The note is useful because it supports more disciplined buying. It is not a reason to replace task testing with one chart.</p>

<h2>How to use this in a real planning cycle</h2>
<p>Many non-technical teams struggle with one simple question: should we buy now, or should we wait? A shared measure of model progress could help, but only if the business first defines what good enough looks like.</p>
<p>Start with the business outcome. Do you want faster customer support, better document review, lower manual effort in finance, or better first drafts for sales teams? Keep the goal concrete. Avoid starting with a model name.</p>
<p>Then define the minimum acceptable result. That could mean fewer escalations, faster handling time, better consistency, or lower rework. The exact target will differ by team, but the principle stays the same. Know the threshold before the demo.</p>
<p>After that, look at timing. If today’s options are already above the threshold, delay may add little value. If current tools are close but still weak in important cases, waiting for the next review point may be sensible. This is where signals about underlying model progress become useful.</p>
<p>That approach is calmer and often cheaper. It prevents a company from treating every launch as urgent. It also gives procurement a clearer reason for either moving ahead or waiting.</p>

<h2>A practical checklist for non-technical managers</h2>
<p>The better approach is not to ignore launches. It is to stop letting launches drive the whole process.</p>
<p>Start with three questions. What work must the model do? What quality level is good enough? How long can the team wait before the business value drops? Those questions are easier for non-technical managers to use than model names alone.</p>
<p>Then review suppliers in two layers. First, review product fit today. Second, review expected progress in the underlying model over the next planning window.</p>
<p>This is where a simple checklist helps:</p>
<ul>
<li>Which business task is being bought for, in plain language?</li>
<li>What failure matters most: wrong answer, delay, security risk, or budget drift?</li>
<li>Is the current model already above the minimum quality bar?</li>
<li>Would waiting one review cycle likely change the answer?</li>
<li>How much of the vendor’s demo depends on tuning around the model?</li>
<li>What flexibility exists to switch later if the market moves?</li>
<li>What internal process changes are needed for the tool to work well?</li>
<li>Who will measure success after rollout, and by what business metric?</li>
</ul>
<p>This approach gives managers a better wait-versus-buy decision. It also reduces the chance of signing long commitments because a launch created pressure.</p>

<h2>Why this discussion matters beyond one company</h2>
<p>The wider importance of this debate is simple. Buyers, builders, and regulators all want a clearer way to judge whether progress is real, comparable, and worth acting on.</p>
<p>For businesses, that means the market may slowly move toward more structured evidence and less reliance on isolated demos. That would be helpful for procurement teams, because it would make vendor comparisons more consistent.</p>
<p>It would also help internal governance. Many firms now ask risk, legal, and operations teams to review AI purchases. Those teams need plain measures and clear thresholds, not just promotional claims.</p>
<p>Even so, managers should expect a mixed market for some time. Some suppliers will talk about core model progress. Others will emphasise product features, workflow tools, or ease of deployment. A smart buying process needs to account for both.</p>

<h2>What to do next</h2>
<p>In the next planning cycle, ask the team to review AI suppliers in two layers: product fit today and expected improvement in the underlying model over the next review window. That keeps adoption decisions tied to business need while leaving room for a fast-moving market.</p>
<p>Then tighten the buying process. Set one capability threshold for the use case, one risk threshold, and one date to revisit whether waiting is smarter than switching.</p>
<p>The main point is simple. If AI progress becomes easier to measure, buying should become more deliberate. When your team needs a structured way to turn that into decisions, Gennoor Tech’s <a href="/services/training">training programs</a> can help managers and delivery teams evaluate models with clearer criteria.</p>
`,
    author: 'Gennoor Tech',
    date: '2026-11-28',
    readTime: '11 min read',
    category: 'AI Strategy',
    tags: ['AI Strategy', 'AI Procurement', 'Model Selection', 'Enterprise AI', 'AI Planning', 'AI Evaluation', 'AI Governance'],
    hashtags: ['#OpenAI', '#Perplexity', '#AIProcurement', '#AIStrategy', '#AIGovernance'],
    coverColor: '#2F3A2E',
    icon: '📊',
  }
