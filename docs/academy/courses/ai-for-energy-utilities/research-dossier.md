# AI for Energy & Utilities — Research Dossier

**Course slug:** `ai-for-energy-utilities`
**Track:** Industry · Energy & Utilities
**Audience:** Utility executives, grid operators, generation planners, heads of digital transformation in energy companies
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

In retail, AI getting it wrong loses a sale. In utilities, AI getting it wrong can blackout a city or kill a worker. That asymmetry — grid stability and human safety are non-negotiable — is what makes energy-sector AI different from every other enterprise AI playbook. The 2024–26 wave isn't a question of whether ML on tabular grid data works (demand forecasting has been delivering measurable lift for a decade). The questions are: where does AI augment operational reliability without threatening it, where does operator-in-the-loop stay non-negotiable, and how does the OT-IT-AI cyber surface get defended now that critical infrastructure is in scope under EU AI Act Annex III and NERC CIP. This course teaches utility leaders to ship AI that improves accuracy and dispatch economics *without* moving any of the bright lines around reliability, safety, or autonomous customer disconnection.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | IEA "Energy and AI" report — global data-centre electricity demand projected to more than double by 2030, with AI as the primary driver; grid AI is one of IEA's three "AI for energy" pillars | IEA Energy and AI report | 2025 |
| 2 | IEA + IRENA tracking — global VRE (wind + solar) share rising sharply; renewables-heavy grids need AI more than thermal-heavy grids because variability is the planning constraint | IEA World Energy Outlook + IRENA renewable capacity statistics | 2024-2025 |
| 3 | NERC Reliability Standards — CIP-002 through CIP-014 govern critical infrastructure cyber + physical security for the Bulk Electric System in North America; any AI touching BES assets is in scope | NERC CIP standards (current versions) | ongoing |
| 4 | FERC Order 2222 — opens wholesale markets to distributed energy resource aggregations; raises the AI-dispatch and forecasting bar at the aggregator layer | FERC Order 2222 | 2020, ongoing implementation |
| 5 | State PUCs (CPUC, NYPSC, ERCOT/PUCT, Ofgem in UK) — set retail-side rules including disconnection protections and vulnerable-customer safeguards that AI customer-ops systems must respect | State / national regulator publications | ongoing |
| 6 | EU AI Act 2024/1689 — Annex III lists "management and operation of critical infrastructure" (including supply of electricity) as high-risk; obligations phase in through Aug 2026 / Aug 2027 | EU AI Act Regulation (EU) 2024/1689 | 2024-2027 |
| 7 | EU Network Code on Cybersecurity for the electricity sector — Commission Regulation 2024/1366 — risk-assessment + reporting regime for cross-border electricity flows | Network Code Cybersecurity 2024/1366 | 2024 |
| 8 | Ukrainian grid cyberattacks (Dec 2015 BlackEnergy; 2016 Industroyer/CrashOverride) — canonical real-world OT incidents shaping every modern utility threat model | CISA / SANS ICS reports; ESET Industroyer analysis | 2015-2016 |
| 9 | Colonial Pipeline ransomware (May 2021) — IT-side ransomware forced OT shutdown; the canonical "IT and OT are one problem" lesson | CISA + congressional testimony | May 2021 |
| 10 | NIST AI Risk Management Framework (AI RMF 1.0) + MITRE ATLAS — the reference frames for AI threat modelling (poisoning, evasion, exfiltration, supply chain) | NIST AI 100-1 + MITRE ATLAS | 2023-2024 |
| 11 | SCADA / EMS / DMS / ADMS — the operational technology stack AI must integrate with; vendors include GE Vernova, Hitachi Energy, Siemens Energy, Schneider Electric, ABB, OSI | Vendor product evidence | 2024-2025 |
| 12 | Demand forecasting accuracy lift — modern ML approaches (gradient-boosted trees, neural, hybrids) consistently deliver mid-single-digit to low-double-digit MAPE improvements vs classical baselines in load forecasting; tail-event accuracy (heatwaves, cold snaps) is where the real value sits | Industry pattern across utility ML literature | 2023-2025 |
| 13 | Predictive maintenance for T+D assets — transformer health (DGA + load + thermal), switchgear, lines / vegetation — defers tens of millions of capital across a mid-size utility's asset base; safety constraint: AI extends inspection intervals, never eliminates physical inspection | Industry pattern; EPRI research programmes | ongoing |
| 14 | Renewables forecasting — wind / solar nowcasting and day-ahead forecasts using NWP + satellite + on-site sensors; ML reduces forecast error materially vs persistence, with the largest lift on ramp events | IEA + NREL research; vendor case evidence | 2024-2025 |
| 15 | Battery dispatch / virtual power plants — optimisation under price + frequency + state-of-charge constraints is a textbook AI use case; Tesla, Fluence, Wärtsilä, AutoGrid (Schneider) operate at scale | Vendor + ISO reports | 2024-2025 |
| 16 | Grid congestion management + outage response — FLISR (Fault Location, Isolation, Service Restoration) on the distribution side; AI assists operators, does not replace them | EPRI + utility case evidence | ongoing |
| 17 | The disconnection bright line — AI never makes autonomous disconnect decisions for residential customers; vulnerable-customer registers, cold-weather rules, and medical-equipment flags are regulator-enforced in most jurisdictions | State PUC + Ofgem rules | ongoing |
| 18 | EU AI Act Article 50 transparency — AI interacting with customers (chatbots, automated bill explanations) must disclose its non-human nature | EU AI Act Art 50 | Aug 2026 |
| 19 | Operator-in-the-loop as the design pattern — the cross-industry analog is aviation autopilot + air traffic control: automation handles routine, humans hold final authority on safety-critical decisions | Industry pattern; human-factors literature | ongoing |
| 20 | LLM hallucination in operator-facing narratives — the confabulated-source failure mode (AI commentary attributing a grid event to a maintenance window that was actually cancelled). Cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023) | Industry pattern + Mata v. Avianca analog | 2023-2026 |
| 21 | Supply-chain attack vector for grid AI — third-party model weights, pretrained foundation models, MLOps tooling all expand the attack surface; SBOM + model-bill-of-materials practices emerging | NIST + MITRE ATLAS guidance | 2024-2025 |
| 22 | Curtailment fairness — when renewable output exceeds dispatch need, the question of *which* generator gets curtailed has equity + contractual dimensions AI optimisers should expose, not hide | Industry pattern; IRENA grid integration work | 2024-2025 |
| 23 | Texas / ERCOT Feb 2021 winter event — canonical reminder that tail-event forecasting and dispatch reliability matter more than average-case accuracy | FERC-NERC joint inquiry report | Nov 2021 |
| 24 | Vendor landscape on the AI-platform side — Microsoft Azure (Energy Data Services), AWS (Energy & Utilities), Google Cloud Energy, plus utility-native players (C3 AI, Uplight, AutoGrid) | Vendor product pages | 2024-2025 |

