import * as React from 'react';
import { cn } from '@/lib/utils';

interface StatusPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'dark' | 'light' | 'frozen';
}

export function StatusPill({
  tone = 'dark',
  className,
  children,
  onClick,
  ...props
}: StatusPillProps) {
  const Comp = onClick ? 'button' : 'span';
  return (
    <Comp
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      {...(props as Record<string, unknown>)}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-tight transition-colors tabular-nums',
        tone === 'dark' && 'bg-[#232325] text-white shadow-sm',
        tone === 'light' &&
          'border border-[#EAEAEF] bg-white text-[#52525B] hover:bg-[#F4F4F6] hover:text-[#18181B]',
        tone === 'frozen' && 'bg-sky-100 text-sky-800',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Comp>
  );
}
