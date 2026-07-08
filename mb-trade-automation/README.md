# MultiBank Trade Platform — UI Automation Framework

Playwright + TypeScript framework covering navigation, spot trading, marketing
content, and edge cases on the public `trade.mb.io` platform (no login/PII
involved anywhere in this suite).

## ⚠️ Important — please read before running

This solution was built in an environment that could **not** interactively
load `trade.mb.io` (automated fetch access to that domain is blocked at the
network level for this tool). That means:

- The framework, architecture, POM design, fixtures, CI, and assertion
  strategy are complete and production-shaped.
- The exact selectors (nav item labels, category names, section headings,
  API endpoint pattern) are **best-effort placeholders** based on the task
  description, written to be resilient (role/text-based) rather than
  brittle CSS, but they have **not** been hand-verified against the live DOM.
- Every place that needs a 5–10 minute verification pass against the real
  site is marked `TODO(verify)` in `fixtures/testData.ts`, or documented in
  the header comment of `config/selectors.ts`.

**To finalize:** run `npm run codegen`, click through the flows described
below, and update `config/selectors.ts` / `fixtures/testData.ts` with the
real values. No test logic needs to change — only the data/selector layer.

## Architecture

```
config/selectors.ts     → single source of truth for locators (DOM-coupled)
fixtures/testData.ts    → single source of truth for expected values (content-coupled)
pages/                  → Page Object Model, one class per logical page/region
utils/fixtures.ts       → wires page objects into Playwright's test fixture
tests/
  navigation/           → nav rendering, links, viewport behavior
  trading/              → spot trading listing, categories, row data, API contract
  content/              → banners, app store/play links, About Us > Why MultiBank
  edge-cases/           → invalid routes, broken links, mobile viewport, timeouts
```

**Why this split:** selectors and expected content are the two things most
likely to drift as the site changes. Isolating them means a copy change or a
markup refactor touches one file, not every spec. Page Objects encapsulate
*how* to interact with a page; specs encode *what should be true* — specs
stay readable as executable requirements, not DOM plumbing.

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Running

```bash
npm test                    # all projects (desktop chrome, firefox, mobile)
npm run test:desktop        # desktop chrome only
npm run test:mobile         # mobile viewport specs only
npm run test:navigation     # single scenario group
npm run test:headed         # watch it run
npm run report               # open the last HTML report
```

Target a different environment without touching code:

```bash
BASE_URL=https://staging.trade.mb.io npm test
```

## Scenario coverage

| Area | Spec file | Notes |
|---|---|---|
| Nav renders + links correct | `tests/navigation/navigation.spec.ts` | role-based lookup, not CSS classes |
| Desktop viewport behavior | same file | 1440×900 and 1280×800 projects |
| Spot trading renders + pairs | `tests/trading/trading.spec.ts` | bounded sample (10 rows) for speed/determinism |
| Pair categories | same file | soft-overlap match against known categories, logs actual list on failure |
| Pair row data fields | same file | symbol/price required non-empty; change/volume presence checked |
| Marketing banners | `tests/content/content-links.spec.ts` | asserts visible + positioned above the fold |
| App Store / Google Play links | same file | asserts href pattern **and** resolves via HTTP request (not just click) |
| About Us > Why MultiBank | same file | heading + section text presence, soft-match on known section titles |
| Invalid route handling | `tests/edge-cases/invalid-route.spec.ts` | accepts either server 404 or SPA-rendered not-found state |
| Broken link detection | `tests/edge-cases/broken-link-detection.spec.ts` | crawls all nav hrefs, asserts none return 4xx/5xx |
| Mobile viewport regression | `tests/edge-cases/mobile-viewport-regression.spec.ts` | 390×844, checks for horizontal overflow specifically |
| Content loading timeout | `tests/edge-cases/content-loading-timeout.spec.ts` | bonus — asserts bounded wait + graceful degradation under slow network |
| API contract | `tests/trading/api-validation.spec.ts` | bonus — validates the JSON backing the pair list, not just rendered DOM |

## Design decisions worth calling out

- **Role/text-first locators over CSS**, per Playwright best practice —
  survives styling refactors, matches what a real user perceives.
- **`networkidle` is treated as best-effort, not required** in
  `BasePage.waitForStableLoad` — trading platforms often hold live
  websocket/price-feed connections open, so networkidle may never fire.
  Blocking on it would make otherwise-passing tests flaky/slow.
- **Soft-overlap assertions for content that may get copy-edited** (category
  names, section headings) — fails clearly if there's zero overlap with
  known values (a real regression signal) while tolerating a marketing
  team renaming one category without breaking the whole suite. The full
  actual list is always included in the failure message for fast triage.
- **Broken link check uses `page.request`, not full navigations** — faster,
  and avoids false failures from client-side routing intercepting `goto()`.
- **No test creates an account, submits a form with personal data, or logs
  in**, per the brief.

## CI

`.github/workflows/playwright.yml` runs the full suite across three browser
projects on push/PR to `main`, plus a nightly scheduled regression run.
Reports and (on failure) traces/screenshots/videos are uploaded as build
artifacts for debugging without re-running locally.

## Extending this suite

To add a new scenario:
1. Add any new locators to `config/selectors.ts`.
2. Add any new expected values to `fixtures/testData.ts`.
3. Add/extend a Page Object in `pages/` if it's a new page or region.
4. Write the spec in the relevant `tests/<area>/` folder — it should read
   as a plain-English assertion of behavior, with all lookup logic living
   in the page object.
