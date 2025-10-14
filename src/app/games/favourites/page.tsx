import Link from 'next/link';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import { Game, GAME_STATS_STATE, SearchParams } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getGames } from '@/lib/server/game';
import { GameSearchInput } from '@/components/GameSearchInput/GameSearchInput';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import GameStatsArea from '@/components/GameStatsArea/GameStatsArea';

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const games: Game[] = await getGames(query, GAME_STATS_STATE.Favourite);
  const { profile } = await getAuthenticatedUserWithProfile();

  return (
    <div className="max-w-2xl align-center mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">I tuoi preferiti</h1>
        <GameSearchInput defaultValue={query} />
      </div>

      <div className="border-0 py-0 px-0">
        {games?.map((game) => (
          <SpotlightCard
            key={game.id}
            className="flex items-center gap-4 my-2 px-2 py-2 shadow-xl  bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div>
              <Image
                src={game.image || '/placeholder.png'}
                alt={game.name}
                width={64}
                height={64}
                className="rounded-2xl border-1 w-16 h-16 object-cover"
              />
            </div>
            <div>
              <Link href={`/games/${game.id}`} key={game.id}>
                {game.name}
              </Link>
              <div className="space-x-2">
                {game.bgg_rating && (
                  <Badge className="bg-cyan-100 text-cyan-800">
                    MEDIA: {game.bgg_rating}
                  </Badge>
                )}
                {game.bgg_weight && (
                  <Badge className="bg-red-100 text-cyan-800">
                    PESO: {game.bgg_weight}
                  </Badge>
                )}
              </div>
            </div>
            {profile && <GameStatsArea game={game} />}
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
