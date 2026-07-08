import { test, expect } from '../../utils/fixtures';

test.describe('Broken Link Detection @edge-cases', () => {
  test('all top navigation links resolve without error', async ({ navBar, page }) => {
    await navBar.open();

    const links = await navBar.container.getByRole('link').all();
    const hrefs = new Set<string>();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        hrefs.add(href);
      }
    }

    expect(hrefs.size, 'Expected at least one crawlable nav link').toBeGreaterThan(0);

    const broken: Array<{ href: string; status: number | string }> = [];

    for (const href of hrefs) {
      const absolute = href.startsWith('http') ? href : new URL(href, page.url()).toString();
      try {
        const response = await page.request.get(absolute, { timeout: 10_000 });
        const status = response.status();
        if (status >= 400) broken.push({ href: absolute, status });
      } catch (err) {
        broken.push({ href: absolute, status: 'request-failed' });
      }
    }

    expect(
      broken,
      `Found broken navigation links: ${JSON.stringify(broken, null, 2)}`
    ).toHaveLength(0);
  });
});
