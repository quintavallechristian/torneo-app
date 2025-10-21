'use server';

import { MATCHSTATUS } from '@/types';
import { canUser } from '@/lib/permissions';
import { UserAction } from '@/types';
import { redirect } from 'next/navigation';
import PresentationMode from '@/components/PresentationMode/PresentationMode';
import { getMatchStatus } from '@/lib/client/match';
import { getPlaceDetails } from '@/lib/server/place';

interface PresentationPageProps {
  params: Promise<{ id: string }>;
}

export default async function PresentationPage({
  params,
}: PresentationPageProps) {
  const { id } = await params;

  // Verifica permessi
  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId: id,
  });

  if (!canManagePlaces) {
    redirect(`/places/${id}`);
  }

  const result = await getPlaceDetails('id', id, true);
  const place = result.data;
  const error = result.error;

  if (error || !place) {
    redirect(`/places/${id}`);
  }

  // Filtra solo i match attivi (Ongoing e Scheduled)
  const activeMatches = place.matches?.filter((match) =>
    [MATCHSTATUS.Ongoing, MATCHSTATUS.Scheduled].includes(
      getMatchStatus(match),
    ),
  );

  //filtre solo i match attivi oggi (startAt oggi)
  const today = new Date();
  const activeMatchesToday = activeMatches?.filter((match) => {
    const startAt = new Date(match.startAt);
    return (
      startAt.getDate() === today.getDate() &&
      startAt.getMonth() === today.getMonth() &&
      startAt.getFullYear() === today.getFullYear()
    );
  });

  return <PresentationMode matches={activeMatchesToday!} />;
}
