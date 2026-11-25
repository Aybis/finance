import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_NOTIFICATIONS } from '@/data/initialData';
import { NotificationRow } from './NotificationRow';

const meta: Meta<typeof NotificationRow> = {
  title: 'Molecules/NotificationRow',
  component: NotificationRow,
};

export default meta;
type Story = StoryObj<typeof NotificationRow>;

export const UnreadAndRead: Story = {
  render: () => (
    <div className="w-80 space-y-1 rounded-2xl bg-white p-2">
      <NotificationRow item={INITIAL_NOTIFICATIONS[0]} />
      <NotificationRow item={INITIAL_NOTIFICATIONS[2]} />
    </div>
  ),
};
