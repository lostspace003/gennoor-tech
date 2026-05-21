# Chapter 4 — Reconciliation copilots

**Course:** AI-Augmented Month-End Close · **Chapter:** 04 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Reconciliation is where AI saves the most hours per close.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Reconciliation copilots.* This is the use case that saves the most hours per close cycle. *Lowest risk. Highest ROI. Where most finance teams should start.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the time saved]

The number. *BlackLine and Trintech mid-market case studies through twenty twenty-five — thirty-five to fifty percent of manual reconciliation hours saved* on PE-backed deployments. Bank rec, intercompany, balance-sheet account rec.

What "saved" means in practice. *A controller who used to spend three full days on month-end recs now spends one-and-a-half.* The work that's eliminated — *matching obvious transactions.* The work that remains — *investigating exceptions and resolving differences.*

> [S3 ▸ slide change · t ≈ 1:05]

> [S3 ▸ reveal 1 · the auto-clear threshold]

The auto-clear pattern. *AI matches transactions against the bank feed or the subledger.* High-confidence matches — *auto-cleared.* Low-confidence matches — *flagged for review.*

The threshold is the policy decision. *Auto-clear above ninety-five percent confidence and below a dollar materiality.* Below ninety-five percent or above materiality — *route to the controller.* The controller approves the match or flags an exception.

The discipline. *Audit the auto-clears quarterly.* Pull a sample. Verify the AI's confidence calibration. *If actual accuracy on auto-cleared items drops below the threshold, tighten the auto-clear policy.*

> [S4 ▸ slide change · t ≈ 2:10]

> [S4 ▸ reveal 1 · the exception flow]

The exception-handling pattern. *Three buckets.*

*Bucket one — routine timing differences.* Bank cleared the cheque tomorrow. *AI proposes the rec entry. Controller confirms.*

*Bucket two — investigation required.* Amount doesn't match, party doesn't match, date doesn't make sense. *AI proposes possible causes — duplicate entry, FX rounding, missing entry.* Controller picks the cause or pulls source documents.

*Bucket three — escalate.* Genuinely ambiguous. The AI says "I can't determine." *Controller investigates manually.* Sometimes escalates to the senior controller or auditor.

The KPI to watch. *Bucket three rate.* If it's growing, your AI is degrading. If it's shrinking with the same quality, the AI is improving.

> [S5 ▸ slide change · t ≈ 3:10]

> [S5 ▸ reveal 1 · the failure mode]

The failure mode. *Bank-feed mismatch.* If the bank feed and the GL are out of sync upstream, the AI's matches look right but actually aren't. *Two duplicate transactions could both auto-clear against the same bank entry.*

The fix. *Reconcile the bank feed source before running AI rec.* Or — *make the AI surface unmatched-on-both-sides items explicitly, not as auto-clears.* This is a vendor configuration question. *Demo this before you sign.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Audit your last quarter of bank rec auto-clears.* Pull a hundred at random. *Verify accuracy.* If you find more than two errors, *the auto-clear threshold is too aggressive.* Tighten it before the next close.

> [S6 ▸ slide change · t ≈ 4:10]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Journal-entry AI.* Proposed JEs from email, PDF, contract, invoice. *The Big-Four acceptance condition. The quad-eye flow.*

> [end]
