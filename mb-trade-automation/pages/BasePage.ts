import { Page, Locator, expect } from '@playwright/test';

/**
 * Shared behavior for every page object: navigation, wait strategies,
 * and generic assertions. Concrete pages extend this rather than
 * duplicating boilerplate.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Waits for network to settle without being flaky on long-poll/websocket apps. */
  async waitForStableLoad(timeoutMs = 10_000) {
    await this.page
      .waitForLoadState('networkidle', { timeout: timeoutMs })
      .catch(() => {
        // Trading platforms often keep sockets open (live price feeds), so
        // networkidle may legitimately never fire. That's fine — we fall
        // back to a DOM-ready state instead of failing the test on this.
      });
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible().catch(() => false);
  }

  async assertNoConsoleErrors(action: () => Promise<void>) {
    const errors: string[] = [];
    const handler = (msg: import('@playwright/test').ConsoleMessage) => {
      if (msg.type() === 'error') errors.push(msg.text());
    };
    this.page.on('console', handler);
    await action();
    this.page.off('console', handler);
    expect(errors, `Unexpected console errors: ${errors.join('\n')}`).toHaveLength(0);
  }

  get url(): string {
    return this.page.url();
  }
}
