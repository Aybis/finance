import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#F4F4F6] text-[#18181B]',
        dark: 'bg-[#232325] text-white',
        positive: 'bg-[#DCFCE7] text-[#15803D]',
        negative: 'bg-[#FEE2E2] text-[#B91C1C]',
        warning: 'bg-amber-100 text-amber-800',
        outline: 'border border-[#EAEAEF] bg-white text-[#71717A]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
