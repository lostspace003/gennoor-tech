/* Output annotations */
(function () {
  var O = {
    ex01_prompt: [
      ['Executive Summary', 'Headline revenue figure ($1.2M, 18% growth) leads the section as requested.'],
      ['Metrics', 'Table includes all four required metrics: revenue, growth, churn, NPS.'],
      ['Key Wins', 'Three bullets, concise; max 3 items enforced.'],
      ['Risks', 'Only one risk flagged (sponsor retirement), with context; no fluff.'],
      ['Next Steps', 'Actionable recommendations with deadlines (Dec 1, Q4).'],
      ['Professional tone, no contractions', 'Formal throughout; uses "delivered" not "delivered\'s", "announced" not "they\'ve announced".'],
      ['1 page', 'Length constraint met; summary is scannable for a time-constrained CFO (Q51).']],
    ex02_decompose: [
      ['Process Map output', 'Structured table with owner, timing, deliverable per step — exactly what Prompt 1 asked for.'],
      ['Training Materials output', 'Three separate docs (IT guide, culture, checklist), each 1-2 pages — Prompt 2 deliverable.'],
      ['Measurement Plan output', 'Table with KPI, data source, target, frequency — Prompt 3 deliverable.'],
      ['Combined result', 'All three focused outputs together form a complete onboarding redesign proposal (Q44 decomposition benefit).']],
    ex03_hallucination_fix: [
      ['Before: 300% growth, TechPulse source', 'Hallucinated stat and fabricated source. TechPulse article does not exist.'],
      ['After: 12% YoY, source: competitor_pricing_q3.xlsx', 'Real stat from the uploaded file, cited by name.'],
      ['Not reported in source', 'When the file lacks a field, Claude says so instead of inventing a number (Q54 fix).'],
      ['Data not available', 'Competitor C is not in the file; Claude states that instead of guessing (Discernment discipline).']],
    ex04_redaction: [
      ['Before: Named employees + salary + medical notes', 'PII present; unsafe to prompt (Q30, Q31 violation).'],
      ['After: Employee_ID only', 'Names replaced with IDs; salary and accommodation notes removed.'],
      ['Performance Distribution summary', 'Aggregated stats (percentages, counts) are safe; individual PII is gone.'],
      ['Source: perf_q3_redacted.csv', 'The file itself was redacted before upload (classify → redact → peer review → submit, Q41).']],
    ex05_feedback_iteration: [
      ['Draft 1: 3 pages, contractions, no churn', 'All three issues present; does not meet the spec.'],
      ['Draft 2: 1 page, no contractions, churn present', 'All three issues fixed in the second iteration.'],
      ['Approved', 'Reviewer confirms the revision addressed every piece of feedback (Q2: map feedback to changes).']
]};
  window.OUTNOTES = O;
})();
