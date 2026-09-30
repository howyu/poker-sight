# PokerSight Roadmap

PokerSight is a study-first Texas Hold'em learning PWA. The product should reuse proven poker mathematics and open-source infrastructure where licensing permits, and concentrate original work on explanation, memory, feedback, and personalized learning.

## Product principles
- Study mode only: no live-table or real-time play assistance.
- Do not reinvent solved infrastructure: evaluate existing hand evaluators, equity engines, range parsers, solvers, and datasets before implementing our own.
- Never present invented precision as GTO. Strategy frequencies and equity numbers must have a traceable source/method.
- Beginner-first: poker terminology should be explainable in context, not assumed.
- Keep PRs small: one independently testable/revertible capability per PR when practical.

## Reference landscape
Research before implementation:
- OpenGTO — useful reference for preflop drills and a 13x13 / 169-hand range viewer. AGPL-3.0 means we should treat code reuse carefully; product concepts can inform our UX.
- poker-apprentice/hand-evaluator — TypeScript hand evaluation plus exact/simulated Hold'em equity; strong candidate to evaluate instead of building an evaluator from scratch.
- poker-yoga/poker-math — useful reference for range notation, equity methodology, and generated preflop datasets; verify license/provenance before reuse.
- poker-range-analyzer — useful UX reference for position-based preflop ranges, 13x13 matrices, and equity calculation.
- TexasSolver / other CFR solvers — useful solver references, but copyleft/commercial-license constraints mean we should not casually embed their code into a hosted product.

## Milestones

### M0 — Foundation (PR #1)
- Next.js responsive learning PWA foundation.
- Preflop decision drills.
- Click-to-learn terminology.
- Local progress tracking.
- Quick-reference card entry points.
- Vercel Preview/Production workflow.
- This roadmap.

### M1 — 169 Starting-Hand Matrix
Goal: make the canonical 13x13 matrix something a beginner repeatedly checks until it becomes visual memory.
- AA…22 diagonal; suited/offsuit triangles.
- Tap any hand for plain-language strength and structural properties.
- Filters for UTG/HJ/CO/BTN/SB/BB.
- Visual action layers for raise/call/fold once validated range data is selected.
- Current drill hand highlighted in the matrix.
- Separate raw hand strength from position-dependent strategy.

### M2 — Range Learning
- Position opening ranges.
- Facing open / 3-bet / 4-bet views.
- Mixed-strategy frequency visualization.
- Range comparison mode.
- Spaced repetition for hands/ranges the learner repeatedly misses.

### M3 — Poker Math Engine
- Adopt or integrate a validated hand evaluator rather than writing one by default.
- Exact or simulated Equity with explicit opponent range assumptions.
- Pot odds, required equity, outs and basic EV.
- Every number shows assumptions/method so learners do not memorize context-free percentages.

### M4 — Adaptive Coach
- Explain *why* a decision changes with position, stack, sizing and range.
- Error taxonomy and personal weakness model.
- Review queue generated from mistakes.
- JEV structured decision layer for explanations and training orchestration, with deterministic poker math kept separate.

### M5 — Postflop Curriculum
- Flop/turn/river state representation.
- Board texture and range interaction.
- Bet sizing concepts.
- Curated common spots before broad solver-backed coverage.

## PR policy
A PR should normally map to one roadmap capability and be independently previewable and revertible. Merge a stable vertical slice before starting a materially different subsystem. Research/licensing decisions should be documented before importing third-party code or datasets.

## Near-term sequence
1. Merge M0 once Preview/Production is verified.
2. PR #2: interactive 169-hand matrix shell and memory UX.
3. PR #3: validated position-based range dataset + provenance.
4. PR #4: equity/pot-odds engine integration.
5. PR #5+: adaptive review and JEV coaching.
