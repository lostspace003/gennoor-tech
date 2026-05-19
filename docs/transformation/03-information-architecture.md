# 03 — Information Architecture

Every existing page reviewed. Decision per page: **Keep / Rework / Merge / Delete / New**.

## Decision principles

1. **One question per page.** If a page doesn't answer one clear question, merge it or delete it.
2. **Every page anchors back to The Gennoor Way.** Service pages show their phase. Resources show which phase they support.
3. **Two audiences, two trails.** SMB and Enterprise both have a guided path from any landing page.
4. **Density beats sprawl.** Better to have 18 deep pages than 38 shallow ones.
5. **Cull aggressively.** Delete anything that hasn't earned its place — every dead page dilutes SEO and confuses buyers.

---

## New top-level navigation (5 tabs)

```
Solutions     |     The Gennoor Way     |     Industries     |     Resources     |     About
   ▼                    ▼                       ▼                  ▼                ▼
For SMB              Methodology            BFSI               Blog             Founder
For Enterprise       Diagnose phase         Healthcare         Courses (PDFs)   Team & Delivery
By Function          Train phase            Manufacturing      PoC Catalog      Certifications
By Phase             Innovate phase         Government         Case Studies     Trust & Security
                     Build phase            Energy & Utilities Webinars         Open Source
                     Sustain phase          Retail & E-comm    Workshops        Contact
                                            Education          AI Readiness Tool
                                                               Diagnostic
```

This is a deliberate reshuffle. Today's nav has *Programs / Services / Resources / About / Contact*. The change:
- **Solutions** replaces Programs+Services — single entry for "what we sell" with **dual-audience** sub-nav (SMB vs Enterprise vs by-Function vs by-Phase).
- **The Gennoor Way** gets its own top-level tab. This is the methodology and it's worth a tab.
- **Industries** is new and prominent. Each industry gets a vertical landing page (see [04](04-page-blueprints.md)).
- **Resources** absorbs blog, courses, PoCs, webinars, diagnostic.
- **About** trimmed to founder + team + certifications + trust + contact.

---

## Full page audit

### Homepage `/`

**Decision: Rework (heavy)**

Today it leads with founder + training framing. New homepage:

1. Hero — "Enterprise AI Transformation, delivered end-to-end" + dual CTA (Diagnostic / Talk)
2. **The Gennoor Way visual** — large 5-phase diagram (this is the centerpiece)
3. **Dual-audience selector** — "I run an SMB" vs "I lead an Enterprise" cards
4. Trusted by (Boeing, Aramco, HDFC, EY, IBM, Siemens, etc.)
5. **Outcomes strip** — 3 mini case studies, numbers-first
6. **Featured PoCs** — 3 cards from the PoC catalog
7. **Featured Courses** — 3 PDF courses (rotating)
8. **The Founder credibility block** — moved to position 7-8, not the headline
9. **Industries we serve** — grid of 7
10. Latest insights (blog)
11. Footer CTA — "Run the 15-min readiness diagnostic"

Detailed blueprint in [04-page-blueprints.md](04-page-blueprints.md).

### `/services` and children

| Page | Decision | Notes |
|---|---|---|
| `/services` | **Merge into /solutions** | Renamed and restructured |
| `/services/training` | **Rework, move to /solutions/by-phase/train** | Becomes Phase 2 of Gennoor Way |
| `/services/ai-strategy` | **Rework, move to /solutions/by-phase/diagnose** | Becomes Phase 1 |
| `/services/poc-development` | **Rework, move to /solutions/by-phase/innovate** | Becomes Phase 3 |
| `/services/agentic-ai` | **Rework, move to /solutions/by-phase/build** | Becomes Phase 4 (with /innovate cross-link) |
| `/services/collaboration` | **Keep but rework** as `/about/partnerships` | Out of solutions track |
| `/services/certifications` | **Merge** into `/resources/courses` | Cert prep is part of courses now |
| `/services/azure-ai-foundry-workshop` | **Keep** as a Phase 2 sub-product | Add Gennoor Way breadcrumb |
| `/services/copilot-studio-training` | **Keep** as Phase 2 sub-product | Same |
| `/services/enterprise-ai-roadmap-workshop` | **Keep** as Phase 1 sub-product | Pricing & duration visible |
| `/services/ai-training-india` | **Keep** as regional landing | Vision: India |
| `/services/ai-training-saudi-arabia` | **Keep** as regional landing | Vision 2030 alignment |
| `/services/ai-training-remote` | **Keep** as a delivery-mode landing | Remote/virtual model |
| `/services/training/[slug]` | **Keep** but rebrand cards | Each program shows phase tag |
| `/services/certifications/[slug]` | **Keep** | Each cert tagged "Phase 2" |

