/* Chapter 1: Cover & Introduction */
chapter('ch1', 'Claude Certified Developer – Foundations', null,
'<div class="cover">' +
'<h1>Claude Certified Developer – Foundations</h1>' +
'<p class="subtitle">CCDV-F | Official Anthropic Certification Prep</p>' +
'<p class="tagline">Master production Claude development from first API call to deployed agent fleet</p>' +
'</div>' +

'<h2>About this certification</h2>' +
'<p><b>Claude Certified Developer – Foundations (CCDV-F)</b> validates that you can build, deploy, and operate production Claude applications. The exam tests your ability to choose the right API patterns, handle errors, manage costs, implement security controls, and navigate real-world architectural trade-offs.</p>' +

'<h3>Exam format</h3>' +
tbl(['Aspect', 'Details'], [
  ['Questions', '53 single-choice questions'],
  ['Style', 'Scenario-heavy: "You are building X and need to Y. How would you Z?"'],
  ['Duration', '90 minutes'],
  ['Passing score', '70% (37 correct)'],
  ['Topics', 'Messages API, async integration, Batch API, prompt caching, structured output, tool use, format drift, context management, Agent SDK, multi-agent orchestration, MCP servers, Claude Code, prompt security, deployment & operations']
]) +

'<h3>Who should take this</h3>' +
'<ul>' +
'<li><b>Software engineers</b> building Claude-powered features in production apps</li>' +
'<li><b>Backend/full-stack developers</b> integrating LLMs into existing services</li>' +
'<li><b>AI/ML engineers</b> shipping agentic workflows at scale</li>' +
'<li><b>DevOps/SRE teams</b> deploying and operating Claude applications</li>' +
'</ul>' +

'<h2>Your journey: TicketFlow</h2>' +
'<p>This guide follows <b>one continuous story</b>: you join <b>Loomline</b>, a startup building <b>TicketFlow</b>—a customer-support automation product—as its AI engineer. Over 15 chapters you take TicketFlow from prototype to production:</p>' +

'<h3>The TicketFlow roadmap</h3>' +
'<ol>' +
'<li><b>Week 1:</b> First Messages API call classifying support tickets</li>' +
'<li><b>Week 2:</b> Async Python service handling concurrent requests</li>' +
'<li><b>Week 3:</b> Overnight batch processing 10K tickets at 50% cost savings</li>' +
'<li><b>Week 4:</b> Prompt caching cuts multi-turn conversation costs by 90%</li>' +
'<li><b>Week 5:</b> Structured JSON output with schema validation</li>' +
'<li><b>Week 6:</b> Custom tool integration (lookup_customer DB tool)</li>' +
'<li><b>Week 7:</b> Format drift debugging after 15-turn conversations</li>' +
'<li><b>Week 8:</b> Checkpointing for fault-tolerant long-running agents</li>' +
'<li><b>Week 9:</b> Multi-agent orchestrator: classify → resolve → escalate</li>' +
'<li><b>Week 10:</b> MCP server for shared Jira/CRM integrations</li>' +
'<li><b>Week 11:</b> Claude Code Skills and PreToolUse hooks for safety</li>' +
'<li><b>Week 12:</b> Prompt injection defense on untrusted user input</li>' +
'<li><b>Week 13:</b> Production deployment (BYOC), monitoring, CI/CD</li>' +
'<li><b>Exam prep:</b> Playbook of "if you see X → answer Y" patterns</li>' +
'<li><b>Launch:</b> TicketFlow ships to production</li>' +
'</ol>' +

'<h3>How to use this guide</h3>' +
'<ul>' +
'<li><b>Read every concept card</b> (what/why/how/analogy/example). The exam tests "why this choice" more than "what is this."</li>' +
'<li><b>Run the code examples</b> in <code>examples/*.py</code> (mock API keys included). Seeing it work cements the pattern.</li>' +
'<li><b>Play the animations</b> to visualize request flows, retry loops, tool dispatch, and multi-agent hand-offs.</li>' +
'<li><b>Try every knowledge check</b> before opening the answer. Self-testing is the strongest learning signal.</li>' +
'<li><b>Read exam notes</b> for common traps (e.g., "temperature doesn\'t fix context window").</li>' +
'<li><b>Take the mock exam</b> in chapter 15 under time pressure (90 minutes).</li>' +
'</ul>' +

'<h3>What this guide covers</h3>' +
tbl(['Chapter', 'TicketFlow milestone', 'Exam weight'], [
  ['2', 'First API call: Messages API basics', 'High'],
  ['3', 'Async service: AsyncAnthropic + retry', 'High'],
  ['4', 'Batch job: overnight classification', 'Medium'],
  ['5', 'Multi-turn optimization: prompt caching', 'High'],
  ['6', 'Custom tools: lookup_customer', 'High'],
  ['7', 'Format drift & context management', 'High'],
  ['8', 'Checkpointing for fault tolerance', 'Medium'],
  ['9', 'Multi-agent orchestration', 'Medium'],
  ['10', 'MCP servers for shared integrations', 'Medium'],
  ['11', 'Claude Code: Skills, hooks, CLAUDE.md', 'Medium'],
  ['12', 'Prompt injection defense', 'High'],
  ['13', 'Deployment, monitoring, CI/CD', 'High']
]) +

'<h3>Prerequisites</h3>' +
'<ul>' +
'<li>Python or TypeScript fluency (examples are Python)</li>' +
'<li>REST API experience (HTTP, JSON, auth headers)</li>' +
'<li>Basic async programming (async/await)</li>' +
'<li>Version control (Git)</li>' +
'<li>No prior Claude/LLM experience required—this guide teaches from scratch</li>' +
'</ul>' +

note('<b>Study tip:</b> The exam is open-book but time-limited. Practice <i>finding</i> answers quickly (Ctrl+F this guide, search docs) rather than memorizing. Speed under pressure is the skill.', 'exam') +

'<p><b>Ready?</b> Chapter 2 starts your first day at Loomline. You\'re handed a prototype ticket classifier and told, "Make it production-ready." Let\'s ship TicketFlow.</p>',
{ nocheck: true });
