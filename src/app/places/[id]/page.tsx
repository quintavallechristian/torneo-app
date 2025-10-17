'use server';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Place, PlaceStats } from '@/types';
import {
  getAuthenticatedUserWithProfile,
  getPlaceRanking,
  getPlaceStatsPerProfile,
} from '@/utils/auth-helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchList from '@/components/MatchList/MatchList';
import Ranking from '@/components/Ranking/Ranking';
import PlaceCard from '@/components/PlaceCard/PlaceCard';

interface PlaceDetailsPageProps {
  params: Promise<{ id: string }>;
}

function getPositionInPlace(profileId: string, placeRanking: PlaceStats[]) {
  let positionInPlace = -1;
  if (placeRanking.length !== 0) {
    const position = placeRanking.findIndex(
      (ls) => ls.profile_id === profileId,
    );
    if (position !== -1) {
      positionInPlace = position + 1;
    }
  }
  return positionInPlace;
}

export default async function PlaceDetailsPage({
  params,
}: PlaceDetailsPageProps) {
  const { id } = await params;
  const { profile } = await getAuthenticatedUserWithProfile();

  const placeStats = await getPlaceStatsPerProfile(
    profile?.id || '',
    Number(id),
  );
  const gameRanking = await getPlaceRanking(Number(id));
  let positionInPlace = -1;
  if (profile && profile.id) {
    positionInPlace = getPositionInPlace(profile.id, gameRanking);
  }

  const supabase = await createClient();

  let place, error;
  if (!isNaN(Number(id))) {
    const result = await supabase
      .from('places')
      .select(
        `*, 
        matches:matches(
          *,
          players:profiles_matches(
            *,
            profile:profiles(*)
          ),
          game:games(name, image, id), 
          place:places(name, id), 
          winner:profiles(id, username)),
          placeStats:profiles_places(profile_id, favourite)`,
      )
      .eq('id', id)
      .eq('profiles_places.profile_id', profile?.id)
      .single<Place>();
    place = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from('places')
      .select('*')
      .eq('name', id)
      .single<Place>();
    place = result.data;
    error = result.error;
  }

  if (error || !place) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/places">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Indietro
          </Button>
        </Link>
      </div>
      <PlaceCard
        place={place}
        small={false}
        placeStats={placeStats}
        positionInPlace={positionInPlace}
      />
      <section className="mt-8">
        <Tabs defaultValue="matches">
          <TabsList>
            <TabsTrigger value="matches">Partite collegate</TabsTrigger>
            <TabsTrigger value="ranking">Classifica</TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="w-full">
            <MatchList matches={place.matches} placeId={place.id} />
          </TabsContent>
          <TabsContent value="ranking">
            <Ranking placeId={place.id} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
