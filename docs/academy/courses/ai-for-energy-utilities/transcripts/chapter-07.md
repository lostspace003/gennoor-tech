# Chapter 7 — Cybersecurity for AI in critical infrastructure

**Course:** AI for Energy & Utilities · **Chapter:** 07 · ~4.5 min

## Persona
Emma. Critical-infrastructure cyber register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Cybersecurity for AI in critical infrastructure.* OT plus IT plus AI. *Where most utilities are exposed.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the OT+IT+AI stack]

The OT plus IT plus AI stack.

*OT — operational technology.* SCADA, EMS, DMS. *Controls the grid.*

*IT — information technology.* Enterprise systems. Customer data. Forecasting models.

*AI — increasingly bridges OT and IT.* Forecasts feed dispatch. Predictive maintenance pulls operational data into ML pipelines. *That bridge is the new attack surface.*

The historical air gap is gone in most utilities. *AI requires data flowing across OT-IT boundaries. That data flow is what attackers target.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 4 attack vectors]

Four AI-relevant attack vectors in 2026.

*Vector one — data poisoning.* Adversaries inject corrupted training data to bias model behaviour. *Effects show up months later. Hard to detect.*

*Vector two — model evasion.* Inputs crafted to make the model misclassify or make wrong predictions. *Demonstrated against image-based and time-series models alike.*

*Vector three — model exfiltration.* Stealing the model itself. *Loss of proprietary IP plus reduced security posture if a copy is in adversary hands.*

*Vector four — supply chain compromise.* Vendor's model update is compromised. *Pulls the compromise into utility systems.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 defensive patterns]

Three defensive patterns.

*Pattern one — segmented model training.* Training data lives in segmented environments. *Production models served via controlled APIs, not direct file access.*

*Pattern two — model behaviour monitoring.* Real-time monitoring for unexpected model behaviour. *Sudden shift in predictions triggers human review before action.*

*Pattern three — vendor model security requirements in contracts.* Vendor must demonstrate secure development, supply chain integrity, security incident response. *In writing. Tested.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score AI cybersecurity honestly. *Two questions.*

*Question one — for AI models in critical operational paths, do you have monitoring that detects abnormal model behaviour in real time?* Yes green. Daily review amber. *No real-time monitoring red.*

*Question two — do your AI vendor contracts include cybersecurity terms — supply chain integrity, incident notification, security audit rights?* New contracts yes green. Mixed amber. *No red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one production AI model bridging OT and IT.* Ask security and AI teams jointly — *what's the worst attack vector against this model? How would we detect it? How quickly?* The answer is your roadmap priority.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Last chapter. *Your AI rollout roadmap.* Four trip-wires. Interactive builder.

> [end]