## Named incidents

1. **Ukraine grid attacks (Dec 2015 BlackEnergy; 2016 Industroyer)** — ground the OT threat model and the "AI doesn't change the adversary, it expands the surface" point.
2. **Colonial Pipeline (May 2021)** — IT ransomware → OT shutdown. Ground the "OT + IT + AI is one problem" thesis in Chapter 7.
3. **ERCOT Feb 2021 winter storm** — ground the "tail-event accuracy matters more than average MAPE" argument in Chapter 2.
4. **Confabulated-source pattern in operator commentary** — ground in cross-domain analog (Mata v. Avianca, S.D.N.Y. Jun 2023) rather than inventing a specific utility incident.

## What we do NOT say

- **No "AI replaces operators" framing.** Operator-in-the-loop is the design pattern, full stop. Aviation autopilot is the right analog.
- **No autonomous disconnection.** AI never makes the disconnect decision for a residential customer. That line does not move.
- **No vendor selection bias.** GE Vernova, Hitachi Energy, Siemens, Schneider, ABB, OSI on the OT side; Microsoft, AWS, Google, C3 AI on the platform side — referenced even-handedly.
- **No claim ML always beats classical** in load forecasting. ML wins consistently at granular + tail-event horizons; classical is competitive on stable aggregated loads.
- **No specific dollar-savings claims** at the utility level without grounding — frame as "industry pattern: tens of millions in deferred capital across a mid-size utility's T+D base."
- **No invented incidents.** When a pattern needs an example, use Ukraine 2015/16, Colonial 2021, ERCOT 2021, or Mata v. Avianca as a cross-domain analog.
- **No downplaying the OT cyber problem.** Critical infrastructure is in EU AI Act Annex III for a reason.

## Chapter blueprint

### Chapter 1 — The energy + utilities landscape (~5 min)
**What:** Why utility AI is different — reliability and safety are non-negotiable. The 5 high-value plays (demand forecasting, grid management, generation optimisation, predictive maintenance, customer ops). The regulator frame: NERC CIP + FERC Order 2222 + state PUCs + EU AI Act Annex III + Network Code Cybersecurity. The IEA "Energy and AI" framing of grid AI as one of three pillars.
**Sources:** [1], [3], [4], [5], [6], [7].

