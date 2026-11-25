import type { Meta, StoryObj } from '@storybook/react';
import { INITIAL_CARDS, INITIAL_TRANSACTIONS } from '@/data/initialData';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: () => (
    <div className="w-56 p-4">
      <SearchBar
        cards={INITIAL_CARDS}
        transactions={INITIAL_TRANSACTIONS}
        onNavigate={() => {}}
        onSelectCard={() => {}}
        onOpenModal={() => {}}
      />
    </div>
  ),
};
