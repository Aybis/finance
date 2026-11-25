import type { Meta, StoryObj } from '@storybook/react';
import { CreditCard, Home } from 'lucide-react';
import { NavGridTile } from './NavGridTile';

const meta: Meta<typeof NavGridTile> = {
  title: 'Molecules/NavGridTile',
  component: NavGridTile,
};

export default meta;
type Story = StoryObj<typeof NavGridTile>;

export const GridPair: Story = {
  render: () => (
    <div className="grid w-44 grid-cols-2 gap-2.5 p-4">
      <NavGridTile label="Home" icon={Home} active={false} />
      <NavGridTile label="Cards" icon={CreditCard} active={true} />
    </div>
  ),
};
