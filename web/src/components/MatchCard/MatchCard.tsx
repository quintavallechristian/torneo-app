import Link from 'next/link';
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Match } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  CalendarIcon,
  CrownIcon,
  DicesIcon,
  MapPinIcon,
  PencilIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import DeleteMatchButton from '../DeleteMatchButton/DeleteMatchButton';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { formatMatchStatus, getMatchStatus } from '@/lib/client/match';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import MyAvatar from '../MyAvatar/MyAvatar';
import FlipCard from '../FlipCard/FlipCard';

const PUBLIC_URL = process.env.PUBLIC_URL || '';

interface MatchCardProps {
  match: Match;
  small?: boolean;
}

export default async function MatchCard({ match, small }: MatchCardProps) {
  const matchStatus = getMatchStatus(match);
  const { profile } = await getAuthenticatedUserWithProfile();

  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId: match.place_id,
  });
  return (
    <SpotlightCard className="px-0 py-0">
      <div className="flex justify-between items-center p-4 gap-2">
        <div
          className={`flex items-center gap-2 ${
            small ? 'max-w-52 md:max-w-64' : 'max-w-64 md:max-w-full'
          }`}
        >
          <DicesIcon className="h-5 w-5 text-amber-500 shrink-0" />
          <Link
            href={`/games/${match.game?.id}`}
            className={`font-bold text-amber-600 dark:text-amber-400 hover:underline truncate ${
              small ? 'text-sm' : 'text-base'
            }`}
          >
            {match.game?.name ?? match.game_id}
          </Link>
        </div>

        {match.players?.find((player) => player.profile?.id === profile?.id) &&
        !match.players?.find((player) => player.profile?.id === profile?.id)
          ?.confirmed ? (
          <div className="relative ml-auto">
            <div className="size-96 -right-52 -top-52 from-red-200 opacity-20 bg-radial via-transparent to-transparent absolute"></div>
            <div className="text-sm text-red-300 truncate">Da confermare</div>
          </div>
        ) : (
          ''
        )}

        {match.winner?.id ? (
          <div className="relative">
            <div className="size-96 -right-52 -top-52 from-amber-200 opacity-20 bg-radial via-transparent to-transparent absolute"></div>
            <div className="flex items-center gap-1">
              <CrownIcon className="h-4 w-4 text-amber-500 -rotate-30 shrink-0" />
              <span className="text-sm text-amber-500 truncate">
                {match.winner.username}
              </span>
              <MyAvatar
                className="size-5 text-xs"
                isOwn={match.winner?.id === profile?.id}
                image={match.winner?.image}
                placeholder={match.winner?.username.charAt(0)}
              />
            </div>
          </div>
        ) : (
          <>
            <Badge
              className={`hidden md:block ${
                formatMatchStatus(matchStatus).color
              } ${small ? 'rounded-full px-2 py-2' : 'px-2 py-1 rounded-full'}`}
            >
              {small ? '' : formatMatchStatus(matchStatus).label}
            </Badge>
            <Badge
              className={`rounded-full px-2 py-2 md:hidden ${
                formatMatchStatus(matchStatus).color
              }`}
            ></Badge>
          </>
        )}
      </div>
      <div
        className={`flex px-4 pb-6 ${
          small
            ? 'text-sm flex-row'
            : 'text-base flex-col md:flex-row gap-4 items-center'
        }`}
      >
        {/* Immagine del gioco se disponibile */}
        {match.game?.image && (
          <FlipCard
            imageSrc={match.game.image}
            imageAlt={match.game.name}
            qrValue={`${PUBLIC_URL}/matches/${match.id}`}
            size={small ? 128 : 220}
            enableFlip={!small}
          />
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
              <Link
                href={`/matches/${match.id}`}
                className="hover:underline line-clamp-2 max-h-14 md:line-clamp-none "
              >
                {match.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 w-full">
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4 text-slate-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400 hover:underline">
                  {format(match.startAt, 'dd MMMM yyyy HH:mm', { locale: it })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPinIcon className="size-4 text-slate-500" />
                <Link
                  href={`/places/${match.place?.id}`}
                  className=" text-slate-600 dark:text-slate-400 hover:underline text-xs"
                >
                  {match.place?.name}
                </Link>
              </div>
            </div>
            {!small && (
              <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted text-sm text-gray-700">
                {match.description
                  ? match.description
                  : 'Descrizione non disponibile'}
              </div>
            )}

            {match.players && !small && (
              <div className="flex">
                {match.players.map(
                  (player) =>
                    player.confirmed && (
                      <Link key={player.id} href={`/profiles/${player.id}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative">
                              {player.profile?.id === match.winner?.id && (
                                <div className="size-20 -right-6 -top-6 from-amber-200 opacity-20 bg-radial via-transparent to-transparent absolute"></div>
                              )}
                              <MyAvatar
                                className="size-8"
                                isOwn={player.profile?.id === profile?.id}
                                image={player.profile?.image}
                                placeholder={player.profile?.username.charAt(0)}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {player.profile?.username}{' '}
                              {player.profile?.id === profile?.id && '(TU)'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Link>
                    ),
                )}
              </div>
            )}
          </CardContent>
        </div>
      </div>

      {!small && canManagePlaces && (
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
