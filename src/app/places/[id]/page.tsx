'use server';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { ChevronLeft, PlusIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';
import { Location, LocationStats, ROLE } from '@/types';
import MatchCard from '@/components/MatchCard';
import {
  getAuthenticatedUserWithProfile,
  getLocationRanking,
  getLocationStatsPerProfile,
} from '@/utils/auth-helpers';
import { Badge } from '@/components/ui/badge';
import { setFavouriteLocation } from '../actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MatchList from '@/components/MatchList';
import Ranking from '@/components/Ranking';

interface PlaceDetailsPageProps {
  params: Promise<{ id: string }>;
}

function getPositionInLocation(
  profileId: string,
  locationRanking: LocationStats[],
) {
  let positionInLocation = -1;
  if (locationRanking.length !== 0) {
    const position = locationRanking.findIndex(
      (ls) => ls.profile_id === profileId,
    );
    if (position !== -1) {
      positionInLocation = position + 1;
    }
  }
  return positionInLocation;
}

export default async function PlaceDetailsPage({
  params,
}: PlaceDetailsPageProps) {
  const { id } = await params;
  const { profile, role } = await getAuthenticatedUserWithProfile();

  const locationStats = await getLocationStatsPerProfile(
    profile?.id || '',
    Number(id),
  );
  const gameRanking = await getLocationRanking(Number(id));
  let positionInLocation = -1;
  if (profile && profile.id) {
    positionInLocation = getPositionInLocation(profile.id, gameRanking);
  }

  const supabase = await createClient();

  let location, error;
  if (!isNaN(Number(id))) {
    const result = await supabase
      .from('locations')
      .select(
        `*, 
        matches:matches(
          *,
          players:profiles_matches(
            *,
            profile:profiles(*)
          ),
          game:games(name, image, id), 
          location:locations(name, id), 
          winner:profiles(id, username)),
          locationStats:profiles_locations(profile_id, favourite)`,
      )
      .eq('id', id)
      .eq('profiles_locations.profile_id', profile?.id)
      .single<Location>();
    location = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from('locations')
      .select('*')
      .eq('name', id)
      .single<Location>();
    location = result.data;
    error = result.error;
  }

  if (error || !location) {
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
        {locationStats && (
          <SpotlightCard className="px-4 py-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Le tue statistiche</div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Badge className="bg-green-200 text-green-900">
                    Vittorie: {locationStats.win}
                  </Badge>
                  <Badge className="bg-red-200 text-red-900">
                    Sconfitte: {locationStats.loss}
                  </Badge>
                  <Badge className="bg-yellow-200 text-yellow-900">
                    Pareggi: {locationStats.draw}
                  </Badge>
                  <Badge className="bg-purple-200 text-purple-900">
                    Minuti giocati: {locationStats.minutes_played}
                  </Badge>
                </div>
              </div>
              <div className="text-lg font-medium text-right">
                <div>ELO: {locationStats.points}</div>
                <div>Pos: {positionInLocation}</div>
              </div>
            </div>
          </SpotlightCard>
        )}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <Image
              src={location.image || '/placeholder.png'}
              alt={location.name}
              width={150}
              height={150}
              className="rounded-2xl border-1 object-cover dark:bg-emerald-800/20 bg-emerald-500"
            />
          </div>
          <div className="flex-1 w-full">
            <div className="pb-8">
              <CardTitle className="text-3xl font-bold text-primary mb-2 items-center gap-2 flex justify-between">
                <div>{location.name}</div>
                <form
                  action={setFavouriteLocation.bind(null, {
                    locationId: location.id!,
                    status: !location.locationStats[0]?.favourite,
                  })}
                >
                  <Button
                    variant="link"
                    className="hover:scale-110"
                    type="submit"
                  >
                    <StarIcon
                      className={`size-6  ${
                        location.locationStats[0]?.favourite
                          ? 'text-amber-300 hover:text-gray-600'
                          : 'text-gray-400'
                      }`}
                    />
                  </Button>
                </form>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {location.address}
              </CardDescription>
            </div>
            <div className="space-y-4">
              {location.description && (
                <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted  text-gray-700  text-sm">
                  <p className="whitespace-pre-line">{location.description}</p>
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
            <MatchList matches={location.matches} locationId={location.id} />
          </TabsContent>
          <TabsContent value="ranking">
            <Ranking locationId={location.id} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
