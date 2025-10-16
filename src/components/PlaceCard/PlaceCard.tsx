import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Place, PlaceStats } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import { PencilIcon, StarIcon } from 'lucide-react';
import { setFavouritePlace } from '@/lib/server/place';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import Link from 'next/link';
import DeleteMatchButton from '../DeleteMatchButton/DeleteMatchButton';
import StatsCard from '../StatsCard/StatsCard';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface PlaceCardProps {
  place: Place;
  small: boolean;
  placeStats?: PlaceStats;
  positionInPlace?: number;
}

export default async function PlaceCard({
  place,
  placeStats,
  small,
  positionInPlace,
}: PlaceCardProps) {
  const avatarUrl = place?.image || '/placeholder.png';
  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId: place.id,
  });
  return (
    <SpotlightCard className="px-0 py-0">
      {placeStats && !small && (
        <StatsCard stats={placeStats} position={positionInPlace!} />
      )}
      <div className="flex flex-col md:flex-row p-4">
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={place?.name || 'Place image'}
            width={small ? 120 : 220}
            height={small ? 120 : 220}
            className={`rounded-2xl shadow-lg object-cover border border-muted  dark:bg-emerald-800/20 bg-emerald-500 ${
              small ? 'size-24' : ''
            }`}
            priority
          />
        </div>
        <div className="flex-1 w-full">
          <CardHeader className="pb-2 pr-0">
            <CardTitle
              className={
                small
                  ? 'text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex gap-2'
                  : 'text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex gap-2'
              }
            >
              <Link href={`/places/${place.id}`} className="hover:underline">
                {place.name}
              </Link>

              <div className="ml-auto flex gap-2 items-center">
                <form
                  action={setFavouritePlace.bind(null, {
                    placeId: place.id!,
                    status: !placeStats?.favourite,
                  })}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="link"
                        className="hover:scale-110"
                        type="submit"
                      >
                        <StarIcon
                          className={`size-6  ${
                            placeStats?.favourite
                              ? 'text-amber-300 hover:text-gray-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {placeStats?.favourite
                          ? 'Rimuovi dai preferiti'
                          : 'Aggiungi ai preferiti'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </form>
              </div>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {place.address}
            </CardDescription>
            <CardDescription className="text-muted-foreground">
              {place.matches?.length} partite giocate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 w-full">
            {!small && (
              <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted text-sm text-gray-700">
                {place.description
                  ? place.description
                  : 'Descrizione non disponibile'}
              </div>
            )}
          </CardContent>
        </div>
      </div>
      {!small && canManagePlaces && (
        <CardFooter className="pb-4 flex flex-wrap gap-2 mt-4 justify-between">
          <Button className="cursor-pointer" variant="secondary">
            <PencilIcon className="inline mr-2 h-4 w-4" />
            <Link href={`/places/${place.id}/edit`}>Modifica</Link>
          </Button>
          {place.id && <DeleteMatchButton id={place.id} />}
        </CardFooter>
      )}
    </SpotlightCard>
  );
}
