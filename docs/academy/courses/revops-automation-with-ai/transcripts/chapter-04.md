# Chapter 4 — Sales analytics narratives

**Course:** RevOps Automation with AI · **Chapter:** 04 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. The workslop problem + grounding pattern.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Sales analytics narratives.* Where AI either writes the QBR brief in fifteen minutes — or invents a deal trend that destroys credibility forever.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the workslop problem]

The honest data first. *Harvard Business Review published a study in September 2025 — "AI-Generated Workslop is Destroying Productivity."* Forty-one percent of workers have received AI-generated content that looks polished but lacks substance. *Average rework cost — two hours per instance. About one hundred and eighty-six dollars per employee per month. Scaling to over nine million dollars per year* for large organisations.

That's the failure mode for AI-generated QBR briefs. Polished prose. Fluent structure. *Trend that didn't actually happen in the data.* The reviewer skims it, the executive reads it, *and someone catches the invention three days later in the board room.*

> [S3 ▸ slide change · t ≈ 1:20]

> [S3 ▸ reveal 1 · air canada]

The legal precedent matters here too. *Moffatt versus Air Canada, February 2024.* The Civil Resolution Tribunal of British Columbia held *Air Canada liable for its chatbot's hallucinated bereavement-fare policy.* The airline tried to argue the chatbot was a separate legal entity. *The tribunal rejected that.* Eight hundred and twelve Canadian dollars in damages plus precedent.

The principle generalises. *Your AI-generated QBR brief is YOUR statement.* You can't tell the board "the AI made it up." You own the error.

> [S4 ▸ slide change · t ≈ 2:10]

> [S4 ▸ reveal 1 · grounding]

The fix is *grounding*. Salesforce's own help docs on Einstein generative AI describe the pattern. *The model must cite the specific CRM record, opportunity ID, or report row for every claim.* If the claim has no grounding citation, *the claim is suspect by default.*

Practitioner voice — *Salesforce Ben* — published a 2025 piece arguing most "Agentforce hallucinations" trace to ungrounded or dirty data, not the model itself. That matches the broader pattern in chapter five of Course Four — *the citation existence check.* Same idea applied to your QBR brief.

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · interactive]

The interactive on screen. *Four AI-generated QBR sentences.* Some are grounded — citation to a specific opportunity ID, region, or report row. Some are plausible but ungrounded — no citation. Some are hallucinated — citation that doesn't exist. *Classify each.* The pattern emerges fast.

> [pause for hands-on · ≈ 10 seconds]

> [S5 ▸ reveal 2 · pattern]

The check is one rule. *Every claim in an AI-generated QBR brief must point to a specific CRM record you can open in one click.* If the AI says "deals in EMEA slowed in November" — you should be able to click and see the November EMEA opp report. If the AI says "the average deal size grew twelve percent" — click, see the calculation, see the comparison period. *Click-or-cut. That's the editorial standard.*

> [S6 ▸ slide change · t ≈ 4:00]

> [S6 ▸ reveal 1 · monday move]

The Monday move. *Take your last AI-generated QBR brief.* Count the claims. Count how many have a one-click link to the source. *If the ratio is below ninety percent, your editing process is broken.* Add the link-or-cut rule this week. *Your CRO will notice within one cycle.*

> [S6 ▸ reveal 2 · close]

Next chapter — *GTM data cleanup.* The unglamorous AI win that makes every other use case possible.

> [end]
