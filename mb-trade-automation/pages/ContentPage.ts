import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectors } from '../config/selectors';

export class ContentPage extends BasePage {
  readonly marketingBanner: Locator;
  readonly appStoreLink: Locator;
  readonly googlePlayLink: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.marketingBanner = page.locator(selectors.content.marketingBanner).first();
    this.appStoreLink = page.locator(selectors.content.appStoreLink).first();
    this.googlePlayLink = page.locator(selectors.content.googlePlayLink).first();
    this.footer = page.locator(selectors.content.footer).first();
  }

  /** Resolves without following through a full navigation (HEAD/GET via request context). */
  async resolveLinkStatus(locator: Locator): Promise<number | null> {
    const href = await locator.getAttribute('href');
    if (!href) return null;
    const response = await this.page.request
      .get(href, { timeout: 10_000 })
      .catch(() => null);
    return response?.status() ?? null;
  }
}
