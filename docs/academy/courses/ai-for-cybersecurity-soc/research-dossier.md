# AI for Cybersecurity SOC — Research Dossier

**Course slug:** `ai-for-cybersecurity-soc`
**Track:** Function · Cybersecurity / SOC
**Audience:** CISOs, SOC directors, security operations leaders, heads of detection engineering, senior analysts past basic AI literacy
**Length:** 8 chapters · ~36 min total
**Voice:** Andrew (`en-US-AndrewMultilingualNeural`)

## Thesis

AI in the SOC is an analyst force multiplier, not an analyst replacement. The 2024–26 wave of SIEM-native copilots (Microsoft Security Copilot in Sentinel, Splunk AI Assistant, Palo Alto Cortex XSIAM, CrowdStrike Charlotte AI) does the same thing every prior automation wave did: it compresses repetitive triage so humans go deeper on actual investigation. The best SOCs in 2026 use AI to kill alert fatigue and accelerate hunt; the worst chase an analyst-free dream and get breached when a novel TTP shows up that the model has never seen. The discipline that holds it together is the same one Mandiant, MITRE, and NIST have argued for a decade: defence in depth, human-in-the-loop on consequential action, verification on every AI-generated attribution. This course teaches SOC leaders to ship cybersecurity AI that lowers MTTR *and* survives the day the AI itself is the target.

## Numbers table (anchor citations)

| # | Claim | Source | Date |
|---|---|---|---|
| 1 | Mandiant M-Trends 2025: global median dwell time has compressed from 416 days (2011) to ~10 days (2024); detection is faster, but novel-TTP discovery still humans-first | Mandiant M-Trends 2025 | 2025 |
| 2 | CrowdStrike Global Threat Report 2025: eCrime breakout time median ~48 minutes; fastest observed under 1 minute — pressures SOC response windows the SIEM rule layer alone can't meet | CrowdStrike Global Threat Report 2025 | 2025 |
| 3 | (ISC)² Cybersecurity Workforce Study 2024: ~4M global cyber workforce gap; SOC analyst burnout and alert fatigue cited as top operational risks | (ISC)² Workforce Study 2024 | 2024 |
| 4 | IBM Cost of a Data Breach 2024: organisations with extensive security AI + automation saved an average of $2.2M and shortened breach lifecycle by ~100 days vs no-AI peers | IBM / Ponemon Cost of a Data Breach 2024 | 2024 |
| 5 | MITRE ATT&CK v15+ — the de-facto adversary-behaviour taxonomy SOCs map detections to; AI-assisted detection engineering uses ATT&CK technique IDs as ground truth | MITRE ATT&CK | ongoing 2024-2026 |
| 6 | NIST Cybersecurity Framework 2.0 (Feb 2024) — adds the Govern function; AI in the SOC must map to Identify / Protect / Detect / Respond / Recover with governance overlay | NIST CSF 2.0 | Feb 2024 |
| 7 | Microsoft Sentinel + Security Copilot, Splunk AI Assistant (Cisco), Palo Alto Cortex XSIAM, CrowdStrike Charlotte AI, Google SecOps (Chronicle) Gemini — major SIEM/XDR + copilot stacks in 2025-26 | Vendor product pages 2025-2026 | 2025-2026 |
| 8 | Microsoft Security Copilot research preview (2024): early-access customers reported ~26% faster mean time to resolve and ~22% accuracy uplift for novice analysts on triage tasks | Microsoft Security Copilot economic study 2024 | 2024 |
| 9 | UEBA baseline window: industry pattern is a ~60-day rolling baseline before user/entity behaviour signals become reliable; aggressive shorter windows trigger drift and false positives | Vendor docs (Exabeam, Microsoft, Splunk UBA) + pattern | 2024-2025 |
| 10 | SOAR adoption: Gartner notes most large SOCs run SOAR or SOAR-equivalent playbooks; full autonomous-response remains rare — auto-isolate endpoint, auto-disable account are the few widely trusted patterns | Gartner SOAR / SIEM Magic Quadrant pattern | 2024-2025 |
| 11 | OWASP Top 10 for LLM Applications (2024/2025): prompt injection (LLM01), insecure output handling, training-data poisoning, model denial-of-service, model theft — the canonical AI-in-SOC attack surface checklist | OWASP LLM Top 10 | 2024-2025 |
| 12 | MITRE ATLAS — adversarial-ML taxonomy analogous to ATT&CK; required reading for SOCs defending AI models | MITRE ATLAS | ongoing 2024-2025 |
| 13 | NIST AI Risk Management Framework 1.0 (Jan 2023) + Generative AI Profile (Jul 2024): governance language SOC leaders should align AI tooling to | NIST AI RMF + GenAI Profile | 2023-2024 |
| 14 | ISO/IEC 27001:2022 — security management standard; AI in the SOC must fit existing 27001 controls (A.5 policies, A.8 asset, A.12 ops, A.16 incident) | ISO/IEC 27001:2022 | 2022 |
| 15 | EU AI Act (Reg 2024/1689): cybersecurity AI is not auto-high-risk, but AI used for workforce monitoring or in critical-infrastructure operators can be Annex III — boundary worth knowing | EU AI Act 2024/1689 | Aug 2026 effective for high-risk |
| 16 | The confabulated-source pattern in AI threat intel — LLM-generated attribution citing a CVE that doesn't exist or a threat-actor publication that was never published. Cross-domain analog: Mata v. Avianca (S.D.N.Y. Jun 2023). Industry-observed pattern; verify every AI-generated indicator | Industry pattern + Mata v. Avianca analog | 2023-2026 |
| 17 | Verizon DBIR 2024: ~68% of breaches involve a non-malicious human element; AI helps with phishing/social-engineering detection but does not replace user-education programmes | Verizon DBIR 2024 | 2024 |
| 18 | False-positive cost pattern: large SOCs commonly report >50% of SIEM alerts unactioned; analyst fatigue is the dominant operational risk AI triage targets | Industry pattern (multiple SOC ops studies 2023-2024) | 2024 |
| 19 | Concept-drift discipline: detection models trained on last quarter's TTPs degrade fast; weekly precision/recall review against MITRE ATT&CK coverage is the emerging standard | Industry pattern + vendor docs | 2024-2025 |
| 20 | DORA (EU Digital Operational Resilience Act) entered force Jan 17 2025 — financial-sector SOCs must demonstrate ICT third-party risk and incident reporting; AI tooling in scope | DORA Regulation (EU) 2022/2554 | Jan 2025 |
| 21 | India CERT-In Directions (Apr 2022, in force Jun 2022): 6-hour incident reporting window; AI auto-triage must not bypass mandatory reporting workflow | CERT-In Directions 2022 | 2022 ongoing |
| 22 | Adversarial use of AI: NCSC UK, Mandiant, CrowdStrike 2024-2025 reports consistently describe attacker use of LLMs for phishing-content generation and recon — not yet novel-malware authorship at scale | NCSC + Mandiant + CrowdStrike 2024-2025 | 2024-2025 |

