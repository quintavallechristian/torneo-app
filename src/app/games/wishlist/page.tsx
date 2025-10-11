import Link from 'next/link';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import { LibraryBigIcon, SparklesIcon, StarIcon } from 'lucide-react';
import {
  setFavouriteGame,
  setInCollectionGame,
  setInWishlistGame,
} from '../actions';
import { Game, GAME_STATS_STATE } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getGames } from '@/lib/game';
import { GameSearchInput } from '@/components/GameSearchInput/GameSearchInput';

export default async function GamesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  const games: Game[] = await getGames(query, GAME_STATS_STATE.InWishlist);

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
            <div className="flex gap-2 items-center mt-1.5 ml-auto">
              <form
                action={setFavouriteGame.bind(null, {
                  gameId: game.id!,
                  status: !game.gameStats[0]?.favourite,
                })}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="hover:scale-110" type="submit">
                      <StarIcon
                        className={`size-6  ${
                          game.gameStats[0]?.favourite
                            ? 'text-amber-300 hover:text-gray-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Aggiungi ai preferiti</p>
                  </TooltipContent>
                </Tooltip>
              </form>
              <form
                action={setInCollectionGame.bind(null, {
                  gameId: game.id!,
                  status: !game.gameStats[0]?.in_collection,
                })}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="hover:scale-110" type="submit">
                      <LibraryBigIcon
                        className={`size-6  ${
                          game.gameStats[0]?.in_collection
                            ? 'text-emerald-300 hover:text-gray-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Aggiungi alla collezione</p>
                  </TooltipContent>
                </Tooltip>
              </form>
              <form
                action={setInWishlistGame.bind(null, {
                  gameId: game.id!,
                  status: !game.gameStats[0]?.in_wishlist,
                })}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="hover:scale-110" type="submit">
                      <SparklesIcon
                        className={`size-6  ${
                          game.gameStats[0]?.in_wishlist
                            ? 'text-sky-300 hover:text-gray-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Aggiungi alla wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </form>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
