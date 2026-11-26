# House Surfer: user stories and acceptance criteria

Nov 22, 2026 · Ryan Kelsey · Status: **approved Nov 22, 2026**

## Direction

House Surfer is a portfolio **demo**, not a live app. Anyone with the link (a recruiter on a laptop, a friend on iPhone Safari) should be able to play with it in about 60 seconds. No accounts, no database, no paid services. Everything stays in the visitor's browser.

This replaces the "invite up to 10 friends" framing in the PRD for V1. Metrics, events and moderation still get built, because they show the product thinking.

## How to read this

- Each story has numbered acceptance criteria (AC), written Given / When / Then.
- Build order is the order below. We build **one AC at a time**, check it on a phone-size screen (about 390 px wide) and a laptop-size screen (about 1280 px wide), commit, and report before starting the next.
- AC ids (for example 3.2) are used in commit messages and in STATUS.md.
- Every screen must work in light and dark mode (project rule 6), so that check is part of "done" for each AC.

---

## 1. Demo framing

**Story 1A.** As a visitor, I want to know this is a demo with sample data, so I'm not confused about what's real.

- **1.1** Given I open the app for the first time, when the first screen loads, then I see a small banner: "Demo: sample data, saved only on this device", with a close button.
- **1.2** Given the banner is showing, when I close it, then it disappears and stays hidden on later visits on this device.
- **1.3** Given the banner is showing, then it does not cover the tab bar, the feed's rating stars or the map controls on a phone-size screen.

**Story 1B.** As a visitor, I want to start over, so I can try the demo again from a clean state.

- **1.4** Given I'm on Profile, when I look at the page, then I see a "Reset demo" button.
- **1.5** Given I tap "Reset demo", when the app asks "Clear all your demo data on this device?", then Cancel changes nothing.
- **1.6** Given I confirm the reset, when it finishes, then all `hs.` keys and saved photos are cleared, and I land on the handle picker as a first-time visitor (banner and Try this guide come back).
- **1.7** Given I reset the demo, then nothing outside House Surfer's own data is touched (theme choice is also reset, nothing else).

## 2. "Try this" guide

**Story 2.** As a first-time visitor, I want a short checklist of things to try, so I see the best parts in about a minute.

- **2.1** Given I just picked my handle, when the feed opens, then I see a "Try this" checklist with four items: rate 3 homes, rate a home then comment on it, try writing about a neighbor to see moderation, view the map.
- **2.2** Given the checklist is showing, when I do one of the items (3 ratings, post a comment, get a comment blocked, open the map), then that item gets a checkmark without a page refresh.
- **2.3** Given I finish all four items, then the checklist shows a short "You've seen it all" state and can be dismissed.
- **2.4** Given the checklist is showing, when I dismiss it, then it stays hidden on later visits.
- **2.5** Given I dismissed it, when I go to Profile and tap "Show Try this guide", then it reopens with my progress still checked.
- **2.7** Given the checklist shows the moderation item, then it includes the hint: Try writing "The neighbors are loud".
- **2.6** Given I'm on a phone-size screen, then the checklist is collapsed to one line ("Try this: 1 of 4") that expands on tap, so it doesn't push the feed off the screen.

## 3. Moderation (rule-based)

**Story 3.** As the product owner, I want comments about people blocked before they post, so the one rule holds: talk about the house, never the people who live there.

Blocked message, exactly: **"Talk about the house, not the people who live there."**

What gets blocked:
- Words for people tied to the home: resident(s), owner(s), tenant(s), renter(s), landlord, neighbor(s), family, kids, lives here, the guy / woman / man / lady who...
- Behavior and character of the people: "loud," "creepy," "never home," "sketchy people," when about people.
- Slurs and insults aimed at anyone ("idiot," "loser," and slurs).

- **3.1** Given I type a comment that matches a blocked pattern, when I tap Post, then it is not saved, the message above shows under the box, and my text stays so I can edit it.
- **3.2** Given I type a comment about the house only, when I tap Post, then it posts as before.
- **3.3** Given the same rules, when I post a **reply** or **edit** a comment, then they apply the same way.
- **3.4** Given a comment is blocked, then a `comment_blocked` event is logged with a reason (`person` or `insult`), but not the comment text.
- **3.5** Given matching is case-insensitive and ignores punctuation, then "OWNERS" and "o.w.n.e.r.s" style tricks with simple punctuation or repeated letters are still caught.
- **3.6** Given a word only contains a blocked word inside it (for example "neighborhood", "ownership", "tenant-ready roof"), then it is **not** blocked (whole words only; see test list).

**Test examples: these should PASS (post)**

