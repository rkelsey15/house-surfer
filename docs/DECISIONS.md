# Decisions

Append-only. One line each: date, decision, why. Dates before Nov 15, 2026 were not recorded.

- Nov 15, 2026: Townhouses stay in `homes.json` but are hidden by the `showTownhouses` flag. Why: houses-only launch with a one-line way to turn them on.
- Nov 15, 2026: Pins are blurred 25 to 50 m and the exact point is never saved. Why: exact pins would undo the block-level address rule.
- Nov 15, 2026: Style is an era tag from year built. Why: county data has no architectural style.
- Nov 15, 2026: Houses are drawn in code (`HouseArt`), no listing photos. Why: rule against listing data and photos.
- Nov 15, 2026: "Takes" renamed to "comments" everywhere. Why: clearer for new users.
- Nov 15, 2026: Comments use `parent_id` threads, an edit-history table and a likes table; counts are computed, not stored. Why: stable ids, and the same shape V2's database would use.
- Nov 15, 2026: Soft delete with `deleted_at`. Why: keeps replies, edit history and likes.
- Nov 15, 2026: Replies are one level deep in the UI. Why: deep threads get cramped on phones.
- Nov 15, 2026: Handles are generated and locked after sign-up. Why: makes real names and slurs impossible instead of filtering them.
- Nov 15, 2026: Pin colors are hollow gray, blue, green, gold (4.5+ with 3+ ratings), flame, purple crown. Why: gold is earned, and red or orange read as "bad".
- Nov 15, 2026: Router is `HashRouter`. Why: GitHub Pages works without server rules.
- Nov 15, 2026: Everything in the browser uses `hs.` keys through `src/lib/storage.js`. Why: one pattern, safe if storage is blocked.
- Nov 15, 2026: Deploy before Snap a house. Why: phone camera and location only work on a real https site.
- Nov 15, 2026: V2 stays a paper design, no paid database. Why: the portfolio goal is showing the thinking at $0.
- Nov 15, 2026: Git commits use the GitHub noreply address; history was rewritten and force-pushed. Why: public repo, protect the personal email.
- Nov 22, 2026: Adopted the PM lifecycle workflow: `docs/STATUS.md` and `docs/DECISIONS.md`, short `CLAUDE.md`. Why: keeps new sessions cheap and the project documented.
