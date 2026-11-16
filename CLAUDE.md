# House Surfer: project brief for Claude Code

Read this file first in every session. It carries the decisions made while planning this project, so you don't need the earlier chat.

## Who you're working with

Ryan is a product and program manager building this as a portfolio project. He is new to Git and coding tools. So:

- Explain what you're about to do in one or two plain sentences before doing it.
- Run commands yourself instead of asking Ryan to type them, unless something needs his login (like GitHub sign-in).
- After each milestone step, tell him how to see the result (for example "run `npm run dev` and open the link").
- Commit to Git after each working step with a clear message, and push when he says so.
- His computer runs Windows, with VS Code, Node.js and Git Bash installed.

## What we're building

House Surfer: a mobile-first social app for rating houses. You swipe through homes in a neighborhood, give them 1 to 5 stars, and leave short "comments" that others like and reply to. It's Yelp-style ratings with Reddit-style threads, for houses. The full spec is in `docs/PRD.md`. The clickable design prototype is `design/prototype.html` (open it in a browser and press Play demo); match its look and flows.

In the portfolio case study it's pitched as "Zillow Surfer", a concept for Zillow. **The app itself is always named House Surfer** and must never use Zillow's or Redfin's name, logo, colors or data.

## Product rules (do not break these)

1. **Talk about the house, never the people who live there.** Block comments that mention residents, owners, tenants, families, neighbors or anyone's behavior. Never show owner or resident names, even though they're in county records.
2. Show addresses at block level only ("2400 block of Warren Ave N").
3. Users are anonymous: a generated handle (like "CedarSurfer42"), no real names.
4. Only free, public data. No scraping Zillow, Redfin or listing sites. No listing photos.
5. Houses only: single-family (1 unit) and duplex/triplex (2 to 3 units, tagged). No condos or apartment buildings.
6. Light and dark mode on every screen: follow the device setting, with a manual switch.
7. Mobile first. Desktop shows a list on the left and the map on the right.
8. **No exact locations in app data.** `homes.json` pin coordinates are fuzzed about half a block (25 to 50 m) by the pipeline; the exact point is never saved. Snap-a-house therefore shows the 3 nearest homes and lets the user pick, instead of auto-matching.

## Progress

Last updated: Nov 15, 2026 (after step 4). Repo: https://github.com/rkelsey15/house-surfer (branch `main`). Update this section at the end of every step.

### Steps done

- [x] **1. Data pipeline.** `npm run data` runs `scripts/build-homes.mjs` and writes `public/data/homes.json`: **6,720 Queen Anne homes** (4,893 single-family, 338 duplex, 160 triplex, 1,329 townhouse); **5,391** with townhouses hidden. The big county downloads are cached in `data/raw` (git-ignored); `npm run data -- --refresh` re-downloads them.
- [x] **2. App shell.** Vite + React + `HashRouter`. Handle picker with house rules, bottom tab bar (moves to the top bar on desktop), Auto/Light/Dark theme. Placeholder screens for Map, Snap and Top.
- [x] **House illustrations.** `src/components/HouseArt.jsx` draws each home in code, using the prototype's shapes: shape and palette come from the era tag, 1 to 3 houses from the unit count, color pick from the home id (stable per home). Used on the Surf screen; reuse it on the home page, list and map card.

### Steps left (in order)

- [x] **3. Feed.** `src/screens/Surf.jsx`: shuffled queue of unrated homes, 1 to 5 stars, Skip / Next (Next needs a rating). Ratings live in `src/lib/RatingsContext.jsx` (`useRatings()`, key `hs.ratings`, `{homeId: {stars, at}}`). Karma pill and Profile now show real karma (+5 per rating) and homes rated. The Comments button is disabled until step 4.
- [x] **4. Home page.** `src/screens/HomePage.jsx`, route `/#/home/:id`, opened from the Surf screen's Comments button. Shows the average and count, your editable rating, threaded comments (replies one level deep, 280 characters max), likes, and edit (marked "edited") and delete for your own. Comments live in `src/lib/CommentsContext.jsx` (`useComments()`), stored as three tables shaped like the V2 database: `hs.comments` (id, home_id, parent_id, user, body, created_at, edited_at), `hs.comment_edits` (comment_id, old_body, edited_at) and `hs.likes` (comment_id, user, created_at; one per user per comment). Like counts and karma are computed from these rows, never stored. Deleting a comment also removes its replies, edits and likes (like ON DELETE CASCADE). Karma is +5 per rating, +10 per comment, +1 per like received. Sample comments and ratings come from `src/lib/sampleData.js` (made up, generated from the home id, never saved). The Surf feed now remembers its place when you come Back from a home page.
- [ ] 5. **(next)** Map and list (Leaflet). Reuse `HouseArt` on the map card and list, and link to `/home/:id`.
- [ ] 6. Snap a house (3 nearest homes)
- [ ] 7. Moderation (rule-based block on comments about people)
- [ ] 8. Profile (karma, homes rated, comments, activity, locked badges)
- [ ] 9. Event logging and `/stats`
- [ ] 10. Deploy to GitHub Pages (Ryan must set Settings > Pages > Source to "GitHub Actions" once)

