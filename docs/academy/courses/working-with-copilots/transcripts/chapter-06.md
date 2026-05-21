# Chapter 6 — Security and data-exposure boundaries

**Course:** Working with Copilots · **Chapter:** 06 · **Target duration:** ~7 min spoken

## Trainer persona
Emma. Serious — this chapter is the audit-conversation prep. Specific names, specific quotes.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. The chapter every Copilot user should know cold. *Where your data actually goes* when you use these tools — and where Microsoft's own documentation tells you the line *isn't* what most people assume.

> [S2 ▸ slide change · t ≈ 0:20]

> [S2 ▸ reveal 1 · oversharing intro]

Start with the most quoted line in any Copilot security review. Microsoft Learn, the official page on Restricted SharePoint Search, last updated February 2026. The page exists to help admins limit what Copilot can pull from SharePoint when an organisation has oversharing problems. Microsoft's own words, quoted directly — *"Restricted SharePoint Search isn't a security boundary and doesn't change any permissions on SharePoint sites."*

Let that land. The control Microsoft *built specifically to limit Copilot's reach* is not, in Microsoft's own words, a security boundary. Hard cap of one hundred sites in the allowed list. Even when enabled, sites you've *recently accessed* and sites shared with you in Teams or Outlook *still appear* in Copilot results. *Microsoft positions it as a temporary measure.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · the real boundary]

So what *is* the real boundary? Permissions. Microsoft 365 Copilot only accesses data the individual user is already authorised to access. *If your team's SharePoint sites are over-permissioned — meaning people have access to files they shouldn't — Copilot just makes that pre-existing problem visible.* It doesn't create the leak; it surfaces it.

The follow-on tool Microsoft recommends is Purview Data Security Posture Management for AI. *Auto-runs a weekly data risk assessment for the top one hundred SharePoint sites by usage.* Defines oversharing in Microsoft's own glossary as *"when an employee has access to information beyond what is necessary to do their jobs, often happening accidentally."* If your tenant has Purview, ask your admin if DSPM for AI is turned on. *That's the deeper layer beneath Restricted Search.*

> [S4 ▸ slide change · t ≈ 2:40]

> [S4 ▸ reveal 1 · the privacy commitments]

The data privacy commitments. The official Microsoft page, last updated May 2026. *Prompts, responses, and Graph data from M365 Copilot are not used to train foundation language models.* It runs on Azure OpenAI services *inside Microsoft's service boundary*, not on the public OpenAI service. GDPR. ISO twenty-seven thousand and one. ISO forty-two thousand and one. HIPAA. EU traffic stays within the EU Data Boundary.

> [S4 ▸ reveal 2 · the eu gotcha]

*And the compliance gotcha that will come up in a security review.* As of January seventh, 2026, Microsoft added Anthropic as a subprocessor for M365 Copilot. The May 2026 privacy page states explicitly that *Anthropic models are out of scope for the EU Data Boundary.* If your tenant uses any feature backed by an Anthropic model, EU residency for that traffic is not guaranteed. *That's a real conversation with legal in any EU-headquartered company.*

> [S5 ▸ slide change · t ≈ 3:55]

> [S5 ▸ reveal 1 · openai parity]

ChatGPT Enterprise data handling — for parity. *OpenAI does not train on ChatGPT Enterprise business data or conversations.* SOC 2 Type 2. ISO twenty-seven thousand and one of 2022. ISO twenty-seven thousand seven hundred and one of 2019. AES-256 at rest. TLS 1.2 or higher in transit. Named enterprise customers include Block, Canva, Carlyle, Estée Lauder, PwC, Zapier, Klarna. *Same shape of contractual guarantee as M365 Copilot.* If your security team approved Copilot, ChatGPT Enterprise clears the same bar.

> [S6 ▸ slide change · t ≈ 4:40]

> [S6 ▸ reveal 1 · compliance overlay]

The compliance overlays that matter in May 2026.

*EU AI Act, Article 4 — AI literacy.* In application since February 2025. *Providers and deployers of AI systems shall take measures to ensure a sufficient level of AI literacy of their staff.* Penalties under Article 99 — up to fifteen million euros or three percent of global annual turnover. National enforcement powers from August 2026. *This course you're taking right now is literally a compliance asset under Article 4.*

*NIST AI RMF Generative AI Profile, NIST AI Six Hundred Dash One.* Twelve risks mapped to four functions — Govern, Map, Measure, Manage — with over four hundred mitigation actions. *If your security team uses a US framework, this is the one they'll reference.*

*India DPDP Rules.* Finalised November 2025. Consent Manager Framework operational thirteenth November 2026. Full Data Fiduciary compliance deadline thirteenth May 2027. *Any AI system that receives, stores, or generates personal data — including prompt logs — is covered.* If your tenant data includes Indian residents, this applies.

> [S7 ▸ slide change · t ≈ 5:50]

> [S7 ▸ reveal 1 · the sorter]

The interactive on screen. Six scenarios. For each — *safe to prompt Copilot with, risk to flag, or block immediately?* The wrong ones look fine until you understand exactly where the boundary is.

> [pause for hands-on · ≈ 10 seconds]

> [S7 ▸ reveal 2 · the takeaway]

The thread across all of these — *if it's already inside your tenant and within your role's permissions, it's safe.* If it crosses into someone else's tenant, leaves the EU Data Boundary, or contains personal data subject to DPDP without consent, it's a risk or a block. *Your security team has the final say.* This is the framework to walk in with, not to substitute for their review.

> [S8 ▸ slide change · t ≈ 6:40]

> [S8 ▸ reveal 1 · monday move]

The Monday move. Open Microsoft's data privacy page — last updated this month. Read the section on subprocessors. *Note any model provider listed beyond OpenAI* — currently Anthropic, possibly others by the time you're listening. Email your security or legal contact one line — *do we have any constraint that conflicts with this subprocessor list?*

> [S8 ▸ reveal 2 · close]

Five minutes of work. Avoids the conversation where someone discovers six months from now that Copilot routed a query through a model class your compliance team hadn't signed off on. *Don't be surprised twice.*

Next chapter — your one-page Copilot operating manual.

> [end]
