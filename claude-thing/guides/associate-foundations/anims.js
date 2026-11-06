/* Step-through diagram animations */
(function () {
  function n(id, label, sub, x, y) { return { id: id, label: label, sub: sub, x: x, y: y }; }
  function st(on, edge, text) { return { on: on, edge: edge, text: text }; }
  var A = {};

  A.d_description = { title: '4Ds: Description competency',
    nodes: [n('u', 'Use case', 'team task', 80, 150), n('c', 'Capabilities', 'what Claude does', 250, 80), n('l', 'Limitations', 'what it cannot do', 250, 220), n('o', 'Oversight', 'human review', 450, 80), n('s', 'Stakeholder', 'informed decision', 650, 150)],
    edges: [['u', 'c'], ['u', 'l'], ['c', 's'], ['l', 's'], ['o', 's']],
    steps: [
      st(['u'], null, 'You identify a use case: "Use Claude to draft quarterly client summaries."'),
      st(['u', 'c'], ['u', 'c'], 'Explain what Claude reliably produces: "Claude drafts a structured summary from the data file in under 2 minutes."'),
      st(['u', 'l'], ['u', 'l'], 'Name known limitations: "Claude may hallucinate stats or misinterpret nuanced contract terms."'),
      st(['c', 'o'], null, 'Specify human oversight: "I verify every number against the source file and check tone against our brand guide."'),
      st(['c', 'l', 'o', 's'], ['o', 's'], 'Description delivered: stakeholder understands capabilities AND limits AND oversight, calibrated to their AI familiarity.')]};

  A.d_delegation = { title: '4Ds: Delegation decision tree',
    nodes: [n('t', 'Task', 'workflow step', 90, 150), n('h', 'Needs human\njudgment/empathy?', 'creativity, nuance', 280, 70), n('r', 'Reversible?\nLow consequence?', 'error impact', 280, 230), n('k', 'Keep human', 'do not delegate', 520, 70), n('d', 'Delegate to Claude', 'with review', 520, 180), n('s', 'Strict review', 'high-consequence gate', 720, 230)],
    edges: [['t', 'h'], ['t', 'r'], ['h', 'k', 'Yes'], ['h', 'r', 'No'], ['r', 'd', 'Yes'], ['r', 's', 'No'], ['d', 's']],
    steps: [
      st(['t'], null, 'You have a workflow step to evaluate: "Decide whether this client renewal is at risk."'),
      st(['t', 'h'], ['t', 'h'], 'Ask: Does this need uniquely human judgment, empathy, or creativity? (Yes for risk assessment.)'),
      st(['h', 'k'], ['h', 'k'], 'If yes → Keep it human-owned. (Claude can inform the decision with a summary, but you decide.)'),
      st(['t', 'r'], ['t', 'r'], 'For tasks that do not need human judgment, ask: Is the error reversible and low-consequence?'),
      st(['r', 'd'], ['r', 'd'], 'If yes (e.g., draft a summary) → Delegate to Claude with human review before sharing.'),
      st(['r', 's'], ['r', 's'], 'If no (high-consequence, irreversible, e.g., issue a legal commitment) → Require strict human review or keep human-only.')]};

  A.d_diligence = { title: '4Ds: Diligence as sustained habit',
    nodes: [n('o', 'Onboarding', 'policy training', 90, 150), n('h', 'Habit', 'every output, every day', 300, 150), n('g', 'Gap detection', 'actual vs. policy', 510, 150), n('c', 'Corrective action', 'close gaps', 710, 150)],
    edges: [['o', 'h'], ['h', 'g'], ['g', 'c'], ['c', 'h', 'feedback loop']],
    steps: [
      st(['o'], null, 'You complete policy training during onboarding: "Do not enter PII without redaction."'),
      st(['o', 'h'], ['o', 'h'], 'Diligence means applying that policy every single time, not just when someone is watching.'),
      st(['h', 'g'], ['h', 'g'], 'You identify gaps between your actual usage and policy: "I sometimes skip the PII check for low-stakes drafts."'),
      st(['g', 'c'], ['g', 'c'], 'You take corrective action: build a checklist, use it on every output.'),
      st(['c', 'h'], ['c', 'h'], 'The loop continues: sustained professional habit, not one-time compliance.')]};

  A.d_discernment = { title: '4Ds: Discernment and fact-checking',
    nodes: [n('o', 'Claude output', 'claim or stat', 90, 150), n('p', 'Pinpoint claim', 'what to verify', 270, 150), n('v', 'Verify vs.\nprimary source', 'authoritative check', 470, 150), n('t', 'True', 'accept', 680, 80), n('f', 'False/unsupported', 'regenerate or exclude', 680, 220)],
    edges: [['o', 'p'], ['p', 'v'], ['v', 't', 'matches'], ['v', 'f', 'conflicts']],
    steps: [
      st(['o'], null, 'Claude returns: "Competitor A grew 300% last year (source: TechPulse, MarketWatch)."'),
      st(['o', 'p'], ['o', 'p'], 'Pinpoint the claim: "300% growth" — that is striking and consequential.'),
      st(['p', 'v'], ['p', 'v'], 'Verify against a primary source: search for the original study or company filing.'),
      st(['v', 'f'], ['v', 'f'], 'Result: TechPulse article does not exist; MarketWatch says 30%, not 300%. The claim is false (hallucination).'),
      st(['f'], null, 'Regenerate with stricter constraint: "Use only the uploaded competitor file; if a stat is not listed, say so."')]};

  A.d_artifact = { title: 'Artifact workflow',
    nodes: [n('r', 'Request', 'team needs reusable doc', 80, 150), n('c', 'Claude drafts', 'as Artifact', 260, 150), n('p', 'Side panel', 'stable reference', 450, 150), n('e', 'Edit/iterate', 'in place', 640, 150), n('s', 'Share link', 'team access', 800, 150)],
    edges: [['r', 'c'], ['c', 'p'], ['p', 'e'], ['e', 'p', 'update'], ['p', 's']],
    steps: [
      st(['r'], null, 'Your manager asks for a 10-step onboarding procedure the team will update quarterly.'),
      st(['r', 'c'], ['r', 'c'], 'You prompt: "Create an Artifact with our 10-step client onboarding procedure."'),
      st(['c', 'p'], ['c', 'p'], 'Claude renders it as a standalone document in the side panel, separate from chat.'),
      st(['p', 'e'], ['p', 'e'], 'Two weeks later, you open the same Artifact and ask Claude to add a step.'),
      st(['e', 'p'], ['e', 'p'], 'The Artifact updates in place; the team sees the new version at the same link.'),
      st(['p', 's'], ['p', 's'], 'You share the link with teammates who can view, comment, or edit depending on permissions.')]};

  A.d_prompt = { title: 'Well-structured prompt anatomy',
    nodes: [n('r', 'Role', '"You are X"', 100, 100), n('c', 'Context', 'audience, goal', 300, 100), n('t', 'Task', 'specific deliverable', 500, 100), n('f', 'Format', 'structure, length', 700, 100), n('o', 'Output', 'consistent result', 400, 250)],
    edges: [['r', 'o'], ['c', 'o'], ['t', 'o'], ['f', 'o']],
    steps: [
      st(['r'], null, 'Role: "You are a contract analyst." — sets expertise and perspective.'),
      st(['c'], null, 'Context: "for our CFO, before the board meeting" — explains why and who reads it.'),
      st(['t'], null, 'Task: "Summarize payment terms, renewal dates, and liability caps" — specific deliverable.'),
      st(['f'], null, 'Format: "1-page summary, three sections, bullet points" — structure constraint.'),
      st(['r', 'c', 't', 'f', 'o'], [['r', 'o'], ['c', 'o'], ['t', 'o'], ['f', 'o']], 'All four elements together → Claude produces a consistent, well-structured output that matches your need.')]};

  A.d_iteration = { title: 'Iterative refinement loop',
    nodes: [n('o', 'Output', 'first draft', 90, 150), n('d', 'Diagnose', 'pinpoint flaws', 260, 150), n('r', 'Revise prompt', 'targeted fix', 450, 150), n('v', 'Verify', 'check the fix', 640, 150), n('a', 'Accept', 'done', 800, 80), n('i', 'Iterate again', 'repeat loop', 800, 220)],
    edges: [['o', 'd'], ['d', 'r'], ['r', 'v'], ['v', 'a', 'fixed'], ['v', 'i', 'not yet'], ['i', 'd', 'loop']],
    steps: [
      st(['o'], null, 'You receive the first draft: too long, wrong tone, missing a metric.'),
      st(['o', 'd'], ['o', 'd'], 'Diagnose: "3 pages, need 1 page. Contractions present; guide forbids them. Churn metric missing."'),
      st(['d', 'r'], ['d', 'r'], 'Revise: "Shorten to 1 page. Use formal tone, no contractions. Add churn metric in the table."'),
      st(['r', 'v'], ['r', 'v'], 'Verify: The new output is 1 page, no contractions, churn metric present. Problem solved.'),
      st(['v', 'a'], ['v', 'a'], 'Accept the output and move on.'),
      st(['v', 'i'], ['v', 'i'], 'If the fix did not work or introduced a new issue, diagnose again and iterate.')]};

  A.d_project = { title: 'Project structure',
    nodes: [n('c', 'Custom instructions', 'recurring rules', 120, 100), n('k', 'Knowledge', 'uploaded docs', 360, 100), n('s', 'Skills', 'workflows', 600, 100), n('h', 'Chat', 'inherits all three', 360, 250)],
    edges: [['c', 'h'], ['k', 'h'], ['s', 'h']],
    steps: [
      st(['c'], null, 'Custom instructions: "You are a client-success analyst. Tone: professional, no contractions. Structure: 5 sections."'),
      st(['k'], null, 'Knowledge: uploaded style guide, terminology glossary, templates.'),
      st(['s'], null, 'Skills: a course-design or research-synthesis Skill, if relevant.'),
      st(['c', 'k', 's', 'h'], [['c', 'h'], ['k', 'h'], ['s', 'h']], 'Every chat in the Project automatically inherits the instructions, knowledge, and Skills — no repetition.')]};

  A.d_code_exec = { title: 'Code Execution workflow',
    nodes: [n('u', 'Upload data', 'spreadsheet/CSV', 90, 150), n('p', 'Prompt', '"compute totals"', 260, 150), n('c', 'Claude writes code', 'Python', 440, 150), n('e', 'Code executes', 'sandbox', 620, 150), n('v', 'Verify result', 'check vs. source', 780, 150)],
    edges: [['u', 'p'], ['p', 'c'], ['c', 'e'], ['e', 'v']],
    steps: [
      st(['u'], null, 'You upload a 50-row expense spreadsheet.'),
      st(['u', 'p'], ['u', 'p'], 'You prompt: "Compute the total of column D (Amount)."'),
      st(['p', 'c'], ['p', 'c'], 'Claude writes Python code: df["Amount"].sum() and shows you the code.'),
      st(['c', 'e'], ['c', 'e'], 'The code runs in a sandboxed environment and returns the exact total: $44,287.'),
      st(['e', 'v'], ['e', 'v'], 'You verify: spot-check a few rows, confirm the code loaded the right column, accept the result.')]};

  A.d_connector = { title: 'Connector (Google Drive) workflow',
    nodes: [n('s', 'Settings', 'connect Drive', 90, 150), n('a', 'Auth', 'grant access', 260, 150), n('i', 'Index', 'periodic refresh', 450, 150), n('p', 'Prompt', '"summarize X file"', 640, 150), n('f', 'Fetch & respond', 'Claude reads indexed file', 800, 150)],
    edges: [['s', 'a'], ['a', 'i'], ['i', 'p'], ['p', 'f']],
    steps: [
      st(['s'], null, 'You go to Settings and connect the Google Drive integration.'),
      st(['s', 'a'], ['s', 'a'], 'You authorize Claude to access files you can see (respects your Drive permissions).'),
      st(['a', 'i'], ['a', 'i'], 'The connector builds an index of your files; it refreshes periodically (not real-time).'),
      st(['i', 'p'], ['i', 'p'], 'You prompt: "Summarize the Q3 client summary for Acme Corp."'),
      st(['p', 'f'], ['p', 'f'], 'Claude searches the index, fetches the file, reads it, and summarizes. If a file was revised recently, the index may show the older version until the next refresh.')]};

  A.d_model_choice = { title: 'Model selection decision',
    nodes: [n('t', 'Task', 'what you need', 90, 150), n('s', 'Simple/routine?', 'policy Q&A, extraction', 300, 80), n('c', 'Complex/one-off?', 'deep reasoning', 300, 220), n('h', 'Haiku or Sonnet', 'fast, cheaper', 520, 80), n('o', 'Opus', 'most capable', 520, 220), n('v', 'Verify quality', 'test on samples', 700, 150)],
    edges: [['t', 's'], ['t', 'c'], ['s', 'h'], ['c', 'o'], ['h', 'v'], ['o', 'v']],
    steps: [
      st(['t'], null, 'You have a task: "Analyze this multi-step financial scenario."'),
      st(['t', 's'], ['t', 's'], 'Is it simple and routine? (No — it is complex and one-off.)'),
      st(['t', 'c'], ['t', 'c'], 'Complex, deep reasoning, one-off → candidate is Opus.'),
      st(['c', 'o'], ['c', 'o'], 'Choose Opus: most capable for advanced reasoning.'),
      st(['o', 'v'], ['o', 'v'], 'Verify on representative samples: does Opus meet your quality bar? If yes, use it. If Sonnet suffices, downgrade to save cost.')]};

  A.d_decompose = { title: 'Task decomposition',
    nodes: [n('r', 'Request', '"redesign onboarding"', 90, 150), n('m', 'Map', 'process flow', 300, 80), n('t', 'Materials', 'training docs', 300, 150), n('p', 'Plan', 'measurement', 300, 220), n('c', 'Combine', 'final proposal', 550, 150)],
    edges: [['r', 'm'], ['r', 't'], ['r', 'p'], ['m', 'c'], ['t', 'c'], ['p', 'c']],
    steps: [
      st(['r'], null, 'Broad request: "Redesign the new-hire onboarding process."'),
      st(['r', 'm'], ['r', 'm'], 'Decompose into focused sub-prompts. Sub-task 1: "Create a process map for onboarding steps."'),
      st(['r', 't'], ['r', 't'], 'Sub-task 2: "Draft supporting training materials for each step."'),
      st(['r', 'p'], ['r', 'p'], 'Sub-task 3: "Design a measurement plan with KPIs to track onboarding success."'),
      st(['m', 't', 'p', 'c'], [['m', 'c'], ['t', 'c'], ['p', 'c']], 'Combine the three outputs into a final onboarding redesign proposal. Each focused prompt produced a stronger result than one big prompt would have.')]};

  A.d_data_handling = { title: 'Data sensitivity workflow',
    nodes: [n('d', 'Document', 'mixed data', 90, 150), n('c', 'Classify', 'identify sensitive fields', 260, 150), n('r', 'Redact', 'remove or mask PII', 450, 150), n('p', 'Peer review', 'confirm complete', 640, 150), n('s', 'Submit', 'safe to prompt', 800, 150)],
    edges: [['d', 'c'], ['c', 'r'], ['r', 'p'], ['p', 's']],
    steps: [
      st(['d'], null, 'You have a spreadsheet with employee names, salary, and project data.'),
      st(['d', 'c'], ['d', 'c'], 'Classify: names + salary = sensitive PII. Project data = safe.'),
      st(['c', 'r'], ['c', 'r'], 'Redact: replace names with [EMPLOYEE_ID], salary with [SALARY], keep project data.'),
      st(['r', 'p'], ['r', 'p'], 'Peer review: a teammate confirms no PII leaked through.'),
      st(['p', 's'], ['p', 's'], 'Submit the redacted version to Claude. Safe to prompt.')]};

  A.d_evaluation = { title: 'Evaluation workflow',
    nodes: [n('c', 'Define criteria', 'what matters', 90, 150), n('t', 'Set threshold', 'acceptable bar', 270, 150), n('o', 'Output', 'Claude generates', 460, 150), n('s', 'Score vs. criteria', 'checklist', 650, 150), n('a', 'Accept or reject', 'pass/fail', 810, 150)],
    edges: [['c', 't'], ['t', 'o'], ['o', 's'], ['s', 'a']],
    steps: [
      st(['c'], null, 'Before generating anything, define criteria: "Must include all 5 sections, facts match source, formal tone, 1 page."'),
      st(['c', 't'], ['c', 't'], 'Set threshold: "All 5 sections present AND 100% factual accuracy = acceptable."'),
      st(['t', 'o'], ['t', 'o'], 'Generate the output with Claude.'),
      st(['o', 's'], ['o', 's'], 'Score against the checklist: sections present? Facts verified? Tone formal? Length 1 page?'),
      st(['s', 'a'], ['s', 'a'], 'If it meets the threshold, accept. If not, iterate or reject.')]};

  window.ANIMS = A;
})();
