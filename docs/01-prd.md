# House Surfer PRD

Nov 15, 2026 · Ryan Kelsey

## Overview

**House Surfer** is a mobile-first social app for rating houses: you swipe through homes in your neighborhood, give them 1 to 5 stars, and leave short comments that others like and reply to. Think Yelp-style ratings with Reddit-style threads, but for houses. In the case study it's pitched as **Zillow Surfer**, a concept for turning casual listing browsers into a community.

|  |  |
| --- | --- |
| **Who it's for** | People who browse homes for fun, on the couch or on a walk with friends |
| **Core loop** | See a house, rate it, read or add a comment, earn karma, come back |
| **V1 scope** | Queen Anne, Seattle; about 8,000 houses from King County public records |
| **V1 audience** | Ryan, then up to 10 invited friends |
| **One rule** | Talk about the house, never the people who live there |
| **Headline metric** | Ratings per active user per week |
| **Status** | Concept, clickable prototype and demo video done; working build next |

### Problem and opportunity

People love looking at houses, but home sites only give them something to do when they're buying or renting. Casual browsing is huge ("Zillow surfing" is a hobby), yet it's a solo, passive scroll. The fun part, reacting to homes, happens off-platform in group chats and meme accounts that share listing links.

**The opportunity:** give that energy a home. A light game layer (rate, react, earn points) turns a one-time visit into a habit, and it keeps people engaged between moves. For a listings company, that means:

- Users who are already active on the platform when they're ready to buy or rent.
- Local comments and photos that no competitor has.
- Early signal about which homes and blocks draw interest.

### Goals and non-goals

**Goals for V1 (proof of concept)**

1. Prove the core loop is fun: users rate several homes per session and come back within a week.
2. Show that a social layer on homes can stay friendly, with comments kept about the house.
3. Ship a working, mobile-first app on real public data that works in light and dark mode.
4. Produce a portfolio-ready case study with a live link, a repo and a demo video.

**Non-goals**

- Not a live public product. It's a portfolio POC for Ryan and up to 10 friends.
- No buying, selling, prices or agent leads.
- No comments about residents, owners or tenants, ever.
- No video, direct messages or follower feeds.
- No condos or apartment buildings in the first version.

## Success metrics

**North star: ratings per active user per week.** It captures the core loop directly: people coming back and rating houses.

| Type | Metric | Definition | POC target (10 friends, 4 weeks) |
| --- | --- | --- | --- |
| North star | Ratings per active user per week | Ratings divided by weekly active users | 20+ |
| Engagement | Weekly active users | Users with any event that week | 7 of 10 |
| Engagement | Comment rate | Share of ratings that also get a comment | 10%+ |
| Engagement | Home opens | Home pages opened, by source (feed, map, search) | Tracked |
| Engagement | Likes per comment | Likes received divided by comments | Tracked |
| Engagement | Photo uploads | Approved photos per week | 5+ |
| Retention | Day 7 return | Share of users back 7 days after first visit | 50%+ |
| Guardrail | Block rate | Share of comments and photos the screen stopped | Under 5% |
| Guardrail | Report rate | Reports per 100 comments | Under 2 |

Targets are starting guesses for a 10-person test, set to be revisited after week 1.

**Events logged**

| Event | Logged when | Key fields |
| --- | --- | --- |
| app\_opened | App opens | user, time, device |
| home\_viewed | A home page opens | home, source |
| rating\_submitted | Stars given or changed | home, stars, is\_edit |
| comment\_posted | A comment or reply posts | home, parent comment, has\_photo |
| comment\_edited / comment\_deleted | Owner edits or removes a comment | comment |
| like\_given | A comment is liked | comment |
| photo\_uploaded | A photo passes the screen | home |
| comment\_blocked | The screen stops a comment or photo | reason |
| report\_filed | Someone reports a comment | comment, reason |
| theme\_changed | Light or dark mode switched | theme |

## Personas and user stories

| Persona | Moment | What they want |
| --- | --- | --- |
| **Couch Surfer** | On the couch while the game is on, scrolling for fun | Quick, mindless rating, like a mobile game |
| **Sidewalk Scout** | Friday drinks with friends, walking the neighborhood | Snap a cute house and rate it on the spot |
| **Neighbor** | Lives in Queen Anne | Local pride, a say in how the block is seen |
| **Homeowner** (later) | Finds their house in the app | Show it off, or hide it |

**User stories (V1)**

