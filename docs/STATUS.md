# House Surfer: status

Last updated: Nov 25, 2026 · Live: https://rkelsey15.github.io/house-surfer/ · Repo: rkelsey15/house-surfer (`main`)

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
| P3 | UI polish: Part C (less bland, surfing flow) | **Done and pushed (Nov 23)** |
| P4 | UI polish: Part D (theme setting moves to Profile, Top two columns on laptops) | **Done and pushed (Nov 23)** |
| P5 | UI polish: Part E (Profile "See all" pages, Profile laptop columns, ComingSoon deleted, welcome photo) | **Done and pushed (Nov 23)** |
| P6 | UI polish: Part F (sample photos on about 1 in 3 single-family homes) | **Done and pushed (Nov 23)** |
| P7 | UI polish: Part G (badge icons and Surfer Elite, demo bar on Profile, laptop layouts for welcome, home page and map list) plus the house drawing fixes | **Done and pushed (Nov 23)** |
| P8 | UI polish: Part H (map filter chips, "See all (N)", garage fence gaps, PRD "Map at city scale") | **Done and pushed (Nov 23)** |
| P9 | UI polish: Part I (equal badge cards, badge colors, one floating Demo button, illustration chip, map starts on top homes) | **Done: items 1 to 4 pushed, 5 and 6 committed (Nov 25)** |
| P10 | UI polish: Part J (four badges unlock, badge toast, profile avatars) | **Done, committed, not pushed (Nov 25)** |
| P11 | UI polish: Part K (featured badge, surfer card, sample surfers) | **Done (Nov 25)** |
| H | Handoff docs: `ARCHITECTURE.md`, `CONTRIBUTING.md`, README links, comments in tricky code | **Done and pushed (Nov 23)** |
| CS | Case study | Next |
| D1 | PRD Appendix G, "Path to a real launch" | To do, **last** (docs only) |
| D2 | Five UI polish ideas | Listed below; refine at the end |

## Built so far
- Data pipeline: `npm run data` writes `public/data/homes.json`, 5,391 Queen Anne houses (6,720 with townhouses, hidden by a flag)
- App shell: handle picker with house rules, tab bar, Auto/Light/Dark theme (Appearance on Profile, default Auto)
- Surf feed, home page with threaded comments and likes, map and list with pins, search and filters
- Demo framing: dismissible banner (a floating pill at bottom-left on laptops), "Reset demo" on Profile with a confirm step; clears only `hs.` keys
- "Try this" checklist on the feed (rate 3, comment, see moderation, view the map); collapses on phones; reopens from Profile
- Snap a house (`/snap`): take or pick a photo on phones, upload or "Use a sample photo" on laptops; pick the house from the 5 nearest (if location is allowed) or by address search; shrunk to 1200 px on a canvas (drops GPS data); "No people or license plates" confirm; saved in IndexedDB on this device; the first photo becomes the home's cover; extra photos show in a strip; Reset demo deletes them
- Profile: handle, karma, homes rated and comments; My comments (newest first, opens the home, empty state links to the feed); Recent activity (last 10 actions, "2 min ago"); six badges (four can be earned); avatar picker; Settings
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

## UI polish Part K (Nov 25)
Parts A to J and walkability kept. Checked at 390 and 1280 px, light and dark (headless Edge, seeded data); 218 tests pass, build passes, no sideways scroll.
- **Featured badge:** Profile, Badges, "Edit featured badge", tap an earned badge (toggle buttons with `aria-pressed`, the choice is read out in a status line). Default Surfer Elite if earned, else the first earned. One value, `hs.featured_badge`; Reset demo clears it. `?badges=earned` on the Profile still previews every badge
- **Where it shows:** a 24 px colored circle next to the handle in the Profile header and on that person's comments and replies; Surfer Elite is a black "ELITE" pill with a gold edge. Accessible name like "First Steps badge"
- **Surfer card:** tap any commenter's handle. Popover on laptops, bottom sheet on phones. Shows handle, "Surfing since <month year>", homes rated, comments and all earned badges with short descriptions. No karma, locked badges, progress, activity or ratings. Esc, outside tap and Close dismiss it; focus returns to the handle; 44 px Close button. Checked: sheet role is a modal dialog, the popover is not; your own handle shows your real numbers
- **Sample surfers:** GableGazer7, CedarSurfer12, PorchLightPete and TurretTom21 have made-up stats and 1 to 3 badges and say "Sample surfer". Other sample commenters show a bare "Sample surfer" card. TurretTom21 shows the ELITE pill
- **Karma** stays "karma", on your own Profile only (DECISIONS)
- **Bug fixed on the way:** the small "sample" tag on sample comments had floated loose since Part F (a global CSS rule); now scoped to photos
- Tests added (`tests/featured.test.js`): default featured badge, one-badge limit, saved choice and Reset, card keys, card never has karma or locked badges, sample surfers follow the badge rules. Two older tests updated for the move of the badge icons to `badgeArt.jsx` and a sheet radius
- **Not done or not checked:** no screen reader pass on the card or the featured picker; the popover can run off the right edge of a very narrow comment column (not seen at 1280 px); the card does not cover the Profile "My comments" rows (they show no handle); handles on the Top and Map screens do not open a card (only comments do)