## Named incidents

1. **Mata v. Avianca (S.D.N.Y. Jun 2023)** — the cross-domain anchor for AI-generated citations that don't exist. Apply directly to AI-generated threat-intel attributions, CVE references, and IOC sourcing: every AI output that names a source must be verified before it reaches a customer, exec, or court.
2. **The confabulated-attribution pattern in AI threat intel** — LLM summarising a threat report attributes activity to a group that never claimed it, or fabricates a CVE ID. Industry-observed pattern; ground in cross-domain analog rather than naming a specific publication.
3. **The over-suppression failure mode in AI triage** — model trained on historical analyst dispositions inherits historical bias (e.g., a class of true positives that prior analysts mis-closed). Pattern named by detection-engineering practitioners; mitigate with periodic adversarial sampling and shadow review.

## What we do NOT say

- **No "AI replaces analysts" framing.** Force multiplier, not replacement. Human-in-the-loop is the chorus on consequential action.
- **No vendor selection bias.** Microsoft Sentinel, Splunk, Palo Alto Cortex, CrowdStrike, Google SecOps referenced even-handedly.
- **No claim AI catches novel threats reliably.** AI accelerates known-pattern detection; novel TTP discovery is humans-first per Mandiant + CrowdStrike.
- **No invented breach details.** Where a specific named incident isn't publicly documented, use "industry pattern" and the Mata analog.
- **No autonomous response on consequential action.** Auto-isolate a single endpoint, auto-disable a clearly compromised account — yes. Mass-block, mass-disable, cross-tenant action — humans.
- **No "set and forget."** Weekly precision/recall review + concept-drift monitoring is non-negotiable.

## Chapter blueprint

### Chapter 1 — The cybersecurity AI landscape (~5 min)
**What:** Mandiant dwell-time compression. CrowdStrike 48-minute breakout. (ISC)² 4M workforce gap. IBM $2.2M / 100-day breach-lifecycle saving with security AI. The five plays (triage, detection augmentation, investigation assist, intel synthesis, SOAR). Three anti-plays (full autonomy on consequential action, AI-only novel-threat hunting, unverified AI attribution). NIST CSF 2.0 + MITRE ATT&CK + ISO 27001 frame.
**Sources:** [1], [2], [3], [4], [5], [6], [14].

