MultiBank Trade Platform — UI Automation Framework
Playwright + TypeScript test suite for trade.mb.io — covers navigation, spot trading, marketing content, and edge cases. No login or PII anywhere in this suite, it’s all public-facing pages.

Setup:
npm install
npx playwright install --with-deps

Running tests
npm test                # all projects (desktop chrome, firefox, mobile)
npm run test:desktop    # desktop chrome only
npm run test:mobile     # mobile viewport specs only
npm run test:navigation # single scenario group
npm run test:headed     # watch it run
npm run report          # open the last HTML report

Point it at a different environment without touching code:
BASE_URL=https://staging.trade.mb.io npm test

Layout
config/selectors.ts               → locators, one place for all of them
fixtures/testData.ts              → expected values / content we assert against
pages/                            → Page Object Model, one class per page/region
utils/fixtures.ts                 → wires page objects into Playwright's test fixture
tests/
navigation/                       → nav rendering, links, viewport behavior
trading/                          → spot trading listing, categories, row data, API contract
content/                          → banners, app store/play links, About Us section
edge-cases/                       → invalid routes, broken links, mobile viewport, timeouts

Selectors and expected content live in separate files on purpose — those are the two
things that drift as the site changes, so a copy edit or a markup refactor only touches
one file instead of rippling through every spec. Page Objects handle how to interact with
a page; the specs just read as plain assertions of 'what should be true'.

#### What’s covered ##
##Area##                 ##  Spec file ##                                                ##  Notes ##

Nav renders
+ links
correct           tests/navigation/navigation.spec.ts role-based lookup, not CSS          classes

Desktop
viewport
behavior             same file 1440×900 and 1280×800                                      projects

Spot trading
renders +
pairs               tests/trading/trading.spec.ts                                 bounded sample (10 rows)for speed/determinism

Pair
categories                same file                               soft-overlap match againstknown categories, logsactual list on failure

Pair row data
fields                     same file                               symbol/price required non-empty; change/volume presence checked

Marketing               tests/content/content-links.spec.ts            asserts visible + positioned
banners

App Store /
Google Play
links                    same file                              checks href pattern and resolves via HTTP request, not just click   


About Us >
Why                      same file                                heading + section textpresence, soft-match onknown section titles
MultiBank 

Invalid route
handling                 tests/edge-cases/invalid- route.spec.ts       accepts either server 404 or SPA-rendered not-found state


Broken link
detection               tests/edge-cases/broken-link-detection.spec.ts    crawls all nav hrefs, checksnone return 4xx/5xx

Mobile
viewport
regression             tests/edge-cases/mobile-viewport-regression.spec.ts    390×844, checks for horizontal overflow specifically

Content
loading
timeout           tests/edge-cases/content-loading- timeout.spec.ts         bonus — bounded wait +graceful degradation underslownetwork


API contract        tests/trading/api- validation.spec.ts      bonus — validates the JSON backing the pair list,not just the rendered DOM  
 




##A few notes on decisions made along the way##
Role/text-based locators over CSS. Survives styling refactors and matches what a
user actually sees, rather than an implementation detail that can change on any
deploy.
networkidle is treated as best-effort, not something we block on, in

BasePage.waitForStableLoad . Trading platforms tend to hold a live websocket/price-
feed connection open, so networkidle may just never fire — waiting on it made tests

flaky and slow for no real benefit.
Category and section-heading assertions use soft-overlap matching, not
exact match. If marketing renames one category, we don’t want the whole suite
going red — but if there’s zero overlap with anything expected, that’s a real signal
and the test fails, with the actual list dumped into the failure message so triage
doesn’t require re-running locally.
Broken link check uses page.request rather than full page navigations. Faster,
and it avoids false failures where client-side routing intercepts goto() before the
request ever completes.
Nothing in this suite creates an account, submits a form with personal data,
or logs in. Wasn’t in scope and didn’t want it creeping in later by accident.

##CI ##
.github/workflows/playwright.yml runs the full suite across three browser projects on

every push/PR to main , plus a nightly scheduled run. Reports, and on failure

traces/screenshots/videos, get uploaded as build artifacts so you can debug without re-
running locally.

###Adding a new scenario###
1. Add any new locators to config/selectors.ts .
2. Add any new expected values to fixtures/testData.ts .
3. Extend or add a Page Object in pages/ if it’s a new page or region.

4. Write the spec under the right tests/<area>/ folder — keep it readable as a plain-
English assertion of behavior, and keep lookup logic out of the spec itself.
