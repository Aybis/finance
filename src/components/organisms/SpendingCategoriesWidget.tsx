import { useMemo, useState } from 'react';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { StatusPill } from '@/components/atoms/StatusPill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_PRESETS } from '@/data/initialData';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { cn, formatCompactCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';
import type { CategoryTimeframe, SpendingCategoryName } from '@/types/finance';

const CATEGORIES: SpendingCategoryName[] = ['Shopping', 'Dining', 'Travel', 'Others'];

const CATEGORY_DESCRIPTIONS: Record<SpendingCategoryName, string> = {
  Shopping: 'Retail, apparel, electronics, and design studio supplies.',
  Dining: 'Restaurants, cafes, and client hospitality.',
  Travel: 'Flights, transit, hotels, and ride-shares.',
  Others: 'Software subscriptions, equipment leases, and utilities.',
};

export function SpendingCategoriesWidget() {
  const { state } = useFinance();
  const [timeframe, setTimeframe] = useState<CategoryTimeframe>('This Month');
  const [focusedCategory, setFocusedCategory] = useState<SpendingCategoryName>('Shopping');

  const totals = useMemo(() => {
    const base = { ...CATEGORY_PRESETS[timeframe] };
    if (timeframe === 'This Month') {
      const extraTxs = state.transactions.slice(0, Math.max(0, state.transactions.length - 6));
      extraTxs.forEach((tx) => {
        if (tx.type === 'expense') {
          base[tx.category] = Math.round(base[tx.category] + tx.amount);
        }
      });
    }
    return base;
  }, [timeframe, state.transactions]);

  const grandTotal = useMemo(
    () => CATEGORIES.reduce((sum, cat) => sum + totals[cat], 0),
    [totals]
  );

  const focusedAmount = totals[focusedCategory];
  const focusedPct = Math.round((focusedAmount / Math.max(1, grandTotal)) * 100);
  const animatedFocusedAmount = useAnimatedNumber(focusedAmount, 460);
  const animatedFocusedPct = useAnimatedNumber(focusedPct, 460);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle>Spending Categories</CardTitle>
          <InfoBadgeHint
            title="Category Allocation"
            content="Breakdown of your card spending across Shopping, Dining, Travel, and Others. Click any category or bar to inspect its share."
          />
        </div>
        <Select
          value={timeframe}
          onValueChange={(v) => setTimeframe(v as CategoryTimeframe)}
        >
          <SelectTrigger aria-label="Spending categories timeframe">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
            <SelectItem value="This Quarter">This Quarter</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Top metrics grid + right focal callout */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:gap-x-12">
            {CATEGORIES.map((cat) => {
              const isActive = focusedCategory === cat;
              const pct = Math.round((totals[cat] / Math.max(1, grandTotal)) * 100);
              return (
                <KazaTooltip
                  key={cat}
                  title={`${cat} · ${pct}%`}
                  content={CATEGORY_DESCRIPTIONS[cat]}
                >
                  <button
                    type="button"
                    onClick={() => setFocusedCategory(cat)}
                    className={cn(
                      'kaza-tactile text-left cursor-pointer focus:outline-none',
                      isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                    )}
                  >
                    <p className="text-[10px] font-medium text-[#71717A]">{cat}</p>
                    <p className="tabular-nums text-[15px] font-semibold tracking-tight text-[#18181B]">
                      {formatCompactCurrency(totals[cat])}
                    </p>
                  </button>
                </KazaTooltip>
              );
            })}
          </div>

          <KazaTooltip
            title={`Selected Category: ${focusedCategory}`}
            content={`Accounts for ${focusedPct}% of ${formatCompactCurrency(grandTotal)} total spend (${timeframe}).`}
          >
            <div className="flex flex-col items-end cursor-help">
              <StatusPill tone="dark" className="mb-2 px-2 py-0.5 text-[9px]">
                {Math.round(animatedFocusedPct)}%
              </StatusPill>
              <div className="text-right">
                <p className="text-[10px] font-medium text-[#71717A]">
                  {focusedCategory}
                </p>
                <p className="tabular-nums text-[18px] font-semibold tracking-tight text-[#18181B]">
                  {formatCompactCurrency(Math.round(animatedFocusedAmount))}
                </p>
              </div>
            </div>
          </KazaTooltip>
        </div>

        {/* Stepped Horizontal Segmented Bars */}
        <div
          key={timeframe}
          className="grid grid-cols-4 items-end gap-1.5 pt-1"
        >
          {CATEGORIES.map((cat, idx) => {
            const pct = Math.round((totals[cat] / Math.max(1, grandTotal)) * 100);
            const isActive = focusedCategory === cat;
            const heights = ['h-4', 'h-5', 'h-7', 'h-2.5'];
            return (
              <KazaTooltip
                key={cat}
                title={`${cat}: ${formatCompactCurrency(totals[cat])}`}
                content={`${pct}% of total spend (${timeframe}). Click to focus.`}
              >
                <button
                  type="button"
                  onClick={() => setFocusedCategory(cat)}
                  aria-label={`${cat}: ${formatCompactCurrency(totals[cat])} (${pct}%)`}
                  className="group flex flex-col items-stretch gap-1 text-left cursor-pointer focus:outline-none"
                >
                  <div
                    className={cn(
                      'animate-kaza-bar-grow-x w-full rounded-[4px] transition-all duration-200',
                      heights[idx],
                      isActive
                        ? 'bg-[#232325] shadow-sm -translate-y-0.5'
                        : idx === 0
                          ? 'bg-[#D4D4D8] group-hover:bg-[#A1A1AA]'
                          : idx === 1
                            ? 'bg-[#E4E4E7] group-hover:bg-[#A1A1AA]'
                            : idx === 2
                              ? 'bg-[#C4C4CA] group-hover:bg-[#A1A1AA]'
                              : 'bg-[#18181B]/75 group-hover:bg-[#18181B]'
                    )}
                    style={{ animationDelay: `${idx * 65}ms` }}
                  />
                </button>
              </KazaTooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
