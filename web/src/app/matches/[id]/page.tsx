'use server';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { GameStats, PlaceStats, Match, UserAction } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import MatchCard from '@/components/MatchCard/MatchCard';
import { canUser } from '@/lib/permissions';
import MatchPlayersList from './MatchPlayersList';
interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}
export default async function MatchDetailsPage({
  params,
}: MatchDetailPageProps) {
  const { id } = await params;
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { data: match, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      game:games(*),
      place:places(*),
      players:profiles_matches(
        *,
        profile:profiles(*)
      ),
      winner:profiles(*)
    `,
    )
    .eq('id', id)
    .order('points', {
      foreignTable: 'players',
      ascending: false,
      nullsFirst: false,
    })
    .single<Match>();

  if (error || !match) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }

  let profileGames: GameStats[] = [];
  if (match.players) {
    const { data } = await supabase
      .from('profiles_games')
      .select<'profile_id, points', GameStats>('profile_id, points')
      .eq('game_id', match.game_id)
      .in(
        'profile_id',
        match.players.map((p) => p.profile_id),
      );

    if (error) {
      console.error('Errore nel recupero delle statistiche di gioco:', error);
    }
    profileGames = data || [];
  }

  let profilePlaces: PlaceStats[] = [];
  if (match.players) {
    const { data } = await supabase
      .from('profiles_places')
      .select<'profile_id, points', PlaceStats>('profile_id, points')
      .eq('place_id', match.place_id)
      .in(
        'profile_id',
        match.players.map((p) => p.profile_id),
      );

    if (error) {
      console.error('Errore nel recupero delle statistiche di gioco:', error);
    }
    profilePlaces = data || [];
  }

  const canUpdateMatchStats = !!(await canUser(
    UserAction.ManagePlaces,
    {
      placeId: match.place_id,
    },
    match.players?.some((p) => p.confirmed && p.profile_id === profile?.id),
  ));

  const canManagePlatform = !!(await canUser(UserAction.ManagePlatform));

  const canManagePlaces = !!(await canUser(UserAction.ManagePlaces, {
    placeId: match.place_id,
  }));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/matches">
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
      {match && match.game ? (
        <>
          <MatchCard match={match} small={false} />
          <MatchPlayersList
            profile={profile}
            match={match}
            profileGames={profileGames}
            profilePlaces={profilePlaces}
            canManagePlatform={canManagePlatform}
            canUpdateMatchStats={canUpdateMatchStats}
            canManagePlaces={canManagePlaces}
          />
        </>
      ) : (
        <p>Partita non trovata</p>
      )}
    </div>
  );
}
