# Chapter 6 — Security automation + SOAR

**Course:** AI for Cybersecurity SOC · **Chapter:** 06 · ~4.5 min

## Persona
Emma. SOAR-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Security automation and SOAR.* Where automation works. *Where it makes incidents worse.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the automation spectrum]

The automation spectrum.

*Fully manual.* Every action by analyst. Slow. High consistency only with strong process. Common for low-volume mature SOCs.

*Augmented manual.* AI prepares context. Analyst decides and acts. *Time saved on prep. Decisions still human.*

*Approved automation.* AI proposes action. Analyst approves. Automation executes. *Time saved on execution. Decision still human.*

*Autonomous response.* AI decides and acts without human review. *Fastest. Highest risk.*

Most mature SOCs in 2026 use augmented manual and approved automation as the baseline. *Autonomous response reserved for very specific, very high-confidence scenarios with extensive testing.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · safe autonomous scenarios]

Safe autonomous response scenarios. *Narrow.*

*Pattern one — known malware quarantine.* High-confidence detection. Single endpoint. Reversible action.

*Pattern two — phishing email auto-removal.* When detection confidence is very high. Removal is reversible.

*Pattern three — basic IP blocking at perimeter.* When the IP is on a high-confidence threat list. Block is monitored. Easy to revert.

These three are typically safe. *Anything broader requires human review.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · dangerous autonomous scenarios]

Dangerous autonomous scenarios. *Common.*

*Pattern one — account disablement.* AI disables a user account based on anomaly. *If wrong, business operation impacted.*

*Pattern two — network segment isolation.* AI isolates network segment based on suspected lateral movement. *If wrong, production outage.*

*Pattern three — automated containment with cross-system impact.* AI initiates response that touches multiple systems. *Blast radius is hard to predict.*

These three require human in the loop. *Always. Without exception.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score SOAR AI honestly. *Two questions.*

*Question one — for the last twelve months of automated responses, what percentage caused or contributed to a business outage or major escalation?* Zero green. One or two and lessons captured amber. *Three or more red — automation scope too broad.*

*Question two — for any autonomous response, is the decision logic auditable and the action reversible?* Both yes green. *Neither yes for any automated path red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your SOAR playbook list.* For each fully automated path — *what's the worst-case business impact if AI decides wrong?* Anything beyond "small inconvenience" needs human in the loop.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *AI's own attack surface.* When AI in your SOC becomes the target.

> [end]
