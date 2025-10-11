'use server';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  ChevronLeft,
  DicesIcon,
  TrophyIcon,
  UserMinus,
  UserPlus,
  UserRoundCheck,
  UserRoundX,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { GameStats, LocationStats, Match, Player, ROLE } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { AddPlayerModal } from '@/components/AddPlayerModal/AddPlayerModal';
import { PointsPopover } from '@/components/PointsPopover/PointsPopover';
import {
  confirmPlayer,
  removePlayer,
  subscribeMatch,
  unsubscribeMatch,
} from './actions';
import MatchCard from '@/components/MatchCard/MatchCard';
import ProfileListItem from '@/components/ProfileListItem/ProfileListItem';
import { setWinner } from '@/lib/match';
import { ExagonalBadge } from '@/components/ui/exagonalBadge';
interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}
export default async function MatchDetailsPage({
  params,
}: MatchDetailPageProps) {
  const { id } = await params;
  const { profile, role } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { data: match, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      game:games(*),
      location:locations(*),
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

  let profileLocations: LocationStats[] = [];
  if (match.players) {
    const { data } = await supabase
      .from('profiles_locations')
      .select<'profile_id, points', LocationStats>('profile_id, points')
      .eq('location_id', match.location_id)
      .in(
        'profile_id',
        match.players.map((p) => p.profile_id),
      );

    if (error) {
      console.error('Errore nel recupero delle statistiche di gioco:', error);
    }
    profileLocations = data || [];
  }

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
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4 gap-4 flex items-center">
              <div>
                Giocatori
                <span
                  className={` ml-2 ${
                    (match.players || []).length >= match.min_players
                      ? 'text-green-300'
                      : ''
                  } ${
                    (match.players || []).length < match.min_players
                      ? 'text-red-300'
                      : ''
                  }`}
                >
                  ({(match.players || []).length}/{match.max_players || '∞'})
                </span>
              </div>
              {(match.players || []).length > 0 &&
                (!match.players?.find(
                  (player) => player.profile?.id === profile?.id,
                ) ? (
                  <form
                    action={subscribeMatch.bind(null, {
                      match_id: match.id!,
                    })}
                  >
                    <Button variant="outline" type="submit" size="sm">
                      <UserPlus className="size-4" strokeWidth={1} />
                    </Button>
                  </form>
                ) : (
                  <form
                    action={unsubscribeMatch.bind(null, {
                      match_id: match.id!,
                    })}
                  >
                    <Button variant="outline" type="submit" size="sm">
                      <UserMinus className="size-4" strokeWidth={1} />
                    </Button>
                  </form>
                ))}
              {(match.players || []).length > 0 && role === ROLE.Admin && (
                <>{match.id && <AddPlayerModal matchId={match.id} />}</>
              )}
            </h2>
            {match.players && match.players.length > 0 ? (
              <div className="space-y-4">
                {match.players.map((playerObj: Player, index: number) => (
                  <ProfileListItem
                    key={`${playerObj.profile?.id}-${index}`}
                    player={playerObj}
                    relevant={!!playerObj.confirmed}
                    isWinner={playerObj.profile?.id === match.winner?.id}
                    IntroSlot={
                      <form
                        action={setWinner.bind(null, {
                          winnerId: playerObj.profile!.id!,
                          matchId: match.id!,
                          game: match.game!,
                          location: match.location!,
                          players: match.players!.map((p) => ({
                            profile_id: p.profile_id,
                            points: p.points,
                          })),
                        })}
                      >
                        <button type="submit">
                          <ExagonalBadge
                            variant="default"
                            className={`
                            cursor-pointer size-10 hover:scale-105 transition-all ease-in-out
                            ${
                              playerObj.profile?.id === match.winner?.id
                                ? 'bg-amber-100 text-amber-500'
                                : 'bg-indigo-50/5'
                            }
                          `}
                          >
                            <TrophyIcon className="size-7" strokeWidth={1} />
                          </ExagonalBadge>
                        </button>
                      </form>
                    }
                    StatsSlot={
                      match.game &&
                      match.location && (
                        <PointsPopover
                          game={match.game}
                          location={match.location}
                          matchId={match.id!}
                          playerId={playerObj.profile!.id!}
                          startingPoints={playerObj.points || 0}
                        />
                      )
                    }
                    AdminActionsSlot={
                      role === ROLE.Admin && (
                        <>
                          <form
                            action={confirmPlayer.bind(null, {
                              matchId: match.id!,
                              profileId: playerObj.profile!.id!,
                            })}
                          >
                            <Button variant="default" size="sm" type="submit">
                              <UserRoundCheck
                                className="size-4"
                                strokeWidth={1}
                              />
                            </Button>
                          </form>
                          <form
                            action={removePlayer.bind(null, {
                              matchId: match.id!,
                              profileId: playerObj.profile!.id!,
                            })}
                          >
                            <Button
                              variant="destructive"
                              size="sm"
                              type="submit"
                            >
                              <UserRoundX className="size-4" strokeWidth={1} />
                            </Button>
                          </form>
                        </>
                      )
                    }
                    DescriptionSlot={
                      <div className="flex gap-2">
                        <ExagonalBadge variant="red">
                          {
                            profileGames.find(
                              ({ profile_id }) =>
                                profile_id === playerObj.profile!.id!,
                            )?.points
                          }
                        </ExagonalBadge>
                        <ExagonalBadge variant="blue">
                          {profileLocations.find(
                            ({ profile_id }) =>
                              profile_id === playerObj.profile!.id!,
                          )?.points || 0}
                        </ExagonalBadge>
                      </div>
                    }
                  />
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <DicesIcon />
                  </EmptyMedia>
                </EmptyHeader>
                <EmptyTitle>Nessun giocatore</EmptyTitle>
                <EmptyDescription>Nessun giocatore presente</EmptyDescription>
                <EmptyContent>
                  <div className="flex items-center gap-4">
                    {!match.players?.find(
                      (player) => player.profile?.id === profile?.id,
                    ) ? (
                      <form
                        action={subscribeMatch.bind(null, {
                          match_id: match.id!,
                        })}
                      >
                        <Button variant="outline" type="submit" size="sm">
                          <UserPlus className="size-4" strokeWidth={1} />
                        </Button>
                      </form>
                    ) : (
                      <form
                        action={unsubscribeMatch.bind(null, {
                          match_id: match.id!,
                        })}
                      >
                        <Button variant="outline" type="submit" size="sm">
                          <UserMinus className="size-4" strokeWidth={1} />
                        </Button>
                      </form>
                    )}
                    {role === ROLE.Admin && (
                      <>{match.id && <AddPlayerModal matchId={match.id} />}</>
                    )}
                  </div>
                </EmptyContent>
              </Empty>
            )}
          </section>
        </>
      ) : (
        <p>Partita non trovata</p>
      )}
    </div>
  );
}
