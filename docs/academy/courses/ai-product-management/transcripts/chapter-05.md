# Chapter 5 — Guardrails + refusals

**Course:** AI Product Management · **Chapter:** 05 · ~4.5 min

## Persona
Andrew. Guardrails register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Guardrails and refusals.* What the AI must not say or do.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 guardrail categories]

Four guardrail categories every AI product needs.

*Category one — out-of-scope refusals.* The AI declines to help with things outside its intended use. *Polite, clear, with an offered alternative if relevant.*

*Category two — sensitive topic handling.* Health, legal, financial advice when not appropriate. *Refusal or referral to qualified humans.*

*Category three — harmful content refusal.* The AI refuses requests that would produce illegal, harmful, or policy-violating content. *Robust against jailbreak attempts.*

*Category four — citation and verification requirements.* For factual claims, the AI cites sources. *Mata v. Avianca cross-domain — AI can hallucinate citations. Verification is the user's responsibility, but the product makes verification easy.*

> [S3 ▸ slide change · t ≈ 1:30]

> [S3 ▸ reveal 1 · refusal as feature]

Refusal as feature. *Counter-intuitive but real.*

A product that refuses appropriately builds more user trust than one that always says yes. *Users learn what the AI is good at and what to ask for. They also learn what to handle themselves.*

What works. *Refusal messages that explain why and offer alternatives.* "I can summarise this email, but for legal interpretation of contract terms please consult your legal team."

What does not. *Generic "I can't help with that" with no explanation.* Or worse, attempting to help with things the product cannot reliably do.

The honest position. *A narrow AI product that does its job well is better than a broad AI product that does many jobs poorly.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · adversarial testing]

Adversarial testing. *Required.*

Users will try to make your AI do unintended things. *Some accidentally. Some deliberately.* Test your guardrails against this before users do.

What this looks like. *Internal red team that tries to make the AI misbehave.* Document jailbreak attempts. Patch them in evals. Repeat regularly. *Adversarial robustness is not a one-time check.*

Real-world examples are documented. *Air Canada Moffatt cross-domain — chatbot misrepresentation became company commitment. Twitter Tay degenerated within hours.* Pre-launch adversarial testing prevents headlines.

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score guardrails honestly. *Two questions.*

*Question one — for your top AI feature, what's the success rate on adversarial test prompts?* Above ninety percent green. Seventy-five to ninety amber. *Below seventy-five red.*

*Question two — when was the last adversarial test run with new attack patterns?* Within last quarter green. Within last six months amber. *Never or once at launch red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Spend thirty minutes trying to break your own AI product.* Document what worked. *Those are your guardrail gaps.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Pricing, communication, and trust.* Where AI products earn or lose customer relationships.

> [end]
