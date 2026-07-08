/**
 * Centralized selector map.
 *
 * WHY THIS FILE EXISTS:
 * Tests and Page Objects should never hardcode raw CSS/XPath. Every locator
 * lives here so that when the site's markup changes, exactly one file needs
 * updating, not a dozen spec files.
 *
 * IMPORTANT — READ BEFORE RUNNING:
 * These selectors were written using resilient, role/text-first strategies
 * (Playwright's recommended approach) based on the documented scenarios,
 * since this environment could not load trade.mb.io interactively to
 * hand-verify exact DOM structure (automated access to the site is blocked
 * by robots.txt for this tool). Before running for real:
 *   1. Run `npm run codegen` against the live site.
 *   2. Confirm/replace the `dataTestId` fallbacks below with real
 *      data-testid / class values observed in the DOM.
 *   3. Everything else (the role/text based locators) should keep working
 *      even if you don't do step 2 immediately, since they target visible
 *      accessible content rather than implementation details.
 */

export const selectors = {
  nav: {
    // Landmark region for the primary top nav
    container: 'header, nav[role="navigation"], [data-testid="main-nav"]',
    // Individual nav links are queried by accessible role+name in the POM,
    // this is only the fallback container selector.
    logoLink: 'header a[href="/"], [data-testid="nav-logo"]',
  },

  trading: {
    // The page reached after clicking the top-left logo/menu per the task
    // brief ("click on top left corner and it will navigate to other page").
    spotSection: '[data-testid="spot-trading"], section:has-text("Spot")',
    pairRow: '[data-testid="trading-pair-row"], table tbody tr, [class*="pair-row"]',
    categoryTab: '[data-testid="pair-category-tab"], [role="tab"]',
    pairSymbol: '[data-testid="pair-symbol"], [class*="symbol"]',
    pairPrice: '[data-testid="pair-price"], [class*="price"]',
    pairChange: '[data-testid="pair-change"], [class*="change"]',
    pairVolume: '[data-testid="pair-volume"], [class*="volume"]',
  },

  content: {
    marketingBanner: '[data-testid="hero-banner"], [class*="banner"], [class*="hero"]',
    appStoreLink: 'a[href*="apps.apple.com"]',
    googlePlayLink: 'a[href*="play.google.com"]',
    footer: 'footer',
  },

  aboutWhyMultibank: {
    // Adjust path once confirmed via manual nav; brief says About Us > Why MultiBank
    path: '/about/why-multibank',
    heading: 'h1',
    sections: 'main section, article section',
  },
};

export const routes = {
  home: '/',
  invalid: '/this-route-should-not-exist-qa-test-404',
  aboutWhyMultibank: selectors.aboutWhyMultibank.path,
};