| # | Comment | Why it passes |
| --- | --- | --- |
| P1 | "Gorgeous porch and I love the teal door." | About the house |
| P2 | "Needs a new roof but the bones look great." | About the house |
| P3 | "Best garden on the block." | About the house |
| P4 | "The neighborhood is so quiet and leafy." | "neighborhood" is not "neighbor" |
| P5 | "Huge family room windows." | "family room" is allowed |
| P6 | "A great family home with a big yard." | "family home" is allowed |
| P7 | "Craftsman details everywhere, 10/10." | About the house |
| P8 | "That turret is wild." | About the house |

**Test examples: these should FAIL (blocked)**

| # | Comment | Why it's blocked |
| --- | --- | --- |
| F1 | "The owners never mow the lawn." | Owners |
| F2 | "My neighbor says a creep lives here." | Neighbor, lives here, insult |
| F3 | "Tenants trash this place." | Tenants |
| F4 | "The guy who lives here is rude." | Person behavior |
| F5 | "Their kids are so loud." | Family / kids |
| F6 | "Whoever owns this has no taste." | Owner (owns) |
| F7 | "Sketchy people hang around here." | Profiling people |
| F8 | "What an idiot to paint it that color." | Insult |
| F9 | "The residents are never home." | Residents |
| F10 | "O W N E R S are lazy" | Spaced-out evasion |

**Known limits (stated up front):** a rule list can't understand meaning. It will miss clever wording and occasionally block a harmless comment. That is why V2 adds an AI check (PRD Appendix D). For the demo, this is expected and called out in the case study.

## 4. Snap a house, lite

**Story 4A.** As a Sidewalk Scout on a phone, I want to take a photo of a house and attach it to the right home.

- **4.1** Given I'm on a phone, when I open Snap, then I can take a photo with the camera or pick one from my photo library.
- **4.2** Given I'm on a laptop, when I open Snap, then I can upload an image file or tap "Use a sample photo".
- **4.3** Given I've chosen a photo, when the next step shows, then it asks me to pick the house.

**Story 4B.** As a user, I want to pick the right house easily.

- **4.4** Given I allow location, when I choose a house, then I see the 5 nearest homes (street block and a mini drawing) and can tap one.
- **4.5** Given I deny or don't have location, when I choose a house, then I use an address search box instead, and the experience is not broken.
- **4.6** Given I allowed location, then I can also switch to address search at any time.
- **4.7** Given I picked a home using location, then my exact location is used only to sort nearby homes, and is never saved or logged.

**Story 4C.** As a privacy-minded user, I want photos to be safe to share.

- **4.8** Given I picked a photo, when it's processed, then it is redrawn through a canvas and shrunk to at most 1200 px on its longest side. This removes GPS and other hidden photo data.
- **4.9** Given I'm about to save, then I see "No people or license plates" and must confirm before the Save button works.
- **4.10** Given I confirm, when I tap Save, then the photo is stored in IndexedDB on this device only, and a `photo_uploaded` event is logged.
- **4.11** Given a photo is saved for a home, then it shows on that home's page and becomes its cover (illustration until then).
- **4.12** Given I tap "Reset demo", then saved photos are deleted too.
- **4.13** Given the file isn't an image, or is too large to read, then I see a clear message and can try again.

## 5. Top screen

**Story 5.** As a visitor, I want to see the best homes, so I can see what the community likes.

- **5.1** Given I open Top, then I see a **Top rated** list: homes with an average of 4.5 or more and at least 3 ratings (the gold rule), best first.
- **5.2** Given fewer than 3 ratings exist on a home, then it is not in Top rated, even with a 5.0 average.
- **5.3** Given I open Top, then I see **Hot this week**: homes with the most ratings and comments in the last 7 days, using the same rule as the flame pin on the map.
- **5.4** Given I open Top, then I see one **Home of the week** card at the top, using the same rule as the crown pin on the map.
- **5.5** Given a section has no homes yet, then it shows a friendly empty state ("Rate a few homes to see the top list").
- **5.6** Given I tap any home, then its home page opens.

## 6. Profile

**Story 6.** As a user, I want to see what I've done, so I feel progress and can come back to it.

- **6.1** Given I open Profile, then I see my handle, karma and homes rated (already working).
- **6.2** Given I've posted comments, then Profile lists my comments, newest first, with the home's block address; tapping one opens that home.
- **6.3** Given I have no comments, then I see an empty state with a link to the feed.
- **6.4** Given I've rated, commented, liked or snapped, then Recent activity lists my last 10 actions with relative times ("2 min ago").
- **6.5** Given I look at Badges, then I see a row of locked placeholders with a lock icon, a name and how to earn them (for example "Rate 25 homes"), clearly marked "Coming soon". No badge unlocks in the demo.
- **6.6** Given Profile also holds "Reset demo" and "Show Try this guide", then they are in a clearly separate "Demo" section.

