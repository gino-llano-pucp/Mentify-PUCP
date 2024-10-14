import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/modules/core/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        btSidebar: 'hover:text-[#00C1BC] text-white hover:border-l-2 hover:border-[#00C1BC]',
        btSidebarActive: 'text-[#00C1BC] border-l-2 border-[#00C1BC]',
        btUser: 'text-white hover:opacity-50 transition-opacity duration-300 ease-in-out',
        btContent:
          'text-[#00C1BC] hover:text-white bg-white hover:bg-[#00C1BC] rounded-md border-2 border-[#00C1BC] hover:border-white',
        btCancelar:
          'text-[#FF4545] hover:text-white bg-white hover:bg-[#FF4545] rounded-md border-2 border-[#FF4545] hover:border-white'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
