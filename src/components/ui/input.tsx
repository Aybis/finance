import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-9 w-full rounded-xl border border-[#EAEAEF] bg-[#F9F9FB] px-3 py-1.5 text-xs text-[#18181B] placeholder:text-[#A1A1AA] transition-colors focus:border-[#232325] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-[11px] font-medium text-[#71717A]', className)}
    {...props}
  />
));
Label.displayName = 'Label';
