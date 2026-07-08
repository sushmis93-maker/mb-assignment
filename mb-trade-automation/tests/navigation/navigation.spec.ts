import { test, expect } from '../../utils/fixtures';
import { expectedNavItems } from '../../fixtures/testData';
import { viewports } from '../../fixtures/testData';

test.describe('Top Navigation @navigation', () => {
  test.beforeEach(async ({ navBar }) => {
    await navBar.open();
  });

  test('renders with all expected nav items visible', async ({ navBar }) => {
    await expect(navBar.container).toBeVisible();

    for (const item of expectedNavItems) {
      await expect(
        navBar.navLink(item.name),
        `Expected nav item "${item.name}" to be visible`
      ).toBeVisible();
    }
  });

  test('each nav item links to the correct destination', async ({ navBar }) => {
    for (const item of expectedNavItems) {
      const href = await navBar.getHrefFor(item.name);
      expect(href, `"${item.name}" should have an href`).not.toBeNull();
      expect(
        href?.toLowerCase(),
        `"${item.name}" href should contain "${item.expectedPathContains}"`
      ).toContain(item.expectedPathContains);
    }
  });

  test('clicking the top-left logo enters the trading platform', async ({ navBar, page }) => {
    await navBar.clickLogoToEnterPlatform();
    // Landing page after logo click should differ from the marketing homepage
    // and represent the trading platform entry point per the task brief.
    expect(page.url()).not.toBe('https://trade.mb.io/');
  });

  test.describe('Desktop viewport layout', () => {
    test.use({ viewport: viewports.desktop });

    test('nav renders correctly at standard desktop size', async ({ navBar }) => {
      await expect(navBar.container).toBeVisible();
      const box = await navBar.container.boundingBox();
      expect(box, 'Nav container should have a measurable bounding box').not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);

      // All items should remain visible (no unexpected collapse into a
      // hamburger menu) at desktop width.
      const names = await navBar.getVisibleNavItemNames();
      expect(names.length).toBeGreaterThanOrEqual(expectedNavItems.length);
    });
  });

  test.describe('Laptop viewport layout', () => {
    test.use({ viewport: viewports.laptop });

    test('nav remains usable at smaller desktop width', async ({ navBar }) => {
      await expect(navBar.container).toBeVisible();
    });
  });
});
