# 11 — Execution Roadmap

How to ship the transformation. Phased so you get visible momentum within 2 weeks, while the full rebuild rolls out over 16.

---

## Guiding principles

1. **Ship narrative first, structure second, depth third.** A buyer notices the *story* before they notice 20 new pages. Repositioning copy ships in week 1.
2. **No big-bang relaunch.** Roll page-by-page; the old pages keep serving traffic until the new ones land.
3. **Reuse before rebuild.** Every existing asset that can be re-skinned is, before anything new is written.
4. **Use staging → main flow** per [memory feedback_staging_workflow.md](../../../memory/feedback_staging_workflow.md). All work merges to staging first, then to main after smoke test.
5. **Test on real devices.** Especially the homepage and `/the-gennoor-way` page.

---

## Phase A — Narrative Reset (Weeks 1–2)

**Goal:** the site reads like the new firm. Even if many pages still need rework, the front door tells the new story.

### What ships
- [ ] **Homepage hero** rewritten — new headline, brand promise, dual CTA
- [ ] **5-phase framework section** added to homepage (basic version — full animated SVG can come later)
- [ ] **Dual-audience selector** card added to homepage
- [ ] **Trusted-by strip** stays (no change)
- [ ] **Founder credibility block** moved to position 7-8
- [ ] **Site config** (`src/lib/site-config.ts`) updated: tagline, hero, services
- [ ] **Footer** updated with new tagline line: *"Diagnose. Train. Innovate. Build. Sustain."*
- [ ] **Metadata + JsonLd** updated for new positioning
- [ ] **/about** hero rewritten with purpose statement
- [ ] **/services hero rewritten** as bridge ("renamed to /solutions soon")
- [ ] **One blog post** announcing the repositioning (LinkedIn launch piece)

### What stays unchanged (deferred)
- Most sub-pages still serve old copy with new framing in headers
- AI Academy still up (replacement comes in Phase B)
- Most service detail pages unchanged

### Outcome of Phase A
- A visitor lands on the homepage and sees a clearly different firm
- Founder profile is still strong but no longer the headline
- Brand promise visible 5+ times across the site

---

## Phase B — The Spine (Weeks 3–5)

**Goal:** the methodology, the SMB/Enterprise tracks, and the new architecture core.

### What ships
- [ ] **/the-gennoor-way** page — full 2,000-word pillar page with diagrams
- [ ] **/solutions** hub page (rename from /services with 301)
- [ ] **/solutions/for-smb** page with 5 SMB packages
- [ ] **/solutions/for-enterprise** page with 6 Enterprise engagement models
- [ ] **The Three Pledges** module — built as a reusable React component, deployed across solution pages
- [ ] **/about/team-and-delivery** page
- [ ] **/about/trust-and-security** page (NDA template, IP, data handling, stack table)
- [ ] **/contact** restructured around three intents (diagnostic / pilot / talk)
- [ ] **301 redirects** set up: /services → /solutions, /portfolio → /about, /portfolio/demos → /resources/pocs

### Critical content authoring in this phase
- The Gennoor Way pillar page (writer)
- The Three Pledges copy (writer)
- SMB package descriptions (writer + founder review)
- Enterprise engagement model descriptions (writer + founder review)
- Trust & security content (legal review)

### Outcome of Phase B
- The full positioning is operational
- Both SMB and Enterprise buyers can complete a guided journey
- Procurement teams have what they need

---

## Phase C — The Catalogs (Weeks 6–10)

**Goal:** the PoC catalog and course catalog go live. These become primary traffic + funnel surfaces.

### Week 6 — PoC Catalog (live)
- [ ] `src/data/pocs.ts` expanded to 18 entries with all new fields
- [ ] **/resources/pocs** index page
- [ ] **/resources/pocs/[slug]** template page (per-PoC deep dive)
- [ ] **"Custom Build" band** at the bottom of /resources/pocs with 6 example custom builds
- [ ] Each PoC has cloud + open-source variant displayed
- [ ] Each PoC has price band + sustainment retainer band

