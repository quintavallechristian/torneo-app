import { LocationStats } from '@/types';
import { createClient } from '@/utils/supabase/server';

export async function getLocationRanking(locationId?: string) {
  'use server';
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles_locations')
    .select('*, profile:profiles(*)')
    .eq('location_id', locationId)
    .order('points', { ascending: false });

  if (error) throw error;

  return data as LocationStats[];
}
