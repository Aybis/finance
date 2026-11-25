import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCompactCurrency } from '@/lib/utils';

interface SemiCircleGaugeProps {
  percentage: number;
  amount: number;
  limit?: number;
  sublabel?: string;
}

export function SemiCircleGauge({
  percentage,
  amount,
  limit,
  sublabel = 'Limit Used',
}: SemiCircleGaugeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const targetPct = Math.max(0, Math.min(100, percentage));
  const animatedPct = mounted ? targetPct : 0;
  const animatedAmount = useAnimatedNumber(amount, 620);

  const radius = 64;
  const cx = 80;
  const cy = 76;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - animatedPct / 100);
  const remaining = typeof limit === 'number' ? Math.max(0, limit - amount) : null;

  return (
    <div className="relative flex flex-col items-center justify-end pt-1">
      <KazaTooltip
        title={`${targetPct}% of Monthly Limit Used`}
        content={
          remaining !== null
            ? `${formatCompactCurrency(amount)} spent out of ${formatCompactCurrency(limit ?? 0)}. ${formatCompactCurrency(remaining)} available before cap.`
            : `${formatCompactCurrency(amount)} used in the current billing cycle.`
        }
      >
        <svg
          width="160"
          height="94"
          viewBox="0 0 160 94"
          className="h-auto w-full max-w-[164px] overflow-visible cursor-help"
          aria-label={`Credit utilization ${targetPct}%`}
        >
          {/* Background arc track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#ECECEF"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Active dark progress arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#232325"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </svg>
      </KazaTooltip>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center">
        <span className="tabular-nums text-[15px] font-semibold tracking-tight text-[#18181B]">
          {formatCompactCurrency(Math.round(animatedAmount))}
        </span>
        <span className="text-[9px] font-medium text-[#71717A]">{sublabel}</span>
        <KazaTooltip
          title="Hard Limit Protection"
          content="Transactions above your monthly limit are automatically blocked to prevent overspend."
        >
          <span className="pointer-events-auto mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#EAEAEF] bg-white text-[#71717A] shadow-2xs cursor-help">
            <Lock className="h-2.5 w-2.5" />
          </span>
        </KazaTooltip>
      </div>
    </div>
  );
}
