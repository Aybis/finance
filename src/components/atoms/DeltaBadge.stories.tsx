import type { Meta, StoryObj } from '@storybook/react';
import { DeltaBadge } from './DeltaBadge';

const meta: Meta<typeof DeltaBadge> = {
  title: 'Atoms/DeltaBadge',
  component: DeltaBadge,
};

export default meta;
type Story = StoryObj<typeof DeltaBadge>;

export const Positive: Story = {
  args: { value: '+2.3%', direction: 'up' },
};

export const Negative: Story = {
  args: { value: '-3.1%', direction: 'down' },
};

export const WithSuffix: Story = {
  args: { value: '+56.57%', direction: 'up', suffix: 'Today' },
};
