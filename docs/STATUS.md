# House Surfer: status

Last updated: Nov 22, 2026 · Live: https://rkelsey15.github.io/house-surfer/ · Repo: rkelsey15/house-surfer (`main`)

## Phase
**Phase 5: Build** (V1, single-player, data saved in the browser). Phase 1 PRD exists (`docs/01-prd.md`).
Phases 2 to 4 were never written as separate docs: no `02-user-stories.md`, `03-architecture.md` or `04-plan.md`. The PRD and the old `docs/system-design.png` cover part of that.

## Built (PRD V1 steps 1 to 5 and 10)
- Data pipeline: `npm run data` writes `public/data/homes.json`, 5,391 Queen Anne houses (6,720 with townhouses, which are hidden by a flag)
- App shell: handle picker with house rules (handle locked after sign-up), tab bar, Auto/Light/Dark theme
- Surf feed: 1 to 5 stars, Skip / Next, karma pill
- Home page: average, your rating, threaded comments (one level of replies), likes, edit and soft delete
- Map and list: Leaflet pins, flame and crown badges, search, filters, phone and desktop layouts
- Deploy: GitHub Pages via Actions on every push to `main`

## Left vs the PRD
| Item | State |
| --- | --- |
| 6. Snap a house (photo, 3 nearest homes, IndexedDB) | **Next** |
| 7. Moderation (`checkComment()` is a placeholder that allows everything) | To do |
| 8. Profile: comments, recent activity, locked badges (karma and homes rated already work) | Partly done |
| 9. Event logging and `/stats` page | To do |
| Top screen (`/top` is a placeholder) | To do |
| Seed photos and a demo video, case study, README polish | To do |
| V2 (Supabase, logins, Claude moderation) | Paper design only, not built |

## Open questions
- What should karma be called? (Curb Cred, Bricks, Keys)
- Which badges make the first set?
- Stop at the live single-player link, or go on to real logins for friends?
- Which neighborhood is second?
- Phases 2 to 4 (stories, architecture, plan): write them now, or skip since V1 is mostly built?

## Known loose ends
- Likes received stay 0 in single-player; sample-comment likes must be dropped in V2
- No automated tests; each step was checked in headless Edge with screenshots
