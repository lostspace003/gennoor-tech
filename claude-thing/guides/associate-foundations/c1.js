/* Chapters 2-4: AI Fluency 4Ds, Artifacts, Prompting fundamentals */

chapter('ch2', '2. The AI Fluency Framework: The 4Ds', 'core',
  '<h3>Maya\'s story: Day 1 – "What does Claude actually do?"</h3>' +
  '<p>Maya\'s manager handed her a stack of quarterly client reports and said, "See if Claude can help." Maya had no idea where to start. She opened Claude and typed, <i>"Help me with reports."</i> Claude replied with generic advice about report structure. Maya realized she needed a framework for <b>how</b> to work with AI, not just what to type.</p><p>She found Anthropic\'s <b>AI Fluency Framework</b>, built around four competencies knowledge workers need: <b>Description, Delegation, Diligence, and Discernment</b>. Each one answered a question she had faced that morning.</p>' +
  concept('2.1 Description: Explain what Claude can and cannot do', {
    what: '<b>Description</b> is the competency of accurately explaining Claude\'s capabilities, limitations, and the human oversight that remains in place, calibrated to your audience\'s familiarity with AI.',
    why: 'Stakeholders (managers, clients, teammates) need realistic expectations. Overpromising creates disappointment; underestimating it wastes opportunities. Transparent description builds trust.',
    how: 'When explaining a Claude use case, state three things: (1) what Claude reliably produces for this task, (2) known limitations or failure modes, and (3) which human review or decision-making stays in place. Tailor the detail to whether your audience has used AI before.',
    analogy: 'Like a job reference: you describe what the candidate is great at, where they need support, and what supervision looks like — not a sales pitch, not a pessimistic warning, but a balanced picture.',
    example: 'Maya told her manager: <i>"Claude can draft our quarterly summary from the data we upload, but I\'ll need to verify every number against the source file and check that the narrative matches our client\'s terminology. It won\'t replace my review; it gives me a faster first draft."</i>',
    when: 'Use Description when proposing a new use case, reporting results to a sponsor, or onboarding a teammate. It is the foundation of the other three Ds.',
    exam: 'Exam questions on Description test whether you can frame a use case transparently — naming capabilities <i>and</i> limitations together, and avoiding both overconfidence ("Claude does it all") and excessive caution ("never trust AI"). Q21 and Q46 are pure Description scenarios.' }) +
  anim('d_description') +
  concept('2.2 Delegation: Decide what tasks to give Claude vs. keep human', {
    what: '<b>Delegation</b> is the competency of deciding which workflow steps are appropriate to delegate to Claude and which must remain with human staff, based on task characteristics and consequences.',
    why: 'Not every task should be automated. Some require human creativity, empathy, or accountability that Claude cannot provide. Others carry risks (e.g., legal liability, PII exposure) that make delegation unsafe without controls.',
    how: 'Two criteria guide Delegation decisions: (1) <b>Does the task need uniquely human judgment, empathy, or creativity?</b> If yes, keep it human or use Claude only as a draft. (2) <b>Is the task reversible, and what is the consequence of an error?</b> High-consequence irreversible tasks (e.g., legal commitments, clinical decisions, promotion rulings) require human ownership.',
    analogy: 'Like assigning work to an intern: you delegate research and drafts, but you keep final sign-off, client-facing commitments, and judgment calls that could affect someone\'s livelihood.',
    example: 'Maya delegated "draft the metrics summary from the uploaded spreadsheet" to Claude, but kept "decide whether the client renewal is at risk" as her own judgment call, informed by Claude\'s summary.',
    when: 'Use Delegation when designing a new workflow, auditing an existing one, or evaluating whether a proposed use case crosses a line.',
    exam: 'Q26 is the canonical Delegation question: it asks which two criteria inform whether to delegate. Q32 and Q36 test use-case appropriateness (is this safe to delegate?). The exam often pairs a safe use case (e.g., "draft training summary from approved docs") with an unsafe one ("make promotion decisions").' }) +
  anim('d_delegation') +
  concept('2.3 Diligence: Apply policies and quality checks consistently', {
    what: '<b>Diligence</b> is the competency of applying organizational AI policies, quality standards, and verification steps consistently as a sustained professional habit, not just during audits or high-visibility tasks.',
    why: 'One-off compliance during onboarding is not enough. Policies protect the organization and individuals (e.g., PII rules, bias checks). Diligence means checking <i>every</i> output, not only when someone is watching.',
    how: 'Treat AI governance like expense-report rules: you follow them because they are policy, not because you feel like it that day. Identify gaps between actual usage and policy, and close them. Build checklists for recurring tasks.',
    analogy: 'Like hand-washing in healthcare: not just when a supervisor is present, but every single time, because the risk (infection) does not pause when no one is looking.',
    example: 'Maya built a checklist: before sending any Claude output externally, she verifies no PII leaked, the facts match the source, and the tone matches Brightline\'s voice guide. She uses it on every client report, even low-stakes ones.',
    when: 'Diligence applies to every workflow, every output, every day. It is the "how consistently do you actually do this" competency.',
    exam: 'Q57 is the pure Diligence question: it contrasts one-time onboarding vs. sustained habit. Q18 tests whether you respect policy boundaries (the "do not enter investigation data" rule) even when workarounds exist.' }) +
  anim('d_diligence') +
  concept('2.4 Discernment: Validate outputs and catch errors', {
    what: '<b>Discernment</b> is the competency of critically evaluating Claude outputs for factual accuracy, hallucinations, unsupported claims, and misalignment with your criteria before relying on or sharing them.',
    why: 'Claude is a language model: it predicts plausible text, not truth. It can hallucinate sources, invent statistics, or confidently state falsehoods. Discernment prevents those errors from reaching clients or decision-makers.',
    how: 'For every output: (1) verify facts against authoritative sources (not other AI summaries), (2) check that claims are supported by the material you provided, (3) compare the output to your task criteria (does it answer what you asked?), and (4) flag ambiguous or suspiciously confident assertions for deeper review.',
    analogy: 'Like fact-checking a draft from a very confident but occasionally wrong colleague: you trust the structure and prose, but you independently verify every claim before it goes into the final report.',
    example: 'Maya asked Claude to summarize competitor pricing. Claude cited "three major competitors at $X-Y per seat." Maya checked: one competitor was real, two were hallucinated. She regenerated the prompt with <i>"use only the uploaded competitor sheet; if a competitor is not listed, say so."</i>',
    when: 'Apply Discernment to every output before you rely on it, share it, or act on it. It is especially critical for external-facing content, financial data, and anything cited as fact.',
    exam: 'Q5, Q48, and Q60 are Discernment questions: they test whether you know to verify a claim against a primary source (not accept secondary repetition), locate original studies, and pinpoint suspected hallucinations before escalating.' }) +
  anim('d_discernment') +
  examNote('The 4Ds structure repeats across the exam. When you see "preparing a stakeholder communication" → Description. "Deciding which steps to delegate" → Delegation. "Applying policy consistently" → Diligence. "Validating a striking claim" → Discernment. Recognizing the D being tested is half the battle.') +
  kc('ch2'));

