import { Match } from '@/types';
import React from 'react';
import MatchCard from '../MatchCard/MatchCard';
import { Button } from '../ui/button';
import Link from 'next/link';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import EmptyArea from '../EmptyArea/EmptyArea';

interface MatchListProps {
  matches: Match[] | undefined;
  placeId?: string;
  gameId?: string;
}

export default async function MatchList({
  matches,
  placeId,
  gameId,
}: MatchListProps) {
  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId,
    gameId,
  });
  return (
    <>
      {matches && matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} small />
          ))}
          <div className="flex items-center gap-4">
            {canManagePlaces && (
              <Link
                href={`/matches/new?place_id=${
                  placeId ? placeId : ''
                }&game_id=${gameId ? gameId : ''}`}
              >
                <Button data-testid="Add match">Crea nuovo partita</Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <EmptyArea
          title="Nessuna partita"
          message="Nessuna partita giocata"
          className="w-full"
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
