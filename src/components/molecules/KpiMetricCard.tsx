import { DeltaBadge } from '@/components/atoms/DeltaBadge';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { Sparkline } from '@/components/atoms/Sparkline';
import { cn } from '@/lib/utils';

interface KpiMetricCardProps {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'neutral';
  sparkline: number[];
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

export function KpiMetricCard({
  label,
  value,
  delta,
  direction,
  sparkline,
  tooltip,
  onClick,
  className,
}: KpiMetricCardProps) {
  const cardNode = (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        '@container kaza-tactile flex items-center justify-between gap-2 rounded-[18px] border border-transparent bg-transparent px-3 py-2',
        onClick &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-[#EAEAEF] hover:bg-white hover:shadow-xs',
        className
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-[10px] font-medium text-[#71717A]">{label}</p>
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="tabular-nums text-[17px] font-semibold tracking-tight text-[#18181B] @xs:text-[19px]">
            {value}
          </span>
          <DeltaBadge value={delta} direction={direction} />
        </div>
      </div>
      <Sparkline points={sparkline} className="hidden @xs:block" />
    </div>
  );

  if (!tooltip) return cardNode;

  return (
    <KazaTooltip title={label} content={tooltip} side="bottom">
      {cardNode}
    </KazaTooltip>
  );
}
