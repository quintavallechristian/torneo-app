import React from 'react';
import { Game, GameStats } from '@/types';
import { LibraryBigIcon, SparklesIcon, StarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  setFavouriteGame,
  setInCollectionGame,
  setInWishlistGame,
} from '@/lib/server/game';
import { Button } from '../ui/button';

interface ActionButtonsProps {
  game: Game;
  gameStats?: GameStats;
  context?: 'favourites' | 'all' | 'in_collection' | 'in_wishlist';
}

export default async function ActionButtons({
  game,
  gameStats,
  context = 'all',
}: ActionButtonsProps) {
  return (
    <>
      <div className="flex items-center z-10">
        {['all', 'favourites'].includes(context) && (
          <form
            action={setFavouriteGame.bind(null, {
              gameId: game.id!,
              status: !gameStats?.favourite,
            })}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  className="hover:scale-110"
                  type="submit"
                >
                  <StarIcon
                    className={`size-6  ${
                      gameStats?.favourite
                        ? 'text-amber-300 hover:text-gray-600'
                        : 'text-gray-400'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {gameStats?.favourite
                    ? 'Rimuovi dai preferiti'
                    : 'Aggiungi ai preferiti'}
                </p>
              </TooltipContent>
            </Tooltip>
          </form>
        )}
        {['all', 'in_collection'].includes(context) && (
          <form
            action={setInCollectionGame.bind(null, {
              gameId: game.id!,
              status: !gameStats?.in_collection,
            })}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  className="hover:scale-110"
                  type="submit"
                >
                  <LibraryBigIcon
                    className={`size-6  ${
                      gameStats?.in_collection
                        ? 'text-emerald-300 hover:text-gray-600'
                        : 'text-gray-400'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {gameStats?.in_collection
                    ? 'Rimuovi dalla collezione'
                    : 'Aggiungi alla collezione'}
                </p>
              </TooltipContent>
            </Tooltip>
          </form>
        )}
        {['all', 'in_wishlist'].includes(context) && (
          <form
            action={setInWishlistGame.bind(null, {
              gameId: game.id!,
              status: !gameStats?.in_wishlist,
            })}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  className="hover:scale-110"
                  type="submit"
                >
                  <SparklesIcon
                    className={`size-6  ${
                      gameStats?.in_wishlist
                        ? 'text-sky-300 hover:text-gray-600'
                        : 'text-gray-400'
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {gameStats?.in_wishlist
                    ? 'Rimuovi dalla wishlist'
                    : 'Aggiungi alla wishlist'}
                </p>
              </TooltipContent>
            </Tooltip>
          </form>
        )}
      </div>
    </>
  );
}
