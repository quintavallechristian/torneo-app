import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Profile } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';

interface MatchCardProps {
  profile: Profile;
}

export default async function ProfileCard({ profile }: MatchCardProps) {
  const avatarUrl = profile?.image || '/placeholder.png';
  return (
    <SpotlightCard className="px-0 py-0">
      <div className="flex flex-col md:flex-row gap-8 items-center p-8">
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={profile?.username || 'Avatar'}
            width={120}
            height={120}
            className="rounded-2xl shadow-lg object-cover border border-muted bg-white"
            priority
          />
        </div>
        <div className="flex-1 w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
              {profile?.firstname
                ? `${profile.firstname} ${profile.lastname ?? ''}`
                : 'Utente'}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              @{profile?.username ?? 'username'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="text-indigo-700 dark:text-indigo-400">
                {profile.username}
              </span>
            </div>
          </CardContent>
          <div className="mt-6"></div>
        </div>
      </div>
      <CardFooter className="pb-4 flex flex-wrap gap-2 mt-4 justify-between">
        <Button variant="secondary">Modifica profilo</Button>
      </CardFooter>
    </SpotlightCard>
  );
}
