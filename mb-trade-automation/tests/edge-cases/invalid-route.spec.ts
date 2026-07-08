import { test, expect } from '../../utils/fixtures';
import { invalidRoutes } from '../../fixtures/testData';

test.describe('Invalid Route Handling @edge-cases', () => {
  for (const route of invalidRoutes) {
    test(`navigating to ${route} shows a graceful not-found state`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

      // Either the server returns a real 404, or an SPA client-side router
      // intercepts and renders a "not found" view with a 200 — both are
      // acceptable, but the app must not hard-crash or show a blank page.
      const status = response?.status();

      const bodyText = (await page.locator('body').innerText()).trim();
      expect(bodyText.length, 'Page body should not be blank on an invalid route').toBeGreaterThan(0);

      if (status && status >= 400) {
        expect(status).toBeLessThan(500); // client error, not a server crash
      } else {
        const hasNotFoundIndicator = /not found|404|doesn.?t exist|page unavailable/i.test(bodyText);
        expect(
          hasNotFoundIndicator,
          `Expected a not-found indicator in body text for ${route}. Got: "${bodyText.slice(0, 200)}"`
        ).toBeTruthy();
      }
    });
  }
});
