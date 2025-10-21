'use client';
import { Badge } from '@/components/ui/badge';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { GameStats, PlaceStats } from '@/types';
import { BadgeVariant } from '../ui/exagonalBadge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import StatsExagon from '../StatsExagon/StatsExagon';

interface PlaceCardProps {
  stats: PlaceStats | GameStats;
  position: number;
  small?: boolean;
}

export default function StatsCard({ stats, position, small }: PlaceCardProps) {
  return (
    <SpotlightCard className="px-4 py-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="items-center p-0 hover:underline-0">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-lg font-bold">Le tue statistiche</div>
              </div>
              <div className="text-lg font-medium text-right flex gap-4">
                <StatsExagon
                  size={small ? 'sm' : 'md'}
                  stat={stats.points}
                  label="ELO"
                />
                <StatsExagon
                  size={small ? 'sm' : 'md'}
                  stat={position}
                  label="POS"
                  variant={BadgeVariant.amber}
                />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 mt-4 md:mt-0">
              <Badge className="bg-green-200 text-green-900">
                Vittorie: {stats.win}
              </Badge>
              <Badge className="bg-red-200 text-red-900">
                Sconfitte: {stats.loss}
              </Badge>
              <Badge className="bg-yellow-200 text-yellow-900">
                Pareggi: {stats.draw}
              </Badge>
              <Badge className="bg-purple-200 text-purple-900">
                Minuti giocati: {stats.minutes_played}
              </Badge>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SpotlightCard>
  );
}
