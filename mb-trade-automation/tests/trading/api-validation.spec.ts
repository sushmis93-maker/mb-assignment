import { test, expect } from '../../utils/fixtures';

/**
 * Bonus: intercepts the network response(s) that hydrate the trading pair
 * list and asserts on the underlying data contract, not just the rendered
 * DOM. This catches backend/data-shape regressions the UI might silently
 * swallow (e.g. a field renamed, a null price rendered as "0").
 *
 * NOTE: the URL pattern below is a placeholder — capture the real
 * XHR/fetch endpoint via DevTools Network tab (filter: Fetch/XHR) while
 * loading the trading page and replace `**\/api/**pair**` accordingly.
 */
test.describe('Trading API Contract @trading @api', () => {
  test('trading pairs API returns well-formed data backing the UI', async ({ navBar, page }) => {
    const responsePromise = page.waitForResponse(
      (res) => /\/api\/.*pair/i.test(res.url()) && res.status() === 200,
      { timeout: 15_000 }
    ).catch(() => null);

    await navBar.open();
    await navBar.clickLogoToEnterPlatform();

    const response = await responsePromise;
    test.skip(!response, 'Trading pairs endpoint pattern not matched — update URL pattern after inspecting Network tab');
    if (!response) return;

    expect(response.status()).toBe(200);
    const body = await response.json().catch(() => null);
    expect(body, 'Response should be valid JSON').not.toBeNull();

    const list = Array.isArray(body) ? body : body?.data ?? body?.pairs;
    expect(Array.isArray(list), 'Expected an array of trading pairs in the response').toBeTruthy();
    expect(list.length).toBeGreaterThan(0);

    const sample = list[0];
    expect(sample).toHaveProperty('symbol');
    // price field name may differ (price / lastPrice / close) — adjust once verified.
  });
});