- As a new user, I pick an anonymous handle so I can join without sharing my name.
- As a Couch Surfer, I swipe through houses one at a time and rate each 1 to 5 stars.
- As any user, I open a home to see its average rating, photos and threaded comments.
- As any user, I post a comment, reply to one, like one, and edit or delete my own.
- As a Sidewalk Scout, I snap a photo of a house I'm walking past; the app matches it by location and I rate it.
- As any user, I browse homes on a map and filter by top rated or unrated.
- As any user, I see my karma, homes rated and comments on my profile.
- As any user, I switch between light and dark mode.

## Product requirements

P0 ships in V1 (the proof of concept), P1 in V2, and P2 in V3 or later. See Milestones for level of effort.

| Priority | Area | Requirement |
| --- | --- | --- |
| P0 | Account | Sign in and pick a generated anonymous handle; no real names shown anywhere |
| P0 | Rating | Rate any house 1 to 5 stars; one rating per user per home, editable |
| P0 | Rating | Home shows its average and count, Yelp-style ("4.5 from 32 ratings") |
| P0 | Comments | Post a comment on a home; threaded replies; like a comment |
| P0 | Comments | Edit (marked "edited") or delete your own comments |
| P0 | Feed | One home at a time, rate then next; mobile-first layout |
| P0 | Map | Map with pins (green 4+ stars, orange hot this week, gray unrated) and a list view on web |
| P0 | Search and filter | Search by street; filter top rated, unrated, style tags |
| P0 | Photos | Upload a sidewalk photo; first approved photo becomes the cover; illustration until then |
| P0 | Safety | Every comment and photo is screened before posting; report button |
| P0 | Profile | Handle, one of 8 built-in house avatars, karma (private), homes rated, comments, recent activity |
| P0 | Points | Karma: +5 per rating, +10 per comment, +1 per like received (values to tune) |
| P0 | Theme | Light and dark mode, following the phone's setting with a manual switch |
| P0 | Metrics | Log every user action as an event (see Metrics) |
| P1 | Account | Real login for friends (email link, Apple or Google) |
| P1 | Social | Shared data across users; rate limits |
| P1 | Safety | Auto-hide at 3 reports; owner review queue |
| P1 | Points | Badges, earned automatically (the demo has six: First Steps, Block Walker, Good Neighbor Voice, Crowd Favorite, Curb Photographer, Surfer Elite). In V2 each person features one earned badge next to their username, and tapping a username shows a card of their earned badges only |
| P2 | Content | Street View image per home; more neighborhoods |
| P2 | Homeowner | Claim a home to reply as owner, or hide it |
| P2 | Discovery | Personalized "homes to rate next" |
| P2 | Points | Rename karma to something house-themed (later option; the name stays "karma" for now) |

### Trust, safety and privacy

The product rule is simple: **talk about the house, never the people who live there.** Every safety feature enforces that rule.

| Risk | Example | How the product handles it |
| --- | --- | --- |
| Harassing residents | "The guy who lives here is a creep" | Screen blocks comments about people before they post. House rules shown at sign-up. |
| Doxxing | Naming owners, posting when they're away | No owner or resident names anywhere, even though they're in public records. Addresses shown at block level ("2400 block of Warren Ave N"). |
| Profiling | "Sketchy people walk by here" | Screen blocks comments about who lives in or visits an area. |
| People in photos | Someone in the yard, a license plate | Photo screen rejects people and plates. Photos only from public sidewalks. |
| Pile-ons | A house goes viral for its ugly kitchen | Rate limits per home; owner hide option (P2). |
| Copyright | Reusing listing photos | Only user photos and illustrations. |

**Privacy:** users are anonymous. The app stores an opaque user id and a generated handle, never a real name, email in public view, or contact list. Users can delete their comments and photos at any time.

### Accessibility

**Target: WCAG 2.2 level AA** (the standard most legal and procurement checks use). Rule 6 already requires light and dark mode on every screen; this section adds what makes the app usable without a mouse, without perfect vision and without sound. The basics get built in the UI polish pass. Until an audit is done, the app is not claimed to meet the standard.

