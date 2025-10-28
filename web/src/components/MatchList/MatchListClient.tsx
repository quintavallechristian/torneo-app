'use client';
import { Match } from '@/types';
import React, { useEffect, useState } from 'react';
import MatchCard from '../MatchCard/MatchCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import EmptyArea from '../EmptyArea/EmptyArea';
import { PlusIcon } from 'lucide-react';
import { SearchInput } from '../SearchInput/SearchInput';
import { MatchStatusFilter } from '../MatchStatusFilter';
import { getMatchStatus } from '@/lib/client/match';
import StickyTabsWrapper from '../StickyTabsWrapper/StickyTabsWrapper';
import { haversineDistance } from '@/lib/client/place';

interface MatchListProps {
  matches: Match[] | undefined;
  placeId?: string | null;
  gameId?: string | null;
  searchQuery?: string | null;
  statusFilter?: string | null;
  canManagePlaces?: boolean | null;
  withDistances?: boolean | null;
}

export default function MatchListClient({
  matches,
  placeId,
  gameId,
  searchQuery,
  statusFilter,
  canManagePlaces = false,
  withDistances = false,
}: MatchListProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [sortedMatches, setSortedMatches] = useState<Match[] | undefined>(
    matches,
  );

  useEffect(() => {
    // Ottieni la posizione dell'utente
    if (
      withDistances &&
      typeof window !== 'undefined' &&
      'geolocation' in navigator
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Errore geolocalizzazione:', error);
        },
      );
    } else {
    }
  }, [withDistances]);

  useEffect(() => {
    if (userLocation && withDistances) {
      const matchesWithDistance = matches
        ?.map((match) => ({
          ...match,
          distance: haversineDistance(
            userLocation.lat,
            userLocation.lng,
            match.place?.latitude || 0,
            match.place?.longitude || 0,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setSortedMatches(matchesWithDistance);
    } else {
      setSortedMatches(matches);
    }
  }, [userLocation, matches, withDistances]);

  let filteredMatches = searchQuery
    ? sortedMatches?.filter(
        (match) =>
          match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (match.description || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          match.game?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sortedMatches;

  // Apply status filter
  if (statusFilter && filteredMatches) {
    filteredMatches = filteredMatches.filter(
      (match) => getMatchStatus(match) === statusFilter,
    );
  }

  // Sort by date only if not sorting by distance
  if (!withDistances || !userLocation) {
    filteredMatches = filteredMatches?.sort((a, b) => {
      const aStart = a?.startAt || '';
      const bStart = b?.startAt || '';
      return new Date(bStart).getTime() - new Date(aStart).getTime();
    });
  }

  return (
    <>
      <StickyTabsWrapper topOffset="top-[68px]">
        <div className="flex gap-2 justify-between">
          <SearchInput defaultValue={searchQuery || undefined} />
          <div className="flex gap-2">
            <MatchStatusFilter />
            {canManagePlaces && placeId && (
              <Link
                href={`/matches/new?place_id=${
                  placeId ? placeId : ''
                }&game_id=${gameId ? gameId : ''}`}
              >
                <Button variant="outline" size="lg" data-testid="Add Game">
                  <PlusIcon className="inline h-6 w-6" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </StickyTabsWrapper>
      {filteredMatches && filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              small
              canManagePlaces={canManagePlaces}
              withDistances={withDistances}
            />
          ))}
        </div>
      ) : (
        <EmptyArea
          title="Nessuna partita"
          message="Nessuna partita giocata"
          className="w-full mt-4"
        >
          <div className="flex items-center gap-4">
            {canManagePlaces && (
              <Link
                href={`/matches/new?place_id=${
                  placeId ? placeId : ''
                }&game_id=${gameId ? gameId : ''}`}
              >
                <Button variant="outline" size="sm" data-testid="Add match">
                  <PlusIcon className="inline h-6 w-6" />
                </Button>
              </Link>
            )}
          </div>
        </EmptyArea>
      )}
    </>
  );
}