### Chapter 2 — Demand forecasting (~5 min)
**What:** The most mature play. Mid-single to low-double-digit MAPE lift from modern ML over classical baselines — industry pattern, not a vendor promise. 3 architectures: gradient-boosted trees, neural (LSTM/Transformer), hybrid. 3 failure modes: tail events (ERCOT Feb 2021), regime change post-DER, weather model drift. The honest reporting standard: tail-event accuracy matters more than average MAPE.
**Sources:** [12], [23].

### Chapter 3 — Grid management (~5 min)
**What:** 3 use cases — asset-health monitoring, congestion management, outage response (FLISR). Operator-in-the-loop is non-negotiable; the aviation autopilot analog. 3 failure modes: silent model drift on a slow-evolving grid, false-positive fatigue at the operator console, automation bias on rare events.
**Sources:** [11], [16], [19].

### Chapter 4 — Generation optimisation (~5 min)
**What:** Why renewables need AI more than thermal — variability is the planning constraint. 3 use cases: wind nowcasting + ramp prediction, solar irradiance forecasting, battery / VPP dispatch optimisation. The curtailment fairness question: when output exceeds dispatch need, *which* generator gets curtailed has equity and contractual dimensions AI must surface, not hide.
**Sources:** [2], [14], [15], [22].

### Chapter 5 — Predictive maintenance for T+D assets (~5 min)
**What:** Tens of millions in deferred capital across a mid-size utility's T+D base — industry pattern. 3 use cases: transformer health (DGA + load + thermal), switchgear condition, lines + vegetation management. Safety constraint: AI extends inspection intervals, *never* eliminates physical inspection. Sign-off stays with the licensed engineer.
**Sources:** [13].

### Chapter 6 — Customer operations (~5 min)
**What:** 3 use cases — outage communications, bill explanations + arrears triage, energy advice. The disconnection bright line: AI never makes autonomous disconnect decisions for residential customers. Vulnerable-customer protections (medical-equipment registers, cold-weather rules) stay binding. EU AI Act Article 50 disclosure: customers know when they're talking to AI.
**Sources:** [5], [17], [18], [20].

### Chapter 7 — Cybersecurity for AI in critical infrastructure (~5 min)
**What:** OT + IT + AI is one problem. Ukraine 2015/16 and Colonial 2021 are the grounding incidents. 4 attack vectors using NIST AI RMF + MITRE ATLAS framing: data poisoning, model evasion, exfiltration, supply chain. 3 defensive patterns: segmented MLOps with OT-grade change control, model-bill-of-materials + SBOM, red-team + tabletop on AI-specific scenarios. EU Network Code Cybersecurity 2024/1366 risk-assessment regime.
**Sources:** [3], [7], [8], [9], [10], [21].

### Chapter 8 — Making it stick · your energy AI roadmap (~6 min)
**What:** 18-month rollout — Months 1-6 foundations (1 load-forecasting + 1 PdM pilot, MLOps + OT-grade change control, governance under NERC CIP / EU AI Act mapping). Months 7-12 scale (operator-in-the-loop UX, renewables forecasting if applicable, customer-ops with Article 50 disclosure). Months 13-18 operating discipline (FVA-equivalent for grid forecasts, model-bill-of-materials, quarterly red-team). 4 trust trip-wires: no autonomous disconnection, no AI bypass of operator authority on safety-critical, no model without explainability for the regulator, no AI-generated operator narrative without source check. Interactive Markdown roadmap builder for the CIO / COO / board.
**Sources:** Composite of [3], [6], [10], [17], [20].

## Tone

- **Andrew, utility-executive register.** Precise. Reliability-first. Numbers + accountability. Operators and engineers are practical people who have been burned by hype before.
- **Honest about ML limits.** ML wins on granular + tail-event load forecasting; classical is still competitive on stable aggregates. PdM extends inspections, never replaces them.
- **Operator-in-the-loop as the chorus.** The aviation autopilot analog is the right frame: automation handles routine, humans hold final authority on safety-critical decisions.
- **Critical-infrastructure cyber as the second chorus.** OT + IT + AI is one problem.

## Theme

Neutral-slate primary (`#475569` / `#334155`) with orange accent (`#F97316` / `#FB923C`), navy `#0F172A`, slate cyan `#64748B`, light tint `#F8FAFC`. No emojis. Sora headings, Inter body. Consistent with the other Industry-track courses in the Gennoor Academy catalogue.
