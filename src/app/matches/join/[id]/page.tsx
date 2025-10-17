import { subscribeMatch } from '@/lib/server/match';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function JoinMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await getAuthenticatedUserWithProfile();

  // Se l'utente non è autenticato, reindirizza al login
  if (!profile) {
    redirect(`/login?redirect=/matches/join/${id}`);
  }

  const supabase = await createClient();

  // Verifica che il match esista
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('id, name')
    .eq('id', id)
    .single();

  if (matchError || !match) {
    redirect('/matches');
  }

  // Verifica se l'utente è già iscritto al match
  const { data: existingSubscription } = await supabase
    .from('profiles_matches')
    .select('profile_id')
    .eq('profile_id', profile.id)
    .eq('match_id', id)
    .single();

  // Se l'utente non è già iscritto, iscrivilo
  if (!existingSubscription) {
    try {
      await subscribeMatch({ match_id: id, autoApprove: true });
    } catch (error) {
      console.error('Error subscribing to match:', error);
    }
  }

  // Reindirizza alla pagina del match
  redirect(`/matches/${id}`);
}
