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

House Surfer: a mobile-first social app for rating houses. You swipe through homes in a neighborhood, give them 1 to 5 stars, and leave short "takes" that others like and reply to. It's Yelp-style ratings with Reddit-style threads, for houses. The full spec is in `docs/PRD.md`. The clickable design prototype is `design/prototype.html` (open it in a browser and press Play demo); match its look and flows.

In the portfolio case study it's pitched as "Zillow Surfer", a concept for Zillow. **The app itself is always named House Surfer** and must never use Zillow's or Redfin's name, logo, colors or data.

## Product rules (do not break these)

1. **Talk about the house, never the people who live there.** Block takes that mention residents, owners, tenants, families, neighbors or anyone's behavior. Never show owner or resident names, even though they're in county records.
2. Show addresses at block level only ("2400 block of Warren Ave N").
3. Users are anonymous: a generated handle (like "CedarSurfer42"), no real names.
4. Only free, public data. No scraping Zillow, Redfin or listing sites. No listing photos.
5. Houses only: single-family (1 unit) and duplex/triplex (2 to 3 units, tagged). No condos or apartment buildings.
6. Light and dark mode on every screen: follow the device setting, with a manual switch.
7. Mobile first. Desktop shows a list on the left and the map on the right.
8. **No exact locations in app data.** `homes.json` pin coordinates are fuzzed about half a block (25 to 50 m) by the pipeline; the exact point is never saved. Snap-a-house therefore shows the 3 nearest homes and lets the user pick, instead of auto-matching.

## Decisions made after the first build step

- `homes.json` keeps townhouses (type `Townhouse`), but the app has a feature flag `showTownhouses` (in `src/config.js`, default `false`). With it off, V1 shows 5,391 homes (single-family, duplex, triplex). Every place that lists or picks homes must go through the flag.
- County data has no architectural style, so `style` is a rough era tag from year built.
- Git: this repo commits as `Ryan Kelsey <rkelsey15@users.noreply.github.com>` (GitHub noreply address). Don't use his personal email in commits.

## V1 scope (build this now)

V1 is single-player: no accounts or server. Everything saves in the browser (localStorage). See "Milestones" in `docs/PRD.md`.

1. **Data pipeline** (Node script in `scripts/`): download King County Assessor data (residential building, parcel and real property sales files) and King County GIS parcel locations; keep Queen Anne (Seattle) houses only; output `public/data/homes.json` with id, block-level address, lat/lng, beds, baths, sq ft, year built, style/type tag, last sale year. Confirm the real file and field names first; they weren't verified during planning. Expect about 8,000 homes; tell Ryan the actual count.
2. **App shell**: handle picker with house rules, bottom tab bar (Surf, Map, camera, Top, Profile), light/dark theme.
3. **Feed**: one home at a time, 1 to 5 stars, Skip / Takes / Next.
4. **Home page**: average and count, your rating (editable), threaded takes, likes, edit and delete your own takes (show "edited").
5. **Map and list**: Leaflet with OpenStreetMap tiles (with attribution). Pins: green = 4+ stars, orange = hot this week, gray = unrated. Search by street, filters (top rated, unrated, style).
6. **Snap a house**: take or pick a photo, match the nearest home by location (let the user confirm), rate it. Store the photo in the browser (IndexedDB). Homes with no photo show an illustration.
7. **Moderation (V1)**: a rule-based check that blocks takes about people, with the message "Talk about the house, not the people who live there." (Claude-based moderation comes in V2.)
8. **Profile**: handle, karma (+5 per rating, +10 per take, +1 per like received), homes rated, takes, recent activity, badges as locked placeholders.
9. **Event logging**: record every event listed in the PRD's Success metrics section to localStorage, plus a simple `/stats` page with daily counts.
10. **Deploy**: GitHub Pages through a GitHub Actions workflow. Ryan must set Settings > Pages > Source to "GitHub Actions" once; walk him through it.

## Suggested tech

- Vite + React (JavaScript is fine; keep it simple and readable).
- Leaflet (react-leaflet) for the map.
- No backend in V1. Set Vite `base` to `/house-surfer/` for GitHub Pages.
- Seed a handful of sample takes so the app doesn't feel empty, clearly marked as sample data in code.

## Later (don't build yet)

V2: Supabase for login (email link, Apple, Google), shared database with row-level security, photo storage, and Claude moderation through a small server function. V3: two-factor auth, homeowner claim/hide, Street View, a second neighborhood. Future: personalized "homes to rate next", "rate 20 homes before posting" rules, renaming karma.
