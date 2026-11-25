import { useState } from 'react';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { StatusPill } from '@/components/atoms/StatusPill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MONTHLY_SPENDING_BARS } from '@/data/initialData';
import { useFinance } from '@/store/FinanceContext';
import { cn, formatCompactCurrency } from '@/lib/utils';

export function MonthlySpendingWidget() {
  const { setActiveNav } = useFinance();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(20);

  const activeVal = hoveredIdx !== null ? MONTHLY_SPENDING_BARS[hoveredIdx] : 86;
  const variancePct = Math.max(4, Math.round(activeVal * 0.14));

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="items-start pb-1">
        <div>
          <div className="flex items-center gap-1.5">
            <CardTitle>Monthly Spending</CardTitle>
            <InfoBadgeHint
              title="30-Day Spending Skyline"
              content="Each bar represents one day of the current month. Taller bars indicate higher daily card spend; hover any bar for its daily estimate."
            />
          </div>
          <p className="text-[10px] text-[#71717A]">This Month</p>
        </div>
        <KazaTooltip content="Open full Analytics breakdown for daily spending trends">
          <span>
            <StatusPill tone="light" onClick={() => setActiveNav('analytics')}>
              View All
            </StatusPill>
          </span>
        </KazaTooltip>
      </CardHeader>

      <CardContent className="relative pt-4">
        {/* Dark floating peak callout pill */}
        <div className="mb-1 flex items-center justify-center">
          <KazaTooltip
            title="Daily Spending Variance"
            content={`Selected day is +${variancePct}% above your 30-day baseline average.`}
          >
            <span>
              <StatusPill tone="dark" className="px-2 py-0.5 text-[9px] transition-all duration-200">
                +{variancePct}%
              </StatusPill>
            </span>
          </KazaTooltip>
        </div>

        {/* Dense vertical micro-bar skyline */}
        <div
          className="flex h-20 items-end justify-between gap-[2px] border-b border-[#EAEAEF] pb-0.5"
          onMouseLeave={() => setHoveredIdx(20)}
        >
          {MONTHLY_SPENDING_BARS.map((val, idx) => {
            const isHighlighted = idx >= 12 && idx <= 25;
            const isHovered = hoveredIdx === idx;
            const estSpend = Math.round(val * 4.2);
            return (
              <KazaTooltip
                key={idx}
                title={`Day ${idx + 1} · Jul 2026`}
                content={`Estimated spend: ${formatCompactCurrency(estSpend)} (+${Math.max(4, Math.round(val * 0.14))}% vs avg)`}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => setActiveNav('analytics')}
                  aria-label={`Day ${idx + 1} spending ${formatCompactCurrency(estSpend)}`}
                  className="group flex h-full flex-1 items-end cursor-pointer focus:outline-none"
                >
                  <span
                    className={cn(
                      'animate-kaza-bar-rise w-full rounded-t-[2px] transition-colors duration-150',
                      isHovered
                        ? 'bg-[#18181B]'
                        : isHighlighted
                          ? 'bg-[#71717A]'
                          : 'bg-[#DCDCE2] group-hover:bg-[#52525B]'
                    )}
                    style={{
                      height: `${val}%`,
                      animationDelay: `${idx * 14}ms`,
                    }}
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
