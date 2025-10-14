import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import React from 'react';
import { DicesIcon } from 'lucide-react';
import { getPlaceRanking } from '@/lib/server/place';
import ProfileListItem from '../ProfileListItem/ProfileListItem';
import { getGameRanking } from '@/lib/server/game';
import { Player } from '@/types';

interface RankingProps {
  placeId?: string;
  gameId?: string;
}

export default async function Ranking({ placeId, gameId }: RankingProps) {
  if (!placeId && !gameId) {
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
  if (placeId) {
    ranking = await getPlaceRanking(placeId);
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
