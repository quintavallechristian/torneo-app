import { Game } from '@/types';
import React from 'react';
import GameCard from '../GameCard/GameCard';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import EmptyArea from '../EmptyArea/EmptyArea';
import { createClient } from '@/utils/supabase/server';
import { AddGameModal } from '../AddGameModal/AddGameModal';

interface GameListProps {
  games?: Game[] | undefined;
  placeId?: string;
}

export default async function GameList({ games, placeId }: GameListProps) {
  console.log('Games:', games);
  let gamesToShow: Game[] | null = null;
  if (games) {
    gamesToShow = games;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from('places_games')
      .select('games(*)')
      .eq('place_id', placeId);
    const placesGames = data as { games: Game }[] | null;
    gamesToShow = placesGames?.map((pg) => pg.games) || [];
  }

  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId,
  });
  return (
    <>
      {gamesToShow && gamesToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamesToShow.map((game) => (
            <GameCard key={game.id} game={game} small />
          ))}
          <div className="flex items-center gap-4">
            {canManagePlaces && placeId && <AddGameModal placeId={placeId} />}
          </div>
        </div>
      ) : (
        <EmptyArea
          title="Nessuna partita"
          message="Nessuna partita giocata"
          className="w-full"
        >
          <div className="flex items-center gap-4">
            {canManagePlaces && placeId && <AddGameModal placeId={placeId} />}
          </div>
        </EmptyArea>
      )}
    </>
  );
}
