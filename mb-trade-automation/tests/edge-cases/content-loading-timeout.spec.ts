import { test, expect } from '../../utils/fixtures';

test.describe('Content Loading Timeout Handling @edge-cases', () => {
  test('trading pairs surface a loading state and eventually resolve, not hang indefinitely', async ({
    navBar,
    tradingPage,
    page,
  }) => {
    await navBar.open();
    await navBar.clickLogoToEnterPlatform();

    // Race the real render against a hard ceiling. If pairs never render
    // within a generous window, that's a genuine regression worth failing on
    // rather than letting the whole suite hang.
    const rendered = await tradingPage
      .waitForPairsToRender(1, 15_000)
      .catch(() => false);

    expect(rendered, 'Trading pairs did not render within the timeout window').toBeTruthy();
  });

  test('app recovers gracefully when a non-critical network request is slow', async ({ navBar, page }) => {
    // Simulate a slow/degraded third-party or analytics call and confirm
    // core UI still becomes interactive rather than blocking on it.
    await page.route('**/*analytics*', async (route) => {
      await new Promise((r) => setTimeout(r, 5000));
      await route.abort();
    });

    await navBar.open();
    await expect(navBar.container).toBeVisible({ timeout: 10_000 });
  });
});
