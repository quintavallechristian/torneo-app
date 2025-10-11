import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import React from 'react';
import { DicesIcon } from 'lucide-react';
import { getLocationRanking } from '@/lib/location';
import ProfileListItem from '../ProfileListItem/ProfileListItem';
import { getGameRanking } from '@/lib/game';
import { Player } from '@/types';

interface RankingProps {
  locationId?: string;
  gameId?: string;
}

export default async function Ranking({ locationId, gameId }: RankingProps) {
  if (!locationId && !gameId) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DicesIcon />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No data found</EmptyDescription>
      </Empty>
    );
  }
  let ranking: Player[] = [];
  if (locationId) {
    ranking = await getLocationRanking(locationId);
  }
  if (gameId) {
    ranking = await getGameRanking(gameId);
  }

  return (
    <>
      {ranking.map((player, index) => (
        <ProfileListItem key={player.id} player={player} index={index + 1} />
      ))}
    </>
  );
}
