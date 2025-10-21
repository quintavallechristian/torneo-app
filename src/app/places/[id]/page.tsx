'use server';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Place, PlaceStats, UserAction } from '@/types';
import {
  getAuthenticatedUserWithProfile,
  getPlaceRanking,
  getPlaceStatsPerProfile,
} from '@/utils/auth-helpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchList from '@/components/MatchList/MatchList';
import Ranking from '@/components/Ranking/Ranking';
import PlaceCard from '@/components/PlaceCard/PlaceCard';
import { getPlaceDetails } from '@/lib/server/place';
import GameList from '@/components/GameList/GameList';
import { Badge } from '@/components/ui/badge';
import { canUser } from '@/lib/permissions';

interface PlaceDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: { q?: string };
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
  searchParams,
}: PlaceDetailsPageProps) {
  const { id } = await params;
  const { q } = await searchParams;
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

  let place: Place | null;
  let error;
  if (!isNaN(Number(id))) {
    const result = await getPlaceDetails('id', id, true, true, true);
    place = result.data;
    error = result.error;
  } else {
    const result = await getPlaceDetails('name', id, true, true, true);
    place = result.data;
    error = result.error;
  }

  if (error || !place) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }
  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId: place.id,
  });

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
        canManagePlaces={canManagePlaces}
      />
      <section className="mt-8">
        <Tabs defaultValue="matches">
          <TabsList className="cursor-pointer">
            <TabsTrigger className="cursor-pointer" value="matches">
              Partite collegate
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="ranking">
              Classifica
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="collection">
              Collezione <Badge>{(place.placeGames || []).length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="w-full">
            <MatchList
              matches={place.matches}
              placeId={place.id}
              searchQuery={q}
            />
          </TabsContent>
          <TabsContent value="ranking">
            <Ranking placeId={place.id} />
          </TabsContent>
          <TabsContent value="collection">
            <GameList placeId={place.id} searchQuery={q} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
