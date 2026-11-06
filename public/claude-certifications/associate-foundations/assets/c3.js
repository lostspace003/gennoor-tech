/* Chapters 8-10: Memory & Connectors, Model selection, Task decomposition & workflows */

chapter('ch8', '8. Memory and Connectors: Persistent context and workspace integration', 'core',
  '<h3>Maya\'s story: Week 3 – "Why doesn\'t Claude remember what I told it yesterday?"</h3>' +
  '<p>Maya spent Monday explaining Brightline\'s client tiers to Claude in detail. Tuesday she started a new chat and asked about tier-2 renewal policies — Claude had no idea what tier 2 meant. Every chat started from scratch.</p><p>Her colleague said, <i>"Enable <b>Memory</b>. Claude will remember preferences and context across chats."</i> Maya enabled it, told Claude once about the tier structure, and from then on every chat knew the tiers without her re-explaining them. She also connected <b>Google Drive</b> so Claude could pull client files directly instead of her uploading them manually every time.</p>' +
  concept('8.1 Memory: Persistent context across chats', {
    what: '<b>Memory</b> is a Claude feature that retains information across chat sessions. You can tell Claude facts, preferences, or context once, and it will remember them in future chats without you repeating.',
    why: 'Repeating the same context in every chat wastes time. Memory eliminates that repetition for recurring facts (your role, your organization\'s structure, terminology).',
    how: 'Enable Memory in Settings. Tell Claude information you want it to remember: <i>"Remember: Brightline has three client tiers. Tier 1 = enterprise ($50k+ ARR), Tier 2 = mid-market ($10k-50k), Tier 3 = SMB (under $10k)."</i> Claude stores this and references it in later chats. You can view, edit, or delete stored memories in Settings.',
    analogy: 'Like onboarding a new teammate: you explain the org structure once; they remember it for future conversations.',
    example: 'Maya told Claude her role, Brightline\'s tier definitions, and their quarterly reporting cadence. From then on, every chat started with that context already loaded.',
    when: 'Use Memory for recurring facts (org structure, terminology, your role, constraints) that apply across many chats. Do NOT use it for task-specific details (this quarter\'s numbers, this client\'s contract).',
    exam: 'Q19 tests Memory imports: Memory imports from other platforms are <b>experimental and may not incorporate all content automatically</b> (B). You can manually add missing details via Settings.' }) +
  concept('8.2 Connectors: Integrate Google Drive, Slack, and other tools', {
    what: '<b>Connectors</b> let Claude access content from external workspaces (Google Drive, Slack, etc.) so it can reference files, messages, or data without you manually uploading them every time.',
    why: 'Manual uploads are slow and error-prone. Connectors automate the fetch and keep Claude\'s context aligned with your live workspace.',
    how: 'Connect the integration in Settings (e.g., Google Drive). Claude can then search your Drive, read documents, and reference them in responses. Permissions respect your access: Claude sees only what you can see.',
    analogy: 'Like giving a contractor access to your shared Dropbox instead of emailing them files one by one.',
    example: 'Maya connected Google Drive. She asked, <i>"Summarize the Q3 client summary for Acme Corp."</i> Claude found the file in her Drive, read it, and summarized it — no manual upload.',
    exam: 'Q6 is the connector gotcha: <b>connector indexes refresh periodically, so a document revised three hours ago may not be reflected yet</b> (D). The exam contrasts this with permissions (A), Claude selecting an older version (B), or caching (C) — the real cause is index lag.' }) +
  anim('d_connector') +
  concept('8.3 Context windows: How much Claude can consider at once', {
    what: 'A <b>context window</b> is the bounded amount of text (measured in tokens) that Claude can consider in a single request, including the system instructions, conversation history, attached files, and your current input.',
    why: 'Once the conversation grows beyond the window, earlier turns are dropped or compressed. Understanding this helps you design workflows that stay within limits.',
    how: 'Long conversations eventually exceed the window. When that happens: (1) summarize the current state and start a focused follow-up, (2) use Projects to offload recurring instructions, (3) decompose large tasks into smaller prompts, or (4) use Memory for recurring facts instead of repeating them in every turn.',
    analogy: 'Like a desk: you can only fit so many papers on it at once. When it is full, you either summarize what is there and clear space, or move some papers to a filing cabinet (Memory/Projects).',
    example: 'Q38: a long conversation starts losing coherence. Recovery: <b>Summarize the current state and continue with a focused follow-up prompt</b> (B). The exam contrasts this with replacing the model (A, wrong), discarding everything (C, wasteful), or escalating (D, overkill). Q56 defines a context window correctly as (A).',
    exam: 'Context questions test whether you know: (1) it is bounded, (2) old turns drop when it fills, and (3) the fix is summarize + focus, not discard everything or switch vendors.' }) +
  kc('ch8'));

