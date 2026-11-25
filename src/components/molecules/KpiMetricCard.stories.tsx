import type { Meta, StoryObj } from '@storybook/react';
import { KpiMetricCard } from './KpiMetricCard';

const meta: Meta<typeof KpiMetricCard> = {
  title: 'Molecules/KpiMetricCard',
  component: KpiMetricCard,
};

export default meta;
type Story = StoryObj<typeof KpiMetricCard>;

export const Balance: Story = {
  args: {
    label: 'Total Balance',
    value: '$5,465.00',
    delta: '+2.3%',
    direction: 'up',
    sparkline: [14, 18, 16, 22, 19, 25, 21, 28, 24, 31],
  },
};

export const RewardsDown: Story = {
  args: {
    label: 'Rewards Earned',
    value: '2,450 pts',
    delta: '-3.1%',
    direction: 'down',
    sparkline: [26, 22, 24, 19, 21, 17, 15, 18, 14, 16],
  },
};
