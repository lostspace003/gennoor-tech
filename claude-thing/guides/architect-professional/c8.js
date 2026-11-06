/* Chapter 8: Exam-Day Playbook */
chapter('ch8', '8. Exam-Day Playbook', null,
  '<p>You have walked through the 12-month Meridian rollout. You have designed RAG pipelines, engineered cost optimizations, governed agent tooling, signed off HIPAA compliance, instrumented observability, and deployed via canary. Now distill that experience into exam-day decision patterns.</p>' +
  '<h2>Pattern recognition across 62 questions</h2>' +
  '<p>The CCAR-P exam does not ask you to recite definitions. It asks: <b>"What should you do next?"</b> or <b>"Which control fits this requirement?"</b> Every question presents a scenario with constraints, priorities, and trade-offs. Your job: recognize the pattern, eliminate options that violate constraints, and choose the architecturally sound answer among survivors.</p>' +

  '<h3>8.1 Constraint hierarchy: SLA elimination first</h3>' +
  '<p><b>Pattern:</b> Question states a mandatory SLA (latency &lt;3s, HIPAA compliance required, accuracy ≥95%). One option violates the SLA but offers another benefit (lower cost, higher speed, simpler architecture).</p>' +
  '<p><b>Trap:</b> Choosing the option that optimizes a secondary goal (cost, simplicity) while violating the SLA.</p>' +
  '<p><b>Correct approach:</b> <i>Eliminate</i> any option violating the SLA, no matter how attractive its other attributes. Among survivors, compare quality/cost/complexity.</p>' +
  '<p><b>Example questions:</b> Q9 (Architecture X has higher quality but violates the &lt;3s SLA → eliminated on SLA grounds; evaluate Architecture Y on cost/efficiency). Q1 (Managed agents must satisfy network-boundary requirement before evaluating cost/topology). Q51 (Accuracy is stated priority; both meet SLA → choose the one prioritizing accuracy).</p>' +
  note('<b>Exam tip:</b> Highlight mandatory constraints in the stem (HIPAA required, latency SLA, accuracy floor, budget ceiling). Any option violating a highlighted constraint is wrong.', 'exam') +

  '<h3>8.2 Business value pillar classification</h3>' +
  '<p><b>Pattern:</b> Question presents 4 stakeholder statements and asks which pillar each maps to.</p>' +
  '<p><b>The five pillars:</b> (1) <b>Efficiency</b> = higher throughput per person-hour. (2) <b>Productivity</b> = better quality, less rework. (3) <b>Transformation</b> = workforce redeployed to higher-value work. (4) <b>Solution Cost</b> = per-transaction API spend. (5) <b>Performance SLA</b> = latency, uptime, accuracy targets.</p>' +
  '<p><b>Common traps:</b> Confusing Efficiency (throughput) with Productivity (quality). Confusing Solution Cost (API spend) with Performance SLA (latency/accuracy).</p>' +
  '<p><b>Mnemonic:</b> <i>EPTSP</i> — Efficiency (throughput), Productivity (quality), Transformation (redeployment), Solution Cost ($), Performance SLA (technical targets).</p>' +
  '<p><b>Example question:</b> Q61 maps four statements: "3× more orders/person" = Efficiency; "staff shifted to strategic work" = Transformation; "API costs 40% over budget" = Solution Cost; "latency 12s vs. 3s SLA" = Performance SLA.</p>' +

  '<h3>8.3 Cost optimization: target the dominant driver</h3>' +
  '<p><b>Pattern:</b> Question states cost breakdown ("45% is a static policy preamble, 35% is retrieved context"). Asks for optimizations.</p>' +
  '<p><b>Correct approach:</b> Target the <i>largest</i> cost driver first. If 45% is a static preamble → cache it. If 35% is retrieved passages → trim to relevant spans or cache frequent chunks.</p>' +
  '<p><b>Traps:</b> Picking optimizations that target minor drivers (e.g., "reduce max_tokens" when output is 5% of cost). Picking optimizations that degrade quality (e.g., "truncate the policy preamble" removes needed rules).</p>' +
  '<p><b>Example questions:</b> Q2 (long repeated system prompt + large retrieved context → cache the prompt prefix, trim retrieved context). Q28 (45% preamble, 35% chunks → cache both). Q46 (14 queries per 80-page filing → cache the filing as a prefix for queries 2–14).</p>' +

  '<h3>8.4 Retrieval & RBAC: enforce before prompt construction</h3>' +
  '<p><b>Pattern:</b> Question mentions "role-based access" or "users with different permissions" in a RAG system. Asks where to enforce RBAC.</p>' +
  '<p><b>Correct answer:</b> At the retrieval layer, <i>before</i> any role-restricted content reaches the prompt construction step. Use the authenticated user\'s identity to filter retrieval results.</p>' +
  '<p><b>Traps:</b> (A) Enforcing RBAC in the system prompt (bypassable via injection). (E) Enforcing RBAC at the response-rendering layer after the model already ingested restricted content (too late—content is in context). (C) Using a single shared token for all users (no per-user enforcement).</p>' +
  '<p><b>Example questions:</b> Q20 (gap: RBAC only at response layer after model generated output). Q30 (remediation: enforce RBAC at retrieval before content enters context). Q57 (where to enforce RBAC in a RAG assistant → retrieval layer before prompt construction).</p>' +

  '<h3>8.5 Tool governance: decompose, discover, audit</h3>' +
  '<p><b>Pattern:</b> Question says "34 tools, declining selection accuracy" or "tool definitions consume large context."</p>' +
  '<p><b>Three fixes:</b> (1) <b>Decompose</b> by domain if tools serve multiple workflows (split into subagents). (2) <b>Progressive discovery</b> if most requests use a small subset (defer loading). (3) <b>Least-privilege audit</b> to remove unrelated/excessive-permission tools.</p>' +
  '<p><b>Example questions:</b> Q13 (34 tools, 4 domains, overlapping descriptions → decompose by domain + clean up descriptions). Q17 (60 tools, high token cost → progressive discovery). Q14 (procurement agent audit → keep tools needed for scope; remove tools bypassing approval). Q52 (context pressure from many MCP servers → enable Tool Search). Q56 (which tool categories to keep → only those essential to defined tasks).</p>' +

  '<h3>8.6 HITL placement: high-impact, irreversible actions</h3>' +
  '<p><b>Pattern:</b> Question asks where to place human review in an agentic workflow.</p>' +
  '<p><b>Correct answer:</b> Between the model\'s output and any high-impact, irreversible action (payments, deletions, external comms, legal commitments).</p>' +
  '<p><b>Traps:</b> (A) Reviewing inputs before generation (wrong problem). (C) Reviewing actions flagged by uncalibrated confidence scores (misses confident errors). (D) Reviewing every action regardless of impact (destroys automation value).</p>' +
  '<p><b>Example questions:</b> Q11 (where to place reviewer → between output and high-impact irreversible action). Q18 (delegation principle → human review on high-consequence irreversible decisions).</p>' +

  '<h3>8.7 Compliance: HIPAA = Enterprise + BAA + ZDR; secrets never in prompt</h3>' +
  '<p><b>HIPAA pattern:</b> Question mentions PHI or HIPAA compliance. Correct config: Claude Enterprise + signed BAA + ZDR enabled + audit logging.</p>' +
  '<p><b>Traps:</b> Claude Pro/Team (no BAA). Ad-hoc personal account (non-compliant). Team with BAA but ZDR disabled (violates retention rules).</p>' +
  '<p><b>Example question:</b> Q6 (HIPAA-eligible configuration → Enterprise + BAA + ZDR + audit).</p>' +
  '<p><b>Secrets pattern:</b> Question mentions credentials or API keys. Correct: credentials resolved server-side from secret store at tool execution time, never in prompt context.</p>' +
  '<p><b>Example questions:</b> Q20 (gap: credentials in prompt context where they leak). Q30 (remediation: move credentials out of prompt, resolve server-side).</p>' +

  '<h3>8.8 Observability: correlation IDs + model version capture</h3>' +
  '<p><b>Pattern:</b> Question says "cannot reconstruct end-to-end trace" or "cannot correlate regressions with model updates."</p>' +
  '<p><b>Missing controls:</b> (1) Request-scoped correlation IDs propagated across tool calls and subagents. (2) Model identity and version logged with each turn.</p>' +
  '<p><b>Example question:</b> Q15 (gaps: correlation IDs omitted across downstream calls; model version not recorded per turn).</p>' +

  '<h3>8.9 Evaluation & A/B testing: define hypothesis + MDE + sample size BEFORE running</h3>' +
  '<p><b>Pattern:</b> Question asks what must be done <i>before</i> running an A/B experiment or building an evaluation suite.</p>' +
  '<p><b>A/B testing:</b> (1) Define hypothesis and primary metric. (2) Determine MDE and sample size. Run the test; do NOT peek and stop early.</p>' +
  '<p><b>Example question:</b> Q44 (before A/B test: define hypothesis + metric, determine MDE + sample size).</p>' +
  '<p><b>Evaluation suite:</b> (1) Define metrics and slices. (2) Curate and label the test set. Then build the suite, score, and report.</p>' +
  '<p><b>Example question:</b> Q49 (before building suite: define metrics/slices, curate labeled dataset).</p>' +

  '<h3>8.10 Fairness: approval parity ≠ error-rate parity</h3>' +
  '<p><b>Pattern:</b> Question presents a model with approval-rate parity (60% for both groups) and asks if it is fair.</p>' +
  '<p><b>Correct finding:</b> Approval-rate parity does NOT assess error-rate parity (false-positive/false-negative rates per group). A model can have equal approval rates but disproportionate error rates—one group suffers more wrongful rejections.</p>' +
  '<p><b>Example questions:</b> Q33 (94% match to human underwriters + approval parity → findings: match does not establish freedom from bias; approval parity ≠ error-rate parity). Q34 (ethics review checks: unsupported generalizations, human accountability on high-impact decisions).</p>' +

  '<h3>8.11 Workflow vs. agent: fixed steps → workflow; open-ended → agent</h3>' +
  '<p><b>Pattern:</b> Question describes a task and asks which pattern (workflow / agentic) fits.</p>' +
  '<p><b>Workflow:</b> Steps are fixed, well-defined, predictable (e.g., classify → retrieve → draft → queue). Lower latency, predictable cost.</p>' +
  '<p><b>Agent:</b> Steps depend on intermediate results; task is open-ended (e.g., research, troubleshooting). Flexible but adds planning overhead.</p>' +
  '<p><b>Example question:</b> Q53 (batch classification with fixed steps → workflow).</p>' +

  '<h3>8.12 Stakeholder communication: tailor to audience</h3>' +
  '<p><b>Pattern:</b> Question asks which documentation package goes to which audience, or how to structure a presentation to mixed audiences.</p>' +
  '<p><b>Tailoring:</b> Exec = outcomes/ROI/risks. Eng = architecture/ADRs/runbooks. Compliance = threat models/controls/audit. Mixed audience = lead with decision/outcomes/trade-offs, then scoped technical detail.</p>' +
  '<p><b>Example questions:</b> Q39 (threat models/controls → compliance; outcomes/ROI → exec sponsor). Q48 (mixed exec+eng → lead with decision/outcomes, then implementation for eng). Q22 (technical handoff → architecture/ADRs/diagrams/runbooks).</p>' +

  '<h3>8.13 General exam strategy</h3>' +
  '<ol><li><b>Read the stem carefully</b> for stated priorities ("accuracy first, provided latency is within SLA"). Eliminate options violating the priority.</li><li><b>Highlight constraints</b> (HIPAA required, &lt;3s SLA, cost ceiling). Any option violating a constraint is wrong.</li><li><b>Recognize the pattern</b> (SLA elimination, cost optimization, RBAC placement, tool governance, HITL, fairness). Apply the pattern\'s decision rule.</li><li><b>Select-two questions:</b> Read all five options; eliminate obviously wrong ones; compare survivors on the exam\'s usual priorities (security &gt; cost, simplicity &gt; complexity, deterministic &gt; probabilistic where safety matters).</li><li><b>Table questions (converted to single-choice):</b> Six were converted from Yes/No tables. Read each row; pick the option matching the correct Yes/No combination per the explanation.</li><li><b>Time management:</b> 62 questions, ~90 minutes (exam duration may vary; check official guide). Budget ~1.5 min/question. Flag hard questions, return after finishing the easier ones.</li></ol>' +
  note('<b>Final reminder:</b> This exam rewards <i>judgment</i>, not rote memory. Every question asks "What is the right next step?" Read for the constraint hierarchy (SLA &gt; cost &gt; convenience), recognize the pattern (RBAC at retrieval, HITL on high-impact actions, cost optimization targeting the dominant driver), and choose the architecturally sound answer. Trust your preparation.', 'exam') +
  '<p>You are ready. Proceed to the mock exam.</p>',
  { nocheck: true });
