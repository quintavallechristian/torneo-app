'use client';
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React, { useEffect, useState } from 'react';
import { Place, PlaceStats } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import { FootprintsIcon, PencilIcon, StarIcon } from 'lucide-react';
import { setFavouritePlace } from '@/lib/server/place';
import Link from 'next/link';
import DeleteMatchButton from '../DeleteMatchButton/DeleteMatchButton';
import StatsCard from '../StatsCard/StatsCard';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distanza in km
}

interface PlaceCardProps {
  place: Place;
  small: boolean;
  distance?: number | null;
  placeStats?: PlaceStats;
  positionInPlace?: number;
  canManagePlaces?: boolean;
}

export default function PlaceCard({
  place,
  placeStats,
  distance,
  small,
  positionInPlace,
  canManagePlaces,
}: PlaceCardProps) {
  const avatarUrl = place?.image || '/placeholder.png';
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!distance && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Errore geolocalizzazione:', error);
          // In caso di errore, usa i luoghi senza ordinamento per distanza
        },
      );
    }
  }, [distance]);

  if (!distance && userLocation) {
    distance = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      place.latitude || 0,
      place.longitude || 0,
    );
  }
  return (
    <SpotlightCard className="px-0 py-0">
      <div className="flex justify-between items-center pl-6 pr-2 pt-1 gap-2">
        <div className="text-sm text-muted-foreground">
          <FootprintsIcon className="size-4 inline-block mr-1" />
          {distance && (
            <span className="text-sm">
              {distance < 1
                ? `${Math.round(distance * 1000)} m`
                : `${distance.toFixed(1)} km`}
            </span>
          )}
        </div>
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
      </div>
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
            alt={place?.name || 'Place image'}
            width={small ? 120 : 220}
            height={small ? 120 : 220}
            className={`rounded-2xl shadow-lg object-cover border border-muted  dark:bg-emerald-800/20 bg-emerald-500 ${
              small ? 'size-24' : 'aspect-'
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
              </Link>{' '}
            </CardTitle>
            <CardDescription
              className={`text-muted-foreground ${small ? 'line-clamp-1' : ''}`}
            >
              {place.address}
            </CardDescription>
            <CardDescription className="text-muted-foreground">
              <div>{place.matches?.length || 0} partite giocate</div>
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
      {placeStats && !small && positionInPlace && positionInPlace > 0 && (
        <div className="px-4 mb-8">
          <StatsCard stats={placeStats} position={positionInPlace!} />
        </div>
      )}
      {!small && canManagePlaces && (
        <CardFooter className="pb-4 flex flex-wrap gap-2 mt-4 justify-between">
          <div className="flex gap-2">
            <Button className="cursor-pointer" variant="secondary" asChild>
              <Link href={`/places/${place.id}/edit`}>
                <PencilIcon className="inline mr-2 h-4 w-4" />
                Modifica
              </Link>
            </Button>
            {(place.matches || []).length > 0 && (
              <Button className="cursor-pointer" variant="default" asChild>
                <Link href={`/places/${place.id}/presentation`}>
                  Modalità Presentazione
                </Link>
              </Button>
            )}
          </div>
          {place.id && <DeleteMatchButton id={place.id} />}
        </CardFooter>
      )}
    </SpotlightCard>
  );
}
