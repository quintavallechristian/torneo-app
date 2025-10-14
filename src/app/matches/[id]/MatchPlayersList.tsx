'use client';
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
  Check,
  DicesIcon,
  LockIcon,
  LockOpen,
  TrophyIcon,
  UserMinus,
  UserPlus,
  UserRoundCheck,
  UserRoundX,
} from 'lucide-react';
import { GameStats, PlaceStats, Match, Player, Profile } from '@/types';
import { PointsPopover } from '@/components/PointsPopover/PointsPopover';
import {
  confirmPlayer,
  removePlayer,
  subscribeMatch,
  unsubscribeMatch,
} from '@/lib/server/match';
import ProfileListItem from '@/components/ProfileListItem/ProfileListItem';
import { setWinner } from '@/lib/server/match';
import { ExagonalBadge } from '@/components/ui/exagonalBadge';
import { AddPlayerModal } from '@/components/AddPlayerModal/AddPlayerModal';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
interface MatchPlayersListProps {
  profile: Profile | null;
  match: Match;
  profileGames: GameStats[];
  profilePlaces: PlaceStats[];
  canManagePlatform: boolean;
  canUpdateMatchStats: boolean;
  canUpdateMatches: boolean;
}
export default function MatchPlayersList({
  profile,
  match,
  profileGames,
  profilePlaces,
  canUpdateMatchStats,
  canUpdateMatches,
}: MatchPlayersListProps) {
  const [adminControlToggled, setAdminControlToggled] = useState(true);
  const [state, setWinnerAction] = useActionState(setWinner, null);

  // Mostra il toast quando cambia lo stato
  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
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
        {canUpdateMatchStats && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdminControlToggled(!adminControlToggled)}
            >
              {adminControlToggled ? (
                <LockOpen className="size-4" strokeWidth={1} />
              ) : (
                <LockIcon className="size-4" strokeWidth={1} />
              )}
            </Button>
          </div>
        )}
        {(match.players || []).length > 0 &&
          canUpdateMatches &&
          adminControlToggled && (
            <div>{match.id && <AddPlayerModal matchId={match.id} />}</div>
          )}
        <div className="ml-auto">
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
        </div>
      </h2>
      {match.players && match.players.length > 0 ? (
        <div className="space-y-4">
          {match.players.map((playerObj: Player, index: number) => (
            <ProfileListItem
              profile={profile}
              key={`${playerObj.profile?.id}-${index}`}
              player={playerObj}
              relevant={!!playerObj.confirmed}
              isWinner={playerObj.profile?.id === match.winner?.id}
              IntroSlot={
                true ? (
                  <form
                    action={setWinnerAction.bind(null, {
                      winnerId: playerObj.profile!.id!,
                      match: match!,
                      game: match.game!,
                      place: match.place!,
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
                ) : (
                  ''
                )
              }
              StatsSlot={
                !adminControlToggled ? (
                  match.game && match.place && canUpdateMatchStats ? (
                    <PointsPopover
                      game={match.game}
                      place={match.place}
                      matchId={match.id!}
                      playerId={playerObj.profile!.id!}
                      startingPoints={playerObj.points || 0}
                    />
                  ) : null
                ) : (
                  ''
                )
              }
              AdminActionsSlot={
                adminControlToggled &&
                canUpdateMatchStats && (
                  <div className="w-24 grid grid-cols-2 items-center gap-2 p-1 bg-red-900/20 dark:bg-red-50/20 rounded-lg">
                    {!playerObj.confirmed ? (
                      <form
                        action={confirmPlayer.bind(null, {
                          matchId: match.id!,
                          profileId: playerObj.profile!.id!,
                        })}
                      >
                        <Button variant="default" size="sm" type="submit">
                          <UserRoundCheck className="size-4" strokeWidth={1} />
                        </Button>
                      </form>
                    ) : (
                      <Check className="size-6 mx-auto" strokeWidth={1} />
                    )}
                    <form
                      action={removePlayer.bind(null, {
                        matchId: match.id!,
                        profileId: playerObj.profile!.id!,
                      })}
                    >
                      <Button variant="destructive" size="sm" type="submit">
                        <UserRoundX
                          className="mx-auto size-4"
                          strokeWidth={1}
                        />
                      </Button>
                    </form>
                  </div>
                )
              }
              DescriptionSlot={
                !adminControlToggled && (
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
                      {profilePlaces.find(
                        ({ profile_id }) =>
                          profile_id === playerObj.profile!.id!,
                      )?.points || 0}
                    </ExagonalBadge>
                  </div>
                )
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
              {canUpdateMatches && (
                <>{match.id && <AddPlayerModal matchId={match.id} />}</>
              )}
            </div>
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}
