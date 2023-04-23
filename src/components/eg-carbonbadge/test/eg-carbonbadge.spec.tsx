import { newSpecPage } from '@stencil/core/testing';
import { EgCarbonbadge } from '../eg-carbonbadge';

describe('eg-carbonbadge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [EgCarbonbadge],
      html: `<eg-carbonbadge></eg-carbonbadge>`,
    });
    expect(page.root).toEqualHtml(`
      <eg-carbonbadge>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </eg-carbonbadge>
    `);
  });
});
