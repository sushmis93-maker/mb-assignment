import { test, expect } from '../../utils/fixtures';
import { viewports } from '../../fixtures/testData';

test.describe('Mobile Viewport Regression @edge-cases @mobile', () => {
  test.use({ viewport: viewports.mobile });

  test('page renders without horizontal overflow at mobile breakpoint', async ({ navBar, page }) => {
    await navBar.open();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(
      scrollWidth,
      `Horizontal overflow detected: scrollWidth=${scrollWidth} > clientWidth=${clientWidth}`
    ).toBeLessThanOrEqual(clientWidth + 1); // +1px tolerance for subpixel rounding
  });

  test('navigation is still reachable at mobile breakpoint', async ({ navBar }) => {
    await navBar.open();
    // On mobile this is typically a hamburger menu rather than the full
    // desktop bar — we just assert *some* nav affordance is visible.
    await expect(navBar.container).toBeVisible();
  });

  test('key content is visible without layout breakage on mobile', async ({ navBar, contentPage }) => {
    await navBar.open();
    await expect(contentPage.marketingBanner).toBeVisible();
    const box = await contentPage.marketingBanner.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(viewports.mobile.width + 1);
  });
});
