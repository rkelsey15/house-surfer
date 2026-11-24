# House Surfer: status

Last updated: Nov 23, 2026 · Live: https://rkelsey15.github.io/house-surfer/ · Repo: rkelsey15/house-surfer (`main`)

## Phase
**Phase 5: Build, demo-complete push.** House Surfer is now a portfolio **demo**, not a live app (see DECISIONS.md): anyone with the link can play in about 60 seconds, with nothing but the browser. The plan and acceptance criteria are in `docs/02-user-stories.md`; we build one section at a time and pause for review after each.

Sections 1 to 7 are pushed (Nov 22).

**New order (Nov 22): UI polish (Part A, then Part B), then the case study, then PRD Appendix G last.**

**Pending: iPhone Safari test of Snap a house.** Ryan can't test on a phone yet. Everything about Snap was checked in headless Edge (phone and laptop sizes, fake camera file, fake location), but the camera sheet, the location prompt and HEIC library photos still need a real iPhone. Test steps were given on Nov 22; the live site already has the build.

## Demo-complete plan
| # | Section | State |
| --- | --- | --- |
| 1 | Demo framing: banner, Reset demo | **Done** |
| 2 | "Try this" guide | **Done** |
| 3 | Moderation (rule-based) | **Done** (44 tests, `npm test`) |
| 4 | Snap a house, lite | **Built and pushed; iPhone Safari test pending** |
| 5 | Top screen | **Done** (awaiting review) |
| 6 | Profile: my comments, activity, locked badges | **Done** (awaiting review) |
| 7 | Event logging and `/stats` | **Done** (awaiting review) |
| 8 | "Sample" tag on seeded comments | Looks done already (tag shows in screenshots); confirm at the end |
| P | UI polish: Part A (accessibility basics + the 5 ideas) | **Done and pushed (Nov 23); awaiting Ryan's review** |
| P2 | UI polish: Part B (the look) | **Done and pushed (Nov 23); awaiting Ryan's review** |
| CS | Case study | After polish |
| D1 | PRD Appendix G, "Path to a real launch" | To do, **last** (docs only) |
| D2 | Five UI polish ideas | Listed below; refine at the end |

## Built so far
- Data pipeline: `npm run data` writes `public/data/homes.json`, 5,391 Queen Anne houses (6,720 with townhouses, hidden by a flag)
- App shell: handle picker with house rules, tab bar, Auto/Light/Dark theme
- Surf feed, home page with threaded comments and likes, map and list with pins, search and filters
- Demo framing: dismissible banner (a floating pill at bottom-left on laptops), "Reset demo" on Profile with a confirm step; clears only `hs.` keys
- "Try this" checklist on the feed (rate 3, comment, see moderation, view the map); collapses on phones; reopens from Profile
- Snap a house (`/snap`): take or pick a photo on phones, upload or "Use a sample photo" on laptops; pick the house from the 5 nearest (if location is allowed) or by address search; shrunk to 1200 px on a canvas (drops GPS data); "No people or license plates" confirm; saved in IndexedDB on this device; the first photo becomes the home's cover; extra photos show in a strip; Reset demo deletes them
- Profile: handle, karma, homes rated and comments; My comments (newest first, opens the home, empty state links to the feed); Recent activity (last 10 actions, "2 min ago"); five locked badges marked "Coming soon"; Settings; a separate Demo section
- Event logging: all 10 events (`report_filed` is not built, no report button) saved in `hs.events` with handle and fields, never comment text, photos or location. `/stats` (link on Profile): north-star ratings per active user for 4 weeks, plus per-event counts for the last 14 days (tap a row for the days), with a "Demo data: one visitor, this device only" note. Reset demo clears the log
- Top screen (`/top`): Home of the week card (crown), Hot this week (flame, top 5 by recent activity), Top rated (gold rule: 4.5+ with 3+ ratings, best first, 10 at a time with "Show more"). Uses the same stats as the map, so the two always agree. Friendly empty states; every row opens the home page
- Moderation: `src/lib/moderation.js` with word lists in `src/lib/moderation-words.js`. Blocks comments about people and insults on new comments, replies and edits. Handles spacing ("o w n e r s"), number swaps ("n3ighbors") and repeated letters, keeps "family room" and "neighborhood" working
- `src/lib/events.js`: event log in `hs.events` (capped at 2,000, fails quietly)
- Deploy: GitHub Pages via Actions on every push to `main`

