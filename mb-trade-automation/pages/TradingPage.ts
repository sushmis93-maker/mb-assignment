import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectors } from '../config/selectors';

export interface TradingPairRowData {
  symbol: string;
  price: string;
  change: string;
  volume: string;
}

/**
 * The spot trading listing page (reached after the top-left logo click
 * per the task brief).
 */
export class TradingPage extends BasePage {
  readonly spotSection: Locator;
  readonly categoryTabs: Locator;
  readonly pairRows: Locator;

  constructor(page: Page) {
    super(page);
    this.spotSection = page.locator(selectors.trading.spotSection).first();
    this.categoryTabs = page.locator(selectors.trading.categoryTab);
    this.pairRows = page.locator(selectors.trading.pairRow);
  }

  async waitForPairsToRender(minCount = 1, timeoutMs = 10_000) {
    await this.pairRows
      .first()
      .waitFor({ state: 'visible', timeout: timeoutMs });
    const count = await this.pairRows.count();
    return count >= minCount;
  }

  async getCategoryNames(): Promise<string[]> {
    const tabs = await this.categoryTabs.all();
    const names: string[] = [];
    for (const tab of tabs) {
      const text = (await tab.innerText().catch(() => ''))?.trim();
      if (text) names.push(text);
    }
    return names;
  }

  async selectCategory(name: string) {
    await this.categoryTabs.filter({ hasText: name }).first().click();
    await this.waitForStableLoad();
  }

  async getRowCount(): Promise<number> {
    return this.pairRows.count();
  }

  async getRowData(index: number): Promise<TradingPairRowData> {
    const row = this.pairRows.nth(index);
    const symbol = (await row.locator(selectors.trading.pairSymbol).first().innerText().catch(() => '')).trim();
    const price = (await row.locator(selectors.trading.pairPrice).first().innerText().catch(() => '')).trim();
    const change = (await row.locator(selectors.trading.pairChange).first().innerText().catch(() => '')).trim();
    const volume = (await row.locator(selectors.trading.pairVolume).first().innerText().catch(() => '')).trim();
    return { symbol, price, change, volume };
  }

  async getAllRowsData(limit?: number): Promise<TradingPairRowData[]> {
    const count = await this.getRowCount();
    const upper = limit ? Math.min(limit, count) : count;
    const rows: TradingPairRowData[] = [];
    for (let i = 0; i < upper; i++) {
      rows.push(await this.getRowData(i));
    }
    return rows;
  }
}