chapter('ch3', '3. Artifacts: Standalone documents you can save and share', 'core',
  '<h3>Maya\'s story: Day 3 – "Why is my procedure buried in chat scrollback?"</h3>' +
  '<p>Maya drafted a 10-step client onboarding procedure with Claude. She copied it into an email, but halfway through writing the email she realized a step was wrong. She scrolled back through 30 chat turns to find the procedure again. Her manager asked for an updated version two days later — Maya had no idea which chat it was in.</p><p>Her colleague showed her <b>Artifacts</b>: Claude can render the procedure as a <b>standalone document in a dedicated panel</b>, separate from the chat. The team can open it, edit it, save it, and come back to it later. No more hunting through scrollback.</p>' +
  concept('3.1 What Artifacts are and when to use them', {
    what: 'An <b>Artifact</b> is a standalone piece of work (document, code, chart, diagram) that Claude renders in a dedicated side panel, separate from the chat transcript. Artifacts persist across sessions, can be edited in place, versioned, and shared via a stable link.',
    why: 'Chat responses scroll away and get buried. Artifacts give your work a <b>permanent home</b>. Use them when the output is something the team will reference, update, or iterate on across multiple review cycles — not one-off answers.',
    how: 'Ask Claude to produce the content <b>as an Artifact</b>. Claude decides whether the request fits (substantial, reusable content) and renders it in the side panel. You can edit the Artifact directly, save versions, and share the link with teammates who can view, comment, or edit depending on permissions.',
    analogy: 'Chat is like a conversation transcript. An Artifact is like the whiteboard sketch you save as a photo so everyone can reference it later.',
    example: 'Maya asked: <i>"Create an Artifact with our 10-step client onboarding procedure."</i> Claude rendered it as a document in the side panel. Two days later, Maya opened the same Artifact, asked Claude to add a step, and shared the updated link with her manager.',
    when: 'Use Artifacts for: procedures, templates, reports, code, charts, project plans — anything the team will <b>reference across multiple sessions</b>. Do NOT use Artifacts for quick one-off answers ("What is our PTO policy?") — those stay in chat.',
    exam: 'Q1 is the canonical Artifact question: it contrasts generating a procedure in chat (bad: gets lost) vs. as an Artifact (good: stable reference). The exam tests whether you recognize that Artifacts are for <b>reusable, team-facing work</b>, not ephemeral answers.' }) +
  anim('d_artifact') +
  concept('3.2 Artifacts vs. chat responses', {
    what: 'The key distinction: <b>chat responses</b> are conversational turns that answer a question or explain something. <b>Artifacts</b> are deliverable work products the team will save, iterate, and reference.',
    why: 'Choosing wrong wastes time. Putting a procedure in chat means you lose it; rendering a one-sentence answer as an Artifact is overkill.',
    how: 'Ask: "Will the team come back to this later to edit, reference, or share it?" If yes → Artifact. If no (one-time answer, quick clarification) → chat response.',
    analogy: 'A chat response is like a Slack DM. An Artifact is like a Google Doc you share with the team.',
    example: '<b>Chat:</b> "What does our remote-work policy say?" — Claude answers in chat. <b>Artifact:</b> "Draft a remote-work FAQ the HR team can publish" — Claude creates an Artifact.',
    exam: 'The exam pairs use cases where Artifacts fit (team procedure, recurring report template) against ones where chat is fine (quick policy lookup). Always ask: <b>is this a deliverable someone will reference later?</b>' }) +
  tbl(['Scenario', 'Output type', 'Why'], [
    ['Draft a weekly status template the team will reuse', 'Artifact', 'Reusable deliverable; team iterates on it'],
    ['"What is the PTO accrual rate?"', 'Chat response', 'One-off factual answer; no iteration'],
    ['Create a 5-section project proposal for stakeholder review', 'Artifact', 'Multi-section doc; reviewers will edit/comment'],
    ['"Explain what Code Execution does"', 'Chat response', 'Explanation, not a work product']]) +
  examNote('Q3 also touches Artifacts indirectly: "extracting standard reference material into a Project" (A) is correct because it centralizes reusable content. Artifacts and Projects both solve the "don\'t repeat yourself" problem.') +
  kc('ch3'));

