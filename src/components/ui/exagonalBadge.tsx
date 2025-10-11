import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva('size-8 flex items-center justify-center', {
  variants: {
    variant: {
      default:
        'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      secondary:
        'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
      destructive:
        'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
      outline:
        'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      blue: 'border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40 dark:bg-blue-500/60',
      red: 'border-transparent bg-red-500 text-white [a&]:hover:bg-red-600 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function ExagonalBadge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      style={{
        clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
      }}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { ExagonalBadge, badgeVariants };
