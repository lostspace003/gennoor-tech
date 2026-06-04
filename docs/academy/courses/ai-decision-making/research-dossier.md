# AI Decision Making — Research Dossier

**Course slug:** `ai-decision-making`
**Track:** Foundations
**Audience:** Managers, directors, and senior individual contributors who already use AI in their decision workflow and want a disciplined approach to the cognitive risks
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-US-EmmaMultilingualNeural`)

## Thesis

AI is a decision *input*, not the decision. The better the model gets, the more tempting it becomes to quietly let it become the decider — and that drift is the real risk, not hallucination. This course teaches managers a discipline: name the three decision modes, install pre-commitment and AI-free decisions to keep System 2 awake, learn when to override confidently, and verify the 20% of outputs that move the world. The chorus is Kahneman + Tetlock: calibration and effort, not deference. The output is a one-page AI decision charter that survives tool churn, model upgrades, and turnover.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | System 1 / System 2 framing — fast, automatic vs slow, effortful cognition; the foundation for understanding cognitive offloading to AI | Kahneman · *Thinking, Fast and Slow* | 2011 |
| 2 | Tetlock — calibration matters more than confidence; expert forecasters who are *less* confident in point estimates outperform | Tetlock · *Expert Political Judgment* + *Superforecasting* | 2005, 2015 |
| 3 | Three decision modes: AI-as-input · AI-assisted · AI-as-decider. The drift is one-way (input → decider) unless you install friction | Industry pattern (managerial framing) | 2024-2026 |
| 4 | Cognitive offloading research — when an external tool gives confident answers, humans reduce effortful verification; effect strengthens as tool reliability rises | Risko & Gilbert + follow-on cognitive science literature | 2016 onward |
| 5 | Pre-commitment as a System 2 protector — decide *in advance* which decisions you will not delegate; classical behavioural-economics tool | Thaler & Sunstein · *Nudge* + Ulysses-contract literature | 2008 onward |
| 6 | Periodic AI-free decisions as a deference countermeasure — keeps the unaided judgement muscle calibrated, industry pattern in trading desks and editorial rooms | Industry pattern | 2024-2026 |
| 7 | The deference trap — when the model's confidence is high *and* the user's context is thin, override rates collapse even when override would be correct | Industry pattern (decision-science applied) | 2024-2026 |
| 8 | Three override signals: (a) context the model can't see, (b) recency past the training cutoff, (c) regional / local specifics the model averages away | Industry pattern + model-card guidance | 2024-2026 |
| 9 | 80/20 verification rule — verify the 20% of outputs where reversibility is low, stakes are high, or context is thin; skim the 80% | Industry pattern (managerial heuristic) | 2024-2026 |
| 10 | Three categories that need 100% verification: external fact claims, individual-rights decisions (hire/fire/promote), legal disclosure | Industry pattern + EU AI Act Annex III adjacency | 2024-2026 |
| 11 | The confabulated-source failure mode — model invents a citation or source that does not exist; cross-domain analog grounding it in court record | Mata v. Avianca · S.D.N.Y. | Jun 2023 |
| 12 | Team-level decision norms that survive tool churn — categorisation of decisions, pre-commitment on which categories never get delegated, override documentation | Industry pattern (decision-ops) | 2024-2026 |
| 13 | Scenario planning lift — AI is strong at breadth (more scenarios), variation (parameter sweeps), and adversarial framings (red-team prompts) | Industry pattern + scenario-planning literature | 2024-2026 |
| 14 | The false-confidence trap in scenarios — model-generated scenarios feel exhaustive but cluster around training-data priors; the unseen scenario is the one that breaks you | Tetlock + scenario-planning literature | classic + 2024-2026 |
| 15 | Quarterly decision audit cadence — review a sample of decisions for deference drift, verification drift, and model drift; industry pattern in regulated finance and clinical | Industry pattern + FVA-analogous discipline | 2024-2026 |
| 16 | Model drift — vendor model updates change behaviour silently; canonical prompts run quarterly catch the drift before it shows up in decisions | Vendor model-card patterns + industry observation | 2024-2026 |
| 17 | EU AI Act Annex III — high-risk categories include employment, education, essential services, law enforcement; managers should know the boundary for delegation policy | EU AI Act 2024/1689 | Aug 2026 phasing |
| 18 | The one-page AI decision charter — four sections (modes · never-delegate list · verification rule · override discipline) as the durable artifact | Industry pattern (managerial framing) | 2024-2026 |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. June 2023)** — attorneys submitted brief with confabulated case citations from ChatGPT; sanctioned. Cross-domain analog for the confabulated-source failure mode in managerial decisions.
2. **The high-confidence override pattern** — industry-observed: when models speak with high certainty on a topic the user knows is wrong, override rates still collapse; pattern, not a specific named publication.
3. **The cancelled-promotion attribution pattern** — LLM-generated decision commentary attributing outcomes to inputs that did not actually occur; industry pattern grounded in the Avianca analog.

## What we do NOT say

- **No "AI is always wrong" framing.** AI is a high-value decision input. The discipline is about preserving judgement, not rejecting the tool.
- **No "AI is always right" framing either.** The chorus is calibration, not deference.
- **No invented studies.** Where there's no verifiable public source, we say "industry pattern" or cite the cross-domain analog (Mata v. Avianca).
- **No vendor selection bias.** Modes and disciplines are tool-agnostic; OpenAI, Anthropic, Google, Mistral all behave similarly under deference pressure.
- **No "set and forget" charter.** Quarterly audit + canonical prompts are non-negotiable.
- **No replacement of professional judgement** in regulated decisions (hire/fire, legal disclosure, individual-rights).

## Chapter blueprint

### Chapter 1 — AI as decision input vs decision maker (~5 min)
**What:** Three decision modes (AI-as-input · AI-assisted · AI-as-decider). The one-way drift toward delegation as model quality rises. Three decisions never delegated (external fact claims · individual-rights · legal disclosure). Two signals of drift into AI-as-decider: skipping verification on high-stakes, and "the model said" replacing reasoning in the record.
**Sources:** [3], [10], [18].

### Chapter 2 — The cognitive offloading risk (~5 min)
**What:** Kahneman System 1/2 framing. Why *better* models suppress critique more than worse ones — confidence + correctness combine to lower override effort. Two countermeasures: pre-commitment (decide in advance what will not be delegated) and periodic AI-free decisions (keep the unaided muscle alive).
**Sources:** [1], [4], [5], [6].

### Chapter 3 — When to override AI confidently (~5 min)
**What:** Three override signals — context the model can't see, recency past training cutoff, regional / local specifics. The deference trap: high model confidence + thin user context collapses override rates. The override discipline: name the signal, log the override, review at audit.
**Sources:** [7], [8], [15].

### Chapter 4 — The 80/20 verification rule (~5 min)
**What:** Verify 20% deeply, skim 80%. Three filters: reversibility, stakes, context-thinness. Three categories at 100% verification: external fact claims, individual-rights decisions, legal disclosure. Grounded in the Avianca analog as the cost of skipping verification on legal disclosure.
**Sources:** [9], [10], [11].

### Chapter 5 — Team-level decision norms (~5 min)
**What:** The drift problem — individual discipline doesn't survive tool churn or turnover. Three norms that do survive: shared decision categorisation, pre-commitment on never-delegate categories, override-documentation template. Onboarding pattern that puts the charter in front of every new hire on day one.
**Sources:** [12], [18].

### Chapter 6 — Scenario planning with AI (~5 min)
**What:** Where AI helps — breadth (more scenarios than a human would generate), variation (parameter sweeps), adversarial framings (red-team the plan). The false-confidence trap: model-generated scenarios cluster around training-data priors; the unseen scenario is the one that breaks you. Four-step scenario discipline: generate broad → cluster → adversarial pass → name the unseen.
**Sources:** [13], [14].

### Chapter 7 — Decision drift and audit cadence (~5 min)
**What:** Three drift types — deference drift (override rate falling), verification drift (skipping the 20%), model drift (vendor updates change behaviour). Quarterly decision audit: sample 10 decisions, score on the three drifts. Canonical-prompt set run quarterly to catch model drift before it shows up in decisions.
**Sources:** [15], [16].

### Chapter 8 — Capstone · AI decision charter (~6 min)
**What:** Four-section one-page charter — decision modes · never-delegate list · verification rule · override discipline. Four trust trip-wires: no decision recorded as "the model said," no external fact claim unverified, no individual-rights decision delegated, no quarter without an audit. Interactive charter builder produces the printable artifact.
**Sources:** Composite of [3], [5], [9], [10], [15], [18].

## Tone

- **Emma, manager-to-manager register.** Calm, precise, no hype. The reader is already using AI; they don't need to be sold.
- **Honest about cognitive risk.** Kahneman + Tetlock as the spine. Deference, not hallucination, is the real story.
- **The charter is the chorus.** Every chapter builds toward the one-page artifact. Discipline, not vibes.

## Theme

Neutral-slate primaries (#475569 / #334155) with orange accent (#F97316) — disciplined, executive, tool-agnostic. No emojis. Sora headings, Inter body.
