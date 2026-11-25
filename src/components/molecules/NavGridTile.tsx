import type { LucideIcon } from 'lucide-react';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { cn } from '@/lib/utils';

interface NavGridTileProps {
  label: string;
  icon: LucideIcon;
  tooltip?: string;
  active?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function NavGridTile({
  label,
  icon: Icon,
  tooltip,
  active = false,
  compact = false,
  onClick,
}: NavGridTileProps) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'kaza-tactile group flex flex-col items-center justify-center gap-1.5 rounded-[16px] border cursor-pointer select-none',
        compact ? 'h-11 w-11 p-2' : 'h-[66px] w-full px-2 py-2.5',
        active
          ? 'border-[#232325] bg-[#232325] text-white shadow-[0_10px_22px_-10px_rgba(24,24,27,0.55)]'
          : 'border-[#EAEAEF]/90 bg-[#FBFBFB] text-[#52525B] hover:-translate-y-0.5 hover:border-[#DCDCE2] hover:bg-white hover:text-[#18181B] hover:shadow-2xs'
      )}
    >
      <Icon
        className={cn(
          'h-[17px] w-[17px] stroke-[1.75] transition-transform duration-200 ease-out group-hover:scale-110',
          active ? 'text-white' : 'text-[#52525B] group-hover:text-[#18181B]'
        )}
      />
      {!compact && (
        <span
          className={cn(
            'text-[10px] font-medium leading-none tracking-tight',
            active ? 'text-white' : 'text-[#71717A] group-hover:text-[#18181B]'
          )}
        >
          {label}
        </span>
      )}
    </button>
  );

  if (!tooltip) return button;

  return (
    <KazaTooltip title={label} content={tooltip} side="right">
      {button}
    </KazaTooltip>
  );
}
