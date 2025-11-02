'use client';
import { Button } from '@/components/ui/button';
import {
  Check,
  LockIcon,
  LockOpen,
  TrophyIcon,
  UserMinus,
  UserPlus,
  UserRoundCheck,
  UserRoundX,
} from 'lucide-react';
import {
  GameStats,
  PlaceStats,
  Match,
  Player,
  Profile,
  MATCHSTATUS,
  GamePlaceStats,
} from '@/types';
import { PointsPopover } from '@/components/PointsPopover/PointsPopover';
import {
  confirmPlayer,
  removePlayer,
  subscribeMatch,
  unsubscribeMatch,
} from '@/lib/server/match';
import ProfileListItem from '@/components/ProfileListItem/ProfileListItem';
import { setWinner } from '@/lib/server/match';
import { BadgeVariant } from '@/components/ui/exagonalBadge';
import { AddPlayerModal } from '@/components/AddPlayerModal/AddPlayerModal';
import { useState } from 'react';
import { toast } from 'sonner';
import StatsExagon from '@/components/StatsExagon/StatsExagon';
import EmptyArea from '@/components/EmptyArea/EmptyArea';
import { getMatchStatus } from '@/lib/client/match';
interface MatchPlayersListProps {
  profile: Profile | null;
  match: Match;
  profileGamesPlaces: GamePlaceStats[];
  canManagePlatform: boolean;
  canUpdateMatchStats: boolean;
  canManagePlaces: boolean;
}
export default function MatchPlayersList({
  profile,
  match,
  profileGamesPlaces,
  canUpdateMatchStats,
  canManagePlaces,
}: MatchPlayersListProps) {
  const [adminControlToggled, setAdminControlToggled] = useState(false);

  function removePlayerAction(profileId: string) {
    const confirm = window.confirm(
      'Sei sicuro di voler rimuovere questo giocatore dalla partita?',
    );
    if (!confirm) return;
    removePlayer({
      match,
      profileId,
      placeId: match.place_id!,
    })
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => {
        toast.error('Errore nel rimuovere il giocatore');
      });
  }

  function confirmPlayerAction(profileId: string) {
    confirmPlayer({
      match,
      profileId,
      placeId: match.place_id!,
    })
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => {
        toast.error('Errore nel confermare il giocatore');
      });
  }

  const matchStatus = getMatchStatus(match);
  const canMatchBeUpdated = [
    MATCHSTATUS.Ongoing,
    MATCHSTATUS.WaitingForResults,
  ].includes(matchStatus);

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
          canManagePlaces &&
          adminControlToggled && (
            <div>{match.id && <AddPlayerModal match={match} />}</div>
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
              index={index + 1}
              isWinner={
                playerObj.profile?.id === match.winner?.id ||
                (index === 0 && canMatchBeUpdated)
              }
              StatsSlot={
                !adminControlToggled ? (
                  match.game &&
                  match.place &&
                  canUpdateMatchStats &&
                  canMatchBeUpdated ? (
                    <PointsPopover
                      placeId={match.place.id || ''}
                      match={match}
                      playerId={playerObj.profile!.id!}
                      startingPoints={playerObj.points || 0}
                    />
                  ) : (
                    <button className="cursor-pointer focus:outline-none hover:scale-105">
                      <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
                        0 pts
                      </span>
                    </button>
                  )
                ) : (
                  ''
                )
              }
              AdminActionsSlot={
                adminControlToggled &&
                canUpdateMatchStats && (
                  <div className="w-24 grid grid-cols-2 items-center gap-2 p-1 bg-red-900/20 dark:bg-red-50/20 rounded-lg">
                    {!playerObj.confirmed ? (
                      <Button
                        variant="default"
                        size="sm"
                        type="submit"
                        onClick={() =>
                          confirmPlayerAction(playerObj.profile!.id!)
                        }
                      >
                        <UserRoundCheck className="size-4" strokeWidth={1} />
                      </Button>
                    ) : (
                      <Check className="size-6 mx-auto" strokeWidth={1} />
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      type="submit"
                      onClick={() => removePlayerAction(playerObj.profile!.id!)}
                    >
                      <UserRoundX className="mx-auto size-4" strokeWidth={1} />
                    </Button>
                  </div>
                )
              }
              DescriptionSlot={
                !adminControlToggled && (
                  <div className="flex gap-2 items-center w-20">
                    <StatsExagon
                      size="xs"
                      stat={
                        profileGamesPlaces.find(
                          ({ profile_id }) =>
                            profile_id === playerObj.profile!.id!,
                        )?.points || 0
                      }
                    />
                  </div>
                )
              }
            />
          ))}
        </div>
      ) : (
        <EmptyArea
          className="w-full"
          title="Nessun giocatore"
          message="Ancora nessun giocatore si è unito a questa partita."
        >
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
                  Unisciti ora
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
            {canManagePlaces && adminControlToggled && (
              <>{match.id && <AddPlayerModal match={match} />}</>
            )}
          </div>
        </EmptyArea>
      )}
    </section>
  );
}