## UI polish Part J (Nov 25, committed, not pushed)
Parts A to I and walkability kept. Checked at 390 and 1280 px, light and dark (headless Edge, with seeded data: 25 ratings, 10 comments); 210 tests pass, build passes, no sideways scroll.
- **Four badges unlock**, computed from data on the device (rules in `src/lib/badgeRules.js`, none stored): First Steps 5 rated homes, Block Walker 25, Good Neighbor Voice 10 comments, Curb Photographer 5 different homes snapped. Earned = full color, no lock. Crowd Favorite and Surfer Elite stay locked and say "Needs other surfers (V2)"
- **Toast:** "Badge earned: name" (live region, one at a time, 6 seconds or Dismiss) the first time a badge unlocks; logs `badge_earned {badge}` (name only). "First time" comes from the event log, so there is no new storage. Seeded test: three unlocked at once, three events, no repeat after reload
- **Avatars:** tap the profile picture, pick one of 8 colored houses (teal, green, blue, purple, coral, amber, pink, slate), 44 px buttons; saved as one value, `hs.avatar`; Reset demo clears it. Focus returns to the picture; Esc closes. No photo upload
- Tests added (`tests/badges.test.js`): each unlock rule at its edge, five photos of one house is not five, the two V2 badges never unlock, `badge_earned` is a known event, avatar cleaning and Reset
- **Not done or not checked:** Curb Photographer was tested by logic only (no seeded photos on screen); the toast can sit over the avatar for a few seconds; no screen reader pass on the toast or the avatar picker; sample ratings do not count toward Block Walker; the `docs/02-user-stories.md` AC 7.1 event list is not updated

