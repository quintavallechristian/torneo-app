import { GameStats } from '@/types';
import { createClient } from '@/utils/supabase/server';

export async function getGameRanking(GameId?: string) {
  'use server';
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles_games')
    .select('*, profile:profiles(*)')
    .eq('game_id', GameId)
    .order('points', { ascending: false });

  if (error) throw error;

  return data as GameStats[];
}
