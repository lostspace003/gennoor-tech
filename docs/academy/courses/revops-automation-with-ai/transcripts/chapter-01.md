# Chapter 1 — Forecast accuracy with AI

**Course:** RevOps Automation with AI · **Chapter:** 01 · **Target duration:** ~7 min spoken

## Trainer persona
Andrew. Practical, evidence-heavy. Real vendor numbers + the failure modes.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Welcome to RevOps Automation with AI. Eight chapters across forecasting, pipeline hygiene, territories, narratives, data cleanup, comp, tooling, and rollout. Chapter one is forecasting — *the place where AI either earns its licence or burns the CRO's trust forever.*

> [S2 ▸ slide change · t ≈ 0:20]

> [S2 ▸ reveal 1 · baseline]

The baseline you're working against. *Salesforce's 2026 State of Sales report* — base of four thousand and fifty sales professionals — found *eighty-seven percent of sales organisations now use AI somewhere in the cycle.* Prospecting, forecasting, lead scoring, email drafting. *Fifty-four percent of sellers have used AI agents.* Roughly nine in ten plan to by twenty twenty-seven.

That's the surface adoption number. *What's underneath is the part that matters.* Not all those eighty-seven percent are seeing forecast accuracy improve. Most aren't. *This chapter is what separates the two.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · where ml beats]

Where ML beats heuristic roll-up. *Three places consistently.* One — multi-product, multi-segment, multi-region pipelines where a single weighted-probability roll-up can't capture interactions. Two — long sales cycles where stage-based heuristics miss compounding signals. Three — markets where the buyer behaviour you're modelling has changed in the last quarter. *Each of these breaks roll-up. ML catches some of what roll-up loses.*

Microsoft's own evaluation of Sales Agent in M365 Copilot — a controlled five hundred and forty-seven prompt benchmark — *sellers handle ten percent more customer meetings and save about one point seven hours a week on meeting prep alone.* That's the productivity layer. The forecast layer is harder to disclose with one number — and Microsoft doesn't — but the framing is clear. *The agent pulls operational and financial signals into the forecast call, not just historical close rates.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · pattern 1 drift]

The three forecast-AI failure patterns that erode CRO trust. *Pattern one — calibration drift.* This is the academic phrase for *the model worked great in test, but its predictions don't track reality anymore.* The technical name is concept drift — the probability distribution mapping deal features to win outcomes shifts under your feet. Buying patterns change mid-quarter. The model doesn't know. Your dashboard still looks healthy.

A 2025 systematic review of CRM predictive models in *Machine Learning and Knowledge Extraction* names calibration drift, class imbalance, and stale training data as *the three dominant failure modes for CRM ML.* If your forecast model was trained six quarters ago and hasn't been re-calibrated, *you are running on drift.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · pattern 2 stale]

*Pattern two — training-data staleness.* Related but different. Your training data is the deal history from quarters that no longer reflect today's market. Reps you no longer have. Products you no longer sell. Pricing that's been re-benchmarked twice. *The model is excellent at predicting a sales motion that's two cycles obsolete.*

The fix is mechanical. Re-train quarterly at minimum. Set up a regression suite that compares the model's predicted win rate against actuals, *bucketed by deal size and segment*. If any bucket drifts more than ten percent, you're in re-train territory.

> [S6 ▸ slide change · t ≈ 4:35]

> [S6 ▸ reveal 1 · pattern 3 point]

*Pattern three — single-point estimate.* The worst of the three for CRO trust. The model outputs *one number* — the forecast for the quarter. The CRO walks into the board meeting with that number. *Reality lands ten percent above or below.* Forecast looks wrong. Trust is lost.

Rob Hyndman — the textbook reference on forecasting — *argues for prediction intervals, not point estimates*. A ninety-five percent prediction interval captures the true value ninety-five percent of the time. If you reported "we'll close between forty-eight and fifty-two million, ninety percent confident," and you came in at forty-nine — *you were right.* If you said "fifty million" and you came in at forty-nine, you missed.

The fix is to *give the board a range, not a number.* HubSpot's Breeze AI Projections explicitly outputs upper and lower bounds via probability-weighted historical patterns. *Use the range. Teach the board to read it.*

> [S7 ▸ slide change · t ≈ 5:50]

> [S7 ▸ reveal 1 · interactive]

The interactive on screen. Same forecast question — *what do we close this quarter* — given to three engines. Heuristic roll-up. ML point estimate. ML with prediction interval. *Pick which output you'd present to the CRO.* The reveal shows what the actual quarter did and which approach survives.

> [pause for hands-on · ≈ 10 seconds]

> [S7 ▸ reveal 2 · pattern]

The pattern. *Roll-up is fine for stable markets. ML beats it when the market shifts. ML with a prediction interval beats ML-with-a-point-estimate every time on board credibility.* The CRO wants to know the range and the level of confidence — not a number that'll be wrong.

> [S8 ▸ slide change · t ≈ 6:40]

> [S8 ▸ reveal 1 · monday move]

The Monday move. *Audit your current forecast model against the three patterns.* When was it last re-trained? Does it output a range or a single number? Has anyone bucketed actuals-versus-prediction by segment and deal size in the last quarter? *If you can't answer any of those questions in under five minutes, you're running on calibration drift.* Fix the re-train cadence first. Add the prediction interval second.

> [S8 ▸ reveal 2 · close]

Next chapter — pipeline hygiene. *Where AI either lifts rep productivity or triggers the rep revolt that costs you adoption forever.*

> [end]
