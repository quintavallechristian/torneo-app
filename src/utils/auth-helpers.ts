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

  const { data: roleData, error: roleError } = await supabase
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
