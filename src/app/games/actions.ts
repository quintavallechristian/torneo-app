'use server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function setFavouriteGame({
  gameId,
  status,
}: {
  gameId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_games').upsert(
    {
      game_id: gameId,
      profile_id: profile?.id,
      favourite: status,
    },

    {
      onConflict: 'game_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}

export async function setInCollectionGame({
  gameId,
  status,
}: {
  gameId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_games').upsert(
    {
      game_id: gameId,
      profile_id: profile?.id,
      in_collection: status,
    },

    {
      onConflict: 'game_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}

export async function setInWishlistGame({
  gameId,
  status,
}: {
  gameId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_games').upsert(
    {
      game_id: gameId,
      profile_id: profile?.id,
      in_wishlist: status,
    },

    {
      onConflict: 'game_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}