chapter('ch9', '9. Model selection: Haiku, Sonnet, Opus trade-offs', 'core',
  '<h3>Maya\'s story: Week 3 – "Why is this costing so much?"</h3>' +
  '<p>Maya used Claude Opus (the most capable model) for everything: drafting emails, summarizing one-page memos, answering quick policy questions. Her manager saw the usage report: <i>"You are burning through our rate limit on tasks a lighter model could handle. Use Opus for complex analysis; use Sonnet or Haiku for routine summaries."</i></p><p>Maya learned the <b>model trade-off</b>: more capable models are slower, consume more of the rate limit, and cost more. Lighter models are faster and cheaper but less capable on complex reasoning. The right model depends on the task.</p>' +
  concept('9.1 The model family: Haiku, Sonnet, Opus', {
    what: 'Claude offers three model tiers: <b>Haiku</b> (lightweight, fast, cheapest), <b>Sonnet</b> (balanced, mid-tier), and <b>Opus</b> (most capable, slower, highest rate-limit consumption and cost).',
    why: 'Not every task needs the most capable model. Using Opus for simple tasks wastes cost and rate limit; using Haiku for complex reasoning produces weak results. Matching the model to the task optimizes quality, speed, and cost.',
    how: 'Decision rule: Use <b>Haiku</b> for simple, well-defined tasks (summarize a short doc, extract structured data, quick Q&A). Use <b>Sonnet</b> for most production workflows (drafting reports, multi-step reasoning). Use <b>Opus</b> for one-off complex problems requiring deep reasoning, creativity, or nuanced judgment.',
    analogy: 'Like choosing a vehicle: a bike (Haiku) is fast and cheap for short trips; a sedan (Sonnet) handles daily commutes; a truck (Opus) is for heavy loads or rough terrain.',
    example: 'Maya switched to <b>Sonnet</b> for her weekly client summaries (routine multi-step task) and reserved <b>Opus</b> for analyzing a complex contract dispute (one-off deep reasoning). Haiku handled quick policy lookups.',
    exam: 'Q15: a one-off complex problem requiring extended multi-step financial reasoning → <b>Opus, positioned as most capable for advanced reasoning</b> (C). Q27: more capable models generally <b>run slower and consume more rate limit</b> (D). The exam tests whether you know the trade-off exists and can match model to task complexity.' }) +
  anim('d_model_choice') +
  concept('9.2 Aligning model selection to a recurring workflow', {
    what: 'For recurring workflows, model selection follows a sequence: define quality/latency/volume requirements, choose a candidate, test it on representative samples, select the lightest model that meets the bar, and retest when new models launch.',
    why: 'Starting with the heaviest model wastes cost; starting with the lightest risks poor quality. Testing with real samples finds the right fit.',
    how: 'Steps: (1) Define the quality bar ("summaries must include all five sections"), latency tolerance ("under 10 seconds"), and expected volume. (2) Choose a candidate model based on that profile. (3) Run representative samples and measure quality, latency, rate-limit consumption. (4) Select the lightest model that consistently meets the bar. (5) Retest when new models become available.',
    example: 'Q47: aligning model selection to a recurring workflow. Correct order: <b>3 (define bar/tolerance/volume), 4 (choose candidate), 1 (run sample and measure), 2 (select lightest that meets bar), 5 (retest when new models launch)</b> (A).',
    exam: 'Sequence questions test whether you define requirements first, test second, and select the lightest passing model (not the heaviest or most expensive).' }) +
  kc('ch9'));

