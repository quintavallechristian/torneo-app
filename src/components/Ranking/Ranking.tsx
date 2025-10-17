import React from 'react';
import { getPlaceRanking } from '@/lib/server/place';
import ProfileListItem from '../ProfileListItem/ProfileListItem';
import { getGameRanking } from '@/lib/server/game';
import { Player } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import StatsExagon from '../StatsExagon/StatsExagon';
import EmptyArea from '../EmptyArea/EmptyArea';

interface RankingProps {
  placeId?: string;
  gameId?: string;
}

export default async function Ranking({ placeId, gameId }: RankingProps) {
  const { profile } = await getAuthenticatedUserWithProfile();
  if (!placeId && !gameId) {
    return (
      <EmptyArea
        title="Nessuno in classifica"
        message="Gioca per entrare in classifica"
      />
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
        <EmptyArea
          className="w-full"
          title="Nessuno in classifica"
          message={`Nessun giocatore ha ancora guadagnato punti in questo ${
            placeId ? 'luogo' : 'gioco'
          }.`}
        />
      )}
      {ranking.map((player, index) => (
        <ProfileListItem
          key={player.id}
          player={player}
          profile={profile}
          index={index + 1}
          StatsSlot={<StatsExagon size="sm" stat={player.points || 0} />}
        />
      ))}
    </>
  );
}
