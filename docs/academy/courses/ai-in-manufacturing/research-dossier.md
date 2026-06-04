# AI in Manufacturing — Research Dossier

**Course slug:** `ai-in-manufacturing`
**Track:** Industry · Manufacturing
**Audience:** Plant managers, VPs of manufacturing, plant engineers, quality + maintenance leaders, operations directors past basic AI literacy
**Length:** 8 chapters · ~36 min total
**Voice:** Emma (`en-GB-EmmaMultilingualNeural`)

## Thesis

Manufacturing AI is plant-floor reality, not vendor demo. Sensors fail, lighting changes on the line, operators make judgement calls the model didn't see, and the OT network drops a packet at the worst moment. The 2024–26 wave isn't autonomous lights-out plants — it's six well-bounded plays (predictive maintenance, quality vision, process optimisation, plant-floor supply integration, safety-as-support, pragmatic digital twin) that ship when plant engineering + IT + AI sit in the same room from day one. The risk isn't the algorithms. The risk is the OT/IT bridge: skip it, and the model is a slide deck. This course teaches plant leaders to ship manufacturing AI that the operators trust and the maintenance crew actually act on.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Industry 4.0 / smart manufacturing market: Deloitte + MAPI 2024 — majority of large discrete manufacturers have an active AI-in-plant pilot; minority have scaled across plants. Scale is the gap. | Deloitte / MAPI Smart Manufacturing study 2024 | 2024 |
| 2 | McKinsey "Lighthouse Network" (with WEF) — sub-100 plants globally identified as scaled-AI lighthouses out of tens of thousands; typical reported gains 30-50% OEE lift, 15-30% defect reduction, but on bounded use cases | WEF + McKinsey Global Lighthouse Network | 2018–2025 ongoing |
| 3 | Predictive maintenance — DOE / ARC Advisory consensus pattern: unplanned downtime costs $50B+/yr across US manufacturing; PdM can cut unplanned downtime 30-50% on covered assets when sensor coverage + CMMS integration are real | ARC Advisory + DOE pattern | 2020-2024 |
| 4 | Siemens MindSphere / Industrial Edge — OT-integrated AI platform with PdM, quality, energy modules | Siemens product documentation | 2024-2025 |
| 5 | GE Predix → GE Digital APM (Asset Performance Management) — predictive maintenance + reliability on rotating equipment | GE Digital product documentation | 2024-2025 |
| 6 | PTC ThingWorx + Kepware — IIoT platform with model-mediated OT/IT bridge; common in discrete manufacturing | PTC product documentation | 2024-2025 |
| 7 | AWS IoT SiteWise + Lookout for Equipment + Lookout for Vision — managed PdM and visual QA services | AWS product documentation | 2024-2025 |
| 8 | Azure IoT Hub + Azure Industrial IoT + Azure AI Vision — Microsoft's manufacturing stack; tight Fabric / Power BI integration for plant dashboards | Microsoft Learn — Azure IoT / Industrial IoT | 2024-2025 |
| 9 | Rockwell FactoryTalk + PTC partnership — PLC-native analytics on Allen-Bradley estates | Rockwell product documentation | 2024-2025 |
| 10 | Computer vision quality inspection — Cognex, Keyence, Landing AI, AWS Lookout for Vision. Industry pattern: 20-40% defect-escape reduction on well-bounded defect classes with stable lighting | Vendor case studies + ARC pattern | 2024-2025 |
| 11 | Vision QA failure mode — model drift when product mix or lighting changes; year-2 "false confidence" pattern where the model misses novel defects nobody re-labelled. Industry-observed; treat as pattern, not a single named study. | Industry pattern (ARC, vendor field reports) | ongoing |
| 12 | OPC UA (IEC 62541) — the OT/IT integration standard for plant data; ISA-95 for plant-floor-to-enterprise integration. Non-negotiable plumbing. | OPC Foundation + ISA-95 | standards |
| 13 | NIST Cybersecurity Framework + IEC 62443 — OT cybersecurity standards. AI on the plant floor inherits the OT security boundary; "the AI model is now a new attack surface" pattern. | NIST CSF 2.0 + IEC 62443 | 2024 |
| 14 | OEE (Overall Equipment Effectiveness) = Availability × Performance × Quality. The canonical plant-floor KPI. AI plays are scored against OEE delta, not model F1. | SEMI / ISA OEE standard | classic |
| 15 | Digital twin reality check — Gartner Hype Cycle for Manufacturing tracks digital twin past the peak; 18-month megaprojects routinely fail. 4-6 month bounded twins (one cell, one use case) ship. | Gartner Hype Cycle for Manufacturing Operations | 2023-2025 |
| 16 | Safety AI — PPE detection, near-miss detection, ergonomic risk scoring. OSHA + EU-OSHA pattern: works as *support* for safety teams; deployed as surveillance triggers union/works-council pushback and fails. | OSHA + EU-OSHA + industry pattern | ongoing |
| 17 | Operator labelling loop — vision QA models in real plants need a 3-stage operator labelling workflow (flag · adjudicate · retrain) to stay accurate past month 6. The discipline that separates pilots from scaled systems. | Industry pattern (Landing AI, Cognex field practice) | 2024-2025 |
| 18 | EU AI Act — workplace monitoring AI is high-risk under Annex III; safety AI that surveils operators is in scope. Penalty regime live August 2026. | EU AI Act 2024/1689 | Aug 2026 |
| 19 | Cross-domain hallucination analog for AI-generated maintenance work orders or root-cause narratives: Mata v. Avianca (S.D.N.Y. Jun 2023) — the confabulated-source failure mode. The pattern observers warn about for LLM-generated CMMS commentary. | Cross-domain analog | 2023 |
| 20 | Energy + sustainability AI — process optimisation models reducing kWh/unit by 5-15% on energy-intensive processes (kilns, furnaces, compressors). Pattern across cement, glass, chemicals. | DOE Better Plants + vendor case pattern | 2024-2025 |
| 21 | India PLI scheme + Make-in-India — AI-in-manufacturing referenced in PLI scheme expansion; growing vendor activity in Indian plants 2024-26. | MoCI / PLI scheme communications | 2024-2026 |
| 22 | OT/IT skills gap — Deloitte MAPI 2024: skilled-worker shortfall is the #1 cited barrier to scaling AI in plants. Bigger than algorithm choice or data quality. | Deloitte / MAPI 2024 | 2024 |