## UI polish Part I (Nov 25, items 1 to 4 pushed, 5 and 6 committed)
Parts A to H and walkability kept. Checked at 390 and 1280 px, light and dark (headless Edge): no sideways scroll; 183 tests pass, build passes.
- **Badge cards:** all six are 148 px tall and the same width in every row (checked by measuring); name and how-to clamp to two lines
- **Badge colors:** First Steps green, Block Walker blue, Good Neighbor Voice purple, Crowd Favorite coral, Curb Photographer amber, Surfer Elite gold on black. Locked keeps its color, lighter tint, dashed edge, small lock. New tokens `--b-green` etc. in all three theme blocks; contrast tests added (3:1)
- **"COMING SOON" removed** from each card. The how-to line stays; the note above the grid now reads "No badge unlocks in the demo. Tap one to see how to earn it."
- **Demo button:** the Profile Demo bar and the top strip are gone. One 44 px round "i" button floats bottom-left on every screen (also on sign-up, with Start over only). Opens a panel with "Try this guide" and "Start over" (still asks first). `aria-expanded`, Esc and outside click close it, focus returns to the button, focus moves into the panel on open (all checked). Code: `DemoMenu.jsx`; `DemoBanner.jsx` and `DemoBar.jsx` deleted
- **Note text** is now "Earn badges by using the demo. Two need other surfers (coming in V2)."
- **Illustration chip (item 5):** every house drawing has "Illustration, not this home" bottom-right ("Illustration" under 150 px tall; charcoal #3e4442 at 88%, white 11.5 px, 8 px corners). Alt text: "Illustration, not this home: a Craftsman-era duplex, built 1924". Real and sample photos unchanged; the butterfly roof is untouched. Contrast tested over white and black
- **Map default (item 6):** **770 of 5,391 homes** show at first (631 Gold, 163 Hot, 1 Home of the week, some overlap) plus any home you rated, so nothing was added from the lower chips. The line "Showing top homes. Tap All to see every house." sits under the chips while that default is on. A saved choice from an earlier visit is kept
- **Clash to know about:** on phones the button sits just above the tab bar (clears it), but it does float over the bottom-left corner of page content while scrolling, and the "Saved" bar covers it briefly. A compact alternative would be an "i" button in the app bar. Not done: the Map screen at 390 px was not looked at with the button over it; screen reader pass

## Walkability and Steep hill (Nov 25, committed, not pushed)
Free OpenStreetMap places plus free elevation tiles, worked out in the data script. Formula and reasons in DECISIONS.md.
- **Data:** `homes.json` is now 1,908 KB (was 1,378 KB, +530 KB, +38%; gzipped about 205 KB vs 159 KB). Each home has `walk` (0 to 100), `places` (five counts) and, on steep homes only, `hill: true`. No coordinates were added; the exact point is used in memory only. `npm run data` takes about 1 to 2 minutes the first time (one Overpass request, 12 elevation tiles), seconds after that
- **Scores:** range 24 to 100, median 72. 627 homes 90+, 2,871 at 70 to 89, 1,212 at 50 to 69, 2,008 at 25 to 49, 2 under 25. 1,565 homes (23%) are steep. 1,649 OpenStreetMap places were used
- **App:** home page shows "Walkability Very walkable, 80", up to 4 count pills and a "Steep hill" pill; Credits has an OpenStreetMap section. Phone and laptop, light and dark, no sideways scroll. 171 tests pass, build passes. Code: `scripts/walkability.mjs`, `scripts/elevation.mjs`, `src/lib/walk.js`
- **Not done or not checked:** the score is not shown on the feed card, the map or the list, and there is no filter or sort by it; I did not compare any score with a real walk; screen reader pass on the pills; townhouses (hidden) have scores too; the Overpass download depends on a free public server being up on the day you rebuild with `--refresh`

## Design kit (Nov 25, pushed)
Ryan's reusable UI kit is in `design/ui-kit/` (tokens, components, JS, gallery) for prototypes, the case study page and the demo video. **Not used by the app**: nothing in `src/` imports it and app styles are untouched. `README.md` explains each piece and `theme-surfer`. CLAUDE.md and `ARCHITECTURE.md` have the "start from the kit, don't mix with `src/styles.css`, 44 px" note.
- Checked: all 4 files present; build passes and `dist` holds no kit files (Vite only bundles what `index.html` imports); 162 tests pass
- **Two fixes to the kit while checking:** `gallery.html` had unfilled placeholders (`<!--INLINE_CSS-->`, `<!--INLINE_JS-->`) so it opened unstyled; it now links the three files. And the State toggle and Clickable flow showed every pane at once; added `.kit [hidden]{display:none !important}` to `components.css`
- **Not done or noticed:** the gallery looks at the system dark/light setting, and in dark mode the page background is the portfolio navy behind a teal-themed card area (the `theme-surfer` class is on `main`, not `body`); fonts load from Google Fonts (needs internet); the clickable flow was seen on its first screen only, not clicked through; the `.seg` state buttons are 36 px, not 44

## UI polish Part H (Nov 23, pushed)
Parts A to G kept. Checked at 390 and 1280 px, light and dark (headless Edge): chips are 44 px tall, no sideways scroll; 162 tests pass, build passes.
- **Map filter chips** replace the Legend: Unrated, Under 3.5, 3.5 to 4.4, Gold, Hot, Home of the week, each with its pin shape (flame and crown for the last two). All on by default; **All** and **None** buttons; a live count ("Showing 3,452 of 5,391"). The same filter applies to the map pins and the List view, together with search, Top rated and style. Saved in `hs.map_pins`. Each chip's screen reader name says its state: "Gold homes, shown" / "Gold homes, hidden"; a check mark shows "on" too. With None on, the List says to tap All. Rule for Hot: a hot home shows if Hot is on, whatever its pin type (see DECISIONS). Code: `PinFilter` in `MapScreen.jsx`, rules in `pins.js`
- **See all (N)** always shows on My comments and Recent activity when there is at least 1 item (it used to need more than 5)
- **Fences leave a gap at garage and carport doors** (ranch garage and carport, colonial garage, modern stacked boxes) as well as the front door. Check on `#/drawings` (and `?flip=1`)
- **PRD:** new "Map at city scale" section under Scaling by stage (clustering, neighborhood picker, "Search this area", heat map), marked future and not built
- Tests added: chip rule, saved choice cleaning, chip names, garage gaps in every shape, variant and mirror
- **Not done or not checked:** screen reader pass on the chips; the phone map toolbar is taller again (three rows); at 900 to 1100 px the chip row scrolls sideways rather than wrapping

## UI polish Part G (Nov 23, pushed)
Parts A to F kept. Checked at 390 and 1280 px, light and dark (headless Edge screenshots of Profile, welcome, home page, Map list and the drawing grid); 156 tests pass, build passes, no sideways scroll on any screen checked.
- **Badge icons:** each badge has its own 2 px line icon: First Steps (footprints), Block Walker (pin on a street), Good Neighbor Voice (speech bubble with a house), Crowd Favorite (heart), Curb Photographer (camera), Surfer Elite (star riding a wave). Locked is gray with a small lock; earned is in color (teal, gold, coral); Surfer Elite earned is black with a gold edge. Nothing can be earned in the demo, so all six show locked. To see the earned look: open `#/profile?badges=earned` (design preview only). Code: `Badge.jsx`, icons in `Icons.jsx`, data in `BADGES` in `profileLists.js`
- **Tap a badge** to open "How to earn it:" under it (a button with `aria-expanded`). Surfer Elite shows: 25+ comments, 50+ likes received, no blocked comments in the last 30 days, "Locked in the demo"
- **Demo controls moved to the top of Profile:** a slim bar on laptops, a compact row on phones ("Demo", "Try this guide", "Start over"). "Start over" still asks first ("Clear all your demo data on this device?", Cancel, Yes, reset). The old Demo section at the bottom is gone. Code: `DemoBar.jsx`
- **Welcome screen on laptops (1024 px and up):** the Queen Anne photo fills the left half, the name form sits on the right. Phones unchanged
- **Home page on laptops:** picture, rating and stars on the left and stay in view while you scroll; comments on the right. Phones unchanged. The home page frame widens to 1160 px like Surf
- **Map list on laptops (900 px and up):** search, home count, filter chips and the style menu are one toolbar row across the top, so the list below shows more homes (about 4 cards show at 800 px tall). Phones unchanged
- **House drawing fixes (found while checking):** roofs are now built from their walls (`src/lib/houseGeometry.js`): centered, 5 px overhang (was 14 to 20), and reaching 1 px into the wall so no gap or hairline can show. Fixed: the butterfly roof floated above its walls (the wall top now follows the roof underside), the Victorian tower left a 2 px gap to the main wall, and chimneys now rise through the roof instead of hovering above it. Fences leave a gate gap at the front door in every shape, variant and mirrored layout (the rail used to run across the door). **Drawing grid:** open `#/drawings` (not linked anywhere) for every shape and variant; add `?flip=1`, `?units=2` or `?units=3`, `?pal=3` to see mirrored, attached and other colors
- Tests added: six badges and the Surfer Elite rule, one icon per badge, contrast of every badge color pair, roofs centered with a small overhang, every roof comes from a helper, the fence never covers a door (all shapes, variants, mirrored)
- **Not done or not checked:** no real earning logic for badges (V2: needs other people's likes and moderation history); screen reader pass on the badge buttons (the ranch garage and carport fence gap was fixed in Part H); I did not look at every earned badge at 390 px

## UI polish Part F (Nov 23, pushed)
Parts A to E kept. Checked at 390 and 1280 px, light and dark: no sideways scroll; 136 tests pass, build passes.
- **20 stock photos** in `public/images/sample/` (Pexels, free license, checked one by one by eye: no people, no apartment blocks, no readable plates; Queen Anne Victorian, Craftsman and ordinary single-family styles). 1200 px wide WebP, 71 to 190 KB each, **3.23 MB in total**. Credits (photographer plus links) are in `SAMPLE_PHOTOS` in `src/lib/credits.js`, shown on a new **Credits screen** (`#/credits`, linked from Credits on Profile). Text only, so the page itself downloads no photos
- **Which homes:** about 1 in 3 **single-family** homes (1,685 of the 5,391 houses, 31%). Picked from the home id (a hash), so a home always shows the same photo on every screen and device. Duplexes and triplexes always keep their drawing, because a one-house photo on a duplex would mislead. Code: `src/lib/stockCovers.js`.
- **Label and alt text:** every stock cover has a dark chip on the photo, "Sample photo, not this home" (just "Sample photo" on the small 64 to 72 px thumbnails in lists and Top), and alt text that starts "Sample photo, not this home."
- **Real photos win:** order is the visitor's own Snap photo, then your photo from `public/images/homes/`, then a stock photo, then the drawing (`chooseCover`, tested)
- **Lazy loading:** every cover photo has `loading="lazy"`. In the Map list on a phone, photos far down the list were not downloaded. A visitor only pays for the photos on the screens they scroll to: about one per three houses, roughly 165 KB each
- Tests added: the files exist and are under 200 KB, share is 30 to 37%, same home same photo, every photo used, duplexes never get one, real photos beat samples
- **Not done or not checked:** the stock photos are not screened by software (looked at by eye only); map pins do not use photos; a few photos show a small house number or sign too small to read at normal size (the "214" on the green Queen Anne, "30" on the autumn one); the photographers' names come from each Pexels page and are not verified beyond that

## UI polish Part D (done and pushed Nov 23)
Parts A to C kept. Checked at 390 and 1280 px, light and dark; 130 tests pass, build passes.
- **Appearance setting:** Auto / Light / Dark is only on Profile, Settings, "Appearance" (with a line "Auto follows your device's light or dark setting"). It was also on the welcome screen; removed there. Auto is the default for new visitors. Saved choice, `theme_changed` event and screen-reader label kept. `ARCHITECTURE.md` needed no change (it never mentioned where the switch is)
- **Top screen on laptops (1024 px and wider):** Home of the week full width, then Hot this week and Top rated side by side. Phones stay one column

## UI polish Part E (Nov 23, pushed)
Parts A to D kept. Checked at 390 and 1280 px, light and dark; 132 tests pass, build passes, no sideways scroll.
- **Profile lists:** My comments and Recent activity show the latest 5 with "See all" (only when there are more than 5). `#/profile/comments` and `#/profile/activity` list everything newest first, grouped under Today / Yesterday / dated headings, 20 at a time with "Show more", and "Back to Profile" at the top
- **Profile on laptops (1024 px and up):** stats row across the top, then two columns. Left: My comments, Recent activity. Right: Badges, Settings (Appearance, Surfer name, Product numbers with View stats). Credits and Demo run full width underneath. Phones stay one column
- **Deleted** `src/screens/ComingSoon.jsx` (unused); `ARCHITECTURE.md` updated (screens, components, Profile row)
- **Welcome photo:** now a green and yellow Queen Anne style Victorian (Pexels, Bryce Carithers), picked by Ryan from 3 options (a Craftsman and another Victorian were the others). The banner is taller (230 px, was 170). The old sidewalk photo stays on the Profile "No comments yet" picture. There are now 3 stock photos, all credited on the photo and in Credits on Profile
- New tests: date grouping, and the activity list with no limit

### Wasted space on a 1280 px laptop (ideas only, nothing built)
1. **Snap a house:** two buttons at the top and the rest of the screen empty. Idea: a drop zone plus a "your snaps" strip and a short tips panel on the right
2. **Home page:** one 528 px column with 350 px of empty on each side. Idea: picture and rating on the left (sticky), comments on the right
3. **Welcome screen:** 420 px form in the middle of a wide page. Idea: big house photo on the left half, form on the right
4. **Stats:** one narrow column that scrolls. Idea: the week tiles on the left, the event table on the right
5. **Top, Home of the week:** the card is 1,128 px wide with a 210 px picture. Idea: picture left, text right, so the card is about 120 px shorter
6. **Profile:** the right column ends well before the left. Idea: move Credits into it
7. **Map list pane:** search, three chips and the style menu take three rows. Idea: one row of chips and a smaller menu, so more homes show
8. **Surf:** when the guide is closed the card sits alone. Fine as is; if wanted, an "up next" strip of 3 small houses
## Handoff docs (done Nov 23)
A new engineer, or their AI assistant, can start from the README and be productive without Ryan:
- `docs/ARCHITECTURE.md`: what each folder and key file does, data flow (with a Mermaid diagram that GitHub draws), where each feature lives, the data shapes that are the contract (`homes.json`, `hs.*` keys, events, IndexedDB), and "Rebuilding it elsewhere"
- `docs/CONTRIBUTING.md`: install, run, test, build; branch and pull request steps; the project rules; reading order (README, STATUS, ARCHITECTURE, PRD and acceptance criteria, DECISIONS)
- README has a "For engineers" section linking both
- Short "why" comments added in 5 files (no code changed, 42 comment lines): `MapScreen.jsx` (canvas pins and the private Leaflet methods), `moderation.js` (the 5-step check and why rules), `HomePage.jsx` (why `key={id}`, sample vs real comments), `useStoredState.js`, `homeStats.js` (the crown rule)
- The Mermaid block was checked with Mermaid's own parser (valid flowchart); the doc links and file paths were checked to exist
- **Keep these two docs current:** when a data shape, storage key, event or feature location changes, update the matching table in `ARCHITECTURE.md`


## UI polish Part A (done and pushed Nov 23)
Target: WCAG 2.2 AA (PRD Accessibility). Checked by hand-driven headless Edge at 390 and 1280 px, light and dark: every tap target 44 px or more, every control has a name, no text under 4.5:1, no sideways scroll, Tab order and focus ring on every stop.
- Tap targets 44 px: demo note close, "Try this" toggle and close, map card close, chips, buttons, comment actions, tabs, map zoom buttons
- Map pins differ by shape: hollow circle (unrated), circle (under 3.5), square (3.5 to 4.4), star (4.5+), diamond with crown (top of the week), flame badge (hot). Legend on the map (replaced in Part H by filter chips)
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

## UI polish Part C (done and pushed Nov 23)
Parts A and B kept (re-audited at 320, 390, 1024 and 1280 px, light and dark: no small targets, unnamed controls, low contrast, off-screen controls or sideways scroll).
- **Surf on laptops (1024 px and wider):** the house card is bigger (764 px wide, 400 px tall picture) with the "Try this" guide as a panel on its right; if the guide is dismissed the card centers. On phones the guide stays a small card above the house that you can collapse
- **Stock photos (2, Pexels, free to use, credited):** a hero on the welcome screen and pictures on empty states (Profile "No comments yet", Top "No top homes yet", Surf "You've surfed them all"). Credit text sits on each photo and links are in a new Credits section on Profile. Never shown on a home or address (a test checks the files live in `public/images/mood/`)
- **Richer house drawings:** 6 shape families (new: colonial for late-century homes), 3 or 4 roof/porch variants each, 8 color palettes per era, chimneys, shutters, mirrored layouts, trees (bush, round, pine, tall), picket fences, flower beds, clouds; windows glow warm in dark mode. Same home always gets the same drawing. Tests check variety (600+ distinct looks across 720 homes)
- **Surf flow:** a home opened from Surf has a "Next house" button next to Back. After a rating or comment saves, a "Saved" bar with "Next house" appears at the bottom of the screen. Next house opens the next house's page (top of page, focus on its title) and logs `home_viewed` with source `feed`. It replaces the history entry, so Back still goes straight to Surf, which shows the house you got to
- **Own photos folder ready:** `public/images/homes/` with a README and an empty `covers.json` (see below)
- Tests: 130 pass (new: house design variety, feed order and Next house, credits and sample-cover parsing)

**Not seen on screen yet:** the Top and Surf "surfed them all" empty states (the sample data fills Top, and the feed has 5,000+ homes). They use the same component as the Profile one, which was checked.

## Adding your own house photos (10 to 15 sample covers)
Do this when you have the photos. Nothing changes until `covers.json` lists a photo.
1. **Find each home's id.** Open the home in the app: the address bar ends with the id, like `#/home/055c5ad4`
2. **Photo rules:** taken by you from a public sidewalk. No people, no license plates, no close-up house numbers. No listing photos and no stock photos (CLAUDE.md rule 4)
3. **Remove location data** from each file: right-click it, Properties, Details tab, "Remove Properties and Personal Information", "Create a copy with all possible properties removed"
4. **Shrink it** to about 1200 px wide and under about 250 KB (Paint: Resize, then Save as JPEG)
5. **Save it** in `public/images/homes/` named by the id, for example `055c5ad4.jpg`
6. **List it** in `public/images/homes/covers.json`: `{ "055c5ad4": { "file": "055c5ad4.jpg" }, "1a2b3c4d": { "file": "1a2b3c4d.jpg" } }`
7. Run `npm run dev`, open that home, check it, then commit. A photo a visitor snaps of the same home takes priority over your sample cover

## UI polish ideas (original list, all five done in Part A)
1. **Bigger tap targets:** the close buttons on the demo note and "Try this" card are about 28 px; bring every control to 44 px, and make the tiny ▾ on "Try this" larger.
2. **Pins that differ by shape, not only color:** hollow circle, filled circle, diamond and so on, so color-blind visitors can read the map (PRD Accessibility).
3. **Screen-reader labels:** stars read "Rate 4 of 5 stars", icon buttons get names, house drawings get a one-line description.
4. **Quieter demo note on laptops:** the bottom-left pill covers a little of the list; shrink it to an "i" icon after a few seconds.
5. **Better blocked-comment moment:** move focus to the message so screen readers read it, and add a short "Why?" line that explains the house rule.

## Product decisions, Nov 25 (docs only, no code)
Written into `docs/01-prd.md` (requirements table, V2, Future ideas, Risks, Open questions) and `docs/DECISIONS.md`:
- **Profile pictures:** 8 built-in house avatars in V1 and the demo; about 20 in V2; photo upload is a later V2 item, not planned for the demo (needs image moderation, safe storage, size limits, a report path and a check against the anonymous-handle rule)
- **Karma:** the name stays for now and karma is private (others never see it). Idea only: spend karma on "super likes"
- **Badges:** earned automatically; V2 features one badge next to a username and a username card shows earned badges only. Crowd Favorite and Surfer Elite need other users, so they stay locked in the demo. Idea only: Surfer Elite color by year ("Elite '27")
- **Open question removed:** "What should karma be called?" (also "Which badges make the first set?" is closed: six built). New open question: which image moderation approach, if upload is ever built
- The featured badge and the username card are not in the demo; nothing in `src/` changed

## Open questions
- Which image moderation approach for profile photos, if upload is ever built? (later V2)
- Which neighborhood is second?
- Moderation word lists are a starter set. Does Ryan want to review `src/lib/moderation-words.js` before the demo goes out?

## Known loose ends
- Likes received stay 0 in single-player; sample-comment likes must be dropped in V2
- Moderation is rules only: it misses clever wording and can block a harmless comment (for example "man cave", "the people's choice"). Stated up front in the case study; V2 adds an AI check
- **iPhone test of Snap a house is pending** (see Phase). It has only been tested in headless Edge (with a fake camera file and fake location). Things only a real phone can show: the camera sheet, the location prompt, HEIC photos from the library
- Photos are not screened by software, only by the visitor's "no people or license plates" confirm. V2 adds an AI photo check
- The Snap "Use a sample photo" button still makes a drawing in code (labeled "Sample drawing"). Separately, about 1 in 3 single-family homes show a stock sample photo as their cover (Part F)
- Snap covers show on the feed, home page, list and Top, but map pins do not use photos
- Top lists are capped at 10 rows with "Show more" so a long page of 5,000+ homes never renders at once
- Tests: `npm test` covers moderation, the event log and stats, the Profile lists (my comments, activity, relative times, badges), the Snap helpers (shrink size, nearest 5, address search) and the Top lists (gold rule, hot order, home of the week, empty data). Everything else is checked by hand in headless Edge at phone (390 px) and laptop (1280 px) sizes
