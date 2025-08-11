import type { Meta, StoryObj } from '@storybook/angular';
import { SharedMenuUserComponent } from './menu-user.component';
import { expect } from 'storybook/test';

const meta: Meta<SharedMenuUserComponent> = {
  component: SharedMenuUserComponent,
  title: 'SharedMenuUserComponent',
};
export default meta;

type Story = StoryObj<SharedMenuUserComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/menu-user/gi)).toBeTruthy();
  },
};
