'use server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

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
