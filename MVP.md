# PokerSight v0.1

Study-first Texas Hold'em decision trainer. Designed for learning and post-hand practice, not real-time assistance during live or online games.

## MVP
- 6-max NLHE preflop foundation
- Fold / Call / Raise decisions
- Beginner-friendly Chinese explanations
- Clickable terminology
- Local progress tracking
- Responsive PWA foundation

## Architecture
Poker state -> deterministic poker layer -> GTO reference (future) -> JEV decision layer (future) -> coaching -> personal weakness model.

Current sample spots are simplified teaching examples. Before presenting frequencies as authoritative GTO output, PokerSight should connect to a validated strategy dataset or solver output.

## Next
1. Expand preflop spots and range visualization.
2. Add spaced repetition for mistakes.
3. Add validated GTO reference data.
4. Integrate JEV behind a server-side adapter.
5. Add offline/install PWA assets.
