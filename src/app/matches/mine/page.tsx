import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import MatchCard from '@/components/MatchCard/MatchCard';
import { canUser, UserAction } from '@/lib/permissions';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

export default async function matchesPage() {
  const supabase = await createClient();
  const { profile } = await getAuthenticatedUserWithProfile();
  // 1️⃣ Prendi gli ID dei match a cui partecipa il profilo
  const { data: playerMatches } = await supabase
    .from('profiles_matches')
    .select('match_id')
    .eq('profile_id', profile?.id);

  const matchIds = playerMatches?.map((p) => p.match_id) ?? [];

  // 2️⃣ Prendi i match relativi
  const { data } = await supabase
    .from('matches')
    .select(
      `
    *,
    game:games(*),
    place:places(*),
    winner:profiles(*),
    players:profiles_matches(
      *,
      profile:profiles(*)
    )
  `,
    )
    .in('id', matchIds);
  const canCreateMatches = await canUser(UserAction.CreateMatches);
  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Partite
      </h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {data.map((match) => (
            <MatchCard key={match.id} match={match} small={true} />
          ))}
        </div>
      ) : (
        <p className="italic text-muted-foreground text-center">
          Nessun partita disponibile.
        </p>
      )}
      {canCreateMatches && (
        <div className="flex justify-center">
          <Button className="mt-4" asChild>
            <Link href="/matches/new">Crea nuovo partita</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
