'use server';

import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { getPlaceDetails, getPlaceRanking } from '@/lib/server/place';
import RankingPresentationMode from '@/components/RankingPresentationMode/RankingPresentationMode';

interface RankingPresentationPageProps {
  params: Promise<{ id: string }>;
}

export default async function RankingPresentationPage({
  params,
}: RankingPresentationPageProps) {
  const { id } = await params;

  // Verifica permessi
  const canManagePlaces = await canUser(UserAction.ManagePlaces, {
    placeId: id,
  });

  if (!canManagePlaces) {
    redirect(`/places/${id}`);
  }

  const result = await getPlaceDetails('id', id, false);
  const place = result.data;
  const error = result.error;

  if (error || !place) {
    redirect(`/places/${id}`);
  }

  // Ottieni la classifica del locale
  const ranking = await getPlaceRanking(id);

  return <RankingPresentationMode placeName={place.name} ranking={ranking} />;
}
