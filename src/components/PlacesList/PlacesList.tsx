import { Place } from '@/types';
import React from 'react';
import EmptyArea from '../EmptyArea/EmptyArea';
import { createClient } from '@/utils/supabase/server';
import PlaceCard from '../PlaceCard/PlaceCard';

interface PlacesListProps {
  places?: Place[] | undefined;
  gameId?: string;
}

export default async function PlacesList({ places, gameId }: PlacesListProps) {
  let placesToShow: Place[] | null = null;
  if (places) {
    placesToShow = places;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from('places_games')
      .select('places(*)')
      .eq('game_id', gameId);
    const placesGames = data as { places: Place }[] | null;
    placesToShow = placesGames?.map((pg) => pg.places) || [];
  }

  return (
    <>
      {placesToShow && placesToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placesToShow.map((place) => (
            <PlaceCard key={place.id} place={place} small />
          ))}
        </div>
      ) : (
        <EmptyArea
          title="Nessuna partita"
          message="Nessuna partita giocata"
          className="w-full"
        ></EmptyArea>
      )}
    </>
  );
}
