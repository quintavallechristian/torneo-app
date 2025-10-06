'use server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
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

export async function subscribeMatch({ match_id }: { match_id: string }) {
  const { profile } = await getAuthenticatedUserWithProfile();
  if (!profile) throw new Error('User not authenticated');
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles_matches')
    .insert([{ profile_id: profile.id, match_id }]);

  if (error) {
    console.error('Error creating profiles_matches:', error);
    throw error;
  }
  revalidatePath(`/matches/${match_id}`);
}
export async function unsubscribeMatch({ match_id }: { match_id: string }) {
  const { profile } = await getAuthenticatedUserWithProfile();
  if (!profile) throw new Error('User not authenticated');
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .delete()
    .eq('profile_id', profile.id)
    .eq('match_id', match_id);

  if (error) {
    console.error('Error removing profiles_matches:', error);
    throw error;
  }
  revalidatePath(`/matches/${match_id}`);
}

export async function confirmPlayer({
  matchId,
  profileId,
}: {
  matchId: string;
  profileId: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .update([{ confirmed: true }])
    .eq('match_id', matchId)
    .eq('profile_id', profileId);

  if (error) {
    console.error('Error creating profiles_matches:', error);
    throw error;
  }
  revalidatePath(`/matches/${matchId}`);
}

export async function removePlayer({
  matchId,
  profileId,
}: {
  matchId: string;
  profileId: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .delete()
    .eq('match_id', matchId)
    .eq('profile_id', profileId);

  if (error) {
    console.error('Error removing player from match:', error);
    throw error;
  }
  revalidatePath(`/matches/${matchId}`);
}
