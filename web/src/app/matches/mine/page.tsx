import { createClient } from '@/utils/supabase/server';
import MatchCard from '@/components/MatchCard/MatchCard';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import EmptyArea from '@/components/EmptyArea/EmptyArea';
import { getMatches } from '@/lib/server/match';

export default async function matchesPage() {
  const supabase = await createClient();
  const { profile } = await getAuthenticatedUserWithProfile();
  const data = await getMatches({ mine: true });

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
        <EmptyArea
          title="Nessuna partita"
          message="Non hai ancora giocato partite."
        />
      )}
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyArea />
    </div>
  );
}
