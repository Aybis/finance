import type { Meta, StoryObj } from '@storybook/react';
import { Lock, PlusCircle } from 'lucide-react';
import { QuickActionRow } from './QuickActionRow';

const meta: Meta<typeof QuickActionRow> = {
  title: 'Molecules/QuickActionRow',
  component: QuickActionRow,
};

export default meta;
type Story = StoryObj<typeof QuickActionRow>;

export const Showcase: Story = {
  render: () => (
    <div className="w-52 space-y-1 rounded-2xl bg-[#F4F4F6] p-2">
      <QuickActionRow label="Freeze Card" icon={PlusCircle} />
      <QuickActionRow label="Freeze Card" icon={Lock} active badgeText="Frozen" />
    </div>
  ),
};
