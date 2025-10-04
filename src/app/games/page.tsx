import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setFavouriteGame } from './actions';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { Game } from '@/types';

export default async function GamesPage() {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  let gameData: Game[] = [];
  if (!profile) {
    const { data } = await supabase.from('games').select('*').limit(10);
    gameData = data ?? [];
  } else {
    const { data } = await supabase
      .from('games')
      .select('*, gameStats:profiles_games(profile_id, favourite)')
      .eq('gameStats.profile_id', profile.id)
      .order('bgg_rank')
      .limit(10);
    gameData = data ?? [];
  }
  return (
    <div className="max-w-2xl align-center mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Giochi</h1>

      <div className="border-0 py-0 px-0">
        {gameData?.map((game) => (
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
            <Link href={`/games/${game.id}`} key={game.id}>
              {game.name}
            </Link>
            <div className="text-right ml-auto">
              {game.bgg_rating && (
                <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
                  {game.bgg_rating}
                </span>
              )}
            </div>
            <form
              action={setFavouriteGame.bind(null, {
                gameId: game.id!,
                status: !game.gameStats[0]?.favourite,
              })}
            >
              <Button variant="link" className="hover:scale-110" type="submit">
                <StarIcon
                  className={`size-6  ${
                    game.gameStats[0]?.favourite
                      ? 'text-amber-500 hover:text-gray-600'
                      : 'text-gray-400'
                  }`}
                />
              </Button>
            </form>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