| Area | Requirement | Why |
| --- | --- | --- |
| Map and list | The list view is a full equal to the map: anything you can do from a pin (find a home, see its rating, open it) you can do from the list | A map is hard or impossible to use with a screen reader, a keyboard or a shaky hand |
| Pins | Pin tiers differ by **shape or icon, not only color** (for example hollow circle, filled circle, diamond, star, flame, crown). Today's flame and crown already do; gold, green and blue differ only by color | About 1 in 12 men have a color vision difference; color alone fails WCAG 1.4.1 |
| Stars | Each star button reads out as "Rate 4 of 5 stars"; the chosen rating is announced ("You rated this 4 of 5") | A row of unlabeled star icons is silent to a screen reader |
| Buttons and icons | Every icon-only button has a text label (Like, Reply, Close, Snap a house); toggles say whether they are on | Same reason |
| House drawings | Each drawing gets a short text description built from the data ("Illustration of a two-story Craftsman-era house, built 1924") | Drawings carry meaning; a blank image tells a screen reader user nothing |
| Keyboard | Every action works with the keyboard in a sensible order, with a **visible focus ring** in light and dark mode, and no keyboard traps (the map must be escapable) | Needed by keyboard and switch users, and by many laptop visitors |
| Tap targets | At least **44 px** wide and tall (WCAG 2.2 requires 24 px; 44 px is the safer mobile standard) | Thumbs, tremors and small phones |
| Motion | Respect the device's "reduce motion" setting: no sliding or bouncing animation when it is on | Motion can cause nausea or dizziness |
| Text and color | Text at least 4.5:1 contrast, controls and borders at least 3:1, in both themes; text still works at 200% zoom and 320 px wide; errors say what is wrong in words, not only color | Basic readability. Two contrast bugs (the reset button and the blocked-comment message) were already caught and fixed this way |
| Demo video | Captions on the demo video, plus a text summary of the walkthrough | Needed for deaf and hard-of-hearing viewers, and for people watching on mute |

**How we will check:** automated checks (a browser accessibility scanner) for the easy 30 to 40 percent, then by hand: keyboard only, a screen reader (VoiceOver on iPhone, NVDA on Windows), 200% zoom, and a contrast check in both themes. The result goes in the case study, including what is not yet fixed.

**Future feature: "Hear this house."** A button that reads a short spoken summary built from the home's data ("A three-bedroom, two-bath Craftsman-era house built in 1924, rated 4.2 from 12 ratings, with 5 comments"), using the browser's built-in speech. It helps people who can't see the drawing and people who like audio. It is generated from public data only and never mentions residents.

## Mockups

Mobile first, with a web layout for browsing at home. All homes, handles and comments are sample data. The clickable prototype and a 44-second demo video are in the project files (`zillow-surfer/prototype.html`, `zillow-surfer/house-surfer-demo.mp4`).

**Phone:** sign up, feed, home page, snap a house, map, profile.

[Image: Phone screens: sign up, feed, home page with a blocked comment, snap a house, map, profile]

**Web:** list on the left, map on the right.

[Image: Web view: home list beside a map of Queen Anne]

## Data

The data story has two halves: the evidence for building this, and the data the app itself runs on.

### Supporting data: why build this

The evidence is directional rather than hard numbers, which is exactly what V1 is meant to fix.

