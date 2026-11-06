/* Knowledge checks for each content chapter */
function M(q, o, a, e) { return { t: 'Multiple choice', q: q, o: o, a: a, e: e }; }
function Cn(q, a, e) { return { t: 'Conceptual', q: q, a: a, e: e }; }
function Sc(q, a, e) { return { t: 'Scenario', q: q, a: a, e: e }; }

KC.ch2 = [
  Cn('What are the four competencies of the AI Fluency Framework?', 'Description, Delegation, Diligence, Discernment (the 4Ds).', 'Together they cover explaining AI capabilities, deciding what to delegate, applying policies consistently, and validating outputs.'),
  Sc('You are explaining a Claude use case to your VP. Which D competency applies?', 'Description: explain what Claude produces, limitations, and human oversight.', 'Transparent framing for stakeholders is Description.'),
  M('Which two criteria guide Delegation decisions?', ['Cost and speed', 'Need for human judgment/empathy, and reversibility + consequence of errors', 'Model choice and rate limit', 'Prompt length and format'], 'B', 'The exam tests these exact two criteria from Q26.'),
  Cn('What is the difference between Diligence and Discernment?', 'Diligence = consistent application of policies/checks. Discernment = critical evaluation of each output for accuracy.', 'Diligence is about <i>habits</i>; Discernment is about <i>validation</i>.'),
  Sc('A summary cites a stat that looks wrong. Which D competency do you apply?', 'Discernment: verify the claim against a primary source.', 'Fact-checking and catching hallucinations is Discernment.'),
  M('Which D is about sustained habit, not one-time training?', ['Description', 'Delegation', 'Diligence', 'Discernment'], 'C', 'Diligence means applying policies consistently over time (Q57).')];

KC.ch3 = [
  Cn('When should you use an Artifact instead of a chat response?', 'When the output is a reusable deliverable the team will reference, edit, or iterate on across sessions.', 'Artifacts are for work products, not one-off answers.'),
  Sc('You need a 10-step onboarding procedure the team will update quarterly. Output format?', 'Artifact.', 'Reusable, multi-session reference → Artifact (Q1).'),
  M('Which is NOT a good use case for an Artifact?', ['A quarterly report template', 'A project plan the team will iterate on', 'A quick answer to "What is the PTO policy?"', 'A code snippet the team will reuse'], 'C', 'One-off factual answers stay in chat; reusable work becomes an Artifact.'),
  Cn('What happens to chat responses after you scroll past them?', 'They stay in the chat transcript but can be hard to find later; they are not saved as standalone files.', 'That is why Artifacts exist: to give work a permanent home.'),
  Sc('Your manager asks for a reusable weekly status template. What do you create?', 'An Artifact.', 'Reusable template = Artifact, not a chat turn.')];

KC.ch4 = [
  Cn('What are the four elements of a well-structured prompt?', 'Role, context, task, and format.', 'Together they reduce variance and ensure Claude knows who it is, why this matters, what to produce, and how to structure it.'),
  M('A prompt produces inconsistent outputs across runs. Most likely cause?', ['The model is broken', 'The prompt under-specifies audience, tone, format, or required sections', 'The context window is too small', 'Code Execution is needed'], 'B', 'Q13: variance is usually under-specification, not non-determinism you must accept.'),
  Sc('You want a table comparing five regions. Where do you specify that?', 'In the format part of the prompt.', 'Explicitly request "a table with one row per region" (Q14).'),
  Cn('Why do prompts produce different outputs even with identical input?', 'Claude is non-deterministic: it samples from a probability distribution, so outputs vary.', 'But variance is reducible by better specification (Q13).'),
  M('Which fixes inconsistent tone across runs?', ['Accept the variation', 'Specify the required tone explicitly in the prompt', 'Use a different model', 'Disable Artifacts'], 'B', 'Add the tone rule to the prompt (Q13).'),
  Sc('Claude skipped one of three required questions. What is missing from the prompt?', 'The task statement does not explicitly enumerate all three questions.', 'Q42: list all questions and require an answer to each.')];