### Chapter 2 — Alert triage + noise reduction (~5 min)
**What:** The volume problem — >50% of SIEM alerts unactioned in large SOCs. Three triage patterns: severity scoring, deduplication/correlation, enrichment-on-arrival. Microsoft Security Copilot ~26% MTTR improvement on triage. Three failure modes: historical analyst bias inherited, over-suppression of true positives, concept drift against new TTPs. The mitigation: weekly precision/recall against ATT&CK coverage + shadow-review sampling.
**Sources:** [8], [18], [19], industry pattern on bias.

### Chapter 3 — Threat detection augmentation (~5 min)
**What:** The layered model — signatures + correlation rules + ML/UEBA + LLM-augmented analysis. UEBA in practice: ~60-day baseline, entity-level scoring, drift monitoring. LLM-augmented analysis for log summarisation and hypothesis generation. The discipline: every AI-flagged finding is mapped to a MITRE ATT&CK technique ID; if it can't be mapped, it gets human review before action.
**Sources:** [5], [9], [19].

### Chapter 4 — Incident investigation assistance (~5 min)
**What:** Three use cases — timeline reconstruction, log summarisation across heterogeneous sources, hypothesis generation ("what would explain these signals"). Human-in-the-loop is absolute on attribution and on any action that touches production or user accounts. Three failure modes: hallucinated indicators, anchoring on the first AI hypothesis, source-attribution drift. The Mata cross-domain applies: verify every named source the AI produces.
**Sources:** [7], [16], NIST CSF Respond function [6].

### Chapter 5 — Threat intelligence synthesis (~5 min)
**What:** The volume problem in TI — dozens of feeds, vendor blogs, vendor reports daily. Three intel-AI use cases: feed deduplication, summary generation, IOC extraction with confidence scoring. The verification requirement (Mata cross-domain anchor): every AI-generated CVE reference, threat-actor attribution, or IOC must trace to a verifiable source before it reaches a detection rule or an exec briefing. Adversary use of AI (NCSC + Mandiant) — phishing content, recon — context, not panic.
**Sources:** [16], [22], named incident #1, #2.

### Chapter 6 — Security automation + SOAR (~5 min)
**What:** The automation spectrum — fully manual → AI-assisted → AI-recommended-human-approves → fully autonomous. Three safe autonomous scenarios (single-endpoint isolation on high-confidence indicator, password reset on confirmed credential compromise, low-risk evidence collection). Three scenarios requiring human-in-loop (mass-block actions, cross-tenant response, anything affecting executive or legal-hold accounts). Where DORA, CERT-In, and ISO 27001 incident-response controls draw the line.
**Sources:** [10], [14], [20], [21].

### Chapter 7 — AI's own attack surface (~5 min)
**What:** When the AI in your SOC becomes the target. Four attack vectors mapped to OWASP LLM Top 10 + MITRE ATLAS: prompt injection in ingested log/alert content, training-data poisoning of UEBA baselines, model evasion against the detection model, model exfiltration of fine-tuned weights. Four defensive patterns: input sanitisation on LLM-facing pipelines, baseline integrity monitoring, adversarial-sample testing, model-asset inventory + access control. NIST AI RMF + GenAI Profile as the governance overlay.
**Sources:** [11], [12], [13].

### Chapter 8 — Making it stick · 12-month SOC AI roadmap (~6 min)
**What:** Phased rollout. Q1 = triage augmentation on top noisy alert classes + precision/recall baseline. Q2 = investigation assist (timeline + log summarisation) with human-in-loop on attribution. Q3 = detection augmentation (UEBA on top entities) + intel synthesis with source-verification discipline. Q4 = bounded SOAR autonomy on the three safe scenarios. Four trust trip-wires: (1) no autonomous action on consequential targets, (2) no AI-generated attribution without source verification, (3) weekly precision/recall against ATT&CK coverage, (4) AI-asset inventory + adversarial testing on the AI itself. Interactive Markdown builder for the CISO brief.
**Sources:** Composite of [4], [6], [10], [11], [13], [16].

## Tone

- **Andrew, CISO / SOC-director register.** Precise. Operational. Numbers + accountability. Cyber leaders are sceptical by trade — earn it.
- **Honest about AI limits.** AI compresses repetitive work and accelerates known-pattern detection; novel-TTP discovery and consequential action remain humans-first.
- **Defence in depth is the chorus.** AI is another layer, not the only layer. Human-in-the-loop on attribution and consequential response is non-negotiable.

## Theme

Neutral-slate primary (`#475569` / `#334155`) with orange accent (`#F97316` / `#FB923C`), navy `#0F172A`, slate cyan `#64748B`, tint `#F8FAFC`. No emojis. Sora headings, Inter body. Same family as the other Function-track courses.
