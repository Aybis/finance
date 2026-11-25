import type { LucideIcon } from 'lucide-react';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { cn } from '@/lib/utils';

interface QuickActionRowProps {
  label: string;
  icon: LucideIcon;
  tooltip?: string;
  active?: boolean;
  badgeText?: string;
  compact?: boolean;
  onClick?: () => void;
}

export function QuickActionRow({
  label,
  icon: Icon,
  tooltip,
  active = false,
  badgeText,
  compact = false,
  onClick,
}: QuickActionRowProps) {
  const row = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'kaza-tactile flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[11px] font-medium cursor-pointer',
        compact && 'justify-center px-2',
        active
          ? 'bg-sky-50 text-sky-900'
          : 'text-[#52525B] hover:translate-x-0.5 hover:bg-white hover:text-[#18181B]'
      )}
    >
      <Icon
        className={cn(
          'h-3.5 w-3.5 shrink-0 stroke-[1.8]',
          active ? 'text-sky-600' : 'text-[#71717A]'
        )}
      />
      {!compact && <span className="flex-1 truncate">{label}</span>}
      {!compact && badgeText && (
        <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[9px] font-semibold text-sky-700">
          {badgeText}
        </span>
      )}
    </button>
  );

  if (!tooltip) return row;

  return (
    <KazaTooltip title={label} content={tooltip} side="right">
      {row}
    </KazaTooltip>
  );
}
