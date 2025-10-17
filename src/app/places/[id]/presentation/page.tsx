'use server';

import { createClient } from '@/utils/supabase/server';
import { MATCHSTATUS, Place } from '@/types';
import { canUser } from '@/lib/permissions';
import { UserAction } from '@/types';
import { redirect } from 'next/navigation';
import PresentationMode from '@/components/PresentationMode/PresentationMode';
import { getMatchStatus } from '@/lib/client/match';

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

  const supabase = await createClient();

  // Recupera il place con i match attivi
  const { data: place, error } = await supabase
    .from('places')
    .select(
      `*, 
      matches:matches(
        *,
        players:profiles_matches(
          *,
          profile:profiles(*)
        ),
        game:games(name, image, id), 
        place:places(name, id), 
        winner:profiles(id, username)
      )`,
    )
    .eq('id', id)
    .single<Place>();

  if (error || !place) {
    redirect(`/places/${id}`);
  }

  // Filtra solo i match attivi (Ongoing e Scheduled)
  const activeMatches = place.matches?.filter((match) =>
    [MATCHSTATUS.Ongoing, MATCHSTATUS.Scheduled].includes(
      getMatchStatus(match),
    ),
  );

  return <PresentationMode matches={activeMatches!} placeName={place.name} />;
}
