import { PlaceStats } from '@/types';
import { createClient } from '@/utils/supabase/server';

export async function getPlaceRanking(placeId?: string) {
  'use server';
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles_places')
    .select('*, profile:profiles(*)')
    .eq('place_id', placeId)
    .order('points', { ascending: false });

  if (error) throw error;

  return data as PlaceStats[];
}
