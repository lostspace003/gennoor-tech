# Chapter 3 — Clinical decision support

**Course:** AI in Healthcare · **Chapter:** 03 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. Clinical decision register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Clinical decision support AI.* The use case where the physician-responsibility line is sharpest. *AI supports. The physician decides. ABIM, AMA, CMS — all unambiguous.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · what's deployed]

What's deployed in twenty twenty-six. *Epic Cosmos and Epic AI — large EHR vendor integration across thousands of US hospitals.* UpToDate Clinical AI — clinical reference + decision support evolution. *Specialty platforms — Tempus for oncology, Flatiron Health for cancer registry analytics, Owkin for multi-omics research.*

The pattern. *AI surfaces relevant evidence at the point of care.* Best-practice alerts. Differential diagnoses. Drug-drug interaction checks. *The physician reviews the AI's recommendations alongside the clinical picture.*

> [S3 ▸ slide change · t ≈ 1:10]

> [S3 ▸ reveal 1 · the responsibility line]

The responsibility line. *Crystal clear by twenty twenty-six.*

*American Board of Internal Medicine — clinical decisions are physician responsibility.* AI supports. *American Medical Association — physician judgement is core to the patient-physician relationship. AI augments. Doesn't replace.* CMS — *AI use must not impair clinical decision-making or shift responsibility from the physician.*

What this means in practice. *AI recommendations are inputs.* The physician considers them, weighs against the patient's clinical context, and makes the decision. *If an AI recommends X and the physician does Y, that's the physician's call.* Documentation should reflect that the AI was consulted and the physician's judgement prevailed.

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · hallucination risk]

The hallucination risk. *Stanford "Hallucinating Law" pattern applies directly.* If AI is making up details in legal briefs, *it can make up dosages, contraindications, study citations in clinical settings.* That's a medical-error vector.

The mitigation. *Retrieval-grounded clinical AI.* The AI is constrained to evidence from approved clinical sources — UpToDate, primary literature, hospital formulary. *Citations to source documents.* Quote-or-cut applies. If the AI says "the patient has X based on study Y" — there must be a verifiable Study Y.

The discipline. *Physicians treat AI recommendations as residents-in-training. Useful. Smart. Need to be checked.* The senior physician's judgement is the safeguard.

> [S5 ▸ slide change · t ≈ 3:20]

> [S5 ▸ reveal 1 · the bias question]

The bias question. *Training data in clinical AI is often unrepresentative of patient populations.* Underrepresentation by ethnicity, gender, age, body type. *Documented across radiology, dermatology, oncology — sometimes pulmonology and cardiology.*

What this means clinically. *AI may perform less well on patient subgroups underrepresented in training data.* This isn't a hypothetical. The literature is increasingly clear. *Discipline — when the AI flags or surfaces a finding, the physician asks: is the AI calibrated for this patient's demographics?*

The vendor angle. *Demand bias-monitoring data from your clinical AI vendors.* If they can't provide subgroup performance metrics, that's a procurement-team gap to close.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one clinical AI tool currently deployed in your hospital.* Verify three things. *Physician documentation reflects AI as input, not as decision-maker.* Bias-monitoring data is available from the vendor. *Hallucination-monitoring — citations are checked, false-positive flags are tracked.* If any is missing, that's the gap.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Radiology and diagnostic AI.* Aidoc, Annalise, Heuron. *FDA SaMD-approved devices. Radiologist-in-the-loop. False-positive trade-offs.*

> [end]
