import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectors } from '../config/selectors';

export interface NavItem {
  name: string;
  expectedPathContains: string;
}

/**
 * Represents the persistent top navigation. Handles both the "click the
 * top-left corner to reach the trading page" entry flow described in the
 * brief, and standard nav item validation.
 */
export class NavigationBar extends BasePage {
  readonly container: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.locator(selectors.nav.container).first();
    this.logo = page.locator(selectors.nav.logoLink).first();
  }

  async open() {
    await this.goto('/');
    await this.waitForStableLoad();
  }

  /** The brief's described flow: click top-left logo to land on the trading page. */
  async clickLogoToEnterPlatform() {
    await this.logo.click();
    await this.waitForStableLoad();
  }

  navLink(name: string): Locator {
    // Role-based lookup: resilient to class/markup changes, tied to what a
    // real user actually sees.
    return this.container.getByRole('link', { name, exact: false });
  }

  async getVisibleNavItemNames(): Promise<string[]> {
    const links = await this.container.getByRole('link').all();
    const names: string[] = [];
    for (const link of links) {
      const text = (await link.innerText().catch(() => ''))?.trim();
      if (text) names.push(text);
    }
    return names;
  }

  async getHrefFor(name: string): Promise<string | null> {
    return this.navLink(name).getAttribute('href');
  }
}
