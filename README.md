# DSA Metro

Learn data structures and algorithms from zero to dynamic programming, laid out as a metro map.

**Live site:** https://harshdeepsingh888-ps.github.io/dsa-metro/

- **18 stations on 4 lines**, Big-O to DP. Each has a story, an interactive demo, C++ and Python code, a quiz and LeetCode practice.
- **DP table games**: fill in Climbing Stairs, House Robber, Coin Change, Grid Paths, LCS and Knapsack tables cell by cell, with hints after a wrong guess and a step-by-step "Show me" mode.
- **Study guide**: beginner, intermediate and advanced levels with LeetCode, Codeforces, CSES and AtCoder problems, company-style question sets, a season plan to placements, and a 3/7/30-day revision list.
- **XP, ranks, streaks** and a **day/night theme**.

## Tech

Next.js (App Router) with TypeScript and React, exported as a static site and deployed to GitHub Pages by GitHub Actions on every push to `main`.

- Station pages are generated at build time (`generateStaticParams`), so every station has its own URL.
- Content lives in typed data modules (`lib/stations.ts`, `lib/guide.ts`); code snippets are syntax-highlighted at build time.
- Each demo is a client component under `components/viz/`, loaded only on its own station. The DP games share one `DPTable` component.
- Progress is kept in `localStorage` through a React context (`components/ProgressProvider.tsx`) and stays in sync across tabs.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` writes the static site to `out/`.

## Layout

```
app/                 pages: home, /stations/[id], /guide
components/          header, progress store, station parts, guide
components/viz/      the 18 interactive demos
components/viz/dp/   the DP table game and the six DP stations
lib/                 content, progress rules, highlighting
legacy/              the original single-file version
```
