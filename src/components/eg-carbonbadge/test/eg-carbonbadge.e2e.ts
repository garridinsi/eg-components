import { newE2EPage } from '@stencil/core/testing';

describe('eg-carbonbadge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<eg-carbonbadge></eg-carbonbadge>');

    const element = await page.find('eg-carbonbadge');
    expect(element).toHaveClass('hydrated');
  });
});
