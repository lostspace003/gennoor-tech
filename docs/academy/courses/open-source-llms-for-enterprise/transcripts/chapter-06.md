# Chapter 6 — Air-gapped and sovereign deployment

**Course:** Open-Source LLMs for Enterprise · **Chapter:** 06 · ~4.5 min

## Persona
Andrew. Architect-evaluator register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Air-gapped and sovereign deployment.* The patterns that pass regulator and CISO review.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 deployment tiers]

Three sovereign deployment tiers.

*Tier one — data-residency boundary.* Model runs in a specific country or cloud region. Public-cloud-acceptable. *India DPDPA workloads in Indian regions. EU GDPR in EU regions.*

*Tier two — VPC-only with private endpoints.* No public network exposure. *Banking, healthcare, regulated SaaS.* Model in your VPC. All traffic on private networks.

*Tier three — fully air-gapped.* No internet connectivity at all. *Defence, intelligence, classified workloads.* Model deployed via physical media or air-gapped CI/CD.

Each tier has different operational implications. *Pick by what passes your specific compliance review.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 4 architectural requirements]

Four architectural requirements for sovereign deployment.

*Requirement one — no telemetry leak.* Model serving stack must not phone home. Disable analytics, crash reporting, update checks. *vLLM and TGI both support this — verify.*

*Requirement two — auditable model provenance.* You must prove which model weights are running. *Hash-verify weights on load. Sign deployments. Log every upgrade.*

*Requirement three — local logging.* All traces, prompts, completions logged to your storage. *Never to vendor SaaS.*

*Requirement four — supply chain integrity.* Model weights, container images, dependencies all verified. *Reproducible builds. Signed artifacts. SBOM tracking.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · what regulators accept]

What regulators and CISOs actually accept.

*BFSI in India.* RBI cyber security guidelines. Self-hosted in Indian region with audit trail. *Hosted APIs increasingly accepted with BAA-equivalent, but self-hosted clears reviews fastest.*

*GCC government.* National AI strategies vary. UAE, Saudi push toward sovereign AI infrastructure. *Self-hosted on national cloud (G42, NEOM Cloud) increasingly the expected pattern.*

*US federal.* FedRAMP boundary. IL2 to IL6 depending on classification. *Self-hosted in GovCloud or on-premises.*

*EU healthcare + finance.* GDPR + sectoral overlays. EU region serving. Increasingly self-hosted post-EU AI Act.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score sovereign deployment readiness. *Two questions.*

*Question one — your deployment satisfies your specific regulator's stated requirements?* Yes verified green · "we think" amber · *not yet reviewed red — find out before launch, not after audit*.

*Question two — supply chain integrity (signed weights, reproducible builds, SBOM)?* Yes green · partial amber · *no red — supply chain attack is a real risk for high-value sovereign workloads*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Walk one sovereign workload through your CISO's review checklist.* Gaps become the deployment readiness backlog.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Operational considerations.* Upgrades. Patches. Quantization rollouts.

> [end]