### `/ai-academy` and children

**Decision: REPLACE.**

Today: one web-rendered course (AB-100) + "more coming soon" placeholder.

New: `/resources/courses` — **a branded PDF course catalog with 20 courses across 5 tracks**. See [05-courses-plan.md](05-courses-plan.md). The web-rendered AB-100 either becomes a flagship PDF or stays as the one premium interactive course; the rest are PDFs.

`/ai-academy` → 301 redirect to `/resources/courses`.

### `/portfolio` and children

| Page | Decision | Notes |
|---|---|---|
| `/portfolio` | **Merge** into `/about` index | Doesn't need its own root |
| `/portfolio/case-studies` | **Keep, move to /case-studies** | Top-level for SEO |
| `/portfolio/case-studies/[id]` | **Keep** | Re-template with Gennoor Way phase tag |
| `/portfolio/demos` | **Rework**, merge into `/resources/pocs` | PoC catalog absorbs demos |
| `/portfolio/open-source` | **Keep, move to /about/open-source** | Credibility surface |
| `/portfolio/testimonials` | **Keep, move to /case-studies/testimonials** | Cluster with case studies |

### `/about` and children

| Page | Decision | Notes |
|---|---|---|
| `/about` | **Rework** as company purpose page | Mission/vision/regions |
| `/about/founder` | **Keep** but reframe as credibility footer | Not the hero anymore |
| `/about/journey` | **Merge** into `/about/founder` | Don't need both |
| `/about/company` | **Merge** into `/about` index | One company page |
| `/about/certifications` | **Keep** | Strong proof page |
| `/about/team-and-delivery` | **NEW** | Who actually delivers — see [04](04-page-blueprints.md) |
| `/about/trust-and-security` | **NEW** | Data handling, NDAs, IP, regional compliance |
| `/about/open-source` | **Moved** from /portfolio/open-source | |
| `/about/partnerships` | **Moved** from /services/collaboration | |

### `/resources` and children

| Page | Decision | Notes |
|---|---|---|
| `/resources/blog` | **Keep** | 60+ posts; SEO crown jewel |
| `/resources/blog/[slug]` | **Keep** | Add phase tag + course/PoC CTA modules |
| `/resources/videos` | **Keep** | Add Gennoor Way phase categorization |
| `/resources/calendar` | **Rework** as `/resources/book` | Less "calendar," more "book a session" |
| `/resources/guides/agentic-ai` | **Keep** | Cornerstone guides — strong for SEO |
| `/resources/guides/ai-readiness-checklist` | **Keep** | Becomes the marketing arm of the Diagnostic |
| `/resources/guides/enterprise-ai-training` | **Keep** | Lead-gen anchor |
| `/resources/guides/microsoft-copilot-studio` | **Keep** | Strong SEO |
| `/resources/courses` | **NEW** | The PDF course catalog |
| `/resources/pocs` | **NEW** | The PoC catalog (see [06](06-poc-catalog.md)) |
| `/resources/calculators` | **NEW** | AI ROI calculator, Copilot license calculator, etc. |

### `/ai-readiness` and `/ai-readiness-v2`

| Page | Decision |
|---|---|
| `/ai-readiness` | **Keep** — this is the live diagnostic. Make it the **#1 conversion surface** on the site. |
| `/ai-readiness-v2` | **Decide:** ship as `/ai-readiness` replacement or kill. Per [project_ai_readiness_v2.md](../../../memory/project_ai_readiness_v2.md), v2 is locked separate. **Action:** leave v2 alone; promote v1 hard. |
| `/ai-readiness/interest` | **Keep** as the post-diagnostic capture form |

### `/webinars` and `/workshops`

| Page | Decision | Notes |
|---|---|---|
| `/webinars` | **Keep** | Add Gennoor Way phase tags to each |
| `/workshops` | **Keep** | Same; free workshops = top-funnel for Phase 1/2 |
| `/workshops/claude-cowork` | **Keep** | Niche but on-brand |
| `/claude-cowork` | **Merge** into `/workshops/claude-cowork` | Don't need two |

### `/career-coach`

**Decision: keep, but quarantine.** Per [project_career_command_center.md](../../../memory/project_career_command_center.md), this is a separate side product. It doesn't belong on the main enablement nav. Link from footer only. Don't dilute the enterprise positioning.

### `/contact`

