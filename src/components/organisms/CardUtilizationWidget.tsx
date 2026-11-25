import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { StatusPill } from '@/components/atoms/StatusPill';
import { SemiCircleGauge } from '@/components/molecules/SemiCircleGauge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCompactCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function CardUtilizationWidget() {
  const { selectedCard, openModal } = useFinance();

  const pct = Math.min(
    100,
    Math.round(
      (selectedCard.utilizationAmount / Math.max(1, selectedCard.spendingLimit)) * 100
    )
  );
  const animatedPct = useAnimatedNumber(pct, 580);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-1.5">
          <CardTitle>Card Utilization</CardTitle>
          <InfoBadgeHint
            title="Credit Limit Utilization"
            content="Ratio of current cycle spend to your monthly card spending limit. Keeping utilization below 30% optimizes credit health; raise your limit anytime via View All."
          />
        </div>
        <KazaTooltip content="Adjust your monthly spending limit slider">
          <span>
            <StatusPill tone="light" onClick={() => openModal('spending-limit')}>
              View All
            </StatusPill>
          </span>
        </KazaTooltip>
      </CardHeader>

      <CardContent className="flex flex-col justify-between pt-2">
        <KazaTooltip
          title={`${pct}% Credit Usage`}
          content={`${formatCompactCurrency(selectedCard.utilizationAmount)} used of ${formatCompactCurrency(selectedCard.spendingLimit)} monthly limit on ${selectedCard.name}.`}
        >
          <div className="inline-block w-fit cursor-help">
            <p className="tabular-nums text-[22px] font-semibold tracking-tight text-[#18181B]">
              {Math.round(animatedPct)}%
            </p>
            <p className="text-[10px] text-[#71717A]">Credit Usage</p>
          </div>
        </KazaTooltip>

        <SemiCircleGauge
          percentage={pct}
          amount={selectedCard.utilizationAmount}
          limit={selectedCard.spendingLimit}
          sublabel="Limit Used"
        />
      </CardContent>
    </Card>
  );
}
