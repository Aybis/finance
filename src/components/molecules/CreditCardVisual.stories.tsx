import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_CARDS } from '@/data/initialData';
import { CreditCardVisual } from './CreditCardVisual';

const meta: Meta<typeof CreditCardVisual> = {
  title: 'Molecules/CreditCardVisual',
  component: CreditCardVisual,
};

export default meta;
type Story = StoryObj<typeof CreditCardVisual>;

export const ChampagneFront: Story = {
  args: {
    card: INITIAL_CARDS[0],
    flipped: false,
  },
};

export const BackFace: Story = {
  args: {
    card: INITIAL_CARDS[0],
    flipped: true,
  },
};

export const ObsidianFrozen: Story = {
  args: {
    card: { ...INITIAL_CARDS[2], frozen: true },
    flipped: false,
  },
};
