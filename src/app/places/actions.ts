'use server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function setFavouriteLocation({
  locationId,
  status,
}: {
  locationId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_locations').upsert(
    {
      location_id: locationId,
      profile_id: profile?.id,
      favourite: status,
    },

    {
      onConflict: 'location_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}
