import { Game, GAME_STATS_STATE, GameStats } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
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

export async function getGames(
  query: string,
  filterBy: GAME_STATS_STATE | null = null,
): Promise<Game[]> {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();

  if (!profile) {
    const { data } = await supabase.from('games').select('*').limit(10);
    return data ?? [];
  } else if (filterBy !== null) {
    const { data } = await supabase
      .from('games')
      .select(
        '*, gameStats:profiles_games!inner(profile_id, favourite, in_collection, in_wishlist, rating)',
      )
      .eq('gameStats.profile_id', profile.id)
      .eq(`gameStats.${filterBy}`, true)
      .ilike('name', `%${query}%`)
      .order('bgg_rank')
      .limit(100);
    return data ?? [];
  } else {
    const { data } = await supabase
      .from('games')
      .select(
        '*, gameStats:profiles_games(profile_id, favourite, in_collection, in_wishlist, rating)',
      )
      .eq('gameStats.profile_id', profile.id)
      .ilike('name', `%${query}%`)
      .order('bgg_rank')
      .limit(100);
    return data ?? [];
  }
}
