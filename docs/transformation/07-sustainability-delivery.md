# 07 — Sustainability & Delivery Model

## What this document answers

The questions a serious buyer asks before they sign:

- *How do you deliver?*
- *When do you deliver?*
- *Who delivers?*
- *What does it cost — and why?*
- *Are we locked into one vendor's stack?*
- *What happens after Go-Live?*
- *What if our team can't take over?*

This page on the site exists to answer them all. It is also the page that closes the procurement conversation.

---

## The Three Pledges (the new differentiator)

This is the strongest competitive claim we can make. Big 4 firms cannot say all three. System Integrators cannot say all three. Pure trainers cannot say any of them. We can — and we should put it above the fold on every solution page.

### 1. **Stack-flexible** — open source or cloud, whichever serves you

> *"We are Microsoft-strong. We are not Microsoft-locked. If open-source Llama on your own GPU is the right answer for your cost, sovereignty, or compliance needs, that's what we build. If Azure OpenAI is right, we build that. We recommend based on **your** numbers, not our partnership margins."*

**What this means in delivery:**
- Every engagement starts with a **Stack Fit Assessment** — comparing cloud (Azure OpenAI / AWS Bedrock / Google Vertex), self-hosted open-source (Llama / Mistral / Phi / Qwen via Ollama / vLLM / Azure ML), and hybrid patterns.
- Selection criteria documented: cost per 1M tokens, latency, sovereignty, IP terms, fine-tuning needs, ecosystem fit.
- Recommendation is written, justified, and the client owns the decision.
- Our reference architecture supports both cloud LLM patterns and air-gapped open-source patterns. Same Gennoor Way. Different tech.

**On the website:** every PoC page shows two options — "Cloud variant" and "Self-hosted variant" — with the cost and trade-off implications of each.

### 2. **Economic** — cost-honest, fixed-price by default

> *"We price what we deliver, not what we estimate. Phase 1, 2, 3 are fixed-scope, fixed-price. We optimize cost into every engagement — token spend, infra spend, license spend — because every dollar saved is one you reinvest with us."*

**What this means in delivery:**
- **Fixed-price** for Diagnose, Train, and Innovate phases. No "time-and-materials creep."
- **Cost optimization sprint** included in every Build phase: token usage audit, model right-sizing (e.g., GPT-4o → GPT-4o-mini where accuracy holds), caching strategy, prompt compression.
- **Transparent breakdown** in every proposal: people-cost, infra-cost, license-cost, our margin, line-by-line.
- **No "premium tier" pricing for emerging markets** — same price logic for Lagos as for London. (Different bands SMB vs Enterprise, not different bands by region.)

**On the website:** Every PoC and engagement model shows price bands. Yes — actual numbers. This is unusual and a major trust signal. Big 4 will *never* show price on a website. We do.

### 3. **Consistent** — the same Gennoor Way, every time, every client

> *"The framework is the same whether you're a 30-person mid-cap in Nairobi or a 30,000-person bank in Riyadh. Same five phases. Same deliverable shape. Same senior delivery. The work scales — the quality does not vary."*

**What this means in delivery:**
- **Named senior on every engagement.** No "we'll staff this with juniors" surprise.
- **Standard deliverable templates** for every phase — readiness reports, roadmaps, governance charters, runbooks — all look the same shape across all clients (with content varied).
- **Standard cadence:** weekly demos, weekly status, fortnightly steering — for every engagement, SMB or Enterprise.
- **Knowledge transfer is non-negotiable.** Every engagement ends with the client's team trained on what we built. No black-box handover.

**On the website:** A **Delivery Playbook** page shows the cadence, the templates, the people, the tools — so a buyer can see *exactly* what they get.

---

## The engagement model — visual

