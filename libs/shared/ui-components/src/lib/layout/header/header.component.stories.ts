import type { Meta, StoryObj } from '@storybook/angular';
import { SharedHeaderComponent } from './header.component';
import { expect } from 'storybook/test';

const meta: Meta<SharedHeaderComponent> = {
  component: SharedHeaderComponent,
  title: 'SharedHeaderComponent',
};
export default meta;

type Story = StoryObj<SharedHeaderComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/header/gi)).toBeTruthy();
  },
};
