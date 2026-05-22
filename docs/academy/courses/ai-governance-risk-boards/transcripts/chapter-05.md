# Chapter 5 — Vendor and supply-chain risk

**Course:** AI Governance, Risk &amp; Boards · **Chapter:** 05 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Procurement-and-vendor-risk chapter.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Vendor and supply-chain risk.* Almost every AI system in your enterprise depends on a third-party model, API, or platform. *The vendor layer is governance you don't control directly — you contract for it.* This chapter is what to contract for.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · enterprise terms baseline]

The enterprise terms baseline. *Three settings, all in writing.*

*Setting one — training opt-out.* The vendor confirms your prompts and outputs are not used to train models. *OpenAI Enterprise — opt-out by default.* Anthropic Commercial Terms — *same.* Microsoft Copilot for M three sixty-five — *tenant-isolated, no training.* Google Workspace Gemini — *same.* All major enterprise vendors landed on this posture by twenty twenty-five.

*Setting two — tenant or workspace isolation.* Your data does not commingle with other customers' data. *Enforced at infrastructure level.*

*Setting three — retention.* You know how long prompts and outputs are stored. *You can request deletion. Zero-day retention for the most sensitive use cases.*

If a vendor cannot tick all three in writing, *don't put company data into it. Period.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · vendor safety frameworks]

The vendor safety landscape. *Anthropic Responsible Scaling Policy — RSP.* Vendor-published framework for releasing more capable models with corresponding safety mitigations. *OpenAI Preparedness Framework — same pattern. Vendor-published.*

Why this matters for your board. *The frontier-model layer is being actively governed by the vendors themselves.* If your AI strategy depends on frontier models, *your board should understand the vendor safety frameworks they're relying on.* They're public documents. They're worth reading.

> [S4 ▸ slide change · t ≈ 2:25]

> [S4 ▸ reveal 1 · third-party AI in products]

Third-party AI inside your products. *If your customer-facing product embeds Anthropic Claude, OpenAI's API, or Microsoft Copilot — your customer's experience depends on vendor uptime, vendor pricing, and vendor model decisions.*

The board questions. *What happens if the vendor deprecates the model your product uses?* What happens if the vendor doubles the price? *What's your migration playbook?*

The mitigation. *Multi-vendor where possible.* Document the migration paths. *Don't single-vendor lock-in.* This is concentration risk like any other supplier concentration risk.

> [S5 ▸ slide change · t ≈ 3:25]

> [S5 ▸ reveal 1 · open-source]

Open-source model considerations. *Llama from Meta. Mistral. Falcon.* Increasingly used by enterprises for cost control and data-sovereignty reasons.

The trade-offs. *You control the deployment.* But you also bear the safety and compliance burden the vendor would have borne. *No vendor RSP. No vendor Preparedness Framework. You build that yourself.*

For most companies in twenty twenty-six — *use commercial vendors for material AI work, use open-source for narrow research and back-office automation.* Hybrid posture.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your top five AI vendors by contract value.* For each — *do the three enterprise settings hold in writing?* If not, that's a procurement remediation conversation for next quarter. *If the vendor can't or won't agree, escalate.*

> [S6 ▸ slide change · t ≈ 4:25]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Board-level AI questions.* The seven questions every director must be able to answer. *Mata, Park, Iovino as cross-domain governance signal.*

> [end]
