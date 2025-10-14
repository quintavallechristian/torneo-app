'use server';
import { PlaceStats } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPlaceRanking(placeId?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles_places')
    .select('*, profile:profiles(*)')
    .eq('place_id', placeId)
    .order('points', { ascending: false });

  if (error) throw error;

  return data as PlaceStats[];
}

export async function setFavouritePlace({
  placeId,
  status,
}: {
  placeId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_places').upsert(
    {
      place_id: placeId,
      profile_id: profile?.id,
      favourite: status,
    },

    {
      onConflict: 'place_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}
