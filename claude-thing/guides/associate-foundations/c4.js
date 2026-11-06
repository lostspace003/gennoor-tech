/* Chapters 11-13: Responsible AI, Evaluation & hallucinations, Exam playbook */

chapter('ch11', '11. Responsible AI: Data sensitivity, bias, and use-case appropriateness', 'core',
  '<h3>Maya\'s story: Week 4 – "Can I use this data with Claude?"</h3>' +
  '<p>Maya was drafting a summary from a spreadsheet of employee performance reviews. Halfway through, she realized: <i>"Wait — this has salary figures, manager feedback, and accommodation notes. Is this safe to put into Claude?"</i> She stopped, consulted the HR policy, and found the answer: <b>No.</b> Employee PII, compensation data, and medical notes must never enter AI tools without redaction.</p><p>Maya learned to <b>classify data before prompting</b>: identify sensitive fields, redact or anonymize them, then submit only the safe remainder. She also learned which use cases are appropriate (drafting training docs) vs. inappropriate (making promotion decisions).</p>' +
  concept('11.1 Identifying sensitive data that requires redaction', {
    what: 'Sensitive data includes <b>PII</b> (names + government IDs, full payment-card numbers), <b>confidential business data</b> (unreleased financials, M&A plans), <b>employee records</b> (salary, performance notes, accommodation requests), and <b>legal/medical</b> information under privilege or HIPAA.',
    why: 'Even in Claude\'s standard service, entering sensitive data without authorization violates policy and creates risk. Some data must be redacted or excluded entirely.',
    how: 'Before submitting any document: (1) <b>Classify</b> its contents (which fields are sensitive?). (2) <b>Redact</b> sensitive fields and replace with placeholders (e.g., "[EMPLOYEE_ID]", "[SALARY]"). (3) <b>Peer-review</b> the redacted doc to confirm redaction is complete. (4) <b>Submit</b> the redacted version.',
    analogy: 'Like preparing a deposition transcript: you black out privileged material before the other side sees it.',
    example: 'Q30: which data is appropriate in a routine prompt? <b>(B) A redacted job description</b> and <b>(C) an anonymized policy summary</b>. Wrong: named salary figures (A), accommodation notes (D), employee IDs (E). Q31: customer government IDs + full card numbers tied to names (A) require redaction. Q41: the first step is <b>classify and identify which fields are sensitive</b> (A).',
    exam: 'Data-handling questions test the four-step sequence: classify, redact, peer-review, submit. Never skip classification. Named PII, salary, medical notes, and full card numbers always require redaction or exclusion.' }) +
  anim('d_data_handling') +
  concept('11.2 Use cases that are inappropriate for Claude', {
    what: 'Some tasks should <b>not</b> be delegated to Claude, even with review: (1) making final decisions that materially affect someone\'s employment (promotions, terminations), (2) issuing legally binding commitments without attorney review, (3) clinical or diagnostic decisions without clinician review, (4) approving final external press releases without human sign-off.',
    why: 'These tasks require human accountability, legal responsibility, or professional licensing that Claude cannot provide.',
    how: 'Decision rule: Can an error in this task harm someone (financially, legally, medically, reputationally) in a way that cannot be easily reversed? If yes, keep it human-owned or require strict human review before any action.',
    analogy: 'Like corporate signatory authority: certain decisions (sign a contract, approve a regulatory filing) can only be made by authorized humans, not delegated to an assistant.',
    example: 'Q32: which use cases are acceptable? <b>(A) Drafting internal training summary from approved docs</b> and <b>(B) synthesizing customer feedback themes under aggregation rules</b> are safe. Wrong: determining promotions (E), issuing legal summaries without attorney review (C in some contexts), or clinical summaries without clinician oversight (D). Q36 is similar.',
    exam: 'Use-case questions contrast safe delegation (drafts, summaries from approved sources) with inappropriate delegation (final decisions affecting employment, legal/clinical practice). The signal words are "final," "binding," "promotion," "termination," "diagnostic."' }) +
  concept('11.3 Organizational policy boundaries: When to stop and escalate', {
    what: 'When an organizational policy explicitly prohibits entering certain data into AI tools (e.g., "no ongoing investigation data"), you must refrain and escalate for an approved alternative — even if workarounds (Incognito, paraphrasing) exist.',
    why: 'Workarounds do not override policy. Policy boundaries protect the organization and individuals; bypassing them creates liability.',
    how: 'If a task requires data that policy prohibits: stop, escalate to the policy owner (legal, HR, compliance), and wait for an approved workflow. Do not enter the data, do not use Incognito as an exemption, do not paraphrase to "get around" the rule.',
    analogy: 'Like an access control policy: if the door says "Authorized Personnel Only," you do not pick the lock or tailgate behind someone — you get authorization or stay out.',
    example: 'Q18: HR policy prohibits entering ongoing investigation data into AI tools. Answer: <b>Escalate to HR leadership and do not enter the data</b> (C). Wrong: using Incognito (B), paraphrasing (D), or waiting until the investigation closes (A) — the policy applies <i>now</i>.',
    exam: 'Policy questions test whether you respect hard boundaries. Incognito is not an exemption. Paraphrasing is not compliance. When policy says no, the answer is escalate and refrain.' }) +
  concept('11.4 Bias and demographic generalizations', {
    what: 'Claude outputs can contain <b>demographic generalizations</b> (e.g., "this age group prefers X") that do not hold for individuals. Responsible use requires revising generalizations to focus on observed behaviors and validating against actual data.',
    why: 'Demographic generalizations risk stereotyping and systematic bias, even in internal documents.',
    how: 'When reviewing outputs: flag any statement that generalizes about a demographic group. Revise to describe <b>observed behaviors</b> (e.g., "customers in this segment clicked Y at rate Z") instead of group-level claims. Validate against actual customer data.',
    example: 'Q28: a customer-segment description applies a demographic generalization unsupported by individual data. Fix: <b>Revise to focus on observed behaviors and validate against actual customer data</b> (D). Wrong: keeping it for internal use (A), adding a disclaimer (B), or removing the whole section (C). Q23: highest ethical risks in HR workflows are <b>(A) outputs disadvantaging protected groups</b> and <b>(E) decisions affecting employment without human accountability</b>.',
    exam: 'Bias questions test whether you know to revise generalizations (not just disclaim them) and validate against data. The exam also tests whether you recognize systematic bias as a higher risk than typos or formatting inconsistencies.' }) +
  kc('ch11'));

