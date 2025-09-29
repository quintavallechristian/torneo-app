'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updatePlayerPoints(formData: FormData) {
  const matchId = formData.get('matchId');
  const playerId = formData.get('playerId');
  const points = formData.get('points');

  console.log('updatePlayerPoints called with:', {
    matchId,
    playerId,
    points,
  });
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .update({ points })
    .eq('match_id', matchId)
    .eq('profile_id', playerId);
  if (error) throw error;
  revalidatePath(`/matches/${matchId}`);
}
