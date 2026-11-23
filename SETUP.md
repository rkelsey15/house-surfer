# House Surfer: setup in 4 parts

About 15 minutes. You only do this once.

## Part 1: Make the repo on GitHub

1. Go to github.com and sign in.
2. Click the **+** in the top right, then **New repository**.
3. Repository name: `house-surfer`. Choose **Public**. Tick **Add a README file**. Click **Create repository**.

## Part 2: Put it on your computer

Your blog project lives in `C:\dev`, so we'll put this one right next to it.

4. In VS Code, open the **Terminal** panel at the bottom (menu **Terminal > New Terminal**).
5. Type each line and press Enter after each:

```
cd C:\dev
git clone https://github.com/rkelsey15/house-surfer.git
```

You now have a folder at `C:\dev\house-surfer`.

## Part 3: Add the starter files

6. Unzip `house-surfer-starter.zip` (right-click, **Extract All**).
7. Open the unzipped `house-surfer-starter` folder, select everything inside it, and copy it into `C:\dev\house-surfer`.

The folder should now hold `CLAUDE.md`, `SETUP.md`, `docs`, `design` and `README.md`.

## Part 4: Open VS Code and start Claude

8. In VS Code: **File > Open Folder**, pick `C:\dev\house-surfer`, click **Select Folder**. If it asks whether you trust the authors, click **Yes**.
9. In the right-hand panel, click the **Claude Code** tab (not **Chat**, which is a different assistant). Click **New Session**. Sign in if asked.
10. Paste this as your first message:

```
Read CLAUDE.md and docs/01-prd.md, and open design/prototype.html to see the design.
Give me a short V1 plan in plain English, check that Node.js and Git work,
then start with step 1: the King County data pipeline.
Explain each step simply before you do it.
```

You don't need to copy our planning chat. `CLAUDE.md` and `docs/01-prd.md` are that chat boiled down, and Claude Code reads `CLAUDE.md` automatically every session.

## Later: turn on GitHub Pages (when Claude says the app is ready)

11. On GitHub, open your `house-surfer` repo and click **Settings**, then **Pages** in the left menu.
12. Under **Build and deployment > Source**, choose **GitHub Actions**. That's the only switch.
13. Ask Claude to push. The first push may open a browser window asking you to sign in to GitHub; click **Authorize**.
14. After about 2 minutes, the **Actions** tab shows a green check, and the app is live at `https://rkelsey15.github.io/house-surfer/`.

Note: a public repo means anyone can see the code and docs. That's normal for a portfolio, and everything in it is public data or sample data.
