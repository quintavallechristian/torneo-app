import MatchCard from '@/components/MatchCard/MatchCard';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import EmptyArea from '@/components/EmptyArea/EmptyArea';
import { getMatches } from '@/lib/server/match';
import { getMatchStatus } from '@/lib/client/match';
import { MATCHSTATUS } from '@/types';

export default async function matchesPage() {
  const { profile } = await getAuthenticatedUserWithProfile();
  const data = await getMatches({ mine: true });

  const matchesWithStatus = data?.map((match) => {
    const status = getMatchStatus(match);
    return { ...match, status };
  });

  return profile ? (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Le tue partite
      </h1>
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
        In corso
      </h2>
      {matchesWithStatus?.filter(
        (match) => match.status === MATCHSTATUS.Ongoing,
      ) &&
      matchesWithStatus?.filter((match) => match.status === MATCHSTATUS.Ongoing)
        .length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {matchesWithStatus
            ?.filter((match) => match.status === MATCHSTATUS.Ongoing)
            .map((match) => (
              <MatchCard key={match.id} match={match} small={true} />
            ))}
        </div>
      ) : (
        <EmptyArea
          className="w-full mt-4"
          title="Nessuna partita"
          message="Non hai in corso."
        />
      )}
      <h2 className="text-2xl mt-8 font-bold text-indigo-700 dark:text-indigo-400">
        In arrivo
      </h2>
      {matchesWithStatus?.filter(
        (match) => match.status === MATCHSTATUS.Scheduled,
      ) &&
      matchesWithStatus?.filter(
        (match) => match.status === MATCHSTATUS.Scheduled,
      ).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {matchesWithStatus
            ?.filter((match) => match.status === MATCHSTATUS.Scheduled)
            .map((match) => (
              <MatchCard key={match.id} match={match} small={true} />
            ))}
        </div>
      ) : (
        <EmptyArea
          className="w-full mt-4"
          title="Nessuna partita"
          message="Non hai ancora giocato partite."
        />
      )}
      <h2 className="text-2xl font-bold mt-8 text-indigo-700 dark:text-indigo-400">
        In attesa di risultati
      </h2>
      {matchesWithStatus?.filter(
        (match) => match.status === MATCHSTATUS.WaitingForResults,
      ) &&
      matchesWithStatus?.filter(
        (match) => match.status === MATCHSTATUS.WaitingForResults,
      ).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {matchesWithStatus
            ?.filter((match) => match.status === MATCHSTATUS.WaitingForResults)
            .map((match) => (
              <MatchCard key={match.id} match={match} small={true} />
            ))}
        </div>
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
      {matchesWithStatus?.filter(
        (match) => match.status === MATCHSTATUS.Completed,
      ) &&
      matchesWithStatus?.filter(
        (match) => match.status === MATCHSTATUS.Completed,
      ).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {matchesWithStatus
            ?.filter((match) => match.status === MATCHSTATUS.Completed)
            .map((match) => (
              <MatchCard key={match.id} match={match} small={true} />
            ))}
        </div>
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