### Weeks 7–10 — Course Catalog (rolling)
- [ ] **/resources/courses** index page (lists 20 courses, even before all PDFs are done)
- [ ] **/resources/courses/[slug]** template page
- [ ] **PDF design template** finalized (cover, chapter, sidebar, back cover)
- [ ] **First 5 PDFs** authored, designed, uploaded (the Phase A list from [05](05-courses-plan.md))
- [ ] **301 redirect** from /ai-academy → /resources/courses (AB-100 keeps its own URL initially)
- [ ] **Email-gated download** wired up (existing newsletter signup)

### Outcome of Phase C
- Two new funnels live: PoCs (high-intent) + Courses (top-funnel)
- 18 PoC pages and 20 course landing pages added to the site (huge SEO uplift)
- Custom Build narrative explicit and visible

---

## Phase D — Industry & Function Pages (Weeks 11–13)

**Goal:** vertical and horizontal SEO surfaces — capture *"AI for [industry]"* and *"AI for [function]"* search traffic.

### What ships
- [ ] **/industries** index page
- [ ] **7 industry landing pages** — BFSI, Healthcare, Manufacturing, Government, Energy, Retail, Education
- [ ] **6 function landing pages** — HR, Finance, Sales, Customer Service, Operations, Legal
- [ ] Internal linking pass: every relevant blog post links into its industry/function page
- [ ] Internal linking pass: every PoC links into its industry/function page

### Outcome of Phase D
- 13 new SEO landing pages with intent-aligned copy
- Existing 60+ blog posts now linked into a navigable architecture
- Buyers searching by their role or industry have a clear path

---

## Phase E — Refinement (Weeks 14–16)

**Goal:** the long tail — calculators, refined visuals, AEO polish, performance.

### What ships
- [ ] **AI ROI calculator** at /resources/calculators/ai-roi
- [ ] **Copilot license calculator** at /resources/calculators/copilot-licensing
- [ ] **Animated SVG** version of the Gennoor Way diagram (replacing static)
- [ ] **Schema markup** extended (HowTo on PoCs, Product on courses)
- [ ] **/regions/[country]** pages (Saudi, India, UAE, Africa) consolidating regional content
- [ ] **/case-studies** top-level index (lifted from /portfolio/case-studies)
- [ ] **Performance pass** — lighthouse audit, image optimization
- [ ] **Accessibility pass** — contrast, alt text, screen reader

### Outcome of Phase E
- The full architecture is in place
- Site is fast, accessible, AEO-ready
- All planned pages live

---

## Phase F — Ongoing (Weeks 17+)

**Goal:** the compounding engine.

- 2 new blog posts / week
- 1 new course / month (until catalog is complete by month 8)
- 1 new PoC / 6 weeks
- 1 new case study / quarter
- 1 webinar / month
- Quarterly site audit (SEO + AEO + conversion)

---

## Dependency map (what blocks what)

```
Phase A: Narrative Reset
    │
    ▼
Phase B: Spine (no blockers — independent of catalogs)
    │
    ▼
Phase C: Catalogs ───┬──── (PDF design template blocks course PDFs)
    │                │
    ▼                ▼
Phase D: Industry & Function pages
    │   (depends on PoC catalog + course catalog being live for cross-linking)
    │
    ▼
Phase E: Refinement
    │
    ▼
Phase F: Ongoing
```

The critical path is **Phase A → B → C → D**. Phase E can start in parallel with late Phase C.

---

## Role & ownership

For a boutique team (founder + 1–2 collaborators), roles are wide. Suggested allocation:

