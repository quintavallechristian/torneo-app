import { Game } from '@/types';
import React from 'react';
import GameCard from '../GameCard/GameCard';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import EmptyArea from '../EmptyArea/EmptyArea';
import { createClient } from '@/utils/supabase/server';
import { AddGameModal } from '../AddGameModal/AddGameModal';
import { GameSearchInput } from '../GameSearchInput/GameSearchInput';

interface GameListProps {
  games?: Game[] | undefined;
  placeId?: string;
  searchQuery?: string;
}

export default async function GameList({
  games,
  placeId,
  searchQuery,
}: GameListProps) {
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
    gamesToShow = (placesGames?.map((pg) => pg.games) || [])
      .filter((game) => (game?.bgg_rank || 0) > 0)
      .sort((a, b) => (a?.bgg_rank || 0) - (b?.bgg_rank || 0));
  }

  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId,
  });

  // Filtra i giochi in base alla query di ricerca
  const filteredGames = searchQuery
    ? gamesToShow?.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : gamesToShow;

  return (
    <>
      {canManagePlaces && placeId && (
        <div className="mt-4 flex gap-2 justify-between">
          <GameSearchInput defaultValue={searchQuery} />
          <AddGameModal placeId={placeId} />
        </div>
      )}
      {filteredGames && filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} small />
          ))}
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
