/**
 * Expected values used across specs. Keeping this separate from selectors.ts
 * (which is about *how to find things*) vs this file (*what we expect to
 * find*) keeps a clean separation of concerns: a copy change on the site
 * only touches this file, a markup change only touches selectors.ts.
 *
 * NOTE: The exact nav item labels/hrefs and section headings below are
 * placeholders reflecting the brief's description. Populate them from a
 * real run of `npm run codegen` / manual inspection before first use —
 * search this file for "TODO(verify)".
 */

export const expectedNavItems = [
  // TODO(verify): confirm exact labels/paths against live site
  { name: 'Markets', expectedPathContains: 'market' },
  { name: 'Trade', expectedPathContains: 'trade' },
  { name: 'About Us', expectedPathContains: 'about' },
];

export const expectedTradingCategories = [
  // TODO(verify)
  'Popular',
  'Crypto',
  'Forex',
  'Commodities',
];

export const expectedPairRowFields: Array<keyof import('../pages/TradingPage').TradingPairRowData> = [
  'symbol',
  'price',
  'change',
  'volume',
];

export const expectedAboutWhySections = [
  // TODO(verify): confirm actual headings shown on About Us > Why MultiBank
  'Our Story',
  'Regulation & Trust',
  'Global Presence',
];

export const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 }, // iPhone 13-class
};

export const invalidRoutes = [
  '/this-route-should-not-exist-qa-test-404',
  '/trade/does-not-exist-pair',
];
