import React, { ReactNode } from 'react';
import { BadgeVariant, ExagonalBadge } from '../ui/exagonalBadge';

export type StatsExagonSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface StatsExagonProps {
  size?: StatsExagonSize;
  variant?: BadgeVariant;
  stat: number | ReactNode;
  label?: string | null;
  className?: string;
  withShadow?: boolean;
  hideLabel?: boolean;
}

const sizeConfig: Record<
  StatsExagonSize,
  {
    stats_text: string;
    showLabel: boolean;
    label_text: string;
  }
> = {
  sm: {
    stats_text: 'text-[10px]',
    showLabel: false,
    label_text: 'text-[10px]',
  },
  md: {
    stats_text: 'text-xs',
    showLabel: true,
    label_text: 'text-[10px]',
  },
  lg: {
    stats_text: 'text-sm',
    showLabel: true,
    label_text: 'text-xs',
  },
  xl: {
    stats_text: 'text-lg',
    showLabel: true,
    label_text: 'text-sm',
  },
  xxl: {
    stats_text: 'text-xl',
    showLabel: true,
    label_text: 'text-base',
  },
};

export default function StatsExagon({
  size = 'lg',
  stat,
  label = null,
  variant = BadgeVariant.red,
  className = '',
  hideLabel = false,
  withShadow = false,
}: StatsExagonProps) {
  const config = sizeConfig[size];

  return (
    <ExagonalBadge
      variant={variant}
      withShadow={withShadow}
      size={size}
      className={`text-sm ${className}`}
    >
      <div className="flex flex-col items-center">
        <div className={`font-semibold ${config.stats_text}`}>{stat}</div>
        {config.showLabel && !hideLabel && (
          <div className={`text-center ${config.label_text}`}>{label}</div>
        )}
      </div>
    </ExagonalBadge>
  );
}