## Named incidents

1. **WEF Lighthouse Network (ongoing)** — fewer than 200 plants globally certified as scaled-AI lighthouses despite a decade of effort. Use to ground "scale is the gap, not the pilot."
2. **The vision-QA year-2 drift pattern** — model passes acceptance, drifts silently when product mix or lighting changes, misses novel defects nobody re-labelled. Industry-observed pattern; ground as pattern, not a single named publication.
3. **The 18-month digital-twin megaproject** — Gartner-tracked failure mode. Use to ground the "4-6 month bounded twin" discipline.
4. **The confabulated-source pattern in AI-generated work orders / RCA narratives** — LLM attributing a vibration spike to a maintenance event that didn't happen. Ground in cross-domain analog (Mata v. Avianca S.D.N.Y. Jun 2023).

## What we do NOT say

- **No "lights-out plant" framing.** Operators + AI = better than either alone. The labelling loop is the chorus.
- **No vendor selection bias.** Siemens MindSphere, GE APM, PTC ThingWorx, AWS IoT, Azure IoT, Rockwell FactoryTalk referenced even-handedly.
- **No "autonomous decisions on safety-critical equipment."** That is the named anti-play.
- **No 18-month digital-twin megaprojects.** 4-6 month bounded twin, one cell, one use case.
- **No safety AI as surveillance.** Support, not surveillance. The charter is signed by safety + ops + union before deployment.
- **No accuracy claims above the WEF / vendor case envelope** (30-50% OEE lift only on bounded lighthouse use cases, not plant-wide).
- **No skipping the OT/IT bridge.** Plant engineering + IT + AI in the room from day one — or the model is a slide deck.

## Chapter blueprint

### Chapter 1 — The manufacturing AI landscape (~5 min)
**What:** Deloitte / MAPI scale gap. WEF Lighthouse Network — sub-200 plants globally. Six plays + three anti-plays. The OT/IT bridge filter: plant engineering + IT + AI team in the room from day one. OEE as the scoring KPI, not model F1. The thesis: bounded plays ship, megaprojects don't.
**Sources:** [1], [2], [12], [14], [22].

