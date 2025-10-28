import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import EmptyArea from '@/components/EmptyArea/EmptyArea';
import { getMatches } from '@/lib/server/match';
import { getMatchStatus } from '@/lib/client/match';
import { MATCHSTATUS } from '@/types';
import MatchListClient from '@/components/MatchList/MatchListClient';

export default async function matchesPage() {
  const { profile } = await getAuthenticatedUserWithProfile();
  const data = await getMatches({ mine: true });
  const otherMatches = await getMatches();

  const matchesWithStatus = data?.map((match) => {
    const status = getMatchStatus(match);
    return { ...match, status };
  });

  const otherMatchesWithStatus = otherMatches?.map((match) => {
    const status = getMatchStatus(match);
    return { ...match, status };
  });

  const scheduledOtherMatches = otherMatchesWithStatus?.filter(
    (match) => match.status === MATCHSTATUS.Scheduled,
  );

  const scheduledMatches = matchesWithStatus?.filter(
    (match) => match.status === MATCHSTATUS.Scheduled,
  );

  const ongoingMatches = matchesWithStatus?.filter(
    (match) => match.status === MATCHSTATUS.Ongoing,
  );

  return profile ? (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Le tue partite
      </h1>
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
        In corso
      </h2>
      {ongoingMatches && ongoingMatches.length > 0 ? (
        <MatchListClient matches={ongoingMatches} />
      ) : (
        <EmptyArea
          className="w-full mt-4"
          title="Nessuna partita"
          message="Non hai partite in corso."
        />
      )}
      <h2 className="text-2xl mt-8 font-bold text-indigo-700 dark:text-indigo-400">
        In arrivo
      </h2>
      {scheduledMatches && scheduledMatches.length > 0 ? (
        <MatchListClient matches={scheduledMatches} />
      ) : (
        <EmptyArea
          className="w-full mt-4"
          title="Nessuna partita"
          message="Non hai ancora giocato partite."
        />
      )}
      <h2 className="text-2xl mt-8 font-bold text-indigo-700 dark:text-indigo-400">
        Trova partite
      </h2>
      {scheduledOtherMatches && scheduledOtherMatches.length > 0 ? (
        <MatchListClient withDistances={true} matches={scheduledOtherMatches} />
      ) : (
        <EmptyArea
          className="w-full mt-4"
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