chapter('ch12', '12. Evaluation and hallucination handling', 'core',
  '<h3>Maya\'s story: Week 4 – "This growth stat looks too good to be true"</h3>' +
  '<p>Maya asked Claude to research competitor growth rates. Claude replied: <i>"Competitor A grew 300% last year (source: TechPulse, IndustryToday, MarketWatch)."</i> Maya was drafting this into a board slide when she thought: <i>"300% sounds high. Let me check the sources."</i> She searched for the TechPulse article — it did not exist. IndustryToday mentioned Competitor A but said 30%, not 300%. MarketWatch never covered them.</p><p>Maya had caught a <b>hallucination</b>: Claude invented a plausible-sounding stat and fabricated sources to support it. She learned the <b>fact-checking discipline</b>: when a claim is striking or consequential, verify it against a primary source before relying on it.</p>' +
  concept('12.1 Defining evaluation criteria before scoring outputs', {
    what: 'Evaluation criteria are the specific, measurable standards an output must meet to be acceptable (e.g., "includes all five required sections," "facts match the source file," "tone is formal with no contractions"). Criteria must be defined <b>before</b> you score the output.',
    why: 'Without explicit criteria, "good enough" is subjective and inconsistent across reviewers. Defining criteria up front ensures every output is judged against the same bar.',
    how: 'For recurring workflows: (1) Define what "acceptable" means (required sections, factual accuracy, tone, length). (2) Specify the threshold (e.g., "at least 90% factual accuracy" or "all five sections present"). (3) Build a checklist. (4) Score every output against the checklist before approving it.',
    analogy: 'Like a rubric for grading essays: you define the criteria (thesis, evidence, structure) before you read the first essay, not after.',
    example: 'Q20: valid criteria for a business brief include <b>(A) alignment with requested format/length</b> and <b>(D) factual accuracy against supplied sources</b>. Q45: before scoring, you must <b>(E) define evaluation criteria</b> and <b>(C) specify the threshold</b> that separates acceptable from unacceptable.',
    exam: 'Evaluation questions test whether you know to define criteria first (before generating or scoring), and whether you can distinguish valid criteria (format adherence, factual accuracy) from invalid ones (word count vs. industry benchmarks).' }) +
  anim('d_evaluation') +
  concept('12.2 Recognizing and handling hallucinations', {
    what: 'A <b>hallucination</b> is when Claude generates plausible-sounding but unsupported or false information: fabricated sources, invented statistics, confident assertions not backed by the material you provided.',
    why: 'Language models predict plausible text, not truth. They can confidently state falsehoods, especially when filling gaps in their knowledge.',
    how: 'When you suspect a hallucination: (1) <b>Pinpoint</b> the specific claim that seems unsupported. (2) <b>Verify</b> it against an authoritative source (the document you provided, a primary study, official records). (3) If it is false, regenerate with a stricter prompt: <i>"Use only facts present in the uploaded file. If the file does not state X, say so."</i> (4) Document the pattern if it repeats.',
    analogy: 'Like fact-checking a very confident but occasionally wrong source: you independently verify claims before accepting them as true.',
    example: 'Q60: when a hallucination is suspected, the first step is <b>pinpoint the specific claim that appears unsupported</b> (C). Then verify it. Do not discard the whole output (D), notify users (B), or document it (A) before confirming it is actually false. Q54: summaries include unsupported claims → root cause is <b>prompt does not constrain Claude to use only supplied-source facts</b> (A).',
    exam: 'Hallucination questions test the sequence: pinpoint → verify → regenerate with stricter constraints. Never accept striking claims without verification. The fix is always tighter prompting ("use only the uploaded file"), not hoping it goes away.' }) +
  concept('12.3 Fact-checking discipline: Verifying against primary sources', {
    what: 'When Claude cites a fact (especially a striking statistic, date, or claim), verify it against a <b>primary or authoritative source</b>, not secondary repetition. If secondary sources conflict, locate the primary source.',
    why: 'Secondary sources can repeat errors. Only the primary source (the original study, official record, company filing) confirms truth.',
    how: 'For every consequential claim: ask "What is the primary source?" Find it. Read the relevant section. Confirm the claim matches. If you cannot find the primary source, treat the claim as unverified and either exclude it or note it as unconfirmed.',
    analogy: 'Like verifying a rumor: you do not accept it because three people repeated it; you find the person who was there and ask them what actually happened.',
    example: 'Q5: two secondary sources give conflicting dates. Fix: <b>Locate a primary or authoritative source and use the date it confirms</b> (D). Do not choose the newer one (A), the one with more detail (B), or average them (C). Q48: trade-press articles repeat a growth figure without linking the study. Fix: <b>Locate the original study and verify the figure in the primary source</b> (D).',
    exam: 'Fact-checking questions test whether you know secondary repetition is not verification. Always trace back to the primary source. The exam penalizes accepting "three articles said it" as proof.' }) +
  concept('12.4 When to escalate outputs for review', {
    what: 'Escalation is required when an output has <b>high impact</b> (external-facing, binding commitments, financial/legal/reputational risk) and has not been reviewed by an appropriate human authority.',
    why: 'High-impact outputs that go out unchanged create liability if they contain errors.',
    how: 'Decision rule: Is this going to a customer, the board, a regulator, or the public? Does it commit the company to something (SLA, contract term, financial figure)? If yes, escalate for attorney/CFO/senior review before sending. Internal drafts for your own reference do not require escalation.',
    analogy: 'Like a signature authority policy: certain documents need VP sign-off before they leave the building.',
    example: 'Q37: which output requires escalation? <b>(C) An unchanged draft for a paying customer that includes a service-level commitment</b>. Wrong: internal drafts for your own notes (A), casual internal status updates (B), or team meeting announcements (D) — none are external or binding.',
    exam: 'Escalation questions test whether you recognize high-impact external/binding outputs vs. low-impact internal drafts. The signals are "external," "unchanged," "paying customer," "commitment," "board," "regulator."' }) +
  kc('ch12'));

