# House Surfer

Mobile-first social app for rating houses: swipe through homes, give 1 to 5 stars, leave short comments that others like and reply to. Yelp-style ratings with Reddit-style threads. Pitched in the portfolio case study as "Zillow Surfer", but the app is always named House Surfer. Never use Zillow's or Redfin's name, logo, colors or data.

**Read docs/STATUS.md first.** Then docs/DECISIONS.md and docs/01-prd.md only when the task needs them.

## Stack
Vite + React (JavaScript) with HashRouter, Leaflet (react-leaflet) with OpenStreetMap. No backend: V1 saves to the browser (localStorage keys start with `hs.`, via `src/lib/storage.js`). Data is King County public records, built by a Node script. Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Run it
- `npm run dev`: start the app and open the link it prints
- `npm run build`: production build into `dist`
- `npm run data`: rebuild `public/data/homes.json` (`-- --refresh` re-downloads the county files)

## Rules (do not break)
1. Talk about the house, never the people who live there. Never show owner or resident names.
2. Addresses are block level only. Pin coordinates stay fuzzed 25 to 50 m; never save exact points.
3. Users are anonymous generated handles.
4. Free public data only. No scraping listing sites, no listing photos.
5. Houses only (1 to 3 units). Townhouses stay hidden behind `showTownhouses` in `src/config.js`.
6. Light and dark mode on every screen. Mobile first.
7. Say "comments", not "takes". Get homes from `useHomes()`, never fetch `homes.json` directly.

## Working with Ryan
Ryan is a product manager, new to Git and coding tools, on Windows (VS Code, Node, Git Bash). Explain what you're about to do in a sentence or two, run commands yourself, and say how to see the result. Commit after each working step; push only when he says so. Commits use his GitHub noreply address, never his personal email. At the end of a session, update docs/STATUS.md and add to docs/DECISIONS.md.