Step numbers match the "V1 scope" list above.

### Decisions made

- **Townhouses:** kept in `homes.json` (type `Townhouse`), hidden in V1 by the feature flag `showTownhouses` in `src/config.js` (default `false`). The flag is applied in one place, `src/lib/HomesContext.jsx`, so always get homes from `useHomes()`, never fetch `homes.json` directly.
- **Naming:** user posts are called "comments" everywhere: the app, code, storage keys, CLAUDE.md, `docs/PRD.md`, `README.md` and `design/prototype.html` (renamed from "takes" on Nov 15, 2026, including event names like `comment_posted`). Use "comments" in code, keys and screen text.
- **Style is a rough era tag** (Victorian era, Craftsman era, Pre-war, Mid-century, Late century, Modern) from year built, because county data has no architectural style.
- **Privacy in the data:** pin locations are fuzzed 25 to 50 m by the pipeline and the exact point is never saved; ids are hashes, not parcel numbers; only the last sale *year* is kept (no prices, no names); numbers under 100 show as "0–99 block".
- **Storage:** everything saved in the browser uses keys starting with `hs.` through `src/lib/storage.js` (safe if storage is blocked). Existing keys: `hs.profile` (handle and join date), `hs.theme`. Use the same pattern (`useStoredState`) for ratings, comments and events.
- **Routing:** `HashRouter` (URLs look like `/#/map`) so GitHub Pages works without server rules. The future `/stats` page is `/#/stats`.
- **Git identity:** commits are `Ryan Kelsey <333146552+rkelsey15@users.noreply.github.com>` (his GitHub noreply address). Never use his personal email. On Nov 15, 2026 all commits were rewritten to this address and force-pushed (Ryan approved); everything was pushed.
- **Testing so far:** no automated test suite. Each step was checked by driving the built app in headless Edge (puppeteer-core, kept outside the repo) and looking at screenshots in light and dark mode. Do the same for new screens.

### Loose ends to wire up later

- Likes received (+1 karma) are computed already but stay 0 in single-player (you can't like your own comments) until V2. Sample comments have made-up like rows; a like you give a sample comment is saved with that sample id, so V2 needs to ignore or drop those.
- `src/lib/moderation.js` `checkComment()` is a placeholder that lets everything through. Step 7 fills it in; the comment box already shows its message.
- Profile "recent activity" and Top screen should use `useComments()` and `useRatings()`.
- The `/map`, `/snap` and `/top` routes in `src/App.jsx` are `ComingSoon` placeholders.

## V1 scope (build this now)

V1 is single-player: no accounts or server. Everything saves in the browser (localStorage). See "Milestones" in `docs/PRD.md`.

1. **Data pipeline** (Node script in `scripts/`): download King County Assessor data (residential building, parcel and real property sales files) and King County GIS parcel locations; keep Queen Anne (Seattle) houses only; output `public/data/homes.json` with id, block-level address, lat/lng, beds, baths, sq ft, year built, style/type tag, last sale year. Confirm the real file and field names first; they weren't verified during planning. Expect about 8,000 homes; tell Ryan the actual count.
2. **App shell**: handle picker with house rules, bottom tab bar (Surf, Map, camera, Top, Profile), light/dark theme.
3. **Feed**: one home at a time, 1 to 5 stars, Skip / Comments / Next.
4. **Home page**: average and count, your rating (editable), threaded comments, likes, edit and delete your own comments (show "edited").
5. **Map and list**: Leaflet with OpenStreetMap tiles (with attribution). Pins: green = 4+ stars, orange = hot this week, gray = unrated. Search by street, filters (top rated, unrated, style).
6. **Snap a house**: take or pick a photo, match the nearest home by location (let the user confirm), rate it. Store the photo in the browser (IndexedDB). Homes with no photo show an illustration.
7. **Moderation (V1)**: a rule-based check that blocks comments about people, with the message "Talk about the house, not the people who live there." (Claude-based moderation comes in V2.)
8. **Profile**: handle, karma (+5 per rating, +10 per comment, +1 per like received), homes rated, comments, recent activity, badges as locked placeholders.
9. **Event logging**: record every event listed in the PRD's Success metrics section to localStorage, plus a simple `/stats` page with daily counts.
10. **Deploy**: GitHub Pages through a GitHub Actions workflow. Ryan must set Settings > Pages > Source to "GitHub Actions" once; walk him through it.

## Suggested tech

- Vite + React (JavaScript is fine; keep it simple and readable).
- Leaflet (react-leaflet) for the map.
- No backend in V1. Set Vite `base` to `/house-surfer/` for GitHub Pages.
- Seed a handful of sample comments so the app doesn't feel empty, clearly marked as sample data in code.

## Later (don't build yet)

V2: Supabase for login (email link, Apple, Google), shared database with row-level security, photo storage, and Claude moderation through a small server function. V3: two-factor auth, homeowner claim/hide, Street View, a second neighborhood. Future: personalized "homes to rate next", "rate 20 homes before posting" rules, renaming karma.