### Chapter 2 — Predictive maintenance for plants (~5 min)
**What:** ARC / DOE downtime pattern. Siemens MindSphere, GE APM, AWS Lookout for Equipment, Azure Industrial IoT. The three sensor coverage decisions (which assets, which signals, sample rate). The narrative layer engineers act on (not a probability score — a "check bearing 3, here's why" work order). Three project killers: data quality, alert fatigue, CMMS disconnect.
**Sources:** [3], [4], [5], [7], [8], [19].

### Chapter 3 — Quality vision AI (~5 min)
**What:** Cognex / Keyence / Landing AI / AWS Lookout for Vision. 20-40% defect-escape reduction on well-bounded defect classes. The three messy challenges (lighting, drift, novel defects). The 3-stage operator labelling loop (flag · adjudicate · retrain). The year-2 false-confidence failure mode + three disciplines (re-label cadence, novel-defect channel, lighting-change trigger).
**Sources:** [10], [11], [17].

### Chapter 4 — Process optimisation with AI (~5 min)
**What:** Three signals AI surfaces (multi-parameter interaction, drift, best-shift recipe). Operator-led experiment design — AI proposes, operators decide. Energy optimisation pattern: 5-15% kWh/unit on kilns, furnaces, compressors (DOE Better Plants). Three overfitting guards: holdout shift, recipe lock, plant-engineer sign-off.
**Sources:** [14], [20].

### Chapter 5 — Plant-floor supply chain integration (~5 min)
**What:** Three signal flows (demand into plant, material into line, equipment availability out). Three re-planning cadences: strategic monthly, tactical weekly, operational real-time. PTC ThingWorx + Kepware as the OT/IT bridge pattern. Azure IoT + Fabric for plant-to-enterprise dashboards. Three failure modes: ERP-MES disconnect, real-time chasing noise, planner override without record.
**Sources:** [6], [8], [12].

### Chapter 6 — Safety AI (~5 min)
**What:** Three use cases: PPE detection, near-miss event capture, ergonomic risk scoring. The line nobody crosses: support, not surveillance. EU AI Act Annex III workplace monitoring boundary. The charter signed by safety + ops + union before deployment. Three failure modes specific to safety AI: surveillance creep, false positives degrading trust, near-miss data weaponised in disciplinary action.
**Sources:** [13], [16], [18].

### Chapter 7 — Digital twin: pragmatic, not megaproject (~5 min)
**What:** Gartner Hype Cycle reality — 18-month megaproject trap. Three targeted twins that ship in 4-6 months (one cell process twin, one asset reliability twin, one energy twin). Three discipline rules: 6-month time-to-value, one bounded use case, plant engineers in the design room. Siemens / GE / Azure Digital Twins as platforms — but scope is the deciding factor, not platform.
**Sources:** [4], [5], [8], [15].

### Chapter 8 — Making it stick · 12-month plant roadmap (~6 min)
**What:** Q1 = OT/IT bridge stood up + one PdM pilot on top-10 critical assets. Q2 = vision QA on one line + operator labelling loop live. Q3 = process optimisation on one energy-intensive process + safety AI charter signed. Q4 = bounded digital twin on one cell + plant-wide OEE dashboard. Four trust trip-wires: no autonomous decisions on safety-critical equipment, no model without operator labelling loop, no AI-generated work order without source check (Mata v. Avianca analog), no surveillance-mode safety AI. Interactive Markdown builder for plant manager + VP Manufacturing.
**Sources:** Composite of [2], [11], [13], [16], [17], [19], [22].

## Tone

- **Emma, plant-floor register.** British, precise, respect for the operator. Speaks to plant managers who have walked the line at 2am.
- **Honest about plant-floor reality.** Sensors fail, lighting changes, operators make judgement calls. The model doesn't replace that — it earns its place.
- **OT/IT bridge as the chorus.** Plant engineering + IT + AI in the room from day one, or it doesn't ship.
- **Numbers + accountability.** OEE delta, not model F1. Work orders engineers act on, not probability scores.

## Theme

Neutral-slate (#475569 / #334155) + orange accent (#F97316 / #FB923C). No emojis. Sora headings, Inter body. Same chrome as the rest of the Industry track.
