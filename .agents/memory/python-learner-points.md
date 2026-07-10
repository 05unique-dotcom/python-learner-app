---
name: Python Learner points/rewards architecture
description: How points, keys/prizes, and the real leaderboard are computed for the Python Learner app
---

Points are **not** stored in a ledger table — they're computed fresh per request from `attempts`/`lessons`/`challenges`, the same way badges/progress/certificate already worked in this app.

**Why:** the codebase's existing convention is "recompute from source of truth on every request," never cache/store derived stats. Following it kept the points system consistent and avoided ledger idempotency problems (e.g. double-awarding a bonus on retry).

Formula (per user, per lesson with `total` challenges and `correct` distinct-correct count):
- ratio = correct/total. ratio >= 1 (lesson fully correct) → +50 lesson-complete AND +150 perfect-quiz (both fire together, per product spec).
- 0.7 < ratio < 1 → +100 quiz-pass only.
- Streak: `currentStreak * 25` (streak calc reused/extracted from the existing `/streak` route logic into `getCurrentStreak`).
- Course complete bonus: +500 flat if completedLessons === totalLessons.
- Reward tiers (Bronze/Silver/Gold/Champion) are static thresholds (200/500/1000/2000) compared against total points — no separate unlock state stored.

**How to apply:** For a genuine multi-user leaderboard with no auth system, added a minimal `users` table (id = the existing per-browser `X-User-Id` header value, nullable `displayName`) purely to store the name a user types on the Certificate/Leaderboard page (localStorage `pythonLearnerName`), synced via `PUT /me`. Leaderboard queries `SELECT DISTINCT user_id FROM attempts`, computes points per user in a loop (fine at this app's scale), and joins display names, falling back to `Learner <first 4 chars of id>` when no name is set.
