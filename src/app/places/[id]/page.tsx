'use server';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, PlusIcon } from 'lucide-react';
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

interface PlaceDetailsPageProps {
  params: Promise<{ id: string }>;
}

function getPositionInLocation(
  profileId: number,
  locationRanking: LocationStats[],
) {
  let positionInLocation = -1;
  if (locationRanking.length !== 0) {
    const position = locationRanking.findIndex(
      (gs) => gs.profile_id === profileId,
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

  // Get game stats for this user and game
  const locationStats = await getLocationStatsPerProfile(
    profile?.id || '',
    Number(id),
  );
  const gameRanking = await getLocationRanking(Number(id));
  let positionInLocation = -1;
  if (profile) {
    positionInLocation = getPositionInLocation(profile.id, gameRanking);
  }

  const supabase = await createClient();

  let location, error;
  if (!isNaN(Number(id))) {
    const result = await supabase
      .from('locations')
      .select(
        '*, matches:matches(*, game:games(name, image, id), location:locations(name, id), winner:profiles(id, username))',
      )
      .eq('id', id)
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
              width={250}
              height={250}
              className="rounded-2xl border-1 w-32 h-32 object-cover"
            />
          </div>
          <div className="flex-1 w-full">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                {location.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {location.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {location.description && (
                <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted  text-gray-700  text-sm">
                  <p className="whitespace-pre-line">{location.description}</p>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </SpotlightCard>
      <section className="mt-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Partite collegate</h2>
          {role === ROLE.Admin && (
            <Link href={`/matches/new?place_id=${location.id}`}>
              <Button variant="outline" size="sm" data-testid="Add player">
                <PlusIcon className="inline h-6 w-6" />
              </Button>
            </Link>
          )}
        </div>
        {location.matches && location.matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {location.matches.map((match) => (
              <MatchCard key={match.id} match={match} small />
            ))}
          </div>
        ) : (
          <p className="italic text-muted-foreground">
            Nessun partita collegato.
          </p>
        )}
      </section>
    </div>
  );
}