chapter('ch10', '10. Task decomposition and workflow design', 'core',
  '<h3>Maya\'s story: Week 3 – "This request is too big for one prompt"</h3>' +
  '<p>Maya\'s manager asked her to <i>"Redesign the new-hire onboarding process."</i> Maya typed that into Claude. Claude gave a vague 3-paragraph overview. She tried again with more detail — the output was slightly better but still shallow.</p><p>Her colleague said, <i>"That request has three distinct deliverables: a process map, supporting training materials, and a measurement plan. Break it into three focused prompts; each one will be stronger than trying to do all three at once."</i> Maya decomposed the task. Each prompt produced a specific, well-structured deliverable. She combined them into a final proposal.</p>' +
  concept('10.1 When to decompose a task', {
    what: '<b>Task decomposition</b> is breaking a broad request into multiple focused sub-prompts, each producing one specific deliverable, instead of asking Claude to do everything in one go.',
    why: 'A single prompt trying to do too much produces shallow, generic outputs. Focused prompts let Claude apply its full reasoning to each piece.',
    how: 'Ask: Does this request require multiple distinct outputs (e.g., a map + materials + a plan)? If yes, decompose. Write one prompt per deliverable. Combine the outputs at the end.',
    analogy: 'Like a work breakdown structure: you do not ask a contractor to "build the house" in one step. You break it into foundation, framing, electrical, plumbing — each one done well.',
    example: 'Q44: "redesign new-hire onboarding" requires <b>multiple distinct outputs: a process map, supporting materials, and a measurement plan</b> (D). That signals decomposition will help. The exam contrasts this with single structured documents (A), familiar formats (B, C) — those do not need decomposition.',
    exam: 'Decomposition questions test whether you recognize <i>multiple distinct deliverables</i> as the signal. One deliverable, even if complex → single prompt. Multiple deliverables → decompose.' }) +
  anim('d_decompose') +
  concept('10.2 Over-decomposition: When you break it too small', {
    what: 'Breaking a task into too many tiny steps fragments naturally connected ideas and makes the output choppy and hard to follow.',
    why: 'Over-decomposition is as bad as under-decomposition. Fifteen one-sentence steps is worse than three cohesive sections.',
    how: 'Balance: decompose enough to give Claude focus, but not so much that related ideas are torn apart. If the output feels fragmented, consolidate related steps into fewer cohesive sections.',
    example: 'Q24: a procedure decomposed into fifteen narrow steps looks fragmented. Fix: <b>Consolidate related steps into fewer cohesive sections that group naturally connected ideas</b> (A). The exam contrasts this with merging steps by sequence (B, wrong) or just adding headings (D, cosmetic fix).',
    exam: 'Watch for "fragmented," "choppy," "related ideas split apart" as signals of over-decomposition. The fix is always consolidate, not add more structure on top.' }) +
  concept('10.3 Workflow hand-offs: Defining what Claude produces and what the human reviews', {
    what: 'A reliable human-in-the-loop hand-off documents both <b>what Claude is expected to produce</b> (scope, format, required elements) and <b>the specific verification criteria the human reviewer must check</b> before approving.',
    why: 'Vague hand-offs ("review this for quality") lead to inconsistent reviews and missed issues. Explicit criteria ensure every reviewer checks the same things.',
    how: 'Write two checklists: (1) Claude\'s deliverable spec (sections, format, tone, length). (2) Human reviewer\'s checklist (verify facts against source, check tone matches brand guide, confirm all required sections present, etc.). Document both in the workflow.',
    analogy: 'Like a QA checklist on a production line: the spec says what the product should be; the QA checklist says what the inspector verifies.',
    example: 'Q4: designing a hand-off between Claude drafting and a human reviewer. Answer: <b>Define explicit criteria for what Claude produces and what the human reviewer must check before approval, documented in the workflow</b> (B). The exam contrasts this with leaving reviewer checks unspecified (C) or letting each reviewer decide (D).',
    exam: 'Hand-off questions test whether you know both sides must be explicit: what AI does + what human checks. One-sided definitions (only Claude\'s spec or only reviewer criteria) are incomplete.' }) +
  concept('10.4 Improving recurring workflows', {
    what: 'Two changes meaningfully improve recurring workflows: (1) centralizing standard reference material into a Project (avoiding repetition), and (2) adding a quality check that gates outputs before downstream use.',
    why: 'Repetition wastes time; missing quality gates let bad outputs through.',
    how: 'Audit the workflow: What do people paste into every prompt? → Move it to a Project. Where do outputs go unchecked into the next step? → Add a verification gate.',
    example: 'Q3: which two changes improve a recurring workflow? <b>(A) Extracting standard reference material into a Project</b> and <b>(D) adding a quality check before outputs enter downstream processes</b>. The exam contrasts these with cosmetic changes (section headings, workspace names) that do not reduce rework or catch errors.',
    exam: 'Workflow improvement questions test whether you recognize <i>structural</i> fixes (centralize repetition, gate quality) vs. <i>cosmetic</i> ones (rename things, reorganize headings).' }) +
  kc('ch10'));
