# Chapter 3 — Quality vision AI

**Course:** AI in Manufacturing · **Chapter:** 03 · ~4.5 min

## Persona
Emma. Plant-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Quality vision AI.* Operator labelling loop. False-confidence discipline.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 messy challenges]

Three messy-real-world challenges.

Quality vision in a lab is *easy*. In a plant — *messy*.

*Challenge one — lighting variability.* Sunlight through windows. Shift changes. *Models trained in one lighting condition fail in another.*

*Challenge two — model drift.* Material lots change. Suppliers change. Process drifts. *Today's good part is tomorrow's defect signature.*

*Challenge three — novel defects.* Models only know what they've seen. *A new failure mode shows up — model misses it — bad parts ship to customer.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3-stage operator labelling loop]

The three-stage operator labelling loop.

*Stage one — disagreement capture.* When AI says "defect" and operator says "good" — or vice versa — capture both labels with the image.

*Stage two — weekly review.* Quality engineer reviews disagreements. *Real defect? Real false positive? Edge case worth retraining on?*

*Stage three — retraining cadence.* Quarterly minimum. Monthly if disagreements compound. *Continuous learning, not one-time training.*

Plants that skip the labelling loop. *Models degrade silently. Defect escapes compound. Customer complaints rise.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · false confidence]

The false-confidence trap. Year two failure mode.

*Year one — model deploys, performs well, team builds trust.*

*Year two — performance degrades. Team still trusts it.* False confidence becomes the operational risk.

*Three disciplines that prevent it.*

*Discipline one — production performance dashboards visible to plant leadership weekly.*

*Discipline two — sampling audits.* Periodic human review of model decisions on random sample. *Catches drift before customer does.*

*Discipline three — defect escape tracking.* When defects reach customers, root cause back to model. *Was the defect type in training data? Did the model see it and misclassify?*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score quality vision AI honestly. *Two questions.*

*Question one — defect escape rate last twelve months versus pre-AI baseline?* Lower green. Same amber. *Higher red — AI is making things worse.*

*Question two — operator labelling loop running with weekly review?* Yes green. Inconsistent amber. *No red — model is degrading silently.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last three months of customer defect complaints.* For each — was it a defect type in training data? *That answer is your retraining priority.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Process optimisation with AI.* Operator-led experiments and overfitting guards.

> [end]
