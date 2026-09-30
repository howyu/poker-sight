# Third-party notices

## Poker Range Analyzer

PokerSight's initial 6-max RFI teaching dataset is adapted from **tyloo/poker-range-analyzer** (UTG, MP/HJ, CO, BTN, SB range files).

- Upstream: https://github.com/tyloo/poker-range-analyzer
- License: MIT
- Copyright (c) 2026 Julien 'Tyloo' Bonvarlet <jbonva@gmail.com>
- Adaptation: upstream `MP` is labeled `HJ` in PokerSight to match our 6-max position naming.

The upstream repository describes these as GTO preflop ranges. PokerSight presents them as a sourced study reference rather than claiming solver-perfect universal strategy; exact ranges depend on stack depth, rake, sizing, and game assumptions.

MIT permission notice:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to inclusion of the upstream copyright and permission notice.

## Poker Apprentice Hand Evaluator

PokerSight's deterministic hand-ranking layer and Monte Carlo Equity estimator use **@poker-apprentice/hand-evaluator**.

- Upstream: https://github.com/poker-apprentice/hand-evaluator
- Package: @poker-apprentice/hand-evaluator
- Version integrated: ^4.3.0
- License declared by upstream package metadata: MIT
- Copyright/author attribution from upstream package metadata: Matt Huggins <matt.huggins@gmail.com>

PokerSight uses the evaluator for card/hand comparison only. Opponent Range weighting, sampling, Pot Odds comparison, training logic, and learner-facing explanations are implemented in PokerSight.
