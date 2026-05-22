# Chapter 4 — Security + compliance posture

**Course:** Microsoft 365 Copilot Adoption · **Chapter:** 04 · **Target duration:** ~5 min spoken

## Trainer persona
Emma. Security + compliance register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Security and compliance posture for M three sixty-five Copilot.* The IT-admin work that has to happen before users get the feature.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · tenant isolation]

The Microsoft architecture. *Tenant-isolated processing.* Your prompts and outputs do not commingle with other Microsoft customers' data. *Your data is not used to train Microsoft's general-purpose models.*

Microsoft Graph integration. *Copilot respects existing M three sixty-five permissions.* A user can only access through Copilot what they could already access in M three sixty-five. *This is the key security property.* If your existing M three sixty-five permissions are correct, Copilot inherits that correctness.

The corollary. *If your existing M three sixty-five permissions are wrong, Copilot inherits that wrongness — and surfaces it at scale.* Pre-Copilot, an employee might not stumble across the wrong-permissions file. Post-Copilot, they search for it and find it. *Permissions audit before Copilot is non-negotiable.*

> [S3 ▸ slide change · t ≈ 1:25]

> [S3 ▸ reveal 1 · Purview]

Microsoft Purview. *Microsoft's compliance and data governance platform.* For Copilot specifically — *DLP — Data Loss Prevention — policies that prevent sensitive data from being processed by Copilot.*

What you configure. *Sensitivity labels on documents.* Files labelled "Confidential" or "Internal Use Only" get DLP treatment. *Policies that block Copilot from reading or summarising labelled documents.*

The practical implementation. *Run sensitivity labelling on document libraries before Copilot rollout.* If you don't have sensitivity labels, the DLP rules can't take effect. *This is often where Copilot rollouts stall — labels aren't there.*

> [S4 ▸ slide change · t ≈ 2:25]

> [S4 ▸ reveal 1 · Defender]

Microsoft Defender for Cloud Apps. *The CASB — Cloud Access Security Broker.* Monitors Copilot usage. Detects anomalous patterns. *Alerts on potential data exfiltration via Copilot.*

What this looks like. *Dashboard showing Copilot usage patterns.* Detection of high-risk activities — like an employee running a Copilot prompt that summarises an entire customer database. *Alerts to the SOC team.*

For most enterprises by twenty twenty-six — *Microsoft Defender plus Microsoft Purview plus the existing M three sixty-five permission model is the standard security baseline.*

> [S5 ▸ slide change · t ≈ 3:25]

> [S5 ▸ reveal 1 · regulatory frame]

The regulatory frame. *EU AI Act Article Fifty transparency — if your Copilot is used in customer-facing contexts in the EU, transparency obligation applies.* Article Ninety-Nine fines if violated.

HIPAA — *Microsoft offers HIPAA-compliant Copilot tier with BAA.* Healthcare organisations need this. Confirm BAA in writing.

India DPDPA — *sensitive personal data + Copilot processing requires consent and data-fiduciary obligations.*

UK FCA Consumer Duty — *applies to Copilot used in UK financial-services customer interactions.*

The combined posture. *Microsoft does the platform engineering.* Your IT team does the permissions, sensitivity labelling, DLP, monitoring, regulatory compliance, BAA, and disclosure. *None of that is optional.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Before any Copilot deployment beyond pilot — audit one document library.* Permission accuracy. *Sensitivity labels applied.* DLP policies in place. *If any is missing — that's the gap to close before rollout.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Adoption and change management.* The active-user gap. *The three moves. Champions network.*

> [end]
