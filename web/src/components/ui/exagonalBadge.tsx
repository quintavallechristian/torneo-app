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

const badgeVariants = cva('relative flex items-center justify-center', {
  variants: {
    variant: {
      [BadgeVariant.default]:
        'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground [a&]:hover:from-primary/90 [a&]:hover:to-primary/70',
      [BadgeVariant.secondary]:
        'bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground [a&]:hover:from-secondary/90 [a&]:hover:to-secondary/70',
      [BadgeVariant.destructive]:
        'bg-gradient-to-br from-destructive to-destructive/80 text-white [a&]:hover:from-destructive/90 [a&]:hover:to-destructive/70 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:from-destructive/60 dark:to-destructive/40',
      [BadgeVariant.outline]:
        'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      [BadgeVariant.blue]:
        'bg-gradient-to-br from-blue-500 to-blue-600 text-white [a&]:hover:from-blue-600 [a&]:hover:to-blue-700 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40 dark:from-blue-900 dark:to-blue-950',
      [BadgeVariant.red]:
        'bg-gradient-to-br from-red-500 to-red-600 text-white [a&]:hover:from-red-600 [a&]:hover:to-red-700 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:from-red-900 dark:to-red-950',
      [BadgeVariant.amber]:
        'bg-gradient-to-br from-amber-500 to-amber-600 text-white [a&]:hover:from-amber-600 [a&]:hover:to-amber-700 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/40 dark:from-amber-500 dark:to-amber-600',
      [BadgeVariant.gold]:
        'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white [a&]:hover:from-yellow-500 [a&]:hover:to-yellow-600 focus-visible:ring-yellow-400/20 dark:focus-visible:ring-yellow-400/40 dark:from-yellow-600 dark:to-yellow-700 ring-offset-4 ring-yellow-300',
      [BadgeVariant.silver]:
        'bg-gradient-to-br from-slate-400 to-slate-500 text-white [a&]:hover:from-slate-500 [a&]:hover:to-slate-600 focus-visible:ring-slate-400/20 dark:focus-visible:ring-slate-400/40 dark:from-slate-600 dark:to-slate-700',
      [BadgeVariant.bronze]:
        'bg-gradient-to-br from-amber-600 to-amber-700 text-white [a&]:hover:from-amber-700 [a&]:hover:to-amber-800 focus-visible:ring-amber-600/20 dark:focus-visible:ring-amber-600/40 dark:from-amber-700 dark:to-amber-800',
      [BadgeVariant.opaque]:
        'bg-gradient-to-br from-indigo-50/5 to-indigo-50/10 text-indigo-100 [a&]:hover:from-indigo-50/10 [a&]:hover:to-indigo-50/15 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-indigo-500/40',
    },
    size: {
      xs: 'size-4 text-xs',
      sm: 'size-6 text-xs',
      md: 'size-8 text-sm',
      lg: 'size-10 text-base',
      xl: 'size-12 text-lg',
      xxl: 'size-20 text-xl',
    },
    withShadow: {
      true: 'drop-shadow-lg',
      false: '',
    },
  },
  defaultVariants: {
    variant: BadgeVariant.default,
    size: 'md',
    withShadow: false,
  },
});

const borderVariants = cva('', {
  variants: {
    variant: {
      [BadgeVariant.default]: 'bg-gradient-to-br from-primary/60 to-primary/40',
      [BadgeVariant.secondary]:
        'bg-gradient-to-br from-secondary/60 to-secondary/40',
      [BadgeVariant.destructive]:
        'bg-gradient-to-br from-destructive/60 to-destructive/40',
      [BadgeVariant.outline]: 'bg-gradient-to-br from-border to-border/80',
      [BadgeVariant.blue]: 'bg-gradient-to-br from-blue-300 to-blue-400',
      [BadgeVariant.red]: 'bg-gradient-to-br from-red-300 to-red-400',
      [BadgeVariant.amber]: 'bg-gradient-to-br from-amber-300 to-amber-400',
      [BadgeVariant.gold]: 'bg-gradient-to-br from-yellow-300 to-yellow-400',
      [BadgeVariant.silver]: 'bg-gradient-to-br from-slate-300 to-slate-400',
      [BadgeVariant.bronze]: 'bg-gradient-to-br from-amber-400 to-amber-500',
      [BadgeVariant.opaque]:
        'bg-gradient-to-br from-indigo-300/30 to-indigo-300/20',
    },
  },
  defaultVariants: {
    variant: BadgeVariant.default,
  },
});

// Shadow colors for each variant
const shadowColors: Record<BadgeVariant, string> = {
  [BadgeVariant.default]: 'rgba(99, 102, 241, 0.3)', // indigo
  [BadgeVariant.secondary]: 'rgba(100, 116, 139, 0.3)', // slate
  [BadgeVariant.destructive]: 'rgba(239, 68, 68, 0.3)', // red
  [BadgeVariant.outline]: 'rgba(0, 0, 0, 0.3)', // black
  [BadgeVariant.blue]: 'rgba(59, 130, 246, 0.3)', // blue
  [BadgeVariant.red]: 'rgba(239, 68, 68, 0.3)', // red
  [BadgeVariant.amber]: 'rgba(245, 158, 11, 0.3)', // amber
  [BadgeVariant.gold]: 'rgba(250, 204, 21, 0.3)', // yellow
  [BadgeVariant.silver]: 'rgba(148, 163, 184, 0.3)', // slate
  [BadgeVariant.bronze]: 'rgba(217, 119, 6, 0.3)', // amber-600
  [BadgeVariant.opaque]: 'rgba(99, 102, 241, 0.3)', // indigo
};

function ExagonalBadge({
  className,
  variant,
  size,
  withShadow = false,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    withShadow?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';
  const hexagonClipPath =
    'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)';

  const shadowColor = variant
    ? shadowColors[variant]
    : shadowColors[BadgeVariant.default];

  return (
    <Comp
      data-slot="badge"
      className={cn(
        'relative inline-flex items-center justify-center bg-transparent',
        size === 'xs' && 'size-8',
        size === 'sm' && 'size-10',
        size === 'md' && 'size-12',
        size === 'lg' && 'size-16',
        size === 'xl' && 'size-20',
        size === 'xxl' && 'size-30',
        className,
      )}
      style={
        withShadow
          ? { filter: `drop-shadow(0 0 40px ${shadowColor})` }
          : undefined
      }
      {...props}
    >
      {/* Border layer - larger hexagon */}
      <span
        className={cn('absolute inset-0', borderVariants({ variant }))}
        style={{
          clipPath: hexagonClipPath,
        }}
      />
      {/* Content layer - smaller hexagon */}
      <span
        className={cn(
          badgeVariants({ variant }),
          'absolute flex items-center justify-center',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-lg',
          size === 'xxl' && 'text-xl',
        )}
        style={{
          clipPath: hexagonClipPath,
          width: 'calc(100% - 4px)',
          height: 'calc(100% - 4px)',
        }}
      >
        {props.children}
      </span>
    </Comp>
  );
}

export { ExagonalBadge, badgeVariants };
