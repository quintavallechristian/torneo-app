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
        'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
      [BadgeVariant.secondary]:
        'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
      [BadgeVariant.destructive]:
        'bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
      [BadgeVariant.outline]:
        'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      [BadgeVariant.blue]:
        'bg-blue-500 text-white [a&]:hover:bg-blue-600 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40 dark:bg-blue-900',
      [BadgeVariant.red]:
        'bg-red-500 text-white [a&]:hover:bg-red-600 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-900',
      [BadgeVariant.amber]:
        'bg-amber-500 text-white [a&]:hover:bg-amber-600 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/40 dark:bg-amber-500',
      [BadgeVariant.gold]:
        'bg-yellow-400 text-white [a&]:hover:bg-yellow-500 focus-visible:ring-yellow-400/20 dark:focus-visible:ring-yellow-400/40 dark:bg-yellow-600 ring-offset-4 ring-yellow-300',
      [BadgeVariant.silver]:
        'bg-slate-400 text-white [a&]:hover:bg-slate-500 focus-visible:ring-slate-400/20 dark:focus-visible:ring-slate-400/40 dark:bg-slate-600',
      [BadgeVariant.bronze]:
        'bg-amber-600 text-white [a&]:hover:bg-amber-700 focus-visible:ring-amber-600/20 dark:focus-visible:ring-amber-600/40 dark:bg-amber-700',
      [BadgeVariant.opaque]:
        'bg-indigo-50/5 text-indigo-100 [a&]:hover:bg-indigo-50/10 focus-visible:ring-indigo-500/20 dark:focus-visible:ring-indigo-500/40',
    },
    size: {
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
      [BadgeVariant.default]: 'bg-primary/50',
      [BadgeVariant.secondary]: 'bg-secondary/50',
      [BadgeVariant.destructive]: 'bg-destructive/50',
      [BadgeVariant.outline]: 'bg-border',
      [BadgeVariant.blue]: 'bg-blue-300',
      [BadgeVariant.red]: 'bg-red-300',
      [BadgeVariant.amber]: 'bg-amber-300',
      [BadgeVariant.gold]: 'bg-yellow-300',
      [BadgeVariant.silver]: 'bg-slate-300',
      [BadgeVariant.bronze]: 'bg-amber-400',
      [BadgeVariant.opaque]: 'bg-indigo-300/30',
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
        size === 'sm' && 'size-6',
        size === 'md' && 'size-8',
        size === 'lg' && 'size-10',
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
