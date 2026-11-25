import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface KazaTooltipProps {
  title?: string;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactElement;
}

export function KazaTooltip({
  title,
  content,
  side = 'top',
  children,
}: KazaTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        {title && <p className="mb-0.5 font-semibold text-white">{title}</p>}
        <p className="text-zinc-300">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface InfoBadgeHintProps {
  title?: string;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function InfoBadgeHint({
  title,
  content,
  side = 'top',
  className,
}: InfoBadgeHintProps) {
  return (
    <KazaTooltip title={title} content={content} side={side}>
      <button
        type="button"
        aria-label={title ?? 'Metric explanation'}
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#A1A1AA] transition-colors hover:bg-[#F4F4F6] hover:text-[#18181B] cursor-help focus:outline-none',
          className
        )}
      >
        <HelpCircle className="h-3 w-3" />
      </button>
    </KazaTooltip>
  );
}