| Signal | What it suggests | Strength |
| --- | --- | --- |
| Browsing homes for fun is a known habit ("Zillow surfing"), covered as pandemic-era [doomscrolling relief](https://inman.com/2020/11/20/in-chaotic-times-zillow-becomes-the-solution-to-doomscrolling) | Large casual audience that isn't buying | Press coverage |
| [Zillow Gone Wild](https://realestatenews.com/2022/11/05/zillow-gone-wild-what-happens-when-your-listing-goes-viral) and TikTok genres about listings | People want to react to homes, socially | Observed behavior |
| Repeated launches of swipe and comment products (prior art below) | Builders keep seeing the same demand | Market pattern |
| Conversations with friends over the years | Anecdotal interest in a fun, social way to browse | Word of mouth |
| V1 test with 10 friends | First real numbers on the core loop | To be measured |

### Prior art

The idea has been tried in pieces for nearly 20 years. Swipe apps aimed at buyers, comment add-ons sat on top of listing sites, and Zillow itself has avoided open comments. Nobody has combined casual swipe rating, a social layer and the walking moment for people who aren't shopping.

| Product | What it did | Lesson for House Surfer |
| --- | --- | --- |
| [Zillow home discussions](https://www.inman.com/2007/04/04/zillow-opens-homes-online-discussion/) (2007) | Opened homes to online discussion | The idea is old; it didn't become core to the product |
| [Zillow SharePlay search](https://inman.com/2021/12/21/zillow-debuts-collaborative-shareplay-search-feature) (2021) and [Trulia boards](https://inman.com/2015/03/03/trulia-launches-collaborative-search-feature) | Browse homes together with friends | Looking at homes is social, but these stay private to a circle |
| [Zillow Gone Wild](https://realestatenews.com/2022/11/05/zillow-gone-wild-what-happens-when-your-listing-goes-viral) | Meme account for wild listings; not affiliated with Zillow | Proves demand for reacting to homes; its comments skew snarky, which is why moderation matters |
| [Doorsteps Swipe](https://www.producthunt.com/products/doorsteps-swipe), [Estately Flip](https://techcrunch.com/2014/08/21/estately-launches-flip-a-tinder-for-real-estate/amp/) (2014), [Casa Blanca](https://www.realhomes.com/news/casa-blanca-app-tinder-of-real-estate) (2020) | "Tinder for homes": swipe yes or no on listings | Swipe is fun, but each was built to generate buyer leads, not community |
| [HomeBuzz](https://chrome.google.com/webstore/detail/homebuzz-comment-on-real/gokijpcjnbdpolblfkbpgcjocmjlnopa), [House Reviews](https://chromewebstore.google.com/detail/dlpbldjicjnmjmplbhgpfclfkpmekchl/reviews?hl=en) | Browser add-ons for ratings and comments on listing sites | Bolted-on layers stay niche; the app needs its own home |
| [House Safari](https://inman.com/2016/10/17/rank-your-neighbors-on-their-homes-with-house-safari) (2016) | "Yelp for houses" from the street | Closest to the walking moment; ranking neighbors' homes raised the privacy questions this PRD's rules address |
| [Homely](https://apps.apple.com/app/id1004229463) (Australia) | Share, rate and comment on homes with friends; local suburb reviews | Good model for the friends-first stage |

**Why Zillow hasn't done it:** reporting suggests its agent customers wouldn't welcome negative comments on their listings ([Inman, 2020](https://inman.com/2020/11/20/in-chaotic-times-zillow-becomes-the-solution-to-doomscrolling)). House Surfer's answer is star ratings plus comments kept about the house, with a screen before anything posts.

### System data: what the app runs on

Rule: use only data that is public and free. Everything social (ratings, comments, photos, events) is created by users and stored in the app's own database, which also feeds every success metric.

All home data comes from free King County public records; Zillow and Redfin data isn't used because their terms don't allow reuse.

| Source | What it gives | Use |
| --- | --- | --- |
| King County Assessor downloads | Beds, baths, square feet, year built, building type, sale history | Home facts |
| King County GIS open data | Parcel locations | Map pins |
| OpenStreetMap | Map tiles | Base map, with attribution |
| Users | Ratings, comments, photos | Everything social |

**What counts as a house**

| Type | In the POC? |
| --- | --- |
| Single-family house (1 unit) | Yes |
| Duplex or triplex (2 to 3 units) | Yes, tagged |
| Townhouse | Yes if recorded as residential |
| Condo | No |
| Apartment building (4+ units) | No |

Queen Anne has roughly 8,000 qualifying houses; the exact count and field names get confirmed during the data pull.

## System design

[System design diagram: see the PRD doc or docs/system-design.png]

In V1 the app is a static site: GitHub Pages serves it through its CDN, and ratings and comments save on the device. V2 adds Supabase behind an API gateway, which handles load balancing for us, so there's no separate load balancer or servers to run. A small function orchestrates moderation by sending each comment and photo to Claude before it saves.

**Security by version**

| Version | Security |
| --- | --- |
| V1 | No accounts; nothing leaves the device except the static app download |
| V2 | Login with email link, Apple or Google; every request carries a login token; row-level security so users can only edit their own rows; photos private until screened; rate limits |
| V3 | Two-factor authentication; 18+ terms and a privacy policy; account deletion on request |

## Milestones and level of effort

V1 is the proof of concept: everything needed to test the core loop, and nothing more. Later milestones stay loose on purpose, so the team can pick quick wins or bigger pieces as time allows.

Level of effort assumes building with Claude: **S** = under one working session, **M** = 1 to 2 sessions, **L** = 3 or more.

### V1: proof of concept (Ryan, single-player)

**Status (Nov 15, 2026):** steps 1 to 5 and the deploy shipped and are live at [rkelsey15.github.io/house-surfer](https://rkelsey15.github.io/house-surfer/). Snap a house, moderation, profile and event logging are next. As-built changes are in Appendix A.

| Capability | Effort |
| --- | --- |
| Data pipeline: King County files to `homes.json` (Queen Anne houses only) | M |
| Anonymous handle and house rules at sign-up (saved on the device) | S |
| Feed: one home at a time, 1 to 5 stars, next | S |
| Home page: average rating, threaded comments, likes, edit and delete | M |
| Map and list, search by street, filters | M |
| Photo upload from the camera (stored on the device) | S |
| Basic moderation: rule-based block on comments about people | S |
| Profile with karma, homes rated, comments | S |
| Light and dark mode | S |
| Event logging and a simple counts page | S |
| Hosted free on GitHub Pages | S |

### V2: friends (up to 50)

**V2 is a design exercise, not a build.** This portfolio stays a free, single-player V1. V2 is fully specified in Appendix C to D (database choice, schema, APIs, security) so it's ready if the project ever needs real users, without paying for hosting now.

| Capability | Effort |
| --- | --- |
| Real login (email link, Apple or Google) | M |
| Shared database with per-user permissions | M |
| Photo storage in the cloud | S |
| Claude moderation on every comment and photo | M |
| Report button, auto-hide at 3 reports, review queue | S |
| Rate limits | S |
| Badges earned from real activity: Crowd Favorite (likes from other surfers) and Surfer Elite (needs other real users) unlock here; they stay locked in the demo | M |
| Feature one earned badge next to your username | S |
| Username card: tap a username to see that person's earned badges only (no karma, no locked badges) | S |
| Built-in avatar set grows from 8 to about 20 house avatars | S |

### V3: security and scale (up to 100)

| Capability | Effort |
| --- | --- |
| Two-factor authentication | M |
| Homeowner claim or hide | M |
| Street View image per home | M |
| Second neighborhood (pipeline re-run) | S |
| Metrics dashboard | M |
| 18+ terms and privacy policy | S |

### Future ideas (not committed)

| Capability | Effort |
| --- | --- |
| Personalized "homes to rate next" from your ratings, comments and badges (V5) | L |
| Business rules, such as rating 20 homes before you can post comments | S |
| Rename karma to something house-themed, such as "Curb Cred" (decided Nov 25: keep "karma" for now) | S |
| Spend karma on "super likes" (idea only; karma stays private) | M |
| Surfer Elite changes color by year ("Elite '27") | S |
| Profile photo upload (later V2 item, **not planned for the demo**). Needs: image moderation (faces, inappropriate content), safe storage, size limits, a report path, and a check against the anonymous-handle rule | L |
| "Hear this house": a spoken summary built from the home's data (see Accessibility) | S |
| "Guess the price" game on recently sold homes | M |
| Native iPhone and Android apps | L |

### Scaling by stage

Each stage adds only what the next group of users needs. The real architecture jump is at V2, when the app needs shared data and real logins.

| Stage | Users | What ships | Login | Moderation | Rough cost |
| --- | --- | --- | --- | --- | --- |
| V1 on your computer | 1 (Ryan) | Full P0 app on Ryan's computer, data saved in the browser | None needed | Screen on comments and photos | $0 |
| V1 live link | 1 to 10 | Same app on GitHub Pages; demo video and case study | None yet (single-player per device) | Same | $0 |
| V2 friends | Up to 50 | Supabase for logins, shared ratings and comments, photo storage | Email link, Apple or Google | Screen, auto-hide at 3 reports, review queue | About $0 to $25 a month |
| V3 small beta | Up to 100 | Badges, Street View, a second neighborhood, metrics dashboard | Same, plus 18+ terms and a privacy policy | One or two volunteer moderators | About $25 to $50 a month |

Costs are estimates for typical free and starter tiers, not quotes.

### Map at city scale (future, not built)

Today the map draws every Queen Anne house (about 5,400 pins) on one canvas, which is fine for one neighborhood. A whole city has hundreds of thousands of homes, so the map has to stop drawing every pin at once. These are ideas for a later stage, **not built and not scheduled**:

- **Pin clustering.** When zoomed out, nearby pins merge into one numbered bubble ("312"). Tap it or zoom in and the bubble splits into smaller bubbles, then single pins. The number is a count of homes, so it works for people who can't tell pin colors apart. The pin filter chips (built) would apply before the clustering, so a bubble counts only the homes that are switched on.
- **Neighborhood picker.** A list or search box ("Queen Anne", "Ballard", "Capitol Hill") that jumps the map to that area, so nobody has to pan across a city. It needs a small file of neighborhood names and outlines.
- **"Search this area" button.** After you pan or zoom, a button appears; tapping it loads only the homes inside the visible map box (a request by bounding box, for example from a database with a spatial index). The app then never has to download the whole city's `homes.json`. This is the point where the data moves from a static file to the V2 database.
- **Heat map when far out.** Past a certain zoom, show a smooth color wash (average rating or number of ratings per area) instead of bubbles, then switch to bubbles and pins as you zoom in. Only worth it if clustering alone still feels cluttered.

Not decided: whether clustering runs in the browser (fine up to tens of thousands of pins) or on the server (needed at city scale), and which map library handles it. The List view stays the full, screen-reader-friendly alternative to the map at any scale.

## Risks and open questions

| Risk | Mitigation |
| --- | --- |
| Novelty wears off after a few sessions | Karma, badges and "hot this week" give reasons to return; measure day 7 return |
| Moderation misses a harmful comment | Screen plus reports plus owner removal; start with trusted friends |
| Too few users for it to feel social | Seed comments and photos during stage 1; invite friends in one batch |
| Photo location matches the wrong house | Let users confirm or pick from nearby homes |
| County data fields differ from what's planned | Confirm in the data pull before building the UI on it |
| Brand confusion | "Zillow Surfer" appears only in the case study pitch; the app is House Surfer |
| Profile photos break the anonymous-handle rule (a face or a name in a photo identifies a person) | Built-in house avatars only in V1 and the demo; photo upload waits for image moderation (faces, inappropriate content), safe storage, size limits and a report path, and is checked against the anonymous-handle rule before it ships |
| Karma becomes a status contest, or invites gaming | Karma is private: other surfers never see it. Public recognition comes from earned badges instead; a "super likes" spend is an idea only, not committed |
| Badges that need other people (Crowd Favorite, Surfer Elite) cannot be tested in a one-person demo | They stay locked in the demo and say "Needs other surfers (V2)"; the rules are written down in V2 and get tested once there are real users |
| A featured badge or username card reveals more than the person intended | The card shows earned badges only: no karma, no locked badges, no activity history; the featured badge is the person's own choice |

**Open questions**

- [x] ~~What should karma be called?~~ Decided Nov 25: keep "karma" for now (Reddit-familiar); a rename such as "Curb Cred" is a later option
- [x] ~~Which badges make the first set?~~ Six, built in the demo; four can be earned there, two wait for other users (V2)
- [ ] Which image moderation approach for profile photos, if upload is ever built? (faces and inappropriate content; later V2, not planned for the demo)
- [ ] Go to stage 3 (real logins for friends), or stop at the live single-player link?
- [ ] Which neighborhood is second?

**Links**

- [Concept doc](https://claude.ai/artifact/XxbV69bzVhUDDLEtcz7mUS): earlier exploration and decision history
- Clickable prototype and demo video: `zillow-surfer/prototype.html` and `zillow-surfer/house-surfer-demo.mp4` in the project files

# Appendix: technical detail

The body of this PRD stays high level. This appendix plays the role of the engineering design doc: how V1 was actually built, and how V2 would be built. It's for engineers and curious reviewers.

## A. What V1 shipped vs the plan

V1 matched the plan, with nine changes made while reviewing each step. Each one came from looking at real output.

| Area | Plan | As built | Why |
| --- | --- | --- | --- |
| Home count | About 8,000 | 5,391 houses (6,720 with townhouses) | The estimate was a guess; the count comes from county land-use codes inside Seattle's official Queen Anne boundary |
| Townhouses | Not mentioned | Kept in the data, hidden by a feature flag (`showTownhouses`, off) | Houses-only launch, with townhouses ready as a one-line change |
| Map pins | Exact location | Blurred 25 to 50 m (about half a block) | Exact pins would undo the block-level address rule; exact points are never stored |
| Style tag | Architectural style | Era tag from year built (Victorian era, Craftsman era, Pre-war, Mid-century, Late century, Modern) | County data has no style field |
| Pictures | Illustrations | Generated drawings that vary by era, units and home id | No listing photos allowed; users' photos come in step 6 |
| Wording | "Takes" | "Comments" | Clearer for first-time users |
| Replies | Threaded | One level deep in the UI; the data supports any depth | Deep threads get cramped on phones |
| Delete | Remove the comment | Soft delete (`deleted_at`); shows "\[deleted\]" if it has replies | Keeps replies and history intact |
| Pin colors | Green, orange, gray | Hollow gray = unrated, blue = under 3.5, green = 3.5 to 4.4, gold = 4.5+ with 3+ ratings, flame = hot, purple crown = home of the week | Gold has to be earned; red and orange read as "bad" |

The app also locks the handle after sign-up, and git commits use a GitHub noreply address so no personal email is public.

## B. V1 data model as built

V1 has one read-only data file and a few tables kept in the visitor's browser. The browser tables use the same shape V2's database would, so moving to a server is a copy, not a redesign.

**Home data (read-only file, built once by the pipeline):** `public/data/homes.json`

| Field | Example | Notes |
| --- | --- | --- |
| id | a hash | Not the county parcel number |
| address | 2400 block of Warren Ave N | Block level; numbers under 100 show as "0–99 block" |
| lat, lng | 47.63, −122.35 | Blurred about half a block |
| beds, baths, sqft, year\_built | 3, 1.75, 1,840, 1950 | From the Assessor's residential building file |
| era | Mid-century | From year built |
| type, units | single-family, 1 | Duplex = 2, triplex = 3, townhouse flagged |
| last\_sale\_year | 2019 | Year only; no price, no buyer or seller names |

**User data (browser storage, per visitor):**

| Table | Columns | Rules |
| --- | --- | --- |
| ratings | home\_id, user, stars, created\_at | One per user per home; re-rating replaces it |
| comments | id, home\_id, parent\_id, user, body, created\_at, edited\_at, deleted\_at | `parent_id` empty = top-level, otherwise a reply; 280 characters max |
| comment\_edits | comment\_id, old\_body, edited\_at | One row per edit, so history is kept |
| likes | comment\_id, user, created\_at | One per user per comment; can't like your own |
| photos (step 6) | home\_id, image, created\_at | Stored in IndexedDB, the browser's larger store |
| events (step 9) | name, home\_id, at | Feeds the metrics and the /stats page |

**Computed, never stored:** average rating, like counts, karma (5 per rating + 10 per comment + 1 per like received), hot homes and the home of the week. Computing them from rows means they can't drift out of sync.

## C. V2 database: SQL vs NoSQL

**Decision: SQL (Postgres, hosted on Supabase).** House Surfer's data is a web of relationships (homes have ratings and comments, comments have replies, edits and likes), and its rules are about uniqueness and permissions. A relational database enforces those for free.

| Need | SQL (Postgres / Supabase) | NoSQL (Firestore / MongoDB) |
| --- | --- | --- |
| One like per user per comment | A unique key; the database refuses a duplicate | Must be enforced in app code or by special document ids |
| Counts (likes, ratings, comments per home) | One query with `count` and `group by` | Keep a running counter on each document and update it on every write |
| Threads (`parent_id`) | A recursive query returns a whole thread | Fine for one level; deeper trees need extra reads |
| "Users can only edit their own comments" | Row-level security policies in the database | Security rules, similar strength |
| Analytics (most-commented homes, edit rate) | Plain SQL any analyst can write | Needs an export to a warehouse first |
| Real-time updates and offline phones | Available (Supabase Realtime) | Stronger out of the box |
| Cost at 10 to 100 users | Free tier | Free tier; pay per read later |

NoSQL would win for a chat app or a feed with no joins. For ratings, threads and likes, SQL fits better, and the analytics questions in the Success metrics section become one-line queries.

**V2 schema (sketch):**

```sql
create table homes (id text primary key, address_block text, lat float, lng float,
  beds int, baths numeric, sqft int, year_built int, era text, units int);
create table profiles (user_id uuid primary key references auth.users,
  handle text unique not null, created_at timestamptz default now());
create table ratings (home_id text references homes, user_id uuid references profiles,
  stars int check (stars between 1 and 5), created_at timestamptz default now(),
  primary key (home_id, user_id));
create table comments (id uuid primary key default gen_random_uuid(),
  home_id text references homes, parent_id uuid references comments,
  user_id uuid references profiles, body text check (length(body) <= 280),
  created_at timestamptz default now(), edited_at timestamptz, deleted_at timestamptz);
create table comment_edits (id bigserial primary key, comment_id uuid references comments,
  old_body text, edited_at timestamptz default now());
create table likes (comment_id uuid references comments, user_id uuid references profiles,
  created_at timestamptz default now(), primary key (comment_id, user_id));
create index on comments (home_id);
create index on comments (parent_id);
```

The composite primary keys on `ratings` and `likes` are what enforce "one per user."

## D. V2 APIs and how the pieces connect

The app stays a static site on GitHub Pages. It talks to Supabase over HTTPS, and Supabase generates a REST API from the tables, so there's no custom server to run. One small server function handles moderation, because it holds the Claude API key, which must never ship to the browser.

| Action | Call | Who can do it |
| --- | --- | --- |
| Sign in | Supabase Auth: email link, Apple or Google | Anyone |
| Load homes | Read `homes.json` from GitHub Pages (static, cached) | Anyone |
| Load a home's ratings and comments | `GET /rest/v1/comments?home_id=eq.{id}` and a ratings summary view | Anyone |
| Rate a home | `POST /rest/v1/ratings` (upsert) | Signed-in user, own row only |
| Post a comment or reply | `POST /functions/v1/moderate` → Claude check → insert into `comments` | Signed-in user, rate-limited |
| Edit a comment | Same moderation function; old text copied to `comment_edits` | The author only |
| Delete a comment | `PATCH comments` to set `deleted_at` | The author only |
| Like or unlike | `POST` or `DELETE /rest/v1/likes` | Signed-in user, not on own comment |
| Upload a photo | Supabase Storage, then the moderation function checks it before it shows | Signed-in user |
| Report | `POST /rest/v1/reports`; 3 reports auto-hide pending review | Signed-in user |

**Posting a comment, step by step:**

1. The app sends the text and the user's sign-in token to the `moderate` function.
2. The function checks the rate limit, then runs the rule-based filter, then asks Claude: "Is this about the house, or about the people who live there?"
3. If it passes, the function inserts the row. If not, the app shows "Talk about the house, not the people who live there."
4. Other users see it on their next load (or instantly, with Supabase Realtime turned on).

**Load balancing and scale:** Supabase runs the API gateway, connection pooling and load balancing as part of the service, and GitHub's CDN serves the site and `homes.json`. At 10 to 100 users, nothing here needs tuning.

## E. Security and privacy details

Privacy is designed into the data first. Then permissions and moderation cover what people post.

| Layer | V1 (shipped or planned) | V2 design |
| --- | --- | --- |
| Data minimization | No owner names, sale prices or parcel numbers; block-level addresses; blurred pins | Same; `homes` stays a public, read-only file |
| Identity | Generated handle from curated word lists, locked after sign-up | Unique handle enforced by the database; rename once every 30 days |
| Permissions | Everything lives in the visitor's own browser | Row-level security: anyone reads; users write, edit and delete only their own rows |
| Moderation | Rule-based filter blocks comments about residents (step 7) | Rules + Claude check in a server function; report button; auto-hide at 3 reports |
| Abuse | Not needed for single-player | Rate limits per user (for example, 10 comments an hour) |
| Deleted content | Soft delete; stays in the visitor's browser | Text hidden from users, kept for moderation, cleared after 30 days |
| Secrets | None in the app | Claude API key lives only in the server function |
| Sign-in | None | Email link, Apple or Google; two-factor in V3 |
| Sample data | Marked "sample" on screen | Removed; likes on sample comments are dropped in the migration |

## F. Decision log

Newest first. Each entry is a call made by the product owner while reviewing the build.

| Date | Decision | Reason |
| --- | --- | --- |
| Nov 15, 2026 | V2 stays a paper design; no paid database | Portfolio goal is showing the thinking, at $0 |
| Nov 15, 2026 | Deploy before Snap a house | Phone camera and location only work on a real https site |
| Nov 15, 2026 | Pin colors: hollow gray, blue, green, gold (3+ ratings), flame, purple crown | Earned gold; no red; easy to tell apart |
| Nov 15, 2026 | Handles generated only, locked after sign-up | Makes slurs and real names impossible instead of filtering them |
| Nov 15, 2026 | Soft delete with `deleted_at` | Keeps replies and history |
| Nov 15, 2026 | Comments data model: `parent_id` threads, edit-history table, likes table | Stable ids for likes and replies; counts computed, not stored |
| Nov 15, 2026 | "Takes" renamed to "comments" | Clarity for new users |
| Nov 15, 2026 | Townhouses behind a feature flag | Keep the data, launch houses-only |
| Nov 15, 2026 | Blur pins about half a block; no exact points stored | Match the block-level address rule |
| Nov 15, 2026 | Git commits use a GitHub noreply email | Public repo; protect personal email |
