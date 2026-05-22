# Chapter 2 — Ambient scribing

**Course:** AI in Healthcare · **Chapter:** 02 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. Clinical workflow register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Ambient scribing.* The fastest-deploying AI use case in healthcare. *Two-plus hours per day saved on documentation for active users.* And the use case where the operational governance has to be exceptional.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · what's deployed]

What's deployed in twenty twenty-six. *Microsoft's Nuance DAX — Dragon Ambient eXperience* — the established leader. Deployed across major US health systems. *Abridge — competing offering with strong Epic integration.* Suki, Augmedix, DeepScribe — additional platforms with different specialty focuses.

What they do. *AI listens to the physician-patient conversation in real time.* Transcribes. *Generates a clinical note in the format the physician uses — SOAP note, progress note, history-and-physical.* Inserts into the EHR for physician review and sign-off.

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · the time savings]

The time savings. *Active-user physicians report two-plus hours per day saved on documentation.* The CMS-published time data and the physician burnout literature both align on this.

What that time becomes. *More patients seen.* More time per patient. Time for research. Time for physician wellbeing. *The economics work — at typical physician compensation rates, the AI pays for itself in time saved within months of active use.*

> [S4 ▸ slide change · t ≈ 1:50]

> [S4 ▸ reveal 1 · PHI handling]

PHI handling. *Protected Health Information.* HIPAA Privacy Rule + Security Rule apply. *Business Associate Agreement — BAA — required with the AI vendor.* Microsoft, Abridge, Suki, Augmedix all sign BAAs at enterprise tier.

The data flow. *Audio is processed by the AI vendor.* Transcript and note are returned to the EHR. *Many vendors process in-tenant or in-VPC* — meaning the data stays within the hospital's cloud boundary.

The discipline. *Audit the data flow before deployment.* Where is audio processed. Where is it stored. Retention policy. *Minimum-necessary principle from HIPAA — does the vendor receive only what they need.*

> [S5 ▸ slide change · t ≈ 2:50]

> [S5 ▸ reveal 1 · patient consent]

Patient consent. *In US — HIPAA-compliant ambient scribing generally doesn't require additional patient consent beyond standard hospital intake notices.* But — *best practice is to inform the patient.*

In EU — *GDPR + EU AI Act Art. 50 apply.* Patient may need explicit consent for AI use. *Check national health-data law.* India DPDPA — health data is sensitive personal data, consent required.

The discipline. *Standard consent script.* "Your physician is using an AI assistant to help with documentation. The recording will be used only to create your clinical note. You may opt out at any time." *Three sentences. Clear. Consistent across the hospital system.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *If your hospital uses ambient scribing — audit one week of physician-patient interactions where AI was used.* Verify the data flow. Verify the consent process. *Verify that physicians sign every note before it goes to the EHR.* Catch the operational gaps now.

> [S6 ▸ slide change · t ≈ 4:00]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Clinical decision support.* Epic Cosmos. UpToDate. *Specialty platforms. The clinical responsibility line.*

> [end]
