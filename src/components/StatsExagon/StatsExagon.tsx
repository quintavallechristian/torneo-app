import React, { ReactNode } from 'react';
import { BadgeVariant, ExagonalBadge } from '../ui/exagonalBadge';

interface StatsExagonProps {
  small?: boolean;
  medium?: boolean;
  variant?: BadgeVariant;
  stat: number | ReactNode;
  label?: string | null;
  className?: string;
}

export default function StatsExagon({
  small = false,
  medium = false,
  stat,
  label = null,
  variant = BadgeVariant.red,
  className = '',
}: StatsExagonProps) {
  return (
    <ExagonalBadge
      variant={variant}
      className={`text-sm ${className} ${
        small ? 'size-8' : medium ? 'size-12' : 'size-14'
      }`}
    >
      <div className="flex flex-col items-center">
        <div
          className={`font-semibold ${
            small ? 'text-[10px]' : medium ? 'text-sm' : 'text-base'
          }`}
        >
          {stat}
        </div>
        {!small && <div className="text-[10px]">{label}</div>}
      </div>
    </ExagonalBadge>
  );
}
