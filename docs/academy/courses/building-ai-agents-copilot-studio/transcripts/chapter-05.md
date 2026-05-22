# Chapter 5 — Knowledge sources, MCP, and Dataverse grounding

**Course:** Building AI Agents with Copilot Studio · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Knowledge sources, MCP, and Dataverse.* Where most production agents differentiate.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 knowledge source types]

Three knowledge source types in Copilot Studio.

*Type one — built-in sources.* SharePoint sites, OneDrive files, public web. *Easiest. Most common starting point.*

*Type two — uploaded files.* PDFs, Word docs, structured data uploaded directly. *Useful for curated knowledge.*

*Type three — connected systems via MCP or Dataverse.* Live system data. *Required for transactional agents.*

The discipline. *Curated, governed sources beat "let it search anything" every time.* Recall isn't the problem. *Precision is.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · MCP integration]

MCP integration — the Model Context Protocol.

MCP is how Copilot Studio agents reach beyond Microsoft's ecosystem into external systems. *GitHub, internal APIs, custom data services.*

The production discipline.

*Per-agent scope-down.* Don't give every agent access to every MCP server. *Scope at the agent level.*

*Observability.* Log every MCP tool call. *What server. What method. What arguments. What returned. Production debugging depends on it.*

*Versioning.* MCP servers evolve. *Version your agent's MCP integration. Don't track latest.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · Dataverse grounding]

Dataverse grounding. The four production-readiness checks.

*Check one — row-level security configured and tested.* User A's data invisible to User B. *Test as different users before launch.*

*Check two — security roles audit.* Which roles have read access to the tables the agent queries? *Audit the roles, not just the data.*

*Check three — field-level security.* Sensitive fields (compensation, SSN, PII) should never reach the agent. *Configure field-level security in Dataverse.*

*Check four — cross-role test before launch.* Test the agent as a manager, an individual contributor, an executive. *Behaviour should match each role's data access.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score knowledge grounding honestly. *Two questions.*

*Question one — Dataverse-grounded agents tested cross-role before launch?* Yes systematically green · informally amber · *no red — data leak risk.*

*Question two — MCP tool calls logged for production debugging?* Yes green · partial amber · *no red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one agent that grounds in Dataverse.* Run a cross-role test. *Watch for inappropriate data appearing in any role's responses.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Deployment, ALM, and environments.*

> [end]
