import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { IconButton } from '@/components/atoms/IconButton';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MONTHLY_ACTIVITY_SERIES } from '@/data/initialData';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { cn, formatCompactCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function MonthlyActivityWidget() {
  const { setActiveNav } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState('Apr');

  const activeItem =
    MONTHLY_ACTIVITY_SERIES.find((m) => m.month === selectedMonth) ??
    MONTHLY_ACTIVITY_SERIES[3];

  const animatedAmount = useAnimatedNumber(activeItem.amount, 500);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-1.5">
          <CardTitle>Monthly Activity</CardTitle>
          <InfoBadgeHint
            title="Monthly Volume (Jan–Jul)"
            content="Total incoming + outgoing card settlement volume per month. Select any month column to inspect its exact volume."
          />
        </div>
        <KazaTooltip content="Open full Monthly Analytics">
          <IconButton
            variant="light"
            size="sm"
            aria-label="View full monthly analytics"
            onClick={() => setActiveNav('analytics')}
            className="kaza-tactile"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </IconButton>
        </KazaTooltip>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        <div className="text-center">
          <p className="tabular-nums text-[15px] font-semibold tracking-tight text-[#18181B]">
            {formatCompactCurrency(Math.round(animatedAmount))}
          </p>
          <p className="text-[10px] text-[#71717A]">
            {selectedMonth === 'Apr' ? 'This Month' : `${selectedMonth} 2026`}
          </p>
        </div>

        {/* Fine vertical striped column chart Jan - Jul */}
        <div className="flex h-24 items-end justify-between gap-2 px-1">
          {MONTHLY_ACTIVITY_SERIES.map((item, idx) => {
            const isSelected = item.month === selectedMonth;
            return (
              <KazaTooltip
                key={item.month}
                title={`${item.month} 2026`}
                content={`Total settled volume: ${formatCompactCurrency(item.amount)}`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedMonth(item.month)}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5 cursor-pointer focus:outline-none"
                >
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={cn(
                        'animate-kaza-bar-rise w-full rounded-t-[4px] transition-opacity duration-200',
                        isSelected
                          ? 'bg-kaza-stripes-vertical-dark'
                          : 'bg-kaza-stripes-vertical opacity-70 group-hover:opacity-100'
                      )}
                      style={{
                        height: `${item.heightPct}%`,
                        animationDelay: `${idx * 55}ms`,
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] transition-colors',
                      isSelected
                        ? 'font-semibold text-[#18181B]'
                        : 'text-[#71717A] group-hover:text-[#18181B]'
                    )}
                  >
                    {item.month}
                  </span>
                </button>
              </KazaTooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
