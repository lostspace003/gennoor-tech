# Chapter 7 — AI's own attack surface

**Course:** AI for Cybersecurity SOC · **Chapter:** 07 · ~4.5 min

## Persona
Emma. AI security register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *AI's own attack surface.* When AI in your SOC becomes the target.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the meta problem]

The meta problem.

Your SOC deploys AI to detect attacks. *Attackers know this.* The AI itself becomes a target.

Not theoretical. *Demonstrated in research and increasingly in the wild.* AI models can be manipulated to misclassify. AI prompts can be injected. AI training data can be poisoned. *Attacker who controls your detection AI controls what your SOC sees.*

> [S3 ▸ slide change · t ≈ 0:50]

> [S3 ▸ reveal 1 · 4 attack vectors]

Four attack vectors against SOC AI.

*Vector one — model evasion.* Attacker crafts behaviour that triggers as benign to your ML detection. *Demonstrated against UEBA and anomaly detection systems.*

*Vector two — prompt injection.* Attacker injects content into log data or alerts that manipulates the LLM-powered analysis. *Increasingly seen as SOCs use LLMs for triage.*

*Vector three — training data poisoning.* Attacker introduces patterns into the training data so the model learns to ignore them. *Slow. Subtle. Hard to detect.*

*Vector four — model exfiltration.* Attacker queries the AI to learn its decision boundaries. *Once known, evasion becomes systematic.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · 4 defensive patterns]

Four defensive patterns.

*Pattern one — defence in depth retained.* AI augments signatures and rules. *Doesn't replace them.* If AI is compromised, the other layers still produce signal.

*Pattern two — model behaviour monitoring.* Watch for sudden shifts in AI output distributions. *Sudden classifications change pattern triggers human review.*

*Pattern three — adversarial training.* Train the model against adversarial examples. *Increases robustness.*

*Pattern four — model and training data integrity.* Cryptographic verification. Access controls. Audit trails. *Same discipline as for any critical security system.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score SOC AI security honestly. *Two questions.*

*Question one — if your SOC AI is suddenly producing unusual output, how quickly do you detect it?* Automated monitoring with same-day detection green. Manual periodic review amber. *Honestly probably wouldn't notice red.*

*Question two — is your training data and model itself protected with the same controls as production data?* Yes green. *Less protected than production data red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Sit with your security architect and your AI lead.* Ask one question — *if our SOC AI is compromised today, how would we know in the next forty-eight hours?* The answer is your detection-of-detection gap.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Last chapter. *Your SOC AI roadmap.* Four trust trip-wires. Interactive builder.

> [end]
