# Chapter 3 — Threat detection augmentation

**Course:** AI for Cybersecurity SOC · **Chapter:** 03 · ~4.5 min

## Persona
Emma. Detection-engineering register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Threat detection augmentation.* UEBA, anomaly detection. *The things signatures miss.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the layered model]

The layered detection model.

*Layer one — signatures.* Known bad. IoCs. Hash matches. Pattern signatures. *Reliable for known threats.*

*Layer two — rules and correlation.* Defined logic that combines signals. *Effective for documented attack patterns.*

*Layer three — AI augmentation.* UEBA, anomaly detection, behavioural baselines. *Catches deviations that signatures and rules don't cover.*

The principle. *Each layer covers what the previous misses.* AI does not replace layers one and two. *AI adds a third layer.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · UEBA in practice]

UEBA in practice. *User and entity behaviour analytics.*

What it does. *Establishes behavioural baselines for users and entities. Flags significant deviations.*

What works. *Long enough baseline period — typically thirty to ninety days. Sufficient feature set — login locations, hours, accessed resources, data volumes. Tuning to the specific environment.*

What does not work. *Out-of-the-box vendor UEBA with default thresholds.* High false-positive rates. *Analysts learn to ignore the alerts. Real anomalies missed.*

The mature SOC pattern. *Baseline period of sixty days minimum. Iterative tuning quarterly. Use case prioritisation — start with privileged accounts, then expand.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · LLM-augmented analysis]

LLM-augmented detection analysis.

A newer pattern in 2026. *Use LLMs to analyse multi-source logs and correlate signals across systems.*

What works. *Hypothesis generation by AI followed by analyst validation.* "These three events in the last hour suggest credential stuffing followed by lateral movement. Investigate." Analyst confirms or rejects.

What does not work. *LLM as primary detection engine. Hallucinated correlations. False confidence.* The Mata v. Avianca cross-domain — *AI fabricates plausible-sounding analysis. Without human verification, you investigate non-existent attacks.*

The pattern. *AI proposes. Analyst disposes.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score detection AI honestly. *Two questions.*

*Question one — detection coverage across MITRE ATT and CK techniques in your top threats.* Above seventy percent green. Forty to seventy amber. *Below forty percent red.*

*Question two — for AI-flagged anomalies, what is the analyst confirmation rate?* Twenty to forty percent confirmed real green — normal range. *Below ten percent red — your model is noise.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last week's high-severity AI-flagged anomalies.* Pick five. *Walk through with your senior analyst whether each was a real signal or noise.* That pattern tells you tuning priorities.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Incident investigation assistance.* AI as analyst force multiplier during active response.

> [end]
