import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4">
      <Avatar name="Alvie" size="sm" />
      <Avatar name="Alvie" size="md" />
      <Avatar name="Alvie" size="lg" />
    </div>
  ),
};
