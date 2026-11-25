import { CardShowcasePanel } from '@/components/organisms/CardShowcasePanel';
import { CardUsageWidget } from '@/components/organisms/CardUsageWidget';
import { CardUtilizationWidget } from '@/components/organisms/CardUtilizationWidget';
import { KpiSummaryRow } from '@/components/organisms/KpiSummaryRow';
import { MonthlyActivityWidget } from '@/components/organisms/MonthlyActivityWidget';
import { MonthlySpendingWidget } from '@/components/organisms/MonthlySpendingWidget';
import { SpendingCategoriesWidget } from '@/components/organisms/SpendingCategoriesWidget';

export function CardsPage() {
  return (
    <div className="space-y-3.5">
      <KpiSummaryRow />

      <div className="grid grid-cols-1 gap-3.5 @4xl:grid-cols-12">
        <div className="@4xl:col-span-5">
          <CardShowcasePanel />
        </div>

        <div className="grid gap-3.5 @4xl:col-span-7">
          <div className="grid grid-cols-1 gap-3.5 @xl:grid-cols-2">
            <MonthlySpendingWidget />
            <CardUsageWidget />
          </div>

          <SpendingCategoriesWidget />

          <div className="grid grid-cols-1 gap-3.5 @xl:grid-cols-2">
            <MonthlyActivityWidget />
            <CardUtilizationWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
