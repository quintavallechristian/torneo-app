import { createClient } from '@/utils/supabase/server';
import MatchCard from '@/components/MatchCard/MatchCard';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import ForbiddenArea from '@/components/ForbiddenArea/ForbiddenArea';

export default async function matchesPage() {
  const supabase = await createClient();
  const { profile } = await getAuthenticatedUserWithProfile();

  const { data: playerMatches } = await supabase
    .from('profiles_matches')
    .select('match_id')
    .eq('profile_id', profile?.id);

  const matchIds = playerMatches?.map((p) => p.match_id) ?? [];

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

  return profile ? (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Le tue partite
      </h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {data.map((match) => (
            <MatchCard key={match.id} match={match} small={true} />
          ))}
        </div>
      ) : (
        <ForbiddenArea
          title="Nessuna partita"
          message="Non hai ancora giocato partite."
        />
      )}
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <ForbiddenArea />
    </div>
  );
}