```
DISCOVERY            PILOT             SCALE              SUSTAIN
(1-4 weeks)         (4-8 weeks)       (8-20 weeks)       (ongoing quarterly)
   │                   │                  │                   │
   │ Stakeholder       │ Working PoC      │ Production        │ Drift monitoring
   │ interviews        │ in your env      │ deployment        │ Cost audits
   │ Data audit        │ Evaluation       │ CI/CD setup       │ Quarterly L&D refresh
   │ Use case backlog  │ Cost report      │ Knowledge txfr    │ Use-case expansion
   │ Roadmap           │ Go/no-go         │ Operations runbk  │ Compliance refresh
   │ Governance        │ decision         │ Adoption metrics  │ Annual strategy review
   │ charter           │                  │                   │
   │                   │                  │                   │
   ▼                   ▼                  ▼                   ▼
[Phase 1]           [Phase 3]           [Phase 4]           [Phase 5]
Diagnose            Innovate            Build               Sustain

   ──Phase 2 (Train) runs in parallel with any of the above──
```

Phase 2 (Train) is positioned as a **horizontal capability that overlays** the journey — you train executives at Discovery, trainers + users during Pilot, technical team at Build, and continuous L&D at Sustain.

---

## The Sustain phase (in detail)

This is the most-skipped phase in the industry and the one we make most explicit.

### What dies if you skip Sustain

- **Model drift** — performance degrades silently as the world changes
- **Cost creep** — token spend doubles in 6 months because nobody is watching
- **Adoption collapse** — users go back to old ways within 90 days
- **Governance lapse** — new use cases get added without controls
- **Skill atrophy** — the team that built it moves on; nobody knows how to operate it

### What Sustain looks like (the retainer)

- **Quarterly Health Check** — 1 day per quarter
  - Model evaluation against fresh test set
  - Cost & token audit
  - Adoption metrics review
  - Security & governance refresh
  - Output: "Health Report" with recommended actions
- **Monthly Office Hours** — 2 hours per month
  - The team can book us for whatever's stuck
- **Always-on Slack channel** — async support, < 24h response
- **One Annual Strategy Day** — included
  - Where the AI portfolio goes next year
  - New use case pipeline
  - Budget planning support

### Sustain retainer pricing

| Client size | Monthly retainer |
|---|---|
| SMB (single deployed agent) | $2k–$4k/mo |
| SMB (2–3 deployed systems) | $4k–$8k/mo |
| Enterprise (program-wide) | $15k–$40k/mo |
| Enterprise (regulated/multi-region) | $30k–$60k/mo |

**Why this matters commercially:** Sustain retainers convert one-time project revenue into recurring revenue. A successful engagement that pulls through a $5k/mo Sustain retainer turns into a $60k/year annuity. That is the firm's path to durable economics.

---

## Who delivers (the team & delivery model)

Today, the senior delivery is Jalal Ahmed Khan. Tomorrow, the firm grows around him — but the brand promise must hold even at team size 3, team size 10, team size 30.

The **role mix** on the site (irrespective of headcount):

| Role | What they do | When they appear |
|---|---|---|
| **Engagement Lead** | Owns the relationship, runs the steering committee | All phases |
| **Solutions Architect** | Designs the technical approach, signs off on stack choice | Phase 1, 3, 4 |
| **Senior Trainer / Coach** | Delivers all training content; runs adoption sessions | Phase 2, 5 |
| **PoC Engineer** | Builds the pilot | Phase 3 |
| **Production Engineer** | Scales the pilot, sets up CI/CD, runs DevOps | Phase 4 |
| **Adoption Lead** | Drives change management, measures adoption | Phase 4, 5 |
| **Governance Analyst** | Risk, compliance, evaluation | Phase 1, 5 |

Today some of these roles are worn by Jalal. That's honest and the page should say so:
> *"Our delivery model is senior-only. As we grow, every role on this list is staffed by a Microsoft-certified senior practitioner with 8+ years experience. Today, Jalal Ahmed Khan personally fills several of these roles on every engagement — which is why we cap our active engagements at [N] per quarter."*

This is a **feature, not an apology**. "Senior-only, capacity-limited" is a premium positioning, not a weakness.

---

## Tools & stack we use

A transparent stack page builds trust. Show what we run on:

