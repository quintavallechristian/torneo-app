import Link from 'next/link';
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SpotlightCard from '@/components/SpotlightCard';
import React from 'react';
import { Match, ROLE } from '@/types';
import {
  CalendarIcon,
  CrownIcon,
  DicesIcon,
  MapPinIcon,
  PencilIcon,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import DeleteMatchButton from './DeleteMatchButton';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { formatMatchStatus, getMatchStatus } from '@/lib/match';

interface MatchCardProps {
  match: Match;
  small: boolean;
}

export default async function MatchCard({ match, small }: MatchCardProps) {
  const matchStatus = getMatchStatus(match);
  const { role } = await getAuthenticatedUserWithProfile();
  return (
    <SpotlightCard className="px-0 py-0">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <DicesIcon className="h-5 w-5 text-amber-500" />
          <Link
            href={`/games/${match.game?.id}`}
            className={`font-bold text-amber-600 dark:text-amber-400 hover:underline ${
              small ? 'text-sm' : 'text-base'
            }`}
          >
            {match.game?.name ?? match.game_id}
          </Link>
        </div>
        {match.winner?.id ? (
          <div>
            <CrownIcon className="inline mr-1 h-4 w-4 text-amber-500 -rotate-30" />
            <span className="text-sm text-amber-500">
              {match.winner.username}
            </span>
          </div>
        ) : (
          <Badge
            className={`${formatMatchStatus(matchStatus).color} ${
              small ? 'rounded-full px-2 py-2' : 'px-2 py-1 rounded-full'
            }`}
          >
            {small ? '' : formatMatchStatus(matchStatus).label}
          </Badge>
        )}
      </div>
      <div className={`flex px-4 pb-6 ${small ? 'text-sm' : 'text-base'}`}>
        {/* Immagine del gioco se disponibile */}
        {match.game?.image && (
          <div className="flex-shrink-0 space-y-2">
            <Image
              src={match.game.image}
              alt={match.game.name}
              width={small ? 140 : 220}
              height={small ? 140 : 220}
              className="rounded-2xl shadow-lg object-cover border border-muted"
            />
          </div>
        )}
        <div>
          <CardHeader className="">
            <CardTitle
              className={
                small
                  ? 'text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-2'
                  : 'text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-2'
              }
            >
              <Link href={`/matches/${match.id}`} className="hover:underline">
                {match.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 w-full">
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4 text-slate-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400 hover:underline">
                  Dal {match.startAt} al {match.endAt}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="size-4 text-slate-500" />
                <Link
                  href={`/places/${match.location?.id}`}
                  className=" text-slate-600 dark:text-slate-400 hover:underline text-xs"
                >
                  {match.location?.name}
                </Link>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted text-sm text-gray-700">
              {match.description
                ? match.description
                : 'Descrizione non disponibile'}
            </div>
          </CardContent>
        </div>
      </div>

      {!small && role === ROLE.Admin && (
        <CardFooter className="pb-4 flex flex-wrap gap-2 mt-4 justify-between">
          <Button className="cursor-pointer" variant="secondary">
            <PencilIcon className="inline mr-2 h-4 w-4" />
            <Link href={`/matches/${match.id}/edit`}>Modifica</Link>
          </Button>
          {match.id && <DeleteMatchButton id={match.id} />}
        </CardFooter>
      )}
    </SpotlightCard>
  );
}