## Left vs the PRD
| Item | State |
| --- | --- |
| Snap a house (photo, 5 nearest homes, IndexedDB, sample photo) | Built and live; **iPhone Safari check pending** |
| Top screen | Done |
| Profile: comments, recent activity, locked badges | Done |
| Event logging and `/stats` | Done |
| Accessibility basics (PRD Accessibility section) | Planned for the UI polish pass |
| Seed photos and a demo video with captions, case study, README polish | To do |
| V2 (Supabase, logins, Claude moderation) | Paper design only, not built |

## UI polish Part A (done and pushed Nov 23)
Target: WCAG 2.2 AA (PRD Accessibility). Checked by hand-driven headless Edge at 390 and 1280 px, light and dark: every tap target 44 px or more, every control has a name, no text under 4.5:1, no sideways scroll, Tab order and focus ring on every stop.
- Tap targets 44 px: demo note close, "Try this" toggle and close, map card close, chips, buttons, comment actions, tabs, map zoom buttons
- Map pins differ by shape: hollow circle (unrated), circle (under 3.5), square (3.5 to 4.4), star (4.5+), diamond with crown (top of the week), flame badge (hot). Collapsible Legend on the map
- Screen readers: stars "Rate 4 of 5 stars" plus "You rated this 4 of 5"; Like, Reply, Edit, Delete and Close have names; house drawings say "Illustration of a Craftsman-era duplex, built 1924"; map has a region label pointing to the List
- Keyboard: 3 px focus ring, "Skip to content" link, tab bar comes before the page in the code so Tab order matches the laptop layout; laptop demo note shrinks to an "i" button after 5 seconds
- Blocked comment: focus moves to the message, with a "Why?" line naming house rule 1
- Reduced motion: transitions off and map zoom animation off when the device asks
- Contrast fixes: darker secondary text, darker gold (text and stars), a stronger border color for inputs and buttons (3:1), karma pill color; empty stars are outlines
- Tests: 114 pass (new: contrast of every color pair in both themes, labels, pin shapes, legend, "Why?" text)

**Not yet done or not checked (say so in the case study):** screen reader run (VoiceOver, NVDA); 200% zoom by eye (only 390 px width checked); map pins are not keyboard-reachable (the List view is the full alternative); pin colors against map tiles not measured; focus does not move to the page heading after a screen change; the phone map toolbar takes about a quarter of the screen now that chips are 44 px (candidate for Part B); automated scanner (axe) not run.

## UI polish Part B (done and pushed Nov 23)
Everything from Part A kept (44 px targets, labels, contrast, focus ring, pin shapes). Logo drawing unchanged. Re-audited at 320, 390, 640 (about 200% zoom of a laptop window) and 1280 px, light and dark: no small targets, unnamed controls, low-contrast text, off-screen controls or sideways scroll.
- Logo is a real link, "House Surfer, home", 44 px tall, with hover and focus styles; goes to Surf from any page (not a link on the sign-up screen)
- Buttons: three styles (primary, secondary, quiet) plus one icon-only circle button; one corner radius scale (8 small, 12 controls and chips, 16 cards; circles stay round)
- One icon set (2 px line, round ends): the old text glyphs (x, down arrow, up arrow, back arrow, check, lock) are now icons; profile picture is an outline house
- Phone map toolbar: search and Map/List share one row, filters are one row that scrolls sideways (the count scrolls with them); about 12% of the screen instead of about 25%
- Type scale (24 screen title, 18 section title, 16 card title, 14 body, 12.5 small) and spacing scale (4, 8, 12, 16, 24) as tokens; every screen now has a real h1 (Surf and Map keep theirs hidden for screen readers); in-text links use the brand color
- Bug fixed on the way: on phones the Map screen's search box sat under the app bar because the map ignored the demo strip above it
- Tests: 117 pass (new: radius scale, icon line weight, three button styles)

**Still open for polish:** screen reader run, axe scan, real 200% zoom on a laptop browser (checked by narrow window width instead), map pin contrast against tiles.

## UI polish ideas (original list, all five done in Part A)
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
- Tests: `npm test` covers moderation, the event log and stats, the Profile lists (my comments, activity, relative times, badges), the Snap helpers (shrink size, nearest 5, address search) and the Top lists (gold rule, hot order, home of the week, empty data). Everything else is checked by hand in headless Edge at phone (390 px) and laptop (1280 px) sizes
