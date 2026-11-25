import type { Meta, StoryObj } from '@storybook/react';
import { ProUpgradeCard } from './ProUpgradeCard';

const meta: Meta<typeof ProUpgradeCard> = {
  title: 'Molecules/ProUpgradeCard',
  component: ProUpgradeCard,
};

export default meta;
type Story = StoryObj<typeof ProUpgradeCard>;

export const UpgradePrompt: Story = {
  render: () => (
    <div className="w-52 p-4">
      <ProUpgradeCard isPro={false} />
    </div>
  ),
};

export const ActivePro: Story = {
  render: () => (
    <div className="w-52 p-4">
      <ProUpgradeCard isPro={true} />
    </div>
  ),
};
