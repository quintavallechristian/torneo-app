'use client';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Player, Profile } from '@/types';
import StatsExagon from '../StatsExagon/StatsExagon';
import { BadgeVariant } from '../ui/exagonalBadge';
import MyAvatar from '../MyAvatar/MyAvatar';
interface ProfileListItemProps {
  profile?: Profile | null;
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

export default function ProfileListItem({
  profile,
  player,
  relevant = true,
  isWinner = false,
  index,
  IntroSlot,
  StatsSlot,
  AdminActionsSlot,
  DescriptionSlot,
}: ProfileListItemProps) {
  const defaultIntro = (
    <StatsExagon
      size="md"
      variant={
        index === 1
          ? BadgeVariant.gold
          : index === 2
          ? BadgeVariant.silver
          : index === 3
          ? BadgeVariant.bronze
          : BadgeVariant.opaque
      }
      stat={index}
    />
  );

  const defaultDescriptionArea = null;

  const defaultStatsArea = null;

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
      {/* --- ADMIN ACTIONS --- */}
      {renderSlot(AdminActionsSlot, defaultAdminActions) && (
        <div className="flex gap-2">
          {renderSlot(AdminActionsSlot, defaultAdminActions)}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {renderSlot(IntroSlot, defaultIntro)}
      </div>
      {/* --- AVATAR --- */}
      <div>
        <MyAvatar
          className="size-10"
          isOwn={player.profile?.id === profile?.id}
          image={player.profile?.image}
          placeholder={player.profile?.username.charAt(0)}
        />
      </div>
      {/* --- USERNAME --- */}
      <div className="grid grid-cols-2 gap-2 items-center">
        <div className={`${relevant ? 'opacity-100' : 'opacity-50'}`}>
          <div className="font-semibold">
            {player.profile?.username ?? player.profile?.firstname ?? 'Anonimo'}
          </div>
        </div>
        <div className="text-xs font-regular text-slate-200">
          {renderSlot(DescriptionSlot, defaultDescriptionArea)}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {renderSlot(StatsSlot, defaultStatsArea)}
      </div>
    </SpotlightCard>
  );
}
