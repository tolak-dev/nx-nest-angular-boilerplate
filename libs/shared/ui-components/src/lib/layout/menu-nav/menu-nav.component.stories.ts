import type { Meta, StoryObj } from '@storybook/angular';
import { SharedMenuNavComponent } from './menu-nav.component';
import { expect } from 'storybook/test';

const meta: Meta<SharedMenuNavComponent> = {
  component: SharedMenuNavComponent,
  title: 'SharedMenuNavComponent',
};
export default meta;

type Story = StoryObj<SharedMenuNavComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/menu-nav/gi)).toBeTruthy();
  },
};
