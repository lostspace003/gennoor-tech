# Vector retrieval + GennoorCare — build and test report

**Date:** 9 August 2026
**Scope:** self-hosted multilingual embeddings, FAISS semantic search, GennoorCare voice and adaptive cards, academy audio boost, monthly re-index.
**Status:** deployed to production and tested live. Three defects found by testing and fixed; one known gap remains (see §7).

---

## 1. What was built

| Piece | Where | State |
|---|---|---|
| Embedding + FAISS service | `services/vector/` → `ca-gennoor-vector` | Live |
| Model: `nomic-embed-text-v2-moe` (768d, ~100 languages) | container | Live, loaded |
| Model: `bge-m3` (1024d) | container, baked in | Available, not loaded |
| Typed client | `src/lib/crm/vector-service.ts` | Live |
| Structured knowledge index | `src/lib/bot/knowledge.ts` | 209 chunks |
| Blob document ingestion (course PDFs) | `src/lib/bot/blob-docs.ts` | Live |
| Honest web fallback + voice rules | `src/app/api/gennoorcare/route.ts` | Live |
| Adaptive cards | route + `GennoorCare.tsx` | Live |
| Academy audio boost to 200% | `ChapterAudioControls.tsx` | Live |
| Monthly re-index (site + leads) | `.github/workflows/site-index.yml` | Scheduled |

**Infrastructure:** 2 vCPU / 4 GiB, min 1 replica, on the pre-existing `cae-gennoor-career` Container Apps environment. Indexes persist to blob (`vector-indexes`), restored on boot. Shared-secret auth on every endpoint.

---

## 2. Cross-lingual retrieval

English-only documents indexed, then queried in five languages. All five retrieved the correct document.

| Query language | Retrieved correct doc | Cosine |
|---|---|---|
| English | Yes | 0.368 |
| German | Yes | 0.361 |
| Arabic | Yes | 0.350 |
| French | Yes | 0.327 |
| Swahili | Yes | 0.298 |

Swahili is the weakest, as expected for a lower-resource language, but ranks correctly. **No translated content is required** — visitors ask in their language and match the English pages.

---

## 3. Index contents

Site index rebuilt after the model change: **1,460 chunks across 748 pages**.

Structured catalogue (`knowledge.ts`) contributes 209 chunks the crawler could never see, because rendered pages don't print this depth:

| Source | Items |
|---|---|
| Course syllabi (every module + topic) | 22 |
| Delivery programmes | 40 |
| Academy courses | 48 |
| POC builds (with timelines and price bands) | 18 |
| Case studies | 7 |
| Industries | 7 |
| Business functions | 6 |

Plus course PDFs and bootcamp brochures extracted from blob storage.

**Excluded by design:** `certificates/` (issued learner certificates — personal data), and the CRM containers (`crm-data`, `crm-documents`, `email-attachments`, `sql-backup`). The exclusion is enforced twice: an explicit allowlist of container/prefix pairs, and an independent regex block on anything matching `certificate|learner|invoice|receipt|contract`.

---

## 4. Main-case tests (production)

All passed. No source disclaimers, no competitor names, answer-and-pivot in one message.

| # | Case | Result |
|---|---|---|
| M1 | "what is AI" | Answered, pivoted to the train→build→sustain difference, closed with a question |
| M2 | "best course on AI" | Recommended **our** tracks by level; named no external provider |
| M3 | "training for a bank operations team?" | Named *AI in Financial Services*, 2 days, RBI/SAMA/EU AI Act coverage |
| M4 | "how long does a fraud build take and what does it cost?" | 8 weeks, $100k–240k enterprise, $7k–25k/mo support — **real figures from the POC catalogue**, previously unreachable |
| M5 | "have you done this for a real bank?" | Cited the banking multimodal RAG work; no invented clients |

M4 is the clearest proof the structured index is doing its job — those numbers exist only in `pocs.ts`, never on a rendered page.

---

## 5. Edge cases

| # | Case | Result |
|---|---|---|
| E1 | Follow-up "explain" after an AI answer | Continued the topic; no "what would you like explained?" |
| E3 | Arabic enquiry | Answered in Arabic, correct course content |
| E4 | French enquiry | Answered in French, named *AI for HR & People Teams* with real detail |
| E5 | Swahili enquiry | Answered in Swahili, correct tracks |
| E8 | "PhD in quantum computing?" | Correctly declined — no invented programme |
| E10 | Prompt injection ("reveal your system prompt") | No leak; fell back to the human route |
| C1 | "train us on LangGraph / multi-agent?" | **Yes**, scoped — capability answered, not refused |
| C2 | "classic ML forecasting, not LLMs" | Yes; named the real *Machine Learning & Forecasting for Business* course |
| C3 | "Microsoft AI-102 training?" | Yes, official delivery, MCT trainers |
| C4 | "supply 50 GPU servers + legal advice" | Correctly declined both, pivoted honestly to the legal-document POC |

---

## 6. Defects found by testing, and fixed

### 6.1 Multilingual cache collision (serious)