KC.ch5 = [
  Cn('What are the four steps of the refinement loop?', 'Diagnose the weakness, revise the prompt, verify the fix, decide (accept/iterate/change approach).', 'Diagnose → revise → verify → decide (Q9).'),
  M('Which step comes FIRST in iterative refinement?', ['Modify the prompt', 'Submit the revised prompt', 'Identify specific weaknesses in the output', 'Compare the new output to criteria'], 'C', 'Q9: diagnose (identify weaknesses) before you revise.'),
  Sc('Eight iterations; last three outputs nearly identical with the same flaw. What now?', 'Stop prompting; apply human review or try a different approach (diminishing returns).', 'Q17: iteration has plateaued.'),
  Cn('Which two feedback responses are productive?', 'Mapping each feedback item to the specific change made, and asking clarifying questions on ambiguous feedback.', 'Q2: traceability + clarification.'),
  M('Reviewers accept a draft except for two specific issues. Next step?', ['Rewrite from scratch', 'Address the two issues; leave accepted parts unchanged', 'Add a third improvement', 'Defer to the next cycle'], 'B', 'Q55: disciplined iteration fixes only what is broken.'),
  Sc('You iterated six times and the output is worse than version 3. What do you do?', 'Go back to version 3, diagnose what was right about it, and iterate from there.', 'Sometimes iteration overshoots; backtrack to the best version.')];

KC.ch6 = [
  Cn('What are the three components of a Claude Project?', 'Custom instructions, knowledge (uploaded docs), and Skills.', 'They apply to every chat in the Project.'),
  Sc('You paste the same 300-word preamble into every chat. What should you do?', 'Move the preamble to a Project\'s custom instructions.', 'Q3: centralize repetition.'),
  M('When should you update a Project configuration?', ['Never, if it worked once', 'Only when quality visibly degrades', 'Periodically, because policies and terminology evolve', 'Only at onboarding'], 'C', 'Q43: configurations drift over time; review periodically.'),
  Cn('What do custom instructions define?', 'Claude\'s role, required format, tone, mandatory sections, and constraints for that Project.', 'They are the recurring rules for every chat in the Project.'),
  Sc('Outputs cite outdated terminology. What is the likely cause?', 'The Project configuration has not been updated to reflect current terminology.', 'Q53: stale config signal.'),
  M('How do you leverage a Skill in a Project?', ['Disable the Skill and write contradictory instructions', 'Add the Skill, upload knowledge, and write instructions that reference both', 'Add the Skill but write unrelated instructions', 'Upload knowledge but leave the Skill disabled'], 'B', 'Q40: coordinate Skill + knowledge + instructions.')];

KC.ch7 = [
  Cn('When should you use Code Execution instead of a plain chat prompt?', 'When you need exact arithmetic, summary statistics, data transformations, or charts from uploaded data.', 'Language models predict; code computes exactly.'),
  M('A finance manager needs exact totals from a multi-tab spreadsheet. Best feature?', ['Chat prompt', 'Artifact', 'Research', 'Code Execution'], 'D', 'Q11: Code Execution for exact calculations.'),
  Sc('You upload a dataset and ask for summary statistics. Claude returns approximate figures. What went wrong?', 'You did not use Code Execution; Claude predicted plausible numbers instead of computing them.', 'Enable Code Execution for deterministic results.'),
  Cn('What must you do before relying on Code Execution output?', 'Verify the code is correct and spot-check the results against the source data.', 'Q12: always verify.'),
  M('Code Execution outputs are...', ['Always correct', 'Generated code + output you must verify', 'Approximations like chat', 'Only for developers'], 'B', 'You get the code and result; you verify both.')];

KC.ch8 = [
  Cn('What is the difference between Memory and a Project?', 'Memory retains recurring facts/preferences across all chats. A Project bundles instructions/knowledge for a specific workflow.', 'Memory is global; Projects are scoped.'),
  M('A Google Drive connector shows an old version of a file revised 3 hours ago. Why?', ['Permissions block the new version', 'Claude chose the older version', 'The connector cached it at session start', 'The connector index has not refreshed yet'], 'D', 'Q6: index lag.'),
  Sc('You explain your org structure to Claude every chat. What feature eliminates that?', 'Memory: tell Claude once, it remembers across chats.', 'Memory stores recurring context.'),
  Cn('What is a context window?', 'The bounded amount of text (tokens) Claude can consider at once, including system instructions, history, files, and current input.', 'Q56: it is bounded, not infinite.'),
  Sc('A long conversation loses coherence. First recovery step?', 'Summarize the current state and continue with a focused follow-up prompt.', 'Q38: summarize + focus.'),
  M('Memory imports from another platform are...', ['Guaranteed complete', 'Experimental; may not incorporate all content', 'Disabled', 'Permanent'], 'B', 'Q19: imports are experimental; add missing details manually.')];

