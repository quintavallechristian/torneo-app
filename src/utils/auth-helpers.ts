import { Game, GameStats } from '@/types';
import { createClient } from '@/utils/supabase/server';

export async function getAuthenticatedUserWithProfile() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { user: null, profile: null };
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  const { data: roleData } = await supabase
    .from('users_roles')
    .select('*, role:roles(*)')
    .eq('user_id', userData.user.id)
    .single();

  if (profileError) {
    console.error('Errore nel recupero del profilo:', profileError);
  }

  return {
    user: userData.user,
    profile: profileData,
    role: roleData?.role.name,
  };
}

export async function getGameStatsPerProfile(
  profileId: string,
  gameId: number,
): Promise<GameStats> {
  const supabase = await createClient();
  let { data: gameStats } = await supabase
    .from('profiles_games')
    .select('*')
    .eq('profile_id', profileId)
    .eq('game_id', gameId)
    .maybeSingle();
  if (!gameStats) {
    console.log(profileId, gameId, gameStats);
    const { data, error } = await supabase
      .from('profiles_games')
      .insert({
        profile_id: profileId,
        game_id: gameId,
      })
      .select()
      .single();
    console.log(error);
    gameStats = data;
  }

  return gameStats;
}

export async function getGameRanking(gameId: number): Promise<GameStats[]> {
  const supabase = await createClient();
  let { data: gameStats } = await supabase
    .from('profiles_games')
    .select('*')
    .eq('game_id', gameId);

  console.log(gameStats);
  if (!gameStats) {
    return [];
  }

  gameStats = gameStats.sort((a, b) => b.points - a.points);
  return gameStats;
}
