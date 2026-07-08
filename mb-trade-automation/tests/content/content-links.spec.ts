import { test, expect } from '../../utils/fixtures';
import { expectedAboutWhySections } from '../../fixtures/testData';

test.describe('Marketing Content & Links @content', () => {
  test('marketing banners render in the expected page region', async ({ navBar, contentPage }) => {
    await navBar.open();
    await expect(contentPage.marketingBanner).toBeVisible();

    // "Expected region" check: banner should appear above the fold / near
    // the top of the page, not buried in the footer.
    const box = await contentPage.marketingBanner.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y, 'Banner should render in the upper portion of the page').toBeLessThan(1200);
  });

  test('App Store link resolves correctly', async ({ navBar, contentPage }) => {
    await navBar.open();
    const href = await contentPage.appStoreLink.getAttribute('href');
    expect(href, 'App Store link should have an href').toBeTruthy();
    expect(href).toContain('apps.apple.com');

    const status = await contentPage.resolveLinkStatus(contentPage.appStoreLink);
    expect(status, 'App Store link should resolve with a successful/redirect status').not.toBeNull();
    expect(status).toBeLessThan(400);
  });

  test('Google Play link resolves correctly', async ({ navBar, contentPage }) => {
    await navBar.open();
    const href = await contentPage.googlePlayLink.getAttribute('href');
    expect(href, 'Google Play link should have an href').toBeTruthy();
    expect(href).toContain('play.google.com');

    const status = await contentPage.resolveLinkStatus(contentPage.googlePlayLink);
    expect(status, 'Google Play link should resolve with a successful/redirect status').not.toBeNull();
    expect(status).toBeLessThan(400);
  });

  test('About Us > Why MultiBank renders expected headings and sections', async ({ aboutPage }) => {
    await aboutPage.open();
    await expect(aboutPage.heading).toBeVisible();

    const headingText = (await aboutPage.heading.innerText()).trim();
    expect(headingText.length, 'Page heading should not be empty').toBeGreaterThan(0);

    const sectionHeadings = await aboutPage.getSectionHeadingsText();
    expect(sectionHeadings.length, 'Expected multiple content sections').toBeGreaterThan(0);

    const overlap = expectedAboutWhySections.filter((expected) =>
      sectionHeadings.some((actual) => actual.toLowerCase().includes(expected.toLowerCase()))
    );
    expect(
      overlap.length,
      `Expected known section headings among: ${sectionHeadings.join(', ')}`
    ).toBeGreaterThan(0);
  });
});
