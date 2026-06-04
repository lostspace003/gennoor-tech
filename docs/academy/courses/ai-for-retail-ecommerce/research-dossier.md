# AI for Retail & eCommerce — Research Dossier

**Course slug:** `ai-for-retail-ecommerce`
**Track:** Industry · Retail & E-commerce
**Audience:** Retail CEOs, CDOs, eCommerce GMs, heads of merchandising, pricing, and customer experience
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-GB-EmmaMultilingualNeural`)

## Thesis

Retail is the easiest industry to ship AI value in — and the easiest to break brand value in. The data is plentiful (POS, clickstream, CRM, returns), the use cases are obvious (search, recommendations, pricing, demand, fulfilment), and the platforms (Shopify, Salesforce Commerce, Adobe, SAP, Oracle) have native AI inside the box. The trap is that "scales fast" cuts both ways: a creepy personalisation, a dynamic-pricing accident, or a brand-voice drift travels to millions of customers before the next stand-up. This course teaches retail leaders five plays that consistently ship, three anti-plays to refuse, and the guardrails — creepy-line, pricing-fairness, brand-voice fingerprint, EU AI Act Article 50 disclosure — that keep AI on the right side of the customer-trust line.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Shopify Magic / Sidekick — generative-AI product descriptions, image edits, store assistant native in Shopify admin from 2023 onward; Sidekick GA expanded through 2024-25 | Shopify product announcements | 2023-2025 |
| 2 | Salesforce Commerce Cloud Einstein — product recommendations, predictive sort, search dictionaries; Einstein 1 / Agentforce roadmap added generative commerce agents 2024-25 | Salesforce product documentation | 2024-2025 |
| 3 | Adobe Sensei GenAI + Adobe Experience Platform — personalisation, content generation, journey orchestration in Adobe Commerce / AEP from 2023-24 | Adobe product documentation | 2023-2025 |
| 4 | Amazon — "35% of sales driven by recommendations" is the long-quoted McKinsey 2013 figure; treat as legacy benchmark, not current. Modern Amazon does not publish updated %. Pattern still holds: personalised discovery drives material share of GMV. | McKinsey 2013 + industry pattern | 2013 legacy |
| 5 | Walmart — Element ML platform, generative search, "Sparky" assistant; partnership with Microsoft + OpenAI announced through 2024-25 | Walmart corporate communications | 2024-2025 |
| 6 | Levi's AI-generated models controversy (Mar 2023) — partnership with Lalaland.ai to "supplement" human models for diversity; received public backlash for treating diversity as a synthetic-data problem. Pattern: AI as a substitute for inclusive sourcing reads as cynical. | Public reporting Mar 2023 | 2023 |
| 7 | EU AI Act (Reg 2024/1689) Article 50 — disclosure obligations: users must be informed when interacting with an AI system, and AI-generated content (including images) must be machine-readable as synthetic. Phased application; transparency obligations from Aug 2026. | EU AI Act 2024/1689 Art 50 | 2024 / Aug 2026 |
| 8 | EU AI Act Article 5 — prohibited practices including exploitation of vulnerabilities and certain manipulative techniques; relevant to "dark patterns" in personalised pricing and recommendation | EU AI Act 2024/1689 Art 5 | Feb 2025 application |
| 9 | GDPR Articles 6, 7, 22 — lawful basis, consent, and the right not to be subject to solely automated decisions with significant effect; personalised pricing edge case discussed in EDPB guidance | EU GDPR + EDPB guidance | ongoing |
| 10 | CCPA / CPRA (California) — opt-out of sale/sharing of personal information, sensitive-PI controls, and ADMT (automated decision-making technology) draft regulations under CPPA 2024-25 | CCPA / CPRA + CPPA ADMT drafts | 2024-2025 |
| 11 | India DPDPA 2023 — consent-first regime; notice, purpose limitation, and a Data Protection Board; rules phased through 2025-26 | DPDPA Act 2023 | 2023 / 2025-26 |
| 12 | FTC enforcement pattern — actions against deceptive AI claims and "dark patterns" in e-commerce (e.g. Amazon Prime cancellation 2023; ongoing FTC AI scrutiny). Pattern: deceptive AI marketing is enforceable today under existing law. | FTC press releases 2023-2025 | 2023-2025 |
| 13 | SKU-store demand forecasting reality — M5 Forecasting Competition (Walmart × Kaggle 2020, paper 2022): LightGBM-class methods dominate at SKU-store granularity; sub-20% MAPE is top-quartile, 30-40% is common in fashion / long-tail | Makridakis et al. M5 paper | 2022 |
| 14 | Recommendation systems literature — collaborative filtering, content-based, hybrid; modern two-tower + sequential transformers (e.g. BERT4Rec, SASRec) are the production pattern at scale | Standard IR / RecSys literature 2018-2024 | ongoing |
| 15 | Personalised pricing — economic literature distinguishes price discrimination (per-customer pricing) from dynamic pricing (per-context). EDPB + FTC + consumer-protection authorities treat first as high-risk for discrimination and trust | EDPB + academic economics | ongoing |
| 16 | Dynamic-pricing accidents — public pattern of marketplace listings glitching to absurd prices (e.g. textbook priced at $23m on Amazon in 2011 from competing bots); illustrates need for floors/ceilings/sanity checks | Public reporting 2011 + industry pattern | legacy + ongoing |
| 17 | Returns reality — National Retail Federation: US retail returns ~$700-900B annually in recent years, ~15-17% of total sales; e-commerce return rates materially higher than store | NRF returns reports 2023-2024 | 2023-2024 |
| 18 | Fraud detection — chargeback + first-party fraud rising with BNPL and account-takeover; vendors (Stripe Radar, Adyen, Riskified, Signifyd) ship ML scoring with appeal paths as standard | Vendor product docs + industry reporting | 2023-2025 |
| 19 | Brand-voice drift in generative content — pattern: LLM product copy at scale drifts to generic "elevate your everyday" voice unless style-guide-as-system-prompt + periodic fingerprint audit | Industry pattern | 2023-2025 |
| 20 | Experimentation discipline — A/B testing is the dominant pattern at digital-native retail (Amazon, Booking, Netflix publicly documented); 1pp conversion lift on a large catalogue is real money | Public engineering blogs + industry pattern | ongoing |
| 21 | "Creepy line" framing — coined by Eric Schmidt (Google) 2010; widely used in personalisation ethics discussion. Useful as a leadership concept, not a regulation. | Public quote 2010 | classic reference |
| 22 | Hallucinated-citation cross-domain analog — Mata v. Avianca (S.D.N.Y. Jun 2023) sanctioned counsel for filing ChatGPT-fabricated cases; the canonical analog for "AI confidently invents a source" in any vertical including retail copy/marketing claims | Mata v. Avianca S.D.N.Y. Jun 2023 | 2023 |

## Named incidents

1. **Levi's × Lalaland.ai (Mar 2023)** — AI-generated models to "supplement diversity"; public backlash. Use to ground the personalisation/brand-voice creepy-line discussion: AI as substitute for inclusive sourcing reads as cynical.
2. **Amazon $23m textbook (2011)** — competing pricing bots ratcheted a listing to absurd levels. Use to ground dynamic-pricing guardrails (floor/ceiling/sanity checks).
3. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — cross-domain analog for AI confabulation in retail (marketing claims, product Q&A, support-bot answers).
4. **Industry pattern — personalised pricing backlash** — repeated consumer-trust failures when customers discover different prices for the same SKU. Reference as pattern, not a single named case.

## What we do NOT say

- **No "AI replaces merchants / planners / CX teams" framing.** Augmentation, not replacement. Human judgement on assortment, brand voice, and pricing fairness is non-negotiable.
- **No vendor-selection bias.** Shopify, Salesforce, Adobe, SAP, Oracle, Microsoft, AWS referenced even-handedly. No "best stack."
- **No invented stats** ("X% lift", "Y% conversion"). Where a specific number isn't verifiable, frame as industry pattern.
- **No claim that fully automated dynamic pricing is safe.** Guardrails are not optional.
- **No claim that surveillance-grade personalisation drives loyalty.** The creepy line costs more than it earns.
- **No legal advice.** GDPR / CCPA / EU AI Act / DPDPA framing is structural, not prescriptive — counsel decides application.

## Chapter blueprint

### Chapter 1 — The retail + eCommerce landscape (~5 min)
**What:** Retail is where AI scales fastest and brand breaks fastest. The five plays: merchandising / pricing / personalisation / fulfilment / returns + fraud. The three anti-plays: fully automated dynamic pricing without guardrails, surveillance-grade personalisation, AI-only customer service. The regulatory frame: FTC enforcement of deceptive AI + dark patterns, GDPR Art 6/7/22, EU AI Act Art 5 + 50, CCPA/CPRA + ADMT drafts, India DPDPA.
**Sources:** [1], [2], [3], [7], [8], [9], [10], [11], [12].

### Chapter 2 — Merchandising + assortment (~5 min)
**What:** Three use cases: assortment optimisation, attribute extraction from product copy/images, demand forecasting for buy-plans. The SKU-store forecasting reality from M5: sub-20% MAPE is top-quartile, 30-40% common in fashion and long tail. NPI realism via analog-product lookup. Where Shopify / Salesforce / Adobe / Oracle Retail / SAP fit.
**Sources:** [1], [2], [3], [13].

### Chapter 3 — Pricing (~5 min)
**What:** Three plays — dynamic pricing within guardrails (floors, ceilings, competitor sanity, brand-protected SKUs), markdown optimisation, promo uplift forecasting. The $23m textbook as the canonical guardrail story. The personalised-pricing trap: economic price discrimination ≠ contextual dynamic pricing; EDPB + FTC + consumer trust all push back. Article 5 (manipulative practices) edge case.
**Sources:** [8], [9], [15], [16].

### Chapter 4 — Personalisation (~5 min)
**What:** Three tiers — relevance (recommendations, search ranking), contextual (channel/session), individual (cross-session profile). Three creepy-line categories where to stop: health/sensitive inference, life-event prediction (pregnancy, bereavement, financial distress), and dark-pattern nudging. Recommendation systems pattern (collaborative + content + sequential transformers). The trust math: relevant beats clever; opt-out and explainability cost less than a backlash. Eric Schmidt's creepy-line framing as the leadership shorthand.
**Sources:** [4], [9], [14], [15], [21].

### Chapter 5 — Fulfilment + inventory (~5 min)
**What:** Three use cases: demand sensing into replenishment, network optimisation (DC + store + drop-ship), last-mile routing. The most reliable retail AI ROI category — boring, measurable, low brand risk. Three failure modes: stale signals, fragile single-vendor lock-in, over-tuning to last quarter. Where Blue Yonder / o9 / Manhattan / SAP IBP / Oracle SCM fit.
**Sources:** [13], plus fulfilment vendor pattern.

### Chapter 6 — Returns + fraud (~5 min)
**What:** Returns reality (NRF $700-900B; e-com rate materially higher). AI on returns: prediction at PDP, fit-recommendation, fraud-cluster detection — with the fairness constraint (no group-level penalties that proxy for protected attributes). Fraud detection: Stripe Radar / Adyen / Riskified / Signifyd pattern. Appeal paths are non-negotiable — false positives lose lifetime value silently.
**Sources:** [17], [18], [9], [10].

### Chapter 7 — Brand voice protection (~5 min)
**What:** Three voice-protection patterns — style-guide-as-system-prompt, quarterly brand-fingerprint audit, "quote-or-cut" on AI-generated claims (Mata v. Avianca cross-domain). EU AI Act Article 50: disclose AI interaction; mark synthetic images/video machine-readably. The Levi's × Lalaland pattern as the cautionary case. The experimentation discipline: every personalisation / copy / pricing change ships behind an A/B test with a primary metric + a guardrail metric.
**Sources:** [6], [7], [19], [20], [22].

### Chapter 8 — Making it stick · your retail AI roadmap (~6 min)
**What:** 12-month rollout. Months 1-3: fulfilment + returns baselines (lowest brand risk, fastest ROI). Months 4-6: merchandising + pricing-with-guardrails. Months 7-9: personalisation (tier 1 + 2 only). Months 10-12: brand-voice fingerprint audit + EU AI Act readiness. Four trust trip-wires: no dynamic pricing without floors/ceilings/brand-protected SKUs, no Tier-3 personalisation crossing the creepy line, no AI-generated brand copy without quote-or-cut, no AI-only CX path without a human escalation. Interactive Markdown builder for the CEO/CDO one-pager.
**Sources:** Composite of [7], [8], [12], [19], [22].

## Tone

- **Emma, retail-leader register.** UK English. Practical. Numbers when verifiable, patterns when not. Brand-trust language.
- **Honest about retail AI limits.** "Scales fast, breaks fast." Fulfilment is the boring win; pricing and personalisation are where trust is at stake.
- **The creepy line + the guardrails as the chorus.** Relevant beats clever. Fair beats optimal.
- **No fear-mongering on regulation.** EU AI Act, GDPR, CCPA, DPDPA are guardrails leaders should know — counsel decides application.

## Theme

Same neutral-slate (`#475569` / `#334155`) + orange-accent (`#F97316` / `#FB923C`) palette as the rest of the Industry track. Navy `#0F172A`, tint `#F8FAFC`. No emojis. Sora headings, Inter body.
