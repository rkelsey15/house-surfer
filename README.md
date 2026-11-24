# House Surfer

Rate houses on a walk with friends or from the couch. A mobile-first social app where you give homes 1 to 5 stars and leave short comments others can like and reply to. Built with Claude Code as a product portfolio project.

- Product requirements: [docs/01-prd.md](docs/01-prd.md)
- Clickable design prototype: [design/prototype.html](design/prototype.html) (download and open in a browser, then press Play demo)
- Demo video: [design/demo.mp4](design/demo.mp4)

## For engineers

New here? Read in this order: this README, then [docs/STATUS.md](docs/STATUS.md) (where the project is now), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (the map of the code and the data shapes), the PRD and acceptance criteria ([docs/01-prd.md](docs/01-prd.md), [docs/02-user-stories.md](docs/02-user-stories.md)), then [docs/DECISIONS.md](docs/DECISIONS.md) (why things are the way they are).

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**: how the code is organized, how data flows, where each feature lives, and how to rebuild it elsewhere.
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)**: install, run, test, build, make a change on a branch, open a pull request, and the project rules.

Quick start: `npm install`, then `npm run dev` to run it and `npm test` to test it.

Home data comes from free King County public records. All ratings, comments and handles in demos are sample data. One rule: talk about the house, never the people who live there.

## Deploying

Pushing to `main` publishes the site to https://rkelsey15.github.io/house-surfer/ through `.github/workflows/deploy.yml`. One-time setup: in the repo go to Settings > Pages and set Source to "GitHub Actions".
