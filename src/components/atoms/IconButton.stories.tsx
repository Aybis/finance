import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Plus, RotateCcw } from 'lucide-react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4">
      <IconButton variant="light" aria-label="Notifications" badgeCount={2}>
        <Bell className="h-4 w-4" />
      </IconButton>
      <IconButton variant="dark" aria-label="Add">
        <Plus className="h-4 w-4" />
      </IconButton>
      <IconButton variant="light" aria-label="Flip card">
        <RotateCcw className="h-4 w-4" />
      </IconButton>
    </div>
  ),
};
