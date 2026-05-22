# Chapter 3 — Plugins and connectors at production scale

**Course:** Building AI Agents with Copilot Studio · **Chapter:** 03 · ~4.5 min

## Persona
Andrew. Architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Plugins and connectors at production scale.* Auth model. Failure modes.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 connector patterns]

Three connector patterns.

*Pattern one — first-party connectors.* Microsoft 365, Dataverse, SharePoint, Outlook. *Fully supported, well-tested, included in licensing.*

*Pattern two — certified third-party connectors.* ServiceNow, Salesforce, SAP, Workday. *Vendor-built, Microsoft-certified.* Premium licensing required.

*Pattern three — custom connectors.* Your line-of-business APIs. OpenAPI definition, auth configuration, action methods. *You own maintenance.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 4-component auth model]

The four-component authentication model. Get one wrong and you have a security incident.

*Component one — user authentication.* How users authenticate to the agent. Teams identity, web SSO, custom.

*Component two — agent-to-connector auth.* How the agent authenticates to APIs. *Delegated (user identity) versus application (service identity).*

*Component three — connector-level permissions.* Which API scopes the connector requests. *Least-privilege principle applies.*

*Component four — data-level permissions.* Once the connector returns data, what scoping is applied. *Row-level security in Dataverse, RBAC in target systems.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 production failure modes]

Three production failure modes.

*Failure one — connector errors.* API down. Auth expires. Schema changes. *Agent doesn't handle gracefully → user-facing failure.*

*Failure two — rate limits.* Connector throttles at concurrent load. *Agent times out. User retries. Worse.*

*Failure three — latency variance.* P50 latency fine. P95 latency catastrophic. *User experience varies wildly.*

The production discipline. *Every connector has explicit error handling. Every connector has retry logic. Every connector has timeout and circuit breaker.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score plugins and connectors honestly. *Two questions.*

*Question one — every connector has explicit error handling?* Yes for all green · most amber · *some/none red.*

*Question two — rate limit testing done before production?* Yes green · vendor docs only amber · *no red — production surprise waiting.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *List every connector your agents use.* For each — first/third/custom, auth pattern, error handling? *Gaps become your hardening priority.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Agents and agent flows.* Three differences that make an agent.

> [end]
