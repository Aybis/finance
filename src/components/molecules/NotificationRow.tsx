import { ArrowRightLeft, Award, CreditCard, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/types/finance';

interface NotificationRowProps {
  item: NotificationItem;
  onRead?: (id: string) => void;
}

export function NotificationRow({ item, onRead }: NotificationRowProps) {
  const Icon =
    item.type === 'card'
      ? CreditCard
      : item.type === 'transfer'
        ? ArrowRightLeft
        : item.type === 'security'
          ? ShieldAlert
          : Award;

  return (
    <button
      type="button"
      onClick={() => onRead?.(item.id)}
      className={cn(
        'flex w-full items-start gap-2.5 rounded-2xl p-2.5 text-left transition-colors cursor-pointer',
        item.read ? 'bg-transparent hover:bg-[#F9F9FB]' : 'bg-[#F4F4F6]/80 hover:bg-[#F4F4F6]'
      )}
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#18181B] shadow-2xs">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-semibold text-[#18181B]">{item.title}</p>
          {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#232325]" />}
        </div>
        <p className="line-clamp-2 text-[10px] leading-snug text-[#71717A]">{item.description}</p>
        <p className="text-[9px] text-[#A1A1AA]">{item.timestamp}</p>
      </div>
    </button>
  );
}
