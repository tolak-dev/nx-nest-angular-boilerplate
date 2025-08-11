import type { Meta, StoryObj } from '@storybook/angular';
import { LayoutHorizontalComponent } from './layout-horizontal.component';
import { expect } from 'storybook/test';

const meta: Meta<LayoutHorizontalComponent> = {
  component: LayoutHorizontalComponent,
  title: 'LayoutHorizontalComponent',
};
export default meta;

type Story = StoryObj<LayoutHorizontalComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/layout-horizontal/gi)).toBeTruthy();
  },
};