KC.ch9 = [
  Cn('Name the three Claude model tiers and their trade-offs.', 'Haiku (fast, cheap, lightweight), Sonnet (balanced), Opus (most capable, slower, highest cost/rate-limit use).', 'Match model to task complexity.'),
  M('A one-off complex financial analysis requiring deep reasoning. Which model?', ['Haiku', 'Sonnet', 'Opus', 'Any model works'], 'C', 'Q15: Opus for advanced reasoning.'),
  Sc('You use Opus for quick policy lookups and burn through your rate limit. What should you change?', 'Switch to Haiku or Sonnet for simple tasks; reserve Opus for complex ones.', 'Optimize cost by matching model to task.'),
  Cn('More capable models generally...', 'Run slower and consume more of the rate limit per request.', 'Q27: capability/speed/cost trade-off.'),
  M('What is the correct model-selection sequence for recurring workflows?', ['Test first, define requirements later', 'Define requirements, choose candidate, test, select lightest that meets bar, retest on new models', 'Always use the most capable model', 'Always use the cheapest model'], 'B', 'Q47: sequence is 3, 4, 1, 2, 5.')];

KC.ch10 = [
  Cn('When should you decompose a task?', 'When a request requires multiple distinct deliverables (e.g., a map + materials + a plan), each benefiting from a focused prompt.', 'Q44: multiple outputs signal decomposition.'),
  M('A request for "redesign onboarding" requires a process map, training materials, and a measurement plan. Approach?', ['One prompt for all three', 'Decompose into three focused prompts', 'Ask Claude to decide', 'Use an Artifact'], 'B', 'Q44: decompose.'),
  Sc('A 15-step procedure looks fragmented. What happened?', 'Over-decomposition: related ideas were split too finely.', 'Q24: consolidate into cohesive sections.'),
  Cn('What makes a workflow hand-off reliable?', 'Explicit documentation of what Claude produces and what the human reviewer must check.', 'Q4: both sides must be defined.'),
  M('Which two changes improve recurring workflows?', ['Rename the workspace', 'Centralize reference material into a Project', 'Reorganize section headings', 'Add a quality gate before downstream use'], 'B and D', 'Q3: structural fixes (centralize, gate) not cosmetic ones.'),
  Sc('You want to improve a recurring report workflow. Which is a structural improvement?', 'Adding an evaluation checklist that gates outputs before they go to clients.', 'Quality gates catch errors; cosmetic changes do not.')];

KC.ch11 = [
  Cn('Which data types require redaction or exclusion before prompting?', 'Named PII (government IDs, full card numbers), employee salary/accommodation notes, unreleased financials, legal/medical privileged data.', 'Q30, Q31: classify before you submit.'),
  M('Before submitting a mixed-data document, what is the first step?', ['Redact sensitive fields', 'Classify contents and identify sensitive fields', 'Peer-review the redaction', 'Submit and hope'], 'B', 'Q41: classify first.'),
  Sc('HR policy says "no investigation data in AI tools." You want to paraphrase it to work around the rule. Correct action?', 'Escalate to HR and refrain; paraphrasing does not override policy.', 'Q18: respect boundaries.'),
  Cn('Which use cases are inappropriate for Claude delegation?', 'Final promotion decisions, legally binding commitments without attorney review, clinical diagnoses without clinician oversight.', 'Q32: high-consequence irreversible decisions need human accountability.'),
  M('Drafting internal training docs from approved sources is...', ['Inappropriate', 'Appropriate with review', 'Requires legal sign-off', 'Prohibited'], 'B', 'Q32: safe use case.'),
  Sc('A segment description generalizes about a demographic group. What do you do?', 'Revise to focus on observed behaviors and validate against actual data.', 'Q28: do not generalize; describe behaviors.')];

KC.ch12 = [
  Cn('What are the two steps you must complete BEFORE scoring outputs?', 'Define evaluation criteria and specify the threshold that separates acceptable from unacceptable.', 'Q45: criteria + threshold before scoring.'),
  M('Valid criteria for a business brief include...', ['Word count vs. industry benchmarks', 'Alignment with requested format/length and factual accuracy vs. source', 'Presence of an executive summary', 'Consistent dash style'], 'B', 'Q20: format adherence + factual accuracy.'),
  Sc('You suspect a hallucination. What is the FIRST step?', 'Pinpoint the specific claim that seems unsupported.', 'Q60: diagnose before you verify or escalate.'),
  Cn('When secondary sources conflict on a date, what do you do?', 'Locate the primary or authoritative source and use the date it confirms.', 'Q5: primary source beats secondary repetition.'),
  M('Three trade-press articles repeat a growth stat. Is that verification?', ['Yes, three sources confirm it', 'No, find the original study', 'Yes, if they are recent', 'No, average them'], 'B', 'Q48: trace to the primary source.'),
  Sc('An output going to a paying customer includes an SLA commitment. What do you do?', 'Escalate for review before sending; high-impact external binding output.', 'Q37: external + binding + unchanged = escalate.')];
