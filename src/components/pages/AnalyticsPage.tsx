import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/controls';
import { CATEGORY_PRESETS, MONTHLY_ACTIVITY_SERIES } from '@/data/initialData';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCompactCurrency, formatCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';
import type { CategoryTimeframe, SpendingCategoryName } from '@/types/finance';

const PERIOD_TO_TIMEFRAME: Record<string, CategoryTimeframe> = {
  week: 'This Month',
  month: 'This Month',
  quarter: 'This Quarter',
  year: 'This Year',
};

export function AnalyticsPage() {
  const { state, pushToast } = useFinance();
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const categories = CATEGORY_PRESETS[PERIOD_TO_TIMEFRAME[period]];
  const totalCatSpend = useMemo(
    () => Object.values(categories).reduce((a, b) => a + b, 0),
    [categories]
  );
  const animatedTotalCatSpend = useAnimatedNumber(totalCatSpend, 520);

  const exportCsv = () => {
    const header = 'ID,Title,Merchant,Category,Type,Amount,Date,Status\n';
    const rows = state.transactions
      .map(
        (t) =>
          `"${t.id}","${t.title}","${t.merchant}","${t.category}","${t.type}",${t.amount},"${t.date}","${t.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaza-analytics-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast({
      title: 'CSV report exported',
      description: `Downloaded kaza-analytics-${period}.csv`,
      variant: 'success',
    });
  };

  const scale = period === 'week' ? 0.35 : period === 'quarter' ? 2.6 : period === 'year' ? 8.4 : 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#18181B]">Financial Analytics</h2>
          <p className="text-xs text-[#71717A]">
            Cashflow velocity, category breakdown, and merchant intelligence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>

          <KazaTooltip
            title="Download Ledger CSV"
            content="Export all tracked transactions as a spreadsheet-ready CSV file."
          >
            <Button variant="outline" onClick={exportCsv} className="kaza-tactile">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </KazaTooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-12">
        {/* Income vs Expenses Bar Chart */}
        <Card className="@3xl:col-span-7">
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <CardTitle>Income vs. Card Spend</CardTitle>
              <InfoBadgeHint
                title="Cashflow Comparison"
                content="Dark bars show settled inflows; light bars show card spending for each month. Hover any bar pair for exact figures."
              />
            </div>
            <span className="text-[11px] text-[#71717A]">Jan – Jul 2026</span>
          </CardHeader>
          <CardContent>
            <div
              key={period}
              className="mt-2 flex h-56 items-end justify-between gap-3 border-b border-[#EAEAEF] pb-2"
            >
              {MONTHLY_ACTIVITY_SERIES.map((m, idx) => {
                const incomeH = Math.min(96, Math.round(m.heightPct * 0.95));
                const spendH = Math.min(92, Math.round(m.heightPct * 0.72));
                const incomeVal = Math.round(m.amount * 1.15 * scale);
                const spendVal = Math.round(m.amount * 0.78 * scale);
                return (
                  <KazaTooltip
                    key={m.month}
                    title={`${m.month} 2026 (${period})`}
                    content={`Income: ${formatCompactCurrency(incomeVal)} · Spend: ${formatCompactCurrency(spendVal)}`}
                  >
                    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2 cursor-help">
                      <div className="flex h-full w-full items-end justify-center gap-1.5">
                        <div
                          className="animate-kaza-bar-rise w-3.5 rounded-t-md bg-[#232325]"
                          style={{
                            height: `${incomeH}%`,
                            animationDelay: `${idx * 45}ms`,
                          }}
                        />
                        <div
                          className="animate-kaza-bar-rise w-3.5 rounded-t-md bg-[#D4D4D8]"
                          style={{
                            height: `${spendH}%`,
                            animationDelay: `${idx * 45 + 35}ms`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-[#71717A]">{m.month}</span>
                    </div>
                  </KazaTooltip>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-5 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#232325]" />
                Income
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#71717A]">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#D4D4D8]" />
                Card Spending
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="@3xl:col-span-5">
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <CardTitle>Category Distribution</CardTitle>
              <InfoBadgeHint
                title="Category Share"
                content="Percentage weight of each spending category for the selected timeframe."
              />
            </div>
            <span className="tabular-nums text-xs font-semibold text-[#18181B]">
              {formatCompactCurrency(Math.round(animatedTotalCatSpend))}
            </span>
          </CardHeader>
          <CardContent key={period} className="space-y-4 pt-3">
            {(Object.keys(categories) as SpendingCategoryName[]).map((cat, idx) => {
              const val = categories[cat];
              const pct = Math.round((val / Math.max(1, totalCatSpend)) * 100);
              return (
                <KazaTooltip
                  key={cat}
                  title={`${cat} · ${pct}%`}
                  content={`${formatCompactCurrency(val)} out of ${formatCompactCurrency(totalCatSpend)} total category spend.`}
                >
                  <div className="space-y-1.5 cursor-help">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#18181B]">{cat}</span>
                      <span className="tabular-nums text-[#71717A]">
                        {formatCompactCurrency(val)} ·{' '}
                        <strong className="text-[#18181B]">{pct}%</strong>
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#ECECEF]">
                      <div
                        className="animate-kaza-bar-grow-x h-full rounded-full bg-[#232325]"
                        style={{
                          width: `${pct}%`,
                          animationDelay: `${idx * 70}ms`,
                        }}
                      />
                    </div>
                  </div>
                </KazaTooltip>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Merchants */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardTitle>Top Merchants &amp; Settlement</CardTitle>
            <InfoBadgeHint
              title="Merchant Activity"
              content="Largest recent transactions grouped by merchant and category."
            />
          </div>
          <span className="text-[11px] text-[#71717A]">
            {state.transactions.length} tracked entries
          </span>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2.5 @md:grid-cols-2 @3xl:grid-cols-3">
          {state.transactions.slice(0, 6).map((tx) => (
            <div
              key={tx.id}
              className="kaza-tactile flex items-center justify-between rounded-2xl border border-[#EAEAEF] bg-white p-3 hover:border-[#DCDCE2]"
            >
              <div>
                <p className="text-xs font-semibold text-[#18181B]">{tx.merchant}</p>
                <p className="text-[10px] text-[#71717A]">
                  {tx.category} · {tx.date}
                </p>
              </div>
              <span className="tabular-nums text-xs font-semibold text-[#18181B]">
                {formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
