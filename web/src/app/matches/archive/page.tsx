import MatchCard from '@/components/MatchCard/MatchCard';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import EmptyArea from '@/components/EmptyArea/EmptyArea';
import { getMatches } from '@/lib/server/match';
import { getMatchStatus } from '@/lib/client/match';
import { MATCHSTATUS } from '@/types';
import MatchList from '@/components/MatchList/MatchList';
import MatchListClient from '@/components/MatchList/MatchListClient';

export default async function matchesPage() {
  const { profile } = await getAuthenticatedUserWithProfile();
  const data = await getMatches({ mine: true });

  const matchesWithStatus = data?.map((match) => {
    const status = getMatchStatus(match);
    return { ...match, status };
  });

  const waitingResultMatches = matchesWithStatus?.filter(
    (match) => match.status === MATCHSTATUS.WaitingForResults,
  );

  const completedMatches = matchesWithStatus?.filter(
    (match) => match.status === MATCHSTATUS.Completed,
  );

  return profile ? (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Le tue partite
      </h1>
      <h2 className="text-2xl font-bold mt-8 text-indigo-700 dark:text-indigo-400">
        In attesa di risultati
      </h2>
      {waitingResultMatches && waitingResultMatches.length > 0 ? (
        <MatchListClient matches={waitingResultMatches} hideBar />
      ) : (
        <EmptyArea
          className="w-full mt-4"
          title="Nessuna partita"
          message="Non hai ancora concluso nessuna partita."
        />
      )}
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400 mt-8">
        Concluse
      </h2>
      {completedMatches && completedMatches.length > 0 ? (
        <MatchListClient matches={completedMatches} hideBar />
      ) : (
        <EmptyArea
          className="w-full"
          title="Nessuna partita"
          message="Non hai ancora concluso nessuna partita."
        />
      )}
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyArea />
    </div>
  );
}