## 7. Event logging and /stats

**Story 7.** As the product owner, I want the PRD's events logged and visible, so the metrics are real, not just a table.

- **7.1** Given I use the app, then these events are saved to localStorage (`hs.events`): `app_opened`, `home_viewed` (with source: feed, map, search, top), `rating_submitted`, `comment_posted`, `comment_edited`, `comment_deleted`, `like_given`, `photo_uploaded`, `comment_blocked`, `theme_changed`. `report_filed` is not built because there is no report button in the demo.
- **7.2** Given an event is logged, then it stores name, time, handle and the fields in the PRD table, and never comment text, photo data or location.
- **7.3** Given storage is blocked or full, then logging fails quietly and the app keeps working.
- **7.4** Given the log gets long, then it keeps the most recent 2,000 events.
- **7.5** Given I open `/stats`, then I see daily counts for each event over the last 14 days.
- **7.6** Given I open `/stats`, then I see the **north-star metric**: ratings per active user per week (an active user is a handle with any event that week), for this week and the previous weeks.
- **7.7** Given I'm the only user on this device, then `/stats` says so ("Demo data: one visitor, this device only") so no one mistakes it for real traffic.
- **7.8** Given I tap "Reset demo", then events are cleared as well.
- **7.9** Given I'm on a phone, then `/stats` is readable without sideways scrolling.
- **7.10** Given `/stats` is not in the tab bar, then it's reachable from a link in Profile.

## 8. Sample comment tag

**Story 8.** As a visitor, I want to tell sample comments from my own, so I know what's seeded.

- **8.1** Given a comment is seeded sample data, when it shows on a home page, then it has a small "sample" tag; my own comments never do.
- **8.2** Given the tag shows, then it is readable in light and dark mode on phone and laptop sizes.

---

## 9. Rate before you comment

**Story 9.** As a visitor, I want every comment to come with a rating, so comments are tied to an opinion about the house and the rating count is never lower than the comment count.

The rule: a home has three actions. **Skip** (no rating, no comment), **Rate it and go on to Next**, and **Rate it and comment**. A new top-level comment needs a star rating on that home. Replies and edits are exceptions.

- **9.1** Given I have not rated a home, when I look at its comment box, then Post comment is unavailable (marked unavailable to screen readers, still reachable by keyboard) and the line "Rate this home to leave a comment." shows under the box, announced as a status message. The stars are on the same screen above it.
- **9.2** Given I have not rated the home, when I tap Post comment with text typed, then nothing is saved and my text stays.
- **9.3** Given the line is showing, when I pick a star, then Post comment becomes available right away, the line goes away, and my typed text is still there.
- **9.4** Given I have already rated the home (now or earlier), when I open it, then the comment box is open with no line and Post works.
- **9.5** Given I have not rated a home, when I reply to someone else's comment, then Reply works with no rating needed.
- **9.6** Given I edit or delete my own comment, then no rating is needed.
- **9.7** Given I am on Surf, then Skip never saves a rating or a comment, Next needs a rating, and Comments opens the home; if I have rated it the comment box is ready to type in, and if I have not it shows 9.1. There is no path that saves a comment without a rating.
- **9.8** Given the Try this guide, then its wording matches the rule: "Rate 3 homes" and "Rate a home, then comment on it".

---

## Written deliverables (docs only, no code)

**D1. PRD Appendix G, "Path to a real launch."**
- **D1.1** Given I open `docs/01-prd.md`, then Appendix G covers three stages (Queen Anne to 10 Seattle neighborhoods, then all of Seattle, then King County).
- **D1.2** Given each stage, then it covers data pipeline changes, map performance (clustering, loading by area), the V2 database and logins, moderation, and a rough monthly cost.
- **D1.3** Given costs appear, then they are labeled as estimates, not quotes.

**D2. STATUS.md and DECISIONS.md**
- **D2.1** Given the work is done, then STATUS.md lists what changed, what's left, and **5 specific UI polish ideas** for a later pass.
- **D2.2** Given the demo decision, then DECISIONS.md records it with the why.

## Out of scope for this round

UI polish (listed in STATUS.md instead), real logins, a database, shared data between visitors, a report button, AI moderation, photo content checks (only the user confirmation), badges that unlock.

## Decisions from review (Nov 22, 2026)

1. The Try this guide shows a hint for the moderation item (AC 2.7).
2. Sample comments carry a small "sample" tag (AC 8.1).
3. `/stats` is linked from Profile (AC 7.10).
