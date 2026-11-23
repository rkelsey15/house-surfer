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
- Nov 22, 2026: House Surfer is a portfolio demo, not a live app. Anyone with the link can play in about 60 seconds, with no accounts, database or paid services; everything stays in the visitor's browser. Why: lowest friction for recruiters and friends, $0 to run, and the product thinking still shows in the docs, metrics and moderation.
- Nov 22, 2026: Adopted the PM lifecycle workflow: `docs/STATUS.md` and `docs/DECISIONS.md`, short `CLAUDE.md`. Why: keeps new sessions cheap and the project documented.
- Nov 22, 2026: The demo note is a top strip on phones and a floating pill at bottom-left on laptops. Why: on laptops the tabs sit in the top bar and covered a top strip.
- Nov 22, 2026: "Reset demo" asks first, clears only keys starting with `hs.`, then reloads to the handle picker. Why: one safe wipe that resets every screen's state, and nothing outside the app is touched.
- Nov 22, 2026: "Try this" checkmarks only turn on, never off, and live in `hs.guide`. Why: deleting a comment shouldn't undo progress.
- Nov 22, 2026: Moderation is rules only for the demo, with the word lists in their own file (`src/lib/moderation-words.js`). Why: easy to review and edit without touching logic; an AI check is a V2 item.
- Nov 22, 2026: Moderation matches whole words, undoes spacing, number swaps and repeated letters, and treats hyphenated words as one word. "family room", "family home" and "neighborhood" pass. Why: keep real house comments working. Trade-off: "owner-occupied" slips through and a few harmless phrases get blocked.
- Nov 22, 2026: The same check runs on new comments, replies and edits. Why: an edit would otherwise be a way around the rule.
- Nov 22, 2026: Dropped "couple", "creeps" and "freak" from the word lists. Why: "a couple of windows" and "ivy creeps up the wall" are normal house comments.
- Nov 22, 2026: A blocked comment logs `comment_blocked` with only a reason (`person` or `insult`), never the text. Why: the guardrail metric needs counts, not content. The small event logger was built early for this; the rest of the events and `/stats` come in section 7.
- Nov 22, 2026: Moderation tests run with Node's built-in runner (`npm test`), no new packages. Why: free, and the 44 examples double as documentation.
- Nov 22, 2026: Accessibility target is WCAG 2.2 AA, with the list view equal to the map, pin shapes not just colors, screen-reader labels and 44 px tap targets. The basics get built in the UI polish pass; "Hear this house" is a future feature. Why: an accessible demo reaches more visitors and is a stronger portfolio piece. Documented in the PRD, not claimed as met until audited.
- Nov 22, 2026: Two contrast bugs (reset button, blocked message) were fixed with a new `--danger` color. Why: both were under the 4.5:1 text standard in light mode.
