import { Game, GAME_STATS_STATE, SearchParams } from '@/types';
import { getGames } from '@/lib/server/game';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import GameCard from '@/components/GameCard/GameCard';
import EmptyArea from '@/components/EmptyArea/EmptyArea';

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const games: Game[] = await getGames(query, GAME_STATS_STATE.Favourite);

  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 text-center">
          I tuoi preferiti
        </h1>
        {games.length > 0 && <SearchInput defaultValue={query} />}
      </div>

      {games && games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              gameStats={game.gameStats?.[0]}
              small={true}
              context="favourites"
            />
          ))}
        </div>
      ) : (
        <EmptyArea
          title="Nessun gioco nei preferiti"
          message="Aggiungi giochi ai tuoi preferiti per vederli qui."
        />
      )}
    </div>
  );
}
