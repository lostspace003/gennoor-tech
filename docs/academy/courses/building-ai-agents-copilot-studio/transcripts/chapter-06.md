# Chapter 6 — Deployment, ALM, and environments

**Course:** Building AI Agents with Copilot Studio · **Chapter:** 06 · ~4.5 min

## Persona
Andrew. Architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Deployment, ALM, and environments.* Where production discipline lives.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3-environment path]

Three-environment promotion path.

*Dev environment.* Makers build, iterate, break, fix. *Unmanaged solution. Frequent change.*

*Test environment.* Promoted from dev. Integration tested. *Managed solution. Read-only to makers.*

*Prod environment.* Promoted from test. End users. *Managed solution. Locked down.*

What works. *Code promotes via managed solutions in pipelines.* What doesn't work. *Makers building directly in prod.* Production builds are how outages happen.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 solution rules]

Three solution rules that prevent ALM pain.

*Rule one — one agent per solution.* Don't bundle three agents in one solution. *When you deploy, you deploy everything or nothing.*

*Rule two — managed in test and prod.* Unmanaged means makers can change directly. *Managed enforces deploy-only.*

*Rule three — semantic versioning.* 1.2.3 format. Major-minor-patch. *Track what's in each environment.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 pipeline patterns]

Three pipeline patterns matched to scale.

*Pattern one — Power Platform Pipelines.* Built-in. Dev to test to prod with one-click promotion. *Best for small teams.*

*Pattern two — Azure DevOps with Power Platform Build Tools.* CI/CD integration. Pull requests. Automated tests. *Best for medium-scale, ITSM-integrated orgs.*

*Pattern three — GitHub Actions or third-party.* For orgs standardising on non-Microsoft DevOps. *Same Build Tools, different runner.*

Match pattern to team scale and existing tooling. *Don't over-engineer for a 2-agent estate.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score deployment + ALM honestly. *Two questions.*

*Question one — agents promoted via pipelines, not edited directly in prod?* Yes green · sometimes amber · *no/prod-direct-edits red.*

*Question two — every deployable change has a solution version + change log entry?* Yes green · informal amber · *no red — production debugging will be painful.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Audit your top three production agents.* Solution versioning? Managed status? Last-edited-where? *Direct prod edits become your top fix.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Governance and monitoring at scale.*

> [end]
