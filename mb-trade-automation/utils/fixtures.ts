import { test as base } from '@playwright/test';
import { NavigationBar } from '../pages/NavigationBar';
import { TradingPage } from '../pages/TradingPage';
import { ContentPage } from '../pages/ContentPage';
import { AboutWhyMultibankPage } from '../pages/AboutWhyMultibankPage';

type Fixtures = {
  navBar: NavigationBar;
  tradingPage: TradingPage;
  contentPage: ContentPage;
  aboutPage: AboutWhyMultibankPage;
};

/**
 * Extends the base Playwright test with pre-wired page objects so specs
 * consume `{ navBar, tradingPage }` directly instead of constructing POMs
 * inline. Keeps specs declarative and free of setup noise.
 */
export const test = base.extend<Fixtures>({
  navBar: async ({ page }, use) => use(new NavigationBar(page)),
  tradingPage: async ({ page }, use) => use(new TradingPage(page)),
  contentPage: async ({ page }, use) => use(new ContentPage(page)),
  aboutPage: async ({ page }, use) => use(new AboutWhyMultibankPage(page)),
});

export { expect } from '@playwright/test';
