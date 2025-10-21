import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Profile } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import StatsShowcase from '../StatsShowcase/StatsShowcase';

interface ProfileCardProps {
  profile: Profile;
  small?: boolean;
}

export default async function ProfileCard({
  profile,
  small = false,
}: ProfileCardProps) {
  const avatarUrl = profile?.image || '/placeholder.png';
  const fullName = profile?.firstname
    ? `${profile.firstname} ${profile.lastname ?? ''}`.trim()
    : 'Utente';

  return (
    <SpotlightCard className="px-0 py-0">
      <div
        className={`flex p-4 ${
          small
            ? 'text-sm flex-row'
            : 'text-base flex-col items-center md:flex-row gap-4'
        }`}
      >
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={profile?.username || 'Avatar'}
            width={small ? 120 : 220}
            height={small ? 120 : 220}
            className={`rounded-2xl shadow-lg object-cover border border-muted dark:bg-indigo-800/20 bg-indigo-500 ${
              small ? 'size-24' : 'size-60'
            }`}
            priority
          />
        </div>
        <div className="flex-1 w-full self-start">
          <CardHeader className="pb-2 pr-0">
            <CardTitle
              className={`py-0
                ${
                  small
                    ? 'text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex gap-2'
                    : 'text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex gap-2'
                }`}
            >
              <Link href={`/profile`} className="hover:underline">
                @{profile?.username ?? 'username'}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 w-full">
            {!small && profile.username && (
              <div className="overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted text-sm text-gray-700 space-y-2">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Nome:</span>
                  <span className="text-indigo-700 dark:text-indigo-900">
                    {fullName}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Username:</span>
                  <span className="text-indigo-700 dark:text-indigo-900">
                    {profile.username}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">BGG Username:</span>
                  <Link
                    href={`https://boardgamegeek.com/profile/${profile.bgg_username}`}
                    className="text-indigo-700 dark:text-indigo-900"
                  >
                    {profile.bgg_username}
                  </Link>
                </div>
              </div>
            )}
            <StatsShowcase size="xl" />
          </CardContent>
        </div>
      </div>
      {!small && (
        <CardFooter className="pb-4 flex flex-wrap gap-2 mt-4 justify-between">
          <Button className="cursor-pointer" variant="secondary">
            <PencilIcon className="inline mr-2 h-4 w-4" />
            <Link href="/profile/edit">Modifica profilo</Link>
          </Button>
        </CardFooter>
      )}
    </SpotlightCard>
  );
}
