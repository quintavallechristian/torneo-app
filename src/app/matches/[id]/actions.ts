'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function setWinner({
  matchId,
  winnerId,
}: {
  matchId: string;
  winnerId: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('matches')
    .update({ winner_id: winnerId })
    .eq('id', matchId);
  if (error) throw error;
  revalidatePath(`/matches/${matchId}`);
}
