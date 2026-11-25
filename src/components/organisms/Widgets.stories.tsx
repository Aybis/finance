import type { Meta, StoryObj } from '@storybook/react';
import { FinanceProvider } from '@/store/FinanceContext';
import { CardShowcasePanel } from './CardShowcasePanel';
import { CardUsageWidget } from './CardUsageWidget';
import { CardUtilizationWidget } from './CardUtilizationWidget';
import { MonthlyActivityWidget } from './MonthlyActivityWidget';
import { MonthlySpendingWidget } from './MonthlySpendingWidget';
import { SpendingCategoriesWidget } from './SpendingCategoriesWidget';

function WidgetsShowcase() {
  return (
    <FinanceProvider>
      <div className="grid max-w-5xl grid-cols-1 gap-4 bg-[#F3F4F6] p-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <CardShowcasePanel />
        </div>
        <div className="grid gap-4 lg:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MonthlySpendingWidget />
            <CardUsageWidget />
          </div>
          <SpendingCategoriesWidget />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MonthlyActivityWidget />
            <CardUtilizationWidget />
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
}

const meta: Meta<typeof WidgetsShowcase> = {
  title: 'Organisms/CardsDashboardBento',
  component: WidgetsShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WidgetsShowcase>;

export const FullBentoGrid: Story = {};
