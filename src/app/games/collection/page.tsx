import { Game, GAME_STATS_STATE, SearchParams } from '@/types';
import { getGames } from '@/lib/server/game';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import GameCard from '@/components/GameCard/GameCard';
import { getBggUsername } from './actions';
import { BggSyncButton } from '@/components/BggSyncButton/BggSyncButton';
import { Empty } from '@/components/ui/empty';
import EmptyArea from '@/components/EmptyArea/EmptyArea';

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const games: Game[] = await getGames(query, GAME_STATS_STATE.InCollection);
  const bggUsername = await getBggUsername();

  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 text-center">
          La tua collezione
        </h1>
        <div className="flex gap-2 items-center">
          <SearchInput defaultValue={query} />
          <BggSyncButton bggUsername={bggUsername} />
        </div>
      </div>

      {games && games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              gameStats={game.gameStats?.[0]}
              small={true}
              context="in_collection"
            />
          ))}
        </div>
      ) : (
        <EmptyArea
          title="Nessun gioco in collezione."
          message="Aggiungi giochi alla tua collezione per visualizzarli qui."
        />
      )}
    </div>
  );
}