chapter('ch13', '13. Exam-day playbook: High-yield decision rules', 'core',
  '<h3>How to use this playbook</h3>' +
  '<p>This chapter distills the 60-question exam bank into <b>decision rules</b>: "if you see X in the question, the answer pattern is Y." Read it once the night before your exam, then again 30 minutes before you start. These are the high-yield patterns that repeat across questions.</p>' +
  '<h3>Output format selection</h3>' +
  tbl(['If the question says...', 'The answer is...', 'Why'], [
    ['"Team will reference this procedure across review cycles"', 'Artifact', 'Reusable deliverable; stable link (Q1)'],
    ['"Compare weekly performance across five regional teams"', 'Structured table, one row per region', 'Tables make comparison scannable (Q14)'],
    ['"Compute exact summary totals from uploaded spreadsheet"', 'Code Execution', 'Language models predict; code computes exactly (Q11, Q12)'],
    ['"Quick policy question"', 'Chat response', 'One-off answer; no iteration needed']]) +
  '<h3>The 4Ds Framework</h3>' +
  tbl(['Question type', 'Signal words', 'Answer pattern'], [
    ['Description', '"Explain capabilities to stakeholders," "frame the use case"', 'State what Claude produces AND limitations AND human oversight (Q21, Q46)'],
    ['Delegation', '"Decide which steps to delegate," "keep human vs. give Claude"', 'Two criteria: (1) need for human judgment/empathy, (2) reversibility + consequence (Q26)'],
    ['Diligence', '"Apply policy," "consistent habit," "governance"', 'Sustained habit, not one-time onboarding; close gaps over time (Q57)'],
    ['Discernment', '"Validate a striking claim," "fact-check," "conflicting sources"', 'Verify against primary/authoritative source; never accept secondary repetition (Q5, Q48, Q60)']]) +
  '<h3>Prompting and iteration</h3>' +
  tbl(['Symptom', 'Root cause', 'Fix'], [
    ['Output inconsistent across runs (tone, structure, sections)', 'Prompt under-specifies audience, tone, format, required sections (Q13)', 'Spell out all four: role, context, task, format'],
    ['Claude skips one of three required questions', 'Task statement does not enumerate all questions (Q42)', 'List all three explicitly and require an answer to each'],
    ['Eight iterations, last three identical with same flaw', 'Diminishing returns (Q17)', 'Stop prompting; apply human review or try different approach'],
    ['Summary includes claims not in the source', 'Prompt does not constrain to supplied facts (Q54)', 'Add: "Use only facts in the uploaded file; if not stated, say so"']]) +
  '<h3>Data sensitivity and use-case appropriateness</h3>' +
  tbl(['Data type', 'Action'], [
    ['Named employee salary, accommodation notes, full card numbers + names', 'Redact or exclude (Q30, Q31)'],
    ['Redacted job description, anonymized policy summary', 'Safe to include (Q30)'],
    ['Policy says "no investigation data in AI tools"', 'Escalate and refrain; Incognito is not an exemption (Q18)']]) +
  tbl(['Use case', 'Appropriate?'], [
    ['Draft training summary from approved docs', 'Yes (Q32, Q36)'],
    ['Synthesize customer feedback themes under rules', 'Yes (Q32, Q36)'],
    ['Determine promotion decisions', 'No — requires human accountability (Q32)'],
    ['Issue binding legal commitment without attorney review', 'No — requires professional sign-off']]) +
  '<h3>Projects and Memory</h3>' +
  tbl(['Scenario', 'Answer'], [
    ['"Pasting same instructions into every chat"', 'Move to Project custom instructions (Q3, Q6)'],
    ['"Outputs cite outdated terminology/sources"', 'Update Project configuration (Q53, Q43)'],
    ['"Memory import missing some details"', 'Imports are experimental; manually add via Settings (Q19)'],
    ['"Google Drive connector shows old version (revised 3 hours ago)"', 'Connector index has not refreshed yet (Q6)']]) +
  '<h3>Workflows and decomposition</h3>' +
  tbl(['Pattern', 'Decision'], [
    ['"Request requires process map + materials + measurement plan"', 'Decompose into three focused prompts (Q44)'],
    ['"15 narrow steps; output fragmented"', 'Consolidate related steps into cohesive sections (Q24)'],
    ['"Hand-off between Claude draft and human reviewer"', 'Define what Claude produces AND what human checks, documented (Q4)'],
    ['"Improve recurring workflow"', 'Centralize reference material into Project + add quality gate (Q3)']]) +
  '<h3>Model selection</h3>' +
  tbl(['Task', 'Model'], [
    ['One-off complex multi-step financial reasoning', 'Opus (Q15)'],
    ['Routine weekly summaries, most production tasks', 'Sonnet'],
    ['Quick policy lookups, simple extraction', 'Haiku'],
    ['More capable models...', '...run slower, consume more rate limit (Q27)']]) +
  '<h3>Hallucination and fact-checking</h3>' +
  tbl(['Situation', 'Action'], [
    ['Suspect a hallucinated claim', 'Pinpoint the specific claim → verify against authoritative source (Q60)'],
    ['Two secondary sources conflict on a date', 'Locate primary source; use the date it confirms (Q5)'],
    ['Trade-press repeats a stat without linking study', 'Find the original study; verify in primary source (Q48)'],
    ['Summary includes unsupported claims', 'Regenerate with "use only supplied source" constraint (Q54)']]) +
  '<h3>Evaluation</h3>' +
  tbl(['Task', 'Sequence'], [
    ['Build evaluation checklist', '(E) Define criteria, (C) specify threshold, then score (Q45)'],
    ['Valid criteria for business brief', '(A) Format/length alignment, (D) factual accuracy vs. source (Q20)'],
    ['Report has all topics but one section under-scoped', 'Meets topic-level presence but under-scoped; expand before delivery (Q29)']]) +
  '<h3>Exam traps to watch for</h3>' +
  '<ul><li><b>"Incognito lets you bypass policy"</b> → FALSE. Incognito does not override organizational policy boundaries (Q18).</li><li><b>"Accept variation because models are non-deterministic"</b> → NO. Variance is addressable by better prompting (Q13).</li><li><b>"Three secondary sources said it, so it is true"</b> → NO. Verify against the primary source (Q5, Q48).</li><li><b>"Keep iterating forever"</b> → NO. Stop at diminishing returns and apply human review (Q17).</li><li><b>"Rewrite from scratch after feedback"</b> → NO. Address specific concerns; leave accepted parts unchanged (Q55).</li><li><b>"Defer all feedback to a later cycle"</b> → NO. Act on clear feedback now; clarify ambiguous feedback (Q2).</li></ul>' +
  '<h3>Final 24-hour checklist</h3>' +
  '<ol><li>Re-read this playbook once.</li><li>Take the mock exam (chapter 14) in one sitting.</li><li>For each wrong answer: find the corresponding concept chapter and re-read that section.</li><li>Sleep well. Arrive 10 minutes early. Read this playbook again in the waiting room.</li></ol>' +
  note('The exam bank favors <b>disciplined, transparent, and safe</b> practices. When two answers seem close, ask: Which one is more explicit? Which one verifies facts? Which one respects policy boundaries? That is almost always the correct answer.', 'exam'), { nocheck: true });
