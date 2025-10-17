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
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import StatsExagon from '../StatsExagon/StatsExagon';

interface RankingProps {
  placeId?: string;
  gameId?: string;
}

export default async function Ranking({ placeId, gameId }: RankingProps) {
  const { profile } = await getAuthenticatedUserWithProfile();
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
      {ranking.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DicesIcon />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyTitle>Nessun dato</EmptyTitle>
          <EmptyDescription>
            Nessun giocatore ha ancora guadagnato punti in questo locale.
          </EmptyDescription>
        </Empty>
      )}
      {ranking.map((player, index) => (
        <ProfileListItem
          key={player.id}
          player={player}
          profile={profile}
          index={index + 1}
          StatsSlot={
            <StatsExagon size="md" stat={player.points || 0} label="ELO" />
          }
        />
      ))}
    </>
  );
}