chapter('ch4', '4. Prompting fundamentals: Task, context, format, role', 'core',
  '<h3>Maya\'s story: Week 1 – "Why does the same prompt give me different results?"</h3>' +
  '<p>Maya typed <i>"Summarize this"</i> and uploaded a 20-page client contract. Claude gave a 3-sentence overview. She tried again with the same prompt — this time Claude gave a 2-page bullet list. A third run produced a table. Same input, same prompt, wildly different outputs.</p><p>Her manager explained: <i>"You told Claude what to summarize, but not <b>who</b> it is for, <b>why</b>, or <b>what format</b> you need. So Claude guessed differently each time."</i> Maya learned that a well-structured prompt has four elements: <b>role, context, task, and format</b>.</p>' +
  concept('4.1 The four elements of a well-structured prompt', {
    what: 'A prompt that reliably produces the output you need includes: (1) <b>Role</b> — who Claude is acting as. (2) <b>Context</b> — audience, goal, constraints. (3) <b>Task</b> — the specific deliverable. (4) <b>Format</b> — structure, length, style.',
    why: 'Without these, Claude fills in the blanks with its own assumptions — and those change run to run because the model is non-deterministic. Explicit prompts reduce variance.',
    how: 'Template: <i>"You are a [role]. [Context: audience, goal]. [Task: specific deliverable]. [Format: structure, length, tone]."</i> Not every prompt needs all four, but recurring workflows should specify them to get consistent results.',
    analogy: 'Like a work order: you tell the contractor <i>what</i> to build, <i>why</i>, <i>who</i> will use it, and <i>how</i> it should look. Leave one out and you get a surprise.',
    example: '<b>Before:</b> <i>"Summarize this contract."</i><br><b>After:</b> <i>"You are a contract analyst. Summarize this 20-page service agreement for our CFO, who needs to understand payment terms, renewal dates, and liability caps before the board meeting. Provide a 1-page summary with three sections: Payment Terms, Renewal & Termination, and Liability. Use bullet points."</i>',
    walk: ['<b>Role:</b> "You are a contract analyst" → sets expertise.', '<b>Context:</b> "for our CFO… before the board meeting" → explains why this matters and who reads it.', '<b>Task:</b> "Summarize… payment terms, renewal dates, liability caps" → specific deliverable.', '<b>Format:</b> "1-page, three sections, bullet points" → structure constraint.'],
    exam: 'Q52 asks which two elements belong in a business prompt: (A) clear task statement and (B) relevant context (audience, goal). Q39 is similar for a prompt-quality checklist. Q42 tests task specificity: when Claude skips a question, strengthen the task statement to enumerate all required questions.' }) +
  anim('d_prompt') +
  concept('4.2 Why prompts produce different outputs across runs', {
    what: 'Claude is a <b>non-deterministic model</b>: even with identical input, it can produce different outputs because it samples from a probability distribution over possible next tokens.',
    why: 'This is not a bug. It reflects the creative flexibility of language models. But it means <b>under-specified prompts drift unpredictably</b>.',
    how: 'To reduce variance: (1) make the prompt more explicit (specify format, required sections, tone), (2) provide examples of the desired output, (3) use Projects/custom instructions to lock in recurring rules.',
    analogy: 'Like asking five designers to "make it look good" — you get five different aesthetics. Give them a brand guide and required layout, and the outputs converge.',
    example: 'Q13: a weekly status prompt produces inconsistent tone/structure across runs. Root cause: <b>the prompt under-specifies audience, tone, format, and required sections</b> (B). Fix: spell out the target audience, list the mandatory sections, and state the tone ("professional, no contractions").',
    exam: 'The exam tests whether you know non-determinism is expected (A in Q13 is a trap: "accept the variation") vs. addressable by better prompting (B is correct: specify what is missing).' }) +
  concept('4.3 When to specify format explicitly', {
    what: 'Some tasks communicate best in a specific format: tables for comparisons, bullet lists for scannable summaries, prose for narratives. Specifying format in the prompt ensures Claude matches your need.',
    why: 'Claude chooses a format if you do not. Sometimes it guesses right; often it does not. Explicit format requests eliminate that guess.',
    how: 'Common formats: <b>Table</b> (compare metrics across teams/regions), <b>Bulleted list</b> (action items, findings), <b>Numbered steps</b> (procedures), <b>Narrative prose</b> (executive summary, explanation). State the format in the task: <i>"Provide a table with one row per region and columns for revenue, growth, and variance."</i>',
    example: 'Q14: comparing weekly performance across five regional teams. Answer: <b>a structured table with one record per row and one metric per column, sorted by region</b> (C). Why? Tables make cross-team comparison immediate; prose summaries bury the comparison.',
    exam: 'Format questions test whether you match the deliverable to the use case. Comparison → table. Scannable summary → bullets. Narrative explanation → prose. Q51 tests audience adaptation: time-constrained executives need BLUF (bottom-line-up-front), not chronological build-up.' }) +
  examNote('Prompt quality is tested in Q13, Q39, Q42, Q52, Q54, Q59. The pattern: under-specification causes drift/omissions/hallucinations. The fix: make the task, format, and constraints explicit. On exam day, if a prompt is producing inconsistent or incomplete outputs, always suspect under-specification first.') +
  kc('ch4'));
