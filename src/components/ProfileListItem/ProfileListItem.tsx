import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Player } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

interface ProfileListItemProps {
  player: Player;
  relevant?: boolean;
  isWinner?: boolean;
  index?: number;

  /** --- Render Slot personalizzabili --- */
  IntroSlot?: React.ReactNode | ((player: Player) => React.ReactNode);
  StatsSlot?: React.ReactNode | ((player: Player) => React.ReactNode);
  AdminActionsSlot?: React.ReactNode | ((player: Player) => React.ReactNode);
  DescriptionSlot?: React.ReactNode | ((player: Player) => React.ReactNode);
}

export default async function ProfileListItem({
  player,
  relevant = true,
  isWinner = false,
  index,
  IntroSlot,
  StatsSlot,
  AdminActionsSlot,
  DescriptionSlot,
}: ProfileListItemProps) {
  const { profile } = await getAuthenticatedUserWithProfile();

  const defaultIntro = (
    <button
      type="submit"
      className={`
        cursor-pointer size-10 flex items-center justify-center ring-offset-1
        ${index === 1 ? 'bg-yellow-400 ring-amber-200 text-white' : ''}
        ${index === 2 ? 'bg-slate-400 ring-slate-200 text-white' : ''}
        ${index === 3 ? 'bg-amber-600 ring-amber-500 text-white' : ''}
        ${!index || index > 3 ? 'bg-indigo-50/5' : ''}
      `}
      style={{
        clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
      }}
    >
      {index}
    </button>
  );

  const defaultDescriptionArea = null;

  const defaultStatsArea = (
    <button className="cursor-pointer focus:outline-none">
      <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
        {player.points || 0} pts
      </span>
    </button>
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
        {renderSlot(IntroSlot, defaultIntro)}
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
      <div className={`${relevant ? 'opacity-100' : 'opacity-50'}`}>
        <div className="font-semibold">
          {player.profile?.username ?? player.profile?.firstname ?? 'Anonimo'}
        </div>
      </div>
      <div className="text-xs font-regular text-slate-200">
        {renderSlot(DescriptionSlot, defaultDescriptionArea)}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* --- STATS AREA --- */}
        {
          <div className="text-right ml-auto">
            {renderSlot(StatsSlot, defaultStatsArea)}
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
