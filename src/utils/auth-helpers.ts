import { ROLE } from '@/lib/permissions';
import {
  GameStats,
  LocationStats,
  Profile,
  UserPermission,
  UserRowPermission,
} from '@/types';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

export async function getAuthenticatedUserWithProfile(): Promise<{
  user: User | null;
  profile: Profile | null;
  role: ROLE | null;
  permissions?: UserPermission[];
}> {
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
        locationId: p.location_id,
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

export async function getLocationStatsPerProfile(
  profileId: string,
  locationId: number,
): Promise<LocationStats> {
  const supabase = await createClient();
  let { data: locationStats } = await supabase
    .from('profiles_locations')
    .select('*')
    .eq('profile_id', profileId)
    .eq('location_id', locationId)
    .maybeSingle();
  if (!locationStats) {
    const { data, error } = await supabase
      .from('profiles_locations')
      .insert({
        profile_id: profileId,
        location_id: locationId,
      })
      .select()
      .single();
    console.log(error);
    locationStats = data;
  }

  return locationStats;
}

export async function getLocationRanking(
  locationId: number,
): Promise<LocationStats[]> {
  const supabase = await createClient();
  let { data: locationStats } = await supabase
    .from('profiles_locations')
    .select('*')
    .eq('location_id', locationId);

  if (!locationStats) {
    return [];
  }

  locationStats = locationStats.sort((a, b) => b.points - a.points);
  return locationStats;
}
