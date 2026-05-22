# Chapter 7 — Decision drift and audit cadence

**Course:** AI Decision Making · **Chapter:** 07 · ~4.5 min

## Persona
Emma. Manager-to-manager register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Decision drift and audit cadence.* Catching slow drift before it becomes a quality problem.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 drift types]

Three drift types in AI-augmented decisions.

*Drift one — deference drift.* Over months, the team accepts AI recommendations more often. *Override rate falls. Critique declines.* You're sliding toward AI-as-decider.

*Drift two — verification drift.* Verification protocol exists on paper. In practice, "looks fine" replaces actually verifying. *Until something doesn't look fine and slipped through.*

*Drift three — model drift.* Vendor updated the model. Behavior changed. *Your team's calibration is now off. Same prompt, different output, different decisions.*

All three are slow. *Visible only with audit.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · the quarterly audit]

The quarterly decision audit.

Once a quarter, an hour. *Pull 10-15 AI-augmented decisions from the previous quarter.*

For each.

*Did the pre-commitment happen?* If not, that's drift.

*Was AI input used as input, or as decider?* If decider, that's drift.

*Did override documentation happen where appropriate?* If not, that's drift.

*Was the decision good or bad in retrospect?* If consistently bad on certain types, that's calibration drift.

The output is a one-page summary. *Drift patterns identified. Norms reinforced or updated.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · catching model drift]

Catching model drift specifically.

The signal. *Same input produces different output than 6 months ago.*

The check. *Maintain 5-10 canonical prompts. Run them quarterly. Compare outputs to baseline.*

If outputs drift meaningfully. *Audit your team's calibration.* They've been making decisions assuming the old behaviour. *Update the assumption.*

This is the LLMOps drift discipline applied to your team's decision process. *Cross-domain from chapter 3 of MLOps for LLMs.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score audit cadence. *Two questions.*

*Question one — does your team run a quarterly decision audit?* Yes consistently green · "we should" amber · *no red — drift is invisible*.

*Question two — when audit finds drift, do you update norms or coach the team?* Yes both green · one but not the other amber · *no action taken red — audit becomes theatre*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Schedule one hour next quarter for a decision audit.* Pull 10 decisions. Walk the four audit questions. *That single hour exposes more drift than six months of feeling.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · last chapter]

Last chapter. *Capstone — your one-page AI decision charter. The builder.*

> [end]