| Layer | Primary | Alternates we use |
|---|---|---|
| **LLM (cloud)** | Azure OpenAI (GPT-4o, GPT-4o-mini) | AWS Bedrock (Claude), Google Vertex (Gemini) |
| **LLM (open-source)** | Llama 3.x, Mistral, Phi, Qwen | Self-hosted via Ollama, vLLM, Azure ML endpoints |
| **Agent frameworks** | Microsoft Copilot Studio, Semantic Kernel, LangGraph | CrewAI, AutoGen, MS Agent Framework |
| **RAG / search** | Azure AI Search | Pinecone, Weaviate, pgvector |
| **Orchestration** | Azure Functions, Logic Apps | n8n, Temporal |
| **Data platforms** | Microsoft Fabric, Azure ML | Databricks, Snowflake |
| **Evaluation** | MLflow, Azure AI Evaluation | Promptfoo, Ragas |
| **Observability** | Application Insights, MLflow Tracing | LangSmith, Arize |
| **Front-end (where needed)** | Next.js, Power Apps | React, Streamlit |

The site has a `/about/trust-and-security` page (NEW) and a `/about/team-and-delivery` page (NEW) that displays this stack table — so a CIO can hand it to her security team and they see exactly what we run.

---

## How we ship — the operating rhythm

Every engagement, no matter the size, runs on the same cadence:

```
WEEK 0:    Kickoff. Goals. Stakeholders. Success criteria.
WEEK 1:    First demo. (Yes, even at week 1 — even if it's just a mockup.)
WEEK 2:    Stack Fit Assessment delivered.
WEEK 3:    First working slice.
WEEKLY:    Demo every Friday. Status every Monday.
FORTNIGHTLY: Steering committee.
PHASE GATE: Written sign-off before moving to next phase.
GO-LIVE:   Runbook delivered. Client team trained. Hypercare for 2 weeks.
GO-LIVE+30: Adoption review.
GO-LIVE+90: First Sustain quarterly check.
```

**Demo culture is the rule.** No engagement goes more than 5 working days without a demo of something. This is how we keep clients confident, and how we avoid the "60-day silence then a bad surprise" pattern that kills consulting projects.

---

## How we handle the hard things

A FAQ page that exists because procurement asks all of this anyway:

### "Who owns the IP?"
- **You do.** Code, models, data, prompts — all client-owned. Our reusable frameworks (templates, evaluation harnesses) remain ours, are non-confidential, and are listed in the contract.

### "What if you go out of business?"
- All code is in your repos from day one (not ours). All cloud accounts are yours. All credentials are yours. We could vanish tomorrow and you'd still have a fully operating system.

### "Do you sign NDAs?"
- Default yes. Mutual NDA template available on `/about/trust-and-security`.

### "Where does the data sit?"
- In **your** Azure / AWS / on-prem environment. We do not store client data on our infrastructure. (Exception: anonymized usage telemetry, opt-in.)

### "Can you work air-gapped / sovereign?"
- Yes. Open-source LLMs on private infra is one of our reference patterns. Common for government, defense, and regulated finance.

### "Can you integrate with our existing SIs?"
- Yes. We work alongside Accenture / Wipro / TCS engagements regularly — typically as the AI specialist arm of a broader transformation.

### "What if our team can't take over?"
- We extend hypercare. Sustain retainer covers this. We've never had a client unable to take over — but if it happens, we stay.

### "Can you do this without Microsoft?"
- Yes. Azure is our most-used stack because we're MCT-certified, but we deliver on AWS, GCP, and self-hosted open-source. Choice belongs to you.

---

## What the website surfaces from this doc

On the site, this becomes:

| URL | Content |
|---|---|
| `/about/team-and-delivery` | Team model, role mix, capacity, cadence |
| `/about/trust-and-security` | NDAs, IP, data handling, stack table |
| `/the-gennoor-way` | The five phases + Three Pledges as a hero band |
| Every phase page | Three Pledges as a strip + price bands |
| Every PoC page | Cloud / open-source variant table + sustainment retainer |
| Every proposal PDF | Three Pledges on page 2 + delivery cadence on page 3 |

Repetition is the point — by the time a buyer signs, they've seen the Three Pledges seven times in seven different surfaces.

> **Continue to: [08 — SMB vs Enterprise tracks](08-smb-enterprise-tracks.md)**
