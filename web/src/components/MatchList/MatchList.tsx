import { Match } from '@/types';
import React from 'react';
import MatchCard from '../MatchCard/MatchCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import EmptyArea from '../EmptyArea/EmptyArea';
import { PlusIcon } from 'lucide-react';
import { SearchInput } from '../SearchInput/SearchInput';

interface MatchListProps {
  matches: Match[] | undefined;
  placeId?: string;
  gameId?: string;
  searchQuery?: string;
}

export default async function MatchList({
  matches,
  placeId,
  gameId,
  searchQuery,
}: MatchListProps) {
  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId,
    gameId,
  });
  const filteredMatches = searchQuery
    ? matches?.filter(
        (match) =>
          match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (match.description || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          match.game?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : matches;
  return (
    <>
      <div className="mt-4 flex gap-2 justify-between">
        <SearchInput defaultValue={searchQuery} />
        {canManagePlaces && placeId && (
          <Link
            href={`/matches/new?place_id=${placeId ? placeId : ''}&game_id=${
              gameId ? gameId : ''
            }`}
          >
            <Button variant="outline" size="lg" data-testid="Add Game">
              <PlusIcon className="inline h-6 w-6" />
            </Button>
          </Link>
        )}
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
