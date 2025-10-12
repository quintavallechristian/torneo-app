import { ROLE } from '@/lib/permissions';
import {
  GameStats,
  PlaceStats,
  Profile,
  UserPermission,
  UserRowPermission,
} from '@/types';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import { cache } from 'react';

export const getAuthenticatedUserWithProfile = cache(
  async (): Promise<{
    user: User | null;
    profile: Profile | null;
    role: ROLE | null;
    permissions?: UserPermission[];
  }> => {
    console.log('called');
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return { user: null, profile: null, role: null };
    }

    // Get profile
    const {
      data: profileData,
      error: profileError,
    }: { data: Profile | null; error: Error | null } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (profileError || !profileData) {
      throw new Error('Errore nel recupero del profilo');
    }

    // Get role
    const {
      data: roleData,
      error: roleError,
    }: { data: { role: { name: ROLE } } | null; error: Error | null } =
      await supabase
        .from('users_roles')
        .select('*, role:roles(*)')
        .eq('user_id', userData.user.id)
        .single();

    if (roleError || !roleData) {
      throw new Error('Errore nel recupero del ruolo');
    }

    // Get permissions
    const { data: permissionsData }: { data: UserRowPermission[] | null } =
      await supabase
        .from('users_permissions')
        .select('*, permission:user_actions(action)')
        .eq('user_id', userData.user.id);

    const permissions = [];
    if (permissionsData) {
      permissions.push(
        ...permissionsData.map((p) => ({
          placeId: p.place_id,
          action: p.permission.action,
        })),
      );
    }

    return {
      user: userData.user,
      profile: profileData,
      role: roleData?.role.name,
      permissions: permissions,
    };
  },
);

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

  if (!gameStats) {
    return [];
  }

  gameStats = gameStats.sort((a, b) => b.points - a.points);
  return gameStats;
}

export async function getPlaceStatsPerProfile(
  profileId: string,
  placeId: number,
): Promise<PlaceStats> {
  const supabase = await createClient();
  let { data: placeStats } = await supabase
    .from('profiles_places')
    .select('*')
    .eq('profile_id', profileId)
    .eq('place_id', placeId)
    .maybeSingle();
  if (!placeStats) {
    const { data, error } = await supabase
      .from('profiles_places')
      .insert({
        profile_id: profileId,
        place_id: placeId,
      })
      .select()
      .single();
    console.log(error);
    placeStats = data;
  }

  return placeStats;
}

export async function getPlaceRanking(placeId: number): Promise<PlaceStats[]> {
  const supabase = await createClient();
  let { data: placeStats } = await supabase
    .from('profiles_places')
    .select('*')
    .eq('place_id', placeId);

  if (!placeStats) {
    return [];
  }

  placeStats = placeStats.sort((a, b) => b.points - a.points);
  return placeStats;
}
