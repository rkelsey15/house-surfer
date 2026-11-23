# House Surfer: status

Last updated: Nov 22, 2026 · Live: https://rkelsey15.github.io/house-surfer/ · Repo: rkelsey15/house-surfer (`main`)

## Phase
**Phase 5: Build, demo-complete push.** House Surfer is now a portfolio **demo**, not a live app (see DECISIONS.md): anyone with the link can play in about 60 seconds, with nothing but the browser. The plan and acceptance criteria are in `docs/02-user-stories.md`; we build one section at a time and pause for review after each.

Sections 1 to 5 are pushed (Nov 22). Section 5 (Top screen) is pushed.

**Pending: iPhone Safari test of Snap a house.** Ryan can't test on a phone yet. Everything about Snap was checked in headless Edge (phone and laptop sizes, fake camera file, fake location), but the camera sheet, the location prompt and HEIC library photos still need a real iPhone. Test steps were given on Nov 22; the live site already has the build.

## Demo-complete plan
| # | Section | State |
| --- | --- | --- |
| 1 | Demo framing: banner, Reset demo | **Done** |
| 2 | "Try this" guide | **Done** |
| 3 | Moderation (rule-based) | **Done** (44 tests, `npm test`) |
| 4 | Snap a house, lite | **Built and pushed; iPhone Safari test pending** |
| 5 | Top screen | **Done** (awaiting review) |
| 6 | Profile: my comments, activity, locked badges | Next |
| 7 | Event logging and `/stats` | Started: `comment_blocked` is logged; the rest and the page are to do |
| 8 | "Sample" tag on seeded comments | Looks done already (tag shows in screenshots); confirm at the end |
| D1 | PRD Appendix G, "Path to a real launch" | To do (docs only) |
| D2 | Five UI polish ideas | Listed below; refine at the end |

## Built so far
- Data pipeline: `npm run data` writes `public/data/homes.json`, 5,391 Queen Anne houses (6,720 with townhouses, hidden by a flag)
- App shell: handle picker with house rules, tab bar, Auto/Light/Dark theme
- Surf feed, home page with threaded comments and likes, map and list with pins, search and filters
- Demo framing: dismissible banner (a floating pill at bottom-left on laptops), "Reset demo" on Profile with a confirm step; clears only `hs.` keys
- "Try this" checklist on the feed (rate 3, comment, see moderation, view the map); collapses on phones; reopens from Profile
- Snap a house (`/snap`): take or pick a photo on phones, upload or "Use a sample photo" on laptops; pick the house from the 5 nearest (if location is allowed) or by address search; shrunk to 1200 px on a canvas (drops GPS data); "No people or license plates" confirm; saved in IndexedDB on this device; the first photo becomes the home's cover; extra photos show in a strip; Reset demo deletes them
- Top screen (`/top`): Home of the week card (crown), Hot this week (flame, top 5 by recent activity), Top rated (gold rule: 4.5+ with 3+ ratings, best first, 10 at a time with "Show more"). Uses the same stats as the map, so the two always agree. Friendly empty states; every row opens the home page
- Moderation: `src/lib/moderation.js` with word lists in `src/lib/moderation-words.js`. Blocks comments about people and insults on new comments, replies and edits. Handles spacing ("o w n e r s"), number swaps ("n3ighbors") and repeated letters, keeps "family room" and "neighborhood" working
- `src/lib/events.js`: event log in `hs.events` (capped at 2,000, fails quietly)
- Deploy: GitHub Pages via Actions on every push to `main`

## Left vs the PRD
| Item | State |
| --- | --- |
| Snap a house (photo, 5 nearest homes, IndexedDB, sample photo) | Built and live; **iPhone Safari check pending** |
| Top screen | Done |
| Profile: comments, recent activity, locked badges | Partly done (karma and homes rated work) |
| Event logging and `/stats` | Partly done |
| Accessibility basics (PRD Accessibility section) | Planned for the UI polish pass |
| Seed photos and a demo video with captions, case study, README polish | To do |
| V2 (Supabase, logins, Claude moderation) | Paper design only, not built |

## UI polish ideas (for a later pass)
1. **Bigger tap targets:** the close buttons on the demo note and "Try this" card are about 28 px; bring every control to 44 px, and make the tiny ▾ on "Try this" larger.
2. **Pins that differ by shape, not only color:** hollow circle, filled circle, diamond and so on, so color-blind visitors can read the map (PRD Accessibility).
3. **Screen-reader labels:** stars read "Rate 4 of 5 stars", icon buttons get names, house drawings get a one-line description.
4. **Quieter demo note on laptops:** the bottom-left pill covers a little of the list; shrink it to an "i" icon after a few seconds.
5. **Better blocked-comment moment:** move focus to the message so screen readers read it, and add a short "Why?" line that explains the house rule.

## Open questions
- What should karma be called? (Curb Cred, Bricks, Keys)
- Which badges make the first set?
- Which neighborhood is second?
- Moderation word lists are a starter set. Does Ryan want to review `src/lib/moderation-words.js` before the demo goes out?

## Known loose ends
- Likes received stay 0 in single-player; sample-comment likes must be dropped in V2
- Moderation is rules only: it misses clever wording and can block a harmless comment (for example "man cave", "the people's choice"). Stated up front in the case study; V2 adds an AI check
- **iPhone test of Snap a house is pending** (see Phase). It has only been tested in headless Edge (with a fake camera file and fake location). Things only a real phone can show: the camera sheet, the location prompt, HEIC photos from the library
- Photos are not screened by software, only by the visitor's "no people or license plates" confirm. V2 adds an AI photo check
- The sample photo is a drawing made in code (labeled "Sample drawing"), not a real photograph
- Snap covers show on the feed, home page, list and Top, but map pins do not use photos
- Top lists are capped at 10 rows with "Show more" so a long page of 5,000+ homes never renders at once
- Tests: `npm test` covers moderation, the Snap helpers (shrink size, nearest 5, address search) and the Top lists (gold rule, hot order, home of the week, empty data). Everything else is checked by hand in headless Edge at phone (390 px) and laptop (1280 px) sizes