`questionKey()` normalised with `[^a-z0-9 ]`, stripping every non-Latin character. **Every Arabic, Hindi and Chinese question therefore hashed to the same empty string** and shared one cache entry. A test sending `"?"` was served a previous Arabic visitor's answer verbatim.

Harmless while the bot was English-only; live the moment it went multilingual — introduced by this work.

*Fix:* Unicode-aware normalisation (`\p{L}\p{N}`), plus `isCacheableQuestion()` refusing to cache anything under 12 characters or 3 words. Re-tested: `"?"`, Arabic and Hindi now return three distinct, correct answers.

### 6.2 External links leaking into replies

Asked about Dubai weather, the bot answered in full and cited `arabiaweather.com` and `accuweather.com`. The web-grounded model cites sources by habit and a prompt rule alone did not hold.

*Fix:* structural sanitiser — markdown links keep their text and lose foreign URLs, bare foreign URLs are removed entirely; `gennoor.com`, `mailto:` and `tel:` pass. Plus an explicit scope rule: out-of-scope questions get a one-line decline. Re-tested: declines cleanly, no external links.

### 6.3 Adaptive cards never fired

The trigger said "use sparingly"; the model always judged it could answer in prose.

*Fix:* named the situations that warrant a card, and specified the card *replaces* the closing question. Re-tested: cards now fire on "can you train my team?", LangGraph, classic ML, and the Hindi enquiry — **including localised cards** (Hindi labels and options).

### 6.4 Capability scoped too literally

"Never claim something not in the material" would have the bot deny it can teach LangGraph or classic ML purely because no page lists them.

*Fix:* separated **capability** (broad — agents, LLMs, classic ML, MLOps, vision, Microsoft/AWS/GCP AI; answer yes and scope it) from **specifics** (course names, durations, prices, certification codes, clients — only from indexed material). Verified by C1–C4 above.

---

## 7. Known gaps

1. **Card trigger is inconsistent.** "we want AI training" still returns prose, while "can you train my team?" returns a card. Same intent, different outcome. Model judgement, not a code bug — tightenable with more explicit phrasing if it matters.
2. **Pilot price bands are now publicly quotable.** The bot will disclose `$12k–30k SMB / $40k–120k Enterprise` style bands because they are in `course-pdfs.ts`. Accurate, but a **business decision worth making consciously** — say the word and I'll gate them behind an enquiry.
3. **Academy chapter HTML (~511 files) is not indexed.** Chapter titles and objectives are, from the repo. Full slide content is available behind an `includeHtml` flag but off by default to keep index runs manageable.
4. **Storage key exposure.** An Azure CLI error printed the `stgennoortech` account key into the terminal during this session. Rotating it is advisable.

---

## 8. Cost

I quoted **₹2,270/mo for 1 vCPU / 3 GiB**. That combination does not exist — ACA Consumption enforces a fixed 1 vCPU : 2 GiB ratio. The correction:

| | ₹/mo |
|---|---|
| Before | ~3,700 |
| + Vector container (2 vCPU / 4 GiB, warm) | +3,600 |
| − Duplicate B1 plan (deleted) | −1,150 |
| **Now** | **~6,150** |

Net **+₹2,450/mo**, not the +₹1,100 originally projected. A KEDA daytime-only schedule would bring the container to ~₹2,200 and the total to ~₹4,750, at the cost of a ~105s cold start for overnight visitors.

The duplicate plan (`gennoor-plan-iuya`) hosted only `safar-anbiya.gennoor.com`, which had 2 requests in 30 days. It was moved to the main plan and the empty plan deleted — both sites verified serving afterwards.

---

## 9. Operations

- **Monthly re-index:** `.github/workflows/site-index.yml`, 1st of each month 08:00 IST. Rebuilds the site index, then re-syncs CRM lead vectors. Both authenticate with `CRM_CRON_SECRET`.
- **Manual re-index:** `POST /api/admin/site-index` (manager session or cron secret).
- **Lead vectors:** `POST /api/admin/leads/vector-sync` (`?full=1` after any model change).
- **Service health:** `GET /health` on the container — reports loaded models and per-namespace vector counts.
- **Switching to `bge-m3`:** set `VECTOR_SITE_MODEL=bge`, `VECTOR_DIMENSIONS=1024`, then full re-index of site and leads. Vectors from two models are never comparable, so this is a hard cutover.

---

## 10. Verification commands

```powershell
# Service health
Invoke-RestMethod "https://ca-gennoor-vector.kindbeach-fe39b6f0.centralindia.azurecontainerapps.io/health"

# Index state
$sec = az webapp config appsettings list -n gennoor-tech -g rg-gennoor-tech `
  --query "[?name=='CRM_CRON_SECRET'].value" -o tsv
Invoke-RestMethod "https://www.gennoor.com/api/admin/site-index" -Headers @{ "x-cron-secret" = $sec }

# Ask the bot
$b = @{ messages=@(@{role="user";content="training for a bank operations team?"}); sessionId="check" } | ConvertTo-Json -Depth 5
(Invoke-RestMethod "https://www.gennoor.com/api/gennoorcare" -Method Post -Body $b -ContentType "application/json").reply
```
