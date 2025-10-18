'use client';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Place } from '@/types';
import Link from 'next/link';
import MyAvatar from '../MyAvatar/MyAvatar';

interface PlaceListItemProps {
  place: Place;
  relevant?: boolean;
  index?: number;

  /** --- Render Slot personalizzabili --- */
  IntroSlot?: React.ReactNode | ((place: Place) => React.ReactNode);
  StatsSlot?: React.ReactNode | ((place: Place) => React.ReactNode);
  ActionsSlot?: React.ReactNode | ((place: Place) => React.ReactNode);
  AdminActionsSlot?: React.ReactNode | ((place: Place) => React.ReactNode);
  DescriptionSlot?: React.ReactNode | ((place: Place) => React.ReactNode);
}

export default function PlaceListItem({
  place,
  relevant = true,
  index,
  IntroSlot,
  StatsSlot,
  ActionsSlot,
  AdminActionsSlot,
  DescriptionSlot,
}: PlaceListItemProps) {
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
        {place.matches?.length || 0} partite
      </span>
    </button>
  );

  const defaultAdminActions = null;
  const defaultActions = null;

  const renderSlot = (
    slot: React.ReactNode | ((p: Place) => React.ReactNode),
    fallback: React.ReactNode,
  ) => (typeof slot === 'function' ? slot(place) : slot ?? fallback);

  return (
    <SpotlightCard
      className="flex items-center gap-4 my-2 px-2 py-2"
      bgClassName={`
        ${relevant ? 'bg-gradient-to-br' : 'bg-opacity-50'}
      `}
      spotlightColor={'rgba(0, 229, 255, 0.2)'}
    >
      <div className="flex flex-col gap-2">
        {renderSlot(IntroSlot, defaultIntro)}
      </div>
      {/* --- AVATAR --- */}
      <div>
        <MyAvatar
          className="size-10"
          isOwn={false}
          image={place?.image}
          placeholder={place?.name.charAt(0)}
        />
      </div>
      {/* --- USERNAME --- */}
      <div className={`${relevant ? 'opacity-100' : 'opacity-50'}`}>
        <Link href={`/places/${place.id}`} className="font-semibold">
          {place.name}
        </Link>
        <div className="text-xs font-regular text-slate-200">
          {renderSlot(DescriptionSlot, defaultDescriptionArea)}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* --- STATS AREA --- */}
        {
          <div className="text-right ml-auto">
            {renderSlot(StatsSlot, defaultStatsArea)}
          </div>
        }

        {/* --- ACTIONS --- */}
        <div className="flex gap-2">
          {renderSlot(ActionsSlot, defaultActions)}
        </div>
        {/* --- ADMIN ACTIONS --- */}
        <div className="flex gap-2">
          {renderSlot(AdminActionsSlot, defaultAdminActions)}
        </div>
      </div>
    </SpotlightCard>
  );
}
