import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Match, ROLE } from '@/types';
import React from 'react';
import MatchCard from '../MatchCard/MatchCard';
import { DicesIcon, PlusIcon, Spotlight } from 'lucide-react';
import { Button } from '../ui/button';
import SpotlightCard from '../SpotlightCard/SpotlightCard';
import Link from 'next/link';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

interface MatchListProps {
  matches: Match[] | undefined;
  locationId?: string;
  gameId?: string;
}

export default async function MatchList({
  matches,
  locationId,
  gameId,
}: MatchListProps) {
  const { role } = await getAuthenticatedUserWithProfile();
  return (
    <>
      {matches && matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} small />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DicesIcon />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyTitle>Nessuna partita</EmptyTitle>
          <EmptyDescription>Nessuna partita giocata</EmptyDescription>
          <EmptyContent>
            <div className="flex items-center gap-4">
              {role === ROLE.Admin && (
                <Link
                  href={`/matches/new?place_id=${
                    locationId ? locationId : ''
                  }&game_id=${gameId ? gameId : ''}`}
                >
                  <Button variant="outline" size="sm" data-testid="Add player">
                    <PlusIcon className="inline h-6 w-6" />
                  </Button>
                </Link>
              )}
            </div>
          </EmptyContent>
        </Empty>
      )}
    </>
  );
}
