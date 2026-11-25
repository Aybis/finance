import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DeltaBadge } from '@/components/atoms/DeltaBadge';
import { IconButton } from '@/components/atoms/IconButton';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { StatusPill } from '@/components/atoms/StatusPill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CARD_USAGE_COLUMNS } from '@/data/initialData';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { cn, formatCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function CardUsageWidget() {
  const { selectedCard, setActiveNav } = useFinance();
  const [activeIdx, setActiveIdx] = useState(4);
  const activeCol = CARD_USAGE_COLUMNS[activeIdx];
  const animatedUsedToday = useAnimatedNumber(selectedCard.usedToday, 580);

  return (
    <Card className="@container flex flex-col justify-between">
      <CardHeader className="items-start pb-1">
        <div>
          <div className="flex items-center gap-1.5">
            <CardTitle>Card Usage</CardTitle>
            <InfoBadgeHint
              title="Intraday Card Velocity"
              content="Shows today's cumulative authorized spend on the selected card across 2-hour windows (09h–19h). Click any column to inspect peak share."
            />
          </div>
          <p className="text-[10px] text-[#71717A]">Used Today</p>
        </div>
        <KazaTooltip content="View full daily spending analytics">
          <IconButton
            variant="light"
            size="sm"
            aria-label="Open card usage analytics"
            onClick={() => setActiveNav('analytics')}
            className="kaza-tactile"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </IconButton>
        </KazaTooltip>
      </CardHeader>

      <CardContent className="flex flex-col items-stretch justify-between gap-3 pt-2 @xs:flex-row @xs:items-end">
        <div className="space-y-1 pb-1">
          <KazaTooltip
            title={`Today's Total · ${selectedCard.name}`}
            content="Sum of completed and pending card transactions processed today."
          >
            <p className="tabular-nums text-[20px] font-semibold tracking-tight text-[#18181B] cursor-help">
              {formatCurrency(animatedUsedToday)}
            </p>
          </KazaTooltip>
          <KazaTooltip
            title="Daily Spend Pace"
            content="Card usage today is 56.57% higher than your 7-day daily average."
          >
            <span className="inline-block cursor-help">
              <DeltaBadge value="+56.57%" direction="up" suffix="Today" />
            </span>
          </KazaTooltip>
        </div>

        {/* Hatched vertical column chart */}
        <div className="relative flex h-24 flex-1 items-end justify-end gap-1.5 pt-6">
          {CARD_USAGE_COLUMNS.map((col, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <div
                key={col.label}
                className="relative flex h-full max-w-[26px] flex-1 flex-col items-center justify-end"
              >
                {isSelected && (
                  <div className="absolute -top-1 z-10 transition-transform duration-200">
                    <StatusPill tone="dark" className="px-1.5 py-0.5 text-[9px]">
                      {activeCol.pct}%
                    </StatusPill>
                  </div>
                )}
                <KazaTooltip
                  title={`${col.label} Window`}
                  content={`${formatCurrency(col.amount)} authorized (${col.pct}% peak capacity).`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    aria-label={`${col.label}: ${col.pct}% usage`}
                    className={cn(
                      'animate-kaza-bar-rise w-full rounded-t-md border transition-colors duration-200 cursor-pointer',
                      isSelected
                        ? 'bg-kaza-hatch-dark border-[#232325]'
                        : 'bg-kaza-hatch border-[#DCDCE2]/80 hover:border-[#71717A]'
                    )}
                    style={{
                      height: `${col.pct}%`,
                      animationDelay: `${idx * 55}ms`,
                    }}
                  />
                </KazaTooltip>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
