import * as React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark' | 'ghost';
  size?: 'sm' | 'md';
  badgeCount?: number;
  dot?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'light',
      size = 'md',
      badgeCount,
      dot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'relative inline-flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20',
          size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
          variant === 'light' &&
            'border border-[#EAEAEF] bg-white text-[#18181B] shadow-2xs hover:bg-[#F9F9FB]',
          variant === 'dark' && 'bg-[#232325] text-white hover:bg-[#18181B]',
          variant === 'ghost' && 'text-[#71717A] hover:bg-[#F4F4F6] hover:text-[#18181B]',
          className
        )}
        {...props}
      >
        {children}
        {dot && !badgeCount && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#16A34A] ring-2 ring-white" />
        )}
        {typeof badgeCount === 'number' && badgeCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#232325] px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
