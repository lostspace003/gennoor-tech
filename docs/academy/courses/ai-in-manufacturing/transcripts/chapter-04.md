# Chapter 4 — Process optimisation with AI

**Course:** AI in Manufacturing · **Chapter:** 04 · ~4.5 min

## Persona
Emma. Plant-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Process optimisation with AI.* Where AI surfaces what humans miss.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 signals AI surfaces]

Three signals AI surfaces that humans miss.

*Signal one — multi-parameter interactions.* Operators tune one variable at a time. AI sees how four or five variables interact non-linearly. *Combinations the human eye can't track.*

*Signal two — drift.* Process variables drift over weeks. Operators normalise to it. *AI catches the trend against historical baseline.*

*Signal three — best-shift patterns.* Why does shift A consistently outperform shift B on the same line? AI surfaces the parameter combinations. *Operators can then standardise the winning pattern.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · operator-led experiments]

Operator-led experiment design.

The teams that succeed at process optimisation. *Operators lead the experiments. AI surfaces candidates. Operators decide what to try.*

*Why operator-led works.* Operators know the constraints AI doesn't see in data. Safety. Maintainability. *Customer-specific quality requirements.*

*Why AI-led fails.* AI proposes a parameter combination. Looks great in data. *Breaks something nobody told the model about.*

The cadence. *AI surfaces five candidates per week. Operator team picks one or two to trial. Trial runs in production with quality oversight.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 overfitting guards]

Three guards against the overfitting trap.

*Guard one — out-of-sample validation.* Model that fits training data perfectly often fails on new data. *Test on held-out data — month-out, season-out, supplier-lot-out.*

*Guard two — physical-reasoning check.* Does the optimal setting AI proposes make physical sense? *Run it past a process engineer with twenty years on this line. If they say "that doesn't fit how the process actually works" — listen.*

*Guard three — small-stake trials before commit.* Don't switch full production to AI-recommended settings. *One line, one shift, full quality oversight first.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score process optimisation honestly. *Two questions.*

*Question one — last six months, has AI-recommended change measurably improved yield, quality, or throughput?* Yes with clear data green. Improvement but hard to attribute amber. *No measurable improvement red.*

*Question two — operator team owns the experimental cadence and decisions?* Yes green. AI team drives, operators follow amber. *AI team alone decides red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one process metric that's been stuck at a plateau for over a year.* Ask the AI team to surface multi-parameter candidates. *Operator team picks one to trial this quarter.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Plant-floor supply chain integration.* Real-time re-planning cadences.

> [end]
