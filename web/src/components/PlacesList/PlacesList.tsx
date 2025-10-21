import { Place, ROLE } from '@/types';
import React from 'react';
import EmptyArea from '../EmptyArea/EmptyArea';
import { createClient } from '@/utils/supabase/server';
import PlaceCard from '../PlaceCard/PlaceCard';
import PlacesListClient from './PlacesListClient';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { Button } from '../ui/button';
import Link from 'next/link';

interface PlacesListProps {
  places?: Place[] | undefined;
  gameId?: string;
  searchQuery?: string;
  useGeolocation?: boolean;
  gridCols?: 'md:grid-cols-2' | 'md:grid-cols-3';
}

export default async function PlacesList({
  places,
  gameId,
  searchQuery,
  useGeolocation = false,
  gridCols = 'md:grid-cols-2',
}: PlacesListProps) {
  const { profile, role } = await getAuthenticatedUserWithProfile();

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

  const filteredPlaces = searchQuery
    ? placesToShow?.filter((place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : placesToShow;

  // Se usiamo la geolocalizzazione, usiamo il componente client
  if (useGeolocation && filteredPlaces && filteredPlaces.length > 0) {
    return (
      <PlacesListClient
        profileId={profile?.id || null}
        places={filteredPlaces}
        gridCols={gridCols}
      />
    );
  }

  return (
    <>
      {filteredPlaces && filteredPlaces.length > 0 ? (
        <div className={`grid grid-cols-1 ${gridCols} gap-6 mt-4`}>
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              small
              placeStats={place.placeStats?.[0]}
            />
          ))}
        </div>
      ) : (
        <EmptyArea
          title="Nessun locale"
          message="Nessun locale trovato"
          className="w-full mt-4"
        >
          {(role === ROLE.PlaceManager || role === ROLE.Admin) && (
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/places/new">Crea nuovo luogo</Link>
              </Button>
            </div>
          )}
        </EmptyArea>
      )}
    </>
  );
}
