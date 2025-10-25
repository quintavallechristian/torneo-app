import { Match, MATCHSTATUS } from '@/types';
import React from 'react';
import MatchCard from '../MatchCard/MatchCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import EmptyArea from '../EmptyArea/EmptyArea';
import { PlusIcon } from 'lucide-react';
import { SearchInput } from '../SearchInput/SearchInput';
import { MatchStatusFilter } from '../MatchStatusFilter';
import { getMatchStatus } from '@/lib/client/match';

interface MatchListProps {
  matches: Match[] | undefined;
  placeId?: string;
  gameId?: string;
  searchQuery?: string;
  statusFilter?: string;
}

export default async function MatchList({
  matches,
  placeId,
  gameId,
  searchQuery,
  statusFilter,
}: MatchListProps) {
  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId,
    gameId,
  });

  // Apply search filter
  let filteredMatches = searchQuery
    ? matches?.filter(
        (match) =>
          match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (match.description || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          match.game?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : matches;

  // Apply status filter
  if (statusFilter && filteredMatches) {
    filteredMatches = filteredMatches.filter(
      (match) => getMatchStatus(match) === statusFilter,
    );
  }

  return (
    <>
      <div className="sticky top-0 z-10  backdrop-blur supports-backdrop-filter:bg-background/60 pt-4 pb-4 -mx-4 px-4 border-b border-t">
        <div className="flex gap-2 justify-between">
          <SearchInput defaultValue={searchQuery} />
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
      </div>
      {filteredMatches && filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} small />
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
