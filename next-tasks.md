# Next Tasks — Website Conversion Improvements

Remaining items. These need **your input/decisions or real data** — they can't be done safely without you.

> Done in a prior pass (no input needed): truthful "Delivered training to professionals at" claim + Metrics description; concrete hero headline ($3k / 6-week pilot) + plain "train / build / advise" subheadline; demoted the flashing PoC button so the AI Readiness Diagnostic is the single primary CTA; nav relabel ("Training" / "Build & Consulting"); grammar "Client's Feedback" → "What Clients Say". Placeholder phone `+91-XXXXXXXXXX` verified — it's never rendered (only `siteConfig.phone` definition exists; no component references it).

---

## 1. Are you a company or one person? The site can't decide

Every section says "**we**," "**our team**," "senior delivery," "Team & Delivery · capacity." But every testimonial is about **Jalal**, and the About pages are a solo founder story. Buyers can't tell who does the work or whether there's capacity — that hesitation kills bookings.

**Pick a lane (your call):**
- **Own the boutique/solo reality** (a selling point): "You work directly with a senior Microsoft-certified expert. No junior consultants, no handoffs."
- **Or** genuinely show the team (names, faces, roles).

The corporate "we" floating over a one-person operation is what erodes trust.

**Files:** `src/lib/site-config.ts` (hero copy), `src/app/about/team-and-delivery/page.tsx`, homepage components.

---

## 2. Testimonials read as low-credibility or fabricated

- Trustpilot ones are first-name-only / handles ("Lions Kashif," "Tech Bliss") — look fake even if real.
- The strong ones (MCIT Saudi Arabia, Bank of Tanzania, EY) are **anonymous job titles** — no name, no photo, no logo. Anonymous enterprise quotes are the #1 thing buyers assume are invented.

**Fix (needs real data from you):** Get 3–4 real, attributable quotes (full name, title, photo or LinkedIn). Four believable ones beat eight anonymous ones. Drop/demote handle-only Trustpilot entries on the homepage.

**Files:** `src/components/home/Testimonials.tsx`.

---

## 3. Metrics measure your activity, not the client's outcome

"80+ programs," "50+ C-suite trained," "16 certifications," "6 countries" are about *you*. Buyers want outcomes: cost cut, hours saved, time-to-deploy. There are **no outcome numbers and no real case study with results on the homepage.**

**Fix (needs real numbers from you):** Add one concrete outcome stat and one named (or anonymized-but-specific) case study: *"Cut document processing time 70% for a regional bank in 6 weeks."*

**Files:** `src/components/home/Metrics.tsx`, `src/app/case-studies/page.tsx`, `src/components/home/POCShowcase.tsx`.
