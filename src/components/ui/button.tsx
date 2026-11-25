import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-[#232325] text-white hover:bg-[#18181B] shadow-xs',
        secondary: 'bg-[#F4F4F6] text-[#18181B] hover:bg-[#EAEAEF]',
        outline:
          'border border-[#EAEAEF] bg-white text-[#18181B] hover:bg-[#F9F9FB] shadow-2xs',
        ghost: 'text-[#71717A] hover:bg-[#F4F4F6] hover:text-[#18181B]',
        destructive: 'bg-[#EF4444] text-white hover:bg-[#DC2626]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 px-3 text-[11px]',
        lg: 'h-10 px-5 text-sm',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
