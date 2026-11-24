# Contributing to House Surfer

Welcome. This page gets you from a fresh checkout to an open pull request. If you are an AI assistant, also read `CLAUDE.md` in the repo root first: it holds the project rules and how the owner likes to work.

## Start here: reading order

Read these in this order. Stop when you have what you need for your task.

1. **`README.md`**: what the project is, one minute.
2. **`docs/STATUS.md`**: where the project is right now, what is done, what is next, what is known to be rough. **Read this before touching anything.**
3. **`docs/ARCHITECTURE.md`**: the map of the code, how data flows, and the data shapes that must not change.
4. **`docs/01-prd.md`** (the product requirements) and **`docs/02-user-stories.md`** (numbered acceptance criteria): read the part for the feature you are changing. The criteria are the definition of "done".
5. **`docs/DECISIONS.md`**: a dated log of why things are the way they are. Check it before you reverse something that looks odd.

## Install, run, test, build

You need **Node.js 22 or newer** (the deploy uses 22) and Git.

```
git clone https://github.com/rkelsey15/house-surfer.git
cd house-surfer
npm install
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the app and prints a link (usually http://localhost:5173/house-surfer/). Changes show as you save |
| `npm test` | Runs all the tests (`node --test`, no browser needed). Should be all green before and after your change |
| `npm run build` | Production build into `dist/`. Run it before opening a pull request |
| `npm run preview` | Serves the built `dist/` folder, to check what GitHub Pages will serve |
| `npm run data` | Rebuilds `public/data/homes.json` from King County records. Needs internet, takes a while. `-- --refresh` re-downloads the county files. You rarely need this: `homes.json` is committed |

The app has no backend, no accounts and no environment variables. Everything a visitor does is saved in their browser, so "Reset demo" on the Profile screen is the way to start clean.

## Checking your work

- **Tests:** `npm test`. Add a test for any logic you add, in `tests/`, next to the area it belongs to. Logic that needs tests goes in a plain `.js` file in `src/lib/` (no React in it) so Node can run it.
- **By eye:** there are no browser tests. Open the app and check the screen you changed at about **390 px wide** (a phone) and **1280 px wide** (a laptop), in **light and dark mode** (Profile, Theme). Your browser's responsive mode is fine for this.
- **Accessibility:** keep every tap target at 44 px or more, every icon button named, text contrast at 4.5:1 or better, and the focus ring visible. `tests/contrast.test.js` and `tests/style.test.js` guard the colors, radius scale and icon weight.
- **Acceptance criteria:** if you change a feature, re-read its numbered criteria in `docs/02-user-stories.md` and make sure they still hold.

## Making a change: branch, commit, pull request

The deploy runs on **every push to `main`**, so do your work on a branch and merge by pull request.

1. **Branch from an up-to-date `main`:**
   ```
   git checkout main
   git pull
   git checkout -b short-name-for-your-change
   ```
2. **Make small commits** as each piece works. Start the message with what changed, and add the criterion id when there is one, like `Top screen: Hot this week shows the top 5 only (AC 5.3)`.
3. **Before you push:** `npm test` and `npm run build` both pass, and you checked the screen by eye (above).
4. **Update the docs that your change touches:** `docs/STATUS.md` (what is done, what is next) and a dated line in `docs/DECISIONS.md` for any real choice, with the "why". If you changed a data shape, update `docs/ARCHITECTURE.md` too.
5. **Push and open the pull request:**
   ```
   git push -u origin short-name-for-your-change
   ```
   Then open it on GitHub (the push prints a link), or with the GitHub CLI: `gh pr create`. In the description say what changed, why, how to see it, and which criteria it covers. Add screenshots of any visual change (phone and laptop, light and dark).
6. **Merging to `main` publishes the site** to https://rkelsey15.github.io/house-surfer/ within a couple of minutes (see `.github/workflows/deploy.yml`). Do not push straight to `main` unless the owner says so.

**Commit identity:** commits use the owner's GitHub **noreply** address, never a personal email (the repo is public). If you are a new contributor, use your own GitHub noreply address too (GitHub, Settings, Emails).

## The rules (do not break)

These come from `CLAUDE.md`. They are product and privacy rules, not style preferences.

1. **Talk about the house, never the people who live there.** Never show owner or resident names.
2. **Addresses are block level only.** Pin coordinates stay fuzzed 25 to 50 m. Never save exact points.
3. **Users are anonymous generated handles.**
4. **Free public data only.** No scraping listing sites and no listing photos. (The two stock photos are decoration on the welcome and empty screens only, never on a home.)
5. **Houses only (1 to 3 units).** Townhouses stay hidden behind `showTownhouses` in `src/config.js`.
6. **Light and dark mode on every screen. Mobile first.**
7. **Say "comments", not "takes".** Get homes from `useHomes()`, never fetch `homes.json` directly.

Also: the app is always called **House Surfer**. Never use Zillow's or Redfin's name, logo, colors or data.

## Where to put things

- A new screen: `src/screens/`, with a route in `src/App.jsx`.
- New saved data: a new `hs.` key through `src/lib/storage.js` or `useStoredState`, and add it to the table in `docs/ARCHITECTURE.md` and to Reset demo (it clears every `hs.` key for you).
- New colors, spacing or radii: use the tokens at the top of `src/styles.css`, not new literal values.
- Anything involving people's names, addresses or locations: stop and re-read rules 1 to 3.