| Role | Phase A | Phase B | Phase C | Phase D | Phase E |
|---|---|---|---|---|---|
| **Founder** (Jalal) | Strategy, copy, voice review | Strategy, copy review | Course author for 5 flagship PDFs, PoC catalog input | Industry/function content review | Stewardship |
| **Writer / content lead** | Homepage rewrite | All Phase B copy | Course copy (15 PDFs after Founder writes 5) | Industry/function pages | Calculators, case studies |
| **Designer** | Homepage tune-up | New components (Three Pledges, dual-audience) | PDF design template, course covers | Industry page layouts | Animated SVG, polish |
| **Engineer** (likely Claude Code + you) | Code changes for Phase A | Page scaffolds, redirects | Catalog routes, data layer expansion | Industry/function routes | Calculators, schema |
| **Reviewer** (founder + 1 trusted client) | Quick approvals | Heavy approvals | Approvals before publish | Approvals before publish | Light |

---

## Budgeted external help (optional)

If you want to accelerate:
- **PDF designer** (freelance, $50–$80/hr) — could compress course catalog rollout from 8 months to 4
- **SEO writer** (freelance, $0.20–$0.40/word) — could add the industry/function copy in 2 weeks vs 6
- **Animator/illustrator** ($1k–$3k flat) — for the Gennoor Way animated SVG

None of these are required. The plan can ship in-house with just founder + Claude.

---

## What success looks like at each phase

| Phase | Visible outcome | Internal proof |
|---|---|---|
| A (wk 1-2) | Homepage feels like the new firm | LinkedIn announcement post performs |
| B (wk 3-5) | Two-track journey + procurement docs work | First Enterprise prospect references trust page in a call |
| C (wk 6-10) | PoC + course catalogs live | First PDF download converts to a pilot scoping call |
| D (wk 11-13) | Industry + function pages drive organic | Google Search Console shows new indexed pages ranking |
| E (wk 14-16) | Site feels finished, fast, accessible | Calculators surface in AI assistants |
| F (ongoing) | The compounding engine works | Inbound RFP volume grows month over month |

---

## Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Founder bandwidth limits content authoring | High | Prioritize the 5 flagship courses; outsource the rest later |
| PDF design quality lags ambition | Medium | Use a clean template (e.g., LaTeX or Word with strong style sheet) before chasing InDesign perfection |
| Old SEO juice lost in redirects | Low (if 301s done right) | Maintain redirect map, test in Search Console |
| Phase C dragging on (catalogs are large) | High | Ship index pages FIRST with placeholders; fill in PDFs over time. Don't block the index on the contents. |
| Custom Build narrative confuses standard PoC story | Medium | Strong visual separation on the page; clear "or scope a custom build" CTA |
| Too many new URLs dilute domain authority | Low | Strong internal linking; consolidated cluster structure |
| Visual inconsistency across new pages | Medium | The Three Pledges + the Gennoor Way diagram + the dual-track card are mandated re-usable components |

---

## Today's action items (if you act on this in the next 24 hours)

1. **Pick the framework name.** *"The Gennoor Way™"* recommended; alternates in [02](02-framework.md). Decision unlocks all copy.
2. **Approve the brand promise.** *"Diagnose. Train. Innovate. Build. Sustain."* — confirm this lands for you.
3. **Approve the Three Pledges.** Stack-flexible / Economic / Consistent — confirm tone.
4. **Greenlight the homepage rewrite.** That's the unblock for Phase A.
5. **Decide on the 5 flagship courses to ship first.** Recommended list in [05](05-courses-plan.md).

Once these five decisions are made, week 1 work begins.

---

## A closing note on sequencing

Don't try to ship everything at once. Don't wait until everything is perfect to launch. The site **as it stands today** can absorb the Phase A narrative reset *this week*. Every week after that, more of the new firm is visible. By week 6, the new positioning is fully credible. By week 12, the site is doing the selling for you in your sleep.

The transformation is not a single launch — it is a programmed *unveiling*. Plan for the unveiling, not the launch.

---

> **Return to: [Master plan](00-master-plan.md)**
