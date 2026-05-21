# Chapter 6 — Privilege & confidentiality

**Course:** AI for Legal & Compliance · **Chapter:** 06 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. The chapter that lawyers actually worry about.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Privilege and confidentiality.* The single question that comes up in every legal-AI procurement conversation — *can we use this without breaking privilege.* The answer in twenty twenty-six is yes — *if you read the terms.* This chapter is how.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the bar guidance]

The bar guidance first. *ABA Formal Opinion Five Twelve — July twenty twenty-four.* Lawyers using generative AI must protect client confidentiality. Specifically — *understand whether client data is transmitted to the AI provider, whether it's retained, whether it's used for training.*

*New York Bar Opinion Twelve Thirty-Nine — twenty twenty-four.* Privilege survives use of cloud AI tools *if vendor terms preserve confidentiality and no third-party disclosure occurs.* That's the operative test. Privilege is not broken by the tool — it's broken by the *terms.*

Translated for practitioners. *Read the contract.* If the vendor has enterprise terms with training opt-out and tenant isolation, privilege survives. If it's a consumer ChatGPT account with default settings, privilege is at risk. *The technology is the same. The terms are different.*

> [S3 ▸ slide change · t ≈ 1:25]

> [S3 ▸ reveal 1 · the enterprise vendors]

The enterprise picture in twenty twenty-six. *OpenAI Enterprise — training opt-out by default. Anthropic Commercial Terms — same.* Microsoft Copilot for Microsoft three sixty-five — *tenant isolation. No training on customer prompts.* Google Workspace Gemini — same posture. Notion AI — same.

The pattern. *All major enterprise vendors landed on the same data posture by twenty twenty-five.* No training on customer data. Tenant or workspace isolation. Audit logs. *This is now table stakes.*

What still varies. *Retention.* Some vendors hold prompts for thirty days for safety review. Some less. Some zero. *Negotiate retention to zero if your jurisdiction or matter requires it.*

> [S4 ▸ slide change · t ≈ 2:25]

> [S4 ▸ reveal 1 · the 3 settings]

*Three settings to verify before any client data touches AI.* Memorise these.

*Setting one — training opt-out.* The vendor must confirm in writing that your prompts and outputs are not used to train models. *Default-on or contractually committed.* Either works.

*Setting two — tenant or workspace isolation.* Your data does not commingle with other customers' data. The vendor enforces this at infrastructure level.

*Setting three — retention.* You know how long data is stored. You can request deletion. *Ideally zero-day retention for privileged work.*

If you can't tick all three with the vendor in writing, *don't put client data into it. Use a different tool, or use a redacted version.*

> [S5 ▸ slide change · t ≈ 3:25]

> [S5 ▸ reveal 1 · the personal-account problem]

The single biggest privilege risk in twenty twenty-six. *Lawyers using personal ChatGPT or Claude accounts to draft client work on a Friday evening.* Personal accounts don't have enterprise terms. Default settings may allow training. Audit trail is non-existent.

This is the *junior-associate-at-home* failure mode. *It's not malicious. It's convenient.* And it's the failure mode bar associations are most likely to sanction in twenty twenty-six because it's measurable. *Vendor logs can show who used what account when.*

The fix is policy plus tooling. *Provide enterprise accounts. Block consumer-tier from the network. Train associates.* Make the right thing the easy thing.

> [S5 ▸ reveal 2 · the close]

Monday move. *Audit which AI tools your team is using right now.* For each, identify the account type — personal or enterprise. *Any personal account being used for client work needs to be replaced with enterprise this quarter.*

> [S6 ▸ slide change · t ≈ 4:20]

> [S6 ▸ reveal 1 · next up]

Next chapter. *The quality framework.* The four guardrails. *Citation verification, human-in-the-loop, audit trail, periodic accuracy review.* This is where the Stanford seventeen-to-thirty-four percent number turns into operational discipline.

> [end]
