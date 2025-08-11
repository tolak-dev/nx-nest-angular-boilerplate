import type { Meta, StoryObj } from '@storybook/angular';
import { SharedFooterComponent } from './footer.component';
import { expect } from 'storybook/test';

const meta: Meta<SharedFooterComponent> = {
  component: SharedFooterComponent,
  title: 'SharedFooterComponent',
};
export default meta;

type Story = StoryObj<SharedFooterComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/footer/gi)).toBeTruthy();
  },
};
