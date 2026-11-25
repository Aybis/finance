import type { Meta, StoryObj } from '@storybook/react';
import { SemiCircleGauge } from './SemiCircleGauge';

const meta: Meta<typeof SemiCircleGauge> = {
  title: 'Molecules/SemiCircleGauge',
  component: SemiCircleGauge,
};

export default meta;
type Story = StoryObj<typeof SemiCircleGauge>;

export const SeventyTwoPercent: Story = {
  args: {
    percentage: 72,
    amount: 3200,
    sublabel: 'Limit Used',
  },
};
