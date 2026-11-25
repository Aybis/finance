import type { Meta, StoryObj } from '@storybook/react';
import { StatusPill } from './StatusPill';

const meta: Meta<typeof StatusPill> = {
  title: 'Atoms/StatusPill',
  component: StatusPill,
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

export const Showcase: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-4">
      <StatusPill tone="dark">+12%</StatusPill>
      <StatusPill tone="dark">84%</StatusPill>
      <StatusPill tone="light" onClick={() => {}}>
        View All
      </StatusPill>
      <StatusPill tone="frozen">Frozen</StatusPill>
    </div>
  ),
};
