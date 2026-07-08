import { test, expect } from '../../utils/fixtures';
import { expectedTradingCategories } from '../../fixtures/testData';

test.describe('Spot Trading @trading', () => {
  test.beforeEach(async ({ navBar, tradingPage }) => {
    await navBar.open();
    await navBar.clickLogoToEnterPlatform();
    await tradingPage.waitForPairsToRender();
  });

  test('spot trading section renders and displays trading pairs', async ({ tradingPage }) => {
    await expect(tradingPage.spotSection).toBeVisible();
    const rowCount = await tradingPage.getRowCount();
    expect(rowCount, 'Expected at least one trading pair row to render').toBeGreaterThan(0);
  });

  test('trading pairs are grouped into categories', async ({ tradingPage }) => {
    const categories = await tradingPage.getCategoryNames();
    expect(categories.length, 'Expected at least one category tab').toBeGreaterThan(0);

    // Soft-check against known categories; log rather than hard-fail on
    // ones the site may have renamed, but require meaningful overlap.
    const overlap = expectedTradingCategories.filter((c) =>
      categories.some((actual) => actual.toLowerCase().includes(c.toLowerCase()))
    );
    expect(
      overlap.length,
      `Expected overlap with known categories. Found on page: ${categories.join(', ')}`
    ).toBeGreaterThan(0);
  });

  test('switching category updates the visible pair list', async ({ tradingPage }) => {
    const categories = await tradingPage.getCategoryNames();
    test.skip(categories.length < 2, 'Not enough categories to test switching behavior');

    const beforeRows = await tradingPage.getAllRowsData(5);
    await tradingPage.selectCategory(categories[1]);
    await tradingPage.waitForPairsToRender();
    const afterRows = await tradingPage.getAllRowsData(5);

    expect(JSON.stringify(afterRows)).not.toBe(JSON.stringify(beforeRows));
  });

  test('each trading pair row contains the expected data fields', async ({ tradingPage }) => {
    const rowCount = await tradingPage.getRowCount();
    const sampleSize = Math.min(rowCount, 10); // bounded sample keeps the test fast & deterministic
    const rows = await tradingPage.getAllRowsData(sampleSize);

    expect(rows.length).toBeGreaterThan(0);

    for (const [i, row] of rows.entries()) {
      expect(row.symbol, `Row ${i}: symbol should not be empty`).not.toBe('');
      expect(row.price, `Row ${i}: price should not be empty`).not.toBe('');
      // change/volume are validated for presence, not exact value, since
      // they're live/market-driven data.
      expect(
        row.change !== '' || row.volume !== '',
        `Row ${i}: expected at least a change% or volume figure`
      ).toBeTruthy();
    }
  });
});
