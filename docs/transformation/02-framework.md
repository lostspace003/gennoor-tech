# 02 — The Gennoor Way™

The named, owned, repeatable methodology for AI Transformation. Every page on the site, every course, every PoC, every proposal references this framework.

## Why a named framework matters

Big 4 firms sell methodologies because methodologies do three jobs at once:
1. **Make the offer legible** — a buyer can point at a phase and know what they're buying.
2. **Make upsell automatic** — *"You finished phase 2, ready for phase 3?"* is a natural conversation, not a sales pitch.
3. **Create a moat** — a named framework is a brand asset competitors cannot copy verbatim.

Without one, we are a list of services. With one, we are a *system*.

## The five phases

### Visual

```
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ DIAGNOSE │ -> │  TRAIN   │ -> │ INNOVATE │ -> │  BUILD   │ -> │ SUSTAIN  │
   │          │    │          │    │          │    │          │    │          │
   │ readiness│    │ upskill  │    │   PoC    │    │ scale to │    │ govern + │
   │ + strategy│   │  org     │    │ + pilot  │    │ production│   │  evolve  │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
       1-4w           2-8w           4-8w           8-20w          ongoing
```

Three of the five phase names — **Train**, **Innovate**, **Build** — are exactly the three words in the existing Gennoor logo tagline (`train. innovate. build.`). The framework *is* the logo, expanded.

### Phase 1 — Diagnose
**Goal:** establish the truth about where the organization stands.

**Inputs:** stakeholder interviews, data inventory, process maps, current tech stack, regulatory posture, team skill snapshot.

**Outputs:**
- AI Readiness Score (Gennoor 5-dimension index: Strategy · Data · People · Tech · Governance)
- Use Case Backlog (10–30 candidates, scored by impact × feasibility)
- 12-month AI Roadmap
- Governance & Risk Charter
- Executive briefing deck

**Time:** 1–4 weeks
**Who buys this alone:** any org wanting a credible starting point. Often gateway engagement.
**SMB version:** 1-week light diagnostic, fixed price.
**Enterprise version:** 4-week deep diagnostic with workshops.

### Phase 2 — Train
**Goal:** raise the organization's AI literacy ceiling and floor at the same time.

**Inputs:** target audience (executive / functional / technical), business context, tools in use.

**Outputs:**
- C-Suite AI Bootcamp (strategy, governance, ROI)
- Functional Track (HR, Finance, Sales, Ops, Legal, etc.)
- Technical Track (prompt engineering, Copilot Studio, agent building, RAG)
- Custom-context labs using the org's own data/scenarios
- Post-training adoption playbook (this is the bridge to phase 3)

**Time:** 2–8 weeks depending on cohort sizes
**Critical:** every training cohort ends with a **pilot scoping session** — not a quiz. That's how training becomes the trojan horse into the next phase.

### Phase 3 — Innovate
**Goal:** turn the highest-value use case from the backlog into a working PoC the team can touch.

**Inputs:** prioritized use case, sample data, success criteria.

**Outputs:**
- Working PoC running in the org's environment (Azure tenant by default)
- Architecture documentation
- Evaluation report (accuracy, latency, cost, user feedback)
- Go/no-go decision support for phase 4

**Time:** 4–8 weeks (a true PoC, not a slide deck)
**Pricing model:** fixed scope, fixed price. No "T&M PoCs" — that's how Big 4 makes PoCs unaffordable.

### Phase 4 — Build
**Goal:** scale the PoC into a production system the org owns and operates.

**Inputs:** validated PoC, production data, integration requirements, SLA targets.

**Outputs:**
- Production deployment (typically on the client's Azure subscription)
- CI/CD, monitoring, evaluation harness
- Knowledge transfer to client team (this matters more than the code)
- Operations runbook
- Adoption metrics dashboard

**Time:** 8–20 weeks depending on integration depth
**Co-build model:** Gennoor leads, client engineers shadow and take over. By Go-Live, the client team owns the keys.

### Phase 5 — Sustain
**Goal:** keep the system *and* the team performant long after launch.

This is the phase most consultancies skip. It is also where most AI projects die. We make it explicit.

**Inputs:** live system, ongoing use cases, model evaluation feedback.

**Outputs:**
- Quarterly model evaluation & drift report
- Cost optimization audit (token spend, infra spend)
- Governance review (red-teaming, bias audit, compliance refresh)
- Continuous L&D refresh for the team
- Use-case expansion roadmap (loops back to Phase 1 / 3)

**Time:** ongoing — typically a quarterly retainer
**Pricing model:** flat retainer per quarter (SMB) or annual contract (Enterprise).

## Entry points — not every client starts at Phase 1

The framework is a loop, not a waterfall.

```
Diagnose ──> Train ──> Innovate ──> Build ──> Sustain
   ▲           |          |           |          |
   └───────────┴──────────┴───────────┴──────────┘
        (any phase can loop back to Diagnose)
```

- A bank that already has a roadmap can enter at **Train** or **Innovate**.
- A startup with a working PoC can enter at **Build**.
- A company with a deployed model that's drifting can enter at **Sustain**.

This is shown on the framework page as a flexible-entry diagram — not a rigid pipeline.

## Pricing logic at a glance

| Phase | SMB price band (USD) | Enterprise price band (USD) | Typical duration |
|---|---|---|---|
| Diagnose | $3k–$10k | $25k–$80k | 1–4 weeks |
| Train | $5k–$20k per cohort | $30k–$150k per program | 2–8 weeks |
| Innovate (PoC) | $15k–$40k | $50k–$180k | 4–8 weeks |
| Build (Production) | $30k–$100k | $150k–$600k+ | 8–20 weeks |
| Sustain (retainer) | $2k–$6k/month | $15k–$60k/month | Ongoing |

These bands are guidance, not commitments. Listed on the site as ranges so prospects can self-select; precise pricing comes from scoping.

## Embedding the framework everywhere

The Gennoor Way appears on the site in **six places**, in the same shape every time:

1. **Homepage** — large horizontal diagram, brief phase descriptions, link to the framework page.
2. **/the-gennoor-way** (NEW dedicated page) — full breakdown, FAQ, "which phase are you in" decision tool.
3. **Every service sub-page** — "Where this fits in the Gennoor Way" badge at the top of the page.
4. **Every PoC card** — labeled with which phase it lives in (most PoCs = phase 3).
5. **Every course page** — labeled with which phase it supports (most courses = phase 2; some support phase 5).
6. **Every proposal & PDF** — the framework graphic on page 2 of every document.

Frequency is the point. The buyer should see the framework five times before they ever talk to us.

## The naming decision

I propose **"The Gennoor Way™"** as the public name, with **"Gennoor Enablement Framework (GEF)"** as the technical name (used in proposals and deep-dive content).

Alternatives if you want to pick differently:
- **GEN5™** — emphasizes 5 phases, short, brandable
- **The Gennoor Loop™** — emphasizes the iterative nature
- **Diagnose-to-Sustain™ (D2S)** — descriptive, less brand-led
- **Gennoor AI Transformation Framework (G-ATF)** — most corporate, longest

My recommendation: **The Gennoor Way™** for the public-facing site, with the 5-phase visual doing the explanatory work. Short. Ownable. Memorable. Easy to say in a sales call. Pairs naturally with the existing logo tagline.

---

> **Continue to: [03 — Information architecture](03-information-architecture.md)**
