import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectors, routes } from '../config/selectors';

export class AboutWhyMultibankPage extends BasePage {
  readonly heading: Locator;
  readonly sections: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator(selectors.aboutWhyMultibank.heading).first();
    this.sections = page.locator(selectors.aboutWhyMultibank.sections);
  }

  async open() {
    await this.goto(routes.aboutWhyMultibank);
    await this.waitForStableLoad();
  }

  async getSectionHeadingsText(): Promise<string[]> {
    const headings = await this.page.locator('main h2, main h3, article h2, article h3').all();
    const texts: string[] = [];
    for (const h of headings) {
      const text = (await h.innerText().catch(() => '')).trim();
      if (text) texts.push(text);
    }
    return texts;
  }
}
