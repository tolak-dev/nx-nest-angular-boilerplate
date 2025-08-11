import type { Meta, StoryObj } from '@storybook/angular';
import { SharedMenuUserMobileComponent } from './menu-user-mobile.component';
import { expect } from 'storybook/test';

const meta: Meta<SharedMenuUserMobileComponent> = {
  component: SharedMenuUserMobileComponent,
  title: 'SharedMenuUserMobileComponent',
};
export default meta;

type Story = StoryObj<SharedMenuUserMobileComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/menu-user-mobile/gi)).toBeTruthy();
  },
};
