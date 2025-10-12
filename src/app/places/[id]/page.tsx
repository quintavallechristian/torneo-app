'use server';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { ChevronLeft, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import { Place, PlaceStats } from '@/types';
import {
  getAuthenticatedUserWithProfile,
  getPlaceRanking,
  getPlaceStatsPerProfile,
} from '@/utils/auth-helpers';
import { Badge } from '@/components/ui/badge';
import { setFavouritePlace } from '../actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchList from '@/components/MatchList/MatchList';
import Ranking from '@/components/Ranking/Ranking';

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
      <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.2)">
        {placeStats && (
          <SpotlightCard className="px-4 py-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Le tue statistiche</div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Badge className="bg-green-200 text-green-900">
                    Vittorie: {placeStats.win}
                  </Badge>
                  <Badge className="bg-red-200 text-red-900">
                    Sconfitte: {placeStats.loss}
                  </Badge>
                  <Badge className="bg-yellow-200 text-yellow-900">
                    Pareggi: {placeStats.draw}
                  </Badge>
                  <Badge className="bg-purple-200 text-purple-900">
                    Minuti giocati: {placeStats.minutes_played}
                  </Badge>
                </div>
              </div>
              <div className="text-lg font-medium text-right">
                <div>ELO: {placeStats.points}</div>
                <div>Pos: {positionInPlace}</div>
              </div>
            </div>
          </SpotlightCard>
        )}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <Image
              src={place.image || '/placeholder.png'}
              alt={place.name}
              width={150}
              height={150}
              className="rounded-2xl border-1 object-cover dark:bg-emerald-800/20 bg-emerald-500"
            />
          </div>
          <div className="flex-1 w-full">
            <div className="pb-8">
              <CardTitle className="text-3xl font-bold text-primary mb-2 items-center gap-2 flex justify-between">
                <div>{place.name}</div>
                <form
                  action={setFavouritePlace.bind(null, {
                    placeId: place.id!,
                    status: !place.placeStats[0]?.favourite,
                  })}
                >
                  <Button
                    variant="link"
                    className="hover:scale-110"
                    type="submit"
                  >
                    <StarIcon
                      className={`size-6  ${
                        place.placeStats[0]?.favourite
                          ? 'text-amber-300 hover:text-gray-600'
                          : 'text-gray-400'
                      }`}
                    />
                  </Button>
                </form>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {place.address}
              </CardDescription>
            </div>
            <div className="space-y-4">
              {place.description && (
                <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted  text-gray-700  text-sm">
                  <p className="whitespace-pre-line">{place.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
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
