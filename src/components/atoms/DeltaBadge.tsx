import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeltaBadgeProps {
  value: string;
  direction: 'up' | 'down' | 'neutral';
  suffix?: string;
  className?: string;
}

export function DeltaBadge({ value, direction, suffix, className }: DeltaBadgeProps) {
  const colorClass =
    direction === 'up'
      ? 'text-[#16A34A]'
      : direction === 'down'
        ? 'text-[#EF4444]'
        : 'text-[#71717A]';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-[10px] font-semibold tabular-nums',
        colorClass,
        className
      )}
    >
      {direction === 'up' && <ArrowUpRight className="h-2.5 w-2.5 stroke-[2.5]" />}
      {direction === 'down' && <ArrowDownRight className="h-2.5 w-2.5 stroke-[2.5]" />}
      <span>{value}</span>
      {suffix && <span className="ml-0.5 font-medium text-[#71717A]">{suffix}</span>}
    </span>
  );
}
