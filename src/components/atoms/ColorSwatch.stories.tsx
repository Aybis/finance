import type { Meta, StoryObj } from '@storybook/react';
import { CARD_FINISH_ORDER } from '@/design-system/tokens';
import { ColorSwatch } from './ColorSwatch';

const meta: Meta<typeof ColorSwatch> = {
  title: 'Atoms/ColorSwatch',
  component: ColorSwatch,
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

export const AllSwatches: Story = {
  render: () => (
    <div className="flex items-center gap-3 rounded-2xl bg-[#FBFBFB] p-4">
      {CARD_FINISH_ORDER.map((finish, idx) => (
        <ColorSwatch key={finish} finish={finish} selected={idx === 0} />
      ))}
    </div>
  ),
};
