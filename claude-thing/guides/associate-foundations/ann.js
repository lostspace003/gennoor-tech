/* Annotations for prompt examples */
window.ANN = {};
function AN(n, out, a) { window.ANN[n] = { out: out, a: a }; }

AN('ex01_prompt', 'Claude produced a 1-page summary with all required sections, formal tone, and cited the data file. The headline revenue figure leads the executive summary as requested.', [
  ['You are a client-success analyst', '📋 Role: Sets Claude\'s expertise and perspective', 'Defining the role helps Claude write from the right viewpoint.'],
  ['Audience: Our CFO', '🎯 Context: Who reads this and why', 'Knowing the audience (CFO, board meeting) shapes tone and what to emphasize.'],
  ['Task: Summarize the Q3 performance', '✅ Specific deliverable', 'Clear task statement: what to produce, from which source.'],
  ['Include:', '📑 Required sections enumerated', 'Listing all five required sections prevents Claude from skipping one (Q42 trap).'],
  ['- 1 page maximum', '📏 Structure constraints', 'Explicit format (length, tone, citation rule) reduces variance across runs (Q13).'],
  ['Professional tone, no contractions', '🗣️ Tone rule', 'Forbidding contractions prevents "we\'re" / "they\'ve" that violate the style guide (Q25 pattern).'],
  ['Use our terminology from the uploaded glossary', '📚 Reference knowledge', 'Points Claude to the source of approved terms (like Project knowledge, Q40).']]);

AN('ex02_decompose', 'Decomposing the broad "redesign onboarding" request into three focused prompts (map, materials, plan) produced stronger, more complete deliverables than one big prompt would have.', [
  ['Prompt 1 (Process Map)', '🗺️ Focused deliverable #1', 'The process map is a distinct output with its own structure (table, milestones, owners).'],
  ['Prompt 2 (Training Materials)', '📖 Focused deliverable #2', 'Training materials are separate documents, each with a different purpose.'],
  ['Prompt 3 (Measurement Plan)', '📊 Focused deliverable #3', 'The measurement plan has its own format (KPIs, targets, review cadence) unrelated to the map or materials.'],
  ['Three separate documents', '🧩 Multiple distinct outputs signal decomposition', 'Q44: when a request requires multiple distinct deliverables (map + materials + plan), decompose into focused prompts.']]);

AN('ex03_hallucination_fix', 'The "Before" prompt allowed Claude to invent stats and fabricate sources. The "After" prompt constrained it to use only the uploaded file, eliminating hallucinations.', [
  ['Before (hallucination risk):', '⚠️ Vague, no source constraint', 'Claude could search its knowledge (unreliable), estimate, or hallucinate.'],
  ['- Use ONLY the data present', '🔒 Strict constraint', 'This is the key fix (Q54): tell Claude to use only supplied facts; if not stated, say so.'],
  ['- If a competitor is not listed', '🚫 Explicit handling of gaps', 'Prevents Claude from filling gaps with plausible-sounding but false data.'],
  ['Do NOT estimate, extrapolate, or search external sources', '🛑 Negative instruction', 'Reinforce the boundary: no external sources, no guessing.']]);

AN('ex04_redaction', 'The "Before" version contained names + salaries + medical notes (PII). The "After" version redacted all PII, keeping only Employee_ID, Department, and Rating.', [
  ['Name | Salary | Performance Rating', '❌ PII present', 'Names + salary + medical notes violate data handling policy (Q30, Q31).'],
  ['Employee_ID | Department | Performance Rating', '✅ PII redacted', 'Replaced names with IDs, removed salary and accommodation notes. Only safe fields remain.'],
  ['[Names, salary, accommodation notes removed', '📋 Four-step data handling', 'Q41: classify sensitive fields first, then redact, then review, then submit.']]);

AN('ex05_feedback_iteration', 'The reviewer gave three specific pieces of feedback. The revised prompt addressed all three explicitly, and the second draft was approved.', [
  ['Reviewer feedback:', '🔍 Diagnose specific weaknesses', 'Q9: identify weaknesses before revising the prompt.'],
  ['Revised prompt (iteration 2):', '🛠️ Targeted fixes', 'Each revision directly addresses one piece of feedback (Q2, Q55).'],
  ['Use terminology from glossary.pdf', '✅ Verify the fix', 'Check that the new output fixed all three issues without breaking anything else.']]);