**Decision: rework.** Today it's a generic form. New version offers **three distinct intents**:
1. *"Run a 15-minute readiness diagnostic"* → starts the diagnostic
2. *"Get a scoped pilot proposal"* → form with use-case context
3. *"Have a 30-minute exploratory call"* → calendar booking
This is your funnel. Different intents go to different responses.

### Admin & utilities (`/admin`, `/verify`, `/sitemap-index`, `/privacy`, `/terms`, `/demo/logo-showcase`)

**Decision: keep all. Hide /demo/logo-showcase from main nav.**

### Pages to remove or 301-redirect

- `/ai-academy` (and children) → `/resources/courses`
- `/portfolio` (root) → `/about`
- `/portfolio/demos` → `/resources/pocs`
- `/services/collaboration` → `/about/partnerships`
- `/services/certifications` → `/resources/courses#certifications`
- `/services` → `/solutions`
- `/about/journey` → `/about/founder`
- `/about/company` → `/about`
- `/claude-cowork` → `/workshops/claude-cowork`

All redirects should be 301 with a clear new destination — preserve SEO equity.

---

## New top-level pages to build

| New URL | Purpose | Owner phase |
|---|---|---|
| `/the-gennoor-way` | Full methodology page | All phases |
| `/solutions` | New "what we sell" hub | All |
| `/solutions/for-smb` | SMB-specific journey | All |
| `/solutions/for-enterprise` | Enterprise journey | All |
| `/solutions/by-function/hr` | AI for HR teams | Phase 2-3 |
| `/solutions/by-function/finance` | AI for Finance | Phase 2-3 |
| `/solutions/by-function/sales` | AI for Sales | Phase 2-3 |
| `/solutions/by-function/customer-service` | AI for CX | Phase 2-3 |
| `/solutions/by-function/operations` | AI for Operations | Phase 2-3 |
| `/solutions/by-function/legal-compliance` | AI for Legal | Phase 2-3 |
| `/solutions/by-phase/diagnose` | Phase 1 product page | Phase 1 |
| `/solutions/by-phase/train` | Phase 2 product page | Phase 2 |
| `/solutions/by-phase/innovate` | Phase 3 product page | Phase 3 |
| `/solutions/by-phase/build` | Phase 4 product page | Phase 4 |
| `/solutions/by-phase/sustain` | Phase 5 product page | Phase 5 |
| `/industries` | Index of vertical pages | All |
| `/industries/financial-services` | BFSI vertical | All |
| `/industries/healthcare` | Healthcare vertical | All |
| `/industries/manufacturing` | Manufacturing vertical | All |
| `/industries/government` | Public sector vertical | All |
| `/industries/energy-utilities` | Energy vertical | All |
| `/industries/retail-ecommerce` | Retail vertical | All |
| `/industries/education` | Education vertical | All |
| `/resources/courses` | PDF course catalog | Phase 2 |
| `/resources/courses/[slug]` | Individual course page | Phase 2 |
| `/resources/pocs` | PoC catalog | Phase 3 |
| `/resources/pocs/[slug]` | Individual PoC page | Phase 3 |
| `/resources/calculators` | Interactive tools index | Phase 1 |
| `/resources/calculators/ai-roi` | ROI calculator | Phase 1 |
| `/resources/calculators/copilot-licensing` | Copilot license cost tool | Phase 1 |
| `/case-studies` | Top-level case study index | All |
| `/about/team-and-delivery` | Who delivers + how we staff | All |
| `/about/trust-and-security` | NDAs, IP, data handling | All |

---

## Footer redesign

Today the footer has 4 columns. New footer has 5 — and the fifth is **Get Started**, with three CTAs (diagnostic / pilot / talk).

```
SOLUTIONS         |  THE GENNOOR WAY  |  RESOURCES        |  ABOUT             |  GET STARTED
For SMB              Methodology         Blog                Founder              Run AI Readiness Diagnostic
For Enterprise       Diagnose            Courses             Team & Delivery      Get Pilot Proposal
By Function          Train               PoC Catalog         Certifications      Book 30-min Call
By Phase             Innovate            Case Studies        Trust & Security
Industries           Build               Webinars            Open Source
                     Sustain             AI Readiness Tool   Partnerships
                                         Calculators         Contact
```

Bottom strip: logo + "Diagnose. Train. Innovate. Build. Sustain." + social + © + privacy/terms.

---

## URL preservation & SEO transition

For every deleted/merged URL, set a 301. For every new URL, request indexing in Google Search Console after launch. Keep blog URLs untouched — they are the SEO crown jewel.

> **Continue to: [04 — Page blueprints](04-page-blueprints.md)**
