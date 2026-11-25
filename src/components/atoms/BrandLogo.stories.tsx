import type { Meta, StoryObj } from '@storybook/react';
import { BrandLogo } from './BrandLogo';

const meta: Meta<typeof BrandLogo> = {
  title: 'Atoms/BrandLogo',
  component: BrandLogo,
};

export default meta;
type Story = StoryObj<typeof BrandLogo>;

export const Full: Story = {
  args: { compact: false },
};

export const Compact: Story = {
  args: { compact: true },
};
