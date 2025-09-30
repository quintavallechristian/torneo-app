'use server';
import { Button } from '@/components/ui/button';

import { ChevronLeft, TrophyIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';
import { Match, Player, ROLE } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { AddPlayerModal } from '@/components/AddPlayerModal/AddPlayerModal';
import { PointsPopover } from '@/components/PointsPopover/PointsPopover';
import { setWinner } from './actions';
import MatchCard from '@/components/MatchCard';
interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}
export default async function MatchDetailsPage({
  params,
}: MatchDetailPageProps) {
  const { id } = await params;
  const { role } = await getAuthenticatedUserWithProfile();
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

  if (error) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
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
              {role === ROLE.Admin && (
                <>{match.id && <AddPlayerModal matchId={match.id} />}</>
              )}
            </h2>
            {match.players && match.players.length > 0 ? (
              <div className="space-y-4">
                {match.players.map((playerObj: Player, index: number) => (
                  <SpotlightCard
                    className={`
                      flex items-center gap-4 my-2 px-2 py-2 
                    `}
                    bgClassName={`bg-gradient-to-br ${
                      playerObj.profile?.id === match.winner?.id
                        ? 'border border-amber-500 from-yellow-500 to-amber-800'
                        : 'from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800'
                    }`}
                    spotlightColor={`${
                      playerObj.profile?.id === match.winner?.id
                        ? 'rgba(255, 255, 0, 0.188)'
                        : 'rgba(0, 229, 255, 0.2)'
                    }`}
                    key={`${playerObj.profile?.id}-${index}`}
                  >
                    {role === ROLE.Admin && (
                      <div className="flex flex-col gap-2 ml-4">
                        {match.id && playerObj.profile?.id && (
                          <form
                            action={setWinner.bind(null, {
                              matchId: match.id!,
                              winnerId: playerObj.profile.id,
                            })}
                          >
                            <input
                              type="hidden"
                              name="matchId"
                              value={match.id}
                            />
                            <input
                              type="hidden"
                              name="winnerId"
                              value={playerObj.profile.id}
                            />
                            <button
                              type="submit"
                              className={`
                                cursor-pointer size-14 flex items-center justify-center
                                disabled:opacity-100
                                ${
                                  playerObj.profile?.id === match.winner?.id
                                    ? 'bg-amber-100 text-amber-500'
                                    : 'bg-indigo-50/5'
                                }
                              `}
                              disabled={
                                playerObj.profile?.id === match.winner?.id
                              }
                              style={{
                                clipPath:
                                  'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
                              }}
                            >
                              <TrophyIcon className="size-7" strokeWidth={1} />
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                    <div>
                      <Image
                        src={playerObj.profile?.image || '/placeholder.png'}
                        alt={playerObj.profile?.username || 'Avatar'}
                        width={64}
                        height={64}
                        className="bg-slate-900 rounded-2xl border-1 w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="font-bold text-lg">
                      {playerObj.profile?.username ??
                        playerObj.profile?.firstname ??
                        'Anonimo'}
                    </div>
                    <div className="text-right ml-auto">
                      <PointsPopover
                        gameId={match.game!.id}
                        matchId={match.id!}
                        playerId={playerObj.profile!.id!}
                        startingPoints={playerObj.points || 0}
                      />
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            ) : (
              <p className="italic text-muted-foreground">
                Nessun giocatore associato.
              </p>
            )}
          </section>
        </>
      ) : (
        <p>Partita non trovata</p>
      )}
    </div>
  );
}
