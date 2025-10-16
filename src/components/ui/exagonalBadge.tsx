import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const enum BadgeVariant {
  default = 'default',
  secondary = 'secondary',
  destructive = 'destructive',
  outline = 'outline',
  blue = 'blue',
  red = 'red',
  amber = 'amber',
  gold = 'gold',
  silver = 'silver',
  bronze = 'bronze',
  opaque = 'opaque',
}

const badgeVariants = cva('size-8 flex items-center justify-center', {
  variants: {
    variant: {
      [BadgeVariant.default]:
        'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      [BadgeVariant.secondary]:
        'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
      [BadgeVariant.destructive]:
        'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
      [BadgeVariant.outline]:
        'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      [BadgeVariant.blue]:
        'border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40 dark:bg-blue-900',
      [BadgeVariant.red]:
        'border-transparent bg-red-500 text-white [a&]:hover:bg-red-600 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-900',
      [BadgeVariant.amber]:
        'border-transparent bg-amber-500 text-white [a&]:hover:bg-amber-600 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/40 dark:bg-amber-500',
      [BadgeVariant.gold]:
        'border-transparent bg-yellow-400 text-white [a&]:hover:bg-yellow-500 focus-visible:ring-yellow-400/20 dark:focus-visible:ring-yellow-400/40 dark:bg-yellow-600 ring-offset-4 ring-yellow-300',
      [BadgeVariant.silver]:
        'border-transparent bg-slate-400 text-white [a&]:hover:bg-slate-500 focus-visible:ring-slate-400/20 dark:focus-visible:ring-slate-400/40 dark:bg-slate-600',
      [BadgeVariant.bronze]:
        'border-transparent bg-amber-600 text-white [a&]:hover:bg-amber-700 focus-visible:ring-amber-600/20 dark:focus-visible:ring-amber-600/40 dark:bg-amber-700',
      [BadgeVariant.opaque]:
        'border-transparent bg-indigo-50/5 text-indigo-100 [a&]:hover:bg-indigo-50/10 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-indigo-500/40',
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
