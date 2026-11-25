import type { Meta, StoryObj } from '@storybook/react';
import { InfoBadgeHint, KazaTooltip } from './InfoTooltip';

const meta: Meta<typeof InfoBadgeHint> = {
  title: 'Atoms/InfoTooltip',
  component: InfoBadgeHint,
};

export default meta;
type Story = StoryObj<typeof InfoBadgeHint>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-10">
      <KazaTooltip
        title="Credit Utilization"
        content="Percentage of your monthly limit currently used. Keeping utilization under 30% supports strong credit health."
      >
        <span className="rounded-full border border-[#EAEAEF] bg-white px-3 py-1 text-xs font-medium">
          Hover for meaning
        </span>
      </KazaTooltip>
      <InfoBadgeHint
        title="Monthly Spending"
        content="30-day rolling card spending velocity."
      />
    </div>
  ),
};
