import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import React from 'react';
import { DicesIcon } from 'lucide-react';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { getLocationRanking } from '@/lib/location';

interface RankingProps {
  locationId?: string;
  gameId?: string;
}

export default async function Ranking({ locationId, gameId }: RankingProps) {
  const { role } = await getAuthenticatedUserWithProfile();

  if (!locationId && !gameId) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DicesIcon />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No data found</EmptyDescription>
      </Empty>
    );
  }
  const ranking = await getLocationRanking(locationId);

  return <>{JSON.stringify(ranking)}</>;
}
