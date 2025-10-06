import SpotlightCard from '@/components/SpotlightCard';
import React from 'react';
import { Match, Player, ROLE } from '@/types';
import { TrophyIcon, UserRoundCheck, UserRoundX } from 'lucide-react';
import Image from 'next/image';
import { PointsPopover } from './PointsPopover/PointsPopover';
import { setWinner } from '@/app/matches/[id]/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { get } from 'http';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

interface ProfileListItemProps {
  player: Player;
  match: Match;
  relevant?: boolean;

  /** --- Render Slot personalizzabili --- */
  TrophySlot?: React.ReactNode | ((player: Player) => React.ReactNode);
  PointsSlot?: React.ReactNode | ((player: Player) => React.ReactNode);
  AdminActionsSlot?: React.ReactNode | ((player: Player) => React.ReactNode);
}

export default async function ProfileListItem({
  player,
  match,
  relevant = true,
  TrophySlot,
  PointsSlot,
  AdminActionsSlot,
}: ProfileListItemProps) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const isWinner = player.profile?.id === match.winner?.id;

  const defaultTrophy = (
    <form
      action={setWinner.bind(null, {
        matchId: match.id!,
        winnerId: player.profile!.id!,
      })}
    >
      <button
        type="submit"
        className={`
          cursor-pointer size-14 flex items-center justify-center
          disabled:opacity-100
          ${isWinner ? 'bg-amber-100 text-amber-500' : 'bg-indigo-50/5'}
        `}
        disabled={isWinner}
        style={{
          clipPath:
            'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
        }}
      >
        <TrophyIcon className="size-7" strokeWidth={1} />
      </button>
    </form>
  );

  const defaultPointsPopover = (
    <PointsPopover
      gameId={match.game!.id}
      matchId={match.id!}
      playerId={player.profile!.id!}
      startingPoints={player.points || 0}
    />
  );

  const defaultAdminActions = null;

  const renderSlot = (
    slot: React.ReactNode | ((p: Player) => React.ReactNode),
    fallback: React.ReactNode,
  ) => (typeof slot === 'function' ? slot(player) : slot ?? fallback);

  return (
    <SpotlightCard
      className="flex items-center gap-4 my-2 px-2 py-2"
      bgClassName={`
        ${
          isWinner
            ? 'border border-amber-500 from-yellow-500 to-amber-800'
            : 'from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800'
        }
        ${relevant ? 'bg-gradient-to-br' : 'bg-opacity-50'}
      `}
      spotlightColor={
        isWinner ? 'rgba(255, 255, 0, 0.188)' : 'rgba(0, 229, 255, 0.2)'
      }
    >
      <div className="flex flex-col gap-2 ml-4">
        {renderSlot(TrophySlot, defaultTrophy)}
      </div>

      {/* --- AVATAR --- */}
      <div>
        <Avatar className="size-10">
          {player.profile?.image ? (
            <AvatarImage src={player.profile.image} />
          ) : (
            <AvatarFallback
              className={`uppercase border-1 text-white bg-indigo-800 ${
                player.profile?.id === profile?.id ? 'border-emerald-500' : ''
              }`}
            >
              {player.profile?.username.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* --- USERNAME --- */}
      <div
        className={`font-bold text-lg ${
          relevant ? 'opacity-100' : 'opacity-50'
        }`}
      >
        {player.profile?.username ?? player.profile?.firstname ?? 'Anonimo'}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* --- POINTS POPOVER --- */}
        {
          <div className="text-right ml-auto">
            {renderSlot(PointsSlot, defaultPointsPopover)}
          </div>
        }

        {/* --- ADMIN ACTIONS --- */}
        <div className="flex gap-2">
          {renderSlot(AdminActionsSlot, defaultAdminActions)}
        </div>
      </div>
    </SpotlightCard>
  );
}
