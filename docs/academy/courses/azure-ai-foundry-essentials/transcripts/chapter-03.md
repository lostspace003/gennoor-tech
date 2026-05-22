# Chapter 3 — Project setup and identity

**Course:** Azure AI Foundry Essentials · **Chapter:** 03 · ~4.5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Project setup and identity.* Managed identity. Key Vault. Private endpoints. Where most production incidents start.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · why identity matters]

Why identity setup is where things go wrong.

*The default.* API keys in environment variables. Works in dev. Looks fine in pipelines. *Until a key leaks. Or rotates. Or audit asks for the trail.*

The fix isn't a process. *The fix is making the wrong way harder than the right way.* Managed identity makes credentials disappear from your code entirely.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · managed identity pattern]

Managed identity — the working pattern.

*Step one.* Project gets a system-assigned managed identity at creation. *Azure handles the credential lifecycle.*

*Step two.* Assign that identity RBAC roles on the resources it needs. *Storage Blob Data Reader. Cognitive Services User. Key Vault Secrets User.*

*Step three.* Your code calls DefaultAzureCredential. *Same code locally with your dev identity, in CI/CD with a service principal, in production with managed identity. No key handling.*

Result. *Keys never leave Azure. Audit trail automatic.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · Key Vault for the rest]

Key Vault for credentials that can't be managed identities.

Some integrations still need keys. *Third-party APIs. Webhooks. Legacy systems.*

Store them in Key Vault. *Reference them in Foundry connections by name, not value.* Vault is the only place credentials live.

Audit access patterns. *Key Vault logs every credential read. Review weekly. Catch broken access patterns before they're exploited.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · private endpoints]

Private endpoints — for regulated workloads.

If your workload handles PHI, PII, financial records, or data subject to data-residency requirements. *Private endpoints are not optional.*

The pattern. *Foundry, AI Search, storage all behind private endpoints in your VNet. No public network exposure. Traffic stays inside Azure.*

Cost. *More expensive. Slower to set up.* For regulated workloads, the alternative is failing the audit. *No question.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Audit your current LLM workloads for credential handling.* Find one place with an API key in environment variables. *That's the first managed-identity migration.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Evaluation harness.* Built-in evaluators + custom judges.

> [end]
