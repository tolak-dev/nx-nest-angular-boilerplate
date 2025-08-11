import type { Meta, StoryObj } from '@storybook/angular';
import { SharedMenuNavMobileComponent } from './menu-nav-mobile.component';
import { expect } from 'storybook/test';

const meta: Meta<SharedMenuNavMobileComponent> = {
  component: SharedMenuNavMobileComponent,
  title: 'SharedMenuNavMobileComponent',
};
export default meta;

type Story = StoryObj<SharedMenuNavMobileComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/menu-nav-mobile/gi)).toBeTruthy();
  },
};
